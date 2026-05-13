import {
    type Move,
    type MoveResult,
    extractStrength,
    extractState,
    resolveBest,
    selectVariants,
} from "../utils";

export type NarmayaData = {
    genji: Move[];
    kagura: Move[];
};

/**
 * Strips a bare g/k prefix immediately followed by a digit (e.g. "g2H", "k5L")
 * and returns the identified state and the remaining input.
 * This handles compact notation that extractState cannot catch since it requires
 * a space delimiter.
 */
function preprocessStance(input: string): { hint: string | null; input: string } {
    const match = input.match(/^(g|k)(?=\d)/i);
    if (!match) return { hint: null, input };
    const hint = match[1].toLowerCase() === "g" ? "genji" : "kagura";
    return { hint, input: input.slice(match[1].length) };
}

/**
 * Resolves a user input string to a Narmaya move.
 *
 * Narmaya has two exclusive stances:
 *   - genji   (g): Genji Asura style — Setsuna, Transient, Absolute Horizon
 *   - kagura  (k): Kagura Asura style — Kyokasuigetsu, Crescent Moon, Mugenkagura
 *
 * Shared moves (normals, supers, BC, throws) are present in both pools.
 *
 * State resolution order:
 *   1. Explicit keyword ("kagura 2M", "genji 236H")
 *   2. Compact prefix directly before a digit ("k5L", "g2H")
 *   3. Alias state hint ("flip" -> kagura 214)
 *   4. No state — search both pools, return highest-confidence match
 */
export function resolveNarmaya(input: string, data: NarmayaData): MoveResult | null {
    // Step 1: check for compact g/k prefix before a digit
    const { hint, input: preprocessed } = preprocessStance(input);

    // Step 2: check for explicit state keyword
    const { state: explicitState, cleanInput: afterState } = extractState(preprocessed, [
        "genji", "g",
        "kagura", "k",
    ]);

    // Explicit keyword wins over preprocessed hint
    const state = explicitState ?? hint;

    const { strength, cleanInput } = extractStrength(afterState);

    if (state === "genji" || state === "g") {
        const result = resolveBest(data.genji, cleanInput);
        if (!result) return null;
        return { ...result, state: "genji", variants: selectVariants(result.match, strength) };
    }

    if (state === "kagura" || state === "k") {
        const result = resolveBest(data.kagura, cleanInput);
        if (!result) return null;
        return { ...result, state: "kagura", variants: selectVariants(result.match, strength) };
    }

    // No state — search both pools, return highest-confidence match
    const genjiResult  = resolveBest(data.genji,  cleanInput);
    const kaguraResult = resolveBest(data.kagura, cleanInput);

    if (!genjiResult && !kaguraResult) return null;

    const best =
        !genjiResult  ? { ...kaguraResult!, state: "kagura" } :
        !kaguraResult ? { ...genjiResult!,  state: "genji"  } :
        genjiResult.confidence >= kaguraResult.confidence
            ? { ...genjiResult,  state: "genji"  }
            : { ...kaguraResult, state: "kagura" };

    return { ...best, variants: selectVariants(best.match, strength) };
}
