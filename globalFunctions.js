module.exports = {
    globalFunctions: (loggerMap) => {
        // Define Global-Log function.
        global.logAll = (message, level) => {
            let map = loggerMap;
            if (level !== undefined) {
                level = level.toUpperCase();
            }
            switch (level) {
                case 'DEBUG':
                    map.forEach(logger => logger.debug(message));
                    break;
                case 'ERROR':
                    map.forEach(logger => logger.error(message));
                    break;
                case 'WARN':
                    map.forEach(logger => logger.warn(message));
                    break;
                case 'TRACE':
                    map.forEach(logger => logger.trace(message));
                    break;
                case 'FATAL':
                    map.forEach(logger => logger.fatal(message));
                    break;
                default:
                    map.forEach(logger => logger.info(message));
                    break;
            }
        }

        global.isLocalhost = true;
    }
}