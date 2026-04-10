export const ResponseCode = {
  SUCCESS: 0,
  ERROR: -1,
} as const;

export function respData<T>(data: T) {
  return respJson(ResponseCode.SUCCESS, 'ok', data ?? []);
}

export function respOk() {
  return respJson(ResponseCode.SUCCESS, 'ok');
}

export function respErr(message: string) {
  return respJson(ResponseCode.ERROR, message);
}

export function respJson<T>(code: number, message: string, data?: T) {
  return Response.json({ code, message, ...(data !== undefined && { data }) });
}
