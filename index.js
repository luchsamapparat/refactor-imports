#!/usr/bin/env node

import jscodeshift from 'jscodeshift/src/Runner.js';
import { resolve } from 'node:path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

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
    resolve(import.meta.dirname, 'transform.js'),
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