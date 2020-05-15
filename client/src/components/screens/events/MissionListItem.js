import React from "react";
import MissionBasicInfo from './mission/MissionBasicInfo'
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
import { palette, itemsPath, uiPaths } from "../../../utils/definitions";
import { PintoTypography} from '../../../utils/fonts'
import MissionAttribute from './MissionAttribute'
import MissionRequirements from './MissionRequirements';
import MissionAmulets from "./MissionAmulets";


const StyledBox = styled(Box)`
  margin: 0.5rem 0;
  background: ${props =>
    props.active === "1"
      ? palette.background.equipped
      : palette.background.standard};
`;

const StyledBadge = styled(Badge)`
    margin-right: ${props => props.invisible ? '0rem' : '1rem'};
`

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
        style={{ padding: "0.5rem", textAlign: "left" }}
      >
        <MissionBasicInfo mission={mission}/>
      
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
              style={{ paddingLeft: '0', minWidth: '0'}}
              onClick={() => props.handleMissionDetailsOpen(props.index)}
            >
              <PintoTypography>Szczegóły</PintoTypography>
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
                  <PintoTypography>Opuść</PintoTypography>
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
              <PintoTypography>{props.activeInstanceId ? "Dołącz!" : "Wyrusz!"}</PintoTypography>
            </Button>
          </Grid>
        </Grid>
        <Divider style={{ margin: "0.5rem 0" }} />
        
        <MissionRequirements 
            props={props}
            mission={mission}
            titleMargin={'0'}
            dataMargin={'0 0 0.3rem 0'}
            headerVariant='body1'
            bodyVariant='body2'
        />

        
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
                  key={className}
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
                              key={`${award._id}q${i}`}
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
