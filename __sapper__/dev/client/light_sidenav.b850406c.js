import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, f as element, y as text, J as space, F as create_component, g as claim_element, h as children, z as claim_text, j as detach_dev, K as claim_space, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component } from './client.6f2bcf7d.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.2bb8d790.js';
import { C as Card, a as CardBody } from './CardBody.17819417.js';
import './CardText.0b760632.js';

/* src\routes\layouts\light_sidenav.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\layouts\\light_sidenav.svelte";

// (12:2) <BreadcrumbItem>
function create_default_slot_4(ctx) {
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
			add_location(a, file, 12, 4, 415);
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
		source: "(12:2) <BreadcrumbItem>",
		ctx
	});

	return block;
}

// (15:2) <BreadcrumbItem active>
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Светлая тема");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Светлая тема");
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
		source: "(15:2) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (11:0) <Breadcrumb class="mb-4">
function create_default_slot_2(ctx) {
	let t;
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
				active: true,
				$$slots: { default: [create_default_slot_3] },
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(11:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (19:2) <CardBody>
function create_default_slot_1(ctx) {
	let t0;
	let code0;
	let t1;
	let t2;
	let code1;
	let t3;
	let t4;
	let code2;
	let t5;
	let t6;

	const block = {
		c: function create() {
			t0 = text("Эта страница является примером использования опции боковой навигации со сменой темы. По адресу\r\n    присоединяющий\r\n    ");
			code0 = element("code");
			t1 = text(".l-proton-sidenav-light");
			t2 = text("\r\n    класс к\r\n    ");
			code1 = element("code");
			t3 = text(".l-proton-sidenav");
			t4 = text("\r\n    классу и боковая навигация будет иметь светлую цветовую схему. \r\n     ");
			code2 = element("code");
			t5 = text(".l-proton-sidenav-dark");
			t6 = text("\r\n    также доступен вариант с более темным цветом.");
			this.h();
		},
		l: function claim(nodes) {
			t0 = claim_text(nodes, "Эта страница является примером использования опции боковой навигации со сменой темы. По адресу\r\n    присоединяющий\r\n    ");
			code0 = claim_element(nodes, "CODE", {});
			var code0_nodes = children(code0);
			t1 = claim_text(code0_nodes, ".l-proton-sidenav-light");
			code0_nodes.forEach(detach_dev);
			t2 = claim_text(nodes, "\r\n    класс к\r\n    ");
			code1 = claim_element(nodes, "CODE", {});
			var code1_nodes = children(code1);
			t3 = claim_text(code1_nodes, ".l-proton-sidenav");
			code1_nodes.forEach(detach_dev);
			t4 = claim_text(nodes, "\r\n    классу и боковая навигация будет иметь светлую цветовую схему. \r\n     ");
			code2 = claim_element(nodes, "CODE", {});
			var code2_nodes = children(code2);
			t5 = claim_text(code2_nodes, ".l-proton-sidenav-dark");
			code2_nodes.forEach(detach_dev);
			t6 = claim_text(nodes, "\r\n    также доступен вариант с более темным цветом.");
			this.h();
		},
		h: function hydrate() {
			add_location(code0, file, 21, 4, 679);
			add_location(code1, file, 23, 4, 734);
			add_location(code2, file, 25, 5, 840);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, code0, anchor);
			append_dev(code0, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, code1, anchor);
			append_dev(code1, t3);
			insert_dev(target, t4, anchor);
			insert_dev(target, code2, anchor);
			append_dev(code2, t5);
			insert_dev(target, t6, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(code0);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(code1);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(code2);
			if (detaching) detach_dev(t6);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(19:2) <CardBody>",
		ctx
	});

	return block;
}

// (18:0) <Card>
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
		source: "(18:0) <Card>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let h1;
	let t0;
	let t1;
	let t2;
	let current;

	const breadcrumb = new Breadcrumb({
			props: {
				class: "mb-4",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const card = new Card({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			h1 = element("h1");
			t0 = text("Светлая тема");
			t1 = space();
			create_component(breadcrumb.$$.fragment);
			t2 = space();
			create_component(card.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, "Светлая тема");
			h1_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			claim_component(breadcrumb.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(card.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file, 8, 0, 326);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			append_dev(h1, t0);
			insert_dev(target, t1, anchor);
			mount_component(breadcrumb, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(card, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const breadcrumb_changes = {};

			if (dirty & /*$$scope*/ 1) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const card_changes = {};

			if (dirty & /*$$scope*/ 1) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(breadcrumb.$$.fragment, local);
			transition_in(card.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(breadcrumb.$$.fragment, local);
			transition_out(card.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			destroy_component(breadcrumb, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(card, detaching);
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

class Light_sidenav extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Light_sidenav",
			options,
			id: create_fragment.name
		});
	}
}

export default Light_sidenav;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRfc2lkZW5hdi5iODUwNDA2Yy5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
