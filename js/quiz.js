const questions = [
    {
        id: 1, difficulty: 'easy',
        question: '¿Cuál es el primer paso esencial antes de entrenar un modelo de Machine Learning?',
        options: ['Comprar más servidores', 'Preparar y limpiar los datos', 'Elegir el algoritmo más complejo', 'Publicar el modelo en producción'],
        correct: 1,
        explanation: 'La preparación y limpieza de datos es fundamental. Los datos de calidad son la base de cualquier modelo exitoso de ML.'
    },
    {
        id: 2, difficulty: 'easy',
        question: '¿Qué significa "limpiar los datos" en Machine Learning?',
        options: ['Borrar toda la base de datos', 'Eliminar valores faltantes, duplicados y errores', 'Formatear el disco duro', 'Usar un antivirus en los archivos'],
        correct: 1,
        explanation: 'Limpiar datos implica manejar valores faltantes, eliminar duplicados, corregir inconsistencias y tratar outliers.'
    },
    {
        id: 3, difficulty: 'easy',
        question: '¿Por qué es necesario el escalado de características (feature scaling)?',
        options: ['Para hacer los datos más pesados', 'Para que las características tengan rangos similares y no dominen unas sobre otras', 'Para eliminar columnas innecesarias', 'Para aumentar el tamaño del dataset'],
        correct: 1,
        explanation: 'El escalado normaliza los rangos de las características, evitando que variables con valores grandes dominen el aprendizaje.'
    },
    {
        id: 4, difficulty: 'easy',
        question: '¿Qué es un atributo categórico?',
        options: ['Un número decimal muy preciso', 'Una variable que representa categorías o etiquetas', 'Un dato que solo puede ser verdadero o falso', 'Una fórmula matemática compleja'],
        correct: 1,
        explanation: 'Los atributos categóricos son variables cualitativas que representan categorías. Deben convertirse a números para que el modelo pueda procesarlos.'
    },
    {
        id: 5, difficulty: 'easy',
        question: '¿Qué es la validación cruzada (cross-validation)?',
        options: ['Validar datos con otra persona', 'Una técnica para evaluar el modelo dividiéndolo en múltiples subconjuntos', 'Cruzar dos modelos diferentes', 'Validar el código con un compilador'],
        correct: 1,
        explanation: 'La validación cruzada divide el dataset en K partes, entrena el modelo K veces obteniendo una evaluación más robusta.'
    },
    {
        id: 6, difficulty: 'hard',
        question: '¿Cuál es la diferencia principal entre un transformador personalizado y usar funciones simples de preprocesamiento?',
        options: ['Los transformadores personalizados no sirven para nada', 'Los transformadores personalizados se integran en pipelines permitiendo fit/transform coherente', 'Las funciones simples son siempre mejores', 'No hay ninguna diferencia práctica'],
        correct: 1,
        explanation: 'Los custom transformers se integran en Pipelines, asegurando transformaciones correctas solo con datos de entrenamiento, evitando data leakage.'
    },
    {
        id: 7, difficulty: 'hard',
        question: '¿Por qué es crítico que el escalado se haga DESPUÉS de dividir train/test y DENTRO del pipeline?',
        options: ['Para que el código sea más largo', 'Para prevenir data leakage: el scaler debe calcular media/std solo del conjunto de entrenamiento', 'Porque StandardScaler no funciona con todo el dataset', 'Para ahorrar memoria RAM'],
        correct: 1,
        explanation: 'Si escalas antes de dividir, el modelo "ve" información del test set, causando data leakage.'
    }
];

let currentQuestion = 0, score = 0, selectedAnswer = null, answered = false;
let timeLeft = 20, timerInterval = null, scareCount = 0, randomScareShown = false;
const bgMusic = document.getElementById('bgMusic');
let bloodDripInterval = null;
let bloodPoolsCreated = [];
let isShowingJumpscare = false;

window.addEventListener('load', () => {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => { });
});

document.addEventListener('click', () => {
    if (bgMusic.paused) bgMusic.play().catch(() => { });
}, { once: true });

// Sangre

