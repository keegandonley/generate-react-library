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
				if (fs.existsSync(path.join(process.cwd(), val))) {
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
				checked: false,
			}, {
				name: 'react',
				checked: true,
			}, {
				name: 'react-dom',
				checked: true,
			}, {
				name: 'eslint',
				checked: false,
			}]
		}).then((answer) => {
			resolve(answer.deps);
		})
	})
}

exports.makeDir = function makeDir(name) {
	const dir = path.join(process.cwd(), name);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

exports.exec = function exec(cmd, fl, title) {
	return new Promise((resolve, reject) => {
		const proc = spawn(cmd, fl, {
			cwd: path.join(process.cwd(), title),
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

exports.configBabel = function configBabel(title, value) {
	fs.writeFileSync(path.join(process.cwd(), title, '.babelrc'), value);
}

exports.createComponent = function createComponent(name, title) {
	// make src directory
	const dir = path.join(process.cwd(), title, 'src');
	fs.mkdirSync(dir);

	// make index.js
	let index = String(fs.readFileSync(path.join(__dirname, 'defaults', 'idx.crc')));
	index = index.replace(/%name%/g, name);
	index = index.replace(/%Name%/g, `${name[0].toUpperCase()}${name.slice(1)}`);
	fs.writeFileSync(path.join(dir, 'index.js'), index);

	// make components directory
	fs.mkdirSync(path.join(dir, 'components'));
	let component = String(fs.readFileSync(path.join(__dirname, 'defaults', 'component.crc')));
	component = component.replace(/%name%/g, name);
	component = component.replace(/%Name%/g, `${name[0].toUpperCase()}${name.slice(1)}`);
	fs.writeFileSync(path.join(dir, 'components', `${name}.js`), component);
}

exports.addScript = function addScript(title, name, command) {
	const loc = path.join(process.cwd(), title, 'package.json');
	const package = fs.readFileSync(loc);
	const packageJ = JSON.parse(package);
	const { scripts } = packageJ;
	scripts[name] = command;
	packageJ[scripts] = scripts;
	packageJ.main = 'lib/index.js';
	fs.writeFileSync(loc, JSON.stringify(packageJ, null, 2));
}