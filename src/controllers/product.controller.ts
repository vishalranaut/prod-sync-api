import * as httpStatus from "http-status";
import { ProductService } from "../services";
import SetResponse from "../utils/responseHandler";
import MESSAGES from "../constants/response.message";
import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
  processedProducts?: any[];
  userId?: string;
}
export class ProductController {
  createProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (req.processedProducts) {
        const response = await ProductService.createMultipleProducts(
          req.processedProducts,
        );
        return SetResponse.success(res, httpStatus.status.OK, {
          data: response,
          message: MESSAGES.PRODUCT.CREATE.SUCCESS,
          error: false,
        });
      } else {
        const data = req.body;
        data.user = req.userId;

        const response = await ProductService.createProduct(data);
        return SetResponse.success(res, httpStatus.status.OK, {
          data: response,
          message: MESSAGES.PRODUCT.CREATE.SUCCESS,
          error: false,
        });
      }
    } catch (error: any) {
      console.error("Product Creation Error:", error);
      next(error);
    }
  };

  getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const { productId } = req.params;
      const userId = req.user._id;
      const product = await ProductService.getProductById(
        productId,
        userId as string,
      );

      if (!product) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.PRODUCT.FETCH.NOT_FOUND,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: product,
        message: MESSAGES.PRODUCT.FETCH.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Get Product Error:", error);
      next(error);
    }
  };

  // Get all products by user ID
  getProductsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req.user._id!;

      const {
        search,
        category,
        minPrice,
        maxPrice,
        minStock,
        maxStock,
        limit = "10",
        offset = "0",
      } = req.body;
      const products = await ProductService.getProductsByUserId({
        userId,
        search: search as string,
        category: category as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minStock: minStock ? parseInt(minStock as string, 10) : undefined,
        maxStock: maxStock ? parseInt(maxStock as string, 10) : undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      });

      SetResponse.success(res, httpStatus.status.OK, {
        data: products,
        message: MESSAGES.PRODUCT.FETCH.LIST_SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Get User's Product List Error:", error);
      next(error);
    }
  };

  // Get all products
  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const products = await ProductService.getAllProducts();

      SetResponse.success(res, httpStatus.status.OK, {
        data: products,
        message: MESSAGES.PRODUCT.FETCH.LIST_SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Get All Products Error:", error);
      next(error);
    }
  };

  updateProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { productId } = req.params;
      const updateData = req.body;
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req.user._id;

      const updatedProduct = await ProductService.updateProductById(
        productId,
        userId as string,
        updateData,
      );
      if (!updatedProduct) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.PRODUCT.UPDATE.NOT_FOUND,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: updatedProduct,
        message: MESSAGES.PRODUCT.UPDATE.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Update Product Error:", error);
      next(error);
    }
  };

  deleteProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const { productId } = req.params;
      const userId = req.user._id;
      const deletedProduct = await ProductService.deleteProductById(
        productId,
        userId as string,
      );

      if (!deletedProduct) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.PRODUCT.DELETE.NOT_FOUND,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: deletedProduct,
        message: MESSAGES.PRODUCT.DELETE.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Delete Product Error:", error);
      next(error);
    }
  };
}

export default new ProductController();
