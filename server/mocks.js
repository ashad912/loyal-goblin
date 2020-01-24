// import uuid from 'uuid/v1'
// import avatarTemp from '../assets/avatar/moose.png'

// // const createTempList = () => {
// //     return [
// //         {
// //             _id: 1,
// //             title: 'Mission1',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 4,
// //             level: 1,
// //             strength: 1,
// //             dexterity: 2,
// //             magic: 3,
// //             endurance: 4,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd Musiałem napisać więcej opisu, żeby przetestować jak to będzie wyglądać jak się rozwinie. Bo może być tak, że opis będzie taki długi i epicki, hehe.',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: false,
// //             awards: {
// //                 any: [
// //                     {
// //                         quantity: 2,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "feet",
// //                             class: 'any',
// //                             name: "Wysokie buty",
// //                             description: "Skórzane, wypastowane, lśniące",
// //                             imgSrc: "high-boots.png",
// //                             perks: [
// //                                 {
// //                                 _id: 1,
// //                                 perkType: "disc-category",
// //                                 target: 'food',
// //                                 time: [
// //                                     {
// //                                         hoursFlag: true,
// //                                         lengthInHours: 24,
// //                                         startDay: 4,
// //                                         startHour: 18
// //                                     },
// //                                     { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
// //                                 ],
// //                                 value: "-10%"
// //                                 }
// //                             ]
// //                         }
// //                     },
// //                     {
// //                         quantity: 1,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "legs",
// //                             name: "Lniane spodnie",
// //                             class: 'any',
// //                             description: "Zwykłe spodnie, czego jeszcze chcesz?",
// //                             imgSrc: "linen-trousers.png",
// //                             perks: []
// //                         }
// //                     }
// //                 ],
// //                 warrior: [
// //                     {
// //                         quantity: 1,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "weapon",
// //                             name: "Wielki miecz",
// //                             class: null,
// //                             description: "Zdecydowanie masz kompleksy",
// //                             imgSrc: "short-sword.png",
// //                             class: "warrior",
// //                             twoHanded: true,
// //                             perks: [
// //                                 {
// //                                     _id: 1,
// //                                     perkType: "attr-strength",
// //                                     target: undefined,
// //                                     time: [
// //                                         {
// //                                             _id: 1,
// //                                             hoursFlag: false,
// //                                             lengthInHours: 5,
// //                                             startDay: 4,
// //                                             startHour: 19
// //                                         },
// //                                         {
// //                                             _id: 1,
// //                                             hoursFlag: true,
// //                                             lengthInHours: 1,
// //                                             startDay: 3,
// //                                             startHour: 18
// //                                         },
// //                                     ],
// //                                         value: "+3"
// //                                 },
// //                                 {
// //                                     _id: 13213,
// //                                     perkType: "attr-dexterity",
// //                                     target: undefined,
// //                                     time: [
// //                                         {
// //                                             _id: 1,
// //                                             hoursFlag: false,
// //                                             lengthInHours: 5,
// //                                             startDay: 4,
// //                                             startHour: 19
// //                                         },
// //                                         {
// //                                             _id: 1,
// //                                             hoursFlag: true,
// //                                             lengthInHours: 1,
// //                                             startDay: 3,
// //                                             startHour: 18
// //                                         },
// //                                     ],
// //                                         value: "-1"
// //                                     }
// //                             ]
// //                         }
// //                     }
// //                 ],
// //                 rogue: [
// //                     {
// //                         quantity: 1,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "chest",
// //                             name: "Skórzana kurta",
// //                             class: null,
// //                             description: "Lale za takimi szaleją",
// //                             imgSrc: "leather-jerkin.png",
// //                             perks: []
// //                         }
// //                     }
// //                 ],
// //                 mage: [
// //                     {
// //                         quantity: 2,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "head",
// //                             name: "Kaptur czarodzieja",
// //                             class: 'mage',
// //                             description: "Kiedyś nosił go czarodziej. Już nie nosi.",
// //                             imgSrc: "wizard-coul.png",
// //                             perks: [
// //                                 {
// //                                 perkType: "experience",
// //                                 target: undefined,
// //                                 time: [
// //                                     {
// //                                     _id: 1,
// //                                     hoursFlag: false,
// //                                     lengthInHours: 24,
// //                                     startDay: 4,
// //                                     startHour: 12
// //                                     }
// //                                 ],
// //                                 value: "+10%"
// //                                 },
// //                                 {
// //                                     perkType: "experience",
// //                                     target: undefined,
// //                                     time: [
// //                                         {
// //                                         _id: 1,
// //                                         hoursFlag: false,
// //                                         lengthInHours: 24,
// //                                         startDay: 4,
// //                                         startHour: 12
// //                                         }
// //                                     ],
// //                                     value: "+10"
// //                                     },
// //                                 {
// //                                 perkType: "experience",
// //                                 target: undefined,
// //                                 time: [
// //                                     {
// //                                     _id: 2,
// //                                     hoursFlag: false,
// //                                     lengthInHours: 24,
// //                                     startDay: 4,
// //                                     startHour: 12
// //                                     }
// //                                 ],
// //                                 value: "+20%"
// //                                 }
// //                             ]
// //                         }
// //                     }
// //                 ],
// //                 cleric: [
// //                     {
// //                         quantity: 3,
// //                         itemModel: {
// //                             _id: uuid(),
// //                             type: "ring",
// //                             name: "Pierścień siły",
// //                             class: null,
// //                             description: "Całuj mój sygnet potęgi",
// //                             imgSrc: "strength-ring.png",
// //                             perks: [
// //                                 {
// //                                     _id: 1,
// //                                     perkType: "disc-product",
// //                                     target: { name: "Wóda2" },
// //                                     time: [
// //                                     {
// //                                         hoursFlag: true,
// //                                         lengthInHours: 12,
// //                                         startDay: 4,
// //                                         startHour: 20,
// //                                     },
// //                                     { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
// //                                     ],
// //                                     value: "-15%"
// //                                 }
// //                             ]
// //                         }
// //                     }
// //                 ],
                
// //             }
// //         },
// //         {
// //             _id: 2,
// //             title: 'Mission2',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 3,
// //             level: 3,
// //             strength: 5,
// //             dexterity: 3,
// //             magic: 2,
// //             endurance: 1,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 103,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'sapphire',
// //                         imgSrc: 'sapphire-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: false,
// //             awards: {
// //                 any: [],
// //                 warrior: [],
// //                 rogue: [],
// //                 mage: [],
// //                 cleric: [],
// //             }
// //         },
// //         {
// //             _id: 3,
// //             title: 'Mission3',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 4,
// //             level: 1,
// //             strength: 1,
// //             dexterity: 2,
// //             magic: 3,
// //             endurance: 4,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: true,
// //             awards: {
// //                 any: [],
// //                 warrior: [],
// //                 rogue: [],
// //                 mage: [],
// //                 cleric: [],
// //             }
// //         },
// //         {
// //             _id: 4,
// //             title: 'Mission4',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 3,
// //             level: 3,
// //             strength: 5,
// //             dexterity: 3,
// //             magic: 2,
// //             endurance: 1,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 103,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'sapphire',
// //                         imgSrc: 'sapphire-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: true,
// //             awards: {
// //                 any: [],
// //                 warrior: [],
// //                 rogue: [],
// //                 mage: [],
// //                 cleric: [],
// //             }
// //         },
// //         {
// //             _id: 5,
// //             title: 'Mission5',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 4,
// //             level: 1,
// //             strength: 1,
// //             dexterity: 2,
// //             magic: 3,
// //             endurance: 4,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: true,
// //             awards: {
// //                 any: [],
// //                 warrior: [],
// //                 rogue: [],
// //                 mage: [],
// //                 cleric: [],
// //             }
// //         },
// //         {
// //             _id: 6,
// //             title: 'Mission6',
// //             avatarSrc: {avatarTemp: missionIconTemp},
// //             minPlayers: 3,
// //             maxPlayers: 3,
// //             level: 3,
// //             strength: 5,
// //             dexterity: 3,
// //             magic: 2,
// //             endurance: 1,
// //             description: 'Super important mission. You need have things and attributes, as always loool xd',
// //             amulets: [
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 103,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'sapphire',
// //                         imgSrc: 'sapphire-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 1,
// //                     itemModel: {
// //                         _id: 101,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'diamond',
// //                         imgSrc: 'diamond-amulet.png'
// //                     }
// //                 },
// //                 {
// //                     quantity: 2,
// //                     itemModel: {
// //                         _id: 102,
// //                         type: {
// //                             _id: 201,
// //                             type: 'amulet'
// //                         },
// //                         name: 'pearl',
// //                         imgSrc: 'pearl-amulet.png'
// //                     }
// //                 },
// //             ],
// //             awardsAreSecret: true,
// //             awards: {
// //                 any: [],
// //                 warrior: [],
// //                 rogue: [],
// //                 mage: [],
// //                 cleric: [],
// //             }
// //         },

