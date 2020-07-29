import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Grid } from '@material-ui/core'

import maleBody from "assets/profile/male-body.svg";
import femaleBody from "assets/profile/female-body.png"

import { appearancePath, altAppearancePath } from "utils/constants";

const AvatarImage = styled.img`
    width: 100%;
    grid-column: 1;
    grid-row: 1;
`

const AvatarCard = (props) => {

  const [equippedItems, setEquippedItems] = React.useState(null);

  React.useEffect(() => {
    updateEquippedItems();
  }, []);

  React.useEffect(() => {
    updateEquippedItems(props.profile, (perks) => {
      props.updatePerks(perks)
    });

  }, [props.profile.equipped]);

  const updateEquippedItems = (param, callback) => {
    const equipment = {
      head: null,
      chest: null,
      hands: null,
      legs: null,
      feet: null,
      weaponRight: null,
      weaponLeft: null,
      ringRight: null,
      ringLeft: null,
      scroll: null,
    };
    const perks = [];

    const profile = param ? param : props.profile;

    Object.keys(profile.equipped).forEach((category) => {
      let loadedEquippedItem;
      if (category.startsWith("weapon")) {
        loadedEquippedItem =
          props.bag.weapon &&
          props.bag.weapon.find((item) => item._id === profile.equipped[category]);
      } else if (category.startsWith("ring")) {
        loadedEquippedItem =
          props.bag.ring &&
          props.bag.ring.find((item) => item._id === profile.equipped[category]);
      } else {
        loadedEquippedItem =
          props.bag[category] &&
          props.bag[category].find((item) => item._id === profile.equipped[category]);
      }
      if (loadedEquippedItem) {
        if (loadedEquippedItem.itemModel.type === "weapon") {
          if (
            category === "weaponLeft" ||
            loadedEquippedItem.itemModel.twoHanded
          ) {
            equipment[category] = loadedEquippedItem.itemModel.appearanceSrc;
          } else if (category === "weaponRight") {
            equipment[category] = loadedEquippedItem.itemModel.altAppearanceSrc;
          }
        } else {
          if (profile.sex === "male") {
            equipment[category] = loadedEquippedItem.itemModel.appearanceSrc;
          } else {
            equipment[category] = loadedEquippedItem.itemModel.altAppearanceSrc;
          }
        }

        if (
          loadedEquippedItem.itemModel.hasOwnProperty("perks") &&
          loadedEquippedItem.itemModel.perks.length > 0
        ) {
          loadedEquippedItem.itemModel.perks.forEach((perk) => {
            perks.push(perk);
          });
        }
      }
    });

    setEquippedItems({ ...equipment });
    //setActivePerks([...perks]);
    if (callback) {
      callback([...perks])
    }

  };
  const isMale = props.profile.sex === "male"
  const rootPath = isMale ? appearancePath : altAppearancePath;
  const body = isMale ? maleBody : femaleBody

  const weaponRight =
    props.profile?.equipped?.weaponRight &&
    props.bag.weapon &&
    props.bag.weapon.find((item) => props.profile?.equipped?.weaponRight === item._id);

  const isWeaponTwoHanded = weaponRight && weaponRight.itemModel.twoHanded

  return (
    <Grid item xs={8} style={{ padding: 0 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "stretch",
          marginBottom: "1rem",
          display: "grid",
          grid: "100% 100% ",
        }}
      >
        {/* Main-hand weapon */}

        {equippedItems && (equippedItems.weaponRight && !isWeaponTwoHanded) && (
          <AvatarImage
            src={`${altAppearancePath}${equippedItems.weaponRight}`}
          />
        )}

        {equippedItems && (equippedItems.weaponRight && isWeaponTwoHanded) && (
          <AvatarImage
            src={`${appearancePath}${equippedItems.weaponRight}`}
          />
        )}

        {/* body */}
        <AvatarImage
          src={body}
        />

        {/* legs */}
        {equippedItems && equippedItems.legs && (
          <AvatarImage
            src={`${rootPath}${equippedItems.legs}`}
          />
        )}
        {/* feet */}
        {equippedItems && equippedItems.feet && (
          <AvatarImage
            src={`${rootPath}${equippedItems.feet}`}
          />
        )}
        {/* chest */}
        {equippedItems && equippedItems.chest && (
          <AvatarImage
            src={`${rootPath}${equippedItems.chest}`}
          />
        )}

        {/* head */}
        {equippedItems &&
          equippedItems.head &&
          equippedItems.head.includes(".") && (
            <AvatarImage
              src={`${rootPath}${equippedItems.head}`}
            />
          )}

        {/* Off-hand weapon */}
        {equippedItems && (equippedItems.weaponLeft) && (

          <AvatarImage
            src={`${appearancePath}${equippedItems.weaponLeft}`}
          />

        )}
        {/* hands */}
        {equippedItems && equippedItems.hands && (
          <AvatarImage
            src={`${rootPath}${equippedItems.hands}`}
          />
        )}
      </div>
    </Grid>
  )
}

AvatarCard.propTypes = {
  bag: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  updatePerks: PropTypes.func.isRequired,
}

export default AvatarCard