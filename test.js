import test from 'ava';
import {execa} from 'execa';

test('main', async t => {
	const {stdout} = await execa('./cli.js', ['ava']);

	t.like(JSON.parse(stdout), {
		name: 'ava',
	});
});

test('can specify a version', async t => {
	const {stdout} = await execa('./cli.js', ['ava', '6.0.0']);

	t.like(JSON.parse(stdout), {
		name: 'ava',
		version: '6.0.0',
		versions: undefined,
	});
});
