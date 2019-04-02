# refactor-imports

Easily refactor imports in TypeScript files via the CLI.

## Installation

```
npm install refactor-imports -g
```

## Usage

```
Options:
  --help                        Show help                              [boolean]
  --version                     Show version number                    [boolean]
  --path, -p                                                          [required]
  --current-import-sources, -s                                [array] [required]
  --target-import-source, -t                                          [required]
  --only-imported-exports, -e                              [array] [default: []]
  --dry-run, -d                                       [boolean] [default: false]
  --fuzzy-match, -f                                   [boolean] [default: false]
```

### Required Arguments

You need to pass the `path` (`-p`) to the files that should be refactored, the `current-import-sources` (`-s`) and the `target-import-source` (`-t`).

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

## Acknowledgements

The heavy-lifting of this tool is done by Facebook's [jscodeshift](https://github.com/facebook/jscodeshift) and the [transform-imports](https://github.com/suchipi/transform-imports) codemod written by [suchipi](https://github.com/suchipi). Thanks for doing the actual work!