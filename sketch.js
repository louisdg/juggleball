let DIAMETER = 100;

let ball = {
    x: 0,
    y: 0,
    diameter: DIAMETER,
    radius: 0
}

let ballSpeed = {
    x: 0,
    y: 0
}

let GRAVITY = 0.5;
let currentGravity;

let mousePress = {
    state: false,
    x: 0,
    y: 0
}
let mouseClick = {
    state: false,
    x: 0,
    y: 0
}
let ballPress = {
    state: false,
    x: 0,
    y: 0
}

let score = {
    current: 0,
    high: 0,
}

let fontSize;

let gameState;

let col;
let up;

let i = 0;
let j = 20;
let alph;

let bg = {
    r: 0,
    g: 127,
    b: 127
}

let prev = {
    x: 0,
    y: 0
}

function resetScore() {
    score.current = 0;
}

function resetBall() {
    ball.x = width / 2;
    ball.y = height / 2;
    ballSpeed.x = 0;
    ballSpeed.y = 0;
}

function resetGravity() {
    currentGravity = GRAVITY;
}

function getCookie(name) {
    let re = new RegExp(name + "=([^;]+)");
    let value = re.exec(document.cookie);
    return (value != null) ? decodeURIComponent(value[1]) : null;
}

function clickBall() {
    if (mousePress.state && sqrt(pow(mousePress.x - ball.x, 2) + pow(mousePress.y - ball.y, 2)) <= ball.radius) {
        ballSpeed.x = (ball.x - mousePress.x) / 3 + random(-2, 2);
        ballSpeed.y = -((sqrt(pow(mousePress.x - ball.x, 2) + pow(mousePress.y - ball.y, 2)) / 5 + 20) + random(0, 5)) * currentGravity;
        score.current++;
        gameState = "play";
        mousePress.state = false;
        ballPress.state = true;
        ballPress.x = mouseX;
        ballPress.y = mouseY;
        clickSound.play();
        i = 0;
        j = 20;
        currentGravity += 0.02;
    }
}

function menu() {
    resetGravity();
    resetScore();
    resetBall();
    background(0, 127, 127);
    noStroke();
    fill(255, 255, 255);
    ellipse(ball.x, ball.y, ball.diameter, ball.diameter);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(100 * fontSize);
    stroke(255);
    strokeWeight(40 * fontSize);
    text('JuggleBall', width / 2, height / 2 - ball.diameter - 120);
    fill(255);
    stroke(0);
    strokeWeight(20 * fontSize);
    text('JuggleBall', width / 2, height / 2 - ball.diameter - 120);
    fill(255, 255, 255, 127);
    noStroke();
    textSize(30 * fontSize);
    text('Click on the ball to start', width / 2, height / 2 - ball.diameter);
    textAlign(CENTER, BASELINE);
    text('High score', width / 2, height / 2 + ball.diameter);
    text(score.high, width / 2, height / 2 + ball.diameter + 30);
}

function updateSpeed() {
    ballSpeed.x *= 0.999;
    ballSpeed.y *= 0.999;
}

function updateSpeedX() {
    ballSpeed.x *= 0.85;
    ballSpeed.y *= 0.95;
}

let font;
let clickSound;
let newRecordSound;

function preload() {
    font = loadFont('assets/baloobhaina.ttf');
    clickSound = loadSound('assets/click.mp3');
    newRecordSound = loadSound('assets/new-record.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    if (width <= 1000) {
        fontSize = map(width, 0, 1000, 0.5, 1);
    } else {
        fontSize = 1;
    }

    resetScore();
    resetBall();
    ball.radius = ball.diameter / 2;
    gameState = "menu";
    if (getCookie("highScore") == null) {
        document.cookie = "highScore=0";
    } else {
        score.high = getCookie("highScore");
    }
}

function draw() {
    if (gameState === "menu") {
        menu();
    } else if (gameState === "play") {
        background(0, 127, 127);
        fill(0, 0, 0, 63);
        noStroke();
        textSize(min(width, height) * 0.75);
        textAlign(CENTER, BASELINE);
        text(score.current, width / 2, height / 2 + min(width, height) * 0.25);

        // animate
        if (ballPress.state) {
            alph = map(i, 0, 30, 255, 0);
            noFill();
            stroke(255, 255, 255, alph);
            strokeWeight((30 - i) / 3 + 5);
            ellipse(ballPress.x, ballPress.y, 4 * i + 15, 4 * i + 15);
            if (i >= 30) {
                ballPress.state = false;
                i = 0;
                j = 0;
            }
            i++;
            j--;
        }

        // ball
        noStroke();
        fill(255);
        ellipse(ball.x, ball.y, ball.diameter, ball.diameter);

        // computing
        ballSpeed.y += currentGravity;
        ball.x += ballSpeed.x;
        ball.y += ballSpeed.y;
        prev.x = mouseX;
        prev.y = mouseY;

        // left collision
        if (ball.x < ball.radius) {
            ballSpeed.x = -ballSpeed.x;
            ball.x = ball.radius;
            updateSpeedX();
        }
        // right collision
        if (ball.x > width - ball.radius) {
            ballSpeed.x = -ballSpeed.x;
            ball.x = width - ball.radius;
            updateSpeedX();
        }

        updateSpeed();

        // death
        if (ball.y > height * 2) {
            gameState = "end";
            mousePress.state = false;
            col = 0;
            up = true;
            document.cookie = "highScore=" + max(score.current, score.high);
            if (score.current > score.high) {
                if (!newRecordSound.isPlaying()) {
                    newRecordSound.play();
                    newRecordSound.amp(0.5);
                }
            }
        }
    } else if (gameState === "end") {
        background(0, 127, 127);
        textAlign(CENTER, CENTER);
        textSize(30 * fontSize);
        fill(255, 255, 255, 127);
        noStroke();
        text('Score', width / 2, height / 2 - 45);
        text(score.current, width / 2, height / 2 - 15);
        if (score.current <= score.high) {
            text('High score', width / 2, height / 2 + 15);
            text(score.high, width / 2, height / 2 + 45);
        } else {
            fill(255, 191 + col * 2, 255 - col * 4);
            textSize((48 + col / 2) * fontSize);
            stroke(255);
            strokeWeight((24 + col / 4) * fontSize);
            text('High score beaten!', width / 2, height / 2 + 30);
            stroke(0);
            strokeWeight((12 + col / 8) * fontSize);
            text('High score beaten!', width / 2, height / 2 + 30);
        }
        if (col >= 32) {
            up = false;
        } else if (col <= 0) {
            up = true;
        }
        if (up) {
            col++;
        } else {
            col--;
        }
        if (mousePress.state) {
            score.high = max(score.current, score.high);
            gameState = "menu";
            mousePress.state = false;
        }
    }
}

function mousePressed() {
    mousePress.state = true;
    mousePress.x = mouseX;
    mousePress.y = mouseY;
    clickBall();
}

function mouseClicked() {
    mouseClick.state = true;
    mouseClick.x = mouseX;
    mouseClick.y = mouseY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    if (width <= 1000) {
        fontSize = map(width, 0, 1000, 0.5, 1);
    } else {
        fontSize = 1;
    }

    if (gameState === "menu") {
        menu();
    }
}