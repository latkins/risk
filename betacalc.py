import numpy as np
from datetime import datetime
import Quandl
import pandas as pd

authToken = "fiJDS_QdhvzhjYQ5m8CV"
assetSuffix = "_asset"

def calcAlphaBeta(assetName, assetCol, benchName, benchCol, start=None, end=None):
    if end is None:
        end = datetime.today()
    if start is None:
        start = datetime.strptime("01 01 2014", '%m %d %Y')
        # Here we get the raw data from Quandl. For the calculation of alpha, we would want the
        #raw values to calculate the actual return. For the covariance, we need the rdiff
        #transformed data. We now request shit twice, which sucks. instead we could write our
        #own rdiff.
    a = Quandl.get(assetName, returns="pandas", authtoken=authToken, transformation="rdiff")
    araw = Quandl.get(assetName, returns="pandas", authtoken=authToken)
    b = Quandl.get(benchName, returns="pandas", authtoken=authToken, transformation="rdiff")
    braw = Quandl.get(benchName, returns="pandas", authtoken=authToken)
    #calculate alpha
    araw = araw.ix[start:end][assetCol]
    braw = braw.ix[start:end][benchCol]
    r_a = ((araw[-1] - araw[0]) / araw[0]) * 100
    r_b = ((braw[-1] - braw[0]) / braw[0]) * 100
    comb = a.join(b,how="inner", lsuffix = assetSuffix)
    trunc = comb.ix[start:end]
    (alpha, beta) = (calcAlphaBetaInner(trunc[assetCol+assetSuffix], trunc[benchCol], r_a, r_b))
    return(alpha, beta)


def calcAlphaBetaInner(assetData, benchData, r_a, r_b):
    from IPython import embed
    embed()
    print(assetData, benchData)
    c = np.cov(np.array([assetData,benchData]))
    print(np.mean(assetData)*assetData.shape[0])
    beta = c[0][1] / c[1][1] #np.var(benchData)
    alpha = r_a - (beta * r_b)
    print(alpha, beta)
    return(alpha, beta)
