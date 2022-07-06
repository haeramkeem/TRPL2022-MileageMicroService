// Use @CustomRepository decorator to maintain the same style as typeorm@2.x
// Ref: https://gist.github.com/anchan828/9e569f076e7bc18daf21c652f7c3d012

import { SetMetadata } from "@nestjs/common";

export const TYPEORM_EX_CUSTOM_REPOSITORY = "TYPEORM_EX_CUSTOM_REPOSITORY";

export function CustomRepository(entity: Function): ClassDecorator {
    return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
