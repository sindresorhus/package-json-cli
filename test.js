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

for (const flag of ['--full-metadata', '--full']) {
	test(`flags: ${flag}`, verify, {
		args: `ava ${flag}`,
		expected: {
			name: 'ava',
			time: {
				created: '2014-07-05T01:26:00.496Z',
			},
			_id: undefined,
		},
	});
}

for (const flag of ['--all-versions', '--all']) {
	test(`flags: ${flag}`, verify, {
		args: `ava ${flag}`,
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
}

for (const flag of ['--registry-url', '--registry']) {
	test(`flags: ${flag}`, verify, {
		args: `ava ${flag} https://registry.yarnpkg.com`,
		expected: {
			name: 'ava',
		},
	});
}

test('flags: --omit-deprecated', async t => {
	const {stdout} = await execa('./cli.js', ['querystring']);
	const json = JSON.parse(stdout);

	t.truthy(json.deprecated);

	const {stderr} = await t.throwsAsync(
		execa('./cli.js', ['querystring', '0.2', '--omit-deprecated']),
	);

	t.regex(stderr, /VersionNotFoundError/);
});

test('flags: combined', verify, {
	args: 'ava --full --all --registry https://registry.yarnpkg.com',
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
