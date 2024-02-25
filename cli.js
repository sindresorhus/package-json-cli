#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {excludeKeys} from 'filter-obj';
import packageJson from 'package-json';

const cli = meow(`
	Usage
	  $ package-json <name> [version=latest]

	Options
	  --full-metadata    --full      Output full package metadata
	  --all-versions     --all       Output all versions
	  --registry-url     --registry  Registry URL                  [Default: inferred]
	  --omit-deprecated              Omit deprecated versions      [Default: included]

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
		omitDeprecated: {
			type: 'boolean',
			default: false,
		},
	},
});

const [packageName, version] = cli.input;

if (!packageName) {
	console.error('Specify a package name');
	process.exit(1);
}

let package_ = await packageJson(packageName, {version, ...cli.flags});
package_ = excludeKeys(package_, key => key.startsWith('_') || key === 'directories');

console.log(JSON.stringify(package_, undefined, '  '));
