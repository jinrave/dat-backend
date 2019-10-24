/**
 * NPM PACKAGES
 */

require('admin-lte-sass/build/bootstrap/js/bootstrap.js');
require('admin-lte-sass/build/js/app.js');
require('admin-lte-sass/build/js/demo.js');
require('admin-lte-sass/plugins/slimScroll/jquery.slimscroll.js');
require('admin-lte-sass/plugins/iCheck/icheck.js');
require('select2/dist/js/select2.full.js');
require('jquery-price-format');
require('jquery-mousewheel');
require('lightgallery.js');
require('datatables.net/js/jquery.dataTables.js');
require('datatables.net-bs/js/dataTables.bootstrap.js');
require('datatables.net-buttons-bs/js/buttons.bootstrap.js');
require('datatables.net-colreorder-bs/js/colReorder.bootstrap.js');
require('datatables.net-rowreorder-bs/js/rowReorder.bootstrap.js');
require('datatables.net-responsive-bs/js/responsive.bootstrap.js');
require('datatables.net-fixedheader-bs/js/fixedHeader.bootstrap.js');
require('datatables.net-fixedcolumns-bs/js/fixedColumns.bootstrap.js');
require('datatables.net-select-bs/js/select.bootstrap.js');

import swal from 'sweetalert';
import Typed from 'typed.js';
import moment from 'moment';
import Mousetrap from 'mousetrap';
import iziToast from 'izitoast';
import Offline from 'offline-js';
import idleJs from 'idle-js';

const store = require('store'); // https://github.com/marcuswestin/store.js
const Cookies = require('js-cookie');

window.Typed = Typed;
window.moment = moment;
window.Mousetrap = Mousetrap;
window.iziToast = iziToast;
window.Cookies = Cookies;
window.store = store;
window.idleJs = idleJs;

moment.locale('id');
