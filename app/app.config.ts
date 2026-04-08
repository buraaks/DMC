export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      secondary: 'teal',
      neutral: 'slate',
    },
    container: {
      base: 'mx-auto px-4 sm:px-6 lg:px-10',
      constrained: 'max-w-[88rem]',
    },
    main: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))] pt-[var(--ui-header-height)]',
    },
  },
})
