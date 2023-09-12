import axios from 'axios'
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const TopIntents = ( {selectedTimeframe} ) => {

    const [barData, setBarData] = useState([])
    const colors = ['#84d899', '#8884d8', '#e37575', '#A0C1D1', '#5A7D7C'];
    
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
      }else if (timeframe === 'last60Days') {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 59);
      }else if (timeframe === 'last90Days') {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 89);
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart height={250} data={barData} layout='vertical' margin={{
              top: 30,
              right: 30,
              bottom: 30,
              left: 77,
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
            </ResponsiveContainer>
        </div>
    )
}

export default TopIntents