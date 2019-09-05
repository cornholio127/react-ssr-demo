import React from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { useFetchedStateSsr } from '../../util/ssr';
import { addProductToCart } from '../../actions';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NavBar } from '../../components';
import { getProductDetails, getEcho } from '../../services/api';
import { ProductDetailsDto, EchoDto } from '../../dtos';

interface RouteParams {
  productId: string;
}

interface Props extends RouteComponentProps<RouteParams> {

}

const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Description = styled.span`
  font-family: Arial, sans-serif;
  font-size: 24px;
`;

const ProductDetails: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatch();
  const [echoBefore, setEchoBefore] = useFetchedStateSsr({} as EchoDto, getEcho, ['echo before']);
  const [productDetails, setProductDetails] = useFetchedStateSsr({} as ProductDetailsDto, getProductDetails, [Number(props.match.params.productId)]);
  const [echoAfter, setEchoAfter] = useFetchedStateSsr({} as EchoDto, getEcho, ['echo after']);
  const add = (e: React.MouseEvent<HTMLButtonElement>, productId: number) => {
    e.preventDefault();
    dispatch(addProductToCart(productId));
  };
  const p = productDetails.productDetails;
  return (
    <React.Fragment>
      <NavBar />
      <Title>Product Page</Title>
      {p && <Description>
        ID: {p.id}<br/>
        Name: {p.name}<br/>
        Description: {p.description}<br/>
        Color: {p.color}<br/>
        Price: {p.price}<br/>
        Stock: {p.stock}<br/>
      </Description>}
      <button onClick={e => add(e, Number(props.match.params.productId))}>Add</button>
      <hr />
      {echoBefore && echoBefore.data} / {echoAfter && echoAfter.data}
      <hr />
      <NavLink to="/products">Products</NavLink>
      <hr />
      <NavLink to="/products/1001">1001</NavLink><br />
      <NavLink to="/products/1002">1002</NavLink><br />
      <NavLink to="/products/1003">1003</NavLink><br />
    </React.Fragment>
  );
};

export default ProductDetails;
