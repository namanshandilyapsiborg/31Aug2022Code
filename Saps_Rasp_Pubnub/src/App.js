import Display1screen from "./components/Displays/Display1screen";
import Display2screens from "./components/Displays/Display2screens";
import Display4screens from "./components/Displays/Display4screens";
import { io } from "socket.io-client";
import { useEffect, useState , useRef } from "react";
import { VideoContext } from "./Context/VideoContext";
import qrcode from "./Images/qrcode.png";
import navbaricon from "./Images/navbaricon.png";
// import SapsPurple from "./Images/SapsPurple.jpg";
import SapsPurple from "./Images/PostMyAddLogo.png";
import { FETCH_URL } from "./fetchIp";
import macadd from "./macadd.json";
import { Typography } from "@mui/material";
//============================== PUBNUB Initialization ===================================//
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";

const pubnub = new PubNub({
  publishKey: "pub-c-ee8d5114-572e-40bd-bb92-6b00b09fc202",
  subscribeKey: "sub-c-6c7df15a-c787-11ec-8c08-82b465a2b170",
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
  const [imagename, setImagename] = useState("");
  const [videotag, setVideotag] = useState(null);
  const [videotag1, setVideotag1] = useState(null);
  const [videotag2, setVideotag2] = useState(null);
  const [videotag3, setVideotag3] = useState(null);
  const [mutedStatus , setMutedStatus] = useState(false);

  const [online, setOnline] = useState(null);
  const [sensorval, setSensorval] = useState(true);
  const [playmode, setPlaymode] = useState(false);
  const vidRef = useRef();

  useEffect(() => {
    setInterval(() => {
      if (navigator.onLine == true) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    }, 10000);
    if(filetype)
    {
      vidRef.current.play();
    }
    

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
    if (message.eventname == "play") {
      if (message.displaytype == "fullscreen") {
        if (message.filetype == "image/jpeg") {
          console.log("Image name ==> ", message.filetype);
          setImagename(message.filename);
        } else if (message.filetype == "video/mp4") {
          console.log("Video name ==> ", message.filetype);
          setVideoname(message.filename);
        }
        setDisplaytype(message.displaytype); //==> "fullscreen",  "quadrant"
        setFullscreenvideostatus(true);
        setFiletype(message.filetype);
        //setFullscreenvideotag(message.videoname); //==> Beach_1080p , Hello
        //setFullscreenvideotag(message.filename);
      }
    } else if (message.eventname == "stop") {
      if (message.displaytype == "fullscreen") {
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
    <>
      {online === false ? (
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
              style={{ width: "300px", height: "300px", marginBottom: "10px" }}
              src={qrcode}
            />
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              Steps To Connect :{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              1. Turn ON your Mobile WiFi{" "}
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              2. Connect Your Mobile To Device
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              3. Now Scan the Upper QR Code
            </Typography>
            <Typography style={{ color: "white", marginBottom: "10px" }}>
              4. Now Enter Credential of Your WiFi
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
                  }}
                >
                  <img
                    style={{
                      width: "300px",
                      height: "300px",
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
                {displaytype != null ? (
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
                                position: "absolute",
                                top: "0",
                                left: "0",
                              }}
                            >
                              {filetype && filetype == "video/mp4" && (
                                <>
                                  <video
                                    style={{
                                      backgroundColor: "red",
                                      objectFit: "cover",
                                      minHeight: "100%",
                                      minWidth: "100%",
                                    }}
                                    controls
                                    loop
                                    //autoPlay={true}
                                    value={vidRef}
                                    autoPlay={true}
                                    muted={false}
                                    //src={"http://localhost:8000/videos/surfing_720p.mp4"}
                                    //src ={videolink}
                                    src={require(`./Videos/${videoname}.mp4`)}
                                    type="video/mp4"
                                  ></video>
                                </>
                              )}

                              {filetype && filetype == "image/jpeg" ? (
                                <img
                                  style={{
                                    objectFit: "cover",
                                    minHeight: "100%",
                                    minWidth: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                  }}
                                  // src={SapsPurple}
                                  src={require(`./Images/${imagename}.jpg`)}
                                />
                              ) : (
                                <div>hello</div>
                              )}

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
                                height: "100vh",
                                width: "100%",
                                color: "white",
                                backgroundColor: "black",
                                fontSize: "0.8rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                style={{
                                  width: "700px",
                                  height: "250px",
                                  marginBottom: "5px",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  borderRadius: "10px",
                                }}
                                src={SapsPurple}
                              />
                              <h1>NO VIDEO SOURCE</h1>
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
                        height: "100vh",
                        width: "100%",
                        color: "white",
                        backgroundColor: "black",
                        fontSize: "0.8rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "700px",
                          height: "250px",
                          marginBottom: "5px",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "10px",
                        }}
                        src={SapsPurple}
                      />
                      <h1>NO VIDEO SOURCE</h1>
                    </div>
                  </>
                )}
              </>
            )}
          </VideoContext.Provider>
        </>
      )}
    </>
  );
}

export default App;
