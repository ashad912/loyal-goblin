import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import styled from "styled-components";
import { classLabelsAny } from "../../../utils/labels";
import { palette, itemsPath, missionsPath } from "../../../utils/definitions";

const ShortDescription = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  height: 60;
  overflow: hidden;
  white-space: hidden;
  text-overflow: ellipsis;
`;

const RequiredAttribute = styled(Typography)`
  margin: 0 0.5rem 0 0;
  color: ${props => (props.attr ? "green" : "red")};
`;

const StyledList = styled(List)`
  width: 100%;
  margin: 0 0 1rem 0;
`;
const StyledBox = styled(Box)`
  margin: 0.5rem 0;
  background: ${props =>
    props.active === "1"
      ? palette.background.equipped
      : palette.background.standard};
`;

const MissionListItem = props => {
  const mission = props.mission;
  return (
    <StyledBox
      border={0}
      borderColor="primary.main"
      active={props.activeInstanceId ? "1" : "0"}
    >
      <Grid
        container
        direction="column"
        style={{ padding: "1rem", textAlign: "left" }}
      >
        <Grid container direction="row">
          <Grid item xs={9}>
            <Grid container direction="column">
              <Grid
                item
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}
              >
                <Typography component="span" variant="h6" color="textPrimary">
                  {mission.title}
                </Typography>
                {mission.unique && (
                  <StarBorderIcon style={{ marginLeft: "1rem" }} />
                )}
              </Grid>
              <Grid item>
                <ShortDescription
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {mission.description}
                </ShortDescription>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column">
              <Grid
                item
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Avatar
                  alt="avatar"
                  style={{ width: "4rem", height: "4rem", borderRadius: "0" }}
                  variant="square"
                  src={`${missionsPath}${mission.imgSrc}`}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          display="flex"
          style={{ marginTop: "0.5rem" }}
        >
          <Grid item xs={4}>
            <Button
              disabled={props.multipleSession}
              size="small"
              color="primary"
              style={{ paddingLeft: "0" }}
              onClick={() => props.handleMissionDetailsOpen(props.index)}
            >
              Szczegóły
            </Button>
          </Grid>

          <Grid item xs={2}>
            {props.activeInstanceId !== null &&
              (props.leader || props.party.members.length === 0) && (
                <Button
                  size="small"
                  color="primary"
                  style={{ paddingLeft: "0", justifyContent: "flex-start" }}
                  disabled={props.multipleSession}
                  onClick={() => props.handleMissionLeave()}
                >
                  Opuść
                </Button>
              )}
          </Grid>

          <Grid
            item
            xs={3}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              size="small"
              color="primary"
              style={{ textAlign: "right", paddingRight: "0" }}
              onClick={() => props.handleMissionClick(mission._id)}
              disabled={
                props.multipleSession ||
                !props.isMissionActive ||
                (!props.leader && !props.activeInstanceId)
              }
            >
              {props.activeInstanceId ? "Dołącz!" : "Wyrusz!"}
            </Button>
          </Grid>
        </Grid>
        <Divider style={{ margin: "0.5rem 0" }} />
        <Grid container direction="column">
          <Grid container direction="row">
            <Grid item>
              <Typography
                component="span"
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: "bold" }}
              >
                Wymagania
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" style={{ margin: "0.1rem 0" }}>
            <Grid item xs={3}>
              <Typography
                component="span"
                style={{ display: "inline-flex" }}
                variant="body2"
                color={props.appropriateLevel ? "textPrimary" : "error"}
              >
                {/* <img style= {{height: 20, width: 20}} src={levelIcon}/> */}
                {`P: ${mission.level}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                component="span"
                style={{ display: "inline-flex" }}
                variant="body2"
                color={props.appropriatePlayers ? "textPrimary" : "error"}
              >
                {/* <img style= {{height: 20, width: 20}} src={playersIcon}/> */}
                {`G: ${props.playersLabel(
                  mission.minPlayers,
                  mission.maxPlayers
                )}`}
              </Typography>
            </Grid>
          </Grid>

          <Grid container direction="row" style={{ margin: "0.1rem 0" }}>
            <Grid item xs={3}>
              <RequiredAttribute
                variant="body1"
                attr={props.appropriateStrength ? 1: 0}
              >{`S: ${props.totalStrength}/${mission.strength}`}</RequiredAttribute>
            </Grid>
            <Grid item xs={3}>
              <RequiredAttribute
                variant="body1"
                attr={props.appropriateDexterity ? 1: 0}
              >{`Z: ${props.totalDexterity}/${mission.dexterity}`}</RequiredAttribute>
            </Grid>
            <Grid item xs={3}>
              <RequiredAttribute
                variant="body1"
                attr={props.appropriateMagic ? 1: 0}
              >{`M: ${props.totalMagic}/${mission.magic}`}</RequiredAttribute>
            </Grid>
            <Grid item xs={3}>
              <RequiredAttribute
                variant="body1"
                attr={props.appropriateEndurance ? 1: 0}
              >{`W: ${props.totalEndurance}/${mission.endurance}`}</RequiredAttribute>
            </Grid>
          </Grid>

          <Grid container direction="row" style={{ margin: "0.2rem 0" }}>
            <Grid item>
              <React.Fragment>
                <Typography
                  variant="body2"
                  component="span"
                  style={{ display: "inline-flex", margin: "0 0.3rem 0 0" }}
                >
                  {mission.amulets && mission.amulets.length > 0 && `A: `}
                </Typography>
                {mission.amulets.map(amulet => {
                  return (
                    <Badge
                      key={amulet.itemModel._id}
                      color="primary"
                      badgeContent={amulet.quantity}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      style={{ marginRight: "1rem", transform: 'scale(0.9)' }}
                      invisible={amulet.quantity <= 1}
                    >
                      <Typography
                        variant="body2"
                        component="div"
                        style={{
                          display: "inline-flex",
                          margin: "0 0.2rem 0 0"
                        }}
        
                      >
                        <img
                          style={{
                            height: 20,
                            width: 20,
                            marginLeft: "0.1rem"
                          }}
                          src={`${itemsPath}${amulet.itemModel.imgSrc}`}
                          alt="icon"
                        />
                        {` `}
                      </Typography>
                    </Badge>
                  );
                })}
              </React.Fragment>
            </Grid>
          </Grid>
        </Grid>
        <Divider style={{ margin: "0.5rem 0" }} />
        <Grid container direction="column">
          <Grid container direction="row">
            <Grid item>
              <Typography
                component="span"
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: "bold" }}
              >
                Nagrody
              </Typography>
            </Grid>
          </Grid>
          {Object.keys(mission.awards).map(className => {
            return (
              <Grid
              key={className}
                container
                direction="row"
                style={{ marginBottom: "0.2rem" }}
              >
                <Grid item xs={4}>
                  <Typography
                    variant="body2"
                    component="span"
                    style={{ display: "inline-flex", margin: "0 0.3rem 0 0" }}
                  >
                    {`${classLabelsAny[className]}: `}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {mission.awards[className].length &&
                  !mission.awardsAreSecret ? (
                    <React.Fragment>
                      {mission.awards[className].map(award => {
                        let copies = [];
                        for (let i = 0; i < award.quantity; i++) {
                          const copy = (
                            <img
                            key={award._id}
                              style={{
                                height: 20,
                                width: 20,
                                marginLeft: "0.2rem"
                              }}
                              src={`${itemsPath}${award.itemModel.imgSrc}`}
                              alt="icon"
                            />
                          );
                          copies = [...copies, copy];
                        }
                        return copies;
                      })}
                    </React.Fragment>
                  ) : (
                    <Typography
                      variant="body2"
                      component="span"
                      style={{ display: "inline-flex", margin: "0 0.3rem 0 0" }}
                    >
                      ?
                    </Typography>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default MissionListItem;
