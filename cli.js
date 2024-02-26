#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {excludeKeys} from 'filter-obj';
import packageJson, {PackageNotFoundError, VersionNotFoundError} from 'package-json';
import logSymbols from 'log-symbols';

const cli = meow(`
	Usage
	  $ package-json <name> [version=latest]

	Options
	  --full-metadata  Output full package metadata
	  --all-versions   Output all versions
	  --registry-url   Custom registry URL
	  --no-deprecated  Omit deprecated versions

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
		deprecated: {
			type: 'boolean',
			default: true,
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

try {
	let package_ = await packageJson(packageName, options);
	package_ = excludeKeys(package_, key => key.startsWith('_') || key === 'directories');

	console.log(JSON.stringify(package_, undefined, '  '));
} catch (error) {
	if (error instanceof PackageNotFoundError) {
		console.error(`${logSymbols.error} Package \`${packageName}\` does not exist.`);
	} else if (error instanceof VersionNotFoundError) {
		console.error(`${logSymbols.error} Could not find version \`${version}\` of the package \`${packageName}\`.`);
	} else {
		throw error;
	}

	process.exitCode = 1;
}
