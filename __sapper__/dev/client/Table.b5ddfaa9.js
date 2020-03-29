import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, c as clean, a as assign, e as exclude_internal_props, b as clsx, E as empty, n as insert_dev, p as group_outros, t as transition_out, q as check_outros, r as transition_in, j as detach_dev, v as create_slot, f as element, g as claim_element, h as children, m as set_attributes, l as add_location, w as get_slot_context, x as get_slot_changes, u as get_spread_update, k as attr_dev, o as append_dev, F as create_component, G as claim_component, H as mount_component, I as destroy_component, y as text, z as claim_text, B as noop, J as space, K as claim_space, M as destroy_each } from './client.f0d94f79.js';

/* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\Table.svelte";

// (38:0) {:else}
function create_else_block(ctx) {
	let table;
	let current;
	const default_slot_template = /*$$slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
	let table_data = {};

	for (let i = 0; i < table_levels.length; i += 1) {
		table_data = assign(table_data, table_levels[i]);
	}

	const block = {
		c: function create() {
			table = element("table");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			table = claim_element(nodes, "TABLE", { class: true });
			var table_nodes = children(table);
			if (default_slot) default_slot.l(table_nodes);
			table_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(table, table_data);
			add_location(table, file, 38, 2, 908);
		},
		m: function mount(target, anchor) {
			insert_dev(target, table, anchor);

			if (default_slot) {
				default_slot.m(table, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4096) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
			}

			set_attributes(table, get_spread_update(table_levels, [
				dirty & /*props*/ 8 && /*props*/ ctx[3],
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
			if (detaching) detach_dev(table);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(38:0) {:else}",
		ctx
	});

	return block;
}

