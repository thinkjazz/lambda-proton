import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, J as space, f as element, y as text, F as create_component, L as query_selector_all, j as detach_dev, K as claim_space, g as claim_element, h as children, z as claim_text, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component } from './client.f386ce35.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.a86ea66b.js';
import { R as Row } from './Row.2c4fae52.js';

/* src\routes\ui\breadcrumb.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\ui\\breadcrumb.svelte";

// (16:4) <BreadcrumbItem active>
function create_default_slot_11(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Хлебные крошки");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Хлебные крошки");
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
		id: create_default_slot_11.name,
		type: "slot",
		source: "(16:4) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (15:0) <Breadcrumb class="mb-4">
function create_default_slot_10(ctx) {
	let current;

	const breadcrumbitem = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_11] },
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

			if (dirty & /*$$scope*/ 2) {
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
		id: create_default_slot_10.name,
		type: "slot",
		source: "(15:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (22:12) <BreadcrumbItem active>
function create_default_slot_9(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Домой");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Домой");
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
		id: create_default_slot_9.name,
		type: "slot",
		source: "(22:12) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (21:8) <Breadcrumb>
function create_default_slot_8(ctx) {
	let current;

	const breadcrumbitem = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_9] },
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

			if (dirty & /*$$scope*/ 2) {
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
		id: create_default_slot_8.name,
		type: "slot",
		source: "(21:8) <Breadcrumb>",
		ctx
	});

	return block;
}

// (26:12) <BreadcrumbItem>
function create_default_slot_7(ctx) {
	let a;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			t = text("Домой");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			t = claim_text(a_nodes, "Домой");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "href", "#home");
			add_location(a, file, 26, 16, 747);
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
		source: "(26:12) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (29:12) <BreadcrumbItem active>
function create_default_slot_6(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Библиотека");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Библиотека");
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
		source: "(29:12) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (25:8) <Breadcrumb>
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

			if (dirty & /*$$scope*/ 2) {
				breadcrumbitem0_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem0.$set(breadcrumbitem0_changes);
			const breadcrumbitem1_changes = {};

			if (dirty & /*$$scope*/ 2) {
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
		source: "(25:8) <Breadcrumb>",
		ctx
	});

	return block;
}

// (33:12) <BreadcrumbItem>
function create_default_slot_4(ctx) {
	let a;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			t = text("Домой");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			t = claim_text(a_nodes, "Домой");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "href", "#home");
			add_location(a, file, 33, 16, 962);
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
		id: create_default_slot_4.name,
		type: "slot",
		source: "(33:12) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (36:12) <BreadcrumbItem>
function create_default_slot_3(ctx) {
	let a;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			t = text("Библиотека");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			t = claim_text(a_nodes, "Библиотека");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "href", "#library");
			add_location(a, file, 36, 16, 1066);
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
		id: create_default_slot_3.name,
		type: "slot",
		source: "(36:12) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (39:12) <BreadcrumbItem active>
