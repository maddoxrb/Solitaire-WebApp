// GameRow.js

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * GameRow Component
 *
 * Represents a single row in the game list table, displaying game status,
 * start date, number of moves, and game type.
 *
 * @component
 * @param {Object} game - The game object containing game details.
 * @param {string} game.id - Unique identifier for the game.
 * @param {boolean} game.active - Indicates if the game is active.
 * @param {string} game.start - Start date of the game.
 * @param {number} game.moves - Number of moves made in the game.
 * @param {string} game.game - Type of the game.
 * @returns {React.Element} The rendered GameRow component.
 */
const GameRow = ({ game }) => {
  const date = new Date(game.start);
  const url = `/${game.active ? 'game' : 'results'}/${game.id}`;
  return (
    <GameRowBase>
      <td>
        <Link to={url}>
          <StatusIcon>
            {game.active ? (
              <FaCheckCircle className="active-icon" />
            ) : (
              <FaTimesCircle className="complete-icon" />
            )}
            {game.active ? 'Active' : 'Complete'}
          </StatusIcon>
        </Link>
      </td>
      <td>{date.toLocaleString()}</td>
      <td>{game.moves}</td>
      <td>{game.game}</td>
    </GameRowBase>
  );
};

GameRow.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    start: PropTypes.string.isRequired,
    moves: PropTypes.number.isRequired,
    game: PropTypes.string.isRequired,
  }).isRequired,
};

export default GameRow;

// Styled Components
const GameRowBase = styled.tr`
  transition: background 0.3s ease;

  &:hover {
    background: #3a3a4f;
  }
`;

const StatusIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  .active-icon {
    color: #4caf50;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }

  .complete-icon {
    color: #ff6b6b;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }

  span {
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
  }
`;
