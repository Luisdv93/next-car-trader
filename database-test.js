const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

async function setup() {
  const db = await sqlite.open({
    filename: "cars.sqlite",
    driver: sqlite3.Database,
  });

  await db.migrate({ force: "last" });

  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  console.log("ALL FAQ", faq.length);

  const cars = await db.all("SELECT * FROM Car");
  console.log("ALL CARS", cars.length);
}

setup();
