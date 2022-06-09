const db = require("../../../../01_config/db");
const { clientError, serverError } = require("../../02_utils/common");

// create users table if not exist
// @desc: create users table if not exist, this will be called on create user request API || @route: POST /api/users/post/create  || @access:public
exports.createUsersTable = async (req, res, next) => {
  try {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users_table (
        id INT NOT NULL AUTO_INCREMENT,
        uniqueID VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
        )`;
    db.query(createUsersTable, (err) => {
      if (err) {
        return clientError(res, err);
      }
      next();
    });
  } catch (error) {
    serverError(res, error);
  }
};
