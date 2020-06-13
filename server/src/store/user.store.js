import moment from "moment";
import { isEqual } from "lodash";
import { User } from '@models/user'
import { Party } from '@models/party'
import { Product } from "@models/product";
import { asyncForEach } from '@utils/functions'



const computePerks = (user) => {
  return new Promise(async (resolve, reject) => {

    try {
      await asyncForEach(Object.keys(user.equipped), async slot => {
        await user
          .populate({
            path: "equipped." + slot,
            populate: { path: "itemModel" }
          })
          .execPopulate();
      });

      const equippedItems = user.equipped.toObject(); //to behave like normal JS object: delete, hasOwnProperty

      //console.log(equippedItems)

      const products = await Product.find({});

      const modelPerks = {
        attrStrength: 0,
        attrDexterity: 0,
        attrMagic: 0,
        attrEndurance: 0,
        rawExperience: {
          absolute: "0",
          percent: "0%"
        },
        products: {}
      };

      const isTime = timeArray => {
        if (!timeArray.length) {
          return true;
        }
        var nowDay = moment().day();

        for (let i = 0; i < timeArray.length; i++) {
          const time = timeArray[i];

          moment.locale("pl");
          let startTimeLocale = moment(`${time.startHour}:00`, "HH:mm");
          let endTimeLocale = moment(startTimeLocale)
            .clone()
            .add(time.lengthInHours, "hours");
          // console.log(
          //   "Local hours:",
          //   startTimeLocale.hour(),
          //   endTimeLocale.hour()
          // );

          let startTime = moment.utc(startTimeLocale);
          let endTime = moment.utc(endTimeLocale);
          //console.log("UTC hours:", startTime.hour(), endTime.hour());
          //console.log(startTime, endTime)
          //console.log(time.startDay, nowDay)
          if (time.startDay === nowDay) {
            if (startTime.isBefore(endTime)) {
              //console.log('before midnight')
              let isTime = moment
                .utc()
                .isBetween(startTime, endTime, null, "[]");
              //console.log(isTime)
              if (isTime) {
                return true;
              }
            }
          } else if (time.startDay + 1 === nowDay) {
            if (startTime.hour >= endTime.hour) {
              //console.log('after midnight')
              let startTimeMinusDay = startTime.clone().subtract(1, "d");
              let endTimeMinusDay = endTime.clone().subtract(1, "d");
              //console.log(startTimeMinusDay, endTimeMinusDay)
              let isTime = moment
                .utc()
                .isBetween(startTimeMinusDay, endTimeMinusDay, null, "[]");
              //console.log(isTime)
              if (isTime) {
                return true;
              }
            }
          }
        }

        return false;
      };

      const truncCurrency = value => {
        return Math.trunc(100 * value) / 100;
      };

      const countValue = (source, perkValue, isCurrency, onlyDiscount) => {
        let result = 0;

        if (perkValue.includes("%")) {
          const tempDiscount = parseFloat(perkValue) / 100;
          if (isCurrency) {
            const discount = truncCurrency(tempDiscount * source);
            result = discount;
          } else {
            const mod = Math.trunc(tempDiscount * source);
            result = mod;
          }

          //console.log(result)
        } else {
          perkValue = parseFloat(perkValue);
          if (isCurrency) {
            perkValue = truncCurrency(perkValue);
          } else {
            perkValue = Math.trunc(perkValue);
          }

          result = perkValue;
          //console.log(result)
        }

        return result;
      };

      const countRawExperience = (exp, perkValue) => {
        if (perkValue.includes("%")) {
          perkValue = truncCurrency(parseFloat(perkValue));
          exp.percent = `${parseFloat(exp.percent) + perkValue}%`;

          //console.log(exp.percent)
        } else {
          perkValue = truncCurrency(parseFloat(perkValue));
          exp.absolute = `${parseFloat(exp.absolute) + perkValue}`;
        }

        return exp;
      };

      Object.keys(equippedItems).forEach((itemKey, index) => {
        if (
          equippedItems[itemKey] &&
          equippedItems[itemKey].hasOwnProperty("itemModel") &&
          equippedItems[itemKey].itemModel.hasOwnProperty("perks") &&
          equippedItems[itemKey].itemModel.perks &&
          equippedItems[itemKey].itemModel.perks.length > 0
        ) {
          const perks = equippedItems[itemKey].itemModel.perks;
          //console.log(perks)
          perks.forEach(perk => {
            // console.log(perk.perkType)
            if (isTime(perk.time)) {
              switch (perk.perkType) {
                case "attr-strength":
                  modelPerks.attrStrength =
                    modelPerks.attrStrength +
                    countValue(user.strength, perk.value, false);
                  break;
                case "attr-dexterity":
                  modelPerks.attrDexterity =
                    modelPerks.attrDexterity +
                    countValue(user.dexterity, perk.value, false);
                  break;
                case "attr-magic":
                  modelPerks.attrMagic =
                    modelPerks.attrMagic +
                    countValue(user.magic, perk.value, false);
                  break;
                case "attr-endurance":
                  modelPerks.attrEndurance =
                    modelPerks.attrEndurance +
                    countValue(user.endurance, perk.value, false);
                  break;
                case "experience":
                  modelPerks.rawExperience = countRawExperience(
                    modelPerks.rawExperience,
                    perk.value
                  );

                  break;
                case "disc-product":
                  const product = products.find(product => {
                    return product._id.toString() === perk.target['disc-product']._id.toString();
                  });

                  if (product) {
                    const priceMod = (-1) * countValue( //to get discount
                      product.price,
                      perk.value,
                      true
                    );
                    if (equippedItems[itemKey].itemModel.type === "scroll") {
                      if (!modelPerks.products.hasOwnProperty(product._id)) {
                        modelPerks.products[product._id] = { priceMod: { first: priceMod, standard: 0 } };
                      } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                        modelPerks.products[product._id].priceMod.first = priceMod;
                      } else {
                        modelPerks.products[product._id].priceMod.first += priceMod;
                      }
                    } else {
                      if (!modelPerks.products.hasOwnProperty(product._id)) {
                        modelPerks.products[product._id] = { priceMod: { first: 0, standard: priceMod } };
                      } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                        modelPerks.products[product._id].priceMod.standard = priceMod;
                      } else {
                        modelPerks.products[product._id].priceMod.standard += priceMod;
                      }
                    }

                  }

                  break;
                case "disc-category":

                  const productsInCategory = products.filter(product => {
                    return product.category === perk.target['disc-category'];
                  });

                  for (let i = 0; i < productsInCategory.length; i++) {
                    const product = productsInCategory[i];
                    const priceMod = (-1) * countValue( //to get disocunt
                      product.price,
                      perk.value,
                      true
                    );
                    if (equippedItems[itemKey].itemModel.type === "scroll") {
                      if (!modelPerks.products.hasOwnProperty(product._id)) {
                        modelPerks.products[product._id] = { priceMod: { first: priceMod, standard: 0 } };
                      } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                        modelPerks.products[product._id].priceMod.first = priceMod;
                      } else {
                        modelPerks.products[product._id].priceMod.first += priceMod;
                      }
                    } else {
                      if (!modelPerks.products.hasOwnProperty(product._id)) {
                        modelPerks.products[product._id] = { priceMod: { first: 0, standard: priceMod } };
                      } else if (!modelPerks.products[product._id].hasOwnProperty("priceMod")) {
                        modelPerks.products[product._id].priceMod.standard = priceMod;
                      } else {
                        modelPerks.products[product._id].priceMod.standard += priceMod;
                      }
                    }
                  }

                  break;
                default:
                  break;
              }
            }
          });
        }
      });

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const experienceModFromAbsolute = countValue(product.price * 10, modelPerks.rawExperience.absolute, false);
        const experienceModFromPercent = countValue(product.price * 10, modelPerks.rawExperience.percent, false);
        const experienceMod = experienceModFromAbsolute + experienceModFromPercent;
        if (!modelPerks.products.hasOwnProperty(product._id)) {
          modelPerks.products[product._id] = { experienceMod: experienceMod };
        } else if (!modelPerks.products[product._id].hasOwnProperty("experienceMod")) {
          modelPerks.products[product._id]["experienceMod"] = experienceMod;
        } else {
          modelPerks.products[product._id]["experienceMod"] += experienceMod;
        }
      }
      await asyncForEach(Object.keys(user.equipped), async slot => {
        await user.depopulate(`equipped.${slot}`)
      });

      resolve(modelPerks);
    } catch (e) {
      reject(e);
    }
  });
}

