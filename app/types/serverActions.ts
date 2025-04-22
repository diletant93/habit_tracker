export type ActionResponseStatus = 'success' | 'error'

export type ActionResponse<T> ={
    status:ActionResponseStatus;
    message?:string;
    data?:T
}

export type ActionToastPayload = Pick<ActionResponse<unknown>, 'status' | 'message'>