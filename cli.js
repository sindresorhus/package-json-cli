#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import filterObject from 'filter-obj';
import packageJson from 'package-json';

const cli = meow(`
	Usage
	  $ package-json <name> [version]

	Example
	  $ package-json ava
	  {
	    "name": "ava",
	    "version": "0.18.0",
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
package_ = filterObject(package_, key => key[0] !== '_' && key !== 'directories');

console.log(JSON.stringify(package_, undefined, '  '));
