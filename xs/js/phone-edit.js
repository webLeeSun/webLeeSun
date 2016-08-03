var vm = new Vue({
    el: '#login',
    data: {
        timer: null,
        code_time: 60,
        code_flag: false,
        get_code_flag: false,
        tel_current: "",
        tel_new:"",
        code: "",
        login_flag: false
    },
    methods: {
        get_code: function(e) {
            if ($(e.target).hasClass("active")) {
                console.log(1);
                if (vm.code_time == 60) {
                    vm.code_time--;
                    vm.code_flag = true;

                    //ajax 请求code
                    // $.post()

                    vm.timer = setInterval(function() {
                        vm.code_time--;
                        if (vm.code_time == 0) {
                            clearInterval(vm.timer);
                            vm.code_time = 60;
                            vm.code_flag = false;
                        }
                    }, 1000)
                }
            } else {
                alert("手机号码未填写或错误！")
                return false;
            }
        },
        login_submit: function(e) {
            if ($(e.target).hasClass("active")) {
              alert("ajax提交")
              //ajax 请求code
              // $.post()
            } else {
                alert("请完善信息！")
                return false;
            }
        }
    },
    watch: {
        'tel_current': function(val, oldVal) {
            if (validatePhone(val)) {
                if(vm.code!="" && validatePhone(vm.tel_new)){
                    vm.login_flag = true;
                } else {
                    vm.login_flag = false;
                }
            }else{
                vm.login_flag = false;
            }
        },
        'tel_new': function(val, oldVal) {
            if (validatePhone(val)) {
                vm.get_code_flag = true;

                if(vm.code!="" && validatePhone(vm.tel_current)){
                    vm.login_flag = true;
                } else {
                    vm.login_flag = false;
                }
            } else {
                vm.login_flag = false;
                vm.get_code_flag = false;
            }
        },
        'code': function(val, oldVal) {
            if (val != "" && validatePhone(vm.tel_current) && validatePhone(vm.tel_new)) {
                vm.login_flag = true;
            } else {
                vm.login_flag = false;
            }
        }
    }
})

function validatePhone(phone) {
    var phonereg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    return phonereg.test(phone.trim());
}
