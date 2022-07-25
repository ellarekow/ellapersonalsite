//Define any variables that are used in more than one function
let cat, state;

//Aliases
const Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

//Create a Pixi Application
const app = new Application({
    width: 500,
    height: 500,
    antialias: true,
    transparent: false,
    resolution: 1
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
    .add("imgs/cat.png")
    .load(setup);

function keyboard(value) {
    const key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) => {
        if (event.key === key.value) {
            if (key.isUp && key.press) {
                key.press();
            }
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = (event) => {
        if (event.key === key.value) {
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function setup() {

    //Create the `cat` sprite 
    cat = new Sprite(resources["imgs/cat.png"].texture);
    cat.y = 96;
    cat.vx = 0;
    cat.vy = 0;
    app.stage.addChild(cat);

    //Capture the keyboard arrow keys
    const left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    //Left arrow key `press` method
    left.press = () => {
        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        cat.vy = 0;
    };

    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Up
    up.press = () => {
        cat.vy = -5;
        cat.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    //Right
    right.press = () => {
        cat.vx = 5;
        cat.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Down
    down.press = () => {
        cat.vy = 5;
        cat.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    //Set the game state
    state = play;

    //Start the game loop 
    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {

    //Update the current game state:
    state(delta);
}

function play(delta) {

    //Use the cat's velocity to make it move
    if ((cat.x <= 0 && cat.vx > 0) || (cat.x >= 500 && cat.vx < 0) || (cat.x < 500 || cat.x > 0))
        cat.x += cat.vx;

    if ((cat.y <= -10 && cat.vy > 0) || (cat.y > 500 && cat.vy < 0) || (cat.y < 500 || cat.y > 0))
        cat.y += cat.vy;
    console.log("x: " + cat.x + "   y: " + cat.y);

}