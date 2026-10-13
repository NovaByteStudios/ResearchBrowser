module.exports = {
  packagerConfig: {
    name: "Research Browser",
    executableName: "Research Browser",
    appBundleId:
      "com.novabytestudios.researchbrowser",
    asar: true
  },

  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "darwin"
      ]
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "Research Browser",
        format: "ULFO"
      }
    }
  ]
};