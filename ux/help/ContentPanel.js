/*
 * @private Help content panel.
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

Ext.define('Ext.ux.help.ContentPanel', {
    extend: 'Ext.panel.Panel',
    
    requires: [
        'Ext.util.Format'
    ],
    
    /**
     * @cfg {String} helpTitle Default help page title.
     */
    
    bodyCls:     'ux-help',
    bodyPadding: 8,
    closable:    true,
    autoScroll:  true,
    
    initComponent: function() {
        var me = this,
            title, text, converted;
        
        text = me.text;
        delete me.text;
        
        converted = me.convertText(text);
        
        me.title = converted.title || me.helpTitle;
        me.html  = converted.html;
        
        me.callParent();
    },
    
    convertText: function(text) {
        var me     = this,
            result = {},
            converter, html, match, href;

        converter = new Markdown.Converter();
        
        // Extract page title, if any
        if ( match = /^(.*?)\n[=]+\n/.exec(text) ) {
            result.title = Ext.util.Format.stripTags(match[1]);
            text = text.replace(/^(.*?)\n[=]+\n+/, '');
        };
        
        // Markdown processing mungles all URLs, so we add placeholders
        // at first stage, and then replace them with actual JavaScript later
        text = text.replace(/\[(.*?)\]\(\^([^)]+)\)/g, '[$1](_ux_help_load_page_$2)'  );
        text = text.replace(/\[(.*?)\]\(>([^)]+)\)/g,  '[$1](_ux_help_load_popup_$2)' );
        text = text.replace(/!\[(.*?)\]\(!([^(]+)\)/g, '![$1](_ux_help_insert_img_$2)');
        
        html = converter.makeHtml(text);
        
        html = html.replace(/"_ux_help_load_page_([^"]+)"/g,
                            '"javascript:Ext.ux.help.Manager.loadPage(\'$1\')"'
                           );
        
        html = html.replace(/href="_ux_help_load_popup_([^"]+)"/g,
                            [
                                'href="#" ',
                                'onclick="',
                                    '(function(event) {',
                                        'var ev = new Ext.EventObjectImpl(event),',
                                            'el = new Ext.Element(ev.getTarget());',
                                        
                                        'Ext.ux.help.Manager.popup({',
                                            "page: '$1',",
                                            'el: el,',
                                            'event: ev',
                                        '});',
                                        'return false;',
                                    '})(event)',
                                '"'
                            ].join('')
                           );
        
        html = html.replace(/"_ux_help_insert_img_([^"]+)"/g,
                            '"' + me.baseUrl + '$1"'
                           );
        
        result.html = html;
        
        return result;
    }
});
