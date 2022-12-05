# Welcome to our Fall 2022 CS 171 Final Project!

## Team Members: 
* Lauren Wattendorf - lwattendorf@college.harvard.edu
* Cindy Liu - cindyliu@college.harvard.edu
* Iris Yan- irisyan@college.harvard.edu

## Project Title: 
### Seeing Sound - Visualizing Spotify Statistics

## Project Abstract:
We will examine listener and music trends on Spotify using Spotify Research’s data on playlists and streaming sessions. This project is motivated by our shared love for curating playlists and exploring new music, most often fueled by Spotify’s database of songs, recommendations, and features such as “Spotify Wrapped” and its analysis of music preferences. In our project, we will be analyzing both trends on an individual level, e.g. visualizing common music genres and themes, a dashboard of minutes spent, top artists/songs, a color that corresponds to the overall music portfolio of a user, etc., and an interpersonal level, e.g., visualizing how these previously discussed individual attributes lend way to similarities and differences between multiple users. 

## Project Process Book:
Our process book is here: https://docs.google.com/document/d/1PjwiiLB2XYJPOPnJjx-fyO9-cVUHOWfq2ThPgl2WOKE/edit

This file is also attached as PDF in this directory!

## Project Video:
The video rundown of our project can be found here: https://drive.google.com/file/d/1kQIl63GD8ayL3M0FNM75nfPQ5GC3liZh/view?usp=share_link

## How to Use:
Our code is implemented with the base website in index.html, 
with the only external libraries used being JavaScript libraries for D3, Bootstrap, and a slider
used for implementing our bar chart visualization. 

The individual visualizations are instantiated from the main.js file, with each individual 
visualization having a placeholder in index.html and implemented in its own 'vis'.js file, 
one per visualization. These files include the wrangleData, updateVis, and initVis functions
in a similar structure as used in class. The data used throughout the visualization can be found in 
the 'data' folder, which includes aggregate data, data for each of our individual users, and 
the Python processing scripts used to convert raw data into a usable form. 

Between index.html, the JavaScript files (stored in js) and the data files (stored in data),
these are the primary files pulled together and used for rendering our final website, 
which is obtained by running index.html. 

More detailed implementation notes can be found in the comments of each of the 
individual files. The write up of the different data fields can be found in data.md, in the data folder.

## Live Site:
This project is hosted live at 
https://irisyan03.github.io/cs171project/