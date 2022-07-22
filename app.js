import 'dotenv/config'
import chalk from 'chalk'

import Action from './action.js'

const command = process.argv[2]
const commands = [
    'list',
    'add',
    'delete',
    'delete-all',
    'edit',
    'export',
    'import',
    'download',
    'help'
]

const error = chalk.redBright.bold
const warn = chalk.yellowBright.bold

if (command) {
    if (command === 'list') {
        Action.list()
    } else if (command === 'add') {
        Action.add()
    } else if (command === 'delete') {
        Action.delete()
    } else if (command === 'delete-all') {
        Action.deleteAll()
    } else if (command === 'edit') {
        Action.edit()
    } else if (command === 'export') {
        Action.export()
    } else if (command === 'import') {
        Action.import()
    } else if (command === 'download') {
        Action.download()
    }
    else if (command === 'help') {
        console.log(`
${chalk.bgBlue('You can use this commands:')}
${warn('  list')}
${warn('  add')}
${warn('  delete')}
${warn('  delete-all')}
${warn('  edit')}
${warn('  export')}
${warn('  import')}
${warn('  download')}
        `)
    } else {
        console.log(error('Unknown command: ' + command))
    }
} else {
    const message = `${error("you must enter a command.")}
    Available commands: ${warn(commands.join(', '))}`

    console.log(message);
}