var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Redirect, Navigation } = Router;
var $ = require('jquery');
var _ = require('underscore');

var App = React.createClass({
    getInitialState: function() {
        return {  assetNames: []
                , benchName: ""
                , alpha: null
                , beta: null
               };
    },
    handleSubmit: function(e) {
        console.log(this.state);
        e.preventDefault();
        var url = "http://localhost:5000/calc_beta";
        var query = this.state;
        var self = this;
        console.log(query);
        $.getJSON(url, query, function(result) {
            if (!result || !result.data) {
                console.log(result);
                console.log("Oh shit.");
            } else {
                var alpha = Number(result.data.alpha);
                var beta = Number(result.data.beta);
                self.setState({alpha: alpha, beta:beta});
            }
        });

    },
    render: function () {
        var benchName = this.state.benchName;
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


var AlphaBeta = React.createClass({render: function () { return(); }});

var Bench = React.createClass({
    getInitialState: function() {
        return { benchName: "" };
    },
    benchNameChange: function(event) {
        this.setState({benchName: event.target.value});
    },
    handleSubmit: function(e) {
        console.log(this.state);
        e.preventDefault();
        var url = "http://localhost:5000/calc_beta";
        var query = this.state;
        var self = this;
        console.log(query);
        $.getJSON(url, query, function(result) {
            if (!result || !result.data) {
                console.log(result);
                console.log("Oh shit.");
            } else {
                var alpha = Number(result.data.alpha);
                var beta = Number(result.data.beta);
                self.setState({alpha: alpha, beta:beta});
            }
        });

    },
    render: function () {
        var benchName = this.state.benchName;
        return (

                <form ref="form" onSubmit={this.handleSubmit}>
                <label>Input your benchmark</label>
                <input type="text" value={benchName} onChange={this.benchNameChange} />

                <button type="submit">Do the thing</button>
                </form>
        );
    }
});


var Asset = React.createClass({
    getInitialState: function() {
        return {assetName: ""};
    },
    assetNameChange: function(event) {
        this.setState({assetName: event.target.value});
    },
    assetColChange: function(event) {
        this.setState({assetCol: event.target.value});
    },
    handleSubmit: function(e) {
        console.log(this.state);
        e.preventDefault();
        var url = "http://localhost:5000/calc_beta";
        var query = { assetName: this.state.assetName
                      , benchName: this.props.benchName
                      , benchCol: this.props.benchCol};
        var self = this;
        console.log(query);
        $.getJSON(url, query, function(result) {
            if (!result || !result.data) {
                console.log(result);
                console.log("Oh shit.");
            } else {
                var alpha = Number(result.data.alpha);
                var beta = Number(result.data.beta);
                self.setState({alpha: alpha, beta:beta});
                console.log(self.state.alpha);
                console.log(self.state.beta);
            }
        });

    },
    render: function () {
        var assetName = this.state.assetName;
        var benchName = this.state.benchName;
        return (

                <div className="app">

                <div className="container-fluid">
                <div className="row">
                <div className="col-md-10 col-md-offset-1">

                <form ref="form" onSubmit={this.handleSubmit}>
                <input type="text" value={assetName} onChange={this.assetNameChange} />
                <input type="text" value={benchName} onChange={this.benchNameChange} />

                <button type="submit">Do the thing</button>
                </form>
                <RouteHandler/>
                </div>
                </div>
                </div>
                </div>
        );
    }
});



var routes = (
        <Route name="app" path="/" handler={App}>
        </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('main'));
});
