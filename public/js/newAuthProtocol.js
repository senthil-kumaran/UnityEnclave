import axios from 'axios'
import { showAlert, removeAlert } from './alert'

export const forgotPassword = async data => {
    try {
        const res = await axios({ 
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data
        })
   
        if(res.data.status === 'success') {
            location.assign('/resetPasswordForm')
        }
        
    } catch(err) {
        showAlert('failed', err.response.data.data.message.errorMessage)
        window.setTimeout(removeAlert, 2000)
    }
}

export const resetPassword = async data => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/resetPassword',
            data
        })

        if(res.data.status === 'success') {
            location.assign('/login')
        }
        
    } catch(err) {
        showAlert('failed', err.response.data.data.message.errorMessage)
        window.setTimeout(removeAlert, 2000)
    }
}