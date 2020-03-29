import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, E as empty, n as insert_dev, t as transition_out, q as check_outros, r as transition_in, j as detach_dev, p as group_outros, F as create_component, G as claim_component, H as mount_component, I as destroy_component } from './client.221e1529.js';
import './Image.765dd22b.js';
import Error401 from './error_401.ac31e628.js';
import Error404 from './error_404.ade9c09f.js';
import Error500 from './error_500.0e32b678.js';

/* src\routes\pages\error\_layout.svelte generated by Svelte v3.18.1 */

// (13:34) 
function create_if_block_2(ctx) {
	let current;
	const error500 = new Error500({ $$inline: true });

	const block = {
		c: function create() {
			create_component(error500.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(error500.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(error500, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error500.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error500.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(error500, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(13:34) ",
		ctx
	});

	return block;
}

// (11:34) 
function create_if_block_1(ctx) {
	let current;
	const error404 = new Error404({ $$inline: true });

	const block = {
		c: function create() {
			create_component(error404.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(error404.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(error404, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error404.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error404.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(error404, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(11:34) ",
		ctx
	});

	return block;
}

// (9:0) {#if segment === 'error_401'}
function create_if_block(ctx) {
	let current;
	const error401 = new Error401({ $$inline: true });

	const block = {
		c: function create() {
			create_component(error401.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(error401.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(error401, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error401.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error401.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(error401, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(9:0) {#if segment === 'error_401'}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*segment*/ ctx[0] === "error_401") return 0;
		if (/*segment*/ ctx[0] === "error_404") return 1;
		if (/*segment*/ ctx[0] === "error_500") return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

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
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index !== previous_block_index) {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				} else {
					if_block = null;
				}
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
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xheW91dC43ZGYzZjdiNS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9wYWdlcy9lcnJvci9fbGF5b3V0LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBFcnJvcjQwMSBmcm9tIFwiLi9lcnJvcl80MDEuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEVycm9yNDA0IGZyb20gXCIuL2Vycm9yXzQwNC5zdmVsdGVcIjtcclxuICBpbXBvcnQgRXJyb3I1MDAgZnJvbSBcIi4vZXJyb3JfNTAwLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcbjwvc2NyaXB0PlxyXG5cclxueyNpZiBzZWdtZW50ID09PSAnZXJyb3JfNDAxJ31cclxuICA8RXJyb3I0MDEgLz5cclxuezplbHNlIGlmIHNlZ21lbnQgPT09ICdlcnJvcl80MDQnfVxyXG4gIDxFcnJvcjQwNCAvPlxyXG57OmVsc2UgaWYgc2VnbWVudCA9PT0gJ2Vycm9yXzUwMCd9XHJcbiAgPEVycm9yNTAwIC8+XHJcbnsvaWZ9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFRSyxHQUFPLFFBQUssV0FBVztrQkFFbEIsR0FBTyxRQUFLLFdBQVc7a0JBRXZCLEdBQU8sUUFBSyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BUHBCLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
