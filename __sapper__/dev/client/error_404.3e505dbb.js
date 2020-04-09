import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, F as create_component, J as space, f as element, y as text, G as claim_component, K as claim_space, g as claim_element, h as children, z as claim_text, j as detach_dev, k as attr_dev, l as add_location, H as mount_component, n as insert_dev, o as append_dev, B as noop, r as transition_in, t as transition_out, I as destroy_component } from './client.8a6fa27b.js';
import { I as Image } from './Image.8ead298c.js';

/* src\routes\pages\error\error_404.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\pages\\error\\error_404.svelte";

function create_fragment(ctx) {
	let t0;
	let p;
	let t1;
	let t2;
	let a;
	let i;
	let t3;
	let current;

	const image = new Image({
			props: {
				class: "mb-4 img-error",
				src: "./error-404-monochrome.svg",
				alt: "error_image"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(image.$$.fragment);
			t0 = space();
			p = element("p");
			t1 = text("This requested URL was not found on this server.");
			t2 = space();
			a = element("a");
			i = element("i");
			t3 = text("\n  Return to Dashboard");
			this.h();
		},
		l: function claim(nodes) {
			claim_component(image.$$.fragment, nodes);
			t0 = claim_space(nodes);
			p = claim_element(nodes, "P", { class: true });
			var p_nodes = children(p);
			t1 = claim_text(p_nodes, "This requested URL was not found on this server.");
			p_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			t3 = claim_text(a_nodes, "\n  Return to Dashboard");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(p, "class", "lead");
			add_location(p, file, 8, 0, 168);
			attr_dev(i, "class", "fas fa-arrow-left");
			add_location(i, file, 10, 2, 252);
			attr_dev(a, "href", ".");
			add_location(a, file, 9, 0, 237);
		},
		m: function mount(target, anchor) {
			mount_component(image, target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, p, anchor);
			append_dev(p, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, a, anchor);
			append_dev(a, i);
			append_dev(a, t3);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(image.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(image.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(image, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(p);
			if (detaching) detach_dev(t2);
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

class Error_404 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Error_404",
			options,
			id: create_fragment.name
		});
	}
}

export default Error_404;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfNDA0LjNlNTA1ZGJiLmpzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
