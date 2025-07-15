#!/usr/bin/env node
const parseArguments = require("minimist");
const { runFullCLI, runTemplateDownloadCLI } = require("../src/prompts.js");
const { renderTitle } = require("../src/utils.js");
const logger = require("../src/logger.js");

renderTitle();

/**
 * Parses command-line arguments using minimist.
 *
 * @type {{
 *   template?: string,
 *   frontend?: string,
 *   backend?: string,
 *   smartContract?: string
 *   help?: boolean
 *   h?: boolean
 * }}
 */
const args = parseArguments(process.argv.slice(2));
const { template, frontend, backend, smartContract, help, h } = args;

if (help || h) {
  console.log(`
    Usage: create-farcaster-miniapp [options] [destination]

    destination:
        Name of directory for project creation.

    Options:
        --template              Download and use a template
        --template <name>       Download and use a specific template
        --frontend <name>       Specify frontend framework
        --backend <name>        Specify backend framework
        --smart-contract <name> Specify smart contract template
        --help, -h              Show help

    Examples:
        create-farcaster-miniapp
        create-farcaster-miniapp --template react-hardhat
        create-farcaster-miniapp --frontend react --smart-contract hardhat
    `);
  process.exit(0);
}

const destinationFolder = args._[0] ?? null;

if (template) {
  runTemplateDownloadCLI(template, destinationFolder)
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error.message ?? "An Unexpected error occured");
      return process.exit(1);
    });
} else {
  runFullCLI({ frontend, backend, smartContract, destinationFolder })
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error.message ?? "An Unexpected error occured");
      return process.exit(1);
    });
}
