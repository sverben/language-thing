import type {GenericQueryCtx} from "convex/server";
import {zCustomQuery, zCustomMutation, zid, zCustomAction} from "convex-helpers/server/zod";
import {action, mutation, query} from "./_generated/server";
import {NoOp} from "convex-helpers/server/customFunctions";

export const zodQuery = zCustomQuery(query, NoOp);
export const zodMutation = zCustomMutation(mutation, NoOp);
export const zodAction = zCustomAction(action, NoOp);

export async function ensureIdentity(ctx: GenericQueryCtx<any>) {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
        throw new Error("Not authenticated");
    }

    return identity
}
