#!/usr/bin/env node
'use strict';
const meow = require('meow');
const filterObj = require('filter-obj');
const packageJson = require('package-json');

const cli = meow(`
	Usage
	  $ package-json <name> [version]

	Example
	  $ package-json ava
	  {
	    "name": "ava",
	    "version": "0.18.0",
	    ...
	  }
`);

if (!cli.input[0]) {
	console.error('Specify a package name');
	process.exit(1);
}

packageJson(cli.input[0], cli.input[1] || 'latest')
	// TODO: put this logic in `package-json` in its next major version
	.then(pkg => filterObj(pkg, key => key[0] !== '_' && key !== 'directories'))
	.then(x => console.log(JSON.stringify(x, null, '  ')));
