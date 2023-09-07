import axios from 'axios'
import { useState, useEffect } from 'react';

const Interactions = () => {
    const [lineData, setLineData] = useState([]);

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
    
          return {
            date,
            count: response.data.result[0].count,
          };
        } catch (error) {
          console.error(`Error fetching data for ${date}:`, error);
          return {
            date,
            count: 0, // Handle error or set a default value as needed
          };
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
    
          // Fetch data for each date and store it in an array
          const dataPromises = dateArray.map(async (date) => fetchDataForDate(date));
          const weeklyData = await Promise.all(dataPromises);
          setLineData(weeklyData);
          console.log(weeklyData);
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        fetchWeeklyData();
      }, []);

    return (
        <div>LineComp</div>
    )
}

export default Interactions