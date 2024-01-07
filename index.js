// Clearing the console
console.clear();

// Destructuring assignment to extract gsap and imagesLoaded from the window object
const { gsap, imagesLoaded } = window;

// Selecting DOM elements
const buttons = {
	prev: document.querySelector(".btn--left"),
	next: document.querySelector(".btn--right"),
};
const cardContainer = document.querySelector(".cards__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");
const cardInfosContainerEl = document.querySelector(".info__wrapper");

// Creating event listners for left right buttons
buttons.next.addEventListener("click", () => swapCards("right"));
buttons.prev.addEventListener("click", () => swapCards("left"));

// Creating a function to handle card swapping
function swapCards(direction) {
	// Getting current, previous, and next card elements
	const currentCardEl = cardContainer.querySelector(".current--card");
	const previousCardEl = cardContainer.querySelector(".previous--card");
	const nextCardEl = cardContainer.querySelector(".next--card");
    // Getting current, previous, and next background image elements
	const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
	const previousBgImageEl = appBgContainerEl.querySelector(".previous--image");
	const nextBgImageEl = appBgContainerEl.querySelector(".next--image");
    
	// Changing information based on swapping direction
	changeInfo(direction);
	// Swapping card classes and updating styles
	swapCardsClass();
    // Removing event listeners from current card
	removeCardEvents(currentCardEl);

	function swapCardsClass() {
		// Removing existing card classes
		currentCardEl.classList.remove("current--card");
		previousCardEl.classList.remove("previous--card");
		nextCardEl.classList.remove("next--card");
        // Removing existing background images classes
		currentBgImageEl.classList.remove("current--image");
		previousBgImageEl.classList.remove("previous--image");
		nextBgImageEl.classList.remove("next--image");
        // Setting z-index for correct stacking
		currentCardEl.style.zIndex = "50";
		currentBgImageEl.style.zIndex = "-2";
        // Applying classes and z-index based on swapping direction
		if (direction === "right") {
			previousCardEl.style.zIndex = "20";
			nextCardEl.style.zIndex = "30";
			nextBgImageEl.style.zIndex = "-1";
            // Adding appropriate classes
			currentCardEl.classList.add("previous--card");
			previousCardEl.classList.add("next--card");
			nextCardEl.classList.add("current--card");

			currentBgImageEl.classList.add("previous--image");
			previousBgImageEl.classList.add("next--image");
			nextBgImageEl.classList.add("current--image");
		} else if (direction === "left") {
			previousCardEl.style.zIndex = "30";
			nextCardEl.style.zIndex = "20";
			previousBgImageEl.style.zIndex = "-1";
            // Adding appropriate classes
			currentCardEl.classList.add("next--card");
			previousCardEl.classList.add("current--card");
			nextCardEl.classList.add("previous--card");

			currentBgImageEl.classList.add("next--image");
			previousBgImageEl.classList.add("current--image");
			nextBgImageEl.classList.add("previous--image");
		}
	}
}

// Creating a function to handle information change during card swapping
function changeInfo(direction) {
	let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
	let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

    // GSAP timeline for sequencing of animation 
	gsap.timeline()
	    // Creating fade out nav buttons and setting their duraion, opacity and pointer events
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 0.5,
		pointerEvents: "none",
	})
	    // Animating out current info text
		.to(
		currentInfoEl.querySelectorAll(".text"),
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "-120px",
			opacity: 0,
		},
		"-="
	)
	    // Callback to swap information classes
		.call(() => {
		swapInfosClass(direction);
	})
	    // Callback to re-enable card events
		.call(() => initCardEvents())
		// Animating in new info text
		.fromTo(
		direction === "right"
		? nextInfoEl.querySelectorAll(".text")
		: previousInfoEl.querySelectorAll(".text"),
		{
			opacity: 0,
			translateY: "40px",
		},
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "0px",
			opacity: 1,
		}
	)
	    // Creating fade in nav buttons and setting their duraion, opacity and pointer events
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 1,
		pointerEvents: "all",
	});

    // Creating a function to swap info classes
	function swapInfosClass() {
		currentInfoEl.classList.remove("current--info");
		previousInfoEl.classList.remove("previous--info");
		nextInfoEl.classList.remove("next--info");

		if (direction === "right") {
			currentInfoEl.classList.add("previous--info");
			nextInfoEl.classList.add("current--info");
			previousInfoEl.classList.add("next--info");
		} else if (direction === "left") {
			currentInfoEl.classList.add("next--info");
			nextInfoEl.classList.add("previous--info");
			previousInfoEl.classList.add("current--info");
		}
	}
}

// Creating a function to update card rotation according to pointer movememnt
function updateCard(e) {
	const card = e.currentTarget;
	const box = card.getBoundingClientRect();
	const centerPosition = {
		x: box.left + box.width / 2,
		y: box.top + box.height / 2,
	};
	let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
	gsap.set(card, {
		"--current-card-rotation-offset": `${angle}deg`,
	});
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(currentInfoEl, {
		rotateY: `${angle}deg`,
	});
}

// Creating a function to reset card transforms on pointer out
function resetCardTransforms(e) {
	const card = e.currentTarget;
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(card, {
		"--current-card-rotation-offset": 0,
	});
	gsap.set(currentInfoEl, {
		rotateY: 0,
	});
}

// Creating a function to start card events
function initCardEvents() {
	const currentCardEl = cardContainer.querySelector(".current--card");
	currentCardEl.addEventListener("pointermove", updateCard);
	currentCardEl.addEventListener("pointerout", (e) => {
		resetCardTransforms(e);
	});
}

// Initial call to initialize card events
initCardEvents();

// Creating a function to remove card events from a specific card
function removeCardEvents(card) {
	card.removeEventListener("pointermove", updateCard);
}

// Creating a function to initialize timeline animation
function init() {
	let tl = gsap.timeline();

	tl.to(cardContainer.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--card-translateY-offset": "0%",
	})
		.to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		delay: 0.5,
		duration: 0.4,
		stagger: 0.1,
		opacity: 1,
		translateY: 0,
	})
		.to(
		[buttons.prev, buttons.next],
		{
			duration: 0.4,
			opacity: 1,
			pointerEvents: "all",
		},
		"-=0.4"
	);
}

// Creating a function to wait for images to load and then start animation
const waitForImages = () => {
	const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.querySelector(".loader span");
    // Setting initial styles for card. infos and buttons
	gsap.set(cardContainer.children, {
		"--card-translateY-offset": "100vh",
	});
	gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		translateY: "40px",
		opacity: 0,
	});
	gsap.set([buttons.prev, buttons.next], {
		pointerEvents: "none",
		opacity: "0",
	});
    // Looping through each image and tracking loading progress
	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

                // Updating loader element based on loading progress
				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
				});
                
				// Starting animation when all images are loaded
				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
						duration: 0.8,
						opacity: 0,
						pointerEvents: "none",
					})
						.call(() => init());
				}
			}
		});
	});
};
// Calling the waitForImages function to start the animation
waitForImages();


// Js script for dropdown menu 
// using dom to select elements
const bar_btn= document.querySelector('.bar_btn');
const bar_btnIcon= document.querySelector('.bar_btn i');
const dropdown= document.querySelector('.dropdown');
// Creating event handler for dropdown button click
bar_btn.onclick= function(){
// Toggling the 'open' class on the dropdown, which controls its visibility
dropdown.classList.toggle('open');
// Checking if the dropdown is currently open or closed
const isOpen= dropdown.classList.contains('open')
};


