import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, f as element, y as text, J as space, F as create_component, g as claim_element, h as children, z as claim_text, j as detach_dev, K as claim_space, G as claim_component, k as attr_dev, l as add_location, U as set_style, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component } from './client.e65d8745.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.482a5952.js';
import { C as Card, a as CardBody } from './CardBody.6f9e61d6.js';
import './CardText.74980aa0.js';

/* src\routes\layouts\static_navigation.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\layouts\\static_navigation.svelte";

// (11:2) <BreadcrumbItem>
function create_default_slot_6(ctx) {
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
			add_location(a, file, 11, 4, 422);
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
		id: create_default_slot_6.name,
		type: "slot",
		source: "(11:2) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (14:2) <BreadcrumbItem active>
function create_default_slot_5(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Статическая навигация");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Статическая навигация");
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
		id: create_default_slot_5.name,
		type: "slot",
		source: "(14:2) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (10:0) <Breadcrumb class="mb-4">
function create_default_slot_4(ctx) {
	let t;
	let current;

	const breadcrumbitem0 = new BreadcrumbItem({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const breadcrumbitem1 = new BreadcrumbItem({
			props: {
				active: true,
				$$slots: { default: [create_default_slot_5] },
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
		id: create_default_slot_4.name,
		type: "slot",
		source: "(10:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (18:2) <CardBody>
function create_default_slot_3(ctx) {
	let p;
	let t0;
	let code0;
	let t1;
	let t2;
	let code1;
	let t3;
	let t4;

	const block = {
		c: function create() {
			p = element("p");
			t0 = text("Эта страница является примером использования статической навигации. Удаляя     \r\n      ");
			code0 = element("code");
			t1 = text(".l-proton-nav-fixed");
			t2 = text("\r\n       класс из\r\n      ");
			code1 = element("code");
			t3 = text("body");
			t4 = text("\r\n      верхняя навигация и боковая навигация станут статичными при прокрутке.\r\n      Прокрутите эту страницу вниз, чтобы увидеть пример.");
			this.h();
		},
		l: function claim(nodes) {
			p = claim_element(nodes, "P", { class: true });
			var p_nodes = children(p);
			t0 = claim_text(p_nodes, "Эта страница является примером использования статической навигации. Удаляя     \r\n      ");
			code0 = claim_element(p_nodes, "CODE", {});
			var code0_nodes = children(code0);
			t1 = claim_text(code0_nodes, ".l-proton-nav-fixed");
			code0_nodes.forEach(detach_dev);
			t2 = claim_text(p_nodes, "\r\n       класс из\r\n      ");
			code1 = claim_element(p_nodes, "CODE", {});
			var code1_nodes = children(code1);
			t3 = claim_text(code1_nodes, "body");
			code1_nodes.forEach(detach_dev);
			t4 = claim_text(p_nodes, "\r\n      верхняя навигация и боковая навигация станут статичными при прокрутке.\r\n      Прокрутите эту страницу вниз, чтобы увидеть пример.");
			p_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(code0, file, 20, 6, 699);
			add_location(code1, file, 22, 6, 756);
			attr_dev(p, "class", "mb-0");
			add_location(p, file, 18, 4, 588);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t0);
			append_dev(p, code0);
			append_dev(code0, t1);
			append_dev(p, t2);
			append_dev(p, code1);
			append_dev(code1, t3);
			append_dev(p, t4);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(18:2) <CardBody>",
		ctx
	});

	return block;
}

// (17:0) <Card class="mb-4">
function create_default_slot_2(ctx) {
	let current;

	const cardbody = new CardBody({
			props: {
				$$slots: { default: [create_default_slot_3] },
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(17:0) <Card class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (31:2) <CardBody>
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("При прокрутке навигация остается в верхней части страницы. Это конец\r\n    статической навигационной демонстрации");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "При прокрутке навигация остается в верхней части страницы. Это конец\r\n    статической навигационной демонстрации");
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
		id: create_default_slot_1.name,
		type: "slot",
		source: "(31:2) <CardBody>",
		ctx
	});

	return block;
}

// (30:0) <Card class="mb-4">
function create_default_slot(ctx) {
	let current;

	const cardbody = new CardBody({
			props: {
				$$slots: { default: [create_default_slot_1] },
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
	let div;
	let t4;
	let current;

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const card0 = new Card({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_2] },
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
			t0 = text("Статическая навигация");
			t1 = space();
			create_component(breadcrumb.$$.fragment);
			t2 = space();
			create_component(card0.$$.fragment);
			t3 = space();
			div = element("div");
			t4 = space();
			create_component(card1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, "Статическая навигация");
			h1_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(card0.$$.fragment, nodes);
			t3 = claim_space(nodes);
			div = claim_element(nodes, "DIV", { style: true });
			children(div).forEach(detach_dev);
			t4 = claim_space(nodes);
			claim_component(card1.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 8, 0, 326);
			set_style(div, "height", "100vh");
			add_location(div, file, 28, 0, 946);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			append_dev(h1, t0);
			insert_dev(target, t1, anchor);
			mount_component(breadcrumb, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(card0, target, anchor);
			insert_dev(target, t3, anchor);
			insert_dev(target, div, anchor);
			insert_dev(target, t4, anchor);
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
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t4);
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

class Static_navigation extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Static_navigation",
			options,
			id: create_fragment.name
		});
	}
}

export default Static_navigation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX25hdmlnYXRpb24uY2E0ZjhhZmUuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
