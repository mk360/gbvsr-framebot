import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type NierData = {
    normal: Move[];
    death: Move[];
};

/**
 * Resolves a user input string to a Nier move.
 *
 * Nier has two states:
 *   - normal: base moveset
 *   - death:  Doll (d.) active — normals and some specials change properties
 *
 * State is extracted from the input (e.g. "death 2H", "doll 236H").
 * If no state is specified, normal is assumed.
 */
export function resolveNier(input: string, data: NierData): MoveResult | null {
    const { state, cleanInput: afterState } = extractState(input, ["death", "doll", "d"]);
    const { strength, cleanInput } = extractStrength(afterState);

    const pool = state ? data.death : data.normal;
    const result = resolveBest(pool, cleanInput);
    if (!result) return null;

    return {
        ...result,
        state: state ? "death" : "normal",
        variants: selectVariants(result.match, strength),
    };
}
