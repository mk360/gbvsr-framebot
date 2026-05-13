import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Gran move.
 *
 * Gran is a standard character with no stances or installs.
 * Resolution order:
 *   1. Extract strength modifier from input (e.g. "H", "236H")
 *   2. Fuzzy match the cleaned input against all move aliases
 *   3. Return the best match with selected variants
 *
 * @param input - Raw user input, e.g. "236H", "H reginleiv", "rising sword"
 * @param data  - Gran's transformed move array (static asset)
 */
export function resolveGran(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;

    return {
        ...result,
        variants: selectVariants(result.match, strength),
    };
}
