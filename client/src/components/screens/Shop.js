import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Recaptcha from 'react-google-invisible-recaptcha';
import { ScrollingProvider, Section } from "react-scroll-section";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Snackbar from "@material-ui/core/Snackbar";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import MenuItem from "./shop/MenuItem";
import ShopList from "./shop/ShopList";
import PlayerShopButtons from "./shop/PlayerShopButtons";
import BasketDrawer from "./shop/BasketDrawer";
import VerificationPage from "./shop/VerificationPage";
import ScrollModal from "./shop/ScrollModal";
import ScrollListItem from "./shop/ScrollListItem";

import {
  getShop,
  activateOrder,
  leaveShop
} from "../../store/actions/shopActions";
import { toggleItem } from "../../store/actions/profileActions";

const Menu = styled(Paper)`
  flex-grow: 1;
  position: ${props => (props.sticky ? "fixed" : "static")};
  top: 0;
  width: 100%;
  z-index: 1;
  box-sizing: border-box;
  padding: 0.5rem;
`;

const ListContainer = styled.div`
  padding-top: ${props => (props.sticky ? "2.5rem" : "0px")};
`;

const StyledSection = styled(Section)`
  padding-top: 2rem;
`;

const FloatingCart = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 1rem;
  right: 1rem;
  background: #337de4;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  &:active {
    background: #88b5f5;
  }
`;

const FloatingCartIcon = styled(ShoppingCartIcon)`
  color: #fff;
  margin: 0.5rem;
