import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, J as space, f as element, y as text, F as create_component, L as query_selector_all, j as detach_dev, K as claim_space, g as claim_element, h as children, z as claim_text, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, p as group_outros, q as check_outros, M as destroy_each, B as noop } from './client.f55ffe0a.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.eac5bc20.js';
import { R as Row } from './Row.8802d6ae.js';
import { A as Alert } from './Alert.acfe07cc.js';

/* src\routes\ui\alerts.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\ui\\alerts.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (27:4) <BreadcrumbItem active>
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Оповещения");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Оповещения");
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
		id: create_default_slot_3.name,
		type: "slot",
		source: "(27:4) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (26:0) <Breadcrumb class="mb-4">
function create_default_slot_2(ctx) {
	let current;

	const breadcrumbitem = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_3] },
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

			if (dirty & /*$$scope*/ 32) {
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(26:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (33:12) <Alert {color}>
function create_default_slot_1(ctx) {
	let h4;
	let t0_value = /*color*/ ctx[2] + "";
	let t0;
	let t1;
	let a;
	let t2;
	let t3;

	const block = {
		c: function create() {
			h4 = element("h4");
			t0 = text(t0_value);
			t1 = text("\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                ");
			a = element("a");
			t2 = text("Кроме того, ссылки на оповещения цветные, чтобы соответствовать оповещению\n                ");
			t3 = text(".\n            ");
			this.h();
		},
		l: function claim(nodes) {
			h4 = claim_element(nodes, "H4", { class: true });
			var h4_nodes = children(h4);
			t0 = claim_text(h4_nodes, t0_value);
			h4_nodes.forEach(detach_dev);
			t1 = claim_text(nodes, "\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                ");
			a = claim_element(nodes, "A", { href: true, class: true });
			var a_nodes = children(a);
			t2 = claim_text(a_nodes, "Кроме того, ссылки на оповещения цветные, чтобы соответствовать оповещению\n                ");
			a_nodes.forEach(detach_dev);
			t3 = claim_text(nodes, ".\n            ");
			this.h();
		},
		h: function hydrate() {
			attr_dev(h4, "class", "alert-heading text-capitalize");
			add_location(h4, file, 33, 16, 841);
			attr_dev(a, "href", "#todo");
			attr_dev(a, "class", "alert-link");
			add_location(a, file, 35, 16, 985);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h4, anchor);
			append_dev(h4, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, a, anchor);
			append_dev(a, t2);
			insert_dev(target, t3, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h4);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(a);
			if (detaching) detach_dev(t3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(33:12) <Alert {color}>",
		ctx
	});

	return block;
}

// (32:8) {#each colors as color}
function create_each_block(ctx) {
	let current;

	const alert = new Alert({
			props: {
				color: /*color*/ ctx[2],
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(alert.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(alert.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(alert, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const alert_changes = {};

			if (dirty & /*$$scope*/ 32) {
				alert_changes.$$scope = { dirty, ctx };
			}

			alert.$set(alert_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(alert.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(alert.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(alert, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(32:8) {#each colors as color}",
		ctx
	});

	return block;
}

// (29:0) <Row>
function create_default_slot(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let current;
	let each_value = /*colors*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("Оповещения");
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
			t0 = claim_text(h2_nodes, "Оповещения");
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
			add_location(h2, file, 30, 8, 732);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 29, 4, 701);
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
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
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
		id: create_default_slot.name,
		type: "slot",
		source: "(29:0) <Row>",
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
	document.title = title_value = /*title*/ ctx[1];

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_2] },
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
			t1 = text("Оповещения");
			t2 = space();
			create_component(breadcrumb.$$.fragment);
			t3 = space();
			create_component(row.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1uo06u1\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Оповещения");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(row.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 24, 0, 563);
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
			if ((!current || dirty & /*title*/ 2) && title_value !== (title_value = /*title*/ ctx[1])) {
				document.title = title_value;
			}

			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 32) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const row_changes = {};

			if (dirty & /*$$scope*/ 32) {
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

	let title = "Оповещения | UI | Пользовательский интерфейс";

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
	};

	return [colors, title];
}

class Alerts extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Alerts",
			options,
			id: create_fragment.name
		});
	}
}

export default Alerts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnRzLjI5ZGJhOWViLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL3VpL2FsZXJ0cy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgICBpbXBvcnQgIEJyZWFkY3J1bWIgIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGVcIjtcbiAgICBpbXBvcnQgIEJyZWFkY3J1bWJJdGVtICBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWJJdGVtLnN2ZWx0ZVwiO1xuICAgIGltcG9ydCAgUm93ICBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1Jvdy5zdmVsdGVcIjtcbiAgICBpbXBvcnQgIEFsZXJ0ICBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0FsZXJ0LnN2ZWx0ZVwiO1xuXG4gICAgY29uc3QgY29sb3JzID0gW1xuICAgICAgICBcInByaW1hcnlcIixcbiAgICAgICAgXCJzZWNvbmRhcnlcIixcbiAgICAgICAgXCJzdWNjZXNzXCIsXG4gICAgICAgIFwiZGFuZ2VyXCIsXG4gICAgICAgIFwid2FybmluZ1wiLFxuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJsaWdodFwiLFxuICAgICAgICBcImRhcmtcIlxuICAgIF07XG5cblxuICAgIGxldCB0aXRsZSA9IFwi0J7Qv9C+0LLQtdGJ0LXQvdC40Y8gfCBVSSB8INCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC5INC40L3RgtC10YDRhNC10LnRgVwiO1xuPC9zY3JpcHQ+XG5cbjxzdmVsdGU6aGVhZD5cbiAgICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XG48L3N2ZWx0ZTpoZWFkPlxuPGgxIGNsYXNzPVwibXQtNFwiPtCe0L/QvtCy0LXRidC10L3QuNGPPC9oMT5cbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxuICAgIDxCcmVhZGNydW1iSXRlbSBhY3RpdmU+0J7Qv9C+0LLQtdGJ0LXQvdC40Y88L0JyZWFkY3J1bWJJdGVtPlxuPC9CcmVhZGNydW1iPlxuPFJvdz5cbiAgICA8ZGl2IGNsYXNzPVwiY29sLXhsLTZcIj5cbiAgICAgICAgPGgyIGNsYXNzPVwibXQtNFwiPtCe0L/QvtCy0LXRidC10L3QuNGPPC9oMj5cbiAgICAgICAgeyNlYWNoIGNvbG9ycyBhcyBjb2xvcn1cbiAgICAgICAgICAgIDxBbGVydCB7Y29sb3J9PlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cImFsZXJ0LWhlYWRpbmcgdGV4dC1jYXBpdGFsaXplXCI+e2NvbG9yfTwvaDQ+XG4gICAgICAgICAgICAgICAgTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI3RvZG9cIiBjbGFzcz1cImFsZXJ0LWxpbmtcIj5cbiAgICAgICAgICAgICAgICAgICAg0JrRgNC+0LzQtSDRgtC+0LPQviwg0YHRgdGL0LvQutC4INC90LAg0L7Qv9C+0LLQtdGJ0LXQvdC40Y8g0YbQstC10YLQvdGL0LUsINGH0YLQvtCx0Ysg0YHQvtC+0YLQstC10YLRgdGC0LLQvtCy0LDRgtGMINC+0L/QvtCy0LXRidC10L3QuNGOXG4gICAgICAgICAgICAgICAgPC9hPi5cbiAgICAgICAgICAgIDwvQWxlcnQ+XG4gICAgICAgIHsvZWFjaH1cbiAgICA8L2Rpdj5cbjwvUm93PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBK0JlLEdBQU07OztnQ0FBWCxNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBQUMsR0FBTTs7OytCQUFYLE1BQUk7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQUosTUFBSTs7Ozs7Ozs7OztrQ0FBSixNQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BekJKLE1BQU07RUFDUixTQUFTO0VBQ1QsV0FBVztFQUNYLFNBQVM7RUFDVCxRQUFRO0VBQ1IsU0FBUztFQUNULE1BQU07RUFDTixPQUFPO0VBQ1AsTUFBTTs7O0tBSU4sS0FBSyxHQUFHLDhDQUE4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
