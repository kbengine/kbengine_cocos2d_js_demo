/*
	玩家实体精灵表现类，继承于EntitySprite
	与EntitySprite主要的区别是实体由客户端控制
*/
var AvatarSprite = EntitySprite.extend(
{
	chaseTarget: null,
	attackTarget: null,
	lastTime : 0,
    ctor:function (scene, entityID, res) {
        //////////////////////////////
        // super init first
        this._super(scene, entityID, res);
        return true;
    },
    
    clearTarget : function()
    {
		this.attackTarget = null;
		this.chaseTarget = null;    	
    },
    	
    setState : function(state)
    {
        this._super(state);
		
		// 如果死亡，清空目标
	    if(state == 1) {
			this.clearTarget();
        }
    },

	moveToPosition : function(position)
	{
		this.clearTarget();
		this._super(position);
		this.updateAnim();
	},

    moveToTarget : function(target)
	{
		this.clearTarget();
		this._moveToTarget(target);
	},
		
    _moveToTarget : function(target)
	{
		this.isMoving = true;
		this.stopAllActions();
		this.chaseTarget = target;
		this.updateAnim();
	},
	
	_attack : function(dt)
	{
		if(this.attackTarget == null)
			return;
		
		if(this.state == 1 || this.attackTarget.isDestroyed == true || this.attackTarget.state == 1)
		{
			this.clearTarget();
			return;
		}
		
		this.lastTime += dt;
        var x = this.attackTarget.x - this.x;
        var y = this.attackTarget.y - this.y;
        var t = Math.sqrt(x * x + y * y) / 16;
        
        if(t <= 5)
        {
        	if(this.lastTime > 1.0)
        	{
        		this.setDirection(this.calcDirection(x, y));
        		
        		// 技能ID1为普通攻击技能
        		var player = KBEngine.app.player();
        		if(player != undefined)
        			player.useTargetSkill(1, this.attackTarget.entityID);
        		
        		this.lastTime = 0;
        	}
        }
        else
        {
        	this._moveToTarget(this.attackTarget);
        	this.attackTarget = null;
		}		
	},
		
    /* -----------------------------------------------------------------------/
    							其他系统相关
    /------------------------------------------------------------------------ */
    spriteUpdate : function(dt)
    {
        this._super(dt);
        
        if(this.chaseTarget != null)
        {
			if(this.chaseTarget.isDestroyed == true || this.chaseTarget.state == 1 || this.state == 1)
			{
				this.clearTarget();
				return;
			} 
			
	        var x = this.chaseTarget.x - this.x;
	        var y = this.chaseTarget.y - this.y;
	        var t = Math.sqrt(x * x + y * y) / 16;
            if(t <= 2)
            {
            	this.stop();
            	this.attackTarget = this.chaseTarget;
            	this.chaseTarget = null;
            }
            else
            {
            	this.isMoving = true;
				this._moveToPosition(cc.p(this.chaseTarget.x, this.chaseTarget.y));
			}
		}
		
		this._attack(dt);
    }		
});
