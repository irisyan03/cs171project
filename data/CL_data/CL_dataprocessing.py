import json
from datetime import datetime

class User:
    def __init__(self, name, playlists, tracks):
        self.name = name
        self.playlists = playlists
        self.tracks = tracks
    

# Cindy Data Processing
f = open('data/CL_data/Playlist1.json')

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

new = open("CL_data_cleaned.json", "x")
new.write(json.dumps(cleaned_playlist_data, indent = 4))
new.close()


# Concatenate streaming history in chronological order
f0 = open("data/CL_data/StreamingHistory0.json", "r")
# f1 = open("IY_data/StreamingHistory1.json", "r")
# f2 = open("IY_data/StreamingHistory2.json", "r")
history_0 = json.load(f0)
# history_1 = json.load(f1)
# history_2 = json.load(f2)

merged_history = []
merged_history.extend(history_0)
# merged_history.extend(history_1)
# merged_history.extend(history_2)

print(merged_history[:5])

# calculate some key metrics
time_listened = 0
artists_time = {}
songs_time = {}
artists_count = {}
songs_count = {}

for track in merged_history:
    time_listened += track["msPlayed"]
    if track["artistName"] in artists_time:
        artists_time[track["artistName"]] += track["msPlayed"]
    else:
        artists_time[track["artistName"]] = track["msPlayed"]
    if track["trackName"] in songs_time:
        songs_time[track["trackName"]] += track["msPlayed"]
    else:
        songs_time[track["trackName"]] = track["msPlayed"]
    if track["artistName"] in artists_count:
        artists_count[track["artistName"]] += 1
    else:
        artists_count[track["artistName"]] = 1
    if track["trackName"] in songs_count:
        songs_count[track["trackName"]] += 1
    else:
        songs_count[track["trackName"]] = 1

# new = open("IY_top_stats.json", "a")
# Process for top 5 of each, by time
topArtists_bytime = sorted(artists_time, key = artists_time.get)[-5:]
topSongs_bytime = sorted(songs_time, key = songs_time.get)[-5:]

# Process for top 5 of each, by count
topArtists_bycount = sorted(artists_count, key = artists_count.get)[-5:]
topSongs_bycount = sorted(songs_count, key = songs_count.get)[-5:]

topArtists_bytime_min = {}
for a in topArtists_bytime:
    topArtists_bytime_min[a] = artists_time[a]

topSongs_bytime_min = {}
for s in topSongs_bytime:
    topSongs_bytime_min[s] = songs_time[s]

topArtists_bycount_count = {}
for a in topArtists_bycount:
    topArtists_bycount_count[a] = artists_count[a]

topSongs_bycount_count = {}
for s in topSongs_bycount:
    topSongs_bycount_count[s] = songs_count[s]

# Names only of top 5 artists and songs
print(topArtists_bytime)
print(topSongs_bytime)

# Number of ms listened to
print(topArtists_bytime_min)
print(topSongs_bytime_min) 

stats = {
    "timeListened" : time_listened, 
    # "topArtistsByTime" : topArtists_bytime,
    # "topSongsByTime" : topSongs_bytime,
    # "topArtistsByTime_time" : topArtists_bytime_min,
    # "topSongsByTime_time" : topSongs_bytime_min,
    "topArtistsByCount" : topArtists_bycount,
    "topSongsByCount" : topSongs_bycount,
    "topArtistsByCount_count" : topArtists_bycount_count,
    "topSongsByCount_count" : topSongs_bycount_count,
    "numPlaylists": len(playlists),
    "avgLengthPlaylist": total_songs/len(playlists)
}

new = open("CL_top_stats.json", "x")
new.write(json.dumps(stats, indent = 4))
new.close()


    
