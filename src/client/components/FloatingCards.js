'use strict';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import ten from '../../../public/images/10_of_hearts.png';
import joker from '../../../public/images/red_joker.png';
import ace from '../../../public/images/ace_of_hearts.png';
import king from '../../../public/images/queen_of_clubs2.png';
import jack from '../../../public/images/jack_of_diamonds2.png';
import five from '../../../public/images/5_of_clubs.png';
import seven from '../../../public/images/7_of_spades.png';
import two from '../../../public/images/2_of_diamonds.png';
import ace2 from '../../../public/images/ace_of_clubs.png';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px);}
  50% { transform: translateY(-40px);}
  100% { transform: translateY(0px);}
`;

/**
 * Transient props (prefixed with $) are used to prevent passing them to the DOM.
 * These props are only available within styled-components.
 */
const FloatingCard = styled.div`
  width: 190px;
  height: 275px;
  background-image: url(${(props) => props.$cardImage});
  background-size: cover;
  background-position: center;
  border-radius: 17px;
  animation: ${floatAnimation} 8s ease-in-out infinite;
  position: absolute;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, #bd0698, #333399, #ff00cc);
    background-size: 400% 400%;
    animation: ${gradientAnimation} 80s ease infinite;
    opacity: 0.75;
    border-radius: 0px;
  }
`;

const FloatingPlaceholder = styled.div`
  z-index: -1;
  width: 230px;
  height: 330px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  position: absolute;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
`;

export const FloatingCards = () => {
  const cards = [
    { cardImage: ace, top: '10%', left: '25%' },
    { cardImage: ace2, top: '20%', left: '75%' },
    { cardImage: joker, top: '40%', left: '10%' },
    { cardImage: ten, top: '35%', left: '58%' },
    { cardImage: king, top: '-10%', left: '15%' },
    { cardImage: seven, top: '70%', left: '65%' },
    { cardImage: king, top: '75%', left: '90%' },
    { cardImage: ten, top: '85%', left: '5%' },
    { cardImage: jack, top: '95%', left: '40%' },
    { cardImage: five, top: '2%', left: '52%' },
    { cardImage: two, top: '58%', left: '32%' },
    { cardImage: seven, top: '2%', left: '-6%' },
    { cardImage: ace, top: '42%', left: '90%' },
    { cardImage: king, top: '6%', left: '97%' },
  ];

  const placeholders = [
    { top: '-10%', left: '15%' },
    { top: '25%', left: '40%' },
    { top: '50%', left: '70%' },
    { top: '97%', left: '65%' },
    { top: '10%', left: '-5%' },
    { top: '90%', left: '26%' },
    { top: '10%', left: '80%' },
    { top: '48%', left: '14%' },
  ];

  return (
    <div>
      {/* Floating Cards */}
      {cards.map((card, index) => (
        <FloatingCard
          className="border-1 rounded-xl shadow-3xl"
          key={index}
          $top={card.top}
          $left={card.left}
          $cardImage={card.cardImage}
          style={{ animationDelay: `${(index / cards.length) * 6}s` }}
        />
      ))}

      {/* Floating Placeholders */}
      {placeholders.map((placeholder, index) => (
        <FloatingPlaceholder
          key={index}
          $top={placeholder.top}
          $left={placeholder.left}
          style={{ animationDelay: `${(index / placeholders.length) * 6}s` }}
        />
      ))}
    </div>
  );
};
