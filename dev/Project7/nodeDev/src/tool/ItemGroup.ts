type ItemGroupParent = { [key: string]: string };
type ItemGroupChildren = { [key: string]: string[] };
export type ItemGroup = {
    itemGroupParent: ItemGroupParent;
    itemGroupChildren: ItemGroupChildren;
};

function identity(): ItemGroup {
    return {
        itemGroupParent: {},
        itemGroupChildren: {},
    };
}

function createItemGroup(): ItemGroup {
    return {
        itemGroupParent: {},
        itemGroupChildren: {},
    };
}

function deleteItemGroupParent(ctx: ItemGroup, id: string): ItemGroup {
    const parent = ctx.itemGroupParent[id];
    if (!parent) return ctx;
    const itemGroupParent = { ...ctx.itemGroupParent }
    delete itemGroupParent[id]
    return {
        ...ctx,
        itemGroupParent: itemGroupParent,
        itemGroupChildren: {
            ...ctx.itemGroupChildren,
            [parent]: ctx.itemGroupChildren[parent].filter(child => child !== id),
        },
    };
}

function assertCircleRef(ctx: ItemGroup, id: string): void {
    let visited: string[] = [];
    function checkCircle(currentId: string): void {
        if (visited.includes(currentId)) {
            throw new Error("Circular reference detected");
        }
        visited.push(currentId);
        const parent = ctx.itemGroupParent[currentId];
        if (parent) {
            checkCircle(parent);
        }
    }
    checkCircle(id);
}

function setItemGroupParent(ctx: ItemGroup, id: string, parent: string): ItemGroup {
    const updatedCtx = deleteItemGroupParent(ctx, id);
    ctx = {
        ...updatedCtx,
        itemGroupParent: { ...updatedCtx.itemGroupParent, [id]: parent },
        itemGroupChildren: {
            ...updatedCtx.itemGroupChildren,
            [parent]: [...(updatedCtx.itemGroupChildren[parent] || []), id],
        },
    };
    assertCircleRef(ctx, id)
    return ctx
}

function getItemGroupParent(ctx: ItemGroup, id: string): string | undefined {
    return ctx.itemGroupParent[id];
}

function getItemGroupParentRoot(ctx: ItemGroup, id: string): string {
    let currentId = id;
    while (true) {
        const parent = getItemGroupParent(ctx, currentId);
        if (!parent) return currentId;
        currentId = parent;
    }
}

function getItemGroup(ctx: ItemGroup, id: string): string[] {
    const children = ctx.itemGroupChildren[id] || [];
    // 修正: 確保返回當前 id 和所有子項目
    return [id, ...children.flatMap(child => getItemGroup(ctx, child))];
}

function getItemGroupFromRoot(ctx: ItemGroup, id: string): string[] {
    return getItemGroup(ctx, getItemGroupParentRoot(ctx, id));
}

function deleteItemGroup(ctx: ItemGroup, id: string): ItemGroup {
    const willDeleteIds = getItemGroup(ctx, id);
    ctx = deleteItemGroupParent(ctx, id)
    const updatedParent = { ...ctx.itemGroupParent };
    const updatedChildren = { ...ctx.itemGroupChildren };
    willDeleteIds.forEach(willDeleteId => {
        delete updatedParent[willDeleteId];
        delete updatedChildren[willDeleteId];
    });
    return {
        ...ctx,
        itemGroupParent: updatedParent,
        itemGroupChildren: updatedChildren,
    };
}

export const ItemGroupFn = {
    identity,
    createItemGroup,
    setItemGroupParent,
    getItemGroupParent,
    getItemGroupParentRoot,
    getItemGroup,
    getItemGroupFromRoot,
    deleteItemGroup,
}

export function tests() {
    let ctx = createItemGroup();
    ctx = setItemGroupParent(ctx, "child", "parent");
    if (getItemGroupParent(ctx, "child") !== "parent") throw new Error("set-item-group-parent failed");

    ctx = setItemGroupParent(ctx, "grandchild", "child");
    if (getItemGroupParentRoot(ctx, "grandchild") !== "parent") throw new Error("get-item-group-parent-root failed");

    let group = getItemGroup(ctx, "parent");
    // 這行有錯, 修正以下
    if (JSON.stringify(group) !== JSON.stringify(["parent", "child", "grandchild"])) throw new Error("get-item-group failed");

    let groupFromRoot = getItemGroupFromRoot(ctx, "grandchild");
    if (JSON.stringify(groupFromRoot) !== JSON.stringify(["parent", "child", "grandchild"])) throw new Error("get-item-group-from-root failed");

    ctx = deleteItemGroupParent(ctx, "child");
    if (getItemGroupParent(ctx, "child") !== undefined) throw new Error("delete-item-group-parent failed");

    let groupAfterDelete = getItemGroup(ctx, "parent");
    if (JSON.stringify(groupAfterDelete) !== JSON.stringify(["parent"])) throw new Error("delete-item-group-parent didn't update group structure");

    let grandchildParentAfterDelete = getItemGroupParent(ctx, "grandchild");
    if (grandchildParentAfterDelete !== "child") throw new Error("delete-item-group-parent didn't preserve other relationships");

    let rootAfterDelete = getItemGroupParentRoot(ctx, "grandchild");
    if (rootAfterDelete !== "child") throw new Error("get-item-group-parent-root failed after delete");

    ctx = createItemGroup();
    ctx = setItemGroupParent(ctx, "item1", "group1");
    ctx = setItemGroupParent(ctx, "item2", "group1");
    ctx = setItemGroupParent(ctx, "item3", "group2");
    ctx = setItemGroupParent(ctx, "subgroup1", "group1");
    ctx = setItemGroupParent(ctx, "item4", "subgroup1");

    let group1Items = getItemGroup(ctx, "group1");
    let group2Items = getItemGroup(ctx, "group2");
    let subgroup1Items = getItemGroup(ctx, "subgroup1");
    let item4Root = getItemGroupParentRoot(ctx, "item4");

    if (JSON.stringify(group1Items) !== JSON.stringify(["group1", "item1", "item2", "subgroup1", "item4"])) throw new Error("Complex group structure test failed");
    if (JSON.stringify(group2Items) !== JSON.stringify(["group2", "item3"])) throw new Error("Simple group structure test failed");
    if (JSON.stringify(subgroup1Items) !== JSON.stringify(["subgroup1", "item4"])) throw new Error("Nested group structure test failed");
    if (item4Root !== "group1") throw new Error("Root finding in nested structure failed");

    let ctxAfterDelete = deleteItemGroup(ctx, "subgroup1");
    let group1AfterDelete = getItemGroup(ctxAfterDelete, "group1");
    if (JSON.stringify(group1AfterDelete) !== JSON.stringify(["group1", "item1", "item2"])) throw new Error("Delete nested group failed");
    if (getItemGroupParent(ctxAfterDelete, "item4") !== undefined) throw new Error("Orphaned item not properly handled after delete");

    try {
        ctx = setItemGroupParent(ctx, "item1", "group1");
        ctx = setItemGroupParent(ctx, "group1", "item1");
        throw new Error("assert-circle-ref should have thrown an exception");
    } catch (e: any) {
        if (e.message !== "Circular reference detected") throw new Error("Incorrect exception message");
    }
}