const webpack = require('webpack');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
let IS_DEV = NODE_ENV === 'development';

module.exports = {
    entry: ['./server/index'],
    target: 'node',
    node: {
        __dirname: true,
        __filename: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": ["es2015", "env"]
                    }
                }
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/server'),
        filename: 'index.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(IS_DEV ? 'development' : 'production'),
                'CREDENTIALS_FILE': JSON.stringify(`dist/.credentials/${IS_DEV ? 'HRDB-test.json': 'HRDB.json'}`),
            }
        })
    ],
    externals: {
        googleapis: "commonjs googleapis",
        mongodb: "commonjs mongodb"
    },
    devtool: IS_DEV ? 'eval' : 'source-map',
    mode: IS_DEV ? 'development' : 'production',
};