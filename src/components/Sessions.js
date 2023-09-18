
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            height={100}
            data={data}
            margin={{
              top: 15,
              right: 45,
              left: 0,
              bottom: 0,
            }}
            >
               <defs>
                <linearGradient id="smallGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="25%" stopColor="#4bae64" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#84d899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" interval={selectedTimeframe === 'last7Days' ? 0 : 10} hide={true}/>
              <YAxis hide={true}/>
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#4f9561" fill="url(#smallGradient)"activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    )
}

export default Sessions