def match_feature_names(features):
    mapping = {

        'Title': 'title',
        'Creation Date': 'date_avg',
        'Culture': 'culture',
        'Collection': 'collection',
        'Type': 'type',
        'Technique': 'technique'
    }

    res = [mapping[x] for x in features]

    return res


