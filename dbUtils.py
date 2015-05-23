import psycopg2
import pandas as pd
import numpy as np
import os

def insertQuandlCodeName(conn, code, name):
    c = conn.cursor()
    try:
        c.execute(u"INSERT INTO stockname (quandlcode, name) VALUES (%s, %s)", (code,name))
    except psycopg2.IntegrityError:
        conn.rollback()
    else:
        conn.commit()

def insertQuandlRows(conn, rows):
    c = conn.cursor()
    try:
        # This is a terrible hack
        if len(rows[0]) == 8:
            c.executemany(u"INSERT INTO quandldata (quandlcode, date, open, high, low, close, volume, adj_close) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", rows)
        else:
            c.executemany(u"INSERT INTO quandldata VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", rows)

    except IndexError as e:
        print(e)
    except psycopg2.IntegrityError:
        conn.rollback()
    else:
        conn.commit()

def getStocks(conn, stockCode):
    c = conn.cursor()
    c.execute(u"SELECT * FROM quandldata WHERE quandlcode=%s", (stockCode,))
    results = np.array(c.fetchall())
    colNames = ["quandlcode", "date", "open", "high", "low", "close", "volume", "ex_dividend", "split_ratio", "adj_open", "adj_high", "adj_low", "adj_close", "adj_volume"]
    results = pd.DataFrame.from_records(results, index="date", columns=colNames)
    return(results)

def getDbConn():
    dbserver = os.environ.get('PGSERVER')
    dbport = os.environ.get('PGPORT')
    dbuser = os.environ.get('DBRISKUSER')
    dbpass = os.environ.get('DBRISKPASS')
    dbname = os.environ.get('DBRISKNAME')

    try:
        conn = psycopg2.connect("dbname='{}' user='{}' host='{}' port='{}' password='{}'".format(dbname, dbuser, dbserver, dbport, dbpass))
    except Exception as e:
        print(e)
        print "lol can't connect"
    else:
        return (conn)
