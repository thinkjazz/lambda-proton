import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as create_slot, a as assign, c as clean, e as exclude_internal_props, b as clsx, f as element, g as claim_element, h as children, j as detach_dev, m as set_attributes, l as add_location, n as insert_dev, w as get_slot_context, x as get_slot_changes, u as get_spread_update, r as transition_in, t as transition_out } from './client.92c2c682.js';

/* node_modules\sveltestrap\src\ButtonGroup.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\ButtonGroup.svelte";

function create_fragment(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
	let div_levels = [/*props*/ ctx[2], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[1] }];
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
			div = claim_element(nodes, "DIV", { id: true, class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file, 19, 0, 380);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 128) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[7], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 4 && /*props*/ ctx[2],
				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
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
	let { id = "" } = $$props;
	let { size = "" } = $$props;
	let { vertical = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
		if ("size" in $$new_props) $$invalidate(4, size = $$new_props.size);
		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, id, size, vertical, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
		if ("size" in $$props) $$invalidate(4, size = $$new_props.size);
		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, size, vertical*/ 56) {
			 $$invalidate(1, classes = clsx(className, size ? `btn-group-${size}` : false, vertical ? "btn-group-vertical" : "btn-group"));
		}
	};

	$$props = exclude_internal_props($$props);
	return [id, classes, props, className, size, vertical, $$props, $$scope, $$slots];
}

class ButtonGroup extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { class: 3, id: 0, size: 4, vertical: 5 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ButtonGroup",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get vertical() {
		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set vertical(value) {
		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { ButtonGroup as B };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uR3JvdXAuZjNlYTNjNjIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQnV0dG9uR3JvdXAuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgdmVydGljYWwgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBzaXplID8gYGJ0bi1ncm91cC0ke3NpemV9YCA6IGZhbHNlLFxuICAgIHZlcnRpY2FsID8gJ2J0bi1ncm91cC12ZXJ0aWNhbCcgOiAnYnRuLWdyb3VwJ1xuICApO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQUlNLFNBQVMsR0FBRyxFQUFFO09BRVAsRUFBRSxHQUFHLEVBQUU7T0FDUCxJQUFJLEdBQUcsRUFBRTtPQUNULFFBQVEsR0FBRyxLQUFLO09BRXJCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXhCLE9BQU8sR0FBRyxJQUFJLENBQ2YsU0FBUyxFQUNULElBQUksZ0JBQWdCLElBQUksS0FBSyxLQUFLLEVBQ2xDLFFBQVEsR0FBRyxvQkFBb0IsR0FBRyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
