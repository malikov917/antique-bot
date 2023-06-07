const { URL } = require('url');
const crypto = require('crypto');

function getParsedLink(rawLink) {
    if (!rawLink) return rawLink;
    let link = new URL(rawLink);
    return link.origin + link.pathname;
}

function mapAntiqueBeforeSaving(rawItem) {
    return {
      _id: createUniqueIdFromLink(rawItem.url),
      title: rawItem.title,
      description: '',
      url: rawItem.url,
      price: rawItem.price,
      status: 'POSTED',
    }
}

function mapTldrNewsBeforeSaving(rawItem) {
    return {
      _id: createUniqueIdFromLink(rawItem.url),
      headline: rawItem.headline,
      description: rawItem.description,
      url: rawItem.url,
      image: rawItem.image,
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

function buildTldrLink(newsType) {
  const date = getDate();
  return `https://tldr.tech/${newsType}/${date}`;
}

function buildNewsHTMLMessage(item) {
  return `<b>${wrapWordsInATag(item.headline, item.href)}</b> \n\n${item.description}`;
}

function buildNewsPhotoMessage(item) {
  return `*${item.headline}* \n\n${item.description} \n\n[К статье](${item.url})`;
}

function wrapWordsInATag(sentence, link) {
  let words = sentence.split(' ');
  if (words.length <= 9) {
    return `<a href="${link}">${sentence}</a>`;
  }

  for (let i = 0; i < sentence.length; i++) {
    if (i === 5) {
      words[i] = `<a href="${link}">${words[i]}`;
    }
    if (i === 10) {
      words[i] = `${words[i]}</a>`;
    }
  }
  return words.join(' ');
}

exports.getParsedLink = getParsedLink;
exports.mapAntiqueBeforeSaving = mapAntiqueBeforeSaving;
exports.mapTldrNewsBeforeSaving = mapTldrNewsBeforeSaving;
exports.waitMilliseconds = waitMilliseconds;
exports.buildTldrLink = buildTldrLink;
exports.buildNewsHTMLMessage = buildNewsHTMLMessage;
exports.buildNewsPhotoMessage = buildNewsPhotoMessage;
exports.createUniqueIdFromLink = createUniqueIdFromLink;
