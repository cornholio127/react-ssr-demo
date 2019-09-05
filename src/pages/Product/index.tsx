import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { fetchProducts, addProductToCart } from '../../actions';
import { useSelector } from 'react-redux';
import { NavBar } from '../../components';
import { AppState } from '../../model';
import { useEffectSsr, useDispatchSsr } from '../../util/ssr';

interface Props {

}

const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Product: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatchSsr();
  useEffectSsr(
    () => {
      dispatch(fetchProducts());
    },
    [],
  );
  const products = useSelector((state: AppState) => state.products.data);
  const items: React.ReactNode[] = [];
  if (products) {
    products.products.forEach((product, index) => {
      items.push(<li key={index}><NavLink to={`/products/${product.id}`}>{product.name}</NavLink></li>);
    });
  }
  return (
    <React.Fragment>
      <NavBar />
      <Title>Product Page</Title>
      <ul>
        {items}
      </ul>
    </React.Fragment>
  );
};

export default Product;
