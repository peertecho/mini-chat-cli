# Mini Chat Cli

A mini chat based on multi writer example to make a room for multiple members to send messages and see all messages of each other

## Usage

```shell
npm i

# in a terminal, create a new room, and print the invite
npm start -- -s tmp/writer1

# in another terminal, join an room using an invite
npm start -- -s tmp/writer2 -i <invite>
```

Then send one or multiple messages from both terminals, after a while, they will both see all messages of each other

P.S. In this a sample app, messages are unsorted yet
