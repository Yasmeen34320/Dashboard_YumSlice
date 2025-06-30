import { useQuery } from "@tanstack/react-query";
import { fetchProductData } from "../../services/dashboardService";
import { FaBirthdayCake } from "react-icons/fa"; // Install if not yet: `npm i react-icons`
import { RiCake3Line } from "react-icons/ri";
import { TbCakeRoll } from "react-icons/tb";
 import { SiCakephp } from "react-icons/si";

const getAlertLevel = (stock) => {
  if (stock <= 3) return 'critical';
  if (stock <= 5) return 'warning';
  return 'safe';
};
import { MdOutlineCake } from "react-icons/md";

const LowStockAlert = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching products.</div>;

  const { products } = data || {};
  if (!products) return <div>No product data.</div>;

  const lowStockProducts = products
    .filter((p) => getAlertLevel(p.stock) !== 'safe')
    .sort((a, b) => {
      const levels = { critical: 0, warning: 1 };
      return levels[getAlertLevel(a.stock)] - levels[getAlertLevel(b.stock)];
    });

  if (lowStockProducts.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md text-center text-gray-500">
        ✅ All products are well stocked!
      </div>
    );
  }
  const iconMap={
    Custom:"cake",
    Wedding:"cake",
    Birthday:"cake",
    "Molten Cakes":"molten",
    Cupcakes:"cupcakes",
    Cheesecakes:"cheese",
  }

  return (
    // <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md">
    <div className="w-[50%] ">
      <h3 className="text-base font-semibold mb-4 text-gray-700">🚨 Low Stock Alert</h3>

      <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
        {lowStockProducts.map((product) => {
          const level = getAlertLevel(product.stock);
          const bgColor = level === 'critical' ? 'bg-red-100' : 'bg-yellow-100';
          const iconColor = level === 'critical' ? 'text-red-500' : 'text-yellow-500';
          const textColor = level === 'critical' ? 'text-red-600' : 'text-yellow-600';

          return (
            <div
              key={product._id}
              className="flex items-center justify-between gap-3"
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor}`}>
             {iconMap[product.category]=="cake"?<MdOutlineCake  className={` ${iconColor}`}/>:
iconMap[product.category]=="cheese"?<SiCakephp className={` ${iconColor}`} /> :
iconMap[product.category]=="cupcakes"?<RiCake3Line className={` ${iconColor}`} />:
<TbCakeRoll className={` ${iconColor}`}/>


}
              {/* if(iconMap[product.category]=="cake")
                <FaBirthdayCake className={` ${iconColor}`} /> */}
              </div>

              <div className="flex-1 tracking-[.05em]">
                <p className="text-sm text-gray-600 font-semibold tracking-[.1em]">{product.name}</p>
                <p className={`text-sm font-semibold ${textColor}`}>
                  {product.stock} left
                </p>
              </div>

              <button className="px-3 py-1 text-xs tracking-[.1em] bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Restock
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowStockAlert;
