**FilmFolio - Movie Library Web Application**

FilmFolio is a web application that allows users to search for movies, view details, and create personalized movie lists. These lists can be public or private, providing flexibility for users to share their favorite movies with others or keep them private. The application uses the OMDB API to fetch movie details.

Features

User Authentication: Sign Up and Sign In functionality.
Movie Search: Search for movies using the OMDB API.
Movie Lists: Create and manage movie lists (similar to YouTube playlists).
Public and Private Lists: Lists can be public (shareable via link) or private.
Responsive Layout: A user-friendly interface inspired by popular websites/applications.


Steps to Use FilmFolio

1. User Authentication

Sign Up: New users need to create an account by providing their First Name, Last Name, Email, Password, and an optional Profile Picture.

Sign In: Existing users can log in using their email and password.

2. Home Page

After logging in, users are redirected to the home page where they can see a selection of movie details.


3. Navigation Bar

Left Side: A toggle button that shows the user's created playlists. If no playlists are created, a message indicating "No playlist created" is displayed.

Middle: A search bar that allows users to search for movies.

Right Side: An avatar displaying the user's profile picture (or an anonymous image if none is uploaded).


4. Searching for Movies

Users can type the name of a movie into the search bar and click the search icon.

If the search query returns results, they are displayed below the search bar.

Each movie result includes an "Add to Playlist" button.


5. Adding Movies to Playlists


Clicking the "Add to Playlist" button opens a modal with two sections:

Create New Playlist: Allows the user to create a new playlist and add the selected movie to it.

Existing Playlists: Displays the user's existing playlists, allowing them to add the movie to one of these lists.

6. Viewing and Managing Playlists

Clicking the toggle button opens a drawer showing all the user's created playlists.

Clicking on a playlist name displays all movies added to that playlist.

Options available within the playlist view:

Share Playlist: Copies a URL to the clipboard, allowing the user to share the playlist. The playlist must be public for others to view it.

Change Privacy: Toggles the playlist between public and private. By default, playlists are public.
