const exec = require('child_process').exec;
const command_new = "yarn new " + process.argv[2];
const command_build = "yarn build";
const command_push = "yarn push";
exec(command_new, (error, stdout, stderr) => {
    console.log("Running: " + command_new);
    if (error) { console.error(`exec error: ${error}`); return; }
    console.log(stdout);
});
exec(command_build, (error, stdout, stderr) => {
    console.log("Running: " + command_build);
    if (error) { console.error(`exec error: ${error}`); return; }
    console.log(stdout);
});
exec(command_push, (error, stdout, stderr) => {
    console.log("Running: " + command_push);
    if (error) { console.error(`exec error: ${error}`); return; }
    console.log(stdout);
});