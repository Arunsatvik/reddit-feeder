import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./redditbrowser.css"

const RedditBrowser = () => {

  const [darkMode, setDarkMode] = useState(false); // Add dark mode state

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };


  const [subreddits, setSubreddits] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sortOrder, setSortOrder] = useState('hot');
  const [inputSubreddit, setInputSubreddit] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [postHistory, setPostHistory] = useState([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(-1);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    // Load saved state from local storage on component mount
    const savedState = localStorage.getItem('redditBrowserState');
  
    if (savedState && !isInitialMount) {
      const parsedState = JSON.parse(savedState);
  
      if (parsedState.selectedSubreddit) {
        setSelectedSubreddit(parsedState.selectedSubreddit);
      }
      if (parsedState.sortOrder) {
        setSortOrder(parsedState.sortOrder);
      }
      if (parsedState.selectedPost) { // Update state for selected post
        setSelectedPost(parsedState.selectedPost);
      }
      if (parsedState.currentPostIndex >= 0) {
        setCurrentPostIndex(parsedState.currentPostIndex);
      }
      if (parsedState.postHistory) {
        setPostHistory((prevPostHistory) => [
          ...prevPostHistory,
          ...parsedState.postHistory,
        ]);
      }
    }
  
    setIsInitialMount(false);
  }, [isInitialMount]);

  useEffect(() => {
    // Load selected post index from local storage
    const savedSelectedPostIndex = localStorage.getItem('selectedPostIndex');
    if (savedSelectedPostIndex) {
      setCurrentPostIndex(parseInt(savedSelectedPostIndex));
    }
  }, []);

  useEffect(() => {
    // Save state to local storage whenever it changes
    if (!isInitialMount) {
      const stateToSave = JSON.stringify({
        selectedSubreddit,
        sortOrder,
        selectedPost
      });
      localStorage.setItem('redditBrowserState', stateToSave);
    }
  }, [selectedSubreddit, sortOrder, selectedPost, isInitialMount]);

  useEffect(() => {
    setCanGoBack(currentPostIndex > 0);
    setCanGoForward(currentPostIndex < postHistory.length - 1);
  }, [currentPostIndex, postHistory]);

  useEffect(() => {
    if (inputSubreddit.length > 0) {
      axios
        .get(`https://www.reddit.com/subreddits/search.json?q=${inputSubreddit}`)
        .then((response) => {
          setAutocompleteResults(response.data.data.children);
        })
        .catch((error) => {
          console.error('Error fetching autocomplete results:', error);
        });
    } else {
      setAutocompleteResults([]);
    }
  }, [inputSubreddit]);

  useEffect(() => {
    axios
      .get('https://www.reddit.com/subreddits/popular.json')
      .then((response) => {
        setSubreddits(response.data.data.children);
      })
      .catch((error) => {
        console.error('Error fetching subreddits:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedSubreddit) {
      axios
        .get(`https://www.reddit.com/r/${selectedSubreddit}/${sortOrder}.json`)
        .then((response) => {
          setPosts(response.data.data.children);
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
        });
    }
  }, [selectedSubreddit, sortOrder]);

  useEffect(() => {
    if (currentPostIndex >= 0 && currentPostIndex < postHistory.length) {
      setSelectedPost(postHistory[currentPostIndex]);
    }
  }, [currentPostIndex, postHistory]);

  const handleSubredditClick = (subreddit) => {
    setSelectedSubreddit(subreddit.data.display_name);
    setSelectedPost(null);
    setPostHistory([]); // Reset post history when a new subreddit is selected
    setCurrentPostIndex(-1); // Reset current post index
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    if (currentPostIndex !== postHistory.length - 1) {
      // If the current post is not the last post in history, remove the forward history and add the new post to history
      setPostHistory((prevHistory) => prevHistory.slice(0, currentPostIndex + 1).concat(post));
      setCurrentPostIndex((prevIndex) => prevIndex + 1);
    } else {
      // If the current post is the last post in history, simply add the new post to history
      setPostHistory((prevHistory) => [...prevHistory, post]);
      setCurrentPostIndex((prevIndex) => prevIndex + 1);
    }
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
    setInputSubreddit('');
  };

  const handleBackClick = () => {
    if (canGoBack) {
      setCurrentPostIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleForwardClick = () => {
    if (canGoForward) {
      setCurrentPostIndex((prevIndex) => prevIndex + 1);
    }
  };

  const isImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
  };

  return (
    <div className={`reddit-browser ${darkMode ? 'dark-mode' : ''}`}>
      <div className="navbar">
        <h2>Reddit Browser</h2>
        <div className="move-buttons">
          {/* Back Button */}
          <button className="nav-button" onClick={handleBackClick} disabled={!canGoBack}>
            Back
          </button>
          {/* Forward Button */}
          <button className="nav-button" onClick={handleForwardClick} disabled={!canGoForward}>
            Forward
          </button>
        </div>

        <div className="dropdown-menu">
          <button className="dropdown-toggle">Menu</button>
          <div className="dropdown-content">
            <button onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        
        <form onSubmit={handleSubredditSubmit}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search subreddit"
              value={inputSubreddit}
              onChange={handleSubredditInputChange}
            />
            {/* Show autocomplete dropdown */}
            {inputSubreddit.length > 0 && (
              <div className="autocomplete-dropdown">
                {autocompleteResults.map((result) => (
                  <div
                    key={result.data.display_name}
                    className="autocomplete-option"
                    onClick={() => handleSubredditClick(result)}
                  >
                    {result.data.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
