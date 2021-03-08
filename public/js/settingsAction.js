const collapsible = document.querySelectorAll('.collapsible')

if(collapsible) {
    collapsible.forEach(collap => {
        collap.addEventListener('click', e => { 
            e.preventDefault()
            
            collap.classList.toggle('.active') 

            const contentToExpand = collap.nextElementSibling
            const support = document.querySelector('.support')

            if(contentToExpand.style.maxHeight) {
                contentToExpand.style.maxHeight = null
                if(e.target.classList.contains('password__container'))
                    support.style.marginTop = '-26px'
            }
            else {
                contentToExpand.style.maxHeight = contentToExpand.scrollHeight + 'px'
                if(e.target.classList.contains('password__container'))
                    support.style.marginTop = 0 
            }
        })  
    }); 
} 