import React from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const mockOrders = [
  {
    id: 1,
    user: "A B",
    price: 41.5,
    products: [
      { name: "Wóda", quantity: 2, price: 7 },
      { name: "Zryje", quantity: 1, price: 7 },
      { name: "Banie", quantity: 1, price: 7 },
      { name: "Możajto", quantity: 1, price: 13.5 }
    ],
    status: "current"
  }
];

const OrdersExtendedCode = () => {
  const [orders, setOrders] = React.useState(mockOrders);
  const [statusFilter, setStatusFilter] = React.useState("current");

  const applyStatusFilter = status => {
    let tempOrders = [...mockOrders];
    switch (status) {
      case "all":
        tempOrders = [...mockOrders];
        break;
      case "current":
        tempOrders = tempOrders.filter(order => order.status === "current");
        break;
      case "archived":
        tempOrders = tempOrders.filter(order => order.status === "archived");
        break;

      default:
        break;
    }

    setOrders(tempOrders);
    return tempOrders;
  };

  const handleChangeStatusFilter = e => {
    const status = e.target.value;
    setStatusFilter(status);
    applyStatusFilter(status);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item style={{ width: "40%" }}>
        <Paper
          style={{
            width: "100%",
            margin: "1rem auto",
            padding: "1rem",
            boxSizing: "border-box"
          }}
        >
          <Typography>Filtruj</Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <FormControl style={{ alignSelf: "flex-start" }}>
              <InputLabel htmlFor="status-filter">Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleChangeStatusFilter}
                inputProps={{
                  id: "status-filter"
                }}
              >
                <MenuItem value={"current"}>Aktualne</MenuItem>
                <MenuItem value={"all"}>Wszystkie</MenuItem>
                <MenuItem value={"archived"}>Zarchiwizowane</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
        {orders.length > 0 && (
          <List style={{ border: "1px solid grey" }} alignItems="flex-start">
            {orders.map(order => {
              return (
                <ListItem key={order.id}>
                  <ExpansionPanel style={{width: '100%'}} defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography style={{ marginRight: "4rem" }}>
                        {order.user}
                      </Typography>
                      <Typography>{order.price + " PLN"}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <List style={{width: '100%'}}>
                        {order.products.map(product => {
                          return (
                            <ListItem key={product.name}>
                              <ListItemText
                                secondary={product.name}
                                style={{ flexBasis: "30%" }}
                              />
                              <ListItemText
                                secondary={product.quantity + "x"}
                                style={{ flexBasis: "10%" }}
                              />
                              <ListItemText
                                secondary={product.price.toFixed(2) + " ZŁ"}
                                style={{ flexBasis: "30%" }}
                              />
                              <ListItemText
                                secondary={
                                  "= " +
                                  (product.quantity * product.price).toFixed(
                                    2
                                  ) +
                                  " ZŁ"
                                }
                                style={{ flexBasis: "30%" }}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </ListItem>
              );
            })}
          </List>
        )}
      </Grid>
    </Grid>
  );
};

export default OrdersExtendedCode;
