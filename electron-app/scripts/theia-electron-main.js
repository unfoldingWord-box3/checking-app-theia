const path = require('path');
const os = require('os');
const fs = require('fs');

// Update to override the supported VS Code API version.
// process.env.VSCODE_API_VERSION = '1.50.0'


function listFiles(name, directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    console.log(name + ': At ' + directoryPath + ' found files:', files)
  } catch (err) {
    console.log('Unable to scan directory: ' + directoryPath, err);
  }
}

// Use a set of builtin plugins in our application.
listFiles('__dirname', __dirname);
listFiles('__dirname/..', path.resolve(__dirname, '..'));
listFiles('__dirname/../..', path.resolve(__dirname, '../..'));
const pluginPath = path.resolve(__dirname, '../', 'plugins');
listFiles('pluginPath', pluginPath);
process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${pluginPath}`;

// Handover to the auto-generated electron application handler.
require('../lib/backend/electron-main.js');
