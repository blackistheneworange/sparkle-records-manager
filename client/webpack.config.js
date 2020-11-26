const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={

	entry:'./src/index.js',


	output:{
		path:path.resolve(__dirname,'../public'),
		filename:'bundle.js',
		publicPath:'/'
	},

	devServer:{
		historyApiFallback:true
	},

	devtool: "source-map",

	module:{
		rules:[
			{
				test:/\.(js|jsx)$/,
				exclude:/node_modules/,
				use:{
					loader:'babel-loader'
				}
			},
			{
				test: /\.css$/,
				include:[path.join(__dirname,'src'), path.join(__dirname,'node_modules/semantic-ui-css')],
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}  

		]
	},

	plugins:[
		new HtmlWebpackPlugin(
			{
				template:'./public/index.html'
			}
		)
	]

}
