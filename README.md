# refactor-imports

Easily refactor imports in TypeScript files via the CLI.

## Installation

```
npm install refactor-imports -g
```

## Usage

```
Options:
      --help                    Show help                              [boolean]
      --version                 Show version number                    [boolean]
  -p, --path                                                          [required]
  -s, --current-import-sources                                [array] [required]
  -t, --target-import-source
  -r, --resolve-import-mapping                        [boolean] [default: false]
      --tsconfig-path, --tsc
  -e, --only-imported-exports                              [array] [default: []]
  -d, --dry-run                                       [boolean] [default: false]
  -f, --fuzzy-match                                   [boolean] [default: false]
      --parser                           [choices: "ts", "tsx"] [default: "tsx"]
```

### Required Arguments

You need to pass the `path` (`-p`) and the `current-import-sources` (`-s`). Additionally, you must provide either `target-import-source` (`-t`) OR both `resolve-import-mapping` (`-r`) and `tsconfig-path` (`-tsc`).

```bash
refactor-imports -p ./src -s "my-old-lib" -t "my-new-lib"
```

```ts
// before
import { foo, bar } from 'my-old-lib';

// after
import { foo, bar } from 'my-new-lib';
```

### Multiple Current Import Sources

You can specify more than one current import source if you want to merge imported exports from various import sources into one.

```bash
refactor-imports -p ./src -s "my-old-lib" "my-even-older-lib" -t "my-new-lib"
```

```ts
// before
import { foo } from 'my-old-lib';
import { bar } from 'my-even-older-lib';

// after
import { foo, bar } from 'my-new-lib';
```

### Refactor only selected Imported Exports

Instead of just replacing whole import sources, you can also move selected imported exports of an import source to a new import source.

```bash
refactor-imports -p ./src -s "my-old-lib" -t "my-new-lib" -e "foo" "bar"
```

```ts
// before
import { foo, bar, baz } from 'my-old-lib';

// after
import { baz } from 'my-old-lib';
import { foo, bar } from 'my-new-lib';
```

### Fuzzy Matching Import Sources

You can use a regular expressions as `current-import-source` when you add the `fuzzy-match` (`-f`) argument.

```bash
refactor-imports -p ./src -s "@my-libs/.+" -t "my-new-lib" -f
```

```ts
// before
import { foo } from '@my-libs/old';
import { bar } from '@my-libs/even-older';

// after
import { foo, bar } from '@my-libs/new';
```

### Resolve Import Mappings from TypeScript Config

You can automatically resolve path aliases defined in your `tsconfig.json` to relative paths by using the `resolve-import-mapping` (`-r`) option along with `tsconfig-path` (`-tsc`).

```bash
refactor-imports -p ./src -s "@my-app" -r -tsc ./tsconfig.json
```

Given a `tsconfig.json` with path mappings like:
```json
{
  "compilerOptions": {
    "paths": {
      "@my-app/*": ["./src/*"]
    }
  }
}
```

```ts
// before
import { foo } from '@my-app/utils/helpers';

// after
import { foo } from './utils/helpers'; // or '../utils/helpers' depending on file location
```

### Parser Option

By default, the tool uses the `tsx` parser to support JSX syntax. If you're working with plain TypeScript files without JSX, you can use the `ts` parser.

```bash
refactor-imports -p ./src -s "my-old-lib" -t "my-new-lib" --parser ts
```

## Acknowledgements

The heavy-lifting of this tool is done by Facebook's [jscodeshift](https://github.com/facebook/jscodeshift) and the [transform-imports](https://github.com/suchipi/transform-imports) codemod written by [suchipi](https://github.com/suchipi). Thanks for doing the actual work!