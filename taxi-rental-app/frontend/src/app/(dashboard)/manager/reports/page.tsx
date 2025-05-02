// src/app/(dashboard)/manager/reports/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';

type ReportType = 
  | 'top-clients'
  | 'car-model-usage'
  | 'driver-performance'
  | 'client-driver-cities'
  | 'problematic-drivers'
  | 'brand-ratings';

type TopClient = {
  name: string;
  email: string;
  rentCount: number;
  mostFrequentCar: string;
};

type CarModelUsage = {
  brand: string;
  carId: number;
  modelId: number;
  color: string;
  constructionYear: number;
  transmissionType: string;
  rentCount: number;
};

type DriverPerformance = {
  name: string;
  totalRents: number;
  averageRating: number;
};

type CityCrossReference = {
  clientName: string;
  clientEmail: string;
  clientCity: string;
  driverName: string;
  driverCity: string;
};

type ProblematicDriver = {
  name: string;
  averageRating: number;
  rentCount: number;
  localClientCount: number;
};

type BrandRating = {
  brand: string;
  averageDriverRating: number;
  rentCount: number;
};

export default function ManagerReports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('top-clients');
  const [topK, setTopK] = useState<number>(5);
  const [city1, setCity1] = useState<string>('Chicago');
  const [city2, setCity2] = useState<string>('New York');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Report Results
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [carModelUsage, setCarModelUsage] = useState<CarModelUsage[]>([]);
  const [driverPerformance, setDriverPerformance] = useState<DriverPerformance[]>([]);
  const [cityCrossReference, setCityCrossReference] = useState<CityCrossReference[]>([]);
  const [problematicDrivers, setProblematicDrivers] = useState<ProblematicDriver[]>([]);
  const [brandRatings, setBrandRatings] = useState<BrandRating[]>([]);

  // For city selection
  const availableCities = ['Chicago', 'New York', 'Los Angeles', 'Boston', 'San Francisco', 'Miami'];

  const generateReport = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, make API calls to fetch the report data
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on the selected report
      switch (selectedReport) {
        case 'top-clients':
          setTopClients(generateMockTopClients(topK));
          break;
        case 'car-model-usage':
          setCarModelUsage(generateMockCarModelUsage());
          break;
        case 'driver-performance':
          setDriverPerformance(generateMockDriverPerformance());
          break;
        case 'client-driver-cities':
          setCityCrossReference(generateMockCityCrossReference(city1, city2));
          break;
        case 'problematic-drivers':
          setProblematicDrivers(generateMockProblematicDrivers());
          break;
        case 'brand-ratings':
          setBrandRatings(generateMockBrandRatings());
          break;
      }
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for reports
  const generateMockTopClients = (k: number): TopClient[] => {
    const clients: TopClient[] = [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com', rentCount: 42, mostFrequentCar: 'Tesla (White)' },
      { name: 'Bob Smith', email: 'bob.smith@example.com', rentCount: 38, mostFrequentCar: 'Toyota Camry (Silver)' },
      { name: 'Charlie Davis', email: 'charlie.davis@example.com', rentCount: 35, mostFrequentCar: 'Honda Accord (Blue)' },
      { name: 'Diana Wilson', email: 'diana.wilson@example.com', rentCount: 31, mostFrequentCar: 'Tesla (Black)' },
      { name: 'Edward Brown', email: 'edward.brown@example.com', rentCount: 28, mostFrequentCar: 'Ford (Blue)' },
      { name: 'Fiona Miller', email: 'fiona.miller@example.com', rentCount: 26, mostFrequentCar: 'Chevrolet (Red)' },
      { name: 'George Taylor', email: 'george.taylor@example.com', rentCount: 24, mostFrequentCar: 'Toyota (Red)' },
      { name: 'Hannah Martinez', email: 'hannah.martinez@example.com', rentCount: 21, mostFrequentCar: 'Honda (White)' },
      { name: 'Ian Robinson', email: 'ian.robinson@example.com', rentCount: 19, mostFrequentCar: 'Tesla (White)' },
      { name: 'Julia Garcia', email: 'julia.garcia@example.com', rentCount: 17, mostFrequentCar: 'Chevrolet (Gray)' }
    ];
    
    return clients.slice(0, k);
  };

  const generateMockCarModelUsage = (): CarModelUsage[] => {
    return [
      { brand: 'Tesla', carId: 3, modelId: 1, color: 'White', constructionYear: 2024, transmissionType: 'automatic', rentCount: 165 },
      { brand: 'Toyota', carId: 1, modelId: 1, color: 'Silver', constructionYear: 2023, transmissionType: 'automatic', rentCount: 156 },
      { brand: 'Honda', carId: 2, modelId: 1, color: 'Black', constructionYear: 2023, transmissionType: 'automatic', rentCount: 143 },
      { brand: 'Toyota', carId: 1, modelId: 2, color: 'Blue', constructionYear: 2022, transmissionType: 'manual', rentCount: 134 },
      { brand: 'Chevrolet', carId: 5, modelId: 1, color: 'Red', constructionYear: 2023, transmissionType: 'automatic', rentCount: 112 },
      { brand: 'Toyota', carId: 1, modelId: 3, color: 'Red', constructionYear: 2024, transmissionType: 'automatic', rentCount: 98 },
      { brand: 'Tesla', carId: 3, modelId: 2, color: 'Black', constructionYear: 2025, transmissionType: 'automatic', rentCount: 91 },
      { brand: 'Honda', carId: 2, modelId: 2, color: 'White', constructionYear: 2024, transmissionType: 'manual', rentCount: 87 },
      { brand: 'Ford', carId: 4, modelId: 1, color: 'Blue', constructionYear: 2022, transmissionType: 'manual', rentCount: 76 },
      { brand: 'Chevrolet', carId: 5, modelId: 2, color: 'Gray', constructionYear: 2024, transmissionType: 'manual', rentCount: 67 }
    ];
  };

  const generateMockDriverPerformance = (): DriverPerformance[] => {
    return [
      { name: 'John Smith', totalRents: 248, averageRating: 4.8 },
      { name: 'Sarah Johnson', totalRents: 215, averageRating: 4.9 },
      { name: 'Michael Brown', totalRents: 192, averageRating: 4.6 },
      { name: 'Emma Wilson', totalRents: 187, averageRating: 4.7 },
      { name: 'David Miller', totalRents: 145, averageRating: 4.5 },
      { name: 'Olivia Davis', totalRents: 132, averageRating: 4.4 },
      { name: 'James Wilson', totalRents: 98, averageRating: 4.2 },
      { name: 'Sophia Martinez', totalRents: 87, averageRating: 4.3 },
      { name: 'Daniel Thompson', totalRents: 76, averageRating: 3.9 },
      { name: 'Emily Johnson', totalRents: 65, averageRating: 4.1 }
    ];
  };

  const generateMockCityCrossReference = (clientCity: string, driverCity: string): CityCrossReference[] => {
    if (clientCity === driverCity) {
      // More results if cities are the same
      return [
        { clientName: 'Alice Johnson', clientEmail: 'alice.johnson@example.com', clientCity, driverName: 'John Smith', driverCity },
        { clientName: 'Bob Smith', clientEmail: 'bob.smith@example.com', clientCity, driverName: 'Sarah Johnson', driverCity },
        { clientName: 'Charlie Davis', clientEmail: 'charlie.davis@example.com', clientCity, driverName: 'Michael Brown', driverCity },
        { clientName: 'Diana Wilson', clientEmail: 'diana.wilson@example.com', clientCity, driverName: 'Emma Wilson', driverCity },
        { clientName: 'Edward Brown', clientEmail: 'edward.brown@example.com', clientCity, driverName: 'David Miller', driverCity }
      ];
    } else {
      // Fewer results if cities are different
      return [
        { clientName: 'Alice Johnson', clientEmail: 'alice.johnson@example.com', clientCity, driverName: 'John Smith', driverCity },
        { clientName: 'Bob Smith', clientEmail: 'bob.smith@example.com', clientCity, driverName: 'Sarah Johnson', driverCity },
        { clientName: 'Charlie Davis', clientEmail: 'charlie.davis@example.com', clientCity, driverName: 'Michael Brown', driverCity }
      ];
    }
  };

  const generateMockProblematicDrivers = (): ProblematicDriver[] => {
    const clients: ProblematicDriver[] = [
      { name: 'Alice Johnson', rentCount: 17, averageRating: 0.3, localClientCount: 16  },
      { name: 'Bob Smith', rentCount: 12, averageRating: 0.5, localClientCount: 11  },
      { name: 'Charlie Davis', rentCount: 7, averageRating: 0.6, localClientCount: 7  },
      { name: 'Diana Wilson', rentCount: 5, averageRating: 0.9, localClientCount: 5  },
      { name: 'Edward Brown', rentCount: 19, averageRating: 1.2, localClientCount: 17  },
      { name: 'Fiona Miller', rentCount: 20, averageRating: 1.3, localClientCount: 17  },
      { name: 'George Taylor', rentCount: 11, averageRating: 1.7, localClientCount: 9 },
      { name: 'Hannah Martinez', rentCount: 3, averageRating: 2.0, localClientCount: 2  },
      { name: 'Ian Robinson', rentCount: 14, averageRating: 2.4, localClientCount: 9 },
      { name: 'Julia Garcia',  rentCount: 18, averageRating: 2.5, localClientCount: 10 }
    ];
    return clients;
  };

  const generateMockBrandRatings = (): BrandRating[] => {
    return [
      { brand: 'Tesla', averageDriverRating: 4.7, rentCount: 256 },
      { brand: 'Toyota', averageDriverRating: 4.6, rentCount: 388 },
      { brand: 'Honda', averageDriverRating: 4.5, rentCount: 230 },
      { brand: 'Ford', averageDriverRating: 4.2, rentCount: 76 },
      { brand: 'Chevrolet', averageDriverRating: 4.4, rentCount: 179 }
    ];
  };

  // Run initial report generation
  useEffect(() => {
    generateReport();
  }, []);

  // Render stars for ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Generate Reports</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select a report type and customize parameters to generate insights about your service
        </p>
      </div>
      
      {/* Report Selection and Parameters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={generateReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Type Selection */}
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                id="report-type"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="top-clients">Top Clients by Rent Count</option>
                <option value="car-model-usage">Car Model Usage Statistics</option>
                <option value="driver-performance">Driver Performance Overview</option>
                <option value="client-driver-cities">Client-Driver City Cross-Reference</option>
                <option value="problematic-drivers">Problematic Local Drivers</option>
                <option value="brand-ratings">Brand Ratings and Rides</option>
              </select>
            </div>
            
            {/* Dynamic Parameters based on selected report */}
            <div>
              {selectedReport === 'top-clients' && (
                <div>
                  <label htmlFor="top-k" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Top Clients (K)
                  </label>
                  <input
                    id="top-k"
                    type="number"
                    min="1"
                    max="10"
                    value={topK}
                    onChange={(e) => setTopK(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {selectedReport === 'client-driver-cities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="city1" className="block text-sm font-medium text-gray-700 mb-1">
                      Client City
                    </label>
                    <select
                      id="city1"
                      value={city1}
                      onChange={(e) => setCity1(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {availableCities.map((city) => (
                        <option key={`city1-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city2" className="block text-sm font-medium text-gray-700 mb-1">
                      Driver City
                    </label>
                    <select
                      id="city2"
                      value={city2}
                      onChange={(e) => setCity2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {availableCities.map((city) => (
                        <option key={`city2-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Report Results */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedReport === 'top-clients' && `Top ${topK} Clients by Rent Count`}
          {selectedReport === 'car-model-usage' && 'Car Model Usage Statistics'}
          {selectedReport === 'driver-performance' && 'Driver Performance Overview'}
          {selectedReport === 'client-driver-cities' && `Clients from ${city1} with Drivers from ${city2}`}
          {selectedReport === 'problematic-drivers' && 'Problematic Local Drivers (Chicago)'}
          {selectedReport === 'brand-ratings' && 'Brand Ratings and Rides'}
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Top Clients Report */}
            {selectedReport === 'top-clients' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Frequent Car</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topClients.map((client, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.rentCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.mostFrequentCar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Car Model Usage Report */}
            {selectedReport === 'car-model-usage' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {carModelUsage.map((model, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.modelId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="h-4 w-4 rounded-full mr-2" 
                              style={{ 
                                backgroundColor: 
                                  model.color.toLowerCase() === 'silver' ? '#C0C0C0' :
                                  model.color.toLowerCase() === 'blue' ? '#1E40AF' :
                                  model.color.toLowerCase() === 'red' ? '#DC2626' :
                                  model.color.toLowerCase() === 'black' ? '#1F2937' :
                                  model.color.toLowerCase() === 'white' ? '#F9FAFB' :
                                  model.color.toLowerCase() === 'gray' ? '#6B7280' :
                                  '#FFFFFF',
                                border: model.color.toLowerCase() === 'white' ? '1px solid #E5E7EB' : 'none'
                              }}
                            ></div>
                            <span className="text-sm text-gray-700">{model.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.constructionYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{model.transmissionType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{model.rentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Driver Performance Report */}
            {selectedReport === 'driver-performance' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rides</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {driverPerformance.map((driver, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.totalRents}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-2">{driver.averageRating.toFixed(1)}</span>
                            <div className="flex text-sm">{renderStars(Math.round(driver.averageRating))}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Client-Driver City Cross-Reference Report */}
            {selectedReport === 'client-driver-cities' && (
              <>
                {cityCrossReference.length === 0 ? (
                  <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">No clients from {city1} have booked rides with drivers from {city2}.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client City</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver City</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cityCrossReference.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.clientName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.clientEmail}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.clientCity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.driverName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.driverCity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {/* Problematic Drivers Report */}
            {selectedReport === 'problematic-drivers' && (
              <>
                {problematicDrivers.length === 0 ? (
                  <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">No problematic drivers found in Chicago.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rides</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Client Count</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {problematicDrivers.map((driver, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-2">{driver.averageRating.toFixed(1)}</span>
                                <div className="flex text-sm">{renderStars(Math.round(driver.averageRating))}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.rentCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{driver.localClientCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {/* Brand Ratings Report */}
            {selectedReport === 'brand-ratings' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Driver Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rides</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brandRatings.map((brand, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{brand.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-2">{brand.averageDriverRating.toFixed(1)}</span>
                            <div className="flex text-sm">{renderStars(Math.round(brand.averageDriverRating))}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{brand.rentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* Export Options */}
        {!loading && (
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Export as CSV
            </button>
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}