import axios from 'axios'
import { showAlert, removeAlert } from './alert'

export const account = () => {
    location.assign('/settings')
} 

export const passwordChange = async data => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updatePassword',
            data
        })
 
        if(res.data.status === 'success') {
            showAlert('success', 'Password changed')
            window.setTimeout(removeAlert, 2000)
        }

    } catch(err) {
        const errorFromResponse = err.response.data.data
        if(!errorFromResponse)
            showAlert('failed', 'Password don\'t match')
        else
            showAlert('failed', errorFromResponse.message.errorMessage)
        window.setTimeout(removeAlert, 2000) 
    }
} 

export const deleteAccount = async () => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/users/deleteMe',
        })

        showAlert('success', 'Account deleted')
        window.setTimeout(removeAlert, 2000)
        
        window.setTimeout(() => {
            location.assign('/allHomes')
        }, 1000)

    } catch(err) {
        showAlert('failed', err.response.data.data.message.errorMessage)
        window.setTimeout(removeAlert, 3000) 
        window.setTimeout(() => {
            location.assign('/settings')
        }, 1000)
    }
} 