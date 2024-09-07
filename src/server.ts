/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import config from './app/config';

let server: Server;

(async () => {
  // Start the server

  // Start listening on port 3000
  server = app.listen(config.port, () => {
    console.log(`[${config.app_name}]: is running...✅`);
  });

  const existHandler = () => {
    if (server) {
      server.close(() => {
        console.warn('Server closed...❌');
      });
    }
    process.exit(1);
  };
  process.on('uncaughtException', (err) => {
    console.error(err);
    existHandler();
  });

  process.on('unhandledRejection', (err) => {
    console.error(err);
    existHandler();
  });
})();
