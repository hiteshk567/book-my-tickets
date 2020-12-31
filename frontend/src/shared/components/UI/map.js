import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "./map.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    // const map = new window.google.maps.Map(mapRef.current, {
    //   center: center,
    //   zoom: zoom
    // });

    // new window.google.maps.Marker({ position: center, map: map });
    // let center;

    // const fetchData = async () => {
    //   const response = await axios.get(
    //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.address}.json?access_token=${process.env.REACT_APP_API_KEY}`
    //   );

    //   center = response.data.features[0].geometry.coordinates;
    // };

    // fetchData();

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    console.log(props);
    var map = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
    });

    let marker = new mapboxgl.Marker().setLngLat(center).addTo(map);
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
