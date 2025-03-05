const MESSAGES = {
  AUTH: {
    TOKEN: {
      VERIFY: {
        empty_token: "Auth Token required",
        wrong_token: "Access denied",
        expired_token: "Token has expired",
        valid_token: "Token is valid",
        INVALID_LINK: "The link you followed has expired",
      },
      GENERATE: {
        error: "Failed to generate token",
        success: "Token successfully created",
      },
    },
    REFRESH_TOKEN: {
      VERIFY: {
        empty_token: "Refresh token required",
        success: "Refresh token successfully verified",
      },
      GENERATE: {
        error: "Failed to generate refresh token",
        success: "Refresh token successfully created",
      },
    },
  },

  USER: {
    PROFILE: {
      SUCCESS: "User profile fetched successfully",
      FAILURE: "Invalid user requested",
      WALLET: "User wallet already exists",
    },
    LOGIN: {
      WRONG_EMAIL: "This email doesn't exist",
      UNVERIFIED_EMAIL: "Email must be verified",
      WRONG_DETAILS: "Incorrect email or password",
      SUCCESS: "You have successfully logged in",
      BLOCKED:
        "Your account has been temporarily blocked due to multiple incorrect password attempts. Please try again later.",
    },
    UPDATE: {
      FAILED: "Failed to update user",
      SUCCESS: "User successfully updated",
      PASSWORD_UPDATE_SUCCESS: "Password successfully changed",
      PASSWORD_UPDATE_FAILURE:
        "Unable to change password. Please try again later!",
      PASSWORD_NOT_MATCH: "Old password does not match!",
    },
    SUCCESS: "User registered successfully.",
    ERROR: "Unable to register user, please try again.",
    ALREADY_EXISTS: "User email already exists",
    DELETED: "User deleted successfully.",
    NOT_FOUND: "User not found",
    FOUND: "User found",
    LIST: "User list fetched successfully",
    FAILURE: "Invalid user",
    UNAUTHORIZED: "Unauthorized user",
    LOGOUT: "You have successfully logged out",
  },

  PRODUCT: {
    CREATE: {
      SUCCESS: "Product successfully created",
      ERROR: "Failed to create product",
    },
    FETCH: {
      SUCCESS: "Product details fetched successfully",
      ERROR: "Failed to fetch product details",
      NOT_FOUND: "Product not found",
      LIST_SUCCESS: "Product list fetched successfully",
      LIST_ERROR: "Failed to fetch product list",
    },
    UPDATE: {
      SUCCESS: "Product successfully updated",
      ERROR: "Failed to update product",
      NOT_FOUND: "Product not found",
    },
    DELETE: {
      SUCCESS: "Product successfully deleted",
      ERROR: "Failed to delete product",
      NOT_FOUND: "Product not found",
    },
    VALIDATION: {
      MISSING_FIELDS: "Required product fields are missing",
      INVALID_PRICE: "Invalid price value",
      INVALID_STOCK: "Stock value must be a positive number",
      INVALID_CATEGORY: "Invalid category value",
    },
    PERMISSION: {
      UNAUTHORIZED: "You are not authorized to perform this action",
    },
  },

  JWT: {
    ERROR: "Failed to authenticate user",
    GENERATE_ERROR: "Failed to sign JWT token",
    USER_ID_ERROR: "Invalid user ID",
    SECRET_ERROR: "JWT secret missing",
    EXPIRED: "Token expired",
    SUCCESS: "Success",
  },

  ENV_ERROR: "Environment variables not loaded",
};

export default MESSAGES;
