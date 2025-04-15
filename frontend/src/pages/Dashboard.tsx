import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Products from './Products.tsx'
import { clearAuth } from '../store/slices/authSlice.ts'
import { logout } from '../services/api.ts'

export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {

  };

  const handleLogout = async () => {
    setAnchorEl(null);

    try {
      await logout()
      localStorage.removeItem('authToken');
      dispatch(clearAuth());
      window.location.href = '/login';
    } catch(err) {
      console.error('Error logging out:', err);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <Avatar>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
        <Products />
      </Box>
    </Box>
  );
}
