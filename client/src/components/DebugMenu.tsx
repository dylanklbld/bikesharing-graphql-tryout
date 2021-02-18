import React, { Fragment, ReactChildren, ReactNodeArray } from 'react';
import { gql, useMutation } from '@apollo/client';

import { UserContext } from '../contextProviders/UserContextProviders'
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 50%;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button`
  border: none;

  font-weight: bold;
  padding: 10px;
  margin: 10px;
  width:75%;
  &:hover {
    cursor: pointer;
    background-color: #1a73e8;
  }
`

type DebugMenuProps = {
    text?:string,
    onClick?:()=>void,
    appInfoData: any
}

const DROP_ALL_RENTS = gql`
  mutation DropALlRents {
    dropAllRents {
      name,
      rented,
      latitude, 
      longitude
    }
  }
`;

const DROP_ALL_BIKES = gql`
  mutation DropAllBikes {
    resetBikesData {
      name,
      rented,
      latitude, 
      longitude
    }
  }
`;

const PLACE_BIKE_RANDOM = gql`
  mutation PlaceBikeRandomly($coords: CoordsInput) {
    placeNewBike(coords: $coords) {
      id,
      name,
      rented,
    }
  }
`;

const DebugMenu = ({ appInfoData }:DebugMenuProps) => {
  const [dropAllRent] = useMutation(DROP_ALL_RENTS);
  const [placeBikeRandomly] = useMutation(PLACE_BIKE_RANDOM);
  const [dropAllBikes] = useMutation(DROP_ALL_BIKES);

  const handleDropRent = async () => {
      await dropAllRent()
  }

  const handleBikesReset = async () => {
    await dropAllBikes()
}

  const handlePlaceBike = async () => {
    const coords = {
        latitude:appInfoData.center.lat + (Math.random() * (0.002 - 0.0001) + 0.0020)* (Math.round(Math.random()) * 2 - 1), 
        longitude:appInfoData.center.lng + (Math.random() * (0.002 - 0.0001) + 0.0020)* (Math.round(Math.random()) * 2 - 1)
    }

    const payload = { variables: {coords }}
            
    await placeBikeRandomly(payload)
  }


  return <Wrapper>
    <Button onClick={handleDropRent}>Reset all rents</Button>
    <Button onClick={handleBikesReset}>Reset bikes</Button>
    <Button onClick={handlePlaceBike}>Place new bike(s) somewhere nearby</Button>
  </Wrapper>
}

export default DebugMenu;