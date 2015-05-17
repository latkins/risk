from flask import Flask
from flask import request, jsonify

app = Flask(__name__, static_folder='front', static_url_path='')

def calcAlphaBeta(assetName, assetCol, benchName, benchCol, start, end):
    return(1, 1)

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

    if assetName and assetCol and benchName and benchCol:
        (alpha, beta) = calcAlphaBeta(assetName, assetCol, benchName, benchCol, start, end)
        resp = jsonify({'data' : {'alpha' : alpha, 'beta' : beta}, 'message' : "ok"})
        return(resp)
    else:
        resp = jsonify({'data' : None, 'message' : 'error'})
        return(resp)

if __name__ == "__main__":
    app.run()
