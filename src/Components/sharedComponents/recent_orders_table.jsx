
// export default function RecentOrdersTable({data}) {
//   return (
//     <div className="bg-white mt-10 rounded-2xl shadow-md p-4 w-full max-w-md h-[70%]">
//  <div className="flex justify-between items-center mb-4">
//         <h2 className="text-base font-semibold text-gray-700 tracking-[.1em]">Recent Orders</h2>
//         <a href="#" className="text-sm text-blue-500 underline hover:underline font-semibold tracking-[.1em]">View All</a>
//       </div>
      
// </div>  )
// }
// const orders = [
//   {
//     id: '#ORD-7246',
//     initials: 'EB',
//     name: 'Emma Brooks',
//     cakes: 'Chocolate Dream, Red Velvet',
//     status: 'Delivered',
//     payment: 'Paymob',
//     total: '$68.50',
//   },
//   {
//     id: '#ORD-7245',
//     initials: 'RJ',
//     name: 'Robert Johnson',
//     cakes: 'Vanilla Bliss',
//     status: 'Pending',
//     payment: 'Cash',
//     total: '$32.00',
//   },
//   {
//     id: '#ORD-7244',
//     initials: 'SL',
//     name: 'Sophia Lee',
//     cakes: 'Strawberry Delight, Tiramisu',
//     status: 'Processing',
//     payment: 'Paymob',
//     total: '$75.20',
//   },
//   {
//     id: '#ORD-7243',
//     initials: 'DM',
//     name: 'David Miller',
//     cakes: 'Black Forest',
//     status: 'Cancelled',
//     payment: 'Paymob',
//     total: '$45.00',
//   },
//   {
//     id: '#ORD-7242',
//     initials: 'AW',
//     name: 'Alice Wilson',
//     cakes: 'Caramel Fusion',
//     status: 'Delivered',
//     payment: 'Cash',
//     total: '$38.75',
//   },
// ];
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const statusColors = {
  delivered: 'bg-green-100 text-green-600',
  pending: 'bg-yellow-100 text-yellow-600',
  preparing: 'bg-blue-100 text-blue-600',
  Canceled: 'bg-red-100 text-red-600',
  Returned :'bg-orange-100 text-orange-600',
  shipped:'bg-orange-50 text-orange-950',
  onDelivery :'bg-yellow-100 text-yellow-600',
  paid:'bg-green-100 text-green-600'
};

export default function OrdersTable({orders}) {
    let index=0;
  return (
    <div className="h-[400px] overflow-x-auto p-6 bg-white shadow-md rounded-xl w-full md:w-[70%] mb-10">
<div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-700 tracking-[.1em]">Recent Orders</h2>
        <Link to="/orders" className="text-sm text-blue-500 underline hover:underline font-semibold tracking-[.1em]">View All</Link>
      </div>    
        <table className="min-w-full text-sm text-left font-semibold">
        <thead className="bg-gray-50 text-gray-600 tracking-[.1em]">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Products Count</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 tracking-[.05em]">
          {orders.map((order, idx) => 
          {
            if(order.userId?.username)
            index++;
            return (order.userId?.username!==undefined)? 
             (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-700">{index}</td>
              <td className="px-4 py-3 flex items-center gap-2">
                
                <span>{order.userId.username}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{order.orderItems.length}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 flex items-center ">
               <RiMoneyDollarCircleFill />

                <span className={`text-sm font-semibold px-2 py-1 `}>
                    Cash
                </span>
                </td>
              <td className="px-4 py-3 font-semibold text-gray-800">${order.totalPrice}</td>
            </tr>
          ):(<></>)}
         )}
        </tbody>
      </table>
    </div>
  );
}
