import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, f as element, F as create_component, g as claim_element, h as children, G as claim_component, j as detach_dev, k as attr_dev, l as add_location, n as insert_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, P as Form, J as space, K as claim_space, y as text, z as claim_text, o as append_dev, Q as Label, R as Input, T as CustomInput, U as Button, B as noop } from './client.e0516f61.js';
import { C as Card, a as CardBody } from './CardBody.884d6112.js';
import { C as CardHeader } from './CardHeader.d9d2f400.js';
import './CardFooter.f945c30f.js';
import { F as FormGroup } from './FormGroup.6ef0f15e.js';

/* src\routes\settings.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\settings.svelte";

// (16:4) <CardHeader>
function create_default_slot_14(ctx) {
	let h3;
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text("Настройки");
			this.h();
		},
		l: function claim(nodes) {
			h3 = claim_element(nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t = claim_text(h3_nodes, "Настройки");
			h3_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h3, "class", "text-center font-weight-light my-4");
			add_location(h3, file, 16, 6, 695);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_14.name,
		type: "slot",
		source: "(16:4) <CardHeader>",
		ctx
	});

	return block;
}

// (22:10) <Label for="name" class="small mb-1">
function create_default_slot_13(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Имя");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Имя");
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
		id: create_default_slot_13.name,
		type: "slot",
		source: "(22:10) <Label for=\\\"name\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (21:8) <FormGroup>
function create_default_slot_12(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "name",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_13] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "text",
				name: "first_name",
				placeholder: "Введите имя"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(label.$$.fragment);
			t = space();
			create_component(input.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(label.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(input.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(label, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(input, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const label_changes = {};

			if (dirty & /*$$scope*/ 1) {
				label_changes.$$scope = { dirty, ctx };
			}

			label.$set(label_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(label.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(label.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(label, detaching);
			if (detaching) detach_dev(t);
			destroy_component(input, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_12.name,
		type: "slot",
		source: "(21:8) <FormGroup>",
		ctx
	});

	return block;
}

// (30:10) <Label for="name" class="small mb-1">
function create_default_slot_11(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Фамилия");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Фамилия");
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
		source: "(30:10) <Label for=\\\"name\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (29:8) <FormGroup>
function create_default_slot_10(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "name",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_11] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "text",
				name: "last_name",
				placeholder: "Введите фамилию"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(label.$$.fragment);
			t = space();
			create_component(input.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(label.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(input.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(label, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(input, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const label_changes = {};

			if (dirty & /*$$scope*/ 1) {
				label_changes.$$scope = { dirty, ctx };
			}

			label.$set(label_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(label.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(label.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(label, detaching);
			if (detaching) detach_dev(t);
			destroy_component(input, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_10.name,
		type: "slot",
		source: "(29:8) <FormGroup>",
		ctx
	});

	return block;
}

// (38:10) <Label for="exampleEmail" class="small mb-1">
function create_default_slot_9(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Email");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Email");
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
		source: "(38:10) <Label for=\\\"exampleEmail\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (37:8) <FormGroup>
function create_default_slot_8(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "exampleEmail",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "email",
				name: "email",
				id: "exampleEmail",
				placeholder: "Введите адрес электронной почты"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(label.$$.fragment);
			t = space();
			create_component(input.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(label.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(input.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(label, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(input, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const label_changes = {};

			if (dirty & /*$$scope*/ 1) {
				label_changes.$$scope = { dirty, ctx };
			}

			label.$set(label_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(label.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(label.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(label, detaching);
			if (detaching) detach_dev(t);
			destroy_component(input, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_8.name,
		type: "slot",
		source: "(37:8) <FormGroup>",
		ctx
	});

	return block;
}

// (47:10) <Label for="examplePassword" class="small mb-1">
function create_default_slot_7(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Пароль");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Пароль");
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
		id: create_default_slot_7.name,
		type: "slot",
		source: "(47:10) <Label for=\\\"examplePassword\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (46:8) <FormGroup>
function create_default_slot_6(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "examplePassword",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "password",
				name: "password",
				id: "examplePassword",
				placeholder: "Введите пароль"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(label.$$.fragment);
			t = space();
			create_component(input.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(label.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(input.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(label, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(input, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const label_changes = {};

			if (dirty & /*$$scope*/ 1) {
				label_changes.$$scope = { dirty, ctx };
			}

			label.$set(label_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(label.$$.fragment, local);
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(label.$$.fragment, local);
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(label, detaching);
			if (detaching) detach_dev(t);
			destroy_component(input, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6.name,
		type: "slot",
		source: "(46:8) <FormGroup>",
		ctx
	});

	return block;
}

// (55:8) <FormGroup>
function create_default_slot_5(ctx) {
	let current;

	const custominput = new CustomInput({
			props: {
				type: "checkbox",
				id: "exampleCustomCheckbox",
				label: "Запомнить пароль"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(custominput.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(custominput.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(custominput, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(custominput.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(custominput.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(custominput, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(55:8) <FormGroup>",
		ctx
	});

	return block;
}

// (63:10) <Button block color="danger" href=".">
function create_default_slot_4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Сохранить");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Сохранить");
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
		source: "(63:10) <Button block color=\\\"danger\\\" href=\\\".\\\">",
		ctx
	});

	return block;
}

// (61:8) <FormGroup           class="d-flex align-items-center justify-content-between mt-4 mb-0">
function create_default_slot_3(ctx) {
	let current;

	const button = new Button({
			props: {
				block: true,
				color: "danger",
				href: ".",
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(button.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(button.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(button, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty & /*$$scope*/ 1) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(button, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(61:8) <FormGroup           class=\\\"d-flex align-items-center justify-content-between mt-4 mb-0\\\">",
		ctx
	});

	return block;
}

// (20:6) <Form>
function create_default_slot_2(ctx) {
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let current;

	const formgroup0 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_12] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup1 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup2 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup3 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup4 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup5 = new FormGroup({
			props: {
				class: "d-flex align-items-center justify-content-between mt-4 mb-0",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(formgroup0.$$.fragment);
			t0 = space();
			create_component(formgroup1.$$.fragment);
			t1 = space();
			create_component(formgroup2.$$.fragment);
			t2 = space();
			create_component(formgroup3.$$.fragment);
			t3 = space();
			create_component(formgroup4.$$.fragment);
			t4 = space();
			create_component(formgroup5.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(formgroup0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(formgroup1.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(formgroup2.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(formgroup3.$$.fragment, nodes);
			t3 = claim_space(nodes);
			claim_component(formgroup4.$$.fragment, nodes);
			t4 = claim_space(nodes);
			claim_component(formgroup5.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(formgroup0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(formgroup1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(formgroup2, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(formgroup3, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(formgroup4, target, anchor);
			insert_dev(target, t4, anchor);
			mount_component(formgroup5, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const formgroup0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup0_changes.$$scope = { dirty, ctx };
			}

			formgroup0.$set(formgroup0_changes);
			const formgroup1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup1_changes.$$scope = { dirty, ctx };
			}

			formgroup1.$set(formgroup1_changes);
			const formgroup2_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup2_changes.$$scope = { dirty, ctx };
			}

			formgroup2.$set(formgroup2_changes);
			const formgroup3_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup3_changes.$$scope = { dirty, ctx };
			}

			formgroup3.$set(formgroup3_changes);
			const formgroup4_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup4_changes.$$scope = { dirty, ctx };
			}

			formgroup4.$set(formgroup4_changes);
			const formgroup5_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup5_changes.$$scope = { dirty, ctx };
			}

			formgroup5.$set(formgroup5_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(formgroup0.$$.fragment, local);
			transition_in(formgroup1.$$.fragment, local);
			transition_in(formgroup2.$$.fragment, local);
			transition_in(formgroup3.$$.fragment, local);
			transition_in(formgroup4.$$.fragment, local);
			transition_in(formgroup5.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(formgroup0.$$.fragment, local);
			transition_out(formgroup1.$$.fragment, local);
			transition_out(formgroup2.$$.fragment, local);
			transition_out(formgroup3.$$.fragment, local);
			transition_out(formgroup4.$$.fragment, local);
			transition_out(formgroup5.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(formgroup0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(formgroup1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(formgroup2, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(formgroup3, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(formgroup4, detaching);
			if (detaching) detach_dev(t4);
			destroy_component(formgroup5, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(20:6) <Form>",
		ctx
	});

	return block;
}

// (19:4) <CardBody>
function create_default_slot_1(ctx) {
	let current;

	const form = new Form({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(form.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(form.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(form, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const form_changes = {};

			if (dirty & /*$$scope*/ 1) {
				form_changes.$$scope = { dirty, ctx };
			}

			form.$set(form_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(form.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(form.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(form, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(19:4) <CardBody>",
		ctx
	});

	return block;
}

// (15:2) <Card class="shadow-lg border-0 rounded-lg mt-5">
function create_default_slot(ctx) {
	let t;
	let current;

	const cardheader = new CardHeader({
			props: {
				$$slots: { default: [create_default_slot_14] },
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
		source: "(15:2) <Card class=\\\"shadow-lg border-0 rounded-lg mt-5\\\">",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div;
	let current;

	const card = new Card({
			props: {
				class: "shadow-lg border-0 rounded-lg mt-5",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(card.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(card.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "col-lg-8 mx-auto my-5");
			add_location(div, file, 13, 0, 584);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(card, div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const card_changes = {};

			if (dirty & /*$$scope*/ 1) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(card.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(card.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(card);
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

class Settings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Settings",
			options,
			id: create_fragment.name
		});
	}
}

export default Settings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuOTk4MDBiNDQuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
