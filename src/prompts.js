const { Input, AutoComplete } = require("enquirer");
const logger = require("./logger.js");
const { getCommunityTemplates, downloadTemplate } = require("./downloader.js");
const { isDirectoryEmpty } = require("./fileio.js");
const pc = require("picocolors");
const { renderFooter } = require("./utils.js");

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
async function runFullCLI({ frontend, backend, smartContract }) {}

/**
 * Runs a search operation in the CLI.
 *
 * @async
 * @function
 * @param {string} search - The search query string.
 * @returns {Promise<void>} A promise that resolves when the search operation is complete.
 */
async function runSearchCLI(search) {}

/**
 * Runs the CLI process to download a specified template.
 *
 * @async
 * @function
 * @param {string} templateId - The name or identifier of the template to download.
 * @param {string} destinationFolder - The destination the template should be downloaded to.
 * @returns {Promise<void>} A promise that resolves when the download process is complete.
 */
async function runTemplateDownloadCLI(templateId, destinationFolder) {
  if (!destinationFolder) {
    destinationFolder = await new Input({
      message: "Enter the name of your project",
      initial: "awesome-miniapp",
    }).run();
  }

  if (!isDirectoryEmpty(destinationFolder)) {
      throw new Error("Directory not empty.");
  }

  logger.start("Getting Templates");

  const templates = await getCommunityTemplates();

  logger.succeed();

  if (templateId === true) {
    // Run fuzzy find templates
    const templateChoice = await new AutoComplete({
      name: "template",
      message: "Choose your Template",
      limit: 10,
      multiple: false,
      footer() {
        return pc.dim("\n(Scroll up and down to reveal more choices)");
      },
      choices: templates.map(
        (template) =>
          `${template.name} ~ ${pc.green(pc.italic(template.description))}`
      ),
    }).run();

    templateId = templateChoice.split("~")[0].trim();
  }

  logger.start("Finding your Template...");

  const template = templates.find((t) => t.name == templateId);

  // check if temmplate exists in registry
  if (!template) {
    throw new Error(`Template "${templateId}" not found in the registry.`);
  }

  logger.succeed("Found Template.");

  await downloadTemplate(template.repository, destinationFolder);

  renderFooter(destinationFolder);
}

module.exports = {
  runFullCLI,
  runSearchCLI,
  runTemplateDownloadCLI,
};
