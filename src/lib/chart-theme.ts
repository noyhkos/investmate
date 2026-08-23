/**
 * Chart colour tokens. Values are a palette validated for colour-vision
 * deficiency separation against both surfaces — swap the whole set, not
 * individual entries, or the guarantee is void.
 */

/**
 * Overlay series hues, in fixed slot order. Colour binds to the asset,
 * never to its rank: de-selecting one series must not repaint the rest.
 * Past eight, fold into "Other" rather than generating a ninth hue.
 */
export const SERIES_LIGHT = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
] as const;

export const SERIES_DARK = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
] as const;

export const MAX_OVERLAY_SERIES = SERIES_LIGHT.length;

/** Chrome sits behind the data. */
export const CHART_CHROME = {
  light: {
    surface: "#fcfcfb",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    label: "#898781",
    text: "#0b0b0b",
  },
  dark: {
    surface: "#1a1a19",
    grid: "#2c2c2a",
    axis: "#383835",
    label: "#898781",
    text: "#ffffff",
  },
} as const;

/**
 * Korea paints a rising price red; the US paints it green. Reading a KR
 * tile with US habits inverts the meaning, so direction is a user setting
 * and every value also carries an arrow — colour never signals alone.
 */
export type UpColor = "red" | "green";

const RISE = "#d03b3b";
const FALL_BLUE = "#2a78d6";
const RISE_GREEN = "#0ca30c";

export function directionColors(upColor: UpColor) {
  return upColor === "red"
    ? { up: RISE, down: FALL_BLUE }
    : { up: RISE_GREEN, down: RISE };
}

/**
 * Text steps for direction. The canonical hexes above clear the 3:1 graphical
 * threshold as chart lines and arrow glyphs but not 4.5:1 as a 12px numeral,
 * so numbers use these and marks use the canonical set.
 */
export const DIRECTION_TEXT = {
  light: { red: "#c8352f", blue: "#2565b8", green: "#0a7d0a" },
  dark: { red: "#e66767", blue: "#3987e5", green: "#2eb62e" },
} as const;

/**
 * Sparkline ink. Held low on purpose: a 364x48 sparkline outweighs a 30px
 * CAGR figure roughly 40x in area, so the figure can only win on contrast.
 */
export const PLOT_INK = "#7a7871";
