/*
 * Password Management Servlets (PWM)
 * http://www.pwm-project.org
 *
 * Copyright (c) 2006-2009 Novell, Inc.
 * Copyright (c) 2009-2018 The PWM Project
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */


import {IComponentOptions, module} from 'angular';
import AppBarComponent from './app-bar.component';
import AutoCompleteComponent from './auto-complete.component';
import ButtonComponent from './button.component';
import DialogComponent from './dialog.component';
import IasDialogComponent from './ias-dialog.component';
// import { DialogService } from './dialog.service';
import IconButtonComponent from './icon-button.component';
import IconComponent from './icon.component';
import SearchBarComponent from './search-bar.component';
import TableDirectiveFactory from './table.directive';
import TableColumnDirectiveFactory from './table-column.directive';
import ElementSizeService from './element-size.service';
import TabsetDirective from './tabset.directive';
import DialogService from './ias-dialog.service';

var moduleName = 'peoplesearch.ux';

module(moduleName, [ ])
    .component('iasDialog', IasDialogComponent as IComponentOptions)
    .component('mfAppBar', AppBarComponent as IComponentOptions)
    .component('mfAutoComplete', AutoCompleteComponent as IComponentOptions)
    .component('mfButton', ButtonComponent as IComponentOptions)
    .component('mfDialog', DialogComponent as IComponentOptions)
    .component('mfIconButton', IconButtonComponent as IComponentOptions)
    .component('mfIcon', IconComponent as IComponentOptions)
    .component('mfSearchBar', SearchBarComponent as IComponentOptions)
    .directive('mfTable', TableDirectiveFactory)
    .directive('mfTableColumn', TableColumnDirectiveFactory)
    .directive('mfTabset', TabsetDirective)
    .service('IasDialogService', DialogService)
    .service('MfElementSizeService', ElementSizeService);
    // .service('MfDialogService', DialogService);

export default moduleName;
