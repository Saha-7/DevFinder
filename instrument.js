// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://32cc2a1ab8c0de7329d49aa8deeb79f1@o4511140224368640.ingest.us.sentry.io/4511140236427264",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});