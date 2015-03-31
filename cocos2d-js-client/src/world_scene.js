
var WorldSceneLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();

    	// 初始化UI
    	this.initUI();

    	// 安装这个场景需要监听的KBE事件
        this.installEvents();
        return true;
    },

    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	initUI : function()
    {
        // debug
        new GUIDebugLayer();
        this.addChild(GUIDebugLayer.debug, 1);    	
    },

    /* -----------------------------------------------------------------------/
    							KBEngine 事件响应
    /------------------------------------------------------------------------ */
    installEvents : function()
    {
		// common
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisableConnect", this, "onDisableConnect");
		KBEngine.Event.register("onConnectStatus", this, "onConnectStatus");
		KBEngine.Event.register("addSpaceGeometryMapping", this, "addSpaceGeometryMapping");
		
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
			GUIDebugLayer.debug.ERROR_MSG("connect(" + g_kbengine.ip + ":" + g_kbengine.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("connect successfully, please wait...(连接成功，请等候...)");
	},

	addSpaceGeometryMapping : function(resPath)
	{
		GUIDebugLayer.debug.INFO_MSG("scene = " + resPath);
		
        // 创建场景
        this.createScene();		
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    onExit: function () {
    },
    	    
	createScene : function()
    {
        this.cocosjs_demo_map1 = cc.TMXTiledMap.create("res/img/3/cocosjs_demo_map1.tmx"); 
        this.addChild(this.cocosjs_demo_map1, 1); 
        
        var size = cc.winSize;
		this.cocosjs_demo_map1.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });	
    },

    update : function (dt) {
    }
});


var WorldScene = cc.Scene.extend({
    onEnter:function () 
    {
        this._super();
        
        // 创建基本场景层
        var layer = new WorldSceneLayer();
        this.addChild(layer);
    }
});

