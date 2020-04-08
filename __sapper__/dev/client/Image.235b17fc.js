import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, f as element, g as claim_element, k as attr_dev, l as add_location, n as insert_dev, B as noop, j as detach_dev } from './client.0cef4fa2.js';

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
			add_location(img, file, 8, 0, 142);
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
	let { alt = "logo" } = $$props;
	let { class: className = "logo" } = $$props;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZ2UuMjM1YjE3ZmMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBleHBvcnQgbGV0IHNyYyA9IFwibG9nby0xOTIucG5nXCI7XG4gIGV4cG9ydCBsZXQgYWx0ID0gXCJsb2dvXCI7XG5cbiAgbGV0IGNsYXNzTmFtZSA9IFwibG9nb1wiO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbjwvc2NyaXB0PlxuXG48aW1nIGNsYXNzPVwiaW1nLWZsdWlkIHtjbGFzc05hbWV9XCIge3NyY30ge2FsdH0gLz5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUVBUXVCLEdBQVM7Ozs7Ozs7OztzR0FBVCxHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BUG5CLEdBQUcsR0FBRyxjQUFjO09BQ3BCLEdBQUcsR0FBRyxNQUFNO2NBRW5CLFNBQVMsR0FBRyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
