const express = require('express')

const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.logout)
router.route('/updatePassword').patch(authController.protectRoute, authController.updatePassword)

router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword').patch(authController.resetPassword)


router.route('/updateMe').patch(authController.protectRoute, 
userController.uploadImage, userController.resizeUserImage, userController.updateMe)
router.route('/deleteMe').delete(authController.protectRoute, userController.deleteMe)
    
router.route('/myHomes').get(authController.protectRoute, userController.populateHomesByUserId)

module.exports = router