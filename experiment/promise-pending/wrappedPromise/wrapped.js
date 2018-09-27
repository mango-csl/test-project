// Class that should be able to be garbaged collected when promise is trashed.
const {
    defaultOnError,
    defaultMessage,
    defaultOnResponse,
    // throttle: _throttle
} = require('./config');

class Wrapped {
    constructor(promise, {onResponse, onError, onMessage} = {
        onResponse: defaultOnResponse,
        onError: defaultOnError,
        onMessage: defaultMessage
    }) {
        promise
            .then((res) => {
                onResponse(res);
                onMessage.log(' --- Wrapped success --- ');
            })
            .catch(error => {
                if (error.isCanceled) {
                    console.info('promise has canceled');
                    return;
                }
                let errorMsg = onError(error);
                onMessage.error(errorMsg);
            });
    }
}

module.exports = Wrapped;