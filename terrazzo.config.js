import { defineConfig } from "@terrazzo/cli";
import * as _ from "@terrazzo/parser";
import css from "@terrazzo/plugin-css";

function pxToRem(token) {
  if (token.$type === "dimension") {
    if (token.$value.value === "px") {
      return token.$value.slice(0, -2) / 16 + "rem";
    }
  }
}

function clearFxPrefix(id) {
  if (id.includes("fx.")) {
    return id.replace("fx.", "").replace(".", "-");
  }
}

export default defineConfig({
  tokens: "./tokens/tokens.json",
  outDir: "./tokens",
  plugins: [
    css({
      filename: "tokens.css",
      modeSelectors: [
        {
          mode: "dark",
          selectors: [":root.dark"]
        }
      ],
      transform: pxToRem,
      generateName(variableId) {
        return clearFxPrefix(variableId);
      }
    })
  ]
});
