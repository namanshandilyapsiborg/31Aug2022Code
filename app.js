console.log("//============= Skai Backend has been started ==============//")
// const { pubnub } = require("./pubnub-module");
const PubNub = require("pubnub");
const download = require("download");
const unzipper = require("unzipper");
// const path = require("path");
const axios = require("axios");
const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { SerialPort } = require("serialport");
var Wifi = require("rpi-wifi-connection");
var wifi = new Wifi();
const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 115200 });
var qr = require("qr-image");
//=========> For Git Update Library
const AutoGitUpdate = require("auto-git-update");
const { stdout, mainModule, stderr } = require("process");
const schedule = require("node-schedule");
const checkDiskSpace = require('check-disk-space').default

let pubnub;


// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Import the Node_Webcam liberary
var NodeWebcam = require( "node-webcam" );

// Import the Moment liberary for time
const moment = require('moment');

const packageJson = require("./package.json")

const version = packageJson.version;
console.log("versionnnnnnn", version);

// let time = moment();

var slot;


let dir = null;

if(!dir)
{
    dir = path.join(__dirname, "/Saps_Rasp_Pubnub/src/BurnerAd/")
    if(!fs.existsSync(dir))
    {
        console.log("Creating Burner Ad Folder===")
        fs.mkdirSync(dir)
    }else{
        console.log("===== BurnerAd Folder Already Exist=====")
    }
}

var opts = {

    width: 1920,

    height: 1080,

    quality: 100,

    frames: 1,

    output: "jpeg",

    callbackReturn: "base64",
};

var burnerAdPlaying = false;
var update_screen = false;
let timer = null;
let timer_burnerad = null;
var image;

//Creates webcam instance

var Webcam = NodeWebcam.create( opts );
var cam = 14;
// get web cam list
function countwebCamList(){
    Webcam.list(function(list){
        console.log("============WEBCAM COUNT==========", list.length)
        cam = list.length
    })
}

countwebCamList();
let masterChannel = "c3RvcmFnZS5zYXBzLm9uZQ=="           ///=====> For server Backend

const config = {
    repository: "https://github.com/namanshandilyapsiborg/31Aug2022Code",
    fromReleases: false,
    tempLocation: "/home/pi/Documents",
    //token: "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",
    //ignoreFiles: ['util/config.js'],
    //executeOnComplete: 'C:/Users/scheg/Desktop/worksapce/AutoGitUpdate/startTest.bat',
    //executeOnComplete: print(),
    exitOnComplete: false,
};
const updater = new AutoGitUpdate(config);

var { Base64 } = require("./Base64");

//====================== For Led =========================//
var Gpio = require("onoff").Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(26, "out"); //use GPIO pin 4, and specify that it is output
var LED2 = new Gpio(26, "out"); //===> For QR Code LED GLOWING

//====================== For Qr COde ===========================//
const button = new Gpio(5, "in", "both");

const { ReadlineParser } = require("@serialport/parser-readline");

// let a = ["jNWN2kTOwITNmBDN"];
// pubnub.subscribe({
//   channels: a,
// });
let publishChannel;            //===> Device Original mac ID
let frontendChannel ;          //===> For only Frontend
let a = [];

let frontendstarted = false;

//for live content
let liveContentLink;
let fileType;
let burnerad;



//========================= Getting MAcID ======================//
async function getChannel() {
    if (await fs.existsSync("./realmacadd.json") && await fs.existsSync("./frontendMac.json") ) {
        console.log("//=== macadress Channel exist ==//");
        let data = fs.readFileSync("./realmacadd.json", "utf-8");
        //console.log("MAC id inside mac address json file ==> ", JSON.parse(data));
        let mcadd = JSON.parse(data);
        console.log("mcadd inside get_mac ===> ", mcadd[0].macaddress);
        //=================== For Frontend channel ==============================//
        let data1 = fs.readFileSync("./frontendMac.json", "utf-8");
        let mcadd1 = JSON.parse(data1);
        console.log("Frontend MAC ===> ", mcadd1[0].macaddress);

        
        // const uuid = PubNub.generateUUID();
        
         pubnub = new PubNub({
          publishKey: "pub-c-90d5fa5c-df63-46c7-b5f2-2d6ad4efd775",
          subscribeKey: "sub-c-81c16c55-f391-4f72-8e57-2d9e052a360c",
        
          // publishKey: "pub-c-1a0b4b54-d0f4-4493-86d8-fc2d56a06f55",
          // subscribeKey: "sub-c-3df591b2-a923-460c-8078-2ab79fea5016",
          //uuid: uuid,
          restore: true,
          presenceTimeout: 20,
          autoNetworkDetection : true,
          userId: mcadd[0].macaddress,

          keepAliveSettings: {
            keepAliveMsecs: 3600,
            freeSocketKeepAliveTimeout: 3600,
            timeout: 3600,
            maxSockets: Infinity,
            maxFreeSockets: 256 
        },

          withPresence : true
          //keepAlive : true,
        });

        //==================== Mac address to write to the device ======================//
        publishChannel = mcadd[0].macaddress
        frontendChannel = mcadd1[0].macaddress
        a.push(mcadd[0].macaddress);
        let SkaiChannel = "c2thaVVwZGF0ZUNoYW5uZWw="
        a.push(SkaiChannel)
        a.push(masterChannel)
        pubnub.subscribe({
            channels: a,
        });
    }
}

 getChannel()

//========================= PUBNUB LISTENER ====================//

