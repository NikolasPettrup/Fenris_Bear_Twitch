var tmi = require('tmi.js');
const dotenv = require('dotenv').config({
    path: require('find-config')(".env")
});
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

var client = new tmi.client(options);
client.connect();

//Connect Message in Console
client.on('connected', function(adress, port){
console.log("Adress: " + adress + " Port: " + port);
//client.say("TheGrizzIey", "Fenris_Bear is now connected to the Stream!")
});


// Listen to chat.
client.on('chat', function(channel, user, message, self) {
    // If message dosen't start with prefix do nothing;
    if(!message.startsWith(prefix)) return;
    // Get Command-Name.
    let command = message.slice(prefix.length).trim().split(" ")[0];
    // Get Arguments.
    let args = message.slice(prefix.length).slice(command.length).trim().split(" ");
    switch(command) {
        // Discord Command.
        case ['discord', 'dc'].find((value, index, arr) => command === value):
            client.say("TheGrizzIey", "Join our Community on Discord: https://discord.com/invite/396vVRPCRF");
        break;
        // Twitter Command.
        case 'twitter':
            client.say("TheGrizzIey", "Follow Grizzley on Twitter: https://twitter.com/grizzIeylol");
            break;
        // Fiverr Command.
        case 'fiverr':
            client.say("TheGrizzIey", "Hire Grizzley on Fiverr: https://www.fiverr.com/kenowby");
            break;
        // Instagram Command.
        case ['instagram', 'insta', 'ig'].find((value, index, arr) => command === value):
            client.say("TheGrizzIey", "Follow Grizzley on Instagram: https://www.instagram.com/grizzieylol/");
            break;
        // Donation Command.
        case ['donation', 'donate', 'tip'].find((value, index, arr) => command === value):
            client.say("TheGrizzIey", "If you want to give Grizzley a lil' tip, you can do this on his Tipeee <3 https://www.tipeeestream.com/kenowby/donation");
            break;
        // Steam Command.
        case 'steam':
            client.say("TheGrizzIey", "Add Grizzley on Steam: https://steamcommunity.com/id/thegrizziey/");
            break;
        // Help-Command.
        case ['commands', 'cmds', 'cmd', 'help', 'command'].find((value, index, arr) => command === value):
            client.say("TheGrizzIey", "I can operate the following commands: !discord !twitter !instagram !fiverr !tip !steam");
            break;
        // Shoutout Command.
    }
});