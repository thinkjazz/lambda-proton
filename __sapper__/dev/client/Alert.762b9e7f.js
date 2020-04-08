import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, c as clean, a as assign, e as exclude_internal_props, b as clsx, f as element, J as space, g as claim_element, h as children, K as claim_space, j as detach_dev, m as set_attributes, l as add_location, n as insert_dev, o as append_dev, p as group_outros, t as transition_out, q as check_outros, r as transition_in, u as get_spread_update, _ as add_render_callback, $ as create_bidirectional_transition, a0 as fade, y as text, z as claim_text, k as attr_dev, C as listen_dev, E as empty, v as create_slot, w as get_slot_context, x as get_slot_changes, A as set_data_dev, B as noop } from './client.7218ed3c.js';

/* node_modules\sveltestrap\src\Alert.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\Alert.svelte";

// (25:0) {#if isOpen}
function create_if_block(ctx) {
	let div;
	let t;
	let current_block_type_index;
	let if_block1;
	let div_transition;
	let current;
	let if_block0 = /*toggle*/ ctx[3] && create_if_block_2(ctx);
	const if_block_creators = [create_if_block_1, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*children*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	let div_levels = [/*props*/ ctx[7], { class: /*classes*/ ctx[5] }, { role: "alert" }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (if_block0) if_block0.c();
			t = space();
			if_block1.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true, role: true });
			var div_nodes = children(div);
			if (if_block0) if_block0.l(div_nodes);
			t = claim_space(div_nodes);
			if_block1.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file, 25, 2, 684);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block0) if_block0.m(div, null);
			append_dev(div, t);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*toggle*/ ctx[3]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					if_block0.m(div, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				}

				transition_in(if_block1, 1);
				if_block1.m(div, null);
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 128 && /*props*/ ctx[7],
				dirty & /*classes*/ 32 && { class: /*classes*/ ctx[5] },
				{ role: "alert" }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);

			add_render_callback(() => {
				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
				div_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
			div_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block0) if_block0.d();
			if_blocks[current_block_type_index].d();
			if (detaching && div_transition) div_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(25:0) {#if isOpen}",
		ctx
	});

	return block;
}

// (31:4) {#if toggle}
function create_if_block_2(ctx) {
	let button;
	let span;
	let t;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			span = element("span");
			t = text("×");
			this.h();
		},
		l: function claim(nodes) {
			button = claim_element(nodes, "BUTTON", {
				type: true,
				class: true,
				"aria-label": true
			});

			var button_nodes = children(button);
			span = claim_element(button_nodes, "SPAN", { "aria-hidden": true });
			var span_nodes = children(span);
			t = claim_text(span_nodes, "×");
			span_nodes.forEach(detach_dev);
			button_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span, "aria-hidden", "true");
			add_location(span, file, 36, 8, 941);
			attr_dev(button, "type", "button");
			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
			add_location(button, file, 31, 6, 808);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, span);
			append_dev(span, t);
			dispose = listen_dev(button, "click", /*toggle*/ ctx[3], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*closeClassNames*/ 64) {
				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
			}

			if (dirty & /*closeAriaLabel*/ 2) {
				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(31:4) {#if toggle}",
		ctx
	});

	return block;
}

// (42:4) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8192) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
			}
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
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(42:4) {:else}",
		ctx
	});

	return block;
}

