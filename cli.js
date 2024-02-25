#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {excludeKeys} from 'filter-obj';
import packageJson from 'package-json';

const cli = meow(`
	Usage
	  $ package-json <name> [version=latest]

	Options
	  --full-metadata  --full      Output full package metadata
	  --all-versions   --all       Output all versions
	  --registry-url   --registry  Registry URL                  [Default: inferred]

	Example
	  $ package-json ava
	  {
	    "name": "ava",
	    "version": "6.1.1",
	    …
	  }
`, {
	importMeta: import.meta,
	flags: {
		fullMetadata: {
			type: 'boolean',
			aliases: ['full'],
		},
		allVersions: {
			type: 'boolean',
			aliases: ['all'],
		},
		registryUrl: {
			type: 'string',
			aliases: ['registry'],
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
	...cli.flags,
};

let package_ = await packageJson(packageName, options);
package_ = excludeKeys(package_, key => key.startsWith('_') || key === 'directories');

console.log(JSON.stringify(package_, undefined, '  '));
