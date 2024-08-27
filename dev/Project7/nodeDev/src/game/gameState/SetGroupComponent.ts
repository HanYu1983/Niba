export type SetGroupComponent = {
  setGroupLink: { [key: string]: string };
}

export function getSetGroupCards(ctx: SetGroupComponent, cardID: string): string[] {
  const root = getSetGroupRoot(ctx, cardID);
  if (root != null) {
    return getSetGroupCards(ctx, root);
  }
  return [
    cardID,
    ...Object.keys(ctx.setGroupLink).filter((k) => {
      return ctx.setGroupLink[k] == cardID;
    }),
  ];
}

export function getSetGroupRoot(
  ctx: SetGroupComponent,
  cardID: string
): string | null {
  return ctx.setGroupLink[cardID] || null;
}
