"use strict";

const stylesheet = new CSSStyleSheet();
// language=CSS
stylesheet.replaceSync(`
	:host {
		background: rgb(from currentColor r g b / .1);
		border-radius: 16px;
		padding: 16px;

		> article {
			align-items: center;
			display: grid;
			gap: 16px;
			grid-template:
				"city                     temperature       " auto
				"city                     temperature       " auto
				"meteorological-condition temperature-range " auto /
				 1fr                      auto        ;
			justify-content: space-between;

			> slot::slotted(*[slot="city"]),
			> slot[name="city"] > * {
				font-size: 1.5rem;
				grid-area: city;
				margin: 0;
			}

			> slot::slotted(*[slot="meteorological-condition"]),
			> slot[name="meteorological-condition"] > * {
				font-size: .875rem;
				grid-area: meteorological-condition;
				line-height: 1;
				margin: 0;
			}

			> slot[name="temperature"] {
				font-size: 3rem;
				font-weight: 800;
				grid-area: temperature;
				line-height: 1;
				text-align: end;
			}

			> slot::slotted(*[slot="temperature-range"]),
			> slot[name="temperature-range"] {
				font-size: .875rem;
				grid-area: temperature-range;
				line-height: 1;
				text-align: end;
			}
		}
	}
`);

export default class LocationCardElement extends HTMLElement {
	constructor() {
		super();
		const template = /** @type {HTMLTemplateElement} */ (document.querySelector(`template#card-location`));
		this
			.attachShadow({mode: "open"})
			.appendChild(template.content.cloneNode(true));
		this.shadowRoot.adoptedStyleSheets = [stylesheet];
	}
}

customElements.define("veyndan-location-card", LocationCardElement);
