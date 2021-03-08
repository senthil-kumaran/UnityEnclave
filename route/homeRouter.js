const express = require('express')
const homeController = require('../controllers/homeController')
const authController = require('../controllers/authController')
const viewController = require('../controllers/viewController')

const router = express.Router()

router.route('/')
.get(authController.protectRoute, homeController.getAllHomes)
.post(authController.protectRoute, authController.restrictTo('home_owner', 'admin', 'super_user'), homeController.setUserId, homeController.addHome) 

router.route('/deleteImage')
.delete(authController.protectRoute, homeController.deleteHomeImagesInFileSystem, homeController.deleteHomeImagesInDB) 
     
router.route('/:id')
.get(authController.protectRoute, authController.restrictTo('home_owner', 'admin', 'super_user'), homeController.getHome, viewController.addHomePage1)
.patch(authController.protectRoute, authController.restrictTo('home_owner', 'admin', 'super_user'), homeController.updateHome)
.delete(authController.protectRoute, authController.restrictTo('home_owner', 'admin', 'super_user'), homeController.deleteHome)

router.route('/upload-home-images/:id')
.post(authController.protectRoute, authController.restrictTo('home_owner', 'admin', 'super_user'), homeController.uploadHomeImages, homeController.resizeHomeImage, homeController.uploadHomeImagesMiddleware)
 
module.exports = router