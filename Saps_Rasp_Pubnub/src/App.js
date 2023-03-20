import Display1screen from "./components/Displays/Display1screen";
import Display2screens from "./components/Displays/Display2screens";
import Display4screens from "./components/Displays/Display4screens";
import { io } from "socket.io-client";
import { useEffect, useState , useRef } from "react";
import { VideoContext } from "./Context/VideoContext";
import qrcode from "./Images/qrcode.png";

import camera from "./Images/camera.png";
import nocamera from "./Images/nocamera.png";

import navbaricon from "./Images/navbaricon.png";
// import SapsPurple from "./Images/SapsPurple.jpg";
// import SapsPurple from "./Images/PostMyAddLogo.png";
import SapsPurple from "./Images/skai_logo_psd.png";
//===> For update screen image
import { FETCH_URL } from "./fetchIp";
import macadd from "./macadd.json";
import { Typography } from "@mui/material";
//============================== PUBNUB Initialization ===================================//
import PubNub from "pubnub";
// import ReactPlayer from "react-player/youtube";
import ReactPlayer from "react-player/lazy";
import { PubNubProvider, usePubNub } from "pubnub-react";
//let macadd = "1234"
const pubnub = new PubNub({
  publishKey: "pub-c-90d5fa5c-df63-46c7-b5f2-2d6ad4efd775",
  subscribeKey: "sub-c-81c16c55-f391-4f72-8e57-2d9e052a360c",

  // publishKey: "pub-c-1a0b4b54-d0f4-4493-86d8-fc2d56a06f55",
  // subscribeKey: "sub-c-3df591b2-a923-460c-8078-2ab79fea5016",

    restore: true,
  presenceTimeout: 20,
  autoNetworkDetection : true,
  userId: PubNub.generateUUID(),
  
});

//let DeviceID = "Device 2"
let DeviceID;

