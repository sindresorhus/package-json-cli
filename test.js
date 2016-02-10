import test from 'ava';
import execa from 'execa';

test(async t => {
	const stdout = (await execa('./cli.js', ['ava'])).stdout;
	t.is(JSON.parse(stdout).name, 'ava');
});
