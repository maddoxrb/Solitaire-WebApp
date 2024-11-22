/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';

const shuffleCards = (includeJokers = false) => {
  /* Return an array of 52 cards (if jokers is false, 54 otherwise). Carefully follow the instructions in the README */
  let cards = [];
  ['spades', 'clubs', 'hearts', 'diamonds'].forEach((suit) => {
    ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'].forEach(
      (value) => {
        cards.push({ suit: suit, value: value });
      },
    );
  });
  // Add in jokers here
  if (includeJokers) {
    /*...*/
  }
  // Now shuffle
  let deck = [];
  while (cards.length > 0) {
    // Find a random number between 0 and cards.length - 1
    const index = Math.floor(Math.random() * cards.length);
    deck.push(cards[index]);
    cards.splice(index, 1);
  }
  return deck;
};

const initialState = () => {
  /* Use the above function.  Generate and return an initial state for a game */
  let state = {
    pile1: [],
    pile2: [],
    pile3: [],
    pile4: [],
    pile5: [],
    pile6: [],
    pile7: [],
    stack1: [],
    stack2: [],
    stack3: [],
    stack4: [],
    draw: [],
    discard: [],
  };

  // Get the shuffled deck and distribute it to the players
  const deck = shuffleCards(false);
  // Setup the piles
  for (let i = 1; i <= 7; ++i) {
    let card = deck.splice(0, 1)[0];
    card.up = true;
    state[`pile${i}`].push(card);
    for (let j = i + 1; j <= 7; ++j) {
      card = deck.splice(0, 1)[0];
      card.up = false;
      state[`pile${j}`].push(card);
    }
  }
  // Finally, get the draw right
  state.draw = deck.map((card) => {
    card.up = false;
    return card;
  });
  return state;
};

const validateMove = async (currentState, requestedMove, drawType) => {
  const { src, dst } = requestedMove;
  if (!currentState[src] || !currentState[dst]) {
    return [false, `Invalid piles: ${src} or ${dst} does not exist`];
  }

  const sourcePile = currentState[src];
  const dstPile = currentState[dst];

  const flipNextCard = () => {
    if (sourcePile.length > 0) {
      sourcePile[sourcePile.length - 1].up = true;
    }
  };

  // Special case: Refill draw pile from discard if draw is empty
  if (src === 'draw' && dst === 'discard') {
    if (sourcePile.length === 0) {
      if (currentState.discard.length === 0) {
        return [false, `No cards left in draw or discard pile to refill`];
      }

      // Refill the draw pile by reversing the discard pile
      const reversedDiscard = currentState.discard.reverse();
      reversedDiscard.forEach((card) => {
        card.up = false;
        sourcePile.push(card);
      });

      currentState.discard = [];
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    }

    // Draw from the draw pile based on the draw type
    if (drawType === 1) {
      const topCard = sourcePile.pop();
      topCard.up = true;
      dstPile.push(topCard);
    } else {
      const cardsToDraw = Math.min(3, sourcePile.length);
      for (let i = 0; i < cardsToDraw; i++) {
        const card = sourcePile.pop();
        card.up = true;
        dstPile.push(card);
      }
    }
    let result = checkGameOver(currentState, drawType);
    return [true, currentState, result];
  }

  // Gather all face-up cards from the source pile for general moves
  const faceUpCards = [];
  for (let i = sourcePile.length - 1; i >= 0; i--) {
    if (sourcePile[i].up) {
      faceUpCards.unshift(sourcePile[i]);
    } else {
      break;
    }
  }

  const topFaceUpCard = faceUpCards[0];

  // Check tableau-to-tableau moves
  if (src.startsWith('pile') && dst.startsWith('pile')) {
    if (validateTableauToTableauMove(topFaceUpCard, dstPile)) {
      faceUpCards.forEach((card) => dstPile.push(card));
      sourcePile.splice(-faceUpCards.length);
      flipNextCard();
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    }

    const topCard = sourcePile[sourcePile.length - 1];
    if (validateTableauToTableauMove(topCard, dstPile)) {
      dstPile.push(sourcePile.pop());
      flipNextCard();
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    } else {
      return [false, `Invalid move from ${src} to ${dst}`];
    }
  }

  // Check tableau-to-foundation moves (only the top card should move)
  if (src.startsWith('pile') && dst.startsWith('stack')) {
    if (
      validateTableauToFoundationMove(
        sourcePile[sourcePile.length - 1],
        dstPile,
      )
    ) {
      dstPile.push(sourcePile.pop());
      flipNextCard();
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    } else {
      return [false, `Invalid move from ${src} to ${dst}`];
    }
  }

  // Check Foundation-to-tableau moves (only the top card should move)
  if (src.startsWith('stack') && dst.startsWith('pile')) {
    if (
      validateTableauToTableauMove(sourcePile[sourcePile.length - 1], dstPile)
    ) {
      dstPile.push(sourcePile.pop());
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    } else {
      return [false, `Invalid move from ${src} to ${dst}`];
    }
  }

  // Moving from waste to tableau or foundation
  if (src === 'discard') {
    if (validateWasteMove(sourcePile[sourcePile.length - 1], dstPile, dst)) {
      dstPile.push(sourcePile.pop());
      flipNextCard();
      let result = checkGameOver(currentState, drawType);
      return [true, currentState, result];
    } else {
      return [false, `Invalid move from ${src} to ${dst}`];
    }
  }

  // Flip the next card after all moves
  flipNextCard();

  let result = checkGameOver(currentState, drawType);
  return [true, currentState, result];
};

