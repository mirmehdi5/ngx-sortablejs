import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, Renderer2, } from '@angular/core';
import Sortable from 'sortablejs';
import { GLOBALS } from './globals';
import { SortablejsBindings } from './sortablejs-bindings';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
import * as i1 from "./sortablejs.service";
const getIndexesFromEvent = (event) => {
    if (event.hasOwnProperty('newDraggableIndex') && event.hasOwnProperty('oldDraggableIndex')) {
        return {
            new: event.newDraggableIndex,
            old: event.oldDraggableIndex,
        };
    }
    else {
        return {
            new: event.newIndex,
            old: event.oldIndex,
        };
    }
};
export class SortablejsDirective {
    constructor(globalConfig, service, element, zone, renderer) {
        this.globalConfig = globalConfig;
        this.service = service;
        this.element = element;
        this.zone = zone;
        this.renderer = renderer;
        this.sortablejsInit = new EventEmitter();
    }
    ngOnInit() {
        if (Sortable && Sortable.create) { // Sortable does not exist in angular universal (SSR)
            this.create();
        }
    }
    ngOnChanges(changes) {
        const optionsChange = changes.sortablejsOptions;
        if (optionsChange && !optionsChange.isFirstChange()) {
            const previousOptions = optionsChange.previousValue;
            const currentOptions = optionsChange.currentValue;
            Object.keys(currentOptions).forEach(optionName => {
                if (currentOptions[optionName] !== previousOptions[optionName]) {
                    // use low-level option setter
                    this.sortableInstance.option(optionName, this.options[optionName]);
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
        }
    }
    create() {
        const container = this.sortablejsContainer ? this.element.nativeElement.querySelector(this.sortablejsContainer) : this.element.nativeElement;
        setTimeout(() => {
            this.sortableInstance = Sortable.create(container, this.options);
            this.sortablejsInit.emit(this.sortableInstance);
        }, 0);
    }
    getBindings() {
        if (!this.sortablejs) {
            return new SortablejsBindings([]);
        }
        else if (this.sortablejs instanceof SortablejsBindings) {
            return this.sortablejs;
        }
        else {
            return new SortablejsBindings([this.sortablejs]);
        }
    }
    get options() {
        return { ...this.optionsWithoutEvents, ...this.overridenOptions };
    }
    get optionsWithoutEvents() {
        return { ...(this.globalConfig || {}), ...(this.sortablejsOptions || {}) };
    }
    proxyEvent(eventName, ...params) {
        this.zone.run(() => {
            if (this.optionsWithoutEvents && this.optionsWithoutEvents[eventName]) {
                this.optionsWithoutEvents[eventName](...params);
            }
        });
    }
    get isCloning() {
        return this.sortableInstance.options.group.checkPull(this.sortableInstance, this.sortableInstance) === 'clone';
    }
    clone(item) {
        // by default pass the item through, no cloning performed
        return (this.sortablejsCloneFunction || (subitem => subitem))(item);
    }
    get overridenOptions() {
        // always intercept standard events but act only in case items are set (bindingEnabled)
        // allows to forget about tracking this.items changes
        return {
            onAdd: (event) => {
                this.service.transfer = (items) => {
                    this.getBindings().injectIntoEvery(event.newIndex, items);
                    this.proxyEvent('onAdd', event);
                };
                this.proxyEvent('onAddOriginal', event);
            },
            onRemove: (event) => {
                const bindings = this.getBindings();
                if (bindings.provided) {
                    if (this.isCloning) {
                        this.service.transfer(bindings.getFromEvery(event.oldIndex).map(item => this.clone(item)));
                        // great thanks to https://github.com/tauu
                        // event.item is the original item from the source list which is moved to the target list
                        // event.clone is a clone of the original item and will be added to source list
                        // If bindings are provided, adding the item dom element to the target list causes artifacts
                        // as it interferes with the rendering performed by the angular template.
                        // Therefore we remove it immediately and also move the original item back to the source list.
                        // (event handler may be attached to the original item and not its clone, therefore keeping
                        // the original dom node, circumvents side effects )
                        this.renderer.removeChild(event.item.parentNode, event.item);
                        this.renderer.insertBefore(event.clone.parentNode, event.item, event.clone);
                        this.renderer.removeChild(event.clone.parentNode, event.clone);
                    }
                    else {
                        this.service.transfer(bindings.extractFromEvery(event.oldIndex));
                    }
                    this.service.transfer = null;
                }
                this.proxyEvent('onRemove', event);
            },
            onUpdate: (event) => {
                const bindings = this.getBindings();
                const indexes = getIndexesFromEvent(event);
                bindings.injectIntoEvery(indexes.new, bindings.extractFromEvery(indexes.old));
                this.proxyEvent('onUpdate', event);
            },
        };
    }
}
/** @nocollapse */ SortablejsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SortablejsDirective, deps: [{ token: GLOBALS, optional: true }, { token: i1.SortablejsService }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ SortablejsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.3", type: SortablejsDirective, selector: "[sortablejs]", inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction" }, outputs: { sortablejsInit: "sortablejsInit" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SortablejsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[sortablejs]',
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [GLOBALS]
                }] }, { type: i1.SortablejsService }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, propDecorators: { sortablejs: [{
                type: Input
            }], sortablejsContainer: [{
                type: Input
            }], sortablejsOptions: [{
                type: Input
            }], sortablejsCloneFunction: [{
                type: Input
            }], sortablejsInit: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLFFBQW1CLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUl2RCxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO0lBQ25ELElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUMxRixPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7U0FDN0IsQ0FBQztLQUNIO1NBQU07UUFDTCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ25CLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUNwQixDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUM7QUFLRixNQUFNLE9BQU8sbUJBQW1CO0lBa0I5QixZQUN1QyxZQUFxQixFQUNsRCxPQUEwQixFQUMxQixPQUFtQixFQUNuQixJQUFZLEVBQ1osUUFBbUI7UUFKVSxpQkFBWSxHQUFaLFlBQVksQ0FBUztRQUNsRCxZ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Q0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTNDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQzs7bUlBbEpVLG1CQUFtQixrQkFtQlIsT0FBTzt1SEFuQmxCLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUgvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO2lCQUN6Qjs7MEJBb0JJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsT0FBTztrSkFoQjdCLFVBQVU7c0JBRFQsS0FBSztnQkFJTixtQkFBbUI7c0JBRGxCLEtBQUs7Z0JBSU4saUJBQWlCO3NCQURoQixLQUFLO2dCQUlOLHVCQUF1QjtzQkFEdEIsS0FBSztnQkFLSSxjQUFjO3NCQUF2QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsXHJcbiAgRWxlbWVudFJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSW5qZWN0LFxyXG4gIElucHV0LFxyXG4gIE5nWm9uZSxcclxuICBPbkNoYW5nZXMsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9uSW5pdCxcclxuICBPcHRpb25hbCxcclxuICBPdXRwdXQsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIFNpbXBsZUNoYW5nZSxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IFNvcnRhYmxlLCB7T3B0aW9uc30gZnJvbSAnc29ydGFibGVqcyc7XHJcbmltcG9ydCB7R0xPQkFMU30gZnJvbSAnLi9nbG9iYWxzJztcclxuaW1wb3J0IHtTb3J0YWJsZWpzQmluZGluZ3N9IGZyb20gJy4vc29ydGFibGVqcy1iaW5kaW5ncyc7XHJcbmltcG9ydCB7U29ydGFibGVqc1NlcnZpY2V9IGZyb20gJy4vc29ydGFibGVqcy5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCB0eXBlIFNvcnRhYmxlRGF0YSA9IGFueSB8IGFueVtdO1xyXG5cclxuY29uc3QgZ2V0SW5kZXhlc0Zyb21FdmVudCA9IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xyXG4gIGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eSgnbmV3RHJhZ2dhYmxlSW5kZXgnKSAmJiBldmVudC5oYXNPd25Qcm9wZXJ0eSgnb2xkRHJhZ2dhYmxlSW5kZXgnKSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmV3OiBldmVudC5uZXdEcmFnZ2FibGVJbmRleCxcclxuICAgICAgb2xkOiBldmVudC5vbGREcmFnZ2FibGVJbmRleCxcclxuICAgIH07XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5ldzogZXZlbnQubmV3SW5kZXgsXHJcbiAgICAgIG9sZDogZXZlbnQub2xkSW5kZXgsXHJcbiAgICB9O1xyXG4gIH1cclxufTtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW3NvcnRhYmxlanNdJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcclxuXHJcbiAgQElucHV0KClcclxuICBzb3J0YWJsZWpzOiBTb3J0YWJsZURhdGE7IC8vIGFycmF5IG9yIGEgRm9ybUFycmF5XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgc29ydGFibGVqc0NvbnRhaW5lcjogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNvcnRhYmxlanNPcHRpb25zOiBPcHRpb25zO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNvcnRhYmxlanNDbG9uZUZ1bmN0aW9uOiAoaXRlbTogYW55KSA9PiBhbnk7XHJcblxyXG4gIHByaXZhdGUgc29ydGFibGVJbnN0YW5jZTogYW55O1xyXG5cclxuICBAT3V0cHV0KCkgc29ydGFibGVqc0luaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChHTE9CQUxTKSBwcml2YXRlIGdsb2JhbENvbmZpZzogT3B0aW9ucyxcclxuICAgIHByaXZhdGUgc2VydmljZTogU29ydGFibGVqc1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKFNvcnRhYmxlICYmIFNvcnRhYmxlLmNyZWF0ZSkgeyAvLyBTb3J0YWJsZSBkb2VzIG5vdCBleGlzdCBpbiBhbmd1bGFyIHVuaXZlcnNhbCAoU1NSKVxyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcCBpbiBrZXlvZiBTb3J0YWJsZWpzRGlyZWN0aXZlXTogU2ltcGxlQ2hhbmdlIH0pIHtcclxuICAgIGNvbnN0IG9wdGlvbnNDaGFuZ2U6IFNpbXBsZUNoYW5nZSA9IGNoYW5nZXMuc29ydGFibGVqc09wdGlvbnM7XHJcblxyXG4gICAgaWYgKG9wdGlvbnNDaGFuZ2UgJiYgIW9wdGlvbnNDaGFuZ2UuaXNGaXJzdENoYW5nZSgpKSB7XHJcbiAgICAgIGNvbnN0IHByZXZpb3VzT3B0aW9uczogT3B0aW9ucyA9IG9wdGlvbnNDaGFuZ2UucHJldmlvdXNWYWx1ZTtcclxuICAgICAgY29uc3QgY3VycmVudE9wdGlvbnM6IE9wdGlvbnMgPSBvcHRpb25zQ2hhbmdlLmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPcHRpb25zKS5mb3JFYWNoKG9wdGlvbk5hbWUgPT4ge1xyXG4gICAgICAgIGlmIChjdXJyZW50T3B0aW9uc1tvcHRpb25OYW1lXSAhPT0gcHJldmlvdXNPcHRpb25zW29wdGlvbk5hbWVdKSB7XHJcbiAgICAgICAgICAvLyB1c2UgbG93LWxldmVsIG9wdGlvbiBzZXR0ZXJcclxuICAgICAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZS5vcHRpb24ob3B0aW9uTmFtZSwgdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5zb3J0YWJsZUluc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuc29ydGFibGVqc0NvbnRhaW5lciA/IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zb3J0YWJsZWpzQ29udGFpbmVyKSA6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLnNvcnRhYmxlSW5zdGFuY2UgPSBTb3J0YWJsZS5jcmVhdGUoY29udGFpbmVyLCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgICB0aGlzLnNvcnRhYmxlanNJbml0LmVtaXQodGhpcy5zb3J0YWJsZUluc3RhbmNlKTtcclxuICAgIH0sIDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRCaW5kaW5ncygpOiBTb3J0YWJsZWpzQmluZGluZ3Mge1xyXG4gICAgaWYgKCF0aGlzLnNvcnRhYmxlanMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBTb3J0YWJsZWpzQmluZGluZ3MoW10pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNvcnRhYmxlanMgaW5zdGFuY2VvZiBTb3J0YWJsZWpzQmluZGluZ3MpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc29ydGFibGVqcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBuZXcgU29ydGFibGVqc0JpbmRpbmdzKFt0aGlzLnNvcnRhYmxlanNdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gey4uLnRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHMsIC4uLnRoaXMub3ZlcnJpZGVuT3B0aW9uc307XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBvcHRpb25zV2l0aG91dEV2ZW50cygpIHtcclxuICAgIHJldHVybiB7Li4uKHRoaXMuZ2xvYmFsQ29uZmlnIHx8IHt9KSwgLi4uKHRoaXMuc29ydGFibGVqc09wdGlvbnMgfHwge30pfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJveHlFdmVudChldmVudE5hbWU6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7IC8vIHJlLWVudGVyaW5nIHpvbmUsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vU29ydGFibGVKUy9hbmd1bGFyLXNvcnRhYmxlanMvaXNzdWVzLzExMCNpc3N1ZWNvbW1lbnQtNDA4ODc0NjAwXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzICYmIHRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHNbZXZlbnROYW1lXSguLi5wYXJhbXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IGlzQ2xvbmluZygpIHtcclxuICAgIHJldHVybiB0aGlzLnNvcnRhYmxlSW5zdGFuY2Uub3B0aW9ucy5ncm91cC5jaGVja1B1bGwodGhpcy5zb3J0YWJsZUluc3RhbmNlLCB0aGlzLnNvcnRhYmxlSW5zdGFuY2UpID09PSAnY2xvbmUnO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbG9uZTxUPihpdGVtOiBUKTogVCB7XHJcbiAgICAvLyBieSBkZWZhdWx0IHBhc3MgdGhlIGl0ZW0gdGhyb3VnaCwgbm8gY2xvbmluZyBwZXJmb3JtZWRcclxuICAgIHJldHVybiAodGhpcy5zb3J0YWJsZWpzQ2xvbmVGdW5jdGlvbiB8fCAoc3ViaXRlbSA9PiBzdWJpdGVtKSkoaXRlbSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBvdmVycmlkZW5PcHRpb25zKCk6IE9wdGlvbnMge1xyXG4gICAgLy8gYWx3YXlzIGludGVyY2VwdCBzdGFuZGFyZCBldmVudHMgYnV0IGFjdCBvbmx5IGluIGNhc2UgaXRlbXMgYXJlIHNldCAoYmluZGluZ0VuYWJsZWQpXHJcbiAgICAvLyBhbGxvd3MgdG8gZm9yZ2V0IGFib3V0IHRyYWNraW5nIHRoaXMuaXRlbXMgY2hhbmdlc1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgb25BZGQ6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlciA9IChpdGVtczogYW55W10pID0+IHtcclxuICAgICAgICAgIHRoaXMuZ2V0QmluZGluZ3MoKS5pbmplY3RJbnRvRXZlcnkoZXZlbnQubmV3SW5kZXgsIGl0ZW1zKTtcclxuICAgICAgICAgIHRoaXMucHJveHlFdmVudCgnb25BZGQnLCBldmVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvbkFkZE9yaWdpbmFsJywgZXZlbnQpO1xyXG4gICAgICB9LFxyXG4gICAgICBvblJlbW92ZTogKGV2ZW50OiBTb3J0YWJsZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgYmluZGluZ3MgPSB0aGlzLmdldEJpbmRpbmdzKCk7XHJcblxyXG4gICAgICAgIGlmIChiaW5kaW5ncy5wcm92aWRlZCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNDbG9uaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlcihiaW5kaW5ncy5nZXRGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpLm1hcChpdGVtID0+IHRoaXMuY2xvbmUoaXRlbSkpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGdyZWF0IHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vdGF1dVxyXG4gICAgICAgICAgICAvLyBldmVudC5pdGVtIGlzIHRoZSBvcmlnaW5hbCBpdGVtIGZyb20gdGhlIHNvdXJjZSBsaXN0IHdoaWNoIGlzIG1vdmVkIHRvIHRoZSB0YXJnZXQgbGlzdFxyXG4gICAgICAgICAgICAvLyBldmVudC5jbG9uZSBpcyBhIGNsb25lIG9mIHRoZSBvcmlnaW5hbCBpdGVtIGFuZCB3aWxsIGJlIGFkZGVkIHRvIHNvdXJjZSBsaXN0XHJcbiAgICAgICAgICAgIC8vIElmIGJpbmRpbmdzIGFyZSBwcm92aWRlZCwgYWRkaW5nIHRoZSBpdGVtIGRvbSBlbGVtZW50IHRvIHRoZSB0YXJnZXQgbGlzdCBjYXVzZXMgYXJ0aWZhY3RzXHJcbiAgICAgICAgICAgIC8vIGFzIGl0IGludGVyZmVyZXMgd2l0aCB0aGUgcmVuZGVyaW5nIHBlcmZvcm1lZCBieSB0aGUgYW5ndWxhciB0ZW1wbGF0ZS5cclxuICAgICAgICAgICAgLy8gVGhlcmVmb3JlIHdlIHJlbW92ZSBpdCBpbW1lZGlhdGVseSBhbmQgYWxzbyBtb3ZlIHRoZSBvcmlnaW5hbCBpdGVtIGJhY2sgdG8gdGhlIHNvdXJjZSBsaXN0LlxyXG4gICAgICAgICAgICAvLyAoZXZlbnQgaGFuZGxlciBtYXkgYmUgYXR0YWNoZWQgdG8gdGhlIG9yaWdpbmFsIGl0ZW0gYW5kIG5vdCBpdHMgY2xvbmUsIHRoZXJlZm9yZSBrZWVwaW5nXHJcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBkb20gbm9kZSwgY2lyY3VtdmVudHMgc2lkZSBlZmZlY3RzIClcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZChldmVudC5pdGVtLnBhcmVudE5vZGUsIGV2ZW50Lml0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmluc2VydEJlZm9yZShldmVudC5jbG9uZS5wYXJlbnROb2RlLCBldmVudC5pdGVtLCBldmVudC5jbG9uZSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZXZlbnQuY2xvbmUucGFyZW50Tm9kZSwgZXZlbnQuY2xvbmUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLnRyYW5zZmVyKGJpbmRpbmdzLmV4dHJhY3RGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblJlbW92ZScsIGV2ZW50KTtcclxuICAgICAgfSxcclxuICAgICAgb25VcGRhdGU6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGJpbmRpbmdzID0gdGhpcy5nZXRCaW5kaW5ncygpO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRJbmRleGVzRnJvbUV2ZW50KGV2ZW50KTtcclxuXHJcbiAgICAgICAgYmluZGluZ3MuaW5qZWN0SW50b0V2ZXJ5KGluZGV4ZXMubmV3LCBiaW5kaW5ncy5leHRyYWN0RnJvbUV2ZXJ5KGluZGV4ZXMub2xkKSk7XHJcbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblVwZGF0ZScsIGV2ZW50KTtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxufVxyXG5cclxuaW50ZXJmYWNlIFNvcnRhYmxlRXZlbnQge1xyXG4gIG9sZEluZGV4OiBudW1iZXI7XHJcbiAgbmV3SW5kZXg6IG51bWJlcjtcclxuICBvbGREcmFnZ2FibGVJbmRleD86IG51bWJlcjtcclxuICBuZXdEcmFnZ2FibGVJbmRleD86IG51bWJlcjtcclxuICBpdGVtOiBIVE1MRWxlbWVudDtcclxuICBjbG9uZTogSFRNTEVsZW1lbnQ7XHJcbn1cclxuIl19