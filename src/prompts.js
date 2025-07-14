import {} from "enquirer";

/**
 * Runs the full CLI process for the miniapp, including frontend, backend, and smart contract steps.
 *
 * @async
 * @function
 * @param {Object} params - The parameters for running the CLI.
 * @param {Function} params.frontend - The function to handle frontend setup.
 * @param {Function} params.backend - The function to handle backend setup.
 * @param {Function} params.smartContract - The function to handle smart contract setup.
 * @returns {Promise<void>} Resolves when the CLI process is complete.
 */
export async function runFullCLI({ frontend, backend, smartContract }) {}

/**
 * Runs a search operation in the CLI.
 *
 * @async
 * @function
 * @param {string} search - The search query string.
 * @returns {Promise<void>} A promise that resolves when the search operation is complete.
 */
export async function runSearchCLI(search) {}

/**
 * Runs the CLI process to download a specified template.
 *
 * @async
 * @function
 * @param {string} template - The name or identifier of the template to download.
 * @returns {Promise<void>} A promise that resolves when the download process is complete.
 */
export async function runTemplateDownloadCLI(template) {}
