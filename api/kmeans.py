import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, scale, normalize
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import spacy


class ArtKMeans:

    def __init__(self):
        self.df = None
        self.X = None
        self.k_features = {'title': 'word_vec',
                           'date_avg': 'numeric',
                           'culture': 'word_vec',
                           'collection': 'word_vec',
                           'type': 'categorical',
                           'technique': 'word_vec'}

    '''
    df: dataframe containing artwork dataframe
    feature_list: list of column names to run kmeans on
    '''

    def fit(self, df, feature_list):

        if 'id' not in df.columns:
            print('Dataframe must have an id column')

        if not all(f in df.columns for f in feature_list):
            print('Dataframe missing required columns')
            for x in feature_list:
                if x not in df.columns:
                    print('Missing', x)
            sys.exit()

        if not all(f in self.k_features for f in feature_list):
            print('Invalid feature passed to cluster')
            for x in feature_list:
                if x not in self.k_features:
                    print(x, 'is not a valid feature')
            sys.exit()

        self.X = self._preprocessing(df, feature_list)

        # reduce features to become 2D plottable
        cols = [x for x in self.X.columns if x != 'id']

        # need to scale before conducting PCA
        self.X[cols] = scale(self.X[cols])
        pca = PCA(n_components=2).fit_transform(self.X[cols])
        self.X['x'] = pca[:, 0]
        self.X['y'] = pca[:, 1]

        # normalize result to be easier to plot
        self.X[['x', 'y']] = normalize(self.X[['x', 'y']], axis=0)
        self.X = self.X.drop(cols, axis=1)

        return self

    '''
    Prepares df for preprocessing
    Appropriate columns are taken and none values removed
    '''

    def _preprocessing(self, df, feature_list):

        nlp = spacy.load('en_core_web_sm')

        # trim df to relevant features
        self.df = df[feature_list + ['id']]

        # remove rows with null/empty values
        self.df = self.df.replace(r'^\s*$', np.nan, regex=True)
        self.df = self.df.dropna()
        X = self.df.copy()

        for feature in feature_list:

            # categorical feature with meaningful similarity measure
            if self.k_features[feature] == 'word_vec':

                vec = []
                # zip because dataframes will not necessarily return in order
                # we need it to be ordered for later numpy operations and joins
                for i, doc in zip(X['id'], nlp.pipe(X[feature])):
                    # doc.vector is the average word vector for the cell
                    vec.append([i] + list(doc.vector))

                # unique column names
                vec = np.asarray(vec)
                col_names = ['id'] + [feature + str(i) for i in range(vec.shape[1] - 1)]
                vec_df = pd.DataFrame(vec, columns=col_names)
                vec_df['id'] = vec_df['id'].astype('int')

                # merge on id
                X = X.merge(vec_df)
                X = X.drop(feature, axis=1)

            # categorical feature with no meaningful similarity
            elif self.k_features[feature] == 'categorical':

                cols = np.asarray(X[['id', feature]])
                # maintain order
                indices, data = [cols[:, 0], cols[:, 1]]

                # each unique value assigned a consecutive int
                labels = np.asarray(LabelEncoder().fit_transform(data))

                # need to turn labels into onehot so values will be in different dimensions
                # i.e. cannot directly compare labels to each other as < or >
                one_hot = np.zeros((len(X), labels.max() + 2))
                one_hot[np.arange(len(X)), labels + 1] = 1
                one_hot[:, 0] = indices

                col_names = ['id'] + [feature + str(i) for i in range(one_hot.shape[1] - 1)]
                one_hot_df = pd.DataFrame(one_hot, columns=col_names)
                one_hot_df['id'] = one_hot_df['id'].astype('int')

                X = X.merge(one_hot_df)
                X = X.drop(feature, axis=1)

        return X

    '''
    Returns coordinates of artworks in the following form
    n x 3, n: number of artworks
    cols: id of artwork, x coord, y coord
    '''

    def get_coordinates(self):
        return self.X

    '''
    Returns coordinates of artworks and the cluster they belong to
    n x 4, n:number of artworks
    cols: id of artwork, x coord, y coord, cluster id
    '''

    def k_means(self, k):
        X_k = self.X.copy()
        kmeans = KMeans(n_clusters=k).fit(X_k[['x', 'y']])
        X_k['cluster'] = kmeans.predict(X_k[['x', 'y']])
        return X_k
