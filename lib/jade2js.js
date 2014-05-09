var util,
    jade,
    template;

util = require( 'util' );
jade = require( 'jade' ); 

template = '' +
  'window.__html__ = window.__html__ || {};\n' +
  'window.__html__[\'%s\'] = \'%s\';';

function escapeContent( content ) {
  return content.replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
}

function createJade2JsPreprocessor( logger, basePath ) {
  var log;

  log = logger.create( 'preprocessor.jade2js' );

  return function( content, file, done ) {
    var jadePath,
        html;

    log.debug( 'Processing "%s".', file.originalPath );

    jadePath = file.originalPath.replace( basePath + '/', '' );

    html = jade.compile( content, {} )( {} );

    file.path = file.path.replace( /.jade$/, '.html' );

    done( util.format( template, jadePath, escapeContent( html ) ) );
  };
}

createJade2JsPreprocessor.$inject = [ 'logger', 'config.basePath' ];

module.exports = createJade2JsPreprocessor;