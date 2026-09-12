import { type Result, ok, err } from '@rd/core/result';
import { againstNullOrUndefined, type GuardErr } from '@rd/core/guard';
import { ValueObject } from '@rd/core/domain';

export type ProjectNameProps = {
    value: string;
};

export type ProjectNameResult = Result<ProjectName, GuardErr>;

export class ProjectName extends ValueObject<ProjectNameProps> {
    static create(props: ProjectNameProps): ProjectNameResult {
        const guardResult = againstNullOrUndefined(props.value, 'value');
        if (guardResult.isErr) {
            return err(guardResult.err);
        }

        return ok(new ProjectName(props));
    }

    private constructor(props: ProjectNameProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }
}
