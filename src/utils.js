const gradient = require('gradient-string').default;
const figlet = require('figlet');

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
  console.log(`   cd ${projectName}`);
  console.log();
  console.log(gradient.mind('🚀 Happy Building!!!'));
  console.log();
}

module.exports = {
  renderTitle,
  renderFooter,
};
