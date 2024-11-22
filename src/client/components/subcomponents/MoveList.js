'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Move from './Move.js';

/**
 * MovesList Component
 *
 * Renders a table of moves.
 *
 * @component
 * @param {Array} moves - An array of move objects.
 * @param {Function} onMoveClick - Function to handle move click.
 * @returns {React.Element} The rendered MovesList component.
 */
const MovesList = ({ moves, onMoveClick }) => {
  if (!Array.isArray(moves)) {
    return <ErrorMessageStyled>Invalid moves data.</ErrorMessageStyled>;
  }

  if (moves.length === 0) {
    return <NoMovesMessage>No moves recorded for this game.</NoMovesMessage>;
  }

  return (
    <Container>
      <Table>
        <Thead>
          <tr>
            <Th>Id</Th>
            <Th>Duration</Th>
            <Th>Player</Th>
            <Th>Move Details</Th>
          </tr>
        </Thead>
        <Tbody>
          {moves.map((move, index) => (
            <Move
              key={index}
              move={move}
              index={index}
              onMoveClick={onMoveClick}
            />
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

MovesList.propTypes = {
  moves: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
        .isRequired,
      player: PropTypes.string,
      details: PropTypes.string,
      cards: PropTypes.object,
    }),
  ).isRequired,
  onMoveClick: PropTypes.func.isRequired,
};

export default MovesList;

const Container = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 600px;
  background: #ffffff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background: #e5e7eb;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  color: #000;
`;

const Tbody = styled.tbody``;

const ErrorMessageStyled = styled.p`
  color: #ef4444;
  font-weight: 600;
`;

const NoMovesMessage = styled.p`
  color: #6b7280;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;
