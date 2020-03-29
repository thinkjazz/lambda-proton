import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, f as element, y as text, J as space, V as svg_element, g as claim_element, h as children, z as claim_text, j as detach_dev, K as claim_space, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, B as noop } from './client.e312d517.js';

/* src\routes\pages\error\error_401.svelte generated by Svelte v3.18.1 */

const file = "src\\routes\\pages\\error\\error_401.svelte";

function create_fragment(ctx) {
	let h1;
	let t0;
	let t1;
	let p0;
	let t2;
	let t3;
	let p1;
	let t4;
	let t5;
	let a;
	let svg;
	let path;
	let t6;

	const block = {
		c: function create() {
			h1 = element("h1");
			t0 = text("401");
			t1 = space();
			p0 = element("p");
			t2 = text("Unauthorized");
			t3 = space();
			p1 = element("p");
			t4 = text("Access to this resource is denied.");
			t5 = space();
			a = element("a");
			svg = svg_element("svg");
			path = svg_element("path");
			t6 = text("\r\n  \r\n  Return to Dashboard");
			this.h();
		},
		l: function claim(nodes) {
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, "401");
			h1_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			p0 = claim_element(nodes, "P", { class: true });
			var p0_nodes = children(p0);
			t2 = claim_text(p0_nodes, "Unauthorized");
			p0_nodes.forEach(detach_dev);
			t3 = claim_space(nodes);
			p1 = claim_element(nodes, "P", {});
			var p1_nodes = children(p1);
			t4 = claim_text(p1_nodes, "Access to this resource is denied.");
			p1_nodes.forEach(detach_dev);
			t5 = claim_space(nodes);
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);

			svg = claim_element(
				a_nodes,
				"svg",
				{
					class: true,
					"aria-hidden": true,
					focusable: true,
					"data-prefix": true,
					"data-icon": true,
					role: true,
					xmlns: true,
					viewBox: true,
					"data-fa-i2svg": true
				},
				1
			);

			var svg_nodes = children(svg);
			path = claim_element(svg_nodes, "path", { fill: true, d: true }, 1);
			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			t6 = claim_text(a_nodes, "\r\n  \r\n  Return to Dashboard");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "display-1");
			add_location(h1, file, 0, 0, 0);
			attr_dev(p0, "class", "lead");
			add_location(p0, file, 1, 0, 32);
			add_location(p1, file, 2, 0, 66);
			attr_dev(path, "fill", "currentColor");
			attr_dev(path, "d", "M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7\r\n      273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2\r\n      22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0\r\n      13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z");
			add_location(path, file, 14, 4, 389);
			attr_dev(svg, "class", "svg-inline--fa fa-arrow-left fa-w-14");
			attr_dev(svg, "aria-hidden", "true");
			attr_dev(svg, "focusable", "false");
			attr_dev(svg, "data-prefix", "fas");
			attr_dev(svg, "data-icon", "arrow-left");
			attr_dev(svg, "role", "img");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 448 512");
			attr_dev(svg, "data-fa-i2svg", "");
			add_location(svg, file, 4, 2, 125);
			attr_dev(a, "href", ".");
			add_location(a, file, 3, 0, 109);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			append_dev(h1, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, p0, anchor);
			append_dev(p0, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, p1, anchor);
			append_dev(p1, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, a, anchor);
			append_dev(a, svg);
			append_dev(svg, path);
			append_dev(a, t6);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(p0);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(p1);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

class Error_401 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Error_401",
			options,
			id: create_fragment.name
		});
	}
}

export default Error_401;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfNDAxLjdkODEwZjAyLmpzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
