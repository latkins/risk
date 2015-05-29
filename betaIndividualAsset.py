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

    #helper function to check for empty dates.
def checkDates(start, end):
    if end is None:
        end = datetime.today()
    if start is None:
        start = datetime.today()
        start = start.replace(year=start.year-1)
    return(start, end)

#asset and bench are expected to be pandas timeseries with datetime index
#and one column that contains the stock price per day
def calcAlphaBeta(asset, bench, start=None, end=None):
    (start, end) = checkDates(start, end)
    #this is so as to have the same indexing for the rdiff arrays.
    #print(asset[0:5])
    rPctA = asset.copy(deep=True)
    rPctB = bench.copy(deep=True)

    #calculate rPct
    rPctA = rPctA.pct_change(periods = 1)*100
    rPctB = rPctB.pct_change(periods = 1)*100
    #only look at relevant time frame and cols
    rPctA = rPctA.ix[start:end]
    rPctB = rPctB.ix[start:end]
    pairPct = (pd.DataFrame({'pctA' : rPctA})).join(pd.DataFrame({'pctB': rPctB}),how="inner", lsuffix = assetSuffix)

    #calculate alpha as the average % change per day over
    #a period specified by a user or 1 year (default)
    r_a = rPctA.mean()*100*rPctA.shape[0]
    r_b = rPctB.mean()*100*rPctB.shape[0]
    beta=(pairPct.cov()["pctA"]["pctB"]/rPctB.var())
    #retarded alpha
    alpha = r_a - (beta * r_b)
    return(alpha, beta)



    #calculate value at risk measure
#def calcVAR(asset, start=None, end=None)
#    #look at relevant time frame
#    asset = asset.ix[start:end]

