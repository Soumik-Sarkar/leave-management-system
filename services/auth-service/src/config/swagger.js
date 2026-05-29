const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Auth Service API",

    version: "1.0.0",

    description: "Authentication APIs for Leave Management System",
  },

  servers: [
    {
      url: "http://localhost:3001",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      RegisterRequest: {
        type: "object",

        properties: {
          name: {
            type: "string",
          },

          email: {
            type: "string",
          },

          password: {
            type: "string",
          },

          role: {
            type: "string",
            example: "EMPLOYEE",
          },

          employeeId: {
            type: "string",
          },
        },
      },

      LoginRequest: {
        type: "object",

        properties: {
          email: {
            type: "string",
          },

          password: {
            type: "string",
          },
        },
      },

      AuthResponse: {
        type: "object",

        properties: {
          success: {
            type: "boolean",
          },

          token: {
            type: "string",
          },
        },
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
