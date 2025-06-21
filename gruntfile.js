module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Limpa as pastas antes de iniciar o build
        clean: {
            build: ['dist/', 'dev/', 'prebuild/'],
            postbuild: ['prebuild/'] // Essa linha limpa a pasta prebuild após o uso
        },

        // Compila LESS para CSS
        less: {
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },

        // Observa alterações nos arquivos
        watch: {
            styles: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:development'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev'],
                options: {
                    spawn: false,
                }
            }
        },

        // Substitui o marcador ENDERECO_DO_CSS e ENDERECO_DO_JS pelos caminhos corretos
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        // Minifica o HTML antes da substituição final
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },

        // Minifica o JavaScript para produção
        uglify: {
            dist: {
                files: {
                    'dist/scripts/main.min.js': ['src/scripts/main.js']
                }
            }
        }
    });

    // Carregamento das tarefas
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Tarefa padrão: desenvolvimento com watch
    grunt.registerTask('default', ['watch']);

    // Tarefa de build completa
    grunt.registerTask('build', [
        'clean:build',
        'less:development',
        'replace:dev',
        'less:production',
        'uglify:dist',
        'htmlmin:dist',
        'replace:dist',
        'clean:postbuild'
    ]);
};