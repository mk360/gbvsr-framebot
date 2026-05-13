import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type MegData = {
    normal: Move[];
    minion: Move[];
};

/**
 * Resolves a user input string to a Meg move.
 *
 * Meg has two states:
 *   - normal: base moveset
 *   - minion: Shark (m.) is active — Fire! (m.5U) becomes available on top
 *             of the base moveset
 *
 * State is extracted from the input (e.g. "minion 22H", "shark 22H").
 * If no state is specified, normal is assumed.
 */
export function resolveMeg(input: string, data: MegData): MoveResult | null {
    const { state, cleanInput: afterState } = extractState(input, ["minion", "shark"]);
    const { strength, cleanInput } = extractStrength(afterState);

    const pool = state ? data.minion : data.normal;
    const result = resolveBest(pool, cleanInput);
    if (!result) return null;

    return {
        ...result,
        state: state ?? "normal",
        variants: selectVariants(result.match, strength),
    };
}
