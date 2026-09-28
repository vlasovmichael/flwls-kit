export type CommentProblem = {
    line: number;
    rule: string;
    text: string;
};
export declare function checkComments(src: string, maxBlockLines: number): CommentProblem[];
//# sourceMappingURL=comments.d.ts.map