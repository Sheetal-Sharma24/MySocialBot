require('dotenv').config();
const axios = require('axios');

const accessToken = process.env.FB_USER_ACCESS_TOKEN;

async function getFacebookUserInfo() {
  try {
    // ✅ 1. /me?fields=id,name
    const userRes = await axios.get(`https://graph.facebook.com/v23.0/me`, {
      params: {
        fields: 'id,name',
        access_token: accessToken
      }
    });
    console.log('👤 User Info:', userRes.data);

    // ✅ 2. /me/accounts
    const pagesRes = await axios.get(`https://graph.facebook.com/v23.0/me/accounts`, {
      params: {
        access_token: accessToken
      }
    });
    console.log('📄 Pages List:', pagesRes.data);

  } catch (error) {
    console.error(' Error:', error.response ? error.response.data : error.message);
  }
}

// Run the function
getFacebookUserInfo();
