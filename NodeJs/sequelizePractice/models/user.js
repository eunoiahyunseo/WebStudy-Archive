module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: DataTypes.TEXT,
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
      tableName: "users",
      timestamps: true,
      paranoid: true,
    }
  );
  User.associate = (db) => {
    User.hasMany(db.Profile, {
      foreignKey: {
        name: "uid",
        allowNull: true,
      },
      onDelete: "cascade",
      as: "LoveProfile",
    });
  };
  return User;
};
