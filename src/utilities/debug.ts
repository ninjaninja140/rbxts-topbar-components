export function debugLog(...messages: unknown[]) {
	if ((_G as Record<string, unknown>).__DEBUG__) print(`[DEBUG]`, ...messages);
}
