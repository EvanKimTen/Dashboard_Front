import axios from 'axios'
import { useState, useEffect } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const Understood = () => {
    const [pieData, setPieData] = useState([]);

    const getData = async () => {
        try {
          await axios.post('http://localhost:5001/api/proxy/understood_messages',)
          .then(response => {
            const formattedResult = formatResponse(response.data.result);
            setPieData(formattedResult);
            console.log(formattedResult);
          })
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
    
      
    useEffect(() => {
        getData();
    }, []);

    const COLORS = ['#0088FE', '#FF8042'];

   
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
        <div className='content'>
            <h2>Recognition rate</h2>
            <h4>The % of messages understood by your assistant.</h4>
            <PieChart width={300} height={300}>
                <Pie
                dataKey="value"
                isAnimationActive={false}
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
        </div>
      );
}

export default Understood