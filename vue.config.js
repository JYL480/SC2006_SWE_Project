const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"), // Allows us to refer to the src directory as `src` directly when importing (instead of using relative path)
      },
    },
  },
});
