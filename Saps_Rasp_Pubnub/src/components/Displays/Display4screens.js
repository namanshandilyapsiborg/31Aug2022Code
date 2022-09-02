import React, { useState } from "react";
//import surfing_720p from "../videos/surfing_720p.mp4";
import "../../assets/styles/Display4styling.css";
import { useEffect } from "react";
import { useVideo } from "../../Context/VideoContext";
import SapsPurple from "../../Images/SapsPurple.jpg";

export default function Display4screens(props) {
  const { displaytype } = useVideo();
  //console.log("displaytype value from VideoContext Quadrant mode inside ===> " , displaytype)

  const [videolink, setVideolink] = useState("");
  const [videolink2, setVideolink1] = useState("");
  const [videolink3, setVideolink3] = useState("");
  const [videolink4, setVideolink4] = useState("");

  const [video1Status, setVideo1status] = useState(false);
  const [video2Status, setVideo2status] = useState(false);
  const [video3Status, setVideo3status] = useState(false);
  const [video4Status, setVideo4status] = useState(false);

  const [videotag, setVideotag] = useState(null);
  const [videotag1, setVideotag1] = useState(null);
  const [videotag2, setVideotag2] = useState(null);
  const [videotag3, setVideotag3] = useState(null);

  useEffect(() => {
    //setVideolink(surfing_720p)
    // console.log("Display scren 1 inside Display4Screens  ===========> ",props.video)
    // console.log(" video status inside Display4Screens  ===> " , props.video1status)
    if (props.videoname != null) {
      //console.log("video0name ===> " , props.videoname)
      setVideolink(props.video);
      setVideo1status(props.video1status);
      setVideotag(props.videoname);
    }

    if (props.videoname1 != "") {
      // console.log("video0name ===> " , props.videoname1)
      setVideolink1(props.video1);
      setVideo2status(props.video2status);
      setVideotag1(props.videoname1);
    }
    if (props.videoname2 != "") {
      //console.log("video0name ===> " , props.videoname2)
      setVideolink3(props.video2);
      setVideo3status(props.video3status);
      setVideotag2(props.videoname2);
    }
    if (props.videoname3 != "") {
      //console.log("videoname2 ===> " , props.videoname3)
      setVideolink4(props.video3);
      setVideo4status(props.video4status);
      setVideotag3(props.videoname3);
    }

    //   if(props.video != "")
    //   {
    //      console.log("video0name ===> " , props.videoname)
    //      setVideolink(props.video)
    //      setVideo1status(props.video1status)
    //      setVideotag(props.videoname)
    //   }
    //   if(props.video1 != "")
    //   {
    //      console.log("video0name ===> " , props.videoname1)
    //      setVideolink1(props.video1)
    //      setVideo2status(props.video2status)
    //      setVideotag1(props.videoname1)
    //   }
    //   if(props.video2 != "")
    //   {
    //    console.log("video0name ===> " , props.videoname2)
    //      setVideolink3(props.video2)
    //      setVideo3status(props.video3status)
    //      setVideotag2(props.videoname2)
    //   }
    //   if(props.video3 != "")
    //   {
    //    console.log("video0name ===> " , props.videoname3)
    //      setVideolink4(props.video3)
    //      setVideo4status(props.video4status)
    //      setVideotag3(props.videoname3)
    //   }
  }, [props]);

  return (
    <>
      <div style={{ width: "100%", height: "100%", padding: "0px" }}>
        <div className="part1">
          {video1Status && video1Status == true && videotag != null ? (
            <>
              <div className="divs-wrapper">
                <video
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  controls
                  muted
                  loop
                  autoPlay={true}
                  //src={"http://localhost:8000/videos/Cable_Car.mp4"}
                  //src={videolink}
                  src={require(`../../Videos/${videotag}.mp4`)}
                  type="video/mp4"
                ></video>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  style={{
                    width: "200px",
                    height: "70px",
                    marginBottom: "5px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "10px",
                  }}
                  src={SapsPurple}
                />
                <h1 style={{ fontSize: "1rem" }}>No Video Source</h1>
              </div>
            </>
          )}
        </div>

        {/* ----------------------- PART 2 ------------------------ */}
        <div className="part2">
          {video2Status && video2Status == true && videotag1 != null ? (
            <>
              <div className="divs-wrapper">
                <video
                  controls
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  muted
                  loop
                  autoPlay={true}
                  //src={videolink2}
                  src={require(`../../Videos/${videotag1}.mp4`)}
                  type="video/mp4"
                ></video>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  style={{
                    width: "200px",
                    height: "70px",
                    marginBottom: "5px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "10px",
                  }}
                  src={SapsPurple}
                />
                <h1 style={{ fontSize: "1rem" }}>No Video Source</h1>
              </div>
            </>
          )}
        </div>

        {/* ---------------  PArt 3 ---------------- */}
        <div className="part3">
          {video3Status && video3Status == true && videotag2 != null ? (
            <>
              <div className="divs-wrapper">
                <video
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  controls
                  muted
                  loop
                  autoPlay={true}
                  //src={videolink3}
                  src={require(`../../Videos/${videotag2}.mp4`)}
                  type="video/mp4"
                ></video>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  style={{
                    width: "200px",
                    height: "70px",
                    marginBottom: "5px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "10px",
                  }}
                  src={SapsPurple}
                />
                <h1 style={{ fontSize: "1rem" }}>No Video Source</h1>
              </div>
            </>
          )}
        </div>

        {/* ----------------------- PART 4 ----------------------- */}

        <div className="part4">
          {video4Status && video4Status == true && videotag3 != null ? (
            <>
              <div className="divs-wrapper">
                <video
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  controls
                  muted
                  loop
                  autoPlay={true}
                  //src={videolink4}
                  src={require(`../../Videos/${videotag3}.mp4`)}
                  type="video/mp4"
                ></video>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  style={{
                    width: "200px",
                    height: "70px",
                    marginBottom: "5px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "10px",
                  }}
                  src={SapsPurple}
                />
                <h1 style={{ fontSize: "1rem" }}>No Video Source</h1>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
