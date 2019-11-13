#!/usr/bin/env node
var program = require('commander');
const chalk = require('chalk')
const didYouMean = require('didyoumean')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node
const appName = require('../package.json').name
const slash = require('slash')
const minimist = require('minimist')
const path = require('path');

// Setting edit distance to 60% of the input string's length
didYouMean.threshold = 0.6
// 检查nodejs版本
function checkNodeVersion (wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
        'You are using Node ' + process.version + ', but this version of ' + id +
        ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
        ))
        process.exit(1)
    }
}
  
checkNodeVersion(requiredVersion, appName)

if (semver.satisfies(process.version, '9.x')) {
    console.log(chalk.red(
      `You are using Node ${process.version}.\n` +
      `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
      `It's strongly recommended to use an active LTS version instead.`
    ))
}
// 检查结束

function camelize (str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key]
        }
    })
    return args
}

function suggestCommands (cmd) {
    const availableCommands = program.commands.map(cmd => {
      return cmd._name
    })
  
    const suggestion = didYouMean(cmd, availableCommands)
    if (suggestion) {
      console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
    }
}

program
    .version(require('../package').version, '-v, --version')
    .usage('<command> [options]')

program
    .command('create <app-name>')
    .description('create an app')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .option('-d, --default', 'Skip prompts and use default preset')
    .action((name, cmd)=>{
        var options = cleanArgs(cmd);
        var params = minimist(process.argv.slice(3));
        console.log('params：', params);
        console.log('name：', name);
        console.log('options：', options);
        console.log('cwd：', process.cwd());
        console.log('__dirname：',__dirname);
        console.log('./:',path.resolve('./'));
        require('../testing/index')();
    })
// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    suggestCommands(cmd)
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`test <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp()
}