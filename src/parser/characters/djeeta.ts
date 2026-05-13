import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type DjeetaData = {
    normal: Move[];
    install: Move[];
};

/**
 * Resolves a user input string to a Djeeta move.
 *
 * Djeeta has two states:
 *   - normal:  base moveset
 *   - install: Another Blade (ab.) stock active — moves like "Reginleiv: Recidive"
 *              become available, and the 5U/5[U] change properties
 *
 * State is extracted from the input (e.g. "install 236H", "ab 236H").
 * If no state is specified, normal is assumed.
 */
export function resolveDjeeta(input: string, data: DjeetaData): MoveResult | null {
    const { state, cleanInput: afterState } = extractState(input, ["install", "ab"]);
    const { strength, cleanInput } = extractStrength(afterState);

    const pool = state === "install" || state === "ab" ? data.install : data.normal;
    const result = resolveBest(pool, cleanInput);
    if (!result) return null;

    return {
        ...result,
        state: state ? "install" : "normal",
        variants: selectVariants(result.match, strength),
    };
}
