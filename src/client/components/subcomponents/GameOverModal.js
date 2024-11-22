/* GameOverModal.js */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GameOverModal = ({ isVisible, gameOver, onQuit, onContinue }) => {
  if (!isVisible) return null;

  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalHeader className="font-title">Game Over</ModalHeader>
        <ModalText>
          {gameOver === 'won'
            ? "Congratulations! You've won the game!"
            : 'No More Valid Moves. You might be able to rearrange your piles however...'}
        </ModalText>
        <ModalButton
          className="border-2 border-white border rounded-2xl"
          onClick={onQuit}
        >
          Quit
        </ModalButton>
        {gameOver !== 'won' && (
          <ModalButton
            className="border-2 border-white border rounded-2xl"
            onClick={onContinue}
          >
            Continue
          </ModalButton>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
};

GameOverModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  gameOver: PropTypes.string,
  onQuit: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  border: 2px solid #fff;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  text-align: center;
  color: #fff;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.h2`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #d231eb;
`;

const ModalText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const ModalButton = styled.button`
  color: #fff;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    background 0.2s;

  &:hover {
    background: #7266ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default GameOverModal;
