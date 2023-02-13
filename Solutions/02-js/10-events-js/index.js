// Get the button element
const button = document.querySelector('#btn')
console.log(button)

function changeStyle() {
    const helloDiv = document.querySelector('.hello')
    helloDiv.classList.add('red', 'bold', 'big', 'font')
}

// what to do when the specified event happens
button.addEventListener('click', changeStyle)