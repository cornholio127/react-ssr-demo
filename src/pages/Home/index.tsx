import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { NavBar } from '../../components';

interface Props {

}

const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Home: React.FunctionComponent<Props> = props => {
  return (
    <React.Fragment>
      <NavBar />
      <Title>Home</Title>
      <NavLink to="/products">Products</NavLink>
    </React.Fragment>
  );
};

export default Home;
