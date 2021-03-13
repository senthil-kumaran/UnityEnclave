const loader = document.querySelector('.loader')
const body = document.querySelector('body')

export const showLoader = () => {
    body.style.opacity = .7
    loader.style.display = 'block'
}
  
export const hideLoader = () => {
    body.style.opacity = 1
    loader.style.display = 'none'
}