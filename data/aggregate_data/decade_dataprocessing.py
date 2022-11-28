import math
import pandas as pd
import numpy as np
import statistics

decade60s = pd.read_csv("data/decade_data/dataset-of-60s.csv")
decade70s = pd.read_csv("data/decade_data/dataset-of-70s.csv")
decade80s = pd.read_csv("data/decade_data/dataset-of-80s.csv")
decade90s = pd.read_csv("data/decade_data/dataset-of-90s.csv")
decade00s = pd.read_csv("data/decade_data/dataset-of-00s.csv")
decade10s = pd.read_csv("data/decade_data/dataset-of-10s.csv")


decade_list = [decade60s, decade70s, decade80s, decade90s, decade00s, decade10s]
years = ["1960", "1970", "1980", "1990", "2000", "2010"]

attributes = ["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "tempo", "duration_ms"]

decade_merged = pd.DataFrame()

for a in attributes:
    attr_row = [a]
    for y in range(len(years)):
        attr_row.append(statistics.mean(list(decade_list[y][a])))
    attr_row.append(min(list(decade_list[y][a])))
    attr_row.append(max(list(decade_list[y][a])))
    decade_merged = pd.concat([decade_merged, pd.DataFrame(attr_row).T])


decade_merged.columns = ["property"] + years + ["min", "max"]
print(decade_merged)
# for i in range(len(decade_list)):
#     decade_temp = 
#     list(decade_list[i])[[a for a in attributes]]
#     decade_temp["year"] = years[i]

#     decade_merged = pd.concat([decade_merged, pd.DataFrame(decade_temp)])

# decade_merged = decade_merged.T


new = open("decade_data.csv", "x")
decade_merged.to_csv("decade_data.csv", index = False)
new.close()



