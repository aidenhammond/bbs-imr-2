import { useState, useEffect } from 'react';
import { Button, Checkbox, Container, Grid, Typography } from '@mui/material';
import { User } from '../../types';
import { retrieveToken } from '../Security';
import React from 'react';
import { useAuth } from '../../AuthContext';
import "../../styles/Admin/UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { role_id } = useAuth();

  if (role_id !== 2) {
    return <h1>Access denied</h1>;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await retrieveToken();
        const response = await fetch('http://localhost:8000/admin/users', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': token,
          },
        });
        let json = await response.json();
        console.log(json)
        setUsers(json);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleCheckboxChange = (user: User) => {
    setSelected((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((selected) => selected !== user)
        : [...prevSelected, user],
    );
  };

  const handleSubmit = async () => {
    try {
      const token = await retrieveToken();
      // to do, delete in backend
      const updatedUsers = users.filter(
        (user) => !selected.includes(user),
      );
      setUsers(updatedUsers);
      setSelected([]);
      const response = await fetch('http://localhost:8000/admin/users', {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': token,
          },
          body: JSON.stringify({users: selected}),
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Users
          </Typography>
        </Grid>
        {loading ? (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Loading...
            </Typography>
          </Grid>
        ) : (
          <>
            {users.map((user) => (
              <Grid item xs={12} key={user.id}>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Typography variant="subtitle1" color={"black"}>{user.username}</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                    <Typography variant="caption">
                      Role: {user.role_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Checkbox
                      checked={selected.includes(user)}
                      onChange={() => handleCheckboxChange(user)}
                      disabled={user.role_id === 2}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                disabled={selected.length === 0}
                onClick={handleSubmit}
              >
                Delete Selected Users
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default UsersPage;
