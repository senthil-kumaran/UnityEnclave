import axios from 'axios'
import { showAlert, removeAlert } from './alert'

export const addHome = async data => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/homes',
            data
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Home added!')
            window.setTimeout(removeAlert, 2000)
            
            localStorage.clear()
            const homeId = res.data.data.home._id
            let addHomeButton = document.querySelector('.addHomeBtn')
            addHomeButton.setAttribute('data-id', homeId)
            location.assign(`/addHome/page3/${homeId}`)
        }  
    } catch(err) {
        const error = (err.response.data.data.message.errorMessage).split('.')[0]
        showAlert('failed', error)
        window.setTimeout(removeAlert, 3500)
    }
}

export const updateHome = async (form, homeId) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/homes/${homeId}`,
            data: form
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Home updated!')
            window.setTimeout(removeAlert, 2000)
            window.setTimeout(() => {
                location.assign('/allHomes')
            }, 1000)
        }  
    } catch(err) {
        const error = (err.response.data.data.message.errorMessage).split('.')[0]
        showAlert('failed', error)
        window.setTimeout(removeAlert, 3500)
    }
}

export const deleteHome = async homeId => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/homes/${homeId}`,
        }) 

        showAlert('success', 'Home deleted!')
        window.setTimeout(removeAlert, 2000)
        window.setTimeout(() => {
            location.assign('/allHomes')
        }, 1000)  
         
    } catch(err) {
        const error = (err.response.data.data.message.errorMessage).split('.')[0]
        showAlert('failed', error)
        window.setTimeout(removeAlert, 3500)
    }
}

export const uploadHomeImages = async homeId => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/homes/upload-home-images/${homeId}`,
        })

        showAlert('success', 'Images added!')
        window.setTimeout(removeAlert, 2000)
        window.setTimeout(() => {
            location.assign('/allHomes')
        }, 1000)  
         
    } catch(err) {
        const error = (err.response.data.data.message.errorMessage).split('.')[0]
        showAlert('failed', error)
        window.setTimeout(removeAlert, 3500)
    }
}
