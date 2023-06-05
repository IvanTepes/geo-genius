'use strict';

//  GAME --> VARIABLES
const gameLives = 3;
let countries = [];
let selectedGameCategory, selectedGameDifficulty;

//  GAME --> CATEGORY
const gameCategories = Array.from(
    document.querySelectorAll('.game-category__card')
);

//  GAME --> DIFFICULTY
const gameDifficulty = Array.from(
    document.querySelectorAll('.difficulty__btn')
);

//  GAME --> NEXT QUESTION BTN
const gameNextQuestionBtn = document.querySelector(
    '.footer__next-question--btn'
);

//  GAME --> QUESTION TEXT
const gameQuestionText = document.querySelector('.game__question');

//  GAME --> COUNTRY FLAG
const gameCountryFlag = document.querySelector('.game__flag-img');

// GAME --> GAME LIVES
const gameContainerLives = document.querySelector('.game__lives');

// GAME --> TIME REMAINING
const gameTimeRemaining = document.querySelector('.game__time');

//  GAME --> ANSWERS BTN's
const gameAnswersBtn = Array.from(
    document.querySelectorAll('.game__answer-btns')
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
            };
        });
    } else {
        const endpoint = 'https://restcountries.com/v2/all';
        try {
            const response = await fetch(endpoint);
            console.log(response);
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

/* 
    Attach click event listeners to each game category
    Update the selectedGameCategory
*/
gameCategories.forEach(category => {
    category.addEventListener('click', () => {
        selectedGameCategory = category.getAttribute('data-mode');
        console.log(selectedGameCategory);
    });
});

/* 
    Attach click event listeners to each game difficulty
    Update the selectedGameDifficulty
*/
gameDifficulty.forEach(difficulty => {
    difficulty.addEventListener('click', () => {
        selectedGameDifficulty = difficulty.getAttribute('data-difficulty');
        console.log(selectedGameDifficulty);
    });
});

/* 
    Attach click event listeners to next question button
    Remove font size style 
    Generate next question
*/
gameNextQuestionBtn.addEventListener('click', () => {
    generateQuestion();
    gameAnswersBtn.forEach(button => {
        if (button.getAttribute('style') !== null) {
            button.style.fontSize = '';
        }

        if (
            button.classList.contains('game__answer--correct') ||
            button.classList.contains('game__answer--incorrect')
        ) {
            button.classList.remove('game__answer--correct');
            button.classList.remove('game__answer--incorrect');
            button.classList.add('game__answer-style');
        }
    });
});

// Define a function to generate a question
function generateQuestion() {
    // Choose a random country from the array of countries
    const correctCountry = chooseRandomCountry();
    console.log(correctCountry.name);

    // Set the flag image to the chosen country's flag
    setFlagImage(correctCountry.flagImage);

    // Set the text of the question
    setQuestionText(`Which country does this flag belong to?`);

    // Generate three wrong answers to accompany the correct answer
    const wrongAnswers = generateWrongAnswers(correctCountry);

    // Combine the correct answer and the wrong answers into one array
    const allAnswers = [correctCountry, ...wrongAnswers];

    // Shuffle the answers randomly
    const shuffledAnswers = shuffleArray(allAnswers);

    // Set the text of each answer button to one of the shuffled answers
    setAnswerButtonsText(shuffledAnswers);

    // Add an event listener to each answer button
    addAnswerButtonListeners(correctCountry);
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
function setQuestionText(text) {
    gameQuestionText.textContent = text;
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

// Define a function to shuffle an array randomly
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Define a function to set the text of each answer button
function setAnswerButtonsText(answers) {
    for (let i = 0; i < gameAnswersBtn.length; i++) {
        let numWords = answers[i].name.length;
        console.log(numWords);
        if (numWords >= 13) {
            gameAnswersBtn[i].style.fontSize = '0.6rem';
        }
        gameAnswersBtn[i].textContent = answers[i].name;
    }
}

// Define a function to add event listeners to each answer button
function addAnswerButtonListeners(correctCountry) {
    console.log(correctCountry);
    gameAnswersBtn.forEach(button => {
        button.addEventListener('click', () => {
            // Check if the clicked button's text content matches the correct answer
            if (button.textContent === correctCountry.name) {
                button.classList.remove('game__answer-style');
                button.classList.add('game__answer--correct');
            } else {
                button.classList.remove('game__answer-style');
                button.classList.add('game__answer--incorrect');
            }
        });
    });
}

gameContainerLives.innerHTML = '';

for (let i = 0; i < gameLives; i++) {
    // To empty html element first
    const html = `
        <span class='game__lives--${i + 1}'>
                <svg xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="1rem"
                height="1rem"
                viewBox="0 0 256 256"
                xml:space="preserve">
            <defs>
            </defs>
                <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                    <path d="M 45 10.715 c 4.77 -4.857 11.36 -7.861 18.64 -7.861 C 78.198 2.854 90 14.87 90 29.694 c 0 35.292 -36.812 34.15 -45 57.453 C 36.812 63.843 0 64.986 0 29.694 C 0 14.87 11.802 2.854 26.36 2.854 C 33.64 2.854 40.23 5.858 45 10.715 z"
                            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(211,28,28); fill-rule: nonzero; opacity: 1;"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round" />
                </g>
            </svg>
        </span>`;
    gameContainerLives.insertAdjacentHTML('afterbegin', html);
}