async function adlistner() {
    if (await fs.existsSync("./realmacadd.json") && await fs.existsSync("./frontendMac.json") ) {

        pubnub.addListener({
            status: function (statusEvent) {
                if (statusEvent.category === "PNNetworkDownCategory") {
                    console.log("PNNetworkDownCategory ===> ", statusEvent.category);
                    pubnub.reconnect()
                }
                if (statusEvent.category === "PNConnectedCategory") {
                    console.log("statusEvent ===> ", statusEvent.category);
                } else {
                    console.log("//== Connection failed backend ===//");
                    pubnub.reconnect();
                }
            },
            category: function (e) {
                console.log(e.category === "PNNetworkDownCategory");
            },
            message: function (messageEvent) {
                console.log("Message From Pubnub ===> ", messageEvent.message);
                if(messageEvent.channel == "c2thaVVwZGF0ZUNoYW5uZWw=")
                {
                //=====================================================================//
                if (messageEvent.message.eventname == "update") 
                {
                    forceUpdater()
                }

                if (messageEvent.message.eventname == "autoupdate") 
                {
                    autoUpdater()
                }

                if (messageEvent.message.eventname == "autoUpdateTimer") 
                {
                    autoUpdateTimer()
                }
                if (messageEvent.message.eventname == "updateScreenEnabled") 
                {
                    showUpdateScreen("updateScreenEnabled")
                }
                if (messageEvent.message.eventname == "updateScreenDisabled") 
                {
                    showUpdateScreen("updateScreenDisabled")
                }    
                if (messageEvent.message.eventname == "force reboot") 
                {
                    console.log("//=== Rebooting ForceFully =========//")
                    exec("sudo reboot")
                }
                if (messageEvent.message.eventname == "space available") {
                    console.log("//===Checking Disk Space =========//")
                    checkSpace();
            }
        
            if (messageEvent.message.eventname == "download_burner_ad") {
                console.log("//===Downloading Burner ad Skai Channel=========//")
                DownloadBurnerAdZip(
                    // ==> Download Function
                    messageEvent.message.fileurl,
                    messageEvent.message.uniquefilename,
                    messageEvent.message.filetype
                );
            }
        
                }
                else if(messageEvent.channel == masterChannel)
                {
                    if (messageEvent.message.eventname == "download_burner_ad") {
                        console.log("//===Downloading Burner ad Master Channel=========//")
                        DownloadBurnerAdZip(
                            // ==> Download Function
                            messageEvent.message.fileurl,
                            messageEvent.message.uniquefilename,
                            messageEvent.message.filetype
                        );
                    }
        
                    if (messageEvent.message.eventname == "delete_user_file") 
                    {
                        //console.log("Eventname => ", messageEvent.message.eventname);
                        DeleteUserFiles(
                            messageEvent.message.uniquename,
                            messageEvent.message.filetype
                        );
                    }
                }
                else{
        
                    if (messageEvent.message.eventname == "update") 
                    {
                        forceUpdater()
                    }
                    if (messageEvent.message.eventname == "autoUpdateTimer") 
                    {
                        autoUpdateTimer()
                    }
                    if (messageEvent.message.eventname == "updateScreenEnabled") 
                    {
                        showUpdateScreen("updateScreenEnabled")
                    }
                    if (messageEvent.message.eventname == "updateScreenDisabled") 
                    {
                        showUpdateScreen("updateScreenDisabled")
                    } 
        
        
        
                    if (messageEvent.message.eventname === "download_video") 
                    {
                        DownloadVideoZip(
                            // ==> Download Function
                            messageEvent.message.fileurl,
                            messageEvent.message.uniquefilename,
                            messageEvent.message.filetype
                        );
                    }
        
                    if (messageEvent.message.eventname == "download_burner_ad") {
                      console.log("//===Downloading Burner ad Mac Address Channel=========//")
                      DownloadBurnerAdZip(
                          // ==> Download Function
                          messageEvent.message.fileurl,
                          messageEvent.message.uniquefilename,
                          messageEvent.message.filetype
                      );
                  }
        
                    if (messageEvent.message.eventname == "delete_user_file") 
                    {
                        //console.log("Eventname => ", messageEvent.message.eventname);
                        DeleteUserFiles(
                            messageEvent.message.uniquename,
                            messageEvent.message.filetype
                        );
                    }
        
                    if (messageEvent.message.eventname == "get_device_file") 
                    {
                        //console.log("Eventname => ", messageEvent.message.eventname);
        
                        if(frontendstarted)
                        {
                            getUserFilesName(messageEvent.message.filetype);
                        }
                        else{
                            pubnub.publish(
                                {
                                    channel: masterChannel,
                                    message: {
                                        mac_id :  publishChannel,
                                        eventname : "resp_get_device_file",
                                        status: "Get Device File Failure",
                                    },
                                },
                                (status, response) => {
                                    console.log("Status Pubnub ===> ", status);
                                }
                            );
                        }
        
                    }            
                    //============================= Play/Pause ===========================================//
                    if (messageEvent.message.eventname == "play") 
                    {
                        if(!update_screen)
                        {
                            PlayPauseVideo(messageEvent.message)
                        }
                        
                    }   //=================== to stop the video =================>
                    if (messageEvent.message.eventname == "stop") {
                        if(!update_screen)
                        {
                            PlayPauseVideo(messageEvent.message)
                        }
                        
                      }
        
                    if (messageEvent.message.eventname == "getlive") {
                        pubnub.publish(
                            {
                                channel: publishChannel,
                                message: {
                                    mac_id :  publishChannel,
                                    eventname : "getlivelink",
                                    link : liveContentLink,
                                    fileType : fileType
                                },
                            },
                            (status, response) => {
                                console.log("Status Pubnub ===> ", status);
                            }
                        );
                     }  
                   
                    if (messageEvent.message.eventname == "force reboot") {
                        console.log("//=== Rebooting ForceFully =========//")
                        exec("sudo reboot")
                    }
        
                    if (messageEvent.message.eventname == "space available") {
                        console.log("//===Checking Disk Space =========//")
                        checkSpace();
                }
                }  
            },
            presence: function (presenceEvent) {
                console.log("Handle Presence ===> ", presenceEvent);
            },
        });
    }

}

adlistner()


function checkWifiConnection () {

    return new Promise((resolve, reject) => {
     exec("iwconfig", (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      
    }
    // console.log("checkwifi ==>", typeof stdout)
    let myPattern = new RegExp('(\\w*' + "Not-Associated" + '\\w*)', 'gi')
    let matches = stdout.match(myPattern)

    if (matches) {
        // console.log("my pattern does exist")
        exec("sudo rfkill unblock wifi")
        exec("sudo ifconfig wlan0 up")
        console.log("======== Wifi connection is turned ON ==========")
        resolve(true)
    }
    reject("already connected")
     });
    });
}


checkWifiConnection().then ((data) => {
setTimeout(async () => {
    restart();
    console.log("== connection done ==", data)
}, 50000)

}).catch((err) => {
    restart();
    console.log("== connection done ==", err)
})


async function restart() {
    if (await fs.existsSync("./realmacadd.json") && await fs.existsSync("./frontendMac.json") ) {

        restartstatus();
        checkSpace();

    }

}

function restartstatus()
{
    pubnub.publish(
        {
            channel: masterChannel,
            message: {
                mac_id :  publishChannel,
                eventname : "devicerestart",
                status : "restarted"
            },
        },
        (status, response) => {
            console.log("Status Pubnub ===> ", status);
        }
    );
}





//=======> Checking DiskSpace=======>
function checkSpace()
{
// On Linux or macOS
    checkDiskSpace('/home').then((diskSpace) => {
    console.log(diskSpace)
    // {
    //     diskPath: '/',
    //     free: 12345678,
    //     size: 98756432
    // }
    // Note: `free` and `size` are in bytes

    totalSpace = (diskSpace.size / 1024) / 1024 / 1024;

    freeSpace = (diskSpace.free / 1024) / 1024 / 1024;

    totalSpace = totalSpace.toFixed(3);
    freeSpace = freeSpace.toFixed(3);

    console.log("Total Space in GB",totalSpace);
    console.log("Free Space in GB",freeSpace);

    pubnub.publish(
        {
            channel: masterChannel,
            message: {
                mac_id :  publishChannel,
                eventname : "diskSpace",
                totalspace : totalSpace,
                freespace : freeSpace
            },
        },
        (status, response) => {
            console.log("Status Pubnub ===> ", status);
        }
    );
})
}




