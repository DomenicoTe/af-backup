const { execute } = require('../src/libs/utils');
const version = require('../package.json').version;
setImmediate(async () => {
    try {
        await execute('git add .'); console.log('Added all files to commit')
        await execute(`git commit -am "${version}"`); console.log('Committed all files')
        await execute('git push'); console.log('Pushed all changes')
        await execute(`git tag -d ${version}`); console.log('Deleted old tag')
        await execute(`git tag ${version}`); console.log('Tagged all changes')
        await execute(`git push origin :refs/tags/${version}`); console.log('Deleted old tag from remote')
        await execute(`git push origin ${version}`); console.log('Pushed all changes')
        console.log('All Done!! Pushed new tag to remote')
    }
    catch (e) { console.error(e.stack ,e.message) }
})