/*
 * Help Panel demo application.
 *
 * Version 0.01.
 *  
 * Copyright (c) 2012 Alexander Tokarev.
 *
 * Usage: see below.
 *  
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.Loader.setConfig({
    enabled:        true,
    disableCaching: true,
    paths: {
        'Ext.ux':  'ux'
    }
});

Ext.require([
    'Ext.container.Viewport',
    'Ext.panel.Panel',
    'Ext.layout.container.Border',
    'Ext.ux.help.Panel'
]);

var viewport, panel, tree, content;

Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();

    viewport = new Ext.container.Viewport({
        layout: 'fit',
        
        items: [{
            xtype:        'helppanel',
            helpUrl:      'help',
            imageUrl:     'resources/images',
            contentIndex: 'index',
            defaultPages: [ 'default', 'intro' ],
            autoLoadHelp: true
        }]
    });
});
