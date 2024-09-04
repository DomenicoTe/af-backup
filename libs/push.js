const exec = require('./utils/main').exec;
const version = require('../package.json').version;
setImmediate(async () => {
    //Esegui il commit di tutti i file specificando solo il nome della versione come commento
    await exec('git add .').finally(() => console.log('Added all files to commit'));
    await exec('git commit -am "v' + version + '"').finally(() => console.log('Committed all files'));
    await exec('git push').catch((e) => console.error(e));
    await exec(`git tag ${version}`).catch((e) => console.error(e));
    await exec(`git push origin ${version}`).catch((e) => console.error(e));
})