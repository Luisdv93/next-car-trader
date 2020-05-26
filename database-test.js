const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "cars.sqlite");
console.log("dbPath test", dbPath);

async function setup() {
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.migrate({ force: "last" });

  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  console.log("ALL FAQ", faq.length);

  const cars = await db.all("SELECT * FROM Car");
  console.log("ALL CARS", cars.length);
}

setup();
