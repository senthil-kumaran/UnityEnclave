import axios from 'axios'
import { showAlert, removeAlert } from './alert'

export const updateUser = async data => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Profile updated')
            window.setTimeout(removeAlert, 2000)
            
            window.setTimeout(() => {
                location.assign('/settings')
            }, 1000)
        }

    } catch(err) {
        showAlert('failed', err.response.data.data.message.errorMessage)
        window.setTimeout(removeAlert, 2000)
    }
}