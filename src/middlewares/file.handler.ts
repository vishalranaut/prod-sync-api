import multer from "multer";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";
import { Request, Response, NextFunction } from "express";
import SetResponse from "../utils/responseHandler";
import * as httpStatus from "http-status";
import * as Interfaces from "../interfaces";
import MESSAGES from "../constants/response.message";
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `products_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

export const csvFileValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      return SetResponse.error(res, httpStatus.status.BAD_REQUEST, {
        message: err.message,
        error: true,
      });
    }

    if (!req.file) {
      return SetResponse.error(res, httpStatus.status.BAD_REQUEST, {
        message: "CSV file is required",
        error: true,
      });
    }

    const filePath = req.file.path;
    const processedProducts: Interfaces.ProductData[] = [];
    if (!req.user) {
      return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
        message: MESSAGES.USER.UNAUTHORIZED,
        error: true,
      });
    }
    const userId = req.user._id as string;

    try {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          try {
            if (
              !row.product_name ||
              !row.category ||
              !row.price ||
              !row.stock
            ) {
              console.error("Invalid row:", row);
              return;
            }

            processedProducts.push({
              product_name: row.product_name.trim(),
              category: row.category.trim(),
              price: parseFloat(row.price),
              stock: parseInt(row.stock, 10),
              user: userId,
            });
          } catch (error) {
            console.error("CSV Row Processing Error:", error);
          }
        })
        .on("end", () => {
          req.processedProducts = processedProducts;
          fs.unlinkSync(filePath);
          next();
        })
        .on("error", (error) => {
          console.error("CSV Parsing Error:", error);
          return SetResponse.error(res, httpStatus.status.BAD_REQUEST, {
            message: "Error processing CSV file",
            error: true,
          });
        });
    } catch (error) {
      console.error("CSV File Handling Error:", error);
      return SetResponse.error(res, httpStatus.status.INTERNAL_SERVER_ERROR, {
        message: "Error reading the CSV file",
        error: true,
      });
    }
  });
};
