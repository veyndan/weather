"use strict";

navigator.permissions
	.query({name: `geolocation`})
	.then((permissionStatus) => {
		function setGeolocationElement() {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					document.querySelector(`section > article`).textContent = `Getting temperature…`;
					const url = new URL(`https://api.open-meteo.com/v1/forecast`);
					url.searchParams.set(`latitude`, position.coords.latitude.toString());
					url.searchParams.set(`longitude`, position.coords.longitude.toString());
					url.searchParams.append(`current`, `temperature_2m`);
					const response = await fetch(url);
					if (response.ok) {
						const weatherData = await response.json();
						document.querySelector(`section > article`).textContent = `${Math.round(weatherData.current.temperature_2m)}${weatherData.current_units.temperature_2m}`;
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
					(/** @type {HTMLButtonElement} */ (event.currentTarget)).remove();
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
