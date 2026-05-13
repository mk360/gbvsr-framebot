import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to an Ilsa move.
 * Standard character — no stances or installs.
 *
 * Note: Ilsa's 214 rekka has per-strength followups (Gunfire Waltz,
 * Raid of Honor, Shadow Eaters, Burst Remover) stored on each variant
 * in the data asset.
 */
export function resolveIlsa(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
