const colors = require('colors');
const log4js = require("log4js");
const fs = require('fs');
module.exports = {
	logger() {
		try {
			fs.stat('./logs/latest.log', function (err, stats) {
				if (err) {
					return;
				}

				fs.writeFile('./logs/latest.log', '', function (err) {
					if (err) return console.log(err);
				});
			});

			fs.stat('./logs/latestDebug.log', function (err, stats) {
				if (err) {
					return;
				}

				fs.writeFile('./logs/latestDebug.log', '', function (err) {
					if (err) return console.log(err);
				});
			});
		} catch (error) {
			console.log(error);
		}
		log4js.addLayout('logOut', function () {
			return function (logEvent) {
				const date = `[${new Date().toLocaleDateString().replace(/(\[.*\])/gm, '')} | ${new Date().toLocaleTimeString()}.${new Date().toISOString().split('T')[1].replace(/(.*:*\d[.])/gm, '').replace('Z', '')}]`;
				switch (logEvent.level.levelStr) {
					case 'ERROR':
						return `${date.red} [${logEvent.level.toString().red}] - ${logEvent.data.toString().red}\n`;
					case 'DEBUG':
						return `${date.blue} [${logEvent.level.toString().blue}] - ${logEvent.data.toString().blue}\n`;
					case 'FATAL':
						return `${date.red} [${logEvent.level.toString().red}] - ${logEvent.data.toString().red}\n`;
					case 'INFO':
						return `${date.magenta} [${logEvent.level.toString().magenta}] - ${logEvent.data.toString().magenta}\n`;
					case 'TRACE':
						return `${date.cyan} [${logEvent.level.toString().cyan}] - ${logEvent.data.toString().cyan}\n`;
					case 'WARN':
						return `${date.yellow} [${logEvent.level.toString().yellow}] - ${logEvent.data.toString().yellow}\n`;
					default:
						return `${date} [${logEvent.level}] - ${logEvent.data}`;
				}
			}
		})
		log4js.addLayout('fileOut', () => {
			return function (logEvent) {
				const date = `[${new Date().toLocaleDateString().replace(/(\[.*\])/gm, '')} | ${new Date().toLocaleTimeString()}.${new Date().toISOString().split('T')[1].replace(/(.*:*\d[.])/gm, '').replace('Z', '')}]`;
				return `${date} [${logEvent.level}] - ${logEvent.data}\n`;
			}
		})
		const fileDate = `${new Date().toLocaleDateString().replace(/(\[.*\])/gm, '')}_${new Date().toLocaleTimeString()}.${new Date().toISOString().split('T')[1].replace(/(.*:*\d[.])/gm, '').replace('Z', '')}`.replace(/(\D)/gm, "-");
		log4js.configure({
			appenders: {
				stdout: {
					type: 'stdout',
					layout: {
						type: 'logOut'
					}

				},
				pikaLog: {
					type: "file",
					filename: `./logs/pikabot_${fileDate.toString()}.log`,
					layout: {
						type: 'fileOut'
					}
				},
				latest: {
					type: 'file',
					filename: "./logs/latest.log",
					layout: {
						type: 'fileOut'
					}
				},
				debugLog: {
					type: 'file',
					filename: './logs/latestDebug.log',
					layout: {
						type: 'fileOut'
					}
				}
			},
			categories: {
				default: {
					appenders: ['stdout'],
					level: 'info'
				},
				logFile: {
					appenders: ['latest'],
					level: 'info'
				},
				logDebug: {
					appenders: ['debugLog'],
					level: 'debug'
				}
			}
		});

		// Define LoggerMap.
		log4js.getLogger('filter');
		let loggerMap = new Map();
		loggerMap.set("conLog", log4js.getLogger("pikaLog"));
		loggerMap.set("fileLog", log4js.getLogger('logFile'));
		loggerMap.set("debugLog", log4js.getLogger('logDebug'));
		// Listen to uncaught Exceptions in program.
		process.on('uncaughtException', err => {
			loggerMap.forEach(logger => logger.error(err.stack))
		})

		process.on('unhandledRejection', err => {
			loggerMap.forEach(logger => logger.fatal(err));
		})

		return logger = loggerMap;
	}
};