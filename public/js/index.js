import '@babel/polyfill'
import { login, logout } from './login'
import { signup } from './signup'
import { addHome, updateHome, deleteHome, uploadHomeImages } from './home'
import { account, passwordChange, deleteAccount } from './account'
import { forgotPassword, resetPassword } from './newAuthProtocol'
import { updateUser } from './updateUser'
import { deleteImage } from './gallery'
import { showLoader, hideLoader } from './loader'

// Navbar login button 
const loginBtn = document.querySelector('.login')
if(loginBtn) {
    loginBtn.addEventListener('click', e => {
        location.assign('/login')
    })
}

const form = document.querySelector('.form--login')
if(form) {
    form.addEventListener('submit', e => {
        e.preventDefault()
    
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
    
        login(email, password)
    })    
}

//Forgot paswword form
const forgotPasswordForm = document.querySelector('.form--forgotPassword')
if(forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async e => {
        e.preventDefault()
    
        const email = document.getElementById('email').value
        await forgotPassword({email})
    })    
}

//Reset paswword form
const resetPasswordForm = document.querySelector('.form--resetPassword')
if(resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', e => {
        e.preventDefault()
    
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value
        const token = document.getElementById('token').value
    
        resetPassword({password, confirmPassword, token})
    })    
}

const logoutBtn = document.querySelector('.logout')
if(logoutBtn) {
    logoutBtn.addEventListener('click', e => {
        logout()
    })
}

const accountIcon = document.querySelector('.account__nav')
if(accountIcon) {
    accountIcon.addEventListener('click', e => {
        account()
    })
}

//Sign Up
const signupForm = document.querySelector('.signupForm')
if(signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault()

        const firstName = document.getElementById('firstName').value
        const lastName = document.getElementById('lastName').value
        const phone1 = document.getElementById('phone1').value
        const phone2 = document.getElementById('phone2').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value
        const checkBox = document.getElementById('role')
        let role
        if(checkBox.checked)
            role = checkBox.value
        
        signup({firstName, lastName, phone1, phone2, email, password, confirmPassword, role})
    })
}

const addHomeBtn = document.querySelector('.addYourHome') 
if(addHomeBtn) {
    addHomeBtn.addEventListener('click', e => {
        location.assign('/addHome/page1')
    })
}

const addHomeForm1 = document.querySelector('.addHome__form--page1')
if(addHomeForm1) {
    addHomeForm1.addEventListener('submit', e => {
        e.preventDefault()

        localStorage.setItem('block', document.querySelector('.block').value)
        localStorage.setItem('flat', document.querySelector('.flat').value)
        localStorage.setItem('floor', document.querySelector('.floor').value)
        localStorage.setItem('rent', document.querySelector('.rent').value)
        localStorage.setItem('advance', document.querySelector('.advance').value)

        location.assign('/addHome/page2')
    })
}

const addHomeForm2 = document.querySelector('.addHome__form--page2')
if(addHomeForm2) {
    addHomeForm2.addEventListener('submit', async e => {
        e.preventDefault()

        const block = localStorage.getItem('block')
        const flatNumber = localStorage.getItem('flat')
        const floor = localStorage.getItem('floor')
        const rent = localStorage.getItem('rent')
        const advance = localStorage.getItem('advance')
        const bedRoom = document.getElementById('bedRoom').value
        const bathRoom = document.getElementById('bathRoom').value
        const family = document.getElementById('family').checked
        const food = document.getElementById('veg').checked
        const negotiable = document.getElementById('negotiable').checked
         
        const data = {block, flatNumber, floor, rent, advance, bedRoom, bathRoom, family, food, negotiable}

        await addHome(data)

        const addHomeButton = document.querySelector('.addHomeBtn')
        const homeId = addHomeButton.getAttribute('data-id')
    })
}

// Settings page - password change
const accountPasswordForm = document.querySelector('.account__password--form')
if(accountPasswordForm) {
    accountPasswordForm.addEventListener('submit', e => {
        e.preventDefault()

        const currentPassword = document.getElementById('current__password').value
        const newPassword = document.getElementById('new__password').value
        const confirmPassword = document.getElementById('confirm__password').value

        passwordChange({ currentPassword, newPassword, confirmPassword })
    })
}

