import fs from 'fs'
import chalk from 'chalk'

const filename = process.env.DB_FILE
const warn = chalk.yellowBright.bold
const success = chalk.greenBright.bold

export default class DB {
    static createDB() {
        if (fs.existsSync(filename)) {
            console.log(warn('DB file already exist'));
            return false
        }

        try {
            fs.writeFileSync(filename, "[]", "utf-8")
            console.log(success('DB file created successfully'));
            return true
        } catch (err) {
            throw new Error('Cannot write in ' + filename)
        }
    }

    static resetDB() {
        try {
            fs.writeFileSync(filename, "[]", "utf-8")
            console.log(success('DB file reset successfully'));
            return true
        } catch (err) {
            throw new Error('Cannot write in ' + filename)
        }
    }

    static DBExists() {
        if (fs.existsSync(filename)) {
            return true
        } else {
            return false
        }
    }

    static getTaskByID(id) {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, "utf-8")
        } else {
            DB.createDB()
            return false
        }

        try {
            data = JSON.parse(data)
            const task = data.find(task => task.id === id)
            return task ? task : false
        } catch (error) {
            throw new Error('Syntax error')
        }
    }

    static getTaskByTitle(title) {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, "utf-8")
        } else {
            DB.createDB()
            return false
        }

        try {
            data = JSON.parse(data)
            const task = data.find(task => task.title === title)
            return task ? task : false
        } catch (error) {
            throw new Error('Syntax error')
        }
    }

    static getAllTasks() {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, "utf-8")
        } else {
            DB.createDB()
            return []
        }

        try {
            data = JSON.parse(data)
            return data
        } catch (error) {
            throw new Error('Syntax error')
        }
    }
}