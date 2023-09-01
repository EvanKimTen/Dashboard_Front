import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const BarComp = () => {
    const key = process.env.REACT_APP_API_KEY
    const projectId = process.env.REACT_APP_PROJECT_ID
    return (
        <div>
            <BarChart width={730} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
            </BarChart>
        </div>
    )
}

export default BarComp