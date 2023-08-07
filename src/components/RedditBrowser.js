import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./redditbrowser.css"

const RedditBrowser = () => {
  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sortOrder, setSortOrder] = useState('hot'); // Default sort order is 'hot'
  const [inputSubreddit, setInputSubreddit] = useState('');

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

  useEffect(() => {
    if (selectedSubreddit) {
      // Fetch list of posts for the selected subreddit and current sort order
      axios.get(`https://www.reddit.com/r/${selectedSubreddit}/${sortOrder}.json`)
        .then((response) => {
          setPosts(response.data.data.children);
          setSelectedPost(null); // Reset selected post when changing subreddit or sort order
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [selectedSubreddit, sortOrder]);

  const handleSubredditClick = (subreddit) => {
    setSelectedSubreddit(subreddit.data.display_name);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSubredditInputChange = (event) => {
    setInputSubreddit(event.target.value);
  };

  const handleSubredditSubmit = (event) => {
    event.preventDefault();
    setSelectedSubreddit(inputSubreddit);
    setInputSubreddit(''); // Clear the input field after submitting
  };

  const isImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
  };

  return (
    <div className="reddit-browser">
      <div className="navbar">
      <h2>Reddit Browser</h2>
        <form onSubmit={handleSubredditSubmit}>
          <input
            type="text"
            placeholder="Search subreddit"
            value={inputSubreddit}
            onChange={handleSubredditInputChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="container">
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
        {selectedSubreddit ? (
          <>
            <h2>{selectedSubreddit}</h2>
            <div>
              <label>
                Sort By
                <select value={sortOrder} onChange={handleSortOrderChange}>
                  <option value="hot">Hot</option>
                  <option value="new">New</option>
                </select>
              </label>
            </div>
          </>
        ) : (
          <h2></h2>
        )}
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
    </div>
  );
};

export default RedditBrowser;