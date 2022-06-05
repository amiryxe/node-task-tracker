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

    static saveTask(title, completed = true, id = 0) {
        id = Number(id)

        if (id < 0 || id !== parseInt(id)) {
            throw new Error('ID must be a positive integer')
        } else if (typeof title !== 'string' || title.length < 3) {
            throw new Error('Title must be a string with at least 3 characters')
        }

        const task = DB.getTaskByTitle(title)
        if (task && task.id != id) {
            throw new Error('Task already exists')
        }

        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, "utf-8")
        } else {
            try {
                DB.createDB()
                data = "[]"
            } catch (err) {
                throw new Error(err.message)
            }
        }

        try {
            data = JSON.parse(data)
        } catch (error) {
            throw new Error('Syntax error')
        }

        if (id === 0) {
            if (data.length === 0) {
                id = 1
            } else {
                id = data[data.length - 1].id + 1
            }

            data.push({
                id,
                title,
                completed
            })

            const str = JSON.stringify(data, null, "    ")

            try {
                fs.writeFileSync(filename, str, "utf-8")
                return id
            } catch (err) {
                throw new Error(err.message)
            }
        } else {
            const task = data.find(task => task.id === id)

            if (task) {
                task.title = title
                task.completed = completed

                const str = JSON.stringify(data, null, "    ")

                try {
                    fs.writeFileSync(filename, str, "utf-8")
                    return id
                } catch (error) {
                    throw new Error(error.message)
                }
            }

            throw new Error('Task not found')
        }
    }

    static insertBulkData(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data)
            } catch (error) {
                throw new Error('Syntax error')
            }
        }

        if (data instanceof Array) {
            try {
                data = JSON.stringify(data, null, "    ")
            } catch (error) {
                throw new Error('invalid data')
            }
        }

        try {
            fs.writeFileSync(filename, data)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static deleteTask(id) {
        id = Number(id)

        if (id > 0 && id === parseInt(id)) {
            let data

            try {
                data = fs.readFileSync(filename, "utf-8")
                data = JSON.parse(data)
            } catch (error) {
                throw new Error('cannot read db file')
            }

            const task = data.find(task => task.id === id)

            if (task) {
                data.splice(data.indexOf(task), 1)
                data = JSON.stringify(data, null, "    ")

                try {
                    fs.writeFileSync(filename, data)
                    return true
                } catch (error) {
                    throw new Error(error.message)
                }
            }
            return false
        } else {
            throw new Error('invalid id')
        }
    }
}