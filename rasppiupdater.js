const AutoGitUpdate = require("auto-git-update");
const { exec, spawn } = require("child_process");
const { stdout, mainModule } = require("process");
const config = {
    repository: "https://github.com/namanshandilyapsiborg/31Aug2022Code",
    fromReleases: false,
    tempLocation: "/home/pi/Downloads",
    //token: "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",
    executeOnComplete: print(),
    exitOnComplete: false,
};
const updater = new AutoGitUpdate(config);
//updater.autoUpdate();

function forceUpdater()
{
    updater.forceUpdate();
}

forceUpdater()


function updatewithTimer()
{
    try {
    
        //updater.forceUpdate();
        //updater.compareVersions();
        let updateTimer = setInterval(async()=>{
            let versionChecker = await updater.compareVersions();
            console.log("version Checker value ===> ", versionChecker)
            //if(versionChecker.currentVersion != versionChecker.remoteVersion)
            if(versionChecker["remoteVersion"] && versionChecker.currentVersion != versionChecker.remoteVersion)
            {
                console.log("//=== Verisons are not same ===//")
                let updating = await updater.forceUpdate();
                let timer = setTimeout(() => {
                    const child = spawn('npm i', {
                        stdio: 'inherit',
                        shell: true,
                        cwd: './'
                    })
        
                    child.on('close', (code) => {                 //--> after build run the frontend
                        console.log(`child process exited with code ${code}`);
                    let child2 = spawn('npm i', {
                            stdio: 'inherit',
                            shell: true,
                            cwd: './Saps_Rasp_Pubnub'
                        })
        
                    // child2.on('close', (code)=>{
                    //     setTimeout(()=>{
                    //         exec("sudo reboot");
                    //     },5000)
                    // })    
                    });
                    console.log("//====== Timer Completed =====//")
                    clearTimeout(timer)
                    clearTimeout(updateTimer)
                }, 300000)
            
            }
            else if(versionChecker.upToDate == true)
            {
                console.log("//==== Version is UpDated ===//")
            }
        },30000)
    } catch (e) { console.log("E : ", e) }
}

//updatewithTimer()

function print() {
    console.log("//=== print function got hit ====//")
}