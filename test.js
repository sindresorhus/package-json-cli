import test from 'ava';
import {execa} from 'execa';

const verify = test.macro(async (t, {args, expected, error}) => {
	const {stdout, stderr} = await execa('./cli.js', args.split(' '), {reject: false, env: {NO_COLOR: '1'}});

	if (error) {
		t.is(stderr, error);
	} else {
		const json = JSON.parse(stdout);
		t.like(json, expected);
	}
});

test('main', verify, {
	args: 'ava',
	expected: {
		name: 'ava',
		versions: undefined, // 'latest' by default
		time: undefined,
	},
});

test('can specify a version', verify, {
	args: 'ava 6.0.0',
	expected: {
		name: 'ava',
		version: '6.0.0',
		versions: undefined,
	},
});

test('package does not exist', verify, {
	args: 'nnnope 1.0.0',
	error: '✖ Package `nnnope` does not exist.',
});

test('version does not exist', verify, {
	args: 'ava 0.0.0',
	error: '✖ Could not find version `0.0.0` of the package `ava`.',
});

test('flags: --full-metadata', verify, {
	args: 'ava --full-metadata',
	expected: {
		name: 'ava',
		time: {
			created: '2014-07-05T01:26:00.496Z',
		},
		_id: undefined,
	},
});

test('flags: --all-versions', verify, {
	args: 'ava --all-versions',
	expected: {
		name: 'ava',
		version: undefined,
		versions: {
			'6.0.0': {
				name: 'ava',
				version: '6.0.0',
			},
		},
	},
});

test('flags: --registry-url', verify, {
	args: 'ava --registry-url https://registry.yarnpkg.com',
	expected: {
		name: 'ava',
	},
});

test('includes deprecated versions by default', verify, {
	args: 'querystring',
	expected: {
		name: 'querystring',
		deprecated: 'The querystring API is considered Legacy. new code should use the URLSearchParams API instead.',
	},
});

test('flags: --no-deprecated', verify, {
	args: 'querystring 0.2 --no-deprecated',
	error: '✖ Could not find version `0.2` of the package `querystring`.',
});

test('flags: combined', verify, {
	args: 'ava --full-metadata --all-versions --registry-url https://registry.yarnpkg.com',
	expected: {
		name: 'ava',
		version: undefined,
		versions: {
			'6.0.0': {
				name: 'ava',
				version: '6.0.0',
			},
		},
		time: {
			created: '2014-07-05T01:26:00.496Z',
		},
	},
});
