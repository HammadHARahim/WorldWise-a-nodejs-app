import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import Button from "../components/Button";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
	const [mapPosition, setMapPosition] = useState([40, 0]);
	const { cities } = useCities();
	const {
		isLoading: isLoadingPostion,
		position: geoLocationPosition,
		getPosition,
	} = useGeoLocation();
	const [mapLat, mapLng] = useUrlPosition();

	useEffect(
		function () {
			if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
		},
		[mapLat, mapLng]
	);

	useEffect(
		function () {
			if (geoLocationPosition)
				setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
		},
		[geoLocationPosition]
	);

	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPostion ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer
				center={mapPosition}
				zoom={13}
				scrollWheelZoom={true}
				className={styles.map}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
					crossOrigin="anonymous"
				/>
				{cities.map((city) => {
					return (
						<Marker
							position={[city.position.lat, city.position.lng]}
							key={city.id}
						>
							<Popup>
								<span>{city.emoji}</span> <span>{city.cityName}</span>
							</Popup>
						</Marker>
					);
				})}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
}
export default Map;
