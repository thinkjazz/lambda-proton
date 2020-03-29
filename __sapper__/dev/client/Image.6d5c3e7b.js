import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, f as element, g as claim_element, k as attr_dev, l as add_location, n as insert_dev, B as noop, j as detach_dev } from './client.c1505ed2.js';

/* src\components\Image.svelte generated by Svelte v3.18.1 */

const file = "src\\components\\Image.svelte";

function create_fragment(ctx) {
	let img;
	let img_class_value;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			this.h();
		},
		l: function claim(nodes) {
			img = claim_element(nodes, "IMG", { class: true, src: true, alt: true });
			this.h();
		},
		h: function hydrate() {
			attr_dev(img, "class", img_class_value = "img-fluid " + /*className*/ ctx[2]);
			if (img.src !== (img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", /*alt*/ ctx[1]);
			add_location(img, file, 8, 0, 137);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*className*/ 4 && img_class_value !== (img_class_value = "img-fluid " + /*className*/ ctx[2])) {
				attr_dev(img, "class", img_class_value);
			}

			if (dirty & /*src*/ 1 && img.src !== (img_src_value = /*src*/ ctx[0])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*alt*/ 2) {
				attr_dev(img, "alt", /*alt*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
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

function instance($$self, $$props, $$invalidate) {
	let { src = "logo-192.png" } = $$props;
	let { alt } = $$props;
	let { class: className = "" } = $$props;
	const writable_props = ["src", "alt", "class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Image> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("src" in $$props) $$invalidate(0, src = $$props.src);
		if ("alt" in $$props) $$invalidate(1, alt = $$props.alt);
		if ("class" in $$props) $$invalidate(2, className = $$props.class);
	};

	$$self.$capture_state = () => {
		return { src, alt, className };
	};

	$$self.$inject_state = $$props => {
		if ("src" in $$props) $$invalidate(0, src = $$props.src);
		if ("alt" in $$props) $$invalidate(1, alt = $$props.alt);
		if ("className" in $$props) $$invalidate(2, className = $$props.className);
	};

	return [src, alt, className];
}

class Image extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { src: 0, alt: 1, class: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Image",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*alt*/ ctx[1] === undefined && !("alt" in props)) {
			console.warn("<Image> was created without expected prop 'alt'");
		}
	}

	get src() {
		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set src(value) {
		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get alt() {
		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set alt(value) {
		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export { Image as I };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZ2UuNmQ1YzNlN2IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxyXG4gIGV4cG9ydCBsZXQgc3JjID0gXCJsb2dvLTE5Mi5wbmdcIjtcclxuICBleHBvcnQgbGV0IGFsdDtcclxuXHJcbiAgbGV0IGNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPGltZyBjbGFzcz1cImltZy1mbHVpZCB7Y2xhc3NOYW1lfVwiIHtzcmN9IHthbHR9IC8+XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUVBUXVCLEdBQVM7Ozs7Ozs7OztzR0FBVCxHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BUG5CLEdBQUcsR0FBRyxjQUFjO09BQ3BCLEdBQUc7Y0FFVixTQUFTLEdBQUcsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==