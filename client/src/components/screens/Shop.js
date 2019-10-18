import React from "react";
import styled from "styled-components";

import { ScrollingProvider, Section } from "react-scroll-section";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";


import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Snackbar from "@material-ui/core/Snackbar";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MenuItem from "./shop/MenuItem";

import ShopList from "./shop/ShopList";
import PlayerShopButtons from "./shop/PlayerShopButtons";
import BasketDrawer from "./shop/BasketDrawer";
import VerificationPage from "./shop/VerificationPage";

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
    id: 1,
    category: "shot",
    name: "Wóda",
    description: "nie mam weny",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 2,
    category: "shot",
    name: "Zryje",
    description: "na opisy",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 3,
    category: "shot",
    name: "Banie",
    description: "szotów",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 4,
    category: "shot",
    name: "BWóda",
    description: "nie mam weny",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 5,
    category: "shot",
    name: "BZryje",
    description: "na opisy",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 6,
    category: "shot",
    name: "BBanie",
    description: "szotów",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 7,
    category: "drink",
    name: "Modżajto",
    description: "dla mojej świni",
    price: 13.5,
    imgSrc: "drink.png"
  },
  {
    id: 8,
    name: "Cosmo",
    category: "drink",
    description: "lubisz, ale się nie przyznasz przed kolegami",
    price: 27.99,
    imgSrc: "drink.png"
  },
  {
    id: 9,
    name: "Eau d'penis",
    category: "drink",
    description: "wyciąg z fiuta Twoim drinkiem",
    price: 120.03,
    imgSrc: "drink.png"
  },
  {
    id: 10,
    name: "BModżajto",
    category: "drink",
    description: "dla mojej świni",
    price: 13.5,
    imgSrc: "drink.png"
  },
  {
    id: 11,
    name: "BCosmo",
    category: "drink",
    description: "lubisz, ale się nie przyznasz przed kolegami",
    price: 27.99,
    imgSrc: "drink.png"
  },
  {
    id: 12,
    name: "BEau d'penis",
    category: "drink",
    description: "wyciąg z fiuta Twoim drinkiem",
    price: 120.03,
    imgSrc: "drink.png"
  },
  {
    id: 13,
    category: "alcoholFree",
    name: "Soczek",
    description: "szluga?",
    price: 8.0,
    imgSrc: "drink.png"
  },
  {
    id: 14,
    category: "alcoholFree",
    name: "Piwo zero",
    description: ":(",
    price: 11.0,
    imgSrc: "drink.png"
  },
  {
    id: 15,
    category: "alcoholFree",
    name: "Herba",
    description: "srogi czaj",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 16,
    category: "alcoholFree",
    name: "BSoczek",
    description: "szluga?",
    price: 8.0,
    imgSrc: "drink.png"
  },
  {
    id: 17,
    category: "alcoholFree",
    name: "BPiwo zero",
    description: ":(",
    price: 11.0,
    imgSrc: "drink.png"
  },
  {
    id: 18,
    category: "alcoholFree",
    name: "BHerba",
    description: "srogi czaj",
    price: 7.0,
    imgSrc: "drink.png"
  },
  {
    id: 19,
    category: "food",
    name: "Tosty",
    description: "z serem",
    price: 10.0,
    imgSrc: "drink.png"
  },
  {
    id: 20,
    category: "food",
    name: "Orzeszki",
    description: "ziemne",
    price: 6.0,
    imgSrc: "drink.png"
  },
  {
    id: 21,
    category: "food",
    name: "Naczosy hehe",
    description: "xddxdx",
    price: 25.0,
    imgSrc: "drink.png"
  },
  {
    id: 22,
    category: "food",
    name: "BTosty",
    description: "z serem",
    price: 10.0,
    imgSrc: "drink.png"
  },
  {
    id: 23,
    category: "food",
    name: "BOrzeszki",
    description: "ziemne",
    price: 6.0,
    imgSrc: "drink.png"
  },
  {
    id: 24,
    category: "food",
    name: "BNaczosy hehe",
    description: "xddxdx",
    price: 25.0,
    imgSrc: "drink.png"
  }
];

