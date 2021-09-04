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
    'Soweit ich sehen kann, ja. Und jetzt geh mir nicht weiter auf meine göttlichen Nerven.',
    'Frag mich später nochmal. Ich bin grad zu sehr mit Bärengötterzeugs beschäftigt, you know?',
    'Meine Quellen sagen nein. Und du weißt ja, ich bin ein Bärengott, also ist es wahr.',
    'Die Antwort auf deine Frage ist 42 und das Universum.'
];

//Timed Messages will come here
const timedmsg = [
    'Joine unserem Discord Server und bleibe mit der gesamten Community connected! https://discord.com/invite/396vVRPCRF',
    'Folge Ratback auf Social Media, um immer up-to-date zu sein! https://www.instagram.com/ratbackttv/ | https://twitter.com/ratbackttv',
    'Joine gerne unserer öffentlichen Steamgruppe. Jeder ist herzlich eingeladen! https://steamcommunity.com/groups/ratbacktwitch',
    'Lust auf exklusive Speedpaint und mehr? Folge Ratback auf Youtube! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg',
    'Immer, wenn du zum ERSTEN Mal diesen Channel subscribest, zeichnet Ratback ein exklusive custom Rattenemote für dich, welches dann auf diesem Channel genutzt werden kann. Also schreibe Ratback auf jeden Fall eine Nachricht mit deinem Emotewunsch. <3',
    'Jede Form von Support bedeutet mir viel! Egal ob Lurker, aktiver Chatter, Donator, Subscriber oder Cheerer - ich bin jedem von euch sehr dankbar! Danke dafür, Leude! <3',
    'Denkt daran, regelmäßig etwas zu trinken! Cheers!'
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
            client.say(channelName, "/me Ich kann die folgenden Commands ausführen: !ownemote !discord !youtube !twitter !instagram !steamgroup !fiverr !music !tip !steam !poke @username !8ball [deine ja-nein-Frage] !love !lurk !hydrate !wer");
            client.say(channelName, '/me Soundboard Commands: !rbeng (English Social Media Announcement) !rbger (German Social Media Announcement)');
            break;

        // Discord Command.
        case ['discord', 'dc'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Joine unserer Community auf Discord: https://discord.com/invite/396vVRPCRF");
            break;

        // Twitter Command.
        case 'twitter':
            client.say(channelName, "/me Folge Ratback auf Twitter: https://twitter.com/ratbackttv");
            break;

        // Stream Group
        case  ['group', 'steamgroup', 'sg'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Trete Ratback's Community auf Steam bei! JEDER darf der Gruppe joinen: https://steamcommunity.com/groups/ratbacktwitch");
            break;

        // Fiverr Command.
        case 'fiverr':
            client.say(channelName, "/me Beauftrage Ratback als Künstler auf Fiverr: https://www.fiverr.com/kenowby");
            break;

        // Instagram Command.
        case ['instagram', 'insta', 'ig'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Folge Ratback auf Instagram: https://www.instagram.com/ratbackttv/");
            break;

        // Donation Command.
        case ['donation', 'donate', 'tip'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Wenn du Ratback eine kleine Spende geben willst, kannst du das über sein Tipeee machen! <3 https://www.tipeeestream.com/kenowby/donation");
            break;

        // Steam Command.
        case 'steam':
            client.say(channelName, "/me Added Ratback auf Steam: https://steamcommunity.com/id/ratback/");
            break;

        // Shoutout Command.
        case ['shoutout', 'so'].find((value, index, arr) => command === value):
            if (args.length > 0) {
                if (isModUp === true) {
                    client.say(channelName, "/me Schaut doch mal bei @" + args[0].replace('@', '') + ": twitch.tv/" + args[0].replace('@', '') + " vorbei!");
                }
            }
            break;

        // Poke-Command.
        case ['poke', 'stups'].find((value, index, arr) => command == value):
            if (args.length > 0) {
                client.say(channelName, "/me Yo, @" + args[0].replace('@', '').toLowerCase() + " ! *poke* *poke* Lass mich dich anstupsen! *poke* *poke* @" + author + " wollte, dass ich das mache. Ist nicht meine Schuld.");
            }
            break;

        //8 Ball
        case '8ball':
            if (args.length >= 1 && args[0] != '') {
                const randomMessage = eightball[Math.floor(Math.random() * eightball.length)];
                client.say(channelName, "/me @" + author + " " + randomMessage);
            } else {
                client.say(channelName, "/me Wenn es keine Frage gibt, gibt es auch keine Antwort. @" + author);
            }
            break;

        //Youtube
        case ['yt', 'youtube'].find((value, index, arr) => command == value):
            client.say(channelName, '/me Folgt mir auf Youtube für exklusive Speedpaints und mehr! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg');
            break;

        //Lurk
        case 'lurk':
            client.say(channelName, '/me @' + author + " geht nun in den Lurkmodus. Danke fürs Zuschauen!");
            break;

        //Hydrate
        case ['hydrate', 'drink', 'water'].find((value, index, arr) => command == value):
            client.say(channelName, '/me Denkt daran, regelmäßig etwas zu trinken! Cheers!');
            break;

        //Love
        case ['love', 'hype'].find((value, index, arr) => command == value):
            client.say(channelName, '<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3');
            break;

        //Custom Emote for First Time Subscribers
        case 'ownemote':
            client.say(channelName, '/me Jedes Mal, wenn ein Viewer zum ERSTEN Mal subscribed, fertige ich für diesen Viewer ein custom Rattenemote an, welches dann auf meinem Twitchkanal und auf Discord via BetterTTV genutzt werden kann. Denkt also daran, mir eine Nachricht zu schicken, wenn ihr zum ersten Mal subscribed habt. <3');
            break;

        //Musik
        case ['music', 'musik'].find((value, index, arr) => command == value):
            client.say(channelName, '/me Die Musik, welche ich in meinen Streams nutze, ist von Epidemic Sound oder der ganz normale Gamesoundtrack des Spiels, welches ich gerade spiele.')

        //Wer
        case 'wer':
            client.say(channelName, '/me Ich spiele heute mit @KitTV, @xLumikettu und @HardyDigital! Schaut gerne mal bei ihren Kanälen vorbei: twitch.tv/kittv | twitch.tv/xlumikettu | twitch.tv/hardydigital');
            break;

        //Martin
        case 'martin':
            client.say(channelName, '/me Schaut doch mal bei @KitTV vorbei. Ist ein korrekter Dude! twitch.tv/kittv');
            break;
    }
});