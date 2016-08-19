/**
 * Created by smallclover on 2016/8/19.
 *
 * 播放器控制js
 */
    var video = document.querySelector("video");
    var progress = document.querySelector(".progress");
    var loaded = document.querySelector(".progress > .loaded");
    var currPlayTime = document.querySelector(".timer > .current");
    var totalTime = document.querySelector(".timer > .total");
    var isVolume = document.querySelector(".volume");
    var isPlay = document.querySelector(".switch");
    //speed text clicked
    $('.btnx1').on('click', function () {
        fastfowrd(this, 1);
    });
    $('.btnx3').on('click', function () {
        fastfowrd(this, 3);
    });
    var fastfowrd = function (obj, spd) {
        /*          $('.text').removeClass('selected');
         $(obj).addClass('selected');*/
        video.playbackRate = spd;
        video.play();
    };


    //当视频可播放的时候
    $('video').on("canplay", function () {
        //显示视频
        video.style.display = "block";
        //显示视频总时长
        totalTime.innerHTML = getFormatTime(video.duration);
    });

    //播放按钮控制
    $('.switch').on('click', function () {
        if (video.paused) {
            this.classList.toggle("fa-pause");
            this.classList.toggle("fa-play");
            video.play();
        } else {
            this.classList.toggle("fa-play");
            this.classList.toggle("fa-pause");
            video.pause();
        }
    });

    //音量按钮 //bug
    isVolume.onclick = function () {
        if (video.muted) {
            video.muted = false;
            //toggle存在的删除，不存在则添加
            if (video.volume > 0.5) {
                this.classList.toggle("fa-volume-off");//删除元素
                this.classList.toggle("fa-volume-up");//添加元素
            }

            if (video.volume < 0.5) {
                this.classList.toggle("fa-volume-off");//删除元素
                this.classList.toggle("fa-volume-down");//添加元素
            }
            $('.volumeInner').css('width', video.volume * 100 + '%');//?bug
        } else {
            video.muted = true;
            if (video.volume > 0.5) {
                this.classList.toggle("fa-volume-up");//删除元素
                this.classList.toggle("fa-volume-off");//添加元素
            }

            if (video.volume < 0.5) {
                this.classList.toggle("fa-volume-down");//删除元素
                this.classList.toggle("fa-volume-off");//添加元素
            }
            $('.volumeInner').css('width', 0);
        }

    }

    //全屏
    $('.expand').on('click', function () {
       video.webkitRequestFullScreen();//没有做兼容性处理
    });

    //播放进度
    video.ontimeupdate = function () {
        var currTime = this.currentTime,    //当前播放时间
            duration = this.duration;       // 视频总时长
        //百分比
        var pre = currTime / duration * 100 + "%";
        //显示进度条
        loaded.style.width = pre;

        //显示当前播放进度时间
        currPlayTime.innerHTML = getFormatTime(currTime);
    };

    //跳跃播放
    progress.onclick = function (e) {
        var event = e || window.event;
        video.currentTime = (event.offsetX / this.offsetWidth) * video.duration;
    };

    //播放完毕还原设置bug
    video.onended = function(){
        var that = this;
        //切换播放按钮状态
        isPlay.classList.remove("fa-pause");
        isPlay.classList.add("fa-play");
        //进度条为0
        loaded.style.width = 0;
        //还原当前播放时间
        currPlayTime.innerHTML = getFormatTime();
        //视频恢复到播放开始状态
        that.currentTime = 0;
    };

    function getFormatTime(time) {
        var time = time || 0;

        var h = parseInt(time / 3600),
            m = parseInt(time % 3600 / 60),
            s = parseInt(time % 60);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        return h + ":" + m + ":" + s;
    }

    var volumeDrag = false;
    $('.volumeBar').on('mousedown', function (e) {
        volumeDrag = true;
        video.muted = false;
    //            $('.sound').removeClass('muted');
        updateVolume(e.pageX);
    });
    $(document).on('mouseup', function (e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });
    $(document).on('mousemove', function (e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });
    var updateVolume = function (x, vol) {
        var volume = $('.volumeBar');
        var percentage;
        //if only volume have specificed
        //then direct update volume
        if (vol) {
            percentage = vol * 100;
        }
        else {
            var position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        //update volume bar and video volume
        $('.volumeInner').css('width', percentage + '%');
        video.volume = percentage / 100;

        //change sound icon based on volume
        if (video.volume == 0) {
            $('.volume').removeClass('fa-volume-up').removeClass('fa-volume-down').addClass('fa-volume-off');
        }
        else if (video.volume > 0.5) {
            $('.volume').removeClass('fa-volume-off').removeClass('fa-volume-down').addClass('fa-volume-up');
        }
        else {
            $('.volume').removeClass('fa-volume-off').removeClass('fa-volume-up').addClass('fa-volume-down');
        }

    };