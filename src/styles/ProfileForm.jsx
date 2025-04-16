// Import necessary modules and components
import React from 'react';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate } from 'react-router-dom';

// Define the ProfileForm component
const ProfileForm = ({ userData }) => {
  const navigate = useNavigate();

  // Replace your existing print function
  const handlePrint = () => {
    navigate('/print');
  };

  return (
    <div>
      {/* Update your print button */}
      {userData && (
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ mb: 2, display: 'block', ml: 'auto', mr: 'auto' }}
          className="no-print"
        >
          Print Diet Plan
        </Button>
      )}    )}
    </div>    </div>
  );



export default ProfileForm;};};

export default ProfileForm;