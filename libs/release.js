const exec = require('./utils/main').exec;
setImmediate(async () => {
    await exec("yarn new " + process.argv[2] + " yarn build && yarn push").catch((e) => console.log(e.toString())).finally(() => console.log('Released all changes'));
})
