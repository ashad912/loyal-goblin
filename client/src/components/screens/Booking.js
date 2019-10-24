import React from 'react'
import uuid from 'uuid/v1'
import moment from 'moment'

const createTempEquippedItems = () => {
    return{
        amulet: {
            __id: uuid(),
            owner: 11111,
            itemModel: {
                __id: uuid(),
                type: {
                __id: 1,
                type: "amulet"
                },
                name: "Diament",
                fluff: "Najlepszy przyjaciel dziewyczyny",
                imgSrc: "diamond-amulet.png"
            }
        },
        weaponRight: {
            
                __id: uuid(),
                owner: 11111,
                itemModel: {
                __id: uuid(),
                type: {
                    __id: 2,
                    type: "weapon"
                },
                name: "Krótki miecz",
                fluff: "Przynajmniej nie masz kompleksów",
                imgSrc: "short-sword.png"
                }
            
        },
        weaponLeft: {
            
                __id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                __id: uuid(),
                type: {
                    __id: 2,
                    type: "weapon"
                },
                name: "Wielki miecz",
                fluff: "Zdecydowanie masz kompleksy",
                imgSrc: "short-sword.png",
                class: "warrior",
                perks: [
                    {
                    __id: 1,
                    perkType: "attr-strength",
                    target: undefined,
                    time: [
                        {
                            __id: 1,
                            hoursFlag: false,
                            lengthInHours: 24,
                            startDay: 3,
                            startHour: 19
                        },
                        {
                            __id: 1,
                            hoursFlag: true,
                            lengthInHours: 1,
                            startDay: 3,
                            startHour: 18
                        },
                    ],
                    value: "+1"
                    }
                ]
                
            }
        },
        chest: {
            __id: uuid(),
            owner: 11111,
            itemModel: {
            __id: uuid(),
            type: {
                __id: 3,
                type: "chest"
            },
            name: "Skórzana kurta",
            fluff: "Lale za takimi szaleją",
            imgSrc: "leather-jerkin.png"
            }
        },
        legs: {
            
                __id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                __id: uuid(),
                type: {
                    __id: 4,
                    type: "legs"
                },
                name: "Lniane spodnie",
                fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
                imgSrc: "linen-trousers.png"
                }
            
        }
        ,
        hands: {},
        feet: {
            
                __id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                __id: uuid(),
                type: {
                    __id: 5,
                    type: "feet"
                },
                name: "Wysokie buty",
                fluff: "Skórzane, wypastowane, lśniące",
                imgSrc: "high-boots.png"
                }
            
        },
        head: {
            __id: uuid(),
            owner: 11111,
            equipped: true,
            itemModel: {
            __id: uuid(),
            type: {
                __id: 6,
                type: "head"
            },
            name: "Kaptur czarodzieja",
            fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
            imgSrc: "wizard-coul.png",
            perks: [
                {
                perkType: "experience",
                target: undefined,
                time: [
                    {
                    __id: 1,
                    hoursFlag: false,
                    lengthInHours: 24,
                    startDay: 5,
                    startHour: 12
                    }
                ],
                value: "+10%"
                },
                {
                perkType: "experience",
                target: undefined,
                time: [
                    {
                    __id: 2,
                    hoursFlag: false,
                    lengthInHours: 24,
                    startDay: 6,
                    startHour: 12
                    }
                ],
                value: "+20%"
                }
            ]
            }
        },
        ringRight: {
            __id: uuid(),
            owner: 11111,
            equipped: true,
            itemModel: {
                __id: uuid(),
                type: {
                    __id: 7,
                    type: "ring"
                },
                name: "Pierścień siły",
                fluff: "Całuj mój sygnet potęgi",
                imgSrc: "strength-ring.png",
                perks: [
                {
                    __id: 1,
                    perkType: "disc-product",
                    target: { name: "Wóda2" },
                    time: [
                    {
                        hoursFlag: true,
                        lengthInHours: 2,
                        startDay: 1,
                        startHour: 18
                    },
                    { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
                    ],
                    value: "-15%"
                }
                ]
            }
        },
        ringLeft: {},
    }
};
  
const userProfile = () => {
    return {
        strength: 5,
        dexternity: 4,
        magic: 3,
        endurance: 6
    }
}

