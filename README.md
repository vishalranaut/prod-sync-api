# ProdSync API

## Overview
**ProdSync API** is a Node.js and Express-based RESTful API designed to handle user authentication, product management, and more. It integrates with MongoDB and includes Swagger documentation.

## Features
- User authentication (Signup, Login, Profile Management)
- Product CRUD operations
- File upload support
- API documentation with Swagger UI
- Logging with Winston
- Environment variable management with Dotenv
- Linting and formatting with ESLint and Prettier

## Prerequisites
- **Node.js** >= 20.0.0
- **MongoDB** (Local or Cloud Instance)

## Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/your-repo/prod-sync-api.git
cd prod-sync-api
npm install
```

## Configuration
Create a `.env` file in the root directory and configure necessary environment variables.

## Scripts
| Command           | Description |
|------------------|-------------|
| `npm run start`  | Start the server |
| `npm run dev`    | Start server in development mode with Nodemon |
| `npm run prettier` | Check code formatting |
| `npm run prettier:fix` | Auto-fix code formatting |
| `npm run lint` | Run ESLint for code analysis |
| `npm run lint:fix` | Auto-fix linting issues |

## API Documentation
Swagger documentation is available at:
```
http://localhost:5004/api-docs
```

## Technologies Used
- **Express.js** - Web framework
- **Mongoose** - MongoDB ORM
- **JSON Web Tokens (JWT)** - Authentication
- **Multer** - File uploads
- **Swagger UI Express** - API documentation
- **Winston** - Logging
- **Joi** - Data validation
- **Cors** - Cross-origin resource sharing

## License
This project is licensed under the MIT License.

## Author
[Vishal](mailto:your-email@example.com)

