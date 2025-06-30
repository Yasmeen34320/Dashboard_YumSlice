// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchDeliveredOrders, fetchProductData } from '../../services/dashboardService';
import { useQuery } from '@tanstack/react-query';
import { RxLetterSpacing } from 'react-icons/rx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const BarChart = () => {
    const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchDeliveredOrders
  });
  const {
    orderCategoryData
  } = data || {};
  console.log('from Bar')
  console.log(orderCategoryData);
    const labels = orderCategoryData.map(item => item.category);
  const counts = orderCategoryData.map(item => item.count);
  const data1 = {
    labels: labels,
    datasets: [
      {
        label: 'Sales',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false, // Allow height control
  layout: {
    padding: {
      top: 20,
      bottom: 20,
      left: 15,
      right: 15,
    },
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 14,
          family: 'Arial',
        },
        color: '#333',
      },
    },
    title: {
      display: true,
      text: 'Sales by Category',
      font: {
        size: 18,
        family: 'courier',
    letterSpacing:2,
      },
      color: '#111',
      padding: { top: 10, bottom: 30 },
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleColor: '#fff',
      bodyColor: '#ddd',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#555',
        font: {
          size: 14,
          letterSpacing:2,
          family:'courier'
        },
      },
    },
    y: {
      grid: {
        color: '#eee',
        borderDash: [4],
      },
      ticks: {
        color: '#555',
        stepSize: 2,
      },
    },
  },
};


  return <Bar data={data1} options={options} />;
};

export default BarChart;
