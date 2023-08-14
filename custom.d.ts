// custom.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    TEST_PUBLIC_KEY: string
    TEST_PRIVATE_KEY: string
    // Add more variables as needed
  }
}
