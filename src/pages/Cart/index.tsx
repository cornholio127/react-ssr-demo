import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../model';
import { removeProductFromCart, clearCart } from '../../actions';
import { NavBar } from '../../components';

interface Props {

}

const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Subtitle = styled.h2`
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
`;

const Cart: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatch();
  const cart = useSelector((state: AppState) => state.cart.data);
  const items: React.ReactNode[] = [];
  const remove = (e: React.MouseEvent<HTMLButtonElement>, productId: number) => {
    e.preventDefault();
    dispatch(removeProductFromCart(productId));
  };
  const clear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(clearCart());
  };
  cart.forEach((entry, index) => {
    items.push(
      <li key={index}>
        {entry[0]}: {entry[1]}
        <button onClick={e => remove(e, entry[0])}>Remove</button>
      </li>
    );
  });
  return (
    <React.Fragment>
      <NavBar />
      <Title>Cart</Title>
      <Subtitle>Products</Subtitle>
      <ul>
        {items}
      </ul>
      <button onClick={clear}>Clear</button>
    </React.Fragment>
  );
};

export default Cart;
