const state = {
    numCells: (600/40) * (600/40),
    cells: [],
    shipPosition: 217,
    alienPositions: [
        3, 4, 5, 6, 7, 8, 9, 10,11,
        18,19,20,21,22,23,24,25,26,
        33,34,35,36,37,38,39,40,41,
        48,49,50,51,52,53,54,55,56
    ],
    gameover: false,
    score: 0,
}

const setupGame = (element) => {
    state.element = element
    // draw the grid
    drawGrid()

    // draw the spaceship
    drawShip()

    // draw the aliens
    drawAliens()

    // add the instructions and the score
    drawScoreboard()

}

const drawGrid = () => {

    // create containing element
    const grid = document.createElement('div')
    grid.classList.add('grid')

    // create a LOT of cells - 15x15
    for (let  i=0; i<state.numCells; i++) {
        const cell = document.createElement('div')
        grid.append(cell)
        state.cells.push(cell)
    }

    // append the cells to the containing element and the containing element to the app
    state.element.append(grid)
}

const drawShip = () => {
    state.cells[state.shipPosition].classList.add('ship')
}


const controlShip = (event) => {
    if (state.gameover) return
    if (event.code === 'ArrowLeft') {
        moveShip('left')

    } else if (event.code === 'ArrowRight') {
        moveShip('right')

    } else if (event.code === 'Space') {
        fire()

    }
}

const moveShip = (direction) => {
    // remove image form current
    state.cells[state.shipPosition].classList.remove('ship')
    
    // figure out the delta
    if (direction === 'left' && state.shipPosition % 15 !== 0) {
        state.shipPosition--
    } else if (direction === 'right' && state.shipPosition % 15 !== 14) {
        state.shipPosition++
    }

    // add image to new position
    state.cells[state.shipPosition].classList.add('ship')
}

const fire = () => {
    // use interval: run code after a specified time
    let interval;
    // laser starts at ship position
    let laserPosition = state.shipPosition
    interval = setInterval(() => {
        // remove laser image
        state.cells[laserPosition].classList.remove('laser')

        // move the laser
        laserPosition-=15

        // check if we in bounds
        if (laserPosition < 0) {
            clearInterval(interval)
            return
        }

        // fire alien
        //clear interval, remove alien image, remove alien from the position, boom image, set timeout for boom image
        if (state.alienPositions.includes(laserPosition)) {
            clearInterval(interval)
            state.alienPositions.splice(state.alienPositions.indexOf(laserPosition), 1)
            state.cells[laserPosition].classList.remove('alien', 'laser')
            state.cells[laserPosition].classList.add('hit')
            state.score++
            state.scoreElement.innerText = state.score
            setTimeout(() => {
                state.cells[laserPosition].classList.remove('hit')
            }, 200)
            return
        }

        // add the laser image
        state.cells[laserPosition].classList.add('laser')

    }, 100)
}

const drawAliens = () => {
    // add aliens to the grid
    state.cells.forEach((cell, index) => {
        if (cell.classList.contains('alien')) {
            cell.classList.remove('alien')
        }

        if (state.alienPositions.includes(index)) {
            cell.classList.add('alien')
        }
    })
}

const play = () => {
    // move the aliens
    let interval
    let direction = 'right'
    interval = setInterval (() => {
        let movement
        if (direction === 'right') {
            if (atEdge('right')) {
                movement = 15 - 1
                direction = 'left'
            } else {
                movement = 1
            }         
        } else if (direction === 'left') {
            if (atEdge('left')) {
                movement = 15 + 1
                direction = 'right'
            } else {
                movement = -1
            }             
        }

        state.alienPositions = state.alienPositions.map(position => position + movement)
        drawAliens()
        checkGameState(interval)
    }, 300)
    //set up the ship controls
    window.addEventListener('keydown', controlShip)

}

const atEdge = (side) => {
    if  (side === 'left') {
        return state.alienPositions.some(position => position % 15 === 0)
    } else if (side === 'right') {
        return state.alienPositions.some(position => position % 15 === 14)
    }
}

const checkGameState = (interval) => {
    // aliens at bottom

    // all aliens dead
    if (state.alienPositions.length === 0) {
        state.gameover = true
        clearInterval(interval)
        drawMessage("HUMAN WINS!")
    } else if (state.alienPositions.some(position => position >= state.shipPosition)) {
        clearInterval(interval)
        state.gameover = true
        state.cells[state.shipPosition].classList.remove('ship')
        state.cells[state.shipPosition].classList.remove('hit')
        drawMessage("GAME OVER!")
    }
}

const drawMessage = (message) => {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')

    const h1 = document.createElement('h1')
    h1.innerText = message
    messageElement.append(h1)

    state.element.append(messageElement)
}

const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press SPACE to shoot.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2, heading3)
  
    state.scoreElement = scoreElement
    state.element.append(scoreboard)
}

const  appElement = document.querySelector('.app')

setupGame(appElement)

play()