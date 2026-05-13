import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type DjeetaEXData = {
    normal: Move[];
    install: Move[];
};

/**
 * Resolves a user input string to a Djeeta (EX) move.
 *
 * Djeeta EX has two states:
 *   - normal:  full base moveset with EX specials (Reginleiv, Aurum Flow,
 *              Rising Sword, Overdrive Surge) replacing the base versions
 *   - install: Another Blade (ab.) stock active — Reginleiv becomes
 *              Reginleiv: Recidive, with improved properties
 *
 * State is extracted from the input (e.g. "install 236H", "ab 236H").
 * If no state is specified, normal is assumed.
 */
export function resolveDjeetaEX(input: string, data: DjeetaEXData): MoveResult | null {
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
