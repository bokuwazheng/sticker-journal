const graphql = require("graphql");
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLID } = graphql;
const DataLoader = require("dataloader");
const resolvers = require("./resolvers.js");

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

const SuggestionType = new GraphQLObjectType({
  name: "Suggestion",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    file_id: { type: GraphQLString },
    made_at: { type: GraphQLString },
    user_id: { type: GraphQLID },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve: (suggestion) => resolvers.getReviews(suggestion.id)
    }
  }
});

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
    notify: { type: GraphQLBoolean },
    suggestions: {
      type: new GraphQLList(SuggestionType),
      resolve: (sender, args, context, info) => {
        const { dataloaders } = context;
        let loader = dataloaders.get(context);
        if (!loader) {
          loader = new DataLoader(async ids => {
            const rows = await resolvers.getSuggestionsByIds(ids);
            const sorted = ids.map(id => rows.filter(x => x.user_id === id));
            return sorted;
          })
          dataloaders.set(context, loader);
        }
        return loader.load(sender.user_id);
      }
    }
  }
});

exports.SenderType = SenderType;
exports.SenderInput = SenderInput;
exports.SuggestionType = SuggestionType;
exports.ReviewType = ReviewType;
exports.ReviewInput = ReviewInput;