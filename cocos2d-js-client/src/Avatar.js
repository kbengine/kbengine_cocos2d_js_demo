/*
	玩家实体类，继承于ActionEntity
	与ActionEntity主要的区别是实体由客户端控制
*/
var Avatar = ActionEntity.extend(
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
    	
    setState : function(state)
    {
        this._super(state);
		
		// 如果死亡，清空目标
	    if(state == 1) {
            this.chaseTarget = null;
        }
    },
    	    	
    moveToTarget : function(target)
	{
		this.isMoving = true;
		this.stopAllActions();
		this.chaseTarget = target;
		this.updateAnim();
	},
	
	attack : function(dt)
	{
		if(this.attackTarget == null)
			return;
		
		if(this.state == 1 || this.attackTarget.isDestroyed == true || this.attackTarget.state == 1)
		{
			this.attackTarget = null;
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
        		// 技能ID1为普通攻击技能
        		var player = KBEngine.app.player();
        		if(player != undefined)
        			player.useTargetSkill(1, this.attackTarget.entityID);
        		
        		this.lastTime = 0;
        	}
        }
        else
        {
        	this.moveToTarget(this.attackTarget);
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
			if(this.chaseTarget.isDestroyed == true || this.state == 1)
			{
				this.chaseTarget = null;
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
				this.moveToPosition(cc.p(this.chaseTarget.x, this.chaseTarget.y));
			}
		}
		
		this.attack(dt);
    }		
});
