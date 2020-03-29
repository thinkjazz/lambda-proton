import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, F as create_component, G as claim_component, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, E as empty, n as insert_dev, q as check_outros, j as detach_dev, p as group_outros } from './client.43c0941f.js';
import './CardBody.bfdab95b.js';
import './CardHeader.0a93488c.js';
import './CardFooter.068c7ab7.js';
import './FormGroup.5fcdb989.js';
import UI from './ui.7f7a301c.js';

/* src\routes\pages\ui\_layout.svelte generated by Svelte v3.18.1 */

// (8:0) {#if segment === 'ui'}
function create_if_block(ctx) {
	let current;
	const ui = new UI({ $$inline: true });

	const block = {
		c: function create() {
			create_component(ui.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(ui.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(ui, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(ui.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(ui.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(ui, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(8:0) {#if segment === 'ui'}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*segment*/ ctx[0] === "ui" && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*segment*/ ctx[0] === "ui") {
				if (!if_block) {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				} else {
					transition_in(if_block, 1);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function instance($$self, $$props, $$invalidate) {
	let { segment } = $$props;
	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	$$self.$capture_state = () => {
		return { segment };
	};

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	return [segment];
}

class Layout extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Layout",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Layout> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Layout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xheW91dC4zYmYyYTRlNS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9wYWdlcy91aS9fbGF5b3V0LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBVSSBmcm9tIFwiLi91aS5zdmVsdGVcIjtcclxuXHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuPC9zY3JpcHQ+XHJcblxyXG57I2lmIHNlZ21lbnQgPT09ICd1aSd9XHJcbiAgPFVJIC8+XHJcbnsvaWZ9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFPSyxHQUFPLFFBQUssSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7bUJBQWhCLEdBQU8sUUFBSyxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BSFIsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
