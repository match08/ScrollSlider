!function(t){var i={};function s(e){if(i[e])return i[e].exports;var a=i[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,s),a.l=!0,a.exports}s.m=t,s.c=i,s.d=function(t,i,e){s.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:e})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,i){if(1&i&&(t=s(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(s.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var a in t)s.d(e,a,function(i){return t[i]}.bind(null,a));return e},s.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(i,"a",i),i},s.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},s.p="",s(s.s=2)}([function(t,i){t.exports=jquery},function(t,i){t.exports=jquery.easing},function(t,i,s){"use strict";s.r(i);let e=s(0);s(1);class a{constructor(t,i,s){if(this.pluginName="slideBars",this.className="SlideBars",this.namespace="slideBars",this.abs=Math.abs,this.sqrt=Math.sqrt,this.pow=Math.pow,this.round=Math.round,this.max=Math.max,this.min=Math.min,window.cancelAnimationFrame=window.cancelAnimationFrame||window.cancelRequestAnimationFrame,window.requestAnimationFrame=window.requestAnimationFrame,this.$doc=e(document),this.dragInitEvents="touchstart."+this.namespace+" mousedown."+this.namespace,this.dragMouseEvents="mousemove."+this.namespace+" mouseup."+this.namespace,this.dragTouchEvents="touchmove."+this.namespace+" touchend."+this.namespace,this.wheelEvent=(document.implementation.hasFeature("Event.wheel","3.0")?"wheel.":"mousewheel.")+this.namespace,this.clickEvent="click."+this.namespace,this.mouseDownEvent="mousedown."+this.namespace,this.interactiveElements=["INPUT","SELECT","BUTTON","TEXTAREA"],this.tmpArray=[],this.abs=Math.abs,this.sqrt=Math.sqrt,this.pow=Math.pow,this.round=Math.round,this.max=Math.max,this.min=Math.min,this.lastGlobalWheel=0,this.$doc.on(this.wheelEvent,t=>{let i=t.originalEvent[this.namespace],s=+new Date;(!i||i.options.scrollHijack<s-this.lastGlobalWheel)&&(this.lastGlobalWheel=s)}),this.callbackMap=s,this.defaults={slidee:null,horizontal:!1,itemNav:null,itemSelector:null,smart:!1,activateOn:null,activateMiddle:!1,scrollSource:null,scrollBy:0,scrollHijack:300,scrollTrap:!1,dragSource:null,mouseDragging:!1,touchDragging:!1,releaseSwing:!1,swingSpeed:.2,elasticBounds:!1,dragThreshold:3,interactive:null,scrollBar:null,dragHandle:!1,dynamicHandle:!1,minHandleSize:50,clickBar:!1,syncSpeed:.5,pagesBar:null,activatePageOn:null,pageBuilder:function(t){return"<li>"+(t+1)+"</li>"},forward:null,backward:null,prev:null,next:null,prevPage:null,nextPage:null,cycleBy:null,cycleInterval:5e3,pauseOnHover:!1,startPaused:!1,moveBy:300,speed:0,easing:"swing",startAt:null,keyboardNavBy:null,draggedClass:"dragged",activeClass:"active",disabledClass:"disabled"},this.o=e.extend({},this.defaults,i),!(t instanceof HTMLElement))throw new Error("Must HTMLElement type !");this.mutationObserver(t,()=>{this.create(t)})}create(t){this.parallax=this.isNumber(t),this.$frame=e(t),this.$slidee=this.o.slidee?e(this.o.slidee).eq(0):this.$frame.children().eq(0),this.frameSize=0,this.slideeSize=0,this.pos={start:0,center:0,end:0,cur:0,dest:0},this.$sb=e(this.o.scrollBar).eq(0),this.$handle=this.$sb.children().eq(0),this.sbSize=0,this.handleSize=0,this.hPos={start:0,end:0,cur:0},this.$pb=e(this.o.pagesBar),this.$pages=0,this.pages=[],this.$items=0,this.items=[],this.rel={firstItem:0,lastItem:0,centerItem:0,activeItem:null,activePage:0},this.frameStyles=new h(this.$frame[0]),this.slideeStyles=new h(this.$slidee[0]),this.sbStyles=new h(this.$sb[0]),this.handleStyles=new h(this.$handle[0]),this.basicNav="basic"===this.o.itemNav,this.forceCenteredNav="forceCentered"===this.o.itemNav,this.centeredNav="centered"===this.o.itemNav||this.forceCenteredNav,this.itemNav=!this.parallax&&(this.basicNav||this.centeredNav||this.forceCenteredNav),this.$scrollSource=this.o.scrollSource?e(this.o.scrollSource):this.$frame,this.$dragSource=this.o.dragSource?e(this.o.dragSource):this.$frame,this.$forwardButton=e(this.o.forward),this.$backwardButton=e(this.o.backward),this.$prevButton=e(this.o.prev),this.$nextButton=e(this.o.next),this.$prevPageButton=e(this.o.prevPage),this.$nextPageButton=e(this.o.nextPage),this.callbacks={},this.last={},this.animation={},this.move={},this.dragging={released:1,init:void 0},this.scrolling={last:0,delta:0,resetTime:200},this.renderID=0,this.historyID=0,this.cycleID=0,this.continuousID=0,this.i=0,this.l=0,this.parallax||(t=this.$frame[0]),this.initialized=0,this.frame=t,this.slidee=this.$slidee[0],this.pos=this.pos,this.rel=this.rel,this.pages=this.pages,this.isPaused=0,this.options=this.o,this.polyfill(),this.featureDetects(),this.init()}createJqueryProxy(){e.fn[this.pluginName]=function(t,i){var s,h;return e.isPlainObject(t)||("string"!==a.type(t)&&!1!==t||(s=!1===t?"destroy":t,h=Array.prototype.slice.call(arguments,1)),t={}),this.each((e,r)=>{var n=a.getInstance(r,this.namespace);n||s?n&&s&&n[s]&&n[s].apply(n,h):n=new a(r,t,i).init()})}}polyfill(){window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(i){var s=(new Date).getTime(),e=Math.max(0,16-(s-t)),a=setTimeout(i,e);return t=s,a};var t=(new Date).getTime();var i=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;window.cancelAnimationFrame=t=>{i.call(window,t)}}featureDetects(){var t=["","Webkit","Moz","ms","O"],i=document.createElement("div");function s(s){for(var e=0,a=t.length;e<a;e++){var h=t[e]?t[e]+s.charAt(0).toUpperCase()+s.slice(1):s;if(null!=i.style[h])return h}}this.transform=s("transform"),this.gpuAcceleration=s("perspective")?"translateZ(0) ":"",window[this.className]=a}mutationObserver(t,i){var s=new MutationObserver((t,e)=>{for(var a of t)if(a.target.clientWidth>0){s.disconnect(),e.disconnect(),i();break}});t&&s.observe(t,{attributes:!0,childList:!0,subtree:!0})}load(t=!1){var i=this.pages.length;if(this.pos.old=e.extend({},this.pos),this.frameSize=this.parallax?0:this.$frame[this.o.horizontal?"width":"height"](),this.sbSize=this.$sb[this.o.horizontal?"width":"height"](),this.slideeSize=this.parallax?this.frame:this.$slidee[this.o.horizontal?"outerWidth":"outerHeight"](),this.pages.length=0,this.pos.start=0,this.pos.end=this.max(this.slideeSize-this.frameSize,0),this.itemNav){this.items.length,this.$items=this.$slidee.children(this.o.itemSelector),this.items.length=0;let t,i=this.getPx(this.$slidee,this.o.horizontal?"paddingLeft":"paddingTop"),s=this.getPx(this.$slidee,this.o.horizontal?"paddingRight":"paddingBottom"),a="border-box"===e(this.$items).css("boxSizing"),h="none"!==this.$items.css("float"),r=0,n=this.$items.length-1;this.slideeSize=0,this.$items.each((a,o)=>{let l=e(o),d=o.getBoundingClientRect(),g=this.round(this.o.horizontal?d.width||d.right-d.left:d.height||d.bottom-d.top),c=this.getPx(l,this.o.horizontal?"marginLeft":"marginTop"),m=this.getPx(l,this.o.horizontal?"marginRight":"marginBottom"),p=g+c+m,u=!c||!m,v={};v.el=o,v.size=u?g:p,v.half=v.size/2,v.start=this.slideeSize+(u?c:0),v.center=v.start-this.round(this.frameSize/2-v.size/2),v.end=v.start-this.frameSize+v.size,a||(this.slideeSize+=i),this.slideeSize+=p,this.o.horizontal||h||m&&c&&a>0&&(this.slideeSize-=this.min(c,m)),a===n&&(v.end+=s,this.slideeSize+=s,r=u?m:0),this.items.push(v),t=v}),this.$slidee[0].style[this.o.horizontal?"width":"height"]=(a?this.slideeSize:this.slideeSize-i-s)+"px",this.slideeSize-=r,this.items.length?(this.pos.start=this.items[0][this.forceCenteredNav?"center":"start"],this.pos.end=this.forceCenteredNav?t.center:this.frameSize<this.slideeSize?t.end:this.pos.start):this.pos.start=this.pos.end=0}if(this.pos.center=this.round(this.pos.end/2+this.pos.start/2),this.updateRelatives(),this.$handle.length&&this.sbSize>0&&(this.o.dynamicHandle?(this.handleSize=this.pos.start===this.pos.end?this.sbSize:this.round(this.sbSize*this.frameSize/this.slideeSize),this.handleSize=this.within(this.handleSize,this.o.minHandleSize,this.sbSize),this.$handle[0].style[this.o.horizontal?"width":"height"]=this.handleSize+"px"):this.handleSize=this.$handle[this.o.horizontal?"outerWidth":"outerHeight"](),this.hPos.end=this.sbSize-this.handleSize,this.renderID||this.syncScrollbar()),!this.parallax&&this.frameSize>0){var s=this.pos.start,a="";if(this.itemNav)e.each(this.items,(t,i)=>{this.forceCenteredNav?this.pages.push(i.center):i.start+i.size>s&&s<=this.pos.end&&(s=i.start,this.pages.push(s),(s+=this.frameSize)>this.pos.end&&s<this.pos.end+this.frameSize&&this.pages.push(this.pos.end))});else for(;s-this.frameSize<this.pos.end;)this.pages.push(s),s+=this.frameSize;if(this.$pb[0]&&i!==this.pages.length){for(var h=0;h<this.pages.length;h++)a+=this.o.pageBuilder.call(this,h);this.$pages=this.$pb.html(a).children(),this.$pages.eq(this.rel.activePage).addClass(this.o.activeClass)}}if(this.rel.slideeSize=this.slideeSize,this.rel.frameSize=this.frameSize,this.rel.sbSize=this.sbSize,this.rel.handleSize=this.handleSize,this.itemNav){t&&null!=this.o.startAt&&(this._activate(this.o.startAt),this.centeredNav?this.toCenter(this.o.startAt):this.toStart(this.o.startAt));var r=this.items[this.rel.activeItem];this._slideTo(this.centeredNav&&r?r.center:this.within(this.pos.dest,this.pos.start,this.pos.end))}else t?null!=this.o.startAt&&this.slideTo(this.o.startAt,!0):this._slideTo(this.within(this.pos.dest,this.pos.start,this.pos.end));this.trigger("load")}reload(){this.load()}_slideTo(t,i=!1,s=!1){if(this.itemNav&&this.dragging.released&&!s){var e=this.getRelatives(t),a=t>this.pos.start&&t<this.pos.end;this.centeredNav?(a&&(t=this.items[e.centerItem].center),this.forceCenteredNav&&this.o.activateMiddle&&this._activate(e.centerItem)):a&&(t=this.items[e.firstItem].start)}this.dragging.init&&this.dragging.slidee&&this.o.elasticBounds?t>this.pos.end?t=this.pos.end+(t-this.pos.end)/6:t<this.pos.start&&(t=this.pos.start+(t-this.pos.start)/6):t=this.within(t,this.pos.start,this.pos.end),this.animation.start=+new Date,this.animation.time=0,this.animation.from=this.pos.cur,this.animation.to=t,this.animation.delta=t-this.pos.cur,this.animation.tweesing=this.dragging.tweese||this.dragging.init&&!this.dragging.slidee,this.animation.immediate=!this.animation.tweesing&&(i||this.dragging.init&&this.dragging.slidee||!this.o.speed),this.dragging.tweese=0,t!==this.pos.dest&&(this.pos.dest=t,this.trigger("change"),this.renderID||this.render()),this.resetCycle(),this.updateRelatives(),this.updateButtonsState(),this.syncPagesbar()}render(){if(this.initialized){if(!this.renderID)return this.renderID=requestAnimationFrame(this.render.bind(this)),void(this.dragging.released&&this.trigger("moveStart"));this.animation.immediate?this.pos.cur=this.animation.to:this.animation.tweesing?(this.animation.tweeseDelta=this.animation.to-this.pos.cur,this.abs(this.animation.tweeseDelta)<.1?this.pos.cur=this.animation.to:this.pos.cur+=this.animation.tweeseDelta*(this.dragging.released?this.o.swingSpeed:this.o.syncSpeed)):(this.animation.time=this.min(+new Date-this.animation.start,this.o.speed),this.pos.cur=this.animation.from+this.animation.delta*e.easing[this.o.easing](this.animation.time/this.o.speed,this.animation.time,0,1,this.o.speed)),this.animation.to===this.pos.cur?(this.pos.cur=this.animation.to,this.dragging.tweese=this.renderID=0):this.renderID=requestAnimationFrame(this.render.bind(this)),this.trigger("move"),this.parallax||(this.transform?this.$slidee[0].style[this.transform]=this.gpuAcceleration+(this.o.horizontal?"translateX":"translateY")+"("+-this.pos.cur+"px)":this.$slidee[0].style[this.o.horizontal?"left":"top"]=-this.round(this.pos.cur)+"px"),!this.renderID&&this.dragging.released&&this.trigger("moveEnd"),this.syncScrollbar()}}syncScrollbar(){this.$handle.length&&(this.hPos.cur=this.pos.start===this.pos.end?0:((this.dragging.init&&!this.dragging.slidee?this.pos.dest:this.pos.cur)-this.pos.start)/(this.pos.end-this.pos.start)*this.hPos.end,this.hPos.cur=this.within(this.round(this.hPos.cur),this.hPos.start,this.hPos.end),this.last.hPos!==this.hPos.cur&&(this.last.hPos=this.hPos.cur,this.transform?this.$handle[0].style[this.transform]=this.gpuAcceleration+(this.o.horizontal?"translateX":"translateY")+"("+this.hPos.cur+"px)":this.$handle[0].style[this.o.horizontal?"left":"top"]=this.hPos.cur+"px"))}syncPagesbar(){this.$pages[0]&&this.last.page!==this.rel.activePage&&(this.last.page=this.rel.activePage,this.$pages.removeClass(this.o.activeClass).eq(this.rel.activePage).addClass(this.o.activeClass),this.trigger("activePage",this.last.page))}getPos(t){if(this.itemNav){let i=this.getIndex(t);return-1!==i&&this.items[i]}var i=this.$slidee.find(t).eq(0);if(i[0]){var s=this.o.horizontal?i.offset().left-this.$slidee.offset().left:i.offset().top-this.$slidee.offset().top,e=i[this.o.horizontal?"outerWidth":"outerHeight"]();return{start:s,center:s-this.frameSize/2+e/2,end:s-this.frameSize+e,size:e}}return!1}moveBy(t){this.move.speed=t,!this.dragging.init&&this.move.speed&&this.pos.cur!==(this.move.speed>0?this.pos.end:this.pos.start)&&(this.move.lastTime=+new Date,this.move.startPos=this.pos.cur,this.continuousInit("button"),this.dragging.init=1,this.trigger("moveStart"),cancelAnimationFrame(this.continuousID.bind(this)),this.moveLoop())}moveLoop(){this.move.speed&&this.pos.cur!==(this.move.speed>0?this.pos.end:this.pos.start)||this.stop(),this.continuousID=this.dragging.init?requestAnimationFrame(this.moveLoop.bind(this)):0,this.move.now=+new Date,this.move.pos=this.pos.cur+(this.move.now-this.move.lastTime)/1e3*this.move.speed,this.slideTo(this.dragging.init?this.move.pos:this.round(this.move.pos)),this.dragging.init||this.pos.cur!==this.pos.dest||this.trigger("moveEnd"),this.move.lastTime=this.move.now}stop(){"button"===this.dragging.source&&(this.dragging.init=0,this.dragging.released=1)}prev(){this.activate(null==this.rel.activeItem?0:this.rel.activeItem-1)}next(){this.activate(null==this.rel.activeItem?0:this.rel.activeItem+1)}prevPage(){this.activatePage(this.rel.activePage-1)}nextPage(){this.activatePage(this.rel.activePage+1)}slideBy(t,i=!1){t&&(this.itemNav?(this.centeredNav?this.toCenter:this.toStart)(this.within((this.centeredNav?this.rel.centerItem:this.rel.firstItem)+this.o.scrollBy*t,0,this.items.length)):this.slideTo(this.pos.dest+t,i))}slideTo(t,i=!1){this._slideTo(t,i)}to(t,i,s){if("boolean"===a.type(i)&&(s=i,i=void 0),void 0===i)this._slideTo(this.pos[t],s);else{if(this.centeredNav&&"center"!==t)return;var e=this.getPos(i);e&&this._slideTo(e[t],s,!this.centeredNav)}}toStart(t,i=!1){this.to("start",t,i)}toEnd(t,i){this.to("end",t,i)}toCenter(t,i=!1){this.to("center",t,i)}getIndex(t){return null!=t?this.isNumber(t)?t>=0&&t<this.items.length?t:-1:this.$items.index(t):-1}getRelativeIndex(t){return this.getIndex(this.isNumber(t)&&t<0?t+this.items.length:t)}_activate(t,i){var s=this.getIndex(t);return!(!this.itemNav||s<0)&&((this.last.active!==s||i)&&(this.$items.eq(this.rel.activeItem).removeClass(this.o.activeClass),this.$items.eq(s).addClass(this.o.activeClass),this.last.active=this.rel.activeItem=s,this.updateButtonsState(),this.trigger("active",s)),s)}activate(t,i=!1){var s=this._activate(t);this.o.smart&&!1!==s&&(this.centeredNav?this.toCenter(s,i):s>=this.rel.lastItem?this.toStart(s,i):s<=this.rel.firstItem?this.toEnd(s,i):this.resetCycle())}activatePage(t,i=!1){this.isNumber(t)&&this.slideTo(this.pages[this.within(t,0,this.pages.length-1)],i)}getRelatives(t){t=this.within(this.isNumber(t)?t:this.pos.dest,this.pos.start,this.pos.end);let i={},s=this.forceCenteredNav?0:this.frameSize/2;if(!this.parallax)for(let e=0,a=this.pages.length;e<a;e++){if(t>=this.pos.end||e===this.pages.length-1){i.activePage=this.pages.length-1;break}if(t<=this.pages[e]+s){i.activePage=e;break}}if(this.itemNav){let s=!1,e=!1,a=!1;for(let i=0,h=this.items.length;i<h;i++)if(!1===s&&t<=this.items[i].start+this.items[i].half&&(s=i),!1===a&&t<=this.items[i].center+this.items[i].half&&(a=i),i===h-1||t<=this.items[i].end+this.items[i].half){e=i;break}i.firstItem=this.isNumber(s)?s:0,i.centerItem=this.isNumber(a)?a:i.firstItem,i.lastItem=this.isNumber(e)?e:i.centerItem}return i}updateRelatives(t){e.extend(this.rel,this.getRelatives(t))}updateButtonsState(){var t=this.pos.dest<=this.pos.start,i=this.pos.dest>=this.pos.end,s=(t?1:0)|(i?2:0);if(this.last.slideePosState!==s&&(this.last.slideePosState=s,this.$prevPageButton.is("button,input")&&this.$prevPageButton.prop("disabled",t),this.$nextPageButton.is("button,input")&&this.$nextPageButton.prop("disabled",i),this.$prevPageButton.add(this.$backwardButton)[t?"addClass":"removeClass"](this.o.disabledClass),this.$nextPageButton.add(this.$forwardButton)[i?"addClass":"removeClass"](this.o.disabledClass)),this.last.fwdbwdState!==s&&this.dragging.released&&(this.last.fwdbwdState=s,this.$backwardButton.is("button,input")&&this.$backwardButton.prop("disabled",t),this.$forwardButton.is("button,input")&&this.$forwardButton.prop("disabled",i)),this.itemNav&&null!=this.rel.activeItem){var e=0===this.rel.activeItem,a=this.rel.activeItem>=this.items.length-1,h=(e?1:0)|(a?2:0);this.last.itemsButtonState!==h&&(this.last.itemsButtonState=h,this.$prevButton.is("button,input")&&this.$prevButton.prop("disabled",e),this.$nextButton.is("button,input")&&this.$nextButton.prop("disabled",a),this.$prevButton[e?"addClass":"removeClass"](this.o.disabledClass),this.$nextButton[a?"addClass":"removeClass"](this.o.disabledClass))}}resume(t=-1){this.o.cycleBy&&this.o.cycleInterval&&("items"!==this.o.cycleBy||this.items[0]&&null!=this.rel.activeItem)&&!(t<this.isPaused)&&(this.isPaused=0,this.cycleID?this.cycleID=clearTimeout(this.cycleID):this.trigger("resume"),this.cycleID=setTimeout(()=>{switch(this.trigger("cycle"),this.o.cycleBy){case"items":this.activate(this.rel.activeItem>=this.items.length-1?0:this.rel.activeItem+1);break;case"pages":this.activatePage(this.rel.activePage>=this.pages.length-1?0:this.rel.activePage+1)}},this.o.cycleInterval))}pause(t=-1){t<this.isPaused||(this.isPaused=t||100,this.cycleID&&(this.cycleID=clearTimeout(this.cycleID),this.trigger("pause")))}toggle(){this.cycleID?this.pause():this.resume()}set(t,i){e.isPlainObject(t)?e.extend(this.o,t):this.o.hasOwnProperty(t)&&(this.o[t]=i)}add(t,i){var s=e(t);this.itemNav?(null==i||!this.items[0]||i>=this.items.length?s.appendTo(this.$slidee):this.items.length&&s.insertBefore(this.items[i].el),null!=this.rel.activeItem&&i<=this.rel.activeItem&&(this.last.active=this.rel.activeItem+=s.length)):this.$slidee.append(s),this.load()}remove(t){if(this.itemNav){var i=this.getRelativeIndex(t);if(i>-1){this.$items.eq(i).remove();var s=i===this.rel.activeItem;null!=this.rel.activeItem&&i<this.rel.activeItem&&(this.last.active=--this.rel.activeItem),this.load(),s&&(this.last.active=null,this.activate(this.rel.activeItem))}}else e(t).remove(),this.load()}moveItem(t,i,s=!1){if(t=this.getRelativeIndex(t),i=this.getRelativeIndex(i),t>-1&&i>-1&&t!==i&&(!s||i!==t-1)&&(s||i!==t+1)){this.$items.eq(t)[s?"insertAfter":"insertBefore"](this.items[i].el);var e=t<i?t:s?i:i-1,a=t>i?t:s?i+1:i,h=t>i;null!=this.rel.activeItem&&(t===this.rel.activeItem?this.last.active=this.rel.activeItem=s?h?i+1:i:h?i:i-1:this.rel.activeItem>e&&this.rel.activeItem<a&&(this.last.active=this.rel.activeItem+=h?1:-1)),this.load()}}moveAfter(t,i){this.moveItem(t,i,!0)}moveBefore(t,i){this.moveItem(t,i)}on(t,i){if("object"===a.type(t))for(var s in t)t.hasOwnProperty(s)&&this.on(s,t[s]);else if("function"===a.type(i))for(var e=t.split(" "),h=0,r=e.length;h<r;h++)this.callbacks[e[h]]=this.callbacks[e[h]]||[],-1===this.callbackIndex(e[h],i)&&this.callbacks[e[h]].push(i);else if("array"===a.type(i))for(var n=0,o=i.length;n<o;n++)this.on(t,i[n])}one(t,i){var s=this;this.on(t,(function e(){i.apply(s,arguments),s.off(t,e)}))}off(t,i){if(i instanceof Array)for(var s=0,e=i.length;s<e;s++)this.off(t,i[s]);else for(var a=t.split(" "),h=0,r=a.length;h<r;h++)if(this.callbacks[a[h]]=this.callbacks[a[h]]||[],null==i)this.callbacks[a[h]].length=0;else{var n=this.callbackIndex(a[h],i);-1!==n&&this.callbacks[a[h]].splice(n,1)}}callbackIndex(t,i){for(var s=0,e=this.callbacks[t].length;s<e;s++)if(this.callbacks[t][s]===i)return s;return-1}resetCycle(){this.dragging.released&&!this.isPaused&&this.resume()}handleToSlidee(t){return this.round(this.within(t,this.hPos.start,this.hPos.end)/this.hPos.end*(this.pos.end-this.pos.start))+this.pos.start}draggingHistoryTick(){this.dragging.history[0]=this.dragging.history[1],this.dragging.history[1]=this.dragging.history[2],this.dragging.history[2]=this.dragging.history[3],this.dragging.history[3]=this.dragging.delta}continuousInit(t){this.dragging.released=0,this.dragging.source=t,this.dragging.slidee="slidee"===t}dragInit(t){var i="touchstart"===t.type,s=t.data.source,a="slidee"===s;this.dragging.init||!i&&this.isInteractive(t.target)||("handle"!==s||this.o.dragHandle&&this.hPos.start!==this.hPos.end)&&(a&&!(i?this.o.touchDragging:this.o.mouseDragging&&t.which<2)||(i||this.stopDefault(t),this.continuousInit(s),this.dragging.init=0,this.dragging.$source=e(t.target),this.dragging.touch=i,this.dragging.pointer=i?t.originalEvent.touches[0]:t,this.dragging.initX=this.dragging.pointer.pageX,this.dragging.initY=this.dragging.pointer.pageY,this.dragging.initPos=a?this.pos.cur:this.hPos.cur,this.dragging.start=+new Date,this.dragging.time=0,this.dragging.path=0,this.dragging.delta=0,this.dragging.locked=0,this.dragging.history=[0,0,0,0],this.dragging.pathToLock=a?i?30:10:0,this.$doc.on(i?this.dragTouchEvents:this.dragMouseEvents,this.dragHandler.bind(this)),this.pause(1),(a?this.$slidee:this.$handle).addClass(this.o.draggedClass),this.trigger("moveStart"),a&&(this.historyID=setInterval(this.draggingHistoryTick.bind(this),10))))}dragHandler(t){if(this.dragging.released="mouseup"===t.type||"touchend"===t.type,this.dragging.pointer=this.dragging.touch?t.originalEvent[this.dragging.released?"changedTouches":"touches"][0]:t,this.dragging.pathX=this.dragging.pointer.pageX-this.dragging.initX,this.dragging.pathY=this.dragging.pointer.pageY-this.dragging.initY,this.dragging.path=this.sqrt(this.pow(this.dragging.pathX,2)+this.pow(this.dragging.pathY,2)),this.dragging.delta=this.o.horizontal?this.dragging.pathX:this.dragging.pathY,this.dragging.released||!(this.dragging.path<1)){if(!this.dragging.init){if(this.dragging.path<this.o.dragThreshold)return this.dragging.released?this.dragEnd():void 0;if(!(this.o.horizontal?this.abs(this.dragging.pathX)>this.abs(this.dragging.pathY):this.abs(this.dragging.pathX)<this.abs(this.dragging.pathY)))return this.dragEnd();this.dragging.init=1}this.stopDefault(t),!this.dragging.locked&&this.dragging.path>this.dragging.pathToLock&&this.dragging.slidee&&(this.dragging.locked=1,this.dragging.$source.on(this.clickEvent,this.disableOneEvent)),this.dragging.released&&(this.dragEnd(),this.o.releaseSwing&&this.dragging.slidee&&(this.dragging.swing=(this.dragging.delta-this.dragging.history[0])/40*300,this.dragging.delta+=this.dragging.swing,this.dragging.tweese=this.abs(this.dragging.swing)>10)),this._slideTo(this.dragging.slidee?this.round(this.dragging.initPos-this.dragging.delta):this.handleToSlidee(this.dragging.initPos+this.dragging.delta))}}dragEnd(){clearInterval(this.historyID),this.dragging.released=!0,this.$doc.off(this.dragging.touch?this.dragTouchEvents:this.dragMouseEvents,this.dragHandler.bind(this)),(this.dragging.slidee?this.$slidee:this.$handle).removeClass(this.o.draggedClass),setTimeout(()=>{this.dragging.$source.off(this.clickEvent,this.disableOneEvent)}),this.pos.cur===this.pos.dest&&this.dragging.init&&this.trigger("moveEnd"),this.resume(1),this.dragging.init=0}isInteractive(t){return~e.inArray(t.nodeName,this.interactiveElements)||e(t).is(this.o.interactive)}movementReleaseHandler(){this.stop(),this.$doc.off("mouseup",this.movementReleaseHandler)}buttonsHandler(t){switch(this.stopDefault(t),this){case this.$forwardButton[0]:case this.$backwardButton[0]:this.moveBy(this.$forwardButton.is(this)?this.o.moveBy:-this.o.moveBy),this.$doc.on("mouseup",this.movementReleaseHandler);break;case this.$prevButton[0]:this.prev();break;case this.$nextButton[0]:this.next();break;case this.$prevPageButton[0]:this.prevPage();break;case this.$nextPageButton[0]:this.nextPage()}}normalizeWheelDelta(t){return this.scrolling.curDelta=(this.o.horizontal?t.deltaY||t.deltaX:t.deltaY)||-t.wheelDelta,this.scrolling.curDelta/=1===t.deltaMode?3:100,this.itemNav?(this.time=+new Date,this.scrolling.last<this.time-this.scrolling.resetTime&&(this.scrolling.delta=0),this.scrolling.last=this.time,this.scrolling.delta+=this.scrolling.curDelta,this.abs(this.scrolling.delta)<1?this.scrolling.finalDelta=0:(this.scrolling.finalDelta=this.round(this.scrolling.delta/1),this.scrolling.delta%=1),this.scrolling.finalDelta):this.scrolling.curDelta}scrollHandler(t){console.log("scrollHandler",t),t.originalEvent[this.namespace]=this;var i=+new Date;if(this.lastGlobalWheel+this.o.scrollHijack>i&&this.$scrollSource[0]!==document&&this.$scrollSource[0]!==window)this.lastGlobalWheel=i;else if(this.o.scrollBy&&this.pos.start!==this.pos.end){var s=this.normalizeWheelDelta(t.originalEvent);(this.o.scrollTrap||s>0&&this.pos.dest<this.pos.end||s<0&&this.pos.dest>this.pos.start)&&this.stopDefault(t,!0),this.slideBy(this.o.scrollBy*s)}}scrollbarHandler(t){console.log("scrollbarHandler",t),this.o.clickBar&&t.target===this.$sb[0]&&(this.stopDefault(t),this.slideTo(this.handleToSlidee((this.o.horizontal?t.pageX-this.$sb.offset().left:t.pageY-this.$sb.offset().top)-this.handleSize/2)))}keyboardHandler(t){if(this.o.keyboardNavBy)switch(t.which){case this.o.horizontal?37:38:this.stopDefault(t),this["pages"===this.o.keyboardNavBy?"prevPage":"prev"]();break;case this.o.horizontal?39:40:this.stopDefault(t),this["pages"===this.o.keyboardNavBy?"nextPage":"next"]()}}activateHandler(t){let i=t.currentTarget;this.isInteractive(i)?t.originalEvent[this.namespace+"ignore"]=!0:i.parentNode!==this.$slidee[0]||t.originalEvent[this.namespace+"ignore"]||this.activate(i)}activatePageHandler(){this.parentNode===this.$pb[0]&&this.activatePage(this.$pages.index(this))}pauseOnHoverHandler(t){this.o.pauseOnHover&&this["mouseenter"===t.type?"pause":"resume"](2)}trigger(t,i){if(this.callbacks[t]){for(this.l=this.callbacks[t].length,this.tmpArray.length=0,this.i=0;this.i<this.l;this.i++)this.tmpArray.push(this.callbacks[t][this.i]);for(this.i=0;this.i<this.l;this.i++)this.tmpArray[this.i].call(this,t,i)}}destroy(){return a.removeInstance(this.frame,this.namespace),this.$scrollSource.add(this.$handle).add(this.$sb).add(this.$pb).add(this.$forwardButton).add(this.$backwardButton).add(this.$prevButton).add(this.$nextButton).add(this.$prevPageButton).add(this.$nextPageButton).off("."+this.namespace),this.$doc.off("keydown",this.keyboardHandler),this.$prevButton.add(this.$nextButton).add(this.$prevPageButton).add(this.$nextPageButton).removeClass(this.o.disabledClass),this.$items&&null!=this.rel.activeItem&&this.$items.eq(this.rel.activeItem).removeClass(this.o.activeClass),this.$pb.empty(),this.parallax||(this.$frame.off("."+this.namespace),this.frameStyles.restore(),this.slideeStyles.restore(),this.sbStyles.restore(),this.handleStyles.restore(),e.removeData(this.frame,this.namespace)),this.items.length=this.pages.length=0,this.last={},this.initialized=0,this}init(){if(this.initialized)return;if(a.getInstance(this.frame,this.namespace))throw new Error("There is already a Sly instance on this element");a.storeInstance(this.frame,this.namespace,this),this.on(this.callbackMap);let t=["overflow","position"],i=["position","webkitTransform","msTransform","transform","left","top","width","height"];this.frameStyles.save.apply(this.frameStyles,t),this.sbStyles.save.apply(this.sbStyles,t),this.slideeStyles.save.apply(this.slideeStyles,i),this.handleStyles.save.apply(this.handleStyles,i);var s=this.$handle;return this.parallax||(s=s.add(this.$slidee),this.$frame.css("overflow","hidden"),this.transform||"static"!==this.$frame.css("position")||this.$frame.css("position","relative")),this.transform?this.gpuAcceleration&&s.css(this.transform,this.gpuAcceleration):("static"===this.$sb.css("position")&&this.$sb.css("position","relative"),s.css({position:"absolute"})),this.o.forward&&this.$forwardButton.on(this.mouseDownEvent,this.buttonsHandler),this.o.backward&&this.$backwardButton.on(this.mouseDownEvent,this.buttonsHandler),this.o.prev&&this.$prevButton.on(this.clickEvent,this.buttonsHandler),this.o.next&&this.$nextButton.on(this.clickEvent,this.buttonsHandler),this.o.prevPage&&this.$prevPageButton.on(this.clickEvent,this.buttonsHandler),this.o.nextPage&&this.$nextPageButton.on(this.clickEvent,this.buttonsHandler),this.$scrollSource.on(this.wheelEvent,this.scrollHandler),this.$sb[0]&&this.$sb.on(this.clickEvent,this.scrollbarHandler),this.itemNav&&this.o.activateOn&&this.$frame.on(this.o.activateOn+"."+this.namespace,"*",this.activateHandler.bind(this)),this.$pb[0]&&this.o.activatePageOn&&this.$pb.on(this.o.activatePageOn+"."+this.namespace,"*",this.activatePageHandler.bind(this)),this.$dragSource.on(this.dragInitEvents,{source:"slidee"},this.dragInit.bind(this)),this.$handle&&this.$handle.on(this.dragInitEvents,{source:"handle"},this.dragInit.bind(this)),this.$doc.on("keydown",this.keyboardHandler.bind(this)),this.parallax||(this.$frame.on("mouseenter."+this.namespace+" mouseleave."+this.namespace,this.pauseOnHoverHandler.bind(this)),this.$frame.on("scroll."+this.namespace,this.resetScroll)),this.initialized=1,this.load(!0),this.o.cycleBy&&!this.parallax&&(this.o.startPaused?this.pause():this.resume()),this}static type(t){return null==t?String(t):"object"==typeof t||"function"==typeof t?(Object.prototype.toString.call(t).match(/\s([a-z]+)/i)||[])[1].toLowerCase()||"object":typeof t}stopDefault(t,i=!1){t.preventDefault(),i&&t.stopPropagation()}disableOneEvent(t){this.stopDefault(t,!0),e(this).off(t.type,this.disableOneEvent)}resetScroll(t){t.target.scrollLeft=0,t.target.scrollTop=0}isNumber(t){return!isNaN(parseFloat(t))&&isFinite(t)}getPx(t,i){return 0|this.round(parseFloat(String(t.css(i)).replace(/[^\-0-9.]/g,"")))}within(t,i,s){return t<i?i:t>s?s:t}static getInstance(t,i){return e.data(t,i)}static removeInstance(t,i){return e.removeData(t,i)}}a.storeInstance=function(t,i,s){return e.data(t,i,s)};class h{constructor(t){this.style={},this.element=t}save(...t){if(this.element&&this.element.nodeType){for(var i=0;i<t.length;i++){let s=t[i];this.style[s]=this.element.style[s]}return this}}restore(){if(this.element&&this.element.nodeType){for(var t in this.style)this.style.hasOwnProperty(t)&&(this.element.style[t]=this.style[t]);return this}}}s.d(i,"default",(function(){return r}));class r extends a{constructor(t,i={},s={}){super(t,Object.assign({horizontal:1,startAt:1,smart:!0,activateOn:"click",itemNav:"basic",dragContent:1,scrollBy:1,speed:300,easing:"easeOutExpo",touchDragging:1,clickButton:".button"},i),s)}}}]);