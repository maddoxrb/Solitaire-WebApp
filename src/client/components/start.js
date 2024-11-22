'use strict';
import 'animate.css';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaGamepad } from 'react-icons/fa';
import { ErrorMessage } from './shared.js';
import { GiCardAceHearts } from 'react-icons/gi';
import { OptionsSelector } from './subcomponents/OptionsSelector.js';

export const Start = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    game: 'klondike',
    draw: 'Draw 1',
    color: 'Red',
  });
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 850);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');

    if (!state.game || !state.color) {
      setError('Please select a game type and card color.');
      return;
    }

    try {
      const response = await fetch('/v1/game', {
        body: JSON.stringify({
          game: state.game,
          draw: state.draw,
          color: state.color,
        }),
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsLeaving(true);
        setNextPath(`/game/${data.id}`);
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  const onChange = (ev) =>
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });

  return (
    <StartBase>
      <FormCard
        className={`animate__animated animate__slow ${
          isLeaving ? 'animate__fadeOutLeft' : 'animate__fadeInRight'
        } mt-10 border-2 border-white border-rounded rounded-xl`}
      >
        <Title className="font-title">Create New Game</Title>
        {error && <ErrorMessage msg={state.error} hide={!state.error} />}
        <StartForm onSubmit={onSubmit}>
          <div className="flex mb-4 justify-center font-title text-2xl text-white">
            <GiCardAceHearts className="mt-2 mr-4" />
            Klondike
            <GiCardAceHearts className="mt-2 ml-4" />
          </div>
          <OptionsSelector state={state} onChange={onChange} />
          <StartButton type="submit font-title">
            <FaGamepad className="icon font-title" /> Start Game
          </StartButton>
        </StartForm>
      </FormCard>
    </StartBase>
  );
};

Start.propTypes = {};

// Start Component Styles
const StartBase = styled.div`
  grid-row: main;
  grid-column: sb / main;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  z-index: 1;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 2rem 3rem;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.6);
  animation: animate__animated animate__fadeInUp;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const StartForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StartButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #5855ff, #bd0698);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.2rem;
  }
`;
