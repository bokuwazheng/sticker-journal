const DataLoader = require("dataloader");
const resolvers = require("./resolvers.js");

function factory(batchFunc) {
  const store = new WeakMap();

  return function getLoader(ctx) {
    let loader = store.get(ctx);
    if (!loader) {
      loader = new DataLoader(keys => batchFunc(keys, ctx));
      store.set(ctx, loader);
    }
    return loader;
  };
};

const getSuggestions = factory(async (ids, cts) => {
  const rows = await resolvers.getSuggestionsByIds(ids);
  const sorted = ids.map(id => rows.filter(x => x.user_id === id));
  return sorted;
});

const getReviews = factory(async (ids, cts) => {
  const rows = await resolvers.getReviewsByIds(ids);
  const sorted = ids.map(id => rows.filter(x => x.suggestion_id === id));
  return sorted;
});

module.exports = {
  getSuggestions: getSuggestions,
  getReviews: getReviews,

}