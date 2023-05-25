import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";

const debug = Debug("app:validation");

// const isValidCommentText = (text) => text.length >= 1 && text.length <= 30;
const isValidNameText = (text) => text.length >= 2 && text.length <= 45;
const isValidLieblingsfilmText = (text) =>
  text.length >= 4 && text.length <= 45;

function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
/////////////////////////////////

///////////////////////////////////////////////////////
export const validateParticipation = async (data) => {
  let errors = {};

  debug(
    "@validateParticipation. data.film--->  %O",
    data.filme,
  );

  if (!isValidNameText(data.name)) {
    errors.name = "Bitte schreibe deinen Namen in das Textfeld.";
  }
  if (!isValidLieblingsfilmText(data.lieblingsfilm)) {
    errors.lieblingsfilm =
      "Bitte schreibe deinen Lieblingsfilm richtig in das Textfeld.";
  }
  // if (!isValidEmail(data.email)) errors.email = "Das ist keine E-Mail.";

  if (data.filme == undefined) {
    errors.filme = "Kreuze bitte mindestens einen Film an.";
  }
  debug("@validateParticipation. errors--->  %O", errors);

  return errors;
};
