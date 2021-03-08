import axios from 'axios'

export const deleteImage = async (data) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/homes/deleteImage',
            data
        }) 
         
        location.reload(true)
    } catch(err) {
        
    }
}