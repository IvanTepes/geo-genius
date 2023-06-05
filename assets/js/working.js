'use strict';

// ! VARIABLE DEFINITION
let gameLives = 3;
let countries = [];
let gameTimeRemaining,
    correctCountry,
    selectedGameCategory,
    selectedGameDifficulty;

// ! ELEMENTS SELECTION
const gameNextQuestionBtn = document.querySelector(
    '.footer__next-question--btn'
);
let gameQuestionText = document.querySelector('.game__question');
const gameCountryFlag = document.querySelector('.game__flag-img');

const gameBackToMain = document.querySelector('.modal__back-to-main');
const gameStartGame = document.querySelector('.modal__btn--start-game');
const gameResetGame = document.querySelector('.modal__btn--reset-game');

// ! ARRAYS FROM ELEMENTS
const gameAnswersBtn = Array.from(
    document.querySelectorAll('.game__answer-btns')
);
const gameCategories = Array.from(
    document.querySelectorAll('.game-category__card')
);
const gameDifficulty = Array.from(
    document.querySelectorAll('.difficulty__btns')
);

//  Countries to remove from API response
const countriesToRemove = [
    'United States Minor Outlying Islands',
    'Bouvet Island',
    'British Indian Ocean Territory',
    'Cocos (Keeling) Islands',
    'French Southern Territories',
    'Heard Island and McDonald Islands',
    'Christmas Island',
    'South Georgia and the South Sandwich Islands',
    'Saint Helena, Ascension and Tristan da Cunha',
    'Pitcairn',
];

//  List of countries to short their names
const countryShortName = {
    'Bolivia (Plurinational State of)': 'Bolivia',
    'Bonaire, Sint Eustatius and Saba': 'Bonaire',
    'Congo (Democratic Republic of the)': 'DR Congo',
    'Iran (Islamic Republic of)': 'Iran',
    "Lao People's Democratic Republic": 'Laos',
    'Micronesia (Federated States of)': 'Micronesia',
    'Moldova (Republic of)': 'Moldova',
    "Korea (Democratic People's Republic of)": 'North Korea',
    'Palestine, State of': 'Palestine',
    'Republic of Kosovo': 'Kosovo',
    'Russian Federation': 'Russia',
    'Saint Martin (French part)': 'Saint Martin',
    'Sint Maarten (Dutch part)': 'Sint Maarten',
    'Korea (Republic of)': 'South Korea',
    'Syrian Arab Republic': 'Syria',
    'Tanzania, United Republic of': 'Tanzania',
    'United Kingdom of Great Britain and Northern Ireland': 'Great Britain',
    'United States of America': 'United States',
    'Venezuela (Bolivarian Republic of)': 'Venezuela',
    'Falkland Islands (Malvinas)': 'Falkland Islands',
};

async function getCountries() {
    const key = 'countries';
    let data = JSON.parse(localStorage.getItem(key));

    if (data) {
        console.log(data);
        console.log('Data exists in local storage.');
        countries = data.map(country => {
            let name = country.name;
            if (countryShortName[name]) {
                name = countryShortName[name];
            }
            return {
                name: name,
                flagImage: country.flags.svg,
                population: country.population,
                independent: country.independent,
                capital: country.capital,
                region: country.region,
                subregion: country.subregion,
            };
        });
    } else {
        const endpoint = 'https://restcountries.com/v2/all';
        try {
            const response = await fetch(endpoint);
            data = await response.json();
            const filteredData = data.filter(
                country => !countriesToRemove.includes(country.name)
            );
            localStorage.setItem(key, JSON.stringify(filteredData));
            countries = filteredData.map(country => {
                let name = country.name;
                if (countryShortName[name]) {
                    name = countryShortName[name];
                }

                return {
                    name: name,
                    flagImage: country.flags.svg,
                    population: country.population,
                    independent: country.independent,
                    capital: country.capital,
                    region: country.region,
                    subregion: country.subregion,
                };
            });
            console.log('Data retrieved from API and stored in local storage.');
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

// Execute function to check if countries data is in local storage
// If is not in storage call API and store data to local storage
getCountries();

// Define a function to generate a question
function generateQuestion() {
    correctCountry = chooseRandomCountry();
    console.log(correctCountry.name);

    // Set the flag image to the chosen country's flag
    setFlagImage(correctCountry.flagImage);

    // Set the text of the question
    setQuestionText(`${selectedGameCategory}`);

    // Generate three wrong answers to accompany the correct answer
    const wrongAnswers = generateWrongAnswers(correctCountry);
    console.log(wrongAnswers);

    // Combine the correct answer and the wrong answers into one array
    const allAnswers = [correctCountry, ...wrongAnswers];
    console.log(allAnswers);

    // Shuffle the answers randomly
    const shuffledAnswers = shuffleArray(allAnswers);

    // Set the text of each answer button to one of the shuffled answers
    setAnswerButtonsText(shuffledAnswers);
}

// Define a function to choose a random country from the array
function chooseRandomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
}

// Define a function to set the flag image
function setFlagImage(imageUrl) {
    gameCountryFlag.src = imageUrl;
}

// Define a function to set the text of the question
function setQuestionText(gameCategory) {
    let questionText = '';

    if (gameCategory === 'flags') {
        questionText = 'Which country does this flag belong to?';
    } else if (gameCategory === 'population') {
        questionText = 'What is the population of this country?';
    } else if (gameCategory === 'capital') {
        questionText = 'What is the capital of this country?';
    }
    gameQuestionText.textContent = questionText;
}

// Define a function to generate three wrong answers for a given country
function generateWrongAnswers(correctCountry) {
    console.log(correctCountry);
    const countriesCopy = [...countries];
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        const randomCountry =
            countriesCopy[Math.floor(Math.random() * countriesCopy.length)];
        if (
            randomCountry.name !== correctCountry.name &&
            !wrongAnswers.includes(randomCountry)
        ) {
            wrongAnswers.push(randomCountry);
        }
    }
    return wrongAnswers;
}

// Check user answer
function checkAnswer(userAnswer) {
    const selectedButton = document.querySelector(
        '.game__answer-btn--selected'
    );
    if (userAnswer === correctCountry.name) {
        selectedButton.classList.add('game__answer--correct');
        displayResult(true);
    } else {
        selectedButton.classList.add('game__answer--incorrect');
        displayResult(false);
    }
}

// Display result to user
function displayResult(isCorrect) {
    const selectedButton = document.querySelector(
        '.game__answer-btn--selected'
    );

    // ... Rest of the code to display the result ...

    // Remove the selected class from the button
    selectedButton.classList.remove('game__answer-btn--selected');
}

// Remove classes from answer btn
function removeAnswerClasses() {
    gameAnswersBtn.forEach(button => {
        button.classList.remove(
            'game__answer--correct',
            'game__answer--incorrect'
        );
    });
}

// Reset answer btn
function resetAnswerButtons() {
    gameAnswersBtn.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '';
    });
}

