const fs = require('fs')
const execSync = require('child_process').execSync
const prettyBytes = require('pretty-bytes')
const gzipSize = require('gzip-size')

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  })

console.log('Building CommonJS modules ...')

exec('babel modules -d . --ignore __tests__', {
  BABEL_ENV: 'cjs'
})

console.log('\nBuilding ES modules ...')

exec('babel modules -d es --ignore __tests__', {
  BABEL_ENV: 'es'
})

console.log('\nBuilding react-router-redux-extras.js ...')

exec('rollup -c -i modules/index.js -o umd/react-router-redux-extras.js', {
  BABEL_ENV: 'es',
  NODE_ENV: 'development'
})

console.log('\nBuilding react-router-redux-extras.min.js ...')

exec('rollup -c -i modules/index.js -o umd/react-router-redux-extras.min.js', {
  BABEL_ENV: 'es',
  NODE_ENV: 'production'
})

const size = gzipSize.sync(
  fs.readFileSync('umd/react-router-redux-extras.min.js')
)

console.log('\ngzipped, the UMD build is %s', prettyBytes(size))
