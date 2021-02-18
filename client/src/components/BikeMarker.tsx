import React, { ReactChildren, ReactNodeArray } from 'react';

import { Coords } from 'google-map-react';
import { UserContext } from '../contextProviders/UserContextProviders'
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: ${(props:MarkerProps) => (props.rented ? '#71acbc75' : '#61dafb')};
  border: 1px solid ${(props:MarkerProps) => (props.rented ? '#71acbc75' : '#fff')};
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${(props:MarkerProps) => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

type MarkerProps = {
    type?:string,
    text?:string,
    onClick?:()=>void,
    rented: boolean,
    children?: React.ReactNode
}

type BikeMarkerProps = MarkerProps & Coords

const Marker = ({ text, onClick, rented, children}:BikeMarkerProps) => (
  <Wrapper onClick={onClick} rented={rented}>
    <div>{children}</div>
  </Wrapper>
);

export default Marker;