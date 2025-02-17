#!/usr/bin/env node

const jscodeshift = require('jscodeshift/src/Runner.js');
const { resolve } = require('node:path');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');

const options = yargs(hideBin(process.argv))
    .option('path', {
        alias: 'p',
        demandOption: true
    })
    .option('current-import-sources', {
        alias: 's',
        array: true,
        demandOption: true
    })
    .option('target-import-source', {
        alias: 't',
        demandOption: true
    })
    .option('only-imported-exports', {
        alias: 'e',
        array: true,
        default: []
    })
    .option('dry-run', {
        alias: 'd',
        boolean: true,
        default: false
    })
    .option('fuzzy-match', {
        alias: 'f',
        boolean: true,
        default: false
    })
    .argv;

jscodeshift.run(
    resolve(__dirname, 'transform.js'),
    [options.path],
    {
        extensions: 'ts,tsx',
        parser: 'tsx',
        dry: options.dryRun,
        transformOptions: {
            fuzzyMatch: options.fuzzyMatch,
            currentImportSources: options.currentImportSources,
            targetImportSource: options.targetImportSource,
            onlyImportedExports: options.onlyImportedExports
        }
    }
);