import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * MoveTable Component
 *
 * Displays a table of moves related to the games.
 *
 * Props:
 * - toCreateMove: Boolean indicating if the user can create a new move.
 * - moves: Array of move objects.
 * - onViewMoveDetails: Function to handle viewing move details.
 */
const MoveTable = ({ toCreateMove, moves, onViewMoveDetails }) => {
  return (
    <TableContainer>
      <TableHeader>
        <th>Move ID</th>
        <th>Game</th>
        <th>Player</th>
        <th>Action</th>
      </TableHeader>
      <tbody>
        {moves.map((move) => (
          <TableRow key={move.id}>
            <td>{move.id}</td>
            <td>{move.gameName}</td>
            <td>{move.player}</td>
            <td>
              <ViewButton onClick={() => onViewMoveDetails(move.id)}>
                View
              </ViewButton>
            </td>
          </TableRow>
        ))}
      </tbody>
      {toCreateMove && (
        <CreateMoveButton onClick={() => onViewMoveDetails('new')}>
          + Create New Move
        </CreateMoveButton>
      )}
    </TableContainer>
  );
};

MoveTable.propTypes = {
  toCreateMove: PropTypes.bool.isRequired,
  moves: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewMoveDetails: PropTypes.func.isRequired,
};

export default MoveTable;

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.tr`
  background: #5855ff;
  color: #fff;

  th {
    padding: 1rem;
    text-align: left;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }

  td {
    padding: 1rem;
    color: #fff;
  }
`;

const ViewButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #bd0698;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #a5057c;
  }
`;

const CreateMoveButton = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #00b894;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #019874;
  }
`;
