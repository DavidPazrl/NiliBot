//CONFIGURACION DEL NIVEL APRENDIZ 
const LEVEL_CONFIG = {
    name: '🧒 Nivel Aprendiz',
    accuracy: 0.65,
    minTime: 1000,
    maxTime: 2500,
    operationRange: { min: 10, max: 50 },
    operations: ['+', '-', '*'],

    useModel: true, 
    modelEndpoint: 'http://localhost:5000/predict',
    modelLevel: 'kid', 

    messages: {
        correct: [
            '¡Lo logré! Cada vez mejor',
            'Sí, acerté esta vez',
            '¡Estoy aprendiendo!',
            'Correcto, ¡bien hecho!'
        ],
        incorrect: [
            'Hmm, me equivoqué',
            'Casi... pero no',
            'Necesito más práctica',
            'Ups, fallé',
            'No fue correcto'
        ],
        thinking: [
            'CALCULANDO...',
            'PROCESANDO...',
            'ANALIZANDO...',
            'RESOLVIENDO...'
        ]
    }
};

let currentQuestion = 0;
let niliScore = 0;
let humanScore = 0;
let niliTimes = [];
let humanTimes = [];
let gameActive = false;
let questionStartTime = 0;
let currentAnswer = 0;

function goBack() {
    window.location.href = '../index.html';
}

function startGame() {
    gameActive = true;
    currentQuestion = 0;
    niliScore = 0;
    humanScore = 0;
    niliTimes = [];
    humanTimes = [];

    document.getElementById('startBtn').disabled = true;
    document.getElementById('operationDisplay').classList.remove('hidden');

    nextQuestion();
}

function resetGame() {
    gameActive = false;
    currentQuestion = 0;
    niliScore = 0;
    humanScore = 0;
    niliTimes = [];
    humanTimes = [];

    updateStats();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('operationDisplay').classList.add('hidden');
    document.getElementById('humanAnswer').value = '';
    document.getElementById('humanAnswer').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('niliAnswer').innerHTML = '<span class="thinking">ESPERANDO...</span>';
    document.getElementById('niliMessages').innerHTML = '';
    document.getElementById('niliResult').innerHTML = '';
    document.getElementById('humanResult').innerHTML = '';
}

function generateQuestion() {
    const { min, max } = LEVEL_CONFIG.operationRange;
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const operation = LEVEL_CONFIG.operations[Math.floor(Math.random() * LEVEL_CONFIG.operations.length)];

    let answer;
    if (operation === '+') answer = num1 + num2;
    else if (operation === '-') answer = num1 - num2;
    else if (operation === '*') answer = num1 * num2;

    return { num1, num2, operation, answer };
}

function nextQuestion() {
    if (currentQuestion >= 10) {
        endGame();
        return;
    }

    currentQuestion++;
    const question = generateQuestion();
    currentAnswer = question.answer;

    document.getElementById('progressText').textContent = `PREGUNTA ${currentQuestion}/10`;
    document.getElementById('operation').textContent = `${question.num1} ${question.operation} ${question.num2} = ?`;

    document.getElementById('humanAnswer').value = '';
    document.getElementById('humanAnswer').disabled = false;
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('humanAnswer').focus();
    document.getElementById('niliResult').innerHTML = '';
    document.getElementById('humanResult').innerHTML = '';

    const thinkingMsg = LEVEL_CONFIG.messages.thinking[Math.floor(Math.random() * LEVEL_CONFIG.messages.thinking.length)];
    document.getElementById('niliAnswer').innerHTML = `<span class="thinking">${thinkingMsg}</span>`;

    questionStartTime = Date.now();
    niliResponds();
}

function niliResponds() {
    const responseTime = LEVEL_CONFIG.minTime + Math.random() * (LEVEL_CONFIG.maxTime - LEVEL_CONFIG.minTime);

    setTimeout(() => {
        const niliTime = (Date.now() - questionStartTime) / 1000;
        niliTimes.push(niliTime);

        if (LEVEL_CONFIG.useModel) {
            getNiliAnswerFromModel()
                .then(response => {
                    displayNiliResult(response.answer, niliTime);
                })
                .catch(error => {
                    console.error('Error al llamar al modelo:', error);
                    const demo = getDemoAnswer();
                    displayNiliResult(demo, niliTime);
                });
        } else {
            const demo = getDemoAnswer();
            displayNiliResult(demo, niliTime);
        }
    }, responseTime);
}

