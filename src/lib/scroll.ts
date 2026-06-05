import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export const setLenisInstance = (instance: Lenis | null) => {
  lenisInstance = instance
}

export const getLenisInstance = () => lenisInstance
