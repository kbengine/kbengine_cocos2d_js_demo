var ActionAnimation = cc.Node.extend({
	sprite:null,
    frameX: 0,
    frameY: 0,
    w: 0,
    h: 0,
    row: 0,
    length: 0,
    name : "",
    dir : 0,
    parent: null,
    repeat: false,
    ctor:function (parent, sprite, repeat, row, length, w, h, frameX, frameY, name) {
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
        this.parent = parent;
        this.repeat = repeat;
        return true;
    },	
    
    play : function()
    {
        this.sprite.setTextureRect(cc.rect(this.frameX * this.w, (this.frameY + this.row) * this.h, this.w, this.h));
        this.frameX += 1;
        if(this.frameX >= this.length)
        {
        	if(this.repeat == true)
            	this.frameX = 0;
            else
            	this.frameX = this.length - 1;
        }
    },

	isOver : function()
	{
		// 重复播放的动画没有结束状态
		if(this.repeat == true)
			return false;
		
		// 动画是否播放完毕
		return this.frameX >= this.length - 1;
	},
		
    reset : function()
    {
        this.replay();
        this.parent.addChild(this.sprite);
        this.parent.sprite = this.sprite;
    },
    
    replay : function()
    {
        this.frameX = 0;
        this.frameY = 0;
    },
    	
    stop : function()
    {
    	this.parent.removeChild(this.sprite);
    	this.replay();
    }
});


