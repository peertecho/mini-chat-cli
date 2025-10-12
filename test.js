const test = require('brittle')
const createTestnet = require('hyperdht/testnet')

const MiniChatRoom = require('./src/mini-chat-room')

test('basic', async t => {
  const { testnet, bootstrap } = await setupTestnet(t)

  const { room: roomWriter1, invite } = await createRoom(t, { bootstrap })
  const { room: roomWriter2 } = await createRoom(t, { bootstrap, invite })

  const id = Math.random().toString(16).slice(2)
  await roomWriter1.addMessage(id, 'hello from writer1', { username: 'writer1', at: new Date().toISOString() })

  const messages = await getMessages(roomWriter2)
  t.is(messages.length, 1)
  t.is(messages[0].text, 'hello from writer1')
  t.is(messages[0].info.username, 'writer1')

  await roomWriter2.close()
  await roomWriter1.close()
  await testnet.destroy()
})

/** @type {function(MiniChatRoom)} */
async function getMessages (room) {
  const messages = await room.getMessages()
  if (messages.length) return messages

  await new Promise(resolve => setTimeout(resolve, 100))
  return getMessages(room)
}

async function createRoom (t, { bootstrap, invite }) {
  const storage = await t.tmp()
  const room = new MiniChatRoom({ storage, bootstrap, invite })
  t.teardown(() => room.close(), { order: 2000 })
  await room.ready()
  return { room, invite: invite || await room.createInvite() }
}

async function setupTestnet (t) {
  const testnet = await createTestnet()
  t.teardown(() => testnet.destroy(), { order: 5000 })
  const bootstrap = testnet.bootstrap
  return { testnet, bootstrap }
}
