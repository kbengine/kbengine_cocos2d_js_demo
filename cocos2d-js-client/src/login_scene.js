
var LoginSceneLayer = cc.LayerColor.extend({
    sprite:null,
    clientScriptVersion:null,
    serverVersion:null,
    serverScriptVersion:null,
    clientVersion:null,
    debug:null,
    username:"",
    password:"",
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
            boundingWidth: 200,
            boundingHeight: 50,
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
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
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
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
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
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
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
    
    	// 安装这个场景需要监听的KBE事件
        this.installEvents();
        return true;
    },
    
    installEvents : function()
    {
		// common
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisableConnect", this, "onDisableConnect");
		KBEngine.Event.register("onConnectStatus", this, "onConnectStatus");
	    	
		// login
		KBEngine.Event.register("onCreateAccountResult", this, "onCreateAccountResult");
		KBEngine.Event.register("onLoginFailed", this, "onLoginFailed");
		KBEngine.Event.register("onVersionNotMatch", this, "onVersionNotMatch");
		KBEngine.Event.register("onScriptVersionNotMatch", this, "onScriptVersionNotMatch");
		KBEngine.Event.register("onLoginGatewayFailed", this, "onLoginGatewayFailed");
		KBEngine.Event.register("onLoginSuccessfully", this, "onLoginSuccessfully");
		KBEngine.Event.register("login_baseapp", this, "login_baseapp");
		KBEngine.Event.register("Loginapp_importClientMessages", this, "Loginapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientMessages", this, "Baseapp_importClientMessages");
		KBEngine.Event.register("Baseapp_importClientEntityDef", this, "Baseapp_importClientEntityDef");
		
		KBEngine.Event.register("onImportClientMessages", this, "onImportClientMessages");
		KBEngine.Event.register("onImportClientEntityDef", this, "onImportClientEntityDef");
		KBEngine.Event.register("onImportServerErrorsDescr", this, "onImportServerErrorsDescr");
		
		// selavatars
		//KBEngine.Event.register("onReqAvatarList", this, "onReqAvatarList");
		//KBEngine.Event.register("onCreateAvatarResult", this, "onCreateAvatarResult");
		//KBEngine.Event.register("onRemoveAvatar", this, "onRemoveAvatar");
    },

	onKicked : function(failedcode)
	{
	},
		
	onDisableConnect : function()
	{
	},
		
	onConnectStatus : function(success)
	{
		if(!success)
			this.debug.ERROR_MSG("connect(" + g_kbengine.ip + ":" + g_kbengine.port + ") is error! (连接错误)");
		else
			this.debug.INFO_MSG("connect successfully, please wait...(连接成功，请等候...)");
	},

    onCreateAccountResult : function(retcode, datas)
    {
		if(retcode != 0)
		{
			this.debug.ERROR_MSG("createAccount is error(注册账号错误)! err=" + retcode);
			return;
		}
		
		if(KBEngineApp.validEmail(stringAccount))
		{
			this.debug.INFO_MSG("createAccount is successfully, Please activate your Email!(注册账号成功，请激活Email!)");
		}
		else
		{
			this.debug.INFO_MSG("createAccount is successfully!(注册账号成功!)");
		}    	
    },
    	    
    onLoginFailed : function(failedcode)
    {
		if(failedcode == 20)
		{
			this.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode + ", " + g_kbengine.serverdatas);
		}
		else
		{
			this.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode);
		}    	
    },

    onVersionNotMatch : function(clientVersion, serverVersion)
    {
    	this.debug.ERROR_MSG("version not match(curr=" + clientVersion + ", srv=" + serverVersion + " )(版本不匹配)");	
    },

    onScriptVersionNotMatch : function(clientScriptVersion, serverScriptVersion)
    {
    	this.debug.ERROR_MSG("scriptVersion not match(curr=" + clientScriptVersion + ", srv=" + serverScriptVersion + " )(脚本版本不匹配)");	
    },

    onLoginGatewayFailed : function(failedcode)
    {
    	this.debug.ERROR_MSG("loginGateway is failed(登陆网关失败), err=" + failedcode);	
    },
    	
    onLoginSuccessfully : function(rndUUID, eid, accountEntity)
    {
    	this.debug.INFO_MSG("login is successfully!(登陆成功!)");
    },

    login_baseapp : function()
    {
    	this.debug.INFO_MSG("connect to loginGateway, please wait...(连接到网关， 请稍后...)");
    },

    Loginapp_importClientMessages : function()
    {
    	this.debug.INFO_MSG("Loginapp_importClientMessages ...");
    },

    Baseapp_importClientMessages : function()
    {
    	this.debug.INFO_MSG("Baseapp_importClientMessages ...");
    },
    	
    Baseapp_importClientEntityDef : function()
    {
    	this.debug.INFO_MSG("Baseapp_importClientEntityDef ...");
    },

    onImportClientMessages : function(currserver, stream)
    {
    	this.debug.INFO_MSG("importClientMessages successfully!");
    },

    onImportClientEntityDef : function(stream)
    {
    	this.debug.INFO_MSG("importClientEntityDef successfully!");
    },
    	
    onImportServerErrorsDescr : function(stream)
    {
    	this.debug.INFO_MSG("importServerErrorsDescr successfully!");
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

        this._rootLayer.username = textField.getString();
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

        this._rootLayer.password = textField.getString();
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
            	if(this._rootLayer.username.length < 3)
            	{
            		this._rootLayer.debug.ERROR_MSG("username is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
 
             	if(this._rootLayer.password.length < 3)
            	{
            		this._rootLayer.debug.ERROR_MSG("password is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
            	
                this._rootLayer.debug.ERROR_MSG("connect to server...");
                g_kbengine.login(this._rootLayer.username, this._rootLayer.password);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
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
    }
});

var LoginScene = cc.Scene.extend({
    onEnter:function () 
    {
        this._super();
        
        // 创建基本场景层
        var layer = new LoginSceneLayer();
        this.addChild(layer);

		// 创建用户名输入框UI层
        var userNameLayer = new UserNameLayer(layer);
        this.addChild(userNameLayer, 1);
        
        // 创建密码输入框UI层
        var passwordLayer = new PasswordLayer(layer);
        this.addChild(passwordLayer, 1);

		// 创建登录按钮UI层
        var loginBtnLayer = new LoginBtnLayer(layer);
        this.addChild(loginBtnLayer, 1);

		// 创建账号注册按钮UI层
        var registerBtnLayer = new RegisterBtnLayer(layer);
        this.addChild(registerBtnLayer, 1);
    }
});

