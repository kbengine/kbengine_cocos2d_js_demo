
var LoginSceneLayer = cc.Layer.extend({
    sprite:null,
    clientScriptVersion:null,
    serverVersion:null,
    serverScriptVersion:null,
    clientVersion:null,
    debug:null,
    username:"",
    password:"",
    ctor:function () 
    {
        //////////////////////////////
        // super init first
        this._super();
        
		// 激活 update
        this.schedule(this.update, 0.1, cc.repeatForever, 0.1);
    
    	// 初始化UI
    	this.initUI();
    	
    	// 安装这个场景需要监听的KBE事件
        this.installEvents();
        
        // 创建场景
        this.start_map = cc.TMXTiledMap.create("res/img/2/start.tmx"); 
        this.addChild(this.start_map, 1); 
        
        var size = cc.winSize;
		this.start_map.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        	        
        return true;
    },

    onExit: function () {
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

	initUI : function()
    {
        // ask the window size
        var size = cc.winSize;

        // debug
        new GUIDebugLayer();
        this.addChild(GUIDebugLayer.debug, 100);

        // serverVersion
        this.serverVersion = new ccui.Text();
        this.serverVersion.attr({
            string: "serverVersion: ",
            fontName: "Arial",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 50
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
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 70
        });
        this.serverScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.serverScriptVersion, 2);

        this.clientVersion = new ccui.Text();
        this.clientVersion.attr({
            string: "clientVersion: " + KBEngine.app.clientVersion,
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 95
        });
        this.clientVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientVersion, 2);

        this.clientScriptVersion = new ccui.Text();
        this.clientScriptVersion.attr({
            string: "clientScriptVersion: " + KBEngine.app.clientScriptVersion,
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 15,
            anchorX: 0,
            anchorY: -1,
            x: 5,
            y: size.height - 115
        });
        this.clientScriptVersion.setColor(new cc.Color(0, 255, 0, 255));
        this.addChild(this.clientScriptVersion, 2);

        this.introduction = new ccui.Text();
        this.introduction.attr({
            string: "A Massively Multiplayer Adventure",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "Arial",
            fontSize: 20,
            anchorX: 0,
            anchorY: -1,
            x: size.width / 2 - 140,
            y: size.height - 350
        });
        this.introduction.setColor(new cc.Color(0, 0, 0, 255));
        this.addChild(this.introduction, 2);
        
		this.logo = new cc.Sprite("res/ui/logo.png");
		this.logo.attr({
            x: size.width / 2 - 30,
            y: size.height - 100			
		});
        this.addChild(this.logo, 2);        
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
			GUIDebugLayer.debug.ERROR_MSG("connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("connect successfully, please wait...(连接成功，请等候...)");
	},

    onCreateAccountResult : function(retcode, datas)
    {
		if(retcode != 0)
		{
			GUIDebugLayer.debug.ERROR_MSG("createAccount is error(注册账号错误)! err=" + retcode);
			return;
		}
		
		if(KBEngineApp.validEmail(stringAccount))
		{
			GUIDebugLayer.debug.INFO_MSG("createAccount is successfully, Please activate your Email!(注册账号成功，请激活Email!)");
		}
		else
		{
			GUIDebugLayer.debug.INFO_MSG("createAccount is successfully!(注册账号成功!)");
		}    	
    },
    	    
    onLoginFailed : function(failedcode)
    {
		if(failedcode == 20)
		{
			GUIDebugLayer.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode + ", " + KBEngine.app.serverdatas);
		}
		else
		{
			GUIDebugLayer.debug.ERROR_MSG("login is failed(登陆失败), err=" + failedcode);
		}    	
    },

    onVersionNotMatch : function(clientVersion, serverVersion)
    {
    	GUIDebugLayer.debug.ERROR_MSG("version not match(curr=" + clientVersion + ", srv=" + serverVersion + " )(版本不匹配)");	
    },

    onScriptVersionNotMatch : function(clientScriptVersion, serverScriptVersion)
    {
    	GUIDebugLayer.debug.ERROR_MSG("scriptVersion not match(curr=" + clientScriptVersion + ", srv=" + serverScriptVersion + " )(脚本版本不匹配)");
    },

    onLoginGatewayFailed : function(failedcode)
    {
    	GUIDebugLayer.debug.ERROR_MSG("loginGateway is failed(登陆网关失败), err=" + failedcode);	
    	this.removeChild(this.connectStateLayer);
    },
    	
    onLoginSuccessfully : function(rndUUID, eid, accountEntity)
    {
    	GUIDebugLayer.debug.INFO_MSG("login is successfully!(登陆成功!)");
    	
    	// 切换到选人场景
	    cc.director.runScene(new WorldScene());
    },

    login_baseapp : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("connect to loginGateway, please wait...(连接到网关， 请稍后...)");
    },

    Loginapp_importClientMessages : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Loginapp_importClientMessages ...");
    },

    Baseapp_importClientMessages : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Baseapp_importClientMessages ...");
    },
    	
    Baseapp_importClientEntityDef : function()
    {
    	GUIDebugLayer.debug.INFO_MSG("Baseapp_importClientEntityDef ...");
    },

    onImportClientMessages : function(currserver, stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importClientMessages successfully!");
    },

    onImportClientEntityDef : function(stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importClientEntityDef successfully!");
    },
    	
    onImportServerErrorsDescr : function(stream)
    {
    	GUIDebugLayer.debug.INFO_MSG("importServerErrorsDescr successfully!");
    },
    	 	
    update : function (dt) {
        this.serverScriptVersion.setString("serverScriptVersion: " + KBEngine.app.serverScriptVersion);
        this.serverVersion.setString("serverVersion: " + KBEngine.app.serverVersion);
    }
});
    
