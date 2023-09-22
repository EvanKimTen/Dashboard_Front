import { useState, useEffect } from "react";
import axios from "axios";
import Chat from "../components/Chat";
import Header from "../components/Header";
import { useUserId } from "../hooks/useUserId";

const Transcript = () => {
    const [transcriptID, setTranscriptID] = useState([])
    const userId = useUserId();


    const getTranscriptID = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/api/proxy/transcriptID/${userId}`)
            const transcriptIDArray = response.data.map(item => {
                const isoDate = new Date(item.createdAt);
                const formattedTime = isoDate.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  month: 'short',
                  day: 'numeric',
                });
              
                return {
                  id: item._id,
                  createdTime: formattedTime,
                };
            });
            setTranscriptID(transcriptIDArray);
            console.log(transcriptIDArray)
        } catch (error) {
          console.error(error);
        }
    };
      
    useEffect(() => {
        getTranscriptID();
    }, [])

    return (
        <>
            <Header name={"Transcript"} number={`(${transcriptID.length})`} />
            <Chat transcriptID={transcriptID}/>
        </>
    )
}

export default Transcript