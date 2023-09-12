import axios from 'axios'
import { useState, useEffect } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';

const Understood = ( {selectedTimeframe} ) => {
    const [pieData, setPieData] = useState([]);

    const getData = async (startDate, endDate) => {
        try {
          const response = await axios.post('http://localhost:5001/api/proxy/understood_messages', {
            query: [
              {
                filter: {
                  startTime: `${startDate}T00:00:00.000Z`,
                  endTime: `${endDate}T23:59:59.999Z`,
                },
              },
            ],
          });
          const formattedResult = formatResponse(response.data.result);
          setPieData(formattedResult);
        } catch (error) {
          console.error(error);
        }
    };

    const formatResponse = (originalData) => {
        const total = originalData[0].total.count;
        const missed = originalData[0].missed.count;
        const recognized = total - missed;
        const totalPercentage = 100;
        
        const formattedResult = [
          {
            name: 'recognized',
            value: recognized,
            percentage: ((recognized / total) * totalPercentage).toFixed(0) + '%',
          },
          {
            name: 'missed',
            value: missed,
            percentage: ((missed / total) * totalPercentage).toFixed(0) + '%',
          },
        ];
    
        return formattedResult;
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

    const COLORS = ['#e37575', '#84d899'];

   
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
        <text x={x} y={y} fontSize="14px" fill="black" textAnchor="middle">
            {percentage}
        </text>
        );
    };
    
      return (
        <div className='content' id='recognition'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart height={190}>
                  <Pie
                  dataKey="value"
                  isAnimationActive={true}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  label={renderCustomLabel}
                  labelLine={false}
                  >
                  {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
              </PieChart>
            </ResponsiveContainer>
        </div>
      );
}

export default Understood