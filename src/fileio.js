const fs = require("fs");
const path = require("path");

/**
 * Create a new directory if it doesn't already exist.
 * @param {string} directoryPath - Full path to the directory.
 */
function createDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

/**
 * Copy all files and folders recursively from source to destination.
 * @param {string} source - The source directory path.
 * @param {string} destination - The destination directory path.
 */
function copyRecursiveSync(source, destination) {
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      createDirectory(destPath);
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Check if a directory is empty.
 * @param {string} dirPath
 * @returns {boolean}
 */
function isDirectoryEmpty(dirPath) {
  return !fs.existsSync(dirPath) || fs.readdirSync(dirPath).length === 0;
}

/**
 * Write a JSON object to a file.
 * @param {string} filePath
 * @param {object} data
 */
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Read a JSON file.
 * @param {string} filePath
 * @returns {object}
 */
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  createDirectory,
  copyRecursiveSync,
  isDirectoryEmpty,
  writeJSON,
  readJSON,
};
