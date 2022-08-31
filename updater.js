const AutoGitUpdate = require("auto-git-update");
const { exec, spawn } = require("child_process");
const { stdout } = require("process");
const config = {
    repository: "https://github.com/namanshandilyapsiborg/31Aug2022Code.git",
    fromReleases: false,
    tempLocation: "D:/PsiBorg",
    token: "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",
    //ignoreFiles: ['util/config.js'],
    //executeOnComplete: 'C:/Users/scheg/Desktop/worksapce/AutoGitUpdate/startTest.bat',
    executeOnComplete: print(),
    exitOnComplete: false,
};
const updater = new AutoGitUpdate(config);
//updater.autoUpdate();
//updater.forceUpdate();
try {
    updater.compareVersions();
} catch (e) { console.log("E : ", e) }


function print() {
    console.log("print function got hit")
    // setTimeout(()=>{
    //     const child = spawn('npm i',{
    //         stdio : 'inherit',
    //         shell : true,
    //         cwd : './'
    //     })

    //     child.on('close', (code) => {                 //--> after build run the frontend
    //         console.log(`child process exited with code ${code}`);
    //         spawn('node app.js', {
    //             stdio: 'inherit',
    //             shell: true,
    //             cwd: './'
    //         })
    //     });
    // console.log("Timer completed")
    // },20000)
}