#!/usr/bin/env node

const jscodeshift = require('jscodeshift/src/Runner');
const path = require('path');

const options = require('yargs')
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
    path.resolve(__dirname, 'transform.js'),
    [options.path],
    {
        extensions: 'ts',
        parser: 'ts',
        dry: false,
        transformOptions: {
            fuzzyMatch: options.fuzzyMatch,
            currentImportSources: options.currentImportSources,
            targetImportSource: options.targetImportSource,
            onlyImportedExports: options.onlyImportedExports
        }
    }
);