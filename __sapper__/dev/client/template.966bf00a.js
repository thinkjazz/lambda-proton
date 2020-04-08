import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, J as space, f as element, y as text, F as create_component, L as query_selector_all, j as detach_dev, K as claim_space, g as claim_element, h as children, z as claim_text, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component } from './client.2916a452.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.5ab15063.js';
import { R as Row } from './Row.f6e5ec83.js';
import './ButtonGroup.6d5f9716.js';

/* src\routes\ui\template.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\ui\\template.svelte";

// (28:4) <BreadcrumbItem active>
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("ШАБЛОН");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "ШАБЛОН");
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
		source: "(28:4) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (27:0) <Breadcrumb class="mb-4">
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

			if (dirty & /*$$scope*/ 4) {
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
		source: "(27:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (30:0) <Row>
function create_default_slot_1(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let h3;
	let t2;

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("ШАБЛОН");
			t1 = space();
			h3 = element("h3");
			t2 = text("Пример");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h2 = claim_element(div_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "ШАБЛОН");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div_nodes);
			h3 = claim_element(div_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t2 = claim_text(h3_nodes, "Пример");
			h3_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 31, 8, 819);
			attr_dev(h3, "class", "mt-4");
			add_location(h3, file, 32, 8, 857);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 30, 4, 787);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);
			append_dev(div, h3);
			append_dev(h3, t2);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(30:0) <Row>",
		ctx
	});

	return block;
}

// (37:0) <Row>
function create_default_slot(ctx) {
	let div;
	let h2;
	let t0;
	let t1;
	let h3;
	let t2;
	let t3;
	let p0;
	let t4;
	let t5;
	let p1;
	let small;
	let t6;

	const block = {
		c: function create() {
			div = element("div");
			h2 = element("h2");
			t0 = text("ШАБЛОН");
			t1 = space();
			h3 = element("h3");
			t2 = text("Пример");
			t3 = space();
			p0 = element("p");
			t4 = text("Переключайте видимость контента в вашем проекте\r\n    с помощью нескольких классов и наших плагинов JavaScript.");
			t5 = space();
			p1 = element("p");
			small = element("small");
			t6 = text("Как это работает\r\n    Плагин JavaScript используется для отображения и скрытия\r\n    содержимого.\r\n    Кнопки или якоря используются в качестве триггеров,\r\n    которые привязываются к определенным элементам, которые\r\n    вы переключите.\r\n    Свертывание элемента анимирует высоту от текущего значения до 0.\r\n    Учитывая, как CSS обрабатывает анимацию, вы не можете использовать подкладку на .свертывающемся элементе. Вместо этого используйте класс в качестве независимого оберточного элемента.\r\n    Эффект анимации этого элемента зависит от медиа-запроса\r\n    \"Предпочтение - уменьшение движения\".");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			h2 = claim_element(div_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "ШАБЛОН");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div_nodes);
			h3 = claim_element(div_nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t2 = claim_text(h3_nodes, "Пример");
			h3_nodes.forEach(detach_dev);
			t3 = claim_space(div_nodes);
			p0 = claim_element(div_nodes, "P", { class: true });
			var p0_nodes = children(p0);
			t4 = claim_text(p0_nodes, "Переключайте видимость контента в вашем проекте\r\n    с помощью нескольких классов и наших плагинов JavaScript.");
			p0_nodes.forEach(detach_dev);
			t5 = claim_space(div_nodes);
			p1 = claim_element(div_nodes, "P", {});
			var p1_nodes = children(p1);
			small = claim_element(p1_nodes, "SMALL", {});
			var small_nodes = children(small);
			t6 = claim_text(small_nodes, "Как это работает\r\n    Плагин JavaScript используется для отображения и скрытия\r\n    содержимого.\r\n    Кнопки или якоря используются в качестве триггеров,\r\n    которые привязываются к определенным элементам, которые\r\n    вы переключите.\r\n    Свертывание элемента анимирует высоту от текущего значения до 0.\r\n    Учитывая, как CSS обрабатывает анимацию, вы не можете использовать подкладку на .свертывающемся элементе. Вместо этого используйте класс в качестве независимого оберточного элемента.\r\n    Эффект анимации этого элемента зависит от медиа-запроса\r\n    \"Предпочтение - уменьшение движения\".");
			small_nodes.forEach(detach_dev);
			p1_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 38, 8, 952);
			attr_dev(h3, "class", "mt-4");
			add_location(h3, file, 39, 8, 990);
			attr_dev(p0, "class", "lead");
			add_location(p0, file, 40, 0, 1020);
			add_location(small, file, 44, 3, 1163);
			add_location(p1, file, 44, 0, 1160);
			attr_dev(div, "class", "col-xl-6");
			add_location(div, file, 37, 4, 920);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h2);
			append_dev(h2, t0);
			append_dev(div, t1);
			append_dev(div, h3);
			append_dev(h3, t2);
			append_dev(div, t3);
			append_dev(div, p0);
			append_dev(p0, t4);
			append_dev(div, t5);
			append_dev(div, p1);
			append_dev(p1, small);
			append_dev(small, t6);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(37:0) <Row>",
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
	let current;
	document.title = title_value = /*title*/ ctx[0];

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row0 = new Row({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row1 = new Row({
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
			t1 = text("ШАБЛОН");
			t2 = space();
			create_component(breadcrumb.$$.fragment);
			t3 = space();
			create_component(row0.$$.fragment);
			t4 = space();
			create_component(row1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-46oba3\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "ШАБЛОН");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(row0.$$.fragment, nodes);
			t4 = claim_space(nodes);
			claim_component(row1.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 25, 0, 652);
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
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*title*/ 1) && title_value !== (title_value = /*title*/ ctx[0])) {
				document.title = title_value;
			}

			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 4) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const row0_changes = {};

			if (dirty & /*$$scope*/ 4) {
				row0_changes.$$scope = { dirty, ctx };
			}

			row0.$set(row0_changes);
			const row1_changes = {};

			if (dirty & /*$$scope*/ 4) {
				row1_changes.$$scope = { dirty, ctx };
			}

			row1.$set(row1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb.$$.fragment, local);
			transition_in(row0.$$.fragment, local);
			transition_in(row1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb.$$.fragment, local);
			transition_out(row0.$$.fragment, local);
			transition_out(row1.$$.fragment, local);
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
	let title = "ШАБЛОН | UI | Пользовательский Интерфейс";

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
	};

	return [title];
}

