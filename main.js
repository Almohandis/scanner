// document.oncontextmenu = function() {return false;}; //to desable right click
$.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
});
var $myHost = window.location.origin;
$.fn.select2.defaults.set("theme", "bootstrap");
//Get Time And Date Form Server
function TimeAndDate(callB){
    $.getJSON( $myHost + '/x/TimeAndDate', function(D) {
        callB(D);
    });  
}
// Load log names in select in insart page
if($("#logname").length){
    $.getJSON( $myHost + '/x/logname/insert', function(data) {
        $.each(data, function(index, item) { // Iterates through a collection
            $("#logname").append( // Append an object to the inside of the select box
                $("<option></option>").text(item.log_name).val(item.id)
            );
        });
    });
}
// Load Motab3a file
function LoadMotab3a(LodID){
    if(!LodID){
        $("#Motab3aFiles").html('<option></option>');
    }else{
        $("#Motab3aFiles").html('<option value="">لا يوجد متابعة</option>');
        $.getJSON( $myHost + '/x/motab3a', function(data) {
            var motab3a = [];
            $.each(data, function(i,d){
                if(d.log_name == LodID){
                    motab3a.push({ ToF : d.motab3a, id : d.id, text : d.letter_no }) 
                }
            });

            $("#Motab3aFiles").select2({
                data: motab3a,
                dir: "rtl",
                templateResult: function (motab3aTRUE) {
                    if(motab3aTRUE.text != 'false'){
                        if(motab3aTRUE.ToF == 'true'){
                            var $motab3aTRUE = $('<small><span style="color:red;" class="glyphicon glyphicon-star" aria-hidden="true"></span></small><span> '+motab3aTRUE.text+'</span>');
                        }else if(motab3aTRUE.ToF == 'false'){
                            var $motab3aTRUE = $('<small><span class="glyphicon glyphicon-star" aria-hidden="true"></span></small><span> '+motab3aTRUE.text+'</span>');
                        }else{
                            var $motab3aTRUE = motab3aTRUE.text;
                        }
                        return $motab3aTRUE;
                    }
                }
            });
        });
    }
}
// Load ghat in its select
function loadGhat(callback){
    $("#select2, #select2multi").html('<option></option>');
    $.getJSON( $myHost + '/setting/ghat', function(data) {
        var ghat = [];
        $.each(data, function(i,d){
            ghat.push({
                id : d.id,
                text : d.ghat
            })
        });
        $("#select2, #select2multi").select2({
            data: ghat,
            dir: "rtl"
        });
        //setting ghat
        $("#SetteingGhatSEL").html('');
        $.each(data, function(index, item) { // Iterates through a collection
            $("#SetteingGhatSEL").append( // Append an object to the inside of the select box
                $("<option></option>").text(item.ghat).val(item.id)
            );
        });
        //callback function if exist
        if (callback) {callback();};
    });
}
if($("#select2").length || $('#SetteingGhatSEL').length){loadGhat();}
// laod upload file
var $file = $("#pdfupload");
function UPfile(){
    $file.fileinput({
        language : 'ar',
        allowedFileExtensions: ['pdf'],
        uploadUrl: $myHost + '/upload',
        maxFileCount: 1,
        browseClass: "btn btn-primary btn-block",
        uploadAsync: true,
        showCaption: false,
        showUpload: false, 
        showRemove: false,
    });
}
UPfile();
$file.on('filebatchselected', function(event) {
    $('#sannow').hide();
    // $file.attr('name','aik');
    $file.fileinput("upload");
});
var t;
var sec;
function timer(){
    sec = Number(sec + 1);
    $('#jtimer').html('<center><strong><h1 style="margin-top: 75px;font-size: 100px;color: rgb(195, 195, 195);">'+sec+'</h1></strong></center>');
    t = setTimeout(timer,1000);
};
$('#sannow').on('click',function(){
    $('#sannowdiv').append('<iframe style="display: none;" src="ScanNow:"></iframe>');
    $('.file-input').hide();
    sec = 0;
    timer();
    $.get($myHost + '/upload/ScanNow', function(Cache, status){
        $('#jtimer').html('');
        clearTimeout(t);
        $('.file-input').show();
        if($('#EditFileName').length){
            $fileE.fileinput('destroy');
            $fileE.fileinput({
                maxFileCount: 1,
                initialPreview: [
                    '<iframe src="' + $myHost + '/pdfViewer/Cache/' + Cache +'" width="325" height="440"></iframe>'
                ],
                initialPreviewConfig: [
                    {width: "120px", url: $myHost + '/upload/del/' + Cache, key: Cache} 
                ]
            });
        $("#upbu").hide();
        }else{
            $file.fileinput('destroy');
            $file.fileinput({
                maxFileCount: 1,
                initialPreview: [
                    '<iframe src="' + $myHost + '/pdfViewer/Cache/' + Cache +'" width="325" height="440"></iframe>'
                ],
                initialPreviewConfig: [
                    {width: "120px", url: $myHost + '/upload/del/' + Cache, key: Cache} 
                ]
            });
            $("#upbu").hide();
        }
    });
});

