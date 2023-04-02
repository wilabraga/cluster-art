import time
from flask import Flask, request
from flask_cors import CORS
from kmeans import ArtKMeans
import pandas as pd
from helpers import match_feature_names
import json
import os

app = Flask(__name__)
CORS(app)


@app.route('/time', methods=['POST'])
def get_current_time():
    user_input = request.get_json()

    num_artwork, num_cluster, cluster_attr = user_input
    print(type(num_artwork), type(num_cluster), type(cluster_attr))

    df_artworks = pd.read_pickle("df_artworks.pkl")
    df_artworks = df_artworks.sample(n=num_artwork)

    model = ArtKMeans()

    model.fit(df_artworks, match_feature_names(cluster_attr))

    results = model.k_means(num_cluster)
    results = results[['x', 'y', 'id', 'cluster']]
    results = results.rename(columns={'id': 'text', 'cluster': 'clusterid'})

    cur_directory = os.path.dirname(__file__)
    parent_directory = os.path.split(cur_directory)[0]
    src_directory = os.path.join(parent_directory, 'src')

    results.to_csv(src_directory + '\\data.csv', index=False)

    df_artworks = df_artworks.set_index('id')
    return df_artworks.to_json(orient="index")