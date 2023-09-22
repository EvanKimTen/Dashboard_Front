import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Interactions from "../components/Interactions";
import Sessions from "../components/Sessions";
import TopIntents from "../components/TopIntents";
import Understood from "../components/Understood";
import Users from "../components/Users";
import Header from "../components/Header";
import { useUserId } from "../hooks/useUserId";

const Analytics = () => {
  const [interactionsData, setInteractionsData] = useState([]);
  const [totalInteractionsCount, setTotalInteractionsCount] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [sessionsData, setSessionsData] = useState([]);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState("last7Days");

  const userId = useUserId();

  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };

  const timeframeOptions = [
    { label: "Last 7 Days", value: "last7Days" },
    { label: "Last 30 Days", value: "last30Days" },
    { label: "Last 60 Days", value: "last60Days" },
    { label: "Last 90 Days", value: "last90Days" },
    // Add more options as needed
  ];

  const fetchDataForDate = async (date, endpoint) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/proxy/${endpoint}/${userId}`,
        {
          query: [
            {
              filter: {
                startTime: `${date}T00:00:00.000Z`,
                endTime: `${date}T23:59:59.999Z`,
              },
            },
          ],
        }
      );

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
      if (timeframe === "last7Days") {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
      } else if (timeframe === "last30Days") {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
      }else if (timeframe === "last60Days") {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 59);
      }else if (timeframe === "last90Days") {
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 89);
      }

      const dateArray = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fetch data for each date and store the counts in an array
      const dataPromises = dateArray.map(async (date) =>
        fetchDataForDate(date, endpoint)
      );
      const dailyCounts = await Promise.all(dataPromises);

      // Calculate the total count for the week
      const totalWeekCount = dailyCounts.reduce((acc, count) => acc + count, 0);

      // Create an array of objects with date and count for each day
      const weeklyData = dateArray.map((date, index) => ({
        date,
        count: dailyCounts[index],
      }));

      // Set the data for the line chart and store the total count
      if (endpoint === "interactions") {
        setInteractionsData(weeklyData);
        setTotalInteractionsCount(totalWeekCount);
      } else if (endpoint === "users") {
        setUsersData(weeklyData);
        setTotalUsersCount(totalWeekCount);
      } else if (endpoint === "sessions") {
        setSessionsData(weeklyData);
        setTotalSessionsCount(totalWeekCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header name={'Analytics'}/>
      <Box mt="6rem" >
        <Box sx={{ 
          width: 150,
          m: 2,
          }}
        >
          <FormControl fullWidth sx={{ 
          bgcolor: 'white',
          }}>
            <InputLabel >Period</InputLabel>
            <Select
              value={selectedTimeframe}
              label="Period"
              onChange={handleTimeframeChange}
            >
              {timeframeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="175px"
        bgcolor="white"
        mt="15px"
      >

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          display="flex"
          flexDirection="column"
          p="30px 25px"
          sx={{ border: "0.5px solid grey"}}
        >
            <p className="chart-title">Interactions</p>
            <p className="chart-description">Total number of engagements users have had with your assistant.</p>
            <h1>{totalInteractionsCount}</h1>
            <Interactions
            data={interactionsData}
            fetchWeeklyData={fetchWeeklyData}
            selectedTimeframe={selectedTimeframe}
            />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          display="flex"
          flexDirection="column"
          p="30px 25px"
          sx={{ border: "0.5px solid grey"}}

        >
            <p className="chart-title">Recognition rate</p>
            <p className="chart-description">The % of messages understood by your assistant.</p>
            <Understood selectedTimeframe={selectedTimeframe} />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          flexDirection="column"
          p="30px 25px"
          sx={{ border: "0.5px solid grey"}}
        >
            <p className="chart-title">Users</p>
            <p className="chart-description">Unique user sessions with your assistant.</p>
            <h1>{totalUsersCount}</h1>
            <Users
              data={usersData}
              fetchWeeklyData={fetchWeeklyData}
              selectedTimeframe={selectedTimeframe}
            />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          flexDirection="column"
          p="30px 25px"
          sx={{ border: "0.5px solid grey"}}
        >
              <p className="chart-title">Sessions</p>
              <p className="chart-description">Unique user sessions with your assistant.</p>
              <h1>{totalSessionsCount}</h1>
              <Sessions
              data={sessionsData}
              fetchWeeklyData={fetchWeeklyData}
              selectedTimeframe={selectedTimeframe}
            />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          display="flex"
          flexDirection="column"
          p="30px 25px"
          sx={{ border: "0.5px solid grey"}}
        >
            <p className="chart-title">Top Intents</p>
            <p className="chart-description" >The most popular queries users ask your assistant.</p>
            <TopIntents selectedTimeframe={selectedTimeframe} />
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Analytics;