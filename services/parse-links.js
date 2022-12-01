const { URL } = require('url');

function getParsedLink(rawLink) {
    if (!rawLink) return rawLink;
    let link = new URL(rawLink);
    return link.origin + link.pathname;
}

exports.getParsedLink = getParsedLink;
