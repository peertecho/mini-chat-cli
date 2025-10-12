const path = require('path')
const { spawn } = require('child_process')
const goodbye = require('graceful-goodbye')

async function prompt (onData) {
  const input = await promptQuestion('\n> Add a message:')
  await onData(input)
  return prompt(onData)
}

async function promptQuestion (question) {
  const filePath = global.Pear ? require.asset('./prompt-question.js') : path.join(__dirname, 'prompt-question.js')
  const child = spawn('node', [filePath, question], { stdio: ['inherit', 'inherit', 'inherit', 'pipe'] })
  goodbye(() => child.kill())
  const val = await new Promise(resolve => {
    let res
    child.stdio[3].on('data', (data) => {
      res = data.toString()
      child.kill()
    })
    child.on('exit', () => resolve(res))
  })
  if (val === undefined) { // Ctrl+C
    const err = new Error('Ctrl+C detected, closing...')
    err.code = 'CANCELLED'
    throw err
  }
  return val
}

module.exports = prompt
