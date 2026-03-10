export default interface IServiceModel<T, R> {
    execute(data: T): Promise<{
        status: string,
        message: {
            code: number,
            message: R,
        },
    }>;
}