//===> To play Pause 
function PlayPauseVideo(data)
{
    console.log("playPauseVideo func() ==> ", data)
    countwebCamList()

    //for google vision api------------------------------------------

    orderId = data.orderId;
    second = data.second;

    if(data.eventname == "play")
    {
        burnerAdPlaying = false;
        console.log("Clearing timer for photo in play function");
        clearInterval(timer);
        console.log("Clearing timer for BurnerAd in play function");
        clearInterval(timer_burnerad);

        liveContentLink = data.contentLink
        fileType = data.filetype
        data["webcam"] = cam === 14 ? false : true
        data["cameraEvent"] = "camera"
        if (data && data.filetype == "image/jpeg") 
        {
          console.log("Image name ==> ", data.filename);
          if(fs.existsSync(path.join(__dirname ,`/Saps_Rasp_Pubnub/src/images_ad/${data.filename}.jpg` )))
          {
             console.log("//=== Yes Image exist ===//")
             if(frontendChannel)
             {
                pubnub.publish(
                    {
                        channel: frontendChannel,
                        message: data,
                    },
                    (status, response) => {
                        console.log("Status Pubnub ===> ", status);
                    }
                );
             }

             pubnub.publish(
                {
                    channel: masterChannel,
                    message: {
                        mac_id :  publishChannel,
                        eventname : "playresp",
                        orderId : orderId,
                        second : second,
                        status : "played"
                    },
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );

              // start timer to click photo
              console.log("Starting timer for photo");
              timer = setInterval(click_photo, 5000);          

             
          }
        }
        if (data && data.filetype == "video/mp4") 
        {
          console.log("Video name ==> ", data.filename);
          if(fs.existsSync(path.join(__dirname ,`/Saps_Rasp_Pubnub/src/Videos/${data.filename}.mp4` )))
          {
             console.log("//=== Yes Video exist ===//")
             if(frontendChannel)
             {
                pubnub.publish(
                    {
                        channel: frontendChannel,
                        message: data,
                    },
                    (status, response) => {
                        console.log("Status Pubnub ===> ", status);
                    }
                );
             }


             pubnub.publish(
                {
                    channel: masterChannel,
                    message: {
                        mac_id :  publishChannel,
                        eventname : "playresp",
                        orderId : orderId,
                        second : second,
                        status : "played"
                    },
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );

              // start timer to click photo
              console.log("Starting timer for photo");
              timer = setInterval(click_photo, 5000);          

          }
        }

        if (data && data.filetype == "video/webm") 
        {
          console.log("Video name ==> ", data.filename);
          if(fs.existsSync(path.join(__dirname ,`/Saps_Rasp_Pubnub/src/Videos/${data.filename}.webm` )))
          {
             console.log("//=== Yes Video exist ===//")
             if(frontendChannel)
             {
                pubnub.publish(
                    {
                        channel: frontendChannel,
                        message: data,
                    },
                    (status, response) => {
                        console.log("Status Pubnub ===> ", status);
                    }
                );
             }


             pubnub.publish(
                {
                    channel: masterChannel,
                    message: {
                        mac_id :  publishChannel,
                        eventname : "playresp",
                        orderId : orderId,
                        second : second,
                        status : "played"
                    },
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );

              // start timer to click photo
              console.log("Starting timer for photo");
              timer = setInterval(click_photo, 5000);          

          }
        }


        if (data && data.filetype == "url") 
        {
          console.log("Video link ==> ", data.filename);
             if(frontendChannel)
             {
                pubnub.publish(
                    {
                        channel: frontendChannel,
                        message: data,
                    },
                    (status, response) => {
                        console.log("Status Pubnub ===> ", status);
                    }
                );
             }

             pubnub.publish(
                {
                    channel: masterChannel,
                    message: {
                        mac_id :  publishChannel,
                        eventname : "playresp",
                        orderId : orderId,
                        second : second,
                        status : "played"
                    },
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );
                        
            // start timer to click photo
            console.log("Starting timer for photo");
            timer = setInterval(click_photo, 5000);
        }

            // // start timer to click photo
            // console.log("Starting timer for photo");
            // timer = setInterval(click_photo, 5000);
    }
    else if(data.eventname == "stop")
    {
        liveContentLink = null;

        console.log("Clearing timer for photo in stop function");
        clearInterval(timer);

        console.log("Clearing timer for BurnerAd in stop function");
        clearInterval(timer_burnerad);

        // getBurnerAdFileName(burnarAdFolder);
        
        console.log("Burner ad list----->",burnerad.length);

        if (burnerad.length > 0)
        {
            burnerAdPlaying = true;
            const random = Math.floor(Math.random()*burnerad.length)
    
            liveContentLink = null;
            data["filetype"] = "burnerad";
            data["filename"] = burnerad[random];

        }
        else{
            data["filetype"] = null;
            data["filename"] = null;  
        }

        if(frontendChannel)
        {
           pubnub.publish(
               {
                   channel: frontendChannel,
                   message: data,
               },
               (status, response) => {
                   console.log("Status Pubnub ===> ", status);
               }
           );
        }

        pubnub.publish(
            {
                channel: masterChannel,
                message: {
                    mac_id :  publishChannel,
                    eventname : "playresp",
                    orderId : orderId,
                    second : second,
                    status : "stopped"
                },
            },
            (status, response) => {
                console.log("Status Pubnub ===> ", status);
            }
        );

        // console.log("Clearing timer for photo");
        // clearInterval(timer);

        timer_burnerad = setInterval(playBurnerAd, 30000);

    }
   
}




// let timer = setInterval(click_photo, 5000);

async function sendPhotoToServer(orderId, photo){
    try{
        let body = {
            orderId,
            publishChannel,
            photo
        }
        let resp = await axios.post("http://api.postmyad.ai/api/order/orderViewsImage", body)
        console.log("response from sendPhotoToServer====>", resp.data)
    }catch (error){
        console.log("Error From sendPhotoToServer====>", error)
    }
}


async function click_photo(){
        await NodeWebcam.capture( `./images/photo.jpg`, opts, function( err, data ) {
            // image = "<img src='" + data + "'>";
            if(err)
            {
                // console.log("Error From Click_photo", err);
                console.log("Error From Click_photo");
            }
            image = data;
            console.log("Quickstart after photo clicked ==>")
            // quickstart();  
            sendPhotoToServer(orderId, image);     
    
    });
}

Webcam.clear();

//------------------Google Vision---------------------------------//

// async function quickstart() {

//     let time = moment();

//     slot = time.format('H');

//     console.log(
//     "Today is:",slot
//     );

//     // Creates a client
//     const client = new vision.ImageAnnotatorClient({
//         keyFilename: "visionKey2.json"
//     });
  
//     // // Performs label detection on the9 image file
//     // const [result] = await client.faceDetection('./images/photo.jpg');

//     const [result] = await client.faceDetection({
//         image: { 
//           source: { filename: './images/photo.jpg' } 
//         },
//         features: [
//           {
//             maxResults: 2000,
//             type: vision.protos.google.cloud.vision.v1.Feature.Type.FACE_DETECTION,
//             // type: "FACE_DETECTION",
//           },
//         ],
//       });

//     const faces = result.faceAnnotations;
//     faceCount = faces.length;
//     console.log('Faces ==>:', faceCount);

//     pubnub.publish(
//         {
//             channel: masterChannel,
//             message: {
//                 mac_id :  publishChannel,
//                 eventname : "faceCount",
//                 orderId : orderId,
//                 faceCount : faceCount,
//                 timeSlot : slot
//             },
//         },
//         (status, response) => {
//             console.log("Status Pubnub ===> ", status);
//         }
//         );

//         sendPhotoToServer(orderId, image)
//   }
//   quickstart();

async function showUpdateScreen(eventname)
{
    if(eventname && eventname == "updateScreenEnabled") 
        {
            //=====> Comparing version ====> 
            let versionChecker = await updater.compareVersions();
            console.log("Version Inside showUpdateScreen ===> ", versionChecker)
            if (versionChecker["remoteVersion"] && versionChecker.currentVersion != versionChecker.remoteVersion) 
            {
                console.log("//== Version are different ==//")

                console.log("Clearing timer for BurnerAd in F11 Function function");
                clearInterval(timer_burnerad);

                if(frontendChannel)
                {
                   let data = {
                       eventname : "play",
                       filename : "updating",
                       displaytype : "fullscreen",
                       filetype : "updating"
                   }
                   if(data)
                   {
                       pubnub.publish(
                           {
                               channel: frontendChannel,
                               message: data,
                           },
                           (status, response) => {
                               console.log("Status Pubnub ===> ", status);
                           }
                       );

                       pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "updatescreenresp",
                                status : "started"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                   }  
                }
                update_screen = true;
                // if(timer != null)
                // {
                    console.log("Clearing timer for photo in Update Screen Function");
                    clearInterval(timer); 
                // }
            }
        }
    if(eventname && eventname == "updateScreenDisabled")
    {
        if(frontendChannel)
        {
           let data = {
               eventname : "stop",
               filename : "updating",
               displaytype : "fullscreen",
               filetype : "updating"
           }
           if(data)
           {
               pubnub.publish(
                   {
                       channel: frontendChannel,
                       message: data,
                   },
                   (status, response) => {
                       console.log("Status Pubnub ===> ", status);
                   }
               );
           }  
        }
        update_screen = false;
    }    
}


//==================== To Download Video ====================//
function DownloadVideoZip(fileurl, zipname, filetype) {
    console.log("Inside DownloadVideoZip ==> ", fileurl);
    if (fileurl && zipname && filetype) {
        const file = fileurl;

        checkSpace();

        //===> for video download ====>
        if (filetype == "video/mp4") {
            console.log(" //=== Video/mp4 ======//");
            //====> first check if video already downloaded
            if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/Videos/${zipname}.mp4`)))
            {
                console.log("//=== File already exist =======//")
                //===> Pubnub Publish of Download Completion ===>
                let timer = setTimeout(()=>{
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Video Already Exist",
                                filename : zipname,
                                filetype : "video/mp4"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                clearTimeout(timer)
                },3000)
                return ;
            }
            else 
            {
                const filePath = `${__dirname}/zippedfiles`;

                download(file, filePath).then(() => {
                    console.log("//==   Video Download Completed   ==//");
    
                    //============ Now unzip the file ==================//
                    console.log("Inside Zip file name ==>", zipname);
                    const path = `./zippedfiles/${zipname}.zip`;
                    console.log("path ==>", path);
    
                    fs.createReadStream(path).pipe(
                        unzipper.Extract({ path: "./Saps_Rasp_Pubnub/src/Videos" })
                    );
                    setTimeout(() => {
                        fs.unlinkSync(`./zippedfiles/${zipname}.zip`, () => {
                            console.log("deleted");
                        });
                    }, 1000);
                    //===> Pubnub Publish of Download Completion ===>
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Download Success",
                                filename : zipname,
                                filetype : "video/mp4"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );


                });
            }            
        } 
        else if (filetype == "video/webm") {
            console.log(" //=== Video/webm ======//");
            //====> first check if video already downloaded
            if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/Videos/${zipname}.webm`)))
            {
                console.log("//=== File already exist =======//")
                //===> Pubnub Publish of Download Completion ===>
                let timer = setTimeout(()=>{
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Video Already Exist",
                                filename : zipname,
                                filetype : "video/webm"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                clearTimeout(timer)
                },3000)
                return ;
            }
            else 
            {
                const filePath = `${__dirname}/zippedfiles`;

                download(file, filePath).then(() => {
                    console.log("//==   Video Download Completed   ==//");
    
                    //============ Now unzip the file ==================//
                    console.log("Inside Zip file name ==>", zipname);
                    const path = `./zippedfiles/${zipname}.zip`;
                    console.log("path ==>", path);
    
                    fs.createReadStream(path).pipe(
                        unzipper.Extract({ path: "./Saps_Rasp_Pubnub/src/Videos" })
                    );
                    setTimeout(() => {
                        fs.unlinkSync(`./zippedfiles/${zipname}.zip`, () => {
                            console.log("deleted");
                        });
                    }, 1000);
                    //===> Pubnub Publish of Download Completion ===>
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Download Success",
                                filename : zipname,
                                filetype : "video/webm"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );


                });
            }            
        } 
        else if (filetype == "image/jpeg") {
            if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/images_ad/${zipname}.jpg`)))
            {
                console.log("//=== File already exist =======//")
                let timer = setTimeout(()=>{
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status: "Image Already Exist",
                                filename : zipname,
                                filetype : "image/jpeg"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                    clearTimeout(timer)
                },3000)
                return ;
            }
            else
            {
                const file = fileurl;
                console.log("Image file url ==> ", fileurl);
                //const filePath = `${__dirname}/zippedfiles`;
                const filePath = `${__dirname}/Saps_Rasp_Pubnub/src/images_ad`;
                download(file, filePath).then(() => {
                    console.log("//==  Image Download Completed   ==//");
                    //===> Pubnub Publish of Download Completion ===>
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status: "Download Success",
                                filename : zipname,
                                filetype : "image/jpeg"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                });
            }
        }
    }
}




// function DownloadVideoZip(fileurl, zipname, filetype) {
//     console.log("Inside DownloadVideoZip ==> ", fileurl);
//     if (fileurl && zipname && filetype) {
//         const file = fileurl;

//         checkSpace();

//         //===> for video download ====>
//         if (filetype == "video/mp4") {
//             console.log(" //=== Video/mp4 ======//");
//             //====> first check if video already downloaded
//             if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/Videos/${zipname}.mp4`)))
//             {
//                 console.log("//=== File already exist =======//")
//                 //===> Pubnub Publish of Download Completion ===>
//                 let timer = setTimeout(()=>{
//                     pubnub.publish(
//                         {
//                             channel: masterChannel,
//                             message: {
//                                 mac_id :  publishChannel,
//                                 eventname : "Downloaded",
//                                 status : "Video Already Exist",
//                                 filename : zipname,
//                                 filetype : "video/mp4"
//                             },
//                         },
//                         (status, response) => {
//                             console.log("Status Pubnub ===> ", status);
//                         }
//                     );
//                 clearTimeout(timer)
//                 },3000)
//                 return ;
//             }
//             else 
//             {
//                 const filePath = `${__dirname}/zippedfiles`;



