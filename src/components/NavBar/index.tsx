import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../model';

interface Props {

}

const NavBar: React.FunctionComponent<Props> = props => {
  const cart = useSelector((state: AppState) => state.cart.data);
  let total = 0;
  cart.forEach(entry => total += entry[1]);
  return (
    <React.Fragment>
      <NavLink to="/">Home</NavLink>
      &nbsp;&nbsp;&nbsp;
      <NavLink to="/cart">Cart{total > 0 ? ` (${total})` : ''}</NavLink>
      <hr />
    </React.Fragment>
  );
};

export default NavBar;