// (32:0) {#if responsive}
function create_if_block(ctx) {
	let div;
	let table;
	let current;
	const default_slot_template = /*$$slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
	let table_data = {};

	for (let i = 0; i < table_levels.length; i += 1) {
		table_data = assign(table_data, table_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			table = element("table");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			table = claim_element(div_nodes, "TABLE", { class: true });
			var table_nodes = children(table);
			if (default_slot) default_slot.l(table_nodes);
			table_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(table, table_data);
			add_location(table, file, 33, 4, 826);
			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
			add_location(div, file, 32, 2, 788);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, table);

			if (default_slot) {
				default_slot.m(table, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4096) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
			}

			set_attributes(table, get_spread_update(table_levels, [
				dirty & /*props*/ 8 && /*props*/ ctx[3],
				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
			]));

			if (!current || dirty & /*responsiveClassName*/ 4) {
				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
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
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(32:0) {#if responsive}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*responsive*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
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
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if_blocks[current_block_type_index].d(detaching);
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
	let { size = "" } = $$props;
	let { bordered = false } = $$props;
	let { borderless = false } = $$props;
	let { striped = false } = $$props;
	let { dark = false } = $$props;
	let { hover = false } = $$props;
	let { responsive = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			size,
			bordered,
			borderless,
			striped,
			dark,
			hover,
			responsive,
			classes,
			responsiveClassName
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
	};

	let classes;
	let responsiveClassName;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
			 $$invalidate(1, classes = clsx(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
		}

		if ($$self.$$.dirty & /*responsive*/ 1) {
			 $$invalidate(2, responsiveClassName = responsive === true
			? "table-responsive"
			: `table-responsive-${responsive}`);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		responsive,
		classes,
		responsiveClassName,
		props,
		className,
		size,
		bordered,
		borderless,
		striped,
		dark,
		hover,
		$$props,
		$$scope,
		$$slots
	];
}

class Table extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			class: 4,
			size: 5,
			bordered: 6,
			borderless: 7,
			striped: 8,
			dark: 9,
			hover: 10,
			responsive: 0
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Table",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get bordered() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set bordered(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get borderless() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set borderless(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get striped() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set striped(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dark() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dark(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hover() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hover(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get responsive() {
		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set responsive(value) {
		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\Table.svelte generated by Svelte v3.18.1 */
const file$1 = "src\\components\\Table.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	return child_ctx;
}

// (15:6) {#each tableHeading as heading}
function create_each_block_1(ctx) {
	let th;
	let t_value = /*heading*/ ctx[5] + "";
	let t;

	const block = {
		c: function create() {
			th = element("th");
			t = text(t_value);
			this.h();
		},
		l: function claim(nodes) {
			th = claim_element(nodes, "TH", {});
			var th_nodes = children(th);
			t = claim_text(th_nodes, t_value);
			th_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(th, file$1, 15, 8, 513);
		},
		m: function mount(target, anchor) {
			insert_dev(target, th, anchor);
			append_dev(th, t);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(th);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(15:6) {#each tableHeading as heading}",
		ctx
	});

	return block;
}

// (22:4) {#each tableData as data}
function create_each_block(ctx) {
	let tr;
	let th;
	let t0_value = /*data*/ ctx[2].SNo + "";
	let t0;
	let t1;
	let td0;
	let t2_value = /*data*/ ctx[2].firstName + "";
	let t2;
	let t3;
	let td1;
	let t4_value = /*data*/ ctx[2].lastName + "";
	let t4;
	let t5;
	let td2;
	let t6_value = /*data*/ ctx[2].userName + "";
	let t6;
	let t7;

	const block = {
		c: function create() {
			tr = element("tr");
			th = element("th");
			t0 = text(t0_value);
			t1 = space();
			td0 = element("td");
			t2 = text(t2_value);
			t3 = space();
			td1 = element("td");
			t4 = text(t4_value);
			t5 = space();
			td2 = element("td");
			t6 = text(t6_value);
			t7 = space();
			this.h();
		},
		l: function claim(nodes) {
			tr = claim_element(nodes, "TR", {});
			var tr_nodes = children(tr);
			th = claim_element(tr_nodes, "TH", { scope: true });
			var th_nodes = children(th);
			t0 = claim_text(th_nodes, t0_value);
			th_nodes.forEach(detach_dev);
			t1 = claim_space(tr_nodes);
			td0 = claim_element(tr_nodes, "TD", {});
			var td0_nodes = children(td0);
			t2 = claim_text(td0_nodes, t2_value);
			td0_nodes.forEach(detach_dev);
			t3 = claim_space(tr_nodes);
			td1 = claim_element(tr_nodes, "TD", {});
			var td1_nodes = children(td1);
			t4 = claim_text(td1_nodes, t4_value);
			td1_nodes.forEach(detach_dev);
			t5 = claim_space(tr_nodes);
			td2 = claim_element(tr_nodes, "TD", {});
			var td2_nodes = children(td2);
			t6 = claim_text(td2_nodes, t6_value);
			td2_nodes.forEach(detach_dev);
			t7 = claim_space(tr_nodes);
			tr_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(th, "scope", "row");
			add_location(th, file$1, 23, 8, 635);
			add_location(td0, file$1, 24, 8, 676);
			add_location(td1, file$1, 25, 8, 711);
			add_location(td2, file$1, 26, 8, 745);
			add_location(tr, file$1, 22, 6, 621);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, th);
			append_dev(th, t0);
			append_dev(tr, t1);
			append_dev(tr, td0);
			append_dev(td0, t2);
			append_dev(tr, t3);
			append_dev(tr, td1);
			append_dev(td1, t4);
			append_dev(tr, t5);
			append_dev(tr, td2);
			append_dev(td2, t6);
			append_dev(tr, t7);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(22:4) {#each tableData as data}",
		ctx
	});

	return block;
}

// (12:0) <Table bordered responsive>
function create_default_slot(ctx) {
	let thead;
	let tr;
	let t;
	let tbody;
	let each_value_1 = /*tableHeading*/ ctx[0];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*tableData*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			thead = element("thead");
			tr = element("tr");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l: function claim(nodes) {
			thead = claim_element(nodes, "THEAD", {});
			var thead_nodes = children(thead);
			tr = claim_element(thead_nodes, "TR", {});
			var tr_nodes = children(tr);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].l(tr_nodes);
			}

			tr_nodes.forEach(detach_dev);
			thead_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			tbody = claim_element(nodes, "TBODY", {});
			var tbody_nodes = children(tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(tbody_nodes);
			}

			tbody_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(tr, file$1, 13, 4, 460);
			add_location(thead, file$1, 12, 2, 447);
			add_location(tbody, file$1, 19, 2, 573);
		},
		m: function mount(target, anchor) {
			insert_dev(target, thead, anchor);
			append_dev(thead, tr);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			insert_dev(target, t, anchor);
			insert_dev(target, tbody, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tableHeading*/ 1) {
				each_value_1 = /*tableHeading*/ ctx[0];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(tr, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tableData*/ 2) {
				each_value = /*tableData*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(thead);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(tbody);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(12:0) <Table bordered responsive>",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let current;

	const table = new Table({
			props: {
				bordered: true,
				responsive: true,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(table.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(table.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(table, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const table_changes = {};

			if (dirty & /*$$scope*/ 256) {
				table_changes.$$scope = { dirty, ctx };
			}

			table.$set(table_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(table.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(table.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(table, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self) {
	const tableHeading = ["#", "First Name", "Last-Name", "Username"];

	const tableData = [
		{
			SNo: "1",
			firstName: "PipBoy",
			lastName: "3000",
			userName: "@mdo"
		},
		{
			SNo: "2",
			firstName: "Gordon",
			lastName: "Freeman",
			userName: "@fat"
		},
		{
			SNo: "3",
			firstName: "Goul",
			lastName: "Гладкокожий",
			userName: "@twitter"
		}
	];

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		
	};

	return [tableHeading, tableData];
}

class Table_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Table_1",
			options,
			id: create_fragment$1.name
		});
	}
}

export { Table_1 as T };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuYjVkZGZhYTkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvVGFibGUuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVGFibGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IGJvcmRlcmVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYm9yZGVybGVzcyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHN0cmlwZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkYXJrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaG92ZXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXNwb25zaXZlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgJ3RhYmxlJyxcbiAgICBzaXplID8gJ3RhYmxlLScgKyBzaXplIDogZmFsc2UsXG4gICAgYm9yZGVyZWQgPyAndGFibGUtYm9yZGVyZWQnIDogZmFsc2UsXG4gICAgYm9yZGVybGVzcyA/ICd0YWJsZS1ib3JkZXJsZXNzJyA6IGZhbHNlLFxuICAgIHN0cmlwZWQgPyAndGFibGUtc3RyaXBlZCcgOiBmYWxzZSxcbiAgICBkYXJrID8gJ3RhYmxlLWRhcmsnIDogZmFsc2UsXG4gICAgaG92ZXIgPyAndGFibGUtaG92ZXInIDogZmFsc2VcbiAgKTtcblxuICAkOiByZXNwb25zaXZlQ2xhc3NOYW1lID1cbiAgICByZXNwb25zaXZlID09PSB0cnVlID8gJ3RhYmxlLXJlc3BvbnNpdmUnIDogYHRhYmxlLXJlc3BvbnNpdmUtJHtyZXNwb25zaXZlfWA7XG48L3NjcmlwdD5cblxueyNpZiByZXNwb25zaXZlfVxuICA8ZGl2IGNsYXNzPXtyZXNwb25zaXZlQ2xhc3NOYW1lfT5cbiAgICA8dGFibGUgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgICA8c2xvdCAvPlxuICAgIDwvdGFibGU+XG4gIDwvZGl2PlxuezplbHNlfVxuICA8dGFibGUgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC90YWJsZT5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBUYWJsZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1RhYmxlLnN2ZWx0ZVwiO1xyXG5cclxuICBjb25zdCB0YWJsZUhlYWRpbmcgPSBbXCIjXCIsIFwiRmlyc3QgTmFtZVwiLCBcIkxhc3QtTmFtZVwiLCBcIlVzZXJuYW1lXCJdO1xyXG4gIGNvbnN0IHRhYmxlRGF0YSA9IFtcclxuICAgIHsgU05vOiBcIjFcIiwgZmlyc3ROYW1lOiBcIlBpcEJveVwiLCBsYXN0TmFtZTogXCIzMDAwXCIsIHVzZXJOYW1lOiBcIkBtZG9cIiB9LFxyXG4gICAgeyBTTm86IFwiMlwiLCBmaXJzdE5hbWU6IFwiR29yZG9uXCIsIGxhc3ROYW1lOiBcIkZyZWVtYW5cIiwgdXNlck5hbWU6IFwiQGZhdFwiIH0sXHJcbiAgICB7IFNObzogXCIzXCIsIGZpcnN0TmFtZTogXCJHb3VsXCIsIGxhc3ROYW1lOiBcItCT0LvQsNC00LrQvtC60L7QttC40LlcIiwgdXNlck5hbWU6IFwiQHR3aXR0ZXJcIiB9XHJcbiAgXTtcclxuPC9zY3JpcHQ+XHJcblxyXG48VGFibGUgYm9yZGVyZWQgcmVzcG9uc2l2ZT5cclxuICA8dGhlYWQ+XHJcbiAgICA8dHI+XHJcbiAgICAgIHsjZWFjaCB0YWJsZUhlYWRpbmcgYXMgaGVhZGluZ31cclxuICAgICAgICA8dGg+e2hlYWRpbmd9PC90aD5cclxuICAgICAgey9lYWNofVxyXG4gICAgPC90cj5cclxuICA8L3RoZWFkPlxyXG4gIDx0Ym9keT5cclxuXHJcbiAgICB7I2VhY2ggdGFibGVEYXRhIGFzIGRhdGF9XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGggc2NvcGU9XCJyb3dcIj57ZGF0YS5TTm99PC90aD5cclxuICAgICAgICA8dGQ+e2RhdGEuZmlyc3ROYW1lfTwvdGQ+XHJcbiAgICAgICAgPHRkPntkYXRhLmxhc3ROYW1lfTwvdGQ+XHJcbiAgICAgICAgPHRkPntkYXRhLnVzZXJOYW1lfTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICB7L2VhY2h9XHJcbiAgPC90Ym9keT5cclxuPC9UYWJsZT5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFnQ2MsR0FBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttREFBbkIsR0FBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQTVCM0IsU0FBUyxHQUFHLEVBQUU7T0FFUCxJQUFJLEdBQUcsRUFBRTtPQUNULFFBQVEsR0FBRyxLQUFLO09BQ2hCLFVBQVUsR0FBRyxLQUFLO09BQ2xCLE9BQU8sR0FBRyxLQUFLO09BQ2YsSUFBSSxHQUFHLEtBQUs7T0FDWixLQUFLLEdBQUcsS0FBSztPQUNiLFVBQVUsR0FBRyxLQUFLO09BRXZCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXhCLE9BQU8sR0FBRyxJQUFJLENBQ2YsU0FBUyxFQUNULE9BQU8sRUFDUCxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLEVBQzlCLFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLEVBQ25DLFVBQVUsR0FBRyxrQkFBa0IsR0FBRyxLQUFLLEVBQ3ZDLE9BQU8sR0FBRyxlQUFlLEdBQUcsS0FBSyxFQUNqQyxJQUFJLEdBQUcsWUFBWSxHQUFHLEtBQUssRUFDM0IsS0FBSyxHQUFHLGFBQWEsR0FBRyxLQUFLOzs7O29CQUc1QixtQkFBbUIsR0FDcEIsVUFBVSxLQUFLLElBQUk7S0FBRyxrQkFBa0I7eUJBQXVCLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkNMcEQsR0FBSSxJQUFDLEdBQUc7Ozs7eUJBQ3BCLEdBQUksSUFBQyxTQUFTOzs7O3lCQUNkLEdBQUksSUFBQyxRQUFROzs7O3lCQUNiLEdBQUksSUFBQyxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBWmIsR0FBWTs7O2tDQUFqQixNQUFJOzs7O2dDQU9ELEdBQVM7OztnQ0FBZCxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29DQVBHLEdBQVk7OztpQ0FBakIsTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FBSixNQUFJOzs7OytCQU9ELEdBQVM7OzsrQkFBZCxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7O29DQUFKLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FsQkYsWUFBWSxJQUFJLEdBQUcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFVBQVU7O09BQzFELFNBQVM7O0dBQ1gsR0FBRyxFQUFFLEdBQUc7R0FBRSxTQUFTLEVBQUUsUUFBUTtHQUFFLFFBQVEsRUFBRSxNQUFNO0dBQUUsUUFBUSxFQUFFLE1BQU07OztHQUNqRSxHQUFHLEVBQUUsR0FBRztHQUFFLFNBQVMsRUFBRSxRQUFRO0dBQUUsUUFBUSxFQUFFLFNBQVM7R0FBRSxRQUFRLEVBQUUsTUFBTTs7O0dBQ3BFLEdBQUcsRUFBRSxHQUFHO0dBQUUsU0FBUyxFQUFFLE1BQU07R0FBRSxRQUFRLEVBQUUsYUFBYTtHQUFFLFFBQVEsRUFBRSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
