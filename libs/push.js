const exec = require('./utils/main').exec;
const version = require('../package.json').version;
setImmediate(async () => {
    //Esegui il commit di tutti i file specificando solo il nome della versione come commento
    await exec('git add .').catch((e) => console.log(e.toString())).finally(() => console.log('Added all files to commit'));
    await exec(`git commit -am "${version}"`).catch((e) => console.log(e.toString())).finally(() => console.log('Committed all files'));
    await exec('git push').catch((e) => console.log(e.toString())).finally(() => console.log('Pushed all changes'));
    await exec(`git tag -d ${version}`).catch((e) => console.log(e.toString()))
    await exec(`git tag ${version}`).catch((e) => console.log(e.toString())).finally(() => console.log('Tagged all changes'));
    await exec(`git push origin :refs/tags/${version}`).catch((e) => console.log(e.toString()))
    await exec(`git push origin ${version}`).catch((e) => console.log(e.toString())).finally(() => console.log('Pushed all changes'));

})