var Resource = require('deployd/lib/resource');
var mongojs = require('mongojs');
util = require('util') ;

function Search(name, options) {
    Resource.apply(this, arguments);
    if (options && options.db) {
        this.dbOpts = options.db.options;
    }
    process.server.searchCollections = process.server.searchCollections || {};
}
module.exports = Search;
util.inherits(Search,  Resource);

Search.basicDashboard = {
    settings: [{
        name: 'collection',
        type: 'text',
        description: "the name of the collection to search"
    }]
};

Search.label = "Search";

Search.prototype.handle = function (ctx, next) {
        switch(ctx.method) {
            case "GET":

                if(!process.server.searchCollections[this.config.collection]) {
                    console.log("new con");
                    var dbOpts = this.dbOpts;

                    var db = mongojs( dbOpts.credentials.username + ':'+
                        dbOpts.credentials.password + '@' +
                        dbOpts.host + ':' + dbOpts.port +'/' +
                        dbOpts.name);

                    process.server.searchCollections[this.config.collection] = db.collection(this.config.collection);
                }

                var collection = process.server.searchCollections[this.config.collection];

                collection.runCommand( "text", ctx.query, function(err, res) {
                    ctx.done(err, res);
                });
                break;
        }
};

Search.prototype.clientGeneration = true;
