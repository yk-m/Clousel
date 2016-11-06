# Coding Rule
## Naming
* BEM
	* 名付け方法
	    * block
	    	* block__element
			* block__element--modifier
		* block--modifier
			* block--modifier__element


### Rule
| Target     | Case        |
|:-----------|:------------|
| id         | chain-case  |
| class      | chain-case  |
| mixin      | chain-case  |
| function   | snake_case  |
| variable   | chain-case  |

### Class Prefix
| Layer            | Prefix |
|:-----------------|:-------|
| foundation       | none   |
| layout           | l-     |
| object/utility   | u-     |
| object/component | c-     |
| object/project   | p-     |

## Order
1. variables
2. mixins
3. properties
4. mixins(@content)

### Order of properties
1. ボックスモデルの種類や表示方法を示すプロパティ
    - box-sizing, display, visibility, overflow, float
2. 位置情報に関するプロパティ
    - position, z-index
3. ボックスモデルのサイズに関するプロパティ
    - width, height, margin, padding, border, border-radius
4. フォント関連のプロパティ
    - text-align, vertical-align, line-height, font
5. 色に関するプロパティ
    - color, background
6. それ以外
    - cursor

## Comment
```css
/*
 *  FOO
 *    - Foo
 *    - Bar
 *    - Foo
 */



/*  Foo
   ---------------------------------------- */
$foo: #FFF



/*  Bar
   ---------------------------------------- */
$bar: 2px

/* ----- Bar ----- */
$bar--bar: 3px



/*  Foo
   ---------------------------------------- */

/* ----- Foo bar ----- */
$foo-bar: 4px

/* ----- Bar ----- */
/*  Foo  */
$bar--foo: 5px

/*  Bar bar  */
$bar--bar-bar: 6px
```