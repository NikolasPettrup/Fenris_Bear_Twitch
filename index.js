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
    channels: ["Ratback"]
};

let prefix = '!';
let channelName = 'Ratback';

var client = new tmi.client(options);
client.connect();

//Connect Message in Console
client.on('connected', function (adress, port) {
    console.log("Adress: " + adress + " Port: " + port);
    //client.say(channelName, "Fenris_Bear is now connected to the Stream!")
});

//8Ball Variables
const eightball = [
    'As I see it, yes. And now don\'t get on my nerves any longer.',
    'Ask again later. I\'m too busy doing bear-god-things right now, u know?',
    'My sources say no. And ya know, Imma bear-god, so it\'s true.',
    'The answer to your question is 42 and the universe.'
];

//Grogu-Counter Variable
var i = 0;

//Timed Messages will come here
const timedmsg = [
    'Join our Discord-Server now to stay connected with the whole Community! https://discord.com/invite/396vVRPCRF',
    'Follow me on Social-Media to be up to date! https://www.instagram.com/ratbackttv/ | https://twitter.com/ratbackttv',
    'If you want your own custom Emotes or Subscriber-Badges, feel free to hire me on Fiverr! https://www.fiverr.com/kenowby',
    'If you want to see exclusive Speedpaints and other videos of mine, feel free to follow me on Youtube! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg',
    'Every time when a viewer subscribes to this channel for the first time, a custom rat emote for this viewer will be created and added to the BTTV emotes and the Discord server of this channel. Just let Ratback know how the rat should be colored and which emotion it should show, when you subscribe to Ratback for the first time. <3',
    'Every support means a lot to me! No matter if you are a lurker, an active chatter, a donator, a subscriber or a cheerer - I am thankful to all of you people out there! Thanks a lot! <3'    
];

setInterval(() => {
    const randomPost = timedmsg[Math.floor(Math.random() * timedmsg.length)];
    client.say(channelName, '/me ' +randomPost);
}, 1800000);


// Test Change.

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
            client.say(channelName, "/me I can operate the following commands: !ownemote !discord !youtube !twitter !instagram !fiverr !tip !steam !poke @username !8ball [Your yes-no-question] !love !lurk !hydrate");
            client.say(channelName, '/me Soundboard Commands: !rbeng (English Social Media Announcement) !rbger (German Social Media Announcement)');
            break;

        // Discord Command.
        case ['discord', 'dc'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Join our Community on Discord: https://discord.com/invite/396vVRPCRF");
            break;

        // Twitter Command.
        case 'twitter':
            client.say(channelName, "/me Follow Ratback on Twitter: https://twitter.com/ratbackttv");
            break;

        // Fiverr Command.
        case 'fiverr':
            client.say(channelName, "/me Hire Ratback on Fiverr: https://www.fiverr.com/kenowby");
            break;

        // Instagram Command.
        case ['instagram', 'insta', 'ig'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Follow Ratback on Instagram: https://www.instagram.com/ratbackttv/");
            break;

        // Donation Command.
        case ['donation', 'donate', 'tip'].find((value, index, arr) => command === value):
            client.say(channelName, "/me If you want to give Ratback a lil' tip, you can do this on his Tipeee <3 https://www.tipeeestream.com/kenowby/donation");
            break;

        // Steam Command.
        case 'steam':
            client.say(channelName, "/me Add Ratback on Steam: https://steamcommunity.com/id/ratback/");
            break;

        // Shoutout Command.
        case ['shoutout', 'so'].find((value, index, arr) => command === value):
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

        //Youtube
        case ['yt', 'youtube'].find((value, index, arr) => command == value):
            client.say(channelName, '/me Follow me on Youtube for exclusive Speedpaints and more! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg');
            break;

        //Lurk
        case 'lurk':
            client.say(channelName, '/me @' + author + " is entering Lurkmode now, lol. Thanks for watching my stream!");
            break;

        //Hydrate
        case ['hydrate', 'drink', 'water'].find((value, index, arr) => command == value):
            client.say(channelName, '/me Remember to drink enough water over time! Cheers!');
            break;

        //Love
        case ['love', 'hype'].find((value, index, arr) => command == value):
            client.say(channelName, '<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3');
            break;

        //Custom Emote for First Time Subscribers
        case 'ownemote':
            client.say(channelName, '/me Every time when a viewer subscribes to this channel for the first time, a custom rat emote for this viewer will be created and added to the BTTV emotes and the Discord server of this channel. Just let Ratback know how the rat should be colored and which emotion it should show, when you subscribe to Ratback for the first time. <3');
            break;
    }

});