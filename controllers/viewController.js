const app = require('../app')
const homeModel = require('../model/homeModel')
const userModel = require('../model/userModel')
const catchAsync = require('../utils/catchAsync')

exports.overview = (req, res) => {
    res.status(200).render('overview', {
        page: 'Landing page',
    })
}

exports.signup = (req, res) => {
    res.status(200).render('signup', {
        page: 'Sign up page'
    }) 
}

exports.login = (req, res) => {
    res.status(200).render('login', {
        page: 'Login'
    })
}

exports.forgotPassword = (req, res) => {
    res.status(200).render('forgetPassword', {
        page: 'Forgot password'
    })
}

exports.resetPassword = (req, res) => {
    res.status(200).render('resetPassword', {
        page: 'Reset password'
    })
}

exports.allHomes = catchAsync(async (req, res) => {
    console.log('In all homes')
    
    const homes = await homeModel.find({ active: true })
    // const homes = await homeModel.find()
    console.log(homes)

    res.status(200).render('getAllHomes', {
        page: 'Homes',
        homes,
    })
})

exports.addHomePage1 = catchAsync(async (req, res) => {
    console.log('In add home page 1')
    
    res.status(200).render('addHomePage1', {
        page: 'Add Home | Step 1',
    }) 
})

exports.addHomePage2 = catchAsync(async (req, res) => {
    console.log('In add home page 2')

    res.status(200).render('addHomePage2', {
        page: 'Add Home | Step 2',
    })
})

exports.addHomePage3 = catchAsync(async (req, res) => {
    console.log('In add home page 3')
    const homeId = req.params.id

    res.status(200).render('addHomePage3', {
        page: 'Add Home Images | Step 3',
        homeId
    })
})

exports.editHomePage1 = catchAsync(async (req, res) => {
    console.log('In edit home page 1')
    const home = await homeModel.findById(req.params.id)
    
    res.status(200).render('editHomePage1', {
        page: 'Edit Home | Step 1',
        home,
    })
})

exports.editHomePage2 = catchAsync(async (req, res) => {
    console.log('In edit home page 2')
    const home = await homeModel.findById(req.params.id)

    res.status(200).render('editHomePage2', {
        page: 'Edit Home | Step 2',
        home,
    })
})

exports.editHomeGallery = catchAsync(async (req, res) => {
    console.log('In edit home gallery')
    const home = await homeModel.findById(req.params.id)
    console.log({home})
    res.status(200).render('editHomeGallery', {
        page: 'Edit Home Images',
        home,
    })
})

exports.deleteHome = catchAsync(async (req, res) => {
    console.log('In delete home')
    const homeId = req.params.id

    res.status(200).render('deletePage', {
        page: 'Delete Home',
        homeId,
    })
})

exports.deleteUser = catchAsync(async (req, res) => { 
    console.log('In delete user')

    res.status(200).render('deletePage', {
        page: 'Delete User',
    })
})

exports.userProfile = catchAsync(async (req, res) => {
    console.log('In user profile')
    // const user = await userModel.findById(req.user.id)
    res.status(200).render('userProfile', {
        page: 'Edit profile',
    })
})

exports.homeProfile = catchAsync(async (req, res) => {
    console.log('In Home profile')
  
    const home = await homeModel.findById(req.params.id)
    let owner = false, admin = false, superUser = false
    if(req.user.id === home.userId.id) {
        owner = true
    }
    
    if(req.user.role === 'admin')
        admin = true
    if(req.user.role === 'super_user')
    superUser = true

    res.status(200).render('homeProfile', {  
        page: 'Your Home',
        home,
        owner,
        admin,
        superUser
    }) 
})

exports.settings = (req, res) => {
    res.status(200).render('settings'), {
        page: 'Settings',
    }
}

exports.updateMe = catchAsync(async (req, res, next) => {
    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    })

    res.status(200).render('account', {
        page: 'Settings',
        user: updatedUser   
    })
}) 

exports.notFound = catchAsync(async (req, res) => {
    console.log('In error page')    

    res.status(200).render('error', {
        page: 'Invalid request',
        errorCode: req.errorInfo.errorCode,
        message: req.errorInfo.message
    })
})

exports.statistics = catchAsync(async (req, res) => {
    console.log('In statistics')
    
    const homes = await homeModel.find({ active: false })
    console.log({homes})

    res.status(200).render('getAllHomes', {
        page: 'Homes',
        homes,
    })
})

exports.getAllUsers = catchAsync(async (req, res) => {
    console.log('In get all users')
    
    const homes = await homeModel.find()
    console.log(homes)

    res.status(200).render('getAllUsers', {
        page: 'Homes',
        homes,
    })
})