// //     ]
// // }

// // const createTempRally = () => {
// //     return {
// //         _id: 1,
// //         title: 'Pierwszy rajd Goblina!',
// //         avatarSrc: missionIconTemp,
// //         activationDate: moment().add(2, 'm'),
// //         expiryDate: moment().add(3, 'm'),
// //         awardsAreSecret: false,
// //         description: 'Super important rally. It is only one rally on board! You need to cooperate with ppl, u introvert scum xd Aby wziąć udział wystarczy, że wyexpisz coś, kiedy rajd będzie aktywny. Im więcej doświadczenia tym lepsze przedmioty możesz zdobyć!',
// //         awardsLevels: [
// //             {
// //                 level: 1000,
// //                 awards: {
// //                     any: [],
// //                     warrior: [
// //                         {
// //                             quantity: 1,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "weapon",
// //                                 name: "Wielki miecz",
// //                                 class: null,
// //                                 description: "Zdecydowanie masz kompleksy",
// //                                 imgSrc: "short-sword.png",
// //                                 class: "warrior",
// //                                 twoHanded: true,
// //                                 perks: [
// //                                     {
// //                                         _id: 1,
// //                                         perkType: "attr-strength",
// //                                         target: undefined,
// //                                         time: [
// //                                             {
// //                                                 _id: 1,
// //                                                 hoursFlag: false,
// //                                                 lengthInHours: 5,
// //                                                 startDay: 4,
// //                                                 startHour: 19
// //                                             },
// //                                             {
// //                                                 _id: 1,
// //                                                 hoursFlag: true,
// //                                                 lengthInHours: 1,
// //                                                 startDay: 3,
// //                                                 startHour: 18
// //                                             },
// //                                         ],
// //                                             value: "+3"
// //                                     },
// //                                     {
// //                                         _id: 13213,
// //                                         perkType: "attr-dexterity",
// //                                         target: undefined,
// //                                         time: [
// //                                             {
// //                                                 _id: 1,
// //                                                 hoursFlag: false,
// //                                                 lengthInHours: 5,
// //                                                 startDay: 4,
// //                                                 startHour: 19
// //                                             },
// //                                             {
// //                                                 _id: 1,
// //                                                 hoursFlag: true,
// //                                                 lengthInHours: 1,
// //                                                 startDay: 3,
// //                                                 startHour: 18
// //                                             },
// //                                         ],
// //                                             value: "-1"
// //                                         }
// //                                 ]
// //                             }
// //                         }
// //                     ],
// //                     rogue: [
// //                         {
// //                             quantity: 1,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "chest",
// //                                 name: "Skórzana kurta",
// //                                 class: null,
// //                                 description: "Lale za takimi szaleją",
// //                                 imgSrc: "leather-jerkin.png",
// //                                 perks: []
// //                             }
// //                         }
// //                     ],
// //                     mage: [
// //                         {
// //                             quantity: 2,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "head",
// //                                 name: "Kaptur czarodzieja",
// //                                 class: 'mage',
// //                                 description: "Kiedyś nosił go czarodziej. Już nie nosi.",
// //                                 imgSrc: "wizard-coul.png",
// //                                 perks: [
// //                                     {
// //                                     perkType: "experience",
// //                                     target: undefined,
// //                                     time: [
// //                                         {
// //                                         _id: 1,
// //                                         hoursFlag: false,
// //                                         lengthInHours: 24,
// //                                         startDay: 4,
// //                                         startHour: 12
// //                                         }
// //                                     ],
// //                                     value: "+10%"
// //                                     },
// //                                     {
// //                                         perkType: "experience",
// //                                         target: undefined,
// //                                         time: [
// //                                             {
// //                                             _id: 1,
// //                                             hoursFlag: false,
// //                                             lengthInHours: 24,
// //                                             startDay: 4,
// //                                             startHour: 12
// //                                             }
// //                                         ],
// //                                         value: "+10"
// //                                         },
// //                                     {
// //                                     perkType: "experience",
// //                                     target: undefined,
// //                                     time: [
// //                                         {
// //                                         _id: 2,
// //                                         hoursFlag: false,
// //                                         lengthInHours: 24,
// //                                         startDay: 4,
// //                                         startHour: 12
// //                                         }
// //                                     ],
// //                                     value: "+20%"
// //                                     }
// //                                 ]
// //                             }
// //                         }
// //                     ],
// //                     cleric: [
// //                         {
// //                             quantity: 3,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "ring",
// //                                 name: "Pierścień siły",
// //                                 class: null,
// //                                 description: "Całuj mój sygnet potęgi",
// //                                 imgSrc: "strength-ring.png",
// //                                 perks: [
// //                                     {
// //                                         _id: 1,
// //                                         perkType: "disc-product",
// //                                         target: { name: "Wóda2" },
// //                                         time: [
// //                                         {
// //                                             hoursFlag: true,
// //                                             lengthInHours: 12,
// //                                             startDay: 4,
// //                                             startHour: 20,
// //                                         },
// //                                         { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
// //                                         ],
// //                                         value: "-15%"
// //                                     }
// //                                 ]
// //                             }
// //                         }
// //                     ],
                    
// //                 }
// //             },
// //             {
// //                 level: 500,
// //                 awards: {
// //                     any: [
// //                         {
// //                             quantity: 2,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "feet",
// //                                 class: 'any',
// //                                 name: "Wysokie buty",
// //                                 description: "Skórzane, wypastowane, lśniące",
// //                                 imgSrc: "high-boots.png",
// //                                 perks: [
// //                                     {
// //                                     _id: 1,
// //                                     perkType: "disc-category",
// //                                     target: 'food',
// //                                     time: [
// //                                         {
// //                                             hoursFlag: true,
// //                                             lengthInHours: 24,
// //                                             startDay: 4,
// //                                             startHour: 18
// //                                         },
// //                                         { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
// //                                     ],
// //                                     value: "-10%"
// //                                     }
// //                                 ]
// //                             }
// //                         },
// //                         {
// //                             quantity: 1,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "legs",
// //                                 name: "Lniane spodnie",
// //                                 class: 'any',
// //                                 description: "Zwykłe spodnie, czego jeszcze chcesz?",
// //                                 imgSrc: "linen-trousers.png",
// //                                 perks: []
// //                             }
// //                         }
// //                     ],
// //                     warrior: [],
// //                     rogue: [],
// //                     mage: [],
// //                     cleric: [],
// //                 }


// //             },
// //             {
// //                 level: 2000,
// //                 awards: {
// //                     any: [
// //                         {
// //                             quantity: 1,
// //                             itemModel: {
// //                                 _id: uuid(),
// //                                 type: "legs",
// //                                 name: "Lniane spodnie",
// //                                 class: 'any',
// //                                 description: "Zwykłe spodnie, czego jeszcze chcesz?",
// //                                 imgSrc: "linen-trousers.png",
// //                                 perks: []
// //                             }
// //                         }
// //                     ],
// //                     warrior: [],
// //                     rogue: [],
// //                     mage: [],
// //                     cleric: [],
                    
// //                 }
// //             },
// //         ] 
// //     }
// //     //return undefined
// // }

// const mockItems = [
//     {
      
//         _id: 101,
//         type: "amulet",
//         name: "Diament",
//         fluff: "Najlepszy przyjaciel dziewyczyny",
//         imgSrc: "diamond-amulet.png",
//         class: "any"
      
//     },
//     {
      
//         _id: 102,
//         type:  "amulet",
//         name: "Perła",
//         fluff: "Perła prosto z lodówki, znaczy z małży",
//         imgSrc: "pearl-amulet.png",
//         class: "any"
      
//     },
//   {
//         _id: 201,
//         type: "weapon",
//         name: "Krótki miecz",
//         fluff: "Przynajmniej nie masz kompleksów",
//         imgSrc: "short-sword.png",
//         class: "any"
      
//     },
//     {
     
