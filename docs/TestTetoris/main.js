
//フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;

// ブロックサイズ(ピクセル)
const BLOCK_SIZE = 30;

// キャンバスサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

//テトラミノのサイズ
const TETRO_MINO = 4;

const GAME_SPEED = 300;

const START_X = FIELD_COL * 0.5 - TETRO_MINO * 0.5;
const START_Y = 0;

// キャンバスの作成
const canvas = document.createElement("canvas");
canvas.width = SCREEN_W;
canvas.height = SCREEN_H
canvas.style.border = "4px solid #555";//canvasの枠を描画
canvasId = "can";//ID指定
document.body.appendChild(canvas);//HTMLのDocumentに追加

// Contextを取得
let con = canvas.getContext("2d");

const TETORO_COLORS = [
	"#00F",//0空
	"#6CF",//1水色
	"#F92",//2オレンジ
	"#66F",//3青
	"#C5C",//4紫
	"#FD2",//5黄色
	"#F00",//6赤
	"#0F0",//7緑
]

const TETORO_TYPES = [
	[],//空っぽ
	[//I
		[ 0, 0, 0, 0 ],
		[ 1, 1, 1, 1 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//L
		[ 0, 1, 0, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//J
		[ 0, 0, 1, 0 ],
		[ 0, 0, 1, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//T
		[ 0, 1, 0, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 1, 0, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//O
		[ 0, 0, 0, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//Z
		[ 0, 0, 0, 0 ],
		[ 1, 1, 0, 0 ],
		[ 0, 1, 1, 0 ],
		[ 0, 0, 0, 0 ],
	],
	[//S
		[ 0, 0, 0, 0 ],
		[ 0, 1, 1, 0 ],
		[ 1, 1, 0, 0 ],
		[ 0, 0, 0, 0 ],
	]
];

let tetoro;
// テトロミノの形
let tetoro_t = 0;
tetoro_t = Math.floor(Math.random() * (TETORO_TYPES.length-1))+1;
tetoro = TETORO_TYPES[tetoro_t];

let gameOverFlag = false;

// ミノの座標
let tetoro_x = START_X;
let tetoro_y = START_Y;

let field = [];
// 初期化
const initialize = () => {
	// フィールド本体の初期化(めんどくさいのループで入れておく)
	for (let y = 0; y < FIELD_ROW; y++) {
		field[y] = [];
		for (let x = 0; x < FIELD_COL; x++) {
			field[y][x] = 0;
		}
	}
}

//以前の描画をクリア
const clearDraw = () => {
	con.clearRect(0, 0, SCREEN_W, SCREEN_H);
}

// ブロック一つを描画する
const drawBlock = (x, y, c) =>{
	let px = x * BLOCK_SIZE;
	let py = y * BLOCK_SIZE;
	// 塗りつぶし
	con.fillStyle=TETORO_COLORS[c];
	con.fillRect(px , py, BLOCK_SIZE, BLOCK_SIZE);
	// 枠を描く
	con.strokeStyle="black";
	con.strokeRect(px , py, BLOCK_SIZE, BLOCK_SIZE);
}

const drawAll = () => {
	// 描画
	for (let y = 0; y < FIELD_ROW; y++) {
		for (let x = 0; x < FIELD_COL; x++) {
			if (field[y][x])
			{
				drawBlock(x, y, field[y][x]);
			}
		}
	}
	// 描画
	for (let y = 0; y < TETRO_MINO; y++) {
		for (let x = 0; x < TETRO_MINO; x++) {
			if (tetoro[y][x])
			{
				drawBlock(tetoro_x + x, tetoro_y + y, tetoro_t);
			}
		}
	}

	if (gameOverFlag) {
		let s = "Game Over";
		con.font = "40px 'MS ゴシック'";
		let w = con.measureText(s).width;
		let x = SCREEN_W / 2 - w / 2;
		let y = SCREEN_H / 2 - 20;
		con.lineWidth = 4;
		con.strokeText(s,x,y);
		con.fillStyle="white";
		con.fillText(s, x, y);
	}
}

const checkMove = (mx, my, ntetoro) => {

	if (ntetoro == undefined)
	{
		ntetoro = tetoro;
	}

	// 描画
	for (let y = 0; y < TETRO_MINO; y++) {
		for (let x = 0; x < TETRO_MINO; x++) {
			if (ntetoro[y][x])//自分のブロック描画先にフィールドのブロックがあれば止める
			{
				let nx = tetoro_x + mx + x;//チェック先の座標
				let ny = tetoro_y + my + y;
				if (ny < 0 ||
					nx < 0 ||
					ny >= FIELD_ROW ||
					nx >= FIELD_COL)
				{
					return false;
				}// ny, nxが-1の値でエラーになるのでフィールド外判定は事前にチェックを挟む

				if (field[ny][nx])
				{
					return false;
				}
			}
		}
	}
	return true;
}

//テトロの回転
const rotate = () => {
	let ntetoro = [];
	for (let y = 0; y < TETRO_MINO; y++) {
		ntetoro[y] = [];
		for (let x = 0; x < TETRO_MINO; x++) {
			ntetoro[y][x] = tetoro[TETRO_MINO-x-1][y];//90度右回転
		}
	}
	return ntetoro;
}

const inputKey = () => {
	if (gameOverFlag){
		return;
	}
	// キー入力
	document.onkeydown = (e) => {
		switch (e.key) {
			case "a":
				if (checkMove(-1, 0)) tetoro_x--;
				break;
			case "w":
				if (checkMove(0, -1)) tetoro_y--;
				break;
			case "d":
				if (checkMove(1, 0)) tetoro_x++;
				break;
			case "s":
				if (checkMove(0, 1)) tetoro_y++;
				break;
			case " "://space
				let ntetoro = rotate();
				if (checkMove(0, 0, ntetoro)) tetoro = ntetoro;
				break;
			default:
				break;
		}
		clearDraw();
		drawAll();
	}
}

const fixTetoro = () => {
	for (let y = 0; y < TETRO_MINO; y++) {
		for (let x = 0; x < TETRO_MINO; x++) {
			if (tetoro[y][x])
			{
				field[tetoro_y + y][tetoro_x + x] = tetoro_t;
			}
		}
	}
}

// ラインが揃ったら消す
const checkLine = () => {
	let lineCount = 0;
	for (let y = 0; y < FIELD_ROW; y++) {
		let flag = true;//各ラインでフラグを持つ
		for (let x = 0; x < FIELD_COL; x++) {
			if (!field[y][x])
			{
				// 横一列に一つでもからのセルがあればfalse
				flag = false;
				break;
			}
		}

		if (flag)
		{
			lineCount++;

			//下にずらす
			for (let ny = y; ny > 0; ny--) {
				for (let nx = 0; nx < FIELD_COL; nx++){
					field[ny][nx] = field[ny-1][nx];
				}
			}		
		}
	}
}

const doropTetoro = () => {
	if (gameOverFlag){
		return;
	}

	if (checkMove(0, 1)){
		tetoro_y++;
	} else {
		fixTetoro();
		checkLine();

		tetoro_t = Math.floor(Math.random() * (TETORO_TYPES.length-1))+1;
		tetoro = TETORO_TYPES[tetoro_t];
		tetoro_x = START_X;
		tetoro_y = START_Y;

		if (!checkMove(0,0)) {
			gameOverFlag = true;
		}
	}
	clearDraw();
	drawAll();
}

initialize();
clearDraw();
drawAll();
inputKey();

setInterval(() => {
	doropTetoro();
}, GAME_SPEED);



