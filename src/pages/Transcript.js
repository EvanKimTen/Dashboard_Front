import { useState, useEffect } from "react";
import axios from "axios";
import Chat from "../components/Chat";


const Transcript = () => {
    const [transcriptID, setTranscriptID] = useState([])

    const getTranscriptID = async () => {
        try {
            const response = await axios.post(`http://localhost:5001/api/proxy/transcriptID`)
            const transcriptIDArray = response.data.map(item => item._id);
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
        <div>
            <Chat transcriptID={transcriptID}/>
        </div>
    )
}

export default Transcript