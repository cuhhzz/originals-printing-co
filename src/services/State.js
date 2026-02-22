import { getProducts } from './ApiService.js';

const state = {
    products: [],
    cart: [],
};

export const initializeState = async () => {
    state.products = await getProducts();
};

export const getState = () => {
    return state;
};