function create_default_slot_2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Данные");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Данные");
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(39:12) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (32:8) <Breadcrumb>
function create_default_slot_1(ctx) {
	let t0;
	let t1;
	let current;

	const breadcrumbitem0 = new BreadcrumbItem({
			props: {
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumbitem1 = new BreadcrumbItem({
			props: {
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumbitem2 = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(breadcrumbitem0.$$.fragment);
			t0 = space();
			create_component(breadcrumbitem1.$$.fragment);
			t1 = space();
			create_component(breadcrumbitem2.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(breadcrumbitem0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(breadcrumbitem1.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(breadcrumbitem2.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(breadcrumbitem0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(breadcrumbitem1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(breadcrumbitem2, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const breadcrumbitem0_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumbitem0_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem0.$set(breadcrumbitem0_changes);
			const breadcrumbitem1_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumbitem1_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem1.$set(breadcrumbitem1_changes);
			const breadcrumbitem2_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumbitem2_changes.$$scope = { dirty, ctx };
			}

			breadcrumbitem2.$set(breadcrumbitem2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumbitem0.$$.fragment, local);
			transition_in(breadcrumbitem1.$$.fragment, local);
			transition_in(breadcrumbitem2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumbitem0.$$.fragment, local);
			transition_out(breadcrumbitem1.$$.fragment, local);
			transition_out(breadcrumbitem2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(breadcrumbitem0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(breadcrumbitem1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(breadcrumbitem2, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(32:8) <Breadcrumb>",
		ctx
	});

	return block;
}

// (18:0) <Row>
function create_default_slot(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let t2;
	let t3;
	let current;

	const breadcrumb0 = new Breadcrumb({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumb1 = new Breadcrumb({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumb2 = new Breadcrumb({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("Хлебные крошки");
			t1 = space();
			create_component(breadcrumb0.$$.fragment);
			t2 = space();
			create_component(breadcrumb1.$$.fragment);
			t3 = space();
			create_component(breadcrumb2.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h2 = claim_element(div_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Хлебные крошки");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div_nodes);
			claim_component(breadcrumb0.$$.fragment, div_nodes);
			t2 = claim_space(div_nodes);
			claim_component(breadcrumb1.$$.fragment, div_nodes);
			t3 = claim_space(div_nodes);
			claim_component(breadcrumb2.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 19, 8, 535);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 18, 4, 503);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);
			mount_component(breadcrumb0, div, null);
			append_dev(div, t2);
			mount_component(breadcrumb1, div, null);
			append_dev(div, t3);
			mount_component(breadcrumb2, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const breadcrumb0_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumb0_changes.$$scope = { dirty, ctx };
			}

			breadcrumb0.$set(breadcrumb0_changes);
			const breadcrumb1_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumb1_changes.$$scope = { dirty, ctx };
			}

			breadcrumb1.$set(breadcrumb1_changes);
			const breadcrumb2_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumb2_changes.$$scope = { dirty, ctx };
			}

			breadcrumb2.$set(breadcrumb2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb0.$$.fragment, local);
			transition_in(breadcrumb1.$$.fragment, local);
			transition_in(breadcrumb2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb0.$$.fragment, local);
			transition_out(breadcrumb1.$$.fragment, local);
			transition_out(breadcrumb2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(breadcrumb0);
			destroy_component(breadcrumb1);
			destroy_component(breadcrumb2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(18:0) <Row>",
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
	let current;
	document.title = title_value = /*title*/ ctx[0];

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row = new Row({
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
			t1 = text("Хлебные крошки");
			t2 = space();
			create_component(breadcrumb.$$.fragment);
			t3 = space();
			create_component(row.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-46oba3\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Хлебные крошки");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(row.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 13, 0, 352);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			append_dev(h1, t1);
			insert_dev(target, t2, anchor);
			mount_component(breadcrumb, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(row, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*title*/ 1) && title_value !== (title_value = /*title*/ ctx[0])) {
				document.title = title_value;
			}

			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 2) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const row_changes = {};

			if (dirty & /*$$scope*/ 2) {
				row_changes.$$scope = { dirty, ctx };
			}

			row.$set(row_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb.$$.fragment, local);
			transition_in(row.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb.$$.fragment, local);
			transition_out(row.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			destroy_component(breadcrumb, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(row, detaching);
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
	let title = "Хлебные крошки | UI | Пользовательский интерфейс";

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
	};

	return [title];
}

class Breadcrumb_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Breadcrumb_1",
			options,
			id: create_fragment.name
		});
	}
}

export default Breadcrumb_1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYi4wOWViYzI5My5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy91aS9icmVhZGNydW1iLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgaW1wb3J0ICBCcmVhZGNydW1iICBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWIuc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgIEJyZWFkY3J1bWJJdGVtICBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWJJdGVtLnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0ICBSb3cgIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG5cclxuXHJcblxyXG4gICAgbGV0IHRpdGxlID0gXCLQpdC70LXQsdC90YvQtSDQutGA0L7RiNC60LggfCBVSSB8INCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC5INC40L3RgtC10YDRhNC10LnRgVwiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuICAgIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuPGgxIGNsYXNzPVwibXQtNFwiPtCl0LvQtdCx0L3Ri9C1INC60YDQvtGI0LrQuDwvaDE+XHJcbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxyXG4gICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7QpdC70LXQsdC90YvQtSDQutGA0L7RiNC60Lg8L0JyZWFkY3J1bWJJdGVtPlxyXG48L0JyZWFkY3J1bWI+XHJcbjxSb3c+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLXhsLTZcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJtdC00XCI+0KXQu9C10LHQvdGL0LUg0LrRgNC+0YjQutC4PC9oMj5cclxuICAgICAgICA8QnJlYWRjcnVtYj5cclxuICAgICAgICAgICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7QlNC+0LzQvtC5PC9CcmVhZGNydW1iSXRlbT5cclxuICAgICAgICA8L0JyZWFkY3J1bWI+XHJcblxyXG4gICAgICAgIDxCcmVhZGNydW1iPlxyXG4gICAgICAgICAgICA8QnJlYWRjcnVtYkl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2hvbWVcIj7QlNC+0LzQvtC5PC9hPlxyXG4gICAgICAgICAgICA8L0JyZWFkY3J1bWJJdGVtPlxyXG4gICAgICAgICAgICA8QnJlYWRjcnVtYkl0ZW0gYWN0aXZlPtCR0LjQsdC70LjQvtGC0LXQutCwPC9CcmVhZGNydW1iSXRlbT5cclxuICAgICAgICA8L0JyZWFkY3J1bWI+XHJcblxyXG4gICAgICAgIDxCcmVhZGNydW1iPlxyXG4gICAgICAgICAgICA8QnJlYWRjcnVtYkl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2hvbWVcIj7QlNC+0LzQvtC5PC9hPlxyXG4gICAgICAgICAgICA8L0JyZWFkY3J1bWJJdGVtPlxyXG4gICAgICAgICAgICA8QnJlYWRjcnVtYkl0ZW0+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI2xpYnJhcnlcIj7QkdC40LHQu9C40L7RgtC10LrQsDwvYT5cclxuICAgICAgICAgICAgPC9CcmVhZGNydW1iSXRlbT5cclxuICAgICAgICAgICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7QlNCw0L3QvdGL0LU8L0JyZWFkY3J1bWJJdGVtPlxyXG4gICAgICAgIDwvQnJlYWRjcnVtYj5cclxuICAgIDwvZGl2PlxyXG48L1Jvdz5cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBT1EsS0FBSyxHQUFHLGtEQUFrRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
