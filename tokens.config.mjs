import pluginCSS from "@cobalt-ui/plugin-css";

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
      ]
    })
  ]
};