class Template extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Template",
			options,
			id: create_fragment.name
		});
	}
}

export default Template;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuOTY2YmYwMGEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvdWkvdGVtcGxhdGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBsZXQgdGl0bGUgPSBcItCo0JDQkdCb0J7QnSB8IFVJIHwg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40Lkg0JjQvdGC0LXRgNGE0LXQudGBXCI7XHJcbiAgICBpbXBvcnQgIEJyZWFkY3J1bWIgIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgQnJlYWRjcnVtYkl0ZW0gIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYkl0ZW0uc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgIFJvdyAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Sb3cuc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgIEJ1dHRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgQnV0dG9uR3JvdXAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9CdXR0b25Hcm91cC5zdmVsdGVcIjtcclxuICAgIGNvbnN0IGNvbG9ycyA9IFtcclxuICAgICAgICBcInByaW1hcnlcIixcclxuICAgICAgICBcInNlY29uZGFyeVwiLFxyXG4gICAgICAgIFwic3VjY2Vzc1wiLFxyXG4gICAgICAgIFwiZGFuZ2VyXCIsXHJcbiAgICAgICAgXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgXCJpbmZvXCIsXHJcbiAgICAgICAgXCJsaWdodFwiLFxyXG4gICAgICAgIFwiZGFya1wiXHJcbiAgICBdO1xyXG5cclxuXHJcblxyXG48L3NjcmlwdD5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuICAgIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuPGgxIGNsYXNzPVwibXQtNFwiPtCo0JDQkdCb0J7QnTwvaDE+XHJcbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxyXG4gICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7QqNCQ0JHQm9Ce0J08L0JyZWFkY3J1bWJJdGVtPlxyXG48L0JyZWFkY3J1bWI+XHJcbjxSb3c+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLXhsLTZcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJtdC00XCI+0KjQkNCR0JvQntCdPC9oMj5cclxuICAgICAgICA8aDMgY2xhc3M9XCJtdC00XCI+0J/RgNC40LzQtdGAPC9oMz5cclxuICAgIDwvZGl2PlxyXG48L1Jvdz5cclxuXHJcbjxSb3c+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLXhsLTZcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJtdC00XCI+0KjQkNCR0JvQntCdPC9oMj5cclxuICAgICAgICA8aDMgY2xhc3M9XCJtdC00XCI+0J/RgNC40LzQtdGAPC9oMz5cclxuPHAgY2xhc3M9XCJsZWFkXCI+XHJcbiAgICDQn9C10YDQtdC60LvRjtGH0LDQudGC0LUg0LLQuNC00LjQvNC+0YHRgtGMINC60L7QvdGC0LXQvdGC0LAg0LIg0LLQsNGI0LXQvCDQv9GA0L7QtdC60YLQtVxyXG4gICAg0YEg0L/QvtC80L7RidGM0Y4g0L3QtdGB0LrQvtC70YzQutC40YUg0LrQu9Cw0YHRgdC+0LIg0Lgg0L3QsNGI0LjRhSDQv9C70LDQs9C40L3QvtCyIEphdmFTY3JpcHQuXHJcbjwvcD5cclxuPHA+PHNtYWxsPtCa0LDQuiDRjdGC0L4g0YDQsNCx0L7RgtCw0LXRglxyXG4gICAg0J/Qu9Cw0LPQuNC9IEphdmFTY3JpcHQg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQvtGC0L7QsdGA0LDQttC10L3QuNGPINC4INGB0LrRgNGL0YLQuNGPXHJcbiAgICDRgdC+0LTQtdGA0LbQuNC80L7Qs9C+LlxyXG4gICAg0JrQvdC+0L/QutC4INC40LvQuCDRj9C60L7RgNGPINC40YHQv9C+0LvRjNC30YPRjtGC0YHRjyDQsiDQutCw0YfQtdGB0YLQstC1INGC0YDQuNCz0LPQtdGA0L7QsixcclxuICAgINC60L7RgtC+0YDRi9C1INC/0YDQuNCy0Y/Qt9GL0LLQsNGO0YLRgdGPINC6INC+0L/RgNC10LTQtdC70LXQvdC90YvQvCDRjdC70LXQvNC10L3RgtCw0LwsINC60L7RgtC+0YDRi9C1XHJcbiAgICDQstGLINC/0LXRgNC10LrQu9GO0YfQuNGC0LUuXHJcbiAgICDQodCy0LXRgNGC0YvQstCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LDQvdC40LzQuNGA0YPQtdGCINCy0YvRgdC+0YLRgyDQvtGCINGC0LXQutGD0YnQtdCz0L4g0LfQvdCw0YfQtdC90LjRjyDQtNC+IDAuXHJcbiAgICDQo9GH0LjRgtGL0LLQsNGPLCDQutCw0LogQ1NTINC+0LHRgNCw0LHQsNGC0YvQstCw0LXRgiDQsNC90LjQvNCw0YbQuNGOLCDQstGLINC90LUg0LzQvtC20LXRgtC1INC40YHQv9C+0LvRjNC30L7QstCw0YLRjCDQv9C+0LTQutC70LDQtNC60YMg0L3QsCAu0YHQstC10YDRgtGL0LLQsNGO0YnQtdC80YHRjyDRjdC70LXQvNC10L3RgtC1LiDQktC80LXRgdGC0L4g0Y3RgtC+0LPQviDQuNGB0L/QvtC70YzQt9GD0LnRgtC1INC60LvQsNGB0YEg0LIg0LrQsNGH0LXRgdGC0LLQtSDQvdC10LfQsNCy0LjRgdC40LzQvtCz0L4g0L7QsdC10YDRgtC+0YfQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwLlxyXG4gICAg0K3RhNGE0LXQutGCINCw0L3QuNC80LDRhtC40Lgg0Y3RgtC+0LPQviDRjdC70LXQvNC10L3RgtCwINC30LDQstC40YHQuNGCINC+0YIg0LzQtdC00LjQsC3Qt9Cw0L/RgNC+0YHQsFxyXG4gICAgXCLQn9GA0LXQtNC/0L7Rh9GC0LXQvdC40LUgLSDRg9C80LXQvdGM0YjQtdC90LjQtSDQtNCy0LjQttC10L3QuNGPXCIuPC9zbWFsbD48L3A+XHJcbjwvZGl2PlxyXG5cclxuPC9Sb3c+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FDUSxLQUFLLEdBQUcsMENBQTBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
