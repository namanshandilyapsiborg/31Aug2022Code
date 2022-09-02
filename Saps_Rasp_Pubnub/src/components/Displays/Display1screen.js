import React from "react";
import { useState, useEffect } from "react";
import { useVideo } from "../../Context/VideoContext";
import SapsPurple from "../../Images/SapsPurple.jpg";

export default function Display1screen(props) {
  const { displaytype } = useVideo();

  const [videolink, setVideolink] = useState("");
  const [videoStatus, setVideostatus] = useState(false);
  const [filename, setFilename] = useState(null);
  const [filetype, setFiletype] = useState("");

  //const name = 'Beach_1080p';

  useEffect(() => {
    if (props.fileName != "" && props.filenametype != "") {
      console.log("Filename type Display 1 ==> ", props.filenametype);
      setFilename(props.fileName);
      setVideolink(props.video);
      setVideostatus(props.video1status);
      setFiletype(props.filenametype);
    }
  }, [props]);

  return (
    <>
      {videoStatus == true && filename != null && filetype != null ? (
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
            {filetype && filetype == "video/mp4" ? (
              <video
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
              ></video>
            ) : filetype && filetype == "image/jpeg" ? (
              <img
                style={{
                  //objectFit: "cover",
                  minHeight: "100%",
                  minWidth: "100%",
                  // width: "300px",
                  // height: "100px",
                  // marginBottom: "5px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  //borderRadius: "10px",
                }}
                // src={SapsPurple}
                src={require(`../../Images/${filename}.jpg`)}
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
          </div>{" "}
        </>
      )}
    </>
  );
}
