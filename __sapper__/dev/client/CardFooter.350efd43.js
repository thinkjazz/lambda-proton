import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as create_slot, a as assign, c as clean, e as exclude_internal_props, b as clsx, f as element, g as claim_element, h as children, j as detach_dev, m as set_attributes, l as add_location, n as insert_dev, w as get_slot_context, x as get_slot_changes, u as get_spread_update, r as transition_in, t as transition_out } from './client.478bca49.js';

/* node_modules\sveltestrap\src\CardFooter.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\CardFooter.svelte";

function create_fragment(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
	let div_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file, 12, 0, 219);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 16) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[4], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
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
	let { class: className = "" } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className*/ 4) {
			 $$invalidate(0, classes = clsx(className, "card-footer"));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, $$props, $$scope, $$slots];
}

class CardFooter extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { class: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CardFooter",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<CardFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<CardFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { CardFooter as C };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyZEZvb3Rlci4zNTBlZmQ0My5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9DYXJkRm9vdGVyLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCAnY2FyZC1mb290ZXInKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Y0FJTSxTQUFTLEdBQUcsRUFBRTtPQUdaLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXhCLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
