const dotenv = require('dotenv').config({
    path: require('find-config')(".env")
});
// Define Logger.
const loggerMap = require('./logger').logger();
// Setup Global Functions.
require('./globalFunctions').globalFunctions(loggerMap);
var tmi = require('tmi.js');

/* function testLog() {
    logAll("This is an INFO");
    logAll("This is an ERROR", 'ERROR');
    logAll("This is a FATAL", 'FATAL');
    logAll("This is a TRACE", 'TRACE');
    logAll("This is a WARN", 'WARN');
    logAll("This is a DEBUG", 'DEBUG');
}
testLog(); */

var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: process.env.TWITCHUSER,
        password: process.env.TWITCHOAUTH
    },
    channels: ["TheGrizzIey"]
};

let prefix = '!';
let channelName = 'TheGrizzIey';

var client = new tmi.client(options);
client.connect();

//Connect Message in Console
client.on('connected', function (adress, port) {
    console.log("Adress: " + adress + " Port: " + port);
    //client.say(channelName, "Fenris_Bear is now connected to the Stream!")
});

//8Ball Variables
const eightball = ['As I see it, yes. And now don\'t get on my nerves any longer.', 'Ask again later. I\'m too busy doing bear-god-things right now, u know?', 'My sources say no. And ya know, Imma bear-god, so it\'s true.', 'The answer to your question is 42 and the universe.'];

//Grogu-Counter Variable
var i = 0;

//Timed Messages will come here


// Listen to chat.
client.on('chat', function (channel, user, message, self) {
    // Return if message came from yourself.
    if (self) return;

    //Get author of message.
    let author = user['display-name'].toLowerCase();

    //Check if user is Moderator.
    const isMod = user.mod || user['user-type'] === 'mod';
    //Check if user is Broadcaster.
    const isBroadcaster = channel.slice(1) === author;
    //Check if user is Moderator or Broadcaster.
    const isModUp = isMod || isBroadcaster;



    // If message dosen't start with prefix do nothing;
    if (!message.startsWith(prefix)) return;
    // Get Command-Name.
    let command = message.slice(prefix.length).trim().split(" ")[0];
    // Get Arguments.
    let args = message.slice(prefix.length).slice(command.length).trim().split(" ");

    switch (command) {
        // Help-Command.
        case ['commands', 'cmds', 'cmd', 'help', 'command'].find((value, index, arr) => command === value):
            client.say(channelName, "/me I can operate the following commands: !d5 !discord !twitter !instagram !fiverr !tip !steam !poke @username !8ball [Your yes-no-question] !grogu");
            break;

            // Discord Command.
        case ['discord', 'dc'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Join our Community on Discord: https://discord.com/invite/396vVRPCRF");
            break;
            // Twitter Command.
        case 'twitter':
            client.say(channelName, "/me Follow Grizzley on Twitter: https://twitter.com/grizzIeylol");
            break;
            // Fiverr Command.
        case 'fiverr':
            client.say(channelName, "/me Hire Grizzley on Fiverr: https://www.fiverr.com/kenowby");
            break;
            // Instagram Command.
        case ['instagram', 'insta', 'ig'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Follow Grizzley on Instagram: https://www.instagram.com/grizzieylol/");
            break;
            // Donation Command.
        case ['donation', 'donate', 'tip'].find((value, index, arr) => command === value):
            client.say(channelName, "/me If you want to give Grizzley a lil' tip, you can do this on his Tipeee <3 https://www.tipeeestream.com/kenowby/donation");
            break;
            // Steam Command.
        case 'steam':
            client.say(channelName, "/me Add Grizzley on Steam: https://steamcommunity.com/id/thegrizziey/");
            break;
            // Shoutout Command.
        case 'so':
            if (args.length > 0) {
                if (isModUp === true) {
                    client.say(channelName, "/me Go, check out @" + args[0].replace('@', '') + ": twitch.tv/" + args[0].replace('@', '') + "");
                }
            }
            break;
            // Poke-Command.
        case 'poke':
            if (args.length > 0) {
                client.say(channelName, "/me Yo, @" + args[0].replace('@', '').toLowerCase() + " ! *poke* *poke* Lemme poke you! *poke* *poke* @" + author + " wants me to do dis.");
            }
            break;
            //8 Ball
        case '8ball':
            if (args.length >= 1 && args[0] != '') {
                const randomMessage = eightball[Math.floor(Math.random() * eightball.length)];
                client.say(channelName, "/me @" + author + " " + randomMessage);
            } else {
                client.say(channelName, "/me If there is no question, there is no answer. @" + author);
            }
            break;
            //DestinyV Command
        case ['destiny', 'dv', 'd5', 'destinyv', 'destiny5'].find((value, index, arr) => command == value):
            client.say(channelName, '/me DestinyV is a German GTA V Roleplay server project by Grizzley and two of his friends which currently is in development. Discord-Server: https://discord.gg/URkNCPJeWe');
            client.say(channelName, '/me 🇩🇪 Bei Interesse an einer Mitarbeit als Gamedesigner, Supporter oder Developer, tretet dem obigen Discordserver bei und schickt einem Mitglied der Projektleitung eine DM.');
            break;

            //Grogu Counter        
        case 'grogu':
            i++;
            client.say(channelName, '/me Grogu was in trouble again, but you saved him, @' + author + '! Baby Yoda was already saved ' + i + ' times by this Twitch chat!');
            break;
    }
});