import {
    DefaultNamingStrategy as Default,
    NamingStrategyInterface as Iface,
    Table,
} from "typeorm";
import crypto from "crypto";

export class CustomNamingStrategy extends Default implements Iface {
    foreignKeyName(
        tableOrName: string|Table,
        columnNames: string[]) {
        // Set `FK_KEYNAME` as FOREIGN_KEY and CONTRAINT name
        return columnNames.reduce((acc, cur) => (acc + cur.toUpperCase()), 'FK_');
    }
}
