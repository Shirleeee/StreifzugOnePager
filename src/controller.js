import * as zuschauerModel from "../db/models/zuschauer.js";
import * as csrf from "./../middleware/accessories/csrf.js";
import * as valid from "../middleware/accessories/validation.js";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
import * as sessions from "../middleware/sessions.js";
const debug = Debug("app:controller");

export async function Lieblingsfilm_add(ctx) {
  // debug("@lieblingsfilm.  --data--> %O", ctx.db);
  const token = csrf.generateToken();
  ctx.token.set("tokenLiebling", token);

  ctx.response.body = ctx.nunjucks.render("index.html", {
    form: {
      _csrf: token,
    },
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";

  return ctx;
}

export async function lieblingsfilm_submit(ctx) {
  const formData = await ctx.request.formData();
  debug("@lieblinsfilm_submit.  --token--> %O", ctx.token.size);
  debug("@lieblinsfilm_submit.  --token--> %O", ctx.token.get("tokenLiebling"));

  const data = {
    name: formData.get("name"),
    filme: formData.getAll("filme"),
    email: formData.get("email"),
    lieblingsfilm: formData.get("lieblingsfilm"),
    _csrf: formData.get("_csrf"),
  };

  const errors = await valid.validateParticipation(data);

  if (Object.values(errors).length > 0) {
    debug("@lieblinsfilm_submit.  --data--> %O", data);

    ctx.response.body = ctx.nunjucks.render("index.html", {
      form: data,
      errors: errors,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";

    return ctx;
  }

  csrf.checkToken(ctx, "tokenLiebling", data._csrf, "/error");
  data.filme = formData.getAll("filme").toString();

  zuschauerModel.addToDB(data);

  ctx.redirect = Response.redirect(ctx.url.origin + "/thankyou", 303);
  return ctx;
}
export function thankyou(ctx) {
  let methodCheck = ctx.request.method;
  // debug("@thankyou.  --methodCheck--> %O", methodCheck);
  sessions.deleteAllSessionsCookiesTokens(ctx);
  ctx.response.body = ctx.nunjucks.render("thankyou.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
export function error(ctx) {
  // debug("@error404. ctx.request.url %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("error.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function datenschutz(ctx) {
  // debug("@error404. ctx.request.url %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("datenschutz.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
