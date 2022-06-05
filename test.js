import "dotenv/config"
import DB from './db.js'

import Task from "./task.js"


const t2 = Task.getAllTasks()

// console.log(t2);

console.log(process.argv);