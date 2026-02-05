const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
	...defaultConfig,
	entry: {
		'customize': path.resolve( process.cwd(), 'src/js', 'main.js' ),
	},
	output: {
		path: path.resolve( process.cwd(), 'public_html/assets' ),
		filename: 'js/[name].min.js',
		clean: {
			keep: /webfonts|img|svg/,
		},
	},
	module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    emit: false,
                },
            },
        ],
    },
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) => plugin.constructor.name !== 'RtlCssPlugin'
		).map( ( plugin ) => {
			if ( plugin.constructor.name === 'MiniCssExtractPlugin' ) {
				return new MiniCssExtractPlugin( {
					filename: 'css/customize.min.css',
				} );
			}
			return plugin;
		} ),
	],
};