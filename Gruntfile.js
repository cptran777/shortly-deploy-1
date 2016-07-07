module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: { 
        separator: ';'
      },
      dist: {
        src: ['public/client/*.js', 'public/lib/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
    },

    // git_deploy: {
    //   github: {
    //     options: {
    //       url: 'git@github.com:example/repo.git', // the url is read from 
    //                                               // process.env.GIT_DEPLOY_URL 
    //                                               // if not specified here 
    //       buildIgnore: true, // then false, does not append or create a .gitignore file 
    //       ignoreAppend: false
    //     },
    //     src: 'directory/to/deploy', // you may use . for the current directory that Gruntfile.js is 
    //     dst: './dist/' // if you don't specify this, it WILL ALTER YOUR WORKING COPY 
    //   },

    //   live: {
    //     options: {
    //       url: 'git@github.com:example/repo.git', // the url is read from 
    //                                               // process.env.GIT_DEPLOY_URL 
    //                                               // if not specified here 
    //       buildIgnore: false, // then false, does not append or create a .gitignore file 
    //       ignoreAppend: false
    //     },
    //     src: 'directory/to/deploy', // you may use . for the current directory that Gruntfile.js is 
    //     dst: './dist/' // if you don't specify this, it WILL ALTER YOUR WORKING COPY 
    //   }
    // },

    gitpush: {
      dev: {
        options: {
          remote: 'origin',
          branch: 'master'
        }
      },
      prod: {
        options: {
          remote: 'live2',
          branch: 'master'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    build: {
      target: {

      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/client/*.js', 'public/lib/*.js']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'public/client/*.js', 'public/lib/*.js'
      ]
    },

    cssmin: {
        // Add list of files to lint here
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-fail');
  grunt.loadNpmTasks('grunt-git-selective-deploy');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest', 'eslint'
  ]);

  grunt.registerMultiTask('build', 'running build', function() {
    grunt.task.run('test');
    if (this.errorCount > 0) {
      'fail:1'
    } else {
      grunt.task.run('concat', 'uglify');
    }
  });

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
      'gitpush:prod'
  ]);


};
