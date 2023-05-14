const popupForm = document.querySelector(".form-popup__form");
const validationPopupCloseButton = document.querySelector(".validation-popup__close-button");
const popupItems = document.querySelectorAll(".link_popup");
const popupRightLink = document.querySelector(".popup__link_right");
const popupLeftLink = document.querySelector(".popup__link_left");
const oPopup = document.querySelector(".popup");
const oFormPopup = document.querySelector(".form-popup");
const oTimePopup = document.querySelector(".time-popup");
const oValidationPopup = document.querySelector(".validation-popup");
const timePopupButton = document.querySelector(".time-popup__close-button");
const formClosePopupButton = document.querySelector(".form-popup__close-button");
const setValidation = function () {
    const forms = document.querySelectorAll('.form-popup__form');
    forms.forEach((form) => {
        setEventListeners(form);
    })
}

const setEventListeners = function (form) {
    const inputs = form.querySelectorAll('input');
    const button = form.querySelector('.form-popup__button');
    disabledButton(inputs, button);
    inputs.forEach((input) => {
        isValid(form, input, inputs, button);
    })
    inputs.forEach((input) => {
        input.addEventListener('input', function () {
            isValid(form, input, inputs, button);
        })
    })
}


const checkEmail = function (input) {
    const inputValue = input.value.split(".");
    const emailEnd = inputValue.pop();
    return emailEnd.length < 2 || emailEnd.length > 6 || !(/[a-z]/i.test(emailEnd));
}

const checkText = function (input) {
    return /[а-яА-Я0-9 .,^<>:;'"|]/i.test(input.value);
}

const checkTel = function (input) {
    const inputValue = input.value.split("+");
    const telEnd = inputValue.pop();
    return Number.isNaN(Number(telEnd)) || telEnd.length !== 11 || (inputValue.length === 1 && inputValue[0] !== "") || inputValue.length > 1;
}

const isValid = function (form, input, inputs, button) {
    if (input.id) {
        if (!input.validity.valid || (input.type === "email" && checkEmail(input)) || (input.type === "tel" && checkTel(input)) || (input.type === "text" && !checkText(input))) {
            showInputError(form, input, input.validationMessage);
            disabledButton(inputs, button);
        }
        else {
            hideInputError(form, input);
            disabledButton(inputs, button);
        }
    }
}

const showInputError = function (form, input) {
    input.classList.add('error');
    const span = document.querySelector(`.${input.id}-error`);
    span.textContent = "ошибка";
    span.classList.add('show');
}

const hideInputError = function (form, input) {
    input.classList.remove('error');
    const span = document.querySelector(`.${input.id}-error`);
    span.classList.remove('show');
}

const disabledButton = function (inputs, button) {
    let fl = 1;
    inputs.forEach((input) => {
        if (input.classList.contains("error")) {
            fl = 0;
            button.setAttribute('disabled', 'disabled');
            button.classList.add('disabled');
            return 0;
        }
    })
    if (fl === 1) {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
    }
}

setValidation();

const formSubmission = function () {
    popupForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        console.log("submit");
        const button = document.querySelector(".form-popup__button");
        button.textContent = "Отправка";
        const {tel, email, text} = evt.currentTarget.elements;
        createPost({
            tel: tel.value,
            email: email.value,
            text: text.value
        })
    })
}

formSubmission();

const createPost = function (post) {
    console.log("Отправка");
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'charset=UTF-8'
        },
        body: JSON.stringify({
            tel: post.tel,
            email: post.email,
            text: post.text
        })
    })
    .then(successfulValid)
}

const successfulValid = function () {
    const button = document.querySelector(".form-popup__button");
    button.textContent = "Отправить";
    const validationPopup = document.querySelector(".validation-popup");
    validationPopup.classList.add("validation-popup_open");
    const formPopup = document.querySelector(".form-popup_open");
    formPopup.classList.remove("form-popup_open");
    formPopup.querySelector(".form-popup__form").reset();
    formPopup.setAttribute("style", "z-index: -1000");
}

