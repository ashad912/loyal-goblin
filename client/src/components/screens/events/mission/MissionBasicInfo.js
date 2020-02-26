import React from 'react'
import styled from 'styled-components'
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Grid from "@material-ui/core/Grid";

import {missionsPath} from '../../../../utils/definitions'
import {PintoTypography} from '../../../../utils/fonts'

const ShortDescription = styled(PintoTypography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  height: 60;
  overflow: hidden;
  white-space: hidden;
  text-overflow: ellipsis;
`;

const MissionBasicInfo = ({mission}) => {
    return(
         
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
                        color="textSecondary"
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
                        style={{ width: "4.5rem", height: "4.5rem", borderRadius: "0" }}
                        variant="square"
                        src={`${missionsPath}${mission.imgSrc}`}
                    />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        
    )

}

export default MissionBasicInfo