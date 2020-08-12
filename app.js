//deck initialization

let opponentsDeck = [];
let discardedPile = [];
let playersDeck = [];
let suitSymbol;
let reaction;
let expression;

const discardPile = document.getElementById("discarded-pile");
const playerDeck = document.getElementById("player-deck");
const opponentFace = document.getElementById("player");
const cardNumbers = document.getElementsByClassName("number");
const artWork = document.getElementsByClassName("artwork")[0];
const textWrapper = document.getElementById("win-lose-status");
const playAgain = document.getElementById("play-again-wrapper");

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
        discardedPile.push("A" + suit);
        break;
      case 10:
        discardedPile.push("J" + suit);
        break;
      case 11:
        discardedPile.push("Q" + suit);
        break;
      case 12:
        discardedPile.push("K" + suit);
        break;
      default:
        discardedPile.push(j + suit);
    }
  }
}

//shuffle function
function shuffle(deck) {
  let deckLength = deck.length;
  while (0 !== deckLength) {
    let randomNumber = Math.floor(Math.random() * deckLength);
    deckLength--;

    let temporaryCard = deck[deckLength];
    deck[deckLength] = deck[randomNumber];
    deck[randomNumber] = temporaryCard;
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
}
discardedPile = [];

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
function playCard(event) {
  const target = event.target.id;
  discardPile.style.visibility = "visible";
  if (target === "player-deck") {
    discardedPile.push(playersDeck[0]);
    playersDeck.splice(0, 1);
  } else if (target === "opponent-deck") {
    discardedPile.push(opponentsDeck[0]);
    opponentsDeck.splice(0, 1);
  }
  //separating suit and value
  const currentCard = discardedPile[discardedPile.length - 1];
  let currentValue = currentCard.substring(0, 1);

  //value logic
  if (Number(currentValue)) {
    currentValue = Number(currentValue) + 1;
  }
  const suit = currentCard.substring(1, 2);

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
          discardPile.classList.remove("red");
          cardNumbers[k].innerText += "\n♠";
          suitSymbol = "♠";
        }
        break;
      case "C":
        {
          discardPile.classList.remove("red");
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
  getCurrentCard();
  opponentAI(target);
}

//Opponent's AI
function opponentAI(lastPlayer) {
  const reactionTime = Math.floor(Math.random() * (1600 - 900) + 900);
  window.clearTimeout(reaction);
  reaction = window.setTimeout(() => {
    const discardedCardsLength = discardedPile.length;
    if (
      discardedCardsLength > 0 &&
      discardedPile[discardedCardsLength - 1].includes("J")
    ) {
      slap();
    } else if (lastPlayer === "player-deck") {
      let event = {};
      event.target = {};
      event.target.id = "opponent-deck";
      playCard(event);
    }
  }, reactionTime);
}

//slap event
function slap(event) {
  const discardCardsLength = discardedPile.length;

  let currentPlayer;
  if (event !== undefined) {
    currentPlayer = "player";
  } else {
    currentPlayer = "AI";
    if (discardCardsLength === 0) {
      playerMood(`sad`);
      return;
    }
  }
  console.log(currentPlayer);
  if (
    discardCardsLength > 0 &&
    discardedPile[discardCardsLength - 1].includes("J")
  ) {
    if (currentPlayer === "AI") {
      playerMood("happy");
      playersDeck = playersDeck.concat(shuffle(discardedPile));
      opponentAI("player-deck");
      discardPile.style.visibility = "hidden";
    } else if (currentPlayer === "player") {
      playerMood("sad");
      opponentsDeck = opponentsDeck.concat(shuffle(discardedPile));
      window.clearTimeout(reaction);
      discardPile.style.visibility = "hidden";
    }
    discardedPile = [];
    getCurrentCard();
  }
}

//player's mood change
function playerMood(mood) {
  if (mood === "happy") {
    opponentFace.innerText = "😁 Opponent Slapped 🎉🎊✨";
  } else if (mood === "sad") {
    opponentFace.innerText = "😑 You Slapped 😥😪";
  }
  const expressionTime = Math.floor(Math.random() * (1500 - 500)) + 500;
  window.clearTimeout(expression);
  expression = window.setTimeout(function () {
    opponentFace.textContent = `🙂`;
  }, expressionTime);
}

//winner announcing function
function getCurrentCard() {
  if (playersDeck.length === 0) {
    playerDeck.removeEventListener("click", playCard, false);
    playerDeck.style.visibility = "hidden";
    playAgain.style.display = "flex";
    textWrapper.textContent = "You Win the Game😁🎉";
    playerMood("sad");
    window.clearTimeout(reaction);
  } else if (opponentsDeck.length === 0) {
    opponentsDeck.style.visibility = "hidden";
    playAgain.style.display = "flex";
    textWrapper.textContent = "You Lose the Game😔💔";
    playerMood("happy");
    window.clearTimeout(reaction);
  }
}

playerDeck.addEventListener("click", playCard, false);
discardPile.addEventListener("click", slap, false);
