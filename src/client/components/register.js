'use strict';
import React, { useState, useEffect } from 'react';
import { ErrorMessage } from './shared.js';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCity,
  FaAddressCard,
  FaSpinner,
  FaCheck,
} from 'react-icons/fa';
import 'animate.css';
import GitHubButton from './subcomponents/GithubButton.js';

export const Register = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: '',
    first_name: '',
    last_name: '',
    city: '',
    primary_email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const [submitState, setSubmitState] = useState('idle');

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 540);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  useEffect(() => {
    document.getElementById('username').focus();
  }, []);

  const onChange = (ev) => {
    setError('');
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleButtonLogin = async (e) => {
    e.preventDefault();

    if (submitState !== 'idle') return;
    setSubmitState('loading');

    await wait(1200);

    try {
      const res = await fetch('/v1/user', {
        method: 'POST',
        body: JSON.stringify(state),
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (res.ok) {
        setSubmitState('success');
        await wait(1700);
        navigate('/login');
      } else {
        const err = await res.json();
        setError(err.error || 'Registration failed');
        setSubmitState('idle');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setSubmitState('idle');
    }
  };

  const onGitHubSuccess = () => {
    setIsLeaving(true);
    setNextPath('/auth/github');
  };

  return (
    <PageContainer>
      <FormCard
        className={`-py-2 -mt-24 border-2 border-white rounded-md animate__animated animate__fadeInRight ${
          isLeaving
            ? 'animate__animated animate_slower animate__fadeOutLeft'
            : ''
        }`}
      >
        <Title className="font-title">Register</Title>
        {error && <ErrorMessage msg={error} hide={!error} />}

        <Form onSubmit={handleButtonLogin}>
          <InputContainer>
            <FaUser className="input-icon" />
            <Input
              id="username"
              name="username"
              placeholder="Username"
              onChange={onChange}
              value={state.username}
            />
          </InputContainer>

          <InputContainer>
            <FaAddressCard className="input-icon" />
            <Input
              id="first_name"
              name="first_name"
              placeholder="First Name"
              onChange={onChange}
              value={state.first_name}
            />
          </InputContainer>

          <InputContainer>
            <FaAddressCard className="input-icon" />
            <Input
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              onChange={onChange}
              value={state.last_name}
            />
          </InputContainer>

          <InputContainer>
            <FaCity className="input-icon" />
            <Input
              id="city"
              name="city"
              placeholder="City"
              onChange={onChange}
              value={state.city}
            />
          </InputContainer>

          <InputContainer>
            <FaEnvelope className="input-icon" />
            <Input
              id="primary_email"
              name="primary_email"
              type="email"
              placeholder="Email Address"
              onChange={onChange}
              value={state.primary_email}
            />
          </InputContainer>

          <InputContainer>
            <FaLock className="input-icon" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={onChange}
              value={state.password}
            />
          </InputContainer>

          <Button disabled={submitState !== 'idle'}>
            {submitState === 'loading' && (
              <FaSpinner className="loading-icon" />
            )}
            {submitState === 'success' && <FaCheck className="success-icon" />}
            {submitState === 'idle' && 'Register'}
            {submitState === 'loading' && 'Registering...'}
            {submitState === 'success' && 'Success!'}
          </Button>
          <Divider>or</Divider>
          <GitHubButton
            idleText="Register with GitHub"
            loadingText="Registering..."
            successText="Success!"
            redirectPath="/auth/github"
            onSuccess={onGitHubSuccess}
          />
        </Form>
      </FormCard>
    </PageContainer>
  );
};

export default Register;

const PageContainer = styled.div`
  display: flex;
  grid-row: 2;
  grid-column: sb / main;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #fff;
  z-index: 1;
  position: relative;
  padding: 1rem;
  box-sizing: border-box;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.65);
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  text-align: center;

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputContainer = styled.div`
  position: relative;

  .input-icon {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: #000;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: none;
  border-radius: 10px;
  background: #fff;
  color: #000;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: #fff;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .loading-icon {
    font-size: 1.2rem;
    animation: spin 3s linear infinite;
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
