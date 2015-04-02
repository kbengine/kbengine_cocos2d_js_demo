/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.Avatar = KBEngine.GameObject.extend(
{
	__init__ : function()
	{
		this._super();
		
		KBEngine.Event.fire("onAvatarEnterWorld", KBEngine.app.entity_uuid, this.id, this);
  	},
  		
	relive : function(type)
	{
		this.cellCall("relive", type);
  	},
  		
	useTargetSkill : function(skillID, targetID)
	{
		KBEngine.INFO_MSG(this.className + '::useTargetSkill: ' + skillID + ", targetID: " + targetID);
  	},
  		
	jump : function()
	{
		this.cellCall("jump");
  	},  	
  		
	onJump : function()
	{
		KBEngine.INFO_MSG(this.className + '::onJump: ' + this.id); 
		KBEngine.Event.fire("otherAvatarOnJump", this);
  	},    
  		
	onAddSkill : function(skillID)
	{
		KBEngine.INFO_MSG(this.className + "::onAddSkill(" + skillID + ")"); 
		KBEngine.Event.fire("onAddSkill", this);
  	},   

	onRemoveSkill : function(skillID)
	{
		KBEngine.INFO_MSG(this.className + "::onRemoveSkill(" + skillID + ")"); 
		KBEngine.Event.fire("onRemoveSkill", this);
  	},  
  	
	onEnterWorld : function()
	{
		KBEngine.INFO_MSG(this.className + '::onEnterWorld: ' + this.id); 
		this._super();
		
		// 请求获取技能列表
		if(this.isPlayer())
		{
			this.cellCall("requestPull");
		}		
	}
});


