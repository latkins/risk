from flask import Flask
from flask import request, jsonify
from betacalc import calcAlphaBeta
from Quandl import DatasetNotFound

app = Flask(__name__, static_folder='front', static_url_path='')

errorResp = {'data' : None, 'message' : 'error'}

@app.route('/', methods=["GET"])
def root():
    return app.send_static_file('index.html')

@app.route('/static/bundle.js', methods=["GET"])
def jsapp():
    return app.send_static_file('build/bundle.js')

@app.route("/calc_beta", methods=["GET"])
def calcBeta():
    assetName = request.args.get('assetName')
    assetCol = request.args.get('assetCol')
    benchName = request.args.get('benchName')
    benchCol = request.args.get('benchCol')
    start = request.args.get('start')
    end = request.args.get('end')

    try:
        print(assetName, assetCol, benchName, benchCol, start, end)
        (alpha, beta) = calcAlphaBeta(assetName, assetCol, benchName, benchCol)
        print(alpha, beta)
        resp = jsonify({'data' : {'alpha' : float(alpha), 'beta' : float(beta)}, 'message' : "ok"})
    except DatasetNotFound as e:
        print(e)
        resp = jsonify(errorResp)

    return(resp)

if __name__ == "__main__":
    app.run()
    # (alpha, beta) = calcAlphaBeta(assetName, assetCol, benchName, benchCol)

    # print(calcAlphaBeta("YAHOO/GOOGL","Adjusted Close_asset","YAHOO/INDEX_GSPC","Adjusted Close"))
