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
        } catch (error) {
            console.log(error(error.message));
        }
    }
}
