/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { itemsRouter } from "./items/items.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logger from "./common/Logger";
import transactionRouters from "./routers/Transaction";

dotenv.config();
/**
 * App Variables
 */

/**
 *  Database connection
 */

mongoose
  .connect(config.mongo.url)
  .then(() => {
    Logger.info("Connected to MongoDB!");
    startServer();
  })
  .catch((error) => {
    Logger.error(error);
  });
const db = mongoose.Connection;
const startServer = () => {
  const app = express();
  /**
   *  App Configuration
   */

  //logging the request
  app.use((req, res, next) => {
    Logger.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] `
    );
    res.on("finish", () => {
      Logger.info(
        `Response -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });

  app.use(helmet());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/transactions/", transactionRouters);

  /** Healthcheck */
  app.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );

  app.use(errorHandler);
  app.use(notFoundHandler);

  /**
   * Server Activation
   */

  app.listen(config.server.port, () => {
    Logger.info(`Listening on port ${config.server.port}`);
  });
};
