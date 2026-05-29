const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Leave Service API",

    version: "1.0.0",

    description: "Leave APIs for Leave Management System",
  },

  servers: [
    {
      url: "http://localhost:3003",
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

module.exports = swaggerJsdoc(options);
