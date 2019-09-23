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
    { id: 1, title: "Wóda", description: "nie mam weny", price: "7", icon: "" },
    { id: 2, title: "Zryje", description: "na opisy", price: "7", icon: "" },
    { id: 3, title: "Banie", description: "szotów", price: "7", icon: "" },
    {
      id: 4,
      title: "BWóda",
      description: "nie mam weny",
      price: "7",
      icon: ""
    },
    { id: 5, title: "BZryje", description: "na opisy", price: "7", icon: "" },
    { id: 6, title: "BBanie", description: "szotów", price: "7", icon: "" }
  ],
  drinks: [
    {
      id: 7,
      title: "Modżajto",
      description: "dla mojej świni",
      price: "13",
      icon: ""
    },
    {
      id: 8,
      title: "Cosmo",
      description: "lubisz, ale się nie przyznasz przed kolegami",
      price: "27",
      icon: ""
    },
    {
      id: 9,
      title: "Eau d'penis",
      description: "wyciąg z fiuta Twoim drinkiem",
      price: "120",
      icon: ""
    },
    {
      id: 10,
      title: "BModżajto",
      description: "dla mojej świni",
      price: "13",
      icon: ""
    },
    {
      id: 11,
      title: "BCosmo",
      description: "lubisz, ale się nie przyznasz przed kolegami",
      price: "27",
      icon: ""
    },
    {
      id: 12,
      title: "BEau d'penis",
      description: "wyciąg z fiuta Twoim drinkiem",
      price: "120",
      icon: ""
    }
  ],
  noAlcohol: [
    { id: 13, title: "Soczek", description: "szluga?", price: "8", icon: "" },
    { id: 14, title: "Piwo zero", description: ":(", price: "11", icon: "" },
    { id: 15, title: "Herba", description: "srogi czaj", price: "7", icon: "" },
    { id: 16, title: "BSoczek", description: "szluga?", price: "8", icon: "" },
    { id: 17, title: "BPiwo zero", description: ":(", price: "11", icon: "" },
    { id: 18, title: "BHerba", description: "srogi czaj", price: "7", icon: "" }
  ],
  food: [
    { id: 19, title: "Tosty", description: "z serem", price: "10", icon: "" },
    { id: 20, title: "Orzeszki", description: "ziemne", price: "6", icon: "" },
    {
      id: 21,
      title: "Naczosy hehe",
      description: "xddxdx",
      price: "25",
      icon: ""
    },
    { id: 22, title: "BTosty", description: "z serem", price: "10", icon: "" },
    { id: 23, title: "BOrzeszki", description: "ziemne", price: "6", icon: "" },
    {
      id: 24,
      title: "BNaczosy hehe",
      description: "xddxdx",
      price: "25",
      icon: ""
    }
  ]
};

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuTopOffset: 0,
      menuSticky: false,
      basket: [],
      snackbarOpen: false
    };
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    let menuTopOffset = this.menuRef.current.offsetTop;
    this.setState({ menuTopOffset }, () => {
      window.addEventListener("scroll", this.handleScrollPosition);
    });
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
    const basket = [...this.state.basket];
    basket.push(id);
    this.setState({ basket, snackbarOpen: true });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  render() {
    return (
      <ScrollingProvider>
        <Menu square sticky={this.state.menuSticky} ref={this.menuRef}>
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
        <ListContainer sticky={this.state.menuSticky}>
          <StyledSection id="shots">
            <List>
              <ListItem>
                <Typography variant="h5">Szoty</Typography>
              </ListItem>
              {mockShop.shots.map(item => {
                return (
                  <ShopListItem
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    icon={item.icon}
                    id={item.id}
                    handleAddItem={this.handleAddItemToCart}
                  />
                );
              })}
            </List>
          </StyledSection>
          <Divider />
          <StyledSection id="drinks">
            <List>
              <ListItem>
                <Typography variant="h5">Driny</Typography>
              </ListItem>
              {mockShop.drinks.map(item => {
                return (
                  <ShopListItem
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    icon={item.icon}
                    id={item.id}
                    handleAddItem={this.handleAddItemToCart}
                  />
                );
              })}
            </List>
          </StyledSection>
          <Divider />
          <StyledSection id="alco-free">
            <List>
              <ListItem>
                <Typography variant="h5">Bez promili</Typography>
              </ListItem>
              {mockShop.noAlcohol.map(item => {
                return (
                  <ShopListItem
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    icon={item.icon}
                    id={item.id}
                    handleAddItem={this.handleAddItemToCart}
                  />
                );
              })}
            </List>
          </StyledSection>
          <Divider />
          <StyledSection id="food">
            <List>
              <ListItem>
                <Typography variant="h5">Jedzenie</Typography>
              </ListItem>
              {mockShop.food.map(item => {
                return (
                  <ShopListItem
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    icon={item.icon}
                    id={item.id}
                    handleAddItem={this.handleAddItemToCart}
                  />
                );
              })}
            </List>
          </StyledSection>
          <Divider />
        </ListContainer>

        <FloatingCart variant="contained" color="primary">
          <Badge color="secondary" badgeContent={this.state.basket.length}>
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
          autoHideDuration={2000}
          message={<span>Dodano #{this.state.basket[this.state.basket.length-1]} do koszyka</span>}
        />
      </ScrollingProvider>
    );
  }
}

export default Shop;
