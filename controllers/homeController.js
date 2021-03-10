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
    if (!req.files)
        return next()

    req.body.images = []  

        await Promise.all(req.files.map(async (image, i) => {
            const fileName = `home-${req.params.id}-${Date.now()}-${i+1}.jpeg`
    
            await sharp(image.buffer)
                .rotate()
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

exports.getAllHomes = catchAsync(async (req, res, next) => {
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

exports.addHome = catchAsync(async (req, res, next) => {
    const { userId, flatNumber, block, floor, bedRoom, bathRoom, rent, advance, family, food, negotiable } = req.body

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
    const homeId = req.params.id

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

    const home = await homeModel.findById(homeId)

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

    res.redirect('/allHomes')
})
 
exports.deleteHomeImagesInFileSystem = catchAsync(async (req, res, next) => {
    const { imageFileName } = req.body
    const filePath = `${__dirname}/../public/img/homes/${imageFileName}`
    await fs.unlink(filePath)

    next()
})

exports.deleteHomeImagesInDB = catchAsync(async (req, res, next) => {
    const { imageFileName, homeId } = req.body
    let home = await homeModel.findById(homeId)

    const newListOfImages = home.images.filter(image => image !== imageFileName )

    home.images = newListOfImages

    await home.save()

    res.status(204).json({
        status: 'success',
        data: null
    })
})