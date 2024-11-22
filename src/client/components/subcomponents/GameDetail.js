'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  FaClock,
  FaGamepad,
  FaStar,
  FaRegCreditCard,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

/**
 * GameDetail Component
 *
 * Displays detailed information about the game.
 *
 * @component
 * @param {number} start - The start timestamp of the game.
 * @param {Array} moves - The array of moves in the game.
 * @param {number} score - The score achieved in the game.
 * @param {number} cards_remaining - Number of cards remaining in the game.
 * @param {boolean} active - Indicates if the game is still active.
 * @returns {React.Element} The rendered GameDetail component.
 */
const GameDetail = ({ start, moves, score, cards_remaining, active }) => {
  const duration = start
    ? Math.floor((Date.now() - new Date(start)) / 1000)
    : '--';

  return (
    <DetailContainer>
      <DetailItem>
        <IconWrapper color="#3b82f6">
          <FaClock />
        </IconWrapper>
        <Label>Duration:</Label>
        <Value>{duration} seconds</Value>
      </DetailItem>
      <DetailItem>
        <IconWrapper color="#10b981">
          <FaGamepad />
        </IconWrapper>
        <Label>Number of Moves:</Label>
        <Value>{moves.length}</Value>
      </DetailItem>
      <DetailItem>
        <IconWrapper color="#f59e0b">
          <FaStar />
        </IconWrapper>
        <Label>Points:</Label>
        <Value>{score}</Value>
      </DetailItem>
      <DetailItem>
        <IconWrapper color="#8b5cf6">
          <FaRegCreditCard />
        </IconWrapper>
        <Label>Cards Remaining:</Label>
        <Value>{cards_remaining}</Value>
      </DetailItem>
      <DetailItem>
        <IconWrapper color={active ? '#10b981' : '#ef4444'}>
          {active ? <FaCheckCircle /> : <FaTimesCircle />}
        </IconWrapper>
        <Label>Game Status:</Label>
        <Value>{active ? 'Active' : 'Complete'}</Value>
      </DetailItem>
    </DetailContainer>
  );
};

GameDetail.propTypes = {
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  moves: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  cards_remaining: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

export default GameDetail;

// Container for game details
const DetailContainer = styled.div`
  background: #1f2937; /* Dark background */
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto 2rem auto;
`;

// Individual detail item
const DetailItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

// Icon wrapper with dynamic color
const IconWrapper = styled.div`
  color: ${(props) => props.color || '#fff'};
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

// Label for the detail
const Label = styled.span`
  font-weight: 600;
  flex: 1;
`;

// Value for the detail
const Value = styled.span`
  margin-left: auto;
`;
