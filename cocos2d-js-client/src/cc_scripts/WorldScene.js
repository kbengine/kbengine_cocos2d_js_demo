
var WorldSceneLayer = cc.Layer.extend({
    sprite:null,
    player:null,
    tmxmap: null,
    entities: null,
    playerLastPos: null,
    mapNode: null,
    mapName: "",
    relivePanel: null,
    ctor:function () {
        //////////////////////////////
        // super init first
        this._super();
		this.entities = {};
		this.mapNode = new cc.Node();
        return true;
    },

    onEnter: function () 
    {
        this._super();

		this.addChild(this.mapNode);
		
    	// 初始化UI
    	this.initUI();

    	// 安装这个场景需要监听的KBE事件
        this.installEvents();

		// 监听鼠标触摸等输入输出事件
		this.installInputEvents(this);
		
        // 激活update
        //this.schedule(this.worldUpdate, 0.1, cc.REPEAT_FOREVER, 0.1);
        this.scheduleUpdate();
    },
    	    
    onExit: function () {
    	this._super();
    },
    	
    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	initUI : function()
    {
        // ask the window size
        var size = cc.winSize;
            	
        // debug
        new GUIDebugLayer();
        this.addChild(GUIDebugLayer.debug, 100);    	
    },

	createReliveUI : function()
	{
		var size = cc.winSize;
		this.relivePanel = new cc.Sprite("res/img/2/spritesheet.png", cc.rect(0, 587, 844, 360));
        this.relivePanel.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
		
		this.addChild(this.relivePanel);	
		
		this.relivePanel.reliveStr = new ccui.Text();
        this.relivePanel.reliveStr.attr({
            string: "You have died, please revive avatar!",
            boundingWidth: 200,
            boundingHeight: 50,
            textAlign:cc.TEXT_ALIGNMENT_LEFT,
            fontName: "graphicpixel-webfont",
            fontSize: 20,
            x: size.width / 2 - 110,
            y: size.height / 2 - 150
        });
        this.relivePanel.reliveStr.setColor(new cc.Color(0, 0, 0, 255));
        this.relivePanel.addChild(this.relivePanel.reliveStr, 1);
        
        // 复活按钮
        this.relivePanel.reliveButton = new ccui.Button();
        this.relivePanel.reliveButton.setTouchEnabled(true);
        this.relivePanel.reliveButton.loadTextures("res/ui/btn_up.png", "res/ui/btn_down.png", "");
        this.relivePanel.reliveButton.setTitleText("Relive");
        this.relivePanel.reliveButton.setTitleFontName("graphicpixel-webfont");
        this.relivePanel.reliveButton.x = size.width / 2.0 - 110;
        this.relivePanel.reliveButton.y = size.height / 2.0 - 300;
        this.relivePanel.reliveButton.addTouchEventListener(this.touchReliveButtonEvent ,this);
        this.relivePanel.addChild(this.relivePanel.reliveButton, 2);		
	},
		
    touchReliveButtonEvent: function (sender, type) 
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                GUIDebugLayer.debug.INFO_MSG("relive...");
			    	var player = KBEngine.app.player();
			    	if(player == undefined || !player.inWorld)
			    		return;
            		player.relive(1);          
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },
    	
    /* -----------------------------------------------------------------------/
    							输入输出事件 相关
    /------------------------------------------------------------------------ */
	installInputEvents : function(target)
	{
        if( 'mouse' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                 event: cc.EventListener.MOUSE,
                onMouseMove: this.onMouseMove,
            }, target);
        } 
        
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:this.onTouchBegan
        }), this);
	},
    	
    onMouseMove: function(event)
    {
        //var pos = event.getLocation(), target = event.getCurrentTarget();
        //cc.log("onMouseMove at: " + pos.x + " " + pos.y );
    },

	onTouchBegan: function (touch, event) 
	{
        var pos = touch.getLocation(), target = event.getCurrentTarget();
        
        var locationInNode = target.convertToNodeSpace(pos);
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
		
		// 检查是否在区域内
        if (cc.rectContainsPoint(rect, locationInNode))
		{
			target.onClickUp(pos);
			return true;
		}
		
		return false;
	},
	
	onClickUp : function(pos)
	{
		cc.log("onClickUp at: " + pos.x + " " + pos.y);
		
		// 点击了鼠标，我们需要将角色移动到该位置
		if(this.player != null && this.player.state != 1/* 非死亡状态才可以移动 */)
		{
			this.player.chaseTarget = null;
			this.player.moveToPosition(this.mapNode.convertToNodeSpace(pos));
		}
	},
	
	onClickTarget : function(target)
	{
		cc.log("onClickTarget: " + target.res);
		
		if(this.player != target)
		{
			// 点击了鼠标，我们需要将角色移动到该目标的位置
			if(this.player != null && this.player.state != 1/* 非死亡状态才可以移动 */)
				this.player.moveToTarget(target);
		}	
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
		
		// in world
		KBEngine.Event.register("addSpaceGeometryMapping", this, "addSpaceGeometryMapping");
		KBEngine.Event.register("onAvatarEnterWorld", this, "onAvatarEnterWorld");
		KBEngine.Event.register("onEnterWorld", this, "onEnterWorld");
		KBEngine.Event.register("onLeaveWorld", this, "onLeaveWorld");
		KBEngine.Event.register("set_position", this, "set_position");
		KBEngine.Event.register("set_direction", this, "set_direction");
		KBEngine.Event.register("updatePosition", this, "updatePosition");
		KBEngine.Event.register("set_HP", this, "set_HP");
		KBEngine.Event.register("set_MP", this, "set_MP");
		KBEngine.Event.register("set_HP_Max", this, "set_HP_Max");
		KBEngine.Event.register("set_MP_Max", this, "set_MP_Max");
		KBEngine.Event.register("set_level", this, "set_level");
		KBEngine.Event.register("set_name", this, "set_entityName");
		KBEngine.Event.register("set_state", this, "set_state");
		KBEngine.Event.register("set_moveSpeed", this, "set_moveSpeed");
		KBEngine.Event.register("set_modelScale", this, "set_modelScale");
		KBEngine.Event.register("set_modelID", this, "set_modelID");
		KBEngine.Event.register("recvDamage", this, "recvDamage");
		KBEngine.Event.register("otherAvatarOnJump", this, "otherAvatarOnJump");
		KBEngine.Event.register("onAddSkill", this, "onAddSkill");
    },

	onKicked : function(failedcode)
	{
	},
		
	onDisableConnect : function()
	{
		// 切换到场景
		cc.director.runScene(new StartScene());			
	},
		
	onConnectStatus : function(success)
	{
		if(!success)
			GUIDebugLayer.debug.ERROR_MSG("Connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)");
		else
			GUIDebugLayer.debug.INFO_MSG("Connect successfully, please wait...(连接成功，请等候...)");
		
		// 切换到场景
		cc.director.runScene(new StartScene());			
	},

	addSpaceGeometryMapping : function(resPath)
	{
		// 服务器space创建了几何映射（可以理解为添加了场景的具体资源信息，客户端可以使用这个信息来加载对应的场景表现）
		this.mapName = resPath;
		
        // 其实可以将resPath与地图tmx文件名设置为一致，那么就可以根据服务器返回的信息来加载场景
        // resPath由服务端cell/space.py中KBEngine.addSpaceGeometryMapping(self.spaceID, None, resPath)设置
        this.createScene("res/img/3/cocosjs_demo_map1.png");
        this.fixMap();
	},
	
	onAvatarEnterWorld : function(rndUUID, eid, avatar)
	{
		// 角色进入世界，创建角色精灵
		this.player = new AvatarSprite(this, eid, "res/img/3/clotharmor.png");
        this.player.attr({
            x: avatar.position.x * 16,
            y: avatar.position.z * 16,
            anchorX: 0.5
        });

		this.mapNode.addChild(this.player, 10);
        this.entities[avatar.id] = this.player;
        this.playerLastPos = cc.p(this.player.x, this.player.y);
        
        this.fixMap();
	},

	fixMap : function()
	{
		if(this.tmxmap == null || this.player == null)
			return;
		
		var size = cc.winSize;
		
        // 将角色放置于屏幕中心
        this.mapNode.x = this.mapNode.x - this.player.x + (size.width / 2);	
		this.mapNode.y = this.mapNode.y - this.player.y + (size.height / 2);	
	},
		
	onEnterWorld : function(entity)
	{
		// NPC/Monster/Gate等实体进入客户端世界，我们需要创建一个精灵来描述整个实体的表现
		if(!entity.isPlayer())
		{
			var ae = new EntitySprite(this, entity.id, "res/img/3/crab.png");
	        ae.attr({
	            x: entity.position.x * 16,
	            y: entity.position.z * 16,
	            anchorX: 0.5
	        });

	        this.mapNode.addChild(ae, 10);
	        this.entities[entity.id] = ae;
	    }

		// 实体第一次进入到这个世界时这些属性不属于值改变行为，造成事件不会触发
		// 这里我们强制进行一次相关表现上的设置
		this.set_moveSpeed(entity, entity.moveSpeed);
		this.set_state(entity, entity.state);
		this.set_modelID(entity, entity.modelID);
		this.set_modelScale(entity, entity.modelScale);
		this.set_entityName(entity, entity.name);
		this.set_HP(entity, entity.HP);	
		this.set_HP_Max(entity, entity.HP_Max);	
		this.set_direction(entity);
	},

	onLeaveWorld : function(entity)
	{
		// 实体离开了客户端世界，通常是因为离开了玩家的AOI
		this.mapNode.removeChild(this.entities[entity.id]);
		delete this.entities[entity.id];
		
		if(entity.isPlayer())
			this.player = null;
	},

	set_position : function(entity)
	{
		// 强制将位置设置到坐标点
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
		
		ae.x = entity.position.x * 16;
		ae.y = entity.position.z * 16;
	},

	updatePosition : function(entity)
	{
		// 服务器同步到实体的新位置，我们需要将实体平滑移动到指定坐标点
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		ae.isOnGound = entity.isOnGound;
		ae.moveToPosition(cc.p(entity.position.x * 16, entity.position.z * 16));	
	},	

	set_direction : function(entity)
	{
		// 我们将实体的方向设置在服务器实体的direction.z上，因此数据同步过来时我们
		// 需要将表现设置到对应的朝向上
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		ae.setDirection(entity.direction.z);
	},

	set_HP : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;	
		
		ae.set_HP(v);
	},

	set_MP : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},

	set_HP_Max : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;	
		
		ae.set_HP_Max(v);	
	},	
		
	set_MP_Max : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},

	set_level : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},

	set_entityName : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		ae.setName(v);
	},	

	set_state : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		ae.setState(v);
		
		if(entity.isPlayer())
		{
			if(this.relivePanel != null)
			{
				this.removeChild(this.relivePanel);
				this.relivePanel = null;
			}
			
			// 如果死亡了，弹出死亡复活面板
			if(v == 1)
			{
				this.createReliveUI();
			}
		}
	},

	set_moveSpeed : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		ae.setSpeed(v / 10.0);
	},

	set_modelScale : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},

	set_modelID : function(entity, v)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
				
		switch(v)
		{
			case 80001001:
				ae.setSprite("res/img/3/crab.png");
				break;
			case 80002001:
				ae.setSprite("res/img/3/rat.png");
				break;
			case 80003001:
				ae.setSprite("res/img/3/bat.png");
				break;
			case 80004001:
				ae.setSprite("res/img/3/bat.png");
				break;
			case 80005001:
				ae.setSprite("res/img/3/bat.png");
				break;
			case 80006001:
				ae.setSprite("res/img/3/firefox.png");
				break;
			case 80007001:
				ae.setSprite("res/img/3/skeleton2.png");
				break;
			case 80008001:
				ae.setSprite("res/img/3/snake.png");
				break;
			case 80009001:
				ae.setSprite("res/img/3/skeleton.png");
				break;		
			case 80010001:
				ae.setSprite("res/img/3/ogre.png");
				break;
			case 80011001:
				ae.setSprite("res/img/3/goblin.png");
				break;
			case 80012001:
				ae.setSprite("res/img/3/eye.png");
				break;
			case 80013001:
				ae.setSprite("res/img/3/spectre.png");
				break;
			case 80014001:
				ae.setSprite("res/img/3/boss.png");
				break;
			default:
				// 其他玩家
				ae.setSprite("res/img/3/clotharmor.png");
				break;																																				
		};
	},

	recvDamage : function(entity, attacker, skillID, damageType, damage)
	{
		// 实体做攻击表现
		var atk_ae = this.entities[attacker.id];
		var ae = this.entities[entity.id];
		
		if(atk_ae != undefined)
		{
			atk_ae.attack(ae, skillID, damageType, damage);
		}
				
		// 实体接受伤害，可以在此做受击表现
		if(ae == undefined)
			return;
	},

	onAddSkill : function(entity)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},

	otherAvatarOnJump : function(entity)
	{
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;		
	},
															
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
	createScene : function(resPath)
    {
    	if(resPath.indexOf(".tmx") != -1)
    	{
      	  this.tmxmap = cc.TMXTiledMap.create(resPath);    
      	}
      	else
      	{
			this.tmxmap = new cc.Sprite(resPath);   
	        this.tmxmap.attr({
	            anchorX: 0,
	            anchorY: 0
	        });			  		
      	}
      	
        this.mapNode.addChild(this.tmxmap, 1, NODE_TAG_TMX);
    },

    worldUpdate : function (dt) 
    {
    },
    
    update : function (dt) 
    {
    	if(this.tmxmap == null || this.playerLastPos == null)
    		return;
    	
    	var player = KBEngine.app.player();
    	if(player == undefined || !player.inWorld)
    		return;
    		
    	if(this.player.state != 1)
    	{
    		var s = "[scene] = " + this.mapName + ", [pos] = (" + Math.round(this.player.x) + ", " + Math.round(this.player.y) + ")";
    		if(this.player.chaseTarget != null)
    			s += ", [chaseTarget] = " + this.player.chaseTarget.entityID;
    		else if(this.player.attackTarget != null)
    			s += ", [attackTarget] = " + this.player.attackTarget.entityID;
    		
    		GUIDebugLayer.debug.INFO_MSG(s);
    	}
    	else
    	{
    		GUIDebugLayer.debug.INFO_MSG("Dead(角色已死亡), can not move!");
    		return;
    	}
    	
    	var x = this.playerLastPos.x - this.player.x;
    	var y = this.playerLastPos.y - this.player.y;

    	this.playerLastPos.x = this.player.x;
    	this.playerLastPos.y = this.player.y;
    	
    	var pos = this.convertToNodeSpace(cc.p(x, y));
    	this.mapNode.x += pos.x;
    	this.mapNode.y += pos.y;
    	
		player.position.x = this.player.x / 16;
		player.position.y = 0;
		player.position.z = this.player.y / 16;
		player.direction.x = 0;
		player.direction.y = 0;		
		player.direction.z = this.player.getDirection();
		KBEngine.app.isOnGound = 1;
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

