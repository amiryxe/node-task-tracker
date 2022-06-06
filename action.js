import fs from 'fs'

import chalk from 'chalk'
import inquirer from 'inquirer'
import axios from 'axios'
import { parse, stringify } from 'csv/sync'

import DB from './db.js'
import Task from './task.js'

const error = chalk.redBright.bold
const warn = chalk.yellowBright.bold
const success = chalk.greenBright.bold

export default class Action {
    static list() {
        const tasks = Task.getAllTasks(true)
        if (tasks.length) {
            console.table(tasks)
        } else {
            console.log(warn('No tasks found'));
        }
    }

    static async add() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter task Title:',
                validate: (value) => {
                    if (value.length < 3) {
                        return 'Please enter a valid title'
                    }
                    return true
                },
            },
            {
                type: 'confirm',
                name: 'completed',
                message: 'Is task completed?',
                default: false,
            }
        ])

        try {
            const task = new Task(answers.title, answers.completed)
            task.save()
            console.log(success('Task added successfully'));
        } catch (err) {
            console.log(error(err.message));
        }
    }

    static async delete() {
        const tasks = Task.getAllTasks(true)
        const choices = []

        for (const task of tasks) {
            choices.push(task.title)
        }

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select task to delete:',
                choices
            }
        ])

        const task = Task.getTaskByTitle(answer.title)

        try {
            DB.deleteTask(task.id)
            console.log(success('Task deleted successfully'))
        } catch (error) {
            console.log(error(error.message))
        }
    }

    static async deleteAll() {
        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'result',
                message: 'Are you sure you want to delete all tasks?',
            }
        ])

        if (answer.result) {
            try {
                DB.resetDB()
                console.log(success('All tasks deleted successfully'))
            }
            catch (error) {
                console.log(error(error.message))
            }
        }
    }

    static async edit() {
        const tasks = Task.getAllTasks(true)
        const choices = []

        for (const task of tasks) {
            choices.push(task.title)
        }

        const selectedTask = await inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Select task to edit:',
                choices
            }
        ])

        const task = Task.getTaskByTitle(selectedTask.title)

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter task Title:',
                validate: (value) => {
                    if (value.length < 3) {
                        return 'Please enter a valid title'
                    }
                    return true
                },
                default: task.title,
            },
            {
                type: 'confirm',
                name: 'completed',
                message: 'Is task completed?',
                default: task.completed,
            }
        ])

        try {
            DB.saveTask(answers.title, answers.completed, task.id)
            console.log(success('Task edited successfully'))
        } catch (error) {
            console.log(error(error.message));
        }
    }

    static async export() {
        const answer = await inquirer.prompt({
            type: 'input',
            name: 'filename',
            message: 'Enter filename:',
            validate: (value) => {
                if (!/^[\w .-]{1,50}$/.test(value)) {
                    return 'Please enter a valid filename'
                }
                return true
            }
        })

        const tasks = Task.getAllTasks(true)
        const output = stringify(tasks, {
            header: true, // name of columns
            cast: { // manipulate data before writing to csv
                boolean: (value, context) => {
                    return String(value)
                }
            }
        })

        try {
            fs.writeFileSync(answer.filename, output)
            console.log(success('Tasks exported successfully'))
        } catch (err) {
            console.log(error(err.message));
        }
    }

    static async import() {
        const answer = await inquirer.prompt({
            type: 'input',
            name: 'filename',
            message: 'Enter filename:',
        })

        if (fs.existsSync(answer.filename)) {
            try {
                const input = fs.readFileSync(answer.filename)
                const data = parse(input, {
                    columns: true,
                    cast: (value, context) => {
                        if (context.column === 'id') {
                            return Number(value)
                        } else if (context.column === 'completed') {
                            return value.toLowerCase() === 'true' ? true : false
                        }

                        return value
                    }
                })
                DB.insertBulkData(data)
                console.log(success('Tasks imported successfully'));
            } catch (err) {
                console.log(error(err.message));
            }
        }
    }

    static async download() {
        const baseURL = process.env.BASE_URL
        const answer = await inquirer.prompt({
            type: 'input',
            name: 'filename',
            message: 'Enter filename to download:',
        })

        const config = {
            baseURL,
            url: answer.filename
        }

        try {
            const response = await axios(config)
            const data = parse(response.data, {
                columns: true,
                cast: (value, context) => {
                    if (context.column === 'id') {
                        return Number(value)
                    } else if (context.column === 'completed') {
                        return value.toLowerCase() === 'true' ? true : false
                    }

                    return value
                }
            })
            DB.insertBulkData(data)
            console.log(success('Tasks imported successfully'));
            console.table(data)
        } catch (err) {
            console.log(error(err.message));
        }
    }
}
