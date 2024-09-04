const exec = require('./utils/main').exec;
const version = require('../package.json').version;
setImmediate(async () => {
    //Esegui il commit di tutti i file specificando solo il nome della versione come commento
    await exec('git add .');
    await exec('git commit -am "v' + version + '"');
    await exec('git push');
    // await exec(`git tag ${version}`);
    // await exec(`git push origin ${version}`);
})