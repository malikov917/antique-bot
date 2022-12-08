async function addItem(item) {
  return Promise.resolve({});
}

async function findById(connector, _id) {
  return Promise.resolve({});
}

async function updateById(_id, model) {
  return Promise.resolve({});
}

async function removeById(_id) {
  return Promise.resolve({});
}

async function getSavedIds() {
  const array = ['https://www.2dehands.be/v/antiek-en-kunst/antiek-meubels-stoelen-en-sofa-s/a110845522-peter-opsvik-stokke-stoel-tripp-trapp'];
  return Promise.resolve(array);
}

async function getAll() {
  return Promise.resolve([]);
}

async function saveBulk(array) {
  return Promise.resolve();
}

exports.addItem = addItem;
exports.findById = findById;
exports.updateById = updateById;
exports.getSavedIds = getSavedIds;
exports.getAll = getAll;
exports.saveBulk = saveBulk;
