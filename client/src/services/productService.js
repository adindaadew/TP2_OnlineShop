import axios from 'axios';
import BASE_URL from '../config/api.js';

const API_URL = `${BASE_URL}/products`;

export async function getProducts() {
    const response = await axios.get(API_URL);
    return response.data;
}

export async function getProductById(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        return null;
    }
}

export async function createProduct(productData, token) {
    const response = await axios.post(API_URL, productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateProduct(id, productData, token) {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function deleteProduct(id, token) {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}