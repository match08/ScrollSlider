const webpack = require('webpack');
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/,
				loader: 'babel-loader?sourceMap',
				query: {compact: false},
				test: /\.(js|jsx|ts|tsx)$/
			},
			{
		        test: /\.tsx?$/,
		        use:'ts-loader',
		        exclude:/node_modules/
		    },
			{
				test: /\.(scss|less|css)$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					},
					{
						loader: 'less-loader',
						
						options: {/*modifyVars: darkTheme,*/javascriptEnabled: true}
					}
				]
			}
 
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
    entry: {
      bundle:"./src/ScrollSlider.ts"
    
	},
	// output: {
	// 	chunkFilename: '[name].[chunkhash].js',
	// 	filename: '[name].[chunkhash].js'
	// },
	output: {
	    filename:"ScrollSlider.js",
		path: path.resolve(__dirname,'dest'),
		libraryTarget:"umd"
	},

	mode: 'development',
	externals:{
		jquery:'jquery',
		'jquery.easing':'jquery.easing'
	},
	// devtool: '#eval-source-map',
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 2,
			minSize: 30000,
			name: true
		}
	}
};
