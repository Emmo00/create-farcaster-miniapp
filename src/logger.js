const ora = require("ora").default;

const spinner = ora();

const logger = {
  info: (msg) => {
    console.log(`[INFO] ${msg}`);
  },
  warn: (msg) => {
    console.warn(`[WARN] ${msg}`);
  },
  error: (msg) => {
    console.error(`[ERROR] ${msg}`);
  },
  start: (msg) => {
    spinner.text = msg;
    spinner.start();
  },
  succeed: (msg) => {
    spinner.succeed(msg);
  },
  fail: (msg) => {
    spinner.fail(msg);
  },
  stop: () => {
    spinner.stop();
  },
  spinner,
};

module.exports = logger;
