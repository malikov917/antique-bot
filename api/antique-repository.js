const mongoose = require('mongoose');
const antiquesSchema = require('./antique-schema');
const ANTIQUES_NAME = ANTIQUES_COLLECTION = 'antiques';
const Antique = mongoose.model(ANTIQUES_NAME, antiquesSchema, ANTIQUES_COLLECTION);
let cachedAllItems = [];

// (!) main file to handle ANTIQUES collection in database

// example how to use:
// const res = await antiqueRepository.addItem(item);
// const res1 = await antiqueRepository.findById('123');

async function addItem(item) {
  return new Antique({
    _id: item._id,
    title: item.title,
    description: item.description,
    url: item.url,
    price: item.price,
    status: item.status || 'NEW'
  }).save();
}

async function findById(connector, _id) {
  return Antique.findOne({ _id });
}

async function updateById(_id, model) {
  return Antique.findByIdAndUpdate({ _id }, {...model});
}

async function removeById(_id) {
  return Antique.deleteOne({ _id });
}

async function getAllFromCache() {
  if (cachedAllItems.length > 0) {
    return cachedAllItems;
  }
  return await getAll();
}

async function getAll() {
  const items = await Antique.find();
  cachedAllItems = items;
  return items;
}

async function saveBulk(array) {
  const upsertOps = array.map(newsItem => {
    return {
      updateOne: {
        filter: { _id: newsItem._id },
        update: { $set: { ...newsItem } },
        upsert: true
      }
    };
  });
  return await Antique.bulkWrite(upsertOps);
}

async function updateOne(doc, hash) {
  return Antique.updateOne(
      { _id: doc._id },
      {
        $set: { url: doc._id, _id: hash }
      }
  );
}

exports.addItem = addItem;
exports.findById = findById;
exports.updateById = updateById;
exports.getAll = getAllFromCache;
exports.saveBulk = saveBulk;
exports.updateOne = updateOne;