//         _id: 202,
//         type: "weapon",
//         name: "Wielki miecz",
//         fluff: "Zdecydowanie masz kompleksy",
//         imgSrc: "short-sword.png",
//         class: "warrior",
//         perks: [
//           {
//             perkType: "attr-strength",
//             target: undefined,
//             time: [],
//             value: "+1"
//           }
//         ]
      
//     },
//     {
      
//         _id: 203,
//         type: "weapon",
//         name: "Kostur twojej starej",
//         fluff: "Niektórzy mówią, że to tylko miotła",
//         imgSrc: "short-sword.png",
//         class: "mage"
      
//     },
//     {
      
//         _id: 204,
//         type:  "weapon",
//         name: "Nusz",
//         fluff: "(ja)nusz",
//         imgSrc: "short-sword.png",
//         class: "rogue"
      
//     },
//     {
      
//         _id: 205,
//         type: "weapon",
//         name: "Morgensztern",
//         fluff: "Adam Małysz, jeszcze cię pokonam",
//         imgSrc: "short-sword.png",
//         class: "cleric"
      
//     },
//     {
//         _id: 301,
//         type: "chest",
//         name: "Skórzana kurta",
//         fluff: "Lale za takimi szaleją",
//         imgSrc: "leather-jerkin.png",
//         class: "any"
      
//     },
//     {
      
//         _id: 302,
//         type: "chest",
//         name: "Sutanna bojowa",
//         fluff: "Wiadomo, kto jest kierownikiem tej plebanii",
//         imgSrc: "leather-jerkin.png",
//         class: "cleric"
      
//     },
//   {
//         _id: 401,
//         type: "legs",
//         name: "Lniane spodnie",
//         fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
//         imgSrc: "linen-trousers.png",
//         class: "any"
      
//     },
//     {
//         _id: 402,
//         type: "legs",
//         name: "Nogawice płytowe",
//         fluff: "Nie da się w nich klękać do miecza",
//         imgSrc: "linen-trousers.png",
//         class: "warrior"
      
//     },
//      {
//         _id: 403,
//         type: "legs",
//         name: "Ledżinsy",
//         fluff: "Obcisłe jak lubisz",
//         imgSrc: "linen-trousers.png",
//         class: "rogue"
//       },
//    {
//         _id: 501,
//         type: "feet",
//         name: "Wysokie buty",
//         fluff: "Skórzane, wypastowane, lśniące",
//         imgSrc: "high-boots.png",
//         class: "any"
      
//     },
//     {
//         _id: 502,
//         type: "feet",
//         name: "Kapcie cichobiegi",
//         fluff: "+10 do testów skradania na linoleum",
//         imgSrc: "high-boots.png",
//         class: "rogue"
//       },
    
//    {
//         _id: 601,
//         type: "head",
//         name: "Czapka z piórkiem",
//         fluff: "Wesoła kompaniaaaa",
//         imgSrc: "feathered-hat.png",
//         class: "any"
      
//     },
//     {
//         _id: 602,
//         type: "head",
//         name: "Kaptur czarodzieja",
//         fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
//         imgSrc: "wizard-coul.png",
//         class: "mage",
//         perks: [
//           {
//             perkType: "experience",
//             target: undefined,
//             time: [
//               {
//                 hoursFlag: false,
//                 lengthInHours: 24,
//                 startDay: 5,
//                 startHour: 12
//               }
//             ],
//             value: "+10%"
//           }
//         ]
//       },
//     {
//         _id: 701,
//         type: "ring",
//         name: "Pierścień wódy",
//         fluff: "Całuj mój sygnet potęgi",
//         imgSrc: "strength-ring.png",
//         class: "any",
//         perks: [
//           {
//             perkType: "disc-product",
//             target: { name: "Wóda" },
//             time: [
//               { hoursFlag: true, lengthInHours: 2, startDay: 1, startHour: 18 }
//             ],
//             value: "-10%"
//           }
//         ]
//     },
//   ]

// const mockUsers = [
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment(), avatar: 'dsad' },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//   { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//   { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
// ];

// const mockParties = [
//     {
//       name: "Drużyna A",
//       leader:  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//       members: [
//         { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
//       ]
//     },
//     {
//       name: "Ekipa jamnika",
//       leader: { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//       members: [
//         { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
//         { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
//         { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
        
//       ]
//     }
//   ];

//const mockOrders = [
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    //   {_id: uuid(), leader: "A B", totalPrice: 41.5},
    //   {_id: uuid(), leader: "halo2", totalPrice: 12},
    //   {_id: uuid(), leader: "eeas", totalPrice: 11.5},
    //   {_id: uuid(), leader: "sad", totalPrice: 1000},
    //   {_id: uuid(), leader: "dcxzda", totalPrice: 141.5},
    //   {_id: uuid(), leader: "haldsdsa", totalPrice: 1222},
    //   {_id: uuid(), leader: "eedsas", totalPrice: 91.5},
    //   {_id: uuid(), leader: "321dfcxz", totalPrice: 997.12},
    // ];
    

//const createTempProducts = () => {
    //   return [{
    //     _id: 1,
    //     category: "shot",
    //     name: "Wóda",
    //     description: "nie mam weny",
    //     price: 7.0,
    //     imgSrc: "drink.png"
    //   },
    //   {
    //     _id: 2,
    //     category: "shot",
    //     name: "Zryje",
    //     description: "na opisy",
    //     price: 7.0,
    //     imgSrc: "drink.png"
    //   },
    //   {
    //     _id: 3,
    //     category: "shot",
    //     name: "Banie",
    //     description: "szotów",
    //     price: 7.0,
    //     imgSrc: "drink.png"
    //   },
    //   {
    //     _id: 4,
    //     category: "shot",
    //     name: "BWóda",
    //     description: "nie mam weny",
    //     price: 7.0,
    //     imgSrc: "drink.png"
    //   },
    //   {
    //     _id: 5,
    //     category: "shot",
    //     name: "BZryje",
    //     description: "na opisy",
    //     price: 7.0,
    //     imgSrc: "drink.png"
    //   }]
    // }