$file.on('filereset', function(event) {
    $file.fileinput('destroy');
    UPfile();
    $('#sannow').show();
});
// checked secret
$('#secret').on('click', function(){
    var de = $('#details');
    if ($(this).is(':checked')) {
        de.val('سرى شخصى');
        de.css('font-weight','bold');
        de.prop('disabled', true);
        $(this).after('<input type="hidden" value="سرى شخصى" id="detailsHIDE" name="desc" class="form-control">');
    }else{
        de.val('بشأن ');
        de.removeAttr('style');
        de.prop('disabled', false);
        $('#detailsHIDE').remove();
    }
});
// checked save
$('#saveIN').on('click', function(){
    var de = $('#select2multi');
    if ($(this).is(':checked')) {
        $('#select2multi').html('<option id="Save00" value="0" selected>حفظ فى جهة الدخال<option>');
        de.prop('disabled', true);
        de.val("0").trigger("change");
    }else{
        var fromS =  $("#select2").val();
        $('#Save00').remove();
        // de.select2("destroy")
        $('#select2multi[search="find"]').html('<option value="all">الكل<option>');
        de.prop('disabled', false);
        loadGhat(function(){
            $("#select2").val(fromS).trigger("change");
            de.val("all").trigger("change");
        });
    }
});
// whin log name change load motb3a
$('#logname').change(function(){
    if($(this).val()){
        $('#NOlog').addClass('hide');
        $('#YESlog').removeClass('hide');
        LoadMotab3a($(this).val());
    }else{
        $('#NOlog').removeClass('hide');
        $('#YESlog').addClass('hide');
        LoadMotab3a();
    }
});
$('#Motab3aFiles').change(function(){
    if($(this).val()){
        $('#GoMotab3a').removeClass('disabled');
        $('#GoMotab3a').attr('href','/view/'+$(this).val())
    }else{
        $('#GoMotab3a').addClass('disabled');
    }
});
// validation and submit // Send inORout to server
$('#SaveINorOUT').click(function(){
    $('#fileName').val($('.kv-file-remove').attr('data-key'))

    if(!$('#logname').val()){
        $('#logname').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#logname').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#select2').val()){
        $('#select2').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#select2').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#letterNO').val() && $('#INandOUT').val() == 'input'){
        $('#letterNO').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#letterNO').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#details').val() || $('#details').val() == 'بشأن '){
        $('#details').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#details').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#select2multi').val()){
        $('#select2multi').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#select2multi').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#fileName').val() && !$('#secret').is(':checked')){
        $('#Err-PDFfile').addClass('has-error');
        $('#Err-PDFfile').css('display','block');
    }else{
        $('#Err-PDFfile').removeClass('has-error');
        $('#Err-PDFfile').css('display','none');
    }
    if(typeof $('.has-error').val() == 'undefined'){
        $.post(
            $myHost + '/insert/' + $('#INandOUT').val() ,
            {
                logname:        $('#logname').val(),
                from:           $('#select2').val(),
                paper_count:    $('#paper_count').val(),
                desc:           $('#details').val(),
                to:             $('#select2multi').val(),
                fileName:       $('#fileName').val(),
                letter_no:      function(){
                    if($('#letterNO').val()){
                        return $('#letterNO').val();
                    }else{
                        if($('#Motab3aFiles').val()){
                            return $('#Motab3aFiles option:selected').text();
                        }else{
                            return false;
                        }
                    }
                },
                motab3a:        function(){
                    if($('#INandOUT').val() == 'input'){
                        if($('#motab3a').is(':checked')){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        if($('#Motab3aFiles').val()){
                            return $('#Motab3aFiles').val();
                        }else{
                            return false;
                        }
                    }
                }
            },
            function(response) {
                $('#FinishModal').modal({backdrop:'static'}).show;
                $('#LogSaveName').text($('#logname option[value="'+response.log_name+'"]').text());
                $('#SnSaveNo').text(response.sn);
                $('#SaveDate').text(response.date);
                $('#OpenSavedFile').attr('href','/view/'+response.id)
                console.log(response);
            }
        );
    }else{
        AikNotify('يوجد بيانات مطلوبة.','danger');
    }
});
// Insert Open modal ghat
$('#ghatModal').on('shown.bs.modal', function (event) {
    $('#new-gha').val('');
    $('#new-gha').focus();
    $( "#gha-submit" ).prop('disabled', true);
});
// Validation modal ghat
$('#new-gha').keyup(function(e){
    if($('#new-gha').val()){
        $( "#gha-submit" ).prop('disabled', false);
        // Enter key for modal ghat
        if(e.which === 13){
            $('#gha-submit').click();
        }
    }else{
        $( "#gha-submit" ).prop('disabled', true);
    }
});
// Insert to modal ghat
$( "#gha-submit" ).click(function() {
    $.post(
        $myHost + '/setting/ghat',
        { newGha : $('#new-gha').val() },
        function(response) {
            AikNotify(response.msg,response.class);
            if($('#ghatModal').length){
                $('#ghatModal').modal('hide');
            }else{
                $('#new-gha').val('');
            }
            loadGhat();  
        }
    );
});
// Insert Open modal pass
$('#PassModal').on('show.bs.modal', function (event) {
    $('#CurrentPass').val('');
    $('#NewPass').val('');
    $('#AgainPass').val('');
    $( "#pass-submit" ).prop('disabled', true);
    if($('#AgainPass-D').hasClass('has-error')){
        $('#AgainPass-D').removeClass('has-error');
        $('#AgainPass-E').addClass('hide');
    }
});
// Validation modal Pass
$('#CurrentPass, #NewPass, #AgainPass').keyup(function(e){
    if($('#CurrentPass').val().length >= 4 && $('#NewPass').val().length >= 4 && $('#AgainPass').val().length >= 4){
        $( "#pass-submit" ).prop('disabled', false);
    }else{
        $( "#pass-submit" ).prop('disabled', true);
    }

});
//caps lock worning
$(window).bind("capsOn", function(event) {
    if ($("#CurrentPass, #NewPass, #AgainPass:focus").length > 0) {
        $("#capsWarning").show();
    }
});
$(window).bind("capsOff capsUnknown", function(event) {
    $("#capsWarning").hide();
});
$("#CurrentPass, #NewPass, #AgainPass").bind("focusout", function(event) {
    $("#capsWarning").hide();
});
$("#CurrentPass, #NewPass, #AgainPass").bind("focusin", function(event) {
    if ($(window).capslockstate("state") === true) {
        $("#capsWarning").show();
    }
});
$(window).capslockstate();
// Insert to modal PassWord
$( "#pass-submit" ).click(function() {
    if($('#NewPass').val() === $('#AgainPass').val()){
        if($('#NewPass').val() === $('#CurrentPass').val()){
            $('#PassModal').modal('hide');
            AikNotify('لا يمكن تغيير كلمة المرور بنفس كليمة المرور الحالية.','info');
        }else{
            $.post(
                $myHost + '/Auth/Pass',
                {   cPass : $('#CurrentPass').val(),
                    nPass : $('#NewPass').val() },
                function(response) {
                    $('#PassModal').modal('hide');   
                    console.log(response);
                    AikNotify(response.msg,response.class);
                }
            );
        }
    }else{
        $('#AgainPass-D').addClass('has-error');
        $('#AgainPass-E').removeClass('hide');
    }
});
//Notify Finction.
function AikNotify(text,type){
$.notify({message: text},{delay:3000,placement:{from: "top",align: "left"},offset:{x:170,y:0},animate:{enter: 'animated fadeInDown',exit: 'animated fadeOutUp'},type: type});
};
$('[data-asd="tooltip"]').tooltip();
$('[data-asd="popover"]').popover({
    trigger:'hover',
    html: true
});
// Load group names in select in setting page
function LoadGroupSelect(){
    $("#Groups").html('<option></option>');
    $.getJSON( $myHost + '/x/group', function(data) {
        $.each(data, function(index, item) { // Iterates through a collection
            $("#Groups").append( // Append an object to the inside of the select box for search
               $("<option></option>").text(item.group_name).val(item.id)
            );
        });    
    });
};
if($("#Groups").length){LoadGroupSelect();}
//Log name Setting
// Load log names in select in setting page
var lognameDATA = [];
function LoadSelectLog (){
    $("#sLogname").html('');
    $.getJSON( $myHost + '/setting/logname', function(data) {
        lognameDATA = data;
        $.each(data, function(index, items) { // Iterates through a collection
            $("#sLogname").append( // Append an object to the inside of the select box for search
                $('<optgroup></optgroup>').attr('label',index).html(function(){
                    var LOGoption = [];
                    $.each(items, function(i, item) {
                      LOGoption[i] = $("<option></option>").text(item.log_name + ' - (' + item.log_date + ')').val(item.id);
                    })
                    return LOGoption;
                })
            );
        });    
    });
}
if($("#sLogname").length){LoadSelectLog();}
//Select logname TO edit
var isDisabled = [];
$('#sLogname').dblclick(function(){
    var selected = $(':selected', this);
    var optgroup = selected.closest('optgroup').attr('label');
    var selDATA;
    $.each(lognameDATA[optgroup], function(i,t){
        if(t.id == selected.val()){
            selDATA = t;
        }
    });
    $('#sLogname').prop('disabled', true);
    $('#EditCancel').show();
    $('#LogName').val(selDATA.log_name);
    $("#Groups").val(selDATA.group).prop('disabled', true);
    if(new Date(selDATA.log_start) < new Date()){
        $("#log_start").val(selDATA.log_start).prop('disabled', true);
    }else{
        $("#log_start").datepicker('update',selDATA.log_start).prop('disabled', false);
    }
    if(new Date(selDATA.log_end) < new Date()){
        $("#log_end").val(selDATA.log_end).prop('disabled', true);
    }else{
        $("#log_end").val(selDATA.log_end).prop('disabled', false);
    }
    isDisabled = {
        start:  $("#log_start").is(":disabled"),
        end:    $("#log_end").is(":disabled")
    };
    $('#log_start').change();
});
//Cancel Edit
$('#EditCancel').click(function(){
    $(this).hide();
    $('#sLogname').val('').prop('disabled', false);
    $('#LogName').val('').prop('disabled', false);
    $("#Groups").val('').prop('disabled', false);
    $("#log_start").val('').prop('disabled', false);
    $("#log_end").val('').prop('disabled', false);
    $('#log_start').change();
});
// Save New OR Edit
$('#SaveLog').click(function(){
    if($('#EditCancel').is(':visible')){
        //Edit
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: $myHost + '/setting/logname',
            data: {
                id:         $('#sLogname').val()[0],
                LogName:    $('#LogName').val(),
                LogStart:   function(){
                    if(!isDisabled.start){
                        return $("#log_start").val();
                    }else{
                        return !isDisabled.start;
                    }
                },
                LogEnd:     function(){
                    if(!isDisabled.end){
                        return $("#log_end").val();
                    }else{
                        return !isDisabled.end;
                    }
                }
            },
            success: function(response){
                $('#EditCancel').click();
                LoadSelectLog();
                AikNotify(response.msg,response.class);
            }
        });
    }else{
        if( !$('#LogName').val() || !$("#Groups").val() || !$("#log_start").val() || !$("#log_end").val() ){
           AikNotify('يوجد بيانات مطلوبة','info');
        }else{
            $.post(
                $myHost + '/setting/logname',
                { 
                    LogName:    $('#LogName').val(),
                    LogGroup:   $('#Groups').val(),
                    LogStart:   $("#log_start").val(),
                    LogEnd:     $("#log_end").val()
                },
                function(response) {
                    $('#EditCancel').click();
                    LoadSelectLog();
                    AikNotify(response.msg,response.class);
                }
            );
        }
    }
});
//Fucken datepicker
// $.fn.datepicker.defaults.language = "ar";
// $.fn.datepicker.defaults.format = "yyyy-mm-dd";
// $.fn.datepicker.defaults.autoclose = true;
// TimeAndDate(function (dateT){ // get date from server
//     $('#log_start').datepicker({
//         startDate: dateT
//     });
//     $('#log_end').focus(function(){
//         if(!$('#log_start').val() && !$('#EditCancel').is(':visible')){
//             $('#log_start').focus();
//             AikNotify('برجاء تعيين تاريخ بداية الدفتر اولاَ','info');
//         }
//     });
//     $('#log_start').change(function() {
//         $('#log_end').datepicker('remove');
//         if($(this).val() && !$('#EditCancel').is(':visible')){
//             $('#log_end').datepicker({
//                 startDate: $('#log_start').val()
//             }).focus();
//         }else if($(this).val() && $('#EditCancel').is(':visible')){//edit
//             if( $(this).val() < dateT ){
//                 $('#log_end').datepicker({
//                     startDate: dateT
//                 });
//             }else{
//                 $('#log_end').datepicker({
//                     startDate: $('#log_start').val()
//                 });  
//             }
//         }
//     });
// }); 


