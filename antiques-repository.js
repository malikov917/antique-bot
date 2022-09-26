const mongoose = require('mongoose');
const antiquesSchema = require('./antiquesSchema');
const ANTIQUES = 'antiques';
const Antique = mongoose.model(ANTIQUES, antiquesSchema, ANTIQUES);

async function addAntiqueItem(item) {
  return new Antique({
    _id: item._id,
    title: item.title,
    description: item.description,
    price: item.price,
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

async function getAntiqueIds() {
  const antiques = await Antique.find();
  return antiques.map(item => {
    console.log(item);
    return item._id
  });
}

exports.addAntiqueItem = addAntiqueItem;
exports.findById = findById;
exports.updateById = updateById;
exports.getAntiqueIds = getAntiqueIds;