//====================================================================================//
function App() {
  const [channels, setChannels] = useState([macadd[0].macaddress]);
  const [socket, setSocket] = useState(null);

  const [videosdata, setVideosdata] = useState(null);
  const [displaytype, setDisplaytype] = useState(null);
  const [filetype, setFiletype] = useState("");
  //=========> To show code
  const [showqrcode, setShowqrcode] = useState(false);

  const [fullscreenvideostatus, setFullscreenvideostatus] = useState(false);
  const [videoStatus1, setVideoStatus1] = useState(false);
  const [videoStatus2, setVideoStatus2] = useState(false);
  const [videoStatus3, setVideoStatus3] = useState(false);
  const [videoStatus4, setVideoStatus4] = useState(false);

  const [videolink, setVideolink] = useState(null);
  const [videolink1, setVideolink1] = useState(null);
  const [videolink2, setVideolink2] = useState(null);
  const [videolink3, setVideolink3] = useState(null);

  const [fullscreenvideotag, setFullscreenvideotag] = useState(null);
  const [videoname, setVideoname] = useState("");
  const [videonamewebm, setVideonamewebm] = useState("");
  const [burnerVideoname, setBurnerVideoname] = useState("");
  const [imagename, setImagename] = useState("");
  const [videotag, setVideotag] = useState(null);
  const [videotag1, setVideotag1] = useState(null);
  const [videotag2, setVideotag2] = useState(null);
  const [videotag3, setVideotag3] = useState(null);
  const [mutedStatus , setMutedStatus] = useState(false);

  const [online, setOnline] = useState(null);
  const [sensorval, setSensorval] = useState(true);
  const [playmode, setPlaymode] = useState(false);
  const [cameraC, setCameraC] = useState(false);
  const vidRef = useRef();

  useEffect(() => {
    setInterval(() => {
      if (navigator.onLine == true) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    }, 10000);
  }, [filetype]);

  useEffect(() => {
    if (channels.length > 0) {
      pubnub.addListener({
        status: function (statusEvent) {
          console.log("statusEvent1 ===> ", statusEvent.category);
        if (statusEvent.category === "PNNetworkDownCategory") {
          console.log("PNNetworkDownCategory ===> ", statusEvent.category);
          pubnub.reconnect()
        }
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("statusEvent ===> ", statusEvent.category);
        }else {
          console.log("//== Connection failed ===//");
          pubnub.reconnect()
        }
        },
        message: handleMessage,
      });
      pubnub.subscribe({ channels });
      console.log("Channels Array ==>", channels);
    }
  }, [channels]);

  const handleMessage = (event) => {
    const message = event.message;
    console.log("event message ==> ", message);
    if (message.cameraEvent) {
      setCameraC(message.webcam)
    }
    if (message.eventname == "play") {
      if (message.displaytype == "fullscreen") {
        if (message.filetype == "image/jpeg") {
          console.log("Image name ==> ", message.filetype);
          setImagename(message.filename);
        } else if (message.filetype == "video/mp4") {
          console.log("Video name ==> ", message.filetype);
          setVideoname(message.filename);
        }
        else if (message.filetype == "video/webm") {
          console.log("Video name ==> ", message.filetype);
          setVideonamewebm(message.filename);
        }        
        else if (message.filetype == "url") {
          console.log("Video link ==> ", message.filetype);
          setVideoname(message.filename);
        }

        setDisplaytype(message.displaytype); //==> "fullscreen",  "quadrant"
        setFullscreenvideostatus(true);
        setFiletype(message.filetype);
        //setFullscreenvideotag(message.videoname); //==> Beach_1080p , Hello
        //setFullscreenvideotag(message.filename);
      }
    } else if (message.eventname == "stop") {
      if(message.filetype == "burnerad"){
        console.log("file type burneraddddddddddddddddddddddd");
        setBurnerVideoname(message.filename);
        setDisplaytype(message.displaytype); //==> "fullscreen",  "quadrant"
        setFullscreenvideostatus(true);
        setFiletype(message.filetype);
      }
      else {
        setDisplaytype(null);
        setFullscreenvideostatus(false);
        setVideolink("");
        setImagename("");
        setVideoname("");
        //setFullscreenvideotag("");
        setFiletype("");
      }
    }
    if (message.eventname == "qrcode") {
      if (message.show == true) {
        setShowqrcode(true);
      } else if (message.show == false) {
        setShowqrcode(false);
      }
    }
    // if (message.eventname == "download_video") {
    //   let downloadurl = `https://blockstorage.saps.one/${message.videoname}`;
    //   console.log("downloadurl =====> ", downloadurl);
    //   if (downloadurl) {
    //     setTimeout(() => {
    //       saveFile(downloadurl);
    //     }, 2000);
    //   }
    // }
  };



  return (
    <div  style={{ display: "flex", width: "100%"}}>
      <div style={{position: "absolute",top: "10px", right: "10px"}}>  
        { cameraC ?
          <img src={camera}  /> :
          <img src={nocamera}  />
        }
      </div>  

      {
      online === false ? (
        <>
          <div
            style={{
              height: "100vh",
              width: "100%",
              backgroundColor: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "500px", height: "500px", marginBottom: "10px" }}
              src={qrcode}
            />
            <Typography style={{ color: "white", marginBottom: "15px" }}>
              NOT CONNECTED TO INTERNET{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "25px" }}>
              STEPS TO CONNECT TO WiFi{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              1. Press & Hold Button 4 On Device For 3 Seconds{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              2. Now Turn ON Your Mobile WiFi & Scan Your Device{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              3. Now Connect Your Mobile To Device
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              4. Now Scan the Upper QR Code And Open The URL Provided Into The Browser
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              5. Now Enter Credential of Your WiFi, And Press Connect
            </Typography>
          </div>
        </>
      ) : (
        <>
          <VideoContext.Provider value={{ displaytype }}>
            {showqrcode == true ? (
              <>
                <div
                  style={{
                    height: "100vh",
                    width: "100%",
                    color: "white",
                    backgroundColor: "black",
                    fontSize: "0.8rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow : "hidden"
                  }}
                >
                  <img
                    style={{
                      width: "500px",
                      height: "500px",
                      marginBottom: "5px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      borderRadius: "10px",
                    }}
                    src={
                      showqrcode == true
                        ? require(`./Qrcode/qrcode.png`)
                        : SapsPurple
                    }
                  />
                  <h1>SCAN THE QR CODE TO ADD DEVICE</h1>
                </div>
              </>
            ) : (
              <>
                {
                displaytype != null ? (
                  <>
                    {displaytype == "fullscreen" && fullscreenvideostatus && (
                      // <Display1screen
                      //   video={videolink}
                      //   video1status={fullscreenvideostatus}
                      //   fileName={fullscreenvideotag}
                      //   filenametype={filetype}
                      // />
                      <>
                        {fullscreenvideostatus == true &&
                        // fullscreenvideotag != null &&
                        filetype != null ? (
                          <>
                            <div
                              style={{
                                height: "100%",
                                width: "100%",
                                //backgroundColor : "red",
                                // position: "absolute",
                                top: "0",
                                left: "0",
                              }}
                            >
                              {filetype && filetype == "video/mp4" && videoname &&(
                                <>
                                  <video
                                    style={{
                                      // backgroundColor: "red",
                                      objectFit: "contain",
                                      minHeight: "100%",
                                      minWidth: "100%",
                                      height: "100%",
                                      width: "100%",
                                    }}
                                    controls
                                    loop
                                    //value={vidRef}
                                    autoPlay
                                    muted={true}
                                    //muted={false}
                                    //src={"http://localhost:8000/videos/surfing_720p.mp4"}
                                    src={require(`./Videos/${videoname}.mp4`)}
                                    type="video/mp4"
                                  ></video>
                                </>
                              )}



                              {filetype && filetype == "video/webm" && videonamewebm &&(
                                <>
                                  <video
                                    style={{
                                      // backgroundColor: "red",
                                      objectFit: "contain",
                                      minHeight: "100%",
                                      minWidth: "100%",
                                      height: "100%",
                                      width: "100%",
                                    }}
                                    controls
                                    loop
                                    //value={vidRef}
                                    autoPlay
                                    muted={true}
                                    //muted={false}
                                    //src={"http://localhost:8000/videos/surfing_720p.mp4"}
                                    src={require(`./Videos/${videonamewebm}.webm`)}
                                    type="video/webm"
                                  ></video>
                                </>
                              )}


                              {filetype && filetype == "image/jpeg" && imagename &&(
                                <img
                                  style={{
                                    objectFit: "contain",
                                    minHeight: "100%",
                                    minWidth: "100%",
                                    height: "100%",
                                    width: "100%",
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                  }}
                                  // src={SapsPurple}
                                  src={require(`./images_ad/${imagename}.jpg`)}
                                />
                              )}

                              {filetype && filetype == "url" && (
                               <ReactPlayer
                               playing
                               width={"100%"}
                               height={"100vh"}
                               //url="https://www.youtube.com/watch?v=668nUCeBHyY"
                               url={videoname && videoname}
                               muted={true}
                               autoplay={true}
                               loop={true}
                             />
                              )}

                              {/* ==================== For Loading ============== */}
                              {filetype && filetype == "updating" && (
                               <>
                               <div
                                 style={{
                                   height: "100vh",
                                   width: "100%",
                                   color: "white",
                                   backgroundColor: "black",
                                   fontSize: "2rem",
                                   display: "flex",
                                   flexDirection: "column",
                                   justifyContent: "center",
                                   alignItems: "center",
                                 }}
                               >
                                 <img
                                   style={{
                                     width: "100%",
                                     height: "100vh",
                                     marginBottom: "5px",
                                     backgroundSize: "cover",
                                     backgroundPosition: "center",
                                     backgroundRepeat: "no-repeat",
                                     borderRadius: "10px",
                                   }}
                                   src={require("./Images/post_my_add_update.gif")}
                                   //src={require("./Images/skai_update.gif")}
                                 />
                                 {/* <h1>UPDATING...</h1> */}
                               </div>{" "}
                             </>
                              )}

                              {/* {----------For Burner Ad----------------} */}

                              {filetype && filetype == "burnerad" && burnerVideoname && (
                                <>
                                {console.log("burned player")}
                                  <video
                                    style={{
                                      objectFit: "contain",
                                      minHeight: "100%",
                                      minWidth: "100%",
                                      height: "100%",
                                      width: "100%",
                                    }}
                                    controls
                                    loop
                                    autoPlay
                                    muted={true}
                                    src={require(`./BurnerAd/${burnerVideoname}`)}
                                    type="video/mp4"
                                  ></video>
                                </>
                              )}    

                            {/* {----------For Burner Ad----------------} */}                              

                              {/* <video
                          style={{
                            backgroundColor: "red",
                            objectFit: "cover",
                            minHeight: "100%",
                            minWidth: "100%",
                          }}
                          controls
                          muted
                          loop
                          autoPlay={true}
                          //src={"http://localhost:8000/videos/surfing_720p.mp4"}
                          //src ={videolink}
                          src={require(`../../Videos/${filename}.mp4`)}
                          type="video/mp4"
                        ></video> */}
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                objectFit: "contain",
                                height: "100vh",
                                width: "100%",
                                color: "white",
                                backgroundColor: "black",
                                fontSize: "1.2rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                style={{
                                  objectFit: "contain",
                                    minHeight: "100%",
                                    minWidth: "100%",
                                    height: "100%",
                                    width: "100%",
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                                src={SapsPurple}
                              />
                              {/* <h1>NO VIDEO SOURCE</h1> */}
                            </div>{" "}
                          </>
                        )}
                      </>
                    )}

                    {/* {displaytype == "quadrant" && (
                  <Display4screens
                    video={videolink}
                    video1={videolink1}
                    video2={videolink2}
                    video3={videolink3}
                    video1status={videoStatus1}
                    video2status={videoStatus2}
                    video3status={videoStatus3}
                    video4status={videoStatus4}
                    videoname={videotag}
                    videoname1={videotag1}
                    videoname2={videotag2}
                    videoname3={videotag3}
                  />
                )} */}
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        objectFit: "contain",
                        height: "100vh",
                        width: "100%",
                        color: "white",
                        backgroundColor: "black",
                        fontSize: "1.2rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{
                          objectFit: "contain",
                                    minHeight: "100%",
                                    minWidth: "100%",
                                    height: "100%",
                                    width: "100%",
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                        }}
                        src={SapsPurple}
                      />
                      
                      {/* <h1>NO VIDEO SOURCE</h1> */}
                    </div>
                  </>
                )}
              </>
            )}
          </VideoContext.Provider>
        </>
      )}
    </div>
  );
}



