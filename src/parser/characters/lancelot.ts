import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Lancelot move.
 * Standard character — no stances or installs.
 *
 * Note: Lancelot's 214 Southern Cross has deep per-strength chain followups
 * (214X~4X, 214X~4X~4X, 214H~4H~4H~4H, etc.) and his 5U has directional
 * followups (Cross Over, Feint, Jump, Quick Stop). All are stored as
 * individual entries in the data asset.
 */
export function resolveLancelot(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