//get avatar from db
const mockUsers = [
  {
    id: 1,
    name: "Ancymon Bobrzyn",
    avatar: "avatar.png"
  },
  {
    id: 2,
    name: "Cecylia Dedoles",
    avatar: "avatar.png"
  },
  {
    id: 3,
    name: "Ewelina",
    avatar: ""
  },
  {
    id: 4,
    name: "Fristajler",
    avatar: "avatar.png"
  },
  {
    id: 5,
    name: "Grzegorz Herbatnik",
    avatar: ""
  },
  {
    id: 6,
    name: "I",
    avatar: "avatar.png"
  },
  {
    id: 7,
    name: "Justyna Kowalczyk",
    avatar: "avatar.png"
  },
  {
    id: 8,
    name: "Lol Łoś",
    avatar: "avatar.png"
  }
];

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuTopOffset: 0,
      menuSticky: false,
      baskets: {},
      snackbarOpen: false,
      activeUser: 1,
      basketDrawerOpen: false,
      showVerificationPage: false
    };
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    let menuTopOffset = this.menuRef.current.offsetTop;
    this.setState({ menuTopOffset }, () => {
      window.addEventListener("scroll", this.handleScrollPosition);
    });

    //backend call for players in party
    const baskets = {};
    mockUsers.forEach(player => {
      baskets[player.id] = [];
    });

    this.setState({ baskets });

    return () => {
      window.removeEventListener("scroll", this.handleScrollPosition);
    };
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
      product => product.id === id
    );
    if (idOfProductAlreadyInBasket !== -1) {
      baskets[this.state.activeUser][idOfProductAlreadyInBasket].quantity += 1;
    } else {
      baskets[this.state.activeUser].push({
        ...mockShop.find(product => product.id === id),
        quantity: 1
      });
    }

    this.setState({ baskets, snackbarOpen: true });
  };

  handleRemoveItemFromCart = id => {
    const baskets = { ...this.state.baskets };
    const idOfProductInBasket = baskets[this.state.activeUser].findIndex(
      product => product.id === id
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
    this.setState({ activeUser: id });
  };

  handleToggleBasketDrawer = () => {
    this.setState(prevState => {
      return { basketDrawerOpen: !prevState.basketDrawerOpen };
    });
  };

  handleFinalizeOrder = () => {
    console.log(this.state.baskets);
    this.setState({ showVerificationPage: true });
  };

  render() {
    const shotList = mockShop.filter(product => {
      return product.category === "shot";
    });

    const drinkList = mockShop.filter(product => {
      return product.category === "drink";
    });

    const alcoholFreeList = mockShop.filter(product => {
      return product.category === "alcoholFree";
    });

    const foodList = mockShop.filter(product => {
      return product.category === "food";
    });

    return (
      <div>
        {this.state.showVerificationPage ? (
          <VerificationPage />
        ) : (
          <ScrollingProvider>
            <PlayerShopButtons
              users={mockUsers}
              activeUser={this.state.activeUser}
              handleChipClick={this.handleChangeactiveUser}
            />
            <Menu
              square
              sticky={this.state.menuSticky ? 1 : 0}
              ref={this.menuRef}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={3}>
                  <MenuItem section="shots">Szoty</MenuItem>
                </Grid>
                <Grid item xs={3}>
                  <MenuItem section="drinks">Driny</MenuItem>
                </Grid>
                <Grid item xs={3}>
                  <MenuItem section="alco-free">Bez promili</MenuItem>
                </Grid>
                <Grid item xs={3}>
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
                      <span>
                        Dodano{" "}
                        {
                          this.state.baskets[this.state.activeUser][
                            this.state.baskets[this.state.activeUser].length - 1
                          ].title
                        }{" "}
                        do koszyka{" "}
                        {
                          mockUsers.find(
                            mockUser => mockUser.id === this.state.activeUser
                          ).name
                        }
                      </span>
                    }
                  />
                </React.Fragment>
              )}
            <FloatingCart
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
              mockUsers={mockUsers}
              activeUser={this.state.activeUser}
              handleRemoveItem={this.handleRemoveItemFromCart}
              finalizeOrder={this.handleFinalizeOrder}
            />
          </ScrollingProvider>
        )}
      </div>
    );
  }
}

export default Shop;
