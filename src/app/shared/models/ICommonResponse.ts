export default interface ICommonResponse<T> {
    message: string;
    status: string;
    errors: any;
    data: T
}