//                 downloadFile(file, filePath);
                

//                 // download(file, filePath).then(() => {
//                 //     console.log("//==   Video Download Completed   ==//");
    
//                 //     //============ Now unzip the file ==================//
//                 //     console.log("Inside Zip file name ==>", zipname);
//                 //     const path = `./zippedfiles/${zipname}.zip`;
//                 //     console.log("path ==>", path);
    
//                 //     fs.createReadStream(path).pipe(
//                 //         unzipper.Extract({ path: "./Saps_Rasp_Pubnub/src/Videos" })
//                 //     );
//                 //     setTimeout(() => {
//                 //         fs.unlinkSync(`./zippedfiles/${zipname}.zip`, () => {
//                 //             console.log("deleted");
//                 //         });
//                 //     }, 1000);
//                 //     //===> Pubnub Publish of Download Completion ===>
//                 //     pubnub.publish(
//                 //         {
//                 //             channel: masterChannel,
//                 //             message: {
//                 //                 mac_id :  publishChannel,
//                 //                 eventname : "Downloaded",
//                 //                 status : "Download Success",
//                 //                 filename : zipname,
//                 //                 filetype : "video/mp4"
//                 //             },
//                 //         },
//                 //         (status, response) => {
//                 //             console.log("Status Pubnub ===> ", status);
//                 //         }
//                 //     );


