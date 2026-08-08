import object from '@rbxts/object-utils';
import { useMotion, usePrevious } from '@rbxts/pretty-react-hooks';
import { type Binding, useEffect } from '@rbxts/react';
import type { FromStateDependent, IconState, StateDependent } from '../components/icon';
import { stateful } from '../utilities/resolve-state-dependent';
import { springs } from '../utilities/springs';

type Result<T extends Record<string, StateDependent<unknown>>, K extends keyof T> = ExcludeMembers<
	{
		[P in keyof T]: P extends K ? Binding<NonNullable<FromStateDependent<T[P]>>> : undefined;
	},
	undefined
>;

export function useAnimateableProps<T extends Record<string, StateDependent<unknown>>, K extends keyof T>(
	state: IconState,
	props: T,
	...keys: K[]
) {
	const previousProps = usePrevious(props);
	const motions: LuaTuple<[Binding<unknown>, unknown]>[] = [];

	for (const key of keys) motions.push(useMotion(stateful(props[key], state) as never) as never);

	useEffect(() => {
		for (const key of keys) {
			const value = stateful(props[key], state);
			const previousValue = stateful(previousProps, state);
			if (value === previousValue) continue;

			(motions[keys.indexOf(key)][1] as { spring: (goal: unknown, opts?: object) => void }).spring(
				value,
				springs.responsive
			);
		}
	}, [props]);

	return object.fromEntries(keys.map((key) => [key, motions[keys.indexOf(key)][0]])) as Result<T, K>;
}
