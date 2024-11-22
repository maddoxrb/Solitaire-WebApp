// Login.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';
import 'animate.css';
import { ErrorMessage } from './shared.js';
import GitHubButton from './subcomponents/GithubButton.js';

export const Login = (props) => {
  const navigate = useNavigate();
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    let res = await fetch('/v1/session', {
      body: JSON.stringify({ username, password }),
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) {
      await props.logIn(data.username);
      setIsLeaving(true);
      setNextPath(`/profile/${data.username}`);
    } else {
      setError(`Error: ${data.error}`);
    }
  };

  const onGitHubSuccess = () => {
    setIsLeaving(true);
    setNextPath('/auth/github');
  };

  useEffect(() => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  return (
    <PageContainer>
      <FormCard
        className={`mb-60 border-2 border-white rounded-md animate__animated animate__fadeInRight ${
          isLeaving ? 'animate__animated animate__fadeOutLeft' : ''
        }`}
      >
        <Title className="font-title">Login</Title>
        {error && <ErrorMessage msg={error} hide={!error} />}

        <Form onSubmit={onSubmit}>
          <InputContainer>
            <FaUser className="input-icon" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(ev) => setUser(ev.target.value.toLowerCase())}
            />
          </InputContainer>

          <InputContainer>
            <FaLock className="input-icon" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => setPass(ev.target.value)}
            />
          </InputContainer>

          <Button type="submit">Login</Button>
          <Divider>or</Divider>
          <GitHubButton
            idleText="Login with GitHub"
            loadingText="Logging in..."
            successText="Success!"
            redirectPath="/auth/github"
            onSuccess={onGitHubSuccess}
          />
        </Form>
      </FormCard>
    </PageContainer>
  );
};

Login.propTypes = {
  logIn: PropTypes.func.isRequired,
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #fff;
  grid-row: 2;
  grid-column: sb / main;
  z-index: 1;
  position: relative;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.65);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputContainer = styled.div`
  position: relative;

  .input-icon {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: none;
  border-radius: 10px;
  background: #2d2d3b;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: #3a3a4f;
    box-shadow: 0 0 0 2px #5855ff;
  }

  &::placeholder {
    color: #aaa;
  }
`;

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
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #aaa;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #aaa;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;