//                 // });
//             }            
//         } else if (filetype == "image/jpeg") {
//             if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/images_ad/${zipname}.jpg`)))
//             {
//                 console.log("//=== File already exist =======//")
//                 let timer = setTimeout(()=>{
//                     pubnub.publish(
//                         {
//                             channel: masterChannel,
//                             message: {
//                                 mac_id :  publishChannel,
//                                 eventname : "Downloaded",
//                                 status: "Image Already Exist",
//                                 filename : zipname,
//                                 filetype : "image/jpeg"
//                             },
//                         },
//                         (status, response) => {
//                             console.log("Status Pubnub ===> ", status);
//                         }
//                     );
//                     clearTimeout(timer)
//                 },3000)
//                 return ;
//             }
//             else
//             {
//                 const file = fileurl;
//                 console.log("Image file url ==> ", fileurl);
//                 //const filePath = `${__dirname}/zippedfiles`;
//                 const filePath = `${__dirname}/Saps_Rasp_Pubnub/src/images_ad`;
//                 download(file, filePath).then(() => {
//                     console.log("//==  Image Download Completed   ==//");
//                     //===> Pubnub Publish of Download Completion ===>
//                     pubnub.publish(
//                         {
//                             channel: masterChannel,
//                             message: {
//                                 mac_id :  publishChannel,
//                                 eventname : "Downloaded",
//                                 status: "Download Success",
//                                 filename : zipname,
//                                 filetype : "image/jpeg"
//                             },
//                         },
//                         (status, response) => {
//                             console.log("Status Pubnub ===> ", status);
//                         }
//                     );
//                 });
//             }
//         }
//     }
// }


// function downloadFile(file , filePath){
//     // Save variable to know progress
//     var received_bytes = 0;
//     var total_bytes = 0;

//     var req = request({
//         method: 'GET',
//         uri: file
//     });

//     var out = fs.createWriteStream(filePath);
//     req.pipe(out);

//     req.on('response', function ( data ) {
//         // Change the total bytes value to get progress later.
//         total_bytes = parseInt(data.headers['content-length' ]);
//     });

//     req.on('data', function(chunk) {
//         // Update the received bytes
//         received_bytes += chunk.length;

//         showProgress(received_bytes, total_bytes);
//     });

//     req.on('end', function() {
//         alert("File succesfully downloaded");
//     });
// }

// function showProgress(received,total){
//     var percentage = (received * 100) / total;
//     console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
//     // 50% | 50000 bytes received out of 100000 bytes.
// }


