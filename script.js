const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
let snake = [ {x:150,y:150},{x:140,y:150},{x:130,y:150},{x:120,y:150},{x:110,y:150},];
let dx = 10;   // Horizontal Velocity
let dy = 0; // Vertical Velocity
let foodX = 0;
let foodY = 0;
let score = 0;
let changingDirection = false;
ctx.strokeRect(0, 0, 300, 300);


function drawSnakePart(snakePart){ 
    ctx.fillStyle = 'lightgreen';
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x,snakePart.y,10,10);
    ctx.strokeRect(snakePart.x,snakePart.y,10,10);
}

function drawSnake(){
    snake.forEach(drawSnakePart);
}

function advanceSnake(){
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if(didEatFood){
        score+=10;
        document.getElementById('score').innerHTML = score;
        createFood();
    }else{
        snake.pop();
    }   
}

function clearCanvas(){
    ctx.fillStyle = "white";
    ctx.strokestyle = "black";
    ctx.fillRect(0,0,gameCanvas.clientWidth,gameCanvas.clientHeight);
    ctx.strokeRect(0,0,gameCanvas.clientWidth,gameCanvas.clientHeight);
}


function main(){
    if(didGameEnd()) return;
    setTimeout(function onTick(){
        changingDirection = false;

        clearCanvas();

        drawFood();
    
        advanceSnake();
    
        drawSnake();
    
        main();
    },100);
}

function changeDirection(event){
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if(changingDirection) return;

    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;

    if(keyPressed === LEFT_KEY  && !goingRight){ dx =-10; dy = 0;}
    if(keyPressed === UP_KEY    && !goingDown) { dx =0; dy = -10;}
    if(keyPressed === RIGHT_KEY && !goingLeft) { dx =10; dy = 0;}
    if(keyPressed === DOWN_KEY  && !goingUp)   { dx =0; dy = 10;}
}

function randomTen(min,max){
    return Math.round((Math.random()*(max-min)+min)/10)*10;
}
function createFood(){
    foodX = randomTen(0, gameCanvas.clientWidth-10);
    foodY = randomTen(0, gameCanvas.clientHeight-10);

    snake.forEach(function isFoodOnSnake(part){
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if(foodIsOnSnake){
            createFood();
        }
    });
}

function drawFood(){
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX,foodY,10,10);
    ctx.strokeRect(foodX,foodY,10,10);
}

function didGameEnd(){
    for(let i=4;i<snake.length;i++){
        const didCollide = snake[i].x === snake[0].x && snake.y === snake[0].y
        if(didCollide) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.clientWidth - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.clientHeight - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

createFood();
document.addEventListener("keydown",changeDirection);
main();