export type SelectionComponent = {
    selections: {
        [key: string]: any
    }
}

export type TableComponent = {
    table: any
}

export type TableComponentAlg = {
    moveCard(ctx: TableComponent): TableComponent;
}

export type Model = SelectionComponent & TableComponent

export type Text = {
    action: string
}

export type Logic = { id: "or" } | { id: "and" }

export type CardProto = {
    texts: { [key: string]: Text }
}

export type Game = {
    doA(ctx:any): string
}