const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLID } = graphql;

const SenderType = new GraphQLObjectType({
  name: "Sender",
  type: "Query",
  fields: {
    user_id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    username: { type: GraphQLString },
    is_banned: { type: GraphQLBoolean },
    chat_id: { type: GraphQLString },
    notify: { type: GraphQLBoolean }
  }
});

const SenderInput = new GraphQLInputObjectType({
  name: "SenderInput",
  type: "Input",
  fields: {
    user_id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    username: { type: GraphQLString },
    is_banned: { type: GraphQLBoolean },
    chat_id: { type: GraphQLID },
    notify: { type: GraphQLBoolean }
  }
});

const SuggestionType = new GraphQLObjectType({
  name: "Suggestion",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    file_id: { type: GraphQLString },
    made_at: { type: GraphQLString },
    user_id: { type: GraphQLID }
  }
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    suggestion_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    submitted_at: { type: GraphQLString },
    result_code: { type: GraphQLInt }
  }
});

const ReviewInput = new GraphQLInputObjectType({
  name: "ReviewInput",
  type: "Input",
  fields: {
    id: { type: GraphQLID },
    suggestion_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    submitted_at: { type: GraphQLString },
    result_code: { type: GraphQLInt }
  }
});

exports.SenderType = SenderType;
exports.SenderInput = SenderInput;
exports.SuggestionType = SuggestionType;
exports.ReviewType = ReviewType;
exports.ReviewInput = ReviewInput;