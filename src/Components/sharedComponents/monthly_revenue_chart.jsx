import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MonthlyRevenueChart = ({ data }) => {
  return (
    <div className=" w-full p-4 mt-10 ml-5 mb-2 md:mb-5 bg-white rounded-2xl shadow-md">
        <div className='flex justify-between'>
          <h2 className="text-xl font-semibold mb-5 tracking-[.1em] text-gray-800">
            Monthly Revenue
          </h2>
          <div className='bg-gray-200 text-gray-700 font-semibold p-1 rounded-2xl flex items-center justify-center text-center h-10 tracking-[.1em] ' style={{fontSize: '12px'}}>
            <p >Last 6 Months</p>
            </div>
        </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

          {/* X-Axis Fix */}
          <XAxis
            dataKey="date"
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{
              fill: '#555',
              fontSize: 12,
            }}
            height={60}
          />

          {/* Y-Axis Every 100 units */}
          <YAxis
            tick={{ fill: '#555', fontSize: 12 }}
            ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800]}
          />

          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;
