import React, { useState, useEffect } from 'react';
import StoreService from '../../services/storeService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStore, setActiveStore] = useState(null);

    const {user}=useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StoreService.getOwnerDashboard(user.id);
        if (response.success) {
          setDashboardData(response.data);

          
          if (response.data.stores.length > 0) {
            setActiveStore(response.data.stores[0].id);
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!dashboardData) return <div className="p-4">No data available</div>;

  const selectedStore = dashboardData.stores.find(store => store.id === activeStore);



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Store Owner Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Stores</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardData.total_stores}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Average Rating (All Stores)</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {dashboardData.stores.reduce((acc, store) => acc + store.average_rating, 0) / dashboardData.stores.length || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Ratings</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {dashboardData.stores.reduce((acc, store) => acc + store.total_ratings, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Store Selector */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Your Stores</h2>
          <div className="space-y-2">
            {dashboardData.stores.map(store => (
              <div 
                key={store.id}
                className={`p-4 rounded cursor-pointer transition-colors ${activeStore === store.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveStore(store.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{store.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{store.average_rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{store.total_ratings} ratings</p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Details */}
        {selectedStore && (
          <div className="lg:col-span-2 space-y-6">
            {/* Store Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStore.name}</h2>
                  <p className="text-gray-600">{selectedStore.address}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center">
                  <span className="text-lg">★</span>
                  <span className="ml-1 font-bold">{selectedStore.average_rating.toFixed(1)}</span>
                  <span className="text-sm ml-1">({selectedStore.total_ratings} ratings)</span>
                </div>
              </div>

              {/* Rating Distribution Chart */}
              <div className="mt-6 h-64">
                <h3 className="font-semibold mb-2">Rating Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '5★', value: selectedStore.rating_users.filter(r => r.rating === 5).length },
                      { name: '4★', value: selectedStore.rating_users.filter(r => r.rating === 4).length },
                      { name: '3★', value: selectedStore.rating_users.filter(r => r.rating === 3).length },
                      { name: '2★', value: selectedStore.rating_users.filter(r => r.rating === 2).length },
                      { name: '1★', value: selectedStore.rating_users.filter(r => r.rating === 1).length },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Ratings List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Customer Ratings</h2>
              {selectedStore.rating_users.length > 0 ? (
                <div className="space-y-4">
                  {selectedStore.rating_users.map((rating, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{rating.name}</h4>
                          <p className="text-gray-500 text-sm">{rating.email}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-lg ${i < rating.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {rating.comment && (
                        <p className="mt-2 text-gray-700">{rating.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Rated on {new Date(rating.rated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No ratings yet for this store</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;