import fs from 'fs';

// Load package.json data
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version; // Get version from package.json

// Load README.md data
const readmePath = 'README.md';
let readmeContent = fs.readFileSync(readmePath, 'utf8').split('\n');

// Update the version in the first line
readmeContent[0] = readmeContent[0].replace(/(badge\/BETA-v)\d+\.\d+\.\d+/i, `$1${version}`);

// Join the updated content back into a single string
readmeContent = readmeContent.join('\n');

// Write the updated README.md content back to the README.md file
fs.writeFileSync(readmePath, readmeContent);

console.log(`README.md updated to version ${version}`);