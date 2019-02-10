const chalk = require('chalk');
const { getTitle, getDeps, makeDir, exec } = require('./utils.js');
const depMapping = require('./deps.json');


async function main() {
	const title = await getTitle('project title');
	const deps = await getDeps();
	console.log(chalk.gray('Creating directory'));
	makeDir(title);
	console.log(chalk.gray('Initializing npm'));
	await exec(`npm`, ['init', '-y'], title);
	let depString = '';
	deps.forEach((dep) => {
		const mapping = depMapping[dep];
		mapping.forEach((package) => {
			depString = `${depString} ${package}@latest`;
		});
	});
	const flags = depString.split(' ').filter(x => x);
	flags.unshift('--save');
	flags.unshift('install');
	console.log(chalk.gray('Installing dependencies'));
	await exec(`npm`, flags, title);
}

main();