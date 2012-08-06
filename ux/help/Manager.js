/*
 * Help content manager. Dispatches page requests, opens popup windows and
 * serves as global point of entry for <a> tag onclick events.
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

Ext.define('Ext.ux.help.Manager', {
    singleton: true,
    
    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.help.Popup'
    ],
    
    /**
     * @property {Ext.ux.help.Panel} helpPanel Help panel
     */
    helpPanel: null,
    
    /**
     * @private
     */
    getHelpPanel: function() {
        var me = this;
        
        me.helpPanel = me.helpPanel || Ext.ComponentQuery.query('helppanel')[0];
        
        return me.helpPanel;
    },
    
    /**
     * @private
     */
    noContentPanel: function() {
        Ext.Msg.show({
            title:   'Internal Help error',
            msg:     'Cannot display help page: content panel not found.',
            icon:    Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        });
        
        return;
    },
    
    /**
     * @private
     */
    getPageUrl: function(page) {
        var me  = this,
            fmt = Ext.String.format,
            panel, url;
        
        panel = me.getHelpPanel();
        
        if ( !panel ) return me.noContentPanel();
        
        url = fmt(panel.helpUrl, panel.lang).replace(/\/+$/, '') + '/' + page;
        
        return url;
    },
    
    /**
     * loadPage
     *
     * Load single page into (optional) tab panel.
     *
     * @param {String/String[]} page Page id(s) to load
     * @param {Ext.tab.Panel} panel (optional) Tab panel to load pages to.
     */
    loadPage: function(page, panel) {
        var me = this,
            pageTab, url;
            
        panel = panel || me.getHelpPanel().pages;
        
        if ( !panel ) return me.noContentPanel();
        
        if ( Ext.isArray(page) ) {
            for ( var i = 0, l = page.length; i < l; i++ ) {
                me.loadPage(page[i], panel);
            };
            
            return;
        };
        
        pageTab = panel.getPage(page);
        
        if ( pageTab ) {
            panel.setActiveTab(pageTab);
            
            return;
        };
        
        url = me.getPageUrl(page);
        
        Ext.Ajax.request({
            url:     url,
            scope:   me,
            success: me.onPageLoadSuccess,
            failure: me.onLoadFailure,
            pageId:  page
        });
    },
    
    /**
     * popup
     *
     * Open a help page in popup window.
     *
     * @param {Object} params
     * @param {String} .page Page id
     * @param {Ext.Element} .el (optional) Element to align popup window to
     * @param {String} .position (optional) Alignment position. Default: 'bl-tl?'.
     * @param {Ext.EventObject} .event (optional) Event that opens this popup
     */
    popup: function(params) {
        var me = this,
            page, url;
    
        if ( !Ext.isObject(params) ) {
            throw 'Ext.ux.help.Manager.popup() requires named arguments';
        };
        
        page = params.page;
        url  = me.getPageUrl(page);
        
        Ext.Ajax.request({
            url:      url,
            scope:    me,
            success:  me.onPopupLoadSuccess,
            failure:  me.onLoadFailure,
            pageId:   page,
            alignEl:  params.el,
            alignPos: params.position || 'bl-tl?'
        });
    },
    
    onPageLoadSuccess: function(response, options) {
        var me = this,
            panel;
        
        if ( !response || !Ext.isObject(response) ) {
            me.onPageLoadFailure(response, options);
        };
        
        panel = me.getHelpPanel().pages;
        
        if ( !panel ) return me.noContentPanel();
        
        panel.addPage(options.pageId, response.responseText);
    },
    
    onPopupLoadSuccess: function(response, options) {
        var me = this,
            win, alignEl, alignPos;
        
        if ( !response || !Ext.isObject(response) ) {
            me.onPageLoadFailure(response, options);
        };
        
        win = Ext.ComponentQuery.query('window[page="' + options.pageId + '"]')[0];
        
        alignEl  = options.alignEl;
        alignPos = options.alignPos;
        
        if ( win ) {
            win.focus();
        }
        else {
            win = new Ext.ux.help.Popup({
                page:      options.pageId,
                text:      response.responseText,
                helpTitle: me.helpTitle
            });
            
            win.show();
        };

        if ( alignEl ) {
            win.alignTo(alignEl, alignPos);
        };
    },
    
    onLoadFailure: function(response, options) {
        var me     = this,
            code   = response.status,
            status = response.statusText,
            panel, msg;
        
        panel = me.getHelpPanel();
        
        if ( !panel ) return me.noContentPanel();
        
        msg = Ext.String.format(panel.loadErrorMsg, code, status);
        
        Ext.Msg.show({
            title:   panel.loadErrorTitle,
            msg:     msg,
            icon:    Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        });
    }
});
