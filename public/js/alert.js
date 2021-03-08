export const removeAlert = () => {
    const child = document.querySelector('.alert')
    if(!child)
        return
    const parent = child.parentNode   
    parent.removeChild(child)     
} 

export const showAlert = (status, message) => {
    if(status === 'success') {
        document.querySelector('body').insertAdjacentHTML('afterbegin', 
        `<div class="alert alert-success">${message}</div>`) 
    } else if(status === 'failed') {
        document.querySelector('body').insertAdjacentHTML('afterbegin', 
        `<div class="alert alert-failed">${message}</div>`)
    }
}