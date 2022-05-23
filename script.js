//contém todos os X O do jogo
var arrayTab;
const jogadorHumano = 'O';
const jogadorIA = 'X';
const possGanhos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');


function startGame() {
	document.querySelector(".endgame").style.display = "none";		
	document.querySelector(".beginGame").style.visibility = "hidden";
	//adicionar um array de números na tabela
	arrayTab = Array.from(Array(9).keys());
	// loop para remover o conteúdo das células, remover a cor, para que seja substituído
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		//chamada da função caso clique em uma das células
		cells[i].addEventListener('click', clique, false);
	}
}
function startGameCPU(){
	document.querySelector(".endgame").style.display = "none";		
	document.querySelector(".beginGame").style.visibility = "hidden";
	//adicionar um array de números na tabela
	arrayTab = Array.from(Array(9).keys());
	// loop para remover o conteúdo das células, remover a cor, para que seja substituído
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		//chamada da função caso clique em uma das células
		cells[i].addEventListener('click', bestSpot, true);
	}
}

function clique(quadrado) {
	//pega os elementos do array que já foram clicados para impedir que clique novamente
	if (typeof arrayTab[quadrado.target.id] == 'number') {
		// função com os parâmetros de cada célula da tabela e dá a vez para o jogador humano
		turn(quadrado.target.id, jogadorHumano)
		if (!checkGanho(arrayTab, jogadorHumano) && !verifVelha()) turn(bestSpot(), jogadorIA);
	}
}

function turn(quadradoId, jogador) {
	//é criada uma matriz para verificar quando o jogador clicar na célula
	arrayTab[quadradoId] = jogador;
	// para mostrar o array que o jogador clicou
	document.getElementById(quadradoId).innerText = jogador;
	// para verificar o jogo ganho, é passado uma função com uma variável de jogo ganho
	let jogoGanho = checkGanho(arrayTab, jogador)
	if (jogoGanho) fimDeJogo(jogoGanho)
}

function checkGanho(board, jogador) {
	// buscar todos as células que já foram preenchidas; 
	let plays = board.reduce((a, e, i) => (e === jogador) ? a.concat(i) : a, []);

	let jogoGanho = null;
	// loop para percorrer o array da variavel de possíveis ganhos 
	for (let [index, win] of possGanhos.entries()) {
		//win.every vai pegar o array de possiveis ganhos, plays para pegar os lugares já clicados 
		// e ver se o índice do elemento é maior que -1
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			// pega a combinação de indice em que ele ganhou e qual jogador venceu.
			jogoGanho = {index: index, jogador: jogador};
			break;
		}
	}
	return jogoGanho;
}

function fimDeJogo(jogoGanho) {
	// loop para destacar os quadrados que deu a vitória pro jogador vencedor
	for (let index of possGanhos[jogoGanho.index]) {
		document.getElementById(index).style.backgroundColor =
			jogoGanho.jogador == jogadorHumano ? "blue" : "red";
	}
	//loop para impedir que o jogador clique na mesma célula em que já havia sido clicado
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', clique, false);
	}
	// verificar se o jogador ganhou para que apareça a mensagem na div
	declararVencedor(jogoGanho.jogador == jogadorHumano ? "Você ganhou!" : "Você perdeu.");
}

function declararVencedor(quem) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = quem;
}

function vaziosquadrados() {
	// retorna as células que contém número e estão vazios
	return arrayTab.filter(s => typeof s == 'number');
}

function bestSpot() {
	return vaziosquadrados()[0];
}

function verifVelha() {
	//verificação se todos os quadrados foram preenchidos e que ninguém ganhou
	if (vaziosquadrados().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', clique, false);
		}
		declararVencedor("Deu velha!")
		return true;
	}
	return false;
}

