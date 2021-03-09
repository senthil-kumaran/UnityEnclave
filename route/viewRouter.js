const express = require('express')
const cors = require('cors')

const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

router.use(authController.isLoggedIn)

//CORS
//ACCESS-CONTROL-ALLOW-ORIGIN
router.get('/', cors({
    origin: ['https://www.google.com/maps', 'https://www.youtube.com/']
}), viewController.overview)

router.get('/', viewController.overview)
router.get('/signup', viewController.signup) 
router.get('/login', viewController.login) 
router.get('/forget-password', viewController.forgotPassword) 
router.get('/resetPasswordForm', viewController.resetPassword) 
router.get('/allHomes', viewController.allHomes)  
router.get('/addHome/page1', authController.protectRoute, viewController.addHomePage1) 
router.get('/addHome/page2', authController.protectRoute, viewController.addHomePage2) 
router.get('/addHome/page3/:id', authController.protectRoute, viewController.addHomePage3) 

router.get('/settings', authController.protectRoute, userController.populateHomesByUserId, viewController.settings) 
router.get('/home/:id', authController.protectRoute, viewController.homeProfile)
router.get('/edit-profile', authController.protectRoute, viewController.userProfile)
router.get('/edit-home/page1/:id', authController.protectRoute, viewController.editHomePage1)
router.get('/edit-home/page2/:id', authController.protectRoute, viewController.editHomePage2)
router.get('/delete/home/:id', authController.protectRoute, viewController.deleteHome)
router.get('/delete/me', authController.protectRoute, viewController.deleteUser)
router.get('/error', authController.protectRoute, viewController.notFound)
router.get('/edit-home/images/:id', authController.protectRoute, viewController.editHomeGallery)

router.get('/statistics', authController.protectRoute, authController.restrictTo('super_user'), viewController.statistics)  
router.get('/users', authController.protectRoute, authController.restrictTo('super_user'), viewController.getAllUsers)  

module.exports = router   