const calculateOrder = async user => {

  const verifyParty = (leader, membersIds, order) => {
    return new Promise(async (resolve, reject) => {
      try {
        const members = await User.find({
          $and: [
            { _id: { $in: membersIds } },
            { activeOrder: { $size: 0 } } //checking active order - party
          ]
        });

        if (members.length !== membersIds.length) {
          throw new Error(
            "Not every member found OR member has another active order!"
          );
        }

        //checking if order profiles match party

        const party = [
          leader.toString(),
          ...membersIds.map(member => member.toString())
        ];
        let orderParty = [];
        await asyncForEach(order, async user => {
          const memberId = user.profile._id; //works when order is MongoObject -> when depopulated can be: user.profile or user.profile._id, when populated only - user.profile._id
          //for JSObject -> user.profile would be a String - only clear user.profile is accepted here
          //CONCLUSION: this method works only with order as MongoObject
          orderParty = [...orderParty, memberId.toString()];
        });
        if (!isEqual(orderParty, party)) {
          throw Error("Invalid party!");
        }

        resolve(members);
      } catch (e) {
        reject(e);
      }
    });
  };

  try {
    const party = await Party.findById(user.party);

    let partyId = null;
    let leader = null;
    let membersIds = [];

    if (party) {
      partyId = party._id;
      membersIds = [...party.members];
      leader = party.leader;
    } else {
      leader = user._id;
    }

    if (!user) {
      throw Error("User not found!");
    }
    if (partyId && !user.party) {
      throw Error("Użytkownik nie należy do żadnej drużyny!");
    }

    const members = await verifyParty(leader, membersIds, user.activeOrder);

    await user
      .populate({
        path: "activeOrder.products.product",
        populate: { path: "awards.itemModel", select: "name imgSrc" }
      })
      .execPopulate();

    const partyFullObject = [user, ...members];

    await asyncForEach(partyFullObject, async partyMember => {
      //HERE IMPLEMENT PRICE AND EXPERIENCE MODS - input: activeOrder, userPerks; output: object for view
      const firstDiscountIds = []
      const currentMember = user.activeOrder.findIndex(
        basket => basket.profile._id.toString() === partyMember._id.toString()
      );

      //let modelPerks = await designateUserPerks(partyMember);
      let modelPerks = await partyMember.updatePerks(true, true)

      const userProducts = user.activeOrder[currentMember].products.map(product => product.toJSON())

      userProducts.forEach(p => {
        const product = p.product

        const productId = product._id.toString();

        if (modelPerks.products[productId] && modelPerks.products[productId].hasOwnProperty("experienceMod")) {
          product.experience =
            product.price * 10 + modelPerks.products[productId].experienceMod;
        } else {
          product.experience = product.price * 10;
        }
        if (modelPerks.products[productId] && modelPerks.products[productId].hasOwnProperty("priceMod")) {
          //Apply first discount

          if (modelPerks.products[productId].priceMod.first < 0 && firstDiscountIds.indexOf(productId) === -1) {
            product.price += modelPerks.products[productId].priceMod.first;
            firstDiscountIds.push(productId)
          }
          //Apply standard discount
          if (modelPerks.products[productId].priceMod.standard < 0) {
            product.price += modelPerks.products[productId].priceMod.standard;

          }
          //Zero out price if it's negative
          if (product.price < 0) {
            product.price = 0.0;
          }
        }
      });
      //currentMember.products.forEach(product => console.log(product.product.price, product.product.experience))
      if (userProducts.length > 0) {
        let totalPrice = 0;
        let totalExperience = 0;
        let totalAwards = [];
        userProducts.forEach(product => {

          totalPrice += product.product.price * product.quantity;

          totalExperience += product.product.experience * product.quantity;
          product.product.awards.forEach(award => {
            award.quantity = award.quantity * product.quantity
          })

          totalAwards = totalAwards.concat(product.product.awards);

        });
        // console.log(totalPrice, totalExperience, totalAwards);

        user.activeOrder[currentMember].price = totalPrice;
        user.activeOrder[currentMember].experience = totalExperience;
        user.activeOrder[currentMember].awards = totalAwards;
        user.activeOrder[currentMember].products = [...userProducts]
      }
      //calculatedOrders[partyMember._id.toString()] = {_id: partyMember._id.toString(), totalPrice: currentMember.totalPrice, totalExperience: currentMember.totalExperience, totalAwards: currentMember.totalAwards }
      // user.activeOrder.find(basket => )
      return user
    });
  } catch (e) {
    throw Error(e, "Computing error");
  }
};

export default {
  computePerks,
  calculateOrder
}