function createBloodDrip() {
    const timerContainer = document.querySelector('.timer-container');
    if (!timerContainer) return;

    const rect = timerContainer.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.8;
    const startY = rect.bottom;

    const drip = document.createElement('div');
    drip.className = 'blood-drip';

    const size = Math.random() * 12 + 8;
    const duration = Math.random() * 2 + 2;

    drip.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size * 2.5}px;
        background: linear-gradient(to bottom, 
            #8b0000 0%, 
            #6b0000 30%, 
            #4a0000 70%, 
            transparent 100%);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        opacity: 0.95;
        z-index: 20;
        pointer-events: none;
        filter: blur(0.5px);
        box-shadow: 0 0 10px rgba(139, 0, 0, 0.8);
        animation: bloodFall ${duration}s ease-in forwards;
    `;

    document.body.appendChild(drip);

    setTimeout(() => {
        createBloodPool(startX, window.innerHeight - 50);
        drip.remove();
    }, duration * 1000);
}

function createBloodPool(x, y) {
    const pool = document.createElement('div');
    pool.className = 'blood-pool';

    const size = Math.random() * 80 + 60;
    const rotation = Math.random() * 360;

    pool.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size * 0.6}px;
        background: radial-gradient(ellipse at center, 
            #8b0000 0%, 
            #6b0000 30%, 
            #4a0000 60%,
            #2a0000 90%,
            transparent 100%);
        border-radius: ${Math.random() * 60 + 40}% ${Math.random() * 60 + 40}% 
                       ${Math.random() * 60 + 40}% ${Math.random() * 60 + 40}%;
        transform: translate(-50%, -50%) rotate(${rotation}deg);
        opacity: 0;
        z-index: 15;
        pointer-events: none;
        filter: blur(1px);
        animation: poolExpand 1s ease-out forwards;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    `;

    document.body.appendChild(pool);
    bloodPoolsCreated.push(pool);

    if (bloodPoolsCreated.length > 15) {
        const oldPool = bloodPoolsCreated.shift();
        if (oldPool && oldPool.parentNode) {
            oldPool.remove();
        }
    }
}

function createBloodSplatter(targetElement) {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const splatter = document.createElement('div');
            splatter.className = 'blood-splatter';

            const offsetX = (Math.random() - 0.5) * rect.width;
            const offsetY = (Math.random() - 0.5) * rect.height;
            const size = Math.random() * 40 + 20;

            splatter.style.cssText = `
                position: fixed;
                left: ${centerX + offsetX}px;
                top: ${centerY + offsetY}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, 
                    #8b0000 0%, 
                    #6b0000 40%, 
                    #4a0000 70%,
                    transparent 100%);
                border-radius: ${Math.random() * 50 + 30}% ${Math.random() * 50 + 30}% 
                               ${Math.random() * 50 + 30}% ${Math.random() * 50 + 30}%;
                transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
                opacity: 0;
                z-index: 16;
                pointer-events: none;
                animation: splatterAppear 0.4s ease-out forwards;
                filter: blur(0.8px);
            `;

            document.body.appendChild(splatter);
            setTimeout(() => splatter.remove(), 5000);
        }, i * 100);
    }
}

function startBloodDripping() {
    if (bloodDripInterval) return;

    const getInterval = () => {
        if (timeLeft <= 5) return 200;
        if (timeLeft <= 10) return 400;
        if (timeLeft <= 15) return 700;
        return 1000;
    };

    bloodDripInterval = setInterval(() => {
        createBloodDrip();
        clearInterval(bloodDripInterval);
        bloodDripInterval = null;
        setTimeout(startBloodDripping, getInterval());
    }, getInterval());
}

function stopBloodDripping() {
    if (bloodDripInterval) {
        clearInterval(bloodDripInterval);
        bloodDripInterval = null;
    }
}

function cleanAllBlood() {
    stopBloodDripping();
    document.querySelectorAll('.blood-drip').forEach(el => el.remove());

    bloodPoolsCreated.forEach(pool => {
        if (pool && pool.parentNode) {
            pool.style.animation = 'poolFade 1s ease-out forwards';
            setTimeout(() => pool.remove(), 1000);
        }
    });
    bloodPoolsCreated = [];

    document.querySelectorAll('.blood-splatter').forEach(el => el.remove());
}

