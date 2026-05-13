import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Katalina move.
 * Standard character — no stances or installs.
 */
export function resolveKatalina(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