// const mockEvents = [
//     {
//       id: 1,
//       status: "ready",
//       unique: false,
//       title: "Wyprawa po minerał fiuta",
//       minLevel: 5,
//       description: "Dalej dalej po minerał fiutaa",
//       imgSrc: "mission-icon.png",
//       minPlayers: 2,
//       maxPlayers: 6,
//       strength: 5,
//       dexterity: 4,
//       magic: 10,
//       endurance: 3,
//       amulets: [
//         {
//           itemModel: {
//             id: 101,
//             type: {
//               id: 201,
//               type: "amulet"
//             },
//             name: "Diament",
//             imgSrc: "diamond-amulet.png"
//           },
//           quantity: 1
//         },
//         {
//           itemModel: {
//             id: 102,
//             type: {
//               id: 201,
//               type: "amulet"
//             },
//             name: "Perła",
//             imgSrc: "pearl-amulet.png"
//           },
//           quantity: 1
//         }
//       ],
//       items: {
//         any: [
//           {
//             itemModel: {
//               id: 201,
//               type: {
//                 id: 2,
//                 type: "weapon"
//               },
//               name: "Krótki miecz",
//               fluff: "Przynajmniej nie masz kompleksów",
//               imgSrc: "short-sword.png",
//               class: "any"
//             },
//             quantity: 2
//           }
//         ],
//         warrior: [
//           {
//             itemModel: {
//               id: 202,
//               type: {
//                 id: 2,
//                 type: "weapon"
//               },
//               name: "Wielki miecz",
//               fluff: "Zdecydowanie masz kompleksy",
//               imgSrc: "short-sword.png",
//               class: "warrior",
//               perks: [
//                 {
//                   perkType: "attr-strength",
//                   target: undefined,
//                   time: [],
//                   value: "+1"
//                 }
//               ]
//             },
//             quantity: 1
//           }
//         ]
//       },
//       experience: 2000,
//       activationDate: "2019-10-21T19:00",
//       expiryDate: "2019-10-21T00:00",
//       isPermanent: false,
//       awardsAreSecret: false
//     },
//     {
//       id: 2,
//       status: "active",
//       unique: false,
//       title: "Wycieczka z przewodnikiem po grocie Twojej Starej",
//       minLevel: 5,
//       description: "Echo echo echo...",
//       imgSrc: "mission-icon.png",
//       minPlayers: 3,
//       maxPlayers: 8,
//       strength: 15,
//       dexterity: 14,
//       magic: 11,
//       endurance: 31,
//       amulets: [
//         {
//           itemModel: {
//             id: 101,
//             type: {
//               id: 201,
//               type: "amulet"
//             },
//             name: "Diament",
//             imgSrc: "diamond-amulet.png"
//           },
//           quantity: 1
//         },
//         {
//           itemModel: {
//             id: 102,
//             type: {
//               id: 201,
//               type: "amulet"
//             },
//             name: "Perła",
//             imgSrc: "pearl-amulet.png"
//           },
//           quantity: 1
//         }
//       ],
//       items: {
//         any: [
//           {
//             itemModel: {
//               id: 201,
//               type: {
//                 id: 2,
//                 type: "weapon"
//               },
//               name: "Krótki miecz",
//               fluff: "Przynajmniej nie masz kompleksów",
//               imgSrc: "short-sword.png",
//               class: "any"
//             },
//             quantity: 2
//           }
//         ],
//         warrior: [
//           {
//             itemModel: {
//               id: 202,
//               type: {
//                 id: 2,
//                 type: "weapon"
//               },
//               name: "Wielki miecz",
//               fluff: "Zdecydowanie masz kompleksy",
//               imgSrc: "short-sword.png",
//               class: "warrior",
//               perks: [
//                 {
//                   perkType: "attr-strength",
//                   target: undefined,
//                   time: [],
//                   value: "+1"
//                 }
//               ]
//             },
//             quantity: 1
//           }
//         ]
//       },
//       experience: 5000,
//       activationDate: "2019-10-21T19:00",
//       expiryDate: "2019-10-21T00:00",
//       isPermanent: false,
//       awardsAreSecret: true
//     },
//     {
//       id: 3,
//       status: "ready",
//       title: "Rajd test",
//       description: "Idziemy na rajd",
//       imgSrc: "mission-icon.png",
//       awardsLevels: [
//         {
//           level: 200,
//           awards: {
//             any: [
//               {
//                 itemModel: {
//                   id: 201,
//                   type: {
//                     id: 2,
//                     type: "weapon"
//                   },
//                   name: "Krótki miecz",
//                   fluff: "Przynajmniej nie masz kompleksów",
//                   imgSrc: "short-sword.png",
//                   class: "any"
//                 },
//                 quantity: 2
//               }
//             ],
//             warrior: [
//               {
//                 itemModel: {
//                   id: 202,
//                   type: {
//                     id: 2,
//                     type: "weapon"
//                   },
//                   name: "Wielki miecz",
//                   fluff: "Zdecydowanie masz kompleksy",
//                   imgSrc: "short-sword.png",
//                   class: "warrior",
//                   perks: [
//                     {
//                       perkType: "attr-strength",
//                       target: undefined,
//                       time: [],
//                       value: "+1"
//                     }
//                   ]
//                 },
//                 quantity: 1
//               }
//             ]
//           }
//         },
//         {
//           level: 2000,
//           awards: {
//             any: [
//               {
//                 itemModel: {
//                   id: 201,
//                   type: {
//                     id: 2,
//                     type: "weapon"
//                   },
//                   name: "Krótki miecz",
//                   fluff: "Przynajmniej nie masz kompleksów",
//                   imgSrc: "short-sword.png",
//                   class: "any"
//                 },
//                 quantity: 2
//               }
//             ],
//             warrior: [
//               {
//                 itemModel: {
//                   id: 202,
//                   type: {
//                     id: 2,
//                     type: "weapon"
//                   },
//                   name: "Wielki miecz",
//                   fluff: "Zdecydowanie masz kompleksy",
//                   imgSrc: "short-sword.png",
//                   class: "warrior",
//                   perks: [
//                     {
//                       perkType: "attr-strength",
//                       target: undefined,
//                       time: [],
//                       value: "+1"
//                     }
//                   ]
//                 },
//                 quantity: 1
//               }
//             ]
//           }
//         }
//       ],
//       experience: 500,
//       activationDate: "2019-10-21T19:00",
//       startDate: "2019-10-22T19:00",
//       expiryDate: "2019-10-23T00:00",
//       awardsAreSecret: false
//     }
//   ];

// const mockAmulets = [
//     {
//       itemModel: {
//         _id: 101,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Diament",
//         imgSrc: "diamond-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 102,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Perła",
//         imgSrc: "pearl-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 103,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Szmaragd",
//         imgSrc: "emerald-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 104,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Szafir",
//         imgSrc: "sapphire-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 105,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Diament2",
//         imgSrc: "diamond-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 106,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Perła2",
//         imgSrc: "pearl-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 107,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Szmaragd2",
//         imgSrc: "emerald-amulet.png"
//       },
//       quantity: 0
//     },
//     {
//       itemModel: {
//         _id: 108,
//         type: {
//           _id: 201,
//           type: "amulet"
//         },
//         name: "Szafir2",
//         imgSrc: "sapphire-amulet.png"
//       },
//       quantity: 0
//     }
//   ];
  
//   let mockItems = [
//     {
//       itemModel: {
//         _id: 101,
//         type: {
//           _id: 1,
//           type: "amulet"
//         },
//         name: "Diament",
//         fluff: "Najlepszy przyjaciel dziewyczyny",
//         imgSrc: "diamond-amulet.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 102,
//         type: {
//           _id: 1,
//           type: "amulet"
//         },
//         name: "Perła",
//         fluff: "Perła prosto z lodówki, znaczy z małży",
//         imgSrc: "pearl-amulet.png",
//         class: "any"
//       }
//     },
  
//     {
//       itemModel: {
//         _id: 201,
//         type: {
//           _id: 2,
//           type: "weapon"
//         },
//         name: "Krótki miecz",
//         fluff: "Przynajmniej nie masz kompleksów",
//         imgSrc: "short-sword.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 202,
//         type: {
//           _id: 2,
//           type: "weapon"
//         },
//         name: "Wielki miecz",
//         fluff: "Zdecydowanie masz kompleksy",
//         imgSrc: "short-sword.png",
//         class: "warrior",
//         perks: [
//           {
//             perkType: "attr-strength",
//             target: undefined,
//             time: [],
//             value: "+1"
//           }
//         ]
//       }
//     },
//     {
//       itemModel: {
//         _id: 203,
//         type: {
//           _id: 2,
//           type: "weapon"
//         },
//         name: "Kostur twojej starej",
//         fluff: "Niektórzy mówią, że to tylko miotła",
//         imgSrc: "short-sword.png",
//         class: "mage"
//       }
//     },
//     {
//       itemModel: {
//         _id: 204,
//         type: {
//           _id: 2,
//           type: "weapon"
//         },
//         name: "Nusz",
//         fluff: "(ja)nusz",
//         imgSrc: "short-sword.png",
//         class: "rogue"
//       }
//     },
//     {
//       itemModel: {
//         _id: 205,
//         type: {
//           _id: 2,
//           type: "weapon"
//         },
//         name: "Morgensztern",
//         fluff: "Adam Małysz, jeszcze cię pokonam",
//         imgSrc: "short-sword.png",
//         class: "cleric"
//       }
//     },
  
//     {
//       itemModel: {
//         _id: 301,
//         type: {
//           _id: 3,
//           type: "chest"
//         },
//         name: "Skórzana kurta",
//         fluff: "Lale za takimi szaleją",
//         imgSrc: "leather-jerkin.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 302,
//         type: {
//           _id: 3,
//           type: "chest"
//         },
//         name: "Sutanna bojowa",
//         fluff: "Wiadomo, kto jest kierownikiem tej plebanii",
//         imgSrc: "leather-jerkin.png",
//         class: "cleric"
//       }
//     },
  
//     {
//       itemModel: {
//         _id: 401,
//         type: {
//           _id: 4,
//           type: "legs"
//         },
//         name: "Lniane spodnie",
//         fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
//         imgSrc: "linen-trousers.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 402,
//         type: {
//           _id: 4,
//           type: "legs"
//         },
//         name: "Nogawice płytowe",
//         fluff: "Nie da się w nich klękać do miecza",
//         imgSrc: "linen-trousers.png",
//         class: "warrior"
//       }
//     },
//     {
//       itemModel: {
//         _id: 403,
//         type: {
//           _id: 4,
//           type: "legs"
//         },
//         name: "Ledżinsy",
//         fluff: "Obcisłe jak lubisz",
//         imgSrc: "linen-trousers.png",
//         class: "rogue"
//       }
//     },
  
