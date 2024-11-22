// GitHubButton.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGithub, FaSpinner, FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * GitHubButton Component
 *
 * This component renders a button that initiates GitHub authentication.
 * It handles its own loading and success states and redirects the user upon successful authentication.
 *
 * Props:
 * - idleText: Text displayed on the button when idle.
 * - loadingText: Text displayed while authentication is in progress.
 * - successText: Text displayed upon successful authentication.
 * - redirectPath: The path to redirect the user after successful authentication.
 * - onSuccess: Optional callback function to execute before redirection.
 */
const GitHubButton = ({
  idleText = 'Register with GitHub',
  loadingText = 'Registering...',
  successText = 'Success!',
  redirectPath = '/auth/github',
  onSuccess,
}) => {
  const [githubState, setGithubState] = useState('idle');

  const handleGithubLogin = (e) => {
    e.preventDefault();

    if (githubState !== 'idle') return;
    setGithubState('loading');

    setTimeout(() => {
      setGithubState('success');

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    }, 1000);
  };

  return (
    <Button onClick={handleGithubLogin} disabled={githubState !== 'idle'}>
      {githubState === 'loading' && <FaSpinner className="loading-icon" />}
      {githubState === 'success' && <FaCheck className="success-icon" />}
      {githubState === 'idle' && <FaGithub className="github-icon" />}
      {githubState === 'loading' && loadingText}
      {githubState === 'success' && successText}
      {githubState === 'idle' && idleText}
    </Button>
  );
};

GitHubButton.propTypes = {
  idleText: PropTypes.string,
  loadingText: PropTypes.string,
  successText: PropTypes.string,
  redirectPath: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default GitHubButton;

const Button = styled.button`
  padding: 0.75rem 1rem;
  font-size: 1rem;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .loading-icon {
    font-size: 1.2rem;
    animation: spin 1s linear infinite;
  }

  .success-icon {
    font-size: 1.2rem;
    color: #4caf50;
  }

  .github-icon {
    font-size: 1.2rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
