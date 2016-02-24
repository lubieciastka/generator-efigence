'use strict';

var generators  = require('yeoman-generator');
var mkdirp      = require('mkdirp');

// Options
var _o = {
  //Packages list
  _packages : {
    _standart : [
        "gulp",
        "gulp-concat",
        "gulp-connect",
        "gulp-plumber",
        "gulp-sass",
        "gulp-sourcemaps",
        "gulp-watch",
        "merge-stream",
        "gulp-group-css-media-queries",
        "gulp-autoprefixer",
        "gulp-babel",
        "gulp-jslint",
        "gulp-zip",
        "babel-preset-es2015",
        "foundation",
        "gulp-csscomb",
        "jquery"
    ],
    _testing : [
       "gulp-jasmine"
    ],
    _cssDoc : [
      "kss",
      "gulp-kss"
    ],
    _jsDoc : [
      "gulp-yuidoc"
    ]
  },
  //App structure
  _structure : [
     "/src",
     "/src/html/",
     "/src/fonts",
     "/src/js",
     "/src/css",
     "/src/tests",
     "/src/images",
     "/src/icons",
     "/public"
    ],
    // prompts list
  _prompts : [
    {
        type: "input",
        name: "appName",
        message: "Application/ project name:",
        validate: function( _value ) {
          return ( _value.length > 0 ? true : "Please enter project name");
        }
    },
    {
      type: "list",
      name: "appTests",
      message: "Do you need any tests (JASMINE)?",
      choices: ["yes","no"]
    },
    {
      type: "list",
      name: "cssDocs",
      message: "CSS documenting (KSS)?",
      choices: ["yes","no"]
    },
    {
      type: "list",
      name: "jsDocs",
      message: "JS documenting (yuidoc)?",
      choices: ["yes","no"]
    }
    // ,
    // {
    //   type: "list",
    //   name: "foundation",
    //   message: "Foundation version?",
    //   choices: ["6","5"]
    // }
  ]
};

var _configFile = { 
  tasks : { 
    styles : [
      'src/css/**/*.scss',
      '!src/css/vendor/**/*.*'
    ],
    scripts : [
      'src/js/**/*.*',
      '!src/js/vendor/**/*.*'
    ],
    html : 'src/html/**/*.*',
    img : 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    icons: 'src/icons/**/*.*'
  } 
};

var _packageJson = {
  "name": "",
  "version": "0.0.1",
  "dependencies": {
    "yeoman-generator": "^0.22.5",
    "mkdirp": "^0.5.1",
    "gulp" : "*",
    "gulp-concat" : "latest",
    "gulp-connect" : "latest",
    "gulp-plumber" : "latest",
    "gulp-sass" : "latest",
    "gulp-sourcemaps" : "latest",
    "gulp-watch" : "latest",
    "merge-stream" : "latest",
    "gulp-group-css-media-queries" : "latest",
    "gulp-autoprefixer" : "latest",
    "gulp-babel" : "latest",
    "gulp-jslint" : "latest",
    "gulp-zip" : "latest",
    "babel-preset-es2015" : "latest",
    "foundation" : "latest",
    "gulp-csscomb" : "latest",
    "jquery" : "latest",
    "gulp-jasmine" : "latest",
    "kss" : "latest",
    "gulp-kss" : "latest",
    "gulp-yuidoc" : "latest"
  }
};


