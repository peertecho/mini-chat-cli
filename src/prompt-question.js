//
// IMPORTANT NOTE: must run with
// spawn('node', [require.asset('./prompt-question.js'), question], { stdio: ['inherit', 'inherit', 'inherit', 'pipe'] })
//
const fs = require('fs')
const readline = require('readline')

const question = process.argv[2]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(question + '\n', (answer) => {
  sendResult(answer || ' ')
  rl.close()
})

function sendResult (val) {
  try {
    const hasfd3 = fs.fstatSync(3).dev
    if (!hasfd3) {
      console.log(`${val}`)
      return
    }
    const pipe = fs.createWriteStream(null, { fd: 3 })
    pipe.end(`${val}`)
  } catch (err) {
    console.log(err)
  }
}
