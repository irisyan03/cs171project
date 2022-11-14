import json

f = open('playlist_data.json')

all_data = json.load(f)

playlist_info = all_data["playlists"]
total_songs = 0
artists_count = {}
songs_count = {}
for p in playlist_info:
    total_songs += p["num_tracks"] - p["num_holdouts"]
    for track in p["tracks"]:
        if track["artist_name"] in artists_count:
            artists_count[track["artist_name"]] += 1
        else:
            artists_count[track["artist_name"]] = 1
        if track["track_name"] in songs_count:
            songs_count[track["track_name"]] += 1
        else:
            songs_count[track["track_name"]] = 1

topArtists_bycount = sorted(artists_count, key = artists_count.get)[-5:]
topSongs_bycount = sorted(songs_count, key = songs_count.get)[-5:]

topArtists_bycount_count = {}
for a in topArtists_bycount:
    topArtists_bycount_count[a] = artists_count[a]

topSongs_bycount_count = {}
for s in topSongs_bycount:
    topSongs_bycount_count[s] = songs_count[s]

stats = {
    "topArtistsByCount" : topArtists_bycount,
    "topSongsByCount" : topSongs_bycount,
    "topArtistsByCount_count" : topArtists_bycount_count,
    "topSongsByCount_count" : topSongs_bycount_count,
    "numPlaylists": len(playlist_info),
    "avgLengthPlaylist": total_songs/len(playlist_info)
}

new = open("general_top_stats.json", "x")
new.write(json.dumps(stats, indent = 4))
new.close()
