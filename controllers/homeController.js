const fs = require('fs/promises')
const path = require('path')

const multer = require('multer')
const sharp = require('sharp')

const homeModel = require('../model/homeModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image'))
        callback(null, true)
    else
        callback(new AppError('The uploaded file is not an image! Please upload a image file', 401))
}

exports.resizeHomeImage = catchAsync(async (req, res, next) => {
    console.log('In resize Img')
    console.log(req.files)
    console.log(req.file)
    
    if (!req.files)
        return next()

    req.body.images = []  // .body - IMP

        await Promise.all(req.files.map(async (image, i) => {
            const fileName = `home-${req.params.id}-${Date.now()}-${i+1}.jpeg`
    
            await sharp(image.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/homes/${fileName}`) 
            
            req.body.images.push(fileName) 
        }));

    next()
})

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadHomeImages = upload.array('images', 15)
// exports.uploadHomeImages = upload.single('images')

exports.getAllHomes = catchAsync(async (req, res, next) => {
    console.log('In getAllHomes')
    const homes = await homeModel.find({ active: true })

    res.status(200).json({
        status: 'success',
        data: {
            homes
        }
    })
})

exports.setUserId = catchAsync(async (req, res, next) => {
    if (!req.body.user) 
        req.body.userId = req.user.id

    next()
})

// const isHomePresent = catchAsync(async (block, flatnumber) => {
//     console.log('In ishomepresent')
//     const doorNumber = block + flatnumber
//     return await homeModel.find({ doorNumber: doorNumber })
   
// })

exports.addHome = catchAsync(async (req, res, next) => {
    console.log('In addHome')
    const { userId, flatNumber, block, floor, bedRoom, bathRoom, rent, advance, family, food, negotiable } = req.body
    
    // const alreadyPresent = await isHomePresent(block, flatNumber)
    // console.log({alreadyPresent})
    
    // if(alreadyPresent) {
    //     return next(new AppError('Home already exists', 400))
    // }

    const home = await homeModel.create({
        userId,
        block,
        flatNumber,
        floor,
        rent,
        advance,
        bedRoom,
        bathRoom,
        family,
        food,
        negotiable
    }) 

    res.status(201).json({
        status: 'success',
        data: {
            home
        } 
    })
})

exports.getHome = catchAsync(async (req, res, next) => {
    console.log('In Get Home')
    const homeId = req.params.id

    const home = await homeModel.findById(homeId)
    
    res.status(200).json({
        status: 'success',
        data: {
            home
        }
    })
})
 
exports.updateHome = catchAsync(async (req, res, next) => { 
    const homeId = req.params.id

    const home = await homeModel.findByIdAndUpdate(homeId, req.body, {
        new: true,
        runValidators: true
    })

    if (!home)
        return next(new AppError('No such home exists', 404))

    res.status(201).json({
        status: 'success',
        data: {
            message: 'Updated successfully',
            home
        }
    })

})

exports.deleteHome = catchAsync(async (req, res, next) => {
    console.log('In deleteHome')
    const homeId = req.params.id

    // const home = await homeModel.findByIdAndDelete(homeId) //returns the matched document
    const home = await homeModel.findByIdAndUpdate(homeId, { active: false })

    if (!home)
        return next(new AppError('No such home exists', 404))

    res.status(204).json({
        status: 'success',
        data: {
            message: 'Deleted successfully'
        }
    })
})

exports.uploadHomeImagesMiddleware = catchAsync(async (req, res, next) => {
    const homeId = req.params.id
    const newImages = req.body.images
    console.log('HERE')
    console.log(newImages)

    const home = await homeModel.findById(homeId)
    // const home = await homeModel.findByIdAndUpdate(homeId, { images }, {
    //     new: true,
    //     runValidators: true
    // })

    if (!home)
        return next(new AppError('No such home exists', 404))

    let images = home.images

    newImages.forEach(image => {
        images.push(image)
    }); 

    if(images.length >= 15)
        return next(new AppError('Maximum of 15 images can be uploaded', 400))

    await homeModel.findByIdAndUpdate(homeId, { images }, {
        new: true, 
        runValidators: true
    })

    // next()
    res.redirect('/allHomes')
})
 
exports.deleteHomeImagesInFileSystem = catchAsync(async (req, res, next) => {
    console.log('In delete home images')
    const { imageFileName } = req.body
    const filePath = `${__dirname}/../public/img/homes/${imageFileName}`
    await fs.unlink(filePath)

    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // })
    next()
})

exports.deleteHomeImagesInDB = catchAsync(async (req, res, next) => {
    console.log('In delete home images in DB')

    const { imageFileName, homeId } = req.body
    console.log({homeId})
    let home = await homeModel.findById(homeId)

    const newListOfImages = home.images.filter(image => image !== imageFileName )

    home.images = newListOfImages

    await home.save()

    res.status(204).json({
        status: 'success',
        data: null
    })
})