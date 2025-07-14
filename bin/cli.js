#!/usr/bin/env node
const parseArguments = require("minimist");
const {
  runFullCLI,
  runSearchCLI,
  runTemplateDownloadCLI,
} = require("../src/prompts.js");
const { renderTitle } = require("../src/utils.js");
const logger = require("../src/logger.js");

renderTitle();

/**
 * Parses command-line arguments using minimist.
 *
 * @type {{
 *   template?: string,
 *   search?: string,
 *   frontend?: string,
 *   backend?: string,
 *   smartContract?: string
 *   help?: boolean
 *   h?: boolean
 * }}
 */
const args = parseArguments(process.argv.slice(2));
const { template, search, frontend, backend, smartContract, help, h } = args;

if (help || h) {
  console.log(`
    Usage: create-farcaster-miniapp [options]

    Options:
        --template <name>       Download and use a specific template
        --template <name>       Download and use a specific template
        --search   <query>      Search for available templates
        --frontend <name>       Specify frontend framework
        --backend <name>        Specify backend framework
        --smart-contract <name>  Specify smart contract template
        --help, -h              Show help

    Examples:
        create-farcaster-miniapp
        create-farcaster-miniapp --template react-hardhat
        create-farcaster-miniapp --search react
        create-farcaster-miniapp --search
        create-farcaster-miniapp --frontend react --smart-Contract hardhat
    `);
  process.exit(0);
}

if (template) {
  const destinationFolder = args._[0] ?? null;

  runTemplateDownloadCLI(template, destinationFolder)
    .then(() => process.exit(0))
    .catch((error) => {
      logger.fail(error.message ?? "An Unexpected error occured");
      return process.exit(1);
    });
} else if (search) {
  runSearchCLI()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.fail(error.message ?? "An Unexpected error occured");
      return process.exit(1);
    });
} else {
  runFullCLI({ frontend, backend, smartContract })
    .then(() => process.exit(0))
    .catch((error) => {
      logger.fail(error.message ?? "An Unexpected error occured");
      return process.exit(1);
    });
}
