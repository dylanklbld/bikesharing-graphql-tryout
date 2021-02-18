import React, { Fragment, ReactChildren, ReactNodeArray, useEffect } from 'react';

import { ClickEventValue } from 'google-map-react';
import DebugMenu from './DebugMenu'
import { UserContext } from '../contextProviders/UserContextProviders'
import styled from 'styled-components';

const MenuLabel = styled.label`
  background-color: #03a9f4;
  position: fixed;
  margin: 5%;
  top: 0;
  left: 0;
  border-radius: 50%;
  height: 5rem;
  width: 5rem;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 1rem 3rem rgba(182, 237, 200, 0.3);
  text-align: center;
`;

const Icon = styled.span`
  position: relative;
  margin-top: 50%;
  background-color: ${(props:IconProps) => (props.clicked ? "transparent" : "black")};
  width: 3rem;
  height: 3px;
  display: inline-block;
  transition: all 0.3s;
  &::before,
  &::after {
    content: " ";
    background-color: black;
    width: 3rem;
    height: 3px;
    display: inline-block;
    position: absolute;
    left: 0;
    transition: all 0.3s;
  }
  &::before {
    top: ${(props:IconProps) => (props.clicked ? "0" : "-0.8rem")};
    transform: ${(props:IconProps) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props:IconProps) => (props.clicked ? "0" : "0.8rem")};
    transform: ${(props:IconProps) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const MenuSidebar = styled.div`
    width: 0vw;
    height: 0vh;
    overflow:hidden;
    transition: width 1s ease-in-out;
    background: #03a9f4;
    box-shadow: none;

    &.open {
        width: 30vw;
        height: 50vh;
        box-shadow: 0 1rem 3rem rgba(182, 237, 200, 0.3);
    }
`


type MenuProps = {
    text?:string,
    onClick?:()=>void,
    mapInfo: any
}

type IconProps = {
    clicked: boolean,
}

const Menu = ({ text, onClick, mapInfo }:MenuProps) => {
    const [open, setOpen] = React.useState<boolean>(false) 

    const handleOpenMenu = (e:any)=>{
        e.preventDefault()
        e.stopPropagation()
        
        setOpen(!open)
    }

  return <Fragment>
    <MenuLabel>
        <Icon clicked={open} onClick={handleOpenMenu}/>
        <MenuSidebar className={open ? 'open' : 'closed'}>
            {open && <DebugMenu appInfoData={mapInfo}/>}
        </MenuSidebar>
    </MenuLabel>
  </Fragment>
}

export default Menu;