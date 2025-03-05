/** @format */

import mongoose from "mongoose";
import * as Interfaces from "../interfaces";
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

/**
 * Create a new product
 * @param data - Product data
 */
export const createProduct = async (data: any) => {
  return await Product.create(data);
};

/**
 * Delete product by ID (Only if it belongs to the user)
 * @param productId - Product ID
 * @param userId - User ID
 */
export const deleteProductById = async (productId: string, userId: string) => {
  return await Product.findOneAndDelete({ _id: productId, user: userId });
};

/**
 * Update product by ID (Only if it belongs to the user)
 * @param productId - Product ID
 * @param userId - User ID
 * @param updateBody - Updated fields
 */
export const updateProductById = async (
  productId: string,
  userId: string,
  updateBody: Record<string, any>,
) => {
  return await Product.findOneAndUpdate(
    { _id: productId, user: userId },
    updateBody,
    { new: true },
  );
};

/**
 * Get product by ID (Only if it belongs to the user)
 * @param productId - Product ID
 * @param userId - User ID
 */
export const getProductById = async (productId: string, userId: string) => {
  return await Product.findOne({ _id: productId, user: userId });
};

/**
 * Get all products of a user
 * @param userId - User ID
 */
export const getProductsByUserId = async (userId: string) => {
  return await Product.find({ user: userId });
};

/**
 * Get all products (Admin Only - Future Scope)
 */
export const getAllProducts = async () => {
  try {
    const products = await Product.find();
    const totalCount = await Product.countDocuments();

    return { products, totalCount };
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

/**
 * Create multiple products (Only for logged-in user)
 * @param data - Array of products
 */
export const createMultipleProducts = async (data: any[]) => {
  return await Product.insertMany(data);
};
export const getProducts = async ({
  userId,
  search,
  category,
  minPrice,
  maxPrice,
  minStock,
  maxStock,
  limit = 10,
  offset = 0,
}: Interfaces.ProductQueryParams) => {
  const query: any = { user: userId };

  if (search) {
    query.product_name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (minStock !== undefined || maxStock !== undefined) {
    query.stock = {};
    if (minStock !== undefined) query.stock.$gte = minStock;
    if (maxStock !== undefined) query.stock.$lte = maxStock;
  }

  const products = await Product.find(query).limit(limit).skip(offset).exec();

  const totalCount = await Product.countDocuments(query);

  return {
    products,
    totalCount,
    limit,
    offset,
  };
};
