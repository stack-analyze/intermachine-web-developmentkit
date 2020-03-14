import { task, src, watch, dest, series } from 'gulp'
import pug from 'gulp-pug'
import sass, { logError } from 'gulp-sass'
import { createProject } from 'gulp-typescript'
import { create, stream, init, reload } from 'browser-sync'

const tsProject = createProject('tsconfig.json')

create()

//taks
task('pug', () => {
  return src('./src/pages/*.pug')
    .pipe(
      pug({
        pretty: false,
      }),
    )
    .pipe(dest('./public/'))
})

task('sass', () => {
  return src('./src/scss/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', logError),
    )
    .pipe(dest('./public/css/'))
    .pipe(stream())
})

task('scripts', () => {
  return src('./src/ts/*.ts')
    .pipe(tsProject())
    .pipe(dest('./public/js/'))
})

task('default', () => {
  init({
    server: './public',
  })

  //PUG
  watch('./src/pages/*.pug', series('pug')).on('change', reload)
  //SASS
  watch('./src/scss/*.scss', series('sass')).on('change', reload)

  watch('./src/ts/*.ts', series('scripts')).on('change', reload)
})
