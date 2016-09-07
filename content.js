var $ = require("jquery");
var vue = require("vue");
$(function () {
    var isTplPage=location.href.indexOf("post_nav_add.htm")>-1?true:false;
    console.log(isTplPage);
    //请求要注入的html
    chrome.runtime.sendMessage({ query: 1 }, function (response) {
        $("body").append(response.htmlTpl);
        $("head").append(response.cssTpl);
        new vue({
            el: "#VueCtr",
            data: {
                left: -273,
                picSelected: false,
                wordSelected: false,
                tableSelected: false,
                picWordSelected: false
            },
            methods: {
                toggle: function () {
                    if (this.left == 0) {
                        this.left = -273;
                    } else {
                        this.left = 0;
                    }
                },
                selectTab: function (id) {
                    if (id == 1) {
                        this.picSelected = true;
                        this.wordSelected = false;
                        this.picWordSelected = false;
                        this.tableSelected = false;
                    }
                    else if (id == 2) {
                        this.picSelected = false;
                        this.wordSelected = true;
                        this.picWordSelected = false;
                        this.tableSelected = false;
                    } else if (id == 3) {
                        this.picSelected = false;
                        this.wordSelected = false;
                        this.picWordSelected = true;
                        this.tableSelected = false;
                    }
                    else {
                        this.picSelected = false;
                        this.wordSelected = false;
                        this.picWordSelected = false;
                        this.tableSelected = true;
                    }
                }
            }
        });
        on_ini();
        var o = document.getElementById("VueCtr").getElementsByClassName("thumbnail");
        for (var i = 0; i < o.length; i++) {
            o[i].onmousedown = function (e) {
                if (dragobj.otemp != null)
                    return false
                e = e || event
                dragobj.otemp = this.parentNode.cloneNode(true);
                dragobj.xy = getxy(this.parentNode)
                dragobj.xx = [(e.x - dragobj.xy[1]), (e.y - dragobj.xy[0])]
                console.log("xy", dragobj.xy);
                console.log("xx", dragobj.xx);
                console.log("e.x", e.x);
                console.log("e.clientX", e.clientX);
                console.log("e.screenX", e.screenX);
                console.log("e.offsetX", e.offsetX);
                console.log("e.y", e.y)
                console.log("e.clientY", e.clientY);
                console.log("e.screenY", e.screenY);
                console.log("e.offsetY", e.offsetY);
                console.log("----------------------------------------------------");
                // dragobj.o.style.width = dragobj.xy[2] + "px";
                // dragobj.o.style.height = dragobj.xy[3] + "px"
                // dragobj.o.style.left = (e.x - dragobj.xx[0]) + "px"
                // dragobj.o.style.top = (e.y - dragobj.xx[1]) + "px"
                // dragobj.o.style.position = "absolute"
                dragobj.otemp.style.position = "absolute";
                dragobj.otemp.style.left = (e.x - dragobj.xx[0] + 20) + "px";
                dragobj.otemp.style.top = (e.y - dragobj.xx[1] + 10+document.body.scrollTop) + "px";
                dragobj.otemp.style.width = dragobj.xy[2] + "px";
                dragobj.otemp.style.zIndex = 1009;
                document.body.appendChild(dragobj.otemp);
                return false
            }
        }
    });
    var dragobj = {}
    window.onerror = function () {
        return false
    }
    console.log(navigator.userAgent);
    function on_ini() {
        String.prototype.inc = function (s) {
            return this.indexOf(s) > -1 ? true : false
        }
        var agent = navigator.userAgent
        window.isOpr = agent.inc("Opera")
        window.isIE = agent.inc("IE") && !isOpr
        window.isMoz = agent.inc("Mozilla") && !isOpr && !isIE
        if (isMoz) {
            Event.prototype.__defineGetter__("x", function () {
                return this.clientX + 2
            })
            Event.prototype.__defineGetter__("y", function () {
                return this.clientY + 2
            })
        }
        basic_ini()
    }
    function basic_ini() {
        window.oDel = function (obj) {
            if (obj != null) {
                obj.parentNode.removeChild(obj)
            }
        }
    }
    document.onselectstart = function () {
        return false
    }
    window.onfocus = function () {
        document.onmouseup()
    }
    window.onblur = function () {
        document.onmouseup()
    }
    document.onmouseup = function (e) {
        e = e || event
        if (dragobj.otemp != null) {
            var editor =isTplPage? document.getElementById('mceu_47'):document.getElementById('mceu_47');
            var frame =isTplPage? document.getElementById('navContent_ifr'):document.getElementById('productDescriptionTemp_ifr');
            if (frame != null) {
                var b = inner(editor, e);
                if (b > 0) {
                    var tplStr=$("#tplStr").find("#"+dragobj.otemp.id.replace("drag","tpl")).html();
                    console.log(tplStr);
                    $(frame.contentWindow.document).find("#flag").after(tplStr);
                    $(frame.contentWindow.document).find("#flag").remove();
                }
            }
            oDel(dragobj.otemp)
            dragobj = {}
        }
    }
    document.onmousemove = function (e) {
        e = e || event
        if (dragobj.otemp != null) {
            dragobj.otemp.style.left = (e.x - dragobj.xx[0] + 20) + "px"
            dragobj.otemp.style.top = (e.y - dragobj.xx[1] + 10+document.body.scrollTop) + "px"
            createtmpl(e)
        }
    }
    function getxy(e) {
        var a = []
        var t = e.offsetTop - e.parentNode.parentNode.scrollTop;
        var l = e.offsetLeft;
        var w = e.offsetWidth;
        var h = e.offsetHeight;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        a[0] = t;
        a[1] = l;
        a[2] = w;
        a[3] = h
        return a;
    }
    function inner(o, e) {
        var a = getxy(o)
        if (e.x > a[1] && e.x < (a[1] + a[2]) && (e.y+document.body.scrollTop) > a[0] && (e.y+document.body.scrollTop) < (a[0] + a[3])) {
            if ((e.y+document.body.scrollTop) < (a[0] + a[3] / 2))
                return 1;
            else
                return 2;
        } else
            return 0;
    }
    function createtmpl(e) {

        var editor = document.getElementById('mceu_47');
        var frame =isTplPage? document.getElementById('navContent_ifr'):document.getElementById('productDescriptionTemp_ifr');
        if (frame == null) {
            return;
        }
        $(frame.contentWindow.document).find("#flag").remove();
        var b = inner(editor, e);
        var xy = getxy(editor);
        console.log("editor top",xy[0]);
        console.log("e.y",e.y+document.body.scrollTop);
        if (b == 0) {
            return
        }
        else {
            var editorContent = $(frame.contentWindow.document).find("#tinymce").children();
            console.log(editorContent.length);
            if (editorContent.length ==0||(editorContent.length == 1&&editorContent[0].tagName=="P")) {
                $(frame.contentWindow.document).find("#tinymce").empty();
                $(frame.contentWindow.document).find("#tinymce").append('<div id="flag" style="height: 10px; background-color: #00bb9c;"></div>')
                return
            }
            else {
                $.each(editorContent, function (index) {
                    console.log(this.tagName+index,this.offsetTop + xy[0])
                    if ((e.y+document.body.scrollTop) > (this.offsetTop + xy[0]-frame.contentWindow.document.body.scrollTop) && (e.y+document.body.scrollTop) < (this.offsetTop + xy[0] + this.offsetHeight-frame.contentWindow.document.body.scrollTop)) {
                        if ((e.y+document.body.scrollTop) < (xy[0] + this.offsetHeight / 2)) {
                            $(this).before('<div id="flag" style="height: 10px; background-color: #00bb9c;"></div>');
                            return false;
                        }
                        else {
                            $(this).after('<div id="flag" style="height: 10px; background-color: #00bb9c;"></div>')
                            return false;
                        }
                    } else
                        return true;
                })
            }

        }
    }
    
});