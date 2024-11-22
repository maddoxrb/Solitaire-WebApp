/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulsate = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.03);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const CardWrapper = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  top: ${(props) => props.top}%;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  object-fit: cover;

  ${(props) =>
    props.selected &&
    css`
      border: 4px solid #d231eb;
      animation: ${pulsate} 1.5s infinite;
    `}

  /* Gradient Overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, #bd0698, #333399, #ff00cc);
    background-size: 400% 400%;
    animation: ${gradientAnimation} 80s ease infinite;
    opacity: 0.1;
    border-radius: 20px;
    pointer-events: none;
  }
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
`;

export const Card = ({ card, top, left, onClick, selected }) => {
  const source = card.up
    ? `/images/${card.value}_of_${card.suit}.png`
    : '/images/face_down.jpg';
  const id = `${card.suit}:${card.value}`;

  return (
    <CardWrapper
      className="border-2 border-black border-rounded rounded-4xl"
      id={id}
      onClick={onClick}
      top={top}
      left={left}
      selected={selected}
      tabIndex="0"
      onKeyPress={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <CardImg
        src={source}
        alt={`${card.value} of ${card.suit}`}
        loading="lazy"
      />
    </CardWrapper>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    suit: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    up: PropTypes.bool.isRequired,
    id: PropTypes.string,
  }).isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

const PileBase = styled.div`
  margin: 5px;
  position: relative;
  display: inline-block;
  width: 9%;
  background: linear-gradient(135deg, #5855ff, #bd0698);
`;

const PileFrame = styled.div`
  margin-top: 138%;
`;

export const Pile = ({
  cards = [],
  spacing = 8,
  horizontal = false,
  up,
  onClick,
  selected = false,
}) => {
  const children = cards.map((card, i) => {
    const top = horizontal ? 0 : i * spacing;
    const left = horizontal ? i * spacing : 0;
    return (
      <Card
        key={i}
        card={card}
        up={up}
        top={top}
        left={left}
        onClick={onClick}
        selected={selected}
      />
    );
  });

  return (
    <PileBase
      className="shadow-4xl border-2 border-black rounded-pile border-rounded"
      onClick={onClick}
    >
      <PileFrame />
      {children}
    </PileBase>
  );
};

Pile.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  horizontal: PropTypes.bool,
  spacing: PropTypes.number,
  maxCards: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  selected: PropTypes.bool,
};
