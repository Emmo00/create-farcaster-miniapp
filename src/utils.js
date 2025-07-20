const gradient = require('gradient-string').default;
const { mind } = require('gradient-string');
const figlet = require('figlet');
const pc = require('picocolors');

function renderTitle() {
  const figletConfig = {
    font: 'Pagga',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    whitespaceBreak: true,
  };

  const title = gradient(['gold', 'crimson', 'purple'])(
    figlet.textSync('Create Farcaster Miniapp', figletConfig),
  );

  console.log();
  console.log(title);
  console.log();
}

/**
 * Render a CLI footer after scaffold completes.
 * @param {string} projectName - The folder name the project was created in.
 */
function renderFooter(projectName) {
  console.log();
  console.log('✅ Scaffold complete.');
  console.log(`📂 Your project is ready in ./${projectName}`);
  console.log();
  console.log(`👉 Next steps:`);
  console.log(`   cd ./${projectName}`);
  console.log(`   Checkout the ${pc.bgGreenBright('README.md')}`);
  console.log();
  console.log(mind('🚀 Happy Building!!!'));
  console.log();
}

module.exports = {
  renderTitle,
  renderFooter,
};
