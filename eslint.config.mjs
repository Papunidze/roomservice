import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const FEATURES = [
  "assistant",
  "auth",
  "billing",
  "bookings",
  "channels",
  "clients",
  "dashboard",
  "marketing",
  "messages",
  "onboarding",
  "services",
  "settings",
  "site",
  "staff",
];

const NESTING_LEVELS = [1, 2, 3, 4];

const DEEP_IMPORT = [
  "@/features/*/*",
  "@/features/*/**",
  "**/features/*/*",
  "**/features/*/**",
];

const DEEP_IMPORT_MESSAGE =
  "Reach another feature only through its public API: `@/features/<name>`.";

const ESCAPE_MESSAGE =
  "Relative imports must stay inside the feature. Use `@/features/<name>` or `@/shared/...`.";

const SHARED_IMPORT_MESSAGE =
  "shared/ must not depend on features/. Dependencies point one way: features -> shared.";

const restrict = (patterns) => ({
  "no-restricted-imports": ["error", { patterns }],
});

const featureRules = FEATURES.flatMap((feature) =>
  NESTING_LEVELS.map((level) => {
    const up = "../".repeat(level);
    return {
      files: [
        `features/${feature}/${"*/".repeat(level - 1)}*.ts`,
        `features/${feature}/${"*/".repeat(level - 1)}*.tsx`,
      ],
      rules: restrict([
        {
          group: [
            ...DEEP_IMPORT,
            `!@/features/${feature}/*`,
            `!@/features/${feature}/**`,
          ],
          message: DEEP_IMPORT_MESSAGE,
        },
        {
          group: [`${up}*`, `${up}**`],
          message: ESCAPE_MESSAGE,
        },
      ]),
    };
  }),
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "supabase/**",
  ]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["shared/**/*.ts", "shared/**/*.tsx"],
    rules: restrict([
      {
        group: [
          "@/features",
          "@/features/*",
          "@/features/**",
          "**/features/*",
          "**/features/**",
        ],
        message: SHARED_IMPORT_MESSAGE,
      },
    ]),
  },
  {
    files: ["app/**/*.ts", "app/**/*.tsx"],
    rules: restrict([{ group: DEEP_IMPORT, message: DEEP_IMPORT_MESSAGE }]),
  },
  ...featureRules,
  prettier,
]);

export default eslintConfig;
