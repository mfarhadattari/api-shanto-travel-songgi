import express, { Application, Request, Response } from 'express';
import config from './app/config';
import { ApplicationRouter } from './app/routes';
import notFoundHandler from './app/middlewares/notFoundHandler';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

// application
const app: Application = express();

// parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully.',
    data: {
      app_name: config.app_name,
      node_env: config.node_env,
    },
  });
});

// application routes
app.use('/api', ApplicationRouter);

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFoundHandler);

export default app;
