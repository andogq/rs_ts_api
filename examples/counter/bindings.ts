import type { Stream } from "@qubit-rs/client";

export type Server = { increment: () => Promise<null>, decrement: () => Promise<null>, add: (n: number) => Promise<null>, get: () => Promise<number>, countdown: () => Stream<number> };