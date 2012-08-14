/*
 * @private Tab panel for help pages.
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

Ext.define('Ext.ux.help.Pages', {
    extend: 'Ext.tab.Panel',
    
    requires: [
        'Ext.Ajax',
        'Ext.window.MessageBox',
        'Ext.ux.help.ContentPanel'
    ],
    
    getPage: function(page) {
        var me = this;
        
        return me.query('panel[pageId="' + page + '"]')[0];
    },
    
    addPage: function(page, text) {
        var me = this,
            panel, baseUrl;
        
        baseUrl = Ext.String.format(me.helpUrl, me.lang).replace(/\/+$/, '/');
        
        panel = new Ext.ux.help.ContentPanel({
            baseUrl:   baseUrl,
            
            pageId:    page,
            text:      text,
            helpTitle: me.helpTitle
        });
        
        me.add(panel);
        me.setActiveTab(panel);
    }
});
