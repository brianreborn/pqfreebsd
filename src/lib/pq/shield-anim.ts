/** ASCII shield + device. Same geometry as logo-pqfreebsd.4th.
 * Default device is the cross. Options: dove, sword, crown, menorah, rock.
 */

export const LOGO_W = 23;
export const LOGO_H = 16;
export const CX = 11;

export const EMBLEMS = ["cross", "dove", "sword", "crown", "menorah", "rock"] as const;
export type SplashEmblem = (typeof EMBLEMS)[number];

export const EMBLEM_GLOSS: Record<SplashEmblem, string> = {
  cross: "the cross (default)",
  dove: "a dove",
  sword: "a sword, no cross-bar",
  crown: "a crown",
  menorah: "a menorah",
  rock: "a rock",
};

export const COL = {
  dim: 0,
  steel: 1,
  sage: 2,
  gleam: 3,
  hilt: 4,
} as const;

export type Cell = { ch: string; c: number };
export type Frame = Cell[][];

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

function stamp(g: Frame, x0: number, y0: number, lines: string[], gx: number, col: number = COL.steel) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] !== " ") put(g, x0 + j, y0 + i, line[j], tint(col, x0 + j, gx));
    }
  }
}

function drawSword(g: Frame, length: number, gx: number, withHilt: boolean) {
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
  if (withHilt && length >= 10) {
    put(g, CX - 2, 13, "/", tint(COL.hilt, CX - 2, gx));
    put(g, CX - 1, 13, "|", tint(COL.hilt, CX - 1, gx));
    put(g, CX, 13, "|", tint(COL.hilt, CX, gx));
    put(g, CX + 1, 13, "|", tint(COL.hilt, CX + 1, gx));
    put(g, CX + 2, 13, "\\", tint(COL.hilt, CX + 2, gx));
    for (let x = CX - 3; x <= CX + 3; x++) put(g, x, 14, "=", tint(COL.hilt, x, gx));
  }
}

function drawShield(g: Frame, gx: number, withBar: boolean) {
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
    put(g, row.l, row.y, row.lc, tint(COL.sage, row.l, gx));
    put(g, row.r, row.y, row.rc, tint(COL.sage, row.r, gx));
    if (row.y === 4 || row.y === 10) {
      for (let x = row.l + 1; x < row.r; x++) put(g, x, row.y, "-", tint(COL.sage, x, gx));
    }
  }
  if (withBar) {
    for (let x = 7; x <= 15; x++) {
      if (Math.abs(x - CX) > 1) put(g, x, 7, "-", tint(COL.sage, x, gx));
    }
  }
}

function drawDove(g: Frame, gx: number) {
  stamp(
    g,
    5,
    5,
    [
      "      .-.     ",
      "    <(o )___  ",
      "     (  .  >  ",
      "      `--'    ",
    ],
    gx,
    COL.steel,
  );
}

function drawCrown(g: Frame, gx: number) {
  stamp(
    g,
    6,
    5,
    [
      "\\ | | | /",
      " \\|||||/ ",
      " |_____| ",
    ],
    gx,
    COL.hilt,
  );
}

function drawMenorah(g: Frame, gx: number) {
  stamp(
    g,
    4,
    5,
    [
      "| | | | | | |",
      "| | | | | | |",
      "+-+-+-+-+-+-+",
      "      |      ",
      "     / \\     ",
    ],
    gx,
    COL.hilt,
  );
}

function drawRock(g: Frame, gx: number) {
  stamp(
    g,
    7,
    5,
    [
      "   /\\   ",
      "  /  \\  ",
      " /    \\ ",
      "/______\\",
    ],
    gx,
    COL.steel,
  );
}

function drawTitle(g: Frame, gx: number) {
  const t = "pqfreebsd";
  const x0 = CX - Math.floor(t.length / 2);
  for (let i = 0; i < t.length; i++) put(g, x0 + i, 15, t[i], tint(COL.sage, x0 + i, gx));
}

export function makeFrame(step: number, emblem: SplashEmblem = "cross"): Frame {
  const g = grid();
  const deviceOn = step >= 6;
  const titleOn = step >= 14;
  const gx = step >= 10 && step <= 18 ? 3 + (step - 10) * 2 : -1;
  const blade = emblem === "cross" || emblem === "sword";
  if (blade) {
    const swordLen = Math.min(12, 1 + step);
    drawSword(g, swordLen, gx, emblem === "sword" || step >= 8);
  }
  if (deviceOn) {
    drawShield(g, gx, emblem === "cross");
    if (emblem === "cross") {
      for (let y = 5; y <= 9; y++) {
        put(g, CX - 1, y, "|", tint(COL.steel, CX - 1, gx));
        put(g, CX, y, "|", tint(COL.steel, CX, gx));
        put(g, CX + 1, y, "|", tint(COL.steel, CX + 1, gx));
      }
    } else if (emblem === "sword") {
      for (let y = 5; y <= 9; y++) {
        put(g, CX - 1, y, "|", tint(COL.steel, CX - 1, gx));
        put(g, CX, y, "|", tint(COL.steel, CX, gx));
        put(g, CX + 1, y, "|", tint(COL.steel, CX + 1, gx));
      }
    } else if (emblem === "dove") drawDove(g, gx);
    else if (emblem === "crown") drawCrown(g, gx);
    else if (emblem === "menorah") drawMenorah(g, gx);
    else if (emblem === "rock") drawRock(g, gx);
  }
  if (titleOn) drawTitle(g, gx);
  return g;
}

export const FRAME_COUNT = 22;
export const SETTLE_FRAME = 20;
