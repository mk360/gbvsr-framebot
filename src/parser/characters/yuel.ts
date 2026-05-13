import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type YuelData = {
    normal: Move[];
    dance: Move[];
};

/**
 * Resolves a user input string to a Yuel move.
 *
 * Yuel has two states:
 *   - normal: base moveset
 *   - dance:  Third Dance (td.) active — base moves remain available plus
 *             exclusive stance moves (Gurren, Yugetsu, Eye of the Sparrow, etc.)
 *
 * State is extracted from the input (e.g. "dance 236H", "td 5H").
 * If no state is specified, normal is assumed.
 */
export function resolveYuel(input: string, data: YuelData): MoveResult | null {
    const { state, cleanInput: afterState } = extractState(input, ["dance", "td", "third dance", "stance"]);
    const { strength, cleanInput } = extractStrength(afterState);

    const pool = state ? data.dance : data.normal;
    const result = resolveBest(pool, cleanInput);
    if (!result) return null;

    return {
        ...result,
        state: state ? "dance" : "normal",
        variants: selectVariants(result.match, strength),
    };
}
