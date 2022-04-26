import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import useMap from '../../hooks/useMap';
import { PointerImage } from '../../helpers/const';
import { offerToPoint } from '../../helpers/util';
import { City, Point, State, Offer } from '../../types';

const defaultPointerIcon = new Icon({
  iconUrl: PointerImage.DEFAULT,
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const activePointerIcon = new Icon({
  iconUrl: PointerImage.ACTIVE,
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

type MarkerWithId = {
  instance: Marker<object>;
  id: Offer['id'];
};

type MapProps = {
  city: City;
  points: Point[];
};

function Map({ city, points }: MapProps): JSX.Element {
  // Map references
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  // Map markers. Needs in the second effect, that changes marker's 'activePointerIcon'
  const [mapMarkers, setMapMarkers] = useState<MarkerWithId[]>([]);
  // Active point that is taken from global store
  const activePoint = useSelector((state: State) =>
    state.activeOffer ? offerToPoint(state.activeOffer) : state.activeOffer,
  );

  // Merges points and activePoint in one array if needed
  const shouldAddActivePoint = activePoint && !points.find((point) => point.id === activePoint.id);
  const allPoints = useMemo(
    () => (shouldAddActivePoint ? [...points, activePoint] : points),
    [activePoint, points, shouldAddActivePoint],
  );

  // Finds out if points prop has changed or not to understand should rerender mapPoints or not
  const [prevPointsIds, setPrevPointsIds] = useState<Offer['id'][] | undefined>();
  const pointsIds = allPoints.map((point) => point.id);
  const havePointsPropChanged = !(
    prevPointsIds &&
    allPoints.length === prevPointsIds.length &&
    allPoints.every((point) => prevPointsIds.includes(point.id))
  );

  //* Effects
  // Effect that renders markers on the map ONLY when points prop changes or mapRef created
  useEffect(() => {
    if (!map || !havePointsPropChanged) {
      return;
    }
    setPrevPointsIds(pointsIds);

    // Creates new markers and adds them to map and to state (for further second effect)
    const curMarkers: MarkerWithId[] = [];
    allPoints.forEach((point) => {
      const markerIcon = activePoint?.id === point.id ? activePointerIcon : defaultPointerIcon;

      const marker = new Marker<object>({
        lat: point.latitude,
        lng: point.longitude,
      });

      marker.setIcon(markerIcon).addTo(map);

      curMarkers.push({ instance: marker, id: point.id });
    });
    setMapMarkers(curMarkers);

    // Cleans mapMarkers for the new one (if needed)
    return () => {
      if (!havePointsPropChanged || !prevPointsIds) {
        return;
      }

      mapMarkers.forEach((marker) => {
        marker.instance.removeFrom(map);
      });
    };
  }, [
    map,
    activePoint,
    havePointsPropChanged,
    pointsIds,
    prevPointsIds,
    mapMarkers,
    shouldAddActivePoint,
    allPoints,
  ]);

  // Effect that changes point's 'activePointerIcon', if 'activeOffer' state changes
  useEffect(() => {
    mapMarkers.forEach((marker) => {
      const markerIcon = activePoint?.id === marker.id ? activePointerIcon : defaultPointerIcon;
      marker.instance.getElement()?.setAttribute('src', markerIcon.options.iconUrl);
    });
  }, [activePoint, mapMarkers]);

  return <div style={{ height: '100%' }} ref={mapRef}></div>;
}

export default Map;
