/**
 * @author Nikolas P.
 */


/**
 * require configs
 */
const dotenv = require('dotenv').config({
    path: require('find-config')(".env")
});


/**
 * define logger
 * @type {Map}
 */
const loggerMap = require('./logger').logger();


/**
 * setup global functions
 */
require('./globalFunctions').globalFunctions(loggerMap);
var tmi = require('tmi.js');


/**
 * give config for channel connection
 * @type {{channels: string[], identity: {password: *, username: *}, options: {debug: boolean}, connection: {cluster: string, reconnect: boolean}}}
 */
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


/**
 * set prefix
 * @type {string}
 */
let prefix = '!';


/**
 * set channel name
 * @type {string}
 */
let channelName = 'Ratback';


/**
 * creates new instance and connects to the server
 * @type {tmi.client}
 */
var client = new tmi.client(options);
client.connect();


/**
 * give out a connected-message in the console
 */
client.on('connected', function (adress, port) {
    console.log("Adress: " + adress + " Port: " + port);
});


/**
 * 8ball messages
 * @type {string[]}
 */
const eightball = [
    'Soweit ich sehen kann, ja. Und jetzt geh mir nicht weiter auf meine göttlichen Nerven.',
    'Frag mich später nochmal. Ich bin grad zu sehr mit Bärengötterzeugs beschäftigt, you know?',
    'Meine Quellen sagen nein. Und du weißt ja, ich bin ein Bärengott, also ist es wahr.',
    'Die Antwort auf deine Frage ist 42 und das Universum.'
];


/**
 * timed messages
 * @type {string[]}
 */
const timedmsg = [
    'Joine unserem Discord Server und bleibe mit der gesamten Community connected! https://discord.com/invite/396vVRPCRF',
    'Folge Ratback auf Social Media, um immer up-to-date zu sein! https://www.instagram.com/ratbackttv/ | https://twitter.com/ratbackttv',
    'Joine gerne unserer öffentlichen Steamgruppe. Jeder ist herzlich eingeladen! https://steamcommunity.com/groups/ratbacktwitch',
    'Lust auf exklusive Speedpaint und mehr? Folge Ratback auf Youtube! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg',
    'Immer, wenn du zum ERSTEN Mal diesen Channel subscribest, zeichnet Ratback ein exklusive custom Rattenemote für dich, welches dann auf diesem Channel genutzt werden kann. Also schreibe Ratback auf jeden Fall eine Nachricht mit deinem Emotewunsch. <3',
    'Jede Form von Support bedeutet mir viel! Egal ob Lurker, aktiver Chatter, Donator, Subscriber oder Cheerer - ich bin jedem von euch sehr dankbar! Danke dafür, Leude! <3',
    'Denkt daran, regelmäßig etwas zu trinken! Cheers!'
];


/**
 * set the interval of timed messages
 */
setInterval(() => {
    const randomPost = timedmsg[Math.floor(Math.random() * timedmsg.length)];
    client.say(channelName, '/me ' +randomPost);
}, 1800000);


/**
 * listen to the chat
 */
