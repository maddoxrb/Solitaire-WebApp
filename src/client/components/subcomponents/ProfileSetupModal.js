// components/SetupModal.js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const Modal = ({ title, message, buttonText, onButtonClick }) => {
  return (
    <ModalBackdrop>
      <ModalContent className="border-2 border-white border-rounded rounded-2xl animate__animated animate__slower animate__fadeInRight">
        <ModalHeader className="font-title text-2xl text-white">
          {title}
        </ModalHeader>
        <ModalBody className="text-white text-xl">{message}</ModalBody>
        <ModalButton onClick={onButtonClick}>{buttonText}</ModalButton>
      </ModalContent>
    </ModalBackdrop>
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #5855ff, #bd0698);
  padding: 2em;
  border-radius: 8px;
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
  @media (min-width: 500px) {
    max-width: 400px;
  }
`;

const ModalHeader = styled.h2`
  margin-bottom: 1em;
`;

const ModalBody = styled.p`
  margin-bottom: 2em;
`;

const ModalButton = styled.button`
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;
