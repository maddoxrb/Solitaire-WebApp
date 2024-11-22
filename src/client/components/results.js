'use strict';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import GameDetail from './subcomponents/GameDetail.js';
import MovesList from './subcomponents/MoveList.js';
import GameView from './subcomponents/GameView.js';
import { ErrorMessage } from './shared.js';

/**
 * Results Component
 *
 * Fetches and displays game details along with the list of moves.
 *
 * @component
 * @returns {React.Element} The rendered Results component.
 */
const Results = () => {
  const { id } = useParams();
  const [game, setGame] = useState({
    start: 0,
    score: 0,
    cards_remaining: 0,
    active: true,
    moves: [],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMove, setSelectedMove] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/v1/game/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game data.');
        }

        const data = await response.json();

        const mergedMoves = Array.isArray(data.moveJSONS)
          ? data.moveJSONS.map((move, index) => ({
              id: index + 1,
              player: move.user,
              details: `${move.src} → ${move.dst}`,
              date: move.date,
              cards: data.history[index],
            }))
          : [];

        setGame({
          ...data,
          moves: mergedMoves,
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to load game details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleMoveClick = (move) => {
    setSelectedMove(move);
  };

  const handleBackToMoves = () => {
    setSelectedMove(null);
  };

  return (
    <PageContainer>
      <ResultsContainer className="border-2 border-white border-rounded rounded-2xl">
        {error && <ErrorMessage msg={error} hide={!error} />}
        {isLoading ? (
          <LoadingContainer>
            <SpinnerStyled />
            <LoadingText>Loading game details...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            <SectionTitle>Game Details:</SectionTitle>
            <GameDetail
              start={game.start}
              moves={game.moves}
              score={game.score}
              cards_remaining={game.cards_remaining}
              active={game.active}
            />
            {!selectedMove ? (
              <MovesList moves={game.moves} onMoveClick={handleMoveClick} />
            ) : (
              <GameView
                move={selectedMove}
                drawType={game.drawType}
                onBack={handleBackToMoves}
              />
            )}
          </>
        )}
      </ResultsContainer>
    </PageContainer>
  );
};

export default Results;

const PageContainer = styled.div`
  grid-row: 2;
  grid-column: sb / main;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-height: 100vh;
  box-sizing: border-box;
`;

// Container for the Results component
const ResultsContainer = styled.div`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
  width: 100vw;
  max-width: 1200px;
  color: #fff;
  margin-top: 2rem;
`;

// Title for sections
const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
  text-align: center;
`;

// Spinner animation keyframes
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled spinner component
const SpinnerStyled = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.1);
  border-top: 8px solid #5855ff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

// Loading text styling
const LoadingText = styled.p`
  color: #fff;
  font-size: 1.2rem;
`;

// Container for loading state
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;
