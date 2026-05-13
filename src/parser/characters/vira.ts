import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type ViraData = {
    normal: Move[];
    install: Move[];
};

/**
 * Resolves a user input string to a Vira move.
 *
 * Vira has two states:
 *   - normal:  base moveset
 *   - install: Luminiera (lu.) active — same motions with different properties,
 *              plus exclusive moves (Graceview, Air Dash, directional options)
 *
 * State is extracted from the input (e.g. "install 236H", "luminiera 214L").
 * If no state is specified, normal is assumed.
 */
export function resolveVira(input: string, data: ViraData): MoveResult | null {
    const { state, cleanInput: afterState } = extractState(input, ["install", "luminiera", "lu"]);
    const { strength, cleanInput } = extractStrength(afterState);

    const pool = state ? data.install : data.normal;
    const result = resolveBest(pool, cleanInput);
    if (!result) return null;

    return {
        ...result,
        state: state ? "install" : "normal",
        variants: selectVariants(result.match, strength),
    };
}
