// GameList.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'animate.css';
import GameHeader from './GameHeader.js';
import GameRow from './GameRow.js';

/**
 * GameList Component
 *
 * Renders a list of games in a table format, including a header and individual game rows.
 *
 * @component
 * @param {Array} games - An array of game objects to be displayed.
 * @param {boolean} toCreateGame - Flag indicating if the "Start New Game" button should be displayed.
 * @returns {React.Element} The rendered GameList component.
 */
const GameList = ({ games, toCreateGame, onStartNewGame }) => {
  const gameList = games.map((game) => <GameRow key={game.id} game={game} />);
  return (
    <PageContainer>
      <FormCard>
        <GameHeader
          count={games.length}
          toCreateGame={toCreateGame}
          onStartNewGame={onStartNewGame}
        />
        <GameTable className="mt-8">
          <Table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Start Date</th>
                <th># of Moves</th>
                <th>Game Type</th>
              </tr>
            </thead>
            <tbody>{gameList}</tbody>
          </Table>
        </GameTable>
      </FormCard>
    </PageContainer>
  );
};

GameList.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      start: PropTypes.string.isRequired,
      moves: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
      game: PropTypes.string.isRequired,
    }),
  ).isRequired,
  toCreateGame: PropTypes.bool.isRequired,
  onStartNewGame: PropTypes.func.isRequired,
};

export default GameList;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border-radius: 15px;
  width: 100%;
  max-width: 850px;
  text-align: center;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  animation: animate__animated animate__fadeInUp;
`;

const GameTable = styled.div`
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  text-align: left;
  min-width: 600px;

  th,
  td {
    padding: 1rem;
    border-bottom: 1px solid #333;
    white-space: nowrap;
  }

  th {
    background: rgba(0, 0, 0, 1);
    font-size: 1rem;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:hover {
    background: #3a3a4f;
  }

  a {
    color: #5855ff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 599px) {
    th:nth-of-type(2),
    td:nth-of-type(2) {
      display: none;
    }
  }
`;
