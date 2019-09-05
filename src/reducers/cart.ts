import { CartState } from '../model';
import { Action } from '../actions';

const cart: (state: CartState, action: Action) => CartState = (state={data: []}, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT_TO_CART': {
        const map = new Map(state.data);
        map.set(action.id, map.has(action.id) ? map.get(action.id)! + 1 : 1);
        return { data: Array.from(map) };
      }
    case 'REMOVE_PRODUCT_FROM_CART': {
        const map = new Map(state.data);
        map.delete(action.id);
        return { data: Array.from(map) };
      }
    case 'CLEAR_CART':
      return { data: [] };
    default:
      return state;
  }
};

export default cart;
