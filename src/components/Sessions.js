
import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Sessions = ( {totalCount, data, fetchWeeklyData, selectedTimeframe} ) => {
    const endpoint = 'sessions'
    
    useEffect(() => {
      fetchWeeklyData(selectedTimeframe, endpoint);
    }, [selectedTimeframe]);

    const formatMMDD = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    };

    return (
        <div className='content' id='users'>
          {/* <h2>Sessions</h2>
          <h4>Unique user sessions with your assistant.</h4>
          <h1>{totalCount}</h1> */}
          <ResponsiveContainer width="100%" height="100%">
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
              <XAxis dataKey="date" interval={selectedTimeframe === 'last30Days' ? 10 : 0} hide={true}/>
              <YAxis hide={true}/>
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    )
}

export default Sessions