const { URL } = require('url');

function getParsedLink(rawLink) {
    if (!rawLink) return rawLink;
    let link = new URL(rawLink);
    return link.origin + link.pathname;
}

function mapBeforeSaving(rawItem) {
    return {
      _id: rawItem.href,
      title: rawItem.title,
      description: '',
      price: rawItem.price,
      status: 'POSTED'
    }
  }

exports.getParsedLink = getParsedLink;
exports.mapBeforeSaving = mapBeforeSaving;
