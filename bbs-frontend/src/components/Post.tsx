import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post as PostType } from '../types';
import "../styles/Post.css"

const Post: React.FC = () => {
  const { id } = useParams() as {id : string};
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // Fetch post by ID (replace with a real API call)
  useEffect(() => {
    // Simulate fetching a single post
    async function getPost() {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      let new_post: PostType = await response.json();
      console.log(new_post);
      setPost(new_post);
      setLoading(false)
    }
    getPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="single-post">
      <p className="post-date">{new Date(post.created_at!).toLocaleString()}</p>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-author">By {post.name}</p>
      <div className="post-content">{post.content}</div>
    </div>
  );
};

export default Post;
