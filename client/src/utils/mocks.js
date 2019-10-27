import uuid from 'uuid/v1'

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
      
export const mockItems = [
    {
        _id: uuid(),
        owner: 11111,
        itemModel: {
            _id: uuid(),
            type: "amulet",
            name: "Diament",
            fluff: "Najlepszy przyjaciel dziewyczyny",
            imgSrc: "diamond-amulet.png"
        }
    },
    {
        
        _id: uuid(),
        owner: 11111,
        itemModel: {
            _id: uuid(),
            type: "weapon",
            name: "Krótki miecz",
            fluff: "Przynajmniej nie masz kompleksów",
            imgSrc: "short-sword.png"
        }
        
    },
    {
        
        _id: uuid(),
        owner: 11111,
        equipped: false,
        itemModel: {
            _id: uuid(),
            type: "weapon",
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
    {
        _id: uuid(),
        owner: 11111,
        itemModel: {
            _id: uuid(),
            type: "chest",
            name: "Skórzana kurta",
            fluff: "Lale za takimi szaleją",
            imgSrc: "leather-jerkin.png"
        }
    },
    {      
        _id: uuid(),
        owner: 11111,
        equipped: false,
        itemModel: {
            _id: uuid(),
            type:"legs",
            name: "Lniane spodnie",
            fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
            imgSrc: "linen-trousers.png"
        }
    },
    {
        
        _id: uuid(),
        owner: 11111,
        equipped: false,
        itemModel: {
            _id: uuid(),
            type: "feet",
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
    {
        _id: uuid(),
        owner: 11111,
        equipped: true,
        itemModel: {
            _id: uuid(),
            type: "head",
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
    {
        _id: uuid(),
        owner: 11111,
        equipped: true,
        itemModel: {
            _id: uuid(),
            type: "ring",
            name: "Pierścień siły",
            fluff: "Całuj mój sygnet potęgi",
            imgSrc: "strength-ring.png",
            perks: [
            {
                _id: 1,
                perkType: "disc-product",
                target: uuid(),
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
]

export const mockItemModels = [
    {
        _id: uuid(),
        type: "amulet",
        name: "Diament",
        class: null,
        description: "Najlepszy przyjaciel dziewyczyny",
        imgSrc: "diamond-amulet.png",
        perks: []
    },
    {
        _id: uuid(),
        type: "weapon",
        name: "Krótki miecz",
        class: null,
        description: "Przynajmniej nie masz kompleksów",
        imgSrc: "short-sword.png",
        perks: [],
    },
    {
        _id: uuid(),
        type: "weapon",
        name: "Wielki miecz",
        class: null,
        description: "Zdecydowanie masz kompleksy",
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
        
    },
    {
        _id: uuid(),
        type: "chest",
        name: "Skórzana kurta",
        class: null,
        description: "Lale za takimi szaleją",
        imgSrc: "leather-jerkin.png",
        perks: []
    },
    {      
        _id: uuid(),
        type:"legs",
        name: "Lniane spodnie",
        class: null,
        description: "Zwykłe spodnie, czego jeszcze chcesz?",
        imgSrc: "linen-trousers.png",
        perks: []
    },
    {
        
            _id: uuid(),
            type: "feet",
            name: "Wysokie buty",
            description: "Skórzane, wypastowane, lśniące",
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


    {
        
            _id: uuid(),
            type: "head",
            name: "Kaptur czarodzieja",
            class: null,
            description: "Kiedyś nosił go czarodziej. Już nie nosi.",
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
        
    },
    {
        
            _id: uuid(),
            type: "ring",
            name: "Pierścień siły",
            class: null,
            description: "Całuj mój sygnet potęgi",
            imgSrc: "strength-ring.png",
            perks: [
            {
                _id: 1,
                perkType: "disc-product",
                target: uuid(),
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
        
    },
]