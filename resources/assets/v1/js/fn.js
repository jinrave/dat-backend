(function($){
    'use strict';
    const RouteCurrent = `${window.App.APP_ROUTE.split('/').pop()}`;
	$.fn.modal.Constructor.prototype.enforceFocus = function() {};
	$.fn.select2.defaults.set('allowClear', true);
    $.fn.select2.defaults.set('width', '100%');
	FormValidation.Validator.placeholder = {
        validate: function(validator, $field, options) {
            return $field.attr('placeholder') != $field.val();
        }
    };
    $.fn.callFormValidation = function(optionsFields){
        return this.formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'material-icons valid-icon',
                invalid: 'material-icons invalid-icon',
                validating: 'material-icons validating-icon'
            },
            locale: window.App.APP_LANG,
            fields: optionsFields
        });
    };
    $.fn.waitMeShow = function() {
        this.waitMe({
            effect: 'rotation',
            text: 'please waiting...',
            bg: 'rgba(255,255,255,0.90)',
            color: '#7F00FF'
        });
    };
    $.fn.waitMeHide = function() {
        this.waitMe('hide');
    };
    $.fn.formatPrice = function(){
        this.priceFormat({
            centsLimit:'',
            prefix: 'Rp',
            centsSeparator: ',',
            thousandsSeparator: '.',
            clearPrefix: false,
            allowNegative: false
        });
    };
    $.fn.callDatatables = function(columns, columnDefs, column, order, fixedColumns){
        let orderDefs, fixedColumn;
        if(typeof order == 'undefined' || typeof column == 'undefined'){
            orderDefs = [
                [0, 'desc']
            ];
        }else{
            orderDefs = [
                [column, order]
            ];
        }
        if(typeof fixedColumns == 'undefined'){
            fixedColumn = 0;
        }else{
            fixedColumn = fixedColumns;
        }
        let Buttons = [
            {
                extend: 'selected',
                text: '<span class="text-white"><i class="fa fa-trash"></i> <span class="hidden-xs">Multiple</span> Delete</span>',
                titleAttr: 'Multiple Delete',
                className: 'btn btn-sm btn-flat btn-danger',
                action: function ( e, dt, button, config ) {
                    let selected_id = [];
                    $.each(dt.rows( { selected: true } ).data(), (i, v) => {
                        selected_id.push(v.id);
                    });
                    button.sweetAlert(`${selected_id.length} ${RouteCurrent} ${Label.sweetText}`)
                    .then((aggre) => {
                        if (aggre) {
                            $('.content').find('.box').waitMeShow();
                            const Axios = button.destroyMany(window.App.APP_ROUTE, selected_id);
                            Axios.then((response) => {
                                successResponse(response.data);
                                dt.ajax.reload();
                                setTimeout(() => $('.content').find('.box').waitMeHide(), 1000);
                            });
                            Axios.catch((error) => {
                                $('.content').find('.box').waitMeHide();
                                failedResponse(error);
                            });
                        }else{
                            swal(Label.sweetTextCancel, {
                                icon: 'error',
                            });
                        }
                    });
                }
            },
            {
                text: `<span class="text-white"><i class="fa fa-plus"></i> 
                    New <span class="hidden-xs">${RouteCurrent.toFisrstCase()}</span></span`,
                titleAttr: `New ${RouteCurrent.toFisrstCase()}`,
                className: `btn btn-sm btn-flat btn-success new-${RouteCurrent}`,
                action: ( e, dt, node, config ) => {}
            },
            {
                text: '<span class="text-white"><i class="fa fa-refresh"></i></span>',
                titleAttr: 'Refresh',
                className: 'btn btn-sm btn-flat btn-purple',
                action: ( e, dt, node, config ) => { dt.ajax.reload(); }
            },
        ];
        if(RouteCurrent === 'permissions' || RouteCurrent === 'access'){
            Buttons = [
                {
                    text: '<span class="text-white"><i class="fa fa-refresh"></i></span>',
                    titleAttr: 'Refresh',
                    className: 'btn btn-sm btn-flat btn-purple',
                    action: ( e, dt, node, config ) => { dt.ajax.reload(); }
                }
            ];
        }
        if(RouteCurrent == 'purchase'){
            Buttons = [
                {
                    text: `<span class="text-white"><i class="fa fa-plus"></i> 
                        New <span class="hidden-xs">${RouteCurrent.toFisrstCase()}</span></span`,
                    titleAttr: `New ${RouteCurrent.toFisrstCase()}`,
                    className: `btn btn-sm btn-flat btn-success new-${RouteCurrent}`,
                    action: ( e, dt, node, config ) => {}
                },
                {
                    text: '<span class="text-white"><i class="fa fa-refresh"></i></span>',
                    titleAttr: 'Refresh',
                    className: 'btn btn-sm btn-flat btn-purple',
                    action: ( e, dt, node, config ) => { dt.ajax.reload(); }
                },
            ];
        }
        return this.DataTable({
            dom: '<"row"<"col-sm-12 mb-10 text-right"B><"col-sm-6 col-xs-4"l><"col-sm-6 col-xs-8"f>>' +
                '<"row"<"col-sm-12"tr>>' +
                '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            buttons: Buttons,
            // bFilter:true,
            processing: true,
            serverSide: true,
            destroy: true,
            searching: true,
            ordering: true,
            rowReorder: false,
            colReorder: true,
            fixedHeader: true,
            scrollY: 300,
            scrollCollapse: true,
            deferRender: true,
            scroller: true,
            language: {
                processing: '',
                search: '_INPUT_',
                searchPlaceholder: 'Search...',
                lengthMenu: '_MENU_',
                // 'zeroRecords': 'Data Tidak Tersedia',
                // 'info': 'Menampilkan dari _PAGE_ ke _PAGES_ dari _MAX_ data',
                // 'infoEmpty': 'Menampilkan dari 0 ke 0 dari _MAX_ data',
                // 'infoFiltered': '(Filter dari _MAX_ total data)',
                // 'sSearch': 'Cari ',
                // 'oPaginate': {
                //     'sNext' : 'Selanjutnya',
                //     'sPrevious' : 'Sebelumnya',
                // },
            },
            search: {
                'regex': true
            },
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, Label.all]],
            ajax: window.App.APP_ROUTE,
            columns: columns,
            columnDefs: columnDefs,
            order: orderDefs,
            responsive: true,
            rowId: 'id',
            select: RouteCurrent == 'purchase' || RouteCurrent == 'access' || RouteCurrent == 'permissions' ? false : {
                style: 'multi'
            },
            fnCreatedRow: function (row, data, index) {
                $('td', row).eq(0).html(index + 1);
            },
            drawCallback: function(){
                if($('.tax_amount_table').length){
                    $('.tax_amount_table').change(function(e){
                        const id = $(this).data('id');
                        const tax_value = $(this).prop('checked');
                        purchasingData({
                            id: id, tax_amount: tax_value
                        });
                    }).bootstrapToggle();
                }
            }
        });
    };
    $.fn.passwordStrength = function() {
        var score = 0, value = this.val();

        // Check the password strength
        score += ((value.length >= 8) ? 1 : -1);

        // The password contains uppercase character
        if (/[A-Z]/.test(value)) {
            score += 1;
        }

        // The password contains uppercase character
        if (/[a-z]/.test(value)) {
            score += 1;
        }

        // The password contains number
        if (/[0-9]/.test(value)) {
            score += 1;
        }

        // The password contains special characters
        if (/[!#$%&^~*_]/.test(value)) {
            score += 1;
        }
        var score = score,
            $bar  = $('.progress').find('.progress-bar');

        switch (true) {
            case (score === null):
                $bar.html('').css('width', '0%').removeClass()
                .addClass('progress-bar-striped progress-bar')
                .parents('.progress').addClass('active');
                break;

            case (score <= 0):
                $bar.html('Very weak').css('width', '25%').removeClass()
                .addClass('progress-bar-striped progress-bar progress-bar-danger')
                .parents('.progress').addClass('active');
                break;

            case (score > 0 && score <= 2):
                $bar.html('Weak').css('width', '50%').removeClass()
                .addClass('progress-bar-striped progress-bar progress-bar-warning')
                .parents('.progress').addClass('active');
                break;

            case (score > 2 && score <= 4):
                $bar.html('Medium').css('width', '75%').removeClass()
                .addClass('progress-bar-striped progress-bar progress-bar-info')
                .parents('.progress').addClass('active');
                break;

            case (score > 4):
                $bar.html('Strong').css('width', '100%').removeClass()
                .addClass('progress-bar-striped progress-bar progress-bar-success')
                .parents('.progress').addClass('active');
                break;

            default:
                break;
        }
    };
    $.fn.filterNavigateMenu = function () {
        // Declare variables
        var input, filter, ul, li, a, i;
        input = document.getElementById('filterNavigateMenu');
        filter = input.value.toUpperCase();
        ul = document.getElementById('sidebar-menu');
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = $(li[i]).find('a span');
            if (a.text().toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = '';
            } else {
                li[i].style.display = 'none';
            }
        }
    };
    $.fn.sweetAlert = function(title){
        return swal({
            title: Label.sweetTitle,
            text: typeof title == 'undefined' ? 
            `1 ${RouteCurrent} ${Label.sweetText}` : title,
            icon: 'warning',
            buttons: true,
            dangerMode: false,
            closeOnEsc: false,
            closeOnClickOutside: false,
        });
    };
    $.fn.callSelect2 = function(options){
        if(typeof options == 'undefined'){
            return this.select2({
                placeholder: `-- ${Label.options} --`,
                allowClear: true,
                width: typeof options == 'undefined' ? '100%' : options.width,
                dropdownParent: typeof options == 'undefined' ? null : options.modal
            });
        }else{
            return this.select2({
                placeholder: `-- ${Label.options} --`,
                allowClear: true,
                width: options.width  == 'undefined' ? '100%' : options.width,
                dropdownParent: options.modal,
                ajax: {
                    url: options.url,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            query: params.term, // search term
                            page: params.page
                        };
                    },
                    processResults: function (data, params) {
                        params.page = params.page || 1;
                        return {
                            results: data.data,
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    cache: true
                }
            });
        }
    };
    $.fn.setValueSelect2 = function(data){
        const newOption = new Option(data.text, data.id, true, true);
        return this.append(newOption).trigger('change');
    }
    $.fn.loading = function(bool){
        let _this = this;
        if(bool === true){
            _this.addClass('running').prop('disabled', bool);
        }else{
            _this.removeClass('running').prop('disabled', bool);
        }
    };
    $.fn.numbering = function(){
        let i = 0;
        this.each(function() {
            i++;
            $(this).text(i);
        });
    };
    $.fn.progress = function() {
        const elem = this;
        let width = 0;
        const id = setInterval(() => {
            if (width >= 100) {
                clearInterval(id);
                setTimeout(() => {
                    elem.parent().css('display', 'none');
                }, 1000);
            } else {
                width++; 
                elem.parent().css('display', 'block');
                elem.css('width', width + '%');
            }
        }, 10);
    };
    $.fn.destroy = function(route){
        return axios({
            method: 'delete',
            url: route,
            data: null,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    $.fn.destroyMany = function(route, data){
        return axios({
            method: 'delete',
            url: route,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    $.fn.checkboxRequest = function(){
        const that = this;
        that.iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        }).on('ifToggled', (e) => {
            that.parents('.box').waitMeShow();
            const _this = $(e.target);
            const Axios = axios.post(window.App.APP_ROUTE, {
                status : _this.is(':checked'),
                roles : _this.data('roles'),
                permissions : _this.data('permissions')
            });
            Axios.then((response) => {
                success(response.data.message);
                that.parents('.box').waitMeHide();
            });
            Axios.catch((error) => {
                danger(error.response.statusText);
                _this.prop('checked', _this.is(':checked') === true ? false : true);
                that.parents('.box').waitMeHide();
            });
        });
    };
    $.fn.callIonSlider = function(callback, min, max, from, to, step, grid, prefix, postfix, fromFixed, toFixed, type) {
        $(this).ionRangeSlider({
            type: typeof type != 'undefined' ? type : "single",
            min: typeof min != 'undefined' ? min : 0,
            max: typeof max != 'undefined' ? max : 1000000000,
            from: typeof from != 'undefined' ? from : 0,
            to: typeof to != 'undefined' ? to : 0,
            grid: true,
            skin: "modern",
            grid_num: typeof grid != 'undefined' ? grid : 10,
            step: typeof step != 'undefined' ? step : 1,
            prefix: typeof prefix != 'undefined' ? prefix : '',
            postfix: typeof postfix != 'undefined' ? postfix : '',
            from_fixed: typeof fromFixed != 'undefined' ? fromFixed : true,
            to_fixed: typeof toFixed != 'undefined' ? toFixed : true,
            onStart: function (data) {
                // fired then range slider is ready
                callback(data);
            },
            onChange: function (data) {
                // fired on every range slider update
                callback(data);
            },
            onFinish: function (data) {
                // fired on pointer release
                callback(data);
            },
            onUpdate: function (data) {
                // fired on changing slider with Update method
                callback(data);
            }
        });
    }
    $.fn.ionSliderPercent = function(callback, from, to, type, fromFixed, toFixed) {
        let callbackData, fromData, toData, typeData, fromFixedData, toFixedData;
        callbackData  = typeof callback != 'undefined' ? callback : function(){};
        fromData      = typeof from != 'undefined' ? from : 0.00;
        toData        = typeof to != 'undefined' ? to : 100.00;
        typeData      = typeof type != 'undefined' ? type : 'single';
        fromFixedData = typeof fromFixed != 'undefined' ? fromFixed : false;
        toFixedData   = typeof toFixed != 'undefined' ? toFixed : false;
        $($(this)).callIonSlider(callbackData, 0.00, 100.00, from, to, 0.01, 10, '', '%', fromFixedData, toFixedData, typeData);
        $($(this)).data('ionRangeSlider').update({
            from: fromData,
            to: toData,
        });
    }
}(jQuery));

window.toggleFullscreen = function() {
    let elem = document.querySelector("body");

    elem.requestFullscreen = elem.requestFullscreen || elem.mozRequestFullscreen
          || elem.msRequestFullscreen || elem.webkitRequestFullscreen;
    elem.onfullscreenchange = function(event){
        let elem = event.target;
        let isFullscreen = document.fullscreenElement === elem;
        const icon = isFullscreen ? 'contract' : 'expand';
        $('.btn-fullscreen').children('span').attr('class', `ion-android-${icon}`);
    }
    if (!document.fullscreenElement) {
        elem.requestFullscreen().then({}).catch(err => {
            warning(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
window.successResponse = function(response){
    if(response.status_code == 500){
        danger(response.message);
    }else if(response.status_code == 200){
        success(response.message);
    }else if(response.status_code == 404){
        warning(response.message);
    }else{
        info(response.message);
    }
}
window.failedResponse = function(error){
    danger(error.response.data.message);
}
window.notify = function(icon, iconColor, title, message){
    iziToast.show({
        id: 'haduken',
        theme: 'dark',
        icon: icon,
        title: title,
        displayMode: 2,
        message: message,
        position: 'bottomRight',
        transitionIn: 'fadeInLeft',
        transitionOut: 'fadeOutRight',
        progressBarColor: 'rgb(0, 255, 184)',
        image: 'images/notifyer.png',
        imageWidth: 70,
        layout: 2,
        onClosing: function(){
            console.info('onClosing');
        },
        onClosed: function(instance, toast, closedBy){
            console.info('Closed | closedBy: ' + closedBy);
        },
        iconColor: iconColor
    });
};
window.info = function(message){
    notify('ion-information-circled', '#00B5E3', 'Information', message);
};
window.success = function(message){
    notify('ion-android-done-all', 'rgb(0, 255, 184)', 'Successfully', message);
};
window.danger = function(message){
    notify('ion-close', '#ff6b81', 'Oops', message);
};
window.warning = function(message){
    notify('ion-android-hand', '#FFC107', 'Warning', message);
};
window.justNumber = function(event) {
    const key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46) {
        return true;
    } else if ( key < 48 || key > 57 ) {
        return false;
    } else {
        return true;
    }
};
window.toPrice = function(string){
    let number, data, reserve;
    if(isNaN(string) || string === '') { 
        number = 0; 
    }else{
        data = parseInt(string, 10).toString().split('').reverse().join('');
        reserve = '';
        for(let i = 0; i < data.length; i++){
            reserve += data[i];
            if((i + 1) % 3 === 0 && i !== (data.length - 1)){
                reserve += '.';
            }
        }
        number = reserve.split('').reverse().join('');
        
    }
    return `Rp${number}`;
}

window.toInt = function(string){
    return string.replace(/\D/g, "");
}

window.addImages = function(id){
    $('#'+id).click();
}

window.updloadImages = function(id){
    var URL = window.URL || window.webkitURL;
    var val = $('#'+id).val();
    var input = document.querySelector('#'+id);
    var preview = document.querySelector('#img_'+id);
    preview.src = URL.createObjectURL(input.files[0]);

    preview.addEventListener('load', function () {
        $('.add_'+id).hide();
        $('.preview_'+id).removeClass('hidden').show();
        URL.revokeObjectURL(this.src);
        $('#remove_'+id).val('');

        $(".viewPix-foto").css("line-height", "0");
        $(".viewPix-foto").css("min-height", "0");
    });
}

window.removeImages = function(id, height){
    $('#'+id).val('');
    $('.add_'+id).removeClass('hidden').show();
    $('#remove_'+id).val('remove');
    $('.preview_'+id).hide();
    $(".viewPix-foto").css("line-height", height);
    $(".viewPix-foto").css("min-height", height);
}