//==================== To Download BurnerAd ====================//
function DownloadBurnerAdZip(fileurl, zipname, filetype) {
    console.log("Inside DownloadBurnerAdZip ==> ", fileurl);
    if (fileurl && zipname && filetype) {
        const file = fileurl;

        checkSpace();

        console.log("Clearing timer for BurnerAd in play function");
        clearInterval(timer_burnerad);

        //===> for video download ====>
        if (filetype == "video/mp4") {
            console.log(" //=== Video/mp4 ======//");
            //====> first check if video already downloaded
            if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/BurnerAd/${zipname}.mp4`)))
            {
                console.log("//=== File already exist =======//")
                //===> Pubnub Publish of Download Completion ===>
                let timer = setTimeout(()=>{
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Video Already Exist",
                                filename : zipname,
                                filetype : "video/mp4"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                        }
                    );
                clearTimeout(timer)
                },3000)
                return ;
            }
            else 
            {
                const filePath = `${__dirname}/zippedfiles`;

                download(file, filePath).then(() => {
                    console.log("//==   Video Download Completed   ==//");
    
                    //============ Now unzip the file ==================//
                    console.log("Inside Zip file name ==>", zipname);
                    const path = `./zippedfiles/${zipname}.zip`;
                    console.log("path ==>", path);
    
                    fs.createReadStream(path).pipe(
                        unzipper.Extract({ path: "./Saps_Rasp_Pubnub/src/BurnerAd" })
                    );
                    setTimeout(() => {
                        fs.unlinkSync(`./zippedfiles/${zipname}.zip`, () => {
                            console.log("deleted");
                        });
                    }, 1000);
                    //===> Pubnub Publish of Download Completion ===>
                    pubnub.publish(
                        {
                            channel: masterChannel,
                            message: {
                                mac_id :  publishChannel,
                                eventname : "Downloaded",
                                status : "Download Success",
                                filename : zipname,
                                filetype : "video/mp4"
                            },
                        },
                        (status, response) => {
                            console.log("Status Pubnub ===> ", status);
                            getBurnerAdFileName(burnarAdFolder);
                            timer_burnerad = setInterval(playBurnerAd, 30000);
                        }
                    );


                });
            }            
        }
        //  else if (filetype == "image/jpeg") {
        //     if(fs.existsSync(path.join(__dirname , `/Saps_Rasp_Pubnub/src/images_ad/${zipname}.jpg`)))
        //     {
        //         console.log("//=== File already exist =======//")
        //         let timer = setTimeout(()=>{
        //             pubnub.publish(
        //                 {
        //                     channel: masterChannel,
        //                     message: {
        //                         mac_id :  publishChannel,
        //                         eventname : "Downloaded",
        //                         status: "Image Already Exist",
        //                         filename : zipname,
        //                         filetype : "image/jpeg"
        //                     },
        //                 },
        //                 (status, response) => {
        //                     console.log("Status Pubnub ===> ", status);
        //                 }
        //             );
        //             clearTimeout(timer)
        //         },3000)
        //         return ;
        //     }
            // else
            // {
            //     const file = fileurl;
            //     console.log("Image file url ==> ", fileurl);
            //     //const filePath = `${__dirname}/zippedfiles`;
            //     const filePath = `${__dirname}/Saps_Rasp_Pubnub/src/images_ad`;
            //     download(file, filePath).then(() => {
            //         console.log("//==  Image Download Completed   ==//");
            //         //===> Pubnub Publish of Download Completion ===>
            //         pubnub.publish(
            //             {
            //                 channel: masterChannel,
            //                 message: {
            //                     mac_id :  publishChannel,
            //                     eventname : "Downloaded",
            //                     status: "Download Success",
            //                     filename : zipname,
            //                     filetype : "image/jpeg"
            //                 },
            //             },
            //             (status, response) => {
            //                 console.log("Status Pubnub ===> ", status);
            //             }
            //         );
            //     });
            // }
        // }
    }
}




const imageFolder = './Saps_Rasp_Pubnub/src/images_ad/';
const videoFolder = './Saps_Rasp_Pubnub/src/Videos/';
const burnarAdFolder = './Saps_Rasp_Pubnub/src/BurnerAd/';

// function createdDate (fileFolder, file) {  
//   const { birthtime } = fs.statSync(`${fileFolder}${file}`)

//   return birthtime
// }

async function readFileNameAndTime (fileFolder, filetype) { 
    
    try{

        let file = await fs.promises.readdir(fileFolder)

        let body = {
            files:file,
            deviceMacId:publishChannel,
            fileType:filetype
        }

        let resp = await axios.post("http://api.postmyad.ai/api/device/deviceGallery/deviceFiles", body)
        console.log("response from readFileNameAndTime====>", resp.data)

        pubnub.publish(
            {
                channel: masterChannel,
                message: {
                    mac_id :  publishChannel,
                    eventname : "resp_get_device_file",
                    status: "Get Device File Success",
                },
            },
            (status, response) => {
                console.log("Status Pubnub ===> ", status);
            }
        );
        
    }catch (error){
        console.log("Error From resp_get_device_file====>", error)
    }

  }


async function getUserFilesName(filetype) {

    if(filetype === "video/mp4")
    {
        await readFileNameAndTime (videoFolder, filetype)
    }
    else if(filetype === "image/jpeg")
    {
        await readFileNameAndTime (imageFolder, filetype)
    }
    else if(filetype === "burnerad")
    {
        await readFileNameAndTime (burnarAdFolder, filetype)
    }

}

async function getBurnerAdFileName(fileFolder)
{
    burnerad = await fs.promises.readdir(fileFolder)
}

getBurnerAdFileName(burnarAdFolder);


function playBurnerAd()
{
    countwebCamList();
    console.log("return After Cam Count ===>", cam);

    if(!update_screen)
    {
        console.log("Burner ad list----->",burnerad.length);

        let data = {};

        data["webcam"] = cam === 14 ? false : true
        data["cameraEvent"] = "camera"
                                        
        if (burnerad.length > 0)
        {
            const random = Math.floor(Math.random()*burnerad.length)

            liveContentLink = null;
            data["filetype"] = "burnerad";
            data["filename"] = burnerad[random];
            data["eventname"] = "stop";
            data["displaytype"] = "fullscreen";

            if(frontendChannel)
            {
            pubnub.publish(
                {
                    channel: frontendChannel,
                    message: data,
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );
            }
            else{
                liveContentLink = null;
                data["filetype"] = null;
                data["filename"] = null;  
                data["eventname"] = "stop";
                data["displaytype"] = "fullscreen";

                if(frontendChannel)
                {
                pubnub.publish(
                    {
                        channel: frontendChannel,
                        message: data,
                    },
                    (status, response) => {
                        console.log("Status Pubnub ===> ", status);
                        burnerAdPlaying = true;
                    }
                );
                }
            }
        }
        else{
            if(frontendChannel)
            {
            pubnub.publish(
                {
                    channel: frontendChannel,
                    message: data,
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            );
            }
        }
    }
}



// function playBurnerAd()
// {
//     if(!update_screen)
//     {
//         console.log("Burner ad list----->",burnerad.length);

//         let data = {};
                                        
//         if (burnerad.length > 0)
//         {
//             const random = Math.floor(Math.random()*burnerad.length)

//             liveContentLink = null;
//             data["filetype"] = "burnerad";
//             data["filename"] = burnerad[random];
//             data["eventname"] = "stop";
//             data["displaytype"] = "fullscreen";

//             if(frontendChannel)
//             {
//             pubnub.publish(
//                 {
//                     channel: frontendChannel,
//                     message: data,
//                 },
//                 (status, response) => {
//                     console.log("Status Pubnub ===> ", status);
//                     burnerAdPlaying = true;
//                 }
//             );
//             }
//             else{
//                 liveContentLink = null;
//                 data["filetype"] = null;
//                 data["filename"] = null;  
//                 data["eventname"] = "stop";
//                 data["displaytype"] = "fullscreen";

//                 if(frontendChannel)
//                 {
//                 pubnub.publish(
//                     {
//                         channel: frontendChannel,
//                         message: data,
//                     },
//                     (status, response) => {
//                         console.log("Status Pubnub ===> ", status);
//                     }
//                 );
//                 }
//             }
//         }
//     }
// }


// async function sendFileNameToServer(fileName, fileTime){
    // try{
    //     let body = {
    //         fileName,
    //         fileTime
    //     }
    //     let resp = await axios.post("http://api.postmyad.ai/api/order/orderViewsImage", body)
    //     console.log("response from sendPhotoToServer====>", resp.data)
    // }catch (error){
    //     console.log("Error From sendPhotoToServer====>", error)
    // }
// }




//=================== Delete files ==========================//
// Saps_Rasp_Pubnub/src/Videos
function DeleteUserFiles(uniquefilename, filetype) {
    console.log("//====== Delete user files ===== //");

    if (filetype == "burnerad" && burnerAdPlaying)
    {
        const random = Math.floor(Math.random()*burnerad.length)
                                
        liveContentLink = null;
        data["filetype"] = null;
        data["filename"] = null;
        data["eventname"] = "stop";
        data["displaytype"] = "fullscreen";

        if(frontendChannel)
        {
           pubnub.publish(
               {
                   channel: frontendChannel,
                   message: data,
               },
               (status, response) => {
                   console.log("Status Pubnub ===> ", status);
               }
           );
        }
    }



    if (filetype && uniquefilename) {
        console.log("Filetype => ", filetype, "uniquefilename => ", uniquefilename);
        let path1 =
            filetype && filetype == "video/mp4"
                ? path.join(
                    __dirname,
                    `/Saps_Rasp_Pubnub/src/Videos/${uniquefilename}`
                )
                : filetype && filetype == "image/jpeg"
                    ? path.join(
                        __dirname,
                        `/Saps_Rasp_Pubnub/src/images_ad/${uniquefilename}`
                    )
                    : filetype && filetype == "burnerad"
                    ? path.join(
                        __dirname,
                        `/Saps_Rasp_Pubnub/src/BurnerAd/${uniquefilename}.mp4`
                    )
                    : null;
        console.log("path == >", path1);
        if (fs.existsSync(path1)) {
            console.log("yes path exist");
            fs.unlinkSync(path1, () => {
                console.log("User File Has Been Deleted Successfully");
            });
        } else {
            console.log("path doesn't exist");
        }
    }
}

//=============================== Auto Starting Backend =====================================//
async function frontendStart()
{
    setTimeout(async() => {
        let {stdout} =  await exec("npm start", { cwd: "./Saps_Rasp_Pubnub" });
        if(stdout)
        {
            console.log("//============== Frontend Has Been Started ============//")
                let timer2  = setTimeout(async() => {
                           // exec("chromium-browser --app=http://www.localhost:3000/ --kiosk",(err,stdout , stderr)=>{
                        let {stdout} = exec("firefox http://www.localhost:3000 --kiosk")
                        if(stdout)
                        {
                            console.log("//========= fireFox has been started =========//")
                            let timer3 = setTimeout(()=>{
                                let {stdout} = exec("xdotool search --sync --onlyvisible --name firefox key F11")
                                if(stdout)
                                {
                                    frontendstarted = true;
                                    console.log("//========= F11 Command has been executed ====//")

                                    console.log("Clearing timer for BurnerAd in F11 Function function");
                                    clearInterval(timer_burnerad);

                                    console.log("Burner ad list----->",burnerad.length);

                                    
                                    if (burnerad.length > 0)
                                    {
                                        let data = {};
                                        const random = Math.floor(Math.random()*burnerad.length)
                                
                                        liveContentLink = null;
                                        data["filetype"] = "burnerad";
                                        data["filename"] = burnerad[random];
                                        data["eventname"] = "stop";
                                        data["displaytype"] = "fullscreen";
                            
                                        if(frontendChannel)
                                        {
                                           pubnub.publish(
                                               {
                                                   channel: frontendChannel,
                                                   message: data,
                                               },
                                               (status, response) => {
                                                   console.log("Status Pubnub ===> ", status);
                                                   burnerAdPlaying = true;
                                               }
                                           );
                                        }
                                        
                                    }
                                    console.log("Starting timer for BurnerAd in F11 Function function");
                                        timer_burnerad = setInterval(playBurnerAd, 30000);
                                    // else{
                                    //     data["filetype"] = null;
                                    //     data["filename"] = null;  
                                    // }


                                }
                                clearTimeout(timer3)
                            },20000)
                          
                        }
                            clearTimeout(timer2)
                        }, 60000);

            // let timer2  = setTimeout(async() => {
            //                // exec("chromium-browser --app=http://www.localhost:3000/ --kiosk",(err,stdout , stderr)=>{
            //                 exec("firefox --kiosk http://www.localhost:3000/",(err,stdout , stderr)=>{
            //                     if(err)
            //                     {
            //                         console.log("Error in Starting Chromium")
            //                         return;
            //                     }
            //                     console.log("//=========== Chromium Has been Started ==============//")
            //                     let timer2 = setTimeout(()=>{
            //                         pubnub.publish(
            //                             {
            //                                 channel: masterChannel,
            //                                 message: {
            //                                     mac_id :  publishChannel,
            //                                     eventname : "Rebooted",
            //                                 },
            //                             },
            //                             (status, response) => {
            //                                 console.log("Status Pubnub ===> ", status);
            //                             }
            //                         );
            //                         clearTimeout(timer2)
            //                     },10000)
            //                 });
            //                 clearTimeout(timer2)
            //             }, 50000);
        }
    }, 20000);
}
frontendStart();




//======================== UART MAC ID =======================================//

function blinkLED() {
    //function to start blinking
    if (LED.readSync() === 0) {
        //check the pin state, if the state is 0 (or off)
        LED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        LED.writeSync(0); //set pin state to 0 (turn LED off)
    }
}

function endBlink() {
    //function to stop blinking
    //clearInterval(blinkInterval); // Stop blink intervals
    LED.writeSync(0); // Turn LED off
    //LED.unexport(); // Unexport GPIO to free resources
}
//============================== Button =================================//
button.watch((err, value) => {
    if (err) {
        throw err;
    }
    console.log("value ===>", value);
    if (value == 1) {
        pubnub.publish(
            {
                //channel: publishChannel,
                channel: frontendChannel,
                message: {
                    eventname: "qrcode",
                    show: true,
                },
            },
            (status, response) => {
                console.log("Status Pubnub ===> ", status);
                console.log("response Pubnub ====> ", response);
            }
        );
    } else if (value == 0) {
        pubnub.publish(
            {
                //channel: publishChannel,
                channel: frontendChannel,
                message: {
                    eventname: "qrcode",
                    show: false,
                },
            },
            (status, response) => {
                console.log("Status Pubnub ===> ", status);
                console.log("response Pubnub ====> ", response);
            }
        );
    }
    LED2.writeSync(value);
});

// process.on("SIGINT", (_) => {
//   LED2.unexport();
//   button.unexport();
// });

//==============================================================================================//

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
    console.log("Data from port Device=====>", data);
    if (data.includes("ssid")) {
        let a = JSON.parse(data);
        console.log("wifi credetainls ===> ", a);
        console.log("ssid ==> ", a.ssid);
        let wifiname = a.ssid;
        let password = a.pass;
        wifi
            .connect({ ssid: wifiname, psk: password })
            .then(() => {
                console.log("Connected to network.");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (data.includes("Shutting Down")) {

        console.log(" ----- shutting down getting hit ---- ");
        pubnub.publish(
            {
                channel: masterChannel,
                message: {
                    mac_id :  publishChannel,
                    eventname : "shutdown",
                    status : "shutdown"
                },
            },
            (status, response) => {
                console.log("Status Pubnub ===> ", status);
            }
        );

        //exec("sudo shutdown now")
        exec("pkill -o chromium", (e, i) => {
            if (e) {
                console.log("error in Shutting down ===> ", e);
            }
            exec("sudo shutdown now");
        });
    }

    if (data.includes("check_hang")) {
        blinkLED();
        // let timer = setInterval(blinkLED, 250);
        // setTimeout(() => {
        //     endBlink();
        //     clearInterval(timer);
        // }, 5000);

        // const child = exec(
        //     "ping -c 5 www.google.com",
        //     function (error, stdout, stderr) {
        //         if (error !== null) {
        //             console.log("Not available");
        //         } else {
        //             console.log("Available");
        //         }

        //         port.write("pi_ok", function (err) {
        //             if (err) {
        //                 return console.log("Error on Write: ", err.message);
        //             }
        //             console.log("message written");
        //         });
        //     }
        // );

        port.write("pi_ok", function (err) {
            if (err) {
                return console.log("Error on Write: ", err.message);
            }
            console.log("message written");
    });
    }

    if (data.includes("get_ip")) {
        console.log(" ----- get_ip getting hit ---- ");
        let IP = ip.address();
        console.log("ip =====>", IP);
        port.write(IP, function (err) {
            if (err) {
                return console.log("Error on Write: ", err.message);
            }
            console.log("message written");
        });
    }

    //========================== For MacADD  =================================//
    if (data.includes("get_mac")) {
        let a = data;
        console.log("wifi credetainls ===> ", a);
        if (fs.existsSync("./realmacadd.json")) {
            console.log("//=== macadress file exist ==//");
            let data = fs.readFileSync("./realmacadd.json", "utf-8");
            console.log("MAC id inside mac address json file ==> ", JSON.parse(data));
            let mcadd = JSON.parse(data);
            console.log("mcadd inside get_mac ===> ", mcadd);
            //==================== Mac address to write to the device ======================//
            port.write(`{\"pi_mac\":\"${mcadd[0]["macaddress"]}\"}`, function (err) {
                if (err) {
                    return console.log("Error on Write: ", err.message);
                }
                console.log("//==== mac address has been send ===//");
            });
            getChannel();
        } else {
            console.log("//============ MAcadd file doesnot exist ============= //");
            port.write('{"pi_mac":"NA"}', function (err) {
                if (err) {
                    return console.log("Error on Write: ", err.message);
                }
                console.log("//==== mac address failed ===//");
            });
        }
    }

    if (data.includes("mac_add")) {
        console.log("//============== device is asking for macadd ==========//");
        console.log(
            "mac address form the device ==> ",
            JSON.parse(data)["mac_add"]
        );
        //==== Need to convert into Base64 encoded ==========//
        console.log(
            "Base 64 encoded ==> ",
            Base64.encode(JSON.parse(data)["mac_add"])
        );
        let mcadd = Base64.encode(JSON.parse(data)["mac_add"]);

        function reverseString(str) {
            var splitString = str.split("");
            var reverseArray = splitString.reverse();
            var joinArray = reverseArray.join("");
            return joinArray;
        }
        mcadd = reverseString(mcadd);
        console.log("Reverse MAc id ==> ", mcadd);
        let realmcadd = [];
        jsonVariable = { macaddress: mcadd };
        realmcadd.push(jsonVariable);

        let mcaddFrontend = [];       //===> For 
        jsonVariable1= {macaddress : mcadd.concat("FrontEnd")}
        mcaddFrontend.push(jsonVariable1)

        //========== Generating JSON file with Mac addr BAse 64 Encoded  ======//
        fs.writeFileSync("./realmacadd.json", JSON.stringify(realmcadd), "utf-8");

        fs.writeFileSync("./frontendMac.json", JSON.stringify(mcaddFrontend), "utf-8");

        fs.writeFileSync(
            "./Saps_Rasp_Pubnub/src/macadd.json",
            JSON.stringify(mcaddFrontend),
            "utf-8"
        );
        

        //============= Generating QRCode =================================//
        var qr_code = qr.image(mcadd, { type: "png" });
        qr_code.pipe(
            require("fs").createWriteStream(
                "./Saps_Rasp_Pubnub/src/Qrcode/qrcode.png"
            )
        );
        getChannel();
    }
});



