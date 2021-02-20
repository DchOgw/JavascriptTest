
// キャンバスの作成
const canvas = document.createElement("canvas");
canvas.width = 480;
canvas.height = 320;
canvas.style.border = "4px solid #555";//canvasの枠を描画
canvasId = "can";//ID指定
document.body.appendChild(canvas);//HTMLのDocumentに追加

// Contextを取得
let ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleY = canvas.height - paddleHeight - paddleHeight;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let scroe = 0;

const drawScore = () => {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + scroe, 8, 20);
}

// 円の描画
const drawBall = () => {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

const moveBall = () => {
	x += dx;
	y += dy;

	// ボールと壁との当たり判定
	if (y + dy < ballRadius) {// 壁上
		dy = -dy;
	}
	if (y + dy > canvas.height) {// 壁下
		alert("GAME OVER");
		document.location.reload();
		clearInterval(interval)
	}
	// 壁右左
	if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
		dx = -dx;
	}

	// 自機とボールとの当たり判定
	if ((paddleX < x + ballRadius) && 
		(paddleX + paddleWidth > x - ballRadius) &&
		(paddleY < y + ballRadius) &&
		(paddleY + paddleHeight > y - ballRadius)){
		dy = -dy;
	}
}

const drwaPaddle = () => {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

const keyDownHandler = (e) => {
	if (e.key == "d" || e.key == "ArrowRight") {
		rightPressed = true;
	}
	else if (e.key == "a" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
}

const keyUpHandler = (e) => {
	if (e.key == "d" || e.key == "ArrowRight"){
		rightPressed = false;
	}
	else if (e.key == "a" || e.key == "ArrowLeft"){
		leftPressed = false;
	}
}

const mouseMoveHandler = (e) => {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

const movePaddle = () => {
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
}

let bricks = [];
const initBlock = () => {
	for (let i = 0; i < brickColumnCount; i++) {
		bricks[i] = [];
		for (let j = 0; j < brickRowCount; j++) {
			bricks[i][j] = { x:0, y:0, status: 1 };//オブジェクトを突っ込む
		}
	}
}

const blocksCreate = () => {
	for (let i = 0; i < brickColumnCount; i++) {
		for (let j = 0; j < brickRowCount; j++) {
			if (bricks[i][j].status == 1)
			{
				let brickX = (j * (brickWidth + brickPadding)) + brickOffsetLeft;
				let brickY = (i * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[i][j].x = brickX;
				bricks[i][j].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const blocksCollision = () => {
	for (let i = 0; i < brickColumnCount; i++) {
		for (let j = 0; j < brickRowCount; j++) {
			let b = bricks[i][j];
			if (b.status == 1)
			{
				if(x > b.x && 
					x < b.x + brickWidth + ballRadius && 
					y > b.y && 
					y < b.y + brickHeight + ballRadius) {
					dy = -dy;
					b.status = 0;

					scroe++;
					if (scroe == brickRowCount*brickColumnCount) {
						alert("CLEAR!!");
						document.location.reload();
					}
				}
			}
		}
	}
}

initBlock();
const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 描画コード
	drawBall();
	drwaPaddle();
	blocksCreate();
	moveBall();
	movePaddle();
	blocksCollision();
	drawScore();
}

const interval = setInterval(draw, 10);
