import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./redditbrowser.css"

const RedditBrowser = () => {
  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch list of subreddits
    axios.get('https://www.reddit.com/subreddits/popular.json')
      .then((response) => {
        setSubreddits(response.data.data.children);
      })
      .catch((error) => {
        console.error('Error fetching subreddits:', error);
      });
  }, []);

  const handleSubredditClick = (subreddit) => {
    // Fetch list of posts for the selected subreddit
    setSelectedSubreddit(subreddit.data.display_name);
    axios.get(`https://www.reddit.com/r/${subreddit.data.display_name}/hot.json`)
      .then((response) => {
        setPosts(response.data.data.children);
        setSelectedPost(null); // Reset selected post when changing subreddit
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log(post.data.url);
  };

  const isImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
  };

  return (
    <div className="reddit-browser">
      <div className="sidebar">
        <h2>Subreddits</h2>
        <ul>
          {subreddits.map((subreddit) => (
            <li
              key={subreddit.data.display_name}
              onClick={() => handleSubredditClick(subreddit)}
              className={selectedSubreddit === subreddit.data.display_name ? 'active' : ''}
            >
              {subreddit.data.display_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        <h2>{selectedSubreddit}</h2>
        <ul>
          {posts.map((post) => (
            <li
              key={post.data.id}
              onClick={() => handlePostClick(post)}
              className={selectedPost && selectedPost.data.id === post.data.id ? 'active' : ''}
            >
              <h3>{post.data.title}</h3>
              <p>Author: {post.data.author}</p>
            </li>
          ))}
        </ul>
      </div>


      {selectedPost && (
        <div className="post-details">
          <div className="post-info">
            <h3>{selectedPost.data.title}</h3>
            <p>Author: {selectedPost.data.author}</p>
          </div>
          <p>{selectedPost.data.selftext}</p>
          {isImageUrl(selectedPost.data.url) ? (
            <img src={selectedPost.data.url} alt='new' />
          ) : (
            <a href={selectedPost.data.url} target="_blank" rel="noopener noreferrer">
              {selectedPost.data.url}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default RedditBrowser;