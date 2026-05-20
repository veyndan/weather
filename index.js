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
					url.searchParams.append(`timezone`, `auto`);
					url.searchParams.append(`current`, `temperature_2m,weather_code`);
					url.searchParams.append(`daily`, `temperature_2m_min,temperature_2m_max`);
					console.log(url);
					const locationResponse = await fetch(`https://photon.komoot.io/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
					if (locationResponse.ok) {
						const locationData = await locationResponse.json();
						const cityElement = document.createElement(`h1`);
						cityElement.slot = `city`;
						cityElement.textContent = locationData[`features`][0][`properties`][`city`];
						const countryElement = document.createElement(`span`);
						countryElement.slot = `country`;
						countryElement.textContent = locationData[`features`][0][`properties`][`country`];
						locationCardElement.append(cityElement, countryElement);
					} else {
						// TODO
					}
					const response = await fetch(url);
					if (response.ok) {
						const weatherData = await response.json();
						const meteorologicalConditionElement = document.createElement(`span`);
						meteorologicalConditionElement.slot = `meteorological-condition`;
						const wmoMeteorologicalCodeToDescription = new Map(
							[
								[0, `Clear`],
								[1, `Mostly clear`],
								[2, `Partly cloudy`],
								[3, `Overcast`],
								[45, `Fog`],
								[48, `Icy fog`],
								[51, `Light drizzle`],
								[53, `Drizzle`],
								[55, `Heavy drizzle`],
								[56, `Light freezing drizzle`],
								[57, `Freezing drizzle`],
								[61, `Light rain`],
								[63, `Rain`],
								[65, `Heavy rain`],
								[66, `Light freezing rain`],
								[67, `Freezing rain`],
								[71, `Light snow`],
								[73, `Snow`],
								[75, `Heavy snow`],
								[77, `Snow grains`],
								[80, `Light showers`],
								[81, `Showers`],
								[82, `Heavy showers`],
								[85, `Light snow showers`],
								[86, `Snow showers`],
								[95, `Thunderstorm`],
								[96, `Thunderstorm with light hail`],
								[99, `Thunderstorm with hail`],
							]
						);
						meteorologicalConditionElement.textContent = wmoMeteorologicalCodeToDescription.get(parseInt(weatherData.current.weather_code));
						const temperatureElement = document.createElement(`span`);
						temperatureElement.slot = `temperature`;
						temperatureElement.textContent = `${Math.round(weatherData.current.temperature_2m)}°`;
						const temperatureRangeElement = document.createElement(`span`);
						temperatureRangeElement.slot = `temperature-range`;
						temperatureRangeElement.textContent = `High ${Math.round(weatherData.daily.temperature_2m_max[0])}° · Low ${Math.round(weatherData.daily.temperature_2m_min[0])}°`;
						locationCardElement.append(meteorologicalConditionElement, temperatureElement, temperatureRangeElement);
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
