const {exec , spawn} = require("child_process");


const child = spawn('npm i',{
    stdio : 'inherit',
    shell : true,
    cwd : './'
})

child.on('close', (code) => {                 //--> after build run the frontend
    console.log(`child process exited with code ${code}`);
    spawn('node app.js', {
        stdio: 'inherit',
        shell: true,
        cwd: './'
    })
});