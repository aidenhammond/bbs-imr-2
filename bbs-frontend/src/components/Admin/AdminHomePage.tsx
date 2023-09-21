import React, { useContext } from 'react';
import {useAuth} from '../../AuthContext';
import { Button, Container, Grid, Typography } from '@mui/material';
import '../../styles/Admin/AdminHomePage.css';
import { Link } from 'react-router-dom';
import MEMESat_1_Logo from '../../assets/MEMESAT-1.png'


function AdminHomePage() {
  const { role_id } = useAuth();

  if (role_id !== 2) {
    return <h1>Access denied</h1>;
  }

  return (
    <div className={"admin-home"}>
      <div id="admin-home-background" />
      <img src={MEMESat_1_Logo} className='admin-home-memelogo'/>

      <Container maxWidth="md" className={"admin-home-container"}>
        <Grid container spacing={4}>
          <Grid item xs={12} className={"admin-home-title"}>
            <Typography variant="h4" align="center">
              Admin Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={"admin-home-section"}>
              <Typography variant="h5" align="center">
                Verify
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={"admin-home-button"}
                component={Link}
                to="/admin/verify-posts"
              >
                Verify Message Submissions
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={"admin-home-button"}
                onClick={() => console.log('Verify Image Submissions')}
              >
                Verify Image Submissions
              </Button>
            </div>
            <div className={"admin-home-section"}>
              <Typography variant="h5" align="center">
                User Management
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={"admin-home-button"}
                component={Link}
                to="/admin/users"
              >
                Users
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default AdminHomePage;