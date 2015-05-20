from flask import Flask
from flask import request, jsonify
from betaIndividualAsset import calcAlphaBeta
from Quandl import DatasetNotFound
import sqlite3
from mkTables import getStocks 
from datetime import datetime

app = Flask(__name__, static_folder='front', static_url_path='')
errorResp = {'data' : None, 'message' : 'error'}
conn = sqlite3.connect('stocks.sql', detect_types=sqlite3.PARSE_DECLTYPES)

@app.route('/', methods=["GET"])
def root():
    return app.send_static_file('index.html')

@app.route('/static/bundle.js', methods=["GET"])
def jsapp():
    return app.send_static_file('build/bundle.js')

@app.route("/calc_beta", methods=["GET"])
def calcBeta():
    assetName = request.args.get('assetName')
    benchName = request.args.get('benchName')
    start = request.args.get('start')
    end = request.args.get('end')
    #get data from database
<<<<<<< HEAD
    try:
        asset = getStocks(conn, assetName)
        bench = getStocks(conn, benchName)
    except sqlite3.Error as e:
        print("An SQL error occurred: {}".format(e))
        resp = jsonify(errorResp)
    #calculate alpha and beta
    try:
=======
    try:
        asset = getStocks(conn, assetName)
        bench = getStocks(conn, benchName)
    except sqlite3.Error as e:
        print "An SQL error occurred:", e.args[0]
        resp = jsonify(errorResp)
    #calculate alpha and beta
    try:
>>>>>>> 3e183d2b79b009ada617ad7d84313dbf23119058
        (alpha, beta) = calcAlphaBeta(asset["adj_close"], bench["adj_close"], start, end)
        resp = jsonify({'data' : {'alpha' : float(alpha), 'beta' : float(beta)}, 'message' : "ok"})
    except DatasetNotFound as e:
        print(e)
        resp = jsonify(errorResp)
    return(resp)

@app.route("/asset_price", methods=["GET"])
def getPrice():
    assetName = request.args.get('assetName')
    date = request.args.get('date')
    if date is None:
        date = datetime.today()

    print(date,date,date)
    #get data from database
    try:
        asset = getStocks(conn, assetName)
        pr = asset["adj_close"]
        resp = jsonify({'message': 'ok', 'data': {'asset_price': float(pr.asof(date))}})
    except sqlite3.Error as e:
<<<<<<< HEAD
        print("An sql error occurred in getting the stock price: {}".format(e))
        resp=jsonify(errorResp)
=======
        print "An sql error occurred in getting the stock price: ", e.args[0]
        pr=jsonify(errorResp)
>>>>>>> 3e183d2b79b009ada617ad7d84313dbf23119058
    return(resp)




if __name__ == "__main__":
    app.run()
