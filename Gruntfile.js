module.exports = function(grunt){
  grunt.initConfig({
    nodewebkit: {
      options: {
        version: '0.8.2',
        build_dir: './build',
        mac: true,
        win: true,
        linux32: true,
        linux64: true
      },
      src: ['./app/**/*']
    },

    watch: {
      compile: {
        files: ['app/**/*'],
        tasks: ['nodewebkit']
      }
    }
  })

  grunt.loadNpmTasks('grunt-node-webkit-builder')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.registerTask('default', ['nodewebkit'])
  grunt.registerTask('watch', ['watch'])
}