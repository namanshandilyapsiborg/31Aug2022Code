import React from "react";
//import surfing_720p from "../videos/surfing_720p.mp4";

export default function Display2screens() 
{
    return (
        <>
        
        <div style={{ 
        //height : "100%" , 
        //width : "100%", 
        display : "flex" , 
        //alignItems :"center"
        //justifyContent : "center"
          }}>
        {/* --------------- Display Left ------------------ */}
        
        <div style={{ height : "100vh" , width : "50%" , backgroundColor : "red" ,
        //position: "absolute", 
        //top: "0" , left: "0"
       }} >

        <video 
        style={{ 
        //objectFit : "cover" ,
        // minHeight : "100%" ,
        // minWidth : "auto",
         }}
        controls
        // autostart autoPlay src={surfing_720p} type="video/mp4"
        >
        </video>
       
        </div>

        {/* --------------- Display Right ------------------ */}
        <div style={{ height : "100vh" , width : "50%" , backgroundColor : "black" ,
        //position: "absolute", 
        //top: "0" , left: "0"
       }} >

        {/* <video 
        style={{
        //objectFit : "cover" , 
        minHeight : "100%" ,
        minWidth : "auto"  }}
        controls
        autostart autoPlay src={surfing_720p} type="video/mp4"
        >
        </video> */}

        </div>

        </div>

        
        </>
    )
}