import pluginCSS from "@cobalt-ui/plugin-css";

const pxToRem = (token) => {
  if (token.$type === "dimension" && token.$value.slice(-2) === "px") {
    return token.$value.slice(0, -2) / 16 + "rem";
  }
};

export default {
  tokens: "./tokens.json",
  outDir: "./tokens/",
  plugins: [
    pluginCSS({
      modeSelectors: [
        {
          mode: "dark",
          selectors: [":root.dark"]
        }
      ],
      p3: false,
      transform: pxToRem
    })
  ]
};
