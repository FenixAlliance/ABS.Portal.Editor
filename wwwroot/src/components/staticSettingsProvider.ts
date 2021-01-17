/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { ISettingsProvider } from "@paperbits/common/configuration";
import * as Utils from "./utils";

export class StaticSettingsProvider implements ISettingsProvider {
    private configuration: Object;
    private loadingPromise: Promise<void>;

    constructor(private readonly settingsPath: string) { }

    public getSetting(name: string): Promise<Object> {
        const promise = new Promise(async (resolve) => {
            await this.getSettings();

            if (this.configuration[name]) {
                resolve(this.configuration[name]);
                return;
            }
        });

        return promise;
    }

    public setSetting(name: string, value: Object): void {
        this.configuration[name] = value;
    }

    public getSettings(): Promise<any> {
        if (!this.loadingPromise) {
            this.loadingPromise = this.loadSettings();
        }

        return this.loadingPromise;
    }

    private async loadSettings(): Promise<void> {
        const configFileContent = await Utils.loadFileAsString(this.settingsPath);
        this.configuration = JSON.parse(configFileContent);
    }
}