//   return (
//     <>
//       {online === false ? (
//         <>
//           <div
//             style={{
//               height: "100vh",
//               width: "100%",
//               backgroundColor: "black",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <img
//               style={{ width: "500px", height: "500px", marginBottom: "10px" }}
//               src={qrcode}
//             />
//             <Typography style={{ color: "white", marginBottom: "15px" }}>
//               NOT CONNECTED TO INTERNET{" "}
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "25px" }}>
//               STEPS TO CONNECT TO WiFi{" "}
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "10px" }}>
//               1. Press & Hold Button 4 On Device For 3 Seconds{" "}
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "10px" }}>
//               2. Now Turn ON Your Mobile WiFi & Scan Your Device{" "}
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "10px" }}>
//               3. Now Connect Your Mobile To Device
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "10px" }}>
//               4. Now Scan the Upper QR Code And Open The URL Provided Into The Browser
//             </Typography>
//             <Typography style={{ color: "white", marginBottom: "10px" }}>
//               5. Now Enter Credential of Your WiFi, And Press Connect
//             </Typography>
//           </div>
//         </>
//       ) : (
//         <>
//           <VideoContext.Provider value={{ displaytype }}>
//             {showqrcode == true ? (
//               <>
//                 <div
//                   style={{
//                     height: "100vh",
//                     width: "100%",
//                     color: "white",
//                     backgroundColor: "black",
//                     fontSize: "0.8rem",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     overflow : "hidden"
//                   }}
//                 >
//                   <img
//                     style={{
//                       width: "500px",
//                       height: "500px",
//                       marginBottom: "5px",
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                       backgroundRepeat: "no-repeat",
//                       borderRadius: "10px",
//                     }}
//                     src={
//                       showqrcode == true
//                         ? require(`./Qrcode/qrcode.png`)
//                         : SapsPurple
//                     }
//                   />
//                   <h1>SCAN THE QR CODE TO ADD DEVICE</h1>
//                 </div>
//               </>
//             ) : (
//               <>
//                 {
//                 displaytype != null ? (
//                   <>
//                     {displaytype == "fullscreen" && fullscreenvideostatus && (
//                       // <Display1screen
//                       //   video={videolink}
//                       //   video1status={fullscreenvideostatus}
//                       //   fileName={fullscreenvideotag}
//                       //   filenametype={filetype}
//                       // />
//                       <>
//                         {fullscreenvideostatus == true &&
//                         // fullscreenvideotag != null &&
//                         filetype != null ? (
//                           <>
//                             <div
//                               style={{
//                                 height: "100%",
//                                 width: "100%",
//                                 //backgroundColor : "red",
//                                 position: "absolute",
//                                 top: "0",
//                                 left: "0",
//                               }}
//                             >
//                                {filetype && filetype == "video/mp4" && videoname &&(
//                                 <>
//                                   <video
//                                     style={{
//                                       // backgroundColor: "red",
//                                       objectFit: "contain",
//                                       minHeight: "100%",
//                                       minWidth: "100%",
//                                       height: "100%",
//                                       width: "100%",
//                                       // paddingtop: "56.25%",
//                                     }}
//                                     controls
//                                     loop
//                                     //value={vidRef}
//                                     autoPlay
//                                     muted={true}
//                                     //muted={false}
//                                     //src={"http://localhost:8000/videos/surfing_720p.mp4"}
//                                     src={require(`./Videos/${videoname}.mp4`)}
//                                     type="video/mp4"
//                                   ></video>
//                                 </>
//                               )}

