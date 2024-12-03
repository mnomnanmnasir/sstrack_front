import React, { useEffect, useState } from 'react';
import SaSidebar from './component/sidebar/saSidebar';
import Dashboard from './component/Dashboard/Dasboard';
import TotalCompanies from './component/TotalCompanies/TotalCompanies';
import RequestContent from './component/RequestsContent/RequestsContent';
import Financials from './component/FinancialsContent/FinancialsContent';
import Reports from './component/ReportsContent/ReportsContent';
import { useNavigate } from 'react-router-dom';


const SaMain = () => {
  const [selectedContent, setSelectedContent] = useState('Dashboard');
  const [userType, setUserType] = useState(null); // Track the user type
  const [loading, setLoading] = useState(true); // Initial content
  const navigate = useNavigate(); 




  // Check userType from localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem('items'); // Retrieve the stringified object
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems); // Parse the JSON string
        setUserType(parsedItems.userType); // Set the userType in state

        if (parsedItems.userType !== 'system Admin') {
          // Redirect if userType is not 'system Admin'
          alert('Access denied. Redirecting to home.');
          navigate('/'); // Redirect to home
        }
      } catch (error) {
        console.error('Error parsing items from localStorage:', error);
        alert('Failed to retrieve user type. Redirecting to home.');
        navigate('/'); // Redirect to home on error
      }
    } else {
      // If no items are found, redirect to home
      alert('User type is not valid.');
      navigate('/sALogin');
    }
    setLoading(false); // Data has been loaded
  }, [navigate]);






  const renderContent = () => {
    switch (selectedContent) {
      case 'Dashboard':
        return <Dashboard onNavigate={setSelectedContent} />;
      case 'Total Companies':
        return <TotalCompanies />;
      case 'Requests':
        return <RequestContent />;
      case 'Financials':
        return <Financials />;
      // case 'Reports':
      //   return <Reports/>;
      default:
        return <Dashboard onNavigate={setSelectedContent} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: 'auto',
      minWidth:'100%',
      minHeight: '100vh',
      height: 'auto',
      backgroundColor: '#fff',
    }}>
      {/* Pass both the selected content and the handler to update it */}
      <SaSidebar
        selectedItem={selectedContent}
        onSelectItem={setSelectedContent}
      /> {/* Pass callback to update content */}

      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#fff',
      }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default SaMain;
