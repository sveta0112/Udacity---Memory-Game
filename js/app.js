/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// deck of cards
const deck = document.querySelector('.deck');

// stars-icons
const stars = document.querySelectorAll('.fa-star');

//elements with class card
let card = document.querySelectorAll('.card');
//convert Nodelist to Array, which holds nodes with class card
let cards = Array.from(card);

// array of opened cards
let openedCards = [];
// array of matched cards
let matchedCardArray = [];

//element with class moves
let movesCounter = document.querySelector('.moves');
//starter indicator for moves
let moves = 0;
let moveCount;


//modal box && its content
let modal = document.querySelector('.modal');
let totalMoves = document.querySelector('#totalMoves');
let totalTime = document.querySelector('#totalTime');
let totalRate = document.querySelector('#totalRate');


//element with class timer && its content
let timer = document.querySelector('.timer');
let second = 0,
    minute = 0,
    hour = 0,
    interval;

//buttons for diff. event listeners
let closeButton = document.querySelector('.close');
let resetButton = document.querySelector('.fa-repeat');
let playAgainButton = document.querySelector('.again');

//@description of function which shuffles cards (provided by Udacity)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//invoke function to start the game
initGame();


//@description of initializing new start of game
function initGame() {
    //empty out array of opened cards && array of matched cards
    openedCards = [];
    matchedCardArray = [];
    // shuffles array of cards
    cards = shuffle(cards);
    //everytime empty out deck
    deck.innerHTML = '';
    // loop through array of cards
    for (let i = 0; i < cards.length; i++) {
        cards.forEach(card => {
            //add each '<li class='card'><i class='fa fa-...'></i></li>' to deck
            deck.appendChild(card)
        });
        //remove below classes on each iteration
        cards[i].classList.remove('show', 'open', 'match');
    }
    //reset moves number
    moves = 0;
    movesCounter.innerHTML = moves;

    //reset stars
    stars.forEach(star => {
        star.style.visibility = 'visible';
    });
    //reset timer
    second = 0;
    minute = 0;
    hour = 0;
    timer.innerHTML = `${minute} mins ${second} secs`;
    clearInterval(interval);
}

// @description of function to open cards (populate array of opened cards, add classes to cards, check for matching cards)
function openCard() {
    //clicked card
    let card = this;
    
    //check if clicked card does not have below classes
    if(!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
        //if that is true, add below classes to clicked card
        card.classList.add('open', 'show');
        //populate array of opened cards with clicked card
        openedCards.push(card);
        //invoke moveCounter function (after first card is clicked)
        moveCounter();
        //check if array of opened cards length equal 2 (always compare two cards with each other)
        if(openedCards.length === 2) {
            //compare 2 elements of array of opened cards based on data-set attribute
            if(openedCards[0].dataset.card === openedCards[1].dataset.card) {
                //if that is true, invoke matchedCards function
                //console.log(openedCards[0], openedCards[1]);
                matchedCards();
            } else {
                //if false, invoke unmatchedCards function
                unmatchedCards();
            }
        } 
    }
    
}

// @description of function, when cards match
function matchedCards() {
    //add below classes to first element of opened cards
    openedCards[0].classList.add('match');
    openedCards[0].classList.add('open');
    openedCards[0].classList.add('show');
    //add below classes to second element of opened cards
    openedCards[1].classList.add('match');
    openedCards[1].classList.add('open');
    openedCards[1].classList.add('show');

    //populate array of matched cards with those two cards
    matchedCardArray.push(openedCards[0], openedCards[1]);
    //empty out array opened cards
    openedCards = [];
}


// @description of function, when cards don't match
function unmatchedCards() {
    //set delay for 1sec, so after that time 2 cards will 'close up'
    setTimeout(() => {
        //on each iteration (2 elements of array of opened cards), below classes will be removed
        openedCards.forEach(card => card.classList.remove('open', 'show'));
        //then empty out array opened cards
        openedCards = [];
    }, 500);
}


// @description of function which keeps counting user's moves
function moveCounter() {
    //increment by one
    moves += 1;
    //HTML representation (displaying) && handles correct output of moves
    if(moves % 2 === 0) {
        moveCount = moves / 2;
    } else {
        moveCount = Math.floor(moves / 2);
    }
    movesCounter.innerHTML = moveCount;
    if(moves === 1) {
        startTimer();
    }
    // star rates based on moves
    // Array of 3 stars (Nodelist into Array)
    let starsArray = Array.from(stars);
    //if moves count is equal 10
    if(moveCount === 10) {
        //third star will be hidden
        starsArray[2].style.visibility = 'hidden';
    } else if(moveCount === 16) {
        //second star will be hidden
        starsArray[1].style.visibility = 'hidden';
    }
}


//@description of function when interval is set to update every 1sec
function startTimer() {
    //starting timer, in order to avoid delay
    if(second === 0) {
        second++;
    }
    interval = setInterval(() => {
        //HTML represantion (displaying timer)
        timer.innerHTML = `${minute} mins ${second} secs`;
        //increment second
        second++;
        //once second is equal to 60
        if(second === 60) {
            //increment minute
            minute++;
            //reset second to 0 again
            second = 0;
        }
        //once minute is equal to 60
        if(minute === 60) {
            //incremnt hour
            hour++;
            //reset minute to 0 again
            minute = 0;
        }
    },1000);
}


//@description of function when open modal pop up (once user matches all cards)
function openModal(){
    //check if array of matched cards is equal 16
    if (matchedCardArray.length === 16) {
        //if that is true, clear interval
        clearInterval(interval);
        //display modal box
        modal.style.display = 'block';

        // star rating handler
        let starRating = document.querySelector('.stars').innerHTML;

        //HTML displaying of modal content with dynamic output of moves, timer, star rating
        totalMoves.innerHTML = `Your total moves are:   ${moveCount}`;
        totalTime.innerHTML =   `Finished within:   ${timer.innerHTML}`;
        totalRate.innerHTML = `Your Rating:  ${starRating}`;
    }
}

//@description of function when modal is closed
function closeModal() {
   //hide modal box
   modal.style.display ='none';
   //invoke new game
   initGame();
}

//@description of function when play again button is clicked
function playAgain(){
    //hide modal box
    modal.style.display = 'none';
    //invoke new game
    initGame();
}

//@description of function when reset button is clicked
function reset() {
    //invoke new game
    initGame();
}


// loop through cards array
for (let i = 0; i < cards.length; i++) {
    //each card('<li class='card'><i class'fa fa-...'></i></li>)
    card = cards[i];
    //to each card add event listener for opening card
    card.addEventListener('click',  openCard);
    //to each card add event listener,on each iteration check if array of matched cards is equal 16, if yes --> invoke open modal
    card.addEventListener('click', openModal);
}
//add event listener to close button click
closeButton.addEventListener('click', closeModal);
//add event listener to reset button click
resetButton.addEventListener('click', reset);
//add event listener to play again button click
playAgainButton.addEventListener('click', playAgain);
