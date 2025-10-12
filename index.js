const { isPear, isBare } = require('which-runtime')
const process = require('process')

const main = require('./src/main')

let args = []
if (isPear) args = global.Pear.config.args
else if (isBare) args = global.Bare.argv.slice(2)
else args = process.argv.slice(2)

main(args)
