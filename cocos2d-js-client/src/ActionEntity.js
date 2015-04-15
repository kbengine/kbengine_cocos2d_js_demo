/* 
	一个抽象的实体类，可以用来描述NPC/MONSTER/传送门/可交互的服务端实体对象
*/	
var ActionEntity = ActionSprite.extend({
	isOnGound: true,
	ui_name:null,
	uiHP: null,
	shadow: null,
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super(scene, res);
        return true;
    },

    /* -----------------------------------------------------------------------/
    							UI 相关
    /------------------------------------------------------------------------ */
	createHPUI : function()
	{
		if(this.uiHP != null)
			return;
		
        this.uiHP = new ccui.Text();
        this.uiHP.attr({
            string: "0/0",
            fontName: "graphicpixel-webfont",
            fontSize: 20,
            anchorX: 0.5,
            anchorY: -1,
            y : 30
        });
        this.uiHP.setColor(new cc.Color(255, 0, 0, 255));
        this.addChild(this.uiHP, 1);
        
        this.uiHP.HP = 0;
        this.uiHP.HP_MAX = 0;  
        this.uiHP.scaleX = this.scaleX;
	},

    setSprite : function(res)
    {
    	this._super(res);
    	
    	// 脚下添加一个影子
		this.shadow = new cc.Sprite("res/img/3/shadow16.png");
        this.shadow.attr({
            anchorX: 0.5,
            y : -20
        });
        			
        this.addChild(this.shadow);
    },
    	
    /* -----------------------------------------------------------------------/
    							服务器消息数据表现
    /------------------------------------------------------------------------ */
	setName : function(name)
	{
		if(this.ui_name == null)
		{
	        this.ui_name = new ccui.Text();
	        this.ui_name.attr({
	            string: name,
	            fontName: "graphicpixel-webfont",
	            fontSize: 20,
	            anchorX: 0.5,
	            anchorY: -1
	        });
	        this.ui_name.setColor(new cc.Color(255, 255, 0, 255));
	        this.addChild(this.ui_name, 1);
	        this.ui_name.scaleX = this.scaleX;
	    }

		this.ui_name.setString(name);
	},
	
	set_HP : function(v)
	{
		this.createHPUI();
		this.uiHP.HP = v;
		this.uiHP.setString("" + this.uiHP.HP + "/" + this.uiHP.HP_MAX);
	},

	set_HP_Max : function(v)
	{
		this.createHPUI();
		this.uiHP.HP_MAX = v;
		this.uiHP.setString("" + this.uiHP.HP + "/" + this.uiHP.HP_MAX);
	},

	recvDamage : function(entity, attacker, skillID, damageType, damage)
	{
		// 实体接受伤害，可以在此做受击表现
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    updateAnim : function()
    {
    	this._super();
    	
    	if(this.ui_name != null)
        	this.ui_name.scaleX = this.scaleX;
        
        if(this.uiHP != null)
       	 this.uiHP.scaleX = this.scaleX;    	
    },
    	    
    spriteUpdate : function(dt)
    {
        this._super(dt);
    }
});
