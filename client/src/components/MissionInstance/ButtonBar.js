import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from "@material-ui/core/Button";
import ColorizeIcon from "@material-ui/icons/Colorize";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { PintoTypography } from 'assets/fonts'

const ButtonBar = styled.div`
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    text-align: left;
    align-items: center;
    justify-content: space-between;
    margin: 0.5rem 0rem 1rem 0rem;
`

export default Object.assign((props) => {

    const statusIcon = (condition) => condition ? (
        <CheckIcon
            style={{
                flexBasis: '10%',
                color: "green",
                fontSize: "2rem",
                transition: "transform 500ms ease-out",

            }}
        />
    ) : (
            <ClearIcon
                style={{
                    flexBasis: '10%',
                    color: "red",
                    fontSize: "2rem",
                    transition: "transform 500ms ease-out",

                }}
            />
        )

    const buttonReadyLabel = props.leader ? (`Wyrusz`) : (`Gotów`)

    return (
        <ButtonBar>
            <Button
                style={{
                    display: 'flex',
                    flexFlow: 'row nowrap',
                    margin: '1rem 2rem',
                    width: 'calc(100% - 4rem)',
                    position: 'absolute',
                    bottom: document.getElementById("footer").offsetHeight,
                    left: 0,
                    borderRadius: 0,
                }}
                onClick={props.handleReadyButton}
                disabled={props.leader && (!props.isRequiredItemsCollected || !props.isAllPartyReady)}
                variant="contained"
                color="primary"
            >
                <PintoTypography style={{ flexBasis: '80%' }}>{buttonReadyLabel}</PintoTypography>
                <ColorizeIcon
                    style={{
                        flexBasis: '10%',
                        margin: '0 0 0 0.2rem',
                        fontSize: "2rem",
                        transition: "transform 500ms ease-out",
                        transform: props.userReadyStatus ? "rotate(540deg)" : "rotate(0deg)"

                    }}
                />
                {!props.leader ? statusIcon(props.isUserReady) : statusIcon(props.isRequiredItemsCollected && props.isAllPartyReady)}
            </Button>
        </ButtonBar>
    )
},
    {
        propTypes: {
            leader: PropTypes.bool.isRequired,
            handleReadyButton: PropTypes.func.isRequired,
            isRequiredItemsCollected: PropTypes.bool.isRequired,
            isAllPartyReady: PropTypes.bool.isRequired,
            isUserReady: PropTypes.bool.isRequired,
        }
    }
)