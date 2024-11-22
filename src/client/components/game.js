/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Pile } from './subcomponents/Pile.js';
import { FaArrowRotateLeft, FaArrowRotateRight } from 'react-icons/fa6';
import GameOverModal from './subcomponents/GameOverModal.js';

export const Game = (params) => {
  const [selectedPile, setSelectedPile] = useState(null);
  const [drawType, setDrawType] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    pile1: [],
    pile2: [],
    pile3: [],
    pile4: [],
    pile5: [],
    pile6: [],
    pile7: [],
    stack1: [],
    stack2: [],
    stack3: [],
    stack4: [],
    draw: [],
    discard: [],
  });
  const user = params.user;
  const [gameOver, setGameOver] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Open the modal when the game is won or lost
  useEffect(() => {
    if (gameOver === 'won' || gameOver === 'lost') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [gameOver]);

  // Undo and Redo
  const handleUndo = async () => {
    try {
      const response = await fetch(`/v1/game/${id}/undo`);
      if (response.ok) {
        const data = await response.json();
        setState({ ...data });
      } else {
        console.error('Undo failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error while performing undo:', error);
    }
  };

  const handleRedo = async () => {
    try {
      const response = await fetch(`/v1/game/${id}/redo`);
      if (response.ok) {
        const data = await response.json();
        setState({ ...data });
      } else {
        console.error('Redo failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error while performing redo:', error);
    }
  };

  // Fetch the game state
  useEffect(() => {
    const getGameState = async () => {
      const response = await fetch(`/v1/game/${id}`);
      const data = await response.json();
      setDrawType(data.drawType);
      setState({
        ...data,
      });
    };
    getGameState();
  }, [id]);

  // Handle Clicks
  const onClick = (pileId, ev) => {
    ev.stopPropagation();

    // Handle Clicks on the Draw Pile
    if (pileId === 'draw') {
      if (selectedPile !== null) {
        setSelectedPile(null);
        return;
      }

      const move = {
        src: 'draw',
        dst: 'discard',
      };
      sendMove(move);
      return;
    }

    // Handle Movement Clicks
    if (selectedPile === null) {
      setSelectedPile(pileId);
    } else {
      if (pileId !== selectedPile) {
        const move = {
          src: selectedPile,
          dst: pileId,
        };
        sendMove(move);
      }

      setSelectedPile(null);
    }
  };

  // Send a Move for Validation
  const sendMove = (move) => {
    fetch(`/v1/game/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(move),
    })
      .then((response) => {
        if (!response.ok) {
          console.log('Network response was not ok:', response.statusText);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setState({
          ...state,
          ...data.state,
        });

        if (
          (data.result === 'won' || data.result === 'lost') &&
          gameOver === null
        ) {
          setGameOver(data.result);
        } else if (data.result !== 'won' && data.result !== 'lost') {
          setGameOver(null); // Reset if the game becomes winnable again
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  // Handle Game Over
  const handleQuit = async () => {
    try {
      const response = await fetch(`/v1/game/${id}/quit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        navigate(`/profile/${user.username}`);
      } else {
        const errorData = await response.json();
        console.error('Quit failed:', errorData.error || response.statusText);
      }
    } catch (error) {
      console.error('Error while performing quit:', error);
    }
  };

  const handleContinue = () => {
    setGameOver('continue');
  };

  // Handle Deselections
  useEffect(() => {
    const handleDocumentClick = () => {
      if (selectedPile !== null) {
        setSelectedPile(null);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && selectedPile !== null) {
        setSelectedPile(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedPile]);

  return (
    <>
      <GameBase
        style={{
          filter:
            gameOver === 'won' || gameOver === 'lost' ? 'blur(2px)' : 'none',
        }}
      >
        <div
          className="-mt-32 mb-4 z-5"
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <button
            onClick={handleUndo}
            className="font-title hover:font-black text-2xl"
            style={{
              color: '#fff',
              border: 'none',
              padding: '0.75em 1.5em',
              margin: '0.5em',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
            }}
          >
            <FaArrowRotateLeft />
            Undo
          </button>
          <button
            className="font-title hover:font-black text-2xl"
            onClick={handleRedo}
            style={{
              color: '#fff',
              border: 'none',
              padding: '0.75em 1.5em',
              margin: '0.5em',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
            }}
          >
            Redo
            <FaArrowRotateRight />
          </button>
        </div>
        <CardRow className="animate__animated  animate__slow	 animate__fadeInRight">
          <Pile
            cards={state.stack1}
            spacing={0}
            onClick={(ev) => onClick('stack1', ev)}
            selected={selectedPile === 'stack1'}
          />
          <Pile
            cards={state.stack2}
            spacing={0}
            onClick={(ev) => onClick('stack2', ev)}
            selected={selectedPile === 'stack2'}
          />
          <Pile
            cards={state.stack3}
            spacing={0}
            onClick={(ev) => onClick('stack3', ev)}
            selected={selectedPile === 'stack3'}
          />
          <Pile
            cards={state.stack4}
            spacing={0}
            onClick={(ev) => onClick('stack4', ev)}
            selected={selectedPile === 'stack4'}
          />
          <CardRowGap />
          <Pile
            cards={state.draw}
            spacing={0}
            onClick={(ev) => onClick('draw', ev)}
            selected={selectedPile === 'draw'}
          />
          <Pile
            cards={
              drawType === 3 ? state.discard.slice(-3) : state.discard.slice(-1)
            }
            spacing={drawType === 3 ? 10 : 0}
            onClick={(ev) => onClick('discard', ev)}
            selected={selectedPile === 'discard'}
          />
        </CardRow>
        <CardRow className="-mt-4 animate__animated animate__slower	  animate__fadeInRight">
          <Pile
            cards={state.pile1}
            onClick={(ev) => onClick('pile1', ev)}
            selected={selectedPile === 'pile1'}
          />
          <Pile
            cards={state.pile2}
            onClick={(ev) => onClick('pile2', ev)}
            selected={selectedPile === 'pile2'}
          />
          <Pile
            cards={state.pile3}
            onClick={(ev) => onClick('pile3', ev)}
            selected={selectedPile === 'pile3'}
          />
          <Pile
            cards={state.pile4}
            onClick={(ev) => onClick('pile4', ev)}
            selected={selectedPile === 'pile4'}
          />
          <Pile
            cards={state.pile5}
            onClick={(ev) => onClick('pile5', ev)}
            selected={selectedPile === 'pile5'}
          />
          <Pile
            cards={state.pile6}
            onClick={(ev) => onClick('pile6', ev)}
            selected={selectedPile === 'pile6'}
          />
          <Pile
            cards={state.pile7}
            onClick={(ev) => onClick('pile7', ev)}
            selected={selectedPile === 'pile7'}
          />
        </CardRow>
      </GameBase>

      <GameOverModal
        isVisible={showModal}
        gameOver={gameOver}
        onQuit={handleQuit}
        onContinue={handleContinue}
      />
    </>
  );
};

Game.propTypes = {};

const CardRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2em;
`;

const CardRowGap = styled.div`
  flex-grow: 1;
`;

const GameBase = styled.div`
  grid-row: 2;
  grid-column: main;
  margin-right: 6em;
  margin-top: 2em;
`;
