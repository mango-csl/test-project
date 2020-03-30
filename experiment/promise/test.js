const child_process = require('child_process');
const chalk = require('chalk');

const pipe = (...fns) => {
    return arg => {
        return fns.reduce((p, f) => p.then(f), Promise.resolve(arg).then(data=>console.log(data)));
    };
};

const shellExec = (str) => {
    const exec = child_process.exec;
    return new Promise((resolve, reject) => {
        console.log(chalk.cyan(`exec: ${str}`));
        let data = '';
        let shell = exec(str, (error) => {
            if (error) reject();
        });
        shell.stdout.on('data', output);
        shell.stderr.on('data', output);

        function output(d) {
            data += d;
            console.log(d);
        }

        shell.on('close', () => {
            resolve(data);
        });
    });
};

const result = pipe([() => shellExec(`git show v1.3.8`).then(data => console.log(data))])('est')
    .then(data => console.log('data', data));
console.log('result',result);