//     {
//       itemModel: {
//         _id: 501,
//         type: {
//           _id: 5,
//           type: "feet"
//         },
//         name: "Wysokie buty",
//         fluff: "Skórzane, wypastowane, lśniące",
//         imgSrc: "high-boots.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 502,
//         type: {
//           _id: 5,
//           type: "feet"
//         },
//         name: "Kapcie cichobiegi",
//         fluff: "+10 do testów skradania na linoleum",
//         imgSrc: "high-boots.png",
//         class: "rogue"
//       }
//     },
  
//     {
//       itemModel: {
//         _id: 601,
//         type: {
//           _id: 6,
//           type: "head"
//         },
//         name: "Czapka z piórkiem",
//         fluff: "Wesoła kompaniaaaa",
//         imgSrc: "feathered-hat.png",
//         class: "any"
//       }
//     },
//     {
//       itemModel: {
//         _id: 602,
//         type: {
//           _id: 6,
//           type: "head"
//         },
//         name: "Kaptur czarodzieja",
//         fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
//         imgSrc: "wizard-coul.png",
//         class: "mage",
//         perks: [
//           {
//             perkType: "experience",
//             target: undefined,
//             time: [
//               {
//                 hoursFlag: false,
//                 lengthInHours: 24,
//                 startDay: 5,
//                 startHour: 12
//               }
//             ],
//             value: "+10%"
//           }
//         ]
//       }
//     },
//     {
//       itemModel: {
//         _id: 701,
//         type: {
//           _id: 7,
//           type: "ring"
//         },
//         name: "Pierścień wódy",
//         fluff: "Całuj mój sygnet potęgi",
//         imgSrc: "strength-ring.png",
//         class: "any",
//         perks: [
//           {
//             perkType: "disc-product",
//             target: { name: "Wóda" },
//             time: [
//               { hoursFlag: true, lengthInHours: 2, startDay: 1, startHour: 18 }
//             ],
//             value: "-10%"
//           }
//         ]
//       }
//     }
//   ];

// export const createMockPlayer = (attributes, equipment) => {
//     return {
//       firstName: "Mirosław",
//       lastName: "Szczepaniak",
//       level: 8,
//       ...attributes,
//       equipment,
//       currentExp: 1300,
//       currentExpBasis: 2100,
//       nextLevelAtExp: 3400
//     };
// };
  
// export const mockEquipment = {
//       amulet: [
//         {
//           __id: 1,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 101,
//             type: {
//               _id: 1,
//               type: "amulet"
//             },
//             name: "Diament",
//             fluff: "Najlepszy przyjaciel dziewyczyny",
//             imgSrc: "diamond-amulet.png"
//           }
//         },
//         {
//           _id: 2,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 101,
//             type: {
//               _id: 1,
//               type: "amulet"
//             },
//             name: "Diament",
//             fluff: "Najlepszy przyjaciel dziewyczyny",
//             imgSrc: "diamond-amulet.png"
//           }
//         },
//         {
//           _id: 3,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 102,
//             type: {
//               _id: 1,
//               type: "amulet"
//             },
//             name: "Perła",
//             fluff: "Perła prosto z lodówki, znaczy z małży",
//             imgSrc: "pearl-amulet.png"
//           }
//         }
//       ],
//       weapon: [
//         {
//           _id: 4,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 201,
//             type: {
//               _id: 2,
//               type: "weapon"
//             },
//             name: "Krótki miecz",
//             fluff: "Przynajmniej nie masz kompleksów",
//             imgSrc: "short-sword.png"
//           }
//         },
//         {
//           _id: 14,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 202,
//             type: {
//               _id: 2,
//               type: "weapon"
//             },
//             name: "Wielki miecz",
//             fluff: "Zdecydowanie masz kompleksy",
//             imgSrc: "short-sword.png",
//             class: "warrior",
//             perks: [
//               {
//                 _id: 1,
//                 perkType: "attr-strength",
//                 target: undefined,
//                 time: [],
//                 value: "+1"
//               }
//             ]
//           }
//         }
//       ],
//       chest: [
//         {
//           _id: 5,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 301,
//             type: {
//               _id: 3,
//               type: "chest"
//             },
//             name: "Skórzana kurta",
//             fluff: "Lale za takimi szaleją",
//             imgSrc: "leather-jerkin.png"
//           }
//         }
//       ],
//       legs: [
//         {
//           _id: 6,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 401,
//             type: {
//               _id: 4,
//               type: "legs"
//             },
//             name: "Lniane spodnie",
//             fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
//             imgSrc: "linen-trousers.png"
//           }
//         }
//       ],
//       feet: [
//         {
//           _id: 7,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 501,
//             type: {
//               _id: 5,
//               type: "feet"
//             },
//             name: "Wysokie buty",
//             fluff: "Skórzane, wypastowane, lśniące",
//             imgSrc: "high-boots.png"
//           }
//         }
//       ],
//       head: [
//         {
//           _id: 8,
//           owner: 11111,
//           equipped: false,
//           itemModel: {
//             _id: 601,
//             type: {
//               _id: 6,
//               type: "head"
//             },
//             name: "Czapka z piórkiem",
//             fluff: "Wesoła kompaniaaaa",
//             imgSrc: "feathered-hat.png"
//           }
//         },
//         {
//           _id: 9,
//           owner: 11111,
//           equipped: true,
//           itemModel: {
//             _id: 602,
//             type: {
//               _id: 6,
//               type: "head"
//             },
//             name: "Kaptur czarodzieja",
//             fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
//             imgSrc: "wizard-coul.png",
//             perks: [
//               {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                   {
//                     _id: 1,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 5,
//                     startHour: 12
//                   }
//                 ],
//                 value: "+10%"
//               },
//               {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                   {
//                     _id: 2,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 6,
//                     startHour: 12
//                   }
//                 ],
//                 value: "+20%"
//               }
//             ]
//           }
//         }
//       ],
//       ring: [
//         {
//           _id: 10,
//           owner: 11111,
//           equipped: true,
//           itemModel: {
//             _id: 701,
//             type: {
//               _id: 7,
//               type: "ring"
//             },
//             name: "Pierścień siły",
//             fluff: "Całuj mój sygnet potęgi",
//             imgSrc: "strength-ring.png",
//             perks: [
//               {
//                 _id: 1,
//                 perkType: "disc-product",
//                 target: { name: "Wóda2" },
//                 time: [
//                   {
//                     hoursFlag: true,
//                     lengthInHours: 2,
//                     startDay: 1,
//                     startHour: 18
//                   },
//                   { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                 ],
//                 value: "-15%"
//               }
//             ]
//           }
//         }
//       ]
//     };

// export const mockEventList = [
//         {
//             id: 1,
//             title: 'Mission1',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 4,
//             level: 1,
//             strength: 1,
//             dexterity: 2,
//             magic: 3,
//             endurance: 4,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },
//         {
//             id: 2,
//             title: 'Mission2',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 3,
//             level: 3,
//             strength: 5,
//             dexterity: 3,
//             magic: 2,
//             endurance: 1,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 103,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'sapphire',
//                         imgSrc: 'sapphire-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },
//         {
//             id: 3,
//             title: 'Mission3',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 4,
//             level: 1,
//             strength: 1,
//             dexterity: 2,
//             magic: 3,
//             endurance: 4,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },
//         {
//             id: 4,
//             title: 'Mission4',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 3,
//             level: 3,
//             strength: 5,
//             dexterity: 3,
//             magic: 2,
//             endurance: 1,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 103,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'sapphire',
//                         imgSrc: 'sapphire-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },
//         {
//             id: 5,
//             title: 'Mission5',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 4,
//             level: 1,
//             strength: 1,
//             dexterity: 2,
//             magic: 3,
//             endurance: 4,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },
//         {
//             id: 6,
//             title: 'Mission6',
//             avatarSrc: {avatarTemp: missionIconTemp},
//             minPlayers: 3,
//             maxPlayers: 3,
//             level: 3,
//             strength: 5,
//             dexterity: 3,
//             magic: 2,
//             endurance: 1,
//             description: 'Super important mission. You need have things and attributes, as always loool xd',
//             amulets: [
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 103,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'sapphire',
//                         imgSrc: 'sapphire-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 1,
//                     itemModel: {
//                         id: 101,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'diamond',
//                         imgSrc: 'diamond-amulet.png'
//                     }
//                 },
//                 {
//                     quantity: 2,
//                     itemModel: {
//                         id: 102,
//                         type: {
//                             id: 201,
//                             type: 'amulet'
//                         },
//                         name: 'pearl',
//                         imgSrc: 'pearl-amulet.png'
//                     }
//                 },
//             ]
//         },

