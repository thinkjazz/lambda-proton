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
	let { src } = $$props;
	let { alt } = $$props;
	let { class: className = "" } = $$props;
	if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
	if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0) $$bindings.alt(alt);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	return `<img class="${"img-fluid " + escape(className)}"${add_attribute("src", src, 0)}${add_attribute("alt", alt, 0)}>`;
});

/* src\components\DashboardCard.svelte generated by Svelte v3.18.1 */

const DashboardCard = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { cardTitle = "" } = $$props;
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
	return `<footer class="${"py-4 bg-light mt-auto"}">
  ${validate_component(Container, "Container").$$render($$result, { fluid: true }, {}, {
		default: () => `
    <div class="${"d-flex align-items-center justify-content-between small"}">
      <div class="${"text-muted"}">
        Создано при помощи Г.Э.C.К
        <a href="${"https://github.com/thinkjazz"}">thinkjazz</a>
      </div>
      <div>
        <a href="${"#"}">Privacy Policy</a>
        ·
        <a href="${"#"}">Terms &amp; Conditions</a>
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
	? `<div id="${"layoutAuthentication"}" class="${"bg-danger"}">
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
      <h3 class="${"text-center font-weight-light my-4"}">Login</h3>
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
								placeholder: "Enter email address"
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
							{ default: () => `Password` }
						)}
          ${validate_component(Input, "Input").$$render(
							$$result,
							{
								class: "py-4",
								type: "password",
								name: "password",
								id: "examplePassword",
								placeholder: "Enter password"
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
								label: "Remember password"
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
            Forgot Password?
          </a>
          ${validate_component(Button, "Button").$$render($$result, { color: "primary", href: "." }, {}, { default: () => `Login` })}
        `
						}
					)}
      `
				})}
    `
			})}
    ${validate_component(CardFooter, "CardFooter").$$render($$result, { class: "text-center small" }, {}, {
				default: () => `
      <a href="${"pages/authentication/register"}">Need an account? Sign up!</a>
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
      <h3 class="${"text-center font-weight-light my-4"}">Create Account</h3>
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
									{ default: () => `First Name` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "text",
										name: "firstName",
										id: "inputFirstName",
										placeholder: "Enter first name"
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
									{ default: () => `Last Name` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "text",
										name: "lastName",
										id: "inputLastName",
										placeholder: "Enter last name"
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
									placeholder: "Enter email address"
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
									{ default: () => `Password` }
								)}
              ${validate_component(Input, "Input").$$render(
									$$result,
									{
										class: "py-4",
										type: "password",
										name: "inputPassword",
										id: "inputPassword",
										placeholder: "Enter password"
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
                Confirm Password
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
										placeholder: "Confirm password"
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
            Create Account
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
      <a href="${"pages/authentication/login"}">Have an account? Go to login</a>
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
      <h3 class="${"text-center font-weight-light my-4"}">Password Recovery</h3>
    `
			})}
    ${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
				default: () => `
      <div class="${"small mb-3 text-muted"}">
        Enter your email address and we will send you a link to reset your
        password.
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
								placeholder: "Enter email address"
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
          <a class="${"small"}" href="${"pages/authentication/login"}">Return to login</a>
          ${validate_component(Button, "Button").$$render(
								$$result,
								{
									color: "primary",
									href: "pages/authentication/login"
								},
								{},
								{
									default: () => `
            Reset Password
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
      <a href="${"pages/authentication/register"}">Need an account? Sign up!</a>
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
  ${validate_component(NavbarBrand, "NavbarBrand").$$render($$result, { href: "." }, {}, { default: () => `${escape(title)}` })}
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
	let { text = "" } = $$props;
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
	let isLayoutOpen = true;
	let isPageOpen = true;
	let isAuthenticationOpen = true;
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
						text: "Dashboard",
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
						class:  "",
						text: "Layouts",
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
								class: segment === "layouts" && activeLink === "Static Navigation"
								? "active"
								: "",
								href: "layouts/static_navigation",
								text: "Static Navigation"
							},
							{},
							{}
						)}
            ${validate_component(SidebarItem, "SidebarItem").$$render(
							$$result,
							{
								class: segment === "layouts" && activeLink === "Light Sidenav"
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
						class:  "",
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
									class:  "",
									text: "Authentication",
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
											text: "Login"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/authentication/register",
											text: "Register"
										},
										{},
										{}
									)}
                ${validate_component(SidebarItem, "SidebarItem").$$render(
										$$result,
										{
											href: "pages/authentication/forget_password",
											text: "Forgot Password"
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
									text: "Error",
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
						text: "Charts",
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
						text: "Tables",
						leftIcon: true
					},
					{},
					{
						leftIcon: () => `<i class="${"fas fa-table"}" slot="${"leftIcon"}"></i>`,
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

const Layout$3 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	let theme = "dark";
	let color = "dark";
	let title = "λproton";
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
		}
	],

	root: Layout$3,
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


${validate_component(Layout$3, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
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

var mime_raw = "application/andrew-inset\t\t\tez\napplication/applixware\t\t\t\taw\napplication/atom+xml\t\t\t\tatom\napplication/atomcat+xml\t\t\t\tatomcat\napplication/atomsvc+xml\t\t\t\tatomsvc\napplication/ccxml+xml\t\t\t\tccxml\napplication/cdmi-capability\t\t\tcdmia\napplication/cdmi-container\t\t\tcdmic\napplication/cdmi-domain\t\t\t\tcdmid\napplication/cdmi-object\t\t\t\tcdmio\napplication/cdmi-queue\t\t\t\tcdmiq\napplication/cu-seeme\t\t\t\tcu\napplication/davmount+xml\t\t\tdavmount\napplication/docbook+xml\t\t\t\tdbk\napplication/dssc+der\t\t\t\tdssc\napplication/dssc+xml\t\t\t\txdssc\napplication/ecmascript\t\t\t\tecma\napplication/emma+xml\t\t\t\temma\napplication/epub+zip\t\t\t\tepub\napplication/exi\t\t\t\t\texi\napplication/font-tdpfr\t\t\t\tpfr\napplication/gml+xml\t\t\t\tgml\napplication/gpx+xml\t\t\t\tgpx\napplication/gxf\t\t\t\t\tgxf\napplication/hyperstudio\t\t\t\tstk\napplication/inkml+xml\t\t\t\tink inkml\napplication/ipfix\t\t\t\tipfix\napplication/java-archive\t\t\tjar\napplication/java-serialized-object\t\tser\napplication/java-vm\t\t\t\tclass\napplication/javascript\t\t\t\tjs\napplication/json\t\t\t\tjson map\napplication/jsonml+json\t\t\t\tjsonml\napplication/lost+xml\t\t\t\tlostxml\napplication/mac-binhex40\t\t\thqx\napplication/mac-compactpro\t\t\tcpt\napplication/mads+xml\t\t\t\tmads\napplication/marc\t\t\t\tmrc\napplication/marcxml+xml\t\t\t\tmrcx\napplication/mathematica\t\t\t\tma nb mb\napplication/mathml+xml\t\t\t\tmathml\napplication/mbox\t\t\t\tmbox\napplication/mediaservercontrol+xml\t\tmscml\napplication/metalink+xml\t\t\tmetalink\napplication/metalink4+xml\t\t\tmeta4\napplication/mets+xml\t\t\t\tmets\napplication/mods+xml\t\t\t\tmods\napplication/mp21\t\t\t\tm21 mp21\napplication/mp4\t\t\t\t\tmp4s\napplication/msword\t\t\t\tdoc dot\napplication/mxf\t\t\t\t\tmxf\napplication/octet-stream\tbin dms lrf mar so dist distz pkg bpk dump elc deploy\napplication/oda\t\t\t\t\toda\napplication/oebps-package+xml\t\t\topf\napplication/ogg\t\t\t\t\togx\napplication/omdoc+xml\t\t\t\tomdoc\napplication/onenote\t\t\t\tonetoc onetoc2 onetmp onepkg\napplication/oxps\t\t\t\toxps\napplication/patch-ops-error+xml\t\t\txer\napplication/pdf\t\t\t\t\tpdf\napplication/pgp-encrypted\t\t\tpgp\napplication/pgp-signature\t\t\tasc sig\napplication/pics-rules\t\t\t\tprf\napplication/pkcs10\t\t\t\tp10\napplication/pkcs7-mime\t\t\t\tp7m p7c\napplication/pkcs7-signature\t\t\tp7s\napplication/pkcs8\t\t\t\tp8\napplication/pkix-attr-cert\t\t\tac\napplication/pkix-cert\t\t\t\tcer\napplication/pkix-crl\t\t\t\tcrl\napplication/pkix-pkipath\t\t\tpkipath\napplication/pkixcmp\t\t\t\tpki\napplication/pls+xml\t\t\t\tpls\napplication/postscript\t\t\t\tai eps ps\napplication/prs.cww\t\t\t\tcww\napplication/pskc+xml\t\t\t\tpskcxml\napplication/rdf+xml\t\t\t\trdf\napplication/reginfo+xml\t\t\t\trif\napplication/relax-ng-compact-syntax\t\trnc\napplication/resource-lists+xml\t\t\trl\napplication/resource-lists-diff+xml\t\trld\napplication/rls-services+xml\t\t\trs\napplication/rpki-ghostbusters\t\t\tgbr\napplication/rpki-manifest\t\t\tmft\napplication/rpki-roa\t\t\t\troa\napplication/rsd+xml\t\t\t\trsd\napplication/rss+xml\t\t\t\trss\napplication/rtf\t\t\t\t\trtf\napplication/sbml+xml\t\t\t\tsbml\napplication/scvp-cv-request\t\t\tscq\napplication/scvp-cv-response\t\t\tscs\napplication/scvp-vp-request\t\t\tspq\napplication/scvp-vp-response\t\t\tspp\napplication/sdp\t\t\t\t\tsdp\napplication/set-payment-initiation\t\tsetpay\napplication/set-registration-initiation\t\tsetreg\napplication/shf+xml\t\t\t\tshf\napplication/smil+xml\t\t\t\tsmi smil\napplication/sparql-query\t\t\trq\napplication/sparql-results+xml\t\t\tsrx\napplication/srgs\t\t\t\tgram\napplication/srgs+xml\t\t\t\tgrxml\napplication/sru+xml\t\t\t\tsru\napplication/ssdl+xml\t\t\t\tssdl\napplication/ssml+xml\t\t\t\tssml\napplication/tei+xml\t\t\t\ttei teicorpus\napplication/thraud+xml\t\t\t\ttfi\napplication/timestamped-data\t\t\ttsd\napplication/vnd.3gpp.pic-bw-large\t\tplb\napplication/vnd.3gpp.pic-bw-small\t\tpsb\napplication/vnd.3gpp.pic-bw-var\t\t\tpvb\napplication/vnd.3gpp2.tcap\t\t\ttcap\napplication/vnd.3m.post-it-notes\t\tpwn\napplication/vnd.accpac.simply.aso\t\taso\napplication/vnd.accpac.simply.imp\t\timp\napplication/vnd.acucobol\t\t\tacu\napplication/vnd.acucorp\t\t\t\tatc acutc\napplication/vnd.adobe.air-application-installer-package+zip\tair\napplication/vnd.adobe.formscentral.fcdt\t\tfcdt\napplication/vnd.adobe.fxp\t\t\tfxp fxpl\napplication/vnd.adobe.xdp+xml\t\t\txdp\napplication/vnd.adobe.xfdf\t\t\txfdf\napplication/vnd.ahead.space\t\t\tahead\napplication/vnd.airzip.filesecure.azf\t\tazf\napplication/vnd.airzip.filesecure.azs\t\tazs\napplication/vnd.amazon.ebook\t\t\tazw\napplication/vnd.americandynamics.acc\t\tacc\napplication/vnd.amiga.ami\t\t\tami\napplication/vnd.android.package-archive\t\tapk\napplication/vnd.anser-web-certificate-issue-initiation\tcii\napplication/vnd.anser-web-funds-transfer-initiation\tfti\napplication/vnd.antix.game-component\t\tatx\napplication/vnd.apple.installer+xml\t\tmpkg\napplication/vnd.apple.mpegurl\t\t\tm3u8\napplication/vnd.aristanetworks.swi\t\tswi\napplication/vnd.astraea-software.iota\t\tiota\napplication/vnd.audiograph\t\t\taep\napplication/vnd.blueice.multipass\t\tmpm\napplication/vnd.bmi\t\t\t\tbmi\napplication/vnd.businessobjects\t\t\trep\napplication/vnd.chemdraw+xml\t\t\tcdxml\napplication/vnd.chipnuts.karaoke-mmd\t\tmmd\napplication/vnd.cinderella\t\t\tcdy\napplication/vnd.claymore\t\t\tcla\napplication/vnd.cloanto.rp9\t\t\trp9\napplication/vnd.clonk.c4group\t\t\tc4g c4d c4f c4p c4u\napplication/vnd.cluetrust.cartomobile-config\t\tc11amc\napplication/vnd.cluetrust.cartomobile-config-pkg\tc11amz\napplication/vnd.commonspace\t\t\tcsp\napplication/vnd.contact.cmsg\t\t\tcdbcmsg\napplication/vnd.cosmocaller\t\t\tcmc\napplication/vnd.crick.clicker\t\t\tclkx\napplication/vnd.crick.clicker.keyboard\t\tclkk\napplication/vnd.crick.clicker.palette\t\tclkp\napplication/vnd.crick.clicker.template\t\tclkt\napplication/vnd.crick.clicker.wordbank\t\tclkw\napplication/vnd.criticaltools.wbs+xml\t\twbs\napplication/vnd.ctc-posml\t\t\tpml\napplication/vnd.cups-ppd\t\t\tppd\napplication/vnd.curl.car\t\t\tcar\napplication/vnd.curl.pcurl\t\t\tpcurl\napplication/vnd.dart\t\t\t\tdart\napplication/vnd.data-vision.rdz\t\t\trdz\napplication/vnd.dece.data\t\t\tuvf uvvf uvd uvvd\napplication/vnd.dece.ttml+xml\t\t\tuvt uvvt\napplication/vnd.dece.unspecified\t\tuvx uvvx\napplication/vnd.dece.zip\t\t\tuvz uvvz\napplication/vnd.denovo.fcselayout-link\t\tfe_launch\napplication/vnd.dna\t\t\t\tdna\napplication/vnd.dolby.mlp\t\t\tmlp\napplication/vnd.dpgraph\t\t\t\tdpg\napplication/vnd.dreamfactory\t\t\tdfac\napplication/vnd.ds-keypoint\t\t\tkpxx\napplication/vnd.dvb.ait\t\t\t\tait\napplication/vnd.dvb.service\t\t\tsvc\napplication/vnd.dynageo\t\t\t\tgeo\napplication/vnd.ecowin.chart\t\t\tmag\napplication/vnd.enliven\t\t\t\tnml\napplication/vnd.epson.esf\t\t\tesf\napplication/vnd.epson.msf\t\t\tmsf\napplication/vnd.epson.quickanime\t\tqam\napplication/vnd.epson.salt\t\t\tslt\napplication/vnd.epson.ssf\t\t\tssf\napplication/vnd.eszigno3+xml\t\t\tes3 et3\napplication/vnd.ezpix-album\t\t\tez2\napplication/vnd.ezpix-package\t\t\tez3\napplication/vnd.fdf\t\t\t\tfdf\napplication/vnd.fdsn.mseed\t\t\tmseed\napplication/vnd.fdsn.seed\t\t\tseed dataless\napplication/vnd.flographit\t\t\tgph\napplication/vnd.fluxtime.clip\t\t\tftc\napplication/vnd.framemaker\t\t\tfm frame maker book\napplication/vnd.frogans.fnc\t\t\tfnc\napplication/vnd.frogans.ltf\t\t\tltf\napplication/vnd.fsc.weblaunch\t\t\tfsc\napplication/vnd.fujitsu.oasys\t\t\toas\napplication/vnd.fujitsu.oasys2\t\t\toa2\napplication/vnd.fujitsu.oasys3\t\t\toa3\napplication/vnd.fujitsu.oasysgp\t\t\tfg5\napplication/vnd.fujitsu.oasysprs\t\tbh2\napplication/vnd.fujixerox.ddd\t\t\tddd\napplication/vnd.fujixerox.docuworks\t\txdw\napplication/vnd.fujixerox.docuworks.binder\txbd\napplication/vnd.fuzzysheet\t\t\tfzs\napplication/vnd.genomatix.tuxedo\t\ttxd\napplication/vnd.geogebra.file\t\t\tggb\napplication/vnd.geogebra.tool\t\t\tggt\napplication/vnd.geometry-explorer\t\tgex gre\napplication/vnd.geonext\t\t\t\tgxt\napplication/vnd.geoplan\t\t\t\tg2w\napplication/vnd.geospace\t\t\tg3w\napplication/vnd.gmx\t\t\t\tgmx\napplication/vnd.google-earth.kml+xml\t\tkml\napplication/vnd.google-earth.kmz\t\tkmz\napplication/vnd.grafeq\t\t\t\tgqf gqs\napplication/vnd.groove-account\t\t\tgac\napplication/vnd.groove-help\t\t\tghf\napplication/vnd.groove-identity-message\t\tgim\napplication/vnd.groove-injector\t\t\tgrv\napplication/vnd.groove-tool-message\t\tgtm\napplication/vnd.groove-tool-template\t\ttpl\napplication/vnd.groove-vcard\t\t\tvcg\napplication/vnd.hal+xml\t\t\t\thal\napplication/vnd.handheld-entertainment+xml\tzmm\napplication/vnd.hbci\t\t\t\thbci\napplication/vnd.hhe.lesson-player\t\tles\napplication/vnd.hp-hpgl\t\t\t\thpgl\napplication/vnd.hp-hpid\t\t\t\thpid\napplication/vnd.hp-hps\t\t\t\thps\napplication/vnd.hp-jlyt\t\t\t\tjlt\napplication/vnd.hp-pcl\t\t\t\tpcl\napplication/vnd.hp-pclxl\t\t\tpclxl\napplication/vnd.hydrostatix.sof-data\t\tsfd-hdstx\napplication/vnd.ibm.minipay\t\t\tmpy\napplication/vnd.ibm.modcap\t\t\tafp listafp list3820\napplication/vnd.ibm.rights-management\t\tirm\napplication/vnd.ibm.secure-container\t\tsc\napplication/vnd.iccprofile\t\t\ticc icm\napplication/vnd.igloader\t\t\tigl\napplication/vnd.immervision-ivp\t\t\tivp\napplication/vnd.immervision-ivu\t\t\tivu\napplication/vnd.insors.igm\t\t\tigm\napplication/vnd.intercon.formnet\t\txpw xpx\napplication/vnd.intergeo\t\t\ti2g\napplication/vnd.intu.qbo\t\t\tqbo\napplication/vnd.intu.qfx\t\t\tqfx\napplication/vnd.ipunplugged.rcprofile\t\trcprofile\napplication/vnd.irepository.package+xml\t\tirp\napplication/vnd.is-xpr\t\t\t\txpr\napplication/vnd.isac.fcs\t\t\tfcs\napplication/vnd.jam\t\t\t\tjam\napplication/vnd.jcp.javame.midlet-rms\t\trms\napplication/vnd.jisp\t\t\t\tjisp\napplication/vnd.joost.joda-archive\t\tjoda\napplication/vnd.kahootz\t\t\t\tktz ktr\napplication/vnd.kde.karbon\t\t\tkarbon\napplication/vnd.kde.kchart\t\t\tchrt\napplication/vnd.kde.kformula\t\t\tkfo\napplication/vnd.kde.kivio\t\t\tflw\napplication/vnd.kde.kontour\t\t\tkon\napplication/vnd.kde.kpresenter\t\t\tkpr kpt\napplication/vnd.kde.kspread\t\t\tksp\napplication/vnd.kde.kword\t\t\tkwd kwt\napplication/vnd.kenameaapp\t\t\thtke\napplication/vnd.kidspiration\t\t\tkia\napplication/vnd.kinar\t\t\t\tkne knp\napplication/vnd.koan\t\t\t\tskp skd skt skm\napplication/vnd.kodak-descriptor\t\tsse\napplication/vnd.las.las+xml\t\t\tlasxml\napplication/vnd.llamagraphics.life-balance.desktop\tlbd\napplication/vnd.llamagraphics.life-balance.exchange+xml\tlbe\napplication/vnd.lotus-1-2-3\t\t\t123\napplication/vnd.lotus-approach\t\t\tapr\napplication/vnd.lotus-freelance\t\t\tpre\napplication/vnd.lotus-notes\t\t\tnsf\napplication/vnd.lotus-organizer\t\t\torg\napplication/vnd.lotus-screencam\t\t\tscm\napplication/vnd.lotus-wordpro\t\t\tlwp\napplication/vnd.macports.portpkg\t\tportpkg\napplication/vnd.mcd\t\t\t\tmcd\napplication/vnd.medcalcdata\t\t\tmc1\napplication/vnd.mediastation.cdkey\t\tcdkey\napplication/vnd.mfer\t\t\t\tmwf\napplication/vnd.mfmp\t\t\t\tmfm\napplication/vnd.micrografx.flo\t\t\tflo\napplication/vnd.micrografx.igx\t\t\tigx\napplication/vnd.mif\t\t\t\tmif\napplication/vnd.mobius.daf\t\t\tdaf\napplication/vnd.mobius.dis\t\t\tdis\napplication/vnd.mobius.mbk\t\t\tmbk\napplication/vnd.mobius.mqy\t\t\tmqy\napplication/vnd.mobius.msl\t\t\tmsl\napplication/vnd.mobius.plc\t\t\tplc\napplication/vnd.mobius.txf\t\t\ttxf\napplication/vnd.mophun.application\t\tmpn\napplication/vnd.mophun.certificate\t\tmpc\napplication/vnd.mozilla.xul+xml\t\t\txul\napplication/vnd.ms-artgalry\t\t\tcil\napplication/vnd.ms-cab-compressed\t\tcab\napplication/vnd.ms-excel\t\t\txls xlm xla xlc xlt xlw\napplication/vnd.ms-excel.addin.macroenabled.12\t\txlam\napplication/vnd.ms-excel.sheet.binary.macroenabled.12\txlsb\napplication/vnd.ms-excel.sheet.macroenabled.12\t\txlsm\napplication/vnd.ms-excel.template.macroenabled.12\txltm\napplication/vnd.ms-fontobject\t\t\teot\napplication/vnd.ms-htmlhelp\t\t\tchm\napplication/vnd.ms-ims\t\t\t\tims\napplication/vnd.ms-lrm\t\t\t\tlrm\napplication/vnd.ms-officetheme\t\t\tthmx\napplication/vnd.ms-pki.seccat\t\t\tcat\napplication/vnd.ms-pki.stl\t\t\tstl\napplication/vnd.ms-powerpoint\t\t\tppt pps pot\napplication/vnd.ms-powerpoint.addin.macroenabled.12\t\tppam\napplication/vnd.ms-powerpoint.presentation.macroenabled.12\tpptm\napplication/vnd.ms-powerpoint.slide.macroenabled.12\t\tsldm\napplication/vnd.ms-powerpoint.slideshow.macroenabled.12\t\tppsm\napplication/vnd.ms-powerpoint.template.macroenabled.12\t\tpotm\napplication/vnd.ms-project\t\t\tmpp mpt\napplication/vnd.ms-word.document.macroenabled.12\tdocm\napplication/vnd.ms-word.template.macroenabled.12\tdotm\napplication/vnd.ms-works\t\t\twps wks wcm wdb\napplication/vnd.ms-wpl\t\t\t\twpl\napplication/vnd.ms-xpsdocument\t\t\txps\napplication/vnd.mseq\t\t\t\tmseq\napplication/vnd.musician\t\t\tmus\napplication/vnd.muvee.style\t\t\tmsty\napplication/vnd.mynfc\t\t\t\ttaglet\napplication/vnd.neurolanguage.nlu\t\tnlu\napplication/vnd.nitf\t\t\t\tntf nitf\napplication/vnd.noblenet-directory\t\tnnd\napplication/vnd.noblenet-sealer\t\t\tnns\napplication/vnd.noblenet-web\t\t\tnnw\napplication/vnd.nokia.n-gage.data\t\tngdat\napplication/vnd.nokia.n-gage.symbian.install\tn-gage\napplication/vnd.nokia.radio-preset\t\trpst\napplication/vnd.nokia.radio-presets\t\trpss\napplication/vnd.novadigm.edm\t\t\tedm\napplication/vnd.novadigm.edx\t\t\tedx\napplication/vnd.novadigm.ext\t\t\text\napplication/vnd.oasis.opendocument.chart\t\todc\napplication/vnd.oasis.opendocument.chart-template\totc\napplication/vnd.oasis.opendocument.database\t\todb\napplication/vnd.oasis.opendocument.formula\t\todf\napplication/vnd.oasis.opendocument.formula-template\todft\napplication/vnd.oasis.opendocument.graphics\t\todg\napplication/vnd.oasis.opendocument.graphics-template\totg\napplication/vnd.oasis.opendocument.image\t\todi\napplication/vnd.oasis.opendocument.image-template\toti\napplication/vnd.oasis.opendocument.presentation\t\todp\napplication/vnd.oasis.opendocument.presentation-template\totp\napplication/vnd.oasis.opendocument.spreadsheet\t\tods\napplication/vnd.oasis.opendocument.spreadsheet-template\tots\napplication/vnd.oasis.opendocument.text\t\t\todt\napplication/vnd.oasis.opendocument.text-master\t\todm\napplication/vnd.oasis.opendocument.text-template\tott\napplication/vnd.oasis.opendocument.text-web\t\toth\napplication/vnd.olpc-sugar\t\t\txo\napplication/vnd.oma.dd2+xml\t\t\tdd2\napplication/vnd.openofficeorg.extension\t\toxt\napplication/vnd.openxmlformats-officedocument.presentationml.presentation\tpptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide\tsldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow\tppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template\tpotx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet\txlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template\txltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document\tdocx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template\tdotx\napplication/vnd.osgeo.mapguide.package\t\tmgp\napplication/vnd.osgi.dp\t\t\t\tdp\napplication/vnd.osgi.subsystem\t\t\tesa\napplication/vnd.palm\t\t\t\tpdb pqa oprc\napplication/vnd.pawaafile\t\t\tpaw\napplication/vnd.pg.format\t\t\tstr\napplication/vnd.pg.osasli\t\t\tei6\napplication/vnd.picsel\t\t\t\tefif\napplication/vnd.pmi.widget\t\t\twg\napplication/vnd.pocketlearn\t\t\tplf\napplication/vnd.powerbuilder6\t\t\tpbd\napplication/vnd.previewsystems.box\t\tbox\napplication/vnd.proteus.magazine\t\tmgz\napplication/vnd.publishare-delta-tree\t\tqps\napplication/vnd.pvi.ptid1\t\t\tptid\napplication/vnd.quark.quarkxpress\t\tqxd qxt qwd qwt qxl qxb\napplication/vnd.realvnc.bed\t\t\tbed\napplication/vnd.recordare.musicxml\t\tmxl\napplication/vnd.recordare.musicxml+xml\t\tmusicxml\napplication/vnd.rig.cryptonote\t\t\tcryptonote\napplication/vnd.rim.cod\t\t\t\tcod\napplication/vnd.rn-realmedia\t\t\trm\napplication/vnd.rn-realmedia-vbr\t\trmvb\napplication/vnd.route66.link66+xml\t\tlink66\napplication/vnd.sailingtracker.track\t\tst\napplication/vnd.seemail\t\t\t\tsee\napplication/vnd.sema\t\t\t\tsema\napplication/vnd.semd\t\t\t\tsemd\napplication/vnd.semf\t\t\t\tsemf\napplication/vnd.shana.informed.formdata\t\tifm\napplication/vnd.shana.informed.formtemplate\titp\napplication/vnd.shana.informed.interchange\tiif\napplication/vnd.shana.informed.package\t\tipk\napplication/vnd.simtech-mindmapper\t\ttwd twds\napplication/vnd.smaf\t\t\t\tmmf\napplication/vnd.smart.teacher\t\t\tteacher\napplication/vnd.solent.sdkm+xml\t\t\tsdkm sdkd\napplication/vnd.spotfire.dxp\t\t\tdxp\napplication/vnd.spotfire.sfs\t\t\tsfs\napplication/vnd.stardivision.calc\t\tsdc\napplication/vnd.stardivision.draw\t\tsda\napplication/vnd.stardivision.impress\t\tsdd\napplication/vnd.stardivision.math\t\tsmf\napplication/vnd.stardivision.writer\t\tsdw vor\napplication/vnd.stardivision.writer-global\tsgl\napplication/vnd.stepmania.package\t\tsmzip\napplication/vnd.stepmania.stepchart\t\tsm\napplication/vnd.sun.xml.calc\t\t\tsxc\napplication/vnd.sun.xml.calc.template\t\tstc\napplication/vnd.sun.xml.draw\t\t\tsxd\napplication/vnd.sun.xml.draw.template\t\tstd\napplication/vnd.sun.xml.impress\t\t\tsxi\napplication/vnd.sun.xml.impress.template\tsti\napplication/vnd.sun.xml.math\t\t\tsxm\napplication/vnd.sun.xml.writer\t\t\tsxw\napplication/vnd.sun.xml.writer.global\t\tsxg\napplication/vnd.sun.xml.writer.template\t\tstw\napplication/vnd.sus-calendar\t\t\tsus susp\napplication/vnd.svd\t\t\t\tsvd\napplication/vnd.symbian.install\t\t\tsis sisx\napplication/vnd.syncml+xml\t\t\txsm\napplication/vnd.syncml.dm+wbxml\t\t\tbdm\napplication/vnd.syncml.dm+xml\t\t\txdm\napplication/vnd.tao.intent-module-archive\ttao\napplication/vnd.tcpdump.pcap\t\t\tpcap cap dmp\napplication/vnd.tmobile-livetv\t\t\ttmo\napplication/vnd.trid.tpt\t\t\ttpt\napplication/vnd.triscape.mxs\t\t\tmxs\napplication/vnd.trueapp\t\t\t\ttra\napplication/vnd.ufdl\t\t\t\tufd ufdl\napplication/vnd.uiq.theme\t\t\tutz\napplication/vnd.umajin\t\t\t\tumj\napplication/vnd.unity\t\t\t\tunityweb\napplication/vnd.uoml+xml\t\t\tuoml\napplication/vnd.vcx\t\t\t\tvcx\napplication/vnd.visio\t\t\t\tvsd vst vss vsw\napplication/vnd.visionary\t\t\tvis\napplication/vnd.vsf\t\t\t\tvsf\napplication/vnd.wap.wbxml\t\t\twbxml\napplication/vnd.wap.wmlc\t\t\twmlc\napplication/vnd.wap.wmlscriptc\t\t\twmlsc\napplication/vnd.webturbo\t\t\twtb\napplication/vnd.wolfram.player\t\t\tnbp\napplication/vnd.wordperfect\t\t\twpd\napplication/vnd.wqd\t\t\t\twqd\napplication/vnd.wt.stf\t\t\t\tstf\napplication/vnd.xara\t\t\t\txar\napplication/vnd.xfdl\t\t\t\txfdl\napplication/vnd.yamaha.hv-dic\t\t\thvd\napplication/vnd.yamaha.hv-script\t\thvs\napplication/vnd.yamaha.hv-voice\t\t\thvp\napplication/vnd.yamaha.openscoreformat\t\t\tosf\napplication/vnd.yamaha.openscoreformat.osfpvg+xml\tosfpvg\napplication/vnd.yamaha.smaf-audio\t\tsaf\napplication/vnd.yamaha.smaf-phrase\t\tspf\napplication/vnd.yellowriver-custom-menu\t\tcmp\napplication/vnd.zul\t\t\t\tzir zirz\napplication/vnd.zzazz.deck+xml\t\t\tzaz\napplication/voicexml+xml\t\t\tvxml\napplication/wasm\t\t\t\twasm\napplication/widget\t\t\t\twgt\napplication/winhlp\t\t\t\thlp\napplication/wsdl+xml\t\t\t\twsdl\napplication/wspolicy+xml\t\t\twspolicy\napplication/x-7z-compressed\t\t\t7z\napplication/x-abiword\t\t\t\tabw\napplication/x-ace-compressed\t\t\tace\napplication/x-apple-diskimage\t\t\tdmg\napplication/x-authorware-bin\t\t\taab x32 u32 vox\napplication/x-authorware-map\t\t\taam\napplication/x-authorware-seg\t\t\taas\napplication/x-bcpio\t\t\t\tbcpio\napplication/x-bittorrent\t\t\ttorrent\napplication/x-blorb\t\t\t\tblb blorb\napplication/x-bzip\t\t\t\tbz\napplication/x-bzip2\t\t\t\tbz2 boz\napplication/x-cbr\t\t\t\tcbr cba cbt cbz cb7\napplication/x-cdlink\t\t\t\tvcd\napplication/x-cfs-compressed\t\t\tcfs\napplication/x-chat\t\t\t\tchat\napplication/x-chess-pgn\t\t\t\tpgn\napplication/x-conference\t\t\tnsc\napplication/x-cpio\t\t\t\tcpio\napplication/x-csh\t\t\t\tcsh\napplication/x-debian-package\t\t\tdeb udeb\napplication/x-dgc-compressed\t\t\tdgc\napplication/x-director\t\t\tdir dcr dxr cst cct cxt w3d fgd swa\napplication/x-doom\t\t\t\twad\napplication/x-dtbncx+xml\t\t\tncx\napplication/x-dtbook+xml\t\t\tdtb\napplication/x-dtbresource+xml\t\t\tres\napplication/x-dvi\t\t\t\tdvi\napplication/x-envoy\t\t\t\tevy\napplication/x-eva\t\t\t\teva\napplication/x-font-bdf\t\t\t\tbdf\napplication/x-font-ghostscript\t\t\tgsf\napplication/x-font-linux-psf\t\t\tpsf\napplication/x-font-pcf\t\t\t\tpcf\napplication/x-font-snf\t\t\t\tsnf\napplication/x-font-type1\t\t\tpfa pfb pfm afm\napplication/x-freearc\t\t\t\tarc\napplication/x-futuresplash\t\t\tspl\napplication/x-gca-compressed\t\t\tgca\napplication/x-glulx\t\t\t\tulx\napplication/x-gnumeric\t\t\t\tgnumeric\napplication/x-gramps-xml\t\t\tgramps\napplication/x-gtar\t\t\t\tgtar\napplication/x-hdf\t\t\t\thdf\napplication/x-install-instructions\t\tinstall\napplication/x-iso9660-image\t\t\tiso\napplication/x-java-jnlp-file\t\t\tjnlp\napplication/x-latex\t\t\t\tlatex\napplication/x-lzh-compressed\t\t\tlzh lha\napplication/x-mie\t\t\t\tmie\napplication/x-mobipocket-ebook\t\t\tprc mobi\napplication/x-ms-application\t\t\tapplication\napplication/x-ms-shortcut\t\t\tlnk\napplication/x-ms-wmd\t\t\t\twmd\napplication/x-ms-wmz\t\t\t\twmz\napplication/x-ms-xbap\t\t\t\txbap\napplication/x-msaccess\t\t\t\tmdb\napplication/x-msbinder\t\t\t\tobd\napplication/x-mscardfile\t\t\tcrd\napplication/x-msclip\t\t\t\tclp\napplication/x-msdownload\t\t\texe dll com bat msi\napplication/x-msmediaview\t\t\tmvb m13 m14\napplication/x-msmetafile\t\t\twmf wmz emf emz\napplication/x-msmoney\t\t\t\tmny\napplication/x-mspublisher\t\t\tpub\napplication/x-msschedule\t\t\tscd\napplication/x-msterminal\t\t\ttrm\napplication/x-mswrite\t\t\t\twri\napplication/x-netcdf\t\t\t\tnc cdf\napplication/x-nzb\t\t\t\tnzb\napplication/x-pkcs12\t\t\t\tp12 pfx\napplication/x-pkcs7-certificates\t\tp7b spc\napplication/x-pkcs7-certreqresp\t\t\tp7r\napplication/x-rar-compressed\t\t\trar\napplication/x-research-info-systems\t\tris\napplication/x-sh\t\t\t\tsh\napplication/x-shar\t\t\t\tshar\napplication/x-shockwave-flash\t\t\tswf\napplication/x-silverlight-app\t\t\txap\napplication/x-sql\t\t\t\tsql\napplication/x-stuffit\t\t\t\tsit\napplication/x-stuffitx\t\t\t\tsitx\napplication/x-subrip\t\t\t\tsrt\napplication/x-sv4cpio\t\t\t\tsv4cpio\napplication/x-sv4crc\t\t\t\tsv4crc\napplication/x-t3vm-image\t\t\tt3\napplication/x-tads\t\t\t\tgam\napplication/x-tar\t\t\t\ttar\napplication/x-tcl\t\t\t\ttcl\napplication/x-tex\t\t\t\ttex\napplication/x-tex-tfm\t\t\t\ttfm\napplication/x-texinfo\t\t\t\ttexinfo texi\napplication/x-tgif\t\t\t\tobj\napplication/x-ustar\t\t\t\tustar\napplication/x-wais-source\t\t\tsrc\napplication/x-x509-ca-cert\t\t\tder crt\napplication/x-xfig\t\t\t\tfig\napplication/x-xliff+xml\t\t\t\txlf\napplication/x-xpinstall\t\t\t\txpi\napplication/x-xz\t\t\t\txz\napplication/x-zmachine\t\t\t\tz1 z2 z3 z4 z5 z6 z7 z8\napplication/xaml+xml\t\t\t\txaml\napplication/xcap-diff+xml\t\t\txdf\napplication/xenc+xml\t\t\t\txenc\napplication/xhtml+xml\t\t\t\txhtml xht\napplication/xml\t\t\t\t\txml xsl\napplication/xml-dtd\t\t\t\tdtd\napplication/xop+xml\t\t\t\txop\napplication/xproc+xml\t\t\t\txpl\napplication/xslt+xml\t\t\t\txslt\napplication/xspf+xml\t\t\t\txspf\napplication/xv+xml\t\t\t\tmxml xhvml xvml xvm\napplication/yang\t\t\t\tyang\napplication/yin+xml\t\t\t\tyin\napplication/zip\t\t\t\t\tzip\naudio/adpcm\t\t\t\t\tadp\naudio/basic\t\t\t\t\tau snd\naudio/midi\t\t\t\t\tmid midi kar rmi\naudio/mp4\t\t\t\t\tm4a mp4a\naudio/mpeg\t\t\t\t\tmpga mp2 mp2a mp3 m2a m3a\naudio/ogg\t\t\t\t\toga ogg spx\naudio/s3m\t\t\t\t\ts3m\naudio/silk\t\t\t\t\tsil\naudio/vnd.dece.audio\t\t\t\tuva uvva\naudio/vnd.digital-winds\t\t\t\teol\naudio/vnd.dra\t\t\t\t\tdra\naudio/vnd.dts\t\t\t\t\tdts\naudio/vnd.dts.hd\t\t\t\tdtshd\naudio/vnd.lucent.voice\t\t\t\tlvp\naudio/vnd.ms-playready.media.pya\t\tpya\naudio/vnd.nuera.ecelp4800\t\t\tecelp4800\naudio/vnd.nuera.ecelp7470\t\t\tecelp7470\naudio/vnd.nuera.ecelp9600\t\t\tecelp9600\naudio/vnd.rip\t\t\t\t\trip\naudio/webm\t\t\t\t\tweba\naudio/x-aac\t\t\t\t\taac\naudio/x-aiff\t\t\t\t\taif aiff aifc\naudio/x-caf\t\t\t\t\tcaf\naudio/x-flac\t\t\t\t\tflac\naudio/x-matroska\t\t\t\tmka\naudio/x-mpegurl\t\t\t\t\tm3u\naudio/x-ms-wax\t\t\t\t\twax\naudio/x-ms-wma\t\t\t\t\twma\naudio/x-pn-realaudio\t\t\t\tram ra\naudio/x-pn-realaudio-plugin\t\t\trmp\naudio/x-wav\t\t\t\t\twav\naudio/xm\t\t\t\t\txm\nchemical/x-cdx\t\t\t\t\tcdx\nchemical/x-cif\t\t\t\t\tcif\nchemical/x-cmdf\t\t\t\t\tcmdf\nchemical/x-cml\t\t\t\t\tcml\nchemical/x-csml\t\t\t\t\tcsml\nchemical/x-xyz\t\t\t\t\txyz\nfont/collection\t\t\t\t\tttc\nfont/otf\t\t\t\t\totf\nfont/ttf\t\t\t\t\tttf\nfont/woff\t\t\t\t\twoff\nfont/woff2\t\t\t\t\twoff2\nimage/bmp\t\t\t\t\tbmp\nimage/cgm\t\t\t\t\tcgm\nimage/g3fax\t\t\t\t\tg3\nimage/gif\t\t\t\t\tgif\nimage/ief\t\t\t\t\tief\nimage/jpeg\t\t\t\t\tjpeg jpg jpe\nimage/ktx\t\t\t\t\tktx\nimage/png\t\t\t\t\tpng\nimage/prs.btif\t\t\t\t\tbtif\nimage/sgi\t\t\t\t\tsgi\nimage/svg+xml\t\t\t\t\tsvg svgz\nimage/tiff\t\t\t\t\ttiff tif\nimage/vnd.adobe.photoshop\t\t\tpsd\nimage/vnd.dece.graphic\t\t\t\tuvi uvvi uvg uvvg\nimage/vnd.djvu\t\t\t\t\tdjvu djv\nimage/vnd.dvb.subtitle\t\t\t\tsub\nimage/vnd.dwg\t\t\t\t\tdwg\nimage/vnd.dxf\t\t\t\t\tdxf\nimage/vnd.fastbidsheet\t\t\t\tfbs\nimage/vnd.fpx\t\t\t\t\tfpx\nimage/vnd.fst\t\t\t\t\tfst\nimage/vnd.fujixerox.edmics-mmr\t\t\tmmr\nimage/vnd.fujixerox.edmics-rlc\t\t\trlc\nimage/vnd.ms-modi\t\t\t\tmdi\nimage/vnd.ms-photo\t\t\t\twdp\nimage/vnd.net-fpx\t\t\t\tnpx\nimage/vnd.wap.wbmp\t\t\t\twbmp\nimage/vnd.xiff\t\t\t\t\txif\nimage/webp\t\t\t\t\twebp\nimage/x-3ds\t\t\t\t\t3ds\nimage/x-cmu-raster\t\t\t\tras\nimage/x-cmx\t\t\t\t\tcmx\nimage/x-freehand\t\t\t\tfh fhc fh4 fh5 fh7\nimage/x-icon\t\t\t\t\tico\nimage/x-mrsid-image\t\t\t\tsid\nimage/x-pcx\t\t\t\t\tpcx\nimage/x-pict\t\t\t\t\tpic pct\nimage/x-portable-anymap\t\t\t\tpnm\nimage/x-portable-bitmap\t\t\t\tpbm\nimage/x-portable-graymap\t\t\tpgm\nimage/x-portable-pixmap\t\t\t\tppm\nimage/x-rgb\t\t\t\t\trgb\nimage/x-tga\t\t\t\t\ttga\nimage/x-xbitmap\t\t\t\t\txbm\nimage/x-xpixmap\t\t\t\t\txpm\nimage/x-xwindowdump\t\t\t\txwd\nmessage/rfc822\t\t\t\t\teml mime\nmodel/iges\t\t\t\t\tigs iges\nmodel/mesh\t\t\t\t\tmsh mesh silo\nmodel/vnd.collada+xml\t\t\t\tdae\nmodel/vnd.dwf\t\t\t\t\tdwf\nmodel/vnd.gdl\t\t\t\t\tgdl\nmodel/vnd.gtw\t\t\t\t\tgtw\nmodel/vnd.mts\t\t\t\t\tmts\nmodel/vnd.vtu\t\t\t\t\tvtu\nmodel/vrml\t\t\t\t\twrl vrml\nmodel/x3d+binary\t\t\t\tx3db x3dbz\nmodel/x3d+vrml\t\t\t\t\tx3dv x3dvz\nmodel/x3d+xml\t\t\t\t\tx3d x3dz\ntext/cache-manifest\t\t\t\tappcache\ntext/calendar\t\t\t\t\tics ifb\ntext/css\t\t\t\t\tcss\ntext/csv\t\t\t\t\tcsv\ntext/html\t\t\t\t\thtml htm\ntext/n3\t\t\t\t\t\tn3\ntext/plain\t\t\t\t\ttxt text conf def list log in\ntext/prs.lines.tag\t\t\t\tdsc\ntext/richtext\t\t\t\t\trtx\ntext/sgml\t\t\t\t\tsgml sgm\ntext/tab-separated-values\t\t\ttsv\ntext/troff\t\t\t\t\tt tr roff man me ms\ntext/turtle\t\t\t\t\tttl\ntext/uri-list\t\t\t\t\turi uris urls\ntext/vcard\t\t\t\t\tvcard\ntext/vnd.curl\t\t\t\t\tcurl\ntext/vnd.curl.dcurl\t\t\t\tdcurl\ntext/vnd.curl.mcurl\t\t\t\tmcurl\ntext/vnd.curl.scurl\t\t\t\tscurl\ntext/vnd.dvb.subtitle\t\t\t\tsub\ntext/vnd.fly\t\t\t\t\tfly\ntext/vnd.fmi.flexstor\t\t\t\tflx\ntext/vnd.graphviz\t\t\t\tgv\ntext/vnd.in3d.3dml\t\t\t\t3dml\ntext/vnd.in3d.spot\t\t\t\tspot\ntext/vnd.sun.j2me.app-descriptor\t\tjad\ntext/vnd.wap.wml\t\t\t\twml\ntext/vnd.wap.wmlscript\t\t\t\twmls\ntext/x-asm\t\t\t\t\ts asm\ntext/x-c\t\t\t\t\tc cc cxx cpp h hh dic\ntext/x-fortran\t\t\t\t\tf for f77 f90\ntext/x-java-source\t\t\t\tjava\ntext/x-nfo\t\t\t\t\tnfo\ntext/x-opml\t\t\t\t\topml\ntext/x-pascal\t\t\t\t\tp pas\ntext/x-setext\t\t\t\t\tetx\ntext/x-sfv\t\t\t\t\tsfv\ntext/x-uuencode\t\t\t\t\tuu\ntext/x-vcalendar\t\t\t\tvcs\ntext/x-vcard\t\t\t\t\tvcf\nvideo/3gpp\t\t\t\t\t3gp\nvideo/3gpp2\t\t\t\t\t3g2\nvideo/h261\t\t\t\t\th261\nvideo/h263\t\t\t\t\th263\nvideo/h264\t\t\t\t\th264\nvideo/jpeg\t\t\t\t\tjpgv\nvideo/jpm\t\t\t\t\tjpm jpgm\nvideo/mj2\t\t\t\t\tmj2 mjp2\nvideo/mp4\t\t\t\t\tmp4 mp4v mpg4\nvideo/mpeg\t\t\t\t\tmpeg mpg mpe m1v m2v\nvideo/ogg\t\t\t\t\togv\nvideo/quicktime\t\t\t\t\tqt mov\nvideo/vnd.dece.hd\t\t\t\tuvh uvvh\nvideo/vnd.dece.mobile\t\t\t\tuvm uvvm\nvideo/vnd.dece.pd\t\t\t\tuvp uvvp\nvideo/vnd.dece.sd\t\t\t\tuvs uvvs\nvideo/vnd.dece.video\t\t\t\tuvv uvvv\nvideo/vnd.dvb.file\t\t\t\tdvb\nvideo/vnd.fvt\t\t\t\t\tfvt\nvideo/vnd.mpegurl\t\t\t\tmxu m4u\nvideo/vnd.ms-playready.media.pyv\t\tpyv\nvideo/vnd.uvvu.mp4\t\t\t\tuvu uvvu\nvideo/vnd.vivo\t\t\t\t\tviv\nvideo/webm\t\t\t\t\twebm\nvideo/x-f4v\t\t\t\t\tf4v\nvideo/x-fli\t\t\t\t\tfli\nvideo/x-flv\t\t\t\t\tflv\nvideo/x-m4v\t\t\t\t\tm4v\nvideo/x-matroska\t\t\t\tmkv mk3d mks\nvideo/x-mng\t\t\t\t\tmng\nvideo/x-ms-asf\t\t\t\t\tasf asx\nvideo/x-ms-vob\t\t\t\t\tvob\nvideo/x-ms-wm\t\t\t\t\twm\nvideo/x-ms-wmv\t\t\t\t\twmv\nvideo/x-ms-wmx\t\t\t\t\twmx\nvideo/x-ms-wvx\t\t\t\t\twvx\nvideo/x-msvideo\t\t\t\t\tavi\nvideo/x-sgi-movie\t\t\t\tmovie\nvideo/x-smv\t\t\t\t\tsmv\nx-conference/x-cooltalk\t\t\t\tice\n";

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

	const read =  (file) => fs.readFileSync(path.resolve(build_dir, file))
		;

	return (req, res, next) => {
		if (filter(req)) {
			const type = lookup$1(req.path);

			try {
				const file = decodeURIComponent(req.path.slice(1));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL2Jsb2cvX3Bvc3RzLmpzIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9ibG9nL2luZGV4Lmpzb24uanMiLCIuLi8uLi8uLi9zcmMvcm91dGVzL2Jsb2cvW3NsdWddLmpzb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jbHN4L2Rpc3QvY2xzeC5tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy91dGlscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWJJdGVtLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NhcmRCb2R5LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZEhlYWRlci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NhcmRUZXh0LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvUm93LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ2FyZEZvb3Rlci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL1RhYmxlLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0Rhc2hib2FyZENhcmQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQ3VzdG9tQ2FyZC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9UYWJsZS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DaGFydHMvQXJlYUNoYXJ0LnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL2luZGV4LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRm9ybS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0Zvcm1Hcm91cC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0xhYmVsLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DaGFydHMvUGllQ2hhcnQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9jaGFydHMuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Db250YWluZXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9wYWdlcy9fbGF5b3V0LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQ29sLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL3BhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9ibG9nL2luZGV4LnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvYmxvZy9bc2x1Z10uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9OYXZiYXIuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9OYXZiYXJCcmFuZC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL05hdi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkNvbnRleHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0Ryb3Bkb3duLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvVW5jb250cm9sbGVkRHJvcGRvd24uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93blRvZ2dsZS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0Ryb3Bkb3duTWVudS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0Ryb3Bkb3duSXRlbS5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0xpc3RHcm91cC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0lucHV0R3JvdXAuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwQWRkb24uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTmF2YmFyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NpZGViYXJJdGVtLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NpZGViYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9fbGF5b3V0LnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2Vycm9yLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9tYW5pZmVzdC1zZXJ2ZXIubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvQXBwLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9zZXJ2ZXIubWpzIiwiLi4vLi4vLi4vc3JjL3NlcnZlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPcmRpbmFyaWx5LCB5b3UnZCBnZW5lcmF0ZSB0aGlzIGRhdGEgZnJvbSBtYXJrZG93biBmaWxlcyBpbiB5b3VyXHJcbi8vIHJlcG8sIG9yIGZldGNoIHRoZW0gZnJvbSBhIGRhdGFiYXNlIG9mIHNvbWUga2luZC4gQnV0IGluIG9yZGVyIHRvXHJcbi8vIGF2b2lkIHVubmVjZXNzYXJ5IGRlcGVuZGVuY2llcyBpbiB0aGUgc3RhcnRlciB0ZW1wbGF0ZSwgYW5kIGluIHRoZVxyXG4vLyBzZXJ2aWNlIG9mIG9idmlvdXNuZXNzLCB3ZSdyZSBqdXN0IGdvaW5nIHRvIGxlYXZlIGl0IGhlcmUuXHJcblxyXG4vLyBUaGlzIGZpbGUgaXMgY2FsbGVkIGBfcG9zdHMuanNgIHJhdGhlciB0aGFuIGBwb3N0cy5qc2AsIGJlY2F1c2VcclxuLy8gd2UgZG9uJ3Qgd2FudCB0byBjcmVhdGUgYW4gYC9ibG9nL3Bvc3RzYCByb3V0ZSDigJQgdGhlIGxlYWRpbmdcclxuLy8gdW5kZXJzY29yZSB0ZWxscyBTYXBwZXIgbm90IHRvIGRvIHRoYXQuXHJcblxyXG5jb25zdCBwb3N0cyA9IFtcclxuXHR7XHJcblx0XHR0aXRsZTogJ1doYXQgaXMgU2FwcGVyPycsXHJcblx0XHRzbHVnOiAnd2hhdC1pcy1zYXBwZXInLFxyXG5cdFx0aHRtbDogYFxyXG5cdFx0XHQ8cD5GaXJzdCwgeW91IGhhdmUgdG8ga25vdyB3aGF0IDxhIGhyZWY9J2h0dHBzOi8vc3ZlbHRlLmRldic+U3ZlbHRlPC9hPiBpcy4gU3ZlbHRlIGlzIGEgVUkgZnJhbWV3b3JrIHdpdGggYSBib2xkIG5ldyBpZGVhOiByYXRoZXIgdGhhbiBwcm92aWRpbmcgYSBsaWJyYXJ5IHRoYXQgeW91IHdyaXRlIGNvZGUgd2l0aCAobGlrZSBSZWFjdCBvciBWdWUsIGZvciBleGFtcGxlKSwgaXQncyBhIGNvbXBpbGVyIHRoYXQgdHVybnMgeW91ciBjb21wb25lbnRzIGludG8gaGlnaGx5IG9wdGltaXplZCB2YW5pbGxhIEphdmFTY3JpcHQuIElmIHlvdSBoYXZlbid0IGFscmVhZHkgcmVhZCB0aGUgPGEgaHJlZj0naHR0cHM6Ly9zdmVsdGUuZGV2L2Jsb2cvZnJhbWV3b3Jrcy13aXRob3V0LXRoZS1mcmFtZXdvcmsnPmludHJvZHVjdG9yeSBibG9nIHBvc3Q8L2E+LCB5b3Ugc2hvdWxkITwvcD5cclxuXHJcblx0XHRcdDxwPlNhcHBlciBpcyBhIE5leHQuanMtc3R5bGUgZnJhbWV3b3JrICg8YSBocmVmPSdibG9nL2hvdy1pcy1zYXBwZXItZGlmZmVyZW50LWZyb20tbmV4dCc+bW9yZSBvbiB0aGF0IGhlcmU8L2E+KSBidWlsdCBhcm91bmQgU3ZlbHRlLiBJdCBtYWtlcyBpdCBlbWJhcnJhc3NpbmdseSBlYXN5IHRvIGNyZWF0ZSBleHRyZW1lbHkgaGlnaCBwZXJmb3JtYW5jZSB3ZWIgYXBwcy4gT3V0IG9mIHRoZSBib3gsIHlvdSBnZXQ6PC9wPlxyXG5cclxuXHRcdFx0PHVsPlxyXG5cdFx0XHRcdDxsaT5Db2RlLXNwbGl0dGluZywgZHluYW1pYyBpbXBvcnRzIGFuZCBob3QgbW9kdWxlIHJlcGxhY2VtZW50LCBwb3dlcmVkIGJ5IHdlYnBhY2s8L2xpPlxyXG5cdFx0XHRcdDxsaT5TZXJ2ZXItc2lkZSByZW5kZXJpbmcgKFNTUikgd2l0aCBjbGllbnQtc2lkZSBoeWRyYXRpb248L2xpPlxyXG5cdFx0XHRcdDxsaT5TZXJ2aWNlIHdvcmtlciBmb3Igb2ZmbGluZSBzdXBwb3J0LCBhbmQgYWxsIHRoZSBQV0EgYmVsbHMgYW5kIHdoaXN0bGVzPC9saT5cclxuXHRcdFx0XHQ8bGk+VGhlIG5pY2VzdCBkZXZlbG9wbWVudCBleHBlcmllbmNlIHlvdSd2ZSBldmVyIGhhZCwgb3IgeW91ciBtb25leSBiYWNrPC9saT5cclxuXHRcdFx0PC91bD5cclxuXHJcblx0XHRcdDxwPkl0J3MgaW1wbGVtZW50ZWQgYXMgRXhwcmVzcyBtaWRkbGV3YXJlLiBFdmVyeXRoaW5nIGlzIHNldCB1cCBhbmQgd2FpdGluZyBmb3IgeW91IHRvIGdldCBzdGFydGVkLCBidXQgeW91IGtlZXAgY29tcGxldGUgY29udHJvbCBvdmVyIHRoZSBzZXJ2ZXIsIHNlcnZpY2Ugd29ya2VyLCB3ZWJwYWNrIGNvbmZpZyBhbmQgZXZlcnl0aGluZyBlbHNlLCBzbyBpdCdzIGFzIGZsZXhpYmxlIGFzIHlvdSBuZWVkIGl0IHRvIGJlLjwvcD5cclxuXHRcdGBcclxuXHR9LFxyXG5cclxuXHR7XHJcblx0XHR0aXRsZTogJ0hvdyB0byB1c2UgU2FwcGVyJyxcclxuXHRcdHNsdWc6ICdob3ctdG8tdXNlLXNhcHBlcicsXHJcblx0XHRodG1sOiBgXHJcblx0XHRcdDxoMj5TdGVwIG9uZTwvaDI+XHJcblx0XHRcdDxwPkNyZWF0ZSBhIG5ldyBwcm9qZWN0LCB1c2luZyA8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vUmljaC1IYXJyaXMvZGVnaXQnPmRlZ2l0PC9hPjo8L3A+XHJcblxyXG5cdFx0XHQ8cHJlPjxjb2RlPm5weCBkZWdpdCBcInN2ZWx0ZWpzL3NhcHBlci10ZW1wbGF0ZSNyb2xsdXBcIiBteS1hcHBcclxuXHRcdFx0Y2QgbXktYXBwXHJcblx0XHRcdG5wbSBpbnN0YWxsICMgb3IgeWFybiFcclxuXHRcdFx0bnBtIHJ1biBkZXZcclxuXHRcdFx0PC9jb2RlPjwvcHJlPlxyXG5cclxuXHRcdFx0PGgyPlN0ZXAgdHdvPC9oMj5cclxuXHRcdFx0PHA+R28gdG8gPGEgaHJlZj0naHR0cDovL2xvY2FsaG9zdDozMDAwJz5sb2NhbGhvc3Q6MzAwMDwvYT4uIE9wZW4gPGNvZGU+bXktYXBwPC9jb2RlPiBpbiB5b3VyIGVkaXRvci4gRWRpdCB0aGUgZmlsZXMgaW4gdGhlIDxjb2RlPnNyYy9yb3V0ZXM8L2NvZGU+IGRpcmVjdG9yeSBvciBhZGQgbmV3IG9uZXMuPC9wPlxyXG5cclxuXHRcdFx0PGgyPlN0ZXAgdGhyZWU8L2gyPlxyXG5cdFx0XHQ8cD4uLi48L3A+XHJcblxyXG5cdFx0XHQ8aDI+U3RlcCBmb3VyPC9oMj5cclxuXHRcdFx0PHA+UmVzaXN0IG92ZXJkb25lIGpva2UgZm9ybWF0cy48L3A+XHJcblx0XHRgXHJcblx0fSxcclxuXHJcblx0e1xyXG5cdFx0dGl0bGU6ICdXaHkgdGhlIG5hbWU/JyxcclxuXHRcdHNsdWc6ICd3aHktdGhlLW5hbWUnLFxyXG5cdFx0aHRtbDogYFxyXG5cdFx0XHQ8cD5JbiB3YXIsIHRoZSBzb2xkaWVycyB3aG8gYnVpbGQgYnJpZGdlcywgcmVwYWlyIHJvYWRzLCBjbGVhciBtaW5lZmllbGRzIGFuZCBjb25kdWN0IGRlbW9saXRpb25zIOKAlCBhbGwgdW5kZXIgY29tYmF0IGNvbmRpdGlvbnMg4oCUIGFyZSBrbm93biBhcyA8ZW0+c2FwcGVyczwvZW0+LjwvcD5cclxuXHJcblx0XHRcdDxwPkZvciB3ZWIgZGV2ZWxvcGVycywgdGhlIHN0YWtlcyBhcmUgZ2VuZXJhbGx5IGxvd2VyIHRoYW4gdGhvc2UgZm9yIGNvbWJhdCBlbmdpbmVlcnMuIEJ1dCB3ZSBmYWNlIG91ciBvd24gaG9zdGlsZSBlbnZpcm9ubWVudDogdW5kZXJwb3dlcmVkIGRldmljZXMsIHBvb3IgbmV0d29yayBjb25uZWN0aW9ucywgYW5kIHRoZSBjb21wbGV4aXR5IGluaGVyZW50IGluIGZyb250LWVuZCBlbmdpbmVlcmluZy4gU2FwcGVyLCB3aGljaCBpcyBzaG9ydCBmb3IgPHN0cm9uZz5TPC9zdHJvbmc+dmVsdGUgPHN0cm9uZz5hcHA8L3N0cm9uZz4gbWFrPHN0cm9uZz5lcjwvc3Ryb25nPiwgaXMgeW91ciBjb3VyYWdlb3VzIGFuZCBkdXRpZnVsIGFsbHkuPC9wPlxyXG5cdFx0YFxyXG5cdH0sXHJcblxyXG5cdHtcclxuXHRcdHRpdGxlOiAnSG93IGlzIFNhcHBlciBkaWZmZXJlbnQgZnJvbSBOZXh0LmpzPycsXHJcblx0XHRzbHVnOiAnaG93LWlzLXNhcHBlci1kaWZmZXJlbnQtZnJvbS1uZXh0JyxcclxuXHRcdGh0bWw6IGBcclxuXHRcdFx0PHA+PGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL3plaXQvbmV4dC5qcyc+TmV4dC5qczwvYT4gaXMgYSBSZWFjdCBmcmFtZXdvcmsgZnJvbSA8YSBocmVmPSdodHRwczovL3plaXQuY28nPlplaXQ8L2E+LCBhbmQgaXMgdGhlIGluc3BpcmF0aW9uIGZvciBTYXBwZXIuIFRoZXJlIGFyZSBhIGZldyBub3RhYmxlIGRpZmZlcmVuY2VzLCBob3dldmVyOjwvcD5cclxuXHJcblx0XHRcdDx1bD5cclxuXHRcdFx0XHQ8bGk+SXQncyBwb3dlcmVkIGJ5IDxhIGhyZWY9J2h0dHBzOi8vc3ZlbHRlLmRldic+U3ZlbHRlPC9hPiBpbnN0ZWFkIG9mIFJlYWN0LCBzbyBpdCdzIGZhc3RlciBhbmQgeW91ciBhcHBzIGFyZSBzbWFsbGVyPC9saT5cclxuXHRcdFx0XHQ8bGk+SW5zdGVhZCBvZiByb3V0ZSBtYXNraW5nLCB3ZSBlbmNvZGUgcm91dGUgcGFyYW1ldGVycyBpbiBmaWxlbmFtZXMuIEZvciBleGFtcGxlLCB0aGUgcGFnZSB5b3UncmUgbG9va2luZyBhdCByaWdodCBub3cgaXMgPGNvZGU+c3JjL3JvdXRlcy9ibG9nL1tzbHVnXS5odG1sPC9jb2RlPjwvbGk+XHJcblx0XHRcdFx0PGxpPkFzIHdlbGwgYXMgcGFnZXMgKFN2ZWx0ZSBjb21wb25lbnRzLCB3aGljaCByZW5kZXIgb24gc2VydmVyIG9yIGNsaWVudCksIHlvdSBjYW4gY3JlYXRlIDxlbT5zZXJ2ZXIgcm91dGVzPC9lbT4gaW4geW91ciA8Y29kZT5yb3V0ZXM8L2NvZGU+IGRpcmVjdG9yeS4gVGhlc2UgYXJlIGp1c3QgPGNvZGU+LmpzPC9jb2RlPiBmaWxlcyB0aGF0IGV4cG9ydCBmdW5jdGlvbnMgY29ycmVzcG9uZGluZyB0byBIVFRQIG1ldGhvZHMsIGFuZCByZWNlaXZlIEV4cHJlc3MgPGNvZGU+cmVxdWVzdDwvY29kZT4gYW5kIDxjb2RlPnJlc3BvbnNlPC9jb2RlPiBvYmplY3RzIGFzIGFyZ3VtZW50cy4gVGhpcyBtYWtlcyBpdCB2ZXJ5IGVhc3kgdG8sIGZvciBleGFtcGxlLCBhZGQgYSBKU09OIEFQSSBzdWNoIGFzIHRoZSBvbmUgPGEgaHJlZj0nYmxvZy9ob3ctaXMtc2FwcGVyLWRpZmZlcmVudC1mcm9tLW5leHQuanNvbic+cG93ZXJpbmcgdGhpcyB2ZXJ5IHBhZ2U8L2E+PC9saT5cclxuXHRcdFx0XHQ8bGk+TGlua3MgYXJlIGp1c3QgPGNvZGU+Jmx0O2EmZ3Q7PC9jb2RlPiBlbGVtZW50cywgcmF0aGVyIHRoYW4gZnJhbWV3b3JrLXNwZWNpZmljIDxjb2RlPiZsdDtMaW5rJmd0OzwvY29kZT4gY29tcG9uZW50cy4gVGhhdCBtZWFucywgZm9yIGV4YW1wbGUsIHRoYXQgPGEgaHJlZj0nYmxvZy9ob3ctY2FuLWktZ2V0LWludm9sdmVkJz50aGlzIGxpbmsgcmlnaHQgaGVyZTwvYT4sIGRlc3BpdGUgYmVpbmcgaW5zaWRlIGEgYmxvYiBvZiBIVE1MLCB3b3JrcyB3aXRoIHRoZSByb3V0ZXIgYXMgeW91J2QgZXhwZWN0LjwvbGk+XHJcblx0XHRcdDwvdWw+XHJcblx0XHRgXHJcblx0fSxcclxuXHJcblx0e1xyXG5cdFx0dGl0bGU6ICdIb3cgY2FuIEkgZ2V0IGludm9sdmVkPycsXHJcblx0XHRzbHVnOiAnaG93LWNhbi1pLWdldC1pbnZvbHZlZCcsXHJcblx0XHRodG1sOiBgXHJcblx0XHRcdDxwPldlJ3JlIHNvIGdsYWQgeW91IGFza2VkISBDb21lIG9uIG92ZXIgdG8gdGhlIDxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUnPlN2ZWx0ZTwvYT4gYW5kIDxhIGhyZWY9J2h0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zYXBwZXInPlNhcHBlcjwvYT4gcmVwb3MsIGFuZCBqb2luIHVzIGluIHRoZSA8YSBocmVmPSdodHRwczovL3N2ZWx0ZS5kZXYvY2hhdCc+RGlzY29yZCBjaGF0cm9vbTwvYT4uIEV2ZXJ5b25lIGlzIHdlbGNvbWUsIGVzcGVjaWFsbHkgeW91ITwvcD5cclxuXHRcdGBcclxuXHR9XHJcbl07XHJcblxyXG5wb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG5cdHBvc3QuaHRtbCA9IHBvc3QuaHRtbC5yZXBsYWNlKC9eXFx0ezN9L2dtLCAnJyk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcG9zdHM7XHJcbiIsImltcG9ydCBwb3N0cyBmcm9tICcuL19wb3N0cy5qcyc7XHJcblxyXG5jb25zdCBjb250ZW50cyA9IEpTT04uc3RyaW5naWZ5KHBvc3RzLm1hcChwb3N0ID0+IHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0dGl0bGU6IHBvc3QudGl0bGUsXHJcblx0XHRzbHVnOiBwb3N0LnNsdWdcclxuXHR9O1xyXG59KSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHJlcSwgcmVzKSB7XHJcblx0cmVzLndyaXRlSGVhZCgyMDAsIHtcclxuXHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuXHR9KTtcclxuXHJcblx0cmVzLmVuZChjb250ZW50cyk7XHJcbn0iLCJpbXBvcnQgcG9zdHMgZnJvbSAnLi9fcG9zdHMuanMnO1xyXG5cclxuY29uc3QgbG9va3VwID0gbmV3IE1hcCgpO1xyXG5wb3N0cy5mb3JFYWNoKHBvc3QgPT4ge1xyXG5cdGxvb2t1cC5zZXQocG9zdC5zbHVnLCBKU09OLnN0cmluZ2lmeShwb3N0KSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldChyZXEsIHJlcywgbmV4dCkge1xyXG5cdC8vIHRoZSBgc2x1Z2AgcGFyYW1ldGVyIGlzIGF2YWlsYWJsZSBiZWNhdXNlXHJcblx0Ly8gdGhpcyBmaWxlIGlzIGNhbGxlZCBbc2x1Z10uanNvbi5qc1xyXG5cdGNvbnN0IHsgc2x1ZyB9ID0gcmVxLnBhcmFtcztcclxuXHJcblx0aWYgKGxvb2t1cC5oYXMoc2x1ZykpIHtcclxuXHRcdHJlcy53cml0ZUhlYWQoMjAwLCB7XHJcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJlcy5lbmQobG9va3VwLmdldChzbHVnKSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJlcy53cml0ZUhlYWQoNDA0LCB7XHJcblx0XHRcdCdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuXHRcdH0pO1xyXG5cclxuXHRcdHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0XHRtZXNzYWdlOiBgTm90IGZvdW5kYFxyXG5cdFx0fSkpO1xyXG5cdH1cclxufVxyXG4iLCJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcbiAgICBpZiAoc3RvcmUgIT0gbnVsbCAmJiB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIC4uLmNhbGxiYWNrcykge1xuICAgIGlmIChzdG9yZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub29wO1xuICAgIH1cbiAgICBjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZSguLi5jYWxsYmFja3MpO1xuICAgIHJldHVybiB1bnN1Yi51bnN1YnNjcmliZSA/ICgpID0+IHVuc3ViLnVuc3Vic2NyaWJlKCkgOiB1bnN1Yjtcbn1cbmZ1bmN0aW9uIGdldF9zdG9yZV92YWx1ZShzdG9yZSkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBzdWJzY3JpYmUoc3RvcmUsIF8gPT4gdmFsdWUgPSBfKSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbik7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICByZXR1cm4gZGVmaW5pdGlvblsxXSAmJiBmblxuICAgICAgICA/IGFzc2lnbigkJHNjb3BlLmN0eC5zbGljZSgpLCBkZWZpbml0aW9uWzFdKGZuKGN0eCkpKVxuICAgICAgICA6ICQkc2NvcGUuY3R4O1xufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvblsyXSAmJiBmbikge1xuICAgICAgICBjb25zdCBsZXRzID0gZGVmaW5pdGlvblsyXShmbihkaXJ0eSkpO1xuICAgICAgICBpZiAodHlwZW9mICQkc2NvcGUuZGlydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGgubWF4KCQkc2NvcGUuZGlydHkubGVuZ3RoLCBsZXRzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkW2ldID0gJCRzY29wZS5kaXJ0eVtpXSB8IGxldHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkJHNjb3BlLmRpcnR5IHwgbGV0cztcbiAgICB9XG4gICAgcmV0dXJuICQkc2NvcGUuZGlydHk7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUgPSByZXQpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBub2RlKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5mdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfZWFjaChpdGVyYXRpb25zLCBkZXRhY2hpbmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnNbaV0pXG4gICAgICAgICAgICBpdGVyYXRpb25zW2ldLmQoZGV0YWNoaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBlbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRfaXMobmFtZSwgaXMpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lLCB7IGlzIH0pO1xufVxuZnVuY3Rpb24gb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcyhvYmosIGV4Y2x1ZGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNfcHJvcChvYmosIGspXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAmJiBleGNsdWRlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuZnVuY3Rpb24gdGV4dChkYXRhKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuZnVuY3Rpb24gc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRleHQoJyAnKTtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiB0ZXh0KCcnKTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSlcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQpIHtcbiAgICAgICAgICAgIG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhKG5vZGUsIHByb3AsIHZhbHVlKSB7XG4gICAgaWYgKHByb3AgaW4gbm9kZSkge1xuICAgICAgICBub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCkge1xuICAgIGNvbnN0IHZhbHVlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLnB1c2goZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJycgPyB1bmRlZmluZWQgOiArdmFsdWU7XG59XG5mdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFycmF5LnB1c2goeyBzdGFydDogcmFuZ2VzLnN0YXJ0KGkpLCBlbmQ6IHJhbmdlcy5lbmQoaSkgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcywgc3ZnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmcgPyBzdmdfZWxlbWVudChuYW1lKSA6IGVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSAnJyArIGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0KGRhdGEpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwgfHwgaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBpZiAob3B0aW9uLl9fdmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IH52YWx1ZS5pbmRleE9mKG9wdGlvbi5fX3ZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykgfHwgc2VsZWN0Lm9wdGlvbnNbMF07XG4gICAgcmV0dXJuIHNlbGVjdGVkX29wdGlvbiAmJiBzZWxlY3RlZF9vcHRpb24uX192YWx1ZTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9tdWx0aXBsZV92YWx1ZShzZWxlY3QpIHtcbiAgICByZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIG9wdGlvbiA9PiBvcHRpb24uX192YWx1ZSk7XG59XG5mdW5jdGlvbiBhZGRfcmVzaXplX2xpc3RlbmVyKGVsZW1lbnQsIGZuKSB7XG4gICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBvYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgb2JqZWN0LnR5cGUgPSAndGV4dC9odG1sJztcbiAgICBvYmplY3QudGFiSW5kZXggPSAtMTtcbiAgICBsZXQgd2luO1xuICAgIG9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHdpbiA9IG9iamVjdC5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmbik7XG4gICAgfTtcbiAgICBpZiAoL1RyaWRlbnQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmplY3QpO1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICB3aW4gJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIgJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZuKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQob2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3RbdG9nZ2xlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG59XG5mdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgZGV0YWlsKTtcbiAgICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIHF1ZXJ5X3NlbGVjdG9yX2FsbChzZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihodG1sLCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZSA9IGVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICB9XG4gICAgbSh0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGluc2VydCh0YXJnZXQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgfVxuICAgIHUoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIHAoaHRtbCkge1xuICAgICAgICB0aGlzLmQoKTtcbiAgICAgICAgdGhpcy51KGh0bWwpO1xuICAgICAgICB0aGlzLm0odGhpcy50LCB0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxubGV0IHN0eWxlc2hlZXQ7XG5sZXQgYWN0aXZlID0gMDtcbmxldCBjdXJyZW50X3J1bGVzID0ge307XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgbGV0IGkgPSBzdHIubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBoYXNoID4+PiAwO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgaWYgKCFzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBzdHlsZS5zaGVldDtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50X3J1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogYGB9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpXG4gICAgICAgIC5zcGxpdCgnLCAnKVxuICAgICAgICAuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICBpZiAobmFtZSAmJiAhLS1hY3RpdmUpXG4gICAgICAgIGNsZWFyX3J1bGVzKCk7XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKVxuICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICBjdXJyZW50X3J1bGVzID0ge307XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9hbmltYXRpb24obm9kZSwgZnJvbSwgZm4sIHBhcmFtcykge1xuICAgIGlmICghZnJvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChmcm9tLmxlZnQgPT09IHRvLmxlZnQgJiYgZnJvbS5yaWdodCA9PT0gdG8ucmlnaHQgJiYgZnJvbS50b3AgPT09IHRvLnRvcCAmJiBmcm9tLmJvdHRvbSA9PT0gdG8uYm90dG9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86IHNob3VsZCB0aGlzIGJlIHNlcGFyYXRlZCBmcm9tIGRlc3RydWN0dXJpbmc/IE9yIHN0YXJ0L2VuZCBhZGRlZCB0byBwdWJsaWMgYXBpIGFuZCBkb2N1bWVudGF0aW9uP1xuICAgIHN0YXJ0OiBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOlxuICAgIGVuZCA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbiwgdGljayA9IG5vb3AsIGNzcyB9ID0gZm4obm9kZSwgeyBmcm9tLCB0byB9LCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIGxldCBuYW1lO1xuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWxheSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgaWYgKCFzdGFydGVkICYmIG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCAmJiBub3cgPj0gZW5kKSB7XG4gICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gbm93IC0gc3RhcnRfdGltZTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAwICsgMSAqIGVhc2luZyhwIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgc3RhcnQoKTtcbiAgICB0aWNrKDAsIDEpO1xuICAgIHJldHVybiBzdG9wO1xufVxuZnVuY3Rpb24gZml4X3Bvc2l0aW9uKG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc3R5bGU7XG4gICAgICAgIGNvbnN0IGEgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYWRkX3RyYW5zZm9ybShub2RlLCBhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpIHtcbiAgICBjb25zdCBiID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoYS5sZWZ0ICE9PSBiLmxlZnQgfHwgYS50b3AgIT09IGIudG9wKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgbm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke2EubGVmdCAtIGIubGVmdH1weCwgJHthLnRvcCAtIGIudG9wfXB4KWA7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudF9jb21wb25lbnQ7XG5mdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY3VycmVudF9jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBnZXRfY3VycmVudF9jb21wb25lbnQoKSB7XG4gICAgaWYgKCFjdXJyZW50X2NvbXBvbmVudClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb25gKTtcbiAgICByZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5mdW5jdGlvbiBiZWZvcmVVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX21vdW50LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbkRlc3Ryb3koZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHRoZXJlIHNpdHVhdGlvbnMgd2hlcmUgZXZlbnRzIGNvdWxkIGJlIGRpc3BhdGNoZWRcbiAgICAgICAgICAgIC8vIGluIGEgc2VydmVyIChub24tRE9NKSBlbnZpcm9ubWVudD9cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuKGV2ZW50KSk7XG4gICAgfVxufVxuXG5jb25zdCBkaXJ0eV9jb21wb25lbnRzID0gW107XG5jb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5jb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5sZXQgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2NoZWR1bGVfdXBkYXRlKCkge1xuICAgIGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuICAgICAgICB1cGRhdGVfc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0aWNrKCkge1xuICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgIHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuICAgIHJlbmRlcl9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZGRfZmx1c2hfY2FsbGJhY2soZm4pIHtcbiAgICBmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBkaXJ0eV9jb21wb25lbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShjb21wb25lbnQuJCQpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChiaW5kaW5nX2NhbGxiYWNrcy5sZW5ndGgpXG4gICAgICAgICAgICBiaW5kaW5nX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgICAgICAvLyB0aGVuLCBvbmNlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGNhbGxcbiAgICAgICAgLy8gYWZ0ZXJVcGRhdGUgZnVuY3Rpb25zLiBUaGlzIG1heSBjYXVzZVxuICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMuLi5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHJlbmRlcl9jYWxsYmFja3NbaV07XG4gICAgICAgICAgICBpZiAoIXNlZW5fY2FsbGJhY2tzLmhhcyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICAgICAgc2Vlbl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICB9IHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCk7XG4gICAgd2hpbGUgKGZsdXNoX2NhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgZmx1c2hfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgfVxuICAgIHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaGApO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBjbGFzc2VzX3RvX2FkZCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3QuYXNzaWduKHt9LCAuLi5hcmdzKTtcbiAgICBpZiAoY2xhc3Nlc190b19hZGQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RyID0gJyc7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgaWYgKGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLnRlc3QobmFtZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgKz0gYCAke25hbWV9PVwiJHtTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1wiL2csICcmIzM0OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyl9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IGVzY2FwZWQgPSB7XG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnXG59O1xuZnVuY3Rpb24gZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKGh0bWwpLnJlcGxhY2UoL1tcIicmPD5dL2csIG1hdGNoID0+IGVzY2FwZWRbbWF0Y2hdKTtcbn1cbmZ1bmN0aW9uIGVhY2goaXRlbXMsIGZuKSB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc3RyICs9IGZuKGl0ZW1zW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IG1pc3NpbmdfY29tcG9uZW50ID0ge1xuICAgICQkcmVuZGVyOiAoKSA9PiAnJ1xufTtcbmZ1bmN0aW9uIHZhbGlkYXRlX2NvbXBvbmVudChjb21wb25lbnQsIG5hbWUpIHtcbiAgICBpZiAoIWNvbXBvbmVudCB8fCAhY29tcG9uZW50LiQkcmVuZGVyKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnc3ZlbHRlOmNvbXBvbmVudCcpXG4gICAgICAgICAgICBuYW1lICs9ICcgdGhpcz17Li4ufSc7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPCR7bmFtZX0+IGlzIG5vdCBhIHZhbGlkIFNTUiBjb21wb25lbnQuIFlvdSBtYXkgbmVlZCB0byByZXZpZXcgeW91ciBidWlsZCBjb25maWcgdG8gZW5zdXJlIHRoYXQgZGVwZW5kZW5jaWVzIGFyZSBjb21waWxlZCwgcmF0aGVyIHRoYW4gaW1wb3J0ZWQgYXMgcHJlLWNvbXBpbGVkIG1vZHVsZXNgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGRlYnVnKGZpbGUsIGxpbmUsIGNvbHVtbiwgdmFsdWVzKSB7XG4gICAgY29uc29sZS5sb2coYHtAZGVidWd9ICR7ZmlsZSA/IGZpbGUgKyAnICcgOiAnJ30oJHtsaW5lfToke2NvbHVtbn0pYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIHJldHVybiAnJztcbn1cbmxldCBvbl9kZXN0cm95O1xuZnVuY3Rpb24gY3JlYXRlX3Nzcl9jb21wb25lbnQoZm4pIHtcbiAgICBmdW5jdGlvbiAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpIHtcbiAgICAgICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgICAgICBjb25zdCAkJCA9IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3ksXG4gICAgICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICByZXR1cm4gYCAke25hbWV9JHt2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogYD0ke3R5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeShlc2NhcGUodmFsdWUpKSA6IGBcIiR7dmFsdWV9XCJgfWB9YDtcbn1cbmZ1bmN0aW9uIGFkZF9jbGFzc2VzKGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3NlcyA/IGAgY2xhc3M9XCIke2NsYXNzZXN9XCJgIDogYGA7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yKSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIC8vIG9uTW91bnQgaGFwcGVucyBiZWZvcmUgdGhlIGluaXRpYWwgYWZ0ZXJVcGRhdGVcbiAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICBpZiAob25fZGVzdHJveSkge1xuICAgICAgICAgICAgb25fZGVzdHJveS5wdXNoKC4uLm5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEVkZ2UgY2FzZSAtIGNvbXBvbmVudCB3YXMgZGVzdHJveWVkIGltbWVkaWF0ZWx5LFxuICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgcnVuX2FsbChuZXdfb25fZGVzdHJveSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgfSk7XG4gICAgYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2NvbXBvbmVudChjb21wb25lbnQsIGRldGFjaGluZykge1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkO1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICBydW5fYWxsKCQkLm9uX2Rlc3Ryb3kpO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5kKGRldGFjaGluZyk7XG4gICAgICAgIC8vIFRPRE8gbnVsbCBvdXQgb3RoZXIgcmVmcywgaW5jbHVkaW5nIGNvbXBvbmVudC4kJCAoYnV0IG5lZWQgdG9cbiAgICAgICAgLy8gcHJlc2VydmUgZmluYWwgc3RhdGU/KVxuICAgICAgICAkJC5vbl9kZXN0cm95ID0gJCQuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICAkJC5jdHggPSBbXTtcbiAgICB9XG59XG5mdW5jdGlvbiBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSkge1xuICAgIGlmIChjb21wb25lbnQuJCQuZGlydHlbMF0gPT09IC0xKSB7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICAgICAgY29tcG9uZW50LiQkLmRpcnR5LmZpbGwoMCk7XG4gICAgfVxuICAgIGNvbXBvbmVudC4kJC5kaXJ0eVsoaSAvIDMxKSB8IDBdIHw9ICgxIDw8IChpICUgMzEpKTtcbn1cbmZ1bmN0aW9uIGluaXQoY29tcG9uZW50LCBvcHRpb25zLCBpbnN0YW5jZSwgY3JlYXRlX2ZyYWdtZW50LCBub3RfZXF1YWwsIHByb3BzLCBkaXJ0eSA9IFstMV0pIHtcbiAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJvcF92YWx1ZXMgPSBvcHRpb25zLnByb3BzIHx8IHt9O1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBudWxsLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBwcm9wcyxcbiAgICAgICAgdXBkYXRlOiBub29wLFxuICAgICAgICBub3RfZXF1YWwsXG4gICAgICAgIGJvdW5kOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgLy8gbGlmZWN5Y2xlXG4gICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgb25fZGVzdHJveTogW10sXG4gICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICBkaXJ0eVxuICAgIH07XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIHByb3BfdmFsdWVzLCAoaSwgcmV0LCAuLi5yZXN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlc3QubGVuZ3RoID8gcmVzdFswXSA6IHJldDtcbiAgICAgICAgICAgIGlmICgkJC5jdHggJiYgbm90X2VxdWFsKCQkLmN0eFtpXSwgJCQuY3R4W2ldID0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQkLmJvdW5kW2ldKVxuICAgICAgICAgICAgICAgICAgICAkJC5ib3VuZFtpXSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWR5KVxuICAgICAgICAgICAgICAgICAgICBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KVxuICAgICAgICA6IFtdO1xuICAgICQkLnVwZGF0ZSgpO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgIC8vIGBmYWxzZWAgYXMgYSBzcGVjaWFsIGNhc2Ugb2Ygbm8gRE9NIGNvbXBvbmVudFxuICAgICQkLmZyYWdtZW50ID0gY3JlYXRlX2ZyYWdtZW50ID8gY3JlYXRlX2ZyYWdtZW50KCQkLmN0eCkgOiBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaHlkcmF0ZSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmwoY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4xOC4xJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQuZGF0YSA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFcIiwgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnREZXYgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICghb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuJCRpbmxpbmUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCd0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uYCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWRgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluZmluaXRlIGxvb3AgZGV0ZWN0ZWRgKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVFbGVtZW50LCBhY3Rpb25fZGVzdHJveWVyLCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfbG9jYXRpb24sIGFkZF9yZW5kZXJfY2FsbGJhY2ssIGFkZF9yZXNpemVfbGlzdGVuZXIsIGFkZF90cmFuc2Zvcm0sIGFmdGVyVXBkYXRlLCBhcHBlbmQsIGFwcGVuZF9kZXYsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX3NwYWNlLCBjbGFpbV90ZXh0LCBjbGVhcl9sb29wcywgY29tcG9uZW50X3N1YnNjcmliZSwgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCBjcmVhdGVfYW5pbWF0aW9uLCBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uLCBjcmVhdGVfY29tcG9uZW50LCBjcmVhdGVfaW5fdHJhbnNpdGlvbiwgY3JlYXRlX291dF90cmFuc2l0aW9uLCBjcmVhdGVfc2xvdCwgY3JlYXRlX3Nzcl9jb21wb25lbnQsIGN1cnJlbnRfY29tcG9uZW50LCBjdXN0b21fZXZlbnQsIGRhdGFzZXRfZGV2LCBkZWJ1ZywgZGVzdHJveV9ibG9jaywgZGVzdHJveV9jb21wb25lbnQsIGRlc3Ryb3lfZWFjaCwgZGV0YWNoLCBkZXRhY2hfYWZ0ZXJfZGV2LCBkZXRhY2hfYmVmb3JlX2RldiwgZGV0YWNoX2JldHdlZW5fZGV2LCBkZXRhY2hfZGV2LCBkaXJ0eV9jb21wb25lbnRzLCBkaXNwYXRjaF9kZXYsIGVhY2gsIGVsZW1lbnQsIGVsZW1lbnRfaXMsIGVtcHR5LCBlc2NhcGUsIGVzY2FwZWQsIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMsIGZpeF9hbmRfZGVzdHJveV9ibG9jaywgZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jaywgZml4X3Bvc2l0aW9uLCBmbHVzaCwgZ2V0Q29udGV4dCwgZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUsIGdldF9jdXJyZW50X2NvbXBvbmVudCwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dCwgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnRyb3MsIGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLCBpc19jbGllbnQsIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzdG9wX3Byb3BhZ2F0aW9uLCBzdWJzY3JpYmUsIHN2Z19lbGVtZW50LCB0ZXh0LCB0aWNrLCB0aW1lX3Jhbmdlc190b19hcnJheSwgdG9fbnVtYmVyLCB0b2dnbGVfY2xhc3MsIHRyYW5zaXRpb25faW4sIHRyYW5zaXRpb25fb3V0LCB1cGRhdGVfa2V5ZWRfZWFjaCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3N0b3JlLCB4bGlua19hdHRyIH07XG4iLCJmdW5jdGlvbiB0b1ZhbChtaXgpIHtcblx0dmFyIGssIHksIHN0cj0nJztcblx0aWYgKG1peCkge1xuXHRcdGlmICh0eXBlb2YgbWl4ID09PSAnb2JqZWN0Jykge1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkobWl4KSkge1xuXHRcdFx0XHRmb3IgKGs9MDsgayA8IG1peC5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdGlmIChtaXhba10gJiYgKHkgPSB0b1ZhbChtaXhba10pKSkge1xuXHRcdFx0XHRcdFx0c3RyICYmIChzdHIgKz0gJyAnKTtcblx0XHRcdFx0XHRcdHN0ciArPSB5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChrIGluIG1peCkge1xuXHRcdFx0XHRcdGlmIChtaXhba10gJiYgKHkgPSB0b1ZhbChrKSkpIHtcblx0XHRcdFx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRcdFx0XHRzdHIgKz0geTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBtaXggIT09ICdib29sZWFuJyAmJiAhbWl4LmNhbGwpIHtcblx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRzdHIgKz0gbWl4O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gc3RyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG5cdHZhciBpPTAsIHgsIHN0cj0nJztcblx0d2hpbGUgKGkgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0aWYgKHggPSB0b1ZhbChhcmd1bWVudHNbaSsrXSkpIHtcblx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRzdHIgKz0geFxuXHRcdH1cblx0fVxuXHRyZXR1cm4gc3RyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE9yaWdpbmFsQm9keVBhZGRpbmcoKSB7XG4gIGNvbnN0IHN0eWxlID0gd2luZG93ID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSwgbnVsbCkgOiB7fTtcblxuICByZXR1cm4gcGFyc2VJbnQoKHN0eWxlICYmIHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkgfHwgMCwgMTApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsYmFyV2lkdGgoKSB7XG4gIGxldCBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgLy8gLm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlIHN0eWxlcyAvLyBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi92NC4wLjAtYWxwaGEuNC9zY3NzL19tb2RhbC5zY3NzI0wxMDYtTDExM1xuICBzY3JvbGxEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBzY3JvbGxEaXYuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gIHNjcm9sbERpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XG4gIHNjcm9sbERpdi5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG4gIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG4gIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFNjcm9sbGJhcldpZHRoKHBhZGRpbmcpIHtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID4gMCA/IGAke3BhZGRpbmd9cHhgIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9keU92ZXJmbG93aW5nKCkge1xuICByZXR1cm4gd2luZG93ID8gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IHdpbmRvdy5pbm5lcldpZHRoIDogZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZGl0aW9uYWxseVVwZGF0ZVNjcm9sbGJhcigpIHtcbiAgY29uc3Qgc2Nyb2xsYmFyV2lkdGggPSBnZXRTY3JvbGxiYXJXaWR0aCgpO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi92NC4wLjAtYWxwaGEuNi9qcy9zcmMvbW9kYWwuanMjTDQzM1xuICBjb25zdCBmaXhlZENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICcuZml4ZWQtdG9wLCAuZml4ZWQtYm90dG9tLCAuaXMtZml4ZWQsIC5zdGlja3ktdG9wJ1xuICApWzBdO1xuICBjb25zdCBib2R5UGFkZGluZyA9IGZpeGVkQ29udGVudFxuICAgID8gcGFyc2VJbnQoZml4ZWRDb250ZW50LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAwLCAxMClcbiAgICA6IDA7XG5cbiAgaWYgKGlzQm9keU92ZXJmbG93aW5nKCkpIHtcbiAgICBzZXRTY3JvbGxiYXJXaWR0aChib2R5UGFkZGluZyArIHNjcm9sbGJhcldpZHRoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29sdW1uU2l6ZUNsYXNzKGlzWHMsIGNvbFdpZHRoLCBjb2xTaXplKSB7XG4gIGlmIChjb2xTaXplID09PSB0cnVlIHx8IGNvbFNpemUgPT09ICcnKSB7XG4gICAgcmV0dXJuIGlzWHMgPyAnY29sJyA6IGBjb2wtJHtjb2xXaWR0aH1gO1xuICB9IGVsc2UgaWYgKGNvbFNpemUgPT09ICdhdXRvJykge1xuICAgIHJldHVybiBpc1hzID8gJ2NvbC1hdXRvJyA6IGBjb2wtJHtjb2xXaWR0aH0tYXV0b2A7XG4gIH1cblxuICByZXR1cm4gaXNYcyA/IGBjb2wtJHtjb2xTaXplfWAgOiBgY29sLSR7Y29sV2lkdGh9LSR7Y29sU2l6ZX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYW4oJCRwcm9wcykge1xuICAvLyBUT0RPIHN1cHBvcnQga2V5c1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgY29uc3QgeyBjaGlsZHJlbiwgJCRzY29wZSwgJCRzbG90cyB9ID0gJCRwcm9wcztcbiAgY29uc3QgcmVzdCA9IHt9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cygkJHByb3BzKSkge1xuICAgIGlmIChrZXkgIT09IFwiY2hpbGRyZW5cIiAmJiBrZXkgIT09IFwiJCRzY29wZVwiICYmIGtleSAhPT0gXCIkJHNsb3RzXCIpIHtcbiAgICAgIHJlc3Rba2V5XSA9ICQkcHJvcHNba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBicm93c2VyRXZlbnQodGFyZ2V0LCAuLi5hcmdzKSB7XG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKC4uLmFyZ3MpO1xuXG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0Nhcm91c2VsQWN0aXZlSW5kZXgoZGlyZWN0aW9uLCBpdGVtcywgYWN0aXZlSW5kZXgpIHtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgcmV0dXJuIGFjdGl2ZUluZGV4ID09PSAwID8gaXRlbXMubGVuZ3RoIC0gMSA6IGFjdGl2ZUluZGV4IC0gMTtcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICduZXh0Jykge1xuICAgIHJldHVybiBhY3RpdmVJbmRleCA9PT0gaXRlbXMubGVuZ3RoIC0gMSA/IDAgOiBhY3RpdmVJbmRleCArIDE7XG4gIH1cbn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgYXJpYUxhYmVsID0gJ2JyZWFkY3J1bWInO1xuICBleHBvcnQgbGV0IGNoaWxkcmVuID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGxpc3RDbGFzc05hbWUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGxpc3RDbGFzc2VzID0gY2xzeCgnYnJlYWRjcnVtYicsIGxpc3RDbGFzc05hbWUpO1xuPC9zY3JpcHQ+XG5cbjxuYXYgey4uLnByb3BzfSBhcmlhLWxhYmVsPXthcmlhTGFiZWx9IGNsYXNzPXtjbGFzc05hbWV9PlxuICA8b2wgY2xhc3M9e2xpc3RDbGFzc2VzfT5cbiAgICB7I2lmIGNoaWxkcmVufVxuICAgICAge2NoaWxkcmVufVxuICAgIHs6ZWxzZX1cbiAgICAgIDxzbG90IC8+XG4gICAgey9pZn1cbiAgPC9vbD5cbjwvbmF2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjaGlsZHJlbiA9IHVuZGVmaW5lZDtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgYWN0aXZlID8gJ2FjdGl2ZScgOiBmYWxzZSwgJ2JyZWFkY3J1bWItaXRlbScpO1xuPC9zY3JpcHQ+XG5cbjxsaSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfSBhcmlhLWN1cnJlbnQ9e2FjdGl2ZSA/ICdwYWdlJyA6IHVuZGVmaW5lZH0+XG4gIHsjaWYgY2hpbGRyZW59XG4gICAge2NoaWxkcmVufVxuICB7OmVsc2V9XG4gICAgPHNsb3QgLz5cbiAgey9pZn1cbjwvbGk+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGJvZHkgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9ICcnO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgaW52ZXJzZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzdHlsZSA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgICdjYXJkJyxcbiAgICBpbnZlcnNlID8gJ3RleHQtd2hpdGUnIDogZmFsc2UsXG4gICAgYm9keSA/ICdjYXJkLWJvZHknIDogZmFsc2UsXG4gICAgY29sb3IgPyBgJHtvdXRsaW5lID8gJ2JvcmRlcicgOiAnYmcnfS0ke2NvbG9yfWAgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfSBvbjpjbGljayB7c3R5bGV9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICdjYXJkLWJvZHknKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCB0YWcgPSAnZGl2JztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2NhcmQtaGVhZGVyJyk7XG48L3NjcmlwdD5cblxueyNpZiB0YWcgPT09ICdoMyd9XG4gIDxoMyB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NsYXNzZXN9IG9uOmNsaWNrPlxuICAgIDxzbG90IC8+XG4gIDwvaDM+XG57OmVsc2V9XG4gIDxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfSBvbjpjbGljaz5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCAnY2FyZC10ZXh0Jyk7XG48L3NjcmlwdD5cblxuPHAgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L3A+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IG5vR3V0dGVycyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZvcm0gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIG5vR3V0dGVycyA/ICduby1ndXR0ZXJzJyA6IG51bGwsXG4gICAgZm9ybSA/ICdmb3JtLXJvdycgOiAncm93J1xuICApO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2NhcmQtZm9vdGVyJyk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgYm9yZGVyZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBib3JkZXJsZXNzID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc3RyaXBlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRhcmsgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBob3ZlciA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHJlc3BvbnNpdmUgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAndGFibGUnLFxuICAgIHNpemUgPyAndGFibGUtJyArIHNpemUgOiBmYWxzZSxcbiAgICBib3JkZXJlZCA/ICd0YWJsZS1ib3JkZXJlZCcgOiBmYWxzZSxcbiAgICBib3JkZXJsZXNzID8gJ3RhYmxlLWJvcmRlcmxlc3MnIDogZmFsc2UsXG4gICAgc3RyaXBlZCA/ICd0YWJsZS1zdHJpcGVkJyA6IGZhbHNlLFxuICAgIGRhcmsgPyAndGFibGUtZGFyaycgOiBmYWxzZSxcbiAgICBob3ZlciA/ICd0YWJsZS1ob3ZlcicgOiBmYWxzZVxuICApO1xuXG4gICQ6IHJlc3BvbnNpdmVDbGFzc05hbWUgPVxuICAgIHJlc3BvbnNpdmUgPT09IHRydWUgPyAndGFibGUtcmVzcG9uc2l2ZScgOiBgdGFibGUtcmVzcG9uc2l2ZS0ke3Jlc3BvbnNpdmV9YDtcbjwvc2NyaXB0PlxuXG57I2lmIHJlc3BvbnNpdmV9XG4gIDxkaXYgY2xhc3M9e3Jlc3BvbnNpdmVDbGFzc05hbWV9PlxuICAgIDx0YWJsZSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICAgIDxzbG90IC8+XG4gICAgPC90YWJsZT5cbiAgPC9kaXY+XG57OmVsc2V9XG4gIDx0YWJsZSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L3RhYmxlPlxuey9pZn1cbiIsIjxzY3JpcHQ+XHJcbiAgZXhwb3J0IGxldCBzcmM7XHJcbiAgZXhwb3J0IGxldCBhbHQ7XHJcblxyXG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xyXG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxpbWcgY2xhc3M9XCJpbWctZmx1aWQge2NsYXNzTmFtZX1cIiB7c3JjfSB7YWx0fSAvPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBDYXJkIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEJvZHkgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkQm9keS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEZvb3RlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRGb290ZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRIZWFkZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkSGVhZGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkVGV4dCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRUZXh0LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkU3VidGl0bGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkU3VidGl0bGUuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFRhYmxlIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvVGFibGUuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFJvdyBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1Jvdy5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IEltYWdlIGZyb20gXCIuLi9jb21wb25lbnRzL0ltYWdlLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IGNhcmRUaXRsZSA9IFwiXCI7XHJcbiAgZXhwb3J0IGxldCBjYXJkQ29sb3I7XHJcbiAgZXhwb3J0IGxldCBjYXJkRm9vdGVyVGV4dCA9IFwi0JTQtdGC0LDQu9C4XCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPENhcmQgaW52ZXJzZSBjb2xvcj17Y2FyZENvbG9yfSBjbGFzcz1cIm1iLTRcIj5cclxuICA8Q2FyZEJvZHk+XHJcbiAgICA8Q2FyZFRleHQ+e2NhcmRUaXRsZX08L0NhcmRUZXh0PlxyXG4gIDwvQ2FyZEJvZHk+XHJcbiAgPENhcmRGb290ZXIgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XHJcbiAgICA8YSBjbGFzcz1cInNtYWxsIHRleHQtd2hpdGUgc3RyZXRjaGVkLWxpbmtcIiBocmVmPVwiY2hhcnRzXCI+XHJcbiAgICAgIHtjYXJkRm9vdGVyVGV4dH1cclxuICAgIDwvYT5cclxuICAgIDxkaXYgY2xhc3M9XCJzbWFsbCB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLXJpZ2h0XCIgLz5cclxuICAgIDwvZGl2PlxyXG4gIDwvQ2FyZEZvb3Rlcj5cclxuPC9DYXJkPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBDYXJkIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEJvZHkgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkQm9keS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEhlYWRlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRIZWFkZXIuc3ZlbHRlXCI7XHJcblxyXG4gIGltcG9ydCBJbWFnZSBmcm9tIFwiLi4vY29tcG9uZW50cy9JbWFnZS5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBjYXJkVGl0bGUgPSBcIlwiO1xyXG4gIGV4cG9ydCBsZXQgY2FyZEljb24gPSBcIlwiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxDYXJkIGNsYXNzPVwibWItNFwiPlxyXG4gIDxDYXJkSGVhZGVyPlxyXG4gICAgPGkgY2xhc3M9e2NhcmRJY29ufSAvPlxyXG4gICAge2NhcmRUaXRsZX1cclxuICA8L0NhcmRIZWFkZXI+XHJcbiAgPENhcmRCb2R5PlxyXG4gICAgPHNsb3QgLz5cclxuICAgIDxzbG90IG5hbWU9XCJjaGFydENhcHRpb25cIiAvPlxyXG4gIDwvQ2FyZEJvZHk+XHJcbjwvQ2FyZD5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgVGFibGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9UYWJsZS5zdmVsdGVcIjtcclxuXHJcbiAgY29uc3QgdGFibGVIZWFkaW5nID0gW1wiI1wiLCBcIkZpcnN0IE5hbWVcIiwgXCJMYXN0LU5hbWVcIiwgXCJVc2VybmFtZVwiXTtcclxuICBjb25zdCB0YWJsZURhdGEgPSBbXHJcbiAgICB7IFNObzogXCIxXCIsIGZpcnN0TmFtZTogXCJQaXBCb3lcIiwgbGFzdE5hbWU6IFwiMzAwMFwiLCB1c2VyTmFtZTogXCJAbWRvXCIgfSxcclxuICAgIHsgU05vOiBcIjJcIiwgZmlyc3ROYW1lOiBcIkdvcmRvblwiLCBsYXN0TmFtZTogXCJGcmVlbWFuXCIsIHVzZXJOYW1lOiBcIkBmYXRcIiB9LFxyXG4gICAgeyBTTm86IFwiM1wiLCBmaXJzdE5hbWU6IFwiR291bFwiLCBsYXN0TmFtZTogXCLQk9C70LDQtNC60L7QutC+0LbQuNC5XCIsIHVzZXJOYW1lOiBcIkB0d2l0dGVyXCIgfVxyXG4gIF07XHJcbjwvc2NyaXB0PlxyXG5cclxuPFRhYmxlIGJvcmRlcmVkIHJlc3BvbnNpdmU+XHJcbiAgPHRoZWFkPlxyXG4gICAgPHRyPlxyXG4gICAgICB7I2VhY2ggdGFibGVIZWFkaW5nIGFzIGhlYWRpbmd9XHJcbiAgICAgICAgPHRoPntoZWFkaW5nfTwvdGg+XHJcbiAgICAgIHsvZWFjaH1cclxuICAgIDwvdHI+XHJcbiAgPC90aGVhZD5cclxuICA8dGJvZHk+XHJcblxyXG4gICAgeyNlYWNoIHRhYmxlRGF0YSBhcyBkYXRhfVxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwicm93XCI+e2RhdGEuU05vfTwvdGg+XHJcbiAgICAgICAgPHRkPntkYXRhLmZpcnN0TmFtZX08L3RkPlxyXG4gICAgICAgIDx0ZD57ZGF0YS5sYXN0TmFtZX08L3RkPlxyXG4gICAgICAgIDx0ZD57ZGF0YS51c2VyTmFtZX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgey9lYWNofVxyXG4gIDwvdGJvZHk+XHJcbjwvVGFibGU+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuICBpbXBvcnQgQ2hhcnQgZnJvbSBcImNoYXJ0LmpzXCI7XHJcblxyXG4gIGNvbnN0IGNoYXJ0RGF0YSA9IHtcclxuICAgIGxhYmVsczogW1xyXG4gICAgICBcItCv0L3QstCw0YDRjFwiLFxyXG4gICAgICBcItCk0LXQstGA0LDQu9GMXCIsXHJcbiAgICAgIFwi0JzQsNGA0YJcIixcclxuICAgICAgXCLQkNC/0YDQtdC70YxcIixcclxuICAgICAgXCLQnNCw0LlcIixcclxuICAgICAgXCLQmNGO0L3RjFwiLFxyXG4gICAgICBcItCY0Y7Qu9GMXCIsXHJcbiAgICAgIFwi0JDQstCz0YPRgdGCXCIsXHJcbiAgICAgIFwi0KHQtdC90YLRj9Cx0YDRjFwiXHJcbiAgICBdLFxyXG4gICAgZGF0YXNldHM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGxhYmVsOiBcIiMg0LPQvtC70L7RgdC+0LJcIixcclxuICAgICAgICBkYXRhOiBbMTUsIDEwLCAxNywgNiwgMTEsIDksIDEyLCAxNiwgMTFdLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiAyLFxyXG4gICAgICAgIGJvcmRlckNvbG9yOiBcInJnYigzLDExNywyMjApXCIsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMywxMTcsMjIwLDAuMilcIlxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2hhcnRPcHRpb25zID0ge1xyXG4gICAgc2NhbGVzOiB7XHJcbiAgICAgIHlBeGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVDaGFydCgpIHtcclxuICAgIHZhciBjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyZWFDaGFydFwiKTtcclxuICAgIHZhciBteUNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xyXG4gICAgICB0eXBlOiBcImxpbmVcIixcclxuICAgICAgZGF0YTogY2hhcnREYXRhLFxyXG4gICAgICBvcHRpb25zOiBjaGFydE9wdGlvbnNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25Nb3VudChjcmVhdGVDaGFydCk7XHJcbjwvc2NyaXB0PlxyXG5cclxuPGNhbnZhcyBpZD1cImFyZWFDaGFydFwiIC8+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuICBpbXBvcnQgQ2hhcnQgZnJvbSBcImNoYXJ0LmpzXCI7XHJcblxyXG4gIGNvbnN0IGNoYXJ0RGF0YSA9IHtcclxuICAgIGxhYmVsczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIl0sXHJcbiAgICBkYXRhc2V0czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbGFiZWw6IFwiIyBvZiBWb3Rlc1wiLFxyXG4gICAgICAgIGRhdGE6IFs0LCA2LCAxMCwgMTIsIDE1LCAxOV0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMywxMTcsMjIwKVwiXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9O1xyXG4gIGNvbnN0IGNoYXJ0T3B0aW9ucyA9IHtcclxuICAgIHNjYWxlczoge1xyXG4gICAgICB5QXhlczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQoKSB7XHJcbiAgICB2YXIgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXJDaGFydFwiKTtcclxuICAgIHZhciBteUNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xyXG4gICAgICB0eXBlOiBcImJhclwiLFxyXG4gICAgICBkYXRhOiBjaGFydERhdGEsXHJcbiAgICAgIG9wdGlvbnM6IGNoYXJ0T3B0aW9uc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbk1vdW50KGNyZWF0ZUNoYXJ0KTtcclxuPC9zY3JpcHQ+XHJcblxyXG48Y2FudmFzIGlkPVwiYmFyQ2hhcnRcIiAvPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBCcmVhZGNydW1iIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYi5zdmVsdGVcIjtcclxuICBpbXBvcnQgQnJlYWRjcnVtYkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9CcmVhZGNydW1iSXRlbS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRCb2R5IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEJvZHkuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmRIZWFkZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkSGVhZGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkVGV4dCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRUZXh0LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkU3VidGl0bGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkU3VidGl0bGUuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFJvdyBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1Jvdy5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IERhc2hib2FyZENhcmQgZnJvbSBcIi4uL2NvbXBvbmVudHMvRGFzaGJvYXJkQ2FyZC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ3VzdG9tQ2FyZCBmcm9tIFwiLi4vY29tcG9uZW50cy9DdXN0b21DYXJkLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBUYWJsZSBmcm9tIFwiLi4vY29tcG9uZW50cy9UYWJsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgQXJlYUNoYXJ0IGZyb20gXCIuLi9jb21wb25lbnRzL0NoYXJ0cy9BcmVhQ2hhcnQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJhckNoYXJ0IGZyb20gXCIuLi9jb21wb25lbnRzL0NoYXJ0cy9CYXJDaGFydC5zdmVsdGVcIjtcclxuXHJcbiAgbGV0IHRpdGxlID0gXCLOu3Byb3RvblwiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcbjxoMSBjbGFzcz1cIm10LTRcIj7Qn9Cw0L3QtdC70Yw8L2gxPlxyXG48QnJlYWRjcnVtYiBjbGFzcz1cIm1iLTRcIj5cclxuICA8QnJlYWRjcnVtYkl0ZW0gYWN0aXZlPtCf0LDQvdC10LvRjDwvQnJlYWRjcnVtYkl0ZW0+XHJcbjwvQnJlYWRjcnVtYj5cclxuPFJvdz5cclxuICA8ZGl2IGNsYXNzPVwiY29sLXhsLTMgY29sLW1kLTZcIj5cclxuICAgIDxEYXNoYm9hcmRDYXJkIGNhcmRUaXRsZT1cItCh0LjQvdGP0Y8g0L/Qu9Cw0YjQutCwXCIgY2FyZENvbG9yPVwicHJpbWFyeVwiIC8+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImNvbC14bC0zIGNvbC1tZC02XCI+XHJcbiAgICA8RGFzaGJvYXJkQ2FyZCBjYXJkVGl0bGU9XCLQntGA0LDQvdC20LXQstCw0Y8g0L/Qu9Cw0YjQutCwXCIgY2FyZENvbG9yPVwid2FybmluZ1wiIC8+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImNvbC14bC0zIGNvbC1tZC02XCI+XHJcbiAgICA8RGFzaGJvYXJkQ2FyZCBjYXJkVGl0bGU9XCLQl9C10LvQtdC90LDRjyDQv9C70LDRiNC60LBcIiBjYXJkQ29sb3I9XCJzdWNjZXNzXCIgLz5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLXhsLTMgY29sLW1kLTZcIj5cclxuICAgIDxEYXNoYm9hcmRDYXJkIGNhcmRUaXRsZT1cItCe0L/QsNGB0L3QsNGPINC/0LvQsNGI0LrQsFwiIGNhcmRDb2xvcj1cImRhbmdlclwiIC8+XHJcbiAgPC9kaXY+XHJcbjwvUm93PlxyXG48Um93PlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wteGwtNlwiPlxyXG4gICAgPEN1c3RvbUNhcmQgY2FyZFRpdGxlPVwi0J/RgNC40LzQtdGAINC00LjQsNCz0YDQsNC80LzRi1wiIGNhcmRJY29uPVwiZmFzIGZhLWNoYXJ0LWFyZWFcIj5cclxuICAgICAgPEFyZWFDaGFydCAvPlxyXG4gICAgPC9DdXN0b21DYXJkPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wteGwtNlwiPlxyXG4gICAgPEN1c3RvbUNhcmQgY2FyZFRpdGxlPVwi0J/RgNC40LzQtdGAINCz0LjRgdGC0L7Qs9GA0LDQvNC80YtcIiBjYXJkSWNvbj1cImZhcyBmYS1jaGFydC1iYXJcIj5cclxuICAgICAgPEJhckNoYXJ0IC8+XHJcbiAgICA8L0N1c3RvbUNhcmQ+XHJcbiAgPC9kaXY+XHJcbjwvUm93PlxyXG48Q3VzdG9tQ2FyZCBjYXJkVGl0bGU9XCLQn9GA0LjQvNC10YAgRGF0YVRhYmxlXCIgY2FyZEljb249XCJmYXMgZmEtdGFibGVcIj5cclxuICA8VGFibGUgLz5cclxuPC9DdXN0b21DYXJkPlxyXG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGlubGluZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCBpbmxpbmUgPyAnZm9ybS1pbmxpbmUnIDogZmFsc2UpO1xuPC9zY3JpcHQ+XG5cbjxmb3JtIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9mb3JtPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgZXhwb3J0IGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgcm93ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY2hlY2sgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpbmxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgdGFnID0gbnVsbDtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICByb3cgPyAncm93JyA6IGZhbHNlLFxuICAgIGNoZWNrID8gJ2Zvcm0tY2hlY2snIDogJ2Zvcm0tZ3JvdXAnLFxuICAgIGNoZWNrICYmIGlubGluZSA/ICdmb3JtLWNoZWNrLWlubGluZScgOiBmYWxzZSxcbiAgICBjaGVjayAmJiBkaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbnsjaWYgdGFnID09PSAnZmllbGRzZXQnfVxuICA8ZmllbGRzZXQgey4uLnByb3BzfSB7aWR9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2ZpZWxkc2V0PlxuezplbHNlfVxuICA8ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgaW1wb3J0IHsgZ2V0Q29sdW1uU2l6ZUNsYXNzLCBpc09iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGhpZGRlbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNoZWNrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IGZvcmU7XG4gIGV4cG9ydCB7IGZvcmUgYXMgZm9yIH07XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCB4cyA9ICcnO1xuICBleHBvcnQgbGV0IHNtID0gJyc7XG4gIGV4cG9ydCBsZXQgbWQgPSAnJztcbiAgZXhwb3J0IGxldCBsZyA9ICcnO1xuICBleHBvcnQgbGV0IHhsID0gJyc7XG5cbiAgY29uc3QgY29sV2lkdGhzID0ge1xuICAgIHhzLFxuICAgIHNtLFxuICAgIG1kLFxuICAgIGxnLFxuICAgIHhsXG4gIH07XG4gIGV4cG9ydCBsZXQgd2lkdGhzID0gT2JqZWN0LmtleXMoY29sV2lkdGhzKTtcblxuICBjb25zdCBjb2xDbGFzc2VzID0gW107XG5cbiAgd2lkdGhzLmZvckVhY2goY29sV2lkdGggPT4ge1xuICAgIGxldCBjb2x1bW5Qcm9wID0gJCRwcm9wc1tjb2xXaWR0aF07XG5cbiAgICBpZiAoIWNvbHVtblByb3AgJiYgY29sdW1uUHJvcCAhPT0gJycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc1hzID0gY29sV2lkdGggPT09ICd4cyc7XG4gICAgbGV0IGNvbENsYXNzO1xuXG4gICAgaWYgKGlzT2JqZWN0KGNvbHVtblByb3ApKSB7XG4gICAgICBjb25zdCBjb2xTaXplSW50ZXJmaXggPSBpc1hzID8gJy0nIDogYC0ke2NvbFdpZHRofS1gO1xuICAgICAgY29sQ2xhc3MgPSBnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3Auc2l6ZSk7XG5cbiAgICAgIGNvbENsYXNzZXMucHVzaChcbiAgICAgICAgY2xzeCh7XG4gICAgICAgICAgW2NvbENsYXNzXTogY29sdW1uUHJvcC5zaXplIHx8IGNvbHVtblByb3Auc2l6ZSA9PT0gJycsXG4gICAgICAgICAgW2BvcmRlciR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5vcmRlcn1gXTpcbiAgICAgICAgICAgIGNvbHVtblByb3Aub3JkZXIgfHwgY29sdW1uUHJvcC5vcmRlciA9PT0gMCxcbiAgICAgICAgICBbYG9mZnNldCR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5vZmZzZXR9YF06XG4gICAgICAgICAgICBjb2x1bW5Qcm9wLm9mZnNldCB8fCBjb2x1bW5Qcm9wLm9mZnNldCA9PT0gMFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sQ2xhc3MgPSBnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3ApO1xuICAgICAgY29sQ2xhc3Nlcy5wdXNoKGNvbENsYXNzKTtcbiAgICB9XG4gIH0pO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBoaWRkZW4gPyAnc3Itb25seScgOiBmYWxzZSxcbiAgICBjaGVjayA/ICdmb3JtLWNoZWNrLWxhYmVsJyA6IGZhbHNlLFxuICAgIHNpemUgPyBgY29sLWZvcm0tbGFiZWwtJHtzaXplfWAgOiBmYWxzZSxcbiAgICBjb2xDbGFzc2VzLFxuICAgIGNvbENsYXNzZXMubGVuZ3RoID8gJ2NvbC1mb3JtLWxhYmVsJyA6IGZhbHNlXG4gICk7XG48L3NjcmlwdD5cblxuPGxhYmVsIHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30gZm9yPXtmb3JlfT5cbiAgPHNsb3QgLz5cbjwvbGFiZWw+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGV4cG9ydCBsZXQgdHlwZSA9ICd0ZXh0JztcbiAgZXhwb3J0IGxldCBzaXplID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGJzU2l6ZSA9IHVuZGVmaW5lZDtcbiAgZXhwb3J0IGxldCBjaGVja2VkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmFsaWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpbnZhbGlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcGxhaW50ZXh0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYWRkb24gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnO1xuICBleHBvcnQgbGV0IGZpbGVzID0gJyc7XG4gIGV4cG9ydCBsZXQgcmVhZG9ubHk7XG4gIGV4cG9ydCBsZXQgbXVsdGlwbGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IG5hbWUgPSAnJztcbiAgZXhwb3J0IGxldCBwbGFjZWhvbGRlciA9ICcnO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgdHlwZTogX29taXRUeXBlLCAuLi5wcm9wcyB9ID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgbGV0IGNsYXNzZXM7XG4gIGxldCB0YWc7XG4gICQ6IHtcbiAgICBjb25zdCBjaGVja0lucHV0ID0gWydyYWRpbycsICdjaGVja2JveCddLmluZGV4T2YodHlwZSkgPiAtMTtcbiAgICBjb25zdCBpc05vdGFOdW1iZXIgPSBuZXcgUmVnRXhwKCdcXFxcRCcsICdnJyk7XG5cbiAgICBjb25zdCBmaWxlSW5wdXQgPSB0eXBlID09PSAnZmlsZSc7XG4gICAgY29uc3QgdGV4dGFyZWFJbnB1dCA9IHR5cGUgPT09ICd0ZXh0YXJlYSc7XG4gICAgY29uc3Qgc2VsZWN0SW5wdXQgPSB0eXBlID09PSAnc2VsZWN0JztcbiAgICB0YWcgPSBzZWxlY3RJbnB1dCB8fCB0ZXh0YXJlYUlucHV0ID8gdHlwZSA6ICdpbnB1dCc7XG5cbiAgICBsZXQgZm9ybUNvbnRyb2xDbGFzcyA9ICdmb3JtLWNvbnRyb2wnO1xuXG4gICAgaWYgKHBsYWludGV4dCkge1xuICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9IGAke2Zvcm1Db250cm9sQ2xhc3N9LXBsYWludGV4dGA7XG4gICAgICB0YWcgPSAnaW5wdXQnO1xuICAgIH0gZWxzZSBpZiAoZmlsZUlucHV0KSB7XG4gICAgICBmb3JtQ29udHJvbENsYXNzID0gYCR7Zm9ybUNvbnRyb2xDbGFzc30tZmlsZWA7XG4gICAgfSBlbHNlIGlmIChjaGVja0lucHV0KSB7XG4gICAgICBpZiAoYWRkb24pIHtcbiAgICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQ29udHJvbENsYXNzID0gJ2Zvcm0tY2hlY2staW5wdXQnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaXplICYmIGlzTm90YU51bWJlci50ZXN0KHNpemUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdQbGVhc2UgdXNlIHRoZSBwcm9wIFwiYnNTaXplXCIgaW5zdGVhZCBvZiB0aGUgXCJzaXplXCIgdG8gYm9vdHN0cmFwXFwncyBpbnB1dCBzaXppbmcuJ1xuICAgICAgKTtcbiAgICAgIGJzU2l6ZSA9IHNpemU7XG4gICAgICBzaXplID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNsYXNzZXMgPSBjbHN4KFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgaW52YWxpZCAmJiAnaXMtaW52YWxpZCcsXG4gICAgICB2YWxpZCAmJiAnaXMtdmFsaWQnLFxuICAgICAgYnNTaXplID8gYGZvcm0tY29udHJvbC0ke2JzU2l6ZX1gIDogZmFsc2UsXG4gICAgICBmb3JtQ29udHJvbENsYXNzXG4gICAgKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgdGFnID09PSAnaW5wdXQnfVxuICB7I2lmIHR5cGUgPT09ICd0ZXh0J31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAncGFzc3dvcmQnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZW1haWwnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZmlsZSd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOmZpbGVzXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2NoZWNrYm94J31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOmNoZWNrZWRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAncmFkaW8nfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAndXJsJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ1cmxcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdudW1iZXInfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2RhdGUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICd0aW1lJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZGF0ZXRpbWUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImRhdGV0aW1lXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnY29sb3InfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImNvbG9yXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnc2VhcmNoJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgey9pZn1cblxuezplbHNlIGlmIHRhZyA9PT0gJ3RleHRhcmVhJ31cbiAgPHRleHRhcmVhXG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjprZXlkb3duXG4gICAgb246a2V5cHJlc3NcbiAgICBvbjprZXl1cFxuICAgIG9uOmNoYW5nZVxuICAgIG9uOmlucHV0XG4gICAgYmluZDp2YWx1ZVxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH0gLz5cblxuezplbHNlIGlmIHRhZyA9PT0gJ3NlbGVjdCd9XG4gIDxzZWxlY3RcbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIHttdWx0aXBsZX1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH0+XG4gICAgPHNsb3QgLz5cbiAgPC9zZWxlY3Q+XG5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IG5hbWUgPSAnJztcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IHR5cGU7XG4gIGV4cG9ydCBsZXQgbGFiZWwgPSAnJztcbiAgZXhwb3J0IGxldCBjaGVja2VkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpbmxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZhbHVlID0gJyc7XG4gIGV4cG9ydCBsZXQgaW52YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGJzU2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IHBsYWNlaG9sZGVyID0gJyc7XG4gIGV4cG9ydCBsZXQgaHRtbEZvciA9ICcnO1xuICBleHBvcnQgeyBodG1sRm9yIGFzIGZvciB9O1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBjb25zdCB7IHR5cGU6IF9vbWl0VHlwZSwgLi4ucHJvcHMgfSA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGN1c3RvbUNsYXNzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgYGN1c3RvbS0ke3R5cGV9YCxcbiAgICBic1NpemUgPyBgY3VzdG9tLSR7dHlwZX0tJHtic1NpemV9YCA6IGZhbHNlXG4gICk7XG5cbiAgJDogdmFsaWRhdGlvbkNsYXNzTmFtZXMgPSBjbHN4KGludmFsaWQgJiYgJ2lzLWludmFsaWQnLCB2YWxpZCAmJiAnaXMtdmFsaWQnKTtcblxuICAkOiBjb21iaW5lZENsYXNzZXMgPSBjbHN4KGN1c3RvbUNsYXNzLCB2YWxpZGF0aW9uQ2xhc3NOYW1lcyk7XG5cbiAgJDogZmlsZUNsYXNzZXMgPSBjbHN4KHZhbGlkYXRpb25DbGFzc05hbWVzLCAnY3VzdG9tLWZpbGUtaW5wdXQnKTtcblxuICAkOiB3cmFwcGVyQ2xhc3NlcyA9IGNsc3goY3VzdG9tQ2xhc3MsICdjdXN0b20tY29udHJvbCcsIHtcbiAgICAnY3VzdG9tLWNvbnRyb2wtaW5saW5lJzogaW5saW5lXG4gIH0pO1xuXG4gICQ6IGN1c3RvbUNvbnRyb2xDbGFzc2VzID0gY2xzeCh2YWxpZGF0aW9uQ2xhc3NOYW1lcywgJ2N1c3RvbS1jb250cm9sLWlucHV0Jyk7XG5cbiAgJDogbGFiZWxIdG1sRm9yID0gaHRtbEZvciB8fCBpZDtcbjwvc2NyaXB0PlxuXG57I2lmIHR5cGUgPT09ICdzZWxlY3QnfVxuICA8c2VsZWN0XG4gICAge2lkfVxuICAgIGNsYXNzPXtjb21iaW5lZENsYXNzZXN9XG4gICAgb246Ymx1clxuICAgIG9uOmZvY3VzXG4gICAgb246Y2hhbmdlXG4gICAgb246aW5wdXRcbiAgICBiaW5kOnZhbHVlXG4gICAge25hbWV9XG4gICAge2Rpc2FibGVkfVxuICAgIHtwbGFjZWhvbGRlcn1cbiAgICB7Li4ucHJvcHN9PlxuICAgIDxzbG90IC8+XG4gIDwvc2VsZWN0PlxuezplbHNlIGlmIHR5cGUgPT09ICdmaWxlJ31cbiAgPGRpdiBjbGFzcz17Y3VzdG9tQ2xhc3N9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgY2xhc3M9e2ZpbGVDbGFzc2VzfVxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgey4uLnByb3BzfSAvPlxuICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1maWxlLWxhYmVsXCIgZm9yPXtsYWJlbEh0bWxGb3J9PlxuICAgICAge2xhYmVsIHx8ICdDaG9vc2UgZmlsZSd9XG4gICAgPC9sYWJlbD5cbiAgPC9kaXY+XG57OmVsc2UgaWYgdHlwZSA9PT0gJ3N3aXRjaCcgfHwgdHlwZSA9PT0gJ2NoZWNrYm94J31cbiAgPGRpdiBjbGFzcz17d3JhcHBlckNsYXNzZXN9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgIGNsYXNzPXtjdXN0b21Db250cm9sQ2xhc3Nlc31cbiAgICAgIGJpbmQ6Y2hlY2tlZFxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9XG4gICAgICB7Li4ucHJvcHN9IC8+XG4gICAgPGxhYmVsIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtbGFiZWxcIiBmb3I9e2xhYmVsSHRtbEZvcn0+e2xhYmVsfTwvbGFiZWw+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57OmVsc2UgaWYgdHlwZSA9PT0gJ3JhZGlvJ31cbiAgPGRpdiBjbGFzcz17d3JhcHBlckNsYXNzZXN9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgIGNsYXNzPXtjdXN0b21Db250cm9sQ2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgey4uLnByb3BzfSAvPlxuICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1jb250cm9sLWxhYmVsXCIgZm9yPXtsYWJlbEh0bWxGb3J9PntsYWJlbH08L2xhYmVsPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuezplbHNlfVxuICA8aW5wdXRcbiAgICB7dHlwZX1cbiAgICB7aWR9XG4gICAgY2xhc3M9e2NvbWJpbmVkQ2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH1cbiAgICB7cGxhY2Vob2xkZXJ9XG4gICAgey4uLnByb3BzfSAvPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYmxvY2sgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgZXhwb3J0IGxldCBjbG9zZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNvbG9yID0gJ3NlY29uZGFyeSc7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBocmVmID0gJyc7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCBvdXRsaW5lID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IHN0eWxlID0gJyc7XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGFyaWFMYWJlbCA9ICQkcHJvcHNbJ2FyaWEtbGFiZWwnXTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgeyBjbG9zZSB9LFxuICAgIGNsb3NlIHx8ICdidG4nLFxuICAgIGNsb3NlIHx8IGBidG4ke291dGxpbmUgPyAnLW91dGxpbmUnIDogJyd9LSR7Y29sb3J9YCxcbiAgICBzaXplID8gYGJ0bi0ke3NpemV9YCA6IGZhbHNlLFxuICAgIGJsb2NrID8gJ2J0bi1ibG9jaycgOiBmYWxzZSxcbiAgICB7IGFjdGl2ZSB9XG4gICk7XG5cbiAgJDogZGVmYXVsdEFyaWFMYWJlbCA9IGNsb3NlID8gJ0Nsb3NlJyA6IG51bGw7XG48L3NjcmlwdD5cblxueyNpZiBocmVmfVxuICA8YVxuICAgIHsuLi5wcm9wc31cbiAgICB7aWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAge2Rpc2FibGVkfVxuICAgIG9uOmNsaWNrXG4gICAge2hyZWZ9XG4gICAgYXJpYS1sYWJlbD17YXJpYUxhYmVsIHx8IGRlZmF1bHRBcmlhTGFiZWx9XG4gICAge3N0eWxlfT5cbiAgICB7I2lmIGNoaWxkcmVufVxuICAgICAge2NoaWxkcmVufVxuICAgIHs6ZWxzZX1cbiAgICAgIDxzbG90IC8+XG4gICAgey9pZn1cbiAgPC9hPlxuezplbHNlfVxuICA8YnV0dG9uXG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7ZGlzYWJsZWR9XG4gICAgb246Y2xpY2tcbiAgICB7dmFsdWV9XG4gICAgYXJpYS1sYWJlbD17YXJpYUxhYmVsIHx8IGRlZmF1bHRBcmlhTGFiZWx9XG4gICAge3N0eWxlfT5cbiAgICA8c2xvdD5cbiAgICAgIHsjaWYgY2xvc2V9XG4gICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPlxuICAgICAgezplbHNlIGlmIGNoaWxkcmVufVxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICB7OmVsc2V9XG4gICAgICAgIDxzbG90IC8+XG4gICAgICB7L2lmfVxuICAgIDwvc2xvdD5cbiAgPC9idXR0b24+XG57L2lmfVxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgQ2hhcnQgZnJvbSBcImNoYXJ0LmpzXCI7XHJcbiAgaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gXCJzdmVsdGVcIjtcclxuXHJcbiAgY29uc3QgY2hhcnREYXRhID0ge1xyXG4gICAgbGFiZWxzOiBbXCJSZWRcIiwgXCJCbHVlXCIsIFwiWWVsbG93XCIsIFwiR3JlZW5cIiwgXCJQdXJwbGVcIiwgXCJPcmFuZ2VcIl0sXHJcbiAgICBkYXRhc2V0czogW1xyXG4gICAgICB7XHJcbiAgICAgICAgbGFiZWw6IFwiIyBvZiBWb3Rlc1wiLFxyXG4gICAgICAgIGRhdGE6IFsxMiwgMTksIDMsIDUsIDIsIDNdLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xyXG4gICAgICAgICAgXCJyZ2JhKDI1NSwgOTksIDEzMiwgMC44KVwiLFxyXG4gICAgICAgICAgXCJyZ2JhKDU0LCAxNjIsIDIzNSwgMC44KVwiLFxyXG4gICAgICAgICAgXCJyZ2JhKDI1NSwgMjA2LCA4NiwgMC44KVwiLFxyXG4gICAgICAgICAgXCJyZ2JhKDc1LCAxOTIsIDE5MiwgMC44KVwiLFxyXG4gICAgICAgICAgXCJyZ2JhKDE1MywgMTAyLCAyNTUsIDAuOClcIixcclxuICAgICAgICAgIFwicmdiYSgyNTUsIDE1OSwgNjQsIDAuOClcIlxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICBib3JkZXJXaWR0aDogMVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfTtcclxuICBjb25zdCBjaGFydE9wdGlvbnMgPSB7XHJcbiAgICBzY2FsZXM6IHtcclxuICAgICAgeUF4ZXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0KCkge1xyXG4gICAgdmFyIGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGllQ2hhcnRcIik7XHJcbiAgICB2YXIgbXlDaGFydCA9IG5ldyBDaGFydChjdHgsIHtcclxuICAgICAgdHlwZTogXCJwaWVcIixcclxuICAgICAgZGF0YTogY2hhcnREYXRhLFxyXG4gICAgICBvcHRpb25zOiBjaGFydE9wdGlvbnNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25Nb3VudChjcmVhdGVDaGFydCk7XHJcbjwvc2NyaXB0PlxyXG5cclxuPGNhbnZhcyBpZD1cInBpZUNoYXJ0XCIgLz5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgQnJlYWRjcnVtYiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0JyZWFkY3J1bWIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJyZWFkY3J1bWJJdGVtIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnJlYWRjcnVtYkl0ZW0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENhcmQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DYXJkLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkQm9keSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRCb2R5LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDYXJkSGVhZGVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ2FyZEhlYWRlci5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ2FyZEZvb3RlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NhcmRGb290ZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFJvdyBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1Jvdy5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IEFyZWFDaGFydCBmcm9tIFwiLi4vY29tcG9uZW50cy9DaGFydHMvQXJlYUNoYXJ0LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBCYXJDaGFydCBmcm9tIFwiLi4vY29tcG9uZW50cy9DaGFydHMvQmFyQ2hhcnQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFBpZUNoYXJ0IGZyb20gXCIuLi9jb21wb25lbnRzL0NoYXJ0cy9QaWVDaGFydC5zdmVsdGVcIjtcclxuXHJcbiAgbGV0IGNhcmRGb290ZXJUZXh0ID0gXCLQntCx0L3QvtCy0LvQtdC90L4g0LLRh9C10YDQsCDQsiAyMzo1OVwiO1xyXG4gIGxldCBhcmVhQ2FyZFRpdGxlID0gXCLQn9GA0LjQvNC10YAg0LTQuNCw0LPRgNCw0LzQvNGLINGA0LXQs9C40L7QvdCwXCI7XHJcbiAgbGV0IGJhckNhcmRUaXRsZSA9IFwi0J/RgNC40LzQtdGAINCz0LjRgdGC0L7Qs9GA0LDQvNC80YtcIjtcclxuICBsZXQgcGllQ2FyZFRpdGxlID0gXCLQn9GA0LjQvNC10YAg0LrRgNGD0LPQvtCy0L7QuSDQtNC40LDQs9GA0LDQvNC80YtcIjtcclxuPC9zY3JpcHQ+XHJcblxyXG48aDEgY2xhc3M9XCJtdC00XCI+0JTQuNCw0LPRgNCw0LzQvNGLPC9oMT5cclxuPEJyZWFkY3J1bWIgY2xhc3M9XCJtYi00XCI+XHJcbiAgPEJyZWFkY3J1bWJJdGVtPlxyXG4gICAgPGEgaHJlZj1cIi5cIj7Qn9Cw0L3QtdC70Yw8L2E+XHJcbiAgPC9CcmVhZGNydW1iSXRlbT5cclxuICA8QnJlYWRjcnVtYkl0ZW0gYWN0aXZlPtCU0LjQsNCz0YDQsNC80LzRizwvQnJlYWRjcnVtYkl0ZW0+XHJcbjwvQnJlYWRjcnVtYj5cclxuXHJcbjxDYXJkIGNsYXNzPVwibWItNFwiPlxyXG4gIDxDYXJkQm9keT5cclxuICAgIENoYXJ0LmpzINGP0LLQu9GP0LXRgtGB0Y8g0YHRgtC+0YDQvtC90L3QuNC8INC/0LvQsNCz0LjQvdC+0LwsINC60L7RgtC+0YDRi9C5INC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INCz0YDQsNGE0LjQutC+0LIg0LIg0Y3RgtC+0LxcclxuICAgINGI0LDQsdC70L7QvS4g0J/RgNC40LLQtdC00LXQvdC90YvQtSDQvdC40LbQtSDQs9GA0LDRhNC40LrQuCDQsdGL0LvQuCDQvdCw0YHRgtGA0L7QtdC90YsgLSDQtNC70Y8g0LTQsNC70YzQvdC10LnRiNC10Lkg0L3QsNGB0YLRgNC+0LnQutC4LlxyXG4gICAg0LLQsNGA0LjQsNC90YLRiywg0L/QvtC20LDQu9GD0LnRgdGC0LAsINC/0L7RgdC10YLQuNGC0LUg0L7RhNC40YbQuNCw0LvRjNC90YvQuVxyXG4gICAgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vd3d3LmNoYXJ0anMub3JnL2RvY3MvbGF0ZXN0L1wiPlxyXG4gICAgICBDaGFydC5qcyDQtNC+0LrRg9C80LXQvdGC0LDRhtC40Y9cclxuICAgIDwvYT5cclxuICAgIC5cclxuICA8L0NhcmRCb2R5PlxyXG48L0NhcmQ+XHJcblxyXG48Q2FyZCBjbGFzcz1cIm1iLTRcIj5cclxuICA8Q2FyZEhlYWRlcj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LWFyZWFcIiAvPlxyXG4gICAge2FyZWFDYXJkVGl0bGV9XHJcbiAgPC9DYXJkSGVhZGVyPlxyXG4gIDxDYXJkQm9keT5cclxuICAgIDxBcmVhQ2hhcnQgLz5cclxuICA8L0NhcmRCb2R5PlxyXG4gIDxDYXJkRm9vdGVyIGNsYXNzPVwic21hbGwgdGV4dC1tdXRlZFwiPntjYXJkRm9vdGVyVGV4dH08L0NhcmRGb290ZXI+XHJcbjwvQ2FyZD5cclxuXHJcbjxSb3c+XHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy02XCI+XHJcbiAgICA8Q2FyZCBjbGFzcz1cIm1iLTRcIj5cclxuICAgICAgPENhcmRIZWFkZXI+XHJcbiAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYmFyXCIgLz5cclxuICAgICAgICB7YmFyQ2FyZFRpdGxlfVxyXG4gICAgICA8L0NhcmRIZWFkZXI+XHJcbiAgICAgIDxDYXJkQm9keT5cclxuICAgICAgICA8QmFyQ2hhcnQgLz5cclxuICAgICAgPC9DYXJkQm9keT5cclxuICAgICAgPENhcmRGb290ZXIgY2xhc3M9XCJzbWFsbCB0ZXh0LW11dGVkXCI+e2NhcmRGb290ZXJUZXh0fTwvQ2FyZEZvb3Rlcj5cclxuICAgIDwvQ2FyZD5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLWxnLTZcIj5cclxuICAgIDxDYXJkIGNsYXNzPVwibWItNFwiPlxyXG4gICAgICA8Q2FyZEhlYWRlcj5cclxuICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1waWVcIiAvPlxyXG4gICAgICAgIHtwaWVDYXJkVGl0bGV9XHJcbiAgICAgIDwvQ2FyZEhlYWRlcj5cclxuICAgICAgPENhcmRCb2R5PlxyXG4gICAgICAgIDxQaWVDaGFydCAvPlxyXG4gICAgICA8L0NhcmRCb2R5PlxyXG4gICAgICA8Q2FyZEZvb3RlciBjbGFzcz1cInNtYWxsIHRleHQtbXV0ZWRcIj57Y2FyZEZvb3RlclRleHR9PC9DYXJkRm9vdGVyPlxyXG4gICAgPC9DYXJkPlxyXG4gIDwvZGl2PlxyXG48L1Jvdz5cclxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBmbHVpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIGZsdWlkID8gJ2NvbnRhaW5lci1mbHVpZCcgOiAnY29udGFpbmVyJyk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBSb3cgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Sb3cuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IENvbnRhaW5lciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbnRhaW5lci5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IEZvb3RlciBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9Gb290ZXIuc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuPC9zY3JpcHQ+XHJcblxyXG57I2lmIHNlZ21lbnQgPT09ICdhdXRoZW50aWNhdGlvbid9XHJcbiAgPGRpdiBpZD1cImxheW91dEF1dGhlbnRpY2F0aW9uXCIgY2xhc3M9XCJiZy1kYW5nZXJcIj5cclxuICAgIDxkaXYgaWQ9XCJsYXlvdXRBdXRoZW50aWNhdGlvbl9jb250ZW50XCI+XHJcbiAgICAgIDxtYWluPlxyXG4gICAgICAgIDxDb250YWluZXI+XHJcbiAgICAgICAgICA8Um93IGNsYXNzPVwianVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8c2xvdCAvPlxyXG4gICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgPC9Db250YWluZXI+XHJcbiAgICAgIDwvbWFpbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPEZvb3RlciAvPlxyXG4gIDwvZGl2PlxyXG57OmVsc2V9XHJcbiAgPGRpdiBpZD1cImxheW91dEVycm9yXCI+XHJcbiAgICA8ZGl2IGlkPVwibGF5b3V0RXJyb3JfY29udGVudFwiPlxyXG4gICAgICA8bWFpbj5cclxuICAgICAgICA8Q29udGFpbmVyPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctNlwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlciBtdC00XCI+XHJcbiAgICAgICAgICAgICAgICA8c2xvdCAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICA8L21haW4+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxGb290ZXIgLz5cclxuICA8L2Rpdj5cclxuey9pZn1cclxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcbiAgaW1wb3J0IHsgZ2V0Q29sdW1uU2l6ZUNsYXNzLCBpc09iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGNvbnN0IGNvbENsYXNzZXMgPSBbXTtcbiAgY29uc3Qgd2lkdGhzID0gWyd4cycsICdzbScsICdtZCcsICdsZycsICd4bCddO1xuXG4gIHdpZHRocy5mb3JFYWNoKGNvbFdpZHRoID0+IHtcbiAgICBjb25zdCBjb2x1bW5Qcm9wID0gJCRwcm9wc1tjb2xXaWR0aF07XG4gICAgaWYgKCFjb2x1bW5Qcm9wICYmIGNvbHVtblByb3AgIT09ICcnKSB7XG4gICAgICByZXR1cm47IC8vbm8gdmFsdWUgZm9yIHRoaXMgd2lkdGhcbiAgICB9XG5cbiAgICBjb25zdCBpc1hzID0gY29sV2lkdGggPT09ICd4cyc7XG5cbiAgICBpZiAoaXNPYmplY3QoY29sdW1uUHJvcCkpIHtcbiAgICAgIGNvbnN0IGNvbFNpemVJbnRlcmZpeCA9IGlzWHMgPyAnLScgOiBgLSR7Y29sV2lkdGh9LWA7XG4gICAgICBjb25zdCBjb2xDbGFzcyA9IGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sdW1uUHJvcC5zaXplKTtcblxuICAgICAgaWYgKGNvbHVtblByb3Auc2l6ZSB8fCBjb2x1bW5Qcm9wLnNpemUgPT09ICcnKSB7XG4gICAgICAgIGNvbENsYXNzZXMucHVzaChjb2xDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoY29sdW1uUHJvcC5wdXNoKSB7XG4gICAgICAgIGNvbENsYXNzZXMucHVzaChgcHVzaCR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5wdXNofWApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbHVtblByb3AucHVsbCkge1xuICAgICAgICBjb2xDbGFzc2VzLnB1c2goYHB1bGwke2NvbFNpemVJbnRlcmZpeH0ke2NvbHVtblByb3AucHVsbH1gKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2x1bW5Qcm9wLm9mZnNldCkge1xuICAgICAgICBjb2xDbGFzc2VzLnB1c2goYG9mZnNldCR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5vZmZzZXR9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbENsYXNzZXMucHVzaChnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3ApKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICghY29sQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICBjb2xDbGFzc2VzLnB1c2goJ2NvbCcpO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGNvbENsYXNzZXMucHVzaChjbGFzc05hbWUpO1xuICB9XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NvbENsYXNzZXMuam9pbignICcpfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgTG9naW4gZnJvbSBcIi4vbG9naW4uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFJlZ2lzdGVyIGZyb20gXCIuL3JlZ2lzdGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBGb3JnZXRQYXNzd29yZCBmcm9tIFwiLi9mb3JnZXRfcGFzc3dvcmQuc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuPC9zY3JpcHQ+XHJcblxyXG57I2lmIHNlZ21lbnQgPT09ICdsb2dpbid9XHJcbiAgPExvZ2luIC8+XHJcbns6ZWxzZSBpZiBzZWdtZW50ID09PSAncmVnaXN0ZXInfVxyXG4gIDxSZWdpc3RlciAvPlxyXG57OmVsc2UgaWYgc2VnbWVudCA9PT0gJ2ZvcmdldF9wYXNzd29yZCd9XHJcbiAgPEZvcmdldFBhc3N3b3JkIC8+XHJcbnsvaWZ9XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IEVycm9yNDAxIGZyb20gXCIuL2Vycm9yXzQwMS5zdmVsdGVcIjtcclxuICBpbXBvcnQgRXJyb3I0MDQgZnJvbSBcIi4vZXJyb3JfNDA0LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBFcnJvcjUwMCBmcm9tIFwiLi9lcnJvcl81MDAuc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuPC9zY3JpcHQ+XHJcblxyXG57I2lmIHNlZ21lbnQgPT09ICdlcnJvcl80MDEnfVxyXG4gIDxFcnJvcjQwMSAvPlxyXG57OmVsc2UgaWYgc2VnbWVudCA9PT0gJ2Vycm9yXzQwNCd9XHJcbiAgPEVycm9yNDA0IC8+XHJcbns6ZWxzZSBpZiBzZWdtZW50ID09PSAnZXJyb3JfNTAwJ31cclxuICA8RXJyb3I1MDAgLz5cclxuey9pZn1cclxuIiwiPHNjcmlwdCBjb250ZXh0PVwibW9kdWxlXCI+XHJcblx0ZXhwb3J0IGZ1bmN0aW9uIHByZWxvYWQoeyBwYXJhbXMsIHF1ZXJ5IH0pIHtcclxuXHRcdHJldHVybiB0aGlzLmZldGNoKGBibG9nLmpzb25gKS50aGVuKHIgPT4gci5qc29uKCkpLnRoZW4ocG9zdHMgPT4ge1xyXG5cdFx0XHRyZXR1cm4geyBwb3N0cyB9O1xyXG5cdFx0fSk7XHJcblx0fVxyXG48L3NjcmlwdD5cclxuXHJcbjxzY3JpcHQ+XHJcblx0ZXhwb3J0IGxldCBwb3N0cztcclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGU+XHJcblx0dWwge1xyXG5cdFx0bWFyZ2luOiAwIDAgMWVtIDA7XHJcblx0XHRsaW5lLWhlaWdodDogMS41O1xyXG5cdH1cclxuPC9zdHlsZT5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuXHQ8dGl0bGU+QmxvZzwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcblxyXG48aDE+UmVjZW50IHBvc3RzPC9oMT5cclxuXHJcbjx1bD5cclxuXHR7I2VhY2ggcG9zdHMgYXMgcG9zdH1cclxuXHRcdDwhLS0gd2UncmUgdXNpbmcgdGhlIG5vbi1zdGFuZGFyZCBgcmVsPXByZWZldGNoYCBhdHRyaWJ1dGUgdG9cclxuXHRcdFx0XHR0ZWxsIFNhcHBlciB0byBsb2FkIHRoZSBkYXRhIGZvciB0aGUgcGFnZSBhcyBzb29uIGFzXHJcblx0XHRcdFx0dGhlIHVzZXIgaG92ZXJzIG92ZXIgdGhlIGxpbmsgb3IgdGFwcyBpdCwgaW5zdGVhZCBvZlxyXG5cdFx0XHRcdHdhaXRpbmcgZm9yIHRoZSAnY2xpY2snIGV2ZW50IC0tPlxyXG5cdFx0PGxpPjxhIHJlbD0ncHJlZmV0Y2gnIGhyZWY9J2Jsb2cve3Bvc3Quc2x1Z30nPntwb3N0LnRpdGxlfTwvYT48L2xpPlxyXG5cdHsvZWFjaH1cclxuPC91bD4iLCI8c2NyaXB0IGNvbnRleHQ9XCJtb2R1bGVcIj5cclxuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJlbG9hZCh7IHBhcmFtcywgcXVlcnkgfSkge1xyXG5cdFx0Ly8gdGhlIGBzbHVnYCBwYXJhbWV0ZXIgaXMgYXZhaWxhYmxlIGJlY2F1c2VcclxuXHRcdC8vIHRoaXMgZmlsZSBpcyBjYWxsZWQgW3NsdWddLnN2ZWx0ZVxyXG5cdFx0Y29uc3QgcmVzID0gYXdhaXQgdGhpcy5mZXRjaChgYmxvZy8ke3BhcmFtcy5zbHVnfS5qc29uYCk7XHJcblx0XHRjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTtcclxuXHJcblx0XHRpZiAocmVzLnN0YXR1cyA9PT0gMjAwKSB7XHJcblx0XHRcdHJldHVybiB7IHBvc3Q6IGRhdGEgfTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZXJyb3IocmVzLnN0YXR1cywgZGF0YS5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHNjcmlwdD5cclxuXHRleHBvcnQgbGV0IHBvc3Q7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG5cdC8qXHJcblx0XHRCeSBkZWZhdWx0LCBDU1MgaXMgbG9jYWxseSBzY29wZWQgdG8gdGhlIGNvbXBvbmVudCxcclxuXHRcdGFuZCBhbnkgdW51c2VkIHN0eWxlcyBhcmUgZGVhZC1jb2RlLWVsaW1pbmF0ZWQuXHJcblx0XHRJbiB0aGlzIHBhZ2UsIFN2ZWx0ZSBjYW4ndCBrbm93IHdoaWNoIGVsZW1lbnRzIGFyZVxyXG5cdFx0Z29pbmcgdG8gYXBwZWFyIGluc2lkZSB0aGUge3t7cG9zdC5odG1sfX19IGJsb2NrLFxyXG5cdFx0c28gd2UgaGF2ZSB0byB1c2UgdGhlIDpnbG9iYWwoLi4uKSBtb2RpZmllciB0byB0YXJnZXRcclxuXHRcdGFsbCBlbGVtZW50cyBpbnNpZGUgLmNvbnRlbnRcclxuXHQqL1xyXG5cdC5jb250ZW50IDpnbG9iYWwoaDIpIHtcclxuXHRcdGZvbnQtc2l6ZTogMS40ZW07XHJcblx0XHRmb250LXdlaWdodDogNTAwO1xyXG5cdH1cclxuXHJcblx0LmNvbnRlbnQgOmdsb2JhbChwcmUpIHtcclxuXHRcdGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XHJcblx0XHRib3gtc2hhZG93OiBpbnNldCAxcHggMXB4IDVweCByZ2JhKDAsMCwwLDAuMDUpO1xyXG5cdFx0cGFkZGluZzogMC41ZW07XHJcblx0XHRib3JkZXItcmFkaXVzOiAycHg7XHJcblx0XHRvdmVyZmxvdy14OiBhdXRvO1xyXG5cdH1cclxuXHJcblx0LmNvbnRlbnQgOmdsb2JhbChwcmUpIDpnbG9iYWwoY29kZSkge1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcblx0XHRwYWRkaW5nOiAwO1xyXG5cdH1cclxuXHJcblx0LmNvbnRlbnQgOmdsb2JhbCh1bCkge1xyXG5cdFx0bGluZS1oZWlnaHQ6IDEuNTtcclxuXHR9XHJcblxyXG5cdC5jb250ZW50IDpnbG9iYWwobGkpIHtcclxuXHRcdG1hcmdpbjogMCAwIDAuNWVtIDA7XHJcblx0fVxyXG48L3N0eWxlPlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG5cdDx0aXRsZT57cG9zdC50aXRsZX08L3RpdGxlPlxyXG48L3N2ZWx0ZTpoZWFkPlxyXG5cclxuPGgxPntwb3N0LnRpdGxlfTwvaDE+XHJcblxyXG48ZGl2IGNsYXNzPSdjb250ZW50Jz5cclxuXHR7QGh0bWwgcG9zdC5odG1sfVxyXG48L2Rpdj5cclxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBsaWdodCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRhcmsgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBmaXhlZCA9ICcnO1xuICBleHBvcnQgbGV0IHN0aWNreSA9ICcnO1xuICBleHBvcnQgbGV0IGNvbG9yID0gJyc7XG4gIGV4cG9ydCBsZXQgZXhwYW5kID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRFeHBhbmRDbGFzcyhleHBhbmQpIHtcbiAgICBpZiAoZXhwYW5kID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZXhwYW5kID09PSB0cnVlIHx8IGV4cGFuZCA9PT0gJ3hzJykge1xuICAgICAgcmV0dXJuICduYXZiYXItZXhwYW5kJztcbiAgICB9XG5cbiAgICByZXR1cm4gYG5hdmJhci1leHBhbmQtJHtleHBhbmR9YDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ25hdmJhcicsIGdldEV4cGFuZENsYXNzKGV4cGFuZCksIHtcbiAgICAnbmF2YmFyLWxpZ2h0JzogbGlnaHQsXG4gICAgJ25hdmJhci1kYXJrJzogZGFyayxcbiAgICBbYGJnLSR7Y29sb3J9YF06IGNvbG9yLFxuICAgIFtgZml4ZWQtJHtmaXhlZH1gXTogZml4ZWQsXG4gICAgW2BzdGlja3ktJHtzdGlja3l9YF06IHN0aWNreVxuICB9KTtcbjwvc2NyaXB0PlxuXG48bmF2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9uYXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGhyZWYgPSAnLyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICduYXZiYXItYnJhbmQnKTtcbjwvc2NyaXB0PlxuXG48YSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfSB7aHJlZn0+XG4gIDxzbG90IC8+XG48L2E+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHRhYnMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwaWxscyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZlcnRpY2FsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaG9yaXpvbnRhbCA9ICcnO1xuICBleHBvcnQgbGV0IGp1c3RpZmllZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZpbGwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjYXJkID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRWZXJ0aWNhbENsYXNzKHZlcnRpY2FsKSB7XG4gICAgaWYgKHZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodmVydGljYWwgPT09IHRydWUgfHwgdmVydGljYWwgPT09ICd4cycpIHtcbiAgICAgIHJldHVybiAnZmxleC1jb2x1bW4nO1xuICAgIH1cbiAgICByZXR1cm4gYGZsZXgtJHt2ZXJ0aWNhbH0tY29sdW1uYDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBuYXZiYXIgPyAnbmF2YmFyLW5hdicgOiAnbmF2JyxcbiAgICBob3Jpem9udGFsID8gYGp1c3RpZnktY29udGVudC0ke2hvcml6b250YWx9YCA6IGZhbHNlLFxuICAgIGdldFZlcnRpY2FsQ2xhc3ModmVydGljYWwpLFxuICAgIHtcbiAgICAgICduYXYtdGFicyc6IHRhYnMsXG4gICAgICAnY2FyZC1oZWFkZXItdGFicyc6IGNhcmQgJiYgdGFicyxcbiAgICAgICduYXYtcGlsbHMnOiBwaWxscyxcbiAgICAgICdjYXJkLWhlYWRlci1waWxscyc6IGNhcmQgJiYgcGlsbHMsXG4gICAgICAnbmF2LWp1c3RpZmllZCc6IGp1c3RpZmllZCxcbiAgICAgICduYXYtZmlsbCc6IGZpbGxcbiAgICB9XG4gICk7XG48L3NjcmlwdD5cblxuPHVsIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC91bD5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSAnc3ZlbHRlL3RyYW5zaXRpb24nO1xuICBjb25zdCBub29wID0gKCkgPT4gdW5kZWZpbmVkO1xuXG4gIGV4cG9ydCBsZXQgaXNPcGVuID0gZmFsc2U7XG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbmF2YmFyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmluZyA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBvbkV4aXRpbmcgPSBub29wO1xuICBleHBvcnQgbGV0IG9uRXhpdGVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBleHBhbmQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAvLyBjb2xsYXBzZUNsYXNzLFxuICAgIG5hdmJhciAmJiAnbmF2YmFyLWNvbGxhcHNlJ1xuICApO1xuXG4gIGxldCB3aW5kb3dXaWR0aCA9IDA7XG4gIGxldCBfd2FzTWF4aW1hemVkID0gZmFsc2U7XG5cbiAgY29uc3QgbWluV2lkdGggPSB7fTtcbiAgbWluV2lkdGhbJ3hzJ10gPSAwO1xuICBtaW5XaWR0aFsnc20nXSA9IDU3NjtcbiAgbWluV2lkdGhbJ21kJ10gPSA3Njg7XG4gIG1pbldpZHRoWydsZyddID0gOTkyO1xuICBtaW5XaWR0aFsneGwnXSA9IDEyMDA7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgZGlzcGF0Y2goJ3VwZGF0ZScsIHtcbiAgICAgIGlzT3BlbjogaXNPcGVuXG4gICAgfSk7XG4gIH1cblxuICAkOiBpZiAobmF2YmFyICYmIGV4cGFuZCkge1xuICAgIGlmICh3aW5kb3dXaWR0aCA+PSBtaW5XaWR0aFtleHBhbmRdICYmICFpc09wZW4pIHtcbiAgICAgIGlzT3BlbiA9IHRydWU7XG4gICAgICBfd2FzTWF4aW1hemVkID0gdHJ1ZTtcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gZWxzZSBpZiAod2luZG93V2lkdGggPCBtaW5XaWR0aFtleHBhbmRdICYmIF93YXNNYXhpbWF6ZWQpIHtcbiAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgX3dhc01heGltYXplZCA9IGZhbHNlO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPHN2ZWx0ZTp3aW5kb3cgYmluZDppbm5lcldpZHRoPXt3aW5kb3dXaWR0aH0gLz5cblxueyNpZiBpc09wZW59XG4gIDxkaXZcbiAgICB0cmFuc2l0aW9uOnNsaWRlXG4gICAgb246aW50cm9zdGFydFxuICAgIG9uOmludHJvZW5kXG4gICAgb246b3V0cm9zdGFydFxuICAgIG9uOm91dHJvZW5kXG4gICAgb246aW50cm9zdGFydD17b25FbnRlcmluZ31cbiAgICBvbjppbnRyb2VuZD17b25FbnRlcmVkfVxuICAgIG9uOm91dHJvc3RhcnQ9e29uRXhpdGluZ31cbiAgICBvbjpvdXRyb2VuZD17b25FeGl0ZWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCJpbXBvcnQgeyBub29wLCBzYWZlX25vdF9lcXVhbCwgc3Vic2NyaWJlLCBydW5fYWxsLCBpc19mdW5jdGlvbiB9IGZyb20gJy4uL2ludGVybmFsJztcbmV4cG9ydCB7IGdldF9zdG9yZV92YWx1ZSBhcyBnZXQgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0gdmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcn1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRhYmxlKHZhbHVlLCBzdGFydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZTogd3JpdGFibGUodmFsdWUsIHN0YXJ0KS5zdWJzY3JpYmUsXG4gICAgfTtcbn1cbi8qKlxuICogQ3JlYXRlIGEgYFdyaXRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyBib3RoIHVwZGF0aW5nIGFuZCByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7Kj19dmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcj19c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQgPSBub29wKSB7XG4gICAgbGV0IHN0b3A7XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmIChzYWZlX25vdF9lcXVhbCh2YWx1ZSwgbmV3X3ZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICBpZiAoc3RvcCkgeyAvLyBzdG9yZSBpcyByZWFkeVxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bl9xdWV1ZSA9ICFzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgc1sxXSgpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlLnB1c2gocywgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVuX3F1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZVtpXVswXShzdWJzY3JpYmVyX3F1ZXVlW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGUoZm4pIHtcbiAgICAgICAgc2V0KGZuKHZhbHVlKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShydW4sIGludmFsaWRhdGUgPSBub29wKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBbcnVuLCBpbnZhbGlkYXRlXTtcbiAgICAgICAgc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgc3RvcCA9IHN0YXJ0KHNldCkgfHwgbm9vcDtcbiAgICAgICAgfVxuICAgICAgICBydW4odmFsdWUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpYmVycy5pbmRleE9mKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgIHN0b3AgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzZXQsIHVwZGF0ZSwgc3Vic2NyaWJlIH07XG59XG5mdW5jdGlvbiBkZXJpdmVkKHN0b3JlcywgZm4sIGluaXRpYWxfdmFsdWUpIHtcbiAgICBjb25zdCBzaW5nbGUgPSAhQXJyYXkuaXNBcnJheShzdG9yZXMpO1xuICAgIGNvbnN0IHN0b3Jlc19hcnJheSA9IHNpbmdsZVxuICAgICAgICA/IFtzdG9yZXNdXG4gICAgICAgIDogc3RvcmVzO1xuICAgIGNvbnN0IGF1dG8gPSBmbi5sZW5ndGggPCAyO1xuICAgIHJldHVybiByZWFkYWJsZShpbml0aWFsX3ZhbHVlLCAoc2V0KSA9PiB7XG4gICAgICAgIGxldCBpbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgIGxldCBwZW5kaW5nID0gMDtcbiAgICAgICAgbGV0IGNsZWFudXAgPSBub29wO1xuICAgICAgICBjb25zdCBzeW5jID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbihzaW5nbGUgPyB2YWx1ZXNbMF0gOiB2YWx1ZXMsIHNldCk7XG4gICAgICAgICAgICBpZiAoYXV0bykge1xuICAgICAgICAgICAgICAgIHNldChyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCA9IGlzX2Z1bmN0aW9uKHJlc3VsdCkgPyByZXN1bHQgOiBub29wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZXJzID0gc3RvcmVzX2FycmF5Lm1hcCgoc3RvcmUsIGkpID0+IHN1YnNjcmliZShzdG9yZSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBlbmRpbmcgJj0gfigxIDw8IGkpO1xuICAgICAgICAgICAgaWYgKGluaXRlZCkge1xuICAgICAgICAgICAgICAgIHN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcGVuZGluZyB8PSAoMSA8PCBpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBpbml0ZWQgPSB0cnVlO1xuICAgICAgICBzeW5jKCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICAgICAgcnVuX2FsbCh1bnN1YnNjcmliZXJzKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgZGVyaXZlZCwgcmVhZGFibGUsIHdyaXRhYmxlIH07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDb250ZXh0ID0gKCkgPT4gd3JpdGFibGUoe30pOyIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAnLi9Ecm9wZG93bkNvbnRleHQnO1xuXG4gIGxldCBjb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuICBzZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnLCBjb250ZXh0KTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGRpcmVjdGlvbiA9ICdkb3duJztcbiAgZXhwb3J0IGxldCBncm91cCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFkZG9uVHlwZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0b2dnbGUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGNvbnN0IHZhbGlkRGlyZWN0aW9ucyA9IFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J107XG5cbiAgaWYgKHZhbGlkRGlyZWN0aW9ucy5pbmRleE9mKGRpcmVjdGlvbikgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgZGlyZWN0aW9uIHNlbnQ6ICcke2RpcmVjdGlvbn0nIGlzIG5vdCBvbmUgb2YgJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCdgXG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb21wb25lbnQ7XG5cbiAgJDogc3ViSXRlbUlzQWN0aXZlID0gISEoXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmXG4gICAgY29tcG9uZW50ICYmXG4gICAgdHlwZW9mIGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY3RpdmUnKVxuICApO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBkaXJlY3Rpb24gIT09ICdkb3duJyAmJiBgZHJvcCR7ZGlyZWN0aW9ufWAsXG4gICAgbmF2ICYmIGFjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmIHN1Ykl0ZW1Jc0FjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAge1xuICAgICAgW2BpbnB1dC1ncm91cC0ke2FkZG9uVHlwZX1gXTogYWRkb25UeXBlLFxuICAgICAgJ2J0bi1ncm91cCc6IGdyb3VwLFxuICAgICAgW2BidG4tZ3JvdXAtJHtzaXplfWBdOiAhIXNpemUsXG4gICAgICBkcm9wZG93bjogIWdyb3VwICYmICFhZGRvblR5cGUsXG4gICAgICBzaG93OiBpc09wZW4sXG4gICAgICAnbmF2LWl0ZW0nOiBuYXZcbiAgICB9XG4gICk7XG5cbiAgJDoge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIFsnY2xpY2snLCAndG91Y2hzdGFydCcsICdrZXl1cCddLmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVEb2N1bWVudENsaWNrLCB0cnVlKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgWydjbGljaycsICd0b3VjaHN0YXJ0JywgJ2tleXVwJ10uZm9yRWFjaChldmVudCA9PlxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZURvY3VtZW50Q2xpY2ssIHRydWUpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJDoge1xuICAgIGNvbnRleHQudXBkYXRlKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvZ2dsZSxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbiA9PT0gJ2Rvd24nICYmIGRyb3B1cCA/ICd1cCcgOiBkaXJlY3Rpb24sXG4gICAgICAgIGluTmF2YmFyXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRG9jdW1lbnRDbGljayhlKSB7XG4gICAgaWYgKGUgJiYgKGUud2hpY2ggPT09IDMgfHwgKGUudHlwZSA9PT0gJ2tleXVwJyAmJiBlLndoaWNoICE9PSA5KSkpIHJldHVybjtcblxuICAgIGlmIChcbiAgICAgIGNvbXBvbmVudC5jb250YWlucyhlLnRhcmdldCkgJiZcbiAgICAgIGNvbXBvbmVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgIChlLnR5cGUgIT09ICdrZXl1cCcgfHwgZS53aGljaCA9PT0gOSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2dnbGUoZSk7XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIG5hdn1cbiAgPGxpIGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2xpPlxuezplbHNlfVxuICA8ZGl2IGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9Ecm9wZG93bi5zdmVsdGUnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXJlY3Rpb24gPSAnZG93bic7XG4gIGV4cG9ydCBsZXQgZ3JvdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXYgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkZWZhdWx0T3BlbiA9IGZhbHNlO1xuXG4gIGxldCBpc09wZW4gPSBkZWZhdWx0T3BlbjtcbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG48RHJvcGRvd25cbiAgey4uLnByb3BzfVxuICB7aXNPcGVufVxuICB0b2dnbGU9eygpID0+IChpc09wZW4gPSAhaXNPcGVuKX1cbiAgY2xhc3M9e2NsYXNzTmFtZX1cbiAge2Rpc2FibGVkfVxuICB7ZGlyZWN0aW9ufVxuICB7Z3JvdXB9XG4gIHtuYXZ9XG4gIHthY3RpdmV9XG4gIHthZGRvblR5cGV9XG4gIHtzaXplfVxuICB7aW5OYXZiYXJ9XG4gIHtzZXRBY3RpdmVGcm9tQ2hpbGR9XG4gIHtkcm9wdXB9PlxuICA8c2xvdCAvPlxuPC9Ecm9wZG93bj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgQnV0dG9uIGZyb20gJy4vQnV0dG9uLnN2ZWx0ZSc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgY2FyZXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9ICdzZWNvbmRhcnknO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYXJpYUhhc3BvcHVwID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBhcmlhTGFiZWwgPSAnVG9nZ2xlIERyb3Bkb3duJztcbiAgZXhwb3J0IGxldCBzcGxpdCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0YWcgPSBudWxsO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwge1xuICAgICdkcm9wZG93bi10b2dnbGUnOiBjYXJldCB8fCBzcGxpdCxcbiAgICAnZHJvcGRvd24tdG9nZ2xlLXNwbGl0Jzogc3BsaXQsXG4gICAgJ25hdi1saW5rJzogbmF2XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbihlKSB7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5hdikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgICRjb250ZXh0LnRvZ2dsZShlKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgbmF2fVxuICA8YVxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAgaHJlZj1cIiNuYXZcIlxuICAgIHthcmlhSGFzcG9wdXB9XG4gICAgY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L2E+XG57OmVsc2UgaWYgdGFnID09PSAnc3Bhbid9XG4gIDxzcGFuXG4gICAgey4uLnByb3BzfVxuICAgIG9uOmNsaWNrXG4gICAgb246Y2xpY2s9e3RvZ2dsZUJ1dHRvbn1cbiAgICB7YXJpYUhhc3BvcHVwfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtjb2xvcn1cbiAgICB7c2l6ZX0+XG4gICAgPHNsb3Q+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj57YXJpYUxhYmVsfTwvc3Bhbj5cbiAgICA8L3Nsb3Q+XG4gIDwvc3Bhbj5cbns6ZWxzZX1cbiAgPEJ1dHRvblxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAge2FyaWFIYXNwb3B1cH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7Y29sb3J9XG4gICAge3NpemV9XG4gICAge291dGxpbmV9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L0J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgcmlnaHQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2Ryb3Bkb3duLW1lbnUnLCB7XG4gICAgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnOiByaWdodCxcbiAgICBzaG93OiAkY29udGV4dC5pc09wZW5cbiAgfSk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnKTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXZpZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaGVhZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdG9nZ2xlID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBocmVmID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIHtcbiAgICBkaXNhYmxlZCxcbiAgICAnZHJvcGRvd24taXRlbSc6ICFkaXZpZGVyICYmICFoZWFkZXIsXG4gICAgYWN0aXZlOiBhY3RpdmUsXG4gICAgJ2Ryb3Bkb3duLWhlYWRlcic6IGhlYWRlcixcbiAgICAnZHJvcGRvd24tZGl2aWRlcic6IGRpdmlkZXJcbiAgfSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQgfHwgaGVhZGVyIHx8IGRpdmlkZXIpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAkY29udGV4dC50b2dnbGUoZSk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxueyNpZiBoZWFkZXJ9XG4gIDxoNiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2g2PlxuXG57OmVsc2UgaWYgZGl2aWRlcn1cbiAgPGRpdiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbns6ZWxzZSBpZiBocmVmfVxuICA8YSBvbjp7Li4ucHJvcHN9IGNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IHtocmVmfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9hPlxuezplbHNlfVxuICA8YnV0dG9uIHsuLi5wcm9wc30gb246Y2xpY2sgb246Y2xpY2s9e2hhbmRsZUl0ZW1DbGlja30gY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZmx1c2ggPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnbGlzdC1ncm91cCcsXG4gICAgZmx1c2ggPyAnbGlzdC1ncm91cC1mbHVzaCcgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbjx1bCB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvdWw+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnaW5wdXQtZ3JvdXAnLFxuICAgIHNpemUgPyBgaW5wdXQtZ3JvdXAtJHtzaXplfWAgOiBudWxsXG4gICk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGU7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBpZiAoWydwcmVwZW5kJywgJ2FwcGVuZCddLmluZGV4T2YoYWRkb25UeXBlKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgYWRkb25UeXBlIG11c3QgYmUgb25lIG9mICdwcmVwZW5kJywgJ2FwcGVuZCcuIFJlY2VpdmVkICcke2FkZG9uVHlwZX0nIGluc3RlYWQuYFxuICAgICk7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIGBpbnB1dC1ncm91cC0ke2FkZG9uVHlwZX1gKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBOYXZiYXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhckJyYW5kIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2YmFyQnJhbmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhclRvZ2dsZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXJUb2dnbGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXYgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZJdGVtLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXZMaW5rIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2TGluay5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ29sbGFwc2UgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Db2xsYXBzZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgVW5jb250cm9sbGVkRHJvcGRvd24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9VbmNvbnRyb2xsZWREcm9wZG93bi5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25Ub2dnbGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93blRvZ2dsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25NZW51IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25NZW51LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBEcm9wZG93bkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExpc3RHcm91cCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0xpc3RHcm91cC5zdmVsdGVcIjtcclxuICBpbXBvcnQgRm9ybSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Zvcm0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0R3JvdXAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBJbnB1dEdyb3VwQWRkb24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwQWRkb24uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExhYmVsIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTGFiZWwuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEN1c3RvbUlucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ3VzdG9tSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBjb2xvcjtcclxuICBleHBvcnQgbGV0IHRpdGxlO1xyXG5cclxuICBmdW5jdGlvbiBzZWFyY2hIYW5kbGUoKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48TmF2YmFyIGNsYXNzPVwibC1wcm90b24tdG9wbmF2IG5hdmJhci1leHBhbmRcIiB7Y29sb3J9IGRhcmsgZXhwYW5kPVwibWRcIj5cclxuICA8TmF2YmFyQnJhbmQgaHJlZj1cIi5cIj57dGl0bGV9PC9OYXZiYXJCcmFuZD5cclxuICA8TmF2IGNsYXNzPVwibWwtYXV0b1wiIG5hdmJhcj5cclxuICAgIDxGb3JtIGlubGluZT5cclxuICAgICAgPElucHV0R3JvdXA+XHJcbiAgICAgICAgPElucHV0XHJcbiAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgIG5hbWU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgaWQ9XCJleGFtcGxlU2VhcmNoXCJcclxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0JjRgdC60LDRgtGMLi5cIiAvPlxyXG4gICAgICAgIDxJbnB1dEdyb3VwQWRkb24gYWRkb25UeXBlPXsnYXBwZW5kJ30+XHJcbiAgICAgICAgICA8QnV0dG9uIGNvbG9yPVwicHJpbWFyeVwiIG9uOmNsaWNrPXtzZWFyY2hIYW5kbGV9PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zZWFyY2hcIiAvPlxyXG4gICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgPC9JbnB1dEdyb3VwQWRkb24+XHJcbiAgICAgIDwvSW5wdXRHcm91cD5cclxuICAgIDwvRm9ybT5cclxuICAgIDxMaXN0R3JvdXAgY2xhc3M9XCJtbC1hdXRvIG1sLW1kLTBcIj5cclxuICAgICAgPFVuY29udHJvbGxlZERyb3Bkb3duIG5hdiBpbk5hdmJhcj5cclxuICAgICAgICA8RHJvcGRvd25Ub2dnbGUgbmF2IGNhcmV0PlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdXNlci1jaXJjbGUgZmEtZncgbWwtM1wiIC8+XHJcbiAgICAgICAgPC9Ecm9wZG93blRvZ2dsZT5cclxuICAgICAgICA8RHJvcGRvd25NZW51IHJpZ2h0PlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbT4gICAgICAgICBcclxuICAgICBcclxuICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCJzZXR0aW5nc1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNvZ1wiIC8+INCd0LDRgdGC0YDQvtC50LrQuDwvYT5cclxuICAgICAgICAgIDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cImFjdGl2aXR5X2xvZ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNsaXBib2FyZC1saXN0XCI+PC9pPiDQkNC60YLQuNCy0L3QvtGB0YLRjDwvYT5cclxuICAgICAgICAgIDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbSBkaXZpZGVyIC8+XHJcbiAgICAgICAgICA8RHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vbG9naW5cIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc2lnbi1vdXQtYWx0XCI+PC9pPiAg0JLRi9C50YLQuFxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICA8L0Ryb3Bkb3duTWVudT5cclxuICAgICAgPC9VbmNvbnRyb2xsZWREcm9wZG93bj5cclxuICAgIDwvTGlzdEdyb3VwPlxyXG4gIDwvTmF2PlxyXG48L05hdmJhcj5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tIFwic3ZlbHRlXCI7XHJcblxyXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XHJcblxyXG4gIGV4cG9ydCBsZXQgdGV4dCA9IFwiXCI7XHJcbiAgZXhwb3J0IGxldCBocmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIjtcclxuICBleHBvcnQgbGV0IGxlZnRJY29uID0gZmFsc2U7XHJcbiAgZXhwb3J0IGxldCByaWdodEljb24gPSBmYWxzZTtcclxuXHJcbiAgbGV0IGNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XHJcbiAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBkaXNwYXRjaChcInByZXNzXCIpO1xyXG4gIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPGEgY2xhc3M9XCJuYXYtbGluayB7Y2xhc3NOYW1lfVwiIHtocmVmfSBvbjpjbGljaz17aGFuZGxlQ2xpY2t9PlxyXG4gIHsjaWYgbGVmdEljb259XHJcbiAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tbmF2LWxpbmstaWNvblwiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwibGVmdEljb25cIiAvPlxyXG4gICAgPC9kaXY+XHJcbiAgey9pZn1cclxuICB7dGV4dH1cclxuICB7I2lmIHJpZ2h0SWNvbn1cclxuICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LWNvbGxhcHNlLWFycm93XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJyaWdodEljb25cIiAvPlxyXG4gICAgPC9kaXY+XHJcbiAgey9pZn1cclxuPC9hPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBDb2xsYXBzZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXYgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlXCI7XHJcblxyXG4gIGltcG9ydCBTaWRlYmFySXRlbSBmcm9tIFwiLi9TaWRlYmFySXRlbS5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG4gIGV4cG9ydCBsZXQgdGhlbWU7XHJcblxyXG4gICQ6IHNpZGVuYXZfdGhlbWUgPSBgbC1wcm90b24tc2lkZW5hdi0ke3RoZW1lfWA7XHJcblxyXG4gIGxldCBpc0xheW91dE9wZW4gPSB0cnVlO1xyXG4gIGxldCBpc1BhZ2VPcGVuID0gdHJ1ZTtcclxuICBsZXQgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSB0cnVlO1xyXG4gIGxldCBpc0Vycm9yT3BlbiA9IGZhbHNlO1xyXG4gIGxldCBhY3RpdmVMaW5rID0gXCLQn9Cw0L3QtdC70YxcIjtcclxuICBsZXQgZm9vdGVyTmFtZSA9IFwizrtwcm90b24gYm95XCI7XHJcbiAgbGV0IGZvb3RlclRleHQgPSBcItCS0Ysg0LLQvtGI0LvQuCDQutCw0Lo6XCI7XHJcblxyXG4gIGNvbnN0IHVwZGF0ZUFjdGl2ZUxpbmsgPSBsaW5rTmFtZSA9PiAoYWN0aXZlTGluayA9IGxpbmtOYW1lKTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlTGF5b3V0ID0gKCkgPT4ge1xyXG4gICAgaXNMYXlvdXRPcGVuID0gIWlzTGF5b3V0T3BlbjtcclxuICAgIGlmIChpc1BhZ2VPcGVuID09PSB0cnVlKSBpc1BhZ2VPcGVuID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlUGFnZXMgPSAoKSA9PiB7XHJcbiAgICBpc1BhZ2VPcGVuID0gIWlzUGFnZU9wZW47XHJcbiAgICBpZiAoaXNMYXlvdXRPcGVuID09PSB0cnVlKSBpc0xheW91dE9wZW4gPSBmYWxzZTtcclxuICAgIGlmIChpc1BhZ2VPcGVuID09PSBmYWxzZSkge1xyXG4gICAgICBpc0F1dGhlbnRpY2F0aW9uT3BlbiA9IGZhbHNlO1xyXG4gICAgICBpc0Vycm9yT3BlbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHRvZ2dsZUF1dGhlbnRpY2F0aW9uID0gKCkgPT4ge1xyXG4gICAgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSAhaXNBdXRoZW50aWNhdGlvbk9wZW47XHJcbiAgICBpZiAoaXNFcnJvck9wZW4gPT09IHRydWUpIGlzRXJyb3JPcGVuID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlRXJyb3IgPSAoKSA9PiB7XHJcbiAgICBpc0Vycm9yT3BlbiA9ICFpc0Vycm9yT3BlbjtcclxuICAgIGlmIChpc0F1dGhlbnRpY2F0aW9uT3BlbiA9PT0gdHJ1ZSkgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSBmYWxzZTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxkaXYgaWQ9XCJsYXlvdXRTaWRlbmF2X25hdlwiIGNsYXNzPVwibC1wcm90b24tbmF2LWZpeGVkXCI+XHJcbiAgPE5hdlxyXG4gICAgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2IHtzaWRlbmF2X3RoZW1lfSBhY2NvcmRpb24gbC1wcm90b24tbmF2LWZpeGVkXCJcclxuICAgIGlkPVwic2lkZW5hdkFjY29yZGlvblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudVwiPlxyXG4gICAgICA8TmF2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtaGVhZGluZ1wiPtCv0LTRgNC+PC9kaXY+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICB0ZXh0PVwiRGFzaGJvYXJkXCJcclxuICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnLicgfHwgc2VnbWVudCA9PT0gdW5kZWZpbmVkID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgIGxlZnRJY29uXHJcbiAgICAgICAgICBocmVmPVwiLlwiPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYXRvbVwiIHNsb3Q9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LWhlYWRpbmdcIj7QmNC90YLQtdGA0YTQtdC50YE8L2Rpdj5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVMYXlvdXR9XHJcbiAgICAgICAgICBjbGFzcz17IWlzTGF5b3V0T3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICB0ZXh0PVwiTGF5b3V0c1wiXHJcbiAgICAgICAgICBsZWZ0SWNvblxyXG4gICAgICAgICAgcmlnaHRJY29uPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29sdW1uc1wiIHNsb3Q9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hbmdsZS1kb3duXCIgc2xvdD1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc0xheW91dE9wZW59PlxyXG4gICAgICAgICAgPE5hdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWRcIj5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoZW1lID0gJ2RhcmsnO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQWN0aXZlTGluaygnU3RhdGljIE5hdmlnYXRpb24nKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnbGF5b3V0cycgJiYgYWN0aXZlTGluayA9PT0gJ1N0YXRpYyBOYXZpZ2F0aW9uJyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICAgICAgaHJlZj1cImxheW91dHMvc3RhdGljX25hdmlnYXRpb25cIlxyXG4gICAgICAgICAgICAgIHRleHQ9XCJTdGF0aWMgTmF2aWdhdGlvblwiIC8+XHJcbiAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGVtZSA9ICdsaWdodCc7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVBY3RpdmVMaW5rKCdMaWdodCBTaWRlbmF2Jyk7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJ2xheW91dHMnICYmIGFjdGl2ZUxpbmsgPT09ICdMaWdodCBTaWRlbmF2JyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICAgICAgaHJlZj1cImxheW91dHMvbGlnaHRfc2lkZW5hdlwiXHJcbiAgICAgICAgICAgICAgdGV4dD1cIkxpZ2h0IFNpZGVuYXZcIiAvPlxyXG4gICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVQYWdlc31cclxuICAgICAgICAgIGNsYXNzPXshaXNQYWdlT3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICB0ZXh0PVwi0KHRgtGA0LDQvdC40YbRi1wiXHJcbiAgICAgICAgICBsZWZ0SWNvblxyXG4gICAgICAgICAgcmlnaHRJY29uPlxyXG4gICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICBzbG90PVwibGVmdEljb25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cInN2Zy1pbmxpbmUtLWZhIGZhLWJvb2stb3BlbiBmYS13LTE4XCJcclxuICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcclxuICAgICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxyXG4gICAgICAgICAgICBkYXRhLXByZWZpeD1cImZhc1wiXHJcbiAgICAgICAgICAgIGRhdGEtaWNvbj1cImJvb2stb3BlblwiXHJcbiAgICAgICAgICAgIHJvbGU9XCJpbWdcIlxyXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCA1NzYgNTEyXCJcclxuICAgICAgICAgICAgZGF0YS1mYS1pMnN2Zz1cIlwiPlxyXG4gICAgICAgICAgICA8cGF0aFxyXG4gICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICAgICAgICAgIGQ9XCJNNTQyLjIyIDMyLjA1Yy01NC44IDMuMTEtMTYzLjcyIDE0LjQzLTIzMC45NiA1NS41OS00LjY0XHJcbiAgICAgICAgICAgICAgMi44NC03LjI3IDcuODktNy4yNyAxMy4xN3YzNjMuODdjMCAxMS41NSAxMi42MyAxOC44NSAyMy4yOCAxMy40OVxyXG4gICAgICAgICAgICAgIDY5LjE4LTM0LjgyIDE2OS4yMy00NC4zMiAyMTguNy00Ni45MiAxNi44OS0uODkgMzAuMDItMTQuNDNcclxuICAgICAgICAgICAgICAzMC4wMi0zMC42NlY2Mi43NWMuMDEtMTcuNzEtMTUuMzUtMzEuNzQtMzMuNzctMzAuN3pNMjY0LjczXHJcbiAgICAgICAgICAgICAgODcuNjRDMTk3LjUgNDYuNDggODguNTggMzUuMTcgMzMuNzggMzIuMDUgMTUuMzYgMzEuMDEgMCA0NS4wNCAwXHJcbiAgICAgICAgICAgICAgNjIuNzVWNDAwLjZjMCAxNi4yNCAxMy4xMyAyOS43OCAzMC4wMiAzMC42NiA0OS40OSAyLjYgMTQ5LjU5IDEyLjExXHJcbiAgICAgICAgICAgICAgMjE4Ljc3IDQ2Ljk1IDEwLjYyIDUuMzUgMjMuMjEtMS45NFxyXG4gICAgICAgICAgICAgIDIzLjIxLTEzLjQ2VjEwMC42M2MwLTUuMjktMi42Mi0xMC4xNC03LjI3LTEyLjk5elwiIC8+XHJcbiAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzUGFnZU9wZW59PlxyXG4gICAgICAgICAgPE5hdlxyXG4gICAgICAgICAgICBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWQgYWNjb3JkaW9uXCJcclxuICAgICAgICAgICAgaWQ9XCJzaWRlbmF2QWNjb3JkaW9uUGFnZXNcIj5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9e3RvZ2dsZUF1dGhlbnRpY2F0aW9ufVxyXG4gICAgICAgICAgICAgIGNsYXNzPXshaXNBdXRoZW50aWNhdGlvbk9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgICAgIHRleHQ9XCJBdXRoZW50aWNhdGlvblwiXHJcbiAgICAgICAgICAgICAgcmlnaHRJY29uPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICAgICAgPENvbGxhcHNlIGlzT3Blbj17aXNBdXRoZW50aWNhdGlvbk9wZW59PlxyXG4gICAgICAgICAgICAgIDxOYXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtbmVzdGVkXCI+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW0gaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL2xvZ2luXCIgdGV4dD1cIkxvZ2luXCIgLz5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgICAgICBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vcmVnaXN0ZXJcIlxyXG4gICAgICAgICAgICAgICAgICB0ZXh0PVwiUmVnaXN0ZXJcIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgICAgIGhyZWY9XCJwYWdlcy9hdXRoZW50aWNhdGlvbi9mb3JnZXRfcGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgICAgICB0ZXh0PVwiRm9yZ290IFBhc3N3b3JkXCIgLz5cclxuICAgICAgICAgICAgICA8L05hdj5cclxuICAgICAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9e3RvZ2dsZUVycm9yfVxyXG4gICAgICAgICAgICAgIGNsYXNzPXshaXNFcnJvck9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgICAgIHRleHQ9XCJFcnJvclwiXHJcbiAgICAgICAgICAgICAgcmlnaHRJY29uPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICAgICAgPENvbGxhcHNlIGlzT3Blbj17aXNFcnJvck9wZW59PlxyXG4gICAgICAgICAgICAgIDxOYXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtbmVzdGVkXCI+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW0gaHJlZj1cInBhZ2VzL2Vycm9yL2Vycm9yXzQwMVwiIHRleHQ9XCI0MDEgUGFnZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW0gaHJlZj1cInBhZ2VzL2Vycm9yL2Vycm9yXzQwNFwiIHRleHQ9XCI0MDQgUGFnZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW0gaHJlZj1cInBhZ2VzL2Vycm9yL2Vycm9yXzUwMFwiIHRleHQ9XCI1MDAgUGFnZVwiIC8+XHJcbiAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgIDwvQ29sbGFwc2U+XHJcbiAgICAgICAgICA8L05hdj5cclxuICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtaGVhZGluZ1wiPtCQ0LTQtNC+0L3RiyDQuCDQv9GA0LjQvNC10YHQuDwvZGl2PlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICdjaGFydHMnID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoZW1lID0gJ2RhcmsnO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIGhyZWY9XCJjaGFydHNcIlxyXG4gICAgICAgICAgdGV4dD1cIkNoYXJ0c1wiXHJcbiAgICAgICAgICBsZWZ0SWNvbj5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LWFyZWFcIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJ3RhYmxlcycgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgb246cHJlc3M9eygpID0+IHtcclxuICAgICAgICAgICAgdGhlbWUgPSAnZGFyayc7XHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgaHJlZj1cInRhYmxlc1wiXHJcbiAgICAgICAgICB0ZXh0PVwiVGFibGVzXCJcclxuICAgICAgICAgIGxlZnRJY29uPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGFibGVcIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgIDwvTmF2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1mb290ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInNtYWxsXCI+e2Zvb3RlclRleHR9PC9kaXY+XHJcbiAgICAgIHtmb290ZXJOYW1lfVxyXG4gICAgPC9kaXY+XHJcbiAgPC9OYXY+XHJcbjwvZGl2PlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBDb250YWluZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Db250YWluZXIuc3ZlbHRlXCI7XHJcblxyXG4gIGltcG9ydCBOYXZiYXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvTmF2YmFyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBTaWRlYmFyIGZyb20gXCIuLi9jb21wb25lbnRzL1NpZGViYXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEZvb3RlciBmcm9tIFwiLi4vY29tcG9uZW50cy9Gb290ZXIuc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuXHJcbiAgbGV0IHRoZW1lID0gXCJkYXJrXCI7XHJcbiAgbGV0IGNvbG9yID0gXCJkYXJrXCI7XHJcbiAgbGV0IHRpdGxlID0gXCLOu3Byb3RvblwiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcblxyXG57I2lmIHNlZ21lbnQgIT09ICdwYWdlcyd9XHJcbiAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLW5hdi1zdGF0aWNcIj5cclxuICAgIDxOYXZiYXIge3NlZ21lbnR9IHtjb2xvcn0ge3RpdGxlfSAvPlxyXG4gICAgPGRpdiBpZD1cImxheW91dFNpZGVuYXZcIj5cclxuICAgICAgPFNpZGViYXIge3NlZ21lbnR9IHt0aGVtZX0gLz5cclxuICAgICAgPGRpdiBpZD1cImxheW91dFNpZGVuYXZfY29udGVudFwiPlxyXG4gICAgICAgIDxtYWluPlxyXG4gICAgICAgICAgPENvbnRhaW5lciBmbHVpZD17dHJ1ZX0+XHJcbiAgICAgICAgICAgIDxzbG90IC8+XHJcbiAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICA8L21haW4+XHJcbiAgICAgICAgPEZvb3RlciAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG57OmVsc2V9XHJcbiAgPGJvZHk+XHJcbiAgICA8c2xvdCAvPlxyXG4gIDwvYm9keT5cclxuey9pZn1cclxuIiwiPHNjcmlwdD5cclxuXHRleHBvcnQgbGV0IHN0YXR1cztcclxuXHRleHBvcnQgbGV0IGVycm9yO1xyXG5cclxuXHRjb25zdCBkZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGU+XHJcblx0aDEsIHAge1xyXG5cdFx0bWFyZ2luOiAwIGF1dG87XHJcblx0fVxyXG5cclxuXHRoMSB7XHJcblx0XHRmb250LXNpemU6IDIuOGVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IDcwMDtcclxuXHRcdG1hcmdpbjogMCAwIDAuNWVtIDA7XHJcblx0fVxyXG5cclxuXHRwIHtcclxuXHRcdG1hcmdpbjogMWVtIGF1dG87XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcclxuXHRcdGgxIHtcclxuXHRcdFx0Zm9udC1zaXplOiA0ZW07XHJcblx0XHR9XHJcblx0fVxyXG48L3N0eWxlPlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG5cdDx0aXRsZT57c3RhdHVzfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcblxyXG48aDE+e3N0YXR1c308L2gxPlxyXG5cclxuPHA+e2Vycm9yLm1lc3NhZ2V9PC9wPlxyXG5cclxueyNpZiBkZXYgJiYgZXJyb3Iuc3RhY2t9XHJcblx0PHByZT57ZXJyb3Iuc3RhY2t9PC9wcmU+XHJcbnsvaWZ9XHJcbiIsIi8vIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYnkgU2FwcGVyIOKAlCBkbyBub3QgZWRpdCBpdCFcbmltcG9ydCAqIGFzIHJvdXRlXzAgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL2luZGV4Lmpzb24uanNcIjtcbmltcG9ydCAqIGFzIHJvdXRlXzEgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL1tzbHVnXS5qc29uLmpzXCI7XG5pbXBvcnQgY29tcG9uZW50XzAgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9pbmRleC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2FjdGl2aXR5X2xvZy5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMiBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3NldHRpbmdzLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8zIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvbGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvbi5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfNCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2xheW91dHMvbGlnaHRfc2lkZW5hdi5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfNSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL2NoYXJ0cy5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfNiBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3RhYmxlcy5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfNyBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL19sYXlvdXQuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzggZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9hdXRoZW50aWNhdGlvbi9fbGF5b3V0LnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF85IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xMCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL3JlZ2lzdGVyLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xMSBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL2xvZ2luLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xMiBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzEzIGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvZXJyb3JfNDAxLnN2ZWx0ZVwiO1xuaW1wb3J0IGNvbXBvbmVudF8xNCBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2Vycm9yL2Vycm9yXzQwNC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMTUgZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9lcnJvci9lcnJvcl81MDAuc3ZlbHRlXCI7XG5pbXBvcnQgY29tcG9uZW50XzE2LCB7IHByZWxvYWQgYXMgcHJlbG9hZF8xNiB9IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvYmxvZy9pbmRleC5zdmVsdGVcIjtcbmltcG9ydCBjb21wb25lbnRfMTcsIHsgcHJlbG9hZCBhcyBwcmVsb2FkXzE3IH0gZnJvbSBcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL1tzbHVnXS5zdmVsdGVcIjtcbmltcG9ydCByb290IGZyb20gXCIuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGVcIjtcbmltcG9ydCBlcnJvciBmcm9tIFwiLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGVcIjtcblxuY29uc3QgZCA9IGRlY29kZVVSSUNvbXBvbmVudDtcblxuZXhwb3J0IGNvbnN0IG1hbmlmZXN0ID0ge1xuXHRzZXJ2ZXJfcm91dGVzOiBbXG5cdFx0e1xuXHRcdFx0Ly8gYmxvZy9pbmRleC5qc29uLmpzXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL2Jsb2cuanNvbiQvLFxuXHRcdFx0aGFuZGxlcnM6IHJvdXRlXzAsXG5cdFx0XHRwYXJhbXM6ICgpID0+ICh7fSlcblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gYmxvZy9bc2x1Z10uanNvbi5qc1xuXHRcdFx0cGF0dGVybjogL15cXC9ibG9nXFwvKFteXFwvXSs/KS5qc29uJC8sXG5cdFx0XHRoYW5kbGVyczogcm91dGVfMSxcblx0XHRcdHBhcmFtczogbWF0Y2ggPT4gKHsgc2x1ZzogZChtYXRjaFsxXSkgfSlcblx0XHR9XG5cdF0sXG5cblx0cGFnZXM6IFtcblx0XHR7XG5cdFx0XHQvLyBpbmRleC5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvJC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwiaW5kZXhcIiwgZmlsZTogXCJpbmRleC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMCB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIGFjdGl2aXR5X2xvZy5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvYWN0aXZpdHlfbG9nXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcImFjdGl2aXR5X2xvZ1wiLCBmaWxlOiBcImFjdGl2aXR5X2xvZy5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMSB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIHNldHRpbmdzLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9zZXR0aW5nc1xcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJzZXR0aW5nc1wiLCBmaWxlOiBcInNldHRpbmdzLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8yIH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gbGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvbi5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL3N0YXRpY19uYXZpZ2F0aW9uXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0eyBuYW1lOiBcImxheW91dHNfc3RhdGljX25hdmlnYXRpb25cIiwgZmlsZTogXCJsYXlvdXRzL3N0YXRpY19uYXZpZ2F0aW9uLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8zIH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gbGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9sYXlvdXRzXFwvbGlnaHRfc2lkZW5hdlxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHsgbmFtZTogXCJsYXlvdXRzX2xpZ2h0X3NpZGVuYXZcIiwgZmlsZTogXCJsYXlvdXRzL2xpZ2h0X3NpZGVuYXYuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzQgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBjaGFydHMuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL2NoYXJ0c1xcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJjaGFydHNcIiwgZmlsZTogXCJjaGFydHMuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzUgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyB0YWJsZXMuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3RhYmxlc1xcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJ0YWJsZXNcIiwgZmlsZTogXCJ0YWJsZXMuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzYgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBwYWdlcy9hdXRoZW50aWNhdGlvbi9mb3JnZXRfcGFzc3dvcmQuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9mb3JnZXRfcGFzc3dvcmRcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzcgfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2F1dGhlbnRpY2F0aW9uX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9hdXRoZW50aWNhdGlvbi9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF84IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19hdXRoZW50aWNhdGlvbl9mb3JnZXRfcGFzc3dvcmRcIiwgZmlsZTogXCJwYWdlcy9hdXRoZW50aWNhdGlvbi9mb3JnZXRfcGFzc3dvcmQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzkgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL3JlZ2lzdGVyXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF83IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19hdXRoZW50aWNhdGlvbl9fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfOCB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfYXV0aGVudGljYXRpb25fcmVnaXN0ZXJcIiwgZmlsZTogXCJwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTAgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBwYWdlcy9hdXRoZW50aWNhdGlvbi9sb2dpbi5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL2xvZ2luXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF83IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19hdXRoZW50aWNhdGlvbl9fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfOCB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfYXV0aGVudGljYXRpb25fbG9naW5cIiwgZmlsZTogXCJwYWdlcy9hdXRoZW50aWNhdGlvbi9sb2dpbi5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTEgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBwYWdlcy9lcnJvci9lcnJvcl80MDEuc3ZlbHRlXG5cdFx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDFcXC8/JC8sXG5cdFx0XHRwYXJ0czogW1xuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzcgfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2Vycm9yX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9lcnJvci9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xMiB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfZXJyb3JfZXJyb3JfNDAxXCIsIGZpbGU6IFwicGFnZXMvZXJyb3IvZXJyb3JfNDAxLnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xMyB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIHBhZ2VzL2Vycm9yL2Vycm9yXzQwNC5zdmVsdGVcblx0XHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzQwNFxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfNyB9LFxuXHRcdFx0XHR7IG5hbWU6IFwicGFnZXNfZXJyb3JfX2xheW91dFwiLCBmaWxlOiBcInBhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzEyIH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19lcnJvcl9lcnJvcl80MDRcIiwgZmlsZTogXCJwYWdlcy9lcnJvci9lcnJvcl80MDQuc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzE0IH1cblx0XHRcdF1cblx0XHR9LFxuXG5cdFx0e1xuXHRcdFx0Ly8gcGFnZXMvZXJyb3IvZXJyb3JfNTAwLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2Vycm9yXFwvZXJyb3JfNTAwXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX19sYXlvdXRcIiwgZmlsZTogXCJwYWdlcy9fbGF5b3V0LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF83IH0sXG5cdFx0XHRcdHsgbmFtZTogXCJwYWdlc19lcnJvcl9fbGF5b3V0XCIsIGZpbGU6IFwicGFnZXMvZXJyb3IvX2xheW91dC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTIgfSxcblx0XHRcdFx0eyBuYW1lOiBcInBhZ2VzX2Vycm9yX2Vycm9yXzUwMFwiLCBmaWxlOiBcInBhZ2VzL2Vycm9yL2Vycm9yXzUwMC5zdmVsdGVcIiwgY29tcG9uZW50OiBjb21wb25lbnRfMTUgfVxuXHRcdFx0XVxuXHRcdH0sXG5cblx0XHR7XG5cdFx0XHQvLyBibG9nL2luZGV4LnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9ibG9nXFwvPyQvLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBcImJsb2dcIiwgZmlsZTogXCJibG9nL2luZGV4LnN2ZWx0ZVwiLCBjb21wb25lbnQ6IGNvbXBvbmVudF8xNiwgcHJlbG9hZDogcHJlbG9hZF8xNiB9XG5cdFx0XHRdXG5cdFx0fSxcblxuXHRcdHtcblx0XHRcdC8vIGJsb2cvW3NsdWddLnN2ZWx0ZVxuXHRcdFx0cGF0dGVybjogL15cXC9ibG9nXFwvKFteXFwvXSs/KVxcLz8kLyxcblx0XHRcdHBhcnRzOiBbXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHsgbmFtZTogXCJibG9nXyRzbHVnXCIsIGZpbGU6IFwiYmxvZy9bc2x1Z10uc3ZlbHRlXCIsIGNvbXBvbmVudDogY29tcG9uZW50XzE3LCBwcmVsb2FkOiBwcmVsb2FkXzE3LCBwYXJhbXM6IG1hdGNoID0+ICh7IHNsdWc6IGQobWF0Y2hbMV0pIH0pIH1cblx0XHRcdF1cblx0XHR9XG5cdF0sXG5cblx0cm9vdCxcblx0cm9vdF9wcmVsb2FkOiAoKSA9PiB7fSxcblx0ZXJyb3Jcbn07XG5cbmV4cG9ydCBjb25zdCBidWlsZF9kaXIgPSBcIl9fc2FwcGVyX18vZGV2XCI7XG5cbmV4cG9ydCBjb25zdCBzcmNfZGlyID0gXCJzcmNcIjtcblxuZXhwb3J0IGNvbnN0IGRldiA9IHRydWU7IiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9LRVkgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHByZWxvYWQgPSAoKSA9PiAoe30pOyIsIjwhLS0gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0ISAtLT5cbjxzY3JpcHQ+XG5cdGltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuXHRpbXBvcnQgeyBDT05URVhUX0tFWSB9IGZyb20gJy4vc2hhcmVkJztcblx0aW1wb3J0IExheW91dCBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuXHRpbXBvcnQgRXJyb3IgZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5cdGV4cG9ydCBsZXQgc3RvcmVzO1xuXHRleHBvcnQgbGV0IGVycm9yO1xuXHRleHBvcnQgbGV0IHN0YXR1cztcblx0ZXhwb3J0IGxldCBzZWdtZW50cztcblx0ZXhwb3J0IGxldCBsZXZlbDA7XG5cdGV4cG9ydCBsZXQgbGV2ZWwxID0gbnVsbDtcblx0ZXhwb3J0IGxldCBsZXZlbDIgPSBudWxsO1xuXHRleHBvcnQgbGV0IGxldmVsMyA9IG51bGw7XG5cblx0c2V0Q29udGV4dChDT05URVhUX0tFWSwgc3RvcmVzKTtcbjwvc2NyaXB0PlxuXG48TGF5b3V0IHNlZ21lbnQ9XCJ7c2VnbWVudHNbMF19XCIgey4uLmxldmVsMC5wcm9wc30+XG5cdHsjaWYgZXJyb3J9XG5cdFx0PEVycm9yIHtlcnJvcn0ge3N0YXR1c30vPlxuXHR7OmVsc2V9XG5cdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDEuY29tcG9uZW50fVwiIHNlZ21lbnQ9XCJ7c2VnbWVudHNbMV19XCIgey4uLmxldmVsMS5wcm9wc30+XG5cdFx0XHR7I2lmIGxldmVsMn1cblx0XHRcdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDIuY29tcG9uZW50fVwiIHNlZ21lbnQ9XCJ7c2VnbWVudHNbMl19XCIgey4uLmxldmVsMi5wcm9wc30+XG5cdFx0XHRcdFx0eyNpZiBsZXZlbDN9XG5cdFx0XHRcdFx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMy5jb21wb25lbnR9XCIgey4uLmxldmVsMy5wcm9wc30vPlxuXHRcdFx0XHRcdHsvaWZ9XG5cdFx0XHRcdDwvc3ZlbHRlOmNvbXBvbmVudD5cblx0XHRcdHsvaWZ9XG5cdFx0PC9zdmVsdGU6Y29tcG9uZW50PlxuXHR7L2lmfVxuPC9MYXlvdXQ+IiwiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGV2LCBidWlsZF9kaXIsIHNyY19kaXIsIG1hbmlmZXN0IH0gZnJvbSAnLi9pbnRlcm5hbC9tYW5pZmVzdC1zZXJ2ZXInO1xuaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IFN0cmVhbSBmcm9tICdzdHJlYW0nO1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCc7XG5pbXBvcnQgVXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQgQXBwIGZyb20gJy4vaW50ZXJuYWwvQXBwLnN2ZWx0ZSc7XG5cbmZ1bmN0aW9uIGdldF9zZXJ2ZXJfcm91dGVfaGFuZGxlcihyb3V0ZXMpIHtcblx0YXN5bmMgZnVuY3Rpb24gaGFuZGxlX3JvdXRlKHJvdXRlLCByZXEsIHJlcywgbmV4dCkge1xuXHRcdHJlcS5wYXJhbXMgPSByb3V0ZS5wYXJhbXMocm91dGUucGF0dGVybi5leGVjKHJlcS5wYXRoKSk7XG5cblx0XHRjb25zdCBtZXRob2QgPSByZXEubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cdFx0Ly8gJ2RlbGV0ZScgY2Fubm90IGJlIGV4cG9ydGVkIGZyb20gYSBtb2R1bGUgYmVjYXVzZSBpdCBpcyBhIGtleXdvcmQsXG5cdFx0Ly8gc28gY2hlY2sgZm9yICdkZWwnIGluc3RlYWRcblx0XHRjb25zdCBtZXRob2RfZXhwb3J0ID0gbWV0aG9kID09PSAnZGVsZXRlJyA/ICdkZWwnIDogbWV0aG9kO1xuXHRcdGNvbnN0IGhhbmRsZV9tZXRob2QgPSByb3V0ZS5oYW5kbGVyc1ttZXRob2RfZXhwb3J0XTtcblx0XHRpZiAoaGFuZGxlX21ldGhvZCkge1xuXHRcdFx0aWYgKHByb2Nlc3MuZW52LlNBUFBFUl9FWFBPUlQpIHtcblx0XHRcdFx0Y29uc3QgeyB3cml0ZSwgZW5kLCBzZXRIZWFkZXIgfSA9IHJlcztcblx0XHRcdFx0Y29uc3QgY2h1bmtzID0gW107XG5cdFx0XHRcdGNvbnN0IGhlYWRlcnMgPSB7fTtcblxuXHRcdFx0XHQvLyBpbnRlcmNlcHQgZGF0YSBzbyB0aGF0IGl0IGNhbiBiZSBleHBvcnRlZFxuXHRcdFx0XHRyZXMud3JpdGUgPSBmdW5jdGlvbihjaHVuaykge1xuXHRcdFx0XHRcdGNodW5rcy5wdXNoKEJ1ZmZlci5mcm9tKGNodW5rKSk7XG5cdFx0XHRcdFx0d3JpdGUuYXBwbHkocmVzLCBhcmd1bWVudHMpO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuXHRcdFx0XHRcdGhlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlO1xuXHRcdFx0XHRcdHNldEhlYWRlci5hcHBseShyZXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0cmVzLmVuZCA9IGZ1bmN0aW9uKGNodW5rKSB7XG5cdFx0XHRcdFx0aWYgKGNodW5rKSBjaHVua3MucHVzaChCdWZmZXIuZnJvbShjaHVuaykpO1xuXHRcdFx0XHRcdGVuZC5hcHBseShyZXMsIGFyZ3VtZW50cyk7XG5cblx0XHRcdFx0XHRwcm9jZXNzLnNlbmQoe1xuXHRcdFx0XHRcdFx0X19zYXBwZXJfXzogdHJ1ZSxcblx0XHRcdFx0XHRcdGV2ZW50OiAnZmlsZScsXG5cdFx0XHRcdFx0XHR1cmw6IHJlcS51cmwsXG5cdFx0XHRcdFx0XHRtZXRob2Q6IHJlcS5tZXRob2QsXG5cdFx0XHRcdFx0XHRzdGF0dXM6IHJlcy5zdGF0dXNDb2RlLFxuXHRcdFx0XHRcdFx0dHlwZTogaGVhZGVyc1snY29udGVudC10eXBlJ10sXG5cdFx0XHRcdFx0XHRib2R5OiBCdWZmZXIuY29uY2F0KGNodW5rcykudG9TdHJpbmcoKVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYW5kbGVfbmV4dCA9IChlcnIpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuXHRcdFx0XHRcdHJlcy5lbmQoZXJyLm1lc3NhZ2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHByb2Nlc3MubmV4dFRpY2sobmV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGF3YWl0IGhhbmRsZV9tZXRob2QocmVxLCByZXMsIGhhbmRsZV9uZXh0KTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRcdGhhbmRsZV9uZXh0KGVycik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIG5vIG1hdGNoaW5nIGhhbmRsZXIgZm9yIG1ldGhvZFxuXHRcdFx0cHJvY2Vzcy5uZXh0VGljayhuZXh0KTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gZmluZF9yb3V0ZShyZXEsIHJlcywgbmV4dCkge1xuXHRcdGZvciAoY29uc3Qgcm91dGUgb2Ygcm91dGVzKSB7XG5cdFx0XHRpZiAocm91dGUucGF0dGVybi50ZXN0KHJlcS5wYXRoKSkge1xuXHRcdFx0XHRoYW5kbGVfcm91dGUocm91dGUsIHJlcSwgcmVzLCBuZXh0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG5leHQoKTtcblx0fTtcbn1cblxuLyohXG4gKiBjb29raWVcbiAqIENvcHlyaWdodChjKSAyMDEyLTIwMTQgUm9tYW4gU2h0eWxtYW5cbiAqIENvcHlyaWdodChjKSAyMDE1IERvdWdsYXMgQ2hyaXN0b3BoZXIgV2lsc29uXG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICogQHB1YmxpY1xuICovXG5cbnZhciBwYXJzZV8xID0gcGFyc2U7XG52YXIgc2VyaWFsaXplXzEgPSBzZXJpYWxpemU7XG5cbi8qKlxuICogTW9kdWxlIHZhcmlhYmxlcy5cbiAqIEBwcml2YXRlXG4gKi9cblxudmFyIGRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbnZhciBlbmNvZGUgPSBlbmNvZGVVUklDb21wb25lbnQ7XG52YXIgcGFpclNwbGl0UmVnRXhwID0gLzsgKi87XG5cbi8qKlxuICogUmVnRXhwIHRvIG1hdGNoIGZpZWxkLWNvbnRlbnQgaW4gUkZDIDcyMzAgc2VjIDMuMlxuICpcbiAqIGZpZWxkLWNvbnRlbnQgPSBmaWVsZC12Y2hhciBbIDEqKCBTUCAvIEhUQUIgKSBmaWVsZC12Y2hhciBdXG4gKiBmaWVsZC12Y2hhciAgID0gVkNIQVIgLyBvYnMtdGV4dFxuICogb2JzLXRleHQgICAgICA9ICV4ODAtRkZcbiAqL1xuXG52YXIgZmllbGRDb250ZW50UmVnRXhwID0gL15bXFx1MDAwOVxcdTAwMjAtXFx1MDA3ZVxcdTAwODAtXFx1MDBmZl0rJC87XG5cbi8qKlxuICogUGFyc2UgYSBjb29raWUgaGVhZGVyLlxuICpcbiAqIFBhcnNlIHRoZSBnaXZlbiBjb29raWUgaGVhZGVyIHN0cmluZyBpbnRvIGFuIG9iamVjdFxuICogVGhlIG9iamVjdCBoYXMgdGhlIHZhcmlvdXMgY29va2llcyBhcyBrZXlzKG5hbWVzKSA9PiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHN0ciBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICB2YXIgb2JqID0ge307XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQocGFpclNwbGl0UmVnRXhwKTtcbiAgdmFyIGRlYyA9IG9wdC5kZWNvZGUgfHwgZGVjb2RlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGFpciA9IHBhaXJzW2ldO1xuICAgIHZhciBlcV9pZHggPSBwYWlyLmluZGV4T2YoJz0nKTtcblxuICAgIC8vIHNraXAgdGhpbmdzIHRoYXQgZG9uJ3QgbG9vayBsaWtlIGtleT12YWx1ZVxuICAgIGlmIChlcV9pZHggPCAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIga2V5ID0gcGFpci5zdWJzdHIoMCwgZXFfaWR4KS50cmltKCk7XG4gICAgdmFyIHZhbCA9IHBhaXIuc3Vic3RyKCsrZXFfaWR4LCBwYWlyLmxlbmd0aCkudHJpbSgpO1xuXG4gICAgLy8gcXVvdGVkIHZhbHVlc1xuICAgIGlmICgnXCInID09IHZhbFswXSkge1xuICAgICAgdmFsID0gdmFsLnNsaWNlKDEsIC0xKTtcbiAgICB9XG5cbiAgICAvLyBvbmx5IGFzc2lnbiBvbmNlXG4gICAgaWYgKHVuZGVmaW5lZCA9PSBvYmpba2V5XSkge1xuICAgICAgb2JqW2tleV0gPSB0cnlEZWNvZGUodmFsLCBkZWMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIGRhdGEgaW50byBhIGNvb2tpZSBoZWFkZXIuXG4gKlxuICogU2VyaWFsaXplIHRoZSBhIG5hbWUgdmFsdWUgcGFpciBpbnRvIGEgY29va2llIHN0cmluZyBzdWl0YWJsZSBmb3JcbiAqIGh0dHAgaGVhZGVycy4gQW4gb3B0aW9uYWwgb3B0aW9ucyBvYmplY3Qgc3BlY2lmaWVkIGNvb2tpZSBwYXJhbWV0ZXJzLlxuICpcbiAqIHNlcmlhbGl6ZSgnZm9vJywgJ2JhcicsIHsgaHR0cE9ubHk6IHRydWUgfSlcbiAqICAgPT4gXCJmb289YmFyOyBodHRwT25seVwiXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWxcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUobmFtZSwgdmFsLCBvcHRpb25zKSB7XG4gIHZhciBvcHQgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgZW5jID0gb3B0LmVuY29kZSB8fCBlbmNvZGU7XG5cbiAgaWYgKHR5cGVvZiBlbmMgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gZW5jb2RlIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIGlmICghZmllbGRDb250ZW50UmVnRXhwLnRlc3QobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBuYW1lIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IGVuYyh2YWwpO1xuXG4gIGlmICh2YWx1ZSAmJiAhZmllbGRDb250ZW50UmVnRXhwLnRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgdmFsIGlzIGludmFsaWQnKTtcbiAgfVxuXG4gIHZhciBzdHIgPSBuYW1lICsgJz0nICsgdmFsdWU7XG5cbiAgaWYgKG51bGwgIT0gb3B0Lm1heEFnZSkge1xuICAgIHZhciBtYXhBZ2UgPSBvcHQubWF4QWdlIC0gMDtcbiAgICBpZiAoaXNOYU4obWF4QWdlKSkgdGhyb3cgbmV3IEVycm9yKCdtYXhBZ2Ugc2hvdWxkIGJlIGEgTnVtYmVyJyk7XG4gICAgc3RyICs9ICc7IE1heC1BZ2U9JyArIE1hdGguZmxvb3IobWF4QWdlKTtcbiAgfVxuXG4gIGlmIChvcHQuZG9tYWluKSB7XG4gICAgaWYgKCFmaWVsZENvbnRlbnRSZWdFeHAudGVzdChvcHQuZG9tYWluKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIGRvbWFpbiBpcyBpbnZhbGlkJyk7XG4gICAgfVxuXG4gICAgc3RyICs9ICc7IERvbWFpbj0nICsgb3B0LmRvbWFpbjtcbiAgfVxuXG4gIGlmIChvcHQucGF0aCkge1xuICAgIGlmICghZmllbGRDb250ZW50UmVnRXhwLnRlc3Qob3B0LnBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gcGF0aCBpcyBpbnZhbGlkJyk7XG4gICAgfVxuXG4gICAgc3RyICs9ICc7IFBhdGg9JyArIG9wdC5wYXRoO1xuICB9XG5cbiAgaWYgKG9wdC5leHBpcmVzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHQuZXhwaXJlcy50b1VUQ1N0cmluZyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIGV4cGlyZXMgaXMgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIHN0ciArPSAnOyBFeHBpcmVzPScgKyBvcHQuZXhwaXJlcy50b1VUQ1N0cmluZygpO1xuICB9XG5cbiAgaWYgKG9wdC5odHRwT25seSkge1xuICAgIHN0ciArPSAnOyBIdHRwT25seSc7XG4gIH1cblxuICBpZiAob3B0LnNlY3VyZSkge1xuICAgIHN0ciArPSAnOyBTZWN1cmUnO1xuICB9XG5cbiAgaWYgKG9wdC5zYW1lU2l0ZSkge1xuICAgIHZhciBzYW1lU2l0ZSA9IHR5cGVvZiBvcHQuc2FtZVNpdGUgPT09ICdzdHJpbmcnXG4gICAgICA/IG9wdC5zYW1lU2l0ZS50b0xvd2VyQ2FzZSgpIDogb3B0LnNhbWVTaXRlO1xuXG4gICAgc3dpdGNoIChzYW1lU2l0ZSkge1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBzdHIgKz0gJzsgU2FtZVNpdGU9U3RyaWN0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXgnOlxuICAgICAgICBzdHIgKz0gJzsgU2FtZVNpdGU9TGF4JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpY3QnOlxuICAgICAgICBzdHIgKz0gJzsgU2FtZVNpdGU9U3RyaWN0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgc3RyICs9ICc7IFNhbWVTaXRlPU5vbmUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBzYW1lU2l0ZSBpcyBpbnZhbGlkJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBUcnkgZGVjb2RpbmcgYSBzdHJpbmcgdXNpbmcgYSBkZWNvZGluZyBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBkZWNvZGVcbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHJ5RGVjb2RlKHN0ciwgZGVjb2RlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZShzdHIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG52YXIgY29va2llID0ge1xuXHRwYXJzZTogcGFyc2VfMSxcblx0c2VyaWFsaXplOiBzZXJpYWxpemVfMVxufTtcblxudmFyIGNoYXJzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfJCc7XG52YXIgdW5zYWZlQ2hhcnMgPSAvWzw+XFxiXFxmXFxuXFxyXFx0XFwwXFx1MjAyOFxcdTIwMjldL2c7XG52YXIgcmVzZXJ2ZWQgPSAvXig/OmRvfGlmfGlufGZvcnxpbnR8bGV0fG5ld3x0cnl8dmFyfGJ5dGV8Y2FzZXxjaGFyfGVsc2V8ZW51bXxnb3RvfGxvbmd8dGhpc3x2b2lkfHdpdGh8YXdhaXR8YnJlYWt8Y2F0Y2h8Y2xhc3N8Y29uc3R8ZmluYWx8ZmxvYXR8c2hvcnR8c3VwZXJ8dGhyb3d8d2hpbGV8eWllbGR8ZGVsZXRlfGRvdWJsZXxleHBvcnR8aW1wb3J0fG5hdGl2ZXxyZXR1cm58c3dpdGNofHRocm93c3x0eXBlb2Z8Ym9vbGVhbnxkZWZhdWx0fGV4dGVuZHN8ZmluYWxseXxwYWNrYWdlfHByaXZhdGV8YWJzdHJhY3R8Y29udGludWV8ZGVidWdnZXJ8ZnVuY3Rpb258dm9sYXRpbGV8aW50ZXJmYWNlfHByb3RlY3RlZHx0cmFuc2llbnR8aW1wbGVtZW50c3xpbnN0YW5jZW9mfHN5bmNocm9uaXplZCkkLztcbnZhciBlc2NhcGVkID0ge1xuICAgICc8JzogJ1xcXFx1MDAzQycsXG4gICAgJz4nOiAnXFxcXHUwMDNFJyxcbiAgICAnLyc6ICdcXFxcdTAwMkYnLFxuICAgICdcXFxcJzogJ1xcXFxcXFxcJyxcbiAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAnXFxyJzogJ1xcXFxyJyxcbiAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAnXFwwJzogJ1xcXFwwJyxcbiAgICAnXFx1MjAyOCc6ICdcXFxcdTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ1xcXFx1MjAyOSdcbn07XG52YXIgb2JqZWN0UHJvdG9Pd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoT2JqZWN0LnByb3RvdHlwZSkuc29ydCgpLmpvaW4oJ1xcMCcpO1xuZnVuY3Rpb24gZGV2YWx1ZSh2YWx1ZSkge1xuICAgIHZhciBjb3VudHMgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gd2Fsayh0aGluZykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc3RyaW5naWZ5IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50cy5oYXModGhpbmcpKSB7XG4gICAgICAgICAgICBjb3VudHMuc2V0KHRoaW5nLCBjb3VudHMuZ2V0KHRoaW5nKSArIDEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50cy5zZXQodGhpbmcsIDEpO1xuICAgICAgICBpZiAoIWlzUHJpbWl0aXZlKHRoaW5nKSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXRUeXBlKHRoaW5nKTtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICAgICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyYXknOlxuICAgICAgICAgICAgICAgICAgICB0aGluZy5mb3JFYWNoKHdhbGspO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdTZXQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ01hcCc6XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20odGhpbmcpLmZvckVhY2god2Fsayk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGluZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm90byAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG8gIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5zb3J0KCkuam9pbignXFwwJykgIT09IG9iamVjdFByb3RvT3duUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHN0cmluZ2lmeSBhcmJpdHJhcnkgbm9uLVBPSk9zXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRoaW5nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc3RyaW5naWZ5IFBPSk9zIHdpdGggc3ltYm9saWMga2V5c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGluZykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB3YWxrKHRoaW5nW2tleV0pOyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3YWxrKHZhbHVlKTtcbiAgICB2YXIgbmFtZXMgPSBuZXcgTWFwKCk7XG4gICAgQXJyYXkuZnJvbShjb3VudHMpXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7IHJldHVybiBlbnRyeVsxXSA+IDE7IH0pXG4gICAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiWzFdIC0gYVsxXTsgfSlcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5LCBpKSB7XG4gICAgICAgIG5hbWVzLnNldChlbnRyeVswXSwgZ2V0TmFtZShpKSk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gc3RyaW5naWZ5KHRoaW5nKSB7XG4gICAgICAgIGlmIChuYW1lcy5oYXModGhpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmFtZXMuZ2V0KHRoaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcmltaXRpdmUodGhpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZ5UHJpbWl0aXZlKHRoaW5nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdHlwZSA9IGdldFR5cGUodGhpbmcpO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAnQm9vbGVhbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiT2JqZWN0KFwiICsgc3RyaW5naWZ5KHRoaW5nLnZhbHVlT2YoKSkgKyBcIilcIjtcbiAgICAgICAgICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaW5nLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJuZXcgRGF0ZShcIiArIHRoaW5nLmdldFRpbWUoKSArIFwiKVwiO1xuICAgICAgICAgICAgY2FzZSAnQXJyYXknOlxuICAgICAgICAgICAgICAgIHZhciBtZW1iZXJzID0gdGhpbmcubWFwKGZ1bmN0aW9uICh2LCBpKSB7IHJldHVybiBpIGluIHRoaW5nID8gc3RyaW5naWZ5KHYpIDogJyc7IH0pO1xuICAgICAgICAgICAgICAgIHZhciB0YWlsID0gdGhpbmcubGVuZ3RoID09PSAwIHx8ICh0aGluZy5sZW5ndGggLSAxIGluIHRoaW5nKSA/ICcnIDogJywnO1xuICAgICAgICAgICAgICAgIHJldHVybiBcIltcIiArIG1lbWJlcnMuam9pbignLCcpICsgdGFpbCArIFwiXVwiO1xuICAgICAgICAgICAgY2FzZSAnU2V0JzpcbiAgICAgICAgICAgIGNhc2UgJ01hcCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibmV3IFwiICsgdHlwZSArIFwiKFtcIiArIEFycmF5LmZyb20odGhpbmcpLm1hcChzdHJpbmdpZnkpLmpvaW4oJywnKSArIFwiXSlcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IFwie1wiICsgT2JqZWN0LmtleXModGhpbmcpLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBzYWZlS2V5KGtleSkgKyBcIjpcIiArIHN0cmluZ2lmeSh0aGluZ1trZXldKTsgfSkuam9pbignLCcpICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaW5nKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLFwiICsgb2JqICsgXCIpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJPYmplY3QuY3JlYXRlKG51bGwpXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHN0ciA9IHN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKG5hbWVzLnNpemUpIHtcbiAgICAgICAgdmFyIHBhcmFtc18xID0gW107XG4gICAgICAgIHZhciBzdGF0ZW1lbnRzXzEgPSBbXTtcbiAgICAgICAgdmFyIHZhbHVlc18xID0gW107XG4gICAgICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIHRoaW5nKSB7XG4gICAgICAgICAgICBwYXJhbXNfMS5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHRoaW5nKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2goc3RyaW5naWZ5UHJpbWl0aXZlKHRoaW5nKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXRUeXBlKHRoaW5nKTtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgICAgICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaChcIk9iamVjdChcIiArIHN0cmluZ2lmeSh0aGluZy52YWx1ZU9mKCkpICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKHRoaW5nLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdEYXRlJzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzXzEucHVzaChcIm5ldyBEYXRlKFwiICsgdGhpbmcuZ2V0VGltZSgpICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2goXCJBcnJheShcIiArIHRoaW5nLmxlbmd0aCArIFwiKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpbmcuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50c18xLnB1c2gobmFtZSArIFwiW1wiICsgaSArIFwiXT1cIiArIHN0cmluZ2lmeSh2KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdTZXQnOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKFwibmV3IFNldFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50c18xLnB1c2gobmFtZSArIFwiLlwiICsgQXJyYXkuZnJvbSh0aGluZykubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBcImFkZChcIiArIHN0cmluZ2lmeSh2KSArIFwiKVwiOyB9KS5qb2luKCcuJykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdNYXAnOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNfMS5wdXNoKFwibmV3IE1hcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50c18xLnB1c2gobmFtZSArIFwiLlwiICsgQXJyYXkuZnJvbSh0aGluZykubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGsgPSBfYVswXSwgdiA9IF9hWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwic2V0KFwiICsgc3RyaW5naWZ5KGspICsgXCIsIFwiICsgc3RyaW5naWZ5KHYpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oJy4nKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc18xLnB1c2goT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaW5nKSA9PT0gbnVsbCA/ICdPYmplY3QuY3JlYXRlKG51bGwpJyA6ICd7fScpO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGluZykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzXzEucHVzaChcIlwiICsgbmFtZSArIHNhZmVQcm9wKGtleSkgKyBcIj1cIiArIHN0cmluZ2lmeSh0aGluZ1trZXldKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3RhdGVtZW50c18xLnB1c2goXCJyZXR1cm4gXCIgKyBzdHIpO1xuICAgICAgICByZXR1cm4gXCIoZnVuY3Rpb24oXCIgKyBwYXJhbXNfMS5qb2luKCcsJykgKyBcIil7XCIgKyBzdGF0ZW1lbnRzXzEuam9pbignOycpICsgXCJ9KFwiICsgdmFsdWVzXzEuam9pbignLCcpICsgXCIpKVwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXROYW1lKG51bSkge1xuICAgIHZhciBuYW1lID0gJyc7XG4gICAgZG8ge1xuICAgICAgICBuYW1lID0gY2hhcnNbbnVtICUgY2hhcnMubGVuZ3RoXSArIG5hbWU7XG4gICAgICAgIG51bSA9IH5+KG51bSAvIGNoYXJzLmxlbmd0aCkgLSAxO1xuICAgIH0gd2hpbGUgKG51bSA+PSAwKTtcbiAgICByZXR1cm4gcmVzZXJ2ZWQudGVzdChuYW1lKSA/IG5hbWUgKyBcIl9cIiA6IG5hbWU7XG59XG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh0aGluZykge1xuICAgIHJldHVybiBPYmplY3QodGhpbmcpICE9PSB0aGluZztcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVByaW1pdGl2ZSh0aGluZykge1xuICAgIGlmICh0eXBlb2YgdGhpbmcgPT09ICdzdHJpbmcnKVxuICAgICAgICByZXR1cm4gc3RyaW5naWZ5U3RyaW5nKHRoaW5nKTtcbiAgICBpZiAodGhpbmcgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuICd2b2lkIDAnO1xuICAgIGlmICh0aGluZyA9PT0gMCAmJiAxIC8gdGhpbmcgPCAwKVxuICAgICAgICByZXR1cm4gJy0wJztcbiAgICB2YXIgc3RyID0gU3RyaW5nKHRoaW5nKTtcbiAgICBpZiAodHlwZW9mIHRoaW5nID09PSAnbnVtYmVyJylcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eKC0pPzBcXC4vLCAnJDEuJyk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmZ1bmN0aW9uIGdldFR5cGUodGhpbmcpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaW5nKS5zbGljZSg4LCAtMSk7XG59XG5mdW5jdGlvbiBlc2NhcGVVbnNhZmVDaGFyKGMpIHtcbiAgICByZXR1cm4gZXNjYXBlZFtjXSB8fCBjO1xufVxuZnVuY3Rpb24gZXNjYXBlVW5zYWZlQ2hhcnMoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKHVuc2FmZUNoYXJzLCBlc2NhcGVVbnNhZmVDaGFyKTtcbn1cbmZ1bmN0aW9uIHNhZmVLZXkoa2V5KSB7XG4gICAgcmV0dXJuIC9eW18kYS16QS1aXVtfJGEtekEtWjAtOV0qJC8udGVzdChrZXkpID8ga2V5IDogZXNjYXBlVW5zYWZlQ2hhcnMoSlNPTi5zdHJpbmdpZnkoa2V5KSk7XG59XG5mdW5jdGlvbiBzYWZlUHJvcChrZXkpIHtcbiAgICByZXR1cm4gL15bXyRhLXpBLVpdW18kYS16QS1aMC05XSokLy50ZXN0KGtleSkgPyBcIi5cIiArIGtleSA6IFwiW1wiICsgZXNjYXBlVW5zYWZlQ2hhcnMoSlNPTi5zdHJpbmdpZnkoa2V5KSkgKyBcIl1cIjtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyhzdHIpIHtcbiAgICB2YXIgcmVzdWx0ID0gJ1wiJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgY2hhciA9IHN0ci5jaGFyQXQoaSk7XG4gICAgICAgIHZhciBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xuICAgICAgICBpZiAoY2hhciA9PT0gJ1wiJykge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICdcXFxcXCInO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoYXIgaW4gZXNjYXBlZCkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IGVzY2FwZWRbY2hhcl07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA+PSAweGQ4MDAgJiYgY29kZSA8PSAweGRmZmYpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gc3RyLmNoYXJDb2RlQXQoaSArIDEpO1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgYmVnaW5uaW5nIG9mIGEgW2hpZ2gsIGxvd10gc3Vycm9nYXRlIHBhaXIsXG4gICAgICAgICAgICAvLyBhZGQgdGhlIG5leHQgdHdvIGNoYXJhY3RlcnMsIG90aGVyd2lzZSBlc2NhcGVcbiAgICAgICAgICAgIGlmIChjb2RlIDw9IDB4ZGJmZiAmJiAobmV4dCA+PSAweGRjMDAgJiYgbmV4dCA8PSAweGRmZmYpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXIgKyBzdHJbKytpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIlxcXFx1XCIgKyBjb2RlLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0ICs9ICdcIic7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL3RtcHZhci9qc2RvbS9ibG9iL2FhODViMmFiZjA3NzY2ZmY3YmY1YzFmNmRhYWZiMzcyNmYyZjJkYjUvbGliL2pzZG9tL2xpdmluZy9ibG9iLmpzXG5cbi8vIGZpeCBmb3IgXCJSZWFkYWJsZVwiIGlzbid0IGEgbmFtZWQgZXhwb3J0IGlzc3VlXG5jb25zdCBSZWFkYWJsZSA9IFN0cmVhbS5SZWFkYWJsZTtcblxuY29uc3QgQlVGRkVSID0gU3ltYm9sKCdidWZmZXInKTtcbmNvbnN0IFRZUEUgPSBTeW1ib2woJ3R5cGUnKTtcblxuY2xhc3MgQmxvYiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXNbVFlQRV0gPSAnJztcblxuXHRcdGNvbnN0IGJsb2JQYXJ0cyA9IGFyZ3VtZW50c1swXTtcblx0XHRjb25zdCBvcHRpb25zID0gYXJndW1lbnRzWzFdO1xuXG5cdFx0Y29uc3QgYnVmZmVycyA9IFtdO1xuXHRcdGxldCBzaXplID0gMDtcblxuXHRcdGlmIChibG9iUGFydHMpIHtcblx0XHRcdGNvbnN0IGEgPSBibG9iUGFydHM7XG5cdFx0XHRjb25zdCBsZW5ndGggPSBOdW1iZXIoYS5sZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBlbGVtZW50ID0gYVtpXTtcblx0XHRcdFx0bGV0IGJ1ZmZlcjtcblx0XHRcdFx0aWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcblx0XHRcdFx0XHRidWZmZXIgPSBlbGVtZW50O1xuXHRcdFx0XHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGVsZW1lbnQuYnVmZmVyLCBlbGVtZW50LmJ5dGVPZmZzZXQsIGVsZW1lbnQuYnl0ZUxlbmd0aCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG5cdFx0XHRcdFx0YnVmZmVyID0gQnVmZmVyLmZyb20oZWxlbWVudCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJsb2IpIHtcblx0XHRcdFx0XHRidWZmZXIgPSBlbGVtZW50W0JVRkZFUl07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnVmZmVyID0gQnVmZmVyLmZyb20odHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnID8gZWxlbWVudCA6IFN0cmluZyhlbGVtZW50KSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2l6ZSArPSBidWZmZXIubGVuZ3RoO1xuXHRcdFx0XHRidWZmZXJzLnB1c2goYnVmZmVyKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzW0JVRkZFUl0gPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuXG5cdFx0bGV0IHR5cGUgPSBvcHRpb25zICYmIG9wdGlvbnMudHlwZSAhPT0gdW5kZWZpbmVkICYmIFN0cmluZyhvcHRpb25zLnR5cGUpLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKHR5cGUgJiYgIS9bXlxcdTAwMjAtXFx1MDA3RV0vLnRlc3QodHlwZSkpIHtcblx0XHRcdHRoaXNbVFlQRV0gPSB0eXBlO1xuXHRcdH1cblx0fVxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tCVUZGRVJdLmxlbmd0aDtcblx0fVxuXHRnZXQgdHlwZSgpIHtcblx0XHRyZXR1cm4gdGhpc1tUWVBFXTtcblx0fVxuXHR0ZXh0KCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpc1tCVUZGRVJdLnRvU3RyaW5nKCkpO1xuXHR9XG5cdGFycmF5QnVmZmVyKCkge1xuXHRcdGNvbnN0IGJ1ZiA9IHRoaXNbQlVGRkVSXTtcblx0XHRjb25zdCBhYiA9IGJ1Zi5idWZmZXIuc2xpY2UoYnVmLmJ5dGVPZmZzZXQsIGJ1Zi5ieXRlT2Zmc2V0ICsgYnVmLmJ5dGVMZW5ndGgpO1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoYWIpO1xuXHR9XG5cdHN0cmVhbSgpIHtcblx0XHRjb25zdCByZWFkYWJsZSA9IG5ldyBSZWFkYWJsZSgpO1xuXHRcdHJlYWRhYmxlLl9yZWFkID0gZnVuY3Rpb24gKCkge307XG5cdFx0cmVhZGFibGUucHVzaCh0aGlzW0JVRkZFUl0pO1xuXHRcdHJlYWRhYmxlLnB1c2gobnVsbCk7XG5cdFx0cmV0dXJuIHJlYWRhYmxlO1xuXHR9XG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiAnW29iamVjdCBCbG9iXSc7XG5cdH1cblx0c2xpY2UoKSB7XG5cdFx0Y29uc3Qgc2l6ZSA9IHRoaXMuc2l6ZTtcblxuXHRcdGNvbnN0IHN0YXJ0ID0gYXJndW1lbnRzWzBdO1xuXHRcdGNvbnN0IGVuZCA9IGFyZ3VtZW50c1sxXTtcblx0XHRsZXQgcmVsYXRpdmVTdGFydCwgcmVsYXRpdmVFbmQ7XG5cdFx0aWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJlbGF0aXZlU3RhcnQgPSAwO1xuXHRcdH0gZWxzZSBpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRyZWxhdGl2ZVN0YXJ0ID0gTWF0aC5tYXgoc2l6ZSArIHN0YXJ0LCAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVsYXRpdmVTdGFydCA9IE1hdGgubWluKHN0YXJ0LCBzaXplKTtcblx0XHR9XG5cdFx0aWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IHNpemU7XG5cdFx0fSBlbHNlIGlmIChlbmQgPCAwKSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IE1hdGgubWF4KHNpemUgKyBlbmQsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWxhdGl2ZUVuZCA9IE1hdGgubWluKGVuZCwgc2l6ZSk7XG5cdFx0fVxuXHRcdGNvbnN0IHNwYW4gPSBNYXRoLm1heChyZWxhdGl2ZUVuZCAtIHJlbGF0aXZlU3RhcnQsIDApO1xuXG5cdFx0Y29uc3QgYnVmZmVyID0gdGhpc1tCVUZGRVJdO1xuXHRcdGNvbnN0IHNsaWNlZEJ1ZmZlciA9IGJ1ZmZlci5zbGljZShyZWxhdGl2ZVN0YXJ0LCByZWxhdGl2ZVN0YXJ0ICsgc3Bhbik7XG5cdFx0Y29uc3QgYmxvYiA9IG5ldyBCbG9iKFtdLCB7IHR5cGU6IGFyZ3VtZW50c1syXSB9KTtcblx0XHRibG9iW0JVRkZFUl0gPSBzbGljZWRCdWZmZXI7XG5cdFx0cmV0dXJuIGJsb2I7XG5cdH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQmxvYi5wcm90b3R5cGUsIHtcblx0c2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHR5cGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzbGljZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQmxvYi5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuXHR2YWx1ZTogJ0Jsb2InLFxuXHR3cml0YWJsZTogZmFsc2UsXG5cdGVudW1lcmFibGU6IGZhbHNlLFxuXHRjb25maWd1cmFibGU6IHRydWVcbn0pO1xuXG4vKipcbiAqIGZldGNoLWVycm9yLmpzXG4gKlxuICogRmV0Y2hFcnJvciBpbnRlcmZhY2UgZm9yIG9wZXJhdGlvbmFsIGVycm9yc1xuICovXG5cbi8qKlxuICogQ3JlYXRlIEZldGNoRXJyb3IgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBtZXNzYWdlICAgICAgRXJyb3IgbWVzc2FnZSBmb3IgaHVtYW5cbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIHR5cGUgICAgICAgICBFcnJvciB0eXBlIGZvciBtYWNoaW5lXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBzeXN0ZW1FcnJvciAgRm9yIE5vZGUuanMgc3lzdGVtIGVycm9yXG4gKiBAcmV0dXJuICBGZXRjaEVycm9yXG4gKi9cbmZ1bmN0aW9uIEZldGNoRXJyb3IobWVzc2FnZSwgdHlwZSwgc3lzdGVtRXJyb3IpIHtcbiAgRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuXG4gIC8vIHdoZW4gZXJyLnR5cGUgaXMgYHN5c3RlbWAsIGVyci5jb2RlIGNvbnRhaW5zIHN5c3RlbSBlcnJvciBjb2RlXG4gIGlmIChzeXN0ZW1FcnJvcikge1xuICAgIHRoaXMuY29kZSA9IHRoaXMuZXJybm8gPSBzeXN0ZW1FcnJvci5jb2RlO1xuICB9XG5cbiAgLy8gaGlkZSBjdXN0b20gZXJyb3IgaW1wbGVtZW50YXRpb24gZGV0YWlscyBmcm9tIGVuZC11c2Vyc1xuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbn1cblxuRmV0Y2hFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5GZXRjaEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEZldGNoRXJyb3I7XG5GZXRjaEVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ZldGNoRXJyb3InO1xuXG5sZXQgY29udmVydDtcbnRyeSB7XG5cdGNvbnZlcnQgPSByZXF1aXJlKCdlbmNvZGluZycpLmNvbnZlcnQ7XG59IGNhdGNoIChlKSB7fVxuXG5jb25zdCBJTlRFUk5BTFMgPSBTeW1ib2woJ0JvZHkgaW50ZXJuYWxzJyk7XG5cbi8vIGZpeCBhbiBpc3N1ZSB3aGVyZSBcIlBhc3NUaHJvdWdoXCIgaXNuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBQYXNzVGhyb3VnaCA9IFN0cmVhbS5QYXNzVGhyb3VnaDtcblxuLyoqXG4gKiBCb2R5IG1peGluXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jYm9keVxuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZnVuY3Rpb24gQm9keShib2R5KSB7XG5cdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0dmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuXHQgICAgX3JlZiRzaXplID0gX3JlZi5zaXplO1xuXG5cdGxldCBzaXplID0gX3JlZiRzaXplID09PSB1bmRlZmluZWQgPyAwIDogX3JlZiRzaXplO1xuXHR2YXIgX3JlZiR0aW1lb3V0ID0gX3JlZi50aW1lb3V0O1xuXHRsZXQgdGltZW91dCA9IF9yZWYkdGltZW91dCA9PT0gdW5kZWZpbmVkID8gMCA6IF9yZWYkdGltZW91dDtcblxuXHRpZiAoYm9keSA9PSBudWxsKSB7XG5cdFx0Ly8gYm9keSBpcyB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdGJvZHkgPSBudWxsO1xuXHR9IGVsc2UgaWYgKGlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LnRvU3RyaW5nKCkpO1xuXHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkgOyBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIDsgZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGJvZHkpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nKSB7XG5cdFx0Ly8gYm9keSBpcyBBcnJheUJ1ZmZlclxuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5KTtcblx0fSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIEFycmF5QnVmZmVyVmlld1xuXHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LmJ1ZmZlciwgYm9keS5ieXRlT2Zmc2V0LCBib2R5LmJ5dGVMZW5ndGgpO1xuXHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pIDsgZWxzZSB7XG5cdFx0Ly8gbm9uZSBvZiB0aGUgYWJvdmVcblx0XHQvLyBjb2VyY2UgdG8gc3RyaW5nIHRoZW4gYnVmZmVyXG5cdFx0Ym9keSA9IEJ1ZmZlci5mcm9tKFN0cmluZyhib2R5KSk7XG5cdH1cblx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdGJvZHksXG5cdFx0ZGlzdHVyYmVkOiBmYWxzZSxcblx0XHRlcnJvcjogbnVsbFxuXHR9O1xuXHR0aGlzLnNpemUgPSBzaXplO1xuXHR0aGlzLnRpbWVvdXQgPSB0aW1lb3V0O1xuXG5cdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0Ym9keS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IGVyci5uYW1lID09PSAnQWJvcnRFcnJvcicgPyBlcnIgOiBuZXcgRmV0Y2hFcnJvcihgSW52YWxpZCByZXNwb25zZSBib2R5IHdoaWxlIHRyeWluZyB0byBmZXRjaCAke190aGlzLnVybH06ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycik7XG5cdFx0XHRfdGhpc1tJTlRFUk5BTFNdLmVycm9yID0gZXJyb3I7XG5cdFx0fSk7XG5cdH1cbn1cblxuQm9keS5wcm90b3R5cGUgPSB7XG5cdGdldCBib2R5KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uYm9keTtcblx0fSxcblxuXHRnZXQgYm9keVVzZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQ7XG5cdH0sXG5cblx0LyoqXG4gICogRGVjb2RlIHJlc3BvbnNlIGFzIEFycmF5QnVmZmVyXG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdGFycmF5QnVmZmVyKCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1Zikge1xuXHRcdFx0cmV0dXJuIGJ1Zi5idWZmZXIuc2xpY2UoYnVmLmJ5dGVPZmZzZXQsIGJ1Zi5ieXRlT2Zmc2V0ICsgYnVmLmJ5dGVMZW5ndGgpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIFJldHVybiByYXcgcmVzcG9uc2UgYXMgQmxvYlxuICAqXG4gICogQHJldHVybiBQcm9taXNlXG4gICovXG5cdGJsb2IoKSB7XG5cdFx0bGV0IGN0ID0gdGhpcy5oZWFkZXJzICYmIHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpIHx8ICcnO1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1Zikge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oXG5cdFx0XHQvLyBQcmV2ZW50IGNvcHlpbmdcblx0XHRcdG5ldyBCbG9iKFtdLCB7XG5cdFx0XHRcdHR5cGU6IGN0LnRvTG93ZXJDYXNlKClcblx0XHRcdH0pLCB7XG5cdFx0XHRcdFtCVUZGRVJdOiBidWZcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyBqc29uXG4gICpcbiAgKiBAcmV0dXJuICBQcm9taXNlXG4gICovXG5cdGpzb24oKSB7XG5cdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRyZXR1cm4gY29uc3VtZUJvZHkuY2FsbCh0aGlzKS50aGVuKGZ1bmN0aW9uIChidWZmZXIpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlamVjdChuZXcgRmV0Y2hFcnJvcihgaW52YWxpZCBqc29uIHJlc3BvbnNlIGJvZHkgYXQgJHtfdGhpczIudXJsfSByZWFzb246ICR7ZXJyLm1lc3NhZ2V9YCwgJ2ludmFsaWQtanNvbicpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHQvKipcbiAgKiBEZWNvZGUgcmVzcG9uc2UgYXMgdGV4dFxuICAqXG4gICogQHJldHVybiAgUHJvbWlzZVxuICAqL1xuXHR0ZXh0KCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpLnRoZW4oZnVuY3Rpb24gKGJ1ZmZlcikge1xuXHRcdFx0cmV0dXJuIGJ1ZmZlci50b1N0cmluZygpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyBidWZmZXIgKG5vbi1zcGVjIGFwaSlcbiAgKlxuICAqIEByZXR1cm4gIFByb21pc2VcbiAgKi9cblx0YnVmZmVyKCkge1xuXHRcdHJldHVybiBjb25zdW1lQm9keS5jYWxsKHRoaXMpO1xuXHR9LFxuXG5cdC8qKlxuICAqIERlY29kZSByZXNwb25zZSBhcyB0ZXh0LCB3aGlsZSBhdXRvbWF0aWNhbGx5IGRldGVjdGluZyB0aGUgZW5jb2RpbmcgYW5kXG4gICogdHJ5aW5nIHRvIGRlY29kZSB0byBVVEYtOCAobm9uLXNwZWMgYXBpKVxuICAqXG4gICogQHJldHVybiAgUHJvbWlzZVxuICAqL1xuXHR0ZXh0Q29udmVydGVkKCkge1xuXHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIGNvbnN1bWVCb2R5LmNhbGwodGhpcykudGhlbihmdW5jdGlvbiAoYnVmZmVyKSB7XG5cdFx0XHRyZXR1cm4gY29udmVydEJvZHkoYnVmZmVyLCBfdGhpczMuaGVhZGVycyk7XG5cdFx0fSk7XG5cdH1cbn07XG5cbi8vIEluIGJyb3dzZXJzLCBhbGwgcHJvcGVydGllcyBhcmUgZW51bWVyYWJsZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEJvZHkucHJvdG90eXBlLCB7XG5cdGJvZHk6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRib2R5VXNlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGFycmF5QnVmZmVyOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0YmxvYjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGpzb246IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHR0ZXh0OiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbkJvZHkubWl4SW4gPSBmdW5jdGlvbiAocHJvdG8pIHtcblx0Zm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEJvZHkucHJvdG90eXBlKSkge1xuXHRcdC8vIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiBmdXR1cmUgcHJvb2Zcblx0XHRpZiAoIShuYW1lIGluIHByb3RvKSkge1xuXHRcdFx0Y29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQm9keS5wcm90b3R5cGUsIG5hbWUpO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCBkZXNjKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qKlxuICogQ29uc3VtZSBhbmQgY29udmVydCBhbiBlbnRpcmUgQm9keSB0byBhIEJ1ZmZlci5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHktY29uc3VtZS1ib2R5XG4gKlxuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5mdW5jdGlvbiBjb25zdW1lQm9keSgpIHtcblx0dmFyIF90aGlzNCA9IHRoaXM7XG5cblx0aWYgKHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKGBib2R5IHVzZWQgYWxyZWFkeSBmb3I6ICR7dGhpcy51cmx9YCkpO1xuXHR9XG5cblx0dGhpc1tJTlRFUk5BTFNdLmRpc3R1cmJlZCA9IHRydWU7XG5cblx0aWYgKHRoaXNbSU5URVJOQUxTXS5lcnJvcikge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVqZWN0KHRoaXNbSU5URVJOQUxTXS5lcnJvcik7XG5cdH1cblxuXHRsZXQgYm9keSA9IHRoaXMuYm9keTtcblxuXHQvLyBib2R5IGlzIG51bGxcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlc29sdmUoQnVmZmVyLmFsbG9jKDApKTtcblx0fVxuXG5cdC8vIGJvZHkgaXMgYmxvYlxuXHRpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0Ym9keSA9IGJvZHkuc3RyZWFtKCk7XG5cdH1cblxuXHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZXNvbHZlKGJvZHkpO1xuXHR9XG5cblx0Ly8gaXN0YW5idWwgaWdub3JlIGlmOiBzaG91bGQgbmV2ZXIgaGFwcGVuXG5cdGlmICghKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0pKSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZXNvbHZlKEJ1ZmZlci5hbGxvYygwKSk7XG5cdH1cblxuXHQvLyBib2R5IGlzIHN0cmVhbVxuXHQvLyBnZXQgcmVhZHkgdG8gYWN0dWFsbHkgY29uc3VtZSB0aGUgYm9keVxuXHRsZXQgYWNjdW0gPSBbXTtcblx0bGV0IGFjY3VtQnl0ZXMgPSAwO1xuXHRsZXQgYWJvcnQgPSBmYWxzZTtcblxuXHRyZXR1cm4gbmV3IEJvZHkuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0bGV0IHJlc1RpbWVvdXQ7XG5cblx0XHQvLyBhbGxvdyB0aW1lb3V0IG9uIHNsb3cgcmVzcG9uc2UgYm9keVxuXHRcdGlmIChfdGhpczQudGltZW91dCkge1xuXHRcdFx0cmVzVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRhYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgUmVzcG9uc2UgdGltZW91dCB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHtfdGhpczQudXJsfSAob3ZlciAke190aGlzNC50aW1lb3V0fW1zKWAsICdib2R5LXRpbWVvdXQnKSk7XG5cdFx0XHR9LCBfdGhpczQudGltZW91dCk7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHN0cmVhbSBlcnJvcnNcblx0XHRib2R5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG5cdFx0XHRcdC8vIGlmIHRoZSByZXF1ZXN0IHdhcyBhYm9ydGVkLCByZWplY3Qgd2l0aCB0aGlzIEVycm9yXG5cdFx0XHRcdGFib3J0ID0gdHJ1ZTtcblx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBvdGhlciBlcnJvcnMsIHN1Y2ggYXMgaW5jb3JyZWN0IGNvbnRlbnQtZW5jb2Rpbmdcblx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7X3RoaXM0LnVybH06ICR7ZXJyLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycikpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ym9keS5vbignZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuXHRcdFx0aWYgKGFib3J0IHx8IGNodW5rID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKF90aGlzNC5zaXplICYmIGFjY3VtQnl0ZXMgKyBjaHVuay5sZW5ndGggPiBfdGhpczQuc2l6ZSkge1xuXHRcdFx0XHRhYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgY29udGVudCBzaXplIGF0ICR7X3RoaXM0LnVybH0gb3ZlciBsaW1pdDogJHtfdGhpczQuc2l6ZX1gLCAnbWF4LXNpemUnKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YWNjdW1CeXRlcyArPSBjaHVuay5sZW5ndGg7XG5cdFx0XHRhY2N1bS5wdXNoKGNodW5rKTtcblx0XHR9KTtcblxuXHRcdGJvZHkub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChhYm9ydCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNsZWFyVGltZW91dChyZXNUaW1lb3V0KTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmVzb2x2ZShCdWZmZXIuY29uY2F0KGFjY3VtLCBhY2N1bUJ5dGVzKSk7XG5cdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIHN0cmVhbXMgdGhhdCBoYXZlIGFjY3VtdWxhdGVkIHRvbyBtdWNoIGRhdGEgKGlzc3VlICM0MTQpXG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgQ291bGQgbm90IGNyZWF0ZSBCdWZmZXIgZnJvbSByZXNwb25zZSBib2R5IGZvciAke190aGlzNC51cmx9OiAke2Vyci5tZXNzYWdlfWAsICdzeXN0ZW0nLCBlcnIpKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5cbi8qKlxuICogRGV0ZWN0IGJ1ZmZlciBlbmNvZGluZyBhbmQgY29udmVydCB0byB0YXJnZXQgZW5jb2RpbmdcbiAqIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9XRC1odG1sNS0yMDExMDExMy9wYXJzaW5nLmh0bWwjZGV0ZXJtaW5pbmctdGhlLWNoYXJhY3Rlci1lbmNvZGluZ1xuICpcbiAqIEBwYXJhbSAgIEJ1ZmZlciAgYnVmZmVyICAgIEluY29taW5nIGJ1ZmZlclxuICogQHBhcmFtICAgU3RyaW5nICBlbmNvZGluZyAgVGFyZ2V0IGVuY29kaW5nXG4gKiBAcmV0dXJuICBTdHJpbmdcbiAqL1xuZnVuY3Rpb24gY29udmVydEJvZHkoYnVmZmVyLCBoZWFkZXJzKSB7XG5cdGlmICh0eXBlb2YgY29udmVydCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcignVGhlIHBhY2thZ2UgYGVuY29kaW5nYCBtdXN0IGJlIGluc3RhbGxlZCB0byB1c2UgdGhlIHRleHRDb252ZXJ0ZWQoKSBmdW5jdGlvbicpO1xuXHR9XG5cblx0Y29uc3QgY3QgPSBoZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG5cdGxldCBjaGFyc2V0ID0gJ3V0Zi04Jztcblx0bGV0IHJlcywgc3RyO1xuXG5cdC8vIGhlYWRlclxuXHRpZiAoY3QpIHtcblx0XHRyZXMgPSAvY2hhcnNldD0oW147XSopL2kuZXhlYyhjdCk7XG5cdH1cblxuXHQvLyBubyBjaGFyc2V0IGluIGNvbnRlbnQgdHlwZSwgcGVlayBhdCByZXNwb25zZSBib2R5IGZvciBhdCBtb3N0IDEwMjQgYnl0ZXNcblx0c3RyID0gYnVmZmVyLnNsaWNlKDAsIDEwMjQpLnRvU3RyaW5nKCk7XG5cblx0Ly8gaHRtbDVcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxtZXRhLis/Y2hhcnNldD0oWydcIl0pKC4rPylcXDEvaS5leGVjKHN0cik7XG5cdH1cblxuXHQvLyBodG1sNFxuXHRpZiAoIXJlcyAmJiBzdHIpIHtcblx0XHRyZXMgPSAvPG1ldGFbXFxzXSs/aHR0cC1lcXVpdj0oWydcIl0pY29udGVudC10eXBlXFwxW1xcc10rP2NvbnRlbnQ9KFsnXCJdKSguKz8pXFwyL2kuZXhlYyhzdHIpO1xuXG5cdFx0aWYgKHJlcykge1xuXHRcdFx0cmVzID0gL2NoYXJzZXQ9KC4qKS9pLmV4ZWMocmVzLnBvcCgpKTtcblx0XHR9XG5cdH1cblxuXHQvLyB4bWxcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxcXD94bWwuKz9lbmNvZGluZz0oWydcIl0pKC4rPylcXDEvaS5leGVjKHN0cik7XG5cdH1cblxuXHQvLyBmb3VuZCBjaGFyc2V0XG5cdGlmIChyZXMpIHtcblx0XHRjaGFyc2V0ID0gcmVzLnBvcCgpO1xuXG5cdFx0Ly8gcHJldmVudCBkZWNvZGUgaXNzdWVzIHdoZW4gc2l0ZXMgdXNlIGluY29ycmVjdCBlbmNvZGluZ1xuXHRcdC8vIHJlZjogaHR0cHM6Ly9oc2l2b25lbi5maS9lbmNvZGluZy1tZW51L1xuXHRcdGlmIChjaGFyc2V0ID09PSAnZ2IyMzEyJyB8fCBjaGFyc2V0ID09PSAnZ2JrJykge1xuXHRcdFx0Y2hhcnNldCA9ICdnYjE4MDMwJztcblx0XHR9XG5cdH1cblxuXHQvLyB0dXJuIHJhdyBidWZmZXJzIGludG8gYSBzaW5nbGUgdXRmLTggYnVmZmVyXG5cdHJldHVybiBjb252ZXJ0KGJ1ZmZlciwgJ1VURi04JywgY2hhcnNldCkudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKiByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9iaXRpbm4vbm9kZS1mZXRjaC9pc3N1ZXMvMjk2I2lzc3VlY29tbWVudC0zMDc1OTgxNDNcbiAqXG4gKiBAcGFyYW0gICBPYmplY3QgIG9iaiAgICAgT2JqZWN0IHRvIGRldGVjdCBieSB0eXBlIG9yIGJyYW5kXG4gKiBAcmV0dXJuICBTdHJpbmdcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXMob2JqKSB7XG5cdC8vIER1Y2stdHlwaW5nIGFzIGEgbmVjZXNzYXJ5IGNvbmRpdGlvbi5cblx0aWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmouYXBwZW5kICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBvYmouZGVsZXRlICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBvYmouZ2V0ICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBvYmouZ2V0QWxsICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBvYmouaGFzICE9PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBvYmouc2V0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gQnJhbmQtY2hlY2tpbmcgYW5kIG1vcmUgZHVjay10eXBpbmcgYXMgb3B0aW9uYWwgY29uZGl0aW9uLlxuXHRyZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdVUkxTZWFyY2hQYXJhbXMnIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBVUkxTZWFyY2hQYXJhbXNdJyB8fCB0eXBlb2Ygb2JqLnNvcnQgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBXM0MgYEJsb2JgIG9iamVjdCAod2hpY2ggYEZpbGVgIGluaGVyaXRzIGZyb20pXG4gKiBAcGFyYW0gIHsqfSBvYmpcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQmxvYihvYmopIHtcblx0cmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmouYXJyYXlCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai50eXBlID09PSAnc3RyaW5nJyAmJiB0eXBlb2Ygb2JqLnN0cmVhbSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gJ3N0cmluZycgJiYgL14oQmxvYnxGaWxlKSQvLnRlc3Qob2JqLmNvbnN0cnVjdG9yLm5hbWUpICYmIC9eKEJsb2J8RmlsZSkkLy50ZXN0KG9ialtTeW1ib2wudG9TdHJpbmdUYWddKTtcbn1cblxuLyoqXG4gKiBDbG9uZSBib2R5IGdpdmVuIFJlcy9SZXEgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgaW5zdGFuY2UgIFJlc3BvbnNlIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEByZXR1cm4gIE1peGVkXG4gKi9cbmZ1bmN0aW9uIGNsb25lKGluc3RhbmNlKSB7XG5cdGxldCBwMSwgcDI7XG5cdGxldCBib2R5ID0gaW5zdGFuY2UuYm9keTtcblxuXHQvLyBkb24ndCBhbGxvdyBjbG9uaW5nIGEgdXNlZCBib2R5XG5cdGlmIChpbnN0YW5jZS5ib2R5VXNlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignY2Fubm90IGNsb25lIGJvZHkgYWZ0ZXIgaXQgaXMgdXNlZCcpO1xuXHR9XG5cblx0Ly8gY2hlY2sgdGhhdCBib2R5IGlzIGEgc3RyZWFtIGFuZCBub3QgZm9ybS1kYXRhIG9iamVjdFxuXHQvLyBub3RlOiB3ZSBjYW4ndCBjbG9uZSB0aGUgZm9ybS1kYXRhIG9iamVjdCB3aXRob3V0IGhhdmluZyBpdCBhcyBhIGRlcGVuZGVuY3lcblx0aWYgKGJvZHkgaW5zdGFuY2VvZiBTdHJlYW0gJiYgdHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgIT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyB0ZWUgaW5zdGFuY2UgYm9keVxuXHRcdHAxID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0cDIgPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRib2R5LnBpcGUocDEpO1xuXHRcdGJvZHkucGlwZShwMik7XG5cdFx0Ly8gc2V0IGluc3RhbmNlIGJvZHkgdG8gdGVlZCBib2R5IGFuZCByZXR1cm4gdGhlIG90aGVyIHRlZWQgYm9keVxuXHRcdGluc3RhbmNlW0lOVEVSTkFMU10uYm9keSA9IHAxO1xuXHRcdGJvZHkgPSBwMjtcblx0fVxuXG5cdHJldHVybiBib2R5O1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIHRoZSBvcGVyYXRpb24gXCJleHRyYWN0IGEgYENvbnRlbnQtVHlwZWAgdmFsdWUgZnJvbSB8b2JqZWN0fFwiIGFzXG4gKiBzcGVjaWZpZWQgaW4gdGhlIHNwZWNpZmljYXRpb246XG4gKiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5aW5pdC1leHRyYWN0XG4gKlxuICogVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgaW5zdGFuY2UuYm9keSBpcyBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSAgIE1peGVkICBpbnN0YW5jZSAgQW55IG9wdGlvbnMuYm9keSBpbnB1dFxuICovXG5mdW5jdGlvbiBleHRyYWN0Q29udGVudFR5cGUoYm9keSkge1xuXHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdC8vIGJvZHkgaXMgbnVsbFxuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuXHRcdC8vIGJvZHkgaXMgc3RyaW5nXG5cdFx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xuXHR9IGVsc2UgaWYgKGlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG5cdFx0Ly8gYm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRcdHJldHVybiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnO1xuXHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXHRcdC8vIGJvZHkgaXMgYmxvYlxuXHRcdHJldHVybiBib2R5LnR5cGUgfHwgbnVsbDtcblx0fSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChib2R5KSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJykge1xuXHRcdC8vIGJvZHkgaXMgQXJyYXlCdWZmZXJcblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIEFycmF5QnVmZmVyVmlld1xuXHRcdHJldHVybiBudWxsO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gZGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0XHRyZXR1cm4gYG11bHRpcGFydC9mb3JtLWRhdGE7Ym91bmRhcnk9JHtib2R5LmdldEJvdW5kYXJ5KCl9YDtcblx0fSBlbHNlIGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0Ly8gYm9keSBpcyBzdHJlYW1cblx0XHQvLyBjYW4ndCByZWFsbHkgZG8gbXVjaCBhYm91dCB0aGlzXG5cdFx0cmV0dXJuIG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQm9keSBjb25zdHJ1Y3RvciBkZWZhdWx0cyBvdGhlciB0aGluZ3MgdG8gc3RyaW5nXG5cdFx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xuXHR9XG59XG5cbi8qKlxuICogVGhlIEZldGNoIFN0YW5kYXJkIHRyZWF0cyB0aGlzIGFzIGlmIFwidG90YWwgYnl0ZXNcIiBpcyBhIHByb3BlcnR5IG9uIHRoZSBib2R5LlxuICogRm9yIHVzLCB3ZSBoYXZlIHRvIGV4cGxpY2l0bHkgZ2V0IGl0IHdpdGggYSBmdW5jdGlvbi5cbiAqXG4gKiByZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHktdG90YWwtYnl0ZXNcbiAqXG4gKiBAcGFyYW0gICBCb2R5ICAgIGluc3RhbmNlICAgSW5zdGFuY2Ugb2YgQm9keVxuICogQHJldHVybiAgTnVtYmVyPyAgICAgICAgICAgIE51bWJlciBvZiBieXRlcywgb3IgbnVsbCBpZiBub3QgcG9zc2libGVcbiAqL1xuZnVuY3Rpb24gZ2V0VG90YWxCeXRlcyhpbnN0YW5jZSkge1xuXHRjb25zdCBib2R5ID0gaW5zdGFuY2UuYm9keTtcblxuXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0Ly8gYm9keSBpcyBudWxsXG5cdFx0cmV0dXJuIDA7XG5cdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0cmV0dXJuIGJvZHkuc2l6ZTtcblx0fSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRcdHJldHVybiBib2R5Lmxlbmd0aDtcblx0fSBlbHNlIGlmIChib2R5ICYmIHR5cGVvZiBib2R5LmdldExlbmd0aFN5bmMgPT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyBkZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZVxuXHRcdGlmIChib2R5Ll9sZW5ndGhSZXRyaWV2ZXJzICYmIGJvZHkuX2xlbmd0aFJldHJpZXZlcnMubGVuZ3RoID09IDAgfHwgLy8gMS54XG5cdFx0Ym9keS5oYXNLbm93bkxlbmd0aCAmJiBib2R5Lmhhc0tub3duTGVuZ3RoKCkpIHtcblx0XHRcdC8vIDIueFxuXHRcdFx0cmV0dXJuIGJvZHkuZ2V0TGVuZ3RoU3luYygpO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fSBlbHNlIHtcblx0XHQvLyBib2R5IGlzIHN0cmVhbVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogV3JpdGUgYSBCb2R5IHRvIGEgTm9kZS5qcyBXcml0YWJsZVN0cmVhbSAoZS5nLiBodHRwLlJlcXVlc3QpIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gICBCb2R5ICAgIGluc3RhbmNlICAgSW5zdGFuY2Ugb2YgQm9keVxuICogQHJldHVybiAgVm9pZFxuICovXG5mdW5jdGlvbiB3cml0ZVRvU3RyZWFtKGRlc3QsIGluc3RhbmNlKSB7XG5cdGNvbnN0IGJvZHkgPSBpbnN0YW5jZS5ib2R5O1xuXG5cblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHQvLyBib2R5IGlzIG51bGxcblx0XHRkZXN0LmVuZCgpO1xuXHR9IGVsc2UgaWYgKGlzQmxvYihib2R5KSkge1xuXHRcdGJvZHkuc3RyZWFtKCkucGlwZShkZXN0KTtcblx0fSBlbHNlIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcblx0XHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRcdGRlc3Qud3JpdGUoYm9keSk7XG5cdFx0ZGVzdC5lbmQoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBib2R5IGlzIHN0cmVhbVxuXHRcdGJvZHkucGlwZShkZXN0KTtcblx0fVxufVxuXG4vLyBleHBvc2UgUHJvbWlzZVxuQm9keS5Qcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbi8qKlxuICogaGVhZGVycy5qc1xuICpcbiAqIEhlYWRlcnMgY2xhc3Mgb2ZmZXJzIGNvbnZlbmllbnQgaGVscGVyc1xuICovXG5cbmNvbnN0IGludmFsaWRUb2tlblJlZ2V4ID0gL1teXFxeX2BhLXpBLVpcXC0wLTkhIyQlJicqKy58fl0vO1xuY29uc3QgaW52YWxpZEhlYWRlckNoYXJSZWdleCA9IC9bXlxcdFxceDIwLVxceDdlXFx4ODAtXFx4ZmZdLztcblxuZnVuY3Rpb24gdmFsaWRhdGVOYW1lKG5hbWUpIHtcblx0bmFtZSA9IGAke25hbWV9YDtcblx0aWYgKGludmFsaWRUb2tlblJlZ2V4LnRlc3QobmFtZSkgfHwgbmFtZSA9PT0gJycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAke25hbWV9IGlzIG5vdCBhIGxlZ2FsIEhUVFAgaGVhZGVyIG5hbWVgKTtcblx0fVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVZhbHVlKHZhbHVlKSB7XG5cdHZhbHVlID0gYCR7dmFsdWV9YDtcblx0aWYgKGludmFsaWRIZWFkZXJDaGFyUmVnZXgudGVzdCh2YWx1ZSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGAke3ZhbHVlfSBpcyBub3QgYSBsZWdhbCBIVFRQIGhlYWRlciB2YWx1ZWApO1xuXHR9XG59XG5cbi8qKlxuICogRmluZCB0aGUga2V5IGluIHRoZSBtYXAgb2JqZWN0IGdpdmVuIGEgaGVhZGVyIG5hbWUuXG4gKlxuICogUmV0dXJucyB1bmRlZmluZWQgaWYgbm90IGZvdW5kLlxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAqIEByZXR1cm4gIFN0cmluZ3xVbmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gZmluZChtYXAsIG5hbWUpIHtcblx0bmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcblx0Zm9yIChjb25zdCBrZXkgaW4gbWFwKSB7XG5cdFx0aWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSBuYW1lKSB7XG5cdFx0XHRyZXR1cm4ga2V5O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5jb25zdCBNQVAgPSBTeW1ib2woJ21hcCcpO1xuY2xhc3MgSGVhZGVycyB7XG5cdC8qKlxuICAqIEhlYWRlcnMgY2xhc3NcbiAgKlxuICAqIEBwYXJhbSAgIE9iamVjdCAgaGVhZGVycyAgUmVzcG9uc2UgaGVhZGVyc1xuICAqIEByZXR1cm4gIFZvaWRcbiAgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bGV0IGluaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZDtcblxuXHRcdHRoaXNbTUFQXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0XHRpZiAoaW5pdCBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcblx0XHRcdGNvbnN0IHJhd0hlYWRlcnMgPSBpbml0LnJhdygpO1xuXHRcdFx0Y29uc3QgaGVhZGVyTmFtZXMgPSBPYmplY3Qua2V5cyhyYXdIZWFkZXJzKTtcblxuXHRcdFx0Zm9yIChjb25zdCBoZWFkZXJOYW1lIG9mIGhlYWRlck5hbWVzKSB7XG5cdFx0XHRcdGZvciAoY29uc3QgdmFsdWUgb2YgcmF3SGVhZGVyc1toZWFkZXJOYW1lXSkge1xuXHRcdFx0XHRcdHRoaXMuYXBwZW5kKGhlYWRlck5hbWUsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gV2UgZG9uJ3Qgd29ycnkgYWJvdXQgY29udmVydGluZyBwcm9wIHRvIEJ5dGVTdHJpbmcgaGVyZSBhcyBhcHBlbmQoKVxuXHRcdC8vIHdpbGwgaGFuZGxlIGl0LlxuXHRcdGlmIChpbml0ID09IG51bGwpIDsgZWxzZSBpZiAodHlwZW9mIGluaXQgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRjb25zdCBtZXRob2QgPSBpbml0W1N5bWJvbC5pdGVyYXRvcl07XG5cdFx0XHRpZiAobWV0aG9kICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdIZWFkZXIgcGFpcnMgbXVzdCBiZSBpdGVyYWJsZScpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc2VxdWVuY2U8c2VxdWVuY2U8Qnl0ZVN0cmluZz4+XG5cdFx0XHRcdC8vIE5vdGU6IHBlciBzcGVjIHdlIGhhdmUgdG8gZmlyc3QgZXhoYXVzdCB0aGUgbGlzdHMgdGhlbiBwcm9jZXNzIHRoZW1cblx0XHRcdFx0Y29uc3QgcGFpcnMgPSBbXTtcblx0XHRcdFx0Zm9yIChjb25zdCBwYWlyIG9mIGluaXQpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHBhaXIgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBwYWlyW1N5bWJvbC5pdGVyYXRvcl0gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0VhY2ggaGVhZGVyIHBhaXIgbXVzdCBiZSBpdGVyYWJsZScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwYWlycy5wdXNoKEFycmF5LmZyb20ocGFpcikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG5cdFx0XHRcdFx0aWYgKHBhaXIubGVuZ3RoICE9PSAyKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFYWNoIGhlYWRlciBwYWlyIG11c3QgYmUgYSBuYW1lL3ZhbHVlIHR1cGxlJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuYXBwZW5kKHBhaXJbMF0sIHBhaXJbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyByZWNvcmQ8Qnl0ZVN0cmluZywgQnl0ZVN0cmluZz5cblx0XHRcdFx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoaW5pdCkpIHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGluaXRba2V5XTtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZChrZXksIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm92aWRlZCBpbml0aWFsaXplciBtdXN0IGJlIGFuIG9iamVjdCcpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIFJldHVybiBjb21iaW5lZCBoZWFkZXIgdmFsdWUgZ2l2ZW4gbmFtZVxuICAqXG4gICogQHBhcmFtICAgU3RyaW5nICBuYW1lICBIZWFkZXIgbmFtZVxuICAqIEByZXR1cm4gIE1peGVkXG4gICovXG5cdGdldChuYW1lKSB7XG5cdFx0bmFtZSA9IGAke25hbWV9YDtcblx0XHR2YWxpZGF0ZU5hbWUobmFtZSk7XG5cdFx0Y29uc3Qga2V5ID0gZmluZCh0aGlzW01BUF0sIG5hbWUpO1xuXHRcdGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXNbTUFQXVtrZXldLmpvaW4oJywgJyk7XG5cdH1cblxuXHQvKipcbiAgKiBJdGVyYXRlIG92ZXIgYWxsIGhlYWRlcnNcbiAgKlxuICAqIEBwYXJhbSAgIEZ1bmN0aW9uICBjYWxsYmFjayAgRXhlY3V0ZWQgZm9yIGVhY2ggaXRlbSB3aXRoIHBhcmFtZXRlcnMgKHZhbHVlLCBuYW1lLCB0aGlzQXJnKVxuICAqIEBwYXJhbSAgIEJvb2xlYW4gICB0aGlzQXJnICAgYHRoaXNgIGNvbnRleHQgZm9yIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICogQHJldHVybiAgVm9pZFxuICAqL1xuXHRmb3JFYWNoKGNhbGxiYWNrKSB7XG5cdFx0bGV0IHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcblxuXHRcdGxldCBwYWlycyA9IGdldEhlYWRlcnModGhpcyk7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdHdoaWxlIChpIDwgcGFpcnMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgX3BhaXJzJGkgPSBwYWlyc1tpXTtcblx0XHRcdGNvbnN0IG5hbWUgPSBfcGFpcnMkaVswXSxcblx0XHRcdCAgICAgIHZhbHVlID0gX3BhaXJzJGlbMV07XG5cblx0XHRcdGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdmFsdWUsIG5hbWUsIHRoaXMpO1xuXHRcdFx0cGFpcnMgPSBnZXRIZWFkZXJzKHRoaXMpO1xuXHRcdFx0aSsrO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIE92ZXJ3cml0ZSBoZWFkZXIgdmFsdWVzIGdpdmVuIG5hbWVcbiAgKlxuICAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgIEhlYWRlciBuYW1lXG4gICogQHBhcmFtICAgU3RyaW5nICB2YWx1ZSAgSGVhZGVyIHZhbHVlXG4gICogQHJldHVybiAgVm9pZFxuICAqL1xuXHRzZXQobmFtZSwgdmFsdWUpIHtcblx0XHRuYW1lID0gYCR7bmFtZX1gO1xuXHRcdHZhbHVlID0gYCR7dmFsdWV9YDtcblx0XHR2YWxpZGF0ZU5hbWUobmFtZSk7XG5cdFx0dmFsaWRhdGVWYWx1ZSh2YWx1ZSk7XG5cdFx0Y29uc3Qga2V5ID0gZmluZCh0aGlzW01BUF0sIG5hbWUpO1xuXHRcdHRoaXNbTUFQXVtrZXkgIT09IHVuZGVmaW5lZCA/IGtleSA6IG5hbWVdID0gW3ZhbHVlXTtcblx0fVxuXG5cdC8qKlxuICAqIEFwcGVuZCBhIHZhbHVlIG9udG8gZXhpc3RpbmcgaGVhZGVyXG4gICpcbiAgKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgICBIZWFkZXIgbmFtZVxuICAqIEBwYXJhbSAgIFN0cmluZyAgdmFsdWUgIEhlYWRlciB2YWx1ZVxuICAqIEByZXR1cm4gIFZvaWRcbiAgKi9cblx0YXBwZW5kKG5hbWUsIHZhbHVlKSB7XG5cdFx0bmFtZSA9IGAke25hbWV9YDtcblx0XHR2YWx1ZSA9IGAke3ZhbHVlfWA7XG5cdFx0dmFsaWRhdGVOYW1lKG5hbWUpO1xuXHRcdHZhbGlkYXRlVmFsdWUodmFsdWUpO1xuXHRcdGNvbnN0IGtleSA9IGZpbmQodGhpc1tNQVBdLCBuYW1lKTtcblx0XHRpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXNbTUFQXVtrZXldLnB1c2godmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzW01BUF1bbmFtZV0gPSBbdmFsdWVdO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIENoZWNrIGZvciBoZWFkZXIgbmFtZSBleGlzdGVuY2VcbiAgKlxuICAqIEBwYXJhbSAgIFN0cmluZyAgIG5hbWUgIEhlYWRlciBuYW1lXG4gICogQHJldHVybiAgQm9vbGVhblxuICAqL1xuXHRoYXMobmFtZSkge1xuXHRcdG5hbWUgPSBgJHtuYW1lfWA7XG5cdFx0dmFsaWRhdGVOYW1lKG5hbWUpO1xuXHRcdHJldHVybiBmaW5kKHRoaXNbTUFQXSwgbmFtZSkgIT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuICAqIERlbGV0ZSBhbGwgaGVhZGVyIHZhbHVlcyBnaXZlbiBuYW1lXG4gICpcbiAgKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgIEhlYWRlciBuYW1lXG4gICogQHJldHVybiAgVm9pZFxuICAqL1xuXHRkZWxldGUobmFtZSkge1xuXHRcdG5hbWUgPSBgJHtuYW1lfWA7XG5cdFx0dmFsaWRhdGVOYW1lKG5hbWUpO1xuXHRcdGNvbnN0IGtleSA9IGZpbmQodGhpc1tNQVBdLCBuYW1lKTtcblx0XHRpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGRlbGV0ZSB0aGlzW01BUF1ba2V5XTtcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBSZXR1cm4gcmF3IGhlYWRlcnMgKG5vbi1zcGVjIGFwaSlcbiAgKlxuICAqIEByZXR1cm4gIE9iamVjdFxuICAqL1xuXHRyYXcoKSB7XG5cdFx0cmV0dXJuIHRoaXNbTUFQXTtcblx0fVxuXG5cdC8qKlxuICAqIEdldCBhbiBpdGVyYXRvciBvbiBrZXlzLlxuICAqXG4gICogQHJldHVybiAgSXRlcmF0b3JcbiAgKi9cblx0a2V5cygpIHtcblx0XHRyZXR1cm4gY3JlYXRlSGVhZGVyc0l0ZXJhdG9yKHRoaXMsICdrZXknKTtcblx0fVxuXG5cdC8qKlxuICAqIEdldCBhbiBpdGVyYXRvciBvbiB2YWx1ZXMuXG4gICpcbiAgKiBAcmV0dXJuICBJdGVyYXRvclxuICAqL1xuXHR2YWx1ZXMoKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUhlYWRlcnNJdGVyYXRvcih0aGlzLCAndmFsdWUnKTtcblx0fVxuXG5cdC8qKlxuICAqIEdldCBhbiBpdGVyYXRvciBvbiBlbnRyaWVzLlxuICAqXG4gICogVGhpcyBpcyB0aGUgZGVmYXVsdCBpdGVyYXRvciBvZiB0aGUgSGVhZGVycyBvYmplY3QuXG4gICpcbiAgKiBAcmV0dXJuICBJdGVyYXRvclxuICAqL1xuXHRbU3ltYm9sLml0ZXJhdG9yXSgpIHtcblx0XHRyZXR1cm4gY3JlYXRlSGVhZGVyc0l0ZXJhdG9yKHRoaXMsICdrZXkrdmFsdWUnKTtcblx0fVxufVxuSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShIZWFkZXJzLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG5cdHZhbHVlOiAnSGVhZGVycycsXG5cdHdyaXRhYmxlOiBmYWxzZSxcblx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEhlYWRlcnMucHJvdG90eXBlLCB7XG5cdGdldDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGZvckVhY2g6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRzZXQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRhcHBlbmQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRoYXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRkZWxldGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRrZXlzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0dmFsdWVzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0ZW50cmllczogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuXG5mdW5jdGlvbiBnZXRIZWFkZXJzKGhlYWRlcnMpIHtcblx0bGV0IGtpbmQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICdrZXkrdmFsdWUnO1xuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzW01BUF0pLnNvcnQoKTtcblx0cmV0dXJuIGtleXMubWFwKGtpbmQgPT09ICdrZXknID8gZnVuY3Rpb24gKGspIHtcblx0XHRyZXR1cm4gay50b0xvd2VyQ2FzZSgpO1xuXHR9IDoga2luZCA9PT0gJ3ZhbHVlJyA/IGZ1bmN0aW9uIChrKSB7XG5cdFx0cmV0dXJuIGhlYWRlcnNbTUFQXVtrXS5qb2luKCcsICcpO1xuXHR9IDogZnVuY3Rpb24gKGspIHtcblx0XHRyZXR1cm4gW2sudG9Mb3dlckNhc2UoKSwgaGVhZGVyc1tNQVBdW2tdLmpvaW4oJywgJyldO1xuXHR9KTtcbn1cblxuY29uc3QgSU5URVJOQUwgPSBTeW1ib2woJ2ludGVybmFsJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlcnNJdGVyYXRvcih0YXJnZXQsIGtpbmQpIHtcblx0Y29uc3QgaXRlcmF0b3IgPSBPYmplY3QuY3JlYXRlKEhlYWRlcnNJdGVyYXRvclByb3RvdHlwZSk7XG5cdGl0ZXJhdG9yW0lOVEVSTkFMXSA9IHtcblx0XHR0YXJnZXQsXG5cdFx0a2luZCxcblx0XHRpbmRleDogMFxuXHR9O1xuXHRyZXR1cm4gaXRlcmF0b3I7XG59XG5cbmNvbnN0IEhlYWRlcnNJdGVyYXRvclByb3RvdHlwZSA9IE9iamVjdC5zZXRQcm90b3R5cGVPZih7XG5cdG5leHQoKSB7XG5cdFx0Ly8gaXN0YW5idWwgaWdub3JlIGlmXG5cdFx0aWYgKCF0aGlzIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSAhPT0gSGVhZGVyc0l0ZXJhdG9yUHJvdG90eXBlKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBvZiBgdGhpc2AgaXMgbm90IGEgSGVhZGVyc0l0ZXJhdG9yJyk7XG5cdFx0fVxuXG5cdFx0dmFyIF9JTlRFUk5BTCA9IHRoaXNbSU5URVJOQUxdO1xuXHRcdGNvbnN0IHRhcmdldCA9IF9JTlRFUk5BTC50YXJnZXQsXG5cdFx0ICAgICAga2luZCA9IF9JTlRFUk5BTC5raW5kLFxuXHRcdCAgICAgIGluZGV4ID0gX0lOVEVSTkFMLmluZGV4O1xuXG5cdFx0Y29uc3QgdmFsdWVzID0gZ2V0SGVhZGVycyh0YXJnZXQsIGtpbmQpO1xuXHRcdGNvbnN0IGxlbiA9IHZhbHVlcy5sZW5ndGg7XG5cdFx0aWYgKGluZGV4ID49IGxlbikge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdFx0ZG9uZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMXS5pbmRleCA9IGluZGV4ICsgMTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogdmFsdWVzW2luZGV4XSxcblx0XHRcdGRvbmU6IGZhbHNlXG5cdFx0fTtcblx0fVxufSwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihbXVtTeW1ib2wuaXRlcmF0b3JdKCkpKSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShIZWFkZXJzSXRlcmF0b3JQcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuXHR2YWx1ZTogJ0hlYWRlcnNJdGVyYXRvcicsXG5cdHdyaXRhYmxlOiBmYWxzZSxcblx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogRXhwb3J0IHRoZSBIZWFkZXJzIG9iamVjdCBpbiBhIGZvcm0gdGhhdCBOb2RlLmpzIGNhbiBjb25zdW1lLlxuICpcbiAqIEBwYXJhbSAgIEhlYWRlcnMgIGhlYWRlcnNcbiAqIEByZXR1cm4gIE9iamVjdFxuICovXG5mdW5jdGlvbiBleHBvcnROb2RlQ29tcGF0aWJsZUhlYWRlcnMoaGVhZGVycykge1xuXHRjb25zdCBvYmogPSBPYmplY3QuYXNzaWduKHsgX19wcm90b19fOiBudWxsIH0sIGhlYWRlcnNbTUFQXSk7XG5cblx0Ly8gaHR0cC5yZXF1ZXN0KCkgb25seSBzdXBwb3J0cyBzdHJpbmcgYXMgSG9zdCBoZWFkZXIuIFRoaXMgaGFjayBtYWtlc1xuXHQvLyBzcGVjaWZ5aW5nIGN1c3RvbSBIb3N0IGhlYWRlciBwb3NzaWJsZS5cblx0Y29uc3QgaG9zdEhlYWRlcktleSA9IGZpbmQoaGVhZGVyc1tNQVBdLCAnSG9zdCcpO1xuXHRpZiAoaG9zdEhlYWRlcktleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0b2JqW2hvc3RIZWFkZXJLZXldID0gb2JqW2hvc3RIZWFkZXJLZXldWzBdO1xuXHR9XG5cblx0cmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBIZWFkZXJzIG9iamVjdCBmcm9tIGFuIG9iamVjdCBvZiBoZWFkZXJzLCBpZ25vcmluZyB0aG9zZSB0aGF0IGRvXG4gKiBub3QgY29uZm9ybSB0byBIVFRQIGdyYW1tYXIgcHJvZHVjdGlvbnMuXG4gKlxuICogQHBhcmFtICAgT2JqZWN0ICBvYmogIE9iamVjdCBvZiBoZWFkZXJzXG4gKiBAcmV0dXJuICBIZWFkZXJzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlcnNMZW5pZW50KG9iaikge1xuXHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcblx0Zm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5rZXlzKG9iaikpIHtcblx0XHRpZiAoaW52YWxpZFRva2VuUmVnZXgudGVzdChuYW1lKSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGlmIChBcnJheS5pc0FycmF5KG9ialtuYW1lXSkpIHtcblx0XHRcdGZvciAoY29uc3QgdmFsIG9mIG9ialtuYW1lXSkge1xuXHRcdFx0XHRpZiAoaW52YWxpZEhlYWRlckNoYXJSZWdleC50ZXN0KHZhbCkpIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaGVhZGVyc1tNQVBdW25hbWVdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRoZWFkZXJzW01BUF1bbmFtZV0gPSBbdmFsXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRoZWFkZXJzW01BUF1bbmFtZV0ucHVzaCh2YWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICghaW52YWxpZEhlYWRlckNoYXJSZWdleC50ZXN0KG9ialtuYW1lXSkpIHtcblx0XHRcdGhlYWRlcnNbTUFQXVtuYW1lXSA9IFtvYmpbbmFtZV1dO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaGVhZGVycztcbn1cblxuY29uc3QgSU5URVJOQUxTJDEgPSBTeW1ib2woJ1Jlc3BvbnNlIGludGVybmFscycpO1xuXG4vLyBmaXggYW4gaXNzdWUgd2hlcmUgXCJTVEFUVVNfQ09ERVNcIiBhcmVuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBTVEFUVVNfQ09ERVMgPSBodHRwLlNUQVRVU19DT0RFUztcblxuLyoqXG4gKiBSZXNwb25zZSBjbGFzc1xuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuY2xhc3MgUmVzcG9uc2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRsZXQgYm9keSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcblx0XHRsZXQgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cblx0XHRCb2R5LmNhbGwodGhpcywgYm9keSwgb3B0cyk7XG5cblx0XHRjb25zdCBzdGF0dXMgPSBvcHRzLnN0YXR1cyB8fCAyMDA7XG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdHMuaGVhZGVycyk7XG5cblx0XHRpZiAoYm9keSAhPSBudWxsICYmICFoZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpIHtcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZXh0cmFjdENvbnRlbnRUeXBlKGJvZHkpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTFMkMV0gPSB7XG5cdFx0XHR1cmw6IG9wdHMudXJsLFxuXHRcdFx0c3RhdHVzLFxuXHRcdFx0c3RhdHVzVGV4dDogb3B0cy5zdGF0dXNUZXh0IHx8IFNUQVRVU19DT0RFU1tzdGF0dXNdLFxuXHRcdFx0aGVhZGVycyxcblx0XHRcdGNvdW50ZXI6IG9wdHMuY291bnRlclxuXHRcdH07XG5cdH1cblxuXHRnZXQgdXJsKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS51cmwgfHwgJyc7XG5cdH1cblxuXHRnZXQgc3RhdHVzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS5zdGF0dXM7XG5cdH1cblxuXHQvKipcbiAgKiBDb252ZW5pZW5jZSBwcm9wZXJ0eSByZXByZXNlbnRpbmcgaWYgdGhlIHJlcXVlc3QgZW5kZWQgbm9ybWFsbHlcbiAgKi9cblx0Z2V0IG9rKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS5zdGF0dXMgPj0gMjAwICYmIHRoaXNbSU5URVJOQUxTJDFdLnN0YXR1cyA8IDMwMDtcblx0fVxuXG5cdGdldCByZWRpcmVjdGVkKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS5jb3VudGVyID4gMDtcblx0fVxuXG5cdGdldCBzdGF0dXNUZXh0KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQxXS5zdGF0dXNUZXh0O1xuXHR9XG5cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDFdLmhlYWRlcnM7XG5cdH1cblxuXHQvKipcbiAgKiBDbG9uZSB0aGlzIHJlc3BvbnNlXG4gICpcbiAgKiBAcmV0dXJuICBSZXNwb25zZVxuICAqL1xuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IFJlc3BvbnNlKGNsb25lKHRoaXMpLCB7XG5cdFx0XHR1cmw6IHRoaXMudXJsLFxuXHRcdFx0c3RhdHVzOiB0aGlzLnN0YXR1cyxcblx0XHRcdHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcblx0XHRcdGhlYWRlcnM6IHRoaXMuaGVhZGVycyxcblx0XHRcdG9rOiB0aGlzLm9rLFxuXHRcdFx0cmVkaXJlY3RlZDogdGhpcy5yZWRpcmVjdGVkXG5cdFx0fSk7XG5cdH1cbn1cblxuQm9keS5taXhJbihSZXNwb25zZS5wcm90b3R5cGUpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZXNwb25zZS5wcm90b3R5cGUsIHtcblx0dXJsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0c3RhdHVzOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0b2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRyZWRpcmVjdGVkOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0c3RhdHVzVGV4dDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGhlYWRlcnM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRjbG9uZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVzcG9uc2UucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcblx0dmFsdWU6ICdSZXNwb25zZScsXG5cdHdyaXRhYmxlOiBmYWxzZSxcblx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbmNvbnN0IElOVEVSTkFMUyQyID0gU3ltYm9sKCdSZXF1ZXN0IGludGVybmFscycpO1xuXG4vLyBmaXggYW4gaXNzdWUgd2hlcmUgXCJmb3JtYXRcIiwgXCJwYXJzZVwiIGFyZW4ndCBhIG5hbWVkIGV4cG9ydCBmb3Igbm9kZSA8MTBcbmNvbnN0IHBhcnNlX3VybCA9IFVybC5wYXJzZTtcbmNvbnN0IGZvcm1hdF91cmwgPSBVcmwuZm9ybWF0O1xuXG5jb25zdCBzdHJlYW1EZXN0cnVjdGlvblN1cHBvcnRlZCA9ICdkZXN0cm95JyBpbiBTdHJlYW0uUmVhZGFibGUucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgUmVxdWVzdC5cbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGlucHV0XG4gKiBAcmV0dXJuICBCb29sZWFuXG4gKi9cbmZ1bmN0aW9uIGlzUmVxdWVzdChpbnB1dCkge1xuXHRyZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgaW5wdXRbSU5URVJOQUxTJDJdID09PSAnb2JqZWN0Jztcbn1cblxuZnVuY3Rpb24gaXNBYm9ydFNpZ25hbChzaWduYWwpIHtcblx0Y29uc3QgcHJvdG8gPSBzaWduYWwgJiYgdHlwZW9mIHNpZ25hbCA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHNpZ25hbCk7XG5cdHJldHVybiAhIShwcm90byAmJiBwcm90by5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQWJvcnRTaWduYWwnKTtcbn1cblxuLyoqXG4gKiBSZXF1ZXN0IGNsYXNzXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICBpbnB1dCAgVXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgaW5pdCAgIEN1c3RvbSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmNsYXNzIFJlcXVlc3Qge1xuXHRjb25zdHJ1Y3RvcihpbnB1dCkge1xuXHRcdGxldCBpbml0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuXHRcdGxldCBwYXJzZWRVUkw7XG5cblx0XHQvLyBub3JtYWxpemUgaW5wdXRcblx0XHRpZiAoIWlzUmVxdWVzdChpbnB1dCkpIHtcblx0XHRcdGlmIChpbnB1dCAmJiBpbnB1dC5ocmVmKSB7XG5cdFx0XHRcdC8vIGluIG9yZGVyIHRvIHN1cHBvcnQgTm9kZS5qcycgVXJsIG9iamVjdHM7IHRob3VnaCBXSEFUV0cncyBVUkwgb2JqZWN0c1xuXHRcdFx0XHQvLyB3aWxsIGZhbGwgaW50byB0aGlzIGJyYW5jaCBhbHNvIChzaW5jZSB0aGVpciBgdG9TdHJpbmcoKWAgd2lsbCByZXR1cm5cblx0XHRcdFx0Ly8gYGhyZWZgIHByb3BlcnR5IGFueXdheSlcblx0XHRcdFx0cGFyc2VkVVJMID0gcGFyc2VfdXJsKGlucHV0LmhyZWYpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gY29lcmNlIGlucHV0IHRvIGEgc3RyaW5nIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHBhcnNlXG5cdFx0XHRcdHBhcnNlZFVSTCA9IHBhcnNlX3VybChgJHtpbnB1dH1gKTtcblx0XHRcdH1cblx0XHRcdGlucHV0ID0ge307XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcnNlZFVSTCA9IHBhcnNlX3VybChpbnB1dC51cmwpO1xuXHRcdH1cblxuXHRcdGxldCBtZXRob2QgPSBpbml0Lm1ldGhvZCB8fCBpbnB1dC5tZXRob2QgfHwgJ0dFVCc7XG5cdFx0bWV0aG9kID0gbWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cblx0XHRpZiAoKGluaXQuYm9keSAhPSBudWxsIHx8IGlzUmVxdWVzdChpbnB1dCkgJiYgaW5wdXQuYm9keSAhPT0gbnVsbCkgJiYgKG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnSEVBRCcpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdSZXF1ZXN0IHdpdGggR0VUL0hFQUQgbWV0aG9kIGNhbm5vdCBoYXZlIGJvZHknKTtcblx0XHR9XG5cblx0XHRsZXQgaW5wdXRCb2R5ID0gaW5pdC5ib2R5ICE9IG51bGwgPyBpbml0LmJvZHkgOiBpc1JlcXVlc3QoaW5wdXQpICYmIGlucHV0LmJvZHkgIT09IG51bGwgPyBjbG9uZShpbnB1dCkgOiBudWxsO1xuXG5cdFx0Qm9keS5jYWxsKHRoaXMsIGlucHV0Qm9keSwge1xuXHRcdFx0dGltZW91dDogaW5pdC50aW1lb3V0IHx8IGlucHV0LnRpbWVvdXQgfHwgMCxcblx0XHRcdHNpemU6IGluaXQuc2l6ZSB8fCBpbnB1dC5zaXplIHx8IDBcblx0XHR9KTtcblxuXHRcdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbml0LmhlYWRlcnMgfHwgaW5wdXQuaGVhZGVycyB8fCB7fSk7XG5cblx0XHRpZiAoaW5wdXRCb2R5ICE9IG51bGwgJiYgIWhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSkge1xuXHRcdFx0Y29uc3QgY29udGVudFR5cGUgPSBleHRyYWN0Q29udGVudFR5cGUoaW5wdXRCb2R5KTtcblx0XHRcdGlmIChjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBzaWduYWwgPSBpc1JlcXVlc3QoaW5wdXQpID8gaW5wdXQuc2lnbmFsIDogbnVsbDtcblx0XHRpZiAoJ3NpZ25hbCcgaW4gaW5pdCkgc2lnbmFsID0gaW5pdC5zaWduYWw7XG5cblx0XHRpZiAoc2lnbmFsICE9IG51bGwgJiYgIWlzQWJvcnRTaWduYWwoc2lnbmFsKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgc2lnbmFsIHRvIGJlIGFuIGluc3RhbmNlb2YgQWJvcnRTaWduYWwnKTtcblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMUyQyXSA9IHtcblx0XHRcdG1ldGhvZCxcblx0XHRcdHJlZGlyZWN0OiBpbml0LnJlZGlyZWN0IHx8IGlucHV0LnJlZGlyZWN0IHx8ICdmb2xsb3cnLFxuXHRcdFx0aGVhZGVycyxcblx0XHRcdHBhcnNlZFVSTCxcblx0XHRcdHNpZ25hbFxuXHRcdH07XG5cblx0XHQvLyBub2RlLWZldGNoLW9ubHkgb3B0aW9uc1xuXHRcdHRoaXMuZm9sbG93ID0gaW5pdC5mb2xsb3cgIT09IHVuZGVmaW5lZCA/IGluaXQuZm9sbG93IDogaW5wdXQuZm9sbG93ICE9PSB1bmRlZmluZWQgPyBpbnB1dC5mb2xsb3cgOiAyMDtcblx0XHR0aGlzLmNvbXByZXNzID0gaW5pdC5jb21wcmVzcyAhPT0gdW5kZWZpbmVkID8gaW5pdC5jb21wcmVzcyA6IGlucHV0LmNvbXByZXNzICE9PSB1bmRlZmluZWQgPyBpbnB1dC5jb21wcmVzcyA6IHRydWU7XG5cdFx0dGhpcy5jb3VudGVyID0gaW5pdC5jb3VudGVyIHx8IGlucHV0LmNvdW50ZXIgfHwgMDtcblx0XHR0aGlzLmFnZW50ID0gaW5pdC5hZ2VudCB8fCBpbnB1dC5hZ2VudDtcblx0fVxuXG5cdGdldCBtZXRob2QoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLm1ldGhvZDtcblx0fVxuXG5cdGdldCB1cmwoKSB7XG5cdFx0cmV0dXJuIGZvcm1hdF91cmwodGhpc1tJTlRFUk5BTFMkMl0ucGFyc2VkVVJMKTtcblx0fVxuXG5cdGdldCBoZWFkZXJzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQyXS5oZWFkZXJzO1xuXHR9XG5cblx0Z2V0IHJlZGlyZWN0KCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMUyQyXS5yZWRpcmVjdDtcblx0fVxuXG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTJDJdLnNpZ25hbDtcblx0fVxuXG5cdC8qKlxuICAqIENsb25lIHRoaXMgcmVxdWVzdFxuICAqXG4gICogQHJldHVybiAgUmVxdWVzdFxuICAqL1xuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IFJlcXVlc3QodGhpcyk7XG5cdH1cbn1cblxuQm9keS5taXhJbihSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZXF1ZXN0LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG5cdHZhbHVlOiAnUmVxdWVzdCcsXG5cdHdyaXRhYmxlOiBmYWxzZSxcblx0ZW51bWVyYWJsZTogZmFsc2UsXG5cdGNvbmZpZ3VyYWJsZTogdHJ1ZVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFJlcXVlc3QucHJvdG90eXBlLCB7XG5cdG1ldGhvZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdHVybDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGhlYWRlcnM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuXHRyZWRpcmVjdDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG5cdGNsb25lOiB7IGVudW1lcmFibGU6IHRydWUgfSxcblx0c2lnbmFsOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5cbi8qKlxuICogQ29udmVydCBhIFJlcXVlc3QgdG8gTm9kZS5qcyBodHRwIHJlcXVlc3Qgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gICBSZXF1ZXN0ICBBIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEByZXR1cm4gIE9iamVjdCAgIFRoZSBvcHRpb25zIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gaHR0cC5yZXF1ZXN0XG4gKi9cbmZ1bmN0aW9uIGdldE5vZGVSZXF1ZXN0T3B0aW9ucyhyZXF1ZXN0KSB7XG5cdGNvbnN0IHBhcnNlZFVSTCA9IHJlcXVlc3RbSU5URVJOQUxTJDJdLnBhcnNlZFVSTDtcblx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHJlcXVlc3RbSU5URVJOQUxTJDJdLmhlYWRlcnMpO1xuXG5cdC8vIGZldGNoIHN0ZXAgMS4zXG5cdGlmICghaGVhZGVycy5oYXMoJ0FjY2VwdCcpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdCcsICcqLyonKTtcblx0fVxuXG5cdC8vIEJhc2ljIGZldGNoXG5cdGlmICghcGFyc2VkVVJMLnByb3RvY29sIHx8ICFwYXJzZWRVUkwuaG9zdG5hbWUpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPbmx5IGFic29sdXRlIFVSTHMgYXJlIHN1cHBvcnRlZCcpO1xuXHR9XG5cblx0aWYgKCEvXmh0dHBzPzokLy50ZXN0KHBhcnNlZFVSTC5wcm90b2NvbCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPbmx5IEhUVFAoUykgcHJvdG9jb2xzIGFyZSBzdXBwb3J0ZWQnKTtcblx0fVxuXG5cdGlmIChyZXF1ZXN0LnNpZ25hbCAmJiByZXF1ZXN0LmJvZHkgaW5zdGFuY2VvZiBTdHJlYW0uUmVhZGFibGUgJiYgIXN0cmVhbURlc3RydWN0aW9uU3VwcG9ydGVkKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5jZWxsYXRpb24gb2Ygc3RyZWFtZWQgcmVxdWVzdHMgd2l0aCBBYm9ydFNpZ25hbCBpcyBub3Qgc3VwcG9ydGVkIGluIG5vZGUgPCA4Jyk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmstb3ItY2FjaGUgZmV0Y2ggc3RlcHMgMi40LTIuN1xuXHRsZXQgY29udGVudExlbmd0aFZhbHVlID0gbnVsbDtcblx0aWYgKHJlcXVlc3QuYm9keSA9PSBudWxsICYmIC9eKFBPU1R8UFVUKSQvaS50ZXN0KHJlcXVlc3QubWV0aG9kKSkge1xuXHRcdGNvbnRlbnRMZW5ndGhWYWx1ZSA9ICcwJztcblx0fVxuXHRpZiAocmVxdWVzdC5ib2R5ICE9IG51bGwpIHtcblx0XHRjb25zdCB0b3RhbEJ5dGVzID0gZ2V0VG90YWxCeXRlcyhyZXF1ZXN0KTtcblx0XHRpZiAodHlwZW9mIHRvdGFsQnl0ZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHRjb250ZW50TGVuZ3RoVmFsdWUgPSBTdHJpbmcodG90YWxCeXRlcyk7XG5cdFx0fVxuXHR9XG5cdGlmIChjb250ZW50TGVuZ3RoVmFsdWUpIHtcblx0XHRoZWFkZXJzLnNldCgnQ29udGVudC1MZW5ndGgnLCBjb250ZW50TGVuZ3RoVmFsdWUpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xMVxuXHRpZiAoIWhlYWRlcnMuaGFzKCdVc2VyLUFnZW50JykpIHtcblx0XHRoZWFkZXJzLnNldCgnVXNlci1BZ2VudCcsICdub2RlLWZldGNoLzEuMCAoK2h0dHBzOi8vZ2l0aHViLmNvbS9iaXRpbm4vbm9kZS1mZXRjaCknKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwIDIuMTVcblx0aWYgKHJlcXVlc3QuY29tcHJlc3MgJiYgIWhlYWRlcnMuaGFzKCdBY2NlcHQtRW5jb2RpbmcnKSkge1xuXHRcdGhlYWRlcnMuc2V0KCdBY2NlcHQtRW5jb2RpbmcnLCAnZ3ppcCxkZWZsYXRlJyk7XG5cdH1cblxuXHRsZXQgYWdlbnQgPSByZXF1ZXN0LmFnZW50O1xuXHRpZiAodHlwZW9mIGFnZW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0YWdlbnQgPSBhZ2VudChwYXJzZWRVUkwpO1xuXHR9XG5cblx0aWYgKCFoZWFkZXJzLmhhcygnQ29ubmVjdGlvbicpICYmICFhZ2VudCkge1xuXHRcdGhlYWRlcnMuc2V0KCdDb25uZWN0aW9uJywgJ2Nsb3NlJyk7XG5cdH1cblxuXHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCA0LjJcblx0Ly8gY2h1bmtlZCBlbmNvZGluZyBpcyBoYW5kbGVkIGJ5IE5vZGUuanNcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcGFyc2VkVVJMLCB7XG5cdFx0bWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcblx0XHRoZWFkZXJzOiBleHBvcnROb2RlQ29tcGF0aWJsZUhlYWRlcnMoaGVhZGVycyksXG5cdFx0YWdlbnRcblx0fSk7XG59XG5cbi8qKlxuICogYWJvcnQtZXJyb3IuanNcbiAqXG4gKiBBYm9ydEVycm9yIGludGVyZmFjZSBmb3IgY2FuY2VsbGVkIHJlcXVlc3RzXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgQWJvcnRFcnJvciBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIG1lc3NhZ2UgICAgICBFcnJvciBtZXNzYWdlIGZvciBodW1hblxuICogQHJldHVybiAgQWJvcnRFcnJvclxuICovXG5mdW5jdGlvbiBBYm9ydEVycm9yKG1lc3NhZ2UpIHtcbiAgRXJyb3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICB0aGlzLnR5cGUgPSAnYWJvcnRlZCc7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cbiAgLy8gaGlkZSBjdXN0b20gZXJyb3IgaW1wbGVtZW50YXRpb24gZGV0YWlscyBmcm9tIGVuZC11c2Vyc1xuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbn1cblxuQWJvcnRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5BYm9ydEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFib3J0RXJyb3I7XG5BYm9ydEVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0Fib3J0RXJyb3InO1xuXG4vLyBmaXggYW4gaXNzdWUgd2hlcmUgXCJQYXNzVGhyb3VnaFwiLCBcInJlc29sdmVcIiBhcmVuJ3QgYSBuYW1lZCBleHBvcnQgZm9yIG5vZGUgPDEwXG5jb25zdCBQYXNzVGhyb3VnaCQxID0gU3RyZWFtLlBhc3NUaHJvdWdoO1xuY29uc3QgcmVzb2x2ZV91cmwgPSBVcmwucmVzb2x2ZTtcblxuLyoqXG4gKiBGZXRjaCBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgIHVybCAgIEFic29sdXRlIHVybCBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICBPYmplY3QgICBvcHRzICBGZXRjaCBvcHRpb25zXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbmZ1bmN0aW9uIGZldGNoKHVybCwgb3B0cykge1xuXG5cdC8vIGFsbG93IGN1c3RvbSBwcm9taXNlXG5cdGlmICghZmV0Y2guUHJvbWlzZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignbmF0aXZlIHByb21pc2UgbWlzc2luZywgc2V0IGZldGNoLlByb21pc2UgdG8geW91ciBmYXZvcml0ZSBhbHRlcm5hdGl2ZScpO1xuXHR9XG5cblx0Qm9keS5Qcm9taXNlID0gZmV0Y2guUHJvbWlzZTtcblxuXHQvLyB3cmFwIGh0dHAucmVxdWVzdCBpbnRvIGZldGNoXG5cdHJldHVybiBuZXcgZmV0Y2guUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Ly8gYnVpbGQgcmVxdWVzdCBvYmplY3Rcblx0XHRjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCBvcHRzKTtcblx0XHRjb25zdCBvcHRpb25zID0gZ2V0Tm9kZVJlcXVlc3RPcHRpb25zKHJlcXVlc3QpO1xuXG5cdFx0Y29uc3Qgc2VuZCA9IChvcHRpb25zLnByb3RvY29sID09PSAnaHR0cHM6JyA/IGh0dHBzIDogaHR0cCkucmVxdWVzdDtcblx0XHRjb25zdCBzaWduYWwgPSByZXF1ZXN0LnNpZ25hbDtcblxuXHRcdGxldCByZXNwb25zZSA9IG51bGw7XG5cblx0XHRjb25zdCBhYm9ydCA9IGZ1bmN0aW9uIGFib3J0KCkge1xuXHRcdFx0bGV0IGVycm9yID0gbmV3IEFib3J0RXJyb3IoJ1RoZSB1c2VyIGFib3J0ZWQgYSByZXF1ZXN0LicpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdGlmIChyZXF1ZXN0LmJvZHkgJiYgcmVxdWVzdC5ib2R5IGluc3RhbmNlb2YgU3RyZWFtLlJlYWRhYmxlKSB7XG5cdFx0XHRcdHJlcXVlc3QuYm9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdH1cblx0XHRcdGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmJvZHkpIHJldHVybjtcblx0XHRcdHJlc3BvbnNlLmJvZHkuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cdFx0fTtcblxuXHRcdGlmIChzaWduYWwgJiYgc2lnbmFsLmFib3J0ZWQpIHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWJvcnRBbmRGaW5hbGl6ZSA9IGZ1bmN0aW9uIGFib3J0QW5kRmluYWxpemUoKSB7XG5cdFx0XHRhYm9ydCgpO1xuXHRcdFx0ZmluYWxpemUoKTtcblx0XHR9O1xuXG5cdFx0Ly8gc2VuZCByZXF1ZXN0XG5cdFx0Y29uc3QgcmVxID0gc2VuZChvcHRpb25zKTtcblx0XHRsZXQgcmVxVGltZW91dDtcblxuXHRcdGlmIChzaWduYWwpIHtcblx0XHRcdHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpbmFsaXplKCkge1xuXHRcdFx0cmVxLmFib3J0KCk7XG5cdFx0XHRpZiAoc2lnbmFsKSBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdGNsZWFyVGltZW91dChyZXFUaW1lb3V0KTtcblx0XHR9XG5cblx0XHRpZiAocmVxdWVzdC50aW1lb3V0KSB7XG5cdFx0XHRyZXEub25jZSgnc29ja2V0JywgZnVuY3Rpb24gKHNvY2tldCkge1xuXHRcdFx0XHRyZXFUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGBuZXR3b3JrIHRpbWVvdXQgYXQ6ICR7cmVxdWVzdC51cmx9YCwgJ3JlcXVlc3QtdGltZW91dCcpKTtcblx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHR9LCByZXF1ZXN0LnRpbWVvdXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmVxLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgcmVxdWVzdCB0byAke3JlcXVlc3QudXJsfSBmYWlsZWQsIHJlYXNvbjogJHtlcnIubWVzc2FnZX1gLCAnc3lzdGVtJywgZXJyKSk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0cmVxLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdGNsZWFyVGltZW91dChyZXFUaW1lb3V0KTtcblxuXHRcdFx0Y29uc3QgaGVhZGVycyA9IGNyZWF0ZUhlYWRlcnNMZW5pZW50KHJlcy5oZWFkZXJzKTtcblxuXHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDVcblx0XHRcdGlmIChmZXRjaC5pc1JlZGlyZWN0KHJlcy5zdGF0dXNDb2RlKSkge1xuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS4yXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gaGVhZGVycy5nZXQoJ0xvY2F0aW9uJyk7XG5cblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuM1xuXHRcdFx0XHRjb25zdCBsb2NhdGlvblVSTCA9IGxvY2F0aW9uID09PSBudWxsID8gbnVsbCA6IHJlc29sdmVfdXJsKHJlcXVlc3QudXJsLCBsb2NhdGlvbik7XG5cblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuNVxuXHRcdFx0XHRzd2l0Y2ggKHJlcXVlc3QucmVkaXJlY3QpIHtcblx0XHRcdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYHJlZGlyZWN0IG1vZGUgaXMgc2V0IHRvIGVycm9yOiAke3JlcXVlc3QudXJsfWAsICduby1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Y2FzZSAnbWFudWFsJzpcblx0XHRcdFx0XHRcdC8vIG5vZGUtZmV0Y2gtc3BlY2lmaWMgc3RlcDogbWFrZSBtYW51YWwgcmVkaXJlY3QgYSBiaXQgZWFzaWVyIHRvIHVzZSBieSBzZXR0aW5nIHRoZSBMb2NhdGlvbiBoZWFkZXIgdmFsdWUgdG8gdGhlIHJlc29sdmVkIFVSTC5cblx0XHRcdFx0XHRcdGlmIChsb2NhdGlvblVSTCAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHQvLyBoYW5kbGUgY29ycnVwdGVkIGhlYWRlclxuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGhlYWRlcnMuc2V0KCdMb2NhdGlvbicsIGxvY2F0aW9uVVJMKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gaXN0YW5idWwgaWdub3JlIG5leHQ6IG5vZGVqcyBzZXJ2ZXIgcHJldmVudCBpbnZhbGlkIHJlc3BvbnNlIGhlYWRlcnMsIHdlIGNhbid0IHRlc3QgdGhpcyB0aHJvdWdoIG5vcm1hbCByZXF1ZXN0XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2ZvbGxvdyc6XG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMlxuXHRcdFx0XHRcdFx0aWYgKGxvY2F0aW9uVVJMID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgNVxuXHRcdFx0XHRcdFx0aWYgKHJlcXVlc3QuY291bnRlciA+PSByZXF1ZXN0LmZvbGxvdykge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoYG1heGltdW0gcmVkaXJlY3QgcmVhY2hlZCBhdDogJHtyZXF1ZXN0LnVybH1gLCAnbWF4LXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA2IChjb3VudGVyIGluY3JlbWVudClcblx0XHRcdFx0XHRcdC8vIENyZWF0ZSBhIG5ldyBSZXF1ZXN0IG9iamVjdC5cblx0XHRcdFx0XHRcdGNvbnN0IHJlcXVlc3RPcHRzID0ge1xuXHRcdFx0XHRcdFx0XHRoZWFkZXJzOiBuZXcgSGVhZGVycyhyZXF1ZXN0LmhlYWRlcnMpLFxuXHRcdFx0XHRcdFx0XHRmb2xsb3c6IHJlcXVlc3QuZm9sbG93LFxuXHRcdFx0XHRcdFx0XHRjb3VudGVyOiByZXF1ZXN0LmNvdW50ZXIgKyAxLFxuXHRcdFx0XHRcdFx0XHRhZ2VudDogcmVxdWVzdC5hZ2VudCxcblx0XHRcdFx0XHRcdFx0Y29tcHJlc3M6IHJlcXVlc3QuY29tcHJlc3MsXG5cdFx0XHRcdFx0XHRcdG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG5cdFx0XHRcdFx0XHRcdGJvZHk6IHJlcXVlc3QuYm9keSxcblx0XHRcdFx0XHRcdFx0c2lnbmFsOiByZXF1ZXN0LnNpZ25hbCxcblx0XHRcdFx0XHRcdFx0dGltZW91dDogcmVxdWVzdC50aW1lb3V0XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgOVxuXHRcdFx0XHRcdFx0aWYgKHJlcy5zdGF0dXNDb2RlICE9PSAzMDMgJiYgcmVxdWVzdC5ib2R5ICYmIGdldFRvdGFsQnl0ZXMocmVxdWVzdCkgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdDYW5ub3QgZm9sbG93IHJlZGlyZWN0IHdpdGggYm9keSBiZWluZyBhIHJlYWRhYmxlIHN0cmVhbScsICd1bnN1cHBvcnRlZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTFcblx0XHRcdFx0XHRcdGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMzAzIHx8IChyZXMuc3RhdHVzQ29kZSA9PT0gMzAxIHx8IHJlcy5zdGF0dXNDb2RlID09PSAzMDIpICYmIHJlcXVlc3QubWV0aG9kID09PSAnUE9TVCcpIHtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdHMubWV0aG9kID0gJ0dFVCc7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRzLmJvZHkgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdHJlcXVlc3RPcHRzLmhlYWRlcnMuZGVsZXRlKCdjb250ZW50LWxlbmd0aCcpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTVcblx0XHRcdFx0XHRcdHJlc29sdmUoZmV0Y2gobmV3IFJlcXVlc3QobG9jYXRpb25VUkwsIHJlcXVlc3RPcHRzKSkpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBwcmVwYXJlIHJlc3BvbnNlXG5cdFx0XHRyZXMub25jZSgnZW5kJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoc2lnbmFsKSBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdH0pO1xuXHRcdFx0bGV0IGJvZHkgPSByZXMucGlwZShuZXcgUGFzc1Rocm91Z2gkMSgpKTtcblxuXHRcdFx0Y29uc3QgcmVzcG9uc2Vfb3B0aW9ucyA9IHtcblx0XHRcdFx0dXJsOiByZXF1ZXN0LnVybCxcblx0XHRcdFx0c3RhdHVzOiByZXMuc3RhdHVzQ29kZSxcblx0XHRcdFx0c3RhdHVzVGV4dDogcmVzLnN0YXR1c01lc3NhZ2UsXG5cdFx0XHRcdGhlYWRlcnM6IGhlYWRlcnMsXG5cdFx0XHRcdHNpemU6IHJlcXVlc3Quc2l6ZSxcblx0XHRcdFx0dGltZW91dDogcmVxdWVzdC50aW1lb3V0LFxuXHRcdFx0XHRjb3VudGVyOiByZXF1ZXN0LmNvdW50ZXJcblx0XHRcdH07XG5cblx0XHRcdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDEyLjEuMS4zXG5cdFx0XHRjb25zdCBjb2RpbmdzID0gaGVhZGVycy5nZXQoJ0NvbnRlbnQtRW5jb2RpbmcnKTtcblxuXHRcdFx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgMTIuMS4xLjQ6IGhhbmRsZSBjb250ZW50IGNvZGluZ3NcblxuXHRcdFx0Ly8gaW4gZm9sbG93aW5nIHNjZW5hcmlvcyB3ZSBpZ25vcmUgY29tcHJlc3Npb24gc3VwcG9ydFxuXHRcdFx0Ly8gMS4gY29tcHJlc3Npb24gc3VwcG9ydCBpcyBkaXNhYmxlZFxuXHRcdFx0Ly8gMi4gSEVBRCByZXF1ZXN0XG5cdFx0XHQvLyAzLiBubyBDb250ZW50LUVuY29kaW5nIGhlYWRlclxuXHRcdFx0Ly8gNC4gbm8gY29udGVudCByZXNwb25zZSAoMjA0KVxuXHRcdFx0Ly8gNS4gY29udGVudCBub3QgbW9kaWZpZWQgcmVzcG9uc2UgKDMwNClcblx0XHRcdGlmICghcmVxdWVzdC5jb21wcmVzcyB8fCByZXF1ZXN0Lm1ldGhvZCA9PT0gJ0hFQUQnIHx8IGNvZGluZ3MgPT09IG51bGwgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDIwNCB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMzA0KSB7XG5cdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgTm9kZSB2Nitcblx0XHRcdC8vIEJlIGxlc3Mgc3RyaWN0IHdoZW4gZGVjb2RpbmcgY29tcHJlc3NlZCByZXNwb25zZXMsIHNpbmNlIHNvbWV0aW1lc1xuXHRcdFx0Ly8gc2VydmVycyBzZW5kIHNsaWdodGx5IGludmFsaWQgcmVzcG9uc2VzIHRoYXQgYXJlIHN0aWxsIGFjY2VwdGVkXG5cdFx0XHQvLyBieSBjb21tb24gYnJvd3NlcnMuXG5cdFx0XHQvLyBBbHdheXMgdXNpbmcgWl9TWU5DX0ZMVVNIIGlzIHdoYXQgY1VSTCBkb2VzLlxuXHRcdFx0Y29uc3QgemxpYk9wdGlvbnMgPSB7XG5cdFx0XHRcdGZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSCxcblx0XHRcdFx0ZmluaXNoRmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNIXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBmb3IgZ3ppcFxuXHRcdFx0aWYgKGNvZGluZ3MgPT0gJ2d6aXAnIHx8IGNvZGluZ3MgPT0gJ3gtZ3ppcCcpIHtcblx0XHRcdFx0Ym9keSA9IGJvZHkucGlwZSh6bGliLmNyZWF0ZUd1bnppcCh6bGliT3B0aW9ucykpO1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZm9yIGRlZmxhdGVcblx0XHRcdGlmIChjb2RpbmdzID09ICdkZWZsYXRlJyB8fCBjb2RpbmdzID09ICd4LWRlZmxhdGUnKSB7XG5cdFx0XHRcdC8vIGhhbmRsZSB0aGUgaW5mYW1vdXMgcmF3IGRlZmxhdGUgcmVzcG9uc2UgZnJvbSBvbGQgc2VydmVyc1xuXHRcdFx0XHQvLyBhIGhhY2sgZm9yIG9sZCBJSVMgYW5kIEFwYWNoZSBzZXJ2ZXJzXG5cdFx0XHRcdGNvbnN0IHJhdyA9IHJlcy5waXBlKG5ldyBQYXNzVGhyb3VnaCQxKCkpO1xuXHRcdFx0XHRyYXcub25jZSgnZGF0YScsIGZ1bmN0aW9uIChjaHVuaykge1xuXHRcdFx0XHRcdC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM3NTE5ODI4XG5cdFx0XHRcdFx0aWYgKChjaHVua1swXSAmIDB4MEYpID09PSAweDA4KSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlSW5mbGF0ZSgpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym9keSA9IGJvZHkucGlwZSh6bGliLmNyZWF0ZUluZmxhdGVSYXcoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmb3IgYnJcblx0XHRcdGlmIChjb2RpbmdzID09ICdicicgJiYgdHlwZW9mIHpsaWIuY3JlYXRlQnJvdGxpRGVjb21wcmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlQnJvdGxpRGVjb21wcmVzcygpKTtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIG90aGVyd2lzZSwgdXNlIHJlc3BvbnNlIGFzLWlzXG5cdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdHJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pO1xuXG5cdFx0d3JpdGVUb1N0cmVhbShyZXEsIHJlcXVlc3QpO1xuXHR9KTtcbn1cbi8qKlxuICogUmVkaXJlY3QgY29kZSBtYXRjaGluZ1xuICpcbiAqIEBwYXJhbSAgIE51bWJlciAgIGNvZGUgIFN0YXR1cyBjb2RlXG4gKiBAcmV0dXJuICBCb29sZWFuXG4gKi9cbmZldGNoLmlzUmVkaXJlY3QgPSBmdW5jdGlvbiAoY29kZSkge1xuXHRyZXR1cm4gY29kZSA9PT0gMzAxIHx8IGNvZGUgPT09IDMwMiB8fCBjb2RlID09PSAzMDMgfHwgY29kZSA9PT0gMzA3IHx8IGNvZGUgPT09IDMwODtcbn07XG5cbi8vIGV4cG9zZSBQcm9taXNlXG5mZXRjaC5Qcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbmZ1bmN0aW9uIGdldF9wYWdlX2hhbmRsZXIoXG5cdG1hbmlmZXN0LFxuXHRzZXNzaW9uX2dldHRlclxuKSB7XG5cdGNvbnN0IGdldF9idWlsZF9pbmZvID0gZGV2XG5cdFx0PyAoKSA9PiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYnVpbGRfZGlyLCAnYnVpbGQuanNvbicpLCAndXRmLTgnKSlcblx0XHQ6IChhc3NldHMgPT4gKCkgPT4gYXNzZXRzKShKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYnVpbGRfZGlyLCAnYnVpbGQuanNvbicpLCAndXRmLTgnKSkpO1xuXG5cdGNvbnN0IHRlbXBsYXRlID0gZGV2XG5cdFx0PyAoKSA9PiByZWFkX3RlbXBsYXRlKHNyY19kaXIpXG5cdFx0OiAoc3RyID0+ICgpID0+IHN0cikocmVhZF90ZW1wbGF0ZShidWlsZF9kaXIpKTtcblxuXHRjb25zdCBoYXNfc2VydmljZV93b3JrZXIgPSBmcy5leGlzdHNTeW5jKHBhdGguam9pbihidWlsZF9kaXIsICdzZXJ2aWNlLXdvcmtlci5qcycpKTtcblxuXHRjb25zdCB7IHNlcnZlcl9yb3V0ZXMsIHBhZ2VzIH0gPSBtYW5pZmVzdDtcblx0Y29uc3QgZXJyb3Jfcm91dGUgPSBtYW5pZmVzdC5lcnJvcjtcblxuXHRmdW5jdGlvbiBiYWlsKHJlcSwgcmVzLCBlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cblx0XHRjb25zdCBtZXNzYWdlID0gZGV2ID8gZXNjYXBlX2h0bWwoZXJyLm1lc3NhZ2UpIDogJ0ludGVybmFsIHNlcnZlciBlcnJvcic7XG5cblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwMDtcblx0XHRyZXMuZW5kKGA8cHJlPiR7bWVzc2FnZX08L3ByZT5gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZV9lcnJvcihyZXEsIHJlcywgc3RhdHVzQ29kZSwgZXJyb3IpIHtcblx0XHRoYW5kbGVfcGFnZSh7XG5cdFx0XHRwYXR0ZXJuOiBudWxsLFxuXHRcdFx0cGFydHM6IFtcblx0XHRcdFx0eyBuYW1lOiBudWxsLCBjb21wb25lbnQ6IGVycm9yX3JvdXRlIH1cblx0XHRcdF1cblx0XHR9LCByZXEsIHJlcywgc3RhdHVzQ29kZSwgZXJyb3IgfHwgbmV3IEVycm9yKCdVbmtub3duIGVycm9yIGluIHByZWxvYWQgZnVuY3Rpb24nKSk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBoYW5kbGVfcGFnZShwYWdlLCByZXEsIHJlcywgc3RhdHVzID0gMjAwLCBlcnJvciA9IG51bGwpIHtcblx0XHRjb25zdCBpc19zZXJ2aWNlX3dvcmtlcl9pbmRleCA9IHJlcS5wYXRoID09PSAnL3NlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWwnO1xuXHRcdGNvbnN0IGJ1aWxkX2luZm9cblxuXG5cblxuID0gZ2V0X2J1aWxkX2luZm8oKTtcblxuXHRcdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKTtcblx0XHRyZXMuc2V0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgZGV2ID8gJ25vLWNhY2hlJyA6ICdtYXgtYWdlPTYwMCcpO1xuXG5cdFx0Ly8gcHJlbG9hZCBtYWluLmpzIGFuZCBjdXJyZW50IHJvdXRlXG5cdFx0Ly8gVE9ETyBkZXRlY3Qgb3RoZXIgc3R1ZmYgd2UgY2FuIHByZWxvYWQ/IGltYWdlcywgQ1NTLCBmb250cz9cblx0XHRsZXQgcHJlbG9hZGVkX2NodW5rcyA9IEFycmF5LmlzQXJyYXkoYnVpbGRfaW5mby5hc3NldHMubWFpbikgPyBidWlsZF9pbmZvLmFzc2V0cy5tYWluIDogW2J1aWxkX2luZm8uYXNzZXRzLm1haW5dO1xuXHRcdGlmICghZXJyb3IgJiYgIWlzX3NlcnZpY2Vfd29ya2VyX2luZGV4KSB7XG5cdFx0XHRwYWdlLnBhcnRzLmZvckVhY2gocGFydCA9PiB7XG5cdFx0XHRcdGlmICghcGFydCkgcmV0dXJuO1xuXG5cdFx0XHRcdC8vIHVzaW5nIGNvbmNhdCBiZWNhdXNlIGl0IGNvdWxkIGJlIGEgc3RyaW5nIG9yIGFuIGFycmF5LiB0aGFua3Mgd2VicGFjayFcblx0XHRcdFx0cHJlbG9hZGVkX2NodW5rcyA9IHByZWxvYWRlZF9jaHVua3MuY29uY2F0KGJ1aWxkX2luZm8uYXNzZXRzW3BhcnQubmFtZV0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGJ1aWxkX2luZm8uYnVuZGxlciA9PT0gJ3JvbGx1cCcpIHtcblx0XHRcdC8vIFRPRE8gYWRkIGRlcGVuZGVuY2llcyBhbmQgQ1NTXG5cdFx0XHRjb25zdCBsaW5rID0gcHJlbG9hZGVkX2NodW5rc1xuXHRcdFx0XHQuZmlsdGVyKGZpbGUgPT4gZmlsZSAmJiAhZmlsZS5tYXRjaCgvXFwubWFwJC8pKVxuXHRcdFx0XHQubWFwKGZpbGUgPT4gYDwke3JlcS5iYXNlVXJsfS9jbGllbnQvJHtmaWxlfT47cmVsPVwibW9kdWxlcHJlbG9hZFwiYClcblx0XHRcdFx0LmpvaW4oJywgJyk7XG5cblx0XHRcdHJlcy5zZXRIZWFkZXIoJ0xpbmsnLCBsaW5rKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgbGluayA9IHByZWxvYWRlZF9jaHVua3Ncblx0XHRcdFx0LmZpbHRlcihmaWxlID0+IGZpbGUgJiYgIWZpbGUubWF0Y2goL1xcLm1hcCQvKSlcblx0XHRcdFx0Lm1hcCgoZmlsZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGFzID0gL1xcLmNzcyQvLnRlc3QoZmlsZSkgPyAnc3R5bGUnIDogJ3NjcmlwdCc7XG5cdFx0XHRcdFx0cmV0dXJuIGA8JHtyZXEuYmFzZVVybH0vY2xpZW50LyR7ZmlsZX0+O3JlbD1cInByZWxvYWRcIjthcz1cIiR7YXN9XCJgO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuam9pbignLCAnKTtcblxuXHRcdFx0cmVzLnNldEhlYWRlcignTGluaycsIGxpbmspO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNlc3Npb24gPSBzZXNzaW9uX2dldHRlcihyZXEsIHJlcyk7XG5cblx0XHRsZXQgcmVkaXJlY3Q7XG5cdFx0bGV0IHByZWxvYWRfZXJyb3I7XG5cblx0XHRjb25zdCBwcmVsb2FkX2NvbnRleHQgPSB7XG5cdFx0XHRyZWRpcmVjdDogKHN0YXR1c0NvZGUsIGxvY2F0aW9uKSA9PiB7XG5cdFx0XHRcdGlmIChyZWRpcmVjdCAmJiAocmVkaXJlY3Quc3RhdHVzQ29kZSAhPT0gc3RhdHVzQ29kZSB8fCByZWRpcmVjdC5sb2NhdGlvbiAhPT0gbG9jYXRpb24pKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb25mbGljdGluZyByZWRpcmVjdHNgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsb2NhdGlvbiA9IGxvY2F0aW9uLnJlcGxhY2UoL15cXC8vZywgJycpOyAvLyBsZWFkaW5nIHNsYXNoIChvbmx5KVxuXHRcdFx0XHRyZWRpcmVjdCA9IHsgc3RhdHVzQ29kZSwgbG9jYXRpb24gfTtcblx0XHRcdH0sXG5cdFx0XHRlcnJvcjogKHN0YXR1c0NvZGUsIG1lc3NhZ2UpID0+IHtcblx0XHRcdFx0cHJlbG9hZF9lcnJvciA9IHsgc3RhdHVzQ29kZSwgbWVzc2FnZSB9O1xuXHRcdFx0fSxcblx0XHRcdGZldGNoOiAodXJsLCBvcHRzKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHBhcnNlZCA9IG5ldyBVcmwuVVJMKHVybCwgYGh0dHA6Ly8xMjcuMC4wLjE6JHtwcm9jZXNzLmVudi5QT1JUfSR7cmVxLmJhc2VVcmwgPyByZXEuYmFzZVVybCArICcvJyA6Jyd9YCk7XG5cblx0XHRcdFx0aWYgKG9wdHMpIHtcblx0XHRcdFx0XHRvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cyk7XG5cblx0XHRcdFx0XHRjb25zdCBpbmNsdWRlX2Nvb2tpZXMgPSAoXG5cdFx0XHRcdFx0XHRvcHRzLmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScgfHxcblx0XHRcdFx0XHRcdG9wdHMuY3JlZGVudGlhbHMgPT09ICdzYW1lLW9yaWdpbicgJiYgcGFyc2VkLm9yaWdpbiA9PT0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtwcm9jZXNzLmVudi5QT1JUfWBcblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0aWYgKGluY2x1ZGVfY29va2llcykge1xuXHRcdFx0XHRcdFx0b3B0cy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cy5oZWFkZXJzKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgY29va2llcyA9IE9iamVjdC5hc3NpZ24oXG5cdFx0XHRcdFx0XHRcdHt9LFxuXHRcdFx0XHRcdFx0XHRjb29raWUucGFyc2UocmVxLmhlYWRlcnMuY29va2llIHx8ICcnKSxcblx0XHRcdFx0XHRcdFx0Y29va2llLnBhcnNlKG9wdHMuaGVhZGVycy5jb29raWUgfHwgJycpXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBzZXRfY29va2llID0gcmVzLmdldEhlYWRlcignU2V0LUNvb2tpZScpO1xuXHRcdFx0XHRcdFx0KEFycmF5LmlzQXJyYXkoc2V0X2Nvb2tpZSkgPyBzZXRfY29va2llIDogW3NldF9jb29raWVdKS5mb3JFYWNoKHN0ciA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG1hdGNoID0gLyhbXj1dKyk9KFteO10rKS8uZXhlYyhzdHIpO1xuXHRcdFx0XHRcdFx0XHRpZiAobWF0Y2gpIGNvb2tpZXNbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Y29uc3Qgc3RyID0gT2JqZWN0LmtleXMoY29va2llcylcblx0XHRcdFx0XHRcdFx0Lm1hcChrZXkgPT4gYCR7a2V5fT0ke2Nvb2tpZXNba2V5XX1gKVxuXHRcdFx0XHRcdFx0XHQuam9pbignOyAnKTtcblxuXHRcdFx0XHRcdFx0b3B0cy5oZWFkZXJzLmNvb2tpZSA9IHN0cjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZmV0Y2gocGFyc2VkLmhyZWYsIG9wdHMpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRsZXQgcHJlbG9hZGVkO1xuXHRcdGxldCBtYXRjaDtcblx0XHRsZXQgcGFyYW1zO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHJvb3RfcHJlbG9hZGVkID0gbWFuaWZlc3Qucm9vdF9wcmVsb2FkXG5cdFx0XHRcdD8gbWFuaWZlc3Qucm9vdF9wcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRcdFx0aG9zdDogcmVxLmhlYWRlcnMuaG9zdCxcblx0XHRcdFx0XHRwYXRoOiByZXEucGF0aCxcblx0XHRcdFx0XHRxdWVyeTogcmVxLnF1ZXJ5LFxuXHRcdFx0XHRcdHBhcmFtczoge31cblx0XHRcdFx0fSwgc2Vzc2lvbilcblx0XHRcdFx0OiB7fTtcblxuXHRcdFx0bWF0Y2ggPSBlcnJvciA/IG51bGwgOiBwYWdlLnBhdHRlcm4uZXhlYyhyZXEucGF0aCk7XG5cblxuXHRcdFx0bGV0IHRvUHJlbG9hZCA9IFtyb290X3ByZWxvYWRlZF07XG5cdFx0XHRpZiAoIWlzX3NlcnZpY2Vfd29ya2VyX2luZGV4KSB7XG5cdFx0XHRcdHRvUHJlbG9hZCA9IHRvUHJlbG9hZC5jb25jYXQocGFnZS5wYXJ0cy5tYXAocGFydCA9PiB7XG5cdFx0XHRcdFx0aWYgKCFwYXJ0KSByZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdC8vIHRoZSBkZWVwZXN0IGxldmVsIGlzIHVzZWQgYmVsb3csIHRvIGluaXRpYWxpc2UgdGhlIHN0b3JlXG5cdFx0XHRcdFx0cGFyYW1zID0gcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyhtYXRjaCkgOiB7fTtcblxuXHRcdFx0XHRcdHJldHVybiBwYXJ0LnByZWxvYWRcblx0XHRcdFx0XHRcdD8gcGFydC5wcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRcdFx0XHRcdGhvc3Q6IHJlcS5oZWFkZXJzLmhvc3QsXG5cdFx0XHRcdFx0XHRcdHBhdGg6IHJlcS5wYXRoLFxuXHRcdFx0XHRcdFx0XHRxdWVyeTogcmVxLnF1ZXJ5LFxuXHRcdFx0XHRcdFx0XHRwYXJhbXNcblx0XHRcdFx0XHRcdH0sIHNlc3Npb24pXG5cdFx0XHRcdFx0XHQ6IHt9O1xuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cblx0XHRcdHByZWxvYWRlZCA9IGF3YWl0IFByb21pc2UuYWxsKHRvUHJlbG9hZCk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0cmV0dXJuIGJhaWwocmVxLCByZXMsIGVycilcblx0XHRcdH1cblxuXHRcdFx0cHJlbG9hZF9lcnJvciA9IHsgc3RhdHVzQ29kZTogNTAwLCBtZXNzYWdlOiBlcnIgfTtcblx0XHRcdHByZWxvYWRlZCA9IFtdOyAvLyBhcHBlYXNlIFR5cGVTY3JpcHRcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0aWYgKHJlZGlyZWN0KSB7XG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gVXJsLnJlc29sdmUoKHJlcS5iYXNlVXJsIHx8ICcnKSArICcvJywgcmVkaXJlY3QubG9jYXRpb24pO1xuXG5cdFx0XHRcdHJlcy5zdGF0dXNDb2RlID0gcmVkaXJlY3Quc3RhdHVzQ29kZTtcblx0XHRcdFx0cmVzLnNldEhlYWRlcignTG9jYXRpb24nLCBsb2NhdGlvbik7XG5cdFx0XHRcdHJlcy5lbmQoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmVsb2FkX2Vycm9yKSB7XG5cdFx0XHRcdGhhbmRsZV9lcnJvcihyZXEsIHJlcywgcHJlbG9hZF9lcnJvci5zdGF0dXNDb2RlLCBwcmVsb2FkX2Vycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlZ21lbnRzID0gcmVxLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoQm9vbGVhbik7XG5cblx0XHRcdC8vIFRPRE8gbWFrZSB0aGlzIGxlc3MgY29uZnVzaW5nXG5cdFx0XHRjb25zdCBsYXlvdXRfc2VnbWVudHMgPSBbc2VnbWVudHNbMF1dO1xuXHRcdFx0bGV0IGwgPSAxO1xuXG5cdFx0XHRwYWdlLnBhcnRzLmZvckVhY2goKHBhcnQsIGkpID0+IHtcblx0XHRcdFx0bGF5b3V0X3NlZ21lbnRzW2xdID0gc2VnbWVudHNbaSArIDFdO1xuXHRcdFx0XHRpZiAoIXBhcnQpIHJldHVybiBudWxsO1xuXHRcdFx0XHRsKys7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3QgcHJvcHMgPSB7XG5cdFx0XHRcdHN0b3Jlczoge1xuXHRcdFx0XHRcdHBhZ2U6IHtcblx0XHRcdFx0XHRcdHN1YnNjcmliZTogd3JpdGFibGUoe1xuXHRcdFx0XHRcdFx0XHRob3N0OiByZXEuaGVhZGVycy5ob3N0LFxuXHRcdFx0XHRcdFx0XHRwYXRoOiByZXEucGF0aCxcblx0XHRcdFx0XHRcdFx0cXVlcnk6IHJlcS5xdWVyeSxcblx0XHRcdFx0XHRcdFx0cGFyYW1zXG5cdFx0XHRcdFx0XHR9KS5zdWJzY3JpYmVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHByZWxvYWRpbmc6IHtcblx0XHRcdFx0XHRcdHN1YnNjcmliZTogd3JpdGFibGUobnVsbCkuc3Vic2NyaWJlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRzZXNzaW9uOiB3cml0YWJsZShzZXNzaW9uKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZWdtZW50czogbGF5b3V0X3NlZ21lbnRzLFxuXHRcdFx0XHRzdGF0dXM6IGVycm9yID8gc3RhdHVzIDogMjAwLFxuXHRcdFx0XHRlcnJvcjogZXJyb3IgPyBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IgOiB7IG1lc3NhZ2U6IGVycm9yIH0gOiBudWxsLFxuXHRcdFx0XHRsZXZlbDA6IHtcblx0XHRcdFx0XHRwcm9wczogcHJlbG9hZGVkWzBdXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxldmVsMToge1xuXHRcdFx0XHRcdHNlZ21lbnQ6IHNlZ21lbnRzWzBdLFxuXHRcdFx0XHRcdHByb3BzOiB7fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIWlzX3NlcnZpY2Vfd29ya2VyX2luZGV4KSB7XG5cdFx0XHRcdGxldCBsID0gMTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlLnBhcnRzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRcdFx0Y29uc3QgcGFydCA9IHBhZ2UucGFydHNbaV07XG5cdFx0XHRcdFx0aWYgKCFwYXJ0KSBjb250aW51ZTtcblxuXHRcdFx0XHRcdHByb3BzW2BsZXZlbCR7bCsrfWBdID0ge1xuXHRcdFx0XHRcdFx0Y29tcG9uZW50OiBwYXJ0LmNvbXBvbmVudCxcblx0XHRcdFx0XHRcdHByb3BzOiBwcmVsb2FkZWRbaSArIDFdIHx8IHt9LFxuXHRcdFx0XHRcdFx0c2VnbWVudDogc2VnbWVudHNbaV1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHsgaHRtbCwgaGVhZCwgY3NzIH0gPSBBcHAucmVuZGVyKHByb3BzKTtcblxuXHRcdFx0Y29uc3Qgc2VyaWFsaXplZCA9IHtcblx0XHRcdFx0cHJlbG9hZGVkOiBgWyR7cHJlbG9hZGVkLm1hcChkYXRhID0+IHRyeV9zZXJpYWxpemUoZGF0YSkpLmpvaW4oJywnKX1dYCxcblx0XHRcdFx0c2Vzc2lvbjogc2Vzc2lvbiAmJiB0cnlfc2VyaWFsaXplKHNlc3Npb24sIGVyciA9PiB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc2VyaWFsaXplIHNlc3Npb24gZGF0YTogJHtlcnIubWVzc2FnZX1gKTtcblx0XHRcdFx0fSksXG5cdFx0XHRcdGVycm9yOiBlcnJvciAmJiB0cnlfc2VyaWFsaXplKHByb3BzLmVycm9yKVxuXHRcdFx0fTtcblxuXHRcdFx0bGV0IHNjcmlwdCA9IGBfX1NBUFBFUl9fPXske1tcblx0XHRcdFx0ZXJyb3IgJiYgYGVycm9yOiR7c2VyaWFsaXplZC5lcnJvcn0sc3RhdHVzOiR7c3RhdHVzfWAsXG5cdFx0XHRcdGBiYXNlVXJsOlwiJHtyZXEuYmFzZVVybH1cImAsXG5cdFx0XHRcdHNlcmlhbGl6ZWQucHJlbG9hZGVkICYmIGBwcmVsb2FkZWQ6JHtzZXJpYWxpemVkLnByZWxvYWRlZH1gLFxuXHRcdFx0XHRzZXJpYWxpemVkLnNlc3Npb24gJiYgYHNlc3Npb246JHtzZXJpYWxpemVkLnNlc3Npb259YFxuXHRcdFx0XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCcpfX07YDtcblxuXHRcdFx0aWYgKGhhc19zZXJ2aWNlX3dvcmtlcikge1xuXHRcdFx0XHRzY3JpcHQgKz0gYGlmKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJyR7cmVxLmJhc2VVcmx9L3NlcnZpY2Utd29ya2VyLmpzJyk7YDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZmlsZSA9IFtdLmNvbmNhdChidWlsZF9pbmZvLmFzc2V0cy5tYWluKS5maWx0ZXIoZmlsZSA9PiBmaWxlICYmIC9cXC5qcyQvLnRlc3QoZmlsZSkpWzBdO1xuXHRcdFx0Y29uc3QgbWFpbiA9IGAke3JlcS5iYXNlVXJsfS9jbGllbnQvJHtmaWxlfWA7XG5cblx0XHRcdGlmIChidWlsZF9pbmZvLmJ1bmRsZXIgPT09ICdyb2xsdXAnKSB7XG5cdFx0XHRcdGlmIChidWlsZF9pbmZvLmxlZ2FjeV9hc3NldHMpIHtcblx0XHRcdFx0XHRjb25zdCBsZWdhY3lfbWFpbiA9IGAke3JlcS5iYXNlVXJsfS9jbGllbnQvbGVnYWN5LyR7YnVpbGRfaW5mby5sZWdhY3lfYXNzZXRzLm1haW59YDtcblx0XHRcdFx0XHRzY3JpcHQgKz0gYChmdW5jdGlvbigpe3RyeXtldmFsKFwiYXN5bmMgZnVuY3Rpb24geCgpe31cIik7dmFyIG1haW49XCIke21haW59XCJ9Y2F0Y2goZSl7bWFpbj1cIiR7bGVnYWN5X21haW59XCJ9O3ZhciBzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dHJ5e25ldyBGdW5jdGlvbihcImlmKDApaW1wb3J0KCcnKVwiKSgpO3Muc3JjPW1haW47cy50eXBlPVwibW9kdWxlXCI7cy5jcm9zc09yaWdpbj1cInVzZS1jcmVkZW50aWFsc1wiO31jYXRjaChlKXtzLnNyYz1cIiR7cmVxLmJhc2VVcmx9L2NsaWVudC9zaGltcG9ydEAke2J1aWxkX2luZm8uc2hpbXBvcnR9LmpzXCI7cy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW1haW5cIixtYWluKTt9ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzKTt9KCkpO2A7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2NyaXB0ICs9IGB2YXIgcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO3RyeXtuZXcgRnVuY3Rpb24oXCJpZigwKWltcG9ydCgnJylcIikoKTtzLnNyYz1cIiR7bWFpbn1cIjtzLnR5cGU9XCJtb2R1bGVcIjtzLmNyb3NzT3JpZ2luPVwidXNlLWNyZWRlbnRpYWxzXCI7fWNhdGNoKGUpe3Muc3JjPVwiJHtyZXEuYmFzZVVybH0vY2xpZW50L3NoaW1wb3J0QCR7YnVpbGRfaW5mby5zaGltcG9ydH0uanNcIjtzLnNldEF0dHJpYnV0ZShcImRhdGEtbWFpblwiLFwiJHttYWlufVwiKX1kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHMpYDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2NyaXB0ICs9IGA8L3NjcmlwdD48c2NyaXB0IHNyYz1cIiR7bWFpbn1cIj5gO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgc3R5bGVzO1xuXG5cdFx0XHQvLyBUT0RPIG1ha2UgdGhpcyBjb25zaXN0ZW50IGFjcm9zcyBhcHBzXG5cdFx0XHQvLyBUT0RPIGVtYmVkIGJ1aWxkX2luZm8gaW4gcGxhY2Vob2xkZXIudHNcblx0XHRcdGlmIChidWlsZF9pbmZvLmNzcyAmJiBidWlsZF9pbmZvLmNzcy5tYWluKSB7XG5cdFx0XHRcdGNvbnN0IGNzc19jaHVua3MgPSBuZXcgU2V0KCk7XG5cdFx0XHRcdGlmIChidWlsZF9pbmZvLmNzcy5tYWluKSBjc3NfY2h1bmtzLmFkZChidWlsZF9pbmZvLmNzcy5tYWluKTtcblx0XHRcdFx0cGFnZS5wYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuXHRcdFx0XHRcdGlmICghcGFydCkgcmV0dXJuO1xuXHRcdFx0XHRcdGNvbnN0IGNzc19jaHVua3NfZm9yX3BhcnQgPSBidWlsZF9pbmZvLmNzcy5jaHVua3NbcGFydC5maWxlXTtcblxuXHRcdFx0XHRcdGlmIChjc3NfY2h1bmtzX2Zvcl9wYXJ0KSB7XG5cdFx0XHRcdFx0XHRjc3NfY2h1bmtzX2Zvcl9wYXJ0LmZvckVhY2goZmlsZSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNzc19jaHVua3MuYWRkKGZpbGUpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzdHlsZXMgPSBBcnJheS5mcm9tKGNzc19jaHVua3MpXG5cdFx0XHRcdFx0Lm1hcChocmVmID0+IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImNsaWVudC8ke2hyZWZ9XCI+YClcblx0XHRcdFx0XHQuam9pbignJyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzdHlsZXMgPSAoY3NzICYmIGNzcy5jb2RlID8gYDxzdHlsZT4ke2Nzcy5jb2RlfTwvc3R5bGU+YCA6ICcnKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXNlcnMgY2FuIHNldCBhIENTUCBub25jZSB1c2luZyByZXMubG9jYWxzLm5vbmNlXG5cdFx0XHRjb25zdCBub25jZV9hdHRyID0gKHJlcy5sb2NhbHMgJiYgcmVzLmxvY2Fscy5ub25jZSkgPyBgIG5vbmNlPVwiJHtyZXMubG9jYWxzLm5vbmNlfVwiYCA6ICcnO1xuXG5cdFx0XHRjb25zdCBib2R5ID0gdGVtcGxhdGUoKVxuXHRcdFx0XHQucmVwbGFjZSgnJXNhcHBlci5iYXNlJScsICgpID0+IGA8YmFzZSBocmVmPVwiJHtyZXEuYmFzZVVybH0vXCI+YClcblx0XHRcdFx0LnJlcGxhY2UoJyVzYXBwZXIuc2NyaXB0cyUnLCAoKSA9PiBgPHNjcmlwdCR7bm9uY2VfYXR0cn0+JHtzY3JpcHR9PC9zY3JpcHQ+YClcblx0XHRcdFx0LnJlcGxhY2UoJyVzYXBwZXIuaHRtbCUnLCAoKSA9PiBodG1sKVxuXHRcdFx0XHQucmVwbGFjZSgnJXNhcHBlci5oZWFkJScsICgpID0+IGA8bm9zY3JpcHQgaWQ9J3NhcHBlci1oZWFkLXN0YXJ0Jz48L25vc2NyaXB0PiR7aGVhZH08bm9zY3JpcHQgaWQ9J3NhcHBlci1oZWFkLWVuZCc+PC9ub3NjcmlwdD5gKVxuXHRcdFx0XHQucmVwbGFjZSgnJXNhcHBlci5zdHlsZXMlJywgKCkgPT4gc3R5bGVzKTtcblxuXHRcdFx0cmVzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG5cdFx0XHRyZXMuZW5kKGJvZHkpO1xuXHRcdH0gY2F0Y2goZXJyKSB7XG5cdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0YmFpbChyZXEsIHJlcywgZXJyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhhbmRsZV9lcnJvcihyZXEsIHJlcywgNTAwLCBlcnIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBmaW5kX3JvdXRlKHJlcSwgcmVzLCBuZXh0KSB7XG5cdFx0aWYgKHJlcS5wYXRoID09PSAnL3NlcnZpY2Utd29ya2VyLWluZGV4Lmh0bWwnKSB7XG5cdFx0XHRjb25zdCBob21lUGFnZSA9IHBhZ2VzLmZpbmQocGFnZSA9PiBwYWdlLnBhdHRlcm4udGVzdCgnLycpKTtcblx0XHRcdGhhbmRsZV9wYWdlKGhvbWVQYWdlLCByZXEsIHJlcyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBwYWdlIG9mIHBhZ2VzKSB7XG5cdFx0XHRpZiAocGFnZS5wYXR0ZXJuLnRlc3QocmVxLnBhdGgpKSB7XG5cdFx0XHRcdGhhbmRsZV9wYWdlKHBhZ2UsIHJlcSwgcmVzKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZV9lcnJvcihyZXEsIHJlcywgNDA0LCAnTm90IGZvdW5kJyk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIHJlYWRfdGVtcGxhdGUoZGlyID0gYnVpbGRfZGlyKSB7XG5cdHJldHVybiBmcy5yZWFkRmlsZVN5bmMoYCR7ZGlyfS90ZW1wbGF0ZS5odG1sYCwgJ3V0Zi04Jyk7XG59XG5cbmZ1bmN0aW9uIHRyeV9zZXJpYWxpemUoZGF0YSwgZmFpbCkge1xuXHR0cnkge1xuXHRcdHJldHVybiBkZXZhbHVlKGRhdGEpO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRpZiAoZmFpbCkgZmFpbChlcnIpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGVzY2FwZV9odG1sKGh0bWwpIHtcblx0Y29uc3QgY2hhcnMgPSB7XG5cdFx0J1wiJyA6ICdxdW90Jyxcblx0XHRcIidcIjogJyMzOScsXG5cdFx0JyYnOiAnYW1wJyxcblx0XHQnPCcgOiAnbHQnLFxuXHRcdCc+JyA6ICdndCdcblx0fTtcblxuXHRyZXR1cm4gaHRtbC5yZXBsYWNlKC9bXCInJjw+XS9nLCBjID0+IGAmJHtjaGFyc1tjXX07YCk7XG59XG5cbnZhciBtaW1lX3JhdyA9IFwiYXBwbGljYXRpb24vYW5kcmV3LWluc2V0XFx0XFx0XFx0ZXpcXG5hcHBsaWNhdGlvbi9hcHBsaXh3YXJlXFx0XFx0XFx0XFx0YXdcXG5hcHBsaWNhdGlvbi9hdG9tK3htbFxcdFxcdFxcdFxcdGF0b21cXG5hcHBsaWNhdGlvbi9hdG9tY2F0K3htbFxcdFxcdFxcdFxcdGF0b21jYXRcXG5hcHBsaWNhdGlvbi9hdG9tc3ZjK3htbFxcdFxcdFxcdFxcdGF0b21zdmNcXG5hcHBsaWNhdGlvbi9jY3htbCt4bWxcXHRcXHRcXHRcXHRjY3htbFxcbmFwcGxpY2F0aW9uL2NkbWktY2FwYWJpbGl0eVxcdFxcdFxcdGNkbWlhXFxuYXBwbGljYXRpb24vY2RtaS1jb250YWluZXJcXHRcXHRcXHRjZG1pY1xcbmFwcGxpY2F0aW9uL2NkbWktZG9tYWluXFx0XFx0XFx0XFx0Y2RtaWRcXG5hcHBsaWNhdGlvbi9jZG1pLW9iamVjdFxcdFxcdFxcdFxcdGNkbWlvXFxuYXBwbGljYXRpb24vY2RtaS1xdWV1ZVxcdFxcdFxcdFxcdGNkbWlxXFxuYXBwbGljYXRpb24vY3Utc2VlbWVcXHRcXHRcXHRcXHRjdVxcbmFwcGxpY2F0aW9uL2Rhdm1vdW50K3htbFxcdFxcdFxcdGRhdm1vdW50XFxuYXBwbGljYXRpb24vZG9jYm9vayt4bWxcXHRcXHRcXHRcXHRkYmtcXG5hcHBsaWNhdGlvbi9kc3NjK2RlclxcdFxcdFxcdFxcdGRzc2NcXG5hcHBsaWNhdGlvbi9kc3NjK3htbFxcdFxcdFxcdFxcdHhkc3NjXFxuYXBwbGljYXRpb24vZWNtYXNjcmlwdFxcdFxcdFxcdFxcdGVjbWFcXG5hcHBsaWNhdGlvbi9lbW1hK3htbFxcdFxcdFxcdFxcdGVtbWFcXG5hcHBsaWNhdGlvbi9lcHViK3ppcFxcdFxcdFxcdFxcdGVwdWJcXG5hcHBsaWNhdGlvbi9leGlcXHRcXHRcXHRcXHRcXHRleGlcXG5hcHBsaWNhdGlvbi9mb250LXRkcGZyXFx0XFx0XFx0XFx0cGZyXFxuYXBwbGljYXRpb24vZ21sK3htbFxcdFxcdFxcdFxcdGdtbFxcbmFwcGxpY2F0aW9uL2dweCt4bWxcXHRcXHRcXHRcXHRncHhcXG5hcHBsaWNhdGlvbi9neGZcXHRcXHRcXHRcXHRcXHRneGZcXG5hcHBsaWNhdGlvbi9oeXBlcnN0dWRpb1xcdFxcdFxcdFxcdHN0a1xcbmFwcGxpY2F0aW9uL2lua21sK3htbFxcdFxcdFxcdFxcdGluayBpbmttbFxcbmFwcGxpY2F0aW9uL2lwZml4XFx0XFx0XFx0XFx0aXBmaXhcXG5hcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmVcXHRcXHRcXHRqYXJcXG5hcHBsaWNhdGlvbi9qYXZhLXNlcmlhbGl6ZWQtb2JqZWN0XFx0XFx0c2VyXFxuYXBwbGljYXRpb24vamF2YS12bVxcdFxcdFxcdFxcdGNsYXNzXFxuYXBwbGljYXRpb24vamF2YXNjcmlwdFxcdFxcdFxcdFxcdGpzXFxuYXBwbGljYXRpb24vanNvblxcdFxcdFxcdFxcdGpzb24gbWFwXFxuYXBwbGljYXRpb24vanNvbm1sK2pzb25cXHRcXHRcXHRcXHRqc29ubWxcXG5hcHBsaWNhdGlvbi9sb3N0K3htbFxcdFxcdFxcdFxcdGxvc3R4bWxcXG5hcHBsaWNhdGlvbi9tYWMtYmluaGV4NDBcXHRcXHRcXHRocXhcXG5hcHBsaWNhdGlvbi9tYWMtY29tcGFjdHByb1xcdFxcdFxcdGNwdFxcbmFwcGxpY2F0aW9uL21hZHMreG1sXFx0XFx0XFx0XFx0bWFkc1xcbmFwcGxpY2F0aW9uL21hcmNcXHRcXHRcXHRcXHRtcmNcXG5hcHBsaWNhdGlvbi9tYXJjeG1sK3htbFxcdFxcdFxcdFxcdG1yY3hcXG5hcHBsaWNhdGlvbi9tYXRoZW1hdGljYVxcdFxcdFxcdFxcdG1hIG5iIG1iXFxuYXBwbGljYXRpb24vbWF0aG1sK3htbFxcdFxcdFxcdFxcdG1hdGhtbFxcbmFwcGxpY2F0aW9uL21ib3hcXHRcXHRcXHRcXHRtYm94XFxuYXBwbGljYXRpb24vbWVkaWFzZXJ2ZXJjb250cm9sK3htbFxcdFxcdG1zY21sXFxuYXBwbGljYXRpb24vbWV0YWxpbmsreG1sXFx0XFx0XFx0bWV0YWxpbmtcXG5hcHBsaWNhdGlvbi9tZXRhbGluazQreG1sXFx0XFx0XFx0bWV0YTRcXG5hcHBsaWNhdGlvbi9tZXRzK3htbFxcdFxcdFxcdFxcdG1ldHNcXG5hcHBsaWNhdGlvbi9tb2RzK3htbFxcdFxcdFxcdFxcdG1vZHNcXG5hcHBsaWNhdGlvbi9tcDIxXFx0XFx0XFx0XFx0bTIxIG1wMjFcXG5hcHBsaWNhdGlvbi9tcDRcXHRcXHRcXHRcXHRcXHRtcDRzXFxuYXBwbGljYXRpb24vbXN3b3JkXFx0XFx0XFx0XFx0ZG9jIGRvdFxcbmFwcGxpY2F0aW9uL214ZlxcdFxcdFxcdFxcdFxcdG14ZlxcbmFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVxcdGJpbiBkbXMgbHJmIG1hciBzbyBkaXN0IGRpc3R6IHBrZyBicGsgZHVtcCBlbGMgZGVwbG95XFxuYXBwbGljYXRpb24vb2RhXFx0XFx0XFx0XFx0XFx0b2RhXFxuYXBwbGljYXRpb24vb2VicHMtcGFja2FnZSt4bWxcXHRcXHRcXHRvcGZcXG5hcHBsaWNhdGlvbi9vZ2dcXHRcXHRcXHRcXHRcXHRvZ3hcXG5hcHBsaWNhdGlvbi9vbWRvYyt4bWxcXHRcXHRcXHRcXHRvbWRvY1xcbmFwcGxpY2F0aW9uL29uZW5vdGVcXHRcXHRcXHRcXHRvbmV0b2Mgb25ldG9jMiBvbmV0bXAgb25lcGtnXFxuYXBwbGljYXRpb24vb3hwc1xcdFxcdFxcdFxcdG94cHNcXG5hcHBsaWNhdGlvbi9wYXRjaC1vcHMtZXJyb3IreG1sXFx0XFx0XFx0eGVyXFxuYXBwbGljYXRpb24vcGRmXFx0XFx0XFx0XFx0XFx0cGRmXFxuYXBwbGljYXRpb24vcGdwLWVuY3J5cHRlZFxcdFxcdFxcdHBncFxcbmFwcGxpY2F0aW9uL3BncC1zaWduYXR1cmVcXHRcXHRcXHRhc2Mgc2lnXFxuYXBwbGljYXRpb24vcGljcy1ydWxlc1xcdFxcdFxcdFxcdHByZlxcbmFwcGxpY2F0aW9uL3BrY3MxMFxcdFxcdFxcdFxcdHAxMFxcbmFwcGxpY2F0aW9uL3BrY3M3LW1pbWVcXHRcXHRcXHRcXHRwN20gcDdjXFxuYXBwbGljYXRpb24vcGtjczctc2lnbmF0dXJlXFx0XFx0XFx0cDdzXFxuYXBwbGljYXRpb24vcGtjczhcXHRcXHRcXHRcXHRwOFxcbmFwcGxpY2F0aW9uL3BraXgtYXR0ci1jZXJ0XFx0XFx0XFx0YWNcXG5hcHBsaWNhdGlvbi9wa2l4LWNlcnRcXHRcXHRcXHRcXHRjZXJcXG5hcHBsaWNhdGlvbi9wa2l4LWNybFxcdFxcdFxcdFxcdGNybFxcbmFwcGxpY2F0aW9uL3BraXgtcGtpcGF0aFxcdFxcdFxcdHBraXBhdGhcXG5hcHBsaWNhdGlvbi9wa2l4Y21wXFx0XFx0XFx0XFx0cGtpXFxuYXBwbGljYXRpb24vcGxzK3htbFxcdFxcdFxcdFxcdHBsc1xcbmFwcGxpY2F0aW9uL3Bvc3RzY3JpcHRcXHRcXHRcXHRcXHRhaSBlcHMgcHNcXG5hcHBsaWNhdGlvbi9wcnMuY3d3XFx0XFx0XFx0XFx0Y3d3XFxuYXBwbGljYXRpb24vcHNrYyt4bWxcXHRcXHRcXHRcXHRwc2tjeG1sXFxuYXBwbGljYXRpb24vcmRmK3htbFxcdFxcdFxcdFxcdHJkZlxcbmFwcGxpY2F0aW9uL3JlZ2luZm8reG1sXFx0XFx0XFx0XFx0cmlmXFxuYXBwbGljYXRpb24vcmVsYXgtbmctY29tcGFjdC1zeW50YXhcXHRcXHRybmNcXG5hcHBsaWNhdGlvbi9yZXNvdXJjZS1saXN0cyt4bWxcXHRcXHRcXHRybFxcbmFwcGxpY2F0aW9uL3Jlc291cmNlLWxpc3RzLWRpZmYreG1sXFx0XFx0cmxkXFxuYXBwbGljYXRpb24vcmxzLXNlcnZpY2VzK3htbFxcdFxcdFxcdHJzXFxuYXBwbGljYXRpb24vcnBraS1naG9zdGJ1c3RlcnNcXHRcXHRcXHRnYnJcXG5hcHBsaWNhdGlvbi9ycGtpLW1hbmlmZXN0XFx0XFx0XFx0bWZ0XFxuYXBwbGljYXRpb24vcnBraS1yb2FcXHRcXHRcXHRcXHRyb2FcXG5hcHBsaWNhdGlvbi9yc2QreG1sXFx0XFx0XFx0XFx0cnNkXFxuYXBwbGljYXRpb24vcnNzK3htbFxcdFxcdFxcdFxcdHJzc1xcbmFwcGxpY2F0aW9uL3J0ZlxcdFxcdFxcdFxcdFxcdHJ0ZlxcbmFwcGxpY2F0aW9uL3NibWwreG1sXFx0XFx0XFx0XFx0c2JtbFxcbmFwcGxpY2F0aW9uL3NjdnAtY3YtcmVxdWVzdFxcdFxcdFxcdHNjcVxcbmFwcGxpY2F0aW9uL3NjdnAtY3YtcmVzcG9uc2VcXHRcXHRcXHRzY3NcXG5hcHBsaWNhdGlvbi9zY3ZwLXZwLXJlcXVlc3RcXHRcXHRcXHRzcHFcXG5hcHBsaWNhdGlvbi9zY3ZwLXZwLXJlc3BvbnNlXFx0XFx0XFx0c3BwXFxuYXBwbGljYXRpb24vc2RwXFx0XFx0XFx0XFx0XFx0c2RwXFxuYXBwbGljYXRpb24vc2V0LXBheW1lbnQtaW5pdGlhdGlvblxcdFxcdHNldHBheVxcbmFwcGxpY2F0aW9uL3NldC1yZWdpc3RyYXRpb24taW5pdGlhdGlvblxcdFxcdHNldHJlZ1xcbmFwcGxpY2F0aW9uL3NoZit4bWxcXHRcXHRcXHRcXHRzaGZcXG5hcHBsaWNhdGlvbi9zbWlsK3htbFxcdFxcdFxcdFxcdHNtaSBzbWlsXFxuYXBwbGljYXRpb24vc3BhcnFsLXF1ZXJ5XFx0XFx0XFx0cnFcXG5hcHBsaWNhdGlvbi9zcGFycWwtcmVzdWx0cyt4bWxcXHRcXHRcXHRzcnhcXG5hcHBsaWNhdGlvbi9zcmdzXFx0XFx0XFx0XFx0Z3JhbVxcbmFwcGxpY2F0aW9uL3NyZ3MreG1sXFx0XFx0XFx0XFx0Z3J4bWxcXG5hcHBsaWNhdGlvbi9zcnUreG1sXFx0XFx0XFx0XFx0c3J1XFxuYXBwbGljYXRpb24vc3NkbCt4bWxcXHRcXHRcXHRcXHRzc2RsXFxuYXBwbGljYXRpb24vc3NtbCt4bWxcXHRcXHRcXHRcXHRzc21sXFxuYXBwbGljYXRpb24vdGVpK3htbFxcdFxcdFxcdFxcdHRlaSB0ZWljb3JwdXNcXG5hcHBsaWNhdGlvbi90aHJhdWQreG1sXFx0XFx0XFx0XFx0dGZpXFxuYXBwbGljYXRpb24vdGltZXN0YW1wZWQtZGF0YVxcdFxcdFxcdHRzZFxcbmFwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy1sYXJnZVxcdFxcdHBsYlxcbmFwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy1zbWFsbFxcdFxcdHBzYlxcbmFwcGxpY2F0aW9uL3ZuZC4zZ3BwLnBpYy1idy12YXJcXHRcXHRcXHRwdmJcXG5hcHBsaWNhdGlvbi92bmQuM2dwcDIudGNhcFxcdFxcdFxcdHRjYXBcXG5hcHBsaWNhdGlvbi92bmQuM20ucG9zdC1pdC1ub3Rlc1xcdFxcdHB3blxcbmFwcGxpY2F0aW9uL3ZuZC5hY2NwYWMuc2ltcGx5LmFzb1xcdFxcdGFzb1xcbmFwcGxpY2F0aW9uL3ZuZC5hY2NwYWMuc2ltcGx5LmltcFxcdFxcdGltcFxcbmFwcGxpY2F0aW9uL3ZuZC5hY3Vjb2JvbFxcdFxcdFxcdGFjdVxcbmFwcGxpY2F0aW9uL3ZuZC5hY3Vjb3JwXFx0XFx0XFx0XFx0YXRjIGFjdXRjXFxuYXBwbGljYXRpb24vdm5kLmFkb2JlLmFpci1hcHBsaWNhdGlvbi1pbnN0YWxsZXItcGFja2FnZSt6aXBcXHRhaXJcXG5hcHBsaWNhdGlvbi92bmQuYWRvYmUuZm9ybXNjZW50cmFsLmZjZHRcXHRcXHRmY2R0XFxuYXBwbGljYXRpb24vdm5kLmFkb2JlLmZ4cFxcdFxcdFxcdGZ4cCBmeHBsXFxuYXBwbGljYXRpb24vdm5kLmFkb2JlLnhkcCt4bWxcXHRcXHRcXHR4ZHBcXG5hcHBsaWNhdGlvbi92bmQuYWRvYmUueGZkZlxcdFxcdFxcdHhmZGZcXG5hcHBsaWNhdGlvbi92bmQuYWhlYWQuc3BhY2VcXHRcXHRcXHRhaGVhZFxcbmFwcGxpY2F0aW9uL3ZuZC5haXJ6aXAuZmlsZXNlY3VyZS5hemZcXHRcXHRhemZcXG5hcHBsaWNhdGlvbi92bmQuYWlyemlwLmZpbGVzZWN1cmUuYXpzXFx0XFx0YXpzXFxuYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9va1xcdFxcdFxcdGF6d1xcbmFwcGxpY2F0aW9uL3ZuZC5hbWVyaWNhbmR5bmFtaWNzLmFjY1xcdFxcdGFjY1xcbmFwcGxpY2F0aW9uL3ZuZC5hbWlnYS5hbWlcXHRcXHRcXHRhbWlcXG5hcHBsaWNhdGlvbi92bmQuYW5kcm9pZC5wYWNrYWdlLWFyY2hpdmVcXHRcXHRhcGtcXG5hcHBsaWNhdGlvbi92bmQuYW5zZXItd2ViLWNlcnRpZmljYXRlLWlzc3VlLWluaXRpYXRpb25cXHRjaWlcXG5hcHBsaWNhdGlvbi92bmQuYW5zZXItd2ViLWZ1bmRzLXRyYW5zZmVyLWluaXRpYXRpb25cXHRmdGlcXG5hcHBsaWNhdGlvbi92bmQuYW50aXguZ2FtZS1jb21wb25lbnRcXHRcXHRhdHhcXG5hcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbFxcdFxcdG1wa2dcXG5hcHBsaWNhdGlvbi92bmQuYXBwbGUubXBlZ3VybFxcdFxcdFxcdG0zdThcXG5hcHBsaWNhdGlvbi92bmQuYXJpc3RhbmV0d29ya3Muc3dpXFx0XFx0c3dpXFxuYXBwbGljYXRpb24vdm5kLmFzdHJhZWEtc29mdHdhcmUuaW90YVxcdFxcdGlvdGFcXG5hcHBsaWNhdGlvbi92bmQuYXVkaW9ncmFwaFxcdFxcdFxcdGFlcFxcbmFwcGxpY2F0aW9uL3ZuZC5ibHVlaWNlLm11bHRpcGFzc1xcdFxcdG1wbVxcbmFwcGxpY2F0aW9uL3ZuZC5ibWlcXHRcXHRcXHRcXHRibWlcXG5hcHBsaWNhdGlvbi92bmQuYnVzaW5lc3NvYmplY3RzXFx0XFx0XFx0cmVwXFxuYXBwbGljYXRpb24vdm5kLmNoZW1kcmF3K3htbFxcdFxcdFxcdGNkeG1sXFxuYXBwbGljYXRpb24vdm5kLmNoaXBudXRzLmthcmFva2UtbW1kXFx0XFx0bW1kXFxuYXBwbGljYXRpb24vdm5kLmNpbmRlcmVsbGFcXHRcXHRcXHRjZHlcXG5hcHBsaWNhdGlvbi92bmQuY2xheW1vcmVcXHRcXHRcXHRjbGFcXG5hcHBsaWNhdGlvbi92bmQuY2xvYW50by5ycDlcXHRcXHRcXHRycDlcXG5hcHBsaWNhdGlvbi92bmQuY2xvbmsuYzRncm91cFxcdFxcdFxcdGM0ZyBjNGQgYzRmIGM0cCBjNHVcXG5hcHBsaWNhdGlvbi92bmQuY2x1ZXRydXN0LmNhcnRvbW9iaWxlLWNvbmZpZ1xcdFxcdGMxMWFtY1xcbmFwcGxpY2F0aW9uL3ZuZC5jbHVldHJ1c3QuY2FydG9tb2JpbGUtY29uZmlnLXBrZ1xcdGMxMWFtelxcbmFwcGxpY2F0aW9uL3ZuZC5jb21tb25zcGFjZVxcdFxcdFxcdGNzcFxcbmFwcGxpY2F0aW9uL3ZuZC5jb250YWN0LmNtc2dcXHRcXHRcXHRjZGJjbXNnXFxuYXBwbGljYXRpb24vdm5kLmNvc21vY2FsbGVyXFx0XFx0XFx0Y21jXFxuYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXJcXHRcXHRcXHRjbGt4XFxuYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIua2V5Ym9hcmRcXHRcXHRjbGtrXFxuYXBwbGljYXRpb24vdm5kLmNyaWNrLmNsaWNrZXIucGFsZXR0ZVxcdFxcdGNsa3BcXG5hcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci50ZW1wbGF0ZVxcdFxcdGNsa3RcXG5hcHBsaWNhdGlvbi92bmQuY3JpY2suY2xpY2tlci53b3JkYmFua1xcdFxcdGNsa3dcXG5hcHBsaWNhdGlvbi92bmQuY3JpdGljYWx0b29scy53YnMreG1sXFx0XFx0d2JzXFxuYXBwbGljYXRpb24vdm5kLmN0Yy1wb3NtbFxcdFxcdFxcdHBtbFxcbmFwcGxpY2F0aW9uL3ZuZC5jdXBzLXBwZFxcdFxcdFxcdHBwZFxcbmFwcGxpY2F0aW9uL3ZuZC5jdXJsLmNhclxcdFxcdFxcdGNhclxcbmFwcGxpY2F0aW9uL3ZuZC5jdXJsLnBjdXJsXFx0XFx0XFx0cGN1cmxcXG5hcHBsaWNhdGlvbi92bmQuZGFydFxcdFxcdFxcdFxcdGRhcnRcXG5hcHBsaWNhdGlvbi92bmQuZGF0YS12aXNpb24ucmR6XFx0XFx0XFx0cmR6XFxuYXBwbGljYXRpb24vdm5kLmRlY2UuZGF0YVxcdFxcdFxcdHV2ZiB1dnZmIHV2ZCB1dnZkXFxuYXBwbGljYXRpb24vdm5kLmRlY2UudHRtbCt4bWxcXHRcXHRcXHR1dnQgdXZ2dFxcbmFwcGxpY2F0aW9uL3ZuZC5kZWNlLnVuc3BlY2lmaWVkXFx0XFx0dXZ4IHV2dnhcXG5hcHBsaWNhdGlvbi92bmQuZGVjZS56aXBcXHRcXHRcXHR1dnogdXZ2elxcbmFwcGxpY2F0aW9uL3ZuZC5kZW5vdm8uZmNzZWxheW91dC1saW5rXFx0XFx0ZmVfbGF1bmNoXFxuYXBwbGljYXRpb24vdm5kLmRuYVxcdFxcdFxcdFxcdGRuYVxcbmFwcGxpY2F0aW9uL3ZuZC5kb2xieS5tbHBcXHRcXHRcXHRtbHBcXG5hcHBsaWNhdGlvbi92bmQuZHBncmFwaFxcdFxcdFxcdFxcdGRwZ1xcbmFwcGxpY2F0aW9uL3ZuZC5kcmVhbWZhY3RvcnlcXHRcXHRcXHRkZmFjXFxuYXBwbGljYXRpb24vdm5kLmRzLWtleXBvaW50XFx0XFx0XFx0a3B4eFxcbmFwcGxpY2F0aW9uL3ZuZC5kdmIuYWl0XFx0XFx0XFx0XFx0YWl0XFxuYXBwbGljYXRpb24vdm5kLmR2Yi5zZXJ2aWNlXFx0XFx0XFx0c3ZjXFxuYXBwbGljYXRpb24vdm5kLmR5bmFnZW9cXHRcXHRcXHRcXHRnZW9cXG5hcHBsaWNhdGlvbi92bmQuZWNvd2luLmNoYXJ0XFx0XFx0XFx0bWFnXFxuYXBwbGljYXRpb24vdm5kLmVubGl2ZW5cXHRcXHRcXHRcXHRubWxcXG5hcHBsaWNhdGlvbi92bmQuZXBzb24uZXNmXFx0XFx0XFx0ZXNmXFxuYXBwbGljYXRpb24vdm5kLmVwc29uLm1zZlxcdFxcdFxcdG1zZlxcbmFwcGxpY2F0aW9uL3ZuZC5lcHNvbi5xdWlja2FuaW1lXFx0XFx0cWFtXFxuYXBwbGljYXRpb24vdm5kLmVwc29uLnNhbHRcXHRcXHRcXHRzbHRcXG5hcHBsaWNhdGlvbi92bmQuZXBzb24uc3NmXFx0XFx0XFx0c3NmXFxuYXBwbGljYXRpb24vdm5kLmVzemlnbm8zK3htbFxcdFxcdFxcdGVzMyBldDNcXG5hcHBsaWNhdGlvbi92bmQuZXpwaXgtYWxidW1cXHRcXHRcXHRlejJcXG5hcHBsaWNhdGlvbi92bmQuZXpwaXgtcGFja2FnZVxcdFxcdFxcdGV6M1xcbmFwcGxpY2F0aW9uL3ZuZC5mZGZcXHRcXHRcXHRcXHRmZGZcXG5hcHBsaWNhdGlvbi92bmQuZmRzbi5tc2VlZFxcdFxcdFxcdG1zZWVkXFxuYXBwbGljYXRpb24vdm5kLmZkc24uc2VlZFxcdFxcdFxcdHNlZWQgZGF0YWxlc3NcXG5hcHBsaWNhdGlvbi92bmQuZmxvZ3JhcGhpdFxcdFxcdFxcdGdwaFxcbmFwcGxpY2F0aW9uL3ZuZC5mbHV4dGltZS5jbGlwXFx0XFx0XFx0ZnRjXFxuYXBwbGljYXRpb24vdm5kLmZyYW1lbWFrZXJcXHRcXHRcXHRmbSBmcmFtZSBtYWtlciBib29rXFxuYXBwbGljYXRpb24vdm5kLmZyb2dhbnMuZm5jXFx0XFx0XFx0Zm5jXFxuYXBwbGljYXRpb24vdm5kLmZyb2dhbnMubHRmXFx0XFx0XFx0bHRmXFxuYXBwbGljYXRpb24vdm5kLmZzYy53ZWJsYXVuY2hcXHRcXHRcXHRmc2NcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c1xcdFxcdFxcdG9hc1xcbmFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzMlxcdFxcdFxcdG9hMlxcbmFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzM1xcdFxcdFxcdG9hM1xcbmFwcGxpY2F0aW9uL3ZuZC5mdWppdHN1Lm9hc3lzZ3BcXHRcXHRcXHRmZzVcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXRzdS5vYXN5c3Byc1xcdFxcdGJoMlxcbmFwcGxpY2F0aW9uL3ZuZC5mdWppeGVyb3guZGRkXFx0XFx0XFx0ZGRkXFxuYXBwbGljYXRpb24vdm5kLmZ1aml4ZXJveC5kb2N1d29ya3NcXHRcXHR4ZHdcXG5hcHBsaWNhdGlvbi92bmQuZnVqaXhlcm94LmRvY3V3b3Jrcy5iaW5kZXJcXHR4YmRcXG5hcHBsaWNhdGlvbi92bmQuZnV6enlzaGVldFxcdFxcdFxcdGZ6c1xcbmFwcGxpY2F0aW9uL3ZuZC5nZW5vbWF0aXgudHV4ZWRvXFx0XFx0dHhkXFxuYXBwbGljYXRpb24vdm5kLmdlb2dlYnJhLmZpbGVcXHRcXHRcXHRnZ2JcXG5hcHBsaWNhdGlvbi92bmQuZ2VvZ2VicmEudG9vbFxcdFxcdFxcdGdndFxcbmFwcGxpY2F0aW9uL3ZuZC5nZW9tZXRyeS1leHBsb3JlclxcdFxcdGdleCBncmVcXG5hcHBsaWNhdGlvbi92bmQuZ2VvbmV4dFxcdFxcdFxcdFxcdGd4dFxcbmFwcGxpY2F0aW9uL3ZuZC5nZW9wbGFuXFx0XFx0XFx0XFx0ZzJ3XFxuYXBwbGljYXRpb24vdm5kLmdlb3NwYWNlXFx0XFx0XFx0ZzN3XFxuYXBwbGljYXRpb24vdm5kLmdteFxcdFxcdFxcdFxcdGdteFxcbmFwcGxpY2F0aW9uL3ZuZC5nb29nbGUtZWFydGgua21sK3htbFxcdFxcdGttbFxcbmFwcGxpY2F0aW9uL3ZuZC5nb29nbGUtZWFydGgua216XFx0XFx0a216XFxuYXBwbGljYXRpb24vdm5kLmdyYWZlcVxcdFxcdFxcdFxcdGdxZiBncXNcXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWFjY291bnRcXHRcXHRcXHRnYWNcXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWhlbHBcXHRcXHRcXHRnaGZcXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWlkZW50aXR5LW1lc3NhZ2VcXHRcXHRnaW1cXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLWluamVjdG9yXFx0XFx0XFx0Z3J2XFxuYXBwbGljYXRpb24vdm5kLmdyb292ZS10b29sLW1lc3NhZ2VcXHRcXHRndG1cXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXRvb2wtdGVtcGxhdGVcXHRcXHR0cGxcXG5hcHBsaWNhdGlvbi92bmQuZ3Jvb3ZlLXZjYXJkXFx0XFx0XFx0dmNnXFxuYXBwbGljYXRpb24vdm5kLmhhbCt4bWxcXHRcXHRcXHRcXHRoYWxcXG5hcHBsaWNhdGlvbi92bmQuaGFuZGhlbGQtZW50ZXJ0YWlubWVudCt4bWxcXHR6bW1cXG5hcHBsaWNhdGlvbi92bmQuaGJjaVxcdFxcdFxcdFxcdGhiY2lcXG5hcHBsaWNhdGlvbi92bmQuaGhlLmxlc3Nvbi1wbGF5ZXJcXHRcXHRsZXNcXG5hcHBsaWNhdGlvbi92bmQuaHAtaHBnbFxcdFxcdFxcdFxcdGhwZ2xcXG5hcHBsaWNhdGlvbi92bmQuaHAtaHBpZFxcdFxcdFxcdFxcdGhwaWRcXG5hcHBsaWNhdGlvbi92bmQuaHAtaHBzXFx0XFx0XFx0XFx0aHBzXFxuYXBwbGljYXRpb24vdm5kLmhwLWpseXRcXHRcXHRcXHRcXHRqbHRcXG5hcHBsaWNhdGlvbi92bmQuaHAtcGNsXFx0XFx0XFx0XFx0cGNsXFxuYXBwbGljYXRpb24vdm5kLmhwLXBjbHhsXFx0XFx0XFx0cGNseGxcXG5hcHBsaWNhdGlvbi92bmQuaHlkcm9zdGF0aXguc29mLWRhdGFcXHRcXHRzZmQtaGRzdHhcXG5hcHBsaWNhdGlvbi92bmQuaWJtLm1pbmlwYXlcXHRcXHRcXHRtcHlcXG5hcHBsaWNhdGlvbi92bmQuaWJtLm1vZGNhcFxcdFxcdFxcdGFmcCBsaXN0YWZwIGxpc3QzODIwXFxuYXBwbGljYXRpb24vdm5kLmlibS5yaWdodHMtbWFuYWdlbWVudFxcdFxcdGlybVxcbmFwcGxpY2F0aW9uL3ZuZC5pYm0uc2VjdXJlLWNvbnRhaW5lclxcdFxcdHNjXFxuYXBwbGljYXRpb24vdm5kLmljY3Byb2ZpbGVcXHRcXHRcXHRpY2MgaWNtXFxuYXBwbGljYXRpb24vdm5kLmlnbG9hZGVyXFx0XFx0XFx0aWdsXFxuYXBwbGljYXRpb24vdm5kLmltbWVydmlzaW9uLWl2cFxcdFxcdFxcdGl2cFxcbmFwcGxpY2F0aW9uL3ZuZC5pbW1lcnZpc2lvbi1pdnVcXHRcXHRcXHRpdnVcXG5hcHBsaWNhdGlvbi92bmQuaW5zb3JzLmlnbVxcdFxcdFxcdGlnbVxcbmFwcGxpY2F0aW9uL3ZuZC5pbnRlcmNvbi5mb3JtbmV0XFx0XFx0eHB3IHhweFxcbmFwcGxpY2F0aW9uL3ZuZC5pbnRlcmdlb1xcdFxcdFxcdGkyZ1xcbmFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFib1xcdFxcdFxcdHFib1xcbmFwcGxpY2F0aW9uL3ZuZC5pbnR1LnFmeFxcdFxcdFxcdHFmeFxcbmFwcGxpY2F0aW9uL3ZuZC5pcHVucGx1Z2dlZC5yY3Byb2ZpbGVcXHRcXHRyY3Byb2ZpbGVcXG5hcHBsaWNhdGlvbi92bmQuaXJlcG9zaXRvcnkucGFja2FnZSt4bWxcXHRcXHRpcnBcXG5hcHBsaWNhdGlvbi92bmQuaXMteHByXFx0XFx0XFx0XFx0eHByXFxuYXBwbGljYXRpb24vdm5kLmlzYWMuZmNzXFx0XFx0XFx0ZmNzXFxuYXBwbGljYXRpb24vdm5kLmphbVxcdFxcdFxcdFxcdGphbVxcbmFwcGxpY2F0aW9uL3ZuZC5qY3AuamF2YW1lLm1pZGxldC1ybXNcXHRcXHRybXNcXG5hcHBsaWNhdGlvbi92bmQuamlzcFxcdFxcdFxcdFxcdGppc3BcXG5hcHBsaWNhdGlvbi92bmQuam9vc3Quam9kYS1hcmNoaXZlXFx0XFx0am9kYVxcbmFwcGxpY2F0aW9uL3ZuZC5rYWhvb3R6XFx0XFx0XFx0XFx0a3R6IGt0clxcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua2FyYm9uXFx0XFx0XFx0a2FyYm9uXFxuYXBwbGljYXRpb24vdm5kLmtkZS5rY2hhcnRcXHRcXHRcXHRjaHJ0XFxuYXBwbGljYXRpb24vdm5kLmtkZS5rZm9ybXVsYVxcdFxcdFxcdGtmb1xcbmFwcGxpY2F0aW9uL3ZuZC5rZGUua2l2aW9cXHRcXHRcXHRmbHdcXG5hcHBsaWNhdGlvbi92bmQua2RlLmtvbnRvdXJcXHRcXHRcXHRrb25cXG5hcHBsaWNhdGlvbi92bmQua2RlLmtwcmVzZW50ZXJcXHRcXHRcXHRrcHIga3B0XFxuYXBwbGljYXRpb24vdm5kLmtkZS5rc3ByZWFkXFx0XFx0XFx0a3NwXFxuYXBwbGljYXRpb24vdm5kLmtkZS5rd29yZFxcdFxcdFxcdGt3ZCBrd3RcXG5hcHBsaWNhdGlvbi92bmQua2VuYW1lYWFwcFxcdFxcdFxcdGh0a2VcXG5hcHBsaWNhdGlvbi92bmQua2lkc3BpcmF0aW9uXFx0XFx0XFx0a2lhXFxuYXBwbGljYXRpb24vdm5kLmtpbmFyXFx0XFx0XFx0XFx0a25lIGtucFxcbmFwcGxpY2F0aW9uL3ZuZC5rb2FuXFx0XFx0XFx0XFx0c2twIHNrZCBza3Qgc2ttXFxuYXBwbGljYXRpb24vdm5kLmtvZGFrLWRlc2NyaXB0b3JcXHRcXHRzc2VcXG5hcHBsaWNhdGlvbi92bmQubGFzLmxhcyt4bWxcXHRcXHRcXHRsYXN4bWxcXG5hcHBsaWNhdGlvbi92bmQubGxhbWFncmFwaGljcy5saWZlLWJhbGFuY2UuZGVza3RvcFxcdGxiZFxcbmFwcGxpY2F0aW9uL3ZuZC5sbGFtYWdyYXBoaWNzLmxpZmUtYmFsYW5jZS5leGNoYW5nZSt4bWxcXHRsYmVcXG5hcHBsaWNhdGlvbi92bmQubG90dXMtMS0yLTNcXHRcXHRcXHQxMjNcXG5hcHBsaWNhdGlvbi92bmQubG90dXMtYXBwcm9hY2hcXHRcXHRcXHRhcHJcXG5hcHBsaWNhdGlvbi92bmQubG90dXMtZnJlZWxhbmNlXFx0XFx0XFx0cHJlXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLW5vdGVzXFx0XFx0XFx0bnNmXFxuYXBwbGljYXRpb24vdm5kLmxvdHVzLW9yZ2FuaXplclxcdFxcdFxcdG9yZ1xcbmFwcGxpY2F0aW9uL3ZuZC5sb3R1cy1zY3JlZW5jYW1cXHRcXHRcXHRzY21cXG5hcHBsaWNhdGlvbi92bmQubG90dXMtd29yZHByb1xcdFxcdFxcdGx3cFxcbmFwcGxpY2F0aW9uL3ZuZC5tYWNwb3J0cy5wb3J0cGtnXFx0XFx0cG9ydHBrZ1xcbmFwcGxpY2F0aW9uL3ZuZC5tY2RcXHRcXHRcXHRcXHRtY2RcXG5hcHBsaWNhdGlvbi92bmQubWVkY2FsY2RhdGFcXHRcXHRcXHRtYzFcXG5hcHBsaWNhdGlvbi92bmQubWVkaWFzdGF0aW9uLmNka2V5XFx0XFx0Y2RrZXlcXG5hcHBsaWNhdGlvbi92bmQubWZlclxcdFxcdFxcdFxcdG13ZlxcbmFwcGxpY2F0aW9uL3ZuZC5tZm1wXFx0XFx0XFx0XFx0bWZtXFxuYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguZmxvXFx0XFx0XFx0ZmxvXFxuYXBwbGljYXRpb24vdm5kLm1pY3JvZ3JhZnguaWd4XFx0XFx0XFx0aWd4XFxuYXBwbGljYXRpb24vdm5kLm1pZlxcdFxcdFxcdFxcdG1pZlxcbmFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMuZGFmXFx0XFx0XFx0ZGFmXFxuYXBwbGljYXRpb24vdm5kLm1vYml1cy5kaXNcXHRcXHRcXHRkaXNcXG5hcHBsaWNhdGlvbi92bmQubW9iaXVzLm1ia1xcdFxcdFxcdG1ia1xcbmFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMubXF5XFx0XFx0XFx0bXF5XFxuYXBwbGljYXRpb24vdm5kLm1vYml1cy5tc2xcXHRcXHRcXHRtc2xcXG5hcHBsaWNhdGlvbi92bmQubW9iaXVzLnBsY1xcdFxcdFxcdHBsY1xcbmFwcGxpY2F0aW9uL3ZuZC5tb2JpdXMudHhmXFx0XFx0XFx0dHhmXFxuYXBwbGljYXRpb24vdm5kLm1vcGh1bi5hcHBsaWNhdGlvblxcdFxcdG1wblxcbmFwcGxpY2F0aW9uL3ZuZC5tb3BodW4uY2VydGlmaWNhdGVcXHRcXHRtcGNcXG5hcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sXFx0XFx0XFx0eHVsXFxuYXBwbGljYXRpb24vdm5kLm1zLWFydGdhbHJ5XFx0XFx0XFx0Y2lsXFxuYXBwbGljYXRpb24vdm5kLm1zLWNhYi1jb21wcmVzc2VkXFx0XFx0Y2FiXFxuYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsXFx0XFx0XFx0eGxzIHhsbSB4bGEgeGxjIHhsdCB4bHdcXG5hcHBsaWNhdGlvbi92bmQubXMtZXhjZWwuYWRkaW4ubWFjcm9lbmFibGVkLjEyXFx0XFx0eGxhbVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5iaW5hcnkubWFjcm9lbmFibGVkLjEyXFx0eGxzYlxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbC5zaGVldC5tYWNyb2VuYWJsZWQuMTJcXHRcXHR4bHNtXFxuYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsLnRlbXBsYXRlLm1hY3JvZW5hYmxlZC4xMlxcdHhsdG1cXG5hcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdFxcdFxcdFxcdGVvdFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1odG1saGVscFxcdFxcdFxcdGNobVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1pbXNcXHRcXHRcXHRcXHRpbXNcXG5hcHBsaWNhdGlvbi92bmQubXMtbHJtXFx0XFx0XFx0XFx0bHJtXFxuYXBwbGljYXRpb24vdm5kLm1zLW9mZmljZXRoZW1lXFx0XFx0XFx0dGhteFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wa2kuc2VjY2F0XFx0XFx0XFx0Y2F0XFxuYXBwbGljYXRpb24vdm5kLm1zLXBraS5zdGxcXHRcXHRcXHRzdGxcXG5hcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludFxcdFxcdFxcdHBwdCBwcHMgcG90XFxuYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuYWRkaW4ubWFjcm9lbmFibGVkLjEyXFx0XFx0cHBhbVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnByZXNlbnRhdGlvbi5tYWNyb2VuYWJsZWQuMTJcXHRwcHRtXFxuYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQuc2xpZGUubWFjcm9lbmFibGVkLjEyXFx0XFx0c2xkbVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LnNsaWRlc2hvdy5tYWNyb2VuYWJsZWQuMTJcXHRcXHRwcHNtXFxuYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQudGVtcGxhdGUubWFjcm9lbmFibGVkLjEyXFx0XFx0cG90bVxcbmFwcGxpY2F0aW9uL3ZuZC5tcy1wcm9qZWN0XFx0XFx0XFx0bXBwIG1wdFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy13b3JkLmRvY3VtZW50Lm1hY3JvZW5hYmxlZC4xMlxcdGRvY21cXG5hcHBsaWNhdGlvbi92bmQubXMtd29yZC50ZW1wbGF0ZS5tYWNyb2VuYWJsZWQuMTJcXHRkb3RtXFxuYXBwbGljYXRpb24vdm5kLm1zLXdvcmtzXFx0XFx0XFx0d3BzIHdrcyB3Y20gd2RiXFxuYXBwbGljYXRpb24vdm5kLm1zLXdwbFxcdFxcdFxcdFxcdHdwbFxcbmFwcGxpY2F0aW9uL3ZuZC5tcy14cHNkb2N1bWVudFxcdFxcdFxcdHhwc1xcbmFwcGxpY2F0aW9uL3ZuZC5tc2VxXFx0XFx0XFx0XFx0bXNlcVxcbmFwcGxpY2F0aW9uL3ZuZC5tdXNpY2lhblxcdFxcdFxcdG11c1xcbmFwcGxpY2F0aW9uL3ZuZC5tdXZlZS5zdHlsZVxcdFxcdFxcdG1zdHlcXG5hcHBsaWNhdGlvbi92bmQubXluZmNcXHRcXHRcXHRcXHR0YWdsZXRcXG5hcHBsaWNhdGlvbi92bmQubmV1cm9sYW5ndWFnZS5ubHVcXHRcXHRubHVcXG5hcHBsaWNhdGlvbi92bmQubml0ZlxcdFxcdFxcdFxcdG50ZiBuaXRmXFxuYXBwbGljYXRpb24vdm5kLm5vYmxlbmV0LWRpcmVjdG9yeVxcdFxcdG5uZFxcbmFwcGxpY2F0aW9uL3ZuZC5ub2JsZW5ldC1zZWFsZXJcXHRcXHRcXHRubnNcXG5hcHBsaWNhdGlvbi92bmQubm9ibGVuZXQtd2ViXFx0XFx0XFx0bm53XFxuYXBwbGljYXRpb24vdm5kLm5va2lhLm4tZ2FnZS5kYXRhXFx0XFx0bmdkYXRcXG5hcHBsaWNhdGlvbi92bmQubm9raWEubi1nYWdlLnN5bWJpYW4uaW5zdGFsbFxcdG4tZ2FnZVxcbmFwcGxpY2F0aW9uL3ZuZC5ub2tpYS5yYWRpby1wcmVzZXRcXHRcXHRycHN0XFxuYXBwbGljYXRpb24vdm5kLm5va2lhLnJhZGlvLXByZXNldHNcXHRcXHRycHNzXFxuYXBwbGljYXRpb24vdm5kLm5vdmFkaWdtLmVkbVxcdFxcdFxcdGVkbVxcbmFwcGxpY2F0aW9uL3ZuZC5ub3ZhZGlnbS5lZHhcXHRcXHRcXHRlZHhcXG5hcHBsaWNhdGlvbi92bmQubm92YWRpZ20uZXh0XFx0XFx0XFx0ZXh0XFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5jaGFydFxcdFxcdG9kY1xcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuY2hhcnQtdGVtcGxhdGVcXHRvdGNcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmRhdGFiYXNlXFx0XFx0b2RiXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhXFx0XFx0b2RmXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5mb3JtdWxhLXRlbXBsYXRlXFx0b2RmdFxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuZ3JhcGhpY3NcXHRcXHRvZGdcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LmdyYXBoaWNzLXRlbXBsYXRlXFx0b3RnXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5pbWFnZVxcdFxcdG9kaVxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuaW1hZ2UtdGVtcGxhdGVcXHRvdGlcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvblxcdFxcdG9kcFxcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uLXRlbXBsYXRlXFx0b3RwXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldFxcdFxcdG9kc1xcbmFwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQtdGVtcGxhdGVcXHRvdHNcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHRcXHRcXHRcXHRvZHRcXG5hcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQtbWFzdGVyXFx0XFx0b2RtXFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXRlbXBsYXRlXFx0b3R0XFxuYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0LXdlYlxcdFxcdG90aFxcbmFwcGxpY2F0aW9uL3ZuZC5vbHBjLXN1Z2FyXFx0XFx0XFx0eG9cXG5hcHBsaWNhdGlvbi92bmQub21hLmRkMit4bWxcXHRcXHRcXHRkZDJcXG5hcHBsaWNhdGlvbi92bmQub3Blbm9mZmljZW9yZy5leHRlbnNpb25cXHRcXHRveHRcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uXFx0cHB0eFxcbmFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5zbGlkZVxcdHNsZHhcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwuc2xpZGVzaG93XFx0cHBzeFxcbmFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC50ZW1wbGF0ZVxcdHBvdHhcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldFxcdHhsc3hcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC50ZW1wbGF0ZVxcdHhsdHhcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudFxcdGRvY3hcXG5hcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC50ZW1wbGF0ZVxcdGRvdHhcXG5hcHBsaWNhdGlvbi92bmQub3NnZW8ubWFwZ3VpZGUucGFja2FnZVxcdFxcdG1ncFxcbmFwcGxpY2F0aW9uL3ZuZC5vc2dpLmRwXFx0XFx0XFx0XFx0ZHBcXG5hcHBsaWNhdGlvbi92bmQub3NnaS5zdWJzeXN0ZW1cXHRcXHRcXHRlc2FcXG5hcHBsaWNhdGlvbi92bmQucGFsbVxcdFxcdFxcdFxcdHBkYiBwcWEgb3ByY1xcbmFwcGxpY2F0aW9uL3ZuZC5wYXdhYWZpbGVcXHRcXHRcXHRwYXdcXG5hcHBsaWNhdGlvbi92bmQucGcuZm9ybWF0XFx0XFx0XFx0c3RyXFxuYXBwbGljYXRpb24vdm5kLnBnLm9zYXNsaVxcdFxcdFxcdGVpNlxcbmFwcGxpY2F0aW9uL3ZuZC5waWNzZWxcXHRcXHRcXHRcXHRlZmlmXFxuYXBwbGljYXRpb24vdm5kLnBtaS53aWRnZXRcXHRcXHRcXHR3Z1xcbmFwcGxpY2F0aW9uL3ZuZC5wb2NrZXRsZWFyblxcdFxcdFxcdHBsZlxcbmFwcGxpY2F0aW9uL3ZuZC5wb3dlcmJ1aWxkZXI2XFx0XFx0XFx0cGJkXFxuYXBwbGljYXRpb24vdm5kLnByZXZpZXdzeXN0ZW1zLmJveFxcdFxcdGJveFxcbmFwcGxpY2F0aW9uL3ZuZC5wcm90ZXVzLm1hZ2F6aW5lXFx0XFx0bWd6XFxuYXBwbGljYXRpb24vdm5kLnB1Ymxpc2hhcmUtZGVsdGEtdHJlZVxcdFxcdHFwc1xcbmFwcGxpY2F0aW9uL3ZuZC5wdmkucHRpZDFcXHRcXHRcXHRwdGlkXFxuYXBwbGljYXRpb24vdm5kLnF1YXJrLnF1YXJreHByZXNzXFx0XFx0cXhkIHF4dCBxd2QgcXd0IHF4bCBxeGJcXG5hcHBsaWNhdGlvbi92bmQucmVhbHZuYy5iZWRcXHRcXHRcXHRiZWRcXG5hcHBsaWNhdGlvbi92bmQucmVjb3JkYXJlLm11c2ljeG1sXFx0XFx0bXhsXFxuYXBwbGljYXRpb24vdm5kLnJlY29yZGFyZS5tdXNpY3htbCt4bWxcXHRcXHRtdXNpY3htbFxcbmFwcGxpY2F0aW9uL3ZuZC5yaWcuY3J5cHRvbm90ZVxcdFxcdFxcdGNyeXB0b25vdGVcXG5hcHBsaWNhdGlvbi92bmQucmltLmNvZFxcdFxcdFxcdFxcdGNvZFxcbmFwcGxpY2F0aW9uL3ZuZC5ybi1yZWFsbWVkaWFcXHRcXHRcXHRybVxcbmFwcGxpY2F0aW9uL3ZuZC5ybi1yZWFsbWVkaWEtdmJyXFx0XFx0cm12YlxcbmFwcGxpY2F0aW9uL3ZuZC5yb3V0ZTY2Lmxpbms2Nit4bWxcXHRcXHRsaW5rNjZcXG5hcHBsaWNhdGlvbi92bmQuc2FpbGluZ3RyYWNrZXIudHJhY2tcXHRcXHRzdFxcbmFwcGxpY2F0aW9uL3ZuZC5zZWVtYWlsXFx0XFx0XFx0XFx0c2VlXFxuYXBwbGljYXRpb24vdm5kLnNlbWFcXHRcXHRcXHRcXHRzZW1hXFxuYXBwbGljYXRpb24vdm5kLnNlbWRcXHRcXHRcXHRcXHRzZW1kXFxuYXBwbGljYXRpb24vdm5kLnNlbWZcXHRcXHRcXHRcXHRzZW1mXFxuYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm1kYXRhXFx0XFx0aWZtXFxuYXBwbGljYXRpb24vdm5kLnNoYW5hLmluZm9ybWVkLmZvcm10ZW1wbGF0ZVxcdGl0cFxcbmFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5pbnRlcmNoYW5nZVxcdGlpZlxcbmFwcGxpY2F0aW9uL3ZuZC5zaGFuYS5pbmZvcm1lZC5wYWNrYWdlXFx0XFx0aXBrXFxuYXBwbGljYXRpb24vdm5kLnNpbXRlY2gtbWluZG1hcHBlclxcdFxcdHR3ZCB0d2RzXFxuYXBwbGljYXRpb24vdm5kLnNtYWZcXHRcXHRcXHRcXHRtbWZcXG5hcHBsaWNhdGlvbi92bmQuc21hcnQudGVhY2hlclxcdFxcdFxcdHRlYWNoZXJcXG5hcHBsaWNhdGlvbi92bmQuc29sZW50LnNka20reG1sXFx0XFx0XFx0c2RrbSBzZGtkXFxuYXBwbGljYXRpb24vdm5kLnNwb3RmaXJlLmR4cFxcdFxcdFxcdGR4cFxcbmFwcGxpY2F0aW9uL3ZuZC5zcG90ZmlyZS5zZnNcXHRcXHRcXHRzZnNcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmNhbGNcXHRcXHRzZGNcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmRyYXdcXHRcXHRzZGFcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLmltcHJlc3NcXHRcXHRzZGRcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLm1hdGhcXHRcXHRzbWZcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlclxcdFxcdHNkdyB2b3JcXG5hcHBsaWNhdGlvbi92bmQuc3RhcmRpdmlzaW9uLndyaXRlci1nbG9iYWxcXHRzZ2xcXG5hcHBsaWNhdGlvbi92bmQuc3RlcG1hbmlhLnBhY2thZ2VcXHRcXHRzbXppcFxcbmFwcGxpY2F0aW9uL3ZuZC5zdGVwbWFuaWEuc3RlcGNoYXJ0XFx0XFx0c21cXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5jYWxjXFx0XFx0XFx0c3hjXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwuY2FsYy50ZW1wbGF0ZVxcdFxcdHN0Y1xcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmRyYXdcXHRcXHRcXHRzeGRcXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5kcmF3LnRlbXBsYXRlXFx0XFx0c3RkXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwuaW1wcmVzc1xcdFxcdFxcdHN4aVxcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLmltcHJlc3MudGVtcGxhdGVcXHRzdGlcXG5hcHBsaWNhdGlvbi92bmQuc3VuLnhtbC5tYXRoXFx0XFx0XFx0c3htXFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyXFx0XFx0XFx0c3h3XFxuYXBwbGljYXRpb24vdm5kLnN1bi54bWwud3JpdGVyLmdsb2JhbFxcdFxcdHN4Z1xcbmFwcGxpY2F0aW9uL3ZuZC5zdW4ueG1sLndyaXRlci50ZW1wbGF0ZVxcdFxcdHN0d1xcbmFwcGxpY2F0aW9uL3ZuZC5zdXMtY2FsZW5kYXJcXHRcXHRcXHRzdXMgc3VzcFxcbmFwcGxpY2F0aW9uL3ZuZC5zdmRcXHRcXHRcXHRcXHRzdmRcXG5hcHBsaWNhdGlvbi92bmQuc3ltYmlhbi5pbnN0YWxsXFx0XFx0XFx0c2lzIHNpc3hcXG5hcHBsaWNhdGlvbi92bmQuc3luY21sK3htbFxcdFxcdFxcdHhzbVxcbmFwcGxpY2F0aW9uL3ZuZC5zeW5jbWwuZG0rd2J4bWxcXHRcXHRcXHRiZG1cXG5hcHBsaWNhdGlvbi92bmQuc3luY21sLmRtK3htbFxcdFxcdFxcdHhkbVxcbmFwcGxpY2F0aW9uL3ZuZC50YW8uaW50ZW50LW1vZHVsZS1hcmNoaXZlXFx0dGFvXFxuYXBwbGljYXRpb24vdm5kLnRjcGR1bXAucGNhcFxcdFxcdFxcdHBjYXAgY2FwIGRtcFxcbmFwcGxpY2F0aW9uL3ZuZC50bW9iaWxlLWxpdmV0dlxcdFxcdFxcdHRtb1xcbmFwcGxpY2F0aW9uL3ZuZC50cmlkLnRwdFxcdFxcdFxcdHRwdFxcbmFwcGxpY2F0aW9uL3ZuZC50cmlzY2FwZS5teHNcXHRcXHRcXHRteHNcXG5hcHBsaWNhdGlvbi92bmQudHJ1ZWFwcFxcdFxcdFxcdFxcdHRyYVxcbmFwcGxpY2F0aW9uL3ZuZC51ZmRsXFx0XFx0XFx0XFx0dWZkIHVmZGxcXG5hcHBsaWNhdGlvbi92bmQudWlxLnRoZW1lXFx0XFx0XFx0dXR6XFxuYXBwbGljYXRpb24vdm5kLnVtYWppblxcdFxcdFxcdFxcdHVtalxcbmFwcGxpY2F0aW9uL3ZuZC51bml0eVxcdFxcdFxcdFxcdHVuaXR5d2ViXFxuYXBwbGljYXRpb24vdm5kLnVvbWwreG1sXFx0XFx0XFx0dW9tbFxcbmFwcGxpY2F0aW9uL3ZuZC52Y3hcXHRcXHRcXHRcXHR2Y3hcXG5hcHBsaWNhdGlvbi92bmQudmlzaW9cXHRcXHRcXHRcXHR2c2QgdnN0IHZzcyB2c3dcXG5hcHBsaWNhdGlvbi92bmQudmlzaW9uYXJ5XFx0XFx0XFx0dmlzXFxuYXBwbGljYXRpb24vdm5kLnZzZlxcdFxcdFxcdFxcdHZzZlxcbmFwcGxpY2F0aW9uL3ZuZC53YXAud2J4bWxcXHRcXHRcXHR3YnhtbFxcbmFwcGxpY2F0aW9uL3ZuZC53YXAud21sY1xcdFxcdFxcdHdtbGNcXG5hcHBsaWNhdGlvbi92bmQud2FwLndtbHNjcmlwdGNcXHRcXHRcXHR3bWxzY1xcbmFwcGxpY2F0aW9uL3ZuZC53ZWJ0dXJib1xcdFxcdFxcdHd0YlxcbmFwcGxpY2F0aW9uL3ZuZC53b2xmcmFtLnBsYXllclxcdFxcdFxcdG5icFxcbmFwcGxpY2F0aW9uL3ZuZC53b3JkcGVyZmVjdFxcdFxcdFxcdHdwZFxcbmFwcGxpY2F0aW9uL3ZuZC53cWRcXHRcXHRcXHRcXHR3cWRcXG5hcHBsaWNhdGlvbi92bmQud3Quc3RmXFx0XFx0XFx0XFx0c3RmXFxuYXBwbGljYXRpb24vdm5kLnhhcmFcXHRcXHRcXHRcXHR4YXJcXG5hcHBsaWNhdGlvbi92bmQueGZkbFxcdFxcdFxcdFxcdHhmZGxcXG5hcHBsaWNhdGlvbi92bmQueWFtYWhhLmh2LWRpY1xcdFxcdFxcdGh2ZFxcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEuaHYtc2NyaXB0XFx0XFx0aHZzXFxuYXBwbGljYXRpb24vdm5kLnlhbWFoYS5odi12b2ljZVxcdFxcdFxcdGh2cFxcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEub3BlbnNjb3JlZm9ybWF0XFx0XFx0XFx0b3NmXFxuYXBwbGljYXRpb24vdm5kLnlhbWFoYS5vcGVuc2NvcmVmb3JtYXQub3NmcHZnK3htbFxcdG9zZnB2Z1xcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEuc21hZi1hdWRpb1xcdFxcdHNhZlxcbmFwcGxpY2F0aW9uL3ZuZC55YW1haGEuc21hZi1waHJhc2VcXHRcXHRzcGZcXG5hcHBsaWNhdGlvbi92bmQueWVsbG93cml2ZXItY3VzdG9tLW1lbnVcXHRcXHRjbXBcXG5hcHBsaWNhdGlvbi92bmQuenVsXFx0XFx0XFx0XFx0emlyIHppcnpcXG5hcHBsaWNhdGlvbi92bmQuenphenouZGVjayt4bWxcXHRcXHRcXHR6YXpcXG5hcHBsaWNhdGlvbi92b2ljZXhtbCt4bWxcXHRcXHRcXHR2eG1sXFxuYXBwbGljYXRpb24vd2FzbVxcdFxcdFxcdFxcdHdhc21cXG5hcHBsaWNhdGlvbi93aWRnZXRcXHRcXHRcXHRcXHR3Z3RcXG5hcHBsaWNhdGlvbi93aW5obHBcXHRcXHRcXHRcXHRobHBcXG5hcHBsaWNhdGlvbi93c2RsK3htbFxcdFxcdFxcdFxcdHdzZGxcXG5hcHBsaWNhdGlvbi93c3BvbGljeSt4bWxcXHRcXHRcXHR3c3BvbGljeVxcbmFwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZFxcdFxcdFxcdDd6XFxuYXBwbGljYXRpb24veC1hYml3b3JkXFx0XFx0XFx0XFx0YWJ3XFxuYXBwbGljYXRpb24veC1hY2UtY29tcHJlc3NlZFxcdFxcdFxcdGFjZVxcbmFwcGxpY2F0aW9uL3gtYXBwbGUtZGlza2ltYWdlXFx0XFx0XFx0ZG1nXFxuYXBwbGljYXRpb24veC1hdXRob3J3YXJlLWJpblxcdFxcdFxcdGFhYiB4MzIgdTMyIHZveFxcbmFwcGxpY2F0aW9uL3gtYXV0aG9yd2FyZS1tYXBcXHRcXHRcXHRhYW1cXG5hcHBsaWNhdGlvbi94LWF1dGhvcndhcmUtc2VnXFx0XFx0XFx0YWFzXFxuYXBwbGljYXRpb24veC1iY3Bpb1xcdFxcdFxcdFxcdGJjcGlvXFxuYXBwbGljYXRpb24veC1iaXR0b3JyZW50XFx0XFx0XFx0dG9ycmVudFxcbmFwcGxpY2F0aW9uL3gtYmxvcmJcXHRcXHRcXHRcXHRibGIgYmxvcmJcXG5hcHBsaWNhdGlvbi94LWJ6aXBcXHRcXHRcXHRcXHRielxcbmFwcGxpY2F0aW9uL3gtYnppcDJcXHRcXHRcXHRcXHRiejIgYm96XFxuYXBwbGljYXRpb24veC1jYnJcXHRcXHRcXHRcXHRjYnIgY2JhIGNidCBjYnogY2I3XFxuYXBwbGljYXRpb24veC1jZGxpbmtcXHRcXHRcXHRcXHR2Y2RcXG5hcHBsaWNhdGlvbi94LWNmcy1jb21wcmVzc2VkXFx0XFx0XFx0Y2ZzXFxuYXBwbGljYXRpb24veC1jaGF0XFx0XFx0XFx0XFx0Y2hhdFxcbmFwcGxpY2F0aW9uL3gtY2hlc3MtcGduXFx0XFx0XFx0XFx0cGduXFxuYXBwbGljYXRpb24veC1jb25mZXJlbmNlXFx0XFx0XFx0bnNjXFxuYXBwbGljYXRpb24veC1jcGlvXFx0XFx0XFx0XFx0Y3Bpb1xcbmFwcGxpY2F0aW9uL3gtY3NoXFx0XFx0XFx0XFx0Y3NoXFxuYXBwbGljYXRpb24veC1kZWJpYW4tcGFja2FnZVxcdFxcdFxcdGRlYiB1ZGViXFxuYXBwbGljYXRpb24veC1kZ2MtY29tcHJlc3NlZFxcdFxcdFxcdGRnY1xcbmFwcGxpY2F0aW9uL3gtZGlyZWN0b3JcXHRcXHRcXHRkaXIgZGNyIGR4ciBjc3QgY2N0IGN4dCB3M2QgZmdkIHN3YVxcbmFwcGxpY2F0aW9uL3gtZG9vbVxcdFxcdFxcdFxcdHdhZFxcbmFwcGxpY2F0aW9uL3gtZHRibmN4K3htbFxcdFxcdFxcdG5jeFxcbmFwcGxpY2F0aW9uL3gtZHRib29rK3htbFxcdFxcdFxcdGR0YlxcbmFwcGxpY2F0aW9uL3gtZHRicmVzb3VyY2UreG1sXFx0XFx0XFx0cmVzXFxuYXBwbGljYXRpb24veC1kdmlcXHRcXHRcXHRcXHRkdmlcXG5hcHBsaWNhdGlvbi94LWVudm95XFx0XFx0XFx0XFx0ZXZ5XFxuYXBwbGljYXRpb24veC1ldmFcXHRcXHRcXHRcXHRldmFcXG5hcHBsaWNhdGlvbi94LWZvbnQtYmRmXFx0XFx0XFx0XFx0YmRmXFxuYXBwbGljYXRpb24veC1mb250LWdob3N0c2NyaXB0XFx0XFx0XFx0Z3NmXFxuYXBwbGljYXRpb24veC1mb250LWxpbnV4LXBzZlxcdFxcdFxcdHBzZlxcbmFwcGxpY2F0aW9uL3gtZm9udC1wY2ZcXHRcXHRcXHRcXHRwY2ZcXG5hcHBsaWNhdGlvbi94LWZvbnQtc25mXFx0XFx0XFx0XFx0c25mXFxuYXBwbGljYXRpb24veC1mb250LXR5cGUxXFx0XFx0XFx0cGZhIHBmYiBwZm0gYWZtXFxuYXBwbGljYXRpb24veC1mcmVlYXJjXFx0XFx0XFx0XFx0YXJjXFxuYXBwbGljYXRpb24veC1mdXR1cmVzcGxhc2hcXHRcXHRcXHRzcGxcXG5hcHBsaWNhdGlvbi94LWdjYS1jb21wcmVzc2VkXFx0XFx0XFx0Z2NhXFxuYXBwbGljYXRpb24veC1nbHVseFxcdFxcdFxcdFxcdHVseFxcbmFwcGxpY2F0aW9uL3gtZ251bWVyaWNcXHRcXHRcXHRcXHRnbnVtZXJpY1xcbmFwcGxpY2F0aW9uL3gtZ3JhbXBzLXhtbFxcdFxcdFxcdGdyYW1wc1xcbmFwcGxpY2F0aW9uL3gtZ3RhclxcdFxcdFxcdFxcdGd0YXJcXG5hcHBsaWNhdGlvbi94LWhkZlxcdFxcdFxcdFxcdGhkZlxcbmFwcGxpY2F0aW9uL3gtaW5zdGFsbC1pbnN0cnVjdGlvbnNcXHRcXHRpbnN0YWxsXFxuYXBwbGljYXRpb24veC1pc285NjYwLWltYWdlXFx0XFx0XFx0aXNvXFxuYXBwbGljYXRpb24veC1qYXZhLWpubHAtZmlsZVxcdFxcdFxcdGpubHBcXG5hcHBsaWNhdGlvbi94LWxhdGV4XFx0XFx0XFx0XFx0bGF0ZXhcXG5hcHBsaWNhdGlvbi94LWx6aC1jb21wcmVzc2VkXFx0XFx0XFx0bHpoIGxoYVxcbmFwcGxpY2F0aW9uL3gtbWllXFx0XFx0XFx0XFx0bWllXFxuYXBwbGljYXRpb24veC1tb2JpcG9ja2V0LWVib29rXFx0XFx0XFx0cHJjIG1vYmlcXG5hcHBsaWNhdGlvbi94LW1zLWFwcGxpY2F0aW9uXFx0XFx0XFx0YXBwbGljYXRpb25cXG5hcHBsaWNhdGlvbi94LW1zLXNob3J0Y3V0XFx0XFx0XFx0bG5rXFxuYXBwbGljYXRpb24veC1tcy13bWRcXHRcXHRcXHRcXHR3bWRcXG5hcHBsaWNhdGlvbi94LW1zLXdtelxcdFxcdFxcdFxcdHdtelxcbmFwcGxpY2F0aW9uL3gtbXMteGJhcFxcdFxcdFxcdFxcdHhiYXBcXG5hcHBsaWNhdGlvbi94LW1zYWNjZXNzXFx0XFx0XFx0XFx0bWRiXFxuYXBwbGljYXRpb24veC1tc2JpbmRlclxcdFxcdFxcdFxcdG9iZFxcbmFwcGxpY2F0aW9uL3gtbXNjYXJkZmlsZVxcdFxcdFxcdGNyZFxcbmFwcGxpY2F0aW9uL3gtbXNjbGlwXFx0XFx0XFx0XFx0Y2xwXFxuYXBwbGljYXRpb24veC1tc2Rvd25sb2FkXFx0XFx0XFx0ZXhlIGRsbCBjb20gYmF0IG1zaVxcbmFwcGxpY2F0aW9uL3gtbXNtZWRpYXZpZXdcXHRcXHRcXHRtdmIgbTEzIG0xNFxcbmFwcGxpY2F0aW9uL3gtbXNtZXRhZmlsZVxcdFxcdFxcdHdtZiB3bXogZW1mIGVtelxcbmFwcGxpY2F0aW9uL3gtbXNtb25leVxcdFxcdFxcdFxcdG1ueVxcbmFwcGxpY2F0aW9uL3gtbXNwdWJsaXNoZXJcXHRcXHRcXHRwdWJcXG5hcHBsaWNhdGlvbi94LW1zc2NoZWR1bGVcXHRcXHRcXHRzY2RcXG5hcHBsaWNhdGlvbi94LW1zdGVybWluYWxcXHRcXHRcXHR0cm1cXG5hcHBsaWNhdGlvbi94LW1zd3JpdGVcXHRcXHRcXHRcXHR3cmlcXG5hcHBsaWNhdGlvbi94LW5ldGNkZlxcdFxcdFxcdFxcdG5jIGNkZlxcbmFwcGxpY2F0aW9uL3gtbnpiXFx0XFx0XFx0XFx0bnpiXFxuYXBwbGljYXRpb24veC1wa2NzMTJcXHRcXHRcXHRcXHRwMTIgcGZ4XFxuYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0aWZpY2F0ZXNcXHRcXHRwN2Igc3BjXFxuYXBwbGljYXRpb24veC1wa2NzNy1jZXJ0cmVxcmVzcFxcdFxcdFxcdHA3clxcbmFwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWRcXHRcXHRcXHRyYXJcXG5hcHBsaWNhdGlvbi94LXJlc2VhcmNoLWluZm8tc3lzdGVtc1xcdFxcdHJpc1xcbmFwcGxpY2F0aW9uL3gtc2hcXHRcXHRcXHRcXHRzaFxcbmFwcGxpY2F0aW9uL3gtc2hhclxcdFxcdFxcdFxcdHNoYXJcXG5hcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaFxcdFxcdFxcdHN3ZlxcbmFwcGxpY2F0aW9uL3gtc2lsdmVybGlnaHQtYXBwXFx0XFx0XFx0eGFwXFxuYXBwbGljYXRpb24veC1zcWxcXHRcXHRcXHRcXHRzcWxcXG5hcHBsaWNhdGlvbi94LXN0dWZmaXRcXHRcXHRcXHRcXHRzaXRcXG5hcHBsaWNhdGlvbi94LXN0dWZmaXR4XFx0XFx0XFx0XFx0c2l0eFxcbmFwcGxpY2F0aW9uL3gtc3VicmlwXFx0XFx0XFx0XFx0c3J0XFxuYXBwbGljYXRpb24veC1zdjRjcGlvXFx0XFx0XFx0XFx0c3Y0Y3Bpb1xcbmFwcGxpY2F0aW9uL3gtc3Y0Y3JjXFx0XFx0XFx0XFx0c3Y0Y3JjXFxuYXBwbGljYXRpb24veC10M3ZtLWltYWdlXFx0XFx0XFx0dDNcXG5hcHBsaWNhdGlvbi94LXRhZHNcXHRcXHRcXHRcXHRnYW1cXG5hcHBsaWNhdGlvbi94LXRhclxcdFxcdFxcdFxcdHRhclxcbmFwcGxpY2F0aW9uL3gtdGNsXFx0XFx0XFx0XFx0dGNsXFxuYXBwbGljYXRpb24veC10ZXhcXHRcXHRcXHRcXHR0ZXhcXG5hcHBsaWNhdGlvbi94LXRleC10Zm1cXHRcXHRcXHRcXHR0Zm1cXG5hcHBsaWNhdGlvbi94LXRleGluZm9cXHRcXHRcXHRcXHR0ZXhpbmZvIHRleGlcXG5hcHBsaWNhdGlvbi94LXRnaWZcXHRcXHRcXHRcXHRvYmpcXG5hcHBsaWNhdGlvbi94LXVzdGFyXFx0XFx0XFx0XFx0dXN0YXJcXG5hcHBsaWNhdGlvbi94LXdhaXMtc291cmNlXFx0XFx0XFx0c3JjXFxuYXBwbGljYXRpb24veC14NTA5LWNhLWNlcnRcXHRcXHRcXHRkZXIgY3J0XFxuYXBwbGljYXRpb24veC14ZmlnXFx0XFx0XFx0XFx0ZmlnXFxuYXBwbGljYXRpb24veC14bGlmZit4bWxcXHRcXHRcXHRcXHR4bGZcXG5hcHBsaWNhdGlvbi94LXhwaW5zdGFsbFxcdFxcdFxcdFxcdHhwaVxcbmFwcGxpY2F0aW9uL3gteHpcXHRcXHRcXHRcXHR4elxcbmFwcGxpY2F0aW9uL3gtem1hY2hpbmVcXHRcXHRcXHRcXHR6MSB6MiB6MyB6NCB6NSB6NiB6NyB6OFxcbmFwcGxpY2F0aW9uL3hhbWwreG1sXFx0XFx0XFx0XFx0eGFtbFxcbmFwcGxpY2F0aW9uL3hjYXAtZGlmZit4bWxcXHRcXHRcXHR4ZGZcXG5hcHBsaWNhdGlvbi94ZW5jK3htbFxcdFxcdFxcdFxcdHhlbmNcXG5hcHBsaWNhdGlvbi94aHRtbCt4bWxcXHRcXHRcXHRcXHR4aHRtbCB4aHRcXG5hcHBsaWNhdGlvbi94bWxcXHRcXHRcXHRcXHRcXHR4bWwgeHNsXFxuYXBwbGljYXRpb24veG1sLWR0ZFxcdFxcdFxcdFxcdGR0ZFxcbmFwcGxpY2F0aW9uL3hvcCt4bWxcXHRcXHRcXHRcXHR4b3BcXG5hcHBsaWNhdGlvbi94cHJvYyt4bWxcXHRcXHRcXHRcXHR4cGxcXG5hcHBsaWNhdGlvbi94c2x0K3htbFxcdFxcdFxcdFxcdHhzbHRcXG5hcHBsaWNhdGlvbi94c3BmK3htbFxcdFxcdFxcdFxcdHhzcGZcXG5hcHBsaWNhdGlvbi94dit4bWxcXHRcXHRcXHRcXHRteG1sIHhodm1sIHh2bWwgeHZtXFxuYXBwbGljYXRpb24veWFuZ1xcdFxcdFxcdFxcdHlhbmdcXG5hcHBsaWNhdGlvbi95aW4reG1sXFx0XFx0XFx0XFx0eWluXFxuYXBwbGljYXRpb24vemlwXFx0XFx0XFx0XFx0XFx0emlwXFxuYXVkaW8vYWRwY21cXHRcXHRcXHRcXHRcXHRhZHBcXG5hdWRpby9iYXNpY1xcdFxcdFxcdFxcdFxcdGF1IHNuZFxcbmF1ZGlvL21pZGlcXHRcXHRcXHRcXHRcXHRtaWQgbWlkaSBrYXIgcm1pXFxuYXVkaW8vbXA0XFx0XFx0XFx0XFx0XFx0bTRhIG1wNGFcXG5hdWRpby9tcGVnXFx0XFx0XFx0XFx0XFx0bXBnYSBtcDIgbXAyYSBtcDMgbTJhIG0zYVxcbmF1ZGlvL29nZ1xcdFxcdFxcdFxcdFxcdG9nYSBvZ2cgc3B4XFxuYXVkaW8vczNtXFx0XFx0XFx0XFx0XFx0czNtXFxuYXVkaW8vc2lsa1xcdFxcdFxcdFxcdFxcdHNpbFxcbmF1ZGlvL3ZuZC5kZWNlLmF1ZGlvXFx0XFx0XFx0XFx0dXZhIHV2dmFcXG5hdWRpby92bmQuZGlnaXRhbC13aW5kc1xcdFxcdFxcdFxcdGVvbFxcbmF1ZGlvL3ZuZC5kcmFcXHRcXHRcXHRcXHRcXHRkcmFcXG5hdWRpby92bmQuZHRzXFx0XFx0XFx0XFx0XFx0ZHRzXFxuYXVkaW8vdm5kLmR0cy5oZFxcdFxcdFxcdFxcdGR0c2hkXFxuYXVkaW8vdm5kLmx1Y2VudC52b2ljZVxcdFxcdFxcdFxcdGx2cFxcbmF1ZGlvL3ZuZC5tcy1wbGF5cmVhZHkubWVkaWEucHlhXFx0XFx0cHlhXFxuYXVkaW8vdm5kLm51ZXJhLmVjZWxwNDgwMFxcdFxcdFxcdGVjZWxwNDgwMFxcbmF1ZGlvL3ZuZC5udWVyYS5lY2VscDc0NzBcXHRcXHRcXHRlY2VscDc0NzBcXG5hdWRpby92bmQubnVlcmEuZWNlbHA5NjAwXFx0XFx0XFx0ZWNlbHA5NjAwXFxuYXVkaW8vdm5kLnJpcFxcdFxcdFxcdFxcdFxcdHJpcFxcbmF1ZGlvL3dlYm1cXHRcXHRcXHRcXHRcXHR3ZWJhXFxuYXVkaW8veC1hYWNcXHRcXHRcXHRcXHRcXHRhYWNcXG5hdWRpby94LWFpZmZcXHRcXHRcXHRcXHRcXHRhaWYgYWlmZiBhaWZjXFxuYXVkaW8veC1jYWZcXHRcXHRcXHRcXHRcXHRjYWZcXG5hdWRpby94LWZsYWNcXHRcXHRcXHRcXHRcXHRmbGFjXFxuYXVkaW8veC1tYXRyb3NrYVxcdFxcdFxcdFxcdG1rYVxcbmF1ZGlvL3gtbXBlZ3VybFxcdFxcdFxcdFxcdFxcdG0zdVxcbmF1ZGlvL3gtbXMtd2F4XFx0XFx0XFx0XFx0XFx0d2F4XFxuYXVkaW8veC1tcy13bWFcXHRcXHRcXHRcXHRcXHR3bWFcXG5hdWRpby94LXBuLXJlYWxhdWRpb1xcdFxcdFxcdFxcdHJhbSByYVxcbmF1ZGlvL3gtcG4tcmVhbGF1ZGlvLXBsdWdpblxcdFxcdFxcdHJtcFxcbmF1ZGlvL3gtd2F2XFx0XFx0XFx0XFx0XFx0d2F2XFxuYXVkaW8veG1cXHRcXHRcXHRcXHRcXHR4bVxcbmNoZW1pY2FsL3gtY2R4XFx0XFx0XFx0XFx0XFx0Y2R4XFxuY2hlbWljYWwveC1jaWZcXHRcXHRcXHRcXHRcXHRjaWZcXG5jaGVtaWNhbC94LWNtZGZcXHRcXHRcXHRcXHRcXHRjbWRmXFxuY2hlbWljYWwveC1jbWxcXHRcXHRcXHRcXHRcXHRjbWxcXG5jaGVtaWNhbC94LWNzbWxcXHRcXHRcXHRcXHRcXHRjc21sXFxuY2hlbWljYWwveC14eXpcXHRcXHRcXHRcXHRcXHR4eXpcXG5mb250L2NvbGxlY3Rpb25cXHRcXHRcXHRcXHRcXHR0dGNcXG5mb250L290ZlxcdFxcdFxcdFxcdFxcdG90ZlxcbmZvbnQvdHRmXFx0XFx0XFx0XFx0XFx0dHRmXFxuZm9udC93b2ZmXFx0XFx0XFx0XFx0XFx0d29mZlxcbmZvbnQvd29mZjJcXHRcXHRcXHRcXHRcXHR3b2ZmMlxcbmltYWdlL2JtcFxcdFxcdFxcdFxcdFxcdGJtcFxcbmltYWdlL2NnbVxcdFxcdFxcdFxcdFxcdGNnbVxcbmltYWdlL2czZmF4XFx0XFx0XFx0XFx0XFx0ZzNcXG5pbWFnZS9naWZcXHRcXHRcXHRcXHRcXHRnaWZcXG5pbWFnZS9pZWZcXHRcXHRcXHRcXHRcXHRpZWZcXG5pbWFnZS9qcGVnXFx0XFx0XFx0XFx0XFx0anBlZyBqcGcganBlXFxuaW1hZ2Uva3R4XFx0XFx0XFx0XFx0XFx0a3R4XFxuaW1hZ2UvcG5nXFx0XFx0XFx0XFx0XFx0cG5nXFxuaW1hZ2UvcHJzLmJ0aWZcXHRcXHRcXHRcXHRcXHRidGlmXFxuaW1hZ2Uvc2dpXFx0XFx0XFx0XFx0XFx0c2dpXFxuaW1hZ2Uvc3ZnK3htbFxcdFxcdFxcdFxcdFxcdHN2ZyBzdmd6XFxuaW1hZ2UvdGlmZlxcdFxcdFxcdFxcdFxcdHRpZmYgdGlmXFxuaW1hZ2Uvdm5kLmFkb2JlLnBob3Rvc2hvcFxcdFxcdFxcdHBzZFxcbmltYWdlL3ZuZC5kZWNlLmdyYXBoaWNcXHRcXHRcXHRcXHR1dmkgdXZ2aSB1dmcgdXZ2Z1xcbmltYWdlL3ZuZC5kanZ1XFx0XFx0XFx0XFx0XFx0ZGp2dSBkanZcXG5pbWFnZS92bmQuZHZiLnN1YnRpdGxlXFx0XFx0XFx0XFx0c3ViXFxuaW1hZ2Uvdm5kLmR3Z1xcdFxcdFxcdFxcdFxcdGR3Z1xcbmltYWdlL3ZuZC5keGZcXHRcXHRcXHRcXHRcXHRkeGZcXG5pbWFnZS92bmQuZmFzdGJpZHNoZWV0XFx0XFx0XFx0XFx0ZmJzXFxuaW1hZ2Uvdm5kLmZweFxcdFxcdFxcdFxcdFxcdGZweFxcbmltYWdlL3ZuZC5mc3RcXHRcXHRcXHRcXHRcXHRmc3RcXG5pbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1tbXJcXHRcXHRcXHRtbXJcXG5pbWFnZS92bmQuZnVqaXhlcm94LmVkbWljcy1ybGNcXHRcXHRcXHRybGNcXG5pbWFnZS92bmQubXMtbW9kaVxcdFxcdFxcdFxcdG1kaVxcbmltYWdlL3ZuZC5tcy1waG90b1xcdFxcdFxcdFxcdHdkcFxcbmltYWdlL3ZuZC5uZXQtZnB4XFx0XFx0XFx0XFx0bnB4XFxuaW1hZ2Uvdm5kLndhcC53Ym1wXFx0XFx0XFx0XFx0d2JtcFxcbmltYWdlL3ZuZC54aWZmXFx0XFx0XFx0XFx0XFx0eGlmXFxuaW1hZ2Uvd2VicFxcdFxcdFxcdFxcdFxcdHdlYnBcXG5pbWFnZS94LTNkc1xcdFxcdFxcdFxcdFxcdDNkc1xcbmltYWdlL3gtY211LXJhc3RlclxcdFxcdFxcdFxcdHJhc1xcbmltYWdlL3gtY214XFx0XFx0XFx0XFx0XFx0Y214XFxuaW1hZ2UveC1mcmVlaGFuZFxcdFxcdFxcdFxcdGZoIGZoYyBmaDQgZmg1IGZoN1xcbmltYWdlL3gtaWNvblxcdFxcdFxcdFxcdFxcdGljb1xcbmltYWdlL3gtbXJzaWQtaW1hZ2VcXHRcXHRcXHRcXHRzaWRcXG5pbWFnZS94LXBjeFxcdFxcdFxcdFxcdFxcdHBjeFxcbmltYWdlL3gtcGljdFxcdFxcdFxcdFxcdFxcdHBpYyBwY3RcXG5pbWFnZS94LXBvcnRhYmxlLWFueW1hcFxcdFxcdFxcdFxcdHBubVxcbmltYWdlL3gtcG9ydGFibGUtYml0bWFwXFx0XFx0XFx0XFx0cGJtXFxuaW1hZ2UveC1wb3J0YWJsZS1ncmF5bWFwXFx0XFx0XFx0cGdtXFxuaW1hZ2UveC1wb3J0YWJsZS1waXhtYXBcXHRcXHRcXHRcXHRwcG1cXG5pbWFnZS94LXJnYlxcdFxcdFxcdFxcdFxcdHJnYlxcbmltYWdlL3gtdGdhXFx0XFx0XFx0XFx0XFx0dGdhXFxuaW1hZ2UveC14Yml0bWFwXFx0XFx0XFx0XFx0XFx0eGJtXFxuaW1hZ2UveC14cGl4bWFwXFx0XFx0XFx0XFx0XFx0eHBtXFxuaW1hZ2UveC14d2luZG93ZHVtcFxcdFxcdFxcdFxcdHh3ZFxcbm1lc3NhZ2UvcmZjODIyXFx0XFx0XFx0XFx0XFx0ZW1sIG1pbWVcXG5tb2RlbC9pZ2VzXFx0XFx0XFx0XFx0XFx0aWdzIGlnZXNcXG5tb2RlbC9tZXNoXFx0XFx0XFx0XFx0XFx0bXNoIG1lc2ggc2lsb1xcbm1vZGVsL3ZuZC5jb2xsYWRhK3htbFxcdFxcdFxcdFxcdGRhZVxcbm1vZGVsL3ZuZC5kd2ZcXHRcXHRcXHRcXHRcXHRkd2ZcXG5tb2RlbC92bmQuZ2RsXFx0XFx0XFx0XFx0XFx0Z2RsXFxubW9kZWwvdm5kLmd0d1xcdFxcdFxcdFxcdFxcdGd0d1xcbm1vZGVsL3ZuZC5tdHNcXHRcXHRcXHRcXHRcXHRtdHNcXG5tb2RlbC92bmQudnR1XFx0XFx0XFx0XFx0XFx0dnR1XFxubW9kZWwvdnJtbFxcdFxcdFxcdFxcdFxcdHdybCB2cm1sXFxubW9kZWwveDNkK2JpbmFyeVxcdFxcdFxcdFxcdHgzZGIgeDNkYnpcXG5tb2RlbC94M2QrdnJtbFxcdFxcdFxcdFxcdFxcdHgzZHYgeDNkdnpcXG5tb2RlbC94M2QreG1sXFx0XFx0XFx0XFx0XFx0eDNkIHgzZHpcXG50ZXh0L2NhY2hlLW1hbmlmZXN0XFx0XFx0XFx0XFx0YXBwY2FjaGVcXG50ZXh0L2NhbGVuZGFyXFx0XFx0XFx0XFx0XFx0aWNzIGlmYlxcbnRleHQvY3NzXFx0XFx0XFx0XFx0XFx0Y3NzXFxudGV4dC9jc3ZcXHRcXHRcXHRcXHRcXHRjc3ZcXG50ZXh0L2h0bWxcXHRcXHRcXHRcXHRcXHRodG1sIGh0bVxcbnRleHQvbjNcXHRcXHRcXHRcXHRcXHRcXHRuM1xcbnRleHQvcGxhaW5cXHRcXHRcXHRcXHRcXHR0eHQgdGV4dCBjb25mIGRlZiBsaXN0IGxvZyBpblxcbnRleHQvcHJzLmxpbmVzLnRhZ1xcdFxcdFxcdFxcdGRzY1xcbnRleHQvcmljaHRleHRcXHRcXHRcXHRcXHRcXHRydHhcXG50ZXh0L3NnbWxcXHRcXHRcXHRcXHRcXHRzZ21sIHNnbVxcbnRleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXNcXHRcXHRcXHR0c3ZcXG50ZXh0L3Ryb2ZmXFx0XFx0XFx0XFx0XFx0dCB0ciByb2ZmIG1hbiBtZSBtc1xcbnRleHQvdHVydGxlXFx0XFx0XFx0XFx0XFx0dHRsXFxudGV4dC91cmktbGlzdFxcdFxcdFxcdFxcdFxcdHVyaSB1cmlzIHVybHNcXG50ZXh0L3ZjYXJkXFx0XFx0XFx0XFx0XFx0dmNhcmRcXG50ZXh0L3ZuZC5jdXJsXFx0XFx0XFx0XFx0XFx0Y3VybFxcbnRleHQvdm5kLmN1cmwuZGN1cmxcXHRcXHRcXHRcXHRkY3VybFxcbnRleHQvdm5kLmN1cmwubWN1cmxcXHRcXHRcXHRcXHRtY3VybFxcbnRleHQvdm5kLmN1cmwuc2N1cmxcXHRcXHRcXHRcXHRzY3VybFxcbnRleHQvdm5kLmR2Yi5zdWJ0aXRsZVxcdFxcdFxcdFxcdHN1YlxcbnRleHQvdm5kLmZseVxcdFxcdFxcdFxcdFxcdGZseVxcbnRleHQvdm5kLmZtaS5mbGV4c3RvclxcdFxcdFxcdFxcdGZseFxcbnRleHQvdm5kLmdyYXBodml6XFx0XFx0XFx0XFx0Z3ZcXG50ZXh0L3ZuZC5pbjNkLjNkbWxcXHRcXHRcXHRcXHQzZG1sXFxudGV4dC92bmQuaW4zZC5zcG90XFx0XFx0XFx0XFx0c3BvdFxcbnRleHQvdm5kLnN1bi5qMm1lLmFwcC1kZXNjcmlwdG9yXFx0XFx0amFkXFxudGV4dC92bmQud2FwLndtbFxcdFxcdFxcdFxcdHdtbFxcbnRleHQvdm5kLndhcC53bWxzY3JpcHRcXHRcXHRcXHRcXHR3bWxzXFxudGV4dC94LWFzbVxcdFxcdFxcdFxcdFxcdHMgYXNtXFxudGV4dC94LWNcXHRcXHRcXHRcXHRcXHRjIGNjIGN4eCBjcHAgaCBoaCBkaWNcXG50ZXh0L3gtZm9ydHJhblxcdFxcdFxcdFxcdFxcdGYgZm9yIGY3NyBmOTBcXG50ZXh0L3gtamF2YS1zb3VyY2VcXHRcXHRcXHRcXHRqYXZhXFxudGV4dC94LW5mb1xcdFxcdFxcdFxcdFxcdG5mb1xcbnRleHQveC1vcG1sXFx0XFx0XFx0XFx0XFx0b3BtbFxcbnRleHQveC1wYXNjYWxcXHRcXHRcXHRcXHRcXHRwIHBhc1xcbnRleHQveC1zZXRleHRcXHRcXHRcXHRcXHRcXHRldHhcXG50ZXh0L3gtc2Z2XFx0XFx0XFx0XFx0XFx0c2Z2XFxudGV4dC94LXV1ZW5jb2RlXFx0XFx0XFx0XFx0XFx0dXVcXG50ZXh0L3gtdmNhbGVuZGFyXFx0XFx0XFx0XFx0dmNzXFxudGV4dC94LXZjYXJkXFx0XFx0XFx0XFx0XFx0dmNmXFxudmlkZW8vM2dwcFxcdFxcdFxcdFxcdFxcdDNncFxcbnZpZGVvLzNncHAyXFx0XFx0XFx0XFx0XFx0M2cyXFxudmlkZW8vaDI2MVxcdFxcdFxcdFxcdFxcdGgyNjFcXG52aWRlby9oMjYzXFx0XFx0XFx0XFx0XFx0aDI2M1xcbnZpZGVvL2gyNjRcXHRcXHRcXHRcXHRcXHRoMjY0XFxudmlkZW8vanBlZ1xcdFxcdFxcdFxcdFxcdGpwZ3ZcXG52aWRlby9qcG1cXHRcXHRcXHRcXHRcXHRqcG0ganBnbVxcbnZpZGVvL21qMlxcdFxcdFxcdFxcdFxcdG1qMiBtanAyXFxudmlkZW8vbXA0XFx0XFx0XFx0XFx0XFx0bXA0IG1wNHYgbXBnNFxcbnZpZGVvL21wZWdcXHRcXHRcXHRcXHRcXHRtcGVnIG1wZyBtcGUgbTF2IG0ydlxcbnZpZGVvL29nZ1xcdFxcdFxcdFxcdFxcdG9ndlxcbnZpZGVvL3F1aWNrdGltZVxcdFxcdFxcdFxcdFxcdHF0IG1vdlxcbnZpZGVvL3ZuZC5kZWNlLmhkXFx0XFx0XFx0XFx0dXZoIHV2dmhcXG52aWRlby92bmQuZGVjZS5tb2JpbGVcXHRcXHRcXHRcXHR1dm0gdXZ2bVxcbnZpZGVvL3ZuZC5kZWNlLnBkXFx0XFx0XFx0XFx0dXZwIHV2dnBcXG52aWRlby92bmQuZGVjZS5zZFxcdFxcdFxcdFxcdHV2cyB1dnZzXFxudmlkZW8vdm5kLmRlY2UudmlkZW9cXHRcXHRcXHRcXHR1dnYgdXZ2dlxcbnZpZGVvL3ZuZC5kdmIuZmlsZVxcdFxcdFxcdFxcdGR2YlxcbnZpZGVvL3ZuZC5mdnRcXHRcXHRcXHRcXHRcXHRmdnRcXG52aWRlby92bmQubXBlZ3VybFxcdFxcdFxcdFxcdG14dSBtNHVcXG52aWRlby92bmQubXMtcGxheXJlYWR5Lm1lZGlhLnB5dlxcdFxcdHB5dlxcbnZpZGVvL3ZuZC51dnZ1Lm1wNFxcdFxcdFxcdFxcdHV2dSB1dnZ1XFxudmlkZW8vdm5kLnZpdm9cXHRcXHRcXHRcXHRcXHR2aXZcXG52aWRlby93ZWJtXFx0XFx0XFx0XFx0XFx0d2VibVxcbnZpZGVvL3gtZjR2XFx0XFx0XFx0XFx0XFx0ZjR2XFxudmlkZW8veC1mbGlcXHRcXHRcXHRcXHRcXHRmbGlcXG52aWRlby94LWZsdlxcdFxcdFxcdFxcdFxcdGZsdlxcbnZpZGVvL3gtbTR2XFx0XFx0XFx0XFx0XFx0bTR2XFxudmlkZW8veC1tYXRyb3NrYVxcdFxcdFxcdFxcdG1rdiBtazNkIG1rc1xcbnZpZGVvL3gtbW5nXFx0XFx0XFx0XFx0XFx0bW5nXFxudmlkZW8veC1tcy1hc2ZcXHRcXHRcXHRcXHRcXHRhc2YgYXN4XFxudmlkZW8veC1tcy12b2JcXHRcXHRcXHRcXHRcXHR2b2JcXG52aWRlby94LW1zLXdtXFx0XFx0XFx0XFx0XFx0d21cXG52aWRlby94LW1zLXdtdlxcdFxcdFxcdFxcdFxcdHdtdlxcbnZpZGVvL3gtbXMtd214XFx0XFx0XFx0XFx0XFx0d214XFxudmlkZW8veC1tcy13dnhcXHRcXHRcXHRcXHRcXHR3dnhcXG52aWRlby94LW1zdmlkZW9cXHRcXHRcXHRcXHRcXHRhdmlcXG52aWRlby94LXNnaS1tb3ZpZVxcdFxcdFxcdFxcdG1vdmllXFxudmlkZW8veC1zbXZcXHRcXHRcXHRcXHRcXHRzbXZcXG54LWNvbmZlcmVuY2UveC1jb29sdGFsa1xcdFxcdFxcdFxcdGljZVxcblwiO1xuXG5jb25zdCBtYXAgPSBuZXcgTWFwKCk7XG5cbm1pbWVfcmF3LnNwbGl0KCdcXG4nKS5mb3JFYWNoKChyb3cpID0+IHtcblx0Y29uc3QgbWF0Y2ggPSAvKC4rPylcXHQrKC4rKS8uZXhlYyhyb3cpO1xuXHRpZiAoIW1hdGNoKSByZXR1cm47XG5cblx0Y29uc3QgdHlwZSA9IG1hdGNoWzFdO1xuXHRjb25zdCBleHRlbnNpb25zID0gbWF0Y2hbMl0uc3BsaXQoJyAnKTtcblxuXHRleHRlbnNpb25zLmZvckVhY2goZXh0ID0+IHtcblx0XHRtYXAuc2V0KGV4dCwgdHlwZSk7XG5cdH0pO1xufSk7XG5cbmZ1bmN0aW9uIGxvb2t1cChmaWxlKSB7XG5cdGNvbnN0IG1hdGNoID0gL1xcLihbXlxcLl0rKSQvLmV4ZWMoZmlsZSk7XG5cdHJldHVybiBtYXRjaCAmJiBtYXAuZ2V0KG1hdGNoWzFdKTtcbn1cblxuZnVuY3Rpb24gbWlkZGxld2FyZShvcHRzXG5cblxuID0ge30pIHtcblx0Y29uc3QgeyBzZXNzaW9uLCBpZ25vcmUgfSA9IG9wdHM7XG5cblx0bGV0IGVtaXR0ZWRfYmFzZXBhdGggPSBmYWxzZTtcblxuXHRyZXR1cm4gY29tcG9zZV9oYW5kbGVycyhpZ25vcmUsIFtcblx0XHQocmVxLCByZXMsIG5leHQpID0+IHtcblx0XHRcdGlmIChyZXEuYmFzZVVybCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGxldCB7IG9yaWdpbmFsVXJsIH0gPSByZXE7XG5cdFx0XHRcdGlmIChyZXEudXJsID09PSAnLycgJiYgb3JpZ2luYWxVcmxbb3JpZ2luYWxVcmwubGVuZ3RoIC0gMV0gIT09ICcvJykge1xuXHRcdFx0XHRcdG9yaWdpbmFsVXJsICs9ICcvJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcS5iYXNlVXJsID0gb3JpZ2luYWxVcmxcblx0XHRcdFx0XHQ/IG9yaWdpbmFsVXJsLnNsaWNlKDAsIC1yZXEudXJsLmxlbmd0aClcblx0XHRcdFx0XHQ6ICcnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWVtaXR0ZWRfYmFzZXBhdGggJiYgcHJvY2Vzcy5zZW5kKSB7XG5cdFx0XHRcdHByb2Nlc3Muc2VuZCh7XG5cdFx0XHRcdFx0X19zYXBwZXJfXzogdHJ1ZSxcblx0XHRcdFx0XHRldmVudDogJ2Jhc2VwYXRoJyxcblx0XHRcdFx0XHRiYXNlcGF0aDogcmVxLmJhc2VVcmxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZW1pdHRlZF9iYXNlcGF0aCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZXEucGF0aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJlcS5wYXRoID0gcmVxLnVybC5yZXBsYWNlKC9cXD8uKi8sICcnKTtcblx0XHRcdH1cblxuXHRcdFx0bmV4dCgpO1xuXHRcdH0sXG5cblx0XHRmcy5leGlzdHNTeW5jKHBhdGguam9pbihidWlsZF9kaXIsICdzZXJ2aWNlLXdvcmtlci5qcycpKSAmJiBzZXJ2ZSh7XG5cdFx0XHRwYXRobmFtZTogJy9zZXJ2aWNlLXdvcmtlci5qcycsXG5cdFx0XHRjYWNoZV9jb250cm9sOiAnbm8tY2FjaGUsIG5vLXN0b3JlLCBtdXN0LXJldmFsaWRhdGUnXG5cdFx0fSksXG5cblx0XHRmcy5leGlzdHNTeW5jKHBhdGguam9pbihidWlsZF9kaXIsICdzZXJ2aWNlLXdvcmtlci5qcy5tYXAnKSkgJiYgc2VydmUoe1xuXHRcdFx0cGF0aG5hbWU6ICcvc2VydmljZS13b3JrZXIuanMubWFwJyxcblx0XHRcdGNhY2hlX2NvbnRyb2w6ICduby1jYWNoZSwgbm8tc3RvcmUsIG11c3QtcmV2YWxpZGF0ZSdcblx0XHR9KSxcblxuXHRcdHNlcnZlKHtcblx0XHRcdHByZWZpeDogJy9jbGllbnQvJyxcblx0XHRcdGNhY2hlX2NvbnRyb2w6IGRldiA/ICduby1jYWNoZScgOiAnbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlJ1xuXHRcdH0pLFxuXG5cdFx0Z2V0X3NlcnZlcl9yb3V0ZV9oYW5kbGVyKG1hbmlmZXN0LnNlcnZlcl9yb3V0ZXMpLFxuXG5cdFx0Z2V0X3BhZ2VfaGFuZGxlcihtYW5pZmVzdCwgc2Vzc2lvbiB8fCBub29wKVxuXHRdLmZpbHRlcihCb29sZWFuKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VfaGFuZGxlcnMoaWdub3JlLCBoYW5kbGVycykge1xuXHRjb25zdCB0b3RhbCA9IGhhbmRsZXJzLmxlbmd0aDtcblxuXHRmdW5jdGlvbiBudGhfaGFuZGxlcihuLCByZXEsIHJlcywgbmV4dCkge1xuXHRcdGlmIChuID49IHRvdGFsKSB7XG5cdFx0XHRyZXR1cm4gbmV4dCgpO1xuXHRcdH1cblxuXHRcdGhhbmRsZXJzW25dKHJlcSwgcmVzLCAoKSA9PiBudGhfaGFuZGxlcihuKzEsIHJlcSwgcmVzLCBuZXh0KSk7XG5cdH1cblxuXHRyZXR1cm4gIWlnbm9yZVxuXHRcdD8gKHJlcSwgcmVzLCBuZXh0KSA9PiBudGhfaGFuZGxlcigwLCByZXEsIHJlcywgbmV4dClcblx0XHQ6IChyZXEsIHJlcywgbmV4dCkgPT4ge1xuXHRcdFx0aWYgKHNob3VsZF9pZ25vcmUocmVxLnBhdGgsIGlnbm9yZSkpIHtcblx0XHRcdFx0bmV4dCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bnRoX2hhbmRsZXIoMCwgcmVxLCByZXMsIG5leHQpO1xuXHRcdFx0fVxuXHRcdH07XG59XG5cbmZ1bmN0aW9uIHNob3VsZF9pZ25vcmUodXJpLCB2YWwpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsKSkgcmV0dXJuIHZhbC5zb21lKHggPT4gc2hvdWxkX2lnbm9yZSh1cmksIHgpKTtcblx0aWYgKHZhbCBpbnN0YW5jZW9mIFJlZ0V4cCkgcmV0dXJuIHZhbC50ZXN0KHVyaSk7XG5cdGlmICh0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsKHVyaSk7XG5cdHJldHVybiB1cmkuc3RhcnRzV2l0aCh2YWwuY2hhckNvZGVBdCgwKSA9PT0gNDcgPyB2YWwgOiBgLyR7dmFsfWApO1xufVxuXG5mdW5jdGlvbiBzZXJ2ZSh7IHByZWZpeCwgcGF0aG5hbWUsIGNhY2hlX2NvbnRyb2wgfVxuXG5cblxuKSB7XG5cdGNvbnN0IGZpbHRlciA9IHBhdGhuYW1lXG5cdFx0PyAocmVxKSA9PiByZXEucGF0aCA9PT0gcGF0aG5hbWVcblx0XHQ6IChyZXEpID0+IHJlcS5wYXRoLnN0YXJ0c1dpdGgocHJlZml4KTtcblxuXHRjb25zdCBjYWNoZSA9IG5ldyBNYXAoKTtcblxuXHRjb25zdCByZWFkID0gZGV2XG5cdFx0PyAoZmlsZSkgPT4gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShidWlsZF9kaXIsIGZpbGUpKVxuXHRcdDogKGZpbGUpID0+IChjYWNoZS5oYXMoZmlsZSkgPyBjYWNoZSA6IGNhY2hlLnNldChmaWxlLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGJ1aWxkX2RpciwgZmlsZSkpKSkuZ2V0KGZpbGUpO1xuXG5cdHJldHVybiAocmVxLCByZXMsIG5leHQpID0+IHtcblx0XHRpZiAoZmlsdGVyKHJlcSkpIHtcblx0XHRcdGNvbnN0IHR5cGUgPSBsb29rdXAocmVxLnBhdGgpO1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBmaWxlID0gZGVjb2RlVVJJQ29tcG9uZW50KHJlcS5wYXRoLnNsaWNlKDEpKTtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IHJlYWQoZmlsZSk7XG5cblx0XHRcdFx0cmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgdHlwZSk7XG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCBjYWNoZV9jb250cm9sKTtcblx0XHRcdFx0cmVzLmVuZChkYXRhKTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRyZXMuc3RhdHVzQ29kZSA9IDQwNDtcblx0XHRcdFx0cmVzLmVuZCgnbm90IGZvdW5kJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHQoKTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIG5vb3AoKXt9XG5cbmV4cG9ydCB7IG1pZGRsZXdhcmUgfTtcbiIsImltcG9ydCBzaXJ2IGZyb20gJ3NpcnYnO1xyXG5pbXBvcnQgcG9sa2EgZnJvbSAncG9sa2EnO1xyXG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nO1xyXG5pbXBvcnQgKiBhcyBzYXBwZXIgZnJvbSAnQHNhcHBlci9zZXJ2ZXInO1xyXG5cclxuY29uc3QgeyBQT1JULCBOT0RFX0VOViB9ID0gcHJvY2Vzcy5lbnY7XHJcbmNvbnN0IGRldiA9IE5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxucG9sa2EoKSAvLyBZb3UgY2FuIGFsc28gdXNlIEV4cHJlc3NcclxuXHQudXNlKFxyXG5cdFx0Y29tcHJlc3Npb24oeyB0aHJlc2hvbGQ6IDAgfSksXHJcblx0XHRzaXJ2KCdzdGF0aWMnLCB7IGRldiB9KSxcclxuXHRcdHNhcHBlci5taWRkbGV3YXJlKClcclxuXHQpXHJcblx0Lmxpc3RlbihQT1JULCBlcnIgPT4ge1xyXG5cdFx0aWYgKGVycikgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyKTtcclxuXHR9KTtcclxuIl0sIm5hbWVzIjpbImdldCIsInByZWxvYWQiLCJjb21wb25lbnRfMCIsImNvbXBvbmVudF8xIiwiY29tcG9uZW50XzIiLCJjb21wb25lbnRfMyIsImNvbXBvbmVudF80IiwiY29tcG9uZW50XzUiLCJjb21wb25lbnRfNiIsImNvbXBvbmVudF83IiwiY29tcG9uZW50XzgiLCJjb21wb25lbnRfOSIsImNvbXBvbmVudF8xMCIsImNvbXBvbmVudF8xMSIsImNvbXBvbmVudF8xMiIsImNvbXBvbmVudF8xMyIsImNvbXBvbmVudF8xNCIsImNvbXBvbmVudF8xNSIsImNvbXBvbmVudF8xNiIsInByZWxvYWRfMTYiLCJjb21wb25lbnRfMTciLCJwcmVsb2FkXzE3Iiwicm9vdCIsImVycm9yIiwiZXNjYXBlZCIsImxvb2t1cCIsIm5vb3AiLCJzYXBwZXIubWlkZGxld2FyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBSyxHQUFHO0FBQ2QsQ0FBQztBQUNELEVBQUUsS0FBSyxFQUFFLGlCQUFpQjtBQUMxQixFQUFFLElBQUksRUFB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QUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQzFCLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtBQUM5QixDQUFDLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDMUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQzdCLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtBQUMxQixDQUFDLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDN0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQzNCLENBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtBQUM3QixDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNBLFNBQVMsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUM3QixDQUFDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztBQUM1RjtBQUNBLENBQUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQy9DLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDekIsRUFBRSxHQUFHLElBQUksS0FBSyxPQUFPLEdBQUcsVUFBVSxDQUFDLEVBQUU7QUFDckMsRUFBRSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJ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Q0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLE9BQU8sQ0FBQztBQUNkLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUNwQixFQUFFLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNwRjtBQUNBLEVBQUUsSUFBSSxTQUFTLENBQUM7QUFDaEI7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN6QixHQUFHLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxJQUFJLE1BQU07QUFDVjtBQUNBLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLElBQUk7QUFDSixHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZCxHQUFHLE1BQU07QUFDVCxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztBQUNwRCxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDaEM7QUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLE1BQU0sTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUss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
