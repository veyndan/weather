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
			display: flex;
			gap: 16px;
			justify-content: space-between;

			> slot::slotted(*[slot="city"]),
			> slot[name="city"] > * {
				font-size: 1.5rem;
				margin: 0;
			}

			> slot[name="temperature"] {
				font-size: 3rem;
				font-weight: 800;
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
