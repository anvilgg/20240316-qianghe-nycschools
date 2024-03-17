import React, { useState, useEffect } from 'react';
import './App.css';
import Pagination from './Pagination';
import SATInfo from './SatInfo';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dbn: '',
    schoolName: '',
    city: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [satData, setSatData] = useState(null);
  const [uniqueCities, setUniqueCities] = useState([]);

  // Load School data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://data.cityofnewyork.us/resource/s3k6-pzi2.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
        extractUniqueCities(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  // Filter table rows
  const filteredData = data.filter(school =>
    school.dbn.toLowerCase().includes(filters.dbn.toLowerCase()) &&
    school.school_name.toLowerCase().includes(filters.schoolName.toLowerCase()) &&
    (filters.city === '' || school.city.toLowerCase() === filters.city.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch SAT Results data for a specific DBN
  const fetchSATResults = async (dbn) => {
    try {
      const response = await fetch(`https://data.cityofnewyork.us/resource/f9bf-2cp4.json?dbn=${dbn}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setSatData(jsonData[0]);
    } catch (error) {
      console.error('Error fetching SAT results:', error);
    }
  };

  const extractUniqueCities = (data) => {
    const cities = data.map(school => school.city);
    const uniqueCities = [...new Set(cities)];
    setUniqueCities(uniqueCities);
  };

  // Handle link click
  const handleLinkClick = (dbn) => {
    fetchSATResults(dbn);
  };

  return (
    // With more times I would extract filters & highschool table into their own respective file/component for better readability
    <div className="container">
      <h1 className="title">NYC High School Information</h1>
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">DBN:</label>
          <input
            type="text"
            name="dbn"
            value={filters.dbn}
            onChange={handleFilterChange}
            placeholder="Filter DBN..."
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">School Name:</label>
          <input
            type="text"
            name="schoolName"
            value={filters.schoolName}
            onChange={handleFilterChange}
            placeholder="Filter School Name..."
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label className="filter-label">City:</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">Select City...</option>
            {uniqueCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>DBN</th>
                <th>School Name</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((school, index) => (
                <tr key={index}>
                  <td>
                    <a href="#" onClick={() => handleLinkClick(school.dbn)} className="dbn-link">
                      {school.dbn}
                    </a>
                  </td>
                  <td>{school.school_name}</td>
                  <td>{school.city}</td>
                  <td>{school.state_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}

      <SATInfo
        satData = {satData}
      />
      
    </div>
  );
};

export default App;
