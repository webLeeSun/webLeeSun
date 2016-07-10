function my_confirm(o) {
    var title = o.title ? o.title : false,
        des = o.des ? o.des : false,
        ok_btn = o.ok_btn ? o.ok_btn : "确定",
        one_btn = o.one_btn ? true : false,
        callback_ok = o.callback_ok ? o.callback_ok : false,
        callback_cancle = o.callback_cancle ? o.callback_cancle : false,
        pop_html = "";
    $(".my_confirm").remove();
    if (one_btn) {
        pop_html = '<div class="my_confirm">\
      <div class="main_info">\
          <h2>' + title + '</h2>\
          <p>' + des + '</p>\
          <div class="btns" style="background:none">\
              <a href="javascript:;" class="make_sure" style="width:100%">' + ok_btn + '</a>\
          </div>\
      </div>\
  </div>';
    } else {
        if (title && des) {
            pop_html = '<div class="my_confirm">\
            <div class="main_info">\
                <h2>' + title + '</h2>\
                <p>' + des + '</p>\
                <div class="btns">\
                    <a href="javascript:;" class="cancle_pop">取消</a>\
                    <a href="javascript:;" class="make_sure">' + ok_btn + '</a>\
                </div>\
            </div>\
        </div>';
        } else if (!title && des) {
            pop_html = '<div class="my_confirm">\
            <div class="main_info no_title">\
                <p>' + des + '</p>\
                <div class="btns">\
                    <a href="javascript:;" class="cancle_pop">取消</a>\
                    <a href="javascript:;" class="make_sure">' + ok_btn + '</a>\
                </div>\
            </div>\
        </div>';
        }
    }
    $("body").append(pop_html);
    $(".make_sure").click(function() {
        if (callback_ok && typeof callback_ok == "function") {
            callback_ok();
            $(".my_confirm").remove();
        }
    })
    $(".cancle_pop").click(function() {
        if (callback_cancle && typeof callback_cancle == "function") {
            callback_cancle();
            $(".my_confirm").remove();
        } else {
            $(".my_confirm").remove();
        }
    })
}
