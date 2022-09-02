import React , {useContext} from "react";

export const VideoContext = React.createContext();


export function useVideo()
{
    return useContext(VideoContext);
}