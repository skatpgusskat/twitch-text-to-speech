const pushChat = require('./pushChat');

const ws = new WebSocket('ws://irc-ws.chat.twitch.tv');

const nick = 'justinfan13113 '; //all lowercase
const auth = 'kappa'; //include oauth:xxxx
const channel = 'namse_';

ws.onopen = () => {
  ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
  ws.send('PASS ' + auth);
  ws.send('NICK ' + nick);
  ws.send('JOIN #' + channel);
};

// reply to ping
ws.onmessage = (event) => {

  const { data } = event;
  if (data.lastIndexOf('PING', 0) === 0) {
    ws.send('PONG :tmi.twitch.tv');
    console.log('PONG Sent\r\n');
    return;
  }

  const indexOfPRIVMSG = data.indexOf('PRIVMSG');
  if (indexOfPRIVMSG >= 0) {
    const headers = data.substring(0, indexOfPRIVMSG).split(';');
    const content = data.substring(data.indexOf(':', indexOfPRIVMSG) + 1);
    const name = headers.find(header => header.indexOf('display-name') === 0)
      .substring('display-name='.length);
    pushChat(name, content);
  }
};
