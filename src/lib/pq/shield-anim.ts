/** ASCII shield + sword frames. Same geometry as logo-pqfreebsd.4th. */

export const LOGO_W = 23;
export const LOGO_H = 16;
export const CX = 11;

export const COL = {
  dim: 0,
  steel: 1,
  sage: 2,
  gleam: 3,
  hilt: 4,
} as const;

export type Cell = { ch: string; c: number };
export type Frame = Cell[][];

const ANSI: Record<number, string> = {
  0: "\x1b[2;90m",
  1: "\x1b[0;37m",
  2: "\x1b[0;32m",
  3: "\x1b[1;97m",
  4: "\x1b[0;36m",
};
const RESET = "\x1b[0m";

function grid(): Frame {
  return Array.from({ length: LOGO_H }, () =>
    Array.from({ length: LOGO_W }, () => ({ ch: " ", c: COL.dim })),
  );
}

function put(g: Frame, x: number, y: number, ch: string, c: number) {
  if (y < 0 || y >= LOGO_H || x < 0 || x >= LOGO_W) return;
  g[y][x] = { ch, c };
}

function gleamAt(x: number, gx: number) {
  if (gx < 0) return false;
  return Math.abs(x - gx) <= 1;
}

function tint(c: number, x: number, gx: number) {
  return gleamAt(x, gx) && c !== COL.dim ? COL.gleam : c;
}

function drawSword(g: Frame, length: number, gx: number) {
  const top = Math.max(0, 12 - length);
  for (let y = top; y <= 12; y++) {
    const c = tint(COL.steel, CX, gx);
    if (y === top) {
      put(g, CX, y, "|", c);
    } else if (y === top + 1 && length > 2) {
      put(g, CX - 1, y, "/", tint(COL.steel, CX - 1, gx));
      put(g, CX, y, "|", c);
      put(g, CX + 1, y, "\\", tint(COL.steel, CX + 1, gx));
    } else {
      put(g, CX - 1, y, "|", tint(COL.steel, CX - 1, gx));
      put(g, CX, y, "|", c);
      put(g, CX + 1, y, "|", tint(COL.steel, CX + 1, gx));
    }
  }
  if (length >= 10) {
    put(g, CX - 2, 13, "/", tint(COL.hilt, CX - 2, gx));
    put(g, CX - 1, 13, "|", tint(COL.hilt, CX - 1, gx));
    put(g, CX, 13, "|", tint(COL.hilt, CX, gx));
    put(g, CX + 1, 13, "|", tint(COL.hilt, CX + 1, gx));
    put(g, CX + 2, 13, "\\", tint(COL.hilt, CX + 2, gx));
    for (let x = CX - 3; x <= CX + 3; x++) put(g, x, 14, "=", tint(COL.hilt, x, gx));
  }
}

function drawShield(g: Frame, gx: number) {
  const rows: { y: number; l: number; r: number; lc: string; rc: string }[] = [
    { y: 4, l: 6, r: 16, lc: ".", rc: "." },
    { y: 5, l: 5, r: 17, lc: "/", rc: "\\" },
    { y: 6, l: 4, r: 18, lc: "|", rc: "|" },
    { y: 7, l: 4, r: 18, lc: "|", rc: "|" },
    { y: 8, l: 4, r: 18, lc: "|", rc: "|" },
    { y: 9, l: 5, r: 17, lc: "\\", rc: "/" },
    { y: 10, l: 6, r: 16, lc: "'", rc: "'" },
  ];
  for (const row of rows) {
    for (let x = row.l + 1; x < row.r; x++) {
      if (g[row.y][x].ch === " ") put(g, x, row.y, row.y === 4 || row.y === 10 ? "-" : " ", tint(COL.sage, x, gx));
    }
    put(g, row.l, row.y, row.lc, tint(COL.sage, row.l, gx));
    put(g, row.r, row.y, row.rc, tint(COL.sage, row.r, gx));
    if (row.y === 4 || row.y === 10) {
      for (let x = row.l + 1; x < row.r; x++) {
        if (Math.abs(x - CX) > 1) put(g, x, row.y, "-", tint(COL.sage, x, gx));
      }
    }
  }
  for (let x = 7; x <= 15; x++) {
    if (Math.abs(x - CX) > 1) put(g, x, 7, "-", tint(COL.sage, x, gx));
  }
}

function drawTitle(g: Frame, gx: number) {
  const t = "pqfreebsd";
  const x0 = CX - Math.floor(t.length / 2);
  for (let i = 0; i < t.length; i++) put(g, x0 + i, 15, t[i], tint(COL.sage, x0 + i, gx));
}

export function makeFrame(step: number): Frame {
  const g = grid();
  const swordLen = Math.min(12, 1 + step);
  const shieldOn = step >= 6;
  const titleOn = step >= 14;
  const gx = step >= 10 && step <= 18 ? 3 + (step - 10) * 2 : -1;
  drawSword(g, swordLen, gx);
  if (shieldOn) drawShield(g, gx);
  if (titleOn) drawTitle(g, gx);
  return g;
}

export const FRAME_COUNT = 22;
export const SETTLE_FRAME = 20;

export function frameAnsi(g: Frame): string {
  const lines: string[] = [];
  for (const row of g) {
    let line = "";
    let last = -1;
    for (const cell of row) {
      if (cell.c !== last) {
        line += ANSI[cell.c] ?? "";
        last = cell.c;
      }
      line += cell.ch;
    }
    line += RESET;
    lines.push(line);
  }
  return lines.join("\n");
}

export function framePlain(g: Frame): string {
  return g.map((row) => row.map((c) => c.ch).join("")).join("\n");
}
