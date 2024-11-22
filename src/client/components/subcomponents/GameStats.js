import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaTrophy, FaGamepad, FaChartLine } from 'react-icons/fa';

/**
 * GameStats Component
 *
 * Displays statistical information about the user's games.
 *
 * Props:
 * - stats: Object containing various game statistics.
 * - totalGames: Number representing the total games played.
 */
const GameStats = ({ stats, totalGames }) => {
  return (
    <StatsContainer>
      <StatCard>
        <FaTrophy className="icon" />
        <StatNumber>{stats.wins}</StatNumber>
        <StatLabel>Wins</StatLabel>
      </StatCard>
      <StatCard>
        <FaGamepad className="icon" />
        <StatNumber>{stats.losses}</StatNumber>
        <StatLabel>Losses</StatLabel>
      </StatCard>
      <StatCard>
        <FaChartLine className="icon" />
        <StatNumber>{stats.draws}</StatNumber>
        <StatLabel>Draws</StatLabel>
      </StatCard>
      <StatCard>
        <FaGamepad className="icon" />
        <StatNumber>{totalGames}</StatNumber>
        <StatLabel>Total Games</StatLabel>
      </StatCard>
    </StatsContainer>
  );
};

GameStats.propTypes = {
  stats: PropTypes.shape({
    wins: PropTypes.number,
    losses: PropTypes.number,
    draws: PropTypes.number,
  }).isRequired,
  totalGames: PropTypes.number.isRequired,
};

export default GameStats;

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  flex: 1 1 200px;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  color: #fff;

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #ccc;
`;
