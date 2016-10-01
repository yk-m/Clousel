# Coding Rule
## Naming
### Practice of writing
| Target     | Practice of writing |
|:-----------|:------------|
| id         | chain-case  |
| class      | chain-case  |
| mixin      | chain-case  |
| function   | snake_case  |
| variable   | chain-case  |

### Prefix
| Layer      | Prefix |
|:-----------|:------------|
| id         | chain-case  |
| class      | chain-case  |
| mixin      | chain-case  |
| function   | snake_case  |
| variable   | chain-case  |

## Order
1. variables
2. mixins
3. properties
4. mixins(@content)

### Order of properties
1. ボックスモデルの種類や表示方法を示すプロパティ
    - box-sizing, display, visibility, float
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