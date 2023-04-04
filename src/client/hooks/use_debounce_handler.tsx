import _ from "lodash"
import { useCallback } from "react"

/**
 * Provides a handler that is debounced by the given delay and will work between renders 
 * 
 * @param handler the function to be called after the delay
 * @param delay how long to wait before calling the handler
 * @returns a debounced version of the handler 
 */
const use_debounce_handler = <T, >(handler: (args: T) => void, delay: number) => {
  const debounced_handler = useCallback(
    _.debounce((args: T) => handler(args), delay),
    []
  )
  return debounced_handler
}

export default use_debounce_handler
