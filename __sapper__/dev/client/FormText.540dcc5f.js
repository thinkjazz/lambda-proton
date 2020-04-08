import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as create_slot, a as assign, c as clean, e as exclude_internal_props, b as clsx, f as element, g as claim_element, h as children, j as detach_dev, m as set_attributes, l as add_location, n as insert_dev, w as get_slot_context, x as get_slot_changes, u as get_spread_update, r as transition_in, t as transition_out } from './client.fc2a4c24.js';

/* node_modules\sveltestrap\src\FormText.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\FormText.svelte";

function create_fragment(ctx) {
	let small;
	let current;
	const default_slot_template = /*$$slots*/ ctx[7].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
	let small_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let small_data = {};

	for (let i = 0; i < small_levels.length; i += 1) {
		small_data = assign(small_data, small_levels[i]);
	}

	const block = {
		c: function create() {
			small = element("small");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			small = claim_element(nodes, "SMALL", { class: true });
			var small_nodes = children(small);
			if (default_slot) default_slot.l(small_nodes);
			small_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(small, small_data);
			add_location(small, file, 18, 0, 343);
		},
		m: function mount(target, anchor) {
			insert_dev(target, small, anchor);

			if (default_slot) {
				default_slot.m(small, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 64) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
			}

			set_attributes(small, get_spread_update(small_levels, [
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
			if (detaching) detach_dev(small);
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
	let { inline = false } = $$props;
	let { color = "muted" } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("inline" in $$new_props) $$invalidate(3, inline = $$new_props.inline);
		if ("color" in $$new_props) $$invalidate(4, color = $$new_props.color);
		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, inline, color, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("inline" in $$props) $$invalidate(3, inline = $$new_props.inline);
		if ("color" in $$props) $$invalidate(4, color = $$new_props.color);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, inline, color*/ 28) {
			 $$invalidate(0, classes = clsx(className, !inline ? "form-text" : false, color ? `text-${color}` : false));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, inline, color, $$props, $$scope, $$slots];
}

class FormText extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { class: 2, inline: 3, color: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FormText",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<FormText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<FormText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inline() {
		throw new Error("<FormText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inline(value) {
		throw new Error("<FormText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<FormText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<FormText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { FormText as F };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybVRleHQuNTQwZGNjNWYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRm9ybVRleHQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaW5saW5lID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnbXV0ZWQnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgICFpbmxpbmUgPyAnZm9ybS10ZXh0JyA6IGZhbHNlLFxuICAgIGNvbG9yID8gYHRleHQtJHtjb2xvcn1gIDogZmFsc2VcbiAgKTtcbjwvc2NyaXB0PlxuXG48c21hbGwgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L3NtYWxsPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NBSU0sU0FBUyxHQUFHLEVBQUU7T0FFUCxNQUFNLEdBQUcsS0FBSztPQUNkLEtBQUssR0FBRyxPQUFPO09BRXBCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUV4QixPQUFPLEdBQUcsSUFBSSxDQUNmLFNBQVMsR0FDUixNQUFNLEdBQUcsV0FBVyxHQUFHLEtBQUssRUFDN0IsS0FBSyxXQUFXLEtBQUssS0FBSyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
