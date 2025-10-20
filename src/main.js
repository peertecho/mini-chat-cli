const { command, flag } = require('paparam')
const goodbye = require('graceful-goodbye')
const os = require('os')
const process = require('process')

const MiniChatRoom = require('./mini-chat-room')
const prompt = require('./prompt')

const cmd = command('mini-chat',
  flag('--storage|-s <storage>', 'Storage location'),
  flag('--invite|-i <invite>', 'Room invite')
)

async function main (args) {
  cmd.parse(args)
  if (!cmd.running) return

  const room = new MiniChatRoom(cmd.flags)
  goodbye(() => room.close())
  await room.ready()

  console.log('\nInvite:', await room.createInvite())

  const user = await addWriterInfo(room)
  await printAllWriters(room)

  await prompt(async (data) => {
    const msg = data.trim()
    if (msg) {
      const id = Math.random().toString(16).slice(2)
      await room.addMessage(id, msg, { ...user, at: new Date().toISOString() })
    }
    const messages = await room.getMessages()
    messages.reverse().forEach((msg) => {
      console.log(`- ${msg.text} ~ ${msg.info.username} ~ ${msg.info.at} ~ ${msg.id}`)
    })
  })
}

/** @type {function(MiniChatRoom)} */
async function addWriterInfo (room) {
  const userInfo = os.userInfo()
  const userId = `${os.hostname()} ~ ${process.cwd()} ~ ${room.storage}`
  const userData = { ...userInfo, pid: process.pid, at: new Date().toISOString() }
  await room.addUser(userId, userData)
  return { ...userData, userId }
}

/** @type {function(MiniChatRoom)} */
async function printAllWriters (room) {
  const users = await room.getUsers()
  console.log('All writers:')
  users
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)
    .forEach((user) => {
      console.log(`- ${JSON.stringify(user)}`)
    })
}

module.exports = main
