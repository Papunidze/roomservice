import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

const COST: Required<Pick<ScryptOptions, "N" | "r" | "p">> = {
  N: 65536,
  r: 8,
  p: 1,
};

const KEY_BYTES = 64;
const SALT_BYTES = 16;

function memoryFor(cost: typeof COST) {
  return 256 * cost.N * cost.r;
}

function derive(
  password: string,
  salt: Buffer,
  keyBytes: number,
  cost: typeof COST,
) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      keyBytes,
      { ...cost, maxmem: memoryFor(cost) },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, KEY_BYTES, COST);

  return [
    "scrypt",
    COST.N,
    COST.r,
    COST.p,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, n, r, p, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !n || !r || !p || !salt || !key) return false;

  const expected = Buffer.from(key, "base64");
  const actual = await derive(
    password,
    Buffer.from(salt, "base64"),
    expected.length,
    {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    },
  );

  return timingSafeEqual(actual, expected);
}
