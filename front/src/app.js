var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Redirect, Navigation } = Router;
var $ = require('jquery');
var _ = require('underscore');

var App = React.createClass({
    render: function () {
        return (

                <div className="app">

                <div className="container-fluid">
                <div className="row">
                <div className="col-md-10 col-md-offset-1">
                <RouteHandler/>
                </div>
                </div>
                </div>
                </div>
        );
    }
});


var AlphaBeta = React.createClass({
    uuid: function () {
			  /*jshint bitwise:false */
			  var i, random;
			  var uuid = '';

			  for (i = 0; i < 32; i++) {
				    random = Math.random() * 16 | 0;
				    if (i === 8 || i === 12 || i === 16 || i === 20) {
					      uuid += '-';
				    }
				    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					      .toString(16);
			  }

			  return uuid;
		},
    getInitialState: function() {
        return ({ benchCode: "WIKI/AEE", assets: [] });
    },
    addAsset: function(newAssetCode) {
        var assetArray = this.state.assets.slice();
        var uuid = this.uuid();
        var asset = {assetName: newAssetCode, key: uuid, beta: null, alpha: null, stockNum: 1, assetPrice: null, loading: false};
        assetArray.push(asset);
        this.setState({assets: assetArray}, function() {
            this.calcAsset(asset);
        });
    },
    calcAsset: function(asset) {
        if (asset !== null) {
            asset.loading = true;
            var self = this;
            var query = { assetName: asset.assetName, benchName: this.state.benchCode};
            this.updateAsset(asset,
                             $.getJSON("/calc_beta", query, function(result) {
                                 if (!result || !result.data) {
                                     console.log("Oh shit.");
                                 } else {
                                     var alpha = Number(result.data.alpha);
                                     var beta = Number(result.data.beta);
                                     asset.beta = beta;
                                     asset.alpha = alpha;
                                     asset.loading = false;
                                     self.updateAsset(asset);
                                 }
                             })
                            );
            asset.loading = true;
            this.updateAsset(asset,
                             $.getJSON("/asset_price", query, function(result) {
                                 if (!result || !result.data) {
                                     console.log("Oh shit.");
                                 } else {
                                     var assetPrice = Number(result.data.asset_price);
                                     asset.assetPrice = assetPrice;
                                     asset.loading = false;
                                     self.updateAsset(asset);
                                 }
                             })
                            );
        } else {
            console.error("Didn't calculate asset.");
        }
    },
    updateAsset: function(asset, callback) {
        var assetArray = this.state.assets.slice();
        var idx = _.findIndex(assetArray, { key: asset.key });
        if (idx) {
            assetArray[idx] = asset;
        }
        if (typeof(callback) === "function") {
            this.setState({assets: assetArray}, callback);
        } else {
            this.setState({assets: assetArray});
        }
    },
    deleteAsset: function(asset) {
        var assetArray = this.state.assets.slice();
        var newAr = _.reject(assetArray, function(item) { return item.key === asset.key; });
        this.setState({assets: newAr});
    },
    updateBenchmark: function (event) {
        this.setState({benchCode: event.target.value});
    },
    render: function () {
        var benchCode = this.state.benchCode;
        return(
            <div className="row">
              <form ref="form">
                <label>Input your benchmark</label>
                <input type="text" value={benchCode} onChange={this.updateBenchmark} />
              </form>
                <hr/>
                <AssetLst deleteAsset={this.deleteAsset} addAsset={this.addAsset} assets={this.state.assets}/>
            </div>
    ); }
});

var AssetLst = React.createClass({
    getInitialState: function() {
        return({newAssetCode: ""});
    },
    updateNewAsset: function(event) {
        this.setState({newAssetCode: event.target.value});
    },
    handleSubmit: function(event) {
        event.preventDefault();
        var newAssetCode = this.state.newAssetCode;
        if (newAssetCode !== "") {
            this.props.addAsset(newAssetCode);
            this.setState({newAssetCode: ""});
        }
    },
    render: function() {
        var self = this;
        var assetNodes = this.props.assets.map(function(a){
            return(<li><Asset deleteAsset={self.props.deleteAsset} asset={a} /></li>);
        });
        var newAssetCode = this.state.newAssetCode;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                  <label>Input asset</label>
                  <input type="text" value={newAssetCode} onChange={this.updateNewAsset} />
                  <button type="submit">Add Asset</button>
                </form>
                <ul>
                  {assetNodes}
                </ul>

           </div>
        );
    }
});

var Asset = React.createClass({
    handleDelete: function () {
        this.props.deleteAsset(this.props.asset);
    },
    render: function () {
        console.log(this.props);
        if (this.props.asset.loading === true) {
            return (<div>
                    <h4>
                      {this.props.asset.assetName}
                    </h4>
                    Loading..
                    <button onClick={this.handleDelete}>Delete</button>
                    </div>);
        } else {
            var stockVal = this.props.asset.assetPrice * this.props.asset.stockNum;
            return(
                <div>
                  <h4>
                    {this.props.asset.assetName}
                  </h4>

                    <span>Beta for asset: {this.props.asset.beta}</span>
                    <span>Alpha for asset: {this.props.asset.alpha}</span>
                    <span>Stock value is: {stockVal}</span>
                    <button onClick={this.handleDelete}>Delete</button>
                </div>
            );
        }
    }
});

var routes = (
        <Route name="app" path="/" handler={App}>
          <Route name="alphabeta" path="alphabeta" handler={AlphaBeta}/>
        </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});
