import webpack from 'webpack';
import Config from 'webpack-config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';

export default new Config().merge({
    entry: './client/index.js',
    output: {
        path: __dirname + '/../../../../../bundles/public/js', //'/../public', //'/../../../../../bundles/public/js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            modules: false,
                            useBuiltIns: true,
                            targets: {
                                browsers: [
                                    'Chrome >= 60',
                                    'Safari >= 10.1',
                                    'iOS >= 10.3',
                                    'Firefox >= 54',
                                    'Edge >= 15',
                                ],
                            },
                        }],
                    ],
                    plugins: ["syntax-dynamic-import"],
                },
                exclude: /node_modules/,
            }
        ]
    }
    ,
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            inject: "body"
        })
    ]
});