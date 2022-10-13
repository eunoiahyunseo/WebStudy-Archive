module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    "profile",
    {
      title: DataTypes.TEXT,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      tableName: "profiles",
      timestamps: true,
      paranoid: true,
    }
  );

  Profile.associate = (db) => {
    Profile.belongsTo(db.User, {
      foreignKey: {
        name: "uid",
        allowNull: true,
      },
      onDelete: "cascade",
    });

    Profile.belongsToMany(db.HashTag, {
      foreignKey: "profileId",
      through: "profileHashTag",
      as: "HashTag",
    });
  };
  return Profile;
};
