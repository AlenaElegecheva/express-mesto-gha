const { ERROR_UNAUTHORIZED } = require('../utils/errors');

// AUTHORIZATION ERROR
class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
