// Utility to reset configuration to default values
export const resetConfigToDefault = () => {
  const defaultConfig = {
    defaultPath: '/dashboard/default',
    fontFamily: `'Public Sans', sans-serif`,
    i18n: 'en',
    miniDrawer: false,
    container: true,
    mode: 'light',
    presetColor: 'default',
    themeDirection: 'ltr'
  };

  // Clear localStorage and set default config
  localStorage.removeItem('mantis-react-ts-config');
  localStorage.setItem('mantis-react-ts-config', JSON.stringify(defaultConfig));

  console.log('Configuration reset to default values');
};

// Call this function to reset config
export const forceResetConfig = () => {
  resetConfigToDefault();
  window.location.reload();
};
