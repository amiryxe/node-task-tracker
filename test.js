import "dotenv/config"
import DB from './db.js'

import Task from "./task.js"


const t2 = Task.getTaskById(3)

console.log(t2);