import json
from datetime import datetime

class User:
    def __init__(self, name, playlists, tracks):
        self.name = name
        self.playlists = playlists
        self.tracks = tracks
    

# Iris Data Processing
f = open('IY_data/Playlist1.json')

# List of playlists
playlists = json.load(f)["playlists"]

# Number of playlists
print(len(playlists))
cleaned_playlist_data = []

for p in range(len(playlists)):
    # playlist name
    print(playlists[p]["name"])
    cleaned_playlist_data.append({})
    cleaned_playlist_data[p]["name"] = playlists[p]["name"]
    cleaned_playlist_data[p]["lastModifiedDate"] = playlists[p]["lastModifiedDate"]

    # tracks for playlist p
    cleaned_playlist_data[p]["tracks"] = []
    # goes track by track
    for t in playlists[p]["items"]: 
        cleaned_playlist_data[p]["tracks"].append(
            {"trackName": t["track"]["trackName"], 
            "artistName": t["track"]["artistName"], 
            "albumName": t["track"]["albumName"],
            "trackUri": t["track"]["trackUri"],
            "dateAdded": t["addedDate"]}
        )

f.close()

new = open("IY_data_cleaned.json", "x")
new.write(json.dumps(cleaned_playlist_data, indent = 4))
new.close()





    
