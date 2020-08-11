//deck initialization

let opponentsDeck = [];
let discardedPile = [];
let playersDeck = [];
let suitSymbol;

const opponentDeck = document.getElementById("opponent-deck");
const discardPile = document.getElementById("discarded-pile");
const playerDeck = document.getElementById("player-deck");
const opponentFace = document.getElementById("player");
const cardNumbers = document.getElementsByClassName("number");
const artWork = document.getElementsByClassName("artwork")[0];

//creating cards
for (let i = 0; i < 4; i++) {
  let suit;
  switch (i) {
    case 0:
      suit = "H";
      break;
    case 1:
      suit = "S";
      break;
    case 2:
      suit = "D";
      break;
    default:
      suit = "C";
  }
  for (let j = 0; j < 13; j++) {
    switch (j) {
      case 0:
        discardedPile.push(suit + "A");
        break;
      case 10:
        discardedPile.push(suit + "J");
        break;
      case 11:
        discardedPile.push(suit + "Q");
        break;
      case 12:
        discardedPile.push(suit + "K");
        break;
      default:
        discardedPile.push(suit + j);
    }
  }
}

//shuffle function
function shuffle(deck) {
  let deckLength = deck.length - 1;
  while (0 !== deckLength) {
    let randomNumber = Math.floor(Math.random() * 52);

    let temporaryCard = deck[deckLength];
    deck[deckLength] = deck[randomNumber];
    deck[randomNumber] = temporaryCard;
    deckLength--;
  }
  return deck;
}

discardedPile = shuffle(discardedPile);

// deal function
for (let i = discardedPile.length - 1; i >= 0; i--) {
  if (i % 2 === 0) {
    playersDeck.push(discardedPile[i]);
  } else {
    opponentsDeck.push(discardedPile[i]);
  }
  discardedPile.pop();
}

//suit symbol creator
function suitSymbolCreator(currentValue, suitSymbol) {
  //creates suits for numbers
  if (Number(currentValue)) {
    let suitSymbolDiv = document.createElement("div");
    suitSymbolDiv.innerText = suitSymbol;
    artWork.append(suitSymbolDiv);
  } else if (!Number(currentValue)) {
    //creates suits for Ace
    let suitSymbolDiv = document.createElement("div");
    suitSymbolDiv.innerText = suitSymbol;
    suitSymbolDiv.style.fontSize = "6vh";
    artWork.append(suitSymbolDiv);
    if (currentValue !== "A") {
      //creates suits art for other suits
      artWork.style.flexFlow = `column wrap`;
      let flippedSuitSymbol = document.createElement(`div`);
      flippedSuitSymbol.textContent = suitSymbol;
      flippedSuitSymbol.style.fontSize = "6vh";
      flippedSuitSymbol.style.transform = `rotate(180deg)`;
      artWork.append(flippedSuitSymbol);
    }
  }
}

//publishing the card
function playCard() {
  discardedPile.push(playersDeck[0]);
  playersDeck.splice(0, 1);

  //separating suit and value
  const currentCard = discardedPile[discardedPile.length - 1];
  let currentValue = currentCard.substring(1, 2);

  //value logic
  if (Number(currentValue)) {
    currentValue = Number(currentValue) + 1;
  }
  const suit = currentCard.substring(0, 1);

  //suit and number logic
  for (let k = 0; k < 2; k++) {
    cardNumbers[k].innerText = currentValue;
    switch (suit) {
      case "H":
        {
          discardPile.classList.add("red");
          cardNumbers[k].innerText += "\n♥";
          suitSymbol = "♥";
        }
        break;
      case "D":
        {
          discardPile.classList.add("red");
          cardNumbers[k].innerText += "\n♦";
          suitSymbol = "♦";
        }
        break;
      case "S":
        {
          cardNumbers[k].innerText += "\n♠";
          suitSymbol = "♠";
        }
        break;
      case "C":
        {
          cardNumbers[k].innerText += "\n♣";
          suitSymbol = "♣";
        }
        break;
      default:
        console.error("No recognizable suit found");
    }
  }

  //suit clear before new artwork publishes
  while (artWork.children[0]) {
    artWork.children[0].remove();
  }

  //reset artwork style
  artWork.style.flexFlow = null;

  //suit allotment logic
  if (Number(currentValue)) {
    for (let l = 0; l < currentValue; l++) {
      suitSymbolCreator(currentValue, suitSymbol);
    }
    if (currentValue < 4) {
      artWork.style.flexFlow = "column wrap";
    }
  } else if (!Number(currentValue)) {
    switch (currentValue) {
      case "J":
        suitSymbol = "🤵";
        break;
      case "Q":
        suitSymbol = "👸🏻";
        break;
      case "K":
        suitSymbol = "🤴🏻";
        break;
      default:
    }
    suitSymbolCreator(currentValue, suitSymbol);
  }
}

playCard();
