"use strict";

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    });
});

const ageElement = document.getElementById("age");

if (!(ageElement instanceof HTMLSpanElement)) {
    throw new Error('Expected a <span id="age"> element to display the calculated age.');
}

const birthdate = ageElement.dataset.birthdate;
const birthdateParts = birthdate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);

if (!birthdateParts) {
    throw new Error('The age element must have a valid YYYY-MM-DD data-birthdate.');
}

const [, year, month, day] = birthdateParts;
const birthday = new Date(Number(year), Number(month) - 1, Number(day));
const today = new Date();

let years = today.getFullYear() - birthday.getFullYear();
let months = today.getMonth() - birthday.getMonth();
let days = today.getDate() - birthday.getDate();

// Adjust for negative values
if (days < 0) {
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    months--;
}

if (months < 0) {
    months += 12;
    years--;
}

// check if it is a 1
if (days === 1) {
    days = "a day";
} else {
    days = `${days} days`;
}

if (months === 1) {
    months = "a month";
} else {
    months = `${months} months`;
}

ageElement.textContent = `${years} years & ${months} & ${days}`;

// Fades marked elements based on their viewport position.
function initializeScrollFade() {
    const fadeElements = document.querySelectorAll(".fade-on-scroll");
    if (!("IntersectionObserver" in window)) {
        fadeElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px"
    });

    fadeElements.forEach((element) => observer.observe(element));
}

initializeScrollFade();
