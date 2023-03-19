const board_border = 'black';
const board_background = 'white';
const snake_col = 'lightblue';
const snake_border = 'darkblue';

//to create a horizontal snake in the middle of the canvas, at (400, 400), we list the co-ordinate of each body part of the snake
    //the number of coordinates in the object will be equal to the length of the snake
    //first coordinate represents the snake's head
let snake = [ {x: 250, y: 250}, {x: 240, y: 250}, {x: 230, y: 250}]

//horizontal velocity
let dx = 10;
let dy = 0;

//get the canvas element
const snakeboard = document.getElementById('gameCanvas');
//return a two dimensional drawing context
const snakeboard_ctx = gameCanvas.getContext('2d');

//start the game
main();

//main function called repeatedly to keep the game running
    //to move the snake how we want, we can add a slight delay between each call with setTimeout
    //we also need to make sure to call drawSnake every time we call move_Snake, as shown below
        //if we don't, we won't be able to see the intermediate steps that show the snake moving
function main() {
    setTimeout(function onTick() {
        clearCanvas();
        move_snake();
        drawSnake();
        //call main again
        main();
    }, 100)
}

//draw a border around the canvas
function clearCanvas() {
    //set the color to fill the drawing
    snakeboard_ctx.fillStyle = board_background
    //set the color for the border of the canvas
    snakeboard_ctx.strokeStyle = board_border
    //draw a 'filled' rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.clientWidth, snakeboard.height);
    //draw a 'border' around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.clientWidth, snakeboard.height);
}

//function that prints the parts
function drawSnake() {
    snake.forEach(drawSnakePart);
}

//to display the snake on the canvas, we can write a function to draw a rectangle for each pair of coordinates
function drawSnakePart(snakePart) {
    //set the color of the snake part
    snakeboard_ctx.fillStyle = snake_col;
    //set the border color of the snake part
    snakeboard_ctx.strokeStyle = snake_border;
    //draw a 'filled' rectangle to represent the snake part at the coordinates the part is located
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    //draw a border around the snake part
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}


//making the snake move automatically
    //to make the snake move one step (10px) to the right, we can increase the x-coordinate of every part of the snake by 10px (dx = +10)
    //to make the snake move one step to the left, we would decrease the x-coordinate of every part of the snake by 10px (dx = -10)
    //vertical directions will be determined by dy (vertical velocity of the snake)
function move_snake() {
    //create a new head for the snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // add the new head to the beginning of the snake
    snake.unshift(head);
    //remove the last element of the snake
    snake.pop();
        //this way, all the other snake parts shift into place
}
