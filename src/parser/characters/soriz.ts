import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Soriz move.
 * Standard character — no stances or installs.
 *
 * Muscle Up (mu.) state moves (Bravado Bullet, Tenacious Will,
 * Way of the Fundoshi Fist) are stored as individual named entries
 * in the data asset and resolve by move name or alias.
 */
export function resolveSoriz(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
