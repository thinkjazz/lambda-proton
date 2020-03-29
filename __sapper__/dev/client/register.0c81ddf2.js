import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, F as create_component, G as claim_component, H as mount_component, r as transition_in, t as transition_out, I as destroy_component, O as Form, J as space, K as claim_space, n as insert_dev, j as detach_dev, f as element, y as text, g as claim_element, h as children, z as claim_text, k as attr_dev, l as add_location, o as append_dev, P as Label, Q as Input, T as Button } from './client.3431eff5.js';
import { C as Card, a as CardBody } from './CardBody.fa9b1c82.js';
import { C as CardHeader } from './CardHeader.674530c3.js';
import { R as Row } from './Row.03ac231f.js';
import { C as CardFooter } from './CardFooter.a24a6e4c.js';
import { F as FormGroup } from './FormGroup.737cfaf4.js';
import { C as Col } from './Col.f4cc0b0b.js';

/* src\routes\pages\authentication\register.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\pages\\authentication\\register.svelte";

// (17:4) <CardHeader>
function create_default_slot_19(ctx) {
	let h3;
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text("Create Account");
			this.h();
		},
		l: function claim(nodes) {
			h3 = claim_element(nodes, "H3", { class: true });
			var h3_nodes = children(h3);
			t = claim_text(h3_nodes, "Create Account");
			h3_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h3, "class", "text-center font-weight-light my-4");
			add_location(h3, file, 17, 6, 731);
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
		id: create_default_slot_19.name,
		type: "slot",
		source: "(17:4) <CardHeader>",
		ctx
	});

	return block;
}

// (25:14) <Label for="inputFirstName" class="small mb-1">
function create_default_slot_18(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("First Name");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "First Name");
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
		id: create_default_slot_18.name,
		type: "slot",
		source: "(25:14) <Label for=\\\"inputFirstName\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (24:12) <FormGroup>
function create_default_slot_17(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "inputFirstName",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_18] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "text",
				name: "firstName",
				id: "inputFirstName",
				placeholder: "Enter first name"
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
		id: create_default_slot_17.name,
		type: "slot",
		source: "(24:12) <FormGroup>",
		ctx
	});

	return block;
}

// (36:14) <Label for="inputLastName" class="small mb-1">
function create_default_slot_16(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Last Name");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Last Name");
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
		id: create_default_slot_16.name,
		type: "slot",
		source: "(36:14) <Label for=\\\"inputLastName\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (35:12) <FormGroup>
function create_default_slot_15(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "inputLastName",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_16] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "text",
				name: "lastName",
				id: "inputLastName",
				placeholder: "Enter last name"
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
		id: create_default_slot_15.name,
		type: "slot",
		source: "(35:12) <FormGroup>",
		ctx
	});

	return block;
}

// (22:8) <Row form>
function create_default_slot_14(ctx) {
	let div0;
	let t;
	let div1;
	let current;

	const formgroup0 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_17] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup1 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_15] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div0 = element("div");
			create_component(formgroup0.$$.fragment);
			t = space();
			div1 = element("div");
			create_component(formgroup1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			claim_component(formgroup0.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			claim_component(formgroup1.$$.fragment, div1_nodes);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "col-md-6");
			add_location(div0, file, 22, 10, 878);
			attr_dev(div1, "class", "col-md-6");
			add_location(div1, file, 33, 10, 1265);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			mount_component(formgroup0, div0, null);
			insert_dev(target, t, anchor);
			insert_dev(target, div1, anchor);
			mount_component(formgroup1, div1, null);
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
		},
		i: function intro(local) {
			if (current) return;
			transition_in(formgroup0.$$.fragment, local);
			transition_in(formgroup1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(formgroup0.$$.fragment, local);
			transition_out(formgroup1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_component(formgroup0);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div1);
			destroy_component(formgroup1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_14.name,
		type: "slot",
		source: "(22:8) <Row form>",
		ctx
	});

	return block;
}

// (47:10) <Label for="exampleEmail" class="small mb-1">
function create_default_slot_13(ctx) {
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
		id: create_default_slot_13.name,
		type: "slot",
		source: "(47:10) <Label for=\\\"exampleEmail\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (46:8) <FormGroup>
function create_default_slot_12(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "exampleEmail",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_13] },
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
				placeholder: "Enter email address"
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
		source: "(46:8) <FormGroup>",
		ctx
	});

	return block;
}

// (58:14) <Label for="inputPassword" class="small mb-1">
function create_default_slot_11(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Password");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Password");
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
		source: "(58:14) <Label for=\\\"inputPassword\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (57:12) <FormGroup>
function create_default_slot_10(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "inputPassword",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_11] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "password",
				name: "inputPassword",
				id: "inputPassword",
				placeholder: "Enter password"
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
		source: "(57:12) <FormGroup>",
		ctx
	});

	return block;
}

// (69:14) <Label for="inputConfirmPassword" class="small mb-1">
function create_default_slot_9(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Confirm Password");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Confirm Password");
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
		source: "(69:14) <Label for=\\\"inputConfirmPassword\\\" class=\\\"small mb-1\\\">",
		ctx
	});

	return block;
}

// (68:12) <FormGroup>
function create_default_slot_8(ctx) {
	let t;
	let current;

	const label = new Label({
			props: {
				for: "inputConfirmPassword",
				class: "small mb-1",
				$$slots: { default: [create_default_slot_9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const input = new Input({
			props: {
				class: "py-4",
				type: "password",
				name: "inputConfirmPassword",
				id: "inputConfirmPassword",
				placeholder: "Confirm password"
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
		source: "(68:12) <FormGroup>",
		ctx
	});

	return block;
}

// (55:8) <Row form>
function create_default_slot_7(ctx) {
	let div0;
	let t;
	let div1;
	let current;

	const formgroup0 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup1 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div0 = element("div");
			create_component(formgroup0.$$.fragment);
			t = space();
			div1 = element("div");
			create_component(formgroup1.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			claim_component(formgroup0.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			claim_component(formgroup1.$$.fragment, div1_nodes);
			div1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "col-md-6");
			add_location(div0, file, 55, 10, 1973);
			attr_dev(div1, "class", "col-md-6");
			add_location(div1, file, 66, 10, 2362);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			mount_component(formgroup0, div0, null);
			insert_dev(target, t, anchor);
			insert_dev(target, div1, anchor);
			mount_component(formgroup1, div1, null);
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
		},
		i: function intro(local) {
			if (current) return;
			transition_in(formgroup0.$$.fragment, local);
			transition_in(formgroup1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(formgroup0.$$.fragment, local);
			transition_out(formgroup1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_component(formgroup0);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div1);
			destroy_component(formgroup1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(55:8) <Row form>",
		ctx
	});

	return block;
}

// (82:10) <Button color="primary" block href="pages/authentication/login">
function create_default_slot_6(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Create Account");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Create Account");
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
		source: "(82:10) <Button color=\\\"primary\\\" block href=\\\"pages/authentication/login\\\">",
		ctx
	});

	return block;
}

// (81:8) <FormGroup class="mt-4 mb-0">
function create_default_slot_5(ctx) {
	let current;

	const button = new Button({
			props: {
				color: "primary",
				block: true,
				href: "pages/authentication/login",
				$$slots: { default: [create_default_slot_6] },
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
		id: create_default_slot_5.name,
		type: "slot",
		source: "(81:8) <FormGroup class=\\\"mt-4 mb-0\\\">",
		ctx
	});

	return block;
}

// (21:6) <Form>
function create_default_slot_4(ctx) {
	let t0;
	let t1;
	let t2;
	let current;

	const row0 = new Row({
			props: {
				form: true,
				$$slots: { default: [create_default_slot_14] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup0 = new FormGroup({
			props: {
				$$slots: { default: [create_default_slot_12] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const row1 = new Row({
			props: {
				form: true,
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const formgroup1 = new FormGroup({
			props: {
				class: "mt-4 mb-0",
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(row0.$$.fragment);
			t0 = space();
			create_component(formgroup0.$$.fragment);
			t1 = space();
			create_component(row1.$$.fragment);
			t2 = space();
			create_component(formgroup1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(row0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(formgroup0.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(row1.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(formgroup1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(row0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(formgroup0, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(row1, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(formgroup1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const row0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				row0_changes.$$scope = { dirty, ctx };
			}

			row0.$set(row0_changes);
			const formgroup0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup0_changes.$$scope = { dirty, ctx };
			}

			formgroup0.$set(formgroup0_changes);
			const row1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				row1_changes.$$scope = { dirty, ctx };
			}

			row1.$set(row1_changes);
			const formgroup1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				formgroup1_changes.$$scope = { dirty, ctx };
			}

			formgroup1.$set(formgroup1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(row0.$$.fragment, local);
			transition_in(formgroup0.$$.fragment, local);
			transition_in(row1.$$.fragment, local);
			transition_in(formgroup1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(row0.$$.fragment, local);
			transition_out(formgroup0.$$.fragment, local);
			transition_out(row1.$$.fragment, local);
			transition_out(formgroup1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(row0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(formgroup0, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(row1, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(formgroup1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(21:6) <Form>",
		ctx
	});

	return block;
}

// (20:4) <CardBody>
function create_default_slot_3(ctx) {
	let current;

	const form = new Form({
			props: {
				$$slots: { default: [create_default_slot_4] },
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
		id: create_default_slot_3.name,
		type: "slot",
		source: "(20:4) <CardBody>",
		ctx
	});

	return block;
}

// (88:4) <CardFooter class="text-center small">
function create_default_slot_2(ctx) {
	let a;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			t = text("Have an account? Go to login");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			t = claim_text(a_nodes, "Have an account? Go to login");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "href", "pages/authentication/login");
			add_location(a, file, 88, 6, 3090);
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(88:4) <CardFooter class=\\\"text-center small\\\">",
		ctx
	});

	return block;
}

// (16:2) <Card class="shadow-lg border-0 rounded-lg mt-5">
function create_default_slot_1(ctx) {
	let t0;
	let t1;
	let current;

	const cardheader = new CardHeader({
			props: {
				$$slots: { default: [create_default_slot_19] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const cardbody = new CardBody({
			props: {
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const cardfooter = new CardFooter({
			props: {
				class: "text-center small",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(cardheader.$$.fragment);
			t0 = space();
			create_component(cardbody.$$.fragment);
			t1 = space();
			create_component(cardfooter.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(cardheader.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(cardbody.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(cardfooter.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(cardheader, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(cardbody, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(cardfooter, target, anchor);
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
			const cardfooter_changes = {};

			if (dirty & /*$$scope*/ 1) {
				cardfooter_changes.$$scope = { dirty, ctx };
			}

			cardfooter.$set(cardfooter_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(cardheader.$$.fragment, local);
			transition_in(cardbody.$$.fragment, local);
			transition_in(cardfooter.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(cardheader.$$.fragment, local);
			transition_out(cardbody.$$.fragment, local);
			transition_out(cardfooter.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(cardheader, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(cardbody, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(cardfooter, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(16:2) <Card class=\\\"shadow-lg border-0 rounded-lg mt-5\\\">",
		ctx
	});

	return block;
}

// (15:0) <Col class="col-lg-7">
function create_default_slot(ctx) {
	let current;

	const card = new Card({
			props: {
				class: "shadow-lg border-0 rounded-lg mt-5",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(card.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(card.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(card, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
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
			destroy_component(card, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(15:0) <Col class=\\\"col-lg-7\\\">",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current;

	const col = new Col({
			props: {
				class: "col-lg-7",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(col.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(col.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(col, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const col_changes = {};

			if (dirty & /*$$scope*/ 1) {
				col_changes.$$scope = { dirty, ctx };
			}

			col.$set(col_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(col.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(col.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(col, detaching);
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

class Register extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Register",
			options,
			id: create_fragment.name
		});
	}
}

export default Register;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuMGM4MWRkZjIuanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
