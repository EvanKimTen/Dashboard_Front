import { useEffect, useState } from 'react';
import axios from 'axios'
import './App.css';
import Interactions from './components/Interactions';
import Sessions from './components/Sessions';
import TopIntents from './components/TopIntents';
import Understood from './components/Understood';
import Users from './components/Users';

const App = () => {

  const [interactionsData, setInteractionsData] = useState([]);
  const [totalInteractionsCount, setTotalInteractionsCount] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [sessionsData, setSessionsData] = useState([]);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('last7Days');

  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };

  const timeframeOptions = [
    { label: 'Last 7 Days', value: 'last7Days' },
    { label: 'Last 30 Days', value: 'last30Days' },
    // Add more options as needed
  ];


  const fetchDataForDate = async (date, endpoint) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/proxy/${endpoint}`, {
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

  const fetchWeeklyData = async (timeframe, endpoint) => {
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
      const dataPromises = dateArray.map(async (date) => fetchDataForDate(date, endpoint));
      const dailyCounts = await Promise.all(dataPromises);
  
      // Calculate the total count for the week
      const totalWeekCount = dailyCounts.reduce((acc, count) => acc + count, 0);
  
      // Create an array of objects with date and count for each day
      const weeklyData = dateArray.map((date, index) => ({
        date,
        count: dailyCounts[index],
      }));
  
      // Set the data for the line chart and store the total count
      if (endpoint === 'interactions') {
        setInteractionsData(weeklyData)
        setTotalInteractionsCount(totalWeekCount)
      } else if (endpoint === 'users') {
        setUsersData(weeklyData)
        setTotalUsersCount(totalWeekCount)
      } else if (endpoint === 'sessions') {
        setSessionsData(weeklyData)
        setTotalSessionsCount(totalWeekCount)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <label>Select Timeframe: </label>
      <select value={selectedTimeframe} onChange={handleTimeframeChange}>
        {timeframeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div id='container'>
      <Interactions  totalCount={totalInteractionsCount} data={interactionsData} fetchWeeklyData={fetchWeeklyData} selectedTimeframe={selectedTimeframe}/>
      <Understood selectedTimeframe={selectedTimeframe}/>
      <Users totalCount={totalUsersCount} data={usersData} fetchWeeklyData={fetchWeeklyData} selectedTimeframe={selectedTimeframe}/>
      <Sessions totalCount={totalSessionsCount} data={sessionsData} fetchWeeklyData={fetchWeeklyData} selectedTimeframe={selectedTimeframe}/>
      <TopIntents selectedTimeframe={selectedTimeframe}/>
      </div>
    </>
  )
}

export default App