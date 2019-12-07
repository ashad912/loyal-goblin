import React from 'react'
import uuid from 'uuid/v1'
import moment from 'moment'

const commonUuid1 = uuid()
const commonUuid2 = uuid()

const createTempEquippedItems = () => {
    return{
        amulet: {
            _id: uuid(),
            owner: 11111,
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
        },
        weaponRight: {
            
                _id: uuid(),
                owner: 11111,
                itemModel: {
                _id: uuid(),
                type: {
                    _id: 2,
                    type: "weapon"
                },
                name: "Krótki miecz",
                fluff: "Przynajmniej nie masz kompleksów",
                imgSrc: "short-sword.png"
                }
            
        },
        weaponLeft: {
            
                _id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                _id: uuid(),
                type: {
                    _id: 2,
                    type: "weapon"
                },
                name: "Wielki miecz",
                fluff: "Zdecydowanie masz kompleksy",
                imgSrc: "short-sword.png",
                class: "warrior",
                perks: [
                    {
                    _id: 1,
                    perkType: "attr-strength",
                    target: undefined,
                    time: [
                        {
                            _id: 1,
                            hoursFlag: false,
                            lengthInHours: 5,
                            startDay: 4,
                            startHour: 19
                        },
                        {
                            _id: 1,
                            hoursFlag: true,
                            lengthInHours: 1,
                            startDay: 3,
                            startHour: 18
                        },
                    ],
                        value: "+3"
                    },
                    {
                        _id: 13213,
                        perkType: "attr-dexterity",
                        target: undefined,
                        time: [
                            {
                                _id: 1,
                                hoursFlag: false,
                                lengthInHours: 5,
                                startDay: 4,
                                startHour: 19
                            },
                            {
                                _id: 1,
                                hoursFlag: true,
                                lengthInHours: 1,
                                startDay: 3,
                                startHour: 18
                            },
                        ],
                            value: "-1"
                        }
                ]
                
            }
        },
        chest: {
            _id: uuid(),
            owner: 11111,
            itemModel: {
            _id: uuid(),
            type: {
                _id: 3,
                type: "chest"
            },
            name: "Skórzana kurta",
            fluff: "Lale za takimi szaleją",
            imgSrc: "leather-jerkin.png"
            }
        },
        legs: {
            
                _id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                _id: uuid(),
                type: {
                    _id: 4,
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
            
                _id: uuid(),
                owner: 11111,
                equipped: false,
                itemModel: {
                    _id: uuid(),
                    type: {
                        _id: 5,
                        type: "feet"
                    },
                name: "Wysokie buty",
                fluff: "Skórzane, wypastowane, lśniące",
                imgSrc: "high-boots.png",
                perks: [
                    {
                    _id: 1,
                    perkType: "disc-category",
                    target: 'food',
                    time: [
                    {
                        hoursFlag: true,
                        lengthInHours: 24,
                        startDay: 4,
                        startHour: 18
                    },
                    { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
                    ],
                    value: "-10%"
                    }
                ]
                },
                
            
        },
        head: {
            _id: uuid(),
            owner: 11111,
            equipped: true,
            itemModel: {
            _id: uuid(),
            type: {
                _id: 6,
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
                    _id: 1,
                    hoursFlag: false,
                    lengthInHours: 24,
                    startDay: 4,
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
                        _id: 1,
                        hoursFlag: false,
                        lengthInHours: 24,
                        startDay: 4,
                        startHour: 12
                        }
                    ],
                    value: "+10"
                    },
                {
                perkType: "experience",
                target: undefined,
                time: [
                    {
                    _id: 2,
                    hoursFlag: false,
                    lengthInHours: 24,
                    startDay: 4,
                    startHour: 12
                    }
                ],
                value: "+20%"
                }
            ]
            }
        },
        ringRight: {
            _id: uuid(),
            owner: 11111,
            equipped: true,
            itemModel: {
                _id: uuid(),
                type: {
                    _id: 7,
                    type: "ring"
                },
                name: "Pierścień siły",
                fluff: "Całuj mój sygnet potęgi",
                imgSrc: "strength-ring.png",
                perks: [
                {
                    _id: 1,
                    perkType: "disc-product",
                    target: commonUuid1,
                    time: [
                    {
                        hoursFlag: true,
                        lengthInHours: 12,
                        startDay: 4,
                        startHour: 20,
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
  
const userProfile = {
    
        strength: 5,
        dexterity: 4,
        magic: 3,
        endurance: 6
    
}

const products = [
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
            _id: commonUuid1,
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



const Booking = () => {

    const equippedItems = createTempEquippedItems()

    

    const handleCount = () => {

        const modelPerks = {
            attrStrength: 0,
            attrDexterity: 0,
            attrMagic: 0,
            attrEndurance: 0,
            rawExperience: {
                absolute: '0',
                percent: '0%'
            },
            products: [],
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
                console.log(startTime.hour(), endTime.hour())
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

        const countValue = (source, perkValue, isCurrency) => {
            
            let result = 0

            if(perkValue.includes('%')){
                const tempDiscount = (parseFloat(perkValue)/100)
                if(isCurrency){
                    const discount = truncCurrency(tempDiscount*source)
                    result = discount
                }else{
                    const mod = Math.trunc(tempDiscount*source)
                    result = mod
                }
                
                console.log(result)
            }else{
                perkValue = parseFloat(perkValue)
                if(isCurrency){
                    perkValue = truncCurrency(perkValue)
                }else{
                    perkValue = Math.trunc(perkValue)
                }

                result = perkValue
                console.log(result)
            }

            return result
        }

        const countRawExperience = (exp, perkValue) => {
            
            if(perkValue.includes('%')){
                perkValue = truncCurrency(parseFloat(perkValue))
                exp.percent = `${parseFloat(exp.percent) + perkValue}%`
                
                
                console.log(exp.percent)
            }else{
                perkValue = truncCurrency(parseFloat(perkValue))
                exp.absolute = `${parseFloat(exp.absolute) + perkValue}`
                
            }

            return exp
        }
        
        Object.keys(equippedItems).forEach((itemKey) => {
            if(equippedItems[itemKey].hasOwnProperty('itemModel') && equippedItems[itemKey].itemModel.hasOwnProperty('perks') && equippedItems[itemKey].itemModel.perks && equippedItems[itemKey].itemModel.perks.length){
                const perks = equippedItems[itemKey].itemModel.perks
                console.log(perks)
                perks.forEach((perk) => {
                    console.log(perk.perkType)
                    if(isTime(perk.time)){
                        switch(perk.perkType){
                            case 'attr-strength':
                                modelPerks.attrStrength = modelPerks.attrStrength + countValue(userProfile.strength, perk.value, false)
                                break
                            case 'attr-dexterity':
                                modelPerks.attrDexterity = modelPerks.attrDexterity + countValue(userProfile.dexterity, perk.value, false)
                                break
                            case 'attr-magic':
                                modelPerks.attrMagic = modelPerks.attrMagic + countValue(userProfile.magic, perk.value, false)
                                break
                            case 'attr-endurance':
                                modelPerks.attrEndurance = modelPerks.attrEndurance + countValue(userProfile.endurance, perk.value, false)
                                break
                            case 'experience':

                                modelPerks.rawExperience = countRawExperience(modelPerks.rawExperience, perk.value)
                                console.log(modelPerks)
                                break
                            case 'disc-product':

                                const product = products.find((product) => {
                                    return product._id === perk.target
                                })

                                if(product){
                                    const priceMod = countValue(product.price, perk.value, true)
                                    if(!modelPerks.products.hasOwnProperty(product._id)){
                                        modelPerks.products[product._id] = {priceMod: priceMod}
                                    }else if(!modelPerks.products[product._id].hasOwnProperty('priceMod')){
                                        modelPerks.products[product._id]['priceMod'] = priceMod
                                    }else{
                                        modelPerks.products[product._id]['priceMod'] += priceMod
                                    }
                                }
    
                                break
                            case 'disc-category':
                                console.log('haleczko')
                                const productsInCategory = products.filter((product) => {
                                    return product.category === perk.target
                                })

                                for(let i=0; i<productsInCategory.length; i++){
                                    
                                    const product = productsInCategory[i]
                                    const priceMod = countValue(product.price, perk.value, true)
                                    if(!modelPerks.products.hasOwnProperty(product._id)){
                                        modelPerks.products[product._id] = {priceMod: priceMod}
                                    }else if(!modelPerks.products[product._id].hasOwnProperty('priceMod')){
                                        modelPerks.products[product._id]['priceMod'] = priceMod
                                    }else{
                                        modelPerks.products[product._id]['priceMod'] += priceMod
                                    }
                                    

                                }

                                break
                            default:
                                break 
                        }
                    }
                    
                })
            }
        })

        for(let i=0; i<products.length; i++){
                                    
            const product = products[i]
            const experienceModFromAbsolute = countValue(product.price * 10, modelPerks.rawExperience.absolute, false)
            const experienceModFromPercent = countValue(product.price * 10, modelPerks.rawExperience.percent, false)
            const experienceMod = experienceModFromAbsolute + experienceModFromPercent
            if(!modelPerks.products.hasOwnProperty(product._id)){
                modelPerks.products[product._id] = {experienceMod: experienceMod}
            }else if(!modelPerks.products[product._id].hasOwnProperty('experienceMod')){
                modelPerks.products[product._id]['experienceMod'] = experienceMod
            }else{
                modelPerks.products[product._id]['experienceMod'] += experienceMod
            }
            

        }

        console.log(modelPerks)
    }

    return(
        <div onClick={handleCount}>Rezerwacje w budowie!</div>
    )
}

export default Booking