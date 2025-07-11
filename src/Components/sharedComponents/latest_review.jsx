import { Link } from "react-router-dom";

const reviews = [
  {
    initials: 'EB',
    name: 'Emma Brooks',
    date: 'Jun 20, 2025',
    rating: 5,
    comment:
      'The Chocolate Dream cake was absolutely divine! Perfect texture and not too sweet. Will definitely order again for our next celebration.',
    product: 'Chocolate Dream',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    initials: 'RJ',
    name: 'Robert Johnson',
    date: 'Jun 19, 2025',
    rating: 4,
    comment:
      'Vanilla Bliss was good but could use a bit more flavor. The frosting was perfect though and delivery was right on time.',
    product: 'Vanilla Bliss',
    color: 'bg-green-100 text-green-600',
  },
  {
    initials: 'RJ',
    name: 'Robert Johnson',
    date: 'Jun 19, 2025',
    rating: 4,
    comment:
      'Vanilla Bliss was good but could use a bit more flavor. The frosting was perfect though and delivery was right on time.',
    product: 'Vanilla Bliss',
    color: 'bg-green-100 text-green-600',
  },{
    initials: 'RJ',
    name: 'Robert Johnson',
    date: 'Jun 19, 2025',
    rating: 4,
    comment:
      'Vanilla Bliss was good but could use a bit more flavor. The frosting was perfect though and delivery was right on time.',
    product: 'Vanilla Bliss',
    color: 'bg-green-100 text-green-600',
  },{
    initials: 'RJ',
    name: 'Robert Johnson',
    date: 'Jun 19, 2025',
    rating: 4,
    comment:
      'Vanilla Bliss was good but could use a bit more flavor. The frosting was perfect though and delivery was right on time.',
    product: 'Vanilla Bliss',
    color: 'bg-green-100 text-green-600',
  },
];

const StarRating = ({ rating }) => {
  const fullStars = Array.from({ length: 5 }, (_, i) => (
    <svg
      key={i}
      className={`h-4 w-4 ${
        i < rating ? 'text-yellow-400' : 'text-gray-300'
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.04 3.203a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.715 1.97a1 1 0 00-.364 1.118l1.04 3.203c.3.921-.755 1.688-1.54 1.118l-2.715-1.97a1 1 0 00-1.175 0l-2.715 1.97c-.785.57-1.84-.197-1.54-1.118l1.04-3.203a1 1 0 00-.364-1.118L2.465 8.63c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.04-3.203z" />
    </svg>
  ));
  return <div className="flex">{fullStars}</div>;
};
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0].toUpperCase() || '';
  const second = parts[1]?.[0].toUpperCase() || '';
  return first + second;
};

export default function LatestReviews({data}) {
    console.log(data);
  return (
    <div className="bg-white h-[400px] w-full md:w-[29%] rounded-2xl shadow-md p-4 max-w-sm mb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-800">Latest Reviews</h2>
               <Link to="/reviews" className="text-sm text-blue-500 underline hover:underline font-semibold tracking-[.1em]">View All</Link>

      </div>

      <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
        {data.map((review, idx) => (
          <div key={idx*10+1} className=" pb-4">
            <div className="flex items-center gap-2 ">
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full font-semibold ${idx%2==0?"bg-green-100 text-green-600":"bg-blue-100 text-blue-600"}`}
              >
                  {getInitials(review.userId?.username)}

                {/* {review.userId?.username.split(' ')[0][0]+review.userId?.username.split(' ').length>1?review.userId?.username.split(' ')[1][0]:' '} */}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{review.userId?.username}</p>
                <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
                    {/* {review.createdAt} */}
                    </p>
              </div>
              <div className="ml-auto">
                <StarRating rating={review.rating} />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
            <p className="mt-1 text-xs text-gray-500">
              Product: <span className="font-medium">{review.productId?.name}</span>
            </p>
            {idx<data.length-1?<div className="border-b border-gray-300 mt-4"></div>:<></>}
          </div>
        ))}
      </div>
    </div>
  );
}