//                                 {filetype && filetype == "image/jpeg" && imagename &&(
//                                 <img
//                                   style={{
//                                     objectFit: "contain",
//                                     minHeight: "100%",
//                                     minWidth: "100%",
//                                     height: "100%",
//                                     width: "100%",
//                                     backgroundSize: "contain",
//                                     // backgroundPosition: "",
//                                     backgroundRepeat: "no-repeat",
//                                   }}
//                                   // src={SapsPurple}
//                                   src={require(`./images_ad/${imagename}.jpg`)}

                                  
//                                 />
//                               )}

//                               {filetype && filetype == "url" && (
//                                <ReactPlayer
//                                playing
//                                width={"100%"}
//                                height={"100vh"}
//                                //url="https://www.youtube.com/watch?v=668nUCeBHyY"
//                                url={videoname && videoname}
//                                muted={true}
//                                autoplay={true}
//                                loop={true}
//                              />
//                               )}

//                               {/* ==================== For Loading ============== */}
//                               {filetype && filetype == "updating" && (
//                                <>
//                                <div
//                                  style={{
//                                    height: "100vh",
//                                    width: "100%",
//                                    color: "white",
//                                    backgroundColor: "black",
//                                    fontSize: "2rem",
//                                    display: "flex",
//                                    flexDirection: "column",
//                                    justifyContent: "center",
//                                    alignItems: "center",
//                                  }}
//                                >
//                                  <img
//                                    style={{
//                                      width: "100%",
//                                      height: "100vh",
//                                      marginBottom: "5px",
//                                      backgroundSize: "cover",
//                                      backgroundPosition: "center",
//                                      backgroundRepeat: "no-repeat",
//                                      borderRadius: "10px",
//                                    }}
//                                    //src={require("./Images/post_my_add_update.gif")}
//                                    src={require("./Images/skai_update.gif")}
//                                  />
//                                  {/* <h1>UPDATING...</h1> */}
//                                </div>{" "}
//                              </>
//                               )}

