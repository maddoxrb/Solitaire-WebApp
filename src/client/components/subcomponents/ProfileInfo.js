// ProfileInfo.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCity } from 'react-icons/fa';
import { GravHash } from './Header.js';

/**
 * ProfileInfo Component
 *
 * This component displays the user's profile image along with their username, email, and city.
 *
 * Props:
 * - primaryEmail: User's primary email address.
 * - username: User's username.
 * - city: User's city.
 * - firstName: User's first name.
 * - lastName: User's last name.
 */
const ProfileInfo = ({ primaryEmail, username, city, firstName, lastName }) => {
  return (
    <ProfileContent className="mt-2">
      <ProfileImage
        src={GravHash(primaryEmail, 200)}
        alt={`${username}'s Profile`}
      />
      <InfoBlock>
        <InfoItem>
          <FaUser className="icon" />
          <span>{username}</span>
        </InfoItem>
        <InfoItem>
          <FaEnvelope className="icon" />
          <span>{primaryEmail}</span>
        </InfoItem>
        <InfoItem>
          <FaCity className="icon" />
          <span>{city}</span>
        </InfoItem>
      </InfoBlock>
    </ProfileContent>
  );
};

ProfileInfo.propTypes = {
  primaryEmail: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
};

export default ProfileInfo;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #5855ff;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 4rem;
  padding-left: 4rem;
  width: 100%;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    width: auto;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  width: 100%;

  .icon {
    color: #aaa;
    font-size: 1.5rem;
  }

  span {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    justify-content: center;
    width: auto;
  }
`;
