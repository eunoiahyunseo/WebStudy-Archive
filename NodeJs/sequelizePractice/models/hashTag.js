module.exports = (sequelize, DataTypes) => {
  const HashTag = sequelize.define(
    "hashTag",
    {
      tag: DataTypes.TEXT,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      tableName: "hashTags",
      timestamps: true,
      paranoid: true,
    }
  );

  HashTag.associate = (db) => {
    HashTag.belongsToMany(db.Profile, {
      foreignKey: "hashTagId",
      through: "profileHashTag",
      as: "OwnerPofile",
    });
  };
  return HashTag;
};
