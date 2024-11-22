// GameHeader.js

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

/**
 * GameHeader Component
 *
 * Renders the header for the game list, displaying the total count of games
 * and a button to start a new game if permitted.
 *
 * @component
 * @param {number} count - The total number of games.
 * @param {boolean} toCreateGame - Flag indicating if the "Start New Game" button should be displayed.
 * @returns {React.Element} The rendered GameHeader component.
 */
const GameHeader = ({ count, toCreateGame, onStartNewGame }) => {
  return (
    <GameHeaderBase>
      <h4 className="font-title">Games ({count})</h4>
      {toCreateGame && (
        <button onClick={onStartNewGame} className="start-new-game-btn">
          <FaPlus className="plus-icon" /> Start New Game
        </button>
      )}
    </GameHeaderBase>
  );
};

GameHeader.propTypes = {
  count: PropTypes.number.isRequired,
  toCreateGame: PropTypes.bool.isRequired,
  onStartNewGame: PropTypes.func.isRequired,
};

export default GameHeader;

const GameHeaderBase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h4 {
    margin: 0;
    font-size: 1.5rem;
    color: #fff;
  }

  .start-new-game-btn {
    display: flex;
    align-items: center;
    padding: 0.6rem 1rem;
    background: linear-gradient(135deg, #5855ff, #bd0698);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
    }

    .plus-icon {
      margin-right: 0.5rem;
      font-size: 1.2rem;
    }
  }
`;