//================================== Git Code Updater ========================================//
async function forceUpdater() {
    console.log("//========================== ForceUpdater func() =========================//")
    // let versionChecker = await updater.compareVersions();
    // console.log("version Checker value ===> ", versionChecker)
    // if (versionChecker["remoteVersion"] && versionChecker.currentVersion != versionChecker.remoteVersion) {
        console.log("//=== Verisons are not same ===//")

        let data = {
            eventname : "play",
            filename : "updating",
            displaytype : "fullscreen",
            filetype : "updating"
        }
        pubnub.publish(
                {
                    channel: frontendChannel,
                    message: data,
                },
                (status, response) => {
                    console.log("Status Pubnub ===> ", status);
                }
            ); 

        console.log("Clearing timer for BurnerAd in F11 Function function");
        clearInterval(timer_burnerad);

        let updateStatus = updater.forceUpdate();

        // let updateStatus = await updater.autoUpdate();

        if(updateStatus)
        {
            //======> For updating the Frontend Screen
           let updateTimer =  setTimeout(()=>{
                if(frontendChannel)
                {
                     let data = {
                        eventname : "play",
                        filename : "updating",
                        displaytype : "fullscreen",
                        filetype : "updating"
                    }
                    pubnub.publish(
                            {
                                channel: frontendChannel,
                                message: data,
                            },
                            (status, response) => {
                                console.log("Status Pubnub ===> ", status);
                            }
                        ); 

                        pubnub.publish(
                            {
                                channel: masterChannel,
                                message: {
                                    mac_id :  publishChannel,
                                    eventname : "updateresp",
                                    status : "started"
                                },
                            },
                            (status, response) => {
                                console.log("Status Pubnub ===> ", status);
                            }
                        );    
                 }
            clearTimeout(updateTimer);
            },25000)
           
            

            let timer = setTimeout(() => {
                const child = spawn('npm i', {
                    stdio: 'inherit',
                    shell: true,
                    cwd: './'
                })
    
                child.on('close', (code) => {               
                    console.log(`Backend Node modules ===>  ${code}`);
                let child2 = spawn('npm i', {
                        stdio: 'inherit',
                        shell: true,
                        cwd: './Saps_Rasp_Pubnub'
                    })
    
                child2.on('close', (code)=>{
                    
                    console.log("//==== Fronted Node Modules ===//")

                    execShellCommand().then(() => {
                        exec("pkill -f firefox")
                        setTimeout(()=>{
                            console.log("//=============== REBOOTING ================//")
                            exec("sudo reboot");
                        },50000)
                    });                    
                    // exec("pkill -f firefox")
                    // setTimeout(()=>{
                    //     console.log("//=============== REBOOTING ================//")
                    //     exec("sudo reboot");
                    // },10000)
                })    
                });
                console.log("//====== Timer Completed =====//")
                clearTimeout(timer)
            }, 5*60000)    ///===> timer for reboot ==>  5 min
        }
    // }
    // else if (versionChecker.upToDate == true) {
    //     console.log("//==== Version is UpDated ===//")
    //     return;
    // }
}



