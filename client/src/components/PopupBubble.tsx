import React, { ButtonHTMLAttributes, useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styled, {css} from 'styled-components';

import { Coords } from 'google-map-react';
import { UserContext } from '../contextProviders/UserContextProviders'

const PopupWrapper = styled.div`
    background:white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 200px;
    bottom:0;
    position: absolute;
    left: 50%; 
    transform: translate(-50%, -20%);
    border-radius: 5px;
    align-items: center;

    &:after{
      content: "";
      position: absolute;
      top: 100%;
      width: 0;
      border-top: 15px solid #fff;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
    }
`;

const Button = styled.button`
  border: none;
  color: ${(props:any) => !props.disabled ? '#fff' : 'gray'};
  font-size: 8px;
  border-radius: 5px;
  background-color: ${(props:any) => !props.disabled ? '#61dafb' : '#d2e2fd'};
  font-weight: bold;
  padding: 10px;
  margin: 10px;
  width:75%;

  ${(props:any) => !props.disabled && css`
    &:hover {
      cursor: pointer;
      background-color: #1a73e8;
    }
  `}
`
const GuideList = styled.ol`
    font-weight: 300;
    align-self: flex-start;
    text-align: left;
`

const BikeTitle = styled.span`
  font-size: 14px;
  font-weight:400;
  text-align:center;
`

type MarkerProps = {
  bikeData: any,
  onClose:()=>void
}

const RENT_BIKE_FINISHED = gql`
  mutation FinishRent($bike: BikeInput) {
    rentBikeFinish(bike: $bike) {
      id,
      name,
      rented,
      latitude, 
      longitude
    }
  }
`;

const RENT_BIKE_START = gql`
  mutation StartRent($bike: BikeInput) {
    rentBikeStart(bike: $bike) {
      id,
      name,
      rented,
      latitude, 
      longitude
    }
  }
`;

const rentGuideList = ["Click on 'Rent'", "Lock will unlock", "Adjust seat"]
const returnGuideList = [ "Lock to something", "Click 'Finish rent'", "Have a nice day!"]


const PopupBubble = ({ bikeData, onClose }: MarkerProps) => {
  const { user } = useContext(UserContext)
  const [startRent, { data: rentedBikeData, error: rentBikeError }] = useMutation(RENT_BIKE_START);
  const [finishRent, {data: returnedBikeData, error: returnedBikeError}] = useMutation(RENT_BIKE_FINISHED);

  const hanldeClick = async () => {
    const payload = { variables: { bike: { id: bikeData?.id } } }

    if (bikeData?.rented) {
      await finishRent(payload)
    } else {
      await startRent(payload)
    }
  }

  const isRented = bikeData?.rented
  const sameUser = user?.id === bikeData?.user?.id
  const buttonText = isRented ? "Finish Rent" : "Rent"
  
  const cannotRent = isRented && !sameUser

  const point = (value:string, index: number)=><li key={index}>{value}</li>

  return <PopupWrapper>
      <p>Bike "<BikeTitle>{bikeData.name}</BikeTitle>"</p>
      {cannotRent && <p>Sorry, bike was rented by someone else</p>}
      {(isRented && sameUser) && <p>You've rented it!</p>}
      {!isRented && <p>This bike is for rent</p>}
      {!cannotRent && <GuideList>
        {isRented ? rentGuideList.map(point) : returnGuideList.map(point)}
      </GuideList>}
      <Button disabled={cannotRent} onClick={hanldeClick}>
        {buttonText}
      </Button>
  </PopupWrapper>
}

export default PopupBubble;