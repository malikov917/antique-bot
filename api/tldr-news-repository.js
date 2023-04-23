const mongoose = require('mongoose');
const tldrNewsSchema = require('./tldr-news-schema');
const TLDR_NEWS_NAME = TLDR_NEWS_COLLECTION = 'tldr-news';
const NewsModel = mongoose.model(TLDR_NEWS_NAME, tldrNewsSchema, TLDR_NEWS_COLLECTION);
let cachedAllItems = [];

async function add(item) {
  return new NewsModel({
    _id: item._id,
    headline: item.headline,
    description: item.description,
    url: item.url,
    image: item.image,
    status: item.status || 'NEW'
  }).save();
}

async function findById(connector, _id) {
  return NewsModel.findOne({ _id });
}

async function updateById(_id, model) {
  return NewsModel.findByIdAndUpdate({ _id }, {...model});
}

async function removeById(_id) {
  return NewsModel.deleteOne({ _id });
}

async function getAllFromCache() {
  if (cachedAllItems.length > 0) {
    return cachedAllItems;
  }
  return await getAll();
}

async function getAll() {
  const items = await NewsModel.find();
  cachedAllItems = items;
  return items;
}

async function saveBulk(newsItems) {
  const upsertOps = newsItems.map(newsItem => {
    return {
      updateOne: {
        filter: { _id: newsItem._id },
        update: { $set: { ...newsItem } },
        upsert: true
      }
    };
  });
  return await NewsModel.bulkWrite(upsertOps);
}

exports.add = add;
exports.findById = findById;
exports.updateById = updateById;
exports.getAll = getAllFromCache;
exports.saveBulk = saveBulk;
