import React, { ReactHTMLElement, useContext, useEffect, useRef, useState } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';
import styled, {css} from 'styled-components';

import BikeMarker from '../components/BikeMarker'
import GoogleMapReact from 'google-map-react';
import PopupBubble from '../components/PopupBubble'

const BIKES = gql`
  query GetBikes {
    bikes {
      id,
      name,
      rented,
      latitude, 
      longitude,
      user {
          id
      }
    }
  }
`;

const BIKE_STATUS_SUBSCRIPTION = gql`
  subscription OnBikeStatusChanged {
    bikeStatusChanged {
      id,
      name,
      rented,
      user {
          id
      }
    }
  }
`;

const mapCenterDefault = { lat: 50.119504, lng: 8.638137 }
const zoomDefault = 15
const googleMapsApiKey = 'AIzaSyDC5OzMwGhqNta8V1c473INMOXZrKiY9c8'
const bikeMarkerType = "bike-marker"

const RentBikeMap = (props: any) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const [center, setCenter] = useState(mapCenterDefault);
    const [zoom, setZoom] = useState<number>(zoomDefault);
    const [selectedBikeInfo, setSelectedBikeInfo] = useState<any>(null)
    
    const { loading, error, data:allBikesData, refetch: refetchAllBikes } = useQuery(BIKES);

    const {  data: updatedBikeStatusData } = useSubscription(BIKE_STATUS_SUBSCRIPTION);

    useEffect(()=>{
        const {bikeStatusChanged} = updatedBikeStatusData || {}
        
        if(selectedBikeInfo && selectedBikeInfo?.id === bikeStatusChanged?.id){
            setSelectedBikeInfo({...selectedBikeInfo, ...bikeStatusChanged})
        }

        refetchAllBikes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedBikeStatusData])

    const handleMarkerClick = (id:string) =>{
        const bike = allBikesData?.bikes.find((b:any)=>b.id === id)

        setSelectedBikeInfo(bike)
    }

    const handleMapAreaClick = ({event}:any) => {
        // since its outside of info bubble anyway
        if(!popupRef.current?.contains(event.target))
            setSelectedBikeInfo(null)
    }

    const handleMapChildClick = (key:string, childProps:any) => {
        // checking for type, in case we have something else around
        if(childProps?.type!== bikeMarkerType){
            setSelectedBikeInfo(null)
        }
    }

   
    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative'}}>
            <GoogleMapReact
                onClick={handleMapAreaClick}
                onChildClick={handleMapChildClick}
                bootstrapURLKeys={{ key:  googleMapsApiKey}}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {allBikesData?.bikes?.map(({ id, name, rented, latitude, longitude, user }: any) => (
                    <BikeMarker
                        type={bikeMarkerType}
                        key={id}
                        lat={latitude}
                        lng={longitude}
                        rented={rented}
                        onClick={()=>handleMarkerClick(id)}
                    >
                        {(id === selectedBikeInfo?.id) && 
                        <div ref={popupRef}>
                            <PopupBubble bikeData={selectedBikeInfo} onClose={()=>setSelectedBikeInfo(null)} />
                        </div>}
                    </BikeMarker>
                ))}
                
            </GoogleMapReact>
            
        </div>
    );
}

export default RentBikeMap;