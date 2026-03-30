import { UPG_DEFAULT_MODEL, UPG_FALLBACK_MODEL } from './constants';

export function selectModel(useFallback = false): string {
  return useFallback ? UPG_FALLBACK_MODEL : UPG_DEFAULT_MODEL;
}
