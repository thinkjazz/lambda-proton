function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
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
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if (typeof $$scope.dirty === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function to_number(value) {
    return value === '' ? undefined : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            while (j < node.attributes.length) {
                const attribute = node.attributes[j];
                if (attributes[attribute.name]) {
                    j++;
                }
                else {
                    node.removeAttribute(attribute.name);
                }
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}

let stylesheet;
let active = 0;
let current_rules = {};
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    if (!current_rules[name]) {
        if (!stylesheet) {
            const style = element('style');
            document.head.appendChild(style);
            stylesheet = style.sheet;
        }
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    node.style.animation = (node.style.animation || '')
        .split(', ')
        .filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    )
        .join(', ');
    if (name && !--active)
        clear_rules();
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        let i = stylesheet.cssRules.length;
        while (i--)
            stylesheet.deleteRule(i);
        current_rules = {};
    });
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
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
const seen_callbacks = new Set();
function flush() {
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

const globals = (typeof window !== 'undefined' ? window : global);

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
}

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

const CONTEXT_KEY = {};

const preload = () => ({});

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

/* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.18.1 */
const file = "node_modules\\sveltestrap\\src\\Container.svelte";

function create_fragment(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[7].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
	let div_levels = [/*props*/ ctx[2], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[1] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { id: true, class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file, 14, 0, 295);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 64) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 4 && /*props*/ ctx[2],
				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
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
	let { class: className = "" } = $$props;
	let { fluid = false } = $$props;
	let { id = "" } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
		if ("fluid" in $$new_props) $$invalidate(4, fluid = $$new_props.fluid);
		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, fluid, id, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
		if ("fluid" in $$props) $$invalidate(4, fluid = $$new_props.fluid);
		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, fluid*/ 24) {
			 $$invalidate(1, classes = clsx(className, fluid ? "container-fluid" : "container"));
		}
	};

	$$props = exclude_internal_props($$props);
	return [id, classes, props, className, fluid, $$props, $$scope, $$slots];
}

class Container extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { class: 3, fluid: 4, id: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Container",
			options,
			id: create_fragment.name
		});
	}

	get class() {
		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fluid() {
		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fluid(value) {
		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.18.1 */
const file$1 = "node_modules\\sveltestrap\\src\\Navbar.svelte";

function create_fragment$1(ctx) {
	let nav;
	let current;
	const default_slot_template = /*$$slots*/ ctx[11].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
	let nav_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let nav_data = {};

	for (let i = 0; i < nav_levels.length; i += 1) {
		nav_data = assign(nav_data, nav_levels[i]);
	}

	const block = {
		c: function create() {
			nav = element("nav");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			nav = claim_element(nodes, "NAV", { class: true });
			var nav_nodes = children(nav);
			if (default_slot) default_slot.l(nav_nodes);
			nav_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(nav, nav_data);
			add_location(nav, file$1, 34, 0, 766);
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);

			if (default_slot) {
				default_slot.m(nav, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1024) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[10], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null));
			}

			set_attributes(nav, get_spread_update(nav_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getExpandClass(expand) {
	if (expand === false) {
		return false;
	} else if (expand === true || expand === "xs") {
		return "navbar-expand";
	}

	return `navbar-expand-${expand}`;
}

function instance$1($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { light = false } = $$props;
	let { dark = false } = $$props;
	let { fixed = "" } = $$props;
	let { sticky = "" } = $$props;
	let { color = "" } = $$props;
	let { expand = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("light" in $$new_props) $$invalidate(3, light = $$new_props.light);
		if ("dark" in $$new_props) $$invalidate(4, dark = $$new_props.dark);
		if ("fixed" in $$new_props) $$invalidate(5, fixed = $$new_props.fixed);
		if ("sticky" in $$new_props) $$invalidate(6, sticky = $$new_props.sticky);
		if ("color" in $$new_props) $$invalidate(7, color = $$new_props.color);
		if ("expand" in $$new_props) $$invalidate(8, expand = $$new_props.expand);
		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			light,
			dark,
			fixed,
			sticky,
			color,
			expand,
			classes
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("light" in $$props) $$invalidate(3, light = $$new_props.light);
		if ("dark" in $$props) $$invalidate(4, dark = $$new_props.dark);
		if ("fixed" in $$props) $$invalidate(5, fixed = $$new_props.fixed);
		if ("sticky" in $$props) $$invalidate(6, sticky = $$new_props.sticky);
		if ("color" in $$props) $$invalidate(7, color = $$new_props.color);
		if ("expand" in $$props) $$invalidate(8, expand = $$new_props.expand);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 508) {
			 $$invalidate(0, classes = clsx(className, "navbar", getExpandClass(expand), {
				"navbar-light": light,
				"navbar-dark": dark,
				[`bg-${color}`]: color,
				[`fixed-${fixed}`]: fixed,
				[`sticky-${sticky}`]: sticky
			}));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		classes,
		props,
		className,
		light,
		dark,
		fixed,
		sticky,
		color,
		expand,
		$$props,
		$$scope,
		$$slots
	];
}

class Navbar extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			class: 2,
			light: 3,
			dark: 4,
			fixed: 5,
			sticky: 6,
			color: 7,
			expand: 8
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Navbar",
			options,
			id: create_fragment$1.name
		});
	}

	get class() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get light() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set light(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dark() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dark(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fixed() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fixed(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get sticky() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set sticky(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get expand() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set expand(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\NavbarBrand.svelte generated by Svelte v3.18.1 */
const file$2 = "node_modules\\sveltestrap\\src\\NavbarBrand.svelte";

function create_fragment$2(ctx) {
	let a;
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let a_levels = [/*props*/ ctx[2], { class: /*classes*/ ctx[1] }, { href: /*href*/ ctx[0] }];
	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block = {
		c: function create() {
			a = element("a");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { class: true, href: true });
			var a_nodes = children(a);
			if (default_slot) default_slot.l(a_nodes);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(a, a_data);
			add_location(a, file$2, 13, 0, 245);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (default_slot) {
				default_slot.m(a, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			set_attributes(a, get_spread_update(a_levels, [
				dirty & /*props*/ 4 && /*props*/ ctx[2],
				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { href = "/" } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, href, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className*/ 8) {
			 $$invalidate(1, classes = clsx(className, "navbar-brand"));
		}
	};

	$$props = exclude_internal_props($$props);
	return [href, classes, props, className, $$props, $$scope, $$slots];
}

class NavbarBrand extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { class: 3, href: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NavbarBrand",
			options,
			id: create_fragment$2.name
		});
	}

	get class() {
		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.18.1 */
const file$3 = "node_modules\\sveltestrap\\src\\Button.svelte";

// (53:0) {:else}
function create_else_block_1(ctx) {
	let button;
	let current_block_type_index;
	let if_block;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[19].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block_2];
	const if_blocks = [];

	function select_block_type_2(ctx, dirty) {
		if (/*close*/ ctx[1]) return 0;
		if (/*children*/ ctx[0]) return 1;
		return 2;
	}

	current_block_type_index = select_block_type_2(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	let button_levels = [
		/*props*/ ctx[10],
		{ id: /*id*/ ctx[4] },
		{ class: /*classes*/ ctx[8] },
		{ disabled: /*disabled*/ ctx[2] },
		{ value: /*value*/ ctx[6] },
		{
			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
		},
		{ style: /*style*/ ctx[5] }
	];

	let button_data = {};

	for (let i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	const block_1 = {
		c: function create() {
			button = element("button");

			if (!default_slot) {
				if_block.c();
			}

			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			button = claim_element(nodes, "BUTTON", {
				id: true,
				class: true,
				disabled: true,
				value: true,
				"aria-label": true,
				style: true
			});

			var button_nodes = children(button);

			if (!default_slot) {
				if_block.l(button_nodes);
			}

			if (default_slot) default_slot.l(button_nodes);
			button_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(button, button_data);
			add_location(button, file$3, 53, 2, 1061);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!default_slot) {
				if_blocks[current_block_type_index].m(button, null);
			}

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;
			dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
		},
		p: function update(ctx, dirty) {
			if (!default_slot) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type_2(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}

					transition_in(if_block, 1);
					if_block.m(button, null);
				}
			}

			if (default_slot && default_slot.p && dirty & /*$$scope*/ 262144) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
			}

			set_attributes(button, get_spread_update(button_levels, [
				dirty & /*props*/ 1024 && /*props*/ ctx[10],
				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
				dirty & /*value*/ 64 && { value: /*value*/ ctx[6] },
				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
				},
				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);

			if (!default_slot) {
				if_blocks[current_block_type_index].d();
			}

			if (default_slot) default_slot.d(detaching);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_else_block_1.name,
		type: "else",
		source: "(53:0) {:else}",
		ctx
	});

	return block_1;
}

// (37:0) {#if href}
function create_if_block(ctx) {
	let a;
	let current_block_type_index;
	let if_block;
	let current;
	let dispose;
	const if_block_creators = [create_if_block_1, create_else_block];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*children*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	let a_levels = [
		/*props*/ ctx[10],
		{ id: /*id*/ ctx[4] },
		{ class: /*classes*/ ctx[8] },
		{ disabled: /*disabled*/ ctx[2] },
		{ href: /*href*/ ctx[3] },
		{
			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
		},
		{ style: /*style*/ ctx[5] }
	];

	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block_1 = {
		c: function create() {
			a = element("a");
			if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", {
				id: true,
				class: true,
				disabled: true,
				href: true,
				"aria-label": true,
				style: true
			});

			var a_nodes = children(a);
			if_block.l(a_nodes);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(a, a_data);
			add_location(a, file$3, 37, 2, 825);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			if_blocks[current_block_type_index].m(a, null);
			current = true;
			dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(a, null);
			}

			set_attributes(a, get_spread_update(a_levels, [
				dirty & /*props*/ 1024 && /*props*/ ctx[10],
				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
				dirty & /*href*/ 8 && { href: /*href*/ ctx[3] },
				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
				},
				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if_blocks[current_block_type_index].d();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block.name,
		type: "if",
		source: "(37:0) {#if href}",
		ctx
	});

	return block_1;
}

// (68:6) {:else}
function create_else_block_2(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[19].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

	const block_1 = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 262144) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_else_block_2.name,
		type: "else",
		source: "(68:6) {:else}",
		ctx
	});

	return block_1;
}

// (66:25) 
function create_if_block_3(ctx) {
	let t;

	const block_1 = {
		c: function create() {
			t = text(/*children*/ ctx[0]);
		},
		l: function claim(nodes) {
			t = claim_text(nodes, /*children*/ ctx[0]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block_3.name,
		type: "if",
		source: "(66:25) ",
		ctx
	});

	return block_1;
}

// (64:6) {#if close}
function create_if_block_2(ctx) {
	let span;
	let t;

	const block_1 = {
		c: function create() {
			span = element("span");
			t = text("×");
			this.h();
		},
		l: function claim(nodes) {
			span = claim_element(nodes, "SPAN", { "aria-hidden": true });
			var span_nodes = children(span);
			t = claim_text(span_nodes, "×");
			span_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span, "aria-hidden", "true");
			add_location(span, file$3, 64, 8, 1250);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block_2.name,
		type: "if",
		source: "(64:6) {#if close}",
		ctx
	});

	return block_1;
}

// (49:4) {:else}
function create_else_block(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[19].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

	const block_1 = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 262144) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_else_block.name,
		type: "else",
		source: "(49:4) {:else}",
		ctx
	});

	return block_1;
}

// (47:4) {#if children}
function create_if_block_1(ctx) {
	let t;

	const block_1 = {
		c: function create() {
			t = text(/*children*/ ctx[0]);
		},
		l: function claim(nodes) {
			t = claim_text(nodes, /*children*/ ctx[0]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block_1.name,
		type: "if",
		source: "(47:4) {#if children}",
		ctx
	});

	return block_1;
}

function create_fragment$3(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block_1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*href*/ ctx[3]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block_1 = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block_1;
}

function instance$3($$self, $$props, $$invalidate) {
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
	let { $$slots = {}, $$scope } = $$props;

	function click_handler(event) {
		bubble($$self, event);
	}

	function click_handler_1(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
		if ("active" in $$new_props) $$invalidate(12, active = $$new_props.active);
		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
		if ("color" in $$new_props) $$invalidate(14, color = $$new_props.color);
		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
		if ("outline" in $$new_props) $$invalidate(15, outline = $$new_props.outline);
		if ("size" in $$new_props) $$invalidate(16, size = $$new_props.size);
		if ("style" in $$new_props) $$invalidate(5, style = $$new_props.style);
		if ("value" in $$new_props) $$invalidate(6, value = $$new_props.value);
		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			active,
			block,
			children,
			close,
			color,
			disabled,
			href,
			id,
			outline,
			size,
			style,
			value,
			ariaLabel,
			classes,
			defaultAriaLabel
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
		if ("active" in $$props) $$invalidate(12, active = $$new_props.active);
		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
		if ("color" in $$props) $$invalidate(14, color = $$new_props.color);
		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
		if ("outline" in $$props) $$invalidate(15, outline = $$new_props.outline);
		if ("size" in $$props) $$invalidate(16, size = $$new_props.size);
		if ("style" in $$props) $$invalidate(5, style = $$new_props.style);
		if ("value" in $$props) $$invalidate(6, value = $$new_props.value);
		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
		if ("defaultAriaLabel" in $$props) $$invalidate(9, defaultAriaLabel = $$new_props.defaultAriaLabel);
	};

	let ariaLabel;
	let classes;
	let defaultAriaLabel;

	$$self.$$.update = () => {
		 $$invalidate(7, ariaLabel = $$props["aria-label"]);

		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 129026) {
			 $$invalidate(8, classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
		}

		if ($$self.$$.dirty & /*close*/ 2) {
			 $$invalidate(9, defaultAriaLabel = close ? "Close" : null);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		children,
		close,
		disabled,
		href,
		id,
		style,
		value,
		ariaLabel,
		classes,
		defaultAriaLabel,
		props,
		className,
		active,
		block,
		color,
		outline,
		size,
		$$props,
		$$scope,
		$$slots,
		click_handler,
		click_handler_1
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			class: 11,
			active: 12,
			block: 13,
			children: 0,
			close: 1,
			color: 14,
			disabled: 2,
			href: 3,
			id: 4,
			outline: 15,
			size: 16,
			style: 5,
			value: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$3.name
		});
	}

	get class() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get active() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get block() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set block(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get children() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set children(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get close() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set close(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outline() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outline(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.18.1 */
const file$4 = "node_modules\\sveltestrap\\src\\Nav.svelte";

function create_fragment$4(ctx) {
	let ul;
	let current;
	const default_slot_template = /*$$slots*/ ctx[13].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
	let ul_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let ul_data = {};

	for (let i = 0; i < ul_levels.length; i += 1) {
		ul_data = assign(ul_data, ul_levels[i]);
	}

	const block = {
		c: function create() {
			ul = element("ul");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			ul = claim_element(nodes, "UL", { class: true });
			var ul_nodes = children(ul);
			if (default_slot) default_slot.l(ul_nodes);
			ul_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(ul, ul_data);
			add_location(ul, file$4, 42, 0, 994);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			if (default_slot) {
				default_slot.m(ul, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4096) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
			}

			set_attributes(ul, get_spread_update(ul_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function getVerticalClass(vertical) {
	if (vertical === false) {
		return false;
	} else if (vertical === true || vertical === "xs") {
		return "flex-column";
	}

	return `flex-${vertical}-column`;
}

function instance$4($$self, $$props, $$invalidate) {
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
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("tabs" in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
		if ("pills" in $$new_props) $$invalidate(4, pills = $$new_props.pills);
		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
		if ("horizontal" in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
		if ("justified" in $$new_props) $$invalidate(7, justified = $$new_props.justified);
		if ("fill" in $$new_props) $$invalidate(8, fill = $$new_props.fill);
		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
		if ("card" in $$new_props) $$invalidate(10, card = $$new_props.card);
		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			tabs,
			pills,
			vertical,
			horizontal,
			justified,
			fill,
			navbar,
			card,
			classes
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("tabs" in $$props) $$invalidate(3, tabs = $$new_props.tabs);
		if ("pills" in $$props) $$invalidate(4, pills = $$new_props.pills);
		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
		if ("horizontal" in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
		if ("justified" in $$props) $$invalidate(7, justified = $$new_props.justified);
		if ("fill" in $$props) $$invalidate(8, fill = $$new_props.fill);
		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
		if ("card" in $$props) $$invalidate(10, card = $$new_props.card);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
			 $$invalidate(0, classes = clsx(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
				"nav-tabs": tabs,
				"card-header-tabs": card && tabs,
				"nav-pills": pills,
				"card-header-pills": card && pills,
				"nav-justified": justified,
				"nav-fill": fill
			}));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		classes,
		props,
		className,
		tabs,
		pills,
		vertical,
		horizontal,
		justified,
		fill,
		navbar,
		card,
		$$props,
		$$scope,
		$$slots
	];
}

class Nav extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			class: 2,
			tabs: 3,
			pills: 4,
			vertical: 5,
			horizontal: 6,
			justified: 7,
			fill: 8,
			navbar: 9,
			card: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
			options,
			id: create_fragment$4.name
		});
	}

	get class() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tabs() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tabs(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get pills() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set pills(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get vertical() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set vertical(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get horizontal() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set horizontal(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get justified() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set justified(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fill() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fill(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get navbar() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set navbar(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get card() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set card(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => `overflow: hidden;` +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}

/* node_modules\sveltestrap\src\Collapse.svelte generated by Svelte v3.18.1 */
const file$5 = "node_modules\\sveltestrap\\src\\Collapse.svelte";

// (60:0) {#if isOpen}
function create_if_block$1(ctx) {
	let div;
	let div_transition;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[18].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
	let div_levels = [{ class: /*classes*/ ctx[6] }, /*props*/ ctx[7]];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$5, 60, 2, 1284);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;

			dispose = [
				listen_dev(div, "introstart", /*introstart_handler*/ ctx[19], false, false, false),
				listen_dev(div, "introend", /*introend_handler*/ ctx[20], false, false, false),
				listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[21], false, false, false),
				listen_dev(div, "outroend", /*outroend_handler*/ ctx[22], false, false, false),
				listen_dev(div, "introstart", /*onEntering*/ ctx[1], false, false, false),
				listen_dev(div, "introend", /*onEntered*/ ctx[2], false, false, false),
				listen_dev(div, "outrostart", /*onExiting*/ ctx[3], false, false, false),
				listen_dev(div, "outroend", /*onExited*/ ctx[4], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 131072) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*classes*/ 64 && { class: /*classes*/ ctx[6] },
				dirty & /*props*/ 128 && /*props*/ ctx[7]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, true);
				div_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {}, false);
			div_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			if (detaching && div_transition) div_transition.end();
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(60:0) {#if isOpen}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let current;
	let dispose;
	add_render_callback(/*onwindowresize*/ ctx[23]);
	let if_block = /*isOpen*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
			dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[23]);
		},
		p: function update(ctx, [dirty]) {
			if (/*isOpen*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
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

	let { $$slots = {}, $$scope } = $$props;

	function introstart_handler(event) {
		bubble($$self, event);
	}

	function introend_handler(event) {
		bubble($$self, event);
	}

	function outrostart_handler(event) {
		bubble($$self, event);
	}

	function outroend_handler(event) {
		bubble($$self, event);
	}

	function onwindowresize() {
		$$invalidate(5, windowWidth = window.innerWidth);
	}

	$$self.$set = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
		if ("class" in $$new_props) $$invalidate(8, className = $$new_props.class);
		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
		if ("onEntering" in $$new_props) $$invalidate(1, onEntering = $$new_props.onEntering);
		if ("onEntered" in $$new_props) $$invalidate(2, onEntered = $$new_props.onEntered);
		if ("onExiting" in $$new_props) $$invalidate(3, onExiting = $$new_props.onExiting);
		if ("onExited" in $$new_props) $$invalidate(4, onExited = $$new_props.onExited);
		if ("expand" in $$new_props) $$invalidate(10, expand = $$new_props.expand);
		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			isOpen,
			className,
			navbar,
			onEntering,
			onEntered,
			onExiting,
			onExited,
			expand,
			windowWidth,
			_wasMaximazed,
			classes
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
		if ("className" in $$props) $$invalidate(8, className = $$new_props.className);
		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
		if ("onEntering" in $$props) $$invalidate(1, onEntering = $$new_props.onEntering);
		if ("onEntered" in $$props) $$invalidate(2, onEntered = $$new_props.onEntered);
		if ("onExiting" in $$props) $$invalidate(3, onExiting = $$new_props.onExiting);
		if ("onExited" in $$props) $$invalidate(4, onExited = $$new_props.onExited);
		if ("expand" in $$props) $$invalidate(10, expand = $$new_props.expand);
		if ("windowWidth" in $$props) $$invalidate(5, windowWidth = $$new_props.windowWidth);
		if ("_wasMaximazed" in $$props) $$invalidate(11, _wasMaximazed = $$new_props._wasMaximazed);
		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, navbar*/ 768) {
			 $$invalidate(6, classes = clsx(className, // collapseClass,
			navbar && "navbar-collapse"));
		}

		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximazed*/ 7713) {
			 if (navbar && expand) {
				if (windowWidth >= minWidth[expand] && !isOpen) {
					$$invalidate(0, isOpen = true);
					$$invalidate(11, _wasMaximazed = true);
					notify();
				} else if (windowWidth < minWidth[expand] && _wasMaximazed) {
					$$invalidate(0, isOpen = false);
					$$invalidate(11, _wasMaximazed = false);
					notify();
				}
			}
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		isOpen,
		onEntering,
		onEntered,
		onExiting,
		onExited,
		windowWidth,
		classes,
		props,
		className,
		navbar,
		expand,
		_wasMaximazed,
		minWidth,
		noop,
		dispatch,
		notify,
		$$props,
		$$scope,
		$$slots,
		introstart_handler,
		introend_handler,
		outrostart_handler,
		outroend_handler,
		onwindowresize
	];
}

class Collapse extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			isOpen: 0,
			class: 8,
			navbar: 9,
			onEntering: 1,
			onEntered: 2,
			onExiting: 3,
			onExited: 4,
			expand: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Collapse",
			options,
			id: create_fragment$5.name
		});
	}

	get isOpen() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isOpen(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get navbar() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set navbar(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onEntering() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onEntering(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onEntered() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onEntered(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onExiting() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onExiting(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onExited() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onExited(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get expand() {
		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set expand(value) {
		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const createContext = () => writable({});

/* node_modules\sveltestrap\src\Dropdown.svelte generated by Svelte v3.18.1 */

const { Error: Error_1 } = globals;
const file$6 = "node_modules\\sveltestrap\\src\\Dropdown.svelte";

// (103:0) {:else}
function create_else_block$1(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[21].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);
	let div_levels = [{ class: /*classes*/ ctx[2] }, /*props*/ ctx[3]];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$6, 103, 2, 2448);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			/*div_binding*/ ctx[23](div);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1048576) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[20], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
				dirty & /*props*/ 8 && /*props*/ ctx[3]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			/*div_binding*/ ctx[23](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(103:0) {:else}",
		ctx
	});

	return block;
}

// (99:0) {#if nav}
function create_if_block$2(ctx) {
	let li;
	let current;
	const default_slot_template = /*$$slots*/ ctx[21].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);
	let li_levels = [{ class: /*classes*/ ctx[2] }, /*props*/ ctx[3]];
	let li_data = {};

	for (let i = 0; i < li_levels.length; i += 1) {
		li_data = assign(li_data, li_levels[i]);
	}

	const block = {
		c: function create() {
			li = element("li");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			li = claim_element(nodes, "LI", { class: true });
			var li_nodes = children(li);
			if (default_slot) default_slot.l(li_nodes);
			li_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(li, li_data);
			add_location(li, file$6, 99, 2, 2363);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);

			if (default_slot) {
				default_slot.m(li, null);
			}

			/*li_binding*/ ctx[22](li);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 1048576) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[20], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null));
			}

			set_attributes(li, get_spread_update(li_levels, [
				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
				dirty & /*props*/ 8 && /*props*/ ctx[3]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (default_slot) default_slot.d(detaching);
			/*li_binding*/ ctx[22](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(99:0) {#if nav}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$2, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*nav*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
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

	let { $$slots = {}, $$scope } = $$props;

	function li_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(1, component = $$value);
		});
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(1, component = $$value);
		});
	}

	$$self.$set = $$new_props => {
		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
		if ("direction" in $$new_props) $$invalidate(5, direction = $$new_props.direction);
		if ("group" in $$new_props) $$invalidate(6, group = $$new_props.group);
		if ("isOpen" in $$new_props) $$invalidate(7, isOpen = $$new_props.isOpen);
		if ("nav" in $$new_props) $$invalidate(0, nav = $$new_props.nav);
		if ("active" in $$new_props) $$invalidate(8, active = $$new_props.active);
		if ("addonType" in $$new_props) $$invalidate(9, addonType = $$new_props.addonType);
		if ("size" in $$new_props) $$invalidate(10, size = $$new_props.size);
		if ("toggle" in $$new_props) $$invalidate(11, toggle = $$new_props.toggle);
		if ("inNavbar" in $$new_props) $$invalidate(12, inNavbar = $$new_props.inNavbar);
		if ("setActiveFromChild" in $$new_props) $$invalidate(13, setActiveFromChild = $$new_props.setActiveFromChild);
		if ("dropup" in $$new_props) $$invalidate(14, dropup = $$new_props.dropup);
		if ("$$scope" in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			context,
			className,
			direction,
			group,
			isOpen,
			nav,
			active,
			addonType,
			size,
			toggle,
			inNavbar,
			setActiveFromChild,
			dropup,
			component,
			subItemIsActive,
			classes
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
		if ("context" in $$props) $$invalidate(16, context = $$new_props.context);
		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
		if ("direction" in $$props) $$invalidate(5, direction = $$new_props.direction);
		if ("group" in $$props) $$invalidate(6, group = $$new_props.group);
		if ("isOpen" in $$props) $$invalidate(7, isOpen = $$new_props.isOpen);
		if ("nav" in $$props) $$invalidate(0, nav = $$new_props.nav);
		if ("active" in $$props) $$invalidate(8, active = $$new_props.active);
		if ("addonType" in $$props) $$invalidate(9, addonType = $$new_props.addonType);
		if ("size" in $$props) $$invalidate(10, size = $$new_props.size);
		if ("toggle" in $$props) $$invalidate(11, toggle = $$new_props.toggle);
		if ("inNavbar" in $$props) $$invalidate(12, inNavbar = $$new_props.inNavbar);
		if ("setActiveFromChild" in $$props) $$invalidate(13, setActiveFromChild = $$new_props.setActiveFromChild);
		if ("dropup" in $$props) $$invalidate(14, dropup = $$new_props.dropup);
		if ("component" in $$props) $$invalidate(1, component = $$new_props.component);
		if ("subItemIsActive" in $$props) $$invalidate(15, subItemIsActive = $$new_props.subItemIsActive);
		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
	};

	let subItemIsActive;
	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*setActiveFromChild, component*/ 8194) {
			 $$invalidate(15, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === "function" && component.querySelector(".active")));
		}

		if ($$self.$$.dirty & /*className, direction, nav, active, setActiveFromChild, subItemIsActive, addonType, group, size, isOpen*/ 42993) {
			 $$invalidate(2, classes = clsx(className, direction !== "down" && `drop${direction}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
				[`input-group-${addonType}`]: addonType,
				"btn-group": group,
				[`btn-group-${size}`]: !!size,
				dropdown: !group && !addonType,
				show: isOpen,
				"nav-item": nav
			}));
		}

		if ($$self.$$.dirty & /*isOpen*/ 128) {
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

		if ($$self.$$.dirty & /*toggle, isOpen, direction, dropup, inNavbar*/ 22688) {
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
	};

	$$props = exclude_internal_props($$props);

	return [
		nav,
		component,
		classes,
		props,
		className,
		direction,
		group,
		isOpen,
		active,
		addonType,
		size,
		toggle,
		inNavbar,
		setActiveFromChild,
		dropup,
		subItemIsActive,
		context,
		validDirections,
		handleDocumentClick,
		$$props,
		$$scope,
		$$slots,
		li_binding,
		div_binding
	];
}

class Dropdown extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
			class: 4,
			direction: 5,
			group: 6,
			isOpen: 7,
			nav: 0,
			active: 8,
			addonType: 9,
			size: 10,
			toggle: 11,
			inNavbar: 12,
			setActiveFromChild: 13,
			dropup: 14
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dropdown",
			options,
			id: create_fragment$6.name
		});
	}

	get class() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get direction() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set direction(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get group() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set group(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isOpen() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isOpen(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get nav() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set nav(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get active() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addonType() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set addonType(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggle() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggle(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inNavbar() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inNavbar(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setActiveFromChild() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set setActiveFromChild(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dropup() {
		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dropup(value) {
		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\UncontrolledDropdown.svelte generated by Svelte v3.18.1 */

// (23:0) <Dropdown   {...props}   {isOpen}   toggle={() => (isOpen = !isOpen)}   class={className}   {disabled}   {direction}   {group}   {nav}   {active}   {addonType}   {size}   {inNavbar}   {setActiveFromChild}   {dropup}>
function create_default_slot(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 131072) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(23:0) <Dropdown   {...props}   {isOpen}   toggle={() => (isOpen = !isOpen)}   class={className}   {disabled}   {direction}   {group}   {nav}   {active}   {addonType}   {size}   {inNavbar}   {setActiveFromChild}   {dropup}>",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let current;

	const dropdown_spread_levels = [
		/*props*/ ctx[12],
		{ isOpen: /*isOpen*/ ctx[11] },
		{ toggle: /*func*/ ctx[16] },
		{ class: /*className*/ ctx[0] },
		{ disabled: /*disabled*/ ctx[1] },
		{ direction: /*direction*/ ctx[2] },
		{ group: /*group*/ ctx[3] },
		{ nav: /*nav*/ ctx[4] },
		{ active: /*active*/ ctx[5] },
		{ addonType: /*addonType*/ ctx[6] },
		{ size: /*size*/ ctx[7] },
		{ inNavbar: /*inNavbar*/ ctx[8] },
		{
			setActiveFromChild: /*setActiveFromChild*/ ctx[9]
		},
		{ dropup: /*dropup*/ ctx[10] }
	];

	let dropdown_props = {
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	for (let i = 0; i < dropdown_spread_levels.length; i += 1) {
		dropdown_props = assign(dropdown_props, dropdown_spread_levels[i]);
	}

	const dropdown = new Dropdown({ props: dropdown_props, $$inline: true });

	const block = {
		c: function create() {
			create_component(dropdown.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(dropdown.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(dropdown, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const dropdown_changes = (dirty & /*props, isOpen, className, disabled, direction, group, nav, active, addonType, size, inNavbar, setActiveFromChild, dropup*/ 8191)
			? get_spread_update(dropdown_spread_levels, [
					dirty & /*props*/ 4096 && get_spread_object(/*props*/ ctx[12]),
					dirty & /*isOpen*/ 2048 && { isOpen: /*isOpen*/ ctx[11] },
					dirty & /*isOpen*/ 2048 && { toggle: /*func*/ ctx[16] },
					dirty & /*className*/ 1 && { class: /*className*/ ctx[0] },
					dirty & /*disabled*/ 2 && { disabled: /*disabled*/ ctx[1] },
					dirty & /*direction*/ 4 && { direction: /*direction*/ ctx[2] },
					dirty & /*group*/ 8 && { group: /*group*/ ctx[3] },
					dirty & /*nav*/ 16 && { nav: /*nav*/ ctx[4] },
					dirty & /*active*/ 32 && { active: /*active*/ ctx[5] },
					dirty & /*addonType*/ 64 && { addonType: /*addonType*/ ctx[6] },
					dirty & /*size*/ 128 && { size: /*size*/ ctx[7] },
					dirty & /*inNavbar*/ 256 && { inNavbar: /*inNavbar*/ ctx[8] },
					dirty & /*setActiveFromChild*/ 512 && {
						setActiveFromChild: /*setActiveFromChild*/ ctx[9]
					},
					dirty & /*dropup*/ 1024 && { dropup: /*dropup*/ ctx[10] }
				])
			: {};

			if (dirty & /*$$scope*/ 131072) {
				dropdown_changes.$$scope = { dirty, ctx };
			}

			dropdown.$set(dropdown_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdown.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdown.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdown, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
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
	let { $$slots = {}, $$scope } = $$props;
	const func = () => $$invalidate(11, isOpen = !isOpen);

	$$self.$set = $$new_props => {
		$$invalidate(14, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
		if ("disabled" in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
		if ("direction" in $$new_props) $$invalidate(2, direction = $$new_props.direction);
		if ("group" in $$new_props) $$invalidate(3, group = $$new_props.group);
		if ("nav" in $$new_props) $$invalidate(4, nav = $$new_props.nav);
		if ("active" in $$new_props) $$invalidate(5, active = $$new_props.active);
		if ("addonType" in $$new_props) $$invalidate(6, addonType = $$new_props.addonType);
		if ("size" in $$new_props) $$invalidate(7, size = $$new_props.size);
		if ("inNavbar" in $$new_props) $$invalidate(8, inNavbar = $$new_props.inNavbar);
		if ("setActiveFromChild" in $$new_props) $$invalidate(9, setActiveFromChild = $$new_props.setActiveFromChild);
		if ("dropup" in $$new_props) $$invalidate(10, dropup = $$new_props.dropup);
		if ("defaultOpen" in $$new_props) $$invalidate(13, defaultOpen = $$new_props.defaultOpen);
		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			disabled,
			direction,
			group,
			nav,
			active,
			addonType,
			size,
			inNavbar,
			setActiveFromChild,
			dropup,
			defaultOpen,
			isOpen
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(14, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
		if ("disabled" in $$props) $$invalidate(1, disabled = $$new_props.disabled);
		if ("direction" in $$props) $$invalidate(2, direction = $$new_props.direction);
		if ("group" in $$props) $$invalidate(3, group = $$new_props.group);
		if ("nav" in $$props) $$invalidate(4, nav = $$new_props.nav);
		if ("active" in $$props) $$invalidate(5, active = $$new_props.active);
		if ("addonType" in $$props) $$invalidate(6, addonType = $$new_props.addonType);
		if ("size" in $$props) $$invalidate(7, size = $$new_props.size);
		if ("inNavbar" in $$props) $$invalidate(8, inNavbar = $$new_props.inNavbar);
		if ("setActiveFromChild" in $$props) $$invalidate(9, setActiveFromChild = $$new_props.setActiveFromChild);
		if ("dropup" in $$props) $$invalidate(10, dropup = $$new_props.dropup);
		if ("defaultOpen" in $$props) $$invalidate(13, defaultOpen = $$new_props.defaultOpen);
		if ("isOpen" in $$props) $$invalidate(11, isOpen = $$new_props.isOpen);
	};

	$$props = exclude_internal_props($$props);

	return [
		className,
		disabled,
		direction,
		group,
		nav,
		active,
		addonType,
		size,
		inNavbar,
		setActiveFromChild,
		dropup,
		isOpen,
		props,
		defaultOpen,
		$$props,
		$$slots,
		func,
		$$scope
	];
}

class UncontrolledDropdown extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
			class: 0,
			disabled: 1,
			direction: 2,
			group: 3,
			nav: 4,
			active: 5,
			addonType: 6,
			size: 7,
			inNavbar: 8,
			setActiveFromChild: 9,
			dropup: 10,
			defaultOpen: 13
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "UncontrolledDropdown",
			options,
			id: create_fragment$7.name
		});
	}

	get class() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get direction() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set direction(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get group() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set group(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get nav() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set nav(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get active() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addonType() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set addonType(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inNavbar() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inNavbar(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setActiveFromChild() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set setActiveFromChild(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dropup() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dropup(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get defaultOpen() {
		throw new Error("<UncontrolledDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set defaultOpen(value) {
		throw new Error("<UncontrolledDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\DropdownToggle.svelte generated by Svelte v3.18.1 */
const file$7 = "node_modules\\sveltestrap\\src\\DropdownToggle.svelte";

// (70:0) {:else}
function create_else_block$2(ctx) {
	let current;

	const button_spread_levels = [
		/*props*/ ctx[9],
		{ ariaHaspopup: /*ariaHaspopup*/ ctx[1] },
		{ class: /*classes*/ ctx[7] },
		{ color: /*color*/ ctx[0] },
		{ size: /*size*/ ctx[4] },
		{ outline: /*outline*/ ctx[6] }
	];

	let button_props = {
		$$slots: { default: [create_default_slot$1] },
		$$scope: { ctx }
	};

	for (let i = 0; i < button_spread_levels.length; i += 1) {
		button_props = assign(button_props, button_spread_levels[i]);
	}

	const button = new Button({ props: button_props, $$inline: true });
	button.$on("click", /*click_handler_2*/ ctx[20]);
	button.$on("click", /*toggleButton*/ ctx[10]);

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
			const button_changes = (dirty & /*props, ariaHaspopup, classes, color, size, outline*/ 723)
			? get_spread_update(button_spread_levels, [
					dirty & /*props*/ 512 && get_spread_object(/*props*/ ctx[9]),
					dirty & /*ariaHaspopup*/ 2 && { ariaHaspopup: /*ariaHaspopup*/ ctx[1] },
					dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] },
					dirty & /*color*/ 1 && { color: /*color*/ ctx[0] },
					dirty & /*size*/ 16 && { size: /*size*/ ctx[4] },
					dirty & /*outline*/ 64 && { outline: /*outline*/ ctx[6] }
				])
			: {};

			if (dirty & /*$$scope, ariaLabel*/ 2097156) {
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
		id: create_else_block$2.name,
		type: "else",
		source: "(70:0) {:else}",
		ctx
	});

	return block;
}

// (57:25) 
function create_if_block_1$1(ctx) {
	let span1;
	let span0;
	let t;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[17].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

	let span1_levels = [
		/*props*/ ctx[9],
		{ ariahaspopup: /*ariaHaspopup*/ ctx[1] },
		{ class: /*classes*/ ctx[7] },
		{ color: /*color*/ ctx[0] },
		{ size: /*size*/ ctx[4] }
	];

	let span1_data = {};

	for (let i = 0; i < span1_levels.length; i += 1) {
		span1_data = assign(span1_data, span1_levels[i]);
	}

	const block = {
		c: function create() {
			span1 = element("span");

			if (!default_slot) {
				span0 = element("span");
				t = text(/*ariaLabel*/ ctx[2]);
			}

			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			span1 = claim_element(nodes, "SPAN", {
				ariaHaspopup: true,
				class: true,
				color: true,
				size: true
			});

			var span1_nodes = children(span1);

			if (!default_slot) {
				span0 = claim_element(span1_nodes, "SPAN", { class: true });
				var span0_nodes = children(span0);
				t = claim_text(span0_nodes, /*ariaLabel*/ ctx[2]);
				span0_nodes.forEach(detach_dev);
			}

			if (default_slot) default_slot.l(span1_nodes);
			span1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!default_slot) {
				attr_dev(span0, "class", "sr-only");
				add_location(span0, file$7, 66, 6, 1287);
			}

			set_attributes(span1, span1_data);
			add_location(span1, file$7, 57, 2, 1145);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span1, anchor);

			if (!default_slot) {
				append_dev(span1, span0);
				append_dev(span0, t);
			}

			if (default_slot) {
				default_slot.m(span1, null);
			}

			current = true;

			dispose = [
				listen_dev(span1, "click", /*click_handler_1*/ ctx[19], false, false, false),
				listen_dev(span1, "click", /*toggleButton*/ ctx[10], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (!default_slot) {
				if (!current || dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
			}

			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2097152) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[21], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null));
			}

			set_attributes(span1, get_spread_update(span1_levels, [
				dirty & /*props*/ 512 && /*props*/ ctx[9],
				dirty & /*ariaHaspopup*/ 2 && { ariahaspopup: /*ariaHaspopup*/ ctx[1] },
				dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] },
				dirty & /*color*/ 1 && { color: /*color*/ ctx[0] },
				dirty & /*size*/ 16 && { size: /*size*/ ctx[4] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span1);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(57:25) ",
		ctx
	});

	return block;
}

// (45:0) {#if nav}
function create_if_block$3(ctx) {
	let a;
	let span;
	let t;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[17].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

	let a_levels = [
		/*props*/ ctx[9],
		{ href: "#nav" },
		{ ariahaspopup: /*ariaHaspopup*/ ctx[1] },
		{ class: /*classes*/ ctx[7] }
	];

	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block = {
		c: function create() {
			a = element("a");

			if (!default_slot) {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[2]);
			}

			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", {
				href: true,
				ariaHaspopup: true,
				class: true
			});

			var a_nodes = children(a);

			if (!default_slot) {
				span = claim_element(a_nodes, "SPAN", { class: true });
				var span_nodes = children(span);
				t = claim_text(span_nodes, /*ariaLabel*/ ctx[2]);
				span_nodes.forEach(detach_dev);
			}

			if (default_slot) default_slot.l(a_nodes);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			if (!default_slot) {
				attr_dev(span, "class", "sr-only");
				add_location(span, file$7, 53, 6, 1057);
			}

			set_attributes(a, a_data);
			add_location(a, file$7, 45, 2, 925);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (!default_slot) {
				append_dev(a, span);
				append_dev(span, t);
			}

			if (default_slot) {
				default_slot.m(a, null);
			}

			current = true;

			dispose = [
				listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false),
				listen_dev(a, "click", /*toggleButton*/ ctx[10], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (!default_slot) {
				if (!current || dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
			}

			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2097152) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[21], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null));
			}

			set_attributes(a, get_spread_update(a_levels, [
				dirty & /*props*/ 512 && /*props*/ ctx[9],
				{ href: "#nav" },
				dirty & /*ariaHaspopup*/ 2 && { ariahaspopup: /*ariaHaspopup*/ ctx[1] },
				dirty & /*classes*/ 128 && { class: /*classes*/ ctx[7] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(45:0) {#if nav}",
		ctx
	});

	return block;
}

// (71:2) <Button     {...props}     on:click     on:click={toggleButton}     {ariaHaspopup}     class={classes}     {color}     {size}     {outline}>
function create_default_slot$1(ctx) {
	let span;
	let t;
	let current;
	const default_slot_template = /*$$slots*/ ctx[17].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

	const block = {
		c: function create() {
			if (!default_slot) {
				span = element("span");
				t = text(/*ariaLabel*/ ctx[2]);
			}

			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			if (!default_slot) {
				span = claim_element(nodes, "SPAN", { class: true });
				var span_nodes = children(span);
				t = claim_text(span_nodes, /*ariaLabel*/ ctx[2]);
				span_nodes.forEach(detach_dev);
			}

			if (default_slot) default_slot.l(nodes);
			this.h();
		},
		h: function hydrate() {
			if (!default_slot) {
				attr_dev(span, "class", "sr-only");
				add_location(span, file$7, 80, 6, 1518);
			}
		},
		m: function mount(target, anchor) {
			if (!default_slot) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			}

			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (!default_slot) {
				if (!current || dirty & /*ariaLabel*/ 4) set_data_dev(t, /*ariaLabel*/ ctx[2]);
			}

			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2097152) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[21], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (!default_slot) {
				if (detaching) detach_dev(span);
			}

			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(71:2) <Button     {...props}     on:click     on:click={toggleButton}     {ariaHaspopup}     class={classes}     {color}     {size}     {outline}>",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$3, create_if_block_1$1, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*nav*/ ctx[3]) return 0;
		if (/*tag*/ ctx[5] === "span") return 1;
		return 2;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	component_subscribe($$self, context, value => $$invalidate(15, $context = value));
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

	function toggleButton(e) {
		if (disabled) {
			e.preventDefault();
			return;
		}

		if (nav) {
			e.preventDefault();
		}

		$context.toggle(e);
	}

	let { $$slots = {}, $$scope } = $$props;

	function click_handler(event) {
		bubble($$self, event);
	}

	function click_handler_1(event) {
		bubble($$self, event);
	}

	function click_handler_2(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
		if ("caret" in $$new_props) $$invalidate(12, caret = $$new_props.caret);
		if ("color" in $$new_props) $$invalidate(0, color = $$new_props.color);
		if ("disabled" in $$new_props) $$invalidate(13, disabled = $$new_props.disabled);
		if ("ariaHaspopup" in $$new_props) $$invalidate(1, ariaHaspopup = $$new_props.ariaHaspopup);
		if ("ariaLabel" in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
		if ("split" in $$new_props) $$invalidate(14, split = $$new_props.split);
		if ("nav" in $$new_props) $$invalidate(3, nav = $$new_props.nav);
		if ("size" in $$new_props) $$invalidate(4, size = $$new_props.size);
		if ("tag" in $$new_props) $$invalidate(5, tag = $$new_props.tag);
		if ("outline" in $$new_props) $$invalidate(6, outline = $$new_props.outline);
		if ("$$scope" in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			caret,
			color,
			disabled,
			ariaHaspopup,
			ariaLabel,
			split,
			nav,
			size,
			tag,
			outline,
			classes,
			$context
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
		if ("caret" in $$props) $$invalidate(12, caret = $$new_props.caret);
		if ("color" in $$props) $$invalidate(0, color = $$new_props.color);
		if ("disabled" in $$props) $$invalidate(13, disabled = $$new_props.disabled);
		if ("ariaHaspopup" in $$props) $$invalidate(1, ariaHaspopup = $$new_props.ariaHaspopup);
		if ("ariaLabel" in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
		if ("split" in $$props) $$invalidate(14, split = $$new_props.split);
		if ("nav" in $$props) $$invalidate(3, nav = $$new_props.nav);
		if ("size" in $$props) $$invalidate(4, size = $$new_props.size);
		if ("tag" in $$props) $$invalidate(5, tag = $$new_props.tag);
		if ("outline" in $$props) $$invalidate(6, outline = $$new_props.outline);
		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
		if ("$context" in $$props) context.set($context = $$new_props.$context);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, caret, split, nav*/ 22536) {
			 $$invalidate(7, classes = clsx(className, {
				"dropdown-toggle": caret || split,
				"dropdown-toggle-split": split,
				"nav-link": nav
			}));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		color,
		ariaHaspopup,
		ariaLabel,
		nav,
		size,
		tag,
		outline,
		classes,
		context,
		props,
		toggleButton,
		className,
		caret,
		disabled,
		split,
		$context,
		$$props,
		$$slots,
		click_handler,
		click_handler_1,
		click_handler_2,
		$$scope
	];
}

class DropdownToggle extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			class: 11,
			caret: 12,
			color: 0,
			disabled: 13,
			ariaHaspopup: 1,
			ariaLabel: 2,
			split: 14,
			nav: 3,
			size: 4,
			tag: 5,
			outline: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropdownToggle",
			options,
			id: create_fragment$8.name
		});
	}

	get class() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get caret() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set caret(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ariaHaspopup() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ariaHaspopup(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ariaLabel() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ariaLabel(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get split() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set split(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get nav() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set nav(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tag() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tag(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outline() {
		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outline(value) {
		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\DropdownMenu.svelte generated by Svelte v3.18.1 */
const file$8 = "node_modules\\sveltestrap\\src\\DropdownMenu.svelte";

function create_fragment$9(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
	let div_levels = [/*props*/ ctx[2], { class: /*classes*/ ctx[0] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$8, 19, 0, 405);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 128) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[7], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 4 && /*props*/ ctx[2],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	component_subscribe($$self, context, value => $$invalidate(5, $context = value));
	let { class: className = "" } = $$props;
	let { right = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
		if ("right" in $$new_props) $$invalidate(4, right = $$new_props.right);
		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, right, classes, $context };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
		if ("right" in $$props) $$invalidate(4, right = $$new_props.right);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
		if ("$context" in $$props) context.set($context = $$new_props.$context);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, right, $context*/ 56) {
			 $$invalidate(0, classes = clsx(className, "dropdown-menu", {
				"dropdown-menu-right": right,
				show: $context.isOpen
			}));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, context, props, className, right, $context, $$props, $$scope, $$slots];
}

class DropdownMenu extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$9, safe_not_equal, { class: 3, right: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropdownMenu",
			options,
			id: create_fragment$9.name
		});
	}

	get class() {
		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get right() {
		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set right(value) {
		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\DropdownItem.svelte generated by Svelte v3.18.1 */
const file$9 = "node_modules\\sveltestrap\\src\\DropdownItem.svelte";

// (53:0) {:else}
function create_else_block$3(ctx) {
	let button;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
	let button_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
	let button_data = {};

	for (let i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	const block = {
		c: function create() {
			button = element("button");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			if (default_slot) default_slot.l(button_nodes);
			button_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(button, button_data);
			add_location(button, file$9, 53, 2, 1125);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			dispose = [
				listen_dev(button, "click", /*click_handler_2*/ ctx[18], false, false, false),
				listen_dev(button, "click", /*handleItemClick*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8192) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
			}

			set_attributes(button, get_spread_update(button_levels, [
				dirty & /*props*/ 32 && /*props*/ ctx[5],
				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(53:0) {:else}",
		ctx
	});

	return block;
}

// (49:15) 
function create_if_block_2$1(ctx) {
	let a;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

	const block = {
		c: function create() {
			a = element("a");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { click: true, href: true, class: true });
			var a_nodes = children(a);
			if (default_slot) default_slot.l(a_nodes);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "click", "");
			attr_dev(a, "href", /*href*/ ctx[2]);
			attr_dev(a, "class", /*classes*/ ctx[3]);
			add_location(a, file$9, 49, 2, 1021);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (default_slot) {
				default_slot.m(a, null);
			}

			current = true;

			dispose = [
				listen_dev(a, "{...props}", /*props_handler*/ ctx[17], false, false, false),
				listen_dev(a, "click", /*handleItemClick*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8192) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
			}

			if (!current || dirty & /*href*/ 4) {
				attr_dev(a, "href", /*href*/ ctx[2]);
			}

			if (!current || dirty & /*classes*/ 8) {
				attr_dev(a, "class", /*classes*/ ctx[3]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(49:15) ",
		ctx
	});

	return block;
}

// (45:18) 
function create_if_block_1$2(ctx) {
	let div;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
	let div_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$9, 45, 2, 912);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;

			dispose = [
				listen_dev(div, "click", /*click_handler_1*/ ctx[16], false, false, false),
				listen_dev(div, "click", /*handleItemClick*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8192) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 32 && /*props*/ ctx[5],
				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(45:18) ",
		ctx
	});

	return block;
}

// (40:0) {#if header}
function create_if_block$4(ctx) {
	let h6;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[14].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
	let h6_levels = [/*props*/ ctx[5], { class: /*classes*/ ctx[3] }];
	let h6_data = {};

	for (let i = 0; i < h6_levels.length; i += 1) {
		h6_data = assign(h6_data, h6_levels[i]);
	}

	const block = {
		c: function create() {
			h6 = element("h6");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			h6 = claim_element(nodes, "H6", { class: true });
			var h6_nodes = children(h6);
			if (default_slot) default_slot.l(h6_nodes);
			h6_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(h6, h6_data);
			add_location(h6, file$9, 40, 2, 801);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h6, anchor);

			if (default_slot) {
				default_slot.m(h6, null);
			}

			current = true;

			dispose = [
				listen_dev(h6, "click", /*click_handler*/ ctx[15], false, false, false),
				listen_dev(h6, "click", /*handleItemClick*/ ctx[6], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8192) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
			}

			set_attributes(h6, get_spread_update(h6_levels, [
				dirty & /*props*/ 32 && /*props*/ ctx[5],
				dirty & /*classes*/ 8 && { class: /*classes*/ ctx[3] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h6);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(40:0) {#if header}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$4, create_if_block_1$2, create_if_block_2$1, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*header*/ ctx[1]) return 0;
		if (/*divider*/ ctx[0]) return 1;
		if (/*href*/ ctx[2]) return 2;
		return 3;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let $context;
	const context = getContext("dropdownContext");
	validate_store(context, "context");
	component_subscribe($$self, context, value => $$invalidate(11, $context = value));
	let { class: className = "" } = $$props;
	let { active = false } = $$props;
	let { disabled = false } = $$props;
	let { divider = false } = $$props;
	let { header = false } = $$props;
	let { toggle = true } = $$props;
	let { href = "" } = $$props;
	const props = clean($$props);

	function handleItemClick(e) {
		if (disabled || header || divider) {
			e.preventDefault();
			return;
		}

		if (toggle) {
			$context.toggle(e);
		}
	}

	let { $$slots = {}, $$scope } = $$props;

	function click_handler(event) {
		bubble($$self, event);
	}

	function click_handler_1(event) {
		bubble($$self, event);
	}

	function props_handler(event) {
		bubble($$self, event);
	}

	function click_handler_2(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(7, className = $$new_props.class);
		if ("active" in $$new_props) $$invalidate(8, active = $$new_props.active);
		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
		if ("divider" in $$new_props) $$invalidate(0, divider = $$new_props.divider);
		if ("header" in $$new_props) $$invalidate(1, header = $$new_props.header);
		if ("toggle" in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			active,
			disabled,
			divider,
			header,
			toggle,
			href,
			classes,
			$context
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(7, className = $$new_props.className);
		if ("active" in $$props) $$invalidate(8, active = $$new_props.active);
		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
		if ("divider" in $$props) $$invalidate(0, divider = $$new_props.divider);
		if ("header" in $$props) $$invalidate(1, header = $$new_props.header);
		if ("toggle" in $$props) $$invalidate(10, toggle = $$new_props.toggle);
		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
		if ("classes" in $$props) $$invalidate(3, classes = $$new_props.classes);
		if ("$context" in $$props) context.set($context = $$new_props.$context);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
			 $$invalidate(3, classes = clsx(className, {
				disabled,
				"dropdown-item": !divider && !header,
				active,
				"dropdown-header": header,
				"dropdown-divider": divider
			}));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		divider,
		header,
		href,
		classes,
		context,
		props,
		handleItemClick,
		className,
		active,
		disabled,
		toggle,
		$context,
		$$props,
		$$scope,
		$$slots,
		click_handler,
		click_handler_1,
		props_handler,
		click_handler_2
	];
}

class DropdownItem extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
			class: 7,
			active: 8,
			disabled: 9,
			divider: 0,
			header: 1,
			toggle: 10,
			href: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropdownItem",
			options,
			id: create_fragment$a.name
		});
	}

	get class() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get active() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set active(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get divider() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set divider(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get header() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set header(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggle() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggle(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<DropdownItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<DropdownItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\ListGroup.svelte generated by Svelte v3.18.1 */
const file$a = "node_modules\\sveltestrap\\src\\ListGroup.svelte";

function create_fragment$b(ctx) {
	let ul;
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let ul_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let ul_data = {};

	for (let i = 0; i < ul_levels.length; i += 1) {
		ul_data = assign(ul_data, ul_levels[i]);
	}

	const block = {
		c: function create() {
			ul = element("ul");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			ul = claim_element(nodes, "UL", { class: true });
			var ul_nodes = children(ul);
			if (default_slot) default_slot.l(ul_nodes);
			ul_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(ul, ul_data);
			add_location(ul, file$a, 17, 0, 298);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			if (default_slot) {
				default_slot.m(ul, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			set_attributes(ul, get_spread_update(ul_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { flush = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("flush" in $$new_props) $$invalidate(3, flush = $$new_props.flush);
		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, flush, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("flush" in $$props) $$invalidate(3, flush = $$new_props.flush);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, flush*/ 12) {
			 $$invalidate(0, classes = clsx(className, "list-group", flush ? "list-group-flush" : false));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, flush, $$props, $$scope, $$slots];
}

class ListGroup extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 2, flush: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ListGroup",
			options,
			id: create_fragment$b.name
		});
	}

	get class() {
		throw new Error("<ListGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<ListGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get flush() {
		throw new Error("<ListGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set flush(value) {
		throw new Error("<ListGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Form.svelte generated by Svelte v3.18.1 */
const file$b = "node_modules\\sveltestrap\\src\\Form.svelte";

function create_fragment$c(ctx) {
	let form;
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let form_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let form_data = {};

	for (let i = 0; i < form_levels.length; i += 1) {
		form_data = assign(form_data, form_levels[i]);
	}

	const block = {
		c: function create() {
			form = element("form");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			form = claim_element(nodes, "FORM", { class: true });
			var form_nodes = children(form);
			if (default_slot) default_slot.l(form_nodes);
			form_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(form, form_data);
			add_location(form, file$b, 13, 0, 265);
		},
		m: function mount(target, anchor) {
			insert_dev(target, form, anchor);

			if (default_slot) {
				default_slot.m(form, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			set_attributes(form, get_spread_update(form_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { inline = false } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("inline" in $$new_props) $$invalidate(3, inline = $$new_props.inline);
		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, inline, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("inline" in $$props) $$invalidate(3, inline = $$new_props.inline);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, inline*/ 12) {
			 $$invalidate(0, classes = clsx(className, inline ? "form-inline" : false));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, inline, $$props, $$scope, $$slots];
}

class Form extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$c, create_fragment$c, safe_not_equal, { class: 2, inline: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Form",
			options,
			id: create_fragment$c.name
		});
	}

	get class() {
		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inline() {
		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inline(value) {
		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\InputGroup.svelte generated by Svelte v3.18.1 */
const file$c = "node_modules\\sveltestrap\\src\\InputGroup.svelte";

function create_fragment$d(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let div_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$c, 17, 0, 296);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { size = "" } = $$props;
	const props = clean($$props);
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("size" in $$new_props) $$invalidate(3, size = $$new_props.size);
		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, size, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("size" in $$props) $$invalidate(3, size = $$new_props.size);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, size*/ 12) {
			 $$invalidate(0, classes = clsx(className, "input-group", size ? `input-group-${size}` : null));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, size, $$props, $$scope, $$slots];
}

class InputGroup extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$d, create_fragment$d, safe_not_equal, { class: 2, size: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InputGroup",
			options,
			id: create_fragment$d.name
		});
	}

	get class() {
		throw new Error("<InputGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<InputGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<InputGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<InputGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\InputGroupAddon.svelte generated by Svelte v3.18.1 */

const { Error: Error_1$1 } = globals;
const file$d = "node_modules\\sveltestrap\\src\\InputGroupAddon.svelte";

function create_fragment$e(ctx) {
	let div;
	let current;
	const default_slot_template = /*$$slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let div_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(div, div_data);
			add_location(div, file$d, 19, 0, 433);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}

			set_attributes(div, get_spread_update(div_levels, [
				dirty & /*props*/ 2 && /*props*/ ctx[1],
				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let { class: className = "" } = $$props;
	let { addonType } = $$props;
	const props = clean($$props);

	if (["prepend", "append"].indexOf(addonType) === -1) {
		throw new Error(`addonType must be one of 'prepend', 'append'. Received '${addonType}' instead.`);
	}

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ("addonType" in $$new_props) $$invalidate(3, addonType = $$new_props.addonType);
		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { className, addonType, classes };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
		if ("addonType" in $$props) $$invalidate(3, addonType = $$new_props.addonType);
		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, addonType*/ 12) {
			 $$invalidate(0, classes = clsx(className, `input-group-${addonType}`));
		}
	};

	$$props = exclude_internal_props($$props);
	return [classes, props, className, addonType, $$props, $$scope, $$slots];
}

class InputGroupAddon extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$e, create_fragment$e, safe_not_equal, { class: 2, addonType: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InputGroupAddon",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*addonType*/ ctx[3] === undefined && !("addonType" in props)) {
			console.warn("<InputGroupAddon> was created without expected prop 'addonType'");
		}
	}

	get class() {
		throw new Error_1$1("<InputGroupAddon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error_1$1("<InputGroupAddon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addonType() {
		throw new Error_1$1("<InputGroupAddon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set addonType(value) {
		throw new Error_1$1("<InputGroupAddon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.18.1 */
const file$e = "node_modules\\sveltestrap\\src\\Label.svelte";

function create_fragment$f(ctx) {
	let label;
	let current;
	const default_slot_template = /*$$slots*/ ctx[18].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

	let label_levels = [
		/*props*/ ctx[3],
		{ id: /*id*/ ctx[1] },
		{ class: /*classes*/ ctx[2] },
		{ for: /*fore*/ ctx[0] }
	];

	let label_data = {};

	for (let i = 0; i < label_levels.length; i += 1) {
		label_data = assign(label_data, label_levels[i]);
	}

	const block = {
		c: function create() {
			label = element("label");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			label = claim_element(nodes, "LABEL", { id: true, class: true, for: true });
			var label_nodes = children(label);
			if (default_slot) default_slot.l(label_nodes);
			label_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(label, label_data);
			add_location(label, file$e, 73, 0, 1685);
		},
		m: function mount(target, anchor) {
			insert_dev(target, label, anchor);

			if (default_slot) {
				default_slot.m(label, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 131072) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
			}

			set_attributes(label, get_spread_update(label_levels, [
				dirty & /*props*/ 8 && /*props*/ ctx[3],
				dirty & /*id*/ 2 && { id: /*id*/ ctx[1] },
				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
				dirty & /*fore*/ 1 && { for: /*fore*/ ctx[0] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(label);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
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

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
		if ("hidden" in $$new_props) $$invalidate(5, hidden = $$new_props.hidden);
		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
		if ("size" in $$new_props) $$invalidate(7, size = $$new_props.size);
		if ("for" in $$new_props) $$invalidate(0, fore = $$new_props.for);
		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
		if ("xs" in $$new_props) $$invalidate(8, xs = $$new_props.xs);
		if ("sm" in $$new_props) $$invalidate(9, sm = $$new_props.sm);
		if ("md" in $$new_props) $$invalidate(10, md = $$new_props.md);
		if ("lg" in $$new_props) $$invalidate(11, lg = $$new_props.lg);
		if ("xl" in $$new_props) $$invalidate(12, xl = $$new_props.xl);
		if ("widths" in $$new_props) $$invalidate(13, widths = $$new_props.widths);
		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			hidden,
			check,
			size,
			fore,
			id,
			xs,
			sm,
			md,
			lg,
			xl,
			widths,
			classes
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
		if ("hidden" in $$props) $$invalidate(5, hidden = $$new_props.hidden);
		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
		if ("size" in $$props) $$invalidate(7, size = $$new_props.size);
		if ("fore" in $$props) $$invalidate(0, fore = $$new_props.fore);
		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
		if ("xs" in $$props) $$invalidate(8, xs = $$new_props.xs);
		if ("sm" in $$props) $$invalidate(9, sm = $$new_props.sm);
		if ("md" in $$props) $$invalidate(10, md = $$new_props.md);
		if ("lg" in $$props) $$invalidate(11, lg = $$new_props.lg);
		if ("xl" in $$props) $$invalidate(12, xl = $$new_props.xl);
		if ("widths" in $$props) $$invalidate(13, widths = $$new_props.widths);
		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
	};

	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*className, hidden, check, size*/ 240) {
			 $$invalidate(2, classes = clsx(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false));
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		fore,
		id,
		classes,
		props,
		className,
		hidden,
		check,
		size,
		xs,
		sm,
		md,
		lg,
		xl,
		widths,
		colWidths,
		colClasses,
		$$props,
		$$scope,
		$$slots
	];
}

class Label extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
			class: 4,
			hidden: 5,
			check: 6,
			size: 7,
			for: 0,
			id: 1,
			xs: 8,
			sm: 9,
			md: 10,
			lg: 11,
			xl: 12,
			widths: 13
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Label",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*fore*/ ctx[0] === undefined && !("for" in props)) {
			console.warn("<Label> was created without expected prop 'for'");
		}
	}

	get class() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hidden() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hidden(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get check() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set check(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get for() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set for(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xs() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xs(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get sm() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set sm(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get md() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set md(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get lg() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set lg(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xl() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xl(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get widths() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set widths(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.18.1 */

const { console: console_1 } = globals;
const file$f = "node_modules\\sveltestrap\\src\\Input.svelte";

// (326:27) 
function create_if_block_15(ctx) {
	let select;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[23].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

	let select_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ multiple: /*multiple*/ ctx[5] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] }
	];

	let select_data = {};

	for (let i = 0; i < select_levels.length; i += 1) {
		select_data = assign(select_data, select_levels[i]);
	}

	const block = {
		c: function create() {
			select = element("select");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			select = claim_element(nodes, "SELECT", {
				id: true,
				multiple: true,
				class: true,
				name: true,
				disabled: true
			});

			var select_nodes = children(select);
			if (default_slot) default_slot.l(select_nodes);
			select_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(select, select_data);
			add_location(select, file$f, 326, 2, 6108);
		},
		m: function mount(target, anchor) {
			insert_dev(target, select, anchor);

			if (default_slot) {
				default_slot.m(select, null);
			}

			current = true;

			dispose = [
				listen_dev(select, "blur", /*blur_handler_14*/ ctx[122], false, false, false),
				listen_dev(select, "focus", /*focus_handler_14*/ ctx[123], false, false, false),
				listen_dev(select, "change", /*change_handler_14*/ ctx[124], false, false, false),
				listen_dev(select, "input", /*input_handler_14*/ ctx[125], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[22], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null));
			}

			set_attributes(select, get_spread_update(select_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				dirty[0] & /*multiple*/ 32 && { multiple: /*multiple*/ ctx[5] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(select);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_15.name,
		type: "if",
		source: "(326:27) ",
		ctx
	});

	return block;
}

// (310:29) 
function create_if_block_14(ctx) {
	let textarea;
	let dispose;

	let textarea_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] }
	];

	let textarea_data = {};

	for (let i = 0; i < textarea_levels.length; i += 1) {
		textarea_data = assign(textarea_data, textarea_levels[i]);
	}

	const block = {
		c: function create() {
			textarea = element("textarea");
			this.h();
		},
		l: function claim(nodes) {
			textarea = claim_element(nodes, "TEXTAREA", {
				id: true,
				class: true,
				name: true,
				disabled: true
			});

			children(textarea).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(textarea, textarea_data);
			add_location(textarea, file$f, 310, 2, 5883);
		},
		m: function mount(target, anchor) {
			insert_dev(target, textarea, anchor);
			set_input_value(textarea, /*value*/ ctx[1]);

			dispose = [
				listen_dev(textarea, "blur", /*blur_handler_13*/ ctx[115], false, false, false),
				listen_dev(textarea, "focus", /*focus_handler_13*/ ctx[116], false, false, false),
				listen_dev(textarea, "keydown", /*keydown_handler_13*/ ctx[117], false, false, false),
				listen_dev(textarea, "keypress", /*keypress_handler_13*/ ctx[118], false, false, false),
				listen_dev(textarea, "keyup", /*keyup_handler_13*/ ctx[119], false, false, false),
				listen_dev(textarea, "change", /*change_handler_13*/ ctx[120], false, false, false),
				listen_dev(textarea, "input", /*input_handler_13*/ ctx[121], false, false, false),
				listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[139])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(textarea, get_spread_update(textarea_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(textarea, /*value*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(textarea);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_14.name,
		type: "if",
		source: "(310:29) ",
		ctx
	});

	return block;
}

// (72:0) {#if tag === 'input'}
function create_if_block$5(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*type*/ ctx[3] === "text") return create_if_block_1$3;
		if (/*type*/ ctx[3] === "password") return create_if_block_2$2;
		if (/*type*/ ctx[3] === "email") return create_if_block_3$1;
		if (/*type*/ ctx[3] === "file") return create_if_block_4;
		if (/*type*/ ctx[3] === "checkbox") return create_if_block_5;
		if (/*type*/ ctx[3] === "radio") return create_if_block_6;
		if (/*type*/ ctx[3] === "url") return create_if_block_7;
		if (/*type*/ ctx[3] === "number") return create_if_block_8;
		if (/*type*/ ctx[3] === "date") return create_if_block_9;
		if (/*type*/ ctx[3] === "time") return create_if_block_10;
		if (/*type*/ ctx[3] === "datetime") return create_if_block_11;
		if (/*type*/ ctx[3] === "color") return create_if_block_12;
		if (/*type*/ ctx[3] === "search") return create_if_block_13;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) {
				if_block.d(detaching);
			}

			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(72:0) {#if tag === 'input'}",
		ctx
	});

	return block;
}

// (290:30) 
function create_if_block_13(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "search" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 290, 4, 5568);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_12*/ ctx[108], false, false, false),
				listen_dev(input, "focus", /*focus_handler_12*/ ctx[109], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[110], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[111], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[112], false, false, false),
				listen_dev(input, "change", /*change_handler_12*/ ctx[113], false, false, false),
				listen_dev(input, "input", /*input_handler_12*/ ctx[114], false, false, false),
				listen_dev(input, "input", /*input_input_handler_9*/ ctx[138])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "search" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_13.name,
		type: "if",
		source: "(290:30) ",
		ctx
	});

	return block;
}

// (272:29) 
function create_if_block_12(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "color" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 272, 4, 5260);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_11*/ ctx[101], false, false, false),
				listen_dev(input, "focus", /*focus_handler_11*/ ctx[102], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[103], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[104], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[105], false, false, false),
				listen_dev(input, "change", /*change_handler_11*/ ctx[106], false, false, false),
				listen_dev(input, "input", /*input_handler_11*/ ctx[107], false, false, false),
				listen_dev(input, "input", /*input_input_handler_8*/ ctx[137])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "color" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_12.name,
		type: "if",
		source: "(272:29) ",
		ctx
	});

	return block;
}

// (254:32) 
function create_if_block_11(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "datetime" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 254, 4, 4950);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_10*/ ctx[94], false, false, false),
				listen_dev(input, "focus", /*focus_handler_10*/ ctx[95], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[96], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[97], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[98], false, false, false),
				listen_dev(input, "change", /*change_handler_10*/ ctx[99], false, false, false),
				listen_dev(input, "input", /*input_handler_10*/ ctx[100], false, false, false),
				listen_dev(input, "input", /*input_input_handler_7*/ ctx[136])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "datetime" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_11.name,
		type: "if",
		source: "(254:32) ",
		ctx
	});

	return block;
}

// (236:28) 
function create_if_block_10(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "time" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 236, 4, 4641);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_9*/ ctx[87], false, false, false),
				listen_dev(input, "focus", /*focus_handler_9*/ ctx[88], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[89], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[90], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[91], false, false, false),
				listen_dev(input, "change", /*change_handler_9*/ ctx[92], false, false, false),
				listen_dev(input, "input", /*input_handler_9*/ ctx[93], false, false, false),
				listen_dev(input, "input", /*input_input_handler_6*/ ctx[135])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "time" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_10.name,
		type: "if",
		source: "(236:28) ",
		ctx
	});

	return block;
}

// (218:28) 
function create_if_block_9(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "date" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 218, 4, 4336);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_8*/ ctx[80], false, false, false),
				listen_dev(input, "focus", /*focus_handler_8*/ ctx[81], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[82], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[83], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[84], false, false, false),
				listen_dev(input, "change", /*change_handler_8*/ ctx[85], false, false, false),
				listen_dev(input, "input", /*input_handler_8*/ ctx[86], false, false, false),
				listen_dev(input, "input", /*input_input_handler_5*/ ctx[134])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "date" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_9.name,
		type: "if",
		source: "(218:28) ",
		ctx
	});

	return block;
}

// (200:30) 
function create_if_block_8(ctx) {
	let input;
	let input_updating = false;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "number" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	function input_input_handler_4() {
		input_updating = true;
		/*input_input_handler_4*/ ctx[133].call(input);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 200, 4, 4029);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_7*/ ctx[73], false, false, false),
				listen_dev(input, "focus", /*focus_handler_7*/ ctx[74], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[75], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[76], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[77], false, false, false),
				listen_dev(input, "change", /*change_handler_7*/ ctx[78], false, false, false),
				listen_dev(input, "input", /*input_handler_7*/ ctx[79], false, false, false),
				listen_dev(input, "input", input_input_handler_4)
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "number" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (!input_updating && dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}

			input_updating = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_8.name,
		type: "if",
		source: "(200:30) ",
		ctx
	});

	return block;
}

// (182:27) 
function create_if_block_7(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "url" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 182, 4, 3723);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_6*/ ctx[66], false, false, false),
				listen_dev(input, "focus", /*focus_handler_6*/ ctx[67], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[68], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[69], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[70], false, false, false),
				listen_dev(input, "change", /*change_handler_6*/ ctx[71], false, false, false),
				listen_dev(input, "input", /*input_handler_6*/ ctx[72], false, false, false),
				listen_dev(input, "input", /*input_input_handler_3*/ ctx[132])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "url" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(182:27) ",
		ctx
	});

	return block;
}

// (164:29) 
function create_if_block_6(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "radio" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 164, 4, 3418);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_5*/ ctx[59], false, false, false),
				listen_dev(input, "focus", /*focus_handler_5*/ ctx[60], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[61], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[62], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[63], false, false, false),
				listen_dev(input, "change", /*change_handler_5*/ ctx[64], false, false, false),
				listen_dev(input, "input", /*input_handler_5*/ ctx[65], false, false, false),
				listen_dev(input, "change", /*input_change_handler_2*/ ctx[131])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "radio" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(164:29) ",
		ctx
	});

	return block;
}

// (145:32) 
function create_if_block_5(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "checkbox" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 145, 4, 3089);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			input.checked = /*checked*/ ctx[0];
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_4*/ ctx[52], false, false, false),
				listen_dev(input, "focus", /*focus_handler_4*/ ctx[53], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[54], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[55], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[56], false, false, false),
				listen_dev(input, "change", /*change_handler_4*/ ctx[57], false, false, false),
				listen_dev(input, "input", /*input_handler_4*/ ctx[58], false, false, false),
				listen_dev(input, "change", /*input_change_handler_1*/ ctx[130])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "checkbox" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}

			if (dirty[0] & /*value*/ 2) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5.name,
		type: "if",
		source: "(145:32) ",
		ctx
	});

	return block;
}

// (127:28) 
function create_if_block_4(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "file" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 127, 4, 2780);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_3*/ ctx[45], false, false, false),
				listen_dev(input, "focus", /*focus_handler_3*/ ctx[46], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[47], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[48], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[49], false, false, false),
				listen_dev(input, "change", /*change_handler_3*/ ctx[50], false, false, false),
				listen_dev(input, "input", /*input_handler_3*/ ctx[51], false, false, false),
				listen_dev(input, "change", /*input_change_handler*/ ctx[129])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "file" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(127:28) ",
		ctx
	});

	return block;
}

// (109:29) 
function create_if_block_3$1(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "email" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 109, 4, 2474);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_2*/ ctx[38], false, false, false),
				listen_dev(input, "focus", /*focus_handler_2*/ ctx[39], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[40], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[41], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[42], false, false, false),
				listen_dev(input, "change", /*change_handler_2*/ ctx[43], false, false, false),
				listen_dev(input, "input", /*input_handler_2*/ ctx[44], false, false, false),
				listen_dev(input, "input", /*input_input_handler_2*/ ctx[128])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "email" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$1.name,
		type: "if",
		source: "(109:29) ",
		ctx
	});

	return block;
}

// (91:32) 
function create_if_block_2$2(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "password" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 91, 4, 2164);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_1*/ ctx[31], false, false, false),
				listen_dev(input, "focus", /*focus_handler_1*/ ctx[32], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[33], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[34], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[35], false, false, false),
				listen_dev(input, "change", /*change_handler_1*/ ctx[36], false, false, false),
				listen_dev(input, "input", /*input_handler_1*/ ctx[37], false, false, false),
				listen_dev(input, "input", /*input_input_handler_1*/ ctx[127])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "password" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(91:32) ",
		ctx
	});

	return block;
}

// (73:2) {#if type === 'text'}
function create_if_block_1$3(ctx) {
	let input;
	let dispose;

	let input_levels = [
		/*props*/ ctx[12],
		{ id: /*id*/ ctx[6] },
		{ type: "text" },
		{ readOnly: /*readonly*/ ctx[4] },
		{ class: /*classes*/ ctx[10] },
		{ name: /*name*/ ctx[7] },
		{ disabled: /*disabled*/ ctx[9] },
		{ placeholder: /*placeholder*/ ctx[8] }
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				id: true,
				type: true,
				readonly: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$f, 73, 4, 1855);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			set_input_value(input, /*value*/ ctx[1]);

			dispose = [
				listen_dev(input, "blur", /*blur_handler*/ ctx[24], false, false, false),
				listen_dev(input, "focus", /*focus_handler*/ ctx[25], false, false, false),
				listen_dev(input, "keydown", /*keydown_handler*/ ctx[26], false, false, false),
				listen_dev(input, "keypress", /*keypress_handler*/ ctx[27], false, false, false),
				listen_dev(input, "keyup", /*keyup_handler*/ ctx[28], false, false, false),
				listen_dev(input, "change", /*change_handler*/ ctx[29], false, false, false),
				listen_dev(input, "input", /*input_handler*/ ctx[30], false, false, false),
				listen_dev(input, "input", /*input_input_handler*/ ctx[126])
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
				{ type: "text" },
				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
			]));

			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(73:2) {#if type === 'text'}",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$5, create_if_block_14, create_if_block_15];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*tag*/ ctx[11] === "input") return 0;
		if (/*tag*/ ctx[11] === "textarea") return 1;
		if (/*tag*/ ctx[11] === "select") return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				} else {
					if_block = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
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
	let { $$slots = {}, $$scope } = $$props;

	function blur_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function keydown_handler(event) {
		bubble($$self, event);
	}

	function keypress_handler(event) {
		bubble($$self, event);
	}

	function keyup_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function input_handler(event) {
		bubble($$self, event);
	}

	function blur_handler_1(event) {
		bubble($$self, event);
	}

	function focus_handler_1(event) {
		bubble($$self, event);
	}

	function keydown_handler_1(event) {
		bubble($$self, event);
	}

	function keypress_handler_1(event) {
		bubble($$self, event);
	}

	function keyup_handler_1(event) {
		bubble($$self, event);
	}

	function change_handler_1(event) {
		bubble($$self, event);
	}

	function input_handler_1(event) {
		bubble($$self, event);
	}

	function blur_handler_2(event) {
		bubble($$self, event);
	}

	function focus_handler_2(event) {
		bubble($$self, event);
	}

	function keydown_handler_2(event) {
		bubble($$self, event);
	}

	function keypress_handler_2(event) {
		bubble($$self, event);
	}

	function keyup_handler_2(event) {
		bubble($$self, event);
	}

	function change_handler_2(event) {
		bubble($$self, event);
	}

	function input_handler_2(event) {
		bubble($$self, event);
	}

	function blur_handler_3(event) {
		bubble($$self, event);
	}

	function focus_handler_3(event) {
		bubble($$self, event);
	}

	function keydown_handler_3(event) {
		bubble($$self, event);
	}

	function keypress_handler_3(event) {
		bubble($$self, event);
	}

	function keyup_handler_3(event) {
		bubble($$self, event);
	}

	function change_handler_3(event) {
		bubble($$self, event);
	}

	function input_handler_3(event) {
		bubble($$self, event);
	}

	function blur_handler_4(event) {
		bubble($$self, event);
	}

	function focus_handler_4(event) {
		bubble($$self, event);
	}

	function keydown_handler_4(event) {
		bubble($$self, event);
	}

	function keypress_handler_4(event) {
		bubble($$self, event);
	}

	function keyup_handler_4(event) {
		bubble($$self, event);
	}

	function change_handler_4(event) {
		bubble($$self, event);
	}

	function input_handler_4(event) {
		bubble($$self, event);
	}

	function blur_handler_5(event) {
		bubble($$self, event);
	}

	function focus_handler_5(event) {
		bubble($$self, event);
	}

	function keydown_handler_5(event) {
		bubble($$self, event);
	}

	function keypress_handler_5(event) {
		bubble($$self, event);
	}

	function keyup_handler_5(event) {
		bubble($$self, event);
	}

	function change_handler_5(event) {
		bubble($$self, event);
	}

	function input_handler_5(event) {
		bubble($$self, event);
	}

	function blur_handler_6(event) {
		bubble($$self, event);
	}

	function focus_handler_6(event) {
		bubble($$self, event);
	}

	function keydown_handler_6(event) {
		bubble($$self, event);
	}

	function keypress_handler_6(event) {
		bubble($$self, event);
	}

	function keyup_handler_6(event) {
		bubble($$self, event);
	}

	function change_handler_6(event) {
		bubble($$self, event);
	}

	function input_handler_6(event) {
		bubble($$self, event);
	}

	function blur_handler_7(event) {
		bubble($$self, event);
	}

	function focus_handler_7(event) {
		bubble($$self, event);
	}

	function keydown_handler_7(event) {
		bubble($$self, event);
	}

	function keypress_handler_7(event) {
		bubble($$self, event);
	}

	function keyup_handler_7(event) {
		bubble($$self, event);
	}

	function change_handler_7(event) {
		bubble($$self, event);
	}

	function input_handler_7(event) {
		bubble($$self, event);
	}

	function blur_handler_8(event) {
		bubble($$self, event);
	}

	function focus_handler_8(event) {
		bubble($$self, event);
	}

	function keydown_handler_8(event) {
		bubble($$self, event);
	}

	function keypress_handler_8(event) {
		bubble($$self, event);
	}

	function keyup_handler_8(event) {
		bubble($$self, event);
	}

	function change_handler_8(event) {
		bubble($$self, event);
	}

	function input_handler_8(event) {
		bubble($$self, event);
	}

	function blur_handler_9(event) {
		bubble($$self, event);
	}

	function focus_handler_9(event) {
		bubble($$self, event);
	}

	function keydown_handler_9(event) {
		bubble($$self, event);
	}

	function keypress_handler_9(event) {
		bubble($$self, event);
	}

	function keyup_handler_9(event) {
		bubble($$self, event);
	}

	function change_handler_9(event) {
		bubble($$self, event);
	}

	function input_handler_9(event) {
		bubble($$self, event);
	}

	function blur_handler_10(event) {
		bubble($$self, event);
	}

	function focus_handler_10(event) {
		bubble($$self, event);
	}

	function keydown_handler_10(event) {
		bubble($$self, event);
	}

	function keypress_handler_10(event) {
		bubble($$self, event);
	}

	function keyup_handler_10(event) {
		bubble($$self, event);
	}

	function change_handler_10(event) {
		bubble($$self, event);
	}

	function input_handler_10(event) {
		bubble($$self, event);
	}

	function blur_handler_11(event) {
		bubble($$self, event);
	}

	function focus_handler_11(event) {
		bubble($$self, event);
	}

	function keydown_handler_11(event) {
		bubble($$self, event);
	}

	function keypress_handler_11(event) {
		bubble($$self, event);
	}

	function keyup_handler_11(event) {
		bubble($$self, event);
	}

	function change_handler_11(event) {
		bubble($$self, event);
	}

	function input_handler_11(event) {
		bubble($$self, event);
	}

	function blur_handler_12(event) {
		bubble($$self, event);
	}

	function focus_handler_12(event) {
		bubble($$self, event);
	}

	function keydown_handler_12(event) {
		bubble($$self, event);
	}

	function keypress_handler_12(event) {
		bubble($$self, event);
	}

	function keyup_handler_12(event) {
		bubble($$self, event);
	}

	function change_handler_12(event) {
		bubble($$self, event);
	}

	function input_handler_12(event) {
		bubble($$self, event);
	}

	function blur_handler_13(event) {
		bubble($$self, event);
	}

	function focus_handler_13(event) {
		bubble($$self, event);
	}

	function keydown_handler_13(event) {
		bubble($$self, event);
	}

	function keypress_handler_13(event) {
		bubble($$self, event);
	}

	function keyup_handler_13(event) {
		bubble($$self, event);
	}

	function change_handler_13(event) {
		bubble($$self, event);
	}

	function input_handler_13(event) {
		bubble($$self, event);
	}

	function blur_handler_14(event) {
		bubble($$self, event);
	}

	function focus_handler_14(event) {
		bubble($$self, event);
	}

	function change_handler_14(event) {
		bubble($$self, event);
	}

	function input_handler_14(event) {
		bubble($$self, event);
	}

	function input_input_handler() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_1() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_2() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_change_handler() {
		files = this.files;
		$$invalidate(2, files);
	}

	function input_change_handler_1() {
		checked = this.checked;
		value = this.value;
		$$invalidate(0, checked);
		$$invalidate(1, value);
	}

	function input_change_handler_2() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_3() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_4() {
		value = to_number(this.value);
		$$invalidate(1, value);
	}

	function input_input_handler_5() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_6() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_7() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_8() {
		value = this.value;
		$$invalidate(1, value);
	}

	function input_input_handler_9() {
		value = this.value;
		$$invalidate(1, value);
	}

	function textarea_input_handler() {
		value = this.value;
		$$invalidate(1, value);
	}

	$$self.$set = $$new_props => {
		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(15, className = $$new_props.class);
		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
		if ("size" in $$new_props) $$invalidate(13, size = $$new_props.size);
		if ("bsSize" in $$new_props) $$invalidate(14, bsSize = $$new_props.bsSize);
		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
		if ("valid" in $$new_props) $$invalidate(16, valid = $$new_props.valid);
		if ("invalid" in $$new_props) $$invalidate(17, invalid = $$new_props.invalid);
		if ("plaintext" in $$new_props) $$invalidate(18, plaintext = $$new_props.plaintext);
		if ("addon" in $$new_props) $$invalidate(19, addon = $$new_props.addon);
		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
		if ("files" in $$new_props) $$invalidate(2, files = $$new_props.files);
		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
		if ("multiple" in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
		if ("id" in $$new_props) $$invalidate(6, id = $$new_props.id);
		if ("name" in $$new_props) $$invalidate(7, name = $$new_props.name);
		if ("placeholder" in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
		if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			type,
			size,
			bsSize,
			checked,
			valid,
			invalid,
			plaintext,
			addon,
			value,
			files,
			readonly,
			multiple,
			id,
			name,
			placeholder,
			disabled,
			classes,
			tag
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(15, className = $$new_props.className);
		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
		if ("size" in $$props) $$invalidate(13, size = $$new_props.size);
		if ("bsSize" in $$props) $$invalidate(14, bsSize = $$new_props.bsSize);
		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
		if ("valid" in $$props) $$invalidate(16, valid = $$new_props.valid);
		if ("invalid" in $$props) $$invalidate(17, invalid = $$new_props.invalid);
		if ("plaintext" in $$props) $$invalidate(18, plaintext = $$new_props.plaintext);
		if ("addon" in $$props) $$invalidate(19, addon = $$new_props.addon);
		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
		if ("files" in $$props) $$invalidate(2, files = $$new_props.files);
		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
		if ("multiple" in $$props) $$invalidate(5, multiple = $$new_props.multiple);
		if ("id" in $$props) $$invalidate(6, id = $$new_props.id);
		if ("name" in $$props) $$invalidate(7, name = $$new_props.name);
		if ("placeholder" in $$props) $$invalidate(8, placeholder = $$new_props.placeholder);
		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
		if ("classes" in $$props) $$invalidate(10, classes = $$new_props.classes);
		if ("tag" in $$props) $$invalidate(11, tag = $$new_props.tag);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*type, plaintext, addon, size, className, invalid, valid, bsSize*/ 1040392) {
			 {
				const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
				const isNotaNumber = new RegExp("\\D", "g");
				const fileInput = type === "file";
				const textareaInput = type === "textarea";
				const selectInput = type === "select";
				$$invalidate(11, tag = selectInput || textareaInput ? type : "input");
				let formControlClass = "form-control";

				if (plaintext) {
					formControlClass = `${formControlClass}-plaintext`;
					$$invalidate(11, tag = "input");
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
					$$invalidate(14, bsSize = size);
					$$invalidate(13, size = undefined);
				}

				$$invalidate(10, classes = clsx(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass));
			}
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		checked,
		value,
		files,
		type,
		readonly,
		multiple,
		id,
		name,
		placeholder,
		disabled,
		classes,
		tag,
		props,
		size,
		bsSize,
		className,
		valid,
		invalid,
		plaintext,
		addon,
		_omitType,
		$$props,
		$$scope,
		$$slots,
		blur_handler,
		focus_handler,
		keydown_handler,
		keypress_handler,
		keyup_handler,
		change_handler,
		input_handler,
		blur_handler_1,
		focus_handler_1,
		keydown_handler_1,
		keypress_handler_1,
		keyup_handler_1,
		change_handler_1,
		input_handler_1,
		blur_handler_2,
		focus_handler_2,
		keydown_handler_2,
		keypress_handler_2,
		keyup_handler_2,
		change_handler_2,
		input_handler_2,
		blur_handler_3,
		focus_handler_3,
		keydown_handler_3,
		keypress_handler_3,
		keyup_handler_3,
		change_handler_3,
		input_handler_3,
		blur_handler_4,
		focus_handler_4,
		keydown_handler_4,
		keypress_handler_4,
		keyup_handler_4,
		change_handler_4,
		input_handler_4,
		blur_handler_5,
		focus_handler_5,
		keydown_handler_5,
		keypress_handler_5,
		keyup_handler_5,
		change_handler_5,
		input_handler_5,
		blur_handler_6,
		focus_handler_6,
		keydown_handler_6,
		keypress_handler_6,
		keyup_handler_6,
		change_handler_6,
		input_handler_6,
		blur_handler_7,
		focus_handler_7,
		keydown_handler_7,
		keypress_handler_7,
		keyup_handler_7,
		change_handler_7,
		input_handler_7,
		blur_handler_8,
		focus_handler_8,
		keydown_handler_8,
		keypress_handler_8,
		keyup_handler_8,
		change_handler_8,
		input_handler_8,
		blur_handler_9,
		focus_handler_9,
		keydown_handler_9,
		keypress_handler_9,
		keyup_handler_9,
		change_handler_9,
		input_handler_9,
		blur_handler_10,
		focus_handler_10,
		keydown_handler_10,
		keypress_handler_10,
		keyup_handler_10,
		change_handler_10,
		input_handler_10,
		blur_handler_11,
		focus_handler_11,
		keydown_handler_11,
		keypress_handler_11,
		keyup_handler_11,
		change_handler_11,
		input_handler_11,
		blur_handler_12,
		focus_handler_12,
		keydown_handler_12,
		keypress_handler_12,
		keyup_handler_12,
		change_handler_12,
		input_handler_12,
		blur_handler_13,
		focus_handler_13,
		keydown_handler_13,
		keypress_handler_13,
		keyup_handler_13,
		change_handler_13,
		input_handler_13,
		blur_handler_14,
		focus_handler_14,
		change_handler_14,
		input_handler_14,
		input_input_handler,
		input_input_handler_1,
		input_input_handler_2,
		input_change_handler,
		input_change_handler_1,
		input_change_handler_2,
		input_input_handler_3,
		input_input_handler_4,
		input_input_handler_5,
		input_input_handler_6,
		input_input_handler_7,
		input_input_handler_8,
		input_input_handler_9,
		textarea_input_handler
	];
}

class Input extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$g,
			create_fragment$g,
			safe_not_equal,
			{
				class: 15,
				type: 3,
				size: 13,
				bsSize: 14,
				checked: 0,
				valid: 16,
				invalid: 17,
				plaintext: 18,
				addon: 19,
				value: 1,
				files: 2,
				readonly: 4,
				multiple: 5,
				id: 6,
				name: 7,
				placeholder: 8,
				disabled: 9
			},
			[-1, -1, -1, -1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Input",
			options,
			id: create_fragment$g.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*readonly*/ ctx[4] === undefined && !("readonly" in props)) {
			console_1.warn("<Input> was created without expected prop 'readonly'");
		}
	}

	get class() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get bsSize() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set bsSize(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checked() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checked(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get valid() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set valid(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get invalid() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set invalid(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get plaintext() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set plaintext(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get addon() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set addon(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get files() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set files(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get readonly() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set readonly(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get multiple() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set multiple(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get placeholder() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set placeholder(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules\sveltestrap\src\CustomInput.svelte generated by Svelte v3.18.1 */
const file$g = "node_modules\\sveltestrap\\src\\CustomInput.svelte";

// (106:0) {:else}
function create_else_block$4(ctx) {
	let input;
	let dispose;

	let input_levels = [
		{ type: /*type*/ ctx[4] },
		{ id: /*id*/ ctx[3] },
		{ class: /*combinedClasses*/ ctx[9] },
		{ name: /*name*/ ctx[2] },
		{ disabled: /*disabled*/ ctx[6] },
		{ placeholder: /*placeholder*/ ctx[7] },
		/*props*/ ctx[14]
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			input = element("input");
			this.h();
		},
		l: function claim(nodes) {
			input = claim_element(nodes, "INPUT", {
				type: true,
				id: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$g, 106, 2, 2411);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_2*/ ctx[34], false, false, false),
				listen_dev(input, "focus", /*focus_handler_2*/ ctx[35], false, false, false),
				listen_dev(input, "change", /*change_handler_2*/ ctx[36], false, false, false),
				listen_dev(input, "input", /*input_handler_2*/ ctx[37], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*type*/ 16 && { type: /*type*/ ctx[4] },
				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
				dirty[0] & /*combinedClasses*/ 512 && { class: /*combinedClasses*/ ctx[9] },
				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
				dirty[0] & /*props*/ 16384 && /*props*/ ctx[14]
			]));
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$4.name,
		type: "else",
		source: "(106:0) {:else}",
		ctx
	});

	return block;
}

// (93:27) 
function create_if_block_3$2(ctx) {
	let div;
	let input;
	let t0;
	let label_1;
	let t1;
	let t2;
	let current;

	let input_levels = [
		{ id: /*id*/ ctx[3] },
		{ type: "radio" },
		{ class: /*customControlClasses*/ ctx[12] },
		{ name: /*name*/ ctx[2] },
		{ disabled: /*disabled*/ ctx[6] },
		{ placeholder: /*placeholder*/ ctx[7] },
		/*props*/ ctx[14]
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const default_slot_template = /*$$slots*/ ctx[25].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], null);

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t0 = space();
			label_1 = element("label");
			t1 = text(/*label*/ ctx[5]);
			t2 = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			input = claim_element(div_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			t0 = claim_space(div_nodes);
			label_1 = claim_element(div_nodes, "LABEL", { class: true, for: true });
			var label_1_nodes = children(label_1);
			t1 = claim_text(label_1_nodes, /*label*/ ctx[5]);
			label_1_nodes.forEach(detach_dev);
			t2 = claim_space(div_nodes);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$g, 94, 4, 2162);
			attr_dev(label_1, "class", "custom-control-label");
			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			add_location(label_1, file$g, 102, 4, 2308);
			attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
			add_location(div, file$g, 93, 2, 2129);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			append_dev(div, t0);
			append_dev(div, label_1);
			append_dev(label_1, t1);
			append_dev(div, t2);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
				{ type: "radio" },
				dirty[0] & /*customControlClasses*/ 4096 && { class: /*customControlClasses*/ ctx[12] },
				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
				dirty[0] & /*props*/ 16384 && /*props*/ ctx[14]
			]));

			if (!current || dirty[0] & /*label*/ 32) set_data_dev(t1, /*label*/ ctx[5]);

			if (!current || dirty[0] & /*labelHtmlFor*/ 8192) {
				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			}

			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 16777216) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[24], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[24], dirty, null));
			}

			if (!current || dirty[0] & /*wrapperClasses*/ 2048) {
				attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$2.name,
		type: "if",
		source: "(93:27) ",
		ctx
	});

	return block;
}

// (79:51) 
function create_if_block_2$3(ctx) {
	let div;
	let input;
	let t0;
	let label_1;
	let t1;
	let t2;
	let current;
	let dispose;

	let input_levels = [
		{ id: /*id*/ ctx[3] },
		{ type: "checkbox" },
		{ class: /*customControlClasses*/ ctx[12] },
		{ name: /*name*/ ctx[2] },
		{ disabled: /*disabled*/ ctx[6] },
		{ placeholder: /*placeholder*/ ctx[7] },
		/*props*/ ctx[14]
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const default_slot_template = /*$$slots*/ ctx[25].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], null);

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t0 = space();
			label_1 = element("label");
			t1 = text(/*label*/ ctx[5]);
			t2 = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			input = claim_element(div_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			t0 = claim_space(div_nodes);
			label_1 = claim_element(div_nodes, "LABEL", { class: true, for: true });
			var label_1_nodes = children(label_1);
			t1 = claim_text(label_1_nodes, /*label*/ ctx[5]);
			label_1_nodes.forEach(detach_dev);
			t2 = claim_space(div_nodes);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$g, 80, 4, 1838);
			attr_dev(label_1, "class", "custom-control-label");
			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			add_location(label_1, file$g, 89, 4, 2006);
			attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
			add_location(div, file$g, 79, 2, 1805);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			input.checked = /*checked*/ ctx[0];
			append_dev(div, t0);
			append_dev(div, label_1);
			append_dev(label_1, t1);
			append_dev(div, t2);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
			dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[39]);
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
				{ type: "checkbox" },
				dirty[0] & /*customControlClasses*/ 4096 && { class: /*customControlClasses*/ ctx[12] },
				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
				dirty[0] & /*props*/ 16384 && /*props*/ ctx[14]
			]));

			if (dirty[0] & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}

			if (!current || dirty[0] & /*label*/ 32) set_data_dev(t1, /*label*/ ctx[5]);

			if (!current || dirty[0] & /*labelHtmlFor*/ 8192) {
				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			}

			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 16777216) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[24], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[24], dirty, null));
			}

			if (!current || dirty[0] & /*wrapperClasses*/ 2048) {
				attr_dev(div, "class", /*wrapperClasses*/ ctx[11]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$3.name,
		type: "if",
		source: "(79:51) ",
		ctx
	});

	return block;
}

// (61:26) 
function create_if_block_1$4(ctx) {
	let div;
	let input;
	let t0;
	let label_1;
	let t1_value = (/*label*/ ctx[5] || "Choose file") + "";
	let t1;
	let dispose;

	let input_levels = [
		{ id: /*id*/ ctx[3] },
		{ type: "file" },
		{ class: /*fileClasses*/ ctx[10] },
		{ name: /*name*/ ctx[2] },
		{ disabled: /*disabled*/ ctx[6] },
		{ placeholder: /*placeholder*/ ctx[7] },
		/*props*/ ctx[14]
	];

	let input_data = {};

	for (let i = 0; i < input_levels.length; i += 1) {
		input_data = assign(input_data, input_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t0 = space();
			label_1 = element("label");
			t1 = text(t1_value);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			input = claim_element(div_nodes, "INPUT", {
				id: true,
				type: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			t0 = claim_space(div_nodes);
			label_1 = claim_element(div_nodes, "LABEL", { class: true, for: true });
			var label_1_nodes = children(label_1);
			t1 = claim_text(label_1_nodes, t1_value);
			label_1_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(input, input_data);
			add_location(input, file$g, 62, 4, 1449);
			attr_dev(label_1, "class", "custom-file-label");
			attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			add_location(label_1, file$g, 74, 4, 1645);
			attr_dev(div, "class", /*customClass*/ ctx[8]);
			add_location(div, file$g, 61, 2, 1419);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			append_dev(div, t0);
			append_dev(div, label_1);
			append_dev(label_1, t1);

			dispose = [
				listen_dev(input, "blur", /*blur_handler_1*/ ctx[30], false, false, false),
				listen_dev(input, "focus", /*focus_handler_1*/ ctx[31], false, false, false),
				listen_dev(input, "change", /*change_handler_1*/ ctx[32], false, false, false),
				listen_dev(input, "input", /*input_handler_1*/ ctx[33], false, false, false)
			];
		},
		p: function update(ctx, dirty) {
			set_attributes(input, get_spread_update(input_levels, [
				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
				{ type: "file" },
				dirty[0] & /*fileClasses*/ 1024 && { class: /*fileClasses*/ ctx[10] },
				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
				dirty[0] & /*props*/ 16384 && /*props*/ ctx[14]
			]));

			if (dirty[0] & /*label*/ 32 && t1_value !== (t1_value = (/*label*/ ctx[5] || "Choose file") + "")) set_data_dev(t1, t1_value);

			if (dirty[0] & /*labelHtmlFor*/ 8192) {
				attr_dev(label_1, "for", /*labelHtmlFor*/ ctx[13]);
			}

			if (dirty[0] & /*customClass*/ 256) {
				attr_dev(div, "class", /*customClass*/ ctx[8]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(61:26) ",
		ctx
	});

	return block;
}

// (46:0) {#if type === 'select'}
function create_if_block$6(ctx) {
	let select;
	let current;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[25].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[24], null);

	let select_levels = [
		{ id: /*id*/ ctx[3] },
		{ class: /*combinedClasses*/ ctx[9] },
		{ name: /*name*/ ctx[2] },
		{ disabled: /*disabled*/ ctx[6] },
		{ placeholder: /*placeholder*/ ctx[7] },
		/*props*/ ctx[14]
	];

	let select_data = {};

	for (let i = 0; i < select_levels.length; i += 1) {
		select_data = assign(select_data, select_levels[i]);
	}

	const block = {
		c: function create() {
			select = element("select");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			select = claim_element(nodes, "SELECT", {
				id: true,
				class: true,
				name: true,
				disabled: true,
				placeholder: true
			});

			var select_nodes = children(select);
			if (default_slot) default_slot.l(select_nodes);
			select_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(select, select_data);
			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[38].call(select));
			add_location(select, file$g, 46, 2, 1193);
		},
		m: function mount(target, anchor) {
			insert_dev(target, select, anchor);

			if (default_slot) {
				default_slot.m(select, null);
			}

			select_option(select, /*value*/ ctx[1]);
			current = true;

			dispose = [
				listen_dev(select, "blur", /*blur_handler*/ ctx[26], false, false, false),
				listen_dev(select, "focus", /*focus_handler*/ ctx[27], false, false, false),
				listen_dev(select, "change", /*change_handler*/ ctx[28], false, false, false),
				listen_dev(select, "input", /*input_handler*/ ctx[29], false, false, false),
				listen_dev(select, "change", /*select_change_handler*/ ctx[38])
			];
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 16777216) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[24], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[24], dirty, null));
			}

			set_attributes(select, get_spread_update(select_levels, [
				dirty[0] & /*id*/ 8 && { id: /*id*/ ctx[3] },
				dirty[0] & /*combinedClasses*/ 512 && { class: /*combinedClasses*/ ctx[9] },
				dirty[0] & /*name*/ 4 && { name: /*name*/ ctx[2] },
				dirty[0] & /*disabled*/ 64 && { disabled: /*disabled*/ ctx[6] },
				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
				dirty[0] & /*props*/ 16384 && /*props*/ ctx[14]
			]));

			if (dirty[0] & /*value*/ 2) {
				select_option(select, /*value*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(select);
			if (default_slot) default_slot.d(detaching);
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(46:0) {#if type === 'select'}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;

	const if_block_creators = [
		create_if_block$6,
		create_if_block_1$4,
		create_if_block_2$3,
		create_if_block_3$2,
		create_else_block$4
	];

	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*type*/ ctx[4] === "select") return 0;
		if (/*type*/ ctx[4] === "file") return 1;
		if (/*type*/ ctx[4] === "switch" || /*type*/ ctx[4] === "checkbox") return 2;
		if (/*type*/ ctx[4] === "radio") return 3;
		return 4;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
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

	let { $$slots = {}, $$scope } = $$props;

	function blur_handler(event) {
		bubble($$self, event);
	}

	function focus_handler(event) {
		bubble($$self, event);
	}

	function change_handler(event) {
		bubble($$self, event);
	}

	function input_handler(event) {
		bubble($$self, event);
	}

	function blur_handler_1(event) {
		bubble($$self, event);
	}

	function focus_handler_1(event) {
		bubble($$self, event);
	}

	function change_handler_1(event) {
		bubble($$self, event);
	}

	function input_handler_1(event) {
		bubble($$self, event);
	}

	function blur_handler_2(event) {
		bubble($$self, event);
	}

	function focus_handler_2(event) {
		bubble($$self, event);
	}

	function change_handler_2(event) {
		bubble($$self, event);
	}

	function input_handler_2(event) {
		bubble($$self, event);
	}

	function select_change_handler() {
		value = select_value(this);
		$$invalidate(1, value);
	}

	function input_change_handler() {
		checked = this.checked;
		$$invalidate(0, checked);
	}

	$$self.$set = $$new_props => {
		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("class" in $$new_props) $$invalidate(15, className = $$new_props.class);
		if ("name" in $$new_props) $$invalidate(2, name = $$new_props.name);
		if ("id" in $$new_props) $$invalidate(3, id = $$new_props.id);
		if ("type" in $$new_props) $$invalidate(4, type = $$new_props.type);
		if ("label" in $$new_props) $$invalidate(5, label = $$new_props.label);
		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
		if ("disabled" in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
		if ("inline" in $$new_props) $$invalidate(16, inline = $$new_props.inline);
		if ("valid" in $$new_props) $$invalidate(17, valid = $$new_props.valid);
		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
		if ("invalid" in $$new_props) $$invalidate(18, invalid = $$new_props.invalid);
		if ("bsSize" in $$new_props) $$invalidate(19, bsSize = $$new_props.bsSize);
		if ("placeholder" in $$new_props) $$invalidate(7, placeholder = $$new_props.placeholder);
		if ("for" in $$new_props) $$invalidate(20, htmlFor = $$new_props.for);
		if ("$$scope" in $$new_props) $$invalidate(24, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			className,
			name,
			id,
			type,
			label,
			checked,
			disabled,
			inline,
			valid,
			value,
			invalid,
			bsSize,
			placeholder,
			htmlFor,
			customClass,
			validationClassNames,
			combinedClasses,
			fileClasses,
			wrapperClasses,
			customControlClasses,
			labelHtmlFor
		};
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
		if ("className" in $$props) $$invalidate(15, className = $$new_props.className);
		if ("name" in $$props) $$invalidate(2, name = $$new_props.name);
		if ("id" in $$props) $$invalidate(3, id = $$new_props.id);
		if ("type" in $$props) $$invalidate(4, type = $$new_props.type);
		if ("label" in $$props) $$invalidate(5, label = $$new_props.label);
		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
		if ("disabled" in $$props) $$invalidate(6, disabled = $$new_props.disabled);
		if ("inline" in $$props) $$invalidate(16, inline = $$new_props.inline);
		if ("valid" in $$props) $$invalidate(17, valid = $$new_props.valid);
		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
		if ("invalid" in $$props) $$invalidate(18, invalid = $$new_props.invalid);
		if ("bsSize" in $$props) $$invalidate(19, bsSize = $$new_props.bsSize);
		if ("placeholder" in $$props) $$invalidate(7, placeholder = $$new_props.placeholder);
		if ("htmlFor" in $$props) $$invalidate(20, htmlFor = $$new_props.htmlFor);
		if ("customClass" in $$props) $$invalidate(8, customClass = $$new_props.customClass);
		if ("validationClassNames" in $$props) $$invalidate(21, validationClassNames = $$new_props.validationClassNames);
		if ("combinedClasses" in $$props) $$invalidate(9, combinedClasses = $$new_props.combinedClasses);
		if ("fileClasses" in $$props) $$invalidate(10, fileClasses = $$new_props.fileClasses);
		if ("wrapperClasses" in $$props) $$invalidate(11, wrapperClasses = $$new_props.wrapperClasses);
		if ("customControlClasses" in $$props) $$invalidate(12, customControlClasses = $$new_props.customControlClasses);
		if ("labelHtmlFor" in $$props) $$invalidate(13, labelHtmlFor = $$new_props.labelHtmlFor);
	};

	let customClass;
	let validationClassNames;
	let combinedClasses;
	let fileClasses;
	let wrapperClasses;
	let customControlClasses;
	let labelHtmlFor;

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*className, type, bsSize*/ 557072) {
			 $$invalidate(8, customClass = clsx(className, `custom-${type}`, bsSize ? `custom-${type}-${bsSize}` : false));
		}

		if ($$self.$$.dirty[0] & /*invalid, valid*/ 393216) {
			 $$invalidate(21, validationClassNames = clsx(invalid && "is-invalid", valid && "is-valid"));
		}

		if ($$self.$$.dirty[0] & /*customClass, validationClassNames*/ 2097408) {
			 $$invalidate(9, combinedClasses = clsx(customClass, validationClassNames));
		}

		if ($$self.$$.dirty[0] & /*validationClassNames*/ 2097152) {
			 $$invalidate(10, fileClasses = clsx(validationClassNames, "custom-file-input"));
		}

		if ($$self.$$.dirty[0] & /*customClass, inline*/ 65792) {
			 $$invalidate(11, wrapperClasses = clsx(customClass, "custom-control", { "custom-control-inline": inline }));
		}

		if ($$self.$$.dirty[0] & /*validationClassNames*/ 2097152) {
			 $$invalidate(12, customControlClasses = clsx(validationClassNames, "custom-control-input"));
		}

		if ($$self.$$.dirty[0] & /*htmlFor, id*/ 1048584) {
			 $$invalidate(13, labelHtmlFor = htmlFor || id);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		checked,
		value,
		name,
		id,
		type,
		label,
		disabled,
		placeholder,
		customClass,
		combinedClasses,
		fileClasses,
		wrapperClasses,
		customControlClasses,
		labelHtmlFor,
		props,
		className,
		inline,
		valid,
		invalid,
		bsSize,
		htmlFor,
		validationClassNames,
		_omitType,
		$$props,
		$$scope,
		$$slots,
		blur_handler,
		focus_handler,
		change_handler,
		input_handler,
		blur_handler_1,
		focus_handler_1,
		change_handler_1,
		input_handler_1,
		blur_handler_2,
		focus_handler_2,
		change_handler_2,
		input_handler_2,
		select_change_handler,
		input_change_handler
	];
}

class CustomInput extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$h,
			create_fragment$h,
			safe_not_equal,
			{
				class: 15,
				name: 2,
				id: 3,
				type: 4,
				label: 5,
				checked: 0,
				disabled: 6,
				inline: 16,
				valid: 17,
				value: 1,
				invalid: 18,
				bsSize: 19,
				placeholder: 7,
				for: 20
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CustomInput",
			options,
			id: create_fragment$h.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*type*/ ctx[4] === undefined && !("type" in props)) {
			console.warn("<CustomInput> was created without expected prop 'type'");
		}
	}

	get class() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get id() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get type() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set type(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checked() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checked(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inline() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inline(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get valid() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set valid(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get invalid() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set invalid(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get bsSize() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set bsSize(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get placeholder() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set placeholder(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get for() {
		throw new Error("<CustomInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set for(value) {
		throw new Error("<CustomInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\Navbar.svelte generated by Svelte v3.18.1 */
const file$h = "src\\components\\Navbar.svelte";

// (31:2) <NavbarBrand href=".">
function create_default_slot_13(ctx) {
	let span;
	let t0;
	let t1;

	const block = {
		c: function create() {
			span = element("span");
			t0 = text("λ");
			t1 = text(/*title*/ ctx[1]);
			this.h();
		},
		l: function claim(nodes) {
			span = claim_element(nodes, "SPAN", { class: true });
			var span_nodes = children(span);
			t0 = claim_text(span_nodes, "λ");
			span_nodes.forEach(detach_dev);
			t1 = claim_text(nodes, /*title*/ ctx[1]);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span, "class", "l-logo-span");
			add_location(span, file$h, 30, 24, 1402);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t0);
			insert_dev(target, t1, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			if (detaching) detach_dev(t1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_13.name,
		type: "slot",
		source: "(31:2) <NavbarBrand href=\\\".\\\">",
		ctx
	});

	return block;
}

// (41:10) <Button color="primary" on:click={searchHandle}>
function create_default_slot_12(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-search");
			add_location(i, file$h, 41, 12, 1783);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_12.name,
		type: "slot",
		source: "(41:10) <Button color=\\\"primary\\\" on:click={searchHandle}>",
		ctx
	});

	return block;
}

// (40:8) <InputGroupAddon addonType={'append'}>
function create_default_slot_11(ctx) {
	let current;

	const button = new Button({
			props: {
				color: "primary",
				$$slots: { default: [create_default_slot_12] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", searchHandle);

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

			if (dirty & /*$$scope*/ 4) {
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
		id: create_default_slot_11.name,
		type: "slot",
		source: "(40:8) <InputGroupAddon addonType={'append'}>",
		ctx
	});

	return block;
}

// (34:6) <InputGroup>
function create_default_slot_10(ctx) {
	let t;
	let current;

	const input = new Input({
			props: {
				type: "search",
				name: "search",
				id: "exampleSearch",
				placeholder: "Искать.."
			},
			$$inline: true
		});

	const inputgroupaddon = new InputGroupAddon({
			props: {
				addonType: "append",
				$$slots: { default: [create_default_slot_11] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(input.$$.fragment);
			t = space();
			create_component(inputgroupaddon.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(input.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(inputgroupaddon.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(input, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(inputgroupaddon, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const inputgroupaddon_changes = {};

			if (dirty & /*$$scope*/ 4) {
				inputgroupaddon_changes.$$scope = { dirty, ctx };
			}

			inputgroupaddon.$set(inputgroupaddon_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(input.$$.fragment, local);
			transition_in(inputgroupaddon.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(input.$$.fragment, local);
			transition_out(inputgroupaddon.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(input, detaching);
			if (detaching) detach_dev(t);
			destroy_component(inputgroupaddon, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_10.name,
		type: "slot",
		source: "(34:6) <InputGroup>",
		ctx
	});

	return block;
}

// (33:4) <Form inline>
function create_default_slot_9(ctx) {
	let current;

	const inputgroup = new InputGroup({
			props: {
				$$slots: { default: [create_default_slot_10] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(inputgroup.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(inputgroup.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(inputgroup, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const inputgroup_changes = {};

			if (dirty & /*$$scope*/ 4) {
				inputgroup_changes.$$scope = { dirty, ctx };
			}

			inputgroup.$set(inputgroup_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(inputgroup.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(inputgroup.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(inputgroup, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_9.name,
		type: "slot",
		source: "(33:4) <Form inline>",
		ctx
	});

	return block;
}

// (49:8) <DropdownToggle nav caret>
function create_default_slot_8(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-user-circle fa-fw ml-3");
			add_location(i, file$h, 49, 10, 2025);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_8.name,
		type: "slot",
		source: "(49:8) <DropdownToggle nav caret>",
		ctx
	});

	return block;
}

// (53:10) <DropdownItem>
function create_default_slot_7(ctx) {
	let a;
	let i;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t = text(" Настройки");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { class: true, href: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			t = claim_text(a_nodes, " Настройки");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-cog");
			add_location(i, file$h, 54, 51, 2220);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "settings");
			add_location(a, file$h, 54, 10, 2179);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, i);
			append_dev(a, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(53:10) <DropdownItem>",
		ctx
	});

	return block;
}

// (57:10) <DropdownItem>
function create_default_slot_6(ctx) {
	let a;
	let i;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t = text(" Активность");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { class: true, href: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			t = claim_text(a_nodes, " Активность");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-clipboard-list");
			add_location(i, file$h, 57, 57, 2370);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "activity_log");
			add_location(a, file$h, 57, 12, 2325);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, i);
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
		source: "(57:10) <DropdownItem>",
		ctx
	});

	return block;
}

// (61:10) <DropdownItem>
function create_default_slot_5(ctx) {
	let a;
	let i;
	let t;

	const block = {
		c: function create() {
			a = element("a");
			i = element("i");
			t = text("  Выйти");
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { class: true, href: true });
			var a_nodes = children(a);
			i = claim_element(a_nodes, "I", { class: true });
			children(i).forEach(detach_dev);
			t = claim_text(a_nodes, "  Выйти");
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-sign-out-alt");
			add_location(i, file$h, 62, 12, 2598);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "pages/authentication/login");
			add_location(a, file$h, 61, 12, 2525);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, i);
			append_dev(a, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(61:10) <DropdownItem>",
		ctx
	});

	return block;
}

// (52:8) <DropdownMenu right>
function create_default_slot_4(ctx) {
	let t0;
	let t1;
	let t2;
	let current;

	const dropdownitem0 = new DropdownItem({
			props: {
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const dropdownitem1 = new DropdownItem({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const dropdownitem2 = new DropdownItem({ props: { divider: true }, $$inline: true });

	const dropdownitem3 = new DropdownItem({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dropdownitem0.$$.fragment);
			t0 = space();
			create_component(dropdownitem1.$$.fragment);
			t1 = space();
			create_component(dropdownitem2.$$.fragment);
			t2 = space();
			create_component(dropdownitem3.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(dropdownitem0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(dropdownitem1.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(dropdownitem2.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(dropdownitem3.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(dropdownitem0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(dropdownitem1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(dropdownitem2, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(dropdownitem3, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const dropdownitem0_changes = {};

			if (dirty & /*$$scope*/ 4) {
				dropdownitem0_changes.$$scope = { dirty, ctx };
			}

			dropdownitem0.$set(dropdownitem0_changes);
			const dropdownitem1_changes = {};

			if (dirty & /*$$scope*/ 4) {
				dropdownitem1_changes.$$scope = { dirty, ctx };
			}

			dropdownitem1.$set(dropdownitem1_changes);
			const dropdownitem3_changes = {};

			if (dirty & /*$$scope*/ 4) {
				dropdownitem3_changes.$$scope = { dirty, ctx };
			}

			dropdownitem3.$set(dropdownitem3_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdownitem0.$$.fragment, local);
			transition_in(dropdownitem1.$$.fragment, local);
			transition_in(dropdownitem2.$$.fragment, local);
			transition_in(dropdownitem3.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdownitem0.$$.fragment, local);
			transition_out(dropdownitem1.$$.fragment, local);
			transition_out(dropdownitem2.$$.fragment, local);
			transition_out(dropdownitem3.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdownitem0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(dropdownitem1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(dropdownitem2, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(dropdownitem3, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(52:8) <DropdownMenu right>",
		ctx
	});

	return block;
}

// (48:6) <UncontrolledDropdown nav inNavbar>
function create_default_slot_3(ctx) {
	let t;
	let current;

	const dropdowntoggle = new DropdownToggle({
			props: {
				nav: true,
				caret: true,
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const dropdownmenu = new DropdownMenu({
			props: {
				right: true,
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dropdowntoggle.$$.fragment);
			t = space();
			create_component(dropdownmenu.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(dropdowntoggle.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(dropdownmenu.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(dropdowntoggle, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(dropdownmenu, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const dropdowntoggle_changes = {};

			if (dirty & /*$$scope*/ 4) {
				dropdowntoggle_changes.$$scope = { dirty, ctx };
			}

			dropdowntoggle.$set(dropdowntoggle_changes);
			const dropdownmenu_changes = {};

			if (dirty & /*$$scope*/ 4) {
				dropdownmenu_changes.$$scope = { dirty, ctx };
			}

			dropdownmenu.$set(dropdownmenu_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdowntoggle.$$.fragment, local);
			transition_in(dropdownmenu.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdowntoggle.$$.fragment, local);
			transition_out(dropdownmenu.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdowntoggle, detaching);
			if (detaching) detach_dev(t);
			destroy_component(dropdownmenu, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(48:6) <UncontrolledDropdown nav inNavbar>",
		ctx
	});

	return block;
}

// (47:4) <ListGroup class="ml-auto ml-md-0">
function create_default_slot_2(ctx) {
	let current;

	const uncontrolleddropdown = new UncontrolledDropdown({
			props: {
				nav: true,
				inNavbar: true,
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(uncontrolleddropdown.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(uncontrolleddropdown.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(uncontrolleddropdown, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const uncontrolleddropdown_changes = {};

			if (dirty & /*$$scope*/ 4) {
				uncontrolleddropdown_changes.$$scope = { dirty, ctx };
			}

			uncontrolleddropdown.$set(uncontrolleddropdown_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(uncontrolleddropdown.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(uncontrolleddropdown.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(uncontrolleddropdown, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(47:4) <ListGroup class=\\\"ml-auto ml-md-0\\\">",
		ctx
	});

	return block;
}

// (32:2) <Nav class="ml-auto" navbar>
function create_default_slot_1(ctx) {
	let t;
	let current;

	const form = new Form({
			props: {
				inline: true,
				$$slots: { default: [create_default_slot_9] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const listgroup = new ListGroup({
			props: {
				class: "ml-auto ml-md-0",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(form.$$.fragment);
			t = space();
			create_component(listgroup.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(form.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(listgroup.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(form, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(listgroup, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const form_changes = {};

			if (dirty & /*$$scope*/ 4) {
				form_changes.$$scope = { dirty, ctx };
			}

			form.$set(form_changes);
			const listgroup_changes = {};

			if (dirty & /*$$scope*/ 4) {
				listgroup_changes.$$scope = { dirty, ctx };
			}

			listgroup.$set(listgroup_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(form.$$.fragment, local);
			transition_in(listgroup.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(form.$$.fragment, local);
			transition_out(listgroup.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(form, detaching);
			if (detaching) detach_dev(t);
			destroy_component(listgroup, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(32:2) <Nav class=\\\"ml-auto\\\" navbar>",
		ctx
	});

	return block;
}

// (30:0) <Navbar class="l-proton-topnav navbar-expand" {color} dark expand="md">
function create_default_slot$2(ctx) {
	let t;
	let current;

	const navbarbrand = new NavbarBrand({
			props: {
				href: ".",
				$$slots: { default: [create_default_slot_13] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const nav = new Nav({
			props: {
				class: "ml-auto",
				navbar: true,
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(navbarbrand.$$.fragment);
			t = space();
			create_component(nav.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(navbarbrand.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(nav.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(navbarbrand, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(nav, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const navbarbrand_changes = {};

			if (dirty & /*$$scope, title*/ 6) {
				navbarbrand_changes.$$scope = { dirty, ctx };
			}

			navbarbrand.$set(navbarbrand_changes);
			const nav_changes = {};

			if (dirty & /*$$scope*/ 4) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(navbarbrand.$$.fragment, local);
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(navbarbrand.$$.fragment, local);
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(navbarbrand, detaching);
			if (detaching) detach_dev(t);
			destroy_component(nav, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(30:0) <Navbar class=\\\"l-proton-topnav navbar-expand\\\" {color} dark expand=\\\"md\\\">",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let current;

	const navbar = new Navbar({
			props: {
				class: "l-proton-topnav navbar-expand",
				color: /*color*/ ctx[0],
				dark: true,
				expand: "md",
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(navbar.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(navbar.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(navbar, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const navbar_changes = {};
			if (dirty & /*color*/ 1) navbar_changes.color = /*color*/ ctx[0];

			if (dirty & /*$$scope, title*/ 6) {
				navbar_changes.$$scope = { dirty, ctx };
			}

			navbar.$set(navbar_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(navbar.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(navbar.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(navbar, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function searchHandle() {
	event.preventDefault();
}

function instance$i($$self, $$props, $$invalidate) {
	let { color } = $$props;
	let { title } = $$props;
	const writable_props = ["color", "title"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("color" in $$props) $$invalidate(0, color = $$props.color);
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
	};

	$$self.$capture_state = () => {
		return { color, title };
	};

	$$self.$inject_state = $$props => {
		if ("color" in $$props) $$invalidate(0, color = $$props.color);
		if ("title" in $$props) $$invalidate(1, title = $$props.title);
	};

	return [color, title];
}

class Navbar_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$i, create_fragment$i, safe_not_equal, { color: 0, title: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Navbar_1",
			options,
			id: create_fragment$i.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*color*/ ctx[0] === undefined && !("color" in props)) {
			console.warn("<Navbar> was created without expected prop 'color'");
		}

		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
			console.warn("<Navbar> was created without expected prop 'title'");
		}
	}

	get color() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get title() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set title(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\SidebarItem.svelte generated by Svelte v3.18.1 */
const file$i = "src\\components\\SidebarItem.svelte";
const get_rightIcon_slot_changes = dirty => ({});
const get_rightIcon_slot_context = ctx => ({});
const get_leftIcon_slot_changes = dirty => ({});
const get_leftIcon_slot_context = ctx => ({});

// (19:2) {#if leftIcon}
function create_if_block_1$5(ctx) {
	let div;
	let current;
	const leftIcon_slot_template = /*$$slots*/ ctx[8].leftIcon;
	const leftIcon_slot = create_slot(leftIcon_slot_template, ctx, /*$$scope*/ ctx[7], get_leftIcon_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (leftIcon_slot) leftIcon_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (leftIcon_slot) leftIcon_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "l-proton-nav-link-icon");
			add_location(div, file$i, 19, 4, 462);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (leftIcon_slot) {
				leftIcon_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (leftIcon_slot && leftIcon_slot.p && dirty & /*$$scope*/ 128) {
				leftIcon_slot.p(get_slot_context(leftIcon_slot_template, ctx, /*$$scope*/ ctx[7], get_leftIcon_slot_context), get_slot_changes(leftIcon_slot_template, /*$$scope*/ ctx[7], dirty, get_leftIcon_slot_changes));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(leftIcon_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(leftIcon_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (leftIcon_slot) leftIcon_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(19:2) {#if leftIcon}",
		ctx
	});

	return block;
}

// (25:2) {#if rightIcon}
function create_if_block$7(ctx) {
	let div;
	let current;
	const rightIcon_slot_template = /*$$slots*/ ctx[8].rightIcon;
	const rightIcon_slot = create_slot(rightIcon_slot_template, ctx, /*$$scope*/ ctx[7], get_rightIcon_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (rightIcon_slot) rightIcon_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (rightIcon_slot) rightIcon_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "l-proton-sidenav-collapse-arrow");
			add_location(div, file$i, 25, 4, 586);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (rightIcon_slot) {
				rightIcon_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (rightIcon_slot && rightIcon_slot.p && dirty & /*$$scope*/ 128) {
				rightIcon_slot.p(get_slot_context(rightIcon_slot_template, ctx, /*$$scope*/ ctx[7], get_rightIcon_slot_context), get_slot_changes(rightIcon_slot_template, /*$$scope*/ ctx[7], dirty, get_rightIcon_slot_changes));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(rightIcon_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(rightIcon_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (rightIcon_slot) rightIcon_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(25:2) {#if rightIcon}",
		ctx
	});

	return block;
}

function create_fragment$j(ctx) {
	let a;
	let t0;
	let t1;
	let t2;
	let a_class_value;
	let current;
	let dispose;
	let if_block0 = /*leftIcon*/ ctx[2] && create_if_block_1$5(ctx);
	let if_block1 = /*rightIcon*/ ctx[3] && create_if_block$7(ctx);

	const block = {
		c: function create() {
			a = element("a");
			if (if_block0) if_block0.c();
			t0 = space();
			t1 = text(/*text*/ ctx[0]);
			t2 = space();
			if (if_block1) if_block1.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { class: true, href: true });
			var a_nodes = children(a);
			if (if_block0) if_block0.l(a_nodes);
			t0 = claim_space(a_nodes);
			t1 = claim_text(a_nodes, /*text*/ ctx[0]);
			t2 = claim_space(a_nodes);
			if (if_block1) if_block1.l(a_nodes);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a, "class", a_class_value = "nav-link " + /*className*/ ctx[4]);
			attr_dev(a, "href", /*href*/ ctx[1]);
			add_location(a, file$i, 17, 0, 376);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			if (if_block0) if_block0.m(a, null);
			append_dev(a, t0);
			append_dev(a, t1);
			append_dev(a, t2);
			if (if_block1) if_block1.m(a, null);
			current = true;
			dispose = listen_dev(a, "click", /*handleClick*/ ctx[5], false, false, false);
		},
		p: function update(ctx, [dirty]) {
			if (/*leftIcon*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
					transition_in(if_block0, 1);
				} else {
					if_block0 = create_if_block_1$5(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(a, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*text*/ 1) set_data_dev(t1, /*text*/ ctx[0]);

			if (/*rightIcon*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
					transition_in(if_block1, 1);
				} else {
					if_block1 = create_if_block$7(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(a, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*className*/ 16 && a_class_value !== (a_class_value = "nav-link " + /*className*/ ctx[4])) {
				attr_dev(a, "class", a_class_value);
			}

			if (!current || dirty & /*href*/ 2) {
				attr_dev(a, "href", /*href*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$j($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { text = "" } = $$props;
	let { href = "javascript:void(0)" } = $$props;
	let { leftIcon = false } = $$props;
	let { rightIcon = false } = $$props;
	let { class: className = "" } = $$props;

	const handleClick = () => {
		dispatch("press");
	};

	const writable_props = ["text", "href", "leftIcon", "rightIcon", "class"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SidebarItem> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("text" in $$props) $$invalidate(0, text = $$props.text);
		if ("href" in $$props) $$invalidate(1, href = $$props.href);
		if ("leftIcon" in $$props) $$invalidate(2, leftIcon = $$props.leftIcon);
		if ("rightIcon" in $$props) $$invalidate(3, rightIcon = $$props.rightIcon);
		if ("class" in $$props) $$invalidate(4, className = $$props.class);
		if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return {
			text,
			href,
			leftIcon,
			rightIcon,
			className
		};
	};

	$$self.$inject_state = $$props => {
		if ("text" in $$props) $$invalidate(0, text = $$props.text);
		if ("href" in $$props) $$invalidate(1, href = $$props.href);
		if ("leftIcon" in $$props) $$invalidate(2, leftIcon = $$props.leftIcon);
		if ("rightIcon" in $$props) $$invalidate(3, rightIcon = $$props.rightIcon);
		if ("className" in $$props) $$invalidate(4, className = $$props.className);
	};

	return [
		text,
		href,
		leftIcon,
		rightIcon,
		className,
		handleClick,
		dispatch,
		$$scope,
		$$slots
	];
}

class SidebarItem extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
			text: 0,
			href: 1,
			leftIcon: 2,
			rightIcon: 3,
			class: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SidebarItem",
			options,
			id: create_fragment$j.name
		});
	}

	get text() {
		throw new Error("<SidebarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set text(value) {
		throw new Error("<SidebarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<SidebarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<SidebarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get leftIcon() {
		throw new Error("<SidebarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set leftIcon(value) {
		throw new Error("<SidebarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rightIcon() {
		throw new Error("<SidebarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rightIcon(value) {
		throw new Error("<SidebarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<SidebarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<SidebarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\Sidebar.svelte generated by Svelte v3.18.1 */
const file$j = "src\\components\\Sidebar.svelte";

// (62:10) 
function create_leftIcon_slot_4(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-atom");
			attr_dev(i, "slot", "leftIcon");
			add_location(i, file$j, 61, 10, 1753);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_leftIcon_slot_4.name,
		type: "slot",
		source: "(62:10) ",
		ctx
	});

	return block;
}

// (54:8) <SidebarItem            on:press={() => {              theme = 'dark';            }}            text="Dashboard"            class={segment === '.' || segment === undefined ? 'active' : ''}            leftIcon            href=".">
function create_default_slot_16(ctx) {
	const block = {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_16.name,
		type: "slot",
		source: "(54:8) <SidebarItem            on:press={() => {              theme = 'dark';            }}            text=\\\"Dashboard\\\"            class={segment === '.' || segment === undefined ? 'active' : ''}            leftIcon            href=\\\".\\\">",
		ctx
	});

	return block;
}

// (71:10) 
function create_leftIcon_slot_3(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-columns");
			attr_dev(i, "slot", "leftIcon");
			add_location(i, file$j, 70, 10, 2075);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_leftIcon_slot_3.name,
		type: "slot",
		source: "(71:10) ",
		ctx
	});

	return block;
}

// (72:10) 
function create_rightIcon_slot_3(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-angle-down");
			attr_dev(i, "slot", "rightIcon");
			add_location(i, file$j, 71, 10, 2131);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rightIcon_slot_3.name,
		type: "slot",
		source: "(72:10) ",
		ctx
	});

	return block;
}

// (65:8) <SidebarItem            on:press={toggleLayout}            class={!isLayoutOpen ? 'collapsed' : ''}            text="Layouts"            leftIcon            rightIcon>
function create_default_slot_15(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		l: function claim(nodes) {
			t = claim_space(nodes);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_15.name,
		type: "slot",
		source: "(65:8) <SidebarItem            on:press={toggleLayout}            class={!isLayoutOpen ? 'collapsed' : ''}            text=\\\"Layouts\\\"            leftIcon            rightIcon>",
		ctx
	});

	return block;
}

// (75:10) <Nav class="l-proton-sidenav-menu-nested">
function create_default_slot_14(ctx) {
	let t;
	let current;

	const sidebaritem0 = new SidebarItem({
			props: {
				class: /*segment*/ ctx[1] === "layouts" && /*activeLink*/ ctx[6] === "Static Navigation"
				? "active"
				: "",
				href: "layouts/static_navigation",
				text: "Static Navigation"
			},
			$$inline: true
		});

	sidebaritem0.$on("press", /*press_handler_1*/ ctx[16]);

	const sidebaritem1 = new SidebarItem({
			props: {
				class: /*segment*/ ctx[1] === "layouts" && /*activeLink*/ ctx[6] === "Light Sidenav"
				? "active"
				: "",
				href: "layouts/light_sidenav",
				text: "Light Sidenav"
			},
			$$inline: true
		});

	sidebaritem1.$on("press", /*press_handler_2*/ ctx[17]);

	const block = {
		c: function create() {
			create_component(sidebaritem0.$$.fragment);
			t = space();
			create_component(sidebaritem1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(sidebaritem0.$$.fragment, nodes);
			t = claim_space(nodes);
			claim_component(sidebaritem1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(sidebaritem0, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(sidebaritem1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const sidebaritem0_changes = {};

			if (dirty & /*segment, activeLink*/ 66) sidebaritem0_changes.class = /*segment*/ ctx[1] === "layouts" && /*activeLink*/ ctx[6] === "Static Navigation"
			? "active"
			: "";

			sidebaritem0.$set(sidebaritem0_changes);
			const sidebaritem1_changes = {};

			if (dirty & /*segment, activeLink*/ 66) sidebaritem1_changes.class = /*segment*/ ctx[1] === "layouts" && /*activeLink*/ ctx[6] === "Light Sidenav"
			? "active"
			: "";

			sidebaritem1.$set(sidebaritem1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(sidebaritem0.$$.fragment, local);
			transition_in(sidebaritem1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sidebaritem0.$$.fragment, local);
			transition_out(sidebaritem1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(sidebaritem0, detaching);
			if (detaching) detach_dev(t);
			destroy_component(sidebaritem1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_14.name,
		type: "slot",
		source: "(75:10) <Nav class=\\\"l-proton-sidenav-menu-nested\\\">",
		ctx
	});

	return block;
}

// (74:8) <Collapse isOpen={isLayoutOpen}>
function create_default_slot_13$1(ctx) {
	let current;

	const nav = new Nav({
			props: {
				class: "l-proton-sidenav-menu-nested",
				$$slots: { default: [create_default_slot_14] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(nav.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(nav.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(nav, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nav_changes = {};

			if (dirty & /*$$scope, segment, activeLink, theme*/ 1048643) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(nav, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_13$1.name,
		type: "slot",
		source: "(74:8) <Collapse isOpen={isLayoutOpen}>",
		ctx
	});

	return block;
}

// (100:10) <svg              slot="leftIcon"              class="svg-inline--fa fa-book-open fa-w-18"              aria-hidden="true"              focusable="false"              data-prefix="fas"              data-icon="book-open"              role="img"              xmlns="http://www.w3.org/2000/svg"              viewBox="0 0 576 512"              data-fa-i2svg="">
function create_leftIcon_slot_2(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			this.h();
		},
		l: function claim(nodes) {
			svg = claim_element(
				nodes,
				"svg",
				{
					slot: true,
					class: true,
					"aria-hidden": true,
					focusable: true,
					"data-prefix": true,
					"data-icon": true,
					role: true,
					xmlns: true,
					viewBox: true,
					"data-fa-i2svg": true
				},
				1
			);

			var svg_nodes = children(svg);
			path = claim_element(svg_nodes, "path", { fill: true, d: true }, 1);
			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path, "fill", "currentColor");
			attr_dev(path, "d", "M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64\r\n              2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49\r\n              69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43\r\n              30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73\r\n              87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0\r\n              62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11\r\n              218.77 46.95 10.62 5.35 23.21-1.94\r\n              23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z");
			add_location(path, file$j, 110, 12, 3593);
			attr_dev(svg, "slot", "leftIcon");
			attr_dev(svg, "class", "svg-inline--fa fa-book-open fa-w-18");
			attr_dev(svg, "aria-hidden", "true");
			attr_dev(svg, "focusable", "false");
			attr_dev(svg, "data-prefix", "fas");
			attr_dev(svg, "data-icon", "book-open");
			attr_dev(svg, "role", "img");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 576 512");
			attr_dev(svg, "data-fa-i2svg", "");
			add_location(svg, file$j, 99, 10, 3222);
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_leftIcon_slot_2.name,
		type: "slot",
		source: "(100:10) <svg              slot=\\\"leftIcon\\\"              class=\\\"svg-inline--fa fa-book-open fa-w-18\\\"              aria-hidden=\\\"true\\\"              focusable=\\\"false\\\"              data-prefix=\\\"fas\\\"              data-icon=\\\"book-open\\\"              role=\\\"img\\\"              xmlns=\\\"http://www.w3.org/2000/svg\\\"              viewBox=\\\"0 0 576 512\\\"              data-fa-i2svg=\\\"\\\">",
		ctx
	});

	return block;
}

// (122:10) 
function create_rightIcon_slot_2(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-angle-down");
			attr_dev(i, "slot", "rightIcon");
			add_location(i, file$j, 121, 10, 4244);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rightIcon_slot_2.name,
		type: "slot",
		source: "(122:10) ",
		ctx
	});

	return block;
}

// (94:8) <SidebarItem            on:press={togglePages}            class={!isPageOpen ? 'collapsed' : ''}            text="Страницы"            leftIcon            rightIcon>
function create_default_slot_12$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = space();
		},
		l: function claim(nodes) {
			t = claim_space(nodes);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_12$1.name,
		type: "slot",
		source: "(94:8) <SidebarItem            on:press={togglePages}            class={!isPageOpen ? 'collapsed' : ''}            text=\\\"Страницы\\\"            leftIcon            rightIcon>",
		ctx
	});

	return block;
}

// (133:14) 
function create_rightIcon_slot_1(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-angle-down");
			attr_dev(i, "slot", "rightIcon");
			add_location(i, file$j, 132, 14, 4689);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rightIcon_slot_1.name,
		type: "slot",
		source: "(133:14) ",
		ctx
	});

	return block;
}

// (128:12) <SidebarItem                on:press={toggleAuthentication}                class={!isAuthenticationOpen ? 'collapsed' : ''}                text="Authentication"                rightIcon>
function create_default_slot_11$1(ctx) {
	const block = {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_11$1.name,
		type: "slot",
		source: "(128:12) <SidebarItem                on:press={toggleAuthentication}                class={!isAuthenticationOpen ? 'collapsed' : ''}                text=\\\"Authentication\\\"                rightIcon>",
		ctx
	});

	return block;
}

// (136:14) <Nav class="l-proton-sidenav-menu-nested">
function create_default_slot_10$1(ctx) {
	let t0;
	let t1;
	let current;

	const sidebaritem0 = new SidebarItem({
			props: {
				href: "pages/authentication/login",
				text: "Login"
			},
			$$inline: true
		});

	const sidebaritem1 = new SidebarItem({
			props: {
				href: "pages/authentication/register",
				text: "Register"
			},
			$$inline: true
		});

	const sidebaritem2 = new SidebarItem({
			props: {
				href: "pages/authentication/forget_password",
				text: "Forgot Password"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(sidebaritem0.$$.fragment);
			t0 = space();
			create_component(sidebaritem1.$$.fragment);
			t1 = space();
			create_component(sidebaritem2.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(sidebaritem0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(sidebaritem1.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(sidebaritem2.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(sidebaritem0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(sidebaritem1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(sidebaritem2, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(sidebaritem0.$$.fragment, local);
			transition_in(sidebaritem1.$$.fragment, local);
			transition_in(sidebaritem2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sidebaritem0.$$.fragment, local);
			transition_out(sidebaritem1.$$.fragment, local);
			transition_out(sidebaritem2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(sidebaritem0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(sidebaritem1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(sidebaritem2, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_10$1.name,
		type: "slot",
		source: "(136:14) <Nav class=\\\"l-proton-sidenav-menu-nested\\\">",
		ctx
	});

	return block;
}

// (135:12) <Collapse isOpen={isAuthenticationOpen}>
function create_default_slot_9$1(ctx) {
	let current;

	const nav = new Nav({
			props: {
				class: "l-proton-sidenav-menu-nested",
				$$slots: { default: [create_default_slot_10$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(nav.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(nav.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(nav, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nav_changes = {};

			if (dirty & /*$$scope*/ 1048576) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(nav, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_9$1.name,
		type: "slot",
		source: "(135:12) <Collapse isOpen={isAuthenticationOpen}>",
		ctx
	});

	return block;
}

// (151:14) 
function create_rightIcon_slot(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-angle-down");
			attr_dev(i, "slot", "rightIcon");
			add_location(i, file$j, 150, 14, 5455);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_rightIcon_slot.name,
		type: "slot",
		source: "(151:14) ",
		ctx
	});

	return block;
}

// (146:12) <SidebarItem                on:press={toggleError}                class={!isErrorOpen ? 'collapsed' : ''}                text="Error"                rightIcon>
function create_default_slot_8$1(ctx) {
	const block = {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_8$1.name,
		type: "slot",
		source: "(146:12) <SidebarItem                on:press={toggleError}                class={!isErrorOpen ? 'collapsed' : ''}                text=\\\"Error\\\"                rightIcon>",
		ctx
	});

	return block;
}

// (154:14) <Nav class="l-proton-sidenav-menu-nested">
function create_default_slot_7$1(ctx) {
	let t0;
	let t1;
	let current;

	const sidebaritem0 = new SidebarItem({
			props: {
				href: "pages/error/error_401",
				text: "401 Page"
			},
			$$inline: true
		});

	const sidebaritem1 = new SidebarItem({
			props: {
				href: "pages/error/error_404",
				text: "404 Page"
			},
			$$inline: true
		});

	const sidebaritem2 = new SidebarItem({
			props: {
				href: "pages/error/error_500",
				text: "500 Page"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(sidebaritem0.$$.fragment);
			t0 = space();
			create_component(sidebaritem1.$$.fragment);
			t1 = space();
			create_component(sidebaritem2.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(sidebaritem0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(sidebaritem1.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(sidebaritem2.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(sidebaritem0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(sidebaritem1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(sidebaritem2, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(sidebaritem0.$$.fragment, local);
			transition_in(sidebaritem1.$$.fragment, local);
			transition_in(sidebaritem2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sidebaritem0.$$.fragment, local);
			transition_out(sidebaritem1.$$.fragment, local);
			transition_out(sidebaritem2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(sidebaritem0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(sidebaritem1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(sidebaritem2, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7$1.name,
		type: "slot",
		source: "(154:14) <Nav class=\\\"l-proton-sidenav-menu-nested\\\">",
		ctx
	});

	return block;
}

// (153:12) <Collapse isOpen={isErrorOpen}>
function create_default_slot_6$1(ctx) {
	let current;

	const nav = new Nav({
			props: {
				class: "l-proton-sidenav-menu-nested",
				$$slots: { default: [create_default_slot_7$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(nav.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(nav.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(nav, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nav_changes = {};

			if (dirty & /*$$scope*/ 1048576) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(nav, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6$1.name,
		type: "slot",
		source: "(153:12) <Collapse isOpen={isErrorOpen}>",
		ctx
	});

	return block;
}

// (125:10) <Nav              class="l-proton-sidenav-menu-nested accordion"              id="sidenavAccordionPages">
function create_default_slot_5$1(ctx) {
	let t0;
	let t1;
	let t2;
	let current;

	const sidebaritem0 = new SidebarItem({
			props: {
				class: !/*isAuthenticationOpen*/ ctx[4] ? "collapsed" : "",
				text: "Authentication",
				rightIcon: true,
				$$slots: {
					default: [create_default_slot_11$1],
					rightIcon: [create_rightIcon_slot_1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem0.$on("press", /*toggleAuthentication*/ ctx[13]);

	const collapse0 = new Collapse({
			props: {
				isOpen: /*isAuthenticationOpen*/ ctx[4],
				$$slots: { default: [create_default_slot_9$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const sidebaritem1 = new SidebarItem({
			props: {
				class: !/*isErrorOpen*/ ctx[5] ? "collapsed" : "",
				text: "Error",
				rightIcon: true,
				$$slots: {
					default: [create_default_slot_8$1],
					rightIcon: [create_rightIcon_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem1.$on("press", /*toggleError*/ ctx[14]);

	const collapse1 = new Collapse({
			props: {
				isOpen: /*isErrorOpen*/ ctx[5],
				$$slots: { default: [create_default_slot_6$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(sidebaritem0.$$.fragment);
			t0 = space();
			create_component(collapse0.$$.fragment);
			t1 = space();
			create_component(sidebaritem1.$$.fragment);
			t2 = space();
			create_component(collapse1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(sidebaritem0.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(collapse0.$$.fragment, nodes);
			t1 = claim_space(nodes);
			claim_component(sidebaritem1.$$.fragment, nodes);
			t2 = claim_space(nodes);
			claim_component(collapse1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(sidebaritem0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(collapse0, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(sidebaritem1, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(collapse1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const sidebaritem0_changes = {};
			if (dirty & /*isAuthenticationOpen*/ 16) sidebaritem0_changes.class = !/*isAuthenticationOpen*/ ctx[4] ? "collapsed" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem0_changes.$$scope = { dirty, ctx };
			}

			sidebaritem0.$set(sidebaritem0_changes);
			const collapse0_changes = {};
			if (dirty & /*isAuthenticationOpen*/ 16) collapse0_changes.isOpen = /*isAuthenticationOpen*/ ctx[4];

			if (dirty & /*$$scope*/ 1048576) {
				collapse0_changes.$$scope = { dirty, ctx };
			}

			collapse0.$set(collapse0_changes);
			const sidebaritem1_changes = {};
			if (dirty & /*isErrorOpen*/ 32) sidebaritem1_changes.class = !/*isErrorOpen*/ ctx[5] ? "collapsed" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem1_changes.$$scope = { dirty, ctx };
			}

			sidebaritem1.$set(sidebaritem1_changes);
			const collapse1_changes = {};
			if (dirty & /*isErrorOpen*/ 32) collapse1_changes.isOpen = /*isErrorOpen*/ ctx[5];

			if (dirty & /*$$scope*/ 1048576) {
				collapse1_changes.$$scope = { dirty, ctx };
			}

			collapse1.$set(collapse1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(sidebaritem0.$$.fragment, local);
			transition_in(collapse0.$$.fragment, local);
			transition_in(sidebaritem1.$$.fragment, local);
			transition_in(collapse1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sidebaritem0.$$.fragment, local);
			transition_out(collapse0.$$.fragment, local);
			transition_out(sidebaritem1.$$.fragment, local);
			transition_out(collapse1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(sidebaritem0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(collapse0, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(sidebaritem1, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(collapse1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5$1.name,
		type: "slot",
		source: "(125:10) <Nav              class=\\\"l-proton-sidenav-menu-nested accordion\\\"              id=\\\"sidenavAccordionPages\\\">",
		ctx
	});

	return block;
}

// (124:8) <Collapse isOpen={isPageOpen}>
function create_default_slot_4$1(ctx) {
	let current;

	const nav = new Nav({
			props: {
				class: "l-proton-sidenav-menu-nested accordion",
				id: "sidenavAccordionPages",
				$$slots: { default: [create_default_slot_5$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(nav.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(nav.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(nav, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nav_changes = {};

			if (dirty & /*$$scope, isErrorOpen, isAuthenticationOpen*/ 1048624) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(nav, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4$1.name,
		type: "slot",
		source: "(124:8) <Collapse isOpen={isPageOpen}>",
		ctx
	});

	return block;
}

// (171:10) 
function create_leftIcon_slot_1(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-chart-area");
			attr_dev(i, "slot", "leftIcon");
			add_location(i, file$j, 170, 10, 6262);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_leftIcon_slot_1.name,
		type: "slot",
		source: "(171:10) ",
		ctx
	});

	return block;
}

// (163:8) <SidebarItem            class={segment === 'charts' ? 'active' : ''}            on:press={() => {              theme = 'dark';            }}            href="charts"            text="Charts"            leftIcon>
function create_default_slot_3$1(ctx) {
	const block = {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3$1.name,
		type: "slot",
		source: "(163:8) <SidebarItem            class={segment === 'charts' ? 'active' : ''}            on:press={() => {              theme = 'dark';            }}            href=\\\"charts\\\"            text=\\\"Charts\\\"            leftIcon>",
		ctx
	});

	return block;
}

// (181:10) 
function create_leftIcon_slot(ctx) {
	let i;

	const block = {
		c: function create() {
			i = element("i");
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", { class: true, slot: true });
			children(i).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "class", "fas fa-table");
			attr_dev(i, "slot", "leftIcon");
			add_location(i, file$j, 180, 10, 6566);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_leftIcon_slot.name,
		type: "slot",
		source: "(181:10) ",
		ctx
	});

	return block;
}

// (173:8) <SidebarItem            class={segment === 'tables' ? 'active' : ''}            on:press={() => {              theme = 'dark';            }}            href="tables"            text="Tables"            leftIcon>
function create_default_slot_2$1(ctx) {
	const block = {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$1.name,
		type: "slot",
		source: "(173:8) <SidebarItem            class={segment === 'tables' ? 'active' : ''}            on:press={() => {              theme = 'dark';            }}            href=\\\"tables\\\"            text=\\\"Tables\\\"            leftIcon>",
		ctx
	});

	return block;
}

// (52:6) <Nav>
function create_default_slot_1$1(ctx) {
	let div0;
	let t0;
	let t1;
	let t2;
	let div1;
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	let t8;
	let div2;
	let t9;
	let t10;
	let t11;
	let current;

	const sidebaritem0 = new SidebarItem({
			props: {
				text: "Dashboard",
				class: /*segment*/ ctx[1] === "." || /*segment*/ ctx[1] === undefined
				? "active"
				: "",
				leftIcon: true,
				href: ".",
				$$slots: {
					default: [create_default_slot_16],
					leftIcon: [create_leftIcon_slot_4]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem0.$on("press", /*press_handler*/ ctx[15]);

	const sidebaritem1 = new SidebarItem({
			props: {
				class: !/*isLayoutOpen*/ ctx[2] ? "collapsed" : "",
				text: "Layouts",
				leftIcon: true,
				rightIcon: true,
				$$slots: {
					default: [create_default_slot_15],
					rightIcon: [create_rightIcon_slot_3],
					leftIcon: [create_leftIcon_slot_3]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem1.$on("press", /*toggleLayout*/ ctx[11]);

	const collapse0 = new Collapse({
			props: {
				isOpen: /*isLayoutOpen*/ ctx[2],
				$$slots: { default: [create_default_slot_13$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const sidebaritem2 = new SidebarItem({
			props: {
				class: !/*isPageOpen*/ ctx[3] ? "collapsed" : "",
				text: "Страницы",
				leftIcon: true,
				rightIcon: true,
				$$slots: {
					default: [create_default_slot_12$1],
					rightIcon: [create_rightIcon_slot_2],
					leftIcon: [create_leftIcon_slot_2]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem2.$on("press", /*togglePages*/ ctx[12]);

	const collapse1 = new Collapse({
			props: {
				isOpen: /*isPageOpen*/ ctx[3],
				$$slots: { default: [create_default_slot_4$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const sidebaritem3 = new SidebarItem({
			props: {
				class: /*segment*/ ctx[1] === "charts" ? "active" : "",
				href: "charts",
				text: "Charts",
				leftIcon: true,
				$$slots: {
					default: [create_default_slot_3$1],
					leftIcon: [create_leftIcon_slot_1]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem3.$on("press", /*press_handler_3*/ ctx[18]);

	const sidebaritem4 = new SidebarItem({
			props: {
				class: /*segment*/ ctx[1] === "tables" ? "active" : "",
				href: "tables",
				text: "Tables",
				leftIcon: true,
				$$slots: {
					default: [create_default_slot_2$1],
					leftIcon: [create_leftIcon_slot]
				},
				$$scope: { ctx }
			},
			$$inline: true
		});

	sidebaritem4.$on("press", /*press_handler_4*/ ctx[19]);

	const block = {
		c: function create() {
			div0 = element("div");
			t0 = text("Ядро");
			t1 = space();
			create_component(sidebaritem0.$$.fragment);
			t2 = space();
			div1 = element("div");
			t3 = text("Интерфейс");
			t4 = space();
			create_component(sidebaritem1.$$.fragment);
			t5 = space();
			create_component(collapse0.$$.fragment);
			t6 = space();
			create_component(sidebaritem2.$$.fragment);
			t7 = space();
			create_component(collapse1.$$.fragment);
			t8 = space();
			div2 = element("div");
			t9 = text("Аддоны и примеси");
			t10 = space();
			create_component(sidebaritem3.$$.fragment);
			t11 = space();
			create_component(sidebaritem4.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t0 = claim_text(div0_nodes, "Ядро");
			div0_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			claim_component(sidebaritem0.$$.fragment, nodes);
			t2 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			t3 = claim_text(div1_nodes, "Интерфейс");
			div1_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			claim_component(sidebaritem1.$$.fragment, nodes);
			t5 = claim_space(nodes);
			claim_component(collapse0.$$.fragment, nodes);
			t6 = claim_space(nodes);
			claim_component(sidebaritem2.$$.fragment, nodes);
			t7 = claim_space(nodes);
			claim_component(collapse1.$$.fragment, nodes);
			t8 = claim_space(nodes);
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			t9 = claim_text(div2_nodes, "Аддоны и примеси");
			div2_nodes.forEach(detach_dev);
			t10 = claim_space(nodes);
			claim_component(sidebaritem3.$$.fragment, nodes);
			t11 = claim_space(nodes);
			claim_component(sidebaritem4.$$.fragment, nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "l-proton-sidenav-menu-heading");
			add_location(div0, file$j, 52, 8, 1449);
			attr_dev(div1, "class", "l-proton-sidenav-menu-heading");
			add_location(div1, file$j, 63, 8, 1828);
			attr_dev(div2, "class", "l-proton-sidenav-menu-heading");
			add_location(div2, file$j, 161, 8, 5964);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			append_dev(div0, t0);
			insert_dev(target, t1, anchor);
			mount_component(sidebaritem0, target, anchor);
			insert_dev(target, t2, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, t3);
			insert_dev(target, t4, anchor);
			mount_component(sidebaritem1, target, anchor);
			insert_dev(target, t5, anchor);
			mount_component(collapse0, target, anchor);
			insert_dev(target, t6, anchor);
			mount_component(sidebaritem2, target, anchor);
			insert_dev(target, t7, anchor);
			mount_component(collapse1, target, anchor);
			insert_dev(target, t8, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, t9);
			insert_dev(target, t10, anchor);
			mount_component(sidebaritem3, target, anchor);
			insert_dev(target, t11, anchor);
			mount_component(sidebaritem4, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const sidebaritem0_changes = {};

			if (dirty & /*segment*/ 2) sidebaritem0_changes.class = /*segment*/ ctx[1] === "." || /*segment*/ ctx[1] === undefined
			? "active"
			: "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem0_changes.$$scope = { dirty, ctx };
			}

			sidebaritem0.$set(sidebaritem0_changes);
			const sidebaritem1_changes = {};
			if (dirty & /*isLayoutOpen*/ 4) sidebaritem1_changes.class = !/*isLayoutOpen*/ ctx[2] ? "collapsed" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem1_changes.$$scope = { dirty, ctx };
			}

			sidebaritem1.$set(sidebaritem1_changes);
			const collapse0_changes = {};
			if (dirty & /*isLayoutOpen*/ 4) collapse0_changes.isOpen = /*isLayoutOpen*/ ctx[2];

			if (dirty & /*$$scope, segment, activeLink, theme*/ 1048643) {
				collapse0_changes.$$scope = { dirty, ctx };
			}

			collapse0.$set(collapse0_changes);
			const sidebaritem2_changes = {};
			if (dirty & /*isPageOpen*/ 8) sidebaritem2_changes.class = !/*isPageOpen*/ ctx[3] ? "collapsed" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem2_changes.$$scope = { dirty, ctx };
			}

			sidebaritem2.$set(sidebaritem2_changes);
			const collapse1_changes = {};
			if (dirty & /*isPageOpen*/ 8) collapse1_changes.isOpen = /*isPageOpen*/ ctx[3];

			if (dirty & /*$$scope, isErrorOpen, isAuthenticationOpen*/ 1048624) {
				collapse1_changes.$$scope = { dirty, ctx };
			}

			collapse1.$set(collapse1_changes);
			const sidebaritem3_changes = {};
			if (dirty & /*segment*/ 2) sidebaritem3_changes.class = /*segment*/ ctx[1] === "charts" ? "active" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem3_changes.$$scope = { dirty, ctx };
			}

			sidebaritem3.$set(sidebaritem3_changes);
			const sidebaritem4_changes = {};
			if (dirty & /*segment*/ 2) sidebaritem4_changes.class = /*segment*/ ctx[1] === "tables" ? "active" : "";

			if (dirty & /*$$scope*/ 1048576) {
				sidebaritem4_changes.$$scope = { dirty, ctx };
			}

			sidebaritem4.$set(sidebaritem4_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(sidebaritem0.$$.fragment, local);
			transition_in(sidebaritem1.$$.fragment, local);
			transition_in(collapse0.$$.fragment, local);
			transition_in(sidebaritem2.$$.fragment, local);
			transition_in(collapse1.$$.fragment, local);
			transition_in(sidebaritem3.$$.fragment, local);
			transition_in(sidebaritem4.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sidebaritem0.$$.fragment, local);
			transition_out(sidebaritem1.$$.fragment, local);
			transition_out(collapse0.$$.fragment, local);
			transition_out(sidebaritem2.$$.fragment, local);
			transition_out(collapse1.$$.fragment, local);
			transition_out(sidebaritem3.$$.fragment, local);
			transition_out(sidebaritem4.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t1);
			destroy_component(sidebaritem0, detaching);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div1);
			if (detaching) detach_dev(t4);
			destroy_component(sidebaritem1, detaching);
			if (detaching) detach_dev(t5);
			destroy_component(collapse0, detaching);
			if (detaching) detach_dev(t6);
			destroy_component(sidebaritem2, detaching);
			if (detaching) detach_dev(t7);
			destroy_component(collapse1, detaching);
			if (detaching) detach_dev(t8);
			if (detaching) detach_dev(div2);
			if (detaching) detach_dev(t10);
			destroy_component(sidebaritem3, detaching);
			if (detaching) detach_dev(t11);
			destroy_component(sidebaritem4, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$1.name,
		type: "slot",
		source: "(52:6) <Nav>",
		ctx
	});

	return block;
}

// (48:2) <Nav      class="l-proton-sidenav {sidenav_theme} accordion l-proton-nav-fixed"      id="sidenavAccordion">
function create_default_slot$3(ctx) {
	let div0;
	let t0;
	let div2;
	let div1;
	let t1;
	let t2;
	let t3;
	let current;

	const nav = new Nav({
			props: {
				$$slots: { default: [create_default_slot_1$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div0 = element("div");
			create_component(nav.$$.fragment);
			t0 = space();
			div2 = element("div");
			div1 = element("div");
			t1 = text(/*footerText*/ ctx[9]);
			t2 = space();
			t3 = text(/*footerName*/ ctx[8]);
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			claim_component(nav.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			t1 = claim_text(div1_nodes, /*footerText*/ ctx[9]);
			div1_nodes.forEach(detach_dev);
			t2 = claim_space(div2_nodes);
			t3 = claim_text(div2_nodes, /*footerName*/ ctx[8]);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div0, "class", "l-proton-sidenav-menu");
			add_location(div0, file$j, 50, 4, 1391);
			attr_dev(div1, "class", "small");
			add_location(div1, file$j, 185, 6, 6709);
			attr_dev(div2, "class", "l-proton-sidenav-footer");
			add_location(div2, file$j, 184, 4, 6664);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			mount_component(nav, div0, null);
			insert_dev(target, t0, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, t1);
			append_dev(div2, t2);
			append_dev(div2, t3);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nav_changes = {};

			if (dirty & /*$$scope, segment, theme, isPageOpen, isErrorOpen, isAuthenticationOpen, isLayoutOpen, activeLink*/ 1048703) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_component(nav);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(48:2) <Nav      class=\\\"l-proton-sidenav {sidenav_theme} accordion l-proton-nav-fixed\\\"      id=\\\"sidenavAccordion\\\">",
		ctx
	});

	return block;
}

function create_fragment$k(ctx) {
	let div;
	let current;

	const nav = new Nav({
			props: {
				class: "l-proton-sidenav " + /*sidenav_theme*/ ctx[7] + " accordion l-proton-nav-fixed",
				id: "sidenavAccordion",
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(nav.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { id: true, class: true });
			var div_nodes = children(div);
			claim_component(nav.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "id", "layoutSidenav_nav");
			attr_dev(div, "class", "l-proton-nav-fixed");
			add_location(div, file$j, 46, 0, 1219);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(nav, div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const nav_changes = {};
			if (dirty & /*sidenav_theme*/ 128) nav_changes.class = "l-proton-sidenav " + /*sidenav_theme*/ ctx[7] + " accordion l-proton-nav-fixed";

			if (dirty & /*$$scope, segment, theme, isPageOpen, isErrorOpen, isAuthenticationOpen, isLayoutOpen, activeLink*/ 1048703) {
				nav_changes.$$scope = { dirty, ctx };
			}

			nav.$set(nav_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nav.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nav.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(nav);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let { segment } = $$props;
	let { theme } = $$props;
	let isLayoutOpen = true;
	let isPageOpen = true;
	let isAuthenticationOpen = true;
	let isErrorOpen = false;
	let activeLink = "Панель";
	let footerName = "λproton boy";
	let footerText = "Вы вошли как:";
	const updateActiveLink = linkName => $$invalidate(6, activeLink = linkName);

	const toggleLayout = () => {
		$$invalidate(2, isLayoutOpen = !isLayoutOpen);
		if (isPageOpen === true) $$invalidate(3, isPageOpen = false);
	};

	const togglePages = () => {
		$$invalidate(3, isPageOpen = !isPageOpen);
		if (isLayoutOpen === true) $$invalidate(2, isLayoutOpen = false);

		if (isPageOpen === false) {
			$$invalidate(4, isAuthenticationOpen = false);
			$$invalidate(5, isErrorOpen = false);
		}
	};

	const toggleAuthentication = () => {
		$$invalidate(4, isAuthenticationOpen = !isAuthenticationOpen);
		if (isErrorOpen === true) $$invalidate(5, isErrorOpen = false);
	};

	const toggleError = () => {
		$$invalidate(5, isErrorOpen = !isErrorOpen);
		if (isAuthenticationOpen === true) $$invalidate(4, isAuthenticationOpen = false);
	};

	const writable_props = ["segment", "theme"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
	});

	const press_handler = () => {
		$$invalidate(0, theme = "dark");
	};

	const press_handler_1 = () => {
		$$invalidate(0, theme = "dark");
		updateActiveLink("Static Navigation");
	};

	const press_handler_2 = () => {
		$$invalidate(0, theme = "light");
		updateActiveLink("Light Sidenav");
	};

	const press_handler_3 = () => {
		$$invalidate(0, theme = "dark");
	};

	const press_handler_4 = () => {
		$$invalidate(0, theme = "dark");
	};

	$$self.$set = $$props => {
		if ("segment" in $$props) $$invalidate(1, segment = $$props.segment);
		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
	};

	$$self.$capture_state = () => {
		return {
			segment,
			theme,
			isLayoutOpen,
			isPageOpen,
			isAuthenticationOpen,
			isErrorOpen,
			activeLink,
			footerName,
			footerText,
			sidenav_theme
		};
	};

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(1, segment = $$props.segment);
		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
		if ("isLayoutOpen" in $$props) $$invalidate(2, isLayoutOpen = $$props.isLayoutOpen);
		if ("isPageOpen" in $$props) $$invalidate(3, isPageOpen = $$props.isPageOpen);
		if ("isAuthenticationOpen" in $$props) $$invalidate(4, isAuthenticationOpen = $$props.isAuthenticationOpen);
		if ("isErrorOpen" in $$props) $$invalidate(5, isErrorOpen = $$props.isErrorOpen);
		if ("activeLink" in $$props) $$invalidate(6, activeLink = $$props.activeLink);
		if ("footerName" in $$props) $$invalidate(8, footerName = $$props.footerName);
		if ("footerText" in $$props) $$invalidate(9, footerText = $$props.footerText);
		if ("sidenav_theme" in $$props) $$invalidate(7, sidenav_theme = $$props.sidenav_theme);
	};

	let sidenav_theme;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*theme*/ 1) {
			 $$invalidate(7, sidenav_theme = `l-proton-sidenav-${theme}`);
		}
	};

	return [
		theme,
		segment,
		isLayoutOpen,
		isPageOpen,
		isAuthenticationOpen,
		isErrorOpen,
		activeLink,
		sidenav_theme,
		footerName,
		footerText,
		updateActiveLink,
		toggleLayout,
		togglePages,
		toggleAuthentication,
		toggleError,
		press_handler,
		press_handler_1,
		press_handler_2,
		press_handler_3,
		press_handler_4
	];
}

class Sidebar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$k, create_fragment$k, safe_not_equal, { segment: 1, theme: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Sidebar",
			options,
			id: create_fragment$k.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[1] === undefined && !("segment" in props)) {
			console.warn("<Sidebar> was created without expected prop 'segment'");
		}

		if (/*theme*/ ctx[0] === undefined && !("theme" in props)) {
			console.warn("<Sidebar> was created without expected prop 'theme'");
		}
	}

	get segment() {
		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get theme() {
		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set theme(value) {
		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\components\Footer.svelte generated by Svelte v3.18.1 */
const file$k = "src\\components\\Footer.svelte";

// (6:2) <Container fluid={true}>
function create_default_slot$4(ctx) {
	let div2;
	let div0;
	let t0;
	let a0;
	let t1;
	let t2;
	let div1;
	let a1;
	let t3;
	let t4;
	let a2;
	let t5;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			t0 = text("Создано при помощи Г.Э.C.К\r\n        ");
			a0 = element("a");
			t1 = text("thinkjazz");
			t2 = space();
			div1 = element("div");
			a1 = element("a");
			t3 = text("Privacy Policy");
			t4 = text("\r\n        ·\r\n        ");
			a2 = element("a");
			t5 = text("Terms & Conditions");
			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t0 = claim_text(div0_nodes, "Создано при помощи Г.Э.C.К\r\n        ");
			a0 = claim_element(div0_nodes, "A", { href: true });
			var a0_nodes = children(a0);
			t1 = claim_text(a0_nodes, "thinkjazz");
			a0_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t2 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", {});
			var div1_nodes = children(div1);
			a1 = claim_element(div1_nodes, "A", { href: true });
			var a1_nodes = children(a1);
			t3 = claim_text(a1_nodes, "Privacy Policy");
			a1_nodes.forEach(detach_dev);
			t4 = claim_text(div1_nodes, "\r\n        ·\r\n        ");
			a2 = claim_element(div1_nodes, "A", { href: true });
			var a2_nodes = children(a2);
			t5 = claim_text(a2_nodes, "Terms & Conditions");
			a2_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(a0, "href", "https://github.com/thinkjazz");
			add_location(a0, file$k, 9, 8, 302);
			attr_dev(div0, "class", "text-muted");
			add_location(div0, file$k, 7, 6, 232);
			attr_dev(a1, "href", "#");
			add_location(a1, file$k, 12, 8, 391);
			attr_dev(a2, "href", "#");
			add_location(a2, file$k, 14, 8, 449);
			add_location(div1, file$k, 11, 6, 376);
			attr_dev(div2, "class", "d-flex align-items-center justify-content-between small");
			add_location(div2, file$k, 6, 4, 155);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, t0);
			append_dev(div0, a0);
			append_dev(a0, t1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, a1);
			append_dev(a1, t3);
			append_dev(div1, t4);
			append_dev(div1, a2);
			append_dev(a2, t5);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$4.name,
		type: "slot",
		source: "(6:2) <Container fluid={true}>",
		ctx
	});

	return block;
}

function create_fragment$l(ctx) {
	let footer;
	let current;

	const container = new Container({
			props: {
				fluid: true,
				$$slots: { default: [create_default_slot$4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			footer = element("footer");
			create_component(container.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			footer = claim_element(nodes, "FOOTER", { class: true });
			var footer_nodes = children(footer);
			claim_component(container.$$.fragment, footer_nodes);
			footer_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(footer, "class", "py-4 bg-dark mt-auto");
			add_location(footer, file$k, 4, 0, 84);
		},
		m: function mount(target, anchor) {
			insert_dev(target, footer, anchor);
			mount_component(container, footer, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const container_changes = {};

			if (dirty & /*$$scope*/ 1) {
				container_changes.$$scope = { dirty, ctx };
			}

			container.$set(container_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(container.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(container.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(footer);
			destroy_component(container);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment$l, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$l.name
		});
	}
}

/* src\routes\_layout.svelte generated by Svelte v3.18.1 */
const file$l = "src\\routes\\_layout.svelte";

// (34:0) {:else}
function create_else_block$5(ctx) {
	let body;
	let current;
	const default_slot_template = /*$$slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

	const block = {
		c: function create() {
			body = element("body");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			body = claim_element(nodes, "BODY", {});
			var body_nodes = children(body);
			if (default_slot) default_slot.l(body_nodes);
			body_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(body, file$l, 34, 2, 799);
		},
		m: function mount(target, anchor) {
			insert_dev(target, body, anchor);

			if (default_slot) {
				default_slot.m(body, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(body);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$5.name,
		type: "else",
		source: "(34:0) {:else}",
		ctx
	});

	return block;
}

// (19:0) {#if segment !== 'pages'}
function create_if_block$8(ctx) {
	let div2;
	let t0;
	let div1;
	let t1;
	let div0;
	let main;
	let t2;
	let current;

	const navbar = new Navbar_1({
			props: {
				segment: /*segment*/ ctx[0],
				color: /*color*/ ctx[2],
				title: /*title*/ ctx[3]
			},
			$$inline: true
		});

	const sidebar = new Sidebar({
			props: {
				segment: /*segment*/ ctx[0],
				theme: /*theme*/ ctx[1]
			},
			$$inline: true
		});

	const container = new Container({
			props: {
				fluid: true,
				$$slots: { default: [create_default_slot$5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const footer = new Footer({ $$inline: true });

	const block = {
		c: function create() {
			div2 = element("div");
			create_component(navbar.$$.fragment);
			t0 = space();
			div1 = element("div");
			create_component(sidebar.$$.fragment);
			t1 = space();
			div0 = element("div");
			main = element("main");
			create_component(container.$$.fragment);
			t2 = space();
			create_component(footer.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			claim_component(navbar.$$.fragment, div2_nodes);
			t0 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { id: true });
			var div1_nodes = children(div1);
			claim_component(sidebar.$$.fragment, div1_nodes);
			t1 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { id: true });
			var div0_nodes = children(div0);
			main = claim_element(div0_nodes, "MAIN", {});
			var main_nodes = children(main);
			claim_component(container.$$.fragment, main_nodes);
			main_nodes.forEach(detach_dev);
			t2 = claim_space(div0_nodes);
			claim_component(footer.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(main, file$l, 24, 8, 625);
			attr_dev(div0, "id", "layoutSidenav_content");
			add_location(div0, file$l, 23, 6, 583);
			attr_dev(div1, "id", "layoutSidenav");
			add_location(div1, file$l, 21, 4, 514);
			attr_dev(div2, "class", "l-proton-nav-static");
			add_location(div2, file$l, 19, 2, 433);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			mount_component(navbar, div2, null);
			append_dev(div2, t0);
			append_dev(div2, div1);
			mount_component(sidebar, div1, null);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div0, main);
			mount_component(container, main, null);
			append_dev(div0, t2);
			mount_component(footer, div0, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const navbar_changes = {};
			if (dirty & /*segment*/ 1) navbar_changes.segment = /*segment*/ ctx[0];
			navbar.$set(navbar_changes);
			const sidebar_changes = {};
			if (dirty & /*segment*/ 1) sidebar_changes.segment = /*segment*/ ctx[0];
			sidebar.$set(sidebar_changes);
			const container_changes = {};

			if (dirty & /*$$scope*/ 32) {
				container_changes.$$scope = { dirty, ctx };
			}

			container.$set(container_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(navbar.$$.fragment, local);
			transition_in(sidebar.$$.fragment, local);
			transition_in(container.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(navbar.$$.fragment, local);
			transition_out(sidebar.$$.fragment, local);
			transition_out(container.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(navbar);
			destroy_component(sidebar);
			destroy_component(container);
			destroy_component(footer);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(19:0) {#if segment !== 'pages'}",
		ctx
	});

	return block;
}

// (26:10) <Container fluid={true}>
function create_default_slot$5(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[4].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32) {
				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$5.name,
		type: "slot",
		source: "(26:10) <Container fluid={true}>",
		ctx
	});

	return block;
}

function create_fragment$m(ctx) {
	let title_value;
	let t;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	document.title = title_value = /*title*/ ctx[3];
	const if_block_creators = [create_if_block$8, create_else_block$5];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*segment*/ ctx[0] !== "pages") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			t = space();
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-qazgrf\"]", document.head);
			head_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*title*/ 8) && title_value !== (title_value = /*title*/ ctx[3])) {
				document.title = title_value;
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let { segment } = $$props;
	let theme = "dark";
	let color = "dark";
	let title = "proton";
	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { segment, theme, color, title };
	};

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
		if ("theme" in $$props) $$invalidate(1, theme = $$props.theme);
		if ("color" in $$props) $$invalidate(2, color = $$props.color);
		if ("title" in $$props) $$invalidate(3, title = $$props.title);
	};

	return [segment, theme, color, title, $$slots, $$scope];
}

class Layout extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$l, create_fragment$m, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Layout",
			options,
			id: create_fragment$m.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Layout> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\routes\_error.svelte generated by Svelte v3.18.1 */

const { Error: Error_1$2 } = globals;
const file$m = "src\\routes\\_error.svelte";

// (38:0) {#if dev && error.stack}
function create_if_block$9(ctx) {
	let pre;
	let t_value = /*error*/ ctx[1].stack + "";
	let t;

	const block = {
		c: function create() {
			pre = element("pre");
			t = text(t_value);
			this.h();
		},
		l: function claim(nodes) {
			pre = claim_element(nodes, "PRE", {});
			var pre_nodes = children(pre);
			t = claim_text(pre_nodes, t_value);
			pre_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(pre, file$m, 38, 1, 481);
		},
		m: function mount(target, anchor) {
			insert_dev(target, pre, anchor);
			append_dev(pre, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 2 && t_value !== (t_value = /*error*/ ctx[1].stack + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(pre);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(38:0) {#if dev && error.stack}",
		ctx
	});

	return block;
}

function create_fragment$n(ctx) {
	let title_value;
	let t0;
	let h1;
	let t1;
	let t2;
	let p;
	let t3_value = /*error*/ ctx[1].message + "";
	let t3;
	let t4;
	let if_block_anchor;
	document.title = title_value = /*status*/ ctx[0];
	let if_block = /*dev*/ ctx[2] && /*error*/ ctx[1].stack && create_if_block$9(ctx);

	const block = {
		c: function create() {
			t0 = space();
			h1 = element("h1");
			t1 = text(/*status*/ ctx[0]);
			t2 = space();
			p = element("p");
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-kr470y\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, /*status*/ ctx[0]);
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			p = claim_element(nodes, "P", { class: true });
			var p_nodes = children(p);
			t3 = claim_text(p_nodes, t3_value);
			p_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
			this.h();
		},
		h: function hydrate() {
			attr_dev(h1, "class", "svelte-13vgy2g");
			add_location(h1, file$m, 33, 0, 407);
			attr_dev(p, "class", "svelte-13vgy2g");
			add_location(p, file$m, 35, 0, 428);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			append_dev(h1, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, p, anchor);
			append_dev(p, t3);
			insert_dev(target, t4, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*status*/ 1 && title_value !== (title_value = /*status*/ ctx[0])) {
				document.title = title_value;
			}

			if (dirty & /*status*/ 1) set_data_dev(t1, /*status*/ ctx[0]);
			if (dirty & /*error*/ 2 && t3_value !== (t3_value = /*error*/ ctx[1].message + "")) set_data_dev(t3, t3_value);

			if (/*dev*/ ctx[2] && /*error*/ ctx[1].stack) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$9(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(p);
			if (detaching) detach_dev(t4);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	let { status } = $$props;
	let { error } = $$props;
	const dev = "development" === "development";
	const writable_props = ["status", "error"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("status" in $$props) $$invalidate(0, status = $$props.status);
		if ("error" in $$props) $$invalidate(1, error = $$props.error);
	};

	$$self.$capture_state = () => {
		return { status, error };
	};

	$$self.$inject_state = $$props => {
		if ("status" in $$props) $$invalidate(0, status = $$props.status);
		if ("error" in $$props) $$invalidate(1, error = $$props.error);
	};

	return [status, error, dev];
}

class Error$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$m, create_fragment$n, safe_not_equal, { status: 0, error: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Error",
			options,
			id: create_fragment$n.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*status*/ ctx[0] === undefined && !("status" in props)) {
			console.warn("<Error> was created without expected prop 'status'");
		}

		if (/*error*/ ctx[1] === undefined && !("error" in props)) {
			console.warn("<Error> was created without expected prop 'error'");
		}
	}

	get status() {
		throw new Error_1$2("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set status(value) {
		throw new Error_1$2("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get error() {
		throw new Error_1$2("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set error(value) {
		throw new Error_1$2("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\node_modules\@sapper\internal\App.svelte generated by Svelte v3.18.1 */

const { Error: Error_1$3 } = globals;

// (23:1) {:else}
function create_else_block$6(ctx) {
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [{ segment: /*segments*/ ctx[2][1] }, /*level1*/ ctx[4].props];
	var switch_value = /*level1*/ ctx[4].component;

	function switch_props(ctx) {
		let switch_instance_props = {
			$$slots: { default: [create_default_slot_1$2] },
			$$scope: { ctx }
		};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*segments, level1*/ 20)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*segments*/ 4 && { segment: /*segments*/ ctx[2][1] },
					dirty & /*level1*/ 16 && get_spread_object(/*level1*/ ctx[4].props)
				])
			: {};

			if (dirty & /*$$scope, level2, segments, level3*/ 356) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (switch_value !== (switch_value = /*level1*/ ctx[4].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$6.name,
		type: "else",
		source: "(23:1) {:else}",
		ctx
	});

	return block;
}

// (21:1) {#if error}
function create_if_block$a(ctx) {
	let current;

	const error_1 = new Error$1({
			props: {
				error: /*error*/ ctx[0],
				status: /*status*/ ctx[1]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(error_1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(error_1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(error_1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const error_1_changes = {};
			if (dirty & /*error*/ 1) error_1_changes.error = /*error*/ ctx[0];
			if (dirty & /*status*/ 2) error_1_changes.status = /*status*/ ctx[1];
			error_1.$set(error_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(error_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(21:1) {#if error}",
		ctx
	});

	return block;
}

// (25:3) {#if level2}
function create_if_block_1$6(ctx) {
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [{ segment: /*segments*/ ctx[2][2] }, /*level2*/ ctx[5].props];
	var switch_value = /*level2*/ ctx[5].component;

	function switch_props(ctx) {
		let switch_instance_props = {
			$$slots: { default: [create_default_slot_2$2] },
			$$scope: { ctx }
		};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*segments, level2*/ 36)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*segments*/ 4 && { segment: /*segments*/ ctx[2][2] },
					dirty & /*level2*/ 32 && get_spread_object(/*level2*/ ctx[5].props)
				])
			: {};

			if (dirty & /*$$scope, level3*/ 320) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (switch_value !== (switch_value = /*level2*/ ctx[5].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$6.name,
		type: "if",
		source: "(25:3) {#if level2}",
		ctx
	});

	return block;
}

// (27:5) {#if level3}
function create_if_block_2$4(ctx) {
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*level3*/ ctx[6].props];
	var switch_value = /*level3*/ ctx[6].component;

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*level3*/ 64)
			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*level3*/ ctx[6].props)])
			: {};

			if (switch_value !== (switch_value = /*level3*/ ctx[6].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$4.name,
		type: "if",
		source: "(27:5) {#if level3}",
		ctx
	});

	return block;
}

// (26:4) <svelte:component this="{level2.component}" segment="{segments[2]}" {...level2.props}>
function create_default_slot_2$2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*level3*/ ctx[6] && create_if_block_2$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*level3*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_2$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2$2.name,
		type: "slot",
		source: "(26:4) <svelte:component this=\\\"{level2.component}\\\" segment=\\\"{segments[2]}\\\" {...level2.props}>",
		ctx
	});

	return block;
}

// (24:2) <svelte:component this="{level1.component}" segment="{segments[1]}" {...level1.props}>
function create_default_slot_1$2(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*level2*/ ctx[5] && create_if_block_1$6(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*level2*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block_1$6(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$2.name,
		type: "slot",
		source: "(24:2) <svelte:component this=\\\"{level1.component}\\\" segment=\\\"{segments[1]}\\\" {...level1.props}>",
		ctx
	});

	return block;
}

// (20:0) <Layout segment="{segments[0]}" {...level0.props}>
function create_default_slot$6(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$a, create_else_block$6];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*error*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$6.name,
		type: "slot",
		source: "(20:0) <Layout segment=\\\"{segments[0]}\\\" {...level0.props}>",
		ctx
	});

	return block;
}

function create_fragment$o(ctx) {
	let current;
	const layout_spread_levels = [{ segment: /*segments*/ ctx[2][0] }, /*level0*/ ctx[3].props];

	let layout_props = {
		$$slots: { default: [create_default_slot$6] },
		$$scope: { ctx }
	};

	for (let i = 0; i < layout_spread_levels.length; i += 1) {
		layout_props = assign(layout_props, layout_spread_levels[i]);
	}

	const layout = new Layout({ props: layout_props, $$inline: true });

	const block = {
		c: function create() {
			create_component(layout.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(layout.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(layout, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const layout_changes = (dirty & /*segments, level0*/ 12)
			? get_spread_update(layout_spread_levels, [
					dirty & /*segments*/ 4 && { segment: /*segments*/ ctx[2][0] },
					dirty & /*level0*/ 8 && get_spread_object(/*level0*/ ctx[3].props)
				])
			: {};

			if (dirty & /*$$scope, error, status, level1, segments, level2, level3*/ 375) {
				layout_changes.$$scope = { dirty, ctx };
			}

			layout.$set(layout_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(layout.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(layout.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(layout, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { level2 = null } = $$props;
	let { level3 = null } = $$props;
	setContext(CONTEXT_KEY, stores);

	const writable_props = [
		"stores",
		"error",
		"status",
		"segments",
		"level0",
		"level1",
		"level2",
		"level3"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ("stores" in $$props) $$invalidate(7, stores = $$props.stores);
		if ("error" in $$props) $$invalidate(0, error = $$props.error);
		if ("status" in $$props) $$invalidate(1, status = $$props.status);
		if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
		if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
		if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
		if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
		if ("level3" in $$props) $$invalidate(6, level3 = $$props.level3);
	};

	$$self.$capture_state = () => {
		return {
			stores,
			error,
			status,
			segments,
			level0,
			level1,
			level2,
			level3
		};
	};

	$$self.$inject_state = $$props => {
		if ("stores" in $$props) $$invalidate(7, stores = $$props.stores);
		if ("error" in $$props) $$invalidate(0, error = $$props.error);
		if ("status" in $$props) $$invalidate(1, status = $$props.status);
		if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
		if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
		if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
		if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
		if ("level3" in $$props) $$invalidate(6, level3 = $$props.level3);
	};

	return [error, status, segments, level0, level1, level2, level3, stores];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$n, create_fragment$o, safe_not_equal, {
			stores: 7,
			error: 0,
			status: 1,
			segments: 2,
			level0: 3,
			level1: 4,
			level2: 5,
			level3: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$o.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*stores*/ ctx[7] === undefined && !("stores" in props)) {
			console.warn("<App> was created without expected prop 'stores'");
		}

		if (/*error*/ ctx[0] === undefined && !("error" in props)) {
			console.warn("<App> was created without expected prop 'error'");
		}

		if (/*status*/ ctx[1] === undefined && !("status" in props)) {
			console.warn("<App> was created without expected prop 'status'");
		}

		if (/*segments*/ ctx[2] === undefined && !("segments" in props)) {
			console.warn("<App> was created without expected prop 'segments'");
		}

		if (/*level0*/ ctx[3] === undefined && !("level0" in props)) {
			console.warn("<App> was created without expected prop 'level0'");
		}
	}

	get stores() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stores(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get error() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set error(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get status() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set status(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get segments() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segments(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level0() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level0(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level1() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level1(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level2() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level2(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level3() {
		throw new Error_1$3("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level3(value) {
		throw new Error_1$3("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// This file is generated by Sapper — do not edit it!

const ignore = [/^\/blog.json$/, /^\/blog\/([^\/]+?).json$/];

const components = [
	{
		js: () => import('./index.1e36c4dd.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:index.svelte__"
	},
	{
		js: () => import('./activity_log.ecc429c4.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:activity_log.svelte__"
	},
	{
		js: () => import('./settings.aeadd31b.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:settings.svelte__"
	},
	{
		js: () => import('./static_navigation.a72ee235.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:layouts/static_navigation.svelte__"
	},
	{
		js: () => import('./light_sidenav.e5a84c44.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:layouts/light_sidenav.svelte__"
	},
	{
		js: () => import('./charts.516dcb27.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:charts.svelte__"
	},
	{
		js: () => import('./tables.7518b8b0.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:tables.svelte__"
	},
	{
		js: () => import('./_layout.c739a681.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/_layout.svelte__"
	},
	{
		js: () => import('./_layout.9cc93d5a.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/authentication/_layout.svelte__"
	},
	{
		js: () => import('./forget_password.d9d90dba.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/authentication/forget_password.svelte__"
	},
	{
		js: () => import('./register.67786490.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/authentication/register.svelte__"
	},
	{
		js: () => import('./login.0d2795fa.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/authentication/login.svelte__"
	},
	{
		js: () => import('./_layout.d29e8a56.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/error/_layout.svelte__"
	},
	{
		js: () => import('./error_401.e5ce9a0f.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/error/error_401.svelte__"
	},
	{
		js: () => import('./error_404.b56e3263.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/error/error_404.svelte__"
	},
	{
		js: () => import('./error_500.15ffcdb2.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:pages/error/error_500.svelte__"
	},
	{
		js: () => import('./index.10e884a9.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:blog/index.svelte__"
	},
	{
		js: () => import('./[slug].be2b65b7.js'),
		css: "__SAPPER_CSS_PLACEHOLDER:blog/[slug].svelte__"
	}
];

const routes = (d => [
	{
		// index.svelte
		pattern: /^\/$/,
		parts: [
			{ i: 0 }
		]
	},

	{
		// activity_log.svelte
		pattern: /^\/activity_log\/?$/,
		parts: [
			{ i: 1 }
		]
	},

	{
		// settings.svelte
		pattern: /^\/settings\/?$/,
		parts: [
			{ i: 2 }
		]
	},

	{
		// layouts/static_navigation.svelte
		pattern: /^\/layouts\/static_navigation\/?$/,
		parts: [
			null,
			{ i: 3 }
		]
	},

	{
		// layouts/light_sidenav.svelte
		pattern: /^\/layouts\/light_sidenav\/?$/,
		parts: [
			null,
			{ i: 4 }
		]
	},

	{
		// charts.svelte
		pattern: /^\/charts\/?$/,
		parts: [
			{ i: 5 }
		]
	},

	{
		// tables.svelte
		pattern: /^\/tables\/?$/,
		parts: [
			{ i: 6 }
		]
	},

	{
		// pages/authentication/forget_password.svelte
		pattern: /^\/pages\/authentication\/forget_password\/?$/,
		parts: [
			{ i: 7 },
			{ i: 8 },
			{ i: 9 }
		]
	},

	{
		// pages/authentication/register.svelte
		pattern: /^\/pages\/authentication\/register\/?$/,
		parts: [
			{ i: 7 },
			{ i: 8 },
			{ i: 10 }
		]
	},

	{
		// pages/authentication/login.svelte
		pattern: /^\/pages\/authentication\/login\/?$/,
		parts: [
			{ i: 7 },
			{ i: 8 },
			{ i: 11 }
		]
	},

	{
		// pages/error/error_401.svelte
		pattern: /^\/pages\/error\/error_401\/?$/,
		parts: [
			{ i: 7 },
			{ i: 12 },
			{ i: 13 }
		]
	},

	{
		// pages/error/error_404.svelte
		pattern: /^\/pages\/error\/error_404\/?$/,
		parts: [
			{ i: 7 },
			{ i: 12 },
			{ i: 14 }
		]
	},

	{
		// pages/error/error_500.svelte
		pattern: /^\/pages\/error\/error_500\/?$/,
		parts: [
			{ i: 7 },
			{ i: 12 },
			{ i: 15 }
		]
	},

	{
		// blog/index.svelte
		pattern: /^\/blog\/?$/,
		parts: [
			{ i: 16 }
		]
	},

	{
		// blog/[slug].svelte
		pattern: /^\/blog\/([^\/]+?)\/?$/,
		parts: [
			null,
			{ i: 17, params: match => ({ slug: d(match[1]) }) }
		]
	}
])(decodeURIComponent);

if (typeof window !== 'undefined') {
	import('./sapper-dev-client.89e34bae.js').then(client => {
		client.connect(10000);
	});
}

function goto(href, opts = { replaceState: false }) {
	const target = select_target(new URL(href, document.baseURI));

	if (target) {
		_history[opts.replaceState ? 'replaceState' : 'pushState']({ id: cid }, '', href);
		return navigate(target, null).then(() => {});
	}

	location.href = href;
	return new Promise(f => {}); // never resolves
}

const initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;

let ready = false;
let root_component;
let current_token;
let root_preloaded;
let current_branch = [];
let current_query = '{}';

const stores = {
	page: writable({}),
	preloading: writable(null),
	session: writable(initial_data && initial_data.session)
};

let $session;
let session_dirty;

stores.session.subscribe(async value => {
	$session = value;

	if (!ready) return;
	session_dirty = true;

	const target = select_target(new URL(location.href));

	const token = current_token = {};
	const { redirect, props, branch } = await hydrate_target(target);
	if (token !== current_token) return; // a secondary navigation happened while we were loading

	await render(redirect, branch, props, target.page);
});

let prefetching


 = null;
function set_prefetching(href, promise) {
	prefetching = { href, promise };
}

let target;
function set_target(element) {
	target = element;
}

let uid = 1;
function set_uid(n) {
	uid = n;
}

let cid;
function set_cid(n) {
	cid = n;
}

const _history = typeof history !== 'undefined' ? history : {
	pushState: (state, title, href) => {},
	replaceState: (state, title, href) => {},
	scrollRestoration: ''
};

const scroll_history = {};

function extract_query(search) {
	const query = Object.create(null);
	if (search.length > 0) {
		search.slice(1).split('&').forEach(searchParam => {
			let [, key, value = ''] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, ' ')));
			if (typeof query[key] === 'string') query[key] = [query[key]];
			if (typeof query[key] === 'object') (query[key] ).push(value);
			else query[key] = value;
		});
	}
	return query;
}

function select_target(url) {
	if (url.origin !== location.origin) return null;
	if (!url.pathname.startsWith(initial_data.baseUrl)) return null;

	let path = url.pathname.slice(initial_data.baseUrl.length);

	if (path === '') {
		path = '/';
	}

	// avoid accidental clashes between server routes and page routes
	if (ignore.some(pattern => pattern.test(path))) return;

	for (let i = 0; i < routes.length; i += 1) {
		const route = routes[i];

		const match = route.pattern.exec(path);

		if (match) {
			const query = extract_query(url.search);
			const part = route.parts[route.parts.length - 1];
			const params = part.params ? part.params(match) : {};

			const page = { host: location.host, path, query, params };

			return { href: url.href, route, match, page };
		}
	}
}

function handle_error(url) {
	const { host, pathname, search } = location;
	const { session, preloaded, status, error } = initial_data;

	if (!root_preloaded) {
		root_preloaded = preloaded && preloaded[0];
	}

	const props = {
		error,
		status,
		session,
		level0: {
			props: root_preloaded
		},
		level1: {
			props: {
				status,
				error
			},
			component: Error$1
		},
		segments: preloaded

	};
	const query = extract_query(search);
	render(null, [], props, { host, path: pathname, query, params: {} });
}

function scroll_state() {
	return {
		x: pageXOffset,
		y: pageYOffset
	};
}

async function navigate(target, id, noscroll, hash) {
	if (id) {
		// popstate or initial navigation
		cid = id;
	} else {
		const current_scroll = scroll_state();

		// clicked on a link. preserve scroll state
		scroll_history[cid] = current_scroll;

		id = cid = ++uid;
		scroll_history[cid] = noscroll ? current_scroll : { x: 0, y: 0 };
	}

	cid = id;

	if (root_component) stores.preloading.set(true);

	const loaded = prefetching && prefetching.href === target.href ?
		prefetching.promise :
		hydrate_target(target);

	prefetching = null;

	const token = current_token = {};
	const { redirect, props, branch } = await loaded;
	if (token !== current_token) return; // a secondary navigation happened while we were loading

	await render(redirect, branch, props, target.page);
	if (document.activeElement) document.activeElement.blur();

	if (!noscroll) {
		let scroll = scroll_history[id];

		if (hash) {
			// scroll is an element id (from a hash), we need to compute y.
			const deep_linked = document.getElementById(hash.slice(1));

			if (deep_linked) {
				scroll = {
					x: 0,
					y: deep_linked.getBoundingClientRect().top
				};
			}
		}

		scroll_history[cid] = scroll;
		if (scroll) scrollTo(scroll.x, scroll.y);
	}
}

async function render(redirect, branch, props, page) {
	if (redirect) return goto(redirect.location, { replaceState: true });

	stores.page.set(page);
	stores.preloading.set(false);

	if (root_component) {
		root_component.$set(props);
	} else {
		props.stores = {
			page: { subscribe: stores.page.subscribe },
			preloading: { subscribe: stores.preloading.subscribe },
			session: stores.session
		};
		props.level0 = {
			props: await root_preloaded
		};

		// first load — remove SSR'd <head> contents
		const start = document.querySelector('#sapper-head-start');
		const end = document.querySelector('#sapper-head-end');

		if (start && end) {
			while (start.nextSibling !== end) detach$1(start.nextSibling);
			detach$1(start);
			detach$1(end);
		}

		root_component = new App({
			target,
			props,
			hydrate: true
		});
	}

	current_branch = branch;
	current_query = JSON.stringify(page.query);
	ready = true;
	session_dirty = false;
}

function part_changed(i, segment, match, stringified_query) {
	// TODO only check query string changes for preload functions
	// that do in fact depend on it (using static analysis or
	// runtime instrumentation)
	if (stringified_query !== current_query) return true;

	const previous = current_branch[i];

	if (!previous) return false;
	if (segment !== previous.segment) return true;
	if (previous.match) {
		if (JSON.stringify(previous.match.slice(1, i + 2)) !== JSON.stringify(match.slice(1, i + 2))) {
			return true;
		}
	}
}

async function hydrate_target(target)



 {
	const { route, page } = target;
	const segments = page.path.split('/').filter(Boolean);

	let redirect = null;

	const props = { error: null, status: 200, segments: [segments[0]] };

	const preload_context = {
		fetch: (url, opts) => fetch(url, opts),
		redirect: (statusCode, location) => {
			if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
				throw new Error(`Conflicting redirects`);
			}
			redirect = { statusCode, location };
		},
		error: (status, error) => {
			props.error = typeof error === 'string' ? new Error(error) : error;
			props.status = status;
		}
	};

	if (!root_preloaded) {
		root_preloaded = initial_data.preloaded[0] || preload.call(preload_context, {
			host: page.host,
			path: page.path,
			query: page.query,
			params: {}
		}, $session);
	}

	let branch;
	let l = 1;

	try {
		const stringified_query = JSON.stringify(page.query);
		const match = route.pattern.exec(page.path);

		let segment_dirty = false;

		branch = await Promise.all(route.parts.map(async (part, i) => {
			const segment = segments[i];

			if (part_changed(i, segment, match, stringified_query)) segment_dirty = true;

			props.segments[l] = segments[i + 1]; // TODO make this less confusing
			if (!part) return { segment };

			const j = l++;

			if (!session_dirty && !segment_dirty && current_branch[i] && current_branch[i].part === part.i) {
				return current_branch[i];
			}

			segment_dirty = false;

			const { default: component, preload } = await load_component(components[part.i]);

			let preloaded;
			if (ready || !initial_data.preloaded[i + 1]) {
				preloaded = preload
					? await preload.call(preload_context, {
						host: page.host,
						path: page.path,
						query: page.query,
						params: part.params ? part.params(target.match) : {}
					}, $session)
					: {};
			} else {
				preloaded = initial_data.preloaded[i + 1];
			}

			return (props[`level${j}`] = { component, props: preloaded, segment, match, part: part.i });
		}));
	} catch (error) {
		props.error = error;
		props.status = 500;
		branch = [];
	}

	return { redirect, props, branch };
}

function load_css(chunk) {
	const href = `client/${chunk}`;
	if (document.querySelector(`link[href="${href}"]`)) return;

	return new Promise((fulfil, reject) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;

		link.onload = () => fulfil();
		link.onerror = reject;

		document.head.appendChild(link);
	});
}

function load_component(component)


 {
	// TODO this is temporary — once placeholders are
	// always rewritten, scratch the ternary
	const promises = (typeof component.css === 'string' ? [] : component.css.map(load_css));
	promises.unshift(component.js());
	return Promise.all(promises).then(values => values[0]);
}

function detach$1(node) {
	node.parentNode.removeChild(node);
}

function prefetch(href) {
	const target = select_target(new URL(href, document.baseURI));

	if (target) {
		if (!prefetching || href !== prefetching.href) {
			set_prefetching(href, hydrate_target(target));
		}

		return prefetching.promise;
	}
}

function start(opts

) {
	if ('scrollRestoration' in _history) {
		_history.scrollRestoration = 'manual';
	}

	set_target(opts.target);

	addEventListener('click', handle_click);
	addEventListener('popstate', handle_popstate);

	// prefetch
	addEventListener('touchstart', trigger_prefetch);
	addEventListener('mousemove', handle_mousemove);

	return Promise.resolve().then(() => {
		const { hash, href } = location;

		_history.replaceState({ id: uid }, '', href);

		const url = new URL(location.href);

		if (initial_data.error) return handle_error();

		const target = select_target(url);
		if (target) return navigate(target, uid, true, hash);
	});
}

let mousemove_timeout;

function handle_mousemove(event) {
	clearTimeout(mousemove_timeout);
	mousemove_timeout = setTimeout(() => {
		trigger_prefetch(event);
	}, 20);
}

function trigger_prefetch(event) {
	const a = find_anchor(event.target);
	if (!a || a.rel !== 'prefetch') return;

	prefetch(a.href);
}

function handle_click(event) {
	// Adapted from https://github.com/visionmedia/page.js
	// MIT license https://github.com/visionmedia/page.js#license
	if (which(event) !== 1) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey) return;
	if (event.defaultPrevented) return;

	const a = find_anchor(event.target);
	if (!a) return;

	if (!a.href) return;

	// check if link is inside an svg
	// in this case, both href and target are always inside an object
	const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
	const href = String(svg ? (a).href.baseVal : a.href);

	if (href === location.href) {
		if (!location.hash) event.preventDefault();
		return;
	}

	// Ignore if tag has
	// 1. 'download' attribute
	// 2. rel='external' attribute
	if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

	// Ignore if <a> has a target
	if (svg ? (a).target.baseVal : a.target) return;

	const url = new URL(href);

	// Don't handle hash changes
	if (url.pathname === location.pathname && url.search === location.search) return;

	const target = select_target(url);
	if (target) {
		const noscroll = a.hasAttribute('sapper-noscroll');
		navigate(target, null, noscroll, url.hash);
		event.preventDefault();
		_history.pushState({ id: cid }, '', url.href);
	}
}

function which(event) {
	return event.which === null ? event.button : event.which;
}

function find_anchor(node) {
	while (node && node.nodeName.toUpperCase() !== 'A') node = node.parentNode; // SVG <a> elements have a lowercase name
	return node;
}

function handle_popstate(event) {
	scroll_history[cid] = scroll_state();

	if (event.state) {
		const url = new URL(location.href);
		const target = select_target(url);
		if (target) {
			navigate(target, event.state.id);
		} else {
			location.href = location.href;
		}
	} else {
		// hashchange
		set_uid(uid + 1);
		set_cid(uid);
		_history.replaceState({ id: cid }, '', location.href);
	}
}

start({
	target: document.querySelector('#sapper')
});

export { set_data_dev as A, noop as B, listen_dev as C, bubble as D, empty as E, create_component as F, claim_component as G, mount_component as H, destroy_component as I, space as J, claim_space as K, query_selector_all as L, destroy_each as M, onMount as N, Form as O, Label as P, Input as Q, CustomInput as R, SvelteComponentDev as S, Button as T, set_style as U, svg_element as V, Container as W, Footer as X, isObject as Y, getColumnSizeClass as Z, assign as a, clsx as b, clean as c, dispatch_dev as d, exclude_internal_props as e, element as f, claim_element as g, children as h, init as i, detach_dev as j, attr_dev as k, add_location as l, set_attributes as m, insert_dev as n, append_dev as o, group_outros as p, check_outros as q, transition_in as r, safe_not_equal as s, transition_out as t, get_spread_update as u, create_slot as v, get_slot_context as w, get_slot_changes as x, text as y, claim_text as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmYwODU5YjI1LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY2xzeC9kaXN0L2Nsc3gubS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvdXRpbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NvbnRhaW5lci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL05hdmJhci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL05hdmJhckJyYW5kLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQnV0dG9uLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvTmF2LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvZWFzaW5nL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvdHJhbnNpdGlvbi9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Db250ZXh0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL1VuY29udHJvbGxlZERyb3Bkb3duLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Ub2dnbGUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bk1lbnUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9MaXN0R3JvdXAuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Gb3JtLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXRHcm91cC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0lucHV0R3JvdXBBZGRvbi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0xhYmVsLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9OYXZiYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU2lkZWJhckl0ZW0uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU2lkZWJhci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19sYXlvdXQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL0FwcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvbWFuaWZlc3QtY2xpZW50Lm1qcyIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9hcHAubWpzIiwiLi4vLi4vLi4vc3JjL2NsaWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcbiAgICBpZiAoc3RvcmUgIT0gbnVsbCAmJiB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIC4uLmNhbGxiYWNrcykge1xuICAgIGlmIChzdG9yZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub29wO1xuICAgIH1cbiAgICBjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZSguLi5jYWxsYmFja3MpO1xuICAgIHJldHVybiB1bnN1Yi51bnN1YnNjcmliZSA/ICgpID0+IHVuc3ViLnVuc3Vic2NyaWJlKCkgOiB1bnN1Yjtcbn1cbmZ1bmN0aW9uIGdldF9zdG9yZV92YWx1ZShzdG9yZSkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBzdWJzY3JpYmUoc3RvcmUsIF8gPT4gdmFsdWUgPSBfKSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbik7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICByZXR1cm4gZGVmaW5pdGlvblsxXSAmJiBmblxuICAgICAgICA/IGFzc2lnbigkJHNjb3BlLmN0eC5zbGljZSgpLCBkZWZpbml0aW9uWzFdKGZuKGN0eCkpKVxuICAgICAgICA6ICQkc2NvcGUuY3R4O1xufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvblsyXSAmJiBmbikge1xuICAgICAgICBjb25zdCBsZXRzID0gZGVmaW5pdGlvblsyXShmbihkaXJ0eSkpO1xuICAgICAgICBpZiAodHlwZW9mICQkc2NvcGUuZGlydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGgubWF4KCQkc2NvcGUuZGlydHkubGVuZ3RoLCBsZXRzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkW2ldID0gJCRzY29wZS5kaXJ0eVtpXSB8IGxldHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkJHNjb3BlLmRpcnR5IHwgbGV0cztcbiAgICB9XG4gICAgcmV0dXJuICQkc2NvcGUuZGlydHk7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUgPSByZXQpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBub2RlKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5mdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfZWFjaChpdGVyYXRpb25zLCBkZXRhY2hpbmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnNbaV0pXG4gICAgICAgICAgICBpdGVyYXRpb25zW2ldLmQoZGV0YWNoaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBlbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRfaXMobmFtZSwgaXMpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lLCB7IGlzIH0pO1xufVxuZnVuY3Rpb24gb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcyhvYmosIGV4Y2x1ZGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNfcHJvcChvYmosIGspXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAmJiBleGNsdWRlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuZnVuY3Rpb24gdGV4dChkYXRhKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuZnVuY3Rpb24gc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRleHQoJyAnKTtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiB0ZXh0KCcnKTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSlcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQpIHtcbiAgICAgICAgICAgIG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhKG5vZGUsIHByb3AsIHZhbHVlKSB7XG4gICAgaWYgKHByb3AgaW4gbm9kZSkge1xuICAgICAgICBub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCkge1xuICAgIGNvbnN0IHZhbHVlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLnB1c2goZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJycgPyB1bmRlZmluZWQgOiArdmFsdWU7XG59XG5mdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFycmF5LnB1c2goeyBzdGFydDogcmFuZ2VzLnN0YXJ0KGkpLCBlbmQ6IHJhbmdlcy5lbmQoaSkgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcywgc3ZnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmcgPyBzdmdfZWxlbWVudChuYW1lKSA6IGVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSAnJyArIGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0KGRhdGEpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwgfHwgaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBpZiAob3B0aW9uLl9fdmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IH52YWx1ZS5pbmRleE9mKG9wdGlvbi5fX3ZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykgfHwgc2VsZWN0Lm9wdGlvbnNbMF07XG4gICAgcmV0dXJuIHNlbGVjdGVkX29wdGlvbiAmJiBzZWxlY3RlZF9vcHRpb24uX192YWx1ZTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9tdWx0aXBsZV92YWx1ZShzZWxlY3QpIHtcbiAgICByZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIG9wdGlvbiA9PiBvcHRpb24uX192YWx1ZSk7XG59XG5mdW5jdGlvbiBhZGRfcmVzaXplX2xpc3RlbmVyKGVsZW1lbnQsIGZuKSB7XG4gICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBvYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgb2JqZWN0LnR5cGUgPSAndGV4dC9odG1sJztcbiAgICBvYmplY3QudGFiSW5kZXggPSAtMTtcbiAgICBsZXQgd2luO1xuICAgIG9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHdpbiA9IG9iamVjdC5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmbik7XG4gICAgfTtcbiAgICBpZiAoL1RyaWRlbnQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmplY3QpO1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICB3aW4gJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIgJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZuKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQob2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3RbdG9nZ2xlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG59XG5mdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgZGV0YWlsKTtcbiAgICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIHF1ZXJ5X3NlbGVjdG9yX2FsbChzZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihodG1sLCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZSA9IGVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICB9XG4gICAgbSh0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGluc2VydCh0YXJnZXQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgfVxuICAgIHUoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIHAoaHRtbCkge1xuICAgICAgICB0aGlzLmQoKTtcbiAgICAgICAgdGhpcy51KGh0bWwpO1xuICAgICAgICB0aGlzLm0odGhpcy50LCB0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxubGV0IHN0eWxlc2hlZXQ7XG5sZXQgYWN0aXZlID0gMDtcbmxldCBjdXJyZW50X3J1bGVzID0ge307XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgbGV0IGkgPSBzdHIubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBoYXNoID4+PiAwO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgaWYgKCFzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBzdHlsZS5zaGVldDtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50X3J1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogYGB9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpXG4gICAgICAgIC5zcGxpdCgnLCAnKVxuICAgICAgICAuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICBpZiAobmFtZSAmJiAhLS1hY3RpdmUpXG4gICAgICAgIGNsZWFyX3J1bGVzKCk7XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKVxuICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICBjdXJyZW50X3J1bGVzID0ge307XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9hbmltYXRpb24obm9kZSwgZnJvbSwgZm4sIHBhcmFtcykge1xuICAgIGlmICghZnJvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChmcm9tLmxlZnQgPT09IHRvLmxlZnQgJiYgZnJvbS5yaWdodCA9PT0gdG8ucmlnaHQgJiYgZnJvbS50b3AgPT09IHRvLnRvcCAmJiBmcm9tLmJvdHRvbSA9PT0gdG8uYm90dG9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86IHNob3VsZCB0aGlzIGJlIHNlcGFyYXRlZCBmcm9tIGRlc3RydWN0dXJpbmc/IE9yIHN0YXJ0L2VuZCBhZGRlZCB0byBwdWJsaWMgYXBpIGFuZCBkb2N1bWVudGF0aW9uP1xuICAgIHN0YXJ0OiBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOlxuICAgIGVuZCA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbiwgdGljayA9IG5vb3AsIGNzcyB9ID0gZm4obm9kZSwgeyBmcm9tLCB0byB9LCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIGxldCBuYW1lO1xuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWxheSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgaWYgKCFzdGFydGVkICYmIG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCAmJiBub3cgPj0gZW5kKSB7XG4gICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gbm93IC0gc3RhcnRfdGltZTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAwICsgMSAqIGVhc2luZyhwIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgc3RhcnQoKTtcbiAgICB0aWNrKDAsIDEpO1xuICAgIHJldHVybiBzdG9wO1xufVxuZnVuY3Rpb24gZml4X3Bvc2l0aW9uKG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc3R5bGU7XG4gICAgICAgIGNvbnN0IGEgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYWRkX3RyYW5zZm9ybShub2RlLCBhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpIHtcbiAgICBjb25zdCBiID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoYS5sZWZ0ICE9PSBiLmxlZnQgfHwgYS50b3AgIT09IGIudG9wKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgbm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke2EubGVmdCAtIGIubGVmdH1weCwgJHthLnRvcCAtIGIudG9wfXB4KWA7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudF9jb21wb25lbnQ7XG5mdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY3VycmVudF9jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBnZXRfY3VycmVudF9jb21wb25lbnQoKSB7XG4gICAgaWYgKCFjdXJyZW50X2NvbXBvbmVudClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb25gKTtcbiAgICByZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5mdW5jdGlvbiBiZWZvcmVVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX21vdW50LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbkRlc3Ryb3koZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHRoZXJlIHNpdHVhdGlvbnMgd2hlcmUgZXZlbnRzIGNvdWxkIGJlIGRpc3BhdGNoZWRcbiAgICAgICAgICAgIC8vIGluIGEgc2VydmVyIChub24tRE9NKSBlbnZpcm9ubWVudD9cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuKGV2ZW50KSk7XG4gICAgfVxufVxuXG5jb25zdCBkaXJ0eV9jb21wb25lbnRzID0gW107XG5jb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5jb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5sZXQgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2NoZWR1bGVfdXBkYXRlKCkge1xuICAgIGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuICAgICAgICB1cGRhdGVfc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0aWNrKCkge1xuICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgIHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuICAgIHJlbmRlcl9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZGRfZmx1c2hfY2FsbGJhY2soZm4pIHtcbiAgICBmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBkaXJ0eV9jb21wb25lbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShjb21wb25lbnQuJCQpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChiaW5kaW5nX2NhbGxiYWNrcy5sZW5ndGgpXG4gICAgICAgICAgICBiaW5kaW5nX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgICAgICAvLyB0aGVuLCBvbmNlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGNhbGxcbiAgICAgICAgLy8gYWZ0ZXJVcGRhdGUgZnVuY3Rpb25zLiBUaGlzIG1heSBjYXVzZVxuICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMuLi5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHJlbmRlcl9jYWxsYmFja3NbaV07XG4gICAgICAgICAgICBpZiAoIXNlZW5fY2FsbGJhY2tzLmhhcyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICAgICAgc2Vlbl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICB9IHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCk7XG4gICAgd2hpbGUgKGZsdXNoX2NhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgZmx1c2hfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgfVxuICAgIHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaGApO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBjbGFzc2VzX3RvX2FkZCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3QuYXNzaWduKHt9LCAuLi5hcmdzKTtcbiAgICBpZiAoY2xhc3Nlc190b19hZGQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RyID0gJyc7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgaWYgKGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLnRlc3QobmFtZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgKz0gYCAke25hbWV9PVwiJHtTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1wiL2csICcmIzM0OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyl9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IGVzY2FwZWQgPSB7XG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnXG59O1xuZnVuY3Rpb24gZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKGh0bWwpLnJlcGxhY2UoL1tcIicmPD5dL2csIG1hdGNoID0+IGVzY2FwZWRbbWF0Y2hdKTtcbn1cbmZ1bmN0aW9uIGVhY2goaXRlbXMsIGZuKSB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc3RyICs9IGZuKGl0ZW1zW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IG1pc3NpbmdfY29tcG9uZW50ID0ge1xuICAgICQkcmVuZGVyOiAoKSA9PiAnJ1xufTtcbmZ1bmN0aW9uIHZhbGlkYXRlX2NvbXBvbmVudChjb21wb25lbnQsIG5hbWUpIHtcbiAgICBpZiAoIWNvbXBvbmVudCB8fCAhY29tcG9uZW50LiQkcmVuZGVyKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnc3ZlbHRlOmNvbXBvbmVudCcpXG4gICAgICAgICAgICBuYW1lICs9ICcgdGhpcz17Li4ufSc7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPCR7bmFtZX0+IGlzIG5vdCBhIHZhbGlkIFNTUiBjb21wb25lbnQuIFlvdSBtYXkgbmVlZCB0byByZXZpZXcgeW91ciBidWlsZCBjb25maWcgdG8gZW5zdXJlIHRoYXQgZGVwZW5kZW5jaWVzIGFyZSBjb21waWxlZCwgcmF0aGVyIHRoYW4gaW1wb3J0ZWQgYXMgcHJlLWNvbXBpbGVkIG1vZHVsZXNgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGRlYnVnKGZpbGUsIGxpbmUsIGNvbHVtbiwgdmFsdWVzKSB7XG4gICAgY29uc29sZS5sb2coYHtAZGVidWd9ICR7ZmlsZSA/IGZpbGUgKyAnICcgOiAnJ30oJHtsaW5lfToke2NvbHVtbn0pYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIHJldHVybiAnJztcbn1cbmxldCBvbl9kZXN0cm95O1xuZnVuY3Rpb24gY3JlYXRlX3Nzcl9jb21wb25lbnQoZm4pIHtcbiAgICBmdW5jdGlvbiAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpIHtcbiAgICAgICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgICAgICBjb25zdCAkJCA9IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3ksXG4gICAgICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICByZXR1cm4gYCAke25hbWV9JHt2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogYD0ke3R5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeShlc2NhcGUodmFsdWUpKSA6IGBcIiR7dmFsdWV9XCJgfWB9YDtcbn1cbmZ1bmN0aW9uIGFkZF9jbGFzc2VzKGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3NlcyA/IGAgY2xhc3M9XCIke2NsYXNzZXN9XCJgIDogYGA7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yKSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIC8vIG9uTW91bnQgaGFwcGVucyBiZWZvcmUgdGhlIGluaXRpYWwgYWZ0ZXJVcGRhdGVcbiAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICBpZiAob25fZGVzdHJveSkge1xuICAgICAgICAgICAgb25fZGVzdHJveS5wdXNoKC4uLm5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEVkZ2UgY2FzZSAtIGNvbXBvbmVudCB3YXMgZGVzdHJveWVkIGltbWVkaWF0ZWx5LFxuICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgcnVuX2FsbChuZXdfb25fZGVzdHJveSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgfSk7XG4gICAgYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2NvbXBvbmVudChjb21wb25lbnQsIGRldGFjaGluZykge1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkO1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICBydW5fYWxsKCQkLm9uX2Rlc3Ryb3kpO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5kKGRldGFjaGluZyk7XG4gICAgICAgIC8vIFRPRE8gbnVsbCBvdXQgb3RoZXIgcmVmcywgaW5jbHVkaW5nIGNvbXBvbmVudC4kJCAoYnV0IG5lZWQgdG9cbiAgICAgICAgLy8gcHJlc2VydmUgZmluYWwgc3RhdGU/KVxuICAgICAgICAkJC5vbl9kZXN0cm95ID0gJCQuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICAkJC5jdHggPSBbXTtcbiAgICB9XG59XG5mdW5jdGlvbiBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSkge1xuICAgIGlmIChjb21wb25lbnQuJCQuZGlydHlbMF0gPT09IC0xKSB7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICAgICAgY29tcG9uZW50LiQkLmRpcnR5LmZpbGwoMCk7XG4gICAgfVxuICAgIGNvbXBvbmVudC4kJC5kaXJ0eVsoaSAvIDMxKSB8IDBdIHw9ICgxIDw8IChpICUgMzEpKTtcbn1cbmZ1bmN0aW9uIGluaXQoY29tcG9uZW50LCBvcHRpb25zLCBpbnN0YW5jZSwgY3JlYXRlX2ZyYWdtZW50LCBub3RfZXF1YWwsIHByb3BzLCBkaXJ0eSA9IFstMV0pIHtcbiAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJvcF92YWx1ZXMgPSBvcHRpb25zLnByb3BzIHx8IHt9O1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBudWxsLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBwcm9wcyxcbiAgICAgICAgdXBkYXRlOiBub29wLFxuICAgICAgICBub3RfZXF1YWwsXG4gICAgICAgIGJvdW5kOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgLy8gbGlmZWN5Y2xlXG4gICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgb25fZGVzdHJveTogW10sXG4gICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICBkaXJ0eVxuICAgIH07XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIHByb3BfdmFsdWVzLCAoaSwgcmV0LCAuLi5yZXN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlc3QubGVuZ3RoID8gcmVzdFswXSA6IHJldDtcbiAgICAgICAgICAgIGlmICgkJC5jdHggJiYgbm90X2VxdWFsKCQkLmN0eFtpXSwgJCQuY3R4W2ldID0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQkLmJvdW5kW2ldKVxuICAgICAgICAgICAgICAgICAgICAkJC5ib3VuZFtpXSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWR5KVxuICAgICAgICAgICAgICAgICAgICBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KVxuICAgICAgICA6IFtdO1xuICAgICQkLnVwZGF0ZSgpO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgIC8vIGBmYWxzZWAgYXMgYSBzcGVjaWFsIGNhc2Ugb2Ygbm8gRE9NIGNvbXBvbmVudFxuICAgICQkLmZyYWdtZW50ID0gY3JlYXRlX2ZyYWdtZW50ID8gY3JlYXRlX2ZyYWdtZW50KCQkLmN0eCkgOiBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaHlkcmF0ZSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmwoY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4xOC4xJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQuZGF0YSA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFcIiwgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnREZXYgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICghb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuJCRpbmxpbmUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCd0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uYCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWRgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluZmluaXRlIGxvb3AgZGV0ZWN0ZWRgKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVFbGVtZW50LCBhY3Rpb25fZGVzdHJveWVyLCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfbG9jYXRpb24sIGFkZF9yZW5kZXJfY2FsbGJhY2ssIGFkZF9yZXNpemVfbGlzdGVuZXIsIGFkZF90cmFuc2Zvcm0sIGFmdGVyVXBkYXRlLCBhcHBlbmQsIGFwcGVuZF9kZXYsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX3NwYWNlLCBjbGFpbV90ZXh0LCBjbGVhcl9sb29wcywgY29tcG9uZW50X3N1YnNjcmliZSwgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCBjcmVhdGVfYW5pbWF0aW9uLCBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uLCBjcmVhdGVfY29tcG9uZW50LCBjcmVhdGVfaW5fdHJhbnNpdGlvbiwgY3JlYXRlX291dF90cmFuc2l0aW9uLCBjcmVhdGVfc2xvdCwgY3JlYXRlX3Nzcl9jb21wb25lbnQsIGN1cnJlbnRfY29tcG9uZW50LCBjdXN0b21fZXZlbnQsIGRhdGFzZXRfZGV2LCBkZWJ1ZywgZGVzdHJveV9ibG9jaywgZGVzdHJveV9jb21wb25lbnQsIGRlc3Ryb3lfZWFjaCwgZGV0YWNoLCBkZXRhY2hfYWZ0ZXJfZGV2LCBkZXRhY2hfYmVmb3JlX2RldiwgZGV0YWNoX2JldHdlZW5fZGV2LCBkZXRhY2hfZGV2LCBkaXJ0eV9jb21wb25lbnRzLCBkaXNwYXRjaF9kZXYsIGVhY2gsIGVsZW1lbnQsIGVsZW1lbnRfaXMsIGVtcHR5LCBlc2NhcGUsIGVzY2FwZWQsIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMsIGZpeF9hbmRfZGVzdHJveV9ibG9jaywgZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jaywgZml4X3Bvc2l0aW9uLCBmbHVzaCwgZ2V0Q29udGV4dCwgZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUsIGdldF9jdXJyZW50X2NvbXBvbmVudCwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dCwgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnRyb3MsIGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLCBpc19jbGllbnQsIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzdG9wX3Byb3BhZ2F0aW9uLCBzdWJzY3JpYmUsIHN2Z19lbGVtZW50LCB0ZXh0LCB0aWNrLCB0aW1lX3Jhbmdlc190b19hcnJheSwgdG9fbnVtYmVyLCB0b2dnbGVfY2xhc3MsIHRyYW5zaXRpb25faW4sIHRyYW5zaXRpb25fb3V0LCB1cGRhdGVfa2V5ZWRfZWFjaCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3N0b3JlLCB4bGlua19hdHRyIH07XG4iLCJpbXBvcnQgeyBub29wLCBzYWZlX25vdF9lcXVhbCwgc3Vic2NyaWJlLCBydW5fYWxsLCBpc19mdW5jdGlvbiB9IGZyb20gJy4uL2ludGVybmFsJztcbmV4cG9ydCB7IGdldF9zdG9yZV92YWx1ZSBhcyBnZXQgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0gdmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcn1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRhYmxlKHZhbHVlLCBzdGFydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZTogd3JpdGFibGUodmFsdWUsIHN0YXJ0KS5zdWJzY3JpYmUsXG4gICAgfTtcbn1cbi8qKlxuICogQ3JlYXRlIGEgYFdyaXRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyBib3RoIHVwZGF0aW5nIGFuZCByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7Kj19dmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcj19c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQgPSBub29wKSB7XG4gICAgbGV0IHN0b3A7XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmIChzYWZlX25vdF9lcXVhbCh2YWx1ZSwgbmV3X3ZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICBpZiAoc3RvcCkgeyAvLyBzdG9yZSBpcyByZWFkeVxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bl9xdWV1ZSA9ICFzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgc1sxXSgpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlLnB1c2gocywgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVuX3F1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZVtpXVswXShzdWJzY3JpYmVyX3F1ZXVlW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGUoZm4pIHtcbiAgICAgICAgc2V0KGZuKHZhbHVlKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShydW4sIGludmFsaWRhdGUgPSBub29wKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBbcnVuLCBpbnZhbGlkYXRlXTtcbiAgICAgICAgc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgc3RvcCA9IHN0YXJ0KHNldCkgfHwgbm9vcDtcbiAgICAgICAgfVxuICAgICAgICBydW4odmFsdWUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpYmVycy5pbmRleE9mKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgIHN0b3AgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzZXQsIHVwZGF0ZSwgc3Vic2NyaWJlIH07XG59XG5mdW5jdGlvbiBkZXJpdmVkKHN0b3JlcywgZm4sIGluaXRpYWxfdmFsdWUpIHtcbiAgICBjb25zdCBzaW5nbGUgPSAhQXJyYXkuaXNBcnJheShzdG9yZXMpO1xuICAgIGNvbnN0IHN0b3Jlc19hcnJheSA9IHNpbmdsZVxuICAgICAgICA/IFtzdG9yZXNdXG4gICAgICAgIDogc3RvcmVzO1xuICAgIGNvbnN0IGF1dG8gPSBmbi5sZW5ndGggPCAyO1xuICAgIHJldHVybiByZWFkYWJsZShpbml0aWFsX3ZhbHVlLCAoc2V0KSA9PiB7XG4gICAgICAgIGxldCBpbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgIGxldCBwZW5kaW5nID0gMDtcbiAgICAgICAgbGV0IGNsZWFudXAgPSBub29wO1xuICAgICAgICBjb25zdCBzeW5jID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbihzaW5nbGUgPyB2YWx1ZXNbMF0gOiB2YWx1ZXMsIHNldCk7XG4gICAgICAgICAgICBpZiAoYXV0bykge1xuICAgICAgICAgICAgICAgIHNldChyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCA9IGlzX2Z1bmN0aW9uKHJlc3VsdCkgPyByZXN1bHQgOiBub29wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZXJzID0gc3RvcmVzX2FycmF5Lm1hcCgoc3RvcmUsIGkpID0+IHN1YnNjcmliZShzdG9yZSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBlbmRpbmcgJj0gfigxIDw8IGkpO1xuICAgICAgICAgICAgaWYgKGluaXRlZCkge1xuICAgICAgICAgICAgICAgIHN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcGVuZGluZyB8PSAoMSA8PCBpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBpbml0ZWQgPSB0cnVlO1xuICAgICAgICBzeW5jKCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICAgICAgcnVuX2FsbCh1bnN1YnNjcmliZXJzKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgZGVyaXZlZCwgcmVhZGFibGUsIHdyaXRhYmxlIH07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBDT05URVhUX0tFWSA9IHt9O1xuXG5leHBvcnQgY29uc3QgcHJlbG9hZCA9ICgpID0+ICh7fSk7IiwiZnVuY3Rpb24gdG9WYWwobWl4KSB7XG5cdHZhciBrLCB5LCBzdHI9Jyc7XG5cdGlmIChtaXgpIHtcblx0XHRpZiAodHlwZW9mIG1peCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG1peCkpIHtcblx0XHRcdFx0Zm9yIChrPTA7IGsgPCBtaXgubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwobWl4W2tdKSkpIHtcblx0XHRcdFx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRcdFx0XHRzdHIgKz0geTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoayBpbiBtaXgpIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwoaykpKSB7XG5cdFx0XHRcdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0XHRcdFx0c3RyICs9IHk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgbWl4ICE9PSAnYm9vbGVhbicgJiYgIW1peC5jYWxsKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IG1peDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuXHR2YXIgaT0wLCB4LCBzdHI9Jyc7XG5cdHdoaWxlIChpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdGlmICh4ID0gdG9WYWwoYXJndW1lbnRzW2krK10pKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IHhcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRPcmlnaW5hbEJvZHlQYWRkaW5nKCkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdyA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIG51bGwpIDoge307XG5cbiAgcmV0dXJuIHBhcnNlSW50KChzdHlsZSAmJiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpIHx8IDAsIDEwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCkge1xuICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIC8vIC5tb2RhbC1zY3JvbGxiYXItbWVhc3VyZSBzdHlsZXMgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjQvc2Nzcy9fbW9kYWwuc2NzcyNMMTA2LUwxMTNcbiAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgc2Nyb2xsRGl2LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgc2Nyb2xsRGl2LnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTY3JvbGxiYXJXaWR0aChwYWRkaW5nKSB7XG4gIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA+IDAgPyBgJHtwYWRkaW5nfXB4YCA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JvZHlPdmVyZmxvd2luZygpIHtcbiAgcmV0dXJuIHdpbmRvdyA/IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCB3aW5kb3cuaW5uZXJXaWR0aCA6IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmRpdGlvbmFsbHlVcGRhdGVTY3JvbGxiYXIoKSB7XG4gIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjYvanMvc3JjL21vZGFsLmpzI0w0MzNcbiAgY29uc3QgZml4ZWRDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcCdcbiAgKVswXTtcbiAgY29uc3QgYm9keVBhZGRpbmcgPSBmaXhlZENvbnRlbnRcbiAgICA/IHBhcnNlSW50KGZpeGVkQ29udGVudC5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgMCwgMTApXG4gICAgOiAwO1xuXG4gIGlmIChpc0JvZHlPdmVyZmxvd2luZygpKSB7XG4gICAgc2V0U2Nyb2xsYmFyV2lkdGgoYm9keVBhZGRpbmcgKyBzY3JvbGxiYXJXaWR0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sU2l6ZSkge1xuICBpZiAoY29sU2l6ZSA9PT0gdHJ1ZSB8fCBjb2xTaXplID09PSAnJykge1xuICAgIHJldHVybiBpc1hzID8gJ2NvbCcgOiBgY29sLSR7Y29sV2lkdGh9YDtcbiAgfSBlbHNlIGlmIChjb2xTaXplID09PSAnYXV0bycpIHtcbiAgICByZXR1cm4gaXNYcyA/ICdjb2wtYXV0bycgOiBgY29sLSR7Y29sV2lkdGh9LWF1dG9gO1xuICB9XG5cbiAgcmV0dXJuIGlzWHMgPyBgY29sLSR7Y29sU2l6ZX1gIDogYGNvbC0ke2NvbFdpZHRofS0ke2NvbFNpemV9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKCQkcHJvcHMpIHtcbiAgLy8gVE9ETyBzdXBwb3J0IGtleXNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgY2hpbGRyZW4sICQkc2NvcGUsICQkc2xvdHMgfSA9ICQkcHJvcHM7XG4gIGNvbnN0IHJlc3QgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoJCRwcm9wcykpIHtcbiAgICBpZiAoa2V5ICE9PSBcImNoaWxkcmVuXCIgJiYga2V5ICE9PSBcIiQkc2NvcGVcIiAmJiBrZXkgIT09IFwiJCRzbG90c1wiKSB7XG4gICAgICByZXN0W2tleV0gPSAkJHByb3BzW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJvd3NlckV2ZW50KHRhcmdldCwgLi4uYXJncykge1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblxuICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDYXJvdXNlbEFjdGl2ZUluZGV4KGRpcmVjdGlvbiwgaXRlbXMsIGFjdGl2ZUluZGV4KSB7XG4gIGlmIChkaXJlY3Rpb24gPT09ICdwcmV2Jykge1xuICAgIHJldHVybiBhY3RpdmVJbmRleCA9PT0gMCA/IGl0ZW1zLmxlbmd0aCAtIDEgOiBhY3RpdmVJbmRleCAtIDE7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICByZXR1cm4gYWN0aXZlSW5kZXggPT09IGl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogYWN0aXZlSW5kZXggKyAxO1xuICB9XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGZsdWlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgZmx1aWQgPyAnY29udGFpbmVyLWZsdWlkJyA6ICdjb250YWluZXInKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbGlnaHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkYXJrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZml4ZWQgPSAnJztcbiAgZXhwb3J0IGxldCBzdGlja3kgPSAnJztcbiAgZXhwb3J0IGxldCBjb2xvciA9ICcnO1xuICBleHBvcnQgbGV0IGV4cGFuZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgZnVuY3Rpb24gZ2V0RXhwYW5kQ2xhc3MoZXhwYW5kKSB7XG4gICAgaWYgKGV4cGFuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGV4cGFuZCA9PT0gdHJ1ZSB8fCBleHBhbmQgPT09ICd4cycpIHtcbiAgICAgIHJldHVybiAnbmF2YmFyLWV4cGFuZCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBuYXZiYXItZXhwYW5kLSR7ZXhwYW5kfWA7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICduYXZiYXInLCBnZXRFeHBhbmRDbGFzcyhleHBhbmQpLCB7XG4gICAgJ25hdmJhci1saWdodCc6IGxpZ2h0LFxuICAgICduYXZiYXItZGFyayc6IGRhcmssXG4gICAgW2BiZy0ke2NvbG9yfWBdOiBjb2xvcixcbiAgICBbYGZpeGVkLSR7Zml4ZWR9YF06IGZpeGVkLFxuICAgIFtgc3RpY2t5LSR7c3RpY2t5fWBdOiBzdGlja3lcbiAgfSk7XG48L3NjcmlwdD5cblxuPG5hdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvbmF2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBocmVmID0gJy8nO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCAnbmF2YmFyLWJyYW5kJyk7XG48L3NjcmlwdD5cblxuPGEgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30ge2hyZWZ9PlxuICA8c2xvdCAvPlxuPC9hPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBibG9jayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNoaWxkcmVuID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGNsb3NlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnc2Vjb25kYXJ5JztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGhyZWYgPSAnJztcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgc3R5bGUgPSAnJztcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogYXJpYUxhYmVsID0gJCRwcm9wc1snYXJpYS1sYWJlbCddO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICB7IGNsb3NlIH0sXG4gICAgY2xvc2UgfHwgJ2J0bicsXG4gICAgY2xvc2UgfHwgYGJ0biR7b3V0bGluZSA/ICctb3V0bGluZScgOiAnJ30tJHtjb2xvcn1gLFxuICAgIHNpemUgPyBgYnRuLSR7c2l6ZX1gIDogZmFsc2UsXG4gICAgYmxvY2sgPyAnYnRuLWJsb2NrJyA6IGZhbHNlLFxuICAgIHsgYWN0aXZlIH1cbiAgKTtcblxuICAkOiBkZWZhdWx0QXJpYUxhYmVsID0gY2xvc2UgPyAnQ2xvc2UnIDogbnVsbDtcbjwvc2NyaXB0PlxuXG57I2lmIGhyZWZ9XG4gIDxhXG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7ZGlzYWJsZWR9XG4gICAgb246Y2xpY2tcbiAgICB7aHJlZn1cbiAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWwgfHwgZGVmYXVsdEFyaWFMYWJlbH1cbiAgICB7c3R5bGV9PlxuICAgIHsjaWYgY2hpbGRyZW59XG4gICAgICB7Y2hpbGRyZW59XG4gICAgezplbHNlfVxuICAgICAgPHNsb3QgLz5cbiAgICB7L2lmfVxuICA8L2E+XG57OmVsc2V9XG4gIDxidXR0b25cbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGlja1xuICAgIHt2YWx1ZX1cbiAgICBhcmlhLWxhYmVsPXthcmlhTGFiZWwgfHwgZGVmYXVsdEFyaWFMYWJlbH1cbiAgICB7c3R5bGV9PlxuICAgIDxzbG90PlxuICAgICAgeyNpZiBjbG9zZX1cbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+XG4gICAgICB7OmVsc2UgaWYgY2hpbGRyZW59XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIHs6ZWxzZX1cbiAgICAgICAgPHNsb3QgLz5cbiAgICAgIHsvaWZ9XG4gICAgPC9zbG90PlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHRhYnMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBwaWxscyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZlcnRpY2FsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaG9yaXpvbnRhbCA9ICcnO1xuICBleHBvcnQgbGV0IGp1c3RpZmllZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGZpbGwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjYXJkID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRWZXJ0aWNhbENsYXNzKHZlcnRpY2FsKSB7XG4gICAgaWYgKHZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodmVydGljYWwgPT09IHRydWUgfHwgdmVydGljYWwgPT09ICd4cycpIHtcbiAgICAgIHJldHVybiAnZmxleC1jb2x1bW4nO1xuICAgIH1cbiAgICByZXR1cm4gYGZsZXgtJHt2ZXJ0aWNhbH0tY29sdW1uYDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBuYXZiYXIgPyAnbmF2YmFyLW5hdicgOiAnbmF2JyxcbiAgICBob3Jpem9udGFsID8gYGp1c3RpZnktY29udGVudC0ke2hvcml6b250YWx9YCA6IGZhbHNlLFxuICAgIGdldFZlcnRpY2FsQ2xhc3ModmVydGljYWwpLFxuICAgIHtcbiAgICAgICduYXYtdGFicyc6IHRhYnMsXG4gICAgICAnY2FyZC1oZWFkZXItdGFicyc6IGNhcmQgJiYgdGFicyxcbiAgICAgICduYXYtcGlsbHMnOiBwaWxscyxcbiAgICAgICdjYXJkLWhlYWRlci1waWxscyc6IGNhcmQgJiYgcGlsbHMsXG4gICAgICAnbmF2LWp1c3RpZmllZCc6IGp1c3RpZmllZCxcbiAgICAgICduYXYtZmlsbCc6IGZpbGxcbiAgICB9XG4gICk7XG48L3NjcmlwdD5cblxuPHVsIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC91bD5cbiIsImV4cG9ydCB7IGlkZW50aXR5IGFzIGxpbmVhciB9IGZyb20gJy4uL2ludGVybmFsJztcblxuLypcbkFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0dGRlc2xcbkRpc3RyaWJ1dGVkIHVuZGVyIE1JVCBMaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0ZGVzbC9lYXNlcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4qL1xuZnVuY3Rpb24gYmFja0luT3V0KHQpIHtcbiAgICBjb25zdCBzID0gMS43MDE1OCAqIDEuNTI1O1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiAodCAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKSk7XG4gICAgcmV0dXJuIDAuNSAqICgodCAtPSAyKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDIpO1xufVxuZnVuY3Rpb24gYmFja0luKHQpIHtcbiAgICBjb25zdCBzID0gMS43MDE1ODtcbiAgICByZXR1cm4gdCAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKTtcbn1cbmZ1bmN0aW9uIGJhY2tPdXQodCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4O1xuICAgIHJldHVybiAtLXQgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxO1xufVxuZnVuY3Rpb24gYm91bmNlT3V0KHQpIHtcbiAgICBjb25zdCBhID0gNC4wIC8gMTEuMDtcbiAgICBjb25zdCBiID0gOC4wIC8gMTEuMDtcbiAgICBjb25zdCBjID0gOS4wIC8gMTAuMDtcbiAgICBjb25zdCBjYSA9IDQzNTYuMCAvIDM2MS4wO1xuICAgIGNvbnN0IGNiID0gMzU0NDIuMCAvIDE4MDUuMDtcbiAgICBjb25zdCBjYyA9IDE2MDYxLjAgLyAxODA1LjA7XG4gICAgY29uc3QgdDIgPSB0ICogdDtcbiAgICByZXR1cm4gdCA8IGFcbiAgICAgICAgPyA3LjU2MjUgKiB0MlxuICAgICAgICA6IHQgPCBiXG4gICAgICAgICAgICA/IDkuMDc1ICogdDIgLSA5LjkgKiB0ICsgMy40XG4gICAgICAgICAgICA6IHQgPCBjXG4gICAgICAgICAgICAgICAgPyBjYSAqIHQyIC0gY2IgKiB0ICsgY2NcbiAgICAgICAgICAgICAgICA6IDEwLjggKiB0ICogdCAtIDIwLjUyICogdCArIDEwLjcyO1xufVxuZnVuY3Rpb24gYm91bmNlSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gMC41ICogKDEuMCAtIGJvdW5jZU91dCgxLjAgLSB0ICogMi4wKSlcbiAgICAgICAgOiAwLjUgKiBib3VuY2VPdXQodCAqIDIuMCAtIDEuMCkgKyAwLjU7XG59XG5mdW5jdGlvbiBib3VuY2VJbih0KSB7XG4gICAgcmV0dXJuIDEuMCAtIGJvdW5jZU91dCgxLjAgLSB0KTtcbn1cbmZ1bmN0aW9uIGNpcmNJbk91dCh0KSB7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKTtcbiAgICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpO1xufVxuZnVuY3Rpb24gY2lyY0luKHQpIHtcbiAgICByZXR1cm4gMS4wIC0gTWF0aC5zcXJ0KDEuMCAtIHQgKiB0KTtcbn1cbmZ1bmN0aW9uIGNpcmNPdXQodCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQoMSAtIC0tdCAqIHQpO1xufVxuZnVuY3Rpb24gY3ViaWNJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjUgPyA0LjAgKiB0ICogdCAqIHQgOiAwLjUgKiBNYXRoLnBvdygyLjAgKiB0IC0gMi4wLCAzLjApICsgMS4wO1xufVxuZnVuY3Rpb24gY3ViaWNJbih0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdDtcbn1cbmZ1bmN0aW9uIGN1YmljT3V0KHQpIHtcbiAgICBjb25zdCBmID0gdCAtIDEuMDtcbiAgICByZXR1cm4gZiAqIGYgKiBmICsgMS4wO1xufVxuZnVuY3Rpb24gZWxhc3RpY0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/IDAuNSAqXG4gICAgICAgICAgICBNYXRoLnNpbigoKCsxMy4wICogTWF0aC5QSSkgLyAyKSAqIDIuMCAqIHQpICpcbiAgICAgICAgICAgIE1hdGgucG93KDIuMCwgMTAuMCAqICgyLjAgKiB0IC0gMS4wKSlcbiAgICAgICAgOiAwLjUgKlxuICAgICAgICAgICAgTWF0aC5zaW4oKCgtMTMuMCAqIE1hdGguUEkpIC8gMikgKiAoMi4wICogdCAtIDEuMCArIDEuMCkpICpcbiAgICAgICAgICAgIE1hdGgucG93KDIuMCwgLTEwLjAgKiAoMi4wICogdCAtIDEuMCkpICtcbiAgICAgICAgICAgIDEuMDtcbn1cbmZ1bmN0aW9uIGVsYXN0aWNJbih0KSB7XG4gICAgcmV0dXJuIE1hdGguc2luKCgxMy4wICogdCAqIE1hdGguUEkpIC8gMikgKiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpO1xufVxuZnVuY3Rpb24gZWxhc3RpY091dCh0KSB7XG4gICAgcmV0dXJuIChNYXRoLnNpbigoLTEzLjAgKiAodCArIDEuMCkgKiBNYXRoLlBJKSAvIDIpICogTWF0aC5wb3coMi4wLCAtMTAuMCAqIHQpICsgMS4wKTtcbn1cbmZ1bmN0aW9uIGV4cG9Jbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPT09IDAuMCB8fCB0ID09PSAxLjBcbiAgICAgICAgPyB0XG4gICAgICAgIDogdCA8IDAuNVxuICAgICAgICAgICAgPyArMC41ICogTWF0aC5wb3coMi4wLCAyMC4wICogdCAtIDEwLjApXG4gICAgICAgICAgICA6IC0wLjUgKiBNYXRoLnBvdygyLjAsIDEwLjAgLSB0ICogMjAuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBleHBvSW4odCkge1xuICAgIHJldHVybiB0ID09PSAwLjAgPyB0IDogTWF0aC5wb3coMi4wLCAxMC4wICogKHQgLSAxLjApKTtcbn1cbmZ1bmN0aW9uIGV4cG9PdXQodCkge1xuICAgIHJldHVybiB0ID09PSAxLjAgPyB0IDogMS4wIC0gTWF0aC5wb3coMi4wLCAtMTAuMCAqIHQpO1xufVxuZnVuY3Rpb24gcXVhZEluT3V0KHQpIHtcbiAgICB0IC89IDAuNTtcbiAgICBpZiAodCA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiB0ICogdDtcbiAgICB0LS07XG4gICAgcmV0dXJuIC0wLjUgKiAodCAqICh0IC0gMikgLSAxKTtcbn1cbmZ1bmN0aW9uIHF1YWRJbih0KSB7XG4gICAgcmV0dXJuIHQgKiB0O1xufVxuZnVuY3Rpb24gcXVhZE91dCh0KSB7XG4gICAgcmV0dXJuIC10ICogKHQgLSAyLjApO1xufVxuZnVuY3Rpb24gcXVhcnRJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyArOC4wICogTWF0aC5wb3codCwgNC4wKVxuICAgICAgICA6IC04LjAgKiBNYXRoLnBvdyh0IC0gMS4wLCA0LjApICsgMS4wO1xufVxuZnVuY3Rpb24gcXVhcnRJbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHQsIDQuMCk7XG59XG5mdW5jdGlvbiBxdWFydE91dCh0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHQgLSAxLjAsIDMuMCkgKiAoMS4wIC0gdCkgKyAxLjA7XG59XG5mdW5jdGlvbiBxdWludEluT3V0KHQpIHtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogdCAqIHQgKiB0ICogdCAqIHQ7XG4gICAgcmV0dXJuIDAuNSAqICgodCAtPSAyKSAqIHQgKiB0ICogdCAqIHQgKyAyKTtcbn1cbmZ1bmN0aW9uIHF1aW50SW4odCkge1xuICAgIHJldHVybiB0ICogdCAqIHQgKiB0ICogdDtcbn1cbmZ1bmN0aW9uIHF1aW50T3V0KHQpIHtcbiAgICByZXR1cm4gLS10ICogdCAqIHQgKiB0ICogdCArIDE7XG59XG5mdW5jdGlvbiBzaW5lSW5PdXQodCkge1xuICAgIHJldHVybiAtMC41ICogKE1hdGguY29zKE1hdGguUEkgKiB0KSAtIDEpO1xufVxuZnVuY3Rpb24gc2luZUluKHQpIHtcbiAgICBjb25zdCB2ID0gTWF0aC5jb3ModCAqIE1hdGguUEkgKiAwLjUpO1xuICAgIGlmIChNYXRoLmFicyh2KSA8IDFlLTE0KVxuICAgICAgICByZXR1cm4gMTtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiAxIC0gdjtcbn1cbmZ1bmN0aW9uIHNpbmVPdXQodCkge1xuICAgIHJldHVybiBNYXRoLnNpbigodCAqIE1hdGguUEkpIC8gMik7XG59XG5cbmV4cG9ydCB7IGJhY2tJbiwgYmFja0luT3V0LCBiYWNrT3V0LCBib3VuY2VJbiwgYm91bmNlSW5PdXQsIGJvdW5jZU91dCwgY2lyY0luLCBjaXJjSW5PdXQsIGNpcmNPdXQsIGN1YmljSW4sIGN1YmljSW5PdXQsIGN1YmljT3V0LCBlbGFzdGljSW4sIGVsYXN0aWNJbk91dCwgZWxhc3RpY091dCwgZXhwb0luLCBleHBvSW5PdXQsIGV4cG9PdXQsIHF1YWRJbiwgcXVhZEluT3V0LCBxdWFkT3V0LCBxdWFydEluLCBxdWFydEluT3V0LCBxdWFydE91dCwgcXVpbnRJbiwgcXVpbnRJbk91dCwgcXVpbnRPdXQsIHNpbmVJbiwgc2luZUluT3V0LCBzaW5lT3V0IH07XG4iLCJpbXBvcnQgeyBjdWJpY0luT3V0LCBsaW5lYXIsIGN1YmljT3V0IH0gZnJvbSAnLi4vZWFzaW5nJztcbmltcG9ydCB7IGlzX2Z1bmN0aW9uLCBhc3NpZ24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5mdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cblxuZnVuY3Rpb24gYmx1cihub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljSW5PdXQsIGFtb3VudCA9IDUsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCBmID0gc3R5bGUuZmlsdGVyID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLmZpbHRlcjtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9OyBmaWx0ZXI6ICR7Zn0gYmx1cigke3UgKiBhbW91bnR9cHgpO2BcbiAgICB9O1xufVxuZnVuY3Rpb24gZmFkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGxpbmVhciB9KSB7XG4gICAgY29uc3QgbyA9ICtnZXRDb21wdXRlZFN0eWxlKG5vZGUpLm9wYWNpdHk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3BhY2l0eTogJHt0ICogb31gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZseShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCB4ID0gMCwgeSA9IDAsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6ICh0LCB1KSA9PiBgXG5cdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHsoMSAtIHQpICogeH1weCwgJHsoMSAtIHQpICogeX1weCk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9YFxuICAgIH07XG59XG5mdW5jdGlvbiBzbGlkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0IH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IGhlaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUuaGVpZ2h0KTtcbiAgICBjb25zdCBwYWRkaW5nX3RvcCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCk7XG4gICAgY29uc3QgcGFkZGluZ19ib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgIGNvbnN0IG1hcmdpbl90b3AgPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblRvcCk7XG4gICAgY29uc3QgbWFyZ2luX2JvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKTtcbiAgICBjb25zdCBib3JkZXJfdG9wX3dpZHRoID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCk7XG4gICAgY29uc3QgYm9yZGVyX2JvdHRvbV93aWR0aCA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IHQgPT4gYG92ZXJmbG93OiBoaWRkZW47YCArXG4gICAgICAgICAgICBgb3BhY2l0eTogJHtNYXRoLm1pbih0ICogMjAsIDEpICogb3BhY2l0eX07YCArXG4gICAgICAgICAgICBgaGVpZ2h0OiAke3QgKiBoZWlnaHR9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy10b3A6ICR7dCAqIHBhZGRpbmdfdG9wfXB4O2AgK1xuICAgICAgICAgICAgYHBhZGRpbmctYm90dG9tOiAke3QgKiBwYWRkaW5nX2JvdHRvbX1weDtgICtcbiAgICAgICAgICAgIGBtYXJnaW4tdG9wOiAke3QgKiBtYXJnaW5fdG9wfXB4O2AgK1xuICAgICAgICAgICAgYG1hcmdpbi1ib3R0b206ICR7dCAqIG1hcmdpbl9ib3R0b219cHg7YCArXG4gICAgICAgICAgICBgYm9yZGVyLXRvcC13aWR0aDogJHt0ICogYm9yZGVyX3RvcF93aWR0aH1weDtgICtcbiAgICAgICAgICAgIGBib3JkZXItYm90dG9tLXdpZHRoOiAke3QgKiBib3JkZXJfYm90dG9tX3dpZHRofXB4O2BcbiAgICB9O1xufVxuZnVuY3Rpb24gc2NhbGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgc3RhcnQgPSAwLCBvcGFjaXR5ID0gMCB9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICBjb25zdCBzZCA9IDEgLSBzdGFydDtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHNjYWxlKCR7MSAtIChzZCAqIHUpfSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9XG5cdFx0YFxuICAgIH07XG59XG5mdW5jdGlvbiBkcmF3KG5vZGUsIHsgZGVsYXkgPSAwLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZyA9IGN1YmljSW5PdXQgfSkge1xuICAgIGNvbnN0IGxlbiA9IG5vZGUuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICBpZiAoZHVyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoc3BlZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSA4MDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IGxlbiAvIHNwZWVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uKGxlbik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6ICh0LCB1KSA9PiBgc3Ryb2tlLWRhc2hhcnJheTogJHt0ICogbGVufSAke3UgKiBsZW59YFxuICAgIH07XG59XG5mdW5jdGlvbiBjcm9zc2ZhZGUoX2EpIHtcbiAgICB2YXIgeyBmYWxsYmFjayB9ID0gX2EsIGRlZmF1bHRzID0gX19yZXN0KF9hLCBbXCJmYWxsYmFja1wiXSk7XG4gICAgY29uc3QgdG9fcmVjZWl2ZSA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCB0b19zZW5kID0gbmV3IE1hcCgpO1xuICAgIGZ1bmN0aW9uIGNyb3NzZmFkZShmcm9tLCBub2RlLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gZCA9PiBNYXRoLnNxcnQoZCkgKiAzMCwgZWFzaW5nID0gY3ViaWNPdXQgfSA9IGFzc2lnbihhc3NpZ24oe30sIGRlZmF1bHRzKSwgcGFyYW1zKTtcbiAgICAgICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBkeCA9IGZyb20ubGVmdCAtIHRvLmxlZnQ7XG4gICAgICAgIGNvbnN0IGR5ID0gZnJvbS50b3AgLSB0by50b3A7XG4gICAgICAgIGNvbnN0IGR3ID0gZnJvbS53aWR0aCAvIHRvLndpZHRoO1xuICAgICAgICBjb25zdCBkaCA9IGZyb20uaGVpZ2h0IC8gdG8uaGVpZ2h0O1xuICAgICAgICBjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWxheSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBpc19mdW5jdGlvbihkdXJhdGlvbikgPyBkdXJhdGlvbihkKSA6IGR1cmF0aW9uLFxuICAgICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgICAgY3NzOiAodCwgdSkgPT4gYFxuXHRcdFx0XHRvcGFjaXR5OiAke3QgKiBvcGFjaXR5fTtcblx0XHRcdFx0dHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7XG5cdFx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke3UgKiBkeH1weCwke3UgKiBkeX1weCkgc2NhbGUoJHt0ICsgKDEgLSB0KSAqIGR3fSwgJHt0ICsgKDEgLSB0KSAqIGRofSk7XG5cdFx0XHRgXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyYW5zaXRpb24oaXRlbXMsIGNvdW50ZXJwYXJ0cywgaW50cm8pIHtcbiAgICAgICAgcmV0dXJuIChub2RlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIGl0ZW1zLnNldChwYXJhbXMua2V5LCB7XG4gICAgICAgICAgICAgICAgcmVjdDogbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVycGFydHMuaGFzKHBhcmFtcy5rZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVjdCB9ID0gY291bnRlcnBhcnRzLmdldChwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgY291bnRlcnBhcnRzLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyb3NzZmFkZShyZWN0LCBub2RlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbm9kZSBpcyBkaXNhcHBlYXJpbmcgYWx0b2dldGhlclxuICAgICAgICAgICAgICAgIC8vIChpLmUuIHdhc24ndCBjbGFpbWVkIGJ5IHRoZSBvdGhlciBsaXN0KVxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgbmVlZCB0byBzdXBwbHkgYW4gb3V0cm9cbiAgICAgICAgICAgICAgICBpdGVtcy5kZWxldGUocGFyYW1zLmtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbGxiYWNrICYmIGZhbGxiYWNrKG5vZGUsIHBhcmFtcywgaW50cm8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdHJhbnNpdGlvbih0b19zZW5kLCB0b19yZWNlaXZlLCBmYWxzZSksXG4gICAgICAgIHRyYW5zaXRpb24odG9fcmVjZWl2ZSwgdG9fc2VuZCwgdHJ1ZSlcbiAgICBdO1xufVxuXG5leHBvcnQgeyBibHVyLCBjcm9zc2ZhZGUsIGRyYXcsIGZhZGUsIGZseSwgc2NhbGUsIHNsaWRlIH07XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgeyBzbGlkZSB9IGZyb20gJ3N2ZWx0ZS90cmFuc2l0aW9uJztcbiAgY29uc3Qgbm9vcCA9ICgpID0+IHVuZGVmaW5lZDtcblxuICBleHBvcnQgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IG5hdmJhciA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG9uRW50ZXJpbmcgPSBub29wO1xuICBleHBvcnQgbGV0IG9uRW50ZXJlZCA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgb25FeGl0aW5nID0gbm9vcDtcbiAgZXhwb3J0IGxldCBvbkV4aXRlZCA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgZXhwYW5kID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgLy8gY29sbGFwc2VDbGFzcyxcbiAgICBuYXZiYXIgJiYgJ25hdmJhci1jb2xsYXBzZSdcbiAgKTtcblxuICBsZXQgd2luZG93V2lkdGggPSAwO1xuICBsZXQgX3dhc01heGltYXplZCA9IGZhbHNlO1xuXG4gIGNvbnN0IG1pbldpZHRoID0ge307XG4gIG1pbldpZHRoWyd4cyddID0gMDtcbiAgbWluV2lkdGhbJ3NtJ10gPSA1NzY7XG4gIG1pbldpZHRoWydtZCddID0gNzY4O1xuICBtaW5XaWR0aFsnbGcnXSA9IDk5MjtcbiAgbWluV2lkdGhbJ3hsJ10gPSAxMjAwO1xuXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgIGRpc3BhdGNoKCd1cGRhdGUnLCB7XG4gICAgICBpc09wZW46IGlzT3BlblxuICAgIH0pO1xuICB9XG5cbiAgJDogaWYgKG5hdmJhciAmJiBleHBhbmQpIHtcbiAgICBpZiAod2luZG93V2lkdGggPj0gbWluV2lkdGhbZXhwYW5kXSAmJiAhaXNPcGVuKSB7XG4gICAgICBpc09wZW4gPSB0cnVlO1xuICAgICAgX3dhc01heGltYXplZCA9IHRydWU7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGVsc2UgaWYgKHdpbmRvd1dpZHRoIDwgbWluV2lkdGhbZXhwYW5kXSAmJiBfd2FzTWF4aW1hemVkKSB7XG4gICAgICBpc09wZW4gPSBmYWxzZTtcbiAgICAgIF93YXNNYXhpbWF6ZWQgPSBmYWxzZTtcbiAgICAgIG5vdGlmeSgpO1xuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbjxzdmVsdGU6d2luZG93IGJpbmQ6aW5uZXJXaWR0aD17d2luZG93V2lkdGh9IC8+XG5cbnsjaWYgaXNPcGVufVxuICA8ZGl2XG4gICAgdHJhbnNpdGlvbjpzbGlkZVxuICAgIG9uOmludHJvc3RhcnRcbiAgICBvbjppbnRyb2VuZFxuICAgIG9uOm91dHJvc3RhcnRcbiAgICBvbjpvdXRyb2VuZFxuICAgIG9uOmludHJvc3RhcnQ9e29uRW50ZXJpbmd9XG4gICAgb246aW50cm9lbmQ9e29uRW50ZXJlZH1cbiAgICBvbjpvdXRyb3N0YXJ0PXtvbkV4aXRpbmd9XG4gICAgb246b3V0cm9lbmQ9e29uRXhpdGVkfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHsuLi5wcm9wc30+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57L2lmfVxuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGV4dCA9ICgpID0+IHdyaXRhYmxlKHt9KTsiLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBzZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJy4vRHJvcGRvd25Db250ZXh0JztcblxuICBsZXQgY29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcbiAgc2V0Q29udGV4dCgnZHJvcGRvd25Db250ZXh0JywgY29udGV4dCk7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBkaXJlY3Rpb24gPSAnZG93bic7XG4gIGV4cG9ydCBsZXQgZ3JvdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpc09wZW4gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXYgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgdG9nZ2xlID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGluTmF2YmFyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2V0QWN0aXZlRnJvbUNoaWxkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZHJvcHVwID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBjb25zdCB2YWxpZERpcmVjdGlvbnMgPSBbJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCddO1xuXG4gIGlmICh2YWxpZERpcmVjdGlvbnMuaW5kZXhPZihkaXJlY3Rpb24pID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBJbnZhbGlkIGRpcmVjdGlvbiBzZW50OiAnJHtkaXJlY3Rpb259JyBpcyBub3Qgb25lIG9mICd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnYFxuICAgICk7XG4gIH1cblxuICBsZXQgY29tcG9uZW50O1xuXG4gICQ6IHN1Ykl0ZW1Jc0FjdGl2ZSA9ICEhKFxuICAgIHNldEFjdGl2ZUZyb21DaGlsZCAmJlxuICAgIGNvbXBvbmVudCAmJlxuICAgIHR5cGVvZiBjb21wb25lbnQucXVlcnlTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yKCcuYWN0aXZlJylcbiAgKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgZGlyZWN0aW9uICE9PSAnZG93bicgJiYgYGRyb3Ake2RpcmVjdGlvbn1gLFxuICAgIG5hdiAmJiBhY3RpdmUgPyAnYWN0aXZlJyA6IGZhbHNlLFxuICAgIHNldEFjdGl2ZUZyb21DaGlsZCAmJiBzdWJJdGVtSXNBY3RpdmUgPyAnYWN0aXZlJyA6IGZhbHNlLFxuICAgIHtcbiAgICAgIFtgaW5wdXQtZ3JvdXAtJHthZGRvblR5cGV9YF06IGFkZG9uVHlwZSxcbiAgICAgICdidG4tZ3JvdXAnOiBncm91cCxcbiAgICAgIFtgYnRuLWdyb3VwLSR7c2l6ZX1gXTogISFzaXplLFxuICAgICAgZHJvcGRvd246ICFncm91cCAmJiAhYWRkb25UeXBlLFxuICAgICAgc2hvdzogaXNPcGVuLFxuICAgICAgJ25hdi1pdGVtJzogbmF2XG4gICAgfVxuICApO1xuXG4gICQ6IHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICBbJ2NsaWNrJywgJ3RvdWNoc3RhcnQnLCAna2V5dXAnXS5mb3JFYWNoKGV2ZW50ID0+XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlRG9jdW1lbnRDbGljaywgdHJ1ZSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFsnY2xpY2snLCAndG91Y2hzdGFydCcsICdrZXl1cCddLmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVEb2N1bWVudENsaWNrLCB0cnVlKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICQ6IHtcbiAgICBjb250ZXh0LnVwZGF0ZSgoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b2dnbGUsXG4gICAgICAgIGlzT3BlbixcbiAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24gPT09ICdkb3duJyAmJiBkcm9wdXAgPyAndXAnIDogZGlyZWN0aW9uLFxuICAgICAgICBpbk5hdmJhclxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZURvY3VtZW50Q2xpY2soZSkge1xuICAgIGlmIChlICYmIChlLndoaWNoID09PSAzIHx8IChlLnR5cGUgPT09ICdrZXl1cCcgJiYgZS53aGljaCAhPT0gOSkpKSByZXR1cm47XG5cbiAgICBpZiAoXG4gICAgICBjb21wb25lbnQuY29udGFpbnMoZS50YXJnZXQpICYmXG4gICAgICBjb21wb25lbnQgIT09IGUudGFyZ2V0ICYmXG4gICAgICAoZS50eXBlICE9PSAna2V5dXAnIHx8IGUud2hpY2ggPT09IDkpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdG9nZ2xlKGUpO1xuICB9XG48L3NjcmlwdD5cblxueyNpZiBuYXZ9XG4gIDxsaSBjbGFzcz17Y2xhc3Nlc30gYmluZDp0aGlzPXtjb21wb25lbnR9IHsuLi5wcm9wc30+XG4gICAgPHNsb3QgLz5cbiAgPC9saT5cbns6ZWxzZX1cbiAgPGRpdiBjbGFzcz17Y2xhc3Nlc30gYmluZDp0aGlzPXtjb21wb25lbnR9IHsuLi5wcm9wc30+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vRHJvcGRvd24uc3ZlbHRlJztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlyZWN0aW9uID0gJ2Rvd24nO1xuICBleHBvcnQgbGV0IGdyb3VwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgbmF2ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYWRkb25UeXBlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IGluTmF2YmFyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2V0QWN0aXZlRnJvbUNoaWxkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZHJvcHVwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGVmYXVsdE9wZW4gPSBmYWxzZTtcblxuICBsZXQgaXNPcGVuID0gZGVmYXVsdE9wZW47XG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG48L3NjcmlwdD5cblxuPERyb3Bkb3duXG4gIHsuLi5wcm9wc31cbiAge2lzT3Blbn1cbiAgdG9nZ2xlPXsoKSA9PiAoaXNPcGVuID0gIWlzT3Blbil9XG4gIGNsYXNzPXtjbGFzc05hbWV9XG4gIHtkaXNhYmxlZH1cbiAge2RpcmVjdGlvbn1cbiAge2dyb3VwfVxuICB7bmF2fVxuICB7YWN0aXZlfVxuICB7YWRkb25UeXBlfVxuICB7c2l6ZX1cbiAge2luTmF2YmFyfVxuICB7c2V0QWN0aXZlRnJvbUNoaWxkfVxuICB7ZHJvcHVwfT5cbiAgPHNsb3QgLz5cbjwvRHJvcGRvd24+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgaW1wb3J0IEJ1dHRvbiBmcm9tICcuL0J1dHRvbi5zdmVsdGUnO1xuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnKTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGNhcmV0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSAnc2Vjb25kYXJ5JztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFyaWFIYXNwb3B1cCA9IHRydWU7XG4gIGV4cG9ydCBsZXQgYXJpYUxhYmVsID0gJ1RvZ2dsZSBEcm9wZG93bic7XG4gIGV4cG9ydCBsZXQgc3BsaXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXYgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgdGFnID0gbnVsbDtcbiAgZXhwb3J0IGxldCBvdXRsaW5lID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIHtcbiAgICAnZHJvcGRvd24tdG9nZ2xlJzogY2FyZXQgfHwgc3BsaXQsXG4gICAgJ2Ryb3Bkb3duLXRvZ2dsZS1zcGxpdCc6IHNwbGl0LFxuICAgICduYXYtbGluayc6IG5hdlxuICB9KTtcblxuICBmdW5jdGlvbiB0b2dnbGVCdXR0b24oZSkge1xuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYXYpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAkY29udGV4dC50b2dnbGUoZSk7XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIG5hdn1cbiAgPGFcbiAgICB7Li4ucHJvcHN9XG4gICAgb246Y2xpY2tcbiAgICBvbjpjbGljaz17dG9nZ2xlQnV0dG9ufVxuICAgIGhyZWY9XCIjbmF2XCJcbiAgICB7YXJpYUhhc3BvcHVwfVxuICAgIGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdD5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPnthcmlhTGFiZWx9PC9zcGFuPlxuICAgIDwvc2xvdD5cbiAgPC9hPlxuezplbHNlIGlmIHRhZyA9PT0gJ3NwYW4nfVxuICA8c3BhblxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAge2FyaWFIYXNwb3B1cH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7Y29sb3J9XG4gICAge3NpemV9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L3NwYW4+XG57OmVsc2V9XG4gIDxCdXR0b25cbiAgICB7Li4ucHJvcHN9XG4gICAgb246Y2xpY2tcbiAgICBvbjpjbGljaz17dG9nZ2xlQnV0dG9ufVxuICAgIHthcmlhSGFzcG9wdXB9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAge2NvbG9yfVxuICAgIHtzaXplfVxuICAgIHtvdXRsaW5lfT5cbiAgICA8c2xvdD5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPnthcmlhTGFiZWx9PC9zcGFuPlxuICAgIDwvc2xvdD5cbiAgPC9CdXR0b24+XG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnKTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IHJpZ2h0ID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICdkcm9wZG93bi1tZW51Jywge1xuICAgICdkcm9wZG93bi1tZW51LXJpZ2h0JzogcmlnaHQsXG4gICAgc2hvdzogJGNvbnRleHQuaXNPcGVuXG4gIH0pO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgnZHJvcGRvd25Db250ZXh0Jyk7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcblxuICBleHBvcnQgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGl2aWRlciA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGhlYWRlciA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHRvZ2dsZSA9IHRydWU7XG4gIGV4cG9ydCBsZXQgaHJlZiA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCB7XG4gICAgZGlzYWJsZWQsXG4gICAgJ2Ryb3Bkb3duLWl0ZW0nOiAhZGl2aWRlciAmJiAhaGVhZGVyLFxuICAgIGFjdGl2ZTogYWN0aXZlLFxuICAgICdkcm9wZG93bi1oZWFkZXInOiBoZWFkZXIsXG4gICAgJ2Ryb3Bkb3duLWRpdmlkZXInOiBkaXZpZGVyXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUl0ZW1DbGljayhlKSB7XG4gICAgaWYgKGRpc2FibGVkIHx8IGhlYWRlciB8fCBkaXZpZGVyKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgJGNvbnRleHQudG9nZ2xlKGUpO1xuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgaGVhZGVyfVxuICA8aDYgey4uLnByb3BzfSBvbjpjbGljayBvbjpjbGljaz17aGFuZGxlSXRlbUNsaWNrfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9oNj5cblxuezplbHNlIGlmIGRpdmlkZXJ9XG4gIDxkaXYgey4uLnByb3BzfSBvbjpjbGljayBvbjpjbGljaz17aGFuZGxlSXRlbUNsaWNrfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57OmVsc2UgaWYgaHJlZn1cbiAgPGEgb246ey4uLnByb3BzfSBjbGljayBvbjpjbGljaz17aGFuZGxlSXRlbUNsaWNrfSB7aHJlZn0gY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90IC8+XG4gIDwvYT5cbns6ZWxzZX1cbiAgPGJ1dHRvbiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGZsdXNoID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgJ2xpc3QtZ3JvdXAnLFxuICAgIGZsdXNoID8gJ2xpc3QtZ3JvdXAtZmx1c2gnIDogZmFsc2VcbiAgKTtcbjwvc2NyaXB0PlxuXG48dWwgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L3VsPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBpbmxpbmUgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgaW5saW5lID8gJ2Zvcm0taW5saW5lJyA6IGZhbHNlKTtcbjwvc2NyaXB0PlxuXG48Zm9ybSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZm9ybT5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgICdpbnB1dC1ncm91cCcsXG4gICAgc2l6ZSA/IGBpbnB1dC1ncm91cC0ke3NpemV9YCA6IG51bGxcbiAgKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9kaXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGFkZG9uVHlwZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGlmIChbJ3ByZXBlbmQnLCAnYXBwZW5kJ10uaW5kZXhPZihhZGRvblR5cGUpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBhZGRvblR5cGUgbXVzdCBiZSBvbmUgb2YgJ3ByZXBlbmQnLCAnYXBwZW5kJy4gUmVjZWl2ZWQgJyR7YWRkb25UeXBlfScgaW5zdGVhZC5gXG4gICAgKTtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgYGlucHV0LWdyb3VwLSR7YWRkb25UeXBlfWApO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGltcG9ydCB7IGdldENvbHVtblNpemVDbGFzcywgaXNPYmplY3QgfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBoaWRkZW4gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjaGVjayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCBmb3JlO1xuICBleHBvcnQgeyBmb3JlIGFzIGZvciB9O1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgeHMgPSAnJztcbiAgZXhwb3J0IGxldCBzbSA9ICcnO1xuICBleHBvcnQgbGV0IG1kID0gJyc7XG4gIGV4cG9ydCBsZXQgbGcgPSAnJztcbiAgZXhwb3J0IGxldCB4bCA9ICcnO1xuXG4gIGNvbnN0IGNvbFdpZHRocyA9IHtcbiAgICB4cyxcbiAgICBzbSxcbiAgICBtZCxcbiAgICBsZyxcbiAgICB4bFxuICB9O1xuICBleHBvcnQgbGV0IHdpZHRocyA9IE9iamVjdC5rZXlzKGNvbFdpZHRocyk7XG5cbiAgY29uc3QgY29sQ2xhc3NlcyA9IFtdO1xuXG4gIHdpZHRocy5mb3JFYWNoKGNvbFdpZHRoID0+IHtcbiAgICBsZXQgY29sdW1uUHJvcCA9ICQkcHJvcHNbY29sV2lkdGhdO1xuXG4gICAgaWYgKCFjb2x1bW5Qcm9wICYmIGNvbHVtblByb3AgIT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNYcyA9IGNvbFdpZHRoID09PSAneHMnO1xuICAgIGxldCBjb2xDbGFzcztcblxuICAgIGlmIChpc09iamVjdChjb2x1bW5Qcm9wKSkge1xuICAgICAgY29uc3QgY29sU2l6ZUludGVyZml4ID0gaXNYcyA/ICctJyA6IGAtJHtjb2xXaWR0aH0tYDtcbiAgICAgIGNvbENsYXNzID0gZ2V0Q29sdW1uU2l6ZUNsYXNzKGlzWHMsIGNvbFdpZHRoLCBjb2x1bW5Qcm9wLnNpemUpO1xuXG4gICAgICBjb2xDbGFzc2VzLnB1c2goXG4gICAgICAgIGNsc3goe1xuICAgICAgICAgIFtjb2xDbGFzc106IGNvbHVtblByb3Auc2l6ZSB8fCBjb2x1bW5Qcm9wLnNpemUgPT09ICcnLFxuICAgICAgICAgIFtgb3JkZXIke2NvbFNpemVJbnRlcmZpeH0ke2NvbHVtblByb3Aub3JkZXJ9YF06XG4gICAgICAgICAgICBjb2x1bW5Qcm9wLm9yZGVyIHx8IGNvbHVtblByb3Aub3JkZXIgPT09IDAsXG4gICAgICAgICAgW2BvZmZzZXQke2NvbFNpemVJbnRlcmZpeH0ke2NvbHVtblByb3Aub2Zmc2V0fWBdOlxuICAgICAgICAgICAgY29sdW1uUHJvcC5vZmZzZXQgfHwgY29sdW1uUHJvcC5vZmZzZXQgPT09IDBcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbENsYXNzID0gZ2V0Q29sdW1uU2l6ZUNsYXNzKGlzWHMsIGNvbFdpZHRoLCBjb2x1bW5Qcm9wKTtcbiAgICAgIGNvbENsYXNzZXMucHVzaChjb2xDbGFzcyk7XG4gICAgfVxuICB9KTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgaGlkZGVuID8gJ3NyLW9ubHknIDogZmFsc2UsXG4gICAgY2hlY2sgPyAnZm9ybS1jaGVjay1sYWJlbCcgOiBmYWxzZSxcbiAgICBzaXplID8gYGNvbC1mb3JtLWxhYmVsLSR7c2l6ZX1gIDogZmFsc2UsXG4gICAgY29sQ2xhc3NlcyxcbiAgICBjb2xDbGFzc2VzLmxlbmd0aCA/ICdjb2wtZm9ybS1sYWJlbCcgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbjxsYWJlbCB7Li4ucHJvcHN9IHtpZH0gY2xhc3M9e2NsYXNzZXN9IGZvcj17Zm9yZX0+XG4gIDxzbG90IC8+XG48L2xhYmVsPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcblxuICBleHBvcnQgbGV0IHR5cGUgPSAndGV4dCc7XG4gIGV4cG9ydCBsZXQgc2l6ZSA9IHVuZGVmaW5lZDtcbiAgZXhwb3J0IGxldCBic1NpemUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgY2hlY2tlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZhbGlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaW52YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHBsYWludGV4dCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFkZG9uID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmFsdWUgPSAnJztcbiAgZXhwb3J0IGxldCBmaWxlcyA9ICcnO1xuICBleHBvcnQgbGV0IHJlYWRvbmx5O1xuICBleHBvcnQgbGV0IG11bHRpcGxlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCBuYW1lID0gJyc7XG4gIGV4cG9ydCBsZXQgcGxhY2Vob2xkZXIgPSAnJztcbiAgZXhwb3J0IGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBjb25zdCB7IHR5cGU6IF9vbWl0VHlwZSwgLi4ucHJvcHMgfSA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGxldCBjbGFzc2VzO1xuICBsZXQgdGFnO1xuICAkOiB7XG4gICAgY29uc3QgY2hlY2tJbnB1dCA9IFsncmFkaW8nLCAnY2hlY2tib3gnXS5pbmRleE9mKHR5cGUpID4gLTE7XG4gICAgY29uc3QgaXNOb3RhTnVtYmVyID0gbmV3IFJlZ0V4cCgnXFxcXEQnLCAnZycpO1xuXG4gICAgY29uc3QgZmlsZUlucHV0ID0gdHlwZSA9PT0gJ2ZpbGUnO1xuICAgIGNvbnN0IHRleHRhcmVhSW5wdXQgPSB0eXBlID09PSAndGV4dGFyZWEnO1xuICAgIGNvbnN0IHNlbGVjdElucHV0ID0gdHlwZSA9PT0gJ3NlbGVjdCc7XG4gICAgdGFnID0gc2VsZWN0SW5wdXQgfHwgdGV4dGFyZWFJbnB1dCA/IHR5cGUgOiAnaW5wdXQnO1xuXG4gICAgbGV0IGZvcm1Db250cm9sQ2xhc3MgPSAnZm9ybS1jb250cm9sJztcblxuICAgIGlmIChwbGFpbnRleHQpIHtcbiAgICAgIGZvcm1Db250cm9sQ2xhc3MgPSBgJHtmb3JtQ29udHJvbENsYXNzfS1wbGFpbnRleHRgO1xuICAgICAgdGFnID0gJ2lucHV0JztcbiAgICB9IGVsc2UgaWYgKGZpbGVJbnB1dCkge1xuICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9IGAke2Zvcm1Db250cm9sQ2xhc3N9LWZpbGVgO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tJbnB1dCkge1xuICAgICAgaWYgKGFkZG9uKSB7XG4gICAgICAgIGZvcm1Db250cm9sQ2xhc3MgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9ICdmb3JtLWNoZWNrLWlucHV0JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2l6ZSAmJiBpc05vdGFOdW1iZXIudGVzdChzaXplKSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnUGxlYXNlIHVzZSB0aGUgcHJvcCBcImJzU2l6ZVwiIGluc3RlYWQgb2YgdGhlIFwic2l6ZVwiIHRvIGJvb3RzdHJhcFxcJ3MgaW5wdXQgc2l6aW5nLidcbiAgICAgICk7XG4gICAgICBic1NpemUgPSBzaXplO1xuICAgICAgc2l6ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjbGFzc2VzID0gY2xzeChcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGludmFsaWQgJiYgJ2lzLWludmFsaWQnLFxuICAgICAgdmFsaWQgJiYgJ2lzLXZhbGlkJyxcbiAgICAgIGJzU2l6ZSA/IGBmb3JtLWNvbnRyb2wtJHtic1NpemV9YCA6IGZhbHNlLFxuICAgICAgZm9ybUNvbnRyb2xDbGFzc1xuICAgICk7XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIHRhZyA9PT0gJ2lucHV0J31cbiAgeyNpZiB0eXBlID09PSAndGV4dCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwidGV4dFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ3Bhc3N3b3JkJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2VtYWlsJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2ZpbGUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDpmaWxlc1xuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdjaGVja2JveCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDpjaGVja2VkXG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ3JhZGlvJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ3VybCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwidXJsXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnbnVtYmVyJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdkYXRlJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJkYXRlXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAndGltZSd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwidGltZVwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2RhdGV0aW1lJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJkYXRldGltZVwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2NvbG9yJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJjb2xvclwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ3NlYXJjaCd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwic2VhcmNoXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHsvaWZ9XG5cbns6ZWxzZSBpZiB0YWcgPT09ICd0ZXh0YXJlYSd9XG4gIDx0ZXh0YXJlYVxuICAgIHsuLi5wcm9wc31cbiAgICB7aWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgb246Ymx1clxuICAgIG9uOmZvY3VzXG4gICAgb246a2V5ZG93blxuICAgIG9uOmtleXByZXNzXG4gICAgb246a2V5dXBcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIGJpbmQ6dmFsdWVcbiAgICB7bmFtZX1cbiAgICB7ZGlzYWJsZWR9IC8+XG5cbns6ZWxzZSBpZiB0YWcgPT09ICdzZWxlY3QnfVxuICA8c2VsZWN0XG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICB7bXVsdGlwbGV9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgb246Ymx1clxuICAgIG9uOmZvY3VzXG4gICAgb246Y2hhbmdlXG4gICAgb246aW5wdXRcbiAgICB7bmFtZX1cbiAgICB7ZGlzYWJsZWR9PlxuICAgIDxzbG90IC8+XG4gIDwvc2VsZWN0PlxuXG57L2lmfVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBuYW1lID0gJyc7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCB0eXBlO1xuICBleHBvcnQgbGV0IGxhYmVsID0gJyc7XG4gIGV4cG9ydCBsZXQgY2hlY2tlZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaW5saW5lID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmFsaWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnO1xuICBleHBvcnQgbGV0IGludmFsaWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBic1NpemUgPSAnJztcbiAgZXhwb3J0IGxldCBwbGFjZWhvbGRlciA9ICcnO1xuICBleHBvcnQgbGV0IGh0bWxGb3IgPSAnJztcbiAgZXhwb3J0IHsgaHRtbEZvciBhcyBmb3IgfTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgY29uc3QgeyB0eXBlOiBfb21pdFR5cGUsIC4uLnByb3BzIH0gPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjdXN0b21DbGFzcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIGBjdXN0b20tJHt0eXBlfWAsXG4gICAgYnNTaXplID8gYGN1c3RvbS0ke3R5cGV9LSR7YnNTaXplfWAgOiBmYWxzZVxuICApO1xuXG4gICQ6IHZhbGlkYXRpb25DbGFzc05hbWVzID0gY2xzeChpbnZhbGlkICYmICdpcy1pbnZhbGlkJywgdmFsaWQgJiYgJ2lzLXZhbGlkJyk7XG5cbiAgJDogY29tYmluZWRDbGFzc2VzID0gY2xzeChjdXN0b21DbGFzcywgdmFsaWRhdGlvbkNsYXNzTmFtZXMpO1xuXG4gICQ6IGZpbGVDbGFzc2VzID0gY2xzeCh2YWxpZGF0aW9uQ2xhc3NOYW1lcywgJ2N1c3RvbS1maWxlLWlucHV0Jyk7XG5cbiAgJDogd3JhcHBlckNsYXNzZXMgPSBjbHN4KGN1c3RvbUNsYXNzLCAnY3VzdG9tLWNvbnRyb2wnLCB7XG4gICAgJ2N1c3RvbS1jb250cm9sLWlubGluZSc6IGlubGluZVxuICB9KTtcblxuICAkOiBjdXN0b21Db250cm9sQ2xhc3NlcyA9IGNsc3godmFsaWRhdGlvbkNsYXNzTmFtZXMsICdjdXN0b20tY29udHJvbC1pbnB1dCcpO1xuXG4gICQ6IGxhYmVsSHRtbEZvciA9IGh0bWxGb3IgfHwgaWQ7XG48L3NjcmlwdD5cblxueyNpZiB0eXBlID09PSAnc2VsZWN0J31cbiAgPHNlbGVjdFxuICAgIHtpZH1cbiAgICBjbGFzcz17Y29tYmluZWRDbGFzc2VzfVxuICAgIG9uOmJsdXJcbiAgICBvbjpmb2N1c1xuICAgIG9uOmNoYW5nZVxuICAgIG9uOmlucHV0XG4gICAgYmluZDp2YWx1ZVxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH1cbiAgICB7cGxhY2Vob2xkZXJ9XG4gICAgey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L3NlbGVjdD5cbns6ZWxzZSBpZiB0eXBlID09PSAnZmlsZSd9XG4gIDxkaXYgY2xhc3M9e2N1c3RvbUNsYXNzfT5cbiAgICA8aW5wdXRcbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgIGNsYXNzPXtmaWxlQ2xhc3Nlc31cbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn1cbiAgICAgIHsuLi5wcm9wc30gLz5cbiAgICA8bGFiZWwgY2xhc3M9XCJjdXN0b20tZmlsZS1sYWJlbFwiIGZvcj17bGFiZWxIdG1sRm9yfT5cbiAgICAgIHtsYWJlbCB8fCAnQ2hvb3NlIGZpbGUnfVxuICAgIDwvbGFiZWw+XG4gIDwvZGl2PlxuezplbHNlIGlmIHR5cGUgPT09ICdzd2l0Y2gnIHx8IHR5cGUgPT09ICdjaGVja2JveCd9XG4gIDxkaXYgY2xhc3M9e3dyYXBwZXJDbGFzc2VzfT5cbiAgICA8aW5wdXRcbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICBjbGFzcz17Y3VzdG9tQ29udHJvbENsYXNzZXN9XG4gICAgICBiaW5kOmNoZWNrZWRcbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgey4uLnByb3BzfSAvPlxuICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1jb250cm9sLWxhYmVsXCIgZm9yPXtsYWJlbEh0bWxGb3J9PntsYWJlbH08L2xhYmVsPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuezplbHNlIGlmIHR5cGUgPT09ICdyYWRpbyd9XG4gIDxkaXYgY2xhc3M9e3dyYXBwZXJDbGFzc2VzfT5cbiAgICA8aW5wdXRcbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICBjbGFzcz17Y3VzdG9tQ29udHJvbENsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn1cbiAgICAgIHsuLi5wcm9wc30gLz5cbiAgICA8bGFiZWwgY2xhc3M9XCJjdXN0b20tY29udHJvbC1sYWJlbFwiIGZvcj17bGFiZWxIdG1sRm9yfT57bGFiZWx9PC9sYWJlbD5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbns6ZWxzZX1cbiAgPGlucHV0XG4gICAge3R5cGV9XG4gICAge2lkfVxuICAgIGNsYXNzPXtjb21iaW5lZENsYXNzZXN9XG4gICAgb246Ymx1clxuICAgIG9uOmZvY3VzXG4gICAgb246Y2hhbmdlXG4gICAgb246aW5wdXRcbiAgICB7bmFtZX1cbiAgICB7ZGlzYWJsZWR9XG4gICAge3BsYWNlaG9sZGVyfVxuICAgIHsuLi5wcm9wc30gLz5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCBOYXZiYXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhckJyYW5kIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2YmFyQnJhbmQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdmJhclRvZ2dsZXIgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXJUb2dnbGVyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXYgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXYuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZJdGVtLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBOYXZMaW5rIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2TGluay5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ29sbGFwc2UgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Db2xsYXBzZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgVW5jb250cm9sbGVkRHJvcGRvd24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9VbmNvbnRyb2xsZWREcm9wZG93bi5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25Ub2dnbGUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93blRvZ2dsZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgRHJvcGRvd25NZW51IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25NZW51LnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBEcm9wZG93bkl0ZW0gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExpc3RHcm91cCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0xpc3RHcm91cC5zdmVsdGVcIjtcclxuICBpbXBvcnQgRm9ybSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Zvcm0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0R3JvdXAgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBJbnB1dEdyb3VwQWRkb24gZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dEdyb3VwQWRkb24uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IExhYmVsIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTGFiZWwuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEN1c3RvbUlucHV0IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ3VzdG9tSW5wdXQuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IEJ1dHRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0J1dHRvbi5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBjb2xvcjtcclxuICBleHBvcnQgbGV0IHRpdGxlO1xyXG5cclxuICBmdW5jdGlvbiBzZWFyY2hIYW5kbGUoKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48TmF2YmFyIGNsYXNzPVwibC1wcm90b24tdG9wbmF2IG5hdmJhci1leHBhbmRcIiB7Y29sb3J9IGRhcmsgZXhwYW5kPVwibWRcIj5cclxuICA8TmF2YmFyQnJhbmQgaHJlZj1cIi5cIj48c3BhbiBjbGFzcz1cImwtbG9nby1zcGFuXCI+zrs8L3NwYW4+e3RpdGxlfTwvTmF2YmFyQnJhbmQ+XHJcbiAgPE5hdiBjbGFzcz1cIm1sLWF1dG9cIiBuYXZiYXI+XHJcbiAgICA8Rm9ybSBpbmxpbmU+XHJcbiAgICAgIDxJbnB1dEdyb3VwPlxyXG4gICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBuYW1lPVwic2VhcmNoXCJcclxuICAgICAgICAgIGlkPVwiZXhhbXBsZVNlYXJjaFwiXHJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cItCY0YHQutCw0YLRjC4uXCIgLz5cclxuICAgICAgICA8SW5wdXRHcm91cEFkZG9uIGFkZG9uVHlwZT17J2FwcGVuZCd9PlxyXG4gICAgICAgICAgPEJ1dHRvbiBjb2xvcj1cInByaW1hcnlcIiBvbjpjbGljaz17c2VhcmNoSGFuZGxlfT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCIgLz5cclxuICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgIDwvSW5wdXRHcm91cEFkZG9uPlxyXG4gICAgICA8L0lucHV0R3JvdXA+XHJcbiAgICA8L0Zvcm0+XHJcbiAgICA8TGlzdEdyb3VwIGNsYXNzPVwibWwtYXV0byBtbC1tZC0wXCI+XHJcbiAgICAgIDxVbmNvbnRyb2xsZWREcm9wZG93biBuYXYgaW5OYXZiYXI+XHJcbiAgICAgICAgPERyb3Bkb3duVG9nZ2xlIG5hdiBjYXJldD5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXVzZXItY2lyY2xlIGZhLWZ3IG1sLTNcIiAvPlxyXG4gICAgICAgIDwvRHJvcGRvd25Ub2dnbGU+XHJcbiAgICAgICAgPERyb3Bkb3duTWVudSByaWdodD5cclxuICAgICAgICAgIDxEcm9wZG93bkl0ZW0+ICAgICAgICAgXHJcbiAgICAgXHJcbiAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwic2V0dGluZ3NcIj48aSBjbGFzcz1cImZhcyBmYS1jb2dcIiAvPiDQndCw0YHRgtGA0L7QudC60Lg8L2E+XHJcbiAgICAgICAgICA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgIDxEcm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCJhY3Rpdml0eV9sb2dcIj48aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmQtbGlzdFwiPjwvaT4g0JDQutGC0LjQstC90L7RgdGC0Yw8L2E+XHJcbiAgICAgICAgICA8L0Ryb3Bkb3duSXRlbT5cclxuICAgICAgICAgIDxEcm9wZG93bkl0ZW0gZGl2aWRlciAvPlxyXG4gICAgICAgICAgPERyb3Bkb3duSXRlbT5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL2xvZ2luXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNpZ24tb3V0LWFsdFwiPjwvaT4gINCS0YvQudGC0LhcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgPC9Ecm9wZG93bk1lbnU+XHJcbiAgICAgIDwvVW5jb250cm9sbGVkRHJvcGRvd24+XHJcbiAgICA8L0xpc3RHcm91cD5cclxuICA8L05hdj5cclxuPC9OYXZiYXI+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG5cclxuICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xyXG5cclxuICBleHBvcnQgbGV0IHRleHQgPSBcIlwiO1xyXG4gIGV4cG9ydCBsZXQgaHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCI7XHJcbiAgZXhwb3J0IGxldCBsZWZ0SWNvbiA9IGZhbHNlO1xyXG4gIGV4cG9ydCBsZXQgcmlnaHRJY29uID0gZmFsc2U7XHJcblxyXG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xyXG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xyXG4gIGNvbnN0IGhhbmRsZUNsaWNrID0gKCkgPT4ge1xyXG4gICAgZGlzcGF0Y2goXCJwcmVzc1wiKTtcclxuICB9O1xyXG48L3NjcmlwdD5cclxuXHJcbjxhIGNsYXNzPVwibmF2LWxpbmsge2NsYXNzTmFtZX1cIiB7aHJlZn0gb246Y2xpY2s9e2hhbmRsZUNsaWNrfT5cclxuICB7I2lmIGxlZnRJY29ufVxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLW5hdi1saW5rLWljb25cIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImxlZnRJY29uXCIgLz5cclxuICAgIDwvZGl2PlxyXG4gIHsvaWZ9XHJcbiAge3RleHR9XHJcbiAgeyNpZiByaWdodEljb259XHJcbiAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1jb2xsYXBzZS1hcnJvd1wiPlxyXG4gICAgICA8c2xvdCBuYW1lPVwicmlnaHRJY29uXCIgLz5cclxuICAgIDwvZGl2PlxyXG4gIHsvaWZ9XHJcbjwvYT5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgQ29sbGFwc2UgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Db2xsYXBzZS5zdmVsdGVcIjtcclxuICBpbXBvcnQgTmF2IGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTmF2LnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgU2lkZWJhckl0ZW0gZnJvbSBcIi4vU2lkZWJhckl0ZW0uc3ZlbHRlXCI7XHJcblxyXG4gIGV4cG9ydCBsZXQgc2VnbWVudDtcclxuICBleHBvcnQgbGV0IHRoZW1lO1xyXG5cclxuICAkOiBzaWRlbmF2X3RoZW1lID0gYGwtcHJvdG9uLXNpZGVuYXYtJHt0aGVtZX1gO1xyXG5cclxuICBsZXQgaXNMYXlvdXRPcGVuID0gdHJ1ZTtcclxuICBsZXQgaXNQYWdlT3BlbiA9IHRydWU7XHJcbiAgbGV0IGlzQXV0aGVudGljYXRpb25PcGVuID0gdHJ1ZTtcclxuICBsZXQgaXNFcnJvck9wZW4gPSBmYWxzZTtcclxuICBsZXQgYWN0aXZlTGluayA9IFwi0J/QsNC90LXQu9GMXCI7XHJcbiAgbGV0IGZvb3Rlck5hbWUgPSBcIs67cHJvdG9uIGJveVwiO1xyXG4gIGxldCBmb290ZXJUZXh0ID0gXCLQktGLINCy0L7RiNC70Lgg0LrQsNC6OlwiO1xyXG5cclxuICBjb25zdCB1cGRhdGVBY3RpdmVMaW5rID0gbGlua05hbWUgPT4gKGFjdGl2ZUxpbmsgPSBsaW5rTmFtZSk7XHJcblxyXG4gIGNvbnN0IHRvZ2dsZUxheW91dCA9ICgpID0+IHtcclxuICAgIGlzTGF5b3V0T3BlbiA9ICFpc0xheW91dE9wZW47XHJcbiAgICBpZiAoaXNQYWdlT3BlbiA9PT0gdHJ1ZSkgaXNQYWdlT3BlbiA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHRvZ2dsZVBhZ2VzID0gKCkgPT4ge1xyXG4gICAgaXNQYWdlT3BlbiA9ICFpc1BhZ2VPcGVuO1xyXG4gICAgaWYgKGlzTGF5b3V0T3BlbiA9PT0gdHJ1ZSkgaXNMYXlvdXRPcGVuID0gZmFsc2U7XHJcbiAgICBpZiAoaXNQYWdlT3BlbiA9PT0gZmFsc2UpIHtcclxuICAgICAgaXNBdXRoZW50aWNhdGlvbk9wZW4gPSBmYWxzZTtcclxuICAgICAgaXNFcnJvck9wZW4gPSBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCB0b2dnbGVBdXRoZW50aWNhdGlvbiA9ICgpID0+IHtcclxuICAgIGlzQXV0aGVudGljYXRpb25PcGVuID0gIWlzQXV0aGVudGljYXRpb25PcGVuO1xyXG4gICAgaWYgKGlzRXJyb3JPcGVuID09PSB0cnVlKSBpc0Vycm9yT3BlbiA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHRvZ2dsZUVycm9yID0gKCkgPT4ge1xyXG4gICAgaXNFcnJvck9wZW4gPSAhaXNFcnJvck9wZW47XHJcbiAgICBpZiAoaXNBdXRoZW50aWNhdGlvbk9wZW4gPT09IHRydWUpIGlzQXV0aGVudGljYXRpb25PcGVuID0gZmFsc2U7XHJcbiAgfTtcclxuPC9zY3JpcHQ+XHJcblxyXG48ZGl2IGlkPVwibGF5b3V0U2lkZW5hdl9uYXZcIiBjbGFzcz1cImwtcHJvdG9uLW5hdi1maXhlZFwiPlxyXG4gIDxOYXZcclxuICAgIGNsYXNzPVwibC1wcm90b24tc2lkZW5hdiB7c2lkZW5hdl90aGVtZX0gYWNjb3JkaW9uIGwtcHJvdG9uLW5hdi1maXhlZFwiXHJcbiAgICBpZD1cInNpZGVuYXZBY2NvcmRpb25cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnVcIj5cclxuICAgICAgPE5hdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LWhlYWRpbmdcIj7Qr9C00YDQvjwvZGl2PlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgb246cHJlc3M9eygpID0+IHtcclxuICAgICAgICAgICAgdGhlbWUgPSAnZGFyayc7XHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgdGV4dD1cIkRhc2hib2FyZFwiXHJcbiAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJy4nIHx8IHNlZ21lbnQgPT09IHVuZGVmaW5lZCA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICBsZWZ0SWNvblxyXG4gICAgICAgICAgaHJlZj1cIi5cIj5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWF0b21cIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1oZWFkaW5nXCI+0JjQvdGC0LXRgNGE0LXQudGBPC9kaXY+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBvbjpwcmVzcz17dG9nZ2xlTGF5b3V0fVxyXG4gICAgICAgICAgY2xhc3M9eyFpc0xheW91dE9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgdGV4dD1cIkxheW91dHNcIlxyXG4gICAgICAgICAgbGVmdEljb25cclxuICAgICAgICAgIHJpZ2h0SWNvbj5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNvbHVtbnNcIiBzbG90PVwibGVmdEljb25cIiAvPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgPENvbGxhcHNlIGlzT3Blbj17aXNMYXlvdXRPcGVufT5cclxuICAgICAgICAgIDxOYXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtbmVzdGVkXCI+XHJcbiAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUxpbmsoJ1N0YXRpYyBOYXZpZ2F0aW9uJyk7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJ2xheW91dHMnICYmIGFjdGl2ZUxpbmsgPT09ICdTdGF0aWMgTmF2aWdhdGlvbicgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgICAgIGhyZWY9XCJsYXlvdXRzL3N0YXRpY19uYXZpZ2F0aW9uXCJcclxuICAgICAgICAgICAgICB0ZXh0PVwiU3RhdGljIE5hdmlnYXRpb25cIiAvPlxyXG4gICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhlbWUgPSAnbGlnaHQnO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQWN0aXZlTGluaygnTGlnaHQgU2lkZW5hdicpO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICdsYXlvdXRzJyAmJiBhY3RpdmVMaW5rID09PSAnTGlnaHQgU2lkZW5hdicgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgICAgIGhyZWY9XCJsYXlvdXRzL2xpZ2h0X3NpZGVuYXZcIlxyXG4gICAgICAgICAgICAgIHRleHQ9XCJMaWdodCBTaWRlbmF2XCIgLz5cclxuICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgIDwvQ29sbGFwc2U+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBvbjpwcmVzcz17dG9nZ2xlUGFnZXN9XHJcbiAgICAgICAgICBjbGFzcz17IWlzUGFnZU9wZW4gPyAnY29sbGFwc2VkJyA6ICcnfVxyXG4gICAgICAgICAgdGV4dD1cItCh0YLRgNCw0L3QuNGG0YtcIlxyXG4gICAgICAgICAgbGVmdEljb25cclxuICAgICAgICAgIHJpZ2h0SWNvbj5cclxuICAgICAgICAgIDxzdmdcclxuICAgICAgICAgICAgc2xvdD1cImxlZnRJY29uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCJzdmctaW5saW5lLS1mYSBmYS1ib29rLW9wZW4gZmEtdy0xOFwiXHJcbiAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcclxuICAgICAgICAgICAgZGF0YS1wcmVmaXg9XCJmYXNcIlxyXG4gICAgICAgICAgICBkYXRhLWljb249XCJib29rLW9wZW5cIlxyXG4gICAgICAgICAgICByb2xlPVwiaW1nXCJcclxuICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgNTc2IDUxMlwiXHJcbiAgICAgICAgICAgIGRhdGEtZmEtaTJzdmc9XCJcIj5cclxuICAgICAgICAgICAgPHBhdGhcclxuICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICAgICAgICBkPVwiTTU0Mi4yMiAzMi4wNWMtNTQuOCAzLjExLTE2My43MiAxNC40My0yMzAuOTYgNTUuNTktNC42NFxyXG4gICAgICAgICAgICAgIDIuODQtNy4yNyA3Ljg5LTcuMjcgMTMuMTd2MzYzLjg3YzAgMTEuNTUgMTIuNjMgMTguODUgMjMuMjggMTMuNDlcclxuICAgICAgICAgICAgICA2OS4xOC0zNC44MiAxNjkuMjMtNDQuMzIgMjE4LjctNDYuOTIgMTYuODktLjg5IDMwLjAyLTE0LjQzXHJcbiAgICAgICAgICAgICAgMzAuMDItMzAuNjZWNjIuNzVjLjAxLTE3LjcxLTE1LjM1LTMxLjc0LTMzLjc3LTMwLjd6TTI2NC43M1xyXG4gICAgICAgICAgICAgIDg3LjY0QzE5Ny41IDQ2LjQ4IDg4LjU4IDM1LjE3IDMzLjc4IDMyLjA1IDE1LjM2IDMxLjAxIDAgNDUuMDQgMFxyXG4gICAgICAgICAgICAgIDYyLjc1VjQwMC42YzAgMTYuMjQgMTMuMTMgMjkuNzggMzAuMDIgMzAuNjYgNDkuNDkgMi42IDE0OS41OSAxMi4xMVxyXG4gICAgICAgICAgICAgIDIxOC43NyA0Ni45NSAxMC42MiA1LjM1IDIzLjIxLTEuOTRcclxuICAgICAgICAgICAgICAyMy4yMS0xMy40NlYxMDAuNjNjMC01LjI5LTIuNjItMTAuMTQtNy4yNy0xMi45OXpcIiAvPlxyXG4gICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hbmdsZS1kb3duXCIgc2xvdD1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc1BhZ2VPcGVufT5cclxuICAgICAgICAgIDxOYXZcclxuICAgICAgICAgICAgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtbmVzdGVkIGFjY29yZGlvblwiXHJcbiAgICAgICAgICAgIGlkPVwic2lkZW5hdkFjY29yZGlvblBhZ2VzXCI+XHJcbiAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVBdXRoZW50aWNhdGlvbn1cclxuICAgICAgICAgICAgICBjbGFzcz17IWlzQXV0aGVudGljYXRpb25PcGVuID8gJ2NvbGxhcHNlZCcgOiAnJ31cclxuICAgICAgICAgICAgICB0ZXh0PVwiQXV0aGVudGljYXRpb25cIlxyXG4gICAgICAgICAgICAgIHJpZ2h0SWNvbj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hbmdsZS1kb3duXCIgc2xvdD1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICAgICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzQXV0aGVudGljYXRpb25PcGVufT5cclxuICAgICAgICAgICAgICA8TmF2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LW5lc3RlZFwiPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9hdXRoZW50aWNhdGlvbi9sb2dpblwiIHRleHQ9XCJMb2dpblwiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICAgICAgaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL3JlZ2lzdGVyXCJcclxuICAgICAgICAgICAgICAgICAgdGV4dD1cIlJlZ2lzdGVyXCIgLz5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgICAgICBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkXCJcclxuICAgICAgICAgICAgICAgICAgdGV4dD1cIkZvcmdvdCBQYXNzd29yZFwiIC8+XHJcbiAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgIDwvQ29sbGFwc2U+XHJcbiAgICAgICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgICAgIG9uOnByZXNzPXt0b2dnbGVFcnJvcn1cclxuICAgICAgICAgICAgICBjbGFzcz17IWlzRXJyb3JPcGVuID8gJ2NvbGxhcHNlZCcgOiAnJ31cclxuICAgICAgICAgICAgICB0ZXh0PVwiRXJyb3JcIlxyXG4gICAgICAgICAgICAgIHJpZ2h0SWNvbj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hbmdsZS1kb3duXCIgc2xvdD1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICAgICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzRXJyb3JPcGVufT5cclxuICAgICAgICAgICAgICA8TmF2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LW5lc3RlZFwiPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl80MDFcIiB0ZXh0PVwiNDAxIFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl80MDRcIiB0ZXh0PVwiNDA0IFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtIGhyZWY9XCJwYWdlcy9lcnJvci9lcnJvcl81MDBcIiB0ZXh0PVwiNTAwIFBhZ2VcIiAvPlxyXG4gICAgICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LWhlYWRpbmdcIj7QkNC00LTQvtC90Ysg0Lgg0L/RgNC40LzQtdGB0Lg8L2Rpdj5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnY2hhcnRzJyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICBocmVmPVwiY2hhcnRzXCJcclxuICAgICAgICAgIHRleHQ9XCJDaGFydHNcIlxyXG4gICAgICAgICAgbGVmdEljb24+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1hcmVhXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICd0YWJsZXMnID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoZW1lID0gJ2RhcmsnO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIGhyZWY9XCJ0YWJsZXNcIlxyXG4gICAgICAgICAgdGV4dD1cIlRhYmxlc1wiXHJcbiAgICAgICAgICBsZWZ0SWNvbj5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRhYmxlXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICA8L05hdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtZm9vdGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJzbWFsbFwiPntmb290ZXJUZXh0fTwvZGl2PlxyXG4gICAgICB7Zm9vdGVyTmFtZX1cclxuICAgIDwvZGl2PlxyXG4gIDwvTmF2PlxyXG48L2Rpdj5cclxuIiwiPHNjcmlwdD5cclxuICBpbXBvcnQgQ29udGFpbmVyIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ29udGFpbmVyLnN2ZWx0ZVwiO1xyXG5cclxuICBpbXBvcnQgTmF2YmFyIGZyb20gXCIuLi9jb21wb25lbnRzL05hdmJhci5zdmVsdGVcIjtcclxuICBpbXBvcnQgU2lkZWJhciBmcm9tIFwiLi4vY29tcG9uZW50cy9TaWRlYmFyLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBGb290ZXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvRm9vdGVyLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcblxyXG4gIGxldCB0aGVtZSA9IFwiZGFya1wiO1xyXG4gIGxldCBjb2xvciA9IFwiZGFya1wiO1xyXG4gIGxldCB0aXRsZSA9IFwicHJvdG9uXCI7XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG4gIDx0aXRsZT57dGl0bGV9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuXHJcbnsjaWYgc2VnbWVudCAhPT0gJ3BhZ2VzJ31cclxuICA8ZGl2IGNsYXNzPVwibC1wcm90b24tbmF2LXN0YXRpY1wiPlxyXG4gICAgPE5hdmJhciB7c2VnbWVudH0ge2NvbG9yfSB7dGl0bGV9IC8+XHJcbiAgICA8ZGl2IGlkPVwibGF5b3V0U2lkZW5hdlwiPlxyXG4gICAgICA8U2lkZWJhciB7c2VnbWVudH0ge3RoZW1lfSAvPlxyXG4gICAgICA8ZGl2IGlkPVwibGF5b3V0U2lkZW5hdl9jb250ZW50XCI+XHJcbiAgICAgICAgPG1haW4+XHJcbiAgICAgICAgICA8Q29udGFpbmVyIGZsdWlkPXt0cnVlfT5cclxuICAgICAgICAgICAgPHNsb3QgLz5cclxuICAgICAgICAgIDwvQ29udGFpbmVyPlxyXG4gICAgICAgIDwvbWFpbj5cclxuICAgICAgICA8Rm9vdGVyIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbns6ZWxzZX1cclxuICA8Ym9keT5cclxuICAgIDxzbG90IC8+XHJcbiAgPC9ib2R5PlxyXG57L2lmfVxyXG4iLCI8c2NyaXB0PlxyXG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xyXG5cdGV4cG9ydCBsZXQgZXJyb3I7XHJcblxyXG5cdGNvbnN0IGRldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuXHRoMSwgcCB7XHJcblx0XHRtYXJnaW46IDAgYXV0bztcclxuXHR9XHJcblxyXG5cdGgxIHtcclxuXHRcdGZvbnQtc2l6ZTogMi44ZW07XHJcblx0XHRmb250LXdlaWdodDogNzAwO1xyXG5cdFx0bWFyZ2luOiAwIDAgMC41ZW0gMDtcclxuXHR9XHJcblxyXG5cdHAge1xyXG5cdFx0bWFyZ2luOiAxZW0gYXV0bztcclxuXHR9XHJcblxyXG5cdEBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xyXG5cdFx0aDEge1xyXG5cdFx0XHRmb250LXNpemU6IDRlbTtcclxuXHRcdH1cclxuXHR9XHJcbjwvc3R5bGU+XHJcblxyXG48c3ZlbHRlOmhlYWQ+XHJcblx0PHRpdGxlPntzdGF0dXN9PC90aXRsZT5cclxuPC9zdmVsdGU6aGVhZD5cclxuXHJcbjxoMT57c3RhdHVzfTwvaDE+XHJcblxyXG48cD57ZXJyb3IubWVzc2FnZX08L3A+XHJcblxyXG57I2lmIGRldiAmJiBlcnJvci5zdGFja31cclxuXHQ8cHJlPntlcnJvci5zdGFja308L3ByZT5cclxuey9pZn1cclxuIiwiPCEtLSBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhIC0tPlxuPHNjcmlwdD5cblx0aW1wb3J0IHsgc2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5cdGltcG9ydCB7IENPTlRFWFRfS0VZIH0gZnJvbSAnLi9zaGFyZWQnO1xuXHRpbXBvcnQgTGF5b3V0IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fbGF5b3V0LnN2ZWx0ZSc7XG5cdGltcG9ydCBFcnJvciBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2Vycm9yLnN2ZWx0ZSc7XG5cblx0ZXhwb3J0IGxldCBzdG9yZXM7XG5cdGV4cG9ydCBsZXQgZXJyb3I7XG5cdGV4cG9ydCBsZXQgc3RhdHVzO1xuXHRleHBvcnQgbGV0IHNlZ21lbnRzO1xuXHRleHBvcnQgbGV0IGxldmVsMDtcblx0ZXhwb3J0IGxldCBsZXZlbDEgPSBudWxsO1xuXHRleHBvcnQgbGV0IGxldmVsMiA9IG51bGw7XG5cdGV4cG9ydCBsZXQgbGV2ZWwzID0gbnVsbDtcblxuXHRzZXRDb250ZXh0KENPTlRFWFRfS0VZLCBzdG9yZXMpO1xuPC9zY3JpcHQ+XG5cbjxMYXlvdXQgc2VnbWVudD1cIntzZWdtZW50c1swXX1cIiB7Li4ubGV2ZWwwLnByb3BzfT5cblx0eyNpZiBlcnJvcn1cblx0XHQ8RXJyb3Ige2Vycm9yfSB7c3RhdHVzfS8+XG5cdHs6ZWxzZX1cblx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMS5jb21wb25lbnR9XCIgc2VnbWVudD1cIntzZWdtZW50c1sxXX1cIiB7Li4ubGV2ZWwxLnByb3BzfT5cblx0XHRcdHsjaWYgbGV2ZWwyfVxuXHRcdFx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMi5jb21wb25lbnR9XCIgc2VnbWVudD1cIntzZWdtZW50c1syXX1cIiB7Li4ubGV2ZWwyLnByb3BzfT5cblx0XHRcdFx0XHR7I2lmIGxldmVsM31cblx0XHRcdFx0XHRcdDxzdmVsdGU6Y29tcG9uZW50IHRoaXM9XCJ7bGV2ZWwzLmNvbXBvbmVudH1cIiB7Li4ubGV2ZWwzLnByb3BzfS8+XG5cdFx0XHRcdFx0ey9pZn1cblx0XHRcdFx0PC9zdmVsdGU6Y29tcG9uZW50PlxuXHRcdFx0ey9pZn1cblx0XHQ8L3N2ZWx0ZTpjb21wb25lbnQ+XG5cdHsvaWZ9XG48L0xheW91dD4iLCIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJvb3QgfSBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuZXhwb3J0IHsgcHJlbG9hZCBhcyByb290X3ByZWxvYWQgfSBmcm9tICcuL3NoYXJlZCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5leHBvcnQgY29uc3QgaWdub3JlID0gWy9eXFwvYmxvZy5qc29uJC8sIC9eXFwvYmxvZ1xcLyhbXlxcL10rPykuanNvbiQvXTtcblxuZXhwb3J0IGNvbnN0IGNvbXBvbmVudHMgPSBbXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2luZGV4LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmluZGV4LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYWN0aXZpdHlfbG9nLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmFjdGl2aXR5X2xvZy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3NldHRpbmdzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnNldHRpbmdzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvbGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvbi5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpsYXlvdXRzL3N0YXRpY19uYXZpZ2F0aW9uLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvbGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmxheW91dHMvbGlnaHRfc2lkZW5hdi5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2NoYXJ0cy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpjaGFydHMuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy90YWJsZXMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6dGFibGVzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvX2xheW91dC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9fbGF5b3V0LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9hdXRoZW50aWNhdGlvbi9fbGF5b3V0LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2F1dGhlbnRpY2F0aW9uL2ZvcmdldF9wYXNzd29yZC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL3JlZ2lzdGVyLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2F1dGhlbnRpY2F0aW9uL3JlZ2lzdGVyLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6cGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9lcnJvci9fbGF5b3V0LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2Vycm9yL19sYXlvdXQuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9lcnJvci9lcnJvcl80MDEuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6cGFnZXMvZXJyb3IvZXJyb3JfNDAxLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvZXJyb3JfNDA0LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2Vycm9yL2Vycm9yXzQwNC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2Vycm9yL2Vycm9yXzUwMC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9lcnJvci9lcnJvcl81MDAuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL2luZGV4LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmJsb2cvaW5kZXguc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL1tzbHVnXS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpibG9nL1tzbHVnXS5zdmVsdGVfX1wiXG5cdH1cbl07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXMgPSAoZCA9PiBbXG5cdHtcblx0XHQvLyBpbmRleC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcLyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYWN0aXZpdHlfbG9nLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYWN0aXZpdHlfbG9nXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gc2V0dGluZ3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9zZXR0aW5nc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAyIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGxheW91dHMvc3RhdGljX25hdmlnYXRpb24uc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9sYXlvdXRzXFwvc3RhdGljX25hdmlnYXRpb25cXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDMgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gbGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL2xpZ2h0X3NpZGVuYXZcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY2hhcnRzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY2hhcnRzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDUgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gdGFibGVzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvdGFibGVzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDYgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL2ZvcmdldF9wYXNzd29yZFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDggfSxcblx0XHRcdHsgaTogOSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9yZWdpc3RlclxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDggfSxcblx0XHRcdHsgaTogMTAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvbG9naW5cXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNyB9LFxuXHRcdFx0eyBpOiA4IH0sXG5cdFx0XHR7IGk6IDExIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIHBhZ2VzL2Vycm9yL2Vycm9yXzQwMS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDFcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNyB9LFxuXHRcdFx0eyBpOiAxMiB9LFxuXHRcdFx0eyBpOiAxMyB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBwYWdlcy9lcnJvci9lcnJvcl80MDQuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2Vycm9yXFwvZXJyb3JfNDA0XFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDcgfSxcblx0XHRcdHsgaTogMTIgfSxcblx0XHRcdHsgaTogMTQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvZXJyb3IvZXJyb3JfNTAwLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzUwMFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDEyIH0sXG5cdFx0XHR7IGk6IDE1IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGJsb2cvaW5kZXguc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9ibG9nXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDE2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGJsb2cvW3NsdWddLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDE3LCBwYXJhbXM6IG1hdGNoID0+ICh7IHNsdWc6IGQobWF0Y2hbMV0pIH0pIH1cblx0XHRdXG5cdH1cbl0pKGRlY29kZVVSSUNvbXBvbmVudCk7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHRpbXBvcnQoXCJDOi9hcHAvbGFtYmRhLXByb3Rvbi9ub2RlX21vZHVsZXMvc2FwcGVyL3NhcHBlci1kZXYtY2xpZW50LmpzXCIpLnRoZW4oY2xpZW50ID0+IHtcblx0XHRjbGllbnQuY29ubmVjdCgxMDAwMCk7XG5cdH0pO1xufSIsImltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuaW1wb3J0IHsgQ09OVEVYVF9LRVkgfSBmcm9tICcuL2ludGVybmFsL3NoYXJlZCc7XG5pbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vaW50ZXJuYWwvQXBwLnN2ZWx0ZSc7XG5pbXBvcnQgeyBpZ25vcmUsIHJvdXRlcywgcm9vdF9wcmVsb2FkLCBjb21wb25lbnRzLCBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4vaW50ZXJuYWwvbWFuaWZlc3QtY2xpZW50JztcblxuZnVuY3Rpb24gZ290byhocmVmLCBvcHRzID0geyByZXBsYWNlU3RhdGU6IGZhbHNlIH0pIHtcblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldChuZXcgVVJMKGhyZWYsIGRvY3VtZW50LmJhc2VVUkkpKTtcblxuXHRpZiAodGFyZ2V0KSB7XG5cdFx0X2hpc3Rvcnlbb3B0cy5yZXBsYWNlU3RhdGUgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7IGlkOiBjaWQgfSwgJycsIGhyZWYpO1xuXHRcdHJldHVybiBuYXZpZ2F0ZSh0YXJnZXQsIG51bGwpLnRoZW4oKCkgPT4ge30pO1xuXHR9XG5cblx0bG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmID0+IHt9KTsgLy8gbmV2ZXIgcmVzb2x2ZXNcbn1cblxuY29uc3QgaW5pdGlhbF9kYXRhID0gdHlwZW9mIF9fU0FQUEVSX18gIT09ICd1bmRlZmluZWQnICYmIF9fU0FQUEVSX187XG5cbmxldCByZWFkeSA9IGZhbHNlO1xubGV0IHJvb3RfY29tcG9uZW50O1xubGV0IGN1cnJlbnRfdG9rZW47XG5sZXQgcm9vdF9wcmVsb2FkZWQ7XG5sZXQgY3VycmVudF9icmFuY2ggPSBbXTtcbmxldCBjdXJyZW50X3F1ZXJ5ID0gJ3t9JztcblxuY29uc3Qgc3RvcmVzID0ge1xuXHRwYWdlOiB3cml0YWJsZSh7fSksXG5cdHByZWxvYWRpbmc6IHdyaXRhYmxlKG51bGwpLFxuXHRzZXNzaW9uOiB3cml0YWJsZShpbml0aWFsX2RhdGEgJiYgaW5pdGlhbF9kYXRhLnNlc3Npb24pXG59O1xuXG5sZXQgJHNlc3Npb247XG5sZXQgc2Vzc2lvbl9kaXJ0eTtcblxuc3RvcmVzLnNlc3Npb24uc3Vic2NyaWJlKGFzeW5jIHZhbHVlID0+IHtcblx0JHNlc3Npb24gPSB2YWx1ZTtcblxuXHRpZiAoIXJlYWR5KSByZXR1cm47XG5cdHNlc3Npb25fZGlydHkgPSB0cnVlO1xuXG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChsb2NhdGlvbi5ocmVmKSk7XG5cblx0Y29uc3QgdG9rZW4gPSBjdXJyZW50X3Rva2VuID0ge307XG5cdGNvbnN0IHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfSA9IGF3YWl0IGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCk7XG5cdGlmICh0b2tlbiAhPT0gY3VycmVudF90b2tlbikgcmV0dXJuOyAvLyBhIHNlY29uZGFyeSBuYXZpZ2F0aW9uIGhhcHBlbmVkIHdoaWxlIHdlIHdlcmUgbG9hZGluZ1xuXG5cdGF3YWl0IHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgdGFyZ2V0LnBhZ2UpO1xufSk7XG5cbmxldCBwcmVmZXRjaGluZ1xuXG5cbiA9IG51bGw7XG5mdW5jdGlvbiBzZXRfcHJlZmV0Y2hpbmcoaHJlZiwgcHJvbWlzZSkge1xuXHRwcmVmZXRjaGluZyA9IHsgaHJlZiwgcHJvbWlzZSB9O1xufVxuXG5sZXQgdGFyZ2V0O1xuZnVuY3Rpb24gc2V0X3RhcmdldChlbGVtZW50KSB7XG5cdHRhcmdldCA9IGVsZW1lbnQ7XG59XG5cbmxldCB1aWQgPSAxO1xuZnVuY3Rpb24gc2V0X3VpZChuKSB7XG5cdHVpZCA9IG47XG59XG5cbmxldCBjaWQ7XG5mdW5jdGlvbiBzZXRfY2lkKG4pIHtcblx0Y2lkID0gbjtcbn1cblxuY29uc3QgX2hpc3RvcnkgPSB0eXBlb2YgaGlzdG9yeSAhPT0gJ3VuZGVmaW5lZCcgPyBoaXN0b3J5IDoge1xuXHRwdXNoU3RhdGU6IChzdGF0ZSwgdGl0bGUsIGhyZWYpID0+IHt9LFxuXHRyZXBsYWNlU3RhdGU6IChzdGF0ZSwgdGl0bGUsIGhyZWYpID0+IHt9LFxuXHRzY3JvbGxSZXN0b3JhdGlvbjogJydcbn07XG5cbmNvbnN0IHNjcm9sbF9oaXN0b3J5ID0ge307XG5cbmZ1bmN0aW9uIGV4dHJhY3RfcXVlcnkoc2VhcmNoKSB7XG5cdGNvbnN0IHF1ZXJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0aWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG5cdFx0c2VhcmNoLnNsaWNlKDEpLnNwbGl0KCcmJykuZm9yRWFjaChzZWFyY2hQYXJhbSA9PiB7XG5cdFx0XHRsZXQgWywga2V5LCB2YWx1ZSA9ICcnXSA9IC8oW149XSopKD86PSguKikpPy8uZXhlYyhkZWNvZGVVUklDb21wb25lbnQoc2VhcmNoUGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykpKTtcblx0XHRcdGlmICh0eXBlb2YgcXVlcnlba2V5XSA9PT0gJ3N0cmluZycpIHF1ZXJ5W2tleV0gPSBbcXVlcnlba2V5XV07XG5cdFx0XHRpZiAodHlwZW9mIHF1ZXJ5W2tleV0gPT09ICdvYmplY3QnKSAocXVlcnlba2V5XSApLnB1c2godmFsdWUpO1xuXHRcdFx0ZWxzZSBxdWVyeVtrZXldID0gdmFsdWU7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBzZWxlY3RfdGFyZ2V0KHVybCkge1xuXHRpZiAodXJsLm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSByZXR1cm4gbnVsbDtcblx0aWYgKCF1cmwucGF0aG5hbWUuc3RhcnRzV2l0aChpbml0aWFsX2RhdGEuYmFzZVVybCkpIHJldHVybiBudWxsO1xuXG5cdGxldCBwYXRoID0gdXJsLnBhdGhuYW1lLnNsaWNlKGluaXRpYWxfZGF0YS5iYXNlVXJsLmxlbmd0aCk7XG5cblx0aWYgKHBhdGggPT09ICcnKSB7XG5cdFx0cGF0aCA9ICcvJztcblx0fVxuXG5cdC8vIGF2b2lkIGFjY2lkZW50YWwgY2xhc2hlcyBiZXR3ZWVuIHNlcnZlciByb3V0ZXMgYW5kIHBhZ2Ugcm91dGVzXG5cdGlmIChpZ25vcmUuc29tZShwYXR0ZXJuID0+IHBhdHRlcm4udGVzdChwYXRoKSkpIHJldHVybjtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHJvdXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGNvbnN0IHJvdXRlID0gcm91dGVzW2ldO1xuXG5cdFx0Y29uc3QgbWF0Y2ggPSByb3V0ZS5wYXR0ZXJuLmV4ZWMocGF0aCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gZXh0cmFjdF9xdWVyeSh1cmwuc2VhcmNoKTtcblx0XHRcdGNvbnN0IHBhcnQgPSByb3V0ZS5wYXJ0c1tyb3V0ZS5wYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdGNvbnN0IHBhcmFtcyA9IHBhcnQucGFyYW1zID8gcGFydC5wYXJhbXMobWF0Y2gpIDoge307XG5cblx0XHRcdGNvbnN0IHBhZ2UgPSB7IGhvc3Q6IGxvY2F0aW9uLmhvc3QsIHBhdGgsIHF1ZXJ5LCBwYXJhbXMgfTtcblxuXHRcdFx0cmV0dXJuIHsgaHJlZjogdXJsLmhyZWYsIHJvdXRlLCBtYXRjaCwgcGFnZSB9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVfZXJyb3IodXJsKSB7XG5cdGNvbnN0IHsgaG9zdCwgcGF0aG5hbWUsIHNlYXJjaCB9ID0gbG9jYXRpb247XG5cdGNvbnN0IHsgc2Vzc2lvbiwgcHJlbG9hZGVkLCBzdGF0dXMsIGVycm9yIH0gPSBpbml0aWFsX2RhdGE7XG5cblx0aWYgKCFyb290X3ByZWxvYWRlZCkge1xuXHRcdHJvb3RfcHJlbG9hZGVkID0gcHJlbG9hZGVkICYmIHByZWxvYWRlZFswXTtcblx0fVxuXG5cdGNvbnN0IHByb3BzID0ge1xuXHRcdGVycm9yLFxuXHRcdHN0YXR1cyxcblx0XHRzZXNzaW9uLFxuXHRcdGxldmVsMDoge1xuXHRcdFx0cHJvcHM6IHJvb3RfcHJlbG9hZGVkXG5cdFx0fSxcblx0XHRsZXZlbDE6IHtcblx0XHRcdHByb3BzOiB7XG5cdFx0XHRcdHN0YXR1cyxcblx0XHRcdFx0ZXJyb3Jcblx0XHRcdH0sXG5cdFx0XHRjb21wb25lbnQ6IEVycm9yQ29tcG9uZW50XG5cdFx0fSxcblx0XHRzZWdtZW50czogcHJlbG9hZGVkXG5cblx0fTtcblx0Y29uc3QgcXVlcnkgPSBleHRyYWN0X3F1ZXJ5KHNlYXJjaCk7XG5cdHJlbmRlcihudWxsLCBbXSwgcHJvcHMsIHsgaG9zdCwgcGF0aDogcGF0aG5hbWUsIHF1ZXJ5LCBwYXJhbXM6IHt9IH0pO1xufVxuXG5mdW5jdGlvbiBzY3JvbGxfc3RhdGUoKSB7XG5cdHJldHVybiB7XG5cdFx0eDogcGFnZVhPZmZzZXQsXG5cdFx0eTogcGFnZVlPZmZzZXRcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbmF2aWdhdGUodGFyZ2V0LCBpZCwgbm9zY3JvbGwsIGhhc2gpIHtcblx0aWYgKGlkKSB7XG5cdFx0Ly8gcG9wc3RhdGUgb3IgaW5pdGlhbCBuYXZpZ2F0aW9uXG5cdFx0Y2lkID0gaWQ7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgY3VycmVudF9zY3JvbGwgPSBzY3JvbGxfc3RhdGUoKTtcblxuXHRcdC8vIGNsaWNrZWQgb24gYSBsaW5rLiBwcmVzZXJ2ZSBzY3JvbGwgc3RhdGVcblx0XHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gY3VycmVudF9zY3JvbGw7XG5cblx0XHRpZCA9IGNpZCA9ICsrdWlkO1xuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBub3Njcm9sbCA/IGN1cnJlbnRfc2Nyb2xsIDogeyB4OiAwLCB5OiAwIH07XG5cdH1cblxuXHRjaWQgPSBpZDtcblxuXHRpZiAocm9vdF9jb21wb25lbnQpIHN0b3Jlcy5wcmVsb2FkaW5nLnNldCh0cnVlKTtcblxuXHRjb25zdCBsb2FkZWQgPSBwcmVmZXRjaGluZyAmJiBwcmVmZXRjaGluZy5ocmVmID09PSB0YXJnZXQuaHJlZiA/XG5cdFx0cHJlZmV0Y2hpbmcucHJvbWlzZSA6XG5cdFx0aHlkcmF0ZV90YXJnZXQodGFyZ2V0KTtcblxuXHRwcmVmZXRjaGluZyA9IG51bGw7XG5cblx0Y29uc3QgdG9rZW4gPSBjdXJyZW50X3Rva2VuID0ge307XG5cdGNvbnN0IHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfSA9IGF3YWl0IGxvYWRlZDtcblx0aWYgKHRva2VuICE9PSBjdXJyZW50X3Rva2VuKSByZXR1cm47IC8vIGEgc2Vjb25kYXJ5IG5hdmlnYXRpb24gaGFwcGVuZWQgd2hpbGUgd2Ugd2VyZSBsb2FkaW5nXG5cblx0YXdhaXQgcmVuZGVyKHJlZGlyZWN0LCBicmFuY2gsIHByb3BzLCB0YXJnZXQucGFnZSk7XG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblxuXHRpZiAoIW5vc2Nyb2xsKSB7XG5cdFx0bGV0IHNjcm9sbCA9IHNjcm9sbF9oaXN0b3J5W2lkXTtcblxuXHRcdGlmIChoYXNoKSB7XG5cdFx0XHQvLyBzY3JvbGwgaXMgYW4gZWxlbWVudCBpZCAoZnJvbSBhIGhhc2gpLCB3ZSBuZWVkIHRvIGNvbXB1dGUgeS5cblx0XHRcdGNvbnN0IGRlZXBfbGlua2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaC5zbGljZSgxKSk7XG5cblx0XHRcdGlmIChkZWVwX2xpbmtlZCkge1xuXHRcdFx0XHRzY3JvbGwgPSB7XG5cdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHR5OiBkZWVwX2xpbmtlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3Bcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gc2Nyb2xsO1xuXHRcdGlmIChzY3JvbGwpIHNjcm9sbFRvKHNjcm9sbC54LCBzY3JvbGwueSk7XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyKHJlZGlyZWN0LCBicmFuY2gsIHByb3BzLCBwYWdlKSB7XG5cdGlmIChyZWRpcmVjdCkgcmV0dXJuIGdvdG8ocmVkaXJlY3QubG9jYXRpb24sIHsgcmVwbGFjZVN0YXRlOiB0cnVlIH0pO1xuXG5cdHN0b3Jlcy5wYWdlLnNldChwYWdlKTtcblx0c3RvcmVzLnByZWxvYWRpbmcuc2V0KGZhbHNlKTtcblxuXHRpZiAocm9vdF9jb21wb25lbnQpIHtcblx0XHRyb290X2NvbXBvbmVudC4kc2V0KHByb3BzKTtcblx0fSBlbHNlIHtcblx0XHRwcm9wcy5zdG9yZXMgPSB7XG5cdFx0XHRwYWdlOiB7IHN1YnNjcmliZTogc3RvcmVzLnBhZ2Uuc3Vic2NyaWJlIH0sXG5cdFx0XHRwcmVsb2FkaW5nOiB7IHN1YnNjcmliZTogc3RvcmVzLnByZWxvYWRpbmcuc3Vic2NyaWJlIH0sXG5cdFx0XHRzZXNzaW9uOiBzdG9yZXMuc2Vzc2lvblxuXHRcdH07XG5cdFx0cHJvcHMubGV2ZWwwID0ge1xuXHRcdFx0cHJvcHM6IGF3YWl0IHJvb3RfcHJlbG9hZGVkXG5cdFx0fTtcblxuXHRcdC8vIGZpcnN0IGxvYWQg4oCUIHJlbW92ZSBTU1InZCA8aGVhZD4gY29udGVudHNcblx0XHRjb25zdCBzdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXBwZXItaGVhZC1zdGFydCcpO1xuXHRcdGNvbnN0IGVuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXBwZXItaGVhZC1lbmQnKTtcblxuXHRcdGlmIChzdGFydCAmJiBlbmQpIHtcblx0XHRcdHdoaWxlIChzdGFydC5uZXh0U2libGluZyAhPT0gZW5kKSBkZXRhY2goc3RhcnQubmV4dFNpYmxpbmcpO1xuXHRcdFx0ZGV0YWNoKHN0YXJ0KTtcblx0XHRcdGRldGFjaChlbmQpO1xuXHRcdH1cblxuXHRcdHJvb3RfY29tcG9uZW50ID0gbmV3IEFwcCh7XG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRwcm9wcyxcblx0XHRcdGh5ZHJhdGU6IHRydWVcblx0XHR9KTtcblx0fVxuXG5cdGN1cnJlbnRfYnJhbmNoID0gYnJhbmNoO1xuXHRjdXJyZW50X3F1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkocGFnZS5xdWVyeSk7XG5cdHJlYWR5ID0gdHJ1ZTtcblx0c2Vzc2lvbl9kaXJ0eSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwYXJ0X2NoYW5nZWQoaSwgc2VnbWVudCwgbWF0Y2gsIHN0cmluZ2lmaWVkX3F1ZXJ5KSB7XG5cdC8vIFRPRE8gb25seSBjaGVjayBxdWVyeSBzdHJpbmcgY2hhbmdlcyBmb3IgcHJlbG9hZCBmdW5jdGlvbnNcblx0Ly8gdGhhdCBkbyBpbiBmYWN0IGRlcGVuZCBvbiBpdCAodXNpbmcgc3RhdGljIGFuYWx5c2lzIG9yXG5cdC8vIHJ1bnRpbWUgaW5zdHJ1bWVudGF0aW9uKVxuXHRpZiAoc3RyaW5naWZpZWRfcXVlcnkgIT09IGN1cnJlbnRfcXVlcnkpIHJldHVybiB0cnVlO1xuXG5cdGNvbnN0IHByZXZpb3VzID0gY3VycmVudF9icmFuY2hbaV07XG5cblx0aWYgKCFwcmV2aW91cykgcmV0dXJuIGZhbHNlO1xuXHRpZiAoc2VnbWVudCAhPT0gcHJldmlvdXMuc2VnbWVudCkgcmV0dXJuIHRydWU7XG5cdGlmIChwcmV2aW91cy5tYXRjaCkge1xuXHRcdGlmIChKU09OLnN0cmluZ2lmeShwcmV2aW91cy5tYXRjaC5zbGljZSgxLCBpICsgMikpICE9PSBKU09OLnN0cmluZ2lmeShtYXRjaC5zbGljZSgxLCBpICsgMikpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gaHlkcmF0ZV90YXJnZXQodGFyZ2V0KVxuXG5cblxuIHtcblx0Y29uc3QgeyByb3V0ZSwgcGFnZSB9ID0gdGFyZ2V0O1xuXHRjb25zdCBzZWdtZW50cyA9IHBhZ2UucGF0aC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKTtcblxuXHRsZXQgcmVkaXJlY3QgPSBudWxsO1xuXG5cdGNvbnN0IHByb3BzID0geyBlcnJvcjogbnVsbCwgc3RhdHVzOiAyMDAsIHNlZ21lbnRzOiBbc2VnbWVudHNbMF1dIH07XG5cblx0Y29uc3QgcHJlbG9hZF9jb250ZXh0ID0ge1xuXHRcdGZldGNoOiAodXJsLCBvcHRzKSA9PiBmZXRjaCh1cmwsIG9wdHMpLFxuXHRcdHJlZGlyZWN0OiAoc3RhdHVzQ29kZSwgbG9jYXRpb24pID0+IHtcblx0XHRcdGlmIChyZWRpcmVjdCAmJiAocmVkaXJlY3Quc3RhdHVzQ29kZSAhPT0gc3RhdHVzQ29kZSB8fCByZWRpcmVjdC5sb2NhdGlvbiAhPT0gbG9jYXRpb24pKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgQ29uZmxpY3RpbmcgcmVkaXJlY3RzYCk7XG5cdFx0XHR9XG5cdFx0XHRyZWRpcmVjdCA9IHsgc3RhdHVzQ29kZSwgbG9jYXRpb24gfTtcblx0XHR9LFxuXHRcdGVycm9yOiAoc3RhdHVzLCBlcnJvcikgPT4ge1xuXHRcdFx0cHJvcHMuZXJyb3IgPSB0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnID8gbmV3IEVycm9yKGVycm9yKSA6IGVycm9yO1xuXHRcdFx0cHJvcHMuc3RhdHVzID0gc3RhdHVzO1xuXHRcdH1cblx0fTtcblxuXHRpZiAoIXJvb3RfcHJlbG9hZGVkKSB7XG5cdFx0cm9vdF9wcmVsb2FkZWQgPSBpbml0aWFsX2RhdGEucHJlbG9hZGVkWzBdIHx8IHJvb3RfcHJlbG9hZC5jYWxsKHByZWxvYWRfY29udGV4dCwge1xuXHRcdFx0aG9zdDogcGFnZS5ob3N0LFxuXHRcdFx0cGF0aDogcGFnZS5wYXRoLFxuXHRcdFx0cXVlcnk6IHBhZ2UucXVlcnksXG5cdFx0XHRwYXJhbXM6IHt9XG5cdFx0fSwgJHNlc3Npb24pO1xuXHR9XG5cblx0bGV0IGJyYW5jaDtcblx0bGV0IGwgPSAxO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3RyaW5naWZpZWRfcXVlcnkgPSBKU09OLnN0cmluZ2lmeShwYWdlLnF1ZXJ5KTtcblx0XHRjb25zdCBtYXRjaCA9IHJvdXRlLnBhdHRlcm4uZXhlYyhwYWdlLnBhdGgpO1xuXG5cdFx0bGV0IHNlZ21lbnRfZGlydHkgPSBmYWxzZTtcblxuXHRcdGJyYW5jaCA9IGF3YWl0IFByb21pc2UuYWxsKHJvdXRlLnBhcnRzLm1hcChhc3luYyAocGFydCwgaSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuXG5cdFx0XHRpZiAocGFydF9jaGFuZ2VkKGksIHNlZ21lbnQsIG1hdGNoLCBzdHJpbmdpZmllZF9xdWVyeSkpIHNlZ21lbnRfZGlydHkgPSB0cnVlO1xuXG5cdFx0XHRwcm9wcy5zZWdtZW50c1tsXSA9IHNlZ21lbnRzW2kgKyAxXTsgLy8gVE9ETyBtYWtlIHRoaXMgbGVzcyBjb25mdXNpbmdcblx0XHRcdGlmICghcGFydCkgcmV0dXJuIHsgc2VnbWVudCB9O1xuXG5cdFx0XHRjb25zdCBqID0gbCsrO1xuXG5cdFx0XHRpZiAoIXNlc3Npb25fZGlydHkgJiYgIXNlZ21lbnRfZGlydHkgJiYgY3VycmVudF9icmFuY2hbaV0gJiYgY3VycmVudF9icmFuY2hbaV0ucGFydCA9PT0gcGFydC5pKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50X2JyYW5jaFtpXTtcblx0XHRcdH1cblxuXHRcdFx0c2VnbWVudF9kaXJ0eSA9IGZhbHNlO1xuXG5cdFx0XHRjb25zdCB7IGRlZmF1bHQ6IGNvbXBvbmVudCwgcHJlbG9hZCB9ID0gYXdhaXQgbG9hZF9jb21wb25lbnQoY29tcG9uZW50c1twYXJ0LmldKTtcblxuXHRcdFx0bGV0IHByZWxvYWRlZDtcblx0XHRcdGlmIChyZWFkeSB8fCAhaW5pdGlhbF9kYXRhLnByZWxvYWRlZFtpICsgMV0pIHtcblx0XHRcdFx0cHJlbG9hZGVkID0gcHJlbG9hZFxuXHRcdFx0XHRcdD8gYXdhaXQgcHJlbG9hZC5jYWxsKHByZWxvYWRfY29udGV4dCwge1xuXHRcdFx0XHRcdFx0aG9zdDogcGFnZS5ob3N0LFxuXHRcdFx0XHRcdFx0cGF0aDogcGFnZS5wYXRoLFxuXHRcdFx0XHRcdFx0cXVlcnk6IHBhZ2UucXVlcnksXG5cdFx0XHRcdFx0XHRwYXJhbXM6IHBhcnQucGFyYW1zID8gcGFydC5wYXJhbXModGFyZ2V0Lm1hdGNoKSA6IHt9XG5cdFx0XHRcdFx0fSwgJHNlc3Npb24pXG5cdFx0XHRcdFx0OiB7fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByZWxvYWRlZCA9IGluaXRpYWxfZGF0YS5wcmVsb2FkZWRbaSArIDFdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKHByb3BzW2BsZXZlbCR7an1gXSA9IHsgY29tcG9uZW50LCBwcm9wczogcHJlbG9hZGVkLCBzZWdtZW50LCBtYXRjaCwgcGFydDogcGFydC5pIH0pO1xuXHRcdH0pKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRwcm9wcy5lcnJvciA9IGVycm9yO1xuXHRcdHByb3BzLnN0YXR1cyA9IDUwMDtcblx0XHRicmFuY2ggPSBbXTtcblx0fVxuXG5cdHJldHVybiB7IHJlZGlyZWN0LCBwcm9wcywgYnJhbmNoIH07XG59XG5cbmZ1bmN0aW9uIGxvYWRfY3NzKGNodW5rKSB7XG5cdGNvbnN0IGhyZWYgPSBgY2xpZW50LyR7Y2h1bmt9YDtcblx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxpbmtbaHJlZj1cIiR7aHJlZn1cIl1gKSkgcmV0dXJuO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZSgoZnVsZmlsLCByZWplY3QpID0+IHtcblx0XHRjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuXHRcdGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xuXHRcdGxpbmsuaHJlZiA9IGhyZWY7XG5cblx0XHRsaW5rLm9ubG9hZCA9ICgpID0+IGZ1bGZpbCgpO1xuXHRcdGxpbmsub25lcnJvciA9IHJlamVjdDtcblxuXHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBsb2FkX2NvbXBvbmVudChjb21wb25lbnQpXG5cblxuIHtcblx0Ly8gVE9ETyB0aGlzIGlzIHRlbXBvcmFyeSDigJQgb25jZSBwbGFjZWhvbGRlcnMgYXJlXG5cdC8vIGFsd2F5cyByZXdyaXR0ZW4sIHNjcmF0Y2ggdGhlIHRlcm5hcnlcblx0Y29uc3QgcHJvbWlzZXMgPSAodHlwZW9mIGNvbXBvbmVudC5jc3MgPT09ICdzdHJpbmcnID8gW10gOiBjb21wb25lbnQuY3NzLm1hcChsb2FkX2NzcykpO1xuXHRwcm9taXNlcy51bnNoaWZ0KGNvbXBvbmVudC5qcygpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKHZhbHVlcyA9PiB2YWx1ZXNbMF0pO1xufVxuXG5mdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuXHRub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5cbmZ1bmN0aW9uIHByZWZldGNoKGhyZWYpIHtcblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldChuZXcgVVJMKGhyZWYsIGRvY3VtZW50LmJhc2VVUkkpKTtcblxuXHRpZiAodGFyZ2V0KSB7XG5cdFx0aWYgKCFwcmVmZXRjaGluZyB8fCBocmVmICE9PSBwcmVmZXRjaGluZy5ocmVmKSB7XG5cdFx0XHRzZXRfcHJlZmV0Y2hpbmcoaHJlZiwgaHlkcmF0ZV90YXJnZXQodGFyZ2V0KSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByZWZldGNoaW5nLnByb21pc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gc3RhcnQob3B0c1xuXG4pIHtcblx0aWYgKCdzY3JvbGxSZXN0b3JhdGlvbicgaW4gX2hpc3RvcnkpIHtcblx0XHRfaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cblx0c2V0X3RhcmdldChvcHRzLnRhcmdldCk7XG5cblx0YWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVfY2xpY2spO1xuXHRhZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZV9wb3BzdGF0ZSk7XG5cblx0Ly8gcHJlZmV0Y2hcblx0YWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRyaWdnZXJfcHJlZmV0Y2gpO1xuXHRhZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVfbW91c2Vtb3ZlKTtcblxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG5cdFx0Y29uc3QgeyBoYXNoLCBocmVmIH0gPSBsb2NhdGlvbjtcblxuXHRcdF9oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IGlkOiB1aWQgfSwgJycsIGhyZWYpO1xuXG5cdFx0Y29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblxuXHRcdGlmIChpbml0aWFsX2RhdGEuZXJyb3IpIHJldHVybiBoYW5kbGVfZXJyb3IoKTtcblxuXHRcdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0XHRpZiAodGFyZ2V0KSByZXR1cm4gbmF2aWdhdGUodGFyZ2V0LCB1aWQsIHRydWUsIGhhc2gpO1xuXHR9KTtcbn1cblxubGV0IG1vdXNlbW92ZV90aW1lb3V0O1xuXG5mdW5jdGlvbiBoYW5kbGVfbW91c2Vtb3ZlKGV2ZW50KSB7XG5cdGNsZWFyVGltZW91dChtb3VzZW1vdmVfdGltZW91dCk7XG5cdG1vdXNlbW92ZV90aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0dHJpZ2dlcl9wcmVmZXRjaChldmVudCk7XG5cdH0sIDIwKTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlcl9wcmVmZXRjaChldmVudCkge1xuXHRjb25zdCBhID0gZmluZF9hbmNob3IoZXZlbnQudGFyZ2V0KTtcblx0aWYgKCFhIHx8IGEucmVsICE9PSAncHJlZmV0Y2gnKSByZXR1cm47XG5cblx0cHJlZmV0Y2goYS5ocmVmKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX2NsaWNrKGV2ZW50KSB7XG5cdC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvcGFnZS5qc1xuXHQvLyBNSVQgbGljZW5zZSBodHRwczovL2dpdGh1Yi5jb20vdmlzaW9ubWVkaWEvcGFnZS5qcyNsaWNlbnNlXG5cdGlmICh3aGljaChldmVudCkgIT09IDEpIHJldHVybjtcblx0aWYgKGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSkgcmV0dXJuO1xuXHRpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG5cdGNvbnN0IGEgPSBmaW5kX2FuY2hvcihldmVudC50YXJnZXQpO1xuXHRpZiAoIWEpIHJldHVybjtcblxuXHRpZiAoIWEuaHJlZikgcmV0dXJuO1xuXG5cdC8vIGNoZWNrIGlmIGxpbmsgaXMgaW5zaWRlIGFuIHN2Z1xuXHQvLyBpbiB0aGlzIGNhc2UsIGJvdGggaHJlZiBhbmQgdGFyZ2V0IGFyZSBhbHdheXMgaW5zaWRlIGFuIG9iamVjdFxuXHRjb25zdCBzdmcgPSB0eXBlb2YgYS5ocmVmID09PSAnb2JqZWN0JyAmJiBhLmhyZWYuY29uc3RydWN0b3IubmFtZSA9PT0gJ1NWR0FuaW1hdGVkU3RyaW5nJztcblx0Y29uc3QgaHJlZiA9IFN0cmluZyhzdmcgPyAoYSkuaHJlZi5iYXNlVmFsIDogYS5ocmVmKTtcblxuXHRpZiAoaHJlZiA9PT0gbG9jYXRpb24uaHJlZikge1xuXHRcdGlmICghbG9jYXRpb24uaGFzaCkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBJZ25vcmUgaWYgdGFnIGhhc1xuXHQvLyAxLiAnZG93bmxvYWQnIGF0dHJpYnV0ZVxuXHQvLyAyLiByZWw9J2V4dGVybmFsJyBhdHRyaWJ1dGVcblx0aWYgKGEuaGFzQXR0cmlidXRlKCdkb3dubG9hZCcpIHx8IGEuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykgcmV0dXJuO1xuXG5cdC8vIElnbm9yZSBpZiA8YT4gaGFzIGEgdGFyZ2V0XG5cdGlmIChzdmcgPyAoYSkudGFyZ2V0LmJhc2VWYWwgOiBhLnRhcmdldCkgcmV0dXJuO1xuXG5cdGNvbnN0IHVybCA9IG5ldyBVUkwoaHJlZik7XG5cblx0Ly8gRG9uJ3QgaGFuZGxlIGhhc2ggY2hhbmdlc1xuXHRpZiAodXJsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiB1cmwuc2VhcmNoID09PSBsb2NhdGlvbi5zZWFyY2gpIHJldHVybjtcblxuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdGlmICh0YXJnZXQpIHtcblx0XHRjb25zdCBub3Njcm9sbCA9IGEuaGFzQXR0cmlidXRlKCdzYXBwZXItbm9zY3JvbGwnKTtcblx0XHRuYXZpZ2F0ZSh0YXJnZXQsIG51bGwsIG5vc2Nyb2xsLCB1cmwuaGFzaCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRfaGlzdG9yeS5wdXNoU3RhdGUoeyBpZDogY2lkIH0sICcnLCB1cmwuaHJlZik7XG5cdH1cbn1cblxuZnVuY3Rpb24gd2hpY2goZXZlbnQpIHtcblx0cmV0dXJuIGV2ZW50LndoaWNoID09PSBudWxsID8gZXZlbnQuYnV0dG9uIDogZXZlbnQud2hpY2g7XG59XG5cbmZ1bmN0aW9uIGZpbmRfYW5jaG9yKG5vZGUpIHtcblx0d2hpbGUgKG5vZGUgJiYgbm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9PSAnQScpIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7IC8vIFNWRyA8YT4gZWxlbWVudHMgaGF2ZSBhIGxvd2VyY2FzZSBuYW1lXG5cdHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfcG9wc3RhdGUoZXZlbnQpIHtcblx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IHNjcm9sbF9zdGF0ZSgpO1xuXG5cdGlmIChldmVudC5zdGF0ZSkge1xuXHRcdGNvbnN0IHVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRcdGlmICh0YXJnZXQpIHtcblx0XHRcdG5hdmlnYXRlKHRhcmdldCwgZXZlbnQuc3RhdGUuaWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsb2NhdGlvbi5ocmVmID0gbG9jYXRpb24uaHJlZjtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Ly8gaGFzaGNoYW5nZVxuXHRcdHNldF91aWQodWlkICsgMSk7XG5cdFx0c2V0X2NpZCh1aWQpO1xuXHRcdF9oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IGlkOiBjaWQgfSwgJycsIGxvY2F0aW9uLmhyZWYpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHByZWZldGNoUm91dGVzKHBhdGhuYW1lcykge1xuXHRyZXR1cm4gcm91dGVzXG5cdFx0LmZpbHRlcihwYXRobmFtZXNcblx0XHRcdD8gcm91dGUgPT4gcGF0aG5hbWVzLnNvbWUocGF0aG5hbWUgPT4gcm91dGUucGF0dGVybi50ZXN0KHBhdGhuYW1lKSlcblx0XHRcdDogKCkgPT4gdHJ1ZVxuXHRcdClcblx0XHQucmVkdWNlKChwcm9taXNlLCByb3V0ZSkgPT4gcHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChyb3V0ZS5wYXJ0cy5tYXAocGFydCA9PiBwYXJ0ICYmIGxvYWRfY29tcG9uZW50KGNvbXBvbmVudHNbcGFydC5pXSkpKTtcblx0XHR9KSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xufVxuXG5jb25zdCBzdG9yZXMkMSA9ICgpID0+IGdldENvbnRleHQoQ09OVEVYVF9LRVkpO1xuXG5leHBvcnQgeyBnb3RvLCBwcmVmZXRjaCwgcHJlZmV0Y2hSb3V0ZXMsIHN0YXJ0LCBzdG9yZXMkMSBhcyBzdG9yZXMgfTtcbiIsImltcG9ydCAqIGFzIHNhcHBlciBmcm9tICdAc2FwcGVyL2FwcCc7XHJcblxyXG5zYXBwZXIuc3RhcnQoe1xyXG5cdHRhcmdldDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlcicpXHJcbn0pOyJdLCJuYW1lcyI6WyJFcnJvckNvbXBvbmVudCIsImRldGFjaCIsInJvb3RfcHJlbG9hZCIsInNhcHBlci5zdGFydCJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxJQUFJLEdBQUcsR0FBRztBQUNuQixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDMUI7QUFDQSxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksR0FBRztBQUN2QixRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFJRCxTQUFTLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ3pELElBQUksT0FBTyxDQUFDLGFBQWEsR0FBRztBQUM1QixRQUFRLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN6QyxLQUFLLENBQUM7QUFDTixDQUFDO0FBQ0QsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFO0FBQ2pCLElBQUksT0FBTyxFQUFFLEVBQUUsQ0FBQztBQUNoQixDQUFDO0FBQ0QsU0FBUyxZQUFZLEdBQUc7QUFDeEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUN0QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUM1QixJQUFJLE9BQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxDQUFDO0FBQ3ZDLENBQUM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQzlCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEtBQUssT0FBTyxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUM7QUFDbEcsQ0FBQztBQUlELFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDckMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtBQUNoRSxRQUFRLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxLQUFLO0FBQ0wsQ0FBQztBQUNELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLFNBQVMsRUFBRTtBQUN4QyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUN2QixRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUNoRCxJQUFJLE9BQU8sS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxXQUFXLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDakUsQ0FBQztBQU1ELFNBQVMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7QUFDekQsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFDRCxTQUFTLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7QUFDbkQsSUFBSSxJQUFJLFVBQVUsRUFBRTtBQUNwQixRQUFRLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLFFBQVEsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkMsS0FBSztBQUNMLENBQUM7QUFDRCxTQUFTLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtBQUN4RCxJQUFJLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDOUIsVUFBVSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0QsVUFBVSxPQUFPLENBQUMsR0FBRyxDQUFDO0FBQ3RCLENBQUM7QUFDRCxTQUFTLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtBQUMxRCxJQUFJLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUM3QixRQUFRLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM5QyxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUMvQyxZQUFZLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUM5QixZQUFZLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzdDLGdCQUFnQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsYUFBYTtBQUNiLFlBQVksT0FBTyxNQUFNLENBQUM7QUFDMUIsU0FBUztBQUNULFFBQVEsT0FBTyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNwQyxLQUFLO0FBQ0wsSUFBSSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDekIsQ0FBQztBQUNELFNBQVMsc0JBQXNCLENBQUMsS0FBSyxFQUFFO0FBQ3ZDLElBQUksTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLO0FBQ3pCLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztBQUN4QixZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsSUFBSSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBcUJEO0FBQ0EsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDO0FBQ2hELElBQUksR0FBRyxHQUFHLFNBQVM7QUFDbkIsTUFBTSxNQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3BDLE1BQU0sTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsSUFBSSxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsSUFBSSxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7QUFRN0Q7QUFDQSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN4QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJO0FBQzFCLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDMUIsWUFBWSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFlBQVksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3JCLFNBQVM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDeEIsUUFBUSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQU9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3hCLElBQUksSUFBSSxJQUFJLENBQUM7QUFDYixJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDO0FBQ3hCLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZCLElBQUksT0FBTztBQUNYLFFBQVEsT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSTtBQUN4QyxZQUFZLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxRCxTQUFTLENBQUM7QUFDVixRQUFRLEtBQUssR0FBRztBQUNoQixZQUFZLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsU0FBUztBQUNULEtBQUssQ0FBQztBQUNOLENBQUM7QUFDRDtBQUNBLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDOUIsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFDRCxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBQ0QsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3RCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUU7QUFDN0MsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ25ELFFBQVEsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUN2QixJQUFJLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBZ0JELFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtBQUMzQixJQUFJLE9BQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBQ0QsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3BCLElBQUksT0FBTyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFDRCxTQUFTLEtBQUssR0FBRztBQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFDRCxTQUFTLEtBQUssR0FBRztBQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFDRCxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDL0MsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRCxJQUFJLE9BQU8sTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBc0JELFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLElBQUksSUFBSSxLQUFLLElBQUksSUFBSTtBQUNyQixRQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEMsU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssS0FBSztBQUNuRCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQzFDO0FBQ0EsSUFBSSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pFLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7QUFDbEMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDckMsWUFBWSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLFNBQVM7QUFDVCxhQUFhLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtBQUNsQyxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxTQUFTO0FBQ1QsYUFBYSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFO0FBQzNELFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxTQUFTO0FBQ1QsYUFBYTtBQUNiLFlBQVksSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0MsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBeUJELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUMxQixJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDN0MsQ0FBQztBQVFELFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUMzQixJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUNELFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRTtBQUNyRCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDOUMsUUFBUSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQ3BDLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFlBQVksT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDL0MsZ0JBQWdCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsZ0JBQWdCLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNoRCxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7QUFDeEIsaUJBQWlCO0FBQ2pCLHFCQUFxQjtBQUNyQixvQkFBb0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekQsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUNELFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDakMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlDLFFBQVEsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRTtBQUNqQyxZQUFZLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNsQyxZQUFZLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFDRCxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDNUIsSUFBSSxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQU1ELFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDdkMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUN0QyxRQUFRLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzVCLEtBQUs7QUFDTCxDQUFDO0FBU0QsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFDRCxTQUFTLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkQsUUFBUSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTtBQUN0QyxZQUFZLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ25DLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFPRCxTQUFTLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDOUIsSUFBSSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEYsSUFBSSxPQUFPLGVBQWUsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDO0FBQ3RELENBQUM7QUFvQ0QsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNwQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEQsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELElBQUksT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDOUQsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQTBCRDtBQUNBLElBQUksVUFBVSxDQUFDO0FBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCO0FBQ0EsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ25CLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN2QixJQUFJLE9BQU8sQ0FBQyxFQUFFO0FBQ2QsUUFBUSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQ3JFLElBQUksTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUNuQyxJQUFJLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUMxQixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN2QyxRQUFRLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsU0FBUyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEQsS0FBSztBQUNMLElBQUksTUFBTSxJQUFJLEdBQUcsU0FBUyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pELElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM5QixRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDekIsWUFBWSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsWUFBWSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxZQUFZLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3JDLFNBQVM7QUFDVCxRQUFRLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkMsUUFBUSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hGLEtBQUs7QUFDTCxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztBQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDaEgsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQ2hCLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNELFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDakMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDdEQsU0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3BCLFNBQVMsTUFBTSxDQUFDLElBQUk7QUFDcEIsVUFBVSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3hDLFVBQVUsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELEtBQUs7QUFDTCxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxNQUFNO0FBQ3pCLFFBQVEsV0FBVyxFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUNELFNBQVMsV0FBVyxHQUFHO0FBQ3ZCLElBQUksR0FBRyxDQUFDLE1BQU07QUFDZCxRQUFRLElBQUksTUFBTTtBQUNsQixZQUFZLE9BQU87QUFDbkIsUUFBUSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMzQyxRQUFRLE9BQU8sQ0FBQyxFQUFFO0FBQ2xCLFlBQVksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxRQUFRLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDM0IsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBc0VEO0FBQ0EsSUFBSSxpQkFBaUIsQ0FBQztBQUN0QixTQUFTLHFCQUFxQixDQUFDLFNBQVMsRUFBRTtBQUMxQyxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztBQUNsQyxDQUFDO0FBQ0QsU0FBUyxxQkFBcUIsR0FBRztBQUNqQyxJQUFJLElBQUksQ0FBQyxpQkFBaUI7QUFDMUIsUUFBUSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDO0FBQzVFLElBQUksT0FBTyxpQkFBaUIsQ0FBQztBQUM3QixDQUFDO0FBSUQsU0FBUyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ3JCLElBQUkscUJBQXFCLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBT0QsU0FBUyxxQkFBcUIsR0FBRztBQUNqQyxJQUFJLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixFQUFFLENBQUM7QUFDOUMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sS0FBSztBQUM3QixRQUFRLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsSUFBSSxTQUFTLEVBQUU7QUFDdkI7QUFDQTtBQUNBLFlBQVksTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyRCxZQUFZLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQzVDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVCxLQUFLLENBQUM7QUFDTixDQUFDO0FBQ0QsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUNsQyxJQUFJLHFCQUFxQixFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsSUFBSSxPQUFPLHFCQUFxQixFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDbEMsSUFBSSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekQsSUFBSSxJQUFJLFNBQVMsRUFBRTtBQUNuQixRQUFRLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ25ELEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUU1QixNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM3QixNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUM1QixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0MsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDN0IsU0FBUyxlQUFlLEdBQUc7QUFDM0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDM0IsUUFBUSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDaEMsUUFBUSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsS0FBSztBQUNMLENBQUM7QUFLRCxTQUFTLG1CQUFtQixDQUFDLEVBQUUsRUFBRTtBQUNqQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBSUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqQyxTQUFTLEtBQUssR0FBRztBQUNqQixJQUFJLEdBQUc7QUFDUDtBQUNBO0FBQ0EsUUFBUSxPQUFPLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUN4QyxZQUFZLE1BQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZELFlBQVkscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0MsWUFBWSxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLFNBQVM7QUFDVCxRQUFRLE9BQU8saUJBQWlCLENBQUMsTUFBTTtBQUN2QyxZQUFZLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDN0QsWUFBWSxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxZQUFZLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9DO0FBQ0EsZ0JBQWdCLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0MsZ0JBQWdCLFFBQVEsRUFBRSxDQUFDO0FBQzNCLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLEtBQUssUUFBUSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFDdEMsSUFBSSxPQUFPLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDbkMsUUFBUSxlQUFlLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztBQUNoQyxLQUFLO0FBQ0wsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDN0IsSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQUNELFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNwQixJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDOUIsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsUUFBUSxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2xDLFFBQVEsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUMvQixRQUFRLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFFBQVEsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0EsSUFBSSxPQUFPLENBQUM7QUFDWixTQUFTLElBQUksR0FBRztBQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDbEIsUUFBUSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQzNCLFlBQVksT0FBTyxHQUFHLElBQUksQ0FBQztBQUMzQixTQUFTLENBQUMsQ0FBQztBQUNYLEtBQUs7QUFDTCxJQUFJLE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFDRCxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtBQUN6QyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQUksTUFBTSxDQUFDO0FBQ1gsU0FBUyxZQUFZLEdBQUc7QUFDeEIsSUFBSSxNQUFNLEdBQUc7QUFDYixRQUFRLENBQUMsRUFBRSxDQUFDO0FBQ1osUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNiLFFBQVEsQ0FBQyxFQUFFLE1BQU07QUFDakIsS0FBSyxDQUFDO0FBQ04sQ0FBQztBQUNELFNBQVMsWUFBWSxHQUFHO0FBQ3hCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDbkIsUUFBUSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLEtBQUs7QUFDTCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFDRCxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JDLElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQixRQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3hELElBQUksSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQixRQUFRLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CLFFBQVEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixRQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDNUIsWUFBWSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25DLFlBQVksSUFBSSxRQUFRLEVBQUU7QUFDMUIsZ0JBQWdCLElBQUksTUFBTTtBQUMxQixvQkFBb0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixnQkFBZ0IsUUFBUSxFQUFFLENBQUM7QUFDM0IsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsTUFBTSxlQUFlLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUF1SHhDLFNBQVMsK0JBQStCLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQ2xFLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQy9CLElBQUksSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQy9CLElBQUksSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQUksU0FBUyxlQUFlLEdBQUc7QUFDL0IsUUFBUSxJQUFJLGNBQWM7QUFDMUIsWUFBWSxXQUFXLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTCxJQUFJLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDckMsUUFBUSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxRQUFRLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFFBQVEsT0FBTztBQUNmLFlBQVksQ0FBQyxFQUFFLENBQUM7QUFDaEIsWUFBWSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEIsWUFBWSxDQUFDO0FBQ2IsWUFBWSxRQUFRO0FBQ3BCLFlBQVksS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ2hDLFlBQVksR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEdBQUcsUUFBUTtBQUN6QyxZQUFZLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztBQUNoQyxTQUFTLENBQUM7QUFDVixLQUFLO0FBQ0wsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDbkIsUUFBUSxNQUFNLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLElBQUksZUFBZSxDQUFDO0FBQzdHLFFBQVEsTUFBTSxPQUFPLEdBQUc7QUFDeEIsWUFBWSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSztBQUNoQyxZQUFZLENBQUM7QUFDYixTQUFTLENBQUM7QUFDVixRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDaEI7QUFDQSxZQUFZLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ25DLFlBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsU0FBUztBQUNULFFBQVEsSUFBSSxlQUFlLEVBQUU7QUFDN0IsWUFBWSxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQ3RDLFNBQVM7QUFDVCxhQUFhO0FBQ2I7QUFDQTtBQUNBLFlBQVksSUFBSSxHQUFHLEVBQUU7QUFDckIsZ0JBQWdCLGVBQWUsRUFBRSxDQUFDO0FBQ2xDLGdCQUFnQixjQUFjLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZGLGFBQWE7QUFDYixZQUFZLElBQUksQ0FBQztBQUNqQixnQkFBZ0IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQixZQUFZLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3RELFlBQVksbUJBQW1CLENBQUMsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSTtBQUN4QixnQkFBZ0IsSUFBSSxlQUFlLElBQUksR0FBRyxHQUFHLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDcEUsb0JBQW9CLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3RFLG9CQUFvQixlQUFlLEdBQUcsSUFBSSxDQUFDO0FBQzNDLG9CQUFvQixRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0Qsb0JBQW9CLElBQUksR0FBRyxFQUFFO0FBQzdCLHdCQUF3QixlQUFlLEVBQUUsQ0FBQztBQUMxQyx3QkFBd0IsY0FBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsSSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGdCQUFnQixJQUFJLGVBQWUsRUFBRTtBQUNyQyxvQkFBb0IsSUFBSSxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRTtBQUNwRCx3QkFBd0IsSUFBSSxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRCx3QkFBd0IsUUFBUSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pFLHdCQUF3QixJQUFJLENBQUMsZUFBZSxFQUFFO0FBQzlDO0FBQ0EsNEJBQTRCLElBQUksZUFBZSxDQUFDLENBQUMsRUFBRTtBQUNuRDtBQUNBLGdDQUFnQyxlQUFlLEVBQUUsQ0FBQztBQUNsRCw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDO0FBQ0EsZ0NBQWdDLElBQUksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5RCxvQ0FBb0MsT0FBTyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6Qix3QkFBd0IsZUFBZSxHQUFHLElBQUksQ0FBQztBQUMvQyxxQkFBcUI7QUFDckIseUJBQXlCLElBQUksR0FBRyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7QUFDM0Qsd0JBQXdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO0FBQzlELHdCQUF3QixDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pHLHdCQUF3QixJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGdCQUFnQixPQUFPLENBQUMsRUFBRSxlQUFlLElBQUksZUFBZSxDQUFDLENBQUM7QUFDOUQsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksT0FBTztBQUNYLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNmLFlBQVksSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDckMsZ0JBQWdCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNO0FBQ2xDO0FBQ0Esb0JBQW9CLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN0QyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGlCQUFpQixDQUFDLENBQUM7QUFDbkIsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQixnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxHQUFHLEdBQUc7QUFDZCxZQUFZLGVBQWUsRUFBRSxDQUFDO0FBQzlCLFlBQVksZUFBZSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDckQsU0FBUztBQUNULEtBQUssQ0FBQztBQUNOLENBQUM7QUFtRUQ7QUFDQSxNQUFNLE9BQU8sSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBd0dsRTtBQUNBLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUM1QyxJQUFJLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFJLE1BQU0sYUFBYSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ3pDLElBQUksSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQixJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDaEIsUUFBUSxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsUUFBUSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsRUFBRTtBQUNmLFlBQVksS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUU7QUFDakMsZ0JBQWdCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQy9CLG9CQUFvQixXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLGFBQWE7QUFDYixZQUFZLEtBQUssTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFO0FBQ2pDLGdCQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3pDLG9CQUFvQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLG9CQUFvQixhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxLQUFLLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRTtBQUNqQyxnQkFBZ0IsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFO0FBQ25DLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUM7QUFDNUIsWUFBWSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBQ3BDLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDRCxTQUFTLGlCQUFpQixDQUFDLFlBQVksRUFBRTtBQUN6QyxJQUFJLE9BQU8sT0FBTyxZQUFZLEtBQUssUUFBUSxJQUFJLFlBQVksS0FBSyxJQUFJLEdBQUcsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN6RixDQUFDO0FBaUpELFNBQVMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO0FBQ2pDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtBQUM5QyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFDRCxTQUFTLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUNwRCxJQUFJLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQzFFLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0FBQ0EsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNO0FBQzlCLFFBQVEsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckUsUUFBUSxJQUFJLFVBQVUsRUFBRTtBQUN4QixZQUFZLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQztBQUMvQyxTQUFTO0FBQ1QsYUFBYTtBQUNiO0FBQ0E7QUFDQSxZQUFZLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxTQUFTO0FBQ1QsUUFBUSxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkMsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBQ0QsU0FBUyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQ2pELElBQUksTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztBQUM1QixJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDOUIsUUFBUSxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRDtBQUNBO0FBQ0EsUUFBUSxFQUFFLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNDLFFBQVEsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLElBQUksSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN0QyxRQUFRLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxRQUFRLGVBQWUsRUFBRSxDQUFDO0FBQzFCLFFBQVEsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLEtBQUs7QUFDTCxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUNELFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0YsSUFBSSxNQUFNLGdCQUFnQixHQUFHLGlCQUFpQixDQUFDO0FBQy9DLElBQUkscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsSUFBSSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUM1QyxJQUFJLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLEdBQUc7QUFDOUIsUUFBUSxRQUFRLEVBQUUsSUFBSTtBQUN0QixRQUFRLEdBQUcsRUFBRSxJQUFJO0FBQ2pCO0FBQ0EsUUFBUSxLQUFLO0FBQ2IsUUFBUSxNQUFNLEVBQUUsSUFBSTtBQUNwQixRQUFRLFNBQVM7QUFDakIsUUFBUSxLQUFLLEVBQUUsWUFBWSxFQUFFO0FBQzdCO0FBQ0EsUUFBUSxRQUFRLEVBQUUsRUFBRTtBQUNwQixRQUFRLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsYUFBYSxFQUFFLEVBQUU7QUFDekIsUUFBUSxZQUFZLEVBQUUsRUFBRTtBQUN4QixRQUFRLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUM3RTtBQUNBLFFBQVEsU0FBUyxFQUFFLFlBQVksRUFBRTtBQUNqQyxRQUFRLEtBQUs7QUFDYixLQUFLLENBQUM7QUFDTixJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN0QixJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsUUFBUTtBQUNyQixVQUFVLFFBQVEsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksS0FBSztBQUNoRSxZQUFZLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN0RCxZQUFZLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQ25FLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQy9CLG9CQUFvQixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLGdCQUFnQixJQUFJLEtBQUs7QUFDekIsb0JBQW9CLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsYUFBYTtBQUNiLFlBQVksT0FBTyxHQUFHLENBQUM7QUFDdkIsU0FBUyxDQUFDO0FBQ1YsVUFBVSxFQUFFLENBQUM7QUFDYixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlCO0FBQ0EsSUFBSSxFQUFFLENBQUMsUUFBUSxHQUFHLGVBQWUsR0FBRyxlQUFlLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwRSxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUN4QixRQUFRLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUM3QjtBQUNBLFlBQVksRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbkUsU0FBUztBQUNULGFBQWE7QUFDYjtBQUNBLFlBQVksRUFBRSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzNDLFNBQVM7QUFDVCxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUs7QUFDekIsWUFBWSxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxRQUFRLGVBQWUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkUsUUFBUSxLQUFLLEVBQUUsQ0FBQztBQUNoQixLQUFLO0FBQ0wsSUFBSSxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFxQ0QsTUFBTSxlQUFlLENBQUM7QUFDdEIsSUFBSSxRQUFRLEdBQUc7QUFDZixRQUFRLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzdCLEtBQUs7QUFDTCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ3hCLFFBQVEsTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RixRQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsUUFBUSxPQUFPLE1BQU07QUFDckIsWUFBWSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RELFlBQVksSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO0FBQzVCLGdCQUFnQixTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxTQUFTLENBQUM7QUFDVixLQUFLO0FBQ0wsSUFBSSxJQUFJLEdBQUc7QUFDWDtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ3BDLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdGLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQ2xDLElBQUksWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdEQsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUMxQyxJQUFJLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM5RCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFDRCxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDMUIsSUFBSSxZQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pCLENBQUM7QUFnQkQsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFO0FBQzlGLElBQUksTUFBTSxTQUFTLEdBQUcsT0FBTyxLQUFLLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkcsSUFBSSxJQUFJLG1CQUFtQjtBQUMzQixRQUFRLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN6QyxJQUFJLElBQUksb0JBQW9CO0FBQzVCLFFBQVEsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQUksWUFBWSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNuRixJQUFJLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxRCxJQUFJLE9BQU8sTUFBTTtBQUNqQixRQUFRLFlBQVksQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDMUYsUUFBUSxPQUFPLEVBQUUsQ0FBQztBQUNsQixLQUFLLENBQUM7QUFDTixDQUFDO0FBQ0QsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDMUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUk7QUFDckIsUUFBUSxZQUFZLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN0RTtBQUNBLFFBQVEsWUFBWSxDQUFDLHVCQUF1QixFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFTRCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2xDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSTtBQUMxQixRQUFRLE9BQU87QUFDZixJQUFJLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzRCxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLENBQUM7QUFDRCxNQUFNLGtCQUFrQixTQUFTLGVBQWUsQ0FBQztBQUNqRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7QUFDekIsUUFBUSxJQUFJLENBQUMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNoRSxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7QUFDN0QsU0FBUztBQUNULFFBQVEsS0FBSyxFQUFFLENBQUM7QUFDaEIsS0FBSztBQUNMLElBQUksUUFBUSxHQUFHO0FBQ2YsUUFBUSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU07QUFDOUIsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDO0FBQzVELFNBQVMsQ0FBQztBQUNWLEtBQUs7QUFDTDs7QUNwL0NBLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLEFBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFO0FBQ3ZDLElBQUksSUFBSSxJQUFJLENBQUM7QUFDYixJQUFJLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFJLFNBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRTtBQUM1QixRQUFRLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRTtBQUM5QyxZQUFZLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDOUIsWUFBWSxJQUFJLElBQUksRUFBRTtBQUN0QixnQkFBZ0IsTUFBTSxTQUFTLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7QUFDM0QsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDaEUsb0JBQW9CLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDM0Isb0JBQW9CLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEQsaUJBQWlCO0FBQ2pCLGdCQUFnQixJQUFJLFNBQVMsRUFBRTtBQUMvQixvQkFBb0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3pFLHdCQUF3QixnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxxQkFBcUI7QUFDckIsb0JBQW9CLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEQsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFFO0FBQ3hCLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFO0FBQy9DLFFBQVEsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0MsUUFBUSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLFFBQVEsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN0QyxZQUFZLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3RDLFNBQVM7QUFDVCxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixRQUFRLE9BQU8sTUFBTTtBQUNyQixZQUFZLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUQsWUFBWSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUM5QixnQkFBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsYUFBYTtBQUNiLFlBQVksSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7QUFDdkIsZ0JBQWdCLElBQUksR0FBRyxJQUFJLENBQUM7QUFDNUIsYUFBYTtBQUNiLFNBQVMsQ0FBQztBQUNWLEtBQUs7QUFDTCxJQUFJLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQ3RDLENBQUM7O0FDN0RNLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM5QjtBQUNBLEFBQU8sTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7O0FDSmpDLFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNwQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2xCLENBQUMsSUFBSSxHQUFHLEVBQUU7QUFDVixFQUFFLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO0FBQy9CLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ25DLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3hDLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMxQixNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDZixNQUFNO0FBQ04sS0FBSztBQUNMLElBQUksTUFBTTtBQUNWLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFO0FBQ25CLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ25DLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUMxQixNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDZixNQUFNO0FBQ04sS0FBSztBQUNMLElBQUk7QUFDSixHQUFHLE1BQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ3BELEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN2QixHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7QUFDZCxHQUFHO0FBQ0gsRUFBRTtBQUNGLENBQUMsT0FBTyxHQUFHLENBQUM7QUFDWixDQUFDO0FBQ0Q7QUFDQSxBQUFlLGFBQVEsSUFBSTtBQUMzQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNwQixDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDOUIsRUFBRSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNqQyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDdkIsR0FBRyxHQUFHLElBQUksRUFBQztBQUNYLEdBQUc7QUFDSCxFQUFFO0FBQ0YsQ0FBQyxPQUFPLEdBQUcsQ0FBQztBQUNaLENBQUM7O0FDUk0sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQ2hDLEVBQUUsTUFBTSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7QUFDNUIsRUFBRSxPQUFPLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUNELEFBZUE7QUFDQSxBQUFPLFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7QUFDNUQsRUFBRSxJQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLEVBQUUsRUFBRTtBQUMxQyxJQUFJLE9BQU8sSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzVDLEdBQUcsTUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7QUFDakMsSUFBSSxPQUFPLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUNEO0FBQ0EsQUFBTyxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDL0IsQUFHQSxFQUFFLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsQixFQUFFLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxJQUFJLElBQUksR0FBRyxLQUFLLFVBQVUsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7QUFDdEUsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQ2pFSyxTQUFTLEdBQUcsRUFBRTtPQUVQLEtBQUssR0FBRyxLQUFLO09BQ2IsRUFBRSxHQUFHLEVBQUU7T0FFWixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUUzQixpQkFBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEdBQUcsaUJBQWlCLEdBQUcsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NDSTNELGNBQWMsQ0FBQyxNQUFNO0tBQ3hCLE1BQU0sS0FBSyxLQUFLO1NBQ1gsS0FBSztZQUNILE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLElBQUk7U0FDcEMsZUFBZTs7O3lCQUdBLE1BQU07Ozs7Y0FsQjVCLFNBQVMsR0FBRyxFQUFFO09BRVAsS0FBSyxHQUFHLEtBQUs7T0FDYixJQUFJLEdBQUcsS0FBSztPQUNaLEtBQUssR0FBRyxFQUFFO09BQ1YsTUFBTSxHQUFHLEVBQUU7T0FDWCxLQUFLLEdBQUcsRUFBRTtPQUNWLE1BQU0sR0FBRyxLQUFLO09BRW5CLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FZM0IsaUJBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxNQUFNO0lBQzFELGNBQWMsRUFBRSxLQUFLO0lBQ3JCLGFBQWEsRUFBRSxJQUFJO1dBQ1osS0FBSyxLQUFLLEtBQUs7Y0FDWixLQUFLLEtBQUssS0FBSztlQUNkLE1BQU0sS0FBSyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NDMUIxQixTQUFTLEdBQUcsRUFBRTtPQUVQLElBQUksR0FBRyxHQUFHO09BRWYsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBRTNCLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkNrRDdCLEdBQVMsNEJBQUksR0FBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lDQUE3QixHQUFTLDRCQUFJLEdBQWdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytCQWhCN0IsR0FBUyw0QkFBSSxHQUFnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBQTdCLEdBQVMsNEJBQUksR0FBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NBeEN2QyxTQUFTLEdBQUcsRUFBRTtPQUVQLE1BQU0sR0FBRyxLQUFLO09BQ2QsS0FBSyxHQUFHLEtBQUs7T0FDYixRQUFRLEdBQUcsU0FBUztPQUNwQixLQUFLLEdBQUcsS0FBSztPQUNiLEtBQUssR0FBRyxXQUFXO09BQ25CLFFBQVEsR0FBRyxLQUFLO09BQ2hCLElBQUksR0FBRyxFQUFFO09BQ1QsRUFBRSxHQUFHLEVBQUU7T0FDUCxPQUFPLEdBQUcsS0FBSztPQUNmLElBQUksR0FBRyxFQUFFO09BQ1QsS0FBSyxHQUFHLEVBQUU7T0FDVixLQUFLLEdBQUcsRUFBRTtPQUVmLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBRTNCLGlCQUFHLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWTs7O0dBRW5DLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQ2YsU0FBUyxJQUNQLEtBQUssSUFDUCxLQUFLLElBQUksS0FBSyxFQUNkLEtBQUssVUFBVSxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUUsSUFBSSxLQUFLLElBQ2pELElBQUksVUFBVSxJQUFJLEtBQUssS0FBSyxFQUM1QixLQUFLLEdBQUcsV0FBVyxHQUFHLEtBQUssSUFDekIsTUFBTTs7OztHQUdWLGlCQUFHLGdCQUFnQixHQUFHLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0NoQm5DLGdCQUFnQixDQUFDLFFBQVE7S0FDNUIsUUFBUSxLQUFLLEtBQUs7U0FDYixLQUFLO1lBQ0gsUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSTtTQUN4QyxhQUFhOzs7Z0JBRVAsUUFBUTs7OztjQW5CckIsU0FBUyxHQUFHLEVBQUU7T0FFUCxJQUFJLEdBQUcsS0FBSztPQUNaLEtBQUssR0FBRyxLQUFLO09BQ2IsUUFBUSxHQUFHLEtBQUs7T0FDaEIsVUFBVSxHQUFHLEVBQUU7T0FDZixTQUFTLEdBQUcsS0FBSztPQUNqQixJQUFJLEdBQUcsS0FBSztPQUNaLE1BQU0sR0FBRyxLQUFLO09BQ2QsSUFBSSxHQUFHLEtBQUs7T0FFakIsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQVczQixpQkFBRyxPQUFPLEdBQUcsSUFBSSxDQUNmLFNBQVMsRUFDVCxNQUFNLEdBQUcsWUFBWSxHQUFHLEtBQUssRUFDN0IsVUFBVSxzQkFBc0IsVUFBVSxLQUFLLEtBQUssRUFDcEQsZ0JBQWdCLENBQUMsUUFBUTtJQUV2QixVQUFVLEVBQUUsSUFBSTtJQUNoQixrQkFBa0IsRUFBRSxJQUFJLElBQUksSUFBSTtJQUNoQyxXQUFXLEVBQUUsS0FBSztJQUNsQixtQkFBbUIsRUFBRSxJQUFJLElBQUksS0FBSztJQUNsQyxlQUFlLEVBQUUsU0FBUztJQUMxQixVQUFVLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN3QnRCLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyQixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMzQixDQUFDOztBQ0NELFNBQVMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLEdBQUcsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFFLEVBQUU7QUFDdkUsSUFBSSxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxJQUFJLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNuQyxJQUFJLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUMsSUFBSSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELElBQUksTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRCxJQUFJLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsSUFBSSxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pELElBQUksTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlELElBQUksTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDcEUsSUFBSSxPQUFPO0FBQ1gsUUFBUSxLQUFLO0FBQ2IsUUFBUSxRQUFRO0FBQ2hCLFFBQVEsTUFBTTtBQUNkLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0FBQ3JDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUN0QyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO0FBQ2hELFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQztBQUN0RCxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO0FBQzlDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDcEQsWUFBWSxDQUFDLGtCQUFrQixFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7QUFDMUQsWUFBWSxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUM7QUFDaEUsS0FBSyxDQUFDO0FBQ04sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lEQ3ZCa0IsR0FBVTs4Q0FDWixHQUFTO2dEQUNQLEdBQVM7NkNBQ1gsR0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQVZwQixHQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQU4sR0FBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BckRILElBQUksU0FBUyxTQUFTO09BRWpCLE1BQU0sR0FBRyxLQUFLO2NBQ3JCLFNBQVMsR0FBRyxFQUFFO09BRVAsTUFBTSxHQUFHLEtBQUs7T0FDZCxVQUFVLEdBQUcsSUFBSTtPQUNqQixTQUFTLEdBQUcsSUFBSTtPQUNoQixTQUFTLEdBQUcsSUFBSTtPQUNoQixRQUFRLEdBQUcsSUFBSTtPQUNmLE1BQU0sR0FBRyxLQUFLO09BRW5CLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTztLQVF2QixXQUFXLEdBQUcsQ0FBQztLQUNmLGFBQWEsR0FBRyxLQUFLO09BRW5CLFFBQVE7Q0FDZCxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUM7Q0FDbEIsUUFBUSxDQUFDLElBQUksSUFBSSxHQUFHO0NBQ3BCLFFBQVEsQ0FBQyxJQUFJLElBQUksR0FBRztDQUNwQixRQUFRLENBQUMsSUFBSSxJQUFJLEdBQUc7Q0FDcEIsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJO09BRWYsUUFBUSxHQUFHLHFCQUFxQjs7VUFFN0IsTUFBTTtFQUNiLFFBQVEsQ0FBQyxRQUFRLElBQ1AsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXBCbEIsaUJBQUcsT0FBTyxHQUFHLElBQUksQ0FDZixTQUFTO0dBRVQsTUFBTSxJQUFJLGlCQUFpQjs7OztHQXFCN0IsS0FBTyxNQUFNLElBQUksTUFBTTtRQUNqQixXQUFXLElBQUksUUFBUSxDQUFDLE1BQU0sTUFBTSxNQUFNO3FCQUM1QyxNQUFNLEdBQUcsSUFBSTtzQkFDYixhQUFhLEdBQUcsSUFBSTtLQUNwQixNQUFNO2VBQ0csV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEtBQUssYUFBYTtxQkFDeEQsTUFBTSxHQUFHLEtBQUs7c0JBQ2QsYUFBYSxHQUFHLEtBQUs7S0FDckIsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xETCxNQUFNLGFBQWEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQ0t6QyxPQUFPLEdBQUcsYUFBYTtDQUMzQixVQUFVLENBQUMsaUJBQWlCLEVBQUUsT0FBTztjQUVqQyxTQUFTLEdBQUcsRUFBRTtPQUVQLFNBQVMsR0FBRyxNQUFNO09BQ2xCLEtBQUssR0FBRyxLQUFLO09BQ2IsTUFBTSxHQUFHLEtBQUs7T0FDZCxHQUFHLEdBQUcsS0FBSztPQUNYLE1BQU0sR0FBRyxLQUFLO09BQ2QsU0FBUyxHQUFHLEtBQUs7T0FDakIsSUFBSSxHQUFHLEVBQUU7T0FDVCxNQUFNLEdBQUcsU0FBUztPQUNsQixRQUFRLEdBQUcsS0FBSztPQUNoQixrQkFBa0IsR0FBRyxLQUFLO09BQzFCLE1BQU0sR0FBRyxLQUFLO09BRW5CLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTztPQUVyQixlQUFlLElBQUksSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTzs7S0FFbEQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxTQUFTLE9BQU8sQ0FBQztZQUNqQyxLQUFLLDZCQUNlLFNBQVM7OztLQUlyQyxTQUFTOztVQWlESixtQkFBbUIsQ0FBQyxDQUFDO01BQ3hCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUM7O01BRzdELFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FDM0IsU0FBUyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQ3JCLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQzs7OztFQUt0QyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ExRFYsa0JBQUcsZUFBZSxNQUNoQixrQkFBa0IsSUFDbEIsU0FBUyxXQUNGLFNBQVMsQ0FBQyxhQUFhLEtBQUssVUFBVSxJQUM3QyxTQUFTLENBQUMsYUFBYSxDQUFDLFNBQVM7Ozs7R0FHbkMsaUJBQUcsT0FBTyxHQUFHLElBQUksQ0FDZixTQUFTLEVBQ1QsU0FBUyxLQUFLLE1BQU0sV0FBVyxTQUFTLElBQ3hDLEdBQUcsSUFBSSxNQUFNLEdBQUcsUUFBUSxHQUFHLEtBQUssRUFDaEMsa0JBQWtCLElBQUksZUFBZSxHQUFHLFFBQVEsR0FBRyxLQUFLO29CQUV0QyxTQUFTLEtBQUssU0FBUztJQUN2QyxXQUFXLEVBQUUsS0FBSztrQkFDSixJQUFJLE9BQU8sSUFBSTtJQUM3QixRQUFRLEdBQUcsS0FBSyxLQUFLLFNBQVM7SUFDOUIsSUFBSSxFQUFFLE1BQU07SUFDWixVQUFVLEVBQUUsR0FBRzs7Ozs7R0FJbkI7ZUFDYSxRQUFRLEtBQUssV0FBVztTQUM3QixNQUFNO09BQ1AsT0FBTyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFDNUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxJQUFJOztPQUczRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxJQUM1QyxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFLElBQUk7Ozs7Ozs7R0FNckU7SUFDRSxPQUFPLENBQUMsTUFBTTs7TUFFVixNQUFNO01BQ04sTUFBTTtNQUNOLFNBQVMsRUFBRSxTQUFTLEtBQUssTUFBTSxJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsU0FBUztNQUM1RCxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3lCQ3BEUCxHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VEQUFULEdBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQXRCWixTQUFTLEdBQUcsRUFBRTtPQUVQLFFBQVEsR0FBRyxLQUFLO09BQ2hCLFNBQVMsR0FBRyxNQUFNO09BQ2xCLEtBQUssR0FBRyxLQUFLO09BQ2IsR0FBRyxHQUFHLEtBQUs7T0FDWCxNQUFNLEdBQUcsS0FBSztPQUNkLFNBQVMsR0FBRyxLQUFLO09BQ2pCLElBQUksR0FBRyxFQUFFO09BQ1QsUUFBUSxHQUFHLEtBQUs7T0FDaEIsa0JBQWtCLEdBQUcsS0FBSztPQUMxQixNQUFNLEdBQUcsS0FBSztPQUNkLFdBQVcsR0FBRyxLQUFLO0tBRTFCLE1BQU0sR0FBRyxXQUFXO09BQ2xCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7cUNBTVosTUFBTSxJQUFJLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0NDZ0RuQixHQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFQRyxHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhDQUFULEdBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnREFOeEIsR0FBWTs7Ozs7MkVBTUcsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBYlQsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzZDQUFULEdBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0Q0FMeEIsR0FBWTs7Ozs7MkVBS0csR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBMkJULEdBQVM7Ozs7Ozs7Ozs7NkNBQVQsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJFQUFULEdBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Y0F4QjVCLEdBQUcsUUFBSyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWpEaEIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUI7OztjQUV4QyxTQUFTLEdBQUcsRUFBRTtPQUVQLEtBQUssR0FBRyxLQUFLO09BQ2IsS0FBSyxHQUFHLFdBQVc7T0FDbkIsUUFBUSxHQUFHLEtBQUs7T0FDaEIsWUFBWSxHQUFHLElBQUk7T0FDbkIsU0FBUyxHQUFHLGlCQUFpQjtPQUM3QixLQUFLLEdBQUcsS0FBSztPQUNiLEdBQUcsR0FBRyxLQUFLO09BQ1gsSUFBSSxHQUFHLEVBQUU7T0FDVCxHQUFHLEdBQUcsSUFBSTtPQUNWLE9BQU8sR0FBRyxLQUFLO09BRXBCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTzs7VUFRbEIsWUFBWSxDQUFDLENBQUM7TUFDakIsUUFBUTtHQUNWLENBQUMsQ0FBQyxjQUFjOzs7O01BSWQsR0FBRztHQUNMLENBQUMsQ0FBQyxjQUFjOzs7RUFHbEIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FoQm5CLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUztJQUN6QixpQkFBaUIsRUFBRSxLQUFLLElBQUksS0FBSztJQUNqQyx1QkFBdUIsRUFBRSxLQUFLO0lBQzlCLFVBQVUsRUFBRSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQ3RCWCxPQUFPLEdBQUcsVUFBVSxDQUFDLGlCQUFpQjs7O2NBRXhDLFNBQVMsR0FBRyxFQUFFO09BRVAsS0FBSyxHQUFHLEtBQUs7T0FFbEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUUzQixpQkFBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlO0lBQzFDLHFCQUFxQixFQUFFLEtBQUs7SUFDNUIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0RDc0NlLEdBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQ0FKcEIsR0FBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpREFKYixHQUFlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dEQUxoQixHQUFlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW5DM0MsT0FBTyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUI7OztjQUV4QyxTQUFTLEdBQUcsRUFBRTtPQUdQLE1BQU0sR0FBRyxLQUFLO09BQ2QsUUFBUSxHQUFHLEtBQUs7T0FDaEIsT0FBTyxHQUFHLEtBQUs7T0FDZixNQUFNLEdBQUcsS0FBSztPQUNkLE1BQU0sR0FBRyxJQUFJO09BQ2IsSUFBSSxHQUFHLEVBQUU7T0FFZCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU87O1VBVWxCLGVBQWUsQ0FBQyxDQUFDO01BQ3BCLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTztHQUMvQixDQUFDLENBQUMsY0FBYzs7OztNQUlkLE1BQU07R0FDUixRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZnJCLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUztJQUN6QixRQUFRO0lBQ1IsZUFBZSxHQUFHLE9BQU8sS0FBSyxNQUFNO0lBQzVCLE1BQU07SUFDZCxpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLGtCQUFrQixFQUFFLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Y0NwQnpCLFNBQVMsR0FBRyxFQUFFO09BRVAsS0FBSyxHQUFHLEtBQUs7T0FFbEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBRTNCLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQ2YsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEdBQUcsa0JBQWtCLEdBQUcsS0FBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Y0NUaEMsU0FBUyxHQUFHLEVBQUU7T0FFUCxNQUFNLEdBQUcsS0FBSztPQUVuQixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FFM0IsaUJBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxHQUFHLGFBQWEsR0FBRyxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQ052RCxTQUFTLEdBQUcsRUFBRTtPQUVQLElBQUksR0FBRyxFQUFFO09BRWQsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBRTNCLGlCQUFHLE9BQU8sR0FBRyxJQUFJLENBQ2YsU0FBUyxFQUNULGFBQWEsRUFDYixJQUFJLGtCQUFrQixJQUFJLEtBQUssSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQ1RqQyxTQUFTLEdBQUcsRUFBRTtPQUVQLFNBQVM7T0FFZCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU87O01BRXRCLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsT0FBTyxDQUFDO1lBQ3ZDLEtBQUssNERBQzhDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUl4RSxpQkFBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsaUJBQWlCLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQ1ZqRCxTQUFTLEdBQUcsRUFBRTtPQUVaLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTztPQUdoQixNQUFNLEdBQUcsS0FBSztPQUNkLEtBQUssR0FBRyxLQUFLO09BQ2IsSUFBSSxHQUFHLEVBQUU7WUFDVCxJQUFJO09BRUosRUFBRSxHQUFHLEVBQUU7T0FDUCxFQUFFLEdBQUcsRUFBRTtPQUNQLEVBQUUsR0FBRyxFQUFFO09BQ1AsRUFBRSxHQUFHLEVBQUU7T0FDUCxFQUFFLEdBQUcsRUFBRTtPQUNQLEVBQUUsR0FBRyxFQUFFO09BRVosU0FBUyxLQUNiLEVBQUUsRUFDRixFQUFFLEVBQ0YsRUFBRSxFQUNGLEVBQUUsRUFDRixFQUFFO09BRU8sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUztPQUVuQyxVQUFVOztDQUVoQixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVE7TUFDakIsVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFROztPQUU1QixVQUFVLElBQUksVUFBVSxLQUFLLEVBQUU7Ozs7UUFJOUIsSUFBSSxHQUFHLFFBQVEsS0FBSyxJQUFJO01BQzFCLFFBQVE7O01BRVIsUUFBUSxDQUFDLFVBQVU7U0FDZixlQUFlLEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxRQUFRO0dBQ2pELFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxJQUFJOztHQUU3RCxVQUFVLENBQUMsSUFBSSxDQUNiLElBQUk7S0FDRCxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLEVBQUU7YUFDNUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxLQUFLLEtBQ3pDLFVBQVUsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLEtBQUssS0FBSyxDQUFDO2NBQ2xDLGVBQWUsR0FBRyxVQUFVLENBQUMsTUFBTSxLQUMzQyxVQUFVLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQzs7O0dBSWxELFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVU7R0FDeEQsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQUk1QixpQkFBRyxPQUFPLEdBQUcsSUFBSSxDQUNmLFNBQVMsRUFDVCxNQUFNLEdBQUcsU0FBUyxHQUFHLEtBQUssRUFDMUIsS0FBSyxHQUFHLGtCQUFrQixHQUFHLEtBQUssRUFDbEMsSUFBSSxxQkFBcUIsSUFBSSxLQUFLLEtBQUssRUFDdkMsVUFBVSxFQUNWLFVBQVUsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEdBQUcsS0FBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VDR3pDLEdBQUksUUFBSyxNQUFNO2VBa0JWLEdBQUksUUFBSyxVQUFVO2VBa0JuQixHQUFJLFFBQUssT0FBTztlQWtCaEIsR0FBSSxRQUFLLE1BQU07ZUFrQmYsR0FBSSxRQUFLLFVBQVU7ZUFtQm5CLEdBQUksUUFBSyxPQUFPO2VBa0JoQixHQUFJLFFBQUssS0FBSztlQWtCZCxHQUFJLFFBQUssUUFBUTtlQWtCakIsR0FBSSxRQUFLLE1BQU07ZUFrQmYsR0FBSSxRQUFLLE1BQU07ZUFrQmYsR0FBSSxRQUFLLFVBQVU7ZUFrQm5CLEdBQUksUUFBSyxPQUFPO2VBa0JoQixHQUFJLFFBQUssUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQTFOeEIsR0FBRyxTQUFLLE9BQU87Y0E4T1YsR0FBRyxTQUFLLFVBQVU7Y0FnQmxCLEdBQUcsU0FBSyxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWZqQyxZQUFZO0NBQ25CLEtBQUssQ0FBQyxjQUFjOzs7O09BSlgsS0FBSztPQUNMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDSlgsR0FBUTsrQkFNUixHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0VBUEksR0FBUzs7Ozs7Ozs7Ozs7O29EQUFvQixHQUFXOzs7b0JBQ3JELEdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBTVIsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEdBUEksR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BZHJCLFFBQVEsR0FBRyxxQkFBcUI7T0FFM0IsSUFBSSxHQUFHLEVBQUU7T0FDVCxJQUFJLEdBQUcsb0JBQW9CO09BQzNCLFFBQVEsR0FBRyxLQUFLO09BQ2hCLFNBQVMsR0FBRyxLQUFLO2NBRXhCLFNBQVMsR0FBRyxFQUFFOztPQUVaLFdBQVc7RUFDZixRQUFRLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQ21FQyxHQUFPLFFBQUssU0FBUyxtQkFBSSxHQUFVLFFBQUssbUJBQW1CO01BQUcsUUFBUTtNQUFHLEVBQUU7Ozs7Ozs7Ozs7O3VCQVEzRSxHQUFPLFFBQUssU0FBUyxtQkFBSSxHQUFVLFFBQUssZUFBZTtNQUFHLFFBQVE7TUFBRyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFSdkUsR0FBTyxRQUFLLFNBQVMsbUJBQUksR0FBVSxRQUFLLG1CQUFtQjtLQUFHLFFBQVE7S0FBRyxFQUFFOzs7OztvRkFRM0UsR0FBTyxRQUFLLFNBQVMsbUJBQUksR0FBVSxRQUFLLGVBQWU7S0FBRyxRQUFRO0tBQUcsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQ0F5Q3RFLEdBQW9CLE1BQUcsV0FBVyxHQUFHLEVBQUU7Ozs7Ozs7Ozs7OztvREFEckMsR0FBb0I7Ozs7cUNBTWQsR0FBb0I7Ozs7Ozs7Ozs0QkFhNUIsR0FBVyxNQUFHLFdBQVcsR0FBRyxFQUFFOzs7Ozs7Ozs7Ozs7MkNBRDVCLEdBQVc7Ozs7NEJBTUwsR0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7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