async function autoUpdater() {
    console.log("//========================== ForceUpdater func() =========================//")
    let versionChecker = await updater.compareVersions();
    console.log("version Checker value ===> ", versionChecker)
    if (versionChecker["remoteVersion"] && versionChecker.currentVersion != versionChecker.remoteVersion) {
        console.log("//=== Verisons are not same ===//")

        console.log("Clearing timer for BurnerAd in F11 Function function");
        clearInterval(timer_burnerad);

        //updater.forceUpdate();

        let updateStatus = await updater.autoUpdate();

        if(updateStatus)
        {
            //======> For updating the Frontend Screen
           let updateTimer =  setTimeout(()=>{
                if(frontendChannel)
                {
                    let data = {
                        eventname : "play",
                        filename : "updating",
                        displaytype : "fullscreen",
                        filetype : "updating"
                    }
                    pubnub.publish(
                            {
                                channel: frontendChannel,
                                message: data,
                            },
                            (status, response) => {
                                console.log("Status Pubnub ===> ", status);
                            }
                        ); 

                        pubnub.publish(
                            {
                                channel: masterChannel,
                                message: {
                                    mac_id :  publishChannel,
                                    eventname : "updateresp",
                                    status : "started"
                                },
                            },
                            (status, response) => {
                                console.log("Status Pubnub ===> ", status);
                            }
                        );    
                 }
            clearTimeout(updateTimer);
            },25000)
           
            

            let timer = setTimeout(() => {
                const child = spawn('npm i', {
                    stdio: 'inherit',
                    shell: true,
                    cwd: './'
                })
    
                child.on('close', (code) => {               
                    console.log(`Backend Node modules ===>  ${code}`);
                let child2 = spawn('npm i', {
                        stdio: 'inherit',
                        shell: true,
                        cwd: './Saps_Rasp_Pubnub'
                    })
    
                child2.on('close', (code)=>{
                    
                    console.log("//==== Fronted Node Modules ===//")

                    execShellCommand().then(() => {
                        exec("pkill -f firefox")
                        setTimeout(()=>{
                            console.log("//=============== REBOOTING ================//")
                            exec("sudo reboot");
                        },50000)
                    });                    
                    // exec("pkill -f firefox")
                    // setTimeout(()=>{
                    //     console.log("//=============== REBOOTING ================//")
                    //     exec("sudo reboot");
                    // },10000)
                })    
                });
                console.log("//====== Timer Completed =====//")
                clearTimeout(timer)
            }, 5*60000)    ///===> timer for reboot ==>  5 min
        }
    }
    else if (versionChecker.upToDate == true) {
        console.log("//==== Version is UpDated ===//")
        return;
    }
}


function execShellCommand() {
    return new Promise((resolve, reject) => {
     exec("sudo apt-get install fswebcam", (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }

let scheduleJob;    

async function autoUpdateTimer() {
 console.log("//====================== autoUpdateTimer() ======================  //")
 scheduleJob = schedule.scheduleJob('0 0 4 20 * *',async()=>{
 console.log("//== scheduleJob inside autoUpdateTime ==//")
 let versionChecker = await updater.compareVersions();
 console.log("version Checker value ===> ", versionChecker)
 if (versionChecker["remoteVersion"] && versionChecker.currentVersion != versionChecker.remoteVersion) {
     console.log("//=== Verisons are not same ===//")

     console.log("Clearing timer for BurnerAd in F11 Function function");
     clearInterval(timer_burnerad);

     updater.forceUpdate();

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

         child2.on('close', (code)=>{
            exec("pkill -f firefox")
             setTimeout(()=>{
                 exec("sudo reboot");
             },5000)
         })    
         });
         console.log("//====== Timer Completed =====//")
         clearTimeout(timer)
     }, 300000)
 }
 else if (versionChecker.upToDate == true) {
     console.log("//==== Version is UpDated ===//")
     return;
 }

 })
}



