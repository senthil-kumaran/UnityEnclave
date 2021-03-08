import axios from 'axios'
import { showAlert, removeAlert } from './alert'

export const login = async (email, password) => {
    try {
        // axios 
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login', 
            data: {
                email,
                password       
            }
        })

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!')
            window.setTimeout(removeAlert, 2000)
            
            window.setTimeout(() => {
                location.assign('/allHomes')
            }, 1000)
        } 

    } catch(err) {
        showAlert('failed', err.response.data.data.message.errorMessage)
        window.setTimeout(removeAlert, 2000)
    }  
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        })

        if(res.data.status === 'success') {
            location.assign('/allHomes')
        }

    } catch(err) {

    }
}