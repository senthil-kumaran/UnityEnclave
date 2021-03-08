const navButton = document.querySelector('.nav--button')

if(navButton) {
    navButton.addEventListener('click', e => {
        const dropDownContent = document.querySelector('.dropdown--content')
        dropDownContent.classList.toggle('drop')
    })
}

window.addEventListener('click', e => {
    if(e.target.className !== 'nav--button') {
        const dropDownContent = document.querySelector('.dropdown--content')
        dropDownContent.classList.remove('drop')
    }
})