/*
 * @private Help index Model.
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

Ext.define('Ext.ux.help.Model', {
    extend: 'Ext.data.Model',
    
    statics: {
    
        /**
         * @cfg {String} imageUrl Path to directory containing images to be used
         * as icons. Default: '/resources/images/'.
         */
        imageUrl: '/resources/images/'
    },
    
    fields: [{
        name: 'path', type: 'string'
    }, {
        name: 'text', type: 'text'
    }, {
        name: 'children', convert: null
    }, {
        name: 'leaf',
        convert: function(v, rec) {
            return !rec.get('children');
        }
    }, {
        name: 'icon',
        type: 'string',
        convert: function(v, rec) {
            return rec.get('leaf') ? Ext.ux.help.Model.imageUrl + 'book-question.png'
                 :                   undefined
                 ;
        }
    }]
});
