# Reddit Feeder - Single Page Application

## Overview

Reddit Feeder is a single page application built using React that allows users to browse through Reddit posts. The application interacts with the Reddit API to fetch and display posts from different subreddits. Users can view post details, change sort order settings, navigate through post history, and even toggle a dark mode theme.

## Base Requirements

- Display a panel with details of a selected post, including post title, author, image/preview, and text if available.
- List posts from a selected subreddit with active styling for selected and hovered items.
- List of subreddits with active styling for selected and hovered items.

## Leveled Requirements

### Level 1

- Implement the base application with the above features.

### Level 2

- Add a header displaying the current subreddit and post title.
- Include controls to change the sort order settings for posts (e.g., "hot" vs. "new").
- Implement an input in the header for users to type and submit a subreddit name directly.

### Level 3

- Implement subreddit search autocomplete using the Reddit API.
- As users type into the subreddit search input, populate autocomplete results in the subreddit list.

### Level 4

- Add navigation buttons to move forward and backward in post history.
- Clicking the back button takes the user to the previously selected post for the same subreddit.

### Level 5

- Save application state between refreshes using local storage.
- When the page is refreshed, load the same subreddit, post, and sort order settings.

### Level 6

- Integrate a drop-down menu in the header.
- Add at least one menu option: a dark mode theme toggle button.
- Toggle dark mode to switch between light background/dark text and dark background/light text.

### Level 7

- Move the back button to the header for universal action undo.
- Clicking the back button undoes post changes, subreddit changes, theme changes, and other settings.

## Installation

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd reddit-feeder`
3. Install dependencies: `npm install`

## Usage

1. Run the development server: `npm start`
2. Open a web browser and go to `http://localhost:3000`

## Deployment

The application is deployed on GitHub Pages. You can access it [here](https://yourusername.github.io/reddit-feeder).

## Source Files

You can find the source code in the [GitHub repository](https://github.com/yourusername/reddit-feeder).

## Acknowledgments

This project was created as part of a React application development exercise. Special thanks to the Reddit API for providing the data used in this application.
