#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {excludeKeys} from 'filter-obj';
import packageJson from 'package-json';

const cli = meow(`
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
	    "version": "6.1.1",
	    …
	  }
`, {
	importMeta: import.meta,
	booleanDefault: undefined,
	flags: {
		fullMetadata: {
			type: 'boolean',
		},
		allVersions: {
			type: 'boolean',
		},
		registryUrl: {
			type: 'string',
		},
	},
});

const [packageName, version] = cli.input;

if (!packageName) {
	console.error('Specify a package name');
	process.exit(1);
}

const options = {
	version,
	omitDeprecated: !cli.flags.deprecated,
	...cli.flags,
};

let package_ = await packageJson(packageName, options);
package_ = excludeKeys(package_, key => key.startsWith('_') || key === 'directories');

console.log(JSON.stringify(package_, undefined, '  '));
