/*
 * @private Help index Tree.
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

Ext.define('Ext.ux.help.Tree', {
    extend: 'Ext.tree.Panel',
    
    requires: [
        'Ext.data.TreeStore',
        'Ext.ux.help.Model'
    ],
    
    rootVisible: false,
    
    store: {
        model:    'Ext.ux.help.Model',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url:  ''
        }
    },
    
    constructor: function(config) {
        var me = this;
        
        Ext.apply(me, config);
        
        Ext.ux.help.Model.imageUrl = me.imageUrl;
        
        me.callParent(arguments);
        
        me.addEvents(
            /**
             * @event load_page
             *
             * Fires when user requests page load by clicking leaf node in the tree.
             *
             * @param {Ext.ux.help.Tree} this Help Tree
             * @param {String} page Page id
             */
            'load_page'
        );
    },
    
    initComponent: function() {
        var me = this;
        
        // Ext.tree.Panel is very rigid; it attempts to load TreeStore
        // regardless of whether we're ready for it or not. So we fool it.
        me.dontSetRoot = true;
        
        me.listeners = Ext.apply(me.listeners || {}, {
            scope:     me,
            itemclick: me.onItemClick
        });
        
        me.callParent();
        
        delete me.dontSetRoot;
    },
    
    setRootNode: function() {
        var me = this;
        
        if ( me.dontSetRoot ) return;
        
        me.callParent();
    },
    
    loadTree: function() {
        var me = this,
            fmt = Ext.String.format;
        
        me.store.setProxy({
            type: 'ajax',
            url:  fmt(me.helpUrl, me.lang) + me.contentIndex
        });
        
        me.store.load();
    },
    
    onItemClick: function(view, node, el, index) {
        var me = this,
            path;
        
        if ( path = node.get('path') ) {
            me.fireEvent('load_page', me, path);
        };
    }
});
