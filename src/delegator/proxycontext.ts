/*!
 * Copyright (c) iwontsay/willneedit. All rights reserved.
 * Licensed under the MIT License.
 */

import { RawContext } from "./rawcontext";

import {
    Actor,
    Context,
    ForwardPromise,
    TransformLike
} from "@microsoft/mixed-reality-extension-sdk";

// tslint:disable:variable-name
export class ProxyContext extends RawContext {
    constructor(
        baseContext: Context,
        private _index: number,
        private _rootTransform: Partial<TransformLike>) {
            super(baseContext);
    }

    private _rootActor: Actor = null;

    public get index() { return this._index; }
    public get rootTransform() { return this._rootTransform; }
    public get rootActor() { return this._rootActor; }

    // Session ID of the base actor gets extended with the index
    public get sessionId() { return this.baseContext.sessionId + "@" + this.index; }

    public async initRootActor() {
        if (!this._rootActor) {
            this._rootActor = await Actor.CreateEmpty(this.baseContext, {
                actor: {
                    transform: this._rootTransform
                }
            });
        }
    }

    private addRootActor(options: any): any {
        if (!this._rootActor) {
            this._rootActor = Actor.CreateEmpty(this.baseContext, {
                actor: {
                    transform: this._rootTransform
                }
            }).value;
        }

        // Overlay the parent ID with the one given in the options, add the root actor as the parent
        // only if no parent is given
        if (!options) options = { };
        if (!options.actor) options.actor = { };
        if (!options.actor.parentId) options.actor.parentId = this.rootActor.id;

        return options;
    }

    public CreateEmpty(options?: any): ForwardPromise<Actor> {
        return Actor.CreateEmpty(this.baseContext, this.addRootActor(options));
    }

    public CreateFromLibrary(options: any): ForwardPromise<Actor> {
        return Actor.CreateFromLibrary(this.baseContext, this.addRootActor(options));
    }

    public CreateFromGLTF(options: any): ForwardPromise<Actor> {
        return Actor.CreateFromGLTF(this.baseContext, this.addRootActor(options));
    }

    public CreateFromPrefab(options: any): ForwardPromise<Actor> {
        return Actor.CreateFromPrefab(this.baseContext, this.addRootActor(options));
    }

    public CreatePrimitive(options: any): ForwardPromise<Actor> {
        return Actor.CreatePrimitive(this.baseContext, this.addRootActor(options));
    }

}