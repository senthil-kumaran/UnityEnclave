const multer = require('multer')
const sharp = require('sharp')
const homeModel = require('../model/homeModel')

const userModel = require('../model/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/img/users')
//     },
//     filename: (req, file, callback) => {
//         const ext = file.mimetype.split('/')[1]
//         callback(null, `${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, callback) => {
    if(file.mimetype.startsWith('image'))
        callback(null, true)
    else
        callback(new AppError('The uploaded file is not an image! Please upload a image file', 401))
}

exports.resizeUserImage = catchAsync(async (req, res, next) => {
    if(!req.file)
        return next()

    req.file.filename = `${req.user.id}-${Date.now()}.jpeg`
        
    await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/users/${req.file.filename}`)

    next()
})

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadImage = upload.single('photo')

const filterObject = (payload, ...allowedFields) => {
    const keys = Object.keys(payload)

    let fieldsToUpdate = {}
    keys.forEach(el => {
        if (allowedFields.includes(el))
           fieldsToUpdate[el] = payload[el]
        })

    return fieldsToUpdate
}

exports.updateMe = catchAsync(async (req, res, next) => {
    console.log('In updateMe')
        
      if (req.body.password || req.body.confirmPassword)
        return next(new AppError('Password update is not supported here. Please check the updatePassword route', 400))

      const updateData = filterObject(req.body, "firstName", "lastName", "email", "phone1", "phone2")
      
      if(req.file)
        updateData.photo = req.file.filename

      const updatedUser = await userModel.findByIdAndUpdate(req.user.id, updateData, {
          new: true,
          runValidators: true
        })

        // sendToken(res, 201, updatedUser, 'Updated successfully')
        res.status(201).json({
            status: 'success',   
            data: {
                message: 'Updated successfully',
                updatedUser
            }
        })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
        console.log('In deleteMe')
        const userId = req.user.id

        await userModel.findByIdAndUpdate(userId, { active: false })
        
        const homes = await homeModel.find({ userId }).select('+active')
        console.log(homes)
        homes.forEach(async home => {
            home.active = false
            await home.save()
        });

        res.locals.user = undefined
        res.cookie('jwt', 'logout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        })

        res.status(204).json({
            status: 'success',
            data: {
                message: 'Deleted successfully'
            }
        })
})

exports.populateHomesByUserId = catchAsync(async (req, res, next) => {
    console.log('In populateHomesByUserId')
    const userId = req.user.id

    const homes = await homeModel.find({
        userId, 
        active: true
    })

    res.locals.homes = homes
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         homes
    //     }
    // })
    next() 
})