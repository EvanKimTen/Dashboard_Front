import axios from 'axios'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const BarComp = () => {

    const [barData, setBarData] = useState([])
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

    const getData = async () => {
        try {
          const response = await axios.post('http://localhost:5001/api/proxy/top_intents',);
          setBarData(response.data.result[0].intents);
        } catch (error) {
          console.error(error);
        }
      };
    
      
      useEffect(() => {
        getData();
      }, []);



    return (
        <div className='content'>
            <h2>Top Intents</h2>
            <h4>The most popular queries users ask your assistant.</h4>
            <BarChart width={450} height={350} data={barData} layout='vertical' margin={{
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
          }}>
                <XAxis type='number' hide={true}/>
                <YAxis dataKey="name" type="category" hide={false}/>
                <Tooltip />
                <Bar dataKey="count" barSize={20} label={{ fontSize: 15, position: 'right' }} >
                    {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    )
}

export default BarComp