//     ]

// export const mockTorpedoList =  [
//             {
//                 _id: 120,
//                 owner: 11111,
//                 itemModel: {
//                   _id: 600,
//                   type: {
//                     _id: 6,
//                     type: "torpedo"
//                   },
//                   name: "D1",
//                   fluff: "Ostrzelaj pole D1!",
//                   imgSrc: "torpedo.png"
//                 }
//             },
//             {
//                 _id: 121,
//                 owner: 11111,
//                 itemModel: {
//                   _id: 601,
//                   type: {
//                     _id: 6,
//                     type: "torpedo"
//                   },
//                   name: "E3",
//                   fluff: "Ostrzelaj pole E3!",
//                   imgSrc: "torpedo.png"
//                 }
//             },
//             {
//                 _id: 122,
//                 owner: 11111,
//                 itemModel: {
//                   _id: 602,
//                   type: {
//                     _id: 6,
//                     type: "torpedo"
//                   },
//                   name: "I3",
//                   fluff: "Ostrzelaj pole I3!",
//                   imgSrc: "torpedo.png"
//                 }
//             },
//     ]

// export const mockMission = {
//         _id: 2,
//         title: 'Mission2',
//         avatarSrc: 'mission.png',
//         minPlayers: 3,
//         maxPlayers: 3,
//         description: 'Super important mission. You need have things and attributes, as always loool xd',
//         amulets: [
//             {
//                 quantity: 2,
//                 itemModel: {
//                     _id: 103,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'sapphire',
//                     imgSrc: 'sapphire-amulet.png'
//                 }
//             },
//             {
//                 quantity: 1,
//                 itemModel: {
//                     _id: 101,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'diamond',
//                     imgSrc: 'diamond-amulet.png'
//                 }
//             },
//             {
//                 quantity: 2,
//                 itemModel: {
//                     _id: 102,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'pearl',
//                     imgSrc: 'pearl-amulet.png'
//                 }
//             },
//         ]
//     }
    

// export const mockMissionPartyList = [
//         {
//             inRoom: false,
//             readyStatus: false,
//             user: {
//                 _id: 1,
//                 name: 'user1',
//                 avatar: avatarTemp,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             user: {
//                 _id: 2,
//                 name: 'user2',
//                 avatar: avatarTemp,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             user: {
//                 _id: 3,
//                 name: 'user3 halo',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             user: {
//                 _id: 4,
//                 name: 'user4 halo',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             user: {
//                 _id: 5,
//                 name: 'user5',
//                 avatar: avatarTemp,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//     ]


// export const mockAmulets = [
//     {
//         itemModel: {
//         id: 101,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Diament",
//         imgSrc: "diamond-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 102,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Perła",
//         imgSrc: "pearl-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 103,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Szmaragd",
//         imgSrc: "emerald-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 104,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Szafir",
//         imgSrc: "sapphire-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 105,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Diament2",
//         imgSrc: "diamond-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 106,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Perła2",
//         imgSrc: "pearl-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 107,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Szmaragd2",
//         imgSrc: "emerald-amulet.png"
//         },
//         quantity: 0
//     },
//     {
//         itemModel: {
//         id: 108,
//         type: {
//             id: 201,
//             type: "amulet"
//         },
//         name: "Szafir2",
//         imgSrc: "sapphire-amulet.png"
//         },
//         quantity: 0
//     }
//     ];


// const mockEquippedItems = {
//         amulet: {
//             _id: uuid(),
//             owner: 11111,
//             itemModel: {
//                 _id: uuid(),
//                 type: {
//                 _id: 1,
//                 type: "amulet"
//                 },
//                 name: "Diament",
//                 fluff: "Najlepszy przyjaciel dziewyczyny",
//                 imgSrc: "diamond-amulet.png"
//             }
//         },
//         weaponRight: {
            
//                 _id: uuid(),
//                 owner: 11111,
//                 itemModel: {
//                 _id: uuid(),
//                 type: {
//                     _id: 2,
//                     type: "weapon"
//                 },
//                 name: "Krótki miecz",
//                 fluff: "Przynajmniej nie masz kompleksów",
//                 imgSrc: "short-sword.png"
//                 }
            
//         },
//         weaponLeft: {
            
//             _id: uuid(),
//             owner: 11111,
//             equipped: false,
//             itemModel: {
//                 _id: uuid(),
//                 type: {
//                     _id: 2,
//                     type: "weapon"
//                 },
//                 name: "Wielki miecz",
//                 fluff: "Zdecydowanie masz kompleksy",
//                 imgSrc: "short-sword.png",
//                 class: "warrior",
//                 perks: [
//                     {
//                     _id: 1,
//                     perkType: "attr-strength",
//                     target: undefined,
//                     time: [
//                         {
//                             _id: 1,
//                             hoursFlag: false,
//                             lengthInHours: 5,
//                             startDay: 4,
//                             startHour: 19
//                         },
//                         {
//                             _id: 1,
//                             hoursFlag: true,
//                             lengthInHours: 1,
//                             startDay: 3,
//                             startHour: 18
//                         },
//                     ],
//                         value: "+3"
//                     },
//                     {
//                         _id: 13213,
//                         perkType: "attr-dexterity",
//                         target: undefined,
//                         time: [
//                             {
//                                 _id: 1,
//                                 hoursFlag: false,
//                                 lengthInHours: 5,
//                                 startDay: 4,
//                                 startHour: 19
//                             },
//                             {
//                                 _id: 1,
//                                 hoursFlag: true,
//                                 lengthInHours: 1,
//                                 startDay: 3,
//                                 startHour: 18
//                             },
//                         ],
//                             value: "-1"
//                         }
//                 ]
                
//             }
//         },
//         chest: {
//             _id: uuid(),
//             owner: 11111,
//             itemModel: {
//             _id: uuid(),
//             type: {
//                 _id: 3,
//                 type: "chest"
//             },
//             name: "Skórzana kurta",
//             fluff: "Lale za takimi szaleją",
//             imgSrc: "leather-jerkin.png"
//             }
//         },
//         legs: {
            
//                 _id: uuid(),
//                 owner: 11111,
//                 equipped: false,
//                 itemModel: {
//                 _id: uuid(),
//                 type: {
//                     _id: 4,
//                     type: "legs"
//                 },
//                 name: "Lniane spodnie",
//                 fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
//                 imgSrc: "linen-trousers.png"
//                 }
            
//         }
//         ,
//         hands: {},
//         feet: {
            
//                 _id: uuid(),
//                 owner: 11111,
//                 equipped: false,
//                 itemModel: {
//                     _id: uuid(),
//                     type: {
//                         _id: 5,
//                         type: "feet"
//                     },
//                 name: "Wysokie buty",
//                 fluff: "Skórzane, wypastowane, lśniące",
//                 imgSrc: "high-boots.png",
//                 perks: [
//                     {
//                     _id: 1,
//                     perkType: "disc-category",
//                     target: 'food',
//                     time: [
//                     {
//                         hoursFlag: true,
//                         lengthInHours: 24,
//                         startDay: 4,
//                         startHour: 18
//                     },
//                     { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                     ],
//                     value: "-10%"
//                     }
//                 ]
//                 },
                
            
//         },
//         head: {
//             _id: uuid(),
//             owner: 11111,
//             equipped: true,
//             itemModel: {
//             _id: uuid(),
//             type: {
//                 _id: 6,
//                 type: "head"
//             },
//             name: "Kaptur czarodzieja",
//             fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
//             imgSrc: "wizard-coul.png",
//             perks: [
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 1,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+10%"
//                 },
//                 {
//                     perkType: "experience",
//                     target: undefined,
//                     time: [
//                         {
//                         _id: 1,
//                         hoursFlag: false,
//                         lengthInHours: 24,
//                         startDay: 4,
//                         startHour: 12
//                         }
//                     ],
//                     value: "+10"
//                     },
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 2,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+20%"
//                 }
//             ]
//             }
//         },
//         ringRight: {
//             _id: uuid(),
//             owner: 11111,
//             equipped: true,
//             itemModel: {
//                 _id: uuid(),
//                 type: {
//                     _id: 7,
//                     type: "ring"
//                 },
//                 name: "Pierścień siły",
//                 fluff: "Całuj mój sygnet potęgi",
//                 imgSrc: "strength-ring.png",
//                 perks: [
//                 {
//                     _id: 1,
//                     perkType: "disc-product",
//                     target: commonUuid1,
//                     time: [
//                     {
//                         hoursFlag: true,
//                         lengthInHours: 12,
//                         startDay: 4,
//                         startHour: 20,
//                     },
//                     { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                     ],
//                     value: "-15%"
//                 }
//                 ]
//             }
//         },
//         ringLeft: {},
// }
      
