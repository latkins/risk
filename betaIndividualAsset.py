import numpy as np
from datetime import datetime
import Quandl
import pandas as pd


assetSuffix = "_asset"
##Testing
#import sqlite3
#from mkTables import getStocks 
#testAsset = getStocks(conn, "WIKI/ACT")
#testBench = getStocks(conn, "WIKI/AEE")
#testAsset = testAsset["adj_close"]
#testBench = testBench["adj_close"]


#asset and bench are expected to be pandas timeseries with datetime index
#and one column that contains the stock price per day
def calcAlphaBeta(asset, bench, start=None, end=None):
    if end is None:
        end = datetime.today()
    if start is None:
        start = datetime.today()
        start = start.replace(year=start.year-1)
    #this is so as to have the same indexing for the rdiff arrays.
    print(asset[0:5])
    rDiffA = asset.copy(deep=True)
    rDiffB = bench.copy(deep=True)
    

    #calculate rDiff
    for i in range(1,asset.shape[0]):
        rDiffA[i] = (asset[(i)]-asset[i-1]) / asset[i-1]
    for i in range(1,bench.shape[0]):
        rDiffB[i] = (bench[(i)]-bench[i-1]) / bench[i-1]

    #only look at relevant time frame
    rDiffA = rDiffA.ix[start:end]
    rDiffB = rDiffB.ix[start:end]
    
    #calculate alpha as the average % change per day over
    #a period specified by a user or 1 year (default)
    r_a = rDiffA.mean()*100*rDiffA.shape[0]
    r_b = rDiffB.mean()*100*rDiffB.shape[0]
    
    #convert to DataFrame, pass to calcAlphaBetaInner to do covariance stuff
    trunc = (pd.DataFrame(rDiffA)).join(pd.DataFrame(rDiffB),how="inner", lsuffix = assetSuffix)  
    (alpha, beta) = (calcAlphaBetaInner(trunc["adj_close"+assetSuffix], trunc["adj_close"], r_a, r_b))
    return(alpha, beta)

def calcAlphaBetaInner(assetData, benchData, r_a, r_b):
    c = np.cov(np.array([assetData,benchData]))
    beta = c[0][1] / c[1][1]
    alpha = r_a - (beta * r_b)
    return(alpha, beta)
