#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {excludeKeys} from 'filter-obj';
import packageJson from 'package-json';

const cli = meow(`
	Usage
	  $ package-json <name> [version=latest]

	Example
	  $ package-json ava
	  {
	    "name": "ava",
	    "version": "6.1.1",
	    …
	  }
`, {
	importMeta: import.meta,
});

const [packageName, version] = cli.input;

if (!packageName) {
	console.error('Specify a package name');
	process.exit(1);
}

let package_ = await packageJson(packageName, {version});
package_ = excludeKeys(package_, key => key.startsWith('_') || key === 'directories');

console.log(JSON.stringify(package_, undefined, '  '));
