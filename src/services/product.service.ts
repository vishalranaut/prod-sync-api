/** @format */

import httpStatus from "http-status";
import { Product } from "../models";
import { ApiError } from "../utils/apiError";
import MESSAGES from "../constants/response.message";
import ResponseHelper from "../utils/responseHandler";
import { logger } from "../config/logger";
import * as Interfaces from "../interfaces";

export const createProduct = async (data: Interfaces.Product): Promise<any> => {
  try {
    return await Product.createProduct(data);
  } catch (error) {
    logger.error("Error creating product:", error);
    throw error;
  }
};
export const createMultipleProducts = async (data: any): Promise<any> => {
  try {
    return await Product.createMultipleProducts(data);
  } catch (error) {
    logger.error("Error creating product:", error);
    throw error;
  }
};

export const getProductById = async (
  id: string,
  userId: string,
): Promise<any> => {
  try {
    const product = await Product.getProductById(id, userId);
    if (!product) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        MESSAGES.PRODUCT.FETCH.NOT_FOUND,
      );
    }
    return product;
  } catch (error) {
    logger.error("Error retrieving product by ID:", error);
    throw error;
  }
};

export const getProductsByUserId = async ({
  userId,
  search,
  category,
  minPrice,
  maxPrice,
  minStock,
  maxStock,
  limit = 10,
  offset = 0,
}: Interfaces.ProductQueryParams): Promise<any> => {
  try {
    return await Product.getProducts({
      userId,
      search,
      category,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      limit,
      offset,
    });
  } catch (error) {
    logger.error("Error retrieving products by user ID:", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<any> => {
  try {
    return await Product.getAllProducts();
  } catch (error) {
    logger.error("Error retrieving all products:", error);
    throw error;
  }
};

export const updateProductById = async (
  productId: string,
  userId: string,
  updateBody: Record<string, unknown>,
): Promise<any> => {
  try {
    const product = await Product.getProductById(productId, userId);
    if (!product) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        MESSAGES.PRODUCT.FETCH.NOT_FOUND,
      );
    }

    const updatedProduct = await Product.updateProductById(
      productId,
      userId,
      updateBody,
    );

    return updatedProduct;
  } catch (error) {
    logger.error("Error updating product by ID:", error);
    throw error;
  }
};

export const deleteProductById = async (
  id: string,
  userId: string,
): Promise<any> => {
  try {
    const deletedProduct = await Product.deleteProductById(id, userId);
    if (!deletedProduct) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        MESSAGES.PRODUCT.FETCH.NOT_FOUND,
      );
    }
    return deletedProduct;
  } catch (error) {
    logger.error("Error deleting product by ID:", error);
    throw error;
  }
};
