// CONFIGURACION DEL NIVEL BEBE
const LEVEL_CONFIG = {
    name: 'Nivel Bebe',
    accuracy: 0.2, 
    minTime: 2000,
    maxTime: 4000,
    operationRange: { min: 0, max: 10 },
    operations: ['+', '-'],

    useModel: true, 
    modelEndpoint: 'http://localhost:5000/predict', 
    modelLevel: 'baby',
    messages: {
        correct: ['¡Yay! Lo logré', '¡Wiii! ¡Correcto!', '¿Eso era correcto? ¡Suerte!'],
        incorrect: ['Esto es muy difícil...', '¿Qué son los números?', 'Me equivoqué otra vez'],
        thinking: ['PENSANDO...', 'PROCESANDO...', 'CALCULANDO...']
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
    document.getElementById('niliResult').innerHTML = '';
    document.getElementById('humanResult').innerHTML = '';

    const thinkingMsg = LEVEL_CONFIG.messages.thinking[Math.floor(Math.random() * LEVEL_CONFIG.messages.thinking.length)];
    document.getElementById('niliAnswer').innerHTML = `<span class="thinking">${thinkingMsg}</span>`;

    questionStartTime = Date.now();
    niliResponds(question);
}

function niliResponds(question) {
    const responseTime = LEVEL_CONFIG.minTime + Math.random() * (LEVEL_CONFIG.maxTime - LEVEL_CONFIG.minTime);

    setTimeout(async () => {
        const niliTime = (Date.now() - questionStartTime) / 1000;
        niliTimes.push(niliTime);

        try {
            let niliAnswer;

            if (LEVEL_CONFIG.useModel) {
                const response = await fetch(LEVEL_CONFIG.modelEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        num1: question.num1,
                        num2: question.num2,
                        op: question.operation,
                        level: LEVEL_CONFIG.modelLevel
                    })
                });

                const data = await response.json();
                niliAnswer = data.answer;
            } else {
                niliAnswer = getDemoAnswer();
            }

            displayNiliResult(niliAnswer, niliTime);
        } catch (error) {
            console.error('Error con el modelo:', error);
            const niliAnswer = getDemoAnswer();
            displayNiliResult(niliAnswer, niliTime);
        }

    }, responseTime);
}

function getDemoAnswer() {
    if (Math.random() < LEVEL_CONFIG.accuracy) return currentAnswer;
    return currentAnswer + Math.floor(Math.random() * 10) - 5;
}

function displayNiliResult(niliAnswer, niliTime) {
    document.getElementById('niliAnswer').textContent = niliAnswer;
    document.getElementById('niliLastTime').textContent = niliTime.toFixed(2) + 's';

    const isCorrect = niliAnswer === currentAnswer;
    if (isCorrect) niliScore++;

    const messages = isCorrect ? LEVEL_CONFIG.messages.correct : LEVEL_CONFIG.messages.incorrect;
    const message = messages[Math.floor(Math.random() * messages.length)];

    document.getElementById('niliResult').innerHTML = `<div class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✓ CORRECTO' : '✗ INCORRECTO'}
    </div>`;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-bubble';
    msgDiv.textContent = message;
    document.getElementById('niliMessages').innerHTML = '';
    document.getElementById('niliMessages').appendChild(msgDiv);

    updateStats();
}

function submitAnswer() {
    const humanAnswer = parseInt(document.getElementById('humanAnswer').value);
    if (isNaN(humanAnswer)) return alert('Ingresa un número válido');

    const humanTime = (Date.now() - questionStartTime) / 1000;
    humanTimes.push(humanTime);

    document.getElementById('humanAnswer').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('humanLastTime').textContent = humanTime.toFixed(2) + 's';

    const isCorrect = humanAnswer === currentAnswer;
    if (isCorrect) humanScore++;

    document.getElementById('humanResult').innerHTML = `<div class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✓ CORRECTO' : `✗ INCORRECTO (Era ${currentAnswer})`}
    </div>`;

    updateStats();
    setTimeout(nextQuestion, 2000);
}

function updateStats() {
    document.getElementById('niliScore').textContent = `${niliScore}/10`;
    document.getElementById('humanScore').textContent = `${humanScore}/10`;

    if (niliTimes.length) {
        const avg = niliTimes.reduce((a, b) => a + b, 0) / niliTimes.length;
        document.getElementById('niliAvgTime').textContent = avg.toFixed(2) + 's';
    }

    if (humanTimes.length) {
        const avg = humanTimes.reduce((a, b) => a + b, 0) / humanTimes.length;
        document.getElementById('humanAvgTime').textContent = avg.toFixed(2) + 's';
    }
}

function endGame() {
    gameActive = false;
    document.getElementById('operationDisplay').classList.add('hidden');

    const niliTotal = niliTimes.reduce((a, b) => a + b, 0);
    const humanTotal = humanTimes.reduce((a, b) => a + b, 0);

    document.getElementById('finalNiliScore').textContent = `${niliScore}/10`;
    document.getElementById('finalHumanScore').textContent = `${humanScore}/10`;
    document.getElementById('finalNiliTime').textContent = niliTotal.toFixed(2) + 's';
    document.getElementById('finalHumanTime').textContent = humanTotal.toFixed(2) + 's';
    document.getElementById('winnerTitle').textContent =
        humanScore > niliScore ? '¡GANASTE!' :
            humanScore < niliScore ? 'NILI GANÓ' : '¡EMPATE!';

    document.getElementById('finalResults').classList.remove('hidden');
}

function closeResults() {
    document.getElementById('finalResults').classList.add('hidden');
    resetGame();
}

document.getElementById('humanAnswer').addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.target.disabled) submitAnswer();
});
