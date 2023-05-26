import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";

export const client = await new Client();

client.connect({
  hostname: "127.0.0.1",
  username: "root",
  password: "",
  db: "streifzug",
});

// export const run = async () => {
//   // // create database (if not created before)
//   await client.execute(`CREATE DATABASE IF NOT EXISTS streifzug`);
//   // select db
//   await client.execute(`USE streifzug`);
//   // delete table if it exists before
//   await client.execute(`DROP TABLE IF EXISTS zuschauer`);
//   // create table
//   await client.execute(`
//     CREATE TABLE zuschauer (
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         name VARCHAR(45) NOT NULL,
//         email VARCHAR(90),
//         lieblingsfilm VARCHAR(45) NOT NULL,
//         filme TINYTEXT NOT NULL
//         PRIMARY KEY (id)
//     ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
//   `);
//   // delete table if it exists before
// };

// // run();

// export default client;
