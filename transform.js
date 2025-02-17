import tsxParser from 'jscodeshift/parser/tsx.js';
import transformImports from 'transform-imports';

export default (file, api, options) => {
    const { currentImportSources, targetImportSource, onlyImportedExports, fuzzyMatch } = options.transformOptions;

    try {
        return transformImports(
            file.source,
            importDefs => {
                importDefs.forEach(importDef => {
                    if (
                        importSourceMatches(importDef.source, currentImportSources, fuzzyMatch) &&
                        importedExportMatches(importDef.importedExport.name, onlyImportedExports)
                    ) {
                        importDef.source = targetImportSource;
                    }
                });
            },
            {
                parser: tsxParser()
            }
        );
    } catch (e) {
        console.error(e);
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