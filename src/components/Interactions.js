
import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Interactions = ( {totalCount, data, fetchWeeklyData, selectedTimeframe} ) => {
    const endpoint = 'interactions'

    const formatMMDD = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}`;
    };

    useEffect(() => {
      fetchWeeklyData(selectedTimeframe, endpoint);
    }, [selectedTimeframe]);

    return (
        <div className='content' id='interactions'>
          <h2>Interactions</h2>
          <h4>Total number of engagements users have had with your assistant.</h4>
          <h1>{totalCount}</h1>
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