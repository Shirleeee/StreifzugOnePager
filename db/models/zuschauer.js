// https://www.freecodecamp.org/news/how-to-use-mysql-in-deno-oak/

// import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
// const debug = Debug("app:model");

/**
 * Adds a new zuschauer item to zuschauer table
 * @param name
 * @param email
 * @param lieblingsfilm
 * @param filme
 */

export async function addToDB(db, data) {
  const result = await db.execute(
    `INSERT INTO ZUSCHAUER SET name=?, email=?, lieblingsfilm=?, filme=?`,
    [data.name, data.email, data.lieblingsfilm, data.filme],
  );
  console.log(result.lastInsertId);
  // { affectedRows: 1, lastInsertId: 1 }
  return result.lastInsertId;
}
