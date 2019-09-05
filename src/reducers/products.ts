import { Action } from '@actions';
import { ProductsState } from '@model';

const products: (state: ProductsState, action: Action) => ProductsState = (state={isLoading: false}, action) => {
  switch (action.type) {
    case 'REQUEST_PRODUCTS':
      return {isLoading: true};
    case 'RECEIVE_PRODUCTS':
      return {isLoading: false, data: action.products};
    default:
      return state;
  }
};

export default products;
