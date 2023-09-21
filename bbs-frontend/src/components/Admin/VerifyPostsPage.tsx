import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Container, Grid, Typography } from '@mui/material';
import { Post } from '../../types';
import {useAuth} from '../../AuthContext';
import { retrieveToken } from '../Security';

function VerifyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useNavigate();
  const { role_id } = useAuth();

  if (role_id !== 2) {
    return <h1>Access denied</h1>;
  }

  useEffect(() => {
    // Fetch Posts from backend and update state
    const fetchPosts = async () => {
      let token = await retrieveToken();
      const res = await fetch('http://localhost:8000/admin/unverified-posts', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': token,
        },
      });
      const data: Post[] = await JSON.parse(await res.json());
      console.log("Data for posts object: " + data);
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  function handleCheckboxChange(post: Post) {
    // Toggle the selected post
    setSelected((prevSelected) => {
      if (prevSelected.includes(post)) {
        return prevSelected.filter((item) => item !== post);
      } else {
        return [...prevSelected, post];
      }
    });
  }

  async function handleSubmit() {
    let token = await retrieveToken();
    // Send the selected Posts back to the backend
    console.log("Handling submit");
    let response = await fetch('http://localhost:8000/admin/verify-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(selected),
    }).catch((error) => console.error(error));
    // Redirect to the admin home page
    //if (response?.ok) {
      let updatedPosts: Post[] = posts.filter((post) => !selected.some((selectedPost) => selectedPost.title === post.title && selectedPost.callsign === post.callsign && selectedPost.content === post.content));
      console.log(updatedPosts);
      setPosts(updatedPosts);
      setSelected([]);
    //}
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Verify Posts
          </Typography>
        </Grid>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="subtitle1">{`${post.name} (${post.callsign})`}</Typography>
                <Typography variant="body1">{post.content}</Typography>
                <Typography variant="caption">{`Created at: ${post.created_at}`}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Checkbox
                  checked={selected.includes(post)}
                  onChange={() => handleCheckboxChange(post)}
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
            Approve Selected Posts
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default VerifyPostsPage;