async function getNiliAnswerFromModel() {
    const operation = document.getElementById('operation').textContent.replace(' = ?', '');
    const response = await fetch(LEVEL_CONFIG.modelEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: operation,
            level: LEVEL_CONFIG.modelLevel
        })
    });
    const data = await response.json();
    return { answer: data.answer };
}

function getDemoAnswer() {
    if (Math.random() < LEVEL_CONFIG.accuracy) {
        return currentAnswer;
    } else {
        return currentAnswer + Math.floor(Math.random() * 10) - 5;
    }
}

function displayNiliResult(niliAnswer, niliTime) {
    document.getElementById('niliAnswer').textContent = niliAnswer;
    document.getElementById('niliLastTime').textContent = niliTime.toFixed(2) + 's';

    const isCorrect = niliAnswer === currentAnswer;
    if (isCorrect) niliScore++;

    const messages = isCorrect ? LEVEL_CONFIG.messages.correct : LEVEL_CONFIG.messages.incorrect;
    const message = messages[Math.floor(Math.random() * messages.length)];

    const resultHTML = `<div class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✓ CORRECTO' : '✗ INCORRECTO'}
            </div>`;
    document.getElementById('niliResult').innerHTML = resultHTML;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble';
    messageDiv.textContent = message;
    const messagesContainer = document.getElementById('niliMessages');
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(messageDiv);

    updateStats();
}

function submitAnswer() {
    const humanAnswer = parseInt(document.getElementById('humanAnswer').value);

    if (isNaN(humanAnswer)) {
        alert('Por favor ingresa un número válido');
        return;
    }

    const humanTime = (Date.now() - questionStartTime) / 1000;
    humanTimes.push(humanTime);

    document.getElementById('humanAnswer').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('humanLastTime').textContent = humanTime.toFixed(2) + 's';

    const isCorrect = humanAnswer === currentAnswer;
    if (isCorrect) humanScore++;

    const resultHTML = `<div class="result-badge ${isCorrect ? 'correct' : `✗ INCORRECTO (Era ${currentAnswer})`}
            </div>`;
    document.getElementById('humanResult').innerHTML = resultHTML;

    updateStats();
    setTimeout(nextQuestion, 2000);
}

function updateStats() {
    document.getElementById('niliScore').textContent = `${niliScore}/10`;
    document.getElementById('humanScore').textContent = `${humanScore}/10`;

    if (niliTimes.length > 0) {
        const niliAvg = niliTimes.reduce((a, b) => a + b, 0) / niliTimes.length;
        document.getElementById('niliAvgTime').textContent = niliAvg.toFixed(2) + 's';
    }

    if (humanTimes.length > 0) {
        const humanAvg = humanTimes.reduce((a, b) => a + b, 0) / humanTimes.length;
        document.getElementById('humanAvgTime').textContent = humanAvg.toFixed(2) + 's';
    }
}

function endGame() {
    gameActive = false;
    document.getElementById('operationDisplay').classList.add('hidden');

    const niliTotal = niliTimes.reduce((a, b) => a + b, 0);
    const humanTotal = humanTimes.reduce((a, b) => a + b, 0);
    const niliAvg = niliTotal / niliTimes.length;
    const humanAvg = humanTotal / humanTimes.length;

    document.getElementById('finalNiliScore').textContent = `${niliScore}/10`;
    document.getElementById('finalHumanScore').textContent = `${humanScore}/10`;
    document.getElementById('finalNiliTime').textContent = niliTotal.toFixed(2) + 's';
    document.getElementById('finalHumanTime').textContent = humanTotal.toFixed(2) + 's';
    document.getElementById('finalNiliAvg').textContent = niliAvg.toFixed(2) + 's';
    document.getElementById('finalHumanAvg').textContent = humanAvg.toFixed(2) + 's';

    let winnerText = '';
    if (humanScore > niliScore) winnerText = '¡GANASTE!';
    else if (humanScore < niliScore) winnerText = 'NILI GANÓ';
    else winnerText = '¡EMPATE!';

    document.getElementById('winnerTitle').textContent = winnerText;
    document.getElementById('finalResults').classList.remove('hidden');
}

function closeResults() {
    document.getElementById('finalResults').classList.add('hidden');
    resetGame();
}

document.getElementById('humanAnswer').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !this.disabled) {
        submitAnswer();
    }
});
