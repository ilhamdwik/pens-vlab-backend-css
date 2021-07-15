import { createServer } from "./app";

/**
 * Error Handler. Provides full stack
 */

/**
 * Start Express server.
 */
createServer()
  .then((server) => {
    server.listen(process.env.PORT || 3000, () => {
      console.info(`Listening on http://localhost:` + process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
