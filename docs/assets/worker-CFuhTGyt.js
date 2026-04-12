(function() {
	var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, a = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty, i = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s = (i, s, u) => (u = null != i ? e(a(i)) : {}, ((e, a, i, s) => {
		if (a && "object" == typeof a || "function" == typeof a) for (var u, l = r(a), c = 0, d = l.length; c < d; c++) u = l[c], o.call(e, u) || u === i || t(e, u, {
			get: ((e) => a[e]).bind(null, u),
			enumerable: !(s = n(a, u)) || s.enumerable
		});
		return e;
	})(!s && i && i.__esModule ? u : t(u, "default", {
		value: i,
		enumerable: !0
	}), i)), u = i((e, t) => {
		t.exports = {};
	}), l = i((e, t) => {
		var n = e, r = function(e) {
			"use strict";
			var t, n = "undefined" != typeof document ? document.currentScript : null;
			e.LuaReturn = void 0, (t = e.LuaReturn || (e.LuaReturn = {}))[t.Ok = 0] = "Ok", t[t.Yield = 1] = "Yield", t[t.ErrorRun = 2] = "ErrorRun", t[t.ErrorSyntax = 3] = "ErrorSyntax", t[t.ErrorMem = 4] = "ErrorMem", t[t.ErrorErr = 5] = "ErrorErr", t[t.ErrorFile = 6] = "ErrorFile";
			const r = 1e6, a = -1001e3;
			var o, i, l, c;
			e.LuaType = void 0, (o = e.LuaType || (e.LuaType = {}))[o.None = -1] = "None", o[o.Nil = 0] = "Nil", o[o.Boolean = 1] = "Boolean", o[o.LightUserdata = 2] = "LightUserdata", o[o.Number = 3] = "Number", o[o.String = 4] = "String", o[o.Table = 5] = "Table", o[o.Function = 6] = "Function", o[o.Userdata = 7] = "Userdata", o[o.Thread = 8] = "Thread", e.LuaEventCodes = void 0, (i = e.LuaEventCodes || (e.LuaEventCodes = {}))[i.Call = 0] = "Call", i[i.Ret = 1] = "Ret", i[i.Line = 2] = "Line", i[i.Count = 3] = "Count", i[i.TailCall = 4] = "TailCall", e.LuaEventMasks = void 0, (l = e.LuaEventMasks || (e.LuaEventMasks = {}))[l.Call = 1] = "Call", l[l.Ret = 2] = "Ret", l[l.Line = 4] = "Line", l[l.Count = 8] = "Count", e.LuaLibraries = void 0, (c = e.LuaLibraries || (e.LuaLibraries = {})).Base = "_G", c.Coroutine = "coroutine", c.Table = "table", c.IO = "io", c.OS = "os", c.String = "string", c.UTF8 = "utf8", c.Math = "math", c.Debug = "debug", c.Package = "package";
			class d extends Error {}
			class p {
				constructor(e, t) {
					this.target = e, this.options = t;
				}
			}
			class h extends Number {}
			class f extends Array {}
			class m {
				constructor(e, t, n, r) {
					this.closed = !1, this.lua = e, this.typeExtensions = t, this.address = n, this.parent = r;
				}
				newThread() {
					const e = this.lua.lua_newthread(this.address);
					if (!e) throw new Error("lua_newthread returned a null pointer");
					return new m(this.lua, this.typeExtensions, e, this.parent || this);
				}
				resetThread() {
					this.assertOk(this.lua.lua_resetthread(this.address));
				}
				loadString(e, t) {
					const n = this.lua.module.lengthBytesUTF8(e), r = n + 1, a = this.lua.module._malloc(r);
					try {
						this.lua.module.stringToUTF8(e, a, r), this.assertOk(this.lua.luaL_loadbufferx(this.address, a, n, null != t ? t : a, null));
					} finally {
						this.lua.module._free(a);
					}
				}
				loadFile(e) {
					this.assertOk(this.lua.luaL_loadfilex(this.address, e, null));
				}
				resume(e = 0) {
					const t = this.lua.module._malloc(4);
					try {
						return this.lua.module.setValue(t, 0, "i32"), {
							result: this.lua.lua_resume(this.address, null, e, t),
							resultCount: this.lua.module.getValue(t, "i32")
						};
					} finally {
						this.lua.module._free(t);
					}
				}
				getTop() {
					return this.lua.lua_gettop(this.address);
				}
				setTop(e) {
					this.lua.lua_settop(this.address, e);
				}
				remove(e) {
					return this.lua.lua_remove(this.address, e);
				}
				setField(e, t, n) {
					e = this.lua.lua_absindex(this.address, e), this.pushValue(n), this.lua.lua_setfield(this.address, e, t);
				}
				async run(t = 0, n) {
					const r = this.timeout;
					try {
						void 0 !== (null == n ? void 0 : n.timeout) && this.setTimeout(Date.now() + n.timeout);
						let r = this.resume(t);
						for (; r.result === e.LuaReturn.Yield;) {
							if (this.timeout && Date.now() > this.timeout) throw r.resultCount > 0 && this.pop(r.resultCount), new d("thread timeout exceeded");
							if (r.resultCount > 0) {
								const e = this.getValue(-1);
								this.pop(r.resultCount), e === Promise.resolve(e) ? await e : await new Promise((e) => setImmediate(e));
							} else await new Promise((e) => setImmediate(e));
							r = this.resume(0);
						}
						return this.assertOk(r.result), this.getStackValues();
					} finally {
						void 0 !== (null == n ? void 0 : n.timeout) && this.setTimeout(r);
					}
				}
				runSync(e = 0) {
					const t = this.getTop() - e - 1;
					return this.assertOk(this.lua.lua_pcallk(this.address, e, -1, 0, 0, null)), this.getStackValues(t);
				}
				pop(e = 1) {
					this.lua.lua_pop(this.address, e);
				}
				call(t, ...n) {
					const r = this.lua.lua_getglobal(this.address, t);
					if (r !== e.LuaType.Function) throw new Error(`A function of type '${r}' was pushed, expected is ${e.LuaType.Function}`);
					for (const e of n) this.pushValue(e);
					const a = this.getTop() - n.length - 1;
					return this.lua.lua_callk(this.address, n.length, -1, 0, null), this.getStackValues(a);
				}
				getStackValues(e = 0) {
					const t = this.getTop() - e, n = new f(t);
					for (let r = 0; r < t; r++) n[r] = this.getValue(e + r + 1);
					return n;
				}
				stateToThread(e) {
					var t;
					return e === (null === (t = this.parent) || void 0 === t ? void 0 : t.address) ? this.parent : new m(this.lua, this.typeExtensions, e, this.parent || this);
				}
				pushValue(e, t) {
					const n = this.getValueDecorations(e), r = n.target;
					if (r instanceof m) return void (1 !== this.lua.lua_pushthread(r.address) && this.lua.lua_xmove(r.address, this.address, 1));
					const a = this.getTop();
					switch (typeof r) {
						case "undefined":
							this.lua.lua_pushnil(this.address);
							break;
						case "number":
							Number.isInteger(r) ? this.lua.lua_pushinteger(this.address, BigInt(r)) : this.lua.lua_pushnumber(this.address, r);
							break;
						case "string":
							this.lua.lua_pushstring(this.address, r);
							break;
						case "boolean":
							this.lua.lua_pushboolean(this.address, r ? 1 : 0);
							break;
						default: if (!this.typeExtensions.find((e) => e.extension.pushValue(this, n, t))) throw new Error(`The type '${typeof r}' is not supported by Lua`);
					}
					if (n.options.metatable && this.setMetatable(-1, n.options.metatable), this.getTop() !== a + 1) throw new Error(`pushValue expected stack size ${a + 1}, got ${this.getTop()}`);
				}
				setMetatable(e, t) {
					if (e = this.lua.lua_absindex(this.address, e), this.lua.lua_getmetatable(this.address, e)) {
						this.pop(1);
						const t = this.getMetatableName(e);
						throw new Error(`data already has associated metatable: ${t || "unknown name"}`);
					}
					this.pushValue(t), this.lua.lua_setmetatable(this.address, e);
				}
				getMetatableName(t) {
					const n = this.lua.luaL_getmetafield(this.address, t, "__name");
					if (n === e.LuaType.Nil) return;
					if (n !== e.LuaType.String) return void this.pop(1);
					const r = this.lua.lua_tolstring(this.address, -1, null);
					return this.pop(1), r;
				}
				getValue(t, n, r) {
					t = this.lua.lua_absindex(this.address, t);
					const a = null != n ? n : this.lua.lua_type(this.address, t);
					switch (a) {
						case e.LuaType.None: return;
						case e.LuaType.Nil: return null;
						case e.LuaType.Number: return this.lua.lua_tonumberx(this.address, t, null);
						case e.LuaType.String: return this.lua.lua_tolstring(this.address, t, null);
						case e.LuaType.Boolean: return Boolean(this.lua.lua_toboolean(this.address, t));
						case e.LuaType.Thread: return this.stateToThread(this.lua.lua_tothread(this.address, t));
						default: {
							let n;
							a !== e.LuaType.Table && a !== e.LuaType.Userdata || (n = this.getMetatableName(t));
							const o = this.typeExtensions.find((e) => e.extension.isType(this, t, a, n));
							return o ? o.extension.getValue(this, t, r) : (console.warn(`The type '${this.lua.lua_typename(this.address, a)}' returned is not supported on JS`), new h(this.lua.lua_topointer(this.address, t)));
						}
					}
				}
				close() {
					this.isClosed() || (this.hookFunctionPointer && this.lua.module.removeFunction(this.hookFunctionPointer), this.closed = !0);
				}
				setTimeout(t) {
					t && t > 0 ? (this.hookFunctionPointer || (this.hookFunctionPointer = this.lua.module.addFunction(() => {
						Date.now() > t && (this.pushValue(new d("thread timeout exceeded")), this.lua.lua_error(this.address));
					}, "vii")), this.lua.lua_sethook(this.address, this.hookFunctionPointer, e.LuaEventMasks.Count, 1e3), this.timeout = t) : this.hookFunctionPointer && (this.hookFunctionPointer = void 0, this.timeout = void 0, this.lua.lua_sethook(this.address, null, 0, 0));
				}
				getTimeout() {
					return this.timeout;
				}
				getPointer(e) {
					return new h(this.lua.lua_topointer(this.address, e));
				}
				isClosed() {
					var e;
					return !this.address || this.closed || Boolean(null === (e = this.parent) || void 0 === e ? void 0 : e.isClosed());
				}
				indexToString(e) {
					const t = this.lua.luaL_tolstring(this.address, e, null);
					return this.pop(), t;
				}
				dumpStack(e = console.log) {
					const t = this.getTop();
					for (let n = 1; n <= t; n++) {
						const t = this.lua.lua_type(this.address, n);
						e(n, this.lua.lua_typename(this.address, t), this.getPointer(n), this.indexToString(n), this.getValue(n, t));
					}
				}
				assertOk(t) {
					if (t !== e.LuaReturn.Ok && t !== e.LuaReturn.Yield) {
						const r = e.LuaReturn[t], a = /* @__PURE__ */ new Error(`Lua Error(${r}/${t})`);
						if (this.getTop() > 0) if (t === e.LuaReturn.ErrorMem) a.message = this.lua.lua_tolstring(this.address, -1, null);
						else {
							const e = this.getValue(-1);
							e instanceof Error && (a.stack = e.stack), a.message = this.indexToString(-1);
						}
						if (t !== e.LuaReturn.ErrorMem) try {
							this.lua.luaL_traceback(this.address, this.address, null, 1);
							const e = this.lua.lua_tolstring(this.address, -1, null);
							"stack traceback:" !== e.trim() && (a.message = `${a.message}\n${e}`), this.pop(1);
						} catch (n) {
							console.warn("Failed to generate stack trace", n);
						}
						throw a;
					}
				}
				getValueDecorations(e) {
					return e instanceof p ? e : new p(e, {});
				}
			}
			class _ extends m {
				constructor(e, t) {
					if (t) {
						const t = { memoryUsed: 0 }, n = e.module.addFunction((n, r, a, o) => {
							if (0 === o) return r && (t.memoryUsed -= a, e.module._free(r)), 0;
							const i = r ? o - a : o, s = t.memoryUsed + i;
							if (o > a && t.memoryMax && s > t.memoryMax) return 0;
							const u = e.module._realloc(r, o);
							return u && (t.memoryUsed = s), u;
						}, "iiiii"), r = e.lua_newstate(n, null);
						if (!r) throw e.module.removeFunction(n), /* @__PURE__ */ new Error("lua_newstate returned a null pointer");
						super(e, [], r), this.memoryStats = t, this.allocatorFunctionPointer = n;
					} else super(e, [], e.luaL_newstate());
					if (this.isClosed()) throw new Error("Global state could not be created (probably due to lack of memory)");
				}
				close() {
					if (!this.isClosed()) {
						super.close(), this.lua.lua_close(this.address), this.allocatorFunctionPointer && this.lua.module.removeFunction(this.allocatorFunctionPointer);
						for (const e of this.typeExtensions) e.extension.close();
					}
				}
				registerTypeExtension(e, t) {
					this.typeExtensions.push({
						extension: t,
						priority: e
					}), this.typeExtensions.sort((e, t) => t.priority - e.priority);
				}
				loadLibrary(t) {
					switch (t) {
						case e.LuaLibraries.Base:
							this.lua.luaopen_base(this.address);
							break;
						case e.LuaLibraries.Coroutine:
							this.lua.luaopen_coroutine(this.address);
							break;
						case e.LuaLibraries.Table:
							this.lua.luaopen_table(this.address);
							break;
						case e.LuaLibraries.IO:
							this.lua.luaopen_io(this.address);
							break;
						case e.LuaLibraries.OS:
							this.lua.luaopen_os(this.address);
							break;
						case e.LuaLibraries.String:
						case e.LuaLibraries.UTF8:
							this.lua.luaopen_string(this.address);
							break;
						case e.LuaLibraries.Math:
							this.lua.luaopen_math(this.address);
							break;
						case e.LuaLibraries.Debug:
							this.lua.luaopen_debug(this.address);
							break;
						case e.LuaLibraries.Package: this.lua.luaopen_package(this.address);
					}
					this.lua.lua_setglobal(this.address, t);
				}
				get(e) {
					const t = this.lua.lua_getglobal(this.address, e), n = this.getValue(-1, t);
					return this.pop(), n;
				}
				set(e, t) {
					this.pushValue(t), this.lua.lua_setglobal(this.address, e);
				}
				getTable(t, n) {
					const r = this.getTop(), a = this.lua.lua_getglobal(this.address, t);
					try {
						if (a !== e.LuaType.Table) throw new TypeError(`Unexpected type in ${t}. Expected ${e.LuaType[e.LuaType.Table]}. Got ${e.LuaType[a]}.`);
						n(r + 1);
					} finally {
						this.getTop() !== r + 1 && console.warn(`getTable: expected stack size ${r} got ${this.getTop()}`), this.setTop(r);
					}
				}
				getMemoryUsed() {
					return this.getMemoryStatsRef().memoryUsed;
				}
				getMemoryMax() {
					return this.getMemoryStatsRef().memoryMax;
				}
				setMemoryMax(e) {
					this.getMemoryStatsRef().memoryMax = e;
				}
				getMemoryStatsRef() {
					if (!this.memoryStats) throw new Error("Memory allocations is not being traced, please build engine with { traceAllocations: true }");
					return this.memoryStats;
				}
			}
			class g {
				constructor(e, t) {
					this.thread = e, this.name = t;
				}
				isType(t, n, r, a) {
					return r === e.LuaType.Userdata && a === this.name;
				}
				getValue(e, t, n) {
					const r = e.lua.luaL_testudata(e.address, t, this.name);
					if (!r) throw new Error(`data does not have the expected metatable: ${this.name}`);
					const a = e.lua.module.getValue(r, "*");
					return e.lua.getRef(a);
				}
				pushValue(t, n, r) {
					const { target: a } = n, o = t.lua.ref(a), i = t.lua.lua_newuserdatauv(t.address, 4, 0);
					if (t.lua.module.setValue(i, o, "*"), e.LuaType.Nil === t.lua.luaL_getmetatable(t.address, this.name)) throw t.pop(2), /* @__PURE__ */ new Error(`metatable not found: ${this.name}`);
					return t.lua.lua_setmetatable(t.address, -2), !0;
				}
			}
			class b extends g {
				constructor(t, n) {
					if (super(t, "js_error"), this.gcPointer = t.lua.module.addFunction((n) => {
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name)) {
						const e = t.lua.lua_gettop(t.address);
						t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_setfield(t.address, e, "__metatable"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_setfield(t.address, e, "__gc"), t.pushValue((e, t) => "message" === t ? e.message : null), t.lua.lua_setfield(t.address, e, "__index"), t.pushValue((e) => e.message), t.lua.lua_setfield(t.address, e, "__tostring");
					}
					t.lua.lua_pop(t.address, 1), n && t.set("Error", { create: (e) => {
						if (e && "string" != typeof e) throw new Error("message must be a string");
						return new Error(e);
					} });
				}
				pushValue(e, t) {
					return t.target instanceof Error && super.pushValue(e, t);
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer);
				}
			}
			class y {
				constructor(e) {
					this.count = e;
				}
			}
			function w(e, t) {
				return new p(e, t);
			}
			class v extends g {
				constructor(t, n) {
					super(t, "js_function"), this.functionRegistry = "undefined" != typeof FinalizationRegistry ? new FinalizationRegistry((e) => {
						this.thread.isClosed() || this.thread.lua.luaL_unref(this.thread.address, a, e);
					}) : void 0, this.options = n, this.callbackContext = t.newThread(), this.callbackContextIndex = this.thread.lua.luaL_ref(t.address, a), this.functionRegistry || console.warn("FunctionTypeExtension: FinalizationRegistry not found. Memory leaks likely."), this.gcPointer = t.lua.module.addFunction((n) => {
						t.lua.luaL_checkudata(n, 1, this.name);
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name) && (t.lua.lua_pushstring(t.address, "__gc"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_settable(t.address, -3), t.lua.lua_pushstring(t.address, "__metatable"), t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_settable(t.address, -3)), t.lua.lua_pop(t.address, 1), this.functionWrapper = t.lua.module.addFunction((e) => {
						const n = t.stateToThread(e), r = t.lua.luaL_checkudata(e, t.lua.lua_upvalueindex(1), this.name), a = t.lua.module.getValue(r, "*"), { target: o, options: i } = t.lua.getRef(a), s = n.getTop(), u = [];
						if (i.receiveThread && u.push(n), i.receiveArgsQuantity) u.push(s);
						else for (let t = 1; t <= s; t++) {
							const e = n.getValue(t);
							1 === t && null != i && i.self && e === i.self || u.push(e);
						}
						try {
							const e = o.apply(null == i ? void 0 : i.self, u);
							if (void 0 === e) return 0;
							if (e instanceof y) return e.count;
							if (e instanceof f) {
								for (const t of e) n.pushValue(t);
								return e.length;
							}
							return n.pushValue(e), 1;
						} catch (l) {
							if (l === Infinity) throw l;
							return n.pushValue(l), n.lua.lua_error(n.address);
						}
					}, "ii");
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer), this.thread.lua.module.removeFunction(this.functionWrapper), this.callbackContext.close(), this.callbackContext.lua.luaL_unref(this.callbackContext.address, a, this.callbackContextIndex);
				}
				isType(t, n, r) {
					return r === e.LuaType.Function;
				}
				pushValue(t, n) {
					if ("function" != typeof n.target) return !1;
					const r = t.lua.ref(n), a = t.lua.lua_newuserdatauv(t.address, 4, 0);
					if (t.lua.module.setValue(a, r, "*"), e.LuaType.Nil === t.lua.luaL_getmetatable(t.address, this.name)) throw t.pop(1), t.lua.unref(r), /* @__PURE__ */ new Error(`metatable not found: ${this.name}`);
					return t.lua.lua_setmetatable(t.address, -2), t.lua.lua_pushcclosure(t.address, this.functionWrapper, 1), !0;
				}
				getValue(t, n) {
					var r;
					t.lua.lua_pushvalue(t.address, n);
					const o = t.lua.luaL_ref(t.address, a), i = (...t) => {
						var n;
						if (this.callbackContext.isClosed()) return void console.warn("Tried to call a function after closing lua state");
						const r = this.callbackContext.newThread();
						try {
							const i = r.lua.lua_rawgeti(r.address, a, BigInt(o));
							if (i !== e.LuaType.Function) {
								const t = r.lua.luaL_getmetafield(r.address, -1, "__call");
								if (r.pop(), t !== e.LuaType.Function) throw new Error(`A value of type '${i}' was pushed but it is not callable`);
							}
							for (const e of t) r.pushValue(e);
							!(null === (n = this.options) || void 0 === n) && n.functionTimeout && r.setTimeout(Date.now() + this.options.functionTimeout);
							const s = r.lua.lua_pcallk(r.address, t.length, 1, 0, 0, null);
							if (s === e.LuaReturn.Yield) throw new Error("cannot yield in callbacks from javascript");
							return r.assertOk(s), r.getTop() > 0 ? r.getValue(-1) : void 0;
						} finally {
							r.close(), this.callbackContext.pop();
						}
					};
					return null === (r = this.functionRegistry) || void 0 === r || r.register(i, o), i;
				}
			}
			class k extends g {
				constructor(t) {
					if (super(t, "js_null"), this.gcPointer = t.lua.module.addFunction((n) => {
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name)) {
						const e = t.lua.lua_gettop(t.address);
						t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_setfield(t.address, e, "__metatable"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_setfield(t.address, e, "__gc"), t.pushValue(() => null), t.lua.lua_setfield(t.address, e, "__index"), t.pushValue(() => "null"), t.lua.lua_setfield(t.address, e, "__tostring"), t.pushValue((e, t) => e === t), t.lua.lua_setfield(t.address, e, "__eq");
					}
					t.lua.lua_pop(t.address, 1), super.pushValue(t, new p({}, {})), t.lua.lua_setglobal(t.address, "null");
				}
				getValue(e, t) {
					if (!e.lua.luaL_testudata(e.address, t, this.name)) throw new Error(`data does not have the expected metatable: ${this.name}`);
					return null;
				}
				pushValue(e, t) {
					return null === (null == t ? void 0 : t.target) && (e.lua.lua_getglobal(e.address, "null"), !0);
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer);
				}
			}
			class E extends g {
				constructor(t, n) {
					if (super(t, "js_promise"), this.gcPointer = t.lua.module.addFunction((n) => {
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name)) {
						const e = t.lua.lua_gettop(t.address);
						t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_setfield(t.address, e, "__metatable"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_setfield(t.address, e, "__gc");
						const n = (e) => {
							if (Promise.resolve(e) !== e && "function" != typeof e.then) throw new Error("promise method called without self instance");
							return !0;
						};
						t.pushValue({
							next: (e, ...t) => n(e) && e.then(...t),
							catch: (e, ...t) => n(e) && e.catch(...t),
							finally: (e, ...t) => n(e) && e.finally(...t),
							await: w((e, r) => {
								if (n(r), e.address === t.address) throw new Error("cannot await in the main thread");
								let a;
								const o = r.then((e) => {
									a = {
										status: "fulfilled",
										value: e
									};
								}).catch((e) => {
									a = {
										status: "rejected",
										value: e
									};
								}), i = this.thread.lua.module.addFunction((n) => {
									if (!a) return t.lua.lua_yieldk(e.address, 0, 0, i);
									this.thread.lua.module.removeFunction(i);
									const r = t.stateToThread(n);
									if ("rejected" === a.status) return r.pushValue(a.value || /* @__PURE__ */ new Error("promise rejected with no error")), this.thread.lua.lua_error(n);
									if (a.value instanceof y) return a.value.count;
									if (a.value instanceof f) {
										for (const e of a.value) r.pushValue(e);
										return a.value.length;
									}
									return r.pushValue(a.value), 1;
								}, "iiii");
								return e.pushValue(o), new y(t.lua.lua_yieldk(e.address, 1, 0, i));
							}, { receiveThread: !0 })
						}), t.lua.lua_setfield(t.address, e, "__index"), t.pushValue((e, t) => e === t), t.lua.lua_setfield(t.address, e, "__eq");
					}
					t.lua.lua_pop(t.address, 1), n && t.set("Promise", {
						create: (e) => new Promise(e),
						all: (e) => {
							if (!Array.isArray(e)) throw new Error("argument must be an array of promises");
							return Promise.all(e.map((e) => Promise.resolve(e)));
						},
						resolve: (e) => Promise.resolve(e)
					});
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer);
				}
				pushValue(e, t) {
					return (Promise.resolve(t.target) === t.target || "function" == typeof t.target.then) && super.pushValue(e, t);
				}
			}
			function T(e, t) {
				return new p(e, t || {});
			}
			class S extends g {
				constructor(t) {
					if (super(t, "js_proxy"), this.gcPointer = t.lua.module.addFunction((n) => {
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name)) {
						const e = t.lua.lua_gettop(t.address);
						t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_setfield(t.address, e, "__metatable"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_setfield(t.address, e, "__gc"), t.pushValue((e, t) => {
							switch (typeof t) {
								case "number": t -= 1;
								case "string": break;
								default: throw new Error("Only strings or numbers can index js objects");
							}
							const n = e[t];
							return "function" == typeof n ? w(n, { self: e }) : n;
						}), t.lua.lua_setfield(t.address, e, "__index"), t.pushValue((e, t, n) => {
							switch (typeof t) {
								case "number": t -= 1;
								case "string": break;
								default: throw new Error("Only strings or numbers can index js objects");
							}
							e[t] = n;
						}), t.lua.lua_setfield(t.address, e, "__newindex"), t.pushValue((e) => {
							var t, n;
							return null !== (n = null === (t = e.toString) || void 0 === t ? void 0 : t.call(e)) && void 0 !== n ? n : typeof e;
						}), t.lua.lua_setfield(t.address, e, "__tostring"), t.pushValue((e) => e.length || 0), t.lua.lua_setfield(t.address, e, "__len"), t.pushValue((e) => {
							const t = Object.getOwnPropertyNames(e);
							let n = 0;
							return f.of(() => {
								const r = f.of(t[n], e[t[n]]);
								return n++, r;
							}, e, null);
						}), t.lua.lua_setfield(t.address, e, "__pairs"), t.pushValue((e, t) => e === t), t.lua.lua_setfield(t.address, e, "__eq"), t.pushValue((e, ...t) => (t[0] === e && t.shift(), e(...t))), t.lua.lua_setfield(t.address, e, "__call");
					}
					t.lua.lua_pop(t.address, 1);
				}
				isType(t, n, r, a) {
					return r === e.LuaType.Userdata && a === this.name;
				}
				getValue(e, t) {
					const n = e.lua.lua_touserdata(e.address, t), r = e.lua.module.getValue(n, "*");
					return e.lua.getRef(r);
				}
				pushValue(e, t) {
					var n;
					const { target: r, options: a } = t;
					if (void 0 === a.proxy) {
						if (null == r) return !1;
						if ("object" != typeof r && ("function" != typeof r || (null === (n = r.prototype) || void 0 === n ? void 0 : n.constructor) !== r || !r.toString().startsWith("class "))) return !1;
						if (Promise.resolve(r) === r || "function" == typeof r.then) return !1;
					} else if (!1 === a.proxy) return !1;
					return !a.metatable || a.metatable instanceof p ? super.pushValue(e, t) : (t.options.metatable = T(a.metatable, { proxy: !1 }), !1);
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer);
				}
			}
			class L extends g {
				constructor(e) {
					super(e, "js_table");
				}
				close() {}
				isType(t, n, r) {
					return r === e.LuaType.Table;
				}
				getValue(e, t, n) {
					const r = n || /* @__PURE__ */ new Map(), a = e.lua.lua_topointer(e.address, t);
					let o = r.get(a);
					if (!o) {
						const n = this.readTableKeys(e, t);
						o = n.length > 0 && n.every((e, t) => e === String(t + 1)) ? [] : {}, r.set(a, o), this.readTableValues(e, t, r, o);
					}
					return o;
				}
				pushValue(e, { target: t }, n) {
					if ("object" != typeof t || null === t) return !1;
					const r = n || /* @__PURE__ */ new Map(), o = r.get(t);
					if (void 0 !== o) return e.lua.lua_rawgeti(e.address, a, BigInt(o)), !0;
					try {
						const n = e.getTop() + 1, o = (n, o) => {
							e.lua.lua_createtable(e.address, n, o);
							const i = e.lua.luaL_ref(e.address, a);
							r.set(t, i), e.lua.lua_rawgeti(e.address, a, BigInt(i));
						};
						if (Array.isArray(t)) {
							o(t.length, 0);
							for (let a = 0; a < t.length; a++) e.pushValue(a + 1, r), e.pushValue(t[a], r), e.lua.lua_settable(e.address, n);
						} else {
							o(0, Object.getOwnPropertyNames(t).length);
							for (const a in t) e.pushValue(a, r), e.pushValue(t[a], r), e.lua.lua_settable(e.address, n);
						}
					} finally {
						if (void 0 === n) for (const t of r.values()) e.lua.luaL_unref(e.address, a, t);
					}
					return !0;
				}
				readTableKeys(e, t) {
					const n = [];
					for (e.lua.lua_pushnil(e.address); e.lua.lua_next(e.address, t);) {
						const t = e.indexToString(-2);
						n.push(t), e.pop();
					}
					return n;
				}
				readTableValues(e, t, n, r) {
					const a = Array.isArray(r);
					for (e.lua.lua_pushnil(e.address); e.lua.lua_next(e.address, t);) {
						const t = e.indexToString(-2), o = e.getValue(-1, void 0, n);
						a ? r.push(o) : r[t] = o, e.pop();
					}
				}
			}
			class O extends g {
				constructor(t) {
					if (super(t, "js_userdata"), this.gcPointer = t.lua.module.addFunction((n) => {
						const r = t.lua.luaL_checkudata(n, 1, this.name), a = t.lua.module.getValue(r, "*");
						return t.lua.unref(a), e.LuaReturn.Ok;
					}, "ii"), t.lua.luaL_newmetatable(t.address, this.name)) {
						const e = t.lua.lua_gettop(t.address);
						t.lua.lua_pushstring(t.address, "protected metatable"), t.lua.lua_setfield(t.address, e, "__metatable"), t.lua.lua_pushcclosure(t.address, this.gcPointer, 0), t.lua.lua_setfield(t.address, e, "__gc");
					}
					t.lua.lua_pop(t.address, 1);
				}
				isType(t, n, r, a) {
					return r === e.LuaType.Userdata && a === this.name;
				}
				getValue(e, t) {
					const n = e.lua.lua_touserdata(e.address, t), r = e.lua.module.getValue(n, "*");
					return e.lua.getRef(r);
				}
				pushValue(e, t) {
					return !!t.options.reference && super.pushValue(e, t);
				}
				close() {
					this.thread.lua.module.removeFunction(this.gcPointer);
				}
			}
			class x {
				constructor(e, { openStandardLibs: t = !0, injectObjects: n = !1, enableProxy: r = !0, traceAllocations: a = !1, functionTimeout: o } = {}) {
					var i;
					this.cmodule = e, this.global = new _(this.cmodule, a), this.global.registerTypeExtension(0, (i = this.global, new L(i))), this.global.registerTypeExtension(0, function(e, t) {
						return new v(e, t);
					}(this.global, { functionTimeout: o })), this.global.registerTypeExtension(1, function(e, t) {
						return new E(e, t);
					}(this.global, n)), n && this.global.registerTypeExtension(5, function(e) {
						return new k(e);
					}(this.global)), r ? this.global.registerTypeExtension(3, function(e) {
						return new S(e);
					}(this.global)) : this.global.registerTypeExtension(1, function(e, t) {
						return new b(e, t);
					}(this.global, n)), this.global.registerTypeExtension(4, function(e) {
						return new O(e);
					}(this.global)), t && this.cmodule.luaL_openlibs(this.global.address);
				}
				doString(e) {
					return this.callByteCode((t) => t.loadString(e));
				}
				doFile(e) {
					return this.callByteCode((t) => t.loadFile(e));
				}
				doStringSync(e) {
					return this.global.loadString(e), this.global.runSync()[0];
				}
				doFileSync(e) {
					return this.global.loadFile(e), this.global.runSync()[0];
				}
				async callByteCode(e) {
					const t = this.global.newThread(), n = this.global.getTop();
					try {
						e(t);
						const n = await t.run(0);
						return n.length > 0 ? (this.cmodule.lua_xmove(t.address, this.global.address, n.length), this.global.getValue(this.global.getTop() - n.length + 1)) : void 0;
					} finally {
						this.global.remove(n);
					}
				}
			}
			var z, P = (z = "undefined" == typeof document && "undefined" == typeof location ? u().pathToFileURL(__filename).href : "undefined" == typeof document ? location.href : n && n.src || new URL("index.js", document.baseURI).href, async function(e = {}) {
				var t, r, a = e;
				a.ready = new Promise((e, n) => {
					t = e, r = n;
				}), "_malloc _free _realloc _luaL_checkversion_ _luaL_getmetafield _luaL_callmeta _luaL_tolstring _luaL_argerror _luaL_typeerror _luaL_checklstring _luaL_optlstring _luaL_checknumber _luaL_optnumber _luaL_checkinteger _luaL_optinteger _luaL_checkstack _luaL_checktype _luaL_checkany _luaL_newmetatable _luaL_setmetatable _luaL_testudata _luaL_checkudata _luaL_where _luaL_fileresult _luaL_execresult _luaL_ref _luaL_unref _luaL_loadfilex _luaL_loadbufferx _luaL_loadstring _luaL_newstate _luaL_len _luaL_addgsub _luaL_gsub _luaL_setfuncs _luaL_getsubtable _luaL_traceback _luaL_requiref _luaL_buffinit _luaL_prepbuffsize _luaL_addlstring _luaL_addstring _luaL_addvalue _luaL_pushresult _luaL_pushresultsize _luaL_buffinitsize _lua_newstate _lua_close _lua_newthread _lua_resetthread _lua_atpanic _lua_version _lua_absindex _lua_gettop _lua_settop _lua_pushvalue _lua_rotate _lua_copy _lua_checkstack _lua_xmove _lua_isnumber _lua_isstring _lua_iscfunction _lua_isinteger _lua_isuserdata _lua_type _lua_typename _lua_tonumberx _lua_tointegerx _lua_toboolean _lua_tolstring _lua_rawlen _lua_tocfunction _lua_touserdata _lua_tothread _lua_topointer _lua_arith _lua_rawequal _lua_compare _lua_pushnil _lua_pushnumber _lua_pushinteger _lua_pushlstring _lua_pushstring _lua_pushcclosure _lua_pushboolean _lua_pushlightuserdata _lua_pushthread _lua_getglobal _lua_gettable _lua_getfield _lua_geti _lua_rawget _lua_rawgeti _lua_rawgetp _lua_createtable _lua_newuserdatauv _lua_getmetatable _lua_getiuservalue _lua_setglobal _lua_settable _lua_setfield _lua_seti _lua_rawset _lua_rawseti _lua_rawsetp _lua_setmetatable _lua_setiuservalue _lua_callk _lua_pcallk _lua_load _lua_dump _lua_yieldk _lua_resume _lua_status _lua_isyieldable _lua_setwarnf _lua_warning _lua_error _lua_next _lua_concat _lua_len _lua_stringtonumber _lua_getallocf _lua_setallocf _lua_toclose _lua_closeslot _lua_getstack _lua_getinfo _lua_getlocal _lua_setlocal _lua_getupvalue _lua_setupvalue _lua_upvalueid _lua_upvaluejoin _lua_sethook _lua_gethook _lua_gethookmask _lua_gethookcount _lua_setcstacklimit _luaopen_base _luaopen_coroutine _luaopen_table _luaopen_io _luaopen_os _luaopen_string _luaopen_utf8 _luaopen_math _luaopen_debug _luaopen_package _luaL_openlibs _memory ___indirect_function_table _fflush onRuntimeInitialized".split(" ").forEach((e) => {
					Object.getOwnPropertyDescriptor(a.ready, e) || Object.defineProperty(a.ready, e, {
						get: () => K("You are getting " + e + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
						set: () => K("You are setting " + e + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
					});
				});
				var o = Object.assign({}, a), i = "./this.program", l = (e, t) => {
					throw t;
				}, c = "object" == typeof window, d = "function" == typeof importScripts, p = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, h = !c && !p && !d;
				if (a.ENVIRONMENT) throw Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
				var f, m, _, g = "";
				if (p) {
					if ("undefined" == typeof process || !process.release || "node" !== process.release.name) throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
					var b = process.versions.node, y = b.split(".").slice(0, 3);
					if (16e4 > (y = 1e4 * y[0] + 100 * y[1] + 1 * y[2].split("-")[0])) throw Error("This emscripten-generated code requires node v16.0.0 (detected v" + b + ")");
					const { createRequire: e } = await Promise.resolve().then(() => s(u()));
					var w = e("undefined" == typeof document && "undefined" == typeof location ? u().pathToFileURL(__filename).href : "undefined" == typeof document ? location.href : n && n.src || new URL("index.js", document.baseURI).href), v = w("fs"), k = w("path");
					g = d ? k.dirname(g) + "/" : w("url").fileURLToPath(new URL("./", "undefined" == typeof document && "undefined" == typeof location ? u().pathToFileURL(__filename).href : "undefined" == typeof document ? location.href : n && n.src || new URL("index.js", document.baseURI).href)), f = (e, t) => (e = te(e) ? new URL(e) : k.normalize(e), v.readFileSync(e, t ? void 0 : "utf8")), _ = (e) => ((e = f(e, !0)).buffer || (e = new Uint8Array(e)), N(e.buffer), e), m = (e, t, n, r = !0) => {
						e = te(e) ? new URL(e) : k.normalize(e), v.readFile(e, r ? void 0 : "utf8", (e, a) => {
							e ? n(e) : t(r ? a.buffer : a);
						});
					}, !a.thisProgram && 1 < process.argv.length && (i = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), l = (e, t) => {
						throw process.exitCode = e, t;
					}, a.inspect = () => "[Emscripten Module object]";
				} else if (h) {
					if ("object" == typeof process && "function" == typeof w || "object" == typeof window || "function" == typeof importScripts) throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
					"undefined" != typeof read && (f = read), _ = (e) => "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (N("object" == typeof (e = read(e, "binary"))), e), m = (e, t) => {
						setTimeout(() => t(_(e)));
					}, "undefined" == typeof clearTimeout && (globalThis.clearTimeout = () => {}), "undefined" == typeof setTimeout && (globalThis.setTimeout = (e) => "function" == typeof e ? e() : K()), "function" == typeof quit && (l = (e, t) => {
						throw setTimeout(() => {
							if (!(t instanceof de)) {
								let e = t;
								t && "object" == typeof t && t.stack && (e = [t, t.stack]), T(`exiting due to exception: ${e}`);
							}
							quit(e);
						}), t;
					}), "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print);
				} else {
					if (!c && !d) throw Error("environment detection error");
					if (d ? g = self.location.href : "undefined" != typeof document && document.currentScript && (g = document.currentScript.src), z && (g = z), g = 0 !== g.indexOf("blob:") ? g.substr(0, g.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", "object" != typeof window && "function" != typeof importScripts) throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
					f = (e) => {
						var t = new XMLHttpRequest();
						return t.open("GET", e, !1), t.send(null), t.responseText;
					}, d && (_ = (e) => {
						var t = new XMLHttpRequest();
						return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
					}), m = (e, t, n) => {
						var r = new XMLHttpRequest();
						r.open("GET", e, !0), r.responseType = "arraybuffer", r.onload = () => {
							200 == r.status || 0 == r.status && r.response ? t(r.response) : n();
						}, r.onerror = n, r.send(null);
					};
				}
				var E = console.log.bind(console), T = console.error.bind(console);
				Object.assign(a, o), o = null, se("ENVIRONMENT"), se("GL_MAX_TEXTURE_IMAGE_UNITS"), se("SDL_canPlayWithWebAudio"), se("SDL_numSimultaneouslyQueuedBuffers"), se("INITIAL_MEMORY"), se("wasmMemory"), se("arguments"), se("buffer"), se("canvas"), se("doNotCaptureKeyboard"), se("dynamicLibraries"), se("elementPointerLock"), se("extraStackTrace"), se("forcedAspectRatio"), se("instantiateWasm"), se("keyboardListeningElement"), se("freePreloadedMediaOnUse"), se("loadSplitModule"), se("logReadFiles"), se("mainScriptUrlOrBlob"), se("mem"), se("monitorRunDependencies"), se("noExitRuntime"), se("noInitialRun"), se("onAbort"), se("onCustomMessage"), se("onExit"), se("onFree"), se("onFullScreen"), se("onMalloc"), se("onRealloc"), se("onRuntimeInitialized"), se("postMainLoop"), se("postRun"), se("preInit"), se("preMainLoop"), se("preinitializedWebGLContext"), se("memoryInitializerRequest"), se("preloadPlugins"), se("print"), se("printErr"), se("quit"), se("setStatus"), se("statusMessage"), se("stderr"), se("stdin"), se("stdout"), se("thisProgram"), se("wasm"), se("wasmBinary"), se("websocket"), se("fetchSettings"), ie("arguments", "arguments_"), ie("thisProgram", "thisProgram"), ie("quit", "quit_"), N(void 0 === a.memoryInitializerPrefixURL, "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), N(void 0 === a.pthreadMainPrefixURL, "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), N(void 0 === a.cdInitializerPrefixURL, "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), N(void 0 === a.filePackagePrefixURL, "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), N(void 0 === a.read, "Module.read option was removed (modify read_ in JS)"), N(void 0 === a.readAsync, "Module.readAsync option was removed (modify readAsync in JS)"), N(void 0 === a.readBinary, "Module.readBinary option was removed (modify readBinary in JS)"), N(void 0 === a.setWindowTitle, "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), N(void 0 === a.TOTAL_MEMORY, "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), ie("asm", "wasmExports"), ie("read", "read_"), ie("readAsync", "readAsync"), ie("readBinary", "readBinary"), ie("setWindowTitle", "setWindowTitle"), N(!h, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable."), ie("wasmBinary", "wasmBinary"), "object" != typeof WebAssembly && K("no native wasm support detected");
				var S, L, O, x, P, R, I, F, A, M = !1;
				function N(e, t) {
					e || K("Assertion failed" + (t ? ": " + t : ""));
				}
				function D() {
					var e = S.buffer;
					a.HEAP8 = L = new Int8Array(e), a.HEAP16 = x = new Int16Array(e), a.HEAPU8 = O = new Uint8Array(e), a.HEAPU16 = new Uint16Array(e), a.HEAP32 = P = new Int32Array(e), a.HEAPU32 = R = new Uint32Array(e), a.HEAPF32 = I = new Float32Array(e), a.HEAPF64 = A = new Float64Array(e), a.HEAP64 = F = new BigInt64Array(e), a.HEAPU64 = new BigUint64Array(e);
				}
				function C() {
					if (!M) {
						var e = Mt();
						0 == e && (e += 4);
						var t = R[e >> 2], n = R[e + 4 >> 2];
						34821223 == t && 2310721022 == n || K(`Stack overflow! Stack cookie has been overwritten at ${he(e)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${he(n)} ${he(t)}`), 1668509029 != R[0] && K("Runtime error: The application has corrupted its heap memory area (address zero)!");
					}
				}
				N(!a.STACK_SIZE, "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), N("undefined" != typeof Int32Array && "undefined" != typeof Float64Array && null != Int32Array.prototype.subarray && null != Int32Array.prototype.set, "JS engine does not provide full typed array support"), N(!a.wasmMemory, "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), N(!a.INITIAL_MEMORY, "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
				var j = new Int16Array(1), $ = new Int8Array(j.buffer);
				if (j[0] = 25459, 115 !== $[0] || 99 !== $[1]) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
				var U = [], Z = [], B = [], V = !1;
				N(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), N(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), N(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), N(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
				var H = 0, W = null, Y = null, J = {};
				function q(e) {
					for (var t = e;;) {
						if (!J[e]) return e;
						e = t + Math.random();
					}
				}
				function G(e) {
					H++, e ? (N(!J[e]), J[e] = 1, null === W && "undefined" != typeof setInterval && (W = setInterval(() => {
						if (M) clearInterval(W), W = null;
						else {
							var e, t = !1;
							for (e in J) t || (t = !0, T("still waiting on run dependencies:")), T(`dependency: ${e}`);
							t && T("(end of list)");
						}
					}, 1e4))) : T("warning: run dependency added without ID");
				}
				function X(e) {
					H--, e ? (N(J[e]), delete J[e]) : T("warning: run dependency removed without ID"), 0 == H && (null !== W && (clearInterval(W), W = null), Y && (e = Y, Y = null, e()));
				}
				function K(e) {
					throw T(e = "Aborted(" + e + ")"), M = !0, e = new WebAssembly.RuntimeError(e), r(e), e;
				}
				var Q, ee = (e) => e.startsWith("data:application/octet-stream;base64,"), te = (e) => e.startsWith("file://");
				function ne(e) {
					return function() {
						N(V, `native function \`${e}\` called before runtime initialization`);
						var t = xt[e];
						return N(t, `exported native function \`${e}\` not found`), t.apply(null, arguments);
					};
				}
				if (a.locateFile) {
					if (!ee(Q = "glue.wasm")) {
						var re = Q;
						Q = a.locateFile ? a.locateFile(re, g) : g + re;
					}
				} else Q = new URL("glue.wasm", "undefined" == typeof document && "undefined" == typeof location ? u().pathToFileURL(__filename).href : "undefined" == typeof document ? location.href : n && n.src || new URL("index.js", document.baseURI).href).href;
				function ae(e) {
					if (_) return _(e);
					throw "both async and sync fetching of the wasm failed";
				}
				function oe(e, t, n) {
					return function(e) {
						if (c || d) {
							if ("function" == typeof fetch && !te(e)) return fetch(e, { credentials: "same-origin" }).then((t) => {
								if (!t.ok) throw "failed to load wasm binary file at '" + e + "'";
								return t.arrayBuffer();
							}).catch(() => ae(e));
							if (m) return new Promise((t, n) => {
								m(e, (e) => t(new Uint8Array(e)), n);
							});
						}
						return Promise.resolve().then(() => ae(e));
					}(e).then((e) => WebAssembly.instantiate(e, t)).then((e) => e).then(n, (e) => {
						T(`failed to asynchronously prepare wasm: ${e}`), te(Q) && T(`warning: Loading from a file URI (${Q}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), K(e);
					});
				}
				function ie(e, t) {
					Object.getOwnPropertyDescriptor(a, e) || Object.defineProperty(a, e, {
						configurable: !0,
						get() {
							K(`\`Module.${e}\` has been replaced by \`${t}\` (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)`);
						}
					});
				}
				function se(e) {
					Object.getOwnPropertyDescriptor(a, e) && K(`\`Module.${e}\` was supplied but \`${e}\` not included in INCOMING_MODULE_JS_API`);
				}
				function ue(e) {
					return "FS_createPath" === e || "FS_createDataFile" === e || "FS_createPreloadedFile" === e || "FS_unlink" === e || "addRunDependency" === e || "FS_createLazyFile" === e || "FS_createDevice" === e || "removeRunDependency" === e;
				}
				function le(e, t) {
					"undefined" != typeof globalThis && Object.defineProperty(globalThis, e, {
						configurable: !0,
						get() {
							fe(`\`${e}\` is not longer defined by emscripten. ${t}`);
						}
					});
				}
				function ce(e) {
					Object.getOwnPropertyDescriptor(a, e) || Object.defineProperty(a, e, {
						configurable: !0,
						get() {
							var t = `'${e}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
							ue(e) && (t += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), K(t);
						}
					});
				}
				function de(e) {
					this.name = "ExitStatus", this.message = `Program terminated with exit(${e})`, this.status = e;
				}
				le("buffer", "Please use HEAP8.buffer or wasmMemory.buffer"), le("asm", "Please use wasmExports instead");
				var pe, he = (e) => (N("number" == typeof e), "0x" + (e >>> 0).toString(16).padStart(8, "0")), fe = (e) => {
					pe ||= {}, pe[e] || (pe[e] = 1, p && (e = "warning: " + e), T(e));
				}, me = (e, t) => {
					for (var n = 0, r = e.length - 1; 0 <= r; r--) {
						var a = e[r];
						"." === a ? e.splice(r, 1) : ".." === a ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--);
					}
					if (t) for (; n; n--) e.unshift("..");
					return e;
				}, _e = (e) => {
					var t = "/" === e.charAt(0), n = "/" === e.substr(-1);
					return (e = me(e.split("/").filter((e) => !!e), !t).join("/")) || t || (e = "."), e && n && (e += "/"), (t ? "/" : "") + e;
				}, ge = (e) => {
					var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1);
					return e = t[0], t = t[1], e || t ? (t &&= t.substr(0, t.length - 1), e + t) : ".";
				}, be = (e) => {
					if ("/" === e) return "/";
					var t = (e = (e = _e(e)).replace(/\/$/, "")).lastIndexOf("/");
					return -1 === t ? e : e.substr(t + 1);
				}, ye = (e) => (ye = (() => {
					if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) return (e) => crypto.getRandomValues(e);
					if (p) try {
						var e = w("crypto");
						if (e.randomFillSync) return (t) => e.randomFillSync(t);
						var t = e.randomBytes;
						return (e) => (e.set(t(e.byteLength)), e);
					} catch (n) {}
					K("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
				})())(e);
				function we() {
					for (var e = "", t = !1, n = arguments.length - 1; -1 <= n && !t; n--) {
						if ("string" != typeof (t = 0 <= n ? arguments[n] : ot.cwd())) throw new TypeError("Arguments to path.resolve must be strings");
						if (!t) return "";
						e = t + "/" + e, t = "/" === t.charAt(0);
					}
					return (t ? "/" : "") + (e = me(e.split("/").filter((e) => !!e), !t).join("/")) || ".";
				}
				var ve = (e, t) => {
					function n(e) {
						for (var t = 0; t < e.length && "" === e[t]; t++);
						for (var n = e.length - 1; 0 <= n && "" === e[n]; n--);
						return t > n ? [] : e.slice(t, n - t + 1);
					}
					e = we(e).substr(1), t = we(t).substr(1), e = n(e.split("/")), t = n(t.split("/"));
					for (var r = Math.min(e.length, t.length), a = r, o = 0; o < r; o++) if (e[o] !== t[o]) {
						a = o;
						break;
					}
					for (r = [], o = a; o < e.length; o++) r.push("..");
					return (r = r.concat(t.slice(a))).join("/");
				}, ke = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, Ee = (e, t) => {
					for (var n = t + NaN, r = t; e[r] && !(r >= n);) ++r;
					if (16 < r - t && e.buffer && ke) return ke.decode(e.subarray(t, r));
					for (n = ""; t < r;) {
						var a = e[t++];
						if (128 & a) {
							var o = 63 & e[t++];
							if (192 == (224 & a)) n += String.fromCharCode((31 & a) << 6 | o);
							else {
								var i = 63 & e[t++];
								224 == (240 & a) ? a = (15 & a) << 12 | o << 6 | i : (240 != (248 & a) && fe("Invalid UTF-8 leading byte " + he(a) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), a = (7 & a) << 18 | o << 12 | i << 6 | 63 & e[t++]), 65536 > a ? n += String.fromCharCode(a) : (a -= 65536, n += String.fromCharCode(55296 | a >> 10, 56320 | 1023 & a));
							}
						} else n += String.fromCharCode(a);
					}
					return n;
				}, Te = [], Se = (e) => {
					for (var t = 0, n = 0; n < e.length; ++n) {
						var r = e.charCodeAt(n);
						127 >= r ? t++ : 2047 >= r ? t += 2 : 55296 <= r && 57343 >= r ? (t += 4, ++n) : t += 3;
					}
					return t;
				}, Le = (e, t, n, r) => {
					if (N("string" == typeof e, `stringToUTF8Array expects a string (got ${typeof e})`), !(0 < r)) return 0;
					var a = n;
					r = n + r - 1;
					for (var o = 0; o < e.length; ++o) {
						var i = e.charCodeAt(o);
						if (55296 <= i && 57343 >= i && (i = 65536 + ((1023 & i) << 10) | 1023 & e.charCodeAt(++o)), 127 >= i) {
							if (n >= r) break;
							t[n++] = i;
						} else {
							if (2047 >= i) {
								if (n + 1 >= r) break;
								t[n++] = 192 | i >> 6;
							} else {
								if (65535 >= i) {
									if (n + 2 >= r) break;
									t[n++] = 224 | i >> 12;
								} else {
									if (n + 3 >= r) break;
									1114111 < i && fe("Invalid Unicode code point " + he(i) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), t[n++] = 240 | i >> 18, t[n++] = 128 | i >> 12 & 63;
								}
								t[n++] = 128 | i >> 6 & 63;
							}
							t[n++] = 128 | 63 & i;
						}
					}
					return t[n] = 0, n - a;
				};
				function Oe(e, t) {
					var n = Array(Se(e) + 1);
					return e = Le(e, n, 0, n.length), t && (n.length = e), n;
				}
				var xe = [];
				function ze(e, t) {
					xe[e] = {
						input: [],
						output: [],
						K: t
					}, $e(e, Pe);
				}
				var Pe = {
					open(e) {
						var t = xe[e.node.rdev];
						if (!t) throw new ot.g(43);
						e.tty = t, e.seekable = !1;
					},
					close(e) {
						e.tty.K.fsync(e.tty);
					},
					fsync(e) {
						e.tty.K.fsync(e.tty);
					},
					read(e, t, n, r) {
						if (!e.tty || !e.tty.K.ra) throw new ot.g(60);
						for (var a = 0, o = 0; o < r; o++) {
							try {
								var i = e.tty.K.ra(e.tty);
							} catch (s) {
								throw new ot.g(29);
							}
							if (void 0 === i && 0 === a) throw new ot.g(6);
							if (null == i) break;
							a++, t[n + o] = i;
						}
						return a && (e.node.timestamp = Date.now()), a;
					},
					write(e, t, n, r) {
						if (!e.tty || !e.tty.K.ia) throw new ot.g(60);
						try {
							for (var a = 0; a < r; a++) e.tty.K.ia(e.tty, t[n + a]);
						} catch (o) {
							throw new ot.g(29);
						}
						return r && (e.node.timestamp = Date.now()), a;
					}
				}, Re = {
					ra() {
						e: {
							if (!Te.length) {
								var e = null;
								if (p) {
									var t = Buffer.alloc(256), n = 0, r = process.stdin.fd;
									try {
										n = v.readSync(r, t);
									} catch (a) {
										if (!a.toString().includes("EOF")) throw a;
										n = 0;
									}
									e = 0 < n ? t.slice(0, n).toString("utf-8") : null;
								} else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (e = window.prompt("Input: ")) && (e += "\n") : "function" == typeof readline && null !== (e = readline()) && (e += "\n");
								if (!e) {
									e = null;
									break e;
								}
								Te = Oe(e, !0);
							}
							e = Te.shift();
						}
						return e;
					},
					ia(e, t) {
						null === t || 10 === t ? (E(Ee(e.output, 0)), e.output = []) : 0 != t && e.output.push(t);
					},
					fsync(e) {
						e.output && 0 < e.output.length && (E(Ee(e.output, 0)), e.output = []);
					},
					Ia: () => ({
						ab: 25856,
						cb: 5,
						$a: 191,
						bb: 35387,
						Za: [
							3,
							28,
							127,
							21,
							4,
							0,
							1,
							0,
							17,
							19,
							26,
							0,
							18,
							15,
							23,
							22,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0,
							0
						]
					}),
					Ja: () => 0,
					Ka: () => [24, 80]
				}, Ie = {
					ia(e, t) {
						null === t || 10 === t ? (T(Ee(e.output, 0)), e.output = []) : 0 != t && e.output.push(t);
					},
					fsync(e) {
						e.output && 0 < e.output.length && (T(Ee(e.output, 0)), e.output = []);
					}
				}, Fe = () => {
					K("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
				};
				function Ae(e, t) {
					var n = e.m ? e.m.length : 0;
					n >= t || (t = Math.max(t, n * (1048576 > n ? 2 : 1.125) >>> 0), 0 != n && (t = Math.max(t, 256)), n = e.m, e.m = new Uint8Array(t), 0 < e.o && e.m.set(n.subarray(0, e.o), 0));
				}
				var Me = {
					G: null,
					s: () => Me.createNode(null, "/", 16895, 0),
					createNode(e, t, n, r) {
						if (24576 == (61440 & n) || ot.isFIFO(n)) throw new ot.g(63);
						return Me.G || (Me.G = {
							dir: {
								node: {
									C: Me.h.C,
									v: Me.h.v,
									lookup: Me.h.lookup,
									J: Me.h.J,
									rename: Me.h.rename,
									unlink: Me.h.unlink,
									rmdir: Me.h.rmdir,
									readdir: Me.h.readdir,
									symlink: Me.h.symlink
								},
								stream: { D: Me.l.D }
							},
							file: {
								node: {
									C: Me.h.C,
									v: Me.h.v
								},
								stream: {
									D: Me.l.D,
									read: Me.l.read,
									write: Me.l.write,
									T: Me.l.T,
									S: Me.l.S,
									V: Me.l.V
								}
							},
							link: {
								node: {
									C: Me.h.C,
									v: Me.h.v,
									readlink: Me.h.readlink
								},
								stream: {}
							},
							na: {
								node: {
									C: Me.h.C,
									v: Me.h.v
								},
								stream: ot.Da
							}
						}), Ue((n = ot.createNode(e, t, n, r)).mode) ? (n.h = Me.G.dir.node, n.l = Me.G.dir.stream, n.m = {}) : ot.isFile(n.mode) ? (n.h = Me.G.file.node, n.l = Me.G.file.stream, n.o = 0, n.m = null) : 40960 == (61440 & n.mode) ? (n.h = Me.G.link.node, n.l = Me.G.link.stream) : 8192 == (61440 & n.mode) && (n.h = Me.G.na.node, n.l = Me.G.na.stream), n.timestamp = Date.now(), e && (e.m[t] = n, e.timestamp = n.timestamp), n;
					},
					lb: (e) => e.m ? e.m.subarray ? e.m.subarray(0, e.o) : new Uint8Array(e.m) : new Uint8Array(0),
					h: {
						C(e) {
							var t = {};
							return t.dev = 8192 == (61440 & e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, Ue(e.mode) ? t.size = 4096 : ot.isFile(e.mode) ? t.size = e.o : 40960 == (61440 & e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.Ba = 4096, t.blocks = Math.ceil(t.size / t.Ba), t;
						},
						v(e, t) {
							if (void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp), void 0 !== t.size && (t = t.size, e.o != t)) if (0 == t) e.m = null, e.o = 0;
							else {
								var n = e.m;
								e.m = new Uint8Array(t), n && e.m.set(n.subarray(0, Math.min(t, e.o))), e.o = t;
							}
						},
						lookup() {
							throw ot.da[44];
						},
						J: (e, t, n, r) => Me.createNode(e, t, n, r),
						rename(e, t, n) {
							if (Ue(e.mode)) {
								try {
									var r = Ze(t, n);
								} catch (o) {}
								if (r) for (var a in r.m) throw new ot.g(55);
							}
							delete e.parent.m[e.name], e.parent.timestamp = Date.now(), e.name = n, t.m[n] = e, t.timestamp = e.parent.timestamp, e.parent = t;
						},
						unlink(e, t) {
							delete e.m[t], e.timestamp = Date.now();
						},
						rmdir(e, t) {
							var n;
							for (n in Ze(e, t).m) throw new ot.g(55);
							delete e.m[t], e.timestamp = Date.now();
						},
						readdir(e) {
							var t, n = [".", ".."];
							for (t in e.m) e.m.hasOwnProperty(t) && n.push(t);
							return n;
						},
						symlink: (e, t, n) => ((e = Me.createNode(e, t, 41471, 0)).link = n, e),
						readlink(e) {
							if (40960 != (61440 & e.mode)) throw new ot.g(28);
							return e.link;
						}
					},
					l: {
						read(e, t, n, r, a) {
							var o = e.node.m;
							if (a >= e.node.o) return 0;
							if (N(0 <= (e = Math.min(e.node.o - a, r))), 8 < e && o.subarray) t.set(o.subarray(a, a + e), n);
							else for (r = 0; r < e; r++) t[n + r] = o[a + r];
							return e;
						},
						write(e, t, n, r, a, o) {
							if (N(!(t instanceof ArrayBuffer)), t.buffer === L.buffer && (o = !1), !r) return 0;
							if ((e = e.node).timestamp = Date.now(), t.subarray && (!e.m || e.m.subarray)) {
								if (o) return N(0 === a, "canOwn must imply no weird position inside the file"), e.m = t.subarray(n, n + r), e.o = r;
								if (0 === e.o && 0 === a) return e.m = t.slice(n, n + r), e.o = r;
								if (a + r <= e.o) return e.m.set(t.subarray(n, n + r), a), r;
							}
							if (Ae(e, a + r), e.m.subarray && t.subarray) e.m.set(t.subarray(n, n + r), a);
							else for (o = 0; o < r; o++) e.m[a + o] = t[n + o];
							return e.o = Math.max(e.o, a + r), r;
						},
						D(e, t, n) {
							if (1 === n ? t += e.position : 2 === n && ot.isFile(e.node.mode) && (t += e.node.o), 0 > t) throw new ot.g(28);
							return t;
						},
						T(e, t, n) {
							Ae(e.node, t + n), e.node.o = Math.max(e.node.o, t + n);
						},
						S(e, t, n, r, a) {
							if (!ot.isFile(e.node.mode)) throw new ot.g(43);
							if (e = e.node.m, 2 & a || e.buffer !== L.buffer) {
								if ((0 < n || n + t < e.length) && (e = e.subarray ? e.subarray(n, n + t) : Array.prototype.slice.call(e, n, n + t)), n = !0, !(t = Fe())) throw new ot.g(48);
								L.set(e, t);
							} else n = !1, t = e.byteOffset;
							return {
								Ra: t,
								Aa: n
							};
						},
						V: (e, t, n, r) => (Me.l.write(e, t, 0, r, n, !1), 0)
					}
				}, Ne = [], De = (e, t) => {
					var n = 0;
					return e && (n |= 365), t && (n |= 146), n;
				}, Ce = {
					0: "Success",
					1: "Arg list too long",
					2: "Permission denied",
					3: "Address already in use",
					4: "Address not available",
					5: "Address family not supported by protocol family",
					6: "No more processes",
					7: "Socket already connected",
					8: "Bad file number",
					9: "Trying to read unreadable message",
					10: "Mount device busy",
					11: "Operation canceled",
					12: "No children",
					13: "Connection aborted",
					14: "Connection refused",
					15: "Connection reset by peer",
					16: "File locking deadlock error",
					17: "Destination address required",
					18: "Math arg out of domain of func",
					19: "Quota exceeded",
					20: "File exists",
					21: "Bad address",
					22: "File too large",
					23: "Host is unreachable",
					24: "Identifier removed",
					25: "Illegal byte sequence",
					26: "Connection already in progress",
					27: "Interrupted system call",
					28: "Invalid argument",
					29: "I/O error",
					30: "Socket is already connected",
					31: "Is a directory",
					32: "Too many symbolic links",
					33: "Too many open files",
					34: "Too many links",
					35: "Message too long",
					36: "Multihop attempted",
					37: "File or path name too long",
					38: "Network interface is not configured",
					39: "Connection reset by network",
					40: "Network is unreachable",
					41: "Too many open files in system",
					42: "No buffer space available",
					43: "No such device",
					44: "No such file or directory",
					45: "Exec format error",
					46: "No record locks available",
					47: "The link has been severed",
					48: "Not enough core",
					49: "No message of desired type",
					50: "Protocol not available",
					51: "No space left on device",
					52: "Function not implemented",
					53: "Socket is not connected",
					54: "Not a directory",
					55: "Directory not empty",
					56: "State not recoverable",
					57: "Socket operation on non-socket",
					59: "Not a typewriter",
					60: "No such device or address",
					61: "Value too large for defined data type",
					62: "Previous owner died",
					63: "Not super-user",
					64: "Broken pipe",
					65: "Protocol error",
					66: "Unknown protocol",
					67: "Protocol wrong type for socket",
					68: "Math result not representable",
					69: "Read only file system",
					70: "Illegal seek",
					71: "No such process",
					72: "Stale file handle",
					73: "Connection timed out",
					74: "Text file busy",
					75: "Cross-device link",
					100: "Device not a stream",
					101: "Bad font file fmt",
					102: "Invalid slot",
					103: "Invalid request code",
					104: "No anode",
					105: "Block device required",
					106: "Channel number out of range",
					107: "Level 3 halted",
					108: "Level 3 reset",
					109: "Link number out of range",
					110: "Protocol driver not attached",
					111: "No CSI structure available",
					112: "Level 2 halted",
					113: "Invalid exchange",
					114: "Invalid request descriptor",
					115: "Exchange full",
					116: "No data (for no delay io)",
					117: "Timer expired",
					118: "Out of streams resources",
					119: "Machine is not on the network",
					120: "Package not installed",
					121: "The object is remote",
					122: "Advertise error",
					123: "Srmount error",
					124: "Communication error on send",
					125: "Cross mount point (not really error)",
					126: "Given log. name not unique",
					127: "f.d. invalid for this operation",
					128: "Remote address changed",
					129: "Can   access a needed shared lib",
					130: "Accessing a corrupted shared lib",
					131: ".lib section in a.out corrupted",
					132: "Attempting to link in too many libs",
					133: "Attempting to exec a shared library",
					135: "Streams pipe error",
					136: "Too many users",
					137: "Socket type not supported",
					138: "Not supported",
					139: "Protocol family not supported",
					140: "Can't send after socket shutdown",
					141: "Too many references",
					142: "Host is down",
					148: "No medium (in tape drive)",
					156: "Level 2 not synchronized"
				}, je = {
					EPERM: 63,
					ENOENT: 44,
					ESRCH: 71,
					EINTR: 27,
					EIO: 29,
					ENXIO: 60,
					E2BIG: 1,
					ENOEXEC: 45,
					EBADF: 8,
					ECHILD: 12,
					EAGAIN: 6,
					EWOULDBLOCK: 6,
					ENOMEM: 48,
					EACCES: 2,
					EFAULT: 21,
					ENOTBLK: 105,
					EBUSY: 10,
					EEXIST: 20,
					EXDEV: 75,
					ENODEV: 43,
					ENOTDIR: 54,
					EISDIR: 31,
					EINVAL: 28,
					ENFILE: 41,
					EMFILE: 33,
					ENOTTY: 59,
					ETXTBSY: 74,
					EFBIG: 22,
					ENOSPC: 51,
					ESPIPE: 70,
					EROFS: 69,
					EMLINK: 34,
					EPIPE: 64,
					EDOM: 18,
					ERANGE: 68,
					ENOMSG: 49,
					EIDRM: 24,
					ECHRNG: 106,
					EL2NSYNC: 156,
					EL3HLT: 107,
					EL3RST: 108,
					ELNRNG: 109,
					EUNATCH: 110,
					ENOCSI: 111,
					EL2HLT: 112,
					EDEADLK: 16,
					ENOLCK: 46,
					EBADE: 113,
					EBADR: 114,
					EXFULL: 115,
					ENOANO: 104,
					EBADRQC: 103,
					EBADSLT: 102,
					EDEADLOCK: 16,
					EBFONT: 101,
					ENOSTR: 100,
					ENODATA: 116,
					ETIME: 117,
					ENOSR: 118,
					ENONET: 119,
					ENOPKG: 120,
					EREMOTE: 121,
					ENOLINK: 47,
					EADV: 122,
					ESRMNT: 123,
					ECOMM: 124,
					EPROTO: 65,
					EMULTIHOP: 36,
					EDOTDOT: 125,
					EBADMSG: 9,
					ENOTUNIQ: 126,
					EBADFD: 127,
					EREMCHG: 128,
					ELIBACC: 129,
					ELIBBAD: 130,
					ELIBSCN: 131,
					ELIBMAX: 132,
					ELIBEXEC: 133,
					ENOSYS: 52,
					ENOTEMPTY: 55,
					ENAMETOOLONG: 37,
					ELOOP: 32,
					EOPNOTSUPP: 138,
					EPFNOSUPPORT: 139,
					ECONNRESET: 15,
					ENOBUFS: 42,
					EAFNOSUPPORT: 5,
					EPROTOTYPE: 67,
					ENOTSOCK: 57,
					ENOPROTOOPT: 50,
					ESHUTDOWN: 140,
					ECONNREFUSED: 14,
					EADDRINUSE: 3,
					ECONNABORTED: 13,
					ENETUNREACH: 40,
					ENETDOWN: 38,
					ETIMEDOUT: 73,
					EHOSTDOWN: 142,
					EHOSTUNREACH: 23,
					EINPROGRESS: 26,
					EALREADY: 7,
					EDESTADDRREQ: 17,
					EMSGSIZE: 35,
					EPROTONOSUPPORT: 66,
					ESOCKTNOSUPPORT: 137,
					EADDRNOTAVAIL: 4,
					ENETRESET: 39,
					EISCONN: 30,
					ENOTCONN: 53,
					ETOOMANYREFS: 141,
					EUSERS: 136,
					EDQUOT: 19,
					ESTALE: 72,
					ENOTSUP: 138,
					ENOMEDIUM: 148,
					EILSEQ: 25,
					EOVERFLOW: 61,
					ECANCELED: 11,
					ENOTRECOVERABLE: 56,
					EOWNERDEAD: 62,
					ESTRPIPE: 135
				};
				function $e(e, t) {
					ot.pa[e] = { l: t };
				}
				function Ue(e) {
					return 16384 == (61440 & e);
				}
				function Ze(e, t) {
					var n;
					if (n = (n = qe(e, "x")) ? n : e.h.lookup ? 0 : 2) throw new ot.g(n, e);
					for (n = ot.F[He(e.id, t)]; n; n = n.N) {
						var r = n.name;
						if (n.parent.id === e.id && r === t) return n;
					}
					return ot.lookup(e, t);
				}
				function Be(e, t = {}) {
					if (!(e = we(e))) return {
						path: "",
						node: null
					};
					if (8 < (t = Object.assign({
						ba: !0,
						ka: 0
					}, t)).ka) throw new ot.g(32);
					e = e.split("/").filter((e) => !!e);
					for (var n = ot.root, r = "/", a = 0; a < e.length; a++) {
						var o = a === e.length - 1;
						if (o && t.parent) break;
						if (n = Ze(n, e[a]), r = _e(r + "/" + e[a]), n.A && (!o || o && t.ba) && (n = n.A.root), !o || t.B) {
							for (o = 0; 40960 == (61440 & n.mode);) if (n = ot.readlink(r), n = Be(r = we(ge(r), n), { ka: t.ka + 1 }).node, 40 < o++) throw new ot.g(32);
						}
					}
					return {
						path: r,
						node: n
					};
				}
				function Ve(e) {
					for (var t;;) {
						if (ot.Z(e)) return e = e.s.ua, t ? "/" !== e[e.length - 1] ? `${e}/${t}` : e + t : e;
						t = t ? `${e.name}/${t}` : e.name, e = e.parent;
					}
				}
				function He(e, t) {
					for (var n = 0, r = 0; r < t.length; r++) n = (n << 5) - n + t.charCodeAt(r) | 0;
					return (e + n >>> 0) % ot.F.length;
				}
				function We(e) {
					var t = He(e.parent.id, e.name);
					e.N = ot.F[t], ot.F[t] = e;
				}
				function Ye(e) {
					var t = He(e.parent.id, e.name);
					if (ot.F[t] === e) ot.F[t] = e.N;
					else for (t = ot.F[t]; t;) {
						if (t.N === e) {
							t.N = e.N;
							break;
						}
						t = t.N;
					}
				}
				function Je(e) {
					var t = [
						"r",
						"w",
						"rw"
					][3 & e];
					return 512 & e && (t += "w"), t;
				}
				function qe(e, t) {
					return ot.ta ? 0 : !t.includes("r") || 292 & e.mode ? t.includes("w") && !(146 & e.mode) || t.includes("x") && !(73 & e.mode) ? 2 : 0 : 2;
				}
				function Ge(e, t) {
					try {
						return Ze(e, t), 20;
					} catch (n) {}
					return qe(e, "wx");
				}
				function Xe(e, t, n) {
					try {
						var r = Ze(e, t);
					} catch (a) {
						return a.u;
					}
					if (e = qe(e, "wx")) return e;
					if (n) {
						if (!Ue(r.mode)) return 54;
						if (ot.Z(r) || Ve(r) === ot.cwd()) return 10;
					} else if (Ue(r.mode)) return 31;
					return 0;
				}
				function Ke(e) {
					if (!(e = ot.qa(e))) throw new ot.g(8);
					return e;
				}
				function Qe(e, t = -1) {
					return ot.X || (ot.X = function() {
						this.I = {};
					}, ot.X.prototype = {}, Object.defineProperties(ot.X.prototype, {
						object: {
							get() {
								return this.node;
							},
							set(e) {
								this.node = e;
							}
						},
						flags: {
							get() {
								return this.I.flags;
							},
							set(e) {
								this.I.flags = e;
							}
						},
						position: {
							get() {
								return this.I.position;
							},
							set(e) {
								this.I.position = e;
							}
						}
					})), e = Object.assign(new ot.X(), e), -1 == t && (t = function() {
						for (var e = 0; e <= ot.xa; e++) if (!ot.streams[e]) return e;
						throw new ot.g(33);
					}()), e.fd = t, ot.streams[t] = e;
				}
				function et(e) {
					var t = [];
					for (e = [e]; e.length;) {
						var n = e.pop();
						t.push(n), e.push.apply(e, n.U);
					}
					return t;
				}
				function tt(e, t, n) {
					return void 0 === n && (n = t, t = 438), ot.J(e, 8192 | t, n);
				}
				function nt() {
					ot.g || (ot.g = function(e, t) {
						this.name = "ErrnoError", this.node = t, this.Sa = function(e) {
							for (var t in this.u = e, je) if (je[t] === e) {
								this.code = t;
								break;
							}
						}, this.Sa(e), this.message = Ce[e], this.stack && (Object.defineProperty(this, "stack", {
							value: Error().stack,
							writable: !0
						}), this.stack = ((e) => e.replace(/\b_Z[\w\d_]+/g, function(e) {
							return fe("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling"), e == e ? e : e + " [" + e + "]";
						}))(this.stack));
					}, ot.g.prototype = Error(), ot.g.prototype.constructor = ot.g, [44].forEach((e) => {
						ot.da[e] = new ot.g(e), ot.da[e].stack = "<generic error, no stack>";
					}));
				}
				function rt(e, t) {
					try {
						var n = Be(e, { B: !t });
						e = n.path;
					} catch (a) {}
					var r = {
						Z: !1,
						exists: !1,
						error: 0,
						name: null,
						path: null,
						object: null,
						Oa: !1,
						Qa: null,
						Pa: null
					};
					try {
						n = Be(e, { parent: !0 }), r.Oa = !0, r.Qa = n.path, r.Pa = n.node, r.name = be(e), n = Be(e, { B: !t }), r.exists = !0, r.path = n.path, r.object = n.node, r.name = n.node.name, r.Z = "/" === n.path;
					} catch (a) {
						r.error = a.u;
					}
					return r;
				}
				function at(e) {
					if (!(e.La || e.Ma || e.link || e.m)) {
						if ("undefined" != typeof XMLHttpRequest) throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
						if (!f) throw Error("Cannot load without read() or XMLHttpRequest.");
						try {
							e.m = Oe(f(e.url), !0), e.o = e.m.length;
						} catch (t) {
							throw new ot.g(29);
						}
					}
				}
				var ot = {
					root: null,
					U: [],
					pa: {},
					streams: [],
					Na: 1,
					F: null,
					oa: "/",
					Y: !1,
					ta: !0,
					g: null,
					da: {},
					Fa: null,
					W: 0,
					createNode: (e, t, n, r) => (N("object" == typeof e), We(e = new ot.wa(e, t, n, r)), e),
					Z: (e) => e === e.parent,
					isFile: (e) => 32768 == (61440 & e),
					isFIFO: (e) => 4096 == (61440 & e),
					isSocket: (e) => !(49152 & ~e),
					xa: 4096,
					qa: (e) => ot.streams[e],
					Da: {
						open(e) {
							e.l = ot.Ga(e.node.rdev).l, e.l.open && e.l.open(e);
						},
						D() {
							throw new ot.g(70);
						}
					},
					ha: (e) => e >> 8,
					nb: (e) => 255 & e,
					M: (e, t) => e << 8 | t,
					Ga: (e) => ot.pa[e],
					va(e, t) {
						function n(e) {
							return N(0 < ot.W), ot.W--, t(e);
						}
						function r(e) {
							if (e) {
								if (!r.Ea) return r.Ea = !0, n(e);
							} else ++o >= a.length && n(null);
						}
						"function" == typeof e && (t = e, e = !1), ot.W++, 1 < ot.W && T(`warning: ${ot.W} FS.syncfs operations in flight at once, probably just doing extra work`);
						var a = et(ot.root.s), o = 0;
						a.forEach((t) => {
							if (!t.type.va) return r(null);
							t.type.va(t, e, r);
						});
					},
					s(e, t, n) {
						if ("string" == typeof e) throw e;
						var r = "/" === n, a = !n;
						if (r && ot.root) throw new ot.g(10);
						if (!r && !a) {
							var o = Be(n, { ba: !1 });
							if (n = o.path, (o = o.node).A) throw new ot.g(10);
							if (!Ue(o.mode)) throw new ot.g(54);
						}
						return t = {
							type: e,
							rb: t,
							ua: n,
							U: []
						}, (e = e.s(t)).s = t, t.root = e, r ? ot.root = e : o && (o.A = t, o.s && o.s.U.push(t)), e;
					},
					xb(e) {
						if (!(e = Be(e, { ba: !1 })).node.A) throw new ot.g(28);
						var t = (e = e.node).A, n = et(t);
						Object.keys(ot.F).forEach((e) => {
							for (e = ot.F[e]; e;) {
								var t = e.N;
								n.includes(e.s) && Ye(e), e = t;
							}
						}), e.A = null, N(-1 !== (t = e.s.U.indexOf(t))), e.s.U.splice(t, 1);
					},
					lookup: (e, t) => e.h.lookup(e, t),
					J(e, t, n) {
						var r = Be(e, { parent: !0 }).node;
						if (!(e = be(e)) || "." === e || ".." === e) throw new ot.g(28);
						var a = Ge(r, e);
						if (a) throw new ot.g(a);
						if (!r.h.J) throw new ot.g(63);
						return r.h.J(r, e, t, n);
					},
					create: (e, t) => ot.J(e, 4095 & (void 0 !== t ? t : 438) | 32768, 0),
					mkdir: (e, t) => ot.J(e, 1023 & (void 0 !== t ? t : 511) | 16384, 0),
					ob(e, t) {
						e = e.split("/");
						for (var n = "", r = 0; r < e.length; ++r) if (e[r]) {
							n += "/" + e[r];
							try {
								ot.mkdir(n, t);
							} catch (a) {
								if (20 != a.u) throw a;
							}
						}
					},
					symlink(e, t) {
						if (!we(e)) throw new ot.g(44);
						var n = Be(t, { parent: !0 }).node;
						if (!n) throw new ot.g(44);
						var r = Ge(n, t = be(t));
						if (r) throw new ot.g(r);
						if (!n.h.symlink) throw new ot.g(63);
						return n.h.symlink(n, t, e);
					},
					rename(e, t) {
						var n = ge(e), r = ge(t), a = be(e), o = be(t), i = Be(e, { parent: !0 }), s = i.node;
						if (i = (i = Be(t, { parent: !0 })).node, !s || !i) throw new ot.g(44);
						if (s.s !== i.s) throw new ot.g(75);
						var u = Ze(s, a);
						if ("." !== (e = ve(e, r)).charAt(0)) throw new ot.g(28);
						if ("." !== (e = ve(t, n)).charAt(0)) throw new ot.g(55);
						try {
							var l = Ze(i, o);
						} catch (c) {}
						if (u !== l) {
							if (a = Xe(s, a, t = Ue(u.mode))) throw new ot.g(a);
							if (a = l ? Xe(i, o, t) : Ge(i, o)) throw new ot.g(a);
							if (!s.h.rename) throw new ot.g(63);
							if (u.A || l && l.A) throw new ot.g(10);
							if (i !== s && (a = qe(s, "w"))) throw new ot.g(a);
							Ye(u);
							try {
								s.h.rename(u, i, o);
							} catch (c) {
								throw c;
							} finally {
								We(u);
							}
						}
					},
					rmdir(e) {
						var t = Be(e, { parent: !0 }).node, n = Ze(t, e = be(e)), r = Xe(t, e, !0);
						if (r) throw new ot.g(r);
						if (!t.h.rmdir) throw new ot.g(63);
						if (n.A) throw new ot.g(10);
						t.h.rmdir(t, e), Ye(n);
					},
					readdir(e) {
						if (!(e = Be(e, { B: !0 }).node).h.readdir) throw new ot.g(54);
						return e.h.readdir(e);
					},
					unlink(e) {
						var t = Be(e, { parent: !0 }).node;
						if (!t) throw new ot.g(44);
						var n = Ze(t, e = be(e)), r = Xe(t, e, !1);
						if (r) throw new ot.g(r);
						if (!t.h.unlink) throw new ot.g(63);
						if (n.A) throw new ot.g(10);
						t.h.unlink(t, e), Ye(n);
					},
					readlink(e) {
						if (!(e = Be(e).node)) throw new ot.g(44);
						if (!e.h.readlink) throw new ot.g(28);
						return we(Ve(e.parent), e.h.readlink(e));
					},
					stat(e, t) {
						if (!(e = Be(e, { B: !t }).node)) throw new ot.g(44);
						if (!e.h.C) throw new ot.g(63);
						return e.h.C(e);
					},
					lstat: (e) => ot.stat(e, !0),
					chmod(e, t, n) {
						if (!(e = "string" == typeof e ? Be(e, { B: !n }).node : e).h.v) throw new ot.g(63);
						e.h.v(e, {
							mode: 4095 & t | -4096 & e.mode,
							timestamp: Date.now()
						});
					},
					lchmod(e, t) {
						ot.chmod(e, t, !0);
					},
					fchmod(e, t) {
						e = Ke(e), ot.chmod(e.node, t);
					},
					chown(e, t, n, r) {
						if (!(e = "string" == typeof e ? Be(e, { B: !r }).node : e).h.v) throw new ot.g(63);
						e.h.v(e, { timestamp: Date.now() });
					},
					lchown(e, t, n) {
						ot.chown(e, t, n, !0);
					},
					fchown(e, t, n) {
						e = Ke(e), ot.chown(e.node, t, n);
					},
					truncate(e, t) {
						if (0 > t) throw new ot.g(28);
						if (!(e = "string" == typeof e ? Be(e, { B: !0 }).node : e).h.v) throw new ot.g(63);
						if (Ue(e.mode)) throw new ot.g(31);
						if (!ot.isFile(e.mode)) throw new ot.g(28);
						var n = qe(e, "w");
						if (n) throw new ot.g(n);
						e.h.v(e, {
							size: t,
							timestamp: Date.now()
						});
					},
					kb(e, t) {
						if (!(2097155 & (e = Ke(e)).flags)) throw new ot.g(28);
						ot.truncate(e.node, t);
					},
					yb(e, t, n) {
						(e = Be(e, { B: !0 }).node).h.v(e, { timestamp: Math.max(t, n) });
					},
					open(e, t, n) {
						if ("" === e) throw new ot.g(44);
						if ("string" == typeof t) {
							var r = {
								r: 0,
								"r+": 2,
								w: 577,
								"w+": 578,
								a: 1089,
								"a+": 1090
							}[t];
							if (void 0 === r) throw Error(`Unknown file open mode: ${t}`);
							t = r;
						}
						if (n = 64 & t ? 4095 & (void 0 === n ? 438 : n) | 32768 : 0, "object" == typeof e) var o = e;
						else {
							e = _e(e);
							try {
								o = Be(e, { B: !(131072 & t) }).node;
							} catch (i) {}
						}
						if (r = !1, 64 & t) if (o) {
							if (128 & t) throw new ot.g(20);
						} else o = ot.J(e, n, 0), r = !0;
						if (!o) throw new ot.g(44);
						if (8192 == (61440 & o.mode) && (t &= -513), 65536 & t && !Ue(o.mode)) throw new ot.g(54);
						if (!r && (n = o ? 40960 == (61440 & o.mode) ? 32 : Ue(o.mode) && ("r" !== Je(t) || 512 & t) ? 31 : qe(o, Je(t)) : 44)) throw new ot.g(n);
						return 512 & t && !r && ot.truncate(o, 0), t &= -131713, (o = Qe({
							node: o,
							path: Ve(o),
							flags: t,
							seekable: !0,
							position: 0,
							l: o.l,
							Xa: [],
							error: !1
						})).l.open && o.l.open(o), !a.logReadFiles || 1 & t || (ot.ja || (ot.ja = {}), e in ot.ja || (ot.ja[e] = 1)), o;
					},
					close(e) {
						if (null === e.fd) throw new ot.g(8);
						e.ea && (e.ea = null);
						try {
							e.l.close && e.l.close(e);
						} catch (t) {
							throw t;
						} finally {
							ot.streams[e.fd] = null;
						}
						e.fd = null;
					},
					D(e, t, n) {
						if (null === e.fd) throw new ot.g(8);
						if (!e.seekable || !e.l.D) throw new ot.g(70);
						if (0 != n && 1 != n && 2 != n) throw new ot.g(28);
						return e.position = e.l.D(e, t, n), e.Xa = [], e.position;
					},
					read(e, t, n, r, a) {
						if (N(0 <= n), 0 > r || 0 > a) throw new ot.g(28);
						if (null === e.fd) throw new ot.g(8);
						if (1 == (2097155 & e.flags)) throw new ot.g(8);
						if (Ue(e.node.mode)) throw new ot.g(31);
						if (!e.l.read) throw new ot.g(28);
						var o = void 0 !== a;
						if (o) {
							if (!e.seekable) throw new ot.g(70);
						} else a = e.position;
						return t = e.l.read(e, t, n, r, a), o || (e.position += t), t;
					},
					write(e, t, n, r, a, o) {
						if (N(0 <= n), 0 > r || 0 > a) throw new ot.g(28);
						if (null === e.fd) throw new ot.g(8);
						if (!(2097155 & e.flags)) throw new ot.g(8);
						if (Ue(e.node.mode)) throw new ot.g(31);
						if (!e.l.write) throw new ot.g(28);
						e.seekable && 1024 & e.flags && ot.D(e, 0, 2);
						var i = void 0 !== a;
						if (i) {
							if (!e.seekable) throw new ot.g(70);
						} else a = e.position;
						return t = e.l.write(e, t, n, r, a, o), i || (e.position += t), t;
					},
					T(e, t, n) {
						if (null === e.fd) throw new ot.g(8);
						if (0 > t || 0 >= n) throw new ot.g(28);
						if (!(2097155 & e.flags)) throw new ot.g(8);
						if (!ot.isFile(e.node.mode) && !Ue(e.node.mode)) throw new ot.g(43);
						if (!e.l.T) throw new ot.g(138);
						e.l.T(e, t, n);
					},
					S(e, t, n, r, a) {
						if (2 & r && !(2 & a) && 2 != (2097155 & e.flags)) throw new ot.g(2);
						if (1 == (2097155 & e.flags)) throw new ot.g(2);
						if (!e.l.S) throw new ot.g(43);
						return e.l.S(e, t, n, r, a);
					},
					V: (e, t, n, r, a) => (N(0 <= n), e.l.V ? e.l.V(e, t, n, r, a) : 0),
					qb: () => 0,
					fa(e, t, n) {
						if (!e.l.fa) throw new ot.g(59);
						return e.l.fa(e, t, n);
					},
					readFile(e, t = {}) {
						if (t.flags = t.flags || 0, t.encoding = t.encoding || "binary", "utf8" !== t.encoding && "binary" !== t.encoding) throw Error(`Invalid encoding type "${t.encoding}"`);
						var n, r = ot.open(e, t.flags);
						e = ot.stat(e).size;
						var a = new Uint8Array(e);
						return ot.read(r, a, 0, e, 0), "utf8" === t.encoding ? n = Ee(a, 0) : "binary" === t.encoding && (n = a), ot.close(r), n;
					},
					writeFile(e, t, n = {}) {
						if (n.flags = n.flags || 577, e = ot.open(e, n.flags, n.mode), "string" == typeof t) {
							var r = new Uint8Array(Se(t) + 1);
							t = Le(t, r, 0, r.length), ot.write(e, r, 0, t, void 0, n.Ca);
						} else {
							if (!ArrayBuffer.isView(t)) throw Error("Unsupported data type");
							ot.write(e, t, 0, t.byteLength, void 0, n.Ca);
						}
						ot.close(e);
					},
					cwd: () => ot.oa,
					chdir(e) {
						if (null === (e = Be(e, { B: !0 })).node) throw new ot.g(44);
						if (!Ue(e.node.mode)) throw new ot.g(54);
						var t = qe(e.node, "x");
						if (t) throw new ot.g(t);
						ot.oa = e.path;
					},
					R(e, t, n) {
						N(!ot.R.Y, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), ot.R.Y = !0, nt(), a.stdin = e || a.stdin, a.stdout = t || a.stdout, a.stderr = n || a.stderr, a.stdin ? ot.L("/dev", "stdin", a.stdin) : ot.symlink("/dev/tty", "/dev/stdin"), a.stdout ? ot.L("/dev", "stdout", null, a.stdout) : ot.symlink("/dev/tty", "/dev/stdout"), a.stderr ? ot.L("/dev", "stderr", null, a.stderr) : ot.symlink("/dev/tty1", "/dev/stderr"), e = ot.open("/dev/stdin", 0), t = ot.open("/dev/stdout", 1), n = ot.open("/dev/stderr", 1), N(0 === e.fd, `invalid handle for stdin (${e.fd})`), N(1 === t.fd, `invalid handle for stdout (${t.fd})`), N(2 === n.fd, `invalid handle for stderr (${n.fd})`);
					},
					sb() {
						ot.R.Y = !1, Pt(0);
						for (var e = 0; e < ot.streams.length; e++) {
							var t = ot.streams[e];
							t && ot.close(t);
						}
					},
					jb: (e, t) => (e = rt(e, t)).exists ? e.object : null,
					hb(e, t) {
						for (e = "string" == typeof e ? e : Ve(e), t = t.split("/").reverse(); t.length;) {
							var n = t.pop();
							if (n) {
								var r = _e(e + "/" + n);
								try {
									ot.mkdir(r);
								} catch (a) {}
								e = r;
							}
						}
						return r;
					},
					L(e, t, n, r) {
						e = ((e, t) => _e(e + "/" + t))("string" == typeof e ? e : Ve(e), t), t = De(!!n, !!r), ot.L.ha || (ot.L.ha = 64);
						var a = ot.M(ot.L.ha++, 0);
						return $e(a, {
							open(e) {
								e.seekable = !1;
							},
							close() {
								r && r.buffer && r.buffer.length && r(10);
							},
							read(e, t, r, a) {
								for (var o = 0, i = 0; i < a; i++) {
									try {
										var s = n();
									} catch (u) {
										throw new ot.g(29);
									}
									if (void 0 === s && 0 === o) throw new ot.g(6);
									if (null == s) break;
									o++, t[r + i] = s;
								}
								return o && (e.node.timestamp = Date.now()), o;
							},
							write(e, t, n, a) {
								for (var o = 0; o < a; o++) try {
									r(t[n + o]);
								} catch (i) {
									throw new ot.g(29);
								}
								return a && (e.node.timestamp = Date.now()), o;
							}
						}), tt(e, t, a);
					},
					fb(e, t, n, r, a) {
						function o() {
							this.ga = !1, this.I = [];
						}
						function i(e, t, n, r, a) {
							if (a >= (e = e.node.m).length) return 0;
							if (N(0 <= (r = Math.min(e.length - a, r))), e.slice) for (var o = 0; o < r; o++) t[n + o] = e[a + o];
							else for (o = 0; o < r; o++) t[n + o] = e.get(a + o);
							return r;
						}
						if (o.prototype.get = function(e) {
							if (!(e > this.length - 1 || 0 > e)) {
								var t = e % this.chunkSize;
								return this.sa(e / this.chunkSize | 0)[t];
							}
						}, o.prototype.Ha = function(e) {
							this.sa = e;
						}, o.prototype.ma = function() {
							var e = new XMLHttpRequest();
							if (e.open("HEAD", n, !1), e.send(null), !(200 <= e.status && 300 > e.status || 304 === e.status)) throw Error("Couldn't load " + n + ". Status: " + e.status);
							var t, r = Number(e.getResponseHeader("Content-length")), a = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t;
							e = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t;
							var o = 1048576;
							a || (o = r);
							var i = this;
							i.Ha((e) => {
								var t = e * o, a = (e + 1) * o - 1;
								if (a = Math.min(a, r - 1), void 0 === i.I[e]) {
									var s = i.I;
									if (t > a) throw Error("invalid range (" + t + ", " + a + ") or no bytes requested!");
									if (a > r - 1) throw Error("only " + r + " bytes available! programmer error!");
									var u = new XMLHttpRequest();
									if (u.open("GET", n, !1), r !== o && u.setRequestHeader("Range", "bytes=" + t + "-" + a), u.responseType = "arraybuffer", u.overrideMimeType && u.overrideMimeType("text/plain; charset=x-user-defined"), u.send(null), !(200 <= u.status && 300 > u.status || 304 === u.status)) throw Error("Couldn't load " + n + ". Status: " + u.status);
									t = void 0 !== u.response ? new Uint8Array(u.response || []) : Oe(u.responseText || "", !0), s[e] = t;
								}
								if (void 0 === i.I[e]) throw Error("doXHR failed!");
								return i.I[e];
							}), !e && r || (o = r = 1, o = r = this.sa(0).length, E("LazyFiles on gzip forces download of the whole file when length is accessed")), this.za = r, this.ya = o, this.ga = !0;
						}, "undefined" != typeof XMLHttpRequest) {
							if (!d) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
							var s = new o();
							Object.defineProperties(s, {
								length: { get: function() {
									return this.ga || this.ma(), this.za;
								} },
								chunkSize: { get: function() {
									return this.ga || this.ma(), this.ya;
								} }
							});
							var u = void 0;
						} else u = n, s = void 0;
						var l = function(e, t, n, r) {
							return e = "string" == typeof e ? e : Ve(e), t = _e(e + "/" + t), ot.create(t, De(n, r));
						}(e, t, r, a);
						s ? l.m = s : u && (l.m = null, l.url = u), Object.defineProperties(l, { o: { get: function() {
							return this.m.length;
						} } });
						var c = {};
						return Object.keys(l.l).forEach((e) => {
							var t = l.l[e];
							c[e] = function() {
								return at(l), t.apply(null, arguments);
							};
						}), c.read = (e, t, n, r, a) => (at(l), i(e, t, n, r, a)), c.S = (e, t, n) => {
							at(l);
							var r = Fe();
							if (!r) throw new ot.g(48);
							return i(e, L, r, t, n), {
								Ra: r,
								Aa: !0
							};
						}, l.l = c, l;
					},
					Ya() {
						K("FS.absolutePath has been removed; use PATH_FS.resolve instead");
					},
					eb() {
						K("FS.createFolder has been removed; use FS.mkdir instead");
					},
					gb() {
						K("FS.createLink has been removed; use FS.symlink instead");
					},
					mb() {
						K("FS.joinPath has been removed; use PATH.join instead");
					},
					pb() {
						K("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
					},
					vb() {
						K("FS.standardizePath has been removed; use PATH.normalize instead");
					}
				}, it = (e) => (N("number" == typeof e, `UTF8ToString expects a number (got ${typeof e})`), e ? Ee(O, e) : "");
				function st(e, t) {
					if ("/" === t.charAt(0)) return t;
					if (e = -100 === e ? ot.cwd() : Ke(e).path, 0 == t.length) throw new ot.g(44);
					return _e(e + "/" + t);
				}
				var ut = void 0;
				function lt() {
					N(null != ut);
					var e = P[+ut >> 2];
					return ut += 4, e;
				}
				var ct, dt, pt, ht = (e, t, n) => (N("number" == typeof n, "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), Le(e, O, t, n)), ft = (e) => 0 == e % 4 && (0 != e % 100 || 0 == e % 400), mt = [
					0,
					31,
					60,
					91,
					121,
					152,
					182,
					213,
					244,
					274,
					305,
					335
				], _t = [
					0,
					31,
					59,
					90,
					120,
					151,
					181,
					212,
					243,
					273,
					304,
					334
				], gt = (e) => {
					var t = Se(e) + 1, n = Rt(t);
					return n && ht(e, n, t), n;
				}, bt = {}, yt = () => {
					if (!ct) {
						var e, t = {
							USER: "web_user",
							LOGNAME: "web_user",
							PATH: "/",
							PWD: "/",
							HOME: "/home/web_user",
							LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
							_: i || "./this.program"
						};
						for (e in bt) void 0 === bt[e] ? delete t[e] : t[e] = bt[e];
						var n = [];
						for (e in t) n.push(`${e}=${t[e]}`);
						ct = n;
					}
					return ct;
				}, wt = [
					31,
					29,
					31,
					30,
					31,
					30,
					31,
					31,
					30,
					31,
					30,
					31
				], vt = [
					31,
					28,
					31,
					30,
					31,
					30,
					31,
					31,
					30,
					31,
					30,
					31
				], kt = (e, t) => {
					N(0 <= e.length, "writeArrayToMemory array must have a length (should be an array or typed array)"), L.set(e, t);
				}, Et = [], Tt = (e) => {
					var t = Et[e];
					return t || (e >= Et.length && (Et.length = e + 1), Et[e] = t = dt.get(e)), N(dt.get(e) == t, "JavaScript-side Wasm function table mirror is out of date!"), t;
				}, St = [];
				function Lt(e, t, n, r) {
					e ||= this, this.parent = e, this.s = e.s, this.A = null, this.id = ot.Na++, this.name = t, this.mode = n, this.h = {}, this.l = {}, this.rdev = r;
				}
				Object.defineProperties(Lt.prototype, {
					read: {
						get: function() {
							return !(365 & ~this.mode);
						},
						set: function(e) {
							e ? this.mode |= 365 : this.mode &= -366;
						}
					},
					write: {
						get: function() {
							return !(146 & ~this.mode);
						},
						set: function(e) {
							e ? this.mode |= 146 : this.mode &= -147;
						}
					},
					Ma: { get: function() {
						return Ue(this.mode);
					} },
					La: { get: function() {
						return 8192 == (61440 & this.mode);
					} }
				}), ot.wa = Lt, ot.ib = (e, t, n, r, a, o, i, s, u, l) => {
					function c(n) {
						function c(n) {
							if (l && l(), !s) {
								var i = e, c = t;
								if (i && (i = "string" == typeof i ? i : Ve(i), c = t ? _e(i + "/" + t) : i), i = De(r, a), c = ot.create(c, i), n) {
									if ("string" == typeof n) {
										for (var d = Array(n.length), h = 0, f = n.length; h < f; ++h) d[h] = n.charCodeAt(h);
										n = d;
									}
									ot.chmod(c, 146 | i), d = ot.open(c, 577), ot.write(d, n, 0, n.length, 0, u), ot.close(d), ot.chmod(c, i);
								}
							}
							o && o(), X(p);
						}
						((e, t, n, r) => {
							"undefined" != typeof Browser && Browser.R();
							var a = !1;
							return Ne.forEach((o) => {
								!a && o.canHandle(t) && (o.handle(e, t, n, r), a = !0);
							}), a;
						})(n, d, c, () => {
							i && i(), X(p);
						}) || c(n);
					}
					var d = t ? we(_e(e + "/" + t)) : e, p = q(`cp ${d}`);
					G(p), "string" == typeof n ? ((e, t, n) => {
						var r = q(`al ${e}`);
						m(e, (n) => {
							N(n, `Loading data file "${e}" failed (no arrayBuffer).`), t(new Uint8Array(n)), r && X(r);
						}, () => {
							if (!n) throw `Loading data file "${e}" failed.`;
							n();
						}), r && G(r);
					})(n, (e) => c(e), i) : c(n);
				}, nt(), ot.F = Array(4096), ot.s(Me, {}, "/"), ot.mkdir("/tmp"), ot.mkdir("/home"), ot.mkdir("/home/web_user"), function() {
					ot.mkdir("/dev"), $e(ot.M(1, 3), {
						read: () => 0,
						write: (e, t, n, r) => r
					}), tt("/dev/null", ot.M(1, 3)), ze(ot.M(5, 0), Re), ze(ot.M(6, 0), Ie), tt("/dev/tty", ot.M(5, 0)), tt("/dev/tty1", ot.M(6, 0));
					var e = new Uint8Array(1024), t = 0, n = () => (0 === t && (t = ye(e).byteLength), e[--t]);
					ot.L("/dev", "random", n), ot.L("/dev", "urandom", n), ot.mkdir("/dev/shm"), ot.mkdir("/dev/shm/tmp");
				}(), function() {
					ot.mkdir("/proc");
					var e = ot.mkdir("/proc/self");
					ot.mkdir("/proc/self/fd"), ot.s({ s() {
						var t = ot.createNode(e, "fd", 16895, 73);
						return t.h = { lookup(e, t) {
							var n = Ke(+t);
							return (e = {
								parent: null,
								s: { ua: "fake" },
								h: { readlink: () => n.path }
							}).parent = e;
						} }, t;
					} }, {}, "/proc/self/fd");
				}(), ot.Fa = { MEMFS: Me };
				var Ot = {
					__syscall_dup3: function(e, t, n) {
						try {
							var r = Ke(e);
							if (N(!n), r.fd === t) return -28;
							var a = ot.qa(t);
							return a && ot.close(a), Qe(r, t).fd;
						} catch (o) {
							if (void 0 === ot || "ErrnoError" !== o.name) throw o;
							return -o.u;
						}
					},
					__syscall_fcntl64: function(e, t, n) {
						ut = n;
						try {
							var r = Ke(e);
							switch (t) {
								case 0:
									var a = lt();
									if (0 > a) return -28;
									for (; ot.streams[a];) a++;
									return Qe(r, a).fd;
								case 1:
								case 2:
								case 6:
								case 7: return 0;
								case 3: return r.flags;
								case 4: return a = lt(), r.flags |= a, 0;
								case 5: return a = lt(), x[a + 0 >> 1] = 2, 0;
								case 16:
								case 8:
								default: return -28;
								case 9: return P[zt() >> 2] = 28, -1;
							}
						} catch (o) {
							if (void 0 === ot || "ErrnoError" !== o.name) throw o;
							return -o.u;
						}
					},
					__syscall_ioctl: function(e, t, n) {
						ut = n;
						try {
							var r = Ke(e);
							switch (t) {
								case 21509:
								case 21510:
								case 21511:
								case 21512:
								case 21524:
								case 21515: return r.tty ? 0 : -59;
								case 21505:
									if (!r.tty) return -59;
									if (r.tty.K.Ia) {
										e = [
											3,
											28,
											127,
											21,
											4,
											0,
											1,
											0,
											17,
											19,
											26,
											0,
											18,
											15,
											23,
											22,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0,
											0
										];
										var a = lt();
										P[a >> 2] = 25856, P[a + 4 >> 2] = 5, P[a + 8 >> 2] = 191, P[a + 12 >> 2] = 35387;
										for (var o = 0; 32 > o; o++) L[a + o + 17 | 0] = e[o] || 0;
									}
									return 0;
								case 21506:
								case 21507:
								case 21508:
									if (!r.tty) return -59;
									if (r.tty.K.Ja) for (a = lt(), e = [], o = 0; 32 > o; o++) e.push(L[a + o + 17 | 0]);
									return 0;
								case 21519: return r.tty ? (a = lt(), P[a >> 2] = 0) : -59;
								case 21520: return r.tty ? -28 : -59;
								case 21531: return a = lt(), ot.fa(r, t, a);
								case 21523: return r.tty ? (r.tty.K.Ka && (o = [24, 80], a = lt(), x[a >> 1] = o[0], x[a + 2 >> 1] = o[1]), 0) : -59;
								default: return -28;
							}
						} catch (i) {
							if (void 0 === ot || "ErrnoError" !== i.name) throw i;
							return -i.u;
						}
					},
					__syscall_openat: function(e, t, n, r) {
						ut = r;
						try {
							t = st(e, t = it(t));
							var a = r ? lt() : 0;
							return ot.open(t, n, a).fd;
						} catch (o) {
							if (void 0 === ot || "ErrnoError" !== o.name) throw o;
							return -o.u;
						}
					},
					__syscall_readlinkat: function(e, t, n, r) {
						try {
							if (t = st(e, t = it(t)), 0 >= r) return -28;
							var a = ot.readlink(t), o = Math.min(r, Se(a)), i = L[n + o];
							return ht(a, n, r + 1), L[n + o] = i, o;
						} catch (s) {
							if (void 0 === ot || "ErrnoError" !== s.name) throw s;
							return -s.u;
						}
					},
					__syscall_renameat: function(e, t, n, r) {
						try {
							return t = it(t), r = it(r), t = st(e, t), r = st(n, r), ot.rename(t, r), 0;
						} catch (a) {
							if (void 0 === ot || "ErrnoError" !== a.name) throw a;
							return -a.u;
						}
					},
					__syscall_rmdir: function(e) {
						try {
							return e = it(e), ot.rmdir(e), 0;
						} catch (t) {
							if (void 0 === ot || "ErrnoError" !== t.name) throw t;
							return -t.u;
						}
					},
					__syscall_unlinkat: function(e, t, n) {
						try {
							return t = st(e, t = it(t)), 0 === n ? ot.unlink(t) : 512 === n ? ot.rmdir(t) : K("Invalid flags passed to unlinkat"), 0;
						} catch (r) {
							if (void 0 === ot || "ErrnoError" !== r.name) throw r;
							return -r.u;
						}
					},
					_emscripten_get_now_is_monotonic: () => 1,
					_emscripten_throw_longjmp: () => {
						throw Infinity;
					},
					_gmtime_js: function(e, t) {
						e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e), e = /* @__PURE__ */ new Date(1e3 * e), P[t >> 2] = e.getUTCSeconds(), P[t + 4 >> 2] = e.getUTCMinutes(), P[t + 8 >> 2] = e.getUTCHours(), P[t + 12 >> 2] = e.getUTCDate(), P[t + 16 >> 2] = e.getUTCMonth(), P[t + 20 >> 2] = e.getUTCFullYear() - 1900, P[t + 24 >> 2] = e.getUTCDay(), P[t + 28 >> 2] = (e.getTime() - Date.UTC(e.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0;
					},
					_localtime_js: function(e, t) {
						e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e), e = /* @__PURE__ */ new Date(1e3 * e), P[t >> 2] = e.getSeconds(), P[t + 4 >> 2] = e.getMinutes(), P[t + 8 >> 2] = e.getHours(), P[t + 12 >> 2] = e.getDate(), P[t + 16 >> 2] = e.getMonth(), P[t + 20 >> 2] = e.getFullYear() - 1900, P[t + 24 >> 2] = e.getDay(), P[t + 28 >> 2] = (ft(e.getFullYear()) ? mt : _t)[e.getMonth()] + e.getDate() - 1 | 0, P[t + 36 >> 2] = -60 * e.getTimezoneOffset();
						var n = new Date(e.getFullYear(), 6, 1).getTimezoneOffset(), r = new Date(e.getFullYear(), 0, 1).getTimezoneOffset();
						P[t + 32 >> 2] = 0 | (n != r && e.getTimezoneOffset() == Math.min(r, n));
					},
					_mktime_js: function(e) {
						var t = new Date(P[e + 20 >> 2] + 1900, P[e + 16 >> 2], P[e + 12 >> 2], P[e + 8 >> 2], P[e + 4 >> 2], P[e >> 2], 0), n = P[e + 32 >> 2], r = t.getTimezoneOffset(), a = new Date(t.getFullYear(), 6, 1).getTimezoneOffset(), o = new Date(t.getFullYear(), 0, 1).getTimezoneOffset(), i = Math.min(o, a);
						return 0 > n ? P[e + 32 >> 2] = Number(a != o && i == r) : 0 < n != (i == r) && (a = Math.max(o, a), t.setTime(t.getTime() + 6e4 * ((0 < n ? i : a) - r))), P[e + 24 >> 2] = t.getDay(), P[e + 28 >> 2] = (ft(t.getFullYear()) ? mt : _t)[t.getMonth()] + t.getDate() - 1 | 0, P[e >> 2] = t.getSeconds(), P[e + 4 >> 2] = t.getMinutes(), P[e + 8 >> 2] = t.getHours(), P[e + 12 >> 2] = t.getDate(), P[e + 16 >> 2] = t.getMonth(), P[e + 20 >> 2] = t.getYear(), e = t.getTime(), isNaN(e) ? (P[zt() >> 2] = 61, e = -1) : e /= 1e3, BigInt(e);
					},
					_tzset_js: (e, t, n) => {
						function r(e) {
							return (e = e.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? e[1] : "GMT";
						}
						var a = (/* @__PURE__ */ new Date()).getFullYear(), o = new Date(a, 0, 1), i = new Date(a, 6, 1);
						a = o.getTimezoneOffset();
						var s = i.getTimezoneOffset();
						R[e >> 2] = 60 * Math.max(a, s), P[t >> 2] = Number(a != s), e = r(o), t = r(i), e = gt(e), t = gt(t), s < a ? (R[n >> 2] = e, R[n + 4 >> 2] = t) : (R[n >> 2] = t, R[n + 4 >> 2] = e);
					},
					abort: () => {
						K("native code called abort()");
					},
					emscripten_date_now: () => Date.now(),
					emscripten_get_now: () => performance.now(),
					emscripten_resize_heap: (e) => {
						var t = O.length;
						if (N((e >>>= 0) > t), 2147483648 < e) return T(`Cannot enlarge memory, requested ${e} bytes, but the limit is 2147483648 bytes!`), !1;
						for (var n = 1; 4 >= n; n *= 2) {
							var r = t * (1 + .2 / n);
							r = Math.min(r, e + 100663296);
							var a = Math;
							r = Math.max(e, r);
							e: {
								r = a = a.min.call(a, 2147483648, r + (65536 - r % 65536) % 65536);
								var o = S.buffer, i = (r - o.byteLength + 65535) / 65536;
								try {
									S.grow(i), D();
									var s = 1;
									break e;
								} catch (u) {
									T(`growMemory: Attempted to grow heap from ${o.byteLength} bytes to ${r} bytes, but got error: ${u}`);
								}
								s = void 0;
							}
							if (s) return !0;
						}
						return T(`Failed to grow the heap from ${t} bytes to ${a} bytes, not enough memory!`), !1;
					},
					environ_get: (e, t) => {
						var n = 0;
						return yt().forEach((r, a) => {
							var o = t + n;
							for (a = R[e + 4 * a >> 2] = o, o = 0; o < r.length; ++o) N(r.charCodeAt(o) === (255 & r.charCodeAt(o))), L[0 | a++] = r.charCodeAt(o);
							L[0 | a] = 0, n += r.length + 1;
						}), 0;
					},
					environ_sizes_get: (e, t) => {
						var n = yt();
						R[e >> 2] = n.length;
						var r = 0;
						return n.forEach((e) => r += e.length + 1), R[t >> 2] = r, 0;
					},
					exit: (e) => {
						(function() {
							var e = E, t = T, n = !1;
							E = T = () => {
								n = !0;
							};
							try {
								Pt(0), ["stdout", "stderr"].forEach(function(e) {
									(e = rt("/dev/" + e)) && (e = xe[e.object.rdev]) && e.output && e.output.length && (n = !0);
								});
							} catch (r) {}
							E = e, T = t, n && fe("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
						})(), M = !0, l(e, new de(e));
					},
					fd_close: function(e) {
						try {
							var t = Ke(e);
							return ot.close(t), 0;
						} catch (n) {
							if (void 0 === ot || "ErrnoError" !== n.name) throw n;
							return n.u;
						}
					},
					fd_read: function(e, t, n, r) {
						try {
							e: {
								var a = Ke(e);
								e = t;
								for (var o, i = t = 0; i < n; i++) {
									var s = R[e >> 2], u = R[e + 4 >> 2];
									e += 8;
									var l = ot.read(a, L, s, u, o);
									if (0 > l) {
										var c = -1;
										break e;
									}
									if (t += l, l < u) break;
									void 0 !== o && (o += l);
								}
								c = t;
							}
							return R[r >> 2] = c, 0;
						} catch (d) {
							if (void 0 === ot || "ErrnoError" !== d.name) throw d;
							return d.u;
						}
					},
					fd_seek: function(e, t, n, r) {
						t = -9007199254740992 > t || 9007199254740992 < t ? NaN : Number(t);
						try {
							if (isNaN(t)) return 61;
							var a = Ke(e);
							return ot.D(a, t, n), F[r >> 3] = BigInt(a.position), a.ea && 0 === t && 0 === n && (a.ea = null), 0;
						} catch (o) {
							if (void 0 === ot || "ErrnoError" !== o.name) throw o;
							return o.u;
						}
					},
					fd_write: function(e, t, n, r) {
						try {
							e: {
								var a = Ke(e);
								e = t;
								for (var o, i = t = 0; i < n; i++) {
									var s = R[e >> 2], u = R[e + 4 >> 2];
									e += 8;
									var l = ot.write(a, L, s, u, o);
									if (0 > l) {
										var c = -1;
										break e;
									}
									t += l, void 0 !== o && (o += l);
								}
								c = t;
							}
							return R[r >> 2] = c, 0;
						} catch (d) {
							if (void 0 === ot || "ErrnoError" !== d.name) throw d;
							return d.u;
						}
					},
					invoke_vii: function(e, t, n) {
						var r = Nt();
						try {
							Tt(e)(t, n);
						} catch (a) {
							if (Dt(r), a !== a + 0) throw a;
							Ft(1, 0);
						}
					},
					strftime: (e, t, n, r) => {
						function a(e, t, n) {
							for (e = "number" == typeof e ? e.toString() : e || ""; e.length < t;) e = n[0] + e;
							return e;
						}
						function o(e, t) {
							return a(e, t, "0");
						}
						function i(e, t) {
							function n(e) {
								return 0 > e ? -1 : 0 < e ? 1 : 0;
							}
							var r;
							return 0 === (r = n(e.getFullYear() - t.getFullYear())) && 0 === (r = n(e.getMonth() - t.getMonth())) && (r = n(e.getDate() - t.getDate())), r;
						}
						function s(e) {
							switch (e.getDay()) {
								case 0: return new Date(e.getFullYear() - 1, 11, 29);
								case 1: return e;
								case 2: return new Date(e.getFullYear(), 0, 3);
								case 3: return new Date(e.getFullYear(), 0, 2);
								case 4: return new Date(e.getFullYear(), 0, 1);
								case 5: return new Date(e.getFullYear() - 1, 11, 31);
								case 6: return new Date(e.getFullYear() - 1, 11, 30);
							}
						}
						function u(e) {
							var t = e.O;
							for (e = new Date(new Date(e.P + 1900, 0, 1).getTime()); 0 < t;) {
								var n = e.getMonth(), r = (ft(e.getFullYear()) ? wt : vt)[n];
								if (!(t > r - e.getDate())) {
									e.setDate(e.getDate() + t);
									break;
								}
								t -= r - e.getDate() + 1, e.setDate(1), 11 > n ? e.setMonth(n + 1) : (e.setMonth(0), e.setFullYear(e.getFullYear() + 1));
							}
							return n = new Date(e.getFullYear() + 1, 0, 4), t = s(new Date(e.getFullYear(), 0, 4)), n = s(n), 0 >= i(t, e) ? 0 >= i(n, e) ? e.getFullYear() + 1 : e.getFullYear() : e.getFullYear() - 1;
						}
						var l = R[r + 40 >> 2];
						for (var c in r = {
							Va: P[r >> 2],
							Ua: P[r + 4 >> 2],
							$: P[r + 8 >> 2],
							la: P[r + 12 >> 2],
							aa: P[r + 16 >> 2],
							P: P[r + 20 >> 2],
							H: P[r + 24 >> 2],
							O: P[r + 28 >> 2],
							wb: P[r + 32 >> 2],
							Ta: P[r + 36 >> 2],
							Wa: l ? it(l) : ""
						}, n = it(n), l = {
							"%c": "%a %b %d %H:%M:%S %Y",
							"%D": "%m/%d/%y",
							"%F": "%Y-%m-%d",
							"%h": "%b",
							"%r": "%I:%M:%S %p",
							"%R": "%H:%M",
							"%T": "%H:%M:%S",
							"%x": "%m/%d/%y",
							"%X": "%H:%M:%S",
							"%Ec": "%c",
							"%EC": "%C",
							"%Ex": "%m/%d/%y",
							"%EX": "%H:%M:%S",
							"%Ey": "%y",
							"%EY": "%Y",
							"%Od": "%d",
							"%Oe": "%e",
							"%OH": "%H",
							"%OI": "%I",
							"%Om": "%m",
							"%OM": "%M",
							"%OS": "%S",
							"%Ou": "%u",
							"%OU": "%U",
							"%OV": "%V",
							"%Ow": "%w",
							"%OW": "%W",
							"%Oy": "%y"
						}) n = n.replace(new RegExp(c, "g"), l[c]);
						var d = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), p = "January February March April May June July August September October November December".split(" ");
						for (c in l = {
							"%a": (e) => d[e.H].substring(0, 3),
							"%A": (e) => d[e.H],
							"%b": (e) => p[e.aa].substring(0, 3),
							"%B": (e) => p[e.aa],
							"%C": (e) => o((e.P + 1900) / 100 | 0, 2),
							"%d": (e) => o(e.la, 2),
							"%e": (e) => a(e.la, 2, " "),
							"%g": (e) => u(e).toString().substring(2),
							"%G": (e) => u(e),
							"%H": (e) => o(e.$, 2),
							"%I": (e) => (0 == (e = e.$) ? e = 12 : 12 < e && (e -= 12), o(e, 2)),
							"%j": (e) => {
								for (var t = 0, n = 0; n <= e.aa - 1; t += (ft(e.P + 1900) ? wt : vt)[n++]);
								return o(e.la + t, 3);
							},
							"%m": (e) => o(e.aa + 1, 2),
							"%M": (e) => o(e.Ua, 2),
							"%n": () => "\n",
							"%p": (e) => 0 <= e.$ && 12 > e.$ ? "AM" : "PM",
							"%S": (e) => o(e.Va, 2),
							"%t": () => "	",
							"%u": (e) => e.H || 7,
							"%U": (e) => o(Math.floor((e.O + 7 - e.H) / 7), 2),
							"%V": (e) => {
								var t = Math.floor((e.O + 7 - (e.H + 6) % 7) / 7);
								if (2 >= (e.H + 371 - e.O - 2) % 7 && t++, t) 53 == t && (4 == (n = (e.H + 371 - e.O) % 7) || 3 == n && ft(e.P) || (t = 1));
								else {
									t = 52;
									var n = (e.H + 7 - e.O - 1) % 7;
									(4 == n || 5 == n && ft(e.P % 400 - 1)) && t++;
								}
								return o(t, 2);
							},
							"%w": (e) => e.H,
							"%W": (e) => o(Math.floor((e.O + 7 - (e.H + 6) % 7) / 7), 2),
							"%y": (e) => (e.P + 1900).toString().substring(2),
							"%Y": (e) => e.P + 1900,
							"%z": (e) => {
								var t = 0 <= (e = e.Ta);
								return e = Math.abs(e) / 60, (t ? "+" : "-") + String("0000" + (e / 60 * 100 + e % 60)).slice(-4);
							},
							"%Z": (e) => e.Wa,
							"%%": () => "%"
						}, n = n.replace(/%%/g, "\0\0"), l) n.includes(c) && (n = n.replace(new RegExp(c, "g"), l[c](r)));
						return (c = Oe(n = n.replace(/\0\0/g, "%"), !1)).length > t ? 0 : (kt(c, e), c.length - 1);
					},
					system: (e) => {
						return p ? e ? (e = it(e)).length ? null === (e = w("child_process").ub(e, [], {
							tb: !0,
							stdio: "inherit"
						})).status ? (t = 0, n = ((e) => {
							switch (e) {
								case "SIGHUP": return 1;
								case "SIGQUIT": return 3;
								case "SIGFPE": return 8;
								case "SIGKILL": return 9;
								case "SIGALRM": return 14;
								case "SIGTERM": return 15;
							}
							return 2;
						})(e.signal), t << 8 | n) : e.status << 8 : 0 : 1 : e ? (P[zt() >> 2] = 52, -1) : 0;
						var t, n;
					}
				}, xt = function() {
					var e = {
						env: Ot,
						wasi_snapshot_preview1: Ot
					};
					G("wasm-instantiate");
					var t = a;
					return function(e, t) {
						var n = Q;
						return "function" != typeof WebAssembly.instantiateStreaming || ee(n) || te(n) || p || "function" != typeof fetch ? oe(n, e, t) : fetch(n, { credentials: "same-origin" }).then((r) => WebAssembly.instantiateStreaming(r, e).then(t, function(r) {
							return T(`wasm streaming compile failed: ${r}`), T("falling back to ArrayBuffer instantiation"), oe(n, e, t);
						}));
					}(e, function(e) {
						N(a === t, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), t = null, xt = e.instance.exports, N(S = xt.memory, "memory not found in wasm exports"), D(), N(dt = xt.__indirect_function_table, "table not found in wasm exports"), Z.unshift(xt.__wasm_call_ctors), X("wasm-instantiate");
					}).catch(r), {};
				}();
				a._lua_checkstack = ne("lua_checkstack"), a._lua_xmove = ne("lua_xmove"), a._lua_atpanic = ne("lua_atpanic"), a._lua_version = ne("lua_version"), a._lua_absindex = ne("lua_absindex"), a._lua_gettop = ne("lua_gettop"), a._lua_settop = ne("lua_settop"), a._lua_closeslot = ne("lua_closeslot"), a._lua_rotate = ne("lua_rotate"), a._lua_copy = ne("lua_copy"), a._lua_pushvalue = ne("lua_pushvalue"), a._lua_type = ne("lua_type"), a._lua_typename = ne("lua_typename"), a._lua_iscfunction = ne("lua_iscfunction"), a._lua_isinteger = ne("lua_isinteger"), a._lua_isnumber = ne("lua_isnumber"), a._lua_isstring = ne("lua_isstring"), a._lua_isuserdata = ne("lua_isuserdata"), a._lua_rawequal = ne("lua_rawequal"), a._lua_arith = ne("lua_arith"), a._lua_compare = ne("lua_compare"), a._lua_stringtonumber = ne("lua_stringtonumber"), a._lua_tonumberx = ne("lua_tonumberx"), a._lua_tointegerx = ne("lua_tointegerx"), a._lua_toboolean = ne("lua_toboolean"), a._lua_tolstring = ne("lua_tolstring"), a._lua_rawlen = ne("lua_rawlen"), a._lua_tocfunction = ne("lua_tocfunction"), a._lua_touserdata = ne("lua_touserdata"), a._lua_tothread = ne("lua_tothread"), a._lua_topointer = ne("lua_topointer"), a._lua_pushnil = ne("lua_pushnil"), a._lua_pushnumber = ne("lua_pushnumber"), a._lua_pushinteger = ne("lua_pushinteger"), a._lua_pushlstring = ne("lua_pushlstring"), a._lua_pushstring = ne("lua_pushstring"), a._lua_pushcclosure = ne("lua_pushcclosure"), a._lua_pushboolean = ne("lua_pushboolean"), a._lua_pushlightuserdata = ne("lua_pushlightuserdata"), a._lua_pushthread = ne("lua_pushthread"), a._lua_getglobal = ne("lua_getglobal"), a._lua_gettable = ne("lua_gettable"), a._lua_getfield = ne("lua_getfield"), a._lua_geti = ne("lua_geti"), a._lua_rawget = ne("lua_rawget"), a._lua_rawgeti = ne("lua_rawgeti"), a._lua_rawgetp = ne("lua_rawgetp"), a._lua_createtable = ne("lua_createtable"), a._lua_getmetatable = ne("lua_getmetatable"), a._lua_getiuservalue = ne("lua_getiuservalue"), a._lua_setglobal = ne("lua_setglobal"), a._lua_settable = ne("lua_settable"), a._lua_setfield = ne("lua_setfield"), a._lua_seti = ne("lua_seti"), a._lua_rawset = ne("lua_rawset"), a._lua_rawsetp = ne("lua_rawsetp"), a._lua_rawseti = ne("lua_rawseti"), a._lua_setmetatable = ne("lua_setmetatable"), a._lua_setiuservalue = ne("lua_setiuservalue"), a._lua_callk = ne("lua_callk"), a._lua_pcallk = ne("lua_pcallk"), a._lua_load = ne("lua_load"), a._lua_dump = ne("lua_dump"), a._lua_status = ne("lua_status"), a._lua_error = ne("lua_error"), a._lua_next = ne("lua_next"), a._lua_toclose = ne("lua_toclose"), a._lua_concat = ne("lua_concat"), a._lua_len = ne("lua_len"), a._lua_getallocf = ne("lua_getallocf"), a._lua_setallocf = ne("lua_setallocf"), a._lua_setwarnf = ne("lua_setwarnf"), a._lua_warning = ne("lua_warning"), a._lua_newuserdatauv = ne("lua_newuserdatauv"), a._lua_getupvalue = ne("lua_getupvalue"), a._lua_setupvalue = ne("lua_setupvalue"), a._lua_upvalueid = ne("lua_upvalueid"), a._lua_upvaluejoin = ne("lua_upvaluejoin"), a._luaL_traceback = ne("luaL_traceback"), a._lua_getstack = ne("lua_getstack"), a._lua_getinfo = ne("lua_getinfo"), a._luaL_buffinit = ne("luaL_buffinit"), a._luaL_addstring = ne("luaL_addstring"), a._luaL_prepbuffsize = ne("luaL_prepbuffsize"), a._luaL_addvalue = ne("luaL_addvalue"), a._luaL_pushresult = ne("luaL_pushresult"), a._luaL_argerror = ne("luaL_argerror"), a._luaL_typeerror = ne("luaL_typeerror"), a._luaL_getmetafield = ne("luaL_getmetafield"), a._luaL_where = ne("luaL_where"), a._luaL_fileresult = ne("luaL_fileresult");
				var zt = ne("__errno_location");
				a._luaL_execresult = ne("luaL_execresult"), a._luaL_newmetatable = ne("luaL_newmetatable"), a._luaL_setmetatable = ne("luaL_setmetatable"), a._luaL_testudata = ne("luaL_testudata"), a._luaL_checkudata = ne("luaL_checkudata"), a._luaL_optlstring = ne("luaL_optlstring"), a._luaL_checklstring = ne("luaL_checklstring"), a._luaL_checkstack = ne("luaL_checkstack"), a._luaL_checktype = ne("luaL_checktype"), a._luaL_checkany = ne("luaL_checkany"), a._luaL_checknumber = ne("luaL_checknumber"), a._luaL_optnumber = ne("luaL_optnumber"), a._luaL_checkinteger = ne("luaL_checkinteger"), a._luaL_optinteger = ne("luaL_optinteger"), a._luaL_setfuncs = ne("luaL_setfuncs"), a._luaL_addlstring = ne("luaL_addlstring"), a._luaL_pushresultsize = ne("luaL_pushresultsize"), a._luaL_buffinitsize = ne("luaL_buffinitsize"), a._luaL_ref = ne("luaL_ref"), a._luaL_unref = ne("luaL_unref"), a._luaL_loadfilex = ne("luaL_loadfilex"), a._luaL_loadbufferx = ne("luaL_loadbufferx"), a._luaL_loadstring = ne("luaL_loadstring"), a._luaL_callmeta = ne("luaL_callmeta"), a._luaL_len = ne("luaL_len"), a._luaL_tolstring = ne("luaL_tolstring"), a._luaL_getsubtable = ne("luaL_getsubtable"), a._luaL_requiref = ne("luaL_requiref"), a._luaL_addgsub = ne("luaL_addgsub"), a._luaL_gsub = ne("luaL_gsub"), a._luaL_newstate = ne("luaL_newstate"), a._lua_newstate = ne("lua_newstate"), a._free = ne("free"), a._realloc = ne("realloc");
				var Pt = a._fflush = ne("fflush");
				a._luaL_checkversion_ = ne("luaL_checkversion_"), a._luaopen_base = ne("luaopen_base"), a._luaopen_coroutine = ne("luaopen_coroutine"), a._lua_newthread = ne("lua_newthread"), a._lua_yieldk = ne("lua_yieldk"), a._lua_isyieldable = ne("lua_isyieldable"), a._lua_resetthread = ne("lua_resetthread"), a._lua_resume = ne("lua_resume"), a._luaopen_debug = ne("luaopen_debug"), a._lua_gethookmask = ne("lua_gethookmask"), a._lua_gethook = ne("lua_gethook"), a._lua_gethookcount = ne("lua_gethookcount"), a._lua_getlocal = ne("lua_getlocal"), a._lua_sethook = ne("lua_sethook"), a._lua_setlocal = ne("lua_setlocal"), a._lua_setcstacklimit = ne("lua_setcstacklimit");
				var Rt = a._malloc = ne("malloc");
				a._luaL_openlibs = ne("luaL_openlibs"), a._luaopen_package = ne("luaopen_package"), a._luaopen_table = ne("luaopen_table"), a._luaopen_io = ne("luaopen_io"), a._luaopen_os = ne("luaopen_os"), a._luaopen_string = ne("luaopen_string"), a._luaopen_math = ne("luaopen_math"), a._luaopen_utf8 = ne("luaopen_utf8"), a._lua_close = ne("lua_close");
				var It, Ft = ne("setThrew"), At = () => (At = xt.emscripten_stack_init)(), Mt = () => (Mt = xt.emscripten_stack_get_end)(), Nt = ne("stackSave"), Dt = ne("stackRestore"), Ct = ne("stackAlloc");
				function jt() {
					if (!(0 < H)) {
						At();
						var e = Mt();
						if (N(!(3 & e)), 0 == e && (e += 4), R[e >> 2] = 34821223, R[e + 4 >> 2] = 2310721022, R[0] = 1668509029, a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length;) e = a.preRun.shift(), U.unshift(e);
						for (; 0 < U.length;) U.shift()(a);
						if (!(0 < H)) {
							if (!It && (It = !0, a.calledRun = !0, !M)) {
								for (N(!V), V = !0, C(), a.noFSInit || ot.R.Y || ot.R(), ot.ta = !1; 0 < Z.length;) Z.shift()(a);
								for (t(a), N(!a._main, "compiled without a main, but one is present. if you added it from JS, use Module[\"onRuntimeInitialized\"]"), C(); 0 < B.length;) B.shift()(a);
							}
							C();
						}
					}
				}
				return a.ENV = bt, a.ccall = (e, t, n, r) => {
					var o = {
						string: (e) => {
							var t = 0;
							if (null != e && 0 !== e) {
								t = Se(e) + 1;
								var n = Ct(t);
								ht(e, n, t), t = n;
							}
							return t;
						},
						array: (e) => {
							var t = Ct(e.length);
							return kt(e, t), t;
						}
					};
					e = ((e) => {
						var t = a["_" + e];
						return N(t, "Cannot call unknown function " + e + ", make sure it is exported"), t;
					})(e);
					var i, s = [], u = 0;
					if (N("array" !== t, "Return type should not be \"array\"."), r) for (var l = 0; l < r.length; l++) {
						var c = o[n[l]];
						c ? (0 === u && (u = Nt()), s[l] = c(r[l])) : s[l] = r[l];
					}
					return n = e.apply(null, s), i = n, 0 !== u && Dt(u), "string" === t ? it(i) : "boolean" === t ? !!i : i;
				}, a.addFunction = (e, t) => {
					if (N(void 0 !== e), !pt) {
						pt = /* @__PURE__ */ new WeakMap();
						var n = dt.length;
						if (pt) for (var r = 0; r < 0 + n; r++) {
							var a = Tt(r);
							a && pt.set(a, r);
						}
					}
					if (n = pt.get(e) || 0) return n;
					if (St.length) n = St.pop();
					else {
						try {
							dt.grow(1);
						} catch (s) {
							if (!(s instanceof RangeError)) throw s;
							throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
						}
						n = dt.length - 1;
					}
					try {
						r = n, dt.set(r, e), Et[r] = dt.get(r);
					} catch (s) {
						if (!(s instanceof TypeError)) throw s;
						if (N(void 0 !== t, "Missing signature argument to addFunction: " + e), "function" == typeof WebAssembly.Function) {
							r = WebAssembly.Function, a = {
								i: "i32",
								j: "i64",
								f: "f32",
								d: "f64",
								e: "externref",
								p: "i32"
							};
							for (var o = {
								parameters: [],
								results: "v" == t[0] ? [] : [a[t[0]]]
							}, i = 1; i < t.length; ++i) N(t[i] in a, "invalid signature char: " + t[i]), o.parameters.push(a[t[i]]);
							t = new r(o, e);
						} else {
							for (r = [1], a = t.slice(0, 1), t = t.slice(1), o = {
								i: 127,
								p: 127,
								j: 126,
								f: 125,
								d: 124,
								e: 111
							}, r.push(96), N(16384 > (i = t.length)), 128 > i ? r.push(i) : r.push(i % 128 | 128, i >> 7), i = 0; i < t.length; ++i) N(t[i] in o, "invalid signature char: " + t[i]), r.push(o[t[i]]);
							"v" == a ? r.push(0) : r.push(1, o[a]), t = [
								0,
								97,
								115,
								109,
								1,
								0,
								0,
								0,
								1
							], N(16384 > (a = r.length)), 128 > a ? t.push(a) : t.push(a % 128 | 128, a >> 7), t.push.apply(t, r), t.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0), t = new WebAssembly.Module(new Uint8Array(t)), t = new WebAssembly.Instance(t, { e: { f: e } }).exports.f;
						}
						r = n, dt.set(r, t), Et[r] = dt.get(r);
					}
					return pt.set(e, n), n;
				}, a.removeFunction = (e) => {
					pt.delete(Tt(e)), dt.set(e, null), Et[e] = dt.get(e), St.push(e);
				}, a.setValue = function(e, t, n = "i8") {
					switch (n.endsWith("*") && (n = "*"), n) {
						case "i1":
						case "i8":
							L[0 | e] = t;
							break;
						case "i16":
							x[e >> 1] = t;
							break;
						case "i32":
							P[e >> 2] = t;
							break;
						case "i64":
							F[e >> 3] = BigInt(t);
							break;
						case "float":
							I[e >> 2] = t;
							break;
						case "double":
							A[e >> 3] = t;
							break;
						case "*":
							R[e >> 2] = t;
							break;
						default: K(`invalid type for setValue: ${n}`);
					}
				}, a.getValue = function(e, t = "i8") {
					switch (t.endsWith("*") && (t = "*"), t) {
						case "i1":
						case "i8": return L[0 | e];
						case "i16": return x[e >> 1];
						case "i32": return P[e >> 2];
						case "i64": return F[e >> 3];
						case "float": return I[e >> 2];
						case "double": return A[e >> 3];
						case "*": return R[e >> 2];
						default: K(`invalid type for getValue: ${t}`);
					}
				}, a.stringToUTF8 = ht, a.lengthBytesUTF8 = Se, a.stringToNewUTF8 = gt, a.FS = ot, "writeI53ToI64 writeI53ToI64Clamped writeI53ToI64Signaling writeI53ToU64Clamped writeI53ToU64Signaling readI53FromI64 readI53FromU64 convertI32PairToI53 convertI32PairToI53Checked convertU32PairToI53 inetPton4 inetNtop4 inetPton6 inetNtop6 readSockaddr writeSockaddr getHostByName getCallstack emscriptenLog convertPCtoSourceLocation readEmAsmArgs jstoi_q jstoi_s listenOnce autoResumeAudioContext getDynCaller dynCall handleException runtimeKeepalivePush runtimeKeepalivePop callUserCallback maybeExit asmjsMangle handleAllocatorInit HandleAllocator getNativeTypeSize STACK_SIZE STACK_ALIGN POINTER_SIZE ASSERTIONS cwrap reallyNegative unSign strLen reSign formatString intArrayToString AsciiToString UTF16ToString stringToUTF16 lengthBytesUTF16 UTF32ToString stringToUTF32 lengthBytesUTF32 registerKeyEventCallback maybeCStringToJsString findEventTarget findCanvasEventTarget getBoundingClientRect fillMouseEventData registerMouseEventCallback registerWheelEventCallback registerUiEventCallback registerFocusEventCallback fillDeviceOrientationEventData registerDeviceOrientationEventCallback fillDeviceMotionEventData registerDeviceMotionEventCallback screenOrientation fillOrientationChangeEventData registerOrientationChangeEventCallback fillFullscreenChangeEventData registerFullscreenChangeEventCallback JSEvents_requestFullscreen JSEvents_resizeCanvasForFullscreen registerRestoreOldStyle hideEverythingExceptGivenElement restoreHiddenElements setLetterbox softFullscreenResizeWebGLRenderTarget doRequestFullscreen fillPointerlockChangeEventData registerPointerlockChangeEventCallback registerPointerlockErrorEventCallback requestPointerLock fillVisibilityChangeEventData registerVisibilityChangeEventCallback registerTouchEventCallback fillGamepadEventData registerGamepadEventCallback registerBeforeUnloadEventCallback fillBatteryEventData battery registerBatteryEventCallback setCanvasElementSize getCanvasElementSize jsStackTrace stackTrace checkWasiClock wasiRightsToMuslOFlags wasiOFlagsToMuslOFlags createDyncallWrapper safeSetTimeout setImmediateWrapped clearImmediateWrapped polyfillSetImmediate getPromise makePromise idsToPromises makePromiseCallback setMainLoop getSocketFromFD getSocketAddress FS_unlink FS_mkdirTree _setNetworkCallback".split(" ").forEach(function(e) {
					"undefined" == typeof globalThis || Object.getOwnPropertyDescriptor(globalThis, e) || Object.defineProperty(globalThis, e, {
						configurable: !0,
						get() {
							var t = `\`${e}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`, n = e;
							n.startsWith("_") || (n = "$" + e), t += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${n}')`, ue(e) && (t += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), fe(t);
						}
					}), ce(e);
				}), "run addOnPreRun addOnInit addOnPreMain addOnExit addOnPostRun addRunDependency removeRunDependency FS_createFolder FS_createPath FS_createLazyFile FS_createLink FS_createDevice FS_readFile out err callMain abort wasmMemory wasmExports stackAlloc stackSave stackRestore getTempRet0 setTempRet0 writeStackCookie checkStackCookie MAX_INT53 MIN_INT53 bigintToI53Checked ptrToString zeroMemory exitJS getHeapMax growMemory MONTH_DAYS_REGULAR MONTH_DAYS_LEAP MONTH_DAYS_REGULAR_CUMULATIVE MONTH_DAYS_LEAP_CUMULATIVE isLeapYear ydayFromDate arraySum addDays ERRNO_CODES ERRNO_MESSAGES setErrNo DNS Protocols Sockets initRandomFill randomFill timers warnOnce UNWIND_CACHE readEmAsmArgsArray getExecutableName keepRuntimeAlive asyncLoad alignMemory mmapAlloc wasmTable noExitRuntime getCFunc uleb128Encode sigToWasmTypes generateFuncType convertJsFunctionToWasm freeTableIndexes functionsInTableMap getEmptyTableSlot updateTableMap getFunctionAddress PATH PATH_FS UTF8Decoder UTF8ArrayToString UTF8ToString stringToUTF8Array intArrayFromString stringToAscii UTF16Decoder stringToUTF8OnStack writeArrayToMemory JSEvents specialHTMLTargets currentFullscreenStrategy restoreOldWindowedStyle demangle demangleAll ExitStatus getEnvStrings doReadv doWritev promiseMap Browser wget SYSCALLS preloadPlugins FS_createPreloadedFile FS_modeStringToFlags FS_getMode FS_stdin_getChar_buffer FS_stdin_getChar FS_createDataFile MEMFS TTY PIPEFS SOCKFS".split(" ").forEach(ce), Y = function e() {
					It || jt(), It || (Y = e);
				}, jt(), e.ready;
			});
			class R {
				static async initialize(e, t) {
					return new R(await P({
						locateFile: (t, n) => e || n + t,
						preRun: (e) => {
							"object" == typeof t && Object.entries(t).forEach(([t, n]) => e.ENV[t] = n);
						}
					}));
				}
				constructor(e) {
					this.referenceTracker = /* @__PURE__ */ new WeakMap(), this.referenceMap = /* @__PURE__ */ new Map(), this.availableReferences = [], this.module = e, this.luaL_checkversion_ = this.cwrap("luaL_checkversion_", null, [
						"number",
						"number",
						"number"
					]), this.luaL_getmetafield = this.cwrap("luaL_getmetafield", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_callmeta = this.cwrap("luaL_callmeta", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_tolstring = this.cwrap("luaL_tolstring", "string", [
						"number",
						"number",
						"number"
					]), this.luaL_argerror = this.cwrap("luaL_argerror", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_typeerror = this.cwrap("luaL_typeerror", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_checklstring = this.cwrap("luaL_checklstring", "string", [
						"number",
						"number",
						"number"
					]), this.luaL_optlstring = this.cwrap("luaL_optlstring", "string", [
						"number",
						"number",
						"string",
						"number"
					]), this.luaL_checknumber = this.cwrap("luaL_checknumber", "number", ["number", "number"]), this.luaL_optnumber = this.cwrap("luaL_optnumber", "number", [
						"number",
						"number",
						"number"
					]), this.luaL_checkinteger = this.cwrap("luaL_checkinteger", "number", ["number", "number"]), this.luaL_optinteger = this.cwrap("luaL_optinteger", "number", [
						"number",
						"number",
						"number"
					]), this.luaL_checkstack = this.cwrap("luaL_checkstack", null, [
						"number",
						"number",
						"string"
					]), this.luaL_checktype = this.cwrap("luaL_checktype", null, [
						"number",
						"number",
						"number"
					]), this.luaL_checkany = this.cwrap("luaL_checkany", null, ["number", "number"]), this.luaL_newmetatable = this.cwrap("luaL_newmetatable", "number", ["number", "string"]), this.luaL_setmetatable = this.cwrap("luaL_setmetatable", null, ["number", "string"]), this.luaL_testudata = this.cwrap("luaL_testudata", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_checkudata = this.cwrap("luaL_checkudata", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_where = this.cwrap("luaL_where", null, ["number", "number"]), this.luaL_fileresult = this.cwrap("luaL_fileresult", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_execresult = this.cwrap("luaL_execresult", "number", ["number", "number"]), this.luaL_ref = this.cwrap("luaL_ref", "number", ["number", "number"]), this.luaL_unref = this.cwrap("luaL_unref", null, [
						"number",
						"number",
						"number"
					]), this.luaL_loadfilex = this.cwrap("luaL_loadfilex", "number", [
						"number",
						"string",
						"string"
					]), this.luaL_loadbufferx = this.cwrap("luaL_loadbufferx", "number", [
						"number",
						"string|number",
						"number",
						"string|number",
						"string"
					]), this.luaL_loadstring = this.cwrap("luaL_loadstring", "number", ["number", "string"]), this.luaL_newstate = this.cwrap("luaL_newstate", "number", []), this.luaL_len = this.cwrap("luaL_len", "number", ["number", "number"]), this.luaL_addgsub = this.cwrap("luaL_addgsub", null, [
						"number",
						"string",
						"string",
						"string"
					]), this.luaL_gsub = this.cwrap("luaL_gsub", "string", [
						"number",
						"string",
						"string",
						"string"
					]), this.luaL_setfuncs = this.cwrap("luaL_setfuncs", null, [
						"number",
						"number",
						"number"
					]), this.luaL_getsubtable = this.cwrap("luaL_getsubtable", "number", [
						"number",
						"number",
						"string"
					]), this.luaL_traceback = this.cwrap("luaL_traceback", null, [
						"number",
						"number",
						"string",
						"number"
					]), this.luaL_requiref = this.cwrap("luaL_requiref", null, [
						"number",
						"string",
						"number",
						"number"
					]), this.luaL_buffinit = this.cwrap("luaL_buffinit", null, ["number", "number"]), this.luaL_prepbuffsize = this.cwrap("luaL_prepbuffsize", "string", ["number", "number"]), this.luaL_addlstring = this.cwrap("luaL_addlstring", null, [
						"number",
						"string",
						"number"
					]), this.luaL_addstring = this.cwrap("luaL_addstring", null, ["number", "string"]), this.luaL_addvalue = this.cwrap("luaL_addvalue", null, ["number"]), this.luaL_pushresult = this.cwrap("luaL_pushresult", null, ["number"]), this.luaL_pushresultsize = this.cwrap("luaL_pushresultsize", null, ["number", "number"]), this.luaL_buffinitsize = this.cwrap("luaL_buffinitsize", "string", [
						"number",
						"number",
						"number"
					]), this.lua_newstate = this.cwrap("lua_newstate", "number", ["number", "number"]), this.lua_close = this.cwrap("lua_close", null, ["number"]), this.lua_newthread = this.cwrap("lua_newthread", "number", ["number"]), this.lua_resetthread = this.cwrap("lua_resetthread", "number", ["number"]), this.lua_atpanic = this.cwrap("lua_atpanic", "number", ["number", "number"]), this.lua_version = this.cwrap("lua_version", "number", ["number"]), this.lua_absindex = this.cwrap("lua_absindex", "number", ["number", "number"]), this.lua_gettop = this.cwrap("lua_gettop", "number", ["number"]), this.lua_settop = this.cwrap("lua_settop", null, ["number", "number"]), this.lua_pushvalue = this.cwrap("lua_pushvalue", null, ["number", "number"]), this.lua_rotate = this.cwrap("lua_rotate", null, [
						"number",
						"number",
						"number"
					]), this.lua_copy = this.cwrap("lua_copy", null, [
						"number",
						"number",
						"number"
					]), this.lua_checkstack = this.cwrap("lua_checkstack", "number", ["number", "number"]), this.lua_xmove = this.cwrap("lua_xmove", null, [
						"number",
						"number",
						"number"
					]), this.lua_isnumber = this.cwrap("lua_isnumber", "number", ["number", "number"]), this.lua_isstring = this.cwrap("lua_isstring", "number", ["number", "number"]), this.lua_iscfunction = this.cwrap("lua_iscfunction", "number", ["number", "number"]), this.lua_isinteger = this.cwrap("lua_isinteger", "number", ["number", "number"]), this.lua_isuserdata = this.cwrap("lua_isuserdata", "number", ["number", "number"]), this.lua_type = this.cwrap("lua_type", "number", ["number", "number"]), this.lua_typename = this.cwrap("lua_typename", "string", ["number", "number"]), this.lua_tonumberx = this.cwrap("lua_tonumberx", "number", [
						"number",
						"number",
						"number"
					]), this.lua_tointegerx = this.cwrap("lua_tointegerx", "number", [
						"number",
						"number",
						"number"
					]), this.lua_toboolean = this.cwrap("lua_toboolean", "number", ["number", "number"]), this.lua_tolstring = this.cwrap("lua_tolstring", "string", [
						"number",
						"number",
						"number"
					]), this.lua_rawlen = this.cwrap("lua_rawlen", "number", ["number", "number"]), this.lua_tocfunction = this.cwrap("lua_tocfunction", "number", ["number", "number"]), this.lua_touserdata = this.cwrap("lua_touserdata", "number", ["number", "number"]), this.lua_tothread = this.cwrap("lua_tothread", "number", ["number", "number"]), this.lua_topointer = this.cwrap("lua_topointer", "number", ["number", "number"]), this.lua_arith = this.cwrap("lua_arith", null, ["number", "number"]), this.lua_rawequal = this.cwrap("lua_rawequal", "number", [
						"number",
						"number",
						"number"
					]), this.lua_compare = this.cwrap("lua_compare", "number", [
						"number",
						"number",
						"number",
						"number"
					]), this.lua_pushnil = this.cwrap("lua_pushnil", null, ["number"]), this.lua_pushnumber = this.cwrap("lua_pushnumber", null, ["number", "number"]), this.lua_pushinteger = this.cwrap("lua_pushinteger", null, ["number", "number"]), this.lua_pushlstring = this.cwrap("lua_pushlstring", "string", [
						"number",
						"string|number",
						"number"
					]), this.lua_pushstring = this.cwrap("lua_pushstring", "string", ["number", "string|number"]), this.lua_pushcclosure = this.cwrap("lua_pushcclosure", null, [
						"number",
						"number",
						"number"
					]), this.lua_pushboolean = this.cwrap("lua_pushboolean", null, ["number", "number"]), this.lua_pushlightuserdata = this.cwrap("lua_pushlightuserdata", null, ["number", "number"]), this.lua_pushthread = this.cwrap("lua_pushthread", "number", ["number"]), this.lua_getglobal = this.cwrap("lua_getglobal", "number", ["number", "string"]), this.lua_gettable = this.cwrap("lua_gettable", "number", ["number", "number"]), this.lua_getfield = this.cwrap("lua_getfield", "number", [
						"number",
						"number",
						"string"
					]), this.lua_geti = this.cwrap("lua_geti", "number", [
						"number",
						"number",
						"number"
					]), this.lua_rawget = this.cwrap("lua_rawget", "number", ["number", "number"]), this.lua_rawgeti = this.cwrap("lua_rawgeti", "number", [
						"number",
						"number",
						"number"
					]), this.lua_rawgetp = this.cwrap("lua_rawgetp", "number", [
						"number",
						"number",
						"number"
					]), this.lua_createtable = this.cwrap("lua_createtable", null, [
						"number",
						"number",
						"number"
					]), this.lua_newuserdatauv = this.cwrap("lua_newuserdatauv", "number", [
						"number",
						"number",
						"number"
					]), this.lua_getmetatable = this.cwrap("lua_getmetatable", "number", ["number", "number"]), this.lua_getiuservalue = this.cwrap("lua_getiuservalue", "number", [
						"number",
						"number",
						"number"
					]), this.lua_setglobal = this.cwrap("lua_setglobal", null, ["number", "string"]), this.lua_settable = this.cwrap("lua_settable", null, ["number", "number"]), this.lua_setfield = this.cwrap("lua_setfield", null, [
						"number",
						"number",
						"string"
					]), this.lua_seti = this.cwrap("lua_seti", null, [
						"number",
						"number",
						"number"
					]), this.lua_rawset = this.cwrap("lua_rawset", null, ["number", "number"]), this.lua_rawseti = this.cwrap("lua_rawseti", null, [
						"number",
						"number",
						"number"
					]), this.lua_rawsetp = this.cwrap("lua_rawsetp", null, [
						"number",
						"number",
						"number"
					]), this.lua_setmetatable = this.cwrap("lua_setmetatable", "number", ["number", "number"]), this.lua_setiuservalue = this.cwrap("lua_setiuservalue", "number", [
						"number",
						"number",
						"number"
					]), this.lua_callk = this.cwrap("lua_callk", null, [
						"number",
						"number",
						"number",
						"number",
						"number"
					]), this.lua_pcallk = this.cwrap("lua_pcallk", "number", [
						"number",
						"number",
						"number",
						"number",
						"number",
						"number"
					]), this.lua_load = this.cwrap("lua_load", "number", [
						"number",
						"number",
						"number",
						"string",
						"string"
					]), this.lua_dump = this.cwrap("lua_dump", "number", [
						"number",
						"number",
						"number",
						"number"
					]), this.lua_yieldk = this.cwrap("lua_yieldk", "number", [
						"number",
						"number",
						"number",
						"number"
					]), this.lua_resume = this.cwrap("lua_resume", "number", [
						"number",
						"number",
						"number",
						"number"
					]), this.lua_status = this.cwrap("lua_status", "number", ["number"]), this.lua_isyieldable = this.cwrap("lua_isyieldable", "number", ["number"]), this.lua_setwarnf = this.cwrap("lua_setwarnf", null, [
						"number",
						"number",
						"number"
					]), this.lua_warning = this.cwrap("lua_warning", null, [
						"number",
						"string",
						"number"
					]), this.lua_error = this.cwrap("lua_error", "number", ["number"]), this.lua_next = this.cwrap("lua_next", "number", ["number", "number"]), this.lua_concat = this.cwrap("lua_concat", null, ["number", "number"]), this.lua_len = this.cwrap("lua_len", null, ["number", "number"]), this.lua_stringtonumber = this.cwrap("lua_stringtonumber", "number", ["number", "string"]), this.lua_getallocf = this.cwrap("lua_getallocf", "number", ["number", "number"]), this.lua_setallocf = this.cwrap("lua_setallocf", null, [
						"number",
						"number",
						"number"
					]), this.lua_toclose = this.cwrap("lua_toclose", null, ["number", "number"]), this.lua_closeslot = this.cwrap("lua_closeslot", null, ["number", "number"]), this.lua_getstack = this.cwrap("lua_getstack", "number", [
						"number",
						"number",
						"number"
					]), this.lua_getinfo = this.cwrap("lua_getinfo", "number", [
						"number",
						"string",
						"number"
					]), this.lua_getlocal = this.cwrap("lua_getlocal", "string", [
						"number",
						"number",
						"number"
					]), this.lua_setlocal = this.cwrap("lua_setlocal", "string", [
						"number",
						"number",
						"number"
					]), this.lua_getupvalue = this.cwrap("lua_getupvalue", "string", [
						"number",
						"number",
						"number"
					]), this.lua_setupvalue = this.cwrap("lua_setupvalue", "string", [
						"number",
						"number",
						"number"
					]), this.lua_upvalueid = this.cwrap("lua_upvalueid", "number", [
						"number",
						"number",
						"number"
					]), this.lua_upvaluejoin = this.cwrap("lua_upvaluejoin", null, [
						"number",
						"number",
						"number",
						"number",
						"number"
					]), this.lua_sethook = this.cwrap("lua_sethook", null, [
						"number",
						"number",
						"number",
						"number"
					]), this.lua_gethook = this.cwrap("lua_gethook", "number", ["number"]), this.lua_gethookmask = this.cwrap("lua_gethookmask", "number", ["number"]), this.lua_gethookcount = this.cwrap("lua_gethookcount", "number", ["number"]), this.lua_setcstacklimit = this.cwrap("lua_setcstacklimit", "number", ["number", "number"]), this.luaopen_base = this.cwrap("luaopen_base", "number", ["number"]), this.luaopen_coroutine = this.cwrap("luaopen_coroutine", "number", ["number"]), this.luaopen_table = this.cwrap("luaopen_table", "number", ["number"]), this.luaopen_io = this.cwrap("luaopen_io", "number", ["number"]), this.luaopen_os = this.cwrap("luaopen_os", "number", ["number"]), this.luaopen_string = this.cwrap("luaopen_string", "number", ["number"]), this.luaopen_utf8 = this.cwrap("luaopen_utf8", "number", ["number"]), this.luaopen_math = this.cwrap("luaopen_math", "number", ["number"]), this.luaopen_debug = this.cwrap("luaopen_debug", "number", ["number"]), this.luaopen_package = this.cwrap("luaopen_package", "number", ["number"]), this.luaL_openlibs = this.cwrap("luaL_openlibs", null, ["number"]);
				}
				lua_remove(e, t) {
					this.lua_rotate(e, t, -1), this.lua_pop(e, 1);
				}
				lua_pop(e, t) {
					this.lua_settop(e, -t - 1);
				}
				luaL_getmetatable(e, t) {
					return this.lua_getfield(e, a, t);
				}
				lua_yield(e, t) {
					return this.lua_yieldk(e, t, 0, null);
				}
				lua_upvalueindex(e) {
					return a - e;
				}
				ref(e) {
					const t = this.referenceTracker.get(e);
					if (t) return t.refCount++, t.index;
					const n = this.availableReferences.pop(), r = void 0 === n ? this.referenceMap.size + 1 : n;
					return this.referenceMap.set(r, e), this.referenceTracker.set(e, {
						refCount: 1,
						index: r
					}), this.lastRefIndex = r, r;
				}
				unref(e) {
					const t = this.referenceMap.get(e);
					if (void 0 === t) return;
					const n = this.referenceTracker.get(t);
					if (void 0 === n) return this.referenceTracker.delete(t), void this.availableReferences.push(e);
					n.refCount--, n.refCount <= 0 && (this.referenceTracker.delete(t), this.referenceMap.delete(e), this.availableReferences.push(e));
				}
				getRef(e) {
					return this.referenceMap.get(e);
				}
				getLastRefIndex() {
					return this.lastRefIndex;
				}
				printRefs() {
					for (const [e, t] of this.referenceMap.entries()) console.log(e, t);
				}
				cwrap(e, t, n) {
					return n.some((e) => "string|number" === e) ? (...r) => {
						const a = [], o = n.map((e, t) => {
							var n;
							if ("string|number" === e) {
								if ("number" == typeof r[t]) return "number";
								if ((null === (n = r[t]) || void 0 === n ? void 0 : n.length) > 1024) {
									const e = this.module.stringToNewUTF8(r[t]);
									return r[t] = e, a.push(e), "number";
								}
								return "string";
							}
							return e;
						});
						try {
							return this.module.ccall(e, t, o, r);
						} finally {
							for (const e of a) this.module._free(e);
						}
					} : (...r) => this.module.ccall(e, t, n, r);
				}
			}
			e.Decoration = p, e.LUAI_MAXSTACK = r, e.LUA_MULTRET = -1, e.LUA_REGISTRYINDEX = a, e.LuaEngine = x, e.LuaFactory = class {
				constructor(e, t) {
					var n;
					void 0 === e && ("object" == typeof window && void 0 !== window.document || "object" == typeof self && "DedicatedWorkerGlobalScope" === (null === (n = null === self || void 0 === self ? void 0 : self.constructor) || void 0 === n ? void 0 : n.name)) && (e = "https://unpkg.com/wasmoon@1.16.0/dist/glue.wasm"), this.luaWasmPromise = R.initialize(e, t);
				}
				async mountFile(e, t) {
					this.mountFileSync(await this.getLuaModule(), e, t);
				}
				mountFileSync(e, t, n) {
					const r = t.lastIndexOf("/"), a = t.substring(r + 1), o = t.substring(0, t.length - a.length - 1);
					if (o.length > 0) {
						const t = o.split("/").reverse();
						let n = "";
						for (; t.length;) {
							const r = t.pop();
							if (!r) continue;
							const a = `${n}/${r}`;
							try {
								e.module.FS.mkdir(a);
							} catch (i) {}
							n = a;
						}
					}
					e.module.FS.writeFile(t, n);
				}
				async createEngine(e = {}) {
					return new x(await this.getLuaModule(), e);
				}
				async getLuaModule() {
					return this.luaWasmPromise;
				}
			}, e.LuaGlobal = _, e.LuaMultiReturn = f, e.LuaRawResult = y, e.LuaThread = m, e.LuaTimeoutError = d, e.LuaTypeExtension = g, e.LuaWasm = R, e.PointerSize = 4, e.decorate = function(e, t) {
				return new p(e, t);
			}, e.decorateFunction = w, e.decorateProxy = T, e.decorateUserdata = function(e) {
				return new p(e, { reference: !0 });
			};
		};
		"object" == typeof e && void 0 !== t ? r(e) : "function" == typeof define && define.amd ? define(["exports"], r) : r((n = "undefined" != typeof globalThis ? globalThis : n || self).wasmoon = {});
	});
	Object.freeze({ status: "aborted" });
	function c(e, t, n) {
		function r(n, r) {
			if (n._zod || Object.defineProperty(n, "_zod", {
				value: {
					def: r,
					constr: i,
					traits: /* @__PURE__ */ new Set()
				},
				enumerable: !1
			}), n._zod.traits.has(e)) return;
			n._zod.traits.add(e), t(n, r);
			const a = i.prototype, o = Object.keys(a);
			for (let e = 0; e < o.length; e++) {
				const t = o[e];
				t in n || (n[t] = a[t].bind(n));
			}
		}
		const a = n?.Parent ?? Object;
		class o extends a {}
		function i(e) {
			var t;
			const a = n?.Parent ? new o() : this;
			r(a, e), (t = a._zod).deferred ?? (t.deferred = []);
			for (const n of a._zod.deferred) n();
			return a;
		}
		return Object.defineProperty(o, "name", { value: e }), Object.defineProperty(i, "init", { value: r }), Object.defineProperty(i, Symbol.hasInstance, { value: (t) => !!(n?.Parent && t instanceof n.Parent) || t?._zod?.traits?.has(e) }), Object.defineProperty(i, "name", { value: e }), i;
	}
	var d = class extends Error {
		constructor() {
			super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
		}
	}, p = class extends Error {
		constructor(e) {
			super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
		}
	};
	const h = {};
	function f(e) {
		return e && Object.assign(h, e), h;
	}
	function m(e) {
		const t = Object.values(e).filter((e) => "number" == typeof e);
		return Object.entries(e).filter(([e, n]) => -1 === t.indexOf(+e)).map(([e, t]) => t);
	}
	function _(e, t) {
		return "bigint" == typeof t ? t.toString() : t;
	}
	function g(e) {
		return { get value() {
			{
				const t = e();
				return Object.defineProperty(this, "value", { value: t }), t;
			}
		} };
	}
	function b(e) {
		return null == e;
	}
	function y(e) {
		const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
		return e.slice(t, n);
	}
	const w = Symbol("evaluating");
	function v(e, t, n) {
		let r;
		Object.defineProperty(e, t, {
			get() {
				if (r !== w) return void 0 === r && (r = w, r = n()), r;
			},
			set(n) {
				Object.defineProperty(e, t, { value: n });
			},
			configurable: !0
		});
	}
	function k(e, t, n) {
		Object.defineProperty(e, t, {
			value: n,
			writable: !0,
			enumerable: !0,
			configurable: !0
		});
	}
	function E(...e) {
		const t = {};
		for (const n of e) Object.assign(t, Object.getOwnPropertyDescriptors(n));
		return Object.defineProperties({}, t);
	}
	function T(e) {
		return JSON.stringify(e);
	}
	const S = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
	function L(e) {
		return "object" == typeof e && null !== e && !Array.isArray(e);
	}
	const O = g(() => {
		if ("undefined" != typeof navigator && navigator?.userAgent?.includes("Cloudflare")) return !1;
		try {
			return new Function(""), !0;
		} catch (e) {
			return !1;
		}
	});
	function x(e) {
		if (!1 === L(e)) return !1;
		const t = e.constructor;
		if (void 0 === t) return !0;
		if ("function" != typeof t) return !0;
		const n = t.prototype;
		return !1 !== L(n) && !1 !== Object.prototype.hasOwnProperty.call(n, "isPrototypeOf");
	}
	function z(e) {
		return x(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
	}
	const P = new Set([
		"string",
		"number",
		"symbol"
	]);
	function R(e) {
		return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	function I(e, t, n) {
		const r = new e._zod.constr(t ?? e._zod.def);
		return t && !n?.parent || (r._zod.parent = e), r;
	}
	function F(e) {
		const t = e;
		if (!t) return {};
		if ("string" == typeof t) return { error: () => t };
		if (void 0 !== t?.message) {
			if (void 0 !== t?.error) throw new Error("Cannot specify both `message` and `error` params");
			t.error = t.message;
		}
		return delete t.message, "string" == typeof t.error ? {
			...t,
			error: () => t.error
		} : t;
	}
	const A = {
		safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-34028234663852886e22, 34028234663852886e22],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	};
	function M(e, t = 0) {
		if (!0 === e.aborted) return !0;
		for (let n = t; n < e.issues.length; n++) if (!0 !== e.issues[n]?.continue) return !0;
		return !1;
	}
	function N(e, t) {
		return t.map((t) => {
			var n;
			return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
		});
	}
	function D(e) {
		return "string" == typeof e ? e : e?.message;
	}
	function C(e, t, n) {
		const r = {
			...e,
			path: e.path ?? []
		};
		return e.message || (r.message = D(e.inst?._zod.def?.error?.(e)) ?? D(t?.error?.(e)) ?? D(n.customError?.(e)) ?? D(n.localeError?.(e)) ?? "Invalid input"), delete r.inst, delete r.continue, t?.reportInput || delete r.input, r;
	}
	function j(e) {
		return Array.isArray(e) ? "array" : "string" == typeof e ? "string" : "unknown";
	}
	function $(...e) {
		const [t, n, r] = e;
		return "string" == typeof t ? {
			message: t,
			code: "custom",
			input: n,
			inst: r
		} : { ...t };
	}
	const U = (e, t) => {
		e.name = "$ZodError", Object.defineProperty(e, "_zod", {
			value: e._zod,
			enumerable: !1
		}), Object.defineProperty(e, "issues", {
			value: t,
			enumerable: !1
		}), e.message = JSON.stringify(t, _, 2), Object.defineProperty(e, "toString", {
			value: () => e.message,
			enumerable: !1
		});
	}, Z = c("$ZodError", U), B = c("$ZodError", U, { Parent: Error });
	const V = (e) => (t, n, r, a) => {
		const o = r ? Object.assign(r, { async: !1 }) : { async: !1 }, i = t._zod.run({
			value: n,
			issues: []
		}, o);
		if (i instanceof Promise) throw new d();
		if (i.issues.length) {
			const t = new (a?.Err ?? e)(i.issues.map((e) => C(e, o, f())));
			throw S(t, a?.callee), t;
		}
		return i.value;
	}, H = (e) => async (t, n, r, a) => {
		const o = r ? Object.assign(r, { async: !0 }) : { async: !0 };
		let i = t._zod.run({
			value: n,
			issues: []
		}, o);
		if (i instanceof Promise && (i = await i), i.issues.length) {
			const t = new (a?.Err ?? e)(i.issues.map((e) => C(e, o, f())));
			throw S(t, a?.callee), t;
		}
		return i.value;
	}, W = (e) => (t, n, r) => {
		const a = r ? {
			...r,
			async: !1
		} : { async: !1 }, o = t._zod.run({
			value: n,
			issues: []
		}, a);
		if (o instanceof Promise) throw new d();
		return o.issues.length ? {
			success: !1,
			error: new (e ?? Z)(o.issues.map((e) => C(e, a, f())))
		} : {
			success: !0,
			data: o.value
		};
	}, Y = W(B), J = (e) => async (t, n, r) => {
		const a = r ? Object.assign(r, { async: !0 }) : { async: !0 };
		let o = t._zod.run({
			value: n,
			issues: []
		}, a);
		return o instanceof Promise && (o = await o), o.issues.length ? {
			success: !1,
			error: new e(o.issues.map((e) => C(e, a, f())))
		} : {
			success: !0,
			data: o.value
		};
	}, q = J(B), G = (e) => (t, n, r) => {
		const a = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
		return V(e)(t, n, a);
	}, X = (e) => (t, n, r) => V(e)(t, n, r), K = (e) => async (t, n, r) => {
		const a = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
		return H(e)(t, n, a);
	}, Q = (e) => async (t, n, r) => H(e)(t, n, r), ee = (e) => (t, n, r) => {
		const a = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
		return W(e)(t, n, a);
	}, te = (e) => (t, n, r) => W(e)(t, n, r), ne = (e) => async (t, n, r) => {
		const a = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
		return J(e)(t, n, a);
	}, re = (e) => async (t, n, r) => J(e)(t, n, r), ae = /^[cC][^\s-]{8,}$/, oe = /^[0-9a-z]+$/, ie = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, se = /^[0-9a-vA-V]{20}$/, ue = /^[A-Za-z0-9]{27}$/, le = /^[a-zA-Z0-9_-]{21}$/, ce = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, de = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, pe = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, he = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
	const fe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, me = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, _e = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, ge = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, be = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, ye = /^[A-Za-z0-9_-]*$/, we = /^\+[1-9]\d{6,14}$/, ve = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", ke = new RegExp(`^${ve}$`);
	function Ee(e) {
		const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
		return "number" == typeof e.precision ? -1 === e.precision ? `${t}` : 0 === e.precision ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
	}
	const Te = /^-?\d+$/, Se = /^-?\d+(?:\.\d+)?$/, Le = /^[^A-Z]*$/, Oe = /^[^a-z]*$/, xe = c("$ZodCheck", (e, t) => {
		var n;
		e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
	}), ze = {
		number: "number",
		bigint: "bigint",
		object: "date"
	}, Pe = c("$ZodCheckLessThan", (e, t) => {
		xe.init(e, t);
		const n = ze[typeof t.value];
		e._zod.onattach.push((e) => {
			const n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
			t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
		}), e._zod.check = (r) => {
			(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
				origin: n,
				code: "too_big",
				maximum: "object" == typeof t.value ? t.value.getTime() : t.value,
				input: r.value,
				inclusive: t.inclusive,
				inst: e,
				continue: !t.abort
			});
		};
	}), Re = c("$ZodCheckGreaterThan", (e, t) => {
		xe.init(e, t);
		const n = ze[typeof t.value];
		e._zod.onattach.push((e) => {
			const n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
			t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
		}), e._zod.check = (r) => {
			(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
				origin: n,
				code: "too_small",
				minimum: "object" == typeof t.value ? t.value.getTime() : t.value,
				input: r.value,
				inclusive: t.inclusive,
				inst: e,
				continue: !t.abort
			});
		};
	}), Ie = c("$ZodCheckMultipleOf", (e, t) => {
		xe.init(e, t), e._zod.onattach.push((e) => {
			var n;
			(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
		}), e._zod.check = (n) => {
			if (typeof n.value != typeof t.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
			("bigint" == typeof n.value ? n.value % t.value !== BigInt(0) : 0 !== function(e, t) {
				const n = (e.toString().split(".")[1] || "").length, r = t.toString();
				let a = (r.split(".")[1] || "").length;
				if (0 === a && /\d?e-\d?/.test(r)) {
					const e = r.match(/\d?e-(\d?)/);
					e?.[1] && (a = Number.parseInt(e[1]));
				}
				const o = n > a ? n : a;
				return Number.parseInt(e.toFixed(o).replace(".", "")) % Number.parseInt(t.toFixed(o).replace(".", "")) / 10 ** o;
			}(n.value, t.value)) && n.issues.push({
				origin: typeof n.value,
				code: "not_multiple_of",
				divisor: t.value,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), Fe = c("$ZodCheckNumberFormat", (e, t) => {
		xe.init(e, t), t.format = t.format || "float64";
		const n = t.format?.includes("int"), r = n ? "int" : "number", [a, o] = A[t.format];
		e._zod.onattach.push((e) => {
			const r = e._zod.bag;
			r.format = t.format, r.minimum = a, r.maximum = o, n && (r.pattern = Te);
		}), e._zod.check = (i) => {
			const s = i.value;
			if (n) {
				if (!Number.isInteger(s)) return void i.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				if (!Number.isSafeInteger(s)) return void (s > 0 ? i.issues.push({
					input: s,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : i.issues.push({
					input: s,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}));
			}
			s < a && i.issues.push({
				origin: "number",
				input: s,
				code: "too_small",
				minimum: a,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			}), s > o && i.issues.push({
				origin: "number",
				input: s,
				code: "too_big",
				maximum: o,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			});
		};
	}), Ae = c("$ZodCheckMaxLength", (e, t) => {
		var n;
		xe.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
			const t = e.value;
			return !b(t) && void 0 !== t.length;
		}), e._zod.onattach.push((e) => {
			const n = e._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
			t.maximum < n && (e._zod.bag.maximum = t.maximum);
		}), e._zod.check = (n) => {
			const r = n.value;
			if (r.length <= t.maximum) return;
			const a = j(r);
			n.issues.push({
				origin: a,
				code: "too_big",
				maximum: t.maximum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	}), Me = c("$ZodCheckMinLength", (e, t) => {
		var n;
		xe.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
			const t = e.value;
			return !b(t) && void 0 !== t.length;
		}), e._zod.onattach.push((e) => {
			const n = e._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
			t.minimum > n && (e._zod.bag.minimum = t.minimum);
		}), e._zod.check = (n) => {
			const r = n.value;
			if (r.length >= t.minimum) return;
			const a = j(r);
			n.issues.push({
				origin: a,
				code: "too_small",
				minimum: t.minimum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	}), Ne = c("$ZodCheckLengthEquals", (e, t) => {
		var n;
		xe.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
			const t = e.value;
			return !b(t) && void 0 !== t.length;
		}), e._zod.onattach.push((e) => {
			const n = e._zod.bag;
			n.minimum = t.length, n.maximum = t.length, n.length = t.length;
		}), e._zod.check = (n) => {
			const r = n.value, a = r.length;
			if (a === t.length) return;
			const o = j(r), i = a > t.length;
			n.issues.push({
				origin: o,
				...i ? {
					code: "too_big",
					maximum: t.length
				} : {
					code: "too_small",
					minimum: t.length
				},
				inclusive: !0,
				exact: !0,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), De = c("$ZodCheckStringFormat", (e, t) => {
		var n, r;
		xe.init(e, t), e._zod.onattach.push((e) => {
			const n = e._zod.bag;
			n.format = t.format, t.pattern && (n.patterns ?? (n.patterns = /* @__PURE__ */ new Set()), n.patterns.add(t.pattern));
		}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
			t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
				origin: "string",
				code: "invalid_format",
				format: t.format,
				input: n.value,
				...t.pattern ? { pattern: t.pattern.toString() } : {},
				inst: e,
				continue: !t.abort
			});
		}) : (r = e._zod).check ?? (r.check = () => {});
	}), Ce = c("$ZodCheckRegex", (e, t) => {
		De.init(e, t), e._zod.check = (n) => {
			t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "regex",
				input: n.value,
				pattern: t.pattern.toString(),
				inst: e,
				continue: !t.abort
			});
		};
	}), je = c("$ZodCheckLowerCase", (e, t) => {
		t.pattern ?? (t.pattern = Le), De.init(e, t);
	}), $e = c("$ZodCheckUpperCase", (e, t) => {
		t.pattern ?? (t.pattern = Oe), De.init(e, t);
	}), Ue = c("$ZodCheckIncludes", (e, t) => {
		xe.init(e, t);
		const n = R(t.includes), r = new RegExp("number" == typeof t.position ? `^.{${t.position}}${n}` : n);
		t.pattern = r, e._zod.onattach.push((e) => {
			const t = e._zod.bag;
			t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(r);
		}), e._zod.check = (n) => {
			n.value.includes(t.includes, t.position) || n.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "includes",
				includes: t.includes,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), Ze = c("$ZodCheckStartsWith", (e, t) => {
		xe.init(e, t);
		const n = new RegExp(`^${R(t.prefix)}.*`);
		t.pattern ?? (t.pattern = n), e._zod.onattach.push((e) => {
			const t = e._zod.bag;
			t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(n);
		}), e._zod.check = (n) => {
			n.value.startsWith(t.prefix) || n.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "starts_with",
				prefix: t.prefix,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), Be = c("$ZodCheckEndsWith", (e, t) => {
		xe.init(e, t);
		const n = new RegExp(`.*${R(t.suffix)}$`);
		t.pattern ?? (t.pattern = n), e._zod.onattach.push((e) => {
			const t = e._zod.bag;
			t.patterns ?? (t.patterns = /* @__PURE__ */ new Set()), t.patterns.add(n);
		}), e._zod.check = (n) => {
			n.value.endsWith(t.suffix) || n.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "ends_with",
				suffix: t.suffix,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), Ve = c("$ZodCheckOverwrite", (e, t) => {
		xe.init(e, t), e._zod.check = (e) => {
			e.value = t.tx(e.value);
		};
	});
	var He = class {
		constructor(e = []) {
			this.content = [], this.indent = 0, this && (this.args = e);
		}
		indented(e) {
			this.indent += 1, e(this), this.indent -= 1;
		}
		write(e) {
			if ("function" == typeof e) return e(this, { execution: "sync" }), void e(this, { execution: "async" });
			const t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(2 * this.indent) + e);
			for (const a of r) this.content.push(a);
		}
		compile() {
			const e = Function, t = this?.args;
			return new e(...t, [...(this?.content ?? [""]).map((e) => `  ${e}`)].join("\n"));
		}
	};
	const We = {
		major: 4,
		minor: 3,
		patch: 6
	}, Ye = c("$ZodType", (e, t) => {
		var n;
		e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = We;
		const r = [...e._zod.def.checks ?? []];
		e._zod.traits.has("$ZodCheck") && r.unshift(e);
		for (const a of r) for (const t of a._zod.onattach) t(e);
		if (0 === r.length) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
			e._zod.run = e._zod.parse;
		});
		else {
			const t = (e, t, n) => {
				let r, a = M(e);
				for (const o of t) {
					if (o._zod.def.when) {
						if (!o._zod.def.when(e)) continue;
					} else if (a) continue;
					const t = e.issues.length, i = o._zod.check(e);
					if (i instanceof Promise && !1 === n?.async) throw new d();
					if (r || i instanceof Promise) r = (r ?? Promise.resolve()).then(async () => {
						await i, e.issues.length !== t && (a || (a = M(e, t)));
					});
					else {
						if (e.issues.length === t) continue;
						a || (a = M(e, t));
					}
				}
				return r ? r.then(() => e) : e;
			}, n = (n, a, o) => {
				if (M(n)) return n.aborted = !0, n;
				const i = t(a, r, o);
				if (i instanceof Promise) {
					if (!1 === o.async) throw new d();
					return i.then((t) => e._zod.parse(t, o));
				}
				return e._zod.parse(i, o);
			};
			e._zod.run = (a, o) => {
				if (o.skipChecks) return e._zod.parse(a, o);
				if ("backward" === o.direction) {
					const t = e._zod.parse({
						value: a.value,
						issues: []
					}, {
						...o,
						skipChecks: !0
					});
					return t instanceof Promise ? t.then((e) => n(e, a, o)) : n(t, a, o);
				}
				const i = e._zod.parse(a, o);
				if (i instanceof Promise) {
					if (!1 === o.async) throw new d();
					return i.then((e) => t(e, r, o));
				}
				return t(i, r, o);
			};
		}
		v(e, "~standard", () => ({
			validate: (t) => {
				try {
					const n = Y(e, t);
					return n.success ? { value: n.data } : { issues: n.error?.issues };
				} catch (n) {
					return q(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
				}
			},
			vendor: "zod",
			version: 1
		}));
	}), Je = c("$ZodString", (e, t) => {
		var n;
		Ye.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? (n = e._zod.bag, new RegExp(`^${n ? `[\\s\\S]{${n?.minimum ?? 0},${n?.maximum ?? ""}}` : "[\\s\\S]*"}$`)), e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = String(n.value);
			} catch (r) {}
			return "string" == typeof n.value || n.issues.push({
				expected: "string",
				code: "invalid_type",
				input: n.value,
				inst: e
			}), n;
		};
	}), qe = c("$ZodStringFormat", (e, t) => {
		De.init(e, t), Je.init(e, t);
	}), Ge = c("$ZodGUID", (e, t) => {
		t.pattern ?? (t.pattern = de), qe.init(e, t);
	}), Xe = c("$ZodUUID", (e, t) => {
		if (t.version) {
			const e = {
				v1: 1,
				v2: 2,
				v3: 3,
				v4: 4,
				v5: 5,
				v6: 6,
				v7: 7,
				v8: 8
			}[t.version];
			if (void 0 === e) throw new Error(`Invalid UUID version: "${t.version}"`);
			t.pattern ?? (t.pattern = pe(e));
		} else t.pattern ?? (t.pattern = pe());
		qe.init(e, t);
	}), Ke = c("$ZodEmail", (e, t) => {
		t.pattern ?? (t.pattern = he), qe.init(e, t);
	}), Qe = c("$ZodURL", (e, t) => {
		qe.init(e, t), e._zod.check = (n) => {
			try {
				const r = n.value.trim(), a = new URL(r);
				t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(a.hostname) || n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: t.hostname.source,
					input: n.value,
					inst: e,
					continue: !t.abort
				})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(a.protocol.endsWith(":") ? a.protocol.slice(0, -1) : a.protocol) || n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: t.protocol.source,
					input: n.value,
					inst: e,
					continue: !t.abort
				})), t.normalize ? n.value = a.href : n.value = r;
				return;
			} catch (r) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
			}
		};
	}), et = c("$ZodEmoji", (e, t) => {
		t.pattern ?? (t.pattern = /* @__PURE__ */ new RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")), qe.init(e, t);
	}), tt = c("$ZodNanoID", (e, t) => {
		t.pattern ?? (t.pattern = le), qe.init(e, t);
	}), nt = c("$ZodCUID", (e, t) => {
		t.pattern ?? (t.pattern = ae), qe.init(e, t);
	}), rt = c("$ZodCUID2", (e, t) => {
		t.pattern ?? (t.pattern = oe), qe.init(e, t);
	}), at = c("$ZodULID", (e, t) => {
		t.pattern ?? (t.pattern = ie), qe.init(e, t);
	}), ot = c("$ZodXID", (e, t) => {
		t.pattern ?? (t.pattern = se), qe.init(e, t);
	}), it = c("$ZodKSUID", (e, t) => {
		t.pattern ?? (t.pattern = ue), qe.init(e, t);
	}), st = c("$ZodISODateTime", (e, t) => {
		t.pattern ?? (t.pattern = function(e) {
			const t = Ee({ precision: e.precision }), n = ["Z"];
			e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
			const r = `${t}(?:${n.join("|")})`;
			return new RegExp(`^${ve}T(?:${r})$`);
		}(t)), qe.init(e, t);
	}), ut = c("$ZodISODate", (e, t) => {
		t.pattern ?? (t.pattern = ke), qe.init(e, t);
	}), lt = c("$ZodISOTime", (e, t) => {
		t.pattern ?? (t.pattern = new RegExp(`^${Ee(t)}$`)), qe.init(e, t);
	}), ct = c("$ZodISODuration", (e, t) => {
		t.pattern ?? (t.pattern = ce), qe.init(e, t);
	}), dt = c("$ZodIPv4", (e, t) => {
		t.pattern ?? (t.pattern = fe), qe.init(e, t), e._zod.bag.format = "ipv4";
	}), pt = c("$ZodIPv6", (e, t) => {
		t.pattern ?? (t.pattern = me), qe.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
			try {
				new URL(`http://[${n.value}]`);
			} catch {
				n.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
			}
		};
	}), ht = c("$ZodCIDRv4", (e, t) => {
		t.pattern ?? (t.pattern = _e), qe.init(e, t);
	}), ft = c("$ZodCIDRv6", (e, t) => {
		t.pattern ?? (t.pattern = ge), qe.init(e, t), e._zod.check = (n) => {
			const r = n.value.split("/");
			try {
				if (2 !== r.length) throw new Error();
				const [e, t] = r;
				if (!t) throw new Error();
				const n = Number(t);
				if (`${n}` !== t) throw new Error();
				if (n < 0 || n > 128) throw new Error();
				new URL(`http://[${e}]`);
			} catch {
				n.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
			}
		};
	});
	function mt(e) {
		if ("" === e) return !0;
		if (e.length % 4 != 0) return !1;
		try {
			return atob(e), !0;
		} catch {
			return !1;
		}
	}
	const _t = c("$ZodBase64", (e, t) => {
		t.pattern ?? (t.pattern = be), qe.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
			mt(n.value) || n.issues.push({
				code: "invalid_format",
				format: "base64",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	const gt = c("$ZodBase64URL", (e, t) => {
		t.pattern ?? (t.pattern = ye), qe.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
			(function(e) {
				if (!ye.test(e)) return !1;
				const t = e.replace(/[-_]/g, (e) => "-" === e ? "+" : "/");
				return mt(t.padEnd(4 * Math.ceil(t.length / 4), "="));
			})(n.value) || n.issues.push({
				code: "invalid_format",
				format: "base64url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), bt = c("$ZodE164", (e, t) => {
		t.pattern ?? (t.pattern = we), qe.init(e, t);
	});
	const yt = c("$ZodJWT", (e, t) => {
		qe.init(e, t), e._zod.check = (n) => {
			(function(e, t = null) {
				try {
					const n = e.split(".");
					if (3 !== n.length) return !1;
					const [r] = n;
					if (!r) return !1;
					const a = JSON.parse(atob(r));
					return !("typ" in a && "JWT" !== a?.typ || !a.alg || t && (!("alg" in a) || a.alg !== t));
				} catch {
					return !1;
				}
			})(n.value, t.alg) || n.issues.push({
				code: "invalid_format",
				format: "jwt",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	}), wt = c("$ZodNumber", (e, t) => {
		Ye.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Se, e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = Number(n.value);
			} catch (i) {}
			const a = n.value;
			if ("number" == typeof a && !Number.isNaN(a) && Number.isFinite(a)) return n;
			const o = "number" == typeof a ? Number.isNaN(a) ? "NaN" : Number.isFinite(a) ? void 0 : "Infinity" : void 0;
			return n.issues.push({
				expected: "number",
				code: "invalid_type",
				input: a,
				inst: e,
				...o ? { received: o } : {}
			}), n;
		};
	}), vt = c("$ZodNumberFormat", (e, t) => {
		Fe.init(e, t), wt.init(e, t);
	}), kt = c("$ZodUnknown", (e, t) => {
		Ye.init(e, t), e._zod.parse = (e) => e;
	}), Et = c("$ZodNever", (e, t) => {
		Ye.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
			expected: "never",
			code: "invalid_type",
			input: t.value,
			inst: e
		}), t);
	});
	function Tt(e, t, n) {
		e.issues.length && t.issues.push(...N(n, e.issues)), t.value[n] = e.value;
	}
	const St = c("$ZodArray", (e, t) => {
		Ye.init(e, t), e._zod.parse = (n, r) => {
			const a = n.value;
			if (!Array.isArray(a)) return n.issues.push({
				expected: "array",
				code: "invalid_type",
				input: a,
				inst: e
			}), n;
			n.value = Array(a.length);
			const o = [];
			for (let e = 0; e < a.length; e++) {
				const i = a[e], s = t.element._zod.run({
					value: i,
					issues: []
				}, r);
				s instanceof Promise ? o.push(s.then((t) => Tt(t, n, e))) : Tt(s, n, e);
			}
			return o.length ? Promise.all(o).then(() => n) : n;
		};
	});
	function Lt(e, t, n, r, a) {
		if (e.issues.length) {
			if (a && !(n in r)) return;
			t.issues.push(...N(n, e.issues));
		}
		void 0 === e.value ? n in r && (t.value[n] = void 0) : t.value[n] = e.value;
	}
	function Ot(e) {
		const t = Object.keys(e.shape);
		for (const a of t) if (!e.shape?.[a]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${a}": expected a Zod schema`);
		const n = (r = e.shape, Object.keys(r).filter((e) => "optional" === r[e]._zod.optin && "optional" === r[e]._zod.optout));
		var r;
		return {
			...e,
			keys: t,
			keySet: new Set(t),
			numKeys: t.length,
			optionalKeys: new Set(n)
		};
	}
	function xt(e, t, n, r, a, o) {
		const i = [], s = a.keySet, u = a.catchall._zod, l = u.def.type, c = "optional" === u.optout;
		for (const d in t) {
			if (s.has(d)) continue;
			if ("never" === l) {
				i.push(d);
				continue;
			}
			const a = u.run({
				value: t[d],
				issues: []
			}, r);
			a instanceof Promise ? e.push(a.then((e) => Lt(e, n, d, t, c))) : Lt(a, n, d, t, c);
		}
		return i.length && n.issues.push({
			code: "unrecognized_keys",
			keys: i,
			input: t,
			inst: o
		}), e.length ? Promise.all(e).then(() => n) : n;
	}
	const zt = c("$ZodObject", (e, t) => {
		if (Ye.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
			const e = t.shape;
			Object.defineProperty(t, "shape", { get: () => {
				const n = { ...e };
				return Object.defineProperty(t, "shape", { value: n }), n;
			} });
		}
		const n = g(() => Ot(t));
		v(e._zod, "propValues", () => {
			const e = t.shape, n = {};
			for (const t in e) {
				const r = e[t]._zod;
				if (r.values) {
					n[t] ?? (n[t] = /* @__PURE__ */ new Set());
					for (const e of r.values) n[t].add(e);
				}
			}
			return n;
		});
		const r = L, a = t.catchall;
		let o;
		e._zod.parse = (t, i) => {
			o ?? (o = n.value);
			const s = t.value;
			if (!r(s)) return t.issues.push({
				expected: "object",
				code: "invalid_type",
				input: s,
				inst: e
			}), t;
			t.value = {};
			const u = [], l = o.shape;
			for (const e of o.keys) {
				const n = l[e], r = "optional" === n._zod.optout, a = n._zod.run({
					value: s[e],
					issues: []
				}, i);
				a instanceof Promise ? u.push(a.then((n) => Lt(n, t, e, s, r))) : Lt(a, t, e, s, r);
			}
			return a ? xt(u, s, t, i, n.value, e) : u.length ? Promise.all(u).then(() => t) : t;
		};
	}), Pt = c("$ZodObjectJIT", (e, t) => {
		zt.init(e, t);
		const n = e._zod.parse, r = g(() => Ot(t));
		let a;
		const o = L, i = !h.jitless, s = i && O.value, u = t.catchall;
		let l;
		e._zod.parse = (c, d) => {
			l ?? (l = r.value);
			const p = c.value;
			return o(p) ? i && s && !1 === d?.async && !0 !== d.jitless ? (a || (a = ((e) => {
				const t = new He([
					"shape",
					"payload",
					"ctx"
				]), n = r.value, a = (e) => {
					const t = T(e);
					return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
				};
				t.write("const input = payload.value;");
				const o = Object.create(null);
				let i = 0;
				for (const r of n.keys) o[r] = "key_" + i++;
				t.write("const newResult = {};");
				for (const r of n.keys) {
					const n = o[r], i = T(r), s = "optional" === e[r]?._zod?.optout;
					t.write(`const ${n} = ${a(r)};`), s ? t.write(`\n        if (${n}.issues.length) {\n          if (${i} in input) {\n            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({\n              ...iss,\n              path: iss.path ? [${i}, ...iss.path] : [${i}]\n            })));\n          }\n        }\n        \n        if (${n}.value === undefined) {\n          if (${i} in input) {\n            newResult[${i}] = undefined;\n          }\n        } else {\n          newResult[${i}] = ${n}.value;\n        }\n        \n      `) : t.write(`\n        if (${n}.issues.length) {\n          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({\n            ...iss,\n            path: iss.path ? [${i}, ...iss.path] : [${i}]\n          })));\n        }\n        \n        if (${n}.value === undefined) {\n          if (${i} in input) {\n            newResult[${i}] = undefined;\n          }\n        } else {\n          newResult[${i}] = ${n}.value;\n        }\n        \n      `);
				}
				t.write("payload.value = newResult;"), t.write("return payload;");
				const s = t.compile();
				return (t, n) => s(e, t, n);
			})(t.shape)), c = a(c, d), u ? xt([], p, c, d, l, e) : c) : n(c, d) : (c.issues.push({
				expected: "object",
				code: "invalid_type",
				input: p,
				inst: e
			}), c);
		};
	});
	function Rt(e, t, n, r) {
		for (const o of e) if (0 === o.issues.length) return t.value = o.value, t;
		const a = e.filter((e) => !M(e));
		return 1 === a.length ? (t.value = a[0].value, a[0]) : (t.issues.push({
			code: "invalid_union",
			input: t.value,
			inst: n,
			errors: e.map((e) => e.issues.map((e) => C(e, r, f())))
		}), t);
	}
	const It = c("$ZodUnion", (e, t) => {
		Ye.init(e, t), v(e._zod, "optin", () => t.options.some((e) => "optional" === e._zod.optin) ? "optional" : void 0), v(e._zod, "optout", () => t.options.some((e) => "optional" === e._zod.optout) ? "optional" : void 0), v(e._zod, "values", () => {
			if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
		}), v(e._zod, "pattern", () => {
			if (t.options.every((e) => e._zod.pattern)) {
				const e = t.options.map((e) => e._zod.pattern);
				return new RegExp(`^(${e.map((e) => y(e.source)).join("|")})$`);
			}
		});
		const n = 1 === t.options.length, r = t.options[0]._zod.run;
		e._zod.parse = (a, o) => {
			if (n) return r(a, o);
			let i = !1;
			const s = [];
			for (const e of t.options) {
				const t = e._zod.run({
					value: a.value,
					issues: []
				}, o);
				if (t instanceof Promise) s.push(t), i = !0;
				else {
					if (0 === t.issues.length) return t;
					s.push(t);
				}
			}
			return i ? Promise.all(s).then((t) => Rt(t, a, e, o)) : Rt(s, a, e, o);
		};
	});
	function Ft(e, t, n, r) {
		const a = e.filter((e) => 0 === e.issues.length);
		return 1 === a.length ? (t.value = a[0].value, t) : (0 === a.length ? t.issues.push({
			code: "invalid_union",
			input: t.value,
			inst: n,
			errors: e.map((e) => e.issues.map((e) => C(e, r, f())))
		}) : t.issues.push({
			code: "invalid_union",
			input: t.value,
			inst: n,
			errors: [],
			inclusive: !1
		}), t);
	}
	const At = c("$ZodXor", (e, t) => {
		It.init(e, t), t.inclusive = !1;
		const n = 1 === t.options.length, r = t.options[0]._zod.run;
		e._zod.parse = (a, o) => {
			if (n) return r(a, o);
			let i = !1;
			const s = [];
			for (const e of t.options) {
				const t = e._zod.run({
					value: a.value,
					issues: []
				}, o);
				t instanceof Promise ? (s.push(t), i = !0) : s.push(t);
			}
			return i ? Promise.all(s).then((t) => Ft(t, a, e, o)) : Ft(s, a, e, o);
		};
	}), Mt = c("$ZodDiscriminatedUnion", (e, t) => {
		t.inclusive = !1, It.init(e, t);
		const n = e._zod.parse;
		v(e._zod, "propValues", () => {
			const e = {};
			for (const n of t.options) {
				const r = n._zod.propValues;
				if (!r || 0 === Object.keys(r).length) throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(n)}"`);
				for (const [t, n] of Object.entries(r)) {
					e[t] || (e[t] = /* @__PURE__ */ new Set());
					for (const r of n) e[t].add(r);
				}
			}
			return e;
		});
		const r = g(() => {
			const e = t.options, n = /* @__PURE__ */ new Map();
			for (const r of e) {
				const e = r._zod.propValues?.[t.discriminator];
				if (!e || 0 === e.size) throw new Error(`Invalid discriminated union option at index "${t.options.indexOf(r)}"`);
				for (const t of e) {
					if (n.has(t)) throw new Error(`Duplicate discriminator value "${String(t)}"`);
					n.set(t, r);
				}
			}
			return n;
		});
		e._zod.parse = (a, o) => {
			const i = a.value;
			if (!L(i)) return a.issues.push({
				code: "invalid_type",
				expected: "object",
				input: i,
				inst: e
			}), a;
			const s = r.value.get(i?.[t.discriminator]);
			return s ? s._zod.run(a, o) : t.unionFallback ? n(a, o) : (a.issues.push({
				code: "invalid_union",
				errors: [],
				note: "No matching discriminator",
				discriminator: t.discriminator,
				input: i,
				path: [t.discriminator],
				inst: e
			}), a);
		};
	}), Nt = c("$ZodIntersection", (e, t) => {
		Ye.init(e, t), e._zod.parse = (e, n) => {
			const r = e.value, a = t.left._zod.run({
				value: r,
				issues: []
			}, n), o = t.right._zod.run({
				value: r,
				issues: []
			}, n);
			return a instanceof Promise || o instanceof Promise ? Promise.all([a, o]).then(([t, n]) => Ct(e, t, n)) : Ct(e, a, o);
		};
	});
	function Dt(e, t) {
		if (e === t) return {
			valid: !0,
			data: e
		};
		if (e instanceof Date && t instanceof Date && +e === +t) return {
			valid: !0,
			data: e
		};
		if (x(e) && x(t)) {
			const n = Object.keys(t), r = Object.keys(e).filter((e) => -1 !== n.indexOf(e)), a = {
				...e,
				...t
			};
			for (const o of r) {
				const n = Dt(e[o], t[o]);
				if (!n.valid) return {
					valid: !1,
					mergeErrorPath: [o, ...n.mergeErrorPath]
				};
				a[o] = n.data;
			}
			return {
				valid: !0,
				data: a
			};
		}
		if (Array.isArray(e) && Array.isArray(t)) {
			if (e.length !== t.length) return {
				valid: !1,
				mergeErrorPath: []
			};
			const n = [];
			for (let r = 0; r < e.length; r++) {
				const a = Dt(e[r], t[r]);
				if (!a.valid) return {
					valid: !1,
					mergeErrorPath: [r, ...a.mergeErrorPath]
				};
				n.push(a.data);
			}
			return {
				valid: !0,
				data: n
			};
		}
		return {
			valid: !1,
			mergeErrorPath: []
		};
	}
	function Ct(e, t, n) {
		const r = /* @__PURE__ */ new Map();
		let a;
		for (const s of t.issues) if ("unrecognized_keys" === s.code) {
			a ?? (a = s);
			for (const e of s.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
		} else e.issues.push(s);
		for (const s of n.issues) if ("unrecognized_keys" === s.code) for (const e of s.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
		else e.issues.push(s);
		const o = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
		if (o.length && a && e.issues.push({
			...a,
			keys: o
		}), M(e)) return e;
		const i = Dt(t.value, n.value);
		if (!i.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(i.mergeErrorPath)}`);
		return e.value = i.data, e;
	}
	const jt = c("$ZodTuple", (e, t) => {
		Ye.init(e, t);
		const n = t.items;
		e._zod.parse = (r, a) => {
			const o = r.value;
			if (!Array.isArray(o)) return r.issues.push({
				input: o,
				inst: e,
				expected: "tuple",
				code: "invalid_type"
			}), r;
			r.value = [];
			const i = [], s = [...n].reverse().findIndex((e) => "optional" !== e._zod.optin), u = -1 === s ? 0 : n.length - s;
			if (!t.rest) {
				const t = o.length > n.length, a = o.length < u - 1;
				if (t || a) return r.issues.push({
					...t ? {
						code: "too_big",
						maximum: n.length,
						inclusive: !0
					} : {
						code: "too_small",
						minimum: n.length
					},
					input: o,
					inst: e,
					origin: "array"
				}), r;
			}
			let l = -1;
			for (const e of n) {
				if (l++, l >= o.length && l >= u) continue;
				const t = e._zod.run({
					value: o[l],
					issues: []
				}, a);
				t instanceof Promise ? i.push(t.then((e) => $t(e, r, l))) : $t(t, r, l);
			}
			if (t.rest) {
				const e = o.slice(n.length);
				for (const n of e) {
					l++;
					const e = t.rest._zod.run({
						value: n,
						issues: []
					}, a);
					e instanceof Promise ? i.push(e.then((e) => $t(e, r, l))) : $t(e, r, l);
				}
			}
			return i.length ? Promise.all(i).then(() => r) : r;
		};
	});
	function $t(e, t, n) {
		e.issues.length && t.issues.push(...N(n, e.issues)), t.value[n] = e.value;
	}
	const Ut = c("$ZodEnum", (e, t) => {
		Ye.init(e, t);
		const n = m(t.entries), r = new Set(n);
		e._zod.values = r, e._zod.pattern = new RegExp(`^(${n.filter((e) => P.has(typeof e)).map((e) => "string" == typeof e ? R(e) : e.toString()).join("|")})$`), e._zod.parse = (t, a) => {
			const o = t.value;
			return r.has(o) || t.issues.push({
				code: "invalid_value",
				values: n,
				input: o,
				inst: e
			}), t;
		};
	}), Zt = c("$ZodLiteral", (e, t) => {
		if (Ye.init(e, t), 0 === t.values.length) throw new Error("Cannot create literal schema with no valid values");
		const n = new Set(t.values);
		e._zod.values = n, e._zod.pattern = new RegExp(`^(${t.values.map((e) => "string" == typeof e ? R(e) : e ? R(e.toString()) : String(e)).join("|")})$`), e._zod.parse = (r, a) => {
			const o = r.value;
			return n.has(o) || r.issues.push({
				code: "invalid_value",
				values: t.values,
				input: o,
				inst: e
			}), r;
		};
	}), Bt = c("$ZodTransform", (e, t) => {
		Ye.init(e, t), e._zod.parse = (n, r) => {
			if ("backward" === r.direction) throw new p(e.constructor.name);
			const a = t.transform(n.value, n);
			if (r.async) return (a instanceof Promise ? a : Promise.resolve(a)).then((e) => (n.value = e, n));
			if (a instanceof Promise) throw new d();
			return n.value = a, n;
		};
	});
	function Vt(e, t) {
		return e.issues.length && void 0 === t ? {
			issues: [],
			value: void 0
		} : e;
	}
	const Ht = c("$ZodOptional", (e, t) => {
		Ye.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", v(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0), v(e._zod, "pattern", () => {
			const e = t.innerType._zod.pattern;
			return e ? new RegExp(`^(${y(e.source)})?$`) : void 0;
		}), e._zod.parse = (e, n) => {
			if ("optional" === t.innerType._zod.optin) {
				const r = t.innerType._zod.run(e, n);
				return r instanceof Promise ? r.then((t) => Vt(t, e.value)) : Vt(r, e.value);
			}
			return void 0 === e.value ? e : t.innerType._zod.run(e, n);
		};
	}), Wt = c("$ZodExactOptional", (e, t) => {
		Ht.init(e, t), v(e._zod, "values", () => t.innerType._zod.values), v(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
	}), Yt = c("$ZodNullable", (e, t) => {
		Ye.init(e, t), v(e._zod, "optin", () => t.innerType._zod.optin), v(e._zod, "optout", () => t.innerType._zod.optout), v(e._zod, "pattern", () => {
			const e = t.innerType._zod.pattern;
			return e ? new RegExp(`^(${y(e.source)}|null)$`) : void 0;
		}), v(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => null === e.value ? e : t.innerType._zod.run(e, n);
	}), Jt = c("$ZodDefault", (e, t) => {
		Ye.init(e, t), e._zod.optin = "optional", v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
			if ("backward" === n.direction) return t.innerType._zod.run(e, n);
			if (void 0 === e.value) return e.value = t.defaultValue, e;
			const r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => qt(e, t)) : qt(r, t);
		};
	});
	function qt(e, t) {
		return void 0 === e.value && (e.value = t.defaultValue), e;
	}
	const Gt = c("$ZodPrefault", (e, t) => {
		Ye.init(e, t), e._zod.optin = "optional", v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => ("backward" === n.direction || void 0 === e.value && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
	}), Xt = c("$ZodNonOptional", (e, t) => {
		Ye.init(e, t), v(e._zod, "values", () => {
			const e = t.innerType._zod.values;
			return e ? new Set([...e].filter((e) => void 0 !== e)) : void 0;
		}), e._zod.parse = (n, r) => {
			const a = t.innerType._zod.run(n, r);
			return a instanceof Promise ? a.then((t) => Kt(t, e)) : Kt(a, e);
		};
	});
	function Kt(e, t) {
		return e.issues.length || void 0 !== e.value || e.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: e.value,
			inst: t
		}), e;
	}
	const Qt = c("$ZodCatch", (e, t) => {
		Ye.init(e, t), v(e._zod, "optin", () => t.innerType._zod.optin), v(e._zod, "optout", () => t.innerType._zod.optout), v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
			if ("backward" === n.direction) return t.innerType._zod.run(e, n);
			const r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
				...e,
				error: { issues: r.issues.map((e) => C(e, n, f())) },
				input: e.value
			}), e.issues = []), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
				...e,
				error: { issues: r.issues.map((e) => C(e, n, f())) },
				input: e.value
			}), e.issues = []), e);
		};
	}), en = c("$ZodPipe", (e, t) => {
		Ye.init(e, t), v(e._zod, "values", () => t.in._zod.values), v(e._zod, "optin", () => t.in._zod.optin), v(e._zod, "optout", () => t.out._zod.optout), v(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
			if ("backward" === n.direction) {
				const r = t.out._zod.run(e, n);
				return r instanceof Promise ? r.then((e) => tn(e, t.in, n)) : tn(r, t.in, n);
			}
			const r = t.in._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => tn(e, t.out, n)) : tn(r, t.out, n);
		};
	});
	function tn(e, t, n) {
		return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
			value: e.value,
			issues: e.issues
		}, n);
	}
	const nn = c("$ZodReadonly", (e, t) => {
		Ye.init(e, t), v(e._zod, "propValues", () => t.innerType._zod.propValues), v(e._zod, "values", () => t.innerType._zod.values), v(e._zod, "optin", () => t.innerType?._zod?.optin), v(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
			if ("backward" === n.direction) return t.innerType._zod.run(e, n);
			const r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then(rn) : rn(r);
		};
	});
	function rn(e) {
		return e.value = Object.freeze(e.value), e;
	}
	const an = c("$ZodCustom", (e, t) => {
		xe.init(e, t), Ye.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
			const r = n.value, a = t.fn(r);
			if (a instanceof Promise) return a.then((t) => on(t, n, r, e));
			on(a, n, r, e);
		};
	});
	function on(e, t, n, r) {
		if (!e) {
			const e = {
				code: "custom",
				input: n,
				inst: r,
				path: [...r._zod.def.path ?? []],
				continue: !r._zod.def.abort
			};
			r._zod.def.params && (e.params = r._zod.def.params), t.issues.push($(e));
		}
	}
	var sn, un = class {
		constructor() {
			this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
		}
		add(e, ...t) {
			const n = t[0];
			return this._map.set(e, n), n && "object" == typeof n && "id" in n && this._idmap.set(n.id, e), this;
		}
		clear() {
			return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
		}
		remove(e) {
			const t = this._map.get(e);
			return t && "object" == typeof t && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
		}
		get(e) {
			const t = e._zod.parent;
			if (t) {
				const n = { ...this.get(t) ?? {} };
				delete n.id;
				const r = {
					...n,
					...this._map.get(e)
				};
				return Object.keys(r).length ? r : void 0;
			}
			return this._map.get(e);
		}
		has(e) {
			return this._map.has(e);
		}
	};
	(sn = globalThis).__zod_globalRegistry ?? (sn.__zod_globalRegistry = new un());
	const ln = globalThis.__zod_globalRegistry;
	function cn(e, t) {
		return new e({
			type: "string",
			format: "guid",
			check: "string_format",
			abort: !1,
			...F(t)
		});
	}
	function dn(e, t) {
		return new Pe({
			check: "less_than",
			...F(t),
			value: e,
			inclusive: !1
		});
	}
	function pn(e, t) {
		return new Pe({
			check: "less_than",
			...F(t),
			value: e,
			inclusive: !0
		});
	}
	function hn(e, t) {
		return new Re({
			check: "greater_than",
			...F(t),
			value: e,
			inclusive: !1
		});
	}
	function fn(e, t) {
		return new Re({
			check: "greater_than",
			...F(t),
			value: e,
			inclusive: !0
		});
	}
	function mn(e, t) {
		return new Ie({
			check: "multiple_of",
			...F(t),
			value: e
		});
	}
	function _n(e, t) {
		return new Ae({
			check: "max_length",
			...F(t),
			maximum: e
		});
	}
	function gn(e, t) {
		return new Me({
			check: "min_length",
			...F(t),
			minimum: e
		});
	}
	function bn(e, t) {
		return new Ne({
			check: "length_equals",
			...F(t),
			length: e
		});
	}
	function yn(e) {
		return new Ve({
			check: "overwrite",
			tx: e
		});
	}
	function wn(e, t) {
		const n = new xe({
			check: "custom",
			...F(t)
		});
		return n._zod.check = e, n;
	}
	function vn(e) {
		let t = e?.target ?? "draft-2020-12";
		return "draft-4" === t && (t = "draft-04"), "draft-7" === t && (t = "draft-07"), {
			processors: e.processors ?? {},
			metadataRegistry: e?.metadata ?? ln,
			target: t,
			unrepresentable: e?.unrepresentable ?? "throw",
			override: e?.override ?? (() => {}),
			io: e?.io ?? "output",
			counter: 0,
			seen: /* @__PURE__ */ new Map(),
			cycles: e?.cycles ?? "ref",
			reused: e?.reused ?? "inline",
			external: e?.external ?? void 0
		};
	}
	function kn(e, t, n = {
		path: [],
		schemaPath: []
	}) {
		var r;
		const a = e._zod.def, o = t.seen.get(e);
		if (o) return o.count++, n.schemaPath.includes(e) && (o.cycle = n.path), o.schema;
		const i = {
			schema: {},
			count: 1,
			cycle: void 0,
			path: n.path
		};
		t.seen.set(e, i);
		const s = e._zod.toJSONSchema?.();
		if (s) i.schema = s;
		else {
			const r = {
				...n,
				schemaPath: [...n.schemaPath, e],
				path: n.path
			};
			if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, i.schema, r);
			else {
				const n = i.schema, o = t.processors[a.type];
				if (!o) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${a.type}`);
				o(e, t, n, r);
			}
			const o = e._zod.parent;
			o && (i.ref || (i.ref = o), kn(o, t, r), t.seen.get(o).isParent = !0);
		}
		const u = t.metadataRegistry.get(e);
		return u && Object.assign(i.schema, u), "input" === t.io && Sn(e) && (delete i.schema.examples, delete i.schema.default), "input" === t.io && i.schema._prefault && ((r = i.schema).default ?? (r.default = i.schema._prefault)), delete i.schema._prefault, t.seen.get(e).schema;
	}
	function En(e, t) {
		const n = e.seen.get(t);
		if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
		const r = /* @__PURE__ */ new Map();
		for (const o of e.seen.entries()) {
			const t = e.metadataRegistry.get(o[0])?.id;
			if (t) {
				const e = r.get(t);
				if (e && e !== o[0]) throw new Error(`Duplicate schema id "${t}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
				r.set(t, o[0]);
			}
		}
		const a = (t) => {
			if (t[1].schema.$ref) return;
			const r = t[1], { ref: a, defId: o } = ((t) => {
				const r = "draft-2020-12" === e.target ? "$defs" : "definitions";
				if (e.external) {
					const n = e.external.registry.get(t[0])?.id, a = e.external.uri ?? ((e) => e);
					if (n) return { ref: a(n) };
					const o = t[1].defId ?? t[1].schema.id ?? "schema" + e.counter++;
					return t[1].defId = o, {
						defId: o,
						ref: `${a("__shared")}#/${r}/${o}`
					};
				}
				if (t[1] === n) return { ref: "#" };
				const a = `#/${r}/`, o = t[1].schema.id ?? "__schema" + e.counter++;
				return {
					defId: o,
					ref: a + o
				};
			})(t);
			r.def = { ...r.schema }, o && (r.defId = o);
			const i = r.schema;
			for (const e in i) delete i[e];
			i.$ref = a;
		};
		if ("throw" === e.cycles) for (const o of e.seen.entries()) {
			const e = o[1];
			if (e.cycle) throw new Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>\n\nSet the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
		}
		for (const o of e.seen.entries()) {
			const n = o[1];
			if (t !== o[0]) {
				if (e.external) {
					const n = e.external.registry.get(o[0])?.id;
					if (t !== o[0] && n) {
						a(o);
						continue;
					}
				}
				(e.metadataRegistry.get(o[0])?.id || n.cycle || n.count > 1 && "ref" === e.reused) && a(o);
			} else a(o);
		}
	}
	function Tn(e, t) {
		const n = e.seen.get(t);
		if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
		const r = (t) => {
			const n = e.seen.get(t);
			if (null === n.ref) return;
			const a = n.def ?? n.schema, o = { ...a }, i = n.ref;
			if (n.ref = null, i) {
				r(i);
				const n = e.seen.get(i), s = n.schema;
				if (!s.$ref || "draft-07" !== e.target && "draft-04" !== e.target && "openapi-3.0" !== e.target ? Object.assign(a, s) : (a.allOf = a.allOf ?? [], a.allOf.push(s)), Object.assign(a, o), t._zod.parent === i) for (const e in a) "$ref" !== e && "allOf" !== e && (e in o || delete a[e]);
				if (s.$ref && n.def) for (const e in a) "$ref" !== e && "allOf" !== e && e in n.def && JSON.stringify(a[e]) === JSON.stringify(n.def[e]) && delete a[e];
			}
			const s = t._zod.parent;
			if (s && s !== i) {
				r(s);
				const t = e.seen.get(s);
				if (t?.schema.$ref && (a.$ref = t.schema.$ref, t.def)) for (const e in a) "$ref" !== e && "allOf" !== e && e in t.def && JSON.stringify(a[e]) === JSON.stringify(t.def[e]) && delete a[e];
			}
			e.override({
				zodSchema: t,
				jsonSchema: a,
				path: n.path ?? []
			});
		};
		for (const s of [...e.seen.entries()].reverse()) r(s[0]);
		const a = {};
		if ("draft-2020-12" === e.target ? a.$schema = "https://json-schema.org/draft/2020-12/schema" : "draft-07" === e.target ? a.$schema = "http://json-schema.org/draft-07/schema#" : "draft-04" === e.target ? a.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
			const n = e.external.registry.get(t)?.id;
			if (!n) throw new Error("Schema is missing an `id` property");
			a.$id = e.external.uri(n);
		}
		Object.assign(a, n.def ?? n.schema);
		const o = e.external?.defs ?? {};
		for (const s of e.seen.entries()) {
			const e = s[1];
			e.def && e.defId && (o[e.defId] = e.def);
		}
		e.external || Object.keys(o).length > 0 && ("draft-2020-12" === e.target ? a.$defs = o : a.definitions = o);
		try {
			const n = JSON.parse(JSON.stringify(a));
			return Object.defineProperty(n, "~standard", {
				value: {
					...t["~standard"],
					jsonSchema: {
						input: Ln(t, "input", e.processors),
						output: Ln(t, "output", e.processors)
					}
				},
				enumerable: !1,
				writable: !1
			}), n;
		} catch (i) {
			throw new Error("Error converting schema to JSON.");
		}
	}
	function Sn(e, t) {
		const n = t ?? { seen: /* @__PURE__ */ new Set() };
		if (n.seen.has(e)) return !1;
		n.seen.add(e);
		const r = e._zod.def;
		if ("transform" === r.type) return !0;
		if ("array" === r.type) return Sn(r.element, n);
		if ("set" === r.type) return Sn(r.valueType, n);
		if ("lazy" === r.type) return Sn(r.getter(), n);
		if ("promise" === r.type || "optional" === r.type || "nonoptional" === r.type || "nullable" === r.type || "readonly" === r.type || "default" === r.type || "prefault" === r.type) return Sn(r.innerType, n);
		if ("intersection" === r.type) return Sn(r.left, n) || Sn(r.right, n);
		if ("record" === r.type || "map" === r.type) return Sn(r.keyType, n) || Sn(r.valueType, n);
		if ("pipe" === r.type) return Sn(r.in, n) || Sn(r.out, n);
		if ("object" === r.type) {
			for (const e in r.shape) if (Sn(r.shape[e], n)) return !0;
			return !1;
		}
		if ("union" === r.type) {
			for (const e of r.options) if (Sn(e, n)) return !0;
			return !1;
		}
		if ("tuple" === r.type) {
			for (const e of r.items) if (Sn(e, n)) return !0;
			return !(!r.rest || !Sn(r.rest, n));
		}
		return !1;
	}
	const Ln = (e, t, n = {}) => (r) => {
		const { libraryOptions: a, target: o } = r ?? {}, i = vn({
			...a ?? {},
			target: o,
			io: t,
			processors: n
		});
		return kn(e, i), En(i, e), Tn(i, e);
	}, On = {
		guid: "uuid",
		url: "uri",
		datetime: "date-time",
		json_string: "json-string",
		regex: ""
	}, xn = (e, t, n, r) => {
		const a = e._zod.def, o = !1 === a.inclusive, i = a.options.map((e, n) => kn(e, t, {
			...r,
			path: [
				...r.path,
				o ? "oneOf" : "anyOf",
				n
			]
		}));
		o ? n.oneOf = i : n.anyOf = i;
	}, zn = (e, t, n, r) => {
		const a = e._zod.def;
		kn(a.innerType, t, r);
		t.seen.get(e).ref = a.innerType;
	}, Pn = c("ZodISODateTime", (e, t) => {
		st.init(e, t), tr.init(e, t);
	});
	function Rn(e) {
		return function(e, t) {
			return new e({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: !1,
				local: !1,
				precision: null,
				...F(t)
			});
		}(Pn, e);
	}
	const In = c("ZodISODate", (e, t) => {
		ut.init(e, t), tr.init(e, t);
	});
	function Fn(e) {
		return function(e, t) {
			return new e({
				type: "string",
				format: "date",
				check: "string_format",
				...F(t)
			});
		}(In, e);
	}
	const An = c("ZodISOTime", (e, t) => {
		lt.init(e, t), tr.init(e, t);
	});
	function Mn(e) {
		return function(e, t) {
			return new e({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...F(t)
			});
		}(An, e);
	}
	const Nn = c("ZodISODuration", (e, t) => {
		ct.init(e, t), tr.init(e, t);
	});
	function Dn(e) {
		return function(e, t) {
			return new e({
				type: "string",
				format: "duration",
				check: "string_format",
				...F(t)
			});
		}(Nn, e);
	}
	const Cn = (e, t) => {
		Z.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
			format: { value: (t) => function(e, t = (e) => e.message) {
				const n = { _errors: [] }, r = (e) => {
					for (const a of e.issues) if ("invalid_union" === a.code && a.errors.length) a.errors.map((e) => r({ issues: e }));
					else if ("invalid_key" === a.code) r({ issues: a.issues });
					else if ("invalid_element" === a.code) r({ issues: a.issues });
					else if (0 === a.path.length) n._errors.push(t(a));
					else {
						let e = n, r = 0;
						for (; r < a.path.length;) {
							const n = a.path[r];
							r !== a.path.length - 1 ? e[n] = e[n] || { _errors: [] } : (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(a))), e = e[n], r++;
						}
					}
				};
				return r(e), n;
			}(e, t) },
			flatten: { value: (t) => function(e, t = (e) => e.message) {
				const n = {}, r = [];
				for (const a of e.issues) a.path.length > 0 ? (n[a.path[0]] = n[a.path[0]] || [], n[a.path[0]].push(t(a))) : r.push(t(a));
				return {
					formErrors: r,
					fieldErrors: n
				};
			}(e, t) },
			addIssue: { value: (t) => {
				e.issues.push(t), e.message = JSON.stringify(e.issues, _, 2);
			} },
			addIssues: { value: (t) => {
				e.issues.push(...t), e.message = JSON.stringify(e.issues, _, 2);
			} },
			isEmpty: { get: () => 0 === e.issues.length }
		});
	}, jn = (c("ZodError", Cn), c("ZodError", Cn, { Parent: Error })), $n = V(jn), Un = H(jn), Zn = W(jn), Bn = J(jn), Vn = G(jn), Hn = X(jn), Wn = K(jn), Yn = Q(jn), Jn = ee(jn), qn = te(jn), Gn = ne(jn), Xn = re(jn), Kn = c("ZodType", (e, t) => (Ye.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
		input: Ln(e, "input"),
		output: Ln(e, "output")
	} }), e.toJSONSchema = ((e, t = {}) => (n) => {
		const r = vn({
			...n,
			processors: t
		});
		return kn(e, r), En(r, e), Tn(r, e);
	})(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(E(t, { checks: [...t.checks ?? [], ...n.map((e) => "function" == typeof e ? { _zod: {
		check: e,
		def: { check: "custom" },
		onattach: []
	} } : e)] }), { parent: !0 }), e.with = e.check, e.clone = (t, n) => I(e, t, n), e.brand = () => e, e.register = (t, n) => (t.add(e, n), e), e.parse = (t, n) => $n(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => Zn(e, t, n), e.parseAsync = async (t, n) => Un(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => Bn(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => Vn(e, t, n), e.decode = (t, n) => Hn(e, t, n), e.encodeAsync = async (t, n) => Wn(e, t, n), e.decodeAsync = async (t, n) => Yn(e, t, n), e.safeEncode = (t, n) => Jn(e, t, n), e.safeDecode = (t, n) => qn(e, t, n), e.safeEncodeAsync = async (t, n) => Gn(e, t, n), e.safeDecodeAsync = async (t, n) => Xn(e, t, n), e.refine = (t, n) => e.check(function(e, t = {}) {
		return function(e, t, n) {
			return new e({
				type: "custom",
				check: "custom",
				fn: t,
				...F(n)
			});
		}(na, e, t);
	}(t, n)), e.superRefine = (t) => e.check(function(e) {
		const t = wn((n) => (n.addIssue = (e) => {
			if ("string" == typeof e) n.issues.push($(e, n.value, t._zod.def));
			else {
				const r = e;
				r.fatal && (r.continue = !1), r.code ?? (r.code = "custom"), r.input ?? (r.input = n.value), r.inst ?? (r.inst = t), r.continue ?? (r.continue = !t._zod.def.abort), n.issues.push($(r));
			}
		}, e(n.value, n)));
		return t;
	}(t)), e.overwrite = (t) => e.check(yn(t)), e.optional = () => Hr(e), e.exactOptional = () => new Wr({
		type: "optional",
		innerType: e
	}), e.nullable = () => Jr(e), e.nullish = () => Hr(Jr(e)), e.nonoptional = (t) => function(e, t) {
		return new Xr({
			type: "nonoptional",
			innerType: e,
			...F(t)
		});
	}(e, t), e.array = () => zr(e), e.or = (t) => {
		return new Ir({
			type: "union",
			options: [e, t],
			...F(n)
		});
		var n;
	}, e.and = (t) => new Dr({
		type: "intersection",
		left: e,
		right: t
	}), e.transform = (t) => ea(e, Br(t)), e.default = (t) => {
		return n = t, new qr({
			type: "default",
			innerType: e,
			get defaultValue() {
				return "function" == typeof n ? n() : z(n);
			}
		});
		var n;
	}, e.prefault = (t) => {
		return n = t, new Gr({
			type: "prefault",
			innerType: e,
			get defaultValue() {
				return "function" == typeof n ? n() : z(n);
			}
		});
		var n;
	}, e.catch = (t) => {
		return new Kr({
			type: "catch",
			innerType: e,
			catchValue: "function" == typeof (n = t) ? n : () => n
		});
		var n;
	}, e.pipe = (t) => ea(e, t), e.readonly = () => new ta({
		type: "readonly",
		innerType: e
	}), e.describe = (t) => {
		const n = e.clone();
		return ln.add(n, { description: t }), n;
	}, Object.defineProperty(e, "description", {
		get: () => ln.get(e)?.description,
		configurable: !0
	}), e.meta = (...t) => {
		if (0 === t.length) return ln.get(e);
		const n = e.clone();
		return ln.add(n, t[0]), n;
	}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (t) => t(e), e)), Qn = c("_ZodString", (e, t) => {
		Je.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n) => {
			const r = n;
			r.type = "string";
			const { minimum: a, maximum: o, format: i, patterns: s, contentEncoding: u } = e._zod.bag;
			if ("number" == typeof a && (r.minLength = a), "number" == typeof o && (r.maxLength = o), i && (r.format = On[i] ?? i, "" === r.format && delete r.format, "time" === i && delete r.format), u && (r.contentEncoding = u), s && s.size > 0) {
				const e = [...s];
				1 === e.length ? r.pattern = e[0].source : e.length > 1 && (r.allOf = [...e.map((e) => ({
					..."draft-07" === t.target || "draft-04" === t.target || "openapi-3.0" === t.target ? { type: "string" } : {},
					pattern: e.source
				}))]);
			}
		})(e, t, n);
		const n = e._zod.bag;
		e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...t) => e.check(function(e, t) {
			return new Ce({
				check: "string_format",
				format: "regex",
				...F(t),
				pattern: e
			});
		}(...t)), e.includes = (...t) => e.check(function(e, t) {
			return new Ue({
				check: "string_format",
				format: "includes",
				...F(t),
				includes: e
			});
		}(...t)), e.startsWith = (...t) => e.check(function(e, t) {
			return new Ze({
				check: "string_format",
				format: "starts_with",
				...F(t),
				prefix: e
			});
		}(...t)), e.endsWith = (...t) => e.check(function(e, t) {
			return new Be({
				check: "string_format",
				format: "ends_with",
				...F(t),
				suffix: e
			});
		}(...t)), e.min = (...t) => e.check(gn(...t)), e.max = (...t) => e.check(_n(...t)), e.length = (...t) => e.check(bn(...t)), e.nonempty = (...t) => e.check(gn(1, ...t)), e.lowercase = (t) => e.check(function(e) {
			return new je({
				check: "string_format",
				format: "lowercase",
				...F(e)
			});
		}(t)), e.uppercase = (t) => e.check(function(e) {
			return new $e({
				check: "string_format",
				format: "uppercase",
				...F(e)
			});
		}(t)), e.trim = () => e.check(yn((e) => e.trim())), e.normalize = (...t) => e.check(function(e) {
			return yn((t) => t.normalize(e));
		}(...t)), e.toLowerCase = () => e.check(yn((e) => e.toLowerCase())), e.toUpperCase = () => e.check(yn((e) => e.toUpperCase())), e.slugify = () => e.check(yn((e) => function(e) {
			return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}(e)));
	}), er = c("ZodString", (e, t) => {
		Je.init(e, t), Qn.init(e, t), e.email = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "email",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(nr, t)), e.url = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "url",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(or, t)), e.jwt = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(wr, t)), e.emoji = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(ir, t)), e.guid = (t) => e.check(cn(rr, t)), e.uuid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(ar, t)), e.uuidv4 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: !1,
				version: "v4",
				...F(t)
			});
		}(ar, t)), e.uuidv6 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: !1,
				version: "v6",
				...F(t)
			});
		}(ar, t)), e.uuidv7 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: !1,
				version: "v7",
				...F(t)
			});
		}(ar, t)), e.nanoid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(sr, t)), e.guid = (t) => e.check(cn(rr, t)), e.cuid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(ur, t)), e.cuid2 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(lr, t)), e.ulid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(cr, t)), e.base64 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(gr, t)), e.base64url = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(br, t)), e.xid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(dr, t)), e.ksuid = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(pr, t)), e.ipv4 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(hr, t)), e.ipv6 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(fr, t)), e.cidrv4 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(mr, t)), e.cidrv6 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(_r, t)), e.e164 = (t) => e.check(function(e, t) {
			return new e({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: !1,
				...F(t)
			});
		}(yr, t)), e.datetime = (t) => e.check(Rn(t)), e.date = (t) => e.check(Fn(t)), e.time = (t) => e.check(Mn(t)), e.duration = (t) => e.check(Dn(t));
	});
	const tr = c("ZodStringFormat", (e, t) => {
		qe.init(e, t), Qn.init(e, t);
	}), nr = c("ZodEmail", (e, t) => {
		Ke.init(e, t), tr.init(e, t);
	}), rr = c("ZodGUID", (e, t) => {
		Ge.init(e, t), tr.init(e, t);
	}), ar = c("ZodUUID", (e, t) => {
		Xe.init(e, t), tr.init(e, t);
	}), or = c("ZodURL", (e, t) => {
		Qe.init(e, t), tr.init(e, t);
	}), ir = c("ZodEmoji", (e, t) => {
		et.init(e, t), tr.init(e, t);
	}), sr = c("ZodNanoID", (e, t) => {
		tt.init(e, t), tr.init(e, t);
	}), ur = c("ZodCUID", (e, t) => {
		nt.init(e, t), tr.init(e, t);
	}), lr = c("ZodCUID2", (e, t) => {
		rt.init(e, t), tr.init(e, t);
	}), cr = c("ZodULID", (e, t) => {
		at.init(e, t), tr.init(e, t);
	}), dr = c("ZodXID", (e, t) => {
		ot.init(e, t), tr.init(e, t);
	}), pr = c("ZodKSUID", (e, t) => {
		it.init(e, t), tr.init(e, t);
	}), hr = c("ZodIPv4", (e, t) => {
		dt.init(e, t), tr.init(e, t);
	}), fr = c("ZodIPv6", (e, t) => {
		pt.init(e, t), tr.init(e, t);
	}), mr = c("ZodCIDRv4", (e, t) => {
		ht.init(e, t), tr.init(e, t);
	}), _r = c("ZodCIDRv6", (e, t) => {
		ft.init(e, t), tr.init(e, t);
	}), gr = c("ZodBase64", (e, t) => {
		_t.init(e, t), tr.init(e, t);
	}), br = c("ZodBase64URL", (e, t) => {
		gt.init(e, t), tr.init(e, t);
	}), yr = c("ZodE164", (e, t) => {
		bt.init(e, t), tr.init(e, t);
	}), wr = c("ZodJWT", (e, t) => {
		yt.init(e, t), tr.init(e, t);
	}), vr = c("ZodNumber", (e, t) => {
		wt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n) => {
			const r = n, { minimum: a, maximum: o, format: i, multipleOf: s, exclusiveMaximum: u, exclusiveMinimum: l } = e._zod.bag;
			"string" == typeof i && i.includes("int") ? r.type = "integer" : r.type = "number", "number" == typeof l && ("draft-04" === t.target || "openapi-3.0" === t.target ? (r.minimum = l, r.exclusiveMinimum = !0) : r.exclusiveMinimum = l), "number" == typeof a && (r.minimum = a, "number" == typeof l && "draft-04" !== t.target && (l >= a ? delete r.minimum : delete r.exclusiveMinimum)), "number" == typeof u && ("draft-04" === t.target || "openapi-3.0" === t.target ? (r.maximum = u, r.exclusiveMaximum = !0) : r.exclusiveMaximum = u), "number" == typeof o && (r.maximum = o, "number" == typeof u && "draft-04" !== t.target && (u <= o ? delete r.maximum : delete r.exclusiveMaximum)), "number" == typeof s && (r.multipleOf = s);
		})(e, t, n), e.gt = (t, n) => e.check(hn(t, n)), e.gte = (t, n) => e.check(fn(t, n)), e.min = (t, n) => e.check(fn(t, n)), e.lt = (t, n) => e.check(dn(t, n)), e.lte = (t, n) => e.check(pn(t, n)), e.max = (t, n) => e.check(pn(t, n)), e.int = (t) => e.check(Er(t)), e.safe = (t) => e.check(Er(t)), e.positive = (t) => e.check(hn(0, t)), e.nonnegative = (t) => e.check(fn(0, t)), e.negative = (t) => e.check(dn(0, t)), e.nonpositive = (t) => e.check(pn(0, t)), e.multipleOf = (t, n) => e.check(mn(t, n)), e.step = (t, n) => e.check(mn(t, n)), e.finite = () => e;
		const n = e._zod.bag;
		e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
	});
	const kr = c("ZodNumberFormat", (e, t) => {
		vt.init(e, t), vr.init(e, t);
	});
	function Er(e) {
		return function(e, t) {
			return new e({
				type: "number",
				check: "number_format",
				abort: !1,
				format: "safeint",
				...F(t)
			});
		}(kr, e);
	}
	const Tr = c("ZodUnknown", (e, t) => {
		kt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (e, t, n) => {};
	});
	function Sr() {
		return new Tr({ type: "unknown" });
	}
	const Lr = c("ZodNever", (e, t) => {
		Et.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (e, t, n) => ((e, t, n) => {
			n.not = {};
		})(0, 0, t);
	});
	function Or(e) {
		return function(e, t) {
			return new e({
				type: "never",
				...F(t)
			});
		}(Lr, e);
	}
	const xr = c("ZodArray", (e, t) => {
		St.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = n, o = e._zod.def, { minimum: i, maximum: s } = e._zod.bag;
			"number" == typeof i && (a.minItems = i), "number" == typeof s && (a.maxItems = s), a.type = "array", a.items = kn(o.element, t, {
				...r,
				path: [...r.path, "items"]
			});
		})(e, t, n, r), e.element = t.element, e.min = (t, n) => e.check(gn(t, n)), e.nonempty = (t) => e.check(gn(1, t)), e.max = (t, n) => e.check(_n(t, n)), e.length = (t, n) => e.check(bn(t, n)), e.unwrap = () => e.element;
	});
	function zr(e, t) {
		return function(e, t, n) {
			return new e({
				type: "array",
				element: t,
				...F(n)
			});
		}(xr, e, t);
	}
	const Pr = c("ZodObject", (e, t) => {
		Pt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = n, o = e._zod.def;
			a.type = "object", a.properties = {};
			const i = o.shape;
			for (const l in i) a.properties[l] = kn(i[l], t, {
				...r,
				path: [
					...r.path,
					"properties",
					l
				]
			});
			const s = new Set(Object.keys(i)), u = new Set([...s].filter((e) => {
				const n = o.shape[e]._zod;
				return "input" === t.io ? void 0 === n.optin : void 0 === n.optout;
			}));
			u.size > 0 && (a.required = Array.from(u)), "never" === o.catchall?._zod.def.type ? a.additionalProperties = !1 : o.catchall ? o.catchall && (a.additionalProperties = kn(o.catchall, t, {
				...r,
				path: [...r.path, "additionalProperties"]
			})) : "output" === t.io && (a.additionalProperties = !1);
		})(e, t, n, r), v(e, "shape", () => t.shape), e.keyof = () => {
			return t = Object.keys(e._zod.def.shape), new jr({
				type: "enum",
				entries: Array.isArray(t) ? Object.fromEntries(t.map((e) => [e, e])) : t,
				...F(n)
			});
			var t, n;
		}, e.catchall = (t) => e.clone({
			...e._zod.def,
			catchall: t
		}), e.passthrough = () => e.clone({
			...e._zod.def,
			catchall: Sr()
		}), e.loose = () => e.clone({
			...e._zod.def,
			catchall: Sr()
		}), e.strict = () => e.clone({
			...e._zod.def,
			catchall: Or()
		}), e.strip = () => e.clone({
			...e._zod.def,
			catchall: void 0
		}), e.extend = (t) => function(e, t) {
			if (!x(t)) throw new Error("Invalid input to extend: expected a plain object");
			const n = e._zod.def.checks;
			if (n && n.length > 0) {
				const n = e._zod.def.shape;
				for (const e in t) if (void 0 !== Object.getOwnPropertyDescriptor(n, e)) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return I(e, E(e._zod.def, { get shape() {
				const n = {
					...e._zod.def.shape,
					...t
				};
				return k(this, "shape", n), n;
			} }));
		}(e, t), e.safeExtend = (t) => function(e, t) {
			if (!x(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return I(e, E(e._zod.def, { get shape() {
				const n = {
					...e._zod.def.shape,
					...t
				};
				return k(this, "shape", n), n;
			} }));
		}(e, t), e.merge = (t) => {
			return r = t, I(n = e, E(n._zod.def, {
				get shape() {
					const e = {
						...n._zod.def.shape,
						...r._zod.def.shape
					};
					return k(this, "shape", e), e;
				},
				get catchall() {
					return r._zod.def.catchall;
				},
				checks: []
			}));
			var n, r;
		}, e.pick = (t) => function(e, t) {
			const n = e._zod.def, r = n.checks;
			if (r && r.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return I(e, E(e._zod.def, {
				get shape() {
					const e = {};
					for (const r in t) {
						if (!(r in n.shape)) throw new Error(`Unrecognized key: "${r}"`);
						t[r] && (e[r] = n.shape[r]);
					}
					return k(this, "shape", e), e;
				},
				checks: []
			}));
		}(e, t), e.omit = (t) => function(e, t) {
			const n = e._zod.def, r = n.checks;
			if (r && r.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return I(e, E(e._zod.def, {
				get shape() {
					const r = { ...e._zod.def.shape };
					for (const e in t) {
						if (!(e in n.shape)) throw new Error(`Unrecognized key: "${e}"`);
						t[e] && delete r[e];
					}
					return k(this, "shape", r), r;
				},
				checks: []
			}));
		}(e, t), e.partial = (...t) => function(e, t, n) {
			const r = t._zod.def.checks;
			if (r && r.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return I(t, E(t._zod.def, {
				get shape() {
					const r = t._zod.def.shape, a = { ...r };
					if (n) for (const t in n) {
						if (!(t in r)) throw new Error(`Unrecognized key: "${t}"`);
						n[t] && (a[t] = e ? new e({
							type: "optional",
							innerType: r[t]
						}) : r[t]);
					}
					else for (const t in r) a[t] = e ? new e({
						type: "optional",
						innerType: r[t]
					}) : r[t];
					return k(this, "shape", a), a;
				},
				checks: []
			}));
		}(Vr, e, t[0]), e.required = (...t) => function(e, t, n) {
			return I(t, E(t._zod.def, { get shape() {
				const r = t._zod.def.shape, a = { ...r };
				if (n) for (const t in n) {
					if (!(t in a)) throw new Error(`Unrecognized key: "${t}"`);
					n[t] && (a[t] = new e({
						type: "nonoptional",
						innerType: r[t]
					}));
				}
				else for (const t in r) a[t] = new e({
					type: "nonoptional",
					innerType: r[t]
				});
				return k(this, "shape", a), a;
			} }));
		}(Xr, e, t[0]);
	});
	function Rr(e, t) {
		return new Pr({
			type: "object",
			shape: e ?? {},
			...F(t)
		});
	}
	const Ir = c("ZodUnion", (e, t) => {
		It.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => xn(e, t, n, r), e.options = t.options;
	});
	const Fr = c("ZodXor", (e, t) => {
		Ir.init(e, t), At.init(e, t), e._zod.processJSONSchema = (t, n, r) => xn(e, t, n, r), e.options = t.options;
	});
	function Ar(e, t) {
		return new Fr({
			type: "union",
			options: e,
			inclusive: !1,
			...F(t)
		});
	}
	const Mr = c("ZodDiscriminatedUnion", (e, t) => {
		Ir.init(e, t), Mt.init(e, t);
	});
	function Nr(e, t, n) {
		return new Mr({
			type: "union",
			options: t,
			discriminator: e,
			...F(n)
		});
	}
	const Dr = c("ZodIntersection", (e, t) => {
		Nt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def, o = kn(a.left, t, {
				...r,
				path: [
					...r.path,
					"allOf",
					0
				]
			}), i = kn(a.right, t, {
				...r,
				path: [
					...r.path,
					"allOf",
					1
				]
			}), s = (e) => "allOf" in e && 1 === Object.keys(e).length;
			n.allOf = [...s(o) ? o.allOf : [o], ...s(i) ? i.allOf : [i]];
		})(e, t, n, r);
	});
	const Cr = c("ZodTuple", (e, t) => {
		jt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = n, o = e._zod.def;
			a.type = "array";
			const i = "draft-2020-12" === t.target ? "prefixItems" : "items", s = "draft-2020-12" === t.target || "openapi-3.0" === t.target ? "items" : "additionalItems", u = o.items.map((e, n) => kn(e, t, {
				...r,
				path: [
					...r.path,
					i,
					n
				]
			})), l = o.rest ? kn(o.rest, t, {
				...r,
				path: [
					...r.path,
					s,
					..."openapi-3.0" === t.target ? [o.items.length] : []
				]
			}) : null;
			"draft-2020-12" === t.target ? (a.prefixItems = u, l && (a.items = l)) : "openapi-3.0" === t.target ? (a.items = { anyOf: u }, l && a.items.anyOf.push(l), a.minItems = u.length, l || (a.maxItems = u.length)) : (a.items = u, l && (a.additionalItems = l));
			const { minimum: c, maximum: d } = e._zod.bag;
			"number" == typeof c && (a.minItems = c), "number" == typeof d && (a.maxItems = d);
		})(e, t, n, r), e.rest = (t) => e.clone({
			...e._zod.def,
			rest: t
		});
	});
	const jr = c("ZodEnum", (e, t) => {
		Ut.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n) => {
			const r = m(e._zod.def.entries);
			r.every((e) => "number" == typeof e) && (n.type = "number"), r.every((e) => "string" == typeof e) && (n.type = "string"), n.enum = r;
		})(e, 0, n), e.enum = t.entries, e.options = Object.values(t.entries);
		const n = new Set(Object.keys(t.entries));
		e.extract = (e, r) => {
			const a = {};
			for (const o of e) {
				if (!n.has(o)) throw new Error(`Key ${o} not found in enum`);
				a[o] = t.entries[o];
			}
			return new jr({
				...t,
				checks: [],
				...F(r),
				entries: a
			});
		}, e.exclude = (e, r) => {
			const a = { ...t.entries };
			for (const t of e) {
				if (!n.has(t)) throw new Error(`Key ${t} not found in enum`);
				delete a[t];
			}
			return new jr({
				...t,
				checks: [],
				...F(r),
				entries: a
			});
		};
	});
	const $r = c("ZodLiteral", (e, t) => {
		Zt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n) => {
			const r = e._zod.def, a = [];
			for (const o of r.values) if (void 0 === o) {
				if ("throw" === t.unrepresentable) throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if ("bigint" == typeof o) {
				if ("throw" === t.unrepresentable) throw new Error("BigInt literals cannot be represented in JSON Schema");
				a.push(Number(o));
			} else a.push(o);
			if (0 === a.length);
			else if (1 === a.length) {
				const e = a[0];
				n.type = null === e ? "null" : typeof e, "draft-04" === t.target || "openapi-3.0" === t.target ? n.enum = [e] : n.const = e;
			} else a.every((e) => "number" == typeof e) && (n.type = "number"), a.every((e) => "string" == typeof e) && (n.type = "string"), a.every((e) => "boolean" == typeof e) && (n.type = "boolean"), a.every((e) => null === e) && (n.type = "null"), n.enum = a;
		})(e, t, n), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
			if (t.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
			return t.values[0];
		} });
	});
	function Ur(e, t) {
		return new $r({
			type: "literal",
			values: Array.isArray(e) ? e : [e],
			...F(t)
		});
	}
	const Zr = c("ZodTransform", (e, t) => {
		Bt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (e, t, n) => ((e, t) => {
			if ("throw" === t.unrepresentable) throw new Error("Transforms cannot be represented in JSON Schema");
		})(0, e), e._zod.parse = (n, r) => {
			if ("backward" === r.direction) throw new p(e.constructor.name);
			n.addIssue = (r) => {
				if ("string" == typeof r) n.issues.push($(r, n.value, t));
				else {
					const t = r;
					t.fatal && (t.continue = !1), t.code ?? (t.code = "custom"), t.input ?? (t.input = n.value), t.inst ?? (t.inst = e), n.issues.push($(t));
				}
			};
			const a = t.transform(n.value, n);
			return a instanceof Promise ? a.then((e) => (n.value = e, n)) : (n.value = a, n);
		};
	});
	function Br(e) {
		return new Zr({
			type: "transform",
			transform: e
		});
	}
	const Vr = c("ZodOptional", (e, t) => {
		Ht.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => zn(e, t, 0, r), e.unwrap = () => e._zod.def.innerType;
	});
	function Hr(e) {
		return new Vr({
			type: "optional",
			innerType: e
		});
	}
	const Wr = c("ZodExactOptional", (e, t) => {
		Wt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => zn(e, t, 0, r), e.unwrap = () => e._zod.def.innerType;
	});
	const Yr = c("ZodNullable", (e, t) => {
		Yt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def, o = kn(a.innerType, t, r), i = t.seen.get(e);
			"openapi-3.0" === t.target ? (i.ref = a.innerType, n.nullable = !0) : n.anyOf = [o, { type: "null" }];
		})(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	function Jr(e) {
		return new Yr({
			type: "nullable",
			innerType: e
		});
	}
	const qr = c("ZodDefault", (e, t) => {
		Jt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def;
			kn(a.innerType, t, r), t.seen.get(e).ref = a.innerType, n.default = JSON.parse(JSON.stringify(a.defaultValue));
		})(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
	});
	const Gr = c("ZodPrefault", (e, t) => {
		Gt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def;
			kn(a.innerType, t, r), t.seen.get(e).ref = a.innerType, "input" === t.io && (n._prefault = JSON.parse(JSON.stringify(a.defaultValue)));
		})(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	const Xr = c("ZodNonOptional", (e, t) => {
		Xt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def;
			kn(a.innerType, t, r), t.seen.get(e).ref = a.innerType;
		})(e, t, 0, r), e.unwrap = () => e._zod.def.innerType;
	});
	const Kr = c("ZodCatch", (e, t) => {
		Qt.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def;
			let o;
			kn(a.innerType, t, r), t.seen.get(e).ref = a.innerType;
			try {
				o = a.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			n.default = o;
		})(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
	});
	const Qr = c("ZodPipe", (e, t) => {
		en.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def, o = "input" === t.io ? "transform" === a.in._zod.def.type ? a.out : a.in : a.out;
			kn(o, t, r), t.seen.get(e).ref = o;
		})(e, t, 0, r), e.in = t.in, e.out = t.out;
	});
	function ea(e, t) {
		return new Qr({
			type: "pipe",
			in: e,
			out: t
		});
	}
	const ta = c("ZodReadonly", (e, t) => {
		nn.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (t, n, r) => ((e, t, n, r) => {
			const a = e._zod.def;
			kn(a.innerType, t, r), t.seen.get(e).ref = a.innerType, n.readOnly = !0;
		})(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	const na = c("ZodCustom", (e, t) => {
		an.init(e, t), Kn.init(e, t), e._zod.processJSONSchema = (e, t, n) => ((e, t) => {
			if ("throw" === t.unrepresentable) throw new Error("Custom types cannot be represented in JSON Schema");
		})(0, e);
	});
	function ra(e, t) {
		return ea(Br(e), t);
	}
	var aa = l();
	function oa(e) {
		return null !== (t = e) && "object" == typeof t && t.constructor === Object && 0 === Object.keys(t).length ? [] : e;
		var t;
	}
	const ia = function(e, t) {
		return new e({
			type: "number",
			checks: [],
			...F(t)
		});
	}(vr, sa).default(0);
	var sa;
	const ua = function(e) {
		return function(e, t) {
			return new e({
				type: "string",
				...F(t)
			});
		}(er, e);
	}().transform(function(e) {
		return "" === e ? null : e;
	}).default(null), la = ia.transform(function(e) {
		return 0 !== e;
	}), ca = (e) => ra(oa, zr(e)).default([]), da = (e) => ra(oa, function(e, t, n) {
		const r = t instanceof Ye;
		return new Cr({
			type: "tuple",
			items: e,
			rest: r ? t : null,
			...F(r ? n : t)
		});
	}(e)).default([]), pa = ra(function(e) {
		return "function" == typeof e ? "function" : e;
	}, Ur("function")).default(null), ha = ia.optional();
	var fa = Rr({
		NORMAL_STANDARD: ia,
		NORMAL_RUNE: ia,
		CHAMP_STANDARD: ia,
		CHAMP_RUNE: ia,
		BOSS_STANDARD: ia,
		BOSS_RUNE: ia,
		EXTRAGOLD: ia,
		EXTRAPOTION: ia,
		EXTRARUNE: ia,
		Trader_Item: ia,
		Trader_Many: ia,
		Trader_SpecialOffer: ia,
		Well_Potion: ia,
		QUEST_UNIQUE: ia,
		SUBFAMDROP_LOWCHANCE: ia,
		SUBFAMDROP_HIGHCHANCE: ia
	});
	function ma(e) {
		return JSON.stringify(e, null, 2);
	}
	var _a = ca(da([
		ua,
		ia,
		ia,
		ia
	])).transform(function(e) {
		const t = Object.create(null);
		for (const n of e) t[n[0]] = [
			n[1],
			n[2],
			n[3]
		];
		return t;
	});
	var ga = ca(da([ua, ia])).transform(function(e) {
		const t = Object.create(null);
		for (const n of e) t[n[0]] = n[1];
		return t;
	});
	var ba = ca(da([ua, ia])).transform(function(e) {
		const t = Object.create(null);
		for (const n of e) t[n[0]] = n[1];
		return t;
	});
	var ya = da([
		ha,
		ha,
		ha,
		ha
	]).transform(function(e) {
		return [
			e[0] ?? 0,
			e[1] ?? 0,
			e[2] ?? 0,
			e[3] ?? 0
		];
	});
	var wa = da([
		ha,
		ha,
		ha,
		ha,
		ha
	]).transform(function(e) {
		return [
			e[0] ?? 0,
			e[1] ?? 0,
			e[2] ?? 0,
			e[3] ?? 0,
			e[4] ?? 0
		];
	}), va = Rr({
		tableRows: ia,
		EFFECTDURATION: ya,
		QuestExplow: wa,
		QuestGoldlow: wa,
		SpellFactorDiff: wa,
		QuestGoldmax: wa,
		DefenseFactorDiff: wa,
		QuestExpmax: wa,
		MP_experience: wa,
		NPC_speedfac_any: wa,
		AttackFactorDiff: wa,
		DamageFactorDiff: wa,
		LifeFactorDiff: wa,
		MP_damage: wa,
		MP_lifeHP: wa,
		MP_EShieldHP: wa,
		MP_combatvalue: wa,
		MP_armor: wa,
		Spawn_OffsetLow: wa,
		Spawn_OffsetHigh: wa,
		Spawn_FactorPM: wa,
		PriceFactor: wa,
		RuneLevel: wa,
		Potion_big_duration: wa,
		Potion_small_duration: wa,
		Potion_middle_duration: wa,
		NPC_attrWdam_fact: wa,
		MP_intensity: wa,
		LevelCapDiff: wa,
		BlacksmithSkillForDiff: wa,
		LevelMinForDiff: wa,
		AllEnemy_lvl: wa,
		Enemy_armor: wa,
		Enemy_weapondamage: wa,
		Enemy_spelldamage: wa,
		SpellAttackFactorMT: ya,
		SpellDefenseFactorMT: ya,
		HitFactorMT: ya,
		DamageFactorMT: ya,
		LifeQuotientMT: ya
	});
	function ka(e, t) {
		const n = new Array(16);
		for (let r = 0; r < n.length; r++) {
			const a = `${t}${r.toString().padStart(2, "0")}`;
			n[r] = e[a], delete e[a];
		}
		e[t] = n;
	}
	var Ea = Rr({
		AdjustCriticalDamageFactor: ia,
		AdjustDamageFactor: ia,
		AdjustPvPFactor: ia,
		AdjustSpellFactor: ia,
		BasepointsMultiplier: ia,
		ChanceForAdditionalSlots: ia,
		ChanceForSlotToImprove: ia,
		ChanceIncForSlotImprovePerRareLevel: ia,
		ChanceToBecomeSlotItemForBlankItem: ia,
		ChanceToBecomeSlotItemForMagicItem: ia,
		ChanceToBecomeSlotItemForNormalItem: ia,
		ChanceToBecomeSlotItemForUniqueItem: ia,
		DiceRange: ia,
		DurationBoost: ia,
		DurationDot: ia,
		DurationLongDebuff: ia,
		DurationShortDebuff: ia,
		DurationStun: ia,
		DurationPulse: ia,
		DurationStunImmunity: ia,
		EffectCombatArtChance: ia,
		EffectWeaponChance: ia,
		EffectWillpower: ia,
		KillCountBase: ia,
		KillCountInc: ia,
		LifeAttribut: ia,
		LifeBase: ia,
		LifeStep: ia,
		MaxDistLevelXP: ia,
		MinDistLevelXP: ia,
		RareBonusDanger: ia,
		RareMalusThreshold: ia,
		RareStart: ia,
		RuneAmountTotal: ia,
		SkillPivotPoint: ia,
		SlotGoldPercentageImprovement: ia,
		SlotSilverPercentageImprovement: ia,
		SpellBaseDamage: ia,
		TEnergyDamageRate: ia,
		TEnergyMutateChance: ia,
		ThresholdGreyXP: ia,
		TopLevelCalc: ia,
		balanceLifeRegenerationDelayCombatFac: ia,
		balanceLifeRegenerationDelayDangerFac: ia,
		balanceLifeRegenerationTime: ia,
		balanceLevelToSkillFactor: ia,
		RegenerationFactorSkin: ia,
		RegenerationFactorArmorBase: ia,
		SpeedMin: ia,
		SpeedMax: ia,
		SkillGroupPoints: ia,
		damBasepoints: ia,
		resBasepoints: ia,
		RangeAggro: ia,
		RangeXP: ia,
		RangeArea: ia,
		RangeNear: ia,
		AdjustConstitutionFactor: ia,
		InstantHealPortion: ia,
		ExpTeamBonus: ia,
		ExpUpperCapPM: ia,
		ExpLowerCapPM: ia,
		ExpMinRatio: ia,
		balanceShieldRegDelayCombatFactor: ia,
		balanceShieldRegDelayDangerFactor: ia,
		balanceShieldRegTime: ia,
		balanceShieldAbsorptionSkill: ia,
		Mounted_ondeath_healthPM: ia,
		NpcFightDamageDownScaling: ia,
		RangeAggroGrey: ia,
		KillDropMulti: ia,
		IsUsableByHero: ia,
		TraderMaxCount: ia,
		TraderOffer_MaxLifetime: ia,
		ExpMountFactor: ia,
		RangeClearFOW: ia,
		LifeRegenerationDelayTime: ia,
		dropTimeItemReserved: ia,
		dropTimeItemDestroy: ia,
		dropTimeItemUnloadedDestroy: ia,
		respawnTimeStandard: ia,
		respawnTimeMPFactor: ia,
		UpgradeStep: ia,
		UpgradeStart: ia,
		SwapRune_One: ia,
		SwapRune_Two: ia,
		SwapRune_Three: ia,
		SwapRune_Four: ia,
		SwapRune_Foreign: ia,
		ForgeSlot_BronceFactor: ia,
		ForgeSlot_SilverFactor: ia,
		ForgeSlot_GoldFactor: ia,
		PriceAdjustment: ia,
		PriceLeveldiscount: ia,
		PriceShredder: ia,
		PriceSlotfactor: ia,
		UBmean: ia,
		UBpivot: ia,
		UBquot_attr: ia,
		DropQuestStart: ia,
		DropQuestQuot: ia,
		CAregenItemfactor: ia,
		RegenerationFactorArmorScaling: ia,
		Mount_Regenburden_Warhorse: ia,
		Mount_Regenburden_Ridehorse: ia,
		RangeDistance: ia,
		RangeMidrange: ia,
		RangePickupLoot: ia,
		SpellResistFactor: ia,
		SkillAttackSpeedQuot: ia,
		SkillMoveSpeedQuot: ia,
		DurationPotionSmall: ia,
		DurationPotionMiddle: ia,
		DurationPotionBig: ia,
		ZRareExpectation15: ia,
		ZRareExpectation14: ia,
		ZRareExpectation13: ia,
		ZRareExpectation12: ia,
		ZRareExpectation11: ia,
		ZRareExpectation10: ia,
		ZRareExpectation09: ia,
		ZRareExpectation08: ia,
		ZRareExpectation07: ia,
		ZRareExpectation06: ia,
		ZRareExpectation05: ia,
		ZRareExpectation04: ia,
		ZRareExpectation03: ia,
		ZRareExpectation02: ia,
		ZRareExpectation01: ia,
		ZRareExpectation00: ia,
		ZRareBasepoints15: ia,
		ZRareBasepoints14: ia,
		ZRareBasepoints13: ia,
		ZRareBasepoints12: ia,
		ZRareBasepoints11: ia,
		ZRareBasepoints10: ia,
		ZRareBasepoints09: ia,
		ZRareBasepoints08: ia,
		ZRareBasepoints07: ia,
		ZRareBasepoints06: ia,
		ZRareBasepoints05: ia,
		ZRareBasepoints04: ia,
		ZRareBasepoints03: ia,
		ZRareBasepoints02: ia,
		ZRareBasepoints01: ia,
		ZRareBasepoints00: ia,
		ZRareBonusamount14: ia,
		ZRareBonusamount13: ia,
		ZRareBonusamount12: ia,
		ZRareBonusamount15: ia,
		ZRareBonusamount11: ia,
		ZRareBonusamount10: ia,
		ZRareBonusamount09: ia,
		ZRareBonusamount08: ia,
		ZRareBonusamount07: ia,
		ZRareBonusamount06: ia,
		ZRareBonusamount05: ia,
		ZRareBonusamount04: ia,
		ZRareBonusamount03: ia,
		ZRareBonusamount02: ia,
		ZRareBonusamount01: ia,
		ZRareBonusamount00: ia,
		EffectSkillChanceQuot: ia,
		RangeAggroBoss: ia,
		DamScaleIncMax: ia,
		DamScaleRatioMin: ia,
		DamScaleRatioMax: ia,
		IsRuneForHero: ia,
		DropMaxRandomRare: ia,
		DropPowerupRare: ia,
		ExpFac0: ia,
		ExpFac1: ia,
		ExpFac2: ia,
		ExpFac3: ia,
		ExpFac4PM: ia,
		ExpFacAdjust: ia,
		attrSdam_fact: ia,
		attrWdam_fact: ia,
		AdjustRegenFactor: ia,
		TraderOfferUpperRareBase: ia,
		PotionHealCooldown: ia,
		UBspawn_fact: ia,
		Forge_PricePerSlot: ia,
		RuneMalusThreshold: ia,
		ExpLS100: ia,
		ExpLS125: ia,
		ExpLS150: ia,
		ExpLS175: ia,
		SkillMagicFindFactor: ia,
		NumSectors: ia,
		PlagueImmunityFactor: ia,
		AddOn_RegenFactor: ia
	}).transform(function(e) {
		return ka(e, "ZRareExpectation"), ka(e, "ZRareBasepoints"), ka(e, "ZRareBonusamount"), e;
	});
	function Ta({ object: e, schema: t, name: n, id: r, data: a }) {
		const o = t.safeParse(a);
		o.success ? (o.data.id !== r && (console.log(`${n} has an ID of ${o.data.id}, but is inserted with an ID of ${r} instead. Continuing with the latter.`), o.data.id = r), r in e && console.log(`${n} with ID ${r} already exists! Overriding.`), e[r] = o.data) : (console.log(ma(a)), console.log(ma(o.error.issues)));
	}
	function Sa(e, t) {
		const n = [], r = Object.keys(e).filter((e) => e.startsWith(t));
		r.sort((e, t) => e.localeCompare(t, void 0, { numeric: !0 }));
		for (const a of r) n.push(e[a]), delete e[a];
		e[t] = n;
	}
	var La = da([
		ha,
		ha,
		ha
	]).transform(function(e) {
		return {
			minLevel: e[0] ?? 0,
			minTier: e[1] ?? 0,
			minDifficulty: e[2] ?? 0
		};
	});
	var xa = ra(function(e) {
		return Sa(e, "bonusgroup"), e;
	}, Rr({
		id: ia,
		name: ua,
		palettebits: ua,
		dmgvariation: ia,
		minconstraints: La,
		lvljump: ia,
		usability: ia,
		allotment_pmfpi: da([
			ha,
			ha,
			ha,
			ha,
			ha
		]).transform(function(e) {
			return [
				e[0] ?? 0,
				e[1] ?? 0,
				e[2] ?? 0,
				e[3] ?? 0,
				e[4] ?? 0
			];
		}),
		uniquename: ua,
		specialuseonly: la,
		bonusgroup: ca(da([
			ha,
			ha,
			ha,
			ha,
			ha
		]).transform(function(e) {
			return {
				bonusgroupId: e[0] ?? 0,
				intensity: e[1] ?? 0,
				minconstraints: {
					minLevel: e[2] ?? 0,
					minTier: e[3] ?? 0,
					minDifficulty: e[4] ?? 0
				}
			};
		})),
		itemtypes: ca(ia),
		wearergroups: ca(ua)
	}));
	var za = ca(da([
		ha,
		ha,
		ha,
		ha
	]).transform(function(e) {
		return {
			bonusgroupId: e[0] ?? 0,
			intensity: e[1] ?? 0,
			minItems: e[2] ?? 0,
			minDifficulty: e[3] ?? 0
		};
	}));
	var Pa = ra(function(e) {
		return Sa(e, "bonusgroupsforset"), e;
	}, Rr({
		id: ia,
		name: ua,
		singleSet: la,
		groupSet: la,
		mixedSet: la,
		artefact: la,
		blueprintsinset: ca(ia),
		bonusgroupsforset: za
	}));
	function Ra({ object: e, schema: t, name: n, id: r, data: a }) {
		const o = t.safeParse(a);
		o.success ? (r in e && console.log(`${n} with ID ${r} already exists! Overriding.`), o.data.id = r, e[r] = o.data) : (console.log(ma(a)), console.log(ma(o.error.issues)));
	}
	var Fa = ra(function(e) {
		return Sa(e, "difficultyvaluerange"), e;
	}, Rr({
		rating: ia,
		basedonskill: ua,
		type: ua,
		spez: ua,
		spez2: ua,
		usagebits: ia,
		minconstraints: La,
		difficultyvaluerange: ca(da([
			ha,
			ha,
			ha
		])).transform(function(e) {
			const t = Object.create(null);
			for (const n of e) t[n[0] ?? 0] = [n[1] ?? 0, n[2] ?? 0];
			return t;
		})
	}));
	var Aa = Rr({
		id: ia,
		name: ua.transform((e) => null === e ? e : e.trim()),
		bonuslist: ca(ia)
	});
	var Ma = Rr({
		intensity: ia,
		bonus: ia
	});
	var Na = Rr({
		creature_id: ia,
		blueprint_id: ia
	});
	var Da = Rr({
		type: ia,
		walkSpeed: ia,
		runSpeed: ia,
		fightDistMin: ia,
		fightDistMax: ia,
		gender: ia,
		agegroup: ia,
		validEquipSlots: ua,
		defaultSMType: ia,
		behaviour: ua,
		specialmountfor: ia,
		hair1Itemtype: ia,
		hair2Itemtype: ia,
		hair3Itemtype: ia,
		hair4Itemtype: ia,
		hair5Itemtype: ia,
		hair6Itemtype: ia,
		tailItemtype: ia,
		weight: ia,
		dangerClass: ia,
		eBloodEffect: ua,
		eq_fallback: ca(ia)
	});
	var Ca = Rr({
		skill_id: ia,
		advanced: la,
		skill_name: ua
	});
	function ja({ object: e, schema: t, name: n, data: r }) {
		const a = t.safeParse(r);
		if (a.success) {
			const t = a.data.id;
			t in e && console.log(`${n} with ID ${t} already exists! Overriding.`), e[t] = a.data;
		} else console.log(ma(r)), console.log(ma(a.error.issues));
	}
	var Ua = Rr({
		id: ia,
		itemtype_id: ia,
		name: ua,
		behaviour: ua,
		dangerclass: ia,
		groupmaxcount: ia,
		elite_creature_id: ia,
		probabilityforelite: ia,
		rank: ia,
		tenergy_creature_id: ia,
		template_creature_id: ia,
		livesremaining: ia,
		unconscioustime: ia,
		palettebits: ua,
		monstertype: ia,
		faction_id: ia,
		equipset_id: ia,
		modelscale: ia,
		rise_from_ground: la,
		has_corpse: la,
		has_soul: la,
		can_strafe: la,
		speakertype_id: ia,
		mount_creature_id: ia,
		spells: ra(function(e) {
			return Sa(e, "entry"), e;
		}, Rr({ entry: ca(da([ua]).transform(function(e) {
			return e[0];
		})) })).default(null)
	});
	var Ba = ra(function(e) {
		return Sa(e, "entry"), e;
	}, Rr({
		id: ia,
		rank: ia,
		dmgpreference: ia,
		dmgprobability: ia,
		entry: ca(ra(function(e) {
			return e.schema = function(e) {
				return e.hasOwnProperty("blueprint") ? "blueprint" : e.hasOwnProperty("droplist") ? "droplist" : e.hasOwnProperty("creature") ? "creature" : e.hasOwnProperty("pool") ? "pool" : null;
			}(e), e;
		}, Nr("schema", [
			Rr({
				schema: Ur("blueprint"),
				blueprint: ia,
				weightedprob: ia
			}),
			Rr({
				schema: Ur("droplist"),
				droplist: ia,
				weightedprob: ia
			}),
			Rr({
				schema: Ur("creature"),
				creature: ia,
				weightedprob: ia
			}),
			Rr({
				schema: Ur("pool"),
				pool: ia,
				weightedprob: ia
			})
		])))
	}));
	var Va = ra(function(e) {
		return Sa(e, "entry"), e;
	}, Rr({
		id: ia,
		dangerclass: ia,
		inittype: ia,
		entry: ca(Rr({
			expecttype: ia,
			droplist: ia,
			minquality: ia
		}))
	}));
	var Ha = Rr({
		id: ia,
		set: ca(da([
			ia,
			ia,
			ia
		]))
	});
	var Wa = Rr({
		id1: ia,
		id2: ia,
		f1name: ua,
		f2name: ua,
		relation: ua
	});
	var Ya = Rr({
		id: ia,
		name: ua
	});
	var Ja = Rr({
		type: ia,
		material: ua,
		usability: ia,
		invbreite: ia,
		invhoehe: ia,
		additionaltype: ia
	});
	var qa = ra(function(e) {
		return Sa(e, "anchor"), e;
	}, Rr({ anchor: ca(Rr({
		offx: ia,
		offy: ia,
		offz: ia,
		dirx: ia,
		diry: ia,
		dirz: ia
	})) })).default(null);
	var Ga = ra(function(e) {
		return Sa(e, "surface"), e;
	}, Rr({
		name: ua,
		surface: ca(Ar([ua, ca(ua)]).transform((e) => Array.isArray(e) ? e : [e])),
		user: ua
	})).default(null);
	const Xa = Rr({
		minx: ia,
		miny: ia,
		minz: ia,
		maxx: ia,
		maxy: ia,
		maxz: ia
	}).default(null);
	var Ka = Rr({
		renderfamily: ua,
		renderprio: la,
		family: ua,
		subfamily: ua,
		classification: ua,
		flags: ua.transform(function(e) {
			return null === e ? [] : e.split("+").map((e) => e.trim());
		}),
		weargroup: ua,
		editorGroup: ua,
		model0Data: Ga,
		logicBox: Xa,
		dangerclass: ia,
		worldobjectstate: ia,
		anchorPoints: qa,
		activationrad: ia
	});
	var Qa = Rr({
		id: ia,
		name: ua,
		modreal: ia,
		modfocus: ia,
		modbasepoints: ia,
		allotphys: ia,
		allotmagic: ia,
		allotfire: ia,
		allotpoison: ia,
		allotice: ia,
		materialsound: ua
	}).transform(function(e) {
		return {
			id: e.id,
			name: e.name,
			modreal: e.modreal,
			modfocus: e.modfocus,
			modbasepoints: e.modbasepoints,
			allotments: [
				e.allotphys,
				e.allotmagic,
				e.allotfire,
				e.allotpoison,
				e.allotice
			],
			materialsound: e.materialsound
		};
	});
	var eo = Ar([Rr({
		x: ia,
		y: ia,
		z: ia,
		layer: ia,
		orientation: ia
	}), da([
		ia,
		ia,
		ia,
		ia,
		ia,
		ia,
		ia
	])]).default(null);
	var no = ra(function(e) {
		return Sa(e, "station"), e;
	}, Rr({ station: ca(ra(function(e) {
		return e.schema = function(e) {
			return e.hasOwnProperty("taskcreature") ? "taskcreature" : e.hasOwnProperty("area_id") ? "area" : e.hasOwnProperty("worldobject") ? "worldobject" : e.hasOwnProperty("taskitem") ? "taskitem" : null;
		}(e), e;
	}, Nr("schema", [
		Rr({
			schema: Ur("taskcreature"),
			taskcreature: ia,
			needsActivation: la
		}),
		Rr({
			schema: Ur("area"),
			area_id: ia,
			signalonenter: la,
			p1: eo,
			p2: eo,
			needsActivation: la
		}),
		Rr({
			schema: Ur("worldobject"),
			worldobject: ia,
			needsActivation: la
		}),
		Rr({
			schema: Ur("taskitem"),
			taskitem: ia,
			needsActivation: la
		})
	]))) })).default(null);
	var oo = ra(function(e) {
		return Sa(e, "drop"), e;
	}, Rr({ drop: ca(ra(function(e) {
		return Sa(e, "dropper"), e;
	}, Rr({
		taskitem: ia,
		amount: ia,
		dropper: ca(ra(function(e) {
			return e.schema = function(e) {
				return e.hasOwnProperty("creature") ? "creature" : e.hasOwnProperty("taskcreature") ? "taskcreature" : e.hasOwnProperty("subfamily") ? "subfamily" : e.hasOwnProperty("area_id") ? "area" : "any";
			}(e), e;
		}, Nr("schema", [
			Rr({
				schema: Ur("any"),
				dropchance: ia
			}),
			Rr({
				schema: Ur("creature"),
				creature: ia,
				dropchance: ia
			}),
			Rr({
				schema: Ur("taskcreature"),
				taskcreature: ia,
				dropchance: ia
			}),
			Rr({
				schema: Ur("subfamily"),
				subfamily: ua,
				dropchance: ia
			}),
			Rr({
				schema: Ur("area"),
				area_id: ia,
				p1: eo,
				p2: eo,
				dropchance: ia
			})
		])))
	}))) })).default(null);
	var so = ra(function(e) {
		return Sa(e, "kill"), e;
	}, Rr({
		anyofthem: la,
		useprefightdlg: la,
		bodycount: ia,
		kill: ca(ra(function(e) {
			return e.schema = function(e) {
				return e.hasOwnProperty("taskcreature") ? "taskcreature" : e.hasOwnProperty("creature") ? "creature" : null;
			}(e), e;
		}, Nr("schema", [Rr({
			schema: Ur("taskcreature"),
			taskcreature: ia
		}), Rr({
			schema: Ur("creature"),
			creature: ia,
			bodycount: ia
		})])))
	})).default(null);
	const uo = Rr({ victim: ca(da([ia, ia])) });
	var co = Rr({
		amount: ia,
		disband: la,
		usedialog: la,
		attackers: Rr({
			taskcreatures: ca(ia),
			subfamilies: ca(ua)
		}),
		victims: ra(function(e) {
			return Sa(e, "victim"), e;
		}, uo)
	}).default(null);
	var po = ca(da([
		ia,
		ia,
		ia,
		ia
	]));
	var ho = ca(da([
		ia,
		ia,
		ia
	])), fo = Rr({
		area_id: ia,
		signalonenter: la,
		p1: eo,
		p2: eo
	}).default(null);
	var mo = ca(Rr({
		quest_dbid: ia,
		queststate: ia
	}));
	var _o = ca(da([ia, ia]));
	var go = ca(da([
		ia,
		ia,
		ia
	]));
	var bo = ca(da([ia, ia])), yo = Rr({
		area_id: ia,
		signalonenter: la,
		p1: eo,
		p2: eo
	}).default(null);
	var wo = ca(da([
		ia,
		ia,
		ia,
		ua,
		ia
	]));
	var ko = ra(function(e) {
		return Sa(e, "precond_quest"), e;
	}, Rr({
		id: ia,
		name: ua,
		questtype: ia,
		silent: la,
		reward_exp: ia,
		reward_gold: ia,
		reward_drop: ia,
		reward_attr: ia,
		reward_skill: ia,
		dangerclass: ia,
		continues_quest_id: ia,
		mainquestchapter: ia,
		continues_bookentry: ia,
		reservedforgod: ia,
		questbookstrategy: ia,
		reservedforpath: ia,
		releasestage: ia,
		progress: ia,
		ismainquest: la,
		showdlgonwin: la,
		author_ready: la,
		qa_ready: la,
		report_required: la,
		forpathnot: la,
		autostart: la,
		anyprequest: la,
		lostondecline: la,
		precond_quest: mo,
		questReach: no,
		questgiver: Rr({
			ispersistent: la,
			taskcreature: ia,
			isproactive: la,
			isrefusable: la,
			position: eo
		}).default(null),
		questCollect: oo,
		questKill: so,
		reportcompletion_to: ia,
		reportposition: eo,
		stopquestid: ia,
		stopqueststate: ia,
		worldobjects: go,
		groupchanges: wo,
		ti_actions: ho,
		rewards: bo,
		target_area: yo,
		reservedforhero: ia,
		precond_area: fo,
		precond_worldobjects: _o,
		questRescue: co,
		bp_actions: po
	}));
	var Eo = ca(da([ua, ia])).transform(function(e) {
		const t = Object.create(null);
		for (const n of e) t[n[0]] = n[1];
		return t;
	});
	var To = Rr({
		skill_name: ua,
		advance_level: ia,
		min_level: ia,
		mean_value: ia,
		advance_mean_value: ia,
		skillgroup: ua,
		adv_skill_name: ua
	});
	var Lo = Rr({
		eiStateName: ua,
		fxTypeCast: ua,
		fxTypeSpell: ua,
		fxTypeCastSpecial: ua,
		duration: ia,
		animType: ua,
		animTypeApproach: ua,
		animTypeRide: ua,
		animTypeSpecial: ua,
		causesSpellDamage: la,
		magicType: ua,
		tokens: ra(function(e) {
			return Sa(e, "entry"), e;
		}, Rr({ entry: ca(da([
			ua,
			ia,
			ia,
			ia,
			ia
		])) })).default(null),
		fightDistance: ia,
		aspect: ua,
		cooldown: ia,
		soundProfile: ia,
		cost_level: ia,
		cost_base: ia,
		focus_skill_name: ua,
		lore_skill_name: ua,
		spellClass: ua,
		spellcontroltype: ua,
		spelllogictype: ua,
		sorting_rank: ia
	});
	var Oo = Rr({
		itemtype: ia,
		behaviour: ua,
		creature: ia,
		equipset_id: ia,
		faction_id: ia,
		ismortal: la,
		isfighting: la,
		persistent: la,
		position: eo,
		specialdrop: ia
	});
	var xo = Rr({
		position: eo,
		blueprintid: ia,
		isbookitem: la
	});
	var zo = da([ua, ia]);
	var Po = Rr({
		id: ia,
		name: ua,
		stat: ua,
		modreal: ia,
		modfocus: ia,
		modbasepoints: ia,
		bonusgroupID: ia,
		weapondamagespread: ia,
		fightdistance: ia
	});
	var Ro = Rr({
		dbid: ia,
		prefDmg: ia,
		prefDmgProb: ia,
		content: ca(ia),
		contentProb: ca(ia)
	});
	var Io = da([
		ia,
		ia,
		ia,
		ia,
		ia,
		ia,
		pa.nullable(),
		ca(ia)
	]);
	var Fo = Rr({
		name: ua,
		px: ia,
		py: ia,
		pz: ia,
		sx: ia,
		sy: ia,
		sz: ia,
		type: ia,
		rot: da([
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia,
			ia
		])
	});
	async function Ao(e) {
		const t = {
			base: null,
			tables: null,
			values: null,
			subfamSlots: null,
			subfamDroplists: null,
			shrinkheadMinionMap: null
		}, n = { shrinkheadDropMap: null }, r = Object.create(null), a = Object.create(null), o = Object.create(null), i = Object.create(null), s = Object.create(null), u = [], l = Object.create(null), c = Object.create(null), d = Object.create(null), p = Object.create(null), h = Object.create(null), f = Object.create(null), m = [], _ = Object.create(null), g = Object.create(null), b = Object.create(null), y = Object.create(null), w = Object.create(null), v = [], k = Object.create(null), E = Object.create(null), T = Object.create(null), S = Object.create(null), L = Object.create(null), O = Object.create(null), x = Object.create(null), z = Object.create(null), P = await new aa.LuaFactory().createEngine();
		P.global.set("mgr", {
			setBalanceBase: function(e) {
				(function({ balance: e, data: t }) {
					const n = fa.safeParse(t);
					n.success ? (null !== e.base && console.log("BalanceBase has already been initialized. Overriding."), e.base = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			loadShrinkheadMinionMap: function(e) {
				(function({ balance: e, data: t }) {
					const n = _a.safeParse(t);
					n.success ? (null !== e.shrinkheadMinionMap && console.log("BalanceShrinkheadMinionMap has already been initialized. Overriding."), e.shrinkheadMinionMap = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			loadSubfamDroplists: function(e) {
				(function({ balance: e, data: t }) {
					const n = ga.safeParse(t);
					n.success ? (null !== e.subfamDroplists && console.log("BalanceSubfamDroplists has already been initialized. Overriding."), e.subfamDroplists = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			loadSubfamSlots: function(e) {
				(function({ balance: e, data: t }) {
					const n = ba.safeParse(t);
					n.success ? (null !== e.subfamSlots && console.log("BalanceSubfamSlots has already been initialized. Overriding."), e.subfamSlots = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			setBaseTables: function(e) {
				(function({ balance: e, data: t }) {
					const n = va.safeParse(t);
					n.success ? (null !== e.tables && console.log("BaseTables has already been initialized. Overriding."), e.tables = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			setBalanceValues: function(e) {
				(function({ balance: e, data: t }) {
					const n = Ea.safeParse(t);
					n.success ? (null !== e.values && console.log("BalanceValues has already been initialized. Overriding."), e.values = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					balance: t,
					data: e
				});
			},
			createBlueprint: function(e, t) {
				(function({ blueprints: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: xa,
						name: "Blueprint",
						id: t,
						data: n
					});
				})({
					blueprints: r,
					id: e,
					data: t
				});
			},
			createBlueprintset: function(e, t) {
				(function({ blueprintsets: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Pa,
						name: "Blueprintset",
						id: t,
						data: n
					});
				})({
					blueprintsets: a,
					id: e,
					data: t
				});
			},
			addCreatureBpRelation: function(e) {
				(function({ creatureBlueprintRelations: e, data: t }) {
					const n = Na.safeParse(t);
					n.success ? e.push(n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					creatureBlueprintRelations: u,
					data: e
				});
			},
			createBonus: function(e, t) {
				(function({ bonuses: e, id: t, data: n }) {
					Ra({
						object: e,
						schema: Fa,
						name: "Bonus",
						id: t,
						data: n
					});
				})({
					bonuses: o,
					id: e,
					data: t
				});
			},
			createBonusgroup: function(e, t) {
				(function({ bonusgroups: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Aa,
						name: "Bonusgroup",
						id: t,
						data: n
					});
				})({
					bonusgroups: i,
					id: e,
					data: t
				});
			},
			addCreatureBonus: function(e, t) {
				(function({ creatureBonuses: e, creatureId: t, data: n }) {
					const r = Ma.safeParse(n);
					r.success ? t in e ? e[t].push(r.data) : e[t] = [r.data] : (console.log(ma(n)), console.log(ma(r.error.issues)));
				})({
					creatureBonuses: s,
					creatureId: e,
					data: t
				});
			},
			creatureInfoCreate: function(e) {
				(function({ creatureInfos: e, data: t }) {
					const n = Da.safeParse(t);
					if (n.success) {
						const t = n.data.type;
						t in e && console.log(`CreatureInfo for itemtype with ID ${t} already exists! Overriding.`), e[t] = n.data;
					} else console.log(ma(t)), console.log(ma(n.error.issues));
				})({
					creatureInfos: l,
					data: e
				});
			},
			addCreatureSkill: function(e, t) {
				(function({ creatureSkills: e, creatureId: t, data: n }) {
					const r = Ca.safeParse(n);
					r.success ? t in e ? e[t].push(r.data) : e[t] = [r.data] : (console.log(ma(n)), console.log(ma(r.error.issues)));
				})({
					creatureSkills: c,
					creatureId: e,
					data: t
				});
			},
			createCreature: function(e) {
				(function({ creatures: e, data: t }) {
					ja({
						object: e,
						schema: Ua,
						name: "Creature",
						data: t
					});
				})({
					creatures: d,
					data: e
				});
			},
			createDroplist: function(e, t) {
				(function({ droplists: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Ba,
						name: "Droplist",
						id: t,
						data: n
					});
				})({
					droplists: p,
					id: e,
					data: t
				});
			},
			createDroppattern: function(e, t) {
				(function({ droppatterns: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Va,
						name: "Droppattern",
						id: t,
						data: n
					});
				})({
					droppatterns: h,
					id: e,
					data: t
				});
			},
			createEquipset: function(e) {
				(function({ equipsets: e, data: t }) {
					ja({
						object: e,
						schema: Ha,
						name: "Equipset",
						data: t
					});
				})({
					equipsets: f,
					data: e
				});
			},
			addFaction: function(e) {
				(function({ factions: e, data: t }) {
					ja({
						object: e,
						schema: Ya,
						name: "Faction",
						data: t
					});
				})({
					factions: _,
					data: e
				});
			},
			addFactionRelation: function(e) {
				(function({ factionRelations: e, data: t }) {
					const n = Wa.safeParse(t);
					n.success ? e.push(n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					factionRelations: m,
					data: e
				});
			},
			itemInfoCreate: function(e) {
				(function({ iteminfos: e, data: t }) {
					const n = Ja.safeParse(t);
					if (n.success) {
						const t = n.data.type;
						t in e && console.log(`Iteminfo for itemtype with ID ${t} already exists! Overriding.`), e[t] = n.data;
					} else console.log(ma(t)), console.log(ma(n.error.issues));
				})({
					iteminfos: g,
					data: e
				});
			},
			typeCreate: function(e, t) {
				(function({ itemtypes: e, id: t, data: n }) {
					Ra({
						object: e,
						schema: Ka,
						name: "Itemtype",
						id: t,
						data: n
					});
				})({
					itemtypes: b,
					id: e,
					data: t
				});
			},
			createMaterial: function(e, t) {
				(function({ materials: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Qa,
						name: "Material",
						id: t,
						data: n
					});
				})({
					materials: y,
					id: e,
					data: t
				});
			},
			loadShrinkheadDropMap: function(e) {
				(function({ other: e, data: t }) {
					const n = Eo.safeParse(t);
					n.success ? (null !== e.shrinkheadDropMap && console.log("ShrinkheadDropMap has already been initialized. Overriding."), e.shrinkheadDropMap = n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					other: n,
					data: e
				});
			},
			createSkill: function(e) {
				(function({ skills: e, data: t }) {
					const n = To.safeParse(t);
					n.success ? e.push(n.data) : (console.log(ma(t)), console.log(ma(n.error.issues)));
				})({
					skills: v,
					data: e
				});
			},
			defineSpell: function(e, t) {
				(function({ spells: e, name: t, data: n }) {
					const r = Lo.safeParse(n);
					r.success ? (t in e && console.log(`Spell with name ${t} already exists! Overriding.`), r.data.name = t, e[t] = r.data) : (console.log(ma(n)), console.log(ma(r.error.issues)));
				})({
					spells: k,
					name: e,
					data: t
				});
			},
			addTokenBonus: function(e) {
				(function({ tokenBonuses: e, data: t }) {
					const n = zo.safeParse(t);
					if (n.success) {
						const r = t[0];
						r in e && console.log(`TokenBonus for ${r} already exists! Overriding.`), e[r] = n.data;
					} else console.log(ma(t)), console.log(ma(n.error.issues));
				})({
					tokenBonuses: S,
					data: e
				});
			},
			createTypification: function(e, t) {
				(function({ typifications: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: Po,
						name: "Typification",
						id: t,
						data: n
					});
				})({
					typifications: L,
					id: e,
					data: t
				});
			},
			addWeaponPool: function(e) {
				(function({ weaponPools: e, data: t }) {
					const n = Ro.safeParse(t);
					if (n.success) {
						const r = t.dbid;
						r in e && console.log(`WeaponPool with ID ${r} already exists! Overriding.`), e[r] = n.data;
					} else console.log(ma(t)), console.log(ma(n.error.issues));
				})({
					weaponPools: O,
					data: e
				});
			},
			addWorldObject: function(...e) {
				2 === e.length ? function({ worldobjects: e, id: t, data: n }) {
					Ra({
						object: e,
						schema: Fo,
						name: "Worldobject",
						id: t,
						data: n
					});
				}({
					worldobjects: z,
					id: e[0],
					data: e[1]
				}) : function({ worldobjects: e, data: t }) {
					const n = Io.safeParse(t);
					if (n.success) {
						const t = n.data[0];
						t in e && console.log(`Worldobject (array) with ID ${t} already exists! Overriding.`), e[t] = n.data;
					} else console.log(ma(t)), console.log(ma(n.error.issues));
				}({
					worldobjects: x,
					data: e
				});
			},
			surfGetID: function(e) {
				return e;
			},
			addMapPos: function(e) {},
			reserveEquipsets: function(e, t) {}
		}), P.global.set("quest", {
			reserveQuestType: function(e) {},
			createTaskCreature: function(e, t) {
				(function({ taskCreatures: e, id: t, data: n }) {
					Ra({
						object: e,
						schema: Oo,
						name: "TaskCreature",
						id: t,
						data: n
					});
				})({
					taskCreatures: E,
					id: e,
					data: t
				});
			},
			createTaskItem: function(e, t) {
				(function({ taskItems: e, id: t, data: n }) {
					Ra({
						object: e,
						schema: xo,
						name: "TaskItem",
						id: t,
						data: n
					});
				})({
					taskItems: T,
					id: e,
					data: t
				});
			},
			createQuest: function(e, t) {
				(function({ quests: e, id: t, data: n }) {
					Ta({
						object: e,
						schema: ko,
						name: "Quest",
						id: t,
						data: n
					});
				})({
					quests: w,
					id: e,
					data: t
				});
			},
			setScript: function() {}
		});
		try {
			for (const t of e) await P.doString(t);
		} finally {
			P.global.close();
		}
		return {
			balance: t,
			blueprints: r,
			blueprintsets: a,
			bonuses: o,
			bonusgroups: i,
			creatureBonuses: s,
			creatureBlueprintRelations: u,
			creatureInfos: l,
			creatureSkills: c,
			creatures: d,
			droplists: p,
			droppatterns: h,
			equipsets: f,
			factionRelations: m,
			factions: _,
			iteminfos: g,
			itemtypes: b,
			materials: y,
			quests: w,
			shrinkheadDropMap: n.shrinkheadDropMap,
			skills: v,
			taskCreatures: E,
			taskItems: T,
			tokenBonuses: S,
			typifications: L,
			weaponPools: O,
			worldobjectArrays: x,
			worldobjects: z,
			globalResPairs: null
		};
	}
	function Mo(e) {
		const t = function(e) {
			const t = new TextDecoder(), n = new TextDecoder("utf-16le");
			let r = 0;
			const a = new DataView(e, 0);
			return {
				getCurrentIndex: function() {
					return r;
				},
				getByteLength: function() {
					return a.byteLength;
				},
				getUint16: function() {
					const e = a.getUint16(r, !0);
					return r += 2, e;
				},
				getUint32: function() {
					const e = a.getUint32(r, !0);
					return r += 4, e;
				},
				getString8: function(n) {
					const a = new DataView(e, r, n);
					return r += n, t.decode(a);
				},
				getString16: function(t) {
					t *= 2;
					const a = new DataView(e, r, t);
					return r += t, n.decode(a);
				},
				getCompressedData: function(t) {
					const n = e.slice(r, r + t);
					return r += t, n;
				}
			};
		}(e), n = t.getString8(4), r = t.getUint32();
		if ("L10C" !== n || 257 !== r && 258 !== r) throw new Error(`Binary format version ${n} ${r} is not supported!`);
		{
			const e = t.getUint32(), a = t.getUint32(), o = [];
			for (let n = 0; n < e; n++) {
				const e = t.getUint32();
				o.push(e);
			}
			const i = [];
			for (let n = 0; n < a; n++) {
				const e = t.getUint32(), n = t.getUint32(), r = t.getUint32();
				i.push({
					hash: e,
					offset: n,
					length: r
				});
			}
			const s = t.getUint32(), u = [];
			for (let n = 0; n < s; n++) {
				const e = t.getUint16(), n = t.getUint16(), r = t.getString16(1);
				t.getUint16(), u.push({
					indexOfLeftNode: e,
					indexOfRightNode: n,
					character: r
				});
			}
			const l = t.getByteLength() - t.getCurrentIndex();
			return {
				version1: n,
				version2: r,
				hashList: o,
				descriptorTable: i,
				huffmanTable: u,
				compressedData: t.getCompressedData(l)
			};
		}
	}
	function No(e, t) {
		const n = new Uint8Array(e);
		let r = t >>> 3, a = t % 8;
		return { isNextBitZero: function() {
			const e = function(e, t) {
				return !(e & 1 << t);
			}(n[r], a);
			return a += 1, 8 === a && (r += 1, a = 0), e;
		} };
	}
	function Do(e, t, n, r) {
		const a = No(t, n), o = [];
		for (; o.length < r;) {
			let t = 0;
			for (;;) {
				const n = e[t];
				if ("\0" !== n.character) {
					o.push(n.character);
					break;
				}
				t = a.isNextBitZero() ? n.indexOfLeftNode : n.indexOfRightNode;
			}
		}
		return o.join("");
	}
	var Co = [
		"scripts/shared/itemtype.txt",
		"scripts/shared/creatureinfo.txt",
		"scripts/shared/iteminfo.txt",
		"scripts/shared/spells.txt",
		"scripts/shared/material.txt",
		"scripts/shared/typification.txt",
		"scripts/server/blueprint.txt",
		"scripts/server/balance.txt",
		"scripts/server/creatures.txt",
		"scripts/server/faction.txt",
		"scripts/server/weaponpool.txt",
		"scripts/server/drop.txt",
		"scripts/server/equipsets.txt",
		"scripts/server/quest.txt",
		"scripts/server/worldobjects.txt"
	], jo = ["locale/en_UK/global.res"];
	async function $o(e, t, n) {
		for (const r of t) {
			const t = r.split("/");
			for (let r = 0; r < t.length; r++) {
				const a = t[r], o = t.slice(0, r).join("/"), i = "" === o ? a : `${o}/${a}`;
				if (i in e) continue;
				const s = e[o];
				if (r === t.length - 1) {
					n("Initiate getFileHandle on:", i);
					const t = await s.getFileHandle(a);
					n("  Completed getFileHandle on:", i), e[i] = t;
				} else {
					n("Initiate getDirectoryHandle on:", i);
					const t = await s.getDirectoryHandle(a);
					n("  Completed getDirectoryHandle on:", i), e[i] = t;
				}
			}
		}
	}
	async function Uo(e, t) {
		const n = await async function(e, t) {
			const n = Object.create(null);
			return n[""] = e, await $o(n, Co, t), await $o(n, jo, t), n;
		}(e, t), [r, a] = await Promise.all([Promise.all(Co.map((e) => async function(e, t, n) {
			n("Initiate getFile on:", e);
			const r = await t.getFile();
			n("  Completed getFile on:", e), n("Initiate read as text on:", e);
			const a = await r.text();
			return n("  Completed read as text on:", e), a;
		}(e, n[e], t))), Promise.all(jo.map((e) => async function(e, t, n) {
			n("Initiate getFile on:", e);
			const r = await t.getFile();
			n("  Completed getFile on:", e), n("Initiate read as ArrayBuffer on:", e);
			const a = await r.arrayBuffer();
			return n("  Completed read as ArrayBuffer on:", e), a;
		}(e, n[e], t)))]);
		t("Initiate Lua parse");
		const o = await Ao(r);
		t("  Completed Lua parse"), t("Initiate global.res decode");
		const i = function(e) {
			const t = Mo(e);
			return t.descriptorTable.map((e) => ({
				hash: e.hash,
				text: Do(t.huffmanTable, t.compressedData, e.offset, e.length)
			}));
		}(a[0]);
		return t("  Completed global.res decode"), o.globalResPairs = i, t("ALL DONE"), o;
	}
	self.onmessage = async (e) => {
		try {
			const { directoryHandle: t } = e.data, n = await Uo(t, console.log), r = JSON.stringify(n), a = new Blob([r], { type: "application/json" });
			self.postMessage({
				success: !0,
				label: t.name,
				blob: a
			});
		} catch (t) {
			console.error(t), self.postMessage({
				success: !1,
				error: {
					name: t.name,
					message: t.message
				}
			});
		}
	};
})();
