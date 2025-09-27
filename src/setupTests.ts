import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util'
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      // Using the global type definition for TextEncoder and TextDecoder
      TextEncoder: typeof globalThis.TextEncoder
      TextDecoder: typeof globalThis.TextDecoder
    }
  }
}

// 2. Assign the shims. No explicit 'as any' is needed now, resolving the ESLint error.
if (typeof global.TextEncoder === 'undefined') {
  // Cast the imported Node 'TextEncoder' to the required global type
  global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder
}

if (typeof global.TextDecoder === 'undefined') {
  // Cast the imported Node 'TextDecoder' to the required global type
  global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder
}
