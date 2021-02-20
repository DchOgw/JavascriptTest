

const main = () => {
	let d = document.getElementsByTagName('button');
	console.log(d[0]);
	d[0].addEventListener('click', () => {
		window.alert('click!');
	});
}

main();

