const Database = require("better-sqlite3");
const db = new Database(`cryptax_${new Date().toJSON().slice(0, 10)}.db`);

export default db;
