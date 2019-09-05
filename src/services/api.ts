import { ProductsDto, ProductDetailsDto, EchoDto } from '../dtos';

const API_HOST = 'http://localhost:8000';
const isSsr = !(typeof window !== 'undefined' && window.fetch != undefined);
const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = isSsr ? require('node-fetch') : window.fetch;
const fixUrl: (url: string) => string = url => isSsr ? (API_HOST + url) : url;

const handleResponse: (response: Response) => Promise<any> = response => {
  if (response.status === 201 || response.status === 204) {
    return Promise.resolve(); 
  }
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  throw response;
};

export const getProducts: () => Promise<ProductsDto> = () => {
  const url = fixUrl('/api/products');
  console.log('fetching products: ' + url);
  return fetch(url).then(handleResponse);
};

export const getProductDetails: (productId: number) => Promise<ProductDetailsDto> = productId => {
  const url = fixUrl(`/api/products/${productId}`);
  console.log('fetching product details: ' + url);
  return fetch(url).then(handleResponse);
};

export const getEcho: (data: string) => Promise<EchoDto> = data => {
  const url = fixUrl(`/api/echo/${encodeURIComponent(data)}`);
  console.log('fetching echo: ' + url);
  return fetch(url).then(handleResponse);
};
