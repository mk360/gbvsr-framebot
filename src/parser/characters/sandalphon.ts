import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Sandalphon move.
 * Standard character — no stances or installs.
 *
 * His elemental 236 variants (wa./fi./wi./ea. prefixes for Gabriel's Water,
 * Michael's Flame, Raphael's Gale, Uriel's Earth) are stored as individual
 * named entries in the data asset and resolve by move name or alias.
 */
export function resolveSandalphon(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
