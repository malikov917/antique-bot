module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './electronjs/webpack.main.config.js',
        renderer: {
          config: './electronjs/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './electronjs/src/index.html',
              js: './electronjs/src/renderer.js',
              name: 'main_window',
              preload: {
                js: './electronjs/src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
