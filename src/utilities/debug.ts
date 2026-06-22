/**
 * Logs a debug message to the console only when `_G.__DEBUG__` is truthy.
 * No-op in production — stripped at the call site when debug is off.
 */
export function debugLog(...messages: unknown[]) {
	if ((_G as Record<string, unknown>).__DEBUG__) {
		print(`[DEBUG]`, ...messages);
	}
}