/*
	活动精灵对象类
*/
var ActionSprite = cc.Node.extend({
	sprite:null,
    scene:null,
    animations: null,
    state: 0,
    speed: 6,
    lastAnim: null,
    onceAnim: null,
    res: "",
    isMoving: false,
    _listener: null,
    isDestroyed : true,
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
    	this.isDestroyed = false;
    	this._super();
    	
    	this.setSprite(this.res);
    	
        // 激活update
        this.schedule(this.spriteUpdate, 0.15, cc.REPEAT_FOREVER, 0.15);
        
		this.runAction(cc.fadeIn(1.0));
		this.installClickEvent();
    },

    onExit: function () 
    {
    	this.isDestroyed = true;
    	this._super();
    	this.uninstallClickEvent();
    },

    /* -----------------------------------------------------------------------/
    							输入输出事件 相关
    /------------------------------------------------------------------------ */
	installClickEvent : function()
	{
        var selfPointer = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {
            	if(selfPointer.lastAnim == null)
            		return false;
            	
            	var target = event.getCurrentTarget();
            	
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var w = selfPointer.lastAnim.w;
                var h = selfPointer.lastAnim.h;
                
                if(w < 100)	w = 100;
                if(h < 100)	h = 100;
                
                var rect = cc.rect(-(w / 2), -(h / 2), w, h);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.scene.onClickTarget(selfPointer);
                    return true;
                }
                
                return false;
            }
        });

		cc.eventManager.addListener(listener, this);
        this._listener = listener;		
	},
	
	uninstallClickEvent : function()
	{
		if(this._listener != null)
		{
			cc.eventManager.removeListener(this._listener);
			this._listener = null;
		}
	},
		    
    /* -----------------------------------------------------------------------/
    							其他相关
    /------------------------------------------------------------------------ */    
	setSpeed : function(speed)
	{
		this.speed = speed;
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
		
		// 播放动画的时候决定添加到节点上显示
		// 因为可能动画不在同一张图上, 例如死亡动画是一张通用的精灵图
        // this.addChild(this.sprite);

        // 初始化动画信息
        this.animations = {};
        this.lastAnim = null;
        
        var animations = jsonData.animations;
        for(var aniName in animations)
        {
            var ani = animations[aniName];
            var actionAnimation = new ActionAnimation(this, this.sprite, aniName != "death" && aniName.indexOf("atk_") == -1, 
            		ani.row, ani.length, jsonData.width * 3, jsonData.height * 3, 0, 0, aniName);
            
            this.animations[aniName] = actionAnimation;
        }
        
        // 如果资源中没有包含死亡动画，那么创建一个通用死亡动画
        var deathAnim = this.animations["death"];
        if(deathAnim == undefined)
        {
        	jsonData = cc.loader.getRes("res/sprites/death.json");
        	var ani = jsonData.animations["death"];
        	var death_sprite = new cc.Sprite("res/img/3/death.png", cc.rect(0, 0, jsonData.width * 3, jsonData.height * 3))
        	this.animations["death"] = new ActionAnimation(this, death_sprite, false, ani.row, ani.length, jsonData.width * 3, jsonData.height * 3, 0, 0, "death");
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
	        	if(this.onceAnim == null)
	        	{
		        	if(this.lastAnim != null)
		        		this.lastAnim.stop();
		        	
		            this.lastAnim = this.animations[aniName];
		            if(this.lastAnim != undefined)
						this.lastAnim.reset();
					else
						return;
				}
				else
				{
					this.lastAnim = this.animations[aniName];
				}
	        }
	    }
	    else
	    {
	    	if(this.lastAnim == null)
	    		return;
	    }

		// 不重复播放的动画通常是死亡、攻击等，这些必须播完才可以进行其他动画播放
		if(this.onceAnim == null)
		{
			if(this.lastAnim.repeat != true)
				this.onceAnim = this.lastAnim;
		}
		else
		{
			if(this.onceAnim.isOver() == false)
			{
				this.onceAnim.play();
				return;
			}
			else
			{
				if(this.onceAnim != this.lastAnim)
				{
					this.onceAnim.stop();
					this.onceAnim = null;
					this.lastAnim.reset();
				}
		        else
		        {
		        	if(arguments.length > 0 && this.lastAnim.repeat != true)
		        		this.lastAnim.replay();
		        }				
			}
		}
		
	    this.lastAnim.play();
    },
		
    setState : function(state)
    {
        this.state = state;

        if(state == 1)
            this.stop();
        else
          // 初始动作表现
           this.updateAnim();
    },

    calcDirection: function (dx, dy) 
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
    
    getDirection : function()
    {
    	return this.dir;
    },
    	
    setDirection : function(dir)
    {
    	if(dir == 0)
    	{
    		this.updateAnim();
    		return;
    	}

    	if(this.dir == dir)
    		return;
    	
		this.dir = dir;
		this.updateAnim();
    },
    
    updateAnim : function()
    {
    	/* 服务端脚本定义的状态
			ENTITY_STATE_UNKNOW										= -1
			ENTITY_STATE_FREE										= 0
			ENTITY_STATE_DEAD										= 1
			ENTITY_STATE_REST										= 2
			ENTITY_STATE_FIGHT										= 3
			ENTITY_STATE_MAX    									= 4    
			
			当前所有的动作
			atk_right
			walk_right
			idle_right
			atk_up
			walk_up
			idle_up
			atk_down
			walk_down
			idle_down		
    	*/
    	    	
		var anim = "idle_";
		
		if(this.state == 1)
		{
			anim = "death";
		}
		else
		{
			if(this.isMoving)
			{
				anim = "walk_";
			}
			else if(this.state == 3)
			{
				// 这里仍然使用idle， "atk_", 在挥动武器的刹那才播放该动作
				anim = "idle_"; 
			}
			
			if(arguments.length == 1)
			{
				anim = arguments[0];
			}
			
			switch(this.dir)
			{
				case 1:
					this.scaleX = 1;
					anim += "right";
					break;
				case 2:
					anim += "up";
					break;
				case 3:
					// 由于只有一个right, 因此这个方向的表现需要翻转图片
					this.scaleX = -1;
					anim += "right";
					break;
				case 4:
					anim += "down";
					break;
				default:
					anim += "down";
					break;
			};
		}
		
		this.play(anim);
    },
    
    stop : function()
    {
    	this.stopAllActions();
    	this.isMoving = false;
    	this.updateAnim();
    },

	moveToPosition : function(position)
	{
		this._moveToPosition(position);
	},
		
	_moveToPosition : function(position)
	{
		this.stopAllActions();

        var x = position.x - this.x;
        var y = position.y - this.y;
        var t = Math.sqrt(x * x + y * y) / 16 / this.speed;
        
        var act1 = cc.moveTo(t, position);
        var delay = cc.delayTime(0.1);
        var act2 = cc.callFunc(this.onMoveToPositionOver);
        var actF = cc.sequence(act1, delay, act2);
		this.runAction(actF);
		
		this.isMoving = true;
		this.setDirection(this.calcDirection(x, y));
	},

    onMoveToPositionOver : function (pSender) 
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
        
        this.isMoving = false;
    },
    	
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    spriteUpdate : function(dt)
    {
        this.play();
    }
});