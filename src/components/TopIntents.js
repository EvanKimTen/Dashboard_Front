import axios from 'axios'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const TopIntents = ( {selectedTimeframe} ) => {

    const [barData, setBarData] = useState([])
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

    const getData = async (startDate, endDate) => {
        try {
          const response = await axios.post(`http://localhost:5001/api/proxy/top_intents`, {
            query: [
              {
                filter: {
                  startTime: `${startDate}T00:00:00.000Z`,
                  endTime: `${endDate}T23:59:59.999Z`,
                },
              },
            ],
          });
          console.log(response.data.result[0].intents);
          setBarData(response.data.result[0].intents);
        } catch (error) {
          console.error(error);
        }
      };
    
    const setDate = async (timeframe) => {
      let startDate, endDate;
      if (timeframe === 'last7Days') {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
      } else if (timeframe === 'last30Days') {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
      }
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      getData(formattedStartDate, formattedEndDate)
    }
    
    useEffect(() => {
      setDate(selectedTimeframe);
    }, [selectedTimeframe]);



    return (
        <div className='content' id='intents'>
            <h2>Top Intents</h2>
            <h4>The most popular queries users ask your assistant.</h4>
            <BarChart width={480} height={250} data={barData} layout='vertical' margin={{
            top: 30,
            right: 30,
            bottom: 30,
            left: 55,
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

export default TopIntents