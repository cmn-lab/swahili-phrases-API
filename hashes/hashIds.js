const HashIds = require('hashids/cjs');
const HASH_ID_SALT = process.env.HASH_IDS_SALT;
const HASH_ID_PADDING = parseInt(process.env.HASH_IDS_PADDING);

const hashids = new HashIds(HASH_ID_SALT, HASH_ID_PADDING);

module.exports = hashids;