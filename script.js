`use strict`;

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.getElementById(`section--1`);
const section2 = document.getElementById(`section--2`);
const section3 = document.getElementById(`section--3`);

const modal = document.querySelector(`.modal`);
const overlay = document.querySelector(`.overlay`);
const btnCLoseModal = document.querySelector(`.btn--close-modal`);
const btnOpenModal = document.querySelectorAll(`.btn--show-modal`);

const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);

const tabsContent = document.querySelectorAll(`.operations__content`);

const nav = document.querySelector(`.nav`);

//////////////////////////////////////////////////
/////////MODAL WINDOW

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
};

const closeModal = function () {
  modal.classList.add(`hidden`);
  overlay.classList.add(`hidden`);
};


btnOpenModal.forEach((btn) => btn.addEventListener(`click`, openModal));

btnCLoseModal.addEventListener(`click`, closeModal);
overlay.addEventListener(`click`, closeModal);

document.addEventListener(`keydown`, function (e) {
  if (e.key === `Escape` && !modal.classList.contains(`hidden`)) {
    closeModal();
  }
});

////////////////////////////////////////////////////
//////SMOOTH SCROLLING

btnScrollTo.addEventListener(`click`, function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log(`current scroll(X,Y)`, window.pageXOffset, window.pageYOffset);

  console.log(
    `height and width:`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // SCROLLING
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });

  // MORDERN WAY
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////////////////////////////////////////
/////////////////////////////PAGE NAVIGATION


// EVENT DELEGATION
// 1. Add event listner to common parent element
// 2.Determine what element originated the EVENT

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  console.log(e.target);
  e.preventDefault();

  // Matching stategy
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    console.log(id);

    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});


// EVENT DELEGATION
tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);
  console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // Remove Active Areas
  tabs.forEach((t) => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach((t) => t.classList.remove(`operations__content--active`));

  // Active Tab
  clicked.classList.add(`operations__tab--active`);


  // Activate Centent Area
  console.log(clicked.dataset.tab);

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

// Menu Fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener(`mouseover`, handleHover.bind(0.5));

nav.addEventListener(`mouseout`, handleHover.bind(1));


// STICKY NAVIGAITON: INTERSECTION OBSERVER API

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;

  // console.log(entry);

  !entry.isIntersecting
    ? nav.classList.add(`sticky`)
    : nav.classList.remove(`sticky`);
};

const headerObsrvr = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObsrvr.observe(header);

// REVEL SECTIONS
const allSections = document.querySelectorAll(`.section`);

const revelSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);

  observer.unobserve(entry.target);
};

const sectionObservr = new IntersectionObserver(revelSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObservr.observe(section);
  // section.classList.add(`section--hidden`);
});

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);

const loadImg = function (entires, observer) {
  const [entry] = entires;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `+200px`,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const dotContainer = document.querySelector(`.dots`);

  let currSlide = 0;
  const maxSlide = slides.length;


  // Functions
  const createDots = function () {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach((dot) => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSldie = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * [i - slide]}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    currSlide === maxSlide - 1 ? (currSlide = 0) : currSlide++;

    goToSldie(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    currSlide === 0 ? (currSlide = maxSlide - 1) : currSlide--;

    goToSldie(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    goToSldie(0);
    // 0%, 100%, 200%, 300%

    createDots();

    activateDot(currSlide);
  };
  init();

  // Event-Handlers
  btnRight.addEventListener(`click`, nextSlide);
  // CurrSlide=1: -100%,0%, 100%, 200%

  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    // console.log(e);

    if (e.key === `ArrowLeft`) prevSlide();
    if (e.key === `ArrowRight`) nextSlide();
    // e.key === `ArrowRight` && nextSlide();
  });

  dotContainer.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      const { slide } = e.target.dataset;
      goToSldie(slide);
      activateDot(slide);
    }
  });
};

slider();
