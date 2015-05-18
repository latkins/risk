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
        return ({ benchCode: "WIKI/AAE", assets: [] });
    },
    addAsset: function(newAssetCode) {
        var assetArray = this.state.assets.slice();
        var uuid = this.uuid();
        var asset = {assetName: newAssetCode, key: uuid, beta: null, alpha: null, stockNum: 1, lastStockVal: null, loading: false};
        assetArray.push(asset);
        this.setState({assets: assetArray}, function() {
            this.calcAsset(asset);
        });
        console.log(this.state.state);
        console.log(assetArray);
    },
    calcAsset: function(asset) {
        if (asset !== null) {
            asset.loading = true;
            var self = this;
            this.updateAsset(asset,
                             // $.getJSON(url, query, function(result) {
                             //     if (!result || !result.data) {
                             //         console.log(result);
                             //         console.log("Oh shit.");
                             //     } else {
                             //         var alpha = Number(result.data.alpha);
                             //         var beta = Number(result.data.beta);
                             //         self.setState({alpha: alpha, beta:beta});
                             //         console.log(self.state.alpha);
                             //         console.log(self.state.beta);
                             //     }
                             // });

                             setTimeout(function(){
                                 var benchCode = self.state.benchCode;
                                 var alpha = 1;
                                 var beta = 1;
                                 var lastStockVal = 1;
                                 asset.alpha = alpha;
                                 asset.beta = beta;
                                 asset.lastStockVal = 1;
                                 asset.loading=false;
                                 self.updateAsset(asset);
                             }, 2000)
                            );
        } else {
            console.error("Didn't calculate asset.");
        }
    },
    updateAsset: function(asset, callback) {
        console.log("updating asset");
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
                <AssetLst addAsset={this.addAsset} assets={this.state.assets}/>
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
        var assetNodes = this.props.assets.map(function(a){
            return(<li><Asset asset={a} /></li>);
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
    render: function () {
        if (this.props.asset.loading === true) {
            return (<div>
                    <h4>
                      {this.props.asset.assetName}
                    </h4>
                    Loading..
                    </div>);
        } else {
            var stockVal = this.props.asset.lastStockVal * this.props.asset.stockNum;
            return(
                <div>
                  <h4>
                    {this.props.asset.assetName}
                  </h4>

                    <span>Beta for asset: {this.props.asset.beta}</span>
                    <span>Alpha for asset: {this.props.asset.alpha}</span>
                    <span>Stock value is: {stockVal}</span>
                </div>
            );
        }
    }
});
// var Asset = React.createClass({
//     getInitialState: function() {
//         return {assetName: ""};
//     },
//     assetNameChange: function(event) {
//         this.setState({assetName: event.target.value});
//     },
//     assetColChange: function(event) {
//         this.setState({assetCol: event.target.value});
//     },
//     handleSubmit: function(e) {
//         console.log(this.state);
//         e.preventDefault();
//         var url = "http://localhost:5000/calc_beta";
//         var query = { assetName: this.state.assetName
//                       , benchName: this.props.benchName
//                       , benchCol: this.props.benchCol};
//         var self = this;
//         console.log(query);
//         $.getJSON(url, query, function(result) {
//             if (!result || !result.data) {
//                 console.log(result);
//                 console.log("Oh shit.");
//             } else {
//                 var alpha = Number(result.data.alpha);
//                 var beta = Number(result.data.beta);
//                 self.setState({alpha: alpha, beta:beta});
//                 console.log(self.state.alpha);
//                 console.log(self.state.beta);
//             }
//         });

//     },
//     render: function () {
//         var assetName = this.state.assetName;
//         var benchName = this.state.benchName;
//         return (

//                 <div className="app">

//                 <div className="container-fluid">
//                 <div className="row">
//                 <div className="col-md-10 col-md-offset-1">

//                 <form ref="form" onSubmit={this.handleSubmit}>
//                 <input type="text" value={assetName} onChange={this.assetNameChange} />
//                 <input type="text" value={benchName} onChange={this.benchNameChange} />

//                 <button type="submit">Do the thing</button>
//                 </form>
//                 <RouteHandler/>
//                 </div>
//                 </div>
//                 </div>
//                 </div>
//         );
//     }
// });



var routes = (
        <Route name="app" path="/" handler={App}>
          <Route name="alphabeta" path="alphabeta" handler={AlphaBeta}/>
        </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});
