module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      target: {
        src: ['*.js']
      }
    },

    jscs: {
      src: ['*.js'],
      options: {
        config: ".jscsrc",
      }
    },

  });

  grunt.registerTask("default", ["jshint", "jscs"]);
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
};
