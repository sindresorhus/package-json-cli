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

test('options - full metadata', verify, {
	args: 'ava --full-metadata',
	expected: {
		name: 'ava',
		time: {
			created: '2014-07-05T01:26:00.496Z',
		},
	},
});

test('options - registry', verify, {
	args: 'ava --registry https://registry.yarnpkg.com',
	expected: {
		name: 'ava',
	},
});
