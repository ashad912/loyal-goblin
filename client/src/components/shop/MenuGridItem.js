import React from "react";
import styled from 'styled-components'
import { SectionLink } from "react-scroll-section";
import { palette } from "../../utils/constants";
import { Grid } from "@material-ui/core";

const Item = styled.div`
  color: ${props => props.selected ? `${palette.primary.main}` : '#000000'};
  font-family: 'Pinto-0';
`

const MenuGrid = styled(Grid)`
  border-bottom: ${props => props.selected ? `1.2px solid ${palette.primary.main}` : 'none'};
  &:active{
    background: #eeeeee
  }
`


const MenuGridItem = ({ onClick, section, children }) => {
  // const [isSelected, setIsSelected] = React.useState(false)
  // console.log(section, isSelected)

  return (
    
      <SectionLink section={section}>
        {link => {
          //it works!
          /*if(!isSelected && link.isSelected){
            setIsSelected(true)
          }else if(isSelected && !link.isSelected){
            setIsSelected(false)
          }*/
          return (
            <MenuGrid item selected={link.isSelected}>
              <Item 
                //onClick={link.onClick} 
                selected={link.isSelected}
                onClick={onClick}
                data-testid={section}
              >
                {children}
              </Item>
            </MenuGrid>
          )
        }
      }
      </SectionLink>
  );
};

export default MenuGridItem;
