const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const audio = new Audio("../assets/beep.mp3")
const lose = new Audio("../assets/lose.mp3")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const btn = document.querySelector(".btn-play")


const size = 30
let snake = [
    {x: 270, y: 270},
]

let direction, loopId

const incrementScore = () => {
    score.innerText = +score.innerText + 1 
}

const randomNumber = (min, max) => Math.round( Math.random() * (max - min) + min)

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30 ) * 30
}

const randomColor = () => {
    const red = randomNumber(80, 255)
    const green = randomNumber(80, 255)
    const blue = randomNumber(80, 255)
    return `rgb(${red}, ${green}, ${blue})`
}

const food = {x: randomPosition(), y: randomPosition(), color: randomColor()}

const drawFood = () => {
    const { x, y, color } = food
    ctx.shadowColor = color
    ctx.shadowBlur = 40
    ctx.fillStyle = color
    ctx.fillRect( x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "white"
    snake.forEach((position, index) => {
        if(index == snake.length - 1){ 
            ctx.fillStyle = "white"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length - 1]

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }

    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }



    snake.shift()

}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkFood = () => {
    const head = snake[snake.length - 1]
    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
             x = randomPosition()
             y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()

    }
}

const checkColision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
    const neckIndex = snake.length - 2
    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    if(wallColision || selfColision){
        direction = undefined
        menu.style.display = "flex"
        finalScore.innerText = score.innerText
        canvas.style.filter = "blur(2px)"
        lose.play()

    }

}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkFood()
    checkColision()

    loopId = setTimeout(() =>{
        gameLoop()
    }, 150)
}

gameLoop()


document.addEventListener("keydown",({ key }) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
})

btn.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    snake = [{x: 270, y: 270}]
})