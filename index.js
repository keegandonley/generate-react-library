#! /usr/bin/env node

const chalk = require('chalk');
const { getTitle, getDeps, makeDir, exec, configBabel, createComponent, addScript } = require('./utils.js');
const depMapping = require('./deps.json');
const babelrc = require('./defaults/babelrc.json');


async function main() {
	// Get title and dependencies
	const title = await getTitle('project title');
	const deps = await getDeps();

	// Create directory
	console.log(chalk.gray('Creating directory'));
	makeDir(title);

	// Initialize npm
	console.log(chalk.gray('Initializing npm'));
	await exec(`npm`, ['init', '-y'], title);
	
	// Install dependencies
	console.log(chalk.gray('Installing dependencies'));
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
	await exec(`npm`, flags, title);

	// Write babelrc
	if (deps.includes('babel')) {
		console.log(chalk.gray('Writing .babelrc'));
		const babelConfig = JSON.stringify(babelrc, null, 2);
		configBabel(title, babelConfig);
		addScript(title, 'build', 'babel src -d lib');
	}

	// Create component boilerplate
	if (deps.includes('react')) {
		console.log(chalk.gray('Creating react component'));
		createComponent(title, title);
	}

	// Build
	console.log(chalk.gray('Creating build via `npm run build`'));
	await exec('npm', ['run', 'build'], title);

}

main();