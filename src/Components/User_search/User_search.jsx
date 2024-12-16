import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function FullWidthTextField() {
  return (
    <Box sx={{ width: 400, height: 45, maxWidth: '100%' }}>
      <TextField
        fullWidth
        label="User name"
        id="fullWidth"
        variant="outlined"
        sx={{
          input: {
            color: 'white', 
            padding: '8px'
          },
          '& .MuiOutlinedInput-root': {
            height: '45px',
          
            '& fieldset': {
              border: '1px solid #8C8C8C',
            },
            '&:hover fieldset': {
              border: '1px solid white',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid white', 
            },
          },
          '& label': {
            color: 'white', 
            fontSize: '14px',
            marginTop:"-1px" 
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white', 
          },
        }}
      />
    </Box>
  );
}
