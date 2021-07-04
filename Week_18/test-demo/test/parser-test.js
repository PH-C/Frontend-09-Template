var assert = require('assert');
import { parseHTML } from '../parser.js';

describe('parse html:', function() {
    it('<a></a>', function () {
        let tree = parseHTML('<a></a>')
        assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a>abc</a>', function () {
        let tree = parseHTML('<a>abc</a>')
        assert.strictEqual(tree.children[0].tagName, 'a');
        assert.strictEqual(tree.children[0].children[0].content, 'abc');
    })
    it('<a href="//time.geekbang.org"></a>', function () {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>')
        console.log(tree)
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })    
    it('<a href></a>', function () {
        let tree = parseHTML('<a href></a>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })      
    it('<a href id></a>', function () {
        let tree = parseHTML('<a href id></a>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })   
    it('<a href="abc" id></a>', function () {
        let tree = parseHTML('<a href="abc" id></a>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })    
    it('<a href=abc></a>', function () {
        let tree = parseHTML('<a href=abc></a>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })      
    it('<a href=abc/>', function () {
        let tree = parseHTML('<a href=abc/>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a href=\'abc\'/>', function () {
        let tree = parseHTML('<a href=\'abc\'/>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })    
    it('<a />', function () {
        let tree = parseHTML('<a />')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })        
    it('<A /> upper case', function () {
        let tree = parseHTML('<A />')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })   
    it('<>', function () {
        let tree = parseHTML('<>')
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })     
    it('rich test case', function () {
        parseHTML(`<html maaa=a >
        <head>
          <style>
            body div #myid {
              width: 100px;
              background-color: #ff5000;
            }
            body div img {
              width: 30px;
              background-color: #ff1111;
            }
            body div .cute {
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div>
            <img id="myid" />
            <img />
            <img class="cute"/>
          </div>
        </body>
      </html>`)
    })         
})