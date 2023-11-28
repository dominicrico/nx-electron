"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generator = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../utils/versions");
const jest_1 = require("@nx/jest");
function addDependencies(tree) {
    return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
        'nx-electron': versions_1.nxElectronVersion,
        electron: versions_1.electronVersion,
    });
}
function addScripts(tree) {
    return (0, devkit_1.updateJson)(tree, 'package.json', (json) => {
        json.scripts = json.scripts || {};
        const postinstall = json.scripts['postinstall'];
        json.scripts['postinstall'] =
            postinstall && postinstall !== ''
                ? `${postinstall} && electron-builder install-app-deps`
                : 'electron-builder install-app-deps';
        return json;
    });
}
function normalizeOptions(schema) {
    var _a;
    return Object.assign(Object.assign({}, schema), { unitTestRunner: (_a = schema.unitTestRunner) !== null && _a !== void 0 ? _a : 'jest' });
}
function generator(tree, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = normalizeOptions(schema);
        let jestInstall;
        if (options.unitTestRunner === 'jest') {
            jestInstall = yield (0, jest_1.jestInitGenerator)(tree, {});
        }
        const installTask = addDependencies(tree);
        if (!options.skipFormat) {
            yield (0, devkit_1.formatFiles)(tree);
        }
        if (jestInstall) {
            yield jestInstall();
        }
        addScripts(tree);
        yield installTask();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    });
}
exports.generator = generator;
exports.default = generator;
//# sourceMappingURL=generator.js.map