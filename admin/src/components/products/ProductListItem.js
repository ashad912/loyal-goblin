import React from "react";
import styled  from 'styled-components'
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";

import {categoryLabels} from '../../utils/labels'
import {itemsPath, productsPath} from '../../utils/definitions'
import iconCoins from "../../assets/coins.png"


const StyledListItem = styled(ListItem)`
    padding-left: 1rem;
`


const ProductListItem = ({
    product,
    editProduct,
    deleteProduct,
    isLast
}) => {

  const [awardPopover, setAwardPopover] = React.useState(null);

  const handleAwardPopover = event => {
    setAwardPopover(event.currentTarget);
  };

  const handleClose = () => {
    setAwardPopover(null);
  };



  //console.log(product)
  return (
    <React.Fragment>

    <StyledListItem >
      <Grid container direction="column" spacing={2}>
        <Grid item container>
          <Grid item xs={2}>
            <Typography >
                {categoryLabels[product.category]}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            
          </Grid>
          <Grid item xs={3}>
            <Box display="flex">
                <Typography >
                  <img alt=''
                    src={iconCoins}
                    style={{width: '1rem'}}
                  />
                  {` ${product.price} zł`}
                </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={2}>
            <img alt=''
              src={productsPath + product.imgSrc}
              style={{width: '3rem'}}
            />
          </Grid>
          <Grid item container direction="column" xs={6}>
            <Grid item>
              <Typography variant="h5" style={{fontSize: '1.2rem', fontWeight: 'bolder'}}>{product.name}</Typography>
            </Grid>
            <Grid item>
                <Typography >{product.description}</Typography>
            </Grid>
            <Grid item>
              
            </Grid>
            
          </Grid>
          <Grid
            item
            container
            direction="column"
            justify="flex-start"
            xs={2}
            spacing={2}
          >
           {product.awards.length > 0 && 
            <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAwardPopover}
                >
                  Nagrody
                </Button>
                <Popover
                  open={Boolean(awardPopover)}
                  anchorEl={awardPopover}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                >
                  <Grid
                    container
                    direction="column"
                    spacing={1}
                    style={{ width: "15vw", padding: "0.5rem" }}
                  >
                    {product.awards.map(award => {
                      return (
                        <Grid item key={award.itemModel._id} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                          <img alt=''
                            src={itemsPath + award.itemModel.imgSrc}
                            width={32}
                            style={{height: '100%', marginRight: '0.5rem'}}
                          />
                          <ListItemText
                            primary={award.itemModel.name}
                            secondary={"x" + award.quantity}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Popover>
              </Grid>}
          </Grid>
          <Grid item container direction="column" xs={2} spacing={2} style={{textAlign: 'right'}}>
            <Grid item>
              <Button color="primary" onClick={e => editProduct(product._id)}>Edytuj</Button>
            </Grid>
            
            <Grid item>
              <Button onClick={e => deleteProduct(product._id, product.name)} color="secondary">
                Usuń
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* {product.perks.length > 0 && (
        <List component="nav" style={{width: '100%', borderTop: '1px solid #ddd'}}>
            
            
            <ListItem onClick={handleOpenEffect} data-value={product._id} style={{paddingLeft: '0.5rem'}}>
              <ListItemText primary={'Efekty'} />
              {openEffect === product._id ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openEffect === product._id}
              timeout="auto"
              unmountOnExit
            >
            <PerkListBox
                perks={product.perks}
                headers={false}
                typeWidth={4}
                valueWidth={2}
                targetWidth={1}
                timeWidth={5}
                breakWidth={0}
                actions={false}
                buttonsWidth={0}
              />
                    
                  </Collapse>
                  </List>
                )} */}
      </Grid>
    </StyledListItem>
    {!isLast && <Divider />}
    </React.Fragment>
  );
};

export default ProductListItem;
