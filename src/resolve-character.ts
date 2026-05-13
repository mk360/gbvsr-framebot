interface Character {
    name: string;
    aliases: string[];
}

const ROSTER: Character[] = [
    {
        name: "2B",
        aliases: ["clanker", "twobee"]
    },
    {
        name: "Anila",
        aliases: ["sheep"]
    },
    {
        name: "Anre",
        aliases: ["pringles", "mustache", "how about that"]
    },
    {
        name: "Avatar Belial",
        aliases: ["Abel"]
    },
    {
        name: "Beelzebub",
        aliases: ["bubz"]
    },
    {
        name: "Beatrix",
    },
    {
        name: "Belial",
    },
    {
        name: "Charlotta",
        aliases: ["lotta", "potat"]
    },
    {
        name: "Djeeta",
        aliases: ["vedjeeta", "djeets"]
    },
    {
        name: "Djeeta (EX)",
        aliases: ["djex"]
    },
    {
        name: "Eustace",
    },
    {
        name: "Ferry"
    },
    {
        name: "Galleon"
    },
    {
        name: "Gran"
    },
    {
        name: "Gran (EX)",
        aliases: ["gex"]
    },
    {
        name: "Grimnir",
    },
    {
        name: "Ilsa"
    },
    {
        name: "Katalina",
        aliases: ["oneesama"]
    },
    {
        name: "Ladiva"
    },
    {
        name: "Lancelot",
    },
    {
        name: "Lowain",
    },
    {
        name: "Lucilius",
    },
    {
        name: "Meg"
    },
    {
        name: "Metera"
    },
    {
        name: "Narmaya",
        aliases: ["Narm"]
    },
    {
        name: "Narmaya (EX)",
        aliases: ["EX narm", "narm ex", "ex narmaya", "narmaya ex"]
    },
    {
        name: "Nier"
    },
    {
        name: "Percival",
        aliases: ["percy"]
    },
    {
        name: "Sandalphon",
        aliases: ["sandy"]
    },
    {
        name: "Seox",
        aliases: ["six"]
    },
    {
        name: "Siegfried",
        aliases: ["midfried"]
    },
    {
        name: "Soriz"
    },
    {
        name: "Vane"
    },
    {
        name: "Vaseraga",
        aliases: ["Vas"]
    },
    {
        name: "Versusia"
    },
    {
        name: "Vikala",
        aliases: ["rat"]
    },
    {
        name: "Vira",
    },
    {
        name: "Wilnas"
    },
    {
        name: "Yuel",
        aliases: ["yool", "yipper"]
    },
    {
        name: "Zeta"
    },
    {
        name: "Zooey",
        aliases: ["zoi"]
    }
].map((i) => ({
    ...i,
    aliases: [i.name.toLowerCase()].concat(i.aliases?.map((i) => i.toLowerCase()) ?? [])
}));

const THRESHOLD = 0.5;

// find nearest match, allowing for fuzzy strings and multiple aliases
function resolveCharacter(input: string) {
    var match: { alias: string, character: string, compositeScore: number }[] = [];

    for (let character of ROSTER) {
        const proximity = character.aliases.map((alias) =>{
            let exactMatch = +(alias === input.toLowerCase());
            let substring = alias.includes(input.toLowerCase()) ? 0.8 : 0;
            const score = levenshtein(input, alias);
            const confidence = 1 - (score / Math.max(input.length, alias.length));
            const compositeScore = Math.max(exactMatch, substring, confidence);
            return {
                alias,
                character: character.name,
                compositeScore
            }
        }).sort((a, b) => b.compositeScore - a.compositeScore)[0];

        if (proximity?.compositeScore >= THRESHOLD) {
            match.push(proximity);
        }
    }

    if (match.length) {
        return match.sort((a, b) => b.compositeScore - a.compositeScore)[0].character ?? null;
    }

    return null
};

function levenshtein(input: string, target: string): number {
  const m = input.length;
  const n = target.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (input[i - 1] === target[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export default resolveCharacter;
