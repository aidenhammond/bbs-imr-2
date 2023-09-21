import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import StickyNote from './StickyNote';
import '../styles/Posts.css'

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts (replace with a real API call)
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('http://localhost:8000/posts', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data: Post[] = JSON.parse(await res.json());
      console.log("Data for posts object: " + data);
      setPosts(data);
      setLoading(false);
    };

    fetchPosts()
  }, []);

  return (
    <div className='posts-page'>
      <div id="posts-page-background"/>
      <h1 className='title'>Posts</h1>
      <div className='sticky-note-container'>
        {loading || posts.length === 0 ? null : posts.map((post) => (
          <div key={post.id}>
            <StickyNote post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
