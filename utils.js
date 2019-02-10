const inquirer =  require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


exports.getTitle = function getTitle(message) {
	const name = 'title';
	return new Promise((resolve, reject) => {
		const prompt = inquirer.createPromptModule();
		prompt({
			type: 'input',
			name,
			message: `Please enter the ${message}:`,
			validate: (val) => {
				if (!val) {
					return `The ${message} is required`;
				}
				if (val.includes(' ')) {
					return `Spaces are not allowed in the ${message}.`;
				}
				if (fs.existsSync(path.join(__dirname, val))) {
					return `Directory already exist for the ${message} ${val}`;
				}
				return true;
			}
		}).then((answer) => {
			resolve(answer.title);
		})
	})
}

exports.getDeps = function getDeps() {
	return new Promise((resolve, reject) => {
		const prompt = inquirer.createPromptModule();
		prompt({
			type: 'checkbox',
			name: 'deps',
			message: 'Select which libraries to install',
			choices: [{
				name: 'babel',
				checked: true,
			}, {
				name: 'webpack',
				checked: true,
			}, {
				name: 'react',
				checked: true,
			}, {
				name: 'react-dom',
				checked: true,
			}, {
				name: 'eslint',
				checked: true,
			}]
		}).then((answer) => {
			resolve(answer.deps);
		})
	})
}

exports.makeDir = function makeDir(name) {
	const dir = path.join(__dirname, name);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

exports.exec = function exec(cmd, fl, title) {
	return new Promise((resolve, reject) => {
		const proc = spawn(cmd, fl, {
			cwd: path.join(__dirname, title),
		});
		proc.stderr.on('data', (data) => {
			console.log(chalk.red(data))
		});
		proc.stdout.on('data', (data) => {
			console.log(chalk.grey(data))
		});
		proc.on('close', (code) => resolve(code));
	});
}