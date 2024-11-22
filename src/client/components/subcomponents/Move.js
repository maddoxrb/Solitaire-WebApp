'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { FaClock, FaUser, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Move Component
 *
 * Represents a single move in the moves list.
 *
 * @component
 * @param {Object} move - The move object containing move details.
 * @param {number} index - The index of the move in the list.
 * @param {Function} onMoveClick - Function to handle move click.
 * @returns {React.Element} The rendered Move component.
 */
const Move = ({ move, index, onMoveClick }) => {
  const moveDate = new Date(move.date);
  const duration = Math.floor((Date.now() - moveDate) / 1000);

  const handleClick = () => {
    onMoveClick(move);
  };

  return (
    <tr
      onClick={handleClick}
      className="cursor-pointer hover:bg-gray-100 transition duration-300"
    >
      <td className="py-2 px-4 border-b">{move.id ? move.id : index + 1}</td>
      <td className="py-2 px-4 border-b">
        <FaClock className="inline-block text-blue-500 mr-2" />
        {isNaN(duration) ? 'N/A' : `${duration} seconds`}
      </td>
      <td className="py-2 px-4 border-b">
        <FaUser className="inline-block text-green-500 mr-2" />
        <a
          href={`/profile/${move.player || 'unknown'}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {move.player || 'Unknown Player'}
        </a>
      </td>
      <td className="py-2 px-4 border-b">
        <FaInfoCircle className="inline-block text-gray-500 mr-2" />
        {move.details || 'No details available'}
      </td>
    </tr>
  );
};

Move.propTypes = {
  move: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
      .isRequired,
    player: PropTypes.string,
    details: PropTypes.string,
    cards: PropTypes.object,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onMoveClick: PropTypes.func.isRequired,
};

export default Move;
