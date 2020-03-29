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
			add_location(nav, file$1, 34, 0, 768);
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
	let { sticky = true } = $$props;
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
	let span0;
	let t0;
	let t1;
	let span1;
	let t2;

	const block = {
		c: function create() {
			span0 = element("span");
			t0 = text("λ");
			t1 = text(/*title*/ ctx[1]);
			span1 = element("span");
			t2 = text(".js");
			this.h();
		},
		l: function claim(nodes) {
			span0 = claim_element(nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t0 = claim_text(span0_nodes, "λ");
			span0_nodes.forEach(detach_dev);
			t1 = claim_text(nodes, /*title*/ ctx[1]);
			span1 = claim_element(nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);
			t2 = claim_text(span1_nodes, ".js");
			span1_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span0, "class", "l-logo-span");
			add_location(span0, file$h, 30, 24, 1402);
			attr_dev(span1, "class", "l-logo-span");
			add_location(span1, file$h, 30, 65, 1443);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span0, anchor);
			append_dev(span0, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, span1, anchor);
			append_dev(span1, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(span1);
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
			add_location(i, file$h, 41, 12, 1819);
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
			add_location(i, file$h, 49, 10, 2061);
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
			add_location(i, file$h, 54, 51, 2256);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "settings");
			add_location(a, file$h, 54, 10, 2215);
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
			add_location(i, file$h, 57, 57, 2406);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "activity_log");
			add_location(a, file$h, 57, 12, 2361);
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
			add_location(i, file$h, 62, 12, 2634);
			attr_dev(a, "class", "dropdown-item");
			attr_dev(a, "href", "pages/authentication/login");
			add_location(a, file$h, 61, 12, 2561);
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
			add_location(i, file$j, 61, 10, 1756);
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
			add_location(i, file$j, 70, 10, 2078);
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
			add_location(i, file$j, 71, 10, 2134);
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
			add_location(path, file$j, 110, 12, 3596);
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
			add_location(svg, file$j, 99, 10, 3225);
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
			add_location(i, file$j, 121, 10, 4247);
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
			add_location(i, file$j, 132, 14, 4692);
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
			add_location(i, file$j, 150, 14, 5458);
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
			add_location(i, file$j, 170, 10, 6265);
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
			add_location(i, file$j, 180, 10, 6569);
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
			add_location(div0, file$j, 52, 8, 1452);
			attr_dev(div1, "class", "l-proton-sidenav-menu-heading");
			add_location(div1, file$j, 63, 8, 1831);
			attr_dev(div2, "class", "l-proton-sidenav-menu-heading");
			add_location(div2, file$j, 161, 8, 5967);
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
			add_location(div0, file$j, 50, 4, 1394);
			attr_dev(div1, "class", "small");
			add_location(div1, file$j, 185, 6, 6712);
			attr_dev(div2, "class", "l-proton-sidenav-footer");
			add_location(div2, file$j, 184, 4, 6667);
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
			add_location(div, file$j, 46, 0, 1222);
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
	let isLayoutOpen = false;
	let isPageOpen = false;
	let isAuthenticationOpen = false;
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
		js: () => import('./index.3bf885e9.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./activity_log.1e5e0a18.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./settings.85473ed0.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./static_navigation.bb21a396.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./light_sidenav.b9210f92.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./charts.5de721ed.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./tables.bc2f2aba.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./_layout.259c44ed.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./_layout.a9e70d5d.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./forget_password.3931a421.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./register.e2821229.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./login.10ee3381.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./_layout.bdea77ea.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./error_401.ff756c6a.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./error_404.9d362d67.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./error_500.a4be2bee.js'),
		css: ["client.f0d94f79.css"]
	},
	{
		js: () => import('./index.045f9340.js'),
		css: ["index.045f9340.css","client.f0d94f79.css"]
	},
	{
		js: () => import('./[slug].48f10cb8.js'),
		css: ["[slug].48f10cb8.css","client.f0d94f79.css"]
	},
	{
		js: () => import('./ui.007f064c.js'),
		css: ["client.f0d94f79.css"]
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
	},

	{
		// ui.svelte
		pattern: /^\/ui\/?$/,
		parts: [
			{ i: 18 }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmYwZDk0Zjc5LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY2xzeC9kaXN0L2Nsc3gubS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvdXRpbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NvbnRhaW5lci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL05hdmJhci5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL05hdmJhckJyYW5kLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvQnV0dG9uLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvTmF2LnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvZWFzaW5nL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvdHJhbnNpdGlvbi9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Db250ZXh0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL1VuY29udHJvbGxlZERyb3Bkb3duLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvRHJvcGRvd25Ub2dnbGUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bk1lbnUuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bkl0ZW0uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9MaXN0R3JvdXAuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9Gb3JtLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXRHcm91cC5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0lucHV0R3JvdXBBZGRvbi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlc3RyYXAvc3JjL0xhYmVsLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGVzdHJhcC9zcmMvSW5wdXQuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9OYXZiYXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU2lkZWJhckl0ZW0uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU2lkZWJhci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19sYXlvdXQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL0FwcC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvbWFuaWZlc3QtY2xpZW50Lm1qcyIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9hcHAubWpzIiwiLi4vLi4vLi4vc3JjL2NsaWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcbiAgICBpZiAoc3RvcmUgIT0gbnVsbCAmJiB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIC4uLmNhbGxiYWNrcykge1xuICAgIGlmIChzdG9yZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub29wO1xuICAgIH1cbiAgICBjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZSguLi5jYWxsYmFja3MpO1xuICAgIHJldHVybiB1bnN1Yi51bnN1YnNjcmliZSA/ICgpID0+IHVuc3ViLnVuc3Vic2NyaWJlKCkgOiB1bnN1Yjtcbn1cbmZ1bmN0aW9uIGdldF9zdG9yZV92YWx1ZShzdG9yZSkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBzdWJzY3JpYmUoc3RvcmUsIF8gPT4gdmFsdWUgPSBfKSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbik7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICByZXR1cm4gZGVmaW5pdGlvblsxXSAmJiBmblxuICAgICAgICA/IGFzc2lnbigkJHNjb3BlLmN0eC5zbGljZSgpLCBkZWZpbml0aW9uWzFdKGZuKGN0eCkpKVxuICAgICAgICA6ICQkc2NvcGUuY3R4O1xufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvblsyXSAmJiBmbikge1xuICAgICAgICBjb25zdCBsZXRzID0gZGVmaW5pdGlvblsyXShmbihkaXJ0eSkpO1xuICAgICAgICBpZiAodHlwZW9mICQkc2NvcGUuZGlydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGgubWF4KCQkc2NvcGUuZGlydHkubGVuZ3RoLCBsZXRzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkW2ldID0gJCRzY29wZS5kaXJ0eVtpXSB8IGxldHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkJHNjb3BlLmRpcnR5IHwgbGV0cztcbiAgICB9XG4gICAgcmV0dXJuICQkc2NvcGUuZGlydHk7XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICBsZXQgcmFuID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChyYW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG51bGxfdG9fZW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5mdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUgPSByZXQpIHtcbiAgICBzdG9yZS5zZXQodmFsdWUpO1xuICAgIHJldHVybiByZXQ7XG59XG5jb25zdCBoYXNfcHJvcCA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuZnVuY3Rpb24gYWN0aW9uX2Rlc3Ryb3llcihhY3Rpb25fcmVzdWx0KSB7XG4gICAgcmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5cbmNvbnN0IGlzX2NsaWVudCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xubGV0IG5vdyA9IGlzX2NsaWVudFxuICAgID8gKCkgPT4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgOiAoKSA9PiBEYXRlLm5vdygpO1xubGV0IHJhZiA9IGlzX2NsaWVudCA/IGNiID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYikgOiBub29wO1xuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG5mdW5jdGlvbiBzZXRfbm93KGZuKSB7XG4gICAgbm93ID0gZm47XG59XG5mdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG4gICAgcmFmID0gZm47XG59XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuICAgIHRhc2tzLmZvckVhY2godGFzayA9PiB7XG4gICAgICAgIGlmICghdGFzay5jKG5vdykpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRhc2suZigpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRhc2tzLnNpemUgIT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xufVxuLyoqXG4gKiBGb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5IVxuICovXG5mdW5jdGlvbiBjbGVhcl9sb29wcygpIHtcbiAgICB0YXNrcy5jbGVhcigpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHRhc2sgdGhhdCBydW5zIG9uIGVhY2ggcmFmIGZyYW1lXG4gKiB1bnRpbCBpdCByZXR1cm5zIGEgZmFsc3kgdmFsdWUgb3IgaXMgYWJvcnRlZFxuICovXG5mdW5jdGlvbiBsb29wKGNhbGxiYWNrKSB7XG4gICAgbGV0IHRhc2s7XG4gICAgaWYgKHRhc2tzLnNpemUgPT09IDApXG4gICAgICAgIHJhZihydW5fdGFza3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKGZ1bGZpbGwgPT4ge1xuICAgICAgICAgICAgdGFza3MuYWRkKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgYWJvcnQoKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBub2RlKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5mdW5jdGlvbiBkZXRhY2gobm9kZSkge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfZWFjaChpdGVyYXRpb25zLCBkZXRhY2hpbmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZXJhdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnNbaV0pXG4gICAgICAgICAgICBpdGVyYXRpb25zW2ldLmQoZGV0YWNoaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBlbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRfaXMobmFtZSwgaXMpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lLCB7IGlzIH0pO1xufVxuZnVuY3Rpb24gb2JqZWN0X3dpdGhvdXRfcHJvcGVydGllcyhvYmosIGV4Y2x1ZGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNfcHJvcChvYmosIGspXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAmJiBleGNsdWRlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0YXJnZXRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuZnVuY3Rpb24gdGV4dChkYXRhKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuZnVuY3Rpb24gc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRleHQoJyAnKTtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiB0ZXh0KCcnKTtcbn1cbmZ1bmN0aW9uIGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwcmV2ZW50X2RlZmF1bHQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzdG9wX3Byb3BhZ2F0aW9uKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNlbGYoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcylcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICBlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSlcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgbm9kZS5zdHlsZS5jc3NUZXh0ID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRlc2NyaXB0b3JzW2tleV0gJiYgZGVzY3JpcHRvcnNba2V5XS5zZXQpIHtcbiAgICAgICAgICAgIG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhKG5vZGUsIHByb3AsIHZhbHVlKSB7XG4gICAgaWYgKHByb3AgaW4gbm9kZSkge1xuICAgICAgICBub2RlW3Byb3BdID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiB4bGlua19hdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cF92YWx1ZShncm91cCkge1xuICAgIGNvbnN0IHZhbHVlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLnB1c2goZ3JvdXBbaV0uX192YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gJycgPyB1bmRlZmluZWQgOiArdmFsdWU7XG59XG5mdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFycmF5LnB1c2goeyBzdGFydDogcmFuZ2VzLnN0YXJ0KGkpLCBlbmQ6IHJhbmdlcy5lbmQoaSkgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbn1cbmZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmNoaWxkTm9kZXMpO1xufVxuZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcywgc3ZnKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVOYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmcgPyBzdmdfZWxlbWVudChuYW1lKSA6IGVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSAnJyArIGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0KGRhdGEpO1xufVxuZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcbiAgICByZXR1cm4gY2xhaW1fdGV4dChub2RlcywgJyAnKTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhKHRleHQsIGRhdGEpIHtcbiAgICBkYXRhID0gJycgKyBkYXRhO1xuICAgIGlmICh0ZXh0LmRhdGEgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9IG51bGwgfHwgaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5vcHRpb25zW2ldO1xuICAgICAgICBpZiAob3B0aW9uLl9fdmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IH52YWx1ZS5pbmRleE9mKG9wdGlvbi5fX3ZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJykgfHwgc2VsZWN0Lm9wdGlvbnNbMF07XG4gICAgcmV0dXJuIHNlbGVjdGVkX29wdGlvbiAmJiBzZWxlY3RlZF9vcHRpb24uX192YWx1ZTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9tdWx0aXBsZV92YWx1ZShzZWxlY3QpIHtcbiAgICByZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIG9wdGlvbiA9PiBvcHRpb24uX192YWx1ZSk7XG59XG5mdW5jdGlvbiBhZGRfcmVzaXplX2xpc3RlbmVyKGVsZW1lbnQsIGZuKSB7XG4gICAgaWYgKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBvYmplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvaW50ZXItZXZlbnRzOiBub25lOyB6LWluZGV4OiAtMTsnKTtcbiAgICBvYmplY3Quc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgb2JqZWN0LnR5cGUgPSAndGV4dC9odG1sJztcbiAgICBvYmplY3QudGFiSW5kZXggPSAtMTtcbiAgICBsZXQgd2luO1xuICAgIG9iamVjdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHdpbiA9IG9iamVjdC5jb250ZW50RG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmbik7XG4gICAgfTtcbiAgICBpZiAoL1RyaWRlbnQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChvYmplY3QpO1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmplY3QuZGF0YSA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FuY2VsOiAoKSA9PiB7XG4gICAgICAgICAgICB3aW4gJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIgJiYgd2luLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZuKTtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQob2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3RbdG9nZ2xlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG59XG5mdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgZGV0YWlsKTtcbiAgICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIHF1ZXJ5X3NlbGVjdG9yX2FsbChzZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihodG1sLCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZSA9IGVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMudShodG1sKTtcbiAgICB9XG4gICAgbSh0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGluc2VydCh0YXJnZXQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgfVxuICAgIHUoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIHAoaHRtbCkge1xuICAgICAgICB0aGlzLmQoKTtcbiAgICAgICAgdGhpcy51KGh0bWwpO1xuICAgICAgICB0aGlzLm0odGhpcy50LCB0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxubGV0IHN0eWxlc2hlZXQ7XG5sZXQgYWN0aXZlID0gMDtcbmxldCBjdXJyZW50X3J1bGVzID0ge307XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgbGV0IGkgPSBzdHIubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBoYXNoID4+PiAwO1xufVxuZnVuY3Rpb24gY3JlYXRlX3J1bGUobm9kZSwgYSwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNlLCBmbiwgdWlkID0gMCkge1xuICAgIGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcbiAgICBsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuICAgIGZvciAobGV0IHAgPSAwOyBwIDw9IDE7IHAgKz0gc3RlcCkge1xuICAgICAgICBjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuICAgICAgICBrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuICAgIH1cbiAgICBjb25zdCBydWxlID0ga2V5ZnJhbWVzICsgYDEwMCUgeyR7Zm4oYiwgMSAtIGIpfX1cXG59YDtcbiAgICBjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgaWYgKCFzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBzdHlsZS5zaGVldDtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50X3J1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogYGB9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpXG4gICAgICAgIC5zcGxpdCgnLCAnKVxuICAgICAgICAuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICBpZiAobmFtZSAmJiAhLS1hY3RpdmUpXG4gICAgICAgIGNsZWFyX3J1bGVzKCk7XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKVxuICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICBjdXJyZW50X3J1bGVzID0ge307XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9hbmltYXRpb24obm9kZSwgZnJvbSwgZm4sIHBhcmFtcykge1xuICAgIGlmICghZnJvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChmcm9tLmxlZnQgPT09IHRvLmxlZnQgJiYgZnJvbS5yaWdodCA9PT0gdG8ucmlnaHQgJiYgZnJvbS50b3AgPT09IHRvLnRvcCAmJiBmcm9tLmJvdHRvbSA9PT0gdG8uYm90dG9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86IHNob3VsZCB0aGlzIGJlIHNlcGFyYXRlZCBmcm9tIGRlc3RydWN0dXJpbmc/IE9yIHN0YXJ0L2VuZCBhZGRlZCB0byBwdWJsaWMgYXBpIGFuZCBkb2N1bWVudGF0aW9uP1xuICAgIHN0YXJ0OiBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOlxuICAgIGVuZCA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbiwgdGljayA9IG5vb3AsIGNzcyB9ID0gZm4obm9kZSwgeyBmcm9tLCB0byB9LCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIGxldCBuYW1lO1xuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWxheSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgaWYgKCFzdGFydGVkICYmIG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCAmJiBub3cgPj0gZW5kKSB7XG4gICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gbm93IC0gc3RhcnRfdGltZTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAwICsgMSAqIGVhc2luZyhwIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgc3RhcnQoKTtcbiAgICB0aWNrKDAsIDEpO1xuICAgIHJldHVybiBzdG9wO1xufVxuZnVuY3Rpb24gZml4X3Bvc2l0aW9uKG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc3R5bGU7XG4gICAgICAgIGNvbnN0IGEgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYWRkX3RyYW5zZm9ybShub2RlLCBhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpIHtcbiAgICBjb25zdCBiID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoYS5sZWZ0ICE9PSBiLmxlZnQgfHwgYS50b3AgIT09IGIudG9wKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgbm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke2EubGVmdCAtIGIubGVmdH1weCwgJHthLnRvcCAtIGIudG9wfXB4KWA7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudF9jb21wb25lbnQ7XG5mdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY3VycmVudF9jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBnZXRfY3VycmVudF9jb21wb25lbnQoKSB7XG4gICAgaWYgKCFjdXJyZW50X2NvbXBvbmVudClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb25gKTtcbiAgICByZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5mdW5jdGlvbiBiZWZvcmVVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX21vdW50LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbkRlc3Ryb3koZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHRoZXJlIHNpdHVhdGlvbnMgd2hlcmUgZXZlbnRzIGNvdWxkIGJlIGRpc3BhdGNoZWRcbiAgICAgICAgICAgIC8vIGluIGEgc2VydmVyIChub24tRE9NKSBlbnZpcm9ubWVudD9cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuKGV2ZW50KSk7XG4gICAgfVxufVxuXG5jb25zdCBkaXJ0eV9jb21wb25lbnRzID0gW107XG5jb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5jb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5sZXQgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2NoZWR1bGVfdXBkYXRlKCkge1xuICAgIGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuICAgICAgICB1cGRhdGVfc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0aWNrKCkge1xuICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgIHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuICAgIHJlbmRlcl9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZGRfZmx1c2hfY2FsbGJhY2soZm4pIHtcbiAgICBmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBkaXJ0eV9jb21wb25lbnRzLnNoaWZ0KCk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShjb21wb25lbnQuJCQpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChiaW5kaW5nX2NhbGxiYWNrcy5sZW5ndGgpXG4gICAgICAgICAgICBiaW5kaW5nX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgICAgICAvLyB0aGVuLCBvbmNlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGNhbGxcbiAgICAgICAgLy8gYWZ0ZXJVcGRhdGUgZnVuY3Rpb25zLiBUaGlzIG1heSBjYXVzZVxuICAgICAgICAvLyBzdWJzZXF1ZW50IHVwZGF0ZXMuLi5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHJlbmRlcl9jYWxsYmFja3NbaV07XG4gICAgICAgICAgICBpZiAoIXNlZW5fY2FsbGJhY2tzLmhhcyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG4gICAgICAgICAgICAgICAgc2Vlbl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoID0gMDtcbiAgICB9IHdoaWxlIChkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCk7XG4gICAgd2hpbGUgKGZsdXNoX2NhbGxiYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgZmx1c2hfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgfVxuICAgIHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaGApO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBjbGFzc2VzX3RvX2FkZCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3QuYXNzaWduKHt9LCAuLi5hcmdzKTtcbiAgICBpZiAoY2xhc3Nlc190b19hZGQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RyID0gJyc7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgaWYgKGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLnRlc3QobmFtZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgZWxzZSBpZiAoYm9vbGVhbl9hdHRyaWJ1dGVzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiIFwiICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgKz0gYCAke25hbWV9PVwiJHtTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1wiL2csICcmIzM0OycpLnJlcGxhY2UoLycvZywgJyYjMzk7Jyl9XCJgO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IGVzY2FwZWQgPSB7XG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnXG59O1xuZnVuY3Rpb24gZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKGh0bWwpLnJlcGxhY2UoL1tcIicmPD5dL2csIG1hdGNoID0+IGVzY2FwZWRbbWF0Y2hdKTtcbn1cbmZ1bmN0aW9uIGVhY2goaXRlbXMsIGZuKSB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc3RyICs9IGZuKGl0ZW1zW2ldLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmNvbnN0IG1pc3NpbmdfY29tcG9uZW50ID0ge1xuICAgICQkcmVuZGVyOiAoKSA9PiAnJ1xufTtcbmZ1bmN0aW9uIHZhbGlkYXRlX2NvbXBvbmVudChjb21wb25lbnQsIG5hbWUpIHtcbiAgICBpZiAoIWNvbXBvbmVudCB8fCAhY29tcG9uZW50LiQkcmVuZGVyKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnc3ZlbHRlOmNvbXBvbmVudCcpXG4gICAgICAgICAgICBuYW1lICs9ICcgdGhpcz17Li4ufSc7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgPCR7bmFtZX0+IGlzIG5vdCBhIHZhbGlkIFNTUiBjb21wb25lbnQuIFlvdSBtYXkgbmVlZCB0byByZXZpZXcgeW91ciBidWlsZCBjb25maWcgdG8gZW5zdXJlIHRoYXQgZGVwZW5kZW5jaWVzIGFyZSBjb21waWxlZCwgcmF0aGVyIHRoYW4gaW1wb3J0ZWQgYXMgcHJlLWNvbXBpbGVkIG1vZHVsZXNgKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmZ1bmN0aW9uIGRlYnVnKGZpbGUsIGxpbmUsIGNvbHVtbiwgdmFsdWVzKSB7XG4gICAgY29uc29sZS5sb2coYHtAZGVidWd9ICR7ZmlsZSA/IGZpbGUgKyAnICcgOiAnJ30oJHtsaW5lfToke2NvbHVtbn0pYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIHJldHVybiAnJztcbn1cbmxldCBvbl9kZXN0cm95O1xuZnVuY3Rpb24gY3JlYXRlX3Nzcl9jb21wb25lbnQoZm4pIHtcbiAgICBmdW5jdGlvbiAkJHJlbmRlcihyZXN1bHQsIHByb3BzLCBiaW5kaW5ncywgc2xvdHMpIHtcbiAgICAgICAgY29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuICAgICAgICBjb25zdCAkJCA9IHtcbiAgICAgICAgICAgIG9uX2Rlc3Ryb3ksXG4gICAgICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgICAgICAvLyB0aGVzZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGRpc2NhcmRlZFxuICAgICAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tzOiBibGFua19vYmplY3QoKVxuICAgICAgICB9O1xuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQoeyAkJCB9KTtcbiAgICAgICAgY29uc3QgaHRtbCA9IGZuKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cyk7XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlbmRlcjogKHByb3BzID0ge30sIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgICAgICAgICAgb25fZGVzdHJveSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0aXRsZTogJycsIGhlYWQ6ICcnLCBjc3M6IG5ldyBTZXQoKSB9O1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIHt9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJ1bl9hbGwob25fZGVzdHJveSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IEFycmF5LmZyb20ocmVzdWx0LmNzcykubWFwKGNzcyA9PiBjc3MuY29kZSkuam9pbignXFxuJyksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCAvLyBUT0RPXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkOiByZXN1bHQudGl0bGUgKyByZXN1bHQuaGVhZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJCRyZW5kZXJcbiAgICB9O1xufVxuZnVuY3Rpb24gYWRkX2F0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IChib29sZWFuICYmICF2YWx1ZSkpXG4gICAgICAgIHJldHVybiAnJztcbiAgICByZXR1cm4gYCAke25hbWV9JHt2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogYD0ke3R5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeShlc2NhcGUodmFsdWUpKSA6IGBcIiR7dmFsdWV9XCJgfWB9YDtcbn1cbmZ1bmN0aW9uIGFkZF9jbGFzc2VzKGNsYXNzZXMpIHtcbiAgICByZXR1cm4gY2xhc3NlcyA/IGAgY2xhc3M9XCIke2NsYXNzZXN9XCJgIDogYGA7XG59XG5cbmZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcbiAgICBibG9jayAmJiBibG9jay5jKCk7XG59XG5mdW5jdGlvbiBjbGFpbV9jb21wb25lbnQoYmxvY2ssIHBhcmVudF9ub2Rlcykge1xuICAgIGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cbmZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yKSB7XG4gICAgY29uc3QgeyBmcmFnbWVudCwgb25fbW91bnQsIG9uX2Rlc3Ryb3ksIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuICAgIGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuICAgIC8vIG9uTW91bnQgaGFwcGVucyBiZWZvcmUgdGhlIGluaXRpYWwgYWZ0ZXJVcGRhdGVcbiAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgbmV3X29uX2Rlc3Ryb3kgPSBvbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuICAgICAgICBpZiAob25fZGVzdHJveSkge1xuICAgICAgICAgICAgb25fZGVzdHJveS5wdXNoKC4uLm5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEVkZ2UgY2FzZSAtIGNvbXBvbmVudCB3YXMgZGVzdHJveWVkIGltbWVkaWF0ZWx5LFxuICAgICAgICAgICAgLy8gbW9zdCBsaWtlbHkgYXMgYSByZXN1bHQgb2YgYSBiaW5kaW5nIGluaXRpYWxpc2luZ1xuICAgICAgICAgICAgcnVuX2FsbChuZXdfb25fZGVzdHJveSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG4gICAgfSk7XG4gICAgYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2NvbXBvbmVudChjb21wb25lbnQsIGRldGFjaGluZykge1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkO1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICBydW5fYWxsKCQkLm9uX2Rlc3Ryb3kpO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5kKGRldGFjaGluZyk7XG4gICAgICAgIC8vIFRPRE8gbnVsbCBvdXQgb3RoZXIgcmVmcywgaW5jbHVkaW5nIGNvbXBvbmVudC4kJCAoYnV0IG5lZWQgdG9cbiAgICAgICAgLy8gcHJlc2VydmUgZmluYWwgc3RhdGU/KVxuICAgICAgICAkJC5vbl9kZXN0cm95ID0gJCQuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICAkJC5jdHggPSBbXTtcbiAgICB9XG59XG5mdW5jdGlvbiBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSkge1xuICAgIGlmIChjb21wb25lbnQuJCQuZGlydHlbMF0gPT09IC0xKSB7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xuICAgICAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICAgICAgY29tcG9uZW50LiQkLmRpcnR5LmZpbGwoMCk7XG4gICAgfVxuICAgIGNvbXBvbmVudC4kJC5kaXJ0eVsoaSAvIDMxKSB8IDBdIHw9ICgxIDw8IChpICUgMzEpKTtcbn1cbmZ1bmN0aW9uIGluaXQoY29tcG9uZW50LCBvcHRpb25zLCBpbnN0YW5jZSwgY3JlYXRlX2ZyYWdtZW50LCBub3RfZXF1YWwsIHByb3BzLCBkaXJ0eSA9IFstMV0pIHtcbiAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgY29uc3QgcHJvcF92YWx1ZXMgPSBvcHRpb25zLnByb3BzIHx8IHt9O1xuICAgIGNvbnN0ICQkID0gY29tcG9uZW50LiQkID0ge1xuICAgICAgICBmcmFnbWVudDogbnVsbCxcbiAgICAgICAgY3R4OiBudWxsLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBwcm9wcyxcbiAgICAgICAgdXBkYXRlOiBub29wLFxuICAgICAgICBub3RfZXF1YWwsXG4gICAgICAgIGJvdW5kOiBibGFua19vYmplY3QoKSxcbiAgICAgICAgLy8gbGlmZWN5Y2xlXG4gICAgICAgIG9uX21vdW50OiBbXSxcbiAgICAgICAgb25fZGVzdHJveTogW10sXG4gICAgICAgIGJlZm9yZV91cGRhdGU6IFtdLFxuICAgICAgICBhZnRlcl91cGRhdGU6IFtdLFxuICAgICAgICBjb250ZXh0OiBuZXcgTWFwKHBhcmVudF9jb21wb25lbnQgPyBwYXJlbnRfY29tcG9uZW50LiQkLmNvbnRleHQgOiBbXSksXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICBkaXJ0eVxuICAgIH07XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIHByb3BfdmFsdWVzLCAoaSwgcmV0LCAuLi5yZXN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlc3QubGVuZ3RoID8gcmVzdFswXSA6IHJldDtcbiAgICAgICAgICAgIGlmICgkJC5jdHggJiYgbm90X2VxdWFsKCQkLmN0eFtpXSwgJCQuY3R4W2ldID0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQkLmJvdW5kW2ldKVxuICAgICAgICAgICAgICAgICAgICAkJC5ib3VuZFtpXSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWR5KVxuICAgICAgICAgICAgICAgICAgICBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KVxuICAgICAgICA6IFtdO1xuICAgICQkLnVwZGF0ZSgpO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgIC8vIGBmYWxzZWAgYXMgYSBzcGVjaWFsIGNhc2Ugb2Ygbm8gRE9NIGNvbXBvbmVudFxuICAgICQkLmZyYWdtZW50ID0gY3JlYXRlX2ZyYWdtZW50ID8gY3JlYXRlX2ZyYWdtZW50KCQkLmN0eCkgOiBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaHlkcmF0ZSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmwoY2hpbGRyZW4ob3B0aW9ucy50YXJnZXQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4xOC4xJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQuZGF0YSA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFcIiwgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5jbGFzcyBTdmVsdGVDb21wb25lbnREZXYgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICghb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuJCRpbmxpbmUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCd0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uYCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLiRkZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYENvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWRgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH07XG4gICAgfVxufVxuZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluZmluaXRlIGxvb3AgZGV0ZWN0ZWRgKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IEh0bWxUYWcsIFN2ZWx0ZUNvbXBvbmVudCwgU3ZlbHRlQ29tcG9uZW50RGV2LCBTdmVsdGVFbGVtZW50LCBhY3Rpb25fZGVzdHJveWVyLCBhZGRfYXR0cmlidXRlLCBhZGRfY2xhc3NlcywgYWRkX2ZsdXNoX2NhbGxiYWNrLCBhZGRfbG9jYXRpb24sIGFkZF9yZW5kZXJfY2FsbGJhY2ssIGFkZF9yZXNpemVfbGlzdGVuZXIsIGFkZF90cmFuc2Zvcm0sIGFmdGVyVXBkYXRlLCBhcHBlbmQsIGFwcGVuZF9kZXYsIGFzc2lnbiwgYXR0ciwgYXR0cl9kZXYsIGJlZm9yZVVwZGF0ZSwgYmluZCwgYmluZGluZ19jYWxsYmFja3MsIGJsYW5rX29iamVjdCwgYnViYmxlLCBjaGVja19vdXRyb3MsIGNoaWxkcmVuLCBjbGFpbV9jb21wb25lbnQsIGNsYWltX2VsZW1lbnQsIGNsYWltX3NwYWNlLCBjbGFpbV90ZXh0LCBjbGVhcl9sb29wcywgY29tcG9uZW50X3N1YnNjcmliZSwgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCBjcmVhdGVfYW5pbWF0aW9uLCBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uLCBjcmVhdGVfY29tcG9uZW50LCBjcmVhdGVfaW5fdHJhbnNpdGlvbiwgY3JlYXRlX291dF90cmFuc2l0aW9uLCBjcmVhdGVfc2xvdCwgY3JlYXRlX3Nzcl9jb21wb25lbnQsIGN1cnJlbnRfY29tcG9uZW50LCBjdXN0b21fZXZlbnQsIGRhdGFzZXRfZGV2LCBkZWJ1ZywgZGVzdHJveV9ibG9jaywgZGVzdHJveV9jb21wb25lbnQsIGRlc3Ryb3lfZWFjaCwgZGV0YWNoLCBkZXRhY2hfYWZ0ZXJfZGV2LCBkZXRhY2hfYmVmb3JlX2RldiwgZGV0YWNoX2JldHdlZW5fZGV2LCBkZXRhY2hfZGV2LCBkaXJ0eV9jb21wb25lbnRzLCBkaXNwYXRjaF9kZXYsIGVhY2gsIGVsZW1lbnQsIGVsZW1lbnRfaXMsIGVtcHR5LCBlc2NhcGUsIGVzY2FwZWQsIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMsIGZpeF9hbmRfZGVzdHJveV9ibG9jaywgZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jaywgZml4X3Bvc2l0aW9uLCBmbHVzaCwgZ2V0Q29udGV4dCwgZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUsIGdldF9jdXJyZW50X2NvbXBvbmVudCwgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dCwgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnRyb3MsIGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLCBpc19jbGllbnQsIGlzX2Z1bmN0aW9uLCBpc19wcm9taXNlLCBsaXN0ZW4sIGxpc3Rlbl9kZXYsIGxvb3AsIGxvb3BfZ3VhcmQsIG1pc3NpbmdfY29tcG9uZW50LCBtb3VudF9jb21wb25lbnQsIG5vb3AsIG5vdF9lcXVhbCwgbm93LCBudWxsX3RvX2VtcHR5LCBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzLCBvbkRlc3Ryb3ksIG9uTW91bnQsIG9uY2UsIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrLCBwcmV2ZW50X2RlZmF1bHQsIHByb3BfZGV2LCBxdWVyeV9zZWxlY3Rvcl9hbGwsIHJhZiwgcnVuLCBydW5fYWxsLCBzYWZlX25vdF9lcXVhbCwgc2NoZWR1bGVfdXBkYXRlLCBzZWxlY3RfbXVsdGlwbGVfdmFsdWUsIHNlbGVjdF9vcHRpb24sIHNlbGVjdF9vcHRpb25zLCBzZWxlY3RfdmFsdWUsIHNlbGYsIHNldENvbnRleHQsIHNldF9hdHRyaWJ1dGVzLCBzZXRfY3VycmVudF9jb21wb25lbnQsIHNldF9jdXN0b21fZWxlbWVudF9kYXRhLCBzZXRfZGF0YSwgc2V0X2RhdGFfZGV2LCBzZXRfaW5wdXRfdHlwZSwgc2V0X2lucHV0X3ZhbHVlLCBzZXRfbm93LCBzZXRfcmFmLCBzZXRfc3RvcmVfdmFsdWUsIHNldF9zdHlsZSwgc2V0X3N2Z19hdHRyaWJ1dGVzLCBzcGFjZSwgc3ByZWFkLCBzdG9wX3Byb3BhZ2F0aW9uLCBzdWJzY3JpYmUsIHN2Z19lbGVtZW50LCB0ZXh0LCB0aWNrLCB0aW1lX3Jhbmdlc190b19hcnJheSwgdG9fbnVtYmVyLCB0b2dnbGVfY2xhc3MsIHRyYW5zaXRpb25faW4sIHRyYW5zaXRpb25fb3V0LCB1cGRhdGVfa2V5ZWRfZWFjaCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3N0b3JlLCB4bGlua19hdHRyIH07XG4iLCJpbXBvcnQgeyBub29wLCBzYWZlX25vdF9lcXVhbCwgc3Vic2NyaWJlLCBydW5fYWxsLCBpc19mdW5jdGlvbiB9IGZyb20gJy4uL2ludGVybmFsJztcbmV4cG9ydCB7IGdldF9zdG9yZV92YWx1ZSBhcyBnZXQgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0gdmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcn1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRhYmxlKHZhbHVlLCBzdGFydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZTogd3JpdGFibGUodmFsdWUsIHN0YXJ0KS5zdWJzY3JpYmUsXG4gICAgfTtcbn1cbi8qKlxuICogQ3JlYXRlIGEgYFdyaXRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyBib3RoIHVwZGF0aW5nIGFuZCByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7Kj19dmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcj19c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQgPSBub29wKSB7XG4gICAgbGV0IHN0b3A7XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmIChzYWZlX25vdF9lcXVhbCh2YWx1ZSwgbmV3X3ZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICBpZiAoc3RvcCkgeyAvLyBzdG9yZSBpcyByZWFkeVxuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bl9xdWV1ZSA9ICFzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgc1sxXSgpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlLnB1c2gocywgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocnVuX3F1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZVtpXVswXShzdWJzY3JpYmVyX3F1ZXVlW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGUoZm4pIHtcbiAgICAgICAgc2V0KGZuKHZhbHVlKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShydW4sIGludmFsaWRhdGUgPSBub29wKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBbcnVuLCBpbnZhbGlkYXRlXTtcbiAgICAgICAgc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgc3RvcCA9IHN0YXJ0KHNldCkgfHwgbm9vcDtcbiAgICAgICAgfVxuICAgICAgICBydW4odmFsdWUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzdWJzY3JpYmVycy5pbmRleE9mKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgIHN0b3AgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzZXQsIHVwZGF0ZSwgc3Vic2NyaWJlIH07XG59XG5mdW5jdGlvbiBkZXJpdmVkKHN0b3JlcywgZm4sIGluaXRpYWxfdmFsdWUpIHtcbiAgICBjb25zdCBzaW5nbGUgPSAhQXJyYXkuaXNBcnJheShzdG9yZXMpO1xuICAgIGNvbnN0IHN0b3Jlc19hcnJheSA9IHNpbmdsZVxuICAgICAgICA/IFtzdG9yZXNdXG4gICAgICAgIDogc3RvcmVzO1xuICAgIGNvbnN0IGF1dG8gPSBmbi5sZW5ndGggPCAyO1xuICAgIHJldHVybiByZWFkYWJsZShpbml0aWFsX3ZhbHVlLCAoc2V0KSA9PiB7XG4gICAgICAgIGxldCBpbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgICAgIGxldCBwZW5kaW5nID0gMDtcbiAgICAgICAgbGV0IGNsZWFudXAgPSBub29wO1xuICAgICAgICBjb25zdCBzeW5jID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbihzaW5nbGUgPyB2YWx1ZXNbMF0gOiB2YWx1ZXMsIHNldCk7XG4gICAgICAgICAgICBpZiAoYXV0bykge1xuICAgICAgICAgICAgICAgIHNldChyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xlYW51cCA9IGlzX2Z1bmN0aW9uKHJlc3VsdCkgPyByZXN1bHQgOiBub29wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZXJzID0gc3RvcmVzX2FycmF5Lm1hcCgoc3RvcmUsIGkpID0+IHN1YnNjcmliZShzdG9yZSwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHBlbmRpbmcgJj0gfigxIDw8IGkpO1xuICAgICAgICAgICAgaWYgKGluaXRlZCkge1xuICAgICAgICAgICAgICAgIHN5bmMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcGVuZGluZyB8PSAoMSA8PCBpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBpbml0ZWQgPSB0cnVlO1xuICAgICAgICBzeW5jKCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICAgICAgcnVuX2FsbCh1bnN1YnNjcmliZXJzKTtcbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgZGVyaXZlZCwgcmVhZGFibGUsIHdyaXRhYmxlIH07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBDT05URVhUX0tFWSA9IHt9O1xuXG5leHBvcnQgY29uc3QgcHJlbG9hZCA9ICgpID0+ICh7fSk7IiwiZnVuY3Rpb24gdG9WYWwobWl4KSB7XG5cdHZhciBrLCB5LCBzdHI9Jyc7XG5cdGlmIChtaXgpIHtcblx0XHRpZiAodHlwZW9mIG1peCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG1peCkpIHtcblx0XHRcdFx0Zm9yIChrPTA7IGsgPCBtaXgubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwobWl4W2tdKSkpIHtcblx0XHRcdFx0XHRcdHN0ciAmJiAoc3RyICs9ICcgJyk7XG5cdFx0XHRcdFx0XHRzdHIgKz0geTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAoayBpbiBtaXgpIHtcblx0XHRcdFx0XHRpZiAobWl4W2tdICYmICh5ID0gdG9WYWwoaykpKSB7XG5cdFx0XHRcdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0XHRcdFx0c3RyICs9IHk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgbWl4ICE9PSAnYm9vbGVhbicgJiYgIW1peC5jYWxsKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IG1peDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuXHR2YXIgaT0wLCB4LCBzdHI9Jyc7XG5cdHdoaWxlIChpIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdGlmICh4ID0gdG9WYWwoYXJndW1lbnRzW2krK10pKSB7XG5cdFx0XHRzdHIgJiYgKHN0ciArPSAnICcpO1xuXHRcdFx0c3RyICs9IHhcblx0XHR9XG5cdH1cblx0cmV0dXJuIHN0cjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRPcmlnaW5hbEJvZHlQYWRkaW5nKCkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdyA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHksIG51bGwpIDoge307XG5cbiAgcmV0dXJuIHBhcnNlSW50KChzdHlsZSAmJiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpIHx8IDAsIDEwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCkge1xuICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIC8vIC5tb2RhbC1zY3JvbGxiYXItbWVhc3VyZSBzdHlsZXMgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjQvc2Nzcy9fbW9kYWwuc2NzcyNMMTA2LUwxMTNcbiAgc2Nyb2xsRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgc2Nyb2xsRGl2LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgc2Nyb2xsRGl2LnN0eWxlLndpZHRoID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUuaGVpZ2h0ID0gJzUwcHgnO1xuICBzY3JvbGxEaXYuc3R5bGUub3ZlcmZsb3cgPSAnc2Nyb2xsJztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICBjb25zdCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTY3JvbGxiYXJXaWR0aChwYWRkaW5nKSB7XG4gIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA+IDAgPyBgJHtwYWRkaW5nfXB4YCA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JvZHlPdmVyZmxvd2luZygpIHtcbiAgcmV0dXJuIHdpbmRvdyA/IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCB3aW5kb3cuaW5uZXJXaWR0aCA6IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmRpdGlvbmFsbHlVcGRhdGVTY3JvbGxiYXIoKSB7XG4gIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvdjQuMC4wLWFscGhhLjYvanMvc3JjL21vZGFsLmpzI0w0MzNcbiAgY29uc3QgZml4ZWRDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnLmZpeGVkLXRvcCwgLmZpeGVkLWJvdHRvbSwgLmlzLWZpeGVkLCAuc3RpY2t5LXRvcCdcbiAgKVswXTtcbiAgY29uc3QgYm9keVBhZGRpbmcgPSBmaXhlZENvbnRlbnRcbiAgICA/IHBhcnNlSW50KGZpeGVkQ29udGVudC5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgMCwgMTApXG4gICAgOiAwO1xuXG4gIGlmIChpc0JvZHlPdmVyZmxvd2luZygpKSB7XG4gICAgc2V0U2Nyb2xsYmFyV2lkdGgoYm9keVBhZGRpbmcgKyBzY3JvbGxiYXJXaWR0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbHVtblNpemVDbGFzcyhpc1hzLCBjb2xXaWR0aCwgY29sU2l6ZSkge1xuICBpZiAoY29sU2l6ZSA9PT0gdHJ1ZSB8fCBjb2xTaXplID09PSAnJykge1xuICAgIHJldHVybiBpc1hzID8gJ2NvbCcgOiBgY29sLSR7Y29sV2lkdGh9YDtcbiAgfSBlbHNlIGlmIChjb2xTaXplID09PSAnYXV0bycpIHtcbiAgICByZXR1cm4gaXNYcyA/ICdjb2wtYXV0bycgOiBgY29sLSR7Y29sV2lkdGh9LWF1dG9gO1xuICB9XG5cbiAgcmV0dXJuIGlzWHMgPyBgY29sLSR7Y29sU2l6ZX1gIDogYGNvbC0ke2NvbFdpZHRofS0ke2NvbFNpemV9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuKCQkcHJvcHMpIHtcbiAgLy8gVE9ETyBzdXBwb3J0IGtleXNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgY2hpbGRyZW4sICQkc2NvcGUsICQkc2xvdHMgfSA9ICQkcHJvcHM7XG4gIGNvbnN0IHJlc3QgPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoJCRwcm9wcykpIHtcbiAgICBpZiAoa2V5ICE9PSBcImNoaWxkcmVuXCIgJiYga2V5ICE9PSBcIiQkc2NvcGVcIiAmJiBrZXkgIT09IFwiJCRzbG90c1wiKSB7XG4gICAgICByZXN0W2tleV0gPSAkJHByb3BzW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJvd3NlckV2ZW50KHRhcmdldCwgLi4uYXJncykge1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lciguLi5hcmdzKTtcblxuICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDYXJvdXNlbEFjdGl2ZUluZGV4KGRpcmVjdGlvbiwgaXRlbXMsIGFjdGl2ZUluZGV4KSB7XG4gIGlmIChkaXJlY3Rpb24gPT09ICdwcmV2Jykge1xuICAgIHJldHVybiBhY3RpdmVJbmRleCA9PT0gMCA/IGl0ZW1zLmxlbmd0aCAtIDEgOiBhY3RpdmVJbmRleCAtIDE7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcbiAgICByZXR1cm4gYWN0aXZlSW5kZXggPT09IGl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogYWN0aXZlSW5kZXggKyAxO1xuICB9XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGZsdWlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgZmx1aWQgPyAnY29udGFpbmVyLWZsdWlkJyA6ICdjb250YWluZXInKTtcbjwvc2NyaXB0PlxuXG48ZGl2IHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbGlnaHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkYXJrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZml4ZWQgPSAnJztcbiAgZXhwb3J0IGxldCBzdGlja3kgPSB0cnVlO1xuICBleHBvcnQgbGV0IGNvbG9yID0gJyc7XG4gIGV4cG9ydCBsZXQgZXhwYW5kID0gZmFsc2U7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICBmdW5jdGlvbiBnZXRFeHBhbmRDbGFzcyhleHBhbmQpIHtcbiAgICBpZiAoZXhwYW5kID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZXhwYW5kID09PSB0cnVlIHx8IGV4cGFuZCA9PT0gJ3hzJykge1xuICAgICAgcmV0dXJuICduYXZiYXItZXhwYW5kJztcbiAgICB9XG5cbiAgICByZXR1cm4gYG5hdmJhci1leHBhbmQtJHtleHBhbmR9YDtcbiAgfVxuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ25hdmJhcicsIGdldEV4cGFuZENsYXNzKGV4cGFuZCksIHtcbiAgICAnbmF2YmFyLWxpZ2h0JzogbGlnaHQsXG4gICAgJ25hdmJhci1kYXJrJzogZGFyayxcbiAgICBbYGJnLSR7Y29sb3J9YF06IGNvbG9yLFxuICAgIFtgZml4ZWQtJHtmaXhlZH1gXTogZml4ZWQsXG4gICAgW2BzdGlja3ktJHtzdGlja3l9YF06IHN0aWNreVxuICB9KTtcbjwvc2NyaXB0PlxuXG48bmF2IHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9uYXY+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGhyZWYgPSAnLyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsICduYXZiYXItYnJhbmQnKTtcbjwvc2NyaXB0PlxuXG48YSB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfSB7aHJlZn0+XG4gIDxzbG90IC8+XG48L2E+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGJsb2NrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgY2xvc2UgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9ICdzZWNvbmRhcnknO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaHJlZiA9ICcnO1xuICBleHBvcnQgbGV0IGlkID0gJyc7XG4gIGV4cG9ydCBsZXQgb3V0bGluZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCBzdHlsZSA9ICcnO1xuICBleHBvcnQgbGV0IHZhbHVlID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBhcmlhTGFiZWwgPSAkJHByb3BzWydhcmlhLWxhYmVsJ107XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIHsgY2xvc2UgfSxcbiAgICBjbG9zZSB8fCAnYnRuJyxcbiAgICBjbG9zZSB8fCBgYnRuJHtvdXRsaW5lID8gJy1vdXRsaW5lJyA6ICcnfS0ke2NvbG9yfWAsXG4gICAgc2l6ZSA/IGBidG4tJHtzaXplfWAgOiBmYWxzZSxcbiAgICBibG9jayA/ICdidG4tYmxvY2snIDogZmFsc2UsXG4gICAgeyBhY3RpdmUgfVxuICApO1xuXG4gICQ6IGRlZmF1bHRBcmlhTGFiZWwgPSBjbG9zZSA/ICdDbG9zZScgOiBudWxsO1xuPC9zY3JpcHQ+XG5cbnsjaWYgaHJlZn1cbiAgPGFcbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGlja1xuICAgIHtocmVmfVxuICAgIGFyaWEtbGFiZWw9e2FyaWFMYWJlbCB8fCBkZWZhdWx0QXJpYUxhYmVsfVxuICAgIHtzdHlsZX0+XG4gICAgeyNpZiBjaGlsZHJlbn1cbiAgICAgIHtjaGlsZHJlbn1cbiAgICB7OmVsc2V9XG4gICAgICA8c2xvdCAvPlxuICAgIHsvaWZ9XG4gIDwvYT5cbns6ZWxzZX1cbiAgPGJ1dHRvblxuICAgIHsuLi5wcm9wc31cbiAgICB7aWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAge2Rpc2FibGVkfVxuICAgIG9uOmNsaWNrXG4gICAge3ZhbHVlfVxuICAgIGFyaWEtbGFiZWw9e2FyaWFMYWJlbCB8fCBkZWZhdWx0QXJpYUxhYmVsfVxuICAgIHtzdHlsZX0+XG4gICAgPHNsb3Q+XG4gICAgICB7I2lmIGNsb3NlfVxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj5cbiAgICAgIHs6ZWxzZSBpZiBjaGlsZHJlbn1cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgezplbHNlfVxuICAgICAgICA8c2xvdCAvPlxuICAgICAgey9pZn1cbiAgICA8L3Nsb3Q+XG4gIDwvYnV0dG9uPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgdGFicyA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHBpbGxzID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmVydGljYWwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBob3Jpem9udGFsID0gJyc7XG4gIGV4cG9ydCBsZXQganVzdGlmaWVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZmlsbCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdmJhciA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNhcmQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGZ1bmN0aW9uIGdldFZlcnRpY2FsQ2xhc3ModmVydGljYWwpIHtcbiAgICBpZiAodmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh2ZXJ0aWNhbCA9PT0gdHJ1ZSB8fCB2ZXJ0aWNhbCA9PT0gJ3hzJykge1xuICAgICAgcmV0dXJuICdmbGV4LWNvbHVtbic7XG4gICAgfVxuICAgIHJldHVybiBgZmxleC0ke3ZlcnRpY2FsfS1jb2x1bW5gO1xuICB9XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goXG4gICAgY2xhc3NOYW1lLFxuICAgIG5hdmJhciA/ICduYXZiYXItbmF2JyA6ICduYXYnLFxuICAgIGhvcml6b250YWwgPyBganVzdGlmeS1jb250ZW50LSR7aG9yaXpvbnRhbH1gIDogZmFsc2UsXG4gICAgZ2V0VmVydGljYWxDbGFzcyh2ZXJ0aWNhbCksXG4gICAge1xuICAgICAgJ25hdi10YWJzJzogdGFicyxcbiAgICAgICdjYXJkLWhlYWRlci10YWJzJzogY2FyZCAmJiB0YWJzLFxuICAgICAgJ25hdi1waWxscyc6IHBpbGxzLFxuICAgICAgJ2NhcmQtaGVhZGVyLXBpbGxzJzogY2FyZCAmJiBwaWxscyxcbiAgICAgICduYXYtanVzdGlmaWVkJzoganVzdGlmaWVkLFxuICAgICAgJ25hdi1maWxsJzogZmlsbFxuICAgIH1cbiAgKTtcbjwvc2NyaXB0PlxuXG48dWwgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L3VsPlxuIiwiZXhwb3J0IHsgaWRlbnRpdHkgYXMgbGluZWFyIH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG4vKlxuQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0ZGVzbFxuRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL21hdHRkZXNsL2Vhc2VzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiovXG5mdW5jdGlvbiBiYWNrSW5PdXQodCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4ICogMS41MjU7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqICh0ICogdCAqICgocyArIDEpICogdCAtIHMpKTtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqICgocyArIDEpICogdCArIHMpICsgMik7XG59XG5mdW5jdGlvbiBiYWNrSW4odCkge1xuICAgIGNvbnN0IHMgPSAxLjcwMTU4O1xuICAgIHJldHVybiB0ICogdCAqICgocyArIDEpICogdCAtIHMpO1xufVxuZnVuY3Rpb24gYmFja091dCh0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTg7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDE7XG59XG5mdW5jdGlvbiBib3VuY2VPdXQodCkge1xuICAgIGNvbnN0IGEgPSA0LjAgLyAxMS4wO1xuICAgIGNvbnN0IGIgPSA4LjAgLyAxMS4wO1xuICAgIGNvbnN0IGMgPSA5LjAgLyAxMC4wO1xuICAgIGNvbnN0IGNhID0gNDM1Ni4wIC8gMzYxLjA7XG4gICAgY29uc3QgY2IgPSAzNTQ0Mi4wIC8gMTgwNS4wO1xuICAgIGNvbnN0IGNjID0gMTYwNjEuMCAvIDE4MDUuMDtcbiAgICBjb25zdCB0MiA9IHQgKiB0O1xuICAgIHJldHVybiB0IDwgYVxuICAgICAgICA/IDcuNTYyNSAqIHQyXG4gICAgICAgIDogdCA8IGJcbiAgICAgICAgICAgID8gOS4wNzUgKiB0MiAtIDkuOSAqIHQgKyAzLjRcbiAgICAgICAgICAgIDogdCA8IGNcbiAgICAgICAgICAgICAgICA/IGNhICogdDIgLSBjYiAqIHQgKyBjY1xuICAgICAgICAgICAgICAgIDogMTAuOCAqIHQgKiB0IC0gMjAuNTIgKiB0ICsgMTAuNzI7XG59XG5mdW5jdGlvbiBib3VuY2VJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyAwLjUgKiAoMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQgKiAyLjApKVxuICAgICAgICA6IDAuNSAqIGJvdW5jZU91dCh0ICogMi4wIC0gMS4wKSArIDAuNTtcbn1cbmZ1bmN0aW9uIGJvdW5jZUluKHQpIHtcbiAgICByZXR1cm4gMS4wIC0gYm91bmNlT3V0KDEuMCAtIHQpO1xufVxuZnVuY3Rpb24gY2lyY0luT3V0KHQpIHtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gLTAuNSAqIChNYXRoLnNxcnQoMSAtIHQgKiB0KSAtIDEpO1xuICAgIHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSk7XG59XG5mdW5jdGlvbiBjaXJjSW4odCkge1xuICAgIHJldHVybiAxLjAgLSBNYXRoLnNxcnQoMS4wIC0gdCAqIHQpO1xufVxuZnVuY3Rpb24gY2lyY091dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCgxIC0gLS10ICogdCk7XG59XG5mdW5jdGlvbiBjdWJpY0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNSA/IDQuMCAqIHQgKiB0ICogdCA6IDAuNSAqIE1hdGgucG93KDIuMCAqIHQgLSAyLjAsIDMuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBjdWJpY0luKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gY3ViaWNPdXQodCkge1xuICAgIGNvbnN0IGYgPSB0IC0gMS4wO1xuICAgIHJldHVybiBmICogZiAqIGYgKyAxLjA7XG59XG5mdW5jdGlvbiBlbGFzdGljSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gMC41ICpcbiAgICAgICAgICAgIE1hdGguc2luKCgoKzEzLjAgKiBNYXRoLlBJKSAvIDIpICogMi4wICogdCkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAxMC4wICogKDIuMCAqIHQgLSAxLjApKVxuICAgICAgICA6IDAuNSAqXG4gICAgICAgICAgICBNYXRoLnNpbigoKC0xMy4wICogTWF0aC5QSSkgLyAyKSAqICgyLjAgKiB0IC0gMS4wICsgMS4wKSkgKlxuICAgICAgICAgICAgTWF0aC5wb3coMi4wLCAtMTAuMCAqICgyLjAgKiB0IC0gMS4wKSkgK1xuICAgICAgICAgICAgMS4wO1xufVxuZnVuY3Rpb24gZWxhc3RpY0luKHQpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4oKDEzLjAgKiB0ICogTWF0aC5QSSkgLyAyKSAqIE1hdGgucG93KDIuMCwgMTAuMCAqICh0IC0gMS4wKSk7XG59XG5mdW5jdGlvbiBlbGFzdGljT3V0KHQpIHtcbiAgICByZXR1cm4gKE1hdGguc2luKCgtMTMuMCAqICh0ICsgMS4wKSAqIE1hdGguUEkpIC8gMikgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogdCkgKyAxLjApO1xufVxuZnVuY3Rpb24gZXhwb0luT3V0KHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMC4wIHx8IHQgPT09IDEuMFxuICAgICAgICA/IHRcbiAgICAgICAgOiB0IDwgMC41XG4gICAgICAgICAgICA/ICswLjUgKiBNYXRoLnBvdygyLjAsIDIwLjAgKiB0IC0gMTAuMClcbiAgICAgICAgICAgIDogLTAuNSAqIE1hdGgucG93KDIuMCwgMTAuMCAtIHQgKiAyMC4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIGV4cG9Jbih0KSB7XG4gICAgcmV0dXJuIHQgPT09IDAuMCA/IHQgOiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpO1xufVxuZnVuY3Rpb24gZXhwb091dCh0KSB7XG4gICAgcmV0dXJuIHQgPT09IDEuMCA/IHQgOiAxLjAgLSBNYXRoLnBvdygyLjAsIC0xMC4wICogdCk7XG59XG5mdW5jdGlvbiBxdWFkSW5PdXQodCkge1xuICAgIHQgLz0gMC41O1xuICAgIGlmICh0IDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0O1xuICAgIHQtLTtcbiAgICByZXR1cm4gLTAuNSAqICh0ICogKHQgLSAyKSAtIDEpO1xufVxuZnVuY3Rpb24gcXVhZEluKHQpIHtcbiAgICByZXR1cm4gdCAqIHQ7XG59XG5mdW5jdGlvbiBxdWFkT3V0KHQpIHtcbiAgICByZXR1cm4gLXQgKiAodCAtIDIuMCk7XG59XG5mdW5jdGlvbiBxdWFydEluT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/ICs4LjAgKiBNYXRoLnBvdyh0LCA0LjApXG4gICAgICAgIDogLTguMCAqIE1hdGgucG93KHQgLSAxLjAsIDQuMCkgKyAxLjA7XG59XG5mdW5jdGlvbiBxdWFydEluKHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCwgNC4wKTtcbn1cbmZ1bmN0aW9uIHF1YXJ0T3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCAtIDEuMCwgMy4wKSAqICgxLjAgLSB0KSArIDEuMDtcbn1cbmZ1bmN0aW9uIHF1aW50SW5PdXQodCkge1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdDtcbiAgICByZXR1cm4gMC41ICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpO1xufVxuZnVuY3Rpb24gcXVpbnRJbih0KSB7XG4gICAgcmV0dXJuIHQgKiB0ICogdCAqIHQgKiB0O1xufVxuZnVuY3Rpb24gcXVpbnRPdXQodCkge1xuICAgIHJldHVybiAtLXQgKiB0ICogdCAqIHQgKiB0ICsgMTtcbn1cbmZ1bmN0aW9uIHNpbmVJbk91dCh0KSB7XG4gICAgcmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHQpIC0gMSk7XG59XG5mdW5jdGlvbiBzaW5lSW4odCkge1xuICAgIGNvbnN0IHYgPSBNYXRoLmNvcyh0ICogTWF0aC5QSSAqIDAuNSk7XG4gICAgaWYgKE1hdGguYWJzKHYpIDwgMWUtMTQpXG4gICAgICAgIHJldHVybiAxO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIDEgLSB2O1xufVxuZnVuY3Rpb24gc2luZU91dCh0KSB7XG4gICAgcmV0dXJuIE1hdGguc2luKCh0ICogTWF0aC5QSSkgLyAyKTtcbn1cblxuZXhwb3J0IHsgYmFja0luLCBiYWNrSW5PdXQsIGJhY2tPdXQsIGJvdW5jZUluLCBib3VuY2VJbk91dCwgYm91bmNlT3V0LCBjaXJjSW4sIGNpcmNJbk91dCwgY2lyY091dCwgY3ViaWNJbiwgY3ViaWNJbk91dCwgY3ViaWNPdXQsIGVsYXN0aWNJbiwgZWxhc3RpY0luT3V0LCBlbGFzdGljT3V0LCBleHBvSW4sIGV4cG9Jbk91dCwgZXhwb091dCwgcXVhZEluLCBxdWFkSW5PdXQsIHF1YWRPdXQsIHF1YXJ0SW4sIHF1YXJ0SW5PdXQsIHF1YXJ0T3V0LCBxdWludEluLCBxdWludEluT3V0LCBxdWludE91dCwgc2luZUluLCBzaW5lSW5PdXQsIHNpbmVPdXQgfTtcbiIsImltcG9ydCB7IGN1YmljSW5PdXQsIGxpbmVhciwgY3ViaWNPdXQgfSBmcm9tICcuLi9lYXNpbmcnO1xuaW1wb3J0IHsgaXNfZnVuY3Rpb24sIGFzc2lnbiB9IGZyb20gJy4uL2ludGVybmFsJztcblxuLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbmZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxuXG5mdW5jdGlvbiBibHVyKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNJbk91dCwgYW1vdW50ID0gNSwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IGYgPSBzdHlsZS5maWx0ZXIgPT09ICdub25lJyA/ICcnIDogc3R5bGUuZmlsdGVyO1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX07IGZpbHRlcjogJHtmfSBibHVyKCR7dSAqIGFtb3VudH1weCk7YFxuICAgIH07XG59XG5mdW5jdGlvbiBmYWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gbGluZWFyIH0pIHtcbiAgICBjb25zdCBvID0gK2dldENvbXB1dGVkU3R5bGUobm9kZSkub3BhY2l0eTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiB0ID0+IGBvcGFjaXR5OiAke3QgKiBvfWBcbiAgICB9O1xufVxuZnVuY3Rpb24gZmx5KG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQsIHggPSAwLCB5ID0gMCwgb3BhY2l0eSA9IDAgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCB0YXJnZXRfb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgY29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgkeygxIC0gdCkgKiB4fXB4LCAkeygxIC0gdCkgKiB5fXB4KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNsaWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gY3ViaWNPdXQgfSkge1xuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZS5oZWlnaHQpO1xuICAgIGNvbnN0IHBhZGRpbmdfdG9wID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKTtcbiAgICBjb25zdCBwYWRkaW5nX2JvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgY29uc3QgbWFyZ2luX3RvcCA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKTtcbiAgICBjb25zdCBtYXJnaW5fYm90dG9tID0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5Cb3R0b20pO1xuICAgIGNvbnN0IGJvcmRlcl90b3Bfd2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKTtcbiAgICBjb25zdCBib3JkZXJfYm90dG9tX3dpZHRoID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3ZlcmZsb3c6IGhpZGRlbjtgICtcbiAgICAgICAgICAgIGBvcGFjaXR5OiAke01hdGgubWluKHQgKiAyMCwgMSkgKiBvcGFjaXR5fTtgICtcbiAgICAgICAgICAgIGBoZWlnaHQ6ICR7dCAqIGhlaWdodH1weDtgICtcbiAgICAgICAgICAgIGBwYWRkaW5nLXRvcDogJHt0ICogcGFkZGluZ190b3B9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy1ib3R0b206ICR7dCAqIHBhZGRpbmdfYm90dG9tfXB4O2AgK1xuICAgICAgICAgICAgYG1hcmdpbi10b3A6ICR7dCAqIG1hcmdpbl90b3B9cHg7YCArXG4gICAgICAgICAgICBgbWFyZ2luLWJvdHRvbTogJHt0ICogbWFyZ2luX2JvdHRvbX1weDtgICtcbiAgICAgICAgICAgIGBib3JkZXItdG9wLXdpZHRoOiAke3QgKiBib3JkZXJfdG9wX3dpZHRofXB4O2AgK1xuICAgICAgICAgICAgYGJvcmRlci1ib3R0b20td2lkdGg6ICR7dCAqIGJvcmRlcl9ib3R0b21fd2lkdGh9cHg7YFxuICAgIH07XG59XG5mdW5jdGlvbiBzY2FsZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBzdGFydCA9IDAsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgIGNvbnN0IHNkID0gMSAtIHN0YXJ0O1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IChfdCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gc2NhbGUoJHsxIC0gKHNkICogdSl9KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSAob2QgKiB1KX1cblx0XHRgXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRyYXcobm9kZSwgeyBkZWxheSA9IDAsIHNwZWVkLCBkdXJhdGlvbiwgZWFzaW5nID0gY3ViaWNJbk91dCB9KSB7XG4gICAgY29uc3QgbGVuID0gbm9kZS5nZXRUb3RhbExlbmd0aCgpO1xuICAgIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IDgwMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0gbGVuIC8gc3BlZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24obGVuKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogKHQsIHUpID0+IGBzdHJva2UtZGFzaGFycmF5OiAke3QgKiBsZW59ICR7dSAqIGxlbn1gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyb3NzZmFkZShfYSkge1xuICAgIHZhciB7IGZhbGxiYWNrIH0gPSBfYSwgZGVmYXVsdHMgPSBfX3Jlc3QoX2EsIFtcImZhbGxiYWNrXCJdKTtcbiAgICBjb25zdCB0b19yZWNlaXZlID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IHRvX3NlbmQgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gY3Jvc3NmYWRlKGZyb20sIG5vZGUsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSBkID0+IE1hdGguc3FydChkKSAqIDMwLCBlYXNpbmcgPSBjdWJpY091dCB9ID0gYXNzaWduKGFzc2lnbih7fSwgZGVmYXVsdHMpLCBwYXJhbXMpO1xuICAgICAgICBjb25zdCB0byA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGR4ID0gZnJvbS5sZWZ0IC0gdG8ubGVmdDtcbiAgICAgICAgY29uc3QgZHkgPSBmcm9tLnRvcCAtIHRvLnRvcDtcbiAgICAgICAgY29uc3QgZHcgPSBmcm9tLndpZHRoIC8gdG8ud2lkdGg7XG4gICAgICAgIGNvbnN0IGRoID0gZnJvbS5oZWlnaHQgLyB0by5oZWlnaHQ7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRlbGF5LFxuICAgICAgICAgICAgZHVyYXRpb246IGlzX2Z1bmN0aW9uKGR1cmF0aW9uKSA/IGR1cmF0aW9uKGQpIDogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmcsXG4gICAgICAgICAgICBjc3M6ICh0LCB1KSA9PiBgXG5cdFx0XHRcdG9wYWNpdHk6ICR7dCAqIG9wYWNpdHl9O1xuXHRcdFx0XHR0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgbGVmdDtcblx0XHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7dSAqIGR4fXB4LCR7dSAqIGR5fXB4KSBzY2FsZSgke3QgKyAoMSAtIHQpICogZHd9LCAke3QgKyAoMSAtIHQpICogZGh9KTtcblx0XHRcdGBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbihpdGVtcywgY291bnRlcnBhcnRzLCBpbnRybykge1xuICAgICAgICByZXR1cm4gKG5vZGUsIHBhcmFtcykgPT4ge1xuICAgICAgICAgICAgaXRlbXMuc2V0KHBhcmFtcy5rZXksIHtcbiAgICAgICAgICAgICAgICByZWN0OiBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXJwYXJ0cy5oYXMocGFyYW1zLmtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyByZWN0IH0gPSBjb3VudGVycGFydHMuZ2V0KHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVycGFydHMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Jvc3NmYWRlKHJlY3QsIG5vZGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBub2RlIGlzIGRpc2FwcGVhcmluZyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgLy8gKGkuZS4gd2Fzbid0IGNsYWltZWQgYnkgdGhlIG90aGVyIGxpc3QpXG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBuZWVkIHRvIHN1cHBseSBhbiBvdXRyb1xuICAgICAgICAgICAgICAgIGl0ZW1zLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsbGJhY2sgJiYgZmFsbGJhY2sobm9kZSwgcGFyYW1zLCBpbnRybyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgICB0cmFuc2l0aW9uKHRvX3NlbmQsIHRvX3JlY2VpdmUsIGZhbHNlKSxcbiAgICAgICAgdHJhbnNpdGlvbih0b19yZWNlaXZlLCB0b19zZW5kLCB0cnVlKVxuICAgIF07XG59XG5cbmV4cG9ydCB7IGJsdXIsIGNyb3NzZmFkZSwgZHJhdywgZmFkZSwgZmx5LCBzY2FsZSwgc2xpZGUgfTtcbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCB7IHNsaWRlIH0gZnJvbSAnc3ZlbHRlL3RyYW5zaXRpb24nO1xuICBjb25zdCBub29wID0gKCkgPT4gdW5kZWZpbmVkO1xuXG4gIGV4cG9ydCBsZXQgaXNPcGVuID0gZmFsc2U7XG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgbmF2YmFyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmluZyA9IG5vb3A7XG4gIGV4cG9ydCBsZXQgb25FbnRlcmVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBvbkV4aXRpbmcgPSBub29wO1xuICBleHBvcnQgbGV0IG9uRXhpdGVkID0gbm9vcDtcbiAgZXhwb3J0IGxldCBleHBhbmQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAvLyBjb2xsYXBzZUNsYXNzLFxuICAgIG5hdmJhciAmJiAnbmF2YmFyLWNvbGxhcHNlJ1xuICApO1xuXG4gIGxldCB3aW5kb3dXaWR0aCA9IDA7XG4gIGxldCBfd2FzTWF4aW1hemVkID0gZmFsc2U7XG5cbiAgY29uc3QgbWluV2lkdGggPSB7fTtcbiAgbWluV2lkdGhbJ3hzJ10gPSAwO1xuICBtaW5XaWR0aFsnc20nXSA9IDU3NjtcbiAgbWluV2lkdGhbJ21kJ10gPSA3Njg7XG4gIG1pbldpZHRoWydsZyddID0gOTkyO1xuICBtaW5XaWR0aFsneGwnXSA9IDEyMDA7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgZGlzcGF0Y2goJ3VwZGF0ZScsIHtcbiAgICAgIGlzT3BlbjogaXNPcGVuXG4gICAgfSk7XG4gIH1cblxuICAkOiBpZiAobmF2YmFyICYmIGV4cGFuZCkge1xuICAgIGlmICh3aW5kb3dXaWR0aCA+PSBtaW5XaWR0aFtleHBhbmRdICYmICFpc09wZW4pIHtcbiAgICAgIGlzT3BlbiA9IHRydWU7XG4gICAgICBfd2FzTWF4aW1hemVkID0gdHJ1ZTtcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gZWxzZSBpZiAod2luZG93V2lkdGggPCBtaW5XaWR0aFtleHBhbmRdICYmIF93YXNNYXhpbWF6ZWQpIHtcbiAgICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgICAgX3dhc01heGltYXplZCA9IGZhbHNlO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPHN2ZWx0ZTp3aW5kb3cgYmluZDppbm5lcldpZHRoPXt3aW5kb3dXaWR0aH0gLz5cblxueyNpZiBpc09wZW59XG4gIDxkaXZcbiAgICB0cmFuc2l0aW9uOnNsaWRlXG4gICAgb246aW50cm9zdGFydFxuICAgIG9uOmludHJvZW5kXG4gICAgb246b3V0cm9zdGFydFxuICAgIG9uOm91dHJvZW5kXG4gICAgb246aW50cm9zdGFydD17b25FbnRlcmluZ31cbiAgICBvbjppbnRyb2VuZD17b25FbnRlcmVkfVxuICAgIG9uOm91dHJvc3RhcnQ9e29uRXhpdGluZ31cbiAgICBvbjpvdXRyb2VuZD17b25FeGl0ZWR9XG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDb250ZXh0ID0gKCkgPT4gd3JpdGFibGUoe30pOyIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAnLi9Ecm9wZG93bkNvbnRleHQnO1xuXG4gIGxldCBjb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpO1xuICBzZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnLCBjb250ZXh0KTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGRpcmVjdGlvbiA9ICdkb3duJztcbiAgZXhwb3J0IGxldCBncm91cCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGFkZG9uVHlwZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0b2dnbGUgPSB1bmRlZmluZWQ7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGNvbnN0IHZhbGlkRGlyZWN0aW9ucyA9IFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J107XG5cbiAgaWYgKHZhbGlkRGlyZWN0aW9ucy5pbmRleE9mKGRpcmVjdGlvbikgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgZGlyZWN0aW9uIHNlbnQ6ICcke2RpcmVjdGlvbn0nIGlzIG5vdCBvbmUgb2YgJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCdgXG4gICAgKTtcbiAgfVxuXG4gIGxldCBjb21wb25lbnQ7XG5cbiAgJDogc3ViSXRlbUlzQWN0aXZlID0gISEoXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmXG4gICAgY29tcG9uZW50ICYmXG4gICAgdHlwZW9mIGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY3RpdmUnKVxuICApO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBkaXJlY3Rpb24gIT09ICdkb3duJyAmJiBgZHJvcCR7ZGlyZWN0aW9ufWAsXG4gICAgbmF2ICYmIGFjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAgc2V0QWN0aXZlRnJvbUNoaWxkICYmIHN1Ykl0ZW1Jc0FjdGl2ZSA/ICdhY3RpdmUnIDogZmFsc2UsXG4gICAge1xuICAgICAgW2BpbnB1dC1ncm91cC0ke2FkZG9uVHlwZX1gXTogYWRkb25UeXBlLFxuICAgICAgJ2J0bi1ncm91cCc6IGdyb3VwLFxuICAgICAgW2BidG4tZ3JvdXAtJHtzaXplfWBdOiAhIXNpemUsXG4gICAgICBkcm9wZG93bjogIWdyb3VwICYmICFhZGRvblR5cGUsXG4gICAgICBzaG93OiBpc09wZW4sXG4gICAgICAnbmF2LWl0ZW0nOiBuYXZcbiAgICB9XG4gICk7XG5cbiAgJDoge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIFsnY2xpY2snLCAndG91Y2hzdGFydCcsICdrZXl1cCddLmZvckVhY2goZXZlbnQgPT5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVEb2N1bWVudENsaWNrLCB0cnVlKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgWydjbGljaycsICd0b3VjaHN0YXJ0JywgJ2tleXVwJ10uZm9yRWFjaChldmVudCA9PlxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZURvY3VtZW50Q2xpY2ssIHRydWUpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJDoge1xuICAgIGNvbnRleHQudXBkYXRlKCgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvZ2dsZSxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbiA9PT0gJ2Rvd24nICYmIGRyb3B1cCA/ICd1cCcgOiBkaXJlY3Rpb24sXG4gICAgICAgIGluTmF2YmFyXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRG9jdW1lbnRDbGljayhlKSB7XG4gICAgaWYgKGUgJiYgKGUud2hpY2ggPT09IDMgfHwgKGUudHlwZSA9PT0gJ2tleXVwJyAmJiBlLndoaWNoICE9PSA5KSkpIHJldHVybjtcblxuICAgIGlmIChcbiAgICAgIGNvbXBvbmVudC5jb250YWlucyhlLnRhcmdldCkgJiZcbiAgICAgIGNvbXBvbmVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgIChlLnR5cGUgIT09ICdrZXl1cCcgfHwgZS53aGljaCA9PT0gOSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2dnbGUoZSk7XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIG5hdn1cbiAgPGxpIGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2xpPlxuezplbHNlfVxuICA8ZGl2IGNsYXNzPXtjbGFzc2VzfSBiaW5kOnRoaXM9e2NvbXBvbmVudH0gey4uLnByb3BzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9Ecm9wZG93bi5zdmVsdGUnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXJlY3Rpb24gPSAnZG93bic7XG4gIGV4cG9ydCBsZXQgZ3JvdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBuYXYgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhY3RpdmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBhZGRvblR5cGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG4gIGV4cG9ydCBsZXQgaW5OYXZiYXIgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBzZXRBY3RpdmVGcm9tQ2hpbGQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkcm9wdXAgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkZWZhdWx0T3BlbiA9IGZhbHNlO1xuXG4gIGxldCBpc09wZW4gPSBkZWZhdWx0T3BlbjtcbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG48RHJvcGRvd25cbiAgey4uLnByb3BzfVxuICB7aXNPcGVufVxuICB0b2dnbGU9eygpID0+IChpc09wZW4gPSAhaXNPcGVuKX1cbiAgY2xhc3M9e2NsYXNzTmFtZX1cbiAge2Rpc2FibGVkfVxuICB7ZGlyZWN0aW9ufVxuICB7Z3JvdXB9XG4gIHtuYXZ9XG4gIHthY3RpdmV9XG4gIHthZGRvblR5cGV9XG4gIHtzaXplfVxuICB7aW5OYXZiYXJ9XG4gIHtzZXRBY3RpdmVGcm9tQ2hpbGR9XG4gIHtkcm9wdXB9PlxuICA8c2xvdCAvPlxuPC9Ecm9wZG93bj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBpbXBvcnQgQnV0dG9uIGZyb20gJy4vQnV0dG9uLnN2ZWx0ZSc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgY2FyZXQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBjb2xvciA9ICdzZWNvbmRhcnknO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYXJpYUhhc3BvcHVwID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBhcmlhTGFiZWwgPSAnVG9nZ2xlIERyb3Bkb3duJztcbiAgZXhwb3J0IGxldCBzcGxpdCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IG5hdiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHNpemUgPSAnJztcbiAgZXhwb3J0IGxldCB0YWcgPSBudWxsO1xuICBleHBvcnQgbGV0IG91dGxpbmUgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwge1xuICAgICdkcm9wZG93bi10b2dnbGUnOiBjYXJldCB8fCBzcGxpdCxcbiAgICAnZHJvcGRvd24tdG9nZ2xlLXNwbGl0Jzogc3BsaXQsXG4gICAgJ25hdi1saW5rJzogbmF2XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbihlKSB7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5hdikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgICRjb250ZXh0LnRvZ2dsZShlKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgbmF2fVxuICA8YVxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAgaHJlZj1cIiNuYXZcIlxuICAgIHthcmlhSGFzcG9wdXB9XG4gICAgY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L2E+XG57OmVsc2UgaWYgdGFnID09PSAnc3Bhbid9XG4gIDxzcGFuXG4gICAgey4uLnByb3BzfVxuICAgIG9uOmNsaWNrXG4gICAgb246Y2xpY2s9e3RvZ2dsZUJ1dHRvbn1cbiAgICB7YXJpYUhhc3BvcHVwfVxuICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgIHtjb2xvcn1cbiAgICB7c2l6ZX0+XG4gICAgPHNsb3Q+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj57YXJpYUxhYmVsfTwvc3Bhbj5cbiAgICA8L3Nsb3Q+XG4gIDwvc3Bhbj5cbns6ZWxzZX1cbiAgPEJ1dHRvblxuICAgIHsuLi5wcm9wc31cbiAgICBvbjpjbGlja1xuICAgIG9uOmNsaWNrPXt0b2dnbGVCdXR0b259XG4gICAge2FyaWFIYXNwb3B1cH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICB7Y29sb3J9XG4gICAge3NpemV9XG4gICAge291dGxpbmV9PlxuICAgIDxzbG90PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+e2FyaWFMYWJlbH08L3NwYW4+XG4gICAgPC9zbG90PlxuICA8L0J1dHRvbj5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSAnc3ZlbHRlJztcbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoJ2Ryb3Bkb3duQ29udGV4dCcpO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgcmlnaHQgPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KGNsYXNzTmFtZSwgJ2Ryb3Bkb3duLW1lbnUnLCB7XG4gICAgJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnOiByaWdodCxcbiAgICBzaG93OiAkY29udGV4dC5pc09wZW5cbiAgfSk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCdkcm9wZG93bkNvbnRleHQnKTtcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGV4cG9ydCBsZXQgYWN0aXZlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBkaXZpZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaGVhZGVyID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdG9nZ2xlID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBocmVmID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChjbGFzc05hbWUsIHtcbiAgICBkaXNhYmxlZCxcbiAgICAnZHJvcGRvd24taXRlbSc6ICFkaXZpZGVyICYmICFoZWFkZXIsXG4gICAgYWN0aXZlOiBhY3RpdmUsXG4gICAgJ2Ryb3Bkb3duLWhlYWRlcic6IGhlYWRlcixcbiAgICAnZHJvcGRvd24tZGl2aWRlcic6IGRpdmlkZXJcbiAgfSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlSXRlbUNsaWNrKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQgfHwgaGVhZGVyIHx8IGRpdmlkZXIpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAkY29udGV4dC50b2dnbGUoZSk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxueyNpZiBoZWFkZXJ9XG4gIDxoNiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2g2PlxuXG57OmVsc2UgaWYgZGl2aWRlcn1cbiAgPGRpdiB7Li4ucHJvcHN9IG9uOmNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IGNsYXNzPXtjbGFzc2VzfT5cbiAgICA8c2xvdCAvPlxuICA8L2Rpdj5cbns6ZWxzZSBpZiBocmVmfVxuICA8YSBvbjp7Li4ucHJvcHN9IGNsaWNrIG9uOmNsaWNrPXtoYW5kbGVJdGVtQ2xpY2t9IHtocmVmfSBjbGFzcz17Y2xhc3Nlc30+XG4gICAgPHNsb3QgLz5cbiAgPC9hPlxuezplbHNlfVxuICA8YnV0dG9uIHsuLi5wcm9wc30gb246Y2xpY2sgb246Y2xpY2s9e2hhbmRsZUl0ZW1DbGlja30gY2xhc3M9e2NsYXNzZXN9PlxuICAgIDxzbG90IC8+XG4gIDwvYnV0dG9uPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgZmx1c2ggPSBmYWxzZTtcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICAnbGlzdC1ncm91cCcsXG4gICAgZmx1c2ggPyAnbGlzdC1ncm91cC1mbHVzaCcgOiBmYWxzZVxuICApO1xuPC9zY3JpcHQ+XG5cbjx1bCB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvdWw+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGlubGluZSA9IGZhbHNlO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCBpbmxpbmUgPyAnZm9ybS1pbmxpbmUnIDogZmFsc2UpO1xuPC9zY3JpcHQ+XG5cbjxmb3JtIHsuLi5wcm9wc30gY2xhc3M9e2NsYXNzZXN9PlxuICA8c2xvdCAvPlxuPC9mb3JtPlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcbiAgZXhwb3J0IGxldCBzaXplID0gJyc7XG5cbiAgY29uc3QgcHJvcHMgPSBjbGVhbigkJHByb3BzKTtcblxuICAkOiBjbGFzc2VzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgJ2lucHV0LWdyb3VwJyxcbiAgICBzaXplID8gYGlucHV0LWdyb3VwLSR7c2l6ZX1gIDogbnVsbFxuICApO1xuPC9zY3JpcHQ+XG5cbjxkaXYgey4uLnByb3BzfSBjbGFzcz17Y2xhc3Nlc30+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCBjbHN4IGZyb20gJ2Nsc3gnO1xuICBpbXBvcnQgeyBjbGVhbiB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcbiAgZXhwb3J0IHsgY2xhc3NOYW1lIGFzIGNsYXNzIH07XG4gIGV4cG9ydCBsZXQgYWRkb25UeXBlO1xuXG4gIGNvbnN0IHByb3BzID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgaWYgKFsncHJlcGVuZCcsICdhcHBlbmQnXS5pbmRleE9mKGFkZG9uVHlwZSkgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYGFkZG9uVHlwZSBtdXN0IGJlIG9uZSBvZiAncHJlcGVuZCcsICdhcHBlbmQnLiBSZWNlaXZlZCAnJHthZGRvblR5cGV9JyBpbnN0ZWFkLmBcbiAgICApO1xuICB9XG5cbiAgJDogY2xhc3NlcyA9IGNsc3goY2xhc3NOYW1lLCBgaW5wdXQtZ3JvdXAtJHthZGRvblR5cGV9YCk7XG48L3NjcmlwdD5cblxuPGRpdiB7Li4ucHJvcHN9IGNsYXNzPXtjbGFzc2VzfT5cbiAgPHNsb3QgLz5cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IGNsc3ggZnJvbSAnY2xzeCc7XG4gIGltcG9ydCB7IGNsZWFuIH0gZnJvbSAnLi91dGlscyc7XG5cbiAgaW1wb3J0IHsgZ2V0Q29sdW1uU2l6ZUNsYXNzLCBpc09iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG4gIGxldCBjbGFzc05hbWUgPSAnJztcblxuICBjb25zdCBwcm9wcyA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IGhpZGRlbiA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGNoZWNrID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgc2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IGZvcmU7XG4gIGV4cG9ydCB7IGZvcmUgYXMgZm9yIH07XG4gIGV4cG9ydCBsZXQgaWQgPSAnJztcbiAgZXhwb3J0IGxldCB4cyA9ICcnO1xuICBleHBvcnQgbGV0IHNtID0gJyc7XG4gIGV4cG9ydCBsZXQgbWQgPSAnJztcbiAgZXhwb3J0IGxldCBsZyA9ICcnO1xuICBleHBvcnQgbGV0IHhsID0gJyc7XG5cbiAgY29uc3QgY29sV2lkdGhzID0ge1xuICAgIHhzLFxuICAgIHNtLFxuICAgIG1kLFxuICAgIGxnLFxuICAgIHhsXG4gIH07XG4gIGV4cG9ydCBsZXQgd2lkdGhzID0gT2JqZWN0LmtleXMoY29sV2lkdGhzKTtcblxuICBjb25zdCBjb2xDbGFzc2VzID0gW107XG5cbiAgd2lkdGhzLmZvckVhY2goY29sV2lkdGggPT4ge1xuICAgIGxldCBjb2x1bW5Qcm9wID0gJCRwcm9wc1tjb2xXaWR0aF07XG5cbiAgICBpZiAoIWNvbHVtblByb3AgJiYgY29sdW1uUHJvcCAhPT0gJycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc1hzID0gY29sV2lkdGggPT09ICd4cyc7XG4gICAgbGV0IGNvbENsYXNzO1xuXG4gICAgaWYgKGlzT2JqZWN0KGNvbHVtblByb3ApKSB7XG4gICAgICBjb25zdCBjb2xTaXplSW50ZXJmaXggPSBpc1hzID8gJy0nIDogYC0ke2NvbFdpZHRofS1gO1xuICAgICAgY29sQ2xhc3MgPSBnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3Auc2l6ZSk7XG5cbiAgICAgIGNvbENsYXNzZXMucHVzaChcbiAgICAgICAgY2xzeCh7XG4gICAgICAgICAgW2NvbENsYXNzXTogY29sdW1uUHJvcC5zaXplIHx8IGNvbHVtblByb3Auc2l6ZSA9PT0gJycsXG4gICAgICAgICAgW2BvcmRlciR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5vcmRlcn1gXTpcbiAgICAgICAgICAgIGNvbHVtblByb3Aub3JkZXIgfHwgY29sdW1uUHJvcC5vcmRlciA9PT0gMCxcbiAgICAgICAgICBbYG9mZnNldCR7Y29sU2l6ZUludGVyZml4fSR7Y29sdW1uUHJvcC5vZmZzZXR9YF06XG4gICAgICAgICAgICBjb2x1bW5Qcm9wLm9mZnNldCB8fCBjb2x1bW5Qcm9wLm9mZnNldCA9PT0gMFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sQ2xhc3MgPSBnZXRDb2x1bW5TaXplQ2xhc3MoaXNYcywgY29sV2lkdGgsIGNvbHVtblByb3ApO1xuICAgICAgY29sQ2xhc3Nlcy5wdXNoKGNvbENsYXNzKTtcbiAgICB9XG4gIH0pO1xuXG4gICQ6IGNsYXNzZXMgPSBjbHN4KFxuICAgIGNsYXNzTmFtZSxcbiAgICBoaWRkZW4gPyAnc3Itb25seScgOiBmYWxzZSxcbiAgICBjaGVjayA/ICdmb3JtLWNoZWNrLWxhYmVsJyA6IGZhbHNlLFxuICAgIHNpemUgPyBgY29sLWZvcm0tbGFiZWwtJHtzaXplfWAgOiBmYWxzZSxcbiAgICBjb2xDbGFzc2VzLFxuICAgIGNvbENsYXNzZXMubGVuZ3RoID8gJ2NvbC1mb3JtLWxhYmVsJyA6IGZhbHNlXG4gICk7XG48L3NjcmlwdD5cblxuPGxhYmVsIHsuLi5wcm9wc30ge2lkfSBjbGFzcz17Y2xhc3Nlc30gZm9yPXtmb3JlfT5cbiAgPHNsb3QgLz5cbjwvbGFiZWw+XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuXG4gIGV4cG9ydCBsZXQgdHlwZSA9ICd0ZXh0JztcbiAgZXhwb3J0IGxldCBzaXplID0gdW5kZWZpbmVkO1xuICBleHBvcnQgbGV0IGJzU2l6ZSA9IHVuZGVmaW5lZDtcbiAgZXhwb3J0IGxldCBjaGVja2VkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdmFsaWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpbnZhbGlkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcGxhaW50ZXh0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgYWRkb24gPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWx1ZSA9ICcnO1xuICBleHBvcnQgbGV0IGZpbGVzID0gJyc7XG4gIGV4cG9ydCBsZXQgcmVhZG9ubHk7XG4gIGV4cG9ydCBsZXQgbXVsdGlwbGUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IG5hbWUgPSAnJztcbiAgZXhwb3J0IGxldCBwbGFjZWhvbGRlciA9ICcnO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIGNvbnN0IHsgdHlwZTogX29taXRUeXBlLCAuLi5wcm9wcyB9ID0gY2xlYW4oJCRwcm9wcyk7XG5cbiAgbGV0IGNsYXNzZXM7XG4gIGxldCB0YWc7XG4gICQ6IHtcbiAgICBjb25zdCBjaGVja0lucHV0ID0gWydyYWRpbycsICdjaGVja2JveCddLmluZGV4T2YodHlwZSkgPiAtMTtcbiAgICBjb25zdCBpc05vdGFOdW1iZXIgPSBuZXcgUmVnRXhwKCdcXFxcRCcsICdnJyk7XG5cbiAgICBjb25zdCBmaWxlSW5wdXQgPSB0eXBlID09PSAnZmlsZSc7XG4gICAgY29uc3QgdGV4dGFyZWFJbnB1dCA9IHR5cGUgPT09ICd0ZXh0YXJlYSc7XG4gICAgY29uc3Qgc2VsZWN0SW5wdXQgPSB0eXBlID09PSAnc2VsZWN0JztcbiAgICB0YWcgPSBzZWxlY3RJbnB1dCB8fCB0ZXh0YXJlYUlucHV0ID8gdHlwZSA6ICdpbnB1dCc7XG5cbiAgICBsZXQgZm9ybUNvbnRyb2xDbGFzcyA9ICdmb3JtLWNvbnRyb2wnO1xuXG4gICAgaWYgKHBsYWludGV4dCkge1xuICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9IGAke2Zvcm1Db250cm9sQ2xhc3N9LXBsYWludGV4dGA7XG4gICAgICB0YWcgPSAnaW5wdXQnO1xuICAgIH0gZWxzZSBpZiAoZmlsZUlucHV0KSB7XG4gICAgICBmb3JtQ29udHJvbENsYXNzID0gYCR7Zm9ybUNvbnRyb2xDbGFzc30tZmlsZWA7XG4gICAgfSBlbHNlIGlmIChjaGVja0lucHV0KSB7XG4gICAgICBpZiAoYWRkb24pIHtcbiAgICAgICAgZm9ybUNvbnRyb2xDbGFzcyA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQ29udHJvbENsYXNzID0gJ2Zvcm0tY2hlY2staW5wdXQnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaXplICYmIGlzTm90YU51bWJlci50ZXN0KHNpemUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdQbGVhc2UgdXNlIHRoZSBwcm9wIFwiYnNTaXplXCIgaW5zdGVhZCBvZiB0aGUgXCJzaXplXCIgdG8gYm9vdHN0cmFwXFwncyBpbnB1dCBzaXppbmcuJ1xuICAgICAgKTtcbiAgICAgIGJzU2l6ZSA9IHNpemU7XG4gICAgICBzaXplID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNsYXNzZXMgPSBjbHN4KFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgaW52YWxpZCAmJiAnaXMtaW52YWxpZCcsXG4gICAgICB2YWxpZCAmJiAnaXMtdmFsaWQnLFxuICAgICAgYnNTaXplID8gYGZvcm0tY29udHJvbC0ke2JzU2l6ZX1gIDogZmFsc2UsXG4gICAgICBmb3JtQ29udHJvbENsYXNzXG4gICAgKTtcbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgdGFnID09PSAnaW5wdXQnfVxuICB7I2lmIHR5cGUgPT09ICd0ZXh0J31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAncGFzc3dvcmQnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZW1haWwnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZmlsZSd9XG4gICAgPGlucHV0XG4gICAgICB7Li4ucHJvcHN9XG4gICAgICB7aWR9XG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOmZpbGVzXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2NoZWNrYm94J31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOmNoZWNrZWRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAncmFkaW8nfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAndXJsJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ1cmxcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICdudW1iZXInfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICBvbjpibHVyXG4gICAgICBvbjpmb2N1c1xuICAgICAgb246a2V5ZG93blxuICAgICAgb246a2V5cHJlc3NcbiAgICAgIG9uOmtleXVwXG4gICAgICBvbjpjaGFuZ2VcbiAgICAgIG9uOmlucHV0XG4gICAgICBiaW5kOnZhbHVlXG4gICAgICB7cmVhZG9ubHl9XG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfSAvPlxuICB7OmVsc2UgaWYgdHlwZSA9PT0gJ2RhdGUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImRhdGVcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgezplbHNlIGlmIHR5cGUgPT09ICd0aW1lJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnZGF0ZXRpbWUnfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImRhdGV0aW1lXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnY29sb3InfVxuICAgIDxpbnB1dFxuICAgICAgey4uLnByb3BzfVxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImNvbG9yXCJcbiAgICAgIG9uOmJsdXJcbiAgICAgIG9uOmZvY3VzXG4gICAgICBvbjprZXlkb3duXG4gICAgICBvbjprZXlwcmVzc1xuICAgICAgb246a2V5dXBcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIGJpbmQ6dmFsdWVcbiAgICAgIHtyZWFkb25seX1cbiAgICAgIGNsYXNzPXtjbGFzc2VzfVxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9IC8+XG4gIHs6ZWxzZSBpZiB0eXBlID09PSAnc2VhcmNoJ31cbiAgICA8aW5wdXRcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtpZH1cbiAgICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmtleWRvd25cbiAgICAgIG9uOmtleXByZXNzXG4gICAgICBvbjprZXl1cFxuICAgICAgb246Y2hhbmdlXG4gICAgICBvbjppbnB1dFxuICAgICAgYmluZDp2YWx1ZVxuICAgICAge3JlYWRvbmx5fVxuICAgICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgICB7bmFtZX1cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIHtwbGFjZWhvbGRlcn0gLz5cbiAgey9pZn1cblxuezplbHNlIGlmIHRhZyA9PT0gJ3RleHRhcmVhJ31cbiAgPHRleHRhcmVhXG4gICAgey4uLnByb3BzfVxuICAgIHtpZH1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjprZXlkb3duXG4gICAgb246a2V5cHJlc3NcbiAgICBvbjprZXl1cFxuICAgIG9uOmNoYW5nZVxuICAgIG9uOmlucHV0XG4gICAgYmluZDp2YWx1ZVxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH0gLz5cblxuezplbHNlIGlmIHRhZyA9PT0gJ3NlbGVjdCd9XG4gIDxzZWxlY3RcbiAgICB7Li4ucHJvcHN9XG4gICAge2lkfVxuICAgIHttdWx0aXBsZX1cbiAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH0+XG4gICAgPHNsb3QgLz5cbiAgPC9zZWxlY3Q+XG5cbnsvaWZ9XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgY2xzeCBmcm9tICdjbHN4JztcbiAgaW1wb3J0IHsgY2xlYW4gfSBmcm9tICcuL3V0aWxzJztcblxuICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gIGV4cG9ydCB7IGNsYXNzTmFtZSBhcyBjbGFzcyB9O1xuICBleHBvcnQgbGV0IG5hbWUgPSAnJztcbiAgZXhwb3J0IGxldCBpZCA9ICcnO1xuICBleHBvcnQgbGV0IHR5cGU7XG4gIGV4cG9ydCBsZXQgbGFiZWwgPSAnJztcbiAgZXhwb3J0IGxldCBjaGVja2VkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBpbmxpbmUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCB2YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHZhbHVlID0gJyc7XG4gIGV4cG9ydCBsZXQgaW52YWxpZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGJzU2l6ZSA9ICcnO1xuICBleHBvcnQgbGV0IHBsYWNlaG9sZGVyID0gJyc7XG4gIGV4cG9ydCBsZXQgaHRtbEZvciA9ICcnO1xuICBleHBvcnQgeyBodG1sRm9yIGFzIGZvciB9O1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBjb25zdCB7IHR5cGU6IF9vbWl0VHlwZSwgLi4ucHJvcHMgfSA9IGNsZWFuKCQkcHJvcHMpO1xuXG4gICQ6IGN1c3RvbUNsYXNzID0gY2xzeChcbiAgICBjbGFzc05hbWUsXG4gICAgYGN1c3RvbS0ke3R5cGV9YCxcbiAgICBic1NpemUgPyBgY3VzdG9tLSR7dHlwZX0tJHtic1NpemV9YCA6IGZhbHNlXG4gICk7XG5cbiAgJDogdmFsaWRhdGlvbkNsYXNzTmFtZXMgPSBjbHN4KGludmFsaWQgJiYgJ2lzLWludmFsaWQnLCB2YWxpZCAmJiAnaXMtdmFsaWQnKTtcblxuICAkOiBjb21iaW5lZENsYXNzZXMgPSBjbHN4KGN1c3RvbUNsYXNzLCB2YWxpZGF0aW9uQ2xhc3NOYW1lcyk7XG5cbiAgJDogZmlsZUNsYXNzZXMgPSBjbHN4KHZhbGlkYXRpb25DbGFzc05hbWVzLCAnY3VzdG9tLWZpbGUtaW5wdXQnKTtcblxuICAkOiB3cmFwcGVyQ2xhc3NlcyA9IGNsc3goY3VzdG9tQ2xhc3MsICdjdXN0b20tY29udHJvbCcsIHtcbiAgICAnY3VzdG9tLWNvbnRyb2wtaW5saW5lJzogaW5saW5lXG4gIH0pO1xuXG4gICQ6IGN1c3RvbUNvbnRyb2xDbGFzc2VzID0gY2xzeCh2YWxpZGF0aW9uQ2xhc3NOYW1lcywgJ2N1c3RvbS1jb250cm9sLWlucHV0Jyk7XG5cbiAgJDogbGFiZWxIdG1sRm9yID0gaHRtbEZvciB8fCBpZDtcbjwvc2NyaXB0PlxuXG57I2lmIHR5cGUgPT09ICdzZWxlY3QnfVxuICA8c2VsZWN0XG4gICAge2lkfVxuICAgIGNsYXNzPXtjb21iaW5lZENsYXNzZXN9XG4gICAgb246Ymx1clxuICAgIG9uOmZvY3VzXG4gICAgb246Y2hhbmdlXG4gICAgb246aW5wdXRcbiAgICBiaW5kOnZhbHVlXG4gICAge25hbWV9XG4gICAge2Rpc2FibGVkfVxuICAgIHtwbGFjZWhvbGRlcn1cbiAgICB7Li4ucHJvcHN9PlxuICAgIDxzbG90IC8+XG4gIDwvc2VsZWN0PlxuezplbHNlIGlmIHR5cGUgPT09ICdmaWxlJ31cbiAgPGRpdiBjbGFzcz17Y3VzdG9tQ2xhc3N9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgY2xhc3M9e2ZpbGVDbGFzc2VzfVxuICAgICAgb246Ymx1clxuICAgICAgb246Zm9jdXNcbiAgICAgIG9uOmNoYW5nZVxuICAgICAgb246aW5wdXRcbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgey4uLnByb3BzfSAvPlxuICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1maWxlLWxhYmVsXCIgZm9yPXtsYWJlbEh0bWxGb3J9PlxuICAgICAge2xhYmVsIHx8ICdDaG9vc2UgZmlsZSd9XG4gICAgPC9sYWJlbD5cbiAgPC9kaXY+XG57OmVsc2UgaWYgdHlwZSA9PT0gJ3N3aXRjaCcgfHwgdHlwZSA9PT0gJ2NoZWNrYm94J31cbiAgPGRpdiBjbGFzcz17d3JhcHBlckNsYXNzZXN9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgIGNsYXNzPXtjdXN0b21Db250cm9sQ2xhc3Nlc31cbiAgICAgIGJpbmQ6Y2hlY2tlZFxuICAgICAge25hbWV9XG4gICAgICB7ZGlzYWJsZWR9XG4gICAgICB7cGxhY2Vob2xkZXJ9XG4gICAgICB7Li4ucHJvcHN9IC8+XG4gICAgPGxhYmVsIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtbGFiZWxcIiBmb3I9e2xhYmVsSHRtbEZvcn0+e2xhYmVsfTwvbGFiZWw+XG4gICAgPHNsb3QgLz5cbiAgPC9kaXY+XG57OmVsc2UgaWYgdHlwZSA9PT0gJ3JhZGlvJ31cbiAgPGRpdiBjbGFzcz17d3JhcHBlckNsYXNzZXN9PlxuICAgIDxpbnB1dFxuICAgICAge2lkfVxuICAgICAgdHlwZT1cInJhZGlvXCJcbiAgICAgIGNsYXNzPXtjdXN0b21Db250cm9sQ2xhc3Nlc31cbiAgICAgIHtuYW1lfVxuICAgICAge2Rpc2FibGVkfVxuICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgey4uLnByb3BzfSAvPlxuICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1jb250cm9sLWxhYmVsXCIgZm9yPXtsYWJlbEh0bWxGb3J9PntsYWJlbH08L2xhYmVsPlxuICAgIDxzbG90IC8+XG4gIDwvZGl2PlxuezplbHNlfVxuICA8aW5wdXRcbiAgICB7dHlwZX1cbiAgICB7aWR9XG4gICAgY2xhc3M9e2NvbWJpbmVkQ2xhc3Nlc31cbiAgICBvbjpibHVyXG4gICAgb246Zm9jdXNcbiAgICBvbjpjaGFuZ2VcbiAgICBvbjppbnB1dFxuICAgIHtuYW1lfVxuICAgIHtkaXNhYmxlZH1cbiAgICB7cGxhY2Vob2xkZXJ9XG4gICAgey4uLnByb3BzfSAvPlxuey9pZn1cbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IE5hdmJhciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL05hdmJhci5zdmVsdGVcIjtcclxuICBpbXBvcnQgTmF2YmFyQnJhbmQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZiYXJCcmFuZC5zdmVsdGVcIjtcclxuICBpbXBvcnQgTmF2YmFyVG9nZ2xlciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL05hdmJhclRvZ2dsZXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL05hdi5zdmVsdGVcIjtcclxuICBpbXBvcnQgTmF2SXRlbSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL05hdkl0ZW0uc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdkxpbmsgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9OYXZMaW5rLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBDb2xsYXBzZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbGxhcHNlLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBVbmNvbnRyb2xsZWREcm9wZG93biBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL1VuY29udHJvbGxlZERyb3Bkb3duLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBEcm9wZG93blRvZ2dsZSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Ryb3Bkb3duVG9nZ2xlLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBEcm9wZG93bk1lbnUgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9Ecm9wZG93bk1lbnUuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IERyb3Bkb3duSXRlbSBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0Ryb3Bkb3duSXRlbS5zdmVsdGVcIjtcclxuICBpbXBvcnQgTGlzdEdyb3VwIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvTGlzdEdyb3VwLnN2ZWx0ZVwiO1xyXG4gIGltcG9ydCBGb3JtIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvRm9ybS5zdmVsdGVcIjtcclxuICBpbXBvcnQgSW5wdXRHcm91cCBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0lucHV0R3JvdXAuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IElucHV0R3JvdXBBZGRvbiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0lucHV0R3JvdXBBZGRvbi5zdmVsdGVcIjtcclxuICBpbXBvcnQgTGFiZWwgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9MYWJlbC5zdmVsdGVcIjtcclxuICBpbXBvcnQgSW5wdXQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9JbnB1dC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQ3VzdG9tSW5wdXQgZnJvbSBcInN2ZWx0ZXN0cmFwL3NyYy9DdXN0b21JbnB1dC5zdmVsdGVcIjtcclxuICBpbXBvcnQgQnV0dG9uIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQnV0dG9uLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IGNvbG9yO1xyXG4gIGV4cG9ydCBsZXQgdGl0bGU7XHJcblxyXG4gIGZ1bmN0aW9uIHNlYXJjaEhhbmRsZSgpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfVxyXG48L3NjcmlwdD5cclxuXHJcbjxOYXZiYXIgY2xhc3M9XCJsLXByb3Rvbi10b3BuYXYgbmF2YmFyLWV4cGFuZFwiIHtjb2xvcn0gZGFyayBleHBhbmQ9XCJtZFwiPlxyXG4gIDxOYXZiYXJCcmFuZCBocmVmPVwiLlwiPjxzcGFuIGNsYXNzPVwibC1sb2dvLXNwYW5cIj7Ouzwvc3Bhbj57dGl0bGV9PHNwYW4gY2xhc3M9XCJsLWxvZ28tc3BhblwiPi5qczwvc3Bhbj48L05hdmJhckJyYW5kPlxyXG4gIDxOYXYgY2xhc3M9XCJtbC1hdXRvXCIgbmF2YmFyPlxyXG4gICAgPEZvcm0gaW5saW5lPlxyXG4gICAgICA8SW5wdXRHcm91cD5cclxuICAgICAgICA8SW5wdXRcclxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgbmFtZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICBpZD1cImV4YW1wbGVTZWFyY2hcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCLQmNGB0LrQsNGC0YwuLlwiIC8+XHJcbiAgICAgICAgPElucHV0R3JvdXBBZGRvbiBhZGRvblR5cGU9eydhcHBlbmQnfT5cclxuICAgICAgICAgIDxCdXR0b24gY29sb3I9XCJwcmltYXJ5XCIgb246Y2xpY2s9e3NlYXJjaEhhbmRsZX0+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNlYXJjaFwiIC8+XHJcbiAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICA8L0lucHV0R3JvdXBBZGRvbj5cclxuICAgICAgPC9JbnB1dEdyb3VwPlxyXG4gICAgPC9Gb3JtPlxyXG4gICAgPExpc3RHcm91cCBjbGFzcz1cIm1sLWF1dG8gbWwtbWQtMFwiPlxyXG4gICAgICA8VW5jb250cm9sbGVkRHJvcGRvd24gbmF2IGluTmF2YmFyPlxyXG4gICAgICAgIDxEcm9wZG93blRvZ2dsZSBuYXYgY2FyZXQ+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS11c2VyLWNpcmNsZSBmYS1mdyBtbC0zXCIgLz5cclxuICAgICAgICA8L0Ryb3Bkb3duVG9nZ2xlPlxyXG4gICAgICAgIDxEcm9wZG93bk1lbnUgcmlnaHQ+XHJcbiAgICAgICAgICA8RHJvcGRvd25JdGVtPiAgICAgICAgIFxyXG4gICAgIFxyXG4gICAgICAgICAgPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cInNldHRpbmdzXCI+PGkgY2xhc3M9XCJmYXMgZmEtY29nXCIgLz4g0J3QsNGB0YLRgNC+0LnQutC4PC9hPlxyXG4gICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICA8RHJvcGRvd25JdGVtPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiYWN0aXZpdHlfbG9nXCI+PGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkLWxpc3RcIj48L2k+INCQ0LrRgtC40LLQvdC+0YHRgtGMPC9hPlxyXG4gICAgICAgICAgPC9Ecm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICA8RHJvcGRvd25JdGVtIGRpdmlkZXIgLz5cclxuICAgICAgICAgIDxEcm9wZG93bkl0ZW0+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCJwYWdlcy9hdXRoZW50aWNhdGlvbi9sb2dpblwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zaWduLW91dC1hbHRcIj48L2k+ICDQktGL0LnRgtC4XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDwvRHJvcGRvd25JdGVtPlxyXG4gICAgICAgIDwvRHJvcGRvd25NZW51PlxyXG4gICAgICA8L1VuY29udHJvbGxlZERyb3Bkb3duPlxyXG4gICAgPC9MaXN0R3JvdXA+XHJcbiAgPC9OYXY+XHJcbjwvTmF2YmFyPlxyXG4iLCI8c2NyaXB0PlxyXG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcclxuXHJcbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcclxuXHJcbiAgZXhwb3J0IGxldCB0ZXh0ID0gXCJcIjtcclxuICBleHBvcnQgbGV0IGhyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiO1xyXG4gIGV4cG9ydCBsZXQgbGVmdEljb24gPSBmYWxzZTtcclxuICBleHBvcnQgbGV0IHJpZ2h0SWNvbiA9IGZhbHNlO1xyXG5cclxuICBsZXQgY2xhc3NOYW1lID0gXCJcIjtcclxuICBleHBvcnQgeyBjbGFzc05hbWUgYXMgY2xhc3MgfTtcclxuICBjb25zdCBoYW5kbGVDbGljayA9ICgpID0+IHtcclxuICAgIGRpc3BhdGNoKFwicHJlc3NcIik7XHJcbiAgfTtcclxuPC9zY3JpcHQ+XHJcblxyXG48YSBjbGFzcz1cIm5hdi1saW5rIHtjbGFzc05hbWV9XCIge2hyZWZ9IG9uOmNsaWNrPXtoYW5kbGVDbGlja30+XHJcbiAgeyNpZiBsZWZ0SWNvbn1cclxuICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1uYXYtbGluay1pY29uXCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICA8L2Rpdj5cclxuICB7L2lmfVxyXG4gIHt0ZXh0fVxyXG4gIHsjaWYgcmlnaHRJY29ufVxyXG4gICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtY29sbGFwc2UtYXJyb3dcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cInJpZ2h0SWNvblwiIC8+XHJcbiAgICA8L2Rpdj5cclxuICB7L2lmfVxyXG48L2E+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IENvbGxhcHNlIGZyb20gXCJzdmVsdGVzdHJhcC9zcmMvQ29sbGFwc2Uuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IE5hdiBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL05hdi5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IFNpZGViYXJJdGVtIGZyb20gXCIuL1NpZGViYXJJdGVtLnN2ZWx0ZVwiO1xyXG5cclxuICBleHBvcnQgbGV0IHNlZ21lbnQ7XHJcbiAgZXhwb3J0IGxldCB0aGVtZTtcclxuXHJcbiAgJDogc2lkZW5hdl90aGVtZSA9IGBsLXByb3Rvbi1zaWRlbmF2LSR7dGhlbWV9YDtcclxuXHJcbiAgbGV0IGlzTGF5b3V0T3BlbiA9IGZhbHNlO1xyXG4gIGxldCBpc1BhZ2VPcGVuID0gZmFsc2U7XHJcbiAgbGV0IGlzQXV0aGVudGljYXRpb25PcGVuID0gZmFsc2U7XHJcbiAgbGV0IGlzRXJyb3JPcGVuID0gZmFsc2U7XHJcbiAgbGV0IGFjdGl2ZUxpbmsgPSBcItCf0LDQvdC10LvRjFwiO1xyXG4gIGxldCBmb290ZXJOYW1lID0gXCLOu3Byb3RvbiBib3lcIjtcclxuICBsZXQgZm9vdGVyVGV4dCA9IFwi0JLRiyDQstC+0YjQu9C4INC60LDQujpcIjtcclxuXHJcbiAgY29uc3QgdXBkYXRlQWN0aXZlTGluayA9IGxpbmtOYW1lID0+IChhY3RpdmVMaW5rID0gbGlua05hbWUpO1xyXG5cclxuICBjb25zdCB0b2dnbGVMYXlvdXQgPSAoKSA9PiB7XHJcbiAgICBpc0xheW91dE9wZW4gPSAhaXNMYXlvdXRPcGVuO1xyXG4gICAgaWYgKGlzUGFnZU9wZW4gPT09IHRydWUpIGlzUGFnZU9wZW4gPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCB0b2dnbGVQYWdlcyA9ICgpID0+IHtcclxuICAgIGlzUGFnZU9wZW4gPSAhaXNQYWdlT3BlbjtcclxuICAgIGlmIChpc0xheW91dE9wZW4gPT09IHRydWUpIGlzTGF5b3V0T3BlbiA9IGZhbHNlO1xyXG4gICAgaWYgKGlzUGFnZU9wZW4gPT09IGZhbHNlKSB7XHJcbiAgICAgIGlzQXV0aGVudGljYXRpb25PcGVuID0gZmFsc2U7XHJcbiAgICAgIGlzRXJyb3JPcGVuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdG9nZ2xlQXV0aGVudGljYXRpb24gPSAoKSA9PiB7XHJcbiAgICBpc0F1dGhlbnRpY2F0aW9uT3BlbiA9ICFpc0F1dGhlbnRpY2F0aW9uT3BlbjtcclxuICAgIGlmIChpc0Vycm9yT3BlbiA9PT0gdHJ1ZSkgaXNFcnJvck9wZW4gPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBjb25zdCB0b2dnbGVFcnJvciA9ICgpID0+IHtcclxuICAgIGlzRXJyb3JPcGVuID0gIWlzRXJyb3JPcGVuO1xyXG4gICAgaWYgKGlzQXV0aGVudGljYXRpb25PcGVuID09PSB0cnVlKSBpc0F1dGhlbnRpY2F0aW9uT3BlbiA9IGZhbHNlO1xyXG4gIH07XHJcbjwvc2NyaXB0PlxyXG5cclxuPGRpdiBpZD1cImxheW91dFNpZGVuYXZfbmF2XCIgY2xhc3M9XCJsLXByb3Rvbi1uYXYtZml4ZWRcIj5cclxuICA8TmF2XHJcbiAgICBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYge3NpZGVuYXZfdGhlbWV9IGFjY29yZGlvbiBsLXByb3Rvbi1uYXYtZml4ZWRcIlxyXG4gICAgaWQ9XCJzaWRlbmF2QWNjb3JkaW9uXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51XCI+XHJcbiAgICAgIDxOYXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1oZWFkaW5nXCI+0K/QtNGA0L48L2Rpdj5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIG9uOnByZXNzPXsoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoZW1lID0gJ2RhcmsnO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAgIHRleHQ9XCJEYXNoYm9hcmRcIlxyXG4gICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICcuJyB8fCBzZWdtZW50ID09PSB1bmRlZmluZWQgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgbGVmdEljb25cclxuICAgICAgICAgIGhyZWY9XCIuXCI+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1hdG9tXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LW1lbnUtaGVhZGluZ1wiPtCY0L3RgtC10YDRhNC10LnRgTwvZGl2PlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgb246cHJlc3M9e3RvZ2dsZUxheW91dH1cclxuICAgICAgICAgIGNsYXNzPXshaXNMYXlvdXRPcGVuID8gJ2NvbGxhcHNlZCcgOiAnJ31cclxuICAgICAgICAgIHRleHQ9XCJMYXlvdXRzXCJcclxuICAgICAgICAgIGxlZnRJY29uXHJcbiAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jb2x1bW5zXCIgc2xvdD1cImxlZnRJY29uXCIgLz5cclxuICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWFuZ2xlLWRvd25cIiBzbG90PVwicmlnaHRJY29uXCIgLz5cclxuICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgIDxDb2xsYXBzZSBpc09wZW49e2lzTGF5b3V0T3Blbn0+XHJcbiAgICAgICAgICA8TmF2IGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LW5lc3RlZFwiPlxyXG4gICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhlbWUgPSAnZGFyayc7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVBY3RpdmVMaW5rKCdTdGF0aWMgTmF2aWdhdGlvbicpO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgY2xhc3M9e3NlZ21lbnQgPT09ICdsYXlvdXRzJyAmJiBhY3RpdmVMaW5rID09PSAnU3RhdGljIE5hdmlnYXRpb24nID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgICAgICBocmVmPVwibGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvblwiXHJcbiAgICAgICAgICAgICAgdGV4dD1cIlN0YXRpYyBOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgb246cHJlc3M9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoZW1lID0gJ2xpZ2h0JztcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUFjdGl2ZUxpbmsoJ0xpZ2h0IFNpZGVuYXYnKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAnbGF5b3V0cycgJiYgYWN0aXZlTGluayA9PT0gJ0xpZ2h0IFNpZGVuYXYnID8gJ2FjdGl2ZScgOiAnJ31cclxuICAgICAgICAgICAgICBocmVmPVwibGF5b3V0cy9saWdodF9zaWRlbmF2XCJcclxuICAgICAgICAgICAgICB0ZXh0PVwiTGlnaHQgU2lkZW5hdlwiIC8+XHJcbiAgICAgICAgICA8L05hdj5cclxuICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgICAgIDxTaWRlYmFySXRlbVxyXG4gICAgICAgICAgb246cHJlc3M9e3RvZ2dsZVBhZ2VzfVxyXG4gICAgICAgICAgY2xhc3M9eyFpc1BhZ2VPcGVuID8gJ2NvbGxhcHNlZCcgOiAnJ31cclxuICAgICAgICAgIHRleHQ9XCLQodGC0YDQsNC90LjRhtGLXCJcclxuICAgICAgICAgIGxlZnRJY29uXHJcbiAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICA8c3ZnXHJcbiAgICAgICAgICAgIHNsb3Q9XCJsZWZ0SWNvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwic3ZnLWlubGluZS0tZmEgZmEtYm9vay1vcGVuIGZhLXctMThcIlxyXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxyXG4gICAgICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXHJcbiAgICAgICAgICAgIGRhdGEtcHJlZml4PVwiZmFzXCJcclxuICAgICAgICAgICAgZGF0YS1pY29uPVwiYm9vay1vcGVuXCJcclxuICAgICAgICAgICAgcm9sZT1cImltZ1wiXHJcbiAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDU3NiA1MTJcIlxyXG4gICAgICAgICAgICBkYXRhLWZhLWkyc3ZnPVwiXCI+XHJcbiAgICAgICAgICAgIDxwYXRoXHJcbiAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgICAgICAgICAgZD1cIk01NDIuMjIgMzIuMDVjLTU0LjggMy4xMS0xNjMuNzIgMTQuNDMtMjMwLjk2IDU1LjU5LTQuNjRcclxuICAgICAgICAgICAgICAyLjg0LTcuMjcgNy44OS03LjI3IDEzLjE3djM2My44N2MwIDExLjU1IDEyLjYzIDE4Ljg1IDIzLjI4IDEzLjQ5XHJcbiAgICAgICAgICAgICAgNjkuMTgtMzQuODIgMTY5LjIzLTQ0LjMyIDIxOC43LTQ2LjkyIDE2Ljg5LS44OSAzMC4wMi0xNC40M1xyXG4gICAgICAgICAgICAgIDMwLjAyLTMwLjY2VjYyLjc1Yy4wMS0xNy43MS0xNS4zNS0zMS43NC0zMy43Ny0zMC43ek0yNjQuNzNcclxuICAgICAgICAgICAgICA4Ny42NEMxOTcuNSA0Ni40OCA4OC41OCAzNS4xNyAzMy43OCAzMi4wNSAxNS4zNiAzMS4wMSAwIDQ1LjA0IDBcclxuICAgICAgICAgICAgICA2Mi43NVY0MDAuNmMwIDE2LjI0IDEzLjEzIDI5Ljc4IDMwLjAyIDMwLjY2IDQ5LjQ5IDIuNiAxNDkuNTkgMTIuMTFcclxuICAgICAgICAgICAgICAyMTguNzcgNDYuOTUgMTAuNjIgNS4zNSAyMy4yMS0xLjk0XHJcbiAgICAgICAgICAgICAgMjMuMjEtMTMuNDZWMTAwLjYzYzAtNS4yOS0yLjYyLTEwLjE0LTcuMjctMTIuOTl6XCIgLz5cclxuICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgIDwvU2lkZWJhckl0ZW0+XHJcbiAgICAgICAgPENvbGxhcHNlIGlzT3Blbj17aXNQYWdlT3Blbn0+XHJcbiAgICAgICAgICA8TmF2XHJcbiAgICAgICAgICAgIGNsYXNzPVwibC1wcm90b24tc2lkZW5hdi1tZW51LW5lc3RlZCBhY2NvcmRpb25cIlxyXG4gICAgICAgICAgICBpZD1cInNpZGVuYXZBY2NvcmRpb25QYWdlc1wiPlxyXG4gICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICBvbjpwcmVzcz17dG9nZ2xlQXV0aGVudGljYXRpb259XHJcbiAgICAgICAgICAgICAgY2xhc3M9eyFpc0F1dGhlbnRpY2F0aW9uT3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICAgICAgdGV4dD1cIkF1dGhlbnRpY2F0aW9uXCJcclxuICAgICAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc0F1dGhlbnRpY2F0aW9uT3Blbn0+XHJcbiAgICAgICAgICAgICAgPE5hdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWRcIj5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbSBocmVmPVwicGFnZXMvYXV0aGVudGljYXRpb24vbG9naW5cIiB0ZXh0PVwiTG9naW5cIiAvPlxyXG4gICAgICAgICAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICAgICAgICAgIGhyZWY9XCJwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3RlclwiXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ9XCJSZWdpc3RlclwiIC8+XHJcbiAgICAgICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICAgICAgaHJlZj1cInBhZ2VzL2F1dGhlbnRpY2F0aW9uL2ZvcmdldF9wYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgICAgIHRleHQ9XCJGb3Jnb3QgUGFzc3dvcmRcIiAvPlxyXG4gICAgICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgICAgICA8L0NvbGxhcHNlPlxyXG4gICAgICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgICAgICBvbjpwcmVzcz17dG9nZ2xlRXJyb3J9XHJcbiAgICAgICAgICAgICAgY2xhc3M9eyFpc0Vycm9yT3BlbiA/ICdjb2xsYXBzZWQnIDogJyd9XHJcbiAgICAgICAgICAgICAgdGV4dD1cIkVycm9yXCJcclxuICAgICAgICAgICAgICByaWdodEljb24+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYW5nbGUtZG93blwiIHNsb3Q9XCJyaWdodEljb25cIiAvPlxyXG4gICAgICAgICAgICA8L1NpZGViYXJJdGVtPlxyXG4gICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuPXtpc0Vycm9yT3Blbn0+XHJcbiAgICAgICAgICAgICAgPE5hdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1uZXN0ZWRcIj5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbSBocmVmPVwicGFnZXMvZXJyb3IvZXJyb3JfNDAxXCIgdGV4dD1cIjQwMSBQYWdlXCIgLz5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbSBocmVmPVwicGFnZXMvZXJyb3IvZXJyb3JfNDA0XCIgdGV4dD1cIjQwNCBQYWdlXCIgLz5cclxuICAgICAgICAgICAgICAgIDxTaWRlYmFySXRlbSBocmVmPVwicGFnZXMvZXJyb3IvZXJyb3JfNTAwXCIgdGV4dD1cIjUwMCBQYWdlXCIgLz5cclxuICAgICAgICAgICAgICA8L05hdj5cclxuICAgICAgICAgICAgPC9Db2xsYXBzZT5cclxuICAgICAgICAgIDwvTmF2PlxyXG4gICAgICAgIDwvQ29sbGFwc2U+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLXNpZGVuYXYtbWVudS1oZWFkaW5nXCI+0JDQtNC00L7QvdGLINC4INC/0YDQuNC80LXRgdC4PC9kaXY+XHJcbiAgICAgICAgPFNpZGViYXJJdGVtXHJcbiAgICAgICAgICBjbGFzcz17c2VnbWVudCA9PT0gJ2NoYXJ0cycgPyAnYWN0aXZlJyA6ICcnfVxyXG4gICAgICAgICAgb246cHJlc3M9eygpID0+IHtcclxuICAgICAgICAgICAgdGhlbWUgPSAnZGFyayc7XHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgaHJlZj1cImNoYXJ0c1wiXHJcbiAgICAgICAgICB0ZXh0PVwiQ2hhcnRzXCJcclxuICAgICAgICAgIGxlZnRJY29uPlxyXG4gICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYXJlYVwiIHNsb3Q9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgICA8U2lkZWJhckl0ZW1cclxuICAgICAgICAgIGNsYXNzPXtzZWdtZW50ID09PSAndGFibGVzJyA/ICdhY3RpdmUnIDogJyd9XHJcbiAgICAgICAgICBvbjpwcmVzcz17KCkgPT4ge1xyXG4gICAgICAgICAgICB0aGVtZSA9ICdkYXJrJztcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICBocmVmPVwidGFibGVzXCJcclxuICAgICAgICAgIHRleHQ9XCJUYWJsZXNcIlxyXG4gICAgICAgICAgbGVmdEljb24+XHJcbiAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10YWJsZVwiIHNsb3Q9XCJsZWZ0SWNvblwiIC8+XHJcbiAgICAgICAgPC9TaWRlYmFySXRlbT5cclxuICAgICAgPC9OYXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJsLXByb3Rvbi1zaWRlbmF2LWZvb3RlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwic21hbGxcIj57Zm9vdGVyVGV4dH08L2Rpdj5cclxuICAgICAge2Zvb3Rlck5hbWV9XHJcbiAgICA8L2Rpdj5cclxuICA8L05hdj5cclxuPC9kaXY+XHJcbiIsIjxzY3JpcHQ+XHJcbiAgaW1wb3J0IENvbnRhaW5lciBmcm9tIFwic3ZlbHRlc3RyYXAvc3JjL0NvbnRhaW5lci5zdmVsdGVcIjtcclxuXHJcbiAgaW1wb3J0IE5hdmJhciBmcm9tIFwiLi4vY29tcG9uZW50cy9OYXZiYXIuc3ZlbHRlXCI7XHJcbiAgaW1wb3J0IFNpZGViYXIgZnJvbSBcIi4uL2NvbXBvbmVudHMvU2lkZWJhci5zdmVsdGVcIjtcclxuICBpbXBvcnQgRm9vdGVyIGZyb20gXCIuLi9jb21wb25lbnRzL0Zvb3Rlci5zdmVsdGVcIjtcclxuXHJcbiAgZXhwb3J0IGxldCBzZWdtZW50O1xyXG5cclxuICBsZXQgdGhlbWUgPSBcImRhcmtcIjtcclxuICBsZXQgY29sb3IgPSBcImRhcmtcIjtcclxuICBsZXQgdGl0bGUgPSBcInByb3RvblwiO1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdmVsdGU6aGVhZD5cclxuICA8dGl0bGU+e3RpdGxlfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcblxyXG57I2lmIHNlZ21lbnQgIT09ICdwYWdlcyd9XHJcbiAgPGRpdiBjbGFzcz1cImwtcHJvdG9uLW5hdi1zdGF0aWNcIj5cclxuICAgIDxOYXZiYXIge3NlZ21lbnR9IHtjb2xvcn0ge3RpdGxlfSAvPlxyXG4gICAgPGRpdiBpZD1cImxheW91dFNpZGVuYXZcIj5cclxuICAgICAgPFNpZGViYXIge3NlZ21lbnR9IHt0aGVtZX0gLz5cclxuICAgICAgPGRpdiBpZD1cImxheW91dFNpZGVuYXZfY29udGVudFwiPlxyXG4gICAgICAgIDxtYWluPlxyXG4gICAgICAgICAgPENvbnRhaW5lciBmbHVpZD17dHJ1ZX0+XHJcbiAgICAgICAgICAgIDxzbG90IC8+XHJcbiAgICAgICAgICA8L0NvbnRhaW5lcj5cclxuICAgICAgICA8L21haW4+XHJcbiAgICAgICAgPEZvb3RlciAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG57OmVsc2V9XHJcbiAgPGJvZHk+XHJcbiAgICA8c2xvdCAvPlxyXG4gIDwvYm9keT5cclxuey9pZn1cclxuIiwiPHNjcmlwdD5cclxuXHRleHBvcnQgbGV0IHN0YXR1cztcclxuXHRleHBvcnQgbGV0IGVycm9yO1xyXG5cclxuXHRjb25zdCBkZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGU+XHJcblx0aDEsIHAge1xyXG5cdFx0bWFyZ2luOiAwIGF1dG87XHJcblx0fVxyXG5cclxuXHRoMSB7XHJcblx0XHRmb250LXNpemU6IDIuOGVtO1xyXG5cdFx0Zm9udC13ZWlnaHQ6IDcwMDtcclxuXHRcdG1hcmdpbjogMCAwIDAuNWVtIDA7XHJcblx0fVxyXG5cclxuXHRwIHtcclxuXHRcdG1hcmdpbjogMWVtIGF1dG87XHJcblx0fVxyXG5cclxuXHRAbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcclxuXHRcdGgxIHtcclxuXHRcdFx0Zm9udC1zaXplOiA0ZW07XHJcblx0XHR9XHJcblx0fVxyXG48L3N0eWxlPlxyXG5cclxuPHN2ZWx0ZTpoZWFkPlxyXG5cdDx0aXRsZT57c3RhdHVzfTwvdGl0bGU+XHJcbjwvc3ZlbHRlOmhlYWQ+XHJcblxyXG48aDE+e3N0YXR1c308L2gxPlxyXG5cclxuPHA+e2Vycm9yLm1lc3NhZ2V9PC9wPlxyXG5cclxueyNpZiBkZXYgJiYgZXJyb3Iuc3RhY2t9XHJcblx0PHByZT57ZXJyb3Iuc3RhY2t9PC9wcmU+XHJcbnsvaWZ9XHJcbiIsIjwhLS0gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0ISAtLT5cbjxzY3JpcHQ+XG5cdGltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuXHRpbXBvcnQgeyBDT05URVhUX0tFWSB9IGZyb20gJy4vc2hhcmVkJztcblx0aW1wb3J0IExheW91dCBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuXHRpbXBvcnQgRXJyb3IgZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5cdGV4cG9ydCBsZXQgc3RvcmVzO1xuXHRleHBvcnQgbGV0IGVycm9yO1xuXHRleHBvcnQgbGV0IHN0YXR1cztcblx0ZXhwb3J0IGxldCBzZWdtZW50cztcblx0ZXhwb3J0IGxldCBsZXZlbDA7XG5cdGV4cG9ydCBsZXQgbGV2ZWwxID0gbnVsbDtcblx0ZXhwb3J0IGxldCBsZXZlbDIgPSBudWxsO1xuXHRleHBvcnQgbGV0IGxldmVsMyA9IG51bGw7XG5cblx0c2V0Q29udGV4dChDT05URVhUX0tFWSwgc3RvcmVzKTtcbjwvc2NyaXB0PlxuXG48TGF5b3V0IHNlZ21lbnQ9XCJ7c2VnbWVudHNbMF19XCIgey4uLmxldmVsMC5wcm9wc30+XG5cdHsjaWYgZXJyb3J9XG5cdFx0PEVycm9yIHtlcnJvcn0ge3N0YXR1c30vPlxuXHR7OmVsc2V9XG5cdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDEuY29tcG9uZW50fVwiIHNlZ21lbnQ9XCJ7c2VnbWVudHNbMV19XCIgey4uLmxldmVsMS5wcm9wc30+XG5cdFx0XHR7I2lmIGxldmVsMn1cblx0XHRcdFx0PHN2ZWx0ZTpjb21wb25lbnQgdGhpcz1cIntsZXZlbDIuY29tcG9uZW50fVwiIHNlZ21lbnQ9XCJ7c2VnbWVudHNbMl19XCIgey4uLmxldmVsMi5wcm9wc30+XG5cdFx0XHRcdFx0eyNpZiBsZXZlbDN9XG5cdFx0XHRcdFx0XHQ8c3ZlbHRlOmNvbXBvbmVudCB0aGlzPVwie2xldmVsMy5jb21wb25lbnR9XCIgey4uLmxldmVsMy5wcm9wc30vPlxuXHRcdFx0XHRcdHsvaWZ9XG5cdFx0XHRcdDwvc3ZlbHRlOmNvbXBvbmVudD5cblx0XHRcdHsvaWZ9XG5cdFx0PC9zdmVsdGU6Y29tcG9uZW50PlxuXHR7L2lmfVxuPC9MYXlvdXQ+IiwiLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0IVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBSb290IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19sYXlvdXQuc3ZlbHRlJztcbmV4cG9ydCB7IHByZWxvYWQgYXMgcm9vdF9wcmVsb2FkIH0gZnJvbSAnLi9zaGFyZWQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlJztcblxuZXhwb3J0IGNvbnN0IGlnbm9yZSA9IFsvXlxcL2Jsb2cuanNvbiQvLCAvXlxcL2Jsb2dcXC8oW15cXC9dKz8pLmpzb24kL107XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnRzID0gW1xuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjppbmRleC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2FjdGl2aXR5X2xvZy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjphY3Rpdml0eV9sb2cuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9zZXR0aW5ncy5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpzZXR0aW5ncy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2xheW91dHMvc3RhdGljX25hdmlnYXRpb24uc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6bGF5b3V0cy9zdGF0aWNfbmF2aWdhdGlvbi5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2xheW91dHMvbGlnaHRfc2lkZW5hdi5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpsYXlvdXRzL2xpZ2h0X3NpZGVuYXYuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9jaGFydHMuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Y2hhcnRzLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvdGFibGVzLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnRhYmxlcy5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL19sYXlvdXQuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6cGFnZXMvX2xheW91dC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL19sYXlvdXQuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6cGFnZXMvYXV0aGVudGljYXRpb24vX2xheW91dC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL2ZvcmdldF9wYXNzd29yZC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9hdXRoZW50aWNhdGlvbi9mb3JnZXRfcGFzc3dvcmQuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2F1dGhlbnRpY2F0aW9uL2xvZ2luLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2F1dGhlbnRpY2F0aW9uL2xvZ2luLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvX2xheW91dC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9lcnJvci9fbGF5b3V0LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvcGFnZXMvZXJyb3IvZXJyb3JfNDAxLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOnBhZ2VzL2Vycm9yL2Vycm9yXzQwMS5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL3BhZ2VzL2Vycm9yL2Vycm9yXzQwNC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpwYWdlcy9lcnJvci9lcnJvcl80MDQuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9wYWdlcy9lcnJvci9lcnJvcl81MDAuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6cGFnZXMvZXJyb3IvZXJyb3JfNTAwLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYmxvZy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpibG9nL2luZGV4LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYmxvZy9bc2x1Z10uc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6YmxvZy9bc2x1Z10uc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy91aS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjp1aS5zdmVsdGVfX1wiXG5cdH1cbl07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXMgPSAoZCA9PiBbXG5cdHtcblx0XHQvLyBpbmRleC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcLyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYWN0aXZpdHlfbG9nLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYWN0aXZpdHlfbG9nXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDEgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gc2V0dGluZ3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9zZXR0aW5nc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAyIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGxheW91dHMvc3RhdGljX25hdmlnYXRpb24uc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9sYXlvdXRzXFwvc3RhdGljX25hdmlnYXRpb25cXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDMgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gbGF5b3V0cy9saWdodF9zaWRlbmF2LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvbGF5b3V0c1xcL2xpZ2h0X3NpZGVuYXZcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gY2hhcnRzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvY2hhcnRzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDUgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gdGFibGVzLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvdGFibGVzXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDYgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vZm9yZ2V0X3Bhc3N3b3JkLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9hdXRoZW50aWNhdGlvblxcL2ZvcmdldF9wYXNzd29yZFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDggfSxcblx0XHRcdHsgaTogOSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBwYWdlcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvYXV0aGVudGljYXRpb25cXC9yZWdpc3RlclxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDggfSxcblx0XHRcdHsgaTogMTAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvYXV0aGVudGljYXRpb24vbG9naW4uc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2F1dGhlbnRpY2F0aW9uXFwvbG9naW5cXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNyB9LFxuXHRcdFx0eyBpOiA4IH0sXG5cdFx0XHR7IGk6IDExIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIHBhZ2VzL2Vycm9yL2Vycm9yXzQwMS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL3BhZ2VzXFwvZXJyb3JcXC9lcnJvcl80MDFcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNyB9LFxuXHRcdFx0eyBpOiAxMiB9LFxuXHRcdFx0eyBpOiAxMyB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBwYWdlcy9lcnJvci9lcnJvcl80MDQuc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9wYWdlc1xcL2Vycm9yXFwvZXJyb3JfNDA0XFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDcgfSxcblx0XHRcdHsgaTogMTIgfSxcblx0XHRcdHsgaTogMTQgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gcGFnZXMvZXJyb3IvZXJyb3JfNTAwLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvcGFnZXNcXC9lcnJvclxcL2Vycm9yXzUwMFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA3IH0sXG5cdFx0XHR7IGk6IDEyIH0sXG5cdFx0XHR7IGk6IDE1IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGJsb2cvaW5kZXguc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9ibG9nXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDE2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGJsb2cvW3NsdWddLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDE3LCBwYXJhbXM6IG1hdGNoID0+ICh7IHNsdWc6IGQobWF0Y2hbMV0pIH0pIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIHVpLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvdWlcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMTggfVxuXHRcdF1cblx0fVxuXSkoZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdGltcG9ydChcIkM6L2FwcC9sYW1iZGEtcHJvdG9uL25vZGVfbW9kdWxlcy9zYXBwZXIvc2FwcGVyLWRldi1jbGllbnQuanNcIikudGhlbihjbGllbnQgPT4ge1xuXHRcdGNsaWVudC5jb25uZWN0KDEwMDAwKTtcblx0fSk7XG59IiwiaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gJ3N2ZWx0ZSc7XG5pbXBvcnQgeyBDT05URVhUX0tFWSB9IGZyb20gJy4vaW50ZXJuYWwvc2hhcmVkJztcbmltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCBBcHAgZnJvbSAnLi9pbnRlcm5hbC9BcHAuc3ZlbHRlJztcbmltcG9ydCB7IGlnbm9yZSwgcm91dGVzLCByb290X3ByZWxvYWQsIGNvbXBvbmVudHMsIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQnO1xuXG5mdW5jdGlvbiBnb3RvKGhyZWYsIG9wdHMgPSB7IHJlcGxhY2VTdGF0ZTogZmFsc2UgfSkge1xuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwoaHJlZiwgZG9jdW1lbnQuYmFzZVVSSSkpO1xuXG5cdGlmICh0YXJnZXQpIHtcblx0XHRfaGlzdG9yeVtvcHRzLnJlcGxhY2VTdGF0ZSA/ICdyZXBsYWNlU3RhdGUnIDogJ3B1c2hTdGF0ZSddKHsgaWQ6IGNpZCB9LCAnJywgaHJlZik7XG5cdFx0cmV0dXJuIG5hdmlnYXRlKHRhcmdldCwgbnVsbCkudGhlbigoKSA9PiB7fSk7XG5cdH1cblxuXHRsb2NhdGlvbi5ocmVmID0gaHJlZjtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGYgPT4ge30pOyAvLyBuZXZlciByZXNvbHZlc1xufVxuXG5jb25zdCBpbml0aWFsX2RhdGEgPSB0eXBlb2YgX19TQVBQRVJfXyAhPT0gJ3VuZGVmaW5lZCcgJiYgX19TQVBQRVJfXztcblxubGV0IHJlYWR5ID0gZmFsc2U7XG5sZXQgcm9vdF9jb21wb25lbnQ7XG5sZXQgY3VycmVudF90b2tlbjtcbmxldCByb290X3ByZWxvYWRlZDtcbmxldCBjdXJyZW50X2JyYW5jaCA9IFtdO1xubGV0IGN1cnJlbnRfcXVlcnkgPSAne30nO1xuXG5jb25zdCBzdG9yZXMgPSB7XG5cdHBhZ2U6IHdyaXRhYmxlKHt9KSxcblx0cHJlbG9hZGluZzogd3JpdGFibGUobnVsbCksXG5cdHNlc3Npb246IHdyaXRhYmxlKGluaXRpYWxfZGF0YSAmJiBpbml0aWFsX2RhdGEuc2Vzc2lvbilcbn07XG5cbmxldCAkc2Vzc2lvbjtcbmxldCBzZXNzaW9uX2RpcnR5O1xuXG5zdG9yZXMuc2Vzc2lvbi5zdWJzY3JpYmUoYXN5bmMgdmFsdWUgPT4ge1xuXHQkc2Vzc2lvbiA9IHZhbHVlO1xuXG5cdGlmICghcmVhZHkpIHJldHVybjtcblx0c2Vzc2lvbl9kaXJ0eSA9IHRydWU7XG5cblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldChuZXcgVVJMKGxvY2F0aW9uLmhyZWYpKTtcblxuXHRjb25zdCB0b2tlbiA9IGN1cnJlbnRfdG9rZW4gPSB7fTtcblx0Y29uc3QgeyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9ID0gYXdhaXQgaHlkcmF0ZV90YXJnZXQodGFyZ2V0KTtcblx0aWYgKHRva2VuICE9PSBjdXJyZW50X3Rva2VuKSByZXR1cm47IC8vIGEgc2Vjb25kYXJ5IG5hdmlnYXRpb24gaGFwcGVuZWQgd2hpbGUgd2Ugd2VyZSBsb2FkaW5nXG5cblx0YXdhaXQgcmVuZGVyKHJlZGlyZWN0LCBicmFuY2gsIHByb3BzLCB0YXJnZXQucGFnZSk7XG59KTtcblxubGV0IHByZWZldGNoaW5nXG5cblxuID0gbnVsbDtcbmZ1bmN0aW9uIHNldF9wcmVmZXRjaGluZyhocmVmLCBwcm9taXNlKSB7XG5cdHByZWZldGNoaW5nID0geyBocmVmLCBwcm9taXNlIH07XG59XG5cbmxldCB0YXJnZXQ7XG5mdW5jdGlvbiBzZXRfdGFyZ2V0KGVsZW1lbnQpIHtcblx0dGFyZ2V0ID0gZWxlbWVudDtcbn1cblxubGV0IHVpZCA9IDE7XG5mdW5jdGlvbiBzZXRfdWlkKG4pIHtcblx0dWlkID0gbjtcbn1cblxubGV0IGNpZDtcbmZ1bmN0aW9uIHNldF9jaWQobikge1xuXHRjaWQgPSBuO1xufVxuXG5jb25zdCBfaGlzdG9yeSA9IHR5cGVvZiBoaXN0b3J5ICE9PSAndW5kZWZpbmVkJyA/IGhpc3RvcnkgOiB7XG5cdHB1c2hTdGF0ZTogKHN0YXRlLCB0aXRsZSwgaHJlZikgPT4ge30sXG5cdHJlcGxhY2VTdGF0ZTogKHN0YXRlLCB0aXRsZSwgaHJlZikgPT4ge30sXG5cdHNjcm9sbFJlc3RvcmF0aW9uOiAnJ1xufTtcblxuY29uc3Qgc2Nyb2xsX2hpc3RvcnkgPSB7fTtcblxuZnVuY3Rpb24gZXh0cmFjdF9xdWVyeShzZWFyY2gpIHtcblx0Y29uc3QgcXVlcnkgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXHRpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcblx0XHRzZWFyY2guc2xpY2UoMSkuc3BsaXQoJyYnKS5mb3JFYWNoKHNlYXJjaFBhcmFtID0+IHtcblx0XHRcdGxldCBbLCBrZXksIHZhbHVlID0gJyddID0gLyhbXj1dKikoPzo9KC4qKSk/Ly5leGVjKGRlY29kZVVSSUNvbXBvbmVudChzZWFyY2hQYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKSkpO1xuXHRcdFx0aWYgKHR5cGVvZiBxdWVyeVtrZXldID09PSAnc3RyaW5nJykgcXVlcnlba2V5XSA9IFtxdWVyeVtrZXldXTtcblx0XHRcdGlmICh0eXBlb2YgcXVlcnlba2V5XSA9PT0gJ29iamVjdCcpIChxdWVyeVtrZXldICkucHVzaCh2YWx1ZSk7XG5cdFx0XHRlbHNlIHF1ZXJ5W2tleV0gPSB2YWx1ZTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdF90YXJnZXQodXJsKSB7XG5cdGlmICh1cmwub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4pIHJldHVybiBudWxsO1xuXHRpZiAoIXVybC5wYXRobmFtZS5zdGFydHNXaXRoKGluaXRpYWxfZGF0YS5iYXNlVXJsKSkgcmV0dXJuIG51bGw7XG5cblx0bGV0IHBhdGggPSB1cmwucGF0aG5hbWUuc2xpY2UoaW5pdGlhbF9kYXRhLmJhc2VVcmwubGVuZ3RoKTtcblxuXHRpZiAocGF0aCA9PT0gJycpIHtcblx0XHRwYXRoID0gJy8nO1xuXHR9XG5cblx0Ly8gYXZvaWQgYWNjaWRlbnRhbCBjbGFzaGVzIGJldHdlZW4gc2VydmVyIHJvdXRlcyBhbmQgcGFnZSByb3V0ZXNcblx0aWYgKGlnbm9yZS5zb21lKHBhdHRlcm4gPT4gcGF0dGVybi50ZXN0KHBhdGgpKSkgcmV0dXJuO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcm91dGVzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Y29uc3Qgcm91dGUgPSByb3V0ZXNbaV07XG5cblx0XHRjb25zdCBtYXRjaCA9IHJvdXRlLnBhdHRlcm4uZXhlYyhwYXRoKTtcblxuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSBleHRyYWN0X3F1ZXJ5KHVybC5zZWFyY2gpO1xuXHRcdFx0Y29uc3QgcGFydCA9IHJvdXRlLnBhcnRzW3JvdXRlLnBhcnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyhtYXRjaCkgOiB7fTtcblxuXHRcdFx0Y29uc3QgcGFnZSA9IHsgaG9zdDogbG9jYXRpb24uaG9zdCwgcGF0aCwgcXVlcnksIHBhcmFtcyB9O1xuXG5cdFx0XHRyZXR1cm4geyBocmVmOiB1cmwuaHJlZiwgcm91dGUsIG1hdGNoLCBwYWdlIH07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9lcnJvcih1cmwpIHtcblx0Y29uc3QgeyBob3N0LCBwYXRobmFtZSwgc2VhcmNoIH0gPSBsb2NhdGlvbjtcblx0Y29uc3QgeyBzZXNzaW9uLCBwcmVsb2FkZWQsIHN0YXR1cywgZXJyb3IgfSA9IGluaXRpYWxfZGF0YTtcblxuXHRpZiAoIXJvb3RfcHJlbG9hZGVkKSB7XG5cdFx0cm9vdF9wcmVsb2FkZWQgPSBwcmVsb2FkZWQgJiYgcHJlbG9hZGVkWzBdO1xuXHR9XG5cblx0Y29uc3QgcHJvcHMgPSB7XG5cdFx0ZXJyb3IsXG5cdFx0c3RhdHVzLFxuXHRcdHNlc3Npb24sXG5cdFx0bGV2ZWwwOiB7XG5cdFx0XHRwcm9wczogcm9vdF9wcmVsb2FkZWRcblx0XHR9LFxuXHRcdGxldmVsMToge1xuXHRcdFx0cHJvcHM6IHtcblx0XHRcdFx0c3RhdHVzLFxuXHRcdFx0XHRlcnJvclxuXHRcdFx0fSxcblx0XHRcdGNvbXBvbmVudDogRXJyb3JDb21wb25lbnRcblx0XHR9LFxuXHRcdHNlZ21lbnRzOiBwcmVsb2FkZWRcblxuXHR9O1xuXHRjb25zdCBxdWVyeSA9IGV4dHJhY3RfcXVlcnkoc2VhcmNoKTtcblx0cmVuZGVyKG51bGwsIFtdLCBwcm9wcywgeyBob3N0LCBwYXRoOiBwYXRobmFtZSwgcXVlcnksIHBhcmFtczoge30gfSk7XG59XG5cbmZ1bmN0aW9uIHNjcm9sbF9zdGF0ZSgpIHtcblx0cmV0dXJuIHtcblx0XHR4OiBwYWdlWE9mZnNldCxcblx0XHR5OiBwYWdlWU9mZnNldFxuXHR9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBuYXZpZ2F0ZSh0YXJnZXQsIGlkLCBub3Njcm9sbCwgaGFzaCkge1xuXHRpZiAoaWQpIHtcblx0XHQvLyBwb3BzdGF0ZSBvciBpbml0aWFsIG5hdmlnYXRpb25cblx0XHRjaWQgPSBpZDtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBjdXJyZW50X3Njcm9sbCA9IHNjcm9sbF9zdGF0ZSgpO1xuXG5cdFx0Ly8gY2xpY2tlZCBvbiBhIGxpbmsuIHByZXNlcnZlIHNjcm9sbCBzdGF0ZVxuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBjdXJyZW50X3Njcm9sbDtcblxuXHRcdGlkID0gY2lkID0gKyt1aWQ7XG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IG5vc2Nyb2xsID8gY3VycmVudF9zY3JvbGwgOiB7IHg6IDAsIHk6IDAgfTtcblx0fVxuXG5cdGNpZCA9IGlkO1xuXG5cdGlmIChyb290X2NvbXBvbmVudCkgc3RvcmVzLnByZWxvYWRpbmcuc2V0KHRydWUpO1xuXG5cdGNvbnN0IGxvYWRlZCA9IHByZWZldGNoaW5nICYmIHByZWZldGNoaW5nLmhyZWYgPT09IHRhcmdldC5ocmVmID9cblx0XHRwcmVmZXRjaGluZy5wcm9taXNlIDpcblx0XHRoeWRyYXRlX3RhcmdldCh0YXJnZXQpO1xuXG5cdHByZWZldGNoaW5nID0gbnVsbDtcblxuXHRjb25zdCB0b2tlbiA9IGN1cnJlbnRfdG9rZW4gPSB7fTtcblx0Y29uc3QgeyByZWRpcmVjdCwgcHJvcHMsIGJyYW5jaCB9ID0gYXdhaXQgbG9hZGVkO1xuXHRpZiAodG9rZW4gIT09IGN1cnJlbnRfdG9rZW4pIHJldHVybjsgLy8gYSBzZWNvbmRhcnkgbmF2aWdhdGlvbiBoYXBwZW5lZCB3aGlsZSB3ZSB3ZXJlIGxvYWRpbmdcblxuXHRhd2FpdCByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHRhcmdldC5wYWdlKTtcblx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXG5cdGlmICghbm9zY3JvbGwpIHtcblx0XHRsZXQgc2Nyb2xsID0gc2Nyb2xsX2hpc3RvcnlbaWRdO1xuXG5cdFx0aWYgKGhhc2gpIHtcblx0XHRcdC8vIHNjcm9sbCBpcyBhbiBlbGVtZW50IGlkIChmcm9tIGEgaGFzaCksIHdlIG5lZWQgdG8gY29tcHV0ZSB5LlxuXHRcdFx0Y29uc3QgZGVlcF9saW5rZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoLnNsaWNlKDEpKTtcblxuXHRcdFx0aWYgKGRlZXBfbGlua2VkKSB7XG5cdFx0XHRcdHNjcm9sbCA9IHtcblx0XHRcdFx0XHR4OiAwLFxuXHRcdFx0XHRcdHk6IGRlZXBfbGlua2VkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBzY3JvbGw7XG5cdFx0aWYgKHNjcm9sbCkgc2Nyb2xsVG8oc2Nyb2xsLngsIHNjcm9sbC55KTtcblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiByZW5kZXIocmVkaXJlY3QsIGJyYW5jaCwgcHJvcHMsIHBhZ2UpIHtcblx0aWYgKHJlZGlyZWN0KSByZXR1cm4gZ290byhyZWRpcmVjdC5sb2NhdGlvbiwgeyByZXBsYWNlU3RhdGU6IHRydWUgfSk7XG5cblx0c3RvcmVzLnBhZ2Uuc2V0KHBhZ2UpO1xuXHRzdG9yZXMucHJlbG9hZGluZy5zZXQoZmFsc2UpO1xuXG5cdGlmIChyb290X2NvbXBvbmVudCkge1xuXHRcdHJvb3RfY29tcG9uZW50LiRzZXQocHJvcHMpO1xuXHR9IGVsc2Uge1xuXHRcdHByb3BzLnN0b3JlcyA9IHtcblx0XHRcdHBhZ2U6IHsgc3Vic2NyaWJlOiBzdG9yZXMucGFnZS5zdWJzY3JpYmUgfSxcblx0XHRcdHByZWxvYWRpbmc6IHsgc3Vic2NyaWJlOiBzdG9yZXMucHJlbG9hZGluZy5zdWJzY3JpYmUgfSxcblx0XHRcdHNlc3Npb246IHN0b3Jlcy5zZXNzaW9uXG5cdFx0fTtcblx0XHRwcm9wcy5sZXZlbDAgPSB7XG5cdFx0XHRwcm9wczogYXdhaXQgcm9vdF9wcmVsb2FkZWRcblx0XHR9O1xuXG5cdFx0Ly8gZmlyc3QgbG9hZCDigJQgcmVtb3ZlIFNTUidkIDxoZWFkPiBjb250ZW50c1xuXHRcdGNvbnN0IHN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLXN0YXJ0Jyk7XG5cdFx0Y29uc3QgZW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLWVuZCcpO1xuXG5cdFx0aWYgKHN0YXJ0ICYmIGVuZCkge1xuXHRcdFx0d2hpbGUgKHN0YXJ0Lm5leHRTaWJsaW5nICE9PSBlbmQpIGRldGFjaChzdGFydC5uZXh0U2libGluZyk7XG5cdFx0XHRkZXRhY2goc3RhcnQpO1xuXHRcdFx0ZGV0YWNoKGVuZCk7XG5cdFx0fVxuXG5cdFx0cm9vdF9jb21wb25lbnQgPSBuZXcgQXBwKHtcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3BzLFxuXHRcdFx0aHlkcmF0ZTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cblx0Y3VycmVudF9icmFuY2ggPSBicmFuY2g7XG5cdGN1cnJlbnRfcXVlcnkgPSBKU09OLnN0cmluZ2lmeShwYWdlLnF1ZXJ5KTtcblx0cmVhZHkgPSB0cnVlO1xuXHRzZXNzaW9uX2RpcnR5ID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHBhcnRfY2hhbmdlZChpLCBzZWdtZW50LCBtYXRjaCwgc3RyaW5naWZpZWRfcXVlcnkpIHtcblx0Ly8gVE9ETyBvbmx5IGNoZWNrIHF1ZXJ5IHN0cmluZyBjaGFuZ2VzIGZvciBwcmVsb2FkIGZ1bmN0aW9uc1xuXHQvLyB0aGF0IGRvIGluIGZhY3QgZGVwZW5kIG9uIGl0ICh1c2luZyBzdGF0aWMgYW5hbHlzaXMgb3Jcblx0Ly8gcnVudGltZSBpbnN0cnVtZW50YXRpb24pXG5cdGlmIChzdHJpbmdpZmllZF9xdWVyeSAhPT0gY3VycmVudF9xdWVyeSkgcmV0dXJuIHRydWU7XG5cblx0Y29uc3QgcHJldmlvdXMgPSBjdXJyZW50X2JyYW5jaFtpXTtcblxuXHRpZiAoIXByZXZpb3VzKSByZXR1cm4gZmFsc2U7XG5cdGlmIChzZWdtZW50ICE9PSBwcmV2aW91cy5zZWdtZW50KSByZXR1cm4gdHJ1ZTtcblx0aWYgKHByZXZpb3VzLm1hdGNoKSB7XG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzLm1hdGNoLnNsaWNlKDEsIGkgKyAyKSkgIT09IEpTT04uc3RyaW5naWZ5KG1hdGNoLnNsaWNlKDEsIGkgKyAyKSkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBoeWRyYXRlX3RhcmdldCh0YXJnZXQpXG5cblxuXG4ge1xuXHRjb25zdCB7IHJvdXRlLCBwYWdlIH0gPSB0YXJnZXQ7XG5cdGNvbnN0IHNlZ21lbnRzID0gcGFnZS5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdGxldCByZWRpcmVjdCA9IG51bGw7XG5cblx0Y29uc3QgcHJvcHMgPSB7IGVycm9yOiBudWxsLCBzdGF0dXM6IDIwMCwgc2VnbWVudHM6IFtzZWdtZW50c1swXV0gfTtcblxuXHRjb25zdCBwcmVsb2FkX2NvbnRleHQgPSB7XG5cdFx0ZmV0Y2g6ICh1cmwsIG9wdHMpID0+IGZldGNoKHVybCwgb3B0cyksXG5cdFx0cmVkaXJlY3Q6IChzdGF0dXNDb2RlLCBsb2NhdGlvbikgPT4ge1xuXHRcdFx0aWYgKHJlZGlyZWN0ICYmIChyZWRpcmVjdC5zdGF0dXNDb2RlICE9PSBzdGF0dXNDb2RlIHx8IHJlZGlyZWN0LmxvY2F0aW9uICE9PSBsb2NhdGlvbikpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb25mbGljdGluZyByZWRpcmVjdHNgKTtcblx0XHRcdH1cblx0XHRcdHJlZGlyZWN0ID0geyBzdGF0dXNDb2RlLCBsb2NhdGlvbiB9O1xuXHRcdH0sXG5cdFx0ZXJyb3I6IChzdGF0dXMsIGVycm9yKSA9PiB7XG5cdFx0XHRwcm9wcy5lcnJvciA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBuZXcgRXJyb3IoZXJyb3IpIDogZXJyb3I7XG5cdFx0XHRwcm9wcy5zdGF0dXMgPSBzdGF0dXM7XG5cdFx0fVxuXHR9O1xuXG5cdGlmICghcm9vdF9wcmVsb2FkZWQpIHtcblx0XHRyb290X3ByZWxvYWRlZCA9IGluaXRpYWxfZGF0YS5wcmVsb2FkZWRbMF0gfHwgcm9vdF9wcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdHBhcmFtczoge31cblx0XHR9LCAkc2Vzc2lvbik7XG5cdH1cblxuXHRsZXQgYnJhbmNoO1xuXHRsZXQgbCA9IDE7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBzdHJpbmdpZmllZF9xdWVyeSA9IEpTT04uc3RyaW5naWZ5KHBhZ2UucXVlcnkpO1xuXHRcdGNvbnN0IG1hdGNoID0gcm91dGUucGF0dGVybi5leGVjKHBhZ2UucGF0aCk7XG5cblx0XHRsZXQgc2VnbWVudF9kaXJ0eSA9IGZhbHNlO1xuXG5cdFx0YnJhbmNoID0gYXdhaXQgUHJvbWlzZS5hbGwocm91dGUucGFydHMubWFwKGFzeW5jIChwYXJ0LCBpKSA9PiB7XG5cdFx0XHRjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV07XG5cblx0XHRcdGlmIChwYXJ0X2NoYW5nZWQoaSwgc2VnbWVudCwgbWF0Y2gsIHN0cmluZ2lmaWVkX3F1ZXJ5KSkgc2VnbWVudF9kaXJ0eSA9IHRydWU7XG5cblx0XHRcdHByb3BzLnNlZ21lbnRzW2xdID0gc2VnbWVudHNbaSArIDFdOyAvLyBUT0RPIG1ha2UgdGhpcyBsZXNzIGNvbmZ1c2luZ1xuXHRcdFx0aWYgKCFwYXJ0KSByZXR1cm4geyBzZWdtZW50IH07XG5cblx0XHRcdGNvbnN0IGogPSBsKys7XG5cblx0XHRcdGlmICghc2Vzc2lvbl9kaXJ0eSAmJiAhc2VnbWVudF9kaXJ0eSAmJiBjdXJyZW50X2JyYW5jaFtpXSAmJiBjdXJyZW50X2JyYW5jaFtpXS5wYXJ0ID09PSBwYXJ0LmkpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfYnJhbmNoW2ldO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWdtZW50X2RpcnR5ID0gZmFsc2U7XG5cblx0XHRcdGNvbnN0IHsgZGVmYXVsdDogY29tcG9uZW50LCBwcmVsb2FkIH0gPSBhd2FpdCBsb2FkX2NvbXBvbmVudChjb21wb25lbnRzW3BhcnQuaV0pO1xuXG5cdFx0XHRsZXQgcHJlbG9hZGVkO1xuXHRcdFx0aWYgKHJlYWR5IHx8ICFpbml0aWFsX2RhdGEucHJlbG9hZGVkW2kgKyAxXSkge1xuXHRcdFx0XHRwcmVsb2FkZWQgPSBwcmVsb2FkXG5cdFx0XHRcdFx0PyBhd2FpdCBwcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRcdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRcdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRcdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdFx0XHRcdHBhcmFtczogcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyh0YXJnZXQubWF0Y2gpIDoge31cblx0XHRcdFx0XHR9LCAkc2Vzc2lvbilcblx0XHRcdFx0XHQ6IHt9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJlbG9hZGVkID0gaW5pdGlhbF9kYXRhLnByZWxvYWRlZFtpICsgMV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAocHJvcHNbYGxldmVsJHtqfWBdID0geyBjb21wb25lbnQsIHByb3BzOiBwcmVsb2FkZWQsIHNlZ21lbnQsIG1hdGNoLCBwYXJ0OiBwYXJ0LmkgfSk7XG5cdFx0fSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHByb3BzLmVycm9yID0gZXJyb3I7XG5cdFx0cHJvcHMuc3RhdHVzID0gNTAwO1xuXHRcdGJyYW5jaCA9IFtdO1xuXHR9XG5cblx0cmV0dXJuIHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfTtcbn1cblxuZnVuY3Rpb24gbG9hZF9jc3MoY2h1bmspIHtcblx0Y29uc3QgaHJlZiA9IGBjbGllbnQvJHtjaHVua31gO1xuXHRpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGlua1tocmVmPVwiJHtocmVmfVwiXWApKSByZXR1cm47XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWwsIHJlamVjdCkgPT4ge1xuXHRcdGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cdFx0bGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cdFx0bGluay5ocmVmID0gaHJlZjtcblxuXHRcdGxpbmsub25sb2FkID0gKCkgPT4gZnVsZmlsKCk7XG5cdFx0bGluay5vbmVycm9yID0gcmVqZWN0O1xuXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRfY29tcG9uZW50KGNvbXBvbmVudClcblxuXG4ge1xuXHQvLyBUT0RPIHRoaXMgaXMgdGVtcG9yYXJ5IOKAlCBvbmNlIHBsYWNlaG9sZGVycyBhcmVcblx0Ly8gYWx3YXlzIHJld3JpdHRlbiwgc2NyYXRjaCB0aGUgdGVybmFyeVxuXHRjb25zdCBwcm9taXNlcyA9ICh0eXBlb2YgY29tcG9uZW50LmNzcyA9PT0gJ3N0cmluZycgPyBbXSA6IGNvbXBvbmVudC5jc3MubWFwKGxvYWRfY3NzKSk7XG5cdHByb21pc2VzLnVuc2hpZnQoY29tcG9uZW50LmpzKCkpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4odmFsdWVzID0+IHZhbHVlc1swXSk7XG59XG5cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG5cdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2goaHJlZikge1xuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwoaHJlZiwgZG9jdW1lbnQuYmFzZVVSSSkpO1xuXG5cdGlmICh0YXJnZXQpIHtcblx0XHRpZiAoIXByZWZldGNoaW5nIHx8IGhyZWYgIT09IHByZWZldGNoaW5nLmhyZWYpIHtcblx0XHRcdHNldF9wcmVmZXRjaGluZyhocmVmLCBoeWRyYXRlX3RhcmdldCh0YXJnZXQpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJlZmV0Y2hpbmcucHJvbWlzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydChvcHRzXG5cbikge1xuXHRpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBfaGlzdG9yeSkge1xuXHRcdF9oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxuXHRzZXRfdGFyZ2V0KG9wdHMudGFyZ2V0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZV9jbGljayk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlX3BvcHN0YXRlKTtcblxuXHQvLyBwcmVmZXRjaFxuXHRhZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdHJpZ2dlcl9wcmVmZXRjaCk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZV9tb3VzZW1vdmUpO1xuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRjb25zdCB7IGhhc2gsIGhyZWYgfSA9IGxvY2F0aW9uO1xuXG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IHVpZCB9LCAnJywgaHJlZik7XG5cblx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG5cdFx0aWYgKGluaXRpYWxfZGF0YS5lcnJvcikgcmV0dXJuIGhhbmRsZV9lcnJvcigpO1xuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRcdGlmICh0YXJnZXQpIHJldHVybiBuYXZpZ2F0ZSh0YXJnZXQsIHVpZCwgdHJ1ZSwgaGFzaCk7XG5cdH0pO1xufVxuXG5sZXQgbW91c2Vtb3ZlX3RpbWVvdXQ7XG5cbmZ1bmN0aW9uIGhhbmRsZV9tb3VzZW1vdmUoZXZlbnQpIHtcblx0Y2xlYXJUaW1lb3V0KG1vdXNlbW92ZV90aW1lb3V0KTtcblx0bW91c2Vtb3ZlX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHR0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KTtcblx0fSwgMjApO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KSB7XG5cdGNvbnN0IGEgPSBmaW5kX2FuY2hvcihldmVudC50YXJnZXQpO1xuXHRpZiAoIWEgfHwgYS5yZWwgIT09ICdwcmVmZXRjaCcpIHJldHVybjtcblxuXHRwcmVmZXRjaChhLmhyZWYpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfY2xpY2soZXZlbnQpIHtcblx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzXG5cdC8vIE1JVCBsaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzI2xpY2Vuc2Vcblx0aWYgKHdoaWNoKGV2ZW50KSAhPT0gMSkgcmV0dXJuO1xuXHRpZiAoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XG5cdGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblx0Y29uc3QgYSA9IGZpbmRfYW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdGlmICghYSkgcmV0dXJuO1xuXG5cdGlmICghYS5ocmVmKSByZXR1cm47XG5cblx0Ly8gY2hlY2sgaWYgbGluayBpcyBpbnNpZGUgYW4gc3ZnXG5cdC8vIGluIHRoaXMgY2FzZSwgYm90aCBocmVmIGFuZCB0YXJnZXQgYXJlIGFsd2F5cyBpbnNpZGUgYW4gb2JqZWN0XG5cdGNvbnN0IHN2ZyA9IHR5cGVvZiBhLmhyZWYgPT09ICdvYmplY3QnICYmIGEuaHJlZi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU1ZHQW5pbWF0ZWRTdHJpbmcnO1xuXHRjb25zdCBocmVmID0gU3RyaW5nKHN2ZyA/IChhKS5ocmVmLmJhc2VWYWwgOiBhLmhyZWYpO1xuXG5cdGlmIChocmVmID09PSBsb2NhdGlvbi5ocmVmKSB7XG5cdFx0aWYgKCFsb2NhdGlvbi5oYXNoKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIElnbm9yZSBpZiB0YWcgaGFzXG5cdC8vIDEuICdkb3dubG9hZCcgYXR0cmlidXRlXG5cdC8vIDIuIHJlbD0nZXh0ZXJuYWwnIGF0dHJpYnV0ZVxuXHRpZiAoYS5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgYS5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cblx0Ly8gSWdub3JlIGlmIDxhPiBoYXMgYSB0YXJnZXRcblx0aWYgKHN2ZyA/IChhKS50YXJnZXQuYmFzZVZhbCA6IGEudGFyZ2V0KSByZXR1cm47XG5cblx0Y29uc3QgdXJsID0gbmV3IFVSTChocmVmKTtcblxuXHQvLyBEb24ndCBoYW5kbGUgaGFzaCBjaGFuZ2VzXG5cdGlmICh1cmwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIHVybC5zZWFyY2ggPT09IGxvY2F0aW9uLnNlYXJjaCkgcmV0dXJuO1xuXG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0aWYgKHRhcmdldCkge1xuXHRcdGNvbnN0IG5vc2Nyb2xsID0gYS5oYXNBdHRyaWJ1dGUoJ3NhcHBlci1ub3Njcm9sbCcpO1xuXHRcdG5hdmlnYXRlKHRhcmdldCwgbnVsbCwgbm9zY3JvbGwsIHVybC5oYXNoKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdF9oaXN0b3J5LnB1c2hTdGF0ZSh7IGlkOiBjaWQgfSwgJycsIHVybC5ocmVmKTtcblx0fVxufVxuXG5mdW5jdGlvbiB3aGljaChldmVudCkge1xuXHRyZXR1cm4gZXZlbnQud2hpY2ggPT09IG51bGwgPyBldmVudC5idXR0b24gOiBldmVudC53aGljaDtcbn1cblxuZnVuY3Rpb24gZmluZF9hbmNob3Iobm9kZSkge1xuXHR3aGlsZSAobm9kZSAmJiBub2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdBJykgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTsgLy8gU1ZHIDxhPiBlbGVtZW50cyBoYXZlIGEgbG93ZXJjYXNlIG5hbWVcblx0cmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wb3BzdGF0ZShldmVudCkge1xuXHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gc2Nyb2xsX3N0YXRlKCk7XG5cblx0aWYgKGV2ZW50LnN0YXRlKSB7XG5cdFx0Y29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0bmF2aWdhdGUodGFyZ2V0LCBldmVudC5zdGF0ZS5pZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBoYXNoY2hhbmdlXG5cdFx0c2V0X3VpZCh1aWQgKyAxKTtcblx0XHRzZXRfY2lkKHVpZCk7XG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IGNpZCB9LCAnJywgbG9jYXRpb24uaHJlZik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2hSb3V0ZXMocGF0aG5hbWVzKSB7XG5cdHJldHVybiByb3V0ZXNcblx0XHQuZmlsdGVyKHBhdGhuYW1lc1xuXHRcdFx0PyByb3V0ZSA9PiBwYXRobmFtZXMuc29tZShwYXRobmFtZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QocGF0aG5hbWUpKVxuXHRcdFx0OiAoKSA9PiB0cnVlXG5cdFx0KVxuXHRcdC5yZWR1Y2UoKHByb21pc2UsIHJvdXRlKSA9PiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHJvdXRlLnBhcnRzLm1hcChwYXJ0ID0+IHBhcnQgJiYgbG9hZF9jb21wb25lbnQoY29tcG9uZW50c1twYXJ0LmldKSkpO1xuXHRcdH0pLCBQcm9taXNlLnJlc29sdmUoKSk7XG59XG5cbmNvbnN0IHN0b3JlcyQxID0gKCkgPT4gZ2V0Q29udGV4dChDT05URVhUX0tFWSk7XG5cbmV4cG9ydCB7IGdvdG8sIHByZWZldGNoLCBwcmVmZXRjaFJvdXRlcywgc3RhcnQsIHN0b3JlcyQxIGFzIHN0b3JlcyB9O1xuIiwiaW1wb3J0ICogYXMgc2FwcGVyIGZyb20gJ0BzYXBwZXIvYXBwJztcclxuXHJcbnNhcHBlci5zdGFydCh7XHJcblx0dGFyZ2V0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2FwcGVyJylcclxufSk7Il0sIm5hbWVzIjpbIkVycm9yQ29tcG9uZW50IiwiZGV0YWNoIiwicm9vdF9wcmVsb2FkIiwi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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQ0ZXLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFEcEIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWZqQyxZQUFZO0NBQ25CLEtBQUssQ0FBQyxjQUFjOzs7O09BSlgsS0FBSztPQUNMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDSlgsR0FBUTsrQkFNUixHQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0VBUEksR0FBUzs7Ozs7Ozs7Ozs7O29EQUFvQixHQUFXOzs7b0JBQ3JELEdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBTVIsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEdBUEksR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BZHJCLFFBQVEsR0FBRyxxQkFBcUI7T0FFM0IsSUFBSSxHQUFHLEVBQUU7T0FDVCxJQUFJLEdBQUcsb0JBQW9CO09BQzNCLFFBQVEsR0FBRyxLQUFLO09BQ2hCLFNBQVMsR0FBRyxLQUFLO2NBRXhCLFNBQVMsR0FBRyxFQUFFOztPQUVaLFdBQVc7RUFDZixRQUFRLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQ21FQyxHQUFPLFFBQUssU0FBUyxtQkFBSSxHQUFVLFFBQUssbUJBQW1CO01BQUcsUUFBUTtNQUFHLEVBQUU7Ozs7Ozs7Ozs7O3VCQVEzRSxHQUFPLFFBQUssU0FBUyxtQkFBSSxHQUFVLFFBQUssZUFBZTtNQUFHLFFBQVE7TUFBRyxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFSdkUsR0FBTyxRQUFLLFNBQVMsbUJBQUksR0FBVSxRQUFLLG1CQUFtQjtLQUFHLFFBQVE7S0FBRyxFQUFFOzs7OztvRkFRM0UsR0FBTyxRQUFLLFNBQVMsbUJBQUksR0FBVSxRQUFLLGVBQWU7S0FBRyxRQUFRO0tBQUcsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
