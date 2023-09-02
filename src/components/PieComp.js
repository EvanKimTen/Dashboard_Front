import axios from 'axios'
import { useState, useEffect } from 'react';

const PieComp = () => {
    const [pieData, setPieData] = useState([])

    const getData = async () => {
        try {
          const response = await axios.post('http://localhost:5001/api/proxy/understood_messages',);
          setPieData(response.data.result);
        } catch (error) {
          console.error(error);
        }
    };
    
      
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>PieComp</div>
    )
}

export default PieComp