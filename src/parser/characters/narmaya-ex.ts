import {
    type Move,
    type MoveResult,
    extractStrength,
    resolveBest,
    selectVariants,
} from "../utils";

/**
 * Resolves a user input string to a Narmaya (EX) move.
 *
 * EX Narmaya has a flat moveset — no stance selection at parse time.
 * Her normals each individually correspond to a specific base Narmaya stance
 * (e.g. 2M -> Genji, 2H -> Kagura), but that mapping is handled by the caller
 * as an intermediate step. Her EX specials (Iridescent Bloom, Fuuka,
 * Apex of Nothingness) are baked directly into the data asset.
 */
export function resolveNarmayaEX(input: string, data: Move[]): MoveResult | null {
    const { strength, cleanInput } = extractStrength(input);
    const result = resolveBest(data, cleanInput);
    if (!result) return null;
    return { ...result, variants: selectVariants(result.match, strength) };
}