// Profile edit form
const profileEditForm = document.querySelector('.form--profileEdit')
if(profileEditForm) {
    profileEditForm.addEventListener('submit', e => {
        e.preventDefault()

        const form = new FormData()

        form.append('firstName', document.getElementById('firstName').value)
        form.append('lastName', document.getElementById('lastName').value)
        form.append('phone1', document.getElementById('phone1').value)
        form.append('phone2', document.getElementById('phone2').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])

        const ownerCheckBox = document.getElementById('role')
        if(ownerCheckBox.checked)
            form.append('role', 'home_owner')
        else
            form.append('role', 'user')
            
        updateUser(form)
    })
}
 
// Edit home page-1
const editHomeForm1 = document.querySelector('.editHome__form--page1')
if(editHomeForm1) {
    editHomeForm1.addEventListener('submit', e => {
        e.preventDefault()
        
        localStorage.setItem('block', document.querySelector('.block').value)
        localStorage.setItem('flat', document.querySelector('.flat').value)
        localStorage.setItem('floor', document.querySelector('.floor').value)
        localStorage.setItem('rent', document.querySelector('.rent').value)
        localStorage.setItem('advance', document.querySelector('.advance').value)

        const btn = document.querySelector('.btn--next')
        const resourceUrl = btn.getAttribute('data-id')
        location.assign(resourceUrl)
    })
}

// Edit home page-2
const editHomeForm2 = document.querySelector('.editHome__form--page2')
if(editHomeForm2) {
    editHomeForm2.addEventListener('submit', async e => {
        e.preventDefault()

        const block = localStorage.getItem('block')
        const flatNumber = localStorage.getItem('flat')
        const floor = localStorage.getItem('floor')
        const rent = localStorage.getItem('rent')
        const advance = localStorage.getItem('advance')
        const bedRoom = document.getElementById('bedRoom').value
        const bathRoom = document.getElementById('bathRoom').value
        const family = document.getElementById('family').checked
        const food = document.getElementById('veg').checked
        const negotiable = document.getElementById('negotiable').checked

        const btn = document.querySelector('.btn')
        const homeId = btn.getAttribute('data-id')
         
        const data = {block, flatNumber, floor, rent, advance, bedRoom, bathRoom, family, food, negotiable}
        await updateHome(data, homeId)

        localStorage.clear()
    })
}

// Delete home
const deletePage = document.querySelector('.deletePage')
if(deletePage) {
    const homeDeleteButton = document.querySelector('.home__option--delete')
    if(homeDeleteButton) {
        homeDeleteButton.addEventListener('click', e => {
            const homeId = homeDeleteButton.getAttribute('data-id')
            deleteHome(homeId)
        })
    } 
    
    
    const userDeleteButton = document.querySelector('.user__option--delete')
    if(userDeleteButton) {
        userDeleteButton.addEventListener('click', e => {
            deleteAccount()
        })
    }
}

// GALLERY
const modal = document.querySelector('.modal')
const closeModalButton = document.querySelector('.btn--close')
const modalContentImage = document.getElementById('modal--image')
const homeImages = document.querySelectorAll('.home__image')

//Click events for home images 
if(homeImages) {
    homeImages.forEach(homeImage => {
        homeImage.addEventListener('click', openModal)
    });
}

//Click event for close button in the modal
if(closeModalButton) {
    closeModalButton.addEventListener('click', closeModal)
}
 
//Click event outside of modal
window.addEventListener('click', closeModalFromOutside)

function openModal(e) {
    modal.style.display = 'block'
    
    if(e.originalTarget)
        modalContentImage.src = e.originalTarget.src
    else 
        modalContentImage.src = e.target.attributes.src.nodeValue
}

function closeModal() {
    modal.style.display = 'none' 
}

function closeModalFromOutside(e) {
    if(e.target == modal) 
        modal.style.display = 'none'
}  
 
// Home image delete
const editGalleryContainer = document.querySelector('.home__images--container')
if(editGalleryContainer) {
    const deleteHomeImageButtons = document.querySelectorAll('.btn--delete')
    deleteHomeImageButtons.forEach(button => {
        button.addEventListener('click', async e => {
            const imageFileName = e.target.attributes.getNamedItem('data-id').nodeValue
            const homeId = editGalleryContainer.getAttribute('data-id')
            await deleteImage({ imageFileName, homeId })
        })
    })
}

//loader
//firefox have loader when user hits back.
const addImagesBtn = document.querySelector('.btn--loader')

if(addImagesBtn) {
    addImagesBtn.addEventListener('click', () => {
        showLoader()
        window.setTimeout(hideLoader, 10000)
    })
}