const validationPopupClose = function () {
    validationPopupCloseButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        const validationPopup = document.querySelector(".validation-popup_open");
        validationPopup.classList.remove("validation-popup_open");
    })
}

validationPopupClose();

const checkLinks = function (img) {
    const imgParent = img.parentElement;
    if (!imgParent.nextElementSibling) {
        const popupRightLink = document.querySelector(".popup__link_right");
        popupRightLink.setAttribute('style', 'display: none');
    }
    else {
        const popupRightLink = document.querySelector(".popup__link_right");
        popupRightLink.setAttribute('style', 'display: block');
    }
    if (!imgParent.previousElementSibling) {
        const popupLeftLink = document.querySelector(".popup__link_left");
        popupLeftLink.setAttribute('style', 'display: none');
    }
    else {
        const popupLeftLink = document.querySelector(".popup__link_left");
        popupLeftLink.setAttribute('style', 'display: block');
    }
}

const openGallery = function () {
    popupItems.forEach((item) => {
        item.addEventListener('click', function (evt) {
            evt.preventDefault();
            const popup = document.querySelector(".popup");
            popup.classList.add("popup_open");
            const imgLink = evt.currentTarget.getAttribute('href');
            const img = evt.currentTarget;
            img.classList.add('active');
            const popupImage = document.querySelector(".popup__image");
            if (img.classList.contains("video")) {
                popupImage.innerHTML = `<video src="${imgLink}" style="max-width: 100%"  autoplay muted loop>`;
            }
            else {
                popupImage.innerHTML = `<img src="${imgLink}"alt="Картинка" style="max-width: 100%">`;
            }
            checkLinks(img);
        })
    })
}

openGallery();

const rightSwipe = function () {
    popupRightLink.addEventListener('click', function(evt) {
        evt.preventDefault();
        const img = document.querySelector(".active");
        const imgLink = img.parentElement.nextElementSibling.firstElementChild.getAttribute("href");
        const popupImage = document.querySelector(".popup__image");
        if (img.parentElement.nextElementSibling.firstElementChild.classList.contains("video")) {
            popupImage.innerHTML = `<video src="${imgLink}" style="max-width: 100%"  autoplay muted loop>`;
        }
        else {
            popupImage.innerHTML = `<img src="${imgLink}"alt="Картинка" style="max-width: 100%">`;
        }
        img.classList.remove("active");
        const nextImg = img.parentElement.nextElementSibling.firstElementChild;
        nextImg.classList.add("active");
        checkLinks(nextImg);
    })
}

const leftSwipe = function () {
    popupLeftLink.addEventListener('click', function(evt) {
        evt.preventDefault();
        const img = document.querySelector(".active");
        const imgLink = img.parentElement.previousElementSibling.firstElementChild.getAttribute("href");
        const popupImage = document.querySelector(".popup__image");
        if (img.parentElement.previousElementSibling.firstElementChild.classList.contains("video")) {
            popupImage.innerHTML = `<video src="${imgLink}" style="max-width: 100%"  autoplay muted loop>`;
        }
        else {
            popupImage.innerHTML = `<img src="${imgLink}"alt="Картинка" style="max-width: 100%">`;
        }
        img.classList.remove("active");
        const previousImg = img.parentElement.previousElementSibling.firstElementChild;
        previousImg.classList.add("active");
        checkLinks(previousImg);
    })
}

rightSwipe();
leftSwipe();

const closePopupOverlay = function () {
    document.addEventListener('click', function(evt){
        if(evt.target === oPopup && oPopup.classList.contains("popup_open")){
            const img = document.querySelector(".active");
            img.classList.remove("active");
            oPopup.classList.remove("popup_open");
            oPopup.querySelectorAll('.popup').forEach((popupItem) => {
                popupItem.classList.remove("popup_active");
            });
        }
        if (evt.target === oFormPopup && oFormPopup.classList.contains("form-popup_open")) {
            evt.preventDefault();
            changeClass();
            setTimeout(changeZIndex, 500);
        }
        if (evt.target === oTimePopup && oTimePopup.classList.contains("time-popup_open")) {
            evt.preventDefault();
            localStorage.setItem("hello-flag", "true");
            const popupHello = document.querySelector(".time-popup_open");
            popupHello.classList.remove("time-popup_open");
        }
        if (evt.target === oValidationPopup && oValidationPopup.classList.contains("validation-popup_open")) {
            oValidationPopup.classList.remove("validation-popup_open");
        }
    });
}

