var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score, maxScore, movement, rod;
let ballSpeedX = 2, ballSpeedY = 2;
let gameOn = false;
let container = document.getElementById('container');
let containerWidth = container.offsetWidth, containerHeight = container.offsetHeight;

(function () {
    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if (rod === null || maxScore === null) {
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = rod1Name;
    } else {
        alert(rod + " has maximum score of " + (maxScore * 100));
    }

    resetBoard(rod);
})();

function resetBoard(rodName) {
    rod1.style.left = (containerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (containerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (containerWidth - ball.offsetWidth) / 2 + 'px';

    if (rodName === rod2Name) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === rod1Name) {
        ball.style.top = (rod2.offsetTop - ball.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;
}

function storeWin(rod, score) {
    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, maxScore);
    }

    clearInterval(movement);
    resetBoard(rod);

    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));
}

window.addEventListener('keydown', function (event) {
    let rodSpeed = 20;

    let rodRect = rod1.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    if (event.code === "ArrowRight" && ((rodRect.right + rodSpeed) < containerRect.right)) {
        rod1.style.left = (rodRect.left + rodSpeed - containerRect.left) + 'px';
        rod2.style.left = rod1.style.left;
    } else if (event.code === "ArrowLeft" && (rodRect.left > containerRect.left)) {
        rod1.style.left = (rodRect.left - rodSpeed - containerRect.left) + 'px';
        rod2.style.left = rod1.style.left;
    }

    if (event.code === "Enter") {
        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.left - containerRect.left;
            let ballY = ballRect.top - containerRect.top;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            movement = setInterval(function () {
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = rod1.getBoundingClientRect().left - containerRect.left;
                rod2X = rod2.getBoundingClientRect().left - containerRect.left;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                if ((ballX + ballDia) > containerWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }

                let ballPos = ballX + ballDia / 2;

                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY;
                    score++;

                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                } else if ((ballY + ballDia) >= (containerHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY;
                    score++;

                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }

            }, 10);
        }
    }
});
