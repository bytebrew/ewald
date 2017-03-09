import re, os

def parse(filename):
    xy = []
    with open(filename, 'r') as f:
        for l in f:
            if '#' in l or len(l) < 2:
                continue
            l = re.sub('[ \n]', '', l)
            d = l.split(',')
            xy.append([float(d[0]), float(d[1])])
    return xy

def datafiles(dirpath):
    return [f for f in os.listdir(dirpath)]
