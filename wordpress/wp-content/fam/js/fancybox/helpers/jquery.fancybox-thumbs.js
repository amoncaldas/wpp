(function (e) { var t = e.fancybox; t.helpers.thumbs = { defaults: { width: 50, height: 50, position: "bottom", source: function (t) { var n; if (t.element) { n = e(t.element).find("img").attr("src") } if (!n && t.type === "image" && t.href) { n = t.href } return n } }, wrap: null, list: null, width: 0, init: function (t, n) { var r = this, i, s = t.width, o = t.height, u = t.source; i = ""; for (var a = 0; a < n.group.length; a++) { i += '<li><a style="width:' + s + "px;height:" + o + 'px;" href="javascript:jQuery.fancybox.jumpto(' + a + ');"></a></li>' } this.wrap = e('<div id="fancybox-thumbs"></div>').addClass(t.position).appendTo("body"); this.list = e("<ul>" + i + "</ul>").appendTo(this.wrap); e.each(n.group, function (t) { var i = u(n.group[t]); if (!i) { return } e("<img />").load(function () { var n = this.width, i = this.height, u, a, f; if (!r.list || !n || !i) { return } u = n / s; a = i / o; f = r.list.children().eq(t).find("a"); if (u >= 1 && a >= 1) { if (u > a) { n = Math.floor(n / a); i = o } else { n = s; i = Math.floor(i / u) } } e(this).css({ width: n, height: i, top: Math.floor(o / 2 - i / 2), left: Math.floor(s / 2 - n / 2) }); f.width(s).height(o); e(this).hide().appendTo(f).fadeIn(300) }).attr("src", i) }); this.width = this.list.children().eq(0).outerWidth(true); this.list.width(this.width * (n.group.length + 1)).css("left", Math.floor(e(window).width() * .5 - (n.index * this.width + this.width * .5))) }, beforeLoad: function (e, t) { if (t.group.length < 2) { t.helpers.thumbs = false; return } t.margin[e.position === "top" ? 0 : 2] += e.height + 15 }, afterShow: function (e, t) { if (this.list) { this.onUpdate(e, t) } else { this.init(e, t) } this.list.children().removeClass("active").eq(t.index).addClass("active") }, onUpdate: function (t, n) { if (this.list) { this.list.stop(true).animate({ left: Math.floor(e(window).width() * .5 - (n.index * this.width + this.width * .5)) }, 150) } }, beforeClose: function () { if (this.wrap) { this.wrap.remove() } this.wrap = null; this.list = null; this.width = 0 } } })(jQuery)