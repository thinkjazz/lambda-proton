import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, J as space, f as element, y as text, F as create_component, L as query_selector_all, j as detach_dev, K as claim_space, g as claim_element, h as children, z as claim_text, G as claim_component, k as attr_dev, l as add_location, n as insert_dev, o as append_dev, H as mount_component, r as transition_in, t as transition_out, I as destroy_component } from './client.cbff4c96.js';
import { B as Breadcrumb, a as BreadcrumbItem } from './BreadcrumbItem.c13fcba3.js';
import { R as Row } from './Row.52f195eb.js';
import './FormGroup.12723b78.js';
import './FormText.ba1a9d6b.js';

/* src\routes\ui\inputGroup.svelte generated by Svelte v3.18.1 */
const file = "src\\routes\\ui\\inputGroup.svelte";

// (23:4) <BreadcrumbItem active>
function create_default_slot_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Группы полей");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Группы полей");
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
		source: "(23:4) <BreadcrumbItem active>",
		ctx
	});

	return block;
}

// (22:0) <Breadcrumb class="mb-4">
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
		id: create_default_slot_2.name,
		type: "slot",
		source: "(22:0) <Breadcrumb class=\\\"mb-4\\\">",
		ctx
	});

	return block;
}

// (25:0) <Row>
function create_default_slot_1(ctx) {
	let div12;
	let h2;
	let t0;
	let t1;
	let div1;
	let div0;
	let span0;
	let t2;
	let t3;
	let input0;
	let t4;
	let br0;
	let t5;
	let div3;
	let div2;
	let span1;
	let input1;
	let t6;
	let input2;
	let t7;
	let br1;
	let t8;
	let div5;
	let input3;
	let t9;
	let div4;
	let span2;
	let t10;
	let t11;
	let br2;
	let t12;
	let div8;
	let div6;
	let span3;
	let t13;
	let t14;
	let span4;
	let t15;
	let t16;
	let input4;
	let t17;
	let div7;
	let span5;
	let t18;
	let t19;
	let span6;
	let t20;
	let t21;
	let br3;
	let t22;
	let div11;
	let div9;
	let span7;
	let t23;
	let t24;
	let input5;
	let t25;
	let div10;
	let span8;
	let t26;

	const block = {
		c: function create() {
			div12 = element("div");
			h2 = element("h2");
			t0 = text("Группы полей");
			t1 = space();
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t2 = text("@");
			t3 = space();
			input0 = element("input");
			t4 = space();
			br0 = element("br");
			t5 = space();
			div3 = element("div");
			div2 = element("div");
			span1 = element("span");
			input1 = element("input");
			t6 = space();
			input2 = element("input");
			t7 = space();
			br1 = element("br");
			t8 = space();
			div5 = element("div");
			input3 = element("input");
			t9 = space();
			div4 = element("div");
			span2 = element("span");
			t10 = text("@example.com");
			t11 = space();
			br2 = element("br");
			t12 = space();
			div8 = element("div");
			div6 = element("div");
			span3 = element("span");
			t13 = text("$");
			t14 = space();
			span4 = element("span");
			t15 = text("$");
			t16 = space();
			input4 = element("input");
			t17 = space();
			div7 = element("div");
			span5 = element("span");
			t18 = text("$");
			t19 = space();
			span6 = element("span");
			t20 = text("$");
			t21 = space();
			br3 = element("br");
			t22 = space();
			div11 = element("div");
			div9 = element("div");
			span7 = element("span");
			t23 = text("$");
			t24 = space();
			input5 = element("input");
			t25 = space();
			div10 = element("div");
			span8 = element("span");
			t26 = text(".00");
			this.h();
		},
		l: function claim(nodes) {
			div12 = claim_element(nodes, "DIV", { class: true });
			var div12_nodes = children(div12);
			h2 = claim_element(div12_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Группы полей");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div12_nodes);
			div1 = claim_element(div12_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { addontype: true, class: true });
			var div0_nodes = children(div0);
			span0 = claim_element(div0_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t2 = claim_text(span0_nodes, "@");
			span0_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t3 = claim_space(div1_nodes);

			input0 = claim_element(div1_nodes, "INPUT", {
				placeholder: true,
				id: true,
				type: true,
				class: true,
				name: true
			});

			div1_nodes.forEach(detach_dev);
			t4 = claim_space(div12_nodes);
			br0 = claim_element(div12_nodes, "BR", {});
			t5 = claim_space(div12_nodes);
			div3 = claim_element(div12_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div2 = claim_element(div3_nodes, "DIV", { addontype: true, class: true });
			var div2_nodes = children(div2);
			span1 = claim_element(div2_nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);

			input1 = claim_element(span1_nodes, "INPUT", {
				addon: true,
				"aria-label": true,
				id: true,
				type: true,
				class: true,
				name: true,
				placeholder: true,
				value: true
			});

			span1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			t6 = claim_space(div3_nodes);

			input2 = claim_element(div3_nodes, "INPUT", {
				placeholder: true,
				id: true,
				type: true,
				class: true,
				name: true
			});

			div3_nodes.forEach(detach_dev);
			t7 = claim_space(div12_nodes);
			br1 = claim_element(div12_nodes, "BR", {});
			t8 = claim_space(div12_nodes);
			div5 = claim_element(div12_nodes, "DIV", { class: true });
			var div5_nodes = children(div5);

			input3 = claim_element(div5_nodes, "INPUT", {
				placeholder: true,
				id: true,
				type: true,
				class: true,
				name: true
			});

			t9 = claim_space(div5_nodes);
			div4 = claim_element(div5_nodes, "DIV", { addontype: true, class: true });
			var div4_nodes = children(div4);
			span2 = claim_element(div4_nodes, "SPAN", { class: true });
			var span2_nodes = children(span2);
			t10 = claim_text(span2_nodes, "@example.com");
			span2_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			div5_nodes.forEach(detach_dev);
			t11 = claim_space(div12_nodes);
			br2 = claim_element(div12_nodes, "BR", {});
			t12 = claim_space(div12_nodes);
			div8 = claim_element(div12_nodes, "DIV", { class: true });
			var div8_nodes = children(div8);
			div6 = claim_element(div8_nodes, "DIV", { addontype: true, class: true });
			var div6_nodes = children(div6);
			span3 = claim_element(div6_nodes, "SPAN", { class: true });
			var span3_nodes = children(span3);
			t13 = claim_text(span3_nodes, "$");
			span3_nodes.forEach(detach_dev);
			t14 = claim_space(div6_nodes);
			span4 = claim_element(div6_nodes, "SPAN", { class: true });
			var span4_nodes = children(span4);
			t15 = claim_text(span4_nodes, "$");
			span4_nodes.forEach(detach_dev);
			div6_nodes.forEach(detach_dev);
			t16 = claim_space(div8_nodes);

			input4 = claim_element(div8_nodes, "INPUT", {
				placeholder: true,
				id: true,
				type: true,
				class: true,
				name: true
			});

			t17 = claim_space(div8_nodes);
			div7 = claim_element(div8_nodes, "DIV", { addontype: true, class: true });
			var div7_nodes = children(div7);
			span5 = claim_element(div7_nodes, "SPAN", { class: true });
			var span5_nodes = children(span5);
			t18 = claim_text(span5_nodes, "$");
			span5_nodes.forEach(detach_dev);
			t19 = claim_space(div7_nodes);
			span6 = claim_element(div7_nodes, "SPAN", { class: true });
			var span6_nodes = children(span6);
			t20 = claim_text(span6_nodes, "$");
			span6_nodes.forEach(detach_dev);
			div7_nodes.forEach(detach_dev);
			div8_nodes.forEach(detach_dev);
			t21 = claim_space(div12_nodes);
			br3 = claim_element(div12_nodes, "BR", {});
			t22 = claim_space(div12_nodes);
			div11 = claim_element(div12_nodes, "DIV", { class: true });
			var div11_nodes = children(div11);
			div9 = claim_element(div11_nodes, "DIV", { addontype: true, class: true });
			var div9_nodes = children(div9);
			span7 = claim_element(div9_nodes, "SPAN", { class: true });
			var span7_nodes = children(span7);
			t23 = claim_text(span7_nodes, "$");
			span7_nodes.forEach(detach_dev);
			div9_nodes.forEach(detach_dev);
			t24 = claim_space(div11_nodes);

			input5 = claim_element(div11_nodes, "INPUT", {
				placeholder: true,
				min: true,
				max: true,
				step: true,
				id: true,
				type: true,
				class: true,
				name: true
			});

			t25 = claim_space(div11_nodes);
			div10 = claim_element(div11_nodes, "DIV", { addontype: true, class: true });
			var div10_nodes = children(div10);
			span8 = claim_element(div10_nodes, "SPAN", { class: true });
			var span8_nodes = children(span8);
			t26 = claim_text(span8_nodes, ".00");
			span8_nodes.forEach(detach_dev);
			div10_nodes.forEach(detach_dev);
			div11_nodes.forEach(detach_dev);
			div12_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 26, 8, 937);
			attr_dev(span0, "class", "input-group-text");
			add_location(span0, file, 28, 65, 1073);
			attr_dev(div0, "addontype", "prepend");
			attr_dev(div0, "class", "input-group-prepend");
			add_location(div0, file, 28, 12, 1020);
			attr_dev(input0, "placeholder", "username");
			attr_dev(input0, "id", "");
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "name", "");
			add_location(input0, file, 29, 12, 1132);
			attr_dev(div1, "class", "input-group");
			add_location(div1, file, 27, 8, 981);
			add_location(br0, file, 30, 8, 1225);
			attr_dev(input1, "addon", "true");
			attr_dev(input1, "aria-label", "Checkbox for following text input");
			attr_dev(input1, "id", "");
			attr_dev(input1, "type", "checkbox");
			attr_dev(input1, "class", "");
			attr_dev(input1, "name", "");
			attr_dev(input1, "placeholder", "");
			input1.value = "";
			add_location(input1, file, 33, 12, 1376);
			attr_dev(span1, "class", "input-group-text");
			add_location(span1, file, 32, 65, 1331);
			attr_dev(div2, "addontype", "prepend");
			attr_dev(div2, "class", "input-group-prepend");
			add_location(div2, file, 32, 12, 1278);
			attr_dev(input2, "placeholder", "Check it out");
			attr_dev(input2, "id", "");
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "name", "");
			add_location(input2, file, 40, 12, 1648);
			attr_dev(div3, "class", "input-group");
			add_location(div3, file, 31, 8, 1239);
			add_location(br1, file, 41, 8, 1745);
			attr_dev(input3, "placeholder", "юзернейм");
			attr_dev(input3, "id", "");
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control");
			attr_dev(input3, "name", "");
			add_location(input3, file, 42, 33, 1784);
			attr_dev(span2, "class", "input-group-text");
			add_location(span2, file, 43, 63, 1926);
			attr_dev(div4, "addontype", "append");
			attr_dev(div4, "class", "input-group-append");
			add_location(div4, file, 43, 12, 1875);
			attr_dev(div5, "class", "input-group");
			add_location(div5, file, 42, 8, 1759);
			add_location(br2, file, 45, 8, 2008);
			attr_dev(span3, "class", "input-group-text");
			add_location(span3, file, 47, 65, 2114);
			attr_dev(span4, "class", "input-group-text");
			add_location(span4, file, 47, 105, 2154);
			attr_dev(div6, "addontype", "prepend");
			attr_dev(div6, "class", "input-group-prepend");
			add_location(div6, file, 47, 12, 2061);
			attr_dev(input4, "placeholder", "Dolla dolla billz yo!");
			attr_dev(input4, "id", "");
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control");
			attr_dev(input4, "name", "");
			add_location(input4, file, 49, 12, 2234);
			attr_dev(span5, "class", "input-group-text");
			add_location(span5, file, 50, 63, 2389);
			attr_dev(span6, "class", "input-group-text");
			add_location(span6, file, 50, 103, 2429);
			attr_dev(div7, "addontype", "append");
			attr_dev(div7, "class", "input-group-append");
			add_location(div7, file, 50, 12, 2338);
			attr_dev(div8, "class", "input-group");
			add_location(div8, file, 46, 8, 2022);
			add_location(br3, file, 53, 8, 2521);
			attr_dev(span7, "class", "input-group-text");
			add_location(span7, file, 55, 65, 2627);
			attr_dev(div9, "addontype", "prepend");
			attr_dev(div9, "class", "input-group-prepend");
			add_location(div9, file, 55, 12, 2574);
			attr_dev(input5, "placeholder", "Amount");
			attr_dev(input5, "min", "0");
			attr_dev(input5, "max", "100");
			attr_dev(input5, "step", "1");
			attr_dev(input5, "id", "");
			attr_dev(input5, "type", "number");
			attr_dev(input5, "class", "form-control");
			attr_dev(input5, "name", "");
			add_location(input5, file, 56, 12, 2686);
			attr_dev(span8, "class", "input-group-text");
			add_location(span8, file, 57, 63, 2855);
			attr_dev(div10, "addontype", "append");
			attr_dev(div10, "class", "input-group-append");
			add_location(div10, file, 57, 12, 2804);
			attr_dev(div11, "class", "input-group");
			add_location(div11, file, 54, 8, 2535);
			attr_dev(div12, "class", "col-xl-6");
			add_location(div12, file, 25, 4, 905);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div12, anchor);
			append_dev(div12, h2);
			append_dev(h2, t0);
			append_dev(div12, t1);
			append_dev(div12, div1);
			append_dev(div1, div0);
			append_dev(div0, span0);
			append_dev(span0, t2);
			append_dev(div1, t3);
			append_dev(div1, input0);
			append_dev(div12, t4);
			append_dev(div12, br0);
			append_dev(div12, t5);
			append_dev(div12, div3);
			append_dev(div3, div2);
			append_dev(div2, span1);
			append_dev(span1, input1);
			append_dev(div3, t6);
			append_dev(div3, input2);
			append_dev(div12, t7);
			append_dev(div12, br1);
			append_dev(div12, t8);
			append_dev(div12, div5);
			append_dev(div5, input3);
			append_dev(div5, t9);
			append_dev(div5, div4);
			append_dev(div4, span2);
			append_dev(span2, t10);
			append_dev(div12, t11);
			append_dev(div12, br2);
			append_dev(div12, t12);
			append_dev(div12, div8);
			append_dev(div8, div6);
			append_dev(div6, span3);
			append_dev(span3, t13);
			append_dev(div6, t14);
			append_dev(div6, span4);
			append_dev(span4, t15);
			append_dev(div8, t16);
			append_dev(div8, input4);
			append_dev(div8, t17);
			append_dev(div8, div7);
			append_dev(div7, span5);
			append_dev(span5, t18);
			append_dev(div7, t19);
			append_dev(div7, span6);
			append_dev(span6, t20);
			append_dev(div12, t21);
			append_dev(div12, br3);
			append_dev(div12, t22);
			append_dev(div12, div11);
			append_dev(div11, div9);
			append_dev(div9, span7);
			append_dev(span7, t23);
			append_dev(div11, t24);
			append_dev(div11, input5);
			append_dev(div11, t25);
			append_dev(div11, div10);
			append_dev(div10, span8);
			append_dev(span8, t26);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div12);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(25:0) <Row>",
		ctx
	});

	return block;
}

