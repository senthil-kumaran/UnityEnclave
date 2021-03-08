import axios from 'axios'
import catchAsync from '../../utils/catchAsync'
import { showAlert, removeAlert } from './alert'

export const signup = catchAsync(async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/signup',
            data
        })

        showAlert('success', 'Sending welcome mail')

        if(res.data.status === 'success') {
            removeAlert()
            showAlert('success', 'Logging in!')
            window.setTimeout(removeAlert ,2000)

            window.setTimeout(() => {
                location.assign('/allHomes')
            } ,1000)
        }
    } catch(err) { 
        removeAlert()
        const errMsg = (err.response.data.data.message.errorMessage).split('.')
        showAlert('failed', errMsg[0])
        window.setTimeout(removeAlert ,2000)
    }
})