import axios from 'axios'
import { useState, useEffect } from 'react';

const PieComp = () => {
    const [pieData, setPieData] = useState([])
    const [missedCount, setMissedCount] = useState(0)
    const [recognizedCount, setRecognizedCount] = useState(0)

    const getData = async () => {
        try {
          const response = await axios.post('http://localhost:5001/api/proxy/understood_messages',);
          setMissedCount(response.data.result[0].missed.count);
          setRecognizedCount(response.data.result[0].total.count - response.data.result[0].missed.count);
        } catch (error) {
          console.error(error);
        }
    };
    
      
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>{recognizedCount}</h1>
            <h1>{missedCount}</h1>
        </div>
    )
}

export default PieComp