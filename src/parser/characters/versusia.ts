import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Versusia move.
 * Standard character — no stances or installs.
 *
 * Celestial Strike (cd.5U) is a charged-state variant stored as
 * an individual named entry in the data asset.
 */
export function resolveVersusia(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
