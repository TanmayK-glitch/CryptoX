export const log = (...args) => { if (import.meta.env.DEV) console.log(...args); };
export const warn = (...args) => { if (import.meta.env.DEV) console.warn(...args); };
export const error = (...args) => { if (import.meta.env.DEV) console.error(...args); };