`;

//To be replaced by db call
//Price is a string - JSON format returns strings - need to convert when fetching from db
const mockShop = [
  {
    _id: "1",
    category: "shot",
    name: "Wóda",
    description: "nie mam weny",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "2",
    category: "shot",
    name: "Zryje",
    description: "na opisy",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "3",
    category: "shot",
    name: "Banie",
    description: "szotów",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "4",
    category: "shot",
    name: "BWóda",
    description: "nie mam weny",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "5",
    category: "shot",
    name: "BZryje",
    description: "na opisy",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "6",
    category: "shot",
    name: "BBanie",
    description: "szotów",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "7",
    category: "drink",
    name: "Modżajto",
    description: "dla mojej świni",
    price: 13.5,
    experience: 135,
    imgSrc: "drink.png"
  },
  {
    _id: "8",
    name: "Cosmo",
    category: "drink",
    description: "lubisz, ale się nie przyznasz przed kolegami",
    price: 28.0,
    experience: 280,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 1,
        itemModel: {
          _id: 101,
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
    _id: "9",
    name: "Eau d'penis",
    category: "drink",
    description: "wyciąg z fiuta Twoim drinkiem",
    price: 120.03,
    experience: 1200,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 2,
        itemModel: {
          _id: 102,
          type: {
            _id: 1,
            type: "amulet"
          },
          name: "Perła",
          fluff: "Perła prosto z lodówki, znaczy z małży",
          imgSrc: "pearl-amulet.png"
        }
      }
    ]
  },
  {
    _id: "10",
    name: "BModżajto",
    category: "drink",
    description: "dla mojej świni",
    price: 13.5,
    experience: 135,
    imgSrc: "drink.png"
  },
  {
    _id: "11",
    name: "BCosmo",
    category: "drink",
    description: "lubisz, ale się nie przyznasz przed kolegami",
    price: 28.0,
    experience: 280,
    imgSrc: "drink.png"
  },
  {
    _id: "12",
    name: "BEau d'penis",
    category: "drink",
    description: "wyciąg z fiuta Twoim drinkiem",
    price: 120.03,
    experience: 1200,
    imgSrc: "drink.png"
  },
  {
    _id: "13",
    category: "alcoholFree",
    name: "Soczek",
    description: "szluga?",
    price: 8.0,
    experience: 80,
    imgSrc: "drink.png"
  },
  {
    _id: "14",
    category: "alcoholFree",
    name: "Piwo zero",
    description: ":(",
    price: 11.0,
    experience: 110,
    imgSrc: "drink.png"
  },
  {
    _id: "15",
    category: "alcoholFree",
    name: "Herba",
    description: "srogi czaj",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "16",
    category: "alcoholFree",
    name: "BSoczek",
    description: "szluga?",
    price: 8.0,
    experience: 80,
    imgSrc: "drink.png"
  },
  {
    _id: "17",
    category: "alcoholFree",
    name: "BPiwo zero",
    description: ":(",
    price: 11.0,
    experience: 110,
    imgSrc: "drink.png"
  },
  {
    _id: "18",
    category: "alcoholFree",
    name: "BHerba",
    description: "srogi czaj",
    price: 7.0,
    experience: 70,
    imgSrc: "drink.png"
  },
  {
    _id: "19",
    category: "food",
    name: "Tosty",
    description: "z serem",
    price: 10.0,
    experience: 100,
    imgSrc: "drink.png"
  },
  {
    _id: "20",
    category: "food",
    name: "Orzeszki",
    description: "ziemne",
    price: 6.0,
    experience: 60,
    imgSrc: "drink.png"
  },
  {
    _id: "21",
    category: "food",
    name: "Naczosy hehe",
    description: "xddxdx",
    price: 25.0,
    experience: 250,
    imgSrc: "drink.png"
  },
  {
    _id: "22",
    category: "food",
    name: "BTosty",
    description: "z serem",
    price: 10.0,
    experience: 100,
    imgSrc: "drink.png"
  },
  {
    _id: "23",
    category: "food",
    name: "BOrzeszki",
    description: "ziemne",
    price: 6.0,
    experience: 60,
    imgSrc: "drink.png"
  },
  {
    _id: "24",
    category: "food",
    name: "BNaczosy hehe",
    description: "xddxdx",
    price: 25.0,
    experience: 250,
    imgSrc: "drink.png"
  },
  {
    _id: "25",
    category: "beer",
    name: "Kasztelan",
    description: "Pan na zamku",
    price: 12.0,
    experience: 120,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 1,
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
      }
    ]
  },
  {
    _id: "26",
    category: "beer",
    name: "Kormoran",
    description: "Pianka jakby ptak nasrał",
    price: 16.0,
    experience: 160,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 1,
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
      }
    ]
  },
  {
    _id: "27",
    category: "beer",
    name: "Koczkodan",
    description: "O to piwo proszą, jak zapomną o kormoranie",
    price: 11.0,
    experience: 110,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 1,
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
      }
    ]
  },
  {
    _id: "28",
    category: "beer",
    name: "c Ipa",
    description: "Jesteś tym co pijesz",
    price: 15.0,
    experience: 150,
    imgSrc: "drink.png",
    awards: [
      {
        quantity: 1,
        itemModel: {
          _id: 600,
          type: {
            __id: 6,
            type: "torpedo"
          },
          name: "D1",
          fluff: "Ostrzelaj pole D1!",
          imgSrc: "torpedo.png"
        }
      }
    ]
  }
];

//get avatar from db
const mockUsers = [
  {
    _id: 1,
    name: "Ancymon Bobrzyn",
    avatar: "avatar.png",
    productModifiers: {
      "1": { experienceMod: 21 },
      "2": { experienceMod: 40 },
      "3": { experienceMod: 82 },
      "4": { priceMod: -0.6, experienceMod: 18 },
      "5": { experienceMod: 36 }
    },
    bag: [
      {
        _id: 1,
        owner: 11111,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój małej zniżki na Wóde",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "disc-product",
              target: "1",
              value: "-5%",
              time: []
            }
          ]
        }
      }
    ],
    equipped: { scroll: "" }
  },
  {
    _id: 2,
    name: "Cecylia Dedoles",
    avatar: "avatar.png",
    productModifiers: {
      "1": { priceMod: -1 },
      "2": { priceMod: -1 },
      "3": { priceMod: -1 },
      "4": { priceMod: -1 },
      "5": { priceMod: -1 }
    },
    bag: [
      {
        _id: 2,
        owner: 222222,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój zniżki na szoty",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "disc-category",
              target: "shots",
              value: "-10%",
              time: []
            }
          ]
        }
      },
      {
        _id: 3,
        owner: 222222,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój ogromnej zniżki na Zryje",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "disc-product",
              target: "2",
              value: "-3",
              time: []
            }
          ]
        }
      }
    ],
    equipped: { scroll: "" }
  },
  {
    _id: 3,
    name: "Ewelina",
    avatar: "",
    bag: [],
    equipped: { scroll: "" }
  },
  {
    _id: 4,
    name: "Fristajler",
    avatar: "avatar.png",
    bag: [
      {
        _id: 4,
        owner: 333333,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój zniżki na driny",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "disc-category",
              target: "drinks",
              value: "-10%",
              time: []
            }
          ]
        }
      },
      {
        _id: 5,
        owner: 333333,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój ogromnej zniżki na driny",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "disc-category",
              target: "drinks",
              value: "-3",
              time: []
            }
          ]
        }
      },
      {
        _id: 7,
        owner: 333333,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój konkretnego doświadczenia",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "experience",
              target: undefined,
              value: "+100",
              time: []
            }
          ]
        }
      }
    ],
    equipped: { scroll: "" }
  },
  {
    _id: 5,
    name: "Grzegorz Herbatnik",
    avatar: "",
    bag: [
      {
        _id: 6,
        owner: 333333,
        itemModel: {
          _id: 801,
          type: {
            _id: 8,
            type: "scroll"
          },
          name: "Zwój małego doświadczenia",
          fluff: "Opis swoju",
          imgSrc: "scroll.png",
          perks: [
            {
              perkType: "experience",
              target: undefined,
              value: "+10%",
              time: []
            }
          ]
        }
      }
    ],
    equipped: { scroll: "" }
  },
  {
    _id: 6,
    name: "I",
    avatar: "avatar.png",
    bag: [],
    equipped: { scroll: "" }
  },
  {
    _id: 7,
    name: "Justyna Kowalczyk",
    avatar: "avatar.png",
    bag: [],
    equipped: { scroll: "" }
  },
  {
    _id: 8,
    name: "Lol Łoś",
    avatar: "avatar.png",
    bag: [],
    equipped: { scroll: "" }
  }
];

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      products: [],
      menuTopOffset: 0,
      menuSticky: false,
      baskets: {},
      snackbarOpen: false,
      activeUser: null,
      basketDrawerOpen: false,
      //showVerificationPage: false,
      showScrollModal: false
    };
    this.menuRef = React.createRef();
  }

  backToEvents = (history) => {
    history.push({
      pathname: '/',
      state: {indexRedirect: 0}
    }) 
  }

  handleBack = () => {
    this.backToEvents(this.props.history)
  }


  async componentDidMount() {

    if(!this.props.location.state || (this.props.location.state.id === undefined)){
      this.handleBack()
      return
    }

    const leader = !this.props.party.length || (this.props.party[0]._id === this.props.auth.uid)

    if(!leader){
      this.handleBack()
    }

    let menuTopOffset = this.menuRef.current && this.menuRef.current.offsetTop;
    this.setState({ menuTopOffset }, () => {
      window.addEventListener("scroll", this.handleScrollPosition);
    });

    await this.props.onGetShop();

    //backend call for players in party
    //await this.props.onUpdateParty();
    const baskets = {};
    baskets[this.props.auth.uid] = [];
    if (this.props.party.length > 1) {
      this.props.party.forEach(player => {
        baskets[player._id] = [];
      });
    }

    this.setState({ baskets, products: [...this.props.products] }, () => {
      
    });

    this.handleChangeactiveUser(
      null,
      this.props.party.length > 0 && this.props.party[0]
        ? this.props.party[0]._id
        : this.props.auth.uid
    );


  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.party !== this.props.party && this.state.activeUser) {
      this.handleChangeactiveUser(null, this.state.activeUser);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollPosition);
  }

  handleScrollPosition = () => {
    if (window.pageYOffset >= this.state.menuTopOffset) {
      this.setState({ menuSticky: true });
    } else {
      this.setState({ menuSticky: false });
    }
  };

  handleAddItemToCart = (e, id) => {
    const baskets = { ...this.state.baskets };
    const idOfProductAlreadyInBasket = baskets[this.state.activeUser].findIndex(
      product => product._id === id
    );
    if (idOfProductAlreadyInBasket !== -1) {
      baskets[this.state.activeUser][idOfProductAlreadyInBasket].quantity += 1;
    } else {
      baskets[this.state.activeUser].push({
        ...this.state.products.find(product => product._id === id),
        quantity: 1
      });
    }

    this.setState({ baskets, snackbarOpen: true });
  };

  handleRemoveItemFromCart = id => {
    const baskets = { ...this.state.baskets };
    const idOfProductInBasket = baskets[this.state.activeUser].findIndex(
      product => product._id === id
    );
    if (baskets[this.state.activeUser][idOfProductInBasket].quantity > 1) {
      baskets[this.state.activeUser][idOfProductInBasket].quantity -= 1;
    } else {
      baskets[this.state.activeUser].splice(idOfProductInBasket, 1);
    }
    this.setState({ baskets });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  handleChangeactiveUser = (e, id) => {
    //CALL BACKEND FOR PRODUCT MODIFIERS EACH TIME ACTIVE USER CHANGES
    this.setState({ activeUser: id }, () => {
      let products = [...this.props.products];
      console.log(products)
      products = products.map(product => {
        return {
          ...product,
          priceModified: false,
          experienceModified: false
        };
      });
      const activeUser =
        this.props.party.length > 0
          ? this.props.party.find(user => user._id === this.state.activeUser)
          : this.props.auth.profile;
      if (
        activeUser.hasOwnProperty("userPerks") &&
        Object.keys(activeUser.userPerks.products).length > 0
      ) {
        Object.keys(activeUser.userPerks.products).forEach(modifiedProduct => {
          const modifyIndex = products.findIndex(
            product => product._id === modifiedProduct
          );

          if (modifyIndex > -1) {
            if (
              activeUser.userPerks.products[modifiedProduct].hasOwnProperty(
                "experienceMod"
              )
            ) {
              const expMod = activeUser.userPerks.products[modifiedProduct].experienceMod;
              const exp = parseInt(activeUser.userPerks.products[modifiedProduct].experienceMod) + products[modifyIndex].price*10
              products[modifyIndex].experience = exp;
              if (expMod > 0) {
                products[modifyIndex].experienceModified =
                  expMod > 0 ? "#28a52e" : "#c10000";
              }
            }
            if (
              activeUser.userPerks.products[modifiedProduct].hasOwnProperty(
                "priceMod"
              )
            ) {
              products[modifyIndex].price +=
                activeUser.userPerks.products[modifiedProduct].priceMod;
              products[modifyIndex].priceModified =
                activeUser.userPerks.products[modifiedProduct].priceMod > 0
                  ? "#c10000"
                  : "#28a52e";
              if (products[modifyIndex].price < 0) {
                products[modifyIndex].price = 0.0;
              }
            }
          }
        });
      }
      this.setState({ products });
    });
  };

  handleToggleBasketDrawer = () => {
    this.setState(prevState => {
      return { basketDrawerOpen: !prevState.basketDrawerOpen };
    });
  };

  handleFinalizeOrder = async () => {
    //const tempBaskets = { ...this.state.baskets };
    // Object.keys(tempBaskets).forEach(owner => {
    //   if(tempBaskets[owner].length === 0){
    //     tempBaskets[owner].push(null)
    //   }
    // })
    if(Object.values(this.state.baskets).some(basket => basket.length > 0)){
      this.recaptcha.execute();
    }else{
      this.recaptcha.reset();
    }


    //this.setState({ showVerificationPage: true });
  };
  
  onCaptchaResolved =  () => {
    const token = this.recaptcha.getResponse()
     this.props.onActivateOrder(this.state.baskets, token);
    this.handleToggleBasketDrawer()
  }

  handleScrollModalToggle = () => {
    this.setState(prevState => {
      return { showScrollModal: !prevState.showScrollModal };
    });
  };

  handleScrollSelect = async (id) => {
    if (this.state.activeUser === this.props.auth.uid) {
      //Leader equip
      const tempPlayer = { ...this.props.auth.profile };
      tempPlayer.equipped.scroll =
        tempPlayer.equipped.scroll === id ? null : id;
      await this.props.onLeaderScrollToggle(id, "scroll", this.props.auth.profile.equipped);
    } else {
      //Party member equip

      const tempUsers = [...this.props.party];
      const activeUser = tempUsers.findIndex(
        user => user._id === this.state.activeUser
      );
      tempUsers[activeUser].equipped.scroll =
        tempUsers[activeUser].equipped.scroll === id ? null : id;
      //this.setState({ users: tempUsers });
      //TODO: call to backend for new productModifiers
      await this.props.onPartyMemberScrollToggle(
        id,
        "scroll",
        tempUsers[activeUser].equipped,
        this.state.activeUser
      );
    }
    this.handleChangeactiveUser(null, this.state.activeUser)
  };

  handleLeaveShop = async () => {
    await this.props.onLeaveShop();
    this.props.history.push("/");
  };

  render() {
    const shotList = this.state.products.filter(product => {
      return product.category === "shots";
    });

    const drinkList = this.state.products.filter(product => {
      return product.category === "drinks";
    });

    const beerList = this.state.products.filter(product => {
      return product.category === "beers";
    });

    const alcoholFreeList = this.state.products.filter(product => {
      return product.category === "alco-free";
    });

    const foodList = this.state.products.filter(product => {
      return product.category === "food";
    });

    const activeUser =
      this.state.activeUser &&
      this.props.party.length > 0 &&
      this.state.activeUser !== this.props.auth.uid
        ? this.props.party.find(user => user._id === this.state.activeUser)
        : this.props.auth.profile;

    let equippedScroll;
    if (activeUser.bag) {
      equippedScroll = activeUser.bag.find(
        item => item._id === activeUser.equipped.scroll
      );
    }
   
    return (
      <div>
        {this.props.activeOrder.length > 0 && this.state.activeUser ? (
          <VerificationPage user={this.props.auth} party={this.props.party} />
        ) : (
          <ScrollingProvider>
            <Button
              variant="contained"
              style={{ marginTop: "1rem" }}
              onClick={this.handleLeaveShop}
            >{`< Wyjście`}</Button>
            {this.props.party.length > 1 && (
              <PlayerShopButtons
                users={this.props.party}
                activeUser={this.state.activeUser}
                handleChipClick={this.handleChangeactiveUser}
              />
            )}
            {!activeUser.equipped.scroll && activeUser.bag.length > 0 ? (
              <Box>

              <Button
                style={{ margin: "1rem 0" }}
                variant="contained"
                color="primary"
                onClick={this.handleScrollModalToggle}
              >
                Dodaj zwój z ekwipunku
              </Button>
              </Box>
            ) : (
              activeUser.bag.length > 0 && (
                <Grid
                  container
                  alignItems="center"
                  style={{
                    width: "100%",
                    margin: "1rem 0",
                    padding: "0.4rem",
                    boxSizing: "border-box"
                  }}
                >
                  <Grid item xs={10}>
                    <ScrollListItem inactive scroll={equippedScroll} />
                  </Grid>
                  <Grid item>
                    <HighlightOffIcon
                      onClick={() =>
                        this.handleScrollSelect(equippedScroll._id)
                      }
                      style={{ fontSize: "3rem", color: "#be0000" }}
                    />
                  </Grid>
                </Grid>
              )
            )}

            <Menu
              square
              sticky={this.state.menuSticky ? 1 : 0}
              ref={this.menuRef}
            >
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <MenuItem section="shots">Szoty</MenuItem>
                </Grid>
                <Grid item>
                  <MenuItem section="drinks">Driny</MenuItem>
                </Grid>
                <Grid item>
                  <MenuItem section="beers">Piwa</MenuItem>
                </Grid>
                <Grid item>
                  <MenuItem section="alco-free">Bez promili</MenuItem>
                </Grid>
                <Grid item>
                  <MenuItem section="food">Jedzenie</MenuItem>
                </Grid>
              </Grid>
            </Menu>
            <ListContainer sticky={this.state.menuSticky ? 1 : 0}>
              <StyledSection id="shots">
                <ShopList
                  title="Szoty"
                  list={shotList}
                  handleAddItem={this.handleAddItemToCart}
                />
              </StyledSection>
              <Divider />
              <StyledSection id="drinks">
                <ShopList
                  title="Driny"
                  list={drinkList}
                  handleAddItem={this.handleAddItemToCart}
                />
              </StyledSection>
              <Divider />
              <StyledSection id="beers">
                <ShopList
                  title="Piwa"
                  list={beerList}
                  handleAddItem={this.handleAddItemToCart}
                />
              </StyledSection>
              <Divider />
              <StyledSection id="alco-free">
                <ShopList
                  title="Bez promili"
                  list={alcoholFreeList}
                  handleAddItem={this.handleAddItemToCart}
                />
              </StyledSection>
              <Divider />
              <StyledSection id="food">
                <ShopList
                  title="Jedzenie"
                  list={foodList}
                  handleAddItem={this.handleAddItemToCart}
                />
              </StyledSection>
              <Divider />
            </ListContainer>
            <div style={{marginTop: '3rem'}}></div>
            {this.state.baskets[this.state.activeUser] &&
              this.state.baskets[this.state.activeUser].length > 0 && (
                <React.Fragment>
                  <Snackbar
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left"
                    }}
                    open={this.state.snackbarOpen}
                    onClose={this.handleSnackbarClose}
                    autoHideDuration={1000}
                    message={
                      this.props.party.length > 0 ? (
                        <span>
                          Dodano{" "}
                          {
                            this.state.baskets[this.state.activeUser][
                              this.state.baskets[this.state.activeUser].length -
                                1
                            ].name
                          }{" "}
                          do koszyka {activeUser.name}
                        </span>
                      ) : (
                        <span>
                          Dodano{" "}
                          {
                            this.state.baskets[this.state.activeUser][
                              this.state.baskets[this.state.activeUser].length -
                                1
                            ].name
                          }{" "}
                          do Twojego koszyka
                        </span>
                      )
                    }
                  />
                </React.Fragment>
              )}
            <FloatingCart
            style={{visibility: this.state.basketDrawerOpen ? 'hidden':'visible'}}
              variant="contained"
              color="primary"
              onClick={this.handleToggleBasketDrawer}
            >
              {this.state.baskets[this.state.activeUser] && (
                <Badge
                  style={{ right: "-2.5rem", top: "-1rem" }}
                  color="secondary"
                  badgeContent={this.state.baskets[
                    this.state.activeUser
                  ].reduce((a, b) => a + (b.quantity || 0), 0)}
                />
              )}
              <FloatingCartIcon />
            </FloatingCart>
            <BasketDrawer
              open={this.state.basketDrawerOpen}
              toggle={this.handleToggleBasketDrawer}
              baskets={this.state.baskets}
              users={
                this.props.party.length > 1
                  ? this.props.party
                  : [this.props.auth.profile]
              }
              activeUser={this.state.activeUser}
              handleRemoveItem={this.handleRemoveItemFromCart}
              finalizeOrder={this.handleFinalizeOrder}
              leader={this.props.leader}
            >                     <Recaptcha
            style={{visibility: this.state.basketDrawerOpen ? 'visible':'hidden'}}
            badge={'bottomleft'}
         ref={ ref => this.recaptcha = ref }
         sitekey="6Ldy0ssUAAAAAKSZNuXULGv4U1PBI35BbvbWhT9x"
         onResolved={ this.onCaptchaResolved }
     /></BasketDrawer>
          </ScrollingProvider>
        )}
        
        <ScrollModal
          open={this.state.showScrollModal}
          handleClose={this.handleScrollModalToggle}
          scrolls={activeUser.bag.filter(
            item => item.itemModel.type === "scroll"
          )}
          equippedScrollId={activeUser.equipped.scroll}
          handleScrollSelect={this.handleScrollSelect}
        />

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    activeOrder: state.auth.profile.activeOrder,
    products: state.shop.products,
    party: state.party.leader
      ? [{ ...state.auth.profile, _id: state.auth.uid }, ...state.party.members]
      : [],
    leader: state.auth.uid
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetShop: () => dispatch(getShop()),
    onActivateOrder: (baskets, token) => dispatch(activateOrder(baskets, token)),
    onLeaveShop: () => dispatch(leaveShop()),
    onLeaderScrollToggle: (id, category, equipped) => dispatch(toggleItem(id, category, equipped, false)),
    onPartyMemberScrollToggle: (id, category, equipped, memberId) => dispatch(toggleItem(id, category, equipped, memberId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
