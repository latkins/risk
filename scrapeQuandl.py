from Quandl import DatasetNotFound
import Quandl
import sqlite3
from sqlite3 import ProgrammingError
from dbUtils import insertQuandlCodeName, insertQuandlRows, getDbConn

authToken = "fiJDS_QdhvzhjYQ5m8CV"

def getInsertAllStock(conn, codeFile):
    codeNames = readCodes(codeFile)
    for x in codeNames:
        code = x[0]
        name = x[1]
        getInsertStock(conn, code, name)

def codeExistsInDb(conn, stockCode):
    c = conn.cursor()
    c.execute(u"SELECT * FROM quandldata WHERE quandlcode=%s",(stockCode,))
    if c.fetchone():
        return True
    else:
        return False

def getInsertStock(conn, stockCode, stockName):
    if not codeExistsInDb(conn, stockCode):
        print("Scraping {}".format(stockCode))
        try:
            insertQuandlCodeName(conn, stockCode, stockName)
            rows = Quandl.get(stockCode, authtoken=authToken, returns="numpy")
            rows = [[stockCode] + list(x) for x in rows]
            insertQuandlRows(conn, rows)
        except ProgrammingError as e:
            print(e)
    else:
        print("skipping")

def readCodes(codeFile):
    outLst = []
    with open(codeFile, 'r') as cf:
        lines = cf.readlines()

    for line in reversed(lines[1:]):
        line = (line.split(","))
        line = [x.strip() for x in line]
        code = unicode(line[0], "utf-8")
        name = unicode(line[1], "utf-8")
        outLst.append((code, name))
    return(outLst)

if __name__=="__main__":
    conn = getDbConn()
    getInsertAllStock(conn, "WIKI_tickers.csv")