// export const mockItems = [
//     {
//         _id: uuid(),
//         owner: 11111,
//         itemModel: {
//             _id: uuid(),
//             type: "amulet",
//             name: "Diament",
//             fluff: "Najlepszy przyjaciel dziewyczyny",
//             imgSrc: "diamond-amulet.png"
//         }
//     },
//     {
        
//         _id: uuid(),
//         owner: 11111,
//         itemModel: {
//             _id: uuid(),
//             type: "weapon",
//             name: "Krótki miecz",
//             fluff: "Przynajmniej nie masz kompleksów",
//             imgSrc: "short-sword.png"
//         }
        
//     },
//     {
        
//         _id: uuid(),
//         owner: 11111,
//         equipped: false,
//         itemModel: {
//             _id: uuid(),
//             type: "weapon",
//             name: "Wielki miecz",
//             fluff: "Zdecydowanie masz kompleksy",
//             imgSrc: "short-sword.png",
//             class: "warrior",
//             perks: [
//                 {
//                     _id: 1,
//                     perkType: "attr-strength",
//                     target: undefined,
//                     time: [
//                         {
//                             _id: 1,
//                             hoursFlag: false,
//                             lengthInHours: 5,
//                             startDay: 4,
//                             startHour: 19
//                         },
//                         {
//                             _id: 1,
//                             hoursFlag: true,
//                             lengthInHours: 1,
//                             startDay: 3,
//                             startHour: 18
//                         },
//                     ],
//                         value: "+3"
//                 },
//                 {
//                     _id: 13213,
//                     perkType: "attr-dexterity",
//                     target: undefined,
//                     time: [
//                         {
//                             _id: 1,
//                             hoursFlag: false,
//                             lengthInHours: 5,
//                             startDay: 4,
//                             startHour: 19
//                         },
//                         {
//                             _id: 1,
//                             hoursFlag: true,
//                             lengthInHours: 1,
//                             startDay: 3,
//                             startHour: 18
//                         },
//                     ],
//                         value: "-1"
//                     }
//                 ]
            
//         }
//     },
//     {
//         _id: uuid(),
//         owner: 11111,
//         itemModel: {
//             _id: uuid(),
//             type: "chest",
//             name: "Skórzana kurta",
//             fluff: "Lale za takimi szaleją",
//             imgSrc: "leather-jerkin.png"
//         }
//     },
//     {      
//         _id: uuid(),
//         owner: 11111,
//         equipped: false,
//         itemModel: {
//             _id: uuid(),
//             type:"legs",
//             name: "Lniane spodnie",
//             fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
//             imgSrc: "linen-trousers.png"
//         }
//     },
//     {
        
//         _id: uuid(),
//         owner: 11111,
//         equipped: false,
//         itemModel: {
//             _id: uuid(),
//             type: "feet",
//             name: "Wysokie buty",
//             fluff: "Skórzane, wypastowane, lśniące",
//             imgSrc: "high-boots.png",
//             perks: [
//                 {
//                 _id: 1,
//                 perkType: "disc-category",
//                 target: 'food',
//                 time: [
//                 {
//                     hoursFlag: true,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 18
//                 },
//                 { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                 ],
//                 value: "-10%"
//                 }
//             ]
//         },

//     },
//     {
//         _id: uuid(),
//         owner: 11111,
//         equipped: true,
//         itemModel: {
//             _id: uuid(),
//             type: "head",
//             name: "Kaptur czarodzieja",
//             fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
//             imgSrc: "wizard-coul.png",
//             perks: [
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 1,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+10%"
//                 },
//                 {
//                     perkType: "experience",
//                     target: undefined,
//                     time: [
//                         {
//                         _id: 1,
//                         hoursFlag: false,
//                         lengthInHours: 24,
//                         startDay: 4,
//                         startHour: 12
//                         }
//                     ],
//                     value: "+10"
//                     },
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 2,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+20%"
//                 }
//             ]
//         }
//     },
//     {
//         _id: uuid(),
//         owner: 11111,
//         equipped: true,
//         itemModel: {
//             _id: uuid(),
//             type: "ring",
//             name: "Pierścień siły",
//             fluff: "Całuj mój sygnet potęgi",
//             imgSrc: "strength-ring.png",
//             perks: [
//             {
//                 _id: 1,
//                 perkType: "disc-product",
//                 target: uuid(),
//                 time: [
//                 {
//                     hoursFlag: true,
//                     lengthInHours: 12,
//                     startDay: 4,
//                     startHour: 20,
//                 },
//                 { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                 ],
//                 value: "-15%"
//             }
//             ]
//         }
//     },
// ]

// export const mockItemModels = [
//     {
//         _id: uuid(),
//         type: "amulet",
//         name: "Diament",
//         class: null,
//         loyalAward: true,
//         description: "Najlepszy przyjaciel dziewyczyny",
//         imgSrc: "diamond-amulet.png",
//         perks: []
//     },
//     {
//         _id: uuid(),
//         type: "weapon",
//         name: "Krótki miecz",
//         class: null,
//         twoHanded: false,
//         description: "Przynajmniej nie masz kompleksów",
//         imgSrc: "short-sword.png",
//         perks: [],
//     },
//     {
//         _id: uuid(),
//         type: "weapon",
//         name: "Wielki miecz",
//         class: null,
//         description: "Zdecydowanie masz kompleksy",
//         imgSrc: "short-sword.png",
//         class: "warrior",
//         twoHanded: true,
//         perks: [
//             {
//                 _id: 1,
//                 perkType: "attr-strength",
//                 target: undefined,
//                 time: [
//                     {
//                         _id: 1,
//                         hoursFlag: false,
//                         lengthInHours: 5,
//                         startDay: 4,
//                         startHour: 19
//                     },
//                     {
//                         _id: 1,
//                         hoursFlag: true,
//                         lengthInHours: 1,
//                         startDay: 3,
//                         startHour: 18
//                     },
//                 ],
//                     value: "+3"
//             },
//             {
//                 _id: 13213,
//                 perkType: "attr-dexterity",
//                 target: undefined,
//                 time: [
//                     {
//                         _id: 1,
//                         hoursFlag: false,
//                         lengthInHours: 5,
//                         startDay: 4,
//                         startHour: 19
//                     },
//                     {
//                         _id: 1,
//                         hoursFlag: true,
//                         lengthInHours: 1,
//                         startDay: 3,
//                         startHour: 18
//                     },
//                 ],
//                     value: "-1"
//                 }
//             ]
        
//     },
//     {
//         _id: uuid(),
//         type: "chest",
//         name: "Skórzana kurta",
//         class: null,
//         description: "Lale za takimi szaleją",
//         imgSrc: "leather-jerkin.png",
//         perks: []
//     },
//     {      
//         _id: uuid(),
//         type:"legs",
//         name: "Lniane spodnie",
//         class: null,
//         description: "Zwykłe spodnie, czego jeszcze chcesz?",
//         imgSrc: "linen-trousers.png",
//         perks: []
//     },
//     {
        
//             _id: uuid(),
//             type: "feet",
//             name: "Wysokie buty",
//             description: "Skórzane, wypastowane, lśniące",
//             imgSrc: "high-boots.png",
//             perks: [
//                 {
//                 _id: 1,
//                 perkType: "disc-category",
//                 target: 'food',
//                 time: [
//                 {
//                     hoursFlag: true,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 18
//                 },
//                 { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                 ],
//                 value: "-10%"
//                 }
//             ]
//     },


//     {
        
