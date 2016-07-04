var vm = new Vue({
    el: '#joinvip',
    data: {
        pay_flag: false,
        pop_flag: false,
        submit_data: {
            "name": "",
            "email": "",
            "address": "",
            "profession": "",
            "birthday": "",
            "sex": "",
            "hobby": [],
            "money": 365
        }
    },
    methods: {
        choose_hobby: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var othis = $(e.target);
            var hobby = othis.text();
            if (othis.parent().hasClass("active")) {
                othis.parent().removeClass("active");
                vm.submit_data.hobby.$remove(hobby);
            } else {
                if (vm.submit_data.hobby.length == 2) {
                    $.each($(".fav_list").find("a"), function(i, item) {
                        if ($(this).text() == vm.submit_data.hobby[0]) {
                            $(this).parent().removeClass("active");
                            vm.submit_data.hobby.$remove($(this).text());
                            return false;
                        }
                    });
                    othis.parent().addClass("active");
                    vm.submit_data.hobby.push(hobby);
                } else {
                    othis.parent().addClass("active");
                    vm.submit_data.hobby.push(hobby);
                }
            }
        },
        pay_action: function(e) {
            if ($(e.target).hasClass("active")) {
                vm.pop_flag = true;
            } else {
                alert("请完善信息！")
                return false;
            }
        },
        pay_submit: function() {
            alert("提交订单！")
                // 异步提交
                // $.post("",vm.submit_data,function(data){
                //
                // })
        }
    },
    watch: {
        'submit_data': {
            handler: function(val, oldVal) {
                console.log(vm.submit_data.birthday);
                if (vm.submit_data.name != "" && vm.submit_data.email != "" && vm.submit_data.address != "" && vm.submit_data.profession != "" && vm.submit_data.birthday != "" && vm.submit_data.money != "") {
                    if (vm.submit_data.hobby.length != 0) {
                        vm.pay_flag = true;
                    } else {
                        vm.pay_flag = false;
                    }
                } else {
                    vm.pay_flag = false;
                }
            },
            deep: true
        }
    }
})

//选择半年付或全年付
$(".orders").on("click", ".od", function() {
    var othis = $(this);
    othis.find("b").addClass("icon-choose");
    othis.siblings().find("b").removeClass("icon-choose");
    vm.submit_data.money = parseInt(othis.find("span").attr("data"));
})


//时间选择器初始化
var currYear = (new Date()).getFullYear();
var opt = {};
opt.date = {
    preset: 'date'
};
opt.default = {
    theme: 'android-ics light', //皮肤样式
    display: 'modal', //显示方式
    mode: 'scroller', //日期选择模式
    dateFormat: 'yyyy-mm-dd',
    lang: 'zh',
    showNow: true,
    nowText: "今天",
    startYear: currYear - 50,
    endYear: currYear
};
$("#birthday").mobiscroll($.extend(opt['date'], opt['default']));
