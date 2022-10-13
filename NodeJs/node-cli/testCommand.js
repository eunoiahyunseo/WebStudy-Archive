#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();

// prettier-ignore
program
    .name('string-util')
    .description('CLI to some JavaScript string utilities')
    .version('0.8.0');

// prettier-ignore
program
    .description('Split a string into substrings and display as an array')
    .argument('<string>', 'string to split')
    .option('--first', 'display just the first substring')
    .option('-s, --separator <char>', 'separator character', ',')
    .action((str, options) => {
        const limit = options.first ? 1 : undefined;
        console.log(str.split(options.seperator, limit))
    })

program.parse();
