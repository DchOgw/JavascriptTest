const quiz =
[
	{
		question:'問題1：一番売れたゲーム機は？',
		answers:['Switch','任天堂DS','PlayerStation2'],
		correct:'任天堂DS'
	},
	{
		question:'bbbbbbbbbbbb',
		answers:['Switch','任天堂DS','PlayerStation2','GameCube'],
		correct:'Switch'
	},
	{
		question:'aaaaaaa',
		answers:['PlayerStation2','GameCube'],
		correct:'PlayerStation2'
	},
]

let quizeIdx = 0;
let correctCount = 0;//正解数
const answerCheck = (answerArg, correct) =>
{
	console.log(quiz.length);
	quizeIdx++;
	if (answerArg == correct)
	{
		window.alert('正解！！');
		correctCount++;
	}
	else
	{
		window.alert('不正解...');
	}

	// 最終問題終了
	if (quizeIdx >= quiz.length)
	{
		window.alert('クイズ終了です。正解数は:' + correctCount + '/' + quiz.length);
		window.alert('最初の問題に戻ります');
		quizeIdx = 0;
		correctCount = 0;
	}

	setup();
}

const setup = () => {
	const qz = quiz[quizeIdx];
	const $question = document.getElementById('js-question');
	$question.textContent = qz.question;
	
	const buttonArray = document.getElementsByTagName('button');
	for (let i = 0; i < buttonArray.length; i++) {
		const btn = buttonArray[i];
		const btnText = qz.answers[i];
		btn.textContent = btnText;

		// 選択数に応じて表示非表示する
		btn.hidden = btnText==null;
	}
};

const buttonArray = document.getElementsByTagName('button');
for (let i = 0; i < buttonArray.length; i++) {
	const btn = buttonArray[i];
	btn.addEventListener('click', () => {
		answerCheck(btn.textContent, quiz[quizeIdx].correct);
	});
}

setup();