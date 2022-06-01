import "dotenv/config"
import DB from './db.js'

console.log(process.env.DB_FILE);

console.log(DB.getAllTasks());