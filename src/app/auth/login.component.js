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
var LoginComponent = (function () {
    function LoginComponent(authenticationService) {
        this.authenticationService = authenticationService;
        this.model = {};
        this.error = '';
        this.user = new core_2.EventEmitter();
    }
    LoginComponent.prototype.ngOnInit = function () {
        // reset login status
        this.authenticationService.logout();
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.busy = this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(function (result) {
            if (result === true) {
                _this.user.emit(_this.authenticationService.user_profile);
            }
            else {
                _this.error = 'Username or password is incorrect';
            }
        }, function (err) {
            // Log errors if any
            console.log(err);
            _this.error = 'Username or password is incorrect';
        });
    };
    LoginComponent.prototype.cancel = function () {
        this.user.emit(null);
    };
    return LoginComponent;
}());
__decorate([
    core_2.Output(),
    __metadata("design:type", Object)
], LoginComponent.prototype, "user", void 0);
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'login.component.html'
    }),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map