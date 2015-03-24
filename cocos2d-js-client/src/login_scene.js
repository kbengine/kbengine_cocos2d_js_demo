
var LoginSceneLayer = cc.LayerColor.extend({
    sprite:null,
    clientScriptVersion:null,
    serverVersion:null,
    serverScriptVersion:null,
    clientVersion:null,
    debug:null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();
		
		// 设置背景颜色 灰色
		this.setColor(new cc.Color(128, 128, 128, 255));

        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        // debug
        this.debug = new DebugLayer();
        this.addChild(this.debug, 1);

        // serverVersion
        this.serverVersion = new ccui.Text();
        this.serverVersion.attr({
            string: "serverVersion: ",
            fontName: "Arial",
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontSize: 10,
            anchorX: 0.5,
            anchorY: -1,
            x: 60,
            y: size.height - 30
        });
        this.serverVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.serverVersion, 20);

        this.serverScriptVersion = new ccui.Text();
        this.serverScriptVersion.attr({
            string: "serverScriptVersion: ",
            fontName: "Arial",
            fontSize: 10,
            anchorX: 0.5,
            anchorY: -1,
            x: 60,
            y: size.height - 45
        });
        this.serverScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.serverScriptVersion, 2);

        this.clientVersion = new ccui.Text();
        this.clientVersion.attr({
            string: "clientVersion: " + g_kbengine.clientVersion,
            fontName: "Arial",
            fontSize: 10,
            anchorX: 0.5,
            anchorY: -1,
            x: 60,
            y: size.height - 60
        });
        this.clientVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientVersion, 2);

        this.clientScriptVersion = new ccui.Text();
        this.clientScriptVersion.attr({
            string: "clientScriptVersion: " + g_kbengine.clientScriptVersion,
            fontName: "Arial",
            fontSize: 10,
            anchorX: 0.5,
            anchorY: -1,
            x: 60,
            y: size.height - 75
        });
        this.clientScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientScriptVersion, 2);
        
		// 激活 update
        this.schedule(this.update, 0.1, cc.repeatForever, 0.1);
        return true;
    },
    
    update : function (dt) {
        this.serverScriptVersion.setString("serverScriptVersion: " + g_kbengine.serverScriptVersion);
        this.serverVersion.setString("serverVersion: " + g_kbengine.serverVersion);
    }
});

var UserNameLayer = cc.LayerColor.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        // 设置背景颜色 灰色
        //this.setColor(new cc.Color(128, 128, 128, 255));

        var size = cc.winSize;

        this.width = 150;
        this.height = 20;
        this.x = size.width / 2 - 50;
        this.y = size.height / 2 - 20;

        // 设置账号名密码编辑框
        // Create the textfield
        var textField = new ccui.TextField();
        textField.setMaxLengthEnabled(true);
        textField.setMaxLength(15);
        textField.setTouchEnabled(true);
        textField.fontName = "Arial";
        textField.fontSize = 15;
        textField.placeHolder = "input username";
        textField.x = this.width / 2;
        textField.y = this.height / 2;
        textField.addEventListener(this.textFieldEvent, this);
        this.addChild(textField, 1);

        return true;
    },

    textFieldEvent: function (sender, type) {
        var textField = sender;
        if(textField.placeHolder == "input username")
            textField.placeHolder = "|";

        //this._rootLayer.debug.WARNING_MSG(textField.getString());
    }
});


var PasswordLayer = cc.LayerColor.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        // 设置背景颜色 灰色
        //this.setColor(new cc.Color(128, 128, 128, 255));

        var size = cc.winSize;

        this.width = 150;
        this.height = 20;
        this.x = size.width / 2 - 50;
        this.y = size.height / 2 - 50;

        // 设置账号名密码编辑框
        // Create the textfield
        var textField = new ccui.TextField();
        textField.setMaxLengthEnabled(true);
        textField.setMaxLength(15);
        textField.setPasswordEnabled(true);
        textField.setPasswordStyleText("*");
        textField.setTouchEnabled(true);
        textField.fontName = "Arial";
        textField.fontSize = 15;
        textField.placeHolder = "input password";
        textField.x = this.width / 2;
        textField.y = this.height / 2;
        textField.addEventListener(this.textFieldEvent, this);
        this.addChild(textField, 1);

        return true;
    },

    textFieldEvent: function (sender, type) {
        var textField = sender;
        if(textField.placeHolder == "input password")
            textField.placeHolder = "|";

        //this._rootLayer.debug.ERROR_MSG(textField.getString());
    }
});

var LoginBtnLayer = cc.LayerColor.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        var size = cc.winSize;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;

        // Create the text button
        var textButton = new ccui.Button();
        textButton.setTouchEnabled(true);
        textButton.loadTextures("res/ui/backtotopnormal.png", "res/ui/backtotoppressed.png", "");
        textButton.setTitleText("Login");
        textButton.x = size.width / 2.0 - 30;
        textButton.y = size.height / 2.0 - 100;
        textButton.addTouchEventListener(this.touchEvent ,this);
        this.addChild(textButton, 1);

        return true;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this._rootLayer.debug.ERROR_MSG("connect to server...");
                g_kbengine.login("ssssss", "ffffff");
                break;
            case ccui.Widget.TOUCH_MOVED:
                this._rootLayer.debug.ERROR_MSG("Touch Move");
                break;
            case ccui.Widget.TOUCH_ENDED:
                this._rootLayer.debug.ERROR_MSG("Touch Up");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this._rootLayer.debug.ERROR_MSG("Touch Cancelled");
                break;
            default:
                break;
        }

        //this._rootLayer.debug.ERROR_MSG(textField.getString());
    }
});

var RegisterBtnLayer = cc.LayerColor.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        var size = cc.winSize;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;

        // Create the text button
        var textButton = new ccui.Button();
        textButton.setTouchEnabled(true);
        textButton.loadTextures("res/ui/backtotopnormal.png", "res/ui/backtotoppressed.png", "");
        textButton.setTitleText("Register");
        textButton.x = size.width / 2.0 + 80;
        textButton.y = size.height / 2.0 - 100;
        textButton.addTouchEventListener(this.touchEvent ,this);
        this.addChild(textButton, 1);

        return true;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this._rootLayer.debug.ERROR_MSG("Touch Down");
                break;
            case ccui.Widget.TOUCH_MOVED:
                this._rootLayer.debug.ERROR_MSG("Touch Move");
                break;
            case ccui.Widget.TOUCH_ENDED:
                this._rootLayer.debug.ERROR_MSG("Touch Up");
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this._rootLayer.debug.ERROR_MSG("Touch Cancelled");
                break;
            default:
                break;
        }

        //this._rootLayer.debug.ERROR_MSG(textField.getString());
    }
});

var LoginScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LoginSceneLayer();
        this.addChild(layer);

        var userNameLayer = new UserNameLayer(layer);
        this.addChild(userNameLayer, 1);
        
        var passwordLayer = new PasswordLayer(layer);
        this.addChild(passwordLayer, 1);

        var loginBtnLayer = new LoginBtnLayer(layer);
        this.addChild(loginBtnLayer, 1);

        var registerBtnLayer = new RegisterBtnLayer(layer);
        this.addChild(registerBtnLayer, 1);
    }
});

