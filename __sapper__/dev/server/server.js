'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sirv = _interopDefault(require('sirv'));
var polka = _interopDefault(require('polka'));
var compression = _interopDefault(require('compression'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var Chart = _interopDefault(require('chart.js'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));

// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
	{
		title: 'What is Sapper?',
		slug: 'what-is-sapper',
		html: `
			<p>First, you have to know what <a href='https://svelte.dev'>Svelte</a> is. Svelte is a UI framework with a bold new idea: rather than providing a library that you write code with (like React or Vue, for example), it's a compiler that turns your components into highly optimized vanilla JavaScript. If you haven't already read the <a href='https://svelte.dev/blog/frameworks-without-the-framework'>introductory blog post</a>, you should!</p>

			<p>Sapper is a Next.js-style framework (<a href='blog/how-is-sapper-different-from-next'>more on that here</a>) built around Svelte. It makes it embarrassingly easy to create extremely high performance web apps. Out of the box, you get:</p>

			<ul>
				<li>Code-splitting, dynamic imports and hot module replacement, powered by webpack</li>
				<li>Server-side rendering (SSR) with client-side hydration</li>
				<li>Service worker for offline support, and all the PWA bells and whistles</li>
				<li>The nicest development experience you've ever had, or your money back</li>
			</ul>

			<p>It's implemented as Express middleware. Everything is set up and waiting for you to get started, but you keep complete control over the server, service worker, webpack config and everything else, so it's as flexible as you need it to be.</p>
		`
	},

	{
		title: 'How to use Sapper',
		slug: 'how-to-use-sapper',
		html: `
			<h2>Step one</h2>
			<p>Create a new project, using <a href='https://github.com/Rich-Harris/degit'>degit</a>:</p>

			<pre><code>npx degit "sveltejs/sapper-template#rollup" my-app
			cd my-app
			npm install # or yarn!
			npm run dev
			</code></pre>

			<h2>Step two</h2>
			<p>Go to <a href='http://localhost:3000'>localhost:3000</a>. Open <code>my-app</code> in your editor. Edit the files in the <code>src/routes</code> directory or add new ones.</p>

			<h2>Step three</h2>
			<p>...</p>

			<h2>Step four</h2>
			<p>Resist overdone joke formats.</p>
		`
	},

	{
		title: 'Why the name?',
		slug: 'why-the-name',
		html: `
			<p>In war, the soldiers who build bridges, repair roads, clear minefields and conduct demolitions — all under combat conditions — are known as <em>sappers</em>.</p>

			<p>For web developers, the stakes are generally lower than those for combat engineers. But we face our own hostile environment: underpowered devices, poor network connections, and the complexity inherent in front-end engineering. Sapper, which is short for <strong>S</strong>velte <strong>app</strong> mak<strong>er</strong>, is your courageous and dutiful ally.</p>
		`
	},

	{
		title: 'How is Sapper different from Next.js?',
		slug: 'how-is-sapper-different-from-next',
		html: `
			<p><a href='https://github.com/zeit/next.js'>Next.js</a> is a React framework from <a href='https://zeit.co'>Zeit</a>, and is the inspiration for Sapper. There are a few notable differences, however:</p>

			<ul>
				<li>It's powered by <a href='https://svelte.dev'>Svelte</a> instead of React, so it's faster and your apps are smaller</li>
				<li>Instead of route masking, we encode route parameters in filenames. For example, the page you're looking at right now is <code>src/routes/blog/[slug].html</code></li>
				<li>As well as pages (Svelte components, which render on server or client), you can create <em>server routes</em> in your <code>routes</code> directory. These are just <code>.js</code> files that export functions corresponding to HTTP methods, and receive Express <code>request</code> and <code>response</code> objects as arguments. This makes it very easy to, for example, add a JSON API such as the one <a href='blog/how-is-sapper-different-from-next.json'>powering this very page</a></li>
				<li>Links are just <code>&lt;a&gt;</code> elements, rather than framework-specific <code>&lt;Link&gt;</code> components. That means, for example, that <a href='blog/how-can-i-get-involved'>this link right here</a>, despite being inside a blob of HTML, works with the router as you'd expect.</li>
			</ul>
		`
	},

	{
		title: 'How can I get involved?',
		slug: 'how-can-i-get-involved',
		html: `
			<p>We're so glad you asked! Come on over to the <a href='https://github.com/sveltejs/svelte'>Svelte</a> and <a href='https://github.com/sveltejs/sapper'>Sapper</a> repos, and join us in the <a href='https://svelte.dev/chat'>Discord chatroom</a>. Everyone is welcome, especially you!</p>
		`
	}
];

posts.forEach(post => {
	post.html = post.html.replace(/^\t{3}/gm, '');
});

const contents = JSON.stringify(posts.map(post => {
	return {
		title: post.title,
		slug: post.slug
	};
}));

function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(contents);
}

var route_0 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get
});

const lookup = new Map();
posts.forEach(post => {
	lookup.set(post.slug, JSON.stringify(post));
});

function get$1(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;

	if (lookup.has(slug)) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(lookup.get(slug));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}

var route_1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get$1
});

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

function toVal(mix) {
	var k, y, str='';
	if (mix) {
		if (typeof mix === 'object') {
			if (Array.isArray(mix)) {
				for (k=0; k < mix.length; k++) {
					if (mix[k] && (y = toVal(mix[k]))) {
						str && (str += ' ');
						str += y;
					}
				}
			} else {
				for (k in mix) {
					if (mix[k] && (y = toVal(k))) {
						str && (str += ' ');
						str += y;
					}
				}
			}
		} else if (typeof mix !== 'boolean' && !mix.call) {
			str && (str += ' ');
			str += mix;
		}
	}
	return str;
}

function clsx () {
	var i=0, x, str='';
	while (i < arguments.length) {
		if (x = toVal(arguments[i++])) {
			str && (str += ' ');
			str += x;
		}
	}
	return str;
}

function isObject(value) {
  const type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  } else if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }

  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}

function clean($$props) {
  const rest = {};
  for (const key of Object.keys($$props)) {
    if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
      rest[key] = $$props[key];
    }
  }
  return rest;
}

/* node_modules\sveltestrap\src\Breadcrumb.svelte generated by Svelte v3.18.1 */

const Breadcrumb = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { ariaLabel = "breadcrumb" } = $$props;
	let { children = undefined } = $$props;
	let { listClassName = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0) $$bindings.ariaLabel(ariaLabel);
	if ($$props.children === void 0 && $$bindings.children && children !== void 0) $$bindings.children(children);
	if ($$props.listClassName === void 0 && $$bindings.listClassName && listClassName !== void 0) $$bindings.listClassName(listClassName);
	let listClasses = clsx("breadcrumb", listClassName);

	return `<nav${spread([props, { "aria-label": escape(ariaLabel) }, { class: escape(className) }])}>
  <ol${add_attribute("class", listClasses, 0)}>
    ${children
	? `${escape(children)}`
	: `${$$slots.default ? $$slots.default({}) : ``}`}
  </ol>
</nav>`;
});

/* node_modules\sveltestrap\src\BreadcrumbItem.svelte generated by Svelte v3.18.1 */

const BreadcrumbItem = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { active = false } = $$props;
	let { children = undefined } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
	if ($$props.children === void 0 && $$bindings.children && children !== void 0) $$bindings.children(children);
	let classes = clsx(className, active ? "active" : false, "breadcrumb-item");

	return `<li${spread([
		props,
		{ class: escape(classes) },
		{
			"aria-current": escape(active ? "page" : undefined)
		}
	])}>
  ${children
	? `${escape(children)}`
	: `${$$slots.default ? $$slots.default({}) : ``}`}
</li>`;
});

/* node_modules\sveltestrap\src\Card.svelte generated by Svelte v3.18.1 */

const Card = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { body = false } = $$props;
	let { color = "" } = $$props;
	let { id = "" } = $$props;
	let { inverse = false } = $$props;
	let { outline = false } = $$props;
	let { style = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.body === void 0 && $$bindings.body && body !== void 0) $$bindings.body(body);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0) $$bindings.inverse(inverse);
	if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0) $$bindings.outline(outline);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	let classes = clsx(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false);

	return `<div${spread([
		props,
		{ id: escape(id) },
		{ class: escape(classes) },
		{ style: escape(style) }
	])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\CardBody.svelte generated by Svelte v3.18.1 */

const CardBody = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { id = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	let classes = clsx(className, "card-body");

	return `<div${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\CardHeader.svelte generated by Svelte v3.18.1 */

const CardHeader = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { id = "" } = $$props;
	let { tag = "div" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0) $$bindings.tag(tag);
	let classes = clsx(className, "card-header");

	return `${tag === "h3"
	? `<h3${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </h3>`
	: `<div${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`}`;
});

/* node_modules\sveltestrap\src\CardText.svelte generated by Svelte v3.18.1 */

const CardText = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	let classes = clsx(className, "card-text");

	return `<p${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</p>`;
});

/* node_modules\sveltestrap\src\Row.svelte generated by Svelte v3.18.1 */

const Row = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { noGutters = false } = $$props;
	let { form = false } = $$props;
	let { id = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0) $$bindings.noGutters(noGutters);
	if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	let classes = clsx(className, noGutters ? "no-gutters" : null, form ? "form-row" : "row");

	return `<div${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\CardFooter.svelte generated by Svelte v3.18.1 */

const CardFooter = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	let classes = clsx(className, "card-footer");

	return `<div${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.18.1 */

const Table = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { size = "" } = $$props;
	let { bordered = false } = $$props;
	let { borderless = false } = $$props;
	let { striped = false } = $$props;
	let { dark = false } = $$props;
	let { hover = false } = $$props;
	let { responsive = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.bordered === void 0 && $$bindings.bordered && bordered !== void 0) $$bindings.bordered(bordered);
	if ($$props.borderless === void 0 && $$bindings.borderless && borderless !== void 0) $$bindings.borderless(borderless);
	if ($$props.striped === void 0 && $$bindings.striped && striped !== void 0) $$bindings.striped(striped);
	if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0) $$bindings.dark(dark);
	if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0) $$bindings.hover(hover);
	if ($$props.responsive === void 0 && $$bindings.responsive && responsive !== void 0) $$bindings.responsive(responsive);
	let classes = clsx(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false);

	let responsiveClassName = responsive === true
	? "table-responsive"
	: `table-responsive-${responsive}`;

	return `${responsive
	? `<div${add_attribute("class", responsiveClassName, 0)}>
    <table${spread([props, { class: escape(classes) }])}>
      ${$$slots.default ? $$slots.default({}) : ``}
    </table>
  </div>`
	: `<table${spread([props, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </table>`}`;
});

/* src\components\Image.svelte generated by Svelte v3.18.1 */

const Image = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { src = "logo-192.png" } = $$props;
	let { alt = "logo" } = $$props;
	let { class: className = "logo" } = $$props;
	if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
	if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0) $$bindings.alt(alt);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	return `<img class="${"img-fluid " + escape(className)}"${add_attribute("src", src, 0)}${add_attribute("alt", alt, 0)}>`;
});

/* src\components\DashboardCard.svelte generated by Svelte v3.18.1 */

const DashboardCard = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { cardTitle = "Хуйкин" } = $$props;
	let { cardColor } = $$props;
	let { cardFooterText = "Детали" } = $$props;
	if ($$props.cardTitle === void 0 && $$bindings.cardTitle && cardTitle !== void 0) $$bindings.cardTitle(cardTitle);
	if ($$props.cardColor === void 0 && $$bindings.cardColor && cardColor !== void 0) $$bindings.cardColor(cardColor);
	if ($$props.cardFooterText === void 0 && $$bindings.cardFooterText && cardFooterText !== void 0) $$bindings.cardFooterText(cardFooterText);

	return `${validate_component(Card, "Card").$$render(
		$$result,
		{
			inverse: true,
			color: cardColor,
			class: "mb-4"
		},
		{},
		{
			default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
    ${validate_component(CardText, "CardText").$$render($$result, {}, {}, { default: () => `${escape(cardTitle)}` })}
  `
			})}
  ${validate_component(CardFooter, "CardFooter").$$render(
				$$result,
				{
					class: "d-flex align-items-center justify-content-between"
				},
				{},
				{
					default: () => `
    <a class="${"small text-white stretched-link"}" href="${"charts"}">
      ${escape(cardFooterText)}
    </a>
    <div class="${"small text-white"}">
      <i class="${"fas fa-angle-right"}"></i>
    </div>
  `
				}
			)}
`
		}
	)}`;
});

/* src\components\CustomCard.svelte generated by Svelte v3.18.1 */

const CustomCard = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { cardTitle = "" } = $$props;
	let { cardIcon = "" } = $$props;
	if ($$props.cardTitle === void 0 && $$bindings.cardTitle && cardTitle !== void 0) $$bindings.cardTitle(cardTitle);
	if ($$props.cardIcon === void 0 && $$bindings.cardIcon && cardIcon !== void 0) $$bindings.cardIcon(cardIcon);

	return `${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
			default: () => `
    <i${add_attribute("class", cardIcon, 0)}></i>
    ${escape(cardTitle)}
  `
		})}
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    ${$$slots.default ? $$slots.default({}) : ``}
    ${$$slots.chartCaption ? $$slots.chartCaption({}) : ``}
  `
		})}
`
	})}`;
});

/* src\components\Table.svelte generated by Svelte v3.18.1 */

const Table_1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const tableHeading = ["#", "First Name", "Last-Name", "Username"];

	const tableData = [
		{
			SNo: "1",
			firstName: "PipBoy",
			lastName: "3000",
			userName: "@mdo"
		},
		{
			SNo: "2",
			firstName: "Gordon",
			lastName: "Freeman",
			userName: "@fat"
		},
		{
			SNo: "3",
			firstName: "Goul",
			lastName: "Гладкокожий",
			userName: "@twitter"
		}
	];

	return `${validate_component(Table, "Table").$$render($$result, { bordered: true, responsive: true }, {}, {
		default: () => `
  <thead>
    <tr>
      ${each(tableHeading, heading => `<th>${escape(heading)}</th>`)}
    </tr>
  </thead>
  <tbody>

    ${each(tableData, data => `<tr>
        <th scope="${"row"}">${escape(data.SNo)}</th>
        <td>${escape(data.firstName)}</td>
        <td>${escape(data.lastName)}</td>
        <td>${escape(data.userName)}</td>
      </tr>`)}
  </tbody>
`
	})}`;
});

/* src\components\Charts\AreaChart.svelte generated by Svelte v3.18.1 */

const AreaChart = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const chartData = {
		labels: [
			"Январь",
			"Февраль",
			"Март",
			"Апрель",
			"Май",
			"Июнь",
			"Июль",
			"Август",
			"Сентябрь"
		],
		datasets: [
			{
				label: "# голосов",
				data: [15, 10, 17, 6, 11, 9, 12, 16, 11],
				borderWidth: 2,
				borderColor: "rgb(3,117,220)",
				backgroundColor: "rgba(3,117,220,0.2)"
			}
		]
	};

	const chartOptions = {
		scales: {
			yAxes: [{ ticks: { beginAtZero: true } }]
		}
	};

	function createChart() {
		var ctx = document.getElementById("areaChart");

		var myChart = new Chart(ctx,
		{
				type: "line",
				data: chartData,
				options: chartOptions
			});
	}

	onMount(createChart);
	return `<canvas id="${"areaChart"}"></canvas>`;
});

/* src\components\Charts\BarChart.svelte generated by Svelte v3.18.1 */

const BarChart = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const chartData = {
		labels: ["January", "February", "March", "April", "May", "June"],
		datasets: [
			{
				label: "# of Votes",
				data: [4, 6, 10, 12, 15, 19],
				backgroundColor: "rgba(3,117,220)"
			}
		]
	};

	const chartOptions = {
		scales: {
			yAxes: [{ ticks: { beginAtZero: true } }]
		}
	};

	function createChart() {
		var ctx = document.getElementById("barChart");

		var myChart = new Chart(ctx,
		{
				type: "bar",
				data: chartData,
				options: chartOptions
			});
	}

	onMount(createChart);
	return `<canvas id="${"barChart"}"></canvas>`;
});

/* src\routes\index.svelte generated by Svelte v3.18.1 */

const Routes = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let title = "λproton";

	return `${($$result.head += `${($$result.title = `<title>${escape(title)}</title>`, "")}`, "")}
<h1 class="${"mt-4"}">Панель</h1>
${validate_component(Breadcrumb, "Breadcrumb").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, { active: true }, {}, { default: () => `Панель` })}
`
	})}
${validate_component(Row, "Row").$$render($$result, {}, {}, {
		default: () => `
  <div class="${"col-xl-3 col-md-6"}">
    ${validate_component(DashboardCard, "DashboardCard").$$render(
			$$result,
			{
				cardTitle: "Синяя плашка",
				cardColor: "primary"
			},
			{},
			{}
		)}
  </div>
  <div class="${"col-xl-3 col-md-6"}">
    ${validate_component(DashboardCard, "DashboardCard").$$render(
			$$result,
			{
				cardTitle: "Оранжевая плашка",
				cardColor: "warning"
			},
			{},
			{}
		)}
  </div>
  <div class="${"col-xl-3 col-md-6"}">
    ${validate_component(DashboardCard, "DashboardCard").$$render(
			$$result,
			{
				cardTitle: "Зеленая плашка",
				cardColor: "success"
			},
			{},
			{}
		)}
  </div>
  <div class="${"col-xl-3 col-md-6"}">
    ${validate_component(DashboardCard, "DashboardCard").$$render(
			$$result,
			{
				cardTitle: "Опасная плашка",
				cardColor: "danger"
			},
			{},
			{}
		)}
  </div>
`
	})}
${validate_component(Row, "Row").$$render($$result, {}, {}, {
		default: () => `
  <div class="${"col-xl-6"}">
    ${validate_component(CustomCard, "CustomCard").$$render(
			$$result,
			{
				cardTitle: "Пример диаграммы",
				cardIcon: "fas fa-chart-area"
			},
			{},
			{
				default: () => `
      ${validate_component(AreaChart, "AreaChart").$$render($$result, {}, {}, {})}
    `
			}
		)}
  </div>
  <div class="${"col-xl-6"}">
    ${validate_component(CustomCard, "CustomCard").$$render(
			$$result,
			{
				cardTitle: "Пример гистограммы",
				cardIcon: "fas fa-chart-bar"
			},
			{},
			{
				default: () => `
      ${validate_component(BarChart, "BarChart").$$render($$result, {}, {}, {})}
    `
			}
		)}
  </div>
`
	})}
${validate_component(CustomCard, "CustomCard").$$render(
		$$result,
		{
			cardTitle: "Пример DataTable",
			cardIcon: "fas fa-table"
		},
		{},
		{
			default: () => `
  ${validate_component(Table_1, "Table").$$render($$result, {}, {}, {})}
`
		}
	)}`;
});

/* src\routes\activity_log.svelte generated by Svelte v3.18.1 */

const Activity_log = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"col-lg-12 mx-auto my-3"}">
  ${validate_component(Card, "Card").$$render(
		$$result,
		{
			class: "shadow-lg border-0 rounded-lg mt-5"
		},
		{},
		{
			default: () => `
    ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
      <h3 class="${"text-center font-weight-light my-3"}">Activity Log</h3>
    `
			})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
      ${validate_component(AreaChart, "AreaChart").$$render($$result, {}, {}, {})}
      <p class="${"my-3 text-center"}">Your Activity Chart</p>
    `
			})}
  `
		}
	)}
</div>`;
});

/* node_modules\sveltestrap\src\Form.svelte generated by Svelte v3.18.1 */

const Form = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { inline = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0) $$bindings.inline(inline);
	let classes = clsx(className, inline ? "form-inline" : false);

	return `<form${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</form>`;
});

/* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.18.1 */

const FormGroup = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { row = false } = $$props;
	let { check = false } = $$props;
	let { inline = false } = $$props;
	let { disabled = false } = $$props;
	let { id = "" } = $$props;
	let { tag = null } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.row === void 0 && $$bindings.row && row !== void 0) $$bindings.row(row);
	if ($$props.check === void 0 && $$bindings.check && check !== void 0) $$bindings.check(check);
	if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0) $$bindings.inline(inline);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0) $$bindings.tag(tag);
	let classes = clsx(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false);

	return `${tag === "fieldset"
	? `<fieldset${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </fieldset>`
	: `<div${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`}`;
});

/* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.18.1 */

const Label = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	const props = clean($$props);
	let { hidden = false } = $$props;
	let { check = false } = $$props;
	let { size = "" } = $$props;
	let { for: fore } = $$props;
	let { id = "" } = $$props;
	let { xs = "" } = $$props;
	let { sm = "" } = $$props;
	let { md = "" } = $$props;
	let { lg = "" } = $$props;
	let { xl = "" } = $$props;
	const colWidths = { xs, sm, md, lg, xl };
	let { widths = Object.keys(colWidths) } = $$props;
	const colClasses = [];

	widths.forEach(colWidth => {
		let columnProp = $$props[colWidth];

		if (!columnProp && columnProp !== "") {
			return;
		}

		const isXs = colWidth === "xs";
		let colClass;

		if (isObject(columnProp)) {
			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

			colClasses.push(clsx({
				[colClass]: columnProp.size || columnProp.size === "",
				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
			}));
		} else {
			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
			colClasses.push(colClass);
		}
	});

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0) $$bindings.hidden(hidden);
	if ($$props.check === void 0 && $$bindings.check && check !== void 0) $$bindings.check(check);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.for === void 0 && $$bindings.for && fore !== void 0) $$bindings.for(fore);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0) $$bindings.xs(xs);
	if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0) $$bindings.sm(sm);
	if ($$props.md === void 0 && $$bindings.md && md !== void 0) $$bindings.md(md);
	if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0) $$bindings.lg(lg);
	if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0) $$bindings.xl(xl);
	if ($$props.widths === void 0 && $$bindings.widths && widths !== void 0) $$bindings.widths(widths);
	let classes = clsx(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false);

	return `<label${spread([props, { id: escape(id) }, { class: escape(classes) }, { for: escape(fore) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</label>`;
});

/* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.18.1 */

const Input = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { type = "text" } = $$props;
	let { size = undefined } = $$props;
	let { bsSize = undefined } = $$props;
	let { checked = false } = $$props;
	let { valid = false } = $$props;
	let { invalid = false } = $$props;
	let { plaintext = false } = $$props;
	let { addon = false } = $$props;
	let { value = "" } = $$props;
	let { files = "" } = $$props;
	let { readonly } = $$props;
	let { multiple = false } = $$props;
	let { id = "" } = $$props;
	let { name = "" } = $$props;
	let { placeholder = "" } = $$props;
	let { disabled = false } = $$props;

	// eslint-disable-next-line no-unused-vars
	const { type: _omitType, ...props } = clean($$props);

	let classes;
	let tag;
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.bsSize === void 0 && $$bindings.bsSize && bsSize !== void 0) $$bindings.bsSize(bsSize);
	if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0) $$bindings.checked(checked);
	if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0) $$bindings.valid(valid);
	if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0) $$bindings.invalid(invalid);
	if ($$props.plaintext === void 0 && $$bindings.plaintext && plaintext !== void 0) $$bindings.plaintext(plaintext);
	if ($$props.addon === void 0 && $$bindings.addon && addon !== void 0) $$bindings.addon(addon);
	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.files === void 0 && $$bindings.files && files !== void 0) $$bindings.files(files);
	if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0) $$bindings.readonly(readonly);
	if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0) $$bindings.multiple(multiple);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);

	 {
		{
			const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
			const isNotaNumber = new RegExp("\\D", "g");
			const fileInput = type === "file";
			const textareaInput = type === "textarea";
			const selectInput = type === "select";
			tag = selectInput || textareaInput ? type : "input";
			let formControlClass = "form-control";

			if (plaintext) {
				formControlClass = `${formControlClass}-plaintext`;
				tag = "input";
			} else if (fileInput) {
				formControlClass = `${formControlClass}-file`;
			} else if (checkInput) {
				if (addon) {
					formControlClass = null;
				} else {
					formControlClass = "form-check-input";
				}
			}

			if (size && isNotaNumber.test(size)) {
				console.warn("Please use the prop \"bsSize\" instead of the \"size\" to bootstrap's input sizing.");
				bsSize = size;
				size = undefined;
			}

			classes = clsx(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass);
		}
	}

	return `${tag === "input"
	? `${type === "text"
		? `<input${spread([
				props,
				{ id: escape(id) },
				{ type: "text" },
				{ readonly: readonly || null },
				{ class: escape(classes) },
				{ name: escape(name) },
				{ disabled: disabled || null },
				{ placeholder: escape(placeholder) }
			])}${add_attribute("value", value, 1)}>`
		: `${type === "password"
			? `<input${spread([
					props,
					{ id: escape(id) },
					{ type: "password" },
					{ readonly: readonly || null },
					{ class: escape(classes) },
					{ name: escape(name) },
					{ disabled: disabled || null },
					{ placeholder: escape(placeholder) }
				])}${add_attribute("value", value, 1)}>`
			: `${type === "email"
				? `<input${spread([
						props,
						{ id: escape(id) },
						{ type: "email" },
						{ readonly: readonly || null },
						{ class: escape(classes) },
						{ name: escape(name) },
						{ disabled: disabled || null },
						{ placeholder: escape(placeholder) }
					])}${add_attribute("value", value, 1)}>`
				: `${type === "file"
					? `<input${spread([
							props,
							{ id: escape(id) },
							{ type: "file" },
							{ readonly: readonly || null },
							{ class: escape(classes) },
							{ name: escape(name) },
							{ disabled: disabled || null },
							{ placeholder: escape(placeholder) }
						])}>`
					: `${type === "checkbox"
						? `<input${spread([
								props,
								{ id: escape(id) },
								{ type: "checkbox" },
								{ readonly: readonly || null },
								{ class: escape(classes) },
								{ name: escape(name) },
								{ disabled: disabled || null },
								{ placeholder: escape(placeholder) }
							])}${add_attribute("checked", checked, 1)}${add_attribute("value", value, 1)}>`
						: `${type === "radio"
							? `<input${spread([
									props,
									{ id: escape(id) },
									{ type: "radio" },
									{ readonly: readonly || null },
									{ class: escape(classes) },
									{ name: escape(name) },
									{ disabled: disabled || null },
									{ placeholder: escape(placeholder) }
								])}${add_attribute("value", value, 1)}>`
							: `${type === "url"
								? `<input${spread([
										props,
										{ id: escape(id) },
										{ type: "url" },
										{ readonly: readonly || null },
										{ class: escape(classes) },
										{ name: escape(name) },
										{ disabled: disabled || null },
										{ placeholder: escape(placeholder) }
									])}${add_attribute("value", value, 1)}>`
								: `${type === "number"
									? `<input${spread([
											props,
											{ id: escape(id) },
											{ type: "number" },
											{ readonly: readonly || null },
											{ class: escape(classes) },
											{ name: escape(name) },
											{ disabled: disabled || null },
											{ placeholder: escape(placeholder) }
										])}${add_attribute("value", value, 1)}>`
									: `${type === "date"
										? `<input${spread([
												props,
												{ id: escape(id) },
												{ type: "date" },
												{ readonly: readonly || null },
												{ class: escape(classes) },
												{ name: escape(name) },
												{ disabled: disabled || null },
												{ placeholder: escape(placeholder) }
											])}${add_attribute("value", value, 1)}>`
										: `${type === "time"
											? `<input${spread([
													props,
													{ id: escape(id) },
													{ type: "time" },
													{ readonly: readonly || null },
													{ class: escape(classes) },
													{ name: escape(name) },
													{ disabled: disabled || null },
													{ placeholder: escape(placeholder) }
												])}${add_attribute("value", value, 1)}>`
											: `${type === "datetime"
												? `<input${spread([
														props,
														{ id: escape(id) },
														{ type: "datetime" },
														{ readonly: readonly || null },
														{ class: escape(classes) },
														{ name: escape(name) },
														{ disabled: disabled || null },
														{ placeholder: escape(placeholder) }
													])}${add_attribute("value", value, 1)}>`
												: `${type === "color"
													? `<input${spread([
															props,
															{ id: escape(id) },
															{ type: "color" },
															{ readonly: readonly || null },
															{ class: escape(classes) },
															{ name: escape(name) },
															{ disabled: disabled || null },
															{ placeholder: escape(placeholder) }
														])}${add_attribute("value", value, 1)}>`
													: `${type === "search"
														? `<input${spread([
																props,
																{ id: escape(id) },
																{ type: "search" },
																{ readonly: readonly || null },
																{ class: escape(classes) },
																{ name: escape(name) },
																{ disabled: disabled || null },
																{ placeholder: escape(placeholder) }
															])}${add_attribute("value", value, 1)}>`
														: ``}`}`}`}`}`}`}`}`}`}`}`}`}`
	: `${tag === "textarea"
		? `<textarea${spread([
				props,
				{ id: escape(id) },
				{ class: escape(classes) },
				{ name: escape(name) },
				{ disabled: disabled || null }
			])}>${value || ""}</textarea>`
		: `${tag === "select"
			? `<select${spread([
					props,
					{ id: escape(id) },
					{ multiple: multiple || null },
					{ class: escape(classes) },
					{ name: escape(name) },
					{ disabled: disabled || null }
				])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </select>`
			: ``}`}`}`;
});

/* node_modules\sveltestrap\src\CustomInput.svelte generated by Svelte v3.18.1 */

const CustomInput = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { name = "" } = $$props;
	let { id = "" } = $$props;
	let { type } = $$props;
	let { label = "" } = $$props;
	let { checked = false } = $$props;
	let { disabled = false } = $$props;
	let { inline = false } = $$props;
	let { valid = false } = $$props;
	let { value = "" } = $$props;
	let { invalid = false } = $$props;
	let { bsSize = "" } = $$props;
	let { placeholder = "" } = $$props;
	let { for: htmlFor = "" } = $$props;

	// eslint-disable-next-line no-unused-vars
	const { type: _omitType, ...props } = clean($$props);

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
	if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
	if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0) $$bindings.checked(checked);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0) $$bindings.inline(inline);
	if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0) $$bindings.valid(valid);
	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0) $$bindings.invalid(invalid);
	if ($$props.bsSize === void 0 && $$bindings.bsSize && bsSize !== void 0) $$bindings.bsSize(bsSize);
	if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
	if ($$props.for === void 0 && $$bindings.for && htmlFor !== void 0) $$bindings.for(htmlFor);
	let customClass = clsx(className, `custom-${type}`, bsSize ? `custom-${type}-${bsSize}` : false);
	let validationClassNames = clsx(invalid && "is-invalid", valid && "is-valid");
	let combinedClasses = clsx(customClass, validationClassNames);
	let fileClasses = clsx(validationClassNames, "custom-file-input");
	let wrapperClasses = clsx(customClass, "custom-control", { "custom-control-inline": inline });
	let customControlClasses = clsx(validationClassNames, "custom-control-input");
	let labelHtmlFor = htmlFor || id;

	return `${type === "select"
	? `<select${spread([
			{ id: escape(id) },
			{ class: escape(combinedClasses) },
			{ name: escape(name) },
			{ disabled: disabled || null },
			{ placeholder: escape(placeholder) },
			props
		])}${add_attribute("value", value, 1)}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </select>`
	: `${type === "file"
		? `<div${add_attribute("class", customClass, 0)}>
    <input${spread([
				{ id: escape(id) },
				{ type: "file" },
				{ class: escape(fileClasses) },
				{ name: escape(name) },
				{ disabled: disabled || null },
				{ placeholder: escape(placeholder) },
				props
			])}>
    <label class="${"custom-file-label"}"${add_attribute("for", labelHtmlFor, 0)}>
      ${escape(label || "Choose file")}
    </label>
  </div>`
		: `${type === "switch" || type === "checkbox"
			? `<div${add_attribute("class", wrapperClasses, 0)}>
    <input${spread([
					{ id: escape(id) },
					{ type: "checkbox" },
					{ class: escape(customControlClasses) },
					{ name: escape(name) },
					{ disabled: disabled || null },
					{ placeholder: escape(placeholder) },
					props
				])}${add_attribute("checked", checked, 1)}>
    <label class="${"custom-control-label"}"${add_attribute("for", labelHtmlFor, 0)}>${escape(label)}</label>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`
			: `${type === "radio"
				? `<div${add_attribute("class", wrapperClasses, 0)}>
    <input${spread([
						{ id: escape(id) },
						{ type: "radio" },
						{ class: escape(customControlClasses) },
						{ name: escape(name) },
						{ disabled: disabled || null },
						{ placeholder: escape(placeholder) },
						props
					])}>
    <label class="${"custom-control-label"}"${add_attribute("for", labelHtmlFor, 0)}>${escape(label)}</label>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`
				: `<input${spread([
						{ type: escape(type) },
						{ id: escape(id) },
						{ class: escape(combinedClasses) },
						{ name: escape(name) },
						{ disabled: disabled || null },
						{ placeholder: escape(placeholder) },
						props
					])}>`}`}`}`}`;
});

/* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.18.1 */

const Button = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { active = false } = $$props;
	let { block = false } = $$props;
	let { children = undefined } = $$props;
	let { close = false } = $$props;
	let { color = "secondary" } = $$props;
	let { disabled = false } = $$props;
	let { href = "" } = $$props;
	let { id = "" } = $$props;
	let { outline = false } = $$props;
	let { size = "" } = $$props;
	let { style = "" } = $$props;
	let { value = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
	if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block);
	if ($$props.children === void 0 && $$bindings.children && children !== void 0) $$bindings.children(children);
	if ($$props.close === void 0 && $$bindings.close && close !== void 0) $$bindings.close(close);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0) $$bindings.outline(outline);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	let ariaLabel = $$props["aria-label"];
	let classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active });
	let defaultAriaLabel = close ? "Close" : null;

	return `${href
	? `<a${spread([
			props,
			{ id: escape(id) },
			{ class: escape(classes) },
			{ disabled: disabled || null },
			{ href: escape(href) },
			{
				"aria-label": escape(ariaLabel || defaultAriaLabel)
			},
			{ style: escape(style) }
		])}>
    ${children
		? `${escape(children)}`
		: `${$$slots.default ? $$slots.default({}) : ``}`}
  </a>`
	: `<button${spread([
			props,
			{ id: escape(id) },
			{ class: escape(classes) },
			{ disabled: disabled || null },
			{ value: escape(value) },
			{
				"aria-label": escape(ariaLabel || defaultAriaLabel)
			},
			{ style: escape(style) }
		])}>
    ${$$slots.default
		? $$slots.default({})
		: `
      ${close
			? `<span aria-hidden="${"true"}">×</span>`
			: `${children
				? `${escape(children)}`
				: `${$$slots.default ? $$slots.default({}) : ``}`}`}
    `}
  </button>`}`;
});

/* src\routes\settings.svelte generated by Svelte v3.18.1 */

const Settings = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"col-lg-8 mx-auto my-5"}">
  ${validate_component(Card, "Card").$$render(
		$$result,
		{
			class: "shadow-lg border-0 rounded-lg mt-5"
		},
		{},
		{
			default: () => `
    ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
      <h3 class="${"text-center font-weight-light my-4"}">Настройки</h3>
    `
			})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
      ${validate_component(Form, "Form").$$render($$result, {}, {}, {
					default: () => `
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render($$result, { for: "name", class: "small mb-1" }, {}, { default: () => `Имя` })}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "text",
								name: "first_name",
								placeholder: "Введите имя"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render($$result, { for: "name", class: "small mb-1" }, {}, { default: () => `Фамилия` })}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "text",
								name: "last_name",
								placeholder: "Введите фамилию"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render($$result, { for: "exampleEmail", class: "small mb-1" }, {}, { default: () => `Email` })}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "email",
								name: "email",
								id: "exampleEmail",
								placeholder: "Введите адрес электронной почты"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render(
							$$result,
							{
								for: "examplePassword",
								class: "small mb-1"
							},
							{},
							{ default: () => `Пароль` }
						)}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "password",
								name: "password",
								id: "examplePassword",
								placeholder: "Введите пароль"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(CustomInput, "CustomInput").$$render(
							$$result,
							{
								type: "checkbox",
								id: "exampleCustomCheckbox",
								label: "Запомнить пароль"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render(
						$$result,
						{
							class: "d-flex align-items-center justify-content-between mt-4 mb-0"
						},
						{},
						{
							default: () => `
          ${validate_component(Button, "Button").$$render($$result, { block: true, color: "danger", href: "." }, {}, { default: () => `Сохранить` })}
        `
						}
					)}
      `
				})}
    `
			})}
  `
		}
	)}
</div>`;
});

/* src\routes\layouts\static_navigation.svelte generated by Svelte v3.18.1 */

const Static_navigation = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1 class="${"mt-4"}">Статическая навигация</h1>
${validate_component(Breadcrumb, "Breadcrumb").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, {}, {}, {
			default: () => `
    <a href="${"."}">Панель</a>
  `
		})}
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, { active: true }, {}, { default: () => `Статическая навигация` })}
`
	})}

${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    <p class="${"mb-0"}">
      Эта страница является примером использования статической навигации. Удаляя     
      <code>.l-proton-nav-fixed</code>
       класс из
      <code>body</code>
      верхняя навигация и боковая навигация станут статичными при прокрутке.
      Прокрутите эту страницу вниз, чтобы увидеть пример.
    </p>
  `
		})}
`
	})}
<div style="${"height: 100vh;"}"></div>
${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    При прокрутке навигация остается в верхней части страницы. Это конец
    статической навигационной демонстрации
  `
		})}
`
	})}`;
});

/* src\routes\layouts\light_sidenav.svelte generated by Svelte v3.18.1 */

const Light_sidenav = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1 class="${"mt-4"}">Светлая тема</h1>

${validate_component(Breadcrumb, "Breadcrumb").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, {}, {}, {
			default: () => `
    <a href="${"."}">Панель</a>
  `
		})}
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, { active: true }, {}, { default: () => `Светлая тема` })}
`
	})}

${validate_component(Card, "Card").$$render($$result, {}, {}, {
		default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    Эта страница является примером использования опции боковой навигации со сменой темы. По адресу
    присоединяющий
    <code>.l-proton-sidenav-light</code>
    класс к
    <code>.l-proton-sidenav</code>
    классу и боковая навигация будет иметь светлую цветовую схему. 
     <code>.l-proton-sidenav-dark</code>
    также доступен вариант с более темным цветом.  `
		})}
`
	})}`;
});

/* src\components\Charts\PieChart.svelte generated by Svelte v3.18.1 */

const PieChart = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const chartData = {
		labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
		datasets: [
			{
				label: "# of Votes",
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)"
				],
				borderColor: "white",
				borderWidth: 1
			}
		]
	};

	const chartOptions = {
		scales: {
			yAxes: [{ ticks: { beginAtZero: true } }]
		}
	};

	function createChart() {
		var ctx = document.getElementById("pieChart");

		var myChart = new Chart(ctx,
		{
				type: "pie",
				data: chartData,
				options: chartOptions
			});
	}

	onMount(createChart);
	return `<canvas id="${"pieChart"}"></canvas>`;
});

/* src\routes\charts.svelte generated by Svelte v3.18.1 */

const Charts = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let cardFooterText = "Обновлено вчера в 23:59";
	let areaCardTitle = "Пример диаграммы региона";
	let barCardTitle = "Пример гистограммы";
	let pieCardTitle = "Пример круговой диаграммы";

	return `<h1 class="${"mt-4"}">Диаграммы</h1>
${validate_component(Breadcrumb, "Breadcrumb").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, {}, {}, {
			default: () => `
    <a href="${"."}">Панель</a>
  `
		})}
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, { active: true }, {}, { default: () => `Диаграммы` })}
`
	})}

${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    Chart.js является сторонним плагином, который используется для генерации графиков в этом
    шаблон. Приведенные ниже графики были настроены - для дальнейшей настройки.
    варианты, пожалуйста, посетите официальный
    <a target="${"_blank"}" href="${"https://www.chartjs.org/docs/latest/"}">
      Chart.js документация
    </a>
    .
  `
		})}
`
	})}

${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
			default: () => `
    <i class="${"fas fa-chart-area"}"></i>
    ${escape(areaCardTitle)}
  `
		})}
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    ${validate_component(AreaChart, "AreaChart").$$render($$result, {}, {}, {})}
  `
		})}
  ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "small text-muted" }, {}, {
			default: () => `${escape(cardFooterText)}`
		})}
`
	})}

${validate_component(Row, "Row").$$render($$result, {}, {}, {
		default: () => `
  <div class="${"col-lg-6"}">
    ${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
			default: () => `
      ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
        <i class="${"fas fa-chart-bar"}"></i>
        ${escape(barCardTitle)}
      `
			})}
      ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
        ${validate_component(BarChart, "BarChart").$$render($$result, {}, {}, {})}
      `
			})}
      ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "small text-muted" }, {}, {
				default: () => `${escape(cardFooterText)}`
			})}
    `
		})}
  </div>
  <div class="${"col-lg-6"}">
    ${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
			default: () => `
      ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
        <i class="${"fas fa-chart-pie"}"></i>
        ${escape(pieCardTitle)}
      `
			})}
      ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
        ${validate_component(PieChart, "PieChart").$$render($$result, {}, {}, {})}
      `
			})}
      ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "small text-muted" }, {}, {
				default: () => `${escape(cardFooterText)}`
			})}
    `
		})}
  </div>
`
	})}`;
});

/* src\routes\tables.svelte generated by Svelte v3.18.1 */

const Tables = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1 class="${"mt-4"}">Таблицы</h1>
${validate_component(Breadcrumb, "Breadcrumb").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, {}, {}, {
			default: () => `
    <a href="${"."}">Панель</a>
  `
		})}
  ${validate_component(BreadcrumbItem, "BreadcrumbItem").$$render($$result, { active: true }, {}, { default: () => `Таблицы` })}
`
	})}

${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    DataTables является сторонним плагином, который используется для генерации демонстрационной таблицы.
    Внизу. Для получения более подробной информации о Таблицах Данных, пожалуйста, посетите веб-сайт
    <a target="${"_blank"}" href="${"https://datatables.net/"}">
      официальная документация DataTables
    </a>
    .
  `
		})}
`
	})}

${validate_component(Card, "Card").$$render($$result, { class: "mb-4" }, {}, {
		default: () => `
  ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
			default: () => `
    <svg class="${"svg-inline--fa fa-table fa-w-16"}" aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"table"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}" data-fa-i2svg="${""}">
      <path fill="${"currentColor"}" d="${"M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51\r\n        0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224\r\n        416H64v-96h160v96zm0-160H64v-96h160v96zm224\r\n        160H288v-96h160v96zm0-160H288v-96h160v96z"}"></path>
    </svg>
    Пример DataTable
  `
		})}
  ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
			default: () => `
    ${validate_component(Table_1, "Table").$$render($$result, {}, {}, {})}
  `
		})}
`
	})}`;
});

/* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.18.1 */

const Container = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { fluid = false } = $$props;
	let { id = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0) $$bindings.fluid(fluid);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	let classes = clsx(className, fluid ? "container-fluid" : "container");

	return `<div${spread([props, { id: escape(id) }, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* src\components\Footer.svelte generated by Svelte v3.18.1 */

const Footer = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<footer class="${"py-4 bg-dark mt-auto"}">
  ${validate_component(Container, "Container").$$render($$result, { fluid: true }, {}, {
		default: () => `
    <div class="${"d-flex align-items-center justify-content-between small"}">
      <div class="${"text-muted"}">
        Создано при помощи Г.Э.C.К
        <a href="${"https://github.com/thinkjazz"}">thinkjazz</a>
      </div>
      <div>
        <a href="${"/"}">Privacy Policy</a>
        ·
        <a href="${"/"}">Terms &amp; Conditions</a>
      </div>
    </div>
  `
	})}
</footer>`;
});

/* src\routes\pages\_layout.svelte generated by Svelte v3.18.1 */

const Layout = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${segment === "authentication"
	? `<div id="${"layoutAuthentication"}" class="${"l-proton-dark-bg "}">
        <div id="${"layoutAuthentication_content"}">
            <main>
                ${validate_component(Container, "Container").$$render($$result, {}, {}, {
			default: () => `
                    ${validate_component(Row, "Row").$$render($$result, { class: "justify-content-center" }, {}, {
				default: () => `
                        ${$$slots.default ? $$slots.default({}) : ``}
                    `
			})}
                `
		})}
            </main>
        </div>
        ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
    </div>`
	: `<div id="${"layoutError"}">
        <div id="${"layoutError_content"}">
            <main>
                ${validate_component(Container, "Container").$$render($$result, {}, {}, {
			default: () => `
                    <div class="${"row justify-content-center"}">
                        <div class="${"col-lg-6"}">
                            <div class="${"text-center mt-4"}">
                                ${$$slots.default ? $$slots.default({}) : ``}
                            </div>
                        </div>
                    </div>
                `
		})}
            </main>
        </div>
        ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
    </div>`}`;
});

/* src\routes\pages\authentication\login.svelte generated by Svelte v3.18.1 */

const Login = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"col-lg-5"}">
  ${validate_component(Card, "Card").$$render(
		$$result,
		{
			class: "shadow-lg border-0 rounded-lg mt-5"
		},
		{},
		{
			default: () => `
    ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
      <h3 class="${"text-center font-weight-light my-4"}">Логин</h3>
    `
			})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
      ${validate_component(Form, "Form").$$render($$result, {}, {}, {
					default: () => `
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render($$result, { for: "exampleEmail", class: "small mb-1" }, {}, { default: () => `Email` })}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "email",
								name: "email",
								id: "exampleEmail",
								placeholder: "Введите адрес электронной почты"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render(
							$$result,
							{
								for: "examplePassword",
								class: "small mb-1"
							},
							{},
							{ default: () => `Пароль` }
						)}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "password",
								name: "password",
								id: "examplePassword",
								placeholder: "Введите пароль"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(CustomInput, "CustomInput").$$render(
							$$result,
							{
								type: "checkbox",
								id: "exampleCustomCheckbox",
								label: "Запомнить пароль"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render(
						$$result,
						{
							class: "d-flex align-items-center justify-content-between mt-4 mb-0"
						},
						{},
						{
							default: () => `
          <a class="${"small"}" href="${"pages/authentication/forget_password"}">
            Забыли пароль?
          </a>
          ${validate_component(Button, "Button").$$render($$result, { color: "primary", href: "." }, {}, { default: () => `Вход` })}
        `
						}
					)}
      `
				})}
    `
			})}
    ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "text-center small" }, {}, {
				default: () => `
      <a href="${"pages/authentication/register"}">Нужен аккаунт? Зарегистрируйтесь!</a>
    `
			})}
  `
		}
	)}
</div>`;
});

/* node_modules\sveltestrap\src\Col.svelte generated by Svelte v3.18.1 */

const Col = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { id = "" } = $$props;
	const props = clean($$props);
	const colClasses = [];
	const widths = ["xs", "sm", "md", "lg", "xl"];

	widths.forEach(colWidth => {
		const columnProp = $$props[colWidth];

		if (!columnProp && columnProp !== "") {
			return; //no value for this width
		}

		const isXs = colWidth === "xs";

		if (isObject(columnProp)) {
			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

			if (columnProp.size || columnProp.size === "") {
				colClasses.push(colClass);
			}

			if (columnProp.push) {
				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
			}

			if (columnProp.pull) {
				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
			}

			if (columnProp.offset) {
				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
			}
		} else {
			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
		}
	});

	if (!colClasses.length) {
		colClasses.push("col");
	}

	if (className) {
		colClasses.push(className);
	}

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);

	return `<div${spread([props, { id: escape(id) }, { class: escape(colClasses.join(" ")) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* src\routes\pages\authentication\register.svelte generated by Svelte v3.18.1 */

const Register = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${validate_component(Col, "Col").$$render($$result, { class: "col-lg-7" }, {}, {
		default: () => `
  ${validate_component(Card, "Card").$$render(
			$$result,
			{
				class: "shadow-lg border-0 rounded-lg mt-5"
			},
			{},
			{
				default: () => `
    ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
					default: () => `
      <h3 class="${"text-center font-weight-light my-4"}">Создать аккаунт</h3>
    `
				})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
					default: () => `
      ${validate_component(Form, "Form").$$render($$result, {}, {}, {
						default: () => `
        ${validate_component(Row, "Row").$$render($$result, { form: true }, {}, {
							default: () => `
          <div class="${"col-md-6"}">
            ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
								default: () => `
              ${validate_component(Label, "Label").$$render(
									$$result,
									{
										for: "inputFirstName",
										class: "small mb-1"
									},
									{},
									{ default: () => `Имя` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "text",
										name: "firstName",
										id: "inputFirstName",
										placeholder: "Введите имя"
									},
									{},
									{}
								)}
            `
							})}
          </div>
          <div class="${"col-md-6"}">
            ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
								default: () => `
              ${validate_component(Label, "Label").$$render(
									$$result,
									{
										for: "inputLastName",
										class: "small mb-1"
									},
									{},
									{ default: () => `Фамилия` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "text",
										name: "lastName",
										id: "inputLastName",
										placeholder: "Введите фамилию"
									},
									{},
									{}
								)}
            `
							})}
          </div>
        `
						})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
							default: () => `
          ${validate_component(Label, "Label").$$render($$result, { for: "exampleEmail", class: "small mb-1" }, {}, { default: () => `Email` })}
          ${validate_component(Input, "Input").$$render(
								$$result,
								{
									class: "py-4",
									type: "email",
									name: "email",
									id: "exampleEmail",
									placeholder: "Введите адрес электронной почты"
								},
								{},
								{}
							)}
        `
						})}
        ${validate_component(Row, "Row").$$render($$result, { form: true }, {}, {
							default: () => `
          <div class="${"col-md-6"}">
            ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
								default: () => `
              ${validate_component(Label, "Label").$$render(
									$$result,
									{
										for: "inputPassword",
										class: "small mb-1"
									},
									{},
									{ default: () => `Пароль` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "password",
										name: "inputPassword",
										id: "inputPassword",
										placeholder: "Введите пароль"
									},
									{},
									{}
								)}
            `
							})}
          </div>
          <div class="${"col-md-6"}">
            ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
								default: () => `
              ${validate_component(Label, "Label").$$render(
									$$result,
									{
										for: "inputConfirmPassword",
										class: "small mb-1"
									},
									{},
									{
										default: () => `
                Подтвердить пароль
              `
									}
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "password",
										name: "inputConfirmPassword",
										id: "inputConfirmPassword",
										placeholder: "Подтвердить пароль"
									},
									{},
									{}
								)}
            `
							})}
          </div>
        `
						})}
        ${validate_component(FormGroup, "FormGroup").$$render($$result, { class: "mt-4 mb-0" }, {}, {
							default: () => `
          ${validate_component(Button, "Button").$$render(
								$$result,
								{
									color: "primary",
									block: true,
									href: "pages/authentication/login"
								},
								{},
								{
									default: () => `
            Создать аккаунт
          `
								}
							)}
        `
						})}
      `
					})}
    `
				})}
    ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "text-center small" }, {}, {
					default: () => `
      <a href="${"pages/authentication/login"}">У вас есть аккаунт? Перейдите на страницу входа</a>
    `
				})}
  `
			}
		)}
`
	})}`;
});

/* src\routes\pages\authentication\forget_password.svelte generated by Svelte v3.18.1 */

const Forget_password = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"col-lg-5"}">
  ${validate_component(Card, "Card").$$render(
		$$result,
		{
			class: "shadow-lg border-0 rounded-lg mt-5"
		},
		{},
		{
			default: () => `
    ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
      <h3 class="${"text-center font-weight-light my-4"}">Восстановление пароля</h3>
    `
			})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
      <div class="${"small mb-3 text-muted"}">
        Введите ваш адрес электронной почты, и мы вышлем вам ссылку для перезагрузки вашего
        пароль.
      </div>
      ${validate_component(Form, "Form").$$render($$result, {}, {}, {
					default: () => `
        ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
          ${validate_component(Label, "Label").$$render(
							$$result,
							{
								for: "inputEmailAddress",
								class: "small mb-1"
							},
							{},
							{ default: () => `Email` }
						)}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "email",
								name: "inputEmailAddress",
								id: "inputEmailAddress",
								placeholder: "Введите почту"
							},
							{},
							{}
						)}
        `
					})}
        ${validate_component(FormGroup, "FormGroup").$$render(
						$$result,
						{
							class: "d-flex align-items-center justify-content-between mt-4 mb-0"
						},
						{},
						{
							default: () => `
          <a class="${"small"}" href="${"pages/authentication/login"}">Вернуться к входу в систему</a>
          ${validate_component(Button, "Button").$$render(
								$$result,
								{
									color: "primary",
									href: "pages/authentication/login"
								},
								{},
								{
									default: () => `
            Сброс пароля
          `
								}
							)}
        `
						}
					)}
      `
				})}
    `
			})}
    ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "text-center small" }, {}, {
				default: () => `
      <a href="${"pages/authentication/register"}">Нужен аккаунт? Зарегистрируйтесь!</a>
    `
			})}
  `
		}
	)}
</div>`;
});

/* src\routes\pages\authentication\_layout.svelte generated by Svelte v3.18.1 */

const Layout$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${segment === "login"
	? `${validate_component(Login, "Login").$$render($$result, {}, {}, {})}`
	: `${segment === "register"
		? `${validate_component(Register, "Register").$$render($$result, {}, {}, {})}`
		: `${segment === "forget_password"
			? `${validate_component(Forget_password, "ForgetPassword").$$render($$result, {}, {}, {})}`
			: ``}`}`}`;
});

/* src\routes\pages\error\error_401.svelte generated by Svelte v3.18.1 */

const Error_401 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1 class="${"display-1"}">401</h1>
<p class="${"lead"}">Unauthorized</p>
<p>Access to this resource is denied.</p>
<a href="${"."}">
  <svg class="${"svg-inline--fa fa-arrow-left fa-w-14"}" aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"arrow-left"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}" data-fa-i2svg="${""}">
    <path fill="${"currentColor"}" d="${"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7\r\n      273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2\r\n      22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0\r\n      13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"}"></path>
  </svg>
  
  Return to Dashboard
</a>`;
});

/* src\routes\pages\error\error_404.svelte generated by Svelte v3.18.1 */

const Error_404 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${validate_component(Image, "Image").$$render(
		$$result,
		{
			class: "mb-4 img-error",
			src: "./error-404-monochrome.svg",
			alt: "error_image"
		},
		{},
		{}
	)}
<p class="${"lead"}">This requested URL was not found on this server.</p>
<a href="${"."}">
  <i class="${"fas fa-arrow-left"}"></i>
  Return to Dashboard
</a>`;
});

/* src\routes\pages\error\error_500.svelte generated by Svelte v3.18.1 */

const Error_500 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1 class="${"display-1"}">500</h1>
<p class="${"lead"}">Internal Server Error</p>
<a href="${"."}">
  <svg class="${"svg-inline--fa fa-arrow-left fa-w-14"}" aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"arrow-left"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}" data-fa-i2svg="${""}">
    <path fill="${"currentColor"}" d="${"M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7\r\n      273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2\r\n      22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0\r\n      13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"}"></path>
  </svg>
  
  Return to Dashboard
</a>`;
});

/* src\routes\pages\error\_layout.svelte generated by Svelte v3.18.1 */

const Layout$2 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${segment === "error_401"
	? `${validate_component(Error_401, "Error401").$$render($$result, {}, {}, {})}`
	: `${segment === "error_404"
		? `${validate_component(Error_404, "Error404").$$render($$result, {}, {}, {})}`
		: `${segment === "error_500"
			? `${validate_component(Error_500, "Error500").$$render($$result, {}, {}, {})}`
			: ``}`}`}`;
});

/* src\routes\blog\index.svelte generated by Svelte v3.18.1 */

const css = {
	code: "ul.svelte-1she90c{margin:0 0 1em 0;line-height:1.5}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\r\\n\\texport function preload({ params, query }) {\\r\\n\\t\\treturn this.fetch(`blog.json`).then(r => r.json()).then(posts => {\\r\\n\\t\\t\\treturn { posts };\\r\\n\\t\\t});\\r\\n\\t}\\r\\n</script>\\r\\n\\r\\n<script>\\r\\n\\texport let posts;\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n\\tul {\\r\\n\\t\\tmargin: 0 0 1em 0;\\r\\n\\t\\tline-height: 1.5;\\r\\n\\t}\\r\\n</style>\\r\\n\\r\\n<svelte:head>\\r\\n\\t<title>Blog</title>\\r\\n</svelte:head>\\r\\n\\r\\n<h1>Recent posts</h1>\\r\\n\\r\\n<ul>\\r\\n\\t{#each posts as post}\\r\\n\\t\\t<!-- we're using the non-standard `rel=prefetch` attribute to\\r\\n\\t\\t\\t\\ttell Sapper to load the data for the page as soon as\\r\\n\\t\\t\\t\\tthe user hovers over the link or taps it, instead of\\r\\n\\t\\t\\t\\twaiting for the 'click' event -->\\r\\n\\t\\t<li><a rel='prefetch' href='blog/{post.slug}'>{post.title}</a></li>\\r\\n\\t{/each}\\r\\n</ul>\"],\"names\":[],\"mappings\":\"AAaC,EAAE,eAAC,CAAC,AACH,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CACjB,WAAW,CAAE,GAAG,AACjB,CAAC\"}"
};

function preload({ params, query }) {
	return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
		return { posts };
	});
}

const Blog = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { posts } = $$props;
	if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0) $$bindings.posts(posts);
	$$result.css.add(css);

	return `${($$result.head += `${($$result.title = `<title>Blog</title>`, "")}`, "")}

<h1>Recent posts</h1>

<ul class="${"svelte-1she90c"}">
	${each(posts, post => `
		<li><a rel="${"prefetch"}" href="${"blog/" + escape(post.slug)}">${escape(post.title)}</a></li>`)}
</ul>`;
});

/* src\routes\blog\[slug].svelte generated by Svelte v3.18.1 */

const css$1 = {
	code: ".content.svelte-dkhkxh h2{font-size:1.4em;font-weight:500}.content.svelte-dkhkxh pre{background-color:#f9f9f9;box-shadow:inset 1px 1px 5px rgba(0,0,0,0.05);padding:0.5em;border-radius:2px;overflow-x:auto}.content.svelte-dkhkxh pre code{background-color:transparent;padding:0}.content.svelte-dkhkxh ul{line-height:1.5}.content.svelte-dkhkxh li{margin:0 0 0.5em 0}",
	map: "{\"version\":3,\"file\":\"[slug].svelte\",\"sources\":[\"[slug].svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\r\\n\\texport async function preload({ params, query }) {\\r\\n\\t\\t// the `slug` parameter is available because\\r\\n\\t\\t// this file is called [slug].svelte\\r\\n\\t\\tconst res = await this.fetch(`blog/${params.slug}.json`);\\r\\n\\t\\tconst data = await res.json();\\r\\n\\r\\n\\t\\tif (res.status === 200) {\\r\\n\\t\\t\\treturn { post: data };\\r\\n\\t\\t} else {\\r\\n\\t\\t\\tthis.error(res.status, data.message);\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</script>\\r\\n\\r\\n<script>\\r\\n\\texport let post;\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n\\t/*\\r\\n\\t\\tBy default, CSS is locally scoped to the component,\\r\\n\\t\\tand any unused styles are dead-code-eliminated.\\r\\n\\t\\tIn this page, Svelte can't know which elements are\\r\\n\\t\\tgoing to appear inside the {{{post.html}}} block,\\r\\n\\t\\tso we have to use the :global(...) modifier to target\\r\\n\\t\\tall elements inside .content\\r\\n\\t*/\\r\\n\\t.content :global(h2) {\\r\\n\\t\\tfont-size: 1.4em;\\r\\n\\t\\tfont-weight: 500;\\r\\n\\t}\\r\\n\\r\\n\\t.content :global(pre) {\\r\\n\\t\\tbackground-color: #f9f9f9;\\r\\n\\t\\tbox-shadow: inset 1px 1px 5px rgba(0,0,0,0.05);\\r\\n\\t\\tpadding: 0.5em;\\r\\n\\t\\tborder-radius: 2px;\\r\\n\\t\\toverflow-x: auto;\\r\\n\\t}\\r\\n\\r\\n\\t.content :global(pre) :global(code) {\\r\\n\\t\\tbackground-color: transparent;\\r\\n\\t\\tpadding: 0;\\r\\n\\t}\\r\\n\\r\\n\\t.content :global(ul) {\\r\\n\\t\\tline-height: 1.5;\\r\\n\\t}\\r\\n\\r\\n\\t.content :global(li) {\\r\\n\\t\\tmargin: 0 0 0.5em 0;\\r\\n\\t}\\r\\n</style>\\r\\n\\r\\n<svelte:head>\\r\\n\\t<title>{post.title}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<h1>{post.title}</h1>\\r\\n\\r\\n<div class='content'>\\r\\n\\t{@html post.html}\\r\\n</div>\\r\\n\"],\"names\":[],\"mappings\":\"AA4BC,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,GAAG,AAAE,CAAC,AACtB,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,KAAK,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC9C,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,GAAG,AAAC,CAAC,AAAQ,IAAI,AAAE,CAAC,AACpC,gBAAgB,CAAE,WAAW,CAC7B,OAAO,CAAE,CAAC,AACX,CAAC,AAED,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC\"}"
};

async function preload$1({ params, query }) {
	// the `slug` parameter is available because
	// this file is called [slug].svelte
	const res = await this.fetch(`blog/${params.slug}.json`);

	const data = await res.json();

	if (res.status === 200) {
		return { post: data };
	} else {
		this.error(res.status, data.message);
	}
}

const U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { post } = $$props;
	if ($$props.post === void 0 && $$bindings.post && post !== void 0) $$bindings.post(post);
	$$result.css.add(css$1);

	return `${($$result.head += `${($$result.title = `<title>${escape(post.title)}</title>`, "")}`, "")}

<h1>${escape(post.title)}</h1>

<div class="${"content svelte-dkhkxh"}">
	${post.html}
</div>`;
});

/* src\routes\ui\ui.svelte generated by Svelte v3.18.1 */

const Ui = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"col-lg-5"}">
    ${validate_component(Card, "Card").$$render(
		$$result,
		{
			class: "shadow-lg border-0 rounded-lg mt-5"
		},
		{},
		{
			default: () => `
        ${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
				default: () => `
            <h3 class="${"text-center font-weight-light my-4"}">Логин</h3>
        `
			})}
        ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
            ${validate_component(Form, "Form").$$render($$result, {}, {}, {
					default: () => `
                ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
                    ${validate_component(Label, "Label").$$render($$result, { for: "exampleEmail", class: "small mb-1" }, {}, { default: () => `Email` })}
                    ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "email",
								name: "email",
								id: "exampleEmail",
								placeholder: "Введите адрес электронной почты"
							},
							{},
							{}
						)}
                `
					})}
                ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
                    ${validate_component(Label, "Label").$$render(
							$$result,
							{
								for: "examplePassword",
								class: "small mb-1"
							},
							{},
							{ default: () => `Пароль` }
						)}
                    ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "password",
								name: "password",
								id: "examplePassword",
								placeholder: "Введите пароль"
							},
							{},
							{}
						)}
                `
					})}
                ${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
						default: () => `
                    ${validate_component(CustomInput, "CustomInput").$$render(
							$$result,
							{
								type: "checkbox",
								id: "exampleCustomCheckbox",
								label: "Запомнить пароль"
							},
							{},
							{}
						)}
                `
					})}
                ${validate_component(FormGroup, "FormGroup").$$render(
						$$result,
						{
							class: "d-flex align-items-center justify-content-between mt-4 mb-0"
						},
						{},
						{
							default: () => `
                    <a class="${"small"}" href="${"pages/authentication/forget_password"}">
                        Забыли пароль?
                    </a>
                    ${validate_component(Button, "Button").$$render($$result, { color: "primary", href: "." }, {}, { default: () => `Вход` })}
                `
						}
					)}
            `
				})}
        `
			})}
        ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "text-center small" }, {}, {
				default: () => `
            <a href="${"pages/authentication/register"}">Нужен аккаунт? Зарегистрируйтесь!</a>
        `
			})}
    `
		}
	)}
</div>`;
});

/* src\routes\ui\_layout.svelte generated by Svelte v3.18.1 */

const Layout$3 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${segment === "ui"
	? `${validate_component(Ui, "Ui").$$render($$result, {}, {}, {})}`
	: ``}`;
});

/* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.18.1 */

function getExpandClass(expand) {
	if (expand === false) {
		return false;
	} else if (expand === true || expand === "xs") {
		return "navbar-expand";
	}

	return `navbar-expand-${expand}`;
}

const Navbar = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { light = false } = $$props;
	let { dark = false } = $$props;
	let { fixed = "" } = $$props;
	let { sticky = "" } = $$props;
	let { color = "" } = $$props;
	let { expand = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.light === void 0 && $$bindings.light && light !== void 0) $$bindings.light(light);
	if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0) $$bindings.dark(dark);
	if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0) $$bindings.fixed(fixed);
	if ($$props.sticky === void 0 && $$bindings.sticky && sticky !== void 0) $$bindings.sticky(sticky);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0) $$bindings.expand(expand);

	let classes = clsx(className, "navbar", getExpandClass(expand), {
		"navbar-light": light,
		"navbar-dark": dark,
		[`bg-${color}`]: color,
		[`fixed-${fixed}`]: fixed,
		[`sticky-${sticky}`]: sticky
	});

	return `<nav${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</nav>`;
});

/* node_modules\sveltestrap\src\NavbarBrand.svelte generated by Svelte v3.18.1 */

const NavbarBrand = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { href = "/" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	let classes = clsx(className, "navbar-brand");

	return `<a${spread([props, { class: escape(classes) }, { href: escape(href) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</a>`;
});

/* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.18.1 */

function getVerticalClass(vertical) {
	if (vertical === false) {
		return false;
	} else if (vertical === true || vertical === "xs") {
		return "flex-column";
	}

	return `flex-${vertical}-column`;
}

const Nav = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { tabs = false } = $$props;
	let { pills = false } = $$props;
	let { vertical = false } = $$props;
	let { horizontal = "" } = $$props;
	let { justified = false } = $$props;
	let { fill = false } = $$props;
	let { navbar = false } = $$props;
	let { card = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0) $$bindings.tabs(tabs);
	if ($$props.pills === void 0 && $$bindings.pills && pills !== void 0) $$bindings.pills(pills);
	if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0) $$bindings.vertical(vertical);
	if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0) $$bindings.horizontal(horizontal);
	if ($$props.justified === void 0 && $$bindings.justified && justified !== void 0) $$bindings.justified(justified);
	if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0) $$bindings.fill(fill);
	if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0) $$bindings.navbar(navbar);
	if ($$props.card === void 0 && $$bindings.card && card !== void 0) $$bindings.card(card);

	let classes = clsx(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
		"nav-tabs": tabs,
		"card-header-tabs": card && tabs,
		"nav-pills": pills,
		"card-header-pills": card && pills,
		"nav-justified": justified,
		"nav-fill": fill
	});

	return `<ul${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</ul>`;
});

/* node_modules\sveltestrap\src\Collapse.svelte generated by Svelte v3.18.1 */

const Collapse = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const noop = () => undefined;
	let { isOpen = false } = $$props;
	let { class: className = "" } = $$props;
	let { navbar = false } = $$props;
	let { onEntering = noop } = $$props;
	let { onEntered = noop } = $$props;
	let { onExiting = noop } = $$props;
	let { onExited = noop } = $$props;
	let { expand = false } = $$props;
	const props = clean($$props);
	let windowWidth = 0;
	let _wasMaximazed = false;
	const minWidth = {};
	minWidth["xs"] = 0;
	minWidth["sm"] = 576;
	minWidth["md"] = 768;
	minWidth["lg"] = 992;
	minWidth["xl"] = 1200;
	const dispatch = createEventDispatcher();

	function notify() {
		dispatch("update", { isOpen });
	}

	if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0) $$bindings.isOpen(isOpen);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0) $$bindings.navbar(navbar);
	if ($$props.onEntering === void 0 && $$bindings.onEntering && onEntering !== void 0) $$bindings.onEntering(onEntering);
	if ($$props.onEntered === void 0 && $$bindings.onEntered && onEntered !== void 0) $$bindings.onEntered(onEntered);
	if ($$props.onExiting === void 0 && $$bindings.onExiting && onExiting !== void 0) $$bindings.onExiting(onExiting);
	if ($$props.onExited === void 0 && $$bindings.onExited && onExited !== void 0) $$bindings.onExited(onExited);
	if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0) $$bindings.expand(expand);

	let classes = clsx(className, // collapseClass,
	navbar && "navbar-collapse");

	 {
		if (navbar && expand) {
			if (windowWidth >= minWidth[expand] && !isOpen) {
				isOpen = true;
				_wasMaximazed = true;
				notify();
			} else if (windowWidth < minWidth[expand] && _wasMaximazed) {
				isOpen = false;
				_wasMaximazed = false;
				notify();
			}
		}
	}

	return `

${isOpen
	? `<div${spread([{ class: escape(classes) }, props])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`
	: ``}`;
});

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const createContext = () => writable({});

/* node_modules\sveltestrap\src\Dropdown.svelte generated by Svelte v3.18.1 */

const Dropdown = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let context = createContext();
	setContext("dropdownContext", context);
	let { class: className = "" } = $$props;
	let { direction = "down" } = $$props;
	let { group = false } = $$props;
	let { isOpen = false } = $$props;
	let { nav = false } = $$props;
	let { active = false } = $$props;
	let { addonType = false } = $$props;
	let { size = "" } = $$props;
	let { toggle = undefined } = $$props;
	let { inNavbar = false } = $$props;
	let { setActiveFromChild = false } = $$props;
	let { dropup = false } = $$props;
	const props = clean($$props);
	const validDirections = ["up", "down", "left", "right"];

	if (validDirections.indexOf(direction) === -1) {
		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right'`);
	}

	let component;

	function handleDocumentClick(e) {
		if (e && (e.which === 3 || e.type === "keyup" && e.which !== 9)) return;

		if (component.contains(e.target) && component !== e.target && (e.type !== "keyup" || e.which === 9)) {
			return;
		}

		toggle(e);
	}

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0) $$bindings.direction(direction);
	if ($$props.group === void 0 && $$bindings.group && group !== void 0) $$bindings.group(group);
	if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0) $$bindings.isOpen(isOpen);
	if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0) $$bindings.nav(nav);
	if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
	if ($$props.addonType === void 0 && $$bindings.addonType && addonType !== void 0) $$bindings.addonType(addonType);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0) $$bindings.toggle(toggle);
	if ($$props.inNavbar === void 0 && $$bindings.inNavbar && inNavbar !== void 0) $$bindings.inNavbar(inNavbar);
	if ($$props.setActiveFromChild === void 0 && $$bindings.setActiveFromChild && setActiveFromChild !== void 0) $$bindings.setActiveFromChild(setActiveFromChild);
	if ($$props.dropup === void 0 && $$bindings.dropup && dropup !== void 0) $$bindings.dropup(dropup);
	let subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === "function" && component.querySelector(".active"));

	let classes = clsx(className, direction !== "down" && `drop${direction}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
		[`input-group-${addonType}`]: addonType,
		"btn-group": group,
		[`btn-group-${size}`]: !!size,
		dropdown: !group && !addonType,
		show: isOpen,
		"nav-item": nav
	});

	 {
		{
			if (typeof document !== "undefined") {
				if (isOpen) {
					["click", "touchstart", "keyup"].forEach(event => document.addEventListener(event, handleDocumentClick, true));
				} else {
					["click", "touchstart", "keyup"].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
				}
			}
		}
	}

	 {
		{
			context.update(() => {
				return {
					toggle,
					isOpen,
					direction: direction === "down" && dropup ? "up" : direction,
					inNavbar
				};
			});
		}
	}

	return `${nav
	? `<li${spread([{ class: escape(classes) }, props])}${add_attribute("this", component, 1)}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </li>`
	: `<div${spread([{ class: escape(classes) }, props])}${add_attribute("this", component, 1)}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`}`;
});

/* node_modules\sveltestrap\src\UncontrolledDropdown.svelte generated by Svelte v3.18.1 */

const UncontrolledDropdown = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { disabled = false } = $$props;
	let { direction = "down" } = $$props;
	let { group = false } = $$props;
	let { nav = false } = $$props;
	let { active = false } = $$props;
	let { addonType = false } = $$props;
	let { size = "" } = $$props;
	let { inNavbar = false } = $$props;
	let { setActiveFromChild = false } = $$props;
	let { dropup = false } = $$props;
	let { defaultOpen = false } = $$props;
	let isOpen = defaultOpen;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0) $$bindings.direction(direction);
	if ($$props.group === void 0 && $$bindings.group && group !== void 0) $$bindings.group(group);
	if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0) $$bindings.nav(nav);
	if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
	if ($$props.addonType === void 0 && $$bindings.addonType && addonType !== void 0) $$bindings.addonType(addonType);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.inNavbar === void 0 && $$bindings.inNavbar && inNavbar !== void 0) $$bindings.inNavbar(inNavbar);
	if ($$props.setActiveFromChild === void 0 && $$bindings.setActiveFromChild && setActiveFromChild !== void 0) $$bindings.setActiveFromChild(setActiveFromChild);
	if ($$props.dropup === void 0 && $$bindings.dropup && dropup !== void 0) $$bindings.dropup(dropup);
	if ($$props.defaultOpen === void 0 && $$bindings.defaultOpen && defaultOpen !== void 0) $$bindings.defaultOpen(defaultOpen);

	return `${validate_component(Dropdown, "Dropdown").$$render($$result, Object.assign(props, { isOpen }, { toggle: () => isOpen = !isOpen }, { class: className }, { disabled }, { direction }, { group }, { nav }, { active }, { addonType }, { size }, { inNavbar }, { setActiveFromChild }, { dropup }), {}, {
		default: () => `
  ${$$slots.default ? $$slots.default({}) : ``}
`
	})}`;
});

/* node_modules\sveltestrap\src\DropdownToggle.svelte generated by Svelte v3.18.1 */

const DropdownToggle = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	$context = get_store_value(context);
	let { class: className = "" } = $$props;
	let { caret = false } = $$props;
	let { color = "secondary" } = $$props;
	let { disabled = false } = $$props;
	let { ariaHaspopup = true } = $$props;
	let { ariaLabel = "Toggle Dropdown" } = $$props;
	let { split = false } = $$props;
	let { nav = false } = $$props;
	let { size = "" } = $$props;
	let { tag = null } = $$props;
	let { outline = false } = $$props;
	const props = clean($$props);

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.caret === void 0 && $$bindings.caret && caret !== void 0) $$bindings.caret(caret);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.ariaHaspopup === void 0 && $$bindings.ariaHaspopup && ariaHaspopup !== void 0) $$bindings.ariaHaspopup(ariaHaspopup);
	if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0) $$bindings.ariaLabel(ariaLabel);
	if ($$props.split === void 0 && $$bindings.split && split !== void 0) $$bindings.split(split);
	if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0) $$bindings.nav(nav);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0) $$bindings.tag(tag);
	if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0) $$bindings.outline(outline);
	validate_store(context, "context");
	$context = get_store_value(context);

	let classes = clsx(className, {
		"dropdown-toggle": caret || split,
		"dropdown-toggle-split": split,
		"nav-link": nav
	});

	return `${nav
	? `<a${spread([
			props,
			{ href: "#nav" },
			{ ariaHaspopup: escape(ariaHaspopup) },
			{ class: escape(classes) }
		])}>
    ${$$slots.default
		? $$slots.default({})
		: `
      <span class="${"sr-only"}">${escape(ariaLabel)}</span>
    `}
  </a>`
	: `${tag === "span"
		? `<span${spread([
				props,
				{ ariaHaspopup: escape(ariaHaspopup) },
				{ class: escape(classes) },
				{ color: escape(color) },
				{ size: escape(size) }
			])}>
    ${$$slots.default
			? $$slots.default({})
			: `
      <span class="${"sr-only"}">${escape(ariaLabel)}</span>
    `}
  </span>`
		: `${validate_component(Button, "Button").$$render($$result, Object.assign(props, { ariaHaspopup }, { class: classes }, { color }, { size }, { outline }), {}, {
				default: () => `
    ${$$slots.default
				? $$slots.default({})
				: `
      <span class="${"sr-only"}">${escape(ariaLabel)}</span>
    `}
  `
			})}`}`}`;
});

/* node_modules\sveltestrap\src\DropdownMenu.svelte generated by Svelte v3.18.1 */

const DropdownMenu = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	$context = get_store_value(context);
	let { class: className = "" } = $$props;
	let { right = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.right === void 0 && $$bindings.right && right !== void 0) $$bindings.right(right);
	validate_store(context, "context");
	$context = get_store_value(context);

	let classes = clsx(className, "dropdown-menu", {
		"dropdown-menu-right": right,
		show: $context.isOpen
	});

	return `<div${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\DropdownItem.svelte generated by Svelte v3.18.1 */

const DropdownItem = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	$context = get_store_value(context);
	let { class: className = "" } = $$props;
	let { active = false } = $$props;
	let { disabled = false } = $$props;
	let { divider = false } = $$props;
	let { header = false } = $$props;
	let { toggle = true } = $$props;
	let { href = "" } = $$props;
	const props = clean($$props);

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.active === void 0 && $$bindings.active && active !== void 0) $$bindings.active(active);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.divider === void 0 && $$bindings.divider && divider !== void 0) $$bindings.divider(divider);
	if ($$props.header === void 0 && $$bindings.header && header !== void 0) $$bindings.header(header);
	if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0) $$bindings.toggle(toggle);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	validate_store(context, "context");
	$context = get_store_value(context);

	let classes = clsx(className, {
		disabled,
		"dropdown-item": !divider && !header,
		active,
		"dropdown-header": header,
		"dropdown-divider": divider
	});

	return `${header
	? `<h6${spread([props, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </h6>`
	: `${divider
		? `<div${spread([props, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </div>`
		: `${href
			? `<a click${add_attribute("href", href, 0)}${add_attribute("class", classes, 0)}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </a>`
			: `<button${spread([props, { class: escape(classes) }])}>
    ${$$slots.default ? $$slots.default({}) : ``}
  </button>`}`}`}`;
});

/* node_modules\sveltestrap\src\ListGroup.svelte generated by Svelte v3.18.1 */

const ListGroup = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { flush = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.flush === void 0 && $$bindings.flush && flush !== void 0) $$bindings.flush(flush);
	let classes = clsx(className, "list-group", flush ? "list-group-flush" : false);

	return `<ul${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</ul>`;
});

/* node_modules\sveltestrap\src\InputGroup.svelte generated by Svelte v3.18.1 */

const InputGroup = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { size = "" } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	let classes = clsx(className, "input-group", size ? `input-group-${size}` : null);

	return `<div${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules\sveltestrap\src\InputGroupAddon.svelte generated by Svelte v3.18.1 */

const InputGroupAddon = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: className = "" } = $$props;
	let { addonType } = $$props;
	const props = clean($$props);

	if (["prepend", "append"].indexOf(addonType) === -1) {
		throw new Error(`addonType must be one of 'prepend', 'append'. Received '${addonType}' instead.`);
	}

	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.addonType === void 0 && $$bindings.addonType && addonType !== void 0) $$bindings.addonType(addonType);
	let classes = clsx(className, `input-group-${addonType}`);

	return `<div${spread([props, { class: escape(classes) }])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* src\components\Navbar.svelte generated by Svelte v3.18.1 */

const Navbar_1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { color } = $$props;
	let { title } = $$props;
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);

	return `${validate_component(Navbar, "Navbar").$$render(
		$$result,
		{
			class: "l-proton-topnav navbar-expand",
			color,
			dark: true,
			expand: "md"
		},
		{},
		{
			default: () => `
  ${validate_component(NavbarBrand, "NavbarBrand").$$render($$result, { href: "." }, {}, {
				default: () => `<span class="${"l-logo-span"}">λ</span>${escape(title)}<span class="${"l-logo-span"}">.js</span>`
			})}
  ${validate_component(Nav, "Nav").$$render($$result, { class: "ml-auto", navbar: true }, {}, {
				default: () => `
    ${validate_component(Form, "Form").$$render($$result, { inline: true }, {}, {
					default: () => `
      ${validate_component(InputGroup, "InputGroup").$$render($$result, {}, {}, {
						default: () => `
        ${validate_component(Input, "Input").$$render(
							$$result,
							{
								type: "search",
								name: "search",
								id: "exampleSearch",
								placeholder: "Искать.."
							},
							{},
							{}
						)}
        ${validate_component(InputGroupAddon, "InputGroupAddon").$$render($$result, { addonType: "append" }, {}, {
							default: () => `
          ${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
								default: () => `
            <i class="${"fas fa-search"}"></i>
          `
							})}
        `
						})}
      `
					})}
    `
				})}
    ${validate_component(ListGroup, "ListGroup").$$render($$result, { class: "ml-auto ml-md-0" }, {}, {
					default: () => `
      ${validate_component(UncontrolledDropdown, "UncontrolledDropdown").$$render($$result, { nav: true, inNavbar: true }, {}, {
						default: () => `
        ${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, { nav: true, caret: true }, {}, {
							default: () => `
          <i class="${"fas fa-user-circle fa-fw ml-3"}"></i>
        `
						})}
        ${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, { right: true }, {}, {
							default: () => `
          ${validate_component(DropdownItem, "DropdownItem").$$render($$result, {}, {}, {
								default: () => `         
     
          <a class="${"dropdown-item"}" href="${"settings"}"><i class="${"fas fa-cog"}"></i> Настройки</a>
          `
							})}
          ${validate_component(DropdownItem, "DropdownItem").$$render($$result, {}, {}, {
								default: () => `
            <a class="${"dropdown-item"}" href="${"activity_log"}"><i class="${"fas fa-clipboard-list"}"></i> Активность</a>
          `
							})}
          ${validate_component(DropdownItem, "DropdownItem").$$render($$result, { divider: true }, {}, {})}
          ${validate_component(DropdownItem, "DropdownItem").$$render($$result, {}, {}, {
								default: () => `
            <a class="${"dropdown-item"}" href="${"pages/authentication/login"}">
            <i class="${"fas fa-sign-out-alt"}"></i>  Выйти
            </a>
          `
							})}
        `
						})}
      `
					})}
    `
				})}
  `
			})}
`
		}
	)}`;
});

/* src\components\SidebarItem.svelte generated by Svelte v3.18.1 */

const SidebarItem = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const dispatch = createEventDispatcher();
	let { text = "fdfd" } = $$props;
	let { href = "javascript:void(0)" } = $$props;
	let { leftIcon = false } = $$props;
	let { rightIcon = false } = $$props;
	let { class: className = "" } = $$props;

	if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	if ($$props.leftIcon === void 0 && $$bindings.leftIcon && leftIcon !== void 0) $$bindings.leftIcon(leftIcon);
	if ($$props.rightIcon === void 0 && $$bindings.rightIcon && rightIcon !== void 0) $$bindings.rightIcon(rightIcon);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);

	return `<a class="${"nav-link " + escape(className)}"${add_attribute("href", href, 0)}>
  ${leftIcon
	? `<div class="${"l-proton-nav-link-icon"}">
      ${$$slots.leftIcon ? $$slots.leftIcon({}) : ``}
    </div>`
	: ``}
  ${escape(text)}
  ${rightIcon
	? `<div class="${"l-proton-sidenav-collapse-arrow"}">
      ${$$slots.rightIcon ? $$slots.rightIcon({}) : ``}
    </div>`
	: ``}
</a>`;
});

/* src\components\Sidebar.svelte generated by Svelte v3.18.1 */

const Sidebar = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	let { theme } = $$props;
	let isLayoutOpen = false;
	let isPageOpen = false;
	let isAuthenticationOpen = false;
	let isErrorOpen = false;
	let activeLink = "Панель";
	let footerName = "λproton boy";
	let footerText = "Вы вошли как:";

	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);
	if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
	let sidenav_theme = `l-proton-sidenav-${theme}`;

	return `<div id="${"layoutSidenav_nav"}" class="${"l-proton-nav-fixed"}">
  ${validate_component(Nav, "Nav").$$render(
		$$result,
		{
			class: "l-proton-sidenav " + sidenav_theme + " accordion l-proton-nav-fixed",
			id: "sidenavAccordion"
		},
		{},
		{
			default: () => `
    <div class="${"l-proton-sidenav-menu"}">
      ${validate_component(Nav, "Nav").$$render($$result, {}, {}, {
				default: () => `
        <div class="${"l-proton-sidenav-menu-heading"}">Ядро</div>
        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						text: "Панель",
						class: segment === "." || segment === undefined ? "active" : "",
						leftIcon: true,
						href: "."
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-atom"}" slot="${"leftIcon"}"></i>`,
						default: () => `
          
        `
					}
				)}

        <div class="${"l-proton-sidenav-menu-heading"}">Интерфейс</div>


        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						class:  "collapsed" ,
						text: "Макеты",
						leftIcon: true,
						rightIcon: true
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-columns"}" slot="${"leftIcon"}"></i>`,
						rightIcon: () => `<i class="${"fas fa-angle-down"}" slot="${"rightIcon"}"></i>`,
						default: () => `
          
          
        `
					}
				)}

        ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: isLayoutOpen }, {}, {
					default: () => `
          ${validate_component(Nav, "Nav").$$render($$result, { class: "l-proton-sidenav-menu-nested" }, {}, {
						default: () => `

            ${validate_component(SidebarItem, "SidebarItem").$$render(
							$$result,
							{
								class: segment === "layouts" && activeLink === "Статическая навигация"
								? "active"
								: "",
								href: "layouts/static_navigation",
								text: "Статическая навигация"
							},
							{},
							{}
						)}
            ${validate_component(SidebarItem, "SidebarItem").$$render(
							$$result,
							{
								class: segment === "layouts" && activeLink === "Светлый сайдбар"
								? "active"
								: "",
								href: "layouts/light_sidenav",
								text: "Light Sidenav"
							},
							{},
							{}
						)}
          `
					})}
        `
				})}
        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						class:  "collapsed" ,
						text: "Страницы",
						leftIcon: true,
						rightIcon: true
					},
					{},
					{
						leftIcon: () => `<svg slot="${"leftIcon"}" class="${"svg-inline--fa fa-book-open fa-w-18"}" aria-hidden="${"true"}" focusable="${"false"}" data-prefix="${"fas"}" data-icon="${"book-open"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 576 512"}" data-fa-i2svg="${""}">
            <path fill="${"currentColor"}" d="${"M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64\r\n              2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49\r\n              69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43\r\n              30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73\r\n              87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0\r\n              62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11\r\n              218.77 46.95 10.62 5.35 23.21-1.94\r\n              23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"}"></path>
          </svg>`,
						rightIcon: () => `<i class="${"fas fa-angle-down"}" slot="${"rightIcon"}"></i>`,
						default: () => `
          
          
        `
					}
				)}
        ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: isPageOpen }, {}, {
					default: () => `
          ${validate_component(Nav, "Nav").$$render(
						$$result,
						{
							class: "l-proton-sidenav-menu-nested accordion",
							id: "sidenavAccordionPages"
						},
						{},
						{
							default: () => `
            ${validate_component(SidebarItem, "SidebarItem").$$render(
								$$result,
								{
									class:  "collapsed" ,
									text: "Аутентификация",
									rightIcon: true
								},
								{},
								{
									rightIcon: () => `<i class="${"fas fa-angle-down"}" slot="${"rightIcon"}"></i>`,
									default: () => `
              
            `
								}
							)}
            ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: isAuthenticationOpen }, {}, {
								default: () => `
              ${validate_component(Nav, "Nav").$$render($$result, { class: "l-proton-sidenav-menu-nested" }, {}, {
									default: () => `
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/authentication/login",
											text: "Логин"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/authentication/register",
											text: "Зарегистрироваться"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/authentication/forget_password",
											text: "Забыли пароль"
										},
										{},
										{}
									)}
              `
								})}
            `
							})}
            ${validate_component(SidebarItem, "SidebarItem").$$render(
								$$result,
								{
									class:  "collapsed" ,
									text: "Ошибка",
									rightIcon: true
								},
								{},
								{
									rightIcon: () => `<i class="${"fas fa-angle-down"}" slot="${"rightIcon"}"></i>`,
									default: () => `
              
            `
								}
							)}
            ${validate_component(Collapse, "Collapse").$$render($$result, { isOpen: isErrorOpen }, {}, {
								default: () => `
              ${validate_component(Nav, "Nav").$$render($$result, { class: "l-proton-sidenav-menu-nested" }, {}, {
									default: () => `
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/error/error_401",
											text: "401 Page"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/error/error_404",
											text: "404 Page"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/error/error_500",
											text: "500 Page"
										},
										{},
										{}
									)}
              `
								})}
            `
							})}
          `
						}
					)}
        `
				})}
        <div class="${"l-proton-sidenav-menu-heading"}">Аддоны и примеси</div>
        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						class: segment === "charts" ? "active" : "",
						href: "charts",
						text: "Диаграммы",
						leftIcon: true
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-chart-area"}" slot="${"leftIcon"}"></i>`,
						default: () => `
          
        `
					}
				)}
        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						class: segment === "tables" ? "active" : "",
						href: "tables",
						text: "Таблицы",
						leftIcon: true
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-table"}" slot="${"leftIcon"}"></i>`,
						default: () => `
          
        `
					}
				)}

        ${validate_component(SidebarItem, "SidebarItem").$$render(
					$$result,
					{
						class:  "collapsed" ,
						text: "UI",
						leftIcon: true,
						rightIcon: true
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-grip-horizontal"}" slot="${"leftIcon"}"></i>`,
						rightIcon: () => `<i class="${"fas fa-angle-down"}" slot="${"rightIcon"}"></i>`,
						default: () => `

          
          
        `
					}
				)}
      `
			})}

    </div>
    <div class="${"l-proton-sidenav-footer"}">
      <div class="${"small"}">${escape(footerText)}</div>
      ${escape(footerName)}
    </div>
  `
		}
	)}
</div>`;
});

/* src\routes\_layout.svelte generated by Svelte v3.18.1 */

const Layout$4 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	let theme = "dark";
	let color = "dark";
	let title = "proton";
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${($$result.head += `${($$result.title = `<title>${escape(title)}</title>`, "")}`, "")}

${segment !== "pages"
	? `<div class="${"l-proton-nav-static"}">
    ${validate_component(Navbar_1, "Navbar").$$render($$result, { segment, color, title }, {}, {})}
    <div id="${"layoutSidenav"}">
      ${validate_component(Sidebar, "Sidebar").$$render($$result, { segment, theme }, {}, {})}
      <div id="${"layoutSidenav_content"}">
        <main>
          ${validate_component(Container, "Container").$$render($$result, { fluid: true }, {}, {
			default: () => `
            ${$$slots.default ? $$slots.default({}) : ``}
          `
		})}
        </main>
        ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
      </div>
    </div>
  </div>`
	: `<body>
    ${$$slots.default ? $$slots.default({}) : ``}
  </body>`}`;
});

/* src\routes\_error.svelte generated by Svelte v3.18.1 */

const css$2 = {
	code: "h1.svelte-13vgy2g,p.svelte-13vgy2g{margin:0 auto}h1.svelte-13vgy2g{font-size:2.8em;font-weight:700;margin:0 0 0.5em 0}p.svelte-13vgy2g{margin:1em auto}@media(min-width: 480px){h1.svelte-13vgy2g{font-size:4em}}",
	map: "{\"version\":3,\"file\":\"_error.svelte\",\"sources\":[\"_error.svelte\"],\"sourcesContent\":[\"<script>\\r\\n\\texport let status;\\r\\n\\texport let error;\\r\\n\\r\\n\\tconst dev = \\\"development\\\" === 'development';\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n\\th1, p {\\r\\n\\t\\tmargin: 0 auto;\\r\\n\\t}\\r\\n\\r\\n\\th1 {\\r\\n\\t\\tfont-size: 2.8em;\\r\\n\\t\\tfont-weight: 700;\\r\\n\\t\\tmargin: 0 0 0.5em 0;\\r\\n\\t}\\r\\n\\r\\n\\tp {\\r\\n\\t\\tmargin: 1em auto;\\r\\n\\t}\\r\\n\\r\\n\\t@media (min-width: 480px) {\\r\\n\\t\\th1 {\\r\\n\\t\\t\\tfont-size: 4em;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>\\r\\n\\r\\n<svelte:head>\\r\\n\\t<title>{status}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<h1>{status}</h1>\\r\\n\\r\\n<p>{error.message}</p>\\r\\n\\r\\n{#if dev && error.stack}\\r\\n\\t<pre>{error.stack}</pre>\\r\\n{/if}\\r\\n\"],\"names\":[],\"mappings\":\"AAQC,iBAAE,CAAE,CAAC,eAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AAED,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC,AAED,CAAC,eAAC,CAAC,AACF,MAAM,CAAE,GAAG,CAAC,IAAI,AACjB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,GAAG,AACf,CAAC,AACF,CAAC\"}"
};

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { status } = $$props;
	let { error } = $$props;
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	$$result.css.add(css$2);

	return `${($$result.head += `${($$result.title = `<title>${escape(status)}</title>`, "")}`, "")}

<h1 class="${"svelte-13vgy2g"}">${escape(status)}</h1>

<p class="${"svelte-13vgy2g"}">${escape(error.message)}</p>

${ error.stack
	? `<pre>${escape(error.stack)}</pre>`
	: ``}`;
});

// This file is generated by Sapper — do not edit it!

const d = decodeURIComponent;

const manifest = {
	server_routes: [
		{
			// blog/index.json.js
			pattern: /^\/blog.json$/,
			handlers: route_0,
			params: () => ({})
		},

		{
			// blog/[slug].json.js
			pattern: /^\/blog\/([^\/]+?).json$/,
			handlers: route_1,
			params: match => ({ slug: d(match[1]) })
		}
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: Routes }
			]
		},

		{
			// activity_log.svelte
			pattern: /^\/activity_log\/?$/,
			parts: [
				{ name: "activity_log", file: "activity_log.svelte", component: Activity_log }
			]
		},

		{
			// settings.svelte
			pattern: /^\/settings\/?$/,
			parts: [
				{ name: "settings", file: "settings.svelte", component: Settings }
			]
		},

		{
			// layouts/static_navigation.svelte
			pattern: /^\/layouts\/static_navigation\/?$/,
			parts: [
				null,
				{ name: "layouts_static_navigation", file: "layouts/static_navigation.svelte", component: Static_navigation }
			]
		},

		{
			// layouts/light_sidenav.svelte
			pattern: /^\/layouts\/light_sidenav\/?$/,
			parts: [
				null,
				{ name: "layouts_light_sidenav", file: "layouts/light_sidenav.svelte", component: Light_sidenav }
			]
		},

		{
			// charts.svelte
			pattern: /^\/charts\/?$/,
			parts: [
				{ name: "charts", file: "charts.svelte", component: Charts }
			]
		},

		{
			// tables.svelte
			pattern: /^\/tables\/?$/,
			parts: [
				{ name: "tables", file: "tables.svelte", component: Tables }
			]
		},

		{
			// pages/authentication/forget_password.svelte
			pattern: /^\/pages\/authentication\/forget_password\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_authentication__layout", file: "pages/authentication/_layout.svelte", component: Layout$1 },
				{ name: "pages_authentication_forget_password", file: "pages/authentication/forget_password.svelte", component: Forget_password }
			]
		},

		{
			// pages/authentication/register.svelte
			pattern: /^\/pages\/authentication\/register\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_authentication__layout", file: "pages/authentication/_layout.svelte", component: Layout$1 },
				{ name: "pages_authentication_register", file: "pages/authentication/register.svelte", component: Register }
			]
		},

		{
			// pages/authentication/login.svelte
			pattern: /^\/pages\/authentication\/login\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_authentication__layout", file: "pages/authentication/_layout.svelte", component: Layout$1 },
				{ name: "pages_authentication_login", file: "pages/authentication/login.svelte", component: Login }
			]
		},

		{
			// pages/error/error_401.svelte
			pattern: /^\/pages\/error\/error_401\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_error__layout", file: "pages/error/_layout.svelte", component: Layout$2 },
				{ name: "pages_error_error_401", file: "pages/error/error_401.svelte", component: Error_401 }
			]
		},

		{
			// pages/error/error_404.svelte
			pattern: /^\/pages\/error\/error_404\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_error__layout", file: "pages/error/_layout.svelte", component: Layout$2 },
				{ name: "pages_error_error_404", file: "pages/error/error_404.svelte", component: Error_404 }
			]
		},

		{
			// pages/error/error_500.svelte
			pattern: /^\/pages\/error\/error_500\/?$/,
			parts: [
				{ name: "pages__layout", file: "pages/_layout.svelte", component: Layout },
				{ name: "pages_error__layout", file: "pages/error/_layout.svelte", component: Layout$2 },
				{ name: "pages_error_error_500", file: "pages/error/error_500.svelte", component: Error_500 }
			]
		},

		{
			// blog/index.svelte
			pattern: /^\/blog\/?$/,
			parts: [
				{ name: "blog", file: "blog/index.svelte", component: Blog, preload: preload }
			]
		},

		{
			// blog/[slug].svelte
			pattern: /^\/blog\/([^\/]+?)\/?$/,
			parts: [
				null,
				{ name: "blog_$slug", file: "blog/[slug].svelte", component: U5Bslugu5D, preload: preload$1, params: match => ({ slug: d(match[1]) }) }
			]
		},

		{
			// ui/ui.svelte
			pattern: /^\/ui\/ui\/?$/,
			parts: [
				{ name: "ui__layout", file: "ui/_layout.svelte", component: Layout$3 },
				{ name: "ui_ui", file: "ui/ui.svelte", component: Ui }
			]
		}
	],

	root: Layout$4,
	root_preload: () => {},
	error: Error$1
};

const build_dir = "__sapper__/dev";

const src_dir = "src";

const CONTEXT_KEY = {};

/* src\node_modules\@sapper\internal\App.svelte generated by Svelte v3.18.1 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { level2 = null } = $$props;
	let { level3 = null } = $$props;
	setContext(CONTEXT_KEY, stores);
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);
	if ($$props.level2 === void 0 && $$bindings.level2 && level2 !== void 0) $$bindings.level2(level2);
	if ($$props.level3 === void 0 && $$bindings.level3 && level3 !== void 0) $$bindings.level3(level3);

	return `


${validate_component(Layout$4, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `
	${error
		? `${validate_component(Error$1, "Error").$$render($$result, { error, status }, {}, {})}`
		: `${validate_component(level1.component || missing_component, "svelte:component").$$render($$result, Object.assign({ segment: segments[1] }, level1.props), {}, {
				default: () => `
			${level2
				? `${validate_component(level2.component || missing_component, "svelte:component").$$render($$result, Object.assign({ segment: segments[2] }, level2.props), {}, {
						default: () => `
					${level3
						? `${validate_component(level3.component || missing_component, "svelte:component").$$render($$result, Object.assign(level3.props), {}, {})}`
						: ``}
				`
					})}`
				: ``}
		`
			})}`}
`
	})}`;
});

function get_server_route_handler(routes) {
	async function handle_route(route, req, res, next) {
		req.params = route.params(route.pattern.exec(req.path));

		const method = req.method.toLowerCase();
		// 'delete' cannot be exported from a module because it is a keyword,
		// so check for 'del' instead
		const method_export = method === 'delete' ? 'del' : method;
		const handle_method = route.handlers[method_export];
		if (handle_method) {
			if (process.env.SAPPER_EXPORT) {
				const { write, end, setHeader } = res;
				const chunks = [];
				const headers = {};

				// intercept data so that it can be exported
				res.write = function(chunk) {
					chunks.push(Buffer.from(chunk));
					write.apply(res, arguments);
				};

				res.setHeader = function(name, value) {
					headers[name.toLowerCase()] = value;
					setHeader.apply(res, arguments);
				};

				res.end = function(chunk) {
					if (chunk) chunks.push(Buffer.from(chunk));
					end.apply(res, arguments);

					process.send({
						__sapper__: true,
						event: 'file',
						url: req.url,
						method: req.method,
						status: res.statusCode,
						type: headers['content-type'],
						body: Buffer.concat(chunks).toString()
					});
				};
			}

			const handle_next = (err) => {
				if (err) {
					res.statusCode = 500;
					res.end(err.message);
				} else {
					process.nextTick(next);
				}
			};

			try {
				await handle_method(req, res, handle_next);
			} catch (err) {
				console.error(err);
				handle_next(err);
			}
		} else {
			// no matching handler for method
			process.nextTick(next);
		}
	}

	return function find_route(req, res, next) {
		for (const route of routes) {
			if (route.pattern.test(req.path)) {
				handle_route(route, req, res, next);
				return;
			}
		}

		next();
	};
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

function get_page_handler(
	manifest,
	session_getter
) {
	const get_build_info =  () => JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8'))
		;

	const template =  () => read_template(src_dir)
		;

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  escape_html(err.message) ;

		res.statusCode = 500;
		res.end(`<pre>${message}</pre>`);
	}

	function handle_error(req, res, statusCode, error) {
		handle_page({
			pattern: null,
			parts: [
				{ name: null, component: error_route }
			]
		}, req, res, statusCode, error || new Error('Unknown error in preload function'));
	}

	async function handle_page(page, req, res, status = 200, error = null) {
		const is_service_worker_index = req.path === '/service-worker-index.html';
		const build_info




 = get_build_info();

		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control',  'no-cache' );

		// preload main.js and current route
		// TODO detect other stuff we can preload? images, CSS, fonts?
		let preloaded_chunks = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
		if (!error && !is_service_worker_index) {
			page.parts.forEach(part => {
				if (!part) return;

				// using concat because it could be a string or an array. thanks webpack!
				preloaded_chunks = preloaded_chunks.concat(build_info.assets[part.name]);
			});
		}

		if (build_info.bundler === 'rollup') {
			// TODO add dependencies and CSS
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map(file => `<${req.baseUrl}/client/${file}>;rel="modulepreload"`)
				.join(', ');

			res.setHeader('Link', link);
		} else {
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map((file) => {
					const as = /\.css$/.test(file) ? 'style' : 'script';
					return `<${req.baseUrl}/client/${file}>;rel="preload";as="${as}"`;
				})
				.join(', ');

			res.setHeader('Link', link);
		}

		const session = session_getter(req, res);

		let redirect;
		let preload_error;

		const preload_context = {
			redirect: (statusCode, location) => {
				if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
					throw new Error(`Conflicting redirects`);
				}
				location = location.replace(/^\//g, ''); // leading slash (only)
				redirect = { statusCode, location };
			},
			error: (statusCode, message) => {
				preload_error = { statusCode, message };
			},
			fetch: (url, opts) => {
				const parsed = new Url.URL(url, `http://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' :''}`);

				if (opts) {
					opts = Object.assign({}, opts);

					const include_cookies = (
						opts.credentials === 'include' ||
						opts.credentials === 'same-origin' && parsed.origin === `http://127.0.0.1:${process.env.PORT}`
					);

					if (include_cookies) {
						opts.headers = Object.assign({}, opts.headers);

						const cookies = Object.assign(
							{},
							cookie.parse(req.headers.cookie || ''),
							cookie.parse(opts.headers.cookie || '')
						);

						const set_cookie = res.getHeader('Set-Cookie');
						(Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(str => {
							const match = /([^=]+)=([^;]+)/.exec(str);
							if (match) cookies[match[1]] = match[2];
						});

						const str = Object.keys(cookies)
							.map(key => `${key}=${cookies[key]}`)
							.join('; ');

						opts.headers.cookie = str;
					}
				}

				return fetch(parsed.href, opts);
			}
		};

		let preloaded;
		let match;
		let params;

		try {
			const root_preloaded = manifest.root_preload
				? manifest.root_preload.call(preload_context, {
					host: req.headers.host,
					path: req.path,
					query: req.query,
					params: {}
				}, session)
				: {};

			match = error ? null : page.pattern.exec(req.path);


			let toPreload = [root_preloaded];
			if (!is_service_worker_index) {
				toPreload = toPreload.concat(page.parts.map(part => {
					if (!part) return null;

					// the deepest level is used below, to initialise the store
					params = part.params ? part.params(match) : {};

					return part.preload
						? part.preload.call(preload_context, {
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}, session)
						: {};
				}));
			}

			preloaded = await Promise.all(toPreload);
		} catch (err) {
			if (error) {
				return bail(req, res, err)
			}

			preload_error = { statusCode: 500, message: err };
			preloaded = []; // appease TypeScript
		}

		try {
			if (redirect) {
				const location = Url.resolve((req.baseUrl || '') + '/', redirect.location);

				res.statusCode = redirect.statusCode;
				res.setHeader('Location', location);
				res.end();

				return;
			}

			if (preload_error) {
				handle_error(req, res, preload_error.statusCode, preload_error.message);
				return;
			}

			const segments = req.path.split('/').filter(Boolean);

			// TODO make this less confusing
			const layout_segments = [segments[0]];
			let l = 1;

			page.parts.forEach((part, i) => {
				layout_segments[l] = segments[i + 1];
				if (!part) return null;
				l++;
			});

			const props = {
				stores: {
					page: {
						subscribe: writable({
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}).subscribe
					},
					preloading: {
						subscribe: writable(null).subscribe
					},
					session: writable(session)
				},
				segments: layout_segments,
				status: error ? status : 200,
				error: error ? error instanceof Error ? error : { message: error } : null,
				level0: {
					props: preloaded[0]
				},
				level1: {
					segment: segments[0],
					props: {}
				}
			};

			if (!is_service_worker_index) {
				let l = 1;
				for (let i = 0; i < page.parts.length; i += 1) {
					const part = page.parts[i];
					if (!part) continue;

					props[`level${l++}`] = {
						component: part.component,
						props: preloaded[i + 1] || {},
						segment: segments[i]
					};
				}
			}

			const { html, head, css } = App.render(props);

			const serialized = {
				preloaded: `[${preloaded.map(data => try_serialize(data)).join(',')}]`,
				session: session && try_serialize(session, err => {
					throw new Error(`Failed to serialize session data: ${err.message}`);
				}),
				error: error && try_serialize(props.error)
			};

			let script = `__SAPPER__={${[
				error && `error:${serialized.error},status:${status}`,
				`baseUrl:"${req.baseUrl}"`,
				serialized.preloaded && `preloaded:${serialized.preloaded}`,
				serialized.session && `session:${serialized.session}`
			].filter(Boolean).join(',')}};`;

			if (has_service_worker) {
				script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
			}

			const file = [].concat(build_info.assets.main).filter(file => file && /\.js$/.test(file))[0];
			const main = `${req.baseUrl}/client/${file}`;

			if (build_info.bundler === 'rollup') {
				if (build_info.legacy_assets) {
					const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
					script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
				} else {
					script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
				}
			} else {
				script += `</script><script src="${main}">`;
			}

			let styles;

			// TODO make this consistent across apps
			// TODO embed build_info in placeholder.ts
			if (build_info.css && build_info.css.main) {
				const css_chunks = new Set();
				if (build_info.css.main) css_chunks.add(build_info.css.main);
				page.parts.forEach(part => {
					if (!part) return;
					const css_chunks_for_part = build_info.css.chunks[part.file];

					if (css_chunks_for_part) {
						css_chunks_for_part.forEach(file => {
							css_chunks.add(file);
						});
					}
				});

				styles = Array.from(css_chunks)
					.map(href => `<link rel="stylesheet" href="client/${href}">`)
					.join('');
			} else {
				styles = (css && css.code ? `<style>${css.code}</style>` : '');
			}

			// users can set a CSP nonce using res.locals.nonce
			const nonce_attr = (res.locals && res.locals.nonce) ? ` nonce="${res.locals.nonce}"` : '';

			const body = template()
				.replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
				.replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
				.replace('%sapper.html%', () => html)
				.replace('%sapper.head%', () => `<noscript id='sapper-head-start'></noscript>${head}<noscript id='sapper-head-end'></noscript>`)
				.replace('%sapper.styles%', () => styles);

			res.statusCode = status;
			res.end(body);
		} catch(err) {
			if (error) {
				bail(req, res, err);
			} else {
				handle_error(req, res, 500, err);
			}
		}
	}

	return function find_route(req, res, next) {
		if (req.path === '/service-worker-index.html') {
			const homePage = pages.find(page => page.pattern.test('/'));
			handle_page(homePage, req, res);
			return;
		}

		for (const page of pages) {
			if (page.pattern.test(req.path)) {
				handle_page(page, req, res);
				return;
			}
		}

		handle_error(req, res, 404, 'Not found');
	};
}

function read_template(dir = build_dir) {
	return fs.readFileSync(`${dir}/template.html`, 'utf-8');
}

function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}

function escape_html(html) {
	const chars = {
		'"' : 'quot',
		"'": '#39',
		'&': 'amp',
		'<' : 'lt',
		'>' : 'gt'
	};

	return html.replace(/["'&<>]/g, c => `&${chars[c]};`);
}

var mime_raw = "application/andrew-inset\t\t\tez\napplication/applixware\t\t\t\taw\napplication/atom+xml\t\t\t\tatom\napplication/atomcat+xml\t\t\t\tatomcat\napplication/atomsvc+xml\t\t\t\tatomsvc\napplication/ccxml+xml\t\t\t\tccxml\napplication/cdmi-capability\t\t\tcdmia\napplication/cdmi-container\t\t\tcdmic\napplication/cdmi-domain\t\t\t\tcdmid\napplication/cdmi-object\t\t\t\tcdmio\napplication/cdmi-queue\t\t\t\tcdmiq\napplication/cu-seeme\t\t\t\tcu\napplication/davmount+xml\t\t\tdavmount\napplication/docbook+xml\t\t\t\tdbk\napplication/dssc+der\t\t\t\tdssc\napplication/dssc+xml\t\t\t\txdssc\napplication/ecmascript\t\t\t\tecma\napplication/emma+xml\t\t\t\temma\napplication/epub+zip\t\t\t\tepub\napplication/exi\t\t\t\t\texi\napplication/font-tdpfr\t\t\t\tpfr\napplication/gml+xml\t\t\t\tgml\napplication/gpx+xml\t\t\t\tgpx\napplication/gxf\t\t\t\t\tgxf\napplication/hyperstudio\t\t\t\tstk\napplication/inkml+xml\t\t\t\tink inkml\napplication/ipfix\t\t\t\tipfix\napplication/java-archive\t\t\tjar\napplication/java-serialized-object\t\tser\napplication/java-vm\t\t\t\tclass\napplication/javascript\t\t\t\tjs\napplication/json\t\t\t\tjson\napplication/jsonml+json\t\t\t\tjsonml\napplication/lost+xml\t\t\t\tlostxml\napplication/mac-binhex40\t\t\thqx\napplication/mac-compactpro\t\t\tcpt\napplication/mads+xml\t\t\t\tmads\napplication/marc\t\t\t\tmrc\napplication/marcxml+xml\t\t\t\tmrcx\napplication/mathematica\t\t\t\tma nb mb\napplication/mathml+xml\t\t\t\tmathml\napplication/mbox\t\t\t\tmbox\napplication/mediaservercontrol+xml\t\tmscml\napplication/metalink+xml\t\t\tmetalink\napplication/metalink4+xml\t\t\tmeta4\napplication/mets+xml\t\t\t\tmets\napplication/mods+xml\t\t\t\tmods\napplication/mp21\t\t\t\tm21 mp21\napplication/mp4\t\t\t\t\tmp4s\napplication/msword\t\t\t\tdoc dot\napplication/mxf\t\t\t\t\tmxf\napplication/octet-stream\tbin dms lrf mar so dist distz pkg bpk dump elc deploy\napplication/oda\t\t\t\t\toda\napplication/oebps-package+xml\t\t\topf\napplication/ogg\t\t\t\t\togx\napplication/omdoc+xml\t\t\t\tomdoc\napplication/onenote\t\t\t\tonetoc onetoc2 onetmp onepkg\napplication/oxps\t\t\t\toxps\napplication/patch-ops-error+xml\t\t\txer\napplication/pdf\t\t\t\t\tpdf\napplication/pgp-encrypted\t\t\tpgp\napplication/pgp-signature\t\t\tasc sig\napplication/pics-rules\t\t\t\tprf\napplication/pkcs10\t\t\t\tp10\napplication/pkcs7-mime\t\t\t\tp7m p7c\napplication/pkcs7-signature\t\t\tp7s\napplication/pkcs8\t\t\t\tp8\napplication/pkix-attr-cert\t\t\tac\napplication/pkix-cert\t\t\t\tcer\napplication/pkix-crl\t\t\t\tcrl\napplication/pkix-pkipath\t\t\tpkipath\napplication/pkixcmp\t\t\t\tpki\napplication/pls+xml\t\t\t\tpls\napplication/postscript\t\t\t\tai eps ps\napplication/prs.cww\t\t\t\tcww\napplication/pskc+xml\t\t\t\tpskcxml\napplication/rdf+xml\t\t\t\trdf\napplication/reginfo+xml\t\t\t\trif\napplication/relax-ng-compact-syntax\t\trnc\napplication/resource-lists+xml\t\t\trl\napplication/resource-lists-diff+xml\t\trld\napplication/rls-services+xml\t\t\trs\napplication/rpki-ghostbusters\t\t\tgbr\napplication/rpki-manifest\t\t\tmft\napplication/rpki-roa\t\t\t\troa\napplication/rsd+xml\t\t\t\trsd\napplication/rss+xml\t\t\t\trss\napplication/rtf\t\t\t\t\trtf\napplication/sbml+xml\t\t\t\tsbml\napplication/scvp-cv-request\t\t\tscq\napplication/scvp-cv-response\t\t\tscs\napplication/scvp-vp-request\t\t\tspq\napplication/scvp-vp-response\t\t\tspp\napplication/sdp\t\t\t\t\tsdp\napplication/set-payment-initiation\t\tsetpay\napplication/set-registration-initiation\t\tsetreg\napplication/shf+xml\t\t\t\tshf\napplication/smil+xml\t\t\t\tsmi smil\napplication/sparql-query\t\t\trq\napplication/sparql-results+xml\t\t\tsrx\napplication/srgs\t\t\t\tgram\napplication/srgs+xml\t\t\t\tgrxml\napplication/sru+xml\t\t\t\tsru\napplication/ssdl+xml\t\t\t\tssdl\napplication/ssml+xml\t\t\t\tssml\napplication/tei+xml\t\t\t\ttei teicorpus\napplication/thraud+xml\t\t\t\ttfi\napplication/timestamped-data\t\t\ttsd\napplication/vnd.3gpp.pic-bw-large\t\tplb\napplication/vnd.3gpp.pic-bw-small\t\tpsb\napplication/vnd.3gpp.pic-bw-var\t\t\tpvb\napplication/vnd.3gpp2.tcap\t\t\ttcap\napplication/vnd.3m.post-it-notes\t\tpwn\napplication/vnd.accpac.simply.aso\t\taso\napplication/vnd.accpac.simply.imp\t\timp\napplication/vnd.acucobol\t\t\tacu\napplication/vnd.acucorp\t\t\t\tatc acutc\napplication/vnd.adobe.air-application-installer-package+zip\tair\napplication/vnd.adobe.formscentral.fcdt\t\tfcdt\napplication/vnd.adobe.fxp\t\t\tfxp fxpl\napplication/vnd.adobe.xdp+xml\t\t\txdp\napplication/vnd.adobe.xfdf\t\t\txfdf\napplication/vnd.ahead.space\t\t\tahead\napplication/vnd.airzip.filesecure.azf\t\tazf\napplication/vnd.airzip.filesecure.azs\t\tazs\napplication/vnd.amazon.ebook\t\t\tazw\napplication/vnd.americandynamics.acc\t\tacc\napplication/vnd.amiga.ami\t\t\tami\napplication/vnd.android.package-archive\t\tapk\napplication/vnd.anser-web-certificate-issue-initiation\tcii\napplication/vnd.anser-web-funds-transfer-initiation\tfti\napplication/vnd.antix.game-component\t\tatx\napplication/vnd.apple.installer+xml\t\tmpkg\napplication/vnd.apple.mpegurl\t\t\tm3u8\napplication/vnd.aristanetworks.swi\t\tswi\napplication/vnd.astraea-software.iota\t\tiota\napplication/vnd.audiograph\t\t\taep\napplication/vnd.blueice.multipass\t\tmpm\napplication/vnd.bmi\t\t\t\tbmi\napplication/vnd.businessobjects\t\t\trep\napplication/vnd.chemdraw+xml\t\t\tcdxml\napplication/vnd.chipnuts.karaoke-mmd\t\tmmd\napplication/vnd.cinderella\t\t\tcdy\napplication/vnd.claymore\t\t\tcla\napplication/vnd.cloanto.rp9\t\t\trp9\napplication/vnd.clonk.c4group\t\t\tc4g c4d c4f c4p c4u\napplication/vnd.cluetrust.cartomobile-config\t\tc11amc\napplication/vnd.cluetrust.cartomobile-config-pkg\tc11amz\napplication/vnd.commonspace\t\t\tcsp\napplication/vnd.contact.cmsg\t\t\tcdbcmsg\napplication/vnd.cosmocaller\t\t\tcmc\napplication/vnd.crick.clicker\t\t\tclkx\napplication/vnd.crick.clicker.keyboard\t\tclkk\napplication/vnd.crick.clicker.palette\t\tclkp\napplication/vnd.crick.clicker.template\t\tclkt\napplication/vnd.crick.clicker.wordbank\t\tclkw\napplication/vnd.criticaltools.wbs+xml\t\twbs\napplication/vnd.ctc-posml\t\t\tpml\napplication/vnd.cups-ppd\t\t\tppd\napplication/vnd.curl.car\t\t\tcar\napplication/vnd.curl.pcurl\t\t\tpcurl\napplication/vnd.dart\t\t\t\tdart\napplication/vnd.data-vision.rdz\t\t\trdz\napplication/vnd.dece.data\t\t\tuvf uvvf uvd uvvd\napplication/vnd.dece.ttml+xml\t\t\tuvt uvvt\napplication/vnd.dece.unspecified\t\tuvx uvvx\napplication/vnd.dece.zip\t\t\tuvz uvvz\napplication/vnd.denovo.fcselayout-link\t\tfe_launch\napplication/vnd.dna\t\t\t\tdna\napplication/vnd.dolby.mlp\t\t\tmlp\napplication/vnd.dpgraph\t\t\t\tdpg\napplication/vnd.dreamfactory\t\t\tdfac\napplication/vnd.ds-keypoint\t\t\tkpxx\napplication/vnd.dvb.ait\t\t\t\tait\napplication/vnd.dvb.service\t\t\tsvc\napplication/vnd.dynageo\t\t\t\tgeo\napplication/vnd.ecowin.chart\t\t\tmag\napplication/vnd.enliven\t\t\t\tnml\napplication/vnd.epson.esf\t\t\tesf\napplication/vnd.epson.msf\t\t\tmsf\napplication/vnd.epson.quickanime\t\tqam\napplication/vnd.epson.salt\t\t\tslt\napplication/vnd.epson.ssf\t\t\tssf\napplication/vnd.eszigno3+xml\t\t\tes3 et3\napplication/vnd.ezpix-album\t\t\tez2\napplication/vnd.ezpix-package\t\t\tez3\napplication/vnd.fdf\t\t\t\tfdf\napplication/vnd.fdsn.mseed\t\t\tmseed\napplication/vnd.fdsn.seed\t\t\tseed dataless\napplication/vnd.flographit\t\t\tgph\napplication/vnd.fluxtime.clip\t\t\tftc\napplication/vnd.framemaker\t\t\tfm frame maker book\napplication/vnd.frogans.fnc\t\t\tfnc\napplication/vnd.frogans.ltf\t\t\tltf\napplication/vnd.fsc.weblaunch\t\t\tfsc\napplication/vnd.fujitsu.oasys\t\t\toas\napplication/vnd.fujitsu.oasys2\t\t\toa2\napplication/vnd.fujitsu.oasys3\t\t\toa3\napplication/vnd.fujitsu.oasysgp\t\t\tfg5\napplication/vnd.fujitsu.oasysprs\t\tbh2\napplication/vnd.fujixerox.ddd\t\t\tddd\napplication/vnd.fujixerox.docuworks\t\txdw\napplication/vnd.fujixerox.docuworks.binder\txbd\napplication/vnd.fuzzysheet\t\t\tfzs\napplication/vnd.genomatix.tuxedo\t\ttxd\napplication/vnd.geogebra.file\t\t\tggb\napplication/vnd.geogebra.tool\t\t\tggt\napplication/vnd.geometry-explorer\t\tgex gre\napplication/vnd.geonext\t\t\t\tgxt\napplication/vnd.geoplan\t\t\t\tg2w\napplication/vnd.geospace\t\t\tg3w\napplication/vnd.gmx\t\t\t\tgmx\napplication/vnd.google-earth.kml+xml\t\tkml\napplication/vnd.google-earth.kmz\t\tkmz\napplication/vnd.grafeq\t\t\t\tgqf gqs\napplication/vnd.groove-account\t\t\tgac\napplication/vnd.groove-help\t\t\tghf\napplication/vnd.groove-identity-message\t\tgim\napplication/vnd.groove-injector\t\t\tgrv\napplication/vnd.groove-tool-message\t\tgtm\napplication/vnd.groove-tool-template\t\ttpl\napplication/vnd.groove-vcard\t\t\tvcg\napplication/vnd.hal+xml\t\t\t\thal\napplication/vnd.handheld-entertainment+xml\tzmm\napplication/vnd.hbci\t\t\t\thbci\napplication/vnd.hhe.lesson-player\t\tles\napplication/vnd.hp-hpgl\t\t\t\thpgl\napplication/vnd.hp-hpid\t\t\t\thpid\napplication/vnd.hp-hps\t\t\t\thps\napplication/vnd.hp-jlyt\t\t\t\tjlt\napplication/vnd.hp-pcl\t\t\t\tpcl\napplication/vnd.hp-pclxl\t\t\tpclxl\napplication/vnd.hydrostatix.sof-data\t\tsfd-hdstx\napplication/vnd.ibm.minipay\t\t\tmpy\napplication/vnd.ibm.modcap\t\t\tafp listafp list3820\napplication/vnd.ibm.rights-management\t\tirm\napplication/vnd.ibm.secure-container\t\tsc\napplication/vnd.iccprofile\t\t\ticc icm\napplication/vnd.igloader\t\t\tigl\napplication/vnd.immervision-ivp\t\t\tivp\napplication/vnd.immervision-ivu\t\t\tivu\napplication/vnd.insors.igm\t\t\tigm\napplication/vnd.intercon.formnet\t\txpw xpx\napplication/vnd.intergeo\t\t\ti2g\napplication/vnd.intu.qbo\t\t\tqbo\napplication/vnd.intu.qfx\t\t\tqfx\napplication/vnd.ipunplugged.rcprofile\t\trcprofile\napplication/vnd.irepository.package+xml\t\tirp\napplication/vnd.is-xpr\t\t\t\txpr\napplication/vnd.isac.fcs\t\t\tfcs\napplication/vnd.jam\t\t\t\tjam\napplication/vnd.jcp.javame.midlet-rms\t\trms\napplication/vnd.jisp\t\t\t\tjisp\napplication/vnd.joost.joda-archive\t\tjoda\napplication/vnd.kahootz\t\t\t\tktz ktr\napplication/vnd.kde.karbon\t\t\tkarbon\napplication/vnd.kde.kchart\t\t\tchrt\napplication/vnd.kde.kformula\t\t\tkfo\napplication/vnd.kde.kivio\t\t\tflw\napplication/vnd.kde.kontour\t\t\tkon\napplication/vnd.kde.kpresenter\t\t\tkpr kpt\napplication/vnd.kde.kspread\t\t\tksp\napplication/vnd.kde.kword\t\t\tkwd kwt\napplication/vnd.kenameaapp\t\t\thtke\napplication/vnd.kidspiration\t\t\tkia\napplication/vnd.kinar\t\t\t\tkne knp\napplication/vnd.koan\t\t\t\tskp skd skt skm\napplication/vnd.kodak-descriptor\t\tsse\napplication/vnd.las.las+xml\t\t\tlasxml\napplication/vnd.llamagraphics.life-balance.desktop\tlbd\napplication/vnd.llamagraphics.life-balance.exchange+xml\tlbe\napplication/vnd.lotus-1-2-3\t\t\t123\napplication/vnd.lotus-approach\t\t\tapr\napplication/vnd.lotus-freelance\t\t\tpre\napplication/vnd.lotus-notes\t\t\tnsf\napplication/vnd.lotus-organizer\t\t\torg\napplication/vnd.lotus-screencam\t\t\tscm\napplication/vnd.lotus-wordpro\t\t\tlwp\napplication/vnd.macports.portpkg\t\tportpkg\napplication/vnd.mcd\t\t\t\tmcd\napplication/vnd.medcalcdata\t\t\tmc1\napplication/vnd.mediastation.cdkey\t\tcdkey\napplication/vnd.mfer\t\t\t\tmwf\napplication/vnd.mfmp\t\t\t\tmfm\napplication/vnd.micrografx.flo\t\t\tflo\napplication/vnd.micrografx.igx\t\t\tigx\napplication/vnd.mif\t\t\t\tmif\napplication/vnd.mobius.daf\t\t\tdaf\napplication/vnd.mobius.dis\t\t\tdis\napplication/vnd.mobius.mbk\t\t\tmbk\napplication/vnd.mobius.mqy\t\t\tmqy\napplication/vnd.mobius.msl\t\t\tmsl\napplication/vnd.mobius.plc\t\t\tplc\napplication/vnd.mobius.txf\t\t\ttxf\napplication/vnd.mophun.application\t\tmpn\napplication/vnd.mophun.certificate\t\tmpc\napplication/vnd.mozilla.xul+xml\t\t\txul\napplication/vnd.ms-artgalry\t\t\tcil\napplication/vnd.ms-cab-compressed\t\tcab\napplication/vnd.ms-excel\t\t\txls xlm xla xlc xlt xlw\napplication/vnd.ms-excel.addin.macroenabled.12\t\txlam\napplication/vnd.ms-excel.sheet.binary.macroenabled.12\txlsb\napplication/vnd.ms-excel.sheet.macroenabled.12\t\txlsm\napplication/vnd.ms-excel.template.macroenabled.12\txltm\napplication/vnd.ms-fontobject\t\t\teot\napplication/vnd.ms-htmlhelp\t\t\tchm\napplication/vnd.ms-ims\t\t\t\tims\napplication/vnd.ms-lrm\t\t\t\tlrm\napplication/vnd.ms-officetheme\t\t\tthmx\napplication/vnd.ms-pki.seccat\t\t\tcat\napplication/vnd.ms-pki.stl\t\t\tstl\napplication/vnd.ms-powerpoint\t\t\tppt pps pot\napplication/vnd.ms-powerpoint.addin.macroenabled.12\t\tppam\napplication/vnd.ms-powerpoint.presentation.macroenabled.12\tpptm\napplication/vnd.ms-powerpoint.slide.macroenabled.12\t\tsldm\napplication/vnd.ms-powerpoint.slideshow.macroenabled.12\t\tppsm\napplication/vnd.ms-powerpoint.template.macroenabled.12\t\tpotm\napplication/vnd.ms-project\t\t\tmpp mpt\napplication/vnd.ms-word.document.macroenabled.12\tdocm\napplication/vnd.ms-word.template.macroenabled.12\tdotm\napplication/vnd.ms-works\t\t\twps wks wcm wdb\napplication/vnd.ms-wpl\t\t\t\twpl\napplication/vnd.ms-xpsdocument\t\t\txps\napplication/vnd.mseq\t\t\t\tmseq\napplication/vnd.musician\t\t\tmus\napplication/vnd.muvee.style\t\t\tmsty\napplication/vnd.mynfc\t\t\t\ttaglet\napplication/vnd.neurolanguage.nlu\t\tnlu\napplication/vnd.nitf\t\t\t\tntf nitf\napplication/vnd.noblenet-directory\t\tnnd\napplication/vnd.noblenet-sealer\t\t\tnns\napplication/vnd.noblenet-web\t\t\tnnw\napplication/vnd.nokia.n-gage.data\t\tngdat\napplication/vnd.nokia.n-gage.symbian.install\tn-gage\napplication/vnd.nokia.radio-preset\t\trpst\napplication/vnd.nokia.radio-presets\t\trpss\napplication/vnd.novadigm.edm\t\t\tedm\napplication/vnd.novadigm.edx\t\t\tedx\napplication/vnd.novadigm.ext\t\t\text\napplication/vnd.oasis.opendocument.chart\t\todc\napplication/vnd.oasis.opendocument.chart-template\totc\napplication/vnd.oasis.opendocument.database\t\todb\napplication/vnd.oasis.opendocument.formula\t\todf\napplication/vnd.oasis.opendocument.formula-template\todft\napplication/vnd.oasis.opendocument.graphics\t\todg\napplication/vnd.oasis.opendocument.graphics-template\totg\napplication/vnd.oasis.opendocument.image\t\todi\napplication/vnd.oasis.opendocument.image-template\toti\napplication/vnd.oasis.opendocument.presentation\t\todp\napplication/vnd.oasis.opendocument.presentation-template\totp\napplication/vnd.oasis.opendocument.spreadsheet\t\tods\napplication/vnd.oasis.opendocument.spreadsheet-template\tots\napplication/vnd.oasis.opendocument.text\t\t\todt\napplication/vnd.oasis.opendocument.text-master\t\todm\napplication/vnd.oasis.opendocument.text-template\tott\napplication/vnd.oasis.opendocument.text-web\t\toth\napplication/vnd.olpc-sugar\t\t\txo\napplication/vnd.oma.dd2+xml\t\t\tdd2\napplication/vnd.openofficeorg.extension\t\toxt\napplication/vnd.openxmlformats-officedocument.presentationml.presentation\tpptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide\tsldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow\tppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template\tpotx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet\txlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template\txltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document\tdocx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template\tdotx\napplication/vnd.osgeo.mapguide.package\t\tmgp\napplication/vnd.osgi.dp\t\t\t\tdp\napplication/vnd.osgi.subsystem\t\t\tesa\napplication/vnd.palm\t\t\t\tpdb pqa oprc\napplication/vnd.pawaafile\t\t\tpaw\napplication/vnd.pg.format\t\t\tstr\napplication/vnd.pg.osasli\t\t\tei6\napplication/vnd.picsel\t\t\t\tefif\napplication/vnd.pmi.widget\t\t\twg\napplication/vnd.pocketlearn\t\t\tplf\napplication/vnd.powerbuilder6\t\t\tpbd\napplication/vnd.previewsystems.box\t\tbox\napplication/vnd.proteus.magazine\t\tmgz\napplication/vnd.publishare-delta-tree\t\tqps\napplication/vnd.pvi.ptid1\t\t\tptid\napplication/vnd.quark.quarkxpress\t\tqxd qxt qwd qwt qxl qxb\napplication/vnd.realvnc.bed\t\t\tbed\napplication/vnd.recordare.musicxml\t\tmxl\napplication/vnd.recordare.musicxml+xml\t\tmusicxml\napplication/vnd.rig.cryptonote\t\t\tcryptonote\napplication/vnd.rim.cod\t\t\t\tcod\napplication/vnd.rn-realmedia\t\t\trm\napplication/vnd.rn-realmedia-vbr\t\trmvb\napplication/vnd.route66.link66+xml\t\tlink66\napplication/vnd.sailingtracker.track\t\tst\napplication/vnd.seemail\t\t\t\tsee\napplication/vnd.sema\t\t\t\tsema\napplication/vnd.semd\t\t\t\tsemd\napplication/vnd.semf\t\t\t\tsemf\napplication/vnd.shana.informed.formdata\t\tifm\napplication/vnd.shana.informed.formtemplate\titp\napplication/vnd.shana.informed.interchange\tiif\napplication/vnd.shana.informed.package\t\tipk\napplication/vnd.simtech-mindmapper\t\ttwd twds\napplication/vnd.smaf\t\t\t\tmmf\napplication/vnd.smart.teacher\t\t\tteacher\napplication/vnd.solent.sdkm+xml\t\t\tsdkm sdkd\napplication/vnd.spotfire.dxp\t\t\tdxp\napplication/vnd.spotfire.sfs\t\t\tsfs\napplication/vnd.stardivision.calc\t\tsdc\napplication/vnd.stardivision.draw\t\tsda\napplication/vnd.stardivision.impress\t\tsdd\napplication/vnd.stardivision.math\t\tsmf\napplication/vnd.stardivision.writer\t\tsdw vor\napplication/vnd.stardivision.writer-global\tsgl\napplication/vnd.stepmania.package\t\tsmzip\napplication/vnd.stepmania.stepchart\t\tsm\napplication/vnd.sun.xml.calc\t\t\tsxc\napplication/vnd.sun.xml.calc.template\t\tstc\napplication/vnd.sun.xml.draw\t\t\tsxd\napplication/vnd.sun.xml.draw.template\t\tstd\napplication/vnd.sun.xml.impress\t\t\tsxi\napplication/vnd.sun.xml.impress.template\tsti\napplication/vnd.sun.xml.math\t\t\tsxm\napplication/vnd.sun.xml.writer\t\t\tsxw\napplication/vnd.sun.xml.writer.global\t\tsxg\napplication/vnd.sun.xml.writer.template\t\tstw\napplication/vnd.sus-calendar\t\t\tsus susp\napplication/vnd.svd\t\t\t\tsvd\napplication/vnd.symbian.install\t\t\tsis sisx\napplication/vnd.syncml+xml\t\t\txsm\napplication/vnd.syncml.dm+wbxml\t\t\tbdm\napplication/vnd.syncml.dm+xml\t\t\txdm\napplication/vnd.tao.intent-module-archive\ttao\napplication/vnd.tcpdump.pcap\t\t\tpcap cap dmp\napplication/vnd.tmobile-livetv\t\t\ttmo\napplication/vnd.trid.tpt\t\t\ttpt\napplication/vnd.triscape.mxs\t\t\tmxs\napplication/vnd.trueapp\t\t\t\ttra\napplication/vnd.ufdl\t\t\t\tufd ufdl\napplication/vnd.uiq.theme\t\t\tutz\napplication/vnd.umajin\t\t\t\tumj\napplication/vnd.unity\t\t\t\tunityweb\napplication/vnd.uoml+xml\t\t\tuoml\napplication/vnd.vcx\t\t\t\tvcx\napplication/vnd.visio\t\t\t\tvsd vst vss vsw\napplication/vnd.visionary\t\t\tvis\napplication/vnd.vsf\t\t\t\tvsf\napplication/vnd.wap.wbxml\t\t\twbxml\napplication/vnd.wap.wmlc\t\t\twmlc\napplication/vnd.wap.wmlscriptc\t\t\twmlsc\napplication/vnd.webturbo\t\t\twtb\napplication/vnd.wolfram.player\t\t\tnbp\napplication/vnd.wordperfect\t\t\twpd\napplication/vnd.wqd\t\t\t\twqd\napplication/vnd.wt.stf\t\t\t\tstf\napplication/vnd.xara\t\t\t\txar\napplication/vnd.xfdl\t\t\t\txfdl\napplication/vnd.yamaha.hv-dic\t\t\thvd\napplication/vnd.yamaha.hv-script\t\thvs\napplication/vnd.yamaha.hv-voice\t\t\thvp\napplication/vnd.yamaha.openscoreformat\t\t\tosf\napplication/vnd.yamaha.openscoreformat.osfpvg+xml\tosfpvg\napplication/vnd.yamaha.smaf-audio\t\tsaf\napplication/vnd.yamaha.smaf-phrase\t\tspf\napplication/vnd.yellowriver-custom-menu\t\tcmp\napplication/vnd.zul\t\t\t\tzir zirz\napplication/vnd.zzazz.deck+xml\t\t\tzaz\napplication/voicexml+xml\t\t\tvxml\napplication/widget\t\t\t\twgt\napplication/winhlp\t\t\t\thlp\napplication/wsdl+xml\t\t\t\twsdl\napplication/wspolicy+xml\t\t\twspolicy\napplication/x-7z-compressed\t\t\t7z\napplication/x-abiword\t\t\t\tabw\napplication/x-ace-compressed\t\t\tace\napplication/x-apple-diskimage\t\t\tdmg\napplication/x-authorware-bin\t\t\taab x32 u32 vox\napplication/x-authorware-map\t\t\taam\napplication/x-authorware-seg\t\t\taas\napplication/x-bcpio\t\t\t\tbcpio\napplication/x-bittorrent\t\t\ttorrent\napplication/x-blorb\t\t\t\tblb blorb\napplication/x-bzip\t\t\t\tbz\napplication/x-bzip2\t\t\t\tbz2 boz\napplication/x-cbr\t\t\t\tcbr cba cbt cbz cb7\napplication/x-cdlink\t\t\t\tvcd\napplication/x-cfs-compressed\t\t\tcfs\napplication/x-chat\t\t\t\tchat\napplication/x-chess-pgn\t\t\t\tpgn\napplication/x-conference\t\t\tnsc\napplication/x-cpio\t\t\t\tcpio\napplication/x-csh\t\t\t\tcsh\napplication/x-debian-package\t\t\tdeb udeb\napplication/x-dgc-compressed\t\t\tdgc\napplication/x-director\t\t\tdir dcr dxr cst cct cxt w3d fgd swa\napplication/x-doom\t\t\t\twad\napplication/x-dtbncx+xml\t\t\tncx\napplication/x-dtbook+xml\t\t\tdtb\napplication/x-dtbresource+xml\t\t\tres\napplication/x-dvi\t\t\t\tdvi\napplication/x-envoy\t\t\t\tevy\napplication/x-eva\t\t\t\teva\napplication/x-font-bdf\t\t\t\tbdf\napplication/x-font-ghostscript\t\t\tgsf\napplication/x-font-linux-psf\t\t\tpsf\napplication/x-font-pcf\t\t\t\tpcf\napplication/x-font-snf\t\t\t\tsnf\napplication/x-font-type1\t\t\tpfa pfb pfm afm\napplication/x-freearc\t\t\t\tarc\napplication/x-futuresplash\t\t\tspl\napplication/x-gca-compressed\t\t\tgca\napplication/x-glulx\t\t\t\tulx\napplication/x-gnumeric\t\t\t\tgnumeric\napplication/x-gramps-xml\t\t\tgramps\napplication/x-gtar\t\t\t\tgtar\napplication/x-hdf\t\t\t\thdf\napplication/x-install-instructions\t\tinstall\napplication/x-iso9660-image\t\t\tiso\napplication/x-java-jnlp-file\t\t\tjnlp\napplication/x-latex\t\t\t\tlatex\napplication/x-lzh-compressed\t\t\tlzh lha\napplication/x-mie\t\t\t\tmie\napplication/x-mobipocket-ebook\t\t\tprc mobi\napplication/x-ms-application\t\t\tapplication\napplication/x-ms-shortcut\t\t\tlnk\napplication/x-ms-wmd\t\t\t\twmd\napplication/x-ms-wmz\t\t\t\twmz\napplication/x-ms-xbap\t\t\t\txbap\napplication/x-msaccess\t\t\t\tmdb\napplication/x-msbinder\t\t\t\tobd\napplication/x-mscardfile\t\t\tcrd\napplication/x-msclip\t\t\t\tclp\napplication/x-msdownload\t\t\texe dll com bat msi\napplication/x-msmediaview\t\t\tmvb m13 m14\napplication/x-msmetafile\t\t\twmf wmz emf emz\napplication/x-msmoney\t\t\t\tmny\napplication/x-mspublisher\t\t\tpub\napplication/x-msschedule\t\t\tscd\napplication/x-msterminal\t\t\ttrm\napplication/x-mswrite\t\t\t\twri\napplication/x-netcdf\t\t\t\tnc cdf\napplication/x-nzb\t\t\t\tnzb\napplication/x-pkcs12\t\t\t\tp12 pfx\napplication/x-pkcs7-certificates\t\tp7b spc\napplication/x-pkcs7-certreqresp\t\t\tp7r\napplication/x-rar-compressed\t\t\trar\napplication/x-research-info-systems\t\tris\napplication/x-sh\t\t\t\tsh\napplication/x-shar\t\t\t\tshar\napplication/x-shockwave-flash\t\t\tswf\napplication/x-silverlight-app\t\t\txap\napplication/x-sql\t\t\t\tsql\napplication/x-stuffit\t\t\t\tsit\napplication/x-stuffitx\t\t\t\tsitx\napplication/x-subrip\t\t\t\tsrt\napplication/x-sv4cpio\t\t\t\tsv4cpio\napplication/x-sv4crc\t\t\t\tsv4crc\napplication/x-t3vm-image\t\t\tt3\napplication/x-tads\t\t\t\tgam\napplication/x-tar\t\t\t\ttar\napplication/x-tcl\t\t\t\ttcl\napplication/x-tex\t\t\t\ttex\napplication/x-tex-tfm\t\t\t\ttfm\napplication/x-texinfo\t\t\t\ttexinfo texi\napplication/x-tgif\t\t\t\tobj\napplication/x-ustar\t\t\t\tustar\napplication/x-wais-source\t\t\tsrc\napplication/x-x509-ca-cert\t\t\tder crt\napplication/x-xfig\t\t\t\tfig\napplication/x-xliff+xml\t\t\t\txlf\napplication/x-xpinstall\t\t\t\txpi\napplication/x-xz\t\t\t\txz\napplication/x-zmachine\t\t\t\tz1 z2 z3 z4 z5 z6 z7 z8\napplication/xaml+xml\t\t\t\txaml\napplication/xcap-diff+xml\t\t\txdf\napplication/xenc+xml\t\t\t\txenc\napplication/xhtml+xml\t\t\t\txhtml xht\napplication/xml\t\t\t\t\txml xsl\napplication/xml-dtd\t\t\t\tdtd\napplication/xop+xml\t\t\t\txop\napplication/xproc+xml\t\t\t\txpl\napplication/xslt+xml\t\t\t\txslt\napplication/xspf+xml\t\t\t\txspf\napplication/xv+xml\t\t\t\tmxml xhvml xvml xvm\napplication/yang\t\t\t\tyang\napplication/yin+xml\t\t\t\tyin\napplication/zip\t\t\t\t\tzip\naudio/adpcm\t\t\t\t\tadp\naudio/basic\t\t\t\t\tau snd\naudio/midi\t\t\t\t\tmid midi kar rmi\naudio/mp4\t\t\t\t\tm4a mp4a\naudio/mpeg\t\t\t\t\tmpga mp2 mp2a mp3 m2a m3a\naudio/ogg\t\t\t\t\toga ogg spx\naudio/s3m\t\t\t\t\ts3m\naudio/silk\t\t\t\t\tsil\naudio/vnd.dece.audio\t\t\t\tuva uvva\naudio/vnd.digital-winds\t\t\t\teol\naudio/vnd.dra\t\t\t\t\tdra\naudio/vnd.dts\t\t\t\t\tdts\naudio/vnd.dts.hd\t\t\t\tdtshd\naudio/vnd.lucent.voice\t\t\t\tlvp\naudio/vnd.ms-playready.media.pya\t\tpya\naudio/vnd.nuera.ecelp4800\t\t\tecelp4800\naudio/vnd.nuera.ecelp7470\t\t\tecelp7470\naudio/vnd.nuera.ecelp9600\t\t\tecelp9600\naudio/vnd.rip\t\t\t\t\trip\naudio/webm\t\t\t\t\tweba\naudio/x-aac\t\t\t\t\taac\naudio/x-aiff\t\t\t\t\taif aiff aifc\naudio/x-caf\t\t\t\t\tcaf\naudio/x-flac\t\t\t\t\tflac\naudio/x-matroska\t\t\t\tmka\naudio/x-mpegurl\t\t\t\t\tm3u\naudio/x-ms-wax\t\t\t\t\twax\naudio/x-ms-wma\t\t\t\t\twma\naudio/x-pn-realaudio\t\t\t\tram ra\naudio/x-pn-realaudio-plugin\t\t\trmp\naudio/x-wav\t\t\t\t\twav\naudio/xm\t\t\t\t\txm\nchemical/x-cdx\t\t\t\t\tcdx\nchemical/x-cif\t\t\t\t\tcif\nchemical/x-cmdf\t\t\t\t\tcmdf\nchemical/x-cml\t\t\t\t\tcml\nchemical/x-csml\t\t\t\t\tcsml\nchemical/x-xyz\t\t\t\t\txyz\nfont/collection\t\t\t\t\tttc\nfont/otf\t\t\t\t\totf\nfont/ttf\t\t\t\t\tttf\nfont/woff\t\t\t\t\twoff\nfont/woff2\t\t\t\t\twoff2\nimage/bmp\t\t\t\t\tbmp\nimage/cgm\t\t\t\t\tcgm\nimage/g3fax\t\t\t\t\tg3\nimage/gif\t\t\t\t\tgif\nimage/ief\t\t\t\t\tief\nimage/jpeg\t\t\t\t\tjpeg jpg jpe\nimage/ktx\t\t\t\t\tktx\nimage/png\t\t\t\t\tpng\nimage/prs.btif\t\t\t\t\tbtif\nimage/sgi\t\t\t\t\tsgi\nimage/svg+xml\t\t\t\t\tsvg svgz\nimage/tiff\t\t\t\t\ttiff tif\nimage/vnd.adobe.photoshop\t\t\tpsd\nimage/vnd.dece.graphic\t\t\t\tuvi uvvi uvg uvvg\nimage/vnd.djvu\t\t\t\t\tdjvu djv\nimage/vnd.dvb.subtitle\t\t\t\tsub\nimage/vnd.dwg\t\t\t\t\tdwg\nimage/vnd.dxf\t\t\t\t\tdxf\nimage/vnd.fastbidsheet\t\t\t\tfbs\nimage/vnd.fpx\t\t\t\t\tfpx\nimage/vnd.fst\t\t\t\t\tfst\nimage/vnd.fujixerox.edmics-mmr\t\t\tmmr\nimage/vnd.fujixerox.edmics-rlc\t\t\trlc\nimage/vnd.ms-modi\t\t\t\tmdi\nimage/vnd.ms-photo\t\t\t\twdp\nimage/vnd.net-fpx\t\t\t\tnpx\nimage/vnd.wap.wbmp\t\t\t\twbmp\nimage/vnd.xiff\t\t\t\t\txif\nimage/webp\t\t\t\t\twebp\nimage/x-3ds\t\t\t\t\t3ds\nimage/x-cmu-raster\t\t\t\tras\nimage/x-cmx\t\t\t\t\tcmx\nimage/x-freehand\t\t\t\tfh fhc fh4 fh5 fh7\nimage/x-icon\t\t\t\t\tico\nimage/x-mrsid-image\t\t\t\tsid\nimage/x-pcx\t\t\t\t\tpcx\nimage/x-pict\t\t\t\t\tpic pct\nimage/x-portable-anymap\t\t\t\tpnm\nimage/x-portable-bitmap\t\t\t\tpbm\nimage/x-portable-graymap\t\t\tpgm\nimage/x-portable-pixmap\t\t\t\tppm\nimage/x-rgb\t\t\t\t\trgb\nimage/x-tga\t\t\t\t\ttga\nimage/x-xbitmap\t\t\t\t\txbm\nimage/x-xpixmap\t\t\t\t\txpm\nimage/x-xwindowdump\t\t\t\txwd\nmessage/rfc822\t\t\t\t\teml mime\nmodel/iges\t\t\t\t\tigs iges\nmodel/mesh\t\t\t\t\tmsh mesh silo\nmodel/vnd.collada+xml\t\t\t\tdae\nmodel/vnd.dwf\t\t\t\t\tdwf\nmodel/vnd.gdl\t\t\t\t\tgdl\nmodel/vnd.gtw\t\t\t\t\tgtw\nmodel/vnd.mts\t\t\t\t\tmts\nmodel/vnd.vtu\t\t\t\t\tvtu\nmodel/vrml\t\t\t\t\twrl vrml\nmodel/x3d+binary\t\t\t\tx3db x3dbz\nmodel/x3d+vrml\t\t\t\t\tx3dv x3dvz\nmodel/x3d+xml\t\t\t\t\tx3d x3dz\ntext/cache-manifest\t\t\t\tappcache\ntext/calendar\t\t\t\t\tics ifb\ntext/css\t\t\t\t\tcss\ntext/csv\t\t\t\t\tcsv\ntext/html\t\t\t\t\thtml htm\ntext/n3\t\t\t\t\t\tn3\ntext/plain\t\t\t\t\ttxt text conf def list log in\ntext/prs.lines.tag\t\t\t\tdsc\ntext/richtext\t\t\t\t\trtx\ntext/sgml\t\t\t\t\tsgml sgm\ntext/tab-separated-values\t\t\ttsv\ntext/troff\t\t\t\t\tt tr roff man me ms\ntext/turtle\t\t\t\t\tttl\ntext/uri-list\t\t\t\t\turi uris urls\ntext/vcard\t\t\t\t\tvcard\ntext/vnd.curl\t\t\t\t\tcurl\ntext/vnd.curl.dcurl\t\t\t\tdcurl\ntext/vnd.curl.mcurl\t\t\t\tmcurl\ntext/vnd.curl.scurl\t\t\t\tscurl\ntext/vnd.dvb.subtitle\t\t\t\tsub\ntext/vnd.fly\t\t\t\t\tfly\ntext/vnd.fmi.flexstor\t\t\t\tflx\ntext/vnd.graphviz\t\t\t\tgv\ntext/vnd.in3d.3dml\t\t\t\t3dml\ntext/vnd.in3d.spot\t\t\t\tspot\ntext/vnd.sun.j2me.app-descriptor\t\tjad\ntext/vnd.wap.wml\t\t\t\twml\ntext/vnd.wap.wmlscript\t\t\t\twmls\ntext/x-asm\t\t\t\t\ts asm\ntext/x-c\t\t\t\t\tc cc cxx cpp h hh dic\ntext/x-fortran\t\t\t\t\tf for f77 f90\ntext/x-java-source\t\t\t\tjava\ntext/x-nfo\t\t\t\t\tnfo\ntext/x-opml\t\t\t\t\topml\ntext/x-pascal\t\t\t\t\tp pas\ntext/x-setext\t\t\t\t\tetx\ntext/x-sfv\t\t\t\t\tsfv\ntext/x-uuencode\t\t\t\t\tuu\ntext/x-vcalendar\t\t\t\tvcs\ntext/x-vcard\t\t\t\t\tvcf\nvideo/3gpp\t\t\t\t\t3gp\nvideo/3gpp2\t\t\t\t\t3g2\nvideo/h261\t\t\t\t\th261\nvideo/h263\t\t\t\t\th263\nvideo/h264\t\t\t\t\th264\nvideo/jpeg\t\t\t\t\tjpgv\nvideo/jpm\t\t\t\t\tjpm jpgm\nvideo/mj2\t\t\t\t\tmj2 mjp2\nvideo/mp4\t\t\t\t\tmp4 mp4v mpg4\nvideo/mpeg\t\t\t\t\tmpeg mpg mpe m1v m2v\nvideo/ogg\t\t\t\t\togv\nvideo/quicktime\t\t\t\t\tqt mov\nvideo/vnd.dece.hd\t\t\t\tuvh uvvh\nvideo/vnd.dece.mobile\t\t\t\tuvm uvvm\nvideo/vnd.dece.pd\t\t\t\tuvp uvvp\nvideo/vnd.dece.sd\t\t\t\tuvs uvvs\nvideo/vnd.dece.video\t\t\t\tuvv uvvv\nvideo/vnd.dvb.file\t\t\t\tdvb\nvideo/vnd.fvt\t\t\t\t\tfvt\nvideo/vnd.mpegurl\t\t\t\tmxu m4u\nvideo/vnd.ms-playready.media.pyv\t\tpyv\nvideo/vnd.uvvu.mp4\t\t\t\tuvu uvvu\nvideo/vnd.vivo\t\t\t\t\tviv\nvideo/webm\t\t\t\t\twebm\nvideo/x-f4v\t\t\t\t\tf4v\nvideo/x-fli\t\t\t\t\tfli\nvideo/x-flv\t\t\t\t\tflv\nvideo/x-m4v\t\t\t\t\tm4v\nvideo/x-matroska\t\t\t\tmkv mk3d mks\nvideo/x-mng\t\t\t\t\tmng\nvideo/x-ms-asf\t\t\t\t\tasf asx\nvideo/x-ms-vob\t\t\t\t\tvob\nvideo/x-ms-wm\t\t\t\t\twm\nvideo/x-ms-wmv\t\t\t\t\twmv\nvideo/x-ms-wmx\t\t\t\t\twmx\nvideo/x-ms-wvx\t\t\t\t\twvx\nvideo/x-msvideo\t\t\t\t\tavi\nvideo/x-sgi-movie\t\t\t\tmovie\nvideo/x-smv\t\t\t\t\tsmv\nx-conference/x-cooltalk\t\t\t\tice\n";

const map = new Map();

mime_raw.split('\n').forEach((row) => {
	const match = /(.+?)\t+(.+)/.exec(row);
	if (!match) return;

	const type = match[1];
	const extensions = match[2].split(' ');

	extensions.forEach(ext => {
		map.set(ext, type);
	});
});

function lookup$1(file) {
	const match = /\.([^\.]+)$/.exec(file);
	return match && map.get(match[1]);
}

function middleware(opts


 = {}) {
	const { session, ignore } = opts;

	let emitted_basepath = false;

	return compose_handlers(ignore, [
		(req, res, next) => {
			if (req.baseUrl === undefined) {
				let { originalUrl } = req;
				if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
					originalUrl += '/';
				}

				req.baseUrl = originalUrl
					? originalUrl.slice(0, -req.url.length)
					: '';
			}

			if (!emitted_basepath && process.send) {
				process.send({
					__sapper__: true,
					event: 'basepath',
					basepath: req.baseUrl
				});

				emitted_basepath = true;
			}

			if (req.path === undefined) {
				req.path = req.url.replace(/\?.*/, '');
			}

			next();
		},

		fs.existsSync(path.join(build_dir, 'service-worker.js')) && serve({
			pathname: '/service-worker.js',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		fs.existsSync(path.join(build_dir, 'service-worker.js.map')) && serve({
			pathname: '/service-worker.js.map',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		serve({
			prefix: '/client/',
			cache_control:  'no-cache' 
		}),

		get_server_route_handler(manifest.server_routes),

		get_page_handler(manifest, session || noop$1)
	].filter(Boolean));
}

function compose_handlers(ignore, handlers) {
	const total = handlers.length;

	function nth_handler(n, req, res, next) {
		if (n >= total) {
			return next();
		}

		handlers[n](req, res, () => nth_handler(n+1, req, res, next));
	}

	return !ignore
		? (req, res, next) => nth_handler(0, req, res, next)
		: (req, res, next) => {
			if (should_ignore(req.path, ignore)) {
				next();
			} else {
				nth_handler(0, req, res, next);
			}
		};
}

function should_ignore(uri, val) {
	if (Array.isArray(val)) return val.some(x => should_ignore(uri, x));
	if (val instanceof RegExp) return val.test(uri);
	if (typeof val === 'function') return val(uri);
	return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}

function serve({ prefix, pathname, cache_control }



) {
	const filter = pathname
		? (req) => req.path === pathname
		: (req) => req.path.startsWith(prefix);

	const read =  (file) => fs.readFileSync(path.join(build_dir, file))
		;

	return (req, res, next) => {
		if (filter(req)) {
			const type = lookup$1(req.path);

			try {
				const file = path.posix.normalize(decodeURIComponent(req.path));
				const data = read(file);

				res.setHeader('Content-Type', type);
				res.setHeader('Cache-Control', cache_control);
				res.end(data);
			} catch (err) {
				res.statusCode = 404;
				res.end('not found');
			}
		} else {
			next();
		}
	};
}

function noop$1(){}

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL2Jsb2cvX3Bvc3RzLmpzIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9ibG9nL2luZGV4Lmpzb24uanMiLCIuLi8uLi8uLi9zcmMvcm91dGVzL2Jsb2cvW3NsdWddLmpzb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jbHN4L2Rpc3QvY2xzeC5tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWJJdGVtLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NhcmRCb2R5LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZEhlYWRlci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NhcmRUZXh0LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZEZvb3Rlci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL1RhYmxlLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0Rhc2hib2FyZENhcmQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQ3VzdG9tQ2FyZC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJsZS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DaGFydHMvQXJlYUNoYXJ0LnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL2luZGV4LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRm9ybS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0Zvcm1Hcm91cC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0xhYmVsLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DaGFydHMvUGllQ2hhcnQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9jaGFydHMuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Db250YWluZXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9wYWdlcy9fbGF5b3V0LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ29sLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL3BhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9ibG9nL2luZGV4LnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvYmxvZy9bc2x1Z10uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy91aS9fbGF5b3V0LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvTmF2YmFyLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvTmF2YmFyQnJhbmQuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Db2xsYXBzZS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL3N0b3JlL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Db250ZXh0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL1VuY29udHJvbGxlZERyb3Bkb3duLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Ub2dnbGUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bk1lbnUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9MaXN0R3JvdXAuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXRHcm91cEFkZG9uLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL05hdmJhci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaWRlYmFySXRlbS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaWRlYmFyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19lcnJvci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvbWFuaWZlc3Qtc2VydmVyLm1qcyIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9zaGFyZWQubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL0FwcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvc2VydmVyLm1qcyIsIi4uLy4uLy4uL3NyYy9zZXJ2ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gT3JkaW5hcmlseSwgeW91J2QgZ2VuZXJhdGUgdGhpcyBkYXRhIGZyb20gbWFya2Rvd24gZmlsZXMgaW4geW91clxyXG4vLyByZXBvLCBvciBmZXRjaCB0aGVtIGZyb20gYSBkYXRhYmFzZSBvZiBzb21lIGtpbmQuIEJ1dCBpbiBvcmRlciB0b1xyXG4vLyBhdm9pZCB1bm5lY2Vzc2FyeSBkZXBlbmRlbmNpZXMgaW4gdGhlIHN0YXJ0ZXIgdGVtcGxhdGUsIGFuZCBpbiB0aGVcclxuLy8gc2VydmljZSBvZiBvYnZpb3VzbmVzcywgd2UncmUganVzdCBnb2luZyB0byBsZWF2ZSBpdCBoZXJlLlxyXG5cclxuLy8gVGhpcyBmaWxlIGlzIGNhbGxlZCBgX3Bvc3RzLmpzYCByYXRoZXIgdGhhbiBgcG9zdHMuanNgLCBiZWNhdXNlXHJcbi8vIHdlIGRvbid0IHdhbnQgdG8gY3JlYXRlIGFuIGAvYmxvZy9wb3N0c2Agcm91dGUg4oCUIHRoZSBsZWFkaW5nXHJcbi8vIHVuZGVyc2NvcmUgdGVsbHMgU2FwcGVyIG5vdCB0byBkbyB0aGF0LlxyXG5cclxuY29uc3QgcG9zdHMgPSBbXHJcblx0e1xyXG5cdFx0dGl0bGU6ICdXaGF0IGlzIFNhcHBlcj8nLFxyXG5cdFx0c2x1ZzogJ3doYXQtaXMtc2FwcGVyJyxcclxuXHRcdGh0bWw6IGBcclxuXHRcdFx0PHA+Rmlyc3QsIHlvdSBoYXZlIHRvIGtub3cgd2hhdCA8YSBocmVmPSdodHRwczovL3N2ZWx0ZS5kZXYnPlN2ZWx0ZTwvYT4gaXMuIFN2ZWx0ZSBpcyBhIFVJIGZyYW1ld29yayB3aXRoIGEgYm9sZCBuZXcgaWRlYTogcmF0aGVyIHRoYW4gcHJvdmlkaW5nIGEgbGlicmFyeSB0aGF0IHlvdSB3cml0ZSBjb2RlIHdpdGggKGxpa2UgUmVhY3Qgb3IgVnVlLCBmb3IgZXhhbXBsZSksIGl0J3MgYSBjb21waWxlciB0aGF0IHR1cm5zIHlvdXIgY29tcG9uZW50cyBpbnRvIGhpZ2hseSBvcHRpbWl6ZWQgdmFuaWxsYSBKYXZhU2NyaXB0LiBJZiB5b3UgaGF2ZW4ndCBhbHJlYWR5IHJlYWQgdGhlIDxhIGhyZWY9J2h0dHBzOi8vc3ZlbHRlLmRldi9ibG9nL2ZyYW1ld29ya3Mtd2l0aG91dC10aGUtZnJhbWV3b3JrJz5pbnRyb2R1Y3RvcnkgYmxvZyBwb3N0PC9hPiwgeW91IHNob3VsZCE8L3A+XHJcblxyXG5cdFx0XHQ8cD5TYXBwZXIgaXMgYSBOZXh0LmpzLXN0eWxlIGZyYW1ld29yayAoPGEgaHJlZj0nYmxvZy9ob3ctaXMtc2FwcGVyLWRpZmZlcmVudC1mcm9tLW5leHQnPm1vcmUgb24gdGhhdCBoZXJlPC9hPikgYnVpbHQgYXJvdW5kIFN2ZWx0ZS4gSXQgbWFrZXMgaXQgZW1iYXJyYXNzaW5nbHkgZWFzeSB0byBjcmVhdGUgZXh0cmVtZWx5IGhpZ2ggcGVyZm9ybWFuY2Ugd2ViIGFwcHMuIE91dCBvZiB0aGUgYm94LCB5b3UgZ2V0OjwvcD5cclxuXHJcblx0XHRcdDx1bD5cclxuXHRcdFx0XHQ8bGk+Q29kZS1zcGxpdHRpbmcsIGR5bmFtaWMgaW1wb3J0cyBhbmQgaG90IG1vZHVsZSByZXBsYWNlbWVudCwgcG93ZXJlZCBieSB3ZWJwYWNrPC9saT5cclxuXHRcdFx0XHQ8bGk+U2VydmVyLXNpZGUgcmVuZGVyaW5nIChTU1IpIHdpdGggY2xpZW50LXNpZGUgaHlkcmF0aW9uPC9saT5cclxuXHRcdFx0XHQ8bGk+U2VydmljZSB3b3JrZXIgZm9yIG9mZmxpbmUgc3VwcG9ydCwgYW5kIGFsbCB0aGUgUFdBIGJlbGxzIGFuZCB3aGlzdGxlczwvbGk+XHJcblx0XHRcdFx0PGxpPlRoZSBuaWNlc3QgZGV2ZWxvcG1lbnQgZXhwZXJpZW5jZSB5b3UndmUgZXZlciBoYWQsIG9yIHlvdXIgbW9uZXkgYmFjazwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblxyXG5cdFx0XHQ8cD5JdCdzIGltcGxlbWVudGVkIGFzIEV4cHJlc3MgbWlkZGxld2FyZS4gRXZlcnl0aGluZyBpcyBzZXQgdXAgYW5kIHdhaXRpbmcgZm9yIHlvdSB0byBnZXQgc3RhcnRlZCwgYnV0IHlvdSBrZWVwIGNvbXBsZXRlIGNvbnRyb2wgb3ZlciB0aGUgc2VydmVyLCBzZXJ2aWNlIHdvcmtlciwgd2VicGFjayBjb25maWcgYW5kIGV2ZXJ5dGhpbmcgZWxzZSwgc28gaXQncyBhcyBmbGV4aWJsZSBhcyB5b3UgbmVlZCBpdCB0byBiZS48L3A+XHJcblx0XHRgXHJcblx0fSxcclxuXHJcblx0e1xyXG5cdFx0dGl0bGU6ICdIb3cgdG8gdXNlIFNhcHBlcicsXHJcblx0XHRzbHVnOiAnaG93LXRvLXVzZS1zYXBwZXInLFxyXG5cdFx0aHRtbDogYFxyXG5cdFx0XHQ8aDI+U3RlcCBvbmU8L2gyPlxyXG5cdFx0XHQ8cD5DcmVhdGUgYSBuZXcgcHJvamVjdCwgdXNpbmcgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL1JpY2gtSGFycmlzL2RlZ2l0Jz5kZWdpdDwvYT46PC9wPlxyXG5cclxuXHRcdFx0PHByZT48Y29kZT5ucHggZGVnaXQgXCJzdmVsdGVqcy9zYXBwZXItdGVtcGxhdGUjcm9sbHVwXCIgbXktYXBwXHJcblx0XHRcdGNkIG15LWFwcFxyXG5cdFx0XHRucG0gaW5zdGFsbCAjIG9yIHlhcm4hXHJcblx0XHRcdG5wbSBydW4gZGV2XHJcblx0XHRcdDwvY29kZT48L3ByZT5cclxuXHJcblx0XHRcdDxoMj5TdGVwIHR3bzwvaDI+XHJcblx0XHRcdDxwPkdvIHRvIDxhIGhyZWY9J2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCc+bG9jYWxob3N0OjMwMDA8L2E+LiBPcGVuIDxjb2RlPm15LWFwcDwvY29kZT4gaW4geW91ciBlZGl0b3IuIEVkaXQgdGhlIGZpbGVzIGluIHRoZSA8Y29kZT5zcmMvcm91dGVzPC9jb2RlPiBkaXJlY3Rvcnkgb3IgYWRkIG5ldyBvbmVzLjwvcD5cclxuXHJcblx0XHRcdDxoMj5TdGVwIHRocmVlPC9oMj5cclxuXHRcdFx0PHA+Li4uPC9wPlxyXG5cclxuXHRcdFx0PGgyPlN0ZXAgZm91cjwvaDI+XHJcblx0XHRcdDxwPlJlc2lzdCBvdmVyZG9uZSBqb2tlIGZvcm1hdHMuPC9wPlxyXG5cdFx0YFxyXG5cdH0sXHJcblxyXG5cdHtcclxuXHRcdHRpdGxlOiAnV2h5IHRoZSBuYW1lPycsXHJcblx0XHRzbHVnOiAnd2h5LXRoZS1uYW1lJyxcclxuXHRcdGh0bWw6IGBcclxuXHRcdFx0PHA+SW4gd2FyLCB0aGUgc29sZGllcnMgd2hvIGJ1aWxkIGJyaWRnZXMsIHJlcGFpciByb2FkcywgY2xlYXIgbWluZWZpZWxkcyBhbmQgY29uZHVjdCBkZW1vbGl0aW9ucyDigJQgYWxsIHVuZGVyIGNvbWJhdCBjb25kaXRpb25zIOKAlCBhcmUga25vd24gYXMgPGVtPnNhcHBlcnM8L2VtPi48L3A+XHJcblxyXG5cdFx0XHQ8cD5Gb3Igd2ViIGRldmVsb3BlcnMsIHRoZSBzdGFrZXMgYXJlIGdlbmVyYWxseSBsb3dlciB0aGFuIHRob3NlIGZvciBjb21iYXQgZW5naW5lZXJzLiBCdXQgd2UgZmFjZSBvdXIgb3duIGhvc3RpbGUgZW52aXJvbm1lbnQ6IHVuZGVycG93ZXJlZCBkZXZpY2VzLCBwb29yIG5ldHdvcmsgY29ubmVjdGlvbnMsIGFuZCB0aGUgY29tcGxleGl0eSBpbmhlcmVudCBpbiBmcm9udC1lbmQgZW5naW5lZXJpbmcuIFNhcHBlciwgd2hpY2ggaXMgc2hvcnQgZm9yIDxzdHJvbmc+Uzwvc3Ryb25nPnZlbHRlIDxzdHJvbmc+YXBwPC9zdHJvbmc+IG1hazxzdHJvbmc+ZXI8L3N0cm9uZz4sIGlzIHlvdXIgY291cmFnZW91cyBhbmQgZHV0aWZ1bCBhbGx5LjwvcD5cclxuXHRcdGBcclxuXHR9LFxyXG5cclxuXHR7XHJcblx0XHR0aXRsZTogJ0hvdyBpcyBTYXBwZXIgZGlmZmVyZW50IGZyb20gTmV4dC5qcz8nLFxyXG5cdFx0c2x1ZzogJ2hvdy1pcy1zYXBwZXItZGlmZmVyZW50LWZyb20tbmV4dCcsXHJcblx0XHRodG1sOiBgXHJcblx0XHRcdDxwPjxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS96ZWl0L25leHQuanMnPk5leHQuanM8L2E+IGlzIGEgUmVhY3QgZnJhbWV3b3JrIGZyb20gPGEgaHJlZj0naHR0cHM6Ly96ZWl0LmNvJz5aZWl0PC9hPiwgYW5kIGlzIHRoZSBpbnNwaXJhdGlvbiBmb3IgU2FwcGVyLiBUaGVyZSBhcmUgYSBmZXcgbm90YWJsZSBkaWZmZXJlbmNlcywgaG93ZXZlcjo8L3A+XHJcblxyXG5cdFx0XHQ8dWw+XHJcblx0XHRcdFx0PGxpPkl0J3MgcG93ZXJlZCBieSA8YSBocmVmPSdodHRwczovL3N2ZWx0ZS5kZXYnPlN2ZWx0ZTwvYT4gaW5zdGVhZCBvZiBSZWFjdCwgc28gaXQncyBmYXN0ZXIgYW5kIHlvdXIgYXBwcyBhcmUgc21hbGxlcjwvbGk+XHJcblx0XHRcdFx0PGxpPkluc3RlYWQgb2Ygcm91dGUgbWFza2luZywgd2UgZW5jb2RlIHJvdXRlIHBhcmFtZXRlcnMgaW4gZmlsZW5hbWVzLiBGb3IgZXhhbXBsZSwgdGhlIHBhZ2UgeW91J3JlIGxvb2tpbmcgYXQgcmlnaHQgbm93IGlzIDxjb2RlPnNyYy9yb3V0ZXMvYmxvZy9bc2x1Z10uaHRtbDwvY29kZT48L2xpPlxyXG5cdFx0XHRcdDxsaT5BcyB3ZWxsIGFzIHBhZ2VzIChTdmVsdGUgY29tcG9uZW50cywgd2hpY2ggcmVuZGVyIG9uIHNlcnZlciBvciBjbGllbnQpLCB5b3UgY2FuIGNyZWF0ZSA8ZW0+c2VydmVyIHJvdXRlczwvZW0+IGluIHlvdXIgPGNvZGU+cm91dGVzPC9jb2RlPiBkaXJlY3RvcnkuIFRoZXNlIGFyZSBqdXN0IDxjb2RlPi5qczwvY29kZT4gZmlsZXMgdGhhdCBleHBvcnQgZnVuY3Rpb25zIGNvcnJlc3BvbmRpbmcgdG8gSFRUUCBtZXRob2RzLCBhbmQgcmVjZWl2ZSBFeHByZXNzIDxjb2RlPnJlcXVlc3Q8L2NvZGU+IGFuZCA8Y29kZT5yZXNwb25zZTwvY29kZT4gb2JqZWN0cyBhcyBhcmd1bWVudHMuIFRoaXMgbWFrZXMgaXQgdmVyeSBlYXN5IHRvLCBmb3IgZXhhbXBsZSwgYWRkIGEgSlNPTiBBUEkgc3VjaCBhcyB0aGUgb25lIDxhIGhyZWY9J2Jsb2cvaG93LWlzLXNhcHBlci1kaWZmZXJlbnQtZnJvbS1uZXh0Lmpzb24nPnBvd2VyaW5nIHRoaXMgdmVyeSBwYWdlPC9hPjwvbGk+XHJcblx0XHRcdFx0PGxpPkxpbmtzIGFyZSBqdXN0IDxjb2RlPiZsdDthJmd0OzwvY29kZT4gZWxlbWVudHMsIHJhdGhlciB0aGFuIGZyYW1ld29yay1zcGVjaWZpYyA8Y29kZT4mbHQ7TGluayZndDs8L2NvZGU+IGNvbXBvbmVudHMuIFRoYXQgbWVhbnMsIGZvciBleGFtcGxlLCB0aGF0IDxhIGhyZWY9J2Jsb2cvaG93LWNhbi1pLWdldC1pbnZvbHZlZCc+dGhpcyBsaW5rIHJpZ2h0IGhlcmU8L2E+LCBkZXNwaXRlIGJlaW5nIGluc2lkZSBhIGJsb2Igb2YgSFRNTCwgd29ya3Mgd2l0aCB0aGUgcm91dGVyIGFzIHlvdSdkIGV4cGVjdC48L2xpPlxyXG5cdFx0XHQ8L3VsPlxyXG5cdFx0YFxyXG5cdH0sXHJcblxyXG5cdHtcclxuXHRcdHRpdGxlOiAnSG93IGNhbiBJIGdldCBpbnZvbHZlZD8nLFxyXG5cdFx0c2x1ZzogJ2hvdy1jYW4taS1nZXQtaW52b2x2ZWQnLFxyXG5cdFx0aHRtbDogYFxyXG5cdFx0XHQ8cD5XZSdyZSBzbyBnbGFkIHlvdSBhc2tlZCEgQ29tZSBvbiBvdmVyIHRvIHRoZSA8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlJz5TdmVsdGU8L2E+IGFuZCA8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc2FwcGVyJz5TYXBwZXI8L2E+IHJlcG9zLCBhbmQgam9pbiB1cyBpbiB0aGUgPGEgaHJlZj0naHR0cHM6Ly9zdmVsdGUuZGV2L2NoYXQnPkRpc2NvcmQgY2hhdHJvb208L2E+LiBFdmVyeW9uZSBpcyB3ZWxjb21lLCBlc3BlY2lhbGx5IHlvdSE8L3A+XHJcblx0XHRgXHJcblx0fVxyXG5dO1xyXG5cclxucG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuXHRwb3N0Lmh0bWwgPSBwb3N0Lmh0bWwucmVwbGFjZSgvXlxcdHszfS9nbSwgJycpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBvc3RzO1xyXG4iLCJpbXBvcnQgcG9zdHMgZnJvbSAnLi9fcG9zdHMuanMnO1xyXG5cclxuY29uc3QgY29udGVudHMgPSBKU09OLnN0cmluZ2lmeShwb3N0cy5tYXAocG9zdCA9PiB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHRpdGxlOiBwb3N0LnRpdGxlLFxyXG5cdFx0c2x1ZzogcG9zdC5zbHVnXHJcblx0fTtcclxufSkpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldChyZXEsIHJlcykge1xyXG5cdHJlcy53cml0ZUhlYWQoMjAwLCB7XHJcblx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcblx0fSk7XHJcblxyXG5cdHJlcy5lbmQoY29udGVudHMpO1xyXG59IiwiaW1wb3J0IHBvc3RzIGZyb20gJy4vX3Bvc3RzLmpzJztcclxuXHJcbmNvbnN0IGxvb2t1cCA9IG5ldyBNYXAoKTtcclxucG9zdHMuZm9yRWFjaChwb3N0ID0+IHtcclxuXHRsb29rdXAuc2V0KHBvc3Quc2x1ZywgSlNPTi5zdHJpbmdpZnkocG9zdCkpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQocmVxLCByZXMsIG5leHQpIHtcclxuXHQvLyB0aGUgYHNsdWdgIHBhcmFtZXRlciBpcyBhdmFpbGFibGUgYmVjYXVzZVxyXG5cdC8vIHRoaXMgZmlsZSBpcyBjYWxsZWQgW3NsdWddLmpzb24uanNcclxuXHRjb25zdCB7IHNsdWcgfSA9IHJlcS5wYXJhbXM7XHJcblxyXG5cdGlmIChsb29rdXAuaGFzKHNsdWcpKSB7XHJcblx0XHRyZXMud3JpdGVIZWFkKDIwMCwge1xyXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXMuZW5kKGxvb2t1cC5nZXQoc2x1ZykpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXMud3JpdGVIZWFkKDQwNCwge1xyXG5cdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0bWVzc2FnZTogYE5vdCBmb3VuZGBcclxuXHRcdH0pKTtcclxuXHR9XHJcbn1cclxuIiwiZnVuY3Rpb24gbm9vcCgpIHsgfVxuY29uc3QgaWRlbnRpdHkgPSB4ID0+IHg7XG5mdW5jdGlvbiBhc3NpZ24odGFyLCBzcmMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yIChjb25zdCBrIGluIHNyYylcbiAgICAgICAgdGFyW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiB0YXI7XG59XG5mdW5jdGlvbiBpc19wcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBhZGRfbG9jYXRpb24oZWxlbWVudCwgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyKSB7XG4gICAgZWxlbWVudC5fX3N2ZWx0ZV9tZXRhID0ge1xuICAgICAgICBsb2M6IHsgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gcnVuKGZuKSB7XG4gICAgcmV0dXJuIGZuKCk7XG59XG5mdW5jdGlvbiBibGFua19vYmplY3QoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5mdW5jdGlvbiBydW5fYWxsKGZucykge1xuICAgIGZucy5mb3JFYWNoKHJ1bik7XG59XG5mdW5jdGlvbiBpc19mdW5jdGlvbih0aGluZykge1xuICAgIHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBzYWZlX25vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGIgfHwgKChhICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JykgfHwgdHlwZW9mIGEgPT09ICdmdW5jdGlvbicpO1xufVxuZnVuY3Rpb24gbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYjtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX3N0b3JlKHN0b3JlLCBuYW1lKSB7XG4gICAgaWYgKHN0b3JlICE9IG51bGwgJiYgdHlwZW9mIHN0b3JlLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke25hbWV9JyBpcyBub3QgYSBzdG9yZSB3aXRoIGEgJ3N1YnNjcmliZScgbWV0aG9kYCk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3Vic2NyaWJlKHN0b3JlLCAuLi5jYWxsYmFja3MpIHtcbiAgICBpZiAoc3RvcmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG4gICAgY29uc3QgdW5zdWIgPSBzdG9yZS5zdWJzY3JpYmUoLi4uY2FsbGJhY2tzKTtcbiAgICByZXR1cm4gdW5zdWIudW5zdWJzY3JpYmUgPyAoKSA9PiB1bnN1Yi51bnN1YnNjcmliZSgpIDogdW5zdWI7XG59XG5mdW5jdGlvbiBnZXRfc3RvcmVfdmFsdWUoc3RvcmUpIHtcbiAgICBsZXQgdmFsdWU7XG4gICAgc3Vic2NyaWJlKHN0b3JlLCBfID0+IHZhbHVlID0gXykoKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBjb21wb25lbnRfc3Vic2NyaWJlKGNvbXBvbmVudCwgc3RvcmUsIGNhbGxiYWNrKSB7XG4gICAgY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kucHVzaChzdWJzY3JpYmUoc3RvcmUsIGNhbGxiYWNrKSk7XG59XG5mdW5jdGlvbiBjcmVhdGVfc2xvdChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jdHggPSBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pO1xuICAgICAgICByZXR1cm4gZGVmaW5pdGlvblswXShzbG90X2N0eCk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG4gICAgcmV0dXJuIGRlZmluaXRpb25bMV0gJiYgZm5cbiAgICAgICAgPyBhc3NpZ24oJCRzY29wZS5jdHguc2xpY2UoKSwgZGVmaW5pdGlvblsxXShmbihjdHgpKSlcbiAgICAgICAgOiAkJHNjb3BlLmN0eDtcbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NoYW5nZXMoZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGZuKSB7XG4gICAgaWYgKGRlZmluaXRpb25bMl0gJiYgZm4pIHtcbiAgICAgICAgY29uc3QgbGV0cyA9IGRlZmluaXRpb25bMl0oZm4oZGlydHkpKTtcbiAgICAgICAgaWYgKHR5cGVvZiAkJHNjb3BlLmRpcnR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gW107XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBNYXRoLm1heCgkJHNjb3BlLmRpcnR5Lmxlbmd0aCwgbGV0cy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZFtpXSA9ICQkc2NvcGUuZGlydHlbaV0gfCBsZXRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJCRzY29wZS5kaXJ0eSB8IGxldHM7XG4gICAgfVxuICAgIHJldHVybiAkJHNjb3BlLmRpcnR5O1xufVxuZnVuY3Rpb24gZXhjbHVkZV9pbnRlcm5hbF9wcm9wcyhwcm9wcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBwcm9wcylcbiAgICAgICAgaWYgKGtbMF0gIT09ICckJylcbiAgICAgICAgICAgIHJlc3VsdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgbGV0IHJhbiA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAocmFuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByYW4gPSB0cnVlO1xuICAgICAgICBmbi5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuICAgIH07XG59XG5mdW5jdGlvbiBudWxsX3RvX2VtcHR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xufVxuZnVuY3Rpb24gc2V0X3N0b3JlX3ZhbHVlKHN0b3JlLCByZXQsIHZhbHVlID0gcmV0KSB7XG4gICAgc3RvcmUuc2V0KHZhbHVlKTtcbiAgICByZXR1cm4gcmV0O1xufVxuY29uc3QgaGFzX3Byb3AgPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbmZ1bmN0aW9uIGFjdGlvbl9kZXN0cm95ZXIoYWN0aW9uX3Jlc3VsdCkge1xuICAgIHJldHVybiBhY3Rpb25fcmVzdWx0ICYmIGlzX2Z1bmN0aW9uKGFjdGlvbl9yZXN1bHQuZGVzdHJveSkgPyBhY3Rpb25fcmVzdWx0LmRlc3Ryb3kgOiBub29wO1xufVxuXG5jb25zdCBpc19jbGllbnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmxldCBub3cgPSBpc19jbGllbnRcbiAgICA/ICgpID0+IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICAgIDogKCkgPT4gRGF0ZS5ub3coKTtcbmxldCByYWYgPSBpc19jbGllbnQgPyBjYiA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpIDogbm9vcDtcbi8vIHVzZWQgaW50ZXJuYWxseSBmb3IgdGVzdGluZ1xuZnVuY3Rpb24gc2V0X25vdyhmbikge1xuICAgIG5vdyA9IGZuO1xufVxuZnVuY3Rpb24gc2V0X3JhZihmbikge1xuICAgIHJhZiA9IGZuO1xufVxuXG5jb25zdCB0YXNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIHJ1bl90YXNrcyhub3cpIHtcbiAgICB0YXNrcy5mb3JFYWNoKHRhc2sgPT4ge1xuICAgICAgICBpZiAoIXRhc2suYyhub3cpKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgICAgICB0YXNrLmYoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0YXNrcy5zaXplICE9PSAwKVxuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbn1cbi8qKlxuICogRm9yIHRlc3RpbmcgcHVycG9zZXMgb25seSFcbiAqL1xuZnVuY3Rpb24gY2xlYXJfbG9vcHMoKSB7XG4gICAgdGFza3MuY2xlYXIoKTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB0YXNrIHRoYXQgcnVucyBvbiBlYWNoIHJhZiBmcmFtZVxuICogdW50aWwgaXQgcmV0dXJucyBhIGZhbHN5IHZhbHVlIG9yIGlzIGFib3J0ZWRcbiAqL1xuZnVuY3Rpb24gbG9vcChjYWxsYmFjaykge1xuICAgIGxldCB0YXNrO1xuICAgIGlmICh0YXNrcy5zaXplID09PSAwKVxuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlOiBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHtcbiAgICAgICAgICAgIHRhc2tzLmFkZCh0YXNrID0geyBjOiBjYWxsYmFjaywgZjogZnVsZmlsbCB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGFib3J0KCkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xufVxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcbiAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zW2ldKVxuICAgICAgICAgICAgaXRlcmF0aW9uc1tpXS5kKGRldGFjaGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSwgeyBpcyB9KTtcbn1cbmZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzX3Byb3Aob2JqLCBrKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJiYgZXhjbHVkZS5pbmRleE9mKGspID09PSAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0W2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBzdmdfZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIHRleHQoZGF0YSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKTtcbn1cbmZ1bmN0aW9uIHNwYWNlKCkge1xuICAgIHJldHVybiB0ZXh0KCcgJyk7XG59XG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGV4dCgnJyk7XG59XG5mdW5jdGlvbiBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiAoKSA9PiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcHJldmVudF9kZWZhdWx0KGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc3RvcF9wcm9wYWdhdGlvbihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzZWxmKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZSBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0X2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG5vZGUuX19wcm90b19fKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3NzVGV4dCA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZXNjcmlwdG9yc1trZXldICYmIGRlc2NyaXB0b3JzW2tleV0uc2V0KSB7XG4gICAgICAgICAgICBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9zdmdfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBwcm9wLCB2YWx1ZSkge1xuICAgIGlmIChwcm9wIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZVtwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXR0cihub2RlLCBwcm9wLCB2YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24geGxpbmtfYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUoZ3JvdXApIHtcbiAgICBjb25zdCB2YWx1ZSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGdyb3VwW2ldLmNoZWNrZWQpXG4gICAgICAgICAgICB2YWx1ZS5wdXNoKGdyb3VwW2ldLl9fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB0b19udW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICcnID8gdW5kZWZpbmVkIDogK3ZhbHVlO1xufVxuZnVuY3Rpb24gdGltZV9yYW5nZXNfdG9fYXJyYXkocmFuZ2VzKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcnJheS5wdXNoKHsgc3RhcnQ6IHJhbmdlcy5zdGFydChpKSwgZW5kOiByYW5nZXMuZW5kKGkpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5mdW5jdGlvbiBjaGlsZHJlbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZE5vZGVzKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIHN2Zykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2pdO1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC5kYXRhICE9PSBkYXRhKVxuICAgICAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuZnVuY3Rpb24gc2V0X2lucHV0X3ZhbHVlKGlucHV0LCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPSBudWxsIHx8IGlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2lucHV0X3R5cGUoaW5wdXQsIHR5cGUpIHtcbiAgICB0cnkge1xuICAgICAgICBpbnB1dC50eXBlID0gdHlwZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9zdHlsZShub2RlLCBrZXksIHZhbHVlLCBpbXBvcnRhbnQpIHtcbiAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIGltcG9ydGFudCA/ICdpbXBvcnRhbnQnIDogJycpO1xufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbihzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgaWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb25zKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB+dmFsdWUuaW5kZXhPZihvcHRpb24uX192YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X3ZhbHVlKHNlbGVjdCkge1xuICAgIGNvbnN0IHNlbGVjdGVkX29wdGlvbiA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpIHx8IHNlbGVjdC5vcHRpb25zWzBdO1xuICAgIHJldHVybiBzZWxlY3RlZF9vcHRpb24gJiYgc2VsZWN0ZWRfb3B0aW9uLl9fdmFsdWU7XG59XG5mdW5jdGlvbiBzZWxlY3RfbXVsdGlwbGVfdmFsdWUoc2VsZWN0KSB7XG4gICAgcmV0dXJuIFtdLm1hcC5jYWxsKHNlbGVjdC5xdWVyeVNlbGVjdG9yQWxsKCc6Y2hlY2tlZCcpLCBvcHRpb24gPT4gb3B0aW9uLl9fdmFsdWUpO1xufVxuZnVuY3Rpb24gYWRkX3Jlc2l6ZV9saXN0ZW5lcihlbGVtZW50LCBmbikge1xuICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB9XG4gICAgY29uc3Qgb2JqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XG4gICAgb2JqZWN0LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7Jyk7XG4gICAgb2JqZWN0LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIG9iamVjdC50eXBlID0gJ3RleHQvaHRtbCc7XG4gICAgb2JqZWN0LnRhYkluZGV4ID0gLTE7XG4gICAgbGV0IHdpbjtcbiAgICBvYmplY3Qub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB3aW4gPSBvYmplY3QuY29udGVudERvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZm4pO1xuICAgIH07XG4gICAgaWYgKC9UcmlkZW50Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqZWN0KTtcbiAgICAgICAgb2JqZWN0LmRhdGEgPSAnYWJvdXQ6YmxhbmsnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb2JqZWN0LmRhdGEgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNhbmNlbDogKCkgPT4ge1xuICAgICAgICAgICAgd2luICYmIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyICYmIHdpbi5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmbik7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoaHRtbCwgYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmUgPSBlbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5hID0gYW5jaG9yO1xuICAgICAgICB0aGlzLnUoaHRtbCk7XG4gICAgfVxuICAgIG0odGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGFyZ2V0LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ID0gdGFyZ2V0O1xuICAgIH1cbiAgICB1KGh0bWwpIHtcbiAgICAgICAgdGhpcy5lLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgIHRoaXMubiA9IEFycmF5LmZyb20odGhpcy5lLmNoaWxkTm9kZXMpO1xuICAgIH1cbiAgICBwKGh0bWwpIHtcbiAgICAgICAgdGhpcy5kKCk7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICAgICAgdGhpcy5tKHRoaXMudCwgdGhpcy5hKTtcbiAgICB9XG4gICAgZCgpIHtcbiAgICAgICAgdGhpcy5uLmZvckVhY2goZGV0YWNoKTtcbiAgICB9XG59XG5cbmxldCBzdHlsZXNoZWV0O1xubGV0IGFjdGl2ZSA9IDA7XG5sZXQgY3VycmVudF9ydWxlcyA9IHt9O1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rhcmtza3lhcHAvc3RyaW5nLWhhc2gvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgbGV0IGhhc2ggPSA1MzgxO1xuICAgIGxldCBpID0gc3RyLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9ydWxlKG5vZGUsIGEsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzZSwgZm4sIHVpZCA9IDApIHtcbiAgICBjb25zdCBzdGVwID0gMTYuNjY2IC8gZHVyYXRpb247XG4gICAgbGV0IGtleWZyYW1lcyA9ICd7XFxuJztcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8PSAxOyBwICs9IHN0ZXApIHtcbiAgICAgICAgY29uc3QgdCA9IGEgKyAoYiAtIGEpICogZWFzZShwKTtcbiAgICAgICAga2V5ZnJhbWVzICs9IHAgKiAxMDAgKyBgJXske2ZuKHQsIDEgLSB0KX19XFxuYDtcbiAgICB9XG4gICAgY29uc3QgcnVsZSA9IGtleWZyYW1lcyArIGAxMDAlIHske2ZuKGIsIDEgLSBiKX19XFxufWA7XG4gICAgY29uc3QgbmFtZSA9IGBfX3N2ZWx0ZV8ke2hhc2gocnVsZSl9XyR7dWlkfWA7XG4gICAgaWYgKCFjdXJyZW50X3J1bGVzW25hbWVdKSB7XG4gICAgICAgIGlmICghc3R5bGVzaGVldCkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBlbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICBzdHlsZXNoZWV0ID0gc3R5bGUuc2hlZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKVxuICAgICAgICAuc3BsaXQoJywgJylcbiAgICAgICAgLmZpbHRlcihuYW1lXG4gICAgICAgID8gYW5pbSA9PiBhbmltLmluZGV4T2YobmFtZSkgPCAwIC8vIHJlbW92ZSBzcGVjaWZpYyBhbmltYXRpb25cbiAgICAgICAgOiBhbmltID0+IGFuaW0uaW5kZXhPZignX19zdmVsdGUnKSA9PT0gLTEgLy8gcmVtb3ZlIGFsbCBTdmVsdGUgYW5pbWF0aW9uc1xuICAgIClcbiAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgaWYgKG5hbWUgJiYgIS0tYWN0aXZlKVxuICAgICAgICBjbGVhcl9ydWxlcygpO1xufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgICAgIHN0eWxlc2hlZXQuZGVsZXRlUnVsZShpKTtcbiAgICAgICAgY3VycmVudF9ydWxlcyA9IHt9O1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuY29uc3Qgc2Vlbl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50cy5zaGlmdCgpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoY29tcG9uZW50LiQkKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgc2Vlbl9jYWxsYmFja3MuY2xlYXIoKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZSgkJCkge1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAkJC51cGRhdGUoKTtcbiAgICAgICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAgICAgY29uc3QgZGlydHkgPSAkJC5kaXJ0eTtcbiAgICAgICAgJCQuZGlydHkgPSBbLTFdO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5wKCQkLmN0eCwgZGlydHkpO1xuICAgICAgICAkJC5hZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbiAgICB9XG59XG5cbmxldCBwcm9taXNlO1xuZnVuY3Rpb24gd2FpdCgpIHtcbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xubGV0IG91dHJvcztcbmZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcbiAgICBvdXRyb3MgPSB7XG4gICAgICAgIHI6IDAsXG4gICAgICAgIGM6IFtdLFxuICAgICAgICBwOiBvdXRyb3MgLy8gcGFyZW50IGdyb3VwXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcbiAgICBpZiAoIW91dHJvcy5yKSB7XG4gICAgICAgIHJ1bl9hbGwob3V0cm9zLmMpO1xuICAgIH1cbiAgICBvdXRyb3MgPSBvdXRyb3MucDtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcbiAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgYmxvY2suaShsb2NhbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLm8pIHtcbiAgICAgICAgaWYgKG91dHJvaW5nLmhhcyhibG9jaykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG91dHJvaW5nLmFkZChibG9jayk7XG4gICAgICAgIG91dHJvcy5jLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhY2gpXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmQoMSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLm8obG9jYWwpO1xuICAgIH1cbn1cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcbmZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBsZXQgdGFzaztcbiAgICBsZXQgdWlkID0gMDtcbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzLCB1aWQrKyk7XG4gICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRhc2spXG4gICAgICAgICAgICB0YXNrLmFib3J0KCk7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcbiAgICAgICAgdGFzayA9IGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlKTtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBjb25zdCBncm91cCA9IG91dHJvcztcbiAgICBncm91cC5yICs9IDE7XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDEsIDAsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcbiAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1ncm91cC5yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKGdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEgLSB0LCB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnbygpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQocmVzZXQpIHtcbiAgICAgICAgICAgIGlmIChyZXNldCAmJiBjb25maWcudGljaykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50aWNrKDEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCB0ID0gaW50cm8gPyAwIDogMTtcbiAgICBsZXQgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KHByb2dyYW0sIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGQgPSBwcm9ncmFtLmIgLSB0O1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IHByb2dyYW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGFuIGludHJvLCBhbmQgdGhlcmUncyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAvLyBhbiBpbml0aWFsIHRpY2sgYW5kL29yIGFwcGx5IENTUyBhbmltYXRpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGIpXG4gICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBiLCAnc3RhcnQnKSk7XG4gICAgICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdfcHJvZ3JhbSAmJiBub3cgPiBwZW5kaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwZW5kaW5nX3Byb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgcnVubmluZ19wcm9ncmFtLmIsIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbiwgMCwgZWFzaW5nLCBjb25maWcuY3NzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0ID0gcnVubmluZ19wcm9ncmFtLmIsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBlbmRpbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3JlIGRvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZ19wcm9ncmFtLmIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50cm8g4oCUIHdlIGNhbiB0aWR5IHVwIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3V0cm8g4oCUIG5lZWRzIHRvIGJlIGNvb3JkaW5hdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1ydW5uaW5nX3Byb2dyYW0uZ3JvdXAucilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwocnVubmluZ19wcm9ncmFtLmdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHJ1bm5pbmdfcHJvZ3JhbS5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQgPSBydW5uaW5nX3Byb2dyYW0uYSArIHJ1bm5pbmdfcHJvZ3JhbS5kICogZWFzaW5nKHAgLyBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcnVuKGIpIHtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfcHJvbWlzZShwcm9taXNlLCBpbmZvKSB7XG4gICAgY29uc3QgdG9rZW4gPSBpbmZvLnRva2VuID0ge307XG4gICAgZnVuY3Rpb24gdXBkYXRlKHR5cGUsIGluZGV4LCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChpbmZvLnRva2VuICE9PSB0b2tlbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaW5mby5yZXNvbHZlZCA9IHZhbHVlO1xuICAgICAgICBsZXQgY2hpbGRfY3R4ID0gaW5mby5jdHg7XG4gICAgICAgIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hpbGRfY3R4ID0gY2hpbGRfY3R4LnNsaWNlKCk7XG4gICAgICAgICAgICBjaGlsZF9jdHhba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsb2NrID0gdHlwZSAmJiAoaW5mby5jdXJyZW50ID0gdHlwZSkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IG5lZWRzX2ZsdXNoID0gZmFsc2U7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5ibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrcy5mb3JFYWNoKChibG9jaywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0gaW5kZXggJiYgYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmJsb2Nrc1tpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrX291dHJvcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmZvLmJsb2NrLmQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgICAgIGJsb2NrLm0oaW5mby5tb3VudCgpLCBpbmZvLmFuY2hvcik7XG4gICAgICAgICAgICBuZWVkc19mbHVzaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaW5mby5ibG9jayA9IGJsb2NrO1xuICAgICAgICBpZiAoaW5mby5ibG9ja3MpXG4gICAgICAgICAgICBpbmZvLmJsb2Nrc1tpbmRleF0gPSBibG9jaztcbiAgICAgICAgaWYgKG5lZWRzX2ZsdXNoKSB7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChpc19wcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRfY29tcG9uZW50ID0gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCk7XG4gICAgICAgIHByb21pc2UudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY3VycmVudF9jb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGluZm8uY2F0Y2gsIDIsIGluZm8uZXJyb3IsIGVycm9yKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIHdlIHByZXZpb3VzbHkgaGFkIGEgdGhlbi9jYXRjaCBibG9jaywgZGVzdHJveSBpdFxuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnBlbmRpbmcpIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnBlbmRpbmcsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8udGhlbikge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLnJlc29sdmVkID0gcHJvbWlzZTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpO1xuXG5mdW5jdGlvbiBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5kKDEpO1xuICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbn1cbmZ1bmN0aW9uIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuZnVuY3Rpb24gdXBkYXRlX2tleWVkX2VhY2gob2xkX2Jsb2NrcywgZGlydHksIGdldF9rZXksIGR5bmFtaWMsIGN0eCwgbGlzdCwgbG9va3VwLCBub2RlLCBkZXN0cm95LCBjcmVhdGVfZWFjaF9ibG9jaywgbmV4dCwgZ2V0X2NvbnRleHQpIHtcbiAgICBsZXQgbyA9IG9sZF9ibG9ja3MubGVuZ3RoO1xuICAgIGxldCBuID0gbGlzdC5sZW5ndGg7XG4gICAgbGV0IGkgPSBvO1xuICAgIGNvbnN0IG9sZF9pbmRleGVzID0ge307XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgb2xkX2luZGV4ZXNbb2xkX2Jsb2Nrc1tpXS5rZXldID0gaTtcbiAgICBjb25zdCBuZXdfYmxvY2tzID0gW107XG4gICAgY29uc3QgbmV3X2xvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBkZWx0YXMgPSBuZXcgTWFwKCk7XG4gICAgaSA9IG47XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBjaGlsZF9jdHggPSBnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpO1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGNoaWxkX2N0eCk7XG4gICAgICAgIGxldCBibG9jayA9IGxvb2t1cC5nZXQoa2V5KTtcbiAgICAgICAgaWYgKCFibG9jaykge1xuICAgICAgICAgICAgYmxvY2sgPSBjcmVhdGVfZWFjaF9ibG9jayhrZXksIGNoaWxkX2N0eCk7XG4gICAgICAgICAgICBibG9jay5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZHluYW1pYykge1xuICAgICAgICAgICAgYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KTtcbiAgICAgICAgfVxuICAgICAgICBuZXdfbG9va3VwLnNldChrZXksIG5ld19ibG9ja3NbaV0gPSBibG9jayk7XG4gICAgICAgIGlmIChrZXkgaW4gb2xkX2luZGV4ZXMpXG4gICAgICAgICAgICBkZWx0YXMuc2V0KGtleSwgTWF0aC5hYnMoaSAtIG9sZF9pbmRleGVzW2tleV0pKTtcbiAgICB9XG4gICAgY29uc3Qgd2lsbF9tb3ZlID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IGRpZF9tb3ZlID0gbmV3IFNldCgpO1xuICAgIGZ1bmN0aW9uIGluc2VydChibG9jaykge1xuICAgICAgICB0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcbiAgICAgICAgYmxvY2subShub2RlLCBuZXh0KTtcbiAgICAgICAgbG9va3VwLnNldChibG9jay5rZXksIGJsb2NrKTtcbiAgICAgICAgbmV4dCA9IGJsb2NrLmZpcnN0O1xuICAgICAgICBuLS07XG4gICAgfVxuICAgIHdoaWxlIChvICYmIG4pIHtcbiAgICAgICAgY29uc3QgbmV3X2Jsb2NrID0gbmV3X2Jsb2Nrc1tuIC0gMV07XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3NbbyAtIDFdO1xuICAgICAgICBjb25zdCBuZXdfa2V5ID0gbmV3X2Jsb2NrLmtleTtcbiAgICAgICAgY29uc3Qgb2xkX2tleSA9IG9sZF9ibG9jay5rZXk7XG4gICAgICAgIGlmIChuZXdfYmxvY2sgPT09IG9sZF9ibG9jaykge1xuICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgbmV4dCA9IG5ld19ibG9jay5maXJzdDtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgICAgIG4tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBvbGQgYmxvY2tcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFsb29rdXAuaGFzKG5ld19rZXkpIHx8IHdpbGxfbW92ZS5oYXMobmV3X2tleSkpIHtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRpZF9tb3ZlLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlbHRhcy5nZXQobmV3X2tleSkgPiBkZWx0YXMuZ2V0KG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBkaWRfbW92ZS5hZGQobmV3X2tleSk7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbGxfbW92ZS5hZGQob2xkX2tleSk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUgKG8tLSkge1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW29dO1xuICAgICAgICBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9ibG9jay5rZXkpKVxuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgfVxuICAgIHdoaWxlIChuKVxuICAgICAgICBpbnNlcnQobmV3X2Jsb2Nrc1tuIC0gMV0pO1xuICAgIHJldHVybiBuZXdfYmxvY2tzO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfZWFjaF9rZXlzKGN0eCwgbGlzdCwgZ2V0X2NvbnRleHQsIGdldF9rZXkpIHtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBnZXRfa2V5KGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSkpO1xuICAgICAgICBpZiAoa2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaGF2ZSBkdXBsaWNhdGUga2V5cyBpbiBhIGtleWVkIGVhY2hgKTtcbiAgICAgICAgfVxuICAgICAgICBrZXlzLmFkZChrZXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0X3NwcmVhZF91cGRhdGUobGV2ZWxzLCB1cGRhdGVzKSB7XG4gICAgY29uc3QgdXBkYXRlID0ge307XG4gICAgY29uc3QgdG9fbnVsbF9vdXQgPSB7fTtcbiAgICBjb25zdCBhY2NvdW50ZWRfZm9yID0geyAkJHNjb3BlOiAxIH07XG4gICAgbGV0IGkgPSBsZXZlbHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgbyA9IGxldmVsc1tpXTtcbiAgICAgICAgY29uc3QgbiA9IHVwZGF0ZXNbaV07XG4gICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIG4pKVxuICAgICAgICAgICAgICAgICAgICB0b19udWxsX291dFtrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY291bnRlZF9mb3Jba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVba2V5XSA9IG5ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbHNbaV0gPSBuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdG9fbnVsbF9vdXQpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIHVwZGF0ZSkpXG4gICAgICAgICAgICB1cGRhdGVba2V5XSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZTtcbn1cbmZ1bmN0aW9uIGdldF9zcHJlYWRfb2JqZWN0KHNwcmVhZF9wcm9wcykge1xuICAgIHJldHVybiB0eXBlb2Ygc3ByZWFkX3Byb3BzID09PSAnb2JqZWN0JyAmJiBzcHJlYWRfcHJvcHMgIT09IG51bGwgPyBzcHJlYWRfcHJvcHMgOiB7fTtcbn1cblxuLy8gc291cmNlOiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbmRpY2VzLmh0bWxcbmNvbnN0IGJvb2xlYW5fYXR0cmlidXRlcyA9IG5ldyBTZXQoW1xuICAgICdhbGxvd2Z1bGxzY3JlZW4nLFxuICAgICdhbGxvd3BheW1lbnRyZXF1ZXN0JyxcbiAgICAnYXN5bmMnLFxuICAgICdhdXRvZm9jdXMnLFxuICAgICdhdXRvcGxheScsXG4gICAgJ2NoZWNrZWQnLFxuICAgICdjb250cm9scycsXG4gICAgJ2RlZmF1bHQnLFxuICAgICdkZWZlcicsXG4gICAgJ2Rpc2FibGVkJyxcbiAgICAnZm9ybW5vdmFsaWRhdGUnLFxuICAgICdoaWRkZW4nLFxuICAgICdpc21hcCcsXG4gICAgJ2xvb3AnLFxuICAgICdtdWx0aXBsZScsXG4gICAgJ211dGVkJyxcbiAgICAnbm9tb2R1bGUnLFxuICAgICdub3ZhbGlkYXRlJyxcbiAgICAnb3BlbicsXG4gICAgJ3BsYXlzaW5saW5lJyxcbiAgICAncmVhZG9ubHknLFxuICAgICdyZXF1aXJlZCcsXG4gICAgJ3JldmVyc2VkJyxcbiAgICAnc2VsZWN0ZWQnXG5dKTtcblxuY29uc3QgaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIgPSAvW1xccydcIj4vPVxcdXtGREQwfS1cXHV7RkRFRn1cXHV7RkZGRX1cXHV7RkZGRn1cXHV7MUZGRkV9XFx1ezFGRkZGfVxcdXsyRkZGRX1cXHV7MkZGRkZ9XFx1ezNGRkZFfVxcdXszRkZGRn1cXHV7NEZGRkV9XFx1ezRGRkZGfVxcdXs1RkZGRX1cXHV7NUZGRkZ9XFx1ezZGRkZFfVxcdXs2RkZGRn1cXHV7N0ZGRkV9XFx1ezdGRkZGfVxcdXs4RkZGRX1cXHV7OEZGRkZ9XFx1ezlGRkZFfVxcdXs5RkZGRn1cXHV7QUZGRkV9XFx1e0FGRkZGfVxcdXtCRkZGRX1cXHV7QkZGRkZ9XFx1e0NGRkZFfVxcdXtDRkZGRn1cXHV7REZGRkV9XFx1e0RGRkZGfVxcdXtFRkZGRX1cXHV7RUZGRkZ9XFx1e0ZGRkZFfVxcdXtGRkZGRn1cXHV7MTBGRkZFfVxcdXsxMEZGRkZ9XS91O1xuLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc3ludGF4Lmh0bWwjYXR0cmlidXRlcy0yXG4vLyBodHRwczovL2luZnJhLnNwZWMud2hhdHdnLm9yZy8jbm9uY2hhcmFjdGVyXG5mdW5jdGlvbiBzcHJlYWQoYXJncywgY2xhc3Nlc190b19hZGQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmFzc2lnbih7fSwgLi4uYXJncyk7XG4gICAgaWYgKGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmNsYXNzID09IG51bGwpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgPSBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXMuY2xhc3MgKz0gJyAnICsgY2xhc3Nlc190b19hZGQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIGlmIChpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3Rlci50ZXN0KG5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHN0ciArPSBcIiBcIiArIG5hbWU7XG4gICAgICAgIGVsc2UgaWYgKGJvb2xlYW5fYXR0cmlidXRlcy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKVxuICAgICAgICAgICAgICAgIHN0ciArPSBcIiBcIiArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgc3RyICs9IGAgJHtuYW1lfT1cIiR7U3RyaW5nKHZhbHVlKS5yZXBsYWNlKC9cIi9nLCAnJiMzNDsnKS5yZXBsYWNlKC8nL2csICcmIzM5OycpfVwiYDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzdHI7XG59XG5jb25zdCBlc2NhcGVkID0ge1xuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnLFxuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7J1xufTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sKSB7XG4gICAgcmV0dXJuIFN0cmluZyhodG1sKS5yZXBsYWNlKC9bXCInJjw+XS9nLCBtYXRjaCA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5mdW5jdGlvbiBlYWNoKGl0ZW1zLCBmbikge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHN0ciArPSBmbihpdGVtc1tpXSwgaSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5jb25zdCBtaXNzaW5nX2NvbXBvbmVudCA9IHtcbiAgICAkJHJlbmRlcjogKCkgPT4gJydcbn07XG5mdW5jdGlvbiB2YWxpZGF0ZV9jb21wb25lbnQoY29tcG9uZW50LCBuYW1lKSB7XG4gICAgaWYgKCFjb21wb25lbnQgfHwgIWNvbXBvbmVudC4kJHJlbmRlcikge1xuICAgICAgICBpZiAobmFtZSA9PT0gJ3N2ZWx0ZTpjb21wb25lbnQnKVxuICAgICAgICAgICAgbmFtZSArPSAnIHRoaXM9ey4uLn0nO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYDwke25hbWV9PiBpcyBub3QgYSB2YWxpZCBTU1IgY29tcG9uZW50LiBZb3UgbWF5IG5lZWQgdG8gcmV2aWV3IHlvdXIgYnVpbGQgY29uZmlnIHRvIGVuc3VyZSB0aGF0IGRlcGVuZGVuY2llcyBhcmUgY29tcGlsZWQsIHJhdGhlciB0aGFuIGltcG9ydGVkIGFzIHByZS1jb21waWxlZCBtb2R1bGVzYCk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBkZWJ1ZyhmaWxlLCBsaW5lLCBjb2x1bW4sIHZhbHVlcykge1xuICAgIGNvbnNvbGUubG9nKGB7QGRlYnVnfSAke2ZpbGUgPyBmaWxlICsgJyAnIDogJyd9KCR7bGluZX06JHtjb2x1bW59KWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICByZXR1cm4gJyc7XG59XG5sZXQgb25fZGVzdHJveTtcbmZ1bmN0aW9uIGNyZWF0ZV9zc3JfY29tcG9uZW50KGZuKSB7XG4gICAgZnVuY3Rpb24gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICAgICAgY29uc3QgJCQgPSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LFxuICAgICAgICAgICAgY29udGV4dDogbmV3IE1hcChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pLFxuICAgICAgICAgICAgLy8gdGhlc2Ugd2lsbCBiZSBpbW1lZGlhdGVseSBkaXNjYXJkZWRcbiAgICAgICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICAgICAgYWZ0ZXJfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KClcbiAgICAgICAgfTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHsgJCQgfSk7XG4gICAgICAgIGNvbnN0IGh0bWwgPSBmbihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpO1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQocGFyZW50X2NvbXBvbmVudCk7XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICByZW5kZXI6IChwcm9wcyA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3kgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHsgdGl0bGU6ICcnLCBoZWFkOiAnJywgY3NzOiBuZXcgU2V0KCkgfTtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCB7fSwgb3B0aW9ucyk7XG4gICAgICAgICAgICBydW5fYWxsKG9uX2Rlc3Ryb3kpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBodG1sLFxuICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBBcnJheS5mcm9tKHJlc3VsdC5jc3MpLm1hcChjc3MgPT4gY3NzLmNvZGUpLmpvaW4oJ1xcbicpLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG51bGwgLy8gVE9ET1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGVhZDogcmVzdWx0LnRpdGxlICsgcmVzdWx0LmhlYWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgICQkcmVuZGVyXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGFkZF9hdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAoYm9vbGVhbiAmJiAhdmFsdWUpKVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgcmV0dXJuIGAgJHtuYW1lfSR7dmFsdWUgPT09IHRydWUgPyAnJyA6IGA9JHt0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkoZXNjYXBlKHZhbHVlKSkgOiBgXCIke3ZhbHVlfVwiYH1gfWA7XG59XG5mdW5jdGlvbiBhZGRfY2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMgPyBgIGNsYXNzPVwiJHtjbGFzc2VzfVwiYCA6IGBgO1xufVxuXG5mdW5jdGlvbiBiaW5kKGNvbXBvbmVudCwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBpbmRleCA9IGNvbXBvbmVudC4kJC5wcm9wc1tuYW1lXTtcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb21wb25lbnQuJCQuYm91bmRbaW5kZXhdID0gY2FsbGJhY2s7XG4gICAgICAgIGNhbGxiYWNrKGNvbXBvbmVudC4kJC5jdHhbaW5kZXhdKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjcmVhdGVfY29tcG9uZW50KGJsb2NrKSB7XG4gICAgYmxvY2sgJiYgYmxvY2suYygpO1xufVxuZnVuY3Rpb24gY2xhaW1fY29tcG9uZW50KGJsb2NrLCBwYXJlbnRfbm9kZXMpIHtcbiAgICBibG9jayAmJiBibG9jay5sKHBhcmVudF9ub2Rlcyk7XG59XG5mdW5jdGlvbiBtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCB0YXJnZXQsIGFuY2hvcikge1xuICAgIGNvbnN0IHsgZnJhZ21lbnQsIG9uX21vdW50LCBvbl9kZXN0cm95LCBhZnRlcl91cGRhdGUgfSA9IGNvbXBvbmVudC4kJDtcbiAgICBmcmFnbWVudCAmJiBmcmFnbWVudC5tKHRhcmdldCwgYW5jaG9yKTtcbiAgICAvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG4gICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld19vbl9kZXN0cm95ID0gb25fbW91bnQubWFwKHJ1bikuZmlsdGVyKGlzX2Z1bmN0aW9uKTtcbiAgICAgICAgaWYgKG9uX2Rlc3Ryb3kpIHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3kucHVzaCguLi5uZXdfb25fZGVzdHJveSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBFZGdlIGNhc2UgLSBjb21wb25lbnQgd2FzIGRlc3Ryb3llZCBpbW1lZGlhdGVseSxcbiAgICAgICAgICAgIC8vIG1vc3QgbGlrZWx5IGFzIGEgcmVzdWx0IG9mIGEgYmluZGluZyBpbml0aWFsaXNpbmdcbiAgICAgICAgICAgIHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudC4kJC5vbl9tb3VudCA9IFtdO1xuICAgIH0pO1xuICAgIGFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gZGVzdHJveV9jb21wb25lbnQoY29tcG9uZW50LCBkZXRhY2hpbmcpIHtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJDtcbiAgICBpZiAoJCQuZnJhZ21lbnQgIT09IG51bGwpIHtcbiAgICAgICAgcnVuX2FsbCgkJC5vbl9kZXN0cm95KTtcbiAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuZChkZXRhY2hpbmcpO1xuICAgICAgICAvLyBUT0RPIG51bGwgb3V0IG90aGVyIHJlZnMsIGluY2x1ZGluZyBjb21wb25lbnQuJCQgKGJ1dCBuZWVkIHRvXG4gICAgICAgIC8vIHByZXNlcnZlIGZpbmFsIHN0YXRlPylcbiAgICAgICAgJCQub25fZGVzdHJveSA9ICQkLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgICAgJCQuY3R4ID0gW107XG4gICAgfVxufVxuZnVuY3Rpb24gbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpIHtcbiAgICBpZiAoY29tcG9uZW50LiQkLmRpcnR5WzBdID09PSAtMSkge1xuICAgICAgICBkaXJ0eV9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgc2NoZWR1bGVfdXBkYXRlKCk7XG4gICAgICAgIGNvbXBvbmVudC4kJC5kaXJ0eS5maWxsKDApO1xuICAgIH1cbiAgICBjb21wb25lbnQuJCQuZGlydHlbKGkgLyAzMSkgfCAwXSB8PSAoMSA8PCAoaSAlIDMxKSk7XG59XG5mdW5jdGlvbiBpbml0KGNvbXBvbmVudCwgb3B0aW9ucywgaW5zdGFuY2UsIGNyZWF0ZV9mcmFnbWVudCwgbm90X2VxdWFsLCBwcm9wcywgZGlydHkgPSBbLTFdKSB7XG4gICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgIGNvbnN0IHByb3BfdmFsdWVzID0gb3B0aW9ucy5wcm9wcyB8fCB7fTtcbiAgICBjb25zdCAkJCA9IGNvbXBvbmVudC4kJCA9IHtcbiAgICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAgIGN0eDogbnVsbCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIHVwZGF0ZTogbm9vcCxcbiAgICAgICAgbm90X2VxdWFsLFxuICAgICAgICBib3VuZDogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIC8vIGxpZmVjeWNsZVxuICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgIG9uX2Rlc3Ryb3k6IFtdLFxuICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgYWZ0ZXJfdXBkYXRlOiBbXSxcbiAgICAgICAgY29udGV4dDogbmV3IE1hcChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pLFxuICAgICAgICAvLyBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgZGlydHlcbiAgICB9O1xuICAgIGxldCByZWFkeSA9IGZhbHNlO1xuICAgICQkLmN0eCA9IGluc3RhbmNlXG4gICAgICAgID8gaW5zdGFuY2UoY29tcG9uZW50LCBwcm9wX3ZhbHVlcywgKGksIHJldCwgLi4ucmVzdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByZXN0Lmxlbmd0aCA/IHJlc3RbMF0gOiByZXQ7XG4gICAgICAgICAgICBpZiAoJCQuY3R4ICYmIG5vdF9lcXVhbCgkJC5jdHhbaV0sICQkLmN0eFtpXSA9IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICgkJC5ib3VuZFtpXSlcbiAgICAgICAgICAgICAgICAgICAgJCQuYm91bmRbaV0odmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChyZWFkeSlcbiAgICAgICAgICAgICAgICAgICAgbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSlcbiAgICAgICAgOiBbXTtcbiAgICAkJC51cGRhdGUoKTtcbiAgICByZWFkeSA9IHRydWU7XG4gICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAvLyBgZmFsc2VgIGFzIGEgc3BlY2lhbCBjYXNlIG9mIG5vIERPTSBjb21wb25lbnRcbiAgICAkJC5mcmFnbWVudCA9IGNyZWF0ZV9mcmFnbWVudCA/IGNyZWF0ZV9mcmFnbWVudCgkJC5jdHgpIDogZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmh5ZHJhdGUpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuYygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmludHJvKVxuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihjb21wb25lbnQuJCQuZnJhZ21lbnQpO1xuICAgICAgICBtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IpO1xuICAgICAgICBmbHVzaCgpO1xuICAgIH1cbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQocGFyZW50X2NvbXBvbmVudCk7XG59XG5sZXQgU3ZlbHRlRWxlbWVudDtcbmlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBTdmVsdGVFbGVtZW50ID0gY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuJCQuc2xvdHRlZCkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLiQkLnNsb3R0ZWRba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIF9vbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXNbYXR0cl0gPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBUT0RPIHNob3VsZCB0aGlzIGRlbGVnYXRlIHRvIGFkZEV2ZW50TGlzdGVuZXI/XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgICRzZXQoKSB7XG4gICAgICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGluc3RhbmNlLCBpZiBpdCBoYXMgcHJvcHNcbiAgICAgICAgfVxuICAgIH07XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnQge1xuICAgICRkZXN0cm95KCkge1xuICAgICAgICBkZXN0cm95X2NvbXBvbmVudCh0aGlzLCAxKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgfVxuICAgICRvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAkc2V0KCkge1xuICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGluc3RhbmNlLCBpZiBpdCBoYXMgcHJvcHNcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudCh0eXBlLCBPYmplY3QuYXNzaWduKHsgdmVyc2lvbjogJzMuMTguMScgfSwgZGV0YWlsKSkpO1xufVxuZnVuY3Rpb24gYXBwZW5kX2Rldih0YXJnZXQsIG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUgfSk7XG4gICAgYXBwZW5kKHRhcmdldCwgbm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnRfZGV2KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NSW5zZXJ0XCIsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG4gICAgaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcbn1cbmZ1bmN0aW9uIGRldGFjaF9kZXYobm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZVwiLCB7IG5vZGUgfSk7XG4gICAgZGV0YWNoKG5vZGUpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2JldHdlZW5fZGV2KGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nICYmIGJlZm9yZS5uZXh0U2libGluZyAhPT0gYWZ0ZXIpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaF9iZWZvcmVfZGV2KGFmdGVyKSB7XG4gICAgd2hpbGUgKGFmdGVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBkZXRhY2hfZGV2KGFmdGVyLnByZXZpb3VzU2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2FmdGVyX2RldihiZWZvcmUpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaXN0ZW5fZGV2KG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zLCBoYXNfcHJldmVudF9kZWZhdWx0LCBoYXNfc3RvcF9wcm9wYWdhdGlvbikge1xuICAgIGNvbnN0IG1vZGlmaWVycyA9IG9wdGlvbnMgPT09IHRydWUgPyBbXCJjYXB0dXJlXCJdIDogb3B0aW9ucyA/IEFycmF5LmZyb20oT2JqZWN0LmtleXMob3B0aW9ucykpIDogW107XG4gICAgaWYgKGhhc19wcmV2ZW50X2RlZmF1bHQpXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdwcmV2ZW50RGVmYXVsdCcpO1xuICAgIGlmIChoYXNfc3RvcF9wcm9wYWdhdGlvbilcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3N0b3BQcm9wYWdhdGlvbicpO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUFkZEV2ZW50TGlzdGVuZXJcIiwgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuICAgIGNvbnN0IGRpc3Bvc2UgPSBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUV2ZW50TGlzdGVuZXJcIiwgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuICAgICAgICBkaXNwb3NlKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHJfZGV2KG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01SZW1vdmVBdHRyaWJ1dGVcIiwgeyBub2RlLCBhdHRyaWJ1dGUgfSk7XG4gICAgZWxzZVxuICAgICAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01TZXRBdHRyaWJ1dGVcIiwgeyBub2RlLCBhdHRyaWJ1dGUsIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gcHJvcF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01TZXRQcm9wZXJ0eVwiLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIGRhdGFzZXRfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGUuZGF0YXNldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01TZXREYXRhc2V0XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gc2V0X2RhdGFfZGV2KHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01TZXREYXRhXCIsIHsgbm9kZTogdGV4dCwgZGF0YSB9KTtcbiAgICB0ZXh0LmRhdGEgPSBkYXRhO1xufVxuY2xhc3MgU3ZlbHRlQ29tcG9uZW50RGV2IGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAoIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLiQkaW5saW5lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAndGFyZ2V0JyBpcyBhIHJlcXVpcmVkIG9wdGlvbmApO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgICRkZXN0cm95KCkge1xuICAgICAgICBzdXBlci4kZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBDb21wb25lbnQgd2FzIGFscmVhZHkgZGVzdHJveWVkYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxvb3BfZ3VhcmQodGltZW91dCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmZpbml0ZSBsb29wIGRldGVjdGVkYCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgeyBIdG1sVGFnLCBTdmVsdGVDb21wb25lbnQsIFN2ZWx0ZUNvbXBvbmVudERldiwgU3ZlbHRlRWxlbWVudCwgYWN0aW9uX2Rlc3Ryb3llciwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhc3NpZ24sIGF0dHIsIGF0dHJfZGV2LCBiZWZvcmVVcGRhdGUsIGJpbmQsIGJpbmRpbmdfY2FsbGJhY2tzLCBibGFua19vYmplY3QsIGJ1YmJsZSwgY2hlY2tfb3V0cm9zLCBjaGlsZHJlbiwgY2xhaW1fY29tcG9uZW50LCBjbGFpbV9lbGVtZW50LCBjbGFpbV9zcGFjZSwgY2xhaW1fdGV4dCwgY2xlYXJfbG9vcHMsIGNvbXBvbmVudF9zdWJzY3JpYmUsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNfcHJvcCwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19mdW5jdGlvbiwgaXNfcHJvbWlzZSwgbGlzdGVuLCBsaXN0ZW5fZGV2LCBsb29wLCBsb29wX2d1YXJkLCBtaXNzaW5nX2NvbXBvbmVudCwgbW91bnRfY29tcG9uZW50LCBub29wLCBub3RfZXF1YWwsIG5vdywgbnVsbF90b19lbXB0eSwgb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcywgb25EZXN0cm95LCBvbk1vdW50LCBvbmNlLCBvdXRyb19hbmRfZGVzdHJveV9ibG9jaywgcHJldmVudF9kZWZhdWx0LCBwcm9wX2RldiwgcXVlcnlfc2VsZWN0b3JfYWxsLCByYWYsIHJ1biwgcnVuX2FsbCwgc2FmZV9ub3RfZXF1YWwsIHNjaGVkdWxlX3VwZGF0ZSwgc2VsZWN0X211bHRpcGxlX3ZhbHVlLCBzZWxlY3Rfb3B0aW9uLCBzZWxlY3Rfb3B0aW9ucywgc2VsZWN0X3ZhbHVlLCBzZWxmLCBzZXRDb250ZXh0LCBzZXRfYXR0cmlidXRlcywgc2V0X2N1cnJlbnRfY29tcG9uZW50LCBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YSwgc2V0X2RhdGEsIHNldF9kYXRhX2Rldiwgc2V0X2lucHV0X3R5cGUsIHNldF9pbnB1dF92YWx1ZSwgc2V0X25vdywgc2V0X3JhZiwgc2V0X3N0b3JlX3ZhbHVlLCBzZXRfc3R5bGUsIHNldF9zdmdfYXR0cmlidXRlcywgc3BhY2UsIHNwcmVhZCwgc3RvcF9wcm9wYWdhdGlvbiwgc3Vic2NyaWJlLCBzdmdfZWxlbWVudCwgdGV4dCwgdGljaywgdGltZV9yYW5nZXNfdG9fYXJyYXksIHRvX251bWJlciwgdG9nZ2xlX2NsYXNzLCB0cmFuc2l0aW9uX2luLCB0cmFuc2l0aW9uX291dCwgdXBkYXRlX2tleWVkX2VhY2gsIHZhbGlkYXRlX2NvbXBvbmVudCwgdmFsaWRhdGVfZWFjaF9rZXlzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiZnVuY3Rpb24gdG9WYWwobWl4KSB7XG5cdHZhciBrLCB5LCBzdHI9Jyc7XG5cdGlmIChtaXgpIHtcblx0XHRpZiAodHlwZW9mIG1peCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG1peCkpIHtcblx0XHRcdFx0Zm9yIChrPTA7IGsgPCBtaXgubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwobWl4W2tdKSkpIHtcblx0XHRcdFx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRcdFx0XHRzdHIgKz0geTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoayBpbiBtaXgpIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwoaykpKSB7XG5cdFx0XHRcdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0XHRcdFx0c3RyICs9IHk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgbWl4ICE9PSAnYm9vbGVhbicgJiYgIW1peC5jYWxsKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IG1peDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuXHR2YXIgaT0wLCB4LCBzdHI9Jyc7XG5cdHdoaWxlIChpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdGlmICh4ID0gdG9WYWwoYXJndW1lbnRzW2krK10pKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IHhcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRPcmlnaW5hbEJvZHlQYWRkaW5nKCkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdyA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIG51bGwpIDoge307XG5cbiAgcmV0dXJuIHBhcnNlSW50KChzdHlsZSAmJiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpIHx8IDAsIDEwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCkge1xuICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIC8vIC5tb2RhbC1zY3JvbGxiYXItbWVhc3VyZSBzdHlsZXMgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjQvc2Nzcy9fbW9kYWwuc2NzcyNMMTA2LUwxMTNcbiAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgc2Nyb2xsRGl2LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgc2Nyb2xsRGl2LnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTY3JvbGxiYXJXaWR0aChwYWRkaW5nKSB7XG4gIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA+IDAgPyBgJHtwYWRkaW5nfXB4YCA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JvZHlPdmVyZmxvd2luZygpIHtcbiAgcmV0dXJuIHdpbmRvdyA/IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCB3aW5kb3cuaW5uZXJXaWR0aCA6IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmRpdGlvbmFsbHlVcGRhdGVTY3JvbGxiYXIoKSB7XG4gIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjYvanMvc3JjL21vZGFsLmpzI0w0MzNcbiAgY29uc3QgZml4ZWRDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcCdcbiAgKVswXTtcbiAgY29uc3QgYm9keVBhZGRpbmcgPSBmaXhlZENvbnRlbnRcbiAgICA/IHBhcnNlSW50KGZpeGVkQ29udGVudC5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgMCwgMTApXG4gICAgOiAwO1xuXG4gIGlmIChpc0JvZHlPdmVyZmxvd2luZygpKSB7XG4gICAgc2V0U2Nyb2xsYmFyV2lkdGgoYm9keVBhZGRpbmcgKyBzY3JvbGxiYXJXaWR0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sU2l6ZSkge1xuICBpZiAoY29sU2l6ZSA9PT0gdHJ1ZSB8fCBjb2xTaXplID09PSAnJykge1xuICAgIHJldHVybiBpc1hzID8gJ2NvbCcgOiBgY29sLSR7Y29sV2lkdGh9YDtcbiAgfSBlbHNlIGlmIChjb2xTaXplID09PSAnYXV0bycpIHtcbiAgICByZXR1cm4gaXNYcyA/ICdjb2wtYXV0bycgOiBgY29sLSR7Y29sV2lkdGh9LWF1dG9gO1xuICB9XG5cbiAgcmV0dXJuIGlzWHMgPyBgY29sLSR7Y29sU2l6ZX1gIDogYGNvbC0ke2NvbFdpZHRofS0ke2NvbFNpemV9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKCQkcHJvcHMpIHtcbiAgLy8gVE9ETyBzdXBwb3J0IGtleXNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgY2hpbGRyZW4sICQkc2NvcGUsICQkc2xvdHMgfSA9ICQkcHJvcHM7XG4gIGNvbnN0IHJlc3QgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoJCRwcm9wcykpIHtcbiAgICBpZiAoa2V5ICE9PSBcImNoaWxkcmVuXCIgJiYga2V5ICE9PSBcIiQkc2NvcGVcIiAmJiBrZXkgIT09IFwiJCRzbG90c1wiKSB7XG4gICAgICByZXN0W2tleV0gPSAkJHByb3BzW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJvd3NlckV2ZW50KHRhcmdldCwgLi4uYXJncykge1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblxuICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDYXJvdXNlbEFjdGl2ZUluZGV4KGRpcmVjdGlvbiwgaXRlbXMsIGFjdGl2ZUluZGV4KSB7XG4gIGlmIChkaXJlY3Rpb24gPT09ICdwcmV2Jykge1xuICAgIHJldHVybiBhY3RpdmVJbmRleCA9PT0gMCA/IGl0ZW1zLmxlbmd0aCAtIDEgOiBhY3RpdmVJbmRleCAtIDE7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICByZXR1cm4gYWN0aXZlSW5kZXggPT09IGl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogYWN0aXZlSW5kZXggKyAxO1xuICB9XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGFyaWFMYWJlbCA9ICdicmVhZGNydW1iJztcbiAgZXhwb3J0IGxldCBjaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgZXhwb3J0IGxldCBsaXN0Q2xhc3NOYW1lID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBsaXN0Q2xhc3NlcyA9IGNsc3goJ2JyZWFkY3J1bWInLCBsaXN0Q2xhc3NOYW1lKTtcbjwvc2NyaXB0PlxuXG48bmF2IHsuLi5wcm9wc30gYXJpYS1sYWJlbD17YXJpYUxhYmVsfSBjbGFzcz17Y2xhc3NOYW1lfT5cbiAgPG9sIGNsYXNzPXtsaXN0Q2xhc3Nlc30+XG4gICAgeyNpZiBjaGlsZHJlbn1cbiAgICAgIHtjaGlsZHJlbn1cbiAgICB7OmVsc2V9XG4gICAgICA8c2xvdCAvPlxuICAgIHsvaWZ9XG4gIDwvb2w+XG48L25hdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY2hpbGRyZW4gPSB1bmRlZmluZWQ7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIGFjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsICdicmVhZGNydW1iLWl0ZW0nKTtcbjwvc2NyaXB0PlxuXG48bGkgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30gYXJpYS1jdXJyZW50PXthY3RpdmUgPyAncGFnZScgOiB1bmRlZmluZWR9PlxuICB7I2lmIGNoaWxkcmVufVxuICAgIHtjaGlsZHJlbn1cbiAgezplbHNlfVxuICAgIDxzbG90IC8+XG4gIHsvaWZ9XG48L2xpPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBib2R5ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnJztcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IGludmVyc2UgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBvdXRsaW5lID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc3R5bGUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnY2FyZCcsXG4gICAgaW52ZXJzZSA/ICd0ZXh0LXdoaXRlJyA6IGZhbHNlLFxuICAgIGJvZHkgPyAnY2FyZC1ib2R5JyA6IGZhbHNlLFxuICAgIGNvbG9yID8gYCR7b3V0bGluZSA/ICdib3JkZXInIDogJ2JnJ30tJHtjb2xvcn1gIDogZmFsc2VcbiAgKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30gb246Y2xpY2sge3N0eWxlfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCAnY2FyZC1ib2R5Jyk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgdGFnID0gJ2Rpdic7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICdjYXJkLWhlYWRlcicpO1xuPC9zY3JpcHQ+XG5cbnsjaWYgdGFnID09PSAnaDMnfVxuICA8aDMgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfSBvbjpjbGljaz5cbiAgICA8c2xvdCAvPlxuICA8L2gzPlxuezplbHNlfVxuICA8ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30gb246Y2xpY2s+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2NhcmQtdGV4dCcpO1xuPC9zY3JpcHQ+XG5cbjxwIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9wPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBub0d1dHRlcnMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBmb3JtID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBub0d1dHRlcnMgPyAnbm8tZ3V0dGVycycgOiBudWxsLFxuICAgIGZvcm0gPyAnZm9ybS1yb3cnIDogJ3JvdydcbiAgKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICdjYXJkLWZvb3RlcicpO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IGJvcmRlcmVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYm9yZGVybGVzcyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHN0cmlwZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkYXJrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaG92ZXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXNwb25zaXZlID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgJ3RhYmxlJyxcbiAgICBzaXplID8gJ3RhYmxlLScgKyBzaXplIDogZmFsc2UsXG4gICAgYm9yZGVyZWQgPyAndGFibGUtYm9yZGVyZWQnIDogZmFsc2UsXG4gICAgYm9yZGVybGVzcyA/ICd0YWJsZS1ib3JkZXJsZXNzJyA6IGZhbHNlLFxuICAgIHN0cmlwZWQgPyAndGFibGUtc3RyaXBlZCcgOiBmYWxzZSxcbiAgICBkYXJrID8gJ3RhYmxlLWRhcmsnIDogZmFsc2UsXG4gICAgaG92ZXIgPyAndGFibGUtaG92ZXInIDogZmFsc2VcbiAgKTtcblxuICAkOiByZXNwb25zaXZlQ2xhc3NOYW1lID1cbiAgICByZXNwb25zaXZlID09PSB0cnVlID8gJ3RhYmxlLXJlc3BvbnNpdmUnIDogYHRhYmxlLXJlc3BvbnNpdmUtJHtyZXNwb25zaXZlfWA7XG48L3NjcmlwdD5cblxueyNpZiByZXNwb25zaXZlfVxuICA8ZGl2IGNsYXNzPXtyZXNwb25zaXZlQ2xhc3NOYW1lfT5cbiAgICA8dGFibGUgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgICA8c2xvdCAvPlxuICAgIDwvdGFibGU+XG4gIDwvZGl2PlxuezplbHNlfVxuICA8dGFibGUgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC90YWJsZT5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxyXG4gIGV4cG9ydCBsZXQgc3JjID0gXCJsb2dvLTE5Mi5wbmdcIjtcclxuICBleHBvcnQgbGV0IGFsdCA9IFwibG9nb1wiO1xyXG5cclxuICBsZXQgY2xhc3NOYW1lID0gXCJsb2dvXCI7XHJcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPGltZyBjbGFzcz1cImltZy1mbHVpZCB7Y2xhc3NOYW1lfVwiIHtzcmN9IHthbHR9IC8+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IENhcmQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkQm9keSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRCb2R5LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkRm9vdGVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEZvb3Rlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEhlYWRlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRIZWFkZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRUZXh0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZFRleHQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRTdWJ0aXRsZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRTdWJ0aXRsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgVGFibGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9UYWJsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgUm93IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgSW1hZ2UgZnJvbSBcIi4uL2NvbXBvbmVudHMvSW1hZ2Uuc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgY2FyZFRpdGxlID0gXCLQpdGD0LnQutC40L1cIjtcclxuICBleHBvcnQgbGV0IGNhcmRDb2xvcjtcclxuICBleHBvcnQgbGV0IGNhcmRGb290ZXJUZXh0ID0gXCLQlNC10YLQsNC70LhcIjtcclxuPC9zY3JpcHQ+XHJcblxyXG48Q2FyZCBpbnZlcnNlIGNvbG9yPXtjYXJkQ29sb3J9IGNsYXNzPVwibWItNFwiPlxyXG4gIDxDYXJkQm9keT5cclxuICAgIDxDYXJkVGV4dD57Y2FyZFRpdGxlfTwvQ2FyZFRleHQ+XHJcbiAgPC9DYXJkQm9keT5cclxuICA8Q2FyZEZvb3RlciBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cclxuICAgIDxhIGNsYXNzPVwic21hbGwgdGV4dC13aGl0ZSBzdHJldGNoZWQtbGlua1wiIGhyZWY9XCJjaGFydHNcIj5cclxuICAgICAge2NhcmRGb290ZXJUZXh0fVxyXG4gICAgPC9hPlxyXG4gICAgPGRpdiBjbGFzcz1cInNtYWxsIHRleHQtd2hpdGVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtcmlnaHRcIiAvPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9DYXJkRm9vdGVyPlxyXG48L0NhcmQ+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IENhcmQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkQm9keSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRCb2R5LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkSGVhZGVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEhlYWRlci5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IEltYWdlIGZyb20gXCIuLi9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IGNhcmRUaXRsZSA9IFwiXCI7XHJcbiAgZXhwb3J0IGxldCBjYXJkSWNvbiA9IFwiXCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPENhcmQgY2xhc3M9XCJtYi00XCI+XHJcbiAgPENhcmRIZWFkZXI+XHJcbiAgICA8aSBjbGFzcz17Y2FyZEljb259IC8+XHJcbiAgICB7Y2FyZFRpdGxlfVxyXG4gIDwvQ2FyZEhlYWRlcj5cclxuICA8Q2FyZEJvZHk+XHJcbiAgICA8c2xvdCAvPlxyXG4gICAgPHNsb3QgbmFtZT1cImNoYXJ0Q2FwdGlvblwiIC8+XHJcbiAgPC9DYXJkQm9keT5cclxuPC9DYXJkPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBUYWJsZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1RhYmxlLnN2ZWx0ZVwiO1xyXG5cclxuICBjb25zdCB0YWJsZUhlYWRpbmcgPSBbXCIjXCIsIFwiRmlyc3QgTmFtZVwiLCBcIkxhc3QtTmFtZVwiLCBcIlVzZXJuYW1lXCJdO1xyXG4gIGNvbnN0IHRhYmxlRGF0YSA9IFtcclxuICAgIHsgU05vOiBcIjFcIiwgZmlyc3ROYW1lOiBcIlBpcEJveVwiLCBsYXN0TmFtZTogXCIzMDAwXCIsIHVzZXJOYW1lOiBcIkBtZG9cIiB9LFxyXG4gICAgeyBTTm86IFwiMlwiLCBmaXJzdE5hbWU6IFwiR29yZG9uXCIsIGxhc3ROYW1lOiBcIkZyZWVtYW5cIiwgdXNlck5hbWU6IFwiQGZhdFwiIH0sXHJcbiAgICB7IFNObzogXCIzXCIsIGZpcnN0TmFtZTogXCJHb3VsXCIsIGxhc3ROYW1lOiBcItCT0LvQsNC00LrQvtC60L7QttC40LlcIiwgdXNlck5hbWU6IFwiQHR3aXR0ZXJcIiB9XHJcbiAgXTtcclxuPC9zY3JpcHQ+XHJcblxyXG48VGFibGUgYm9yZGVyZWQgcmVzcG9uc2l2ZT5cclxuICA8dGhlYWQ+XHJcbiAgICA8dHI+XHJcbiAgICAgIHsjZWFjaCB0YWJsZUhlYWRpbmcgYXMgaGVhZGluZ31cclxuICAgICAgICA8dGg+e2hlYWRpbmd9PC90aD5cclxuICAgICAgey9lYWNofVxyXG4gICAgPC90cj5cclxuICA8L3RoZWFkPlxyXG4gIDx0Ym9keT5cclxuXHJcbiAgICB7I2VhY2ggdGFibGVEYXRhIGFzIGRhdGF9XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGggc2NvcGU9XCJyb3dcIj57ZGF0YS5TTm99PC90aD5cclxuICAgICAgICA8dGQ+e2RhdGEuZmlyc3ROYW1lfTwvdGQ+XHJcbiAgICAgICAgPHRkPntkYXRhLmxhc3ROYW1lfTwvdGQ+XHJcbiAgICAgICAgPHRkPntkYXRhLnVzZXJOYW1lfTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICB7L2VhY2h9XHJcbiAgPC90Ym9keT5cclxuPC9UYWJsZT5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDaGFydCBmcm9tIFwiY2hhcnQuanNcIjtcclxuXHJcbiAgY29uc3QgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXHJcbiAgICAgIFwi0K/QvdCy0LDRgNGMXCIsXHJcbiAgICAgIFwi0KTQtdCy0YDQsNC70YxcIixcclxuICAgICAgXCLQnNCw0YDRglwiLFxyXG4gICAgICBcItCQ0L/RgNC10LvRjFwiLFxyXG4gICAgICBcItCc0LDQuVwiLFxyXG4gICAgICBcItCY0Y7QvdGMXCIsXHJcbiAgICAgIFwi0JjRjtC70YxcIixcclxuICAgICAgXCLQkNCy0LPRg9GB0YJcIixcclxuICAgICAgXCLQodC10L3RgtGP0LHRgNGMXCJcclxuICAgIF0sXHJcbiAgICBkYXRhc2V0czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbGFiZWw6IFwiIyDQs9C+0LvQvtGB0L7QslwiLFxyXG4gICAgICAgIGRhdGE6IFsxNSwgMTAsIDE3LCA2LCAxMSwgOSwgMTIsIDE2LCAxMV0sXHJcbiAgICAgICAgYm9yZGVyV2lkdGg6IDIsXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6IFwicmdiKDMsMTE3LDIyMClcIixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgzLDExNywyMjAsMC4yKVwiXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9O1xyXG5cclxuICBjb25zdCBjaGFydE9wdGlvbnMgPSB7XHJcbiAgICBzY2FsZXM6IHtcclxuICAgICAgeUF4ZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KCkge1xyXG4gICAgdmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJlYUNoYXJ0XCIpO1xyXG4gICAgdmFyIG15Q2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICAgIHR5cGU6IFwibGluZVwiLFxyXG4gICAgICBkYXRhOiBjaGFydERhdGEsXHJcbiAgICAgIG9wdGlvbnM6IGNoYXJ0T3B0aW9uc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbk1vdW50KGNyZWF0ZUNoYXJ0KTtcclxuPC9zY3JpcHQ+XHJcblxyXG48Y2FudmFzIGlkPVwiYXJlYUNoYXJ0XCIgLz5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDaGFydCBmcm9tIFwiY2hhcnQuanNcIjtcclxuXHJcbiAgY29uc3QgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiXSxcclxuICAgIGRhdGFzZXRzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBsYWJlbDogXCIjIG9mIFZvdGVzXCIsXHJcbiAgICAgICAgZGF0YTogWzQsIDYsIDEwLCAxMiwgMTUsIDE5XSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgzLDExNywyMjApXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH07XHJcbiAgY29uc3QgY2hhcnRPcHRpb25zID0ge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgIHlBeGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDaGFydCgpIHtcclxuICAgIHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhckNoYXJ0XCIpO1xyXG4gICAgdmFyIG15Q2hhcnQgPSBuZXcgQ2hhcnQoY3R4LCB7XHJcbiAgICAgIHR5cGU6IFwiYmFyXCIsXHJcbiAgICAgIGRhdGE6IGNoYXJ0RGF0YSxcclxuICAgICAgb3B0aW9uczogY2hhcnRPcHRpb25zXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uTW91bnQoY3JlYXRlQ2hhcnQpO1xyXG48L3NjcmlwdD5cclxuXHJcbjxjYW52YXMgaWQ9XCJiYXJDaGFydFwiIC8+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IEJyZWFkY3J1bWIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9CcmVhZGNydW1iLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBCcmVhZGNydW1iSXRlbSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWJJdGVtLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEJvZHkgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkQm9keS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEhlYWRlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRIZWFkZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRUZXh0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZFRleHQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRTdWJ0aXRsZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRTdWJ0aXRsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgUm93IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgRGFzaGJvYXJkQ2FyZCBmcm9tIFwiLi4vY29tcG9uZW50cy9EYXNoYm9hcmRDYXJkLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDdXN0b21DYXJkIGZyb20gXCIuLi9jb21wb25lbnRzL0N1c3RvbUNhcmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFRhYmxlIGZyb20gXCIuLi9jb21wb25lbnRzL1RhYmxlLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBBcmVhQ2hhcnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvQ2hhcnRzL0FyZWFDaGFydC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQmFyQ2hhcnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvQ2hhcnRzL0JhckNoYXJ0LnN2ZWx0ZVwiO1xyXG5cclxuICBsZXQgdGl0bGUgPSBcIs67cHJvdG9uXCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG4gIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuPGgxIGNsYXNzPVwibXQtNFwiPtCf0LDQvdC10LvRjDwvaDE+XHJcbjxCcmVhZGNydW1iIGNsYXNzPVwibWItNFwiPlxyXG4gIDxCcmVhZGNydW1iSXRlbSBhY3RpdmU+0J/QsNC90LXQu9GMPC9CcmVhZGNydW1iSXRlbT5cclxuPC9CcmVhZGNydW1iPlxyXG48Um93PlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wteGwtMyBjb2wtbWQtNlwiPlxyXG4gICAgPERhc2hib2FyZENhcmQgY2FyZFRpdGxlPVwi0KHQuNC90Y/RjyDQv9C70LDRiNC60LBcIiBjYXJkQ29sb3I9XCJwcmltYXJ5XCIgLz5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLXhsLTMgY29sLW1kLTZcIj5cclxuICAgIDxEYXNoYm9hcmRDYXJkIGNhcmRUaXRsZT1cItCe0YDQsNC90LbQtdCy0LDRjyDQv9C70LDRiNC60LBcIiBjYXJkQ29sb3I9XCJ3YXJuaW5nXCIgLz5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLXhsLTMgY29sLW1kLTZcIj5cclxuICAgIDxEYXNoYm9hcmRDYXJkIGNhcmRUaXRsZT1cItCX0LXQu9C10L3QsNGPINC/0LvQsNGI0LrQsFwiIGNhcmRDb2xvcj1cInN1Y2Nlc3NcIiAvPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wteGwtMyBjb2wtbWQtNlwiPlxyXG4gICAgPERhc2hib2FyZENhcmQgY2FyZFRpdGxlPVwi0J7Qv9Cw0YHQvdCw0Y8g0L/Qu9Cw0YjQutCwXCIgY2FyZENvbG9yPVwiZGFuZ2VyXCIgLz5cclxuICA8L2Rpdj5cclxuPC9Sb3c+XHJcbjxSb3c+XHJcbiAgPGRpdiBjbGFzcz1cImNvbC14bC02XCI+XHJcbiAgICA8Q3VzdG9tQ2FyZCBjYXJkVGl0bGU9XCLQn9GA0LjQvNC10YAg0LTQuNCw0LPRgNCw0LzQvNGLXCIgY2FyZEljb249XCJmYXMgZmEtY2hhcnQtYXJlYVwiPlxyXG4gICAgICA8QXJlYUNoYXJ0IC8+XHJcbiAgICA8L0N1c3RvbUNhcmQ+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImNvbC14bC02XCI+XHJcbiAgICA8Q3VzdG9tQ2FyZCBjYXJkVGl0bGU9XCLQn9GA0LjQvNC10YAg0LPQuNGB0YLQvtCz0YDQsNC80LzRi1wiIGNhcmRJY29uPVwiZmFzIGZhLWNoYXJ0LWJhclwiPlxyXG4gICAgICA8QmFyQ2hhcnQgLz5cclxuICAgIDwvQ3VzdG9tQ2FyZD5cclxuICA8L2Rpdj5cclxuPC9Sb3c+XHJcbjxDdXN0b21DYXJkIGNhcmRUaXRsZT1cItCf0YDQuNC80LXRgCBEYXRhVGFibGVcIiBjYXJkSWNvbj1cImZhcyBmYS10YWJsZVwiPlxyXG4gIDxUYWJsZSAvPlxyXG48L0N1c3RvbUNhcmQ+XHJcbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaW5saW5lID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIGlubGluZSA/ICdmb3JtLWlubGluZScgOiBmYWxzZSk7XG48L3NjcmlwdD5cblxuPGZvcm0gey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Zvcm0+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBleHBvcnQgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCByb3cgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjaGVjayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlubGluZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCB0YWcgPSBudWxsO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIHJvdyA/ICdyb3cnIDogZmFsc2UsXG4gICAgY2hlY2sgPyAnZm9ybS1jaGVjaycgOiAnZm9ybS1ncm91cCcsXG4gICAgY2hlY2sgJiYgaW5saW5lID8gJ2Zvcm0tY2hlY2staW5saW5lJyA6IGZhbHNlLFxuICAgIGNoZWNrICYmIGRpc2FibGVkID8gJ2Rpc2FibGVkJyA6IGZhbHNlXG4gICk7XG48L3NjcmlwdD5cblxueyNpZiB0YWcgPT09ICdmaWVsZHNldCd9XG4gIDxmaWVsZHNldCB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90IC8+XG4gIDwvZmllbGRzZXQ+XG57OmVsc2V9XG4gIDxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgeyBnZXRDb2x1bW5TaXplQ2xhc3MsIGlzT2JqZWN0IH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaGlkZGVuID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY2hlY2sgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgZm9yZTtcbiAgZXhwb3J0IHsgZm9yZSBhcyBmb3IgfTtcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IHhzID0gJyc7XG4gIGV4cG9ydCBsZXQgc20gPSAnJztcbiAgZXhwb3J0IGxldCBtZCA9ICcnO1xuICBleHBvcnQgbGV0IGxnID0gJyc7XG4gIGV4cG9ydCBsZXQgeGwgPSAnJztcblxuICBjb25zdCBjb2xXaWR0aHMgPSB7XG4gICAgeHMsXG4gICAgc20sXG4gICAgbWQsXG4gICAgbGcsXG4gICAgeGxcbiAgfTtcbiAgZXhwb3J0IGxldCB3aWR0aHMgPSBPYmplY3Qua2V5cyhjb2xXaWR0aHMpO1xuXG4gIGNvbnN0IGNvbENsYXNzZXMgPSBbXTtcblxuICB3aWR0aHMuZm9yRWFjaChjb2xXaWR0aCA9PiB7XG4gICAgbGV0IGNvbHVtblByb3AgPSAkJHByb3BzW2NvbFdpZHRoXTtcblxuICAgIGlmICghY29sdW1uUHJvcCAmJiBjb2x1bW5Qcm9wICE9PSAnJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzWHMgPSBjb2xXaWR0aCA9PT0gJ3hzJztcbiAgICBsZXQgY29sQ2xhc3M7XG5cbiAgICBpZiAoaXNPYmplY3QoY29sdW1uUHJvcCkpIHtcbiAgICAgIGNvbnN0IGNvbFNpemVJbnRlcmZpeCA9IGlzWHMgPyAnLScgOiBgLSR7Y29sV2lkdGh9LWA7XG4gICAgICBjb2xDbGFzcyA9IGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sdW1uUHJvcC5zaXplKTtcblxuICAgICAgY29sQ2xhc3Nlcy5wdXNoKFxuICAgICAgICBjbHN4KHtcbiAgICAgICAgICBbY29sQ2xhc3NdOiBjb2x1bW5Qcm9wLnNpemUgfHwgY29sdW1uUHJvcC5zaXplID09PSAnJyxcbiAgICAgICAgICBbYG9yZGVyJHtjb2xTaXplSW50ZXJmaXh9JHtjb2x1bW5Qcm9wLm9yZGVyfWBdOlxuICAgICAgICAgICAgY29sdW1uUHJvcC5vcmRlciB8fCBjb2x1bW5Qcm9wLm9yZGVyID09PSAwLFxuICAgICAgICAgIFtgb2Zmc2V0JHtjb2xTaXplSW50ZXJmaXh9JHtjb2x1bW5Qcm9wLm9mZnNldH1gXTpcbiAgICAgICAgICAgIGNvbHVtblByb3Aub2Zmc2V0IHx8IGNvbHVtblByb3Aub2Zmc2V0ID09PSAwXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xDbGFzcyA9IGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sdW1uUHJvcCk7XG4gICAgICBjb2xDbGFzc2VzLnB1c2goY29sQ2xhc3MpO1xuICAgIH1cbiAgfSk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIGhpZGRlbiA/ICdzci1vbmx5JyA6IGZhbHNlLFxuICAgIGNoZWNrID8gJ2Zvcm0tY2hlY2stbGFiZWwnIDogZmFsc2UsXG4gICAgc2l6ZSA/IGBjb2wtZm9ybS1sYWJlbC0ke3NpemV9YCA6IGZhbHNlLFxuICAgIGNvbENsYXNzZXMsXG4gICAgY29sQ2xhc3Nlcy5sZW5ndGggPyAnY29sLWZvcm0tbGFiZWwnIDogZmFsc2VcbiAgKTtcbjwvc2NyaXB0PlxuXG48bGFiZWwgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfSBmb3I9e2ZvcmV9PlxuICA8c2xvdCAvPlxuPC9sYWJlbD5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG5cbiAgZXhwb3J0IGxldCB0eXBlID0gJ3RleHQnO1xuICBleHBvcnQgbGV0IHNpemUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgYnNTaXplID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGNoZWNrZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGludmFsaWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwbGFpbnRleHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhZGRvbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZhbHVlID0gJyc7XG4gIGV4cG9ydCBsZXQgZmlsZXMgPSAnJztcbiAgZXhwb3J0IGxldCByZWFkb25seTtcbiAgZXhwb3J0IGxldCBtdWx0aXBsZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgbmFtZSA9ICcnO1xuICBleHBvcnQgbGV0IHBsYWNlaG9sZGVyID0gJyc7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgY29uc3QgeyB0eXBlOiBfb21pdFR5cGUsIC4uLnByb3BzIH0gPSBjbGVhbigkJHByb3BzKTtcblxuICBsZXQgY2xhc3NlcztcbiAgbGV0IHRhZztcbiAgJDoge1xuICAgIGNvbnN0IGNoZWNrSW5wdXQgPSBbJ3JhZGlvJywgJ2NoZWNrYm94J10uaW5kZXhPZih0eXBlKSA+IC0xO1xuICAgIGNvbnN0IGlzTm90YU51bWJlciA9IG5ldyBSZWdFeHAoJ1xcXFxEJywgJ2cnKTtcblxuICAgIGNvbnN0IGZpbGVJbnB1dCA9IHR5cGUgPT09ICdmaWxlJztcbiAgICBjb25zdCB0ZXh0YXJlYUlucHV0ID0gdHlwZSA9PT0gJ3RleHRhcmVhJztcbiAgICBjb25zdCBzZWxlY3RJbnB1dCA9IHR5cGUgPT09ICdzZWxlY3QnO1xuICAgIHRhZyA9IHNlbGVjdElucHV0IHx8IHRleHRhcmVhSW5wdXQgPyB0eXBlIDogJ2lucHV0JztcblxuICAgIGxldCBmb3JtQ29udHJvbENsYXNzID0gJ2Zvcm0tY29udHJvbCc7XG5cbiAgICBpZiAocGxhaW50ZXh0KSB7XG4gICAgICBmb3JtQ29udHJvbENsYXNzID0gYCR7Zm9ybUNvbnRyb2xDbGFzc30tcGxhaW50ZXh0YDtcbiAgICAgIHRhZyA9ICdpbnB1dCc7XG4gICAgfSBlbHNlIGlmIChmaWxlSW5wdXQpIHtcbiAgICAgIGZvcm1Db250cm9sQ2xhc3MgPSBgJHtmb3JtQ29udHJvbENsYXNzfS1maWxlYDtcbiAgICB9IGVsc2UgaWYgKGNoZWNrSW5wdXQpIHtcbiAgICAgIGlmIChhZGRvbikge1xuICAgICAgICBmb3JtQ29udHJvbENsYXNzID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1Db250cm9sQ2xhc3MgPSAnZm9ybS1jaGVjay1pbnB1dCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNpemUgJiYgaXNOb3RhTnVtYmVyLnRlc3Qoc2l6ZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1BsZWFzZSB1c2UgdGhlIHByb3AgXCJic1NpemVcIiBpbnN0ZWFkIG9mIHRoZSBcInNpemVcIiB0byBib290c3RyYXBcXCdzIGlucHV0IHNpemluZy4nXG4gICAgICApO1xuICAgICAgYnNTaXplID0gc2l6ZTtcbiAgICAgIHNpemUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY2xhc3NlcyA9IGNsc3goXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBpbnZhbGlkICYmICdpcy1pbnZhbGlkJyxcbiAgICAgIHZhbGlkICYmICdpcy12YWxpZCcsXG4gICAgICBic1NpemUgPyBgZm9ybS1jb250cm9sLSR7YnNTaXplfWAgOiBmYWxzZSxcbiAgICAgIGZvcm1Db250cm9sQ2xhc3NcbiAgICApO1xuICB9XG48L3NjcmlwdD5cblxueyNpZiB0YWcgPT09ICdpbnB1dCd9XG4gIHsjaWYgdHlwZSA9PT0gJ3RleHQnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdwYXNzd29yZCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdlbWFpbCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdmaWxlJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6ZmlsZXNcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnY2hlY2tib3gnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6Y2hlY2tlZFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdyYWRpbyd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICd1cmwnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInVybFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ251bWJlcid9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZGF0ZSd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZGF0ZVwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ3RpbWUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInRpbWVcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdkYXRldGltZSd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZGF0ZXRpbWVcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdjb2xvcid9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiY29sb3JcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdzZWFyY2gnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInNlYXJjaFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7L2lmfVxuXG57OmVsc2UgaWYgdGFnID09PSAndGV4dGFyZWEnfVxuICA8dGV4dGFyZWFcbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIG9uOmJsdXJcbiAgICBvbjpmb2N1c1xuICAgIG9uOmtleWRvd25cbiAgICBvbjprZXlwcmVzc1xuICAgIG9uOmtleXVwXG4gICAgb246Y2hhbmdlXG4gICAgb246aW5wdXRcbiAgICBiaW5kOnZhbHVlXG4gICAge25hbWV9XG4gICAge2Rpc2FibGVkfSAvPlxuXG57OmVsc2UgaWYgdGFnID09PSAnc2VsZWN0J31cbiAgPHNlbGVjdFxuICAgIHsuLi5wcm9wc31cbiAgICB7aWR9XG4gICAge211bHRpcGxlfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIG9uOmJsdXJcbiAgICBvbjpmb2N1c1xuICAgIG9uOmNoYW5nZVxuICAgIG9uOmlucHV0XG4gICAge25hbWV9XG4gICAge2Rpc2FibGVkfT5cbiAgICA8c2xvdCAvPlxuICA8L3NlbGVjdD5cblxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbmFtZSA9ICcnO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgdHlwZTtcbiAgZXhwb3J0IGxldCBsYWJlbCA9ICcnO1xuICBleHBvcnQgbGV0IGNoZWNrZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlubGluZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZhbGlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSAnJztcbiAgZXhwb3J0IGxldCBpbnZhbGlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYnNTaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgcGxhY2Vob2xkZXIgPSAnJztcbiAgZXhwb3J0IGxldCBodG1sRm9yID0gJyc7XG4gIGV4cG9ydCB7IGh0bWxGb3IgYXMgZm9yIH07XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgdHlwZTogX29taXRUeXBlLCAuLi5wcm9wcyB9ID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY3VzdG9tQ2xhc3MgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBgY3VzdG9tLSR7dHlwZX1gLFxuICAgIGJzU2l6ZSA/IGBjdXN0b20tJHt0eXBlfS0ke2JzU2l6ZX1gIDogZmFsc2VcbiAgKTtcblxuICAkOiB2YWxpZGF0aW9uQ2xhc3NOYW1lcyA9IGNsc3goaW52YWxpZCAmJiAnaXMtaW52YWxpZCcsIHZhbGlkICYmICdpcy12YWxpZCcpO1xuXG4gICQ6IGNvbWJpbmVkQ2xhc3NlcyA9IGNsc3goY3VzdG9tQ2xhc3MsIHZhbGlkYXRpb25DbGFzc05hbWVzKTtcblxuICAkOiBmaWxlQ2xhc3NlcyA9IGNsc3godmFsaWRhdGlvbkNsYXNzTmFtZXMsICdjdXN0b20tZmlsZS1pbnB1dCcpO1xuXG4gICQ6IHdyYXBwZXJDbGFzc2VzID0gY2xzeChjdXN0b21DbGFzcywgJ2N1c3RvbS1jb250cm9sJywge1xuICAgICdjdXN0b20tY29udHJvbC1pbmxpbmUnOiBpbmxpbmVcbiAgfSk7XG5cbiAgJDogY3VzdG9tQ29udHJvbENsYXNzZXMgPSBjbHN4KHZhbGlkYXRpb25DbGFzc05hbWVzLCAnY3VzdG9tLWNvbnRyb2wtaW5wdXQnKTtcblxuICAkOiBsYWJlbEh0bWxGb3IgPSBodG1sRm9yIHx8IGlkO1xuPC9zY3JpcHQ+XG5cbnsjaWYgdHlwZSA9PT0gJ3NlbGVjdCd9XG4gIDxzZWxlY3RcbiAgICB7aWR9XG4gICAgY2xhc3M9e2NvbWJpbmVkQ2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIGJpbmQ6dmFsdWVcbiAgICB7bmFtZX1cbiAgICB7ZGlzYWJsZWR9XG4gICAge3BsYWNlaG9sZGVyfVxuICAgIHsuLi5wcm9wc30+XG4gICAgPHNsb3QgLz5cbiAgPC9zZWxlY3Q+XG57OmVsc2UgaWYgdHlwZSA9PT0gJ2ZpbGUnfVxuICA8ZGl2IGNsYXNzPXtjdXN0b21DbGFzc30+XG4gICAgPGlucHV0XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICBjbGFzcz17ZmlsZUNsYXNzZXN9XG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9XG4gICAgICB7Li4ucHJvcHN9IC8+XG4gICAgPGxhYmVsIGNsYXNzPVwiY3VzdG9tLWZpbGUtbGFiZWxcIiBmb3I9e2xhYmVsSHRtbEZvcn0+XG4gICAgICB7bGFiZWwgfHwgJ0Nob29zZSBmaWxlJ31cbiAgICA8L2xhYmVsPlxuICA8L2Rpdj5cbns6ZWxzZSBpZiB0eXBlID09PSAnc3dpdGNoJyB8fCB0eXBlID09PSAnY2hlY2tib3gnfVxuICA8ZGl2IGNsYXNzPXt3cmFwcGVyQ2xhc3Nlc30+XG4gICAgPGlucHV0XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgY2xhc3M9e2N1c3RvbUNvbnRyb2xDbGFzc2VzfVxuICAgICAgYmluZDpjaGVja2VkXG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn1cbiAgICAgIHsuLi5wcm9wc30gLz5cbiAgICA8bGFiZWwgY2xhc3M9XCJjdXN0b20tY29udHJvbC1sYWJlbFwiIGZvcj17bGFiZWxIdG1sRm9yfT57bGFiZWx9PC9sYWJlbD5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbns6ZWxzZSBpZiB0eXBlID09PSAncmFkaW8nfVxuICA8ZGl2IGNsYXNzPXt3cmFwcGVyQ2xhc3Nlc30+XG4gICAgPGlucHV0XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgY2xhc3M9e2N1c3RvbUNvbnRyb2xDbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9XG4gICAgICB7Li4ucHJvcHN9IC8+XG4gICAgPGxhYmVsIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtbGFiZWxcIiBmb3I9e2xhYmVsSHRtbEZvcn0+e2xhYmVsfTwvbGFiZWw+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57OmVsc2V9XG4gIDxpbnB1dFxuICAgIHt0eXBlfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y29tYmluZWRDbGFzc2VzfVxuICAgIG9uOmJsdXJcbiAgICBvbjpmb2N1c1xuICAgIG9uOmNoYW5nZVxuICAgIG9uOmlucHV0XG4gICAge25hbWV9XG4gICAge2Rpc2FibGVkfVxuICAgIHtwbGFjZWhvbGRlcn1cbiAgICB7Li4ucHJvcHN9IC8+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBibG9jayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNoaWxkcmVuID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGNsb3NlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnc2Vjb25kYXJ5JztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGhyZWYgPSAnJztcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgc3R5bGUgPSAnJztcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogYXJpYUxhYmVsID0gJCRwcm9wc1snYXJpYS1sYWJlbCddO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICB7IGNsb3NlIH0sXG4gICAgY2xvc2UgfHwgJ2J0bicsXG4gICAgY2xvc2UgfHwgYGJ0biR7b3V0bGluZSA/ICctb3V0bGluZScgOiAnJ30tJHtjb2xvcn1gLFxuICAgIHNpemUgPyBgYnRuLSR7c2l6ZX1gIDogZmFsc2UsXG4gICAgYmxvY2sgPyAnYnRuLWJsb2NrJyA6IGZhbHNlLFxuICAgIHsgYWN0aXZlIH1cbiAgKTtcblxuICAkOiBkZWZhdWx0QXJpYUxhYmVsID0gY2xvc2UgPyAnQ2xvc2UnIDogbnVsbDtcbjwvc2NyaXB0PlxuXG57I2lmIGhyZWZ9XG4gIDxhXG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7ZGlzYWJsZWR9XG4gICAgb246Y2xpY2tcbiAgICB7aHJlZn1cbiAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWwgfHwgZGVmYXVsdEFyaWFMYWJlbH1cbiAgICB7c3R5bGV9PlxuICAgIHsjaWYgY2hpbGRyZW59XG4gICAgICB7Y2hpbGRyZW59XG4gICAgezplbHNlfVxuICAgICAgPHNsb3QgLz5cbiAgICB7L2lmfVxuICA8L2E+XG57OmVsc2V9XG4gIDxidXR0b25cbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGlja1xuICAgIHt2YWx1ZX1cbiAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWwgfHwgZGVmYXVsdEFyaWFMYWJlbH1cbiAgICB7c3R5bGV9PlxuICAgIDxzbG90PlxuICAgICAgeyNpZiBjbG9zZX1cbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+XG4gICAgICB7OmVsc2UgaWYgY2hpbGRyZW59XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIHs6ZWxzZX1cbiAgICAgICAgPHNsb3QgLz5cbiAgICAgIHsvaWZ9XG4gICAgPC9zbG90PlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBDaGFydCBmcm9tIFwiY2hhcnQuanNcIjtcclxuICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG5cclxuICBjb25zdCBjaGFydERhdGEgPSB7XHJcbiAgICBsYWJlbHM6IFtcIlJlZFwiLCBcIkJsdWVcIiwgXCJZZWxsb3dcIiwgXCJHcmVlblwiLCBcIlB1cnBsZVwiLCBcIk9yYW5nZVwiXSxcclxuICAgIGRhdGFzZXRzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBsYWJlbDogXCIjIG9mIFZvdGVzXCIsXHJcbiAgICAgICAgZGF0YTogWzEyLCAxOSwgMywgNSwgMiwgM10sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICBcInJnYmEoMjU1LCA5OSwgMTMyLCAwLjgpXCIsXHJcbiAgICAgICAgICBcInJnYmEoNTQsIDE2MiwgMjM1LCAwLjgpXCIsXHJcbiAgICAgICAgICBcInJnYmEoMjU1LCAyMDYsIDg2LCAwLjgpXCIsXHJcbiAgICAgICAgICBcInJnYmEoNzUsIDE5MiwgMTkyLCAwLjgpXCIsXHJcbiAgICAgICAgICBcInJnYmEoMTUzLCAxMDIsIDI1NSwgMC44KVwiLFxyXG4gICAgICAgICAgXCJyZ2JhKDI1NSwgMTU5LCA2NCwgMC44KVwiXHJcbiAgICAgICAgXSxcclxuICAgICAgICBib3JkZXJDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiAxXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9O1xyXG4gIGNvbnN0IGNoYXJ0T3B0aW9ucyA9IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICB5QXhlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQoKSB7XHJcbiAgICB2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaWVDaGFydFwiKTtcclxuICAgIHZhciBteUNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xyXG4gICAgICB0eXBlOiBcInBpZVwiLFxyXG4gICAgICBkYXRhOiBjaGFydERhdGEsXHJcbiAgICAgIG9wdGlvbnM6IGNoYXJ0T3B0aW9uc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbk1vdW50KGNyZWF0ZUNoYXJ0KTtcclxuPC9zY3JpcHQ+XHJcblxyXG48Y2FudmFzIGlkPVwicGllQ2hhcnRcIiAvPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBCcmVhZGNydW1iIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGVcIjtcclxuICBpbXBvcnQgQnJlYWRjcnVtYkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9CcmVhZGNydW1iSXRlbS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRCb2R5IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEJvZHkuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRIZWFkZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkSGVhZGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkRm9vdGVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEZvb3Rlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgUm93IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgQXJlYUNoYXJ0IGZyb20gXCIuLi9jb21wb25lbnRzL0NoYXJ0cy9BcmVhQ2hhcnQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJhckNoYXJ0IGZyb20gXCIuLi9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGVcIjtcclxuICBpbXBvcnQgUGllQ2hhcnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvQ2hhcnRzL1BpZUNoYXJ0LnN2ZWx0ZVwiO1xyXG5cclxuICBsZXQgY2FyZEZvb3RlclRleHQgPSBcItCe0LHQvdC+0LLQu9C10L3QviDQstGH0LXRgNCwINCyIDIzOjU5XCI7XHJcbiAgbGV0IGFyZWFDYXJkVGl0bGUgPSBcItCf0YDQuNC80LXRgCDQtNC40LDQs9GA0LDQvNC80Ysg0YDQtdCz0LjQvtC90LBcIjtcclxuICBsZXQgYmFyQ2FyZFRpdGxlID0gXCLQn9GA0LjQvNC10YAg0LPQuNGB0YLQvtCz0YDQsNC80LzRi1wiO1xyXG4gIGxldCBwaWVDYXJkVGl0bGUgPSBcItCf0YDQuNC80LXRgCDQutGA0YPQs9C+0LLQvtC5INC00LjQsNCz0YDQsNC80LzRi1wiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxoMSBjbGFzcz1cIm10LTRcIj7QlNC40LDQs9GA0LDQvNC80Ys8L2gxPlxyXG48QnJlYWRjcnVtYiBjbGFzcz1cIm1iLTRcIj5cclxuICA8QnJlYWRjcnVtYkl0ZW0+XHJcbiAgICA8YSBocmVmPVwiLlwiPtCf0LDQvdC10LvRjDwvYT5cclxuICA8L0JyZWFkY3J1bWJJdGVtPlxyXG4gIDxCcmVhZGNydW1iSXRlbSBhY3RpdmU+0JTQuNCw0LPRgNCw0LzQvNGLPC9CcmVhZGNydW1iSXRlbT5cclxuPC9CcmVhZGNydW1iPlxyXG5cclxuPENhcmQgY2xhc3M9XCJtYi00XCI+XHJcbiAgPENhcmRCb2R5PlxyXG4gICAgQ2hhcnQuanMg0Y/QstC70Y/QtdGC0YHRjyDRgdGC0L7RgNC+0L3QvdC40Lwg0L/Qu9Cw0LPQuNC90L7QvCwg0LrQvtGC0L7RgNGL0Lkg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQs9C10L3QtdGA0LDRhtC40Lgg0LPRgNCw0YTQuNC60L7QsiDQsiDRjdGC0L7QvFxyXG4gICAg0YjQsNCx0LvQvtC9LiDQn9GA0LjQstC10LTQtdC90L3Ri9C1INC90LjQttC1INCz0YDQsNGE0LjQutC4INCx0YvQu9C4INC90LDRgdGC0YDQvtC10L3RiyAtINC00LvRjyDQtNCw0LvRjNC90LXQudGI0LXQuSDQvdCw0YHRgtGA0L7QudC60LguXHJcbiAgICDQstCw0YDQuNCw0L3RgtGLLCDQv9C+0LbQsNC70YPQudGB0YLQsCwg0L/QvtGB0LXRgtC40YLQtSDQvtGE0LjRhtC40LDQu9GM0L3Ri9C5XHJcbiAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly93d3cuY2hhcnRqcy5vcmcvZG9jcy9sYXRlc3QvXCI+XHJcbiAgICAgIENoYXJ0LmpzINC00L7QutGD0LzQtdC90YLQsNGG0LjRj1xyXG4gICAgPC9hPlxyXG4gICAgLlxyXG4gIDwvQ2FyZEJvZHk+XHJcbjwvQ2FyZD5cclxuXHJcbjxDYXJkIGNsYXNzPVwibWItNFwiPlxyXG4gIDxDYXJkSGVhZGVyPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYXJlYVwiIC8+XHJcbiAgICB7YXJlYUNhcmRUaXRsZX1cclxuICA8L0NhcmRIZWFkZXI+XHJcbiAgPENhcmRCb2R5PlxyXG4gICAgPEFyZWFDaGFydCAvPlxyXG4gIDwvQ2FyZEJvZHk+XHJcbiAgPENhcmRGb290ZXIgY2xhc3M9XCJzbWFsbCB0ZXh0LW11dGVkXCI+e2NhcmRGb290ZXJUZXh0fTwvQ2FyZEZvb3Rlcj5cclxuPC9DYXJkPlxyXG5cclxuPFJvdz5cclxuICA8ZGl2IGNsYXNzPVwiY29sLWxnLTZcIj5cclxuICAgIDxDYXJkIGNsYXNzPVwibWItNFwiPlxyXG4gICAgICA8Q2FyZEhlYWRlcj5cclxuICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiAvPlxyXG4gICAgICAgIHtiYXJDYXJkVGl0bGV9XHJcbiAgICAgIDwvQ2FyZEhlYWRlcj5cclxuICAgICAgPENhcmRCb2R5PlxyXG4gICAgICAgIDxCYXJDaGFydCAvPlxyXG4gICAgICA8L0NhcmRCb2R5PlxyXG4gICAgICA8Q2FyZEZvb3RlciBjbGFzcz1cInNtYWxsIHRleHQtbXV0ZWRcIj57Y2FyZEZvb3RlclRleHR9PC9DYXJkRm9vdGVyPlxyXG4gICAgPC9DYXJkPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctNlwiPlxyXG4gICAgPENhcmQgY2xhc3M9XCJtYi00XCI+XHJcbiAgICAgIDxDYXJkSGVhZGVyPlxyXG4gICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LXBpZVwiIC8+XHJcbiAgICAgICAge3BpZUNhcmRUaXRsZX1cclxuICAgICAgPC9DYXJkSGVhZGVyPlxyXG4gICAgICA8Q2FyZEJvZHk+XHJcbiAgICAgICAgPFBpZUNoYXJ0IC8+XHJcbiAgICAgIDwvQ2FyZEJvZHk+XHJcbiAgICAgIDxDYXJkRm9vdGVyIGNsYXNzPVwic21hbGwgdGV4dC1tdXRlZFwiPntjYXJkRm9vdGVyVGV4dH08L0NhcmRGb290ZXI+XHJcbiAgICA8L0NhcmQ+XHJcbiAgPC9kaXY+XHJcbjwvUm93PlxyXG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGZsdWlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgZmx1aWQgPyAnY29udGFpbmVyLWZsdWlkJyA6ICdjb250YWluZXInKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgUm93IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IENvbnRhaW5lciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbnRhaW5lci5zdmVsdGVcIjtcclxuICAgIGltcG9ydCBGb290ZXIgZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvRm9vdGVyLnN2ZWx0ZVwiO1xyXG4gICAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG48L3NjcmlwdD5cclxuXHJcbnsjaWYgc2VnbWVudCA9PT0gJ2F1dGhlbnRpY2F0aW9uJ31cclxuICAgIDxkaXYgaWQ9XCJsYXlvdXRBdXRoZW50aWNhdGlvblwiIGNsYXNzPVwibC1wcm90b24tZGFyay1iZyBcIj5cclxuICAgICAgICA8ZGl2IGlkPVwibGF5b3V0QXV0aGVudGljYXRpb25fY29udGVudFwiPlxyXG4gICAgICAgICAgICA8bWFpbj5cclxuICAgICAgICAgICAgICAgIDxDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNsb3QgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgICAgICA8L21haW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPEZvb3RlciAvPlxyXG4gICAgPC9kaXY+XHJcbns6ZWxzZX1cclxuICAgIDxkaXYgaWQ9XCJsYXlvdXRFcnJvclwiPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJsYXlvdXRFcnJvcl9jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxtYWluPlxyXG4gICAgICAgICAgICAgICAgPENvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgbXQtNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbG90IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICAgICAgPC9tYWluPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxGb290ZXIgLz5cclxuICAgIDwvZGl2PlxyXG57L2lmfSIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG4gIGltcG9ydCB7IGdldENvbHVtblNpemVDbGFzcywgaXNPYmplY3QgfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBjb25zdCBjb2xDbGFzc2VzID0gW107XG4gIGNvbnN0IHdpZHRocyA9IFsneHMnLCAnc20nLCAnbWQnLCAnbGcnLCAneGwnXTtcblxuICB3aWR0aHMuZm9yRWFjaChjb2xXaWR0aCA9PiB7XG4gICAgY29uc3QgY29sdW1uUHJvcCA9ICQkcHJvcHNbY29sV2lkdGhdO1xuICAgIGlmICghY29sdW1uUHJvcCAmJiBjb2x1bW5Qcm9wICE9PSAnJykge1xuICAgICAgcmV0dXJuOyAvL25vIHZhbHVlIGZvciB0aGlzIHdpZHRoXG4gICAgfVxuXG4gICAgY29uc3QgaXNYcyA9IGNvbFdpZHRoID09PSAneHMnO1xuXG4gICAgaWYgKGlzT2JqZWN0KGNvbHVtblByb3ApKSB7XG4gICAgICBjb25zdCBjb2xTaXplSW50ZXJmaXggPSBpc1hzID8gJy0nIDogYC0ke2NvbFdpZHRofS1gO1xuICAgICAgY29uc3QgY29sQ2xhc3MgPSBnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3Auc2l6ZSk7XG5cbiAgICAgIGlmIChjb2x1bW5Qcm9wLnNpemUgfHwgY29sdW1uUHJvcC5zaXplID09PSAnJykge1xuICAgICAgICBjb2xDbGFzc2VzLnB1c2goY29sQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtblByb3AucHVzaCkge1xuICAgICAgICBjb2xDbGFzc2VzLnB1c2goYHB1c2gke2NvbFNpemVJbnRlcmZpeH0ke2NvbHVtblByb3AucHVzaH1gKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2x1bW5Qcm9wLnB1bGwpIHtcbiAgICAgICAgY29sQ2xhc3Nlcy5wdXNoKGBwdWxsJHtjb2xTaXplSW50ZXJmaXh9JHtjb2x1bW5Qcm9wLnB1bGx9YCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sdW1uUHJvcC5vZmZzZXQpIHtcbiAgICAgICAgY29sQ2xhc3Nlcy5wdXNoKGBvZmZzZXQke2NvbFNpemVJbnRlcmZpeH0ke2NvbHVtblByb3Aub2Zmc2V0fWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb2xDbGFzc2VzLnB1c2goZ2V0Q29sdW1uU2l6ZUNsYXNzKGlzWHMsIGNvbFdpZHRoLCBjb2x1bW5Qcm9wKSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoIWNvbENsYXNzZXMubGVuZ3RoKSB7XG4gICAgY29sQ2xhc3Nlcy5wdXNoKCdjb2wnKTtcbiAgfVxuXG4gIGlmIChjbGFzc05hbWUpIHtcbiAgICBjb2xDbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjb2xDbGFzc2VzLmpvaW4oJyAnKX0+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IExvZ2luIGZyb20gXCIuL2xvZ2luLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBSZWdpc3RlciBmcm9tIFwiLi9yZWdpc3Rlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgRm9yZ2V0UGFzc3dvcmQgZnJvbSBcIi4vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcbjwvc2NyaXB0PlxyXG5cclxueyNpZiBzZWdtZW50ID09PSAnbG9naW4nfVxyXG4gIDxMb2dpbiAvPlxyXG57OmVsc2UgaWYgc2VnbWVudCA9PT0gJ3JlZ2lzdGVyJ31cclxuICA8UmVnaXN0ZXIgLz5cclxuezplbHNlIGlmIHNlZ21lbnQgPT09ICdmb3JnZXRfcGFzc3dvcmQnfVxyXG4gIDxGb3JnZXRQYXNzd29yZCAvPlxyXG57L2lmfVxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBFcnJvcjQwMSBmcm9tIFwiLi9lcnJvcl80MDEuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEVycm9yNDA0IGZyb20gXCIuL2Vycm9yXzQwNC5zdmVsdGVcIjtcclxuICBpbXBvcnQgRXJyb3I1MDAgZnJvbSBcIi4vZXJyb3JfNTAwLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcbjwvc2NyaXB0PlxyXG5cclxueyNpZiBzZWdtZW50ID09PSAnZXJyb3JfNDAxJ31cclxuICA8RXJyb3I0MDEgLz5cclxuezplbHNlIGlmIHNlZ21lbnQgPT09ICdlcnJvcl80MDQnfVxyXG4gIDxFcnJvcjQwNCAvPlxyXG57OmVsc2UgaWYgc2VnbWVudCA9PT0gJ2Vycm9yXzUwMCd9XHJcbiAgPEVycm9yNTAwIC8+XHJcbnsvaWZ9XHJcbiIsIjxzY3JpcHQgY29udGV4dD1cIm1vZHVsZVwiPlxyXG5cdGV4cG9ydCBmdW5jdGlvbiBwcmVsb2FkKHsgcGFyYW1zLCBxdWVyeSB9KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5mZXRjaChgYmxvZy5qc29uYCkudGhlbihyID0+IHIuanNvbigpKS50aGVuKHBvc3RzID0+IHtcclxuXHRcdFx0cmV0dXJuIHsgcG9zdHMgfTtcclxuXHRcdH0pO1xyXG5cdH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c2NyaXB0PlxyXG5cdGV4cG9ydCBsZXQgcG9zdHM7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG5cdHVsIHtcclxuXHRcdG1hcmdpbjogMCAwIDFlbSAwO1xyXG5cdFx0bGluZS1oZWlnaHQ6IDEuNTtcclxuXHR9XHJcbjwvc3R5bGU+XHJcblxyXG48c3ZlbHRlOmhlYWQ+XHJcblx0PHRpdGxlPkJsb2c8L3RpdGxlPlxyXG48L3N2ZWx0ZTpoZWFkPlxyXG5cclxuPGgxPlJlY2VudCBwb3N0czwvaDE+XHJcblxyXG48dWw+XHJcblx0eyNlYWNoIHBvc3RzIGFzIHBvc3R9XHJcblx0XHQ8IS0tIHdlJ3JlIHVzaW5nIHRoZSBub24tc3RhbmRhcmQgYHJlbD1wcmVmZXRjaGAgYXR0cmlidXRlIHRvXHJcblx0XHRcdFx0dGVsbCBTYXBwZXIgdG8gbG9hZCB0aGUgZGF0YSBmb3IgdGhlIHBhZ2UgYXMgc29vbiBhc1xyXG5cdFx0XHRcdHRoZSB1c2VyIGhvdmVycyBvdmVyIHRoZSBsaW5rIG9yIHRhcHMgaXQsIGluc3RlYWQgb2ZcclxuXHRcdFx0XHR3YWl0aW5nIGZvciB0aGUgJ2NsaWNrJyBldmVudCAtLT5cclxuXHRcdDxsaT48YSByZWw9J3ByZWZldGNoJyBocmVmPSdibG9nL3twb3N0LnNsdWd9Jz57cG9zdC50aXRsZX08L2E+PC9saT5cclxuXHR7L2VhY2h9XHJcbjwvdWw+IiwiPHNjcmlwdCBjb250ZXh0PVwibW9kdWxlXCI+XHJcblx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHByZWxvYWQoeyBwYXJhbXMsIHF1ZXJ5IH0pIHtcclxuXHRcdC8vIHRoZSBgc2x1Z2AgcGFyYW1ldGVyIGlzIGF2YWlsYWJsZSBiZWNhdXNlXHJcblx0XHQvLyB0aGlzIGZpbGUgaXMgY2FsbGVkIFtzbHVnXS5zdmVsdGVcclxuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuZmV0Y2goYGJsb2cvJHtwYXJhbXMuc2x1Z30uanNvbmApO1xyXG5cdFx0Y29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCk7XHJcblxyXG5cdFx0aWYgKHJlcy5zdGF0dXMgPT09IDIwMCkge1xyXG5cdFx0XHRyZXR1cm4geyBwb3N0OiBkYXRhIH07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVycm9yKHJlcy5zdGF0dXMsIGRhdGEubWVzc2FnZSk7XHJcblx0XHR9XHJcblx0fVxyXG48L3NjcmlwdD5cclxuXHJcbjxzY3JpcHQ+XHJcblx0ZXhwb3J0IGxldCBwb3N0O1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuXHQvKlxyXG5cdFx0QnkgZGVmYXVsdCwgQ1NTIGlzIGxvY2FsbHkgc2NvcGVkIHRvIHRoZSBjb21wb25lbnQsXHJcblx0XHRhbmQgYW55IHVudXNlZCBzdHlsZXMgYXJlIGRlYWQtY29kZS1lbGltaW5hdGVkLlxyXG5cdFx0SW4gdGhpcyBwYWdlLCBTdmVsdGUgY2FuJ3Qga25vdyB3aGljaCBlbGVtZW50cyBhcmVcclxuXHRcdGdvaW5nIHRvIGFwcGVhciBpbnNpZGUgdGhlIHt7e3Bvc3QuaHRtbH19fSBibG9jayxcclxuXHRcdHNvIHdlIGhhdmUgdG8gdXNlIHRoZSA6Z2xvYmFsKC4uLikgbW9kaWZpZXIgdG8gdGFyZ2V0XHJcblx0XHRhbGwgZWxlbWVudHMgaW5zaWRlIC5jb250ZW50XHJcblx0Ki9cclxuXHQuY29udGVudCA6Z2xvYmFsKGgyKSB7XHJcblx0XHRmb250LXNpemU6IDEuNGVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IDUwMDtcclxuXHR9XHJcblxyXG5cdC5jb250ZW50IDpnbG9iYWwocHJlKSB7XHJcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5O1xyXG5cdFx0Ym94LXNoYWRvdzogaW5zZXQgMXB4IDFweCA1cHggcmdiYSgwLDAsMCwwLjA1KTtcclxuXHRcdHBhZGRpbmc6IDAuNWVtO1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogMnB4O1xyXG5cdFx0b3ZlcmZsb3cteDogYXV0bztcclxuXHR9XHJcblxyXG5cdC5jb250ZW50IDpnbG9iYWwocHJlKSA6Z2xvYmFsKGNvZGUpIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG5cdFx0cGFkZGluZzogMDtcclxuXHR9XHJcblxyXG5cdC5jb250ZW50IDpnbG9iYWwodWwpIHtcclxuXHRcdGxpbmUtaGVpZ2h0OiAxLjU7XHJcblx0fVxyXG5cclxuXHQuY29udGVudCA6Z2xvYmFsKGxpKSB7XHJcblx0XHRtYXJnaW46IDAgMCAwLjVlbSAwO1xyXG5cdH1cclxuPC9zdHlsZT5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuXHQ8dGl0bGU+e3Bvc3QudGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuXHJcbjxoMT57cG9zdC50aXRsZX08L2gxPlxyXG5cclxuPGRpdiBjbGFzcz0nY29udGVudCc+XHJcblx0e0BodG1sIHBvc3QuaHRtbH1cclxuPC9kaXY+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IFVpIGZyb20gXCIuL3VpLnN2ZWx0ZVwiO1xyXG5cclxuXHJcbiAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG48L3NjcmlwdD5cclxuXHJcbnsjaWYgc2VnbWVudCA9PT0gJ3VpJ31cclxuICA8VWkgLz5cclxuey9pZn1cclxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBsaWdodCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRhcmsgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBmaXhlZCA9ICcnO1xuICBleHBvcnQgbGV0IHN0aWNreSA9ICcnO1xuICBleHBvcnQgbGV0IGNvbG9yID0gJyc7XG4gIGV4cG9ydCBsZXQgZXhwYW5kID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRFeHBhbmRDbGFzcyhleHBhbmQpIHtcbiAgICBpZiAoZXhwYW5kID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZXhwYW5kID09PSB0cnVlIHx8IGV4cGFuZCA9PT0gJ3hzJykge1xuICAgICAgcmV0dXJuICduYXZiYXItZXhwYW5kJztcbiAgICB9XG5cbiAgICByZXR1cm4gYG5hdmJhci1leHBhbmQtJHtleHBhbmR9YDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ25hdmJhcicsIGdldEV4cGFuZENsYXNzKGV4cGFuZCksIHtcbiAgICAnbmF2YmFyLWxpZ2h0JzogbGlnaHQsXG4gICAgJ25hdmJhci1kYXJrJzogZGFyayxcbiAgICBbYGJnLSR7Y29sb3J9YF06IGNvbG9yLFxuICAgIFtgZml4ZWQtJHtmaXhlZH1gXTogZml4ZWQsXG4gICAgW2BzdGlja3ktJHtzdGlja3l9YF06IHN0aWNreVxuICB9KTtcbjwvc2NyaXB0PlxuXG48bmF2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9uYXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGhyZWYgPSAnLyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICduYXZiYXItYnJhbmQnKTtcbjwvc2NyaXB0PlxuXG48YSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfSB7aHJlZn0+XG4gIDxzbG90IC8+XG48L2E+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHRhYnMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwaWxscyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZlcnRpY2FsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaG9yaXpvbnRhbCA9ICcnO1xuICBleHBvcnQgbGV0IGp1c3RpZmllZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZpbGwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjYXJkID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRWZXJ0aWNhbENsYXNzKHZlcnRpY2FsKSB7XG4gICAgaWYgKHZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodmVydGljYWwgPT09IHRydWUgfHwgdmVydGljYWwgPT09ICd4cycpIHtcbiAgICAgIHJldHVybiAnZmxleC1jb2x1bW4nO1xuICAgIH1cbiAgICByZXR1cm4gYGZsZXgtJHt2ZXJ0aWNhbH0tY29sdW1uYDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBuYXZiYXIgPyAnbmF2YmFyLW5hdicgOiAnbmF2JyxcbiAgICBob3Jpem9udGFsID8gYGp1c3RpZnktY29udGVudC0ke2hvcml6b250YWx9YCA6IGZhbHNlLFxuICAgIGdldFZlcnRpY2FsQ2xhc3ModmVydGljYWwpLFxuICAgIHtcbiAgICAgICduYXYtdGFicyc6IHRhYnMsXG4gICAgICAnY2FyZC1oZWFkZXItdGFicyc6IGNhcmQgJiYgdGFicyxcbiAgICAgICduYXYtcGlsbHMnOiBwaWxscyxcbiAgICAgICdjYXJkLWhlYWRlci1waWxscyc6IGNhcmQgJiYgcGlsbHMsXG4gICAgICAnbmF2LWp1c3RpZmllZCc6IGp1c3RpZmllZCxcbiAgICAgICduYXYtZmlsbCc6IGZpbGxcbiAgICB9XG4gICk7XG48L3NjcmlwdD5cblxuPHVsIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC91bD5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSAnc3ZlbHRlL3RyYW5zaXRpb24nO1xuICBjb25zdCBub29wID0gKCkgPT4gdW5kZWZpbmVkO1xuXG4gIGV4cG9ydCBsZXQgaXNPcGVuID0gZmFsc2U7XG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbmF2YmFyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmluZyA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBvbkV4aXRpbmcgPSBub29wO1xuICBleHBvcnQgbGV0IG9uRXhpdGVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBleHBhbmQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAvLyBjb2xsYXBzZUNsYXNzLFxuICAgIG5hdmJhciAmJiAnbmF2YmFyLWNvbGxhcHNlJ1xuICApO1xuXG4gIGxldCB3aW5kb3dXaWR0aCA9IDA7XG4gIGxldCBfd2FzTWF4aW1hemVkID0gZmFsc2U7XG5cbiAgY29uc3QgbWluV2lkdGggPSB7fTtcbiAgbWluV2lkdGhbJ3hzJ10gPSAwO1xuICBtaW5XaWR0aFsnc20nXSA9IDU3NjtcbiAgbWluV2lkdGhbJ21kJ10gPSA3Njg7XG4gIG1pbldpZHRoWydsZyddID0gOTkyO1xuICBtaW5XaWR0aFsneGwnXSA9IDEyMDA7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgZGlzcGF0Y2goJ3VwZGF0ZScsIHtcbiAgICAgIGlzT3BlbjogaXNPcGVuXG4gICAgfSk7XG4gIH1cblxuICAkOiBpZiAobmF2YmFyICYmIGV4cGFuZCkge1xuICAgIGlmICh3aW5kb3dXaWR0aCA+PSBtaW5XaWR0aFtleHBhbmRdICYmICFpc09wZW4pIHtcbiAgICAgIGlzT3BlbiA9IHRydWU7XG4gICAgICBfd2FzTWF4aW1hemVkID0gdHJ1ZTtcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gZWxzZSBpZiAod2luZG93V2lkdGggPCBtaW5XaWR0aFtleHBhbmRdICYmIF93YXNNYXhpbWF6ZWQpIHtcbiAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgX3dhc01heGltYXplZCA9IGZhbHNlO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPHN2ZWx0ZTp3aW5kb3cgYmluZDppbm5lcldpZHRoPXt3aW5kb3dXaWR0aH0gLz5cblxueyNpZiBpc09wZW59XG4gIDxkaXZcbiAgICB0cmFuc2l0aW9uOnNsaWRlXG4gICAgb246aW50cm9zdGFydFxuICAgIG9uOmludHJvZW5kXG4gICAgb246b3V0cm9zdGFydFxuICAgIG9uOm91dHJvZW5kXG4gICAgb246aW50cm9zdGFydD17b25FbnRlcmluZ31cbiAgICBvbjppbnRyb2VuZD17b25FbnRlcmVkfVxuICAgIG9uOm91dHJvc3RhcnQ9e29uRXhpdGluZ31cbiAgICBvbjpvdXRyb2VuZD17b25FeGl0ZWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCJpbXBvcnQgeyBub29wLCBzYWZlX25vdF9lcXVhbCwgc3Vic2NyaWJlLCBydW5fYWxsLCBpc19mdW5jdGlvbiB9IGZyb20gJy4uL2ludGVybmFsJztcbmV4cG9ydCB7IGdldF9zdG9yZV92YWx1ZSBhcyBnZXQgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0gdmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcn1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRhYmxlKHZhbHVlLCBzdGFydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZTogd3JpdGFibGUodmFsdWUsIHN0YXJ0KS5zdWJzY3JpYmUsXG4gICAgfTtcbn1cbi8qKlxuICogQ3JlYXRlIGEgYFdyaXRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyBib3RoIHVwZGF0aW5nIGFuZCByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7Kj19dmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcj19c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQgPSBub29wKSB7XG4gICAgbGV0IHN0b3A7XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmIChzYWZlX25vdF9lcXVhbCh2YWx1ZSwgbmV3X3ZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICBpZiAoc3RvcCkgeyAvLyBzdG9yZSBpcyByZWFkeVxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bl9xdWV1ZSA9ICFzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgc1sxXSgpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlLnB1c2gocywgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVuX3F1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZVtpXVswXShzdWJzY3JpYmVyX3F1ZXVlW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGUoZm4pIHtcbiAgICAgICAgc2V0KGZuKHZhbHVlKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShydW4sIGludmFsaWRhdGUgPSBub29wKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBbcnVuLCBpbnZhbGlkYXRlXTtcbiAgICAgICAgc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgc3RvcCA9IHN0YXJ0KHNldCkgfHwgbm9vcDtcbiAgICAgICAgfVxuICAgICAgICBydW4odmFsdWUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpYmVycy5pbmRleE9mKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgIHN0b3AgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzZXQsIHVwZGF0ZSwgc3Vic2NyaWJlIH07XG59XG5mdW5jdGlvbiBkZXJpdmVkKHN0b3JlcywgZm4sIGluaXRpYWxfdmFsdWUpIHtcbiAgICBjb25zdCBzaW5nbGUgPSAhQXJyYXkuaXNBcnJheShzdG9yZXMpO1xuICAgIGNvbnN0IHN0b3Jlc19hcnJheSA9IHNpbmdsZVxuICAgICAgICA/IFtzdG9yZXNdXG4gICAgICAgIDogc3RvcmVzO1xuICAgIGNvbnN0IGF1dG8gPSBmbi5sZW5ndGggPCAyO1xuICAgIHJldHVybiByZWFkYWJsZShpbml0aWFsX3ZhbHVlLCAoc2V0KSA9PiB7XG4gICAgICAgIGxldCBpbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgIGxldCBwZW5kaW5nID0gMDtcbiAgICAgICAgbGV0IGNsZWFudXAgPSBub29wO1xuICAgICAgICBjb25zdCBzeW5jID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbihzaW5nbGUgPyB2YWx1ZXNbMF0gOiB2YWx1ZXMsIHNldCk7XG4gICAgICAgICAgICBpZiAoYXV0bykge1xuICAgICAgICAgICAgICAgIHNldChyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCA9IGlzX2Z1bmN0aW9uKHJlc3VsdCkgPyByZXN1bHQgOiBub29wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZXJzID0gc3RvcmVzX2FycmF5Lm1hcCgoc3RvcmUsIGkpID0+IHN1YnNjcmliZShzdG9yZSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBlbmRpbmcgJj0gfigxIDw8IGkpO1xuICAgICAgICAgICAgaWYgKGluaXRlZCkge1xuICAgICAgICAgICAgICAgIHN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcGVuZGluZyB8PSAoMSA8PCBpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBpbml0ZWQgPSB0cnVlO1xuICAgICAgICBzeW5jKCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICAgICAgcnVuX2FsbCh1bnN1YnNjcmliZXJzKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgZGVyaXZlZCwgcmVhZGFibGUsIHdyaXRhYmxlIH07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDb250ZXh0ID0gKCkgPT4gd3JpdGFibGUoe30pOyIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAnLi9Ecm9wZG93bkNvbnRleHQnO1xuXG4gIGxldCBjb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuICBzZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnLCBjb250ZXh0KTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGRpcmVjdGlvbiA9ICdkb3duJztcbiAgZXhwb3J0IGxldCBncm91cCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFkZG9uVHlwZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0b2dnbGUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGNvbnN0IHZhbGlkRGlyZWN0aW9ucyA9IFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J107XG5cbiAgaWYgKHZhbGlkRGlyZWN0aW9ucy5pbmRleE9mKGRpcmVjdGlvbikgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgZGlyZWN0aW9uIHNlbnQ6ICcke2RpcmVjdGlvbn0nIGlzIG5vdCBvbmUgb2YgJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCdgXG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb21wb25lbnQ7XG5cbiAgJDogc3ViSXRlbUlzQWN0aXZlID0gISEoXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmXG4gICAgY29tcG9uZW50ICYmXG4gICAgdHlwZW9mIGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY3RpdmUnKVxuICApO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBkaXJlY3Rpb24gIT09ICdkb3duJyAmJiBgZHJvcCR7ZGlyZWN0aW9ufWAsXG4gICAgbmF2ICYmIGFjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmIHN1Ykl0ZW1Jc0FjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAge1xuICAgICAgW2BpbnB1dC1ncm91cC0ke2FkZG9uVHlwZX1gXTogYWRkb25UeXBlLFxuICAgICAgJ2J0bi1ncm91cCc6IGdyb3VwLFxuICAgICAgW2BidG4tZ3JvdXAtJHtzaXplfWBdOiAhIXNpemUsXG4gICAgICBkcm9wZG93bjogIWdyb3VwICYmICFhZGRvblR5cGUsXG4gICAgICBzaG93OiBpc09wZW4sXG4gICAgICAnbmF2LWl0ZW0nOiBuYXZcbiAgICB9XG4gICk7XG5cbiAgJDoge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIFsnY2xpY2snLCAndG91Y2hzdGFydCcsICdrZXl1cCddLmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVEb2N1bWVudENsaWNrLCB0cnVlKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgWydjbGljaycsICd0b3VjaHN0YXJ0JywgJ2tleXVwJ10uZm9yRWFjaChldmVudCA9PlxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZURvY3VtZW50Q2xpY2ssIHRydWUpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJDoge1xuICAgIGNvbnRleHQudXBkYXRlKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvZ2dsZSxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbiA9PT0gJ2Rvd24nICYmIGRyb3B1cCA/ICd1cCcgOiBkaXJlY3Rpb24sXG4gICAgICAgIGluTmF2YmFyXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRG9jdW1lbnRDbGljayhlKSB7XG4gICAgaWYgKGUgJiYgKGUud2hpY2ggPT09IDMgfHwgKGUudHlwZSA9PT0gJ2tleXVwJyAmJiBlLndoaWNoICE9PSA5KSkpIHJldHVybjtcblxuICAgIGlmIChcbiAgICAgIGNvbXBvbmVudC5jb250YWlucyhlLnRhcmdldCkgJiZcbiAgICAgIGNvbXBvbmVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgIChlLnR5cGUgIT09ICdrZXl1cCcgfHwgZS53aGljaCA9PT0gOSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2dnbGUoZSk7XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIG5hdn1cbiAgPGxpIGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2xpPlxuezplbHNlfVxuICA8ZGl2IGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9Ecm9wZG93bi5zdmVsdGUnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXJlY3Rpb24gPSAnZG93bic7XG4gIGV4cG9ydCBsZXQgZ3JvdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXYgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkZWZhdWx0T3BlbiA9IGZhbHNlO1xuXG4gIGxldCBpc09wZW4gPSBkZWZhdWx0T3BlbjtcbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG48RHJvcGRvd25cbiAgey4uLnByb3BzfVxuICB7aXNPcGVufVxuICB0b2dnbGU9eygpID0+IChpc09wZW4gPSAhaXNPcGVuKX1cbiAgY2xhc3M9e2NsYXNzTmFtZX1cbiAge2Rpc2FibGVkfVxuICB7ZGlyZWN0aW9ufVxuICB7Z3JvdXB9XG4gIHtuYXZ9XG4gIHthY3RpdmV9XG4gIHthZGRvblR5cGV9XG4gIHtzaXplfVxuICB7aW5OYXZiYXJ9XG4gIHtzZXRBY3RpdmVGcm9tQ2hpbGR9XG4gIHtkcm9wdXB9PlxuICA8c2xvdCAvPlxuPC9Ecm9wZG93bj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgQnV0dG9uIGZyb20gJy4vQnV0dG9uLnN2ZWx0ZSc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgY2FyZXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9ICdzZWNvbmRhcnknO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYXJpYUhhc3BvcHVwID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBhcmlhTGFiZWwgPSAnVG9nZ2xlIERyb3Bkb3duJztcbiAgZXhwb3J0IGxldCBzcGxpdCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0YWcgPSBudWxsO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwge1xuICAgICdkcm9wZG93bi10b2dnbGUnOiBjYXJldCB8fCBzcGxpdCxcbiAgICAnZHJvcGRvd24tdG9nZ2xlLXNwbGl0Jzogc3BsaXQsXG4gICAgJ25hdi1saW5rJzogbmF2XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbihlKSB7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5hdikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgICRjb250ZXh0LnRvZ2dsZShlKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgbmF2fVxuICA8YVxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAgaHJlZj1cIiNuYXZcIlxuICAgIHthcmlhSGFzcG9wdXB9XG4gICAgY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L2E+XG57OmVsc2UgaWYgdGFnID09PSAnc3Bhbid9XG4gIDxzcGFuXG4gICAgey4uLnByb3BzfVxuICAgIG9uOmNsaWNrXG4gICAgb246Y2xpY2s9e3RvZ2dsZUJ1dHRvbn1cbiAgICB7YXJpYUhhc3BvcHVwfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtjb2xvcn1cbiAgICB7c2l6ZX0+XG4gICAgPHNsb3Q+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj57YXJpYUxhYmVsfTwvc3Bhbj5cbiAgICA8L3Nsb3Q+XG4gIDwvc3Bhbj5cbns6ZWxzZX1cbiAgPEJ1dHRvblxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAge2FyaWFIYXNwb3B1cH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7Y29sb3J9XG4gICAge3NpemV9XG4gICAge291dGxpbmV9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L0J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgcmlnaHQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2Ryb3Bkb3duLW1lbnUnLCB7XG4gICAgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnOiByaWdodCxcbiAgICBzaG93OiAkY29udGV4dC5pc09wZW5cbiAgfSk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnKTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXZpZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaGVhZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdG9nZ2xlID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBocmVmID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIHtcbiAgICBkaXNhYmxlZCxcbiAgICAnZHJvcGRvd24taXRlbSc6ICFkaXZpZGVyICYmICFoZWFkZXIsXG4gICAgYWN0aXZlOiBhY3RpdmUsXG4gICAgJ2Ryb3Bkb3duLWhlYWRlcic6IGhlYWRlcixcbiAgICAnZHJvcGRvd24tZGl2aWRlcic6IGRpdmlkZXJcbiAgfSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQgfHwgaGVhZGVyIHx8IGRpdmlkZXIpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAkY29udGV4dC50b2dnbGUoZSk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxueyNpZiBoZWFkZXJ9XG4gIDxoNiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2g2PlxuXG57OmVsc2UgaWYgZGl2aWRlcn1cbiAgPGRpdiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbns6ZWxzZSBpZiBocmVmfVxuICA8YSBvbjp7Li4ucHJvcHN9IGNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IHtocmVmfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9hPlxuezplbHNlfVxuICA8YnV0dG9uIHsuLi5wcm9wc30gb246Y2xpY2sgb246Y2xpY2s9e2hhbmRsZUl0ZW1DbGlja30gY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZmx1c2ggPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnbGlzdC1ncm91cCcsXG4gICAgZmx1c2ggPyAnbGlzdC1ncm91cC1mbHVzaCcgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbjx1bCB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvdWw+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnaW5wdXQtZ3JvdXAnLFxuICAgIHNpemUgPyBgaW5wdXQtZ3JvdXAtJHtzaXplfWAgOiBudWxsXG4gICk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGU7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBpZiAoWydwcmVwZW5kJywgJ2FwcGVuZCddLmluZGV4T2YoYWRkb25UeXBlKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgYWRkb25UeXBlIG11c3QgYmUgb25lIG9mICdwcmVwZW5kJywgJ2FwcGVuZCcuIFJlY2VpdmVkICcke2FkZG9uVHlwZX0nIGluc3RlYWQuYFxuICAgICk7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIGBpbnB1dC1ncm91cC0ke2FkZG9uVHlwZX1gKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBOYXZiYXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhckJyYW5kIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2YmFyQnJhbmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhclRvZ2dsZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXJUb2dnbGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXYgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZJdGVtLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXZMaW5rIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2TGluay5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ29sbGFwc2UgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Db2xsYXBzZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgVW5jb250cm9sbGVkRHJvcGRvd24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9VbmNvbnRyb2xsZWREcm9wZG93bi5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25Ub2dnbGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93blRvZ2dsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25NZW51IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25NZW51LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBEcm9wZG93bkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExpc3RHcm91cCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0xpc3RHcm91cC5zdmVsdGVcIjtcclxuICBpbXBvcnQgRm9ybSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Zvcm0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0R3JvdXAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBJbnB1dEdyb3VwQWRkb24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwQWRkb24uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExhYmVsIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTGFiZWwuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEN1c3RvbUlucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ3VzdG9tSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBjb2xvcjtcclxuICBleHBvcnQgbGV0IHRpdGxlO1xyXG5cclxuICBmdW5jdGlvbiBzZWFyY2hIYW5kbGUoKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48TmF2YmFyIGNsYXNzPVwibC1wcm90b24tdG9wbmF2IG5hdmJhci1leHBhbmRcIiB7Y29sb3J9IGRhcmsgZXhwYW5kPVwibWRcIj5cclxuICA8TmF2YmFyQnJhbmQgaHJlZj1cIi5cIj48c3BhbiBjbGFzcz1cImwtbG9nby1zcGFuXCI+zrs8L3NwYW4+e3RpdGxlfTxzcGFuIGNsYXNzPVwibC1sb2dvLXNwYW5cIj4uanM8L3NwYW4+PC9OYXZiYXJCcmFuZD5cclxuICA8TmF2IGNsYXNzPVwibWwtYXV0b1wiIG5hdmJhcj5cclxuICAgIDxGb3JtIGlubGluZT5cclxuICAgICAgPElucHV0R3JvdXA+XHJcbiAgICAgICAgPElucHV0XHJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG5hbWU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgaWQ9XCJleGFtcGxlU2VhcmNoXCJcclxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0JjRgdC60LDRgtGMLi5cIiAvPlxyXG4gICAgICAgIDxJbnB1dEdyb3VwQWRkb24gYWRkb25UeXBlPXsnYXBwZW5kJ30+XHJcbiAgICAgICAgICA8QnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIG9uOmNsaWNrPXtzZWFyY2hIYW5kbGV9PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zZWFyY2hcIiAvPlxyXG4gICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgPC9JbnB1dEdyb3VwQWRkb24+XHJcbiAgICAgIDwvSW5wdXRHcm91cD5cclxuICAgIDwvRm9ybT5cclxuICAgIDxMaXN0R3JvdXAgY2xhc3M9XCJtbC1hdXRvIG1sLW1kLTBcIj5cclxuICAgICAgPFVuY29udHJvbGxlZERyb3Bkb3duIG5hdiBpbk5hdmJhcj5cclxuICAgICAgICA8RHJvcGRvd25Ub2dnbGUgbmF2IGNhcmV0PlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdXNlci1jaXJjbGUgZmEtZncgbWwtM1wiIC8+XHJcbiAgICAgICAgPC9Ecm9wZG93blRvZ2dsZT5cclxuICAgICAgICA8RHJvcGRvd25NZW51IHJpZ2h0PlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbT4gICAgICAgICBcclxuICAgICBcclxuICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCJzZXR0aW5nc1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNvZ1wiIC8+INCd0LDRgdGC0YDQvtC50LrQuDwvYT5cclxuICAgICAgICAgIDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cImFjdGl2aXR5X2xvZ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNsaXBib2FyZC1saXN0XCI+PC9pPiDQkNC60YLQuNCy0L3QvtGB0YLRjDwvYT5cclxuICAgICAgICAgIDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbSBkaXZpZGVyIC8+XHJcbiAgICAgICAgICA8RHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vbG9naW5cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc2lnbi1vdXQtYWx0XCI+PC9pPiAg0JLRi9C50YLQuFxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICA8L0Ryb3Bkb3duTWVudT5cclxuICAgICAgPC9VbmNvbnRyb2xsZWREcm9wZG93bj5cclxuICAgIDwvTGlzdEdyb3VwPlxyXG4gIDwvTmF2PlxyXG48L05hdmJhcj5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XHJcblxyXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XHJcblxyXG4gIGV4cG9ydCBsZXQgdGV4dCA9IFwiZmRmZFwiO1xyXG4gIGV4cG9ydCBsZXQgaHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCI7XHJcbiAgZXhwb3J0IGxldCBsZWZ0SWNvbiA9IGZhbHNlO1xyXG4gIGV4cG9ydCBsZXQgcmlnaHRJY29uID0gZmFsc2U7XHJcblxyXG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xyXG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xyXG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xyXG4gICAgZGlzcGF0Y2goXCJwcmVzc1wiKTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxhIGNsYXNzPVwibmF2LWxpbmsge2NsYXNzTmFtZX1cIiB7aHJlZn0gb246Y2xpY2s9e2hhbmRsZUNsaWNrfT5cclxuICB7I2lmIGxlZnRJY29ufVxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLW5hdi1saW5rLWljb25cIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImxlZnRJY29uXCIgLz5cclxuICAgIDwvZGl2PlxyXG4gIHsvaWZ9XHJcbiAge3RleHR9XHJcbiAgeyNpZiByaWdodEljb259XHJcbiAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1jb2xsYXBzZS1hcnJvd1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwicmlnaHRJY29uXCIgLz5cclxuICAgIDwvZGl2PlxyXG4gIHsvaWZ9XHJcbjwvYT5cclxuIiwiPHNjcmlwdD5cclxuICAvL9CY0LzQv9C+0YDRgtC40YDRg9C10Lwg0LrQvtC80L/QvtC90YLRiyDQuNC3IGJvb3RzdHJhcCBzdmVsdGVzdHJhcFxyXG4gIGltcG9ydCBDb2xsYXBzZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXYgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlXCI7XHJcbiAgLy/QmNC80L/QvtGA0YLQuNGA0YPQtdC8IFNpZGViYXJJdGVtXHJcbiAgaW1wb3J0IFNpZGViYXJJdGVtIGZyb20gXCIuL1NpZGViYXJJdGVtLnN2ZWx0ZVwiO1xyXG4gIC8vc2VnbWVudCDQtdGB0YLRjCDQv9C10YDQtdC80LXQvdC90LDRjyDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyDRgdC+0YHRgtC+0Y/QvdC40Y8g0Y3Qu9C10LzQtdC90LDRgiDQvNC10L3RjiDQuCDQv9GA0L7QstC10YDQutCwINC00LvRjyDQv9C+0LTRgNGD0LfQutC4INCyINGB0LDQudC00LHQsNGAXHJcbiAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG4gIC8vdGhlbWUg0L/QtdGA0LXQvNC10L3QvdCw0Y8g0LTQu9GPINGF0YDQsNC90LXQvdC40Y8g0YHQvtGB0YLQvtGP0L3QuNGPINGC0LXQvNGLXHJcbiAgZXhwb3J0IGxldCB0aGVtZTtcclxuXHJcbiAgJDogc2lkZW5hdl90aGVtZSA9IGBsLXByb3Rvbi1zaWRlbmF2LSR7dGhlbWV9YDtcclxuXHJcbiAgbGV0IGlzTGF5b3V0T3BlbiA9IGZhbHNlO1xyXG4gIGxldCBpc1BhZ2VPcGVuID0gZmFsc2U7XHJcbiAgbGV0IGlzQXV0aGVudGljYXRpb25PcGVuID0gZmFsc2U7XHJcbiAgbGV0IGlzRXJyb3JPcGVuID0gZmFsc2U7XHJcbiAgbGV0IGlzVWlPcGVuID0gZmFsc2U7XHJcbiAgbGV0IGFjdGl2ZUxpbmsgPSBcItCf0LDQvdC10LvRjFwiO1xyXG4gIGxldCBmb290ZXJOYW1lID0gXCLOu3Byb3RvbiBib3lcIjtcclxuICBsZXQgZm9vdGVyVGV4dCA9IFwi0JLRiyDQstC+0YjQu9C4INC60LDQujpcIjtcclxuXHJcbiAgY29uc3QgdXBkYXRlQWN0aXZlTGluayA9IGxpbmtOYW1lID0+IChhY3RpdmVMaW5rID0gbGlua05hbWUpO1xyXG5cclxuICBjb25zdCB0b2dnbGVVaSA9ICgpID0+IHtcclxuICAgIGlzVWlPcGVuID0gIWlzVWlPcGVuO1xyXG4gICAgaWYgKGlzUGFnZU9wZW4gPT09IHRydWUpIGlzUGFnZU9wZW4gPSBmYWxzZTtcclxuICB9O1xyXG5cclxuXHJcbiAgY29uc3QgdG9nZ2xlTGF5b3V0ID0gKCkgPT4ge1xyXG4gICAgaXNMYXlvdXRPcGVuID0gIWlzTGF5b3V0T3BlbjtcclxuICAgIGlmIChpc1BhZ2VPcGVuID09PSB0cnVlKSBpc1BhZ2VPcGVuID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlUGFnZXMgPSAoKSA9PiB7XHJcbiAgICBpc1BhZ2VPcGVuID0gIWlzUGFnZU9wZW47XHJcbiAgICBpZiAoaXNMYXlvdXRPcGVuID09PSB0cnVlKSBpc0xheW91dE9wZW4gPSBmYWxzZTtcclxuICAgIGlmIChpc1BhZ2VPcGVuID09PSBmYWxzZSkge1xyXG4gICAgICBpc0F1dGhlbnRpY2F0aW9uT3BlbiA9IGZhbHNlO1xyXG4gICAgICBpc0Vycm9yT3BlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHRvZ2dsZUF1dGhlbnRpY2F0aW9uID0gKCkgPT4ge1xyXG4gICAgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSAhaXNBdXRoZW50aWNhdGlvbk9wZW47XHJcbiAgICBpZiAoaXNFcnJvck9wZW4gPT09IHRydWUpIGlzRXJyb3JPcGVuID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlRXJyb3IgPSAoKSA9PiB7XHJcbiAgICBpc0Vycm9yT3BlbiA9ICFpc0Vycm9yT3BlbjtcclxuICAgIGlmIChpc0F1dGhlbnRpY2F0aW9uT3BlbiA9PT0gdHJ1ZSkgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSBmYWxzZTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgaWQ9XCJsYXlvdXRTaWRlbmF2X25hdlwiIGNsYXNzPVwibC1wcm90b24tbmF2LWZpeGVkXCI+XHJcbiAgPE5hdlxyXG4gICAgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2IHtzaWRlbmF2X3RoZW1lfSBhY2NvcmRpb24gbC1wcm90b24tbmF2LWZpeGVkXCJcclxuICAgIGlkPVwic2lkZW5hdkFjY29yZGlvblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudVwiPlxyXG4gICAgICA8TmF2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtaGVhZGluZ1wiPtCv0LTRgNC+PC9kaXY+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB0ZXh0PVwi0J/QsNC90LXQu9GMXCJcclxuICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnLicgfHwgc2VnbWVudCA9PT0gdW5kZWZpbmVkID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgIGxlZnRJY29uXHJcbiAgICAgICAgICBocmVmPVwiLlwiPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYXRvbVwiIHNsb3Q9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1oZWFkaW5nXCI+0JjQvdGC0LXRgNGE0LXQudGBPC9kaXY+XHJcblxyXG5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVMYXlvdXR9XHJcbiAgICAgICAgICBjbGFzcz17IWlzTGF5b3V0T3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICB0ZXh0PVwi0JzQsNC60LXRgtGLXCJcclxuICAgICAgICAgIGxlZnRJY29uXHJcbiAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jb2x1bW5zXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG5cclxuICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc0xheW91dE9wZW59PlxyXG4gICAgICAgICAgPE5hdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWRcIj5cclxuXHJcbiAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUxpbmsoJ9Ch0YLQsNGC0LjRh9C10YHQutCw0Y8g0L3QsNCy0LjQs9Cw0YbQuNGPJyk7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJ2xheW91dHMnICYmIGFjdGl2ZUxpbmsgPT09ICfQodGC0LDRgtC40YfQtdGB0LrQsNGPINC90LDQstC40LPQsNGG0LjRjycgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgICAgIGhyZWY9XCJsYXlvdXRzL3N0YXRpY19uYXZpZ2F0aW9uXCJcclxuICAgICAgICAgICAgICB0ZXh0PVwi0KHRgtCw0YLQuNGH0LXRgdC60LDRjyDQvdCw0LLQuNCz0LDRhtC40Y9cIiAvPlxyXG4gICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhlbWUgPSAnbGlnaHQnO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQWN0aXZlTGluaygn0KHQstC10YLQu9GL0Lkg0YHQsNC50LTQsdCw0YAnKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnbGF5b3V0cycgJiYgYWN0aXZlTGluayA9PT0gJ9Ch0LLQtdGC0LvRi9C5INGB0LDQudC00LHQsNGAJyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICAgICAgaHJlZj1cImxheW91dHMvbGlnaHRfc2lkZW5hdlwiXHJcbiAgICAgICAgICAgICAgdGV4dD1cIkxpZ2h0IFNpZGVuYXZcIiAvPlxyXG4gICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVQYWdlc31cclxuICAgICAgICAgIGNsYXNzPXshaXNQYWdlT3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICB0ZXh0PVwi0KHRgtGA0LDQvdC40YbRi1wiXHJcbiAgICAgICAgICBsZWZ0SWNvblxyXG4gICAgICAgICAgcmlnaHRJY29uPlxyXG4gICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICBzbG90PVwibGVmdEljb25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cInN2Zy1pbmxpbmUtLWZhIGZhLWJvb2stb3BlbiBmYS13LTE4XCJcclxuICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcclxuICAgICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxyXG4gICAgICAgICAgICBkYXRhLXByZWZpeD1cImZhc1wiXHJcbiAgICAgICAgICAgIGRhdGEtaWNvbj1cImJvb2stb3BlblwiXHJcbiAgICAgICAgICAgIHJvbGU9XCJpbWdcIlxyXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCA1NzYgNTEyXCJcclxuICAgICAgICAgICAgZGF0YS1mYS1pMnN2Zz1cIlwiPlxyXG4gICAgICAgICAgICA8cGF0aFxyXG4gICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICAgICAgICAgIGQ9XCJNNTQyLjIyIDMyLjA1Yy01NC44IDMuMTEtMTYzLjcyIDE0LjQzLTIzMC45NiA1NS41OS00LjY0XHJcbiAgICAgICAgICAgICAgMi44NC03LjI3IDcuODktNy4yNyAxMy4xN3YzNjMuODdjMCAxMS41NSAxMi42MyAxOC44NSAyMy4yOCAxMy40OVxyXG4gICAgICAgICAgICAgIDY5LjE4LTM0LjgyIDE2OS4yMy00NC4zMiAyMTguNy00Ni45MiAxNi44OS0uODkgMzAuMDItMTQuNDNcclxuICAgICAgICAgICAgICAzMC4wMi0zMC42NlY2Mi43NWMuMDEtMTcuNzEtMTUuMzUtMzEuNzQtMzMuNzctMzAuN3pNMjY0LjczXHJcbiAgICAgICAgICAgICAgODcuNjRDMTk3LjUgNDYuNDggODguNTggMzUuMTcgMzMuNzggMzIuMDUgMTUuMzYgMzEuMDEgMCA0NS4wNCAwXHJcbiAgICAgICAgICAgICAgNjIuNzVWNDAwLjZjMCAxNi4yNCAxMy4xMyAyOS43OCAzMC4wMiAzMC42NiA0OS40OSAyLjYgMTQ5LjU5IDEyLjExXHJcbiAgICAgICAgICAgICAgMjE4Ljc3IDQ2Ljk1IDEwLjYyIDUuMzUgMjMuMjEtMS45NFxyXG4gICAgICAgICAgICAgIDIzLjIxLTEzLjQ2VjEwMC42M2MwLTUuMjktMi42Mi0xMC4xNC03LjI3LTEyLjk5elwiIC8+XHJcbiAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzUGFnZU9wZW59PlxyXG4gICAgICAgICAgPE5hdlxyXG4gICAgICAgICAgICBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWQgYWNjb3JkaW9uXCJcclxuICAgICAgICAgICAgaWQ9XCJzaWRlbmF2QWNjb3JkaW9uUGFnZXNcIj5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9e3RvZ2dsZUF1dGhlbnRpY2F0aW9ufVxyXG4gICAgICAgICAgICAgIGNsYXNzPXshaXNBdXRoZW50aWNhdGlvbk9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgICAgIHRleHQ9XCLQkNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNGPXCJcclxuICAgICAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc0F1dGhlbnRpY2F0aW9uT3Blbn0+XHJcbiAgICAgICAgICAgICAgPE5hdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWRcIj5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbSBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vbG9naW5cIiB0ZXh0PVwi0JvQvtCz0LjQvVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICAgICAgaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL3JlZ2lzdGVyXCJcclxuICAgICAgICAgICAgICAgICAgdGV4dD1cItCX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICAgICAgaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL2ZvcmdldF9wYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ9XCLQl9Cw0LHRi9C70Lgg0L/QsNGA0L7Qu9GMXCIgLz5cclxuICAgICAgICAgICAgICA8L05hdj5cclxuICAgICAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9e3RvZ2dsZUVycm9yfVxyXG4gICAgICAgICAgICAgIGNsYXNzPXshaXNFcnJvck9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgICAgIHRleHQ9XCLQntGI0LjQsdC60LBcIlxyXG4gICAgICAgICAgICAgIHJpZ2h0SWNvbj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hbmdsZS1kb3duXCIgc2xvdD1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICAgICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzRXJyb3JPcGVufT5cclxuICAgICAgICAgICAgICA8TmF2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LW5lc3RlZFwiPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl80MDFcIiB0ZXh0PVwiNDAxIFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl80MDRcIiB0ZXh0PVwiNDA0IFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl81MDBcIiB0ZXh0PVwiNTAwIFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LWhlYWRpbmdcIj7QkNC00LTQvtC90Ysg0Lgg0L/RgNC40LzQtdGB0Lg8L2Rpdj5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnY2hhcnRzJyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICBocmVmPVwiY2hhcnRzXCJcclxuICAgICAgICAgIHRleHQ9XCLQlNC40LDQs9GA0LDQvNC80YtcIlxyXG4gICAgICAgICAgbGVmdEljb24+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1hcmVhXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICd0YWJsZXMnID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoZW1lID0gJ2RhcmsnO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIGhyZWY9XCJ0YWJsZXNcIlxyXG4gICAgICAgICAgdGV4dD1cItCi0LDQsdC70LjRhtGLXCJcclxuICAgICAgICAgIGxlZnRJY29uPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGFibGVcIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcblxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgICAgb246cHJlc3M9e3RvZ2dsZVVpfVxyXG4gICAgICAgICAgICAgICAgY2xhc3M9eyFpc1VpT3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICAgICAgICB0ZXh0PVwiVUlcIlxyXG4gICAgICAgICAgICAgICAgbGVmdEljb25cclxuICAgICAgICAgICAgICAgIHJpZ2h0SWNvbj5cclxuXHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1ncmlwLWhvcml6b250YWxcIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgIDwvTmF2PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtZm9vdGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJzbWFsbFwiPntmb290ZXJUZXh0fTwvZGl2PlxyXG4gICAgICB7Zm9vdGVyTmFtZX1cclxuICAgIDwvZGl2PlxyXG4gIDwvTmF2PlxyXG48L2Rpdj5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgQ29udGFpbmVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ29udGFpbmVyLnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgTmF2YmFyIGZyb20gXCIuLi9jb21wb25lbnRzL05hdmJhci5zdmVsdGVcIjtcclxuICBpbXBvcnQgU2lkZWJhciBmcm9tIFwiLi4vY29tcG9uZW50cy9TaWRlYmFyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBGb290ZXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvRm9vdGVyLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcblxyXG4gIGxldCB0aGVtZSA9IFwiZGFya1wiO1xyXG4gIGxldCBjb2xvciA9IFwiZGFya1wiO1xyXG4gIGxldCB0aXRsZSA9IFwicHJvdG9uXCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG4gIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuXHJcbnsjaWYgc2VnbWVudCAhPT0gJ3BhZ2VzJ31cclxuICA8ZGl2IGNsYXNzPVwibC1wcm90b24tbmF2LXN0YXRpY1wiPlxyXG4gICAgPE5hdmJhciB7c2VnbWVudH0ge2NvbG9yfSB7dGl0bGV9IC8+XHJcbiAgICA8ZGl2IGlkPVwibGF5b3V0U2lkZW5hdlwiPlxyXG4gICAgICA8U2lkZWJhciB7c2VnbWVudH0ge3RoZW1lfSAvPlxyXG4gICAgICA8ZGl2IGlkPVwibGF5b3V0U2lkZW5hdl9jb250ZW50XCI+XHJcbiAgICAgICAgPG1haW4+XHJcbiAgICAgICAgICA8Q29udGFpbmVyIGZsdWlkPXt0cnVlfT5cclxuICAgICAgICAgICAgPHNsb3QgLz5cclxuICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgIDwvbWFpbj5cclxuICAgICAgICA8Rm9vdGVyIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbns6ZWxzZX1cclxuICA8Ym9keT5cclxuICAgIDxzbG90IC8+XHJcbiAgPC9ib2R5PlxyXG57L2lmfVxyXG4iLCI8c2NyaXB0PlxyXG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xyXG5cdGV4cG9ydCBsZXQgZXJyb3I7XHJcblxyXG5cdGNvbnN0IGRldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuXHRoMSwgcCB7XHJcblx0XHRtYXJnaW46IDAgYXV0bztcclxuXHR9XHJcblxyXG5cdGgxIHtcclxuXHRcdGZvbnQtc2l6ZTogMi44ZW07XHJcblx0XHRmb250LXdlaWdodDogNzAwO1xyXG5cdFx0bWFyZ2luOiAwIDAgMC41ZW0gMDtcclxuXHR9XHJcblxyXG5cdHAge1xyXG5cdFx0bWFyZ2luOiAxZW0gYXV0bztcclxuXHR9XHJcblxyXG5cdEBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xyXG5cdFx0aDEge1xyXG5cdFx0XHRmb250LXNpemU6IDRlbTtcclxuXHRcdH1cclxuXHR9XHJcbjwvc3R5bGU+XHJcblxyXG48c3ZlbHRlOmhlYWQ+XHJcblx0PHRpdGxlPntzdGF0dXN9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuXHJcbjxoMT57c3RhdHVzfTwvaDE+XHJcblxyXG48cD57ZXJyb3IubWVzc2FnZX08L3A+XHJcblxyXG57I2lmIGRldiAmJiBlcnJvci5zdGFja31cclxuXHQ8cHJlPntlcnJvci5zdGFja308L3ByZT5cclxuey9pZn1cclxuIiwiLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0IVxuaW1wb3J0ICogYXMgcm91dGVfMCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2Jsb2cvaW5kZXguanNvbi5qc1wiO1xuaW1wb3J0ICogYXMgcm91dGVfMSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2Jsb2cvW3NsdWddLmpzb24uanNcIjtcbmltcG9ydCBjb21wb25lbnRfMCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2luZGV4LnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvYWN0aXZpdHlfbG9nLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8yIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvc2V0dGluZ3Muc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzMgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9sYXlvdXRzL3N0YXRpY19uYXZpZ2F0aW9uLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF80IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvbGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF81IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvY2hhcnRzLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF82IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvdGFibGVzLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF83IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvX2xheW91dC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfOCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL19sYXlvdXQuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzkgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9hdXRoZW50aWNhdGlvbi9mb3JnZXRfcGFzc3dvcmQuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzEwIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vcmVnaXN0ZXIuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzExIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzEyIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvX2xheW91dC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMTMgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9lcnJvci9lcnJvcl80MDEuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzE0IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvZXJyb3JfNDA0LnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xNSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2Vycm9yL2Vycm9yXzUwMC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMTYsIHsgcHJlbG9hZCBhcyBwcmVsb2FkXzE2IH0gZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL2luZGV4LnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xNywgeyBwcmVsb2FkIGFzIHByZWxvYWRfMTcgfSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2Jsb2cvW3NsdWddLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xOCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3VpL19sYXlvdXQuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzE5IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvdWkvdWkuc3ZlbHRlXCI7XG5pbXBvcnQgcm9vdCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL19sYXlvdXQuc3ZlbHRlXCI7XG5pbXBvcnQgZXJyb3IgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlXCI7XG5cbmNvbnN0IGQgPSBkZWNvZGVVUklDb21wb25lbnQ7XG5cbmV4cG9ydCBjb25zdCBtYW5pZmVzdCA9IHtcblx0c2VydmVyX3JvdXRlczogW1xuXHRcdHtcblx0XHRcdC8vIGJsb2cvaW5kZXguanNvbi5qc1xuXHRcdFx0cGF0dGVybjogL15cXC9ibG9nLmpzb24kLyxcblx0XHRcdGhhbmRsZXJzOiByb3V0ZV8wLFxuXHRcdFx0cGFyYW1zOiAoKSA9PiAoe30pXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIGJsb2cvW3NsdWddLmpzb24uanNcblx0XHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPykuanNvbiQvLFxuXHRcdFx0aGFuZGxlcnM6IHJvdXRlXzEsXG5cdFx0XHRwYXJhbXM6IG1hdGNoID0+ICh7IHNsdWc6IGQobWF0Y2hbMV0pIH0pXG5cdFx0fVxuXHRdLFxuXG5cdHBhZ2VzOiBbXG5cdFx0e1xuXHRcdFx0Ly8gaW5kZXguc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcLyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcImluZGV4XCIsIGZpbGU6IFwiaW5kZXguc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzAgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBhY3Rpdml0eV9sb2cuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL2FjdGl2aXR5X2xvZ1xcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJhY3Rpdml0eV9sb2dcIiwgZmlsZTogXCJhY3Rpdml0eV9sb2cuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzEgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBzZXR0aW5ncy5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvc2V0dGluZ3NcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwic2V0dGluZ3NcIiwgZmlsZTogXCJzZXR0aW5ncy5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMiB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIGxheW91dHMvc3RhdGljX25hdmlnYXRpb24uc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL2xheW91dHNcXC9zdGF0aWNfbmF2aWdhdGlvblxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHsgbmFtZTogXCJsYXlvdXRzX3N0YXRpY19uYXZpZ2F0aW9uXCIsIGZpbGU6IFwibGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvbi5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMyB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIGxheW91dHMvbGlnaHRfc2lkZW5hdi5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL2xpZ2h0X3NpZGVuYXZcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR7IG5hbWU6IFwibGF5b3V0c19saWdodF9zaWRlbmF2XCIsIGZpbGU6IFwibGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF80IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gY2hhcnRzLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9jaGFydHNcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwiY2hhcnRzXCIsIGZpbGU6IFwiY2hhcnRzLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF81IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gdGFibGVzLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC90YWJsZXNcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwidGFibGVzXCIsIGZpbGU6IFwidGFibGVzLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF82IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvZm9yZ2V0X3Bhc3N3b3JkXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF83IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19hdXRoZW50aWNhdGlvbl9fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfOCB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfYXV0aGVudGljYXRpb25fZm9yZ2V0X3Bhc3N3b3JkXCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF85IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vcmVnaXN0ZXIuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9yZWdpc3RlclxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfNyB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfYXV0aGVudGljYXRpb25fX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL2F1dGhlbnRpY2F0aW9uL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzggfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2F1dGhlbnRpY2F0aW9uX3JlZ2lzdGVyXCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vcmVnaXN0ZXIuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzEwIH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9sb2dpblxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfNyB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfYXV0aGVudGljYXRpb25fX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL2F1dGhlbnRpY2F0aW9uL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzggfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2F1dGhlbnRpY2F0aW9uX2xvZ2luXCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzExIH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gcGFnZXMvZXJyb3IvZXJyb3JfNDAxLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2Vycm9yXFwvZXJyb3JfNDAxXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF83IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19lcnJvcl9fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvZXJyb3IvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTIgfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2Vycm9yX2Vycm9yXzQwMVwiLCBmaWxlOiBcInBhZ2VzL2Vycm9yL2Vycm9yXzQwMS5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTMgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBwYWdlcy9lcnJvci9lcnJvcl80MDQuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDRcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzcgfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2Vycm9yX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9lcnJvci9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xMiB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfZXJyb3JfZXJyb3JfNDA0XCIsIGZpbGU6IFwicGFnZXMvZXJyb3IvZXJyb3JfNDA0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xNCB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIHBhZ2VzL2Vycm9yL2Vycm9yXzUwMC5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzUwMFxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfNyB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfZXJyb3JfX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzEyIH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19lcnJvcl9lcnJvcl81MDBcIiwgZmlsZTogXCJwYWdlcy9lcnJvci9lcnJvcl81MDAuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzE1IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gYmxvZy9pbmRleC5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJibG9nXCIsIGZpbGU6IFwiYmxvZy9pbmRleC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTYsIHByZWxvYWQ6IHByZWxvYWRfMTYgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBibG9nL1tzbHVnXS5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR7IG5hbWU6IFwiYmxvZ18kc2x1Z1wiLCBmaWxlOiBcImJsb2cvW3NsdWddLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xNywgcHJlbG9hZDogcHJlbG9hZF8xNywgcGFyYW1zOiBtYXRjaCA9PiAoeyBzbHVnOiBkKG1hdGNoWzFdKSB9KSB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIHVpL3VpLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC91aVxcL3VpXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInVpX19sYXlvdXRcIiwgZmlsZTogXCJ1aS9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xOCB9LFxuXHRcdFx0XHR7IG5hbWU6IFwidWlfdWlcIiwgZmlsZTogXCJ1aS91aS5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTkgfVxuXHRcdFx0XVxuXHRcdH1cblx0XSxcblxuXHRyb290LFxuXHRyb290X3ByZWxvYWQ6ICgpID0+IHt9LFxuXHRlcnJvclxufTtcblxuZXhwb3J0IGNvbnN0IGJ1aWxkX2RpciA9IFwiX19zYXBwZXJfXy9kZXZcIjtcblxuZXhwb3J0IGNvbnN0IHNyY19kaXIgPSBcInNyY1wiO1xuXG5leHBvcnQgY29uc3QgZGV2ID0gdHJ1ZTsiLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBDT05URVhUX0tFWSA9IHt9O1xuXG5leHBvcnQgY29uc3QgcHJlbG9hZCA9ICgpID0+ICh7fSk7IiwiPCEtLSBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhIC0tPlxuPHNjcmlwdD5cblx0aW1wb3J0IHsgc2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5cdGltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9zaGFyZWQnO1xuXHRpbXBvcnQgTGF5b3V0IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fbGF5b3V0LnN2ZWx0ZSc7XG5cdGltcG9ydCBFcnJvciBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2Vycm9yLnN2ZWx0ZSc7XG5cblx0ZXhwb3J0IGxldCBzdG9yZXM7XG5cdGV4cG9ydCBsZXQgZXJyb3I7XG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xuXHRleHBvcnQgbGV0IHNlZ21lbnRzO1xuXHRleHBvcnQgbGV0IGxldmVsMDtcblx0ZXhwb3J0IGxldCBsZXZlbDEgPSBudWxsO1xuXHRleHBvcnQgbGV0IGxldmVsMiA9IG51bGw7XG5cdGV4cG9ydCBsZXQgbGV2ZWwzID0gbnVsbDtcblxuXHRzZXRDb250ZXh0KENPTlRFWFRfS0VZLCBzdG9yZXMpO1xuPC9zY3JpcHQ+XG5cbjxMYXlvdXQgc2VnbWVudD1cIntzZWdtZW50c1swXX1cIiB7Li4ubGV2ZWwwLnByb3BzfT5cblx0eyNpZiBlcnJvcn1cblx0XHQ8RXJyb3Ige2Vycm9yfSB7c3RhdHVzfS8+XG5cdHs6ZWxzZX1cblx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMS5jb21wb25lbnR9XCIgc2VnbWVudD1cIntzZWdtZW50c1sxXX1cIiB7Li4ubGV2ZWwxLnByb3BzfT5cblx0XHRcdHsjaWYgbGV2ZWwyfVxuXHRcdFx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMi5jb21wb25lbnR9XCIgc2VnbWVudD1cIntzZWdtZW50c1syXX1cIiB7Li4ubGV2ZWwyLnByb3BzfT5cblx0XHRcdFx0XHR7I2lmIGxldmVsM31cblx0XHRcdFx0XHRcdDxzdmVsdGU6Y29tcG9uZW50IHRoaXM9XCJ7bGV2ZWwzLmNvbXBvbmVudH1cIiB7Li4ubGV2ZWwzLnByb3BzfS8+XG5cdFx0XHRcdFx0ey9pZn1cblx0XHRcdFx0PC9zdmVsdGU6Y29tcG9uZW50PlxuXHRcdFx0ey9pZn1cblx0XHQ8L3N2ZWx0ZTpjb21wb25lbnQ+XG5cdHsvaWZ9XG48L0xheW91dD4iLCJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZXYsIGJ1aWxkX2Rpciwgc3JjX2RpciwgbWFuaWZlc3QgfSBmcm9tICcuL2ludGVybmFsL21hbmlmZXN0LXNlcnZlcic7XG5pbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgU3RyZWFtIGZyb20gJ3N0cmVhbSc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBVcmwgZnJvbSAndXJsJztcbmltcG9ydCBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgemxpYiBmcm9tICd6bGliJztcbmltcG9ydCBBcHAgZnJvbSAnLi9pbnRlcm5hbC9BcHAuc3ZlbHRlJztcblxuZnVuY3Rpb24gZ2V0X3NlcnZlcl9yb3V0ZV9oYW5kbGVyKHJvdXRlcykge1xuXHRhc3luYyBmdW5jdGlvbiBoYW5kbGVfcm91dGUocm91dGUsIHJlcSwgcmVzLCBuZXh0KSB7XG5cdFx0cmVxLnBhcmFtcyA9IHJvdXRlLnBhcmFtcyhyb3V0ZS5wYXR0ZXJuLmV4ZWMocmVxLnBhdGgpKTtcblxuXHRcdGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QudG9Mb3dlckNhc2UoKTtcblx0XHQvLyAnZGVsZXRlJyBjYW5ub3QgYmUgZXhwb3J0ZWQgZnJvbSBhIG1vZHVsZSBiZWNhdXNlIGl0IGlzIGEga2V5d29yZCxcblx0XHQvLyBzbyBjaGVjayBmb3IgJ2RlbCcgaW5zdGVhZFxuXHRcdGNvbnN0IG1ldGhvZF9leHBvcnQgPSBtZXRob2QgPT09ICdkZWxldGUnID8gJ2RlbCcgOiBtZXRob2Q7XG5cdFx0Y29uc3QgaGFuZGxlX21ldGhvZCA9IHJvdXRlLmhhbmRsZXJzW21ldGhvZF9leHBvcnRdO1xuXHRcdGlmIChoYW5kbGVfbWV0aG9kKSB7XG5cdFx0XHRpZiAocHJvY2Vzcy5lbnYuU0FQUEVSX0VYUE9SVCkge1xuXHRcdFx0XHRjb25zdCB7IHdyaXRlLCBlbmQsIHNldEhlYWRlciB9ID0gcmVzO1xuXHRcdFx0XHRjb25zdCBjaHVua3MgPSBbXTtcblx0XHRcdFx0Y29uc3QgaGVhZGVycyA9IHt9O1xuXG5cdFx0XHRcdC8vIGludGVyY2VwdCBkYXRhIHNvIHRoYXQgaXQgY2FuIGJlIGV4cG9ydGVkXG5cdFx0XHRcdHJlcy53cml0ZSA9IGZ1bmN0aW9uKGNodW5rKSB7XG5cdFx0XHRcdFx0Y2h1bmtzLnB1c2goQnVmZmVyLmZyb20oY2h1bmspKTtcblx0XHRcdFx0XHR3cml0ZS5hcHBseShyZXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLnNldEhlYWRlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdFx0XHRcdFx0aGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gdmFsdWU7XG5cdFx0XHRcdFx0c2V0SGVhZGVyLmFwcGx5KHJlcywgYXJndW1lbnRzKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRyZXMuZW5kID0gZnVuY3Rpb24oY2h1bmspIHtcblx0XHRcdFx0XHRpZiAoY2h1bmspIGNodW5rcy5wdXNoKEJ1ZmZlci5mcm9tKGNodW5rKSk7XG5cdFx0XHRcdFx0ZW5kLmFwcGx5KHJlcywgYXJndW1lbnRzKTtcblxuXHRcdFx0XHRcdHByb2Nlc3Muc2VuZCh7XG5cdFx0XHRcdFx0XHRfX3NhcHBlcl9fOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZXZlbnQ6ICdmaWxlJyxcblx0XHRcdFx0XHRcdHVybDogcmVxLnVybCxcblx0XHRcdFx0XHRcdG1ldGhvZDogcmVxLm1ldGhvZCxcblx0XHRcdFx0XHRcdHN0YXR1czogcmVzLnN0YXR1c0NvZGUsXG5cdFx0XHRcdFx0XHR0eXBlOiBoZWFkZXJzWydjb250ZW50LXR5cGUnXSxcblx0XHRcdFx0XHRcdGJvZHk6IEJ1ZmZlci5jb25jYXQoY2h1bmtzKS50b1N0cmluZygpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhbmRsZV9uZXh0ID0gKGVycikgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDA7XG5cdFx0XHRcdFx0cmVzLmVuZChlcnIubWVzc2FnZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJvY2Vzcy5uZXh0VGljayhuZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0YXdhaXQgaGFuZGxlX21ldGhvZChyZXEsIHJlcywgaGFuZGxlX25leHQpO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdFx0aGFuZGxlX25leHQoZXJyKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbm8gbWF0Y2hpbmcgaGFuZGxlciBmb3IgbWV0aG9kXG5cdFx0XHRwcm9jZXNzLm5leHRUaWNrKG5leHQpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBmaW5kX3JvdXRlKHJlcSwgcmVzLCBuZXh0KSB7XG5cdFx0Zm9yIChjb25zdCByb3V0ZSBvZiByb3V0ZXMpIHtcblx0XHRcdGlmIChyb3V0ZS5wYXR0ZXJuLnRlc3QocmVxLnBhdGgpKSB7XG5cdFx0XHRcdGhhbmRsZV9yb3V0ZShyb3V0ZSwgcmVxLCByZXMsIG5leHQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bmV4dCgpO1xuXHR9O1xufVxuXG4vKiFcbiAqIGNvb2tpZVxuICogQ29weXJpZ2h0KGMpIDIwMTItMjAxNCBSb21hbiBTaHR5bG1hblxuICogQ29weXJpZ2h0KGMpIDIwMTUgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKiBAcHVibGljXG4gKi9cblxudmFyIHBhcnNlXzEgPSBwYXJzZTtcbnZhciBzZXJpYWxpemVfMSA9IHNlcmlhbGl6ZTtcblxuLyoqXG4gKiBNb2R1bGUgdmFyaWFibGVzLlxuICogQHByaXZhdGVcbiAqL1xuXG52YXIgZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xudmFyIGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDtcbnZhciBwYWlyU3BsaXRSZWdFeHAgPSAvOyAqLztcblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggZmllbGQtY29udGVudCBpbiBSRkMgNzIzMCBzZWMgMy4yXG4gKlxuICogZmllbGQtY29udGVudCA9IGZpZWxkLXZjaGFyIFsgMSooIFNQIC8gSFRBQiApIGZpZWxkLXZjaGFyIF1cbiAqIGZpZWxkLXZjaGFyICAgPSBWQ0hBUiAvIG9icy10ZXh0XG4gKiBvYnMtdGV4dCAgICAgID0gJXg4MC1GRlxuICovXG5cbnZhciBmaWVsZENvbnRlbnRSZWdFeHAgPSAvXltcXHUwMDA5XFx1MDAyMC1cXHUwMDdlXFx1MDA4MC1cXHUwMGZmXSskLztcblxuLyoqXG4gKiBQYXJzZSBhIGNvb2tpZSBoZWFkZXIuXG4gKlxuICogUGFyc2UgdGhlIGdpdmVuIGNvb2tpZSBoZWFkZXIgc3RyaW5nIGludG8gYW4gb2JqZWN0XG4gKiBUaGUgb2JqZWN0IGhhcyB0aGUgdmFyaW91cyBjb29raWVzIGFzIGtleXMobmFtZXMpID0+IHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge29iamVjdH1cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG4gIHZhciBwYWlycyA9IHN0ci5zcGxpdChwYWlyU3BsaXRSZWdFeHApO1xuICB2YXIgZGVjID0gb3B0LmRlY29kZSB8fCBkZWNvZGU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwYWlyID0gcGFpcnNbaV07XG4gICAgdmFyIGVxX2lkeCA9IHBhaXIuaW5kZXhPZignPScpO1xuXG4gICAgLy8gc2tpcCB0aGluZ3MgdGhhdCBkb24ndCBsb29rIGxpa2Uga2V5PXZhbHVlXG4gICAgaWYgKGVxX2lkeCA8IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBrZXkgPSBwYWlyLnN1YnN0cigwLCBlcV9pZHgpLnRyaW0oKTtcbiAgICB2YXIgdmFsID0gcGFpci5zdWJzdHIoKytlcV9pZHgsIHBhaXIubGVuZ3RoKS50cmltKCk7XG5cbiAgICAvLyBxdW90ZWQgdmFsdWVzXG4gICAgaWYgKCdcIicgPT0gdmFsWzBdKSB7XG4gICAgICB2YWwgPSB2YWwuc2xpY2UoMSwgLTEpO1xuICAgIH1cblxuICAgIC8vIG9ubHkgYXNzaWduIG9uY2VcbiAgICBpZiAodW5kZWZpbmVkID09IG9ialtrZXldKSB7XG4gICAgICBvYmpba2V5XSA9IHRyeURlY29kZSh2YWwsIGRlYyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgZGF0YSBpbnRvIGEgY29va2llIGhlYWRlci5cbiAqXG4gKiBTZXJpYWxpemUgdGhlIGEgbmFtZSB2YWx1ZSBwYWlyIGludG8gYSBjb29raWUgc3RyaW5nIHN1aXRhYmxlIGZvclxuICogaHR0cCBoZWFkZXJzLiBBbiBvcHRpb25hbCBvcHRpb25zIG9iamVjdCBzcGVjaWZpZWQgY29va2llIHBhcmFtZXRlcnMuXG4gKlxuICogc2VyaWFsaXplKCdmb28nLCAnYmFyJywgeyBodHRwT25seTogdHJ1ZSB9KVxuICogICA9PiBcImZvbz1iYXI7IGh0dHBPbmx5XCJcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbFxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShuYW1lLCB2YWwsIG9wdGlvbnMpIHtcbiAgdmFyIG9wdCA9IG9wdGlvbnMgfHwge307XG4gIHZhciBlbmMgPSBvcHQuZW5jb2RlIHx8IGVuY29kZTtcblxuICBpZiAodHlwZW9mIGVuYyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBlbmNvZGUgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgaWYgKCFmaWVsZENvbnRlbnRSZWdFeHAudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IG5hbWUgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gZW5jKHZhbCk7XG5cbiAgaWYgKHZhbHVlICYmICFmaWVsZENvbnRlbnRSZWdFeHAudGVzdCh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCB2YWwgaXMgaW52YWxpZCcpO1xuICB9XG5cbiAgdmFyIHN0ciA9IG5hbWUgKyAnPScgKyB2YWx1ZTtcblxuICBpZiAobnVsbCAhPSBvcHQubWF4QWdlKSB7XG4gICAgdmFyIG1heEFnZSA9IG9wdC5tYXhBZ2UgLSAwO1xuICAgIGlmIChpc05hTihtYXhBZ2UpKSB0aHJvdyBuZXcgRXJyb3IoJ21heEFnZSBzaG91bGQgYmUgYSBOdW1iZXInKTtcbiAgICBzdHIgKz0gJzsgTWF4LUFnZT0nICsgTWF0aC5mbG9vcihtYXhBZ2UpO1xuICB9XG5cbiAgaWYgKG9wdC5kb21haW4pIHtcbiAgICBpZiAoIWZpZWxkQ29udGVudFJlZ0V4cC50ZXN0KG9wdC5kb21haW4pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gZG9tYWluIGlzIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICBzdHIgKz0gJzsgRG9tYWluPScgKyBvcHQuZG9tYWluO1xuICB9XG5cbiAgaWYgKG9wdC5wYXRoKSB7XG4gICAgaWYgKCFmaWVsZENvbnRlbnRSZWdFeHAudGVzdChvcHQucGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBwYXRoIGlzIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICBzdHIgKz0gJzsgUGF0aD0nICsgb3B0LnBhdGg7XG4gIH1cblxuICBpZiAob3B0LmV4cGlyZXMpIHtcbiAgICBpZiAodHlwZW9mIG9wdC5leHBpcmVzLnRvVVRDU3RyaW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gZXhwaXJlcyBpcyBpbnZhbGlkJyk7XG4gICAgfVxuXG4gICAgc3RyICs9ICc7IEV4cGlyZXM9JyArIG9wdC5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gIH1cblxuICBpZiAob3B0Lmh0dHBPbmx5KSB7XG4gICAgc3RyICs9ICc7IEh0dHBPbmx5JztcbiAgfVxuXG4gIGlmIChvcHQuc2VjdXJlKSB7XG4gICAgc3RyICs9ICc7IFNlY3VyZSc7XG4gIH1cblxuICBpZiAob3B0LnNhbWVTaXRlKSB7XG4gICAgdmFyIHNhbWVTaXRlID0gdHlwZW9mIG9wdC5zYW1lU2l0ZSA9PT0gJ3N0cmluZydcbiAgICAgID8gb3B0LnNhbWVTaXRlLnRvTG93ZXJDYXNlKCkgOiBvcHQuc2FtZVNpdGU7XG5cbiAgICBzd2l0Y2ggKHNhbWVTaXRlKSB7XG4gICAgICBjYXNlIHRydWU6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1TdHJpY3QnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xheCc6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1MYXgnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmljdCc6XG4gICAgICAgIHN0ciArPSAnOyBTYW1lU2l0ZT1TdHJpY3QnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICBzdHIgKz0gJzsgU2FtZVNpdGU9Tm9uZSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIHNhbWVTaXRlIGlzIGludmFsaWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFRyeSBkZWNvZGluZyBhIHN0cmluZyB1c2luZyBhIGRlY29kaW5nIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlY29kZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiB0cnlEZWNvZGUoc3RyLCBkZWNvZGUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlKHN0cik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbnZhciBjb29raWUgPSB7XG5cdHBhcnNlOiBwYXJzZV8xLFxuXHRzZXJpYWxpemU6IHNlcmlhbGl6ZV8xXG59O1xuXG52YXIgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl8kJztcbnZhciB1bnNhZmVDaGFycyA9IC9bPD5cXGJcXGZcXG5cXHJcXHRcXDBcXHUyMDI4XFx1MjAyOV0vZztcbnZhciByZXNlcnZlZCA9IC9eKD86ZG98aWZ8aW58Zm9yfGludHxsZXR8bmV3fHRyeXx2YXJ8Ynl0ZXxjYXNlfGNoYXJ8ZWxzZXxlbnVtfGdvdG98bG9uZ3x0aGlzfHZvaWR8d2l0aHxhd2FpdHxicmVha3xjYXRjaHxjbGFzc3xjb25zdHxmaW5hbHxmbG9hdHxzaG9ydHxzdXBlcnx0aHJvd3x3aGlsZXx5aWVsZHxkZWxldGV8ZG91YmxlfGV4cG9ydHxpbXBvcnR8bmF0aXZlfHJldHVybnxzd2l0Y2h8dGhyb3dzfHR5cGVvZnxib29sZWFufGRlZmF1bHR8ZXh0ZW5kc3xmaW5hbGx5fHBhY2thZ2V8cHJpdmF0ZXxhYnN0cmFjdHxjb250aW51ZXxkZWJ1Z2dlcnxmdW5jdGlvbnx2b2xhdGlsZXxpbnRlcmZhY2V8cHJvdGVjdGVkfHRyYW5zaWVudHxpbXBsZW1lbnRzfGluc3RhbmNlb2Z8c3luY2hyb25pemVkKSQvO1xudmFyIGVzY2FwZWQgPSB7XG4gICAgJzwnOiAnXFxcXHUwMDNDJyxcbiAgICAnPic6ICdcXFxcdTAwM0UnLFxuICAgICcvJzogJ1xcXFx1MDAyRicsXG4gICAgJ1xcXFwnOiAnXFxcXFxcXFwnLFxuICAgICdcXGInOiAnXFxcXGInLFxuICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICdcXG4nOiAnXFxcXG4nLFxuICAgICdcXHInOiAnXFxcXHInLFxuICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICdcXDAnOiAnXFxcXDAnLFxuICAgICdcXHUyMDI4JzogJ1xcXFx1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAnXFxcXHUyMDI5J1xufTtcbnZhciBvYmplY3RQcm90b093blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QucHJvdG90eXBlKS5zb3J0KCkuam9pbignXFwwJyk7XG5mdW5jdGlvbiBkZXZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIGNvdW50cyA9IG5ldyBNYXAoKTtcbiAgICBmdW5jdGlvbiB3YWxrKHRoaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzdHJpbmdpZnkgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnRzLmhhcyh0aGluZykpIHtcbiAgICAgICAgICAgIGNvdW50cy5zZXQodGhpbmcsIGNvdW50cy5nZXQodGhpbmcpICsgMSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY291bnRzLnNldCh0aGluZywgMSk7XG4gICAgICAgIGlmICghaXNQcmltaXRpdmUodGhpbmcpKSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGdldFR5cGUodGhpbmcpO1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaW5nLmZvckVhY2god2Fsayk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NldCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnTWFwJzpcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbSh0aGluZykuZm9yRWFjaCh3YWxrKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3RvICE9PSBPYmplY3QucHJvdG90eXBlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90byAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pLnNvcnQoKS5qb2luKCdcXDAnKSAhPT0gb2JqZWN0UHJvdG9Pd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc3RyaW5naWZ5IGFyYml0cmFyeSBub24tUE9KT3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGhpbmcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzdHJpbmdpZnkgUE9KT3Mgd2l0aCBzeW1ib2xpYyBrZXlzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaW5nKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHdhbGsodGhpbmdba2V5XSk7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHdhbGsodmFsdWUpO1xuICAgIHZhciBuYW1lcyA9IG5ldyBNYXAoKTtcbiAgICBBcnJheS5mcm9tKGNvdW50cylcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZW50cnkpIHsgcmV0dXJuIGVudHJ5WzFdID4gMTsgfSlcbiAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGJbMV0gLSBhWzFdOyB9KVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgICAgICAgbmFtZXMuc2V0KGVudHJ5WzBdLCBnZXROYW1lKGkpKTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBzdHJpbmdpZnkodGhpbmcpIHtcbiAgICAgICAgaWYgKG5hbWVzLmhhcyh0aGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBuYW1lcy5nZXQodGhpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1ByaW1pdGl2ZSh0aGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZnlQcmltaXRpdmUodGhpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gZ2V0VHlwZSh0aGluZyk7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJPYmplY3QoXCIgKyBzdHJpbmdpZnkodGhpbmcudmFsdWVPZigpKSArIFwiKVwiO1xuICAgICAgICAgICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpbmcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIm5ldyBEYXRlKFwiICsgdGhpbmcuZ2V0VGltZSgpICsgXCIpXCI7XG4gICAgICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgICAgICAgdmFyIG1lbWJlcnMgPSB0aGluZy5tYXAoZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIGkgaW4gdGhpbmcgPyBzdHJpbmdpZnkodikgOiAnJzsgfSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhaWwgPSB0aGluZy5sZW5ndGggPT09IDAgfHwgKHRoaW5nLmxlbmd0aCAtIDEgaW4gdGhpbmcpID8gJycgOiAnLCc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiW1wiICsgbWVtYmVycy5qb2luKCcsJykgKyB0YWlsICsgXCJdXCI7XG4gICAgICAgICAgICBjYXNlICdTZXQnOlxuICAgICAgICAgICAgY2FzZSAnTWFwJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJuZXcgXCIgKyB0eXBlICsgXCIoW1wiICsgQXJyYXkuZnJvbSh0aGluZykubWFwKHN0cmluZ2lmeSkuam9pbignLCcpICsgXCJdKVwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gXCJ7XCIgKyBPYmplY3Qua2V5cyh0aGluZykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHNhZmVLZXkoa2V5KSArIFwiOlwiICsgc3RyaW5naWZ5KHRoaW5nW2tleV0pOyB9KS5qb2luKCcsJykgKyBcIn1cIjtcbiAgICAgICAgICAgICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpbmcpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgID8gXCJPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksXCIgKyBvYmogKyBcIilcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIk9iamVjdC5jcmVhdGUobnVsbClcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgc3RyID0gc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAobmFtZXMuc2l6ZSkge1xuICAgICAgICB2YXIgcGFyYW1zXzEgPSBbXTtcbiAgICAgICAgdmFyIHN0YXRlbWVudHNfMSA9IFtdO1xuICAgICAgICB2YXIgdmFsdWVzXzEgPSBbXTtcbiAgICAgICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgdGhpbmcpIHtcbiAgICAgICAgICAgIHBhcmFtc18xLnB1c2gobmFtZSk7XG4gICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUodGhpbmcpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaChzdHJpbmdpZnlQcmltaXRpdmUodGhpbmcpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGdldFR5cGUodGhpbmcpO1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKFwiT2JqZWN0KFwiICsgc3RyaW5naWZ5KHRoaW5nLnZhbHVlT2YoKSkgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2godGhpbmcudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKFwibmV3IERhdGUoXCIgKyB0aGluZy5nZXRUaW1lKCkgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0FycmF5JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaChcIkFycmF5KFwiICsgdGhpbmcubGVuZ3RoICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGluZy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzXzEucHVzaChuYW1lICsgXCJbXCIgKyBpICsgXCJdPVwiICsgc3RyaW5naWZ5KHYpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NldCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2goXCJuZXcgU2V0XCIpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzXzEucHVzaChuYW1lICsgXCIuXCIgKyBBcnJheS5mcm9tKHRoaW5nKS5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiYWRkKFwiICsgc3RyaW5naWZ5KHYpICsgXCIpXCI7IH0pLmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ01hcCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2goXCJuZXcgTWFwXCIpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzXzEucHVzaChuYW1lICsgXCIuXCIgKyBBcnJheS5mcm9tKHRoaW5nKS5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgayA9IF9hWzBdLCB2ID0gX2FbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJzZXQoXCIgKyBzdHJpbmdpZnkoaykgKyBcIiwgXCIgKyBzdHJpbmdpZnkodikgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgfSkuam9pbignLicpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaChPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpbmcpID09PSBudWxsID8gJ09iamVjdC5jcmVhdGUobnVsbCknIDogJ3t9Jyk7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaW5nKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHNfMS5wdXNoKFwiXCIgKyBuYW1lICsgc2FmZVByb3Aoa2V5KSArIFwiPVwiICsgc3RyaW5naWZ5KHRoaW5nW2tleV0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdGF0ZW1lbnRzXzEucHVzaChcInJldHVybiBcIiArIHN0cik7XG4gICAgICAgIHJldHVybiBcIihmdW5jdGlvbihcIiArIHBhcmFtc18xLmpvaW4oJywnKSArIFwiKXtcIiArIHN0YXRlbWVudHNfMS5qb2luKCc7JykgKyBcIn0oXCIgKyB2YWx1ZXNfMS5qb2luKCcsJykgKyBcIikpXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldE5hbWUobnVtKSB7XG4gICAgdmFyIG5hbWUgPSAnJztcbiAgICBkbyB7XG4gICAgICAgIG5hbWUgPSBjaGFyc1tudW0gJSBjaGFycy5sZW5ndGhdICsgbmFtZTtcbiAgICAgICAgbnVtID0gfn4obnVtIC8gY2hhcnMubGVuZ3RoKSAtIDE7XG4gICAgfSB3aGlsZSAobnVtID49IDApO1xuICAgIHJldHVybiByZXNlcnZlZC50ZXN0KG5hbWUpID8gbmFtZSArIFwiX1wiIDogbmFtZTtcbn1cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKHRoaW5nKSB7XG4gICAgcmV0dXJuIE9iamVjdCh0aGluZykgIT09IHRoaW5nO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5UHJpbWl0aXZlKHRoaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB0aGluZyA9PT0gJ3N0cmluZycpXG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlTdHJpbmcodGhpbmcpO1xuICAgIGlmICh0aGluZyA9PT0gdm9pZCAwKVxuICAgICAgICByZXR1cm4gJ3ZvaWQgMCc7XG4gICAgaWYgKHRoaW5nID09PSAwICYmIDEgLyB0aGluZyA8IDApXG4gICAgICAgIHJldHVybiAnLTAnO1xuICAgIHZhciBzdHIgPSBTdHJpbmcodGhpbmcpO1xuICAgIGlmICh0eXBlb2YgdGhpbmcgPT09ICdudW1iZXInKVxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL14oLSk/MFxcLi8sICckMS4nKTtcbiAgICByZXR1cm4gc3RyO1xufVxuZnVuY3Rpb24gZ2V0VHlwZSh0aGluZykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpLnNsaWNlKDgsIC0xKTtcbn1cbmZ1bmN0aW9uIGVzY2FwZVVuc2FmZUNoYXIoYykge1xuICAgIHJldHVybiBlc2NhcGVkW2NdIHx8IGM7XG59XG5mdW5jdGlvbiBlc2NhcGVVbnNhZmVDaGFycyhzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UodW5zYWZlQ2hhcnMsIGVzY2FwZVVuc2FmZUNoYXIpO1xufVxuZnVuY3Rpb24gc2FmZUtleShrZXkpIHtcbiAgICByZXR1cm4gL15bXyRhLXpBLVpdW18kYS16QS1aMC05XSokLy50ZXN0KGtleSkgPyBrZXkgOiBlc2NhcGVVbnNhZmVDaGFycyhKU09OLnN0cmluZ2lmeShrZXkpKTtcbn1cbmZ1bmN0aW9uIHNhZmVQcm9wKGtleSkge1xuICAgIHJldHVybiAvXltfJGEtekEtWl1bXyRhLXpBLVowLTldKiQvLnRlc3Qoa2V5KSA/IFwiLlwiICsga2V5IDogXCJbXCIgKyBlc2NhcGVVbnNhZmVDaGFycyhKU09OLnN0cmluZ2lmeShrZXkpKSArIFwiXVwiO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5U3RyaW5nKHN0cikge1xuICAgIHZhciByZXN1bHQgPSAnXCInO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBjaGFyID0gc3RyLmNoYXJBdChpKTtcbiAgICAgICAgdmFyIGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gJ1xcXFxcIic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hhciBpbiBlc2NhcGVkKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gZXNjYXBlZFtjaGFyXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID49IDB4ZDgwMCAmJiBjb2RlIDw9IDB4ZGZmZikge1xuICAgICAgICAgICAgdmFyIG5leHQgPSBzdHIuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBiZWdpbm5pbmcgb2YgYSBbaGlnaCwgbG93XSBzdXJyb2dhdGUgcGFpcixcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgbmV4dCB0d28gY2hhcmFjdGVycywgb3RoZXJ3aXNlIGVzY2FwZVxuICAgICAgICAgICAgaWYgKGNvZGUgPD0gMHhkYmZmICYmIChuZXh0ID49IDB4ZGMwMCAmJiBuZXh0IDw9IDB4ZGZmZikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gY2hhciArIHN0clsrK2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiXFxcXHVcIiArIGNvZGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQgKz0gJ1wiJztcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vdG1wdmFyL2pzZG9tL2Jsb2IvYWE4NWIyYWJmMDc3NjZmZjdiZjVjMWY2ZGFhZmIzNzI2ZjJmMmRiNS9saWIvanNkb20vbGl2aW5nL2Jsb2IuanNcblxuLy8gZml4IGZvciBcIlJlYWRhYmxlXCIgaXNuJ3QgYSBuYW1lZCBleHBvcnQgaXNzdWVcbmNvbnN0IFJlYWRhYmxlID0gU3RyZWFtLlJlYWRhYmxlO1xuXG5jb25zdCBCVUZGRVIgPSBTeW1ib2woJ2J1ZmZlcicpO1xuY29uc3QgVFlQRSA9IFN5bWJvbCgndHlwZScpO1xuXG5jbGFzcyBCbG9iIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpc1tUWVBFXSA9ICcnO1xuXG5cdFx0Y29uc3QgYmxvYlBhcnRzID0gYXJndW1lbnRzWzBdO1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XG5cblx0XHRjb25zdCBidWZmZXJzID0gW107XG5cdFx0bGV0IHNpemUgPSAwO1xuXG5cdFx0aWYgKGJsb2JQYXJ0cykge1xuXHRcdFx0Y29uc3QgYSA9IGJsb2JQYXJ0cztcblx0XHRcdGNvbnN0IGxlbmd0aCA9IE51bWJlcihhLmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSBhW2ldO1xuXHRcdFx0XHRsZXQgYnVmZmVyO1xuXHRcdFx0XHRpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuXHRcdFx0XHRcdGJ1ZmZlciA9IGVsZW1lbnQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGVsZW1lbnQpKSB7XG5cdFx0XHRcdFx0YnVmZmVyID0gQnVmZmVyLmZyb20oZWxlbWVudC5idWZmZXIsIGVsZW1lbnQuYnl0ZU9mZnNldCwgZWxlbWVudC5ieXRlTGVuZ3RoKTtcblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcblx0XHRcdFx0XHRidWZmZXIgPSBCdWZmZXIuZnJvbShlbGVtZW50KTtcblx0XHRcdFx0fSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQmxvYikge1xuXHRcdFx0XHRcdGJ1ZmZlciA9IGVsZW1lbnRbQlVGRkVSXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRidWZmZXIgPSBCdWZmZXIuZnJvbSh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycgPyBlbGVtZW50IDogU3RyaW5nKGVsZW1lbnQpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzaXplICs9IGJ1ZmZlci5sZW5ndGg7XG5cdFx0XHRcdGJ1ZmZlcnMucHVzaChidWZmZXIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXNbQlVGRkVSXSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG5cblx0XHRsZXQgdHlwZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy50eXBlICE9PSB1bmRlZmluZWQgJiYgU3RyaW5nKG9wdGlvbnMudHlwZSkudG9Mb3dlckNhc2UoKTtcblx0XHRpZiAodHlwZSAmJiAhL1teXFx1MDAyMC1cXHUwMDdFXS8udGVzdCh0eXBlKSkge1xuXHRcdFx0dGhpc1tUWVBFXSA9IHR5cGU7XG5cdFx0fVxuXHR9XG5cdGdldCBzaXplKCkge1xuXHRcdHJldHVybiB0aGlzW0JVRkZFUl0ubGVuZ3RoO1xuXHR9XG5cdGdldCB0eXBlKCkge1xuXHRcdHJldHVybiB0aGlzW1RZUEVdO1xuXHR9XG5cdHRleHQoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzW0JVRkZFUl0udG9TdHJpbmcoKSk7XG5cdH1cblx0YXJyYXlCdWZmZXIoKSB7XG5cdFx0Y29uc3QgYnVmID0gdGhpc1tCVUZGRVJdO1xuXHRcdGNvbnN0IGFiID0gYnVmLmJ1ZmZlci5zbGljZShidWYuYnl0ZU9mZnNldCwgYnVmLmJ5dGVPZmZzZXQgKyBidWYuYnl0ZUxlbmd0aCk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShhYik7XG5cdH1cblx0c3RyZWFtKCkge1xuXHRcdGNvbnN0IHJlYWRhYmxlID0gbmV3IFJlYWRhYmxlKCk7XG5cdFx0cmVhZGFibGUuX3JlYWQgPSBmdW5jdGlvbiAoKSB7fTtcblx0XHRyZWFkYWJsZS5wdXNoKHRoaXNbQlVGRkVSXSk7XG5cdFx0cmVhZGFibGUucHVzaChudWxsKTtcblx0XHRyZXR1cm4gcmVhZGFibGU7XG5cdH1cblx0dG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuICdbb2JqZWN0IEJsb2JdJztcblx0fVxuXHRzbGljZSgpIHtcblx0XHRjb25zdCBzaXplID0gdGhpcy5zaXplO1xuXG5cdFx0Y29uc3Qgc3RhcnQgPSBhcmd1bWVudHNbMF07XG5cdFx0Y29uc3QgZW5kID0gYXJndW1lbnRzWzFdO1xuXHRcdGxldCByZWxhdGl2ZVN0YXJ0LCByZWxhdGl2ZUVuZDtcblx0XHRpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmVsYXRpdmVTdGFydCA9IDA7XG5cdFx0fSBlbHNlIGlmIChzdGFydCA8IDApIHtcblx0XHRcdHJlbGF0aXZlU3RhcnQgPSBNYXRoLm1heChzaXplICsgc3RhcnQsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWxhdGl2ZVN0YXJ0ID0gTWF0aC5taW4oc3RhcnQsIHNpemUpO1xuXHRcdH1cblx0XHRpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJlbGF0aXZlRW5kID0gc2l6ZTtcblx0XHR9IGVsc2UgaWYgKGVuZCA8IDApIHtcblx0XHRcdHJlbGF0aXZlRW5kID0gTWF0aC5tYXgoc2l6ZSArIGVuZCwgMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbGF0aXZlRW5kID0gTWF0aC5taW4oZW5kLCBzaXplKTtcblx0XHR9XG5cdFx0Y29uc3Qgc3BhbiA9IE1hdGgubWF4KHJlbGF0aXZlRW5kIC0gcmVsYXRpdmVTdGFydCwgMCk7XG5cblx0XHRjb25zdCBidWZmZXIgPSB0aGlzW0JVRkZFUl07XG5cdFx0Y29uc3Qgc2xpY2VkQnVmZmVyID0gYnVmZmVyLnNsaWNlKHJlbGF0aXZlU3RhcnQsIHJlbGF0aXZlU3RhcnQgKyBzcGFuKTtcblx0XHRjb25zdCBibG9iID0gbmV3IEJsb2IoW10sIHsgdHlwZTogYXJndW1lbnRzWzJdIH0pO1xuXHRcdGJsb2JbQlVGRkVSXSA9IHNsaWNlZEJ1ZmZlcjtcblx0XHRyZXR1cm4gYmxvYjtcblx0fVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhCbG9iLnByb3RvdHlwZSwge1xuXHRzaXplOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0dHlwZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHNsaWNlOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCbG9iLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG5cdHZhbHVlOiAnQmxvYicsXG5cdHdyaXRhYmxlOiBmYWxzZSxcblx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogZmV0Y2gtZXJyb3IuanNcbiAqXG4gKiBGZXRjaEVycm9yIGludGVyZmFjZSBmb3Igb3BlcmF0aW9uYWwgZXJyb3JzXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgRmV0Y2hFcnJvciBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIG1lc3NhZ2UgICAgICBFcnJvciBtZXNzYWdlIGZvciBodW1hblxuICogQHBhcmFtICAgU3RyaW5nICAgICAgdHlwZSAgICAgICAgIEVycm9yIHR5cGUgZm9yIG1hY2hpbmVcbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIHN5c3RlbUVycm9yICBGb3IgTm9kZS5qcyBzeXN0ZW0gZXJyb3JcbiAqIEByZXR1cm4gIEZldGNoRXJyb3JcbiAqL1xuZnVuY3Rpb24gRmV0Y2hFcnJvcihtZXNzYWdlLCB0eXBlLCBzeXN0ZW1FcnJvcikge1xuICBFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMudHlwZSA9IHR5cGU7XG5cbiAgLy8gd2hlbiBlcnIudHlwZSBpcyBgc3lzdGVtYCwgZXJyLmNvZGUgY29udGFpbnMgc3lzdGVtIGVycm9yIGNvZGVcbiAgaWYgKHN5c3RlbUVycm9yKSB7XG4gICAgdGhpcy5jb2RlID0gdGhpcy5lcnJubyA9IHN5c3RlbUVycm9yLmNvZGU7XG4gIH1cblxuICAvLyBoaWRlIGN1c3RvbSBlcnJvciBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGZyb20gZW5kLXVzZXJzXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xufVxuXG5GZXRjaEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkZldGNoRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRmV0Y2hFcnJvcjtcbkZldGNoRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnRmV0Y2hFcnJvcic7XG5cbmxldCBjb252ZXJ0O1xudHJ5IHtcblx0Y29udmVydCA9IHJlcXVpcmUoJ2VuY29kaW5nJykuY29udmVydDtcbn0gY2F0Y2ggKGUpIHt9XG5cbmNvbnN0IElOVEVSTkFMUyA9IFN5bWJvbCgnQm9keSBpbnRlcm5hbHMnKTtcblxuLy8gZml4IGFuIGlzc3VlIHdoZXJlIFwiUGFzc1Rocm91Z2hcIiBpc24ndCBhIG5hbWVkIGV4cG9ydCBmb3Igbm9kZSA8MTBcbmNvbnN0IFBhc3NUaHJvdWdoID0gU3RyZWFtLlBhc3NUaHJvdWdoO1xuXG4vKipcbiAqIEJvZHkgbWl4aW5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNib2R5XG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5mdW5jdGlvbiBCb2R5KGJvZHkpIHtcblx0dmFyIF90aGlzID0gdGhpcztcblxuXHR2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge30sXG5cdCAgICBfcmVmJHNpemUgPSBfcmVmLnNpemU7XG5cblx0bGV0IHNpemUgPSBfcmVmJHNpemUgPT09IHVuZGVmaW5lZCA/IDAgOiBfcmVmJHNpemU7XG5cdHZhciBfcmVmJHRpbWVvdXQgPSBfcmVmLnRpbWVvdXQ7XG5cdGxldCB0aW1lb3V0ID0gX3JlZiR0aW1lb3V0ID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiR0aW1lb3V0O1xuXG5cdGlmIChib2R5ID09IG51bGwpIHtcblx0XHQvLyBib2R5IGlzIHVuZGVmaW5lZCBvciBudWxsXG5cdFx0Ym9keSA9IG51bGw7XG5cdH0gZWxzZSBpZiAoaXNVUkxTZWFyY2hQYXJhbXMoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGEgVVJMU2VhcmNoUGFyYW1zXG5cdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkudG9TdHJpbmcoKSk7XG5cdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSA7IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkgOyBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSkgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScpIHtcblx0XHQvLyBib2R5IGlzIEFycmF5QnVmZmVyXG5cdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkpO1xuXHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgQXJyYXlCdWZmZXJWaWV3XG5cdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKGJvZHkuYnVmZmVyLCBib2R5LmJ5dGVPZmZzZXQsIGJvZHkuYnl0ZUxlbmd0aCk7XG5cdH0gZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkgOyBlbHNlIHtcblx0XHQvLyBub25lIG9mIHRoZSBhYm92ZVxuXHRcdC8vIGNvZXJjZSB0byBzdHJpbmcgdGhlbiBidWZmZXJcblx0XHRib2R5ID0gQnVmZmVyLmZyb20oU3RyaW5nKGJvZHkpKTtcblx0fVxuXHR0aGlzW0lOVEVSTkFMU10gPSB7XG5cdFx0Ym9keSxcblx0XHRkaXN0dXJiZWQ6IGZhbHNlLFxuXHRcdGVycm9yOiBudWxsXG5cdH07XG5cdHRoaXMuc2l6ZSA9IHNpemU7XG5cdHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XG5cblx0aWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIHtcblx0XHRib2R5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGNvbnN0IGVycm9yID0gZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJyA/IGVyciA6IG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7X3RoaXMudXJsfTogJHtlcnIubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyKTtcblx0XHRcdF90aGlzW0lOVEVSTkFMU10uZXJyb3IgPSBlcnJvcjtcblx0XHR9KTtcblx0fVxufVxuXG5Cb2R5LnByb3RvdHlwZSA9IHtcblx0Z2V0IGJvZHkoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5ib2R5O1xuXHR9LFxuXG5cdGdldCBib2R5VXNlZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmRpc3R1cmJlZDtcblx0fSxcblxuXHQvKipcbiAgKiBEZWNvZGUgcmVzcG9uc2UgYXMgQXJyYXlCdWZmZXJcbiAgKlxuICAqIEByZXR1cm4gIFByb21pc2VcbiAgKi9cblx0YXJyYXlCdWZmZXIoKSB7XG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcykudGhlbihmdW5jdGlvbiAoYnVmKSB7XG5cdFx0XHRyZXR1cm4gYnVmLmJ1ZmZlci5zbGljZShidWYuYnl0ZU9mZnNldCwgYnVmLmJ5dGVPZmZzZXQgKyBidWYuYnl0ZUxlbmd0aCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG4gICogUmV0dXJuIHJhdyByZXNwb25zZSBhcyBCbG9iXG4gICpcbiAgKiBAcmV0dXJuIFByb21pc2VcbiAgKi9cblx0YmxvYigpIHtcblx0XHRsZXQgY3QgPSB0aGlzLmhlYWRlcnMgJiYgdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJyc7XG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcykudGhlbihmdW5jdGlvbiAoYnVmKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihcblx0XHRcdC8vIFByZXZlbnQgY29weWluZ1xuXHRcdFx0bmV3IEJsb2IoW10sIHtcblx0XHRcdFx0dHlwZTogY3QudG9Mb3dlckNhc2UoKVxuXHRcdFx0fSksIHtcblx0XHRcdFx0W0JVRkZFUl06IGJ1ZlxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG4gICogRGVjb2RlIHJlc3BvbnNlIGFzIGpzb25cbiAgKlxuICAqIEByZXR1cm4gIFByb21pc2VcbiAgKi9cblx0anNvbigpIHtcblx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1ZmZlcikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyLnRvU3RyaW5nKCkpO1xuXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBCb2R5LlByb21pc2UucmVqZWN0KG5ldyBGZXRjaEVycm9yKGBpbnZhbGlkIGpzb24gcmVzcG9uc2UgYm9keSBhdCAke190aGlzMi51cmx9IHJlYXNvbjogJHtlcnIubWVzc2FnZX1gLCAnaW52YWxpZC1qc29uJykpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyB0ZXh0XG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdHRleHQoKSB7XG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcykudGhlbihmdW5jdGlvbiAoYnVmZmVyKSB7XG5cdFx0XHRyZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG4gICogRGVjb2RlIHJlc3BvbnNlIGFzIGJ1ZmZlciAobm9uLXNwZWMgYXBpKVxuICAqXG4gICogQHJldHVybiAgUHJvbWlzZVxuICAqL1xuXHRidWZmZXIoKSB7XG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcyk7XG5cdH0sXG5cblx0LyoqXG4gICogRGVjb2RlIHJlc3BvbnNlIGFzIHRleHQsIHdoaWxlIGF1dG9tYXRpY2FsbHkgZGV0ZWN0aW5nIHRoZSBlbmNvZGluZyBhbmRcbiAgKiB0cnlpbmcgdG8gZGVjb2RlIHRvIFVURi04IChub24tc3BlYyBhcGkpXG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdHRleHRDb252ZXJ0ZWQoKSB7XG5cdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHRyZXR1cm4gY29uc3VtZUJvZHkuY2FsbCh0aGlzKS50aGVuKGZ1bmN0aW9uIChidWZmZXIpIHtcblx0XHRcdHJldHVybiBjb252ZXJ0Qm9keShidWZmZXIsIF90aGlzMy5oZWFkZXJzKTtcblx0XHR9KTtcblx0fVxufTtcblxuLy8gSW4gYnJvd3NlcnMsIGFsbCBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhYmxlLlxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQm9keS5wcm90b3R5cGUsIHtcblx0Ym9keTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGJvZHlVc2VkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0YXJyYXlCdWZmZXI6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRibG9iOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0anNvbjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHRleHQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcblxuQm9keS5taXhJbiA9IGZ1bmN0aW9uIChwcm90bykge1xuXHRmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoQm9keS5wcm90b3R5cGUpKSB7XG5cdFx0Ly8gaXN0YW5idWwgaWdub3JlIGVsc2U6IGZ1dHVyZSBwcm9vZlxuXHRcdGlmICghKG5hbWUgaW4gcHJvdG8pKSB7XG5cdFx0XHRjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihCb2R5LnByb3RvdHlwZSwgbmFtZSk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIGRlc2MpO1xuXHRcdH1cblx0fVxufTtcblxuLyoqXG4gKiBDb25zdW1lIGFuZCBjb252ZXJ0IGFuIGVudGlyZSBCb2R5IHRvIGEgQnVmZmVyLlxuICpcbiAqIFJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keS1jb25zdW1lLWJvZHlcbiAqXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbmZ1bmN0aW9uIGNvbnN1bWVCb2R5KCkge1xuXHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRpZiAodGhpc1tJTlRFUk5BTFNdLmRpc3R1cmJlZCkge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoYGJvZHkgdXNlZCBhbHJlYWR5IGZvcjogJHt0aGlzLnVybH1gKSk7XG5cdH1cblxuXHR0aGlzW0lOVEVSTkFMU10uZGlzdHVyYmVkID0gdHJ1ZTtcblxuXHRpZiAodGhpc1tJTlRFUk5BTFNdLmVycm9yKSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZWplY3QodGhpc1tJTlRFUk5BTFNdLmVycm9yKTtcblx0fVxuXG5cdGxldCBib2R5ID0gdGhpcy5ib2R5O1xuXG5cdC8vIGJvZHkgaXMgbnVsbFxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVzb2x2ZShCdWZmZXIuYWxsb2MoMCkpO1xuXHR9XG5cblx0Ly8gYm9keSBpcyBibG9iXG5cdGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRib2R5ID0gYm9keS5zdHJlYW0oKTtcblx0fVxuXG5cdC8vIGJvZHkgaXMgYnVmZmVyXG5cdGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlc29sdmUoYm9keSk7XG5cdH1cblxuXHQvLyBpc3RhbmJ1bCBpZ25vcmUgaWY6IHNob3VsZCBuZXZlciBoYXBwZW5cblx0aWYgKCEoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlc29sdmUoQnVmZmVyLmFsbG9jKDApKTtcblx0fVxuXG5cdC8vIGJvZHkgaXMgc3RyZWFtXG5cdC8vIGdldCByZWFkeSB0byBhY3R1YWxseSBjb25zdW1lIHRoZSBib2R5XG5cdGxldCBhY2N1bSA9IFtdO1xuXHRsZXQgYWNjdW1CeXRlcyA9IDA7XG5cdGxldCBhYm9ydCA9IGZhbHNlO1xuXG5cdHJldHVybiBuZXcgQm9keS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRsZXQgcmVzVGltZW91dDtcblxuXHRcdC8vIGFsbG93IHRpbWVvdXQgb24gc2xvdyByZXNwb25zZSBib2R5XG5cdFx0aWYgKF90aGlzNC50aW1lb3V0KSB7XG5cdFx0XHRyZXNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGFib3J0ID0gdHJ1ZTtcblx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBSZXNwb25zZSB0aW1lb3V0IHdoaWxlIHRyeWluZyB0byBmZXRjaCAke190aGlzNC51cmx9IChvdmVyICR7X3RoaXM0LnRpbWVvdXR9bXMpYCwgJ2JvZHktdGltZW91dCcpKTtcblx0XHRcdH0sIF90aGlzNC50aW1lb3V0KTtcblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgc3RyZWFtIGVycm9yc1xuXHRcdGJvZHkub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0aWYgKGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicpIHtcblx0XHRcdFx0Ly8gaWYgdGhlIHJlcXVlc3Qgd2FzIGFib3J0ZWQsIHJlamVjdCB3aXRoIHRoaXMgRXJyb3Jcblx0XHRcdFx0YWJvcnQgPSB0cnVlO1xuXHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIG90aGVyIGVycm9ycywgc3VjaCBhcyBpbmNvcnJlY3QgY29udGVudC1lbmNvZGluZ1xuXHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYEludmFsaWQgcmVzcG9uc2UgYm9keSB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHtfdGhpczQudXJsfTogJHtlcnIubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRib2R5Lm9uKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRpZiAoYWJvcnQgfHwgY2h1bmsgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoX3RoaXM0LnNpemUgJiYgYWNjdW1CeXRlcyArIGNodW5rLmxlbmd0aCA+IF90aGlzNC5zaXplKSB7XG5cdFx0XHRcdGFib3J0ID0gdHJ1ZTtcblx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBjb250ZW50IHNpemUgYXQgJHtfdGhpczQudXJsfSBvdmVyIGxpbWl0OiAke190aGlzNC5zaXplfWAsICdtYXgtc2l6ZScpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRhY2N1bUJ5dGVzICs9IGNodW5rLmxlbmd0aDtcblx0XHRcdGFjY3VtLnB1c2goY2h1bmspO1xuXHRcdH0pO1xuXG5cdFx0Ym9keS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKGFib3J0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlc1RpbWVvdXQpO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRyZXNvbHZlKEJ1ZmZlci5jb25jYXQoYWNjdW0sIGFjY3VtQnl0ZXMpKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHQvLyBoYW5kbGUgc3RyZWFtcyB0aGF0IGhhdmUgYWNjdW11bGF0ZWQgdG9vIG11Y2ggZGF0YSAoaXNzdWUgIzQxNClcblx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBDb3VsZCBub3QgY3JlYXRlIEJ1ZmZlciBmcm9tIHJlc3BvbnNlIGJvZHkgZm9yICR7X3RoaXM0LnVybH06ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycikpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgYnVmZmVyIGVuY29kaW5nIGFuZCBjb252ZXJ0IHRvIHRhcmdldCBlbmNvZGluZ1xuICogcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1dELWh0bWw1LTIwMTEwMTEzL3BhcnNpbmcuaHRtbCNkZXRlcm1pbmluZy10aGUtY2hhcmFjdGVyLWVuY29kaW5nXG4gKlxuICogQHBhcmFtICAgQnVmZmVyICBidWZmZXIgICAgSW5jb21pbmcgYnVmZmVyXG4gKiBAcGFyYW0gICBTdHJpbmcgIGVuY29kaW5nICBUYXJnZXQgZW5jb2RpbmdcbiAqIEByZXR1cm4gIFN0cmluZ1xuICovXG5mdW5jdGlvbiBjb252ZXJ0Qm9keShidWZmZXIsIGhlYWRlcnMpIHtcblx0aWYgKHR5cGVvZiBjb252ZXJ0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdUaGUgcGFja2FnZSBgZW5jb2RpbmdgIG11c3QgYmUgaW5zdGFsbGVkIHRvIHVzZSB0aGUgdGV4dENvbnZlcnRlZCgpIGZ1bmN0aW9uJyk7XG5cdH1cblxuXHRjb25zdCBjdCA9IGhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcblx0bGV0IGNoYXJzZXQgPSAndXRmLTgnO1xuXHRsZXQgcmVzLCBzdHI7XG5cblx0Ly8gaGVhZGVyXG5cdGlmIChjdCkge1xuXHRcdHJlcyA9IC9jaGFyc2V0PShbXjtdKikvaS5leGVjKGN0KTtcblx0fVxuXG5cdC8vIG5vIGNoYXJzZXQgaW4gY29udGVudCB0eXBlLCBwZWVrIGF0IHJlc3BvbnNlIGJvZHkgZm9yIGF0IG1vc3QgMTAyNCBieXRlc1xuXHRzdHIgPSBidWZmZXIuc2xpY2UoMCwgMTAyNCkudG9TdHJpbmcoKTtcblxuXHQvLyBodG1sNVxuXHRpZiAoIXJlcyAmJiBzdHIpIHtcblx0XHRyZXMgPSAvPG1ldGEuKz9jaGFyc2V0PShbJ1wiXSkoLis/KVxcMS9pLmV4ZWMoc3RyKTtcblx0fVxuXG5cdC8vIGh0bWw0XG5cdGlmICghcmVzICYmIHN0cikge1xuXHRcdHJlcyA9IC88bWV0YVtcXHNdKz9odHRwLWVxdWl2PShbJ1wiXSljb250ZW50LXR5cGVcXDFbXFxzXSs/Y29udGVudD0oWydcIl0pKC4rPylcXDIvaS5leGVjKHN0cik7XG5cblx0XHRpZiAocmVzKSB7XG5cdFx0XHRyZXMgPSAvY2hhcnNldD0oLiopL2kuZXhlYyhyZXMucG9wKCkpO1xuXHRcdH1cblx0fVxuXG5cdC8vIHhtbFxuXHRpZiAoIXJlcyAmJiBzdHIpIHtcblx0XHRyZXMgPSAvPFxcP3htbC4rP2VuY29kaW5nPShbJ1wiXSkoLis/KVxcMS9pLmV4ZWMoc3RyKTtcblx0fVxuXG5cdC8vIGZvdW5kIGNoYXJzZXRcblx0aWYgKHJlcykge1xuXHRcdGNoYXJzZXQgPSByZXMucG9wKCk7XG5cblx0XHQvLyBwcmV2ZW50IGRlY29kZSBpc3N1ZXMgd2hlbiBzaXRlcyB1c2UgaW5jb3JyZWN0IGVuY29kaW5nXG5cdFx0Ly8gcmVmOiBodHRwczovL2hzaXZvbmVuLmZpL2VuY29kaW5nLW1lbnUvXG5cdFx0aWYgKGNoYXJzZXQgPT09ICdnYjIzMTInIHx8IGNoYXJzZXQgPT09ICdnYmsnKSB7XG5cdFx0XHRjaGFyc2V0ID0gJ2diMTgwMzAnO1xuXHRcdH1cblx0fVxuXG5cdC8vIHR1cm4gcmF3IGJ1ZmZlcnMgaW50byBhIHNpbmdsZSB1dGYtOCBidWZmZXJcblx0cmV0dXJuIGNvbnZlcnQoYnVmZmVyLCAnVVRGLTgnLCBjaGFyc2V0KS50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIERldGVjdCBhIFVSTFNlYXJjaFBhcmFtcyBvYmplY3RcbiAqIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL2JpdGlubi9ub2RlLWZldGNoL2lzc3Vlcy8yOTYjaXNzdWVjb21tZW50LTMwNzU5ODE0M1xuICpcbiAqIEBwYXJhbSAgIE9iamVjdCAgb2JqICAgICBPYmplY3QgdG8gZGV0ZWN0IGJ5IHR5cGUgb3IgYnJhbmRcbiAqIEByZXR1cm4gIFN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyhvYmopIHtcblx0Ly8gRHVjay10eXBpbmcgYXMgYSBuZWNlc3NhcnkgY29uZGl0aW9uLlxuXHRpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iai5hcHBlbmQgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iai5kZWxldGUgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iai5nZXQgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iai5nZXRBbGwgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iai5oYXMgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIG9iai5zZXQgIT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBCcmFuZC1jaGVja2luZyBhbmQgbW9yZSBkdWNrLXR5cGluZyBhcyBvcHRpb25hbCBjb25kaXRpb24uXG5cdHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ1VSTFNlYXJjaFBhcmFtcycgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFVSTFNlYXJjaFBhcmFtc10nIHx8IHR5cGVvZiBvYmouc29ydCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIFczQyBgQmxvYmAgb2JqZWN0ICh3aGljaCBgRmlsZWAgaW5oZXJpdHMgZnJvbSlcbiAqIEBwYXJhbSAgeyp9IG9ialxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNCbG9iKG9iaikge1xuXHRyZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5hcnJheUJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnR5cGUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBvYmouc3RyZWFtID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSAnc3RyaW5nJyAmJiAvXihCbG9ifEZpbGUpJC8udGVzdChvYmouY29uc3RydWN0b3IubmFtZSkgJiYgL14oQmxvYnxGaWxlKSQvLnRlc3Qob2JqW1N5bWJvbC50b1N0cmluZ1RhZ10pO1xufVxuXG4vKipcbiAqIENsb25lIGJvZHkgZ2l2ZW4gUmVzL1JlcSBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAgIE1peGVkICBpbnN0YW5jZSAgUmVzcG9uc2Ugb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHJldHVybiAgTWl4ZWRcbiAqL1xuZnVuY3Rpb24gY2xvbmUoaW5zdGFuY2UpIHtcblx0bGV0IHAxLCBwMjtcblx0bGV0IGJvZHkgPSBpbnN0YW5jZS5ib2R5O1xuXG5cdC8vIGRvbid0IGFsbG93IGNsb25pbmcgYSB1c2VkIGJvZHlcblx0aWYgKGluc3RhbmNlLmJvZHlVc2VkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgY2xvbmUgYm9keSBhZnRlciBpdCBpcyB1c2VkJyk7XG5cdH1cblxuXHQvLyBjaGVjayB0aGF0IGJvZHkgaXMgYSBzdHJlYW0gYW5kIG5vdCBmb3JtLWRhdGEgb2JqZWN0XG5cdC8vIG5vdGU6IHdlIGNhbid0IGNsb25lIHRoZSBmb3JtLWRhdGEgb2JqZWN0IHdpdGhvdXQgaGF2aW5nIGl0IGFzIGEgZGVwZW5kZW5jeVxuXHRpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSAmJiB0eXBlb2YgYm9keS5nZXRCb3VuZGFyeSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIHRlZSBpbnN0YW5jZSBib2R5XG5cdFx0cDEgPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRwMiA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdGJvZHkucGlwZShwMSk7XG5cdFx0Ym9keS5waXBlKHAyKTtcblx0XHQvLyBzZXQgaW5zdGFuY2UgYm9keSB0byB0ZWVkIGJvZHkgYW5kIHJldHVybiB0aGUgb3RoZXIgdGVlZCBib2R5XG5cdFx0aW5zdGFuY2VbSU5URVJOQUxTXS5ib2R5ID0gcDE7XG5cdFx0Ym9keSA9IHAyO1xuXHR9XG5cblx0cmV0dXJuIGJvZHk7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgdGhlIG9wZXJhdGlvbiBcImV4dHJhY3QgYSBgQ29udGVudC1UeXBlYCB2YWx1ZSBmcm9tIHxvYmplY3R8XCIgYXNcbiAqIHNwZWNpZmllZCBpbiB0aGUgc3BlY2lmaWNhdGlvbjpcbiAqIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHlpbml0LWV4dHJhY3RcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBpbnN0YW5jZS5ib2R5IGlzIHByZXNlbnQuXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgIGluc3RhbmNlICBBbnkgb3B0aW9ucy5ib2R5IGlucHV0XG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RDb250ZW50VHlwZShib2R5KSB7XG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0Ly8gYm9keSBpcyBudWxsXG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0Ly8gYm9keSBpcyBzdHJpbmdcblx0XHRyZXR1cm4gJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCc7XG5cdH0gZWxzZSBpZiAoaXNVUkxTZWFyY2hQYXJhbXMoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGEgVVJMU2VhcmNoUGFyYW1zXG5cdFx0cmV0dXJuICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCc7XG5cdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBibG9iXG5cdFx0cmV0dXJuIGJvZHkudHlwZSB8fCBudWxsO1xuXHR9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgYnVmZmVyXG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nKSB7XG5cdFx0Ly8gYm9keSBpcyBBcnJheUJ1ZmZlclxuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgQXJyYXlCdWZmZXJWaWV3XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgPT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyBkZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZVxuXHRcdHJldHVybiBgbXVsdGlwYXJ0L2Zvcm0tZGF0YTtib3VuZGFyeT0ke2JvZHkuZ2V0Qm91bmRhcnkoKX1gO1xuXHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIHtcblx0XHQvLyBib2R5IGlzIHN0cmVhbVxuXHRcdC8vIGNhbid0IHJlYWxseSBkbyBtdWNoIGFib3V0IHRoaXNcblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIHtcblx0XHQvLyBCb2R5IGNvbnN0cnVjdG9yIGRlZmF1bHRzIG90aGVyIHRoaW5ncyB0byBzdHJpbmdcblx0XHRyZXR1cm4gJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCc7XG5cdH1cbn1cblxuLyoqXG4gKiBUaGUgRmV0Y2ggU3RhbmRhcmQgdHJlYXRzIHRoaXMgYXMgaWYgXCJ0b3RhbCBieXRlc1wiIGlzIGEgcHJvcGVydHkgb24gdGhlIGJvZHkuXG4gKiBGb3IgdXMsIHdlIGhhdmUgdG8gZXhwbGljaXRseSBnZXQgaXQgd2l0aCBhIGZ1bmN0aW9uLlxuICpcbiAqIHJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keS10b3RhbC1ieXRlc1xuICpcbiAqIEBwYXJhbSAgIEJvZHkgICAgaW5zdGFuY2UgICBJbnN0YW5jZSBvZiBCb2R5XG4gKiBAcmV0dXJuICBOdW1iZXI/ICAgICAgICAgICAgTnVtYmVyIG9mIGJ5dGVzLCBvciBudWxsIGlmIG5vdCBwb3NzaWJsZVxuICovXG5mdW5jdGlvbiBnZXRUb3RhbEJ5dGVzKGluc3RhbmNlKSB7XG5cdGNvbnN0IGJvZHkgPSBpbnN0YW5jZS5ib2R5O1xuXG5cblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHQvLyBib2R5IGlzIG51bGxcblx0XHRyZXR1cm4gMDtcblx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRyZXR1cm4gYm9keS5zaXplO1xuXHR9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgYnVmZmVyXG5cdFx0cmV0dXJuIGJvZHkubGVuZ3RoO1xuXHR9IGVsc2UgaWYgKGJvZHkgJiYgdHlwZW9mIGJvZHkuZ2V0TGVuZ3RoU3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdC8vIGRldGVjdCBmb3JtIGRhdGEgaW5wdXQgZnJvbSBmb3JtLWRhdGEgbW9kdWxlXG5cdFx0aWYgKGJvZHkuX2xlbmd0aFJldHJpZXZlcnMgJiYgYm9keS5fbGVuZ3RoUmV0cmlldmVycy5sZW5ndGggPT0gMCB8fCAvLyAxLnhcblx0XHRib2R5Lmhhc0tub3duTGVuZ3RoICYmIGJvZHkuaGFzS25vd25MZW5ndGgoKSkge1xuXHRcdFx0Ly8gMi54XG5cdFx0XHRyZXR1cm4gYm9keS5nZXRMZW5ndGhTeW5jKCk7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdC8vIGJvZHkgaXMgc3RyZWFtXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBXcml0ZSBhIEJvZHkgdG8gYSBOb2RlLmpzIFdyaXRhYmxlU3RyZWFtIChlLmcuIGh0dHAuUmVxdWVzdCkgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAgIEJvZHkgICAgaW5zdGFuY2UgICBJbnN0YW5jZSBvZiBCb2R5XG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmZ1bmN0aW9uIHdyaXRlVG9TdHJlYW0oZGVzdCwgaW5zdGFuY2UpIHtcblx0Y29uc3QgYm9keSA9IGluc3RhbmNlLmJvZHk7XG5cblxuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdC8vIGJvZHkgaXMgbnVsbFxuXHRcdGRlc3QuZW5kKCk7XG5cdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0Ym9keS5zdHJlYW0oKS5waXBlKGRlc3QpO1xuXHR9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgYnVmZmVyXG5cdFx0ZGVzdC53cml0ZShib2R5KTtcblx0XHRkZXN0LmVuZCgpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIGJvZHkgaXMgc3RyZWFtXG5cdFx0Ym9keS5waXBlKGRlc3QpO1xuXHR9XG59XG5cbi8vIGV4cG9zZSBQcm9taXNlXG5Cb2R5LlByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxuLyoqXG4gKiBoZWFkZXJzLmpzXG4gKlxuICogSGVhZGVycyBjbGFzcyBvZmZlcnMgY29udmVuaWVudCBoZWxwZXJzXG4gKi9cblxuY29uc3QgaW52YWxpZFRva2VuUmVnZXggPSAvW15cXF5fYGEtekEtWlxcLTAtOSEjJCUmJyorLnx+XS87XG5jb25zdCBpbnZhbGlkSGVhZGVyQ2hhclJlZ2V4ID0gL1teXFx0XFx4MjAtXFx4N2VcXHg4MC1cXHhmZl0vO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZU5hbWUobmFtZSkge1xuXHRuYW1lID0gYCR7bmFtZX1gO1xuXHRpZiAoaW52YWxpZFRva2VuUmVnZXgudGVzdChuYW1lKSB8fCBuYW1lID09PSAnJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYCR7bmFtZX0gaXMgbm90IGEgbGVnYWwgSFRUUCBoZWFkZXIgbmFtZWApO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVmFsdWUodmFsdWUpIHtcblx0dmFsdWUgPSBgJHt2YWx1ZX1gO1xuXHRpZiAoaW52YWxpZEhlYWRlckNoYXJSZWdleC50ZXN0KHZhbHVlKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYCR7dmFsdWV9IGlzIG5vdCBhIGxlZ2FsIEhUVFAgaGVhZGVyIHZhbHVlYCk7XG5cdH1cbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBrZXkgaW4gdGhlIG1hcCBvYmplY3QgZ2l2ZW4gYSBoZWFkZXIgbmFtZS5cbiAqXG4gKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBub3QgZm91bmQuXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICBuYW1lICBIZWFkZXIgbmFtZVxuICogQHJldHVybiAgU3RyaW5nfFVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBmaW5kKG1hcCwgbmFtZSkge1xuXHRuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRmb3IgKGNvbnN0IGtleSBpbiBtYXApIHtcblx0XHRpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09IG5hbWUpIHtcblx0XHRcdHJldHVybiBrZXk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IE1BUCA9IFN5bWJvbCgnbWFwJyk7XG5jbGFzcyBIZWFkZXJzIHtcblx0LyoqXG4gICogSGVhZGVycyBjbGFzc1xuICAqXG4gICogQHBhcmFtICAgT2JqZWN0ICBoZWFkZXJzICBSZXNwb25zZSBoZWFkZXJzXG4gICogQHJldHVybiAgVm9pZFxuICAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRsZXQgaW5pdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkO1xuXG5cdFx0dGhpc1tNQVBdID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRcdGlmIChpbml0IGluc3RhbmNlb2YgSGVhZGVycykge1xuXHRcdFx0Y29uc3QgcmF3SGVhZGVycyA9IGluaXQucmF3KCk7XG5cdFx0XHRjb25zdCBoZWFkZXJOYW1lcyA9IE9iamVjdC5rZXlzKHJhd0hlYWRlcnMpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IGhlYWRlck5hbWUgb2YgaGVhZGVyTmFtZXMpIHtcblx0XHRcdFx0Zm9yIChjb25zdCB2YWx1ZSBvZiByYXdIZWFkZXJzW2hlYWRlck5hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5hcHBlbmQoaGVhZGVyTmFtZSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXZSBkb24ndCB3b3JyeSBhYm91dCBjb252ZXJ0aW5nIHByb3AgdG8gQnl0ZVN0cmluZyBoZXJlIGFzIGFwcGVuZCgpXG5cdFx0Ly8gd2lsbCBoYW5kbGUgaXQuXG5cdFx0aWYgKGluaXQgPT0gbnVsbCkgOyBlbHNlIGlmICh0eXBlb2YgaW5pdCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGNvbnN0IG1ldGhvZCA9IGluaXRbU3ltYm9sLml0ZXJhdG9yXTtcblx0XHRcdGlmIChtZXRob2QgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0hlYWRlciBwYWlycyBtdXN0IGJlIGl0ZXJhYmxlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzZXF1ZW5jZTxzZXF1ZW5jZTxCeXRlU3RyaW5nPj5cblx0XHRcdFx0Ly8gTm90ZTogcGVyIHNwZWMgd2UgaGF2ZSB0byBmaXJzdCBleGhhdXN0IHRoZSBsaXN0cyB0aGVuIHByb2Nlc3MgdGhlbVxuXHRcdFx0XHRjb25zdCBwYWlycyA9IFtdO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHBhaXIgb2YgaW5pdCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgcGFpciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHBhaXJbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRWFjaCBoZWFkZXIgcGFpciBtdXN0IGJlIGl0ZXJhYmxlJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBhaXJzLnB1c2goQXJyYXkuZnJvbShwYWlyKSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcblx0XHRcdFx0XHRpZiAocGFpci5sZW5ndGggIT09IDIpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0VhY2ggaGVhZGVyIHBhaXIgbXVzdCBiZSBhIG5hbWUvdmFsdWUgdHVwbGUnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5hcHBlbmQocGFpclswXSwgcGFpclsxXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIHJlY29yZDxCeXRlU3RyaW5nLCBCeXRlU3RyaW5nPlxuXHRcdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhpbml0KSkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gaW5pdFtrZXldO1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kKGtleSwgdmFsdWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3ZpZGVkIGluaXRpYWxpemVyIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogUmV0dXJuIGNvbWJpbmVkIGhlYWRlciB2YWx1ZSBnaXZlbiBuYW1lXG4gICpcbiAgKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgIEhlYWRlciBuYW1lXG4gICogQHJldHVybiAgTWl4ZWRcbiAgKi9cblx0Z2V0KG5hbWUpIHtcblx0XHRuYW1lID0gYCR7bmFtZX1gO1xuXHRcdHZhbGlkYXRlTmFtZShuYW1lKTtcblx0XHRjb25zdCBrZXkgPSBmaW5kKHRoaXNbTUFQXSwgbmFtZSk7XG5cdFx0aWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpc1tNQVBdW2tleV0uam9pbignLCAnKTtcblx0fVxuXG5cdC8qKlxuICAqIEl0ZXJhdGUgb3ZlciBhbGwgaGVhZGVyc1xuICAqXG4gICogQHBhcmFtICAgRnVuY3Rpb24gIGNhbGxiYWNrICBFeGVjdXRlZCBmb3IgZWFjaCBpdGVtIHdpdGggcGFyYW1ldGVycyAodmFsdWUsIG5hbWUsIHRoaXNBcmcpXG4gICogQHBhcmFtICAgQm9vbGVhbiAgIHRoaXNBcmcgICBgdGhpc2AgY29udGV4dCBmb3IgY2FsbGJhY2sgZnVuY3Rpb25cbiAgKiBAcmV0dXJuICBWb2lkXG4gICovXG5cdGZvckVhY2goY2FsbGJhY2spIHtcblx0XHRsZXQgdGhpc0FyZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuXG5cdFx0bGV0IHBhaXJzID0gZ2V0SGVhZGVycyh0aGlzKTtcblx0XHRsZXQgaSA9IDA7XG5cdFx0d2hpbGUgKGkgPCBwYWlycy5sZW5ndGgpIHtcblx0XHRcdHZhciBfcGFpcnMkaSA9IHBhaXJzW2ldO1xuXHRcdFx0Y29uc3QgbmFtZSA9IF9wYWlycyRpWzBdLFxuXHRcdFx0ICAgICAgdmFsdWUgPSBfcGFpcnMkaVsxXTtcblxuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyk7XG5cdFx0XHRwYWlycyA9IGdldEhlYWRlcnModGhpcyk7XG5cdFx0XHRpKys7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogT3ZlcndyaXRlIGhlYWRlciB2YWx1ZXMgZ2l2ZW4gbmFtZVxuICAqXG4gICogQHBhcmFtICAgU3RyaW5nICBuYW1lICAgSGVhZGVyIG5hbWVcbiAgKiBAcGFyYW0gICBTdHJpbmcgIHZhbHVlICBIZWFkZXIgdmFsdWVcbiAgKiBAcmV0dXJuICBWb2lkXG4gICovXG5cdHNldChuYW1lLCB2YWx1ZSkge1xuXHRcdG5hbWUgPSBgJHtuYW1lfWA7XG5cdFx0dmFsdWUgPSBgJHt2YWx1ZX1gO1xuXHRcdHZhbGlkYXRlTmFtZShuYW1lKTtcblx0XHR2YWxpZGF0ZVZhbHVlKHZhbHVlKTtcblx0XHRjb25zdCBrZXkgPSBmaW5kKHRoaXNbTUFQXSwgbmFtZSk7XG5cdFx0dGhpc1tNQVBdW2tleSAhPT0gdW5kZWZpbmVkID8ga2V5IDogbmFtZV0gPSBbdmFsdWVdO1xuXHR9XG5cblx0LyoqXG4gICogQXBwZW5kIGEgdmFsdWUgb250byBleGlzdGluZyBoZWFkZXJcbiAgKlxuICAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgIEhlYWRlciBuYW1lXG4gICogQHBhcmFtICAgU3RyaW5nICB2YWx1ZSAgSGVhZGVyIHZhbHVlXG4gICogQHJldHVybiAgVm9pZFxuICAqL1xuXHRhcHBlbmQobmFtZSwgdmFsdWUpIHtcblx0XHRuYW1lID0gYCR7bmFtZX1gO1xuXHRcdHZhbHVlID0gYCR7dmFsdWV9YDtcblx0XHR2YWxpZGF0ZU5hbWUobmFtZSk7XG5cdFx0dmFsaWRhdGVWYWx1ZSh2YWx1ZSk7XG5cdFx0Y29uc3Qga2V5ID0gZmluZCh0aGlzW01BUF0sIG5hbWUpO1xuXHRcdGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpc1tNQVBdW2tleV0ucHVzaCh2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXNbTUFQXVtuYW1lXSA9IFt2YWx1ZV07XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogQ2hlY2sgZm9yIGhlYWRlciBuYW1lIGV4aXN0ZW5jZVxuICAqXG4gICogQHBhcmFtICAgU3RyaW5nICAgbmFtZSAgSGVhZGVyIG5hbWVcbiAgKiBAcmV0dXJuICBCb29sZWFuXG4gICovXG5cdGhhcyhuYW1lKSB7XG5cdFx0bmFtZSA9IGAke25hbWV9YDtcblx0XHR2YWxpZGF0ZU5hbWUobmFtZSk7XG5cdFx0cmV0dXJuIGZpbmQodGhpc1tNQVBdLCBuYW1lKSAhPT0gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG4gICogRGVsZXRlIGFsbCBoZWFkZXIgdmFsdWVzIGdpdmVuIG5hbWVcbiAgKlxuICAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAgKiBAcmV0dXJuICBWb2lkXG4gICovXG5cdGRlbGV0ZShuYW1lKSB7XG5cdFx0bmFtZSA9IGAke25hbWV9YDtcblx0XHR2YWxpZGF0ZU5hbWUobmFtZSk7XG5cdFx0Y29uc3Qga2V5ID0gZmluZCh0aGlzW01BUF0sIG5hbWUpO1xuXHRcdGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZGVsZXRlIHRoaXNbTUFQXVtrZXldO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIFJldHVybiByYXcgaGVhZGVycyAobm9uLXNwZWMgYXBpKVxuICAqXG4gICogQHJldHVybiAgT2JqZWN0XG4gICovXG5cdHJhdygpIHtcblx0XHRyZXR1cm4gdGhpc1tNQVBdO1xuXHR9XG5cblx0LyoqXG4gICogR2V0IGFuIGl0ZXJhdG9yIG9uIGtleXMuXG4gICpcbiAgKiBAcmV0dXJuICBJdGVyYXRvclxuICAqL1xuXHRrZXlzKCkge1xuXHRcdHJldHVybiBjcmVhdGVIZWFkZXJzSXRlcmF0b3IodGhpcywgJ2tleScpO1xuXHR9XG5cblx0LyoqXG4gICogR2V0IGFuIGl0ZXJhdG9yIG9uIHZhbHVlcy5cbiAgKlxuICAqIEByZXR1cm4gIEl0ZXJhdG9yXG4gICovXG5cdHZhbHVlcygpIHtcblx0XHRyZXR1cm4gY3JlYXRlSGVhZGVyc0l0ZXJhdG9yKHRoaXMsICd2YWx1ZScpO1xuXHR9XG5cblx0LyoqXG4gICogR2V0IGFuIGl0ZXJhdG9yIG9uIGVudHJpZXMuXG4gICpcbiAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IGl0ZXJhdG9yIG9mIHRoZSBIZWFkZXJzIG9iamVjdC5cbiAgKlxuICAqIEByZXR1cm4gIEl0ZXJhdG9yXG4gICovXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiBjcmVhdGVIZWFkZXJzSXRlcmF0b3IodGhpcywgJ2tleSt2YWx1ZScpO1xuXHR9XG59XG5IZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzID0gSGVhZGVycy5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEhlYWRlcnMucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcblx0dmFsdWU6ICdIZWFkZXJzJyxcblx0d3JpdGFibGU6IGZhbHNlLFxuXHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSGVhZGVycy5wcm90b3R5cGUsIHtcblx0Z2V0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0Zm9yRWFjaDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHNldDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGFwcGVuZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGhhczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGRlbGV0ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGtleXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHR2YWx1ZXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRlbnRyaWVzOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbmZ1bmN0aW9uIGdldEhlYWRlcnMoaGVhZGVycykge1xuXHRsZXQga2luZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ2tleSt2YWx1ZSc7XG5cblx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGhlYWRlcnNbTUFQXSkuc29ydCgpO1xuXHRyZXR1cm4ga2V5cy5tYXAoa2luZCA9PT0gJ2tleScgPyBmdW5jdGlvbiAoaykge1xuXHRcdHJldHVybiBrLnRvTG93ZXJDYXNlKCk7XG5cdH0gOiBraW5kID09PSAndmFsdWUnID8gZnVuY3Rpb24gKGspIHtcblx0XHRyZXR1cm4gaGVhZGVyc1tNQVBdW2tdLmpvaW4oJywgJyk7XG5cdH0gOiBmdW5jdGlvbiAoaykge1xuXHRcdHJldHVybiBbay50b0xvd2VyQ2FzZSgpLCBoZWFkZXJzW01BUF1ba10uam9pbignLCAnKV07XG5cdH0pO1xufVxuXG5jb25zdCBJTlRFUk5BTCA9IFN5bWJvbCgnaW50ZXJuYWwnKTtcblxuZnVuY3Rpb24gY3JlYXRlSGVhZGVyc0l0ZXJhdG9yKHRhcmdldCwga2luZCkge1xuXHRjb25zdCBpdGVyYXRvciA9IE9iamVjdC5jcmVhdGUoSGVhZGVyc0l0ZXJhdG9yUHJvdG90eXBlKTtcblx0aXRlcmF0b3JbSU5URVJOQUxdID0ge1xuXHRcdHRhcmdldCxcblx0XHRraW5kLFxuXHRcdGluZGV4OiAwXG5cdH07XG5cdHJldHVybiBpdGVyYXRvcjtcbn1cblxuY29uc3QgSGVhZGVyc0l0ZXJhdG9yUHJvdG90eXBlID0gT2JqZWN0LnNldFByb3RvdHlwZU9mKHtcblx0bmV4dCgpIHtcblx0XHQvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcblx0XHRpZiAoIXRoaXMgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpICE9PSBIZWFkZXJzSXRlcmF0b3JQcm90b3R5cGUpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIG9mIGB0aGlzYCBpcyBub3QgYSBIZWFkZXJzSXRlcmF0b3InKTtcblx0XHR9XG5cblx0XHR2YXIgX0lOVEVSTkFMID0gdGhpc1tJTlRFUk5BTF07XG5cdFx0Y29uc3QgdGFyZ2V0ID0gX0lOVEVSTkFMLnRhcmdldCxcblx0XHQgICAgICBraW5kID0gX0lOVEVSTkFMLmtpbmQsXG5cdFx0ICAgICAgaW5kZXggPSBfSU5URVJOQUwuaW5kZXg7XG5cblx0XHRjb25zdCB2YWx1ZXMgPSBnZXRIZWFkZXJzKHRhcmdldCwga2luZCk7XG5cdFx0Y29uc3QgbGVuID0gdmFsdWVzLmxlbmd0aDtcblx0XHRpZiAoaW5kZXggPj0gbGVuKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxuXHRcdFx0XHRkb25lOiB0cnVlXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxdLmluZGV4ID0gaW5kZXggKyAxO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZhbHVlOiB2YWx1ZXNbaW5kZXhdLFxuXHRcdFx0ZG9uZTogZmFsc2Vcblx0XHR9O1xuXHR9XG59LCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSkpKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEhlYWRlcnNJdGVyYXRvclByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG5cdHZhbHVlOiAnSGVhZGVyc0l0ZXJhdG9yJyxcblx0d3JpdGFibGU6IGZhbHNlLFxuXHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBFeHBvcnQgdGhlIEhlYWRlcnMgb2JqZWN0IGluIGEgZm9ybSB0aGF0IE5vZGUuanMgY2FuIGNvbnN1bWUuXG4gKlxuICogQHBhcmFtICAgSGVhZGVycyAgaGVhZGVyc1xuICogQHJldHVybiAgT2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGV4cG9ydE5vZGVDb21wYXRpYmxlSGVhZGVycyhoZWFkZXJzKSB7XG5cdGNvbnN0IG9iaiA9IE9iamVjdC5hc3NpZ24oeyBfX3Byb3RvX186IG51bGwgfSwgaGVhZGVyc1tNQVBdKTtcblxuXHQvLyBodHRwLnJlcXVlc3QoKSBvbmx5IHN1cHBvcnRzIHN0cmluZyBhcyBIb3N0IGhlYWRlci4gVGhpcyBoYWNrIG1ha2VzXG5cdC8vIHNwZWNpZnlpbmcgY3VzdG9tIEhvc3QgaGVhZGVyIHBvc3NpYmxlLlxuXHRjb25zdCBob3N0SGVhZGVyS2V5ID0gZmluZChoZWFkZXJzW01BUF0sICdIb3N0Jyk7XG5cdGlmIChob3N0SGVhZGVyS2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRvYmpbaG9zdEhlYWRlcktleV0gPSBvYmpbaG9zdEhlYWRlcktleV1bMF07XG5cdH1cblxuXHRyZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIEhlYWRlcnMgb2JqZWN0IGZyb20gYW4gb2JqZWN0IG9mIGhlYWRlcnMsIGlnbm9yaW5nIHRob3NlIHRoYXQgZG9cbiAqIG5vdCBjb25mb3JtIHRvIEhUVFAgZ3JhbW1hciBwcm9kdWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gICBPYmplY3QgIG9iaiAgT2JqZWN0IG9mIGhlYWRlcnNcbiAqIEByZXR1cm4gIEhlYWRlcnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSGVhZGVyc0xlbmllbnQob2JqKSB7XG5cdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuXHRmb3IgKGNvbnN0IG5hbWUgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuXHRcdGlmIChpbnZhbGlkVG9rZW5SZWdleC50ZXN0KG5hbWUpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqW25hbWVdKSkge1xuXHRcdFx0Zm9yIChjb25zdCB2YWwgb2Ygb2JqW25hbWVdKSB7XG5cdFx0XHRcdGlmIChpbnZhbGlkSGVhZGVyQ2hhclJlZ2V4LnRlc3QodmFsKSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChoZWFkZXJzW01BUF1bbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGhlYWRlcnNbTUFQXVtuYW1lXSA9IFt2YWxdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhlYWRlcnNbTUFQXVtuYW1lXS5wdXNoKHZhbCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCFpbnZhbGlkSGVhZGVyQ2hhclJlZ2V4LnRlc3Qob2JqW25hbWVdKSkge1xuXHRcdFx0aGVhZGVyc1tNQVBdW25hbWVdID0gW29ialtuYW1lXV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBoZWFkZXJzO1xufVxuXG5jb25zdCBJTlRFUk5BTFMkMSA9IFN5bWJvbCgnUmVzcG9uc2UgaW50ZXJuYWxzJyk7XG5cbi8vIGZpeCBhbiBpc3N1ZSB3aGVyZSBcIlNUQVRVU19DT0RFU1wiIGFyZW4ndCBhIG5hbWVkIGV4cG9ydCBmb3Igbm9kZSA8MTBcbmNvbnN0IFNUQVRVU19DT0RFUyA9IGh0dHAuU1RBVFVTX0NPREVTO1xuXG4vKipcbiAqIFJlc3BvbnNlIGNsYXNzXG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5jbGFzcyBSZXNwb25zZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGxldCBib2R5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuXHRcdGxldCBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuXHRcdEJvZHkuY2FsbCh0aGlzLCBib2R5LCBvcHRzKTtcblxuXHRcdGNvbnN0IHN0YXR1cyA9IG9wdHMuc3RhdHVzIHx8IDIwMDtcblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0cy5oZWFkZXJzKTtcblxuXHRcdGlmIChib2R5ICE9IG51bGwgJiYgIWhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSkge1xuXHRcdFx0Y29uc3QgY29udGVudFR5cGUgPSBleHRyYWN0Q29udGVudFR5cGUoYm9keSk7XG5cdFx0XHRpZiAoY29udGVudFR5cGUpIHtcblx0XHRcdFx0aGVhZGVycy5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsIGNvbnRlbnRUeXBlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMUyQxXSA9IHtcblx0XHRcdHVybDogb3B0cy51cmwsXG5cdFx0XHRzdGF0dXMsXG5cdFx0XHRzdGF0dXNUZXh0OiBvcHRzLnN0YXR1c1RleHQgfHwgU1RBVFVTX0NPREVTW3N0YXR1c10sXG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0Y291bnRlcjogb3B0cy5jb3VudGVyXG5cdFx0fTtcblx0fVxuXG5cdGdldCB1cmwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLnVybCB8fCAnJztcblx0fVxuXG5cdGdldCBzdGF0dXMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLnN0YXR1cztcblx0fVxuXG5cdC8qKlxuICAqIENvbnZlbmllbmNlIHByb3BlcnR5IHJlcHJlc2VudGluZyBpZiB0aGUgcmVxdWVzdCBlbmRlZCBub3JtYWxseVxuICAqL1xuXHRnZXQgb2soKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLnN0YXR1cyA+PSAyMDAgJiYgdGhpc1tJTlRFUk5BTFMkMV0uc3RhdHVzIDwgMzAwO1xuXHR9XG5cblx0Z2V0IHJlZGlyZWN0ZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLmNvdW50ZXIgPiAwO1xuXHR9XG5cblx0Z2V0IHN0YXR1c1RleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLnN0YXR1c1RleHQ7XG5cdH1cblxuXHRnZXQgaGVhZGVycygpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMV0uaGVhZGVycztcblx0fVxuXG5cdC8qKlxuICAqIENsb25lIHRoaXMgcmVzcG9uc2VcbiAgKlxuICAqIEByZXR1cm4gIFJlc3BvbnNlXG4gICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UoY2xvbmUodGhpcyksIHtcblx0XHRcdHVybDogdGhpcy51cmwsXG5cdFx0XHRzdGF0dXM6IHRoaXMuc3RhdHVzLFxuXHRcdFx0c3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuXHRcdFx0aGVhZGVyczogdGhpcy5oZWFkZXJzLFxuXHRcdFx0b2s6IHRoaXMub2ssXG5cdFx0XHRyZWRpcmVjdGVkOiB0aGlzLnJlZGlyZWN0ZWRcblx0XHR9KTtcblx0fVxufVxuXG5Cb2R5Lm1peEluKFJlc3BvbnNlLnByb3RvdHlwZSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlc3BvbnNlLnByb3RvdHlwZSwge1xuXHR1cmw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzdGF0dXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRvazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHJlZGlyZWN0ZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzdGF0dXNUZXh0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0aGVhZGVyczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGNsb25lOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZXNwb25zZS5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuXHR2YWx1ZTogJ1Jlc3BvbnNlJyxcblx0d3JpdGFibGU6IGZhbHNlLFxuXHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuY29uc3QgSU5URVJOQUxTJDIgPSBTeW1ib2woJ1JlcXVlc3QgaW50ZXJuYWxzJyk7XG5cbi8vIGZpeCBhbiBpc3N1ZSB3aGVyZSBcImZvcm1hdFwiLCBcInBhcnNlXCIgYXJlbid0IGEgbmFtZWQgZXhwb3J0IGZvciBub2RlIDwxMFxuY29uc3QgcGFyc2VfdXJsID0gVXJsLnBhcnNlO1xuY29uc3QgZm9ybWF0X3VybCA9IFVybC5mb3JtYXQ7XG5cbmNvbnN0IHN0cmVhbURlc3RydWN0aW9uU3VwcG9ydGVkID0gJ2Rlc3Ryb3knIGluIFN0cmVhbS5SZWFkYWJsZS5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBSZXF1ZXN0LlxuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgaW5wdXRcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gaXNSZXF1ZXN0KGlucHV0KSB7XG5cdHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnICYmIHR5cGVvZiBpbnB1dFtJTlRFUk5BTFMkMl0gPT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpc0Fib3J0U2lnbmFsKHNpZ25hbCkge1xuXHRjb25zdCBwcm90byA9IHNpZ25hbCAmJiB0eXBlb2Ygc2lnbmFsID09PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc2lnbmFsKTtcblx0cmV0dXJuICEhKHByb3RvICYmIHByb3RvLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBYm9ydFNpZ25hbCcpO1xufVxuXG4vKipcbiAqIFJlcXVlc3QgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGlucHV0ICBVcmwgb3IgUmVxdWVzdCBpbnN0YW5jZVxuICogQHBhcmFtICAgT2JqZWN0ICBpbml0ICAgQ3VzdG9tIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuY2xhc3MgUmVxdWVzdCB7XG5cdGNvbnN0cnVjdG9yKGlucHV0KSB7XG5cdFx0bGV0IGluaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG5cdFx0bGV0IHBhcnNlZFVSTDtcblxuXHRcdC8vIG5vcm1hbGl6ZSBpbnB1dFxuXHRcdGlmICghaXNSZXF1ZXN0KGlucHV0KSkge1xuXHRcdFx0aWYgKGlucHV0ICYmIGlucHV0LmhyZWYpIHtcblx0XHRcdFx0Ly8gaW4gb3JkZXIgdG8gc3VwcG9ydCBOb2RlLmpzJyBVcmwgb2JqZWN0czsgdGhvdWdoIFdIQVRXRydzIFVSTCBvYmplY3RzXG5cdFx0XHRcdC8vIHdpbGwgZmFsbCBpbnRvIHRoaXMgYnJhbmNoIGFsc28gKHNpbmNlIHRoZWlyIGB0b1N0cmluZygpYCB3aWxsIHJldHVyblxuXHRcdFx0XHQvLyBgaHJlZmAgcHJvcGVydHkgYW55d2F5KVxuXHRcdFx0XHRwYXJzZWRVUkwgPSBwYXJzZV91cmwoaW5wdXQuaHJlZik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBjb2VyY2UgaW5wdXQgdG8gYSBzdHJpbmcgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcGFyc2Vcblx0XHRcdFx0cGFyc2VkVVJMID0gcGFyc2VfdXJsKGAke2lucHV0fWApO1xuXHRcdFx0fVxuXHRcdFx0aW5wdXQgPSB7fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyc2VkVVJMID0gcGFyc2VfdXJsKGlucHV0LnVybCk7XG5cdFx0fVxuXG5cdFx0bGV0IG1ldGhvZCA9IGluaXQubWV0aG9kIHx8IGlucHV0Lm1ldGhvZCB8fCAnR0VUJztcblx0XHRtZXRob2QgPSBtZXRob2QudG9VcHBlckNhc2UoKTtcblxuXHRcdGlmICgoaW5pdC5ib2R5ICE9IG51bGwgfHwgaXNSZXF1ZXN0KGlucHV0KSAmJiBpbnB1dC5ib2R5ICE9PSBudWxsKSAmJiAobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdIRUFEJykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlcXVlc3Qgd2l0aCBHRVQvSEVBRCBtZXRob2QgY2Fubm90IGhhdmUgYm9keScpO1xuXHRcdH1cblxuXHRcdGxldCBpbnB1dEJvZHkgPSBpbml0LmJvZHkgIT0gbnVsbCA/IGluaXQuYm9keSA6IGlzUmVxdWVzdChpbnB1dCkgJiYgaW5wdXQuYm9keSAhPT0gbnVsbCA/IGNsb25lKGlucHV0KSA6IG51bGw7XG5cblx0XHRCb2R5LmNhbGwodGhpcywgaW5wdXRCb2R5LCB7XG5cdFx0XHR0aW1lb3V0OiBpbml0LnRpbWVvdXQgfHwgaW5wdXQudGltZW91dCB8fCAwLFxuXHRcdFx0c2l6ZTogaW5pdC5zaXplIHx8IGlucHV0LnNpemUgfHwgMFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycyB8fCBpbnB1dC5oZWFkZXJzIHx8IHt9KTtcblxuXHRcdGlmIChpbnB1dEJvZHkgIT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKSB7XG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IGV4dHJhY3RDb250ZW50VHlwZShpbnB1dEJvZHkpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IHNpZ25hbCA9IGlzUmVxdWVzdChpbnB1dCkgPyBpbnB1dC5zaWduYWwgOiBudWxsO1xuXHRcdGlmICgnc2lnbmFsJyBpbiBpbml0KSBzaWduYWwgPSBpbml0LnNpZ25hbDtcblxuXHRcdGlmIChzaWduYWwgIT0gbnVsbCAmJiAhaXNBYm9ydFNpZ25hbChzaWduYWwpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBzaWduYWwgdG8gYmUgYW4gaW5zdGFuY2VvZiBBYm9ydFNpZ25hbCcpO1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTJDJdID0ge1xuXHRcdFx0bWV0aG9kLFxuXHRcdFx0cmVkaXJlY3Q6IGluaXQucmVkaXJlY3QgfHwgaW5wdXQucmVkaXJlY3QgfHwgJ2ZvbGxvdycsXG5cdFx0XHRoZWFkZXJzLFxuXHRcdFx0cGFyc2VkVVJMLFxuXHRcdFx0c2lnbmFsXG5cdFx0fTtcblxuXHRcdC8vIG5vZGUtZmV0Y2gtb25seSBvcHRpb25zXG5cdFx0dGhpcy5mb2xsb3cgPSBpbml0LmZvbGxvdyAhPT0gdW5kZWZpbmVkID8gaW5pdC5mb2xsb3cgOiBpbnB1dC5mb2xsb3cgIT09IHVuZGVmaW5lZCA/IGlucHV0LmZvbGxvdyA6IDIwO1xuXHRcdHRoaXMuY29tcHJlc3MgPSBpbml0LmNvbXByZXNzICE9PSB1bmRlZmluZWQgPyBpbml0LmNvbXByZXNzIDogaW5wdXQuY29tcHJlc3MgIT09IHVuZGVmaW5lZCA/IGlucHV0LmNvbXByZXNzIDogdHJ1ZTtcblx0XHR0aGlzLmNvdW50ZXIgPSBpbml0LmNvdW50ZXIgfHwgaW5wdXQuY291bnRlciB8fCAwO1xuXHRcdHRoaXMuYWdlbnQgPSBpbml0LmFnZW50IHx8IGlucHV0LmFnZW50O1xuXHR9XG5cblx0Z2V0IG1ldGhvZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMl0ubWV0aG9kO1xuXHR9XG5cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gZm9ybWF0X3VybCh0aGlzW0lOVEVSTkFMUyQyXS5wYXJzZWRVUkwpO1xuXHR9XG5cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLmhlYWRlcnM7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3QoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLnJlZGlyZWN0O1xuXHR9XG5cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFMkMl0uc2lnbmFsO1xuXHR9XG5cblx0LyoqXG4gICogQ2xvbmUgdGhpcyByZXF1ZXN0XG4gICpcbiAgKiBAcmV0dXJuICBSZXF1ZXN0XG4gICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVxdWVzdCh0aGlzKTtcblx0fVxufVxuXG5Cb2R5Lm1peEluKFJlcXVlc3QucHJvdG90eXBlKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlcXVlc3QucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcblx0dmFsdWU6ICdSZXF1ZXN0Jyxcblx0d3JpdGFibGU6IGZhbHNlLFxuXHRlbnVtZXJhYmxlOiBmYWxzZSxcblx0Y29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVxdWVzdC5wcm90b3R5cGUsIHtcblx0bWV0aG9kOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0dXJsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0aGVhZGVyczogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHJlZGlyZWN0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0Y2xvbmU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzaWduYWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0IGEgUmVxdWVzdCB0byBOb2RlLmpzIGh0dHAgcmVxdWVzdCBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSAgIFJlcXVlc3QgIEEgUmVxdWVzdCBpbnN0YW5jZVxuICogQHJldHVybiAgT2JqZWN0ICAgVGhlIG9wdGlvbnMgb2JqZWN0IHRvIGJlIHBhc3NlZCB0byBodHRwLnJlcXVlc3RcbiAqL1xuZnVuY3Rpb24gZ2V0Tm9kZVJlcXVlc3RPcHRpb25zKHJlcXVlc3QpIHtcblx0Y29uc3QgcGFyc2VkVVJMID0gcmVxdWVzdFtJTlRFUk5BTFMkMl0ucGFyc2VkVVJMO1xuXHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMocmVxdWVzdFtJTlRFUk5BTFMkMl0uaGVhZGVycyk7XG5cblx0Ly8gZmV0Y2ggc3RlcCAxLjNcblx0aWYgKCFoZWFkZXJzLmhhcygnQWNjZXB0JykpIHtcblx0XHRoZWFkZXJzLnNldCgnQWNjZXB0JywgJyovKicpO1xuXHR9XG5cblx0Ly8gQmFzaWMgZmV0Y2hcblx0aWYgKCFwYXJzZWRVUkwucHJvdG9jb2wgfHwgIXBhcnNlZFVSTC5ob3N0bmFtZSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09ubHkgYWJzb2x1dGUgVVJMcyBhcmUgc3VwcG9ydGVkJyk7XG5cdH1cblxuXHRpZiAoIS9eaHR0cHM/OiQvLnRlc3QocGFyc2VkVVJMLnByb3RvY29sKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09ubHkgSFRUUChTKSBwcm90b2NvbHMgYXJlIHN1cHBvcnRlZCcpO1xuXHR9XG5cblx0aWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3QuYm9keSBpbnN0YW5jZW9mIFN0cmVhbS5SZWFkYWJsZSAmJiAhc3RyZWFtRGVzdHJ1Y3Rpb25TdXBwb3J0ZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NhbmNlbGxhdGlvbiBvZiBzdHJlYW1lZCByZXF1ZXN0cyB3aXRoIEFib3J0U2lnbmFsIGlzIG5vdCBzdXBwb3J0ZWQgaW4gbm9kZSA8IDgnKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwcyAyLjQtMi43XG5cdGxldCBjb250ZW50TGVuZ3RoVmFsdWUgPSBudWxsO1xuXHRpZiAocmVxdWVzdC5ib2R5ID09IG51bGwgJiYgL14oUE9TVHxQVVQpJC9pLnRlc3QocmVxdWVzdC5tZXRob2QpKSB7XG5cdFx0Y29udGVudExlbmd0aFZhbHVlID0gJzAnO1xuXHR9XG5cdGlmIChyZXF1ZXN0LmJvZHkgIT0gbnVsbCkge1xuXHRcdGNvbnN0IHRvdGFsQnl0ZXMgPSBnZXRUb3RhbEJ5dGVzKHJlcXVlc3QpO1xuXHRcdGlmICh0eXBlb2YgdG90YWxCeXRlcyA9PT0gJ251bWJlcicpIHtcblx0XHRcdGNvbnRlbnRMZW5ndGhWYWx1ZSA9IFN0cmluZyh0b3RhbEJ5dGVzKTtcblx0XHR9XG5cdH1cblx0aWYgKGNvbnRlbnRMZW5ndGhWYWx1ZSkge1xuXHRcdGhlYWRlcnMuc2V0KCdDb250ZW50LUxlbmd0aCcsIGNvbnRlbnRMZW5ndGhWYWx1ZSk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcCAyLjExXG5cdGlmICghaGVhZGVycy5oYXMoJ1VzZXItQWdlbnQnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdVc2VyLUFnZW50JywgJ25vZGUtZmV0Y2gvMS4wICgraHR0cHM6Ly9naXRodWIuY29tL2JpdGlubi9ub2RlLWZldGNoKScpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xNVxuXHRpZiAocmVxdWVzdC5jb21wcmVzcyAmJiAhaGVhZGVycy5oYXMoJ0FjY2VwdC1FbmNvZGluZycpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdC1FbmNvZGluZycsICdnemlwLGRlZmxhdGUnKTtcblx0fVxuXG5cdGxldCBhZ2VudCA9IHJlcXVlc3QuYWdlbnQ7XG5cdGlmICh0eXBlb2YgYWdlbnQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRhZ2VudCA9IGFnZW50KHBhcnNlZFVSTCk7XG5cdH1cblxuXHRpZiAoIWhlYWRlcnMuaGFzKCdDb25uZWN0aW9uJykgJiYgIWFnZW50KSB7XG5cdFx0aGVhZGVycy5zZXQoJ0Nvbm5lY3Rpb24nLCAnY2xvc2UnKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDQuMlxuXHQvLyBjaHVua2VkIGVuY29kaW5nIGlzIGhhbmRsZWQgYnkgTm9kZS5qc1xuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwYXJzZWRVUkwsIHtcblx0XHRtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuXHRcdGhlYWRlcnM6IGV4cG9ydE5vZGVDb21wYXRpYmxlSGVhZGVycyhoZWFkZXJzKSxcblx0XHRhZ2VudFxuXHR9KTtcbn1cblxuLyoqXG4gKiBhYm9ydC1lcnJvci5qc1xuICpcbiAqIEFib3J0RXJyb3IgaW50ZXJmYWNlIGZvciBjYW5jZWxsZWQgcmVxdWVzdHNcbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBBYm9ydEVycm9yIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICAgICAgbWVzc2FnZSAgICAgIEVycm9yIG1lc3NhZ2UgZm9yIGh1bWFuXG4gKiBAcmV0dXJuICBBYm9ydEVycm9yXG4gKi9cbmZ1bmN0aW9uIEFib3J0RXJyb3IobWVzc2FnZSkge1xuICBFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIHRoaXMudHlwZSA9ICdhYm9ydGVkJztcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblxuICAvLyBoaWRlIGN1c3RvbSBlcnJvciBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGZyb20gZW5kLXVzZXJzXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xufVxuXG5BYm9ydEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkFib3J0RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQWJvcnRFcnJvcjtcbkFib3J0RXJyb3IucHJvdG90eXBlLm5hbWUgPSAnQWJvcnRFcnJvcic7XG5cbi8vIGZpeCBhbiBpc3N1ZSB3aGVyZSBcIlBhc3NUaHJvdWdoXCIsIFwicmVzb2x2ZVwiIGFyZW4ndCBhIG5hbWVkIGV4cG9ydCBmb3Igbm9kZSA8MTBcbmNvbnN0IFBhc3NUaHJvdWdoJDEgPSBTdHJlYW0uUGFzc1Rocm91Z2g7XG5jb25zdCByZXNvbHZlX3VybCA9IFVybC5yZXNvbHZlO1xuXG4vKipcbiAqIEZldGNoIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICAgdXJsICAgQWJzb2x1dGUgdXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgIG9wdHMgIEZldGNoIG9wdGlvbnNcbiAqIEByZXR1cm4gIFByb21pc2VcbiAqL1xuZnVuY3Rpb24gZmV0Y2godXJsLCBvcHRzKSB7XG5cblx0Ly8gYWxsb3cgY3VzdG9tIHByb21pc2Vcblx0aWYgKCFmZXRjaC5Qcm9taXNlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCduYXRpdmUgcHJvbWlzZSBtaXNzaW5nLCBzZXQgZmV0Y2guUHJvbWlzZSB0byB5b3VyIGZhdm9yaXRlIGFsdGVybmF0aXZlJyk7XG5cdH1cblxuXHRCb2R5LlByb21pc2UgPSBmZXRjaC5Qcm9taXNlO1xuXG5cdC8vIHdyYXAgaHR0cC5yZXF1ZXN0IGludG8gZmV0Y2hcblx0cmV0dXJuIG5ldyBmZXRjaC5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHQvLyBidWlsZCByZXF1ZXN0IG9iamVjdFxuXHRcdGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIG9wdHMpO1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBnZXROb2RlUmVxdWVzdE9wdGlvbnMocmVxdWVzdCk7XG5cblx0XHRjb25zdCBzZW5kID0gKG9wdGlvbnMucHJvdG9jb2wgPT09ICdodHRwczonID8gaHR0cHMgOiBodHRwKS5yZXF1ZXN0O1xuXHRcdGNvbnN0IHNpZ25hbCA9IHJlcXVlc3Quc2lnbmFsO1xuXG5cdFx0bGV0IHJlc3BvbnNlID0gbnVsbDtcblxuXHRcdGNvbnN0IGFib3J0ID0gZnVuY3Rpb24gYWJvcnQoKSB7XG5cdFx0XHRsZXQgZXJyb3IgPSBuZXcgQWJvcnRFcnJvcignVGhlIHVzZXIgYWJvcnRlZCBhIHJlcXVlc3QuJyk7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0aWYgKHJlcXVlc3QuYm9keSAmJiByZXF1ZXN0LmJvZHkgaW5zdGFuY2VvZiBTdHJlYW0uUmVhZGFibGUpIHtcblx0XHRcdFx0cmVxdWVzdC5ib2R5LmRlc3Ryb3koZXJyb3IpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuYm9keSkgcmV0dXJuO1xuXHRcdFx0cmVzcG9uc2UuYm9keS5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0XHR9O1xuXG5cdFx0aWYgKHNpZ25hbCAmJiBzaWduYWwuYWJvcnRlZCkge1xuXHRcdFx0YWJvcnQoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBhYm9ydEFuZEZpbmFsaXplID0gZnVuY3Rpb24gYWJvcnRBbmRGaW5hbGl6ZSgpIHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH07XG5cblx0XHQvLyBzZW5kIHJlcXVlc3Rcblx0XHRjb25zdCByZXEgPSBzZW5kKG9wdGlvbnMpO1xuXHRcdGxldCByZXFUaW1lb3V0O1xuXG5cdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0c2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmluYWxpemUoKSB7XG5cdFx0XHRyZXEuYWJvcnQoKTtcblx0XHRcdGlmIChzaWduYWwpIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXHRcdH1cblxuXHRcdGlmIChyZXF1ZXN0LnRpbWVvdXQpIHtcblx0XHRcdHJlcS5vbmNlKCdzb2NrZXQnLCBmdW5jdGlvbiAoc29ja2V0KSB7XG5cdFx0XHRcdHJlcVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYG5ldHdvcmsgdGltZW91dCBhdDogJHtyZXF1ZXN0LnVybH1gLCAncmVxdWVzdC10aW1lb3V0JykpO1xuXHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdH0sIHJlcXVlc3QudGltZW91dCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXEub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGByZXF1ZXN0IHRvICR7cmVxdWVzdC51cmx9IGZhaWxlZCwgcmVhc29uOiAke2Vyci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnIpKTtcblx0XHRcdGZpbmFsaXplKCk7XG5cdFx0fSk7XG5cblx0XHRyZXEub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXG5cdFx0XHRjb25zdCBoZWFkZXJzID0gY3JlYXRlSGVhZGVyc0xlbmllbnQocmVzLmhlYWRlcnMpO1xuXG5cdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNVxuXHRcdFx0aWYgKGZldGNoLmlzUmVkaXJlY3QocmVzLnN0YXR1c0NvZGUpKSB7XG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjJcblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSBoZWFkZXJzLmdldCgnTG9jYXRpb24nKTtcblxuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS4zXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uVVJMID0gbG9jYXRpb24gPT09IG51bGwgPyBudWxsIDogcmVzb2x2ZV91cmwocmVxdWVzdC51cmwsIGxvY2F0aW9uKTtcblxuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS41XG5cdFx0XHRcdHN3aXRjaCAocmVxdWVzdC5yZWRpcmVjdCkge1xuXHRcdFx0XHRcdGNhc2UgJ2Vycm9yJzpcblx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgcmVkaXJlY3QgbW9kZSBpcyBzZXQgdG8gZXJyb3I6ICR7cmVxdWVzdC51cmx9YCwgJ25vLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRjYXNlICdtYW51YWwnOlxuXHRcdFx0XHRcdFx0Ly8gbm9kZS1mZXRjaC1zcGVjaWZpYyBzdGVwOiBtYWtlIG1hbnVhbCByZWRpcmVjdCBhIGJpdCBlYXNpZXIgdG8gdXNlIGJ5IHNldHRpbmcgdGhlIExvY2F0aW9uIGhlYWRlciB2YWx1ZSB0byB0aGUgcmVzb2x2ZWQgVVJMLlxuXHRcdFx0XHRcdFx0aWYgKGxvY2F0aW9uVVJMICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdC8vIGhhbmRsZSBjb3JydXB0ZWQgaGVhZGVyXG5cdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0aGVhZGVycy5zZXQoJ0xvY2F0aW9uJywgbG9jYXRpb25VUkwpO1xuXHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogbm9kZWpzIHNlcnZlciBwcmV2ZW50IGludmFsaWQgcmVzcG9uc2UgaGVhZGVycywgd2UgY2FuJ3QgdGVzdCB0aGlzIHRocm91Z2ggbm9ybWFsIHJlcXVlc3Rcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnZm9sbG93Jzpcblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAyXG5cdFx0XHRcdFx0XHRpZiAobG9jYXRpb25VUkwgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA1XG5cdFx0XHRcdFx0XHRpZiAocmVxdWVzdC5jb3VudGVyID49IHJlcXVlc3QuZm9sbG93KSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgbWF4aW11bSByZWRpcmVjdCByZWFjaGVkIGF0OiAke3JlcXVlc3QudXJsfWAsICdtYXgtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDYgKGNvdW50ZXIgaW5jcmVtZW50KVxuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGEgbmV3IFJlcXVlc3Qgb2JqZWN0LlxuXHRcdFx0XHRcdFx0Y29uc3QgcmVxdWVzdE9wdHMgPSB7XG5cdFx0XHRcdFx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHJlcXVlc3QuaGVhZGVycyksXG5cdFx0XHRcdFx0XHRcdGZvbGxvdzogcmVxdWVzdC5mb2xsb3csXG5cdFx0XHRcdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlciArIDEsXG5cdFx0XHRcdFx0XHRcdGFnZW50OiByZXF1ZXN0LmFnZW50LFxuXHRcdFx0XHRcdFx0XHRjb21wcmVzczogcmVxdWVzdC5jb21wcmVzcyxcblx0XHRcdFx0XHRcdFx0bWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcblx0XHRcdFx0XHRcdFx0Ym9keTogcmVxdWVzdC5ib2R5LFxuXHRcdFx0XHRcdFx0XHRzaWduYWw6IHJlcXVlc3Quc2lnbmFsLFxuXHRcdFx0XHRcdFx0XHR0aW1lb3V0OiByZXF1ZXN0LnRpbWVvdXRcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA5XG5cdFx0XHRcdFx0XHRpZiAocmVzLnN0YXR1c0NvZGUgIT09IDMwMyAmJiByZXF1ZXN0LmJvZHkgJiYgZ2V0VG90YWxCeXRlcyhyZXF1ZXN0KSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ0Nhbm5vdCBmb2xsb3cgcmVkaXJlY3Qgd2l0aCBib2R5IGJlaW5nIGEgcmVhZGFibGUgc3RyZWFtJywgJ3Vuc3VwcG9ydGVkLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxMVxuXHRcdFx0XHRcdFx0aWYgKHJlcy5zdGF0dXNDb2RlID09PSAzMDMgfHwgKHJlcy5zdGF0dXNDb2RlID09PSAzMDEgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDMwMikgJiYgcmVxdWVzdC5tZXRob2QgPT09ICdQT1NUJykge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0cy5tZXRob2QgPSAnR0VUJztcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdHMuYm9keSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdHMuaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtbGVuZ3RoJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxNVxuXHRcdFx0XHRcdFx0cmVzb2x2ZShmZXRjaChuZXcgUmVxdWVzdChsb2NhdGlvblVSTCwgcmVxdWVzdE9wdHMpKSk7XG5cdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHByZXBhcmUgcmVzcG9uc2Vcblx0XHRcdHJlcy5vbmNlKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmIChzaWduYWwpIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0fSk7XG5cdFx0XHRsZXQgYm9keSA9IHJlcy5waXBlKG5ldyBQYXNzVGhyb3VnaCQxKCkpO1xuXG5cdFx0XHRjb25zdCByZXNwb25zZV9vcHRpb25zID0ge1xuXHRcdFx0XHR1cmw6IHJlcXVlc3QudXJsLFxuXHRcdFx0XHRzdGF0dXM6IHJlcy5zdGF0dXNDb2RlLFxuXHRcdFx0XHRzdGF0dXNUZXh0OiByZXMuc3RhdHVzTWVzc2FnZSxcblx0XHRcdFx0aGVhZGVyczogaGVhZGVycyxcblx0XHRcdFx0c2l6ZTogcmVxdWVzdC5zaXplLFxuXHRcdFx0XHR0aW1lb3V0OiByZXF1ZXN0LnRpbWVvdXQsXG5cdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlclxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgMTIuMS4xLjNcblx0XHRcdGNvbnN0IGNvZGluZ3MgPSBoZWFkZXJzLmdldCgnQ29udGVudC1FbmNvZGluZycpO1xuXG5cdFx0XHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCAxMi4xLjEuNDogaGFuZGxlIGNvbnRlbnQgY29kaW5nc1xuXG5cdFx0XHQvLyBpbiBmb2xsb3dpbmcgc2NlbmFyaW9zIHdlIGlnbm9yZSBjb21wcmVzc2lvbiBzdXBwb3J0XG5cdFx0XHQvLyAxLiBjb21wcmVzc2lvbiBzdXBwb3J0IGlzIGRpc2FibGVkXG5cdFx0XHQvLyAyLiBIRUFEIHJlcXVlc3Rcblx0XHRcdC8vIDMuIG5vIENvbnRlbnQtRW5jb2RpbmcgaGVhZGVyXG5cdFx0XHQvLyA0LiBubyBjb250ZW50IHJlc3BvbnNlICgyMDQpXG5cdFx0XHQvLyA1LiBjb250ZW50IG5vdCBtb2RpZmllZCByZXNwb25zZSAoMzA0KVxuXHRcdFx0aWYgKCFyZXF1ZXN0LmNvbXByZXNzIHx8IHJlcXVlc3QubWV0aG9kID09PSAnSEVBRCcgfHwgY29kaW5ncyA9PT0gbnVsbCB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMjA0IHx8IHJlcy5zdGF0dXNDb2RlID09PSAzMDQpIHtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBOb2RlIHY2K1xuXHRcdFx0Ly8gQmUgbGVzcyBzdHJpY3Qgd2hlbiBkZWNvZGluZyBjb21wcmVzc2VkIHJlc3BvbnNlcywgc2luY2Ugc29tZXRpbWVzXG5cdFx0XHQvLyBzZXJ2ZXJzIHNlbmQgc2xpZ2h0bHkgaW52YWxpZCByZXNwb25zZXMgdGhhdCBhcmUgc3RpbGwgYWNjZXB0ZWRcblx0XHRcdC8vIGJ5IGNvbW1vbiBicm93c2Vycy5cblx0XHRcdC8vIEFsd2F5cyB1c2luZyBaX1NZTkNfRkxVU0ggaXMgd2hhdCBjVVJMIGRvZXMuXG5cdFx0XHRjb25zdCB6bGliT3B0aW9ucyA9IHtcblx0XHRcdFx0Zmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNILFxuXHRcdFx0XHRmaW5pc2hGbHVzaDogemxpYi5aX1NZTkNfRkxVU0hcblx0XHRcdH07XG5cblx0XHRcdC8vIGZvciBnemlwXG5cdFx0XHRpZiAoY29kaW5ncyA9PSAnZ3ppcCcgfHwgY29kaW5ncyA9PSAneC1nemlwJykge1xuXHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlR3VuemlwKHpsaWJPcHRpb25zKSk7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmb3IgZGVmbGF0ZVxuXHRcdFx0aWYgKGNvZGluZ3MgPT0gJ2RlZmxhdGUnIHx8IGNvZGluZ3MgPT0gJ3gtZGVmbGF0ZScpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIHRoZSBpbmZhbW91cyByYXcgZGVmbGF0ZSByZXNwb25zZSBmcm9tIG9sZCBzZXJ2ZXJzXG5cdFx0XHRcdC8vIGEgaGFjayBmb3Igb2xkIElJUyBhbmQgQXBhY2hlIHNlcnZlcnNcblx0XHRcdFx0Y29uc3QgcmF3ID0gcmVzLnBpcGUobmV3IFBhc3NUaHJvdWdoJDEoKSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdkYXRhJywgZnVuY3Rpb24gKGNodW5rKSB7XG5cdFx0XHRcdFx0Ly8gc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzc1MTk4Mjhcblx0XHRcdFx0XHRpZiAoKGNodW5rWzBdICYgMHgwRikgPT09IDB4MDgpIHtcblx0XHRcdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVJbmZsYXRlKCkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlSW5mbGF0ZVJhdygpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZvciBiclxuXHRcdFx0aWYgKGNvZGluZ3MgPT0gJ2JyJyAmJiB0eXBlb2YgemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzKCkpO1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3RoZXJ3aXNlLCB1c2UgcmVzcG9uc2UgYXMtaXNcblx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSk7XG5cblx0XHR3cml0ZVRvU3RyZWFtKHJlcSwgcmVxdWVzdCk7XG5cdH0pO1xufVxuLyoqXG4gKiBSZWRpcmVjdCBjb2RlIG1hdGNoaW5nXG4gKlxuICogQHBhcmFtICAgTnVtYmVyICAgY29kZSAgU3RhdHVzIGNvZGVcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuZmV0Y2guaXNSZWRpcmVjdCA9IGZ1bmN0aW9uIChjb2RlKSB7XG5cdHJldHVybiBjb2RlID09PSAzMDEgfHwgY29kZSA9PT0gMzAyIHx8IGNvZGUgPT09IDMwMyB8fCBjb2RlID09PSAzMDcgfHwgY29kZSA9PT0gMzA4O1xufTtcblxuLy8gZXhwb3NlIFByb21pc2VcbmZldGNoLlByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcblxuZnVuY3Rpb24gZ2V0X3BhZ2VfaGFuZGxlcihcblx0bWFuaWZlc3QsXG5cdHNlc3Npb25fZ2V0dGVyXG4pIHtcblx0Y29uc3QgZ2V0X2J1aWxkX2luZm8gPSBkZXZcblx0XHQ/ICgpID0+IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihidWlsZF9kaXIsICdidWlsZC5qc29uJyksICd1dGYtOCcpKVxuXHRcdDogKGFzc2V0cyA9PiAoKSA9PiBhc3NldHMpKEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihidWlsZF9kaXIsICdidWlsZC5qc29uJyksICd1dGYtOCcpKSk7XG5cblx0Y29uc3QgdGVtcGxhdGUgPSBkZXZcblx0XHQ/ICgpID0+IHJlYWRfdGVtcGxhdGUoc3JjX2Rpcilcblx0XHQ6IChzdHIgPT4gKCkgPT4gc3RyKShyZWFkX3RlbXBsYXRlKGJ1aWxkX2RpcikpO1xuXG5cdGNvbnN0IGhhc19zZXJ2aWNlX3dvcmtlciA9IGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGJ1aWxkX2RpciwgJ3NlcnZpY2Utd29ya2VyLmpzJykpO1xuXG5cdGNvbnN0IHsgc2VydmVyX3JvdXRlcywgcGFnZXMgfSA9IG1hbmlmZXN0O1xuXHRjb25zdCBlcnJvcl9yb3V0ZSA9IG1hbmlmZXN0LmVycm9yO1xuXG5cdGZ1bmN0aW9uIGJhaWwocmVxLCByZXMsIGVycikge1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblxuXHRcdGNvbnN0IG1lc3NhZ2UgPSBkZXYgPyBlc2NhcGVfaHRtbChlcnIubWVzc2FnZSkgOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJztcblxuXHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuXHRcdHJlcy5lbmQoYDxwcmU+JHttZXNzYWdlfTwvcHJlPmApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlX2Vycm9yKHJlcSwgcmVzLCBzdGF0dXNDb2RlLCBlcnJvcikge1xuXHRcdGhhbmRsZV9wYWdlKHtcblx0XHRcdHBhdHRlcm46IG51bGwsXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IG51bGwsIGNvbXBvbmVudDogZXJyb3Jfcm91dGUgfVxuXHRcdFx0XVxuXHRcdH0sIHJlcSwgcmVzLCBzdGF0dXNDb2RlLCBlcnJvciB8fCBuZXcgRXJyb3IoJ1Vua25vd24gZXJyb3IgaW4gcHJlbG9hZCBmdW5jdGlvbicpKTtcblx0fVxuXG5cdGFzeW5jIGZ1bmN0aW9uIGhhbmRsZV9wYWdlKHBhZ2UsIHJlcSwgcmVzLCBzdGF0dXMgPSAyMDAsIGVycm9yID0gbnVsbCkge1xuXHRcdGNvbnN0IGlzX3NlcnZpY2Vfd29ya2VyX2luZGV4ID0gcmVxLnBhdGggPT09ICcvc2VydmljZS13b3JrZXItaW5kZXguaHRtbCc7XG5cdFx0Y29uc3QgYnVpbGRfaW5mb1xuXG5cblxuXG4gPSBnZXRfYnVpbGRfaW5mbygpO1xuXG5cdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpO1xuXHRcdHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCBkZXYgPyAnbm8tY2FjaGUnIDogJ21heC1hZ2U9NjAwJyk7XG5cblx0XHQvLyBwcmVsb2FkIG1haW4uanMgYW5kIGN1cnJlbnQgcm91dGVcblx0XHQvLyBUT0RPIGRldGVjdCBvdGhlciBzdHVmZiB3ZSBjYW4gcHJlbG9hZD8gaW1hZ2VzLCBDU1MsIGZvbnRzP1xuXHRcdGxldCBwcmVsb2FkZWRfY2h1bmtzID0gQXJyYXkuaXNBcnJheShidWlsZF9pbmZvLmFzc2V0cy5tYWluKSA/IGJ1aWxkX2luZm8uYXNzZXRzLm1haW4gOiBbYnVpbGRfaW5mby5hc3NldHMubWFpbl07XG5cdFx0aWYgKCFlcnJvciAmJiAhaXNfc2VydmljZV93b3JrZXJfaW5kZXgpIHtcblx0XHRcdHBhZ2UucGFydHMuZm9yRWFjaChwYXJ0ID0+IHtcblx0XHRcdFx0aWYgKCFwYXJ0KSByZXR1cm47XG5cblx0XHRcdFx0Ly8gdXNpbmcgY29uY2F0IGJlY2F1c2UgaXQgY291bGQgYmUgYSBzdHJpbmcgb3IgYW4gYXJyYXkuIHRoYW5rcyB3ZWJwYWNrIVxuXHRcdFx0XHRwcmVsb2FkZWRfY2h1bmtzID0gcHJlbG9hZGVkX2NodW5rcy5jb25jYXQoYnVpbGRfaW5mby5hc3NldHNbcGFydC5uYW1lXSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAoYnVpbGRfaW5mby5idW5kbGVyID09PSAncm9sbHVwJykge1xuXHRcdFx0Ly8gVE9ETyBhZGQgZGVwZW5kZW5jaWVzIGFuZCBDU1Ncblx0XHRcdGNvbnN0IGxpbmsgPSBwcmVsb2FkZWRfY2h1bmtzXG5cdFx0XHRcdC5maWx0ZXIoZmlsZSA9PiBmaWxlICYmICFmaWxlLm1hdGNoKC9cXC5tYXAkLykpXG5cdFx0XHRcdC5tYXAoZmlsZSA9PiBgPCR7cmVxLmJhc2VVcmx9L2NsaWVudC8ke2ZpbGV9PjtyZWw9XCJtb2R1bGVwcmVsb2FkXCJgKVxuXHRcdFx0XHQuam9pbignLCAnKTtcblxuXHRcdFx0cmVzLnNldEhlYWRlcignTGluaycsIGxpbmspO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBsaW5rID0gcHJlbG9hZGVkX2NodW5rc1xuXHRcdFx0XHQuZmlsdGVyKGZpbGUgPT4gZmlsZSAmJiAhZmlsZS5tYXRjaCgvXFwubWFwJC8pKVxuXHRcdFx0XHQubWFwKChmaWxlKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgYXMgPSAvXFwuY3NzJC8udGVzdChmaWxlKSA/ICdzdHlsZScgOiAnc2NyaXB0Jztcblx0XHRcdFx0XHRyZXR1cm4gYDwke3JlcS5iYXNlVXJsfS9jbGllbnQvJHtmaWxlfT47cmVsPVwicHJlbG9hZFwiO2FzPVwiJHthc31cImA7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5qb2luKCcsICcpO1xuXG5cdFx0XHRyZXMuc2V0SGVhZGVyKCdMaW5rJywgbGluayk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IHNlc3Npb25fZ2V0dGVyKHJlcSwgcmVzKTtcblxuXHRcdGxldCByZWRpcmVjdDtcblx0XHRsZXQgcHJlbG9hZF9lcnJvcjtcblxuXHRcdGNvbnN0IHByZWxvYWRfY29udGV4dCA9IHtcblx0XHRcdHJlZGlyZWN0OiAoc3RhdHVzQ29kZSwgbG9jYXRpb24pID0+IHtcblx0XHRcdFx0aWYgKHJlZGlyZWN0ICYmIChyZWRpcmVjdC5zdGF0dXNDb2RlICE9PSBzdGF0dXNDb2RlIHx8IHJlZGlyZWN0LmxvY2F0aW9uICE9PSBsb2NhdGlvbikpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbmZsaWN0aW5nIHJlZGlyZWN0c2ApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxvY2F0aW9uID0gbG9jYXRpb24ucmVwbGFjZSgvXlxcLy9nLCAnJyk7IC8vIGxlYWRpbmcgc2xhc2ggKG9ubHkpXG5cdFx0XHRcdHJlZGlyZWN0ID0geyBzdGF0dXNDb2RlLCBsb2NhdGlvbiB9O1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiAoc3RhdHVzQ29kZSwgbWVzc2FnZSkgPT4ge1xuXHRcdFx0XHRwcmVsb2FkX2Vycm9yID0geyBzdGF0dXNDb2RlLCBtZXNzYWdlIH07XG5cdFx0XHR9LFxuXHRcdFx0ZmV0Y2g6ICh1cmwsIG9wdHMpID0+IHtcblx0XHRcdFx0Y29uc3QgcGFyc2VkID0gbmV3IFVybC5VUkwodXJsLCBgaHR0cDovLzEyNy4wLjAuMToke3Byb2Nlc3MuZW52LlBPUlR9JHtyZXEuYmFzZVVybCA/IHJlcS5iYXNlVXJsICsgJy8nIDonJ31gKTtcblxuXHRcdFx0XHRpZiAob3B0cykge1xuXHRcdFx0XHRcdG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzKTtcblxuXHRcdFx0XHRcdGNvbnN0IGluY2x1ZGVfY29va2llcyA9IChcblx0XHRcdFx0XHRcdG9wdHMuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJyB8fFxuXHRcdFx0XHRcdFx0b3B0cy5jcmVkZW50aWFscyA9PT0gJ3NhbWUtb3JpZ2luJyAmJiBwYXJzZWQub3JpZ2luID09PSBgaHR0cDovLzEyNy4wLjAuMToke3Byb2Nlc3MuZW52LlBPUlR9YFxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRpZiAoaW5jbHVkZV9jb29raWVzKSB7XG5cdFx0XHRcdFx0XHRvcHRzLmhlYWRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRzLmhlYWRlcnMpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBjb29raWVzID0gT2JqZWN0LmFzc2lnbihcblx0XHRcdFx0XHRcdFx0e30sXG5cdFx0XHRcdFx0XHRcdGNvb2tpZS5wYXJzZShyZXEuaGVhZGVycy5jb29raWUgfHwgJycpLFxuXHRcdFx0XHRcdFx0XHRjb29raWUucGFyc2Uob3B0cy5oZWFkZXJzLmNvb2tpZSB8fCAnJylcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IHNldF9jb29raWUgPSByZXMuZ2V0SGVhZGVyKCdTZXQtQ29va2llJyk7XG5cdFx0XHRcdFx0XHQoQXJyYXkuaXNBcnJheShzZXRfY29va2llKSA/IHNldF9jb29raWUgOiBbc2V0X2Nvb2tpZV0pLmZvckVhY2goc3RyID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbWF0Y2ggPSAvKFtePV0rKT0oW147XSspLy5leGVjKHN0cik7XG5cdFx0XHRcdFx0XHRcdGlmIChtYXRjaCkgY29va2llc1ttYXRjaFsxXV0gPSBtYXRjaFsyXTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBzdHIgPSBPYmplY3Qua2V5cyhjb29raWVzKVxuXHRcdFx0XHRcdFx0XHQubWFwKGtleSA9PiBgJHtrZXl9PSR7Y29va2llc1trZXldfWApXG5cdFx0XHRcdFx0XHRcdC5qb2luKCc7ICcpO1xuXG5cdFx0XHRcdFx0XHRvcHRzLmhlYWRlcnMuY29va2llID0gc3RyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmZXRjaChwYXJzZWQuaHJlZiwgb3B0cyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCBwcmVsb2FkZWQ7XG5cdFx0bGV0IG1hdGNoO1xuXHRcdGxldCBwYXJhbXM7XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgcm9vdF9wcmVsb2FkZWQgPSBtYW5pZmVzdC5yb290X3ByZWxvYWRcblx0XHRcdFx0PyBtYW5pZmVzdC5yb290X3ByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdFx0XHRob3N0OiByZXEuaGVhZGVycy5ob3N0LFxuXHRcdFx0XHRcdHBhdGg6IHJlcS5wYXRoLFxuXHRcdFx0XHRcdHF1ZXJ5OiByZXEucXVlcnksXG5cdFx0XHRcdFx0cGFyYW1zOiB7fVxuXHRcdFx0XHR9LCBzZXNzaW9uKVxuXHRcdFx0XHQ6IHt9O1xuXG5cdFx0XHRtYXRjaCA9IGVycm9yID8gbnVsbCA6IHBhZ2UucGF0dGVybi5leGVjKHJlcS5wYXRoKTtcblxuXG5cdFx0XHRsZXQgdG9QcmVsb2FkID0gW3Jvb3RfcHJlbG9hZGVkXTtcblx0XHRcdGlmICghaXNfc2VydmljZV93b3JrZXJfaW5kZXgpIHtcblx0XHRcdFx0dG9QcmVsb2FkID0gdG9QcmVsb2FkLmNvbmNhdChwYWdlLnBhcnRzLm1hcChwYXJ0ID0+IHtcblx0XHRcdFx0XHRpZiAoIXBhcnQpIHJldHVybiBudWxsO1xuXG5cdFx0XHRcdFx0Ly8gdGhlIGRlZXBlc3QgbGV2ZWwgaXMgdXNlZCBiZWxvdywgdG8gaW5pdGlhbGlzZSB0aGUgc3RvcmVcblx0XHRcdFx0XHRwYXJhbXMgPSBwYXJ0LnBhcmFtcyA/IHBhcnQucGFyYW1zKG1hdGNoKSA6IHt9O1xuXG5cdFx0XHRcdFx0cmV0dXJuIHBhcnQucHJlbG9hZFxuXHRcdFx0XHRcdFx0PyBwYXJ0LnByZWxvYWQuY2FsbChwcmVsb2FkX2NvbnRleHQsIHtcblx0XHRcdFx0XHRcdFx0aG9zdDogcmVxLmhlYWRlcnMuaG9zdCxcblx0XHRcdFx0XHRcdFx0cGF0aDogcmVxLnBhdGgsXG5cdFx0XHRcdFx0XHRcdHF1ZXJ5OiByZXEucXVlcnksXG5cdFx0XHRcdFx0XHRcdHBhcmFtc1xuXHRcdFx0XHRcdFx0fSwgc2Vzc2lvbilcblx0XHRcdFx0XHRcdDoge307XG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblxuXHRcdFx0cHJlbG9hZGVkID0gYXdhaXQgUHJvbWlzZS5hbGwodG9QcmVsb2FkKTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRyZXR1cm4gYmFpbChyZXEsIHJlcywgZXJyKVxuXHRcdFx0fVxuXG5cdFx0XHRwcmVsb2FkX2Vycm9yID0geyBzdGF0dXNDb2RlOiA1MDAsIG1lc3NhZ2U6IGVyciB9O1xuXHRcdFx0cHJlbG9hZGVkID0gW107IC8vIGFwcGVhc2UgVHlwZVNjcmlwdFxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAocmVkaXJlY3QpIHtcblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSBVcmwucmVzb2x2ZSgocmVxLmJhc2VVcmwgfHwgJycpICsgJy8nLCByZWRpcmVjdC5sb2NhdGlvbik7XG5cblx0XHRcdFx0cmVzLnN0YXR1c0NvZGUgPSByZWRpcmVjdC5zdGF0dXNDb2RlO1xuXHRcdFx0XHRyZXMuc2V0SGVhZGVyKCdMb2NhdGlvbicsIGxvY2F0aW9uKTtcblx0XHRcdFx0cmVzLmVuZCgpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHByZWxvYWRfZXJyb3IpIHtcblx0XHRcdFx0aGFuZGxlX2Vycm9yKHJlcSwgcmVzLCBwcmVsb2FkX2Vycm9yLnN0YXR1c0NvZGUsIHByZWxvYWRfZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VnbWVudHMgPSByZXEucGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcblxuXHRcdFx0Ly8gVE9ETyBtYWtlIHRoaXMgbGVzcyBjb25mdXNpbmdcblx0XHRcdGNvbnN0IGxheW91dF9zZWdtZW50cyA9IFtzZWdtZW50c1swXV07XG5cdFx0XHRsZXQgbCA9IDE7XG5cblx0XHRcdHBhZ2UucGFydHMuZm9yRWFjaCgocGFydCwgaSkgPT4ge1xuXHRcdFx0XHRsYXlvdXRfc2VnbWVudHNbbF0gPSBzZWdtZW50c1tpICsgMV07XG5cdFx0XHRcdGlmICghcGFydCkgcmV0dXJuIG51bGw7XG5cdFx0XHRcdGwrKztcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zdCBwcm9wcyA9IHtcblx0XHRcdFx0c3RvcmVzOiB7XG5cdFx0XHRcdFx0cGFnZToge1xuXHRcdFx0XHRcdFx0c3Vic2NyaWJlOiB3cml0YWJsZSh7XG5cdFx0XHRcdFx0XHRcdGhvc3Q6IHJlcS5oZWFkZXJzLmhvc3QsXG5cdFx0XHRcdFx0XHRcdHBhdGg6IHJlcS5wYXRoLFxuXHRcdFx0XHRcdFx0XHRxdWVyeTogcmVxLnF1ZXJ5LFxuXHRcdFx0XHRcdFx0XHRwYXJhbXNcblx0XHRcdFx0XHRcdH0pLnN1YnNjcmliZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cHJlbG9hZGluZzoge1xuXHRcdFx0XHRcdFx0c3Vic2NyaWJlOiB3cml0YWJsZShudWxsKS5zdWJzY3JpYmVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHNlc3Npb246IHdyaXRhYmxlKHNlc3Npb24pXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNlZ21lbnRzOiBsYXlvdXRfc2VnbWVudHMsXG5cdFx0XHRcdHN0YXR1czogZXJyb3IgPyBzdGF0dXMgOiAyMDAsXG5cdFx0XHRcdGVycm9yOiBlcnJvciA/IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvciA6IHsgbWVzc2FnZTogZXJyb3IgfSA6IG51bGwsXG5cdFx0XHRcdGxldmVsMDoge1xuXHRcdFx0XHRcdHByb3BzOiBwcmVsb2FkZWRbMF1cblx0XHRcdFx0fSxcblx0XHRcdFx0bGV2ZWwxOiB7XG5cdFx0XHRcdFx0c2VnbWVudDogc2VnbWVudHNbMF0sXG5cdFx0XHRcdFx0cHJvcHM6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGlmICghaXNfc2VydmljZV93b3JrZXJfaW5kZXgpIHtcblx0XHRcdFx0bGV0IGwgPSAxO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2UucGFydHMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdFx0XHRjb25zdCBwYXJ0ID0gcGFnZS5wYXJ0c1tpXTtcblx0XHRcdFx0XHRpZiAoIXBhcnQpIGNvbnRpbnVlO1xuXG5cdFx0XHRcdFx0cHJvcHNbYGxldmVsJHtsKyt9YF0gPSB7XG5cdFx0XHRcdFx0XHRjb21wb25lbnQ6IHBhcnQuY29tcG9uZW50LFxuXHRcdFx0XHRcdFx0cHJvcHM6IHByZWxvYWRlZFtpICsgMV0gfHwge30sXG5cdFx0XHRcdFx0XHRzZWdtZW50OiBzZWdtZW50c1tpXVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgeyBodG1sLCBoZWFkLCBjc3MgfSA9IEFwcC5yZW5kZXIocHJvcHMpO1xuXG5cdFx0XHRjb25zdCBzZXJpYWxpemVkID0ge1xuXHRcdFx0XHRwcmVsb2FkZWQ6IGBbJHtwcmVsb2FkZWQubWFwKGRhdGEgPT4gdHJ5X3NlcmlhbGl6ZShkYXRhKSkuam9pbignLCcpfV1gLFxuXHRcdFx0XHRzZXNzaW9uOiBzZXNzaW9uICYmIHRyeV9zZXJpYWxpemUoc2Vzc2lvbiwgZXJyID0+IHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzZXJpYWxpemUgc2Vzc2lvbiBkYXRhOiAke2Vyci5tZXNzYWdlfWApO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0ZXJyb3I6IGVycm9yICYmIHRyeV9zZXJpYWxpemUocHJvcHMuZXJyb3IpXG5cdFx0XHR9O1xuXG5cdFx0XHRsZXQgc2NyaXB0ID0gYF9fU0FQUEVSX189eyR7W1xuXHRcdFx0XHRlcnJvciAmJiBgZXJyb3I6JHtzZXJpYWxpemVkLmVycm9yfSxzdGF0dXM6JHtzdGF0dXN9YCxcblx0XHRcdFx0YGJhc2VVcmw6XCIke3JlcS5iYXNlVXJsfVwiYCxcblx0XHRcdFx0c2VyaWFsaXplZC5wcmVsb2FkZWQgJiYgYHByZWxvYWRlZDoke3NlcmlhbGl6ZWQucHJlbG9hZGVkfWAsXG5cdFx0XHRcdHNlcmlhbGl6ZWQuc2Vzc2lvbiAmJiBgc2Vzc2lvbjoke3NlcmlhbGl6ZWQuc2Vzc2lvbn1gXG5cdFx0XHRdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsJyl9fTtgO1xuXG5cdFx0XHRpZiAoaGFzX3NlcnZpY2Vfd29ya2VyKSB7XG5cdFx0XHRcdHNjcmlwdCArPSBgaWYoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvciluYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignJHtyZXEuYmFzZVVybH0vc2VydmljZS13b3JrZXIuanMnKTtgO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaWxlID0gW10uY29uY2F0KGJ1aWxkX2luZm8uYXNzZXRzLm1haW4pLmZpbHRlcihmaWxlID0+IGZpbGUgJiYgL1xcLmpzJC8udGVzdChmaWxlKSlbMF07XG5cdFx0XHRjb25zdCBtYWluID0gYCR7cmVxLmJhc2VVcmx9L2NsaWVudC8ke2ZpbGV9YDtcblxuXHRcdFx0aWYgKGJ1aWxkX2luZm8uYnVuZGxlciA9PT0gJ3JvbGx1cCcpIHtcblx0XHRcdFx0aWYgKGJ1aWxkX2luZm8ubGVnYWN5X2Fzc2V0cykge1xuXHRcdFx0XHRcdGNvbnN0IGxlZ2FjeV9tYWluID0gYCR7cmVxLmJhc2VVcmx9L2NsaWVudC9sZWdhY3kvJHtidWlsZF9pbmZvLmxlZ2FjeV9hc3NldHMubWFpbn1gO1xuXHRcdFx0XHRcdHNjcmlwdCArPSBgKGZ1bmN0aW9uKCl7dHJ5e2V2YWwoXCJhc3luYyBmdW5jdGlvbiB4KCl7fVwiKTt2YXIgbWFpbj1cIiR7bWFpbn1cIn1jYXRjaChlKXttYWluPVwiJHtsZWdhY3lfbWFpbn1cIn07dmFyIHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTt0cnl7bmV3IEZ1bmN0aW9uKFwiaWYoMClpbXBvcnQoJycpXCIpKCk7cy5zcmM9bWFpbjtzLnR5cGU9XCJtb2R1bGVcIjtzLmNyb3NzT3JpZ2luPVwidXNlLWNyZWRlbnRpYWxzXCI7fWNhdGNoKGUpe3Muc3JjPVwiJHtyZXEuYmFzZVVybH0vY2xpZW50L3NoaW1wb3J0QCR7YnVpbGRfaW5mby5zaGltcG9ydH0uanNcIjtzLnNldEF0dHJpYnV0ZShcImRhdGEtbWFpblwiLG1haW4pO31kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHMpO30oKSk7YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzY3JpcHQgKz0gYHZhciBzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dHJ5e25ldyBGdW5jdGlvbihcImlmKDApaW1wb3J0KCcnKVwiKSgpO3Muc3JjPVwiJHttYWlufVwiO3MudHlwZT1cIm1vZHVsZVwiO3MuY3Jvc3NPcmlnaW49XCJ1c2UtY3JlZGVudGlhbHNcIjt9Y2F0Y2goZSl7cy5zcmM9XCIke3JlcS5iYXNlVXJsfS9jbGllbnQvc2hpbXBvcnRAJHtidWlsZF9pbmZvLnNoaW1wb3J0fS5qc1wiO3Muc2V0QXR0cmlidXRlKFwiZGF0YS1tYWluXCIsXCIke21haW59XCIpfWRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocylgO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzY3JpcHQgKz0gYDwvc2NyaXB0PjxzY3JpcHQgc3JjPVwiJHttYWlufVwiPmA7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzdHlsZXM7XG5cblx0XHRcdC8vIFRPRE8gbWFrZSB0aGlzIGNvbnNpc3RlbnQgYWNyb3NzIGFwcHNcblx0XHRcdC8vIFRPRE8gZW1iZWQgYnVpbGRfaW5mbyBpbiBwbGFjZWhvbGRlci50c1xuXHRcdFx0aWYgKGJ1aWxkX2luZm8uY3NzICYmIGJ1aWxkX2luZm8uY3NzLm1haW4pIHtcblx0XHRcdFx0Y29uc3QgY3NzX2NodW5rcyA9IG5ldyBTZXQoKTtcblx0XHRcdFx0aWYgKGJ1aWxkX2luZm8uY3NzLm1haW4pIGNzc19jaHVua3MuYWRkKGJ1aWxkX2luZm8uY3NzLm1haW4pO1xuXHRcdFx0XHRwYWdlLnBhcnRzLmZvckVhY2gocGFydCA9PiB7XG5cdFx0XHRcdFx0aWYgKCFwYXJ0KSByZXR1cm47XG5cdFx0XHRcdFx0Y29uc3QgY3NzX2NodW5rc19mb3JfcGFydCA9IGJ1aWxkX2luZm8uY3NzLmNodW5rc1twYXJ0LmZpbGVdO1xuXG5cdFx0XHRcdFx0aWYgKGNzc19jaHVua3NfZm9yX3BhcnQpIHtcblx0XHRcdFx0XHRcdGNzc19jaHVua3NfZm9yX3BhcnQuZm9yRWFjaChmaWxlID0+IHtcblx0XHRcdFx0XHRcdFx0Y3NzX2NodW5rcy5hZGQoZmlsZSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHN0eWxlcyA9IEFycmF5LmZyb20oY3NzX2NodW5rcylcblx0XHRcdFx0XHQubWFwKGhyZWYgPT4gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY2xpZW50LyR7aHJlZn1cIj5gKVxuXHRcdFx0XHRcdC5qb2luKCcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0eWxlcyA9IChjc3MgJiYgY3NzLmNvZGUgPyBgPHN0eWxlPiR7Y3NzLmNvZGV9PC9zdHlsZT5gIDogJycpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1c2VycyBjYW4gc2V0IGEgQ1NQIG5vbmNlIHVzaW5nIHJlcy5sb2NhbHMubm9uY2Vcblx0XHRcdGNvbnN0IG5vbmNlX2F0dHIgPSAocmVzLmxvY2FscyAmJiByZXMubG9jYWxzLm5vbmNlKSA/IGAgbm9uY2U9XCIke3Jlcy5sb2NhbHMubm9uY2V9XCJgIDogJyc7XG5cblx0XHRcdGNvbnN0IGJvZHkgPSB0ZW1wbGF0ZSgpXG5cdFx0XHRcdC5yZXBsYWNlKCclc2FwcGVyLmJhc2UlJywgKCkgPT4gYDxiYXNlIGhyZWY9XCIke3JlcS5iYXNlVXJsfS9cIj5gKVxuXHRcdFx0XHQucmVwbGFjZSgnJXNhcHBlci5zY3JpcHRzJScsICgpID0+IGA8c2NyaXB0JHtub25jZV9hdHRyfT4ke3NjcmlwdH08L3NjcmlwdD5gKVxuXHRcdFx0XHQucmVwbGFjZSgnJXNhcHBlci5odG1sJScsICgpID0+IGh0bWwpXG5cdFx0XHRcdC5yZXBsYWNlKCclc2FwcGVyLmhlYWQlJywgKCkgPT4gYDxub3NjcmlwdCBpZD0nc2FwcGVyLWhlYWQtc3RhcnQnPjwvbm9zY3JpcHQ+JHtoZWFkfTxub3NjcmlwdCBpZD0nc2FwcGVyLWhlYWQtZW5kJz48L25vc2NyaXB0PmApXG5cdFx0XHRcdC5yZXBsYWNlKCclc2FwcGVyLnN0eWxlcyUnLCAoKSA9PiBzdHlsZXMpO1xuXG5cdFx0XHRyZXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcblx0XHRcdHJlcy5lbmQoYm9keSk7XG5cdFx0fSBjYXRjaChlcnIpIHtcblx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRiYWlsKHJlcSwgcmVzLCBlcnIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGFuZGxlX2Vycm9yKHJlcSwgcmVzLCA1MDAsIGVycik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGZpbmRfcm91dGUocmVxLCByZXMsIG5leHQpIHtcblx0XHRpZiAocmVxLnBhdGggPT09ICcvc2VydmljZS13b3JrZXItaW5kZXguaHRtbCcpIHtcblx0XHRcdGNvbnN0IGhvbWVQYWdlID0gcGFnZXMuZmluZChwYWdlID0+IHBhZ2UucGF0dGVybi50ZXN0KCcvJykpO1xuXHRcdFx0aGFuZGxlX3BhZ2UoaG9tZVBhZ2UsIHJlcSwgcmVzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IHBhZ2Ugb2YgcGFnZXMpIHtcblx0XHRcdGlmIChwYWdlLnBhdHRlcm4udGVzdChyZXEucGF0aCkpIHtcblx0XHRcdFx0aGFuZGxlX3BhZ2UocGFnZSwgcmVxLCByZXMpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aGFuZGxlX2Vycm9yKHJlcSwgcmVzLCA0MDQsICdOb3QgZm91bmQnKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVhZF90ZW1wbGF0ZShkaXIgPSBidWlsZF9kaXIpIHtcblx0cmV0dXJuIGZzLnJlYWRGaWxlU3luYyhgJHtkaXJ9L3RlbXBsYXRlLmh0bWxgLCAndXRmLTgnKTtcbn1cblxuZnVuY3Rpb24gdHJ5X3NlcmlhbGl6ZShkYXRhLCBmYWlsKSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGRldmFsdWUoZGF0YSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGlmIChmYWlsKSBmYWlsKGVycik7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cblxuZnVuY3Rpb24gZXNjYXBlX2h0bWwoaHRtbCkge1xuXHRjb25zdCBjaGFycyA9IHtcblx0XHQnXCInIDogJ3F1b3QnLFxuXHRcdFwiJ1wiOiAnIzM5Jyxcblx0XHQnJic6ICdhbXAnLFxuXHRcdCc8JyA6ICdsdCcsXG5cdFx0Jz4nIDogJ2d0J1xuXHR9O1xuXG5cdHJldHVybiBodG1sLnJlcGxhY2UoL1tcIicmPD5dL2csIGMgPT4gYCYke2NoYXJzW2NdfTtgKTtcbn1cblxudmFyIG1pbWVfcmF3ID0gXCJhcHBsaWNhdGlvbi9hbmRyZXctaW5zZXRcXHRcXHRcXHRlelxcbmFwcGxpY2F0aW9uL2FwcGxpeHdhcmVcXHRcXHRcXHRcXHRhd1xcbmFwcGxpY2F0aW9uL2F0b20reG1sXFx0XFx0XFx0XFx0YXRvbVxcbmFwcGxpY2F0aW9uL2F0b21jYXQreG1sXFx0XFx0XFx0XFx0YXRvbWNhdFxcbmFwcGxpY2F0aW9uL2F0b21zdmMreG1sXFx0XFx0XFx0XFx0YXRvbXN2Y1xcbmFwcGxpY2F0aW9uL2NjeG1sK3htbFxcdFxcdFxcdFxcdGNjeG1sXFxuYXBwbGljYXRpb24vY2RtaS1jYXBhYmlsaXR5XFx0XFx0XFx0Y2RtaWFcXG5hcHBsaWNhdGlvbi9jZG1pLWNvbnRhaW5lclxcdFxcdFxcdGNkbWljXFxuYXBwbGljYXRpb24vY2RtaS1kb21haW5cXHRcXHRcXHRcXHRjZG1pZFxcbmFwcGxpY2F0aW9uL2NkbWktb2JqZWN0XFx0XFx0XFx0XFx0Y2RtaW9cXG5hcHBsaWNhdGlvbi9jZG1pLXF1ZXVlXFx0XFx0XFx0XFx0Y2RtaXFcXG5hcHBsaWNhdGlvbi9jdS1zZWVtZVxcdFxcdFxcdFxcdGN1XFxuYXBwbGljYXRpb24vZGF2bW91bnQreG1sXFx0XFx0XFx0ZGF2bW91bnRcXG5hcHBsaWNhdGlvbi9kb2Nib29rK3htbFxcdFxcdFxcdFxcdGRia1xcbmFwcGxpY2F0aW9uL2Rzc2MrZGVyXFx0XFx0XFx0XFx0ZHNzY1xcbmFwcGxpY2F0aW9uL2Rzc2MreG1sXFx0XFx0XFx0XFx0eGRzc2NcXG5hcHBsaWNhdGlvbi9lY21hc2NyaXB0XFx0XFx0XFx0XFx0ZWNtYVxcbmFwcGxpY2F0aW9uL2VtbWEreG1sXFx0XFx0XFx0XFx0ZW1tYVxcbmFwcGxpY2F0aW9uL2VwdWIremlwXFx0XFx0XFx0XFx0ZXB1YlxcbmFwcGxpY2F0aW9uL2V4aVxcdFxcdFxcdFxcdFxcdGV4aVxcbmFwcGxpY2F0aW9uL2ZvbnQtdGRwZnJcXHRcXHRcXHRcXHRwZnJcXG5hcHBsaWNhdGlvbi9nbWwreG1sXFx0XFx0XFx0XFx0Z21sXFxuYXBwbGljYXRpb24vZ3B4K3htbFxcdFxcdFxcdFxcdGdweFxcbmFwcGxpY2F0aW9uL2d4ZlxcdFxcdFxcdFxcdFxcdGd4ZlxcbmFwcGxpY2F0aW9uL2h5cGVyc3R1ZGlvXFx0XFx0XFx0XFx0c3RrXFxuYXBwbGljYXRpb24vaW5rbWwreG1sXFx0XFx0XFx0XFx0aW5rIGlua21sXFxuYXBwbGljYXRpb24vaXBmaXhcXHRcXHRcXHRcXHRpcGZpeFxcbmFwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZVxcdFxcdFxcdGphclxcbmFwcGxpY2F0aW9uL2phdmEtc2VyaWFsaXplZC1vYmplY3RcXHRcXHRzZXJcXG5hcHBsaWNhdGlvbi9qYXZhLXZtXFx0XFx0XFx0XFx0Y2xhc3NcXG5hcHBsaWNhdGlvbi9qYXZhc2NyaXB0XFx0XFx0XFx0XFx0anNcXG5hcHBsaWNhdGlvbi9qc29uXFx0XFx0XFx0XFx0anNvblxcbmFwcGxpY2F0aW9uL2pzb25tbCtqc29uXFx0XFx0XFx0XFx0anNvbm1sXFxuYXBwbGljYXRpb24vbG9zdCt4bWxcXHRcXHRcXHRcXHRsb3N0eG1sXFxuYXBwbGljYXRpb24vbWFjLWJpbmhleDQwXFx0XFx0XFx0aHF4XFxuYXBwbGljYXRpb24vbWFjLWNvbXBhY3Rwcm9cXHRcXHRcXHRjcHRcXG5hcHBsaWNhdGlvbi9tYWRzK3htbFxcdFxcdFxcdFxcdG1hZHNcXG5hcHBsaWNhdGlvbi9tYXJjXFx0XFx0XFx0XFx0bXJjXFxuYXBwbGljYXRpb24vbWFyY3htbCt4bWxcXHRcXHRcXHRcXHRtcmN4XFxuYXBwbGljYXRpb24vbWF0aGVtYXRpY2FcXHRcXHRcXHRcXHRtYSBuYiBtYlxcbmFwcGxpY2F0aW9uL21hdGhtbCt4bWxcXHRcXHRcXHRcXHRtYXRobWxcXG5hcHBsaWNhdGlvbi9tYm94XFx0XFx0XFx0XFx0bWJveFxcbmFwcGxpY2F0aW9uL21lZGlhc2VydmVyY29udHJvbCt4bWxcXHRcXHRtc2NtbFxcbmFwcGxpY2F0aW9uL21ldGFsaW5rK3htbFxcdFxcdFxcdG1ldGFsaW5rXFxuYXBwbGljYXRpb24vbWV0YWxpbms0K3htbFxcdFxcdFxcdG1ldGE0XFxuYXBwbGljYXRpb24vbWV0cyt4bWxcXHRcXHRcXHRcXHRtZXRzXFxuYXBwbGljYXRpb24vbW9kcyt4bWxcXHRcXHRcXHRcXHRtb2RzXFxuYXBwbGljYXRpb24vbXAyMVxcdFxcdFxcdFxcdG0yMSBtcDIxXFxuYXBwbGljYXRpb24vbXA0XFx0XFx0XFx0XFx0XFx0bXA0c1xcbmFwcGxpY2F0aW9uL21zd29yZFxcdFxcdFxcdFxcdGRvYyBkb3RcXG5hcHBsaWNhdGlvbi9teGZcXHRcXHRcXHRcXHRcXHRteGZcXG5hcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cXHRiaW4gZG1zIGxyZiBtYXIgc28gZGlzdCBkaXN0eiBwa2cgYnBrIGR1bXAgZWxjIGRlcGxveVxcbmFwcGxpY2F0aW9uL29kYVxcdFxcdFxcdFxcdFxcdG9kYVxcbmFwcGxpY2F0aW9uL29lYnBzLXBhY2thZ2UreG1sXFx0XFx0XFx0b3BmXFxuYXBwbGljYXRpb24vb2dnXFx0XFx0XFx0XFx0XFx0b2d4XFxuYXBwbGljYXRpb24vb21kb2MreG1sXFx0XFx0XFx0XFx0b21kb2NcXG5hcHBsaWNhdGlvbi9vbmVub3RlXFx0XFx0XFx0XFx0b25ldG9jIG9uZXRvYzIgb25ldG1wIG9uZXBrZ1xcbmFwcGxpY2F0aW9uL294cHNcXHRcXHRcXHRcXHRveHBzXFxuYXBwbGljYXRpb24vcGF0Y2gtb3BzLWVycm9yK3htbFxcdFxcdFxcdHhlclxcbmFwcGxpY2F0aW9uL3BkZlxcdFxcdFxcdFxcdFxcdHBkZlxcbmFwcGxpY2F0aW9uL3BncC1lbmNyeXB0ZWRcXHRcXHRcXHRwZ3BcXG5hcHBsaWNhdGlvbi9wZ3Atc2lnbmF0dXJlXFx0XFx0XFx0YXNjIHNpZ1xcbmFwcGxpY2F0aW9uL3BpY3MtcnVsZXNcXHRcXHRcXHRcXHRwcmZcXG5hcHBsaWNhdGlvbi9wa2NzMTBcXHRcXHRcXHRcXHRwMTBcXG5hcHBsaWNhdGlvbi9wa2NzNy1taW1lXFx0XFx0XFx0XFx0cDdtIHA3Y1xcbmFwcGxpY2F0aW9uL3BrY3M3LXNpZ25hdHVyZVxcdFxcdFxcdHA3c1xcbmFwcGxpY2F0aW9uL3BrY3M4XFx0XFx0XFx0XFx0cDhcXG5hcHBsaWNhdGlvbi9wa2l4LWF0dHItY2VydFxcdFxcdFxcdGFjXFxuYXBwbGljYXRpb24vcGtpeC1jZXJ0XFx0XFx0XFx0XFx0Y2VyXFxuYXBwbGljYXRpb24vcGtpeC1jcmxcXHRcXHRcXHRcXHRjcmxcXG5hcHBsaWNhdGlvbi9wa2l4LXBraXBhdGhcXHRcXHRcXHRwa2lwYXRoXFxuYXBwbGljYXRpb24vcGtpeGNtcFxcdFxcdFxcdFxcdHBraVxcbmFwcGxpY2F0aW9uL3Bscyt4bWxcXHRcXHRcXHRcXHRwbHNcXG5hcHBsaWNhdGlvbi9wb3N0c2NyaXB0XFx0XFx0XFx0XFx0YWkgZXBzIHBzXFxuYXBwbGljYXRpb24vcHJzLmN3d1xcdFxcdFxcdFxcdGN3d1xcbmFwcGxpY2F0aW9uL3Bza2MreG1sXFx0XFx0XFx0XFx0cHNrY3htbFxcbmFwcGxpY2F0aW9uL3JkZit4bWxcXHRcXHRcXHRcXHRyZGZcXG5hcHBsaWNhdGlvbi9yZWdpbmZvK3htbFxcdFxcdFxcdFxcdHJpZlxcbmFwcGxpY2F0aW9uL3JlbGF4LW5nLWNvbXBhY3Qtc3ludGF4XFx0XFx0cm5jXFxuYXBwbGljYXRpb24vcmVzb3VyY2UtbGlzdHMreG1sXFx0XFx0XFx0cmxcXG5hcHBsaWNhdGlvbi9yZXNvdXJjZS1saXN0cy1kaWZmK3htbFxcdFxcdHJsZFxcbmFwcGxpY2F0aW9uL3Jscy1zZXJ2aWNlcyt4bWxcXHRcXHRcXHRyc1xcbmFwcGxpY2F0aW9uL3Jwa2ktZ2hvc3RidXN0ZXJzXFx0XFx0XFx0Z2JyXFxuYXBwbGljYXRpb24vcnBraS1tYW5pZmVzdFxcdFxcdFxcdG1mdFxcbmFwcGxpY2F0aW9uL3Jwa2ktcm9hXFx0XFx0XFx0XFx0cm9hXFxuYXBwbGljYXRpb24vcnNkK3htbFxcdFxcdFxcdFxcdHJzZFxcbmFwcGxpY2F0aW9uL3Jzcyt4bWxcXHRcXHRcXHRcXHRyc3NcXG5hcHBsaWNhdGlvbi9ydGZcXHRcXHRcXHRcXHRcXHRydGZcXG5hcHBsaWNhdGlvbi9zYm1sK3htbFxcdFxcdFxcdFxcdHNibWxcXG5hcHBsaWNhdGlvbi9zY3ZwLWN2LXJlcXVlc3RcXHRcXHRcXHRzY3FcXG5hcHBsaWNhdGlvbi9zY3ZwLWN2LXJlc3BvbnNlXFx0XFx0XFx0c2NzXFxuYXBwbGljYXRpb24vc2N2cC12cC1yZXF1ZXN0XFx0XFx0XFx0c3BxXFxuYXBwbGljYXRpb24vc2N2cC12cC1yZXNwb25zZVxcdFxcdFxcdHNwcFxcbmFwcGxpY2F0aW9uL3NkcFxcdFxcdFxcdFxcdFxcdHNkcFxcbmFwcGxpY2F0aW9uL3NldC1wYXltZW50LWluaXRpYXRpb25cXHRcXHRzZXRwYXlcXG5hcHBsaWNhdGlvbi9zZXQtcmVnaXN0cmF0aW9uLWluaXRpYXRpb25cXHRcXHRzZXRyZWdcXG5hcHBsaWNhdGlvbi9zaGYreG1sXFx0XFx0XFx0XFx0c2hmXFxuYXBwbGljYXRpb24vc21pbCt4bWxcXHRcXHRcXHRcXHRzbWkgc21pbFxcbmFwcGxpY2F0aW9uL3NwYXJxbC1xdWVyeVxcdFxcdFxcdHJxXFxuYXBwbGljYXRpb24vc3BhcnFsLXJlc3VsdHMreG1sXFx0XFx0XFx0c3J4XFxuYXBwbGljYXRpb24vc3Jnc1xcdFxcdFxcdFxcdGdyYW1cXG5hcHBsaWNhdGlvbi9zcmdzK3htbFxcdFxcdFxcdFxcdGdyeG1sXFxuYXBwbGljYXRpb24vc3J1K3htbFxcdFxcdFxcdFxcdHNydVxcbmFwcGxpY2F0aW9uL3NzZGwreG1sXFx0XFx0XFx0XFx0c3NkbFxcbmFwcGxpY2F0aW9uL3NzbWwreG1sXFx0XFx0XFx0XFx0c3NtbFxcbmFwcGxpY2F0aW9uL3RlaSt4bWxcXHRcXHRcXHRcXHR0ZWkgdGVpY29ycHVzXFxuYXBwbGljYXRpb24vdGhyYXVkK3htbFxcdFxcdFxcdFxcdHRmaVxcbmFwcGxpY2F0aW9uL3RpbWVzdGFtcGVkLWRhdGFcXHRcXHRcXHR0c2RcXG5hcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctbGFyZ2VcXHRcXHRwbGJcXG5hcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctc21hbGxcXHRcXHRwc2JcXG5hcHBsaWNhdGlvbi92bmQuM2dwcC5waWMtYnctdmFyXFx0XFx0XFx0cHZiXFxuYXBwbGljYXRpb24vdm5kLjNncHAyLnRjYXBcXHRcXHRcXHR0Y2FwXFxuYXBwbGljYXRpb24vdm5kLjNtLnBvc3QtaXQtbm90ZXNcXHRcXHRwd25cXG5hcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5hc29cXHRcXHRhc29cXG5hcHBsaWNhdGlvbi92bmQuYWNjcGFjLnNpbXBseS5pbXBcXHRcXHRpbXBcXG5hcHBsaWNhdGlvbi92bmQuYWN1Y29ib2xcXHRcXHRcXHRhY3VcXG5hcHBsaWNhdGlvbi92bmQuYWN1Y29ycFxcdFxcdFxcdFxcdGF0YyBhY3V0Y1xcbmFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5haXItYXBwbGljYXRpb24taW5zdGFsbGVyLXBhY2thZ2UremlwXFx0YWlyXFxuYXBwbGljYXRpb24vdm5kLmFkb2JlLmZvcm1zY2VudHJhbC5mY2R0XFx0XFx0ZmNkdFxcbmFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5meHBcXHRcXHRcXHRmeHAgZnhwbFxcbmFwcGxpY2F0aW9uL3ZuZC5hZG9iZS54ZHAreG1sXFx0XFx0XFx0eGRwXFxuYXBwbGljYXRpb24vdm5kLmFkb2JlLnhmZGZcXHRcXHRcXHR4ZmRmXFxuYXBwbGljYXRpb24vdm5kLmFoZWFkLnNwYWNlXFx0XFx0XFx0YWhlYWRcXG5hcHBsaWNhdGlvbi92bmQuYWlyemlwLmZpbGVzZWN1cmUuYXpmXFx0XFx0YXpmXFxuYXBwbGljYXRpb24vdm5kLmFpcnppcC5maWxlc2VjdXJlLmF6c1xcdFxcdGF6c1xcbmFwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2tcXHRcXHRcXHRhendcXG5hcHBsaWNhdGlvbi92bmQuYW1lcmljYW5keW5hbWljcy5hY2NcXHRcXHRhY2NcXG5hcHBsaWNhdGlvbi92bmQuYW1pZ2EuYW1pXFx0XFx0XFx0YW1pXFxuYXBwbGljYXRpb24vdm5kLmFuZHJvaWQucGFja2FnZS1hcmNoaXZlXFx0XFx0YXBrXFxuYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1jZXJ0aWZpY2F0ZS1pc3N1ZS1pbml0aWF0aW9uXFx0Y2lpXFxuYXBwbGljYXRpb24vdm5kLmFuc2VyLXdlYi1mdW5kcy10cmFuc2Zlci1pbml0aWF0aW9uXFx0ZnRpXFxuYXBwbGljYXRpb24vdm5kLmFudGl4LmdhbWUtY29tcG9uZW50XFx0XFx0YXR4XFxuYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWxcXHRcXHRtcGtnXFxuYXBwbGljYXRpb24vdm5kLmFwcGxlLm1wZWd1cmxcXHRcXHRcXHRtM3U4XFxuYXBwbGljYXRpb24vdm5kLmFyaXN0YW5ldHdvcmtzLnN3aVxcdFxcdHN3aVxcbmFwcGxpY2F0aW9uL3ZuZC5hc3RyYWVhLXNvZnR3YXJlLmlvdGFcXHRcXHRpb3RhXFxuYXBwbGljYXRpb24vdm5kLmF1ZGlvZ3JhcGhcXHRcXHRcXHRhZXBcXG5hcHBsaWNhdGlvbi92bmQuYmx1ZWljZS5tdWx0aXBhc3NcXHRcXHRtcG1cXG5hcHBsaWNhdGlvbi92bmQuYm1pXFx0XFx0XFx0XFx0Ym1pXFxuYXBwbGljYXRpb24vdm5kLmJ1c2luZXNzb2JqZWN0c1xcdFxcdFxcdHJlcFxcbmFwcGxpY2F0aW9uL3ZuZC5jaGVtZHJhdyt4bWxcXHRcXHRcXHRjZHhtbFxcbmFwcGxpY2F0aW9uL3ZuZC5jaGlwbnV0cy5rYXJhb2tlLW1tZFxcdFxcdG1tZFxcbmFwcGxpY2F0aW9uL3ZuZC5jaW5kZXJlbGxhXFx0XFx0XFx0Y2R5XFxuYXBwbGljYXRpb24vdm5kLmNsYXltb3JlXFx0XFx0XFx0Y2xhXFxuYXBwbGljYXRpb24vdm5kLmNsb2FudG8ucnA5XFx0XFx0XFx0cnA5XFxuYXBwbGljYXRpb24vdm5kLmNsb25rLmM0Z3JvdXBcXHRcXHRcXHRjNGcgYzRkIGM0ZiBjNHAgYzR1XFxuYXBwbGljYXRpb24vdm5kLmNsdWV0cnVzdC5jYXJ0b21vYmlsZS1jb25maWdcXHRcXHRjMTFhbWNcXG5hcHBsaWNhdGlvbi92bmQuY2x1ZXRydXN0LmNhcnRvbW9iaWxlLWNvbmZpZy1wa2dcXHRjMTFhbXpcXG5hcHBsaWNhdGlvbi92bmQuY29tbW9uc3BhY2VcXHRcXHRcXHRjc3BcXG5hcHBsaWNhdGlvbi92bmQuY29udGFjdC5jbXNnXFx0XFx0XFx0Y2RiY21zZ1xcbmFwcGxpY2F0aW9uL3ZuZC5jb3Ntb2NhbGxlclxcdFxcdFxcdGNtY1xcbmFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyXFx0XFx0XFx0Y2xreFxcbmFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLmtleWJvYXJkXFx0XFx0Y2xra1xcbmFwcGxpY2F0aW9uL3ZuZC5jcmljay5jbGlja2VyLnBhbGV0dGVcXHRcXHRjbGtwXFxuYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIudGVtcGxhdGVcXHRcXHRjbGt0XFxuYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIud29yZGJhbmtcXHRcXHRjbGt3XFxuYXBwbGljYXRpb24vdm5kLmNyaXRpY2FsdG9vbHMud2JzK3htbFxcdFxcdHdic1xcbmFwcGxpY2F0aW9uL3ZuZC5jdGMtcG9zbWxcXHRcXHRcXHRwbWxcXG5hcHBsaWNhdGlvbi92bmQuY3Vwcy1wcGRcXHRcXHRcXHRwcGRcXG5hcHBsaWNhdGlvbi92bmQuY3VybC5jYXJcXHRcXHRcXHRjYXJcXG5hcHBsaWNhdGlvbi92bmQuY3VybC5wY3VybFxcdFxcdFxcdHBjdXJsXFxuYXBwbGljYXRpb24vdm5kLmRhcnRcXHRcXHRcXHRcXHRkYXJ0XFxuYXBwbGljYXRpb24vdm5kLmRhdGEtdmlzaW9uLnJkelxcdFxcdFxcdHJkelxcbmFwcGxpY2F0aW9uL3ZuZC5kZWNlLmRhdGFcXHRcXHRcXHR1dmYgdXZ2ZiB1dmQgdXZ2ZFxcbmFwcGxpY2F0aW9uL3ZuZC5kZWNlLnR0bWwreG1sXFx0XFx0XFx0dXZ0IHV2dnRcXG5hcHBsaWNhdGlvbi92bmQuZGVjZS51bnNwZWNpZmllZFxcdFxcdHV2eCB1dnZ4XFxuYXBwbGljYXRpb24vdm5kLmRlY2UuemlwXFx0XFx0XFx0dXZ6IHV2dnpcXG5hcHBsaWNhdGlvbi92bmQuZGVub3ZvLmZjc2VsYXlvdXQtbGlua1xcdFxcdGZlX2xhdW5jaFxcbmFwcGxpY2F0aW9uL3ZuZC5kbmFcXHRcXHRcXHRcXHRkbmFcXG5hcHBsaWNhdGlvbi92bmQuZG9sYnkubWxwXFx0XFx0XFx0bWxwXFxuYXBwbGljYXRpb24vdm5kLmRwZ3JhcGhcXHRcXHRcXHRcXHRkcGdcXG5hcHBsaWNhdGlvbi92bmQuZHJlYW1mYWN0b3J5XFx0XFx0XFx0ZGZhY1xcbmFwcGxpY2F0aW9uL3ZuZC5kcy1rZXlwb2ludFxcdFxcdFxcdGtweHhcXG5hcHBsaWNhdGlvbi92bmQuZHZiLmFpdFxcdFxcdFxcdFxcdGFpdFxcbmFwcGxpY2F0aW9uL3ZuZC5kdmIuc2VydmljZVxcdFxcdFxcdHN2Y1xcbmFwcGxpY2F0aW9uL3ZuZC5keW5hZ2VvXFx0XFx0XFx0XFx0Z2VvXFxuYXBwbGljYXRpb24vdm5kLmVjb3dpbi5jaGFydFxcdFxcdFxcdG1hZ1xcbmFwcGxpY2F0aW9uL3ZuZC5lbmxpdmVuXFx0XFx0XFx0XFx0bm1sXFxuYXBwbGljYXRpb24vdm5kLmVwc29uLmVzZlxcdFxcdFxcdGVzZlxcbmFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5tc2ZcXHRcXHRcXHRtc2ZcXG5hcHBsaWNhdGlvbi92bmQuZXBzb24ucXVpY2thbmltZVxcdFxcdHFhbVxcbmFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5zYWx0XFx0XFx0XFx0c2x0XFxuYXBwbGljYXRpb24vdm5kLmVwc29uLnNzZlxcdFxcdFxcdHNzZlxcbmFwcGxpY2F0aW9uL3ZuZC5lc3ppZ25vMyt4bWxcXHRcXHRcXHRlczMgZXQzXFxuYXBwbGljYXRpb24vdm5kLmV6cGl4LWFsYnVtXFx0XFx0XFx0ZXoyXFxuYXBwbGljYXRpb24vdm5kLmV6cGl4LXBhY2thZ2VcXHRcXHRcXHRlejNcXG5hcHBsaWNhdGlvbi92bmQuZmRmXFx0XFx0XFx0XFx0ZmRmXFxuYXBwbGljYXRpb24vdm5kLmZkc24ubXNlZWRcXHRcXHRcXHRtc2VlZFxcbmFwcGxpY2F0aW9uL3ZuZC5mZHNuLnNlZWRcXHRcXHRcXHRzZWVkIGRhdGFsZXNzXFxuYXBwbGljYXRpb24vdm5kLmZsb2dyYXBoaXRcXHRcXHRcXHRncGhcXG5hcHBsaWNhdGlvbi92bmQuZmx1eHRpbWUuY2xpcFxcdFxcdFxcdGZ0Y1xcbmFwcGxpY2F0aW9uL3ZuZC5mcmFtZW1ha2VyXFx0XFx0XFx0Zm0gZnJhbWUgbWFrZXIgYm9va1xcbmFwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmZuY1xcdFxcdFxcdGZuY1xcbmFwcGxpY2F0aW9uL3ZuZC5mcm9nYW5zLmx0ZlxcdFxcdFxcdGx0ZlxcbmFwcGxpY2F0aW9uL3ZuZC5mc2Mud2VibGF1bmNoXFx0XFx0XFx0ZnNjXFxuYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNcXHRcXHRcXHRvYXNcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czJcXHRcXHRcXHRvYTJcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5czNcXHRcXHRcXHRvYTNcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c2dwXFx0XFx0XFx0Zmc1XFxuYXBwbGljYXRpb24vdm5kLmZ1aml0c3Uub2FzeXNwcnNcXHRcXHRiaDJcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRkZFxcdFxcdFxcdGRkZFxcbmFwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZG9jdXdvcmtzXFx0XFx0eGR3XFxuYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kb2N1d29ya3MuYmluZGVyXFx0eGJkXFxuYXBwbGljYXRpb24vdm5kLmZ1enp5c2hlZXRcXHRcXHRcXHRmenNcXG5hcHBsaWNhdGlvbi92bmQuZ2Vub21hdGl4LnR1eGVkb1xcdFxcdHR4ZFxcbmFwcGxpY2F0aW9uL3ZuZC5nZW9nZWJyYS5maWxlXFx0XFx0XFx0Z2diXFxuYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLnRvb2xcXHRcXHRcXHRnZ3RcXG5hcHBsaWNhdGlvbi92bmQuZ2VvbWV0cnktZXhwbG9yZXJcXHRcXHRnZXggZ3JlXFxuYXBwbGljYXRpb24vdm5kLmdlb25leHRcXHRcXHRcXHRcXHRneHRcXG5hcHBsaWNhdGlvbi92bmQuZ2VvcGxhblxcdFxcdFxcdFxcdGcyd1xcbmFwcGxpY2F0aW9uL3ZuZC5nZW9zcGFjZVxcdFxcdFxcdGczd1xcbmFwcGxpY2F0aW9uL3ZuZC5nbXhcXHRcXHRcXHRcXHRnbXhcXG5hcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttbCt4bWxcXHRcXHRrbWxcXG5hcHBsaWNhdGlvbi92bmQuZ29vZ2xlLWVhcnRoLmttelxcdFxcdGttelxcbmFwcGxpY2F0aW9uL3ZuZC5ncmFmZXFcXHRcXHRcXHRcXHRncWYgZ3FzXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS1hY2NvdW50XFx0XFx0XFx0Z2FjXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS1oZWxwXFx0XFx0XFx0Z2hmXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS1pZGVudGl0eS1tZXNzYWdlXFx0XFx0Z2ltXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS1pbmplY3RvclxcdFxcdFxcdGdydlxcbmFwcGxpY2F0aW9uL3ZuZC5ncm9vdmUtdG9vbC1tZXNzYWdlXFx0XFx0Z3RtXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS10b29sLXRlbXBsYXRlXFx0XFx0dHBsXFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS12Y2FyZFxcdFxcdFxcdHZjZ1xcbmFwcGxpY2F0aW9uL3ZuZC5oYWwreG1sXFx0XFx0XFx0XFx0aGFsXFxuYXBwbGljYXRpb24vdm5kLmhhbmRoZWxkLWVudGVydGFpbm1lbnQreG1sXFx0em1tXFxuYXBwbGljYXRpb24vdm5kLmhiY2lcXHRcXHRcXHRcXHRoYmNpXFxuYXBwbGljYXRpb24vdm5kLmhoZS5sZXNzb24tcGxheWVyXFx0XFx0bGVzXFxuYXBwbGljYXRpb24vdm5kLmhwLWhwZ2xcXHRcXHRcXHRcXHRocGdsXFxuYXBwbGljYXRpb24vdm5kLmhwLWhwaWRcXHRcXHRcXHRcXHRocGlkXFxuYXBwbGljYXRpb24vdm5kLmhwLWhwc1xcdFxcdFxcdFxcdGhwc1xcbmFwcGxpY2F0aW9uL3ZuZC5ocC1qbHl0XFx0XFx0XFx0XFx0amx0XFxuYXBwbGljYXRpb24vdm5kLmhwLXBjbFxcdFxcdFxcdFxcdHBjbFxcbmFwcGxpY2F0aW9uL3ZuZC5ocC1wY2x4bFxcdFxcdFxcdHBjbHhsXFxuYXBwbGljYXRpb24vdm5kLmh5ZHJvc3RhdGl4LnNvZi1kYXRhXFx0XFx0c2ZkLWhkc3R4XFxuYXBwbGljYXRpb24vdm5kLmlibS5taW5pcGF5XFx0XFx0XFx0bXB5XFxuYXBwbGljYXRpb24vdm5kLmlibS5tb2RjYXBcXHRcXHRcXHRhZnAgbGlzdGFmcCBsaXN0MzgyMFxcbmFwcGxpY2F0aW9uL3ZuZC5pYm0ucmlnaHRzLW1hbmFnZW1lbnRcXHRcXHRpcm1cXG5hcHBsaWNhdGlvbi92bmQuaWJtLnNlY3VyZS1jb250YWluZXJcXHRcXHRzY1xcbmFwcGxpY2F0aW9uL3ZuZC5pY2Nwcm9maWxlXFx0XFx0XFx0aWNjIGljbVxcbmFwcGxpY2F0aW9uL3ZuZC5pZ2xvYWRlclxcdFxcdFxcdGlnbFxcbmFwcGxpY2F0aW9uL3ZuZC5pbW1lcnZpc2lvbi1pdnBcXHRcXHRcXHRpdnBcXG5hcHBsaWNhdGlvbi92bmQuaW1tZXJ2aXNpb24taXZ1XFx0XFx0XFx0aXZ1XFxuYXBwbGljYXRpb24vdm5kLmluc29ycy5pZ21cXHRcXHRcXHRpZ21cXG5hcHBsaWNhdGlvbi92bmQuaW50ZXJjb24uZm9ybW5ldFxcdFxcdHhwdyB4cHhcXG5hcHBsaWNhdGlvbi92bmQuaW50ZXJnZW9cXHRcXHRcXHRpMmdcXG5hcHBsaWNhdGlvbi92bmQuaW50dS5xYm9cXHRcXHRcXHRxYm9cXG5hcHBsaWNhdGlvbi92bmQuaW50dS5xZnhcXHRcXHRcXHRxZnhcXG5hcHBsaWNhdGlvbi92bmQuaXB1bnBsdWdnZWQucmNwcm9maWxlXFx0XFx0cmNwcm9maWxlXFxuYXBwbGljYXRpb24vdm5kLmlyZXBvc2l0b3J5LnBhY2thZ2UreG1sXFx0XFx0aXJwXFxuYXBwbGljYXRpb24vdm5kLmlzLXhwclxcdFxcdFxcdFxcdHhwclxcbmFwcGxpY2F0aW9uL3ZuZC5pc2FjLmZjc1xcdFxcdFxcdGZjc1xcbmFwcGxpY2F0aW9uL3ZuZC5qYW1cXHRcXHRcXHRcXHRqYW1cXG5hcHBsaWNhdGlvbi92bmQuamNwLmphdmFtZS5taWRsZXQtcm1zXFx0XFx0cm1zXFxuYXBwbGljYXRpb24vdm5kLmppc3BcXHRcXHRcXHRcXHRqaXNwXFxuYXBwbGljYXRpb24vdm5kLmpvb3N0LmpvZGEtYXJjaGl2ZVxcdFxcdGpvZGFcXG5hcHBsaWNhdGlvbi92bmQua2Fob290elxcdFxcdFxcdFxcdGt0eiBrdHJcXG5hcHBsaWNhdGlvbi92bmQua2RlLmthcmJvblxcdFxcdFxcdGthcmJvblxcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua2NoYXJ0XFx0XFx0XFx0Y2hydFxcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua2Zvcm11bGFcXHRcXHRcXHRrZm9cXG5hcHBsaWNhdGlvbi92bmQua2RlLmtpdmlvXFx0XFx0XFx0Zmx3XFxuYXBwbGljYXRpb24vdm5kLmtkZS5rb250b3VyXFx0XFx0XFx0a29uXFxuYXBwbGljYXRpb24vdm5kLmtkZS5rcHJlc2VudGVyXFx0XFx0XFx0a3ByIGtwdFxcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua3NwcmVhZFxcdFxcdFxcdGtzcFxcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua3dvcmRcXHRcXHRcXHRrd2Qga3d0XFxuYXBwbGljYXRpb24vdm5kLmtlbmFtZWFhcHBcXHRcXHRcXHRodGtlXFxuYXBwbGljYXRpb24vdm5kLmtpZHNwaXJhdGlvblxcdFxcdFxcdGtpYVxcbmFwcGxpY2F0aW9uL3ZuZC5raW5hclxcdFxcdFxcdFxcdGtuZSBrbnBcXG5hcHBsaWNhdGlvbi92bmQua29hblxcdFxcdFxcdFxcdHNrcCBza2Qgc2t0IHNrbVxcbmFwcGxpY2F0aW9uL3ZuZC5rb2Rhay1kZXNjcmlwdG9yXFx0XFx0c3NlXFxuYXBwbGljYXRpb24vdm5kLmxhcy5sYXMreG1sXFx0XFx0XFx0bGFzeG1sXFxuYXBwbGljYXRpb24vdm5kLmxsYW1hZ3JhcGhpY3MubGlmZS1iYWxhbmNlLmRlc2t0b3BcXHRsYmRcXG5hcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZXhjaGFuZ2UreG1sXFx0bGJlXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLTEtMi0zXFx0XFx0XFx0MTIzXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLWFwcHJvYWNoXFx0XFx0XFx0YXByXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLWZyZWVsYW5jZVxcdFxcdFxcdHByZVxcbmFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1ub3Rlc1xcdFxcdFxcdG5zZlxcbmFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1vcmdhbml6ZXJcXHRcXHRcXHRvcmdcXG5hcHBsaWNhdGlvbi92bmQubG90dXMtc2NyZWVuY2FtXFx0XFx0XFx0c2NtXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLXdvcmRwcm9cXHRcXHRcXHRsd3BcXG5hcHBsaWNhdGlvbi92bmQubWFjcG9ydHMucG9ydHBrZ1xcdFxcdHBvcnRwa2dcXG5hcHBsaWNhdGlvbi92bmQubWNkXFx0XFx0XFx0XFx0bWNkXFxuYXBwbGljYXRpb24vdm5kLm1lZGNhbGNkYXRhXFx0XFx0XFx0bWMxXFxuYXBwbGljYXRpb24vdm5kLm1lZGlhc3RhdGlvbi5jZGtleVxcdFxcdGNka2V5XFxuYXBwbGljYXRpb24vdm5kLm1mZXJcXHRcXHRcXHRcXHRtd2ZcXG5hcHBsaWNhdGlvbi92bmQubWZtcFxcdFxcdFxcdFxcdG1mbVxcbmFwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmZsb1xcdFxcdFxcdGZsb1xcbmFwcGxpY2F0aW9uL3ZuZC5taWNyb2dyYWZ4LmlneFxcdFxcdFxcdGlneFxcbmFwcGxpY2F0aW9uL3ZuZC5taWZcXHRcXHRcXHRcXHRtaWZcXG5hcHBsaWNhdGlvbi92bmQubW9iaXVzLmRhZlxcdFxcdFxcdGRhZlxcbmFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGlzXFx0XFx0XFx0ZGlzXFxuYXBwbGljYXRpb24vdm5kLm1vYml1cy5tYmtcXHRcXHRcXHRtYmtcXG5hcHBsaWNhdGlvbi92bmQubW9iaXVzLm1xeVxcdFxcdFxcdG1xeVxcbmFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXNsXFx0XFx0XFx0bXNsXFxuYXBwbGljYXRpb24vdm5kLm1vYml1cy5wbGNcXHRcXHRcXHRwbGNcXG5hcHBsaWNhdGlvbi92bmQubW9iaXVzLnR4ZlxcdFxcdFxcdHR4ZlxcbmFwcGxpY2F0aW9uL3ZuZC5tb3BodW4uYXBwbGljYXRpb25cXHRcXHRtcG5cXG5hcHBsaWNhdGlvbi92bmQubW9waHVuLmNlcnRpZmljYXRlXFx0XFx0bXBjXFxuYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbFxcdFxcdFxcdHh1bFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1hcnRnYWxyeVxcdFxcdFxcdGNpbFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1jYWItY29tcHJlc3NlZFxcdFxcdGNhYlxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbFxcdFxcdFxcdHhscyB4bG0geGxhIHhsYyB4bHQgeGx3XFxuYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLmFkZGluLm1hY3JvZW5hYmxlZC4xMlxcdFxcdHhsYW1cXG5hcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQuYmluYXJ5Lm1hY3JvZW5hYmxlZC4xMlxcdHhsc2JcXG5hcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuc2hlZXQubWFjcm9lbmFibGVkLjEyXFx0XFx0eGxzbVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTJcXHR4bHRtXFxuYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3RcXHRcXHRcXHRlb3RcXG5hcHBsaWNhdGlvbi92bmQubXMtaHRtbGhlbHBcXHRcXHRcXHRjaG1cXG5hcHBsaWNhdGlvbi92bmQubXMtaW1zXFx0XFx0XFx0XFx0aW1zXFxuYXBwbGljYXRpb24vdm5kLm1zLWxybVxcdFxcdFxcdFxcdGxybVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1vZmZpY2V0aGVtZVxcdFxcdFxcdHRobXhcXG5hcHBsaWNhdGlvbi92bmQubXMtcGtpLnNlY2NhdFxcdFxcdFxcdGNhdFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wa2kuc3RsXFx0XFx0XFx0c3RsXFxuYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnRcXHRcXHRcXHRwcHQgcHBzIHBvdFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LmFkZGluLm1hY3JvZW5hYmxlZC4xMlxcdFxcdHBwYW1cXG5hcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5wcmVzZW50YXRpb24ubWFjcm9lbmFibGVkLjEyXFx0cHB0bVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlLm1hY3JvZW5hYmxlZC4xMlxcdFxcdHNsZG1cXG5hcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludC5zbGlkZXNob3cubWFjcm9lbmFibGVkLjEyXFx0XFx0cHBzbVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMlxcdFxcdHBvdG1cXG5hcHBsaWNhdGlvbi92bmQubXMtcHJvamVjdFxcdFxcdFxcdG1wcCBtcHRcXG5hcHBsaWNhdGlvbi92bmQubXMtd29yZC5kb2N1bWVudC5tYWNyb2VuYWJsZWQuMTJcXHRkb2NtXFxuYXBwbGljYXRpb24vdm5kLm1zLXdvcmQudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyXFx0ZG90bVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy13b3Jrc1xcdFxcdFxcdHdwcyB3a3Mgd2NtIHdkYlxcbmFwcGxpY2F0aW9uL3ZuZC5tcy13cGxcXHRcXHRcXHRcXHR3cGxcXG5hcHBsaWNhdGlvbi92bmQubXMteHBzZG9jdW1lbnRcXHRcXHRcXHR4cHNcXG5hcHBsaWNhdGlvbi92bmQubXNlcVxcdFxcdFxcdFxcdG1zZXFcXG5hcHBsaWNhdGlvbi92bmQubXVzaWNpYW5cXHRcXHRcXHRtdXNcXG5hcHBsaWNhdGlvbi92bmQubXV2ZWUuc3R5bGVcXHRcXHRcXHRtc3R5XFxuYXBwbGljYXRpb24vdm5kLm15bmZjXFx0XFx0XFx0XFx0dGFnbGV0XFxuYXBwbGljYXRpb24vdm5kLm5ldXJvbGFuZ3VhZ2Uubmx1XFx0XFx0bmx1XFxuYXBwbGljYXRpb24vdm5kLm5pdGZcXHRcXHRcXHRcXHRudGYgbml0ZlxcbmFwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1kaXJlY3RvcnlcXHRcXHRubmRcXG5hcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtc2VhbGVyXFx0XFx0XFx0bm5zXFxuYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LXdlYlxcdFxcdFxcdG5ud1xcbmFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5uLWdhZ2UuZGF0YVxcdFxcdG5nZGF0XFxuYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5zeW1iaWFuLmluc3RhbGxcXHRuLWdhZ2VcXG5hcHBsaWNhdGlvbi92bmQubm9raWEucmFkaW8tcHJlc2V0XFx0XFx0cnBzdFxcbmFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXRzXFx0XFx0cnBzc1xcbmFwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZG1cXHRcXHRcXHRlZG1cXG5hcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZWR4XFx0XFx0XFx0ZWR4XFxuYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmV4dFxcdFxcdFxcdGV4dFxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuY2hhcnRcXHRcXHRvZGNcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmNoYXJ0LXRlbXBsYXRlXFx0b3RjXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5kYXRhYmFzZVxcdFxcdG9kYlxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZm9ybXVsYVxcdFxcdG9kZlxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZm9ybXVsYS10ZW1wbGF0ZVxcdG9kZnRcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmdyYXBoaWNzXFx0XFx0b2RnXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5ncmFwaGljcy10ZW1wbGF0ZVxcdG90Z1xcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuaW1hZ2VcXHRcXHRvZGlcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmltYWdlLXRlbXBsYXRlXFx0b3RpXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb25cXHRcXHRvZHBcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbi10ZW1wbGF0ZVxcdG90cFxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXRcXHRcXHRvZHNcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0LXRlbXBsYXRlXFx0b3RzXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0XFx0XFx0XFx0b2R0XFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LW1hc3RlclxcdFxcdG9kbVxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC10ZW1wbGF0ZVxcdG90dFxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dC13ZWJcXHRcXHRvdGhcXG5hcHBsaWNhdGlvbi92bmQub2xwYy1zdWdhclxcdFxcdFxcdHhvXFxuYXBwbGljYXRpb24vdm5kLm9tYS5kZDIreG1sXFx0XFx0XFx0ZGQyXFxuYXBwbGljYXRpb24vdm5kLm9wZW5vZmZpY2VvcmcuZXh0ZW5zaW9uXFx0XFx0b3h0XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvblxcdHBwdHhcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGVcXHRzbGR4XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnNsaWRlc2hvd1xcdHBwc3hcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwudGVtcGxhdGVcXHRwb3R4XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXRcXHR4bHN4XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwudGVtcGxhdGVcXHR4bHR4XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnRcXHRkb2N4XFxuYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwudGVtcGxhdGVcXHRkb3R4XFxuYXBwbGljYXRpb24vdm5kLm9zZ2VvLm1hcGd1aWRlLnBhY2thZ2VcXHRcXHRtZ3BcXG5hcHBsaWNhdGlvbi92bmQub3NnaS5kcFxcdFxcdFxcdFxcdGRwXFxuYXBwbGljYXRpb24vdm5kLm9zZ2kuc3Vic3lzdGVtXFx0XFx0XFx0ZXNhXFxuYXBwbGljYXRpb24vdm5kLnBhbG1cXHRcXHRcXHRcXHRwZGIgcHFhIG9wcmNcXG5hcHBsaWNhdGlvbi92bmQucGF3YWFmaWxlXFx0XFx0XFx0cGF3XFxuYXBwbGljYXRpb24vdm5kLnBnLmZvcm1hdFxcdFxcdFxcdHN0clxcbmFwcGxpY2F0aW9uL3ZuZC5wZy5vc2FzbGlcXHRcXHRcXHRlaTZcXG5hcHBsaWNhdGlvbi92bmQucGljc2VsXFx0XFx0XFx0XFx0ZWZpZlxcbmFwcGxpY2F0aW9uL3ZuZC5wbWkud2lkZ2V0XFx0XFx0XFx0d2dcXG5hcHBsaWNhdGlvbi92bmQucG9ja2V0bGVhcm5cXHRcXHRcXHRwbGZcXG5hcHBsaWNhdGlvbi92bmQucG93ZXJidWlsZGVyNlxcdFxcdFxcdHBiZFxcbmFwcGxpY2F0aW9uL3ZuZC5wcmV2aWV3c3lzdGVtcy5ib3hcXHRcXHRib3hcXG5hcHBsaWNhdGlvbi92bmQucHJvdGV1cy5tYWdhemluZVxcdFxcdG1nelxcbmFwcGxpY2F0aW9uL3ZuZC5wdWJsaXNoYXJlLWRlbHRhLXRyZWVcXHRcXHRxcHNcXG5hcHBsaWNhdGlvbi92bmQucHZpLnB0aWQxXFx0XFx0XFx0cHRpZFxcbmFwcGxpY2F0aW9uL3ZuZC5xdWFyay5xdWFya3hwcmVzc1xcdFxcdHF4ZCBxeHQgcXdkIHF3dCBxeGwgcXhiXFxuYXBwbGljYXRpb24vdm5kLnJlYWx2bmMuYmVkXFx0XFx0XFx0YmVkXFxuYXBwbGljYXRpb24vdm5kLnJlY29yZGFyZS5tdXNpY3htbFxcdFxcdG14bFxcbmFwcGxpY2F0aW9uL3ZuZC5yZWNvcmRhcmUubXVzaWN4bWwreG1sXFx0XFx0bXVzaWN4bWxcXG5hcHBsaWNhdGlvbi92bmQucmlnLmNyeXB0b25vdGVcXHRcXHRcXHRjcnlwdG9ub3RlXFxuYXBwbGljYXRpb24vdm5kLnJpbS5jb2RcXHRcXHRcXHRcXHRjb2RcXG5hcHBsaWNhdGlvbi92bmQucm4tcmVhbG1lZGlhXFx0XFx0XFx0cm1cXG5hcHBsaWNhdGlvbi92bmQucm4tcmVhbG1lZGlhLXZiclxcdFxcdHJtdmJcXG5hcHBsaWNhdGlvbi92bmQucm91dGU2Ni5saW5rNjYreG1sXFx0XFx0bGluazY2XFxuYXBwbGljYXRpb24vdm5kLnNhaWxpbmd0cmFja2VyLnRyYWNrXFx0XFx0c3RcXG5hcHBsaWNhdGlvbi92bmQuc2VlbWFpbFxcdFxcdFxcdFxcdHNlZVxcbmFwcGxpY2F0aW9uL3ZuZC5zZW1hXFx0XFx0XFx0XFx0c2VtYVxcbmFwcGxpY2F0aW9uL3ZuZC5zZW1kXFx0XFx0XFx0XFx0c2VtZFxcbmFwcGxpY2F0aW9uL3ZuZC5zZW1mXFx0XFx0XFx0XFx0c2VtZlxcbmFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5mb3JtZGF0YVxcdFxcdGlmbVxcbmFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5mb3JtdGVtcGxhdGVcXHRpdHBcXG5hcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQuaW50ZXJjaGFuZ2VcXHRpaWZcXG5hcHBsaWNhdGlvbi92bmQuc2hhbmEuaW5mb3JtZWQucGFja2FnZVxcdFxcdGlwa1xcbmFwcGxpY2F0aW9uL3ZuZC5zaW10ZWNoLW1pbmRtYXBwZXJcXHRcXHR0d2QgdHdkc1xcbmFwcGxpY2F0aW9uL3ZuZC5zbWFmXFx0XFx0XFx0XFx0bW1mXFxuYXBwbGljYXRpb24vdm5kLnNtYXJ0LnRlYWNoZXJcXHRcXHRcXHR0ZWFjaGVyXFxuYXBwbGljYXRpb24vdm5kLnNvbGVudC5zZGttK3htbFxcdFxcdFxcdHNka20gc2RrZFxcbmFwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5keHBcXHRcXHRcXHRkeHBcXG5hcHBsaWNhdGlvbi92bmQuc3BvdGZpcmUuc2ZzXFx0XFx0XFx0c2ZzXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5jYWxjXFx0XFx0c2RjXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5kcmF3XFx0XFx0c2RhXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5pbXByZXNzXFx0XFx0c2RkXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi5tYXRoXFx0XFx0c21mXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXJcXHRcXHRzZHcgdm9yXFxuYXBwbGljYXRpb24vdm5kLnN0YXJkaXZpc2lvbi53cml0ZXItZ2xvYmFsXFx0c2dsXFxuYXBwbGljYXRpb24vdm5kLnN0ZXBtYW5pYS5wYWNrYWdlXFx0XFx0c216aXBcXG5hcHBsaWNhdGlvbi92bmQuc3RlcG1hbmlhLnN0ZXBjaGFydFxcdFxcdHNtXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsY1xcdFxcdFxcdHN4Y1xcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmNhbGMudGVtcGxhdGVcXHRcXHRzdGNcXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3XFx0XFx0XFx0c3hkXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwuZHJhdy50ZW1wbGF0ZVxcdFxcdHN0ZFxcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmltcHJlc3NcXHRcXHRcXHRzeGlcXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5pbXByZXNzLnRlbXBsYXRlXFx0c3RpXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwubWF0aFxcdFxcdFxcdHN4bVxcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlclxcdFxcdFxcdHN4d1xcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci5nbG9iYWxcXHRcXHRzeGdcXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC53cml0ZXIudGVtcGxhdGVcXHRcXHRzdHdcXG5hcHBsaWNhdGlvbi92bmQuc3VzLWNhbGVuZGFyXFx0XFx0XFx0c3VzIHN1c3BcXG5hcHBsaWNhdGlvbi92bmQuc3ZkXFx0XFx0XFx0XFx0c3ZkXFxuYXBwbGljYXRpb24vdm5kLnN5bWJpYW4uaW5zdGFsbFxcdFxcdFxcdHNpcyBzaXN4XFxuYXBwbGljYXRpb24vdm5kLnN5bmNtbCt4bWxcXHRcXHRcXHR4c21cXG5hcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3dieG1sXFx0XFx0XFx0YmRtXFxuYXBwbGljYXRpb24vdm5kLnN5bmNtbC5kbSt4bWxcXHRcXHRcXHR4ZG1cXG5hcHBsaWNhdGlvbi92bmQudGFvLmludGVudC1tb2R1bGUtYXJjaGl2ZVxcdHRhb1xcbmFwcGxpY2F0aW9uL3ZuZC50Y3BkdW1wLnBjYXBcXHRcXHRcXHRwY2FwIGNhcCBkbXBcXG5hcHBsaWNhdGlvbi92bmQudG1vYmlsZS1saXZldHZcXHRcXHRcXHR0bW9cXG5hcHBsaWNhdGlvbi92bmQudHJpZC50cHRcXHRcXHRcXHR0cHRcXG5hcHBsaWNhdGlvbi92bmQudHJpc2NhcGUubXhzXFx0XFx0XFx0bXhzXFxuYXBwbGljYXRpb24vdm5kLnRydWVhcHBcXHRcXHRcXHRcXHR0cmFcXG5hcHBsaWNhdGlvbi92bmQudWZkbFxcdFxcdFxcdFxcdHVmZCB1ZmRsXFxuYXBwbGljYXRpb24vdm5kLnVpcS50aGVtZVxcdFxcdFxcdHV0elxcbmFwcGxpY2F0aW9uL3ZuZC51bWFqaW5cXHRcXHRcXHRcXHR1bWpcXG5hcHBsaWNhdGlvbi92bmQudW5pdHlcXHRcXHRcXHRcXHR1bml0eXdlYlxcbmFwcGxpY2F0aW9uL3ZuZC51b21sK3htbFxcdFxcdFxcdHVvbWxcXG5hcHBsaWNhdGlvbi92bmQudmN4XFx0XFx0XFx0XFx0dmN4XFxuYXBwbGljYXRpb24vdm5kLnZpc2lvXFx0XFx0XFx0XFx0dnNkIHZzdCB2c3MgdnN3XFxuYXBwbGljYXRpb24vdm5kLnZpc2lvbmFyeVxcdFxcdFxcdHZpc1xcbmFwcGxpY2F0aW9uL3ZuZC52c2ZcXHRcXHRcXHRcXHR2c2ZcXG5hcHBsaWNhdGlvbi92bmQud2FwLndieG1sXFx0XFx0XFx0d2J4bWxcXG5hcHBsaWNhdGlvbi92bmQud2FwLndtbGNcXHRcXHRcXHR3bWxjXFxuYXBwbGljYXRpb24vdm5kLndhcC53bWxzY3JpcHRjXFx0XFx0XFx0d21sc2NcXG5hcHBsaWNhdGlvbi92bmQud2VidHVyYm9cXHRcXHRcXHR3dGJcXG5hcHBsaWNhdGlvbi92bmQud29sZnJhbS5wbGF5ZXJcXHRcXHRcXHRuYnBcXG5hcHBsaWNhdGlvbi92bmQud29yZHBlcmZlY3RcXHRcXHRcXHR3cGRcXG5hcHBsaWNhdGlvbi92bmQud3FkXFx0XFx0XFx0XFx0d3FkXFxuYXBwbGljYXRpb24vdm5kLnd0LnN0ZlxcdFxcdFxcdFxcdHN0ZlxcbmFwcGxpY2F0aW9uL3ZuZC54YXJhXFx0XFx0XFx0XFx0eGFyXFxuYXBwbGljYXRpb24vdm5kLnhmZGxcXHRcXHRcXHRcXHR4ZmRsXFxuYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi1kaWNcXHRcXHRcXHRodmRcXG5hcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LXNjcmlwdFxcdFxcdGh2c1xcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtdm9pY2VcXHRcXHRcXHRodnBcXG5hcHBsaWNhdGlvbi92bmQueWFtYWhhLm9wZW5zY29yZWZvcm1hdFxcdFxcdFxcdG9zZlxcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEub3BlbnNjb3JlZm9ybWF0Lm9zZnB2Zyt4bWxcXHRvc2ZwdmdcXG5hcHBsaWNhdGlvbi92bmQueWFtYWhhLnNtYWYtYXVkaW9cXHRcXHRzYWZcXG5hcHBsaWNhdGlvbi92bmQueWFtYWhhLnNtYWYtcGhyYXNlXFx0XFx0c3BmXFxuYXBwbGljYXRpb24vdm5kLnllbGxvd3JpdmVyLWN1c3RvbS1tZW51XFx0XFx0Y21wXFxuYXBwbGljYXRpb24vdm5kLnp1bFxcdFxcdFxcdFxcdHppciB6aXJ6XFxuYXBwbGljYXRpb24vdm5kLnp6YXp6LmRlY2sreG1sXFx0XFx0XFx0emF6XFxuYXBwbGljYXRpb24vdm9pY2V4bWwreG1sXFx0XFx0XFx0dnhtbFxcbmFwcGxpY2F0aW9uL3dpZGdldFxcdFxcdFxcdFxcdHdndFxcbmFwcGxpY2F0aW9uL3dpbmhscFxcdFxcdFxcdFxcdGhscFxcbmFwcGxpY2F0aW9uL3dzZGwreG1sXFx0XFx0XFx0XFx0d3NkbFxcbmFwcGxpY2F0aW9uL3dzcG9saWN5K3htbFxcdFxcdFxcdHdzcG9saWN5XFxuYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkXFx0XFx0XFx0N3pcXG5hcHBsaWNhdGlvbi94LWFiaXdvcmRcXHRcXHRcXHRcXHRhYndcXG5hcHBsaWNhdGlvbi94LWFjZS1jb21wcmVzc2VkXFx0XFx0XFx0YWNlXFxuYXBwbGljYXRpb24veC1hcHBsZS1kaXNraW1hZ2VcXHRcXHRcXHRkbWdcXG5hcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtYmluXFx0XFx0XFx0YWFiIHgzMiB1MzIgdm94XFxuYXBwbGljYXRpb24veC1hdXRob3J3YXJlLW1hcFxcdFxcdFxcdGFhbVxcbmFwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1zZWdcXHRcXHRcXHRhYXNcXG5hcHBsaWNhdGlvbi94LWJjcGlvXFx0XFx0XFx0XFx0YmNwaW9cXG5hcHBsaWNhdGlvbi94LWJpdHRvcnJlbnRcXHRcXHRcXHR0b3JyZW50XFxuYXBwbGljYXRpb24veC1ibG9yYlxcdFxcdFxcdFxcdGJsYiBibG9yYlxcbmFwcGxpY2F0aW9uL3gtYnppcFxcdFxcdFxcdFxcdGJ6XFxuYXBwbGljYXRpb24veC1iemlwMlxcdFxcdFxcdFxcdGJ6MiBib3pcXG5hcHBsaWNhdGlvbi94LWNiclxcdFxcdFxcdFxcdGNiciBjYmEgY2J0IGNieiBjYjdcXG5hcHBsaWNhdGlvbi94LWNkbGlua1xcdFxcdFxcdFxcdHZjZFxcbmFwcGxpY2F0aW9uL3gtY2ZzLWNvbXByZXNzZWRcXHRcXHRcXHRjZnNcXG5hcHBsaWNhdGlvbi94LWNoYXRcXHRcXHRcXHRcXHRjaGF0XFxuYXBwbGljYXRpb24veC1jaGVzcy1wZ25cXHRcXHRcXHRcXHRwZ25cXG5hcHBsaWNhdGlvbi94LWNvbmZlcmVuY2VcXHRcXHRcXHRuc2NcXG5hcHBsaWNhdGlvbi94LWNwaW9cXHRcXHRcXHRcXHRjcGlvXFxuYXBwbGljYXRpb24veC1jc2hcXHRcXHRcXHRcXHRjc2hcXG5hcHBsaWNhdGlvbi94LWRlYmlhbi1wYWNrYWdlXFx0XFx0XFx0ZGViIHVkZWJcXG5hcHBsaWNhdGlvbi94LWRnYy1jb21wcmVzc2VkXFx0XFx0XFx0ZGdjXFxuYXBwbGljYXRpb24veC1kaXJlY3RvclxcdFxcdFxcdGRpciBkY3IgZHhyIGNzdCBjY3QgY3h0IHczZCBmZ2Qgc3dhXFxuYXBwbGljYXRpb24veC1kb29tXFx0XFx0XFx0XFx0d2FkXFxuYXBwbGljYXRpb24veC1kdGJuY3greG1sXFx0XFx0XFx0bmN4XFxuYXBwbGljYXRpb24veC1kdGJvb2sreG1sXFx0XFx0XFx0ZHRiXFxuYXBwbGljYXRpb24veC1kdGJyZXNvdXJjZSt4bWxcXHRcXHRcXHRyZXNcXG5hcHBsaWNhdGlvbi94LWR2aVxcdFxcdFxcdFxcdGR2aVxcbmFwcGxpY2F0aW9uL3gtZW52b3lcXHRcXHRcXHRcXHRldnlcXG5hcHBsaWNhdGlvbi94LWV2YVxcdFxcdFxcdFxcdGV2YVxcbmFwcGxpY2F0aW9uL3gtZm9udC1iZGZcXHRcXHRcXHRcXHRiZGZcXG5hcHBsaWNhdGlvbi94LWZvbnQtZ2hvc3RzY3JpcHRcXHRcXHRcXHRnc2ZcXG5hcHBsaWNhdGlvbi94LWZvbnQtbGludXgtcHNmXFx0XFx0XFx0cHNmXFxuYXBwbGljYXRpb24veC1mb250LXBjZlxcdFxcdFxcdFxcdHBjZlxcbmFwcGxpY2F0aW9uL3gtZm9udC1zbmZcXHRcXHRcXHRcXHRzbmZcXG5hcHBsaWNhdGlvbi94LWZvbnQtdHlwZTFcXHRcXHRcXHRwZmEgcGZiIHBmbSBhZm1cXG5hcHBsaWNhdGlvbi94LWZyZWVhcmNcXHRcXHRcXHRcXHRhcmNcXG5hcHBsaWNhdGlvbi94LWZ1dHVyZXNwbGFzaFxcdFxcdFxcdHNwbFxcbmFwcGxpY2F0aW9uL3gtZ2NhLWNvbXByZXNzZWRcXHRcXHRcXHRnY2FcXG5hcHBsaWNhdGlvbi94LWdsdWx4XFx0XFx0XFx0XFx0dWx4XFxuYXBwbGljYXRpb24veC1nbnVtZXJpY1xcdFxcdFxcdFxcdGdudW1lcmljXFxuYXBwbGljYXRpb24veC1ncmFtcHMteG1sXFx0XFx0XFx0Z3JhbXBzXFxuYXBwbGljYXRpb24veC1ndGFyXFx0XFx0XFx0XFx0Z3RhclxcbmFwcGxpY2F0aW9uL3gtaGRmXFx0XFx0XFx0XFx0aGRmXFxuYXBwbGljYXRpb24veC1pbnN0YWxsLWluc3RydWN0aW9uc1xcdFxcdGluc3RhbGxcXG5hcHBsaWNhdGlvbi94LWlzbzk2NjAtaW1hZ2VcXHRcXHRcXHRpc29cXG5hcHBsaWNhdGlvbi94LWphdmEtam5scC1maWxlXFx0XFx0XFx0am5scFxcbmFwcGxpY2F0aW9uL3gtbGF0ZXhcXHRcXHRcXHRcXHRsYXRleFxcbmFwcGxpY2F0aW9uL3gtbHpoLWNvbXByZXNzZWRcXHRcXHRcXHRsemggbGhhXFxuYXBwbGljYXRpb24veC1taWVcXHRcXHRcXHRcXHRtaWVcXG5hcHBsaWNhdGlvbi94LW1vYmlwb2NrZXQtZWJvb2tcXHRcXHRcXHRwcmMgbW9iaVxcbmFwcGxpY2F0aW9uL3gtbXMtYXBwbGljYXRpb25cXHRcXHRcXHRhcHBsaWNhdGlvblxcbmFwcGxpY2F0aW9uL3gtbXMtc2hvcnRjdXRcXHRcXHRcXHRsbmtcXG5hcHBsaWNhdGlvbi94LW1zLXdtZFxcdFxcdFxcdFxcdHdtZFxcbmFwcGxpY2F0aW9uL3gtbXMtd216XFx0XFx0XFx0XFx0d216XFxuYXBwbGljYXRpb24veC1tcy14YmFwXFx0XFx0XFx0XFx0eGJhcFxcbmFwcGxpY2F0aW9uL3gtbXNhY2Nlc3NcXHRcXHRcXHRcXHRtZGJcXG5hcHBsaWNhdGlvbi94LW1zYmluZGVyXFx0XFx0XFx0XFx0b2JkXFxuYXBwbGljYXRpb24veC1tc2NhcmRmaWxlXFx0XFx0XFx0Y3JkXFxuYXBwbGljYXRpb24veC1tc2NsaXBcXHRcXHRcXHRcXHRjbHBcXG5hcHBsaWNhdGlvbi94LW1zZG93bmxvYWRcXHRcXHRcXHRleGUgZGxsIGNvbSBiYXQgbXNpXFxuYXBwbGljYXRpb24veC1tc21lZGlhdmlld1xcdFxcdFxcdG12YiBtMTMgbTE0XFxuYXBwbGljYXRpb24veC1tc21ldGFmaWxlXFx0XFx0XFx0d21mIHdteiBlbWYgZW16XFxuYXBwbGljYXRpb24veC1tc21vbmV5XFx0XFx0XFx0XFx0bW55XFxuYXBwbGljYXRpb24veC1tc3B1Ymxpc2hlclxcdFxcdFxcdHB1YlxcbmFwcGxpY2F0aW9uL3gtbXNzY2hlZHVsZVxcdFxcdFxcdHNjZFxcbmFwcGxpY2F0aW9uL3gtbXN0ZXJtaW5hbFxcdFxcdFxcdHRybVxcbmFwcGxpY2F0aW9uL3gtbXN3cml0ZVxcdFxcdFxcdFxcdHdyaVxcbmFwcGxpY2F0aW9uL3gtbmV0Y2RmXFx0XFx0XFx0XFx0bmMgY2RmXFxuYXBwbGljYXRpb24veC1uemJcXHRcXHRcXHRcXHRuemJcXG5hcHBsaWNhdGlvbi94LXBrY3MxMlxcdFxcdFxcdFxcdHAxMiBwZnhcXG5hcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRpZmljYXRlc1xcdFxcdHA3YiBzcGNcXG5hcHBsaWNhdGlvbi94LXBrY3M3LWNlcnRyZXFyZXNwXFx0XFx0XFx0cDdyXFxuYXBwbGljYXRpb24veC1yYXItY29tcHJlc3NlZFxcdFxcdFxcdHJhclxcbmFwcGxpY2F0aW9uL3gtcmVzZWFyY2gtaW5mby1zeXN0ZW1zXFx0XFx0cmlzXFxuYXBwbGljYXRpb24veC1zaFxcdFxcdFxcdFxcdHNoXFxuYXBwbGljYXRpb24veC1zaGFyXFx0XFx0XFx0XFx0c2hhclxcbmFwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoXFx0XFx0XFx0c3dmXFxuYXBwbGljYXRpb24veC1zaWx2ZXJsaWdodC1hcHBcXHRcXHRcXHR4YXBcXG5hcHBsaWNhdGlvbi94LXNxbFxcdFxcdFxcdFxcdHNxbFxcbmFwcGxpY2F0aW9uL3gtc3R1ZmZpdFxcdFxcdFxcdFxcdHNpdFxcbmFwcGxpY2F0aW9uL3gtc3R1ZmZpdHhcXHRcXHRcXHRcXHRzaXR4XFxuYXBwbGljYXRpb24veC1zdWJyaXBcXHRcXHRcXHRcXHRzcnRcXG5hcHBsaWNhdGlvbi94LXN2NGNwaW9cXHRcXHRcXHRcXHRzdjRjcGlvXFxuYXBwbGljYXRpb24veC1zdjRjcmNcXHRcXHRcXHRcXHRzdjRjcmNcXG5hcHBsaWNhdGlvbi94LXQzdm0taW1hZ2VcXHRcXHRcXHR0M1xcbmFwcGxpY2F0aW9uL3gtdGFkc1xcdFxcdFxcdFxcdGdhbVxcbmFwcGxpY2F0aW9uL3gtdGFyXFx0XFx0XFx0XFx0dGFyXFxuYXBwbGljYXRpb24veC10Y2xcXHRcXHRcXHRcXHR0Y2xcXG5hcHBsaWNhdGlvbi94LXRleFxcdFxcdFxcdFxcdHRleFxcbmFwcGxpY2F0aW9uL3gtdGV4LXRmbVxcdFxcdFxcdFxcdHRmbVxcbmFwcGxpY2F0aW9uL3gtdGV4aW5mb1xcdFxcdFxcdFxcdHRleGluZm8gdGV4aVxcbmFwcGxpY2F0aW9uL3gtdGdpZlxcdFxcdFxcdFxcdG9ialxcbmFwcGxpY2F0aW9uL3gtdXN0YXJcXHRcXHRcXHRcXHR1c3RhclxcbmFwcGxpY2F0aW9uL3gtd2Fpcy1zb3VyY2VcXHRcXHRcXHRzcmNcXG5hcHBsaWNhdGlvbi94LXg1MDktY2EtY2VydFxcdFxcdFxcdGRlciBjcnRcXG5hcHBsaWNhdGlvbi94LXhmaWdcXHRcXHRcXHRcXHRmaWdcXG5hcHBsaWNhdGlvbi94LXhsaWZmK3htbFxcdFxcdFxcdFxcdHhsZlxcbmFwcGxpY2F0aW9uL3gteHBpbnN0YWxsXFx0XFx0XFx0XFx0eHBpXFxuYXBwbGljYXRpb24veC14elxcdFxcdFxcdFxcdHh6XFxuYXBwbGljYXRpb24veC16bWFjaGluZVxcdFxcdFxcdFxcdHoxIHoyIHozIHo0IHo1IHo2IHo3IHo4XFxuYXBwbGljYXRpb24veGFtbCt4bWxcXHRcXHRcXHRcXHR4YW1sXFxuYXBwbGljYXRpb24veGNhcC1kaWZmK3htbFxcdFxcdFxcdHhkZlxcbmFwcGxpY2F0aW9uL3hlbmMreG1sXFx0XFx0XFx0XFx0eGVuY1xcbmFwcGxpY2F0aW9uL3hodG1sK3htbFxcdFxcdFxcdFxcdHhodG1sIHhodFxcbmFwcGxpY2F0aW9uL3htbFxcdFxcdFxcdFxcdFxcdHhtbCB4c2xcXG5hcHBsaWNhdGlvbi94bWwtZHRkXFx0XFx0XFx0XFx0ZHRkXFxuYXBwbGljYXRpb24veG9wK3htbFxcdFxcdFxcdFxcdHhvcFxcbmFwcGxpY2F0aW9uL3hwcm9jK3htbFxcdFxcdFxcdFxcdHhwbFxcbmFwcGxpY2F0aW9uL3hzbHQreG1sXFx0XFx0XFx0XFx0eHNsdFxcbmFwcGxpY2F0aW9uL3hzcGYreG1sXFx0XFx0XFx0XFx0eHNwZlxcbmFwcGxpY2F0aW9uL3h2K3htbFxcdFxcdFxcdFxcdG14bWwgeGh2bWwgeHZtbCB4dm1cXG5hcHBsaWNhdGlvbi95YW5nXFx0XFx0XFx0XFx0eWFuZ1xcbmFwcGxpY2F0aW9uL3lpbit4bWxcXHRcXHRcXHRcXHR5aW5cXG5hcHBsaWNhdGlvbi96aXBcXHRcXHRcXHRcXHRcXHR6aXBcXG5hdWRpby9hZHBjbVxcdFxcdFxcdFxcdFxcdGFkcFxcbmF1ZGlvL2Jhc2ljXFx0XFx0XFx0XFx0XFx0YXUgc25kXFxuYXVkaW8vbWlkaVxcdFxcdFxcdFxcdFxcdG1pZCBtaWRpIGthciBybWlcXG5hdWRpby9tcDRcXHRcXHRcXHRcXHRcXHRtNGEgbXA0YVxcbmF1ZGlvL21wZWdcXHRcXHRcXHRcXHRcXHRtcGdhIG1wMiBtcDJhIG1wMyBtMmEgbTNhXFxuYXVkaW8vb2dnXFx0XFx0XFx0XFx0XFx0b2dhIG9nZyBzcHhcXG5hdWRpby9zM21cXHRcXHRcXHRcXHRcXHRzM21cXG5hdWRpby9zaWxrXFx0XFx0XFx0XFx0XFx0c2lsXFxuYXVkaW8vdm5kLmRlY2UuYXVkaW9cXHRcXHRcXHRcXHR1dmEgdXZ2YVxcbmF1ZGlvL3ZuZC5kaWdpdGFsLXdpbmRzXFx0XFx0XFx0XFx0ZW9sXFxuYXVkaW8vdm5kLmRyYVxcdFxcdFxcdFxcdFxcdGRyYVxcbmF1ZGlvL3ZuZC5kdHNcXHRcXHRcXHRcXHRcXHRkdHNcXG5hdWRpby92bmQuZHRzLmhkXFx0XFx0XFx0XFx0ZHRzaGRcXG5hdWRpby92bmQubHVjZW50LnZvaWNlXFx0XFx0XFx0XFx0bHZwXFxuYXVkaW8vdm5kLm1zLXBsYXlyZWFkeS5tZWRpYS5weWFcXHRcXHRweWFcXG5hdWRpby92bmQubnVlcmEuZWNlbHA0ODAwXFx0XFx0XFx0ZWNlbHA0ODAwXFxuYXVkaW8vdm5kLm51ZXJhLmVjZWxwNzQ3MFxcdFxcdFxcdGVjZWxwNzQ3MFxcbmF1ZGlvL3ZuZC5udWVyYS5lY2VscDk2MDBcXHRcXHRcXHRlY2VscDk2MDBcXG5hdWRpby92bmQucmlwXFx0XFx0XFx0XFx0XFx0cmlwXFxuYXVkaW8vd2VibVxcdFxcdFxcdFxcdFxcdHdlYmFcXG5hdWRpby94LWFhY1xcdFxcdFxcdFxcdFxcdGFhY1xcbmF1ZGlvL3gtYWlmZlxcdFxcdFxcdFxcdFxcdGFpZiBhaWZmIGFpZmNcXG5hdWRpby94LWNhZlxcdFxcdFxcdFxcdFxcdGNhZlxcbmF1ZGlvL3gtZmxhY1xcdFxcdFxcdFxcdFxcdGZsYWNcXG5hdWRpby94LW1hdHJvc2thXFx0XFx0XFx0XFx0bWthXFxuYXVkaW8veC1tcGVndXJsXFx0XFx0XFx0XFx0XFx0bTN1XFxuYXVkaW8veC1tcy13YXhcXHRcXHRcXHRcXHRcXHR3YXhcXG5hdWRpby94LW1zLXdtYVxcdFxcdFxcdFxcdFxcdHdtYVxcbmF1ZGlvL3gtcG4tcmVhbGF1ZGlvXFx0XFx0XFx0XFx0cmFtIHJhXFxuYXVkaW8veC1wbi1yZWFsYXVkaW8tcGx1Z2luXFx0XFx0XFx0cm1wXFxuYXVkaW8veC13YXZcXHRcXHRcXHRcXHRcXHR3YXZcXG5hdWRpby94bVxcdFxcdFxcdFxcdFxcdHhtXFxuY2hlbWljYWwveC1jZHhcXHRcXHRcXHRcXHRcXHRjZHhcXG5jaGVtaWNhbC94LWNpZlxcdFxcdFxcdFxcdFxcdGNpZlxcbmNoZW1pY2FsL3gtY21kZlxcdFxcdFxcdFxcdFxcdGNtZGZcXG5jaGVtaWNhbC94LWNtbFxcdFxcdFxcdFxcdFxcdGNtbFxcbmNoZW1pY2FsL3gtY3NtbFxcdFxcdFxcdFxcdFxcdGNzbWxcXG5jaGVtaWNhbC94LXh5elxcdFxcdFxcdFxcdFxcdHh5elxcbmZvbnQvY29sbGVjdGlvblxcdFxcdFxcdFxcdFxcdHR0Y1xcbmZvbnQvb3RmXFx0XFx0XFx0XFx0XFx0b3RmXFxuZm9udC90dGZcXHRcXHRcXHRcXHRcXHR0dGZcXG5mb250L3dvZmZcXHRcXHRcXHRcXHRcXHR3b2ZmXFxuZm9udC93b2ZmMlxcdFxcdFxcdFxcdFxcdHdvZmYyXFxuaW1hZ2UvYm1wXFx0XFx0XFx0XFx0XFx0Ym1wXFxuaW1hZ2UvY2dtXFx0XFx0XFx0XFx0XFx0Y2dtXFxuaW1hZ2UvZzNmYXhcXHRcXHRcXHRcXHRcXHRnM1xcbmltYWdlL2dpZlxcdFxcdFxcdFxcdFxcdGdpZlxcbmltYWdlL2llZlxcdFxcdFxcdFxcdFxcdGllZlxcbmltYWdlL2pwZWdcXHRcXHRcXHRcXHRcXHRqcGVnIGpwZyBqcGVcXG5pbWFnZS9rdHhcXHRcXHRcXHRcXHRcXHRrdHhcXG5pbWFnZS9wbmdcXHRcXHRcXHRcXHRcXHRwbmdcXG5pbWFnZS9wcnMuYnRpZlxcdFxcdFxcdFxcdFxcdGJ0aWZcXG5pbWFnZS9zZ2lcXHRcXHRcXHRcXHRcXHRzZ2lcXG5pbWFnZS9zdmcreG1sXFx0XFx0XFx0XFx0XFx0c3ZnIHN2Z3pcXG5pbWFnZS90aWZmXFx0XFx0XFx0XFx0XFx0dGlmZiB0aWZcXG5pbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wXFx0XFx0XFx0cHNkXFxuaW1hZ2Uvdm5kLmRlY2UuZ3JhcGhpY1xcdFxcdFxcdFxcdHV2aSB1dnZpIHV2ZyB1dnZnXFxuaW1hZ2Uvdm5kLmRqdnVcXHRcXHRcXHRcXHRcXHRkanZ1IGRqdlxcbmltYWdlL3ZuZC5kdmIuc3VidGl0bGVcXHRcXHRcXHRcXHRzdWJcXG5pbWFnZS92bmQuZHdnXFx0XFx0XFx0XFx0XFx0ZHdnXFxuaW1hZ2Uvdm5kLmR4ZlxcdFxcdFxcdFxcdFxcdGR4ZlxcbmltYWdlL3ZuZC5mYXN0Ymlkc2hlZXRcXHRcXHRcXHRcXHRmYnNcXG5pbWFnZS92bmQuZnB4XFx0XFx0XFx0XFx0XFx0ZnB4XFxuaW1hZ2Uvdm5kLmZzdFxcdFxcdFxcdFxcdFxcdGZzdFxcbmltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLW1tclxcdFxcdFxcdG1tclxcbmltYWdlL3ZuZC5mdWppeGVyb3guZWRtaWNzLXJsY1xcdFxcdFxcdHJsY1xcbmltYWdlL3ZuZC5tcy1tb2RpXFx0XFx0XFx0XFx0bWRpXFxuaW1hZ2Uvdm5kLm1zLXBob3RvXFx0XFx0XFx0XFx0d2RwXFxuaW1hZ2Uvdm5kLm5ldC1mcHhcXHRcXHRcXHRcXHRucHhcXG5pbWFnZS92bmQud2FwLndibXBcXHRcXHRcXHRcXHR3Ym1wXFxuaW1hZ2Uvdm5kLnhpZmZcXHRcXHRcXHRcXHRcXHR4aWZcXG5pbWFnZS93ZWJwXFx0XFx0XFx0XFx0XFx0d2VicFxcbmltYWdlL3gtM2RzXFx0XFx0XFx0XFx0XFx0M2RzXFxuaW1hZ2UveC1jbXUtcmFzdGVyXFx0XFx0XFx0XFx0cmFzXFxuaW1hZ2UveC1jbXhcXHRcXHRcXHRcXHRcXHRjbXhcXG5pbWFnZS94LWZyZWVoYW5kXFx0XFx0XFx0XFx0ZmggZmhjIGZoNCBmaDUgZmg3XFxuaW1hZ2UveC1pY29uXFx0XFx0XFx0XFx0XFx0aWNvXFxuaW1hZ2UveC1tcnNpZC1pbWFnZVxcdFxcdFxcdFxcdHNpZFxcbmltYWdlL3gtcGN4XFx0XFx0XFx0XFx0XFx0cGN4XFxuaW1hZ2UveC1waWN0XFx0XFx0XFx0XFx0XFx0cGljIHBjdFxcbmltYWdlL3gtcG9ydGFibGUtYW55bWFwXFx0XFx0XFx0XFx0cG5tXFxuaW1hZ2UveC1wb3J0YWJsZS1iaXRtYXBcXHRcXHRcXHRcXHRwYm1cXG5pbWFnZS94LXBvcnRhYmxlLWdyYXltYXBcXHRcXHRcXHRwZ21cXG5pbWFnZS94LXBvcnRhYmxlLXBpeG1hcFxcdFxcdFxcdFxcdHBwbVxcbmltYWdlL3gtcmdiXFx0XFx0XFx0XFx0XFx0cmdiXFxuaW1hZ2UveC10Z2FcXHRcXHRcXHRcXHRcXHR0Z2FcXG5pbWFnZS94LXhiaXRtYXBcXHRcXHRcXHRcXHRcXHR4Ym1cXG5pbWFnZS94LXhwaXhtYXBcXHRcXHRcXHRcXHRcXHR4cG1cXG5pbWFnZS94LXh3aW5kb3dkdW1wXFx0XFx0XFx0XFx0eHdkXFxubWVzc2FnZS9yZmM4MjJcXHRcXHRcXHRcXHRcXHRlbWwgbWltZVxcbm1vZGVsL2lnZXNcXHRcXHRcXHRcXHRcXHRpZ3MgaWdlc1xcbm1vZGVsL21lc2hcXHRcXHRcXHRcXHRcXHRtc2ggbWVzaCBzaWxvXFxubW9kZWwvdm5kLmNvbGxhZGEreG1sXFx0XFx0XFx0XFx0ZGFlXFxubW9kZWwvdm5kLmR3ZlxcdFxcdFxcdFxcdFxcdGR3Zlxcbm1vZGVsL3ZuZC5nZGxcXHRcXHRcXHRcXHRcXHRnZGxcXG5tb2RlbC92bmQuZ3R3XFx0XFx0XFx0XFx0XFx0Z3R3XFxubW9kZWwvdm5kLm10c1xcdFxcdFxcdFxcdFxcdG10c1xcbm1vZGVsL3ZuZC52dHVcXHRcXHRcXHRcXHRcXHR2dHVcXG5tb2RlbC92cm1sXFx0XFx0XFx0XFx0XFx0d3JsIHZybWxcXG5tb2RlbC94M2QrYmluYXJ5XFx0XFx0XFx0XFx0eDNkYiB4M2Rielxcbm1vZGVsL3gzZCt2cm1sXFx0XFx0XFx0XFx0XFx0eDNkdiB4M2R2elxcbm1vZGVsL3gzZCt4bWxcXHRcXHRcXHRcXHRcXHR4M2QgeDNkelxcbnRleHQvY2FjaGUtbWFuaWZlc3RcXHRcXHRcXHRcXHRhcHBjYWNoZVxcbnRleHQvY2FsZW5kYXJcXHRcXHRcXHRcXHRcXHRpY3MgaWZiXFxudGV4dC9jc3NcXHRcXHRcXHRcXHRcXHRjc3NcXG50ZXh0L2NzdlxcdFxcdFxcdFxcdFxcdGNzdlxcbnRleHQvaHRtbFxcdFxcdFxcdFxcdFxcdGh0bWwgaHRtXFxudGV4dC9uM1xcdFxcdFxcdFxcdFxcdFxcdG4zXFxudGV4dC9wbGFpblxcdFxcdFxcdFxcdFxcdHR4dCB0ZXh0IGNvbmYgZGVmIGxpc3QgbG9nIGluXFxudGV4dC9wcnMubGluZXMudGFnXFx0XFx0XFx0XFx0ZHNjXFxudGV4dC9yaWNodGV4dFxcdFxcdFxcdFxcdFxcdHJ0eFxcbnRleHQvc2dtbFxcdFxcdFxcdFxcdFxcdHNnbWwgc2dtXFxudGV4dC90YWItc2VwYXJhdGVkLXZhbHVlc1xcdFxcdFxcdHRzdlxcbnRleHQvdHJvZmZcXHRcXHRcXHRcXHRcXHR0IHRyIHJvZmYgbWFuIG1lIG1zXFxudGV4dC90dXJ0bGVcXHRcXHRcXHRcXHRcXHR0dGxcXG50ZXh0L3VyaS1saXN0XFx0XFx0XFx0XFx0XFx0dXJpIHVyaXMgdXJsc1xcbnRleHQvdmNhcmRcXHRcXHRcXHRcXHRcXHR2Y2FyZFxcbnRleHQvdm5kLmN1cmxcXHRcXHRcXHRcXHRcXHRjdXJsXFxudGV4dC92bmQuY3VybC5kY3VybFxcdFxcdFxcdFxcdGRjdXJsXFxudGV4dC92bmQuY3VybC5tY3VybFxcdFxcdFxcdFxcdG1jdXJsXFxudGV4dC92bmQuY3VybC5zY3VybFxcdFxcdFxcdFxcdHNjdXJsXFxudGV4dC92bmQuZHZiLnN1YnRpdGxlXFx0XFx0XFx0XFx0c3ViXFxudGV4dC92bmQuZmx5XFx0XFx0XFx0XFx0XFx0Zmx5XFxudGV4dC92bmQuZm1pLmZsZXhzdG9yXFx0XFx0XFx0XFx0Zmx4XFxudGV4dC92bmQuZ3JhcGh2aXpcXHRcXHRcXHRcXHRndlxcbnRleHQvdm5kLmluM2QuM2RtbFxcdFxcdFxcdFxcdDNkbWxcXG50ZXh0L3ZuZC5pbjNkLnNwb3RcXHRcXHRcXHRcXHRzcG90XFxudGV4dC92bmQuc3VuLmoybWUuYXBwLWRlc2NyaXB0b3JcXHRcXHRqYWRcXG50ZXh0L3ZuZC53YXAud21sXFx0XFx0XFx0XFx0d21sXFxudGV4dC92bmQud2FwLndtbHNjcmlwdFxcdFxcdFxcdFxcdHdtbHNcXG50ZXh0L3gtYXNtXFx0XFx0XFx0XFx0XFx0cyBhc21cXG50ZXh0L3gtY1xcdFxcdFxcdFxcdFxcdGMgY2MgY3h4IGNwcCBoIGhoIGRpY1xcbnRleHQveC1mb3J0cmFuXFx0XFx0XFx0XFx0XFx0ZiBmb3IgZjc3IGY5MFxcbnRleHQveC1qYXZhLXNvdXJjZVxcdFxcdFxcdFxcdGphdmFcXG50ZXh0L3gtbmZvXFx0XFx0XFx0XFx0XFx0bmZvXFxudGV4dC94LW9wbWxcXHRcXHRcXHRcXHRcXHRvcG1sXFxudGV4dC94LXBhc2NhbFxcdFxcdFxcdFxcdFxcdHAgcGFzXFxudGV4dC94LXNldGV4dFxcdFxcdFxcdFxcdFxcdGV0eFxcbnRleHQveC1zZnZcXHRcXHRcXHRcXHRcXHRzZnZcXG50ZXh0L3gtdXVlbmNvZGVcXHRcXHRcXHRcXHRcXHR1dVxcbnRleHQveC12Y2FsZW5kYXJcXHRcXHRcXHRcXHR2Y3NcXG50ZXh0L3gtdmNhcmRcXHRcXHRcXHRcXHRcXHR2Y2ZcXG52aWRlby8zZ3BwXFx0XFx0XFx0XFx0XFx0M2dwXFxudmlkZW8vM2dwcDJcXHRcXHRcXHRcXHRcXHQzZzJcXG52aWRlby9oMjYxXFx0XFx0XFx0XFx0XFx0aDI2MVxcbnZpZGVvL2gyNjNcXHRcXHRcXHRcXHRcXHRoMjYzXFxudmlkZW8vaDI2NFxcdFxcdFxcdFxcdFxcdGgyNjRcXG52aWRlby9qcGVnXFx0XFx0XFx0XFx0XFx0anBndlxcbnZpZGVvL2pwbVxcdFxcdFxcdFxcdFxcdGpwbSBqcGdtXFxudmlkZW8vbWoyXFx0XFx0XFx0XFx0XFx0bWoyIG1qcDJcXG52aWRlby9tcDRcXHRcXHRcXHRcXHRcXHRtcDQgbXA0diBtcGc0XFxudmlkZW8vbXBlZ1xcdFxcdFxcdFxcdFxcdG1wZWcgbXBnIG1wZSBtMXYgbTJ2XFxudmlkZW8vb2dnXFx0XFx0XFx0XFx0XFx0b2d2XFxudmlkZW8vcXVpY2t0aW1lXFx0XFx0XFx0XFx0XFx0cXQgbW92XFxudmlkZW8vdm5kLmRlY2UuaGRcXHRcXHRcXHRcXHR1dmggdXZ2aFxcbnZpZGVvL3ZuZC5kZWNlLm1vYmlsZVxcdFxcdFxcdFxcdHV2bSB1dnZtXFxudmlkZW8vdm5kLmRlY2UucGRcXHRcXHRcXHRcXHR1dnAgdXZ2cFxcbnZpZGVvL3ZuZC5kZWNlLnNkXFx0XFx0XFx0XFx0dXZzIHV2dnNcXG52aWRlby92bmQuZGVjZS52aWRlb1xcdFxcdFxcdFxcdHV2diB1dnZ2XFxudmlkZW8vdm5kLmR2Yi5maWxlXFx0XFx0XFx0XFx0ZHZiXFxudmlkZW8vdm5kLmZ2dFxcdFxcdFxcdFxcdFxcdGZ2dFxcbnZpZGVvL3ZuZC5tcGVndXJsXFx0XFx0XFx0XFx0bXh1IG00dVxcbnZpZGVvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHl2XFx0XFx0cHl2XFxudmlkZW8vdm5kLnV2dnUubXA0XFx0XFx0XFx0XFx0dXZ1IHV2dnVcXG52aWRlby92bmQudml2b1xcdFxcdFxcdFxcdFxcdHZpdlxcbnZpZGVvL3dlYm1cXHRcXHRcXHRcXHRcXHR3ZWJtXFxudmlkZW8veC1mNHZcXHRcXHRcXHRcXHRcXHRmNHZcXG52aWRlby94LWZsaVxcdFxcdFxcdFxcdFxcdGZsaVxcbnZpZGVvL3gtZmx2XFx0XFx0XFx0XFx0XFx0Zmx2XFxudmlkZW8veC1tNHZcXHRcXHRcXHRcXHRcXHRtNHZcXG52aWRlby94LW1hdHJvc2thXFx0XFx0XFx0XFx0bWt2IG1rM2QgbWtzXFxudmlkZW8veC1tbmdcXHRcXHRcXHRcXHRcXHRtbmdcXG52aWRlby94LW1zLWFzZlxcdFxcdFxcdFxcdFxcdGFzZiBhc3hcXG52aWRlby94LW1zLXZvYlxcdFxcdFxcdFxcdFxcdHZvYlxcbnZpZGVvL3gtbXMtd21cXHRcXHRcXHRcXHRcXHR3bVxcbnZpZGVvL3gtbXMtd212XFx0XFx0XFx0XFx0XFx0d212XFxudmlkZW8veC1tcy13bXhcXHRcXHRcXHRcXHRcXHR3bXhcXG52aWRlby94LW1zLXd2eFxcdFxcdFxcdFxcdFxcdHd2eFxcbnZpZGVvL3gtbXN2aWRlb1xcdFxcdFxcdFxcdFxcdGF2aVxcbnZpZGVvL3gtc2dpLW1vdmllXFx0XFx0XFx0XFx0bW92aWVcXG52aWRlby94LXNtdlxcdFxcdFxcdFxcdFxcdHNtdlxcbngtY29uZmVyZW5jZS94LWNvb2x0YWxrXFx0XFx0XFx0XFx0aWNlXFxuXCI7XG5cbmNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcblxubWltZV9yYXcuc3BsaXQoJ1xcbicpLmZvckVhY2goKHJvdykgPT4ge1xuXHRjb25zdCBtYXRjaCA9IC8oLis/KVxcdCsoLispLy5leGVjKHJvdyk7XG5cdGlmICghbWF0Y2gpIHJldHVybjtcblxuXHRjb25zdCB0eXBlID0gbWF0Y2hbMV07XG5cdGNvbnN0IGV4dGVuc2lvbnMgPSBtYXRjaFsyXS5zcGxpdCgnICcpO1xuXG5cdGV4dGVuc2lvbnMuZm9yRWFjaChleHQgPT4ge1xuXHRcdG1hcC5zZXQoZXh0LCB0eXBlKTtcblx0fSk7XG59KTtcblxuZnVuY3Rpb24gbG9va3VwKGZpbGUpIHtcblx0Y29uc3QgbWF0Y2ggPSAvXFwuKFteXFwuXSspJC8uZXhlYyhmaWxlKTtcblx0cmV0dXJuIG1hdGNoICYmIG1hcC5nZXQobWF0Y2hbMV0pO1xufVxuXG5mdW5jdGlvbiBtaWRkbGV3YXJlKG9wdHNcblxuXG4gPSB7fSkge1xuXHRjb25zdCB7IHNlc3Npb24sIGlnbm9yZSB9ID0gb3B0cztcblxuXHRsZXQgZW1pdHRlZF9iYXNlcGF0aCA9IGZhbHNlO1xuXG5cdHJldHVybiBjb21wb3NlX2hhbmRsZXJzKGlnbm9yZSwgW1xuXHRcdChyZXEsIHJlcywgbmV4dCkgPT4ge1xuXHRcdFx0aWYgKHJlcS5iYXNlVXJsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bGV0IHsgb3JpZ2luYWxVcmwgfSA9IHJlcTtcblx0XHRcdFx0aWYgKHJlcS51cmwgPT09ICcvJyAmJiBvcmlnaW5hbFVybFtvcmlnaW5hbFVybC5sZW5ndGggLSAxXSAhPT0gJy8nKSB7XG5cdFx0XHRcdFx0b3JpZ2luYWxVcmwgKz0gJy8nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVxLmJhc2VVcmwgPSBvcmlnaW5hbFVybFxuXHRcdFx0XHRcdD8gb3JpZ2luYWxVcmwuc2xpY2UoMCwgLXJlcS51cmwubGVuZ3RoKVxuXHRcdFx0XHRcdDogJyc7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZW1pdHRlZF9iYXNlcGF0aCAmJiBwcm9jZXNzLnNlbmQpIHtcblx0XHRcdFx0cHJvY2Vzcy5zZW5kKHtcblx0XHRcdFx0XHRfX3NhcHBlcl9fOiB0cnVlLFxuXHRcdFx0XHRcdGV2ZW50OiAnYmFzZXBhdGgnLFxuXHRcdFx0XHRcdGJhc2VwYXRoOiByZXEuYmFzZVVybFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRlbWl0dGVkX2Jhc2VwYXRoID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlcS5wYXRoID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmVxLnBhdGggPSByZXEudXJsLnJlcGxhY2UoL1xcPy4qLywgJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRuZXh0KCk7XG5cdFx0fSxcblxuXHRcdGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGJ1aWxkX2RpciwgJ3NlcnZpY2Utd29ya2VyLmpzJykpICYmIHNlcnZlKHtcblx0XHRcdHBhdGhuYW1lOiAnL3NlcnZpY2Utd29ya2VyLmpzJyxcblx0XHRcdGNhY2hlX2NvbnRyb2w6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZSdcblx0XHR9KSxcblxuXHRcdGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGJ1aWxkX2RpciwgJ3NlcnZpY2Utd29ya2VyLmpzLm1hcCcpKSAmJiBzZXJ2ZSh7XG5cdFx0XHRwYXRobmFtZTogJy9zZXJ2aWNlLXdvcmtlci5qcy5tYXAnLFxuXHRcdFx0Y2FjaGVfY29udHJvbDogJ25vLWNhY2hlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlJ1xuXHRcdH0pLFxuXG5cdFx0c2VydmUoe1xuXHRcdFx0cHJlZml4OiAnL2NsaWVudC8nLFxuXHRcdFx0Y2FjaGVfY29udHJvbDogZGV2ID8gJ25vLWNhY2hlJyA6ICdtYXgtYWdlPTMxNTM2MDAwLCBpbW11dGFibGUnXG5cdFx0fSksXG5cblx0XHRnZXRfc2VydmVyX3JvdXRlX2hhbmRsZXIobWFuaWZlc3Quc2VydmVyX3JvdXRlcyksXG5cblx0XHRnZXRfcGFnZV9oYW5kbGVyKG1hbmlmZXN0LCBzZXNzaW9uIHx8IG5vb3ApXG5cdF0uZmlsdGVyKEJvb2xlYW4pKTtcbn1cblxuZnVuY3Rpb24gY29tcG9zZV9oYW5kbGVycyhpZ25vcmUsIGhhbmRsZXJzKSB7XG5cdGNvbnN0IHRvdGFsID0gaGFuZGxlcnMubGVuZ3RoO1xuXG5cdGZ1bmN0aW9uIG50aF9oYW5kbGVyKG4sIHJlcSwgcmVzLCBuZXh0KSB7XG5cdFx0aWYgKG4gPj0gdG90YWwpIHtcblx0XHRcdHJldHVybiBuZXh0KCk7XG5cdFx0fVxuXG5cdFx0aGFuZGxlcnNbbl0ocmVxLCByZXMsICgpID0+IG50aF9oYW5kbGVyKG4rMSwgcmVxLCByZXMsIG5leHQpKTtcblx0fVxuXG5cdHJldHVybiAhaWdub3JlXG5cdFx0PyAocmVxLCByZXMsIG5leHQpID0+IG50aF9oYW5kbGVyKDAsIHJlcSwgcmVzLCBuZXh0KVxuXHRcdDogKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG5cdFx0XHRpZiAoc2hvdWxkX2lnbm9yZShyZXEucGF0aCwgaWdub3JlKSkge1xuXHRcdFx0XHRuZXh0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRudGhfaGFuZGxlcigwLCByZXEsIHJlcywgbmV4dCk7XG5cdFx0XHR9XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkX2lnbm9yZSh1cmksIHZhbCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gdmFsLnNvbWUoeCA9PiBzaG91bGRfaWdub3JlKHVyaSwgeCkpO1xuXHRpZiAodmFsIGluc3RhbmNlb2YgUmVnRXhwKSByZXR1cm4gdmFsLnRlc3QodXJpKTtcblx0aWYgKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHJldHVybiB2YWwodXJpKTtcblx0cmV0dXJuIHVyaS5zdGFydHNXaXRoKHZhbC5jaGFyQ29kZUF0KDApID09PSA0NyA/IHZhbCA6IGAvJHt2YWx9YCk7XG59XG5cbmZ1bmN0aW9uIHNlcnZlKHsgcHJlZml4LCBwYXRobmFtZSwgY2FjaGVfY29udHJvbCB9XG5cblxuXG4pIHtcblx0Y29uc3QgZmlsdGVyID0gcGF0aG5hbWVcblx0XHQ/IChyZXEpID0+IHJlcS5wYXRoID09PSBwYXRobmFtZVxuXHRcdDogKHJlcSkgPT4gcmVxLnBhdGguc3RhcnRzV2l0aChwcmVmaXgpO1xuXG5cdGNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xuXG5cdGNvbnN0IHJlYWQgPSBkZXZcblx0XHQ/IChmaWxlKSA9PiBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGJ1aWxkX2RpciwgZmlsZSkpXG5cdFx0OiAoZmlsZSkgPT4gKGNhY2hlLmhhcyhmaWxlKSA/IGNhY2hlIDogY2FjaGUuc2V0KGZpbGUsIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYnVpbGRfZGlyLCBmaWxlKSkpKS5nZXQoZmlsZSk7XG5cblx0cmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuXHRcdGlmIChmaWx0ZXIocmVxKSkge1xuXHRcdFx0Y29uc3QgdHlwZSA9IGxvb2t1cChyZXEucGF0aCk7XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGZpbGUgPSBwYXRoLnBvc2l4Lm5vcm1hbGl6ZShkZWNvZGVVUklDb21wb25lbnQocmVxLnBhdGgpKTtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IHJlYWQoZmlsZSk7XG5cblx0XHRcdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgdHlwZSk7XG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCBjYWNoZV9jb250cm9sKTtcblx0XHRcdFx0cmVzLmVuZChkYXRhKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDQwNDtcblx0XHRcdFx0cmVzLmVuZCgnbm90IGZvdW5kJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHQoKTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIG5vb3AoKXt9XG5cbmV4cG9ydCB7IG1pZGRsZXdhcmUgfTtcbiIsImltcG9ydCBzaXJ2IGZyb20gJ3NpcnYnO1xyXG5pbXBvcnQgcG9sa2EgZnJvbSAncG9sa2EnO1xyXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xyXG5pbXBvcnQgKiBhcyBzYXBwZXIgZnJvbSAnQHNhcHBlci9zZXJ2ZXInO1xyXG5cclxuY29uc3QgeyBQT1JULCBOT0RFX0VOViB9ID0gcHJvY2Vzcy5lbnY7XHJcbmNvbnN0IGRldiA9IE5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxucG9sa2EoKSAvLyBZb3UgY2FuIGFsc28gdXNlIEV4cHJlc3NcclxuXHQudXNlKFxyXG5cdFx0Y29tcHJlc3Npb24oeyB0aHJlc2hvbGQ6IDAgfSksXHJcblx0XHRzaXJ2KCdzdGF0aWMnLCB7IGRldiB9KSxcclxuXHRcdHNhcHBlci5taWRkbGV3YXJlKClcclxuXHQpXHJcblx0Lmxpc3RlbihQT1JULCBlcnIgPT4ge1xyXG5cdFx0aWYgKGVycikgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyKTtcclxuXHR9KTtcclxuIl0sIm5hbWVzIjpbImdldCIsInByZWxvYWQiLCJjb21wb25lbnRfMCIsImNvbXBvbmVudF8xIiwiY29tcG9uZW50XzIiLCJjb21wb25lbnRfMyIsImNvbXBvbmVudF80IiwiY29tcG9uZW50XzUiLCJjb21wb25lbnRfNiIsImNvbXBvbmVudF83IiwiY29tcG9uZW50XzgiLCJjb21wb25lbnRfOSIsImNvbXBvbmVudF8xMCIsImNvbXBvbmVudF8xMSIsImNvbXBvbmVudF8xMiIsImNvbXBvbmVudF8xMyIsImNvbXBvbmVudF8xNCIsImNvbXBvbmVudF8xNSIsImNvbXBvbmVudF8xNiIsInByZWxvYWRfMTYiLCJjb21wb25lbnRfMTciLCJwcmVsb2FkXzE3IiwiY29tcG9uZW50XzE4IiwiY29tcG9uZW50XzE5Iiwicm9vdCIsImVycm9yIiwiZXNjYXBlZCIsImxvb2t1cCIsIm5vb3AiLCJzYXBwZXIubWlkZGxld2FyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsQ0FBQztBQUNELEVBQUUsS0FBSyxFQUFFLGlCQUFpQjtBQUMxQixFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDeEIsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsQ0FBQztBQUNILEVBQUU7QUFDRjtBQUNBLENBQUM7QUFDRCxFQUFFLEtBQUssRUFBRSxtQkFBbUI7QUFDNUIsRUFBRSxJQUFJLEVBQUUsbUJBQW1CO0FBQzNCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxDQUFDO0FBQ0gsRUFBRTtBQUNGO0FBQ0EsQ0FBQztBQUNELEVBQUUsS0FBSyxFQUFFLGVBQWU7QUFDeEIsRUFBRSxJQUFJLEVBQUUsY0FBYztBQUN0QixFQUFFLElBQUksRUFBRSxDQUFDO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsRUFBRSxDQUFDO0FBQ0gsRUFBRTtBQUNGO0FBQ0EsQ0FBQztBQUNELEVBQUUsS0FBSyxFQUFFLHVDQUF1QztBQUNoRCxFQUFFLElBQUksRUFBRSxtQ0FBbUM7QUFDM0MsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLENBQUM7QUFDSCxFQUFFO0FBQ0Y7QUFDQSxDQUFDO0FBQ0QsRUFBRSxLQUFLLEVBQUUseUJBQXlC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
