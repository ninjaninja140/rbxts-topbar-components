import object from '@rbxts/object-utils';
import { useMotion, usePrevious } from '@rbxts/pretty-react-hooks';
import { type Binding, useEffect } from '@rbxts/react';
import type { Motion, MotionGoal } from '@rbxts/ripple';
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
	const previousState = usePrevious(state);
	const motionBindings: Binding<MotionGoal>[] = [];
	const motionControls: Motion<MotionGoal>[] = [];

	for (const key of keys) {
		const [binding, motion] = useMotion(stateful(props[key], state) as MotionGoal);
		motionBindings.push(binding);
		motionControls.push(motion);
	}

	useEffect(() => {
		for (let i = 0; i < keys.size(); i++) {
			const key = keys[i];
			const value = stateful(props[key], state);
			const previousValue = previousProps && previousState !== undefined ? stateful(previousProps[key], previousState) : undefined;
			if (value === previousValue) continue;

			motionControls[i].spring(value as MotionGoal, springs.responsive);
		}
	}, [props, state]);

	return object.fromEntries(keys.map((key, i) => [key, motionBindings[i]])) as Result<T, K>;
}
