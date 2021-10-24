import 'colors';

class Logger {
    static codes = {
        0: 'red',
        1: 'green',
        2: 'blue'
    }

    static log(main, ...args) {
        console.log(`[${main}]`.red, args.join(' | '))
    }
}


export default Logger;