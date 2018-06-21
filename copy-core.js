/**
 * Auto check the version of RimWorld and copy the Core files.
 */

const chalk = require('chalk');
const log = console.log;

const fs = require('fs');
const path = require('path');
const rm = require('rimraf');
const copy = require('copy-concurrently');

const GAME_PATH = '/mnt/d/Games/SteamLibrary/steamapps/common/RimWorld';

async function copyCore() {
  const previousVersion = fs.readFileSync('./Version.txt', 'utf-8').trim();
  const nextVersion = fs.readFileSync(`${GAME_PATH}/Version.txt`, 'utf-8').trim();

  if (previousVersion === nextVersion) {
    log(
      chalk.greenBright('No change, exit.'),
      chalk.cyan('Version: '),
      chalk.cyanBright(nextVersion),
    );

    return;
  }

  log(
    chalk.cyan('Version changed: '),
    chalk.cyanBright(previousVersion),
    chalk.cyan('=>'),
    chalk.cyanBright(nextVersion),
  );

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

  fs.writeFileSync('./Version.txt', nextVersion);

  log(chalk.greenBright('Complete.'));
}

copyCore();
