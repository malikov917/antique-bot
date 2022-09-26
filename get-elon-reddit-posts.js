const axios = require('axios');

const getElonRedditPosts = async () => {
  try {
    const links = await axios.get('https://www.reddit.com/r/elonmusk/top.json?limit=10');
    return links.data.data.children.map(x => {
      const data = x.data;
      return {
        id: data.id,
        title: data.title,
        media: data.url !== 'https://www.reddit.com/' ? data.url : '',
        created: data.created
      }
    })

  } catch (error) {
    console.log(error)
  }
};

exports.getElonRedditPosts = getElonRedditPosts;