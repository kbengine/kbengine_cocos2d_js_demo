/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.GameObject = KBEngine.Entity.extend(
{	
	__init__ : function()
	{
		this._super();
  	},
  	
  	/*
  		以下函数是实体的属性被设置时插件底层调用
  		set_属性名称(), 想监听哪个属性就实现改函数，事件触发后由于world.js中监听了该事件，world.js会取出数据做行为表现。
  		
  		实际下列函数可以再抽象出一些层次 
  		例如Combat.js对应服务端demo中的kbengine_demos_assets\scripts\cell\interfaces\Combat.py|CombatPropertys.py, 
  		像HP、MP、recvDamage都属于战斗相关
  		
  		set_state可以放到State.js对应服务端的State.py
  		这里请原谅我偷个懒， 全部放在逻辑实体基础对象了
  	*/
  	
	set_HP : function(old)
	{
		KBEngine.Event.fire("set_HP", this, this.HP);
	},
	
	set_MP : function(old)
	{
		KBEngine.Event.fire("set_MP", this, this.MP);
	},
	
	set_HP_Max : function(old)
	{
		KBEngine.Event.fire("set_HP_Max", this, this.HP_Max);
	},
	
	set_MP_Max : function(old)
	{
		KBEngine.Event.fire("set_MP_Max", this, this.MP_Max);
	},
	
	set_level : function(old)
	{
		KBEngine.Event.fire("set_level", this, this.level);
	},
	
	set_name : function(old)
	{
		KBEngine.Event.fire("set_name", this, this.name);
	},
	
	set_state : function(old)
	{
		KBEngine.Event.fire("set_state", this, this.state);
	},
	
	set_subState : function(old)
	{
	},
	
	set_utype : function(old)
	{
	},
	
	set_uid : function(old)
	{
	},
	
	set_spaceUType : function(old)
	{
	},
	
	set_moveSpeed : function(old)
	{
		KBEngine.Event.fire("set_moveSpeed", this, this.moveSpeed);
	},
	
	set_modelScale : function(old)
	{
		KBEngine.Event.fire("set_modelScale", this, this.modelScale);
	},
	
	set_modelID : function(old)
	{
		KBEngine.Event.fire("set_modelID", this, this.modelID);
	},
	
	set_forbids : function(old)
	{
	},
	
	recvDamage : function(attackerID, skillID, damageType, damage)
	{
		var entity = KBEngine.app.findEntity(attackerID);
		KBEngine.Event.fire("recvDamage", this, entity, skillID, damageType, damage);
	}
});

