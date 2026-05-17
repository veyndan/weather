"use strict";

// noinspection ES6UnusedImports
import LocationCardElement from "./location-card.js";

navigator.permissions
	.query({name: `geolocation`})
	.then((permissionStatus) => {
		function setGeolocationElement() {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const buttonElement = document.querySelector(`button`)
					if (buttonElement !== null) {
						buttonElement.remove();
					}
					const locationCardElement = (/** @type {LocationCardElement} */ (document.createElement(`veyndan-location-card`)));
					document.querySelector(`section`).append(locationCardElement);
					const url = new URL(`https://api.open-meteo.com/v1/forecast`);
					url.searchParams.set(`latitude`, position.coords.latitude.toString());
					url.searchParams.set(`longitude`, position.coords.longitude.toString());
					url.searchParams.append(`current`, `temperature_2m`);
					const locationResponse = await fetch(`https://photon.komoot.io/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
					if (locationResponse.ok) {
						const locationData = await locationResponse.json();
						const cityElement = document.createElement(`h1`);
						cityElement.slot = `city`;
						cityElement.textContent = locationData[`features`][0][`properties`][`city`];
						locationCardElement.append(cityElement);
					} else {
						// TODO
					}
					const response = await fetch(url);
					if (response.ok) {
						const weatherData = await response.json();
						const temperatureElement = document.createElement(`span`);
						temperatureElement.slot = `temperature`;
						temperatureElement.textContent = `${Math.round(weatherData.current.temperature_2m)}°`;
						locationCardElement.append(temperatureElement);
					} else {
						// TODO
					}
				},
				(error) => {
					console.log(`Unable to retrieve your location due to ${error.code}: ${error.message}`);
				},
				{
					enableHighAccuracy: true,
					maximumAge: 30000,
					timeout: 27000,
				},
			);
		}

		switch (permissionStatus.state) {
			case `prompt`:
				const buttonElement = document.createElement(`button`);
				buttonElement.type = `button`;
				buttonElement.textContent = `Update location permissions`;
				document.querySelector(`section`).append(buttonElement)
				buttonElement.addEventListener(`click`, event => {
					setGeolocationElement();
				});
				break;
			case `granted`:
				setGeolocationElement();
				break;
			case `denied`:
				document.querySelector(`section`).innerText = `Location permission denied.`
				break;
		}
	});
