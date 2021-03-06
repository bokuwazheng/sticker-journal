const { db, pgp } = require("../pgAccess");

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
      $5:raw
        AND
      sender.is_banned = false
    ORDER BY made_at ASC
    LIMIT $3 OFFSET $4
    `;
  const where = args.status !== undefined
    ? pgp.as.format('AND review.result_code IN ($1:list)', args.status)
    : '';
  const values = [
    args.user_id,
    args.status,
    args.limit,
    args.offset,
    where
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
    FROM 
      suggestion 
    WHERE 
      user_id IN ($1:list)
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
    LIMIT 1
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

async function getReviewsByIds(ids) {
  const query = `
    SELECT 
      * 
    FROM 
      review 
    WHERE 
      suggestion_id IN ($1:list)
  `;
  const values = [ids];

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
  getReviewsByIds: getReviewsByIds,

}