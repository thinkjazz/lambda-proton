import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, J as space, f as element, y as text, F as create_component, L as query_selector_all, j as detach_dev, K as claim_space, g as claim_element, h as children, z as claim_text, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, B as noop, p as group_outros, q as check_outros, M as destroy_each } from './client.f386ce35.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.a86ea66b.js';
import './CardBody.89d5a5db.js';
import './CardHeader.ac48c451.js';
import './CardText.eda10cda.js';
import './CardSubtitle.09e10ec7.js';
import { R as Row } from './Row.2c4fae52.js';
import './CardFooter.d705bd93.js';
import './Table.5b3af47e.js';
import './Progress.68a8147f.js';
import './FormGroup.4e97a62f.js';
import './Col.99cf1345.js';
import './FormText.84c68f2e.js';
import './ButtonGroup.30e032fe.js';
import './Alert.b65d3ac7.js';
import './Badge.d4b93609.js';
import { S as Spinner } from './index.dbf207a0.js';
import './ButtonToolbar.fb0fb741.js';
import './CardTitle.57471691.js';
import './CarouselCaption.9bca9e74.js';
import './ModalHeader.93418432.js';
import './UncontrolledCollapse.5292a634.js';

/* src\routes\ui\spinners.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\ui\\spinners.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (26:4) <BreadcrumbItem active>
function create_default_slot_4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Загрузчики");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Загрузчики");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(26:4) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (25:0) <Breadcrumb class="mb-4">
function create_default_slot_3(ctx) {
	let current;

	const breadcrumbitem = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(breadcrumbitem.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(breadcrumbitem.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(breadcrumbitem, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const breadcrumbitem_changes = {};

			if (dirty & /*$$scope*/ 512) {
				breadcrumbitem_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem.$set(breadcrumbitem_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumbitem.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumbitem.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(breadcrumbitem, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(25:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (31:8) {#each colors as color}
function create_each_block_2(ctx) {
	let current;

	const spinner = new Spinner({
			props: { color: /*color*/ ctx[2] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(spinner.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(spinner.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(spinner, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(spinner.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(spinner.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(spinner, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(31:8) {#each colors as color}",
		ctx
	});

	return block;
}

// (28:0) <Row>
function create_default_slot_2(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let current;
	let each_value_2 = /*colors*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("Цвета");
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h2 = claim_element(div_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Цвета");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div_nodes);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 29, 8, 749);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 28, 4, 717);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*colors*/ 1) {
				each_value_2 = /*colors*/ ctx[0];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(28:0) <Row>",
		ctx
	});

	return block;
}

// (41:12) {#each colors as color}
function create_each_block_1(ctx) {
	let current;

	const spinner = new Spinner({
			props: { color: /*color*/ ctx[2], type: "border" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(spinner.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(spinner.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(spinner, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(spinner.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(spinner.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(spinner, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(41:12) {#each colors as color}",
		ctx
	});

	return block;
}

// (47:12) {#each colors as color}
function create_each_block(ctx) {
	let current;

	const spinner = new Spinner({
			props: { color: /*color*/ ctx[2], type: "grow" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(spinner.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(spinner.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(spinner, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(spinner.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(spinner.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(spinner, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(47:12) {#each colors as color}",
		ctx
	});

	return block;
}

// (36:0) <Row>
function create_default_slot_1(ctx) {
	let div2;
	let h2;
	let t0;
	let t1;
	let div0;
	let t2;
	let div1;
	let current;
	let each_value_1 = /*colors*/ ctx[0];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	let each_value = /*colors*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div2 = element("div");
			h2 = element("h2");
			t0 = text("Типы");
			t1 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t2 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			h2 = claim_element(div2_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Типы");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div2_nodes);
			div0 = claim_element(div2_nodes, "DIV", {});
			var div0_nodes = children(div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].l(div0_nodes);
			}

			div0_nodes.forEach(detach_dev);
			t2 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", {});
			var div1_nodes = children(div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div1_nodes);
			}

			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 37, 8, 924);
			add_location(div0, file, 39, 8, 962);
			add_location(div1, file, 45, 8, 1104);
			attr_dev(div2, "class", "col-xl-6");
			add_location(div2, file, 36, 4, 892);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, h2);
			append_dev(h2, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div0, null);
			}

			append_dev(div2, t2);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*colors*/ 1) {
				each_value_1 = /*colors*/ ctx[0];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						transition_in(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						transition_in(each_blocks_1[i], 1);
						each_blocks_1[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (dirty & /*colors*/ 1) {
				each_value = /*colors*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_1(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks_1[i]);
			}

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				transition_out(each_blocks_1[i]);
			}

			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(36:0) <Row>",
		ctx
	});

	return block;
}

// (53:0) <Row>
function create_default_slot(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let t2;
	let current;
	const spinner0 = new Spinner({ props: { size: "sm" }, $$inline: true });

	const spinner1 = new Spinner({
			props: { size: "sm", type: "grow" },
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("Размеры");
			t1 = space();
			create_component(spinner0.$$.fragment);
			t2 = space();
			create_component(spinner1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h2 = claim_element(div_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Размеры");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div_nodes);
			claim_component(spinner0.$$.fragment, div_nodes);
			t2 = claim_space(div_nodes);
			claim_component(spinner1.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 54, 8, 1297);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 53, 4, 1265);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);
			mount_component(spinner0, div, null);
			append_dev(div, t2);
			mount_component(spinner1, div, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(spinner0.$$.fragment, local);
			transition_in(spinner1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(spinner0.$$.fragment, local);
			transition_out(spinner1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(spinner0);
			destroy_component(spinner1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(53:0) <Row>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let title_value;
	let t0;
	let h1;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let current;
	document.title = title_value = /*title*/ ctx[1];

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row0 = new Row({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row1 = new Row({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row2 = new Row({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			t0 = space();
			h1 = element("h1");
			t1 = text("Загрузчики");
			t2 = space();
			create_component(breadcrumb.$$.fragment);
			t3 = space();
			create_component(row0.$$.fragment);
			t4 = space();
			create_component(row1.$$.fragment);
			t5 = space();
			create_component(row2.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-46oba3\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Загрузчики");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(row0.$$.fragment, nodes);
			t4 = claim_space(nodes);
			claim_component(row1.$$.fragment, nodes);
			t5 = claim_space(nodes);
			claim_component(row2.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 23, 0, 574);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			append_dev(h1, t1);
			insert_dev(target, t2, anchor);
			mount_component(breadcrumb, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(row0, target, anchor);
			insert_dev(target, t4, anchor);
			mount_component(row1, target, anchor);
			insert_dev(target, t5, anchor);
			mount_component(row2, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*title*/ 2) && title_value !== (title_value = /*title*/ ctx[1])) {
				document.title = title_value;
			}

			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 512) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const row0_changes = {};

			if (dirty & /*$$scope*/ 512) {
				row0_changes.$$scope = { dirty, ctx };
			}

			row0.$set(row0_changes);
			const row1_changes = {};

			if (dirty & /*$$scope*/ 512) {
				row1_changes.$$scope = { dirty, ctx };
			}

			row1.$set(row1_changes);
			const row2_changes = {};

			if (dirty & /*$$scope*/ 512) {
				row2_changes.$$scope = { dirty, ctx };
			}

			row2.$set(row2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb.$$.fragment, local);
			transition_in(row0.$$.fragment, local);
			transition_in(row1.$$.fragment, local);
			transition_in(row2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb.$$.fragment, local);
			transition_out(row0.$$.fragment, local);
			transition_out(row1.$$.fragment, local);
			transition_out(row2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			destroy_component(breadcrumb, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(row0, detaching);
			if (detaching) detach_dev(t4);
			destroy_component(row1, detaching);
			if (detaching) detach_dev(t5);
			destroy_component(row2, detaching);
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

function instance($$self) {
	const colors = [
		"primary",
		"secondary",
		"success",
		"danger",
		"warning",
		"info",
		"light",
		"dark"
	];

	let title = "Загрузчики | UI | Пользовательский Интерфейс";

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
	};

	return [colors, title];
}

class Spinners extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Spinners",
			options,
			id: create_fragment.name
		});
	}
}

export default Spinners;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bpbm5lcnMuZjJjY2ViNGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvdWkvc3Bpbm5lcnMuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgIEJyZWFkY3J1bWIgIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgQnJlYWRjcnVtYkl0ZW0gIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYkl0ZW0uc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgIFJvdyAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Sb3cuc3ZlbHRlXCI7XHJcbiAgICAgIGltcG9ydCB7IFNwaW5uZXIgfSBmcm9tIFwic3ZlbHRlc3RyYXBcIjtcclxuICAgIGNvbnN0IGNvbG9ycyA9IFtcclxuICAgICAgICBcInByaW1hcnlcIixcclxuICAgICAgICBcInNlY29uZGFyeVwiLFxyXG4gICAgICAgIFwic3VjY2Vzc1wiLFxyXG4gICAgICAgIFwiZGFuZ2VyXCIsXHJcbiAgICAgICAgXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJsaWdodFwiLFxyXG4gICAgICAgIFwiZGFya1wiXHJcbiAgICBdO1xyXG5cclxuXHJcbiAgICBsZXQgdGl0bGUgPSBcItCX0LDQs9GA0YPQt9GH0LjQutC4IHwgVUkgfCDQn9C+0LvRjNC30L7QstCw0YLQtdC70YzRgdC60LjQuSDQmNC90YLQtdGA0YTQtdC50YFcIjtcclxuPC9zY3JpcHQ+XHJcblxyXG48c3ZlbHRlOmhlYWQ+XHJcbiAgICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcbjxoMSBjbGFzcz1cIm10LTRcIj7Ql9Cw0LPRgNGD0LfRh9C40LrQuDwvaDE+XHJcbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxyXG4gICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7Ql9Cw0LPRgNGD0LfRh9C40LrQuDwvQnJlYWRjcnVtYkl0ZW0+XHJcbjwvQnJlYWRjcnVtYj5cclxuPFJvdz5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wteGwtNlwiPlxyXG4gICAgICAgIDxoMiBjbGFzcz1cIm10LTRcIj7QptCy0LXRgtCwPC9oMj5cclxuICAgICAgICB7I2VhY2ggY29sb3JzIGFzIGNvbG9yfVxyXG4gICAgICAgICAgICA8U3Bpbm5lciB7Y29sb3J9IC8+XHJcbiAgICAgICAgey9lYWNofVxyXG4gICAgPC9kaXY+XHJcbjwvUm93PlxyXG48Um93PlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC14bC02XCI+XHJcbiAgICAgICAgPGgyIGNsYXNzPVwibXQtNFwiPtCi0LjQv9GLPC9oMj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgeyNlYWNoIGNvbG9ycyBhcyBjb2xvcn1cclxuICAgICAgICAgICAgICAgIDxTcGlubmVyIHtjb2xvcn0gdHlwZT1cImJvcmRlclwiIC8+XHJcbiAgICAgICAgICAgIHsvZWFjaH1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgeyNlYWNoIGNvbG9ycyBhcyBjb2xvcn1cclxuICAgICAgICAgICAgICAgIDxTcGlubmVyIHtjb2xvcn0gdHlwZT1cImdyb3dcIiAvPlxyXG4gICAgICAgICAgICB7L2VhY2h9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9Sb3c+XHJcbjxSb3c+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLXhsLTZcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJtdC00XCI+0KDQsNC30LzQtdGA0Ys8L2gyPlxyXG5cclxuICAgICAgICA8U3Bpbm5lciBzaXplPVwic21cIiAvPlxyXG4gICAgICAgIDxTcGlubmVyIHNpemU9XCJzbVwiIHR5cGU9XCJncm93XCIgLz5cclxuXHJcbiAgICA8L2Rpdj5cclxuPC9Sb3c+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkE4QmUsR0FBTTs7O2tDQUFYLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBQyxHQUFNOzs7aUNBQVgsTUFBSTs7Ozs7Ozs7Ozs7Ozs7OzswQkFBSixNQUFJOzs7Ozs7Ozs7O29DQUFKLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytCQVVLLEdBQU07OztrQ0FBWCxNQUFJOzs7Ozs7Ozs2QkFNQyxHQUFNOzs7Z0NBQVgsTUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhCQU5DLEdBQU07OztpQ0FBWCxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUFKLE1BQUk7Ozs7Ozs7OzRCQU1DLEdBQU07OzsrQkFBWCxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFKLE1BQUk7Ozs7Ozs7Ozs7b0NBTkosTUFBSTs7OztrQ0FNSixNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXpDUixNQUFNO0VBQ1IsU0FBUztFQUNULFdBQVc7RUFDWCxTQUFTO0VBQ1QsUUFBUTtFQUNSLFNBQVM7RUFDVCxNQUFNO0VBQ04sT0FBTztFQUNQLE1BQU07OztLQUlOLEtBQUssR0FBRyw4Q0FBOEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
