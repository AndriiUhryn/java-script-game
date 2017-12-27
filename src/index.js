(function () {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var x = canvas.width / 2;
	var y = canvas.height - 30;

	var dx = 2;
	var dy = -2;

	var ballSpeed = 1;
	var ballRadius = 10;

	var paddleHeight = 10;
	var paddleWidth = 75;

	var paddleX = (canvas.width - paddleWidth) / 2;
	var rightPressed = false;
	var leftPressed = false;

	var brickRowCount = 3;
	var brickColumnCount = 5;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;
	var score = 0;
	var lives = 3;

	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);
	document.addEventListener('mousemove', mouseMoveHandler, false);

	var bricks = [];
	for (var c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (var r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

	function keyDownHandler(e) {
		if (e.keyCode === 39) {
			rightPressed = true;
		} else if (e.keyCode === 37) {
			leftPressed = true;
		}
	}

	function keyUpHandler(e) {
		if (e.keyCode === 39) {
			rightPressed = false;
		} else if (e.keyCode === 37) {
			leftPressed = false;
		}
	}

	function drawLives() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
	}

	function drawScore() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Score: " + score, 8, 20);
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function setInitialValues() {
		x = canvas.width / 2;
		y = canvas.height - 30;
		dx = 2;
		dy = -2;
		rightPressed = false;
		leftPressed = false;
		score = 0;
		bricks = [];

		for (var c = 0; c < brickColumnCount; c++) {
			bricks[c] = [];
			for (var r = 0; r < brickRowCount; r++) {
				bricks[c][r] = { x: 0, y: 0, status: 1 };
			}
		}
	}

	function drawBricks() {
		for (var c = 0; c < brickColumnCount; c++) {
			for (var r = 0; r < brickRowCount; r++) {
				if (bricks[c][r].status === 1) {
					bricks[c][r].x = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
					bricks[c][r].y = (r * (brickHeight + brickPadding)) + brickOffsetTop;
					ctx.beginPath();
					ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
					ctx.fillStyle = "#0095DD";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

	function collisionDetection() {
		for (var c = 0; c < brickColumnCount; c++) {
			for (var r = 0; r < brickRowCount; r++) {
				var b = bricks[c][r];

				if (b.status === 1) {
					if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
						dy = -dy;
						b.status = 0;
						score++;

						if (score === brickRowCount * brickColumnCount) {
							setInitialValues();
							alert('YOU WIN, CONGRATULATIONS!');
							document.location.reload();
						}
					}
				}
			}
		}
	}

	function mouseMoveHandler(e) {
		var relativeX = e.clientX - canvas.offsetLeft;

		if (relativeX > 0 && relativeX < canvas.width) {
			paddleX = relativeX - paddleWidth / 2;
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawPaddle();
		drawScore();
		collisionDetection();

		if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
			dx = -dx;
		}
		if (y + dy < ballRadius) {
			dy = -dy;
		} else if (y + dy > canvas.height - ballRadius) {
			if (x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy;
				ballSpeed += 0.1;
			} else {
				setInitialValues();
				alert("GAME OVER");
				document.location.reload();
			}
		}

		if (rightPressed && paddleX < canvas.width - paddleWidth) {
			paddleX += 7;
		} else if (leftPressed && paddleX > 0) {
			paddleX -= 7;
		}

		x += dx * ballSpeed;
		y += dy * ballSpeed;
	}

	setInterval(draw, 10);
})();
