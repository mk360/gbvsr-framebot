// ─── Types ────────────────────────────────────────────────────────────────────

export type Strength = "L" | "M" | "H" | "U";

export type MoveData = {
    damage: string;
    guard: string;
    startup: string;
    active: string;
    recovery: string;
    onBlock: string;
    onHit: string;
    onCH: string;
    meter: string;
    images: string[];
    hitboxes: string[];
    type: string;
};

export type Variant = {
    data: MoveData;
    followups?: Move[];
};

export type Move = {
    canonicalName: string;
    aliases: string[];
    variants: Partial<Record<string, Variant>>;
};

export type MoveResult = {
    match: Move;
    confidence: number;
    matchedAlias: string;
    variants: Partial<Record<string, Variant>>;
    state?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const THRESHOLD = 0.5;

// ─── Levenshtein ──────────────────────────────────────────────────────────────

export function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

// ─── Normalization ────────────────────────────────────────────────────────────

export function normalize(str: string): string {
    return str.toLowerCase().replace(/[\s\-_.]/g, "");
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export function score(input: string, alias: string): number {
    const a = normalize(input);
    const b = normalize(alias);
    if (!a.length || !b.length) return 0;
    const exactMatch = +(a === b);
    const substring = a.includes(b) || b.includes(a) ? 0.8 : 0;
    const distance = levenshtein(a, b);
    const confidence = 1 - distance / Math.max(a.length, b.length);
    return Math.max(exactMatch, substring, confidence);
}

// ─── Strength extraction ──────────────────────────────────────────────────────

export function extractStrength(input: string): { strength: Strength | null; cleanInput: string } {
    const normalized = input.trim();
    const pattern = /^(L|M|H|U)\s+|\s+(L|M|H|U)$|(?<=[0-9])(L|M|H|U)$/i;
    const match = normalized.match(pattern);
    if (!match) return { strength: null, cleanInput: normalized };
    const strength = (match[1] ?? match[2] ?? match[3]).toUpperCase() as Strength;
    const cleanInput = normalized.replace(pattern, "").trim();
    return { strength, cleanInput };
}

// ─── State extraction ─────────────────────────────────────────────────────────

export function extractState(
    input: string,
    validStates: string[]
): { state: string | null; cleanInput: string } {
    const normalized = input.trim();

    for (const state of validStates) {
        const startPattern = new RegExp(`^(${state})\\s+`, "i");
        const endPattern = new RegExp(`\\s+(${state})$`, "i");
        const startMatch = normalized.match(startPattern);
        const endMatch = normalized.match(endPattern);
        if (startMatch ?? endMatch) {
            const matched = startMatch ?? endMatch!;
            return {
                state,
                cleanInput: normalized.replace(matched[0], "").trim(),
            };
        }
    }

    return { state: null, cleanInput: normalized };
}

// ─── Core fuzzy resolver ──────────────────────────────────────────────────────

export function resolveBest(moves: Move[], input: string): Omit<MoveResult, "variants" | "state"> | null {
    let bestCandidate: { move: Move; alias: string; s: number } | null = null;

    for (const move of moves) {
        for (const alias of move.aliases) {
            const s = score(input, alias);
            if (s >= THRESHOLD && (!bestCandidate || s > bestCandidate.s)) {
                bestCandidate = { move, alias, s };
            }
        }
    }

    if (!bestCandidate) return null;

    return {
        match: bestCandidate.move,
        confidence: bestCandidate.s,
        matchedAlias: bestCandidate.alias,
    };
}

// ─── Variant selection ────────────────────────────────────────────────────────

export function selectVariants(
    move: Move,
    strength: Strength | null
): Partial<Record<string, Variant>> {
    if (strength) {
        const v = move.variants[strength];
        return v ? { [strength]: v } : {};
    }
    return move.variants;
}
