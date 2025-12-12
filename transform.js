const tsxParser = require('jscodeshift/parser/tsx.js');
const tsParser = require('jscodeshift/parser/ts.js');
const transformImports = require('transform-imports');
const { readFileSync } = require('fs');
const { relative, sep, dirname, basename, join } = require('path');

module.exports = (file, api, options) => {
    const { currentImportSources, targetImportSource, onlyImportedExports, fuzzyMatch, resolveImportMapping, tsconfigPath, parser } = options.transformOptions;

    let importMappings = {};

    if (tsconfigPath) {
        try {
            tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
            importMappings = tsconfig?.compilerOptions?.paths ?? {};
        } catch (error) {
            console.error(`Failed to read or parse tsconfig at ${tsconfigPath}:`, error);
        }
    }

    try {
        return transformImports(
            file.source,
            importDefs => {
                importDefs.forEach(importDef => {
                    if (
                        importSourceMatches(importDef.source, currentImportSources, fuzzyMatch) &&
                        importedExportMatches(importDef.importedExport.name, onlyImportedExports)
                    ) {
                        if (targetImportSource?.length > 0) {
                            importDef.source = targetImportSource;
                        }

                        if (resolveImportMapping) {
                            const targets = Object.entries(importMappings).find(([pathFrom]) => importDef.source.startsWith(pathFrom.replace('/*', '')))?.[1];
                            if (targets.length > 0) {
                                const directory = dirname(file.path)
                                    .split(sep)
                                    .join('/');

                                importDef.source = relative(directory, targets[0].replace('/*', ''))
                                    .split(sep)
                                    .join('/')
                                    .replace(/\.tsx?$/, '')
                                    .replace(/\/index$/, '');
                            }
                        }
                    }
                });
            },
            {
                parser: parser === 'tsx' ? tsxParser() : tsParser()
            }
        );
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`Syntax error in file ${file.path}:${error.loc.line}:${error.loc.column}`);
        } else {
            console.error(`Error while transforming imports in file ${file.path}`);
        }
        console.error(error);
        return file.source;
    }
}

function importedExportMatches(value, validValues) {
    if (validValues.length === 0) {
        return true;
    }

    return validValues.includes(value);
}

function importSourceMatches(value, patterns, fuzzyMatch) {
    if (fuzzyMatch) {
        return patterns.some(pattern => value.match(pattern));
    }

    return patterns.some(pattern => value === pattern);
}