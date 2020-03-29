import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, E as empty, n as insert_dev, t as transition_out, q as check_outros, r as transition_in, j as detach_dev, p as group_outros, F as create_component, G as claim_component, H as mount_component, I as destroy_component } from './client.ac42dabc.js';
import './CardBody.f9bdd0fd.js';
import './CardHeader.89df110d.js';
import './Row.88d2baec.js';
import './CardFooter.c0245136.js';
import './Image.95c5a54f.js';
import './FormGroup.1003c3f0.js';
import Login from './login.e828aa36.js';
import './Col.53d04c04.js';
import Register from './register.394746ba.js';
import ForgetPassword from './forget_password.29f506ee.js';

/* src\routes\pages\authentication\_layout.svelte generated by Svelte v3.18.1 */

// (13:40) 
function create_if_block_2(ctx) {
	let current;
	const forgetpassword = new ForgetPassword({ $$inline: true });

	const block = {
		c: function create() {
			create_component(forgetpassword.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(forgetpassword.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(forgetpassword, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(forgetpassword.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(forgetpassword.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(forgetpassword, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(13:40) ",
		ctx
	});

	return block;
}

// (11:33) 
function create_if_block_1(ctx) {
	let current;
	const register = new Register({ $$inline: true });

	const block = {
		c: function create() {
			create_component(register.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(register.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(register, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(register.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(register.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(register, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(11:33) ",
		ctx
	});

	return block;
}

// (9:0) {#if segment === 'login'}
function create_if_block(ctx) {
	let current;
	const login = new Login({ $$inline: true });

	const block = {
		c: function create() {
			create_component(login.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(login.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(login, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(login.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(login.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(login, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(9:0) {#if segment === 'login'}",
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
		if (/*segment*/ ctx[0] === "login") return 0;
		if (/*segment*/ ctx[0] === "register") return 1;
		if (/*segment*/ ctx[0] === "forget_password") return 2;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2xheW91dC40MmIyYTAyOS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9wYWdlcy9hdXRoZW50aWNhdGlvbi9fbGF5b3V0LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGltcG9ydCBMb2dpbiBmcm9tIFwiLi9sb2dpbi5zdmVsdGVcIjtcclxuICBpbXBvcnQgUmVnaXN0ZXIgZnJvbSBcIi4vcmVnaXN0ZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEZvcmdldFBhc3N3b3JkIGZyb20gXCIuL2ZvcmdldF9wYXNzd29yZC5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG48L3NjcmlwdD5cclxuXHJcbnsjaWYgc2VnbWVudCA9PT0gJ2xvZ2luJ31cclxuICA8TG9naW4gLz5cclxuezplbHNlIGlmIHNlZ21lbnQgPT09ICdyZWdpc3Rlcid9XHJcbiAgPFJlZ2lzdGVyIC8+XHJcbns6ZWxzZSBpZiBzZWdtZW50ID09PSAnZm9yZ2V0X3Bhc3N3b3JkJ31cclxuICA8Rm9yZ2V0UGFzc3dvcmQgLz5cclxuey9pZn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQVFLLEdBQU8sUUFBSyxPQUFPO2tCQUVkLEdBQU8sUUFBSyxVQUFVO2tCQUV0QixHQUFPLFFBQUssaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BUDFCLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
