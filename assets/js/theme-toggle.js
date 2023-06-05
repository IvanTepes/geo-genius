// ! MENU BTN

const menuBtn = document.querySelector('.navigation__menu');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('navigation__menu--opened');
    menuBtn.setAttribute(
        'aria-expanded',
        menuBtn.classList.contains('navigation__menu--opened')
    );
});

// ! THEME TOGGLE

// Elements
const themeToggleBtn = document.querySelector('.navigation__theme-toggle');
const htmlDocument = document.firstElementChild;

/* Define a string constant called "storageKey" to store the name of the key in "localStorage"
    where the user's theme preference will be stored
*/
const storageKey = 'theme-preference';

/* Define a function called "getColorPreference" that checks whether the user
    has a stored theme preference in "localStorage"
    If they do, it returns that preference; otherwise, it checks the user's browser preference
    for a dark mode setting and returns 'dark'
    if the browser is set to dark mode, and 'light' otherwise
*/
const getColorPreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey);
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
};

/* Initialize a variable called "themeValue" to the result of calling the "getColorPreference()" function,
    which gets the user's stored or preferred theme preference 
*/
let themeValue = getColorPreference();

/* Define a function called "setPreference" that stores the current "themeValue" in "localStorage"
    using the key "storageKey", and then calls the "reflectPreference()" 
    function to update the page's theme based on the new preference
*/
const setPreference = () => {
    localStorage.setItem(storageKey, themeValue);
    reflectPreference();
};

/* Define a function called "reflectPreference" that sets the "data-theme" attribute
    to the html document to the "themeValue",
    adds the "themeValue" as a class to the same element, 
    and updates the navigation menu icon based on the "themeValue"
    It also sets the "aria-label" attribute of the "theme-toggle" element to the "themeValue"
*/
const reflectPreference = () => {
    htmlDocument.setAttribute('data-theme', themeValue);
    htmlDocument.classList.add(themeValue);

    themeToggleBtn?.setAttribute('aria-label', themeValue);
};

/* Call "reflectPreference()" to set up the initial state of the page
    based on the user's stored or preferred theme preference
*/
reflectPreference();

/* When the window loads, call "reflectPreference()" again to make sure the page is up-to-date
    with the current theme preference, and add an event listener to the "theme-toggle" 
    element that calls the "onClick()" function when it is clicked
*/
window.onload = () => {
    reflectPreference();

    themeToggleBtn.addEventListener('click', onClick);
};

/* Define a function called "onClick" that updates the "themeValue" variable to the
    opposite of its current value, removes any class attributes from the 
    html document, and calls "setPreference()" to store 
    the new preference and update the page's theme accordingly
 */
const onClick = () => {
    themeValue = themeValue === 'light' ? 'dark' : 'light';
    htmlDocument.removeAttribute('class');

    setPreference();
};
