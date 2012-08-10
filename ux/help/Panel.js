/*
 * Help Panel, with associated bells and whistles.
 *
 * Version 0.01.
 *  
 * Copyright (c) 2012 Alexander Tokarev.
 *
 * Usage: see demo application.
 *  
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.help.Panel', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.helppanel',
    
    requires: [
        'Ext.layout.container.Border',
        'Ext.ux.help.Manager',
        'Ext.ux.help.Tree',
        'Ext.ux.help.Pages'
    ],
    
    /**
     * @cfg {String} helpUrl Base URL for help components. May include {0}
     * placeholder for language identifier.
     * Default: '/help/{0}/'
     */
    helpUrl: '/help/{0}/',
    
    /**
     * @cfg {String} imageUrl Base URL for images that are used as tree icons.
     * Default: '/resources/images/'
     */
    imageUrl: '/resources/images/',
    
    /**
     * @cfg {String} contentIndex Name of the content index file.
     * Default: index
     */
    contentIndex: 'index',
    
    /**
     * @cfg {String/String[]} defaultPages Page(s) to load by default.
     */
    defaultPages: 'default',
    
    /**
     * @cfg {String} lang (optional) Language identifier for using with localized
     * setups.
     */
    lang: '',
    
    /**
     * @cfg {String} treeTitle Tree panel title. Default: 'Help contents'.
     */
    treeTitle: 'Help contents',
    
    /**
     * @cfg {String} helpTitle Default help panel title, when help page doesn't have
     * h1 header formatted as 'foo bar\n=======\n'. Default: 'Help page'.
     */
    helpTitle: 'Help page',
    
    /**
     * @cfg {String} loadErrorTitle Title for error message box to display when
     * help page can't be loaded.
     * Default: 'Error loading page'
     */
    loadErrorTitle: 'Error loading page',
    
    /**
     * @cfg {String} loadErrorMsg Message text to display when help page can't be loaded.
     * {0} placeholder, if present, will be replaced with status code, and {1} with status
     * text.
     * Default: 'Help page cannot be loaded: {0} {1}.'
     */
    loadErrorMsg: 'Help page cannot be loaded: {0} {1}.',
    
    /**
     * @cfg {Boolean} autoLoadHelp Load help automatically upon startup. This may not be
     * desirable, so you can turn autoloading off and call loadHelp() manually.
     * Default: true.
     */
    autoLoadHelp: true,
    
    /**
     * @cfg {Int} treeWidth Initial content tree panel width. Default: 250 px.
     */
    treeWidth: 250,
    
    layout: 'border',
    
    initComponent: function() {
        var me = this,
            helpUrl, imageUrl;
        
        me.helpUrl  = me.helpUrl.replace(/\/+$/,  '') + '/';
        me.imageUrl = me.imageUrl.replace(/\/+$/, '') + '/';
        
        /**
         * @property {Ext.ux.help.Tree} tree
         */
        me.tree = me.initHelpTree({
            region: 'west',
            width:  me.treeWidth,
            title:  me.treeTitle,
            split:  true,
            
            helpUrl:      me.helpUrl,
            imageUrl:     me.imageUrl,
            contentIndex: me.contentIndex,
            lang:         me.lang
        });
        me.tree.on('load_page', me.onLoadPage, me);

        /**
         * @property {Ext.ux.help.ContentPanel} pages
         */
        me.pages = me.initHelpPages({
            region: 'center',

            helpUrl:        me.helpUrl,
            helpTitle:      me.helpTitle,
            defaultPages:   me.defaultPages,
            lang:           me.lang,
            loadErrorTitle: me.loadErrorTitle,
            loadErrorMsg:   me.loadErrorMsg
        });
        
        me.items = [ me.tree, me.pages ];
        
        me.callParent();
        
        Ext.ux.help.Manager.helpPanel = me;
        Ext.ux.help.Manager.helpTitle = me.helpTitle;
        
        if ( me.autoLoadHelp ) {
            me.loadHelp();
        };
    },
    
    /**
     * @private
     */
    initHelpTree: function(config) {
        return new Ext.ux.help.Tree(config);
    },
    
    /**
     * @private
     */
    initHelpPages: function(config) {
        return new Ext.ux.help.Pages(config);
    },
    
    /**
     * setLang
     *
     * Set help locale to specified identifier.
     */
    setLang: function(lang) {
        var me = this;
        
        me.lang = me.tree.lang = me.pages.lang = lang;
        
        return me;
    },
    
    /**
     * loadHelp
     *
     * Initialize help Panel, optionally replacing default pages with ones from argument.
     *
     * @param {String/String[]} pages (optional) Pages to load at startup
     */
    loadHelp: function(pages) {
        var me = this;
        
        me.tree.loadTree();
        
        Ext.ux.help.Manager.loadPage(pages || me.defaultPages);
    },
    
    /**
     * @private
     */
    onLoadPage: function(tree, page) {
        Ext.ux.help.Manager.loadPage(page);
    }
});
