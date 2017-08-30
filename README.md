# Suggest Apps plugin
Autocomplete suggest apps plugin with javascript

# Usage

* Define input element for search
```html
<input class="suggest-plugin" type="text" name="apps" value="" />
```
* Include <code>suggest-plugin.js</code> in your html <code>head</code>
```html
<script src="js/suggest-plugin.js"></script>
```

* Prepare source data with javascript
```js
var APP_DATA = [
  {
    "id": "5",
    "name": "Google Chrome",
    "thumbnailUrl": "image/chrome.png"
  },
  {
    "id": "1",
    "name": "Facetime",
    "thumbnailUrl": "image/facetime.png"
  },
];
```

* Call plugin
```js
var SuggestPlugin = new SuggestPlugin({
    selector    : 'input.suggest-plugin',
    source      : APP_DATA
});
```

* Options
   * **selector** : DOM element.
   * **source**   : Source data for searching.
   * **minChars** : Coming soon
   * **containerClass** : Coming soon
   * **suggestItemClass**: Coming soon