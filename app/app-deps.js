// This file was autogenerated by gulp-closure-deps plugin.
// Please do not edit.
goog.addDependency('components/directives/version-directive.js', ['my.version.Directive.factory'], [], false);
goog.addDependency('components/filters/check-filter.js', ['my.check.Filter.factory'], [], false);
goog.addDependency('components/services/version-service.js', ['my.version.Service'], [], false);
goog.addDependency('js/app.js', ['app'], ['my.check.Filter.factory', 'my.first.module', 'my.second.module', 'my.templates', 'my.third.module', 'my.version.Directive.factory', 'my.version.Service'], false);
goog.addDependency('js/templates.js', ['my.templates'], [], false);
goog.addDependency('states/first/first-controller.js', ['my.first.Ctrl'], [], false);
goog.addDependency('states/first/first-module.js', ['my.first.module'], ['my.first.Ctrl'], false);
goog.addDependency('states/second/second-controller.js', ['my.second.Ctrl'], [], false);
goog.addDependency('states/second/second-module.js', ['my.second.module'], ['my.second.Ctrl'], false);
goog.addDependency('states/third/one/one-controller.js', ['my.third.one.Ctrl'], ['my.third.Ctrl'], false);
goog.addDependency('states/third/one/one-module.js', ['my.third.one.module'], ['my.third.one.Ctrl'], false);
goog.addDependency('states/third/third-controller.js', ['my.third.Ctrl'], [], false);
goog.addDependency('states/third/third-module.js', ['my.third.module'], ['my.third.Ctrl', 'my.third.one.module', 'my.third.two.module'], false);
goog.addDependency('states/third/two/two-controller.js', ['my.third.two.Ctrl'], [], false);
goog.addDependency('states/third/two/two-module.js', ['my.third.two.module'], ['my.third.two.Ctrl'], false);