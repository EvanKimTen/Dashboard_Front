import axios from 'axios'
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Interactions = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedTimeframe, setSelectedTimeframe] = useState('last7Days');

    const handleTimeframeChange = (event) => {
      setSelectedTimeframe(event.target.value);
    };

    const timeframeOptions = [
      { label: 'Last 7 Days', value: 'last7Days' },
      { label: 'Last 30 Days', value: 'last30Days' },
      // Add more options as needed
    ];

    const fetchDataForDate = async (date) => {
      try {
        const response = await axios.post('http://localhost:5001/api/proxy/interactions', {
          query: [
            {
              filter: {
                startTime: `${date}T00:00:00.000Z`,
                endTime: `${date}T23:59:59.999Z`,
              },
            },
          ],
        });
    
        return response.data.result[0].count;
      } catch (error) {
        console.error(`Error fetching data for ${date}:`, error);
        return 0; // Handle error or set a default value as needed
      }
    };
    
    const fetchWeeklyData = async (timeframe) => {
      try {
        // Calculate the date range for the last seven days
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
    
        const dateArray = [];
        let currentDate = new Date(startDate);
    
        while (currentDate <= endDate) {
          dateArray.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
    
        // Fetch data for each date and store the counts in an array
        const dataPromises = dateArray.map(async (date) => fetchDataForDate(date));
        const dailyCounts = await Promise.all(dataPromises);
    
        // Calculate the total count for the week
        const totalWeekCount = dailyCounts.reduce((acc, count) => acc + count, 0);
    
        // Create an array of objects with date and count for each day
        const weeklyData = dateArray.map((date, index) => ({
          date,
          count: dailyCounts[index],
        }));
    
        // Set the data for the line chart and store the total count
        setData(weeklyData);
        setTotalCount(totalWeekCount); // You can use state to store the total count
      } catch (error) {
        console.error(error);
      }
    };
  
  
    useEffect(() => {
      fetchWeeklyData(selectedTimeframe);
    }, [selectedTimeframe]);

    const formatMMDD = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    };

    return (
        <div className='content' id='interactions'>
          <h2>Interactions</h2>
          <h4>Total number of engagements users have had with your assistant.</h4>
          <h1>{totalCount}</h1>
          <label>Select Timeframe: </label>
          <select value={selectedTimeframe} onChange={handleTimeframeChange}>
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
            <AreaChart
            width={700}
            height={250}
            data={data}
            margin={{
              top: 15,
              right:20,
              left: 0,
              bottom: 0,
            }}
            >
              <CartesianGrid strokeDasharray="5" vertical={false}/>
              <XAxis dataKey="date" interval={selectedTimeframe === 'last30Days' ? 10 : 0} tickFormatter={formatMMDD} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
            </AreaChart>
        </div>
    )
}

export default Interactions