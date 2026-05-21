/**
 * Color buckets used by the Nespresso prototype color filter and by the
 * analytics layer that aggregates "add to cart" events per color.
 *
 * `ids` lists the capsule ids that belong to each bucket. This is the single
 * source of truth — both the filter UI and `colorForCapsule()` import it.
 */
export const COLOR_GROUPS: Array<{
  id: ColorGroupId;
  label: string;
  swatch: string;
  ids: number[];
}> = [
  { id: "yellow", label: "Yellow", swatch: "#F0B430", ids: [1, 2, 3, 4, 7] },
  { id: "orange", label: "Orange", swatch: "#C0843C", ids: [5, 6] },
  { id: "pink", label: "Pink", swatch: "#E4786C", ids: [10] },
  { id: "red", label: "Red", swatch: "#CC4848", ids: [8, 9, 11] },
  { id: "purple", label: "Purple", swatch: "#542478", ids: [12, 13, 14] },
  { id: "navy", label: "Navy", swatch: "#0C183C", ids: [15, 17, 18] },
  { id: "blue", label: "Blue", swatch: "#0090C0", ids: [19, 20] },
  { id: "green", label: "Green", swatch: "#547818", ids: [22, 23, 24, 25, 26] },
  { id: "brown", label: "Brown", swatch: "#543018", ids: [27, 28, 29, 30] },
  { id: "grey", label: "Grey", swatch: "#909090", ids: [21, 31] },
  { id: "black", label: "Black", swatch: "#181818", ids: [16, 32] },
];

export type ColorGroupId =
  | "yellow"
  | "orange"
  | "pink"
  | "red"
  | "purple"
  | "navy"
  | "blue"
  | "green"
  | "brown"
  | "grey"
  | "black";

export const COLOR_GROUP_IDS: ColorGroupId[] = [
  "yellow",
  "orange",
  "pink",
  "red",
  "purple",
  "navy",
  "blue",
  "green",
  "brown",
  "grey",
  "black",
];

/** Reverse lookup: capsule id → color bucket id, or null if unmapped. */
export function colorForCapsule(capsuleId: number): ColorGroupId | null {
  for (const g of COLOR_GROUPS) {
    if (g.ids.includes(capsuleId)) return g.id;
  }
  return null;
}
