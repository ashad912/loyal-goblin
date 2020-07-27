import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Recaptcha from "react-google-invisible-recaptcha";
import { ScrollingProvider, Section, SectionLink } from "react-scroll-section";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Snackbar from "@material-ui/core/Snackbar";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import { socket } from 'socket'

import MenuGridItem from "./MenuGridItem";
import ShopList from "./ShopList";
import PlayerShopButtons from "./PlayerShopButtons";
import BasketDrawer from "./BasketDrawer";
import ShopVerification from "./ShopVerification";
import ScrollModal from "./ScrollModal";
import ScrollListItem from "./ScrollListItem";

import {
  getShop,
  activateOrder,
  leaveShop
} from "store/actions/shopActions";
import { toggleItem } from "store/actions/profileActions";

import { uiPaths } from "utils/constants";
import { Container } from "@material-ui/core";


const Menu = styled(Paper)`
  flex-grow: 1;
  position: sticky;
  top: ${props => props.offset}px;
  width: 100%;
  z-index: 1;
  box-sizing: border-box;
  padding: 0.5rem;
  transition: top 0.4s linear;
`;

const ListContainer = styled.div`
`;

const StyledSection = styled.section`
  padding: 1rem 0;
`;

const FloatingCart = styled.div`
  z-index: 2;
  margin: 0 1rem;
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




class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();

    this.shotsRef = React.createRef()
    this.drinksRef = React.createRef()
    this.beersRef = React.createRef()
    this.foodRef = React.createRef()
    this.alcoFreeRef = React.createRef()
    this.othersRef = React.createRef()

    this.state = {
      
      users: [],
      products: [],
      menuTopOffset: 0,
      
      menuSticky: false,
      offsetEnable: false, 
      snackbarOpen: false,
      baskets: this.initBaskets(),
      activeUser: null,
      basketDrawerOpen: false,
      
      showScrollModal: false
    }

  }

  initBaskets = () => {
    const baskets = {};
    baskets[this.props.auth.uid] = [];
    if (this.props.party.length > 1) {
      this.props.party.forEach(player => {
        baskets[player._id] = [];
      });
    }
    return baskets
  }

  backToProfile = history => {
    history.replace({
      pathname: "/",
      state: { indexRedirect: 0 }
    });
  };

  pushToProfile = history => {
    history.push({
      pathname: "/",
      state: { indexRedirect: 0 }
    });
  }

  handleBack = (withStack) => {
    window.removeEventListener("scroll", this.handleScrollPosition);
    if (withStack) {
      this.pushToProfile(this.props.history)
    } else {
      this.backToProfile(this.props.history);
    }
  };

  handleLeaveShop = async () => {
    if (this.props.party && this.props.party.length) {
      await this.props.onLeaveShop();
    }
    this.handleBack(true)
  };

  async componentDidMount() {

    if (
      !this.props.location.state ||
      this.props.location.state.id === undefined
    ) {
      console.log('No state!')
      this.handleBack();
      return;
    }

    const leader =
      !this.props.party.length ||
      this.props.party[0]._id === this.props.auth.uid;

    if (!leader) {
      this.handleBack();
      return;
    }

    const socketConnectionStatus = socket.connected
    try {
      await this.props.onGetShop(socketConnectionStatus);

      

      //backend call for players in party
      //await this.props.onUpdateParty();


      // this.setState({
      //   products: [...products],
      // }, () => {
      //   window.addEventListener("scroll", this.handleScrollPosition);
      // });

      this.handleChangeActiveUser(
        null,
        this.props.party.length > 0 && this.props.party[0]
          ? this.props.party[0]._id
          : this.props.auth.uid, 
          (state) => {
            let menuTopOffset = this.menuRef.current && this.menuRef.current.offsetTop;

            this.setState({
              ...state,
              menuTopOffset,
              navbarHeight: this.props.layout.navbarHeight,
              fullHeightCorrection: this.props.layout.navbarHeight + this.props.layout.footerHeight,
            }, () => {
              window.addEventListener("scroll", this.handleScrollPosition);
            })
          }
      );

    } catch (e) {
      this.handleBack()
      return;
    }


    
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.party !== this.props.party && this.state.activeUser) {
      if (prevProps.party.length !== this.props.party.length) {
        console.log(prevProps.party, this.props.party);
        const tempBaskets = { ...this.state.baskets };
        Object.keys(tempBaskets).filter(basket => {
          if (
            this.props.party.findIndex(member => member._id === basket) === -1
          ) {
            delete tempBaskets[basket];
          }
        });
        this.setState({ baskets: tempBaskets });

        this.handleChangeActiveUser(
          null,
          this.props.party.length > 0 && this.props.party[0]
            ? this.props.party[0]._id
            : this.props.auth.uid
        );
      } else {
        this.handleChangeActiveUser(null, this.state.activeUser);
      }
    }
    if (prevState.activeUser !== this.state.activeUser) {
      let menuTopOffset =
        this.menuRef.current && this.menuRef.current.offsetTop;
      this.setState({ menuTopOffset });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollPosition);
  }

  handleScrollPosition = () => {
    if ((window.pageYOffset >= (/*this.state.menuTopOffset +*/ this.state.navbarHeight))) {
      this.setState({ menuSticky: true, lastScroll: window.pageYOffset, offsetEnable: window.pageYOffset < this.state.lastScroll });
    } else {
      this.setState({ menuSticky: false, lastScroll: window.pageYOffset, offsetEnable: window.pageYOffset < this.state.lastScroll });
    }

  };

  handleAddItemToCart = (e, id, firstDiscount) => {
    const baskets = { ...this.state.baskets };
    const productAlreadyInBasket = baskets[this.state.activeUser].find(
      product => product._id === id && product.firstDiscount === firstDiscount
    );
    if (productAlreadyInBasket && !productAlreadyInBasket.firstDiscount) {
      productAlreadyInBasket.quantity += 1;
    } else {
      baskets[this.state.activeUser].push({
        ...this.state.products.find(product => product._id === id),
        quantity: 1,
        firstDiscount
      });
    }

    this.setState({ baskets, snackbarOpen: true }, () => {
      if (firstDiscount) {
        this.handleChangeActiveUser(null, this.state.activeUser)
      }
    });
  };

  handleRemoveItemFromCart = (id, firstDiscount) => {
    const baskets = { ...this.state.baskets };
    const idOfProductInBasket = baskets[this.state.activeUser].findIndex(
      product => product._id === id && product.firstDiscount === firstDiscount
    );
    if (idOfProductInBasket > -1) {
      const productInBasket = baskets[this.state.activeUser][idOfProductInBasket]

      const productInBasketWasFirstDiscount = productInBasket.firstDiscount
      if (productInBasket.quantity > 1) {
        productInBasket.quantity -= 1;
      } else {
        //baskets[this.state.activeUser] = baskets[this.state.activeUser].filter(product => product._id !== id && product.firstDiscount === firstDiscount)
        baskets[this.state.activeUser].splice(idOfProductInBasket, 1)
      }
      this.setState({ baskets }, () => {
        if (firstDiscount || productInBasketWasFirstDiscount) {
          this.handleChangeActiveUser(null, this.state.activeUser)
        }
      });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  handleChangeActiveUser = (e, id, callback) => {
    //CALL BACKEND FOR PRODUCT MODIFIERS EACH TIME ACTIVE USER CHANGES
    //this.setState({ activeUser: id }, () => {
    let products = [...this.props.products];
    // console.log(products);
    products = products.map(product => {
      return {
        ...product,
        priceModified: false,
        experienceModified: false
      };
    });
    const activeUser =
      this.props.party.length > 0
        ? this.props.party.find(user => user._id === id)
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
            const expMod =
              activeUser.userPerks.products[modifiedProduct].experienceMod;
            const exp =
              parseInt(
                activeUser.userPerks.products[modifiedProduct].experienceMod
              ) +
              products[modifyIndex].price * 10;
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
            //Show price in green color when lowered if any priceMod present
            products[modifyIndex].priceModified = false
            products[modifyIndex].firstDiscount = false


            //Apply first priceMod discount from scroll
            if (activeUser.equipped.scroll && activeUser.userPerks.products[modifiedProduct].priceMod.hasOwnProperty('first') && activeUser.userPerks.products[modifiedProduct].priceMod.first < 0) {
              //console.log(activeUser.userPerks.products[modifiedProduct].priceMod.first)
              if (this.state.baskets[id]) {

                const productInBasket = this.state.baskets[id].find(basketProduct => basketProduct._id === modifiedProduct && basketProduct.quantity > 0 && basketProduct.firstDiscount)
                if (!productInBasket) {
                  products[modifyIndex].price += activeUser.userPerks.products[modifiedProduct].priceMod.first;
                  products[modifyIndex].firstDiscount = true
                  products[modifyIndex].priceModified = "#28a52e"
                } else {
                  products[modifyIndex].priceModified = false
                }
              }

            }



            //Apply standard priceMod discount
            if (activeUser.userPerks.products[modifiedProduct].priceMod.hasOwnProperty('standard') && activeUser.userPerks.products[modifiedProduct].priceMod.standard < 0) {
              products[modifyIndex].price +=
                activeUser.userPerks.products[modifiedProduct].priceMod.standard;
              products[modifyIndex].priceModified = "#28a52e"
            }

            //Final check to disable negative price
            if (products[modifyIndex].price < 0) {
              products[modifyIndex].price = 0.0;
            }
          }
        }
      });
    }

    if(callback){
      callback({ products, activeUser: id })
    }else{
      this.setState({ products, activeUser: id });
    }
    
    //});

  };

  handleToggleBasketDrawer = (open) => {
    this.setState({ basketDrawerOpen: open })
  };

  handleFinalizeOrder = async () => {
    //const tempBaskets = { ...this.state.baskets };
    // Object.keys(tempBaskets).forEach(owner => {
    //   if(tempBaskets[owner].length === 0){
    //     tempBaskets[owner].push(null)
    //   }
    // })
    if (Object.values(this.state.baskets).some(basket => basket.length > 0)) {
      this.recaptcha.execute();
    } else {
      this.recaptcha.reset();
    }

    //this.setState({ showVerificationPage: true });
  };

  onCaptchaResolved = () => {
    const token = this.recaptcha.getResponse();
    this.props.onActivateOrder(this.state.baskets, token);
    this.handleToggleBasketDrawer(false);
  };

  handleScrollModalToggle = () => {
    this.setState(prevState => {
      return { showScrollModal: !prevState.showScrollModal };
    });
  };

  handleScrollSelect = async id => {
    if (this.state.activeUser === this.props.auth.uid) {
      //Leader equip
      const tempPlayer = { ...this.props.auth.profile };
      tempPlayer.equipped.scroll =
        tempPlayer.equipped.scroll === id ? null : id;
      await this.props.onLeaderScrollToggle(
        id,
        "scroll",
        this.props.auth.profile.equipped
      );
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
    this.handleChangeActiveUser(null, this.state.activeUser);
  };

  scrollToRef = (ref) => {

    const offset =
      window.pageYOffset > ref.current.offsetTop ?
        ref.current.offsetTop - (this.menuRef.current.clientHeight + this.state.navbarHeight) :
        ref.current.offsetTop - this.menuRef.current.clientHeight

    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
  }

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

    const othersList = this.state.products.filter(product => {
      return product.category === "others";
    });

    // const activeUser =
    //   this.state.activeUser &&
    //   this.props.party.length > 0 &&
    //   this.state.activeUser !== this.props.auth.uid
    //     ? this.props.party.find(user => user._id === this.state.activeUser)
    //     : this.props.auth.profile;

    let activeUser;
    if (this.state.activeUser) {
      if (this.props.party.length > 1) {
        if (this.state.activeUser !== this.props.auth.uid) {
          activeUser = this.props.party.find(
            user => user._id === this.state.activeUser
          );
        } else {
          activeUser = this.props.auth.profile;
        }
      } else {
        activeUser = this.props.auth.profile;
      }
    }

    let equippedScroll;
    if (activeUser && activeUser.bag) {
      equippedScroll = activeUser.bag.find(item => {
        if (typeof activeUser.equipped.scroll === 'string') {
          return item._id === activeUser.equipped.scroll
        } else if (typeof activeUser.equipped.scroll === 'object') {
          if (activeUser.equipped.scroll) {
            return item._id === activeUser.equipped.scroll._id
          }
        }
      }
      );
    }
    // console.log(this.state.activeUser,activeUser, this.props.party)
    if (activeUser) {
      return (
        <div role="application" style={{ minHeight: `calc(100vh - (${this.state.fullHeightCorrection}px)` }}>
          {this.props.activeOrder.length > 0 && this.state.activeUser ? (
            <Container maxWidth='xs' style={{ padding: 0 }}>
              <ShopVerification user={this.props.auth} party={this.props.party} />
            </Container>
          ) : (
              <ScrollingProvider>
                <Container maxWidth='xs' style={{ padding: 0 }}>

                  {this.props.party && this.props.party.length > 1 && (
                    <PlayerShopButtons
                      users={this.props.party}
                      activeUser={this.state.activeUser}
                      handleChipClick={this.handleChangeActiveUser}
                    />
                  )}
                  {!activeUser.equipped?.scroll && activeUser.bag.filter(item => item.itemModel.type === "scroll").length > 0 ? (
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
                      activeUser.bag.filter(item => item.itemModel.type === "scroll").length > 0 && (
                        <Grid
                          container

                          style={{
                            width: "100%",
                            margin: "1rem 0",
                            padding: "0.4rem",
                            boxSizing: "border-box"
                          }}
                        >
                          <Grid item xs={11}>
                            <ScrollListItem inactive scroll={equippedScroll} />
                          </Grid>
                          <Grid item xs={1} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                            <img src={uiPaths.deleteRed}
                              onClick={() =>
                                this.handleScrollSelect(equippedScroll._id)
                              }
                              style={{ width: "2rem", padding: '0.5rem' }}
                            />
                          </Grid>
                        </Grid>
                      )
                    )}
                </Container>
                <Menu
                  square
                  offset={this.state.offsetEnable ? this.state.navbarHeight : 0}
                  sticky={this.state.menuSticky ? 1 : 0}
                  ref={this.menuRef}
                >
                  <Container maxWidth='xs' style={{ padding: 0 }}>
                    <Grid
                      container
                      direction="row"
                      justify="space-around"
                      alignItems="center"
                      spacing={2}
                    >


                      <MenuGridItem onClick={() => this.scrollToRef(this.shotsRef)} section="shots">Szoty</MenuGridItem>
                      <MenuGridItem onClick={() => this.scrollToRef(this.drinksRef)} section="drinks">Drinki</MenuGridItem>
                      <MenuGridItem onClick={() => this.scrollToRef(this.beersRef)} section="beers" >Piwa</MenuGridItem>
                      <MenuGridItem onClick={() => this.scrollToRef(this.alcoFreeRef)} section="alco-free" >Bez promili</MenuGridItem>
                      <MenuGridItem onClick={() => this.scrollToRef(this.foodRef)} section="food">Jedzenie</MenuGridItem>
                      <MenuGridItem onClick={() => this.scrollToRef(this.othersRef)} section="others">Inne</MenuGridItem>
                    </Grid>
                  </Container>
                </Menu>
                <Container maxWidth='xs' style={{ padding: 0 }}>

                  <ListContainer sticky={this.state.menuSticky ? 1 : 0}>
                    <StyledSection ref={this.shotsRef}>
                      <Section id="shots" >
                        <ShopList
                          id="shots-list"
                          title="Szoty"
                          list={shotList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                    <StyledSection ref={this.drinksRef}>
                      <Section id="drinks">
                        <ShopList
                          id="drinks-list"
                          title="Driny"
                          list={drinkList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                    <StyledSection ref={this.beersRef}>
                      <Section id="beers">
                        <ShopList
                          id="beers-list"
                          title="Piwa"
                          list={beerList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                    <StyledSection ref={this.alcoFreeRef}>
                      <Section id="alco-free">
                        <ShopList
                          id="alco-free-list"
                          title="Bez promili"
                          list={alcoholFreeList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                    <StyledSection ref={this.foodRef}>
                      <Section id="food">
                        <ShopList
                          id="food-list"
                          title="Jedzenie"
                          list={foodList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                    <StyledSection ref={this.othersRef}>
                      <Section id="others">
                        <ShopList
                          id="others-list"
                          title="Inne"
                          list={othersList}
                          handleAddItem={this.handleAddItemToCart}
                        />
                      </Section>
                    </StyledSection>
                    <Divider />
                  </ListContainer>
                  <div style={{
                    position: 'sticky',
                    bottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    margin: "1rem 0",
                    padding: '0 auto',

                  }}>
                    <SectionLink section="top">
                      {link => (
                        <FloatingCart
                          style={{
                            visibility: this.state.basketDrawerOpen ? "hidden" : "visible",
                            color: 'white',
                          }}
                          variant="contained"
                          color="primary"
                          right="calc(50vw + 2rem)"
                          bottom="1rem"
                          onClick={() =>
                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                            })
                          }
                        >
                          <ArrowUpwardIcon />
                        </FloatingCart>
                      )}
                    </SectionLink>
                    <FloatingCart
                      style={{
                        visibility: this.state.basketDrawerOpen ? "hidden" : "visible"
                      }}
                      variant="contained"
                      color="primary"
                      right="calc(50vw - 4rem)"
                      bottom="1rem"
                      onClick={() => this.handleToggleBasketDrawer(true)}
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
                  </div>
                </Container>

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
                                  this.state.baskets[this.state.activeUser]
                                    .length - 1
                                ].name
                              }{" "}
                            do koszyka {activeUser.name}
                            </span>
                          ) : (
                              <span>
                                Dodano{" "}
                                {
                                  this.state.baskets[this.state.activeUser][
                                    this.state.baskets[this.state.activeUser]
                                      .length - 1
                                  ].name
                                }{" "}
                            do Twojego koszyka
                              </span>
                            )
                        }
                      />
                    </React.Fragment>
                  )}

                {/* <Button
                fullWidth
                variant="contained"
                style={{
                  position:'fixed',
                  bottom:0,
                  left: 0,
                  borderRadius: 0
                }}
                onClick={this.handleLeaveShop}
              >{<PintoTypography>Wyjdź</PintoTypography>}</Button> */}
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
                >
                  {" "}
                  <Recaptcha
                    style={{
                      visibility: this.state.basketDrawerOpen
                        ? "visible"
                        : "hidden"
                    }}
                    badge={"bottomleft"}
                    ref={ref => (this.recaptcha = ref)}
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'sitekey'}
                    onResolved={this.onCaptchaResolved}
                  />
                </BasketDrawer>
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
        </div >
      );
    } else {
      return (
        <div style={{ minHeight: `calc(100vh - (${this.state.fullHeightCorrection}px)` }}>
          <Container maxWidth='xs' style={{ padding: 0 }}>
            <React.Fragment></React.Fragment>
          </Container>
        </div>
      );
    }
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
    leader: state.auth.uid,
    layout: state.layout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetShop: (socketConnectedStatus) => dispatch(getShop(socketConnectedStatus)),
    onActivateOrder: (baskets, token) =>
      dispatch(activateOrder(baskets, token)),
    onLeaveShop: () => dispatch(leaveShop()),
    onLeaderScrollToggle: (id, category, equipped) =>
      dispatch(toggleItem(id, category, equipped, false)),
    onPartyMemberScrollToggle: (id, category, equipped, memberId) =>
      dispatch(toggleItem(id, category, equipped, memberId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
