export default interface CommonResponse<T> {
    message: string;
    status: string;
    errors: any;
    data: T
}