var EfigenceGenerator = generators.Base.extend({

  init: function () {

    this.pkg = require('../package.json');

    this.on('end', function () {
      this.log('---------------------------------------');
      this.log('Project ' + this.appName + ' has been just generated');
      this.log('$ cd ' + this.appName );
      this.log('$ npm install');
      this.log('$ gulp');
      this.log('---------------------------------------');
      // console.log('end');
      // if (!this.options['skip-install']) {
      //   this.installDependencies();
      // }  
    });
  },
 
  prompting: function () {

    var done = this.async();
    
    this.log('');
    this.log('███████╗███████╗██╗ ██████╗ ███████╗███╗   ██╗ ██████╗███████╗');
    this.log('██╔════╝██╔════╝██║██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔════╝');
    this.log('█████╗  █████╗  ██║██║  ███╗█████╗  ██╔██╗ ██║██║     █████╗  ');
    this.log('██╔══╝  ██╔══╝  ██║██║   ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  ');
    this.log('███████╗██║     ██║╚██████╔╝███████╗██║ ╚████║╚██████╗███████╗');
    this.log('╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝');
    this.log('');
    this.log('This is Efigence Simple app generator. Enjoy! ( ͡° ͜ʖ ͡°)');

    this.prompt(_o._prompts, function (props) {

      this.appName = props.appName;
      this.appTests = props.appTests;
      this.cssDocs = props.cssDocs;
      this.jsDocs = props.jsDocs;

      done();

    }.bind(this));
  },

  // wrapper function for package installation
  _installPackages : function( _packages ){

    var _length = _packages.length;
    
    for( var i = 0; i < _length; i++){
      
       this.npmInstall([_packages[i]], { 
        'save' : true,
        'prefix' : this.appName
        // 'progress' : false
      });
    }
  },

  // wrapper function for creating project structure
  _createStructure : function( _appName, _structure ){
    
    var _length = _structure.length;

    for( var i = 0; i < _length; i++){
      mkdirp(_appName + _structure[i]);  
    }
  },

  // wrapper function for template copy (basic functionality)
  _copyTemplate : function( _appName, _src, _options ){

    var _options = typeof _options !== 'undefined' ? _options : {};
    
    this.fs.copyTpl(
      this.templatePath( _src ),
      this.destinationPath( _appName + '/' + _src ),
      _options
    );
  },

  // wrapper function for building config file in accordance with selected options by user ( during prompt )
  // this adds new element to config file which is used at gulp for adding tasks to watch
  _buildConfigFile : function(){

    // Tetsts (jasmine)
    if( this._isYes( this.appTests ) ) {
      _configFile.tasks.jasmine = "src/tests/*.js";
    }

    // JS doc generator (yuidoc)
    if( this._isYes( this.jsDocs ) ) {

      _configFile.tasks.yuidoc = "src/tests/*.js";
    }

    // CSS doc generator (kss)
    if( this._isYes( this.cssDocs ) ) {

      _configFile.tasks.kss = ['src/css/**/*.*','!src/css/vendor/**/*.*'];
    }
  
    this.fs.write( this.destinationPath(this.appName + '/config.json'),JSON.stringify(_configFile));
  },

  // wrapper function for building project package.json file ( need to do this way as I would like to update project name on the fly)
  _buildPackageJsonFile : function(){
    
    _packageJson.name = this.appName;
    this.fs.write( this.destinationPath(this.appName + '/package.json'),JSON.stringify(_packageJson));
  },

  // simple wrapper
  // TODO : TO DELETE
  _manageOption : function( _var, _packages ){
  
    // if ( !this._isYes(_var) ){
    //   return;
    // }

    this._installPackages(_packages);
  },
  
  // helper
  _isYes : function( _var ){

    return (_var !== undefined && _var === "yes")
  },

  // main function
  app: function () {

    //TODO: need to be rebuild as this all not so clear as it could be :-(

    if( this.appName === undefined || this.appName === "" ){
      return;
    }

    //app root dir
    mkdirp(this.appName);

    this._buildConfigFile();

    //this._installPackages( _o._packages._standart );
    this._createStructure( this.appName, _o._structure );

    // this._manageOption( this.cssDocs, _o._packages._cssDoc );
    // this._manageOption( this.appTests, _o._packages._testing );
    // this._manageOption( this.jsDocs, _o._packages._jsDoc );

    // TODO : refactorize below
    this._copyTemplate( this.appName, 'src/html/index.html', { title: this.appName } );
    this._copyTemplate( this.appName, 'src/js/app.js' );
    this._copyTemplate( this.appName, 'src/css/app.scss' );
    this._copyTemplate( this.appName, 'src/css/base.scss' );
    this._copyTemplate( this.appName, 'src/tests/test.js' );
    this._copyTemplate( this.appName, 'gulpfile.js' );
    this._copyTemplate( this.appName, '.csscomb.json' );

    this._buildPackageJsonFile();
  },

  // runtime: function () {
  // },

  // projectfiles: function () {
  // }
});

module.exports = EfigenceGenerator;
