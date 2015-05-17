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
        start = datetime.strptime("01 01 1900", '%m %d %Y')

    a = Quandl.get(assetName, returns="pandas", authtoken=authToken, transformation="rdiff")
    b = Quandl.get(benchName, returns="pandas", authtoken=authToken, transformation="rdiff")
    comb = a.join(b,how="inner", lsuffix = assetSuffix)
    trunc = comb.ix[start:end]
    (alpha, beta) = (calcAlphaBetaInner(trunc[assetCol+assetSuffix], trunc[benchCol]))
    return(alpha, beta)


def calcAlphaBetaInner(assetData, benchData):
    r_b = ((benchData[-1] - benchData[0]) / benchData[0] ) * 100
    r_a = ((assetData[-1] - assetData[0]) / assetData[0] ) * 100
    c = np.cov(np.array([assetData,benchData]))
    beta = c[0][1] / c[1][1] #np.var(benchData)
    alpha = r_a - (beta * r_b)
    return(alpha, beta)
