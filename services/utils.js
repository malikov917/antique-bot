const { URL } = require('url');
const crypto = require('crypto');

function getParsedLink(rawLink) {
    if (!rawLink) return rawLink;
    let link = new URL(rawLink);
    return link.origin + link.pathname;
}

function mapAntiqueBeforeSaving(rawItem) {
    return {
      _id: rawItem.href,
      title: rawItem.title,
      description: '',
      price: rawItem.price,
      status: 'POSTED'
    }
}

function mapTldrNewsBeforeSaving(rawItem) {
    return {
      _id: createUniqueIdFromLink(rawItem.url),
      headline: rawItem.headline,
      description: rawItem.description,
      url: rawItem.url,
      status: 'NEW'
    }
}

function createUniqueIdFromLink(link) {
  const hash = crypto.createHash('sha256');
  hash.update(link);
  return hash.digest('hex');
}

async function waitMilliseconds(milliseconds) {
    return await new Promise((resolve) =>
        setTimeout(() => resolve(), milliseconds))
}

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return `${year}-${month}-${day}`;
}

function buildTldrLink() {
  const date = getDate();
  return `https://tldr.tech/tech/${date}`;
}

exports.getParsedLink = getParsedLink;
exports.mapAntiqueBeforeSaving = mapAntiqueBeforeSaving;
exports.mapTldrNewsBeforeSaving = mapTldrNewsBeforeSaving;
exports.waitMilliseconds = waitMilliseconds;
exports.buildTldrLink = buildTldrLink;