//                               {/* {----------For Burner Ad----------------} */}

//                               {filetype && filetype == "burnerad" && burnerVideoname && (
//                                 <>
//                                 {console.log("burned player")}
//                                   <video
//                                     style={{
//                                       objectFit: "contain",
//                                       minHeight: "100%",
//                                       minWidth: "100%",
//                                       height: "100%",
//                                       width: "100%",
//                                     }}
//                                     controls
//                                     loop
//                                     autoPlay
//                                     muted={true}
//                                     src={require(`./BurnerAd/${videoname}`)}
//                                     type="video/mp4"
//                                   ></video>
//                                 </>
//                               )}    

//                             {/* {----------For Burner Ad----------------} */}

//                               {/* <video
//                           style={{
//                             backgroundColor: "red",
//                             objectFit: "cover",
//                             minHeight: "100%",
//                             minWidth: "100%",
//                           }}
//                           controls
//                           muted
//                           loop
//                           autoPlay={true}
//                           //src={"http://localhost:8000/videos/surfing_720p.mp4"}
//                           //src ={videolink}
//                           src={require(`../../Videos/${filename}.mp4`)}
//                           type="video/mp4"
//                         ></video> */}
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <div
//                               style={{
//                                 height: "100vh",
//                                 width: "100%",
//                                 color: "white",
//                                 backgroundColor: "black",
//                                 fontSize: "1.2rem",
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                               }}
//                             >
//                               <img
//                                 style={{
//                                   width: "1400px",
//                                   height: "400px",
//                                   marginBottom: "5px",
//                                   backgroundSize: "cover",
//                                   backgroundPosition: "center",
//                                   backgroundRepeat: "no-repeat",
//                                   borderRadius: "10px",
//                                 }}
//                                 src={SapsPurple}
//                               />
//                               {/* <h1>NO VIDEO SOURCE</h1> */}
//                             </div>{" "}
//                           </>
//                         )}
//                       </>
//                     )}

//                     {/* {displaytype == "quadrant" && (
//                   <Display4screens
//                     video={videolink}
//                     video1={videolink1}
//                     video2={videolink2}
//                     video3={videolink3}
//                     video1status={videoStatus1}
//                     video2status={videoStatus2}
//                     video3status={videoStatus3}
//                     video4status={videoStatus4}
//                     videoname={videotag}
//                     videoname1={videotag1}
//                     videoname2={videotag2}
//                     videoname3={videotag3}
//                   />
//                 )} */}
//                   </>
//                 ) : (
//                   <>
//                     <div
//                       style={{
//                         height: "100vh",
//                         width: "100%",
//                         color: "white",
//                         backgroundColor: "black",
//                         fontSize: "1.2rem",
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       <img
//                         style={{
//                           width: "1400px",
//                           height: "400px",
//                           marginBottom: "5px",
//                           backgroundSize: "cover",
//                           backgroundPosition: "center",
//                           backgroundRepeat: "no-repeat",
//                           borderRadius: "10px",
//                         }}
//                         src={SapsPurple}
//                       />
//                       {/* <h1>NO VIDEO SOURCE</h1> */}
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </VideoContext.Provider>
//         </>
//       )}
//     </>
//   );
// }

export default App;
