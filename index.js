const { isPear, isBare } = require('which-runtime')
const process = require('process')

const main = require('./src/main')

let args = []
if (isPear) args = (Pear.app || Pear.config).args
else if (isBare) args = Bare.argv.slice(2)
else args = process.argv.slice(2)

main(args)
