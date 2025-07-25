const { Input, AutoComplete, Confirm } = require('enquirer');
const logger = require('./logger.js');
const { getCommunityTemplates, downloadTemplate } = require('./downloader.js');
const { isDirectoryEmpty } = require('./fileio.js');
const pc = require('picocolors');
const { renderFooter } = require('./utils.js');

/**
 * Runs the full CLI process for the miniapp, including frontend, backend, and smart contract steps.
 *
 * @async
 * @function
 * @param {Object} params - The parameters for running the CLI.
 * @param {string} params.frontend - The frontend stack query.
 * @param {string} params.backend - The backend stack query.
 * @param {string} params.chain - The chain pack query.
 * @param {string} params.smartContract - The smart contract stack query.
 * @param {string} params.destinationFolder - The destination folder for the scaffold.
 * @returns {Promise<void>} Resolves when the CLI process is complete.
 */
async function runFullCLI({
  frontend,
  backend,
  chain,
  smartContract,
  destinationFolder,
}) {
  let template, templateId;

  if (!destinationFolder || destinationFolder === true) {
    destinationFolder = await new Input({
      message: 'Enter the name of your project',
      initial: 'awesome-miniapp',
    }).run();
  }

  if (!isDirectoryEmpty(destinationFolder)) {
    throw new Error('Directory not empty.');
  }

  logger.start('Getting Templates\n');

  let templates = await getCommunityTemplates();

  logger.succeed();

  // check of the user didnt pass any query filters
  if (
    (!frontend || frontend === true) &&
    (!backend || backend === true) &&
    (!chain || chain === true) &&
    (!smartContract || smartContract === true)
  ) {
    // ask for all of them
    logger.start('Mining some Bitcoin🙂');

    const availableFrontendStack =
      templates
        .filter(
          (template) =>
            template.stack.frontend !== null &&
            template.stack.frontend.length > 0,
        )
        .map((template) => template.stack.frontend)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .reduce(
          (acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]),
          [],
        ) ?? null;
    const availableBackendStack =
      templates
        .filter(
          (template) =>
            template.stack.backend !== null &&
            template.stack.backend.length > 0,
        )
        .map((template) => template.stack.backend)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .reduce(
          (acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]),
          [],
        ) ?? null;
    const availableChains =
      templates
        .filter(
          (template) =>
            template.stack.chain !== null && template.stack.chain.length > 0,
        )
        .map((template) => template.stack.chain)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .reduce(
          (acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]),
          [],
        ) ?? null;
    const availableSmartContractStack =
      templates
        .filter(
          (template) =>
            template.stack.smartContract !== null &&
            template.stack.smartContract.length > 0,
        )
        .map((template) => template.stack.smartContract)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .reduce(
          (acc, curr) => (acc.includes(curr) ? acc : [...acc, curr]),
          [],
        ) ?? null;

    logger.succeed();

    if (availableFrontendStack) {
      // Run fuzzy find frontend framework
      /**
       * @type {string}
       */
      frontend = await new AutoComplete({
        name: 'frontend',
        message: 'Choose frontend framework',
        limit: 10,
        multiple: false,
        footer() {
          return pc.gray(
            '\n(Start Typing/Scroll up and down to reveal more choices)',
          );
        },
        choices: ["(Don't Specify)", ...availableFrontendStack],
      }).run();

      frontend = frontend === "(Don't Specify)" ? null : frontend;
    }

    if (availableBackendStack) {
      // Run fuzzy find backend framework
      /**
       * @type {string}
       */
      backend = await new AutoComplete({
        name: 'backend',
        message: 'Choose Backend framework',
        limit: 10,
        multiple: false,
        footer() {
          return pc.gray(
            '\n(Start Typing/Scroll up and down to reveal more choices)',
          );
        },
        choices: ["(Don't Specify)", '(None)', ...availableBackendStack],
      }).run();

      backend = backend === "(Don't Specify)" ? null : backend;
    }

    if (availableChains) {
      // Run fuzzy find chain to start with
      /**
       * @type {string}
       */
      chain = await new AutoComplete({
        name: 'chain',
        message: 'Choose Chain to start with',
        limit: 10,
        multiple: false,
        footer() {
          return pc.gray(
            '\n(Start Typing/Scroll up and down to reveal more choices)',
          );
        },
        choices: ["(Don't Specify)", '(None)', ...availableChains],
      }).run();

      chain = chain === "(Don't Specify)" ? null : chain;
    }

    if (availableSmartContractStack) {
      // Run fuzzy find smart contract framework
      /**
       * @type {string}
       */
      smartContract = await new AutoComplete({
        name: 'Smart Contract',
        message: 'Choose Smart Contract framework',
        limit: 10,
        multiple: false,
        footer() {
          return pc.gray(
            '\n(Start Typing/Scroll up and down to reveal more choices)',
          );
        },
        choices: ["(Don't Specify)", '(None)', ...availableSmartContractStack],
      }).run();

      smartContract =
        smartContract === "(Don't Specify)" ? null : smartContract;
    }
  }

  // filter templates by queries
  logger.start('Running your query');
  // frontend
  if (frontend && frontend !== true)
    templates = templates
      .filter((template) => template.stack.frontend !== null)
      .filter((template) =>
        template.stack.frontend
          .map((f) => f.toLowerCase())
          .includes(frontend.toLowerCase()),
      );

  // backend
  if (backend && backend !== '(None)' && backend !== true)
    templates = templates
      .filter((template) => template.stack.backend !== null)
      .filter((template) =>
        template.stack.backend
          .map((b) => b.toLowerCase())
          .includes(backend.toLowerCase()),
      );
  if (backend === '(None)')
    templates = templates.filter((template) => template.stack.backend === null);

  // chain
  if (chain && chain !== '(None)' && chain !== true)
    templates = templates
      .filter((template) => template.stack.chain !== null)
      .filter((template) =>
        template.stack.chain
          .map((b) => b.toLowerCase())
          .includes(chain.toLowerCase()),
      );
  if (chain === '(None)')
    templates = templates.filter((template) => template.stack.chain === null);

  // smart contract
  if (smartContract && smartContract !== '(None)' && smartContract !== true)
    templates = templates
      .filter((template) => template.stack.smartContract !== null)
      .filter((template) =>
        template.stack.smartContract
          .map((s) => s.toLowerCase())
          .includes(smartContract.toLowerCase()),
      );
  if (smartContract === '(None)')
    templates = templates.filter(
      (template) => template.stack.smartContract === null,
    );

  logger.succeed();

  if (templates.length === 0) {
    console.warn(
      `❌ No templates found for your query: ${
        frontend ? `\nFrontend: ${frontend}` : ''
      }${backend ? `\nBackend: ${backend}` : ''}${
        chain ? `\nChain: ${chain}` : ''
      }${smartContract ? `\nSmart Contract: ${smartContract}` : ''}`,
    );
    console.info(`
        Found a cool template worth sharing? Contribute it to the community registry:
        https://github.com/Emmo00/create-farcaster-miniapp
      `);
    process.exit();
  }

  if (templates.length === 1) {
    template = templates[0];

    logger.info('Found only 1 template with your specs:');
    console.log();
    logger.succeed(
      `${template.name} ~ ${template.description} ${
        template.stack.frontend
          ? `\nFrontend: ${template.stack.frontend.join(', ')}`
          : ''
      }${
        template.stack.backend
          ? `\nBackend: ${template.stack.backend.join(', ')}`
          : ''
      }${
        template.stack.chain
          ? `\nChain: ${template.stack.chain.join(', ')}`
          : ''
      }${
        template.stack.smartContract
          ? `\nSmart Contract: ${template.stack.smartContract.join(', ')}`
          : ''
      }\n`,
    );

    if (
      !(await new Confirm({
        name: 'confirm download',
        message: 'Want to use it?',
      }).run())
    ) {
      console.info(`
        ❌ No template found matching your selection.
        
        Found a cool template worth sharing? Contribute it to the community registry:
        https://github.com/Emmo00/create-farcaster-miniapp
      `);
      process.exit();
    }
  } else {
    // Run fuzzy find templates
    const templateChoice = await new AutoComplete({
      name: 'template',
      message: 'Choose from Search Results',
      limit: 10,
      multiple: false,
      footer() {
        return pc.gray(
          '\n(Start Typing/Scroll up and down to reveal more choices)',
        );
      },
      choices: templates.map(
        (template) =>
          `${template.name} ~ ${pc.green(pc.italic(template.description))}`,
      ),
    }).run();

    templateId = templateChoice.split('~')[0].trim();
    logger.start('Getting your Template...');

    template = templates.find((t) => t.name == templateId);

    logger.succeed('Found Template.');
  }

  await downloadTemplate(template.repository, destinationFolder);

  renderFooter(destinationFolder);
}

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
      message: 'Enter the name of your project',
      initial: 'awesome-miniapp',
    }).run();
  }

  if (!isDirectoryEmpty(destinationFolder)) {
    throw new Error('Directory not empty.');
  }

  logger.start('Getting Templates\n');

  const templates = await getCommunityTemplates();

  logger.succeed();

  if (templateId === true) {
    // Run fuzzy find templates
    const templateChoice = await new AutoComplete({
      name: 'template',
      message: 'Choose your Template',
      limit: 10,
      multiple: false,
      footer() {
        return pc.gray(
          '\n(Start Typing/Scroll up and down to reveal more choices)',
        );
      },
      choices: templates.map(
        (template) =>
          `${template.name} ~ ${pc.green(pc.italic(template.description))}`,
      ),
    }).run();

    templateId = templateChoice.split('~')[0].trim();
  }

  logger.start('Finding your Template...');

  const template = templates.find((t) => t.name == templateId);

  // check if temmplate exists in registry
  if (!template) {
    throw new Error(`Template "${templateId}" not found in the registry.`);
  }

  logger.succeed('Found Template.');

  await downloadTemplate(template.repository, destinationFolder);

  renderFooter(destinationFolder);
}

module.exports = {
  runFullCLI,
  runTemplateDownloadCLI,
};
