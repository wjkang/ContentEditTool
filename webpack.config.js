var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        background: './background.js',
        content:'./content.js',
        jquery:["jquery"],
        vue:["vue"]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js'
    },
    plugins: [
        new CommonsChunkPlugin({
            name: ["common","jquery","vue","load"],
            minChunks:2
        }),
         new CopyWebpackPlugin([
            { from: 'manifest.json'},
            { from: 'icon.png'},
            { from: 'assist.png'},
            { from: 'background.html'},
         ])
    ]
};