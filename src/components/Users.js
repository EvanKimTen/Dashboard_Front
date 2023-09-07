import axios from 'axios'
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Users = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchDataForDate = async (date) => {
      try {
        const response = await axios.post('http://localhost:5001/api/proxy/users', {
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
    
    const fetchWeeklyData = async () => {
      try {
        // Calculate the date range for the last seven days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6); // Go back seven days
    
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
      fetchWeeklyData();
    }, []);

    const formatMMDD = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    };

    return (
        <div className='content' id='users'>
          <h2>Users</h2>
          <h4>Unique user sessions with your assistant.</h4>
          <h1>{totalCount}</h1>
          <AreaChart
          width={420}
          height={150}
          data={data}
          margin={{
            top: 15,
            right: 45,
            left: 0,
            bottom: 0,
          }}
          >
            <XAxis dataKey="date" interval={0} hide={true}/>
            <YAxis hide={true}/>
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
          </AreaChart>
        </div>
    )
}

export default Users