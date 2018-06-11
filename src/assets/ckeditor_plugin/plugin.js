CKEDITOR.config.strinsert_button_label = 'ShortCodes';
CKEDITOR.config.strinsert_button_title = 'Insert content';
CKEDITOR.config.strinsert_button_voice = 'Insert content';

CKEDITOR.plugins.add('strinsert',
{
	requires : ['richcombo'],
	init : function( editor )
	{
		var config = editor.config;
		var strings = config.strinsert_strings;
		editor.ui.addRichCombo('strinsert',
		{
			label: 		config.strinsert_button_label,
			title: 		config.strinsert_button_title,
			voiceLabel: config.strinsert_button_voice,
			toolbar: 'insert',
			className: 	'cke_format',
			multiSelect:false,
			panel:
			{
				css: [CKEDITOR.skin.getPath('editor') ],
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				for(var i=0, len=strings.length; i < len; i++)
				{
					string = strings[i];
					if (!string.value) {
						this.startGroup( string.name );
					}
					else {
						if (!string.name) {
							string.name = string.value;
						}
						if (!string.label) {
							string.label = string.name;
						}
						this.add(string.value, string.name, string.label);
					}
				}
			},

			onClick: function( value )
			{
				editor.focus();
				editor.fire( 'saveSnapshot' );
				editor.insertHtml(value);
				editor.fire( 'saveSnapshot' );
			},
		});
	}
});
