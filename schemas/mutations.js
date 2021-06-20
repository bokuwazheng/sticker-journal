const graphql = require("graphql");
const db = require("../pgAccess").db;
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;
const { SenderType, SenderInput, SuggestionType, ReviewType, ReviewInput } = require("./types");

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {

    updateSender: {
      type: SenderType,
      args: {
        sender: { type: SenderInput }
      },
      async resolve(parentValue, args) {
        const query = `
          UPDATE 
            sender
          SET 
            is_banned = $2, 
            notify = $3
          WHERE 
            user_id = $1
          RETURNING *
          `;
        const values = [
          args.sender.user_id,
          args.sender.is_banned,
          args.sender.notify
        ];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    }, 

    addSender: {
      type: SenderType,
      args: {
        sender: { type: SenderInput }
      },
      async resolve(parentValue, args) {
        const query = `
          INSERT INTO sender 
            (user_id, first_name, last_name, username, chat_id)
            VALUES 
            ($1, $2, $3, $4, $5)
          RETURNING *
          `;
        const values = [
          args.sender.user_id,
          args.sender.first_name,
          args.sender.last_name,
          args.sender.username,
          args.sender.chat_id
        ];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    addSuggestion: {
      type: SuggestionType,
      args: {
        file_id: { type: GraphQLID },
        user_id: { type: GraphQLID }
      },
      async resolve(parentValue, args) {
        const query = `
          INSERT INTO suggestion 
            (file_id, made_at, user_id) 
            VALUES 
            ($1, CURRENT_TIMESTAMP, $2) 
          RETURNING *
          `;
        const values = [
          args.file_id,
          args.user_id
        ];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },

    addReview: {
      type: ReviewType,
      args: {
        review: { type: ReviewInput }
      },
      async resolve(parentValue, args) {
        const query = `
          INSERT INTO review
            (suggestion_id, user_id, submitted_at, result_code)
          VALUES
            ($1, $2, CURRENT_TIMESTAMP, $3)
          RETURNING *
          `;
        const values = [
          args.review.suggestion_id,
          args.review.user_id,
          args.review.result_code
        ];

        try {
          return await db.one(query, values);
        } catch (err) {
          return err;
        }
      }
    },


  }
});

exports.mutation = RootMutation;