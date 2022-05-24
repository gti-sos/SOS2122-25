
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
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
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        set_current_component(saved_component);
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
            const d = (program.b - t);
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
            if (running_program || pending_program) {
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

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1$1, Object: Object_1, console: console_1$a } = globals;

    // (251:0) {:else}
    function create_else_block$8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

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
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
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
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$e(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

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
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
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
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
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
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
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
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$e, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
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
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get routes() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\sveltestrap\src\Alert.svelte generated by Svelte v3.47.0 */
    const file$t = "node_modules\\sveltestrap\\src\\Alert.svelte";
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});

    // (26:0) {#if isOpen}
    function create_if_block$d(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current_block_type_index;
    	let if_block2;
    	let div_transition;
    	let current;
    	let if_block0 = (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) && create_if_block_3(ctx);
    	let if_block1 = /*showClose*/ ctx[5] && create_if_block_2$3(ctx);
    	const if_block_creators = [create_if_block_1$5, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*$$restProps*/ ctx[9], { class: /*classes*/ ctx[7] }, { role: "alert" }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			set_attributes(div, div_data);
    			add_location(div, file$t, 26, 2, 808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*heading*/ ctx[3] || /*$$slots*/ ctx[10].heading) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*heading, $$slots*/ 1032) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*showClose*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
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
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				{ role: "alert" }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, /*transition*/ ctx[4], false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(26:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if heading || $$slots.heading}
    function create_if_block_3(ctx) {
    	let h4;
    	let t;
    	let current;
    	const heading_slot_template = /*#slots*/ ctx[18].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[17], get_heading_slot_context);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(/*heading*/ ctx[3]);
    			if (heading_slot) heading_slot.c();
    			attr_dev(h4, "class", "alert-heading");
    			add_location(h4, file$t, 33, 6, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);

    			if (heading_slot) {
    				heading_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*heading*/ 8) set_data_dev(t, /*heading*/ ctx[3]);

    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						heading_slot,
    						heading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(heading_slot_template, /*$$scope*/ ctx[17], dirty, get_heading_slot_changes),
    						get_heading_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (heading_slot) heading_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(33:4) {#if heading || $$slots.heading}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if showClose}
    function create_if_block_2$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			add_location(button, file$t, 38, 6, 1077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*handleToggle*/ ctx[8])) /*handleToggle*/ ctx[8].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeClassNames*/ 64) {
    				attr_dev(button, "class", /*closeClassNames*/ ctx[6]);
    			}

    			if (dirty & /*closeAriaLabel*/ 4) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(38:4) {#if showClose}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {:else}
    function create_else_block$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if children}
    function create_if_block_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(46:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let showClose;
    	let handleToggle;
    	let classes;
    	let closeClassNames;

    	const omit_props_names = [
    		"class","children","color","closeClassName","closeAriaLabel","dismissible","heading","isOpen","toggle","fade","transition"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, ['heading','default']);
    	const $$slots = compute_slots(slots);
    	let { class: className = '' } = $$props;
    	let { children = undefined } = $$props;
    	let { color = 'success' } = $$props;
    	let { closeClassName = '' } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { dismissible = false } = $$props;
    	let { heading = undefined } = $$props;
    	let { isOpen = true } = $$props;
    	let { toggle = undefined } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { transition = { duration: fade$1 ? 400 : 0 } } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$new_props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$new_props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$new_props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$new_props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$new_props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$new_props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fadeTransition: fade,
    		classnames,
    		className,
    		children,
    		color,
    		closeClassName,
    		closeAriaLabel,
    		dismissible,
    		heading,
    		isOpen,
    		toggle,
    		fade: fade$1,
    		transition,
    		closeClassNames,
    		showClose,
    		classes,
    		handleToggle
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(11, className = $$new_props.className);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('color' in $$props) $$invalidate(12, color = $$new_props.color);
    		if ('closeClassName' in $$props) $$invalidate(13, closeClassName = $$new_props.closeClassName);
    		if ('closeAriaLabel' in $$props) $$invalidate(2, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('dismissible' in $$props) $$invalidate(14, dismissible = $$new_props.dismissible);
    		if ('heading' in $$props) $$invalidate(3, heading = $$new_props.heading);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('toggle' in $$props) $$invalidate(15, toggle = $$new_props.toggle);
    		if ('fade' in $$props) $$invalidate(16, fade$1 = $$new_props.fade);
    		if ('transition' in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ('closeClassNames' in $$props) $$invalidate(6, closeClassNames = $$new_props.closeClassNames);
    		if ('showClose' in $$props) $$invalidate(5, showClose = $$new_props.showClose);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('handleToggle' in $$props) $$invalidate(8, handleToggle = $$new_props.handleToggle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dismissible, toggle*/ 49152) {
    			$$invalidate(5, showClose = dismissible || toggle);
    		}

    		if ($$self.$$.dirty & /*toggle*/ 32768) {
    			$$invalidate(8, handleToggle = toggle || (() => $$invalidate(0, isOpen = false)));
    		}

    		if ($$self.$$.dirty & /*className, color, showClose*/ 6176) {
    			$$invalidate(7, classes = classnames(className, 'alert', `alert-${color}`, { 'alert-dismissible': showClose }));
    		}

    		if ($$self.$$.dirty & /*closeClassName*/ 8192) {
    			$$invalidate(6, closeClassNames = classnames('btn-close', closeClassName));
    		}
    	};

    	return [
    		isOpen,
    		children,
    		closeAriaLabel,
    		heading,
    		transition,
    		showClose,
    		closeClassNames,
    		classes,
    		handleToggle,
    		$$restProps,
    		$$slots,
    		className,
    		color,
    		closeClassName,
    		dismissible,
    		toggle,
    		fade$1,
    		$$scope,
    		slots
    	];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			class: 11,
    			children: 1,
    			color: 12,
    			closeClassName: 13,
    			closeAriaLabel: 2,
    			dismissible: 14,
    			heading: 3,
    			isOpen: 0,
    			toggle: 15,
    			fade: 16,
    			transition: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeClassName() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeClassName(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Alert>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Alert>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.47.0 */
    const file$s = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (54:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$s, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$c(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$4, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$s, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
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
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
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
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
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

    // (66:6) {#if children}
    function create_if_block_2$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1$4(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block_1];
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$s.name
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

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
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

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getBoundingClientRect(element, includeScale) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      var rect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (isHTMLElement(element) && includeScale) {
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
        // Fallback to 1 in case both values are `0`

        if (offsetWidth > 0) {
          scaleX = round(rect.width) / offsetWidth || 1;
        }

        if (offsetHeight > 0) {
          scaleY = round(rect.height) / offsetHeight || 1;
        }
      }

      return {
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        top: rect.top / scaleY,
        right: rect.right / scaleX,
        bottom: rect.bottom / scaleY,
        left: rect.left / scaleX,
        x: rect.left / scaleX,
        y: rect.top / scaleY
      };
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var isIE = navigator.userAgent.indexOf('Trident') !== -1;

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    function getViewportRect(element) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
      // can be obscured underneath it.
      // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
      // if it isn't open, so if this isn't available, the popper will be detected
      // to overflow the bottom of the screen too early.

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent

        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element) {
      var rect = getBoundingClientRect(element);
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });

            for (var index = 0; index < state.orderedModifiers.length; index++) {

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var passive = {
      passive: true
    };

    function effect$2(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect$2,
      data: {}
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$1,
      requires: ['computeStyles']
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    // Code derived from https://github.com/bryanmylee/svelte-popperjs/blob/master/src/index.ts
    function createPopperActions(initOptions) {
      let contentNode;
      let options = initOptions;
      let popperInstance = null;
      let referenceNode;

      const initPopper = () => {
        if (referenceNode && contentNode) {
          popperInstance = createPopper(referenceNode, contentNode, options);
        }
      };

      const deinitPopper = () => {
        if (popperInstance) {
          popperInstance.destroy();
          popperInstance = null;
        }
      };

      const referenceAction = (node) => {
        referenceNode = node;
        initPopper();
        return {
          destroy() {
            deinitPopper();
          }
        };
      };

      const contentAction = (node, contentOptions) => {
        contentNode = node;
        options = Object.assign(Object.assign({}, initOptions), contentOptions);
        initPopper();

        return {
          update(newContentOptions) {
            options = Object.assign(
              Object.assign({}, initOptions),
              newContentOptions
            );
            if (popperInstance && options) {
              popperInstance.setOptions(options);
            }
          },
          destroy() {
            deinitPopper();
          }
        };
      };

      return [referenceAction, contentAction, () => popperInstance];
    }

    const createContext = () => writable({});

    /* node_modules\sveltestrap\src\Dropdown.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1 } = globals;
    const file$r = "node_modules\\sveltestrap\\src\\Dropdown.svelte";

    // (123:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let div_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 123, 2, 3209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
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
    			/*div_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(123:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (119:0) {#if nav}
    function create_if_block$b(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	let li_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$r, 119, 2, 3118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			/*li_binding*/ ctx[19](li);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
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
    			/*li_binding*/ ctx[19](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(119:0) {#if nav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$5];
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
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let subItemIsActive;
    	let classes;
    	let handleToggle;

    	const omit_props_names = [
    		"class","active","direction","dropup","group","inNavbar","isOpen","nav","setActiveFromChild","size","toggle"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	const noop = () => undefined;
    	let context = createContext();
    	setContext('dropdownContext', context);
    	const navbarContext = getContext('navbar');
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { direction = 'down' } = $$props;
    	let { dropup = false } = $$props;
    	let { group = false } = $$props;
    	let { inNavbar = navbarContext ? navbarContext.inNavbar : false } = $$props;
    	let { isOpen = false } = $$props;
    	let { nav = false } = $$props;
    	let { setActiveFromChild = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	const [popperRef, popperContent] = createPopperActions();
    	const validDirections = ['up', 'down', 'left', 'right', 'start', 'end'];

    	if (validDirections.indexOf(direction) === -1) {
    		throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
    	}

    	let component;
    	let dropdownDirection;

    	function handleDocumentClick(e) {
    		if (e && (e.which === 3 || e.type === 'keyup' && e.which !== 9)) return;

    		if (component.contains(e.target) && component !== e.target && (e.type !== 'keyup' || e.which === 9)) {
    			return;
    		}

    		handleToggle(e);
    	}

    	onDestroy(() => {
    		if (typeof document !== 'undefined') {
    			['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    		}
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			component = $$value;
    			$$invalidate(1, component);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('direction' in $$new_props) $$invalidate(7, direction = $$new_props.direction);
    		if ('dropup' in $$new_props) $$invalidate(8, dropup = $$new_props.dropup);
    		if ('group' in $$new_props) $$invalidate(9, group = $$new_props.group);
    		if ('inNavbar' in $$new_props) $$invalidate(10, inNavbar = $$new_props.inNavbar);
    		if ('isOpen' in $$new_props) $$invalidate(4, isOpen = $$new_props.isOpen);
    		if ('nav' in $$new_props) $$invalidate(0, nav = $$new_props.nav);
    		if ('setActiveFromChild' in $$new_props) $$invalidate(11, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ('size' in $$new_props) $$invalidate(12, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(13, toggle = $$new_props.toggle);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onDestroy,
    		createPopperActions,
    		classnames,
    		createContext,
    		noop,
    		context,
    		navbarContext,
    		className,
    		active,
    		direction,
    		dropup,
    		group,
    		inNavbar,
    		isOpen,
    		nav,
    		setActiveFromChild,
    		size,
    		toggle,
    		popperRef,
    		popperContent,
    		validDirections,
    		component,
    		dropdownDirection,
    		handleDocumentClick,
    		handleToggle,
    		subItemIsActive,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('context' in $$props) $$invalidate(22, context = $$new_props.context);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
    		if ('direction' in $$props) $$invalidate(7, direction = $$new_props.direction);
    		if ('dropup' in $$props) $$invalidate(8, dropup = $$new_props.dropup);
    		if ('group' in $$props) $$invalidate(9, group = $$new_props.group);
    		if ('inNavbar' in $$props) $$invalidate(10, inNavbar = $$new_props.inNavbar);
    		if ('isOpen' in $$props) $$invalidate(4, isOpen = $$new_props.isOpen);
    		if ('nav' in $$props) $$invalidate(0, nav = $$new_props.nav);
    		if ('setActiveFromChild' in $$props) $$invalidate(11, setActiveFromChild = $$new_props.setActiveFromChild);
    		if ('size' in $$props) $$invalidate(12, size = $$new_props.size);
    		if ('toggle' in $$props) $$invalidate(13, toggle = $$new_props.toggle);
    		if ('component' in $$props) $$invalidate(1, component = $$new_props.component);
    		if ('dropdownDirection' in $$props) $$invalidate(14, dropdownDirection = $$new_props.dropdownDirection);
    		if ('handleToggle' in $$props) $$invalidate(15, handleToggle = $$new_props.handleToggle);
    		if ('subItemIsActive' in $$props) $$invalidate(16, subItemIsActive = $$new_props.subItemIsActive);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*setActiveFromChild, component*/ 2050) {
    			$$invalidate(16, subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === 'function' && component.querySelector('.active')));
    		}

    		if ($$self.$$.dirty & /*direction*/ 128) {
    			{
    				if (direction === 'left') $$invalidate(14, dropdownDirection = 'start'); else if (direction === 'right') $$invalidate(14, dropdownDirection = 'end'); else $$invalidate(14, dropdownDirection = direction);
    			}
    		}

    		if ($$self.$$.dirty & /*toggle, isOpen*/ 8208) {
    			$$invalidate(15, handleToggle = toggle || (() => $$invalidate(4, isOpen = !isOpen)));
    		}

    		if ($$self.$$.dirty & /*className, direction, dropdownDirection, nav, active, setActiveFromChild, subItemIsActive, group, size, isOpen*/ 88817) {
    			$$invalidate(2, classes = classnames(className, direction !== 'down' && `drop${dropdownDirection}`, nav && active ? 'active' : false, setActiveFromChild && subItemIsActive ? 'active' : false, {
    				'btn-group': group,
    				[`btn-group-${size}`]: !!size,
    				dropdown: !group,
    				show: isOpen,
    				'nav-item': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*isOpen*/ 16) {
    			{
    				if (typeof document !== 'undefined') {
    					if (isOpen) {
    						['click', 'touchstart', 'keyup'].forEach(event => document.addEventListener(event, handleDocumentClick, true));
    					} else {
    						['click', 'touchstart', 'keyup'].forEach(event => document.removeEventListener(event, handleDocumentClick, true));
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*handleToggle, isOpen, direction, dropup, nav, inNavbar*/ 34193) {
    			{
    				context.update(() => {
    					return {
    						toggle: handleToggle,
    						isOpen,
    						direction: direction === 'down' && dropup ? 'up' : direction,
    						inNavbar: nav || inNavbar,
    						popperRef: nav ? noop : popperRef,
    						popperContent: nav ? noop : popperContent
    					};
    				});
    			}
    		}
    	};

    	return [
    		nav,
    		component,
    		classes,
    		$$restProps,
    		isOpen,
    		className,
    		active,
    		direction,
    		dropup,
    		group,
    		inNavbar,
    		setActiveFromChild,
    		size,
    		toggle,
    		dropdownDirection,
    		handleToggle,
    		subItemIsActive,
    		$$scope,
    		slots,
    		li_binding,
    		div_binding
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			class: 5,
    			active: 6,
    			direction: 7,
    			dropup: 8,
    			group: 9,
    			inNavbar: 10,
    			isOpen: 4,
    			nav: 0,
    			setActiveFromChild: 11,
    			size: 12,
    			toggle: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropup() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropup(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error_1("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inNavbar() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inNavbar(value) {
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

    	get setActiveFromChild() {
    		throw new Error_1("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setActiveFromChild(value) {
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
    }

    /* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.47.0 */
    const file$q = "node_modules\\sveltestrap\\src\\Container.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 23, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","sm","md","lg","xl","xxl","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('sm' in $$new_props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$new_props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		fluid,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('sm' in $$props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, sm, md, lg, xl, xxl, fluid*/ 508) {
    			$$invalidate(0, classes = classnames(className, {
    				'container-sm': sm,
    				'container-md': md,
    				'container-lg': lg,
    				'container-xl': xl,
    				'container-xxl': xxl,
    				'container-fluid': fluid,
    				container: !sm && !md && !lg && !xl && !xxl && !fluid
    			}));
    		}
    	};

    	return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			class: 2,
    			sm: 3,
    			md: 4,
    			lg: 5,
    			xl: 6,
    			xxl: 7,
    			fluid: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\DropdownItem.svelte generated by Svelte v3.47.0 */
    const file$p = "node_modules\\sveltestrap\\src\\DropdownItem.svelte";

    // (49:0) {:else}
    function create_else_block$4(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let button_levels = [{ type: "button" }, /*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$p, 49, 2, 1086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[15], false, false, false),
    					listen_dev(button, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
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
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(49:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:15) 
    function create_if_block_2$1(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[6],
    		{ click: "" },
    		{ href: /*href*/ ctx[2] },
    		{ class: /*classes*/ ctx[3] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$p, 45, 2, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleItemClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				{ click: "" },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
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
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(45:15) ",
    		ctx
    	});

    	return block;
    }

    // (41:18) 
    function create_if_block_1$3(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let div_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 41, 2, 864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(div, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
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
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:18) ",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if header}
    function create_if_block$a(ctx) {
    	let h6;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let h6_levels = [/*$$restProps*/ ctx[6], { class: /*classes*/ ctx[3] }];
    	let h6_data = {};

    	for (let i = 0; i < h6_levels.length; i += 1) {
    		h6_data = assign(h6_data, h6_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			set_attributes(h6, h6_data);
    			add_location(h6, file$p, 37, 2, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(h6, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(h6, "click", /*handleItemClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h6, h6_data = get_spread_update(h6_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
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
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(37:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_if_block_1$3, create_if_block_2$1, create_else_block$4];
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","disabled","divider","header","toggle","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownItem', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(16, $context = value));
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	let { divider = false } = $$props;
    	let { header = false } = $$props;
    	let { toggle = true } = $$props;
    	let { href = '' } = $$props;

    	function handleItemClick(e) {
    		if (disabled || header || divider) {
    			e.preventDefault();
    			return;
    		}

    		if (toggle) {
    			$context.toggle(e);
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(7, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(8, active = $$new_props.active);
    		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('divider' in $$new_props) $$invalidate(0, divider = $$new_props.divider);
    		if ('header' in $$new_props) $$invalidate(1, header = $$new_props.header);
    		if ('toggle' in $$new_props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		active,
    		disabled,
    		divider,
    		header,
    		toggle,
    		href,
    		handleItemClick,
    		classes,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(7, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(8, active = $$new_props.active);
    		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ('divider' in $$props) $$invalidate(0, divider = $$new_props.divider);
    		if ('header' in $$props) $$invalidate(1, header = $$new_props.header);
    		if ('toggle' in $$props) $$invalidate(10, toggle = $$new_props.toggle);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, divider, header, active*/ 899) {
    			$$invalidate(3, classes = classnames(className, {
    				disabled,
    				'dropdown-item': !divider && !header,
    				active,
    				'dropdown-header': header,
    				'dropdown-divider': divider
    			}));
    		}
    	};

    	return [
    		divider,
    		header,
    		href,
    		classes,
    		context,
    		handleItemClick,
    		$$restProps,
    		className,
    		active,
    		disabled,
    		toggle,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DropdownItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
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
    			id: create_fragment$p.name
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

    /* node_modules\sveltestrap\src\DropdownMenu.svelte generated by Svelte v3.47.0 */
    const file$o = "node_modules\\sveltestrap\\src\\DropdownMenu.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let div_data_bs_popper_value;
    	let $context_popperContent_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[4],
    		{ class: /*classes*/ ctx[1] },
    		{
    			"data-bs-popper": div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 41, 0, 933);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer($context_popperContent_action = /*$context*/ ctx[0].popperContent(div, /*popperOptions*/ ctx[2]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*$context*/ 1 && div_data_bs_popper_value !== (div_data_bs_popper_value = /*$context*/ ctx[0].inNavbar ? 'static' : undefined)) && {
    					"data-bs-popper": div_data_bs_popper_value
    				}
    			]));

    			if ($context_popperContent_action && is_function($context_popperContent_action.update) && dirty & /*popperOptions*/ 4) $context_popperContent_action.update.call(null, /*popperOptions*/ ctx[2]);
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
    			mounted = false;
    			dispose();
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

    function instance$o($$self, $$props, $$invalidate) {
    	let popperOptions;
    	let classes;
    	const omit_props_names = ["class","dark","end","right"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownMenu', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(0, $context = value));
    	let { class: className = '' } = $$props;
    	let { dark = false } = $$props;
    	let { end = false } = $$props;
    	let { right = false } = $$props;

    	const popperPlacement = (direction, end) => {
    		let prefix = direction;
    		if (direction === 'up') prefix = 'top'; else if (direction === 'down') prefix = 'bottom';
    		let suffix = end ? 'end' : 'start';
    		return `${prefix}-${suffix}`;
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('dark' in $$new_props) $$invalidate(6, dark = $$new_props.dark);
    		if ('end' in $$new_props) $$invalidate(7, end = $$new_props.end);
    		if ('right' in $$new_props) $$invalidate(8, right = $$new_props.right);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		dark,
    		end,
    		right,
    		popperPlacement,
    		classes,
    		popperOptions,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('dark' in $$props) $$invalidate(6, dark = $$new_props.dark);
    		if ('end' in $$props) $$invalidate(7, end = $$new_props.end);
    		if ('right' in $$props) $$invalidate(8, right = $$new_props.right);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('popperOptions' in $$props) $$invalidate(2, popperOptions = $$new_props.popperOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$context, end, right*/ 385) {
    			$$invalidate(2, popperOptions = {
    				modifiers: [
    					{ name: 'flip' },
    					{
    						name: 'offset',
    						options: { offset: [0, 2] }
    					}
    				],
    				placement: popperPlacement($context.direction, end || right)
    			});
    		}

    		if ($$self.$$.dirty & /*className, dark, end, right, $context*/ 481) {
    			$$invalidate(1, classes = classnames(className, 'dropdown-menu', {
    				'dropdown-menu-dark': dark,
    				'dropdown-menu-end': end || right,
    				show: $context.isOpen
    			}));
    		}
    	};

    	return [
    		$context,
    		classes,
    		popperOptions,
    		context,
    		$$restProps,
    		className,
    		dark,
    		end,
    		right,
    		$$scope,
    		slots
    	];
    }

    class DropdownMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { class: 5, dark: 6, end: 7, right: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownMenu",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<DropdownMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<DropdownMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\DropdownToggle.svelte generated by Svelte v3.47.0 */
    const file$n = "node_modules\\sveltestrap\\src\\DropdownToggle.svelte";

    // (94:0) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let button_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_3(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ type: "button" },
    		{
    			"aria-expanded": button_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*btnClasses*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$n, 94, 2, 1948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[28](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(button)),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[24], false, false, false),
    					listen_dev(button, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ type: "button" },
    				(!current || dirty & /*$context*/ 64 && button_aria_expanded_value !== (button_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": button_aria_expanded_value
    				},
    				(!current || dirty & /*btnClasses*/ 32) && { class: /*btnClasses*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[28](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(94:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (80:25) 
    function create_if_block_2(ctx) {
    	let span;
    	let span_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_2(ctx);

    	let span_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": span_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(span, span_data);
    			add_location(span, file$n, 80, 2, 1673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			/*span_binding*/ ctx[27](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(span)),
    					listen_dev(span, "click", /*click_handler_2*/ ctx[23], false, false, false),
    					listen_dev(span, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && span_aria_expanded_value !== (span_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && {
    					"aria-expanded": span_aria_expanded_value
    				},
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*span_binding*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(80:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (66:24) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let div_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1(ctx);

    	let div_levels = [
    		/*$$restProps*/ ctx[9],
    		{
    			"aria-expanded": div_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(div, div_data);
    			add_location(div, file$n, 66, 2, 1382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[26](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(div)),
    					listen_dev(div, "click", /*click_handler_1*/ ctx[22], false, false, false),
    					listen_dev(div, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*$context*/ 64 && div_aria_expanded_value !== (div_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": div_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(66:24) ",
    		ctx
    	});

    	return block_1;
    }

    // (51:0) {#if nav}
    function create_if_block$9(ctx) {
    	let a;
    	let a_aria_expanded_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ href: "#nav" },
    		{
    			"aria-expanded": a_aria_expanded_value = /*$context*/ ctx[6].isOpen
    		},
    		{ class: /*classes*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			add_location(a, file$n, 51, 2, 1080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[25](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*$context*/ ctx[6].popperRef(a)),
    					listen_dev(a, "click", /*click_handler*/ ctx[21], false, false, false),
    					listen_dev(a, "click", /*toggleButton*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*ariaLabel*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				{ href: "#nav" },
    				(!current || dirty & /*$context*/ 64 && a_aria_expanded_value !== (a_aria_expanded_value = /*$context*/ ctx[6].isOpen)) && { "aria-expanded": a_aria_expanded_value },
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(51:0) {#if nav}",
    		ctx
    	});

    	return block_1;
    }

    // (105:10)        
    function fallback_block_3(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$n, 105, 6, 2165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(105:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (90:10)        
    function fallback_block_2(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$n, 90, 6, 1867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(90:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (76:10)        
    function fallback_block_1(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$n, 76, 6, 1575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(76:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (62:10)        
    function fallback_block(ctx) {
    	let span;
    	let t;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			t = text(/*ariaLabel*/ ctx[1]);
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file$n, 62, 6, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaLabel*/ 2) set_data_dev(t, /*ariaLabel*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(62:10)        ",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$n(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_if_block_1$2, create_if_block_2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nav*/ ctx[2]) return 0;
    		if (/*tag*/ ctx[3] === 'div') return 1;
    		if (/*tag*/ ctx[3] === 'span') return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	let btnClasses;

    	const omit_props_names = [
    		"class","ariaLabel","active","block","caret","color","disabled","inner","nav","outline","size","split","tag"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DropdownToggle', slots, ['default']);
    	const context = getContext('dropdownContext');
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));
    	let { class: className = '' } = $$props;
    	let { ariaLabel = 'Toggle Dropdown' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { caret = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { inner = undefined } = $$props;
    	let { nav = false } = $$props;
    	let { outline = false } = $$props;
    	let { size = '' } = $$props;
    	let { split = false } = $$props;
    	let { tag = null } = $$props;

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

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('caret' in $$new_props) $$invalidate(13, caret = $$new_props.caret);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(15, disabled = $$new_props.disabled);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('nav' in $$new_props) $$invalidate(2, nav = $$new_props.nav);
    		if ('outline' in $$new_props) $$invalidate(16, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(17, size = $$new_props.size);
    		if ('split' in $$new_props) $$invalidate(18, split = $$new_props.split);
    		if ('tag' in $$new_props) $$invalidate(3, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		classnames,
    		context,
    		className,
    		ariaLabel,
    		active,
    		block,
    		caret,
    		color,
    		disabled,
    		inner,
    		nav,
    		outline,
    		size,
    		split,
    		tag,
    		toggleButton,
    		classes,
    		btnClasses,
    		$context
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('ariaLabel' in $$props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('caret' in $$props) $$invalidate(13, caret = $$new_props.caret);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(15, disabled = $$new_props.disabled);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('nav' in $$props) $$invalidate(2, nav = $$new_props.nav);
    		if ('outline' in $$props) $$invalidate(16, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(17, size = $$new_props.size);
    		if ('split' in $$props) $$invalidate(18, split = $$new_props.split);
    		if ('tag' in $$props) $$invalidate(3, tag = $$new_props.tag);
    		if ('classes' in $$props) $$invalidate(4, classes = $$new_props.classes);
    		if ('btnClasses' in $$props) $$invalidate(5, btnClasses = $$new_props.btnClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, caret, split, nav*/ 271364) {
    			$$invalidate(4, classes = classnames(className, {
    				'dropdown-toggle': caret || split,
    				'dropdown-toggle-split': split,
    				'nav-link': nav
    			}));
    		}

    		if ($$self.$$.dirty & /*classes, outline, color, size, block, active*/ 219152) {
    			$$invalidate(5, btnClasses = classnames(classes, 'btn', `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, { active }));
    		}
    	};

    	return [
    		inner,
    		ariaLabel,
    		nav,
    		tag,
    		classes,
    		btnClasses,
    		$context,
    		context,
    		toggleButton,
    		$$restProps,
    		className,
    		active,
    		block,
    		caret,
    		color,
    		disabled,
    		outline,
    		size,
    		split,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		a_binding,
    		div_binding,
    		span_binding,
    		button_binding
    	];
    }

    class DropdownToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			class: 10,
    			ariaLabel: 1,
    			active: 11,
    			block: 12,
    			caret: 13,
    			color: 14,
    			disabled: 15,
    			inner: 0,
    			nav: 2,
    			outline: 16,
    			size: 17,
    			split: 18,
    			tag: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DropdownToggle",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
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

    	get inner() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nav() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nav(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get split() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set split(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<DropdownToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<DropdownToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.47.0 */
    const file$m = "node_modules\\sveltestrap\\src\\Nav.svelte";

    function create_fragment$m(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$m, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === 'xs') {
    		return 'flex-column';
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = '' } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('tabs' in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('tabs' in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$props) $$invalidate(10, card = $$new_props.card);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? 'navbar-nav' : 'nav', horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				'nav-tabs': tabs,
    				'card-header-tabs': card && tabs,
    				'nav-pills': pills,
    				'card-header-pills': card && pills,
    				'nav-justified': justified,
    				'nav-fill': fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
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
    			id: create_fragment$m.name
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

    /* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.47.0 */
    const file$l = "node_modules\\sveltestrap\\src\\Navbar.svelte";

    // (44:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(44:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if container}
    function create_if_block$8(ctx) {
    	let container_1;
    	let current;

    	container_1 = new Container({
    			props: {
    				fluid: /*container*/ ctx[0] === 'fluid',
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_1_changes = {};
    			if (dirty & /*container*/ 1) container_1_changes.fluid = /*container*/ ctx[0] === 'fluid';

    			if (dirty & /*$$scope*/ 2048) {
    				container_1_changes.$$scope = { dirty, ctx };
    			}

    			container_1.$set(container_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(40:2) {#if container}",
    		ctx
    	});

    	return block;
    }

    // (41:4) <Container fluid={container === 'fluid'}>
    function create_default_slot$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
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
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(41:4) <Container fluid={container === 'fluid'}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let nav;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*container*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let nav_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if_block.c();
    			set_attributes(nav, nav_data);
    			add_location(nav, file$l, 38, 0, 889);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if_blocks[current_block_type_index].m(nav, null);
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
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
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
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
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

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === 'xs') {
    		return 'navbar-expand';
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","container","color","dark","expand","fixed","light","sticky"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, ['default']);
    	setContext('navbar', { inNavbar: true });
    	let { class: className = '' } = $$props;
    	let { container = 'fluid' } = $$props;
    	let { color = '' } = $$props;
    	let { dark = false } = $$props;
    	let { expand = '' } = $$props;
    	let { fixed = '' } = $$props;
    	let { light = false } = $$props;
    	let { sticky = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('container' in $$new_props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('dark' in $$new_props) $$invalidate(5, dark = $$new_props.dark);
    		if ('expand' in $$new_props) $$invalidate(6, expand = $$new_props.expand);
    		if ('fixed' in $$new_props) $$invalidate(7, fixed = $$new_props.fixed);
    		if ('light' in $$new_props) $$invalidate(8, light = $$new_props.light);
    		if ('sticky' in $$new_props) $$invalidate(9, sticky = $$new_props.sticky);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Container,
    		setContext,
    		className,
    		container,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		getExpandClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('container' in $$props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('dark' in $$props) $$invalidate(5, dark = $$new_props.dark);
    		if ('expand' in $$props) $$invalidate(6, expand = $$new_props.expand);
    		if ('fixed' in $$props) $$invalidate(7, fixed = $$new_props.fixed);
    		if ('light' in $$props) $$invalidate(8, light = $$new_props.light);
    		if ('sticky' in $$props) $$invalidate(9, sticky = $$new_props.sticky);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, expand, light, dark, color, fixed, sticky*/ 1016) {
    			$$invalidate(1, classes = classnames(className, 'navbar', getExpandClass(expand), {
    				'navbar-light': light,
    				'navbar-dark': dark,
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		container,
    		classes,
    		$$restProps,
    		className,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		slots,
    		$$scope
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			class: 3,
    			container: 0,
    			color: 4,
    			dark: 5,
    			expand: 6,
    			fixed: 7,
    			light: 8,
    			sticky: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sticky() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavItem.svelte generated by Svelte v3.47.0 */
    const file$k = "node_modules\\sveltestrap\\src\\NavItem.svelte";

    function create_fragment$k(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$k, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
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
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavItem', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(3, active = $$new_props.active);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, 'nav-item', active ? 'active' : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavLink.svelte generated by Svelte v3.47.0 */
    const file$j = "node_modules\\sveltestrap\\src\\NavLink.svelte";

    function create_fragment$j(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$j, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
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
    			mounted = false;
    			run_all(dispose);
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
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavLink', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = '#' } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === '#') {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, 'nav-link', { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavbarBrand.svelte generated by Svelte v3.47.0 */
    const file$i = "node_modules\\sveltestrap\\src\\NavbarBrand.svelte";

    function create_fragment$i(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ href: /*href*/ ctx[0] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$i, 10, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] }
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
    			mounted = false;
    			dispose();
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

    function instance$i($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavbarBrand', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { href = '/' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, href, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, 'navbar-brand'));
    		}
    	};

    	return [href, classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$i.name
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

    /* node_modules\sveltestrap\src\Colgroup.svelte generated by Svelte v3.47.0 */
    const file$h = "node_modules\\sveltestrap\\src\\Colgroup.svelte";

    function create_fragment$h(ctx) {
    	let colgroup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			colgroup = element("colgroup");
    			if (default_slot) default_slot.c();
    			add_location(colgroup, file$h, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, colgroup, anchor);

    			if (default_slot) {
    				default_slot.m(colgroup, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
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
    			if (detaching) detach_dev(colgroup);
    			if (default_slot) default_slot.d(detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colgroup', slots, ['default']);
    	setContext('colgroup', true);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colgroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$scope, slots];
    }

    class Colgroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colgroup",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ResponsiveContainer.svelte generated by Svelte v3.47.0 */
    const file$g = "node_modules\\sveltestrap\\src\\ResponsiveContainer.svelte";

    // (15:0) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if responsive}
    function create_if_block$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			add_location(div, file$g, 13, 2, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*responsiveClassName*/ 2) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(13:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    				} else {
    					if_block.p(ctx, dirty);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let responsiveClassName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResponsiveContainer', slots, ['default']);
    	let className = '';
    	let { responsive = false } = $$props;
    	const writable_props = ['responsive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ResponsiveContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		responsive,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('responsiveClassName' in $$props) $$invalidate(1, responsiveClassName = $$props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(1, responsiveClassName = classnames(className, {
    				'table-responsive': responsive === true,
    				[`table-responsive-${responsive}`]: typeof responsive === 'string'
    			}));
    		}
    	};

    	return [responsive, responsiveClassName, $$scope, slots];
    }

    class ResponsiveContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { responsive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResponsiveContainer",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get responsive() {
    		throw new Error("<ResponsiveContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<ResponsiveContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\TableFooter.svelte generated by Svelte v3.47.0 */
    const file$f = "node_modules\\sveltestrap\\src\\TableFooter.svelte";

    function create_fragment$f(ctx) {
    	let tfoot;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tfoot_levels = [/*$$restProps*/ ctx[0]];
    	let tfoot_data = {};

    	for (let i = 0; i < tfoot_levels.length; i += 1) {
    		tfoot_data = assign(tfoot_data, tfoot_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tfoot = element("tfoot");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$f, 7, 2, 117);
    			set_attributes(tfoot, tfoot_data);
    			add_location(tfoot, file$f, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tfoot, anchor);
    			append_dev(tfoot, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tfoot, tfoot_data = get_spread_update(tfoot_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
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
    			if (detaching) detach_dev(tfoot);
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
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableFooter', slots, ['default']);
    	setContext('footer', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFooter",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\TableHeader.svelte generated by Svelte v3.47.0 */
    const file$e = "node_modules\\sveltestrap\\src\\TableHeader.svelte";

    function create_fragment$e(ctx) {
    	let thead;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$e, 7, 2, 117);
    			set_attributes(thead, thead_data);
    			add_location(thead, file$e, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
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
    			if (detaching) detach_dev(thead);
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
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	setContext('header', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.47.0 */
    const file$d = "node_modules\\sveltestrap\\src\\Table.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context_1 = ctx => ({ row: /*row*/ ctx[13] });
    const get_default_slot_changes = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context = ctx => ({ row: /*row*/ ctx[13] });

    // (50:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if rows}
    function create_if_block$6(ctx) {
    	let colgroup;
    	let t0;
    	let tableheader;
    	let t1;
    	let tbody;
    	let t2;
    	let tablefooter;
    	let current;

    	colgroup = new Colgroup({
    			props: {
    				$$slots: { default: [create_default_slot_3$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader = new TableHeader({
    			props: {
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*rows*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	tablefooter = new TableFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(colgroup.$$.fragment);
    			t0 = space();
    			create_component(tableheader.$$.fragment);
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(tablefooter.$$.fragment);
    			add_location(tbody, file$d, 39, 6, 1057);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tableheader, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(tablefooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colgroup_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				colgroup_changes.$$scope = { dirty, ctx };
    			}

    			colgroup.$set(colgroup_changes);
    			const tableheader_changes = {};

    			if (dirty & /*$$scope, rows*/ 4098) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);

    			if (dirty & /*$$scope, rows*/ 4098) {
    				each_value = /*rows*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const tablefooter_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				tablefooter_changes.$$scope = { dirty, ctx };
    			}

    			tablefooter.$set(tablefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colgroup.$$.fragment, local);
    			transition_in(tableheader.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(tablefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colgroup.$$.fragment, local);
    			transition_out(tableheader.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(tablefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tableheader, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tablefooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(33:4) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Colgroup>
    function create_default_slot_3$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
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
    		id: create_default_slot_3$a.name,
    		type: "slot",
    		source: "(34:6) <Colgroup>",
    		ctx
    	});

    	return block;
    }

    // (37:6) <TableHeader>
    function create_default_slot_2$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
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
    		id: create_default_slot_2$a.name,
    		type: "slot",
    		source: "(37:6) <TableHeader>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each rows as row}
    function create_each_block$3(ctx) {
    	let tr;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			t = space();
    			add_location(tr, file$d, 41, 10, 1103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
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
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(41:8) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <TableFooter>
    function create_default_slot_1$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
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
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(47:6) <TableFooter>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <ResponsiveContainer {responsive}>
    function create_default_slot$b(ctx) {
    	let table;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*rows*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if_block.c();
    			set_attributes(table, table_data);
    			add_location(table, file$d, 31, 2, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if_blocks[current_block_type_index].m(table, null);
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
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(table, null);
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
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
    			if (detaching) detach_dev(table);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(31:0) <ResponsiveContainer {responsive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let responsivecontainer;
    	let current;

    	responsivecontainer = new ResponsiveContainer({
    			props: {
    				responsive: /*responsive*/ ctx[0],
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const responsivecontainer_changes = {};
    			if (dirty & /*responsive*/ 1) responsivecontainer_changes.responsive = /*responsive*/ ctx[0];

    			if (dirty & /*$$scope, $$restProps, classes, rows*/ 4110) {
    				responsivecontainer_changes.$$scope = { dirty, ctx };
    			}

    			responsivecontainer.$set(responsivecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivecontainer, detaching);
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
    	let classes;

    	const omit_props_names = [
    		"class","size","bordered","borderless","striped","dark","hover","responsive","rows"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { size = '' } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	let { rows = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$new_props) $$invalidate(1, rows = $$new_props.rows);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Colgroup,
    		ResponsiveContainer,
    		TableFooter,
    		TableHeader,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		rows,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$props) $$invalidate(1, rows = $$new_props.rows);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(2, classes = classnames(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false));
    		}
    	};

    	return [
    		responsive,
    		rows,
    		classes,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		slots,
    		$$scope
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0,
    			rows: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.47.0 */

    const file$c = "src\\front\\Home.svelte";

    // (8:4) <NavbarBrand style=color:black; href="#/info">
    function create_default_slot_1$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar Aplicación");
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
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(8:4) <NavbarBrand style=color:black; href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (7:3) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot$a(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				style: "color:black;",
    				href: "#/info",
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({ props: { navbar: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbarbrand.$$.fragment);
    			t = space();
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
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
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(7:3) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let body;
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(navbar.$$.fragment);
    			add_location(body, file$c, 5, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(navbar, body, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    			if (detaching) detach_dev(body);
    			destroy_component(navbar);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		Button
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\front\Info.svelte generated by Svelte v3.47.0 */

    const file$b = "src\\front\\Info.svelte";

    // (8:2) <NavbarBrand href="#/info">
    function create_default_slot_21$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_21$8.name,
    		type: "slot",
    		source: "(8:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:4) <DropdownToggle nav caret>
    function create_default_slot_20$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_20$8.name,
    		type: "slot",
    		source: "(11:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (13:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_19$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_19$8.name,
    		type: "slot",
    		source: "(13:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_18$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_18$8.name,
    		type: "slot",
    		source: "(15:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:6) <DropdownItem href="./api/v1/expo">
    function create_default_slot_17$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expo-Stats");
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
    		id: create_default_slot_17$8.name,
    		type: "slot",
    		source: "(17:6) <DropdownItem href=\\\"./api/v1/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:4) <DropdownMenu end>
    function create_default_slot_16$8(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_19$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_18$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo",
    				$$slots: { default: [create_default_slot_17$8] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$8.name,
    		type: "slot",
    		source: "(12:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (10:3) <Dropdown >
    function create_default_slot_15$8(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_20$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_16$8] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_default_slot_15$8.name,
    		type: "slot",
    		source: "(10:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (22:4) <DropdownToggle nav caret>
    function create_default_slot_14$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_14$8.name,
    		type: "slot",
    		source: "(22:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (24:6) <DropdownItem href="./#/economies">
    function create_default_slot_13$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_13$8.name,
    		type: "slot",
    		source: "(24:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_12$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT-END");
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
    		id: create_default_slot_12$8.name,
    		type: "slot",
    		source: "(26:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:6) <DropdownItem href="#/expo">
    function create_default_slot_11$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expo FRONT-END");
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
    		id: create_default_slot_11$8.name,
    		type: "slot",
    		source: "(28:6) <DropdownItem href=\\\"#/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:4) <DropdownMenu end>
    function create_default_slot_10$8(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_13$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_12$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/expo",
    				$$slots: { default: [create_default_slot_11$8] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$8.name,
    		type: "slot",
    		source: "(23:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (21:12) <Dropdown>
    function create_default_slot_9$8(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_14$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_10$8] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_default_slot_9$8.name,
    		type: "slot",
    		source: "(21:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (33:3) <DropdownToggle nav caret>
    function create_default_slot_8$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_8$8.name,
    		type: "slot",
    		source: "(33:3) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (35:5) <DropdownItem href="./#/economies-graph">
    function create_default_slot_7$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_7$8.name,
    		type: "slot",
    		source: "(35:5) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:5) <DropdownItem href="./#/graphesco">
    function create_default_slot_6$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_6$8.name,
    		type: "slot",
    		source: "(37:5) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:5) <DropdownItem href="#/graphexpo">
    function create_default_slot_5$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expo-Stats");
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
    		id: create_default_slot_5$8.name,
    		type: "slot",
    		source: "(39:5) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:13) <DropdownItem href="./#/graph">
    function create_default_slot_4$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_4$9.name,
    		type: "slot",
    		source: "(41:13) <DropdownItem href=\\\"./#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:3) <DropdownMenu end>
    function create_default_slot_3$9(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let t5;
    	let dropdownitem6;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_7$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_6$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_5$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem5 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem6 = new DropdownItem({
    			props: {
    				href: "./#/graph",
    				$$slots: { default: [create_default_slot_4$9] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    			t5 = space();
    			create_component(dropdownitem6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(dropdownitem6, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    			const dropdownitem6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdownitem6_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem6.$set(dropdownitem6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			transition_in(dropdownitem6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
    			transition_out(dropdownitem6.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(dropdownitem6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$9.name,
    		type: "slot",
    		source: "(34:3) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (32:4) <Dropdown >
    function create_default_slot_2$9(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_8$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_3$9] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(32:4) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (9:2) <Nav navbar>
    function create_default_slot_1$9(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_15$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_9$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(9:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (7:4) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot$9(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_21$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_1$9] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(7:4) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let body;
    	let navbar;
    	let t0;
    	let main;
    	let h1;
    	let t2;
    	let h30;
    	let t4;
    	let p0;
    	let t5;
    	let a0;
    	let t7;
    	let a1;
    	let t9;
    	let t10;
    	let p1;
    	let t11;
    	let a2;
    	let t13;
    	let a3;
    	let t15;
    	let t16;
    	let p2;
    	let t17;
    	let a4;
    	let t19;
    	let t20;
    	let br0;
    	let t21;
    	let h31;
    	let t23;
    	let br1;
    	let br2;
    	let t24;
    	let h32;
    	let a5;
    	let t27;
    	let br3;
    	let br4;
    	let t28;
    	let h33;
    	let a6;
    	let t31;
    	let br5;
    	let br6;
    	let t32;
    	let h34;
    	let t34;
    	let p3;
    	let t35;
    	let a7;
    	let t37;
    	let a8;
    	let t39;
    	let t40;
    	let p4;
    	let t41;
    	let a9;
    	let t43;
    	let a10;
    	let t45;
    	let t46;
    	let p5;
    	let t47;
    	let a11;
    	let t49;
    	let a12;
    	let t51;
    	let t52;
    	let br7;
    	let t53;
    	let h35;
    	let t55;
    	let p6;
    	let t56;
    	let a13;
    	let t58;
    	let a14;
    	let t60;
    	let t61;
    	let p7;
    	let t62;
    	let a15;
    	let t64;
    	let a16;
    	let t66;
    	let t67;
    	let p8;
    	let t68;
    	let a17;
    	let t70;
    	let a18;
    	let t72;
    	let t73;
    	let br8;
    	let t74;
    	let h36;
    	let t76;
    	let p9;
    	let t77;
    	let a19;
    	let t79;
    	let a20;
    	let t81;
    	let t82;
    	let p10;
    	let t83;
    	let a21;
    	let t85;
    	let a22;
    	let t87;
    	let t88;
    	let p11;
    	let t89;
    	let a23;
    	let t91;
    	let a24;
    	let t93;
    	let t94;
    	let br9;
    	let t95;
    	let h37;
    	let t97;
    	let p12;
    	let t98;
    	let a25;
    	let t100;
    	let a26;
    	let t102;
    	let t103;
    	let p13;
    	let t104;
    	let a27;
    	let t106;
    	let a28;
    	let t108;
    	let t109;
    	let p14;
    	let t110;
    	let a29;
    	let t112;
    	let a30;
    	let t114;
    	let t115;
    	let p15;
    	let t116;
    	let a31;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "SOS2122-25";
    			t2 = space();
    			h30 = element("h3");
    			h30.textContent = "Team";
    			t4 = space();
    			p0 = element("p");
    			t5 = text("- ");
    			a0 = element("a");
    			a0.textContent = "Damian Gonzalez Carrasco";
    			t7 = text("(fuente de datos: ");
    			a1 = element("a");
    			a1.textContent = "economies";
    			t9 = text(")");
    			t10 = space();
    			p1 = element("p");
    			t11 = text("- ");
    			a2 = element("a");
    			a2.textContent = "Angel Simon Mesa";
    			t13 = text(" (fuente de datos: ");
    			a3 = element("a");
    			a3.textContent = "esco-stats";
    			t15 = text(")");
    			t16 = space();
    			p2 = element("p");
    			t17 = text("- ");
    			a4 = element("a");
    			a4.textContent = "Adrián Pérez Gómez";
    			t19 = text("(fuente de datos: exports-stats)");
    			t20 = space();
    			br0 = element("br");
    			t21 = space();
    			h31 = element("h3");
    			h31.textContent = "Project description:";
    			t23 = text(" Nuestras fuentes de información esta orientadas a analizar la relación que existe entre las exportaciones. \r\n    ");
    			br1 = element("br");
    			br2 = element("br");
    			t24 = space();
    			h32 = element("h3");
    			h32.textContent = "Repository:";
    			a5 = element("a");
    			a5.textContent = "gti-sos/SOS2122-25";
    			t27 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t28 = space();
    			h33 = element("h3");
    			h33.textContent = "URL:";
    			a6 = element("a");
    			a6.textContent = "http://SOS2122-25.herokuapp.com";
    			t31 = space();
    			br5 = element("br");
    			br6 = element("br");
    			t32 = space();
    			h34 = element("h3");
    			h34.textContent = "Documentos POSTMAN:";
    			t34 = space();
    			p3 = element("p");
    			t35 = text("- ");
    			a7 = element("a");
    			a7.textContent = "https://SOS2122-25.herokuapp.com/api/v2/economies/docs ";
    			t37 = text("(developed by ");
    			a8 = element("a");
    			a8.textContent = "Damian Gonzalez Carrasco";
    			t39 = text(")");
    			t40 = space();
    			p4 = element("p");
    			t41 = text("- ");
    			a9 = element("a");
    			a9.textContent = "https://SOS2122-25.herokuapp.com/api/v1/esco-stats/docs ";
    			t43 = text("(developed by ");
    			a10 = element("a");
    			a10.textContent = "Angel Simon Mesa";
    			t45 = text(")");
    			t46 = space();
    			p5 = element("p");
    			t47 = text("- ");
    			a11 = element("a");
    			a11.textContent = "https://SOS2122-25.herokuapp.com/api/v1/expo/docs ";
    			t49 = text("(developed by ");
    			a12 = element("a");
    			a12.textContent = "Adrián Pérez Gómez";
    			t51 = text(")");
    			t52 = space();
    			br7 = element("br");
    			t53 = space();
    			h35 = element("h3");
    			h35.textContent = "APIS:";
    			t55 = space();
    			p6 = element("p");
    			t56 = text("- ");
    			a13 = element("a");
    			a13.textContent = "https://SOS2122-25.herokuapp.com/api/v2/economies ";
    			t58 = text("(developed by ");
    			a14 = element("a");
    			a14.textContent = "Damiangc99";
    			t60 = text(")");
    			t61 = space();
    			p7 = element("p");
    			t62 = text("- ");
    			a15 = element("a");
    			a15.textContent = "https://SOS2122-25.herokuapp.com/api/v1/esco-stats ";
    			t64 = text("(developed by ");
    			a16 = element("a");
    			a16.textContent = "Angel Simon Mesa";
    			t66 = text(")");
    			t67 = space();
    			p8 = element("p");
    			t68 = text("- ");
    			a17 = element("a");
    			a17.textContent = "https://SOS2122-25.herokuapp.com/api/v1/expo ";
    			t70 = text("(developed by ");
    			a18 = element("a");
    			a18.textContent = "Adrián Pérez Gómez";
    			t72 = text(")");
    			t73 = space();
    			br8 = element("br");
    			t74 = space();
    			h36 = element("h3");
    			h36.textContent = "FRONT-END:";
    			t76 = space();
    			p9 = element("p");
    			t77 = text("- ");
    			a19 = element("a");
    			a19.textContent = "https://SOS2122-25.herokuapp.com/#/economies ";
    			t79 = text("(developed by ");
    			a20 = element("a");
    			a20.textContent = "Damiangc99";
    			t81 = text(")");
    			t82 = space();
    			p10 = element("p");
    			t83 = text("- ");
    			a21 = element("a");
    			a21.textContent = "https://SOS2122-25.herokuapp.com/#/esco-stats ";
    			t85 = text("(developed by ");
    			a22 = element("a");
    			a22.textContent = "Angel Simon Mesa";
    			t87 = text(")");
    			t88 = space();
    			p11 = element("p");
    			t89 = text("- ");
    			a23 = element("a");
    			a23.textContent = "https://SOS2122-25.herokuapp.com/#/expo ";
    			t91 = text("(developed by ");
    			a24 = element("a");
    			a24.textContent = "Adrián Pérez Gómez";
    			t93 = text(")");
    			t94 = space();
    			br9 = element("br");
    			t95 = space();
    			h37 = element("h3");
    			h37.textContent = "GÁFRICAS:";
    			t97 = space();
    			p12 = element("p");
    			t98 = text("- ");
    			a25 = element("a");
    			a25.textContent = "https://SOS2122-25.herokuapp.com/#/economies-graph ";
    			t100 = text("(developed by ");
    			a26 = element("a");
    			a26.textContent = "Damiangc99";
    			t102 = text(")");
    			t103 = space();
    			p13 = element("p");
    			t104 = text("- ");
    			a27 = element("a");
    			a27.textContent = "https://SOS2122-25.herokuapp.com/#/graphesco ";
    			t106 = text("(developed by ");
    			a28 = element("a");
    			a28.textContent = "Angel Simon Mesa";
    			t108 = text(")");
    			t109 = space();
    			p14 = element("p");
    			t110 = text("- ");
    			a29 = element("a");
    			a29.textContent = "https://SOS2122-25.herokuapp.com/#/expo ";
    			t112 = text("(developed by ");
    			a30 = element("a");
    			a30.textContent = "Adrián Pérez Gómez";
    			t114 = text(")");
    			t115 = space();
    			p15 = element("p");
    			t116 = text("- ");
    			a31 = element("a");
    			a31.textContent = "https://SOS2122-25.herokuapp.com/#/graph";
    			add_location(body, file$b, 5, 0, 162);
    			attr_dev(h1, "class", "svelte-95ufxa");
    			add_location(h1, file$b, 50, 4, 1861);
    			add_location(h30, file$b, 52, 4, 1888);
    			attr_dev(a0, "href", "https://github.com/damiangc99");
    			add_location(a0, file$b, 53, 9, 1912);
    			attr_dev(a1, "href", "https://ourworldindata.org/percapita");
    			add_location(a1, file$b, 53, 95, 1998);
    			add_location(p0, file$b, 53, 4, 1907);
    			attr_dev(a2, "href", "https://github.com/AngelSM11");
    			add_location(a2, file$b, 54, 9, 2074);
    			attr_dev(a3, "href", "https://ourworldindata.org/esco");
    			add_location(a3, file$b, 54, 88, 2153);
    			add_location(p1, file$b, 54, 4, 2069);
    			attr_dev(a4, "href", "https://github.com/adrianperez01_");
    			add_location(a4, file$b, 55, 9, 2225);
    			add_location(p2, file$b, 55, 4, 2220);
    			add_location(br0, file$b, 56, 4, 2333);
    			add_location(h31, file$b, 57, 4, 2343);
    			add_location(br1, file$b, 58, 4, 2486);
    			add_location(br2, file$b, 58, 8, 2490);
    			add_location(h32, file$b, 59, 4, 2500);
    			attr_dev(a5, "href", "https://github.com/gti-sos/SOS2122-25.git");
    			add_location(a5, file$b, 59, 24, 2520);
    			add_location(br3, file$b, 60, 4, 2600);
    			add_location(br4, file$b, 60, 8, 2604);
    			add_location(h33, file$b, 61, 4, 2614);
    			attr_dev(a6, "href", "http://SOS2122-25.herokuapp.com");
    			add_location(a6, file$b, 61, 17, 2627);
    			add_location(br5, file$b, 62, 4, 2710);
    			add_location(br6, file$b, 62, 8, 2714);
    			add_location(h34, file$b, 63, 4, 2724);
    			attr_dev(a7, "href", "https://SOS2122-25.herokuapp.com/api/v2/economies/docs");
    			add_location(a7, file$b, 64, 9, 2763);
    			attr_dev(a8, "href", "https://github.com/damiangc99");
    			add_location(a8, file$b, 64, 147, 2901);
    			add_location(p3, file$b, 64, 4, 2758);
    			attr_dev(a9, "href", "https://documenter.getpostman.com/view/19481634/UyxjFko9");
    			add_location(a9, file$b, 65, 9, 2985);
    			attr_dev(a10, "href", "https://github.com/AngelSM11");
    			add_location(a10, file$b, 65, 150, 3126);
    			add_location(p4, file$b, 65, 4, 2980);
    			attr_dev(a11, "href", "https://SOS2122-25.herokuapp.com/api/v1/expo/docs");
    			add_location(a11, file$b, 66, 9, 3201);
    			attr_dev(a12, "href", "https://github.com/adrianperez01_");
    			add_location(a12, file$b, 66, 137, 3329);
    			add_location(p5, file$b, 66, 4, 3196);
    			add_location(br7, file$b, 67, 4, 3406);
    			add_location(h35, file$b, 68, 1, 3413);
    			attr_dev(a13, "href", "https://SOS2122-25.herokuapp.com/api/v2/economies");
    			add_location(a13, file$b, 69, 6, 3435);
    			attr_dev(a14, "href", "https://github.com/Damiangc99");
    			add_location(a14, file$b, 69, 134, 3563);
    			add_location(p6, file$b, 69, 1, 3430);
    			attr_dev(a15, "href", "https://SOS2122-25.herokuapp.com/api/v1/esco-stats");
    			add_location(a15, file$b, 70, 6, 3630);
    			attr_dev(a16, "href", "https://github.com/AngelSM11");
    			add_location(a16, file$b, 70, 136, 3760);
    			add_location(p7, file$b, 70, 1, 3625);
    			attr_dev(a17, "href", "https://SOS2122-25.herokuapp.com/api/v1/expo");
    			add_location(a17, file$b, 71, 6, 3832);
    			attr_dev(a18, "href", "https://github.com/adrianperez01_");
    			add_location(a18, file$b, 71, 124, 3950);
    			add_location(p8, file$b, 71, 1, 3827);
    			add_location(br8, file$b, 72, 4, 4027);
    			add_location(h36, file$b, 73, 4, 4037);
    			attr_dev(a19, "href", "#/economies");
    			add_location(a19, file$b, 74, 6, 4064);
    			attr_dev(a20, "href", "https://github.com/Damiangc99");
    			add_location(a20, file$b, 74, 91, 4149);
    			add_location(p9, file$b, 74, 1, 4059);
    			attr_dev(a21, "href", "#/esco-stats");
    			add_location(a21, file$b, 75, 6, 4216);
    			attr_dev(a22, "href", "https://github.com/AngelSM11");
    			add_location(a22, file$b, 75, 93, 4303);
    			add_location(p10, file$b, 75, 1, 4211);
    			attr_dev(a23, "href", "#/expo");
    			add_location(a23, file$b, 76, 6, 4375);
    			attr_dev(a24, "href", "https://github.com/adrianperez01_");
    			add_location(a24, file$b, 76, 81, 4450);
    			add_location(p11, file$b, 76, 1, 4370);
    			add_location(br9, file$b, 77, 4, 4527);
    			add_location(h37, file$b, 78, 4, 4537);
    			attr_dev(a25, "href", "./#/economies-graph");
    			add_location(a25, file$b, 79, 9, 4566);
    			attr_dev(a26, "href", "https://github.com/Damiangc99");
    			add_location(a26, file$b, 79, 108, 4665);
    			add_location(p12, file$b, 79, 4, 4561);
    			attr_dev(a27, "href", "./#/graphesco");
    			add_location(a27, file$b, 80, 9, 4735);
    			attr_dev(a28, "href", "https://github.com/AngelSM11");
    			add_location(a28, file$b, 80, 96, 4822);
    			add_location(p13, file$b, 80, 4, 4730);
    			attr_dev(a29, "href", "#/expo");
    			add_location(a29, file$b, 81, 9, 4897);
    			attr_dev(a30, "href", "https://github.com/adrianperez01_");
    			add_location(a30, file$b, 81, 84, 4972);
    			add_location(p14, file$b, 81, 4, 4892);
    			attr_dev(a31, "href", "./#/graph");
    			add_location(a31, file$b, 82, 6, 5051);
    			add_location(p15, file$b, 82, 1, 5046);
    			attr_dev(main, "class", "svelte-95ufxa");
    			add_location(main, file$b, 49, 0, 1849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(navbar, body, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, h30);
    			append_dev(main, t4);
    			append_dev(main, p0);
    			append_dev(p0, t5);
    			append_dev(p0, a0);
    			append_dev(p0, t7);
    			append_dev(p0, a1);
    			append_dev(p0, t9);
    			append_dev(main, t10);
    			append_dev(main, p1);
    			append_dev(p1, t11);
    			append_dev(p1, a2);
    			append_dev(p1, t13);
    			append_dev(p1, a3);
    			append_dev(p1, t15);
    			append_dev(main, t16);
    			append_dev(main, p2);
    			append_dev(p2, t17);
    			append_dev(p2, a4);
    			append_dev(p2, t19);
    			append_dev(main, t20);
    			append_dev(main, br0);
    			append_dev(main, t21);
    			append_dev(main, h31);
    			append_dev(main, t23);
    			append_dev(main, br1);
    			append_dev(main, br2);
    			append_dev(main, t24);
    			append_dev(main, h32);
    			append_dev(main, a5);
    			append_dev(main, t27);
    			append_dev(main, br3);
    			append_dev(main, br4);
    			append_dev(main, t28);
    			append_dev(main, h33);
    			append_dev(main, a6);
    			append_dev(main, t31);
    			append_dev(main, br5);
    			append_dev(main, br6);
    			append_dev(main, t32);
    			append_dev(main, h34);
    			append_dev(main, t34);
    			append_dev(main, p3);
    			append_dev(p3, t35);
    			append_dev(p3, a7);
    			append_dev(p3, t37);
    			append_dev(p3, a8);
    			append_dev(p3, t39);
    			append_dev(main, t40);
    			append_dev(main, p4);
    			append_dev(p4, t41);
    			append_dev(p4, a9);
    			append_dev(p4, t43);
    			append_dev(p4, a10);
    			append_dev(p4, t45);
    			append_dev(main, t46);
    			append_dev(main, p5);
    			append_dev(p5, t47);
    			append_dev(p5, a11);
    			append_dev(p5, t49);
    			append_dev(p5, a12);
    			append_dev(p5, t51);
    			append_dev(main, t52);
    			append_dev(main, br7);
    			append_dev(main, t53);
    			append_dev(main, h35);
    			append_dev(main, t55);
    			append_dev(main, p6);
    			append_dev(p6, t56);
    			append_dev(p6, a13);
    			append_dev(p6, t58);
    			append_dev(p6, a14);
    			append_dev(p6, t60);
    			append_dev(main, t61);
    			append_dev(main, p7);
    			append_dev(p7, t62);
    			append_dev(p7, a15);
    			append_dev(p7, t64);
    			append_dev(p7, a16);
    			append_dev(p7, t66);
    			append_dev(main, t67);
    			append_dev(main, p8);
    			append_dev(p8, t68);
    			append_dev(p8, a17);
    			append_dev(p8, t70);
    			append_dev(p8, a18);
    			append_dev(p8, t72);
    			append_dev(main, t73);
    			append_dev(main, br8);
    			append_dev(main, t74);
    			append_dev(main, h36);
    			append_dev(main, t76);
    			append_dev(main, p9);
    			append_dev(p9, t77);
    			append_dev(p9, a19);
    			append_dev(p9, t79);
    			append_dev(p9, a20);
    			append_dev(p9, t81);
    			append_dev(main, t82);
    			append_dev(main, p10);
    			append_dev(p10, t83);
    			append_dev(p10, a21);
    			append_dev(p10, t85);
    			append_dev(p10, a22);
    			append_dev(p10, t87);
    			append_dev(main, t88);
    			append_dev(main, p11);
    			append_dev(p11, t89);
    			append_dev(p11, a23);
    			append_dev(p11, t91);
    			append_dev(p11, a24);
    			append_dev(p11, t93);
    			append_dev(main, t94);
    			append_dev(main, br9);
    			append_dev(main, t95);
    			append_dev(main, h37);
    			append_dev(main, t97);
    			append_dev(main, p12);
    			append_dev(p12, t98);
    			append_dev(p12, a25);
    			append_dev(p12, t100);
    			append_dev(p12, a26);
    			append_dev(p12, t102);
    			append_dev(main, t103);
    			append_dev(main, p13);
    			append_dev(p13, t104);
    			append_dev(p13, a27);
    			append_dev(p13, t106);
    			append_dev(p13, a28);
    			append_dev(p13, t108);
    			append_dev(main, t109);
    			append_dev(main, p14);
    			append_dev(p14, t110);
    			append_dev(p14, a29);
    			append_dev(p14, t112);
    			append_dev(p14, a30);
    			append_dev(p14, t114);
    			append_dev(main, t115);
    			append_dev(main, p15);
    			append_dev(p15, t116);
    			append_dev(p15, a31);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 1) {
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
    			if (detaching) detach_dev(body);
    			destroy_component(navbar);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		Button
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\front\esco-stats\esco.svelte generated by Svelte v3.47.0 */

    const { console: console_1$9 } = globals;

    const file$a = "src\\front\\esco-stats\\esco.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    // (190:2) <NavbarBrand href="#/info">
    function create_default_slot_34$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_34$2.name,
    		type: "slot",
    		source: "(190:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (193:4) <DropdownToggle nav caret>
    function create_default_slot_33$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_33$2.name,
    		type: "slot",
    		source: "(193:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (195:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_32$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Econmies-Stats");
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
    		id: create_default_slot_32$2.name,
    		type: "slot",
    		source: "(195:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (197:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_31$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_31$2.name,
    		type: "slot",
    		source: "(197:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (199:6) <DropdownItem href="./api/v1/expo-stats">
    function create_default_slot_30$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_30$2.name,
    		type: "slot",
    		source: "(199:6) <DropdownItem href=\\\"./api/v1/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:4) <DropdownMenu end>
    function create_default_slot_29$2(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_32$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_31$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo-stats",
    				$$slots: { default: [create_default_slot_30$2] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29$2.name,
    		type: "slot",
    		source: "(194:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (192:3) <Dropdown >
    function create_default_slot_28$2(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_33$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_29$2] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_28$2.name,
    		type: "slot",
    		source: "(192:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (204:4) <DropdownToggle nav caret>
    function create_default_slot_27$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_27$3.name,
    		type: "slot",
    		source: "(204:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (206:6) <DropdownItem href="./#/economies">
    function create_default_slot_26$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_26$3.name,
    		type: "slot",
    		source: "(206:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (208:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_25$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_25$4.name,
    		type: "slot",
    		source: "(208:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (210:6) <DropdownItem href="#/expo-stats">
    function create_default_slot_24$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo FRONT-END");
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
    		id: create_default_slot_24$4.name,
    		type: "slot",
    		source: "(210:6) <DropdownItem href=\\\"#/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:4) <DropdownMenu end>
    function create_default_slot_23$4(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_26$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_25$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/expo-stats",
    				$$slots: { default: [create_default_slot_24$4] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$4.name,
    		type: "slot",
    		source: "(205:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (203:12) <Dropdown>
    function create_default_slot_22$5(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_27$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_23$4] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_22$5.name,
    		type: "slot",
    		source: "(203:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (215:4) <DropdownToggle nav caret>
    function create_default_slot_21$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_21$7.name,
    		type: "slot",
    		source: "(215:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (217:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_20$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("econmies-Stats");
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
    		id: create_default_slot_20$7.name,
    		type: "slot",
    		source: "(217:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_19$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_19$7.name,
    		type: "slot",
    		source: "(219:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (221:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_18$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_18$7.name,
    		type: "slot",
    		source: "(221:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (223:6) <DropdownItem href="./#/graph">
    function create_default_slot_17$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_17$7.name,
    		type: "slot",
    		source: "(223:6) <DropdownItem href=\\\"./#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (216:4) <DropdownMenu end>
    function create_default_slot_16$7(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let t5;
    	let dropdownitem6;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_20$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_19$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_18$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem5 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem6 = new DropdownItem({
    			props: {
    				href: "./#/graph",
    				$$slots: { default: [create_default_slot_17$7] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    			t5 = space();
    			create_component(dropdownitem6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(dropdownitem6, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    			const dropdownitem6_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem6_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem6.$set(dropdownitem6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			transition_in(dropdownitem6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
    			transition_out(dropdownitem6.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(dropdownitem6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$7.name,
    		type: "slot",
    		source: "(216:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (214:5) <Dropdown >
    function create_default_slot_15$7(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_21$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_16$7] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_15$7.name,
    		type: "slot",
    		source: "(214:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (191:2) <Nav navbar>
    function create_default_slot_14$7(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_28$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_22$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_15$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$7.name,
    		type: "slot",
    		source: "(191:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (189:1) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot_13$7(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_34$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_14$7] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_13$7.name,
    		type: "slot",
    		source: "(189:1) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    // (232:1) <Button on:click="{getPgAnt}">
    function create_default_slot_12$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Anterior");
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
    		id: create_default_slot_12$7.name,
    		type: "slot",
    		source: "(232:1) <Button on:click=\\\"{getPgAnt}\\\">",
    		ctx
    	});

    	return block;
    }

    // (235:1) <Button on:click="{getPgSig}">
    function create_default_slot_11$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Siguiente");
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
    		id: create_default_slot_11$7.name,
    		type: "slot",
    		source: "(235:1) <Button on:click=\\\"{getPgSig}\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {onMount}
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (240:1) {:then esco}
    function create_then_block$5(ctx) {
    	let alert;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[4],
    				isOpen: /*visible*/ ctx[3],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_10$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(alert.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = {};
    			if (dirty[0] & /*color*/ 16) alert_changes.color = /*color*/ ctx[4];
    			if (dirty[0] & /*visible*/ 8) alert_changes.isOpen = /*visible*/ ctx[3];
    			if (dirty[0] & /*visible*/ 8) alert_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*checkMSG*/ 4 | dirty[1] & /*$$scope*/ 2) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, color, checkMSG, visible*/ 31 | dirty[1] & /*$$scope*/ 2) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*esco, newesco*/ 96 | dirty[1] & /*$$scope*/ 2) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(240:1) {:then esco}",
    		ctx
    	});

    	return block;
    }

    // (243:2) {#if checkMSG}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 4) set_data_dev(t, /*checkMSG*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(243:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (242:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_10$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[2] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$7.name,
    		type: "slot",
    		source: "(242:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (261:22) <Button outline color="dark" on:click="{()=>{      if (from == null || to == null) {       color="success";       checkMSG="Los campos fecha inicio y fecha fin no pueden estar vacíos";       visible="true";       //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')      }else{       getesco();      }     }}">
    function create_default_slot_9$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
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
    		id: create_default_slot_9$7.name,
    		type: "slot",
    		source: "(261:22) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{      if (from == null || to == null) {       color=\\\"success\\\";       checkMSG=\\\"Los campos fecha inicio y fecha fin no pueden estar vacíos\\\";       visible=\\\"true\\\";       //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')      }else{       getesco();      }     }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (274:22) <Button outline color="info" on:click="{()=>{      from = null;      to = null;      getesco();           }}">
    function create_default_slot_8$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
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
    		id: create_default_slot_8$7.name,
    		type: "slot",
    		source: "(274:22) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{      from = null;      to = null;      getesco();           }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (248:1) <Table bordered>
    function create_default_slot_7$7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_9$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[17]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_8$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[18]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha de inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$a, 250, 4, 7348);
    			add_location(th1, file$a, 251, 4, 7378);
    			add_location(tr0, file$a, 249, 3, 7338);
    			add_location(thead, file$a, 248, 2, 7326);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			add_location(input0, file$a, 258, 7, 7452);
    			add_location(td0, file$a, 258, 3, 7448);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			add_location(input1, file$a, 259, 7, 7515);
    			add_location(td1, file$a, 259, 3, 7511);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$a, 260, 3, 7572);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$a, 273, 3, 7967);
    			add_location(tr1, file$a, 257, 2, 7439);
    			add_location(tbody, file$a, 254, 2, 7422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[0]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[1]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 1 && to_number(input0.value) !== /*from*/ ctx[0]) {
    				set_input_value(input0, /*from*/ ctx[0]);
    			}

    			if (dirty[0] & /*to*/ 2 && to_number(input1.value) !== /*to*/ ctx[1]) {
    				set_input_value(input1, /*to*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$7.name,
    		type: "slot",
    		source: "(248:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (306:8) <Button outline color="primary" on:click="{insertesco}">
    function create_default_slot_6$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
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
    		id: create_default_slot_6$7.name,
    		type: "slot",
    		source: "(306:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertesco}\\\">",
    		ctx
    	});

    	return block;
    }

    // (310:23) <Button outline color="primary" on:click="{()=>{       newesco.country = null;       newesco.year = null;       newesco.tot_wom = null;       newesco.tot_man = null;       newesco.tot_esco = null;      }}">
    function create_default_slot_5$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar");
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
    		id: create_default_slot_5$7.name,
    		type: "slot",
    		source: "(310:23) <Button outline color=\\\"primary\\\" on:click=\\\"{()=>{       newesco.country = null;       newesco.year = null;       newesco.tot_wom = null;       newesco.tot_man = null;       newesco.tot_esco = null;      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (329:8) <Button outline color="warning" on:click={function (){       window.location.href = `/#/esco/${escoa.country}/${escoa.year}`      }}>
    function create_default_slot_4$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_4$8.name,
    		type: "slot",
    		source: "(329:8) <Button outline color=\\\"warning\\\" on:click={function (){       window.location.href = `/#/esco/${escoa.country}/${escoa.year}`      }}>",
    		ctx
    	});

    	return block;
    }

    // (334:8) <Button outline color="danger" on:click={Borraresco(escoa.country,escoa.year)}>
    function create_default_slot_3$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
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
    		id: create_default_slot_3$8.name,
    		type: "slot",
    		source: "(334:8) <Button outline color=\\\"danger\\\" on:click={Borraresco(escoa.country,escoa.year)}>",
    		ctx
    	});

    	return block;
    }

    // (321:3) {#each esco as escoa}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*escoa*/ ctx[29].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*escoa*/ ctx[29].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*escoa*/ ctx[29].tot_wom + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*escoa*/ ctx[29].tot_man + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*escoa*/ ctx[29].tot_esco + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[25](/*escoa*/ ctx[29]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_4$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_3);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_3$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*Borraresco*/ ctx[11](/*escoa*/ ctx[29].country, /*escoa*/ ctx[29].year))) /*Borraresco*/ ctx[11](/*escoa*/ ctx[29].country, /*escoa*/ ctx[29].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(td0, file$a, 322, 4, 9192);
    			add_location(td1, file$a, 323, 4, 9222);
    			add_location(td2, file$a, 324, 16, 9261);
    			add_location(td3, file$a, 325, 16, 9303);
    			add_location(td4, file$a, 326, 16, 9345);
    			add_location(td5, file$a, 328, 4, 9378);
    			add_location(td6, file$a, 333, 4, 9549);
    			add_location(tr, file$a, 321, 3, 9182);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(td5, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*esco*/ 64) && t0_value !== (t0_value = /*escoa*/ ctx[29].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*esco*/ 64) && t2_value !== (t2_value = /*escoa*/ ctx[29].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*esco*/ 64) && t4_value !== (t4_value = /*escoa*/ ctx[29].tot_wom + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*esco*/ 64) && t6_value !== (t6_value = /*escoa*/ ctx[29].tot_man + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*esco*/ 64) && t8_value !== (t8_value = /*escoa*/ ctx[29].tot_esco + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(321:3) {#each esco as escoa}",
    		ctx
    	});

    	return block;
    }

    // (342:8) <Button outline color="success" on:click={Loadesco}>
    function create_default_slot_2$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
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
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(342:8) <Button outline color=\\\"success\\\" on:click={Loadesco}>",
    		ctx
    	});

    	return block;
    }

    // (345:8) <Button outline color="danger" on:click={BorrarescosAll}>
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
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
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(345:8) <Button outline color=\\\"danger\\\" on:click={BorrarescosAll}>",
    		ctx
    	});

    	return block;
    }

    // (288:1) <Table bordered>
    function create_default_slot$8(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t10;
    	let td1;
    	let input1;
    	let t11;
    	let td2;
    	let input2;
    	let t12;
    	let td3;
    	let input3;
    	let t13;
    	let td4;
    	let input4;
    	let t14;
    	let td5;
    	let button0;
    	let t15;
    	let td6;
    	let button1;
    	let t16;
    	let t17;
    	let tr2;
    	let td7;
    	let button2;
    	let t18;
    	let td8;
    	let button3;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertesco*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_2*/ ctx[24]);
    	let each_value = /*esco*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*Loadesco*/ ctx[13]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*BorrarescosAll*/ ctx[12]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Escolarizacion total";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Escolarizacion hombres";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Escolarizacion mujeres";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t10 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t11 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t12 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t13 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t14 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t15 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			tr2 = element("tr");
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			t18 = space();
    			td8 = element("td");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$a, 290, 4, 8224);
    			add_location(th1, file$a, 291, 4, 8243);
    			add_location(th2, file$a, 292, 16, 8273);
    			add_location(th3, file$a, 293, 16, 8320);
    			add_location(th4, file$a, 294, 16, 8369);
    			add_location(tr0, file$a, 289, 3, 8214);
    			add_location(thead, file$a, 288, 2, 8202);
    			add_location(input0, file$a, 299, 8, 8452);
    			add_location(td0, file$a, 299, 4, 8448);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$a, 300, 8, 8505);
    			add_location(td1, file$a, 300, 4, 8501);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$a, 301, 8, 8569);
    			add_location(td2, file$a, 301, 4, 8565);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$a, 302, 8, 8636);
    			add_location(td3, file$a, 302, 4, 8632);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$a, 303, 8, 8703);
    			add_location(td4, file$a, 303, 4, 8699);
    			add_location(td5, file$a, 305, 4, 8769);
    			attr_dev(td6, "align", "center");
    			add_location(td6, file$a, 309, 4, 8875);
    			add_location(tr1, file$a, 298, 3, 8438);
    			add_location(td7, file$a, 341, 4, 9714);
    			add_location(td8, file$a, 344, 4, 9815);
    			add_location(tr2, file$a, 340, 3, 9704);
    			add_location(tbody, file$a, 297, 2, 8426);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newesco*/ ctx[5].country);
    			append_dev(tr1, t10);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newesco*/ ctx[5].year);
    			append_dev(tr1, t11);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newesco*/ ctx[5].tot_wom);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newesco*/ ctx[5].tot_man);
    			append_dev(tr1, t13);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newesco*/ ctx[5].tot_esco);
    			append_dev(tr1, t14);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td6);
    			mount_component(button1, td6, null);
    			append_dev(tbody, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tr2, t18);
    			append_dev(tr2, td8);
    			mount_component(button3, td8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newesco*/ 32 && input0.value !== /*newesco*/ ctx[5].country) {
    				set_input_value(input0, /*newesco*/ ctx[5].country);
    			}

    			if (dirty[0] & /*newesco*/ 32 && to_number(input1.value) !== /*newesco*/ ctx[5].year) {
    				set_input_value(input1, /*newesco*/ ctx[5].year);
    			}

    			if (dirty[0] & /*newesco*/ 32 && to_number(input2.value) !== /*newesco*/ ctx[5].tot_wom) {
    				set_input_value(input2, /*newesco*/ ctx[5].tot_wom);
    			}

    			if (dirty[0] & /*newesco*/ 32 && to_number(input3.value) !== /*newesco*/ ctx[5].tot_man) {
    				set_input_value(input3, /*newesco*/ ctx[5].tot_man);
    			}

    			if (dirty[0] & /*newesco*/ 32 && to_number(input4.value) !== /*newesco*/ ctx[5].tot_esco) {
    				set_input_value(input4, /*newesco*/ ctx[5].tot_esco);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*Borraresco, esco*/ 2112) {
    				each_value = /*esco*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(288:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (238:17)   loading   {:then esco}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(238:17)   loading   {:then esco}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let h1;
    	let t2;
    	let button0;
    	let t3;
    	let button1;
    	let t4;
    	let promise;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot_13$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_12$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getPgAnt*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getPgSig*/ ctx[9]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*esco*/ ctx[6], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Tasa de escolarizacion";
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			info.block.c();
    			add_location(h1, file$a, 230, 4, 6968);
    			add_location(main, file$a, 187, 0, 5277);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			mount_component(button0, main, null);
    			append_dev(main, t3);
    			mount_component(button1, main, null);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const navbar_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			info.ctx = ctx;

    			if (dirty[0] & /*esco*/ 64 && promise !== (promise = /*esco*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(button0);
    			destroy_component(button1);
    			info.block.d();
    			info.token = null;
    			info = null;
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Esco', slots, []);
    	let esco = [];
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let numEntries;

    	let newesco = {
    		country: "",
    		year: "",
    		tot_wom: "",
    		tot_man: "",
    		tot_esco: ""
    	};

    	onMount(getesco);

    	async function getesco() {
    		console.log("fetching esco ....");
    		let cadena = `/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, esco = data);
    			numEntries = esco.length;
    			console.log("Received esco: " + esco.length);
    		} else {
    			$$invalidate(4, color = "danger");
    			$$invalidate(2, checkMSG = "No hay entradas para esas fechas");
    			$$invalidate(3, visible = "true");
    		} //window.alert("No hay entradas para esas fechas");
    	}

    	async function getPgAnt() {
    		if (offset >= 10) {
    			offset = offset - 10;
    		}

    		//limit=limit+10;
    		console.log("fetching esco ....");

    		let cadena = `/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, esco = data);
    			console.log("Received esco: " + esco.length);
    		}
    	}

    	async function getPgSig() {
    		if (esco.length >= 10) {
    			offset = offset + 10;
    		}

    		//limit=limit+10;
    		console.log("fetching esco ....");

    		let cadena = `/api/v1/esco-stats?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, esco = data);
    			console.log("Received esco: " + esco.length);
    		}
    	}

    	async function insertesco() {
    		if (newesco.country == "" || newesco.country == null || newesco.year == "" || newesco.year == null || newesco.tot_wom == "" || newesco.tot_wom == null || newesco.tot_man == "" || newesco.tot_man == null || newesco.tot_esco == "" || newesco.tot_esco == null) {
    			$$invalidate(4, color = "danger");
    			$$invalidate(2, checkMSG = "Debe completar todos los campos");
    			$$invalidate(3, visible = "true");
    		} else {
    			console.log("Inserting esco...." + JSON.stringify(newesco));

    			await fetch("/api/v1/esco-stats", {
    				method: "POST",
    				body: JSON.stringify(newesco),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				if (res.status == 201) {
    					$$invalidate(4, color = "success");
    					$$invalidate(2, checkMSG = "Entrada introducida con éxito");
    					$$invalidate(3, visible = "true");
    					$$invalidate(5, newesco.country = null, newesco);
    					$$invalidate(5, newesco.year = null, newesco);
    					$$invalidate(5, newesco.tot_wom = null, newesco);
    					$$invalidate(5, newesco.tot_man = null, newesco);
    					$$invalidate(5, newesco.tot_esco = null, newesco);
    					getesco();
    				} else if (res.status == 409) {
    					$$invalidate(4, color = "danger"); //window.alert("Entrada introducida con éxito");
    					$$invalidate(2, checkMSG = "Ya existe ese recurso en la base de datos");
    					$$invalidate(3, visible = "true");

    					//window.alert("Ya existe ese recurso en la base de datos");
    					console.log("ERROR There is already a data with that country and year in the database");
    				}
    			});
    		}
    	}

    	async function Borraresco(name, year) {
    		console.log("Deleting esco....");

    		await fetch("/api/v1/esco-stats/" + name + "/" + year, { method: "DELETE" }).then(function (res) {
    			getesco();

    			if (res.status == 200) {
    				$$invalidate(4, color = "success");
    				$$invalidate(2, checkMSG = name + " entrada borrada correctamente");
    				$$invalidate(3, visible = "true");
    				console.log("Deleted " + name);
    			} else {
    				$$invalidate(4, color = "danger"); //window.alert(name + " elimida con éxito");           
    				$$invalidate(2, checkMSG = name + "no se ha podido borrar la entrada");
    				$$invalidate(3, visible = "true");

    				//window.alert(name + " no se ha podida eliminar");
    				console.log("DATA NOT FOUND");
    			}
    		});
    	}

    	async function BorrarescosAll() {
    		console.log("Deleting escos....");

    		await fetch("/api/v1/esco-stats/", { method: "DELETE" }).then(function (res) {
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Entradas elimidas con éxito");
    			$$invalidate(3, visible = "true");
    			getesco();
    		}); //window.alert("Entradas elimidas con éxito");
    	}

    	async function Loadesco() {
    		console.log("Loading esco....");

    		await fetch("/api/v1/esco-stats/loadInitialData", { method: "GET" }).then(function (res) {
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Entradas cargadas con éxito");
    			$$invalidate(3, visible = "true");
    			getesco();
    		}); //window.alert("Entradas cargadas con éxito");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Esco> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(3, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(0, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(1, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Los campos fecha inicio y fecha fin no pueden estar vacíos");
    			$$invalidate(3, visible = "true");
    		} else {
    			getesco(); //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, from = null);
    		$$invalidate(1, to = null);
    		getesco();
    	};

    	function input0_input_handler_1() {
    		newesco.country = this.value;
    		$$invalidate(5, newesco);
    	}

    	function input1_input_handler_1() {
    		newesco.year = to_number(this.value);
    		$$invalidate(5, newesco);
    	}

    	function input2_input_handler() {
    		newesco.tot_wom = to_number(this.value);
    		$$invalidate(5, newesco);
    	}

    	function input3_input_handler() {
    		newesco.tot_man = to_number(this.value);
    		$$invalidate(5, newesco);
    	}

    	function input4_input_handler() {
    		newesco.tot_esco = to_number(this.value);
    		$$invalidate(5, newesco);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(5, newesco.country = null, newesco);
    		$$invalidate(5, newesco.year = null, newesco);
    		$$invalidate(5, newesco.tot_wom = null, newesco);
    		$$invalidate(5, newesco.tot_man = null, newesco);
    		$$invalidate(5, newesco.tot_esco = null, newesco);
    	};

    	const click_handler_3 = function (escoa) {
    		window.location.href = `/#/esco/${escoa.country}/${escoa.year}`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		esco,
    		from,
    		to,
    		offset,
    		limit,
    		checkMSG,
    		visible,
    		color,
    		numEntries,
    		newesco,
    		getesco,
    		getPgAnt,
    		getPgSig,
    		insertesco,
    		Borraresco,
    		BorrarescosAll,
    		Loadesco
    	});

    	$$self.$inject_state = $$props => {
    		if ('esco' in $$props) $$invalidate(6, esco = $$props.esco);
    		if ('from' in $$props) $$invalidate(0, from = $$props.from);
    		if ('to' in $$props) $$invalidate(1, to = $$props.to);
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('checkMSG' in $$props) $$invalidate(2, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(3, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(4, color = $$props.color);
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    		if ('newesco' in $$props) $$invalidate(5, newesco = $$props.newesco);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		from,
    		to,
    		checkMSG,
    		visible,
    		color,
    		newesco,
    		esco,
    		getesco,
    		getPgAnt,
    		getPgSig,
    		insertesco,
    		Borraresco,
    		BorrarescosAll,
    		Loadesco,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Esco extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Esco",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\front\esco-stats\Editesco.svelte generated by Svelte v3.47.0 */

    const { console: console_1$8 } = globals;

    const file$9 = "src\\front\\esco-stats\\Editesco.svelte";

    // (95:2) <NavbarBrand href="#/info">
    function create_default_slot_25$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_25$3.name,
    		type: "slot",
    		source: "(95:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (98:4) <DropdownToggle nav caret>
    function create_default_slot_24$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_24$3.name,
    		type: "slot",
    		source: "(98:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (100:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_23$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies");
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
    		id: create_default_slot_23$3.name,
    		type: "slot",
    		source: "(100:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (102:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_22$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_22$4.name,
    		type: "slot",
    		source: "(102:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:6) <DropdownItem href="./api/v1/expo-stats">
    function create_default_slot_21$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_21$6.name,
    		type: "slot",
    		source: "(104:6) <DropdownItem href=\\\"./api/v1/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:4) <DropdownMenu end>
    function create_default_slot_20$6(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_23$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_22$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo-stats",
    				$$slots: { default: [create_default_slot_21$6] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$6.name,
    		type: "slot",
    		source: "(99:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (97:3) <Dropdown >
    function create_default_slot_19$6(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_24$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_20$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_19$6.name,
    		type: "slot",
    		source: "(97:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (109:4) <DropdownToggle nav caret>
    function create_default_slot_18$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_18$6.name,
    		type: "slot",
    		source: "(109:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (111:6) <DropdownItem href="./#/economies">
    function create_default_slot_17$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Economies FRONT-END");
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
    		id: create_default_slot_17$6.name,
    		type: "slot",
    		source: "(111:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_16$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_16$6.name,
    		type: "slot",
    		source: "(113:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:6) <DropdownItem href="#/expo-stats">
    function create_default_slot_15$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo FRONT-END");
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
    		id: create_default_slot_15$6.name,
    		type: "slot",
    		source: "(115:6) <DropdownItem href=\\\"#/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:4) <DropdownMenu end>
    function create_default_slot_14$6(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_17$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_16$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/expo-stats",
    				$$slots: { default: [create_default_slot_15$6] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$6.name,
    		type: "slot",
    		source: "(110:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (108:12) <Dropdown>
    function create_default_slot_13$6(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_18$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_14$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_13$6.name,
    		type: "slot",
    		source: "(108:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (120:4) <DropdownToggle nav caret>
    function create_default_slot_12$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_12$6.name,
    		type: "slot",
    		source: "(120:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (122:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_11$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies");
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
    		id: create_default_slot_11$6.name,
    		type: "slot",
    		source: "(122:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (123:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_10$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_10$6.name,
    		type: "slot",
    		source: "(123:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (124:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_9$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_9$6.name,
    		type: "slot",
    		source: "(124:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:18) <DropdownItem href="./#/graph">
    function create_default_slot_8$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_8$6.name,
    		type: "slot",
    		source: "(126:18) <DropdownItem href=\\\"./#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (121:4) <DropdownMenu end>
    function create_default_slot_7$6(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_11$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_10$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_9$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./#/graph",
    				$$slots: { default: [create_default_slot_8$6] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$6.name,
    		type: "slot",
    		source: "(121:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (119:5) <Dropdown >
    function create_default_slot_6$6(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_12$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_7$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_6$6.name,
    		type: "slot",
    		source: "(119:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (96:2) <Nav navbar>
    function create_default_slot_5$6(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_19$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_13$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_6$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$6.name,
    		type: "slot",
    		source: "(96:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (94:4) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot_4$7(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_25$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_5$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_4$7.name,
    		type: "slot",
    		source: "(94:4) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    // (136:2) {#if checkMSG}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 2) set_data_dev(t, /*checkMSG*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(136:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (135:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$7.name,
    		type: "slot",
    		source: "(135:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>        export let params={}
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>        export let params={}",
    		ctx
    	});

    	return block;
    }

    // (142:8) {:then esco}
    function create_then_block$4(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedtot_esco, updatedtot_man, updatedtot_wom, updatedYear, params*/ 65777) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(142:8) {:then esco}",
    		ctx
    	});

    	return block;
    }

    // (162:24) <Button outline color="primary" on:click="{Editesco}">
    function create_default_slot_2$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(162:24) <Button outline color=\\\"primary\\\" on:click=\\\"{Editesco}\\\">",
    		ctx
    	});

    	return block;
    }

    // (144:8) <Table bordered>
    function create_default_slot_1$7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let t10_value = /*params*/ ctx[0].country + "";
    	let t10;
    	let t11;
    	let td1;
    	let t12;
    	let t13;
    	let td2;
    	let input0;
    	let t14;
    	let td3;
    	let input1;
    	let t15;
    	let td4;
    	let input2;
    	let t16;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*Editesco*/ ctx[9]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Escolarizacion total";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Escolarizacion hombres";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Escolarizacion mujeres";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td1 = element("td");
    			t12 = text(/*updatedYear*/ ctx[4]);
    			t13 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$9, 146, 20, 4427);
    			add_location(th1, file$9, 147, 20, 4462);
    			add_location(th2, file$9, 148, 20, 4496);
    			add_location(th3, file$9, 149, 20, 4547);
    			add_location(th4, file$9, 150, 20, 4600);
    			add_location(tr0, file$9, 145, 16, 4401);
    			add_location(thead, file$9, 144, 12, 4376);
    			add_location(td0, file$9, 155, 20, 4741);
    			add_location(td1, file$9, 156, 20, 4788);
    			add_location(input0, file$9, 157, 24, 4836);
    			add_location(td2, file$9, 157, 20, 4832);
    			add_location(input1, file$9, 158, 24, 4904);
    			add_location(td3, file$9, 158, 20, 4900);
    			add_location(input2, file$9, 159, 24, 4972);
    			add_location(td4, file$9, 159, 20, 4968);
    			add_location(td5, file$9, 161, 20, 5043);
    			add_location(tr1, file$9, 154, 16, 4715);
    			add_location(tbody, file$9, 153, 12, 4690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t10);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedtot_wom*/ ctx[5]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedtot_man*/ ctx[6]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedtot_esco*/ ctx[7]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t10_value !== (t10_value = /*params*/ ctx[0].country + "")) set_data_dev(t10, t10_value);
    			if (!current || dirty & /*updatedYear*/ 16) set_data_dev(t12, /*updatedYear*/ ctx[4]);

    			if (dirty & /*updatedtot_wom*/ 32 && input0.value !== /*updatedtot_wom*/ ctx[5]) {
    				set_input_value(input0, /*updatedtot_wom*/ ctx[5]);
    			}

    			if (dirty & /*updatedtot_man*/ 64 && input1.value !== /*updatedtot_man*/ ctx[6]) {
    				set_input_value(input1, /*updatedtot_man*/ ctx[6]);
    			}

    			if (dirty & /*updatedtot_esco*/ 128 && input2.value !== /*updatedtot_esco*/ ctx[7]) {
    				set_input_value(input2, /*updatedtot_esco*/ ctx[7]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(144:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (140:17)       loading          {:then esco}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(140:17)       loading          {:then esco}",
    		ctx
    	});

    	return block;
    }

    // (171:4) <Button outline color="secondary" on:click= "{pop}">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(171:4) <Button outline color=\\\"secondary\\\" on:click= \\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4;
    	let alert;
    	let t5;
    	let promise;
    	let t6;
    	let button;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot_4$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[3],
    				isOpen: /*visible*/ ctx[2],
    				toggle: /*func*/ ctx[10],
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*esco*/ ctx[8], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Editar \"");
    			t2 = text(t2_value);
    			t3 = text("\"");
    			t4 = space();
    			create_component(alert.$$.fragment);
    			t5 = space();
    			info.block.c();
    			t6 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$9, 133, 4, 4110);
    			add_location(main, file$9, 92, 0, 2440);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(main, t4);
    			mount_component(alert, main, null);
    			append_dev(main, t5);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t6;
    			append_dev(main, t6);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			const alert_changes = {};
    			if (dirty & /*color*/ 8) alert_changes.color = /*color*/ ctx[3];
    			if (dirty & /*visible*/ 4) alert_changes.isOpen = /*visible*/ ctx[2];
    			if (dirty & /*visible*/ 4) alert_changes.toggle = /*func*/ ctx[10];

    			if (dirty & /*$$scope, checkMSG*/ 65538) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			info.ctx = ctx;

    			if (dirty & /*esco*/ 256 && promise !== (promise = /*esco*/ ctx[8]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(alert.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(alert.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(alert);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
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

    async function Fallos$2(code, entrada) {
    	let msg;

    	if (code == 404) {
    		msg = "No se encuentra " + entrada;
    	}

    	if (code == 400) {
    		msg = "solicitud incorrecta";
    	}

    	if (code == 409) {
    		msg = "El dato introducido ya existe";
    	}

    	if (code == 401) {
    		msg = "No autorizado";
    	}

    	if (code == 405) {
    		msg = "Método no permitido";
    	}

    	window.alert(msg);
    	return;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Editesco', slots, []);
    	let { params = {} } = $$props;
    	let esco = {};
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let updatedCountry;
    	let updatedYear;
    	let updatedtot_wom;
    	let updatedtot_man;
    	let updatedtot_esco;
    	onMount(getesco);

    	async function getesco() {
    		console.log("fetching esco ....");
    		const res = await fetch("/api/v1/esco-stats/" + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(8, esco = data);
    			updatedCountry = esco.country;
    			$$invalidate(4, updatedYear = esco.year);
    			$$invalidate(5, updatedtot_wom = esco.tot_wom);
    			$$invalidate(6, updatedtot_man = esco.tot_man);
    			$$invalidate(7, updatedtot_esco = esco.tot_esco);
    		} else {
    			Fallos$2(res.status, params.country);
    			pop();
    		}
    	}

    	async function Editesco() {
    		console.log("Updating esco...." + updatedCountry);

    		await fetch("/api/v1/esco-stats/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: updatedYear,
    				tot_wom: updatedtot_wom,
    				tot_man: updatedtot_man,
    				tot_esco: updatedtot_esco
    			}),
    			headers: { "Content-Type": "application/json" }
    		});

    		$$invalidate(3, color = "success");
    		$$invalidate(1, checkMSG = "Se ha editado correctamente");
    		$$invalidate(2, visible = "true");
    	} //window.alert("Se ha editado correctamente"); 

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Editesco> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visible = false);

    	function input0_input_handler() {
    		updatedtot_wom = this.value;
    		$$invalidate(5, updatedtot_wom);
    	}

    	function input1_input_handler() {
    		updatedtot_man = this.value;
    		$$invalidate(6, updatedtot_man);
    	}

    	function input2_input_handler() {
    		updatedtot_esco = this.value;
    		$$invalidate(7, updatedtot_esco);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		esco,
    		checkMSG,
    		visible,
    		color,
    		updatedCountry,
    		updatedYear,
    		updatedtot_wom,
    		updatedtot_man,
    		updatedtot_esco,
    		getesco,
    		Editesco,
    		Fallos: Fallos$2
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('esco' in $$props) $$invalidate(8, esco = $$props.esco);
    		if ('checkMSG' in $$props) $$invalidate(1, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('updatedCountry' in $$props) updatedCountry = $$props.updatedCountry;
    		if ('updatedYear' in $$props) $$invalidate(4, updatedYear = $$props.updatedYear);
    		if ('updatedtot_wom' in $$props) $$invalidate(5, updatedtot_wom = $$props.updatedtot_wom);
    		if ('updatedtot_man' in $$props) $$invalidate(6, updatedtot_man = $$props.updatedtot_man);
    		if ('updatedtot_esco' in $$props) $$invalidate(7, updatedtot_esco = $$props.updatedtot_esco);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		checkMSG,
    		visible,
    		color,
    		updatedYear,
    		updatedtot_wom,
    		updatedtot_man,
    		updatedtot_esco,
    		esco,
    		Editesco,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class Editesco_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editesco_1",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get params() {
    		throw new Error("<Editesco>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Editesco>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\esco-stats\MyGraphesco.svelte generated by Svelte v3.47.0 */

    const { console: console_1$7 } = globals;

    const file$8 = "src\\front\\esco-stats\\MyGraphesco.svelte";

    // (127:2) <NavbarBrand href="#/info">
    function create_default_slot_21$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_21$5.name,
    		type: "slot",
    		source: "(127:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:4) <DropdownToggle nav caret>
    function create_default_slot_20$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_20$5.name,
    		type: "slot",
    		source: "(130:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (132:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_19$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_19$5.name,
    		type: "slot",
    		source: "(132:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (134:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_18$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_18$5.name,
    		type: "slot",
    		source: "(134:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (136:6) <DropdownItem href="./api/v1/expo-stats">
    function create_default_slot_17$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expoç-Stats");
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
    		id: create_default_slot_17$5.name,
    		type: "slot",
    		source: "(136:6) <DropdownItem href=\\\"./api/v1/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:4) <DropdownMenu end>
    function create_default_slot_16$5(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_19$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_18$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo-stats",
    				$$slots: { default: [create_default_slot_17$5] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$5.name,
    		type: "slot",
    		source: "(131:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (129:3) <Dropdown >
    function create_default_slot_15$5(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_20$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_16$5] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_15$5.name,
    		type: "slot",
    		source: "(129:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (141:4) <DropdownToggle nav caret>
    function create_default_slot_14$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_14$5.name,
    		type: "slot",
    		source: "(141:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (143:6) <DropdownItem href="./#/economies">
    function create_default_slot_13$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_13$5.name,
    		type: "slot",
    		source: "(143:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (145:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_12$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_12$5.name,
    		type: "slot",
    		source: "(145:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (147:6) <DropdownItem href="#/expo-stats">
    function create_default_slot_11$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo FRONT-END");
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
    		id: create_default_slot_11$5.name,
    		type: "slot",
    		source: "(147:6) <DropdownItem href=\\\"#/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:4) <DropdownMenu end>
    function create_default_slot_10$5(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_13$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_12$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/expo-stats",
    				$$slots: { default: [create_default_slot_11$5] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$5.name,
    		type: "slot",
    		source: "(142:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (140:12) <Dropdown>
    function create_default_slot_9$5(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_14$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_10$5] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_9$5.name,
    		type: "slot",
    		source: "(140:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (152:4) <DropdownToggle nav caret>
    function create_default_slot_8$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_8$5.name,
    		type: "slot",
    		source: "(152:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (154:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_7$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_7$5.name,
    		type: "slot",
    		source: "(154:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (156:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_6$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_6$5.name,
    		type: "slot",
    		source: "(156:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (158:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_5$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_5$5.name,
    		type: "slot",
    		source: "(158:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (160:18) <DropdownItem href="./#/graph">
    function create_default_slot_4$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_4$6.name,
    		type: "slot",
    		source: "(160:18) <DropdownItem href=\\\"./#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (153:4) <DropdownMenu end>
    function create_default_slot_3$6(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let t5;
    	let dropdownitem6;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_7$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_6$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem5 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem6 = new DropdownItem({
    			props: {
    				href: "./#/graph",
    				$$slots: { default: [create_default_slot_4$6] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    			t5 = space();
    			create_component(dropdownitem6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(dropdownitem6, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    			const dropdownitem6_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem6_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem6.$set(dropdownitem6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			transition_in(dropdownitem6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
    			transition_out(dropdownitem6.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(dropdownitem6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(153:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (151:5) <Dropdown >
    function create_default_slot_2$6(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_8$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_3$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(151:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (128:2) <Nav navbar>
    function create_default_slot_1$6(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_15$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_9$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(128:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (126:4) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot$6(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_21$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_1$6] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(126:4) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let navbar;
    	let t1;
    	let figure;
    	let div;
    	let t2;
    	let p;
    	let current;
    	let mounted;
    	let dispose;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			figure = element("figure");
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Este gráfico compara los valores de escolarizacion en distintas edades";
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$8, 118, 4, 3921);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$8, 119, 4, 4014);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$8, 120, 4, 4114);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$8, 121, 4, 4216);
    			attr_dev(div, "id", "container");
    			add_location(div, file$8, 168, 8, 6147);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$8, 169, 8, 6179);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$8, 167, 4, 6103);
    			add_location(main, file$8, 124, 0, 4334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t1);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t2);
    			append_dev(figure, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyGraphesco', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let escos = [];
    	let country = [];
    	let year = [];
    	let tot_wom = [];
    	let tot_man = [];
    	let tot_esco = [];
    	let datosOrdenados = [];

    	async function getData() {
    		console.log("Fetching esco....");
    		const res = await fetch("/api/v1/esco-stats");

    		if (res.ok) {
    			const data = await res.json();
    			escos = data;

    			if (escos.length == 0) {
    				await fetch("/api/v1/esco-stats/loadInitialData");
    				console.log("Entradas recibidas: " + escos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = escos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(esco => {
    					year.push(esco.year);
    					country.push(esco.country + "-" + esco.year);
    					tot_wom.push(esco.tot_wom);
    					tot_man.push(esco.tot_man);
    					tot_esco.push(esco.tot_esco);
    				});

    				location.reload();
    			} else {
    				console.log("Entradas recibidas: " + escos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = escos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(esco => {
    					year.push(esco.year);
    					country.push(esco.country + "-" + esco.year);
    					tot_wom.push(esco.tot_wom);
    					tot_man.push(esco.tot_man);
    					tot_esco.push(esco.tot_esco);
    				});
    			}
    		} else {
    			console.log("Error, can`t charge data");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: { text: "escolarizacion" },
    			subtitle: {
    				text: "Source: https://ourworldindata.org/esco"
    			},
    			xAxis: { categories: country, crosshair: true },
    			yAxis: {
    				min: 0,
    				title: { text: "escolarizacion" }
    			},
    			tooltip: {
    				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y} muertes</b></td></tr>',
    				footerFormat: "</table>",
    				shared: true,
    				useHTML: true
    			},
    			plotOptions: {
    				column: { pointPadding: 0.2, borderWidth: 0 }
    			},
    			series: [
    				{
    					name: 'Escolarizacion Total',
    					data: tot_esco
    				},
    				{
    					name: 'Escolarización Hombres',
    					data: tot_man
    				},
    				{
    					name: 'Escolarización Mujeres',
    					data: tot_wom
    				}
    			]
    		});
    	}

    	onMount(getData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<MyGraphesco> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		Button,
    		delay,
    		escos,
    		country,
    		year,
    		tot_wom,
    		tot_man,
    		tot_esco,
    		datosOrdenados,
    		getData,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('escos' in $$props) escos = $$props.escos;
    		if ('country' in $$props) country = $$props.country;
    		if ('year' in $$props) year = $$props.year;
    		if ('tot_wom' in $$props) tot_wom = $$props.tot_wom;
    		if ('tot_man' in $$props) tot_man = $$props.tot_man;
    		if ('tot_esco' in $$props) tot_esco = $$props.tot_esco;
    		if ('datosOrdenados' in $$props) datosOrdenados = $$props.datosOrdenados;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class MyGraphesco extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyGraphesco",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\front\frontEconomies\economies.svelte generated by Svelte v3.47.0 */

    const { console: console_1$6 } = globals;

    const file$7 = "src\\front\\frontEconomies\\economies.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (201:2) <NavbarBrand href="#/info">
    function create_default_slot_36$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_36$1.name,
    		type: "slot",
    		source: "(201:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (204:4) <DropdownToggle nav caret>
    function create_default_slot_35$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_35$1.name,
    		type: "slot",
    		source: "(204:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (206:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_34$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Economies-Stats");
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
    		id: create_default_slot_34$1.name,
    		type: "slot",
    		source: "(206:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (208:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_33$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_33$1.name,
    		type: "slot",
    		source: "(208:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (210:6) <DropdownItem href="./api/v1/expo-stats">
    function create_default_slot_32$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_32$1.name,
    		type: "slot",
    		source: "(210:6) <DropdownItem href=\\\"./api/v1/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:4) <DropdownMenu end>
    function create_default_slot_31$1(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_34$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_33$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo-stats",
    				$$slots: { default: [create_default_slot_32$1] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31$1.name,
    		type: "slot",
    		source: "(205:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (203:3) <Dropdown >
    function create_default_slot_30$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_35$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_31$1] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
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
    		id: create_default_slot_30$1.name,
    		type: "slot",
    		source: "(203:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (215:4) <DropdownToggle nav caret>
    function create_default_slot_29$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_29$1.name,
    		type: "slot",
    		source: "(215:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (217:6) <DropdownItem href="./#/economies">
    function create_default_slot_28$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_28$1.name,
    		type: "slot",
    		source: "(217:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (218:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_27$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT-END");
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
    		id: create_default_slot_27$2.name,
    		type: "slot",
    		source: "(218:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:6) <DropdownItem href="#/graphics/azar-games-and-bet-activities">
    function create_default_slot_26$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actividad en loteria");
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
    		id: create_default_slot_26$2.name,
    		type: "slot",
    		source: "(219:6) <DropdownItem href=\\\"#/graphics/azar-games-and-bet-activities\\\">",
    		ctx
    	});

    	return block;
    }

    // (221:6) <DropdownItem href="#/graph">
    function create_default_slot_25$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_25$2.name,
    		type: "slot",
    		source: "(221:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (216:4) <DropdownMenu end>
    function create_default_slot_24$2(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_28$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_27$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphics/azar-games-and-bet-activities",
    				$$slots: { default: [create_default_slot_26$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_25$2] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$2.name,
    		type: "slot",
    		source: "(216:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (214:12) <Dropdown>
    function create_default_slot_23$2(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_29$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_24$2] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
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
    		id: create_default_slot_23$2.name,
    		type: "slot",
    		source: "(214:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (226:4) <DropdownToggle nav caret>
    function create_default_slot_22$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_22$3.name,
    		type: "slot",
    		source: "(226:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (228:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_21$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_21$4.name,
    		type: "slot",
    		source: "(228:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (229:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_20$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_20$4.name,
    		type: "slot",
    		source: "(229:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (230:6) <DropdownItem href="#/graphics/azar-games-and-bet-activities">
    function create_default_slot_19$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actividad en loteria");
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
    		id: create_default_slot_19$4.name,
    		type: "slot",
    		source: "(230:6) <DropdownItem href=\\\"#/graphics/azar-games-and-bet-activities\\\">",
    		ctx
    	});

    	return block;
    }

    // (232:6) <DropdownItem href="#/graph">
    function create_default_slot_18$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_18$4.name,
    		type: "slot",
    		source: "(232:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (227:4) <DropdownMenu end>
    function create_default_slot_17$4(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_21$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_20$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphics/azar-games-and-bet-activities",
    				$$slots: { default: [create_default_slot_19$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_18$4] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$4.name,
    		type: "slot",
    		source: "(227:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (225:5) <Dropdown >
    function create_default_slot_16$4(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_22$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_17$4] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
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
    		id: create_default_slot_16$4.name,
    		type: "slot",
    		source: "(225:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (202:2) <Nav navbar>
    function create_default_slot_15$4(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_30$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_23$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_16$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$4.name,
    		type: "slot",
    		source: "(202:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (200:1) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot_14$4(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_36$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_15$4] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
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
    		id: create_default_slot_14$4.name,
    		type: "slot",
    		source: "(200:1) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    // (243:2) {#if msg}
    function create_if_block_1$1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msg*/ ctx[4]);
    			add_location(p, file$7, 243, 3, 7672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msg*/ 16) set_data_dev(t1, /*msg*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(243:2) {#if msg}",
    		ctx
    	});

    	return block;
    }

    // (242:1) <Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
    function create_default_slot_13$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[4] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msg*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$4.name,
    		type: "slot",
    		source: "(242:1) <Alert color=\\\"danger\\\" isOpen={visibleError} toggle={() => (visibleError = false)}>",
    		ctx
    	});

    	return block;
    }

    // (248:2) {#if msg}
    function create_if_block$3(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Correcto: ");
    			t1 = text(/*msg*/ ctx[4]);
    			add_location(p, file$7, 248, 3, 7814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*msg*/ 16) set_data_dev(t1, /*msg*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(248:2) {#if msg}",
    		ctx
    	});

    	return block;
    }

    // (247:1) <Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
    function create_default_slot_12$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msg*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$4.name,
    		type: "slot",
    		source: "(247:1) <Alert color=\\\"success\\\" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>",
    		ctx
    	});

    	return block;
    }

    // (252:1) <Button on:click="{getPgAnt}">
    function create_default_slot_11$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Anterior");
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
    		id: create_default_slot_11$4.name,
    		type: "slot",
    		source: "(252:1) <Button on:click=\\\"{getPgAnt}\\\">",
    		ctx
    	});

    	return block;
    }

    // (255:1) <Button on:click="{getPgSig}">
    function create_default_slot_10$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Siguiente");
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
    		id: create_default_slot_10$4.name,
    		type: "slot",
    		source: "(255:1) <Button on:click=\\\"{getPgSig}\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {onMount}
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (260:1) {:then economies}
    function create_then_block$3(ctx) {
    	let table0;
    	let t;
    	let table1;
    	let current;

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table0.$$.fragment);
    			t = space();
    			create_component(table1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, visibleError, visibleMsg, msg*/ 31 | dirty[1] & /*$$scope*/ 16) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*economies, neweconomies*/ 96 | dirty[1] & /*$$scope*/ 16) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(260:1) {:then economies}",
    		ctx
    	});

    	return block;
    }

    // (274:31) <Button outline color="dark" on:click="{()=>{                  if (from == null || to == null) {                      //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       visibleError = true;       visibleMsg = false;       msg = "Los campos fecha inicio y fecha fin no pueden estar vacíos";                  }else{                      getEconomies();                  }              }}">
    function create_default_slot_9$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
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
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(274:31) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{                  if (from == null || to == null) {                      //window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')       visibleError = true;       visibleMsg = false;       msg = \\\"Los campos fecha inicio y fecha fin no pueden estar vacíos\\\";                  }else{                      getEconomies();                  }              }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (287:31) <Button outline color="info" on:click="{()=>{                  from = null;                  to = null;                  getEconomies();                                }}">
    function create_default_slot_8$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
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
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(287:31) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{                  from = null;                  to = null;                  getEconomies();                                }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (261:1) <Table bordered>
    function create_default_slot_7$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_9$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[18]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[19]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha de inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$7, 263, 16, 8110);
    			add_location(th1, file$7, 264, 16, 8152);
    			add_location(tr0, file$7, 262, 12, 8088);
    			add_location(thead, file$7, 261, 8, 8067);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			add_location(input0, file$7, 271, 16, 8268);
    			add_location(td0, file$7, 271, 12, 8264);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			add_location(input1, file$7, 272, 16, 8340);
    			add_location(td1, file$7, 272, 12, 8336);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$7, 273, 12, 8406);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$7, 286, 12, 8928);
    			add_location(tr1, file$7, 270, 8, 8246);
    			add_location(tbody, file$7, 267, 8, 8217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[0]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[1]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 1 && to_number(input0.value) !== /*from*/ ctx[0]) {
    				set_input_value(input0, /*from*/ ctx[0]);
    			}

    			if (dirty[0] & /*to*/ 2 && to_number(input1.value) !== /*to*/ ctx[1]) {
    				set_input_value(input1, /*to*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(261:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (317:23) <Button outline color="primary" on:click="{insertEconomies}">
    function create_default_slot_6$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
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
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(317:23) <Button outline color=\\\"primary\\\" on:click=\\\"{insertEconomies}\\\">",
    		ctx
    	});

    	return block;
    }

    // (322:23) <Button outline color="primary" on:click="{()=>{       neweconomies.country = null;       neweconomies.year = null;       neweconomies.percapita = null;       neweconomies.currency = null;       neweconomies.currentprices = null;      }}">
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar");
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
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(322:23) <Button outline color=\\\"primary\\\" on:click=\\\"{()=>{       neweconomies.country = null;       neweconomies.year = null;       neweconomies.percapita = null;       neweconomies.currency = null;       neweconomies.currentprices = null;      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (343:23) <Button outline color="warning" on:click={function (){       window.location.href = `/#/economies/${cd.country+"/"+cd.year}`      }}>
    function create_default_slot_4$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(343:23) <Button outline color=\\\"warning\\\" on:click={function (){       window.location.href = `/#/economies/${cd.country+\\\"/\\\"+cd.year}`      }}>",
    		ctx
    	});

    	return block;
    }

    // (348:23) <Button outline color="danger" on:click={BorrarEconomies(cd.country,cd.year)}>
    function create_default_slot_3$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
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
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(348:23) <Button outline color=\\\"danger\\\" on:click={BorrarEconomies(cd.country,cd.year)}>",
    		ctx
    	});

    	return block;
    }

    // (335:3) {#each economies as cd}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*cd*/ ctx[32].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*cd*/ ctx[32].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*cd*/ ctx[32].percapita + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*cd*/ ctx[32].currency + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*cd*/ ctx[32].currentprices + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[26](/*cd*/ ctx[32]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_3);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*BorrarEconomies*/ ctx[11](/*cd*/ ctx[32].country, /*cd*/ ctx[32].year))) /*BorrarEconomies*/ ctx[11](/*cd*/ ctx[32].country, /*cd*/ ctx[32].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(td0, file$7, 336, 4, 10331);
    			add_location(td1, file$7, 337, 4, 10358);
    			add_location(td2, file$7, 338, 16, 10394);
    			add_location(td3, file$7, 339, 16, 10435);
    			add_location(td4, file$7, 340, 16, 10475);
    			attr_dev(td5, "align", "center");
    			add_location(td5, file$7, 342, 4, 10510);
    			attr_dev(td6, "align", "center");
    			add_location(td6, file$7, 347, 4, 10696);
    			add_location(tr, file$7, 335, 3, 10321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(td5, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*economies*/ 64) && t0_value !== (t0_value = /*cd*/ ctx[32].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*economies*/ 64) && t2_value !== (t2_value = /*cd*/ ctx[32].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*economies*/ 64) && t4_value !== (t4_value = /*cd*/ ctx[32].percapita + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*economies*/ 64) && t6_value !== (t6_value = /*cd*/ ctx[32].currency + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*economies*/ 64) && t8_value !== (t8_value = /*cd*/ ctx[32].currentprices + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(335:3) {#each economies as cd}",
    		ctx
    	});

    	return block;
    }

    // (355:8) <Button outline color="success" on:click={LoadEconomies}>
    function create_default_slot_2$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
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
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(355:8) <Button outline color=\\\"success\\\" on:click={LoadEconomies}>",
    		ctx
    	});

    	return block;
    }

    // (358:8) <Button outline color="danger" on:click={BorrarEconomiesAll}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(358:8) <Button outline color=\\\"danger\\\" on:click={BorrarEconomiesAll}>",
    		ctx
    	});

    	return block;
    }

    // (299:1) <Table bordered>
    function create_default_slot$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t10;
    	let td1;
    	let input1;
    	let t11;
    	let td2;
    	let input2;
    	let t12;
    	let td3;
    	let input3;
    	let t13;
    	let td4;
    	let input4;
    	let t14;
    	let td5;
    	let button0;
    	let t15;
    	let td6;
    	let button1;
    	let t16;
    	let t17;
    	let tr2;
    	let td7;
    	let button2;
    	let t18;
    	let td8;
    	let button3;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertEconomies*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_2*/ ctx[25]);
    	let each_value = /*economies*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*LoadEconomies*/ ctx[13]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*BorrarEconomiesAll*/ ctx[12]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "percapita";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "currency";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "currentprices";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t10 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t11 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t12 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t13 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t14 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t15 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			tr2 = element("tr");
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			t18 = space();
    			td8 = element("td");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$7, 301, 4, 9291);
    			add_location(th1, file$7, 302, 4, 9310);
    			add_location(th2, file$7, 303, 16, 9340);
    			add_location(th3, file$7, 304, 16, 9376);
    			add_location(th4, file$7, 305, 16, 9411);
    			add_location(tr0, file$7, 300, 3, 9281);
    			add_location(thead, file$7, 299, 2, 9269);
    			add_location(input0, file$7, 310, 8, 9485);
    			add_location(td0, file$7, 310, 4, 9481);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$7, 311, 8, 9543);
    			add_location(td1, file$7, 311, 4, 9539);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$7, 312, 8, 9612);
    			add_location(td2, file$7, 312, 4, 9608);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$7, 313, 8, 9686);
    			add_location(td3, file$7, 313, 4, 9682);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$7, 314, 8, 9759);
    			add_location(td4, file$7, 314, 4, 9755);
    			attr_dev(td5, "align", "center");
    			add_location(td5, file$7, 316, 4, 9835);
    			attr_dev(td6, "align", "center");
    			add_location(td6, file$7, 321, 4, 9968);
    			add_location(tr1, file$7, 309, 3, 9471);
    			add_location(td7, file$7, 354, 4, 10869);
    			add_location(td8, file$7, 357, 4, 10975);
    			add_location(tr2, file$7, 353, 3, 10859);
    			add_location(tbody, file$7, 308, 2, 9459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*neweconomies*/ ctx[5].country);
    			append_dev(tr1, t10);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*neweconomies*/ ctx[5].year);
    			append_dev(tr1, t11);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*neweconomies*/ ctx[5].percapita);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*neweconomies*/ ctx[5].currency);
    			append_dev(tr1, t13);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*neweconomies*/ ctx[5].currentprices);
    			append_dev(tr1, t14);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td6);
    			mount_component(button1, td6, null);
    			append_dev(tbody, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tr2, t18);
    			append_dev(tr2, td8);
    			mount_component(button3, td8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[20]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[21]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[22]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[23]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[24])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*neweconomies*/ 32 && input0.value !== /*neweconomies*/ ctx[5].country) {
    				set_input_value(input0, /*neweconomies*/ ctx[5].country);
    			}

    			if (dirty[0] & /*neweconomies*/ 32 && to_number(input1.value) !== /*neweconomies*/ ctx[5].year) {
    				set_input_value(input1, /*neweconomies*/ ctx[5].year);
    			}

    			if (dirty[0] & /*neweconomies*/ 32 && to_number(input2.value) !== /*neweconomies*/ ctx[5].percapita) {
    				set_input_value(input2, /*neweconomies*/ ctx[5].percapita);
    			}

    			if (dirty[0] & /*neweconomies*/ 32 && to_number(input3.value) !== /*neweconomies*/ ctx[5].currency) {
    				set_input_value(input3, /*neweconomies*/ ctx[5].currency);
    			}

    			if (dirty[0] & /*neweconomies*/ 32 && to_number(input4.value) !== /*neweconomies*/ ctx[5].currentprices) {
    				set_input_value(input4, /*neweconomies*/ ctx[5].currentprices);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*BorrarEconomies, economies*/ 2112) {
    				each_value = /*economies*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(299:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (258:22)   loading   {:then economies}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(258:22)   loading   {:then economies}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let h1;
    	let t2;
    	let alert0;
    	let t3;
    	let alert1;
    	let t4;
    	let button0;
    	let t5;
    	let button1;
    	let t6;
    	let promise;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot_14$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert0 = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visibleError*/ ctx[2],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_13$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert1 = new Alert({
    			props: {
    				color: "success",
    				isOpen: /*visibleMsg*/ ctx[3],
    				toggle: /*func_1*/ ctx[15],
    				$$slots: { default: [create_default_slot_12$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getPgAnt*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_10$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getPgSig*/ ctx[9]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*economies*/ ctx[6], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Economia Mundial";
    			t2 = space();
    			create_component(alert0.$$.fragment);
    			t3 = space();
    			create_component(alert1.$$.fragment);
    			t4 = space();
    			create_component(button0.$$.fragment);
    			t5 = space();
    			create_component(button1.$$.fragment);
    			t6 = space();
    			info.block.c();
    			add_location(h1, file$7, 240, 4, 7544);
    			add_location(main, file$7, 197, 0, 5779);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			mount_component(alert0, main, null);
    			append_dev(main, t3);
    			mount_component(alert1, main, null);
    			append_dev(main, t4);
    			mount_component(button0, main, null);
    			append_dev(main, t5);
    			mount_component(button1, main, null);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const navbar_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    			const alert0_changes = {};
    			if (dirty[0] & /*visibleError*/ 4) alert0_changes.isOpen = /*visibleError*/ ctx[2];
    			if (dirty[0] & /*visibleError*/ 4) alert0_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*msg*/ 16 | dirty[1] & /*$$scope*/ 16) {
    				alert0_changes.$$scope = { dirty, ctx };
    			}

    			alert0.$set(alert0_changes);
    			const alert1_changes = {};
    			if (dirty[0] & /*visibleMsg*/ 8) alert1_changes.isOpen = /*visibleMsg*/ ctx[3];
    			if (dirty[0] & /*visibleMsg*/ 8) alert1_changes.toggle = /*func_1*/ ctx[15];

    			if (dirty[0] & /*msg*/ 16 | dirty[1] & /*$$scope*/ 16) {
    				alert1_changes.$$scope = { dirty, ctx };
    			}

    			alert1.$set(alert1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			info.ctx = ctx;

    			if (dirty[0] & /*economies*/ 64 && promise !== (promise = /*economies*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(alert0.$$.fragment, local);
    			transition_in(alert1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(alert0.$$.fragment, local);
    			transition_out(alert1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(alert0);
    			destroy_component(alert1);
    			destroy_component(button0);
    			destroy_component(button1);
    			info.block.d();
    			info.token = null;
    			info = null;
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Economies', slots, []);
    	let economies = [];
    	let datos2 = [];
    	let offset = 0;
    	let limit = 10;
    	let numEntries;
    	let from = null;
    	let to = null;
    	let visibleError = false;
    	let visibleMsg = false;
    	let errorMsg = "";
    	let msg = "";

    	let neweconomies = {
    		country: "",
    		year: "",
    		percapita: "",
    		currency: "",
    		currentprices: ""
    	};

    	onMount(getEconomies);

    	async function getEconomies() {
    		console.log("fetching economies ....");
    		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			datos2 = data;

    			$$invalidate(6, economies = datos2.sort(function (a, b) {
    				return a.year - b.year;
    			}));

    			numEntries = economies.length;
    			console.log("Received economies: " + economies.length);
    		} else {
    			$$invalidate(2, visibleError = true);
    			$$invalidate(3, visibleMsg = false);
    			$$invalidate(4, msg = "No hay ningún dato entre " + from + " y " + to);
    		} //window.alert("No hay ningún dato entre estos límites")
    	}

    	async function getPgAnt() {
    		if (offset >= 10) {
    			offset = offset - 10;
    		}

    		//limit=limit+10;
    		console.log("fetching economies ....");

    		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			datos2 = data;

    			$$invalidate(6, economies = datos2.sort(function (a, b) {
    				return a.year - b.year;
    			}));

    			console.log("Received economies: " + economies.length);
    		}
    	}

    	async function getPgSig() {
    		if (economies.length >= 10) {
    			offset = offset + 10;
    		}

    		//limit=limit+10;
    		console.log("fetching economies ....");

    		let cadena = `/api/v2/economies?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			datos2 = data;

    			$$invalidate(6, economies = datos2.sort(function (a, b) {
    				return a.year - b.year;
    			}));

    			console.log("Received economies: " + economies.length);
    		}
    	}

    	async function insertEconomies() {
    		if (neweconomies.country == "" || neweconomies.country == null || neweconomies.year == "" || neweconomies.year == null || neweconomies.percapita == "" || neweconomies.percapita == null || neweconomies.currency == "" || neweconomies.currency == null || neweconomies.currentprices == "" || neweconomies.currentprices == null) {
    			$$invalidate(2, visibleError = true);
    			$$invalidate(3, visibleMsg = false);
    			$$invalidate(4, msg = "Debe de rellenar todos los campos");
    		} else {
    			console.log("Inserting economies...." + JSON.stringify(neweconomies));

    			await fetch("/api/v2/economies", {
    				method: "POST",
    				body: JSON.stringify(neweconomies),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				if (res.status == 201) {
    					getEconomies();
    					$$invalidate(5, neweconomies.country = null, neweconomies);
    					$$invalidate(5, neweconomies.year = null, neweconomies);
    					$$invalidate(5, neweconomies.percapita = null, neweconomies);
    					$$invalidate(5, neweconomies.currency = null, neweconomies);
    					$$invalidate(5, neweconomies.currentprices = null, neweconomies);
    					$$invalidate(2, visibleError = false);
    					$$invalidate(3, visibleMsg = true);
    					$$invalidate(4, msg = "Entrada introducida con éxito");
    				} else if (res.status == 409) {
    					$$invalidate(2, visibleError = true);
    					$$invalidate(3, visibleMsg = false);
    					$$invalidate(4, msg = "Ya existe ese recurso en la base de datos");
    					console.log("ERROR There is already a data with that country and year in the database");
    				}
    			});
    		}
    	}

    	async function BorrarEconomies(name, year) {
    		await fetch("/api/v2/economies/" + name + "/" + year, { method: "DELETE" }).then(function (res) {
    			getEconomies();

    			if (res.status == 200) {
    				console.log("Deleted " + name);

    				//window.alert(name + " elimida con éxito"); 
    				$$invalidate(2, visibleError = false);

    				$$invalidate(3, visibleMsg = true);
    				$$invalidate(4, msg = name + " elimida con éxito");
    			} else {
    				//window.alert(name + " no se ha podida eliminar");
    				$$invalidate(2, visibleError = true);

    				$$invalidate(3, visibleMsg = flase);
    				$$invalidate(4, msg = name + " no se ha podida eliminar");
    				console.log("DATA NOT FOUND");
    			}
    		});
    	}

    	async function BorrarEconomiesAll() {
    		console.log("Deleting economies....");

    		await fetch("/api/v2/economies/", { method: "DELETE" }).then(function (res) {
    			getEconomies();

    			//window.alert("Entradas elimidas con éxito");
    			$$invalidate(2, visibleError = false);

    			$$invalidate(3, visibleMsg = true);
    			$$invalidate(4, msg = "Entradas elimidas con éxito");
    		});
    	}

    	async function LoadEconomies() {
    		console.log("Loading economies....");

    		await fetch("/api/v2/economies/loadInitialData", { method: "GET" }).then(function (res) {
    			getEconomies();

    			//window.alert("Entradas cargadas con éxito");
    			$$invalidate(2, visibleError = false);

    			$$invalidate(3, visibleMsg = true);
    			$$invalidate(4, msg = "Entradas cargadas con éxito");
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Economies> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, visibleError = false);
    	const func_1 = () => $$invalidate(3, visibleMsg = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(0, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(1, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			//window.alert('Los campos fecha inicio y fecha fin no pueden estar vacíos')
    			$$invalidate(2, visibleError = true);

    			$$invalidate(3, visibleMsg = false);
    			$$invalidate(4, msg = "Los campos fecha inicio y fecha fin no pueden estar vacíos");
    		} else {
    			getEconomies();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, from = null);
    		$$invalidate(1, to = null);
    		getEconomies();
    	};

    	function input0_input_handler_1() {
    		neweconomies.country = this.value;
    		$$invalidate(5, neweconomies);
    	}

    	function input1_input_handler_1() {
    		neweconomies.year = to_number(this.value);
    		$$invalidate(5, neweconomies);
    	}

    	function input2_input_handler() {
    		neweconomies.percapita = to_number(this.value);
    		$$invalidate(5, neweconomies);
    	}

    	function input3_input_handler() {
    		neweconomies.currency = to_number(this.value);
    		$$invalidate(5, neweconomies);
    	}

    	function input4_input_handler() {
    		neweconomies.currentprices = to_number(this.value);
    		$$invalidate(5, neweconomies);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(5, neweconomies.country = null, neweconomies);
    		$$invalidate(5, neweconomies.year = null, neweconomies);
    		$$invalidate(5, neweconomies.percapita = null, neweconomies);
    		$$invalidate(5, neweconomies.currency = null, neweconomies);
    		$$invalidate(5, neweconomies.currentprices = null, neweconomies);
    	};

    	const click_handler_3 = function (cd) {
    		window.location.href = `/#/economies/${cd.country + "/" + cd.year}`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		economies,
    		datos2,
    		offset,
    		limit,
    		numEntries,
    		from,
    		to,
    		visibleError,
    		visibleMsg,
    		errorMsg,
    		msg,
    		neweconomies,
    		getEconomies,
    		getPgAnt,
    		getPgSig,
    		insertEconomies,
    		BorrarEconomies,
    		BorrarEconomiesAll,
    		LoadEconomies
    	});

    	$$self.$inject_state = $$props => {
    		if ('economies' in $$props) $$invalidate(6, economies = $$props.economies);
    		if ('datos2' in $$props) datos2 = $$props.datos2;
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    		if ('from' in $$props) $$invalidate(0, from = $$props.from);
    		if ('to' in $$props) $$invalidate(1, to = $$props.to);
    		if ('visibleError' in $$props) $$invalidate(2, visibleError = $$props.visibleError);
    		if ('visibleMsg' in $$props) $$invalidate(3, visibleMsg = $$props.visibleMsg);
    		if ('errorMsg' in $$props) errorMsg = $$props.errorMsg;
    		if ('msg' in $$props) $$invalidate(4, msg = $$props.msg);
    		if ('neweconomies' in $$props) $$invalidate(5, neweconomies = $$props.neweconomies);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		from,
    		to,
    		visibleError,
    		visibleMsg,
    		msg,
    		neweconomies,
    		economies,
    		getEconomies,
    		getPgAnt,
    		getPgSig,
    		insertEconomies,
    		BorrarEconomies,
    		BorrarEconomiesAll,
    		LoadEconomies,
    		func,
    		func_1,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Economies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Economies",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\front\frontEconomies\EditEconomies.svelte generated by Svelte v3.47.0 */

    const { console: console_1$5 } = globals;
    const file$6 = "src\\front\\frontEconomies\\EditEconomies.svelte";

    // (96:2) {#if msg}
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*msg*/ ctx[3]);
    			add_location(p, file$6, 96, 3, 2643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msg*/ 8) set_data_dev(t1, /*msg*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(96:2) {#if msg}",
    		ctx
    	});

    	return block;
    }

    // (95:4) <Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
    function create_default_slot_4$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[3] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msg*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(95:4) <Alert color=\\\"danger\\\" isOpen={visibleError} toggle={() => (visibleError = false)}>",
    		ctx
    	});

    	return block;
    }

    // (101:2) {#if msg}
    function create_if_block$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Correcto: ");
    			t1 = text(/*msg*/ ctx[3]);
    			add_location(p, file$6, 101, 3, 2785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*msg*/ 8) set_data_dev(t1, /*msg*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(101:2) {#if msg}",
    		ctx
    	});

    	return block;
    }

    // (100:1) <Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
    function create_default_slot_3$4(ctx) {
    	let if_block_anchor;
    	let if_block = /*msg*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*msg*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(100:1) <Alert color=\\\"success\\\" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>        export let params={}
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>        export let params={}",
    		ctx
    	});

    	return block;
    }

    // (107:8) {:then economies}
    function create_then_block$2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedcurrentprices, updatedcurrency, updatedpercapita, params*/ 262257) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(107:8) {:then economies}",
    		ctx
    	});

    	return block;
    }

    // (127:24) <Button outline color="primary" on:click="{EditEconomies}">
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(127:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditEconomies}\\\">",
    		ctx
    	});

    	return block;
    }

    // (109:8) <Table bordered>
    function create_default_slot_1$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let t10_value = /*params*/ ctx[0].country + "";
    	let t10;
    	let t11;
    	let td1;
    	let t12_value = /*params*/ ctx[0].year + "";
    	let t12;
    	let t13;
    	let td2;
    	let input0;
    	let t14;
    	let td3;
    	let input1;
    	let t15;
    	let td4;
    	let input2;
    	let t16;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditEconomies*/ ctx[8]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "percapita";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "currency";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "currentprices";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td1 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$6, 111, 20, 2988);
    			add_location(th1, file$6, 112, 20, 3023);
    			add_location(th2, file$6, 113, 20, 3057);
    			add_location(th3, file$6, 114, 20, 3097);
    			add_location(th4, file$6, 115, 20, 3136);
    			add_location(tr0, file$6, 110, 16, 2962);
    			add_location(thead, file$6, 109, 12, 2937);
    			add_location(td0, file$6, 120, 20, 3268);
    			add_location(td1, file$6, 121, 20, 3315);
    			add_location(input0, file$6, 122, 24, 3363);
    			add_location(td2, file$6, 122, 20, 3359);
    			add_location(input1, file$6, 123, 24, 3433);
    			add_location(td3, file$6, 123, 20, 3429);
    			add_location(input2, file$6, 124, 24, 3502);
    			add_location(td4, file$6, 124, 20, 3498);
    			add_location(td5, file$6, 126, 20, 3578);
    			add_location(tr1, file$6, 119, 16, 3242);
    			add_location(tbody, file$6, 118, 12, 3217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t10);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedpercapita*/ ctx[4]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedcurrency*/ ctx[5]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedcurrentprices*/ ctx[6]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t10_value !== (t10_value = /*params*/ ctx[0].country + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].year + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*updatedpercapita*/ 16 && input0.value !== /*updatedpercapita*/ ctx[4]) {
    				set_input_value(input0, /*updatedpercapita*/ ctx[4]);
    			}

    			if (dirty & /*updatedcurrency*/ 32 && input1.value !== /*updatedcurrency*/ ctx[5]) {
    				set_input_value(input1, /*updatedcurrency*/ ctx[5]);
    			}

    			if (dirty & /*updatedcurrentprices*/ 64 && input2.value !== /*updatedcurrentprices*/ ctx[6]) {
    				set_input_value(input2, /*updatedcurrentprices*/ ctx[6]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
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
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(109:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (105:22)       loading          {:then economies}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(105:22)       loading          {:then economies}",
    		ctx
    	});

    	return block;
    }

    // (136:4) <Button outline color="secondary" on:click= "{pop}">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(136:4) <Button outline color=\\\"secondary\\\" on:click= \\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1_value = /*params*/ ctx[0].country + "";
    	let t1;
    	let t2;
    	let t3;
    	let alert0;
    	let t4;
    	let alert1;
    	let t5;
    	let promise;
    	let t6;
    	let button;
    	let current;

    	alert0 = new Alert({
    			props: {
    				color: "danger",
    				isOpen: /*visibleError*/ ctx[1],
    				toggle: /*func*/ ctx[9],
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert1 = new Alert({
    			props: {
    				color: "success",
    				isOpen: /*visibleMsg*/ ctx[2],
    				toggle: /*func_1*/ ctx[10],
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*economies*/ ctx[7], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Editar \"");
    			t1 = text(t1_value);
    			t2 = text("\"");
    			t3 = space();
    			create_component(alert0.$$.fragment);
    			t4 = space();
    			create_component(alert1.$$.fragment);
    			t5 = space();
    			info.block.c();
    			t6 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$6, 93, 4, 2501);
    			add_location(main, file$6, 92, 0, 2489);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			mount_component(alert0, main, null);
    			append_dev(main, t4);
    			mount_component(alert1, main, null);
    			append_dev(main, t5);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t6;
    			append_dev(main, t6);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			const alert0_changes = {};
    			if (dirty & /*visibleError*/ 2) alert0_changes.isOpen = /*visibleError*/ ctx[1];
    			if (dirty & /*visibleError*/ 2) alert0_changes.toggle = /*func*/ ctx[9];

    			if (dirty & /*$$scope, msg*/ 262152) {
    				alert0_changes.$$scope = { dirty, ctx };
    			}

    			alert0.$set(alert0_changes);
    			const alert1_changes = {};
    			if (dirty & /*visibleMsg*/ 4) alert1_changes.isOpen = /*visibleMsg*/ ctx[2];
    			if (dirty & /*visibleMsg*/ 4) alert1_changes.toggle = /*func_1*/ ctx[10];

    			if (dirty & /*$$scope, msg*/ 262152) {
    				alert1_changes.$$scope = { dirty, ctx };
    			}

    			alert1.$set(alert1_changes);
    			info.ctx = ctx;

    			if (dirty & /*economies*/ 128 && promise !== (promise = /*economies*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert0.$$.fragment, local);
    			transition_in(alert1.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert0.$$.fragment, local);
    			transition_out(alert1.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(alert0);
    			destroy_component(alert1);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
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

    async function Fallos$1(code, entrada) {
    	let msg;

    	if (code == 404) {
    		msg = "No se encuentra " + entrada;
    	}

    	if (code == 400) {
    		msg = "solicitud incorrecta";
    	}

    	if (code == 409) {
    		msg = "El dato introducido ya existe";
    	}

    	if (code == 401) {
    		msg = "No autorizado";
    	}

    	if (code == 405) {
    		msg = "Método no permitido";
    	}

    	window.alert(msg);
    	return;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditEconomies', slots, []);
    	let { params = {} } = $$props;
    	let visibleError = false;
    	let visibleMsg = false;
    	let errorMsg = "";
    	let msg = "";
    	let economies = {};
    	let updatedCountry;
    	let updatedYear;
    	let updatedpercapita;
    	let updatedcurrency;
    	let updatedcurrentprices;
    	onMount(getEconomies);

    	async function getEconomies() {
    		console.log("fetching Economies ...." + params.country + " " + params.year);
    		const res = await fetch("/api/v2/economies/" + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(7, economies = data);
    			updatedCountry = economies.country;
    			updatedYear = economies.year;
    			$$invalidate(4, updatedpercapita = economies.percapita);
    			$$invalidate(5, updatedcurrency = economies.currency);
    			$$invalidate(6, updatedcurrentprices = economies.currentprices);
    		} else {
    			Fallos$1(res.status, params.country);
    			pop();
    		}
    	}

    	async function EditEconomies() {
    		console.log("Updating economies...." + params.country + " " + params.year);

    		await fetch("/api/v2/economies/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: updatedYear,
    				percapita: updatedpercapita,
    				currency: updatedcurrency,
    				currentprices: updatedcurrentprices
    			}),
    			headers: { "Content-Type": "application/json" }
    		});

    		$$invalidate(1, visibleError = false);
    		$$invalidate(2, visibleMsg = true);
    		$$invalidate(3, msg = updatedCountry + " se ha editado correctamente");
    	} //window.alert("Se ha editado correctamente");

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<EditEconomies> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(1, visibleError = false);
    	const func_1 = () => $$invalidate(2, visibleMsg = false);

    	function input0_input_handler() {
    		updatedpercapita = this.value;
    		$$invalidate(4, updatedpercapita);
    	}

    	function input1_input_handler() {
    		updatedcurrency = this.value;
    		$$invalidate(5, updatedcurrency);
    	}

    	function input2_input_handler() {
    		updatedcurrentprices = this.value;
    		$$invalidate(6, updatedcurrentprices);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		visibleError,
    		visibleMsg,
    		errorMsg,
    		msg,
    		economies,
    		updatedCountry,
    		updatedYear,
    		updatedpercapita,
    		updatedcurrency,
    		updatedcurrentprices,
    		getEconomies,
    		EditEconomies,
    		Fallos: Fallos$1
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('visibleError' in $$props) $$invalidate(1, visibleError = $$props.visibleError);
    		if ('visibleMsg' in $$props) $$invalidate(2, visibleMsg = $$props.visibleMsg);
    		if ('errorMsg' in $$props) errorMsg = $$props.errorMsg;
    		if ('msg' in $$props) $$invalidate(3, msg = $$props.msg);
    		if ('economies' in $$props) $$invalidate(7, economies = $$props.economies);
    		if ('updatedCountry' in $$props) updatedCountry = $$props.updatedCountry;
    		if ('updatedYear' in $$props) updatedYear = $$props.updatedYear;
    		if ('updatedpercapita' in $$props) $$invalidate(4, updatedpercapita = $$props.updatedpercapita);
    		if ('updatedcurrency' in $$props) $$invalidate(5, updatedcurrency = $$props.updatedcurrency);
    		if ('updatedcurrentprices' in $$props) $$invalidate(6, updatedcurrentprices = $$props.updatedcurrentprices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		visibleError,
    		visibleMsg,
    		msg,
    		updatedpercapita,
    		updatedcurrency,
    		updatedcurrentprices,
    		economies,
    		EditEconomies,
    		func,
    		func_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditEconomies_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditEconomies_1",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get params() {
    		throw new Error("<EditEconomies>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditEconomies>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\frontEconomies\MyGraphEconomies.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;

    const file$5 = "src\\front\\frontEconomies\\MyGraphEconomies.svelte";

    // (135:2) <NavbarBrand href="#/info">
    function create_default_slot_22$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_22$2.name,
    		type: "slot",
    		source: "(135:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (138:4) <DropdownToggle nav caret>
    function create_default_slot_21$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_21$3.name,
    		type: "slot",
    		source: "(138:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (140:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_20$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_20$3.name,
    		type: "slot",
    		source: "(140:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_19$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_19$3.name,
    		type: "slot",
    		source: "(142:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (144:6) <DropdownItem href="./api/v1/expo-stats">
    function create_default_slot_18$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_18$3.name,
    		type: "slot",
    		source: "(144:6) <DropdownItem href=\\\"./api/v1/expo-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (139:4) <DropdownMenu end>
    function create_default_slot_17$3(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_20$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_19$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo-stats",
    				$$slots: { default: [create_default_slot_18$3] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$3.name,
    		type: "slot",
    		source: "(139:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (137:3) <Dropdown >
    function create_default_slot_16$3(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_21$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_17$3] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_16$3.name,
    		type: "slot",
    		source: "(137:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (149:4) <DropdownToggle nav caret>
    function create_default_slot_15$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_15$3.name,
    		type: "slot",
    		source: "(149:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (151:6) <DropdownItem href="./#/economies">
    function create_default_slot_14$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_14$3.name,
    		type: "slot",
    		source: "(151:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (152:6) <DropdownItem href="#/graphics/line/province-budget-and-investment-in-social-promotion">
    function create_default_slot_13$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Inversion promoción social");
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
    		id: create_default_slot_13$3.name,
    		type: "slot",
    		source: "(152:6) <DropdownItem href=\\\"#/graphics/line/province-budget-and-investment-in-social-promotion\\\">",
    		ctx
    	});

    	return block;
    }

    // (153:6) <DropdownItem href="#/graphics/azar-games-and-bet-activities">
    function create_default_slot_12$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actividad en loteria");
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
    		id: create_default_slot_12$3.name,
    		type: "slot",
    		source: "(153:6) <DropdownItem href=\\\"#/graphics/azar-games-and-bet-activities\\\">",
    		ctx
    	});

    	return block;
    }

    // (155:6) <DropdownItem href="#/graph">
    function create_default_slot_11$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_11$3.name,
    		type: "slot",
    		source: "(155:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (150:4) <DropdownMenu end>
    function create_default_slot_10$3(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_14$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "#/graphics/line/province-budget-and-investment-in-social-promotion",
    				$$slots: { default: [create_default_slot_13$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphics/azar-games-and-bet-activities",
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_11$3] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(150:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (148:12) <Dropdown>
    function create_default_slot_9$3(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_15$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_10$3] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(148:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (160:4) <DropdownToggle nav caret>
    function create_default_slot_8$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(160:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (162:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(162:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (163:6) <DropdownItem href="#/graphics/line/province-budget-and-investment-in-social-promotion">
    function create_default_slot_6$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Inversion promoción social");
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
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(163:6) <DropdownItem href=\\\"#/graphics/line/province-budget-and-investment-in-social-promotion\\\">",
    		ctx
    	});

    	return block;
    }

    // (164:6) <DropdownItem href="#/graphics/azar-games-and-bet-activities">
    function create_default_slot_5$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actividad en loteria");
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
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(164:6) <DropdownItem href=\\\"#/graphics/azar-games-and-bet-activities\\\">",
    		ctx
    	});

    	return block;
    }

    // (166:6) <DropdownItem href="#/graph">
    function create_default_slot_4$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(166:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (161:4) <DropdownMenu end>
    function create_default_slot_3$3(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "#/graphics/line/province-budget-and-investment-in-social-promotion",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphics/azar-games-and-bet-activities",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_4$3] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(161:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (159:5) <Dropdown >
    function create_default_slot_2$3(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_3$3] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(159:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (136:2) <Nav navbar>
    function create_default_slot_1$3(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_16$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(136:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (134:1) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot$3(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_22$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_1$3] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(134:1) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let navbar;
    	let t1;
    	let br;
    	let t2;
    	let figure;
    	let div;
    	let t3;
    	let p;
    	let current;
    	let mounted;
    	let dispose;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			figure = element("figure");
    			div = element("div");
    			t3 = space();
    			p = element("p");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$5, 123, 4, 3979);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$5, 124, 4, 4071);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$5, 125, 4, 4170);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$5, 126, 4, 4271);
    			add_location(br, file$5, 174, 4, 6293);
    			attr_dev(div, "id", "container");
    			add_location(div, file$5, 176, 8, 6347);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$5, 177, 8, 6383);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$5, 175, 4, 6303);
    			add_location(main, file$5, 131, 0, 4392);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t1);
    			append_dev(main, br);
    			append_dev(main, t2);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t3);
    			append_dev(figure, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyGraphEconomies', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let year = [];
    	let country = [];
    	let percapita = [];
    	let currency = [];
    	let currentprices = [];
    	let datos = [];
    	let datosOrdenados = [];

    	//creo 2 let datos para poder ordenado los datos por año
    	async function getData() {
    		console.log("Fetching Economies....");
    		const res = await fetch("/api/v2/economies");

    		if (res.ok) {
    			const data = await res.json();
    			datos = data;

    			//si no tenemos ningun dato cargado, cargamos los datos iniciales, si tiene datos los obtiene sin cargar los iniciales
    			if (datos.length == 0) {
    				await fetch("/api/v2/economies/loadInitialData");
    				console.log("Entradas recibidas: " + datos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = datos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(dato => {
    					year.push(dato.year);
    					country.push(dato.country + "-" + dato.year);
    					percapita.push(dato.percapita);
    					currency.push(dato.currency);
    					currentprices.push(dato.currentprices);
    				});

    				location.reload();
    			} else {
    				console.log("Entradas recibidas: " + datos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = datos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(dato => {
    					year.push(dato.year);
    					country.push(dato.country + "-" + dato.year);
    					percapita.push(dato.percapita);
    					currency.push(dato.currency);
    					currentprices.push(dato.currentprices);
    				});
    			}
    		} else {
    			console.log("Error, can`t charge data");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart('container', {
    			chart: { type: 'area' },
    			title: { text: 'Grafica de economia mundial' },
    			xAxis: {
    				categories: country,
    				tickmarkPlacement: 'on',
    				title: { enabled: false }
    			},
    			yAxis: { title: { text: 'economia' } },
    			tooltip: { split: true, valueSuffix: 'economia' },
    			plotOptions: {
    				area: {
    					stacking: 'normal',
    					lineColor: '#666666',
    					lineWidth: 1,
    					marker: { lineWidth: 1, lineColor: '#666666' }
    				}
    			},
    			series: [
    				{ name: 'percapita', data: percapita },
    				{ name: 'currency', data: currency },
    				{
    					name: 'currentprices',
    					data: currentprices
    				}
    			]
    		});
    	}

    	onMount(getData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<MyGraphEconomies> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		Button,
    		delay,
    		year,
    		country,
    		percapita,
    		currency,
    		currentprices,
    		datos,
    		datosOrdenados,
    		getData,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('year' in $$props) year = $$props.year;
    		if ('country' in $$props) country = $$props.country;
    		if ('percapita' in $$props) percapita = $$props.percapita;
    		if ('currency' in $$props) currency = $$props.currency;
    		if ('currentprices' in $$props) currentprices = $$props.currentprices;
    		if ('datos' in $$props) datos = $$props.datos;
    		if ('datosOrdenados' in $$props) datosOrdenados = $$props.datosOrdenados;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class MyGraphEconomies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyGraphEconomies",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\expo-stats\Expo.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;

    const file$4 = "src\\front\\expo-stats\\Expo.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    // (175:2) <NavbarBrand href="#/info">
    function create_default_slot_36(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(175:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (178:4) <DropdownToggle nav caret>
    function create_default_slot_35(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(178:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (180:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_34(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Economies-Stats");
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
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(180:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (182:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_33(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(182:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (184:6) <DropdownItem href="./api/v1/expo">
    function create_default_slot_32(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(184:6) <DropdownItem href=\\\"./api/v1/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (179:4) <DropdownMenu end>
    function create_default_slot_31(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo",
    				$$slots: { default: [create_default_slot_32] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(179:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (177:3) <Dropdown >
    function create_default_slot_30(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_31] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(177:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (189:4) <DropdownToggle nav caret>
    function create_default_slot_29(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(189:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (191:6) <DropdownItem href="./#/economies">
    function create_default_slot_28(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Economies FRONT-END");
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
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(191:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (192:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_27$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_27$1.name,
    		type: "slot",
    		source: "(192:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (193:6) <DropdownItem href="#/expo">
    function create_default_slot_26$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expo FRONT-END");
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
    		id: create_default_slot_26$1.name,
    		type: "slot",
    		source: "(193:6) <DropdownItem href=\\\"#/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (195:6) <DropdownItem href="#/graph">
    function create_default_slot_25$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_25$1.name,
    		type: "slot",
    		source: "(195:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (190:4) <DropdownMenu end>
    function create_default_slot_24$1(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_27$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/expo",
    				$$slots: { default: [create_default_slot_26$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_25$1] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$1.name,
    		type: "slot",
    		source: "(190:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (188:12) <Dropdown>
    function create_default_slot_23$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_24$1] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_23$1.name,
    		type: "slot",
    		source: "(188:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (200:4) <DropdownToggle nav caret>
    function create_default_slot_22$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_22$1.name,
    		type: "slot",
    		source: "(200:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (202:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_21$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies");
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
    		id: create_default_slot_21$2.name,
    		type: "slot",
    		source: "(202:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (203:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_20$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_20$2.name,
    		type: "slot",
    		source: "(203:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (204:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_19$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(204:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:18) <DropdownItem href="#/graph">
    function create_default_slot_18$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(205:18) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (207:6) <DropdownItem href="#/graph">
    function create_default_slot_17$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(207:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (201:4) <DropdownMenu end>
    function create_default_slot_16$2(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_21$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_20$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem4 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem5 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_17$2] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem3_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem3_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem3.$set(dropdownitem3_changes);
    			const dropdownitem5_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdownitem5_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem5.$set(dropdownitem5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(201:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (199:5) <Dropdown >
    function create_default_slot_15$2(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_22$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_16$2] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(199:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (176:2) <Nav navbar>
    function create_default_slot_14$2(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_23$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(176:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (174:1) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot_13$2(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_14$2] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
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
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(174:1) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    // (216:1) <Button on:click="{getPgAnt}">
    function create_default_slot_12$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Anterior");
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
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(216:1) <Button on:click=\\\"{getPgAnt}\\\">",
    		ctx
    	});

    	return block;
    }

    // (219:1) <Button on:click="{getPgSig}">
    function create_default_slot_11$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Página Siguiente");
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
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(219:1) <Button on:click=\\\"{getPgSig}\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>      import {onMount}
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>      import {onMount}",
    		ctx
    	});

    	return block;
    }

    // (224:1) {:then expo}
    function create_then_block$1(ctx) {
    	let alert;
    	let t0;
    	let table0;
    	let t1;
    	let table1;
    	let current;

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[4],
    				isOpen: /*visible*/ ctx[3],
    				toggle: /*func*/ ctx[14],
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table0 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(alert.$$.fragment);
    			t0 = space();
    			create_component(table0.$$.fragment);
    			t1 = space();
    			create_component(table1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(table0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(table1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alert_changes = {};
    			if (dirty[0] & /*color*/ 16) alert_changes.color = /*color*/ ctx[4];
    			if (dirty[0] & /*visible*/ 8) alert_changes.isOpen = /*visible*/ ctx[3];
    			if (dirty[0] & /*visible*/ 8) alert_changes.toggle = /*func*/ ctx[14];

    			if (dirty[0] & /*checkMSG*/ 4 | dirty[1] & /*$$scope*/ 2) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			const table0_changes = {};

    			if (dirty[0] & /*from, to, color, checkMSG, visible*/ 31 | dirty[1] & /*$$scope*/ 2) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*expo, newExpo*/ 96 | dirty[1] & /*$$scope*/ 2) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(table0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(224:1) {:then expo}",
    		ctx
    	});

    	return block;
    }

    // (226:2) {#if checkMSG}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*checkMSG*/ 4) set_data_dev(t, /*checkMSG*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(226:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (225:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_10$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(225:1) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (244:22) <Button outline color="dark" on:click="{()=>{      if (from == null || to == null) {       color="success";       checkMSG="Los campos fecha inicio y fecha fin no pueden estar vacíos";       visible="true";      }else{       getExpo();      }     }}">
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
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
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(244:22) <Button outline color=\\\"dark\\\" on:click=\\\"{()=>{      if (from == null || to == null) {       color=\\\"success\\\";       checkMSG=\\\"Los campos fecha inicio y fecha fin no pueden estar vacíos\\\";       visible=\\\"true\\\";      }else{       getExpo();      }     }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (256:22) <Button outline color="info" on:click="{()=>{      from = null;      to = null;      getExpo();           }}">
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar Búsqueda");
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
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(256:22) <Button outline color=\\\"info\\\" on:click=\\\"{()=>{      from = null;      to = null;      getExpo();           }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (231:1) <Table bordered>
    function create_default_slot_7$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t4;
    	let td1;
    	let input1;
    	let t5;
    	let td2;
    	let button0;
    	let t6;
    	let td3;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "dark",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[17]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "info",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[18]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Fecha de inicio";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Fecha fin";
    			t3 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t4 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t5 = space();
    			td2 = element("td");
    			create_component(button0.$$.fragment);
    			t6 = space();
    			td3 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$4, 233, 4, 6617);
    			add_location(th1, file$4, 234, 4, 6647);
    			add_location(tr0, file$4, 232, 3, 6607);
    			add_location(thead, file$4, 231, 2, 6595);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			add_location(input0, file$4, 241, 7, 6721);
    			add_location(td0, file$4, 241, 3, 6717);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			add_location(input1, file$4, 242, 7, 6784);
    			add_location(td1, file$4, 242, 3, 6780);
    			attr_dev(td2, "align", "center");
    			add_location(td2, file$4, 243, 3, 6841);
    			attr_dev(td3, "align", "center");
    			add_location(td3, file$4, 255, 3, 7153);
    			add_location(tr1, file$4, 240, 2, 6708);
    			add_location(tbody, file$4, 237, 2, 6691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*from*/ ctx[0]);
    			append_dev(tr1, t4);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*to*/ ctx[1]);
    			append_dev(tr1, t5);
    			append_dev(tr1, td2);
    			mount_component(button0, td2, null);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			mount_component(button1, td3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*from*/ 1 && to_number(input0.value) !== /*from*/ ctx[0]) {
    				set_input_value(input0, /*from*/ ctx[0]);
    			}

    			if (dirty[0] & /*to*/ 2 && to_number(input1.value) !== /*to*/ ctx[1]) {
    				set_input_value(input1, /*to*/ ctx[1]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(231:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (288:8) <Button outline color="primary" on:click="{insertExpo}">
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Añadir");
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
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(288:8) <Button outline color=\\\"primary\\\" on:click=\\\"{insertExpo}\\\">",
    		ctx
    	});

    	return block;
    }

    // (292:23) <Button outline color="primary" on:click="{()=>{       newExpo.country = null;       newExpo.year = null;       newExpo.expo_tec = null;       newExpo.expo_m = null;       newExpo.tot_esco= null;      }}">
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Limpiar");
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
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(292:23) <Button outline color=\\\"primary\\\" on:click=\\\"{()=>{       newExpo.country = null;       newExpo.year = null;       newExpo.expo_tec = null;       newExpo.expo_m = null;       newExpo.tot_esco= null;      }}\\\">",
    		ctx
    	});

    	return block;
    }

    // (311:8) <Button outline color="warning" on:click={function (){       window.location.href = `/#/expo/${expos.country}/${expos.year}`      }}>
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(311:8) <Button outline color=\\\"warning\\\" on:click={function (){       window.location.href = `/#/expo/${expos.country}/${expos.year}`      }}>",
    		ctx
    	});

    	return block;
    }

    // (316:8) <Button outline color="danger" on:click={BorrarExpo(expos.country,expos.year)}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
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
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(316:8) <Button outline color=\\\"danger\\\" on:click={BorrarExpo(expos.country,expos.year)}>",
    		ctx
    	});

    	return block;
    }

    // (303:3) {#each expo as expos}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*expos*/ ctx[29].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*expos*/ ctx[29].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*expos*/ ctx[29].expo_tec + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*expos*/ ctx[29].expo_m + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*expos*/ ctx[29].tot_esco + "";
    	let t8;
    	let t9;
    	let td5;
    	let button0;
    	let t10;
    	let td6;
    	let button1;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[25](/*expos*/ ctx[29]);
    	}

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", click_handler_3);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*BorrarExpo*/ ctx[11](/*expos*/ ctx[29].country, /*expos*/ ctx[29].year))) /*BorrarExpo*/ ctx[11](/*expos*/ ctx[29].country, /*expos*/ ctx[29].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(td0, file$4, 304, 4, 8367);
    			add_location(td1, file$4, 305, 4, 8397);
    			add_location(td2, file$4, 306, 16, 8436);
    			add_location(td3, file$4, 307, 16, 8479);
    			add_location(td4, file$4, 308, 16, 8520);
    			add_location(td5, file$4, 310, 4, 8553);
    			add_location(td6, file$4, 315, 4, 8724);
    			add_location(tr, file$4, 303, 3, 8357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button0, td5, null);
    			append_dev(td5, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*expo*/ 64) && t0_value !== (t0_value = /*expos*/ ctx[29].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*expo*/ 64) && t2_value !== (t2_value = /*expos*/ ctx[29].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*expo*/ 64) && t4_value !== (t4_value = /*expos*/ ctx[29].expo_tec + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*expo*/ 64) && t6_value !== (t6_value = /*expos*/ ctx[29].expo_m + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*expo*/ 64) && t8_value !== (t8_value = /*expos*/ ctx[29].tot_esco + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(303:3) {#each expo as expos}",
    		ctx
    	});

    	return block;
    }

    // (323:8) <Button outline color="success" on:click={LoadExpo}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos");
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
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(323:8) <Button outline color=\\\"success\\\" on:click={LoadExpo}>",
    		ctx
    	});

    	return block;
    }

    // (326:8) <Button outline color="danger" on:click={BorrarExpoAll}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todo");
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(326:8) <Button outline color=\\\"danger\\\" on:click={BorrarExpoAll}>",
    		ctx
    	});

    	return block;
    }

    // (270:1) <Table bordered>
    function create_default_slot$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t10;
    	let td1;
    	let input1;
    	let t11;
    	let td2;
    	let input2;
    	let t12;
    	let td3;
    	let input3;
    	let t13;
    	let td4;
    	let input4;
    	let t14;
    	let td5;
    	let button0;
    	let t15;
    	let td6;
    	let button1;
    	let t16;
    	let t17;
    	let tr2;
    	let td7;
    	let button2;
    	let t18;
    	let td8;
    	let button3;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertExpo*/ ctx[10]);

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_2*/ ctx[24]);
    	let each_value = /*expo*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button2 = new Button({
    			props: {
    				outline: true,
    				color: "success",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*LoadExpo*/ ctx[13]);

    	button3 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*BorrarExpoAll*/ ctx[12]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Exportaciones Tecnológicas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Exportaciones Productos Manufacturados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Exportaciones Bienes y Servicios";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t10 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t11 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t12 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t13 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t14 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t15 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t16 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			tr2 = element("tr");
    			td7 = element("td");
    			create_component(button2.$$.fragment);
    			t18 = space();
    			td8 = element("td");
    			create_component(button3.$$.fragment);
    			add_location(th0, file$4, 272, 4, 7410);
    			add_location(th1, file$4, 273, 4, 7429);
    			add_location(th2, file$4, 274, 16, 7459);
    			add_location(th3, file$4, 275, 16, 7512);
    			add_location(th4, file$4, 276, 16, 7577);
    			add_location(tr0, file$4, 271, 3, 7400);
    			add_location(thead, file$4, 270, 2, 7388);
    			add_location(input0, file$4, 281, 8, 7670);
    			add_location(td0, file$4, 281, 4, 7666);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$4, 282, 8, 7723);
    			add_location(td1, file$4, 282, 4, 7719);
    			add_location(input2, file$4, 283, 8, 7787);
    			add_location(td2, file$4, 283, 4, 7783);
    			add_location(input3, file$4, 284, 8, 7841);
    			add_location(td3, file$4, 284, 4, 7837);
    			add_location(input4, file$4, 285, 8, 7893);
    			add_location(td4, file$4, 285, 4, 7889);
    			add_location(td5, file$4, 287, 4, 7945);
    			attr_dev(td6, "align", "center");
    			add_location(td6, file$4, 291, 4, 8051);
    			add_location(tr1, file$4, 280, 3, 7656);
    			add_location(td7, file$4, 322, 4, 8883);
    			add_location(td8, file$4, 325, 4, 8984);
    			add_location(tr2, file$4, 321, 3, 8873);
    			add_location(tbody, file$4, 279, 2, 7644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newExpo*/ ctx[5].country);
    			append_dev(tr1, t10);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newExpo*/ ctx[5].year);
    			append_dev(tr1, t11);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newExpo*/ ctx[5].expo_tec);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newExpo*/ ctx[5].expo_m);
    			append_dev(tr1, t13);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newExpo*/ ctx[5].tot_esco);
    			append_dev(tr1, t14);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td6);
    			mount_component(button1, td6, null);
    			append_dev(tbody, t16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td7);
    			mount_component(button2, td7, null);
    			append_dev(tr2, t18);
    			append_dev(tr2, td8);
    			mount_component(button3, td8, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[19]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[20]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[21]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[22]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[23])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newExpo*/ 32 && input0.value !== /*newExpo*/ ctx[5].country) {
    				set_input_value(input0, /*newExpo*/ ctx[5].country);
    			}

    			if (dirty[0] & /*newExpo*/ 32 && to_number(input1.value) !== /*newExpo*/ ctx[5].year) {
    				set_input_value(input1, /*newExpo*/ ctx[5].year);
    			}

    			if (dirty[0] & /*newExpo*/ 32 && input2.value !== /*newExpo*/ ctx[5].expo_tec) {
    				set_input_value(input2, /*newExpo*/ ctx[5].expo_tec);
    			}

    			if (dirty[0] & /*newExpo*/ 32 && input3.value !== /*newExpo*/ ctx[5].expo_m) {
    				set_input_value(input3, /*newExpo*/ ctx[5].expo_m);
    			}

    			if (dirty[0] & /*newExpo*/ 32 && input4.value !== /*newExpo*/ ctx[5].tot_esco) {
    				set_input_value(input4, /*newExpo*/ ctx[5].tot_esco);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*BorrarExpo, expo*/ 2112) {
    				each_value = /*expo*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t17);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button2);
    			destroy_component(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(270:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (222:17)   loading   {:then expo}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(222:17)   loading   {:then expo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let h1;
    	let t2;
    	let button0;
    	let t3;
    	let button1;
    	let t4;
    	let promise;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*getPgAnt*/ ctx[8]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getPgSig*/ ctx[9]);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*expo*/ ctx[6], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Economia Mundial";
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			info.block.c();
    			add_location(h1, file$4, 214, 4, 6246);
    			add_location(main, file$4, 172, 0, 4534);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			mount_component(button0, main, null);
    			append_dev(main, t3);
    			mount_component(button1, main, null);
    			append_dev(main, t4);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const navbar_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			info.ctx = ctx;

    			if (dirty[0] & /*expo*/ 64 && promise !== (promise = /*expo*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(button0);
    			destroy_component(button1);
    			info.block.d();
    			info.token = null;
    			info = null;
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Expo', slots, []);
    	let expo = [];
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let numEntries;
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";

    	let newExpo = {
    		country: "",
    		year: "",
    		expo_tec: "",
    		expo_m: "",
    		tot_esco: ""
    	};

    	onMount(getExpo);

    	async function getExpo() {
    		console.log("fetching exports ....");
    		let cadena = `/api/v1/expo?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, expo = data);
    			numEntries = expo.length;
    			console.log("Received expo: " + expo.length);
    		} else {
    			$$invalidate(4, color = "danger");
    			$$invalidate(2, checkMSG = "No hay entradas para esas fechas");
    			$$invalidate(3, visible = "true");
    		}
    	}

    	async function getPgAnt() {
    		if (offset >= 10) {
    			offset = offset - 10;
    		}

    		//limit=limit+10;
    		console.log("fetching exports ....");

    		let cadena = `/api/v1/expo?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, expo = data);
    			console.log("Received expo: " + expo.length);
    		}
    	}

    	async function getPgSig() {
    		if (expo.length >= 10) {
    			offset = offset + 10;
    		}

    		//limit=limit+10;
    		console.log("fetching expo ....");

    		let cadena = `/api/v1/expo?offset=+${offset}+&limit=+${limit}`;

    		if (from != null) {
    			cadena = cadena + `&from=${from}&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, expo = data);
    			console.log("Received expo: " + expo.length);
    		}
    	}

    	async function insertExpo() {
    		if (newExpo.country == "" || newExpo.country == null || newExpo.year == "" || newExpo.year == null) {
    			$$invalidate(4, color = "danger");
    			$$invalidate(2, checkMSG = "Debes insertar el nombre del país y el año.");
    			$$invalidate(3, visible = "true");
    		} else {
    			console.log("Inserting Expo...." + JSON.stringify(newExpo));

    			await fetch("/api/v1/expo", {
    				method: "POST",
    				body: JSON.stringify(newExpo),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				if (res.status == 201) {
    					$$invalidate(4, color = "success");
    					$$invalidate(2, checkMSG = "Entrada introducida con éxito");
    					$$invalidate(3, visible = "true");
    					getExpo();
    				} else if (res.status == 409) {
    					$$invalidate(4, color = "danger");
    					$$invalidate(2, checkMSG = "Ya existe ese recurso en la base de datos");
    					$$invalidate(3, visible = "true");
    					console.log("ERROR There is already a data with that country and year in the database");
    				}
    			});
    		}
    	}

    	async function BorrarExpo(name, year) {
    		await fetch("/api/v1/expo/" + name + "/" + year, { method: "DELETE" }).then(function (res) {
    			getExpo();

    			if (res.status == 200) {
    				$$invalidate(4, color = "success");
    				$$invalidate(2, checkMSG = name + " entrada borrada correctamente");
    				$$invalidate(3, visible = "true");
    				console.log("Deleted " + name);
    			} else {
    				$$invalidate(4, color = "danger");
    				$$invalidate(2, checkMSG = name + "no se ha podido borrar la entrada");
    				$$invalidate(3, visible = "true");
    				console.log("DATA NOT FOUND");
    			}
    		});
    	}

    	async function BorrarExpoAll() {
    		console.log("Deleting Expo....");

    		await fetch("/api/v1/expo/", { method: "DELETE" }).then(function (res) {
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Entradas elimidas con éxito");
    			$$invalidate(3, visible = "true");
    			getExpo();
    		});
    	}

    	async function LoadExpo() {
    		console.log("Loading expo....");

    		await fetch("/api/v1/expo/loadInitialData", { method: "GET" }).then(function (res) {
    			getExpo();
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Entradas cargadas con éxito");
    			$$invalidate(3, visible = "true");
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Expo> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(3, visible = false);

    	function input0_input_handler() {
    		from = to_number(this.value);
    		$$invalidate(0, from);
    	}

    	function input1_input_handler() {
    		to = to_number(this.value);
    		$$invalidate(1, to);
    	}

    	const click_handler = () => {
    		if (from == null || to == null) {
    			$$invalidate(4, color = "success");
    			$$invalidate(2, checkMSG = "Los campos fecha inicio y fecha fin no pueden estar vacíos");
    			$$invalidate(3, visible = "true");
    		} else {
    			getExpo();
    		}
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, from = null);
    		$$invalidate(1, to = null);
    		getExpo();
    	};

    	function input0_input_handler_1() {
    		newExpo.country = this.value;
    		$$invalidate(5, newExpo);
    	}

    	function input1_input_handler_1() {
    		newExpo.year = to_number(this.value);
    		$$invalidate(5, newExpo);
    	}

    	function input2_input_handler() {
    		newExpo.expo_tec = this.value;
    		$$invalidate(5, newExpo);
    	}

    	function input3_input_handler() {
    		newExpo.expo_m = this.value;
    		$$invalidate(5, newExpo);
    	}

    	function input4_input_handler() {
    		newExpo.tot_esco = this.value;
    		$$invalidate(5, newExpo);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(5, newExpo.country = null, newExpo);
    		$$invalidate(5, newExpo.year = null, newExpo);
    		$$invalidate(5, newExpo.expo_tec = null, newExpo);
    		$$invalidate(5, newExpo.expo_m = null, newExpo);
    		$$invalidate(5, newExpo.tot_esco = null, newExpo);
    	};

    	const click_handler_3 = function (expos) {
    		window.location.href = `/#/expo/${expos.country}/${expos.year}`;
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Alert,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		expo,
    		from,
    		to,
    		offset,
    		limit,
    		numEntries,
    		checkMSG,
    		visible,
    		color,
    		newExpo,
    		getExpo,
    		getPgAnt,
    		getPgSig,
    		insertExpo,
    		BorrarExpo,
    		BorrarExpoAll,
    		LoadExpo
    	});

    	$$self.$inject_state = $$props => {
    		if ('expo' in $$props) $$invalidate(6, expo = $$props.expo);
    		if ('from' in $$props) $$invalidate(0, from = $$props.from);
    		if ('to' in $$props) $$invalidate(1, to = $$props.to);
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    		if ('checkMSG' in $$props) $$invalidate(2, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(3, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(4, color = $$props.color);
    		if ('newExpo' in $$props) $$invalidate(5, newExpo = $$props.newExpo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		from,
    		to,
    		checkMSG,
    		visible,
    		color,
    		newExpo,
    		expo,
    		getExpo,
    		getPgAnt,
    		getPgSig,
    		insertExpo,
    		BorrarExpo,
    		BorrarExpoAll,
    		LoadExpo,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler,
    		click_handler_1,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Expo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Expo",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\front\expo-stats\EditExpo.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;

    const file$3 = "src\\front\\expo-stats\\EditExpo.svelte";

    // (92:2) <NavbarBrand href="#/info">
    function create_default_slot_27(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(92:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (95:4) <DropdownToggle nav caret>
    function create_default_slot_26(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(95:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (97:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Economies-Stats");
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
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(97:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(99:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (101:6) <DropdownItem href="./api/v1/expo">
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(101:6) <DropdownItem href=\\\"./api/v1/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:4) <DropdownMenu end>
    function create_default_slot_22(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo",
    				$$slots: { default: [create_default_slot_23] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(96:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (94:3) <Dropdown >
    function create_default_slot_21$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_22] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_21$1.name,
    		type: "slot",
    		source: "(94:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (106:4) <DropdownToggle nav caret>
    function create_default_slot_20$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(106:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (108:6) <DropdownItem href="./#/economies">
    function create_default_slot_19$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(108:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (109:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_18$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(109:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:6) <DropdownItem href="#/expo">
    function create_default_slot_17$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo FRONT-END");
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
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(110:6) <DropdownItem href=\\\"#/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (112:6) <DropdownItem href="#/graph">
    function create_default_slot_16$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(112:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (107:4) <DropdownMenu end>
    function create_default_slot_15$1(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_19$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/expo",
    				$$slots: { default: [create_default_slot_17$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_16$1] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(107:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (105:12) <Dropdown>
    function create_default_slot_14$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_20$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_15$1] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(105:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (117:4) <DropdownToggle nav caret>
    function create_default_slot_13$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(117:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (119:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(119:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (120:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_11$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(120:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (121:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(121:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (122:18) <DropdownItem href="#/graph">
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(122:18) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (124:6) <DropdownItem href="#/graph">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Conjunto");
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
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(124:6) <DropdownItem href=\\\"#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:4) <DropdownMenu end>
    function create_default_slot_7$1(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem4 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem5 = new DropdownItem({
    			props: {
    				href: "#/graph",
    				$$slots: { default: [create_default_slot_8$1] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem1_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem1.$set(dropdownitem1_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem3_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem3_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem3.$set(dropdownitem3_changes);
    			const dropdownitem5_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdownitem5_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem5.$set(dropdownitem5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(118:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (116:5) <Dropdown >
    function create_default_slot_6$1(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_7$1] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(116:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (93:2) <Nav navbar>
    function create_default_slot_5$1(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_21$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(93:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (91:4) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot_4$1(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_5$1] },
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(91:4) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    // (134:2) {#if checkMSG}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*checkMSG*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checkMSG*/ 8) set_data_dev(t, /*checkMSG*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(134:2) {#if checkMSG}",
    		ctx
    	});

    	return block;
    }

    // (133:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>
    function create_default_slot_3$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*checkMSG*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*checkMSG*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(133:4) <Alert color={color} isOpen={visible} toggle={() => (visible = false)}>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>        export let params={}
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>        export let params={}",
    		ctx
    	});

    	return block;
    }

    // (140:8) {:then expo}
    function create_then_block(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedExpoM, updatedExpoTec, params*/ 65543) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(140:8) {:then expo}",
    		ctx
    	});

    	return block;
    }

    // (160:24) <Button outline color="primary" on:click="{EditExpo}">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(160:24) <Button outline color=\\\"primary\\\" on:click=\\\"{EditExpo}\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:8) <Table bordered>
    function create_default_slot_1$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let tbody;
    	let tr1;
    	let td0;
    	let t10_value = /*params*/ ctx[0].country + "";
    	let t10;
    	let t11;
    	let td1;
    	let t12_value = /*params*/ ctx[0].year + "";
    	let t12;
    	let t13;
    	let td2;
    	let input0;
    	let t14;
    	let td3;
    	let input1;
    	let t15;
    	let td4;
    	let input2;
    	let t16;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*EditExpo*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Exportaciones Tecnológicas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Exportaciones Productos Manufacturados";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Exportaciones Bienes y Servicios";
    			t9 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td1 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$3, 144, 20, 4384);
    			add_location(th1, file$3, 145, 20, 4419);
    			add_location(th2, file$3, 146, 20, 4453);
    			add_location(th3, file$3, 147, 20, 4510);
    			add_location(th4, file$3, 148, 20, 4579);
    			add_location(tr0, file$3, 143, 16, 4358);
    			add_location(thead, file$3, 142, 12, 4333);
    			add_location(td0, file$3, 153, 20, 4730);
    			add_location(td1, file$3, 154, 20, 4777);
    			add_location(input0, file$3, 155, 24, 4825);
    			add_location(td2, file$3, 155, 20, 4821);
    			add_location(input1, file$3, 156, 24, 4893);
    			add_location(td3, file$3, 156, 20, 4889);
    			add_location(input2, file$3, 157, 24, 4959);
    			add_location(td4, file$3, 157, 20, 4955);
    			add_location(td5, file$3, 159, 20, 5027);
    			add_location(tr1, file$3, 152, 16, 4704);
    			add_location(tbody, file$3, 151, 12, 4679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t10);
    			append_dev(tr1, t11);
    			append_dev(tr1, td1);
    			append_dev(td1, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedExpoTec*/ ctx[1]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedExpoM*/ ctx[2]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedExpoM*/ ctx[2]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t10_value !== (t10_value = /*params*/ ctx[0].country + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].year + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*updatedExpoTec*/ 2 && input0.value !== /*updatedExpoTec*/ ctx[1]) {
    				set_input_value(input0, /*updatedExpoTec*/ ctx[1]);
    			}

    			if (dirty & /*updatedExpoM*/ 4 && input1.value !== /*updatedExpoM*/ ctx[2]) {
    				set_input_value(input1, /*updatedExpoM*/ ctx[2]);
    			}

    			if (dirty & /*updatedExpoM*/ 4 && input2.value !== /*updatedExpoM*/ ctx[2]) {
    				set_input_value(input2, /*updatedExpoM*/ ctx[2]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
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
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(142:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (138:17)       loading          {:then expo}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(138:17)       loading          {:then expo}",
    		ctx
    	});

    	return block;
    }

    // (169:4) <Button outline color="secondary" on:click= "{pop}">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(169:4) <Button outline color=\\\"secondary\\\" on:click= \\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let h1;
    	let t1;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let t4;
    	let alert;
    	let t5;
    	let promise;
    	let t6;
    	let button;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	alert = new Alert({
    			props: {
    				color: /*color*/ ctx[5],
    				isOpen: /*visible*/ ctx[4],
    				toggle: /*func*/ ctx[8],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*expo*/ ctx[6], info);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			t1 = text("Editar \"");
    			t2 = text(t2_value);
    			t3 = text("\"");
    			t4 = space();
    			create_component(alert.$$.fragment);
    			t5 = space();
    			info.block.c();
    			t6 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$3, 131, 4, 4067);
    			add_location(main, file$3, 89, 0, 2346);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(main, t4);
    			mount_component(alert, main, null);
    			append_dev(main, t5);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t6;
    			append_dev(main, t6);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			const alert_changes = {};
    			if (dirty & /*color*/ 32) alert_changes.color = /*color*/ ctx[5];
    			if (dirty & /*visible*/ 16) alert_changes.isOpen = /*visible*/ ctx[4];
    			if (dirty & /*visible*/ 16) alert_changes.toggle = /*func*/ ctx[8];

    			if (dirty & /*$$scope, checkMSG*/ 65544) {
    				alert_changes.$$scope = { dirty, ctx };
    			}

    			alert.$set(alert_changes);
    			info.ctx = ctx;

    			if (dirty & /*expo*/ 64 && promise !== (promise = /*expo*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(alert.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(alert.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(alert);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function Fallos(code, entrada) {
    	let msg;

    	if (code == 404) {
    		msg = "No se encuentra " + entrada;
    	}

    	if (code == 400) {
    		msg = "solicitud incorrecta";
    	}

    	if (code == 409) {
    		msg = "El dato introducido ya existe";
    	}

    	if (code == 401) {
    		msg = "No autorizado";
    	}

    	if (code == 405) {
    		msg = "Método no permitido";
    	}

    	window.alert(msg);
    	return;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditExpo', slots, []);
    	let { params = {} } = $$props;
    	let expo = {};
    	let updatedCountry;
    	let updatedYear;
    	let updatedExpoTec;
    	let updatedExpoM;
    	let updatedExpoByS;
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	onMount(getExpo);

    	async function getExpo() {
    		console.log("fetching expos ....");
    		const res = await fetch("/api/v1/expo/" + params.country + "/" + params.year);

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(6, expo = data);
    			updatedCountry = expo.country;
    			updatedYear = expo.year;
    			$$invalidate(1, updatedExpoTec = expo.expo_tec);
    			$$invalidate(2, updatedExpoM = expo.expo_m);
    			$$invalidate(2, updatedExpoM = expo.tot_esco);
    		} else {
    			Fallos(res.status, params.country);
    			pop();
    		}
    	}

    	async function EditExpo() {
    		console.log("Updating expo...." + updatedCountry);

    		await fetch("/api/v1/expo/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: updatedCountry,
    				year: updatedYear,
    				expo_tec: updatedExpoTec,
    				expo_m: updatedExpoM,
    				tot_esco: updatedExpoM
    			}),
    			headers: { "Content-Type": "application/json" }
    		});

    		$$invalidate(5, color = "success");
    		$$invalidate(3, checkMSG = "Se ha editado correctamente");
    		$$invalidate(4, visible = "true");
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<EditExpo> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(4, visible = false);

    	function input0_input_handler() {
    		updatedExpoTec = this.value;
    		$$invalidate(1, updatedExpoTec);
    	}

    	function input1_input_handler() {
    		updatedExpoM = this.value;
    		$$invalidate(2, updatedExpoM);
    	}

    	function input2_input_handler() {
    		updatedExpoM = this.value;
    		$$invalidate(2, updatedExpoM);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		pop,
    		onMount,
    		Button,
    		Table,
    		Alert,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		expo,
    		updatedCountry,
    		updatedYear,
    		updatedExpoTec,
    		updatedExpoM,
    		updatedExpoByS,
    		checkMSG,
    		visible,
    		color,
    		getExpo,
    		EditExpo,
    		Fallos
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('expo' in $$props) $$invalidate(6, expo = $$props.expo);
    		if ('updatedCountry' in $$props) updatedCountry = $$props.updatedCountry;
    		if ('updatedYear' in $$props) updatedYear = $$props.updatedYear;
    		if ('updatedExpoTec' in $$props) $$invalidate(1, updatedExpoTec = $$props.updatedExpoTec);
    		if ('updatedExpoM' in $$props) $$invalidate(2, updatedExpoM = $$props.updatedExpoM);
    		if ('updatedExpoByS' in $$props) updatedExpoByS = $$props.updatedExpoByS;
    		if ('checkMSG' in $$props) $$invalidate(3, checkMSG = $$props.checkMSG);
    		if ('visible' in $$props) $$invalidate(4, visible = $$props.visible);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedExpoTec,
    		updatedExpoM,
    		checkMSG,
    		visible,
    		color,
    		expo,
    		EditExpo,
    		func,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditExpo_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditExpo_1",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get params() {
    		throw new Error("<EditExpo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditExpo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\expo-stats\ExpoGraph.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;

    const file$2 = "src\\front\\expo-stats\\ExpoGraph.svelte";

    // (127:2) <NavbarBrand href="#/info">
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("INICIO");
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
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(127:2) <NavbarBrand href=\\\"#/info\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:4) <DropdownToggle nav caret>
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
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
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(130:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (132:6) <DropdownItem href="./api/v2/economies">
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(132:6) <DropdownItem href=\\\"./api/v2/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (134:6) <DropdownItem href="./api/v1/esco-stats">
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		source: "(134:6) <DropdownItem href=\\\"./api/v1/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (136:6) <DropdownItem href="./api/v1/expo">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(136:6) <DropdownItem href=\\\"./api/v1/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:4) <DropdownMenu end>
    function create_default_slot_16(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./api/v2/economies",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./api/v1/esco-stats",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "./api/v1/expo",
    				$$slots: { default: [create_default_slot_17] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(131:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (129:3) <Dropdown >
    function create_default_slot_15(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_16] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(129:3) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (141:4) <DropdownToggle nav caret>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FRONT-END");
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
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(141:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (143:6) <DropdownItem href="./#/economies">
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies FRONT-END");
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
    		source: "(143:6) <DropdownItem href=\\\"./#/economies\\\">",
    		ctx
    	});

    	return block;
    }

    // (145:6) <DropdownItem href="./#/esco-stats">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco FRONT_END");
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
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(145:6) <DropdownItem href=\\\"./#/esco-stats\\\">",
    		ctx
    	});

    	return block;
    }

    // (147:6) <DropdownItem href="#/expo">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo FRONT-END");
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
    		source: "(147:6) <DropdownItem href=\\\"#/expo\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:4) <DropdownMenu end>
    function create_default_slot_10(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/esco-stats",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/expo",
    				$$slots: { default: [create_default_slot_11] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(142:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (140:12) <Dropdown>
    function create_default_slot_9(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_10] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(140:12) <Dropdown>",
    		ctx
    	});

    	return block;
    }

    // (152:4) <DropdownToggle nav caret>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Gráficas");
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
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(152:4) <DropdownToggle nav caret>",
    		ctx
    	});

    	return block;
    }

    // (154:6) <DropdownItem href="./#/economies-graph">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("economies-Stats");
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
    		source: "(154:6) <DropdownItem href=\\\"./#/economies-graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (156:6) <DropdownItem href="./#/graphesco">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("esco-Stats");
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
    		source: "(156:6) <DropdownItem href=\\\"./#/graphesco\\\">",
    		ctx
    	});

    	return block;
    }

    // (158:6) <DropdownItem href="#/graphexpo">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("expo-Stats");
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
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(158:6) <DropdownItem href=\\\"#/graphexpo\\\">",
    		ctx
    	});

    	return block;
    }

    // (160:18) <DropdownItem href="./#/graph">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Grafica comun");
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
    		source: "(160:18) <DropdownItem href=\\\"./#/graph\\\">",
    		ctx
    	});

    	return block;
    }

    // (153:4) <DropdownMenu end>
    function create_default_slot_3(ctx) {
    	let dropdownitem0;
    	let t0;
    	let dropdownitem1;
    	let t1;
    	let dropdownitem2;
    	let t2;
    	let dropdownitem3;
    	let t3;
    	let dropdownitem4;
    	let t4;
    	let dropdownitem5;
    	let t5;
    	let dropdownitem6;
    	let current;

    	dropdownitem0 = new DropdownItem({
    			props: {
    				href: "./#/economies-graph",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem1 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem2 = new DropdownItem({
    			props: {
    				href: "./#/graphesco",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem3 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem4 = new DropdownItem({
    			props: {
    				href: "#/graphexpo",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownitem5 = new DropdownItem({ props: { divider: true }, $$inline: true });

    	dropdownitem6 = new DropdownItem({
    			props: {
    				href: "./#/graph",
    				$$slots: { default: [create_default_slot_4] },
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
    			t3 = space();
    			create_component(dropdownitem4.$$.fragment);
    			t4 = space();
    			create_component(dropdownitem5.$$.fragment);
    			t5 = space();
    			create_component(dropdownitem6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdownitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdownitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdownitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(dropdownitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(dropdownitem4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(dropdownitem5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(dropdownitem6, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdownitem0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem0_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem0.$set(dropdownitem0_changes);
    			const dropdownitem2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem2_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem2.$set(dropdownitem2_changes);
    			const dropdownitem4_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem4_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem4.$set(dropdownitem4_changes);
    			const dropdownitem6_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdownitem6_changes.$$scope = { dirty, ctx };
    			}

    			dropdownitem6.$set(dropdownitem6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdownitem0.$$.fragment, local);
    			transition_in(dropdownitem1.$$.fragment, local);
    			transition_in(dropdownitem2.$$.fragment, local);
    			transition_in(dropdownitem3.$$.fragment, local);
    			transition_in(dropdownitem4.$$.fragment, local);
    			transition_in(dropdownitem5.$$.fragment, local);
    			transition_in(dropdownitem6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdownitem0.$$.fragment, local);
    			transition_out(dropdownitem1.$$.fragment, local);
    			transition_out(dropdownitem2.$$.fragment, local);
    			transition_out(dropdownitem3.$$.fragment, local);
    			transition_out(dropdownitem4.$$.fragment, local);
    			transition_out(dropdownitem5.$$.fragment, local);
    			transition_out(dropdownitem6.$$.fragment, local);
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
    			if (detaching) detach_dev(t3);
    			destroy_component(dropdownitem4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(dropdownitem5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(dropdownitem6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(153:4) <DropdownMenu end>",
    		ctx
    	});

    	return block;
    }

    // (151:5) <Dropdown >
    function create_default_slot_2(ctx) {
    	let dropdowntoggle;
    	let t;
    	let dropdownmenu;
    	let current;

    	dropdowntoggle = new DropdownToggle({
    			props: {
    				nav: true,
    				caret: true,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdownmenu = new DropdownMenu({
    			props: {
    				end: true,
    				$$slots: { default: [create_default_slot_3] },
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
    		m: function mount(target, anchor) {
    			mount_component(dropdowntoggle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropdownmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdowntoggle_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdowntoggle_changes.$$scope = { dirty, ctx };
    			}

    			dropdowntoggle.$set(dropdowntoggle_changes);
    			const dropdownmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(151:5) <Dropdown >",
    		ctx
    	});

    	return block;
    }

    // (128:2) <Nav navbar>
    function create_default_slot_1(ctx) {
    	let dropdown0;
    	let t0;
    	let dropdown1;
    	let t1;
    	let dropdown2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			create_component(dropdown1.$$.fragment);
    			t1 = space();
    			create_component(dropdown2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(dropdown1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dropdown2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown0_changes.$$scope = { dirty, ctx };
    			}

    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown1_changes.$$scope = { dirty, ctx };
    			}

    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				dropdown2_changes.$$scope = { dirty, ctx };
    			}

    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(dropdown1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dropdown2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(128:2) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (126:4) <Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
    function create_default_slot(ctx) {
    	let navbarbrand;
    	let t;
    	let nav;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#/info",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav = new Nav({
    			props: {
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
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(126:4) <Navbar style=\\\"background-color: #6EAA8D; color:white;\\\" light expand=\\\"lg\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let navbar;
    	let t1;
    	let figure;
    	let div;
    	let t2;
    	let p;
    	let current;
    	let mounted;
    	let dispose;

    	navbar = new Navbar({
    			props: {
    				style: "background-color: #6EAA8D; color:white;",
    				light: true,
    				expand: "lg",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			figure = element("figure");
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Este gráfico compara las exportaciones de diferentes paises";
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 118, 4, 3945);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$2, 119, 4, 4038);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$2, 120, 4, 4138);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$2, 121, 4, 4240);
    			attr_dev(div, "id", "container");
    			add_location(div, file$2, 168, 8, 6158);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$2, 169, 8, 6190);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$2, 167, 4, 6114);
    			add_location(main, file$2, 124, 0, 4358);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t1);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t2);
    			append_dev(figure, p);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpoGraph', slots, []);
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let expos = [];
    	let country = [];
    	let year = [];
    	let expo_tec = [];
    	let expo_m = [];
    	let tot_esco = [];
    	let datosOrdenados = [];

    	async function getData() {
    		console.log("Fetching expo....");
    		const res = await fetch("/api/v1/expo");

    		if (res.ok) {
    			const data = await res.json();
    			expos = data;

    			if (expos.length == 0) {
    				await fetch("/api/v1/expo-stats/loadInitialData");
    				console.log("Entradas recibidas: " + expos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = expos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(expo => {
    					year.push(expo.year);
    					country.push(expo.country + "-" + expo.year);
    					expo_tec.push(expo.expo_tec);
    					expo_m.push(expo.expo_m);
    					tot_esco.push(expo.tot_esco);
    				});

    				location.reload();
    			} else {
    				console.log("Entradas recibidas: " + expos.length);

    				//con la siguiente funcion ordeno los datos por años de menor a mayor
    				datosOrdenados = expos.sort(function (a, b) {
    					return a.year - b.year;
    				});

    				console.log("Ordenadas correctamente");

    				datosOrdenados.forEach(expo => {
    					year.push(expo.year);
    					country.push(expo.country + "-" + expo.year);
    					expo_tec.push(expo.expo_tec);
    					expo_m.push(expo.expo_m);
    					tot_esco.push(expo.tot_esco);
    				});
    			}
    		} else {
    			console.log("Error, can`t charge data");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			chart: { type: "column" },
    			title: { text: "País" },
    			subtitle: {
    				text: "Source: https://ourworldindata.org/expo"
    			},
    			xAxis: { categories: country, crosshair: true },
    			yAxis: {
    				min: 0,
    				title: { text: "%(Según el PIB)" }
    			},
    			tooltip: {
    				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y} % de exportaciones</b></td></tr>',
    				footerFormat: "</table>",
    				shared: true,
    				useHTML: true
    			},
    			plotOptions: {
    				column: { pointPadding: 0.2, borderWidth: 0 }
    			},
    			series: [
    				{
    					name: 'Exportaciones Bienes y Servicios',
    					data: tot_esco
    				},
    				{
    					name: 'Exportaciones Prod. Manufacturados',
    					data: expo_m
    				},
    				{
    					name: 'Exportaciones Tecnológicas',
    					data: expo_tec
    				}
    			]
    		});
    	}

    	onMount(getData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<ExpoGraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Navbar,
    		Nav,
    		NavItem,
    		NavLink,
    		NavbarBrand,
    		Dropdown,
    		DropdownToggle,
    		DropdownMenu,
    		DropdownItem,
    		Button,
    		delay,
    		expos,
    		country,
    		year,
    		expo_tec,
    		expo_m,
    		tot_esco,
    		datosOrdenados,
    		getData,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('expos' in $$props) expos = $$props.expos;
    		if ('country' in $$props) country = $$props.country;
    		if ('year' in $$props) year = $$props.year;
    		if ('expo_tec' in $$props) expo_tec = $$props.expo_tec;
    		if ('expo_m' in $$props) expo_m = $$props.expo_m;
    		if ('tot_esco' in $$props) tot_esco = $$props.tot_esco;
    		if ('datosOrdenados' in $$props) datosOrdenados = $$props.datosOrdenados;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class ExpoGraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpoGraph",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\MyGraph.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\front\\MyGraph.svelte";

    function create_fragment$1(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t2;
    	let code;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			t2 = text("Basic line chart showing trends in a dataset. This chart includes the\r\n            ");
    			code = element("code");
    			code.textContent = "series-label";
    			t4 = text(" module, which adds a label to each line for\r\n            enhanced readability.");
    			if (!src_url_equal(script0.src, script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 137, 4, 3620);
    			if (!src_url_equal(script1.src, script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$1, 138, 4, 3713);
    			if (!src_url_equal(script2.src, script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$1, 139, 4, 3816);
    			if (!src_url_equal(script3.src, script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$1, 140, 4, 3916);
    			if (!src_url_equal(script4.src, script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$1, 141, 4, 4018);
    			attr_dev(div, "id", "container");
    			add_location(div, file$1, 148, 8, 4196);
    			add_location(code, file$1, 151, 12, 4363);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$1, 149, 8, 4232);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$1, 147, 4, 4152);
    			add_location(main, file$1, 145, 0, 4138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(p, t2);
    			append_dev(p, code);
    			append_dev(p, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(script0, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script1, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script2, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script3, "load", /*loadGraph*/ ctx[0], false, false, false),
    					listen_dev(script4, "load", /*loadGraph*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyGraph', slots, []);
    	let expos = [];
    	let escos = [];
    	let economies = [];
    	let country = [];
    	let year = [];
    	let tot_esco = [];
    	let expo_m = [];
    	let expo_tec = [];
    	let percapita = [];
    	let tot_man = [];
    	let tot_wom = [];
    	let currency = [];
    	let currentprices = [];
    	let ages1 = [];
    	let ages2 = [];
    	let ages3 = [];

    	async function getData() {
    		const res1 = await fetch("/api/v1/expo");
    		const res2 = await fetch("/api/v2/economies");
    		const res3 = await fetch("/api/v1/esco-stats");

    		if (res1.ok && res2.ok && res3.ok) {
    			const data1 = await res1.json();
    			const data3 = await res2.json();
    			const data2 = await res3.json();
    			expos = data1;
    			console.log("Recibido: " + expos.length);

    			//inicializamos los arrays para mostrar los datos
    			expos.forEach(expo => {
    				country.push(expo.country + "-" + expo.year);
    				year.push(expo.year);
    				ages1.push(expo.tot_esco + expo.expo_m + expo.expo_tec);
    				expo_m.push(expo.expo_m);
    				expo_tec.push(expo.expo_tec);
    			});

    			economies = data3;
    			console.log("Recibido: " + economies.length);

    			economies.forEach(economies => {
    				percapita.push(economies.percapita);
    				currency.push(economies.currency);
    				ages3.push(economies.percapita + economies.currency + economies.currentprices);
    				currentprices.push(economies.currentprices);
    			});

    			escos = data2;
    			console.log("Recibido: " + escos.length);

    			escos.forEach(esco => {
    				// year.push(esco.year);
    				//country.push(esco.country);
    				tot_wom.push(esco.tot_wom);

    				tot_man.push(esco.tot_man);
    				ages2.push(esco.tot_esco + esco.tot_man + esco.tot_wom);
    				tot_esco.push(esco.tot_esco);
    			});
    		} else {
    			console.log("Error in request");
    		}
    	}

    	async function loadGraph() {
    		Highcharts.chart("container", {
    			title: {
    				text: "Solar Employment Growth by Sector, 2010-2016"
    			},
    			subtitle: { text: "Source: thesolarfoundation.com" },
    			yAxis: {
    				title: { text: "economia escolarizacion" }
    			},
    			xAxis: {
    				title: { text: "Pais-año" },
    				categories: country
    			},
    			legend: {
    				layout: "vertical",
    				align: "right",
    				verticalAlign: "middle"
    			},
    			series: [
    				{ name: 'expo', data: ages1 },
    				{ name: 'esco', data: ages2 },
    				{ name: 'economies', data: ages3 }
    			],
    			responsive: {
    				rules: [
    					{
    						condition: { maxWidth: 500 },
    						chartOptions: {
    							legend: {
    								layout: "horizontal",
    								align: "center",
    								verticalAlign: "bottom"
    							}
    						}
    					}
    				]
    			}
    		});
    	}

    	onMount(getData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MyGraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		expos,
    		escos,
    		economies,
    		country,
    		year,
    		tot_esco,
    		expo_m,
    		expo_tec,
    		percapita,
    		tot_man,
    		tot_wom,
    		currency,
    		currentprices,
    		ages1,
    		ages2,
    		ages3,
    		getData,
    		loadGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('expos' in $$props) expos = $$props.expos;
    		if ('escos' in $$props) escos = $$props.escos;
    		if ('economies' in $$props) economies = $$props.economies;
    		if ('country' in $$props) country = $$props.country;
    		if ('year' in $$props) year = $$props.year;
    		if ('tot_esco' in $$props) tot_esco = $$props.tot_esco;
    		if ('expo_m' in $$props) expo_m = $$props.expo_m;
    		if ('expo_tec' in $$props) expo_tec = $$props.expo_tec;
    		if ('percapita' in $$props) percapita = $$props.percapita;
    		if ('tot_man' in $$props) tot_man = $$props.tot_man;
    		if ('tot_wom' in $$props) tot_wom = $$props.tot_wom;
    		if ('currency' in $$props) currency = $$props.currency;
    		if ('currentprices' in $$props) currentprices = $$props.currentprices;
    		if ('ages1' in $$props) ages1 = $$props.ages1;
    		if ('ages2' in $$props) ages2 = $$props.ages2;
    		if ('ages3' in $$props) ages3 = $$props.ages3;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadGraph];
    }

    class MyGraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyGraph",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\front\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 39, 0, 1118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		'/': Home,
    		"/info": Info,
    		"/esco-stats": Esco,
    		"/esco/:country/:year": Editesco_1,
    		"/graphesco": MyGraphesco,
    		"/economies": Economies,
    		"/economies/:country/:year": EditEconomies_1,
    		"/economies-graph": MyGraphEconomies,
    		"/expo": Expo,
    		"/expo/:country/:year": EditExpo_1,
    		"/graphexpo": ExpoGraph,
    		"/graph": MyGraph
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		Info,
    		esco: Esco,
    		Editesco: Editesco_1,
    		MyGraphesco,
    		economies: Economies,
    		EditEconomies: EditEconomies_1,
    		MyGraphEconomies,
    		Expo,
    		EditExpo: EditExpo_1,
    		ExpoGraph,
    		MyGraph,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'SOS2122-25'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
