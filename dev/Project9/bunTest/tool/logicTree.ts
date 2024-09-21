export type LogicTree = {
    type: 'And' | 'Or' | 'Leaf';
    value?: string;
    children?: LogicTree[];
};

function or(tree: LogicTree): boolean {
    return tree.type === 'Or';
}

function and(tree: LogicTree): boolean {
    return tree.type === 'And';
}

function leaf(tree: LogicTree): boolean {
    return tree.type === 'Leaf';
}

function children(tree: LogicTree): LogicTree[] {
    return tree.children || [];
}

function crossProduct(a: any[], b: any[]): any[] {
    return a.flatMap(x => b.map(y => [].concat(x, y)));
}

function enumerateAll(tree: LogicTree): any[] {
    if (!tree) return [];
    if (or(tree)) return children(tree).flatMap(enumerateAll);
    if (and(tree)) return children(tree).map(enumerateAll).reduce(crossProduct, [[]]);
    if (leaf(tree)) return [[tree.value]];
    throw new Error(`Unknown tree structure ${tree}`);
}

function has(tree: LogicTree, keys: string[]): boolean {
    return enumerateAll(tree).some(set => keys.length === set.length && keys.every(key => set.includes(key)));
}

function testEnumerateAll() {
    const tree1: LogicTree = {
        type: 'And',
        children: [
            { type: 'Leaf', value: 'action-1' },
            { type: 'Leaf', value: 'action-2' },
            {
                type: 'Or',
                children: [
                    { type: 'Leaf', value: 'action-3' },
                    { type: 'Leaf', value: 'action-4' },
                    {
                        type: 'Or',
                        children: [
                            { type: 'Leaf', value: '5' },
                            { type: 'Leaf', value: '6' }
                        ]
                    }
                ]
            },
            {
                type: 'And',
                children: [
                    { type: 'Leaf', value: 'action-7' },
                    { type: 'Leaf', value: 'action-8' }
                ]
            },
            {
                type: 'And',
                children: [
                    {
                        type: 'Or',
                        children: [
                            { type: 'Leaf', value: 'action-9' },
                            { type: 'Leaf', value: 'action-10' }
                        ]
                    },
                    { type: 'Leaf', value: 'action-11' }
                ]
            }
        ]
    };

    const tree2: LogicTree = {
        type: 'And',
        children: [
            { type: 'Leaf', value: '5' },
            { type: 'Leaf', value: '6' },
            {
                type: 'Or',
                children: [
                    { type: 'Leaf', value: '1' },
                    {
                        type: 'Or',
                        children: [
                            { type: 'Leaf', value: '2' },
                            { type: 'Leaf', value: '3' }
                        ]
                    }
                ]
            }
        ]
    };

    const tree3: LogicTree = {
        type: 'And',
        children: [
            { type: 'Leaf', value: '5' },
            { type: 'Leaf', value: '6' },
            {
                type: 'Or',
                children: [
                    { type: 'Leaf', value: '1' },
                    {
                        type: 'Or',
                        children: [
                            { type: 'Leaf', value: '2' },
                            { type: 'Leaf', value: '3' }
                        ]
                    }
                ]
            },
            {
                type: 'Or',
                children: [
                    { type: 'Leaf', value: '7' },
                    {
                        type: 'And',
                        children: [
                            { type: 'Leaf', value: '8' },
                            { type: 'Leaf', value: '9' }
                        ]
                    }
                ]
            }
        ]
    };

    const result1 = [
        [
            'action-1',
            'action-2',
            'action-3',
            'action-7',
            'action-8',
            'action-9',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            'action-3',
            'action-7',
            'action-8',
            'action-10',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            'action-4',
            'action-7',
            'action-8',
            'action-9',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            'action-4',
            'action-7',
            'action-8',
            'action-10',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            '5',
            'action-7',
            'action-8',
            'action-9',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            '5',
            'action-7',
            'action-8',
            'action-10',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            '6',
            'action-7',
            'action-8',
            'action-9',
            'action-11'
        ],
        [
            'action-1',
            'action-2',
            '6',
            'action-7',
            'action-8',
            'action-10',
            'action-11'
        ]
    ]
    const result2 = [['5', '6', '1'], ['5', '6', '2'], ['5', '6', '3']]
    const result3 = [
        ['5', '6', '1', '7'],
        ['5', '6', '1', '8', '9'],
        ['5', '6', '2', '7'],
        ['5', '6', '2', '8', '9'],
        ['5', '6', '3', '7'],
        ['5', '6', '3', '8', '9']
    ]
    const assertEqual = (expected:any, actual:any) => {
        if (JSON.stringify(expected) !== JSON.stringify(actual)) {
            throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
        }
    };
    assertEqual(result1, enumerateAll(tree1));
    assertEqual(result2, enumerateAll(tree2));
    assertEqual(result3, enumerateAll(tree3));
}

function tests() {
    testEnumerateAll();
}

export const LogicTreeFn = {
    or,
    and,
    leaf,
    children,
    crossProduct,
    enumerateAll,
    has,
    tests
}