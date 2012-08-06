/*
 * @private Help popup window.
 *
 * Copyright (c) 2012 Alexander Tokarev.
 *
 * This component should not be used directly.
 *  
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.help.Popup', {
    extend: 'Ext.window.Window',
    alias:  'widget.helppopup',
    
    requires: [
        'Ext.ux.help.ContentPanel'
    ],
    
    /**
     * @cfg {String} page Page id
     */
    
    /**
     * @cfg {String} text Page text
     */
    
    width:  400,
    height: 300,
    
    layout:   'fit',
    closable: true,
    modal:    false,
    
    initComponent: function() {
        var me = this,
            panel;
        
        panel = me.panel = new Ext.ux.help.ContentPanel({
            text:      me.text,
            helpTitle: me.helpTitle
        });
        
        if ( panel.title ) {
            me.title = panel.title;
            delete panel.title;
        };
        
        panel.header = false;
        
        me.items = [ panel ];
        
        me.callParent();
    }
});
