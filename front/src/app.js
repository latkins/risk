var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, Redirect, Navigation } = Router;
var $ = require('jquery');
var _ = require('underscore');

var App = React.createClass({
    getInitialState: function() {
        return {assetName: ""
                , assetCol: ""
                , benchName: ""
                , benchCol: ""
                , alpha: null
                , beta: null};
    },
    assetNameChange: function(event) {
        this.setState({assetName: event.target.value});
    },
    assetColChange: function(event) {
        this.setState({assetCol: event.target.value});
    },
    benchNameChange: function(event) {
        this.setState({benchName: event.target.value});
    },
    benchColChange: function(event) {
        this.setState({benchCol: event.target.value});
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
                console.log(self.state.alpha);
                console.log(self.state.beta);
            }
        });

    },
    render: function () {
        var assetName = this.state.assetName;
        var assetCol = this.state.assetCol;
        var benchName = this.state.benchName;
        var benchCol = this.state.benchCol;
        return (

                <div className="app">

                <div className="container-fluid">
                <div className="row">
                <div className="col-md-10 col-md-offset-1">

                <form ref="form" onSubmit={this.handleSubmit}>
                <input type="text" value={assetName} onChange={this.assetNameChange} />
                <input type="text" value={assetCol} onChange={this.assetColChange} />
                <input type="text" value={benchName} onChange={this.benchNameChange} />
                <input type="text" value={benchCol} onChange={this.benchColChange} />

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
