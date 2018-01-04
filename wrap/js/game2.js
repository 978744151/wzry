    var mindeal = 10;//最小下单金额
    var maxdeal = 5000;//最大下单金额

    var touchspeed = 50;//增减按钮触发频率
    var touchlong = 0;
    var touchtimer = '';
    var touchthis = '';

    var numRun_SINGPLUR,numRun_BIGLITTLE;
    var numspeed = 3000;
    var numshow = '1241';
    var numArr = new Array();
    var numStop = new Array();
    var numAnimateTimer = '';

    var heartbeatTimer = null;
    var heartbeattime = 19;
    var heartstoptime = 5;
    var timeover = 0;
    var timestamp = 2; //获取的后台时间戳

    var imageflowTimer = null;
    var imageflowCheckTimer = null;
    var imageflow = '';//$('.imageflow>span')
    var imageflow_left = 10;//间距
    var imageflow_depth = 0.8;//深度
    var imageflow_count = 2;//一边有几个
    var imageflow_shift = 3;//初始偏移量
    var imageflow_target = 15;//目标结果
    var imageflow_type = 0;
    var imageflow_marigintop = -22;//margintop偏移量
    var window_Width = 0;
    var nowimglength = 0;//起始元素

    //MAIN
    function heartbeat(){
        var tureBeatTime = heartbeattime + heartstoptime;
        //var timestamp = Date.parse(new Date())/1000;
        var second = tureBeatTime - timestamp % tureBeatTime - 1 ;

        if(( second > heartbeattime || second <= 0 ) && timeover == 0){
            timeover = 1;
            $('.deal').unbind('click');

              // 按钮灰色  .deal 下注按钮  点击时候更改图片 并且改变bgc-size
            $('.deal').css({'background':'url("images/btn_unbind.png")','background-size':'100% 100%','color':'white'});
//          显示（停止下注）
            $('.z_show').fadeIn(200);
            var sucfunc = function(){
                 // 更新数据时
                updatenumber();
                  // 英雄动画开始
                imageflowStartanimate();
                setTimeout(function(){
                     // 英雄动画开始
                    imageflowStopanimate();
                },heartstoptime*1000/2)
            }
            var errFunc = function(){
                // 按钮灰色
                // 按钮点击时候运行
                $('.deal').css({'background':'url("images/btn_yellow.png")','background-size':'100% 100%','color':'#460202'});
                // 隐藏停止下注
                $('.z_show').fadeOut(200);
                $('.deal').on('click',function(){
                    // 下单按钮
                    bindDealBtn(this);
                });
            }
            AjaxGame(sucfunc,errFunc);
        }else if( second <= heartbeattime && second > 0 ){
            timeover = 0;
        }else{
            second = 0;
        }
           // 圆框事件 second为里面的倒计时时间
        $('.game_timer_box>span>a').html(second);

    }


    //英雄动画滚动
    //英雄动画轮播效果
    function imageflowinit(){
        imageflow = $('.imageflow>span'); //下面的span图片
        var imgflowlength = imageflow.length;//总儿子数
        var thisimglength = 0; //图片长度
        // 遍历动画
        imageflow.each(function(){
            //如果    图片长度减去图片偏移量（0） <= 图片个数（7） 并且图片长度（0） 减去图片偏移量(3) >=0 则 进行下面动画
            if((thisimglength - imageflow_shift ) <= imageflow_count && (thisimglength - imageflow_shift ) >= 0){//偏移量左边显示图片
                $(this).css({
                    'z-index': 10 + (thisimglength - imageflow_shift ) ,//10 + ( 0 - 3 )
                    'margin-left': (thisimglength - imageflow_shift ) * imageflow_left - imageflow_count * imageflow_left + '%',//((0-3)*10 - 2 * 10)%
                    'margin-top': (100 + imageflow_marigintop - 100 * Math.pow(imageflow_depth, imageflow_count - (thisimglength - imageflow_shift ))) / 4 + '%', //
                    'height': 100 * Math.pow(imageflow_depth, imageflow_count - (thisimglength - imageflow_shift )) + '%',
                    'opacity':'1'
                });
                //如果    图片长度减去图片偏移量（0） <= 图片个数（7） 并且图片长度（0） 减去 图片偏移量(3) >(一边有几个（2） 则 进行下面动画
            }else if((thisimglength - imageflow_shift) <= imageflow_count*2 && (thisimglength - imageflow_shift) >= imageflow_count ){
                $(this).css({//偏移量右边显示图片
                    'z-index': 10 + imageflow_count*2- (thisimglength - imageflow_shift),
                    'margin-left': (thisimglength - imageflow_shift) * imageflow_left - imageflow_count * imageflow_left + '%',
                    'margin-top': (100 + imageflow_marigintop - 100 * Math.pow(imageflow_depth, (thisimglength - imageflow_shift) - imageflow_count)) / 4 + '%',
                    'height': 100 * Math.pow(imageflow_depth,(thisimglength - imageflow_shift) - imageflow_count) + '%',
                    'opacity':'1'
                });
            }else{
                // 否则进行此动画
                $(this).css({
                    'z-index': 10 ,
                    'margin-left': imageflow_count * imageflow_left + '%',
                    'margin-top': (100 + imageflow_marigintop - 100 * Math.pow(imageflow_depth, imageflow_count)) / 4 + '%',
                    'height': 100 * Math.pow(imageflow_depth, imageflow_count) + '%',
                    'opacity':'0'
                });
            }
            thisimglength++;//图片的长度++
        })
        if(imgflowlength - imageflow_shift - imageflow_count*2 < 0){
            thisimglength = 0;
            imageflow.each(function(){
                if( imgflowlength - imageflow_shift + thisimglength < imageflow_count  && imgflowlength - imageflow_shift + thisimglength >= 0){
                    $(this).css({//偏移量右边显示图片
                        'z-index': 10 + (imgflowlength - imageflow_shift + thisimglength ) ,
                        'margin-left': (imgflowlength - imageflow_shift + thisimglength ) * imageflow_left - imageflow_count * imageflow_left + '%',
                        'margin-top': (100 + imageflow_marigintop - 100 * Math.pow(imageflow_depth, imageflow_count - (imgflowlength - imageflow_shift + thisimglength ))) / 4 + '%',
                        'height': 100 * Math.pow(imageflow_depth, imageflow_count - (imgflowlength - imageflow_shift + thisimglength)) + '%',
                        'opacity':'1'
                    });
                }else if(imgflowlength - imageflow_shift + thisimglength <= imageflow_count*2 && imgflowlength - imageflow_shift + thisimglength >= imageflow_count ){
                    $(this).css({//偏移量右边显示图片
                        'z-index': 10 + (-( imgflowlength - imageflow_shift - imageflow_count*2 ) - thisimglength) ,
                        'margin-left': (imgflowlength - imageflow_shift + thisimglength ) * imageflow_left - imageflow_count * imageflow_left + '%',
                        'margin-top': (100 + imageflow_marigintop - 100 * Math.pow(imageflow_depth, (imgflowlength - imageflow_shift + thisimglength ) - imageflow_count)) / 4 + '%',
                        'height': 100 * Math.pow(imageflow_depth,(imgflowlength - imageflow_shift + thisimglength ) - imageflow_count) + '%',
                        'opacity':'1'
                    });
                }
                thisimglength++;
            });
            if(imageflow_shift - imgflowlength == 0){
                imageflow_shift = 0;
            }
        }

    }


    //英雄动画开始
    function imageflowStartanimate(){
        $('.choose_border').fadeOut(200);
        setTimeout(function(){
            if(imageflowTimer == null){
                   // 英雄场渐入
                $('#HERO .game_choose').fadeOut(2000);
                   // 英雄场中部渐入
                $('#HERO .game_show').animate({'height':'70%','top':'10%'});//动画开始
                // 宝箱渐入渐出效果
                $('#HERO .game_chest_box').fadeOut(2000);
                // 时间渐入渐出效果
                $('#HERO .game_timer_box').fadeOut(200);
                setTimeout(function(){
                    imageflow_type = 1;
                    imageflowTimer = setInterval(function(){
    // 英雄数目  =  图片偏移量+图片个数  <  英雄场中部个数  ？ 图片偏移量 + 图片个数 ：图片偏移量 + 图片个数 - 英雄场中部个数
    // /////////////////////想代表什么？？？？？？？？？？？？？？？？？？？？？？？？
                        var heronum =  imageflow_shift + imageflow_count < $('#HERO .game_choose>span').length ? imageflow_shift + imageflow_count : imageflow_shift + imageflow_count - $('#HERO .game_choose>span').length;
                        if(imageflow_type == 0 && heronum+1 == imageflow_target ){
                            clearInterval(imageflowTimer);
                            imageflowTimer = null;
                        }else{
                            imageflow_shift++;
                            imageflowinit();
                        }
                        //?????????????????????????????????????????????????????????
                    },150)
                },500)
            }
        },400);
    }
    //英雄动画停止
    function imageflowStopanimate(){
        if(imageflow_type==1){
            imageflow_type = 0;
// ？？？？？？？？？？？？？？？？？？
            imageflowCheckTimer = setInterval(function(){
                if(imageflowTimer == null){
                    clearInterval(imageflowCheckTimer);
                    imageflowCheckTimer = null;
                    setTimeout(function(){
                          // 英雄数目  =  图片偏移量+图片个数  <  英雄场中部个数  ？ 图片偏移量 + 图片个数 ：图片偏移量 + 图片个数 - 英雄场中部个数
                        var heronum =  imageflow_shift + imageflow_count < $('#HERO .game_choose>span').length ? imageflow_shift + imageflow_count : imageflow_shift + imageflow_count - $('#HERO .game_choose>span').length;
// ？？？？？？？？？？？？？？？
//动画停止后进行的动画
                        //英雄名框渐隐
                        $('#HERO .game_choose').fadeIn(2000);
                        $('#HERO .game_chest_box').fadeIn(2000);
                        // 英雄图片显示框 高度变化
                        $('#HERO .game_show').animate({'height':'40%','top':'0%'},2000);
                        setTimeout(function(){
                            // 如果
                            $('#HERO .game_choose>span:eq('+heronum+')').addClass('on');

                            // 遍历每个金币
                            $('#HERO .game_choose>span>b').each(function(){
                                if(!$(this).parent().hasClass('on')){
                                    // console.log(this);
                                    $(this).fadeOut(2000);
                                }
                            })


                            setTimeout(function(){
                                // 遍历英雄框每个下面的下边框的b
                                $('#HERO .game_choose>span>b').each(function(){
                                    // 如果b标签的 父元素里 有on
                                    console.log($(this));
                                    if($(this).parent().hasClass('on')){
                                        console.log($(this).parent());
                                        var parleft = $(this).parent()[0].offsetLeft;
                                        console.log(parleft);
                                        $(this).animate({'top': '-800%','left': 120 - parleft + 'px',},2000);
                                    }
                                })
                                setTimeout(function(){
                                    $('#HERO .game_choose>span>b').remove();
                                    $('#HERO .game_choose>span').removeClass('on');
                                },500)
                            },500);
                            $('.choose_border').fadeIn(2000);
                            // 点击按钮进行样式转换
                            $('#HERO .deal').css({'background':'url("images/btn_yellow.png")','background-size':'100% 100%','color':'#460202'});
                            $('#HERO .deal').on('click',function(){
                                bindDealBtn(this);
                                // 点击下注按钮时 ，执行金币动画
                            });
                        },400);
                    },500);
                    /*clearInterval(imageflowTimer);
                    imageflowTimer = null;*/
                }
            },100)
        }
    }
