
var GUIDebugLayer = cc.LayerColor.extend(
{
    sprite:null,
    debug:null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();
		
		GUIDebugLayer.debug = this;

		// 设置背景颜色 灰色
		this.setColor(new cc.Color(128, 128, 128, 255));

        var size = cc.winSize;
        this.debug = new ccui.Text();
        this.debug.attr({
            string: "",
            fontName: "Arial",
            fontSize: 10,
            anchorX: 0.5,
            anchorY: -1,
            x: size.width / 2,
            y: size.height - 30
        });
        this.debug.setColor(new cc.Color(255, 0, 0, 255));
        this.addChild(this.debug, 20);
        return true;
    },

    onExit: function () {
    },

    INFO_MSG:function (str) {
    	this.debug.setString(str);
    	this.debug.setColor(new cc.Color(0, 255, 0, 255));
    },
    DEBUG_MSG:function (str) {
    	this.debug.setString(str);
    	this.debug.setColor(new cc.Color(0, 255, 0, 255));
    },
    ERROR_MSG:function (str) {
    	this.debug.setString(str);
    	this.debug.setColor(new cc.Color(255, 0, 0, 255));
    },
    WARNING_MSG:function (str) {
    	this.debug.setString(str);
    	this.debug.setColor(new cc.Color(255, 255, 0, 255));
    }
});

