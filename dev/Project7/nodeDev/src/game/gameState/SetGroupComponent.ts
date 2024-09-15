export type SetGroupComponent = {
  setGroupLink: { [key: string]: string };
}

export function getSetGroupCards(ctx: SetGroupComponent, itemId: string): string[] {
  const root = getSetGroupRoot(ctx, itemId);
  if (root != null) {
    return getSetGroupCards(ctx, root);
  }
  return [
    itemId,
    ...Object.keys(ctx.setGroupLink).filter((k) => {
      return ctx.setGroupLink[k] == itemId;
    }),
  ];
}

export function getSetGroupRoot(
  ctx: SetGroupComponent,
  cardID: string
): string | null {
  return ctx.setGroupLink[cardID] || null;
}

export function setSetGroupLink(ctx: SetGroupComponent, parentCardId: string, cardId: string): SetGroupComponent {
  return {
    ...ctx,
    setGroupLink: {
      ...ctx.setGroupLink,
      [cardId]: parentCardId,
    }
  }
}