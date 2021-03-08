const videoButton = document.getElementById('video--btn')
const galleryButton = document.getElementById('gallery--btn')

if(videoButton && galleryButton) {
    const gallery = document.querySelector('.gallery__section')
    const videoPlayer = document.querySelector('.media__section')
    
    galleryButton.addEventListener('click', e => {
        e.preventDefault()
        videoPlayer.style.display = 'none'
        gallery.style.display = 'block'
    })

    videoButton.addEventListener('click', e => {
        e.preventDefault()
        gallery.style.display = 'none'
        videoPlayer.style.display = 'block'
    })
}