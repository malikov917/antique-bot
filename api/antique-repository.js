const mongoose = require('mongoose');
const antiquesSchema = require('./antique-schema');
const ANTIQUES_NAME = ANTIQUES_COLLECTION = 'antiques';
const Antique = mongoose.model(ANTIQUES_NAME, antiquesSchema, ANTIQUES_COLLECTION);

// (!) main file to handle ANTIQUES collection in database

// example how to use:
// const res = await antiqueRepository.addItem(item);
// const res1 = await antiqueRepository.findById('123');

async function addItem(item) {
  return new Antique({
    _id: item._id,
    title: item.title,
    description: item.description,
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

async function getAll() {
  return Antique.find();
}

async function saveBulk(array) {
  return Antique.insertMany(array);
}

exports.addItem = addItem;
exports.findById = findById;
exports.updateById = updateById;
exports.getAll = getAll;
exports.saveBulk = saveBulk;
