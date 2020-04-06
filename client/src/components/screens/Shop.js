import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Recaptcha from "react-google-invisible-recaptcha";
import { ScrollingProvider, Section } from "react-scroll-section";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Snackbar from "@material-ui/core/Snackbar";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";


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
import { uiPaths } from "../../utils/definitions";
import {PintoTypography} from '../../utils/fonts'
import {socket} from '../../socket'

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
  bottom: 3rem;
  right: calc(50vw - 2rem);
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
    if(withStack){
      this.pushToProfile(this.props.history)
    }else{
      this.backToProfile(this.props.history);
    }
  };

  handleLeaveShop = async () => {
    if(this.props.party && this.props.party.length){
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

    try{
      await this.props.onGetShop(socketConnectionStatus);
    }catch(e){
      this.handleBack()
      //this.handleLeaveShop(); REFACTORED
      return;
    }

    let menuTopOffset = this.menuRef.current && this.menuRef.current.offsetTop;
    this.setState({ menuTopOffset }, () => {
      window.addEventListener("scroll", this.handleScrollPosition);
    });

    //backend call for players in party
    //await this.props.onUpdateParty();
    const baskets = {};
    baskets[this.props.auth.uid] = [];
    if (this.props.party.length > 1) {
      this.props.party.forEach(player => {
        baskets[player._id] = [];
      });
    }

    this.setState({ baskets, products: [...this.props.products] }, () => {});

    this.handleChangeactiveUser(
      null,
      this.props.party.length > 0 && this.props.party[0]
        ? this.props.party[0]._id
        : this.props.auth.uid
    );
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

        this.handleChangeactiveUser(
          null,
          this.props.party.length > 0 && this.props.party[0]
            ? this.props.party[0]._id
            : this.props.auth.uid
        );
      } else {
        this.handleChangeactiveUser(null, this.state.activeUser);
      }
    }
    if (prevState.activeUser !== this.state.activeUser) {
      let menuTopOffset =
        this.menuRef.current && this.menuRef.current.offsetTop;
      this.setState({ menuTopOffset });
    }
  }

  // componentWillUnmount() {
    
  // }

  handleScrollPosition = () => {
    if (window.pageYOffset >= this.state.menuTopOffset) {
      this.setState({ menuSticky: true });
    } else {
      this.setState({ menuSticky: false });
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
      if(firstDiscount){
        this.handleChangeactiveUser(null, this.state.activeUser)
      }
    });
  };

  handleRemoveItemFromCart = (id, firstDiscount) => {
    const baskets = { ...this.state.baskets };
    const idOfProductInBasket = baskets[this.state.activeUser].findIndex(
      product => product._id === id && product.firstDiscount === firstDiscount
    );
    if(idOfProductInBasket > -1){
      const productInBasket = baskets[this.state.activeUser][idOfProductInBasket]

      const productInBasketWasFirstDiscount = productInBasket.firstDiscount
      if (productInBasket.quantity > 1) {
        productInBasket.quantity -= 1;
      } else {
        //baskets[this.state.activeUser] = baskets[this.state.activeUser].filter(product => product._id !== id && product.firstDiscount === firstDiscount)
        baskets[this.state.activeUser].splice(idOfProductInBasket, 1)
      }
      this.setState({ baskets }, () => {
        if(firstDiscount || productInBasketWasFirstDiscount){
          this.handleChangeactiveUser(null, this.state.activeUser)
        }
      });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  handleChangeactiveUser = (e, id) => {
    //CALL BACKEND FOR PRODUCT MODIFIERS EACH TIME ACTIVE USER CHANGES
    this.setState({ activeUser: id }, () => {
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
            ) 
            {
              //Show price in green color when lowered if any priceMod present
              products[modifyIndex].priceModified = false
              products[modifyIndex].firstDiscount = false


              //Apply first priceMod discount from scroll
              if(activeUser.equipped.scroll && activeUser.userPerks.products[modifiedProduct].priceMod.hasOwnProperty('first') && activeUser.userPerks.products[modifiedProduct].priceMod.first < 0){
                //console.log(activeUser.userPerks.products[modifiedProduct].priceMod.first)
                if(this.state.baskets[this.state.activeUser]){

                  const productInBasket = this.state.baskets[this.state.activeUser].find(basketProduct => basketProduct._id === modifiedProduct && basketProduct.quantity > 0 && basketProduct.firstDiscount)
                  if(!productInBasket){
                    products[modifyIndex].price += activeUser.userPerks.products[modifiedProduct].priceMod.first;
                    products[modifyIndex].firstDiscount = true
                    products[modifyIndex].priceModified = "#28a52e"
                  }else{
                    products[modifyIndex].priceModified = false
                  }
                }

              }

              
              
              //Apply standard priceMod discount
              if(activeUser.userPerks.products[modifiedProduct].priceMod.hasOwnProperty('standard') && activeUser.userPerks.products[modifiedProduct].priceMod.standard < 0){
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
      this.setState({ products });
    });
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
    this.handleChangeactiveUser(null, this.state.activeUser);
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
        if(typeof activeUser.equipped.scroll === 'string'){
          return item._id === activeUser.equipped.scroll
        }else if(typeof activeUser.equipped.scroll === 'object'){
          if(activeUser.equipped.scroll){
            return item._id === activeUser.equipped.scroll._id
          }
        }
      }
      );
    }
    // console.log(this.state.activeUser,activeUser, this.props.party)
    if (activeUser) {
      return (
        <div>
          {this.props.activeOrder.length > 0 && this.state.activeUser ? (
            <VerificationPage user={this.props.auth} party={this.props.party} />
          ) : (
            <ScrollingProvider>

              {this.props.party && this.props.party.length > 1 && (
                <PlayerShopButtons
                  users={this.props.party}
                  activeUser={this.state.activeUser}
                  handleChipClick={this.handleChangeactiveUser}
                />
              )}
              {!activeUser.equipped.scroll && activeUser.bag.filter(item=>item.itemModel.type==="scroll").length > 0 ? (
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
                activeUser.bag.filter(item=>item.itemModel.type==="scroll").length > 0 && (
                  <Grid
                    container
                    
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
                      <img src={uiPaths.deleteRed}
                        onClick={() =>
                          this.handleScrollSelect(equippedScroll._id)
                        }
                        style={{ width: "2.5rem", paddingTop: '0.5rem'}}
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
                    <MenuItem section="drinks">Drinki</MenuItem>
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
                  <Grid item>
                    <MenuItem section="others">Inne</MenuItem>
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
                <StyledSection id="others">
                  <ShopList
                    title="Inne"
                    list={othersList}
                    handleAddItem={this.handleAddItemToCart}
                  />
                </StyledSection>
                <Divider />
              </ListContainer>
              <div style={{ marginTop: "5.5rem" }}></div>
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
              <FloatingCart
                style={{
                  visibility: this.state.basketDrawerOpen ? "hidden" : "visible"
                }}
                variant="contained"
                color="primary"
                onClick={()=>this.handleToggleBasketDrawer(true)}
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
              <Button
                fullWidth
                variant="contained"
                style={{
                  position:'fixed',
                  bottom:0,
                  left: 0,
                  borderRadius: 0
                }}
                onClick={this.handleLeaveShop}
              >{<PintoTypography>Wyjdź</PintoTypography>}</Button>
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
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
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
        </div>
      );
    } else {
      return (
        <div>
          <Button
            fullWidth
            variant="contained"
            style={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
              borderRadius: 0
            }}
            onClick={this.handleLeaveShop}
          >{<PintoTypography>Wyjdź</PintoTypography>}</Button>
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
    leader: state.auth.uid
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
