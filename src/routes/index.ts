/** @format */

import { Router } from "express";

import userRoute from "./user.route";
import productRoute from "./product.route";
// Functions for handling each route
function userRoutes(router: Router): void {
  router.use("/user", userRoute);
}
function productRoutes(router: Router): void {
  router.use("/product", productRoute);
}

// Object containing all route functions
const routes = {
  userRoutes,
  productRoutes,
};

export default function (router: Router): void {
  // Loop through the route functions and apply them to the router
  Object.values(routes).forEach((routeFunc) => routeFunc(router));
}
