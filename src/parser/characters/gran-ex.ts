import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Gran (EX) move.
 *
 * Gran EX has no stances or installs. His EX moves (Reginleiv, Decimate,
 * Armor Break, Overdrive Surge) replace the base equivalents and are baked
 * into the transformed data asset — the parser itself is identical to Gran.
 */
export function resolveGranEX(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
