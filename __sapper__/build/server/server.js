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
let title = "λproton";

const Routes = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
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
let cardFooterText = "Обновлено вчера в 23:59";
let areaCardTitle = "Пример диаграммы региона";
let barCardTitle = "Пример гистограммы";
let pieCardTitle = "Пример круговой диаграммы";

const Charts = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
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
	$context = get_store_value(context);
	let { class: className = "" } = $$props;
	let { right = false } = $$props;
	const props = clean($$props);
	if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
	if ($$props.right === void 0 && $$bindings.right && right !== void 0) $$bindings.right(right);
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
let footerName = "λproton boy";
let footerText = "Вы вошли как:";

const Sidebar = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	let { theme } = $$props;
	let isLayoutOpen = true;
	let isPageOpen = true;
	let isAuthenticationOpen = true;
	let isErrorOpen = false;
	let activeLink = "Панель";

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
let theme = "dark";
let color = "dark";
let title$1 = "λproton";

const Layout$3 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;
	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	return `${($$result.head += `${($$result.title = `<title>${escape(title$1)}</title>`, "")}`, "")}

${segment !== "pages"
	? `<div class="${"l-proton-nav-static"}">
    ${validate_component(Navbar_1, "Navbar").$$render($$result, { segment, color, title: title$1 }, {}, {})}
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
	map: "{\"version\":3,\"file\":\"_error.svelte\",\"sources\":[\"_error.svelte\"],\"sourcesContent\":[\"<script>\\r\\n\\texport let status;\\r\\n\\texport let error;\\r\\n\\r\\n\\tconst dev = undefined === 'development';\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n\\th1, p {\\r\\n\\t\\tmargin: 0 auto;\\r\\n\\t}\\r\\n\\r\\n\\th1 {\\r\\n\\t\\tfont-size: 2.8em;\\r\\n\\t\\tfont-weight: 700;\\r\\n\\t\\tmargin: 0 0 0.5em 0;\\r\\n\\t}\\r\\n\\r\\n\\tp {\\r\\n\\t\\tmargin: 1em auto;\\r\\n\\t}\\r\\n\\r\\n\\t@media (min-width: 480px) {\\r\\n\\t\\th1 {\\r\\n\\t\\t\\tfont-size: 4em;\\r\\n\\t\\t}\\r\\n\\t}\\r\\n</style>\\r\\n\\r\\n<svelte:head>\\r\\n\\t<title>{status}</title>\\r\\n</svelte:head>\\r\\n\\r\\n<h1>{status}</h1>\\r\\n\\r\\n<p>{error.message}</p>\\r\\n\\r\\n{#if dev && error.stack}\\r\\n\\t<pre>{error.stack}</pre>\\r\\n{/if}\\r\\n\"],\"names\":[],\"mappings\":\"AAQC,iBAAE,CAAE,CAAC,eAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AAED,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC,AAED,CAAC,eAAC,CAAC,AACF,MAAM,CAAE,GAAG,CAAC,IAAI,AACjB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,EAAE,eAAC,CAAC,AACH,SAAS,CAAE,GAAG,AACf,CAAC,AACF,CAAC\"}"
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

${ ``}`;
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

const build_dir = "__sapper__/build";

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
	const get_build_info =  (assets => () => assets)(JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8')));

	const template =  (str => () => str)(read_template(build_dir));

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  'Internal server error';

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
		res.setHeader('Cache-Control',  'max-age=600');

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
			cache_control:  'max-age=31536000, immutable'
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

	const cache = new Map();

	const read =  (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.join(build_dir, file)))).get(file);

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
