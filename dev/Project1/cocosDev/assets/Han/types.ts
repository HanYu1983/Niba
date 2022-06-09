import { Component } from "cc";
export interface EntityType extends Component {
    entityID: string
}
export type Directive = ["damage", number]
export type DirectiveEvent = {
    directives: [string, Directive][],
    results: { [key: string]: any }
}