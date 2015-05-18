import numpy as np
from datetime import datetime
import Quandl
import pandas as pd

authToken = "fiJDS_QdhvzhjYQ5m8CV"
assetSuffix = "_asset"

testAsset = Quandl.get("YAHOO/GOOGL", returns="pandas", authtoken=authToken)
testBench = Quandl.get("YAHOO/INDEX_GCSP", returns="pandas", authtoken=authToken)

testAsset = testAsset["Adjusted Close"]
testBench = testBench["Adjusted Close"]



#asset and bench are expected to be pandas arrays with datetime index
#and one column that contains the stock price per day
def calcAlphaBeta(asset, bench, start=None, end=None):
    if end is None:
        end = datetime.today()
    if start is None:
        start = datetime.today()
        start = start.replace(year=start.year-1)

    #this is so as to have the same indexing for the rdiff arrays.
    rDiffA = asset
    rDiffB = bench
    for i in range(1,asset.size[0])
        rDiffA[i] =  (asset[i]-asset[i-1]) / asset[i-1]
    for i in range(1,bench.size[0])
        rDiffB[i] = (bench[i]-bench[i-1]) / bench[i-1]

    #get rid of the first entry for which we cannot calculate rdiff
    rDiffA = rDiff.ix[1:-1]
    rDiffB = rDiff.ix[1:-1]

    #only look at relevant time frame
    rDiffA_dt = rDiffA.ix[start:end]
    rDiffB_dt = rDiffB.ix[start:end]

    #calculate alpha as the average % change per day over
    #a period specified by a user or 1 year (default)

    r_a = np.mean(rDiffA_dt)*100*rDiffA_dt.size[0]
    r_b = np.mean(rDiffB_dt)*100*rDiffB_dt.size[0]

    comb = rDiffA_dt.join(rDiffB_dt,how="inner", lsuffix = assetSuffix)
    #trunc = comb.ix[start:end]
    (alpha, beta) = (calcAlphaBetaInner(trunc[assetCol+assetSuffix], trunc[benchCol], r_a, r_b))
    return(alpha, beta)


def calcAlphaBetaInner(assetData, benchData, r_a, r_b):
    from IPython import embed
    embed()
    c = np.cov(np.array([assetData,benchData]))
    print(np.mean(assetData)*assetData.shape[0])
    beta = c[0][1] / c[1][1] #np.var(benchData)
    alpha = r_a - (beta * r_b)
    print(alpha, beta)
    return(alpha, beta)
