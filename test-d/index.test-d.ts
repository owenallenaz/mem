import {expectType} from 'tsd';
import mem = require('../dist');

const fn = (_string: string) => true;

expectType<typeof fn>(mem(fn));
expectType<typeof fn>(mem(fn, {maxAge: 1}));
expectType<typeof fn>(mem(fn, {cacheKey: (...arguments_) => arguments_}));
expectType<typeof fn>(
	mem(
		fn,
		{
			cacheKey: arguments_ => arguments_[0],
			cache: new Map<string, {data: boolean; maxAge: number}>()
		}
	)
);
expectType<typeof fn>(
	mem(fn, {cache: new Map<string, {data: boolean; maxAge: number}>()})
);

// Testing that the full cache object works with type inference
function objectFnReturnsNumber(_args: {key: string}) {
	return 10;
}

expectType<typeof objectFnReturnsNumber>(
	mem(
		objectFnReturnsNumber,
		{
			cacheKey: (_args: [{key: string}]) => {
				return new Date();
			},
			cache: {
				get: (_key: Date) => {
					return {
						data: 5,
						maxAge: 2
					};
				},
				set: (_key: Date, _value: { data: number; maxAge: number }) => {},
				has: (_key: Date) => {
					return true;
				},
				delete: (_key: Date) => {},
				clear: () => {}
			}
		}
	)
);

/* Overloaded function tests */
function overloadedFn(parameter: false): false;
function overloadedFn(parameter: true): true;
function overloadedFn(parameter: boolean): boolean {
	return parameter;
}

expectType<typeof overloadedFn>(mem(overloadedFn));
expectType<true>(mem(overloadedFn)(true));
expectType<false>(mem(overloadedFn)(false));

mem.clear(fn);

// CacheKey tests.
// The argument should match the memoized function’s parameters
mem((text: string) => Boolean(text), {
	cacheKey: arguments_ => {
		// @ts-expect-error #50
		expectType<[string]>(arguments_);
	}
});

mem(() => 1, {
	cacheKey: arguments_ => {
		// @ts-expect-error #50
		expectType<[]>(arguments_);
	}
});
