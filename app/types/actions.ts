export type ActionResponseStatus = 'success' | 'error'

export type SuccessResponse<T> = {
    status:'success';
    message?:string;
    data:T;
}
export type ErrorResponse = {
    status: 'error';
    message?:string;
}

export type ActionResponse<T = never> = SuccessResponse<T> | ErrorResponse

export type ActionToastPayload = Pick<ActionResponse<unknown>, 'status' | 'message'>