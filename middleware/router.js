import * as controller from "../src/controller.js";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:router");

export function routes(ctx) {
  if (ctx.url.pathname == "/") {
    return controller.index(ctx);
  }

  ////////////////////////////////////////!

  if (ctx.url.pathname == "/lieblingsfilm" && ctx.request.method == "GET") {
    debug("/lieblinsgfilm. GET --->", ctx.token);
    return controller.Lieblingsfilm_add(ctx);
  }
  if (ctx.url.pathname == "/lieblingsfilm" && ctx.request.method == "POST") {
    debug("lieblinsgfilm. POST --->", ctx.token);

    return controller.lieblingsfilm_submit(ctx);
  }
  if (ctx.url.pathname == "/thankyou") {
    return controller.thankyou(ctx);
  }

  return ctx;
}
