const { db } = require("../pgAccess");
const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList } = require("graphql");
const { SenderType, SuggestionType, ReviewType } = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    sender: {
      type: SenderType,
      args: { user_id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        const query = `SELECT * FROM sender WHERE user_id=$1`;
        const values = [args.user_id];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    suggester: {
      type: SenderType,
      args: { suggestion_id: { type: GraphQLID } },
      async resolve(parentValue, args) {
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
        const values = [args.suggestion_id];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    senders: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SenderType))),
      async resolve(parentValue, args) {
        const query = `SELECT * FROM sender`;

        try {
          return await db.any(query);
        } catch (err) {
          return err;
        }
      }
    },

    suggestion: {
      type: SuggestionType,
      args: { id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        const query = `
          SELECT
            id,
            file_id,
            made_at,
            user_id
          FROM suggestion WHERE id=$1
          `;
        const values = [args.id];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    newSuggestion: {
      type: SuggestionType,
      async resolve(parentValue, args) {
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
            review.id IS NULL
            AND sender.is_banned = false
          ORDER BY made_at ASC 
          FETCH FIRST 1 ROW ONLY
          `;

        try {
          return await db.one(query);
        } catch (err) {
          return err;
        }
      }
    },

    review: {
      type: ReviewType,
      args: { suggestion_id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        const query = `
        SELECT 
          * 
        FROM 
          review 
        WHERE 
          suggestion_id=$1 
        ORDER BY submitted_at DESC 
        FETCH FIRST 1 ROW ONLY`;
        const values = [args.suggestion_id];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    newReview: {
      type: ReviewType,
      args: { user_id: { type: GraphQLID } },
      async resolve(parentValue, args) {
        const query = `
          SELECT
            *
          FROM
            review
          WHERE 
            suggestion_id = (
              SELECT
                id
              FROM 
                suggestion
              WHERE
                user_id = $1
              ORDER BY suggestion.made_at DESC
              FETCH FIRST 1 ROW ONLY
            )
          ORDER BY review.submitted_at DESC
          FETCH FIRST 1 ROW ONLY
          `;
        const values = [args.user_id];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

  }
});

exports.query = RootQuery;