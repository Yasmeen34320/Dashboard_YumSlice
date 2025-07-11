import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8dd3c7', '#f9b171', '#fc8d62', '#57b5e7' , '#9a6a69' ,'#f40d0d' ]; 
// Delivered, Pending, Returned, Preparing , shipped ,cancelled

const OrderStatusPieChart = ({ data, totalOrders = 1248, avgOrderValue = "$56.78" }) => {
  return (
    <div className="bg-white mt-10 rounded-2xl shadow-md p-4 w-full max-w-md h-[70%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-700 tracking-[.1em]">Order Status</h2>
        <Link to="/orders" className="text-sm text-blue-500 underline hover:underline font-semibold tracking-[.1em]">View All</Link>
      </div>

      <div className="h-70">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value,name) => [`${value} Orders`, name]}
              contentStyle={{ borderRadius: '8px', fontSize: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#8dd3c7]"></span> Delivered
        </div>
        <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#f9b171]"></span> Pending
        </div>
        <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#fc8d62]"></span>  Returned
        </div>
        </div> 
        <div className="flex justify-center items-center gap-4 mt-2 text-sm"> 
        <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#57b5e7]"></span> Preparing
        </div>
         <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#9a6a69]"></span> Shipped
        </div>
         <div className="flex items-center gap-1 font-semibold tracking-[.1em] text-zinc-800">
          <span className="w-6 h-3 rounded-2xl bg-[#f40d0d]"></span> Cancelled
        </div>
      </div>

      <div className="flex justify-between mt-6 text-sm text-gray-700">
        <div className="text-center w-1/2 border-r">
          <p className="text-xs text-gray-500 font-semibold tracking-[.1em]">Total Orders</p>
          <p className="font-semibold text-lg">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="text-center w-1/2">
          <p className="text-xs text-gray-500 font-semibold tracking-[.1em]">Avg. Order Value</p>
          <p className="font-semibold text-lg">{parseFloat(avgOrderValue).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPieChart;