//             _id: uuid(),
//             type: "head",
//             name: "Kaptur czarodzieja",
//             class: null,
//             description: "Kiedyś nosił go czarodziej. Już nie nosi.",
//             imgSrc: "wizard-coul.png",
//             perks: [
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 1,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+10%"
//                 },
//                 {
//                     perkType: "experience",
//                     target: undefined,
//                     time: [
//                         {
//                         _id: 1,
//                         hoursFlag: false,
//                         lengthInHours: 24,
//                         startDay: 4,
//                         startHour: 12
//                         }
//                     ],
//                     value: "+10"
//                     },
//                 {
//                 perkType: "experience",
//                 target: undefined,
//                 time: [
//                     {
//                     _id: 2,
//                     hoursFlag: false,
//                     lengthInHours: 24,
//                     startDay: 4,
//                     startHour: 12
//                     }
//                 ],
//                 value: "+20%"
//                 }
//             ]
        
//     },
//     {
        
//             _id: uuid(),
//             type: "ring",
//             name: "Pierścień siły",
//             class: null,
//             description: "Całuj mój sygnet potęgi",
//             imgSrc: "strength-ring.png",
//             perks: [
//                 {
//                     _id: 1,
//                     perkType: "disc-product",
//                     target: uuid(),
//                     time: [
//                     {
//                         hoursFlag: true,
//                         lengthInHours: 12,
//                         startDay: 4,
//                         startHour: 20,
//                     },
//                     { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
//                     ],
//                     value: "-15%"
//                 }
//             ]
        
//     },
// ]

// export const mockProducts = [
//     {
//         _id: uuid(),
//         category: "shots",
//         name: "BBanie",
//         description: "szotów",
//         price: 7.0,
//         imgSrc: "drink.png",
//         awards: []
//       },
//       {
//         _id: uuid(),
//         category: "drinks",
//         name: "Modżajto",
//         description: "dla mojej świni",
//         price: 13.5,
//         imgSrc: "drink.png",
//         awards: [],
//       },
//       {
//         _id: uuid(),
//         name: "Cosmo",
//         category: "drinks",
//         description: "lubisz, ale się nie przyznasz przed kolegami",
//         price: 27.99,
//         imgSrc: "drink.png",
//         awards: [
//           {
//             quantity: 2,
//             itemModel: {
//               _id: uuid(),
//               type: {
//                 _id: 1,
//                 type: "amulet"
//               },
//               name: "Diament",
//               fluff: "Najlepszy przyjaciel dziewyczyny",
//               imgSrc: "diamond-amulet.png"
//             }
//           }
//         ]
//       },
//       {
//         _id: uuid(),
//         category: "food",
//         name: "BOrzeszki",
//         description: "ziemne",
//         price: 6.0,
//         imgSrc: "drink.png",
//         awards: [],
//       },
//       {
//         _id: uuid(),
//         category: "food",
//         name: "BNaczosy hehe",
//         description: "xddxdx",
//         price: 25.0,
//         imgSrc: "drink.png",
//         awards: [],
//       },
//       {
//         _id: uuid(),
//         category: "beers",
//         name: "Kasztelan",
//         description: "Pan na zamku",
//         price: 12.0,
//         imgSrc: "drink.png",
//         awards: [      
//             {
//                 quantity: 1,
//                 itemModel: {
//                     _id: 600,
//                     type: {
//                     _id: 6,
//                     type: "torpedo"
//                     },
//                     name: "D1",
//                     fluff: "Ostrzelaj pole D1!",
//                     imgSrc: "torpedo.png"
//                 }
//             }
//         ]
//       },
// ]


// export const mockUsers = [
//     { 
//         _id: uuid(),
//         name: "A B",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'warrior',
//         sex: 'man',
//         experience: 2000,
//         attributes: {
//             strength: 6,
//             dexternity: 3,
//             magic: 3,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
 
//     { 
//         _id: uuid(),
//         name: "Ccc",
//         avatar: avatarTemp,
//         active: true,
//         status: 'away',
//         class: 'mage',
//         sex: 'woman',
//         experience: 1000,
//         attributes: {
//             strength: 2,
//             dexternity: 3,
//             magic: 5,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 4,
//             amuletCounters: [
//                 {
//                     counter: 2,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 3,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Dee f",
//         avatar: avatarTemp,
//         active: true,
//         status: 'banned',
//         class: 'cleric',
//         sex: 'woman',
//         experience: 1500,
//         attributes: {
//             strength: 2,
//             dexternity: 3,
//             magic: 3,
//             endrunace: 4,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 3,
//             amuletCounters: [
//                 {
//                     counter: 1,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 4,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Ghi",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'rogue',
//         sex: 'man',
//         experience: 3000,
//         attributes: {
//             strength: 6,
//             dexternity: 3,
//             magic: 1,
//             endrunace: 4,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "KorwinKorwin",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'mage',
//         sex: 'man',
//         experience: 150000,
//         attributes: {
//             strength: 10,
//             dexternity: 8,
//             magic: 10,
//             endrunace: 9,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 46,
//             amuletCounters: [
//                 {
//                     counter: 9,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 11,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 23,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'saphhire',
//                         description: 'Fajny jest',
//                         type: 'amulet',
//                         imgSrc: 'sapphire-pearl.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Nnn",
//         avatar: avatarTemp,
//         active: true,
//         status: 'nonactivated',
//         class: 'rogue',
//         sex: 'man',
//         experience: 0,
//         attributes: {
//             strength: 2,
//             dexternity: 2,
//             magic: 2,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
//     { 
//         _id: '5dc2a93d75b9e91424ee9618',
//         name: "admin",
//         avatar: avatarTemp,
//         active: true,
//         status: 'nonactivated',
//         class: 'rogue',
//         sex: 'man',
//         experience: 0,
//         attributes: {
//             strength: 2,
//             dexternity: 2,
//             magic: 2,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "A aB",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'warrior',
//         sex: 'man',
//         experience: 2000,
//         attributes: {
//             strength: 6,
//             dexternity: 3,
//             magic: 3,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
 
//     { 
//         _id: uuid(),
//         name: "Ccdsc",
//         avatar: avatarTemp,
//         active: true,
//         status: 'away',
//         class: 'mage',
//         sex: 'woman',
//         experience: 1000,
//         attributes: {
//             strength: 2,
//             dexternity: 3,
//             magic: 5,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 4,
//             amuletCounters: [
//                 {
//                     counter: 2,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 3,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Dede f",
//         avatar: avatarTemp,
//         active: true,
//         status: 'banned',
//         class: 'cleric',
//         sex: 'woman',
//         experience: 1500,
//         attributes: {
//             strength: 2,
//             dexternity: 3,
//             magic: 3,
//             endrunace: 4,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 3,
//             amuletCounters: [
//                 {
//                     counter: 1,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 4,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Ghis",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'rogue',
//         sex: 'man',
//         experience: 3000,
//         attributes: {
//             strength: 6,
//             dexternity: 3,
//             magic: 1,
//             endrunace: 4,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "KorwinKorwinaa",
//         avatar: avatarTemp,
//         active: true,
//         status: 'home',
//         class: 'mage',
//         sex: 'man',
//         experience: 140000,
//         attributes: {
//             strength: 10,
//             dexternity: 8,
//             magic: 10,
//             endrunace: 9,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 46,
//             amuletCounters: [
//                 {
//                     counter: 9,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'diamond',
//                         description: 'Najlepszy przyjaciel dziewczyny',
//                         type: 'amulet',
//                         imgSrc: 'diamond-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 11,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'pearl',
//                         description: 'Perła prosto z małży, znaczy z lodówki',
//                         type: 'amulet',
//                         imgSrc: 'pearl-amulet.png',
//                     }
//                 },
//                 {
//                     counter: 23,
//                     amulet: {
//                         _id: uuid(),
//                         name: 'saphhire',
//                         description: 'Fajny jest',
//                         type: 'amulet',
//                         imgSrc: 'sapphire-pearl.png',
//                     }
//                 },

//             ]
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "Nndsn",
//         avatar: avatarTemp,
//         active: true,
//         status: 'nonactivated',
//         class: 'rogue',
//         sex: 'man',
//         experience: 0,
//         attributes: {
//             strength: 2,
//             dexternity: 2,
//             magic: 2,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
//     { 
//         _id: uuid(),
//         name: "ziom",
//         avatar: avatarTemp,
//         active: true,
//         status: 'nonactivated',
//         class: 'rogue',
//         sex: 'man',
//         experience: 0,
//         attributes: {
//             strength: 2,
//             dexternity: 2,
//             magic: 2,
//             endrunace: 2,
//         },
//         bag: [],
//         equipped: {},
//         loyal: [],
//         party: {},
//         statistics: {
//             missionCounter: 0,
//             amuletCounters: []
//         }      
//     },
    
//   ];