/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * OptionsSelector Component
 *
 * This component renders the option selectors for the game draw count and card color.
 * It accepts props for state handling and displays the appropriate options.
 */
export const OptionsSelector = ({ state, onChange }) => (
  <StartOptions>
    <OptionGroup>
      <OptionLabel htmlFor="draw" className="font-title">
        Draw:
      </OptionLabel>
      <OptionSelect
        id="draw"
        name="draw"
        disabled={state.game === 'hearts'}
        value={state.draw}
        onChange={onChange}
      >
        <option value="Draw 1">Draw 1</option>
        <option value="Draw 3">Draw 3</option>
      </OptionSelect>
    </OptionGroup>
    <OptionGroup>
      <OptionLabel htmlFor="color" className="font-title">
        Card Color:
      </OptionLabel>
      <OptionSelect
        id="color"
        name="color"
        value={state.color}
        onChange={onChange}
      >
        <option value="Red">Red</option>
        <option value="Green">Green</option>
        <option value="Blue">Blue</option>
        <option value="Magical">Magical</option>
      </OptionSelect>
    </OptionGroup>
  </StartOptions>
);

OptionsSelector.propTypes = {
  state: PropTypes.shape({
    game: PropTypes.string,
    draw: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

// Styled Components for OptionsSelector
const StartOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  color: #fff;
  font-size: 1rem;
`;

const OptionSelect = styled.select`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(0, 0, 0, 0.9);
    box-shadow: 0 0 0 2px #5855ff;
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.5);
    cursor: not-allowed;
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background: #5855ff;
      color: #fff;
    }
  }
`;