const checkGameOver = (state, drawType) => {
  // Check if the game is won
  if (
    state.stack1.length === 13 &&
    state.stack2.length === 13 &&
    state.stack3.length === 13 &&
    state.stack4.length === 13
  ) {
    return 'won';
  }

  const foundationStacks = [
    state.stack1,
    state.stack2,
    state.stack3,
    state.stack4,
  ];
  const tableauPiles = [
    state.pile1,
    state.pile2,
    state.pile3,
    state.pile4,
    state.pile5,
    state.pile6,
    state.pile7,
  ];

  // Check for moves from tableau piles to foundation stacks
  for (let pile of tableauPiles) {
    if (pile.length > 0) {
      const topCard = pile[pile.length - 1];
      if (topCard.up) {
        for (let stack of foundationStacks) {
          if (validateTableauToFoundationMove(topCard, stack)) {
            return 'continue';
          }
        }
      }
    }
  }

  const drawPile = state.draw.map((card) => ({ ...card, up: true }));

  // Check for moves from discard and draw piles to foundation stacks and tableau piles based on drawType
  if (drawType === 1) {
    // For drawType 1, check every card in both discard and draw piles
    const allCards = [...state.discard, ...drawPile];
    for (let card of allCards) {
      // Check move to foundation stacks
      for (let stack of foundationStacks) {
        if (validateTableauToFoundationMove(card, stack)) {
          return 'continue';
        }
      }
      // Check move to tableau piles
      for (let pile of tableauPiles) {
        if (validateTableauToTableauMove(card, pile)) {
          return 'continue';
        }
      }
    }
  } else if (drawType === 3) {
    // For drawType 3, check the accessible cards from the discard pile
    const accessibleDiscardCards = [];
    for (let i = state.discard.length - 1; i >= 0; i -= 3) {
      accessibleDiscardCards.push(state.discard[i]);
    }
    for (let card of accessibleDiscardCards) {
      // Check move to foundation stacks
      for (let stack of foundationStacks) {
        if (validateTableauToFoundationMove(card, stack)) {
          return 'continue';
        }
      }
      // Check move to tableau piles
      for (let pile of tableauPiles) {
        if (validateTableauToTableauMove(card, pile)) {
          return 'continue';
        }
      }
    }

    while (drawPile.length > 0) {
      // Flip up to three cards
      const cardsToFlip = drawPile.splice(-3, 3);
      const topCard = cardsToFlip[0]; // The last card in the flip will be on top

      // Check move to foundation stacks
      for (let stack of foundationStacks) {
        if (validateTableauToFoundationMove(topCard, stack)) {
          return 'continue';
        }
      }
      // Check move to tableau piles
      for (let pile of tableauPiles) {
        if (validateTableauToTableauMove(topCard, pile)) {
          return 'continue';
        }
      }
    }
  }
  return 'lost';
};

const getCardValue = (card) => {
  const valueMap = {
    ace: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    jack: 11,
    queen: 12,
    king: 13,
  };
  return valueMap[card.value.toString().toLowerCase()];
};

// Validate move between tableau piles (descending rank, alternating colors)
const validateTableauToTableauMove = (topCard, dstPile) => {
  const dstTopCard = dstPile[dstPile.length - 1];

  // Only King can move to an empty tableau pile
  if (!dstTopCard) return getCardValue(topCard) === 13;

  const topCardValue = getCardValue(topCard);
  const dstTopCardValue = getCardValue(dstTopCard);

  return (
    isAlternatingColor(topCard, dstTopCard) &&
    topCardValue === dstTopCardValue - 1
  );
};

// Validate move from tableau to foundation (ascending rank, same suit)
const validateTableauToFoundationMove = (topCard, dstPile) => {
  const dstTopCard = dstPile[dstPile.length - 1];

  // If the destination pile is empty, only an Ace can start it
  if (!dstTopCard) {
    return getCardValue(topCard) === 1;
  }

  // Check if the move follows ascending order and same suit
  const topCardValue = getCardValue(topCard);
  const dstTopCardValue = getCardValue(dstTopCard);

  return (
    topCard.suit === dstTopCard.suit && topCardValue === dstTopCardValue + 1
  );
};

// Validate move from waste to tableau/foundation
const validateWasteMove = (topCard, dstPile, dst) => {
  if (dst.startsWith('pile')) {
    return validateTableauToTableauMove(topCard, dstPile);
  } else if (dst.startsWith('stack')) {
    return validateTableauToFoundationMove(topCard, dstPile);
  }
  return false;
};

// Helper function to check if two cards are alternating colors
const isAlternatingColor = (card1, card2) => {
  const redSuits = ['hearts', 'diamonds'];
  const blackSuits = ['clubs', 'spades'];
  return (
    (redSuits.includes(card1.suit) && blackSuits.includes(card2.suit)) ||
    (blackSuits.includes(card1.suit) && redSuits.includes(card2.suit))
  );
};

const filterGameForProfile = (game) => ({
  active: game.active,
  score: game.score,
  won: game.won,
  id: game._id,
  game: 'klondyke',
  start: game.start,
  state: game.state,
  moves: game.moves,
  winner: game.winner,
});

const filterMoveForResults = (move) => ({
  ...move,
});

module.exports = {
  shuffleCards: shuffleCards,
  initialState: initialState,
  filterGameForProfile: filterGameForProfile,
  filterMoveForResults: filterMoveForResults,
  validateMove: validateMove,
};
