import Display1screen from "./components/Displays/Display1screen";
import Display2screens from "./components/Displays/Display2screens";
import Display4screens from "./components/Displays/Display4screens";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { VideoContext } from "./Context/VideoContext";
import qrcode from "./Images/qrcode.png";
import navbaricon from "./Images/navbaricon.png";
import SapsPurple from "./Images/SapsPurple.jpg";
import { FETCH_URL } from "./fetchIp";
import macadd from "./macadd.json";
import { Typography } from "@mui/material";
//============================== PUBNUB Initialization ===================================//
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";

const pubnub = new PubNub({
  publishKey: "pub-c-ee8d5114-572e-40bd-bb92-6b00b09fc202",
  subscribeKey: "sub-c-6c7df15a-c787-11ec-8c08-82b465a2b170",
  uuid: PubNub.generateUUID(),
});

//let DeviceID = "Device 2"
let DeviceID;

//====================================================================================//
function App() {
  const [channels, setChannels] = useState([]);
  const [socket, setSocket] = useState(null);

  const [videosdata, setVideosdata] = useState(null);
  const [displaytype, setDisplaytype] = useState(null);

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
  const [videotag, setVideotag] = useState(null);
  const [videotag1, setVideotag1] = useState(null);
  const [videotag2, setVideotag2] = useState(null);
  const [videotag3, setVideotag3] = useState(null);

  const [online, setOnline] = useState(null);
  const [sensorval, setSensorval] = useState(true);
  const [playmode, setPlaymode] = useState(false);

  const handleMessage = (event) => {
    const message = event.message;
    console.log("event message ==> ", message);
  };

  useEffect(() => {
    if (channels.length > 0) {
      pubnub.addListener({
        message: handleMessage,
      });
      pubnub.subscribe({ channels });
      console.log("chanlels aary ==>", channels);
    }
  }, [channels]);

  useEffect(() => {
    setInterval(() => {
      if (navigator.onLine == true) {
        setOnline(true);
      } else {
        setOnline(false);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    // const skt = io("https://saps.one:8000", {
    //   query: { displayId: "Device 2", deviceType: "pi" },
    // });

    if (macadd[0] && macadd[0].macaddress) {
      DeviceID = macadd[0] && macadd[0].macaddress;
    }
    console.log("Device Mac id ==> ", DeviceID);
    const skt = io(FETCH_URL, {
      query: { displayId: macadd[0].macaddress, deviceType: "pi" },
    });

    //========== Setting Channel to Pubnub =============//
    setChannels([...channels, macadd[0].macaddress]);

    skt.on("playvideo", (message) => {
      //  console.log("Video data inside playvideo ====> " , message.videoname )
      //  console.log("video link coming from backend =====> " , message.videolink )
      //  console.log("display type coming from backend =====> " , message.displaytype )
      //  console.log("display part comming from backend ===> " , message.displaypart )
      setDisplaytype(message.displaytype); //-> For display will be one type only

      if (message.displaytype == "fullscreen") {
        console.log("yes desiplaymode == fullscrenn");
        setFullscreenvideostatus(true);
        setVideolink(message.videolink);
        setFullscreenvideotag(message.videoname);
      } else if (message.displaypart === "part1") {
        setVideoStatus1(true);
        setVideolink(message.videolink);
        setVideotag(message.videoname);
      } else if (message.displaypart === "part2") {
        setVideoStatus2(true);
        setVideolink1(message.videolink);
        setVideotag1(message.videoname);
      } else if (message.displaypart === "part3") {
        setVideoStatus3(true);
        setVideolink2(message.videolink);
        setVideotag2(message.videoname);
      } else if (message.displaypart === "part4") {
        setVideoStatus4(true);
        setVideolink3(message.videolink);
        setVideotag3(message.videoname);
      }
    });

    //-------------------------  STOP VIDEO SOCKET IO-----------------------------------//
    skt.on("stopvideo", (message) => {
      //console.log("Video data inside playvideo ====> " , message.videoname)
      //console.log("display type coming from backend =====> " , message.displaytype )
      //console.log("display part coming from backend =====> " , message.displaypart)
      //setDisplaytype(message.displaytype)
      if (message.displaytype == "fullscreen") {
        console.log("lol we are inside fullscreen inside stop video ");
        setDisplaytype(null);
        setFullscreenvideostatus(false);
        setVideolink(null);
        setFullscreenvideotag(null);
      }

      if (message.displaytype == "quadrant") {
        console.log(" == yeahhhhh we are inside quadrant displat type ==");
        //setDisplaytype(message.displaytype)

        if (message.displaypart == "part1") {
          setVideoStatus1(false);
          setVideolink(null);
          setVideotag(null);
        }
        if (message.displaypart == "part2") {
          setVideoStatus2(false);
          setVideolink1(null);
          setVideotag1(null);
        }
        if (message.displaypart == "part3") {
          setVideoStatus3(false);
          setVideolink2(null);
          setVideotag2(null);
        }
        if (message.displaypart == "part4") {
          setVideoStatus4(false);
          setVideolink3(null);
          setVideotag3(null);
        }
      }
    });

    skt.on("download_video", (message) => {
      console.log("download video ====> ", message);
      let videoname = message;
      let downloadurl = `https://blockstorage.saps.one/${message}`;
      console.log("downloadurl =====> ", downloadurl);
      setTimeout(() => {
        // saveFile(`https://blockstorage.saps.one/${videoname}`)
        saveFile(downloadurl);
      }, 2000);
    });

    //============================ Sensor Detection =================================//
    skt.on("sensorstatus", (message) => {
      console.log("//======= SensorStatus ==============//");
      console.log("Sensor value ===> ", typeof message, message);
      setSensorval(message);
    });

    skt.on("playmodestatus", (message) => {
      console.log("//======= SensorStatus ==============//");
      getplaymodestatus();
    });
  }, [setSocket]);

  function saveFile(url) {
    // Get file name from url.
    console.log("URL from parameters ===> ", url);
    var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      a.download = filename; // Set the file name.
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      //delete a;
    };
    xhr.open("GET", url);
    xhr.send();
  }

  //=====> TO get the palymode status
  useEffect(() => {
    getplaymodestatus();
  }, []);

  const getplaymodestatus = async () => {
    try {
      const response = await fetch(`${FETCH_URL}/getplaymodestatus`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devicename: "Device 2",
        }),
      });

      let res = await response.json();
      if (response.ok) {
        console.log("res data ==> ", res.msg.playmode);
        setPlaymode(res.msg.playmode);
      } else {
        console.log("//== Error in Get play mode Status ==//");
      }
    } catch (e) {
      console.log("Error inside getolaymode status");
      //alert(e);
    }
  };

  // const downloadHandler = async (video) => {
  //   console.log("video name inside download handler ===> ", video);
  //   fetch(`${FETCH_URL}/downloadvideo`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/mp4",
  //       // Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ videoext: video }),
  //   })
  //     .then((res) => res.blob())
  //     .then((file) => {
  //       console.log("data after the =>>", file);
  //       const url = window.URL.createObjectURL(
  //         new Blob([file], {
  //           type: "application/mp4",
  //         })
  //       );
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", video);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.log("hellllo error ======>", error);
  //     });
  // };

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
          {playmode == true ? (
            <>
              {sensorval == true ? (
                <>
                  <VideoContext.Provider value={{ displaytype }}>
                    {displaytype != null ? (
                      <>
                        {displaytype == "fullscreen" &&
                          //videoStatus1 == true
                          fullscreenvideostatus && (
                            <Display1screen
                              video={videolink}
                              video1status={fullscreenvideostatus}
                              //videoStatus1}
                              videoName={fullscreenvideotag}
                            />
                          )}

                        {displaytype == "quadrant" && (
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
                        )}
                      </>
                    ) : (
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
                              width: "300px",
                              height: "100px",
                              marginBottom: "5px",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              borderRadius: "10px",
                            }}
                            src={SapsPurple}
                          />
                          <h1>NO INPUT SELECTED</h1>
                        </div>
                      </>
                    )}
                  </VideoContext.Provider>
                </>
              ) : (
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
                      style={{
                        width: "300px",
                        height: "100px",
                        marginBottom: "5px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "10px",
                      }}
                      src={SapsPurple}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {sensorval == false ? (
                <>
                  <VideoContext.Provider value={{ displaytype }}>
                    {displaytype != null ? (
                      <>
                        {displaytype == "fullscreen" &&
                          //videoStatus1 == true
                          fullscreenvideostatus && (
                            <Display1screen
                              video={videolink}
                              video1status={fullscreenvideostatus}
                              //videoStatus1}
                              videoName={fullscreenvideotag}
                            />
                          )}

                        {displaytype == "quadrant" && (
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
                        )}
                      </>
                    ) : (
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
                              width: "300px",
                              height: "100px",
                              marginBottom: "5px",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              borderRadius: "10px",
                            }}
                            src={SapsPurple}
                          />
                          <h1>NO INPUT SELECTED</h1>
                        </div>
                      </>
                    )}
                  </VideoContext.Provider>
                </>
              ) : (
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
                      style={{
                        width: "300px",
                        height: "100px",
                        marginBottom: "5px",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "10px",
                      }}
                      src={SapsPurple}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
