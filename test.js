import test from 'ava';
import {execa} from 'execa';

test('main', async t => {
	const {stdout} = await execa('./cli.js', ['ava']);
	t.is(JSON.parse(stdout).name, 'ava');
});
