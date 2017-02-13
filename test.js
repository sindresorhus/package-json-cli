import test from 'ava';
import execa from 'execa';

test(async t => {
	const stdout = await execa.stdout('./cli.js', ['ava']);
	t.is(JSON.parse(stdout).name, 'ava');
});
