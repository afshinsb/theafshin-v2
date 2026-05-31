import { json } from "../_shared/security";

export const onRequest = () =>
  json(
    {
      error:
        "This portfolio deployment does not expose a public translation API. Use the linked Universal Subtitle Translator project instead.",
    },
    404,
  );
