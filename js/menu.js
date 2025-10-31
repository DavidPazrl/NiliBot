const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

// Murcielagos SVG 
function createBat() {
    const bat = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    bat.setAttribute('class', 'bat-svg');
    bat.setAttribute('viewBox', '0 0 60 40');
    bat.style.top = Math.random() * 60 + 10 + '%';
    bat.style.animationDuration = (12 + Math.random() * 8) + 's';
    bat.style.animationDelay = Math.random() * 3 + 's';

    bat.innerHTML = `
                <path d="M 5,20 Q 0,10 5,5 Q 10,10 15,15 Q 20,10 25,10 Q 28,12 30,15 Q 32,12 35,10 Q 40,10 45,15 Q 50,10 55,5 Q 60,10 55,20 L 50,25 Q 45,22 40,25 Q 35,22 30,22 Q 25,22 20,25 Q 15,22 10,25 Z" 
                      fill="#1a0a2e" stroke="#000" stroke-width="1"/>
                <ellipse cx="30" cy="18" rx="8" ry="6" fill="#2a1a3e"/>
                <circle cx="27" cy="17" r="2" fill="red"/>
                <circle cx="33" cy="17" r="2" fill="red"/>
                <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite"/>
            `;

    document.body.appendChild(bat);
    setTimeout(() => bat.remove(), 20000);
}

setInterval(createBat, 2500);
createBat();
createBat();

// Control de musica
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = ' Música';
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play().catch(e => {
            console.log('No se pudo reproducir la musica:', e);
        });
        musicToggle.textContent = ' Musica';
        musicToggle.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
}

const thunderSound = new Audio('thunder.mp3');

setInterval(() => {
    if (isMusicPlaying) {
        thunderSound.play().catch(e => console.log('Thunder sound not available'));
    }
}, 10000);

setTimeout(() => {
    document.getElementById('progressFill').style.width = '33%';
}, 500);

// Particulas de polvo
const robotContainer = document.querySelector('.robot-container');
const robot = document.getElementById('robot');

setInterval(() => {
    const dust = document.createElement('div');
    dust.className = 'dust-particle';
    const robotRect = robot.getBoundingClientRect();
    const containerRect = robotContainer.getBoundingClientRect();

    dust.style.left = (robotRect.left - containerRect.left + 60) + 'px';
    robotContainer.appendChild(dust);

    setTimeout(() => dust.remove(), 1000);
}, 500);

// Actualizar barra de progreso
function updateProgress() {
    const robotRect = robot.getBoundingClientRect();
    const containerRect = robotContainer.getBoundingClientRect();
    const progress = Math.max(0, Math.min(100,
        ((robotRect.left - containerRect.left) / containerRect.width) * 100
    ));

    document.getElementById('progressFill').style.width = progress + '%';
}

setInterval(updateProgress, 100);

// Manejo de seleccion de nivel
const progressFill = document.getElementById('progressFill');
const cards = document.querySelectorAll('.level-card');

cards.forEach(card => {
    card.addEventListener('click', function () {
        const level = this.dataset.level;

        let levelName = '';
        if (level === 'baby') levelName = 'Bebé ';
        else if (level === 'kid') levelName = 'Aprendiz ';
        else levelName = 'Experto ';
        document.querySelector('.container').style.animation = 'fadeOut 0.5s ease-out';

        setTimeout(() => {
            window.location.href = `pages/game_${level}.html`;
        }, 500);
    });
});

function showInfo() {
    alert(' PROYECTO: El Aprendizaje de Nili - EDICION HALLOWEEN \n\n' +
        ' Observa cómo Nili evoluciona de izquierda a derecha:\n' +
        '- Empieza pequeño y gateando (bebe)\n' +
        '. Crece mientras avanza (aprendiz)\n' +
        '- Termina grande y experto (maestro)\n\n' +
        ' Esto representa su aprendizaje en ML:\n' +
        '   Datos -> Entrenamiento -> IA Experta\n\n' +
        ' Temas: Machine Learning Pipeline\n' +
        ' Equipo: Machine Learning\n' +
        ' Curso: No nos jale profe\n\n' +
        ' ¡Feliz Halloween! ');
}

// Efecto de hover en las tarjetas - velocidad de Nili
cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        const level = this.dataset.level;

        if (level === 'baby') {
            robot.style.animationDuration = '20s'; 
        } else if (level === 'kid') {
            robot.style.animationDuration = '15s'; 
        } else {
            robot.style.animationDuration = '10s'; 
        }
    });

    card.addEventListener('mouseleave', function () {
        robot.style.animationDuration = '15s'; 
    });
});

function goToQuiz() {
    const overlay = document.getElementById('bloodOverlay');
    overlay.classList.add('active');
    createBloodDrops(overlay);
    const screamSound = new Audio('sound/risa.mp3');
    screamSound.play().catch(e => console.log('No sound available'));
    setTimeout(() => {
        window.location.href = '../quizfold/quiz.html'; 
    }, 2500);
}
// Gotas de sangre
function createBloodDrops(container) {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';

        const left = Math.random() * 100;
        const size = Math.random() * 15 + 8;
        const duration = Math.random() * 1.5 + 1;
        const delay = Math.random() * 0.8;

        drop.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: -50px;
            width: ${size}px;
            height: ${size * 2.5}px;
            background: linear-gradient(to bottom, #8b0000 0%, #6b0000 40%, transparent 100%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            opacity: 0.9;
            animation: bloodFall ${duration}s ease-in ${delay}s forwards;
            filter: blur(0.5px);
            box-shadow: 0 0 5px rgba(139, 0, 0, 0.8);
        `;

        container.appendChild(drop);
        setTimeout(() => drop.remove(), (duration + delay) * 1000);
    }

    // Manchas
    setTimeout(() => {
        createBloodSplatters(container);
    }, 800);
}

function createBloodSplatters(container) {
    for (let i = 0; i < 8; i++) {
        const splatter = document.createElement('div');
        splatter.className = 'blood-splatter';

        const left = Math.random() * 80 + 10;
        const top = Math.random() * 60 + 20;
        const size = Math.random() * 80 + 40;

        splatter.style.cssText = `
            position: absolute;
            left: ${left}%;
            top: ${top}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #6b0000 0%, #4a0000 40%, transparent 70%);
            border-radius: ${Math.random() * 50 + 30}% ${Math.random() * 50 + 30}% 
                           ${Math.random() * 50 + 30}% ${Math.random() * 50 + 30}%;
            opacity: 0;
            animation: splatterAppear 0.3s ease-out forwards;
            filter: blur(1px);
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
        `;

        container.appendChild(splatter);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes bloodFall {
        0% {
            transform: translateY(0) scaleY(0.8);
            opacity: 0.9;
        }
        80% {
            transform: translateY(${window.innerHeight + 50}px) scaleY(2);
            opacity: 0.6;
        }
        100% {
            transform: translateY(${window.innerHeight + 100}px) scaleY(2.5);
            opacity: 0;
        }
    }
    
    @keyframes splatterAppear {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.2);
        }
        100% {
            opacity: 0.6;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
