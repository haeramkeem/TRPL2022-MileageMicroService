import {
    DefaultNamingStrategy as Default,
    NamingStrategyInterface as Iface,
    Table,
} from "typeorm";

/**
 * References:
 * @see https://github.com/typeorm/typeorm/blob/master/sample/sample12-custom-naming-strategy/naming-strategy/CustomNamingStrategy.ts
 * @see https://github.com/typeorm/typeorm/issues/1355#issuecomment-660013778
 */
export class CustomNamingStrategy extends Default implements Iface {
    /**
     * Set `FK_${KEYNAME}` as FOREIGN_KEY and CONTRAINT name
     * @see https://github.com/typeorm/typeorm/blob/d285fd0a2b1e2b903ca545dfef82c9f31869f222/src/naming-strategy/DefaultNamingStrategy.ts#L105
     */
    foreignKeyName(
        tableOrName: string|Table,
        columnNames: string[]): string {
        return columnNames.reduce((acc, cur) => (acc + cur.toUpperCase()), 'FK_');
    }

    /**
     * Set `OneToOne` column as `UNIQUE_KEY` with `REL_${KEYNAME}` key name
     * @see https://github.com/typeorm/typeorm/blob/d285fd0a2b1e2b903ca545dfef82c9f31869f222/src/naming-strategy/DefaultNamingStrategy.ts#L79
     */
    relationConstraintName(
        tableOrName: Table | string,
        columnNames: string[]): string {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();

        return columnNames.reduce((acc, cur) => (acc + cur.toUpperCase()), 'REL_');
    }
}
