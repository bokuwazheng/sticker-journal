const { db } = require("../pgAccess");

async function getSender(id) {
  const query = `SELECT * FROM sender WHERE user_id=$1`;
  const values = [id];

  console.log(id)

  try {
    return await db.one(query, values);
  } catch (err) {
    return err;
  }
}

async function getSuggestions(user_id) {
  const query = `
    SELECT
      id,
      file_id,
      made_at,
      user_id
    FROM suggestion WHERE user_id=$1
    `;
  const values = [user_id];

  console.log(user_id)

  try {
    return await db.many(query, values);
  } catch (err) {
    return err;
  }
}

async function getSuggester(suggestion_id) {
  const query = `
    SELECT 
      * 
    FROM 
      sender 
    WHERE 
      user_id = (
        SELECT user_id FROM suggestion WHERE id=$1
      )
    `;
  const values = [suggestion_id];

  try {
    return await db.one(query, values);
  } catch (err) {
    return err;
  }
}

async function getReview(suggestion_id) {
  const query = `
    SELECT 
      * 
    FROM 
      review 
    WHERE 
      suggestion_id=$1 
    ORDER BY submitted_at DESC 
    FETCH FIRST 1 ROW ONLY
  `;
  const values = [suggestion_id];

  try {
    return await db.one(query, values);
  } catch (err) {
    return err;
  }
}

module.exports = {
  getSender: getSender,
  getSuggestions: getSuggestions,
  getSuggester: getSuggester,
  getReview: getReview,

}