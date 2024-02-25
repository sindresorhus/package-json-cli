import test from 'ava';
import {execa} from 'execa';

const verify = test.macro(async (t, {args, expected}) => {
	const {stdout} = await execa('./cli.js', args.split(' '));
	const json = JSON.parse(stdout);

	t.like(json, expected);
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

test('flags: --all', verify, {
	args: 'ava --all',
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

test('flags: --registry', verify, {
	args: 'ava --registry https://registry.yarnpkg.com',
	expected: {
		name: 'ava',
	},
});

test('flags: combined', verify, {
	args: 'ava --full-metadata --all --registry https://registry.yarnpkg.com',
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
