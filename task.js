import util from 'util'

import chalk from 'chalk'

import DB from './db.js'

export default class Task {
    #id = 0
    #title
    #completed

    constructor(title, completed = false) {
        this.#title = title
        this.#completed = completed
    }

    get id() {
        return this.#id
    }

    get title() {
        return this.#title
    }

    set title(value) {
        if (typeof value !== 'string' || value.length < 3) {
            throw new Error('Title must be at least 3 characters long')
        }
        this.#title = value
    }

    get completed() {
        return this.#completed
    }

    set completed(value) {
        this.#completed = Boolean(value)
    }

    [util.inspect.custom]() {
        return `Task {
    id: ${chalk.yellowBright(this.#id)},
    title: ${chalk.greenBright(this.#title)},
    completed: ${chalk.blueBright(this.#completed)}
}`
    }

    save() {
        try {
            const id = DB.saveTask(this.#title, this.#completed, this.#id)
            this.#id = id
        } catch (error) {
            throw new Error(error)
        }
    }

    static getTaskById(id) {
        try {
            const task = DB.getTaskByID(id)
            if (task) {
                const item = new Task(task.title, task.completed)
                item.#id = id
                return item
            }
            return false
        } catch (error) {
            throw new Error(error)
        }
    }
}