//user group module
var AddOREdit;
$('#groupModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var Mtitle = button.attr('modtitle');
  AddOREdit  = button.attr('action');
  var modal = $(this);
  modal.find('.modal-title').text(Mtitle);
  $('#new-group').val('');
  if(AddOREdit == 'edit'){
    modal.find('.modal-body input').val($('#Groups option:selected').text())
  }
});
//group module text Validation
$('#new-group').keyup(function(){
    if($(this).val()){
        $('#group-submit').prop('disabled', false);
    }else{
        $('#group-submit').prop('disabled', true);
    }
});
//group module select value Validation
$('[action="edit"]').click(function(){
    if(!$('#Groups').val()){
        AikNotify('يجب اختيار المجموعة المراد تعدلها اولان','info');
        $('#Groups').change();
    }
});
$('#Groups').change(function(){
    if($(this).val()){
        $('[action="edit"]').attr('data-toggle','modal');
    }else{
        $('[action="edit"]').removeAttr('data-toggle');
    }
});
//add and edit groups
$('#group-submit').click(function(){
    if(AddOREdit == 'add'){
        $.post(
            $myHost + '/x/group',
            { NewGroup: $('#new-group').val() },
            function(response) {
                $('#groupModal').modal('hide');
                LoadGroupSelect();
                AikNotify(response.msg,response.class);
            }
        );
    }else if(AddOREdit == 'edit'){
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: $myHost + '/x/group',
            data: { GroupID: $('#Groups').val(), NewGroup: $('#new-group').val() },
            success: function(response){
                $('#groupModal').modal('hide');
                LoadGroupSelect();
                AikNotify(response.msg,response.class);
                $('[action="edit"]').removeAttr('data-toggle');
            }
        });
    }   
});
//delete group
bootbox.setLocale('ar');
$('#DelGroup').click(function(){
    if($('#Groups').val()){
        bootbox.confirm({
            size: 'small',
            title: 'برجاء تاكيد',
            message: "سوف يتم حزف مجموعة <strong>"+$('#Groups option:selected').text()+'</strong>',
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'DELETE',
                        dataType: 'json',
                        url: $myHost + '/x/group',
                        data: { GroupID: $('#Groups').val() },
                        success: function(response){
                            if(response.class != 'info'){
                                LoadGroupSelect();
                            }
                            AikNotify(response.msg,response.class);
                        }
                    });
                }
            }
        }); 
    }else{
        AikNotify('يجب اختيار المجموعة المراد حزفها اولان','info');
    }
});
//Load Users with groups in select     
var UsersDATA = [];
function LoadUsersSelect(){
    $("#UserSelect").html('');
    $.getJSON( $myHost + '/Auth/Users', function(data) {
        UsersDATA = data;
        $.each(data, function(index, items) { // Iterates through a collection
            $("#UserSelect").append( // Append an object to the inside of the select box for search
                $('<optgroup></optgroup>').attr('label',index).html(function(){
                    var LOGoption = [];
                    $.each(items, function(i, item) {
                      LOGoption[i] = $("<option></option>").text(item.name).val(item.id);
                    })
                    return LOGoption;
                })
            );
        });    
    });
}
if($("#UserSelect").length){LoadUsersSelect();}
//Select user for view
$('#UserSelect').click(function(){
    var selected = $(':selected', this);
    var optgroup = selected.closest('optgroup').attr('label');
    var CurrentUser;
    $.each(UsersDATA[optgroup], function(i,t){
        if(t.id == selected.val()){ CurrentUser = t;}
    });
    $('#UserSave').addClass('hide');    
    $('#UserCancelEdit').text('ادخال مستخدم جديد').removeClass('hide');
    $('#name').val(CurrentUser.name).prop('disabled', true);
    $('#phone').val(CurrentUser.phone).prop('disabled', true);
    $('#userName').val(CurrentUser.email).prop('disabled', true);
    $('#Groups').val(CurrentUser.group).prop('disabled', true);
    $('#userlevel').val(CurrentUser.userlevel).prop('disabled', true);
    $('[action="add"]').prop('disabled', true);
    $('[action="edit"]').prop('disabled', true);
    $('#DelGroup').prop('disabled', true);
    $('#name').closest('.form-group').removeClass('has-error');
    $('#phone').closest('.form-group').removeClass('has-error');
    $('#userName').closest('.form-group').removeClass('has-error');
    $('#Groups').removeClass('btn-danger');
    $('#userlevel').closest('.form-group').removeClass('has-error');
});
//Select user for edit
$('#UserSelect').dblclick(function(){
    var selected = $(':selected', this);
    var optgroup = selected.closest('optgroup').attr('label');
    var CurrentUser;
    $.each(UsersDATA[optgroup], function(i,t){
        if(t.id == selected.val()){
            CurrentUser = t;
        }
    });
    $(this).prop('disabled', true); 
    $('#UserSave').removeClass('hide');    
    $('#UserCancelEdit').text('الغاء التعديل').removeClass('hide');
    $('#PassRest').removeClass('hide');    
    $('#UserDel').removeClass('hide');    
    $('#name').val(CurrentUser.name).prop('disabled', false);
    $('#phone').val(CurrentUser.phone).prop('disabled', false);
    $('#userName').val(CurrentUser.email).prop('disabled', false);
    $('#Groups').val(CurrentUser.group).prop('disabled', false);
    $('#userlevel').val(CurrentUser.userlevel).prop('disabled', false);
    $('[action="add"]').prop('disabled', true);
    $('[action="edit"]').prop('disabled', true);
    $('#DelGroup').prop('disabled', true);
    $('#name').closest('.form-group').removeClass('has-error');
    $('#phone').closest('.form-group').removeClass('has-error');
    $('#userName').closest('.form-group').removeClass('has-error');
    $('#Groups').removeClass('btn-danger');
    $('#userlevel').closest('.form-group').removeClass('has-error');
});
//Cancel Edit btn users
$('#UserCancelEdit').click(function(){
    $('#UserSelect').val('').prop('disabled', false);
    $('#UserSave').removeClass('hide');    
    $('#UserCancelEdit').addClass('hide');
    $('#PassRest').addClass('hide');
    $('#UserDel').addClass('hide');
    $('#name').val('').prop('disabled', false);
    $('#phone').val('').prop('disabled', false);
    $('#userName').val('').prop('disabled', false);
    $('#Groups').val('').prop('disabled', false);
    $('#userlevel').val('').prop('disabled', false);
    $('[action="add"]').prop('disabled', false);
    $('[action="edit"]').prop('disabled', false);
    $('#DelGroup').prop('disabled', false);
    $('#name').closest('.form-group').removeClass('has-error');
    $('#phone').closest('.form-group').removeClass('has-error');
    $('#userName').closest('.form-group').removeClass('has-error');
    $('#Groups').removeClass('btn-danger');
    $('#userlevel').closest('.form-group').removeClass('has-error');
});
//User Save btn
$('#UserSave').click(function(){
    if($('#UserSelect').prop('disabled')){
        //edit
        if($('#name').val() && $('#phone').val() && $('#userName').val() && $('#Groups').val() &&$('#userlevel').val()){
            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: $myHost + '/Auth/Users',
                data: { 
                    id:        $('#UserSelect').val()[0],
                    name:      $('#name').val(),
                    phone:     $('#phone').val(),
                    username:  $('#userName').val(),
                    group:     $('#Groups').val(),
                    userlevel: $('#userlevel').val()
                },
                success: function(response){
                    LoadUsersSelect();
                    $('#UserCancelEdit').click();
                    AikNotify(response.msg,response.class);
                }
            });
        }else{
            if(!$('#name').val()){$('#name').closest('.form-group').addClass('has-error')}else{$('#name').closest('.form-group').removeClass('has-error')}
            if(!$('#phone').val()){$('#phone').closest('.form-group').addClass('has-error')}else{$('#phone').closest('.form-group').removeClass('has-error')}
            if(!$('#userName').val()){$('#userName').closest('.form-group').addClass('has-error')}else{$('#userName').closest('.form-group').removeClass('has-error')}
            if(!$('#Groups').val()){$('#Groups').addClass('btn-danger')}else{$('#Groups').removeClass('btn-danger')}
            if(!$('#userlevel').val()){$('#userlevel').closest('.form-group').addClass('has-error')}else{$('#userlevel').closest('.form-group').removeClass('has-error')}
            AikNotify('يجب بيانات مطلوبة','info');
        }
    }else{
        //Add
        if($('#name').val() && $('#phone').val() && $('#userName').val() && $('#Groups').val() &&$('#userlevel').val()){
            $.post(
                $myHost + '/Auth/Users',
                { 
                    name:      $('#name').val(),
                    phone:     $('#phone').val(),
                    username:  $('#userName').val(),
                    group:     $('#Groups').val(),
                    userlevel: $('#userlevel').val()
                },
                function(response) {
                    LoadUsersSelect();
                    $('#UserCancelEdit').click();
                    AikNotify(response.msg,response.class);
                }
            );
        }else{
            if(!$('#name').val()){$('#name').closest('.form-group').addClass('has-error')}else{$('#name').closest('.form-group').removeClass('has-error')}
            if(!$('#phone').val()){$('#phone').closest('.form-group').addClass('has-error')}else{$('#phone').closest('.form-group').removeClass('has-error')}
            if(!$('#userName').val()){$('#userName').closest('.form-group').addClass('has-error')}else{$('#userName').closest('.form-group').removeClass('has-error')}
            if(!$('#Groups').val()){$('#Groups').addClass('btn-danger')}else{$('#Groups').removeClass('btn-danger')}
            if(!$('#userlevel').val()){$('#userlevel').closest('.form-group').addClass('has-error')}else{$('#userlevel').closest('.form-group').removeClass('has-error')}
            AikNotify('يجب بيانات مطلوبة','info');
        }
    }
});
//Delete User
$('#UserDel').click(function(){
    bootbox.confirm({
    title: 'برجاء تاكيد',
    message: "سوف يتم حزف المستخدم <strong style='color:red'>"+$('#UserSelect option:selected').text()+'</strong>.',
        callback: function(result) {
            if(result){
                $.ajax({
                    type: 'DELETE',
                    dataType: 'json',
                    url: $myHost + '/Auth/Users',
                    data: { DelID: $('#UserSelect').val()[0] },
                    success: function(response){
                        LoadUsersSelect();
                        $('#UserCancelEdit').click();
                        AikNotify(response.msg,response.class);
                    }
                });
            }
        }
    }); 
});
//RESAT PasWord
$('#PassRest').click(function(){
    bootbox.confirm({
    title: 'برجاء تاكيد',
    message: "سوف يتم اعادة تعيين كلمة المرور للمستخدم <strong>"+$('#UserSelect option:selected').text()+'</strong>. الى <strong style="color:red">1234</strong>.',
        callback: function(result) {
            if(result){
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: $myHost + '/Auth/Pass',
                    data: { RestID: $('#UserSelect').val()[0] },
                    success: function(response){
                        $('#UserCancelEdit').click();
                        AikNotify(response.msg,response.class);
                    }
                });
            }
        }
    }); 
});
//delete motb3a
$('#DelMotab3a').click(function(){
    bootbox.confirm({
        size: 'small',
        title: 'برجاء تاكيد',
        message: "سوف يتم الغاء المتابعة لهذا الملف.",
        callback: function(result) {
            if(result){
                $.ajax({
                    type: 'DELETE',
                    dataType: 'json',
                    url: $myHost + '/insert/'+ $('#DelMotab3a').attr('DelMotab3a'),
                    // data: { GroupID: 'dddd' },
                    success: function(response){
                        AikNotify(response.msg,response.class);
                        setTimeout(function() {
                            location.href = $myHost + '/view/'+ $('#DelMotab3a').attr('DelMotab3a');
                        }, 4500);
                    }
                });
            }
        }
    });
});
// pause search form with select2 shown
$('#findS2FORM,#findS2TO').select2({dir: "rtl"})
    .on("select2:open", function (e) {
        $('.HoroAIkpan').addClass('HoroAIkpanHH');
    })
    .on("select2:close", function (e) { 
        $('.HoroAIkpan').removeClass('HoroAIkpanHH');
});
// pause search form with datepicker shown
$('#datepicker').datepicker()
    .on('show', function(e) {
        $('.HoroAIkpan').addClass('HoroAIkpanHH');
    })
    .on('hide', function(e) {
        $('.HoroAIkpan').removeClass('HoroAIkpanHH');
});
// search btn on click validation
$('#SearchBTN').click(function(){
    if($('[name=start]').val() && $('[name=end]').val()){
        $('#FINDform').submit();
    }else{
        AikNotify('برجاء ادخال التاريخ قبل البحث.','info');
    }
});
//secert for search
$('#FINDsave').on('click', function(){
    var de = $('#findS2TO');
    if ($(this).is(':checked')) {
        de.prop('disabled', true);
        de.val("0").trigger("change");
        $(this).after('<input type="hidden" value="0" id="toHIDE" name="to" class="form-control">');
    }else{
        de.val("all").trigger("change");
        de.prop('disabled', false);
        $('#toHIDE').remove();
    }
});
// Enter key for modal ghat
if($('#FINDform').length){
    $('#FINDform').keypress(function(e){
        if(e.which === 13){
            $('#SearchBTN').click();
        }
    });
}
//Ghat Setting
//Duble click to edit
$('#SetteingGhatSEL').dblclick(function(){
    $('#SetteingGhatSEL').prop('disabled',true);
    $('#new-gha').val($('#SetteingGhatSEL option:selected').text());
    $('#gha-submit-edit').removeClass('hide');
    $('#gha-EditCancel').removeClass('hide');
    $('#gha-submit').addClass('hide');
});
$('#gha-EditCancel').click(function(){
    $('#SetteingGhatSEL').prop('disabled',false);
    $('#SetteingGhatSEL').val('');
    $('#new-gha').val('');
    $('#gha-submit-edit').addClass('hide');
    $('#gha-EditCancel').addClass('hide');
    $('#gha-submit').removeClass('hide');
});
// Validation edit ghat
$('#new-gha').keyup(function(e){
    if($('#new-gha').val()){
        $( "#gha-submit-edit" ).prop('disabled', false);
    }else{
        $( "#gha-submit-edit" ).prop('disabled', true);
    }
});
$('#gha-submit-edit').click(function(){
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: $myHost + '/setting/ghat',
        data: {
            id:      $('#SetteingGhatSEL option:selected').val(),
            newgha:  $('#new-gha').val(),
        },
        success: function(response){
            $('#gha-EditCancel').click();
            AikNotify(response.msg,response.class);
            loadGhat();
        }
    });
});
//edit file
var $fileE = $('#edit-file');
if($fileE.length){
    // $.get($myHost + '/upload/ScanNow', function(Cache, status){
        // $('#jtimer').html('');
        // clearTimeout(t);
        // $('.file-input').show();
        // $file.fileinput('destroy');
        $fileE.fileinput({
            language : 'ar',
            allowedFileExtensions: ['pdf'],
            uploadUrl: $myHost + '/upload',
            maxFileCount: 1,
            browseClass: "btn btn-primary btn-block",
            uploadAsync: true,
            showCaption: false,
            showUpload: false, 
            showRemove: false,
            initialPreview: [
                '<iframe src="' + $myHost + '/pdfViewer/Uploaded/' + $('#EditFileName').val() +'" width="325" height="440"></iframe>'
            ],
            initialPreviewConfig: [
                {width: "120px", url: $myHost + '/upload/del/' + $('#EditFileName').val() , key: $('#EditFileName').val()} 
            ]
        });
}
$fileE.on('filebatchselected', function(event) {
    $('#sannow').hide();
    $fileE.fileinput("upload");
});
$fileE.on('filereset', function(event) {
    // $fileE.fileinput('destroy');
    // UPfile();
    $('#sannow').show();
});
$('[data-key="'+$('#EditFileName').val()+'"]').hide();
$('#editDate').datepicker();
// validation and submit // Send inORout to server
$('#SaveEdit').click(function(){
    $('#EditFileName').val($('.kv-file-remove').attr('data-key'))

    if(!$('#details').val() || $('#details').val() == 'بشأن '){
        $('#details').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#details').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#findS2TO').val()){
        $('#findS2TO').closest( ".form-group" ).addClass('has-error');
    }else{
        $('#findS2TO').closest( ".form-group" ).removeClass('has-error');
    }
    if(!$('#EditFileName').val()){
        $('#Err-PDFfile').addClass('has-error');
        $('#Err-PDFfile').css('display','block');
    }else{
        $('#Err-PDFfile').removeClass('has-error');
        $('#Err-PDFfile').css('display','none');
    }
    if(typeof $('.has-error').val() == 'undefined'){
        bootbox.confirm({
            title: 'برجاء تاكيد',
            message: 'سوف يتم تعديل البيانات.',
            callback: function(result) {
                if(result){
                    $.post(
                        $myHost + '/edit/' + $('#DATAid').val() ,
                        {
                            sn :	    $('[name=SN]').val(),
			    date :          $('[name=editDate]').val(),
                            from:           $('[name=from]').val(),
                            paper_count:    $('[name=paper_count]').val(),
                            desc:           $('[name=details]').val(),
                            to:             $('#findS2TO').val(),
                            letter_no: function(){
                                if($('#letterNO').length){
                                    return $('#letterNO').val();
                                }else{
                                    if($('#Motab3aFiles').val()){
                                        return $('#Motab3aFiles option:selected').text();
                                    }
                                }
                            },
                            motab3a: function(){
                                if($('#Motab3aFiles').val()){
                                    return $('#Motab3aFiles').val();
                                }
                            },
                            fileName:       $('#EditFileName').val()
                        },
                        function(response) {
                            AikNotify(response.msg,response.class);
                            location.href = $myHost + '/view/'+ $('#DATAid').val();
                            // console.log(response);
                        }
                    );
                }
            }
        });
    }else{
        AikNotify('يوجد بيانات مطلوبة.','danger');
    }
});
$('#DelEdit').click(function(){
    bootbox.confirm({
        title: 'برجاء تاكيد',
        message: 'سوف يتم حزف الملف.',
        callback: function(result) {
            if(result){
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: $myHost + '/edit/' + $('#DATAid').val() ,
                    data: {},
                    success: function(response){
                        AikNotify(response.msg,response.class);
                        window.close();
                    }
                })
            }
        }
    });
});
function motb3aEdit(id){
    $('#theButn').prop('disabled', true);
    LoadMotab3a(id);
    $('#motab3aa').hide();
    $('#moEdit').removeClass('hide');
}