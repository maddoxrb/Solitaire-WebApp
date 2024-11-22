// Edit.js

'use strict';
import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { GravHash } from './subcomponents/Header.js';
import { ErrorMessage, InfoBlock } from './shared.js';
import 'animate.css';

/**
 * Renders a form to edit a user's profile, with fields for first name, last name,
 * city, and primary email address. The form is only accessible if the user is
 * logged in and is editing their own profile. If the user is not logged in or is
 * trying to edit someone else's profile, the component will display a message
 * saying that they do not have permission to edit the profile.
 *
 * @param {string} currentUser - The username of the currently logged in user.
 */
export const ProfileEditor = (props) => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    username: '',
    first_name: '',
    last_name: '',
    primary_email: '',
    city: '',
    error: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  const requiredFields = ['first_name', 'last_name', 'city', 'primary_email'];

  const fetchUser = (username) => {
    fetch(`/v1/user/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch user data.');
        }
        return res.json();
      })
      .then((data) => {
        setState(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setState((prevState) => ({
          ...prevState,
          error: 'Failed to load user data.',
        }));
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUser(username);
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });

    if (value.trim() !== '') {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    requiredFields.forEach((field) => {
      if (!state[field] || state[field].trim() === '') {
        tempErrors[field] = 'This field is required.';
      }
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLeaving(true);
      setNextPath(`/profile/${state.username}`);

      fetch(`/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: state.username,
          first_name: state.first_name,
          last_name: state.last_name,
          primary_email: state.primary_email,
          city: state.city,
        }),
      })
        .then((res) => {
          setIsSubmitting(false);
          if (!res.ok) {
            throw new Error('Failed to update profile');
          }
        })
        .catch((err) => {
          console.error(err);
          setState({ ...state, error: err.message });
          setIsLeaving(false);
        });
    }
  };

  const isUser = state.username === props.currentUser;

  const isFormValid = requiredFields.every(
    (field) => state[field] && state[field].trim() !== '',
  );

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  if (isLoading) {
    return <ProfileContainer></ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <FormCard
        className={`mt-20 animate__animated animate__slow ${
          isLeaving ? 'animate__fadeOutLeft' : 'animate__fadeInRight'
        } mb-60 border-2 border-white rounded-md w-2/3`}
      >
        <Title className="font-title">Edit Profile</Title>
        <ErrorMessage msg={state.error} hide={!state.error} />
        {isUser ? (
          <form onSubmit={handleSave}>
            <ProfileBlockBase>
              <ProfileImage
                className="mr-10 -ml-6 mt-42"
                src={GravHash(state.primary_email, 200)}
              />
              <InfoBlock>
                <Label className="font-title mt-2">Username:</Label>
                <InputField
                  type="text"
                  name="username"
                  value={state.username}
                  disabled
                />

                <Label className="font-title mt-2">First Name:</Label>
                <InputField
                  type="text"
                  name="first_name"
                  value={state.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                />
                {errors.first_name && (
                  <ErrorText>{errors.first_name}</ErrorText>
                )}

                <Label className="font-title mt-2">Last Name:</Label>
                <InputField
                  type="text"
                  name="last_name"
                  value={state.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                />
                {errors.last_name && <ErrorText>{errors.last_name}</ErrorText>}

                <Label className="font-title mt-4">City:</Label>
                <InputField
                  type="text"
                  name="city"
                  value={state.city}
                  onChange={handleChange}
                  error={errors.city}
                />
                {errors.city && <ErrorText>{errors.city}</ErrorText>}

                <Label className="font-title mt-4">Email Address:</Label>
                <InputField
                  type="email"
                  name="primary_email"
                  value={state.primary_email}
                  onChange={handleChange}
                  error={errors.primary_email}
                />
                {errors.primary_email && (
                  <ErrorText>{errors.primary_email}</ErrorText>
                )}
              </InfoBlock>
            </ProfileBlockBase>
            <SaveButton type="submit" disabled={!isFormValid || isSubmitting}>
              Save
            </SaveButton>
          </form>
        ) : (
          <p>You do not have permission to edit this profile.</p>
        )}
      </FormCard>
    </ProfileContainer>
  );
};

ProfileEditor.propTypes = {
  currentUser: PropTypes.string,
};

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #fff;
  grid-row: 2;
  grid-column: sb / main;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.85);
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  animation: animate__animated animate__fadeInDown;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fff;
  text-align: center;
`;

const ProfileBlockBase = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'pic' 'profile';
  padding: 1em;

  @media (min-width: 500px) {
    grid-template-columns: auto 1fr;
    grid-template-areas: 'pic profile';
    padding: 2em;
  }
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-right: 3rem;
  border: 4px solid #5855ff;
  margin-top: 5rem;

  @media (min-width: 500px) {
    max-width: 200px;
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  color: #fff;
  margin-top: 1.5rem;
  font-size: 1rem;
  margin-right: 2rem;
`;

const InputField = styled.input`
  margin: 0.5em 0;
  padding: 0.6em 1rem;
  background: rgba(0, 0, 0, 0.85);
  width: 100%;
  rgba(0, 0, 0, 0.3);
  border: 2px solid ${(props) => (props.error ? '#ff6b6b' : '#5855ff')};
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #bd0698;
    box-shadow: 0 0 5px rgba(189, 6, 152, 0.8);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const ErrorText = styled.span`
  color: #ff6b6b;
  font-size: 0.9em;
`;

const SaveButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #5855ff, #bd0698);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;