var UserNameLayer = cc.Layer.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        var size = cc.winSize;

        this.width = 150;
        this.height = 20;
        this.x = size.width / 2 - 50;
        this.y = size.height / 2 - 20;

        // 设置账号名密码编辑框
        // Create the textfield
        this._box = new cc.EditBox(cc.size(288, 34), new cc.Scale9Sprite("res/ui/login_input.png"));
        this._box.setString("");
        this._box.x = this.width / 2 - 20;
        this._box.y = this.height / 2 - 50;
        //this._box.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._box.setPlaceHolder("Input Username");
        this._box.setPlaceholderFontColor(cc.color(128, 128, 128));
        this._box.setPlaceholderFontSize(20);
        this._box.setDelegate(this);
        this._box.setFontColor(cc.color(0, 0, 0));
        this._box.setFontSize(20);
        this._box.setMaxLength(15);
        this.addChild(this._box, 2);

        return true;
    },

	editBoxEditingDidBegin: function (editBox) {
        this._rootLayer.username = editBox.getString();        
    },

    editBoxEditingDidEnd: function (editBox) {
        this._rootLayer.username = editBox.getString();   
    },

    editBoxTextChanged: function (editBox, text) {
        this._rootLayer.username = editBox.getString();   
    },

    editBoxReturn: function (editBox) {
        this._rootLayer.username = editBox.getString();   
    }
});


var PasswordLayer = cc.Layer.extend({
    sprite:null,
    _rootLayer:null,
    ctor:function (rootLayer) {
        //////////////////////////////
        // super init first
        this._super();
        this._rootLayer = rootLayer;

        var size = cc.winSize;

        this.width = 150;
        this.height = 20;
        this.x = size.width / 2 - 50;
        this.y = size.height / 2 - 60;

        // 设置账号名密码编辑框
        // Create the textfield
        this._box = new cc.EditBox(cc.size(288, 34), new cc.Scale9Sprite("res/ui/login_input.png"));
        this._box.setString("");
        this._box.x = this.width / 2 - 20;
        this._box.y = this.height / 2 - 50;
        this._box.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._box.setPlaceHolder("Input Password");
        this._box.setPlaceholderFontColor(cc.color(128, 128, 128));
        this._box.setPlaceholderFontSize(20);
        this._box.setDelegate(this);
        this._box.setFontColor(cc.color(0, 0, 0));
        this._box.setFontSize(20);
        this._box.setMaxLength(15);
        this.addChild(this._box, 2);

        return true;
    },

	editBoxEditingDidBegin: function (editBox) {
        this._rootLayer.password = editBox.getString();        
    },

    editBoxEditingDidEnd: function (editBox) {
        this._rootLayer.password = editBox.getString();   
    },

    editBoxTextChanged: function (editBox, text) {
        this._rootLayer.password = editBox.getString();   
    },

    editBoxReturn: function (editBox) {
        this._rootLayer.password = editBox.getString();   
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
        textButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        textButton.setTitleText("Login");
        textButton.x = size.width / 2.0 - 100;
        textButton.y = size.height / 2.0 - 150;
        textButton.addTouchEventListener(this.touchEvent ,this);
        this.addChild(textButton, 1);

        return true;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            	if(this._rootLayer.username.length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("username is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
 
             	if(this._rootLayer.password.length < 3)
            	{
            		GUIDebugLayer.debug.ERROR_MSG("password is error, length < 3!(账号或者密码错误，长度必须大于等于3!)");
            		return;
            	}
            	
                GUIDebugLayer.debug.INFO_MSG("connect to server...");
                KBEngine.Event.fire("login", this._rootLayer.username, this._rootLayer.password);
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
        textButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        textButton.setTitleText("Register");
        textButton.x = size.width / 2.0 + 100;
        textButton.y = size.height / 2.0 - 150;
        textButton.addTouchEventListener(this.touchEvent ,this);
        this.addChild(textButton, 1);

        return true;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                GUIDebugLayer.debug.ERROR_MSG("connect to server...");
            	KBEngine.Event.fire("createAccount", this._rootLayer.username, this._rootLayer.password);
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

