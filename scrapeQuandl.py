from Quandl import DatasetNotFound
import Quandl
import sqlite3
from mkTables import insertQuandlCodeName, insertQuandlRows

authToken = "fiJDS_QdhvzhjYQ5m8CV"

def getInsertAllStock(conn, codeFile):
    codeNames = readCodes(codeFile)
    for x in codeNames:
        code = x[0]
        name = x[1]
        getInsertStock(conn, code, name)

def getInsertStock(conn, stockCode, stockName):
    insertQuandlCodeName(conn, stockCode, stockName)
    rows = Quandl.get(stockCode, authtoken=authToken, returns="numpy")
    rows = [[stockCode] + list(x) for x in rows]
    insertQuandlRows(conn, rows)

def readCodes(codeFile):
    outLst = []
    with open(codeFile, 'r') as cf:
        lines = cf.readlines()

    for line in lines[1:]:
        line = (line.split(","))
        line = [x.strip() for x in line]
        code = line[0]
        name = line[1]
        outLst.append((code, name))
    return(outLst)

if __name__=="__main__":
    conn = sqlite3.connect('stocks.sql', detect_types=sqlite3.PARSE_DECLTYPES)
    getInsertAllStock(conn, "/Users/liam/Downloads/WIKI_tickers.csv")