// 检查值
    function check_value(_self){

        var value = _self.value;
        console.log(value);
        if(value==''){
            value = mindeal;
        }else if(parseInt(value)>maxdeal){
            value = maxdeal;
        }else if(parseInt(value)<mindeal){
            value = mindeal;
        }
        _self.value = value;

    }
// 滑动时间
// ?????????????????????????????????????????????????不懂
    function BindTouchTime(op){
        // 数字的加减取值
        var value = touchthis.parent().find('input')[0].value;
        console.log(value);
        var num = 10;
        if(touchlong>20){
            num = 10;
        }
        if(touchlong>40){
            num = 100;
        }
        if(touchlong>90){
            //num = 1000;
        }
        if(touchlong==1||touchlong>5){
            if(op=='+'){
                value = parseInt(value) + num > maxdeal ? maxdeal : parseInt(value) + num;
            }else{
                value = parseInt(value) - num < mindeal ? mindeal : parseInt(value) - num;
            }
        }
        touchthis.parent().find('input')[0].value = value;
    }
// ????????????????????????????????????????????
    function clearTouchTimer(){
        // 清除定时器
        clearInterval(touchtimer);
        touchtimer = '';
        touchlong = 0;
    }

    //更新数字
    ////精确场更新数字  对精确场
    function updatenumber(){
        numRun_SINGPLUR = $("#NUM .game_allnum").numberAnimate({
            num:numshow, //默认1241
            speed:numspeed, //速度3000
            numlength:true //num的长度为true
        });
        numStop[0] = 1;
        numStop[1] = 1;
        numStop[2] = 1;
        console.log(numStop);
        // numStop[0,1,2] = 1 1 1;
        numAnimateTimer = setInterval(function(){
            // 对精确场的3个span数字进行动画 ↓
            var lineHeight = parseFloat($('.game_num_box>span').css('line-height'));
            if(numStop[0]){
                numArr[0] = parseInt(numArr[0])+1 <= 9? parseInt(numArr[0])+1 : 0;
                $('.game_num_box>span:eq(0)>div').animate({'top':'-'+lineHeight*numArr[0]+'px'},100,'linear');
            }
            if(numStop[1]){
                numArr[1] = parseInt(numArr[1])+1 <= 9? parseInt(numArr[1])+1 : 0;
                $('.game_num_box>span:eq(1)>div').animate({'top':'-'+lineHeight*numArr[1]+'px'},100,'linear');
            }
            if(numStop[2]){
                numArr[2] = parseInt(numArr[2])+1 <= 9? parseInt(numArr[2])+1 : 0;
                $('.game_num_box>span:eq(2)>div').animate({'top':'-'+lineHeight*numArr[2]+'px'},100,'linear');
            }
        },80)
        setTimeout(function(){
            setnumber();//更新尾数
        },numspeed/3);
    }

    //更新尾数
    function setnumber(){
        setTimeout(function(){
            numStop[0] = 0;
            var lastnum = (numshow % 500).toString();
            console.log(lastnum);
            numArr[0] = parseInt(lastnum/100);
            var lineHeight = parseFloat($('.game_num_box>span:eq(0)>div').css('line-height'));
            $('.game_num_box>span:eq(0)>div').stop();
            $('.game_num_box>span:eq(0)>div').animate({'top':'-'+lineHeight*numArr[0]+'px'},200);
        },0);
        setTimeout(function(){
            numStop[1] = 0;
            var lastnum = (numshow % 1000).toString();
            numArr[1] = parseInt(lastnum/10 - numArr[0]*10);
            var lineHeight = parseFloat($('.game_num_box>span:eq(1)>div').css('line-height'));
            $('.game_num_box>span:eq(1)>div').stop();
            $('.game_num_box>span:eq(1)>div').animate({'top':'-'+lineHeight*numArr[1]+'px'},400);
        },500);
        setTimeout(function(){
            numStop[2] = 0;
            var lastnum = (numshow % 1000).toString();
            numArr[2] = parseInt(lastnum/1 - numArr[0]*100 - numArr[1]*10);
            var lineHeight = parseFloat($('.game_num_box>span:eq(2)>div').css('line-height'));
            $('.game_num_box>span:eq(2)>div').stop();
            $('.game_num_box>span:eq(2)>div').animate({'top':'-'+lineHeight*numArr[2]+'px'},600);
        },1000);
        // 这里要做出什么效果？？？？？？？？？？？？？？？？
        setTimeout(function(){
            clearInterval(numAnimateTimer);numAnimateTimer='';
            setTimeout(function(){
                var endnum = parseInt(numArr[0]) + parseInt(numArr[1]) + parseInt(numArr[2]);
                console.log(endnum);
                var spanhtml = numArr[0] + '+' + numArr[1] + '+'  + numArr[2] + '=' + endnum;
                var ahtml = '';
                ahtml += endnum >= 13 ? "大":"小";
                ahtml += endnum%2==0 ? '/双':'/单';
                ahtml += numArr[0]==numArr[1] && numArr[1]==numArr[2] ? '/三条':'';
                ahtml += (numArr[0]+1==numArr[1] && numArr[1]+1==numArr[2])||(numArr[0]-1==numArr[1] && numArr[1]-1==numArr[2])?'/顺子':'';
                $('#NUM .game_num_end>span').html(spanhtml);
                $('#NUM .game_num_end>a').html(ahtml);
                $('#NUM .game_num_end').fadeIn(200);
// on 更换场景  有on则为精确场
                if(endnum>=13){$('#NUM .game_choose>.big').addClass('on');}
                else{$('#NUM .game_choose>.little').addClass('on');}
                if(endnum%2==0){$('#NUM .game_choose>.dual').addClass('on');}
                else{$('#NUM .game_choose>.singular').addClass('on');}
                if(numArr[0]==numArr[1] && numArr[1]==numArr[2]){$('#NUM .game_choose>.set').addClass('on');}
                if((numArr[0]+1==numArr[1] && numArr[1]+1==numArr[2])||(numArr[0]-1==numArr[1] && numArr[1]-1==numArr[2])){$('#NUM .game_choose>.straight').addClass('on');}
                // 遍历NUM下面的game _coin
                $('#NUM .game_coin').each(function(){
                    // 如果
                    if(!$(this).parent().hasClass('on')){
                        $(this).fadeOut(200);
                    }
                });
                setTimeout(function(){
                    $('#NUM .game_coin').each(function(){
                        if($(this).parent().hasClass('on')){
                            var parleft = $(this).parent()[0].offsetLeft;
                            $(this).animate({'top': '-800%','left': 120 - parleft + 'px',},300,'linear');
                        }
                    });
                    $('#NUM .game_num_end').fadeOut(200);
                    $('#NUM .game_choose>span').removeClass('on');
                    setTimeout(function(){
                        $('#NUM .game_coin').remove();//移除金币
                        $('#NUM .deal').css({'background':'url("images/btn_yellow.png")','background-size':'100% 100%','color':'#460202'});//更换图片
                        $('#NUM .deal').on('click',function(){
                            bindDealBtn(this);
                        });//点击的时候 执行bindDealbtn动画
                    },300)
                },2000);
            },1500);
        },1000);
    }

    //重新定位数字位置
    function resizenumber(){
        if(numStop[0] == 0){
            var lastnum = (numshow % 1000).toString();
            numArr[0] = parseInt(lastnum/100);
            var lineHeight = parseFloat($('.game_num_box>span:eq(0)>div').css('line-height'));
            $('.game_num_box>span:eq(0)>div').stop();
            $('.game_num_box>span:eq(0)>div').css({'top':'-'+lineHeight*numArr[0]+'px'});
        }
        if(numStop[1] == 0){
            var lastnum = (numshow % 1000).toString();
            numArr[1] = parseInt(lastnum/10 - numArr[0]*10);
            var lineHeight = parseFloat($('.game_num_box>span:eq(1)>div').css('line-height'));
            $('.game_num_box>span:eq(1)>div').stop();
            $('.game_num_box>span:eq(1)>div').css({'top':'-'+lineHeight*numArr[1]+'px'});
        }
        if(numStop[2] == 0){
            var lastnum = (numshow % 1000).toString();
            numArr[2] = parseInt(lastnum/1 - numArr[0]*100 - numArr[1]*10);
            var lineHeight = parseFloat($('.game_num_box>span:eq(2)>div').css('line-height'));
            $('.game_num_box>span:eq(2)>div').stop();
            $('.game_num_box>span:eq(2)>div').css({'top':'-'+lineHeight*numArr[2]+'px'});
        }
    }

    //初始化数字动效
    function initnumber(){
        numRun_SINGPLUR = $("#NUM .game_allnum").numberAnimate({
            num:numshow,
            speed:0,
            numlength:true
        });
        var lastnum = (numshow % 1000).toString();
        numArr[0] = parseInt(lastnum/100);
        numArr[1] = parseInt(lastnum/10 - numArr[0]*10);
         console.log(numArr[1]);
        numArr[2] = parseInt(lastnum/1 - numArr[0]*100 - numArr[1]*10);

        var lineHeight = parseFloat($('.game_num_box>span').css('line-height'));

        //初始化结尾数字结果
        $('.game_num_box>span:eq(0)>div').animate({'top':'-'+lineHeight*numArr[0]+'px'},1000);
        $('.game_num_box>span:eq(1)>div').animate({'top':'-'+lineHeight*numArr[1]+'px'},1000);
        $('.game_num_box>span:eq(2)>div').animate({'top':'-'+lineHeight*numArr[2]+'px'},1000);

        //alert(lineHeight);
    }

    //宝箱点击事件
    function BindChestEvent(){
        $('.game_chest_img').unbind('click');
        $('.game_chest_img_on').unbind('click');
// 宝箱 .game_chest_img
        $('.game_chest_img').on('click',function(){
            var oncount = 0;
            // oncount = 亮灯的个数
            oncount = $(this).parent().find('.game_chest_rate>.on').length;
            $(this).parent().find('.game_chest_rate>span').eq(5-oncount-1).addClass('on');
            if(oncount>=4){
                // 如果亮灯个数大于4 进行后面动画
                $(this).addClass('game_chest_img_on');
                $(this).parent().find('.game_chest_rate>span').addClass('on');
                $(this).parent().find('.game_chest_light').removeClass('none');
                BindChestEvent();
            }
        });
        $('.game_chest_img_on').on('click',function(){
            // 再次点击后，移除亮灯效果
            $(this).removeClass('game_chest_img_on');
            $(this).parent().find('.game_chest_rate>span').removeClass('on');
            $(this).parent().find('.game_chest_light').addClass('none');
            BindChestEvent();
        });
    }

    //下单按钮点击事件 金币动画事件
    function bindDealBtn(e){
        // console.log(e);
        //?????没有找到p标签
        if($(e).parent().parent().find('.game_choose').find('p').length){
            var func = function(e){
                var _self = e;
                console.log(_self);
                // ？？？没找到input
                var value = $(_self).parent().find('input')[0].value;
                    // 给hero加一个自定义属性
                var type = $(_self).parent().parent().attr('id');
                if($(_self).parent().parent().find('.game_choose').find('p').length){
                    // console.log($(this));
                    // 如果span父父元素 p下面的长度
                    // 遍历每一个p
                    $(_self).parent().parent().find('.game_choose').find('p').each(function(){
                        //$(this).parent().append('<b class="game_coin"><img src="images/game_coin_icon.png"/></b>');
                        //
                        // 在p的父元素上加上img 金币
                        $(this).parent().append('<b class="game_coin"><img src="images/game_coin_icon.png"/></b>');
                        // 父元素下寻找最后一个b标签 设置top属性
                        var nowbtop = parseInt($(this).parent().find('b:last').css('top'));
                        // 对最后一个b标签添加left属性
                        var nowbleft = parseInt($(this).parent().find('b:last').css('left'));

                        // 选中的金币span
                        var parleft = $(this).parent()[0].offsetleft;
                        // console.log(parleft);
                        // console.log($(this).parent()[0]);
                        var bleft = $(this).parent().find('b')[0].offsetLeft;
                        // b标签offsetleft
                        // console.log($(this).parent().find('b')[0]);
                        // console.log(bleft);

                        var random_l = Math.random()*16 - 8;//( 8到16之间)
                        var random_t = Math.random()*10 - 5; // (5到10之间)
                        $(this).parent().find('b:last').css({'left':window_Width/2 - parleft + 'px','top':'200%'});//  金币移动动画

                        $(this).parent().find('b:last').animate({'top': nowbtop + random_t + 'px','left': nowbleft + random_l + 'px','opacity':'1'},200); //金币移动动画
                        $(this).remove();
                        $('.game_choose span').removeClass('once')
                        console.log($(this)[0]);
                    });
                }
            }
            //AJAX
            AjaxDeal(func,e);
        }else{
            errorMsg('请选择下注选项!');
        }
    }
    function page_onload(){
        window_Width = document.body.clientWidth; //窗口宽度
        //改变窗口大小时重新定位数字位置
        window.onresize = resizenumber;

        //HIDE LOADING VIEW
        initPage();


        //获取当前数据
        var initFunction = function(){
            // 轮播偏移竖 = 轮播目标数 + 轮播个数 < 轮播图片数量 ？ 目标数+个数 ：目标数+图片轮播个数 - 图片轮播个数
            imageflow_shift = imageflow_target + imageflow_count <= $('.imageflow>span').length ? imageflow_target + imageflow_count : imageflow_target + imageflow_count - $('.imageflow>span').length;
            //初始化英雄场
            imageflowinit();
            //初始化数字场
            initnumber();
            $('.choose_border').fadeIn(200);
        }
        AjaxGame(initFunction)

        //心跳
        heartbeatTimer = setInterval(function(){
            heartbeat();//主体初始化
        },1000);
        BindChestEvent();

        //下单选项按钮事件
        $('.game_choose>span').on('click',function(){
            var addmoney = $(this).parent().parent().find('input')[0].value;
            if($(this).find('p').length>=1){
                var phtml = $(this).find('p').find('a').html();
                phtml = parseInt(phtml) + parseInt(addmoney);
                $(this).find('p').find('a').html(phtml);
            }else{
                $(this).append('<p>x<a>'+addmoney+'</a></p>');
            }
        });

        //切换游戏按钮事件
        $('.game_nav>span').on('click',function(){
            var _self = $(this);
            if(_self.hasClass('on')){
                return false;
            }else{
                $('.game_nav>span').removeClass('on');
                var show_box = _self.attr('name');
                $('.game_content>div').removeClass('on');
                $('#'+show_box).addClass('on');
                _self.addClass('on');
                initnumber();
            }
        });

        //加减号按钮事件
        // $('.minus').on('touchstart',function(e){
        //     e.preventDefault();
        //     $(this).css({'height': '94%','top': '3%'});
        //     touchthis = $(this);
        //     touchtimer = setInterval(function(){
        //         BindTouchTime('-');
        //         touchlong++;
        //     },touchspeed);
        //     touchlong++;
        // });
        $('.minus').on('touchstart',function(e){
            e.preventDefault();
            $(this).css({'height': '94%','top': '3%'});
            touchthis =$(this)
            touchtimer = setInterval(function(){
                BindTouchTime('-');
                touchlong++;
            },touchspeed);
        })
        $('.plus').on('touchstart',function(e){
            e.preventDefault();
            $(this).css({'height': '94%','top': '3%'});
            touchthis = $(this);
            touchtimer = setInterval(function(){
                touchlong++;
                BindTouchTime('+');
            },touchspeed);
        });
        $('.minus').on('touchend',function(){
            clearTouchTimer();
            $(this).css({'height': '100%','top': '0%'});
        });
        $('.plus').on('touchend',function(){
            clearTouchTimer();
            $(this).css({'height': '100%','top': '0%'});
        });

        //最大按钮事件
        // 撤销移除事件
        $('.max').on('click',function(){
            $('.game_choose>span>p').remove();
            //$(this).parent().find('input')[0].value = maxdeal;
        });
        // 触摸前后动画事件
        $('.max').on('touchstart',function(){
            $(this).css({'width':'22%','left':'3.5%','height':'38px','margin-top':'11px'});
        });
        $('.max').on('touchend',function(){
            $(this).css({'width':'23%','left':'3%','height':'40px','margin-top':'10px'});
        });

        //下单按钮事件
        //点击时候进行
        $('.deal').on('click',function(){
            bindDealBtn(this);
        });
        // 下单机芯的动画
        $('.deal').on('touchstart',function(){
            $(this).css({'width':'22%','right':'3.5%','height':'38px','margin-top':'11px'});
        });
        $('.deal').on('touchend',function(){
            $(this).css({'width':'23%','right':'3%','height':'40px','margin-top':'10px'});
        });

        //headerBTN动画效果
        $('.btnbox>span').on('touchstart',function(){
            $(this).css({
                'height': '18px',
                'margin': '29px 0px',
                'padding': '0px 8px'
            });
        });
        $('.btnbox>span').on('touchend',function(){
            $(this).css({
                'height': '20px',
                'margin': '28px 0px',
                'padding': '0px 7px'
            });
        });

        $('.btn').on('click',function(){
            var boxid = $(this).attr('name');
            $('#'+boxid).fadeIn(200);
        })
    }


    function AjaxCheat(func,e){//下单接口
        var data = 1;//Math.random()*10 > 8 ? 1 : 0;
        if(data){//成功
            func(e);
        }else{//失败
            errorMsg('下单失败');
        }
    }
    function AjaxDeal(func,e){//下单接口
        var data = Math.random()*10 > 9 ? 1 : 0;
        if(data){//成功
            func(e);
        }else{//失败
            errorMsg('下单失败');
        }
    }
    function AjaxGame(sucfunc,errFunc){//获取结果接口
        var data = Math.random()*10 > 9 ? 1 : 0;
        if(data){//成功
            numshow = '99999999';
            hero = parseInt(Math.random()*11+1);
            imageflow_target = hero - imageflow_count > 0 ? hero - imageflow_count : $('#HERO .game_choose>span').length - hero - imageflow_count;
            sucfunc();
        }else{//失败
            errorMsg('网络异常,请刷新页面查看结果');
            if(errFunc) errFunc();
        }
    }