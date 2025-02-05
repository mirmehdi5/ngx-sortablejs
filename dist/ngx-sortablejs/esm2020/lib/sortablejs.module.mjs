import { NgModule } from '@angular/core';
import { GLOBALS } from './globals';
import { SortablejsDirective } from './sortablejs.directive';
import * as i0 from "@angular/core";
export class SortablejsModule {
    static forRoot(globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
            ],
        };
    }
}
/** @nocollapse */ SortablejsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SortablejsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ SortablejsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: SortablejsModule, declarations: [SortablejsDirective], exports: [SortablejsDirective] });
/** @nocollapse */ SortablejsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SortablejsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SortablejsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SortablejsDirective],
                    exports: [SortablejsDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBc0IsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBTzNELE1BQU0sT0FBTyxnQkFBZ0I7SUFFcEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFzQjtRQUMxQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUM7YUFDNUM7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Z0lBVFUsZ0JBQWdCO2lJQUFoQixnQkFBZ0IsaUJBSFosbUJBQW1CLGFBQ3hCLG1CQUFtQjtpSUFFbEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBSjVCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUMvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0dMT0JBTFN9IGZyb20gJy4vZ2xvYmFscyc7XHJcbmltcG9ydCB7U29ydGFibGVqc0RpcmVjdGl2ZX0gZnJvbSAnLi9zb3J0YWJsZWpzLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7T3B0aW9uc30gZnJvbSAnc29ydGFibGVqcyc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW1NvcnRhYmxlanNEaXJlY3RpdmVdLFxyXG4gIGV4cG9ydHM6IFtTb3J0YWJsZWpzRGlyZWN0aXZlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNNb2R1bGUge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoZ2xvYmFsT3B0aW9uczogT3B0aW9ucyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U29ydGFibGVqc01vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IFNvcnRhYmxlanNNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHtwcm92aWRlOiBHTE9CQUxTLCB1c2VWYWx1ZTogZ2xvYmFsT3B0aW9uc30sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn1cclxuIl19