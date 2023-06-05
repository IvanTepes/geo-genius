const uiFooter = document.querySelector('.footer');
const uiMain = document.querySelector('.main');

const uiDifficulty = document.querySelector('.difficulty');
const uiDifficultyBtnsNode = document.querySelectorAll('.difficulty__btns');
const uiDifficultyBtns = Array.from(uiDifficultyBtnsNode);

const uiMainGameModesNode = document.querySelectorAll('.game-category__card');
const uiMainGameModes = Array.from(uiMainGameModesNode);

const uiGame = document.querySelector('.game');
const uiGameLives = document.querySelector('.game__lives');

const uiFooterBackBtn = document.querySelector('.footer__back-btn');
const uiFooterNextQuestion = document.querySelector(
    '.footer__next-question--btn'
);
const uiFooterResetBtn = document.querySelector('.footer__reset-btn');

const uiModalBackToMain = document.querySelector('.modal__back-to-main');
const uiModalNavBtn = document.querySelector('.navigation__menu');
const uiModalResetGame = document.querySelector('.modal__btn--reset-game');
const uiModalStartGame = document.querySelector('.modal__btn--start-game');

let uiSelectedGameMode, uiSelectedGameDifficulty;
let screenOrientation = window.matchMedia('(orientation: portrait)');

// ! Initial btns setup
if (screenOrientation.matches) {
    // Portrait mode
    uiDifficultyBtns.forEach(btn => {
        btn.style.width = '';
    });
} else {
    // Landscape
    uiDifficultyBtns.forEach(btn => {
        btn.style.width = '7rem';
    });
}

// ! Difficulty btns width on screen rotation
screenOrientation.addEventListener('change', function (e) {
    if (e.matches) {
        // Portrait mode
        uiDifficultyBtns.forEach(btn => {
            btn.style.width = '';
        });
    } else {
        // Landscape
        uiDifficultyBtns.forEach(btn => {
            btn.style.width = '7rem';
        });
    }
});

// ! Navigation menu
uiModalNavBtn.addEventListener('click', () => {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    modalBackdrop.classList.toggle('modal__navigation-backdrop');
});

uiMainGameModes.forEach(gameMode => {
    gameMode.addEventListener('click', () => {
        uiSelectedGameMode = gameMode.getAttribute('data-mode');
        hideMainScreen();
        displayFooter();
        displayDifficultyScreen();
    });
});

uiDifficultyBtns.forEach(difficultyBtn => {
    difficultyBtn.addEventListener('click', () => {
        uiSelectedGameDifficulty =
            difficultyBtn.getAttribute('data-difficulty');
        addModalDataToBackBtn();
        hideDifficultyScreen();
        displayGameScreen();
        displayNextQuestionBtn();
        displayResetBtn();
    });
});

// ! Back Btn
uiFooterBackBtn.addEventListener('click', function () {
    if (uiSelectedGameDifficulty !== undefined) {
        uiModalBackToMain.addEventListener('click', () => {
            uiSelectedGameDifficulty = undefined;
            uiSelectedGameMode = undefined;
            removeModalDataFromBackBtn();
            displayMainScreen();
            hideGameScreen();
            hideNextQuestionBtn();
            hideResetBtn();
            hideFooter();
        });
    } else if (uiSelectedGameMode !== undefined) {
        uiSelectedGameMode = undefined;
        displayMainScreen();
        hideFooter();
        hideDifficultyScreen();
    }
});

uiModalResetGame.addEventListener('click', () => {
    hideGameScreen();
});

uiModalStartGame.addEventListener('click', () => {
    displayGameScreen();
});

// Add Modal classes
function addModalDataToBackBtn() {
    uiFooterBackBtn.setAttribute('data-bs-target', `#backBtnModal`);
    uiFooterBackBtn.setAttribute('data-bs-toggle', 'modal');
}

function removeModalDataFromBackBtn() {
    uiFooterBackBtn.removeAttribute('data-bs-target', `#backBtnModal`);
    uiFooterBackBtn.removeAttribute('data-bs-toggle', 'modal');
}

// Display functions
function displayGameScreen() {
    setTimeout(function () {
        uiGame.classList.add('visible');
        uiGame.classList.remove('hidden');
    }, 1000);
}

function displayDifficultyScreen() {
    uiDifficulty.classList.add('visible');
    uiDifficulty.classList.remove('hidden');
}

function displayMainScreen() {
    uiMain.classList.add('visible');
    uiMain.classList.remove('hidden', 'reduce-height');
}

function displayFooter() {
    uiFooter.classList.add('visible');
    uiFooter.classList.remove('hidden');
    uiFooter.style.height = '3rem';
}

function displayNextQuestionBtn() {
    uiFooterNextQuestion.classList.add('visible');
    uiFooterNextQuestion.classList.remove('hidden');
}

function displayResetBtn() {
    uiFooterResetBtn.classList.add('visible');
    uiFooterResetBtn.classList.remove('hidden');
}

// Hide functions
function hideGameScreen() {
    uiGame.classList.add('hidden');
    uiGame.classList.remove('visible');
}

function hideDifficultyScreen() {
    uiDifficulty.classList.add('hidden');
    uiDifficulty.classList.remove('visible');
}

function hideMainScreen() {
    uiMain.classList.add('hidden', 'reduce-height');
    uiMain.classList.remove('visible');
}

function hideFooter() {
    uiFooter.classList.add('hidden');
    uiFooter.classList.remove('visible');
    uiFooter.style.height = '';
}

function hideNextQuestionBtn() {
    uiFooterNextQuestion.classList.add('hidden');
    uiFooterNextQuestion.classList.remove('visible');
}

function hideResetBtn() {
    uiFooterResetBtn.classList.add('hidden');
    uiFooterResetBtn.classList.remove('visible');
}
