module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        timenow: grunt.template.today("yymmddhMMss"),
        //压缩js
        // uglify : {
        //   build:{
        //     files: [
        //       {
        //         expand: true,
        //         //相对路径
        //         cwd: 'js/',
        //         src: ['*.js','!*.min.js'],
        //         dest: 'dest/js/',
        //         ext:'.min.js'
        //       }
        //     ]
        //   }
        // },
        //压缩css
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'stylesheets/',
                    src: '*.css',
                    dest: 'dest/stylesheets/',
                    ext: '.min.css'
                }]
            }
        }
    });

    // Load all the plugin .
    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    // grunt.registerTask('default', ['uglify', 'cssmin']);
    grunt.registerTask('default', ['cssmin']);

};
