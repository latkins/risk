var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Redirect, Navigation } = Router;
var $ = require('jquery');
var _ = require('underscore');

var App = React.createClass({
    render: function () {
        return (
                <div className="container">
                <RouteHandler/>
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
        var asset = {assetName: newAssetCode, key: uuid, beta: null, alpha: null, stockNum: 1, assetPrice: null, loading: false, error: false};
        assetArray.unshift(asset);
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
                                     console.error("Oh shit.");
                                 } else {
                                     var alpha = Number(result.data.alpha);
                                     var beta = Number(result.data.beta);
                                     asset.beta = beta;
                                     asset.alpha = alpha;
                                     asset.loading = false;
                                     self.updateAsset(asset);
                                 }
                             })
                             .error(function() {
                                 asset.error = true;
                                 self.updateAsset(asset);
                             })
                            );
            asset.loading = true;
            this.updateAsset(asset,
                             $.getJSON("/asset_price", query, function(result) {
                                 if (!result || !result.data) {
                                     console.error("Oh shit.");
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
        var validAssets = _.filter(this.state.assets, function(a) { return(!a.loading && !a.error); });
        var weightedBeta = "";
        var weightedBetaRounded = "";
        if (validAssets.length >= 0) {
            var totalValue = 0;
            var totalBeta = 0;
            for (var idx in validAssets) {
                var a = validAssets[idx];
                totalValue += a.assetPrice * a.stockNum;
                totalBeta += a.beta * (a.assetPrice * a.stockNum);
                totalValue = Math.round(totalValue*100)/100
            }
            weightedBeta = totalBeta / totalValue;
            if (weightedBeta){
                weightedBetaRounded = Math.round(weightedBeta*100)/100
            }
        }
        return(
            <div>
                <div className="row">
                <h2> Portfolio statistics </h2>
                <div className="col-lg-8 col-lg-offset-3 small-padding">
                <dl className="dl-horizontal">
                <dt>
                <h4>
                Value:
                </h4>
            </dt>
                <dd>
                {totalValue}&nbsp;$
            </dd>
                <dt>
                <h4>
                Beta:
                </h4>
                </dt>
                <dd>
                {weightedBetaRounded}
                </dd>
                <dt>
                <h4>
                Risk:
                </h4>
            </dt>
                <dd>
                {Math.random()}
            </dd>
                </dl>
                </div>
                </div>
                <div className="row">
                   <div className="col-lg-12 text-left ">
                      <AssetLst updateAsset={this.updateAsset} deleteAsset={this.deleteAsset} addAsset={this.addAsset} assets={this.state.assets}/>
                   </div>
                </div>
            </div>
        ); }
});

var AssetLst = React.createClass({
    getInitialState: function() {
        return({newAssetCode: ""});
    },
    updateNewAsset: function(event) {
        event.preventDefault();
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
            return(<li>
                   <Asset updateAsset={self.props.updateAsset} deleteAsset={self.props.deleteAsset} asset={a} />
                   </li>
                   );
        });
        var newAssetCode = this.state.newAssetCode;
        return (
                <div>
                         <form className="form-inline" onSubmit={this.handleSubmit}>
                         <div className="row small-padding">
                         <div className="col-lg-12 text-center">
                <input className="form-control input-lg" placeholder="Asset name" type="text" value={newAssetCode} onChange={this.updateNewAsset}/>
                         <button className="btn btn-primary btn-lg" type="submit">Add</button>
                </div>
                </div>
                         </form>
                <div className="row text-left col-lg-offset-2">
                <section className="small-padding">
                      <ul>
                         {assetNodes}
                      </ul>
                </section>
                   </div>
                </div>
        );
    }
});

var Asset = React.createClass({
    getInitialState: function() {
        return({stockNum: 1});
    },
    handleDelete: function (event) {
        event.preventDefault();
        this.props.deleteAsset(this.props.asset);
    },
    updateStockNum: function (event) {
        event.preventDefault();
        var asset = this.props.asset;
        this.setState({stockNum: event.target.value});
        asset.stockNum = event.target.value;
        this.props.updateAsset(asset);
    },
    render: function () {
        if (this.props.asset.error === true) {
            return (
                    <div className="row">
                    <dl className="dl-horizontal">
                    
                    <dt>
                    <h4> Invalid asset: "{this.props.asset.assetName}"&nbsp;</h4>
                    </dt>
                    <dd>
                    <button className="btn btn-small" onClick={this.handleDelete}>Del</button>
                    </dd>
                    </dl>
                    </div>
                   )
        } else if (this.props.asset.loading === true) {
            return (<div className="row">
                    <div className="text-center">
                    <h4>
                      {this.props.asset.assetName}
                    </h4>
                    Loading...
                    </div>
                    </div>
                   );
        } else {
            var stockVal = this.props.asset.assetPrice;
            var stockBeta = Math.round(this.props.asset.beta*100)/100;
            return(
                    <div className="row">
                    <dl className="dl-horizontal">
                    <dt>
                    <h4> {this.props.asset.assetName} (&beta;={stockBeta}), quantity: </h4>
                    </dt>
                    <dd>
                    <form className="form-inline">
                    <div className="form-group">
                    <label className="sr-only"> {this.props.asset.assetName} </label>
                    <div className="input-group">
                    <input type="number" className="form-control" value={this.state.stockNum} onChange={this.updateStockNum} />
                    <div className="input-group-addon">&nbsp; &#215; {stockVal}$</div>
                    </div>
                    </div>
                    </form>
                    <button className="btn btn-small" onClick={this.handleDelete}>Del</button>
                    </dd>
                    </dl>

                   </div>
           );
        }
    }
});




var routes = (
        <Route name="app" path="/" handler={App}>
          <Route name="alphabeta" path="alphabeta" handler={AlphaBeta}/>
          <Redirect from="/" to="alphabeta" />
        </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});
