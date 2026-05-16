"use strict";

document.querySelector(`button`).addEventListener(`click`, () => {
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			document.querySelector(`body`).innerText = `Getting temperature…`;
			const url = new URL(`https://api.open-meteo.com/v1/forecast`);
			url.searchParams.set(`latitude`, position.coords.latitude.toString());
			url.searchParams.set(`longitude`, position.coords.longitude.toString());
			url.searchParams.append(`current`, `temperature_2m`);
			const response = await fetch(url);
			if (response.ok) {
				const weatherData = await response.json();
				document.querySelector(`body`).innerText = `${weatherData.current.temperature_2m}${weatherData.current_units.temperature_2m}`;
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
});
