import { ProductsDto } from '../dtos';
import { AppState } from '../model';
import { Dispatch } from 'redux';
import { api } from '../services';

export type Action = {
  type: 'REQUEST_PRODUCTS',
} | {
  type: 'RECEIVE_PRODUCTS',
  products: ProductsDto,
} | {
  type: 'ADD_PRODUCT_TO_CART',
  id: number,
} | {
  type: 'REMOVE_PRODUCT_FROM_CART',
  id: number,
} | {
  type: 'CLEAR_CART',
};

const shouldFetchProducts: (state: AppState) => boolean = state => state.products.data == undefined && !state.products.isLoading;

const requestProducts: () => Action = () => ({
  type: 'REQUEST_PRODUCTS',
});

const receiveProducts: (products: ProductsDto) => Action = (products) => ({
  type: 'RECEIVE_PRODUCTS',
  products,
});

export const fetchProducts: () => any = () => {
  return (dispatch: Dispatch<any>, getState: () => AppState) => {
    if (shouldFetchProducts(getState())) {
      dispatch(requestProducts());
      return api.getProducts().then(dto => dispatch(receiveProducts(dto)));
    } else {
      return Promise.resolve();
    }
  };
};

export const addProductToCart: (productId: number) => Action = productId => ({
  type: 'ADD_PRODUCT_TO_CART',
  id: productId,
});

export const removeProductFromCart: (productId: number) => Action = productId => ({
  type: 'REMOVE_PRODUCT_FROM_CART',
  id: productId,
});

export const clearCart: () => Action = () => ({
  type: 'CLEAR_CART',
});
