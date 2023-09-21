import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/NewPost.css"
import { retrieveToken } from './Security';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [content, setContent] = useState('');
  const history = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Save the new post (replace with a real API call)
    // replace the console.log statement with an API call 
    //to save the new post to your backend server. 
    //After the API call is complete, you can redirect the user to the appropriate page,
    // such as the list of posts or the newly created post's detail page.
    try {
      const token = await retrieveToken();
      if (!token) return;
      const response = await fetch('http://localhost:8000/posts', {
        method: "POST", 
        body: JSON.stringify({title: title, name: name, callsign: callsign, content: content}),
        headers: {
          "Content-Type": "application/json",
          'Authorization': token,
        },
      });
      const data = await response.json();
      // Handle the response data
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    // Redirect to the posts page after successful submission
    history('/posts');
  };

  return (
    <div className={"new-post-page"}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className={"submit-form"}>
        
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
       
      
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          ></input>
        
          <label htmlFor="callsign">Callsign:</label>
          <input
            id="callsign"
            value={callsign}
            onChange={(event) => setCallsign(event.target.value)}
            required
          ></input>
        
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          ></textarea>
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewPost;
