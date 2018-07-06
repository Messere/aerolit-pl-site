export default interface IValidatedArgs {
    valid: boolean;
    errorMessage?: string;

    [propName: string]: any;
}