// (40:4) {#if children}
function create_if_block_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text(/*children*/ ctx[0]);
		},
		l: function claim(nodes) {
			t = claim_text(nodes, /*children*/ ctx[0]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(40:4) {#if children}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*isOpen*/ ctx[2] && create_if_block(ctx);

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
			if (/*isOpen*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
	let { class: className = "" } = $$props;
	let { children = undefined } = $$props;
	let { color = "success" } = $$props;
	let { closeClassName = "" } = $$props;
	let { closeAriaLabel = "Close" } = $$props;
	let { isOpen = true } = $$props;
	let { toggle = undefined } = $$props;
	let { fade = true } = $$props;
	let { transition = { duration: fade ? 400 : 0 } } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
		if ("color" in $$new_props) $$invalidate(9, color = $$new_props.color);
		if ("closeClassName" in $$new_props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
		if ("isOpen" in $$new_props) $$invalidate(2, isOpen = $$new_props.isOpen);
		if ("toggle" in $$new_props) $$invalidate(3, toggle = $$new_props.toggle);
		if ("fade" in $$new_props) $$invalidate(11, fade = $$new_props.fade);
		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			children,
			color,
			closeClassName,
			closeAriaLabel,
			isOpen,
			toggle,
			fade,
			transition,
			classes,
			closeClassNames
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
		if ("color" in $$props) $$invalidate(9, color = $$new_props.color);
		if ("closeClassName" in $$props) $$invalidate(10, closeClassName = $$new_props.closeClassName);
		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
		if ("isOpen" in $$props) $$invalidate(2, isOpen = $$new_props.isOpen);
		if ("toggle" in $$props) $$invalidate(3, toggle = $$new_props.toggle);
		if ("fade" in $$props) $$invalidate(11, fade = $$new_props.fade);
		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
		if ("classes" in $$props) $$invalidate(5, classes = $$new_props.classes);
		if ("closeClassNames" in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
	};

	let classes;
	let closeClassNames;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, color, toggle*/ 776) {
			 $$invalidate(5, classes = clsx(className, "alert", `alert-${color}`, { "alert-dismissible": toggle }));
		}

		if ($$self.$$.dirty & /*closeClassName*/ 1024) {
			 $$invalidate(6, closeClassNames = clsx("close", closeClassName));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		children,
		closeAriaLabel,
		isOpen,
		toggle,
		transition,
		classes,
		closeClassNames,
		props,
		className,
		color,
		closeClassName,
		fade,
		$$props,
		$$scope,
		$$slots
	];
}

class Alert extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			class: 8,
			children: 0,
			color: 9,
			closeClassName: 10,
			closeAriaLabel: 1,
			isOpen: 2,
			toggle: 3,
			fade: 11,
			transition: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Alert",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get children() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set children(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get closeClassName() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set closeClassName(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get closeAriaLabel() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set closeAriaLabel(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isOpen() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isOpen(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggle() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggle(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fade() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fade(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get transition() {
		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set transition(value) {
		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { Alert as A };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWxlcnQuNzYyYjllN2YuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQWxlcnQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGZhZGUgYXMgZmFkZVRyYW5zaXRpb24gfSBmcm9tICdzdmVsdGUvdHJhbnNpdGlvbic7XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgY2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnc3VjY2Vzcyc7XG4gIGV4cG9ydCBsZXQgY2xvc2VDbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IGxldCBjbG9zZUFyaWFMYWJlbCA9ICdDbG9zZSc7XG4gIGV4cG9ydCBsZXQgaXNPcGVuID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCB0b2dnbGUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgZmFkZSA9IHRydWU7XG4gIGV4cG9ydCBsZXQgdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IGZhZGUgPyA0MDAgOiAwIH07XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICdhbGVydCcsIGBhbGVydC0ke2NvbG9yfWAsIHtcbiAgICAnYWxlcnQtZGlzbWlzc2libGUnOiB0b2dnbGVcbiAgfSk7XG4gICQ6IGNsb3NlQ2xhc3NOYW1lcyA9IGNsc3goJ2Nsb3NlJywgY2xvc2VDbGFzc05hbWUpO1xuPC9zY3JpcHQ+XG5cbnsjaWYgaXNPcGVufVxuICA8ZGl2XG4gICAgey4uLnByb3BzfVxuICAgIHRyYW5zaXRpb246ZmFkZVRyYW5zaXRpb249e3RyYW5zaXRpb259XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgcm9sZT1cImFsZXJ0XCI+XG4gICAgeyNpZiB0b2dnbGV9XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzcz17Y2xvc2VDbGFzc05hbWVzfVxuICAgICAgICBhcmlhLWxhYmVsPXtjbG9zZUFyaWFMYWJlbH1cbiAgICAgICAgb246Y2xpY2s9e3RvZ2dsZX0+XG4gICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgey9pZn1cbiAgICB7I2lmIGNoaWxkcmVufVxuICAgICAge2NoaWxkcmVufVxuICAgIHs6ZWxzZX1cbiAgICAgIDxzbG90IC8+XG4gICAgey9pZn1cbiAgPC9kaXY+XG57L2lmfVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aURBaUNlLEdBQWU7cURBQ1YsR0FBYzs7Ozs7Ozs7Ozs7a0RBRG5CLEdBQWU7Ozs7c0RBQ1YsR0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQVY3QixHQUFNOzs7Ozs7Ozs7Ozs7Ozs7OztrQkFBTixHQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQW5CTCxTQUFTLEdBQUcsRUFBRTtPQUVQLFFBQVEsR0FBRyxTQUFTO09BQ3BCLEtBQUssR0FBRyxTQUFTO09BQ2pCLGNBQWMsR0FBRyxFQUFFO09BQ25CLGNBQWMsR0FBRyxPQUFPO09BQ3hCLE1BQU0sR0FBRyxJQUFJO09BQ2IsTUFBTSxHQUFHLFNBQVM7T0FDbEIsSUFBSSxHQUFHLElBQUk7T0FDWCxVQUFVLEtBQUssUUFBUSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztPQUU1QyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUV4QixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLFdBQVcsS0FBSyxNQUNsRCxtQkFBbUIsRUFBRSxNQUFNOzs7O29CQUUxQixlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
