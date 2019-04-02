import json

def readJson(filename):
    with open(filename) as fp:
        uglyBatch = json.load(fp)
    return uglyBatch

def prettifyBatch(uglyBatch):
    Batch = dict()
    for (k,v) in uglyBatch.items():
        if 'S' in v.keys():
            Batch[k] = v['S']
        elif 'N' in v.keys():
            Batch[k] = v['N']
        elif 'M' in v.keys():
            Batch[k] = prettifyBatch(v['M'])
        elif 'L' in v.keys():
            Batch[k] = list()
            for val in v['L']:
                Batch[k].append(prettifyBatch(val))
        else:
            Batch.update(prettifyBatch(v))
    return Batch
