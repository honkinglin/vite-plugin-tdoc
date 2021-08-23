export function mergeOptions(userOptions) {
  const options = Object.assign(
    {
      markdownItOptions: {},
      markdownItSetup: () => ({}),
      transforms: {},
      useCustomMdPlugin: false,
    },
    userOptions,
  );
  return options;
}