// Define a function to shuffle an array randomly
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setAnswerButtonsText(answers) {
    const shortLength = 11; // Define the length for short country names
    const mediumLength = 15; // Define the length for medium country names
    const longLength = 18; // Define the length for long country names
    const extraLongLength = 25; // Define the length for long country names

    for (let i = 0; i < gameAnswersBtn.length; i++) {
        const answerButton = gameAnswersBtn[i];
        const answerText = answers[i].name;

        if (gameCategories) {
        } else {
        }
        const answerCountryLength = answerText.length;
        console.log(answerText, answerText.length);

        // Remove all previously added classes
        answerButton.classList.remove(
            'game__answer-btn--short-font',
            'game__answer-btn--medium-font',
            'game__answer-btn--long-font',
            'game__answer-btn--extra-long-font'
        );

        if (
            answerCountryLength >= shortLength &&
            answerCountryLength <= mediumLength
        ) {
            answerButton.classList.add('game__answer-btn--short-font');
        } else if (
            answerCountryLength > mediumLength &&
            answerCountryLength <= longLength
        ) {
            answerButton.classList.add('game__answer-btn--medium-font');
        } else if (
            answerCountryLength > longLength &&
            answerCountryLength <= extraLongLength
        ) {
            answerButton.classList.add('game__answer-btn--long-font');
        } else if (answerCountryLength > extraLongLength) {
            answerButton.classList.add('game__answer-btn--extra-long-font');
        }
        answerButton.textContent = answerText;
    }
}

// ! EVENT LISTENERS

// Attach click event listeners to each game category
// Update the selectedGameCategory
gameCategories.forEach(category => {
    category.addEventListener('click', () => {
        selectedGameCategory = category.getAttribute('data-mode');
        console.log(selectedGameCategory);
    });
});

// Attach click event listeners to each game difficulty
// Update the selectedGameDifficulty
gameDifficulty.forEach(difficulty => {
    difficulty.addEventListener('click', () => {
        selectedGameDifficulty = difficulty.getAttribute('data-difficulty');
        console.log(selectedGameDifficulty);
    });
});

// Reset variable to original state
gameBackToMain.addEventListener('click', () => {
    selectedGameCategory = undefined;
    selectedGameDifficulty = undefined;
    console.log(selectedGameCategory, selectedGameDifficulty);
});

// Game answers btn listener
gameAnswersBtn.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('game__answer-btn--selected');

        const selectedButton = document.querySelector(
            '.game__answer-btn--selected'
        );

        console.log(selectedButton);

        checkAnswer(button.textContent);

        gameAnswersBtn.forEach(btn => {
            selectedButton.style.opacity = '1';
            btn.disabled = true;
        });
    });
});

// Game next question listener
gameNextQuestionBtn.addEventListener('click', () => {
    generateQuestion();
    removeAnswerClasses();
    resetAnswerButtons();
});
