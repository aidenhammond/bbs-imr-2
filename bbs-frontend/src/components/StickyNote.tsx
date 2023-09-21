import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import '../styles/StickyNote.css';

const StickyNote = (props: any) => {
    const {post} = props as {post: Post};
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        // Generate a random angle between -20 and 20 degrees
        const randomAngle = Math.floor(Math.random() * 3) - 2;
        setAngle(randomAngle);
    }, []);

    const noteStyle = {
        transform: `rotate(${angle}deg)`,
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
    };

    return (
        <Link className="sticky-note-link" to={`/post/${post.id}`}>
            <div className="sticky-note" style={noteStyle}>
                <h3 className="sticky-note-title">{post.title}</h3>
                <p className="sticky-note-content">{post.content}</p>
            </div>
        </Link>
    );
};

export default StickyNote;