const products = () => {
    return [
        {
            _id: uuid(),
            category: "shot",
            name: "BBanie",
            description: "szotów",
            price: 7.0,
            imgSrc: "drink.png"
          },
          {
            _id: uuid(),
            category: "drink",
            name: "Modżajto",
            description: "dla mojej świni",
            price: 13.5,
            imgSrc: "drink.png"
          },
          {
            _id: uuid(),
            name: "Cosmo",
            category: "drink",
            description: "lubisz, ale się nie przyznasz przed kolegami",
            price: 27.99,
            imgSrc: "drink.png",
            prizes: [
              {
                itemModel: {
                  _id: uuid(),
                  type: {
                    _id: 1,
                    type: "amulet"
                  },
                  name: "Diament",
                  fluff: "Najlepszy przyjaciel dziewyczyny",
                  imgSrc: "diamond-amulet.png"
                }
              }
            ]
          },
          {
            _id: uuid(),
            category: "food",
            name: "BOrzeszki",
            description: "ziemne",
            price: 6.0,
            imgSrc: "drink.png"
          },
          {
            _id: uuid(),
            category: "food",
            name: "BNaczosy hehe",
            description: "xddxdx",
            price: 25.0,
            imgSrc: "drink.png"
          },
          {
            _id: uuid(),
            category: "beer",
            name: "Kasztelan",
            description: "Pan na zamku",
            price: 12.0,
            imgSrc: "drink.png",
            prizes: [      {
              itemModel: {
                _id: 600,
                type: {
                  _id: 6,
                  type: "torpedo"
                },
                name: "D1",
                fluff: "Ostrzelaj pole D1!",
                imgSrc: "torpedo.png"
              }
            }]
          },
    ]
}


const Booking = () => {

    const equippedItems = createTempEquippedItems()

    

    const handleCount = () => {

        const modelPerks = {
            attrStrength: 0,
            attrDexternity: 0,
            attrMagic: 0,
            attrEndurance: 0,
            finalDiscount: []
        }

        const isTime = (timeArray) => {
            if(!timeArray.length) {
                return true
            }
            var nowDay = moment().day()
            
            for(let i=0; i< timeArray.length; i++) {

                const time = timeArray[i];
                let startTime = moment(`${time.startHour}:00`, 'HH:mm')
                let endTime = moment(startTime).clone().add(time.lengthInHours, 'hours')
                //console.log(startTime.hour(), endTime.hour())
                //console.log(startTime, endTime)
                if(time.startDay === nowDay){
                    if(startTime.isBefore(endTime)){
                        //console.log('before midnight')
                        let isTime = moment().isBetween(startTime, endTime, null, "[]");
                        console.log(isTime)
                        if(isTime){
                            return true
                        }
                    }
                }else if(time.startDay + 1 === nowDay ){
                    if(startTime.hour >= endTime.hour){
                        //console.log('after midnight')
                        let startTimeMinusDay = startTime.clone().subtract(1, 'd')
                        let endTimeMinusDay = endTime.clone().subtract(1, 'd')
                        console.log(startTimeMinusDay, endTimeMinusDay)
                        let isTime = moment().isBetween(startTimeMinusDay, endTimeMinusDay, null, "[]");
                        console.log(isTime)
                        if(isTime){
                            return true
                        }
                    }
                }
            }
            
            return false

        }

        const truncCurrency = (value) => {
            return (Math.trunc(100 * value)/100)
        }

        const countValue = (base, perk, source, isCurrency) => {
            let temp = '-5.5324345435'
            let tempBase = 10
            
            if(temp.includes('%')){
                const tempDiscount = (parseFloat(temp)/100)
                if(isCurrency){
                    const discount = truncCurrency(tempDiscount*tempBase)
                    tempBase = tempBase + discount
                }else{
                    const mod = Math.trunc(tempDiscount*tempBase)
                    tempBase = tempBase + mod
                }
                
                console.log(tempBase)
            }else{
                temp = parseFloat(temp)
                if(isCurrency){
                    tempBase = truncCurrency(temp + tempBase)
                }else{
                    tempBase = Math.trunc(temp + tempBase)
                }
                console.log(tempBase)
            }
        }
        
        Object.keys(equippedItems).forEach((itemKey) => {
            if(equippedItems[itemKey].hasOwnProperty('itemModel') && equippedItems[itemKey].itemModel.hasOwnProperty('perks') && equippedItems[itemKey].itemModel.perks && equippedItems[itemKey].itemModel.perks.length){
                const perks = equippedItems[itemKey].itemModel.perks
                console.log(perks)
                perks.forEach((perk) => {
                    console.log(perk.perkType)
                    switch(perk.perkType){
                        case 'attr-strength':
                            const isPerkActive = isTime(perk.time)
                            if(isPerkActive){
                                countValue(userProfile.strength, perk.value, modelPerks.attrStrength, true)
                            }
                            
                            break
                        case 'attr-dexternity':

                            break
                        case 'attr-magic':

                            break
                        case 'attr-endurance':

                            break
                        case 'experience':
                            break
                        case 'disc-product':

                            break
                        case 'disc-category':

                            break
                        default:
                            break 
                    }
                })
            }
        })
    }

    return(
        <div onClick={handleCount}>Booking</div>
    )
}

export default Booking