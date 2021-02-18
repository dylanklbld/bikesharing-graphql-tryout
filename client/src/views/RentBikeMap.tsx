import React, { ReactHTMLElement, useContext, useEffect, useRef, useState } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';

import BikeMarker from '../components/BikeMarker'
import GoogleMapReact from 'google-map-react';
import Menu from '../components/Menu'
import PopupBubble from '../components/PopupBubble'
import ReactDOM from 'react-dom'

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

const BIKES_DATA_SUBSCRIPTION = gql`
  subscription OnBikesBulkDataUpdate {
    bikesDataBulkUpdate {
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

const mapCenterDefault = { lat: 50.119504, lng: 8.638137 }
const zoomDefault = 15
const googleMapsApiKey = 'AIzaSyDC5OzMwGhqNta8V1c473INMOXZrKiY9c8'
const bikeMarkerType = "bike-marker"

const RentBikeMap = (props: any) => {
    const popupRef = useRef<HTMLDivElement>(null)
    const [center, setCenter] = useState(mapCenterDefault);
    const [zoom, setZoom] = useState<number>(zoomDefault);
    const [selectedBikeInfo, setSelectedBikeInfo] = useState<any>(null)

    const { data: allBikesData, refetch: refetchAllBikes } = useQuery(BIKES);

    const { data: updatedBikeStatusData } = useSubscription(BIKE_STATUS_SUBSCRIPTION);
    const { data: updatedBulkBikesData } = useSubscription(BIKES_DATA_SUBSCRIPTION)

    const [data, setData] = useState<any>(()=>allBikesData)

    useEffect(() => {
        const { bikeStatusChanged } = updatedBikeStatusData || {}

        if (selectedBikeInfo && selectedBikeInfo?.id === bikeStatusChanged?.id) {
            setSelectedBikeInfo({ ...selectedBikeInfo, ...bikeStatusChanged })
        }

        refetchAllBikes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedBikeStatusData])

    // if reset through subscription
    useEffect(() => {
        if (updatedBulkBikesData) {
            const { bikesDataBulkUpdate: bikes } = updatedBulkBikesData
            setData({ bikes })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedBulkBikesData])

    useEffect(() => {
        if(allBikesData){
            setData(allBikesData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allBikesData, refetchAllBikes])


    const handleMarkerClick = (id: string) => {
        const bike = data?.bikes.find((b: any) => b.id === id)

        setSelectedBikeInfo(bike)
    }

    const handleMapAreaClick = ({ event }: any) => {
        // since its outside of info bubble anyway
        if (!popupRef.current?.contains(event.target))
            setSelectedBikeInfo(null)
    }

    const handleMapChildClick = (key: string, childProps: any) => {
        // checking for type, in case we have something else around
        if (childProps?.type !== bikeMarkerType) {
            setSelectedBikeInfo(null)
        }
    }

    const buttonAdded = React.useRef<any>(null)
    const controlButtonDiv = document.createElement('div');
    const handleApiLoaded = (map: any) => {
        if (!buttonAdded.current) {
            buttonAdded.current = true
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlButtonDiv);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            <GoogleMapReact
                onClick={handleMapAreaClick}
                onChildClick={handleMapChildClick}
                bootstrapURLKeys={{ key: googleMapsApiKey }}
                defaultCenter={center}
                defaultZoom={zoom}
                onGoogleApiLoaded={({ map }) => handleApiLoaded(map)}
                yesIWantToUseGoogleMapApiInternals
            >
                {data?.bikes?.map(({ id, name, rented, latitude, longitude, user }: any) => (
                    <BikeMarker
                        type={bikeMarkerType}
                        key={id}
                        lat={latitude}
                        lng={longitude}
                        rented={rented}
                        onClick={() => handleMarkerClick(id)}
                    >
                        {(id === selectedBikeInfo?.id) &&
                            <div ref={popupRef}>
                                <PopupBubble bikeData={selectedBikeInfo} onClose={() => setSelectedBikeInfo(null)} />
                            </div>}
                    </BikeMarker>
                ))}
            </GoogleMapReact>
            <div>
               <Menu mapInfo={{center}}/>
            </div>
        </div>
    );
}

export default RentBikeMap;