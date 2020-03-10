const Moment = require('moment')  

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function moment(createdAt) {
  return Moment(createdAt).fromNow()
}

module.exports = {
  ensureAuthenticated,
  getUser,
  moment
};
