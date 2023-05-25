// https://www.freecodecamp.org/news/how-to-use-mysql-in-deno-oak/

// config
import * as client from "../client.js";

import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:model");

/**
 * Takes in the Id_Zuschauer params & checks if the Zuschauer item exists
 * in the database
 * @param Id_Zuschauer
 * @returns boolean to tell if an entry of Zuschauer exits in table
 */

// export function getUserByIdDB(db, id) {
// const queryWithParams = await db.query(
//   "select ?? from ?? where Id_Zuschauer = ?",
//   ["Id_Zuschauer", "Zuschauer", 1],
// );
// }

/**
 * Adds a new Zuschauer item to Zuschauer table
 * @param name
 * @param email
 * @param lieblingsfilm
 * @param filme
 */

export async function addToDB(db, data) {
  // await client.run();
  let result = await db.execute(
    `INSERT INTO ZUSCHAUER SET name=?, email=?, lieblingsfilm=?, filme=?`,
    [data.name, data.email, data.lieblingsfilm, data.filme],
  );
  console.log(result.lastInsertId);
  // { affectedRows: 1, lastInsertId: 1 }
  return result.lastInsertId;
}
