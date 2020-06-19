
    var this_ = this;
    Array.prototype.max = function () {
        return Math.max.apply({}, this)
    }
    Array.prototype.min = function () {
        return Math.min.apply({}, this)
    }
    //$scope.getdata();

    var num_s = 1;
    var count = 0;
    var old_num = 0;
    var count_price = 0;

    var is_prompt = true;
    var top_ = 0;
    var left_ = 0;
    var selDiv = '';
    //判断:当前元素是否是被筛选元素的子元素
    jQuery.fn.isChildOf = function (b) {
        return (this.parents(b).length > 0);
    };
    //判断:当前元素是否是被筛选元素的子元素或者本身
    jQuery.fn.isChildAndSelfOf = function (b) {
        return (this.closest(b).length > 0);
    };
    $(document).on("click" , ".confirm_qiuzhuj" , function (e){
        if(this_.qiuzhuj.length > 0){
            for(var i = 0;i < this_.qiuzhuj.length; i++){
                var t = this_.qiuzhuj[i];
                var itemp = new temp();
                itemp.random   = ++this_.random;
                itemp.id       = goodsinfo.id;
                //itemp.codesn   = t.encrypt;
                itemp.title    = goodsinfo.title;
                itemp.quantity = t.nums > 0 ? t.nums : 1;//1;
                itemp.price    = goodsinfo.price;
                itemp.unit     = goodsinfo.unit;
                itemp.ball     = t.ball;
                itemp.column   = t.column;
                itemp.merge    = goodsinfo.merge;//ball_mirror
                if (goodsinfo.merge > 0){
                    var column_range = {};
                    column_range[t.column] = t.column_title;
                    itemp.auxiliary = {
                        ball_range : goodsinfo.auxiliary.ball_range,
                        column_range : column_range,
                    };
                }else{
                    itemp.auxiliary = {
                        ball_range : [],
                        column_range : [],
                    }
                }
                itemp.selected = goodsinfo.id;
                this_.items.push(itemp);
            }
            this_.setTotal();
        }
        layer.close(obj_layer_qiuzhuj);
    });

    function myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        //判断是否Opera浏览器
        if (isOpera) return "Opera"
        //判断是否Firefox浏览器
        if (userAgent.indexOf("Firefox") > -1) return "FF";
        if (userAgent.indexOf("Chrome") > -1) return "Chrome";
         //判断是否Safari浏览器
        if (userAgent.indexOf("Safari") > -1) return "Safari";
        //判断是否IE浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) return "IE";
        //判断是否IE浏览器
        if (userAgent.indexOf("Mozilla") > -1) return "IE";
    }
    var mb = myBrowser();
    //去掉浏览器右击默认事件
    //事件会在鼠标按键被按下时发生
    document.getElementsByClassName('bulk-order-table')[0].onmousedown = function (event) {
        var is_batch_table = $(event.target).isChildAndSelfOf(".batch_table");
        // || $("input:focus").hasClass("text_inp")
        if (!is_batch_table && is_prompt !== false){
            var isSelect = true;
            
            var selList = [];
            var fileNodes = document.getElementsByTagName("td");
            for (var i = 0; i < fileNodes.length; i++) {
                if (fileNodes[i].className.indexOf("bs_bg") != -1) {
                    fileNodes[i].className = "bs_bg";
                    selList.push(fileNodes[i]);
                }
            }
            //Event 对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。事件通常与函数结合使用，函数不会在事件发生前被执行！
            //无需明确指出参数名 第一个参数是 message。用 arguments[0] 也可以访问这个值，即第一个参数的值（第一个参数位于位置 0，第二个参数位于位置 1，依此类推）。
            var evt = window.event || arguments[0];

            //clientX 返回当事件被触发时，鼠标指针的水平坐标。
            //clientY 返回当事件被触发时，鼠标指针的垂直坐标。
            //IE 属性  x,y 事件发生的位置的 x 坐标和 y 坐标，它们相对于用CSS动态定位的最内层包容元素。
            //var startX = (evt.x || evt.clientX);
            var startX = mb == 'IE' ? evt.clientX : evt.x;
            //var startY = (evt.y || evt.clientY);
            var startY = mb == 'IE' ? evt.clientY : evt.y;
            top_ = document.body.scrollTop || document.documentElement.scrollTop;
            left_ = document.body.scrollLeft || document.documentElement.scrollLeft;
            //var selDiv = document.createElement("div");
            if (selDiv) {
                document.body.removeChild(selDiv);
                showSelDiv(selList);
                selDiv = document.createElement("div");
            } else {
                selDiv = document.createElement("div");
            }
            selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
            selDiv.id = "selectDiv";
            document.body.appendChild(selDiv);
            selDiv.style.left = startX + left_ + "px";
            selDiv.style.top = startY + top_ + "px";
            var _x = null;
            var _y = null;
            clearEventBubble(evt);
            var table_obj = document.getElementById(table_display_id);
            ///var table_l = table_obj.offsetLeft, table_t = table_obj.offsetTop;
            var table_l = table_display.offset().left,
                table_t = table_display.offset().top;
            var table_w = table_obj.offsetWidth,
                table_h = table_obj.offsetHeight;
            //事件会在鼠标指针移动时发生
            document.onmousemove = function () {
            evt = window.event || arguments[0];
            if (isSelect) {
                var mousemove_top = document.body.scrollTop || document.documentElement.scrollTop;
                var mousemove_left = document.body.scrollLeft || document.documentElement.scrollLeft;
                var div_width = 0;
                var div_height = 0;
                //_x = (evt.x || evt.clientX);
                //_y = (evt.y || evt.clientY);
                _x = mb == 'IE' ? evt.clientX : evt.x;
                _y = mb == 'IE' ? evt.clientY : evt.y;

                if (mousemove_left > left_) {
                    div_width = Math.abs(_x - (mousemove_left - startX - left_));
                    //selDiv.style.width = Math.abs(_x - (mousemove_left - startX - left_)) + "px";
                } else {
                    div_width = Math.abs(_x - startX);
                    //selDiv.style.width = Math.abs(_x - startX) + "px";
                }
                if (mousemove_top > top_) {
                    div_height = Math.abs(_y + (mousemove_top - startY - top_));
                    //selDiv.style.height = Math.abs(_y + (mousemove_top - startY - top_)) + "px";
                } else {
                    div_height = Math.abs(_y - startY);
                    //selDiv.style.height = Math.abs(_y - startY) + "px";
                }
                if (div_width > 0 || div_height > 0) {
                    selDiv.style.height = div_height + "px";
                    selDiv.style.width = div_width + "px";
                } else {
                    return false;
                }
                if (selDiv.style.display == "none") {
                    selDiv.style.display = "";
                }
                //selDiv.style.left = Math.min(_x, startX) + "px";
                selDiv.style.left = Math.min(Math.abs(_x + left_), Math.abs(startX + left_)) + "px";
                //selDiv.style.top = Math.abs(startY + top_) + "px";
                selDiv.style.top = Math.min(Math.abs(_y + top_), Math.abs(startY + top_)) + "px";
                //selDiv.style.width = Math.abs(_x - startX) + "px";

                // ---------------- 关键算法 ---------------------
                var _l = selDiv.offsetLeft,
                    _t = selDiv.offsetTop;
                var _w = selDiv.offsetWidth,
                    _h = selDiv.offsetHeight;
                //offsetTop     此属性可以获取元素的上外缘距离最近采用定位父元素内壁的距离，如果父元素中没有采用定位的，则是获取上外边缘距离文档内壁的距离。所谓的定位就是position属性值为relative、absolute或者fixed。
                //offsetLeft
                //offsetHeight   此属性可以获取元素的高度，宽度值包括:元素内容+内边距+边框。不包括外边距和滚动条部分。
                //offsetWidth   此属性可以返回一个元素的宽度值，值是:元素的内容+内边距。不包括边框、外边距和滚动条部分。

                for (var i = 0; i < selList.length; i++) {
                    var sl = selList[i].offsetWidth + selList[i].offsetLeft + table_l; // table_w +
                    var st = selList[i].offsetHeight + selList[i].offsetTop + table_t; // table_h +
                    // div 的 left
                    if (sl > _l && st > _t && selList[i].offsetLeft + table_l < _l + _w && selList[i].offsetTop + table_t < _t + _h) {
                        if (selList[i].className.indexOf("seled") == -1 && $(selList[i]).attr("name") != 'desa') {
                            //selList[i].attr("name")
                            //改变柱镜显示颜色
                            $(selList[i]).parents("#"+table_display_id).find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                            $(selList[i]).parents("#"+table_display_id).find("tr").eq(0).find("th").eq($(selList[i]).index()).css('color', '#dee9fa');
                            //改变柱镜显示颜色
                            $(".fist").find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                            $(".fist").find("th").eq($(selList[i]).index()).css('color', '#3f69a5');
                            //改变球镜显示颜色
                            $(selList[i]).parent().find("td").eq(0).css('background', '#dee9fa');
                            $(selList[i]).parent().find("td").eq(0).css('color', '#3f69a5');
                            selList[i].className = selList[i].className + " seled";
                        } else if (selList[i].className.indexOf("seled") > -1) {
                            //改变柱镜显示颜色
                            $(selList[i]).parents("#"+table_display_id).find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                            $(selList[i]).parents("#"+table_display_id).find("tr").eq(0).find("th").eq($(selList[i]).index()).css('color', '#3f69a5');

                            //改变柱镜显示颜色
                            $(".fist").find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                            $(".fist").find("th").eq($(selList[i]).index()).css('color', '#3f69a5');
                            //改变球镜显示颜色
                            $(selList[i]).parent().find("td").eq(0).css('background', '#dee9fa');
                            $(selList[i]).parent().find("td").eq(0).css('color', '#3f69a5');
                        }
                        } else {
                            if (selList[i].className.indexOf("seled") != -1) {
                                selList[i].className = "bs_bg";
                                //
                                //改变柱镜显示颜色
                                $(selList[i]).parents("#"+table_display_id).find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#f5f5f5');
                                //改变柱镜显示颜色
                                $(".fist").find("th").eq($(selList[i]).index()).css('background', '#f5f5f5');
                                //改变球镜显示颜色
                                $(selList[i]).parent().find("td").eq(0).css('background', '#f5f5f5');
                            }
                        }
                    }
                    var arr_td = new Array();
                    var arr_tr = new Array();
                    $(".seled").each(function () {
                        if ($.inArray($(this).index(), arr_td) == -1) {
                            arr_td.push($(this).index());
                        }
                        if ($.inArray($(this).parent("tr").index(), arr_tr) == -1) {
                            arr_tr.push($(this).parent("tr").index());
                        }
                    });
                    //清除样式
                    table_display.find("td").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    table_display.find("th").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    for (var seled_i = 0; seled_i < arr_tr.length; seled_i++) {
                        //第一个tr top
                        if (arr_tr[seled_i] == arr_tr.min()) {
                            //top
                            for (var seled_td_i = 0; seled_td_i < arr_td.length; seled_td_i++) {
                                if ((arr_tr[seled_i] - 1) == 0) {
                                    table_display.find("tr").eq(arr_tr[seled_i] - 1).find("th").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                                } else {
                                    table_display.find("tr").eq(arr_tr[seled_i] - 1).find("td").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                                }
                            }
                        }
                        //最后一个 bottom
                        if (arr_tr[seled_i] == arr_tr.max()) {
                            for (var seled_td_i = 0; seled_td_i < arr_td.length; seled_td_i++) {
                                table_display.find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                            }
                        }
                        //left
                        table_display.find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td.min() - 1).css("border-right", "2px solid #3f69a5");
                        //right
                        table_display.find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td.max()).css("border-right", "2px solid #3f69a5");
                    }
                }
                clearEventBubble(evt);
            }
            //事件会在鼠标按键被松开时发生。
            document.onmouseup = function () {
                isSelect = false;
                if (selDiv) {
                    //selDiv.style.display = "none";
                    if (~~$(selDiv).height() > 0) {
                        document.body.removeChild(selDiv);
                        showSelDiv(selList);
                    }
                }
                selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
            }
        }
    }
    function clearEventBubble(evt) {
        if (evt.stopPropagation)
            evt.stopPropagation();
        else
            evt.cancelBubble = true;
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
    }

    function showSelDiv(arr) {
        var count = 0;
        var selInfo = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].className.indexOf("seled") != -1) {
                count++;
                selInfo += arr[i].innerHTML + "\n";
            }
        }
        if (count > 300) {
            $(".seled").removeClass("seled");
            is_prompt = true;
            layer.msg("最多选择300种");
            return false;
        }
        if (count > 0) {
            is_prompt = false;
            var layer_index = layer.prompt({
                title: '共选择' + count + "种,请填写" + (table_display_id == 'table_number' ? "数量" : "价格"),
                zIndex: 1260,
                formType: 0,
                cancel: function (index, layero) {
                    //if(confirm('确定要关闭么')){
                    //只有当点击confirm框的确定时，该层才会关闭
                    $(".seled").removeClass("seled");
                    //清除样式
                    table_display.find("td").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    table_display.find("th").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    $(".f5").css('background', 'rgb(245, 245, 245)');
                    $(".f5").css('color', 'rgb(102, 102, 102)');
                    layer.close(index);
                    is_prompt = true;
                    //}
                    return false;
                },
                btn2: function () { //这里就是你要的
                    $(".seled").removeClass("seled");
                    //清除样式
                    table_display.find("td").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    table_display.find("th").css({
                        "border-bottom": "",
                        "border-right": ""
                    });
                    $(".f5").css('background', 'rgb(245, 245, 245)');
                    $(".f5").css('color', 'rgb(102, 102, 102)');
                    is_prompt = true;
                },
            }, function (text, index) {
                //if (text > 0) {
                //$(".seled").html();
                //layer.closeAll();
                layer.close(index);
                layer.close(layer_index);
                var prompt_cool = layer.load(0, {
                    shade: [0.3, '#fff'],
                    zIndex: 198910121260
                });
                var nums = text;
                var nums = table_display_id == 'table_number' ? parseInt(nums) : parseFloat(nums);
                if(text.length > 0 && !isNaN(nums)){
                    //ArrangementTr
                    var seled = new Array();
                    $(".seled").each(function () {
                        var attr = new Array();
                        attr.push($(this).parent().find("td").eq(0).data("vid"));
                        attr.push($(this).data("vid"));
                        
                        var data = new Object();
                        data.data_id = $(this).data("id");
                        data.qiu = $(this).parent().find("td").eq(0).text();
                        data.zhu = $(this).data("zhu");
                        data.attr = attr;
                        data.nums = parseInt(table_display_id == 'table_number' ? nums : 1);
                        data.price = parseFloat(table_display_id == 'table_number' ? shop_price : nums);
                        data.ball  = $(this).parent().find("td").eq(0).data("vid");
                        data.column  = $(this).data("vid");
                        data.column_title  = $(this).data("zhu");
                        data.obj   = $(this);
                        seled.push(data);
                    });
                    this_.qiuzhuj = seled;
                    ArrangementTr(seled);
                }
                $(".seled").removeClass("seled");
                //清除样式
                table_display.find("td").css({
                    "border-bottom": "",
                    "border-right": ""
                });
                table_display.find("th").css({
                    "border-bottom": "",
                    "border-right": ""
                });
                $(".f5").css('background', 'rgb(245, 245, 245)');
                $(".f5").css('color', 'rgb(102, 102, 102)');
                is_prompt = true;
                layer.close(prompt_cool);
            });
        }
        $("#selectDiv").remove();
    }
    $(document).on("change" , "#nums" , function (e){
        $("input[name=box]").val($(this).val());
    });
    $(document).on("change" , ".num" , function (e){
        var index = $(this).val();
        if (parseInt(index) == 0 || isNaN(parseInt(index))) {
            return;
        }
        num_s = index;
    });
    $(document).on("blur" , ".price_input" , function (e){
        $("#table_price").find("td[name="+$(this).parents("tr").attr("id")+"]").text($(this).val());
    });
    $(document).on("click" , ".td_inp td" , function (e){
        if($(this).children(".text_inp").length == 0){
            if ($(this).attr("name") == 'desa' || !$(this).hasClass("bs_bg")) return;
            is_prompt = false;
            var wd = $(this).width();
            var hr = $(this).height();
            $(this).css("width", wd);
            $(this).css("height", hr);
            var numss = "<input type='number' class='text_inp' style='width:100%;text-align:center;border:none;outline:1px solid #3f69a5;height:" + (hr - 3) + "px' value=" + $(this).text() + ">";
            $(this).html(numss);
            $(this).find("input").focus();
        }
    });

    $(document).on("blur" , ".text_inp" , function (e){
        var nums = table_display_id == 'table_number' ? parseInt($(this).val()) : parseFloat($(this).val());
        is_prompt = true;
        if($(this).val().length == 0){
            $(this).parent().css('background', "");
            $(this).remove();
            return false;
        }
        if (isNaN(nums)) nums = 0;
        var qiu = $(this).parent().parent().find("td").eq(0).text();
        var zhu = $(this).parent().attr("data-zhu");
        var attr = new Array();
        if (qiu == '' || zhu == '' || typeof zhu == 'undefined' || typeof qiu == 'undefined') return;
        attr.push($(this).parent().parent().find("td").eq(0).data("vid"));
        attr.push($(this).parent().attr("data-vid"));

        var data = new Object();
        data.data_id = $(this).parent().attr("data-id");
        data.qiu = qiu;
        data.zhu = zhu;
        data.attr = attr;
        data.nums = parseInt(table_display_id == 'table_number' ? nums : 1);
        data.price = parseFloat(table_display_id == 'table_number' ? shop_price : nums);
        data.obj   = $(this).parent("td");
        var arr = new Array();
        arr.push(data);
        if(ArrangementTr(arr, $(this).parent("td")) !== false){
            //$("#" + tr_id).text(nums);
            if (nums > 0) {
                //$(this).parent().css('background', nums == '' ? "" : '#ebf3fe');
                //$(this).parent().text(nums);
            } else {
                $(this).parent().css('background', "");
                //$(this).parent().text(" ");
            }
        }
    });

    function ArrangementTr(param, obj){
        //new Object();
        var ids = new Array();
        var value;
        for(var i = 0;i < param.length;i++){
            data = param[i];
            obj  = param[i].obj;
            /*var item = (new temp());
            item.id        = goodsinfo.id;
            item.merge     = goodsinfo.merge;
            item.quantity  = data.nums;
            item.unit      = goodsinfo.unit;
            item.price     = goodsinfo.price;
            item.selected  = goodsinfo.id;
            item.title     = goodsinfo.title;
            item.ball      = data.attr[0];
            item.column    = data.attr[1];
            item.token     = data.attr[0]+"_"+data.attr[1];
            //var k = this_.checkItemTokenSelected(item.token);checkItemSelected
            var k = this_.checkItemSelected(item.id);
            if(k >= 0){//修改
                //items
                //this_.items[k] = item;
            }else{
                //this_.items.push(item);//新增
            }*/
            obj.html(data.nums);
        }
        //this_.setTotal();
    }

    $(document).on("keydown" , ".text_inp" , function (e){
        var k_code = event.keyCode;
        if (k_code == 38 || k_code == 40 || k_code == 39 || k_code == 37) {
            var w_index = $(this).parent().index(); //横向
            var h_index = $(this).parent().parent().index(); //纵向
            switch (k_code) {
                case 38://上
                    h_index -= 1;
                    break;
                case 40://下
                    h_index += 1;
                    break;
                case 39://右
                    //h_index += 1;
                    w_index += 1;
                    break;
                case 37://左
                    //h_index += 1;
                    w_index -= 1;
                    break;
            }
            if (w_index == 0) w_index -= 1;
            $("#"+table_display_id).find("tr").eq(h_index).find("td").eq(w_index).trigger("click");
            return false;
        }
    });