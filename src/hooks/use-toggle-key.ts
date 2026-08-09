import { useEffect } from '@rbxts/react';
import { UserInputService } from '@rbxts/services';

/**
 * Calls `callback` whenever the given `keycode` is pressed.
 *
 * Listens on `UserInputService.InputBegan` and ignores game-processed input.
 */
export function useToggleKey(keycode: Enum.KeyCode, callback: () => void) {
	useEffect(() => {
		const connection = UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) return;
			if (input.KeyCode === keycode) callback();
		});

		return () => connection.Disconnect();
	}, [keycode]);
}
