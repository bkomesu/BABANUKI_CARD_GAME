import Deck  from "./deck.js";

const CARD_VALUE_MAP= {
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    "10":9,
    "J": 10,
    "Q": 11,
    "K": 12,
    "A": 13
}

const computerCardSlot = document.querySelector(".computer-card-slot")
const playerCardSlot = document.querySelector(".player-card-slot")
const computerDeckElement = document.querySelector(".computer-deck")
const playerDeckElement = document.querySelector(".player-deck")
const computerPointsElement = document.querySelector('.computer-points')
const playerPointsElement = document.querySelector('.player-points')
const text = document.querySelector('.text')

let playerDeck, computerDeck, inRound, stop, computerPoints,playerPoints, alertIndicate

document.addEventListener('click', () => {
    if(stop && alertIndicate){
        startGame()
        return
    }

    if(inRound){
        cleanBeforeRound()
    }  else if (stop === false)  {
        flipCards()
    } else if (stop && alertIndicate === false){
        alertResult()
        alertIndicate = true
        console.log(alertIndicate)
    }
})




startGame()
function startGame() {
    const deck = new Deck()
    deck.shuffle()

    const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
    playerDeck = new Deck(deck.cards.slice(0,deckMidpoint))
    computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))

    for(let card of each (playerDeck)) {
        $('#player-cards').appendChild = 
    }

    inRound = false
    stop = false
    alertIndicate = false

    cleanBeforeRound()

}

function cleanBeforeRound(){
    inRound = false
    computerCardSlot.innerHTML = ''
    playerCardSlot.innerHTML = ''
    text.innerText = ''

    updateDeckPointCount()
}

function flipCards() {
    inRound = true

    const playerCard = playerDeck.pop()
    const computerCard = computerDeck.pop()

    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())
 
    

    updateDeckPointCount()

    if (isRoundWinner(playerCard,computerCard)) {
        text.innerText = 'Win'
        playerPoints += 1

    } else if (isRoundWinner(computerCard,playerCard)) {
        text.innerText = 'Lose'
        computerPoints += 1

    } else {
        text.innerText = 'Draw'
    }

    if (isGameOver(playerDeck) && computerPoints>playerPoints){
        text.innerText = 'You Lose!!!'
        stop = true

    } else if (isGameOver(computerDeck) && computerPoints<=playerPoints) {
        text.innerText = 'You Win!!!'
        stop = true

    }
}

function updateDeckPointCount(){
    computerDeckElement.innerText = computerDeck.numberOfCards
    playerDeckElement.innerText = playerDeck.numberOfCards
    computerPointsElement.innerText = computerPoints
    playerPointsElement.innerText = playerPoints
}

function isRoundWinner(cardOne, cardTwo) {
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}


function isGameOver(deck) {
    return deck.numberOfCards === 0
}


function alertResult(){        
    if(stop === true && computerPoints>playerPoints){
    alert(`You Lose!!! Click to play again`)
    alertIndicate = true
}else{
    alert(`You Win!!! Click to play again`)
    alertIndicate = true
}}