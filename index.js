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
        alias: 't'
    })
    .option('resolve-import-mapping', {
        alias: 'r',
        boolean: true,
        default: false
    })
    .option('tsconfig-path', {
        alias: 'tsc'
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
    .option('parser', {
        choices: ['ts', 'tsx'],
        default: 'tsx'
    })
    .check(options => {
        const targetImportSourceMode = options['target-import-source']?.length > 0;
        const resolveImportMappingMode = options['resolve-import-mapping'] === true && options['tsconfig-path']?.length > 0;

        if (!targetImportSourceMode && !resolveImportMappingMode) {
            throw new Error('Either --target-import-source or --resolve-import-mapping with --tsconfig-path must be provided.');
        }

        return true;
    })
    .argv;

jscodeshift.run(
    resolve(__dirname, 'transform.js'),
    [options.path],
    {
        extensions: 'ts',
        parser: 'ts',
        dry: options.dryRun,
        transformOptions: {
            fuzzyMatch: options.fuzzyMatch,
            currentImportSources: options.currentImportSources,
            targetImportSource: options.targetImportSource,
            onlyImportedExports: options.onlyImportedExports,
            resolveImportMapping: options.resolveImportMapping,
            tsconfigPath: options.tsconfigPath?.length > 0 ? resolve(process.cwd(), options.tsconfigPath) : undefined,
            parser: options.parser
        }
    }
);