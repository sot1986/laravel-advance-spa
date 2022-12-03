import { ref, type Ref } from 'vue';

export type UsePromise<T, P extends unknown[] = unknown[], E = unknown> = {
  results: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<E | null>;
  createPromise: (...args: P) => Promise<void>;
  reset: () => void;
};

/**
 * function to call generic promise
 * @param fn Promise function to be called including parameters
 * @returns UsePromise<T> interface
 */
function usePromise<T, P extends unknown[] = unknown[], E = unknown>(
  fn: (...args: P) => Promise<T>
): UsePromise<T, P, E> {
  const results: Ref<T | null> = ref(null);
  const loading = ref(false);
  const error: Ref<E | null> = ref(null);

  const reset = () => {
    results.value = null;
    error.value = null;
    loading.value = true;
  };
  /**
   * generic function to call promise
   * @param args defined arugments of the promise
   * @returns void
   */
  const createPromise = async (...args: P) => {
    // initialization of values
    reset();
    try {
      // increment promise number
      // start promise
      results.value = await fn(...args);
    } catch (e) {
      // save error
      error.value = e as E;
    } finally {
      // close the promise call
      loading.value = false;
      // decrement promise number
    }
  };

  return {
    results,
    loading,
    error,
    createPromise,
    reset,
  };
}

export default usePromise;