// (62:0) <Row>
function create_default_slot(ctx) {
	let div7;
	let h2;
	let t0;
	let t1;
	let div6;
	let div1;
	let div0;
	let span0;
	let t2;
	let t3;
	let input0;
	let t4;
	let br0;
	let t5;
	let div3;
	let div2;
	let span1;
	let t6;
	let t7;
	let input1;
	let t8;
	let br1;
	let t9;
	let div5;
	let div4;
	let span2;
	let t10;
	let t11;
	let input2;

	const block = {
		c: function create() {
			div7 = element("div");
			h2 = element("h2");
			t0 = text("Размеры");
			t1 = space();
			div6 = element("div");
			div1 = element("div");
			div0 = element("div");
			span0 = element("span");
			t2 = text("@lg");
			t3 = space();
			input0 = element("input");
			t4 = space();
			br0 = element("br");
			t5 = space();
			div3 = element("div");
			div2 = element("div");
			span1 = element("span");
			t6 = text("@normal");
			t7 = space();
			input1 = element("input");
			t8 = space();
			br1 = element("br");
			t9 = space();
			div5 = element("div");
			div4 = element("div");
			span2 = element("span");
			t10 = text("@sm");
			t11 = space();
			input2 = element("input");
			this.h();
		},
		l: function claim(nodes) {
			div7 = claim_element(nodes, "DIV", { class: true });
			var div7_nodes = children(div7);
			h2 = claim_element(div7_nodes, "H2", { class: true });
			var h2_nodes = children(h2);
			t0 = claim_text(h2_nodes, "Размеры");
			h2_nodes.forEach(detach_dev);
			t1 = claim_space(div7_nodes);
			div6 = claim_element(div7_nodes, "DIV", {});
			var div6_nodes = children(div6);
			div1 = claim_element(div6_nodes, "DIV", { size: true, class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { addontype: true, class: true });
			var div0_nodes = children(div0);
			span0 = claim_element(div0_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t2 = claim_text(span0_nodes, "@lg");
			span0_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t3 = claim_space(div1_nodes);

			input0 = claim_element(div1_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				placeholder: true
			});

			div1_nodes.forEach(detach_dev);
			t4 = claim_space(div6_nodes);
			br0 = claim_element(div6_nodes, "BR", {});
			t5 = claim_space(div6_nodes);
			div3 = claim_element(div6_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div2 = claim_element(div3_nodes, "DIV", { addontype: true, class: true });
			var div2_nodes = children(div2);
			span1 = claim_element(div2_nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);
			t6 = claim_text(span1_nodes, "@normal");
			span1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			t7 = claim_space(div3_nodes);

			input1 = claim_element(div3_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				placeholder: true
			});

			div3_nodes.forEach(detach_dev);
			t8 = claim_space(div6_nodes);
			br1 = claim_element(div6_nodes, "BR", {});
			t9 = claim_space(div6_nodes);
			div5 = claim_element(div6_nodes, "DIV", { size: true, class: true });
			var div5_nodes = children(div5);
			div4 = claim_element(div5_nodes, "DIV", { addontype: true, class: true });
			var div4_nodes = children(div4);
			span2 = claim_element(div4_nodes, "SPAN", { class: true });
			var span2_nodes = children(span2);
			t10 = claim_text(span2_nodes, "@sm");
			span2_nodes.forEach(detach_dev);
			div4_nodes.forEach(detach_dev);
			t11 = claim_space(div5_nodes);

			input2 = claim_element(div5_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				placeholder: true
			});

			div5_nodes.forEach(detach_dev);
			div6_nodes.forEach(detach_dev);
			div7_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(h2, "class", "mt-4");
			add_location(h2, file, 63, 8, 2983);
			attr_dev(span0, "class", "input-group-text");
			add_location(span0, file, 67, 65, 3152);
			attr_dev(div0, "addontype", "prepend");
			attr_dev(div0, "class", "input-group-prepend");
			add_location(div0, file, 67, 12, 3099);
			attr_dev(input0, "id", "");
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "name", "");
			attr_dev(input0, "placeholder", "");
			add_location(input0, file, 68, 12, 3213);
			attr_dev(div1, "size", "lg");
			attr_dev(div1, "class", "input-group input-group-lg");
			add_location(div1, file, 66, 8, 3035);
			add_location(br0, file, 69, 8, 3298);
			attr_dev(span1, "class", "input-group-text");
			add_location(span1, file, 71, 65, 3404);
			attr_dev(div2, "addontype", "prepend");
			attr_dev(div2, "class", "input-group-prepend");
			add_location(div2, file, 71, 12, 3351);
			attr_dev(input1, "id", "");
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control");
			attr_dev(input1, "name", "");
			attr_dev(input1, "placeholder", "");
			add_location(input1, file, 72, 12, 3469);
			attr_dev(div3, "class", "input-group");
			add_location(div3, file, 70, 8, 3312);
			add_location(br1, file, 73, 8, 3554);
			attr_dev(span2, "class", "input-group-text");
			add_location(span2, file, 75, 65, 3685);
			attr_dev(div4, "addontype", "prepend");
			attr_dev(div4, "class", "input-group-prepend");
			add_location(div4, file, 75, 12, 3632);
			attr_dev(input2, "id", "");
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control");
			attr_dev(input2, "name", "");
			attr_dev(input2, "placeholder", "");
			add_location(input2, file, 76, 12, 3746);
			attr_dev(div5, "size", "sm");
			attr_dev(div5, "class", "input-group input-group-sm");
			add_location(div5, file, 74, 8, 3568);
			add_location(div6, file, 65, 4, 3020);
			attr_dev(div7, "class", "col-xl-6");
			add_location(div7, file, 62, 4, 2951);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div7, anchor);
			append_dev(div7, h2);
			append_dev(h2, t0);
			append_dev(div7, t1);
			append_dev(div7, div6);
			append_dev(div6, div1);
			append_dev(div1, div0);
			append_dev(div0, span0);
			append_dev(span0, t2);
			append_dev(div1, t3);
			append_dev(div1, input0);
			append_dev(div6, t4);
			append_dev(div6, br0);
			append_dev(div6, t5);
			append_dev(div6, div3);
			append_dev(div3, div2);
			append_dev(div2, span1);
			append_dev(span1, t6);
			append_dev(div3, t7);
			append_dev(div3, input1);
			append_dev(div6, t8);
			append_dev(div6, br1);
			append_dev(div6, t9);
			append_dev(div6, div5);
			append_dev(div5, div4);
			append_dev(div4, span2);
			append_dev(span2, t10);
			append_dev(div5, t11);
			append_dev(div5, input2);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div7);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(62:0) <Row>",
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
			t1 = text("Группы полей");
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
			t1 = claim_text(h1_nodes, "Группы полей");
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
			add_location(h1, file, 20, 0, 758);
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

			if (dirty & /*$$scope*/ 2) {
				breadcrumb_changes.$$scope = { dirty, ctx };
			}

			breadcrumb.$set(breadcrumb_changes);
			const row0_changes = {};

			if (dirty & /*$$scope*/ 2) {
				row0_changes.$$scope = { dirty, ctx };
			}

			row0.$set(row0_changes);
			const row1_changes = {};

			if (dirty & /*$$scope*/ 2) {
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
	let title = "Пагинация | UI | Пользовательский Интерфейс";

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {
		if ("title" in $$props) $$invalidate(0, title = $$props.title);
	};

	return [title];
}

