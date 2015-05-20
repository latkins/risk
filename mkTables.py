import sqlite3
import pandas as pd
import numpy as np

def mkTables(conn):
    c = conn.cursor()
    c.execute(u"CREATE TABLE stockname ( quandlcode TEXT PRIMARY KEY , name TEXT)")
    c.execute(u"CREATE TABLE quandldata ( quandlcode TEXT , date TIMESTAMP , open REAL , high REAL , low REAL , close REAL , volume REAL , ex_dividend REAL , split_ratio REAL , adj_open REAL , adj_high REAL , adj_low REAL , adj_close REAL , adj_volume REAL , PRIMARY KEY (quandlcode, date), FOREIGN KEY(quandlcode) REFERENCES stockname(quandlcode))")


def insertQuandlCodeName(conn, code, name):
    c = conn.cursor()
    c.execute(u"INSERT OR IGNORE INTO stockname VALUES (?, ?)", (code,name))
    conn.commit()

def insertQuandlRows(conn, rows):
    c = conn.cursor()
    # This is a terrible hack
    if len(rows[0]) == 8:
        c.executemany(u"INSERT OR IGNORE INTO quandldata (quandlcode, date, open, high, low, close, volume, adj_close) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", rows)
    else:
        c.executemany(u"INSERT OR IGNORE INTO quandldata VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", rows)

    conn.commit()

def getStocks(conn, stockCode):
    c = conn.cursor()
    c.execute(u"SELECT * FROM quandldata WHERE quandlcode IS ?", (stockCode,))
    results = np.array(c.fetchall())
    colNames = ["quandlcode", "date", "open", "high", "low", "close", "volume", "ex_dividend", "split_ratio", "adj_open", "adj_high", "adj_low", "adj_close", "adj_volume"]
    results = pd.DataFrame.from_records(results, index="date", columns=colNames)
    return(results)
