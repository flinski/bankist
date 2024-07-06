'use strict'

////////////////////////////////
// Variables
////////////////////////////////

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const buttonCloseModal = document.querySelector('.btn--close-modal')
const buttonsOpenModal = document.querySelectorAll('.btn--show-modal')
const buttonScrollTo = document.querySelector('.btn--scroll-to')
const sectionFeatures = document.querySelector('#section--1')
const links = document.querySelector('.nav__links')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const navigation = document.querySelector('.nav')
const header = document.querySelector('.header')
const sections = document.querySelectorAll('.section')
const lazyImages = document.querySelectorAll('img[data-src]')
const slides = document.querySelectorAll('.slide')
const sliderButtonLeft = document.querySelector('.slider__btn--left')
const sliderButtonRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots')

const navigationRect = navigation.getBoundingClientRect()

const numberOfSlides = slides.length
let currentSlide = 0

////////////////////////////////
// Functions
////////////////////////////////

const openModal = function (event) {
	event.preventDefault()
	modal.classList.remove('hidden')
	overlay.classList.remove('hidden')
}

const closeModal = function () {
	modal.classList.add('hidden')
	overlay.classList.add('hidden')
}

const scrollTo = function () {
	sectionFeatures.scrollIntoView({
		behavior: 'smooth',
	})
}

const scrollToSections = function (event) {
	event.preventDefault()

	if (!event.target.classList.contains('nav__link')) {
		return
	}

	const id = event.target.getAttribute('href')
	const section = document.querySelector(id)

	section.scrollIntoView({
		behavior: 'smooth',
	})
}

const switchTab = function (event) {
	const currentTab = event.target.closest('.operations__tab')

	// Guard clause
	if (!currentTab) {
		return
	}

	tabs.forEach((tab) => {
		tab.classList.remove('operations__tab--active')
	})
	currentTab.classList.add('operations__tab--active')

	const currentTabContent = document.querySelector(
		`.operations__content--${currentTab.dataset.tab}`
	)

	tabsContent.forEach((tabContent) => {
		tabContent.classList.remove('operations__content--active')
	})
	currentTabContent.classList.add('operations__content--active')
}

const handleHover = function (event) {
	if (!event.target.classList.contains('nav__link')) {
		return
	}

	const currentLink = event.target
	const linksList = currentLink.closest('.nav').querySelectorAll('.nav__link')
	const logo = currentLink.closest('.nav').querySelector('img')

	linksList.forEach((link) => {
		if (link !== currentLink) {
			link.style.opacity = this
		}
	})
	logo.style.opacity = this
}

const goToSlide = function (currentSlide) {
	slides.forEach((slide, index) => {
		slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`
	})
}

const nextSlide = function () {
	if (currentSlide >= numberOfSlides - 1) {
		currentSlide = 0
	} else {
		currentSlide += 1
	}

	goToSlide(currentSlide)
	activateDot(currentSlide)
}

const previousSlide = function () {
	if (currentSlide <= 0) {
		currentSlide = numberOfSlides - 1
	} else {
		currentSlide -= 1
	}

	goToSlide(currentSlide)
	activateDot(currentSlide)
}

const createDots = function () {
	slides.forEach((_, index) => {
		dotContainer.insertAdjacentHTML(
			'beforeend',
			`
		<button class="dots__dot" data-slide="${index}"></button>
		`
		)
	})
}

const specificSlide = function (event) {
	if (!event.target.classList.contains('dots__dot')) {
		return
	}

	const currentSlide = event.target.dataset.slide

	goToSlide(currentSlide)
	activateDot(currentSlide)
}

const activateDot = function (slide) {
	const dots = document.querySelectorAll('.dots__dot')

	dots.forEach((dot) => {
		dot.classList.remove('dots__dot--active')
	})

	const activeDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`)

	activeDot.classList.add('dots__dot--active')
}

const initialization = function () {
	createDots()
	goToSlide(currentSlide)
	activateDot(currentSlide)
}

////////////////////////////////
// Initialization
////////////////////////////////

initialization()

////////////////////////////////
// Adding event listeners
////////////////////////////////

buttonsOpenModal.forEach((buttonOpenModal) => buttonOpenModal.addEventListener('click', openModal))
buttonCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)
buttonScrollTo.addEventListener('click', scrollTo)
links.addEventListener('click', scrollToSections)
tabsContainer.addEventListener('click', switchTab)
navigation.addEventListener('mouseover', handleHover.bind(0.5))
navigation.addEventListener('mouseout', handleHover.bind(1))
sliderButtonRight.addEventListener('click', nextSlide)
sliderButtonLeft.addEventListener('click', previousSlide)
dotContainer.addEventListener('click', specificSlide)

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal()
	}
})
document.addEventListener('keydown', function (event) {
	if (event.key === 'ArrowRight') {
		nextSlide()
	}
	if (event.key === 'ArrowLeft') {
		previousSlide()
	}
})

////////////////////////////////
// Adding event observers
////////////////////////////////

const stickyHeaderObserver = new IntersectionObserver(
	([entry]) => {
		if (entry.isIntersecting) {
			navigation.classList.remove('sticky')
		} else {
			navigation.classList.add('sticky')
		}
	},
	{
		root: null,
		threshold: 0,
		rootMargin: `-${navigationRect.height}px`,
	}
)
stickyHeaderObserver.observe(header)

const sectionObserver = new IntersectionObserver(
	(entries, observer) => {
		const [entry] = entries

		if (!entry.isIntersecting) {
			return
		}

		entry.target.classList.remove('section--hidden')

		observer.unobserve(entry.target)
	},
	{
		root: null,
		threshold: 0.15,
	}
)
sections.forEach((section) => {
	sectionObserver.observe(section)
	section.classList.add('section--hidden')
})

const lazyImagesObserver = new IntersectionObserver(
	(entries, observer) => {
		const [entry] = entries

		if (!entry.isIntersecting) {
			return
		}

		entry.target.src = entry.target.dataset.src

		entry.target.addEventListener('load', () => {
			entry.target.classList.remove('lazy-img')
		})

		observer.unobserve(entry.target)
	},
	{
		root: null,
		threshold: 0,
		rootMargin: `200px`,
	}
)
lazyImages.forEach((lazyImage) => {
	lazyImagesObserver.observe(lazyImage)
})
