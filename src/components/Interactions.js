
import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Interactions = ( {data, fetchWeeklyData, selectedTimeframe} ) => {
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              height={220}
              data={data}
              margin={{
                top: 15,
                right:20,
                left: 0,
                bottom: 0,
              }}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="35%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5" vertical={false}/>
                <XAxis dataKey="date" interval={selectedTimeframe === 'last7Days' ? 0 : 10} tickFormatter={formatMMDD} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8884d8" fill="url(#colorGradient)" activeDot={{ r: 8 }} />
              </AreaChart>
          </ResponsiveContainer>
        </div>
    )
}

export default Interactions