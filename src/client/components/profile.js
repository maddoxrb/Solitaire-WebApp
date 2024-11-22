// Profile.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GameList from './subcomponents/GameList.js';
import { Modal } from './subcomponents/ProfileSetupModal.js';
import { FaUserEdit } from 'react-icons/fa';
import { ErrorMessage } from './shared.js';
import 'animate.css';
import ProfileInfo from './subcomponents/ProfileInfo.js';

export const Profile = (props) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: '',
    first_name: '',
    last_name: '',
    primary_email: '',
    city: '',
    games: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const requiredFields = ['first_name', 'last_name', 'city', 'primary_email'];

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        console.error(err);
        setError('Unable to load profile. Please try again later.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUser(username);
  }, [username]);

  useEffect(() => {
    if (state.username === props.currentUser) {
      const missingFields = requiredFields.filter(
        (field) => !state[field] || state[field].trim() === '',
      );

      if (missingFields.length > 0) {
        setShowModal(true);
      }
    }
  }, [state, props.currentUser]);

  useEffect(() => {
    if (isLeaving && nextPath) {
      const timeout = setTimeout(() => {
        navigate(nextPath);
      }, 850);
      return () => clearTimeout(timeout);
    }
  }, [isLeaving, nextPath, navigate]);

  const isUser = state.username === props.currentUser;

  const handleModalButtonClick = () => {
    setIsLeaving(true);
    setNextPath(`/edit/${state.username}`);
  };

  const handleStartNewGame = () => {
    setIsLeaving(true);
    setNextPath('/start');
  };

  return (
    <PageContainer>
      {showModal && (
        <Modal
          title="Complete Your Profile"
          message="We need a few more details from you to complete your profile."
          buttonText="Update Profile"
          onButtonClick={handleModalButtonClick}
        />
      )}

      {isLoading ? (
        <LoaderContainer></LoaderContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorMessage msg={error} hide={!error} />
        </ErrorContainer>
      ) : (
        <FormCard
          className={`-mt-20 pb-4 animate__animated ${
            isLeaving
              ? 'animate__slow animate__fadeOutLeft'
              : 'animate__slow animate__fadeInRight'
          } border-2 border-white rounded-md`}
        >
          <Title className="font-title">Welcome Back {state.first_name}!</Title>
          {state.error && (
            <ErrorMessage msg={state.error} hide={!state.error} />
          )}
          <ContentContainer>
            <ProfileSection>
              <ProfileInfo
                primaryEmail={state.primary_email}
                username={state.username}
                city={state.city}
                firstName={state.first_name}
                lastName={state.last_name}
              />
              {isUser && (
                <div className="pl-16 -mt-4">
                  <EditButton
                    className="pl-10"
                    onClick={() => {
                      setIsLeaving(true);
                      setNextPath(`/edit/${username}`);
                    }}
                  >
                    <FaUserEdit className="icon font-title" /> Edit Profile
                  </EditButton>
                </div>
              )}
            </ProfileSection>
            <GameSection>
              <GameList
                toCreateGame={isUser}
                games={state.games}
                onStartNewGame={handleStartNewGame}
              />
            </GameSection>
          </ContentContainer>
        </FormCard>
      )}
    </PageContainer>
  );
};

Profile.propTypes = {
  currentUser: PropTypes.string,
};

const PageContainer = styled.div`
  grid-row: 2;
  grid-column: sb / main;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  min-height: 100vh;
  z-index: 1;
  box-sizing: border-box;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorContainer = styled.div`
  background: rgba(255, 0, 0, 0.1);
  padding: 1rem 2rem;
  border-radius: 10px;
`;

const FormCard = styled.div`
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  max-height: 90vh;
  border-radius: 15px;
  width: 100%;
  max-width: 1400px;
  text-align: center;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
  &.blurred {
    filter: blur(2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1rem;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const ProfileSection = styled.div`
  flex: 1;
  max-width: 45%;
  margin-right: 1rem;
  text-align: left;

  @media (max-width: 1024px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
`;

const GameSection = styled.div`
  flex: 1;
  max-width: 55%;
  text-align: left;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const EditButton = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #5855ff, #bd0698);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 1.2rem;
  }
`;

const Divider = styled.h3`
  position: relative;
  text-align: left;
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -1rem;
    width: 10px;
    height: 1px;
    background: #aaa;
  }
`;
