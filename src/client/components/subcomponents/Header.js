/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import md5 from 'md5';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import 'animate.css';
import { CgCardSpades } from 'react-icons/cg';

export function GravHash(email, size) {
  let hash = email && email.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  hash = hash && hash.toLowerCase();
  hash = hash && md5(hash);
  return `https://www.gravatar.com/avatar/${hash}?size=${size}`;
}

const HeaderLeftBase = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-style: italic;
  & > a {
    text-decoration: none;
    color: #fff;
    display: flex;
    align-items: center;
  }
  & > a > h2,
  & > h2 {
    color: #fff;
    margin: 0.75em 0 0.75em 0.5em;
    display: flex;
    align-items: center;
    font-weight: normal;
  }
  & > a > h2 > svg,
  & > h2 > svg {
    margin-right: 0.2em;
  }
`;

const HeaderLeft = ({ user }) => {
  return (
    <HeaderLeftBase>
      {user !== '' ? (
        <Link to={`/profile/${user}`}>
          <h2 className="font-title text-3xl">
            <CgCardSpades size={30} />
            Super Duper Solitaire
          </h2>
        </Link>
      ) : (
        <Link to={`/`}>
          <h2 className="font-title text-3xl">
            <CgCardSpades size={30} />
            Super Duper Solitaire
          </h2>
        </Link>
      )}
    </HeaderLeftBase>
  );
};

HeaderLeft.propTypes = {
  user: PropTypes.string,
};

/*************************************************************************/

const HeaderRightBase = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$vertical ? 'row' : 'column')};
  justify-content: center;
  align-items: ${(props) => (props.$vertical ? 'center' : 'flex-end')};
  padding-right: 0.5em;
`;

const HeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  margin-right: ${(props) => (props.$vertical ? '0.5em' : '0')};
  padding: 0.5em;

  & > svg {
    margin-right: 0.25em;
  }
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 55px;
  height: 55px;
  object-fit: cover;
  margin-left: ${(props) => (props.$vertical ? '0.5em' : '0')};
`;

const HeaderRight = ({ user, email }) => {
  const isLoggedIn = user !== '';
  return (
    <HeaderRightBase $vertical={isLoggedIn}>
      {isLoggedIn ? (
        <Fragment>
          <HeaderLink to="/logout" $vertical={isLoggedIn}>
            <FaSignOutAlt size={20} />
            Log Out
          </HeaderLink>
          <Link to={`/profile/${user}`}>
            <ProfileImage
              src={GravHash(email, 40)}
              alt="Profile"
              className="border-2 border-white rounded-full"
            />
          </Link>
        </Fragment>
      ) : (
        <Fragment>
          <HeaderLink id="loginLink" to="/login">
            <FaSignInAlt size={20} />
            <h2 className="font-title">Log In</h2>
          </HeaderLink>
        </Fragment>
      )}
    </HeaderRightBase>
  );
};

HeaderRight.propTypes = {
  user: PropTypes.string,
  email: PropTypes.string,
};

/*******************************************************************/

const HeaderBase = styled.div`
  font-family: 'Roboto', sans-serif;
  grid-area: hd;
  display: flex;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  z-index: 3;
`;

export const Header = ({ user = '', email = '' }) => (
  <>
    <HeaderBase>
      <HeaderLeft user={user} />
      <HeaderRight user={user} email={email} />
    </HeaderBase>
  </>
);

Header.propTypes = {
  user: PropTypes.string,
  email: PropTypes.string,
};
