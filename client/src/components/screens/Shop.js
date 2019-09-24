import React from "react";
import styled from "styled-components";

import { ScrollingProvider, SectionLink, Section } from "react-scroll-section";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Snackbar from "@material-ui/core/Snackbar";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MenuItem from "./Shop/MenuItem";
import ShopListItem from "./Shop/ShopListItem";
import ShopList from "./Shop/ShopList";
import PlayerShopButtons from "./Shop/PlayerShopButtons";
import BasketDrawer from "./Shop/BasketDrawer";

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

const mockShop = {
  shots: [
    {
      id: 1,
      title: "Wóda",
      description: "nie mam weny",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 2,
      title: "Zryje",
      description: "na opisy",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 3,
      title: "Banie",
      description: "szotów",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 4,
      title: "BWóda",
      description: "nie mam weny",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 5,
      title: "BZryje",
      description: "na opisy",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 6,
      title: "BBanie",
      description: "szotów",
      price: "7.00",
      icon: "drink.png"
    }
  ],
  drinks: [
    {
      id: 7,
      title: "Modżajto",
      description: "dla mojej świni",
      price: "13.50",
      icon: "drink.png"
    },
    {
      id: 8,
      title: "Cosmo",
      description: "lubisz, ale się nie przyznasz przed kolegami",
      price: "27.99",
      icon: "drink.png"
    },
    {
      id: 9,
      title: "Eau d'penis",
      description: "wyciąg z fiuta Twoim drinkiem",
      price: "120.03",
      icon: "drink.png"
    },
    {
      id: 10,
      title: "BModżajto",
      description: "dla mojej świni",
      price: "13.50",
      icon: "drink.png"
    },
    {
      id: 11,
      title: "BCosmo",
      description: "lubisz, ale się nie przyznasz przed kolegami",
      price: "27.99",
      icon: "drink.png"
    },
    {
      id: 12,
      title: "BEau d'penis",
      description: "wyciąg z fiuta Twoim drinkiem",
      price: "120.03",
      icon: "drink.png"
    }
  ],
  noAlcohol: [
    {
      id: 13,
      title: "Soczek",
      description: "szluga?",
      price: "8.00",
      icon: "drink.png"
    },
    {
      id: 14,
      title: "Piwo zero",
      description: ":(",
      price: "11.00",
      icon: "drink.png"
    },
    {
      id: 15,
      title: "Herba",
      description: "srogi czaj",
      price: "7.00",
      icon: "drink.png"
    },
    {
      id: 16,
      title: "BSoczek",
      description: "szluga?",
      price: "8.00",
      icon: "drink.png"
    },
    {
      id: 17,
      title: "BPiwo zero",
      description: ":(",
      price: "11.00",
      icon: "drink.png"
    },
    {
      id: 18,
      title: "BHerba",
      description: "srogi czaj",
      price: "7.00",
      icon: "drink.png"
    }
  ],
  food: [
    {
      id: 19,
      title: "Tosty",
      description: "z serem",
      price: "10.00",
      icon: "drink.png"
    },
    {
      id: 20,
      title: "Orzeszki",
      description: "ziemne",
      price: "6.00",
      icon: "drink.png"
    },
    {
      id: 21,
      title: "Naczosy hehe",
      description: "xddxdx",
      price: "25.00",
      icon: "drink.png"
    },
    {
      id: 22,
      title: "BTosty",
      description: "z serem",
      price: "10.00",
      icon: "drink.png"
    },
    {
      id: 23,
      title: "BOrzeszki",
      description: "ziemne",
      price: "6.00",
      icon: "drink.png"
    },
    {
      id: 24,
      title: "BNaczosy hehe",
      description: "xddxdx",
      price: "25.00",
      icon: "drink.png"
    }
  ]
};

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
      basketDrawerOpen: false
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
    console.log(baskets);
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
    baskets[this.state.activeUser].push(
      Object.values(mockShop).reduce((a, b) => a.concat(b)).find(mockItem => {
        return mockItem.id === id;
      })
    );
    this.setState({ baskets, snackbarOpen: true });
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

  render() {
    return (
      <ScrollingProvider>
        <PlayerShopButtons
          users={mockUsers}
          activeUser={this.state.activeUser}
          handleChipClick={this.handleChangeactiveUser}
        />
        <Menu square sticky={this.state.menuSticky ? 1 : 0} ref={this.menuRef}>
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
              list={mockShop.shots}
              handleAddItem={this.handleAddItemToCart}
            />
          </StyledSection>
          <Divider />
          <StyledSection id="drinks">
            <ShopList
              title="Driny"
              list={mockShop.drinks}
              handleAddItem={this.handleAddItemToCart}
            />
          </StyledSection>
          <Divider />
          <StyledSection id="alco-free">
            <ShopList
              title="Bez promili"
              list={mockShop.noAlcohol}
              handleAddItem={this.handleAddItemToCart}
            />
          </StyledSection>
          <Divider />
          <StyledSection id="food">
            <ShopList
              title="Jedzenie"
              list={mockShop.food}
              handleAddItem={this.handleAddItemToCart}
            />
          </StyledSection>
          <Divider />
        </ListContainer>
        {this.state.baskets[this.state.activeUser] && this.state.baskets[this.state.activeUser].length > 0 && (
          <React.Fragment>
            <FloatingCart variant="contained" color="primary" onClick={this.handleToggleBasketDrawer}>
              <Badge
                
                color="secondary"
                badgeContent={
                  this.state.baskets[this.state.activeUser].length
                }
              >
                <FloatingCartIcon />
              </Badge>
            </FloatingCart>


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
                  }
                  {" "}do koszyka {
                    mockUsers.find(mockUser => mockUser.id === this.state.activeUser).name
                  }
                </span>
              }
            />
            <BasketDrawer
              open={this.state.basketDrawerOpen}
              toggle={this.handleToggleBasketDrawer}
              baskets={this.state.baskets}
              mockUsers={mockUsers}
            />
          </React.Fragment>
        )}
      </ScrollingProvider>
    );
  }
}

export default Shop;
