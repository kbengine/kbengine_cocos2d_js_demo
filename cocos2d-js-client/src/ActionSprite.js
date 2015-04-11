var ActionAnimation = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    w: 0,
    h: 0,
    row: 0,
    length: 0,
    name : "",
    ctor:function (sprite, row, length, w, h, frameX, frameY, name) {
        //////////////////////////////
        // super init first
        this._super();

        this.sprite = sprite;
        this.row = row;
        this.length = length;
        this.w = w;
        this.h = h;
        this.frameX = frameX;
        this.frameY = frameY;
        this.name = name;
        return true;
    },	
    
    play : function()
    {
        this.sprite.setTextureRect(cc.rect(this.frameX * this.w, (this.frameY + this.row) * this.h, this.w, this.h));
        this.frameX += 1;
        if(this.frameX >= this.length)
            this.frameX = 0;
    },

    reset : function()
    {
        this.frameX = 0;
        this.frameY = 0;
    }
});

var ActionSprite = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    scene:null,
    animations: null,
    state: 0,
    speed: 6,
    lastAnim: null,
    res: "",
    ui_name:null,
    ctor:function (scene, res) {
        //////////////////////////////
        // super init first
        this._super();
        
        this.scene = scene;
        this.res = res;
		this.animations = {};
        return true;
    },	

    onEnter: function () 
    {
    	this._super();
    	
    	this.setSprite(this.res);
    	
        // 激活update
        this.schedule(this.spriteUpdate, 0.15, cc.REPEAT_FOREVER, 0.15);
    },

    onExit: function () 
    {
    	this._super();
    },

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
	    }

        this.ui_name.setString(name);
	},
		
    setSprite : function(res)
    {
    	this.res = res;
    	if(this.sprite != null)
    	{
    		this.removeChild(this.sprite);
    	}
    	
        spriteRes = res.replace(/\\/g,'/');
        var s1 = spriteRes.lastIndexOf('/');
        var s2 = spriteRes.lastIndexOf('.');
        var name = spriteRes.substring(s1 + 1, s2);

        var jsonData = cc.loader.getRes("res/sprites/" + name + ".json");

		this.sprite = new cc.Sprite(res, cc.rect(0, 0, jsonData.width * 3, jsonData.height * 3));
        this.addChild(this.sprite);

        // 初始化动画信息
        this.animations = {};
        this.lastAnim = null;
        
        var animations = jsonData.animations;
        for(var aniName in animations)
        {
            var ani = animations[aniName];
            var actionAnimation = new ActionAnimation(this.sprite, ani.row, ani.length, jsonData.width * 3, jsonData.height * 3, 0, 0, aniName);
            this.animations[aniName] = actionAnimation;
        }
        
        // 重新刷动画播放
        this.setState(this.state);
    },

    play : function(aniName)
    {
    	if(arguments.length == 1)
    	{
	        if(this.lastAnim == null || this.lastAnim.name != aniName)
	        {
	            this.lastAnim = this.animations[aniName];
	            this.lastAnim.reset();
	        }
	    }
	    else
	    {
	    	if(this.lastAnim == null)
	    		return;
	    }

	    this.lastAnim.play();
    },

    setState : function(state)
    {
        this.state = state;
        
        // 初始动作表现
        this.play("idle_down");        
    },

    getDir: function (dx, dy) 
    {
        // 坐标系 →x ↑y， 0 当前方向不变， 1 到 4 分别为右、上、左、下        
        if (dx > 0 && dx >= Math.abs(dy))
        {
            return 1; // 右
        }
        else if (dx < 0 && Math.abs(dx) >= Math.abs(dy))
        {
            return 3; // 左
        }
        else if (dy > 0 && dy >= Math.abs(dx))
        {
            return 2; // 上
        }
        else if (dy < 0 && Math.abs(dy) >= Math.abs(dx))
        {
            return 4; // 下
        }
        
        return 0; // 当前方向不变
    },
    	
	moveTo : function(position)
	{
		this.stopAllActions();

        var x = position.x - this.x;
        var y = position.y - this.y;
        var t = Math.sqrt(x * x + y * y) / 16 / this.speed;
        
        var act1 = cc.moveTo(t, position);
        var act2 = cc.callFunc(this.onMoveToOver);
        var actF = cc.sequence(act1, act2);
		this.runAction(actF);
		
		var dir = this.getDir(x, y);
		switch(dir)
		{
			case 1:
				this.scaleX = 1;		
				this.ui_name.scaleX = 1;
				this.play("walk_right");
				break;
			case 2:
				this.play("walk_up");
				break;
			case 3:
				// 由于只有一个right, 因此这个方向的表现需要翻转图片
				this.scaleX = -1;
				this.ui_name.scaleX = -1;
				this.play("walk_right");
				break;
			case 4:
				this.play("walk_down");
				break;
		};
	},

    onMoveToOver : function (pSender) 
    {
        if(pSender.lastAnim == null || pSender.lastAnim.name == "walk_down")
        {
        	pSender.play("idle_down");
        }    	
        else if(pSender.lastAnim.name == "walk_up")
        {
        	pSender.play("idle_up");
        }
        else if(pSender.lastAnim.name == "walk_right")
        {
        	pSender.play("idle_right");
        }        
    },
    	
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    spriteUpdate : function(dt)
    {
        this.play();
    }
});