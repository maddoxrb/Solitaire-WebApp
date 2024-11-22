'use strict';
import '../tailwind.css';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Header } from './components/subcomponents/Header.js';
import { Landing } from './components/landing.js';
import { Login } from './components/login.js';
import { Logout } from './components/logout.js';
import { Register } from './components/register.js';
import { Profile } from './components/profile.js';
import { Start } from './components/start.js';
import Results from './components/results.js';
import { Game } from './components/game.js';
import { ProfileEditor } from './components/ProfileEditor.js';
import { FloatingCards } from './components/FloatingCards.js';
import { createGlobalStyle } from 'styled-components';
import { useLocation } from 'react-router-dom';

const defaultUser = {
  username: '',
  first_name: '',
  last_name: '',
  primary_email: '',
  city: '',
  games: [],
};

const AppContent = ({ state, logIn, logOut, loggedIn }) => {
  const location = useLocation();
  const isResultsPage = location.pathname.includes('/results');

  return (
    <>
      {!isResultsPage && <GlobalStyle />}
      <AnimatedBackground />
      <FloatingCards />

      <GridBase>
        <Header user={state.username} email={state.primary_email} />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/login" element={<Login logIn={logIn} />} />
          <Route path="/logout" element={<Logout logOut={logOut} />} />
          <Route
            path="/edit/:username"
            element={<ProfileEditor currentUser={state.username} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile/:username"
            element={
              loggedIn() ? (
                <Profile currentUser={state.username} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/start" element={<Start />} />
          <Route path="/game/:id" element={<Game user={state} />} />
          <Route path="/results/:id" element={<Results user={state} />} />
        </Routes>
      </GridBase>
    </>
  );
};

const MyApp = () => {
  const preloadedState = window.__PRELOADED_STATE__;
  let [state, setState] = useState(
    preloadedState ? preloadedState : defaultUser,
  );

  const loggedIn = () => state.username && state.primary_email;

  const logIn = async (username) => {
    const response = await fetch(`/v1/user/${username}`, {
      credentials: 'include',
    });
    if (response.ok) {
      const user = await response.json();
      setState(user);
    }
  };

  const logOut = async () => {
    await fetch('/v1/session', {
      method: 'DELETE',
      credentials: 'include',
    });
    localStorage.removeItem('user');
    setState(defaultUser);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await fetch('/v1/session', {
        credentials: 'include',
      });
      if (response.ok) {
        const user = await response.json();
        setState(user);
      }
    };
    if (!preloadedState) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContent
        state={state}
        logIn={logIn}
        logOut={logOut}
        loggedIn={loggedIn}
      />
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('mainDiv'));
root.render(<MyApp />);

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GlobalStyle = createGlobalStyle`
  html, body, #mainDiv {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
`;

const GridBase = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'hd'
    'main'
    'ft';

  @media (min-width: 500px) {
    grid-template-columns: 40px 50px 1fr 50px 40px;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'hd hd hd hd hd'
      'sb sb main main main'
      'ft ft ft ft ft';
  }
  position: relative; /* Ensure it's the containing block for absolute children */
`;

const AnimatedBackground = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(270deg, #bd0698, #333399, #ff00cc);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 80s ease infinite;
  z-index: -1;
`;
