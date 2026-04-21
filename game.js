let currentSlideIndex = 0;
let countdown;
let timeLeft = 10;

const gameContainer = document.getElementById('game-container');
const titleScreen = document.getElementById('title-screen');
const startBtn = document.getElementById('start-btn');
const slideInfo = document.getElementById('slide-info');
const timerDisplay = document.getElementById('timer');
const promptDisplay = document.getElementById('prompt');
const answerDisplay = document.getElementById('answer');
const revealBtn = document.getElementById('reveal-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
    titleScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    currentSlideIndex = 0;
    loadSlide(currentSlideIndex);
}

startBtn.addEventListener('click', initGame);

function loadSlide(index) {
    const slide = gameData[index];
    slideInfo.innerText = `Slide ${index + 1} of ${gameData.length}`;
    
    // Clear previous state
    answerDisplay.classList.add('hidden');
    answerDisplay.innerText = slide.answer;
    
    let content = '';
    
    // Use 'elements' if provided, otherwise fallback to original properties
    const elements = slide.elements || [];
    if (elements.length === 0) {
        if (slide.prompt) elements.push({ type: slide.type === 'emoji' ? 'emoji' : 'placeholder', value: slide.prompt, details: slide.details });
        if (slide.prompt && slide.image) elements.push({ type: 'text', value: '+' });
        if (slide.image) elements.push({ type: 'image', value: slide.image });
    }

    elements.forEach(el => {
        if (el.type === 'emoji') {
            content += `<div>${el.value}</div>`;
        } else if (el.type === 'placeholder') {
            content += `<div class="placeholder-card">${el.value}<br><small>${el.details || ''}</small></div>`;
        } else if (el.type === 'image') {
            content += `<img src="${el.value}" class="slide-img">`;
        } else if (el.type === 'text') {
            content += `<div class="plus-sign">${el.value}</div>`;
        }
    });

    promptDisplay.innerHTML = content;

    revealBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    
    // Always show back button (to go to title screen from slide 1)
    backBtn.style.visibility = 'visible';
    
    startTimer();
}

function backSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        loadSlide(currentSlideIndex);
    } else {
        // Go back to title screen from first slide
        clearInterval(countdown);
        gameContainer.classList.add('hidden');
        titleScreen.classList.remove('hidden');
    }
}

function restartGame() {
    initGame();
}

function startTimer() {
    clearInterval(countdown);
    // 20 seconds for actual game (index 3 and up), 10 seconds for practice/intro
    timeLeft = currentSlideIndex >= 3 ? 20 : 10;
    updateTimerDisplay();
    
    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerDisplay.innerText = "TIME UP!";
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.innerText = timeLeft;
}

function revealAnswer() {
    clearInterval(countdown);
    answerDisplay.classList.remove('hidden');
    revealBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
}

function nextSlide() {
    currentSlideIndex++;
    if (currentSlideIndex < gameData.length) {
        loadSlide(currentSlideIndex);
    } else {
        endGame();
    }
}

function endGame() {
    slideInfo.innerText = "Game Over!";
    timerDisplay.innerText = "🎉";
    promptDisplay.innerText = "Thanks for playing!";
    answerDisplay.classList.add('hidden');
    revealBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

revealBtn.addEventListener('click', revealAnswer);
nextBtn.addEventListener('click', nextSlide);
backBtn.addEventListener('click', backSlide);
restartBtn.addEventListener('click', restartGame);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only allow shortcuts if game has started
    if (gameContainer.classList.contains('hidden')) return;

    if (e.code === 'Space') {
        if (!revealBtn.classList.contains('hidden')) {
            revealAnswer();
        } else if (!nextBtn.classList.contains('hidden')) {
            nextSlide();
        }
    } else if (e.code === 'ArrowLeft') {
        backSlide();
    } else if (e.code === 'KeyR') {
        restartGame();
    }
});
