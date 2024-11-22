'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Pile } from './Pile.js';

/**
 * GameView Component
 *
 * Displays the game state based on the provided cards data.
 *
 * @component
 * @param {Object} move - The move object containing the cards state.
 * @param {Function} onBack - Function to handle going back to the moves list.
 * @returns {React.Element} The rendered GameView component.
 */
const GameView = ({ move, onBack, drawType }) => {
  const [state, setState] = useState({
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
    drawType: drawType,
  });

  useEffect(() => {
    if (move.cards) {
      setState((prevState) => ({ ...prevState, ...move.cards }));
    }
  }, [move]);

  return (
    <GameViewContainer>
      <BackButton onClick={onBack}>← Back to Moves</BackButton>
      <SectionTitle>Game State After Move #{move.id}</SectionTitle>
      <GameBase>
        <CardRow>
          <Pile
            cards={state.stack1}
            spacing={0}
            onClick={() => {}}
            selected={false}
          />
          <Pile
            cards={state.stack2}
            spacing={0}
            onClick={() => {}}
            selected={false}
          />
          <Pile
            cards={state.stack3}
            spacing={0}
            onClick={() => {}}
            selected={false}
          />
          <Pile
            cards={state.stack4}
            spacing={0}
            onClick={() => {}}
            selected={false}
          />
          <CardRowGap />
          <Pile
            cards={state.draw}
            spacing={0}
            onClick={() => {}}
            selected={false}
          />
          <Pile
            cards={
              state.drawType === 3
                ? state.discard?.slice(-3) || []
                : state.discard?.slice(-1) || []
            }
            spacing={state.drawType === 3 ? 10 : 0}
            onClick={() => {}}
            selected={false}
          />
        </CardRow>
        <CardRow>
          <Pile cards={state.pile1} onClick={() => {}} selected={false} />
          <Pile cards={state.pile2} onClick={() => {}} selected={false} />
          <Pile cards={state.pile3} onClick={() => {}} selected={false} />
          <Pile cards={state.pile4} onClick={() => {}} selected={false} />
          <Pile cards={state.pile5} onClick={() => {}} selected={false} />
          <Pile cards={state.pile6} onClick={() => {}} selected={false} />
          <Pile cards={state.pile7} onClick={() => {}} selected={false} />
        </CardRow>
      </GameBase>
    </GameViewContainer>
  );
};

GameView.propTypes = {
  move: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cards: PropTypes.object.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default GameView;

// Container for GameView
const GameViewContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.95);
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
  color: #fff;
  box-sizing: border-box;
`;

// Title for sections
const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const BackButton = styled.button`
  background: #5855ff;
  color: #fff;
  border: none;
  padding: 0.5em 1em;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #bd0698;
  }
`;

const CardRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2em;
`;

const CardRowGap = styled.div`
  flex-grow: 1;
`;

const GameBase = styled.div`
  grid-row: 2;
  grid-column: main;
  margin-right: 6em;
  margin-top: 2em;
`;
