import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, ac as globals, a as assign, ad as Collapse, c as clean, N as onMount, a2 as onDestroy, e as exclude_internal_props, F as create_component, G as claim_component, H as mount_component, u as get_spread_update, ae as get_spread_object, r as transition_in, t as transition_out, I as destroy_component, D as bubble, v as create_slot, w as get_slot_context, x as get_slot_changes } from './client.cbff4c96.js';

/* node_modules\sveltestrap\src\UncontrolledCollapse.svelte generated by Svelte v3.18.1 */

const { Error: Error_1 } = globals;

// (69:0) <Collapse   {...props}   {isOpen}   on:introstart   on:introend   on:outrostart   on:outroend   on:introstart={onEntering}   on:introend={onEntered}   on:outrostart={onExiting}   on:outroend={onExited}   class={className}>
function create_default_slot(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);

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
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 524288) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[19], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null));
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
		id: create_default_slot.name,
		type: "slot",
		source: "(69:0) <Collapse   {...props}   {isOpen}   on:introstart   on:introend   on:outrostart   on:outroend   on:introstart={onEntering}   on:introend={onEntered}   on:outrostart={onExiting}   on:outroend={onExited}   class={className}>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current;

	const collapse_spread_levels = [
		/*props*/ ctx[6],
		{ isOpen: /*isOpen*/ ctx[5] },
		{ class: /*className*/ ctx[0] }
	];

	let collapse_props = {
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	for (let i = 0; i < collapse_spread_levels.length; i += 1) {
		collapse_props = assign(collapse_props, collapse_spread_levels[i]);
	}

	const collapse = new Collapse({ props: collapse_props, $$inline: true });
	collapse.$on("introstart", /*introstart_handler*/ ctx[15]);
	collapse.$on("introend", /*introend_handler*/ ctx[16]);
	collapse.$on("outrostart", /*outrostart_handler*/ ctx[17]);
	collapse.$on("outroend", /*outroend_handler*/ ctx[18]);
	collapse.$on("introstart", /*onEntering*/ ctx[1]);
	collapse.$on("introend", /*onEntered*/ ctx[2]);
	collapse.$on("outrostart", /*onExiting*/ ctx[3]);
	collapse.$on("outroend", /*onExited*/ ctx[4]);

	const block = {
		c: function create() {
			create_component(collapse.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(collapse.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(collapse, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const collapse_changes = (dirty & /*props, isOpen, className*/ 97)
			? get_spread_update(collapse_spread_levels, [
					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
					dirty & /*isOpen*/ 32 && { isOpen: /*isOpen*/ ctx[5] },
					dirty & /*className*/ 1 && { class: /*className*/ ctx[0] }
				])
			: {};

			if (dirty & /*$$scope*/ 524288) {
				collapse_changes.$$scope = { dirty, ctx };
			}

			collapse.$set(collapse_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(collapse.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(collapse.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(collapse, detaching);
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
	const noop = () => undefined;
	let { class: className = "" } = $$props;
	let { defaultOpen = false } = $$props;
	let { toggler } = $$props;
	let { onEntering = noop } = $$props;
	let { onEntered = noop } = $$props;
	let { onExiting = noop } = $$props;
	let { onExited = noop } = $$props;
	const props = clean($$props);
	let unbindEvents;
	let isOpen = defaultOpen;

	function togglerFn() {
		$$invalidate(5, isOpen = !isOpen);
	}

	const defaultToggleEvents = ["touchstart", "click"];

	onMount(() => {
		if (typeof toggler === "string" && typeof window !== "undefined" && document && document.createElement) {
			let selection = document.querySelectorAll(toggler);

			if (!selection.length) {
				selection = document.querySelectorAll(`#${toggler}`);
			}

			if (!selection.length) {
				throw new Error(`The target '${toggler}' could not be identified in the dom, tip: check spelling`);
			}

			defaultToggleEvents.forEach(event => {
				selection.forEach(element => {
					element.addEventListener(event, togglerFn);
				});
			});

			unbindEvents = () => {
				defaultToggleEvents.forEach(event => {
					selection.forEach(element => {
						element.removeEventListener(event, togglerFn);
					});
				});
			};
		}
	});

	onDestroy(() => {
		if (typeof unbindEvents === "function") {
			unbindEvents();
			unbindEvents = undefined;
		}
	});

	let { $$slots = {}, $$scope } = $$props;

	function introstart_handler(event) {
		bubble($$self, event);
	}

	function introend_handler(event) {
		bubble($$self, event);
	}

	function outrostart_handler(event) {
		bubble($$self, event);
	}

	function outroend_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
		if ("defaultOpen" in $$new_props) $$invalidate(7, defaultOpen = $$new_props.defaultOpen);
		if ("toggler" in $$new_props) $$invalidate(8, toggler = $$new_props.toggler);
		if ("onEntering" in $$new_props) $$invalidate(1, onEntering = $$new_props.onEntering);
		if ("onEntered" in $$new_props) $$invalidate(2, onEntered = $$new_props.onEntered);
		if ("onExiting" in $$new_props) $$invalidate(3, onExiting = $$new_props.onExiting);
		if ("onExited" in $$new_props) $$invalidate(4, onExited = $$new_props.onExited);
		if ("$$scope" in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			defaultOpen,
			toggler,
			onEntering,
			onEntered,
			onExiting,
			onExited,
			unbindEvents,
			isOpen
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
		if ("defaultOpen" in $$props) $$invalidate(7, defaultOpen = $$new_props.defaultOpen);
		if ("toggler" in $$props) $$invalidate(8, toggler = $$new_props.toggler);
		if ("onEntering" in $$props) $$invalidate(1, onEntering = $$new_props.onEntering);
		if ("onEntered" in $$props) $$invalidate(2, onEntered = $$new_props.onEntered);
		if ("onExiting" in $$props) $$invalidate(3, onExiting = $$new_props.onExiting);
		if ("onExited" in $$props) $$invalidate(4, onExited = $$new_props.onExited);
		if ("unbindEvents" in $$props) unbindEvents = $$new_props.unbindEvents;
		if ("isOpen" in $$props) $$invalidate(5, isOpen = $$new_props.isOpen);
	};

	$$props = exclude_internal_props($$props);

	return [
		className,
		onEntering,
		onEntered,
		onExiting,
		onExited,
		isOpen,
		props,
		defaultOpen,
		toggler,
		unbindEvents,
		noop,
		togglerFn,
		defaultToggleEvents,
		$$props,
		$$slots,
		introstart_handler,
		introend_handler,
		outrostart_handler,
		outroend_handler,
		$$scope
	];
}

class UncontrolledCollapse extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			class: 0,
			defaultOpen: 7,
			toggler: 8,
			onEntering: 1,
			onEntered: 2,
			onExiting: 3,
			onExited: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "UncontrolledCollapse",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*toggler*/ ctx[8] === undefined && !("toggler" in props)) {
			console.warn("<UncontrolledCollapse> was created without expected prop 'toggler'");
		}
	}

	get class() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get defaultOpen() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set defaultOpen(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggler() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggler(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onEntering() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onEntering(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onEntered() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onEntered(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onExiting() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onExiting(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onExited() {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onExited(value) {
		throw new Error_1("<UncontrolledCollapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { UncontrolledCollapse as U };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5jb250cm9sbGVkQ29sbGFwc2UuZTVkZGY1ZTIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvVW5jb250cm9sbGVkQ29sbGFwc2Uuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG4gIGltcG9ydCB7IG9uTW91bnQsIG9uRGVzdHJveSB9IGZyb20gJ3N2ZWx0ZSc7XG5cbiAgaW1wb3J0IENvbGxhcHNlIGZyb20gJy4vQ29sbGFwc2Uuc3ZlbHRlJztcblxuICBjb25zdCBub29wID0gKCkgPT4gdW5kZWZpbmVkO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZGVmYXVsdE9wZW4gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB0b2dnbGVyO1xuICBleHBvcnQgbGV0IG9uRW50ZXJpbmcgPSBub29wO1xuICBleHBvcnQgbGV0IG9uRW50ZXJlZCA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgb25FeGl0aW5nID0gbm9vcDtcbiAgZXhwb3J0IGxldCBvbkV4aXRlZCA9IG5vb3A7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBsZXQgdW5iaW5kRXZlbnRzO1xuICBsZXQgaXNPcGVuID0gZGVmYXVsdE9wZW47XG4gIGZ1bmN0aW9uIHRvZ2dsZXJGbigpIHtcbiAgICBpc09wZW4gPSAhaXNPcGVuO1xuICB9XG5cbiAgY29uc3QgZGVmYXVsdFRvZ2dsZUV2ZW50cyA9IFsndG91Y2hzdGFydCcsICdjbGljayddO1xuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiB0b2dnbGVyID09PSAnc3RyaW5nJyAmJlxuICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGRvY3VtZW50ICYmXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50XG4gICAgKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0b2dnbGVyKTtcbiAgICAgIGlmICghc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICBzZWxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt0b2dnbGVyfWApO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVGhlIHRhcmdldCAnJHt0b2dnbGVyfScgY291bGQgbm90IGJlIGlkZW50aWZpZWQgaW4gdGhlIGRvbSwgdGlwOiBjaGVjayBzcGVsbGluZ2BcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdFRvZ2dsZUV2ZW50cy5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0b2dnbGVyRm4pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB1bmJpbmRFdmVudHMgPSAoKSA9PiB7XG4gICAgICAgIGRlZmF1bHRUb2dnbGVFdmVudHMuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRvZ2dsZXJGbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIG9uRGVzdHJveSgoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB1bmJpbmRFdmVudHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHVuYmluZEV2ZW50cygpO1xuICAgICAgdW5iaW5kRXZlbnRzID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSk7XG48L3NjcmlwdD5cblxuPENvbGxhcHNlXG4gIHsuLi5wcm9wc31cbiAge2lzT3Blbn1cbiAgb246aW50cm9zdGFydFxuICBvbjppbnRyb2VuZFxuICBvbjpvdXRyb3N0YXJ0XG4gIG9uOm91dHJvZW5kXG4gIG9uOmludHJvc3RhcnQ9e29uRW50ZXJpbmd9XG4gIG9uOmludHJvZW5kPXtvbkVudGVyZWR9XG4gIG9uOm91dHJvc3RhcnQ9e29uRXhpdGluZ31cbiAgb246b3V0cm9lbmQ9e29uRXhpdGVkfVxuICBjbGFzcz17Y2xhc3NOYW1lfT5cbiAgPHNsb3QgLz5cbjwvQ29sbGFwc2U+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBK0VTLEdBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7OzJDQUpELEdBQVU7d0NBQ1osR0FBUzswQ0FDUCxHQUFTO3VDQUNYLEdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1REFDZCxHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F6RVYsSUFBSSxTQUFTLFNBQVM7Y0FFeEIsU0FBUyxHQUFHLEVBQUU7T0FFUCxXQUFXLEdBQUcsS0FBSztPQUNuQixPQUFPO09BQ1AsVUFBVSxHQUFHLElBQUk7T0FDakIsU0FBUyxHQUFHLElBQUk7T0FDaEIsU0FBUyxHQUFHLElBQUk7T0FDaEIsUUFBUSxHQUFHLElBQUk7T0FFcEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPO0tBRXZCLFlBQVk7S0FDWixNQUFNLEdBQUcsV0FBVzs7VUFDZixTQUFTO2tCQUNoQixNQUFNLElBQUksTUFBTTs7O09BR1osbUJBQW1CLElBQUksWUFBWSxFQUFFLE9BQU87O0NBRWxELE9BQU87YUFFSSxPQUFPLEtBQUssUUFBUSxXQUNwQixNQUFNLEtBQUssV0FBVyxJQUM3QixRQUFRLElBQ1IsUUFBUSxDQUFDLGFBQWE7T0FFbEIsU0FBUyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPOztRQUM1QyxTQUFTLENBQUMsTUFBTTtJQUNuQixTQUFTLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixLQUFLLE9BQU87OztRQUU5QyxTQUFTLENBQUMsTUFBTTtjQUNULEtBQUssZ0JBQ0UsT0FBTzs7O0dBSTFCLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxLQUFLO0lBQy9CLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTztLQUN2QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFNBQVM7Ozs7R0FJN0MsWUFBWTtJQUNWLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxLQUFLO0tBQy9CLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTztNQUN2QixPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFNBQVM7Ozs7Ozs7Q0FPdEQsU0FBUzthQUNJLFlBQVksS0FBSyxVQUFVO0dBQ3BDLFlBQVk7R0FDWixZQUFZLEdBQUcsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
