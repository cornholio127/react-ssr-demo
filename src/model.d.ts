import { ProductDto, ProductsDto } from '@dtos';

export interface ProductsState {
  data?: ProductsDto;
  isLoading: boolean;
}

export interface CartState {
  data: [number, number][];
}

export interface AppState {
  products: ProductsState;
  cart: CartState;
}
