/*
 * FROM https://stackoverflow.com/a/67833087/826970
 */

const { execSync } = require("child_process");

const MIN_VERSION = 13;
const nodeVersion = process.version.replace(/^v/, "");
const [nodeMajorVersion] = nodeVersion.split(".");

if (nodeMajorVersion < MIN_VERSION) {
  console.warn(
    `node version ${nodeVersion} is incompatible with this module. ` +
      `Expected version >=${MIN_VERSION}`
  );
  execSync("npm run node_version");
}
