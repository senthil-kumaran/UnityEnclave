import axios from 'axios'
import catchAsync from '../../utils/catchAsync'

export const updateData = catchAsync(async (data, type) => { 
    try {
        const url = (type === 'password')? 
        'http://127.0.0.1:8000/api/v1/users/updatePassword' : 
        'http://127.0.0.1:8000/api/v1/users/updateMe'

        const res = await axios({
            method: 'PATCH',
            url, 
            data
        })
    } catch(err) {
        console.log(err)
    } 
})