const board_border = 'black';
const board_background = 'white';
const snake_col = 'lightblue';
const snake_border = 'darkblue';

//to create a horizontal snake in the middle of the canvas, at (400, 400), we list the co-ordinate of each body part of the snake
    //the number of coordinates in the object will be equal to the length of the snake
    //first coordinate represents the snake's head
let snake = [ {x: 250, y: 250}, {x: 240, y: 250}, {x: 230, y: 250}, {x: 220, y: 250}, {x: 210, y: 250}]

let score = 0;
//true if changing direction
let changing_direction = false;

let food_x;
let food_y;
//horizontal velocity
let dx = 10;
//vertical velocity
let dy = 0;

//get the canvas element
const snakeboard = document.getElementById('snakeboard');
//return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext('2d');


//start the game
main();

gen_food();

//to incorporate the change_direction function, we can use the addEventListener on the document to listen for when a key is pressed; then we can call change_direction with the keydown event
document.addEventListener('keydown', change_direction);

//main function called repeatedly to keep the game running
    //to move the snake how we want, we can add a slight delay between each call with setTimeout
    //we also need to make sure to call drawSnake every time we call move_Snake, as shown below
        //if we don't, we won't be able to see the intermediate steps that show the snake moving
function main() {
    if (has_game_ended()) return;

    //change_direction is set to false at the beginning of each game loop because we want to allow the player to change direction again after each iteration of the game loop (every 100ms)
    changing_direction = false;

    setTimeout(function onTick() {
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        //call main again
        main();
    }, 100)
}

//draw a border around the canvas
function clear_board() {
    //set the color to fill the drawing
    snakeboard_ctx.fillStyle = board_background
    //set the color for the border of the canvas
    snakeboard_ctx.strokeStyle = board_border
    //draw a 'filled' rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    //draw a 'border' around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

//function that prints the parts
function drawSnake() {
    snake.forEach(drawSnakePart);
}

//function to draw the food on the canvas and update main to incorporate drawFood
function drawFood() {
    snakeboard_ctx.fillStyle = 'lightgreen';
    snakeboard_ctx.strokeStyle = 'darkgreen';
    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
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

    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

    if (has_eaten_food) {
        //increase score
        score += 10;

        //display score on screen
        document.getElementById('score').innerHTML = score;

        //generate new food
        gen_food();
    } else {
    //remove the last element of the snake
    snake.pop();
        //this way, all the other snake parts shift into place
    }
}


function has_game_ended() {
    //i = 4 because the snake's head is at the first position of the 'snake' array (index 0) and the initial length of the snake if 5 (as defined in the `let snake` array)
        //so the loop is checking if the head at position 0 has collided with any of the other parts of the snake (positions 4 and up) since it's impossible for the head to collide with its own tail before it has reached a length of 5
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeft = snake[0].x < 0;
    const hitRight = snake[0].x > snakeboard.width - 10
    const hitTop = snake[0].y < 0;
    const hitBottom = snake[0].y > snakeboard.height - 10
    return hitLeft || hitRight || hitTop || hitBottom
}

//changing direction
function change_direction(event) {

    //in JS, the 'keyCode' property of the event object that is passed to an event listener contains a numeric code that represents the key that was pressed
        //these codes are standardized and are the same across all modern web browsers
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    //prevent snake from reversing
    if (changing_direction) return;
    changing_direction = true;

    //in the HTML canvas coordinate system, the y-axis increases as you move downwards, and decreases as you move upwards
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}


//incorporating food and score
//need to randomly generate food in coordinates that are not where the snake currently is
function random_food(min, max) {
    //helper function that takes two arguments and returns a number between min and max, rounded to nearest multiple of 10
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function gen_food() {
    //generate coordinates that are within the bounds of the game, but not so close to the edge that they overlap with the game board border
        //we subtract 10 from width and height to account for the size of the food, which is 10px by 10px so that the food doesn't appear partially off-screen
        //remember random_food takes in min and max arguments
    food_x = random_food(0, snakeboard.width - 10);
    food_y = random_food(0, snakeboard.height - 10);

    //check if the current part of the snake's body has the same coordinates as the randomly generated food
        //if the snake has eaten the food, we call the gen_food function again to generate a new set of random coordinates
        //this process continues until we generate a set of coordinates that doesn't overlap with any part of the snake's body
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    })
}
