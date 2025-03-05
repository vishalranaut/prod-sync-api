export interface PromiseResponse {
  error: boolean;
  message: string;
  status: number;
  data?: any;
  list?: any;
}
export interface TokenResponse {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface AuthTokenResponseType {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
export interface SignupUser {
  name: string;
  email: string;
  password: string;
}
export interface UpdateUserProfile {
  name?: string;
  password?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: { _id?: string };
    processedProducts?: ProductData[];
  }
}

export interface ProductData {
  product_name: string;
  category: string;
  price: number;
  stock: number;
  user: string;
}
export interface TokenInfo {
  token: string;
  expires: string;
}

export interface Product {
  product_name: string;
  category: string;
  price: number;
  stock: number;
  user: string;
  date_created?: Date;
  date_modified?: Date;
}
export interface ProductQueryParams {
  userId: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  limit?: number;
  offset?: number;
}