// Animaciones de sangre
if (!document.getElementById('bloodAnimations')) {
    const style = document.createElement('style');
    style.id = 'bloodAnimations';
    style.textContent = `
        @keyframes bloodFall {
            0% {
                transform: translateY(0) scaleY(0.8);
                opacity: 0.95;
            }
            100% {
                transform: translateY(calc(100vh - 100px)) scaleY(3);
                opacity: 0.7;
            }
        }
        
        @keyframes poolExpand {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
            }
            50% {
                opacity: 0.8;
            }
            100% {
                opacity: 0.7;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes poolFade {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
        
        @keyframes splatterAppear {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            }
            50% {
                opacity: 0.9;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0.7;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Ojos

document.addEventListener('mousemove', (e) => {
    for (let i = 1; i <= 12; i++) {
        const iris = document.querySelector(`.iris[data-eye="${i}"]`);
        const pupil = document.querySelector(`.pupil[data-eye="${i}"]`);
        const eyeElement = document.querySelector(`.eye-${i}`);
        if (!eyeElement || !iris || !pupil) continue;

        const rect = eyeElement.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = Math.min(10, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 40);
        const irisX = 50 + Math.cos(angle) * distance;
        const irisY = 30 + Math.sin(angle) * distance;
        const pupilX = 50 + Math.cos(angle) * (distance * 0.8);
        const pupilY = 30 + Math.sin(angle) * (distance * 0.8);
        iris.setAttribute('cx', irisX);
        iris.setAttribute('cy', irisY);
        pupil.setAttribute('cx', pupilX);
        pupil.setAttribute('cy', pupilY);
    }
});

// videos

const scareVideos = [
    { id: 'scareVideo1', text: '¡EQUIVOCADO!', isMeme: false },
    { id: 'scareVideo2', text: '¡TIEMPO AGOTADO!', isMeme: false },
    { id: 'scareVideo3', text: '¡ERROR FATAL!', isMeme: false },
    { id: 'scareVideo4', text: '¡INTENTA OTRA VEZ!', isMeme: false },
    { id: 'memeVideo', text: '¡RELÁJATE UN POCO!', isMeme: true }
];

function triggerJumpscare(reason) {
    if (isShowingJumpscare) return;
    isShowingJumpscare = true;

    const overlay = document.getElementById('jumpscareOverlay');
    const text = document.getElementById('jumpscareText');

    cleanAllBlood();
    bgMusic.volume = 0.1;

    scareVideos.forEach(v => {
        const vid = document.getElementById(v.id);
        if (vid) {
            vid.style.display = 'none';
            vid.pause();
            vid.currentTime = 0;
        }
    });

    let selected = (scareCount > 0 && scareCount % 5 === 0) ? scareVideos[4] : scareVideos[Math.floor(Math.random() * 4)];
    scareCount++;

    const video = document.getElementById(selected.id);

    if (video && video.src) {
        video.style.display = 'block';
        video.style.maxWidth = '95vw';
        video.style.maxHeight = '95vh';

        text.textContent = selected.text;
        text.style.color = selected.isMeme ? '#888' : '#f00';
        text.style.fontSize = '3.5em';

        overlay.classList.add('active');
        overlay.style.display = 'flex';

        video.play().then(() => {
            console.log(' Video reproduciendo:', selected.id);
        }).catch(err => {
            console.warn(' Error reproduciendo video:', err);
            showTextJumpscare(selected.text);
        });

        if (!selected.isMeme) {
            const scream = new Audio('scream.mp3');
            scream.volume = 0.8;
            scream.play().catch(() => console.log('Audio no disponible'));
        }
    } else {
        console.warn(' Video no encontrado:', selected.id);
        overlay.classList.add('active');
        overlay.style.display = 'flex';
        showTextJumpscare(selected.text);
    }

    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.style.display = 'none';

        if (video) {
            video.pause();
            video.currentTime = 0;
            video.style.display = 'none';
        }

        bgMusic.volume = 0.3;
        isShowingJumpscare = false;

        goToNextQuestion();

    }, selected.isMeme ? 3000 : 2500);
}

function showTextJumpscare(message) {
    const text = document.getElementById('jumpscareText');
    text.textContent = message;
    text.style.fontSize = '5em';
    text.style.color = '#f00';
    text.style.textShadow = '0 0 30px #f00, 0 0 60px #f00';
}

// Tiempo

function startTimer() {
    timeLeft = 20;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft === 15) {
            startBloodDripping();
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    cleanAllBlood();
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    display.textContent = timeLeft;
    display.className = 'timer-display';

    if (timeLeft <= 5) {
        display.classList.add('critical');
    } else if (timeLeft <= 10) {
        display.classList.add('warning');
    }
}

function handleTimeout() {
    if (answered) return;
    answered = true;
    stopTimer();

    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option');

    options.forEach(opt => {
        opt.style.cursor = 'default';
        opt.onclick = null;
    });

    options[q.correct].classList.add('correct');

    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback feedback-incorrect';
    feedback.innerHTML = `<strong> TIEMPO AGOTADO</strong><div class="explanation">${q.explanation}</div>`;
    feedback.classList.remove('hidden');

    createBloodSplatter(options[q.correct]);

    setTimeout(() => triggerJumpscare('timeout'), 1000);
}

function checkRandomScare() {
    if ((currentQuestion === 5 || currentQuestion === 6) && !randomScareShown && Math.random() < 0.5) {
        randomScareShown = true;
        setTimeout(() => triggerJumpscare('random'), 2000);
    }
}


function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentQuestion];
    const container = document.getElementById('quizContainer');

    document.getElementById('progressText').textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
    document.getElementById('progressFill').style.width = ((currentQuestion + 1) / questions.length * 100) + '%';

    container.innerHTML = `
        <div class="question-card">
            <span class="difficulty-badge difficulty-${q.difficulty}">
                ${q.difficulty === 'easy' ? 'Fácil' : 'Difícil'}
            </span>
            <div class="question-number">Pregunta ${currentQuestion + 1}/${questions.length}</div>
            <div class="question-text">${q.question}</div>
            <div class="options">
                ${q.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})">
                        <span class="option-label">${String.fromCharCode(65 + index)})</span>
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div id="feedback" class="feedback hidden"></div>
            <div class="buttons">
                <button class="btn btn-next" id="checkBtn" onclick="checkAnswer()" disabled>
                    Verificar
                </button>
                <button class="btn btn-next hidden" id="nextBtn" onclick="manualNextQuestion()">
                    ${currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver Resultados'}
                </button>
            </div>
        </div>
    `;

    selectedAnswer = null;
    answered = false;
    startTimer();
    checkRandomScare();
}

function selectOption(index) {
    if (answered) return;
    selectedAnswer = index;
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.option')[index].classList.add('selected');
    document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
    if (answered || selectedAnswer === null) return;
    answered = true;
    stopTimer();

    const q = questions[currentQuestion];
    const isCorrect = selectedAnswer === q.correct;
    if (isCorrect) score++;

    const options = document.querySelectorAll('.option');
    options[q.correct].classList.add('correct');
    if (!isCorrect) options[selectedAnswer].classList.add('incorrect');

    const feedback = document.getElementById('feedback');
    feedback.className = `feedback feedback-${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `<strong>${isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}</strong><div class="explanation">${q.explanation}</div>`;
    feedback.classList.remove('hidden');

    if (!isCorrect) {
        createBloodSplatter(options[selectedAnswer]);
    }

    options.forEach(opt => {
        opt.style.cursor = 'default';
        opt.onclick = null;
    });

    document.getElementById('checkBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');

    if (!isCorrect) {
        setTimeout(() => triggerJumpscare('wrong'), 1500);
    }
}

function manualNextQuestion() {
    stopTimer();
    goToNextQuestion();
}

function goToNextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    stopTimer();
    bgMusic.pause();

    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.querySelector('.progress-container').classList.add('hidden');
    document.querySelector('.timer-container').classList.add('hidden');

    const percentage = (score / questions.length * 100).toFixed(0);
    document.getElementById('finalScore').textContent = `${score}/${questions.length}`;

    let title, message;
    if (percentage >= 85) {
        title = ' SOBREVIVISTE';
        message = 'Impresionante. Has dominado el conocimiento prohibido del Machine Learning. Nili te teme ahora.';
    } else if (percentage >= 70) {
        title = ' Bien Hecho';
        message = 'Has sobrevivido con algunas cicatrices. Tu conocimiento del ML Pipeline es sólido, pero cuidado en las sombras...';
    } else if (percentage >= 50) {
        title = ' Apenas Sobreviviste';
        message = 'Escapaste por poco. Los conceptos de ML aún te acechan en la oscuridad. Prepárate mejor para la próxima...';
    } else {
        title = ' No Sobreviviste';
        message = 'Las tinieblas del desconocimiento te consumieron. Estudia los rituales del Machine Learning y regresa... si te atreves.';
    }

    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    scareCount = 0;
    randomScareShown = false;
    isShowingJumpscare = false;
    stopTimer();
    cleanAllBlood();

    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => { });

    document.getElementById('quizContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    document.querySelector('.progress-container').classList.remove('hidden');
    document.querySelector('.timer-container').classList.remove('hidden');

    loadQuestion();
}

function goBack() {
    stopTimer();
    cleanAllBlood();
    bgMusic.pause();
    window.location.href = '../index.html';
}

loadQuestion();