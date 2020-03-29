import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, f as element, y as text, J as space, F as create_component, g as claim_element, h as children, z as claim_text, j as detach_dev, K as claim_space, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, V as svg_element } from './client.9b4ff0ea.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.108b8c5d.js';
import { C as Card, a as CardBody } from './CardBody.b15703a0.js';
import { C as CardHeader } from './CardHeader.b1f31dd2.js';
import { T as Table } from './Table.9beab68e.js';

/* src\routes\tables.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\tables.svelte";

// (13:2) <BreadcrumbItem>
function create_default_slot_7(ctx) {
	let a;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			t = text("Панель");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			t = claim_text(a_nodes, "Панель");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "href", ".");
			add_location(a, file, 13, 4, 465);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(13:2) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (16:2) <BreadcrumbItem active>
function create_default_slot_6(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Таблицы");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Таблицы");
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
		id: create_default_slot_6.name,
		type: "slot",
		source: "(16:2) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (12:0) <Breadcrumb class="mb-4">
function create_default_slot_5(ctx) {
	let t;
	let current;

	const breadcrumbitem0 = new BreadcrumbItem({
			props: {
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumbitem1 = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(breadcrumbitem0.$$.fragment);
			t = space();
			create_component(breadcrumbitem1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(breadcrumbitem0.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(breadcrumbitem1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(breadcrumbitem0, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(breadcrumbitem1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const breadcrumbitem0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				breadcrumbitem0_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem0.$set(breadcrumbitem0_changes);
			const breadcrumbitem1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				breadcrumbitem1_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem1.$set(breadcrumbitem1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumbitem0.$$.fragment, local);
			transition_in(breadcrumbitem1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumbitem0.$$.fragment, local);
			transition_out(breadcrumbitem1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(breadcrumbitem0, detaching);
			if (detaching) detach_dev(t);
			destroy_component(breadcrumbitem1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(12:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (20:2) <CardBody>
function create_default_slot_4(ctx) {
	let t0;
	let a;
	let t1;
	let t2;

	const block = {
		c: function create() {
			t0 = text("DataTables является сторонним плагином, который используется для генерации демонстрационной таблицы.\r\n    Внизу. Для получения более подробной информации о Таблицах Данных, пожалуйста, посетите веб-сайт\r\n    ");
			a = element("a");
			t1 = text("официальная документация DataTables");
			t2 = text("\r\n    .");
			this.h();
		},
		l: function claim(nodes) {
			t0 = claim_text(nodes, "DataTables является сторонним плагином, который используется для генерации демонстрационной таблицы.\r\n    Внизу. Для получения более подробной информации о Таблицах Данных, пожалуйста, посетите веб-сайт\r\n    ");
			a = claim_element(nodes, "A", { target: true, href: true });
			var a_nodes = children(a);
			t1 = claim_text(a_nodes, "официальная документация DataTables");
			a_nodes.forEach(detach_dev);
			t2 = claim_text(nodes, "\r\n    .");
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "target", "_blank");
			attr_dev(a, "href", "https://datatables.net/");
			add_location(a, file, 22, 4, 825);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, a, anchor);
			append_dev(a, t1);
			insert_dev(target, t2, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(a);
			if (detaching) detach_dev(t2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(20:2) <CardBody>",
		ctx
	});

	return block;
}

// (19:0) <Card class="mb-4">
function create_default_slot_3(ctx) {
	let current;

	const cardbody = new CardBody({
			props: {
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(cardbody.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cardbody.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cardbody, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const cardbody_changes = {};

			if (dirty & /*$$scope*/ 1) {
				cardbody_changes.$$scope = { dirty, ctx };
			}

			cardbody.$set(cardbody_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cardbody.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cardbody.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cardbody, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(19:0) <Card class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (31:2) <CardHeader>
function create_default_slot_2(ctx) {
	let svg;
	let path;
	let t;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			t = text("\r\n    Пример DataTable");
			this.h();
		},
		l: function claim(nodes) {
			svg = claim_element(
				nodes,
				"svg",
				{
					class: true,
					"aria-hidden": true,
					focusable: true,
					"data-prefix": true,
					"data-icon": true,
					role: true,
					xmlns: true,
					viewBox: true,
					"data-fa-i2svg": true
				},
				1
			);

			var svg_nodes = children(svg);
			path = claim_element(svg_nodes, "path", { fill: true, d: true }, 1);
			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			t = claim_text(nodes, "\r\n    Пример DataTable");
			this.h();
		},
		h: function hydrate() {
			attr_dev(path, "fill", "currentColor");
			attr_dev(path, "d", "M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51\r\n        0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224\r\n        416H64v-96h160v96zm0-160H64v-96h160v96zm224\r\n        160H288v-96h160v96zm0-160H288v-96h160v96z");
			add_location(path, file, 41, 6, 1278);
			attr_dev(svg, "class", "svg-inline--fa fa-table fa-w-16");
			attr_dev(svg, "aria-hidden", "true");
			attr_dev(svg, "focusable", "false");
			attr_dev(svg, "data-prefix", "fas");
			attr_dev(svg, "data-icon", "table");
			attr_dev(svg, "role", "img");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 512 512");
			attr_dev(svg, "data-fa-i2svg", "");
			add_location(svg, file, 31, 4, 1004);
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(31:2) <CardHeader>",
		ctx
	});

	return block;
}

