// Landing.js
'use strict';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import 'animate.css';
import styled, { keyframes } from 'styled-components';

export const Landing = () => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    setIsLeaving(true);
    setNextPath(path);
  };

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <LandingBase>
      <div className="w-full h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 text-center text-white">
          <header
            className={`animate__animated animate__backInDown mb-8 ${
              isLeaving ? 'animate__animated animate__fadeOutLeft' : ''
            }`}
          >
            <h1 className="font-title text-5xl md:text-6xl drop-shadow-lg">
              Super Duper Solitaire
            </h1>
          </header>

          <div
            className={`animate__animated animate__backInDown mb-8 ${
              isLeaving ? 'animate__animated animate__fadeOutLeft' : ''
            }`}
          >
            <a
              href="/register"
              onClick={handleNavigate('/register')}
              className="text-white border-2 border-white animate__animated animate__slower animate__infinite animate__pulse animate__delay-3s font-semibold py-3 px-6 rounded-full shadow-2xl hover:bg-black transition duration-300 inline-flex items-center"
            >
              <FaUserPlus size={20} className="mr-2" />
              Register Now!
            </a>

            <div className="relative text-white flex flex-col items-center mt-6 ">
              <button
                onClick={toggleDropdown}
                className="mt-4 flex items-center bg-black bg-opacity-50 text-white border-2 border-white py-2 px-4 rounded-lg hover:bg-opacity-75 transition duration-300"
              >
                For Graders <IoIosArrowDown className="ml-2" />
              </button>
              {isDropdownOpen && (
                <DropdownContent>
                  <p>
                    Features:
                    <ul className="list-disc list-inside mt-2">
                      <li>3 - Enable modification of a user's profile</li>
                      <li>4 - Working Results Page</li>
                      <li>5 - Clickable Results Moves</li>
                      <li>6 - Log in via Github</li>
                      <li>8 - Recognize End of Game</li>
                      <li>9 - Infinite Undo/Redo</li>
                    </ul>
                  </p>
                </DropdownContent>
              )}
            </div>
          </div>

          <footer className="mt-8 text-white text-sm"></footer>
        </div>
      </div>
    </LandingBase>
  );
};

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LandingBase = styled.div`
  display: flex;
  justify-content: center;
  grid-row: 2;
  grid-column: sb / main;
  position: relative;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(270deg, #bd0698, #333399, #ff00cc);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 80s ease infinite;
  z-index: -2;
`;

const DropdownContent = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  text-align: left;
`;
