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
total_songs = 0

for p in range(len(playlists)):
    # playlist name
    # print(playlists[p]["name"])
    cleaned_playlist_data.append({})
    cleaned_playlist_data[p]["name"] = playlists[p]["name"]
    cleaned_playlist_data[p]["lastModifiedDate"] = playlists[p]["lastModifiedDate"]

    # tracks for playlist p
    cleaned_playlist_data[p]["tracks"] = []
    counter = 0
    # goes track by track
    for t in playlists[p]["items"]: 
        counter += 1
        cleaned_playlist_data[p]["tracks"].append(
            {"trackName": t["track"]["trackName"], 
            "artistName": t["track"]["artistName"], 
            "albumName": t["track"]["albumName"],
            "trackUri": t["track"]["trackUri"],
            "dateAdded": t["addedDate"]}
        )
    cleaned_playlist_data[p]["num_tracks"] = counter
    total_songs += counter

f.close()

new = open("IY_data_cleaned.json", "w")
new.write(json.dumps(cleaned_playlist_data, indent = 4))
new.close()


# Concatenate streaming history in chronological order
f0 = open("IY_data/StreamingHistory0.json", "r")
f1 = open("IY_data/StreamingHistory1.json", "r")
f2 = open("IY_data/StreamingHistory2.json", "r")
history_0 = json.load(f0)
history_1 = json.load(f1)
history_2 = json.load(f2)

merged_history = []
merged_history.extend(history_0)
merged_history.extend(history_1)
merged_history.extend(history_2)

print(merged_history[:5])

# calculate some key metrics
time_listened = 0
artists = {}
songs = {}
for track in merged_history:
    time_listened += track["msPlayed"]
    if track["artistName"] in artists:
        artists[track["artistName"]] += track["msPlayed"]
    else:
        artists[track["artistName"]] = track["msPlayed"]
    if track["trackName"] in songs:
        songs[track["trackName"]] += track["msPlayed"]
    else:
        songs[track["trackName"]] = track["msPlayed"]

# new = open("IY_top_stats.json", "a")
# Process for top 5 of each
topArtists = sorted(artists, key = artists.get)[-5:]
topSongs = sorted(songs, key = songs.get)[-5:]

topArtists_time = {}
for a in topArtists:
    topArtists_time[a] = artists[a]

topSongs_time = {}
for s in topSongs:
    topSongs_time[s] = songs[s]

# Names only of top 5 artists and songs
print(topArtists)
print(topSongs)

# Number of ms listened to
print(topArtists_time)
print(topSongs_time) 

stats = {
    "timeListened" : time_listened, 
    "topArtists" : topArtists,
    "topSongs" : topSongs,
    "topArtists_time" : topArtists_time,
    "topSongs_time" : topSongs_time,
    "numPlaylists": len(playlists),
    "avgLengthPlaylist": total_songs/len(playlists)
}

new = open("IY_top_stats.json", "x")
new.write(json.dumps(stats, indent = 4))
new.close()


    