// (51:2) <CardBody>
function create_default_slot_1(ctx) {
	let current;
	const table = new Table({ $$inline: true });

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
		id: create_default_slot_1.name,
		type: "slot",
		source: "(51:2) <CardBody>",
		ctx
	});

	return block;
}

// (30:0) <Card class="mb-4">
function create_default_slot(ctx) {
	let t;
	let current;

	const cardheader = new CardHeader({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const cardbody = new CardBody({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(cardheader.$$.fragment);
			t = space();
			create_component(cardbody.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cardheader.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(cardbody.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cardheader, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(cardbody, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const cardheader_changes = {};

			if (dirty & /*$$scope*/ 1) {
				cardheader_changes.$$scope = { dirty, ctx };
			}

			cardheader.$set(cardheader_changes);
			const cardbody_changes = {};

			if (dirty & /*$$scope*/ 1) {
				cardbody_changes.$$scope = { dirty, ctx };
			}

			cardbody.$set(cardbody_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cardheader.$$.fragment, local);
			transition_in(cardbody.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cardheader.$$.fragment, local);
			transition_out(cardbody.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cardheader, detaching);
			if (detaching) detach_dev(t);
			destroy_component(cardbody, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(30:0) <Card class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let h1;
	let t0;
	let t1;
	let t2;
	let t3;
	let current;

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const card0 = new Card({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const card1 = new Card({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			h1 = element("h1");
			t0 = text("Таблицы");
			t1 = space();
			create_component(breadcrumb.$$.fragment);
			t2 = space();
			create_component(card0.$$.fragment);
			t3 = space();
			create_component(card1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, "Таблицы");
			h1_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(card0.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(card1.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 10, 0, 383);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			append_dev(h1, t0);
			insert_dev(target, t1, anchor);
			mount_component(breadcrumb, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(card0, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(card1, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 1) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const card0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				card0_changes.$$scope = { dirty, ctx };
			}

			card0.$set(card0_changes);
			const card1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				card1_changes.$$scope = { dirty, ctx };
			}

			card1.$set(card1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb.$$.fragment, local);
			transition_in(card0.$$.fragment, local);
			transition_in(card1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb.$$.fragment, local);
			transition_out(card0.$$.fragment, local);
			transition_out(card1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			destroy_component(breadcrumb, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(card0, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(card1, detaching);
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

class Tables extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tables",
			options,
			id: create_fragment.name
		});
	}
}

export default Tables;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGVzLmZkNWQ0N2QyLmpzIiwic291cmNlcyI6W10sInNvdXJjZXNDb250ZW50IjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
