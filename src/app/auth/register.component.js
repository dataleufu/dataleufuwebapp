"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var authentication_service_1 = require("./authentication.service");
var RegisterComponent = (function () {
    function RegisterComponent(authenticationService) {
        this.authenticationService = authenticationService;
        this.model = {};
        this.error = {};
        this.user = new core_2.EventEmitter();
        this.submitted = false;
    }
    RegisterComponent.prototype.register = function () {
        var _this = this;
        this.busy = this.authenticationService.create(this.model)
            .subscribe(function (data) {
            _this.submitted = true;
        }, function (error) {
            _this.error = error;
        });
    };
    RegisterComponent.prototype.cancel = function () {
        this.user.emit(null);
    };
    RegisterComponent.prototype.close = function () {
        this.user.emit(this.authenticationService.user_profile);
    };
    return RegisterComponent;
}());
__decorate([
    core_2.Output(),
    __metadata("design:type", Object)
], RegisterComponent.prototype, "user", void 0);
RegisterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'register.component.html'
    }),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map