import { useEffect, useState } from '@rbxts/react';
import { Players, VoiceChatService } from '@rbxts/services';

export function useVoicechatEnabled() {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		Promise.try(() => VoiceChatService.IsVoiceEnabledForUserIdAsync(Players.LocalPlayer.User)).andThen(setEnabled);
	}, []);

	return enabled;
}
