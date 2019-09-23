import React from "react";
import styled from 'styled-components'
import { SectionLink } from "react-scroll-section";

const Item = styled.div`
border-bottom: ${props => props.selected ? '2px solid #e91e63' : 'none'};
`

const MenuItem = ({ section, children }) => {
  return (
    <SectionLink section={section}>
      {link => (
        <Item onClick={link.onClick} selected={link.isSelected}>
          {children}
        </Item>
      )}
    </SectionLink>
  );
};

export default MenuItem;
