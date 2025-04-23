export type ActionResponseStatus = 'success' | 'error'

export type ActionResponse<T = never> =
| { status:'success';  message?:string; data:T } 
| { status:'error';  message?:string;}

export type ActionToastPayload = Pick<ActionResponse<unknown>, 'status' | 'message'>