closePopupOverlay();

const helloPopupOpen = function() {
    const popupHello = document.querySelector(".time-popup");
    popupHello.classList.add("time-popup_open");
}

const sayHello = function () {
    if (!localStorage.getItem("hello-flag")) {
        setTimeout(helloPopupOpen, 30000);
    }
}

sayHello();

const helloPopupClose = function () {
    timePopupButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        localStorage.setItem("hello-flag", "true");
        const popupHello = document.querySelector(".time-popup_open");
        popupHello.classList.remove("time-popup_open");
    })
}

helloPopupClose();

const changeClass = function() {
    const formPopup = document.querySelector(".form-popup");
    formPopup.classList.toggle("form-popup_open");
}

const changeZIndex = function() {
    const formPopup = document.querySelector(".form-popup");
    formPopup.setAttribute('style', 'z-index: -1000');
}

const formClosePopup = function() {
    formClosePopupButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        changeClass();
        setTimeout(changeZIndex, 500);
    })
}

formClosePopup();

const formButtonContact = document.querySelector(".footer__button-contact");

const formButtonContactClose = function () {
    formButtonContact.addEventListener('click', function (evt) {
        evt.preventDefault();
        const formPopup = document.querySelector(".form-popup");
        formPopup.setAttribute("style", "z-index: 1000");
        changeClass();
    })
}

formButtonContactClose();

const formButtonTheme = document.querySelector(".footer__button-theme");

const changeTheme = function () {
    formButtonTheme.addEventListener('click', function (evt) {
        evt.preventDefault();
        const page = document.querySelector(".page");
        page.classList.toggle("page_dark-theme");
        const header = document.querySelector(".header");
        header.classList.toggle("header_theme-dark");
        const links = document.querySelectorAll(".link");
        links.forEach((link) => {
            link.classList.toggle("link_theme-dark");
        })
        const footer = document.querySelector(".footer");
        footer.classList.toggle("footer_theme-dark");
        const lines = document.querySelectorAll(".break-line");
        lines.forEach((line) => {
            line.classList.toggle("break-line_theme-dark");
        })
        const photo1 = document.querySelector(".project-list__background");
        if (!photo1.classList.contains("project-list__background_theme-dark")) {
            photo1.setAttribute("src", "./images/kot(2).png");
            photo1.classList.add("project-list__background_theme-dark");
        }
        else {
            photo1.setAttribute("src", "./images/photo-kot.webp");
            photo1.classList.remove("project-list__background_theme-dark");
        }
        const photo2 = document.querySelector(".interests-list__background");
        if (!photo2.classList.contains("interests-list__background_theme-dark")) {
            photo2.setAttribute("src", "./images/kot(1).png");
            photo2.classList.add("interests-list__background_theme-dark");
        }
        else {
            photo2.setAttribute("src", "./images/photo_kitten.webp");
            photo2.classList.remove("interests-list__background_theme-dark");
        }
        const link = evt.target;
        if (link.textContent === "Темная тема") {
            link.textContent = "Светлая тема";
        }
        else {
            link.textContent = "Темная тема";
        }
    })
}

changeTheme();

const rainButton = document.querySelector(".footer__button-rain");

const rainOpen = function () {
    rainButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (window.innerWidth >= 800) {
            const rain = document.querySelector(".rain");
            rain.classList.add("rain_open");
            rain.classList.add("rain_animation");
        }
    })
}

rainOpen();

const rain = document.querySelector(".rain");

const rainStop = function () {
    window.addEventListener('resize', function () {
        if (rain.classList.contains("rain_open")) {
            rain.classList.toggle("rain_animation");
        }
    })
}

rainStop();

const rainClose = function () {
    rain.addEventListener('click', function () {
        if (rain.classList.contains("rain_open")) {
            rain.classList.remove("rain_open");
        }
    })
}

rainClose();