client.on('chat', function (channel, user, message, self) {
    /**
     * return if message comes from self
     */
    if (self) return;


    /**
     * get the author of the message
     * @type {string}
     */
    let author = user['display-name'].toLowerCase();


    /**
     * check if the user is a moderator
     * @type {*|boolean}
     */
    const isMod = user.mod || user['user-type'] === 'mod';


    /**
     * check if the user is the broadcaster
     * @type {boolean}
     */
    const isBroadcaster = channel.slice(1) === author;


    /**
     * check if user is a moderator or a broadcaster
     * @type {*|boolean}
     */
    const isModUp = isMod || isBroadcaster;


    /**
     * do nothing, if the message doesn't start with a prefix
     */
    if (!message.startsWith(prefix)) return;


    /**
     * get the name of the command
     * @type {string}
     */
    let command = message.slice(prefix.length).trim().split(" ")[0];


    /**
     * get the arguments of the message
     * @type {string[]}
     */
    let args = message.slice(prefix.length).slice(command.length).trim().split(" ");


    /**
     * test which command is used
     */
    switch (command) {
        /**
         * gives a list of all commands which can be operated by the bot
         */
        case ['commands', 'cmds', 'cmd', 'help', 'command'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Ich kann die folgenden Commands ausführen: !ownemote !discord !youtube !twitter !instagram !steamgroup !fiverr !music !tip !steam !poke @username !8ball [deine ja-nein-Frage] !love !lurk !hydrate !wer");
            client.say(channelName, '/me Soundboard Commands: !rbeng (English Social Media Announcement) !rbger (German Social Media Announcement)');
            break;


        /**
         * gives a link to the community discord server
         */
        case ['discord', 'dc'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Joine unserer Community auf Discord: https://discord.com/invite/396vVRPCRF");
            break;


        /**
         * gives a link to ratback's twitter account
         */
        case 'twitter':
            client.say(channelName, "/me Folge Ratback auf Twitter: https://twitter.com/ratbackttv");
            break;


        /**
         * gives a link to ratback's steam group
         */
        case  ['group', 'steamgroup', 'sg'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Trete Ratback's Community auf Steam bei! JEDER darf der Gruppe joinen: https://steamcommunity.com/groups/ratbacktwitch");
            break;


        /**
         * gives a link to ratback's fiverr account
         */
        case 'fiverr':
            client.say(channelName, "/me Beauftrage Ratback als Künstler auf Fiverr: https://www.fiverr.com/kenowby");
            break;


        /**
         * gives a link to ratback's instagram account
         */
        case ['instagram', 'insta', 'ig'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Folge Ratback auf Instagram: https://www.instagram.com/ratbackttv/");
            break;


        /**
         * gives some info about donations
         */
        case ['donation', 'donate', 'tip'].find((value, index, arr) => command === value):
            client.say(channelName, "/me Wenn du Ratback eine kleine Spende geben willst, kannst du das über sein Tipeee machen! <3 https://www.tipeeestream.com/kenowby/donation");
            break;


        /**
         * gives a link to ratback's steam account
         */
        case 'steam':
            client.say(channelName, "/me Added Ratback auf Steam: https://steamcommunity.com/id/ratback/");
            break;


        /**
         * gives a shoutout to the tagged user
         */
        case ['shoutout', 'so'].find((value, index, arr) => command === value):
            if (args.length > 0) {
                if (isModUp === true) {
                    client.say(channelName, "/me Schaut doch mal bei @" + args[0].replace('@', '') + ": twitch.tv/" + args[0].replace('@', '') + " vorbei!");
                }
            }
            break;


        /**
         * pokes someone in the chat
         */
        case ['poke', 'stups'].find((value, index, arr) => command === value):
            if (args.length > 0) {
                client.say(channelName, "/me Yo, @" + args[0].replace('@', '').toLowerCase() + " ! *poke* *poke* Lass mich dich anstupsen! *poke* *poke* @" + author + " wollte, dass ich das mache. Ist nicht meine Schuld.");
            }
            break;


        /**
         * gives a random answer to a yes-no-question
         */
        case '8ball':
            if (args.length >= 1 && args[0] !== '') {
                const randomMessage = eightball[Math.floor(Math.random() * eightball.length)];
                client.say(channelName, "/me @" + author + " " + randomMessage);
            } else {
                client.say(channelName, "/me Wenn es keine Frage gibt, gibt es auch keine Antwort. @" + author);
            }
            break;


        /**
         * gives a link to ratback's youtube account
         */
        case ['yt', 'youtube'].find((value, index, arr) => command === value):
            client.say(channelName, '/me Folgt mir auf Youtube für exklusive Speedpaints und mehr! https://www.youtube.com/channel/UChXii0Ai8kFyZGP7VIVSGKg');
            break;


        /**
         * gives an info about someone joining lurk-modus
         */
        case 'lurk':
            client.say(channelName, '/me @' + author + " geht nun in den Lurkmodus. Danke fürs Zuschauen!");
            break;


        /**
         * gives a friendly reminder to drink
         */
        case ['hydrate', 'drink', 'water'].find((value, index, arr) => command === value):
            client.say(channelName, '/me Denkt daran, regelmäßig etwas zu trinken! Cheers!');
            break;


        /**
         * sends lots of love in the chat
         */
        case ['love', 'hype'].find((value, index, arr) => command === value):
            client.say(channelName, '<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3');
            break;


        /**
         * gives an info about how new subscribers are handled
         */
        case 'ownemote':
            client.say(channelName, '/me Jedes Mal, wenn ein Viewer zum ERSTEN Mal subscribed, fertige ich für diesen Viewer ein custom Rattenemote an, welches dann auf meinem Twitchkanal und auf Discord via BetterTTV genutzt werden kann. Denkt also daran, mir eine Nachricht zu schicken, wenn ihr zum ersten Mal subscribed habt. <3');
            break;


        /**
         * gives an info of which music is used in the stream
         */
        case ['music', 'musik'].find((value, index, arr) => command === value):
            client.say(channelName, '/me Die Musik, welche ich in meinen Streams nutze, ist von Epidemic Sound oder der ganz normale Gamesoundtrack des Spiels, welches ich gerade spiele.')


        /**
         * shows a list of people with which Ratback is streaming right now
         */
        case 'wer':
            client.say(channelName, '/me Ich spiele heute mit @KitTV, @xLumikettu und @HardyDigital! Schaut gerne mal bei ihren Kanälen vorbei: twitch.tv/kittv | twitch.tv/xlumikettu | twitch.tv/hardydigital');
            break;


        /**
         * sends a link to KitTV's Twitch account
         */
        case 'martin':
            client.say(channelName, '/me Schaut doch mal bei @KitTV vorbei. Ist ein korrekter Dude! twitch.tv/kittv');
            break;
    }
});