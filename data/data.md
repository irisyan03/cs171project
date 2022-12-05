# Explanation of Data Fields

## Overview
As discussed briefly in README.md, the data folder contains all the different types of data used in this project.
In this document, we will break down the data in each folder and explain its use.

## Individual Data
The data contained in *initials*_data folders has the individual data for each of our three project members. 
Within each folder, there are the initial raw data files downloaded from Spotify
(which do not have the initials in front of them) in addition to the post-processed data (described in more detail below). Primary data fields include playlist and song data, including artist, album name, trackUri,
date added to playlists, time played, and number of milliseconds played.

Specifically, these are processed in the .py scripts to generate the cleaned data:
* The all_songs file contains a merged version of all the StreamingHistory files,
artist, album name, track shower, and unique Uri. 
 * The data_cleaned and playlist_songs file contain a cleaned version of the Playlist files, which contain the playlist name,
number of playlist tracks, song, album, and artist name, and the date the track was added.

Lastly, the top_stats files consist of analyzed metadata statistics from individual songs (calculated in the Python script), such as playlist lengths, 
number of songs, duration of songs listened to, average length of playlists, and most listened to artists and songs. The top_songs_attributes include
data pulled manually from the Spotify Web API for the top songs for each user. 

## Decade Data
This data folder is included for thoroughness, but it contains raw data that is then processed and stored in its merged form in the decade_data.csv
file in the aggregate data folder, which is the file (and folder) actually used for data in our website. 

## Aggregate Data
The aggregate data folder contains the files used for the global data statistics presented throughout the visualization.
For instance, decade_data.csv contains the aggregated statistics from the merged decade data, calculating average values for each
attribute across decades, which is done in the decade_dataprocessing.py script. The attributes are derived from those provided
by the Spotify Web API (and are described in more detail in the decade_data.csv file).

The general_dataprocessing.py script takes the 
large playlist_data.json file, which is pulled from Spotify's Million Playlists Dataset. Similar to the calculations done from the playlist_songs
files to the aggregated top_stats, the playlist_data.json data is aggregated to give general_top_stats, measuring the most frequently 
played artists and songs and average length of the playlists, parallel with the individual top_stats calculation.

## Card
This folder stores simply the image data needed for downloading the .png files from the 
cards in our last visualization, making a takeaway for users that they can share and take with them 
beyond just what is seen on the website when it is open. 