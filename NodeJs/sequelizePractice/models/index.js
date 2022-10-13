const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const userConfig = require("./user");
const profileConfig = require("./profile");
const hashTagConfig = require("./hashTag");
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = userConfig(sequelize, Sequelize.DataTypes);
const Profile = profileConfig(sequelize, Sequelize.DataTypes);
const HashTag = hashTagConfig(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.User = User;
db.Profile = Profile;
db.HashTag = HashTag;

User.associate(db);
Profile.associate(db);
HashTag.associate(db);

module.exports = db;
