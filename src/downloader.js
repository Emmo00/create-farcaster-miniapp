const { createDirectory } = require('./fileio');
const logger = require('./logger.js');
const degit = require('degit');

let cachedTemplates = null;

/**
 * Downloads a template by its ID.
 *
 * @async
 * @function
 * @param {string} templateRepoUrl - The git repo of the template to download (e.g. https://github.com/emmo00/celo-factory).
 * @param {string} destinationPath - The destination for download (e.g. ./my-app).
 * @returns {Promise<void>} A promise that resolves when the template has been downloaded.
 */
async function downloadTemplate(templateRepoUrl, destinationPath) {
  // Extract the GitHub user/repo from full URL
  const match = templateRepoUrl.match(
    /github\.com\/([^/]+)\/([^/]+)(?:\.git)?/,
  );
  if (!match) {
    throw new Error('Invalid GitHub repo URL');
  }

  const user = match[1];
  const repo = match[2];

  const emitter = degit(`${user}/${repo}`, {
    cache: false,
    force: true,
    verbose: true,
  });

  // Ensure the destination exists
  createDirectory(destinationPath);

  emitter.on('info', (info) => {
    logger.spinner.text = info.message;
  });

  logger.info(`Cloning ${user}/${repo}`);
  logger.start(`Cloning ${user}/${repo}`);

  // Download the template into destination
  await emitter.clone(destinationPath);

  logger.spinner.succeed();
}

/**
 * Fetches the list of community templates from the remote template registry.
 * Caches the result in memory after a successful fetch to avoid redundant network requests.
 *
 * @async
 * @function
 * @returns {Promise<Array<{
 *   name: string,
 *   description: string,
 *   repository: string,
 *   stack: {
 *     frontend: string[] | null,
 *     backend: string[] | null,
 *     chain: string[] | null,
 *     smartContract: string[] | null,
 *   }
 * }>>} A promise that resolves to an array of template objects.
 * @throws {Error} If the templates cannot be fetched from the registry.
 */
async function getCommunityTemplates() {
  if (cachedTemplates) {
    return cachedTemplates;
  }

  const templateRegistryURL =
    'https://raw.githubusercontent.com/Emmo00/create-farcaster-miniapp/refs/heads/main/templates.json';

  const response = await fetch(templateRegistryURL);

  if (response.ok) {
    const responseJSON = await response.json();
    cachedTemplates = responseJSON.templates ?? [];
    return cachedTemplates;
  }

  throw new Error('Cannot get templates from registry');
}

module.exports = {
  downloadTemplate,
  getCommunityTemplates,
};
