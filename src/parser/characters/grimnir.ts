import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Grimnir move.
 * Standard character — no stances or installs.
 *
 * Note: Gale Dash (wc.XU) is a whirlwind cancel move stored as an
 * individual entry in the data asset — no special handling needed here.
 */
export function resolveGrimnir(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
