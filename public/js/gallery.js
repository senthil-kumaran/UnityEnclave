import axios from 'axios'

export const deleteImage = async (data) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/v1/homes/deleteImage',
            data
        }) 
         
        location.reload(true)
    } catch(err) {
        
    }
}