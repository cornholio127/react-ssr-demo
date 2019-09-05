export interface ProductDto {
  id: number;
  name: string;
  price: string;
}

export interface ProductsDto {
  products: ProductDto[];
}

export interface ProductDetailsDto {
  productDetails: {
    id: number;
    name: string;
    price: string;
    description: string;
    stock: number;
    color: string;
  }
}

export interface EchoDto {
  data: string;
}