class InputGroup extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InputGroup",
			options,
			id: create_fragment.name
		});
	}
}

export default InputGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRHcm91cC43ZjVhOGMxNy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy91aS9pbnB1dEdyb3VwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gICAgbGV0IHRpdGxlID0gXCLQn9Cw0LPQuNC90LDRhtC40Y8gfCBVSSB8INCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC5INCY0L3RgtC10YDRhNC10LnRgVwiO1xyXG4gICAgaW1wb3J0IEJyZWFkY3J1bWIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9CcmVhZGNydW1iLnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IEJyZWFkY3J1bWJJdGVtIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYkl0ZW0uc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgUm93IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgQ3VzdG9tSW5wdXQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgRm9ybSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Zvcm0uc3ZlbHRlXCI7XHJcbiAgICBpbXBvcnQgIEZvcm1Hcm91cCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Zvcm1Hcm91cC5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgRm9ybVRleHQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Gb3JtVGV4dC5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgSW5wdXQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dC5zdmVsdGVcIjtcclxuICAgIGltcG9ydCAgTGFiZWwgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9MYWJlbC5zdmVsdGVcIjtcclxuXHJcblxyXG5cclxuPC9zY3JpcHQ+XHJcblxyXG48c3ZlbHRlOmhlYWQ+XHJcbiAgICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcbjxoMSBjbGFzcz1cIm10LTRcIj7Qk9GA0YPQv9C/0Ysg0L/QvtC70LXQuTwvaDE+XHJcbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxyXG4gICAgPEJyZWFkY3J1bWJJdGVtIGFjdGl2ZT7Qk9GA0YPQv9C/0Ysg0L/QvtC70LXQuTwvQnJlYWRjcnVtYkl0ZW0+XHJcbjwvQnJlYWRjcnVtYj5cclxuPFJvdz5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wteGwtNlwiPlxyXG4gICAgICAgIDxoMiBjbGFzcz1cIm10LTRcIj7Qk9GA0YPQv9C/0Ysg0L/QvtC70LXQuTwvaDI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XHJcbiAgICAgICAgICAgIDxkaXYgYWRkb250eXBlPVwicHJlcGVuZFwiIGNsYXNzPVwiaW5wdXQtZ3JvdXAtcHJlcGVuZFwiPjxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPkA8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIlwiPjwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBhZGRvbnR5cGU9XCJwcmVwZW5kXCIgY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBhZGRvbj1cInRydWVcIiAgYXJpYS1sYWJlbD1cIkNoZWNrYm94IGZvciBmb2xsb3dpbmcgdGV4dCBpbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICBpZD1cIlwiXHJcbiAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgY2xhc3M9XCJcIiBuYW1lPVwiXCJcclxuICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiXCJcclxuICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwiQ2hlY2sgaXQgb3V0XCIgaWQ9XCJcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIlwiPjwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj48aW5wdXQgcGxhY2Vob2xkZXI9XCLRjtC30LXRgNC90LXQudC8XCIgaWQ9XCJcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIlwiPlxyXG4gICAgICAgICAgICA8ZGl2IGFkZG9udHlwZT1cImFwcGVuZFwiIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+QGV4YW1wbGUuY29tPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxicj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBhZGRvbnR5cGU9XCJwcmVwZW5kXCIgY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+JDwvc3Bhbj4gPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj4kPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJEb2xsYSBkb2xsYSBiaWxseiB5byFcIiBpZD1cIlwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwiXCI+XHJcbiAgICAgICAgICAgIDxkaXYgYWRkb250eXBlPVwiYXBwZW5kXCIgY2xhc3M9XCJpbnB1dC1ncm91cC1hcHBlbmRcIj48c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj4kPC9zcGFuPiA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPiQ8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGFkZG9udHlwZT1cInByZXBlbmRcIiBjbGFzcz1cImlucHV0LWdyb3VwLXByZXBlbmRcIj48c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj4kPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJBbW91bnRcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgc3RlcD1cIjFcIiBpZD1cIlwiIHR5cGU9XCJudW1iZXJcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJcIj5cclxuICAgICAgICAgICAgPGRpdiBhZGRvbnR5cGU9XCJhcHBlbmRcIiBjbGFzcz1cImlucHV0LWdyb3VwLWFwcGVuZFwiPjxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPi4wMDwvc3Bhbj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L1Jvdz5cclxuPFJvdz5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wteGwtNlwiPlxyXG4gICAgICAgIDxoMiBjbGFzcz1cIm10LTRcIj7QoNCw0LfQvNC10YDRizwvaDI+XHJcblxyXG4gICAgPGRpdj5cclxuICAgICAgICA8ZGl2IHNpemU9XCJsZ1wiIGNsYXNzPVwiaW5wdXQtZ3JvdXAgaW5wdXQtZ3JvdXAtbGdcIj5cclxuICAgICAgICAgICAgPGRpdiBhZGRvbnR5cGU9XCJwcmVwZW5kXCIgY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+QGxnPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIlwiIHBsYWNlaG9sZGVyPVwiXCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGFkZG9udHlwZT1cInByZXBlbmRcIiBjbGFzcz1cImlucHV0LWdyb3VwLXByZXBlbmRcIj48c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj5Abm9ybWFsPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIlwiIHBsYWNlaG9sZGVyPVwiXCI+PC9kaXY+XHJcbiAgICAgICAgPGJyPlxyXG4gICAgICAgIDxkaXYgc2l6ZT1cInNtXCIgY2xhc3M9XCJpbnB1dC1ncm91cCBpbnB1dC1ncm91cC1zbVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGFkZG9udHlwZT1cInByZXBlbmRcIiBjbGFzcz1cImlucHV0LWdyb3VwLXByZXBlbmRcIj48c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLXRleHRcIj5Ac208L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cIlwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwiXCIgcGxhY2Vob2xkZXI9XCJcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvUm93PlxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FDUSxLQUFLLEdBQUcsNkNBQTZDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
