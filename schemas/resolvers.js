const { db } = require("../pgAccess");

async function getSender(id) {
  const query = `SELECT * FROM sender WHERE user_id=$1`;
  const values = [id];

  try {
    return await db.one(query, values);
  } catch (err) {
    return err;
  }
}

async function getSenders() {
  const query = `SELECT * FROM sender`;

  try {
    return await db.many(query);
  } catch (err) {
    return err;
  }
}

async function getSuggestions(args) {
  const query = `
    SELECT
      suggestion.id,
      file_id,
      made_at,
      suggestion.user_id
    FROM
      suggestion
    LEFT JOIN
      review ON suggestion.id = review.suggestion_id
    LEFT JOIN
      sender ON suggestion.user_id = sender.user_id
    WHERE
      (suggestion.user_id=$1 OR $1 IS NULL)
      tbr_$2
        AND
      sender.is_banned = false
    ORDER BY made_at ASC 
    LIMIT $3 OFFSET $4`
      .replace('tbr_$2', args.status === undefined
        ? ''
        : 'AND review.result_code IN ( SELECT(unnest($2)) )');
  const values = [
    args.user_id,
    args.status,
    args.limit,
    args.offset,
  ];

  try {
    return await db.many(query, values);
  } catch (err) {
    return err;
  }
}

async function getSuggestion(id) {
  const query = `
    SELECT
      id,
      file_id,
      made_at,
      user_id
    FROM suggestion WHERE id=$1
    `;
  const values = [id];

  console.log(id)

  try {
    return await db.one(query, values);
  } catch (err) {
    return err;
  }
}

async function getSuggestionsByIds(ids) {
  const query = `
    SELECT
      id,
      file_id,
      made_at,
      user_id
    FROM suggestion WHERE user_id IN (SELECT (unnest($1)) )
    `;

  const values = [ids]

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

async function getReviews(suggestion_id) {
  const query = `
    SELECT 
      * 
    FROM 
      review 
    WHERE 
      suggestion_id=$1
  `;
  const values = [suggestion_id];

  try {
    return await db.many(query, values);
  } catch (err) {
    return err;
  }
}

module.exports = {
  getSender: getSender,
  getSenders: getSenders,
  getSuggestions: getSuggestions,
  getSuggestionsByIds: getSuggestionsByIds,
  getSuggestion: getSuggestion,
  getSuggester: getSuggester,
  getReview: getReview,
  getReviews: getReviews,

}