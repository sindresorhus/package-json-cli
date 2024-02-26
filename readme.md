# package-json-cli

> Get the package.json of a package from the npm registry

## Install

```sh
npm install --global package-json-cli
```

## Usage

```
$ package-json --help

  Usage
    $ package-json <name> [version=latest]

  Options
    --full-metadata  Output full package metadata
    --all-versions   Output all versions
    --registry-url   Registry URL                  [Default: inferred]
    --no-deprecated  Omit deprecated versions      [Default: included]

  Example
    $ package-json ava
    {
      "name": "ava",
      "version": "6.1.1"
      …
    }
```

The `version` can be in any format supported by the [semver](https://github.com/npm/node-semver) module. For example:

- `1` - get the latest `1.x.x`
- `1.2` - get the latest `1.2.x`
- `^1.2.3` - get the latest `1.x.x` but at least `1.2.3`

[Dist tags](https://docs.npmjs.com/adding-dist-tags-to-packages) (such as `latest`) are also supported.

## Related

- [package-json](https://github.com/sindresorhus/package-json) - API for this module
- [latest-version-cli](https://github.com/sindresorhus/latest-version-cli) - Get the latest version of an npm package
