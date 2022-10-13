const { User, Profile, HashTag, sequelize } = require("./models");
const user = require("./models/user");

/**
 * hasMany belongsTo 1 : N simulation
 */

const dropDataBasesInit = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await sequelize.sync({ force: true });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
};

(async () => {
  try {
    await dropDataBasesInit();
    const user1 = await User.create({
      name: "user1",
    });

    const newProfile1 = await Profile.create({ title: "newProfile1" });
    const newProfile2 = await Profile.create({ title: "newProfile2" });
    /**
     * async add(soruceInstance: Model, targetInstances: Model | Model[] | string[] | string | number[] | number,
     * options: object) : Promise
     *
     */
    await user1.addLoveProfile([newProfile1, newProfile2]);

    // const user1ProfileList = await user1.getProfiles();
    // console.log(JSON.stringify(user1ProfileList, null, 2));

    const checkUser = await User.findOne({
      include: [
        {
          model: Profile,
          as: "LoveProfile",
        },
      ],
    });

    // console.log(JSON.stringify(checkUser.toJSON().LoveProfile, null, 2));

    console.log(checkUser.LoveProfile[0]);

    const newProfile_v1 = checkUser.LoveProfile[0];
    const testHashTag1 = await HashTag.create({ tag: "testHashTag1" });
    const testHashTag2 = await HashTag.create({ tag: "testHashTag2" });
    await newProfile_v1.addHashTag([testHashTag1, testHashTag2]);

    // const Profile_v1_HashTags = await newProfile_v1.getHashTag();
    // console.log(Profile_v1_HashTags[0].toJSON());
    // console.log(Profile_v1_HashTags[1].toJSON());

    const checkProfileValue = await Profile.findOne({
      where: {
        id: 1,
      },
      include: [
        {
          model: HashTag,
          as: "HashTag",
        },
      ],
    });

    console.log(JSON.stringify(checkProfileValue.toJSON().HashTag, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
