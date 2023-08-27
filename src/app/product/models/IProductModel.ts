export interface NewProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
}

export interface UpdateProductRequest {
    productId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export interface ProductResponse {
    productId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}