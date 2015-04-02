/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.Avatar = KBEngine.GameObject.extend(
{
	__init__ : function()
	{
		this._super();
		
		KBEngine.Event.fire("onAvatarEnterWorld", KBEngine.app.entity_uuid, this.id, this);
  	}
});


