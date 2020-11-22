module.exports = {
    run: (db, message, args, client) => {
        if (message.author.id === '364481003479105537' || message.author.id === '422820341791064085') {
            const content = message.content
                .split(' ')
                .slice(1)
                .join(' ')
            // eslint-disable-next-line no-eval
            const result = new Promise(resolve => resolve(eval(content)))
            return result
                .then(output => {
                    if (typeof output !== 'string') {
                        output = require('util').inspect(output, { depth: 0 })
                    }
                    if (output.includes(message.client.token)) {
                        output = output.replace(message.client.token, 'T0K3N')
                    }
                    return message.channel.send(output, { code: 'js' })
                })
                .catch(err => {
                    err = err.toString()
                    if (err.includes(message.client.token)) {
                        err = err.replace(message.client.token, 'T0K3N')
                    }
                    return message.channel.send(err, { code: 'js' })
                })
        }
    }
}
