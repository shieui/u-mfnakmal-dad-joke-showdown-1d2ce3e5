// Dad Joke Showdown — writes one original dad joke to /output/entry.txt.
// Pure Node stdlib only: no network, no child processes, no external files.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "I started a band called 1023 Megabytes. We never got a gig — turns out nobody wants to hear a bunch of kilobytes trying to make it big.";

const OUT_PATH = "/output/entry.txt";

function validate(joke: string): void {
  if (joke.length < 1 || joke.length > 200) {
    throw new Error(`joke must be 1-200 characters, got ${joke.length}`);
  }
  if (joke.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  if (joke.includes("\n") || joke.includes("\r")) {
    throw new Error("joke must be a single line");
  }
  if (joke.endsWith("\n")) {
    throw new Error("joke must not end with a newline");
  }
  // Reject control characters (other than the line breaks already refused):
  // the gate reads the file as UTF-8 text, so nothing invisible may sneak in.
  for (const ch of joke) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(`joke contains a control character U+${code.toString(16).padStart(4, "0")}`);
    }
  }
}

validate(JOKE);
mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JOKE, "utf8");

// Verify the write round-trips: read the file back and confirm it matches
// the joke byte-for-byte before declaring success.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== JOKE) {
  throw new Error("verification failed: /output/entry.txt does not match the joke");
}
validate(written);
