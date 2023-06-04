import * as controller from "../src/controller.js";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as mediaTypes from "https://deno.land/std@0.170.0/media_types/mod.ts";
import * as client from "../db/client.js";

import {
  CookieMap,
  mergeHeaders,
} from "https://deno.land/std@0.167.0/http/mod.ts";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:app");
import * as sessionsControl from "./../middleware/sessions.js";

import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});
import { routes } from "./../middleware/router.js";
const sessionStore = new Map();
const tokenMap = new Map();
// await client.run();
export const handleRequest = async (request) => {
  //   // debug("@handleRequest. request %O", request);

  const ctx = {
    db: client,
    sessionStore: sessionsControl.createSessionStore(sessionStore),
    cookies: new CookieMap(request),
    token: tokenMap,
    state: {
      authenticated: false,
    },
    session: {},
    request: request,
    url: new URL(request.url),
    params: {},
    redirect: undefined,
    response: {
      headers: {},
      body: undefined,
      status: undefined,
    },
    nunjucks: nunjucks,
  };

  const middleware = [
    sessionsControl.getSession,
    serveStaticFile("public"),
    routes,
    sessionsControl.setSession,
  ];

  // debug(
  //   "@handleRequest.>>>>>>  %O   ",C
  //   `>>> ${ctx.request.method} ${ctx.url.pathname}${ctx.url.search}`,
  // );

  const pipeAsync = (...funcs) => (ctx) =>
    funcs.reduce(async (state, func) => func(await state), ctx);

  let result = await pipeAsync(...middleware)(ctx);

  if (result.redirect) {
    return result.redirect;
  }

  // Fallback
  result.response.status = result.response.status ?? 404;
  if (!result.response.body && result.response.status == 404) {
    result = await controller.error(result);
  }

  const allHeaders = mergeHeaders(result.response.headers, result.cookies);
  result.response.headers["Set-cookie"] = allHeaders.get("set-cookie");

  // debug("@getSession.----------   allHeaders----> %O  ", allHeaders);
  return new Response(result.response.body, {
    status: result.response.status,
    headers: result.response.headers,
  });
};

export const serveStaticFile = (base) => async (ctx) => {
  let file;
  const fullPath = path.join(base, ctx.url.pathname);

  if (fullPath.indexOf(base) !== 0 || fullPath.indexOf("\0") !== -1) {
    const flashText = "Irgendwas lief falsch.";
    ctx.response.body = ctx.nunjucks.render("error.html", {
      flashText,
    });
    ctx.response.status = 403;
    ctx.response.headers["content-type"] = "text/html";

    // debug(
    //   "@serveStaticFile.fullPath.indexOf(base) ---> %O",
    //   fullPath.indexOf(base),
    // );
    return ctx;
  }
  try {
    file = await Deno.open(fullPath, {
      read: true,
    });
  } catch (_error) {
    const flashText = "Irgendwas lief falsch.";
    ctx.response.body = ctx.nunjucks.render("error.html", {
      flashText,
    });
    ctx.response.status = 403;
    ctx.response.headers["content-type"] = "text/html";
    return ctx;
  }
  const { ext } = path.parse(ctx.url.pathname);
  const contentType = mediaTypes.contentType(ext);
  // debug("@serveStaticFile....ext ---> %O", ext);
  if (contentType) {
    // debug("@serveStaticFile.....file.readable ---> %O", file.readable);
    ctx.response.body = file.readable;
    ctx.response.headers["Content-type"] = contentType;
    ctx.response.status = 200;
  } else {
    Deno.close(file.rid);
  }
  return ctx;
};
