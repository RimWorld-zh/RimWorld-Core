/**
 * Auto check the version of RimWorld and copy the Core files.
 */

const chalk = require('chalk');
const log = console.log;

const fs = require('fs');
const path = require('path');
const rm = require('rimraf');
const copy = require('copy-concurrently');

const GAME_PATH = '/mnt/e/bak/RimWorld/RimWorld 0.18.1722 rev1196';

async function copyCore() {
  const currentVersion = fs.readFileSync('./Version.txt', 'utf-8').trim();
  const latestVersion = fs.readFileSync(`${GAME_PATH}/Version.txt`, 'utf-8').trim();

  log(chalk.cyan('Current Version: '), chalk.cyanBright(currentVersion));
  log(chalk.cyan('Latest  Version: '), chalk.cyanBright(latestVersion));

  if (currentVersion === latestVersion) {
    log(chalk.greenBright('No change, exit.'));

    return;
  }

  const coreFrom = path.join(GAME_PATH, 'Mods', 'Core');
  const coreTo = path.join(__dirname, 'Core');

  log(
    `Copying files from "${chalk.greenBright(coreFrom)}" to "${chalk.greenBright(
      coreTo,
    )}"....`,
  );

  if (fs.existsSync(coreTo)) {
    rm.sync(coreTo);
  }

  await Promise.all([
    copy(path.join(coreFrom, 'About'), path.join(coreTo, 'About')),
    copy(path.join(coreFrom, 'Defs'), path.join(coreTo, 'Defs')),
    copy(
      path.join(coreFrom, 'Languages', 'English'),
      path.join(coreTo, 'Languages', 'English'),
    ),
  ]);

  fs.writeFileSync('./Version.txt', latestVersion);

  log(chalk.greenBright('Complete.'));
}

copyCore();
